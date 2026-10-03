<?php
/* Комікс·Lab — 🔊 жива озвучка для динамічних реплік (телефонні дзвінки з ШІ).
 *
 * POST { action: "say", text, voice? }  → { ok, audio: "data:audio/mpeg;base64,…", cached }
 * GET  ?action=state                    → { ok, ready, provider }
 *
 * Навіщо: комікси озвучені заздалегідь (нейроголоси edge-tts, mp3 у /audio), але репліки ШІ
 * народжуються на льоту. Синтез браузера звучить роботом, тому тут — нейронний голос провайдера.
 * Ключ лишається на сервері (api/config.php → 'tts', або 'ai', якщо окремого немає).
 * Готові файли кешуються в api/data/tts/<hash>.mp3 — повтори безкоштовні.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

const TTS_MAX_TEXT = 400;
const TTS_DAY = 120;        // реплік на добу на акаунт/IP (кеш не рахується)

if (method() === 'GET') {
  if ((string)($_GET['action'] ?? '') !== 'state') fail('action', 404);
  /* off — голос вимкнено навмисно (конфіг або провайдер «none»). Це не те саме, що
     «не налаштовано»: у такому разі фронт прибирає кнопки, а не читає роботом. */
  out(['ok' => true, 'ready' => tts_ready(), 'off' => tts_voice_off(), 'provider' => tts_provider()]);
}
if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input();
if ((string)($in['action'] ?? '') !== 'say') fail('action', 404);
if (!tts_ready()) fail('no_tts', 503);

$text = clean_text((string)($in['text'] ?? ''), TTS_MAX_TEXT);
if ($text === '') fail('text');
$voice = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)($in['voice'] ?? '')) ?: tts_voice();

$dir = __DIR__ . '/data/tts';
if (!is_dir($dir)) @mkdir($dir, 0750, true);
$hash = hash('sha256', tts_provider() . '|' . $voice . '|' . $text);
$file = $dir . '/' . substr($hash, 0, 32) . '.mp3';

if (is_file($file) && filesize($file) > 0) {
  out(['ok' => true, 'cached' => true, 'audio' => 'data:audio/mpeg;base64,' . base64_encode((string)file_get_contents($file))]);
}

$u = current_user();
$id = $u ? 'u' . $u['id'] : ip_hash();
if (limited('tts:' . $id, TTS_DAY, 86400)) fail('tts_limit', 429);

$mp3 = tts_speak($text, $voice);
if ($mp3 === null) fail('tts', 502);
@file_put_contents($file, $mp3);
@chmod($file, 0640);
// кеш не має рости безмежно: лишаємо 500 найсвіжіших файлів
$files = glob($dir . '/*.mp3') ?: [];
if (count($files) > 500) {
  usort($files, fn($a, $b) => filemtime($a) <=> filemtime($b));
  foreach (array_slice($files, 0, count($files) - 500) as $old) @unlink($old);
}
out(['ok' => true, 'cached' => false, 'audio' => 'data:audio/mpeg;base64,' . base64_encode($mp3)]);
