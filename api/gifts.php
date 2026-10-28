<?php
/* Комікс·Lab — 🎁 безкоштовні подарунки друзям.
 * Подарунок — річ для аватара, яку не можна ні купити, ні виграти: лише отримати від друга.
 *
 * GET  gifts.php?action=inbox           → { ok, gifts: [{ id, item, note, at, from: { name, code, avatar } }], sent: [коди, кому вже дарував за добу], left }
 * POST { action: "send", code, item, note } → { ok, left }   item — «слот:id» з GIFT_ITEMS, note — номер готової фрази
 * POST { action: "open", id }           → { ok, item }
 * Правила: лише підтверджені акаунти; отримувач має мене в друзях; одному другові — раз на добу; 10 подарунків на добу.
 * Тексту від людей немає (лише готові фрази) — тож і модерувати нічого.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

const GIFT_ITEMS = ['fx:hearts', 'fx:confetti', 'fx:flowers', 'hat:heartband', 'hat:giftbow', 'neck:bff', 'color:candy'];
const GIFT_NOTES = 6;          // скільки готових фраз у клієнті (assets/gifts.js, NOTES)
const GIFT_PER_DAY = 10;
const GIFT_PAIR_GAP = 20 * 3600;

if (meta_get('gifts_v') !== '1') {
  $my = is_mysql();
  $pk = $my ? 'INT UNSIGNED AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  $uid = $my ? 'INT UNSIGNED' : 'INTEGER';
  $eng = $my ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';
  try {
    q("CREATE TABLE IF NOT EXISTS kl_gifts (id $pk, from_id $uid NOT NULL, to_id $uid NOT NULL, item VARCHAR(32) NOT NULL, note TINYINT NOT NULL DEFAULT 0, created_at INT NOT NULL, opened_at INT NULL)$eng");
    try { q('CREATE INDEX kl_gifts_to ON kl_gifts (to_id, opened_at)'); } catch (Throwable $e) { /* вже є */ }
    try { q('CREATE INDEX kl_gifts_from ON kl_gifts (from_id, created_at)'); } catch (Throwable $e) { /* вже є */ }
    meta_set('gifts_v', '1');
  } catch (Throwable $e) { fail('server', 500); }
}

function gift_user_by_code(string $code): ?array {
  $code = strtoupper($code);
  if (!preg_match('/^[A-HJ-NP-Z2-9]{6}$/', $code)) return null;
  return one('SELECT * FROM kl_users WHERE friend_code = ? AND blocked_at IS NULL', [$code]);
}
function gift_is_friend(int $ownerId, string $code): bool {
  $r = one("SELECT v FROM kl_user_data WHERE user_id = ? AND k = 'friends'", [$ownerId]);
  foreach ((array)($r ? json_decode((string)$r['v'], true) : []) as $f) if (is_array($f) && ($f['code'] ?? '') === $code && ($f['status'] ?? '') === 'friend') return true;
  return false;
}
function gift_avatar(int $id): string {
  $r = one("SELECT v FROM kl_user_data WHERE user_id = ? AND k = 'avatar'", [$id]);
  $v = $r ? json_decode((string)$r['v'], true) : null;
  return is_string($v) && strlen($v) < 80 ? $v : '🙂';
}
function gift_blocked(int $a, int $b): bool {
  try { return (bool)one('SELECT 1 AS x FROM kl_blocks WHERE (user_id = ? AND blocked_id = ?) OR (user_id = ? AND blocked_id = ?)', [$a, $b, $b, $a]); }
  catch (Throwable $e) { return false; }
}
function gift_sent_today(int $meId): array {
  return q('SELECT u.friend_code AS code FROM kl_gifts g JOIN kl_users u ON u.id = g.to_id WHERE g.from_id = ? AND g.created_at > ?', [$meId, time() - GIFT_PAIR_GAP])->fetchAll(PDO::FETCH_COLUMN);
}

$me = require_user();
$meId = (int)$me['id'];

if (method() === 'GET') {
  if ((string)($_GET['action'] ?? '') !== 'inbox') fail('action');
  $rows = q('SELECT g.*, u.name, u.friend_code FROM kl_gifts g JOIN kl_users u ON u.id = g.from_id WHERE g.to_id = ? AND g.opened_at IS NULL ORDER BY g.id LIMIT 20', [$meId])->fetchAll();
  $sent = gift_sent_today($meId);
  out(['ok' => true, 'left' => max(0, GIFT_PER_DAY - count($sent)), 'sent' => $sent,
    'gifts' => array_map(fn($g) => ['id' => (int)$g['id'], 'item' => $g['item'], 'note' => (int)$g['note'], 'at' => gmdate('c', (int)$g['created_at']),
      'from' => ['name' => $g['name'], 'code' => $g['friend_code'], 'avatar' => gift_avatar((int)$g['from_id'])]], $rows)]);
}

if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input();
$action = (string)($in['action'] ?? '');

if ($action === 'send') {
  if (!empty($me['is_demo'])) fail('demo', 403);
  if (empty($me['verified_at'])) fail('unverified', 403);
  if (active_ban($meId, ip_hash())) fail('banned', 403);
  $item = (string)($in['item'] ?? '');
  if (!in_array($item, GIFT_ITEMS, true)) fail('item');
  $note = max(0, min(GIFT_NOTES - 1, (int)($in['note'] ?? 0)));
  $to = gift_user_by_code((string)($in['code'] ?? ''));
  if (!$to) fail('not_found', 404);
  if ((int)$to['id'] === $meId) fail('self');
  if (gift_blocked($meId, (int)$to['id'])) fail('blocked', 403);
  // отримувач має вважати мене другом — інакше подарунок від незнайомця
  if (!gift_is_friend((int)$to['id'], (string)$me['friend_code'])) fail('not_friend', 403);
  $sent = gift_sent_today($meId);
  if (in_array($to['friend_code'], $sent, true)) fail('today', 429);
  if (count($sent) >= GIFT_PER_DAY) fail('limit', 429);
  rate_or_fail('gift:' . $meId, 30, 86400);
  q('INSERT INTO kl_gifts (from_id, to_id, item, note, created_at) VALUES (?, ?, ?, ?, ?)', [$meId, (int)$to['id'], $item, $note, time()]);
  out(['ok' => true, 'left' => max(0, GIFT_PER_DAY - count($sent) - 1)]);
}

if ($action === 'open') {
  $g = one('SELECT * FROM kl_gifts WHERE id = ? AND to_id = ?', [(int)($in['id'] ?? 0), $meId]);
  if (!$g) fail('not_found', 404);
  if (empty($g['opened_at'])) q('UPDATE kl_gifts SET opened_at = ? WHERE id = ?', [time(), (int)$g['id']]);
  out(['ok' => true, 'item' => $g['item']]);
}

fail('action');
