<?php
/* Комікс·Lab — 📭 відмови пошти (Розсилки → «Відмови»).
 *
 * Коли адреси не існує, поштовий сервер одержувача повертає лист-відмову («Undelivered Mail
 * Returned to Sender», статус 5.1.1) у нашу скриньку. Тут ми:
 *   • читаємо такі листи зі скриньки через IMAP — лише читання, нічого не видаляємо й не позначаємо;
 *   • або розбираємо текст відмови, який адміністратор вставив вручну;
 *   • «тверда» відмова (адреси не існує, скриньку вимкнено) → листи цій адресі більше не йдуть (mail_ok = 0);
 *   • показуємо акаунти з відмовами й непідтверджені — видаляє їх лише адміністратор кнопкою з підтвердженням.
 * Підключає api/mail-studio-controller.php. */
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(404); exit; }

function bnc_install(): void {
  $end = is_mysql() ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';
  q("CREATE TABLE IF NOT EXISTS kl_mail_bounces (email VARCHAR(190) NOT NULL PRIMARY KEY, user_id INT NULL, code VARCHAR(16) NOT NULL, reason VARCHAR(255) NOT NULL DEFAULT '', hard INT NOT NULL DEFAULT 1, source VARCHAR(8) NOT NULL DEFAULT 'paste', n INT NOT NULL DEFAULT 1, at INT NOT NULL)$end");
}
// людська причина за кодом статусу (RFC 3463)
function bnc_reason(string $code): array {
  $map = ['5.1.1' => 'адреси не існує', '5.1.10' => 'адреси не існує', '5.1.2' => 'такого поштового домену немає', '5.1.3' => 'адреса з помилкою',
    '5.1.6' => 'скринька переїхала', '5.2.1' => 'скриньку вимкнено', '5.2.2' => 'скринька переповнена', '5.4.1' => 'поштовий сервер не приймає цю адресу', '5.4.4' => 'поштового домену немає'];
  $why = $map[$code] ?? (str_starts_with($code, '5.7') ? 'відхилено правилами одержувача (спам-фільтр)' : (str_starts_with($code, '4.') ? 'тимчасова помилка — пошта ще спробує' : 'постійна помилка доставки'));
  // вимикаємо листи лише тоді, коли проблема в самій адресі, а не в нашій репутації чи тимчасова
  $hard = str_starts_with($code, '5.1.') || in_array($code, ['5.2.1', '5.4.1', '5.4.4'], true);
  return [$why, $hard];
}
/** Розбір відмови (DSN або людського тексту): [email => код статусу]. Свою адресу відправника пропускаємо. */
function bnc_parse(string $text): array {
  $own = strtolower((string)(mail_cfg()['from'] ?? ''));
  $out = [];
  $text = str_replace("\r", '', $text);
  // машинна частина: Final-Recipient / Original-Recipient … Status: 5.1.1 (у межах одного блоку)
  foreach (preg_split('/\n\s*\n/', $text) as $block) {
    if (preg_match('/(?:Final|Original)-Recipient:\s*rfc822;\s*<?([^\s<>;]+@[^\s<>;]+)>?/i', $block, $m) && preg_match('/\bStatus:\s*([245]\.\d{1,3}\.\d{1,3})/i', $block, $s)) {
      $out[strtolower(rtrim($m[1], '.'))] ??= $s[1];
    }
  }
  // людська частина: <x@y>: host … said: 550-5.1.1 … / 550 5.1.1 …
  if (preg_match_all('/<([^\s<>]+@[^\s<>]+)>:\s*(?:host[^\n]*?said:\s*)?(?:[^\n]*\n){0,3}?[^\n]*?\b([45]\d\d)[ -]([245]\.\d{1,3}\.\d{1,3})/i', $text, $mm, PREG_SET_ORDER)) {
    foreach ($mm as $m) $out[strtolower($m[1])] ??= $m[3];
  }
  unset($out[$own]);
  return array_filter($out, fn($code, $email) => (bool)filter_var($email, FILTER_VALIDATE_EMAIL), ARRAY_FILTER_USE_BOTH);
}
/** Записати відмову; тверда — вимкнути листи акаунту. Повертає [чи є акаунт, чи вимкнено листи]. */
function bnc_mark(string $email, string $code, string $source): array {
  bnc_install();
  [$why, $hard] = bnc_reason($code);
  $u = one('SELECT id, mail_ok FROM kl_users WHERE LOWER(email) = ?', [strtolower($email)]);
  $old = one('SELECT n FROM kl_mail_bounces WHERE email = ?', [$email]);
  if ($old) q('UPDATE kl_mail_bounces SET user_id = ?, code = ?, reason = ?, hard = ?, source = ?, n = n + 1, at = ? WHERE email = ?', [$u['id'] ?? null, $code, $why, $hard ? 1 : 0, $source, time(), $email]);
  else q('INSERT INTO kl_mail_bounces (email, user_id, code, reason, hard, source, n, at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)', [$email, $u['id'] ?? null, $code, $why, $hard ? 1 : 0, $source, time()]);
  $off = false;
  if ($u && $hard && (int)$u['mail_ok'] === 1) { q('UPDATE kl_users SET mail_ok = 0 WHERE id = ?', [$u['id']]); $off = true; }
  return [(bool)$u, $off];
}
function bnc_from_text(string $text, string $source = 'paste'): array {
  $res = ['found' => 0, 'off' => 0, 'emails' => []];
  foreach (bnc_parse($text) as $email => $code) {
    [, $off] = bnc_mark($email, $code, $source);
    $res['found']++; $res['off'] += $off ? 1 : 0; $res['emails'][] = $email;
  }
  return $res;
}
/* IMAP: та сама скринька, з якої йдуть листи (imap.<домен>, 993 ssl). Відкриваємо лише для читання,
   тіло беремо з FT_PEEK — листи лишаються непрочитаними, нічого не видаляється. */
function bnc_imap_scan(int $days = 60): array {
  if (!function_exists('imap_open')) throw new InvalidArgumentException('На сервері немає розширення PHP IMAP — вставте текст відмови вручну.');
  $m = mail_cfg();
  if ($m['user'] === '' || $m['pass'] === '') throw new InvalidArgumentException('Пошту не налаштовано (mail → user / pass в api/config.php).');
  $host = (string)(cfg('mail.imap_host') ?: preg_replace('/^smtp\./i', 'imap.', $m['host']));
  $port = (int)(cfg('mail.imap_port') ?: 993);
  $box = @imap_open('{' . $host . ':' . $port . '/imap/ssl/readonly}INBOX', $m['user'], $m['pass'], OP_READONLY, 1);
  if (!$box) { $e = imap_last_error() ?: 'невідома помилка'; imap_errors(); imap_alerts(); throw new InvalidArgumentException('Не вдалося відкрити скриньку ' . $host . ': ' . mb_cut(err_clean($e, 160), 160)); }
  $since = date('j-M-Y', strtotime('-' . $days . ' days'));
  $ids = [];
  foreach (['FROM "mailer-daemon"', 'FROM "postmaster"', 'SUBJECT "Undeliver"', 'SUBJECT "Delivery Status"', 'SUBJECT "failure notice"', 'SUBJECT "Returned mail"', 'SUBJECT "Mail delivery failed"'] as $crit) {
    foreach ((array)(@imap_search($box, 'SINCE "' . $since . '" ' . $crit, SE_UID) ?: []) as $uid) $ids[$uid] = true;
  }
  $ids = array_slice(array_keys($ids), -200);
  $res = ['scanned' => count($ids), 'found' => 0, 'off' => 0, 'emails' => []];
  foreach ($ids as $uid) {
    $body = (string)@imap_body($box, $uid, FT_UID | FT_PEEK);
    if (strlen($body) > 300000) $body = substr($body, 0, 300000);
    // частини листа можуть бути в base64 / quoted-printable — розгортаємо, щоб знайти статус
    if (!preg_match('/Status:\s*5\./i', $body)) {
      if (preg_match_all('/\n\n([A-Za-z0-9+\/=\r\n]{200,})/', $body, $b64)) foreach ($b64[1] as $chunk) $body .= "\n" . base64_decode(preg_replace('/\s+/', '', $chunk), false);
      $body .= "\n" . quoted_printable_decode($body);
    }
    $r = bnc_from_text($body, 'imap');
    $res['found'] += $r['found']; $res['off'] += $r['off']; $res['emails'] = array_merge($res['emails'], $r['emails']);
  }
  @imap_close($box);
  imap_errors(); imap_alerts();
  $res['emails'] = array_values(array_unique($res['emails']));
  return $res;
}

/** Відмови з акаунтами: хто, коли входив, чи можна безпечно видалити (ні разу не входив). */
function bnc_list(): array {
  bnc_install();
  return q('SELECT b.*, u.id AS uid, u.name, u.lang, u.created_at, u.last_login, u.verified_at, u.mail_ok, u.is_admin, u.is_moderator, u.is_demo
    FROM kl_mail_bounces b LEFT JOIN kl_users u ON LOWER(u.email) = b.email ORDER BY b.at DESC LIMIT 300')->fetchAll();
}
/** Хто з команди чи зі списку тестувальників — того масові дії не чіпають. */
function bnc_protected(array $u): bool {
  if (!empty($u['is_admin']) || !empty($u['is_moderator']) || !empty($u['is_demo'])) return true;
  try { return (bool)one('SELECT 1 FROM kl_testers WHERE email = ?', [strtolower((string)$u['email'])]); } catch (Throwable $e) { return false; }
}
/** Непідтверджені акаунти: старші $days днів і жодного разу не входили — кандидати на видалення. */
function bnc_unverified(int $days = 3): array {
  return q('SELECT id, name, email, lang, created_at, last_login, is_admin, is_moderator, is_demo FROM kl_users WHERE verified_at IS NULL ORDER BY created_at DESC LIMIT 500')->fetchAll();
}
function bnc_can_purge(array $u, int $days = 3): bool {
  return empty($u['last_login']) && (int)$u['created_at'] < time() - $days * 86400 && !bnc_protected($u);
}
/** Видалити акаунти за списком id — лише тих, хто проходить перевірку $ok. Повертає кількість. */
function bnc_delete_users(array $ids, callable $ok): int {
  $n = 0;
  foreach (array_unique(array_map('intval', $ids)) as $id) {
    $u = one('SELECT * FROM kl_users WHERE id = ?', [$id]);
    if (!$u || !$ok($u)) continue;
    delete_user_all($u);
    $n++;
  }
  return $n;
}
