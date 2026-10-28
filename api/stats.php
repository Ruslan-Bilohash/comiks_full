<?php
/* Комікс·Lab — 📈 анонімна статистика відвідувань (без кук і сторонніх сервісів).
 *
 * Що зберігаємо: лише лічильники за день (kl_hits: день + ключ → число) — перегляди, унікальні
 * відвідувачі, розділи, комікси, пристрій, система, мова інтерфейсу, звідки прийшли, година.
 * Унікальність рахуємо за добовою згорткою HMAC(сіль дня, IP + браузер): сама IP-адреса ніде
 * не пишеться, а сіль змінюється щодня й стара стирається — вчорашніх відвідувачів уже не
 * можна зіставити ні з ким. Рядки kl_hit_uv живуть лише сьогодні (для «зараз на сайті»).
 * Do Not Track / Global Privacy Control — не рахуємо зовсім (перевіряє assets/hits.js).
 */
declare(strict_types=1);
if (!defined('KOMIKS_API')) exit;

const HIT_TZ = 'Europe/Oslo';
const HIT_LIVE = 300;            // «зараз на сайті» — активність за останні 5 хвилин

function hits_install(): void {
  if (meta_get('hits_v') === '1') return;
  $my = is_mysql();
  $eng = $my ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';
  q("CREATE TABLE IF NOT EXISTS kl_hits (day CHAR(10) NOT NULL, k VARCHAR(64) NOT NULL, n INT NOT NULL DEFAULT 0, PRIMARY KEY (day, k))$eng");
  q("CREATE TABLE IF NOT EXISTS kl_hit_uv (day CHAR(10) NOT NULL, h CHAR(16) NOT NULL, first_at INT NOT NULL, last_at INT NOT NULL, pv INT NOT NULL DEFAULT 0, PRIMARY KEY (day, h))$eng");
  meta_set('hits_v', '1');
}
function hits_enabled(): bool { return meta_get('hits_off') !== '1'; }
function hit_day(?int $ts = null): string { return (new DateTimeImmutable('@' . ($ts ?? time())))->setTimezone(new DateTimeZone(HIT_TZ))->format('Y-m-d'); }

/* Сіль дня: нова щодня, попередня перезаписується — і разом із нею зникають учорашні згортки. */
function hit_salt(string $day): string {
  $cur = meta_get('hit_salt');
  if (str_starts_with($cur, $day . ':')) return substr($cur, 11);
  $salt = bin2hex(random_bytes(16));
  meta_set('hit_salt', $day . ':' . $salt);
  q('DELETE FROM kl_hit_uv WHERE day < ?', [$day]);
  return $salt;
}
function hit_inc(string $day, string $k, int $by = 1): void {
  $k = substr($k, 0, 64);
  if (q('UPDATE kl_hits SET n = n + ? WHERE day = ? AND k = ?', [$by, $day, $k])->rowCount()) return;
  try { q('INSERT INTO kl_hits (day, k, n) VALUES (?, ?, ?)', [$day, $k, $by]); }
  catch (Throwable $e) { q('UPDATE kl_hits SET n = n + ? WHERE day = ? AND k = ?', [$by, $day, $k]); }   // паралельний запит устиг вставити
}
function hit_device(string $ua): string {
  if (preg_match('/; wv\)|KomiksApp/i', $ua)) return 'app';
  if (preg_match('/iPad|Tablet|PlayBook|Silk/i', $ua) || (preg_match('/Android/i', $ua) && !preg_match('/Mobile/i', $ua))) return 'tablet';
  if (preg_match('/Mobi|iPhone|iPod|Android|Opera Mini|IEMobile/i', $ua)) return 'mobile';
  return 'desktop';
}
function hit_os(string $ua): string {
  foreach (['android' => '/Android/i', 'ios' => '/iPhone|iPad|iPod/i', 'windows' => '/Windows/i', 'mac' => '/Macintosh|Mac OS X/i', 'linux' => '/Linux|CrOS/i'] as $os => $re) if (preg_match($re, $ua)) return $os;
  return 'other';
}
/* 🧭 платформа для фільтра в «Огляді»: iPhone, iPad (Safari на iPad видає себе за Mac — тоді рятує
   ознака сенсорного екрана від клієнта), Android (телефон / планшет / застосунок), Windows (браузер /
   застосунок), Mac, Linux. */
const HIT_PLATS = ['iphone', 'ipad', 'android', 'android-tab', 'android-app', 'windows', 'windows-app', 'mac', 'linux', 'other'];
function hit_plat(string $ua, bool $touch, bool $winApp): string {
  if (preg_match('/; wv\)|KomiksApp/i', $ua)) return 'android-app';
  if (preg_match('/iPhone|iPod/i', $ua)) return 'iphone';
  if (preg_match('/iPad/i', $ua) || (preg_match('/Macintosh/i', $ua) && $touch)) return 'ipad';
  if (preg_match('/Android/i', $ua)) return preg_match('/Mobile/i', $ua) ? 'android' : 'android-tab';
  if (preg_match('/Windows/i', $ua)) return $winApp ? 'windows-app' : 'windows';
  if (preg_match('/Macintosh|Mac OS X/i', $ua)) return 'mac';
  if (preg_match('/Linux|CrOS/i', $ua)) return 'linux';
  return 'other';
}
function hit_browser(string $ua): string {
  if (preg_match('/; wv\)/', $ua)) return 'webview';
  foreach (['edge' => '/Edg(e|A|iOS)?\//', 'opera' => '/OPR\/|Opera/', 'samsung' => '/SamsungBrowser/', 'firefox' => '/Firefox|FxiOS/', 'chrome' => '/Chrome|CriOS/', 'safari' => '/Safari/'] as $b => $re) if (preg_match($re, $ua)) return $b;
  return 'other';
}
function hit_is_bot(string $ua): bool {
  return $ua === '' || (bool)preg_match('/bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|embedly|curl|wget|python|httpclient|monitor/i', $ua);
}
// джерело: домен без www, відомі сервіси зводимо до назви
function hit_ref(string $r): string {
  $r = strtolower(trim($r));
  if ($r === '') return 'direct';
  $r = preg_replace('/^www\./', '', $r);
  if (!preg_match('/^[a-z0-9.-]{1,80}$/', $r)) return 'other';
  $map = ['google' => '/(^|\.)google\.[a-z.]+$/', 'bing' => '/(^|\.)bing\.com$/', 'duckduckgo' => '/duckduckgo\.com$/', 'yandex' => '/yandex\./',
    'facebook' => '/(^|\.)(facebook|fb)\.(com|me)$/', 'instagram' => '/instagram\.com$/', 'x' => '/^(t\.co|x\.com|twitter\.com)$/', 'youtube' => '/youtube\.com$|youtu\.be$/',
    'telegram' => '/^t\.me$|telegram\./', 'whatsapp' => '/whatsapp\./', 'chatgpt' => '/chatgpt\.com$|openai\.com$/', 'reddit' => '/reddit\.com$/', 'linkedin' => '/linkedin\.com$|lnkd\.in$/',
    'play' => '/play\.google\.com$/', 'bilohash' => '/(^|\.)bilohash\.com$/'];
  foreach ($map as $name => $re) if (preg_match($re, $r)) return $name;
  return $r;
}

/* UTM має пріоритет над referrer: застосунки соцмереж і ChatGPT часто навмисно
   приховують referrer, але позначене посилання все одно дає правильне джерело. */
function hit_source(string $utm, string $ref): string {
  $u = strtolower(trim(rawurldecode($utm)));
  if ($u === '') return hit_ref($ref);
  $aliases = [
    'google' => '/^(google|googleads|google-ads|adwords)$/',
    'facebook' => '/^(facebook|fb|meta|facebook-ads|meta-ads)$/',
    'instagram' => '/^(instagram|ig|insta|instagram-ads)$/',
    'linkedin' => '/^(linkedin|linkedin-ads)$/',
    'chatgpt' => '/^(chatgpt|openai|gpt)$/',
    'youtube' => '/^(youtube|yt)$/',
    'telegram' => '/^(telegram|tg)$/',
    'whatsapp' => '/^(whatsapp|wa)$/',
    'x' => '/^(x|twitter)$/',
    'email' => '/^(email|e-mail|newsletter|mail)$/',
  ];
  foreach ($aliases as $name => $re) if (preg_match($re, $u)) return $name;
  // utm_source нерідко містить повний домен: chatgpt.com, l.instagram.com тощо.
  if (preg_match('/^[a-z0-9.-]{1,80}$/', $u)) {
    $mapped = hit_ref($u);
    if ($mapped !== $u || str_contains($u, '.')) return $mapped;
  }
  // Власні кампанії залишаємо читабельними, але не приймаємо довільний текст.
  $u = trim((string)preg_replace('/[^a-z0-9._-]+/', '-', $u), '-_.');
  return $u === '' ? hit_ref($ref) : substr($u, 0, 48);
}

/* Старі записи зберігаємо в MySQL як є, а для показу об'єднуємо домени сервісів
   з новими нормалізованими ключами. Так platform.openai.com стає ChatGPT без міграції. */
function hit_merge_sources(array $rows): array {
  $out = [];
  foreach ($rows as $source => $n) {
    $key = hit_source('', (string)$source);
    $out[$key] = ($out[$key] ?? 0) + (int)$n;
  }
  arsort($out, SORT_NUMERIC);
  return $out;
}

/* Один перегляд. $in: s — розділ, id — комікс, l — мова, r — домен-джерело (лише на першому
   перегляді вкладки), ret — уже бував (позначка в localStorage), hb — лише «я ще тут». */
function hit_record(array $in, string $ip, string $ua): void {
  if (!hits_enabled() || hit_is_bot($ua)) return;
  hits_install();
  $now = time(); $day = hit_day($now);
  $h = substr(hash_hmac('sha256', $ip . '|' . $ua, hit_salt($day)), 0, 16);
  if (limited('hit:' . $h, 600, 86400)) return;
  if (!empty($in['hb'])) { q('UPDATE kl_hit_uv SET last_at = ? WHERE day = ? AND h = ?', [$now, $day, $h]); return; }
  // 📲 встановлення застосунку (один раз на пристрій, див. assets/hits.js)
  if (!empty($in['inst'])) { $k = (string)$in['inst']; if (preg_match('/^(ios|android|windows|mac|other)-(app|home)$/', $k)) hit_inc($day, 'inst:' . $k); return; }
  $s = (string)($in['s'] ?? '');
  $s = preg_match('/^[a-z]{0,16}$/', $s) ? ($s === '' ? 'home' : $s) : 'other';
  $new = false;
  if (!q('UPDATE kl_hit_uv SET last_at = ?, pv = pv + 1 WHERE day = ? AND h = ?', [$now, $day, $h])->rowCount()) {
    try { q('INSERT INTO kl_hit_uv (day, h, first_at, last_at, pv) VALUES (?, ?, ?, ?, 1)', [$day, $h, $now, $now]); $new = true; }
    catch (Throwable $e) { /* паралельний перший перегляд — уже враховано */ }
  }
  $plat = hit_plat($ua, !empty($in['tp']), !empty($in['wa']));
  if ($new) {
    hit_inc($day, 'uv');
    hit_inc($day, 'uv@' . $plat);
    hit_inc($day, 'plat:' . $plat);
    hit_inc($day, 'br:' . hit_browser($ua));
    hit_inc($day, 'dev:' . hit_device($ua));
    hit_inc($day, 'os:' . hit_os($ua));
    $l = (string)($in['l'] ?? '');
    if (preg_match('/^[a-z]{2}$/', $l)) hit_inc($day, 'lang:' . $l);
    hit_inc($day, !empty($in['ret']) ? 'ret' : 'new');
    hit_inc($day, 'ref:' . hit_source((string)($in['u'] ?? ''), (string)($in['r'] ?? '')));
    hit_inc($day, 'land:' . $s);
  }
  hit_inc($day, 'pv');
  hit_inc($day, 'pv@' . $plat);
  hit_inc($day, 'sec:' . $s);
  hit_inc($day, 'hour:' . (new DateTimeImmutable('@' . $now))->setTimezone(new DateTimeZone(HIT_TZ))->format('H'));
  $id = (string)($in['id'] ?? '');
  if (in_array($s, ['read', 'quiz', 'english', 'cards', 'pairs', 'role'], true) && preg_match('/^[a-z0-9-]{1,16}$/', $id)) hit_inc($day, 'comic:' . $id);
}

/* ---------- вибірки для дашборду ---------- */
function hits_days(int $n, int $offset = 0): array {
  $out = [];
  for ($i = $n - 1 + $offset; $i >= $offset; $i--) $out[] = hit_day(time() - $i * 86400);
  return $out;
}
// ряд по днях для одного ключа
function hits_series(array $days, string $k): array {
  if (meta_get('hits_v') !== '1') return array_fill(0, count($days), 0);
  $ph = implode(',', array_fill(0, count($days), '?'));
  $map = [];
  foreach (q("SELECT day, n FROM kl_hits WHERE k = ? AND day IN ($ph)", array_merge([$k], $days))->fetchAll() as $r) $map[$r['day']] = (int)$r['n'];
  return array_map(fn($d) => $map[$d] ?? 0, $days);
}
// суми за період для всіх ключів із префіксом: ['mobile' => 12, …], за спаданням
function hits_group(array $days, string $prefix, int $limit = 12): array {
  if (meta_get('hits_v') !== '1') return [];
  $ph = implode(',', array_fill(0, count($days), '?'));
  $rows = q("SELECT k, SUM(n) AS n FROM kl_hits WHERE k LIKE ? AND day IN ($ph) GROUP BY k ORDER BY n DESC", array_merge([$prefix . '%'], $days))->fetchAll();
  $out = [];
  foreach (array_slice($rows, 0, $limit) as $r) $out[substr($r['k'], strlen($prefix))] = (int)$r['n'];
  return $out;
}
function hits_live(): int {
  if (meta_get('hits_v') !== '1') return 0;
  return (int)(one('SELECT COUNT(*) AS n FROM kl_hit_uv WHERE day = ? AND last_at > ?', [hit_day(), time() - HIT_LIVE])['n'] ?? 0);
}
