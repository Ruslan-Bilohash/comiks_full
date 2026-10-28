<?php
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(404); exit; }

/** Admin-only mail studio. Transport is the existing send_mail(); no work on GET. */
function ms_json(array $v): string { return json_encode($v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR); }
function ms_esc(string $v): string { return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function ms_install(): void {
  $my = db()->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql';
  $pk = $my ? 'INT NOT NULL AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  $longText = $my ? 'MEDIUMTEXT' : 'TEXT';
  $end = $my ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';
  foreach ([
    "CREATE TABLE IF NOT EXISTS kl_mail_templates (id $pk, seed_key VARCHAR(50) UNIQUE, name VARCHAR(120) NOT NULL, content TEXT NOT NULL, active INT NOT NULL DEFAULT 1, updated_at INT NOT NULL)",
    "CREATE TABLE IF NOT EXISTS kl_mail_campaigns (id $pk, request_key VARCHAR(64) NOT NULL UNIQUE, title VARCHAR(120) NOT NULL, content TEXT NOT NULL, status VARCHAR(16) NOT NULL DEFAULT 'draft', created_by INT NOT NULL, created_at INT NOT NULL, updated_at INT NOT NULL, locked_at INT NOT NULL DEFAULT 0)",
    "CREATE TABLE IF NOT EXISTS kl_mail_recipients (id $pk, campaign_id INT NOT NULL, user_id INT NOT NULL, name VARCHAR(120) NOT NULL, email VARCHAR(190) NOT NULL, lang VARCHAR(5) NOT NULL, status VARCHAR(16) NOT NULL DEFAULT 'queued', error TEXT NOT NULL, updated_at INT NOT NULL, UNIQUE (campaign_id,user_id))",
    "CREATE TABLE IF NOT EXISTS kl_mail_attempts (id $pk, recipient_id INT NOT NULL, subject VARCHAR(200) NOT NULL, html $longText NOT NULL, body $longText NOT NULL, status VARCHAR(16) NOT NULL, error TEXT NOT NULL, created_at INT NOT NULL, finished_at INT NULL)",
    "CREATE TABLE IF NOT EXISTS kl_testers (email VARCHAR(190) NOT NULL PRIMARY KEY, added_at INT NOT NULL)"
  ] as $sql) q($sql . $end);
  // Only seed an empty catalog. Archived starters are never silently restored.
  if (!(int)(one('SELECT COUNT(*) AS n FROM kl_mail_templates')['n'] ?? 0)) {
    foreach (ms_examples() as $key => $t) {
      q(($my ? 'INSERT IGNORE' : 'INSERT OR IGNORE') . ' INTO kl_mail_templates (seed_key,name,content,updated_at) VALUES (?,?,?,?)', [$key,$t['name'],ms_json($t),time()]);
    }
  }
  // 📲 шаблони про застосунок — один раз, і в наявну бібліотеку теж
  if (meta_get('ms_seed_apps') !== '1') {
    foreach (ms_app_examples() as $key => $t) q(($my ? 'INSERT IGNORE' : 'INSERT OR IGNORE') . ' INTO kl_mail_templates (seed_key,name,content,updated_at) VALUES (?,?,?,?)', [$key,$t['name'],ms_json($t),time()]);
    meta_set('ms_seed_apps', '1');
  }
}
function ms_examples(): array {
  $examples = [
    'uk'=>[
      ['Новини проєкту','Що нового в Комікс·Lab','Нові можливості для вашого навчання','Вітаю, {{name}}!\n\nМи оновили головну сторінку: тепер швидше знайти алфавіт, слова, план навчання й тести. Відкрийте журнал оновлень та спробуйте нові можливості.','Переглянути новини','#/whatsnew'],
      ['Повернення до навчання','{{name}}, продовжимо норвезьку?','П’ять хвилин для норвезької','Вітаю, {{name}}!\n\nЗапрошуємо повернутися до навчання. Почніть із короткої історії або повторіть знайомі слова — маленькі кроки теж важливі.','Мій план навчання','#/plan'],
      ['Комікс тижня','Час для нової історії норвезькою','Навчайтеся через комікси','Вітаю, {{name}}!\n\nОберіть комікс свого рівня, послухайте репліки та перевірте розуміння коротким тестом. Незнайомі слова можна повторити на картках.','Обрати комікс','#/'],
      ['Відгук про застосунок','Як проходить ваше тестування Learning Norwegian?','Дякую за вашу допомогу!','Вітаю, {{name}}!\n\nЧи зручно читати комікси, слухати озвучення та проходити тести? Поділіться чесним відгуком: що сподобалося та що варто покращити.\n\nЯкщо помітили помилку, напишіть модель телефона й кроки відтворення на email@bilohash.com.','Відкрити Google Play','https://play.google.com/store/apps/details?id=com.bilohash.comiks']
    ],
    'en'=>[
      ['Project news','What’s new in Comic·Lab','New ways to learn','Hi {{name}}!\n\nOur updated home page makes it easier to find the alphabet, words, learning plan and tests. Explore the latest updates and try something new.','See what’s new','#/whatsnew'],
      ['Return to learning','{{name}}, ready for more Norwegian?','Five minutes of Norwegian','Hi {{name}}!\n\nCome back for a short story or a few familiar words. Small steps count — your next lesson is waiting.','My learning plan','#/plan'],
      ['Comic of the week','Time for a new Norwegian story','Learn through comics','Hi {{name}}!\n\nChoose a comic at your level, listen to the dialogue and take a short quiz. You can review new words with flashcards.','Choose a comic','#/'],
      ['App feedback','How is your Learning Norwegian testing going?','Thank you for your help!','Hi {{name}}!\n\nIs it easy to read comics, listen to the audio and take quizzes? Please share your honest feedback: what you liked and what we could improve.\n\nFor bugs, send your phone model and steps to reproduce to email@bilohash.com.','Open Google Play','https://play.google.com/store/apps/details?id=com.bilohash.comiks']
    ],
    'no'=>[
      ['Nyheter','Hva er nytt i Komiks·Lab?','Nye muligheter for læring','Hei {{name}}!\n\nDen oppdaterte forsiden gjør det enklere å finne alfabetet, ord, læringsplanen og prøver. Se de siste oppdateringene og prøv noe nytt.','Se nyhetene','#/whatsnew'],
      ['Tilbake til læringen','{{name}}, klar for mer norsk?','Fem minutter med norsk','Hei {{name}}!\n\nKom tilbake for en kort historie eller noen kjente ord. Små steg teller — neste økt venter på deg.','Min læringsplan','#/plan'],
      ['Ukens tegneserie','Tid for en ny historie på norsk','Lær med tegneserier','Hei {{name}}!\n\nVelg en tegneserie på ditt nivå, lytt til replikkene og ta en kort prøve. Du kan repetere nye ord med ordkort.','Velg en tegneserie','#/'],
      ['Tilbakemelding om appen','Hvordan går testingen av Learning Norwegian?','Takk for hjelpen!','Hei {{name}}!\n\nEr det enkelt å lese tegneserier, lytte til lyden og ta prøvene? Del gjerne ærlige tilbakemeldinger om det du likte og det vi kan forbedre.\n\nSend telefonmodell og fremgangsmåte ved feil til email@bilohash.com.','Åpne Google Play','https://play.google.com/store/apps/details?id=com.bilohash.comiks']
    ]
  ];
  $out=[];
  foreach ($examples as $lang=>$rows) foreach ($rows as $i=>$row) {
    [$name,$subject,$heading,$body,$button,$url]=$row;
    $out[$lang.'-'.$i]=['name'=>$name,'lang'=>$lang,'subject'=>$subject,'preheader'=>$heading,'heading'=>$heading,'body'=>str_replace('\\n',"\n",$body),'button'=>$button,'url'=>str_starts_with($url,'#')?site_url().$url:$url,'footer'=>['uk'=>'Команда Комікс·Lab','en'=>'The Comic·Lab team','no'=>'Komiks·Lab-teamet'][$lang]];
  }
  return $out;
}
function ms_app_examples(): array {
  $rows = [
    'uk' => ['Завантажте застосунок', 'Komiks·Lab тепер у вашому телефоні 📲', 'Вчіть норвезьку будь-де', "Вітаю, {{name}}!\n\nKomiks·Lab тепер можна встановити як застосунок: на Android — з Google Play, на комп’ютер з Windows — з Microsoft Store. Версія для iPhone — незабаром.\n\nУвійдіть тим самим акаунтом — прогрес, зірки, аватар і друзі будуть на місці.", 'Відкрити Google Play', 'Команда Комікс·Lab'],
    'en' => ['Get the app', 'Komiks·Lab is now on your phone 📲', 'Learn Norwegian anywhere', "Hi {{name}}!\n\nYou can now install Komiks·Lab as an app: on Android from Google Play and on Windows from the Microsoft Store. The iPhone version is coming soon.\n\nSign in with the same account — your progress, stars, avatar and friends are all there.", 'Open Google Play', 'The Komiks·Lab team'],
    'no' => ['Last ned appen', 'Komiks·Lab er nå på mobilen din 📲', 'Lær norsk hvor som helst', "Hei {{name}}!\n\nNå kan du installere Komiks·Lab som app: på Android fra Google Play og på Windows fra Microsoft Store. iPhone-versjonen kommer snart.\n\nLogg inn med samme konto — fremgangen, stjernene, figuren og vennene dine er der.", 'Åpne Google Play', 'Hilsen Komiks·Lab'],
  ];
  $out = [];
  foreach ($rows as $lang => [$name, $subject, $heading, $body, $button, $footer])
    $out['apps-' . $lang] = ['name' => $name, 'lang' => $lang, 'subject' => $subject, 'preheader' => $heading, 'heading' => $heading, 'body' => str_replace('\n', "\n", $body), 'button' => $button, 'url' => 'https://play.google.com/store/apps/details?id=com.bilohash.comiks', 'footer' => $footer, 'apps' => 1];
  return $out;
}
/* ---------- ✨ «Що нового» підписаним ----------
   Стаття з журналу оновлень (data/updates.json, його пише tools/build.js) розсилається кожному
   підписаному його мовою. Кампанія звичайна — з переглядом, прогресом і журналом, — лише текст
   листа складається для кожного одержувача окремо (ms_render бачить update_id). */
function ms_updates(): array {
  static $u = null;
  if ($u === null) { $raw = @file_get_contents(__DIR__ . '/../data/updates.json'); $u = is_string($raw) ? (json_decode($raw, true) ?: []) : []; }
  return $u;
}
function ms_update(string $id): ?array { foreach (ms_updates() as $x) if (($x['id'] ?? '') === $id) return $x; return null; }
function ms_news_text(string $lang): array {
  $T = [
    'uk' => ['✨ Що нового в Комікс·Lab', 'Що нового в Комікс·Lab', 'Вітаю, {{name}}! Ось що змінилося в Комікс·Lab:', 'Подивитися новинки', 'Команда Комікс·Lab'],
    'en' => ['✨ What’s new in Komiks·Lab', 'What’s new in Komiks·Lab', 'Hi {{name}}! Here is what has changed in Komiks·Lab:', 'See what’s new', 'The Komiks·Lab team'],
    'no' => ['✨ Nytt i Komiks·Lab', 'Hva er nytt i Komiks·Lab', 'Hei {{name}}! Dette er nytt i Komiks·Lab:', 'Se nyhetene', 'Hilsen Komiks·Lab'],
    'ar' => ['✨ الجديد في Komiks·Lab', 'ما الجديد في Komiks·Lab', 'مرحبًا {{name}}! إليك ما تغيّر في Komiks·Lab:', 'شاهد الجديد', 'فريق Komiks·Lab'],
    'de' => ['✨ Neu bei Komiks·Lab', 'Was ist neu bei Komiks·Lab', 'Hallo {{name}}! Das hat sich bei Komiks·Lab geändert:', 'Neuigkeiten ansehen', 'Dein Komiks·Lab-Team'],
    'pl' => ['✨ Nowości w Komiks·Lab', 'Co nowego w Komiks·Lab', 'Cześć {{name}}! Oto co zmieniło się w Komiks·Lab:', 'Zobacz nowości', 'Zespół Komiks·Lab'],
    'tr' => ['✨ Komiks·Lab’de yenilikler', 'Komiks·Lab’de neler yeni', 'Merhaba {{name}}! Komiks·Lab’de değişenler:', 'Yenilikleri gör', 'Komiks·Lab ekibi'],
    'lt' => ['✨ Kas naujo Komiks·Lab', 'Kas naujo Komiks·Lab', 'Sveiki, {{name}}! Štai kas pasikeitė Komiks·Lab:', 'Peržiūrėti naujienas', 'Komiks·Lab komanda'],
  ];
  return $T[$lang] ?? $T['en'];
}
// вміст листа для однієї мови; дата — з id запису (2026-10-24 або 2026-10-24-2)
function ms_news_content(array $upd, string $lang): array {
  $L = $upd['langs'][$lang] ?? null;
  if (!$L) { $lang = isset($upd['langs']['en']) ? 'en' : (string)array_key_first($upd['langs']); $L = $upd['langs'][$lang]; }
  [$subject, $heading, $intro, $btn, $footer] = ms_news_text($lang);
  $date = date('d.m.Y', strtotime(substr((string)$upd['id'], 0, 10)));
  // рядок з емодзі на початку вже має свій «маркер»; решті ставимо крапку
  $lines = array_map(fn($x) => (preg_match('/^[\p{L}\p{N}«"(]/u', trim((string)$x)) ? '• ' : '') . trim((string)$x), (array)$L['lines']);
  return ['name' => 'Що нового ' . $upd['id'], 'lang' => $lang, 'subject' => $subject . ' · ' . $date, 'preheader' => mb_substr(trim((string)($L['lines'][0] ?? '')), 0, 170),
    'heading' => ($upd['icon'] ?? '✨') . ' ' . $heading, 'body' => $intro . "\n\n" . implode("\n\n", $lines), 'button' => $btn, 'url' => str_starts_with((string)($upd['link'] ?? ''), 'http') ? (string)$upd['link'] : site_url() . ((string)($upd['link'] ?? '') ?: '#/whatsnew'), 'footer' => $footer, 'apps' => 1, 'update_id' => (string)$upd['id']];
}
// хештеги (ведуть на пошук однодумців на сайті) і посилання на статтю мовою одержувача: [html, текст]
function ms_news_extra(array $upd, string $lang): array {
  $read = ['uk' => 'Читати статтю на сайті', 'en' => 'Read the article on the website', 'no' => 'Les artikkelen på nettsiden', 'ar' => 'اقرأ المقال على الموقع', 'de' => 'Artikel auf der Website lesen', 'pl' => 'Przeczytaj artykuł na stronie', 'tr' => 'Yazıyı sitede oku', 'lt' => 'Skaityti straipsnį svetainėje'][$lang] ?? 'Read the article on the website';
  $page = (string)($upd['langs'][$lang]['url'] ?? $upd['langs']['en']['url'] ?? site_url() . '#/whatsnew');
  $e = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
  $tags = array_values(array_filter((array)($upd['tags'] ?? []), fn($t) => is_string($t) && preg_match('/^[\p{L}\p{N}_-]{2,24}$/u', $t)));
  $html = ($tags ? '<p style="margin:18px 0 0;font-size:14px;line-height:1.9">' . implode(' ', array_map(fn($t) => '<a href="' . $e(site_url() . '#/players/tag/' . rawurlencode($t)) . '" style="display:inline-block;margin:0 6px 4px 0;padding:2px 10px;border:2px solid #141414;border-radius:999px;background:#fff3c4;color:#141414;font-weight:800;text-decoration:none">#' . $e($t) . '</a>', $tags)) . '</p>' : '')
    . '<p style="margin:12px 0 0;font-size:15px"><a href="' . $e($page) . '" style="color:#1565c0;font-weight:800">' . $e($read) . ' →</a></p>';
  $text = ($tags ? "\n\n" . implode(' ', array_map(fn($t) => '#' . $t, $tags)) : '') . "\n" . $read . ': ' . $page;
  return [$html, $text];
}
// усі підписані — у кампанії по 50 (обмеження одної кампанії); повертає id створених чернеток
function ms_news_prepare(string $updateId, int $by): array {
  $upd = ms_update($updateId);
  if (!$upd) throw new InvalidArgumentException('Статтю не знайдено. Зберіть сайт заново (tools/build.js), щоб оновився data/updates.json.');
  $aud = ms_audience();
  if (!$aud) throw new InvalidArgumentException('Немає жодного підписаного одержувача.');
  $chunks = array_chunk(array_map(fn($u) => (int)$u['id'], $aud), 50);
  $ids = [];
  foreach ($chunks as $i => $chunk) {
    $title = '✨ Що нового ' . date('d.m', strtotime(substr($updateId, 0, 10))) . (count($chunks) > 1 ? ' (' . ($i + 1) . '/' . count($chunks) . ')' : '');
    $ids[] = ms_save_draft(0, $title, ms_news_content($upd, 'uk'), $chunk, $by, 'news-' . preg_replace('/[^0-9-]/', '', $updateId) . '-' . ($i + 1) . '-' . bin2hex(random_bytes(6)));
  }
  return $ids;
}
// кампанії, уже створені для статті: id → статус і лічильники
function ms_news_campaigns(string $updateId): array {
  return q('SELECT c.id, c.title, c.status, (SELECT COUNT(*) FROM kl_mail_recipients r WHERE r.campaign_id = c.id) AS n, (SELECT COUNT(*) FROM kl_mail_recipients r WHERE r.campaign_id = c.id AND r.status = \'sent\') AS sent FROM kl_mail_campaigns c WHERE c.content LIKE ? ORDER BY c.id', ['%"update_id":"' . $updateId . '"%'])->fetchAll();
}
/* ---------- 🙏 Подяка тестувальникам ----------
   Пошти тестувальників (список Google Play) лежать у kl_testers; до них додаються всі, хто заходив
   із застосунку Android (поки він у закритому тестуванні, це теж тестувальники). Таблиця показує,
   хто був активний найостанніше; лист — кожному його мовою, з його власними днями на сайті. */
function ms_testers_save(string $raw): int {
  preg_match_all('/[^\s,;<>"\'()]+@[^\s,;<>"\'()]+/', $raw, $m);
  $emails = array_values(array_unique(array_filter(array_map(fn($x) => strtolower(trim($x, " .\t")), $m[0]), fn($x) => (bool)filter_var($x, FILTER_VALIDATE_EMAIL))));
  if (count($emails) > 1000) throw new InvalidArgumentException('Не більше 1000 адрес.');
  $old = [];
  foreach (q('SELECT email, added_at FROM kl_testers')->fetchAll() as $r) $old[$r['email']] = (int)$r['added_at'];
  db()->beginTransaction();
  try {
    q('DELETE FROM kl_testers');
    foreach ($emails as $em) q('INSERT INTO kl_testers (email, added_at) VALUES (?, ?)', [$em, $old[$em] ?? time()]);
    db()->commit();
  } catch (Throwable $e) { if (db()->inTransaction()) db()->rollBack(); throw $e; }
  return count($emails);
}
function ms_tester_emails(): array { return array_column(q('SELECT email FROM kl_testers ORDER BY email')->fetchAll(), 'email'); }
// усі тестувальники з акаунтами: активність, дні, час, остання подяка; найостанніше активні — першими
function ms_testers(): array {
  $emails = ms_tester_emails();
  $users = [];
  foreach (array_chunk($emails, 200) as $ch) foreach (q('SELECT * FROM kl_users WHERE LOWER(email) IN (' . implode(',', array_fill(0, count($ch), '?')) . ')', $ch)->fetchAll() as $u) $users[(int)$u['id']] = $u + ['src' => 'list'];
  foreach (q("SELECT * FROM kl_users WHERE id IN (SELECT user_id FROM kl_sessions WHERE ua LIKE '%; wv)%')")->fetchAll() as $u) if (!isset($users[(int)$u['id']])) $users[(int)$u['id']] = $u + ['src' => 'app'];
  $found = array_flip(array_map(fn($u) => strtolower((string)$u['email']), $users));
  $missing = array_values(array_filter($emails, fn($em) => !isset($found[$em])));
  $rows = [];
  if ($users) {
    $in = implode(',', array_map('intval', array_keys($users)));
    $data = $sess = $thanked = [];
    foreach (q("SELECT user_id, k, v FROM kl_user_data WHERE k IN ('days','usageSec') AND user_id IN ($in)")->fetchAll() as $d) $data[(int)$d['user_id']][$d['k']] = json_decode((string)$d['v'], true);
    foreach (q("SELECT user_id, MAX(last_seen) AS seen, SUM(CASE WHEN ua LIKE '%; wv)%' THEN 1 ELSE 0 END) AS app FROM kl_sessions WHERE user_id IN ($in) GROUP BY user_id")->fetchAll() as $s) $sess[(int)$s['user_id']] = $s;
    foreach (q("SELECT r.user_id, MAX(r.updated_at) AS t FROM kl_mail_recipients r JOIN kl_mail_campaigns c ON c.id = r.campaign_id WHERE r.status = 'sent' AND c.content LIKE ? AND r.user_id IN ($in) GROUP BY r.user_id", ['%"thanks":1%'])->fetchAll() as $t) $thanked[(int)$t['user_id']] = (int)$t['t'];
    $from30 = date('Y-m-d', strtotime('-29 days'));
    foreach ($users as $id => $u) {
      $days = ms_day_list($data[$id]['days'] ?? []);
      // остання активність з точністю до дня: день із прогресу, останній запит сесії або вхід
      $last = max($days ? end($days) : '', !empty($sess[$id]['seen']) ? date('Y-m-d', (int)$sess[$id]['seen']) : '', !empty($u['last_login']) ? date('Y-m-d', (int)$u['last_login']) : '');
      $why = empty($u['verified_at']) ? 'пошту не підтверджено' : (!empty($u['blocked_at']) ? 'заблоковано' : (empty($u['mail_ok']) ? 'відписалися від листів' : (!empty($u['is_demo']) ? 'демо-акаунт' : '')));
      $rows[] = ['id' => $id, 'name' => (string)$u['name'], 'email' => (string)$u['email'], 'lang' => (string)$u['lang'], 'src' => $u['src'], 'app' => (int)($sess[$id]['app'] ?? 0),
        'days' => count($days), 'n30' => count(array_filter($days, fn($d) => $d >= $from30)), 'last' => $last, 'sec' => (int)($data[$id]['usageSec'] ?? 0), 'thanked' => $thanked[$id] ?? 0, 'why' => $why];
    }
    usort($rows, fn($a, $b) => [$b['last'], $b['n30'], $b['days'], $b['sec']] <=> [$a['last'], $a['n30'], $a['days'], $a['sec']]);
    // 🏅 десятка: найостанніше активні з тих, кому можна написати; кому дякували за 14 днів — пропускаємо
    $n = 0;
    foreach ($rows as &$r) $r['top'] = ($r['why'] === '' && $r['days'] > 0 && $r['thanked'] < time() - 14 * 86400 && $n < 10) ? ++$n : 0;
    unset($r);
  }
  return ['rows' => $rows, 'missing' => $missing, 'listed' => count($emails)];
}
function ms_day_list($raw): array {
  $d = array_values(array_unique(array_filter((array)$raw, fn($x) => is_string($x) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $x))));
  sort($d);
  return $d;
}
// текст подяки: українська, англійська, норвезька; інші мови — англійською
function ms_thanks_content(string $lang): array {
  $T = [
    'uk' => ['Дякуємо, що тестуєте Комікс·Lab 🙏', 'Ваші активність і відгуки роблять навчання кращим для всіх.', '🙏 Дякуємо вам, {{name}}!',
      "Ви — серед найактивніших тестувальників Комікс·Lab. Кожен ваш візит, пройдений тест, прочитаний комікс і кожне повідомлення про помилку допомагають нам покращувати якість і логіку проєкту: знаходити й виправляти помилки, робити завдання зрозумілішими, а навчання — зручнішим.\n\nЗавдяки тестуванню кожне оновлення стає кращим. Дякуємо за ваш час, терпіння й чесні відгуки!\n\nЯкщо щось працює дивно чи незрозуміло або вам бракує якоїсь функції — натисніть «💌 Відгук» у меню сайту чи застосунку. Ми читаємо кожне повідомлення.",
      'Подивитися, що нового', "З вдячністю,\nРуслан Білогаш і команда Комікс·Lab"],
    'en' => ['Thank you for testing Komiks·Lab 🙏', 'Your activity and feedback make learning better for everyone.', '🙏 Thank you, {{name}}!',
      "You are one of the most active testers of Komiks·Lab. Every visit, every quiz you take, every comic you read and every bug you report helps us improve the quality and logic of the project: finding and fixing bugs, making exercises clearer and learning smoother.\n\nThanks to testing, every update gets better. Thank you for your time, patience and honest feedback!\n\nIf something works strangely, is unclear or you miss a feature, just tap «💌 Feedback» in the menu of the website or the app. We read every message.",
      'See what’s new', "With gratitude,\nRuslan Bilohash and the Komiks·Lab team"],
    'no' => ['Takk for at du tester Komiks·Lab 🙏', 'Aktiviteten og tilbakemeldingene dine gjør læringen bedre for alle.', '🙏 Tusen takk, {{name}}!',
      "Du er en av de mest aktive testerne av Komiks·Lab. Hvert besøk, hver prøve du tar, hver tegneserie du leser og hver feil du melder fra om hjelper oss å forbedre kvaliteten og logikken i prosjektet: finne og rette feil, gjøre oppgavene tydeligere og læringen enklere.\n\nTakket være testingen blir hver oppdatering bedre. Takk for tiden, tålmodigheten og de ærlige tilbakemeldingene dine!\n\nHvis noe virker rart, er uklart eller du savner en funksjon, trykk på «💌 Tilbakemelding» i menyen på nettsiden eller i appen. Vi leser hver melding.",
      'Se hva som er nytt', "Med takknemlighet\nRuslan Bilohash og Komiks·Lab-teamet"],
  ];
  $lang = isset($T[$lang]) ? $lang : 'en';
  [$subject, $pre, $heading, $body, $btn, $footer] = $T[$lang];
  return ['name' => 'Подяка тестувальникам', 'lang' => $lang, 'subject' => $subject, 'preheader' => $pre, 'heading' => $heading, 'body' => $body, 'button' => $btn, 'url' => site_url() . '#/whatsnew', 'footer' => $footer, 'apps' => 1, 'thanks' => 1];
}
// особистий внесок одержувача: дні на сайті, за місяць і активний час — [html, текст]
function ms_thanks_extra(int $uid, string $lang): array {
  if ($uid <= 0) return ['', ''];
  $v = [];
  foreach (q("SELECT k, v FROM kl_user_data WHERE user_id = ? AND k IN ('days','usageSec')", [$uid])->fetchAll() as $d) $v[$d['k']] = json_decode((string)$d['v'], true);
  $days = ms_day_list($v['days'] ?? []);
  $from30 = date('Y-m-d', strtotime('-29 days'));
  $n30 = count(array_filter($days, fn($d) => $d >= $from30));
  $sec = (int)($v['usageSec'] ?? 0);
  $L = ['uk' => ['Ваш внесок', 'днів на сайті', 'з них за 30 днів', 'активного часу', 'год', 'хв'],
        'en' => ['Your contribution', 'days on the site', 'in the last 30 days', 'of active time', 'h', 'min'],
        'no' => ['Ditt bidrag', 'dager på nettsiden', 'de siste 30 dagene', 'aktiv tid', 't', 'min']][$lang] ?? null;
  if (!$L || !$days) return ['', ''];
  $time = $sec >= 3600 ? ($lang === 'en' ? (string)round($sec / 3600, $sec < 36000 ? 1 : 0) : str_replace('.', ',', (string)round($sec / 3600, $sec < 36000 ? 1 : 0))) . ' ' . $L[4] : ($sec >= 60 ? (int)round($sec / 60) . ' ' . $L[5] : '');
  $cells = array_filter([[count($days), $L[1]], [$n30, $L[2]], [$time, $L[3]]], fn($c) => $c[0] !== '' && $c[0] !== 0);
  $e = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
  $html = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 4px;background:#fff3c4;border:3px solid #141414;border-radius:16px"><tr><td colspan="' . count($cells) . '" style="padding:12px 16px 0;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.04em">🏅 ' . $e($L[0]) . '</td></tr><tr>';
  foreach ($cells as [$n, $label]) $html .= '<td align="center" style="padding:8px 10px 14px"><div style="font-size:26px;font-weight:900;line-height:1.1">' . $e($n) . '</div><div style="font-size:12px;color:#5d5346;font-weight:700">' . $e($label) . '</div></td>';
  $html .= '</tr></table>';
  $text = "\n\n🏅 " . $L[0] . ': ' . implode(' · ', array_map(fn($c) => $c[0] . ' ' . $c[1], $cells));
  return [$html, $text];
}
// чернетка кампанії для обраних тестувальників (лише тих, кому можна написати)
function ms_thanks_prepare(array $ids, int $by): int {
  $ids = array_values(array_unique(array_filter(array_map('intval', $ids), fn($v) => $v > 0)));
  if (!$ids) throw new InvalidArgumentException('Оберіть хоча б одного тестувальника.');
  $ok = array_column(array_filter(ms_testers()['rows'], fn($r) => $r['why'] === ''), 'id');
  $ids = array_values(array_intersect($ids, $ok));
  if (!$ids) throw new InvalidArgumentException('Обраним тестувальникам лист надіслати не можна: пошту не підтверджено або вони відписалися.');
  return ms_save_draft(0, '🙏 Подяка тестувальникам · ' . date('d.m.Y'), ms_thanks_content('uk'), $ids, $by, 'thanks-' . bin2hex(random_bytes(12)));
}
/* ---------- 🖼 Фото в листі ----------
   Скриншот чи світлина — не вкладення, а картинка в тексті листа: файл лежить у api/data/mailimg,
   лист показує його через api/mailimg.php. Перекодовуємо через GD: зникають EXIF і геомітки,
   будь-який «не-картинковий» вміст не проходить, ширина — до 1200 px (чітко на ретині, легко в пошті). */
function ms_img_dir(): string { $d = __DIR__ . '/data/mailimg'; if (!is_dir($d)) @mkdir($d, 0755, true); return $d; }
function ms_img_url(string $f): string { return site_url() . 'api/mailimg.php?f=' . rawurlencode($f); }
function ms_img_ok(string $f): bool { return (bool)preg_match('/^[a-f0-9]{32}\.(png|jpg)$/', $f) && is_file(ms_img_dir() . '/' . $f); }
function ms_img_save(array $file): string {
  $err = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
  if ($err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE) throw new InvalidArgumentException('Файл завеликий: до 8 МБ.');
  if ($err !== UPLOAD_ERR_OK || !is_uploaded_file((string)($file['tmp_name'] ?? ''))) throw new InvalidArgumentException('Оберіть зображення.');
  if (filesize($file['tmp_name']) > 8 * 1024 * 1024) throw new InvalidArgumentException('Файл завеликий: до 8 МБ.');
  if (!function_exists('imagecreatefromstring')) throw new InvalidArgumentException('На сервері немає розширення GD — фото обробити не можна.');
  $bin = (string)file_get_contents($file['tmp_name']);
  $info = @getimagesizefromstring($bin);
  if (!$info || !in_array($info['mime'] ?? '', ['image/png', 'image/jpeg', 'image/webp', 'image/gif'], true)) throw new InvalidArgumentException('Підходять PNG, JPG, WebP або GIF.');
  if ($info[0] * $info[1] > 40000000) throw new InvalidArgumentException('Зображення завелике: понад 40 мегапікселів.');
  $img = @imagecreatefromstring($bin);
  if (!$img) throw new InvalidArgumentException('Не вдалося прочитати зображення.');
  // фото з телефона: повертаємо за EXIF, бо після перекодування мітки орієнтації вже не буде
  if ($info['mime'] === 'image/jpeg' && function_exists('exif_read_data')) {
    $o = (int)((@exif_read_data($file['tmp_name']) ?: [])['Orientation'] ?? 1);
    $deg = [3 => 180, 6 => -90, 8 => 90][$o] ?? 0;
    if ($deg && ($r = imagerotate($img, $deg, 0))) { imagedestroy($img); $img = $r; }
  }
  $w = imagesx($img); $h = imagesy($img);
  if ($w > 1200) {
    $nh = max(1, (int)round($h * 1200 / $w));
    $dst = imagecreatetruecolor(1200, $nh);
    imagealphablending($dst, false); imagesavealpha($dst, true);
    imagecopyresampled($dst, $img, 0, 0, 0, 0, 1200, $nh, $w, $h);
    imagedestroy($img); $img = $dst; $w = 1200; $h = $nh;
  }
  // скриншоти (PNG/GIF) лишаються PNG — текст чіткий; фото й завеликі PNG — JPEG на білому тлі
  $png = in_array($info['mime'], ['image/png', 'image/gif'], true);
  $out = '';
  if ($png) { ob_start(); imagepng($img, null, 9); $out = (string)ob_get_clean(); if (strlen($out) > 2500000) $png = false; }
  if (!$png) {
    $bg = imagecreatetruecolor($w, $h);
    imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
    imagecopy($bg, $img, 0, 0, 0, 0, $w, $h);
    ob_start(); imagejpeg($bg, null, 86); $out = (string)ob_get_clean();
    imagedestroy($bg);
  }
  imagedestroy($img);
  $f = bin2hex(random_bytes(16)) . ($png ? '.png' : '.jpg');
  if ($out === '' || @file_put_contents(ms_img_dir() . '/' . $f, $out) === false) throw new RuntimeException('mailimg: не вдалося записати файл');
  return $f;
}
// додати, замінити чи прибрати фото в чернетці (підпис можна змінити й без нового файлу)
function ms_campaign_image(int $id, ?array $file, string $caption, bool $remove, string $existing = ''): void {
  $caption = trim((string)preg_replace('/[\r\n\x00-\x1f]+/', ' ', $caption));
  if (mb_strlen($caption) > 200) throw new InvalidArgumentException('Підпис до фото — до 200 символів.');
  $new = (!$remove && $file && (int)($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) ? ms_img_save($file) : null;
  db()->beginTransaction();
  try {
    $c = ms_locked_campaign($id);
    if ($c['status'] !== 'draft') throw new InvalidArgumentException('Фото можна змінити лише в чернетці, до надсилання.');
    $data = json_decode($c['content'], true, 512, JSON_THROW_ON_ERROR);
    if ($remove) { $data['image'] = ''; $data['image_caption'] = ''; }
    else {
      if ($new) $data['image'] = $new;
      elseif ($existing !== '' && ms_img_ok($existing)) $data['image'] = $existing;   // уже завантажене вставкою (Ctrl+V)
      if (($data['image'] ?? '') === '') throw new InvalidArgumentException('Оберіть зображення.');
      $data['image_caption'] = $caption;
    }
    q('UPDATE kl_mail_campaigns SET content=?,updated_at=? WHERE id=?', [ms_json(ms_validate($data)), time(), $id]);
    db()->commit();
  } catch (Throwable $e) {
    if (db()->inTransaction()) db()->rollBack();
    if ($new) @unlink(ms_img_dir() . '/' . $new);
    throw $e;
  }
}
function ms_validate(array $data): array {
  $out=[];
  foreach (['name'=>120,'subject'=>160,'preheader'=>180,'heading'=>160,'body'=>10000,'button'=>60,'url'=>1000,'footer'=>500,'image'=>40,'image_caption'=>200] as $key=>$max) {
    $v=$data[$key]??'';
    if (!is_string($v)) throw new InvalidArgumentException('Некоректне поле: '.$key);
    $v=trim($v);
    if (mb_strlen($v)>$max) throw new InvalidArgumentException('Завелике поле: '.$key.' (до '.$max.' символів).');
    if (in_array($key,['name','subject','heading','button','url','image','image_caption'],true) && preg_match('/[\r\n\x00-\x1f]/',$v)) throw new InvalidArgumentException('Однорядкове поле містить недопустимі символи.');
    if (preg_match_all('/\{\{(.*?)\}\}/s',$v,$m)) foreach ($m[1] as $tag) if (!in_array($tag,['name','email'],true)) throw new InvalidArgumentException('Доступні підстановки: {{name}}, {{email}}.');
    $out[$key]=$v;
  }
  if ($out['image']!=='' && !preg_match('/^[a-f0-9]{32}\.(png|jpg)$/',$out['image'])) throw new InvalidArgumentException('Фото не знайдено. Завантажте його ще раз.');
  foreach (['name','subject','heading','body'] as $key) if ($out[$key]==='') throw new InvalidArgumentException('Заповніть назву, тему, заголовок і текст листа.');
  $lang=$data['lang']??'uk';
  if (!is_string($lang)||!in_array($lang,KL_LANGS,true)) throw new InvalidArgumentException('Оберіть мову листа.');
  $out['lang']=$lang;
  $out['apps']=(!isset($data['apps'])||(string)$data['apps']!=='0')?1:0;
  if(isset($data['thanks'])&&(string)$data['thanks']==='1')$out['thanks']=1;
  if(isset($data['update_id'])&&is_string($data['update_id'])&&preg_match('/^\d{4}-\d{2}-\d{2}(-\d{1,2})?$/',$data['update_id']))$out['update_id']=$data['update_id'];
  if ($out['button']!==''||$out['url']!=='') {
    $url=parse_url($out['url']);
    if ($out['button']===''||!filter_var($out['url'],FILTER_VALIDATE_URL)||!in_array(strtolower($url['scheme']??''),['http','https'],true)||isset($url['user'])||isset($url['pass'])) throw new InvalidArgumentException('Для кнопки потрібні підпис і повне посилання https:// або http://.');
  }
  return $out;
}
function ms_render(array $data,array $user,string $unsubscribe=''): array {
  // ✨ стаття «Що нового»: текст береться мовою одержувача (recipient.lang), а не з чернетки
  $newsX=['',''];
  if(!empty($data['update_id'])&&($upd=ms_update((string)$data['update_id']))){$lang=(string)($user['lang']??$data['lang']??'uk');$lang=in_array($lang,KL_LANGS,true)?$lang:'en';$data=array_merge($data,ms_news_content($upd,$lang));$newsX=ms_news_extra($upd,(string)$data['lang']);}
  // 🙏 подяка тестувальникам: текст мовою одержувача й блок «Ваш внесок» з його днями на сайті
  if(!empty($data['thanks'])&&(string)$data['thanks']==='1'){$data=array_merge($data,ms_thanks_content((string)($user['lang']??$data['lang']??'uk')));$newsX=ms_thanks_extra((int)($user['user_id']??0),(string)$data['lang']);}
  $t=ms_validate($data);
  $replace=['{{name}}'=>(string)($user['name']??'Олено'),'{{email}}'=>(string)($user['email']??'olena@example.test')];
  foreach (['subject','preheader','heading','body','button','footer','image_caption'] as $k) $t[$k]=strtr($t[$k],$replace);
  $t['subject']=mb_substr(preg_replace('/[\r\n\x00-\x1f]/',' ',$t['subject']),0,200);
  $unsub=['uk'=>'Відписатися від розсилки','no'=>'Meld deg av nyhetsbrevet','en'=>'Unsubscribe','de'=>'Abmelden','pl'=>'Zrezygnuj z subskrypcji','ar'=>'إلغاء الاشتراك','tr'=>'Abonelikten çık','lt'=>'Atsisakyti prenumeratos'][$t['lang']];
  $e=fn($s)=>ms_esc((string)$s);
  /* Лист у стилі сайту: жовта шапка з логотипом, чорна рамка, червона кнопка-пігулка; внизу —
     значки застосунку (якщо не вимкнено) і відписка. Таблиці й інлайн-стилі — інакше пошта зламає верстку. */
  $site=site_url();
  // 🖼 фото в тексті листа (не вкладення): клік відкриває повний розмір
  $imgH='';$imgT='';
  if($t['image']!==''&&ms_img_ok($t['image'])){$u=ms_img_url($t['image']);$imgH='<p style="margin:22px 0 0"><a href="'.$e($u).'" style="text-decoration:none"><img src="'.$e($u).'" width="540" alt="'.$e($t['image_caption']?:$t['heading']).'" style="display:block;width:100%;max-width:540px;height:auto;border:3px solid #141414;border-radius:14px"></a></p>'.($t['image_caption']!==''?'<p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#5d5346;text-align:center">'.$e($t['image_caption']).'</p>':'');$imgT="\n\n🖼 ".($t['image_caption']!==''?$t['image_caption'].': ':'').$u;}
  $html='<!doctype html><html lang="'.$e($t['lang']).'" dir="'.($t['lang']==='ar'?'rtl':'ltr').'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>'.$e($t['subject']).'</title></head>'
    .'<body style="margin:0;padding:0;background:#fff8ea;color:#141414;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">'.$e($t['preheader']).'</div>'
    .'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff8ea"><tr><td align="center" style="padding:24px 12px">'
    .'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:4px solid #141414;border-radius:22px;overflow:hidden">'
    .'<tr><td style="background:#ffd23f;padding:18px 26px;border-bottom:4px solid #141414"><a href="'.$e($site).'" style="color:#141414;text-decoration:none;font-size:24px;font-weight:900">💬 Komiks<span style="color:#ee4035">·Lab</span></a><div style="font-size:12px;font-weight:700;color:#5d5346;margin-top:2px">Learning Norwegian</div></td></tr>'
    .'<tr><td style="padding:28px 26px 10px"><h1 style="font-size:26px;line-height:1.25;margin:0 0 16px">'.$e($t['heading']).'</h1><div style="font-size:16px;line-height:1.65;overflow-wrap:anywhere">'.nl2br($e($t['body'])).'</div>'.$imgH.$newsX[0];
  if($t['url']!=='')$html.='<p style="margin:26px 0"><a href="'.$e($t['url']).'" style="display:inline-block;background:#ee4035;color:#ffffff;font-weight:900;font-size:17px;text-decoration:none;padding:14px 26px;border-radius:999px;border:3px solid #141414">'.$e($t['button']).'</a></p>';
  if($t['footer']!=='')$html.='<p style="font-size:14px;color:#5d5346;line-height:1.6;margin:0 0 14px">'.nl2br($e($t['footer'])).'</p>';
  if(!empty($t['apps'])&&function_exists('mail_apps_block'))$html.=mail_apps_block($t['lang']);
  $html.='</td></tr><tr><td style="padding:14px 26px 20px;border-top:2px dashed #e0d6bf;font-size:12px;line-height:1.6;color:#777">Komiks·Lab · <a href="'.$e($site).'" style="color:#1565c0">'.$e(preg_replace('~^https?://~','',rtrim($site,'/'))).'</a><br><a style="color:#5d5346" href="'.$e($unsubscribe?:'#unsubscribe-preview').'">'.$e($unsub).'</a></td></tr></table></td></tr></table></body></html>';
  $text=$t['heading']."\n\n".$t['body'].$imgT.$newsX[1].($t['url']!==''?"\n\n".$t['button'].': '.$t['url']:'')."\n\n".$t['footer'].(!empty($t['apps'])&&function_exists('mail_apps_plain')?mail_apps_plain($t['lang']):'')."\n".$unsub.': '.($unsubscribe?:'[попередній перегляд]');
  return ['subject'=>$t['subject'],'html'=>$html,'text'=>$text];
}
function ms_templates(): array {return q('SELECT * FROM kl_mail_templates WHERE active=1 ORDER BY id')->fetchAll();}
function ms_template_save(int $id,array $data): int {
  $t=ms_validate($data);
  if($id){if(!one('SELECT id FROM kl_mail_templates WHERE id=? AND active=1',[$id]))throw new InvalidArgumentException('Шаблон не знайдено.');q('UPDATE kl_mail_templates SET name=?,content=?,updated_at=? WHERE id=?',[$t['name'],ms_json($t),time(),$id]);}
  else {q('INSERT INTO kl_mail_templates (name,content,updated_at) VALUES (?,?,?)',[$t['name'],ms_json($t),time()]);$id=(int)db()->lastInsertId();}
  return $id;
}
function ms_audience(array $filters=[]): array {
  $w=['u.verified_at IS NOT NULL','u.blocked_at IS NULL','u.mail_ok=1','(u.is_demo IS NULL OR u.is_demo=0)'];$a=[];
  $s=trim((string)($filters['q']??''));if($s!==''){$w[]='(u.name LIKE ? OR u.email LIKE ?)';$a[]='%'.$s.'%';$a[]='%'.$s.'%';}
  $lang=(string)($filters['lang']??'');if(in_array($lang,KL_LANGS,true)){$w[]='u.lang=?';$a[]=$lang;}
  if(($filters['role']??'')==='premium')$w[]='u.premium=1';
  if(($filters['role']??'')==='teacher')$w[]='u.is_teacher=1';
  $idle=(int)($filters['idle']??0);if($idle>0){$w[]='COALESCE(u.last_login,u.created_at)<?';$a[]=time()-min(365,$idle)*86400;}
  if(($filters['sent']??'')==='never')$w[]='NOT EXISTS (SELECT 1 FROM kl_mailouts m WHERE m.user_id=u.id AND m.ok=1)';
  if(($filters['sent']??'')==='recent'){$w[]='EXISTS (SELECT 1 FROM kl_mailouts m WHERE m.user_id=u.id AND m.ok=1 AND m.sent_at>?)';$a[]=time()-7*86400;}
  if(($filters['sent']??'')==='notrecent'){$w[]='NOT EXISTS (SELECT 1 FROM kl_mailouts m WHERE m.user_id=u.id AND m.ok=1 AND m.sent_at>?)';$a[]=time()-7*86400;}
  return q('SELECT u.id,u.name,u.email,u.lang,u.last_login,u.created_at,u.premium,u.is_teacher,(SELECT MAX(sent_at) FROM kl_mailouts m WHERE m.user_id=u.id AND m.ok=1) AS last_sent FROM kl_users u WHERE '.implode(' AND ',$w).' ORDER BY u.name,u.id',$a)->fetchAll();
}
function ms_campaign(int $id): array { $c=one('SELECT * FROM kl_mail_campaigns WHERE id=?',[$id]);if(!$c)throw new InvalidArgumentException('Кампанію не знайдено.');return $c; }
/** Both launch and draft editing lock the same row until their transaction commits. */
function ms_locked_campaign(int $id): array {
  if(!db()->inTransaction())throw new LogicException('Campaign lock requires a transaction');
  $suffix=db()->getAttribute(PDO::ATTR_DRIVER_NAME)==='mysql'?' FOR UPDATE':'';
  $c=one('SELECT * FROM kl_mail_campaigns WHERE id=?'.$suffix,[$id]);
  if(!$c)throw new InvalidArgumentException('Кампанію не знайдено.');return $c;
}
function ms_recipients(int $id): array {return q('SELECT * FROM kl_mail_recipients WHERE campaign_id=? ORDER BY id',[$id])->fetchAll();}
function ms_attempts(int $rid): array {return q('SELECT * FROM kl_mail_attempts WHERE recipient_id=? ORDER BY id DESC',[$rid])->fetchAll();}
function ms_save_draft(int $id,string $title,array $data,array $ids,int $by,string $key): int {
  $t=ms_validate($data);$title=trim($title);
  if($title===''||mb_strlen($title)>120)throw new InvalidArgumentException('Назва кампанії: від 1 до 120 символів.');
  if(!preg_match('/^[a-zA-Z0-9-]{8,64}$/',$key))throw new InvalidArgumentException('Оновіть сторінку та повторіть дію.');
  $ids=array_values(array_unique(array_filter(array_map('intval',$ids),fn($v)=>$v>0)));
  if(count($ids)>50)throw new InvalidArgumentException('Оберіть не більше 50 одержувачів на кампанію.');
  $aud=array_filter(ms_audience(),fn($u)=>in_array((int)$u['id'],$ids,true));
  db()->beginTransaction();
  try {
    if(!$id&&($old=one('SELECT id FROM kl_mail_campaigns WHERE request_key=?',[$key]))){db()->commit();return (int)$old['id'];}
    if($id){
      if(ms_locked_campaign($id)['status']!=='draft')throw new InvalidArgumentException('Запущену кампанію змінити не можна. Створіть копію.');
      q("UPDATE kl_mail_campaigns SET title=?,content=?,updated_at=? WHERE id=? AND status='draft'",[$title,ms_json($t),time(),$id]);
      q('DELETE FROM kl_mail_recipients WHERE campaign_id=?',[$id]);
    } else {q('INSERT INTO kl_mail_campaigns (request_key,title,content,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?)',[$key,$title,ms_json($t),$by,time(),time()]);$id=(int)db()->lastInsertId();}
    foreach($aud as $u)q('INSERT INTO kl_mail_recipients (campaign_id,user_id,name,email,lang,error,updated_at) VALUES (?,?,?,?,?,?,?)',[$id,$u['id'],$u['name'],$u['email'],$u['lang'],'',time()]);
    db()->commit();return $id;
  } catch(Throwable $e){if(db()->inTransaction())db()->rollBack();throw $e;}
}
function ms_counts(int $id): array {
  $out=array_fill_keys(['queued','sending','sent','failed','skipped'],0);
  foreach(q('SELECT status,COUNT(*) AS n FROM kl_mail_recipients WHERE campaign_id=? GROUP BY status',[$id])->fetchAll() as $r)$out[$r['status']]=(int)$r['n'];
  return $out;
}
function ms_start(int $id): void {
  db()->beginTransaction();
  try {
    ms_locked_campaign($id);$n=ms_counts($id);
    if(!$n['queued'])throw new InvalidArgumentException('У черзі немає одержувачів.');
    q("UPDATE kl_mail_campaigns SET status='running',updated_at=? WHERE id=? AND status IN ('draft','paused','running')",[time(),$id]);
    db()->commit();
  }catch(Throwable $e){if(db()->inTransaction())db()->rollBack();throw $e;}
}
function ms_pause(int $id): void {q("UPDATE kl_mail_campaigns SET status='paused',updated_at=? WHERE id=? AND status='running'",[time(),$id]);}
function ms_retry(int $id): void {
  $c=ms_campaign($id);
  if($c['locked_at']>time()-120)throw new InvalidArgumentException('Зачекайте завершення поточного листа.');
  q("UPDATE kl_mail_recipients SET status='queued',updated_at=? WHERE campaign_id=? AND status='failed'",[time(),$id]);
  if(ms_counts($id)['queued'])q("UPDATE kl_mail_campaigns SET status='paused',updated_at=? WHERE id=? AND status<>'draft'",[time(),$id]);
}
/** Existing SMTP client reports 'smtp data:' after writing DATA. Empty/unknown reply is ambiguous. */
function ms_transport_result(bool $ok,string $error): array {
  if($ok)return ['sent',''];
  $certain=preg_match('/^smtp data:\s*[45][0-9]{2}(?:\s|$)/i',$error)
    ||str_starts_with($error,'smtp connect:')||str_starts_with($error,'smtp starttls')
    ||str_starts_with($error,'smtp:')||str_starts_with($error,'PHP mail() повернув false');
  // The legacy AUTH client can append a base64 credential as its command label.
  $safe=preg_replace('/ after .*$/s','',$error);
  return [$certain?'failed':'sending',mb_substr($safe?:'Немає підтвердження поштового сервера. Перевірте результат перед повторенням.',0,1000)];
}
function ms_step(int $id): array {
  $now=time();
  // One worker per campaign. An expired lock does not reclaim a 'sending' recipient.
  $lock=q("UPDATE kl_mail_campaigns SET locked_at=? WHERE id=? AND status='running' AND (locked_at=0 OR locked_at<?)",[$now,$id,$now-120]);
  if(!$lock->rowCount())return ['counts'=>ms_counts($id),'status'=>ms_campaign($id)['status'],'busy'=>true];
  try {
    $r=one("SELECT * FROM kl_mail_recipients WHERE campaign_id=? AND status='queued' ORDER BY id LIMIT 1",[$id]);
    if($r){
      $claim=q("UPDATE kl_mail_recipients SET status='sending',updated_at=? WHERE id=? AND status='queued'",[$now,$r['id']]);
      if($claim->rowCount()){
        $u=one('SELECT * FROM kl_users WHERE id=?',[$r['user_id']]);
        if(!$u||!$u['verified_at']||$u['blocked_at']||!$u['mail_ok']||$u['is_demo']||$u['email']!==$r['email']) {
          q("UPDATE kl_mail_recipients SET status='skipped',error=?,updated_at=? WHERE id=?",['Одержувач відписався, заблокований, видалений, непідтверджений або змінив адресу.',time(),$r['id']]);
        } else {
          $t=json_decode(ms_campaign($id)['content'],true,512,JSON_THROW_ON_ERROR);
          $unsub=site_url().'api/auth.php?action=unsub&t='.new_token((int)$r['user_id'],'unsub',180*86400);
          $mail=ms_render($t,$r,$unsub);
          q("INSERT INTO kl_mail_attempts (recipient_id,subject,html,body,status,error,created_at) VALUES (?,?,?,?,'sending','',?)",[$r['id'],$mail['subject'],$mail['html'],$mail['text'],$now]);
          $attempt=(int)db()->lastInsertId();
          // A crash or exception leaves 'sending': SMTP acceptance may be ambiguous.
          $ok=send_mail($r['email'],$mail['subject'],$mail['html'],$mail['text']);
          [$status,$err]=ms_transport_result($ok,mail_error());
          db()->beginTransaction();
          try {
            q('UPDATE kl_mail_attempts SET status=?,error=?,finished_at=? WHERE id=?',[$status,$err,time(),$attempt]);
            q('UPDATE kl_mail_recipients SET status=?,error=?,updated_at=? WHERE id=?',[$status,$err,time(),$r['id']]);
            q('INSERT INTO kl_mailouts (user_id,kind,sent_at,ok) VALUES (?,?,?,?)',[$r['user_id'],'studio',time(),$ok?1:0]);
            db()->commit();
          }catch(Throwable $e){if(db()->inTransaction())db()->rollBack();throw $e;}
        }
      }
    }
    $n=ms_counts($id);
    if(!$n['queued']&&!$n['sending'])q("UPDATE kl_mail_campaigns SET status='completed',updated_at=? WHERE id=? AND status<>'draft'",[time(),$id]);
    return ['counts'=>$n,'status'=>ms_campaign($id)['status']];
  } finally {q('UPDATE kl_mail_campaigns SET locked_at=0 WHERE id=? AND locked_at=?',[$id,$now]);}
}
