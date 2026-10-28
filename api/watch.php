<?php
/* Комікс·Lab — 👨‍👩‍👧 батьки й вчителі бачать прогрес учня (бета).
 *
 * Доступ дає лише сам учень: у кабінеті він створює одноразовий код (6 знаків, діє 24 години),
 * батьки чи вчитель вводять його у себе — і з’являється зв’язок «спостерігач → учень».
 * Учень бачить, хто має доступ, і будь-коли його прибирає. Спостерігач отримує ЛИШЕ навчальні
 * дані (тести, дні, слова, помилки, активний час) — без повідомлень, друзів чи пошти учня.
 *
 * GET  ?action=mine        — учень: хто має доступ
 * GET  ?action=learners    — спостерігач: мої учні з підсумком
 * GET  ?action=learner&id= — спостерігач: навчальні дані одного учня (для дашборда)
 * POST {action:'code'}     — учень: новий код
 * POST {action:'revoke', id}   — учень: прибрати спостерігача (або спостерігач — учня)
 * POST {action:'link', code, role, label} — спостерігач: додати учня за кодом
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

const WATCH_KEYS = ['quizlog', 'days', 'cards', 'errlog', 'errFixed', 'wordsKnown', 'wordsKnownEn', 'usageSec', 'progress', 'stats'];
const WATCH_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function watch_install(): void {
  if (meta_get('watch_v') === '1') return;
  $my = is_mysql();
  $pk = $my ? 'INT NOT NULL AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  $end = $my ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';
  q("CREATE TABLE IF NOT EXISTS kl_watch (id $pk, observer_id INT NOT NULL, learner_id INT NOT NULL, role VARCHAR(10) NOT NULL DEFAULT 'parent', label VARCHAR(40) NOT NULL DEFAULT '', created_at INT NOT NULL, UNIQUE (observer_id, learner_id))$end");
  q("CREATE TABLE IF NOT EXISTS kl_watch_codes (code_hash CHAR(64) NOT NULL PRIMARY KEY, learner_id INT NOT NULL, expires_at INT NOT NULL)$end");
  meta_set('watch_v', '1');
}
function watch_data(int $uid): array {
  $out = [];
  $ph = implode(',', array_fill(0, count(WATCH_KEYS), '?'));
  foreach (q("SELECT k, v FROM kl_user_data WHERE user_id = ? AND k IN ($ph)", array_merge([$uid], WATCH_KEYS))->fetchAll() as $r) $out[$r['k']] = json_decode((string)$r['v'], true);
  return $out;
}
/** Короткий підсумок для списку учнів. */
function watch_summary(int $uid): array {
  $d = watch_data($uid);
  $days = array_values(array_unique(array_filter((array)($d['days'] ?? []), 'is_string'))); sort($days);
  $set = array_flip($days); $streak = 0; $x = isset($set[date('Y-m-d')]) ? date('Y-m-d') : date('Y-m-d', strtotime('-1 day'));
  while (isset($set[$x])) { $streak++; $x = date('Y-m-d', strtotime($x . ' -1 day')); }
  $log = array_filter((array)($d['quizlog'] ?? []), 'is_array');
  $since7 = time() - 7 * 86400; $since30 = time() - 30 * 86400;
  $t7 = 0; $sc = 0; $tot = 0; $secs = [];
  foreach ($log as $q) {
    $t = strtotime((string)($q['date'] ?? '')) ?: 0;
    if ($t >= $since7) $t7++;
    if ($t >= $since30) { $sc += (int)($q['score'] ?? 0); $tot += (int)($q['total'] ?? 0); if (!empty($q['sec'])) $secs[] = (int)$q['sec']; }
  }
  $errs = (array)($d['errlog'] ?? []);
  $due = count(array_filter($errs, fn($e) => is_array($e) && (int)($e['due'] ?? 0) <= time() * 1000));
  $cards = array_filter((array)($d['cards'] ?? []), 'is_array');
  $known = max(count((array)($d['wordsKnown'] ?? [])) + count((array)($d['wordsKnownEn'] ?? [])), count(array_filter($cards, fn($c) => !empty($c['known']))));
  $gram = array_filter($log, fn($q) => str_starts_with((string)($q['key'] ?? ''), 'grammar') && (strtotime((string)($q['date'] ?? '')) ?: 0) >= $since30);
  $gs = array_sum(array_map(fn($q) => (int)($q['score'] ?? 0), $gram)); $gt = array_sum(array_map(fn($q) => (int)($q['total'] ?? 0), $gram));
  $seen = (int)(one('SELECT MAX(last_seen) AS t FROM kl_sessions WHERE user_id = ?', [$uid])['t'] ?? 0);
  $upd = (int)(one('SELECT MAX(updated_at) AS t FROM kl_user_data WHERE user_id = ?', [$uid])['t'] ?? 0);
  return ['days' => count($days), 'streak' => $streak, 'tests7' => $t7, 'tests' => count($log), 'acc30' => $tot ? (int)round($sc / $tot * 100) : null,
    'sec' => $secs ? (int)round(array_sum($secs) / count($secs)) : null, 'known' => $known, 'errs' => count($errs), 'due' => $due,
    'fixed' => count((array)($d['errFixed'] ?? [])), 'gram' => $gt ? (int)round($gs / $gt * 100) : null, 'usage' => (int)($d['usageSec'] ?? 0), 'last' => max($seen, $upd)];
}

watch_install();
$me = require_user();
$meId = (int)$me['id'];
if (!empty($me['is_demo'])) fail('demo', 403);

if (method() === 'GET') {
  $action = (string)($_GET['action'] ?? '');
  if ($action === 'mine') {
    $rows = q('SELECT w.id, w.role, w.created_at, u.name FROM kl_watch w JOIN kl_users u ON u.id = w.observer_id WHERE w.learner_id = ? ORDER BY w.id', [$meId])->fetchAll();
    out(['ok' => true, 'observers' => array_map(fn($r) => ['id' => (int)$r['id'], 'name' => (string)$r['name'], 'role' => (string)$r['role'], 'at' => (int)$r['created_at']], $rows)]);
  }
  if ($action === 'learners') {
    $rows = q('SELECT w.id, w.learner_id, w.role, w.label, w.created_at, u.name, u.lang FROM kl_watch w JOIN kl_users u ON u.id = w.learner_id WHERE w.observer_id = ? ORDER BY w.label, u.name', [$meId])->fetchAll();
    out(['ok' => true, 'learners' => array_map(fn($r) => ['link' => (int)$r['id'], 'id' => (int)$r['learner_id'], 'name' => (string)$r['name'], 'label' => (string)$r['label'], 'role' => (string)$r['role'], 'sum' => watch_summary((int)$r['learner_id'])], $rows)]);
  }
  if ($action === 'learner') {
    $lid = (int)($_GET['id'] ?? 0);
    $row = one('SELECT w.label, u.name FROM kl_watch w JOIN kl_users u ON u.id = w.learner_id WHERE w.observer_id = ? AND w.learner_id = ?', [$meId, $lid]);
    if (!$row) fail('forbidden', 403);
    out(['ok' => true, 'name' => (string)$row['name'], 'label' => (string)$row['label'], 'data' => watch_data($lid), 'sum' => watch_summary($lid)]);
  }
  fail('action', 404);
}

if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input();
$action = (string)($in['action'] ?? '');

if ($action === 'code') {
  rate_or_fail('watch-code:' . $meId, 10, 3600);
  q('DELETE FROM kl_watch_codes WHERE learner_id = ? OR expires_at < ?', [$meId, time()]);
  $code = '';
  for ($i = 0; $i < 6; $i++) $code .= WATCH_CODE_CHARS[random_int(0, strlen(WATCH_CODE_CHARS) - 1)];
  q('INSERT INTO kl_watch_codes (code_hash, learner_id, expires_at) VALUES (?, ?, ?)', [sha('watch:' . $code), $meId, time() + 86400]);
  out(['ok' => true, 'code' => $code, 'expires' => time() + 86400]);
}
if ($action === 'link') {
  rate_or_fail('watch-link:' . ip_hash(), 12, 3600);
  $code = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', (string)($in['code'] ?? '')));
  if (strlen($code) !== 6) fail('code');
  $row = one('SELECT learner_id FROM kl_watch_codes WHERE code_hash = ? AND expires_at > ?', [sha('watch:' . $code), time()]);
  if (!$row) fail('code');
  $lid = (int)$row['learner_id'];
  if ($lid === $meId) fail('self');
  $role = in_array($in['role'] ?? '', ['parent', 'teacher'], true) ? (string)$in['role'] : 'parent';
  $label = clean_text((string)($in['label'] ?? ''), 40);
  try { q('INSERT INTO kl_watch (observer_id, learner_id, role, label, created_at) VALUES (?, ?, ?, ?, ?)', [$meId, $lid, $role, $label, time()]); }
  catch (Throwable $e) { q('UPDATE kl_watch SET role = ?, label = ? WHERE observer_id = ? AND learner_id = ?', [$role, $label, $meId, $lid]); }
  q('DELETE FROM kl_watch_codes WHERE code_hash = ?', [sha('watch:' . $code)]);   // код одноразовий
  $u = one('SELECT name FROM kl_users WHERE id = ?', [$lid]);
  out(['ok' => true, 'id' => $lid, 'name' => (string)($u['name'] ?? '')]);
}
if ($action === 'revoke') {
  // учень прибирає спостерігача або спостерігач — учня зі свого списку
  $id = (int)($in['id'] ?? 0);
  q('DELETE FROM kl_watch WHERE id = ? AND (learner_id = ? OR observer_id = ?)', [$id, $meId, $meId]);
  out(['ok' => true]);
}
fail('action', 404);
