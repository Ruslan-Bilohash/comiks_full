<?php
/* Комікс·Lab — 🔔 сповіщення між друзями.
 *
 * GET  notify.php?action=feed[&since=<id>]
 *      → { ok, items:[{ id, kind, ref, text, likes, liked, who:{code,name,avatar}, at }], unseen }
 * POST { action:"share", kind:"quiz"|"level", ref, text }   → подію бачать усі твої друзі
 * POST { action:"friend", code }                            → «ми тепер друзі» конкретній людині
 * POST { action:"like", id }                                → вподобати / прибрати вподобайку
 * POST { action:"seen" }                                    → позначити стрічку прочитаною
 *
 * Правила: бачать лише друзі — ті, кого людина сама підтвердила в себе у списку.
 * Тексти обрізаються, посилань у них немає, на кожну дію є ліміт.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

const EV_KINDS = ['quiz', 'level', 'friend', 'like'];
const EV_FEED = 40;

function ev_me(): array {
  $u = current_user();
  if (!$u) fail('auth', 401);
  if (!empty($u['blocked_at'])) fail('blocked', 403);
  return $u;
}
// картка автора події: ім'я й аватар беремо з каталогу гравців, інакше — з акаунта
function ev_who(array $row): array {
  $p = one('SELECT name, avatar FROM kl_players WHERE user_id = ?', [(int)$row['owner_id']]);
  return [
    'code' => (string)($row['friend_code'] ?? ''),
    'name' => (string)($p['name'] ?? $row['owner_name'] ?? ''),
    'avatar' => (string)($p['avatar'] ?? '🙂'),
  ];
}

if (method() === 'GET') {
  if ((string)($_GET['action'] ?? '') !== 'feed') fail('action', 404);
  $me = ev_me();
  $since = max(0, (int)($_GET['since'] ?? 0));
  // сторінки: спершу 10, далі «показати ще» по 30 — старші за before
  $before = max(0, (int)($_GET['before'] ?? 0));
  $limit = isset($_GET['limit']) ? min(50, max(1, (int)$_GET['limit'])) : EV_FEED;
  $rows = q('SELECT e.id, e.owner_id, e.kind, e.ref, e.text, e.likes, e.created_at, t.seen_at,
                    u.friend_code, u.name AS owner_name,
                    (SELECT COUNT(*) FROM kl_event_likes l WHERE l.event_id = e.id AND l.user_id = ?) AS liked
             FROM kl_event_to t
             JOIN kl_events e ON e.id = t.event_id
             JOIN kl_users u ON u.id = e.owner_id
             WHERE t.user_id = ? AND e.id > ?' . ($before ? ' AND e.id < ' . $before : '') . '
             ORDER BY e.id DESC LIMIT ' . $limit, [(int)$me['id'], (int)$me['id'], $since])->fetchAll();
  $items = [];
  foreach ($rows as $r) {
    $items[] = [
      'id' => (int)$r['id'],
      'kind' => (string)$r['kind'],
      'ref' => (string)$r['ref'],
      'text' => (string)$r['text'],
      'likes' => (int)$r['likes'],
      'liked' => (int)$r['liked'] > 0,
      'seen' => $r['seen_at'] !== null,
      'at' => (int)$r['created_at'],
      'who' => ev_who($r),
    ];
  }
  $unseen = (int)(one('SELECT COUNT(*) AS n FROM kl_event_to WHERE user_id = ? AND seen_at IS NULL', [(int)$me['id']])['n'] ?? 0);
  out(['ok' => true, 'items' => $items, 'unseen' => $unseen]);
}

if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input();
$me = ev_me();
$action = (string)($in['action'] ?? '');

if ($action === 'seen') {
  q('UPDATE kl_event_to SET seen_at = ? WHERE user_id = ? AND seen_at IS NULL', [time(), (int)$me['id']]);
  events_prune((int)$me['id']);
  out(['ok' => true]);
}

if ($action === 'like') {
  rate_or_fail('ev-like:' . (int)$me['id'], 120, 3600);
  $id = (int)($in['id'] ?? 0);
  // вподобати можна лише те, що тобі справді показали
  if (!one('SELECT event_id FROM kl_event_to WHERE event_id = ? AND user_id = ?', [$id, (int)$me['id']])) fail('not_found', 404);
  $has = one('SELECT event_id FROM kl_event_likes WHERE event_id = ? AND user_id = ?', [$id, (int)$me['id']]);
  $ev = one('SELECT owner_id, kind, text FROM kl_events WHERE id = ?', [$id]);
  if (!$ev) fail('not_found', 404);
  if ($has) {
    q('DELETE FROM kl_event_likes WHERE event_id = ? AND user_id = ?', [$id, (int)$me['id']]);
    q('UPDATE kl_events SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE 0 END WHERE id = ?', [$id]);
  } else {
    q('INSERT INTO kl_event_likes (event_id, user_id, created_at) VALUES (?, ?, ?)', [$id, (int)$me['id'], time()]);
    q('UPDATE kl_events SET likes = likes + 1 WHERE id = ?', [$id]);
    // автор бачить, хто його підтримав (не частіше ніж раз на подію — ключ у ref)
    if ((int)$ev['owner_id'] !== (int)$me['id'] && (string)$ev['kind'] !== 'like') {
      event_add((int)$me['id'], 'like', (string)$id, mb_substr((string)$ev['text'], 0, 160), [(int)$ev['owner_id']]);
    }
  }
  $likes = (int)(one('SELECT likes FROM kl_events WHERE id = ?', [$id])['likes'] ?? 0);
  out(['ok' => true, 'likes' => $likes, 'liked' => !$has]);
}

if ($action === 'friend') {
  rate_or_fail('ev-friend:' . (int)$me['id'], 40, 3600);
  $code = strtoupper(trim((string)($in['code'] ?? '')));
  if (!preg_match('/^[A-HJ-NP-Z2-9]{6}$/', $code)) fail('code');
  $to = one('SELECT id FROM kl_users WHERE friend_code = ? AND blocked_at IS NULL', [$code]);
  if (!$to) fail('not_found', 404);
  event_add((int)$me['id'], 'friend', $code, '', [(int)$to['id']]);
  out(['ok' => true]);
}

if ($action === 'share') {
  rate_or_fail('ev-share:' . (int)$me['id'], 60, 3600);
  $kind = in_array($in['kind'] ?? '', ['quiz', 'level'], true) ? (string)$in['kind'] : '';
  if ($kind === '') fail('kind');
  $ref = clean_text((string)($in['ref'] ?? ''), 80);
  $text = clean_text((string)($in['text'] ?? ''), 160);
  if (has_link($text)) fail('links');
  $codes = friend_codes((int)$me['id']);
  $ids = array_map(fn($r) => (int)$r['id'], users_by_codes($codes));
  if (!$ids) out(['ok' => true, 'n' => 0]);
  // та сама подія двічі на добу не потрібна
  $twin = one('SELECT id FROM kl_events WHERE owner_id = ? AND kind = ? AND ref = ? AND created_at > ?',
    [(int)$me['id'], $kind, $ref, time() - 86400]);
  if ($twin) out(['ok' => true, 'n' => 0, 'dup' => true]);
  $n = event_add((int)$me['id'], $kind, $ref, $text, $ids);
  out(['ok' => true, 'n' => $n]);
}

fail('action', 404);
