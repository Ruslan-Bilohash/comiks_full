<?php
/* Security regression test for the administrator's login-IP history. */
declare(strict_types=1);
define('KOMIKS_API', 1);

function load_functions(string $path, array $wanted): void {
  $tokens = token_get_all((string)file_get_contents($path));
  for ($i = 0; $i < count($tokens); $i++) {
    if (!is_array($tokens[$i]) || $tokens[$i][0] !== T_FUNCTION) continue;
    $j = $i + 1; while (is_array($tokens[$j]) && $tokens[$j][0] === T_WHITESPACE) $j++;
    if (!is_array($tokens[$j]) || !in_array($tokens[$j][1], $wanted, true)) continue;
    $src = ''; $depth = 0; $started = false;
    for (; $i < count($tokens); $i++) { $t = $tokens[$i]; $s = is_array($t) ? $t[1] : $t; $src .= $s;
      if ($s === '{') { $depth++; $started = true; } elseif ($s === '}') { $depth--; if ($started && $depth === 0) break; }
    }
    eval($src);
  }
}
function check(bool $ok, string $message): void { if (!$ok) throw new RuntimeException($message); echo "PASS $message\n"; }
final class Rows {
  public function __construct(private array $rows = [], private int $affected = 0) {}
  public function fetch(): array|false { return array_shift($this->rows) ?: false; }
  public function fetchAll(): array { return $this->rows; }
  public function rowCount(): int { return $this->affected; }
}
$GLOBALS['LOGIN_ROWS'] = [];
function q(string $sql, array $args = []): Rows {
  if (str_starts_with($sql, 'INSERT INTO kl_login_history')) {
    $GLOBALS['LOGIN_ROWS'][] = ['id' => count($GLOBALS['LOGIN_ROWS']) + 1, 'user_id' => (int)$args[0], 'ip_enc' => $args[1], 'ip_hash' => $args[2], 'method' => $args[3], 'ua' => $args[4], 'created_at' => (int)$args[5]];
    return new Rows([], 1);
  }
  if (str_starts_with($sql, 'DELETE FROM kl_login_history WHERE created_at <')) {
    $before = count($GLOBALS['LOGIN_ROWS']);
    $GLOBALS['LOGIN_ROWS'] = array_values(array_filter($GLOBALS['LOGIN_ROWS'], fn($r) => $r['created_at'] >= (int)$args[0]));
    return new Rows([], $before - count($GLOBALS['LOGIN_ROWS']));
  }
  if (!str_starts_with($sql, 'SELECT COUNT(*)') && str_starts_with($sql, 'SELECT ') && str_contains($sql, ' FROM kl_login_history')) {
    $rows = array_values(array_filter($GLOBALS['LOGIN_ROWS'], fn($r) => $r['user_id'] === (int)$args[0]));
    usort($rows, fn($a, $b) => $b['created_at'] <=> $a['created_at']);
    return new Rows(array_slice($rows, 0, (int)($args[1] ?? 20)));
  }
  if (str_starts_with($sql, 'SELECT COUNT(*)')) return new Rows([['n' => count(array_filter($GLOBALS['LOGIN_ROWS'], fn($r) => $r['user_id'] === (int)$args[0]))]]);
  throw new RuntimeException('Unexpected SQL: ' . $sql);
}
function one(string $sql, array $args = []): ?array { $r = q($sql, $args)->fetch(); return $r ?: null; }

function cfg(?string $key = null) { return $key === 'secret' ? 'test-secret' : null; }
function secret_seal(string $plain, string $field): string { return 'test:' . base64_encode($field . "\0" . $plain); }
function secret_open(string $sealed, string $field): string {
  $raw = base64_decode(substr($sealed, 5), true);
  if ($raw === false || !str_starts_with($raw, $field . "\0")) throw new RuntimeException('bad sealed fixture');
  return substr($raw, strlen($field) + 1);
}

load_functions(__DIR__ . '/../api/lib.php', [
  'login_client_ip', 'login_method', 'login_history_record', 'login_history_for_user'
]);
q('INSERT INTO kl_login_history (user_id,ip_enc,ip_hash,method,ua,created_at) VALUES (1,?,?,?,?,?)', [
  1, secret_seal('192.0.2.1', 'login-ip:1'), hash_hmac('sha256', '192.0.2.1', 'test-secret'), 'password', 'old', time() - 31 * 86400
]);

$_SERVER['REMOTE_ADDR'] = '203.0.113.42';
$_SERVER['HTTP_X_FORWARDED_FOR'] = '198.51.100.99';
$_SERVER['HTTP_USER_AGENT'] = 'Mozilla/5.0 Test Browser';
check(login_client_ip() === '203.0.113.42', 'login history trusts the server address, not a forwarded header');
check(login_method('Google OAuth') === 'google', 'login method is normalized to the allow-list');
check(login_method('invented') === 'account', 'unknown login method uses a safe label');
login_history_record(1, 'google');

$stored = one('SELECT * FROM kl_login_history WHERE user_id = ?', [1]);
check($stored !== null, 'successful login creates a history row');
check(!str_contains((string)$stored['ip_enc'], '203.0.113.42'), 'database never contains the IP in plaintext');
check((string)$stored['method'] === 'google', 'sign-in method is stored');
check((string)$stored['ua'] === 'Mozilla/5.0 Test Browser', 'device user agent is stored for the security view');
check((int)one('SELECT COUNT(*) n FROM kl_login_history WHERE user_id = ?', [1])['n'] === 1, 'rows older than 30 days are pruned');

$rows = login_history_for_user(1, 20);
check(count($rows) === 1 && $rows[0]['ip'] === '203.0.113.42', 'admin helper decrypts the recent IP');
check($rows[0]['method'] === 'google', 'admin helper returns the login method');

$_SERVER['REMOTE_ADDR'] = 'not-an-ip';
login_history_record(1, 'password');
check((int)one('SELECT COUNT(*) n FROM kl_login_history WHERE user_id = ?', [1])['n'] === 1, 'invalid server address is not recorded');

$lib = (string)file_get_contents(__DIR__ . '/../api/lib.php');
$admin = (string)file_get_contents(__DIR__ . '/../admin.php');
$privacy = (string)file_get_contents(__DIR__ . '/../privacy.html');
check(str_contains($lib, 'CREATE TABLE IF NOT EXISTS kl_login_history'), 'database migration creates login history');
check(str_contains($lib, 'login_history_record($userId, $method)'), 'session creation records the successful login');
check(str_contains($lib, "'kl_login_history'"), 'account deletion includes login history');
check(str_contains($admin, 'Історія входів') && str_contains($admin, 'login_history_for_user'), 'admin user profile renders login history');
check(str_contains($privacy, '30 днів') && str_contains($privacy, 'IP-адрес'), 'privacy policy discloses login IP retention');
echo "ALL LOGIN HISTORY TESTS PASSED\n";

