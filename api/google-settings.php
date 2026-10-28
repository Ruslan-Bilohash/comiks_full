<?php
/* Комікс·Lab — ⚙️ налаштування входу через Google, які адмін вводить у «Системі».
 *
 * Життя ключів — три стани, і з першого в третій не перестрибнути:
 *   draft    — ключі збережено, але Google їх ще не підтвердив;
 *   verified — адмін пройшов справжній вхід Google цими самими ключами
 *              (callback обміняв код на токен і отримав профіль);
 *   enabled  — вхід увімкнено для всіх.
 * Будь-яка зміна Client ID чи секрету повертає в draft і вимикає вхід: стара
 * перевірка нових ключів не покриває.
 *
 * Що саме перевірено, тримаємо як відбиток (fp) — HMAC від пари «ID + секрет»
 * на ключі зі сховища секретів. Сам відбиток нічого не розкриває, а з копії
 * бази без ключа за ним навіть не перебрати варіанти.
 *
 * Секрет зберігає api/secret-box.php (AES-256-GCM, ключ поза сайтом). Назад на
 * сторінку він не віддається ніколи — лише «збережено».
 *
 * Без рядка в базі працює старий шлях: блок 'google' у config.php.
 */
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(404); exit; }

function google_settings_install(): void {
  $my = db()->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql';
  $end = $my ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin' : '';
  q("CREATE TABLE IF NOT EXISTS kl_google_config (id INT PRIMARY KEY, client_id VARCHAR(200) NOT NULL DEFAULT '', secret_enc TEXT NULL,"
    . " status VARCHAR(10) NOT NULL DEFAULT 'draft', fp CHAR(64) NULL, verified_fp CHAR(64) NULL, verified_at INT NULL,"
    . ' enabled_at INT NULL, updated_at INT NOT NULL, updated_by INT NULL)' . $end);
}

function google_valid_client_id(string $id): bool {
  return strlen($id) <= 200 && preg_match('/^[0-9]{6,30}-[a-z0-9]{8,80}\.apps\.googleusercontent\.com$/', $id) === 1;
}
/** Секрет Google — друкований ASCII без пробілів. Переноси рядка тут — це майже
 *  завжди зайвий шматок, скопійований разом із секретом. */
function google_valid_secret(string $s): bool {
  return strlen($s) >= 10 && strlen($s) <= 200 && preg_match('/^[\x21-\x7e]+$/', $s) === 1;
}
function google_fp(string $clientId, string $secret): string {
  return hash_hmac('sha256', "google\n" . $clientId . "\n" . $secret, secret_key(true));
}

function google_settings_row(): ?array {
  try { return one('SELECT * FROM kl_google_config WHERE id = 1'); } catch (Throwable $e) { return null; }
}

/** Те, що можна показати на сторінці: ні секрету, ні його шматків. */
function google_settings_public(): array {
  $r = google_settings_row();
  return [
    'exists' => (bool)$r,
    'client_id' => $r ? (string)$r['client_id'] : '',
    'has_secret' => $r && (string)$r['secret_enc'] !== '',
    'status' => $r ? (string)$r['status'] : 'none',
    'verified_current' => $r && $r['verified_fp'] !== null && hash_equals((string)$r['verified_fp'], (string)$r['fp']),
    'verified_at' => $r ? (int)$r['verified_at'] : 0,
    'enabled_at' => $r ? (int)$r['enabled_at'] : 0,
    'updated_at' => $r ? (int)$r['updated_at'] : 0,
  ];
}

/** Порожній секрет при збереженні означає «лишити той, що є». */
function google_settings_save(int $adminId, string $clientId, string $secret): array {
  $clientId = trim($clientId);
  $secret = trim($secret);
  if (!google_valid_client_id($clientId)) throw new InvalidArgumentException('client_id');
  $row = google_settings_row();
  $oldSecret = '';
  if ($row && (string)$row['secret_enc'] !== '') $oldSecret = secret_open((string)$row['secret_enc'], 'google.client_secret');
  if ($secret === '') {
    if ($oldSecret === '') throw new InvalidArgumentException('secret_required');
    $secret = $oldSecret;
  } elseif (!google_valid_secret($secret)) throw new InvalidArgumentException('secret');

  $fp = google_fp($clientId, $secret);
  if ($row && hash_equals((string)$row['fp'], $fp)) return ['changed' => false];

  $idChanged = !$row || (string)$row['client_id'] !== $clientId;
  $secretChanged = $secret !== $oldSecret;
  $enc = $secretChanged || !$row ? secret_seal($secret, 'google.client_secret') : (string)$row['secret_enc'];
  if ($row) {
    q("UPDATE kl_google_config SET client_id = ?, secret_enc = ?, status = 'draft', fp = ?, verified_fp = NULL, verified_at = NULL,"
      . ' enabled_at = NULL, updated_at = ?, updated_by = ? WHERE id = 1', [$clientId, $enc, $fp, time(), $adminId]);
  } else {
    q("INSERT INTO kl_google_config (id, client_id, secret_enc, status, fp, updated_at, updated_by) VALUES (1, ?, ?, 'draft', ?, ?, ?)",
      [$clientId, $enc, $fp, time(), $adminId]);
  }
  admin_log($adminId, 'google_save', 'Client ID змінено: ' . ($idChanged ? 'так' : 'ні') . '; секрет змінено: ' . ($secretChanged ? 'так' : 'ні')
    . ($row && $row['status'] === 'enabled' ? '; вхід вимкнено до нової перевірки' : ''));
  google_conf_reset();
  return ['changed' => true];
}

/** Ключі для перевірки — незалежно від стану. */
function google_draft(): ?array {
  $r = google_settings_row();
  if (!$r || (string)$r['secret_enc'] === '' || (string)$r['client_id'] === '') return null;
  return ['client_id' => (string)$r['client_id'], 'client_secret' => secret_open((string)$r['secret_enc'], 'google.client_secret'), 'fp' => (string)$r['fp']];
}

/** Після справжнього обміну з Google у callback. Нічого, крім позначки, не робить:
 *  жодного користувача, жодної сесії, жодного привʼязування акаунта. */
function google_verify_finish(array $state, ?array $sessionUser, array $identity): void {
  if (($state['mode'] ?? '') !== 'verify') throw new InvalidArgumentException('google_verify_mode');
  if (!$sessionUser || empty($sessionUser['is_admin']) || !empty($sessionUser['blocked_at'])
    || (int)$sessionUser['id'] !== (int)($state['user_id'] ?? 0)) throw new InvalidArgumentException('google_verify_admin');
  $r = google_settings_row();
  if (!$r || !hash_equals((string)$r['fp'], (string)($state['cfg_fp'] ?? ''))) throw new InvalidArgumentException('google_verify_changed');
  if (empty($identity['sub'])) throw new InvalidArgumentException('google_identity');
  $status = $r['status'] === 'enabled' ? 'enabled' : 'verified';
  q('UPDATE kl_google_config SET status = ?, verified_fp = fp, verified_at = ? WHERE id = 1 AND fp = ?', [$status, time(), $r['fp']]);
  admin_log((int)$sessionUser['id'], 'google_verified', 'ключі підтверджено справжнім входом Google');
  google_conf_reset();
}

function google_set_enabled(int $adminId, bool $on): array {
  $r = google_settings_row();
  if (!$r) return ['ok' => false, 'error' => 'none'];
  $verified = $r['verified_fp'] !== null && hash_equals((string)$r['verified_fp'], (string)$r['fp']);
  if ($on) {
    if (!$verified) return ['ok' => false, 'error' => 'not_verified'];
    q("UPDATE kl_google_config SET status = 'enabled', enabled_at = ? WHERE id = 1", [time()]);
    admin_log($adminId, 'google_enable', 'вхід через Google увімкнено');
  } else {
    q('UPDATE kl_google_config SET status = ?, enabled_at = NULL WHERE id = 1', [$verified ? 'verified' : 'draft']);
    admin_log($adminId, 'google_disable', 'вхід через Google вимкнено');
  }
  google_conf_reset();
  return ['ok' => true];
}

function google_conf_reset(): void { $GLOBALS['__kl_google_conf'] = null; }

/** Діючі налаштування входу. Рядок у базі має перевагу над config.php. */
function google_conf(): array {
  if (!empty($GLOBALS['__kl_google_conf'])) return $GLOBALS['__kl_google_conf'];
  $r = google_settings_row();
  if (!$r) {
    $c = ['source' => 'config', 'enabled' => cfg('google.enabled') === true, 'client_id' => trim((string)cfg('google.client_id')),
      'client_secret' => trim((string)cfg('google.client_secret')), 'error' => ''];
    if ($c['client_id'] === '' && $c['client_secret'] === '') $c['source'] = 'none';
    $c['enabled'] = $c['enabled'] && $c['client_id'] !== '' && $c['client_secret'] !== '';
    return $GLOBALS['__kl_google_conf'] = $c;
  }
  $c = ['source' => 'db', 'enabled' => false, 'client_id' => (string)$r['client_id'], 'client_secret' => '', 'error' => ''];
  try {
    $c['client_secret'] = (string)$r['secret_enc'] !== '' ? secret_open((string)$r['secret_enc'], 'google.client_secret') : '';
  } catch (Throwable $e) {
    /* Ключа немає або його замінили: секрет не відкрити — вхід просто вимкнено. */
    $c['error'] = 'key';
    return $GLOBALS['__kl_google_conf'] = $c;
  }
  $verified = $r['verified_fp'] !== null && hash_equals((string)$r['verified_fp'], (string)$r['fp']);
  $c['enabled'] = $r['status'] === 'enabled' && $verified && $c['client_id'] !== '' && $c['client_secret'] !== '';
  return $GLOBALS['__kl_google_conf'] = $c;
}
