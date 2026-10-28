<?php
/* Комікс·Lab — 🐞 приймає помилку JavaScript із браузера чи застосунку (assets/boot.js).
 * Без кук і без людей: лише текст помилки, файл і рядок, розділ сайту (#/read/…), версія збірки
 * й «браузер · система». IP не зберігається — лише його згортка для ліміту частоти.
 * Однакові помилки згортаються в один рядок (err_record), видно їх у 🩺 Діагностика → Журнали.
 * Відповідь завжди 204: звіт про помилку ні на що не впливає й нічого не розповідає. */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

header('Cache-Control: no-store');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(405); exit; }
// лише з нашого сайту або застосунку (fetch keepalive з text/plain — без власних заголовків)
$from = (string)($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '');
$host = strtolower((string)parse_url($from, PHP_URL_HOST));
$mine = strtolower((string)parse_url(site_url(), PHP_URL_HOST));
if ($from !== '' && $host !== $mine && app_origin() === '' && !in_array($host, ['localhost', '127.0.0.1'], true)) { http_response_code(204); exit; }

/* «Браузер версія · система» з User-Agent — повний рядок не зберігаємо. */
function err_env(string $ua): string {
  $b = 'Інший';
  foreach (['EdgA?/(\d+)' => 'Edge', 'OPR/(\d+)' => 'Opera', 'SamsungBrowser/(\d+)' => 'Samsung', 'Firefox/(\d+)' => 'Firefox', 'Chrome/(\d+)' => 'Chrome', 'Version/(\d+)[\d.]* (Mobile/\S+ )?Safari' => 'Safari'] as $re => $name) {
    if (preg_match('~' . $re . '~', $ua, $m)) { $b = $name . ' ' . $m[1]; break; }
  }
  $os = str_contains($ua, 'Android') ? 'Android' : (preg_match('~iPhone|iPad|iPod~', $ua) ? 'iOS' : (str_contains($ua, 'Windows') ? 'Windows' : (str_contains($ua, 'Mac OS') ? 'macOS' : (str_contains($ua, 'Linux') ? 'Linux' : '?'))));
  $app = str_contains($ua, '; wv)') ? ' · застосунок' : '';
  return $b . ' · ' . $os . $app;
}
/* Адреса файла без домену й ?v=…: «assets/app.js». Чужі скрипти (розширення браузера тощо) — null. */
function err_src(string $s): ?string {
  if ($s === '') return '';
  $s = preg_replace('~[?#].*$~', '', $s);
  $site = site_url();
  if (str_starts_with($s, $site)) return substr($s, strlen($site));
  if (preg_match('~^(capacitor|ionic)://localhost/(.*)$~', $s, $m) || preg_match('~^https?://localhost(:\d+)?/(?:comiks/)?(.*)$~', $s, $m)) return 'app:' . end($m);
  return null;
}
/* шум, який нічого не каже про наш код: розширення, «Script error.», ResizeObserver, обірвана мережа
   (учень офлайн) і заборона автозапуску звуку до першого дотику */
function err_noise(string $msg): bool {
  return (bool)preg_match('~^Script error\.?$|ResizeObserver loop|chrome-extension://|moz-extension://|safari-(web-)?extension://|__gCrWeb|webkit\.messageHandlers'
    . '|^(TypeError: )?(Failed to fetch|NetworkError when attempting|Load failed|The (operation|user) aborted|AbortError)|play\(\) (request was interrupted|failed because)|NotAllowedError~i', $msg);
}
// маршрут без кодів друзів, кімнат і профілів: #/player/c/AB12CD → #/player/c/:code
function err_page(string $p): string {
  $p = preg_replace('~[?].*$~', '', $p);
  return (string)preg_replace('~/[A-Z0-9]{5,8}(?=/|$)~', '/:code', $p);   // коди — великі літери й цифри; #/words лишається
}

$raw = file_get_contents('php://input', false, null, 0, 6144) ?: '';
$in = json_decode($raw, true);
try {
  if (is_array($in) && !limited('jserr:' . ip_hash(), 30, 3600) && !limited('jserr:all', 3000, 86400)) {
    $msg = trim((string)($in['m'] ?? ''));
    $src = err_src((string)($in['s'] ?? ''));
    if ($msg !== '' && $src !== null && !err_noise($msg) && !err_noise((string)($in['st'] ?? ''))) {
      if (($in['k'] ?? '') === 'p') $msg = 'Promise: ' . $msg;
      // стек — лише кадри з нашими файлами, без доменів
      $stack = implode("\n", array_slice(array_map(fn($l) => str_replace(site_url(), '', trim($l)), preg_split('/\R/', (string)($in['st'] ?? ''))), 0, 6));
      err_record('js', $msg, $src, (int)($in['l'] ?? 0), $stack, err_page((string)($in['p'] ?? '')), (string)($in['v'] ?? ''), err_env((string)($_SERVER['HTTP_USER_AGENT'] ?? '')));
      sec_count('js');
    }
  }
} catch (Throwable $e) { error_log('[komiks-err] ' . $e->getMessage()); }
http_response_code(204);
