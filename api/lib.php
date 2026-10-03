<?php
/* Комікс·Lab — спільне ядро API (PHP 8.1+, MySQL/MariaDB або SQLite для локальних тестів).
 * Підключається з auth.php, players.php, wall.php. Напряму не відкривається.
 *
 * Безпека:
 *  - усі запити до БД — підготовлені (PDO, emulate prepares off);
 *  - паролі — password_hash (Argon2id, якщо доступний; інакше bcrypt);
 *  - сесія — випадковий токен у cookie HttpOnly + Secure + SameSite=Lax, у БД лише sha256;
 *  - CSRF — кожен POST має заголовок X-Komiks: 1 (крос-доменний запит так не надішле) + перевірка Origin;
 *  - ліміти частоти в таблиці rate; помилки без деталей назовні (деталі — в error_log).
 */
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(404); exit; }

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('Cache-Control: no-store');

/* ---------- 📱 доступ із мобільного застосунку ----------
   Застосунок (Capacitor) показує ті самі сторінки, але з іншого джерела, тому
   без цих заголовків усі запити до api/… блокує сама браузерна політика.
   Список закритий: жодних «*», бо разом із запитом іде кука сесії. */
const APP_ORIGINS = ['capacitor://localhost', 'ionic://localhost', 'https://localhost', 'http://localhost'];
function app_origin(): string {
  $o = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($o === '') return '';
  if (in_array($o, APP_ORIGINS, true)) return $o;
  // локальний перегляд застосунку: http://localhost:8970 і подібні порти
  if (preg_match('~^http://localhost(:\d+)?$~', $o)) return $o;
  foreach ((array)(cfg('app_origins') ?? []) as $extra) if ($o === $extra) return $o;
  return '';
}
$__appOrigin = app_origin();
if ($__appOrigin !== '') {
  header('Access-Control-Allow-Origin: ' . $__appOrigin);
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Headers: Content-Type, X-Komiks');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Access-Control-Max-Age: 86400');
  header('Vary: Origin');
}
// попередній запит браузера перед справжнім POST — відповідаємо й виходимо
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code($__appOrigin === '' ? 403 : 204); exit; }

function out(array $a, int $status = 200): void { http_response_code($status); echo json_encode($a, JSON_UNESCAPED_UNICODE); exit; }
function fail(string $err, int $status = 400, array $extra = []): void { out(['ok' => false, 'error' => $err] + $extra, $status); }

/* ---------- налаштування ---------- */
function cfg(?string $key = null) {
  static $c = null;
  if ($c === null) {
    /* На сервері налаштування лежать у config.php. Локально ми свідомо тримаємо їх у
       config.local.php: тоді config.php просто не існує в репозиторії й не може випадково
       потрапити на сервер і затерти справжні паролі. */
    $file = __DIR__ . '/config.php';
    if (!is_file($file)) $file = __DIR__ . '/config.local.php';
    if (!is_file($file)) fail('not_configured', 503);
    $c = require $file;
    if (!is_array($c)) fail('not_configured', 503);
  }
  if ($key === null) return $c;
  $v = $c;
  foreach (explode('.', $key) as $k) { if (!is_array($v) || !array_key_exists($k, $v)) return null; $v = $v[$k]; }
  return $v;
}
/* Ключ до подробиць health.php. Похідний від config.secret, тож нічого не треба
   налаштовувати окремо, і він змінюється разом із секретом. Окремий префікс — щоб
   цей ключ не збігався з жодним іншим похідним від того ж секрету. */
function health_key(): string { return substr(hash_hmac('sha256', 'health', (string)cfg('secret')), 0, 32); }
function site_url(): string { return rtrim((string)cfg('site_url'), '/') . '/'; }

set_exception_handler(function (Throwable $e) { error_log('[komiks-api] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine()); fail('server', 500); });

/* ---------- база даних ---------- */
function db(): PDO {
  static $pdo = null;
  if ($pdo) return $pdo;
  $d = cfg('db');
  $pdo = new PDO($d['dsn'], $d['user'] ?? null, $d['pass'] ?? null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false,
  ]);
  if (is_mysql()) $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
  else $pdo->exec('PRAGMA foreign_keys = ON');
  migrate($pdo);
  seed_demo_users();
  return $pdo;
}
function is_mysql(): bool { return str_starts_with((string)cfg('db.dsn'), 'mysql:'); }
function q(string $sql, array $args = []): PDOStatement { $st = db()->prepare($sql); $st->execute($args); return $st; }
function one(string $sql, array $args = []): ?array { $r = q($sql, $args)->fetch(); return $r ?: null; }
// вставка або оновлення за первинним ключем (MySQL: ON DUPLICATE KEY, SQLite: ON CONFLICT)
function upsert(string $table, array $keys, array $row): void {
  $cols = array_keys($row);
  $ph = implode(',', array_fill(0, count($cols), '?'));
  $upd = array_values(array_diff($cols, $keys));
  if (is_mysql()) $sql = "INSERT INTO $table (" . implode(',', $cols) . ") VALUES ($ph) ON DUPLICATE KEY UPDATE " . implode(',', array_map(fn($c) => "$c=VALUES($c)", $upd));
  else $sql = "INSERT INTO $table (" . implode(',', $cols) . ") VALUES ($ph) ON CONFLICT(" . implode(',', $keys) . ") DO UPDATE SET " . implode(',', array_map(fn($c) => "$c=excluded.$c", $upd));
  q($sql, array_values($row));
}

const SCHEMA_VERSION = 16;
function migrate(PDO $pdo): void {
  $my = is_mysql();
  $pk = $my ? 'INT UNSIGNED AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  $eng = $my ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';
  $pdo->exec("CREATE TABLE IF NOT EXISTS kl_meta (k VARCHAR(40) PRIMARY KEY, v VARCHAR(255) NOT NULL)$eng");
  $st = $pdo->prepare('SELECT v FROM kl_meta WHERE k = ?'); $st->execute(['schema']);
  if ((int)($st->fetchColumn() ?: 0) >= SCHEMA_VERSION) return;
  $uid = $my ? 'INT UNSIGNED' : 'INTEGER';
  $tables = [
    "CREATE TABLE IF NOT EXISTS kl_users (id $pk, email VARCHAR(190) NOT NULL UNIQUE, name VARCHAR(40) NOT NULL, pass_hash VARCHAR(255) NOT NULL, lang VARCHAR(5) NOT NULL DEFAULT 'en', friend_code CHAR(6) NOT NULL UNIQUE, share_profile TINYINT NOT NULL DEFAULT 0, verified_at INT NULL, created_at INT NOT NULL, last_login INT NULL, consent_at INT NOT NULL)$eng",
    "CREATE TABLE IF NOT EXISTS kl_tokens (token_hash CHAR(64) PRIMARY KEY, user_id $uid NOT NULL, kind VARCHAR(12) NOT NULL, expires_at INT NOT NULL, used_at INT NULL)$eng",
    "CREATE TABLE IF NOT EXISTS kl_sessions (token_hash CHAR(64) PRIMARY KEY, user_id $uid NOT NULL, created_at INT NOT NULL, expires_at INT NOT NULL, last_seen INT NOT NULL, ua VARCHAR(190) NOT NULL DEFAULT '')$eng",
    "CREATE TABLE IF NOT EXISTS kl_user_data (user_id $uid NOT NULL, k VARCHAR(64) NOT NULL, v MEDIUMTEXT NOT NULL, updated_at INT NOT NULL, PRIMARY KEY (user_id, k))$eng",
    "CREATE TABLE IF NOT EXISTS kl_rate (k VARCHAR(100) PRIMARY KEY, n INT NOT NULL, reset_at INT NOT NULL)$eng",
    // хто, що і коли отримав: без цього легко написати ту саму людину двічі за день
    "CREATE TABLE IF NOT EXISTS kl_mailouts (id $pk, user_id $uid NOT NULL, kind VARCHAR(16) NOT NULL, sent_at INT NOT NULL, ok TINYINT NOT NULL DEFAULT 1)$eng",
    "CREATE TABLE IF NOT EXISTS kl_players (code CHAR(6) PRIMARY KEY, user_id $uid NULL, secret_hash CHAR(64) NOT NULL, name VARCHAR(40) NOT NULL, avatar VARCHAR(80) NOT NULL, learn VARCHAR(80) NOT NULL, level VARCHAR(3) NOT NULL, stars INT NOT NULL, badges INT NOT NULL, streak INT NOT NULL, act VARCHAR(16) NOT NULL, snap TEXT NOT NULL, seen INT NOT NULL, updated INT NOT NULL, since INT NOT NULL)$eng",
    "CREATE TABLE IF NOT EXISTS kl_walls (owner CHAR(6) PRIMARY KEY, secret_hash CHAR(64) NULL, open TINYINT NOT NULL DEFAULT 1)$eng",
    "CREATE TABLE IF NOT EXISTS kl_comments (id CHAR(12) PRIMARY KEY, owner CHAR(6) NOT NULL, name VARCHAR(40) NOT NULL, avatar VARCHAR(80) NOT NULL, text VARCHAR(1200) NOT NULL, akey_hash CHAR(64) NOT NULL, created_at INT NOT NULL)$eng",
    "CREATE TABLE IF NOT EXISTS kl_captcha_used (nonce CHAR(16) PRIMARY KEY, exp INT NOT NULL)$eng",
    // v3: запрошення від преміум-друзів, тимчасові блокування стін, попередження модератора
    "CREATE TABLE IF NOT EXISTS kl_invites (code_hash CHAR(64) PRIMARY KEY, inviter_id $uid NOT NULL, created_at INT NOT NULL, expires_at INT NOT NULL, used_by $uid NULL, used_at INT NULL)$eng",
    "CREATE TABLE IF NOT EXISTS kl_bans (id $pk, user_id $uid NULL, ip_hash CHAR(64) NULL, until_at INT NOT NULL, reason VARCHAR(120) NOT NULL DEFAULT '', by_id $uid NULL, created_at INT NOT NULL)$eng",
    // v4: особисті повідомлення й блокування
    "CREATE TABLE IF NOT EXISTS kl_messages (id $pk, from_id $uid NOT NULL, to_id $uid NOT NULL, text VARCHAR(1000) NOT NULL, created_at INT NOT NULL, read_at INT NULL, reported_at INT NULL, hidden_from TINYINT NOT NULL DEFAULT 0, hidden_to TINYINT NOT NULL DEFAULT 0)$eng",
    "CREATE TABLE IF NOT EXISTS kl_blocks (user_id $uid NOT NULL, blocked_id $uid NOT NULL, created_at INT NOT NULL, PRIMARY KEY (user_id, blocked_id))$eng",
    // v8: відгуки розробнику (помилка / ідея / тема для навчання)
    "CREATE TABLE IF NOT EXISTS kl_feedback (id $pk, kind VARCHAR(10) NOT NULL, text VARCHAR(2000) NOT NULL, email VARCHAR(190) NOT NULL DEFAULT '', page VARCHAR(190) NOT NULL DEFAULT '', lang VARCHAR(5) NOT NULL DEFAULT '', user_id $uid NULL, ip_hash CHAR(64) NULL, ua VARCHAR(190) NOT NULL DEFAULT '', created_at INT NOT NULL, done_at INT NULL)$eng",
    // v9: підписка Преміум (Stripe). Номер картки в нас не зберігається ніколи — лише id клієнта й підписки
    "CREATE TABLE IF NOT EXISTS kl_billing (user_id $uid NOT NULL PRIMARY KEY, customer VARCHAR(64) NOT NULL DEFAULT '', subscription VARCHAR(64) NOT NULL DEFAULT '', status VARCHAR(24) NOT NULL DEFAULT '', period_end INT NULL, updated_at INT NOT NULL)$eng",
    // v11: заявки вчителів — преміум безкоштовно після перевірки людиною
    "CREATE TABLE IF NOT EXISTS kl_teachers (user_id $uid NOT NULL PRIMARY KEY, school VARCHAR(120) NOT NULL DEFAULT '', role VARCHAR(80) NOT NULL DEFAULT '', country VARCHAR(60) NOT NULL DEFAULT '', proof VARCHAR(1200) NOT NULL DEFAULT '', link VARCHAR(190) NOT NULL DEFAULT '', file VARCHAR(120) NOT NULL DEFAULT '', file_name VARCHAR(120) NOT NULL DEFAULT '', file_type VARCHAR(40) NOT NULL DEFAULT '', status VARCHAR(10) NOT NULL DEFAULT 'pending', note VARCHAR(300) NOT NULL DEFAULT '', created_at INT NOT NULL, decided_at INT NULL, by_id $uid NULL)$eng",
    "CREATE TABLE IF NOT EXISTS kl_notices (id $pk, user_id $uid NULL, ip_hash CHAR(64) NULL, kind VARCHAR(12) NOT NULL, text VARCHAR(300) NOT NULL DEFAULT '', by_id $uid NULL, created_at INT NOT NULL, seen_at INT NULL)$eng",
    // v12: 🔔 стрічка друзів — подія, її доставка й вподобайки
    "CREATE TABLE IF NOT EXISTS kl_events (id $pk, owner_id $uid NOT NULL, kind VARCHAR(12) NOT NULL, ref VARCHAR(80) NOT NULL DEFAULT '', text VARCHAR(160) NOT NULL DEFAULT '', likes INT NOT NULL DEFAULT 0, created_at INT NOT NULL)$eng",
    "CREATE TABLE IF NOT EXISTS kl_event_to (event_id INT NOT NULL, user_id $uid NOT NULL, seen_at INT NULL, PRIMARY KEY (event_id, user_id))$eng",
    "CREATE TABLE IF NOT EXISTS kl_event_likes (event_id INT NOT NULL, user_id $uid NOT NULL, created_at INT NOT NULL, PRIMARY KEY (event_id, user_id))$eng",
  ];
  foreach ($tables as $t) $pdo->exec($t);
  foreach (['CREATE INDEX kl_tokens_user ON kl_tokens (user_id)', 'CREATE INDEX kl_sessions_user ON kl_sessions (user_id)', 'CREATE INDEX kl_comments_owner ON kl_comments (owner, created_at)', 'CREATE INDEX kl_players_seen ON kl_players (seen)'] as $ix) {
    try { $pdo->exec($ix); } catch (Throwable $e) { /* індекс уже є */ }
  }
  // v2: ролі та блокування (ALTER — лише якщо стовпця ще немає)
  foreach (['is_admin TINYINT NOT NULL DEFAULT 0', 'blocked_at INT NULL', 'is_moderator TINYINT NOT NULL DEFAULT 0', 'premium TINYINT NOT NULL DEFAULT 0', 'can_invite TINYINT NOT NULL DEFAULT 0', 'msg_pref TINYINT NOT NULL DEFAULT 1', 'premium_until INT NULL', "invited_by $uid NULL", 'is_demo TINYINT NOT NULL DEFAULT 0', 'founder INT NULL', 'is_teacher TINYINT NOT NULL DEFAULT 0'] as $col) {
    try { $pdo->exec("ALTER TABLE kl_users ADD COLUMN $col"); } catch (Throwable $e) { /* уже є */ }
  }
  try { $pdo->exec('ALTER TABLE kl_players ADD COLUMN active INT NOT NULL DEFAULT 0'); } catch (Throwable $e) { /* уже є */ }
  // v12: хештеги профілю — за ними шукають однодумців
  try { $pdo->exec("ALTER TABLE kl_players ADD COLUMN tags VARCHAR(120) NOT NULL DEFAULT ''"); } catch (Throwable $e) { /* уже є */ }
  // v10: вкладення до відгуку (фото, pdf, txt)
  foreach (['file VARCHAR(120) NOT NULL DEFAULT \'\'', 'file_name VARCHAR(120) NOT NULL DEFAULT \'\'', 'file_type VARCHAR(40) NOT NULL DEFAULT \'\'', 'file_size INT NOT NULL DEFAULT 0'] as $col) {
    try { $pdo->exec("ALTER TABLE kl_feedback ADD COLUMN $col"); } catch (Throwable $e) { /* уже є */ }
  }
  foreach (["user_id $uid NULL", 'ip_hash CHAR(64) NULL'] as $col) {
    try { $pdo->exec("ALTER TABLE kl_comments ADD COLUMN $col"); } catch (Throwable $e) { /* уже є */ }
  }
  foreach (['CREATE INDEX kl_bans_user ON kl_bans (user_id)', 'CREATE INDEX kl_bans_ip ON kl_bans (ip_hash)', 'CREATE INDEX kl_notices_user ON kl_notices (user_id)', 'CREATE INDEX kl_invites_inviter ON kl_invites (inviter_id)', 'CREATE INDEX kl_msg_to ON kl_messages (to_id, read_at)', 'CREATE INDEX kl_msg_pair ON kl_messages (from_id, to_id, created_at)', 'CREATE INDEX kl_feedback_new ON kl_feedback (done_at, created_at)',
    'CREATE INDEX kl_event_to_user ON kl_event_to (user_id, seen_at)', 'CREATE INDEX kl_events_owner ON kl_events (owner_id, created_at)'] as $ix) {
    try { $pdo->exec($ix); } catch (Throwable $e) { /* уже є */ }
  }
  import_legacy_files($pdo);
  backfill_founders($pdo); // ті, хто вже зареєструвався до запуску акції, теж отримують місце
  link_player_cards($pdo);  // картки без власника, чий код збігається з дружнім кодом акаунта
  $st = $pdo->prepare($my ? 'REPLACE INTO kl_meta (k, v) VALUES (?, ?)' : 'INSERT OR REPLACE INTO kl_meta (k, v) VALUES (?, ?)');
  /* v16: двофакторна. Секрет і резервні коди зберігаємо в окремих колонках,
     щоб не чіпати формат kl_user_data, який синхронізується на пристрої. */
  try { $pdo->exec('ALTER TABLE kl_users ADD COLUMN totp_secret VARCHAR(64) NULL'); } catch (Throwable $e) { /* вже є */ }
  try { $pdo->exec('ALTER TABLE kl_users ADD COLUMN totp_at INT NULL'); } catch (Throwable $e) { /* вже є */ }
  try { $pdo->exec('ALTER TABLE kl_users ADD COLUMN totp_backup TEXT NULL'); } catch (Throwable $e) { /* вже є */ }
  /* v15: згода на листи-нагадування. Типово ввімкнено для тих, хто вже
     підтвердив пошту — вони самі реєструвалися; відписка в кожному листі. */
  try { $pdo->exec('ALTER TABLE kl_users ADD COLUMN mail_ok TINYINT NOT NULL DEFAULT 1'); } catch (Throwable $e) { /* вже є */ }
  try { $pdo->exec('CREATE INDEX kl_mailouts_user ON kl_mailouts (user_id, kind)'); } catch (Throwable $e) { /* вже є */ }
  $st->execute(['schema', (string)SCHEMA_VERSION]);
}
// одноразово переносимо дані з попередньої файлової версії (api/data/*.php) у БД
function import_legacy_files(PDO $pdo): void {
  $dir = __DIR__ . '/data';
  if (!is_dir($dir)) return;
  $read = function (string $f) { $raw = (string)@file_get_contents($f); $g = "<?php exit; ?>\n"; if (str_starts_with($raw, $g)) $raw = substr($raw, strlen($g)); return json_decode($raw, true) ?: []; };
  $pf = "$dir/players.php";
  if (is_file($pf)) {
    $ins = $pdo->prepare('INSERT INTO kl_players (code, user_id, secret_hash, name, avatar, learn, level, stars, badges, streak, act, snap, seen, updated, since) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    foreach ($read($pf) as $p) { try { $ins->execute([$p['code'], $p['secret'], $p['name'], $p['avatar'], implode(',', $p['learn'] ?? []), $p['level'] ?? '', (int)$p['stars'], (int)$p['badges'], (int)$p['streak'], $p['act'] ?? '', $p['snap'] ?? '', (int)$p['seen'], (int)$p['updated'], (int)($p['since'] ?? $p['seen'])]); } catch (Throwable $e) { /* дубль */ } }
    @rename($pf, "$dir/players.imported.php");
  }
  foreach (glob("$dir/wall_*.php") ?: [] as $wf) {
    $w = $read($wf); $owner = substr(basename($wf, '.php'), 5);
    if (!preg_match('/^[A-HJ-NP-Z2-9]{6}$/', $owner)) continue;
    try { $pdo->prepare('INSERT INTO kl_walls (owner, secret_hash, open) VALUES (?, ?, ?)')->execute([$owner, $w['secret'] ?? null, !empty($w['open']) || !isset($w['open']) ? 1 : 0]); } catch (Throwable $e) { /* дубль */ }
    $ins = $pdo->prepare('INSERT INTO kl_comments (id, owner, name, avatar, text, akey_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
    foreach ($w['comments'] ?? [] as $c) { try { $ins->execute([$c['id'], $owner, $c['name'], $c['avatar'], $c['text'], $c['akey'] ?? '', strtotime($c['date']) ?: time()]); } catch (Throwable $e) { /* дубль */ } }
    @rename($wf, "$dir/" . basename($wf, '.php') . '.imported.php');
  }
}

/* ---------- запит, CSRF, ліміти ---------- */
function method(): string { return $_SERVER['REQUEST_METHOD'] ?? 'GET'; }
// Звичайні запити маленькі (256 КБ), але форми з вкладенням передають файл у base64 —
// їм ліміт підіймають явно: input(upload_input_max()).
function ini_bytes(string $key): int {
  $v = trim((string)ini_get($key));
  if ($v === '') return 0;
  $n = (int)$v;
  return match (strtolower(substr($v, -1))) { 'g' => $n * 1024 * 1024 * 1024, 'm' => $n * 1024 * 1024, 'k' => $n * 1024, default => $n };
}
// скільки байтів тіла запиту реально пропустить PHP (з запасом на заголовки)
function post_limit(): int {
  $p = ini_bytes('post_max_size');
  return $p > 0 ? max(65536, $p - 16384) : 8 * 1024 * 1024;
}
// ліміт для форм із файлом: менше з нашого максимуму й того, що дозволяє сервер
function upload_input_max(): int { return min(6 * 1024 * 1024, post_limit()); }
// скільки може важити САМ файл (base64 додає ~33 %, плюс місце під текст форми)
function upload_file_max(): int { return max(32768, (int)floor((upload_input_max() - 24576) * 3 / 4)); }
function input(int $max = 262144): array {
  static $in = null;
  if ($in !== null) return $in;
  if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > $max) fail('too_big', 413);
  $in = json_decode((string)file_get_contents('php://input'), true);
  if (!is_array($in)) $in = [];
  return $in;
}
// POST лише з нашого сайту: власний заголовок (браузер не пошле його з чужого сайту без дозволу CORS) + збіг Origin
function require_csrf(): void {
  if (($_SERVER['HTTP_X_KOMIKS'] ?? '') !== '1') fail('csrf', 403);
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin !== '') {
    $site = parse_url(site_url());
    $o = parse_url($origin);
    $okHost = ($o['host'] ?? '') === ($site['host'] ?? '') || in_array($o['host'] ?? '', (array)(cfg('dev_hosts') ?? []), true);
    if (!$okHost && app_origin() !== '') $okHost = true;   // запит із мобільного застосунку
    if (!$okHost) fail('csrf', 403);
  }
}
function ip_hash(): string { return hash('sha256', 'ip:' . ($_SERVER['REMOTE_ADDR'] ?? '?') . ':' . cfg('secret')); }
// не більше $max подій за $window секунд для ключа; повертає true, якщо ліміт вичерпано
function limited(string $key, int $max, int $window): bool {
  $k = substr(hash('sha256', $key . ':' . cfg('secret')), 0, 40) . ':' . $window;
  $now = time();
  $row = one('SELECT n, reset_at FROM kl_rate WHERE k = ?', [$k]);
  if (!$row || $row['reset_at'] <= $now) { upsert('kl_rate', ['k'], ['k' => $k, 'n' => 1, 'reset_at' => $now + $window]); return false; }
  if ((int)$row['n'] >= $max) return true;
  q('UPDATE kl_rate SET n = n + 1 WHERE k = ?', [$k]);
  return false;
}
// лише перевірити, не рахуючи подію (для «зафіксувати після успіху»)
function peek_limited(string $key, int $max, int $window): bool {
  $k = substr(hash('sha256', $key . ':' . cfg('secret')), 0, 40) . ':' . $window;
  $row = one('SELECT n, reset_at FROM kl_rate WHERE k = ?', [$k]);
  return $row && $row['reset_at'] > time() && (int)$row['n'] >= $max;
}
function rate_or_fail(string $key, int $max, int $window): void { if (limited($key, $max, $window)) fail('slow_down', 429); }
function clean_text(string $s, int $max): string {
  $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F<>]/u', '', $s) ?? '';
  $s = trim(preg_replace("/\n{3,}/", "\n\n", str_replace("\r", '', $s)) ?? '');
  return preg_match('/^.{0,' . $max . '}/us', $s, $m) ? $m[0] : '';
}
function has_link(string $t): bool { return (bool)preg_match('~(https?://|www\.|\.(com|net|org|ru|ua|no|io|ly|me|gg)\b|t\.me/)~i', $t); }
function rand_hex(int $bytes = 32): string { return bin2hex(random_bytes($bytes)); }
function sha(string $s): string { return hash('sha256', $s); }

/* ---------- сесії ---------- */
const SESSION_COOKIE = 'kl_s';
const SESSION_DAYS = 30;
function cookie_opts(int $expires): array {
  $path = parse_url(site_url(), PHP_URL_PATH) ?: '/';
  $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
  /* Для сайту лишається Lax — це найбезпечніше. Для застосунку запит іде з іншого
     джерела, і браузер надішле куку лише з SameSite=None, який вимагає Secure. */
  $cross = app_origin() !== '' && $https;
  return ['expires' => $expires, 'path' => $path, 'secure' => $https, 'httponly' => true,
    'samesite' => $cross ? 'None' : 'Lax'];
}
function start_session(int $userId): void {
  $token = rand_hex(32);
  $now = time();
  q('INSERT INTO kl_sessions (token_hash, user_id, created_at, expires_at, last_seen, ua) VALUES (?, ?, ?, ?, ?, ?)', [sha($token), $userId, $now, $now + SESSION_DAYS * 86400, $now, substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 190)]);
  q('UPDATE kl_users SET last_login = ? WHERE id = ?', [$now, $userId]);
  setcookie(SESSION_COOKIE, $token, cookie_opts($now + SESSION_DAYS * 86400));
  $_COOKIE[SESSION_COOKIE] = $token;
}
function end_session(): void {
  $t = (string)($_COOKIE[SESSION_COOKIE] ?? '');
  if ($t !== '') q('DELETE FROM kl_sessions WHERE token_hash = ?', [sha($t)]);
  setcookie(SESSION_COOKIE, '', cookie_opts(time() - 3600));
}
function current_user(): ?array {
  static $u = false;
  if ($u !== false) return $u;
  $t = (string)($_COOKIE[SESSION_COOKIE] ?? '');
  if (!preg_match('/^[a-f0-9]{64}$/', $t)) return $u = null;
  $row = one('SELECT s.token_hash, s.expires_at, s.last_seen, u.* FROM kl_sessions s JOIN kl_users u ON u.id = s.user_id WHERE s.token_hash = ?', [sha($t)]);
  if (!$row || $row['expires_at'] < time() || !empty($row['blocked_at'])) { if ($row) q('DELETE FROM kl_sessions WHERE token_hash = ?', [$row['token_hash']]); return $u = null; }
  if (time() - (int)$row['last_seen'] > 3600) q('UPDATE kl_sessions SET last_seen = ? WHERE token_hash = ?', [time(), $row['token_hash']]);
  return $u = $row;
}
function require_user(): array { $u = current_user(); if (!$u) fail('auth', 401); return $u; }
// ролі: адміністратор > модератор (чистить стіни, дає тимчасові блокування, попередження) > користувач
/* 🤖 проста «дитяча» капча: приклад на додавання/віднімання, підписаний HMAC і одноразовий nonce.
   Використовують стіни (wall.php) і форма відгуку (feedback.php). */
const CAPTCHA_TTL = 300;
function captcha_sign(string $payload, int $answer): string { return hash_hmac('sha256', $payload . '|' . $answer . '|' . ip_hash(), (string)cfg('secret')); }
function new_captcha(): array {
  if (random_int(0, 1) === 0) { $a = random_int(1, 9); $b = random_int(1, 9); $op = '+'; $ans = $a + $b; }
  else { $a = random_int(4, 12); $b = random_int(1, $a - 1); $op = '-'; $ans = $a - $b; }
  $opts = [$ans];
  while (count($opts) < 4) { $v = $ans + random_int(-3, 3); if ($v >= 0 && !in_array($v, $opts, true)) $opts[] = $v; }
  shuffle($opts);
  $payload = (time() + CAPTCHA_TTL) . '.' . bin2hex(random_bytes(8));
  return ['q' => ['a' => $a, 'op' => $op, 'b' => $b], 'opts' => $opts, 'token' => $payload . '.' . captcha_sign($payload, $ans)];
}
function check_captcha(string $token, int $answer): bool {
  if (!preg_match('/^(\d{10})\.([a-f0-9]{16})\.([a-f0-9]{64})$/', $token, $m)) return false;
  [, $exp, $nonce, $sig] = $m;
  if ((int)$exp < time() || !hash_equals(captcha_sign("$exp.$nonce", $answer), $sig)) return false;
  q('DELETE FROM kl_captcha_used WHERE exp < ?', [time()]);
  try { q('INSERT INTO kl_captcha_used (nonce, exp) VALUES (?, ?)', [$nonce, (int)$exp]); } catch (Throwable $e) { return false; } // уже використаний
  return true;
}
function is_staff(?array $u): bool { return $u && (!empty($u['is_admin']) || !empty($u['is_moderator'])); }
function role_of(array $u): string { return !empty($u['is_admin']) ? 'admin' : (!empty($u['is_moderator']) ? 'moderator' : (!empty($u['founder']) ? 'founder' : 'user')); }
// засновник (одне зі 100 місць): преміум назавжди + може прибирати погані дописи й попереджати авторів,
// але блокувати авторів і заходити в адмінпанель можуть лише адміністратор і призначений модератор
function is_founder(?array $u): bool { return $u && !empty($u['founder']) && empty($u['is_demo']); }
function can_moderate(?array $u): bool { return is_staff($u) || is_founder($u); }
// діюче блокування стіни для користувача або IP (для гостей)
// акаунт перевіряємо лише за акаунтом; IP-блоки й попередження стосуються тільки гостей
function active_ban(?int $userId, string $ipHash): ?array {
  return $userId ? one('SELECT * FROM kl_bans WHERE until_at > ? AND user_id = ? ORDER BY until_at DESC LIMIT 1', [time(), $userId])
    : one('SELECT * FROM kl_bans WHERE until_at > ? AND user_id IS NULL AND ip_hash = ? ORDER BY until_at DESC LIMIT 1', [time(), $ipHash]);
}
function pending_notice(?int $userId, string $ipHash): ?array {
  $since = time() - 14 * 86400;
  return $userId ? one('SELECT id, kind, text, created_at FROM kl_notices WHERE seen_at IS NULL AND created_at > ? AND user_id = ? ORDER BY created_at LIMIT 1', [$since, $userId])
    : one('SELECT id, kind, text, created_at FROM kl_notices WHERE seen_at IS NULL AND created_at > ? AND user_id IS NULL AND ip_hash = ? ORDER BY created_at LIMIT 1', [$since, $ipHash]);
}
function public_user(array $u): array {
  return ['id' => (int)$u['id'], 'name' => $u['name'], 'email' => $u['email'], 'lang' => $u['lang'], 'friend_code' => $u['friend_code'], 'share_profile' => (bool)$u['share_profile'], 'verified' => !empty($u['verified_at']), 'demo' => !empty($u['is_demo']), 'created' => gmdate('c', (int)$u['created_at']),
    // преміум — безкоштовно назавжди (друзі адміністратора та запрошені ними); персонал — теж
    'premium' => !empty($u['premium']) || !empty($u['is_teacher']) || is_staff($u) || (!empty($u['premium_until']) && (int)$u['premium_until'] > time()), 'teacher' => !empty($u['is_teacher']), 'premium_until' => !empty($u['premium_until']) ? gmdate('c', (int)$u['premium_until']) : null, 'msg_pref' => (int)($u['msg_pref'] ?? 1), 'can_invite' => !empty($u['can_invite']) || !empty($u['is_admin']), 'role' => role_of($u), 'founder' => isset($u['founder']) && $u['founder'] !== null ? (int)$u['founder'] : null,
    'totp' => totp_on($u),
  ];
}

/* ---------- користувачі (спільне для auth.php, install.php, admin.php) ---------- */
const VERIFY_TTL = 48 * 3600;
const RESET_TTL = 3600;

function hash_password(string $p): string { return password_hash($p, defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT); }
function valid_email(string $e): bool { return strlen($e) <= 190 && (bool)filter_var($e, FILTER_VALIDATE_EMAIL); }
function password_problem(string $p): ?string {
  if (strlen($p) < 8) return 'pass_short';
  if (strlen($p) > 200) return 'pass_long';
  if (in_array(strtolower($p), ['12345678', '123456789', 'password', 'qwertyui', 'qwerty123', '11111111', 'passord1', 'komikslab', 'iloveyou'], true)) return 'pass_weak';
  return null;
}
function new_token(int $userId, string $kind, int $ttl): string {
  $t = rand_hex(32);
  q('UPDATE kl_tokens SET used_at = ? WHERE user_id = ? AND kind = ? AND used_at IS NULL', [time(), $userId, $kind]); // старі посилання більше не діють
  q('INSERT INTO kl_tokens (token_hash, user_id, kind, expires_at) VALUES (?, ?, ?, ?)', [sha($t), $userId, $kind, time() + $ttl]);
  return $t;
}
function take_token(string $t, string $kind): ?array {
  if (!preg_match('/^[a-f0-9]{64}$/', $t)) return null;
  $row = one('SELECT * FROM kl_tokens WHERE token_hash = ? AND kind = ?', [sha($t), $kind]);
  if (!$row || $row['used_at'] || $row['expires_at'] < time()) return null;
  q('UPDATE kl_tokens SET used_at = ? WHERE token_hash = ?', [time(), $row['token_hash']]);
  return one('SELECT * FROM kl_users WHERE id = ?', [$row['user_id']]);
}
/** Демо-учні для класу: вхід без пароля (кнопка на #/login). Коди — 6 символів без I/O/0/1. */
function demo_catalog(): array {
  return [
    ['who' => 'kaja', 'name' => 'Kaja', 'email' => 'kaja@demo.bilohash.com', 'code' => 'KAJA2N', 'lang' => 'no', 'level' => 'A1', 'learn' => 'norsk', 'avatar' => '🐧|beanie||norflag|ice', 'blurb' => 'A1 · lundefugl', 'stars' => 18, 'badges' => 3, 'streak' => 5],
    ['who' => 'espen', 'name' => 'Espen', 'email' => 'espen@demo.bilohash.com', 'code' => 'ESPEN7', 'lang' => 'no', 'level' => 'A2', 'learn' => 'norsk,math', 'avatar' => '🐻|gamer||norflag|aurora', 'blurb' => 'A2 · elg i vest', 'stars' => 34, 'badges' => 6, 'streak' => 9],
    ['who' => 'liv', 'name' => 'Liv', 'email' => 'liv@demo.bilohash.com', 'code' => 'LIV2NT', 'lang' => 'no', 'level' => 'A1', 'learn' => 'norsk', 'avatar' => '🦊|wizard|||ice', 'blurb' => 'A1 · rev', 'stars' => 12, 'badges' => 2, 'streak' => 3],
    ['who' => 'sondre', 'name' => 'Sondre', 'email' => 'sondre@demo.bilohash.com', 'code' => 'SOND3R', 'lang' => 'no', 'level' => 'A2', 'learn' => 'norsk,logic', 'avatar' => '🐺|astro||bolt|neon', 'blurb' => 'A2 · logikk', 'stars' => 41, 'badges' => 7, 'streak' => 11],
    ['who' => 'hana', 'name' => 'Hana', 'email' => 'hana@demo.bilohash.com', 'code' => 'HANA2K', 'lang' => 'en', 'level' => 'B1', 'learn' => 'norsk,english', 'avatar' => '🦉|jester||norflag|midnight', 'blurb' => 'B1 · ugle', 'stars' => 55, 'badges' => 9, 'streak' => 14],
    ['who' => 'tarek', 'name' => 'Tarek', 'email' => 'tarek@demo.bilohash.com', 'code' => 'TAREK2', 'lang' => 'no', 'level' => 'A2', 'learn' => 'norsk,math', 'avatar' => '🐯|samurai|cyber||lava', 'blurb' => 'A2 · tiger', 'stars' => 29, 'badges' => 5, 'streak' => 7],
    ['who' => 'noor', 'name' => 'Noor', 'email' => 'noor@demo.bilohash.com', 'code' => 'NUR2KA', 'lang' => 'no', 'level' => 'A1', 'learn' => 'norsk', 'avatar' => '🐰|unicorn||bolt|ice', 'blurb' => 'A1 · kanin', 'stars' => 8, 'badges' => 2, 'streak' => 2],
    ['who' => 'olav', 'name' => 'Olav', 'email' => 'olav@demo.bilohash.com', 'code' => 'ULAV2N', 'lang' => 'no', 'level' => 'B1', 'learn' => 'norsk,logic,math', 'avatar' => '🦁|astro|laser|norflag|lava', 'blurb' => 'B1 · løve', 'stars' => 62, 'badges' => 11, 'streak' => 20],
  ];
}
/* ---------- 🏅 акція «перші 100» ----------
   Перші FOUNDER_SLOTS підтверджених акаунтів отримують преміум назавжди, права модератора
   (видаляти погані написи на стінах) і можливість запрошувати друзів. Далі — лише підписка. */
function founder_slots(): int { return defined('MK_FOUNDER_SLOTS') ? max(0, (int)MK_FOUNDER_SLOTS) : 100; }
/* Рахує зайняті місця. Якщо база недоступна — кидає виняток далі: краще показати помилку,
   ніж сказати «всі 100 місць вільні» й ввести в оману. */
function founders_used(): int {
  return (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE founder IS NOT NULL')['n'] ?? 0);
}
// чи жива база (для сторінок, які мають тихо сховати блок, а не падати)
function db_alive(): bool { try { db(); return true; } catch (Throwable $e) { return false; } }
function founders_left(): int { return max(0, founder_slots() - founders_used()); }
// видати місце (якщо ще є). Повертає номер місця або null
function founder_grant(array $u): ?int {
  if (!empty($u['is_demo'])) return null;
  if (!empty($u['founder'])) return (int)$u['founder'];
  try {
    if (founders_used() >= founder_slots()) return null;
    $n = (int)(one('SELECT MAX(founder) AS m FROM kl_users')['m'] ?? 0) + 1;
    if ($n > founder_slots()) return null;
    q('UPDATE kl_users SET founder = ?, premium = 1, can_invite = 1 WHERE id = ? AND founder IS NULL', [$n, $u['id']]);
    $row = one('SELECT founder FROM kl_users WHERE id = ?', [$u['id']]);
    return $row && $row['founder'] !== null ? (int)$row['founder'] : null;
  } catch (Throwable $e) { return null; }
}
// разова роздача місць тим, хто зареєструвався раніше (за часом реєстрації)
/* Картка гравця живе за кодом, і в браузері без входу в акаунт з'являється нова.
   Ті, чий код збігається з дружнім кодом користувача, — це той самий власник:
   прив'язуємо, щоб людина не двоїлася в рейтингу. */
function link_player_cards(PDO $pdo): void {
  try {
    $pdo->exec('UPDATE kl_players SET user_id = (SELECT u.id FROM kl_users u WHERE u.friend_code = kl_players.code)
      WHERE user_id IS NULL AND EXISTS (SELECT 1 FROM kl_users u WHERE u.friend_code = kl_players.code)');
  } catch (Throwable $e) { /* не критично: рейтинг просто покаже менше карток */ }
}
function backfill_founders(PDO $pdo): void {
  try {
    $used = (int)$pdo->query('SELECT COUNT(*) FROM kl_users WHERE founder IS NOT NULL')->fetchColumn();
    $free = founder_slots() - $used;
    if ($free <= 0) return;
    $n = (int)($pdo->query('SELECT MAX(founder) FROM kl_users')->fetchColumn() ?: 0);
    $rows = $pdo->query('SELECT id FROM kl_users WHERE founder IS NULL AND COALESCE(is_demo, 0) = 0 AND verified_at IS NOT NULL ORDER BY created_at ASC, id ASC LIMIT ' . (int)$free)->fetchAll();
    $st = $pdo->prepare('UPDATE kl_users SET founder = ?, premium = 1, can_invite = 1 WHERE id = ?');
    foreach ($rows as $r) { $st->execute([++$n, (int)$r['id']]); }
  } catch (Throwable $e) { /* стовпця ще немає — наступного разу */ }
}
/* 💾 Резервна копія бази: увесь дамп kl_*-таблиць одним .sql (сумісний із phpMyAdmin / mysql <).
   Файл містить пошти й хеші паролів — зберігайте його як пароль і нікому не пересилайте. */
function sql_dump_stream(): void {
  $pdo = db(); $my = is_mysql();
  $tables = [];
  if ($my) { foreach ($pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_NUM) as $r) if (str_starts_with((string)$r[0], 'kl_')) $tables[] = (string)$r[0]; }
  else { foreach ($pdo->query("SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'kl\_%' ESCAPE '\\'")->fetchAll(PDO::FETCH_NUM) as $r) $tables[] = (string)$r[0]; }
  sort($tables);
  $name = 'komiks-' . gmdate('Y-m-d-Hi') . ($my ? '' : '-sqlite') . '.sql';
  header('Content-Type: application/sql; charset=utf-8');
  header('Content-Disposition: attachment; filename="' . $name . '"');
  header('X-Content-Type-Options: nosniff');
  header('Cache-Control: no-store');
  echo "-- Komiks·Lab — резервна копія бази\n-- " . gmdate('c') . " · " . ($my ? 'MySQL' : 'SQLite') . " · таблиць: " . count($tables) . "\n";
  echo "-- УВАГА: файл містить пошти й хеші паролів учасників. Зберігайте його в безпеці.\n\n";
  if ($my) echo "SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\n\n";
  foreach ($tables as $t) {
    echo "-- ---------- $t ----------\nDROP TABLE IF EXISTS `$t`;\n";
    if ($my) { $row = $pdo->query("SHOW CREATE TABLE `$t`")->fetch(PDO::FETCH_NUM); echo ($row[1] ?? '') . ";\n"; }
    else { $st = $pdo->prepare('SELECT sql FROM sqlite_master WHERE name = ?'); $st->execute([$t]); echo (string)$st->fetchColumn() . ";\n"; }
    $st = $pdo->query("SELECT * FROM `$t`");
    $n = 0;
    while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
      $cols = '`' . implode('`, `', array_keys($row)) . '`';
      $vals = implode(', ', array_map(fn($v) => $v === null ? 'NULL' : $pdo->quote((string)$v), $row));
      echo "INSERT INTO `$t` ($cols) VALUES ($vals);\n";
      if (++$n % 200 === 0) { flush(); }
    }
    echo "\n";
  }
  if ($my) echo "SET FOREIGN_KEY_CHECKS = 1;\n";
  echo "-- кінець\n";
  exit;
}
/* ---------- 💳 Преміум-підписка (Stripe) ----------
   Ціна й валюта — тут; секретний ключ — лише в api/config.php на сервері (або define MK_STRIPE_*). */
const PREMIUM_PRICE = 6900;        // 69,00
const PREMIUM_CURRENCY = 'NOK';
function stripe_key(string $which = 'secret'): string {
  $c = ['secret' => 'MK_STRIPE_SECRET_KEY', 'publishable' => 'MK_STRIPE_PUBLISHABLE_KEY', 'webhook' => 'MK_STRIPE_WEBHOOK_SECRET'][$which] ?? '';
  if ($c !== '' && defined($c) && is_string(constant($c)) && constant($c) !== '') return (string)constant($c);
  $v = cfg('stripe.' . $which);
  return is_string($v) ? $v : '';
}
function stripe_ready(): bool { return str_starts_with(stripe_key('secret'), 'sk_'); }
// запит до Stripe: HTTPS із перевіркою сертифіката, ключ — у заголовку, ніколи в URL чи логах
function stripe_call(string $method, string $path, array $params = []): ?array {
  $key = stripe_key('secret');
  if ($key === '' || !function_exists('curl_init')) return null;
  $ch = curl_init('https://api.stripe.com' . $path);
  $opts = [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Stripe-Version: 2024-06-20', 'Content-Type: application/x-www-form-urlencoded'],
  ];
  if ($method === 'POST') { $opts[CURLOPT_POST] = true; $opts[CURLOPT_POSTFIELDS] = http_build_query($params, '', '&', PHP_QUERY_RFC3986); }
  curl_setopt_array($ch, $opts);
  $body = curl_exec($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  if ($body === false) { log_err('stripe: ' . $err); return null; }
  $j = json_decode((string)$body, true);
  if ($code >= 400) { log_err('stripe ' . $code . ': ' . (string)($j['error']['message'] ?? 'error')); return null; }
  return is_array($j) ? $j : null;
}
function billing_row(int $uid): ?array { try { return one('SELECT * FROM kl_billing WHERE user_id = ?', [$uid]); } catch (Throwable $e) { return null; } }
// вмикаємо преміум до дати. Викликається лише після відповіді Stripe або підписаного вебхука
function premium_apply(int $uid, int $until, string $customer = '', string $sub = '', string $status = 'active'): void {
  $until = max($until, time());
  q('UPDATE kl_users SET premium_until = ? WHERE id = ?', [$until, $uid]);
  upsert('kl_billing', ['user_id'], ['user_id' => $uid, 'customer' => $customer, 'subscription' => $sub, 'status' => $status, 'period_end' => $until, 'updated_at' => time()]);
}
/* ---------- 🎟️ ліміт тестів ----------
   Навчання безкоштовне: комікси, тести, картки, ігри та слова — без обмежень для всіх.
   Механізм лічильника лишається на випадок, якщо колись знадобиться (MK_FREE_QUIZ_MONTH
   разом із MK_QUIZ_LIMIT_ON), але типово він вимкнений. */
function quiz_free_limit(): int { return defined('MK_FREE_QUIZ_MONTH') ? max(1, (int)MK_FREE_QUIZ_MONTH) : 25; }
function has_premium(?array $u): bool {
  if (!$u) return false;
  return !empty($u['founder']) || !empty($u['premium']) || !empty($u['is_teacher']) || is_staff($u) || (!empty($u['premium_until']) && (int)$u['premium_until'] > time());
}
// $count = true — зарахувати пройдений тест
function quiz_limit_on(): bool { return defined('MK_QUIZ_LIMIT_ON') && MK_QUIZ_LIMIT_ON; }
function quiz_quota(array $u, bool $count = false): array {
  $limit = quiz_free_limit();
  if (!quiz_limit_on() || has_premium($u)) return ['unlimited' => true, 'used' => 0, 'left' => $limit, 'limit' => $limit];
  $window = 30 * 86400;
  $k = substr(hash('sha256', 'quiz:' . $u['id'] . ':' . cfg('secret')), 0, 40) . ':' . $window;
  $now = time();
  $row = one('SELECT n, reset_at FROM kl_rate WHERE k = ?', [$k]);
  $used = ($row && (int)$row['reset_at'] > $now) ? (int)$row['n'] : 0;
  $reset = ($row && (int)$row['reset_at'] > $now) ? (int)$row['reset_at'] : $now + $window;
  if ($count && $used < $limit) {
    if (!$row || (int)$row['reset_at'] <= $now) { upsert('kl_rate', ['k'], ['k' => $k, 'n' => 1, 'reset_at' => $now + $window]); $used = 1; $reset = $now + $window; }
    else { q('UPDATE kl_rate SET n = n + 1 WHERE k = ?', [$k]); $used++; }
  }
  return ['unlimited' => false, 'used' => $used, 'left' => max(0, $limit - $used), 'limit' => $limit, 'reset' => gmdate('c', $reset)];
}
/* 📎 Вкладення до відгуку. Приймаємо лише картинки, PDF і txt, до 4 МБ, за вмістом файлу,
   а не за назвою. Файли лежать у api/data/uploads (доступ закритий .htaccess) і віддаються
   лише адміністратору через admin.php. */
const UPLOAD_MAX = 4 * 1024 * 1024;
const UPLOAD_TYPES = ['image/png' => 'png', 'image/jpeg' => 'jpg', 'image/webp' => 'webp', 'image/gif' => 'gif', 'application/pdf' => 'pdf', 'text/plain' => 'txt'];
function upload_dir(): string { $d = __DIR__ . '/data/uploads'; if (!is_dir($d)) @mkdir($d, 0750, true); return $d; }
// повертає [file, name, type, size] або null; кидає false при недопустимому файлі
function save_upload(string $dataUrl, string $name) {
  if ($dataUrl === '') return null;
  if (!preg_match('~^data:([a-z]+/[a-z0-9.+-]+);base64,~i', $dataUrl, $m)) return false;
  $type = strtolower($m[1]);
  if (!isset(UPLOAD_TYPES[$type])) return false;
  $bin = base64_decode(substr($dataUrl, strlen($m[0])), true);
  if ($bin === false || $bin === '' || strlen($bin) > UPLOAD_MAX) return false;
  // перевіряємо справжній вміст, а не заявлений тип
  if (str_starts_with($type, 'image/')) {
    if (!function_exists('getimagesizefromstring')) return false;
    $info = @getimagesizefromstring($bin);
    $real = ['image/png' => 1, 'image/jpeg' => 1, 'image/webp' => 1, 'image/gif' => 1];
    if (!$info || empty($info['mime']) || !isset($real[$info['mime']])) return false;
    $type = $info['mime'];
  } elseif ($type === 'application/pdf') {
    if (!str_starts_with($bin, '%PDF-')) return false;
  } elseif ($type === 'text/plain') {
    if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', $bin)) return false;
  }
  $file = gmdate('Ymd') . '-' . rand_hex(8) . '.' . UPLOAD_TYPES[$type];
  if (@file_put_contents(upload_dir() . '/' . $file, $bin) === false) return false;
  @chmod(upload_dir() . '/' . $file, 0640);
  $clean = preg_replace('/[^\p{L}\p{N}._ -]+/u', '', $name) ?: 'fil';
  return ['file' => $file, 'name' => mb_cut($clean, 80), 'type' => $type, 'size' => strlen($bin)];
}
function mb_cut(string $s, int $n): string { return preg_match('/^.{0,' . $n . '}/us', $s, $m) ? $m[0] : substr($s, 0, $n); }
function delete_upload(string $file): void {
  if ($file === '' || !preg_match('/^[0-9]{8}-[a-f0-9]{16}\.[a-z]{3,4}$/', $file)) return;
  @unlink(upload_dir() . '/' . $file);
}
// 🎓 рішення щодо заявки вчителя: вмикаємо преміум і пишемо листа
function teacher_decide(int $uid, bool $ok, string $note, int $byId): void {
  q('UPDATE kl_teachers SET status = ?, note = ?, decided_at = ?, by_id = ? WHERE user_id = ?', [$ok ? 'ok' : 'no', $note, time(), $byId, $uid]);
  q('UPDATE kl_users SET is_teacher = ? WHERE id = ?', [$ok ? 1 : 0, $uid]);
}
/* 💬 Офіційний акаунт (адміністратор) завжди є в пошуку гравців і завжди показується «онлайн»,
   щоб кожен міг знайти автора проєкту й написати. Якщо адміністратор прибирає себе з пошуку
   (кнопка в кабінеті), ми запам’ятовуємо це в kl_meta і більше картку не створюємо. */
function meta_get(string $k, string $d = ''): string {
  try { $r = one('SELECT v FROM kl_meta WHERE k = ?', [$k]); return $r ? (string)$r['v'] : $d; }
  catch (Throwable $e) { return $d; }
}
function meta_set(string $k, string $v): void {
  try { upsert('kl_meta', ['k'], ['k' => $k, 'v' => $v]); } catch (Throwable $e) { /* ігноруємо */ }
}
function ensure_official_cards(): void {
  try {
    $now = time();
    foreach (q('SELECT id, name, friend_code, lang FROM kl_users WHERE is_admin = 1 AND blocked_at IS NULL')->fetchAll() as $u) {
      if (meta_get('off:' . (int)$u['id']) === '1') continue;                    // адмін сам прибрав себе
      if (one('SELECT code FROM kl_players WHERE code = ?', [$u['friend_code']])) continue;
      q('INSERT INTO kl_players (code, user_id, secret_hash, name, avatar, learn, level, stars, badges, streak, act, snap, seen, updated, since) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?, ?, ?, ?)',
        [$u['friend_code'], (int)$u['id'], sha('komiks-players:official-' . $u['friend_code']), $u['name'], '💬|||norflag|aurora', 'norsk', 'B2', 'read', '', $now, $now, $now]);
      q('UPDATE kl_users SET share_profile = 1 WHERE id = ?', [(int)$u['id']]);
    }
  } catch (Throwable $e) { /* немає таблиць — нічого страшного */ }
}
/* ---------- 🤖 ШІ-співрозмовник для телефонних дзвінків ----------
   Ключ живе ЛИШЕ в api/config.php на сервері ('ai' => ['provider','key','model']) або в константах
   MK_AI_KEY / MK_AI_PROVIDER / MK_AI_MODEL. У браузер він не потрапляє ніколи.
   Провайдери з OpenAI-сумісним API: openai, groq, xai (Grok), together, openrouter. Окремо — anthropic. */
/* Налаштування, які адміністратор змінює в панелі (голос, модель, вітання, промпт),
   лежать у kl_meta під ключем ai.*. Ключі API там НЕ зберігаються — лише в api/config.php. */
function ai_set(string $k, $v): void { meta_set('ai.' . $k, is_string($v) ? $v : json_encode($v, JSON_UNESCAPED_UNICODE)); }
function ai_get(string $k, string $def = ''): string { $v = meta_get('ai.' . $k, ''); return $v !== '' ? $v : $def; }
function ai_cfg(string $k, string $def = ''): string {
  $c = ['provider' => 'MK_AI_PROVIDER', 'key' => 'MK_AI_KEY', 'model' => 'MK_AI_MODEL'][$k] ?? '';
  if ($c !== '' && defined($c) && is_string(constant($c)) && constant($c) !== '') return (string)constant($c);
  $v = cfg('ai.' . $k);
  return is_string($v) && $v !== '' ? $v : $def;
}
/* Вимикач у config.php сильніший за будь-яке налаштування в панелі — і це навмисно.
   Ним глушать платні можливості, коли скінчилися гроші на ключах, коли збірку
   віддають комусь без ШІ або коли щось пішло не так і треба швидко все згасити.
   Якби панель могла його переважити, вимикач нічого не вартував би. */
function feature_off(string $which): bool {
  $c = cfg($which);
  return is_array($c) && array_key_exists('enabled', $c) && !$c['enabled'];
}
function ai_ready(): bool { return !feature_off('ai') && ai_cfg('key') !== ''; }
function ai_provider(): string { return strtolower(ai_cfg('provider', 'openai')); }
/* Чи дозволена окрема можливість: 'write' (перевірка письма), 'chat'
   (текстова розмова з персонажем), 'realtime' (голосовий дзвінок).
   Типово ввімкнена лише перевірка письма: вона найдешевша на запит і єдина,
   де відповідь ШІ справді не замінити заготовками. */
function ai_feature_on(string $what): bool {
  if (!ai_ready()) return false;
  $def = ['write' => '1', 'chat' => '0', 'realtime' => '0'];
  if (!isset($def[$what])) return false;
  return ai_get('use_' . $what, $def[$what]) === '1';
}

/* Модель для перевірки письма окремо від розмовної: там потрібна швидка й
   дешева, бо запит іде на кожен твір, а завдання просте — знайти помилки
   в кількох реченнях. */
function ai_write_model(): string {
  $m = ai_get('write_model', '');
  if ($m !== '') return $m;
  return match (ai_provider()) {
    'anthropic' => 'claude-3-5-haiku-latest',
    'groq' => 'llama-3.1-8b-instant',
    'xai' => 'grok-2-latest',
    default => 'gpt-4o-mini',
  };
}

function ai_model(): string {
  $m = ai_get('model', ai_cfg('model'));
  if ($m !== '') return $m;
  return match (ai_provider()) { 'anthropic' => 'claude-3-5-haiku-latest', 'groq' => 'llama-3.3-70b-versatile', 'xai' => 'grok-2-latest', default => 'gpt-4o-mini' };
}
// повертає текст відповіді або null. $msgs — [['role' => 'user'|'assistant', 'content' => '...'], …]
function ai_chat(string $system, array $msgs, int $maxTokens = 160, string $model = ''): ?string {
  $key = ai_cfg('key');
  if ($key === '' || !function_exists('curl_init')) return null;
  $prov = ai_provider();
  $anthropic = $prov === 'anthropic';
  $url = match ($prov) {
    'anthropic' => 'https://api.anthropic.com/v1/messages',
    'groq' => 'https://api.groq.com/openai/v1/chat/completions',
    'xai' => 'https://api.x.ai/v1/chat/completions',
    'together' => 'https://api.together.xyz/v1/chat/completions',
    'openrouter' => 'https://openrouter.ai/api/v1/chat/completions',
    default => 'https://api.openai.com/v1/chat/completions',
  };
  $body = $anthropic
    ? ['model' => $model !== '' ? $model : ai_model(), 'max_tokens' => $maxTokens, 'system' => $system, 'messages' => $msgs]
    : ['model' => $model !== '' ? $model : ai_model(), 'max_tokens' => $maxTokens, 'temperature' => 0.7,
       'messages' => array_merge([['role' => 'system', 'content' => $system]], $msgs)];
  $headers = $anthropic
    ? ['x-api-key: ' . $key, 'anthropic-version: 2023-06-01', 'Content-Type: application/json']
    : ['Authorization: Bearer ' . $key, 'Content-Type: application/json'];
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_TIMEOUT => 25,
    CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HTTPHEADER => $headers, CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
  ]);
  $res = curl_exec($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  if ($res === false) { error_log('[komiks-ai] ' . $err); return null; }
  $j = json_decode((string)$res, true);
  if ($code >= 400 || !is_array($j)) { error_log('[komiks-ai] ' . $code . ': ' . substr((string)$res, 0, 200)); return null; }
  $text = $anthropic ? ($j['content'][0]['text'] ?? '') : ($j['choices'][0]['message']['content'] ?? '');
  $text = trim((string)$text);
  return $text === '' ? null : $text;
}
/* ---------- 🔊 синтез мовлення для живих реплік ----------
   Комікси озвучені заздалегідь, а відповіді ШІ народжуються на льоту — їх читає нейроголос
   провайдера (openai або elevenlabs). Ключ живе в config.php ('tts' → або 'ai', якщо окремого немає). */
function tts_cfg(string $k, string $def = ''): string {
  $c = ['provider' => 'MK_TTS_PROVIDER', 'key' => 'MK_TTS_KEY', 'voice' => 'MK_TTS_VOICE', 'model' => 'MK_TTS_MODEL'][$k] ?? '';
  if ($c !== '' && defined($c) && is_string(constant($c)) && constant($c) !== '') return (string)constant($c);
  $v = cfg('tts.' . $k);
  if (is_string($v) && $v !== '') return $v;
  // якщо окремого ключа немає — беремо ключ ШІ (той самий OpenAI)
  if ($k === 'key' && ai_provider() === 'openai') return ai_cfg('key');
  if ($k === 'provider' && ai_provider() === 'openai' && ai_cfg('key') !== '') return 'openai';
  return $def;
}
// без окремого налаштування працюють безкоштовні нейроголоси Microsoft Edge — ті самі, що в коміксах
/* Ролі голосів: клієнт надсилає не назву голосу, а роль персонажа — сервер добирає
   відповідний нейроголос у того провайдера, який налаштовано. */
const TTS_ROLE_EDGE = [
  'female' => 'nb-NO-PernilleNeural', 'female2' => 'nb-NO-IselinNeural', 'male' => 'nb-NO-FinnNeural',
  'young' => 'nb-NO-IselinNeural', 'warm' => 'nb-NO-PernilleNeural', 'multi' => 'en-US-AvaMultilingualNeural',
];
const TTS_ROLE_OPENAI = ['female' => 'nova', 'female2' => 'shimmer', 'male' => 'onyx', 'young' => 'coral', 'warm' => 'sage', 'multi' => 'alloy'];
function tts_provider(): string { return strtolower(ai_get('tts_provider', tts_cfg('provider', 'edge'))); }
function tts_ready(): bool {
  if (feature_off('tts')) return false;
  $p = tts_provider();
  if ($p === 'edge') return true;
  if ($p === 'none') return false;
  return in_array($p, ['openai', 'elevenlabs'], true) && tts_cfg('key') !== '';
}
function tts_voice_off(): bool { return feature_off('tts') || tts_provider() === 'none'; }
function tts_voice(): string {
  $v = ai_get('tts_voice', tts_cfg('voice'));
  if ($v !== '') return $v;
  return match (tts_provider()) { 'elevenlabs' => '21m00Tcm4TlvDq8ikWAM', 'edge' => 'nb-NO-PernilleNeural', default => 'nova' };
}
// повертає байти mp3 або null
function tts_speak(string $text, string $voice = ''): ?string {
  if (!tts_ready()) return null;
  $voice = $voice !== '' ? $voice : tts_voice();
  $prov = tts_provider();
  if ($prov === 'edge') {
    require_once __DIR__ . '/edge_tts.php';
    $v = str_contains($voice, '-') ? $voice : (TTS_ROLE_EDGE[$voice] ?? 'nb-NO-PernilleNeural');
    // трохи повільніше за типову швидкість — так зрозуміліше тому, хто вчить мову
    return edge_tts_speak($text, $v, '-6%');
  }
  if ($prov === 'openai' && isset(TTS_ROLE_OPENAI[$voice])) $voice = TTS_ROLE_OPENAI[$voice];
  if (!function_exists('curl_init')) return null;
  if ($prov === 'elevenlabs') {
    $url = 'https://api.elevenlabs.io/v1/text-to-speech/' . rawurlencode($voice) . '?output_format=mp3_44100_64';
    $headers = ['xi-api-key: ' . tts_cfg('key'), 'Content-Type: application/json'];
    $body = ['text' => $text, 'model_id' => tts_cfg('model', 'eleven_multilingual_v2'), 'voice_settings' => ['stability' => 0.4, 'similarity_boost' => 0.8]];
  } else {
    $url = 'https://api.openai.com/v1/audio/speech';
    $headers = ['Authorization: Bearer ' . tts_cfg('key'), 'Content-Type: application/json'];
    // інструкція голосу: спокійний норвезький тон, як у живій телефонній розмові
    $body = ['model' => tts_cfg('model', 'gpt-4o-mini-tts'), 'voice' => $voice, 'input' => $text, 'response_format' => 'mp3',
      'instructions' => 'Speak natural Norwegian (bokmål) in a warm, friendly phone-call tone, clear and not too fast.'];
  }
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HTTPHEADER => $headers, CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
  ]);
  $res = curl_exec($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  if ($res === false || $code >= 400 || !is_string($res) || strlen($res) < 512) {
    error_log('[komiks-tts] ' . ($err ?: $code . ': ' . substr((string)$res, 0, 160)));
    return null;
  }
  return $res;
}
function seed_demo_users(): void {
  try {
    db()->exec('ALTER TABLE kl_users ADD COLUMN is_demo TINYINT NOT NULL DEFAULT 0');
  } catch (Throwable $e) { /* already there */ }
  $now = time();
  $dummy = hash_password(rand_hex(24));
  foreach (demo_catalog() as $d) {
    $u = one('SELECT id FROM kl_users WHERE email = ?', [$d['email']]);
    if (!$u) {
      try {
        q('INSERT INTO kl_users (email, name, pass_hash, lang, friend_code, share_profile, created_at, consent_at, verified_at, is_demo, msg_pref) VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, 1, 0)',
          [$d['email'], $d['name'], $dummy, $d['lang'], $d['code'], $now, $now, $now]);
      } catch (Throwable $e) { /* code/email collision */ }
      $u = one('SELECT id FROM kl_users WHERE email = ?', [$d['email']]);
      if (!$u) continue;
    } else {
      q('UPDATE kl_users SET is_demo = 1, name = ?, lang = ?, share_profile = 1, verified_at = COALESCE(verified_at, ?), msg_pref = 0 WHERE id = ?',
        [$d['name'], $d['lang'], $now, $u['id']]);
    }
    $uid = (int)$u['id'];
    upsert('kl_players', ['code'], [
      'code' => $d['code'], 'user_id' => $uid, 'secret_hash' => sha('komiks-players:demo-' . $d['code']),
      'name' => $d['name'], 'avatar' => $d['avatar'], 'learn' => $d['learn'], 'level' => $d['level'],
      'stars' => $d['stars'], 'badges' => $d['badges'], 'streak' => $d['streak'], 'act' => 'read',
      'snap' => '', 'seen' => $now, 'updated' => $now, 'since' => $now - 14 * 86400,
    ]);
  }
}
function unique_friend_code(): string {
  $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for ($i = 0; $i < 20; $i++) {
    $c = ''; for ($j = 0; $j < 6; $j++) $c .= $chars[random_int(0, strlen($chars) - 1)];
    if (str_starts_with($c, 'BQ')) continue; // BQ… — коди віртуальних гравців
    if (!one('SELECT id FROM kl_users WHERE friend_code = ?', [$c])) return $c;
  }
  throw new RuntimeException('friend code');
}
function send_verify(array $u): void { send_template($u, 'verify', site_url() . 'api/auth.php?action=verify&token=' . new_token((int)$u['id'], 'verify', VERIFY_TTL)); }

/** Бали з тестів і ігор → kl_players.stars (головна й рейтинг). */
function user_data_val(int $userId, string $k, $default = null) {
  $r = one('SELECT v FROM kl_user_data WHERE user_id = ? AND k = ?', [$userId, $k]);
  if (!$r) return $default;
  $v = json_decode($r['v'], true);
  return $v === null ? $default : $v;
}
/* ---------- скільки читають кожен комікс ----------
   Беремо з того, що й так синхронізується: ключ seen.<id> — перелік номерів кадрів,
   які людина відкривала. Нічого додатково не відслідковуємо й нових записів не
   робимо: будь-який окремий лічильник означав би ще один слід про поведінку людей,
   а відповідь на питання «що читають» уже лежить у базі.
   Важливе обмеження, і про нього треба писати в панелі: тут видно лише тих, хто
   має акаунт і синхронізувався. Гості читають теж, але їхні числа нікуди не йдуть. */
function comic_reads(): array {
  $out = [];
  foreach (q("SELECT k, v FROM kl_user_data WHERE k LIKE 'seen.%'")->fetchAll() as $r) {
    $id = substr((string)$r['k'], 5);
    if ($id === '') continue;
    $seen = json_decode((string)$r['v'], true);
    if (!is_array($seen)) continue;
    if (!isset($out[$id])) $out[$id] = ['opened' => 0, 'counts' => []];
    $out[$id]['opened']++;
    $out[$id]['counts'][] = count($seen);
  }
  return $out;
}

/** Результати тестів по коміксах: скільки людей склали й середні зірки. */
function comic_quizzes(): array {
  $out = [];
  foreach (q("SELECT v FROM kl_user_data WHERE k = 'progress'")->fetchAll() as $r) {
    $prog = json_decode((string)$r['v'], true);
    if (!is_array($prog)) continue;
    foreach ($prog as $id => $x) {
      if (!is_array($x)) continue;
      $st = max(0, (int)($x['stars'] ?? 0));
      if ($st <= 0) continue;
      $cur = $out[$id] ?? ['n' => 0, 'stars' => 0];
      $out[$id] = ['n' => $cur['n'] + 1, 'stars' => $cur['stars'] + $st];
    }
  }
  return $out;
}

function refresh_rank(array $u): void {
  if (!$u || !empty($u['is_demo'])) return;
  $code = strtoupper((string)($u['friend_code'] ?? ''));
  if (!preg_match('/^[A-HJ-NP-Z2-9]{6}$/', $code)) return;
  $uid = (int)$u['id'];
  $prog = user_data_val($uid, 'progress', []);
  if (!is_array($prog)) $prog = [];
  $stars = 0;
  $tests = 0;
  foreach ($prog as $pr) {
    if (!is_array($pr)) continue;
    $s = max(0, (int)($pr['stars'] ?? 0));
    $stars += $s;
    if ($s > 0) $tests++;
  }
  $stats = user_data_val($uid, 'stats', []);
  if (!is_array($stats)) $stats = [];
  $games = max(0, (int)($stats['games'] ?? 0));
  $race = max(0, (int)($stats['raceWins'] ?? 0));
  $days = user_data_val($uid, 'days', []);
  $dayN = is_array($days) ? count($days) : 0;
  $math = max(0, (int)user_data_val($uid, 'mathBest', 0));
  $quizzes = max(0, (int)($stats['quizzes'] ?? 0));
  /* Однакові правила для всіх: тести + ігри. Без ботів, без демо, без бонуса лише за вхід. */
  $score = $stars * 10 + $tests * 5 + $games * 3 + $race * 10 + min(200, $math);
  $score = max(0, min(100000, $score));
  $active = max(0, min(100000, $dayN + $games + $tests + $quizzes + $race));
  $badges = max(0, min(100, (int)($stats['perfect'] ?? 0) + ($race > 0 ? 1 : 0) + ($math >= 150 ? 1 : 0)));
  $avatar = user_data_val($uid, 'avatar', '🦊');
  if (!is_string($avatar) || $avatar === '') $avatar = '🦊';
  $avatar = substr($avatar, 0, 60);
  $now = time();
  $prev = one('SELECT * FROM kl_players WHERE code = ?', [$code]);
  upsert('kl_players', ['code'], [
    'code' => $code,
    'user_id' => $uid,
    'secret_hash' => $prev['secret_hash'] ?? sha('komiks-players:rank:' . $uid),
    'name' => $u['name'],
    'avatar' => $avatar,
    'learn' => $prev['learn'] ?? 'norsk',
    'level' => $prev['level'] ?? 'A1',
    'stars' => $score,
    'badges' => $badges,
    'streak' => min(10000, $dayN),
    'active' => $active,
    'act' => $prev['act'] ?? 'play',
    'snap' => $prev['snap'] ?? '',
    'seen' => $now,
    'updated' => $now,
    'since' => (int)($prev['since'] ?? $now),
  ]);
}
function refresh_all_ranks(): int {
  $n = 0;
  foreach (q('SELECT * FROM kl_users WHERE COALESCE(is_demo, 0) = 0')->fetchAll() as $u) {
    refresh_rank($u);
    $n++;
  }
  return $n;
}
// повне видалення акаунта з усіма даними
function delete_user_all(array $u): void {
  $db = db(); $db->beginTransaction();
  foreach (['kl_user_data', 'kl_sessions', 'kl_tokens'] as $t) q("DELETE FROM $t WHERE user_id = ?", [$u['id']]);
  q('DELETE FROM kl_players WHERE user_id = ? OR code = ?', [$u['id'], $u['friend_code']]);
  q('DELETE FROM kl_comments WHERE owner = ?', [$u['friend_code']]);
  q('DELETE FROM kl_walls WHERE owner = ?', [$u['friend_code']]);
  q('DELETE FROM kl_users WHERE id = ?', [$u['id']]);
  $db->commit();
}

/* ---------- #️⃣ хештеги ---------- */
/* Приводимо до одного вигляду: без «#», малими літерами, лише літери й цифри,
 * не більше п'яти тегів по 24 символи — щоб пошук збігався, а не вгадував. */
function clean_tags($raw, int $max = 5): array {
  $list = is_array($raw) ? $raw : preg_split('/[\s,]+/u', (string)$raw);
  $out = [];
  foreach ($list as $t) {
    $t = mb_strtolower(trim((string)$t));
    $t = ltrim($t, '#');
    $t = preg_replace('/[^\p{L}\p{N}_-]+/u', '', $t) ?? '';
    if ($t === '' || mb_strlen($t) < 2) continue;
    $t = mb_substr($t, 0, 24);
    if (!in_array($t, $out, true)) $out[] = $t;
    if (count($out) >= $max) break;
  }
  return $out;
}

/* ---------- 🔔 стрічка друзів ---------- */
/* Друзі зберігаються в браузері (kl_user_data → ключ friends), тому список беремо звідти
 * і віддаємо лише коди тих, кого людина сама підтвердила. */
function friend_codes(int $userId): array {
  $r = one("SELECT v FROM kl_user_data WHERE user_id = ? AND k = 'friends'", [$userId]);
  $list = $r ? json_decode((string)$r['v'], true) : null;
  if (!is_array($list)) return [];
  $out = [];
  foreach ($list as $f) {
    if (!is_array($f) || ($f['status'] ?? '') !== 'friend') continue;
    $c = strtoupper(trim((string)($f['code'] ?? '')));
    if (preg_match('/^[A-HJ-NP-Z2-9]{6}$/', $c)) $out[] = $c;
  }
  return array_slice(array_unique($out), 0, 100);
}
// кому справді належать ці коди (лише підтверджені акаунти)
function users_by_codes(array $codes): array {
  if (!$codes) return [];
  $in = implode(',', array_fill(0, count($codes), '?'));
  return q("SELECT id, friend_code, name FROM kl_users WHERE friend_code IN ($in) AND blocked_at IS NULL", $codes)->fetchAll();
}
// подія + доставка друзям; повертає скільки людей її побачать
function event_add(int $ownerId, string $kind, string $ref, string $text, array $toIds): int {
  if (!$toIds) return 0;
  q('INSERT INTO kl_events (owner_id, kind, ref, text, likes, created_at) VALUES (?, ?, ?, ?, 0, ?)',
    [$ownerId, $kind, mb_substr($ref, 0, 80), mb_substr($text, 0, 160), time()]);
  $id = (int)db()->lastInsertId();
  foreach (array_unique($toIds) as $uid) {
    if ((int)$uid === $ownerId) continue;
    try { q('INSERT INTO kl_event_to (event_id, user_id, seen_at) VALUES (?, ?, NULL)', [$id, (int)$uid]); } catch (Throwable $e) { /* дубль */ }
  }
  return count($toIds);
}
// стрічку тримаємо короткою: 60 останніх подій на людину
function events_prune(int $userId): void {
  try {
    $old = q('SELECT event_id FROM kl_event_to WHERE user_id = ? ORDER BY event_id DESC LIMIT 200 OFFSET 60', [$userId])->fetchAll();
    foreach ($old as $r) q('DELETE FROM kl_event_to WHERE user_id = ? AND event_id = ?', [$userId, (int)$r['event_id']]);
  } catch (Throwable $e) { /* не критично */ }
}

/* ---------- пошта ---------- */
/* Налаштування пошти приймаємо в будь-якому написанні: у різних проєктах ключі звуться
 * по-різному (user/username, pass/password, from/from_email). Так конфіг, скопійований
 * з іншого сайту, працює без переробки. */
function mail_cfg(): array {
  $m = (array)cfg('mail');
  $pick = function (array $keys, $def = '') use ($m) {
    foreach ($keys as $k) if (isset($m[$k]) && $m[$k] !== '') return $m[$k];
    return $def;
  };
  $user = (string)$pick(['user', 'username', 'login']);
  $from = (string)$pick(['from', 'from_email', 'sender'], $user ?: 'no-reply@localhost');
  return [
    'transport' => (string)$pick(['transport'], 'smtp'),
    'host'      => (string)$pick(['host', 'smtp_host']),
    'port'      => (int)$pick(['port', 'smtp_port'], 465),
    'secure'    => (string)$pick(['secure', 'encryption'], 'ssl'),
    'user'      => $user,
    'pass'      => (string)$pick(['pass', 'password', 'smtp_pass']),
    'from'      => $from,
    'from_name' => (string)$pick(['from_name', 'fromName'], 'Komiks·Lab'),
    'reply_to'  => (string)$pick(['reply_to', 'replyTo'], $from),
  ];
}
// останню помилку пошти показуємо в адмінці, а не ховаємо в лог
function mail_error(?string $set = null): string {
  static $last = '';
  if ($set !== null) $last = $set;
  return $last;
}
// що не так у налаштуваннях: порожній пароль, залишений зразок, чужий домен відправника
function mail_problems(): array {
  $m = mail_cfg();
  $out = [];
  if (($m['transport'] ?? '') !== 'smtp') return ['Спосіб надсилання — «' . ($m['transport'] ?: 'mail') . '». На Hostinger надійно працює лише smtp.'];
  if ($m['host'] === '') $out[] = 'Не вказано host (має бути smtp.hostinger.com).';
  if ($m['user'] === '') $out[] = 'Не вказано пошту (user) — це адреса скриньки, створеної в hPanel → Emails.';
  if ($m['pass'] === '') $out[] = 'Не вказано пароль скриньки (pass).';
  elseif (preg_match('/^[А-ЯЄІЇҐ_ ]+$/u', $m['pass'])) $out[] = 'У полі pass лишився зразок, а не справжній пароль скриньки.';
  if ($m['user'] !== '' && $m['from'] !== '' && strcasecmp($m['user'], $m['from']) !== 0)
    $out[] = 'Відправник (from) не збігається зі скринькою (user) — Hostinger таке відхиляє. Зробіть їх однаковими.';
  if (!in_array((int)$m['port'], [465, 587], true)) $out[] = 'Порт має бути 465 (ssl) або 587 (tls).';
  return $out;
}
function send_mail(string $to, string $subject, string $html, string $text): bool {
  $m = mail_cfg();
  mail_error('');
  $from = $m['from'] ?? 'no-reply@localhost';
  $fromName = $m['from_name'] ?? 'Komiks·Lab';
  $boundary = 'kl_' . rand_hex(12);
  $enc = fn($s) => '=?UTF-8?B?' . base64_encode($s) . '?=';
  $headers = [
    'Date: ' . date('r'), 'From: ' . $enc($fromName) . " <$from>", 'Reply-To: ' . ($m['reply_to'] ?? $from), 'Message-ID: <' . rand_hex(16) . '@' . (explode('@', $from)[1] ?? 'localhost') . '>',
    'MIME-Version: 1.0', "Content-Type: multipart/alternative; boundary=\"$boundary\"",
  ];
  $body = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($text)) .
          "--$boundary\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($html)) . "--$boundary--\r\n";
  $transport = $m['transport'] ?? 'mail';
  try {
    if ($transport === 'log') {
      $dir = __DIR__ . '/data/mail'; @mkdir($dir, 0750, true);
      @file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
      file_put_contents($dir . '/' . date('Ymd-His') . '-' . preg_replace('/[^a-z0-9]+/i', '_', $to) . '.html', "<!-- To: $to | Subject: $subject -->\n" . $html);
      return true;
    }
    if ($transport === 'smtp') return smtp_send($m, $from, $to, 'To: ' . $to . "\r\nSubject: " . $enc($subject) . "\r\n" . implode("\r\n", $headers) . "\r\n\r\n" . $body);
    $sent = mail($to, $enc($subject), $body, implode("\r\n", $headers), '-f' . $from);
    if (!$sent) mail_error('PHP mail() повернув false — хостинг не прийняв лист. Використайте transport = smtp.');
    return $sent;
  } catch (Throwable $e) { mail_error($e->getMessage()); error_log('[komiks-mail] ' . $e->getMessage()); return false; }
}
// мінімальний SMTP-клієнт: SSL (465) або STARTTLS (587), AUTH LOGIN
function smtp_send(array $m, string $from, string $to, string $data): bool {
  $host = $m['host']; $port = (int)($m['port'] ?? 465); $secure = $m['secure'] ?? 'ssl';
  $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
  $fp = stream_socket_client(($secure === 'ssl' ? 'ssl://' : 'tcp://') . "$host:$port", $errno, $errstr, 15, STREAM_CLIENT_CONNECT, $ctx);
  if (!$fp) throw new RuntimeException("smtp connect: $errstr");
  stream_set_timeout($fp, 15);
  $read = function () use ($fp) { $r = ''; while (($line = fgets($fp, 515)) !== false) { $r .= $line; if (strlen($line) < 4 || $line[3] === ' ') break; } return $r; };
  $cmd = function (string $c, array $ok) use ($fp, $read) { fwrite($fp, $c . "\r\n"); $r = $read(); if (!in_array((int)substr($r, 0, 3), $ok, true)) throw new RuntimeException('smtp: ' . trim(explode("\r\n", $r)[0]) . ' after ' . explode(' ', $c)[0]); return $r; };
  $read();
  $ehloHost = parse_url(site_url(), PHP_URL_HOST) ?: 'localhost';
  $cmd("EHLO $ehloHost", [250]);
  if ($secure === 'tls') { $cmd('STARTTLS', [220]); if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) throw new RuntimeException('smtp starttls'); $cmd("EHLO $ehloHost", [250]); }
  if (!empty($m['user'])) { $cmd('AUTH LOGIN', [334]); $cmd(base64_encode($m['user']), [334]); $cmd(base64_encode((string)$m['pass']), [235]); }
  $cmd("MAIL FROM:<$from>", [250]);
  $cmd("RCPT TO:<$to>", [250, 251]);
  $cmd('DATA', [354]);
  $data = preg_replace('/^\./m', '..', str_replace(["\r\n", "\r"], ["\n", "\n"], $data));
  fwrite($fp, str_replace("\n", "\r\n", $data) . "\r\n.\r\n");
  $r = $read(); if ((int)substr($r, 0, 3) !== 250) throw new RuntimeException('smtp data: ' . trim($r));
  @fwrite($fp, "QUIT\r\n"); fclose($fp);
  return true;
}

// лист усім адміністраторам (напр., про нову реєстрацію): таблиця «поле — значення» + кнопка в адмінку
function notify_admins(string $subject, array $rows, string $adminPath = 'admin.php'): void {
  try {
    $to = array_column(q('SELECT email FROM kl_users WHERE is_admin = 1 AND blocked_at IS NULL LIMIT 5')->fetchAll(), 'email');
    $extra = cfg('notify'); if (is_string($extra) && valid_email($extra)) $to[] = $extra;
    $to = array_unique($to); if (!$to) return;
    $e = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
    $table = '<table style="border-collapse:collapse;width:100%">' . implode('', array_map(fn($r) => '<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;color:#777">' . $e($r[0]) . '</td><td style="padding:6px 10px;border-bottom:1px solid #eee;font-weight:700">' . $e($r[1]) . '</td></tr>', $rows)) . '</table>';
    $html = mail_layout('uk', $subject, $table, 'Відкрити в адмін-панелі', site_url() . $adminPath, date('d.m.Y H:i'), 'Komiks·Lab · сповіщення для адміністратора');
    $text = $subject . "\n\n" . implode("\n", array_map(fn($r) => $r[0] . ': ' . $r[1], $rows)) . "\n\n" . site_url() . $adminPath;
    foreach ($to as $addr) send_mail($addr, $subject, $html, $text);
  } catch (Throwable $e) { error_log('[komiks-notify] ' . $e->getMessage()); }
}

/* ---------- шаблони листів (inline-стилі для поштових програм) ---------- */
function mail_layout(string $lang, string $title, string $intro, string $button, string $url, string $after, string $footer): string {
  $e = fn($s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
  $site = site_url();
  return '<!doctype html><html lang="' . $e($lang) . '" dir="' . ($lang === 'ar' ? 'rtl' : 'ltr') . '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . $e($title) . '</title></head>'
    . '<body style="margin:0;padding:0;background:#fff8ea;font-family:Arial,Helvetica,sans-serif;color:#141414">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff8ea;padding:24px 12px"><tr><td align="center">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:4px solid #141414;border-radius:22px;overflow:hidden">'
    . '<tr><td style="background:#ffd23f;padding:20px 26px;border-bottom:4px solid #141414;font-size:24px;font-weight:900">💬 Komiks<span style="color:#ee4035">·Lab</span></td></tr>'
    . '<tr><td style="padding:28px 26px 8px"><h1 style="margin:0 0 12px;font-size:26px;line-height:1.2">' . $e($title) . '</h1><p style="margin:0 0 18px;font-size:16px;line-height:1.55">' . $intro . '</p>'
    . '<p style="margin:0 0 22px"><a href="' . $e($url) . '" style="display:inline-block;background:#ee4035;color:#ffffff;text-decoration:none;font-weight:900;font-size:17px;padding:14px 26px;border-radius:999px;border:3px solid #141414">' . $e($button) . '</a></p>'
    . '<p style="margin:0 0 18px;font-size:14px;line-height:1.55;color:#444">' . $after . '</p></td></tr>'
    . '<tr><td style="padding:14px 26px 22px;border-top:2px dashed #e0d6bf;font-size:12px;line-height:1.5;color:#777">' . $footer . '<br><a href="' . $e($site) . '" style="color:#1565c0">' . $e(preg_replace('~^https?://~', '', rtrim($site, '/'))) . '</a></td></tr>'
    . '</table></td></tr></table></body></html>';
}
function mail_texts(string $lang): array {
  $T = [
    'en' => [
      'back_subject' => 'A lot has changed in Komiks·Lab', 'back_title' => 'Long time no see, %s 👋',
      'back_intro' => 'Hi %s! Your Norwegian is still waiting for you — and the app has grown since your last visit. New comics, new tests and a few things that simply work better now.',
      'back_btn' => 'See what is new', 'back_after' => 'Ten minutes a day is enough to keep what you have learned.',
      'news_subject' => 'What’s new in Komiks·Lab', 'news_title' => 'Fresh in the app 📰',
      'news_intro' => 'Hi %s! Here is a short list of what changed recently — new stories, tests and small improvements.',
      'news_btn' => 'Read the updates', 'news_after' => 'Everything works right away, nothing to install.',
      'comic_subject' => 'A new comic for you — Komiks·Lab', 'comic_title' => 'A story for today 📖',
      'comic_intro' => 'Hi %s! Here is a comic you have not read yet. Norwegian audio, translation on hover, and a quiz at the end.',
      'comic_btn' => 'Read the comic', 'comic_after' => 'One story a day is a habit that holds.',
      'unsub' => 'Stop these emails',
      'magic_subject' => 'Your sign-in code — Komiks·Lab', 'magic_title' => 'Sign in to Komiks·Lab 🔑',
      'magic_intro' => 'Hi %s! Tap the button to sign in — no password needed. Or type the code below if you are on another device.',
      'magic_btn' => 'Sign me in', 'magic_after' => 'The link and the code work for 15 minutes and only once. If you did not ask to sign in, ignore this email — nobody can get in without it.',
      'magic_code' => 'Your code',
      'verify_subject' => 'Confirm your email — Komiks·Lab', 'verify_title' => 'Confirm your email 📬',
      'verify_intro' => 'Hi %s! Thanks for joining Komiks·Lab. Tap the button to confirm your email and activate your account.', 'verify_btn' => 'Confirm my email',
      'verify_after' => 'The link works for 48 hours. If you did not sign up, just ignore this email — nothing will happen.',
      'welcome_subject' => 'Welcome to Komiks·Lab! 🎉', 'welcome_title' => 'Welcome aboard, %s! 🎉',
      'welcome_intro' => 'Your email is confirmed and your account is ready. Here is how to start:<br>📖 read your first Norwegian comic with real voices,<br>🎨 create your hero in the avatar studio,<br>🏁 race friends in the Logic Race and collect badges.', 'welcome_btn' => 'Start learning',
      'welcome_after' => 'Your progress is now saved in your account and follows you on every device.',
      'reset_subject' => 'Reset your password — Komiks·Lab', 'reset_title' => 'Reset your password 🔑', 'reset_intro' => 'Hi %s! Someone (hopefully you) asked to reset the password for your Komiks·Lab account.', 'reset_btn' => 'Choose a new password', 'reset_after' => 'The link works for 1 hour. If it was not you, ignore this email — your password stays the same.',
      'exists_subject' => 'You already have a Komiks·Lab account', 'exists_title' => 'You already have an account 🙂', 'exists_intro' => 'Hi %s! Someone tried to sign up with this email, but you already have an account.', 'exists_btn' => 'Log in', 'exists_after' => 'Forgot your password? Use “Forgot password” on the login page.',
      'setpass_subject' => 'An account was created for you — Komiks·Lab', 'setpass_title' => 'Welcome, %s! 💎', 'setpass_intro' => 'A free Komiks·Lab account has been created for you. Choose your own password and start learning Norwegian with comics.', 'setpass_btn' => 'Choose my password', 'setpass_after' => 'The link works for 7 days. After that you can use “Forgot password” on the login page.',
      'footer' => 'You got this email because this address was used on Komiks·Lab — learn Norwegian with comics.'
    ],
    'no' => [
      'back_subject' => 'Mye er nytt i Komiks·Lab', 'back_title' => 'Lenge siden sist, %s 👋',
      'back_intro' => 'Hei %s! Norsken din venter fortsatt — og appen har vokst siden sist. Nye tegneserier, nye prøver og en del som rett og slett virker bedre nå.',
      'back_btn' => 'Se hva som er nytt', 'back_after' => 'Ti minutter om dagen holder på det du allerede kan.',
      'news_subject' => 'Hva er nytt i Komiks·Lab', 'news_title' => 'Nytt i appen 📰',
      'news_intro' => 'Hei %s! Her er en kort liste over hva som er endret i det siste – nye historier, prøver og små forbedringer.',
      'news_btn' => 'Les oppdateringene', 'news_after' => 'Alt virker med en gang, ingenting å installere.',
      'comic_subject' => 'En ny tegneserie til deg – Komiks·Lab', 'comic_title' => 'En historie til i dag 📖',
      'comic_intro' => 'Hei %s! Her er en tegneserie du ikke har lest ennå. Norsk lyd, oversettelse når du holder musen over, og en prøve til slutt.',
      'comic_btn' => 'Les tegneserien', 'comic_after' => 'Én historie om dagen er en vane som holder.',
      'unsub' => 'Stopp disse e-postene',
      'magic_subject' => 'Innloggingskoden din – Komiks·Lab', 'magic_title' => 'Logg inn på Komiks·Lab 🔑',
      'magic_intro' => 'Hei %s! Trykk på knappen for å logge inn – du trenger ikke passord. Eller skriv inn koden under hvis du sitter på en annen enhet.',
      'magic_btn' => 'Logg meg inn', 'magic_after' => 'Lenken og koden virker i 15 minutter og bare én gang. Hvis du ikke ba om å logge inn, kan du se bort fra e-posten.',
      'magic_code' => 'Koden din',
      'verify_subject' => 'Bekreft e-posten din – Komiks·Lab', 'verify_title' => 'Bekreft e-posten din 📬',
      'verify_intro' => 'Hei %s! Takk for at du ble med i Komiks·Lab. Trykk på knappen for å bekrefte e-posten og aktivere kontoen.', 'verify_btn' => 'Bekreft e-posten',
      'verify_after' => 'Lenken virker i 48 timer. Hvis du ikke har registrert deg, kan du se bort fra denne e-posten.',
      'welcome_subject' => 'Velkommen til Komiks·Lab! 🎉', 'welcome_title' => 'Velkommen, %s! 🎉',
      'welcome_intro' => 'E-posten er bekreftet, og kontoen er klar. Slik kommer du i gang:<br>📖 les din første norske tegneserie med ekte stemmer,<br>🎨 lag helten din i avatarstudioet,<br>🏁 konkurrer med venner i Logikkløpet og samle merker.', 'welcome_btn' => 'Begynn å lære',
      'welcome_after' => 'Fremgangen din lagres nå på kontoen og følger deg på alle enheter.',
      'reset_subject' => 'Tilbakestill passordet – Komiks·Lab', 'reset_title' => 'Nytt passord 🔑', 'reset_intro' => 'Hei %s! Noen (forhåpentligvis du) har bedt om å tilbakestille passordet til Komiks·Lab-kontoen din.', 'reset_btn' => 'Velg nytt passord', 'reset_after' => 'Lenken virker i 1 time. Hvis det ikke var deg, kan du se bort fra e-posten.',
      'exists_subject' => 'Du har allerede en konto i Komiks·Lab', 'exists_title' => 'Du har allerede en konto 🙂', 'exists_intro' => 'Hei %s! Noen prøvde å registrere seg med denne e-posten, men du har allerede en konto.', 'exists_btn' => 'Logg inn', 'exists_after' => 'Glemt passordet? Bruk «Glemt passord» på innloggingssiden.',
      'setpass_subject' => 'Det er laget en konto til deg – Komiks·Lab', 'setpass_title' => 'Velkommen, %s! 💎', 'setpass_intro' => 'Det er laget en gratis Komiks·Lab-konto til deg. Velg ditt eget passord og begynn å lære norsk med tegneserier.', 'setpass_btn' => 'Velg passord', 'setpass_after' => 'Lenken virker i 7 dager. Etterpå kan du bruke «Glemt passord» på innloggingssiden.',
      'footer' => 'Du fikk denne e-posten fordi adressen ble brukt på Komiks·Lab – lær norsk med tegneserier.'
    ],
    'uk' => [
      'back_subject' => 'У Комікс·Lab багато нового', 'back_title' => 'Давно не бачились, %s 👋',
      'back_intro' => 'Привіт, %s! Ваша норвезька досі чекає — а застосунок відтоді підріс. Нові комікси, нові тести й чимало того, що просто працює краще.',
      'back_btn' => 'Подивитися, що нового', 'back_after' => 'Десяти хвилин на день вистачає, щоб не забути вивчене.',
      'news_subject' => 'Що нового в Комікс·Lab', 'news_title' => 'Свіже в застосунку 📰',
      'news_intro' => 'Привіт, %s! Ось короткий список того, що змінилося останнім часом — нові історії, тести й дрібні покращення.',
      'news_btn' => 'Читати оновлення', 'news_after' => 'Усе працює одразу, нічого встановлювати не треба.',
      'comic_subject' => 'Новий комікс для вас — Комікс·Lab', 'comic_title' => 'Історія на сьогодні 📖',
      'comic_intro' => 'Привіт, %s! Ось комікс, якого ви ще не читали. Озвучення норвезькою, переклад при наведенні й тест наприкінці.',
      'comic_btn' => 'Читати комікс', 'comic_after' => 'Одна історія на день — звичка, яка тримається.',
      'unsub' => 'Більше не надсилати',
      'magic_subject' => 'Код для входу — Komiks·Lab', 'magic_title' => 'Вхід у Komiks·Lab 🔑',
      'magic_intro' => 'Привіт, %s! Натисніть кнопку — і ви всередині, пароль не потрібен. Або введіть код нижче, якщо заходите з іншого пристрою.',
      'magic_btn' => 'Увійти', 'magic_after' => 'Посилання й код діють 15 хвилин і лише один раз. Якщо входу ви не просили — просто проігноруйте лист: без нього ніхто не зайде.',
      'magic_code' => 'Ваш код',
      'verify_subject' => 'Підтвердіть пошту — Komiks·Lab', 'verify_title' => 'Підтвердіть свою пошту 📬',
      'verify_intro' => 'Привіт, %s! Дякуємо, що приєдналися до Komiks·Lab. Натисніть кнопку, щоб підтвердити пошту й активувати акаунт.', 'verify_btn' => 'Підтвердити пошту',
      'verify_after' => 'Посилання діє 48 годин. Якщо ви не реєструвалися — просто проігноруйте цей лист.',
      'welcome_subject' => 'Ласкаво просимо до Komiks·Lab! 🎉', 'welcome_title' => 'Ласкаво просимо, %s! 🎉',
      'welcome_intro' => 'Пошту підтверджено, акаунт готовий. З чого почати:<br>📖 прочитайте перший норвезький комікс з живими голосами,<br>🎨 створіть свого героя в студії аватара,<br>🏁 змагайтеся з друзями в Логік-гонці й збирайте значки.', 'welcome_btn' => 'Почати навчання',
      'welcome_after' => 'Тепер ваш прогрес зберігається в акаунті й доступний на будь-якому пристрої.',
      'reset_subject' => 'Скидання пароля — Komiks·Lab', 'reset_title' => 'Новий пароль 🔑', 'reset_intro' => 'Привіт, %s! Хтось (сподіваємось, ви) попросив скинути пароль до акаунта Komiks·Lab.', 'reset_btn' => 'Задати новий пароль', 'reset_after' => 'Посилання діє 1 годину. Якщо це були не ви — просто проігноруйте лист.',
      'exists_subject' => 'У вас уже є акаунт Komiks·Lab', 'exists_title' => 'У вас уже є акаунт 🙂', 'exists_intro' => 'Привіт, %s! Хтось спробував зареєструватися з цією поштою, але акаунт уже існує.', 'exists_btn' => 'Увійти', 'exists_after' => 'Забули пароль? Скористайтеся «Забули пароль?» на сторінці входу.',
      'setpass_subject' => 'Для вас створено акаунт — Komiks·Lab', 'setpass_title' => 'Ласкаво просимо, %s! 💎', 'setpass_intro' => 'Для вас створено безкоштовний акаунт Komiks·Lab. Задайте свій пароль і починайте вчити норвезьку через комікси.', 'setpass_btn' => 'Задати пароль', 'setpass_after' => 'Посилання діє 7 днів. Потім можна скористатися «Забули пароль?» на сторінці входу.',
      'footer' => 'Ви отримали цей лист, бо цю адресу вказали на Komiks·Lab — вивчення норвезької через комікси.'
    ],
    'ar' => [
      'back_subject' => 'جديد كثير في Komiks·Lab', 'back_title' => 'لم نرك منذ وقت، %s 👋',
      'back_intro' => 'مرحبًا %s! نرويجيتك ما زالت تنتظرك، والتطبيق كبر منذ آخر زيارة: قصص جديدة واختبارات وأشياء صارت أفضل.',
      'back_btn' => 'شاهد الجديد', 'back_after' => 'عشر دقائق في اليوم تكفي للحفاظ على ما تعلمته.',
      'news_subject' => 'ما الجديد في Komiks·Lab', 'news_title' => 'جديد في التطبيق 📰',
      'news_intro' => 'مرحبًا %s! هذه قائمة قصيرة بما تغيّر مؤخرًا — قصص واختبارات وتحسينات صغيرة.',
      'news_btn' => 'اقرأ التحديثات', 'news_after' => 'كل شيء يعمل فورًا بلا تثبيت.',
      'comic_subject' => 'قصة جديدة لك — Komiks·Lab', 'comic_title' => 'قصة اليوم 📖',
      'comic_intro' => 'مرحبًا %s! هذه قصة لم تقرأها بعد: صوت نرويجي وترجمة عند التمرير واختبار في النهاية.',
      'comic_btn' => 'اقرأ القصة', 'comic_after' => 'قصة واحدة يوميًا عادة تدوم.',
      'unsub' => 'أوقف هذه الرسائل',
      'magic_subject' => 'رمز الدخول — Komiks·Lab', 'magic_title' => 'الدخول إلى Komiks·Lab 🔑',
      'magic_intro' => 'مرحبًا %s! اضغط الزر للدخول بلا كلمة مرور. أو أدخل الرمز أدناه إذا كنت على جهاز آخر.',
      'magic_btn' => 'تسجيل الدخول', 'magic_after' => 'الرابط والرمز يعملان ١٥ دقيقة ومرة واحدة فقط. إذا لم تطلب الدخول فتجاهل الرسالة.',
      'magic_code' => 'رمزك',
      'verify_subject' => 'أكّد بريدك الإلكتروني — Komiks·Lab', 'verify_title' => 'أكّد بريدك الإلكتروني 📬',
      'verify_intro' => 'مرحبًا %s! شكرًا لانضمامك إلى Komiks·Lab. اضغط الزر لتأكيد بريدك وتفعيل حسابك.', 'verify_btn' => 'تأكيد البريد',
      'verify_after' => 'الرابط صالح لمدة 48 ساعة. إن لم تسجّل، فتجاهل هذه الرسالة.',
      'welcome_subject' => 'أهلًا بك في Komiks·Lab! 🎉', 'welcome_title' => 'أهلًا بك يا %s! 🎉',
      'welcome_intro' => 'تم تأكيد بريدك وحسابك جاهز. من أين تبدأ:<br>📖 اقرأ أول قصة نرويجية بأصوات حقيقية،<br>🎨 أنشئ بطلك في استوديو الشخصيات،<br>🏁 تسابق مع أصدقائك في سباق المنطق واجمع الأوسمة.', 'welcome_btn' => 'ابدأ التعلّم',
      'welcome_after' => 'يُحفظ تقدّمك الآن في حسابك ويرافقك على كل أجهزتك.',
      'reset_subject' => 'إعادة تعيين كلمة المرور — Komiks·Lab', 'reset_title' => 'كلمة مرور جديدة 🔑', 'reset_intro' => 'مرحبًا %s! طلب أحدهم (نأمل أنه أنت) إعادة تعيين كلمة مرور حسابك في Komiks·Lab.', 'reset_btn' => 'اختر كلمة مرور جديدة', 'reset_after' => 'الرابط صالح لساعة واحدة. إن لم تكن أنت، فتجاهل هذه الرسالة.',
      'exists_subject' => 'لديك حساب في Komiks·Lab بالفعل', 'exists_title' => 'لديك حساب بالفعل 🙂', 'exists_intro' => 'مرحبًا %s! حاول أحدهم التسجيل بهذا البريد، لكن لديك حساب بالفعل.', 'exists_btn' => 'تسجيل الدخول', 'exists_after' => 'نسيت كلمة المرور؟ استخدم «نسيت كلمة المرور؟» في صفحة الدخول.',
      'setpass_subject' => 'أُنشئ لك حساب — Komiks·Lab', 'setpass_title' => 'أهلًا بك يا %s! 💎', 'setpass_intro' => 'أُنشئ لك حساب مجاني في Komiks·Lab. اختر كلمة مرورك وابدأ تعلّم النرويجية بالقصص المصوّرة.', 'setpass_btn' => 'اختر كلمة المرور', 'setpass_after' => 'الرابط صالح لمدة 7 أيام. بعدها يمكنك استخدام «نسيت كلمة المرور؟» في صفحة الدخول.',
      'footer' => 'وصلتك هذه الرسالة لأن هذا العنوان استُخدم في Komiks·Lab — تعلّم النرويجية بالقصص المصوّرة.'
    ],
  ];
  return $T[$lang] ?? $T['en'];
}
/* Лист для входу без пароля: та сама кнопка, що й завжди, плюс великий код —
   його вводять руками, коли лист прийшов на телефон, а зайти треба на ноутбуці. */
/* Лист-нагадування. Відрізняється від службових трьома речами: його можна не
   хотіти (тому відписка в підвалі), його не можна слати часто (тому перевірка
   останньої відправки) і він веде на конкретну сторінку, а не «на сайт». */
const MAILOUT_GAP = 5 * 86400;   // тій самій людині той самий лист — не частіше

function mailout_recent(int $userId, string $kind): int {
  $r = one('SELECT sent_at FROM kl_mailouts WHERE user_id = ? AND kind = ? ORDER BY sent_at DESC', [$userId, $kind]);
  return (int)($r['sent_at'] ?? 0);
}

/* ---------- двофакторна автентифікація (TOTP) ---------- */

const TOTP_STEP = 30;       // крок часу, як у всіх автентифікаторах
const TOTP_WINDOW = 1;      // ±1 крок: годинник на телефоні завжди трохи плаває
const TOTP_DIGITS = 6;

/** Секрет у base32 — саме цей формат читають Google Authenticator і решта. */
function totp_secret(int $bytes = 20): string {
  $abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  $raw = random_bytes($bytes);
  $out = '';
  $buf = 0; $bits = 0;
  for ($i = 0; $i < strlen($raw); $i++) {
    $buf = ($buf << 8) | ord($raw[$i]);
    $bits += 8;
    while ($bits >= 5) { $bits -= 5; $out .= $abc[($buf >> $bits) & 31]; }
  }
  if ($bits > 0) $out .= $abc[($buf << (5 - $bits)) & 31];
  return $out;
}

function totp_decode(string $b32): string {
  $abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  $b32 = strtoupper(preg_replace('/[^A-Z2-7]/i', '', $b32));
  $buf = 0; $bits = 0; $out = '';
  for ($i = 0; $i < strlen($b32); $i++) {
    $v = strpos($abc, $b32[$i]);
    if ($v === false) continue;
    $buf = ($buf << 5) | $v;
    $bits += 5;
    if ($bits >= 8) { $bits -= 8; $out .= chr(($buf >> $bits) & 0xFF); }
  }
  return $out;
}

function totp_code(string $secret, ?int $at = null, int $offset = 0): string {
  $key = totp_decode($secret);
  $counter = intdiv(($at ?? time()), TOTP_STEP) + $offset;
  $bin = pack('N*', 0, $counter);                  // 8 байтів, старші нулі
  $hash = hash_hmac('sha1', $bin, $key, true);
  $o = ord($hash[19]) & 0xF;
  $num = ((ord($hash[$o]) & 0x7F) << 24) | (ord($hash[$o + 1]) << 16) | (ord($hash[$o + 2]) << 8) | ord($hash[$o + 3]);
  return str_pad((string)($num % (10 ** TOTP_DIGITS)), TOTP_DIGITS, '0', STR_PAD_LEFT);
}

/** Порівнюємо в сталий час і з вікном ±1 крок. */
function totp_check(string $secret, string $code): bool {
  $code = preg_replace('/\D+/', '', $code);
  if (strlen($code) !== TOTP_DIGITS) return false;
  for ($i = -TOTP_WINDOW; $i <= TOTP_WINDOW; $i++) {
    if (hash_equals(totp_code($secret, null, $i), $code)) return true;
  }
  return false;
}

/** Резервні коди: єдиний спосіб зайти, коли телефон загубився. */
function totp_backup_new(int $n = 8): array {
  $out = [];
  for ($i = 0; $i < $n; $i++) {
    $raw = strtoupper(bin2hex(random_bytes(4)));            // 8 символів
    $out[] = substr($raw, 0, 4) . '-' . substr($raw, 4, 4);
  }
  return $out;
}
function totp_backup_hash(array $codes): string {
  return json_encode(array_map(fn($c) => sha(strtoupper(preg_replace('/\W+/', '', $c))), $codes));
}
/** Використаний резервний код згоряє — повертаємо оновлений список або null. */
function totp_backup_take(array $user, string $code): ?string {
  $list = json_decode((string)($user['totp_backup'] ?? ''), true);
  if (!is_array($list)) return null;
  $want = sha(strtoupper(preg_replace('/\W+/', '', $code)));
  $left = [];
  $hit = false;
  foreach ($list as $h) {
    if (!$hit && hash_equals((string)$h, $want)) { $hit = true; continue; }
    $left[] = $h;
  }
  return $hit ? json_encode($left) : null;
}

function totp_on(?array $u): bool { return $u && !empty($u['totp_at']) && !empty($u['totp_secret']); }

/** Рядок для QR-коду: його читає будь-який автентифікатор. */
function totp_uri(array $user, string $secret): string {
  $issuer = rawurlencode('Komiks·Lab');
  $label = rawurlencode('Komiks·Lab:' . $user['email']);
  return "otpauth://totp/$label?secret=$secret&issuer=$issuer&algorithm=SHA1&digits=" . TOTP_DIGITS . '&period=' . TOTP_STEP;
}

function send_campaign(array $user, string $kind, string $url, string $extraHtml = ''): bool {
  $lang = in_array($user['lang'] ?? 'en', ['en', 'no', 'uk', 'ar'], true) ? $user['lang'] : 'en';
  $T = mail_texts($lang);
  $name = htmlspecialchars((string)$user['name'], ENT_QUOTES, 'UTF-8');
  $tok = new_token((int)$user['id'], 'unsub', 180 * 86400);
  $unsub = site_url() . 'api/auth.php?action=unsub&t=' . $tok;
  $foot = $T['footer'] . ' · <a href="' . $unsub . '" style="color:#5d5346">' . htmlspecialchars($T['unsub'], ENT_QUOTES, 'UTF-8') . '</a>';
  $html = mail_layout($lang, $T[$kind . '_title'], sprintf($T[$kind . '_intro'], $name) . $extraHtml,
    $T[$kind . '_btn'], $url, $T[$kind . '_after'], $foot);
  $text = sprintf($T[$kind . '_intro'], (string)$user['name']) . "\n\n" . $T[$kind . '_btn'] . ': ' . $url
    . "\n\n" . strip_tags($T[$kind . '_after']) . "\n" . $T['unsub'] . ': ' . $unsub;
  $ok = send_mail((string)$user['email'], $T[$kind . '_subject'], $html, $text);
  q('INSERT INTO kl_mailouts (user_id, kind, sent_at, ok) VALUES (?, ?, ?, ?)', [(int)$user['id'], $kind, time(), $ok ? 1 : 0]);
  return $ok;
}

function send_magic(array $user, string $url, string $code): bool {
  $lang = in_array($user['lang'] ?? 'en', ['en', 'no', 'uk', 'ar'], true) ? $user['lang'] : 'en';
  $T = mail_texts($lang);
  $name = htmlspecialchars((string)$user['name'], ENT_QUOTES, 'UTF-8');
  $pretty = substr($code, 0, 3) . ' ' . substr($code, 3);
  $box = '<div style="margin:18px 0;padding:14px 18px;border:3px dashed #141414;border-radius:14px;text-align:center">'
    . '<div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#5d5346">' . htmlspecialchars($T['magic_code'], ENT_QUOTES, 'UTF-8') . '</div>'
    . '<div style="font-size:34px;font-weight:900;letter-spacing:.18em;margin-top:4px">' . $pretty . '</div></div>';
  $html = mail_layout($lang, $T['magic_title'], sprintf($T['magic_intro'], $name) . $box,
    $T['magic_btn'], $url, $T['magic_after'], $T['footer']);
  $text = sprintf($T['magic_intro'], (string)$user['name']) . "\n\n"
    . $T['magic_code'] . ': ' . $pretty . "\n\n" . $T['magic_btn'] . ': ' . $url . "\n\n" . strip_tags($T['magic_after']);
  return send_mail((string)$user['email'], $T['magic_subject'], $html, $text);
}
function send_template(array $user, string $kind, string $url): bool {
  $lang = in_array($user['lang'] ?? 'en', ['en', 'no', 'uk', 'ar'], true) ? $user['lang'] : 'en';
  $T = mail_texts($lang);
  $name = htmlspecialchars((string)$user['name'], ENT_QUOTES, 'UTF-8');
  $title = sprintf($T[$kind . '_title'], (string)$user['name']);
  $intro = sprintf($T[$kind . '_intro'], $name);
  $html = mail_layout($lang, $title, $intro, $T[$kind . '_btn'], $url, $T[$kind . '_after'], $T['footer']);
  $text = strip_tags(str_replace('<br>', "\n", sprintf($T[$kind . '_intro'], (string)$user['name']))) . "\n\n" . $T[$kind . '_btn'] . ': ' . $url . "\n\n" . strip_tags($T[$kind . '_after']);
  return send_mail((string)$user['email'], $T[$kind . '_subject'], $html, $text);
}
