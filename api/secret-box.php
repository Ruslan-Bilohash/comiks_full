<?php
/* Комікс·Lab — 🔐 сховище секретів, які адмін вводить у браузері.
 *
 * Навіщо. Ключі Stripe і пошти живуть у config.php, і так і має бути. Але
 * Google Client Secret власник хоче вводити в адмінці, а не по SSH — отже, він
 * опиниться в базі. База має резервні копії: «⬇️ Завантажити .sql» в адмінці,
 * знімки хостингу. Тому в базі лежить лише шифротекст, а ключ — окремим файлом
 * на диску, поза сайтом. Копія бази без цього файла секрет не відкриває.
 *
 * Шифр — AES-256-GCM з OpenSSL (libsodium на хостингу немає). GCM не лише
 * шифрує, а й підписує: підмінений байт або чужий шифротекст не розшифруються.
 * Додатково кожне значення привʼязане до свого поля через AAD — шифротекст
 * Google-секрету, пересаджений у поле іншого ключа, теж не відкриється.
 *
 * Формат: "v1:" + base64(nonce 12 байтів ‖ tag 16 ‖ шифротекст).
 */
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(404); exit; }

const SECRET_KEY_FILE = 'komiks-secret.key';

/** Типова тека ключа. На Hostinger сайт лежить у /home/<u>/domains/<домен>/public_html,
 *  а поряд із public_html хостинг просить нічого не класти — тому беремо домашню
 *  теку, зовсім поза доменом. Локально (без domains/) — api/data/secrets, яку
 *  закриває .htaccess. */
function secret_default_dir(?string $from = null): string {
  $from = str_replace('\\', '/', $from ?? __DIR__);
  $i = strpos($from, '/domains/');
  if ($i !== false) return substr($from, 0, $i) . '/.komiks-secrets';
  return rtrim($from, '/') . '/data/secrets';
}
function secret_dir(): string {
  $d = (string)(cfg('secrets_dir') ?? '');
  return rtrim($d !== '' ? $d : secret_default_dir(), '/\\');
}
/** Чи лежить тека всередині кореня сайту — тобто чи може вебсервер її віддати. */
function secret_dir_is_public(string $dir, string $docRoot): bool {
  $n = fn(string $p) => rtrim(str_replace('\\', '/', $p), '/') . '/';
  return $docRoot !== '' && str_starts_with($n($dir), $n($docRoot));
}
function secret_key_path(): string { return secret_dir() . '/' . SECRET_KEY_FILE; }
function secret_key_reset_cache(): void { $GLOBALS['__kl_secret_key'] = null; }

/** Ключ створюється один раз і більше ніколи не змінюється: новий ключ зробив би
 *  нечитаними всі збережені секрети. */
function secret_key(bool $create = true): string {
  if (!empty($GLOBALS['__kl_secret_key'])) return $GLOBALS['__kl_secret_key'];
  if (!function_exists('openssl_encrypt')) throw new RuntimeException('secret_openssl');
  $path = secret_key_path();
  if (is_file($path)) {
    $key = (string)file_get_contents($path);
    if (strlen($key) !== 32) throw new RuntimeException('secret_key_damaged');
    return $GLOBALS['__kl_secret_key'] = $key;
  }
  if (!$create) throw new RuntimeException('secret_key_missing');
  $dir = secret_dir();
  $root = (string)($_SERVER['DOCUMENT_ROOT'] ?? '');
  if (secret_dir_is_public($dir, $root)) throw new RuntimeException('secret_dir_public');
  if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) throw new RuntimeException('secret_dir_unwritable');
  @chmod($dir, 0700);
  $key = random_bytes(32);
  /* Пишемо через тимчасовий файл і перейменування: обірваний запис не повинен
     лишити напівключ, яким уже зашифрували секрет. */
  $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
  if (@file_put_contents($tmp, $key, LOCK_EX) !== 32) { @unlink($tmp); throw new RuntimeException('secret_dir_unwritable'); }
  @chmod($tmp, 0600);
  if (!@rename($tmp, $path)) { @unlink($tmp); throw new RuntimeException('secret_dir_unwritable'); }
  return $GLOBALS['__kl_secret_key'] = $key;
}

function secret_seal(string $plain, string $field): string {
  $key = secret_key(true);
  $nonce = random_bytes(12);
  $tag = '';
  $ct = openssl_encrypt($plain, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $nonce, $tag, 'komiks|' . $field, 16);
  if ($ct === false || strlen($tag) !== 16) throw new RuntimeException('secret_seal');
  return 'v1:' . base64_encode($nonce . $tag . $ct);
}

function secret_open(string $sealed, string $field): string {
  if (!str_starts_with($sealed, 'v1:')) throw new RuntimeException('secret_format');
  $raw = base64_decode(substr($sealed, 3), true);
  if ($raw === false || strlen($raw) < 28) throw new RuntimeException('secret_format');
  $key = secret_key(false);
  $plain = openssl_decrypt(substr($raw, 28), 'aes-256-gcm', $key, OPENSSL_RAW_DATA, substr($raw, 0, 12), substr($raw, 12, 16), 'komiks|' . $field);
  if ($plain === false) throw new RuntimeException('secret_open');
  return $plain;
}
