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
const EDGE_VERSION = '2-143.0.3650.75';
const EDGE_CHROME = '143.0.0.0';

/* Підпис Sec-MS-GEC версії 2 — як у edge-tts 7.3 (drm.py → generate_sec_ms_gec_v2): «тіки Windows,
   округлені до 5 хвилин» + токен → SHA-256 із прихованим префіксом (Microsoft заклав його як проміжний
   стан першого блоку) і контрольна сума CS64. Формат «<16 hex>-<64 hex>».
   Python рахує довгими цілими; тут — 32-бітні слова в 64-бітних int, а множення 32×32 — через
   edge_mul32 по 16-бітних половинах (звичайне множення в PHP переповнилося б у float).
   Перевірено збігом із Python (edge_tts.drm.generate_sec_ms_gec_v2) на фіксованих моментах часу. */
const EDGE_U32 = 0xFFFFFFFF;
const EDGE_SHA_INIT = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
const EDGE_SHA_STATE = [0xFD9FBEA2, 0x91243CE7, 0xBE499094, 0xCD2E1E0A, 0x6C006F49, 0x04BD35AB, 0xFEB0A7E4, 0x03EFFBD2];
const EDGE_SHA_SCHEDULE = [0xEB24BF9E, 0x1558691F, 0xA0C09EE2, 0x0CFA32BA, 0xA622EE8C, 0xD1DD9491, 0xC0DD25A0, 0xF9E70AB6, 0xF0C31573, 0x7058CE4E, 0x7188E606, 0x00E5AB33, 0xD258B060, 0x72766564];
const EDGE_SHA_K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];
const EDGE_SHA_ADJ = 0xC9DC06A7;
const EDGE_SIGMA0_ADJ = 0x059C0B80;
const EDGE_SIGMA1_ADJ = 0x000B92C0;
const EDGE_CS64_COEF = [[0xE82E91B1, 0xB32700D0], [0x44DE24C6, 0x88DFF51D], [0x3BEB65BC, 0x29514038], [0xC89C5933, 0xB328CBDF], [0x8D1EC211, 0xD405B4D5],
  [0x314EF5D5, 0x26E55F3C], [0xE92491B1, 0x607801C6], [0xF0A5B9D5, 0x82B2C1FB], [0x06064CF3, 0xFA51A3DA], [0xDA79FA60, 0x207CC464],
  [0xBED20560, 0x3C3C74F3], [0x89F9C9F8, 0xD2D14B61], [0x35FA38C6, 0xBB04A2C1], [0xCB49E3C6, 0xC5626167]];
const EDGE_CS64_FACTOR = 0x82893933;
const EDGE_CS64_ADJ0 = 0xF2F90B1A;
const EDGE_CS64_ADJ1 = 0x0B1A0000;

function edge_mul32(int $a, int $b): int { return (($a * ($b & 0xFFFF)) + ((($a * ($b >> 16)) & 0xFFFF) << 16)) & EDGE_U32; }
function edge_rotr(int $x, int $n): int { return (($x >> $n) | ($x << (32 - $n))) & EDGE_U32; }
function edge_rol16(int $v): int { $v &= EDGE_U32; return (($v << 16) | ($v >> 16)) & EDGE_U32; }
function edge_s0(int $v): int { return edge_rotr($v, 7) ^ edge_rotr($v, 18) ^ ($v >> 3); }
function edge_s1(int $v): int { return edge_rotr($v, 17) ^ edge_rotr($v, 19) ^ ($v >> 10); }
function edge_expand(array &$w, int $from): void {
  for ($i = $from; $i < 64; $i++) $w[$i] = (edge_s1($w[$i - 2]) + $w[$i - 7] + edge_s0($w[$i - 15]) + $w[$i - 16]) & EDGE_U32;
}
function edge_rounds(array $s, array $w, int $first, array $k): array {
  [$a, $b, $c, $d, $e, $f, $g, $h] = $s;
  for ($i = $first; $i < 64; $i++) {
    $t1 = ($h + (edge_rotr($e, 6) ^ edge_rotr($e, 11) ^ edge_rotr($e, 25)) + ($g ^ ($e & ($f ^ $g))) + $k[$i] + $w[$i]) & EDGE_U32;
    $t2 = ((edge_rotr($a, 2) ^ edge_rotr($a, 13) ^ edge_rotr($a, 22)) + (($a & $b) | ($c & ($a | $b)))) & EDGE_U32;
    [$h, $g, $f, $e, $d, $c, $b, $a] = [$g, $f, $e, ($d + $t1) & EDGE_U32, $c, $b, $a, ($t1 + $t2) & EDGE_U32];
  }
  return [$a, $b, $c, $d, $e, $f, $g, $h];
}
// перший блок із прихованими 57 байтами: лишаються лише слова 14–15 (перші 7 байтів наших даних)
function edge_sha_init(string $d7): array {
  $w = array_fill(0, 14, 0);
  $w[14] = (ord($d7[0]) << 16) | (ord($d7[1]) << 8) | ord($d7[2]);
  $w[15] = unpack('N', substr($d7, 3, 4))[1];
  for ($i = 16; $i < 30; $i++) {
    $v = EDGE_SHA_SCHEDULE[$i - 16];
    $v += $i === 16 ? (edge_s1($w[$i - 2]) ^ EDGE_SIGMA1_ADJ) : edge_s1($w[$i - 2]);
    if ($i >= 21) $v += $w[$i - 7];
    if ($i >= 29) $v += $i === 29 ? (edge_s0($w[$i - 15]) ^ EDGE_SIGMA0_ADJ) : edge_s0($w[$i - 15]);
    $w[$i] = $v & EDGE_U32;
  }
  $w[30] = (edge_s1($w[28]) + $w[23] + edge_s0($w[15]) + $w[14] + EDGE_SHA_ADJ - EDGE_SHA_K[14]) & EDGE_U32;
  edge_expand($w, 31);
  $k = EDGE_SHA_K; $k[14] = EDGE_SHA_ADJ;
  $work = edge_rounds(EDGE_SHA_STATE, $w, 14, $k);
  return array_map(fn($x, $y) => ($x + $y) & EDGE_U32, EDGE_SHA_INIT, $work);
}
function edge_sha_digest(string $data): string {
  $len = 57 + strlen($data);
  $pad = substr($data, 7) . "\x80" . str_repeat("\0", ((55 - $len) % 64 + 64) % 64) . pack('J', $len * 8);
  $state = edge_sha_init(substr($data, 0, 7));
  for ($o = 0; $o < strlen($pad); $o += 64) {
    $w = array_values(unpack('N16', substr($pad, $o, 64)));
    edge_expand($w, 16);
    $work = edge_rounds($state, $w, 0, EDGE_SHA_K);
    $state = array_map(fn($x, $y) => ($x + $y) & EDGE_U32, $state, $work);
  }
  return pack('N8', ...$state);
}
function edge_cs64(string $data, string $digest): array {
  [$ka, $kb] = array_values(unpack('V2', substr($digest, 0, 8)));
  $ka |= 1; $kb |= 1;
  $fac = [edge_mul32($ka, EDGE_CS64_FACTOR), edge_mul32($kb, EDGE_CS64_FACTOR)];
  $terms = []; $offs = [];
  foreach (EDGE_CS64_COEF as $i => [$coef, $off]) { $terms[] = edge_mul32($coef, $fac[$i % 2]); $offs[] = $off; }
  $raw = "\0" . $data;
  $raw .= str_repeat("\0", (4 - strlen($raw) % 4) % 4);
  $words = array_values(unpack('V*', $raw));
  if (count($words) % 2) $words[] = 0;
  foreach ($words as $i => $word) {
    $term = edge_mul32($word, $i % 2 === 0 ? $ka : $kb);
    $off = edge_mul32(edge_rol16($word), $i % 2 === 0 ? 0xEF0569FB : 0xC31713DB);
    if ($i === 0) { $term += edge_mul32(EDGE_CS64_ADJ0, $fac[0]); $off += EDGE_CS64_ADJ1; }
    $terms[] = $term & EDGE_U32; $offs[] = $off & EDGE_U32;
  }
  $swapAcc = $swapLast = $st = $acc = 0;
  for ($i = 0, $n = count($terms); $i < $n; $i += 2) {
    $x = $terms[$i]; $y = $terms[$i + 1];
    $q = edge_mul32(edge_rol16(($offs[$i] + $x) & EDGE_U32), 0x76F50F34);
    $swapAcc += (edge_mul32(edge_rol16($q), 0xC3EFEA97) + $q) & EDGE_U32;
    $q = edge_mul32(edge_rol16(($offs[$i + 1] + $y) & EDGE_U32), 0x1881CE3C);
    $swapLast = (edge_mul32(edge_rol16($q), 0x35BD1EC9) + $q) & EDGE_U32;
    $swapAcc = ($swapAcc + $swapLast) & EDGE_U32;
    $st = (edge_mul32($st, $ka) + $x) & EDGE_U32;
    foreach ([0xCF98B111, 0x87085B9F, 0x12CEB96D, 0x257E1D83] as $m) $st = edge_mul32(edge_rol16($st), $m);
    $acc += $st;
    $t = (edge_mul32($st, $kb) + $y) & EDGE_U32;
    $t = edge_mul32(edge_rol16($t), 0xA27416F5);
    $t = edge_mul32(edge_rol16($t), 0xD38396FF);
    $st = edge_mul32(edge_rol16(edge_mul32(edge_rol16($t), 0x7C932B89)), 0xBFA49F69);
    $acc = ($acc + $st) & EDGE_U32;
  }
  return [$swapLast ^ $st, $swapAcc ^ $acc];
}
function edge_gec(?int $unix = null): string {
  $ticks = (int)floor((($unix ?? time()) + 11644473600) / 300) * 300 * 10000000;
  $data = $ticks . EDGE_TOKEN;
  $digest = edge_sha_digest($data);
  [$c0, $c1] = edge_cs64($data, $digest);
  return strtoupper(bin2hex(pack('V2', $c0, $c1))) . '-' . strtoupper(bin2hex($digest));
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
