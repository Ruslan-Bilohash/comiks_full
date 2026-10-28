<?php
/* Вхід в адмінку й другий фактор.
 *   php tools/test-admin-totp.php
 * Раніше admin.php запускав сесію адміністратора одразу після пароля — навіть
 * якщо в акаунті ввімкнено автентифікатор. Ці перевірки стережуть саме це. */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/test-auth.php';          // спільна база в памʼяті, check(), load_functions()

const TOTP_STEP = 30; const TOTP_WINDOW = 1; const TOTP_DIGITS = 6;
load_functions(__DIR__ . '/../api/lib.php', ['totp_secret', 'totp_decode', 'totp_code', 'totp_check', 'totp_backup_new',
  'totp_backup_hash', 'totp_backup_take', 'totp_on', 'is_staff']);
function cfg(?string $k = null) { return null; }
function ip_hash(): string { return 'iphash'; }
function limited(string $key, int $max, int $window): bool { return false; }
$GLOBALS['started'] = [];
function start_session(int $id, string $method = 'account'): void { $GLOBALS['started'][] = $id; }

q('DROP TABLE kl_users');
q('CREATE TABLE kl_users (id INTEGER PRIMARY KEY, email TEXT, name TEXT, pass_hash TEXT, is_admin INT DEFAULT 0, is_moderator INT DEFAULT 0, blocked_at INT NULL, totp_secret TEXT NULL, totp_at INT NULL, totp_backup TEXT NULL)');
$pw = password_hash('correct horse battery', PASSWORD_DEFAULT);
$secret = totp_secret();
q('INSERT INTO kl_users (id,email,name,pass_hash,is_admin) VALUES (1,?,?,?,1)', ['plain@x.test', 'Plain', $pw]);
q('INSERT INTO kl_users (id,email,name,pass_hash,is_admin,totp_secret,totp_at,totp_backup) VALUES (2,?,?,?,1,?,?,?)',
  ['guarded@x.test', 'Guarded', $pw, $secret, time(), totp_backup_hash(['AAAA-1111'])]);
q('INSERT INTO kl_users (id,email,name,pass_hash) VALUES (3,?,?,?)', ['user@x.test', 'User', $pw]);

$file = __DIR__ . '/../api/admin-auth.php';
check(is_file($file), 'admin auth module exists');
require $file;
admin_auth_install();

$r = admin_login_password('plain@x.test', 'correct horse battery');
check(!empty($r['ok']) && $GLOBALS['started'] === [1], 'admin without authenticator signs in with password');

$GLOBALS['started'] = [];
$r = admin_login_password('guarded@x.test', 'correct horse battery');
check(!empty($r['need2fa']) && $GLOBALS['started'] === [], 'password alone does NOT start a session when TOTP is on');
check(isset($r['ticket']) && preg_match('/^[a-f0-9]{64}$/', $r['ticket']) === 1, 'second step receives a one-time ticket');

$r2 = admin_login_code($r['ticket'], '000000' === totp_code($secret) ? '111111' : '000000');
check(empty($r2['ok']) && $GLOBALS['started'] === [], 'wrong code does not sign in');
check(isset($r2['ticket']) && $r2['ticket'] !== $r['ticket'], 'wrong code returns a fresh ticket, the old one is spent');
check(empty(admin_login_code($r['ticket'], totp_code($secret))['ok']), 'a spent ticket cannot be reused');

$code = totp_code($secret);
$r3 = admin_login_code($r2['ticket'], $code);
check(!empty($r3['ok']) && $GLOBALS['started'] === [2], 'correct code completes the sign-in');

$GLOBALS['started'] = [];
$t = admin_login_password('guarded@x.test', 'correct horse battery')['ticket'];
check(empty(admin_login_code($t, $code)['ok']) && $GLOBALS['started'] === [], 'the same TOTP code cannot be replayed');

$t = admin_login_password('guarded@x.test', 'correct horse battery')['ticket'];
check(!empty(admin_login_code($t, 'aaaa-1111')['ok']), 'backup code signs in');
$t = admin_login_password('guarded@x.test', 'correct horse battery')['ticket'];
check(empty(admin_login_code($t, 'AAAA-1111')['ok']), 'backup code works only once');

$GLOBALS['started'] = [];
check(!empty(admin_login_password('guarded@x.test', 'wrong')['error']) && $GLOBALS['started'] === [], 'wrong password rejected');
check(!empty(admin_login_password('user@x.test', 'correct horse battery')['error']) && $GLOBALS['started'] === [], 'non-staff account cannot enter admin');
q('UPDATE kl_users SET blocked_at = 1 WHERE id = 1');
check(!empty(admin_login_password('plain@x.test', 'correct horse battery')['error']), 'blocked admin cannot enter');
q('UPDATE kl_users SET blocked_at = NULL WHERE id = 1');

/* Ticket від сайтового входу не годиться для адмінки. */
$siteTicket = new_token(2, '2fa', 600);
check(empty(admin_login_code($siteTicket, totp_code($secret, time() + TOTP_STEP))['ok']), 'site 2FA ticket is not accepted by admin');

/* Повторне підтвердження перед зміною ключів. */
$plain = one('SELECT * FROM kl_users WHERE id = 1');
$guard = one('SELECT * FROM kl_users WHERE id = 2');
check(!admin_reauth($plain, 'wrong', ''), 'reauth: wrong password rejected');
check(admin_reauth($plain, 'correct horse battery', ''), 'reauth: password suffices without authenticator');
check(!admin_reauth($guard, 'correct horse battery', ''), 'reauth: authenticator code required when TOTP is on');
$next = totp_code($secret, time() + TOTP_STEP);
check(admin_reauth($guard, 'correct horse battery', $next), 'reauth: password and fresh code accepted');
check(!admin_reauth(one('SELECT * FROM kl_users WHERE id = 2'), 'correct horse battery', $next), 'reauth: the same code cannot be reused');

/* Журнал без секретів. */
$log = q('SELECT action, detail FROM kl_admin_log')->fetchAll();
check(count($log) > 0, 'admin actions are logged');
$all = json_encode($log);
check(!str_contains($all, 'correct horse') && !str_contains($all, $secret) && !str_contains($all, $code), 'log contains no passwords, secrets or codes');

echo "ALL ADMIN TOTP TESTS PASSED\n";
