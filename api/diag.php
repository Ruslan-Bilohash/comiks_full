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

/* ═══════════════════════ 6. Живі перевірки API ═══════════════════════
   Кожна служба перевіряється справжнім, але безкоштовним запитом: список моделей замість
   генерації, вхід у скриньку без листа, обмін «неправильного» коду в Google, баланс Stripe.
   Запускаються кнопкою (не на кожне відкриття сторінки), останній результат пам'ятаємо в kl_meta. */
const DIAG_SERVICES = [
  'db' => ['🗄️ База даних', 'Швидкість відповіді й кількість з’єднань MySQL'],
  'ai' => ['🤖 ШІ', 'Перевірка письма, розмови й дзвінки — ключ і модель'],
  'tts' => ['🎙️ Голос реплік', 'Синтез мовлення для живих відповідей'],
  'mail' => ['✉️ Пошта (SMTP)', 'Вхід у скриньку — без надсилання листа'],
  'google' => ['🔑 Вхід через Google', 'Client ID і секрет — справжньою перевіркою в Google'],
  'stripe' => ['💳 Оплата Stripe', 'Ключ, режим і секрет вебхука'],
  'peerjs' => ['🎮 PeerJS', 'Брокер з’єднань для «Гри разом», гонок і шахів'],
];

/** HTTP-запит до стороннього сервісу: код, час і тіло (до 64 КБ). Ключі йдуть лише в заголовках. */
function diag_http(string $url, array $headers = [], string $method = 'GET', ?string $body = null, int $timeout = 10): array {
  if (!function_exists('curl_init')) return ['code' => 0, 'ms' => 0, 'body' => '', 'err' => 'на сервері немає cURL'];
  $ch = curl_init($url);
  $opt = [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => $timeout, CURLOPT_CONNECTTIMEOUT => 6, CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2, CURLOPT_HTTPHEADER => $headers, CURLOPT_USERAGENT => 'Komiks-Lab-Diag/2.0', CURLOPT_CUSTOMREQUEST => $method];
  if ($body !== null) $opt[CURLOPT_POSTFIELDS] = $body;
  curl_setopt_array($ch, $opt);
  $t = microtime(true);
  $res = curl_exec($ch);
  $ms = (int)round((microtime(true) - $t) * 1000);
  $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $err = $res === false ? curl_error($ch) : '';
  curl_close($ch);
  return ['code' => $code, 'ms' => $ms, 'body' => substr((string)$res, 0, 65536), 'err' => $err];
}
function diag_r(string $level, string $value, string $fix = '', int $ms = 0): array { return ['level' => $level, 'value' => $value, 'fix' => $fix, 'ms' => $ms]; }
// типова розшифровка відповіді API за кодом
function diag_http_verdict(array $r, string $okText, string $keyFix): array {
  if ($r['code'] === 0) return diag_r(DIAG_BAD, 'немає зв’язку: ' . mb_substr($r['err'], 0, 80), 'Сервер не дістався до служби. Повторіть пізніше; якщо так постійно — запитайте хостинг про вихідні з’єднання.', $r['ms']);
  if ($r['code'] >= 200 && $r['code'] < 300) return diag_r(DIAG_OK, $okText, '', $r['ms']);
  if (in_array($r['code'], [401, 403], true)) return diag_r(DIAG_BAD, 'ключ недійсний або відкликаний (' . $r['code'] . ')', $keyFix, $r['ms']);
  if ($r['code'] === 429) return diag_r(DIAG_WARN, 'ліміт запитів або закінчилися кошти (429)', 'Перевірте баланс і ліміти в кабінеті провайдера.', $r['ms']);
  return diag_r(DIAG_WARN, 'відповідь ' . $r['code'], 'Служба відповіла незвично — повторіть перевірку за хвилину.', $r['ms']);
}

/** Перевірити одну службу й запам'ятати результат. */
function diag_ping(string $svc): array {
  if (!isset(DIAG_SERVICES[$svc])) return diag_r(DIAG_SKIP, 'невідома служба');
  try { $r = ('diag_ping_' . $svc)(); }
  catch (Throwable $e) { $r = diag_r(DIAG_BAD, 'збій перевірки: ' . mb_substr(err_clean($e->getMessage(), 120), 0, 120)); }
  meta_set('diag.ping.' . $svc, json_encode(['l' => $r['level'], 'v' => mb_substr($r['value'], 0, 110), 'ms' => $r['ms'], 'at' => time()], JSON_UNESCAPED_UNICODE));
  return $r;
}
function diag_ping_last(string $svc): ?array {
  $j = json_decode(meta_get('diag.ping.' . $svc), true);
  return is_array($j) ? $j : null;
}

function diag_ping_db(): array {
  $t = microtime(true);
  for ($i = 0; $i < 3; $i++) one('SELECT 1 AS x');
  $ms = (int)round((microtime(true) - $t) * 1000 / 3);
  $extra = '';
  $level = $ms < 40 ? DIAG_OK : ($ms < 250 ? DIAG_WARN : DIAG_BAD);
  if (is_mysql()) {
    try {
      $now = (int)(one("SHOW STATUS LIKE 'Threads_connected'")['Value'] ?? 0);
      $mu = (int)(one("SHOW VARIABLES LIKE 'max_user_connections'")['Value'] ?? 0);
      $mc = (int)(one("SHOW VARIABLES LIKE 'max_connections'")['Value'] ?? 0);
      $max = $mu > 0 ? $mu : $mc;
      if ($max > 0) {
        $extra = ' · з’єднань на сервері ' . $now . ', ліміт на акаунт ' . ($mu > 0 ? $mu : 'без ліміту') . ($mu > 0 ? '' : ' (загальний ' . $mc . ')');
      }
    } catch (Throwable $e) { /* немає прав на SHOW — не страшно */ }
  }
  return diag_r($level, (is_mysql() ? 'MySQL' : 'SQLite') . ' · ' . $ms . ' мс на запит' . $extra,
    $level === DIAG_OK ? '' : 'База відповідає повільно. Якщо так постійно — напишіть у підтримку Hostinger.', $ms);
}

function diag_ping_ai(): array {
  if (feature_off('ai')) return diag_r(DIAG_SKIP, 'вимкнено в config.php (ai → enabled = false)');
  $key = ai_cfg('key');
  if ($key === '') return diag_r(DIAG_SKIP, 'ключ не задано — дзвінки йдуть за заготовками, перевірка письма вимкнена');
  $prov = ai_provider();
  $bearer = ['Authorization: Bearer ' . $key];
  [$url, $h] = match ($prov) {
    'anthropic' => ['https://api.anthropic.com/v1/models?limit=1000', ['x-api-key: ' . $key, 'anthropic-version: 2023-06-01']],
    'groq' => ['https://api.groq.com/openai/v1/models', $bearer],
    'xai' => ['https://api.x.ai/v1/models', $bearer],
    'together' => ['https://api.together.xyz/v1/models', $bearer],
    'openrouter' => ['https://openrouter.ai/api/v1/key', $bearer],
    default => ['https://api.openai.com/v1/models', $bearer],
  };
  $r = diag_http($url, $h);
  $on = array_keys(array_filter(['письмо' => ai_feature_on('write'), 'розмова' => ai_feature_on('chat'), 'дзвінок' => ai_feature_on('realtime')]));
  $v = diag_http_verdict($r, $prov . ' · ' . ai_model() . ' · увімкнено: ' . ($on ? implode(', ', $on) : 'нічого'), 'Замініть ключ у api/config.php (розділ ai) і перевірте ще раз.');
  if ($v['level'] === DIAG_OK && $prov !== 'openrouter') {
    $j = json_decode($r['body'], true);
    $ids = array_column((array)($j['data'] ?? []), 'id');
    $miss = array_values(array_filter(array_unique([ai_model(), ai_write_model()]), fn($m) => $ids && !in_array($m, $ids, true)));
    if ($miss) $v = diag_r(DIAG_WARN, 'ключ дійсний, але моделі «' . implode('», «', $miss) . '» у провайдера немає', 'Оберіть іншу модель у 🎧 Голос і ШІ — інакше запити повертатимуть помилку.', $r['ms']);
  }
  return $v;
}

function diag_ping_tts(): array {
  if (tts_voice_off()) return diag_r(DIAG_SKIP, 'вимкнено — живі репліки без голосу');
  $p = tts_provider();
  if ($p === 'edge') {
    require_once __DIR__ . '/edge_tts.php';
    $t = microtime(true);
    $mp3 = edge_tts_speak('Hei!', 'nb-NO-PernilleNeural');
    $ms = (int)round((microtime(true) - $t) * 1000);
    return $mp3 && strlen($mp3) > 512
      ? diag_r(DIAG_OK, 'нейроголоси Microsoft Edge · ' . round(strlen($mp3) / 1024, 1) . ' КБ звуку за ' . $ms . ' мс', '', $ms)
      : diag_r(DIAG_BAD, 'сервіс Microsoft не віддав звук', 'Якщо триває довго — оновіть EDGE_VERSION / EDGE_CHROME в api/edge_tts.php (значення з edge-tts: SEC_MS_GEC_VERSION) або перемкніть провайдера в 🎧 Голос і ШІ.', $ms);
  }
  if (tts_cfg('key') === '') return diag_r(DIAG_BAD, $p . ' без ключа', 'Додайте ключ у api/config.php (розділ tts) або перемкніться на безкоштовні голоси Edge.');
  if ($p === 'elevenlabs') {
    $r = diag_http('https://api.elevenlabs.io/v1/user/subscription', ['xi-api-key: ' . tts_cfg('key')]);
    $v = diag_http_verdict($r, 'ElevenLabs · голос ' . tts_voice(), 'Замініть ключ ElevenLabs у api/config.php (розділ tts).');
    $j = json_decode($r['body'], true);
    if ($v['level'] === DIAG_OK && isset($j['character_count'], $j['character_limit'])) {
      $left = (int)$j['character_limit'] - (int)$j['character_count'];
      $v['value'] .= ' · лишилося ' . number_format($left, 0, ',', ' ') . ' символів';
      if ($left < 2000) { $v['level'] = DIAG_WARN; $v['fix'] = 'Ліміт символів майже вичерпано — поповніть тариф.'; }
    }
    return $v;
  }
  $r = diag_http('https://api.openai.com/v1/models', ['Authorization: Bearer ' . tts_cfg('key')]);
  return diag_http_verdict($r, 'OpenAI · ' . tts_cfg('model', 'gpt-4o-mini-tts') . ' · голос ' . tts_voice(), 'Замініть ключ OpenAI у api/config.php (розділ tts або ai).');
}

/* SMTP: з'єднання, EHLO, STARTTLS за потреби, AUTH LOGIN — і QUIT. Листа не надсилаємо.
   Тексти помилок складаємо самі: відповідь сервера на AUTH може містити закодований логін. */
function diag_ping_mail(): array {
  $m = mail_cfg();
  if ($m['transport'] === 'log') return diag_r(DIAG_SKIP, 'листи пишуться у файли api/data/mail (робоча копія)');
  if ($m['transport'] !== 'smtp') return diag_r(DIAG_WARN, 'спосіб надсилання — ' . ($m['transport'] ?: 'mail()'), 'На Hostinger надійно працює лише smtp: transport = smtp в api/config.php.');
  if ($bad = mail_problems()) return diag_r(DIAG_BAD, $bad[0], 'Виправте розділ mail в api/config.php.');
  $t = microtime(true);
  $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
  $fp = @stream_socket_client(($m['secure'] === 'ssl' ? 'ssl://' : 'tcp://') . $m['host'] . ':' . (int)$m['port'], $errno, $errstr, 10, STREAM_CLIENT_CONNECT, $ctx);
  if (!$fp) return diag_r(DIAG_BAD, 'не вдалося з’єднатися з ' . $m['host'] . ':' . (int)$m['port'], 'Перевірте host і port (smtp.hostinger.com, 465 ssl або 587 tls).', (int)round((microtime(true) - $t) * 1000));
  stream_set_timeout($fp, 10);
  $read = function () use ($fp) { $r = ''; while (($l = fgets($fp, 515)) !== false) { $r .= $l; if (strlen($l) < 4 || $l[3] === ' ') break; } return (int)substr($r, 0, 3); };
  $say = function (string $c) use ($fp, $read) { fwrite($fp, $c . "\r\n"); return $read(); };
  $step = 'привітання';
  try {
    if ($read() !== 220) throw new RuntimeException('сервер не привітався');
    $host = parse_url(site_url(), PHP_URL_HOST) ?: 'localhost';
    if ($say('EHLO ' . $host) !== 250) throw new RuntimeException('EHLO не прийнято');
    if ($m['secure'] === 'tls') {
      $step = 'шифрування';
      if ($say('STARTTLS') !== 220 || !stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) throw new RuntimeException('STARTTLS не вдався');
      $say('EHLO ' . $host);
    }
    $step = 'вхід';
    if ($say('AUTH LOGIN') !== 334 || $say(base64_encode($m['user'])) !== 334) throw new RuntimeException('сервер не прийняв AUTH LOGIN');
    $code = $say(base64_encode($m['pass']));
    @fwrite($fp, "QUIT\r\n"); fclose($fp);
    $ms = (int)round((microtime(true) - $t) * 1000);
    return $code === 235
      ? diag_r(DIAG_OK, 'вхід у скриньку успішний · ' . $m['host'] . ':' . (int)$m['port'] . ' ' . $m['secure'], '', $ms)
      : diag_r(DIAG_BAD, 'скринька не прийняла пароль (код ' . $code . ')', 'Змініть пароль скриньки в hPanel → Emails і той самий — у api/config.php (mail → pass).', $ms);
  } catch (Throwable $e) {
    @fclose($fp);
    return diag_r(DIAG_BAD, 'SMTP, крок «' . $step . '»: ' . $e->getMessage(), 'Перевірте host, port і secure в api/config.php.', (int)round((microtime(true) - $t) * 1000));
  }
}

/* Google: міняємо свідомо неправильний код на токен. Якщо Client ID і секрет дійсні, Google
   відповідає invalid_grant («код поганий»); якщо ні — invalid_client. Так видно, чи живий секрет
   після заміни, без жодного входу. */
function diag_ping_google(): array {
  require_once __DIR__ . '/secret-box.php';
  require_once __DIR__ . '/google-settings.php';
  $c = google_conf();
  if ($c['client_id'] === '') return diag_r(DIAG_SKIP, 'не налаштовано — вхід лише поштою');
  if ($c['client_secret'] === '') return diag_r(DIAG_BAD, 'секрет не розшифровується' . ($c['error'] ? ': ' . $c['error'] : ''), 'Збережіть секрет заново: ⚙️ Налаштування → Вхід через Google.');
  $r = diag_http('https://oauth2.googleapis.com/token', ['Content-Type: application/x-www-form-urlencoded'], 'POST', http_build_query([
    'code' => 'komiks-diag-' . bin2hex(random_bytes(6)), 'client_id' => $c['client_id'], 'client_secret' => $c['client_secret'],
    'redirect_uri' => site_url() . 'api/google-callback.php', 'grant_type' => 'authorization_code']));
  $err = (string)(json_decode($r['body'], true)['error'] ?? '');
  $state = $c['enabled'] ? 'увімкнено' : 'вимкнено';
  if ($r['code'] === 0) return diag_r(DIAG_BAD, 'немає зв’язку з Google: ' . mb_substr($r['err'], 0, 80), '', $r['ms']);
  if ($err === 'invalid_grant') return diag_r(DIAG_OK, 'Client ID і секрет дійсні · вхід ' . $state, $c['enabled'] ? '' : 'Ключі робочі — вхід можна ввімкнути в ⚙️ Налаштування.', $r['ms']);
  if (in_array($err, ['invalid_client', 'unauthorized_client'], true)) return diag_r(DIAG_BAD, 'Google не приймає Client ID або секрет (' . $err . ')', 'Створіть новий секрет у Google Cloud Console → Credentials і збережіть його в ⚙️ Налаштування → Вхід через Google.', $r['ms']);
  return diag_r(DIAG_WARN, 'незвична відповідь Google: ' . ($err ?: 'код ' . $r['code']), 'Перевірте налаштування клієнта OAuth у Google Cloud Console.', $r['ms']);
}

function diag_ping_stripe(): array {
  if (!stripe_ready()) return diag_r(DIAG_SKIP, 'не використовується — оплату не підключено');
  $r = diag_http('https://api.stripe.com/v1/balance', ['Authorization: Bearer ' . stripe_key('secret')]);
  $live = str_contains(stripe_key('secret'), '_live_');
  $v = diag_http_verdict($r, 'ключ дійсний · ' . ($live ? 'бойовий режим' : 'тестовий режим'), 'Замініть секретний ключ Stripe у api/config.php (stripe → secret).');
  if ($v['level'] === DIAG_OK && !str_starts_with(stripe_key('webhook'), 'whsec_')) { $v['level'] = DIAG_WARN; $v['value'] .= ' · немає секрету вебхука'; $v['fix'] = 'Без whsec_… підписки не вмикатимуться після оплати: stripe → webhook в api/config.php.'; }
  if ($v['level'] === DIAG_OK && !str_starts_with(stripe_key('publishable'), 'pk_')) { $v['level'] = DIAG_WARN; $v['value'] .= ' · немає публічного ключа'; }
  return $v;
}

function diag_ping_peerjs(): array {
  $r = diag_http('https://0.peerjs.com/peerjs/id?ts=' . (int)(microtime(true) * 1000) . '&version=1.5.4', [], 'GET', null, 8);
  if ($r['code'] === 200 && strlen(trim($r['body'])) >= 8) return diag_r($r['ms'] < 1500 ? DIAG_OK : DIAG_WARN, 'брокер відповідає за ' . $r['ms'] . ' мс', '', $r['ms']);
  return diag_r(DIAG_WARN, $r['code'] ? 'відповідь ' . $r['code'] : 'немає зв’язку: ' . mb_substr($r['err'], 0, 80), 'Публічний брокер 0.peerjs.com недоступний: «Гра разом», гонки й шахи з друзями не з’єднаються, доки він не оживе.', $r['ms']);
}

/* ═══════════════ 7. Власні адреси API: чи живі й як швидко ═══════════════
   Паралельні GET-запити (curl_multi). Нормальна відповідь — будь-який код до 500, крім 404:
   401 без входу чи 405 на GET теж означають «файл на місці й PHP його виконав». */
const DIAG_ENDPOINTS = [
  'api/health.php' => 'Здоров’я API',
  'api/auth.php?action=slots' => 'Акаунти й вхід',
  'api/players.php?sort=stars' => 'Гравці й рейтинг',
  'api/wall.php' => 'Стіни профілів',
  'api/messages.php' => 'Повідомлення',
  'api/gifts.php' => 'Подарунки',
  'api/feedback.php' => 'Відгуки',
  'api/write.php' => 'Перевірка письма (ШІ)',
  'api/call.php' => 'Дзвінки з персонажами',
  'api/realtime.php' => 'Голосовий дзвінок',
  'api/tts.php' => 'Голос реплік',
  'api/teacher.php' => 'Заявки вчителів',
  'api/billing.php' => 'Оплата',
  'api/stripe-webhook.php' => 'Вебхук Stripe',
  'api/hit.php' => 'Лічильник відвідувань',
  'api/err.php' => 'Журнал помилок JS',
  'api/mailimg.php' => 'Фото в листах',
];
function diag_endpoints(): array {
  if (!function_exists('curl_multi_init')) return [];
  $mh = curl_multi_init(); $hs = [];
  /* Не більше 4 запитів разом: кожна адреса відкриває своє з'єднання з MySQL, і ~30 одночасних
     вичерпували ліміт хостингу — у журналі з'являлось «1040 Too many connections» саме від діагностики. */
  if (defined('CURLMOPT_MAX_TOTAL_CONNECTIONS')) curl_multi_setopt($mh, CURLMOPT_MAX_TOTAL_CONNECTIONS, 4);
  if (defined('CURLMOPT_MAX_HOST_CONNECTIONS')) curl_multi_setopt($mh, CURLMOPT_MAX_HOST_CONNECTIONS, 4);
  foreach (DIAG_ENDPOINTS as $path => $title) {
    $ch = curl_init(site_url() . $path);
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_FOLLOWLOCATION => false,
      CURLOPT_SSL_VERIFYPEER => true, CURLOPT_USERAGENT => 'Komiks-Lab-Diag/2.0', CURLOPT_HTTPHEADER => ['Accept: application/json']]);
    curl_multi_add_handle($mh, $ch); $hs[$path] = $ch;
  }
  do { $st = curl_multi_exec($mh, $run); if ($run) curl_multi_select($mh, 1); } while ($run && $st === CURLM_OK);
  $out = [];
  foreach ($hs as $path => $ch) {
    $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $ms = (int)round(curl_getinfo($ch, CURLINFO_TOTAL_TIME) * 1000);
    $body = (string)curl_multi_getcontent($ch);
    curl_multi_remove_handle($mh, $ch); curl_close($ch);
    // 404 від самого скрипта (JSON «ok:false») — файл живий; справжня відсутність — це сторінка 404 сервера
    $miss = $code === 404 && $path !== 'api/mailimg.php' && !str_contains($body, '"ok"');
    $level = ($code === 0 || $code >= 500 || $miss) ? DIAG_BAD : ($ms > 4000 ? DIAG_WARN : DIAG_OK);   // у черзі по 4 — час більший
    $note = $code === 0 ? 'немає відповіді' : ($code >= 500 ? 'збій сервера — див. «Журнали»' : ($miss ? 'файла немає на сервері' : ($ms > 4000 ? 'повільно' : '')));
    if ($code >= 500 && preg_match('/"error"\s*:\s*"([a-z_]+)"/', $body, $m)) $note .= ' (' . $m[1] . ')';
    $out[] = ['path' => $path, 'title' => DIAG_ENDPOINTS[$path], 'code' => $code, 'ms' => $ms, 'level' => $level, 'note' => $note];
  }
  curl_multi_close($mh);
  return $out;
}

/* ═══════════════════ 8. Журнал помилок PHP (хостинг) ═══════════════════
   Hostinger пише помилки всіх сайтів домену в ~/.logs/error_log_<домен>. Беремо хвіст файла,
   лишаємо рядки нашої теки чи з міткою [komiks-…], згортаємо однакові. Шляхи — відносні,
   пошти й довгі токени замінено. */
function diag_log_file(): string {
  $c = [];
  $ini = (string)ini_get('error_log');
  if ($ini !== '' && ($ini[0] === '/' || preg_match('~^[A-Z]:\\\\~i', $ini))) $c[] = $ini;
  $home = (string)(getenv('HOME') ?: (function_exists('posix_getpwuid') ? (posix_getpwuid(posix_geteuid())['dir'] ?? '') : ''));
  if ($home === '' && preg_match('~^(/home/[^/]+)/~', diag_root(), $m)) $home = $m[1];
  $host = (string)parse_url(site_url(), PHP_URL_HOST);
  if ($home !== '' && $host !== '') $c[] = $home . '/.logs/error_log_' . str_replace(['.', '-'], '_', preg_replace('/^www\./', '', $host));
  foreach ([diag_root() . '/error_log', diag_root() . '/api/error_log', dirname(diag_root()) . '/error_log'] as $f) $c[] = $f;
  foreach ($c as $f) if (@is_file($f) && @is_readable($f)) return $f;
  return '';
}
function diag_log_hint(string $msg): string {
  foreach ([
    'Too many connections' => 'MySQL відхилив з’єднання: вичерпано ліміт одночасних з’єднань хостингу. Тепер сайт робить дві повторні спроби (через 0,3 с і 0,8 с); якщо рядок і далі росте — напишіть у підтримку Hostinger про max_user_connections.',
    'gone away' => 'З’єднання з MySQL обірвалося посеред запиту (перезапуск бази або довгий запит). Тепер сайт сам перепідключається й повторює запит один раз; поодинокі записи — не страшно.',
    '[2002]' => 'PHP на мить не зміг підключитися до MySQL. Поодинокі хвилі — збій хостингу; сайт тепер повторює спробу.',
    'Access denied for user' => 'База не приймає логін або пароль — перевірте db.user / db.pass в api/config.php.',
    '[komiks-ai]' => 'Провайдер ШІ повернув помилку — перевірте ключ і баланс у вкладці «API і служби».',
    '[komiks-tts]' => 'Синтез мовлення не відповів — перевірте «Голос реплік» у вкладці «API і служби».',
    '[komiks-mail]' => 'Лист не пішов — перевірте «Пошта (SMTP)» у вкладці «API і служби».',
    'Allowed memory size' => 'Скрипту забракло пам’яті — зазвичай завеликий файл або вибірка.',
    'Maximum execution time' => 'Скрипт працював задовго й був зупинений.',
    'Parse error' => 'Синтаксична помилка у PHP-файлі — залийте збірку заново.',
  ] as $needle => $hint) if (stripos($msg, $needle) !== false) return $hint;
  return '';
}
function diag_server_log(int $since): array {
  $f = diag_log_file();
  if ($f === '') return ['file' => '', 'groups' => [], 'total' => 0];
  $size = (int)@filesize($f);
  $fh = @fopen($f, 'rb');
  if (!$fh) return ['file' => $f, 'groups' => [], 'total' => 0];
  if ($size > 1572864) fseek($fh, $size - 1572864);
  $raw = (string)stream_get_contents($fh);
  fclose($fh);
  $root = diag_root() . '/';
  $groups = []; $total = 0;
  foreach (preg_split('/\R/', $raw) as $line) {
    if ($line === '' || (!str_contains($line, $root) && !str_contains($line, '[komiks-'))) continue;
    if (!preg_match('/^\[([^\]]+)\]\s*(.*)$/', $line, $m)) continue;
    $t = strtotime(str_replace(' UTC', ' +0000', $m[1])) ?: 0;
    if ($t < $since) continue;
    $msg = str_replace($root, '', $m[2]);
    $msg = err_clean((string)preg_replace('/\s+/', ' ', $msg), 400);
    $key = (string)preg_replace('/\b\d{5,}\b/', '#', $msg);
    $lvl = preg_match('/Fatal error|Parse error|\[komiks-api\]|Uncaught/i', $msg) ? DIAG_BAD : (preg_match('/Warning|\[komiks-/i', $msg) ? DIAG_WARN : DIAG_SKIP);
    $g = &$groups[$key];
    if ($g === null) $g = ['msg' => $msg, 'n' => 0, 'first' => $t, 'last' => $t, 'level' => $lvl, 'hint' => diag_log_hint($msg)];
    $g['n']++; $g['last'] = max($g['last'], $t); $g['first'] = min($g['first'], $t);
    unset($g);
    $total++;
  }
  uasort($groups, fn($a, $b) => $b['last'] <=> $a['last']);
  return ['file' => $f, 'groups' => array_values($groups), 'total' => $total];
}

/* ═══════════════ 9. Лічильники безпеки й журнал помилок із бази ═══════════════ */
const DIAG_SEC_KEYS = [
  'server' => ['Збої сервера (500)', DIAG_BAD], 'js' => ['Помилки JavaScript у браузерах', DIAG_WARN],
  'wrong' => ['Невдалі входи й коди', DIAG_WARN], 'csrf' => ['Відхилені чужі запити (CSRF)', DIAG_WARN],
  'slow_down' => ['Спрацювання ліміту частоти', DIAG_SKIP], 'captcha' => ['Неправильна капча', DIAG_SKIP],
  'token' => ['Недійсні чи прострочені посилання', DIAG_SKIP], 'banned' => ['Запити від заблокованих', DIAG_SKIP],
  'blocked' => ['Заблоковані акаунти', DIAG_SKIP], 'forbidden' => ['Заборонені дії', DIAG_SKIP],
  'ai' => ['Збої ШІ', DIAG_WARN], 'tts' => ['Збої синтезу голосу', DIAG_WARN], 'stripe' => ['Збої Stripe', DIAG_WARN], 'too_big' => ['Завеликі запити', DIAG_SKIP],
];
/** [ключ => [день => n]] за останні $days днів + список днів. */
function diag_sec_days(int $days): array {
  $list = [];
  for ($i = $days - 1; $i >= 0; $i--) $list[] = date('Y-m-d', strtotime('-' . $i . ' days'));
  $out = [];
  try {
    foreach (q('SELECT day, k, n FROM kl_sec_stats WHERE day >= ?', [$list[0]])->fetchAll() as $r) $out[$r['k']][$r['day']] = (int)$r['n'];
  } catch (Throwable $e) { /* таблиці ще немає — подій не було */ }
  return ['days' => $list, 'by' => $out];
}
function diag_sec_sum(array $sd, string $k, int $lastDays): int {
  $s = 0;
  foreach (array_slice($sd['days'], -$lastDays) as $d) $s += $sd['by'][$k][$d] ?? 0;
  return $s;
}
function diag_errors(string $kind, int $limit = 60): array {
  try { return q('SELECT * FROM kl_errors WHERE kind = ? ORDER BY last_at DESC LIMIT ' . (int)$limit, [$kind])->fetchAll(); }
  catch (Throwable $e) { return []; }
}

/* ═══════════════════════ 10. Безпека: глибше ═══════════════════════ */
/** Дні до кінця SSL-сертифіката (null — не вдалося перевірити). */
function diag_tls_days(): ?int {
  $host = (string)parse_url(site_url(), PHP_URL_HOST);
  if ($host === '' || !str_starts_with(site_url(), 'https://') || !function_exists('openssl_x509_parse')) return null;
  $ctx = stream_context_create(['ssl' => ['capture_peer_cert' => true, 'verify_peer' => true, 'SNI_enabled' => true, 'peer_name' => $host]]);
  $fp = @stream_socket_client('ssl://' . $host . ':443', $no, $str, 6, STREAM_CLIENT_CONNECT, $ctx);
  if (!$fp) return null;
  $cert = stream_context_get_params($fp)['options']['ssl']['peer_certificate'] ?? null;
  fclose($fp);
  $info = $cert ? openssl_x509_parse($cert) : null;
  return $info ? (int)floor(((int)$info['validTo_time_t'] - time()) / 86400) : null;
}
/** Адміністратори й модератори: другий фактор, останній вхід, відкриті сесії. */
function diag_staff(): array {
  try {
    return q('SELECT u.id, u.name, u.is_admin, u.is_moderator, u.totp_at, u.totp_secret, u.last_login, u.blocked_at,
      (SELECT COUNT(*) FROM kl_sessions s WHERE s.user_id = u.id AND s.expires_at > ?) AS sessions
      FROM kl_users u WHERE (u.is_admin = 1 OR u.is_moderator = 1) ORDER BY u.is_admin DESC, u.name', [time()])->fetchAll();
  } catch (Throwable $e) { return []; }
}
function diag_admin_log(int $limit = 40): array {
  try { return q('SELECT l.*, u.name FROM kl_admin_log l LEFT JOIN kl_users u ON u.id = l.admin_id ORDER BY l.id DESC LIMIT ' . (int)$limit)->fetchAll(); }
  catch (Throwable $e) { return []; }
}
/* Цілісність: збірка кладе в api/integrity.php відбитки всіх PHP-файлів і .htaccess.
   Змінений файл або PHP, якого немає у збірці (а саме так виглядає підкинутий «бекдор»), — тривога. */
function diag_integrity(): array {
  $man = diag_root() . '/api/integrity.php';
  if (!is_file($man)) return ['ok' => null, 'changed' => [], 'unknown' => [], 'n' => 0, 'built' => ''];
  $m = include $man;
  $files = (array)($m['files'] ?? []);
  $changed = []; $unknown = [];
  foreach ($files as $rel => $hash) {
    $p = diag_root() . '/' . $rel;
    if (is_file($p) && hash_file('sha256', $p) !== $hash) $changed[] = $rel;
  }
  $skip = ['api/data', 'audio', 'img', 'node_modules', '.git'];
  $it = new RecursiveIteratorIterator(new RecursiveCallbackFilterIterator(new RecursiveDirectoryIterator(diag_root(), FilesystemIterator::SKIP_DOTS),
    function ($f, $k, $it) use ($skip) {
      $rel = str_replace('\\', '/', substr($f->getPathname(), strlen(diag_root()) + 1));
      if ($it->hasChildren()) return !in_array($rel, $skip, true);
      return (bool)preg_match('/\.(php\d?|phtml|phar)$/i', $rel);
    }));
  foreach ($it as $f) {
    $rel = str_replace('\\', '/', substr($f->getPathname(), strlen(diag_root()) + 1));
    if (!isset($files[$rel]) && !in_array($rel, ['api/config.php', 'api/integrity.php'], true)) $unknown[] = $rel;
  }
  sort($unknown);
  return ['ok' => !$changed && !$unknown, 'changed' => $changed, 'unknown' => $unknown, 'n' => count($files), 'built' => (string)($m['built'] ?? ''), 'version' => (string)($m['version'] ?? '')];
}
/** Додаткові перевірки безпеки для вкладки «Безпека». */
function diag_security_more(?array $integrity = null, ?int $tls = null): array {
  $r = [];
  $integrity ??= diag_integrity();
  if ($integrity['ok'] === null) $r[] = diag_only_live(diag_item('Цілісність PHP-файлів', DIAG_WARN, 'немає відбитків збірки (api/integrity.php)', 'Залийте свіжу збірку — у ній є відбитки всіх файлів.'), 'відбитки створює збірка');
  else {
    $odd = array_merge($integrity['changed'], $integrity['unknown']);
    $onlyLocal = $integrity['unknown'] && !$integrity['changed'] && !array_diff($integrity['unknown'], ['api/config.local.php']);
    $r[] = !$odd
      ? diag_item('Цілісність PHP-файлів', DIAG_OK, $integrity['n'] . ' файлів збігаються зі збіркою' . ($integrity['version'] ? ' ' . $integrity['version'] : ''))
      : diag_item('Цілісність PHP-файлів', $onlyLocal ? DIAG_WARN : DIAG_BAD,
          ($integrity['changed'] ? 'змінено: ' . implode(', ', array_slice($integrity['changed'], 0, 4)) . ' ' : '') . ($integrity['unknown'] ? 'чужі: ' . implode(', ', array_slice($integrity['unknown'], 0, 4)) : ''),
          $onlyLocal ? 'api/config.local.php — локальний конфіг із комп’ютера, серверу він не потрібен. Видаліть його з сервера.'
            : 'Якщо ви цих файлів не змінювали й не заливали — видаліть чужі, перезалийте збірку й змініть паролі адмінів і бази.');
  }
  $tls ??= diag_tls_days();
  if ($tls !== null) $r[] = $tls > 14 ? diag_item('SSL-сертифікат', DIAG_OK, 'дійсний ще ' . $tls . ' дн.')
    : diag_item('SSL-сертифікат', $tls > 3 ? DIAG_WARN : DIAG_BAD, $tls >= 0 ? 'закінчується через ' . $tls . ' дн.' : 'прострочено', 'Оновіть SSL у hPanel → Security → SSL (Hostinger зазвичай робить це сам).');
  $staff = diag_staff();
  $no2fa = array_filter($staff, fn($u) => empty($u['blocked_at']) && !totp_on($u));
  $adm2 = array_filter($no2fa, fn($u) => !empty($u['is_admin']));
  $r[] = !$no2fa ? diag_item('Другий фактор (2FA) у команди', DIAG_OK, 'у всіх ' . count($staff) . ' увімкнено')
    : diag_item('Другий фактор (2FA) у команди', $adm2 ? DIAG_BAD : DIAG_WARN, 'без 2FA — ' . count($no2fa) . ': ' . implode(', ', array_slice(array_values(array_unique(array_map(fn($u) => $u['name'] . (!empty($u['is_admin']) ? ' (адмін)' : ''), $no2fa))), 0, 6)) . (count($no2fa) > 6 ? '…' : ''),
        'Увімкніть автентифікатор: ⚙️ Налаштування → Безпека входу. Без нього вкрадений пароль = доступ до всієї адмінки.');
  $fails = 0;
  try { $fails = (int)(one("SELECT COUNT(*) AS n FROM kl_admin_log WHERE action = 'login_fail' AND at > ?", [time() - 86400])['n'] ?? 0); } catch (Throwable $e) {}
  $r[] = $fails < 5 ? diag_item('Невдалі входи в адмінку за добу', DIAG_OK, (string)$fails)
    : diag_item('Невдалі входи в адмінку за добу', $fails < 20 ? DIAG_WARN : DIAG_BAD, (string)$fails, 'Хтось підбирає пароль до панелі. Переконайтеся, що 2FA увімкнено, і змініть пароль.');
  $home = diag_fetch('index.html', 'HEAD');
  if ($home) $r[] = str_contains($home['headers'], 'strict-transport-security:')
    ? diag_item('HSTS (лише https)', DIAG_OK, 'заголовок є')
    : diag_only_live(diag_item('HSTS (лише https)', DIAG_WARN, 'заголовка немає', 'Браузер може першим запитом піти на http://. HSTS діє на весь домен bilohash.com — вмикайте в hPanel → Security, коли всі сайти домену працюють через https.'));
  $adm = diag_fetch('admin.php', 'HEAD');
  if ($adm) $r[] = str_contains($adm['headers'], "frame-ancestors 'none'") && str_contains($adm['headers'], 'nonce-')
    ? diag_item('Захист сторінки адмінки (CSP)', DIAG_OK, 'скрипти лише свої, вбудовування заборонено')
    : diag_item('Захист сторінки адмінки (CSP)', DIAG_WARN, 'заголовка CSP немає', 'Залийте свіжі admin.php і api/admin_ui.php.');
  $r[] = diag_only_live(str_starts_with(site_url(), 'https://')
    ? diag_item('Кука входу', DIAG_OK, 'HttpOnly · Secure · SameSite=Lax')
    : diag_item('Кука входу', DIAG_BAD, 'без Secure — сайт не на https', 'Увімкніть https і виправте site_url.'));
  $bans = 0; $blocked = 0;
  try { $bans = (int)(one('SELECT COUNT(*) AS n FROM kl_bans WHERE until_at > ?', [time()])['n'] ?? 0); } catch (Throwable $e) {}
  try { $blocked = (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE blocked_at IS NOT NULL')['n'] ?? 0); } catch (Throwable $e) {}
  $r[] = diag_item('Блокування', DIAG_OK, 'тимчасових банів зараз ' . $bans . ' · заблокованих акаунтів ' . $blocked);
  return $r;
}
