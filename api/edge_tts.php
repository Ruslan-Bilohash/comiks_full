<?php
/* Комікс·Lab — 🎙️ нейронні голоси Microsoft Edge (ті самі, що озвучують комікси) прямо з PHP.
 *
 * Навіщо: репліки ШІ в телефонних дзвінках народжуються на льоту, і синтез браузера звучить роботом.
 * Тут ми просимо той самий сервіс, яким користується tools/gen_audio.py (edge-tts), тільки без Python
 * і без жодних ключів: відкриваємо захищений WebSocket, надсилаємо SSML і збираємо mp3 із відповіді.
 *
 * Голоси: nb-NO-PernilleNeural (ж), nb-NO-FinnNeural (ч), en-US-AvaMultilingualNeural тощо.
 * Якщо сервіс недоступний (закритий вихідний трафік на хостингу) — повертаємо null, і застосунок
 * тихо переходить на голос браузера.
 */
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(403); exit; }

const EDGE_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const EDGE_HOST = 'speech.platform.bing.com';
const EDGE_FMT = 'audio-24khz-48kbitrate-mono-mp3';
/* Версію браузера сервіс перевіряє. Якщо колись почне відповідати 403 — оновіть ці рядки
   (актуальні значення видно в edge-tts: constants.SEC_MS_GEC_VERSION). */
const EDGE_VERSION = '1-143.0.3650.75';
const EDGE_CHROME = '143.0.0.0';

// підпис запиту, як його рахує edge-tts: SHA-256 від «тіків Windows, округлених до 5 хвилин» + токен
function edge_gec(): string {
  $ticks = (int)floor((time() + 11644473600) / 300) * 300 * 10000000;
  return strtoupper(hash('sha256', $ticks . EDGE_TOKEN));
}
function edge_uuid(): string { return str_replace('-', '', bin2hex(random_bytes(16))); }

// одна клієнтська рамка WebSocket (клієнт завжди маскує дані)
function edge_frame(string $payload, int $opcode = 0x1): string {
  $len = strlen($payload);
  $head = chr(0x80 | $opcode);
  if ($len < 126) $head .= chr(0x80 | $len);
  elseif ($len < 65536) $head .= chr(0x80 | 126) . pack('n', $len);
  else $head .= chr(0x80 | 127) . pack('J', $len);
  $mask = random_bytes(4);
  $out = '';
  for ($i = 0; $i < $len; $i++) $out .= $payload[$i] ^ $mask[$i % 4];
  return $head . $mask . $out;
}

/* читає рамки, поки не прийде повідомлення «turn.end»; повертає склеєний mp3 або null */
function edge_read($sock, float $deadline): ?string {
  $audio = '';
  $buf = '';
  $done = false;
  while (!$done && microtime(true) < $deadline) {
    $chunk = fread($sock, 16384);
    if ($chunk === false || $chunk === '') { if (feof($sock)) break; usleep(20000); continue; }
    $buf .= $chunk;
    while (strlen($buf) >= 2) {
      $b1 = ord($buf[0]); $b2 = ord($buf[1]);
      $op = $b1 & 0x0f; $len = $b2 & 0x7f; $off = 2;
      if ($len === 126) { if (strlen($buf) < 4) break 2; $len = unpack('n', substr($buf, 2, 2))[1]; $off = 4; }
      elseif ($len === 127) { if (strlen($buf) < 10) break 2; $len = (int)unpack('J', substr($buf, 2, 8))[1]; $off = 10; }
      if (strlen($buf) < $off + $len) break 2;
      $data = substr($buf, $off, $len);
      $buf = substr($buf, $off + $len);
      if ($op === 0x8) { $done = true; break; }              // сервер закрив зʼєднання
      if ($op === 0x2) {                                      // двійкова рамка: заголовок + аудіо
        $hdrLen = strlen($data) >= 2 ? unpack('n', substr($data, 0, 2))[1] : 0;
        $audio .= substr($data, 2 + $hdrLen);
      } elseif ($op === 0x1) {                                // текстова: службові повідомлення
        if (str_contains($data, 'Path:turn.end')) { $done = true; break; }
      }
    }
  }
  return $audio !== '' ? $audio : null;
}

/* Головна функція: текст → mp3 (або null). $voice — ім’я нейроголосу Microsoft. */
function edge_tts_speak(string $text, string $voice = 'nb-NO-PernilleNeural', string $rate = '-4%', string $pitch = '+0Hz'): ?string {
  $text = trim($text);
  if ($text === '') return null;
  $url = '/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=' . EDGE_TOKEN
    . '&Sec-MS-GEC=' . edge_gec() . '&Sec-MS-GEC-Version=' . EDGE_VERSION . '&ConnectionId=' . edge_uuid();
  $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true]]);
  $sock = @stream_socket_client('ssl://' . EDGE_HOST . ':443', $errno, $errstr, 8, STREAM_CLIENT_CONNECT, $ctx);
  if (!$sock) { error_log('[komiks-edge] connect: ' . $errstr); return null; }
  stream_set_timeout($sock, 8);
  stream_set_blocking($sock, false);

  $key = base64_encode(random_bytes(16));
  $req = "GET $url HTTP/1.1\r\nHost: " . EDGE_HOST . "\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n"
    . "Sec-WebSocket-Key: $key\r\nSec-WebSocket-Version: 13\r\n"
    . "Pragma: no-cache\r\nCache-Control: no-cache\r\nAccept-Language: en-US,en;q=0.9\r\n"
    . "Origin: chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold\r\n"
    . "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/" . EDGE_CHROME . " Safari/537.36 Edg/" . EDGE_CHROME . "\r\n\r\n";
  @fwrite($sock, $req);

  // чекаємо на «101 Switching Protocols»
  $head = ''; $t0 = microtime(true);
  while (microtime(true) - $t0 < 8) {
    $line = fread($sock, 2048);
    if ($line !== false && $line !== '') $head .= $line;
    if (str_contains($head, "\r\n\r\n")) break;
    usleep(20000);
  }
  if (!str_contains($head, '101')) { error_log('[komiks-edge] handshake: ' . substr($head, 0, 120)); fclose($sock); return null; }

  $stamp = gmdate('D M d Y H:i:s') . ' GMT+0000 (Coordinated Universal Time)';
  $cfg = "X-Timestamp:$stamp\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n"
    . '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"' . EDGE_FMT . '"}}}}';
  @fwrite($sock, edge_frame($cfg));

  $safe = htmlspecialchars($text, ENT_XML1 | ENT_QUOTES, 'UTF-8');
  $ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="nb-NO">'
    . '<voice name="' . $voice . '"><prosody pitch="' . $pitch . '" rate="' . $rate . '" volume="+0%">' . $safe . '</prosody></voice></speak>';
  $msg = 'X-RequestId:' . edge_uuid() . "\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:$stamp\r\nPath:ssml\r\n\r\n" . $ssml;
  @fwrite($sock, edge_frame($msg));

  $mp3 = edge_read($sock, microtime(true) + 20);
  @fwrite($sock, edge_frame('', 0x8));
  fclose($sock);
  return ($mp3 !== null && strlen($mp3) > 1024) ? $mp3 : null;
}
