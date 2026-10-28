<?php
/* Комікс·Lab — приймає анонімний перегляд від assets/hits.js (navigator.sendBeacon).
 * Без кук, без сесії, IP не зберігається (див. api/stats.php). Відповідь завжди 204 —
 * лічильник не повинен ні на що впливати й нічого не розповідати. */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';
require __DIR__ . '/stats.php';

header('Cache-Control: no-store');
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { http_response_code(405); exit; }
/* Лише з нашого сайту: sendBeacon не вміє власних заголовків, тож CSRF-токена немає —
   натомість звіряємо Origin (або Referer), якщо браузер його надіслав. */
$from = (string)($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '');
$host = strtolower((string)parse_url($from, PHP_URL_HOST));
$mine = strtolower((string)parse_url(site_url(), PHP_URL_HOST));
if ($from !== '' && $host !== $mine && !in_array($host, ['localhost', '127.0.0.1'], true)) { http_response_code(204); exit; }
$raw = file_get_contents('php://input', false, null, 0, 2048) ?: '';
$in = json_decode($raw, true);
if (is_array($in)) {
  try { hit_record($in, (string)($_SERVER['REMOTE_ADDR'] ?? ''), substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 400)); }
  catch (Throwable $e) { error_log('[komiks-hit] ' . $e->getMessage()); }
}
http_response_code(204);
