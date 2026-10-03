<?php
/* Комікс·Lab — 🩺 діагностика розгортання (напряму не відкривається, лише з admin.php).
 *
 * Відповідає на одне питання: «чи все я зробив правильно?» — після заливання нової
 * збірки, після зміни налаштувань, перед випуском застосунку. Кожна перевірка каже
 * не лише «так/ні», а й що саме зробити, якщо ні.
 *
 * Правило: жодна перевірка не показує паролів, ключів чи адрес поштових скриньок —
 * тільки «задано / не задано». Сторінку бачить адміністратор, але й у нього немає
 * причин читати секрети з екрана, який можна випадково показати чи зняти.
 */
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(404); exit; }

const DIAG_OK = 'ok';       // все правильно
const DIAG_WARN = 'warn';   // працює, але варто виправити
const DIAG_BAD = 'bad';     // зламано або небезпечно
const DIAG_SKIP = 'skip';   // перевірити не вдалося (немає інструмента)

/** Корінь сайту на диску — тека, де лежать index.html і admin.php. */
function diag_root(): string { return dirname(__DIR__); }

/** Робоча копія на комп'ютері розробника, а не бойовий сервер. */
function diag_is_local(): bool {
  return (bool)preg_match('~^https?://(localhost|127\.0\.0\.1|\[::1\])~', site_url());
}

/** На робочій копії знижуємо вердикт до «не стосується» — там інші правила гри. */
function diag_only_live(array $item, string $why = 'перевіряється на бойовому сервері'): array {
  if (!diag_is_local() || $item['level'] === DIAG_OK) return $item;
  return ['title' => $item['title'], 'level' => DIAG_SKIP, 'value' => $why, 'fix' => ''];
}

function diag_item(string $title, string $level, string $value, string $fix = ''): array {
  return ['title' => $title, 'level' => $level, 'value' => $value, 'fix' => $fix];
}

/* Запит до власного сайту: єдиний спосіб дізнатися, що саме віддає сервер стороннім.
   Права доступу у файлах і правила .htaccess можна прочитати, але лише справжній
   запит покаже, чи вони працюють. Без cURL перевірку чесно позначаємо як пропущену. */
function diag_fetch(string $path, string $method = 'GET', array $headers = []): ?array {
  if (!function_exists('curl_init')) return null;
  $url = site_url() . ltrim($path, '/');
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_NOBODY => $method === 'HEAD',
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_TIMEOUT => 8,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_USERAGENT => 'Komiks-Lab-Diag/1.0',
  ]);
  $raw = curl_exec($ch);
  if ($raw === false) { curl_close($ch); return null; }
  $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $hlen = (int)curl_getinfo($ch, CURLINFO_HEADER_SIZE);
  curl_close($ch);
  return ['code' => $code, 'headers' => strtolower(substr((string)$raw, 0, $hlen)), 'body' => substr((string)$raw, $hlen)];
}

/** Читає реєстр data/index.js як звичайний текст — без JS-рушія, лише регулярними. */
function diag_registry(): array {
  $f = diag_root() . '/data/index.js';
  if (!is_file($f)) return ['version' => '', 'files' => []];
  $src = (string)file_get_contents($f);
  preg_match('/["\']?version["\']?\s*:\s*["\']([^"\']+)["\']/', $src, $m);
  preg_match_all('/["\']((?:data|assets|game)\/[^"\']+\.(?:js|html))["\']/', $src, $mm);
  return ['version' => $m[1] ?? '', 'files' => array_values(array_unique($mm[1] ?? []))];
}

/* ───────────────────────── 1. Безпека ───────────────────────── */
function diag_security(): array {
  $r = [];
  $root = diag_root();

  $r[] = diag_only_live(is_file($root . '/install.php')
    ? diag_item('Інсталятор видалено', DIAG_BAD, 'install.php лежить на сервері',
        'Видаліть comiks/install.php негайно: через нього можна перестворити адміністратора.')
    : diag_item('Інсталятор видалено', DIAG_OK, 'install.php немає'));

  $cfg = is_file(__DIR__ . '/config.php') ? __DIR__ . '/config.php' : __DIR__ . '/config.local.php';
  if (is_file($cfg)) {
    $perm = (int)substr(sprintf('%o', fileperms($cfg)), -3, 3);
    $world = $perm % 10;                       // права «для всіх»
    $r[] = diag_only_live($world === 0
      ? diag_item('Права на config.php', DIAG_OK, '0' . $perm . ' — чужі не читають')
      : diag_item('Права на config.php', $world >= 6 ? DIAG_BAD : DIAG_WARN, '0' . $perm,
          'Поставте 0640 або 0600: chmod 640 api/config.php. Зараз файл із паролями читає будь-хто на сервері.'),
      'права файлів перевіряються на сервері');
  } else {
    $r[] = diag_item('Налаштування', DIAG_BAD, 'config.php не знайдено', 'Створіть api/config.php зі зразка config.sample.php.');
  }

  $secret = (string)cfg('secret');
  $weak = $secret === '' || strlen($secret) < 32 || str_contains($secret, 'ЗАМІНІТЬ');
  $r[] = $weak
    ? diag_item('Секретний рядок', DIAG_BAD, strlen($secret) . ' символів',
        'Замініть secret в api/config.php на випадковий рядок з 64 символів. Ним підписуються сесії й капча.')
    : diag_item('Секретний рядок', DIAG_OK, 'задано, ' . strlen($secret) . ' символів');

  $https = str_starts_with(site_url(), 'https://');
  $r[] = diag_only_live($https
    ? diag_item('HTTPS', DIAG_OK, 'адреса сайту через https')
    : diag_item('HTTPS', DIAG_BAD, 'site_url без https',
        'Увімкніть SSL у hPanel і виправте site_url. Без https кука сесії йде відкритим текстом.'));

  $r[] = diag_only_live(ini_get('display_errors')
    ? diag_item('Показ помилок PHP', DIAG_BAD, 'display_errors увімкнено',
        'Вимкніть display_errors у hPanel → PHP Configuration. Тексти помилок показують шляхи й запити до бази.')
    : diag_item('Показ помилок PHP', DIAG_OK, 'вимкнено — помилки лише в журнал'));

  $php = PHP_VERSION;
  $r[] = version_compare($php, '8.1', '>=')
    ? diag_item('Версія PHP', DIAG_OK, $php)
    : diag_item('Версія PHP', DIAG_WARN, $php, 'Підніміть PHP до 8.1+ у hPanel: старіші гілки вже без оновлень безпеки.');

  $ht = __DIR__ . '/.htaccess';
  $htOk = is_file($ht) && str_contains((string)file_get_contents($ht), 'Require all denied');
  $r[] = $htOk
    ? diag_item('Захист api/.htaccess', DIAG_OK, 'службові файли закриті')
    : diag_item('Захист api/.htaccess', DIAG_BAD, 'файла немає або він порожній',
        'Поверніть api/.htaccess зі збірки: без нього lib.php і config.php віддаються напряму.');

  $rootHt = $root . '/.htaccess';
  $r[] = is_file($rootHt) && str_contains((string)file_get_contents($rootHt), 'X-Content-Type-Options')
    ? diag_item('Захист .htaccess у корені', DIAG_OK, 'заголовки й закриті теки')
    : diag_item('Захист .htaccess у корені', DIAG_WARN, 'файла немає',
        'Залийте .htaccess зі збірки: він вимикає перегляд тек і додає заголовки безпеки до сторінок.');

  // Службові теки, яким не місце на бойовому сервері
  $junk = array_values(array_filter(['tools', 'tests', '_private', 'node_modules'], fn($d) => is_dir($root . '/' . $d)));
  $r[] = diag_only_live($junk
    ? diag_item('Зайві теки', DIAG_WARN, implode(', ', $junk),
        'Видаліть їх із сервера — це робочі файли, сайту вони не потрібні: rm -rf comiks/' . $junk[0])
    : diag_item('Зайві теки', DIAG_OK, 'лише те, що потрібно сайту'));

  $nAdmins = 0;
  try { $nAdmins = (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE is_admin = 1 AND blocked_at IS NULL')['n'] ?? 0); } catch (Throwable $e) {}
  $r[] = $nAdmins === 1
    ? diag_item('Адміністратори', DIAG_OK, 'один — як і має бути')
    : diag_item('Адміністратори', $nAdmins === 0 ? DIAG_BAD : DIAG_WARN, (string)$nAdmins,
        $nAdmins === 0 ? 'Жодного адміністратора: доступ до панелі втрачено.' : 'Зніміть зайві права: 👥 Користувачі → фільтр «Адміністратори».');

  return $r;
}

/* ─────────────── 2. Що сервер віддає стороннім ─────────────── */
function diag_exposure(): array {
  $r = [];
  if (!function_exists('curl_init')) {
    return [diag_item('Перевірка ззовні', DIAG_SKIP, 'на сервері немає cURL',
      'Перевірте вручну: api/config.php, api/data/ і api/lib.php мають віддавати 403.')];
  }

  // Закрите має бути закрите. 200 тут — це витік.
  foreach ([
    'api/config.php' => 'Налаштування з паролями',
    'api/lib.php' => 'Код бібліотеки',
    'api/data/secret.php' => 'Службові дані',
    'api/data/uploads/' => 'Вкладення відгуків',
  ] as $path => $title) {
    $res = diag_fetch($path);
    if ($res === null) { $r[] = diag_item($title, DIAG_SKIP, 'запит не вдався'); continue; }
    $r[] = in_array($res['code'], [403, 404], true)
      ? diag_item($title, DIAG_OK, 'закрито (' . $res['code'] . ')')
      : diag_item($title, DIAG_BAD, 'віддається, код ' . $res['code'],
          'Перевірте api/.htaccess — саме він має закривати ' . $path . '.');
  }

  /* health.php мусить відкриватися (ним перевіряють деплой), але стороннім —
     без подробиць. Перевіряємо справжнім запитом без куки: якщо звідси видно
     версію PHP, номер схеми чи кількість людей у базі — це готова карта для злому. */
  $hp = diag_fetch('api/health.php');
  if ($hp === null) {
    $r[] = diag_item('health.php стороннім', DIAG_SKIP, 'запит не вдався');
  } else {
    $leaks = [];
    foreach (['php' => 'версія PHP', 'schema' => 'версія схеми', 'users' => 'кількість людей',
              'admins' => 'кількість адмінів', 'config_keys' => 'склад конфіга',
              'mail' => 'налаштування пошти', 'installer' => 'наявність install.php'] as $k => $what) {
      if (preg_match('~"' . $k . '"\s*:~', $hp['body'])) $leaks[] = $what;
    }
    $r[] = $leaks
      ? diag_item('health.php стороннім', DIAG_BAD, 'видно ' . implode(', ', $leaks),
          'Залийте свіжий api/health.php зі збірки: подробиці має бачити лише адміністратор.')
      : diag_item('health.php стороннім', DIAG_OK, 'лише «живий / не живий»');
  }

  // Відкрите має відкриватися
  $home = diag_fetch('index.html');
  $r[] = $home && $home['code'] === 200
    ? diag_item('Головна сторінка', DIAG_OK, 'відкривається')
    : diag_item('Головна сторінка', DIAG_BAD, $home ? 'код ' . $home['code'] : 'немає відповіді',
        'Сайт не віддає index.html — перевірте, чи розпакувався архів у потрібну теку.');

  // Заголовки безпеки на звичайній сторінці
  if ($home) {
    $miss = [];
    foreach (['x-content-type-options' => 'nosniff', 'referrer-policy' => ''] as $h => $need) {
      if (!str_contains($home['headers'], $h . ':')) $miss[] = $h;
    }
    $r[] = $miss
      ? diag_item('Заголовки безпеки', DIAG_WARN, 'немає: ' . implode(', ', $miss),
          'Додайте їх у .htaccess кореня сайту — вони заважають браузеру «вгадувати» тип файлу.')
      : diag_item('Заголовки безпеки', DIAG_OK, 'на місці');
  }

  // Лістинг каталогів: сервер не має показувати вміст тек
  $ls = diag_fetch('assets/');
  if ($ls) {
    $listing = $ls['code'] === 200 && preg_match('~index of|<a href="[^"]+\.js"~i', $ls['body']);
    $r[] = $listing
      ? diag_item('Перегляд тек', DIAG_WARN, 'сервер показує список файлів',
          'Додайте «Options -Indexes» у .htaccess кореня сайту.')
      : diag_item('Перегляд тек', DIAG_OK, 'список файлів закрито');
  }

  // CORS для мобільного застосунку: без нього вхід у застосунку не тримається
  $pre = diag_fetch('api/auth.php', 'OPTIONS', ['Origin: https://localhost', 'Access-Control-Request-Method: POST']);
  if ($pre === null) $r[] = diag_item('CORS для застосунку', DIAG_SKIP, 'запит не вдався');
  else {
    $okCors = $pre['code'] === 204 && str_contains($pre['headers'], 'access-control-allow-credentials: true');
    $r[] = $okCors
      ? diag_item('CORS для застосунку', DIAG_OK, 'дозволено, код 204')
      : diag_item('CORS для застосунку', DIAG_BAD, 'код ' . $pre['code'],
          'Залийте свіжий api/lib.php. Без цього вхід у мобільному застосунку не зберігається.');
  }

  return $r;
}

/* ───────────── 3. Чи повністю залилася збірка ───────────── */
function diag_build(): array {
  $r = [];
  $root = diag_root();
  $reg = diag_registry();

  $r[] = $reg['version'] !== ''
    ? diag_item('Версія збірки', DIAG_OK, $reg['version'])
    : diag_item('Версія збірки', DIAG_BAD, 'не знайдено', 'Немає data/index.js або він пошкоджений — залийте збірку заново.');

  // Найчастіша біда часткового заливання: код новий, а кеш браузера тримає старе.
  $sw = is_file($root . '/sw.js') ? (string)file_get_contents($root . '/sw.js') : '';
  preg_match("/komiks-([\w-]+)/", $sw, $m);
  $swVer = $m[1] ?? '';
  if ($swVer === '') {
    $r[] = diag_item('Кеш service worker', DIAG_BAD, 'імені кешу немає', 'Залийте sw.js зі збірки.');
  } else {
    $r[] = diag_only_live($swVer === $reg['version']
      ? diag_item('Кеш service worker', DIAG_OK, 'збігається з версією збірки')
      : diag_item('Кеш service worker', DIAG_BAD, 'sw.js: ' . $swVer . ', дані: ' . $reg['version'],
          'Залилося не все. Відвідувачі бачитимуть суміш старого й нового — залийте dist/ повністю.'),
      'у робочій копії версію проставляє збірка');
  }

  foreach (['index.html', 'assets/boot.js', 'assets/app.js', 'assets/style.css', 'manifest.webmanifest', 'robots.txt', 'sitemap.xml'] as $f) {
    if (!is_file($root . '/' . $f)) { $r[] = diag_item('Файл ' . $f, DIAG_BAD, 'немає', 'Залийте dist/ повністю.'); }
  }

  // Кожен файл із реєстру має справді лежати на диску
  $missing = array_values(array_filter($reg['files'], fn($f) => !is_file($root . '/' . $f)));
  $r[] = $missing
    ? diag_item('Файли з реєстру', DIAG_BAD, count($missing) . ' з ' . count($reg['files']) . ' немає: ' . implode(', ', array_slice($missing, 0, 4)) . (count($missing) > 4 ? '…' : ''),
        'Сайт спробує їх завантажити й зупиниться. Залийте збірку ще раз — цього разу до кінця.')
    : diag_item('Файли з реєстру', DIAG_OK, count($reg['files']) . ' на місці');

  // Озвучення: без нього комікси німі
  $audioDir = $root . '/audio';
  if (!is_dir($audioDir)) {
    $r[] = diag_item('Озвучення', DIAG_BAD, 'теки audio немає', 'Залийте dist/audio (це найважча частина, ~158 МБ).');
  } else {
    $list = @scandir($audioDir) ?: [];
    $n = max(0, count($list) - 2);
    $r[] = $n > 9000
      ? diag_item('Озвучення', DIAG_OK, number_format($n, 0, '.', ' ') . ' файлів')
      : diag_item('Озвучення', DIAG_WARN, number_format($n, 0, '.', ' ') . ' файлів',
          'Схоже, аудіо залилося не повністю — має бути понад 10 000. Частина реплік буде німою.');

    // Вибірка з реального покажчика: чи справді ці файли є
    $manifest = $root . '/data/audio.js';
    if (is_file($manifest)) {
      preg_match_all('/"([0-9a-f]{16})"/', (string)file_get_contents($manifest), $mm);
      $ids = array_slice(array_unique($mm[1] ?? []), 0, 400);
      $lost = 0;
      foreach ($ids as $id) if (!is_file($audioDir . '/' . $id . '.mp3')) $lost++;
      $r[] = $lost === 0
        ? diag_item('Перевірка озвучень', DIAG_OK, 'вибірка з ' . count($ids) . ' файлів — усі на місці')
        : diag_item('Перевірка озвучень', DIAG_BAD, $lost . ' з ' . count($ids) . ' немає',
            'Аудіо залилося частково. Перезалийте теку audio.');
    }
  }

  // Коли востаннє оновлювали сайт
  $t = @filemtime($root . '/data/index.js') ?: 0;
  $r[] = diag_item('Останнє оновлення', DIAG_OK, $t ? date('d.m.Y H:i', $t) : '—');

  return $r;
}

/* ───────────────────── 4. База даних ───────────────────── */
function diag_db(): array {
  $r = [];
  try {
    $pdo = db();
    $drv = (string)$pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $ver = (string)$pdo->getAttribute(PDO::ATTR_SERVER_VERSION);
    $r[] = diag_item('З\'єднання', DIAG_OK, $drv . ' ' . $ver);
    if ($drv === 'sqlite') {
      $r[] = diag_only_live(diag_item('Тип бази', DIAG_WARN, 'SQLite',
        'На бойовому сервері має бути MySQL: перевірте db.dsn в api/config.php.'),
        'SQLite — звичайна справа для робочої копії');
    }
  } catch (Throwable $e) {
    return [diag_item('З\'єднання', DIAG_BAD, 'немає', 'Перевірте db.dsn, db.user і db.pass в api/config.php.')];
  }

  $schema = (int)(one("SELECT v FROM kl_meta WHERE k = 'schema'")['v'] ?? 0);
  $r[] = $schema === SCHEMA_VERSION
    ? diag_item('Схема бази', DIAG_OK, 'v' . $schema . ' — найсвіжіша')
    : diag_item('Схема бази', $schema > 0 ? DIAG_WARN : DIAG_BAD, 'v' . $schema . ', код очікує v' . SCHEMA_VERSION,
        'Відкрийте будь-яку сторінку сайту — оновлення схеми виконається саме. Якщо не змінилося, у користувача бази бракує прав на ALTER TABLE.');

  $users = (int)(one('SELECT COUNT(*) AS n FROM kl_users')['n'] ?? 0);
  $r[] = diag_item('Користувачі', DIAG_OK, (string)$users);

  return $r;
}

/* ─────────────── 5. Пошта, оплата, місце на диску ─────────────── */
function diag_services(): array {
  $r = [];

  $bad = mail_problems();
  $r[] = diag_only_live($bad
    ? diag_item('Пошта', DIAG_WARN, implode('; ', array_slice($bad, 0, 2)),
        'Листи підтвердження й відновлення пароля не дійдуть. Виправте розділ mail в api/config.php.')
    : diag_item('Пошта', DIAG_OK, 'налаштована'),
    'локально листи пишуться у файли');

  $lastErr = (string)meta_get('mail_last_error', '');
  if ($lastErr !== '') {
    $r[] = diag_item('Остання відправка', DIAG_WARN, mb_substr($lastErr, 0, 90),
      'Перевірте пароль скриньки та щоб поле from дорівнювало user.');
  }

  $r[] = stripe_ready()
    ? diag_item('Оплата', DIAG_OK, str_contains(stripe_key('secret'), '_live_') ? 'бойовий режим' : 'тестовий режим')
    : diag_item('Оплата', DIAG_OK, 'не використовується — навчання безкоштовне');

  $up = __DIR__ . '/data';
  $r[] = is_writable($up)
    ? diag_item('Запис у api/data', DIAG_OK, 'дозволено')
    : diag_item('Запис у api/data', DIAG_BAD, 'заборонено',
        'Без цього не працюють вкладення відгуків і обмеження частоти: chmod 750 api/data.');

  $free = @disk_free_space(diag_root());
  if ($free !== false) {
    $gb = $free / 1073741824;
    $r[] = $gb > 1
      ? diag_item('Вільне місце', DIAG_OK, number_format($gb, 1) . ' ГБ')
      : diag_item('Вільне місце', DIAG_BAD, number_format($gb, 2) . ' ГБ',
          'Місце закінчується — нова збірка не заллється, а база може зупинитися.');
  }

  return $r;
}

/** Повний прогін. Повертає групи перевірок і загальний підсумок. */
function diag_run(): array {
  $t0 = microtime(true);
  $groups = [
    ['id' => 'security', 'title' => '🔒 Безпека', 'hint' => 'Те, що захищає паролі учасників і доступ до панелі.', 'items' => diag_security()],
    ['id' => 'exposure', 'title' => '🌐 Що видно ззовні', 'hint' => 'Справжні запити до сайту: що сервер віддає сторонньому відвідувачу.', 'items' => diag_exposure()],
    ['id' => 'build', 'title' => '📦 Збірка', 'hint' => 'Чи залилося все і чи не змішалося старе з новим.', 'items' => diag_build()],
    ['id' => 'db', 'title' => '🗄️ База даних', 'hint' => 'З\'єднання, версія схеми, обсяг.', 'items' => diag_db()],
    ['id' => 'services', 'title' => '⚙️ Служби', 'hint' => 'Пошта, оплата, місце на диску.', 'items' => diag_services()],
  ];
  $n = [DIAG_OK => 0, DIAG_WARN => 0, DIAG_BAD => 0, DIAG_SKIP => 0];
  foreach ($groups as $g) foreach ($g['items'] as $i) $n[$i['level']] = ($n[$i['level']] ?? 0) + 1;
  return ['groups' => $groups, 'count' => $n, 'ms' => (int)round((microtime(true) - $t0) * 1000)];
}
