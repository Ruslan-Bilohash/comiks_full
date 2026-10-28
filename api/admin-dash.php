<?php
/* Комікс·Lab — 📊 дашборд адмінки: відвідування (api/stats.php), акаунти, навчання, спільнота.
 * Графіки — власний SVG без бібліотек (CSP адмінки дозволяє лише свої скрипти з nonce).
 * Кольори — перевірена категоріальна палітра (синій, помаранчевий, бірюзовий, жовтий);
 * у бірюзового й жовтого контраст до білого нижчий за 3:1, тому поруч завжди підписи з числами,
 * а під кожним графіком — таблиця. */
declare(strict_types=1);
if (!defined('KOMIKS_API')) exit;
require_once __DIR__ . '/stats.php';

const DASH_C = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#6250d6'];
const DASH_SEQ = ['#eef1f4', '#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95'];

function dash_e($s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function dash_fmt(int $n): string { return number_format($n, 0, ',', ' '); }
function dash_short(string $day): string { return substr($day, 8, 2) . '.' . substr($day, 5, 2); }
// «гарний» верх осі: 1, 2, 5 × 10ⁿ
function dash_nice(float $v): float {
  if ($v <= 0) return 4;
  $p = 10 ** floor(log10($v)); $f = $v / $p;
  return ($f <= 1 ? 1 : ($f <= 2 ? 2 : ($f <= 5 ? 5 : 10))) * $p;
}
function dash_delta(int $now, int $prev): string {
  if ($prev <= 0) return $now > 0 ? '<span class="dl up">нове</span>' : '';
  $d = (int)round(($now - $prev) / $prev * 100);
  if ($d === 0) return '<span class="dl">0%</span>';
  return '<span class="dl ' . ($d > 0 ? 'up' : 'down') . '">' . ($d > 0 ? '▲ ' : '▼ ') . abs($d) . '%</span>';
}
function dash_spark(array $v, string $c): string {
  $n = count($v); if ($n < 2) return '';
  $max = max(1, max($v)); $w = 120; $h = 28; $pts = [];
  foreach ($v as $i => $y) $pts[] = round($i / ($n - 1) * $w, 1) . ',' . round($h - 2 - $y / $max * ($h - 4), 1);
  return '<svg class="spark" viewBox="0 0 ' . $w . ' ' . $h . '" preserveAspectRatio="none" aria-hidden="true"><polyline points="' . implode(' ', $pts) . '" fill="none" stroke="' . $c . '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>';
}

/* Лінійний графік з перехрестям: дані — у data-chart, підказку будує скрипт у dash_script(). */
function dash_line(array $days, array $series, string $label): string {
  $W = 720; $H = 240; $L = 44; $R = 12; $T = 14; $B = 28; $pw = $W - $L - $R; $ph = $H - $T - $B; $n = count($days);
  $max = dash_nice(max(1, ...array_map(fn($s) => max($s[2] ?: [0]), $series)));
  $x = fn($i) => $L + ($n > 1 ? $i / ($n - 1) * $pw : $pw / 2);
  $y = fn($v) => $T + $ph - $v / $max * $ph;
  $g = '';
  for ($k = 0; $k <= 4; $k++) { $v = $max * $k / 4; $yy = round($y($v), 1); $g .= '<line x1="' . $L . '" x2="' . ($W - $R) . '" y1="' . $yy . '" y2="' . $yy . '" class="gl"/><text x="' . ($L - 6) . '" y="' . ($yy + 4) . '" class="ax" text-anchor="end">' . dash_fmt((int)$v) . '</text>'; }
  $step = max(1, (int)ceil($n / 8));
  for ($i = 0; $i < $n; $i += $step) $g .= '<text x="' . round($x($i), 1) . '" y="' . ($H - 8) . '" class="ax" text-anchor="middle">' . dash_short($days[$i]) . '</text>';
  $paths = '';
  foreach ($series as $si => [$name, $c, $vals]) {
    $d = '';
    foreach ($vals as $i => $v) $d .= ($i ? 'L' : 'M') . round($x($i), 1) . ' ' . round($y($v), 1);
    if ($si === 0) $paths .= '<path d="' . $d . 'L' . round($x($n - 1), 1) . ' ' . ($T + $ph) . 'L' . $L . ' ' . ($T + $ph) . 'Z" fill="' . $c . '" opacity=".08"/>';
    $paths .= '<path d="' . $d . '" fill="none" stroke="' . $c . '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
  }
  $data = ['x' => array_map('dash_short', $days), 's' => array_map(fn($s) => ['n' => $s[0], 'c' => $s[1], 'v' => array_values($s[2])], $series),
    'g' => ['L' => $L, 'R' => $R, 'T' => $T, 'B' => $B, 'W' => $W, 'H' => $H, 'max' => $max]];
  $legend = '<div class="lg">' . implode('', array_map(fn($s) => '<span><i style="background:' . $s[1] . '"></i>' . dash_e($s[0]) . ' <b>' . dash_fmt(array_sum($s[2])) . '</b></span>', $series)) . '</div>';
  return $legend . '<div class="lc-wrap"><svg class="lc" viewBox="0 0 ' . $W . ' ' . $H . '" role="img" aria-label="' . dash_e($label) . '" tabindex="0" data-chart="' . dash_e(json_encode($data, JSON_UNESCAPED_UNICODE)) . '">' . $g . $paths
    . '<line class="xh" x1="0" x2="0" y1="' . $T . '" y2="' . ($T + $ph) . '" visibility="hidden"/><g class="dots"></g><rect class="hit" x="' . $L . '" y="' . $T . '" width="' . $pw . '" height="' . $ph . '" fill="transparent"/></svg><div class="tip" hidden></div></div>';
}
/* Стовпчики по днях: заокруглений верх, 2 px проміжок, кожен стовпчик — ціль для підказки. */
function dash_bars(array $days, array $vals, string $c, string $unit, ?callable $lab = null): string {
  $lab ??= 'dash_short';
  $W = 380; $H = 170; $L = 30; $R = 6; $T = 10; $B = 24; $pw = $W - $L - $R; $ph = $H - $T - $B; $n = max(1, count($days));
  $max = dash_nice(max(1, max($vals ?: [0]))); $bw = $pw / $n; $s = '';
  foreach ([0, .5, 1] as $k) { $yy = round($T + $ph - $ph * $k, 1); $s .= '<line x1="' . $L . '" x2="' . ($W - $R) . '" y1="' . $yy . '" y2="' . $yy . '" class="gl"/><text x="' . ($L - 5) . '" y="' . ($yy + 4) . '" class="ax" text-anchor="end">' . dash_fmt((int)($max * $k)) . '</text>'; }
  foreach ($vals as $i => $v) {
    $x0 = $L + $i * $bw + 1; $w = max(1, $bw - 2); $h = $v / $max * $ph; $y0 = $T + $ph - $h; $r = min(4, $w / 2, $h);
    $tip = $lab($days[$i]) . ' · ' . dash_fmt($v) . ' ' . $unit;
    if ($v > 0) $s .= '<path d="M' . round($x0, 1) . ' ' . ($T + $ph) . 'V' . round($y0 + $r, 1) . 'Q' . round($x0, 1) . ' ' . round($y0, 1) . ' ' . round($x0 + $r, 1) . ' ' . round($y0, 1) . 'H' . round($x0 + $w - $r, 1) . 'Q' . round($x0 + $w, 1) . ' ' . round($y0, 1) . ' ' . round($x0 + $w, 1) . ' ' . round($y0 + $r, 1) . 'V' . ($T + $ph) . 'Z" fill="' . $c . '"/>';
    $s .= '<rect class="bh" x="' . round($x0 - 1, 1) . '" y="' . $T . '" width="' . round($bw, 1) . '" height="' . $ph . '" fill="transparent" data-tip="' . dash_e($tip) . '"/>';
  }
  $step = max(1, (int)ceil($n / 5));
  for ($i = 0; $i < count($days); $i += $step) $s .= '<text x="' . round($L + ($i + .5) * $bw, 1) . '" y="' . ($H - 7) . '" class="ax" text-anchor="middle">' . $lab($days[$i]) . '</text>';
  return '<svg class="bc" viewBox="0 0 ' . $W . ' ' . $H . '" role="img" aria-label="' . dash_e($unit) . '">' . $s . '</svg>';
}
// горизонтальні стовпчики (HTML): назва — смужка — число
function dash_hbars(array $rows, string $c = DASH_C[0], ?callable $label = null): string {
  if (!$rows) return '<p class="muted empty">Поки немає даних.</p>';
  $max = max(1, max($rows)); $sum = max(1, array_sum($rows)); $h = '<ul class="hb">';
  foreach ($rows as $k => $v) $h .= '<li data-tip="' . dash_e(($label ? $label((string)$k) : $k) . ' · ' . dash_fmt($v) . ' (' . round($v / $sum * 100) . '%)') . '"><span class="hb-l">' . dash_e($label ? $label((string)$k) : $k) . '</span><span class="hb-b"><i style="width:' . max(1.5, round($v / $max * 100, 1)) . '%;background:' . $c . '"></i></span><b>' . dash_fmt($v) . '</b></li>';
  return $h . '</ul>';
}
// кільце: частки з 2 px проміжками + легенда з числами
function dash_donut(array $rows, array $names): string {
  $sum = array_sum($rows);
  if ($sum <= 0) return '<p class="muted empty">Поки немає даних.</p>';
  $r = 42; $C = 2 * M_PI * $r; $off = 0; $arcs = ''; $lg = ''; $i = 0;
  foreach ($rows as $k => $v) {
    $c = DASH_C[$i % count(DASH_C)]; $len = $v / $sum * $C; $gap = count($rows) > 1 ? min(2, $len / 2) : 0;
    $pct = round($v / $sum * 100);
    $arcs .= '<circle r="' . $r . '" cx="60" cy="60" fill="none" stroke="' . $c . '" stroke-width="16" stroke-dasharray="' . round(max(0, $len - $gap), 2) . ' ' . round($C, 2) . '" stroke-dashoffset="' . round(-$off, 2) . '" transform="rotate(-90 60 60)" data-tip="' . dash_e(($names[$k] ?? $k) . ' · ' . dash_fmt($v) . ' (' . $pct . '%)') . '"/>';
    $lg .= '<li><i style="background:' . $c . '"></i>' . dash_e($names[$k] ?? $k) . '<b>' . $pct . '%</b><small>' . dash_fmt($v) . '</small></li>';
    $off += $len; $i++;
  }
  return '<div class="dn"><svg viewBox="0 0 120 120" role="img" aria-label="частки">' . $arcs . '<text x="60" y="58" text-anchor="middle" class="dn-n">' . dash_fmt($sum) . '</text><text x="60" y="74" text-anchor="middle" class="ax">усього</text></svg><ul>' . $lg . '</ul></div>';
}
// година доби: послідовна шкала одного синього
function dash_hours(array $rows): string {
  $max = max(1, max($rows ?: [0])); $h = '<div class="hr">';
  for ($i = 0; $i < 24; $i++) {
    $v = (int)($rows[str_pad((string)$i, 2, '0', STR_PAD_LEFT)] ?? 0);
    $step = $v ? 1 + (int)min(5, floor($v / $max * 5.999)) : 0;
    $h .= '<span' . ($step ? ' style="background:' . DASH_SEQ[$step] . '"' : '') . ' data-tip="' . sprintf('%02d:00–%02d:59', $i, $i) . ' · ' . dash_fmt($v) . ' перегл."' . ($step >= 4 ? ' class="dk"' : (!$step ? ' class="z"' : '')) . '>' . ($i % 3 === 0 ? $i : '') . '</span>';
  }
  return $h . '</div><div class="hr-x"><span>00:00</span><span>12:00</span><span>23:00</span></div>';
}
function dash_table(array $days, array $cols): string {
  $h = '<details class="tv"><summary>Таблиця</summary><div class="tv-s"><table class="t"><thead><tr><th>День</th>';
  foreach ($cols as $c) $h .= '<th class="num">' . dash_e($c[0]) . '</th>';
  $h .= '</tr></thead><tbody>';
  foreach (array_reverse(array_keys($days)) as $i) { $h .= '<tr><td>' . dash_short($days[$i]) . '</td>'; foreach ($cols as $c) $h .= '<td class="num">' . dash_fmt((int)$c[1][$i]) . '</td>'; $h .= '</tr>'; }
  return $h . '</tbody></table></div></details>';
}

/* ---------- дані акаунтів ---------- */
function dash_by_day(array $days, array $ts): array {
  $idx = array_flip($days); $out = array_fill(0, count($days), 0);
  foreach ($ts as $t) { $d = hit_day((int)$t); if (isset($idx[$d])) $out[$idx[$d]]++; }
  return $out;
}
function dash_learning(array $days): array {
  $idx = array_flip($days); $active = array_fill(0, count($days), 0); $quiz = array_fill(0, count($days), 0); $tests = []; $who = [];
  $rows = q("SELECT user_id, k, v FROM kl_user_data WHERE k IN ('days', 'quizlog')")->fetchAll();
  foreach ($rows as $r) {
    $v = json_decode((string)$r['v'], true); if (!is_array($v)) continue;
    if ($r['k'] === 'days') { foreach ($v as $d) if (is_string($d) && isset($idx[$d])) { $active[$idx[$d]]++; $who[$r['user_id']] = 1; } continue; }
    foreach ($v as $q) {
      if (!is_array($q) || empty($q['date'])) continue;
      $t = strtotime((string)$q['date']); if (!$t) continue;
      $d = hit_day($t); if (!isset($idx[$d])) continue;
      $quiz[$idx[$d]]++;
      $name = mb_substr(preg_replace('/\s+/u', ' ', (string)($q['title'] ?? $q['key'] ?? '?')), 0, 60);
      $tests[$name] ??= [0, 0]; $tests[$name][0]++;
      $tests[$name][1] += !empty($q['total']) ? (int)$q['score'] / max(1, (int)$q['total']) : 0;
    }
  }
  uasort($tests, fn($a, $b) => $b[0] <=> $a[0]);
  return ['active' => $active, 'quiz' => $quiz, 'tests' => array_slice($tests, 0, 8, true), 'learners' => count($who)];
}
function dash_count_since(string $table, string $col, int $since): int {
  try { return (int)(one("SELECT COUNT(*) AS n FROM $table WHERE $col >= ?", [$since])['n'] ?? 0); } catch (Throwable $e) { return 0; }
}
// стрічка подій: реєстрації, відгуки, коментарі, подарунки, дії адміністраторів
function dash_feed(): array {
  $ev = [];
  foreach (q('SELECT id, name, created_at, verified_at FROM kl_users ORDER BY created_at DESC LIMIT 8')->fetchAll() as $u) $ev[] = [(int)$u['created_at'], '🆕', 'Новий акаунт: <a href="admin.php?p=user&amp;id=' . (int)$u['id'] . '">' . dash_e($u['name']) . '</a>' . ($u['verified_at'] ? '' : ' <small class="muted">· пошту не підтверджено</small>')];
  try { foreach (q('SELECT kind, text, created_at FROM kl_feedback ORDER BY created_at DESC LIMIT 5')->fetchAll() as $f) $ev[] = [(int)$f['created_at'], '💌', 'Відгук: <a href="admin.php?p=feedback">' . dash_e(mb_substr((string)$f['text'], 0, 70)) . '</a>']; } catch (Throwable $e) { /* ще немає */ }
  foreach (q('SELECT name, owner, text, created_at FROM kl_comments ORDER BY created_at DESC LIMIT 5')->fetchAll() as $c) $ev[] = [(int)$c['created_at'], '💬', dash_e($c['name']) . ' → <code>' . dash_e($c['owner']) . '</code>: ' . dash_e(mb_substr((string)$c['text'], 0, 60))];
  if (meta_get('gifts_v') === '1') foreach (q('SELECT g.item, g.created_at, a.name AS f, b.name AS t FROM kl_gifts g JOIN kl_users a ON a.id = g.from_id JOIN kl_users b ON b.id = g.to_id ORDER BY g.created_at DESC LIMIT 5')->fetchAll() as $g) $ev[] = [(int)$g['created_at'], '🎁', dash_e($g['f']) . ' подарував(ла) ' . dash_e($g['t']) . ' <code>' . dash_e($g['item']) . '</code>'];
  try { foreach (q('SELECT action, detail, at FROM kl_admin_log ORDER BY at DESC LIMIT 5')->fetchAll() as $a) $ev[] = [(int)$a['at'], '🔐', 'Адмін: ' . dash_e($a['action']) . ($a['detail'] !== '' ? ' <small class="muted">' . dash_e(mb_substr((string)$a['detail'], 0, 50)) . '</small>' : '')]; } catch (Throwable $e) { /* ще немає */ }
  usort($ev, fn($a, $b) => $b[0] <=> $a[0]);
  return array_slice($ev, 0, 14);
}

/* ---------- сторінка ---------- */
function dash_render(int $range): void {
  $range = in_array($range, [1, 7, 30, 90], true) ? $range : 30;   // 1 — «Сьогодні» (порівняння з учора)
  $days = hits_days($range); $prev = hits_days($range, $range);
  $since = strtotime($days[0] . ' 00:00:00 ' . HIT_TZ); $psince = strtotime($prev[0] . ' 00:00:00 ' . HIT_TZ);
  // 🧭 фільтр за платформою (iPhone, iPad, Android, Windows, Mac…) — діє на відвідувачів і перегляди
  $pf = (string)($_GET['pf'] ?? ''); if (!in_array($pf, HIT_PLATS, true)) $pf = '';
  $sfx = $pf !== '' ? '@' . $pf : '';
  $uv = hits_series($days, 'uv' . $sfx); $pv = hits_series($days, 'pv' . $sfx);
  $uvP = array_sum(hits_series($prev, 'uv' . $sfx)); $pvP = array_sum(hits_series($prev, 'pv' . $sfx));
  $regTs = q('SELECT created_at FROM kl_users WHERE created_at >= ?', [$psince])->fetchAll(PDO::FETCH_COLUMN);
  $reg = dash_by_day($days, $regTs); $regP = count(array_filter($regTs, fn($t) => (int)$t < $since));
  // один прохід по даних акаунтів за обидва періоди; поточний період — окремо (для «хто вчився» й тестів)
  $both = dash_learning(array_merge($prev, $days));
  $cur = dash_learning($days);
  $active = $cur['active']; $quiz = $cur['quiz'];
  $quizP = array_sum(array_slice($both['quiz'], 0, $range));
  $learnNow = $cur['learners'];
  $live = hits_live();
  $on = hits_enabled() && meta_get('hits_v') === '1';

  echo '<div class="dash-head"><div><h1>Огляд</h1><p class="muted">Відвідування рахує власний анонімний лічильник: без кук, IP не зберігається, Do Not Track поважається.</p></div>';
  echo '<nav class="seg" aria-label="Період">';
  foreach ([1 => 'Сьогодні', 7 => '7 днів', 30 => '30 днів', 90 => '90 днів'] as $r => $l) echo '<a href="admin.php?p=dash&amp;r=' . $r . ($pf !== '' ? '&amp;pf=' . $pf : '') . '"' . ($r === $range ? ' class="on" aria-current="page"' : '') . '>' . $l . '</a>';
  echo '</nav></div>';
  $PLAT_N = ['iphone' => '🍏 iPhone', 'ipad' => '🍏 iPad', 'android' => '🤖 Android', 'android-tab' => '🤖 Android-планшет', 'android-app' => '🤖 Застосунок Android',
    'windows' => '🪟 Windows', 'windows-app' => '🪟 Застосунок Windows', 'mac' => '🍎 Mac', 'linux' => '🐧 Linux', 'other' => '💻 Інше'];
  echo '<nav class="seg dash-pf" aria-label="Платформа"><a href="admin.php?p=dash&amp;r=' . $range . '"' . ($pf === '' ? ' class="on"' : '') . '>Усі пристрої</a>';
  foreach ($PLAT_N as $k => $l) echo '<a href="admin.php?p=dash&amp;r=' . $range . '&amp;pf=' . $k . '"' . ($k === $pf ? ' class="on" aria-current="page"' : '') . '>' . $l . '</a>';
  echo '</nav>' . ($pf !== '' ? '<p class="muted sub">Фільтр «' . dash_e($PLAT_N[$pf]) . '» діє на відвідувачів і перегляди; решта показників — для всіх. Дані за платформами збираються від 24.10.2026.</p>' : '');
  if (!hits_enabled()) echo '<div class="msg warn">📈 Лічильник відвідувань вимкнено в <a href="admin.php?p=system&amp;s=stats">Налаштуваннях</a> — нові відвідування не рахуються.</div>';
  elseif (!$on || !array_sum($pv)) echo '<div class="msg">📈 Лічильник щойно ввімкнено — відвідування з’являтимуться тут від сьогодні.</div>';

  $kpi = [
    ['Відвідувачі', array_sum($uv), $uvP, $uv, DASH_C[0], 'унікальні за кожен день'],
    ['Перегляди сторінок', array_sum($pv), $pvP, $pv, DASH_C[1], round(array_sum($pv) / max(1, array_sum($uv)), 1) . ' на відвідувача'],
    ['Нові акаунти', array_sum($reg), $regP, $reg, DASH_C[0], 'реєстрації'],
    ['Активні учні', $learnNow, null, $active, DASH_C[2], 'акаунти з навчанням'],
    ['Пройдено тестів', array_sum($quiz), $quizP, $quiz, DASH_C[1], 'в акаунтах'],
  ];
  echo '<div class="kpis"><div class="kpi live"><small>Зараз на сайті</small><b>' . dash_fmt($live) . '</b><span class="muted">за останні 5 хв</span><i class="pulse" aria-hidden="true"></i></div>';
  foreach ($kpi as [$label, $val, $p, $series, $c, $hint]) echo '<div class="kpi"><small>' . dash_e($label) . '</small><div class="kv-n"><b>' . dash_fmt((int)$val) . '</b>' . ($p !== null ? dash_delta((int)$val, (int)$p) : '') . '</div><span class="muted">' . dash_e($hint) . '</span>' . dash_spark($series, $c) . '</div>';
  echo '</div>';

  echo '<div class="dgrid">';
    if ($range === 1) {
    // ☀️ сьогодні: замість лінії з однієї точки — перегляди по годинах (час Осло)
    $hr = hits_group($days, 'hour:', 24); $hours = array_map(fn($i) => str_pad((string)$i, 2, '0', STR_PAD_LEFT), range(0, 23));
    echo '<section class="card span2"><h2>☀️ Сьогодні по годинах</h2><p class="muted sub">Перегляди сторінок за кожну годину (час Осло). Показники вгорі порівнюються з учорашнім днем.</p>'
      . dash_bars($hours, array_map(fn($h) => (int)($hr[$h] ?? 0), $hours), DASH_C[1], 'переглядів', fn($h) => $h . ':00') . '</section>';
  } else echo '<section class="card span2"><h2>👀 Відвідувачі й перегляди</h2>' . dash_line($days, [['Відвідувачі', DASH_C[0], $uv], ['Перегляди', DASH_C[1], $pv]], 'Відвідувачі й перегляди за днями')
    . dash_table($days, [['Відвідувачі', $uv], ['Перегляди', $pv], ['Нові акаунти', $reg], ['Тести', $quiz]]) . '</section>';
  $dev = hits_group($days, 'dev:'); $devN = ['mobile' => 'Телефон', 'desktop' => 'Комп’ютер', 'tablet' => 'Планшет', 'app' => 'Застосунок Android'];
  echo '<section class="card"><h2>📱 Пристрої</h2>' . dash_donut($dev, $devN) . '</section>';
  echo '<section class="card"><h2>🧭 Платформи</h2>' . (($pl = hits_group($days, 'plat:', 10)) ? dash_hbars($pl, DASH_C[0], fn($k) => $PLAT_N[$k] ?? $k) : '<p class="muted empty">Збирається від 24.10.2026.</p>')
    . '<h3 class="sub">🌐 Браузери</h3>' . (($bw = hits_group($days, 'br:', 8)) ? dash_hbars($bw, DASH_C[1], fn($k) => ['chrome' => 'Chrome', 'safari' => 'Safari', 'edge' => 'Edge', 'firefox' => 'Firefox', 'samsung' => 'Samsung Internet', 'opera' => 'Opera', 'webview' => 'Вбудований (застосунок)', 'other' => 'Інший'][$k] ?? $k) : '<p class="muted empty">—</p>') . '</section>';
  /* 📲 встановлення: один раз на пристрій, коли сайт уперше відкрили як застосунок (assets/hits.js) */
  $instN = ['android-app' => '🤖 Android · застосунок Google Play', 'android-home' => '🤖 Android · встановлено із сайту', 'ios-home' => '🍏 iPhone / iPad · на головний екран',
    'ios-app' => '🍏 iPhone · застосунок', 'windows-app' => '🪟 Windows · застосунок', 'windows-home' => '🪟 Windows · встановлено з браузера', 'mac-home' => '🍎 Mac · встановлено з браузера',
    'mac-app' => '🍎 Mac · застосунок', 'other-home' => '💻 Інше · із сайту', 'other-app' => '💻 Інше · застосунок'];
  $instP = hits_group($days, 'inst:', 12);
  $instAll = [];
  if (meta_get('hits_v') === '1') foreach (q("SELECT k, SUM(n) AS n FROM kl_hits WHERE k LIKE 'inst:%' GROUP BY k ORDER BY n DESC")->fetchAll() as $r) $instAll[substr($r['k'], 5)] = (int)$r['n'];
  $instTot = array_sum($instAll);
  echo '<section class="card"><h2>📲 Встановлення</h2><p class="muted sub">Рахуємо один раз на пристрій — коли сайт уперше відкрили як застосунок. За період: <b>' . dash_fmt(array_sum($instP)) . '</b> · за весь час: <b>' . dash_fmt($instTot) . '</b></p>'
    . ($instAll ? dash_hbars($instAll, DASH_C[2], fn($k) => ($instN[$k] ?? $k) . (isset($instP[$k]) ? ' · +' . $instP[$k] . ' за період' : '')) : '<p class="muted empty">Поки немає — лічильник почав рахувати з цієї версії.</p>') . '</section>';
  $nr = hits_group($days, 'new'); $rr = hits_group($days, 'ret'); $newV = (int)($nr[''] ?? 0); $retV = (int)($rr[''] ?? 0);
  echo '<section class="card"><h2>🔁 Нові й постійні</h2>' . dash_donut(array_filter(['new' => $newV, 'ret' => $retV]), ['new' => 'Уперше', 'ret' => 'Повернулися'])
    . '<h3 class="sub">🖥️ Система</h3>' . dash_hbars(hits_group($days, 'os:', 6), DASH_C[0], fn($k) => ['android' => 'Android', 'ios' => 'iOS', 'windows' => 'Windows', 'mac' => 'macOS', 'linux' => 'Linux', 'other' => 'Інша'][$k] ?? $k) . '</section>';
  echo '<section class="card"><h2>🆕 Нові акаунти</h2>' . dash_bars($days, $reg, DASH_C[0], 'реєстрацій') . '</section>';
  echo '<section class="card"><h2>🔥 Активні учні за день</h2>' . dash_bars($days, $active, DASH_C[2], 'учнів') . '</section>';
  echo '<section class="card"><h2>🧩 Пройдені тести за день</h2>' . dash_bars($days, $quiz, DASH_C[1], 'тестів') . '</section>';

  $secN = ['home' => '🏠 Головна', 'read' => '📖 Читання коміксів', 'quiz' => '🧩 Тести', 'words' => '📝 Слова', 'grammar' => '📐 Граматика', 'alphabet' => '🔤 Алфавіт', 'numbers' => '🔢 Числа', 'math' => '🧮 Математика', 'english' => '🇬🇧 Англійська', 'game' => '🎮 Гра разом', 'join' => '🎮 Вхід у гру', 'race' => '🏁 Логік-гонка', 'chess' => '♟ Шахи', 'call' => '📞 Дзвінок', 'cards' => '🃏 Картки', 'pairs' => '🧠 Пари', 'friends' => '👥 Друзі', 'players' => '🔎 Гравці', 'account' => '👤 Кабінет', 'avatar' => '🎨 Студія', 'login' => '🔑 Вхід', 'register' => '✍️ Реєстрація', 'plan' => '🗓 План', 'today' => '☀️ Сьогодні', 'tests' => '🧩 Каталог тестів', 'messages' => '✉️ Повідомлення', 'settings' => '⚙️ Налаштування', 'whatsnew' => '✨ Що нового', 'help' => '❓ Допомога', 'install' => '📲 Застосунок', 'rating' => '🏆 Рейтинг', 'write' => '✍️ Письмо', 'exam' => '🏁 Іспит', 'games' => '🎲 Ігри'];
  echo '<section class="card"><h2>🧭 Популярні розділи</h2>' . dash_hbars(hits_group($days, 'sec:', 10), DASH_C[0], fn($k) => $secN[$k] ?? $k) . '</section>';
  $titles = [];
  $cj = json_decode((string)@file_get_contents(__DIR__ . '/../data/comics.json'), true);
  foreach ((array)$cj as $c) if (is_array($c) && isset($c['id'])) $titles[$c['id']] = ($c['titleUk'] ?? $c['title'] ?? $c['id']);
  echo '<section class="card"><h2>📚 Популярні комікси</h2>' . dash_hbars(hits_group($days, 'comic:', 10), DASH_C[0], fn($k) => isset($titles[$k]) ? $titles[$k] . ' · ' . $k : $k) . '</section>';
  $refN = ['direct' => '🔗 Прямий / джерело приховане', 'google' => '🔎 Google', 'bing' => '🔎 Bing', 'duckduckgo' => '🦆 DuckDuckGo', 'facebook' => '📘 Facebook', 'instagram' => '📸 Instagram', 'x' => '𝕏 X / Twitter', 'youtube' => '▶️ YouTube', 'telegram' => '✈️ Telegram', 'whatsapp' => '💬 WhatsApp', 'chatgpt' => '🤖 ChatGPT', 'reddit' => '🟠 Reddit', 'linkedin' => '💼 LinkedIn', 'email' => '✉️ Email / розсилка', 'play' => '▶️ Google Play', 'bilohash' => '🌐 bilohash.com', 'other' => 'Інше'];
  $sources = hit_merge_sources(hits_group($days, 'ref:', 100));
  echo '<section class="card"><h2>🌐 Звідки приходять</h2><p class="muted sub">UTM-мітка має пріоритет, далі — адреса попередньої сторінки. Застосунки, які приховали джерело, входять у «Прямий».</p>' . dash_hbars($sources, DASH_C[0], fn($k) => $refN[$k] ?? $k) . '</section>';
  $langN = ['uk' => '🇺🇦 Українська', 'en' => '🇬🇧 English', 'no' => '🇳🇴 Norsk', 'ar' => '🇸🇦 العربية', 'de' => '🇩🇪 Deutsch', 'pl' => '🇵🇱 Polski', 'tr' => '🇹🇷 Türkçe', 'lt' => '🇱🇹 Lietuvių'];
  echo '<section class="card"><h2>🗣️ Мова інтерфейсу</h2>' . dash_hbars(hits_group($days, 'lang:', 8), DASH_C[0], fn($k) => $langN[$k] ?? $k) . '</section>';
  echo '<section class="card"><h2>🕐 Коли заходять</h2><p class="muted sub">Перегляди за годиною доби (час Осло), за весь період.</p>' . dash_hours(hits_group($days, 'hour:', 24)) . '</section>';

  // найпопулярніші тести
  $th = '<ul class="hb">';
  $tmax = max(1, ...array_values(array_map(fn($t) => $t[0], $cur['tests'] ?: [[1, 0]])));
  foreach ($cur['tests'] as $name => [$cnt, $sumPct]) $th .= '<li data-tip="' . dash_e($name . ' · ' . $cnt . ' спроб · середній результат ' . round($sumPct / max(1, $cnt) * 100) . '%') . '"><span class="hb-l">' . dash_e($name) . '</span><span class="hb-b"><i style="width:' . max(2, round($cnt / $tmax * 100)) . '%;background:' . DASH_C[1] . '"></i></span><b>' . $cnt . ' <small class="muted">· ' . round($sumPct / max(1, $cnt) * 100) . '%</small></b></li>';
  echo '<section class="card"><h2>🏅 Найпопулярніші тести</h2>' . (count($cur['tests']) ? $th . '</ul>' : '<p class="muted empty">Поки немає даних.</p>') . '</section>';

  // спільнота
  $comm = [['✉️', 'Повідомлень', dash_count_since('kl_messages', 'created_at', $since)], ['🎁', 'Подарунків', meta_get('gifts_v') === '1' ? dash_count_since('kl_gifts', 'created_at', $since) : 0],
    ['💬', 'Коментарів на стінах', dash_count_since('kl_comments', 'created_at', $since)], ['💌', 'Відгуків', dash_count_since('kl_feedback', 'created_at', $since)], ['📣', 'Листів надіслано', dash_count_since('kl_mailouts', 'sent_at', $since)]];
  echo '<section class="card"><h2>👥 Спільнота за період</h2><ul class="mini">';
  foreach ($comm as [$ic, $l, $v]) echo '<li><span>' . $ic . '</span>' . dash_e($l) . '<b>' . dash_fmt($v) . '</b></li>';
  $tot = fn(string $sql) => (int)(one($sql)['n'] ?? 0);
  echo '</ul><h3 class="sub">Акаунти загалом</h3><ul class="mini">'
    . '<li><span>👥</span>Усього<b>' . dash_fmt($tot('SELECT COUNT(*) n FROM kl_users')) . '</b></li>'
    . '<li><span>✅</span>Підтвердили пошту<b>' . dash_fmt($tot('SELECT COUNT(*) n FROM kl_users WHERE verified_at IS NOT NULL')) . '</b></li>'
    . '<li><span>🏅</span>Засновники (перші 100)<b>' . dash_fmt($tot('SELECT COUNT(*) n FROM kl_users WHERE founder IS NOT NULL')) . '</b></li>'
    . '<li><span>🔎</span>У каталозі гравців<b>' . dash_fmt($tot('SELECT COUNT(*) n FROM kl_players')) . '</b></li></ul></section>';

  echo '<section class="card span2"><h2>⚡ Останні події</h2><ul class="feed">';
  foreach (dash_feed() as [$t, $ic, $html]) echo '<li><span class="fi">' . $ic . '</span><div>' . $html . '</div><time>' . dash_e(when($t)) . '</time></li>';
  echo '</ul></section></div>';
}

/* Підказки й перехрестя. Текст — лише через textContent: назви приходять із даних. */
function dash_script(string $nonce): void {
  echo '<script nonce="' . dash_e($nonce) . '">(function(){'
    . 'var tip=document.createElement("div");tip.className="dtip";tip.hidden=true;document.body.appendChild(tip);'
    . 'function show(t,x,y){tip.textContent=t;tip.hidden=false;var w=tip.offsetWidth;tip.style.left=Math.max(8,Math.min(innerWidth-w-8,x-w/2))+"px";tip.style.top=(y-tip.offsetHeight-12+scrollY)+"px";}'
    . 'document.addEventListener("pointerover",function(e){var el=e.target.closest&&e.target.closest("[data-tip]");if(!el)return;var r=el.getBoundingClientRect();show(el.getAttribute("data-tip"),r.left+r.width/2,r.top);el.classList.add("hov");});'
    . 'document.addEventListener("pointerout",function(e){var el=e.target.closest&&e.target.closest("[data-tip]");if(el){el.classList.remove("hov");tip.hidden=true;}});'
    . 'document.querySelectorAll("svg.lc").forEach(function(svg){var d=JSON.parse(svg.getAttribute("data-chart")),g=d.g,n=d.x.length,pw=g.W-g.L-g.R,ph=g.H-g.T-g.B;'
    . 'var xh=svg.querySelector(".xh"),dots=svg.querySelector(".dots"),box=svg.parentNode.querySelector(".tip"),idx=-1;'
    . 'function X(i){return g.L+(n>1?i/(n-1)*pw:pw/2);}function Y(v){return g.T+ph-v/g.max*ph;}'
    . 'function at(i){idx=Math.max(0,Math.min(n-1,i));var x=X(idx);xh.setAttribute("x1",x);xh.setAttribute("x2",x);xh.setAttribute("visibility","visible");'
    . 'while(dots.firstChild)dots.removeChild(dots.firstChild);box.textContent="";var h=document.createElement("b");h.textContent=d.x[idx];box.appendChild(h);'
    . 'd.s.forEach(function(s){var c=document.createElementNS("http://www.w3.org/2000/svg","circle");c.setAttribute("cx",x);c.setAttribute("cy",Y(s.v[idx]));c.setAttribute("r",4.5);c.setAttribute("fill",s.c);c.setAttribute("stroke","#fff");c.setAttribute("stroke-width",2);dots.appendChild(c);'
    . 'var row=document.createElement("div"),k=document.createElement("i"),v=document.createElement("strong"),l=document.createElement("span");k.style.background=s.c;v.textContent=s.v[idx].toLocaleString("uk");l.textContent=" "+s.n;row.appendChild(k);row.appendChild(v);row.appendChild(l);box.appendChild(row);});'
    . 'box.hidden=false;var pct=x/g.W;box.style.left=(pct*100)+"%";box.style.transform="translateX("+(pct>.6?"-105%":"5%")+")";}'
    . 'function off(){idx=-1;xh.setAttribute("visibility","hidden");while(dots.firstChild)dots.removeChild(dots.firstChild);box.hidden=true;}'
    . 'svg.addEventListener("pointermove",function(e){var r=svg.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*g.W;at(Math.round((x-g.L)/pw*(n-1)));});'
    . 'svg.addEventListener("pointerleave",off);svg.addEventListener("blur",off);'
    . 'svg.addEventListener("keydown",function(e){if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();at((idx<0?n-1:idx)+(e.key==="ArrowRight"?1:-1));}});'
    . 'svg.addEventListener("focus",function(){at(n-1);});});})();</script>';
}

function dash_css(): string {
  return '<style>
.dash-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:.75rem;margin-bottom:1rem}.dash-head p{margin:0}
.dash-pf{flex-wrap:wrap;margin:6px 0 12px;display:flex!important}.seg{display:inline-flex;background:var(--paper);border:2px solid var(--edge);border-radius:11px;padding:3px;gap:3px;box-shadow:var(--shadow-sm)}.seg a{padding:.32rem .8rem;border-radius:8px;color:var(--text);text-decoration:none;font-weight:750;font-size:.86rem}.seg a:hover{background:var(--soft)}.seg a.on{background:var(--yellow);color:#15161c}
.kpis{display:grid;gap:.75rem;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin-bottom:1rem}
.kpi{position:relative;background:var(--paper);border:2px solid var(--edge);border-radius:var(--radius);box-shadow:var(--shadow);padding:.8rem .9rem .5rem;display:grid;gap:.1rem;overflow:hidden}
.kpi small{color:var(--muted);font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.05em}.kpi b{font:900 1.8rem/1.1 var(--f-cap);letter-spacing:-.01em}.kpi span.muted{font-size:.75rem}
.kpi .spark{width:100%;height:28px;margin-top:.25rem}.kv-n{display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap}.dl{font-size:.75rem;font-weight:700;color:var(--kl-muted);white-space:nowrap}.dl.up{color:#067a2f}.dl.down{color:#b42318}
.kpi.live{background:linear-gradient(135deg,var(--info-bg),var(--paper))}.pulse{position:absolute;top:.95rem;right:.9rem;width:10px;height:10px;border-radius:50%;background:#0ca30c;box-shadow:0 0 0 0 rgba(12,163,12,.5);animation:pl 1.8s infinite}
@keyframes pl{70%{box-shadow:0 0 0 9px rgba(12,163,12,0)}100%{box-shadow:0 0 0 0 rgba(12,163,12,0)}}
.dgrid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(min(330px,100%),1fr));align-items:start}.dgrid .card{margin:0}.dgrid .card h2{display:flex;align-items:center;gap:.4rem}.dgrid .span2{grid-column:1/-1}
.card h3.sub,.card p.sub{margin:.9rem 0 .4rem;font-size:.86rem}.empty{margin:.5rem 0}
.lg{display:flex;flex-wrap:wrap;gap:.4rem 1rem;font-size:.85rem;margin-bottom:.35rem}.lg i{display:inline-block;width:14px;height:3px;border-radius:2px;vertical-align:middle;margin-right:.35rem}.lg b{font-weight:700}
.lc-wrap{position:relative}.lc,.bc{width:100%;height:auto;display:block;overflow:visible}.lc:focus{outline:2px solid var(--bs-primary);outline-offset:4px;border-radius:6px}
.gl{stroke:var(--track);stroke-width:1}.ax{fill:var(--muted);font-size:11px}.xh{stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3}
.tip{position:absolute;top:8px;pointer-events:none;background:var(--paper);color:var(--text);border:2px solid var(--edge);box-shadow:var(--shadow-sm);border-radius:8px;padding:.45rem .6rem;font-size:.8rem;min-width:130px;z-index:3}
.tip b{display:block;color:var(--kl-muted);font-weight:600;margin-bottom:.15rem}.tip div{display:flex;align-items:center;gap:.35rem}.tip i{width:12px;height:3px;border-radius:2px}.tip strong{font-weight:700}.tip span{color:var(--kl-muted)}
.bc .bh:hover,.bc .bh.hov{fill:rgba(0,0,0,.04)}
.dtip{position:absolute;z-index:50;pointer-events:none;background:#1f2328;color:#fff;font-size:.78rem;padding:.3rem .55rem;border-radius:6px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.2)}
.hb{list-style:none;margin:0;padding:0;display:grid;gap:.35rem}.hb li{display:grid;grid-template-columns:minmax(0,42%) minmax(0,1fr) auto;align-items:center;gap:.5rem;font-size:.85rem;padding:.1rem .2rem;border-radius:6px}.hb li.hov,.hb li:hover{background:var(--soft)}
.hb-l{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hb-b{height:10px;background:var(--track);border-radius:5px;overflow:hidden}.hb-b i{display:block;height:100%;border-radius:0 4px 4px 0}.hb b{font-weight:700;font-variant-numeric:tabular-nums}
.dn{display:flex;align-items:center;gap:1rem;flex-wrap:wrap}.dn svg{width:132px;height:132px;flex:none}.dn circle:hover,.dn circle.hov{stroke-width:19}.dn-n{font-size:19px;font-weight:800;fill:var(--text)}
.dn ul{list-style:none;margin:0;padding:0;display:grid;gap:.35rem;font-size:.85rem;flex:1;min-width:170px}.dn li{display:grid;grid-template-columns:12px 1fr auto auto;align-items:center;gap:.45rem}.dn li i{width:12px;height:12px;border-radius:3px}.dn li small{color:var(--kl-muted);min-width:2.5em;text-align:right}
.hr{display:grid;grid-template-columns:repeat(24,1fr);gap:2px}.hr span{aspect-ratio:1/1.3;border-radius:4px;font-size:10px;display:grid;place-items:end center;padding-bottom:2px;color:#3b4250}.hr span.z{background:var(--track);color:var(--muted)}.hr span.dk{color:#fff}.hr span.hov{outline:2px solid #1f2328}
.hr-x{display:flex;justify-content:space-between;font-size:11px;color:#6b7480;margin-top:.25rem}
.mini{list-style:none;margin:0;padding:0;display:grid;gap:.15rem}.mini li{display:grid;grid-template-columns:1.6rem 1fr auto;align-items:center;padding:.35rem 0;border-bottom:1px solid var(--kl-line);font-size:.88rem}.mini li:last-child{border:0}.mini b{font-variant-numeric:tabular-nums}
.feed{list-style:none;margin:0;padding:0;display:grid}.feed li{display:grid;grid-template-columns:2rem minmax(0,1fr) auto;gap:.5rem;align-items:start;padding:.5rem 0;border-bottom:1px solid var(--kl-line);font-size:.88rem}.feed li:last-child{border:0}.feed time{color:var(--kl-muted);font-size:.78rem;white-space:nowrap}.fi{font-size:1.05rem;text-align:center}
.tv{margin-top:.6rem}.tv summary{cursor:pointer;color:var(--kl-muted);font-size:.85rem}.tv-s{max-height:320px;overflow:auto;margin-top:.4rem}.tv .num{text-align:right;font-variant-numeric:tabular-nums}
@media (max-width:576px){.kpis{grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem}.kpi{padding:.6rem .65rem .4rem}.kpi.live{grid-column:1/-1}.kpi small{font-size:.66rem}.kpi span.muted{font-size:.68rem}.kpi b{font-size:1.3rem}.hb li{grid-template-columns:minmax(0,48%) minmax(0,1fr) auto}.feed li{grid-template-columns:1.6rem minmax(0,1fr)}.feed time{grid-column:2}}
@media (prefers-reduced-motion:reduce){.pulse{animation:none}}
</style>';
}
