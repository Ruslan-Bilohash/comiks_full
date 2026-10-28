<?php
/* Комікс·Lab — 🩺 сторінка «Діагностика» в адмінці (підключає admin.php).
 * Вкладки: 📋 Огляд (головне на одному екрані), 🔌 API і служби (живі перевірки кнопкою),
 * 📜 Журнали (помилки PHP з журналу хостингу + помилки JavaScript із браузерів), 🛡 Безпека
 * (2FA, входи, цілісність файлів, сертифікат, журнал дій), ✅ Усі перевірки (повний прогін).
 * Секретів сторінка не показує: лише «задано / дійсний / ні». */
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(404); exit; }
require_once __DIR__ . '/diag.php';
require_once __DIR__ . '/admin-dash.php';

const DIAG_ICON = [DIAG_OK => '✅', DIAG_WARN => '⚠️', DIAG_BAD => '⛔', DIAG_SKIP => '➖'];
const DIAG_PILL = [DIAG_OK => 'g', DIAG_WARN => 'y', DIAG_BAD => 'r', DIAG_SKIP => ''];
const DIAG_TABS = ['overview' => '📋 Огляд', 'api' => '🔌 API і служби', 'logs' => '📜 Журнали', 'security' => '🛡 Безпека', 'checks' => '✅ Усі перевірки'];

function diag_ago(int $t): string {
  if ($t <= 0) return '—';
  $d = max(0, time() - $t);
  return $d < 60 ? 'щойно' : ($d < 3600 ? intdiv($d, 60) . ' хв тому' : ($d < 86400 ? intdiv($d, 3600) . ' год тому' : intdiv($d, 86400) . ' дн. тому'));
}
function diag_li(array $i): string {
  return '<li class="d-' . e($i['level']) . '"><span class="d-ic">' . DIAG_ICON[$i['level']] . '</span><div><b>' . e($i['title']) . '</b> <span class="pill ' . DIAG_PILL[$i['level']] . '">' . e($i['value']) . '</span>'
    . ($i['fix'] !== '' ? '<br><small class="muted">' . e($i['fix']) . '</small>' : '') . '</div></li>';
}
function diag_count(array $items): array {
  $n = [DIAG_OK => 0, DIAG_WARN => 0, DIAG_BAD => 0, DIAG_SKIP => 0];
  foreach ($items as $i) $n[$i['level']]++;
  return $n;
}

function diag_page(string $tab, string $nonce): void {
  $tab = isset(DIAG_TABS[$tab]) ? $tab : 'overview';
  echo dash_css() . diag_css();
  echo '<div class="dash-head"><div><h1>Діагностика</h1><p class="muted">Стан сайту, зв’язок зі службами, журнали помилок і безпека. Секрети тут не показуються — лише «задано / дійсний».</p></div>'
    . '<nav class="seg dg-tabs" aria-label="Розділи діагностики">';
  foreach (DIAG_TABS as $k => $l) echo '<a href="admin.php?p=diag&amp;tab=' . $k . '"' . ($k === $tab ? ' class="on" aria-current="page"' : '') . '>' . $l . '</a>';
  echo '</nav></div>';
  match ($tab) {
    'api' => diag_tab_api(),
    'logs' => diag_tab_logs(),
    'security' => diag_tab_security(),
    'checks' => diag_tab_checks(),
    default => diag_tab_overview(),
  };
  dash_script($nonce);
  diag_script($nonce);
}

/* ───────────── 📋 Огляд ───────────── */
function diag_tab_overview(): void {
  $t0 = microtime(true);
  $d = diag_run();
  $integ = diag_integrity(); $tls = diag_tls_days();
  $more = diag_security_more($integ, $tls);
  $all = [];
  foreach ($d['groups'] as $g) foreach ($g['items'] as $i) $all[] = $i + ['group' => $g['title']];
  foreach ($more as $i) $all[] = $i + ['group' => '🛡 Безпека'];
  $c = diag_count($all);
  $sd = diag_sec_days(30);
  $log = diag_server_log(time() - 86400);
  $pings = []; foreach (array_keys(DIAG_SERVICES) as $s) if ($p = diag_ping_last($s)) $pings[$s] = $p;
  $pc = diag_count(array_map(fn($p) => ['level' => $p['l']], $pings));
  $logBad = count(array_filter($log['groups'], fn($g) => $g['level'] === DIAG_BAD));

  $tone = $c[DIAG_BAD] ? 'err' : ($c[DIAG_WARN] ? 'warn' : 'ok');
  echo '<div class="msg ' . $tone . '">' . ($c[DIAG_BAD] ? '⛔ Серйозних проблем: ' . $c[DIAG_BAD] . ' — їх видно нижче, з підказкою, що робити.' : ($c[DIAG_WARN] ? '⚠️ Працює, але є ' . $c[DIAG_WARN] . ' зауважень.' : '✅ Усе гаразд — сайт розгорнуто правильно.'))
    . ' <small class="muted">' . $c[DIAG_OK] . ' перевірок пройдено · ' . (int)round((microtime(true) - $t0) * 1000) . ' мс</small></div>';

  $kpi = [
    ['Збої сервера (500)', diag_sec_sum($sd, 'server', 1), 'за 24 години', $sd['by']['server'] ?? [], DASH_C[1], 'logs'],
    ['Помилки в журналі PHP', $log['total'], $logBad ? $logBad . ' критичних за 24 год' : 'за 24 години', [], DASH_C[1], 'logs'],
    ['Помилки JavaScript', diag_sec_sum($sd, 'js', 1), 'у браузерах за 24 год', $sd['by']['js'] ?? [], DASH_C[5], 'logs'],
    ['Невдалі входи', diag_sec_sum($sd, 'wrong', 1), 'паролі й коди за 24 год', $sd['by']['wrong'] ?? [], DASH_C[0], 'security'],
  ];
  echo '<div class="kpis">';
  foreach ($kpi as [$label, $val, $hint, $by, $col, $to]) {
    $series = array_map(fn($day) => (int)($by[$day] ?? 0), $sd['days']);
    echo '<a class="kpi dg-kpi" href="admin.php?p=diag&amp;tab=' . $to . '"><small>' . e($label) . '</small><div class="kv-n"><b>' . dash_fmt((int)$val) . '</b></div><span class="muted">' . e($hint) . '</span>' . ($by ? dash_spark(array_slice($series, -14), $col) : '') . '</a>';
  }
  echo '<a class="kpi dg-kpi" href="admin.php?p=diag&amp;tab=api"><small>API і служби</small><div class="kv-n"><b>' . ($pings ? $pc[DIAG_OK] . '/' . count($pings) : '—') . '</b>'
    . ($pc[DIAG_BAD] ? '<span class="dl down">' . $pc[DIAG_BAD] . ' не працює</span>' : '') . '</div><span class="muted">' . ($pings ? 'працюють · перевірено ' . e(diag_ago(max(array_column($pings, 'at')))) : 'ще не перевіряли — відкрийте вкладку') . '</span></a>';
  echo '<a class="kpi dg-kpi" href="admin.php?p=diag&amp;tab=security"><small>SSL-сертифікат</small><div class="kv-n"><b>' . ($tls === null ? '—' : $tls) . '</b></div><span class="muted">' . ($tls === null ? 'не перевірено (локально)' : 'днів до заміни') . '</span></a>';
  echo '</div>';

  // що потребує уваги: усі ⛔ і ⚠️ одним списком + критичні рядки журналу й служби, що впали
  $todo = array_values(array_filter($all, fn($i) => in_array($i['level'], [DIAG_BAD, DIAG_WARN], true)));
  usort($todo, fn($a, $b) => ($a['level'] === DIAG_BAD ? 0 : 1) <=> ($b['level'] === DIAG_BAD ? 0 : 1));
  foreach ($pings as $s => $p) if (in_array($p['l'], [DIAG_BAD, DIAG_WARN], true)) $todo[] = ['title' => DIAG_SERVICES[$s][0], 'level' => $p['l'], 'value' => $p['v'], 'fix' => 'Деталі й повторна перевірка — у вкладці «API і служби».'];
  foreach (array_slice(array_filter($log['groups'], fn($g) => $g['level'] === DIAG_BAD), 0, 3) as $g) $todo[] = ['title' => 'Журнал PHP: ' . $g['n'] . '× за добу', 'level' => DIAG_BAD, 'value' => mb_substr($g['msg'], 0, 110), 'fix' => $g['hint'] ?: 'Подробиці — у вкладці «Журнали».'];
  echo '<div class="dgrid"><section class="card span2"><h2>🎯 Що потребує уваги</h2>' . ($todo ? '<ul class="diag">' . implode('', array_map('diag_li', $todo)) . '</ul>' : '<p class="muted">Нічого — усе зелене. 🎉</p>') . '</section>';

  $days = $sd['days'];
  $ser = fn(string $k) => array_map(fn($day) => (int)($sd['by'][$k][$day] ?? 0), $days);
  $lim = array_map(fn($a, $b) => $a + $b, $ser('slow_down'), $ser('csrf'));
  echo '<section class="card span2"><h2>📈 Збої й підозрілі події за 30 днів</h2>'
    . dash_line($days, [['Збої сервера', DASH_C[1], $ser('server')], ['Помилки JavaScript', DASH_C[5], $ser('js')], ['Невдалі входи', DASH_C[0], $ser('wrong')], ['Ліміти й CSRF', DASH_C[3], $lim]], 'Збої й підозрілі події за днями')
    . dash_table($days, [['Збої сервера', $ser('server')], ['Помилки JS', $ser('js')], ['Невдалі входи', $ser('wrong')], ['Ліміти й CSRF', $lim]])
    . '<p class="muted sub">Лічимо лише кількість за день — без IP і без людей. Дані почали збиратися з цієї версії.</p></section></div>';
}

/* ───────────── 🔌 API і служби ───────────── */
function diag_tab_api(): void {
  echo '<section class="card"><div class="dg-row"><h2>🌍 Зовнішні служби</h2><button type="button" class="btn pri" data-ping-all>🔄 Перевірити все</button></div>'
    . '<p class="muted">Справжні, але безкоштовні запити: список моделей замість генерації, вхід у скриньку без листа, перевірка ключів Google без входу, баланс Stripe. Ключі не показуються.</p>'
    . '<table class="t dg-svc"><thead><tr><th>Служба</th><th>Стан</th><th>Час</th><th>Перевірено</th><th></th></tr></thead><tbody>';
  foreach (DIAG_SERVICES as $s => [$title, $hint]) {
    $p = diag_ping_last($s);
    $lv = $p['l'] ?? '';
    echo '<tr data-svc="' . e($s) . '"><td><b>' . e($title) . '</b><small class="muted">' . e($hint) . '</small></td>'
      . '<td class="dg-st">' . ($p ? DIAG_ICON[$lv] . ' <span class="pill ' . DIAG_PILL[$lv] . '">' . e($p['v']) . '</span>' : '<span class="muted">ще не перевіряли</span>') . '<small class="dg-fix muted"></small></td>'
      . '<td class="dg-ms">' . ($p && $p['ms'] ? (int)$p['ms'] . ' мс' : '—') . '</td><td class="dg-at">' . ($p ? e(diag_ago((int)$p['at'])) : '—') . '</td>'
      . '<td><button type="button" class="btn sm" data-ping="' . e($s) . '">Перевірити</button></td></tr>';
  }
  echo '</tbody></table></section>';

  $eps = diag_endpoints();
  $bad = count(array_filter($eps, fn($x) => $x['level'] === DIAG_BAD));
  echo '<section class="card"><h2>🧩 Адреси API сайту' . ($bad ? ' <span class="pill r">' . $bad . '</span>' : '') . '</h2>'
    . '<p class="muted">Кожну адресу щойно відкрито ззовні, як це робить браузер учня. Нормально — будь-який код до 500, крім 404: «401 без входу» чи «405 на GET» означають, що файл на місці й PHP його виконав.</p>';
  if (!$eps) echo '<p class="msg warn">На сервері немає cURL — перевірити неможливо.</p>';
  else {
    echo '<table class="t"><thead><tr><th>Адреса</th><th>Що робить</th><th>Код</th><th>Час</th><th>Стан</th></tr></thead><tbody>';
    foreach ($eps as $x) echo '<tr><td><code>' . e($x['path']) . '</code></td><td>' . e($x['title']) . '</td><td>' . ($x['code'] ?: '—') . '</td><td>' . (int)$x['ms'] . ' мс</td><td>' . DIAG_ICON[$x['level']] . ' ' . e($x['note'] ?: 'працює') . '</td></tr>';
    $avg = (int)round(array_sum(array_column($eps, 'ms')) / max(1, count($eps)));
    echo '</tbody></table><p class="muted sub">Середній час відповіді: ' . $avg . ' мс (разом із дорогою через CDN хостингу).</p>';
  }
  echo '</section>';
  echo '<section class="card"><h2>⚙️ Налаштування служб</h2><ul class="diag">' . implode('', array_map('diag_li', diag_services())) . '</ul></section>';
}

/* ───────────── 📜 Журнали ───────────── */
function diag_tab_logs(): void {
  $range = (int)($_GET['r'] ?? 7); $range = in_array($range, [1, 7, 30], true) ? $range : 7;
  $log = diag_server_log(time() - $range * 86400);
  echo '<section class="card"><div class="dg-row"><h2>🐘 Помилки PHP на сервері</h2><nav class="seg">';
  foreach ([1 => '24 год', 7 => '7 днів', 30 => '30 днів'] as $r => $l) echo '<a href="admin.php?p=diag&amp;tab=logs&amp;r=' . $r . '"' . ($r === $range ? ' class="on"' : '') . '>' . $l . '</a>';
  echo '</nav></div>';
  if ($log['file'] === '') echo '<p class="msg warn">Журнал помилок хостингу не знайдено або PHP не має права його читати. На Hostinger він лежить у ~/.logs/error_log_&lt;домен&gt;.</p>';
  else {
    echo '<p class="muted">Журнал хостингу (<code>' . e(basename($log['file'])) . '</code>, лише рядки Комікс·Lab). Однакові помилки згорнуто, шляхи скорочено, пошти й токени приховано. Записів за період: <b>' . $log['total'] . '</b>.</p>';
    if (!$log['groups']) echo '<p class="muted">За цей період помилок немає. 🎉</p>';
    else {
      echo '<table class="t dg-log"><thead><tr><th></th><th>Помилка</th><th>Разів</th><th>Остання</th><th>Перша</th></tr></thead><tbody>';
      foreach (array_slice($log['groups'], 0, 80) as $g) echo '<tr class="d-' . $g['level'] . '"><td>' . DIAG_ICON[$g['level']] . '</td><td><code class="dg-msg">' . e($g['msg']) . '</code>' . ($g['hint'] ? '<small class="dg-hint">💡 ' . e($g['hint']) . '</small>' : '') . '</td><td><b>' . $g['n'] . '</b></td><td>' . e(date('d.m H:i', $g['last'])) . '<small class="muted">' . e(diag_ago($g['last'])) . '</small></td><td>' . e(date('d.m H:i', $g['first'])) . '</td></tr>';
      echo '</tbody></table>';
    }
  }
  echo '</section>';

  foreach (['js' => ['🌐 Помилки JavaScript у браузерах і застосунку', 'Збирає assets/boot.js: текст помилки, файл і рядок, розділ сайту, версія збірки, «браузер · система». Без IP і без людей; до 5 різних помилок зі сторінки, зберігаються 30 днів.'],
            'php' => ['🧯 Необроблені винятки API', 'Те, через що учень побачив «помилку сервера» (500): клас винятку, файл і рядок, адреса API. Збої самої бази сюди не потрапляють — вони в журналі хостингу вище.']] as $kind => [$title, $hint]) {
    $rows = diag_errors($kind);
    echo '<section class="card"><div class="dg-row"><h2>' . $title . ($rows ? ' <span class="pill">' . count($rows) . '</span>' : '') . '</h2>'
      . ($rows ? '<form method="post" action="admin.php?p=diag&amp;tab=logs" data-confirm="Очистити весь цей журнал?">' . admin_csrf_input() . '<input type="hidden" name="do" value="err_fixed"><input type="hidden" name="kind" value="' . $kind . '"><button class="btn sm">🧹 Очистити все</button></form>' : '')
      . '</div><p class="muted">' . e($hint) . '</p>';
    if (!$rows) echo '<p class="muted">Помилок немає. 🎉</p>';
    else {
      echo '<table class="t dg-log"><thead><tr><th>Помилка</th><th>Де</th><th>Разів</th><th>Остання</th><th></th></tr></thead><tbody>';
      foreach ($rows as $r) {
        echo '<tr><td><code class="dg-msg">' . e($r['msg']) . '</code>'
          . ($r['stack'] !== '' ? '<details class="dg-stack"><summary>стек</summary><pre>' . e($r['stack']) . '</pre></details>' : '') . '</td>'
          . '<td><code>' . e($r['src'] . ($r['line'] ? ':' . $r['line'] : '')) . '</code>' . ($r['page'] !== '' ? '<small class="muted">' . e($r['page']) . '</small>' : '')
          . ($r['env'] !== '' || $r['ver'] !== '' ? '<small class="muted">' . e(trim($r['env'] . ($r['ver'] !== '' ? ' · ' . $r['ver'] : ''))) . '</small>' : '') . '</td>'
          . '<td><b>' . (int)$r['n'] . '</b></td><td>' . e(diag_ago((int)$r['last_at'])) . '<small class="muted">з ' . e(date('d.m', (int)$r['first_at'])) . '</small></td>'
          . '<td><form method="post" action="admin.php?p=diag&amp;tab=logs" data-ajax data-done="remove">' . admin_csrf_input() . '<input type="hidden" name="do" value="err_fixed"><input type="hidden" name="kind" value="' . $kind . '"><input type="hidden" name="hash" value="' . e($r['hash']) . '"><button class="btn sm" title="Прибрати з журналу — якщо повториться, з’явиться знову">✓ Виправлено</button></form></td></tr>';
      }
      echo '</tbody></table>';
    }
    echo '</section>';
  }

  // пошта: останні збої розсилок і службових листів
  $mails = [];
  try { $mails = q("SELECT r.email, r.error, r.updated_at, c.title FROM kl_mail_recipients r JOIN kl_mail_campaigns c ON c.id = r.campaign_id WHERE r.status = 'failed' ORDER BY r.updated_at DESC LIMIT 10")->fetchAll(); } catch (Throwable $e) {}
  $lastAuth = meta_get('auth_mail_last_failure');
  echo '<section class="card"><h2>✉️ Збої пошти</h2>';
  if ($lastAuth !== '') echo '<p><b>Службові листи</b> (вхід, підтвердження): останній збій ' . e(diag_ago((int)meta_get('auth_mail_failure_at'))) . ' — <code>' . e(mb_substr($lastAuth, 0, 200)) . '</code></p>';
  if ($mails) {
    echo '<table class="t"><thead><tr><th>Кампанія</th><th>Кому</th><th>Помилка</th><th>Коли</th></tr></thead><tbody>';
    foreach ($mails as $m) echo '<tr><td>' . e($m['title']) . '</td><td>' . e($m['email']) . '</td><td><small>' . e(mb_substr((string)$m['error'], 0, 160)) . '</small></td><td>' . e(diag_ago((int)$m['updated_at'])) . '</td></tr>';
    echo '</tbody></table>';
  } elseif ($lastAuth === '') echo '<p class="muted">Збоїв не було. 🎉</p>';
  echo '</section>';
}

/* ───────────── 🛡 Безпека ───────────── */
function diag_tab_security(): void {
  $integ = diag_integrity();
  $items = array_merge(diag_security(), diag_security_more($integ), diag_exposure());
  $c = diag_count($items);
  $score = (int)round($c[DIAG_OK] / max(1, $c[DIAG_OK] + $c[DIAG_WARN] + $c[DIAG_BAD]) * 100);
  $sd = diag_sec_days(14);
  echo '<div class="kpis"><div class="kpi"><small>Оцінка безпеки</small><div class="kv-n"><b>' . $score . '%</b></div><span class="muted">' . $c[DIAG_OK] . ' гаразд · ' . $c[DIAG_WARN] . ' зауважень · ' . $c[DIAG_BAD] . ' проблем</span></div>';
  foreach (['wrong' => 'Невдалі входи', 'csrf' => 'Чужі запити (CSRF)', 'slow_down' => 'Ліміти частоти', 'captcha' => 'Неправильна капча'] as $k => $l)
    echo '<div class="kpi"><small>' . e($l) . '</small><div class="kv-n"><b>' . dash_fmt(diag_sec_sum($sd, $k, 1)) . '</b></div><span class="muted">за 24 год · ' . dash_fmt(diag_sec_sum($sd, $k, 14)) . ' за 14 днів</span>' . dash_spark(array_map(fn($d) => (int)($sd['by'][$k][$d] ?? 0), $sd['days']), DASH_C[0]) . '</div>';
  echo '</div>';

  echo '<div class="dgrid"><section class="card span2"><h2>🔒 Перевірки безпеки</h2><ul class="diag">';
  $sorted = $items; usort($sorted, fn($a, $b) => array_search($a['level'], [DIAG_BAD, DIAG_WARN, DIAG_OK, DIAG_SKIP], true) <=> array_search($b['level'], [DIAG_BAD, DIAG_WARN, DIAG_OK, DIAG_SKIP], true));
  echo implode('', array_map('diag_li', $sorted)) . '</ul></section>';

  echo '<section class="card"><h2>👮 Команда й другий фактор</h2><table class="t"><thead><tr><th>Хто</th><th>2FA</th><th>Останній вхід</th><th>Сесій</th></tr></thead><tbody>';
  foreach (diag_staff() as $u) echo '<tr><td><a href="admin.php?p=user&amp;id=' . (int)$u['id'] . '"><b>' . e($u['name']) . '</b></a><small class="muted">' . (!empty($u['is_admin']) ? 'адміністратор' : 'модератор') . (!empty($u['blocked_at']) ? ' · заблоковано' : '') . '</small></td>'
    . '<td>' . (totp_on($u) ? '✅ так' : '<span class="pill r">⛔ ні</span>') . '</td><td>' . e(diag_ago((int)$u['last_login'])) . '</td><td>' . (int)$u['sessions'] . '</td></tr>';
  echo '</tbody></table></section>';

  $tot = fn(string $k) => array_sum(array_map(fn($d) => (int)($sd['by'][$k][$d] ?? 0), $sd['days']));
  echo '<section class="card"><h2>📊 Події за 14 днів</h2><ul class="mini">';
  foreach (DIAG_SEC_KEYS as $k => [$label]) echo '<li><span>' . ($tot($k) ? '•' : '·') . '</span>' . e($label) . '<b>' . dash_fmt($tot($k)) . '</b></li>';
  echo '</ul><p class="muted sub">Лише кількість за день, без IP і без людей.</p></section>';

  if ($integ['ok'] === false) {
    echo '<section class="card span2"><h2>🧬 Файли, що не збігаються зі збіркою</h2><p class="muted">Збірка ' . e($integ['version']) . ' від ' . e($integ['built']) . '. Змінений файл або PHP, якого немає у збірці, — саме так виглядає підкинутий «бекдор». Якщо ви їх не змінювали — видаліть чужі й перезалийте збірку.</p><ul class="diag">';
    foreach ($integ['changed'] as $f) echo diag_li(diag_item($f, DIAG_BAD, 'змінено після збірки'));
    foreach ($integ['unknown'] as $f) echo diag_li(diag_item($f, $f === 'api/config.local.php' ? DIAG_WARN : DIAG_BAD, $f === 'api/config.local.php' ? 'локальний конфіг — серверу не потрібен' : 'немає у збірці'));
    echo '</ul></section>';
  }

  $labels = ['login' => '🔓 Вхід', 'login_fail' => '⛔ Невдалий вхід', 'reauth_fail' => '⛔ Невдале підтвердження', 'google_save' => '🔑 Ключі Google змінено', 'google_enable' => '🔑 Google увімкнено', 'google_disable' => '🔑 Google вимкнено',
    'google_verified' => '✅ Ключі Google перевірено', 'google_verify_start' => '🔑 Перевірка Google', 'google_callback_fail' => '⚠️ Збій входу Google', 'google_verify_fail' => '⚠️ Перевірка Google не пройшла',
    'hits_on' => '📈 Лічильник увімкнено', 'hits_off' => '📈 Лічильник вимкнено', 'hits_clear' => '📈 Статистику очищено', 'errors_clear' => '🧹 Журнал помилок очищено', 'tester_created' => '🧪 Акаунт тестувальника'];
  echo '<section class="card span2"><h2>🧾 Журнал дій адміністраторів</h2><table class="t"><thead><tr><th>Коли</th><th>Хто</th><th>Що</th><th>Подробиці</th><th>Звідки</th></tr></thead><tbody>';
  foreach (diag_admin_log(40) as $l) {
    $bad = str_contains((string)$l['action'], 'fail');
    echo '<tr' . ($bad ? ' class="d-warn"' : '') . '><td>' . e(date('d.m H:i', (int)$l['at'])) . '<small class="muted">' . e(diag_ago((int)$l['at'])) . '</small></td><td>' . e($l['name'] ?? '—') . '</td><td>' . e($labels[$l['action']] ?? $l['action']) . '</td><td><small>' . e($l['detail']) . '</small></td>'
      . '<td><small class="muted" title="Згортка IP — сама адреса не зберігається">#' . e(substr((string)$l['ip_hash'], 0, 6)) . '</small></td></tr>';
  }
  echo '</tbody></table><p class="muted sub">«Звідки» — короткий відбиток IP: однаковий відбиток = той самий пристрій чи мережа. Сама адреса не зберігається.</p></section></div>';
}

/* ───────────── ✅ Усі перевірки ───────────── */
function diag_tab_checks(): void {
  $d = diag_run();
  $c = $d['count'];
  echo '<div class="msg ' . ($c[DIAG_BAD] ? 'err' : ($c[DIAG_WARN] ? 'warn' : 'ok')) . '">' . ($c[DIAG_BAD] ? '⛔ Знайдено ' . $c[DIAG_BAD] . ' серйозних проблем.' : ($c[DIAG_WARN] ? '⚠️ Працює, але ' . $c[DIAG_WARN] . ' зауважень варто прибрати.' : '✅ Усе гаразд — сайт розгорнуто правильно.'))
    . ' <small class="muted">' . $c[DIAG_OK] . ' гаразд · перевірка ' . $d['ms'] . ' мс</small></div>'
    . '<p><a class="btn pri" href="admin.php?p=diag&amp;tab=checks">🔄 Перевірити ще раз</a> <a class="btn" href="api/health.php?key=' . health_key() . '" target="_blank" rel="noopener">🩺 health.php</a></p>';
  foreach ($d['groups'] as $g) {
    $bad = count(array_filter($g['items'], fn($i) => $i['level'] === DIAG_BAD));
    echo '<div class="card"><h2>' . e($g['title']) . ($bad ? ' <span class="pill r">' . $bad . '</span>' : '') . '</h2><p class="muted" style="margin-top:-4px">' . e($g['hint']) . '</p><ul class="diag">' . implode('', array_map('diag_li', $g['items'])) . '</ul></div>';
  }
  echo '<div class="card"><h2>📘 Що робити далі</h2><p class="muted">Повний посібник — файл <code>store/GUIDE.html</code> у проєкті: збірка, заливання, застосунок, Google Play і чек-листи.</p></div>';
}

function admin_csrf_input(): string { return '<input type="hidden" name="csrf" value="' . e(admin_csrf()) . '">'; }

function diag_css(): string {
  return '<style>
.dg-tabs { flex-wrap: wrap; }
.dg-row { display: flex; align-items: center; justify-content: space-between; gap: .8rem; flex-wrap: wrap; margin-bottom: .3rem; }
.dg-row h2 { margin: 0; }
a.dg-kpi { color: inherit; text-decoration: none; }
a.dg-kpi:hover { transform: translate(-1px, -1px); }
.dg-svc td small, .t td small { display: block; }
.dg-svc .dg-st .pill { white-space: normal; text-align: left; }
.dg-svc tr.is-busy td { opacity: .55; }
.dg-msg { display: block; white-space: pre-wrap; word-break: break-word; font-size: .8rem; }
.dg-hint { display: block; margin-top: .3rem; color: var(--muted); }
.dg-log tr.d-bad td:first-child, .dg-log tr.d-warn td:first-child { font-size: 1.1rem; }
.dg-stack summary { cursor: pointer; font-size: .75rem; color: var(--muted); }
.dg-stack pre { white-space: pre-wrap; font-size: .72rem; max-height: 220px; overflow: auto; background: var(--soft); padding: .5rem; border-radius: 8px; }
.t tr.d-warn td { background: var(--warn-bg); }
.pill.r { background: var(--err-bg); color: var(--err-fg); border-color: currentColor; }
</style>';
}

/* Кнопки «Перевірити»: POST з CSRF, відповідь — JSON; текст вставляємо лише через textContent. */
function diag_script(string $nonce): void {
  $csrf = json_encode(admin_csrf());
  echo '<script nonce="' . e($nonce) . '">(()=>{const csrf=' . $csrf . ',IC={ok:"✅",warn:"⚠️",bad:"⛔",skip:"➖"},PL={ok:"g",warn:"y",bad:"r",skip:""};'
    . 'async function ping(svc){const tr=document.querySelector(\'tr[data-svc="\'+svc+\'"]\');if(!tr)return;const b=tr.querySelector("[data-ping]");tr.classList.add("is-busy");b.disabled=true;b.textContent="…";'
    . 'try{const fd=new FormData();fd.set("csrf",csrf);fd.set("do","diag_ping");fd.set("svc",svc);const r=await fetch("admin.php?p=diag",{method:"POST",body:fd,credentials:"same-origin"});const j=await r.json();'
    . 'const st=tr.querySelector(".dg-st");st.textContent="";const ic=document.createElement("span");ic.textContent=(IC[j.level]||"")+" ";const p=document.createElement("span");p.className="pill "+(PL[j.level]||"");p.textContent=j.value||"";st.append(ic,p);'
    . 'if(j.fix){const s=document.createElement("small");s.className="dg-fix muted";s.textContent=j.fix;st.append(s);}tr.querySelector(".dg-ms").textContent=j.ms?j.ms+" мс":"—";tr.querySelector(".dg-at").textContent="щойно";}'
    . 'catch(e){tr.querySelector(".dg-st").textContent="⛔ не вдалося перевірити — оновіть сторінку";}finally{tr.classList.remove("is-busy");b.disabled=false;b.textContent="Перевірити";}}'
    . 'document.querySelectorAll("[data-ping]").forEach(b=>b.addEventListener("click",()=>ping(b.dataset.ping)));'
    . 'const all=document.querySelector("[data-ping-all]");if(all)all.addEventListener("click",async()=>{all.disabled=true;for(const b of document.querySelectorAll("[data-ping]"))await ping(b.dataset.ping);all.disabled=false;});})();</script>';
}
