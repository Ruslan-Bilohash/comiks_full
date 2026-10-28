<?php
/* Сховище секретів: AES-256-GCM, ключ окремим файлом поза базою.
 *   php tools/test-secret-box.php
 * Перевіряємо саме те, що обіцяємо власникові: копія бази без ключа секрет не
 * відкриває, підмінений чи пересаджений в інше поле шифротекст не читається. */
declare(strict_types=1);
define('KOMIKS_API', 1);
function check(bool $ok, string $message): void { if (!$ok) throw new RuntimeException($message); echo "PASS $message\n"; }
function fails(callable $fn, string $label): void { try { $fn(); } catch (Throwable $e) { check(true, $label); return; } throw new RuntimeException($label); }

$dir = sys_get_temp_dir() . '/kl-secrets-test-' . bin2hex(random_bytes(4));
$GLOBALS['KL_TEST_CFG'] = ['secrets_dir' => $dir];
function cfg(?string $key = null) { return $GLOBALS['KL_TEST_CFG'][$key] ?? null; }

$file = __DIR__ . '/../api/secret-box.php';
check(is_file($file), 'secret box module exists');
require $file;

$sealed = secret_seal('GOCSPX-very-secret-value', 'google.client_secret');
check(str_starts_with($sealed, 'v1:'), 'sealed value is versioned');
check(!str_contains($sealed, 'very-secret'), 'sealed value does not contain the plaintext');
check(secret_open($sealed, 'google.client_secret') === 'GOCSPX-very-secret-value', 'round trip returns the original');
check(secret_seal('same', 'a') !== secret_seal('same', 'a'), 'every seal uses a fresh nonce');

fails(fn() => secret_open($sealed, 'stripe.secret'), 'ciphertext moved to another field is rejected');
$raw = base64_decode(substr($sealed, 3));
$raw[strlen($raw) - 1] = chr(ord($raw[strlen($raw) - 1]) ^ 1);
fails(fn() => secret_open('v1:' . base64_encode($raw), 'google.client_secret'), 'tampered ciphertext is rejected');
fails(fn() => secret_open('v0:abc', 'google.client_secret'), 'unknown format is rejected');

$keyFile = secret_key_path();
check(is_file($keyFile) && strlen((string)file_get_contents($keyFile)) === 32, 'key is a separate 32-byte file');
check(str_starts_with(realpath($keyFile), realpath($dir)), 'key lives in the configured secrets directory');
$before = file_get_contents($keyFile);
secret_seal('again', 'x');
check(file_get_contents($keyFile) === $before, 'existing key is never regenerated');

/* Без ключа — тобто з самою лише копією бази — секрет не відкрити. */
unlink($keyFile);
@rmdir($dir);
$GLOBALS['KL_TEST_CFG']['secrets_dir'] = $dir . '-other';
secret_key_reset_cache();
fails(fn() => secret_open($sealed, 'google.client_secret'), 'database copy without the key cannot decrypt');

/* На бойовому сервері ключ не може лежати там, звідки його віддасть вебсервер. */
check(secret_dir_is_public('/home/u1/domains/site.com/public_html/comiks/api/data/secrets', '/home/u1/domains/site.com/public_html'), 'directory inside document root is detected');
check(!secret_dir_is_public('/home/u1/.komiks-secrets', '/home/u1/domains/site.com/public_html'), 'home directory is outside document root');
check(secret_default_dir('/home/u1/domains/site.com/public_html/comiks/api') === '/home/u1/.komiks-secrets', 'Hostinger layout defaults to the home directory');

foreach ([$dir, $dir . '-other'] as $d) { foreach (glob($d . '/*') ?: [] as $f) @unlink($f); @rmdir($d); }
echo "ALL SECRET BOX TESTS PASSED\n";
