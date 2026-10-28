<?php
/* Комікс·Lab — 🛡 модерація спільноти (admin.php?p=community).
 * Черга: нові дописи на стінах, яких ще ніхто не переглянув, і скарги на особисті повідомлення.
 * Кожен запис має автоматичні позначки (лайка, посилання, контакти, капс), історію автора й дії
 * одним кліком без перезавантаження: схвалити, прибрати, попередити, заблокувати на час.
 * Модератори бачать усе, крім каталогу гравців і ботів (це — адміністратору). */
declare(strict_types=1);
if (!defined('KOMIKS_API')) exit;

function mod_install(): void {
  if (meta_get('mod_v') === '1') return;
  try { q('ALTER TABLE kl_comments ADD COLUMN mod_ok_at INT NULL'); } catch (Throwable $e) { /* вже є */ }
  try { q('ALTER TABLE kl_messages ADD COLUMN mod_done_at INT NULL'); } catch (Throwable $e) { /* вже є */ }
  try { q('SELECT mod_ok_at FROM kl_comments LIMIT 1'); q('SELECT mod_done_at FROM kl_messages LIMIT 1'); meta_set('mod_v', '1'); } catch (Throwable $e) { /* наступного разу */ }
}

/* Автоматичні позначки. Не вирок, а підказка, на що глянути першим: найважливіше для дитячого
   сайту — контакти й посилання (спроба вивести дитину в інший месенджер). */
function mod_flags(string $t): array {
  $f = [];
  if (preg_match('/(хуй|хуя|хує|хуї|пизд|бля[дт]|\bбля\b|сука|сучк|[еєё]ба[тн]|їба|\bйоб|мудак|п[іи]д[оа]р|гандон|залуп|шлюх|курв|\bfuck|shit|bitch|cunt|\bdick\b|asshole|nigg|faggot|\bfaen\b|helvete|jævla|jævel|\bfitte|\bkuk\b|\bhore\b|\bpikk)/iu', $t)) $f['swear'] = ['🤬 лайка', 'r'];
  if (preg_match('/(https?:|www\.|\b[a-z0-9-]+\.(com|net|org|ru|ua|no|io|me|ly|gg)\b)/iu', $t)) $f['link'] = ['🔗 посилання', 'r'];
  if (preg_match('/[\w.+-]+@[\w-]+\.[a-z]{2,}|\+?\d[\d\s().-]{7,}\d|t\.me|telegram|whats ?app|viber|snap(chat)?|insta(gram)?|tik ?tok|discord|vk\.com|signal/iu', $t)) $f['contact'] = ['📱 контакти', 'r'];
  // ознаки небезпеки для дитини: просять фото, адресу, зустріч, вік або «не кажи батькам»
  if (preg_match('/(bild(e|et)?\s+(av|ditt)|send\s+(meg\s+)?(et\s+)?bilde|nakenbilde|фото\s*(себе|своє|тебе)|скинь\s+фото|надішли\s+фото|send\s+(me\s+)?(a\s+)?(pic|photo|picture)|nudes?\b|adresse(n)?\s+din|hvor\s+bor\s+du|де\s+ти\s+живеш|адрес[ау]|where\s+do\s+you\s+live|your\s+address|møtes|зустрінемось|давай\s+зустрін|meet\s+(me|up)|hvor\s+gammel|скільки\s+тобі\s+рок|how\s+old\s+are\s+you|ikke\s+si\s+(det\s+)?til|не\s+кажи|не\s+розповідай|don.?t\s+tell|hemmelig\s+mellom|наш\s+секрет|our\s+secret)/iu', $t)) $f['danger'] = ['🚨 небезпека', 'r'];
  $letters = preg_replace('/[^\p{L}]/u', '', $t); $len = (int)preg_match_all('/./us', $letters);
  if ($len >= 12 && preg_match_all('/\p{Lu}/u', $letters) / max(1, $len) > .7) $f['caps'] = ['📢 капс', 'y'];
  if (preg_match('/(.)\1{5,}/u', $t)) $f['spam'] = ['🔁 повтори', 'y'];
  return $f;
}
// скільки разів цю людину вже попереджали чи блокували
function mod_record(?int $userId, ?string $ipHash): array {
  if (!$userId && !$ipHash) return [0, 0];
  [$col, $val] = $userId ? ['user_id', $userId] : ['ip_hash', $ipHash];
  $warn = (int)(one("SELECT COUNT(*) AS n FROM kl_notices WHERE $col = ? AND kind IN ('warn','ban')", [$val])['n'] ?? 0);
  $bans = (int)(one("SELECT COUNT(*) AS n FROM kl_bans WHERE $col = ?", [$val])['n'] ?? 0);
  return [$warn, $bans];
}
function mod_counts(): array {
  $n = fn(string $sql, array $a = []) => (int)(one($sql, $a)['n'] ?? 0);
  return [
    'queue' => $n('SELECT COUNT(*) AS n FROM kl_comments WHERE mod_ok_at IS NULL'),
    'reports' => $n('SELECT COUNT(*) AS n FROM kl_messages WHERE reported_at IS NOT NULL AND mod_done_at IS NULL'),
    'bans' => $n('SELECT COUNT(*) AS n FROM kl_bans WHERE until_at > ?', [time()]),
    'warn7' => $n("SELECT COUNT(*) AS n FROM kl_notices WHERE kind IN ('warn','ban') AND created_at > ?", [time() - 7 * 86400]),
    'posts7' => $n('SELECT COUNT(*) AS n FROM kl_comments WHERE created_at > ?', [time() - 7 * 86400]),
  ];
}

function mod_render(string $tab, bool $isAdmin, string $csrf): void {
  mod_install();
  $TABS = ['queue' => '📥 Черга', 'walls' => '💬 Усі дописи', 'reports' => '🚩 Скарги на повідомлення', 'bans' => '⛔ Блокування', 'log' => '📜 Журнал'];
  if ($isAdmin) { $TABS['players'] = '🔎 Каталог гравців'; $TABS['bots'] = '🤖 Віртуальні гравці'; }
  if (!isset($TABS[$tab])) $tab = 'queue';
  $c = mod_counts();
  $url = fn(string $t, array $x = []) => 'admin.php?' . http_build_query(['p' => 'community', 't' => $t] + $x);
  // одна форма-кнопка: data-ajax — без перезавантаження, data-done="remove" — прибрати картку
  $f = function (string $do, array $hidden, string $label, string $cls = '', string $confirm = '', bool $remove = true) use ($csrf, $tab) {
    $h = '';
    foreach ($hidden as $k => $v) $h .= '<input type="hidden" name="' . e($k) . '" value="' . e($v) . '">';
    return '<form method="post" action="admin.php?p=community&amp;t=' . e($tab) . '" data-ajax' . ($remove ? ' data-done="remove"' : '') . ($confirm ? ' data-confirm="' . e($confirm) . '"' : '') . '>' . $csrf . '<input type="hidden" name="do" value="' . e($do) . '">' . $h . '<button class="btn sm ' . $cls . '">' . $label . '</button></form>';
  };
  echo '<div class="mod-head"><h1>🛡 Модерація</h1><p class="muted">Нове з’являється в черзі, доки хтось не схвалить або не прибере. Дії виконуються одразу, без перезавантаження сторінки.</p></div>';
  echo '<div class="stats mod-stats">'
    . '<a class="stat ' . ($c['queue'] ? 'y' : 'g') . '" href="' . e($url('queue')) . '"><span>📥</span><b data-count="queue">' . $c['queue'] . '</b><small>дописів у черзі</small></a>'
    . '<a class="stat ' . ($c['reports'] ? 'r' : 'g') . '" href="' . e($url('reports')) . '"><span>🚩</span><b data-count="reports">' . $c['reports'] . '</b><small>скарг на повідомлення</small></a>'
    . '<a class="stat b" href="' . e($url('bans')) . '"><span>⛔</span><b>' . $c['bans'] . '</b><small>діючих блокувань</small></a>'
    . '<a class="stat p" href="' . e($url('log')) . '"><span>⚠️</span><b>' . $c['warn7'] . '</b><small>попереджень за 7 днів</small></a>'
    . '<div class="stat"><span>💬</span><b>' . $c['posts7'] . '</b><small>дописів за 7 днів</small></div></div>';
  echo '<nav class="chips mod-tabs" aria-label="Розділи модерації">';
  foreach ($TABS as $k => $l) {
    $badge = $k === 'queue' ? $c['queue'] : ($k === 'reports' ? $c['reports'] : 0);
    echo '<a class="' . ($k === $tab ? 'on' : '') . '" href="' . e($url($k)) . '">' . e($l) . ($badge ? ' <span class="mod-badge">' . $badge . '</span>' : '') . '</a>';
  }
  echo '</nav>';

  // картка допису на стіні
  $owners = [];
  $ownerName = function (string $code) use (&$owners) {
    if (!isset($owners[$code])) { $r = one('SELECT name FROM kl_users WHERE friend_code = ?', [$code]) ?: one('SELECT name FROM kl_players WHERE code = ?', [$code]); $owners[$code] = $r['name'] ?? $code; }
    return $owners[$code];
  };
  $comment = function (array $cm, bool $queue) use ($f, $ownerName, $isAdmin) {
    $flags = mod_flags((string)$cm['text']);
    [$warn, $bans] = mod_record(!empty($cm['user_id']) ? (int)$cm['user_id'] : null, $cm['ip_hash'] ?? null);
    $who = !empty($cm['user_id']) ? ($isAdmin ? '<a href="admin.php?p=user&amp;id=' . (int)$cm['user_id'] . '">акаунт</a>' : '<span class="pill">акаунт</span>') : '<span class="pill">гість · за IP</span>';
    $sev = isset($flags['danger']) || isset($flags['swear']) || isset($flags['contact']) || isset($flags['link']) ? 'hi' : ($flags ? 'mid' : 'lo');
    $id = ['cid' => $cm['id']];
    echo '<article class="mod-item sev-' . $sev . '" data-item' . ($queue ? ' data-dec="queue"' : '') . '>'
      . '<header><span class="u-ava">' . e(mb_first((string)$cm['name'])) . '</span><div class="mod-who"><b>' . e($cm['name']) . '</b> ' . $who
      . ' <small class="muted">→ стіна <a href="./#/player/c/' . e($cm['owner']) . '" target="_blank" rel="noopener">' . e($ownerName((string)$cm['owner'])) . '</a> · ' . e(when((int)$cm['created_at'])) . '</small></div>'
      . '<div class="mod-flags">' . implode('', array_map(fn($x) => '<span class="pill ' . $x[1] . '">' . e($x[0]) . '</span>', $flags))
      . ($warn || $bans ? '<span class="pill p" title="Попереджень і блокувань раніше">⚠️ ' . $warn . ' · ⛔ ' . $bans . '</span>' : '') . '</div></header>'
      . '<blockquote class="mod-text">' . nl2br(e($cm['text'])) . '</blockquote>'
      . '<div class="row mod-acts">'
      . ($queue ? $f('comment_ok', $id, '✓ Схвалити', 'ok') : '')
      . $f('comment_del', $id, '🗑 Прибрати', 'danger')
      . $f('comment_warn', $id, '⚠️ Прибрати й попередити')
      . $f('comment_ban', $id + ['hours' => 1], '⛔ 1 год', '', 'Прибрати допис і заборонити авторові писати 1 годину?')
      . $f('comment_ban', $id + ['hours' => 24], '⛔ 1 добу', '', 'Прибрати допис і заборонити авторові писати 1 добу?')
      . $f('comment_ban', $id + ['hours' => 168], '⛔ 7 днів', '', 'Прибрати допис і заборонити авторові писати 7 днів?')
      . '</div></article>';
  };

  if ($tab === 'queue') {
    $rows = q('SELECT * FROM kl_comments WHERE mod_ok_at IS NULL ORDER BY created_at DESC LIMIT 80')->fetchAll();
    // найризикованіші — нагору
    usort($rows, fn($a, $b) => (count(mod_flags((string)$b['text'])) <=> count(mod_flags((string)$a['text']))) ?: ((int)$b['created_at'] <=> (int)$a['created_at']));
    $reports = (int)$c['reports'];
    if ($reports) echo '<div class="msg warn">🚩 Є ' . $reports . ' ' . ($reports === 1 ? 'скарга' : 'скарги') . ' на особисті повідомлення — <a href="' . e($url('reports')) . '">переглянути</a>.</div>';
    if ($rows) echo '<div class="mod-bar"><span class="muted">Показано ' . count($rows) . ' з ' . $c['queue'] . '. Спершу — з позначками.</span>'
      . $f('comment_ok_all', ['ids' => implode(',', array_map(fn($r) => $r['id'], array_filter($rows, fn($r) => !mod_flags((string)$r['text']))))], '✓ Схвалити всі без позначок', 'ok', 'Схвалити всі дописи без автоматичних позначок?', false) . '</div>';
    echo '<div class="mod-list" data-empty="✨ Черга порожня — усе переглянуто.">';
    foreach ($rows as $cm) $comment($cm, true);
    if (!$rows) echo '<p class="mod-empty">✨ Черга порожня — усе переглянуто.</p>';
    echo '</div>';
  }

  if ($tab === 'walls') {
    $qs = trim((string)($_GET['q'] ?? ''));
    echo '<form class="filters" method="get"><input type="hidden" name="p" value="community"><input type="hidden" name="t" value="walls"><input type="search" name="q" value="' . e($qs) . '" placeholder="Текст, автор або код стіни"><button class="btn">🔎 Шукати</button></form>';
    $args = []; $w = '';
    if ($qs !== '') { $w = ' WHERE LOWER(text) LIKE ? OR LOWER(name) LIKE ? OR owner = ?'; $like = '%' . mb_lower($qs) . '%'; $args = [$like, $like, strtoupper($qs)]; }
    $rows = q("SELECT * FROM kl_comments$w ORDER BY created_at DESC LIMIT 100", $args)->fetchAll();
    echo '<div class="mod-list" data-empty="Нічого не знайдено.">';
    foreach ($rows as $cm) $comment($cm, empty($cm['mod_ok_at']));
    if (!$rows) echo '<p class="mod-empty">Нічого не знайдено.</p>';
    echo '</div>';
  }

  if ($tab === 'reports') {
    $rows = q('SELECT m.*, a.name AS from_name, a.friend_code AS from_code, b.name AS to_name FROM kl_messages m LEFT JOIN kl_users a ON a.id = m.from_id LEFT JOIN kl_users b ON b.id = m.to_id WHERE m.reported_at IS NOT NULL AND m.mod_done_at IS NULL ORDER BY m.reported_at DESC LIMIT 60')->fetchAll();
    echo '<p class="muted">Повідомлення, на які поскаржився отримувач. Видно лише сам допис — решту листування модератор не читає.</p><div class="mod-list" data-empty="✨ Скарг немає.">';
    foreach ($rows as $m) {
      $flags = mod_flags((string)$m['text']);
      [$warn, $bans] = mod_record((int)$m['from_id'], null);
      $id = ['mid' => (int)$m['id']];
      echo '<article class="mod-item sev-hi" data-item data-dec="reports"><header><span class="u-ava">' . e(mb_first((string)($m['from_name'] ?? '?'))) . '</span><div class="mod-who"><b>' . e($m['from_name'] ?? 'видалений акаунт') . '</b>'
        . ($isAdmin && $m['from_id'] ? ' <a href="admin.php?p=user&amp;id=' . (int)$m['from_id'] . '">акаунт</a>' : '')
        . ' <small class="muted">→ ' . e($m['to_name'] ?? '?') . ' · скарга ' . e(when((int)$m['reported_at'])) . '</small></div><div class="mod-flags">'
        . implode('', array_map(fn($x) => '<span class="pill ' . $x[1] . '">' . e($x[0]) . '</span>', $flags)) . ($warn || $bans ? '<span class="pill p">⚠️ ' . $warn . ' · ⛔ ' . $bans . '</span>' : '') . '</div></header>'
        . '<blockquote class="mod-text">' . nl2br(e($m['text'])) . '</blockquote><div class="row mod-acts">'
        . $f('msg_ok', $id, '✓ Порушення немає', 'ok')
        . $f('msg_del', $id, '🗑 Прибрати повідомлення', 'danger')
        . $f('msg_warn', $id, '⚠️ Прибрати й попередити')
        . $f('msg_ban', $id + ['hours' => 24], '⛔ 1 добу', '', 'Прибрати повідомлення й заборонити авторові писати 1 добу?')
        . $f('msg_ban', $id + ['hours' => 168], '⛔ 7 днів', '', 'Прибрати повідомлення й заборонити авторові писати 7 днів?')
        . '</div></article>';
    }
    if (!$rows) echo '<p class="mod-empty">✨ Скарг немає.</p>';
    echo '</div>';
  }

  if ($tab === 'bans') {
    $rows = q('SELECT b.*, u.name, s.name AS by_name FROM kl_bans b LEFT JOIN kl_users u ON u.id = b.user_id LEFT JOIN kl_users s ON s.id = b.by_id WHERE b.until_at > ? OR b.created_at > ? ORDER BY b.until_at DESC LIMIT 80', [time(), time() - 30 * 86400])->fetchAll();
    echo '<div class="card"><table class="t"><thead><tr><th>Кому</th><th>Стан</th><th>Причина</th><th>Хто</th><th>Коли</th><th></th></tr></thead><tbody>';
    foreach ($rows as $b) {
      $on = (int)$b['until_at'] > time();
      echo '<tr data-item><td><b>' . e($b['name'] ?: 'гість (за IP)') . '</b></td><td data-l="Стан">' . ($on ? '<span class="pill r">до ' . date('d.m H:i', (int)$b['until_at']) . '</span>' : '<span class="pill">завершено</span>') . '</td>'
        . '<td data-l="Причина">' . e(['wall' => 'допис на стіні', 'msg' => 'повідомлення', 'admin' => 'вручну'][$b['reason']] ?? $b['reason']) . '</td><td data-l="Хто">' . e($b['by_name'] ?? '—') . '</td><td data-l="Коли">' . e(when((int)$b['created_at'])) . '</td>'
        . '<td>' . ($on ? $f('unban', ['ban' => (int)$b['id']], 'Зняти', 'ok', '', false) : '') . '</td></tr>';
    }
    if (!$rows) echo '<tr><td colspan="6" class="muted">Блокувань за 30 днів не було.</td></tr>';
    echo '</tbody></table></div>';
  }

  if ($tab === 'log') {
    $rows = q("SELECT n.*, u.name, s.name AS by_name FROM kl_notices n LEFT JOIN kl_users u ON u.id = n.user_id LEFT JOIN kl_users s ON s.id = n.by_id ORDER BY n.created_at DESC LIMIT 100")->fetchAll();
    $K = ['warn' => ['⚠️ попередження', 'y'], 'ban' => ['⛔ блокування', 'r'], 'note' => ['✉️ звернення', 'b']];
    echo '<div class="card"><table class="t"><thead><tr><th>Коли</th><th>Кому</th><th>Що</th><th>Текст</th><th>Хто</th><th>Побачив</th></tr></thead><tbody>';
    foreach ($rows as $n) echo '<tr><td>' . e(when((int)$n['created_at'])) . '</td><td data-l="Кому">' . e($n['name'] ?: 'гість (за IP)') . '</td><td data-l="Що"><span class="pill ' . ($K[$n['kind']][1] ?? '') . '">' . e($K[$n['kind']][0] ?? $n['kind']) . '</span></td>'
      . '<td data-l="Текст"><small>' . e(mb_substr_s((string)$n['text'], 140)) . '</small></td><td data-l="Хто">' . e($n['by_name'] ?? '—') . '</td><td data-l="Побачив">' . ($n['seen_at'] ? '✓' : '<span class="muted">ще ні</span>') . '</td></tr>';
    if (!$rows) echo '<tr><td colspan="6" class="muted">Записів ще немає.</td></tr>';
    echo '</tbody></table></div>';
  }

  if ($tab === 'players' && $isAdmin) {
    $rows = q('SELECT p.code, p.name, p.level, p.stars, p.updated, p.learn, u.id AS uid FROM kl_players p LEFT JOIN kl_users u ON u.id = p.user_id ORDER BY p.updated DESC LIMIT 120')->fetchAll();
    echo '<p class="muted">Картки з пошуку гравців. Образливе ім’я — приберіть картку: людина зможе опублікувати її знову з іншим ім’ям.</p><div class="card"><table class="t"><thead><tr><th>Гравець</th><th>Рівень</th><th>⭐</th><th>Оновлено</th><th></th></tr></thead><tbody>';
    foreach ($rows as $x) {
      $flags = mod_flags((string)$x['name']);
      echo '<tr data-item><td><b>' . e($x['name']) . '</b> <code>' . e($x['code']) . '</code> ' . implode('', array_map(fn($fl) => '<span class="pill ' . $fl[1] . '">' . e($fl[0]) . '</span>', $flags))
        . ($x['uid'] ? ' <a href="admin.php?p=user&amp;id=' . (int)$x['uid'] . '">акаунт</a>' : ' <span class="pill r" title="Картка з браузера без входу. У рейтингу не показується.">без акаунта</span>') . '</td>'
        . '<td data-l="Рівень"><span class="pill ' . e($x['level']) . '">' . e($x['level'] ?: '—') . '</span></td><td data-l="Зірки">' . (int)$x['stars'] . '</td><td data-l="Оновлено">' . e(when((int)$x['updated'])) . '</td>'
        . '<td>' . $f('player_del', ['code' => $x['code']], '🗑 Прибрати картку', 'danger', 'Прибрати картку гравця з пошуку?') . '</td></tr>';
    }
    if (!$rows) echo '<tr><td colspan="5" class="muted">Каталог порожній.</td></tr>';
    echo '</tbody></table></div>';
  }

  if ($tab === 'bots' && $isAdmin) {
    $bots = bots_list();
    $DIFF = ['easy' => '🟢 легкий', 'medium' => '🟡 середній', 'hard' => '🔴 сильний', 'pro' => '🟣 майстер'];
    echo '<p class="muted">Завжди «онлайн», грають у Логік-гонці, Math Rocket і шахах. Живуть у коді <code>assets/bots.js</code> — у базі їх немає, писати їм не можна.</p><div class="card"><table class="t"><thead><tr><th>Бот</th><th>Рівень</th><th>Складність</th><th>Зірки</th></tr></thead><tbody>';
    foreach ($bots as $b) echo '<tr><td><b>' . e($b['name']) . '</b> <code>' . e($b['code']) . '</code></td><td data-l="Рівень"><span class="pill ' . e($b['level']) . '">' . e($b['level']) . '</span></td><td data-l="Складність">' . e($DIFF[$b['diff']] ?? $b['diff']) . '</td><td data-l="Зірки">' . (int)$b['stars'] . '</td></tr>';
    if (!$bots) echo '<tr><td colspan="4" class="muted">Не вдалося прочитати assets/bots.js.</td></tr>';
    echo '</tbody></table></div>';
  }
}

function mod_css(): string {
  return '<style>
.mod-head p{margin:0 0 1rem}.mod-stats a.stat{color:inherit;text-decoration:none}.mod-stats a.stat:hover{transform:translate(-1px,-1px);box-shadow:5px 5px 0 var(--edge)}
.mod-tabs{margin-bottom:1rem}.mod-badge{display:inline-grid;place-items:center;min-width:1.3rem;padding:0 .35rem;border-radius:99px;background:var(--red);color:#fff;font-size:.7rem;font-weight:800;line-height:1.3rem}
.mod-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.6rem;margin-bottom:.8rem}.mod-bar form{margin:0}
.mod-list{display:grid;gap:.9rem}.mod-item{position:relative;background:var(--paper);border:2px solid var(--edge);border-radius:var(--radius);box-shadow:var(--shadow);padding:.85rem 1rem .85rem 1.15rem;transition:opacity .25s,transform .25s}
.mod-item::before{content:"";position:absolute;inset:0 auto 0 0;width:6px;border-radius:10px 0 0 10px;background:var(--line)}.mod-item.sev-hi::before{background:var(--red)}.mod-item.sev-mid::before{background:var(--yellow)}.mod-item.sev-lo::before{background:var(--green)}
.mod-item header{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem}.mod-who{flex:1 1 240px;min-width:0}.mod-who b{font-weight:800}.mod-flags{display:flex;flex-wrap:wrap;gap:.3rem}
.mod-text{position:relative;margin:.7rem 0 .75rem;padding:.65rem .85rem;background:var(--soft);border:2px solid var(--edge);border-radius:14px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:.95rem}
.mod-text::after{content:"";position:absolute;left:22px;top:-9px;width:14px;height:14px;background:var(--soft);border-left:2px solid var(--edge);border-top:2px solid var(--edge);transform:rotate(45deg)}
.mod-acts{gap:.4rem}.mod-item.gone{opacity:0;transform:translateX(30px) scale(.98)}.mod-empty{padding:1.2rem;text-align:center;font-weight:700;color:var(--muted);background:var(--paper);border:2px dashed var(--line);border-radius:var(--radius)}
tr.gone{opacity:.3}
</style>';
}
