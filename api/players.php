<?php
/* Комікс·Lab — каталог гравців для пошуку (лише ті, хто дозволив показ профілю). Дані — у БД (kl_players).
 *
 * GET  players.php?ping=1                              → { ok, players: 1 }
 * GET  players.php?q=&learn=&level=&near=A2&page=0&sort=stars → { ok, total, players: [...] } (без онлайн-статусу)
 * GET  players.php?tag=jobb                            → ті, хто поставив собі такий хештег
 * GET  players.php?code=ABC234                         → { ok, player } (з знімком профілю)
 * POST { action: "upsert", code, secret, card }        → опублікувати/оновити свою картку
 * POST { action: "remove", code, secret }              → прибрати себе з пошуку
 * Власник картки — хто першим її створив (секрет), або залогінений користувач із цим кодом друга.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

const CODE_RE = '/^[A-HJ-NP-Z2-9]{6}$/';
const LEARN = ['norsk', 'english', 'math', 'logic'];
const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const PAGE = 24;

function card_out(array $p, bool $withSnap = false): array {
  $c = ['code' => $p['code'], 'name' => $p['name'], 'avatar' => $p['avatar'], 'learn' => $p['learn'] === '' ? [] : explode(',', $p['learn']), 'level' => $p['level'], 'stars' => (int)$p['stars'], 'badges' => (int)$p['badges'], 'streak' => (int)$p['streak'], 'active' => (int)($p['active'] ?? 0)];
  $c['tags'] = ($p['tags'] ?? '') === '' ? [] : explode(',', (string)$p['tags']);
  $c['since'] = (int)($p['since'] ?? 0);   // коли акаунт уперше з'явився в списку
  // офіційний акаунт (адміністратор) — завжди «онлайн»: до нього завжди можна звернутися
  if (!empty($p['is_admin'])) { $c['official'] = true; $c['online'] = true; }
  if (!empty($p['is_teacher'])) $c['teacher'] = true;
  // онлайн-статус і «коли був» звичайних гравців — не публічні: їх бачать лише друзі (напряму через PeerJS, assets/friends.js)
  if ($withSnap) $c['snap'] = $p['snap'];
  return $c;
}

if (method() === 'GET') {
  if (($_GET['ping'] ?? '') === '1') { db(); out(['ok' => true, 'players' => 1]); }
  ensure_official_cards();
  if (isset($_GET['code'])) {
    $code = strtoupper((string)$_GET['code']);
    if (!preg_match(CODE_RE, $code)) fail('not_found', 404);
    $p = one('SELECT p.*, u.is_admin, u.is_teacher FROM kl_players p LEFT JOIN kl_users u ON u.id = p.user_id WHERE p.code = ?', [$code]);
    if (!$p) fail('not_found', 404);
    out(['ok' => true, 'player' => card_out($p, true)]);
  }
  $where = []; $args = [];
  $qs = clean_text((string)($_GET['q'] ?? ''), 30);
  // «#jobb» у полі пошуку — це теж пошук за хештегом
  $tag = (clean_tags((string)($_GET['tag'] ?? ''), 1)[0] ?? '');
  if ($tag === '' && str_starts_with(trim($qs), '#')) { $tag = (clean_tags($qs, 1)[0] ?? ''); $qs = ''; }
  if ($tag !== '') { $where[] = "(',' || p.tags || ',') LIKE ?"; $args[] = '%,' . $tag . ',%'; }
  if ($qs !== '') { $where[] = '(LOWER(p.name) LIKE ? OR p.code LIKE ?)'; $like = '%' . str_replace(['%', '_'], ['\%', '\_'], strtolower($qs)) . '%'; $args[] = $like; $args[] = strtoupper($like); }
  $learn = $_GET['learn'] ?? '';
  if (in_array($learn, LEARN, true)) { $where[] = "(',' || p.learn || ',') LIKE ?"; $args[] = '%,' . $learn . ',%'; }
  $level = $_GET['level'] ?? '';
  if (in_array($level, LEVELS, true)) { $where[] = 'p.level = ?'; $args[] = $level; }
  $sort = (string)($_GET['sort'] ?? '');
  /* Рейтинг і «нові гравці» — лише справжні акаунти: картка без власника з'являється
     в будь-якому браузері, де людина не ввійшла, і тоді одна людина двоїться в таблиці. */
  if ($sort === 'stars' || $sort === 'active' || $sort === 'new') {
    $where[] = 'p.user_id IS NOT NULL';
    $where[] = 'COALESCE(u.is_demo, 0) = 0';
  }
  if ($sort === 'stars' || $sort === 'active') $where[] = 'p.stars > 0';
  $w = $where ? ' WHERE ' . implode(' AND ', $where) : '';
  if (is_mysql()) $w = str_replace(["(',' || p.learn || ',')", "(',' || p.tags || ',')"], ["CONCAT(',', p.learn, ',')", "CONCAT(',', p.tags, ',')"], $w);
  $from = 'kl_players p LEFT JOIN kl_users u ON u.id = p.user_id';
  $total = (int)one("SELECT COUNT(*) AS n FROM $from$w", $args)['n'];
  $page = max(0, min(50, (int)($_GET['page'] ?? 0)));
  $near = array_search($_GET['near'] ?? '', LEVELS, true);
  $lvlNum = "(CASE p.level WHEN 'A1' THEN 0 WHEN 'A2' THEN 1 WHEN 'B1' THEN 2 WHEN 'B2' THEN 3 ELSE 0 END)";
  $order = $near !== false ? "ABS($lvlNum - " . (int)$near . '), p.stars DESC, p.updated DESC'
    : ($sort === 'stars' ? 'p.stars DESC, p.badges DESC'
    : ($sort === 'new' ? 'p.since DESC, p.updated DESC'
    : ($sort === 'active' ? 'p.active DESC, p.seen DESC, p.stars DESC' : 'p.updated DESC')));
  $rows = q("SELECT p.*, u.is_admin, u.is_teacher FROM $from$w ORDER BY $order LIMIT " . PAGE . ' OFFSET ' . ($page * PAGE), $args)->fetchAll();
  out(['ok' => true, 'total' => $total, 'page' => $page, 'players' => array_map('card_out', $rows)]);
}

if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input();
$code = strtoupper((string)($in['code'] ?? ''));
$secret = (string)($in['secret'] ?? '');
if (!preg_match(CODE_RE, $code)) fail('code');
if (strlen($secret) < 16 || strlen($secret) > 128) fail('secret');
rate_or_fail('players:' . ip_hash(), 120, 3600);
$me = current_user();
$prev = one('SELECT * FROM kl_players WHERE code = ?', [$code]);
$isOwner = ($me && $me['friend_code'] === $code) || ($prev && hash_equals($prev['secret_hash'], sha('komiks-players:' . $secret)));
$action = (string)($in['action'] ?? '');

if ($action === 'upsert') {
  if ($prev && !$isOwner) fail('taken', 403);
  $c = is_array($in['card'] ?? null) ? $in['card'] : [];
  $name = clean_text((string)($c['name'] ?? ''), 20);
  if ($name === '' || has_link($name)) fail('name');
  $snap = (string)($c['snap'] ?? '');
  if (strlen($snap) > 3000 || !preg_match('/^[A-Za-z0-9_-]*$/', $snap)) fail('snap');
  $now = time();
  if ($prev && $now - (int)$prev['updated'] < 45) { q('UPDATE kl_players SET seen = ?, act = ? WHERE code = ?', [$now, clean_text((string)($c['act'] ?? ''), 12), $code]); out(['ok' => true]); }
  // до 7 тегів по 24 знаки — колонку на MySQL розширюємо один раз (SQLite довжину не перевіряє)
  if (meta_get('tags200') !== '1') { if (is_mysql()) { try { q("ALTER TABLE kl_players MODIFY tags VARCHAR(200) NOT NULL DEFAULT ''"); } catch (Throwable $e) { error_log('[komiks-tags] ' . $e->getMessage()); } } meta_set('tags200', '1'); }
  upsert('kl_players', ['code'], [
    'code' => $code, 'user_id' => $me && $me['friend_code'] === $code ? (int)$me['id'] : ($prev['user_id'] ?? null),
    'secret_hash' => $prev['secret_hash'] ?? sha('komiks-players:' . $secret),
    'name' => $name, 'avatar' => clean_text((string)($c['avatar'] ?? ''), 60) ?: '🙂',
    'learn' => implode(',', array_values(array_intersect(LEARN, is_array($c['learn'] ?? null) ? $c['learn'] : []))),
    'level' => in_array($c['level'] ?? '', LEVELS, true) ? $c['level'] : '',
    'stars' => max(0, min(100000, (int)($c['stars'] ?? 0))), 'badges' => max(0, min(100, (int)($c['badges'] ?? 0))), 'streak' => max(0, min(10000, (int)($c['streak'] ?? 0))),
    'act' => clean_text((string)($c['act'] ?? ''), 12), 'snap' => $snap, 'seen' => $now, 'updated' => $now, 'since' => (int)($prev['since'] ?? $now),
    'tags' => mb_substr(implode(',', clean_tags($c['tags'] ?? [])), 0, 200),
  ]);
  if ($me && $me['friend_code'] === $code) {
    // одна людина — одна картка: старі картки цього акаунта прибираємо
    q('DELETE FROM kl_players WHERE user_id = ? AND code <> ?', [(int)$me['id'], $code]);
    refresh_rank($me);
  }
  out(['ok' => true]);
}
if ($action === 'remove') {
  if ($me && !empty($me['is_admin']) && $me['friend_code'] === $code) meta_set('off:' . (int)$me['id'], '1');
  if (!$prev) out(['ok' => true]);
  if (!$isOwner) fail('forbidden', 403);
  q('DELETE FROM kl_players WHERE code = ?', [$code]);
  out(['ok' => true]);
}
fail('action');
