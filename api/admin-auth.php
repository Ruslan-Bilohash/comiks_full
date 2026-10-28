<?php
/* Комікс·Lab — 🔐 вхід в адмінку, другий фактор і журнал дій адміністратора.
 *
 * Навіщо окремий файл. Раніше admin.php сам перевіряв пароль і одразу запускав
 * сесію: автентифікатор, увімкнений в акаунті, на цьому шляху не питався
 * зовсім. На сайті (api/auth.php) другий крок був, а в адмінці — ні, хоча саме
 * там лежить усе найцінніше. Тепер обидва кроки тут, і їх перевіряє
 * tools/test-admin-totp.php.
 *
 * Квиток другого кроку має власний тип 'admin2fa': квиток зі звичайного входу
 * на сайті до адмінки не підходить.
 */
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(404); exit; }

function admin_auth_install(): void {
  $my = db()->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql';
  $end = $my ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';
  $id = $my ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  q("CREATE TABLE IF NOT EXISTS kl_admin_log (id $id, at INT NOT NULL, admin_id INT NULL, action VARCHAR(40) NOT NULL, detail VARCHAR(255) NOT NULL DEFAULT '', ip_hash CHAR(64) NOT NULL DEFAULT '')" . $end);
  /* Останній прийнятий крок TOTP: код, який уже спрацював, удруге не пройде. */
  try { q('ALTER TABLE kl_users ADD COLUMN totp_last INT NULL'); } catch (Throwable $e) { /* вже є */ }
}

/** Журнал дій. detail складаємо лише ми самі — туди ніколи не йдуть паролі,
 *  коди, секрети чи токени, тільки факт («секрет змінено: так»). */
function admin_log(?int $adminId, string $action, string $detail = ''): void {
  try {
    q('INSERT INTO kl_admin_log (at, admin_id, action, detail, ip_hash) VALUES (?, ?, ?, ?, ?)',
      [time(), $adminId, substr($action, 0, 40), mb_substr($detail, 0, 255), ip_hash()]);
  } catch (Throwable $e) { /* журнал не повинен ламати вхід */ }
}

/** TOTP без повторів: той самий код (той самий 30-секундний крок) приймаємо один
 *  раз. Запис кроку атомарний — два одночасні запити з одним кодом не пройдуть
 *  обидва. */
function totp_check_once(array $u, string $code): bool {
  $code = preg_replace('/\D+/', '', $code);
  if (!totp_on($u) || strlen($code) !== TOTP_DIGITS) return false;
  $now = intdiv(time(), TOTP_STEP);
  for ($i = -TOTP_WINDOW; $i <= TOTP_WINDOW; $i++) {
    if (!hash_equals(totp_code((string)$u['totp_secret'], null, $i), $code)) continue;
    $step = $now + $i;
    $ok = q('UPDATE kl_users SET totp_last = ? WHERE id = ? AND (totp_last IS NULL OR totp_last < ?)', [$step, $u['id'], $step]);
    return $ok->rowCount() === 1;
  }
  return false;
}

/** Код автентифікатора або резервний код. Резервний згоряє одразу. */
function admin_second_factor(array $u, string $code): bool {
  if (totp_check_once($u, $code)) return true;
  $left = totp_backup_take($u, $code);
  if ($left === null) return false;
  q('UPDATE kl_users SET totp_backup = ? WHERE id = ?', [$left, $u['id']]);
  return true;
}

function admin_may_enter(?array $u): bool { return $u && is_staff($u) && empty($u['blocked_at']); }

/** Крок 1. Сесію запускаємо лише тоді, коли другого фактора немає. */
function admin_login_password(string $email, string $password): array {
  if (limited('admin-login:' . ip_hash(), 10, 900)) return ['error' => 'slow'];
  $email = strtolower(trim($email));
  $u = filter_var($email, FILTER_VALIDATE_EMAIL) ? one('SELECT * FROM kl_users WHERE email = ?', [$email]) : null;
  /* Хеш-підставка вирівнює час відповіді: за ним не вгадати, чи є така пошта. */
  $ok = password_verify($password, $u['pass_hash'] ?? '$2y$10$usesomesillystringfore7hnbRJHxXVLeakoG8K30oukPsA.ztMG');
  if (!$ok || !admin_may_enter($u)) {
    if ($u && is_staff($u)) admin_log((int)$u['id'], 'login_fail', 'пароль');
    return ['error' => 'bad'];
  }
  if (totp_on($u)) return ['need2fa' => true, 'ticket' => new_token((int)$u['id'], 'admin2fa', 600)];
  start_session((int)$u['id'], 'admin');
  admin_log((int)$u['id'], 'login', 'пароль');
  return ['ok' => true, 'user' => $u];
}

/** Крок 2. Невдала спроба видає новий квиток: старий уже згорів у take_token. */
function admin_login_code(string $ticket, string $code): array {
  if (limited('admin-2fa:' . ip_hash(), 20, 900)) return ['error' => 'slow'];
  $t = take_token($ticket, 'admin2fa');
  if (!$t) return ['error' => 'ticket'];
  $u = one('SELECT * FROM kl_users WHERE id = ?', [$t['id']]);
  if (!admin_may_enter($u) || !totp_on($u)) return ['error' => 'bad'];
  if (limited('admin-2fa-user:' . $u['id'], 8, 900)) return ['error' => 'slow'];
  if (!admin_second_factor($u, $code)) {
    admin_log((int)$u['id'], 'login_fail', 'другий фактор');
    return ['error' => 'code', 'ticket' => new_token((int)$u['id'], 'admin2fa', 600)];
  }
  start_session((int)$u['id'], 'admin');
  admin_log((int)$u['id'], 'login', 'пароль + другий фактор');
  return ['ok' => true, 'user' => $u];
}

/** Повторне підтвердження перед небезпечною зміною (ключі Google тощо): пароль,
 *  а якщо ввімкнено автентифікатор — ще й свіжий код. Відкрита вкладка, яку
 *  хтось знайшов на чужому компʼютері, ключів не змінить. */
function admin_reauth(array $me, string $password, string $code): bool {
  if (limited('admin-reauth:' . (int)$me['id'], 10, 900)) return false;
  $u = one('SELECT * FROM kl_users WHERE id = ?', [$me['id']]);
  if (!$u || !password_verify($password, (string)$u['pass_hash'])) return false;
  return !totp_on($u) || admin_second_factor($u, $code);
}
