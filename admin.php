<?php
/* Комікс·Lab — адмін-панель: користувачі, матеріали (комікси), спільнота (стіни, каталог), система.
 * Доступ — лише акаунтам з is_admin = 1 (перший створює install.php). Сесія та сама, що й на сайті (cookie kl_s).
 * Усі дії — POST з CSRF-токеном; небезпечні — з підтвердженням.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
// локально налаштування можуть лежати в config.local.php — тоді інсталятор не потрібен
if (!is_file(__DIR__ . '/api/config.php') && !is_file(__DIR__ . '/api/config.local.php')) { header('Location: install.php'); exit; }
require __DIR__ . '/api/lib.php';
require __DIR__ . '/api/admin_ui.php';
require __DIR__ . '/api/admin-auth.php';
require __DIR__ . '/api/admin-dash.php';
require __DIR__ . '/api/admin-moderation.php';
require __DIR__ . '/api/testing-mail.php';
/* Таблиця журналу й стовпчик totp_last потрібні вже на першому вході, а ALTER
   на кожному запиті — зайвий. Позначка в kl_meta робить це один раз. */
if (meta_get('admin_auth_v', '') !== '1') { admin_auth_install(); meta_set('admin_auth_v', '1'); }
$nonce = html_mode();

$p = preg_replace('/[^a-z]/', '', (string)($_GET['p'] ?? 'dash')) ?: 'dash';
$post = ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';
$me = current_user();
$isAdmin = $me && !empty($me['is_admin']);
$isStaff = $me && is_staff($me) && empty($me['blocked_at']);
$fbNew = 0;
try { $fbNew = (int)(one('SELECT COUNT(*) AS n FROM kl_feedback WHERE done_at IS NULL')['n'] ?? 0); } catch (Throwable $e) { /* таблиці ще немає */ }
$tcNew = 0;
try { $tcNew = (int)(one("SELECT COUNT(*) AS n FROM kl_teachers WHERE status = 'pending'")['n'] ?? 0); } catch (Throwable $e) { /* таблиці ще немає */ }
$modNew = 0;   // нове в черзі модерації: неперевірені дописи + скарги
if ($isStaff) { try { mod_install(); $mc = mod_counts(); $modNew = $mc['queue'] + $mc['reports']; } catch (Throwable $e) { /* стовпців ще немає */ } }
$NAV = $isAdmin ? ['dash' => '📊 Огляд', 'users' => '👥 Користувачі', 'materials' => '📚 Матеріали', 'community' => '🛡 Модерація' . ($modNew ? ' (' . $modNew . ')' : ''), 'teachers' => '🎓 Вчителі' . ($tcNew ? ' (' . $tcNew . ')' : ''), 'feedback' => '💌 Відгуки' . ($fbNew ? ' (' . $fbNew . ')' : ''), 'voice' => '🎧 Голос і ШІ', 'translations' => '🌍 Переклади', 'mail' => '📣 Розсилки', 'diag' => '🩺 Діагностика', 'system' => '⚙️ Налаштування'] : ['community' => '🛡 Модерація' . ($modNew ? ' (' . $modNew . ')' : '')];
if ($isStaff && !$isAdmin && !in_array($p, ['community', 'logout', 'login'], true)) $p = 'community'; // модератор бачить лише модерацію
/* Дія з кнопки, позначеної data-ajax: замість переходу відповідаємо JSON, а сторінка сама
   прибирає рядок чи перемикає галочку — модерація йде одразу, без перезавантаження. */
function go(string $to, string $m = ''): void {
  if (($_SERVER['HTTP_X_ADMIN_AJAX'] ?? '') === '1') {
    global $MSG; $x = $MSG[$m] ?? ['ok', 'Готово.'];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => $x[0] !== 'err', 'type' => $x[0], 'text' => $x[1], 'm' => $m], JSON_UNESCAPED_UNICODE); exit;
  }
  $qs = trim($to . ($m !== '' ? '&m=' . $m : ''), '&'); header('Location: admin.php' . ($qs !== '' ? '?' . $qs : '')); exit;
}
function int_in(string $k): int { return max(0, (int)($_POST[$k] ?? $_GET[$k] ?? 0)); }

/* ---------- вхід ---------- */
if (!$isStaff) {
  /* Два кроки: пароль, а якщо в акаунті ввімкнено автентифікатор — ще й код.
     Сесію запускає лише api/admin-auth.php, і лише після обох кроків. */
  $err = ''; $ticket = '';
  if ($post && $p === 'login') {
    $r = isset($_POST['ticket'])
      ? admin_login_code((string)$_POST['ticket'], (string)($_POST['code'] ?? ''))
      : admin_login_password((string)($_POST['email'] ?? ''), (string)($_POST['password'] ?? ''));
    if (!empty($r['ok'])) go(!empty($r['user']['is_admin']) ? '' : 'p=community');
    $ticket = (string)($r['ticket'] ?? '');
    $err = match ($r['error'] ?? '') {
      'slow' => 'Забагато спроб. Зачекайте 15 хвилин.',
      'code' => 'Код не підійшов. Візьміть новий з автентифікатора або введіть резервний код.',
      'ticket' => 'Час на введення коду вийшов. Увійдіть ще раз.',
      '' => '',
      default => 'Неправильна пошта або пароль, або акаунт не має прав адміністратора чи модератора.',
    };
  }
  page_open('Вхід', $nonce); ?>
  <div class="auth-wrap"><div class="auth" style="width:min(420px,100%)"><div class="brand"><img src="img/logo.svg" alt="" width="32" height="32"> Komiks·Lab <small>ADMIN</small></div>
    <div class="card"><h1>🔐 Вхід</h1>
      <?php if ($me && !$isStaff): ?><div class="msg warn">Ви увійшли як <?= e($me['email']) ?>, але цей акаунт не адміністратор і не модератор.</div><?php endif; ?>
      <?php if ($err): ?><div class="msg err"><?= e($err) ?></div><?php endif; ?>
      <?php if ($ticket !== ''): ?>
      <form method="post" action="admin.php?p=login">
        <input type="hidden" name="ticket" value="<?= e($ticket) ?>">
        <label class="f">Код з автентифікатора<input name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="12" required autofocus><small>Шість цифр із застосунку або резервний код виду ABCD-1234.</small></label>
        <button class="btn pri">Підтвердити →</button>
      </form>
      <?php else: ?>
      <form method="post" action="admin.php?p=login">
        <label class="f">Пошта<input type="email" name="email" autocomplete="username" required autofocus></label>
        <label class="f">Пароль<input type="password" name="password" autocomplete="current-password" required></label>
        <button class="btn pri">Увійти →</button>
      </form>
      <?php endif; ?>
      <?php if (is_file(__DIR__ . '/install.php')): ?><p class="muted" style="margin-bottom:0">Ще не створили адміністратора? <a href="install.php">Інсталятор</a></p><?php endif; ?>
    </div></div></div>
  <?php page_close($nonce, false); exit;
}

/* Mail studio handles admin actions before any HTML output. */
if ($isAdmin && $p === 'mail') { require __DIR__ . '/api/mail-studio-controller.php'; exit; }

/* ---------- вкладення до відгуку: показуємо лише адміністратору ---------- */
if ($isAdmin && $p === 'feedback' && isset($_GET['dl'])) {
  $f = one('SELECT file, file_name, file_type FROM kl_feedback WHERE id = ?', [(int)$_GET['dl']]);
  $path = $f && $f['file'] !== '' ? upload_dir() . '/' . $f['file'] : '';
  if (!$path || !preg_match('/^[0-9]{8}-[a-f0-9]{16}\.[a-z]{3,4}$/', $f['file']) || !is_file($path)) { http_response_code(404); exit('Файла немає'); }
  header('Content-Type: ' . $f['file_type']);
  header('Content-Disposition: ' . (str_starts_with($f['file_type'], 'image/') ? 'inline' : 'attachment') . '; filename="' . preg_replace('/[^\w. -]+/u', '', $f['file_name'] ?: $f['file']) . '"');
  header('X-Content-Type-Options: nosniff');
  header('Content-Security-Policy: default-src \'none\'; img-src \'self\'; sandbox');
  header('Content-Length: ' . (string)filesize($path));
  readfile($path);
  exit;
}

if ($isAdmin && $p === 'teachers' && isset($_GET['dl'])) {
  $t = one('SELECT file, file_name, file_type FROM kl_teachers WHERE user_id = ?', [(int)$_GET['dl']]);
  $path = $t && $t['file'] !== '' ? upload_dir() . '/' . $t['file'] : '';
  if (!$path || !preg_match('/^[0-9]{8}-[a-f0-9]{16}\.[a-z]{3,4}$/', $t['file']) || !is_file($path)) { http_response_code(404); exit('Файла немає'); }
  header('Content-Type: ' . $t['file_type']);
  header('Content-Disposition: ' . (str_starts_with((string)$t['file_type'], 'image/') ? 'inline' : 'attachment') . '; filename="' . preg_replace('/[^\w. -]+/u', '', $t['file_name'] ?: $t['file']) . '"');
  header('X-Content-Type-Options: nosniff');
  header('Content-Security-Policy: default-src \'none\'; img-src \'self\'; sandbox');
  readfile($path);
  exit;
}

$MSG = ['remind_sent' => ['ok', '📬 Нагадування про навчання надіслано.'], 'apps_sent' => ['ok', '📲 Лист про застосунок надіслано.'], 'apps_fail' => ['err', 'Поштовий сервер не прийняв лист — подивіться 🩺 Діагностика → Журнали.'],
  'apps_unsub' => ['warn', 'Користувач відписався від листів — лист не надіслано.'], 'apps_unverified' => ['warn', 'Пошту не підтверджено — лист не надіслано.'],
  'fb_android_sent' => ['ok', '📲 Посилання Google Play та інструкцію на 14 днів надіслано тестувальнику. Заявку позначено опрацьованою.'],
  'fb_android_email' => ['err', 'У заявці немає правильної email-адреси. Лист не надіслано, заявку залишено відкритою.'],
  'fb_android_mail' => ['err', 'Поштовий сервер не прийняв лист. Заявку залишено відкритою — перевірте 🩺 Діагностика → Журнали й повторіть.'],
  'verified' => ['ok', 'Пошту позначено підтвердженою.'], 'sent' => ['ok', 'Лист надіслано.'], 'blocked' => ['ok', 'Користувача заблоковано, його сесії завершено.'], 'unblocked' => ['ok', 'Блокування знято.'],
  'saved' => ['ok', 'Збережено.'], 'kicked' => ['ok', 'Усі сесії користувача завершено.'], 'deleted' => ['ok', 'Видалено.'], 'self' => ['err', 'Цю дію не можна виконати над власним акаунтом.'],
  'confirm' => ['err', 'Для видалення введіть пошту користувача точно.'], 'mail_test_ok' => ['ok', '📬 Тестовий лист надіслано на вашу пошту.'], 'mail_fail' => ['err', 'Лист не надіслався. Причину видно нижче, у картці «Пошта».'],
  'voice_ok' => ['ok', '🔊 Голос працює — тестову фразу синтезовано.'], 'voice_fail' => ['err', 'Голос не відповів. Перевірте, чи дозволені вихідні зʼєднання, або оберіть іншого провайдера.'],
  'wrong' => ['err', 'Поточний пароль неправильний.'], 'short' => ['err', 'Новий пароль — щонайменше 10 символів.'],
  'banned' => ['ok', '⛔ Тимчасове блокування стін застосовано, автор побачить анімоване повідомлення.'], 'unbanned' => ['ok', 'Блокування знято.'], 'warned' => ['ok', '⚠️ Попередження надіслано — автор побачить анімацію «так не можна».'],
  'forbidden' => ['err', 'Недостатньо прав.'], 'bad_input' => ['err', 'Вкажіть ім’я та правильну пошту.'], 'exists' => ['err', 'Акаунт з такою поштою вже є — відкрийте його й увімкніть преміум.'],
  'pw_set' => ['ok', '🔑 Пароль задано. Передайте його другові особисто й попросіть змінити в кабінеті.'], 'pw_pass_short' => ['err', 'Пароль закороткий — щонайменше 8 символів (12345 не підходить).'], 'pw_pass_weak' => ['err', 'Цей пароль у списку найпростіших — його підберуть за секунди. Оберіть інший.'], 'pw_pass_long' => ['err', 'Пароль задовгий.'],
  'noted' => ['ok', '✉️ Звернення надіслано — людина побачить його при наступному відкритті сайту.'],
  'note_empty' => ['warn', 'Текст порожній — нічого не надіслано.'], 'approved' => ['ok', '✓ Схвалено.'], 'dismissed' => ['ok', 'Скаргу закрито — порушення немає.'], 'mail_sub' => ['ok', '📣 Підписано на розсилку.'], 'mail_unsub' => ['ok', '🔕 Відписано від розсилки.'],
  'mail_ok' => ['ok', '📣 Листи надіслано.'], 'mail_none' => ['warn', 'Нікого не позначено — листи не надсилалися.'], 'mail_part' => ['warn', '📣 Частину листів не вдалося надіслати — подивіться «Систему» → «Пошта».'],
  'reauth' => ['err', '🔐 Пароль або код автентифікатора не підійшов — зміни не збережено.'],
  'g_saved' => ['ok', '🔑 Ключі Google збережено як чернетку. Тепер натисніть «Перевірити через Google».'], 'g_same' => ['warn', 'Ключі не змінилися — нічого не збережено.'],
  'g_bad_id' => ['err', 'Client ID має вигляд 1234567890-abc….apps.googleusercontent.com.'], 'g_bad_secret' => ['err', 'Client Secret виглядає неправильно: без пробілів і переносів, 10–200 символів.'],
  'g_need_secret' => ['err', 'Спершу введіть Client Secret.'], 'g_key' => ['err', 'Не вдалося відкрити сховище ключа шифрування — подивіться рядок «Сховище ключа» в картці Google.'],
  'g_transport' => ['err', 'Для входу Google потрібні HTTPS і PHP cURL — див. картку Google.'], 'g_not_verified' => ['err', 'Спершу перевірте саме ці ключі через Google — увімкнути можна лише перевірені.'],
  'g_on' => ['ok', '✅ Вхід через Google увімкнено.'], 'g_off' => ['ok', 'Вхід через Google вимкнено. Ключі збережено — увімкнути можна знову без нової перевірки.'],
  'google_verified' => ['ok', '✅ Google підтвердив ключі: вхід пройшов, користувача не створено. Тепер можна вмикати.'],
  'google_verify_fail' => ['err', 'Перевірку через Google не пройдено. Причина — у журналі нижче.'],
  'created' => ['ok', '🎉 Акаунт створено. Другу надіслано лист із посиланням, щоб задати пароль (діє 7 днів).'], 'created_nomail' => ['err', 'Акаунт створено, але лист не надіслався — перевірте пошту в «Системі» й натисніть «Надіслати посилання для нового пароля».']];
/* ---------- дії (POST) ---------- */
if ($post) {
  check_admin_csrf();
  $do = (string)($_POST['do'] ?? ($p === 'logout' ? 'logout' : ''));
  $id = int_in('id');
  $target = $id ? one('SELECT * FROM kl_users WHERE id = ?', [$id]) : null;
  $self = $target && (int)$target['id'] === (int)$me['id'];
  $back = 'p=user&id=' . $id;
  // модератору дозволено лише модерацію стін
  $modOnly = ['logout', 'comment_del', 'comment_warn', 'comment_ban', 'unban', 'comment_ok', 'comment_ok_all', 'msg_ok', 'msg_del', 'msg_warn', 'msg_ban', 'player_del'];
  if (!$isAdmin && !in_array($do, $modOnly, true)) go('p=community', 'forbidden');
  $cmt = isset($_POST['cid']) ? one('SELECT * FROM kl_comments WHERE id = ?', [(string)$_POST['cid']]) : null;
  $flag = fn(string $col, int $v) => q("UPDATE kl_users SET $col = ? WHERE id = ?", [$v, $id]);
  switch ($do) {
    case 'premium_on': if ($target) $flag('premium', 1); go($back, 'saved');
    case 'premium_off': if ($target) $flag('premium', 0); go($back, 'saved');
    case 'invite_on': if ($target) { $flag('can_invite', 1); $flag('premium', 1); } go($back, 'saved');
    case 'invite_off': if ($target) $flag('can_invite', 0); go($back, 'saved');
    case 'mod_on': if ($target) $flag('is_moderator', 1); go($back, 'saved');
    case 'mod_off': if ($target) $flag('is_moderator', 0); go($back, 'saved');
    case 'wall_ban':
      $hours = in_array((int)($_POST['hours'] ?? 0), [1, 24, 168, 720], true) ? (int)$_POST['hours'] : 24;
      if ($target && !$self) { q('INSERT INTO kl_bans (user_id, ip_hash, until_at, reason, by_id, created_at) VALUES (?, NULL, ?, ?, ?, ?)', [$id, time() + $hours * 3600, 'admin', $me['id'], time()]); q('INSERT INTO kl_notices (user_id, kind, text, by_id, created_at) VALUES (?, ?, ?, ?, ?)', [$id, 'ban', '', $me['id'], time()]); }
      go($back, $self ? 'self' : 'banned');
    case 'warn': if ($target && !$self) q('INSERT INTO kl_notices (user_id, kind, text, by_id, created_at) VALUES (?, ?, ?, ?, ?)', [$id, 'warn', '', $me['id'], time()]); go($back, $self ? 'self' : 'warned');
    /* Своє звернення. Порожній текст не надсилаємо: сповіщення без слів —
       це просто налякати людину ні за що. */
    case 'note':
      $txt = clean_text((string)($_POST['note'] ?? ''), 300);
      if ($txt === '') go($back, 'note_empty');
      if ($target && !$self) q('INSERT INTO kl_notices (user_id, kind, text, by_id, created_at) VALUES (?, ?, ?, ?, ?)', [$id, 'note', $txt, $me['id'], time()]);
      go($back, $self ? 'self' : 'noted');
    case 'unban': q('UPDATE kl_bans SET until_at = ? WHERE id = ?', [time(), int_in('ban')]); go($isAdmin && $id ? $back : 'p=community', 'unbanned');
    case 'comment_ok': if ($cmt) q('UPDATE kl_comments SET mod_ok_at = ? WHERE id = ?', [time(), $cmt['id']]); go('p=community', 'approved');
    case 'comment_ok_all':
      foreach (array_filter(explode(',', (string)($_POST['ids'] ?? '')), fn($x) => (bool)preg_match('/^[A-Za-z0-9_-]{4,24}$/', $x)) as $cid) q('UPDATE kl_comments SET mod_ok_at = ? WHERE id = ? AND mod_ok_at IS NULL', [time(), $cid]);
      go('p=community', 'approved');
    /* Скарга на особисте повідомлення: «порушення немає» закриває скаргу, решта — прибирає
       повідомлення; попередження й блокування адресуються авторові (за акаунтом). */
    case 'msg_ok': case 'msg_del': case 'msg_warn': case 'msg_ban':
      $msgRow = one('SELECT * FROM kl_messages WHERE id = ?', [int_in('mid')]);
      if ($msgRow) {
        $victim = one('SELECT * FROM kl_users WHERE id = ?', [(int)$msgRow['from_id']]);
        if ($do !== 'msg_ok' && $victim && is_staff($victim) && !$isAdmin) go('p=community&t=reports', 'forbidden');
        if ($do === 'msg_ok') q('UPDATE kl_messages SET mod_done_at = ? WHERE id = ?', [time(), $msgRow['id']]);
        else {
          if ($do !== 'msg_del') q('INSERT INTO kl_notices (user_id, ip_hash, kind, text, by_id, created_at) VALUES (?, NULL, ?, ?, ?, ?)', [(int)$msgRow['from_id'], $do === 'msg_ban' ? 'ban' : 'warn', mb_substr_s((string)$msgRow['text'], 300), $me['id'], time()]);
          if ($do === 'msg_ban') { $hours = in_array((int)($_POST['hours'] ?? 0), [1, 24, 168], true) ? (int)$_POST['hours'] : 24; q('INSERT INTO kl_bans (user_id, ip_hash, until_at, reason, by_id, created_at) VALUES (?, NULL, ?, ?, ?, ?)', [(int)$msgRow['from_id'], time() + $hours * 3600, 'msg', $me['id'], time()]); }
          q('DELETE FROM kl_messages WHERE id = ?', [$msgRow['id']]);
        }
      }
      go('p=community&t=reports', $do === 'msg_ok' ? 'dismissed' : ($do === 'msg_ban' ? 'banned' : ($do === 'msg_warn' ? 'warned' : 'deleted')));
    // 📣 підписка на розсилки (kl_users.mail_ok) — перемикач у списку й у картці
    case 'mail_on': case 'mail_off':
      if ($target) $flag('mail_ok', $do === 'mail_on' ? 1 : 0);
      go(($_POST['from'] ?? '') === 'list' ? 'p=users' : $back, $do === 'mail_on' ? 'mail_sub' : 'mail_unsub');
    case 'comment_warn': case 'comment_ban':
      if ($cmt) {
        $who = $cmt['user_id'] ? [(int)$cmt['user_id'], null] : [null, $cmt['ip_hash'] ?: null]; // акаунт — за акаунтом, гість — за IP
        $victim = $who[0] ? one('SELECT * FROM kl_users WHERE id = ?', [$who[0]]) : null;
        if ($victim && is_staff($victim) && !$isAdmin) go('p=community', 'forbidden');
        q('INSERT INTO kl_notices (user_id, ip_hash, kind, text, by_id, created_at) VALUES (?, ?, ?, ?, ?, ?)', [$who[0], $who[1], $do === 'comment_ban' ? 'ban' : 'warn', mb_substr_s($cmt['text'], 300), $me['id'], time()]);
        if ($do === 'comment_ban') { $hours = in_array((int)($_POST['hours'] ?? 0), [1, 24, 168], true) ? (int)$_POST['hours'] : 24; q('INSERT INTO kl_bans (user_id, ip_hash, until_at, reason, by_id, created_at) VALUES (?, ?, ?, ?, ?, ?)', [$who[0], $who[1], time() + $hours * 3600, 'wall', $me['id'], time()]); }
        q('DELETE FROM kl_comments WHERE id = ?', [$cmt['id']]);
      }
      go('p=community', $do === 'comment_ban' ? 'banned' : 'warned');
    case 'set_pass':
      // пароль, який адмін повідомить другові сам (краще — лист «Задати пароль»); ті самі правила, що й при реєстрації
      $np = (string)($_POST['pass'] ?? '');
      if (!$target) go($back);
      if ($prob = password_problem($np)) go($back, 'pw_' . $prob);
      q('UPDATE kl_users SET pass_hash = ?, verified_at = COALESCE(verified_at, ?) WHERE id = ?', [hash_password($np), time(), $id]);
      q('DELETE FROM kl_sessions WHERE user_id = ?', [$id]);
      go($back, 'pw_set');
    case 'create_user':
      $name = clean_text((string)($_POST['name'] ?? ''), 30); $email = strtolower(trim((string)($_POST['email'] ?? '')));
      if ($name === '' || !valid_email($email)) go('p=users', 'bad_input');
      if (one('SELECT id FROM kl_users WHERE email = ?', [$email])) go('p=users', 'exists');
      $lang = in_array($_POST['lang'] ?? '', ['uk', 'en', 'no', 'ar'], true) ? $_POST['lang'] : 'uk';
      $now = time();
      q('INSERT INTO kl_users (email, name, pass_hash, lang, friend_code, share_profile, verified_at, created_at, consent_at, premium, can_invite, is_moderator) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)',
        [$email, $name, hash_password(rand_hex(24)), $lang, unique_friend_code(), $now, $now, $now, empty($_POST['premium']) ? 0 : 1, empty($_POST['can_invite']) ? 0 : 1, empty($_POST['moderator']) ? 0 : 1]);
      $nu = one('SELECT * FROM kl_users WHERE email = ?', [$email]);
      // посилання «задати пароль» діє 7 днів; лист іде мовою друга
      $sent = send_template($nu, 'setpass', site_url() . '#/reset/' . new_token((int)$nu['id'], 'reset', 7 * 86400));
      go('p=user&id=' . (int)$nu['id'], $sent ? 'created' : 'created_nomail');
    case 'teacher_ok': case 'teacher_no':
      $tid = int_in('tid');
      $tu = $tid ? one('SELECT * FROM kl_users WHERE id = ?', [$tid]) : null;
      if ($tu) {
        $okT = $do === 'teacher_ok';
        teacher_decide($tid, $okT, clean_text((string)($_POST['note'] ?? ''), 300), (int)$me['id']);
        // лист учителю: лаконічно, мовою його акаунта
        $lang = in_array($tu['lang'], ['uk', 'en', 'no', 'ar'], true) ? $tu['lang'] : 'en';
        $TT = [
          'uk' => ['🎓 Преміум для вчителя увімкнено', 'Дякуємо! Ми підтвердили ваш учительський акаунт — Преміум тепер безкоштовний і без обмежень.', '🎓 Заявку не підтверджено', 'Нам не вистачило підтвердження. Надішліть, будь ласка, заявку ще раз — із посиланням на школу або фото посвідчення.'],
          'en' => ['🎓 Teacher Premium is on', 'Thank you! We confirmed your teacher account — Premium is now free and without limits.', '🎓 Application not confirmed', 'We did not have enough proof. Please send the application again with a school link or a photo of your staff card.'],
          'no' => ['🎓 Lærer-Premium er på', 'Takk! Vi har bekreftet lærerkontoen din – Premium er nå gratis og uten grenser.', '🎓 Søknaden er ikke bekreftet', 'Vi hadde ikke nok dokumentasjon. Send søknaden på nytt med en lenke til skolen eller et bilde av ansattkortet.'],
          'ar' => ['🎓 تم تفعيل بريميوم المعلّم', 'شكرًا! أكّدنا حساب المعلّم الخاص بك — البريميوم الآن مجاني وبلا حدود.', '🎓 لم يتم تأكيد الطلب', 'لم يكن الإثبات كافيًا. أرسل الطلب مرة أخرى مع رابط المدرسة أو صورة بطاقة العمل.'],
        ][$lang];
        $subject = $okT ? $TT[0] : $TT[2];
        $html = mail_layout($lang, $subject, $okT ? $TT[1] : $TT[3], $okT ? 'Komiks·Lab' : 'Komiks·Lab', site_url() . '#/teacher', '', 'Komiks·Lab');
        send_mail((string)$tu['email'], 'Komiks·Lab: ' . $subject, $html, $okT ? $TT[1] : $TT[3]);
      }
      go('p=teachers', 'saved');
    case 'fb_done':
      $fbRow = one('SELECT f.*, u.email AS user_email FROM kl_feedback f LEFT JOIN kl_users u ON u.id = f.user_id WHERE f.id = ?', [int_in('fb')]);
      if (!$fbRow || !empty($fbRow['done_at'])) go('p=feedback', 'saved');
      if (($fbRow['kind'] ?? '') === 'android') {
        if (!valid_email((string)($fbRow['email'] ?? '')) && valid_email((string)($fbRow['user_email'] ?? ''))) {
          $fbRow['email'] = $fbRow['user_email'];
        }
        $sendResult = send_android_testing_invite($fbRow);
        meta_set('mail_last_try', (string)time());
        meta_set('mail_last_error', $sendResult === 'sent' ? '' : ($sendResult === 'email' ? 'android tester: invalid email' : (mail_error() ?: 'android tester: unknown mail error')));
        if ($sendResult !== 'sent') go('p=feedback&f=android', 'fb_android_' . $sendResult);
      }
      q('UPDATE kl_feedback SET done_at = ? WHERE id = ? AND done_at IS NULL', [time(), (int)$fbRow['id']]);
      go('p=feedback', ($fbRow['kind'] ?? '') === 'android' ? 'fb_android_sent' : 'saved');
    case 'fb_undone': q('UPDATE kl_feedback SET done_at = NULL WHERE id = ?', [int_in('fb')]); go('p=feedback', 'saved');
    case 'fb_del':
      $fbRow = one('SELECT file FROM kl_feedback WHERE id = ?', [int_in('fb')]);
      if ($fbRow && $fbRow['file'] !== '') delete_upload((string)$fbRow['file']);
      q('DELETE FROM kl_feedback WHERE id = ?', [int_in('fb')]);
      go('p=feedback', 'deleted');
    case 'ai_save':
      // ключі API тут не зберігаємо — лише те, що не є секретом
      foreach (['rt_model', 'rt_voice', 'rt_greeting', 'rt_prompt', 'rt_prompt_id', 'rt_stt', 'rt_noise', 'model', 'chat_prompt', 'tts_provider', 'tts_voice', 'write_model'] as $k) {
        $v = clean_text((string)($_POST[$k] ?? ''), in_array($k, ['rt_prompt', 'chat_prompt'], true) ? 1200 : 80);
        ai_set($k, $v);
      }
      /* Прапорці приходять лише увімкненими, тож відсутність — це «вимкнено». */
      foreach (['write', 'chat', 'realtime'] as $k) ai_set('use_' . $k, empty($_POST['use_' . $k]) ? '0' : '1');
      go('p=voice', 'saved');
    case 'ai_test':
      // коротка перевірка голосу: синтезуємо фразу й кажемо, скільки вийшло
      $mp3 = tts_speak('Hei! Det er Kaja. Skal vi ta en kaffe i dag?');
      go('p=voice', $mp3 ? 'voice_ok' : 'voice_fail');
    case 'dump': sql_dump_stream(); // віддає .sql і завершує запит
    case 'hits_on': case 'hits_off':
      meta_set('hits_off', $do === 'hits_off' ? '1' : '0'); admin_log((int)$me['id'], $do);
      go('p=system&s=stats', 'saved');
    case 'hits_clear':
      if (meta_get('hits_v') === '1') { q('DELETE FROM kl_hits'); q('DELETE FROM kl_hit_uv'); }
      admin_log((int)$me['id'], 'hits_clear'); go('p=system&s=stats', 'deleted');
    case 'diag_ping':
      // 🩺 жива перевірка однієї служби — JSON для кнопки «Перевірити»
      require_once __DIR__ . '/api/diag.php';
      $svc = (string)($_POST['svc'] ?? '');
      header('Content-Type: application/json; charset=utf-8');
      echo json_encode(['ok' => true, 'svc' => $svc] + diag_ping($svc), JSON_UNESCAPED_UNICODE); exit;
    case 'err_fixed':
      // 🩺 помилку виправлено — прибрати рядок із журналу (повториться — з’явиться знову) або очистити весь журнал
      $kind = ($_POST['kind'] ?? '') === 'php' ? 'php' : 'js';
      $hash = (string)preg_replace('/[^a-f0-9]/', '', (string)($_POST['hash'] ?? ''));
      try { $hash !== '' ? q('DELETE FROM kl_errors WHERE hash = ? AND kind = ?', [$hash, $kind]) : q('DELETE FROM kl_errors WHERE kind = ?', [$kind]); } catch (Throwable $e) { /* таблиці ще немає */ }
      if ($hash === '') admin_log((int)$me['id'], 'errors_clear', $kind);
      go('p=diag&tab=logs', 'deleted');
    case 'send_apps':
      // 📲 лист «Встановіть застосунок» — лише тим, хто підтвердив пошту й не відписався
      if (!$target) go('p=users');
      if (empty($target['verified_at'])) go($back, 'apps_unverified');
      if (empty($target['mail_ok'])) go($back, 'apps_unsub');
      $okMail = send_campaign($target, 'apps', site_url() . '#/install');
      admin_log((int)$me['id'], 'mail_apps', 'користувач #' . (int)$target['id'] . ($okMail ? '' : ' — не прийнято'));
      go($back, $okMail ? 'apps_sent' : 'apps_fail');
    case 'send_remind':
      // 📬 «нагадування про навчання + що нового» — ті самі умови, що й для листа про застосунок
      if (!$target) go('p=users');
      if (empty($target['verified_at'])) go($back, 'apps_unverified');
      if (empty($target['mail_ok'])) go($back, 'apps_unsub');
      require_once __DIR__ . '/api/remind-mail.php';
      $dRow = one('SELECT v FROM kl_user_data WHERE user_id = ? AND k = ?', [(int)$target['id'], 'days']);
      $okMail = send_campaign($target, 'remind', site_url() . '#/today', remind_mail_extra(kl_lang($target['lang'] ?? 'en'), (array)(json_decode((string)($dRow['v'] ?? '[]'), true) ?: [])));
      admin_log((int)$me['id'], 'mail_remind', 'користувач #' . (int)$target['id'] . ($okMail ? '' : ' — не прийнято'));
      go($back, $okMail ? 'remind_sent' : 'apps_fail');
    case 'logout': end_session(); go('');
    case 'verify': if ($target) q('UPDATE kl_users SET verified_at = ? WHERE id = ? AND verified_at IS NULL', [time(), $id]); go($back, 'verified');
    case 'resend': if ($target && empty($target['verified_at'])) send_verify($target); go($back, 'sent');
    case 'reset': if ($target) send_template($target, 'reset', site_url() . '#/reset/' . new_token($id, 'reset', RESET_TTL)); go($back, 'sent');
    case 'block': if ($target && !$self) { q('UPDATE kl_users SET blocked_at = ? WHERE id = ?', [time(), $id]); q('DELETE FROM kl_sessions WHERE user_id = ?', [$id]); q('DELETE FROM kl_players WHERE user_id = ? OR code = ?', [$id, $target['friend_code']]); } go($back, $self ? 'self' : 'blocked');
    case 'unblock': if ($target) q('UPDATE kl_users SET blocked_at = NULL WHERE id = ?', [$id]); go($back, 'unblocked');
    case 'admin_on': if ($target) q('UPDATE kl_users SET is_admin = 1 WHERE id = ?', [$id]); go($back, 'saved');
    case 'admin_off': if ($target && !$self) q('UPDATE kl_users SET is_admin = 0 WHERE id = ?', [$id]); go($back, $self ? 'self' : 'saved');
    case 'kick': if ($target && !$self) q('DELETE FROM kl_sessions WHERE user_id = ?', [$id]); go($back, $self ? 'self' : 'kicked');
    case 'delete':
      if (!$target || $self) go($back, 'self');
      if (strtolower(trim((string)($_POST['confirm'] ?? ''))) !== $target['email']) go($back, 'confirm');
      delete_user_all($target); go('p=users', 'deleted');
    case 'comment_del': q('DELETE FROM kl_comments WHERE id = ?', [(string)($_POST['cid'] ?? '')]); go('p=community', 'deleted');
    case 'player_del': q('DELETE FROM kl_players WHERE code = ?', [strtoupper((string)($_POST['code'] ?? ''))]); go('p=community', 'deleted');
    case 'test_mail':
      $html = mail_layout('uk', 'Пошта працює ✅', 'Тестовий лист з адмін-панелі Komiks·Lab.', 'Адмін-панель', site_url() . 'admin.php', '', 'Komiks·Lab');
      $sentOk = send_mail($me['email'], 'Komiks·Lab: тестовий лист', $html, 'Пошта працює.');
      meta_set('mail_last_error', $sentOk ? '' : (mail_error() ?: 'невідома помилка'));
      meta_set('mail_last_try', (string)time());
      go('p=system&s=mail', $sentOk ? 'mail_test_ok' : 'mail_fail');
    /* 🔑 Вхід через Google. Зміна ключів і ввімкнення — лише після пароля, а за
       увімкненого автентифікатора ще й свіжого коду: відкрита на чужому компʼютері
       вкладка ключів не змінить. Вимкнути можна без цього — це безпечний бік. */
    case 'google_save': case 'google_enable': case 'google_disable': case 'google_verify':
      require_once __DIR__ . '/api/google-auth.php';
      google_install();
      if ($do !== 'google_disable' && $do !== 'google_verify' && !admin_reauth($me, (string)($_POST['reauth_pass'] ?? ''), (string)($_POST['reauth_code'] ?? ''))) {
        admin_log((int)$me['id'], 'reauth_fail', $do);
        go('p=system&s=google', 'reauth');
      }
      if ($do === 'google_save') {
        try {
          $r = google_settings_save((int)$me['id'], (string)($_POST['client_id'] ?? ''), (string)($_POST['client_secret'] ?? ''));
          go('p=system&s=google', $r['changed'] ? 'g_saved' : 'g_same');
        } catch (InvalidArgumentException $e) {
          go('p=system&s=google', ['client_id' => 'g_bad_id', 'secret' => 'g_bad_secret', 'secret_required' => 'g_need_secret'][$e->getMessage()] ?? 'g_bad_id');
        } catch (Throwable $e) {
          admin_log((int)$me['id'], 'google_save_fail', 'сховище ключа недоступне');
          go('p=system&s=google', 'g_key');
        }
      }
      if ($do === 'google_enable' || $do === 'google_disable') {
        $r = google_set_enabled((int)$me['id'], $do === 'google_enable');
        go('p=system&s=google', $r['ok'] ? ($do === 'google_enable' ? 'g_on' : 'g_off') : 'g_not_verified');
      }
      /* Перевірка: справжній вхід Google чернетковими ключами. Повернення —
         у google-callback.php, який лише ставить позначку «перевірено». */
      if (!google_transport_ok()) go('p=system&s=google', 'g_transport');
      try { $draft = google_draft(); } catch (Throwable $e) { go('p=system&s=google', 'g_key'); }
      if (!$draft) go('p=system&s=google', 'g_need_secret');
      $browser = rand_hex(32);
      $state = google_new_state($browser, 'verify', 'uk', (int)$me['id'], $draft['fp']);
      $opts = cookie_opts(time() + 600); $opts['samesite'] = 'Lax'; $opts['secure'] = true;
      setcookie('kl_google_browser', $browser, $opts);
      admin_log((int)$me['id'], 'google_verify_start', 'перехід на сторінку Google');
      header('Location: ' . google_auth_url($draft['client_id'], $state), true, 303);
      exit;
    case 'my_pass':
      if (!password_verify((string)($_POST['old'] ?? ''), $me['pass_hash'])) go('p=system&s=security', 'wrong');
      $np = (string)($_POST['new'] ?? '');
      if (strlen($np) < 10) go('p=system&s=security', 'short');
      q('UPDATE kl_users SET pass_hash = ? WHERE id = ?', [hash_password($np), $me['id']]);
      q('DELETE FROM kl_sessions WHERE user_id = ? AND token_hash <> ?', [$me['id'], sha((string)$_COOKIE[SESSION_COOKIE])]);
      go('p=system&s=security', 'saved');
  }
  go('p=' . $p);
}

$flash = $MSG[(string)($_GET['m'] ?? '')] ?? null;

page_open($NAV[$p] ?? 'Користувач', $nonce, $NAV, $p === 'user' ? 'users' : $p, $me);
if ($flash) echo '<div class="msg ' . $flash[0] . '">' . e($flash[1]) . '</div>';
if (is_file(__DIR__ . '/install.php')) echo '<div class="msg warn">⚠️ Файл <code>install.php</code> ще на сервері — видаліть його (hPanel → File Manager).</div>';
$csrf = '<input type="hidden" name="csrf" value="' . e(admin_csrf()) . '">';
function act(string $do, int $id, string $label, string $cls = '', string $confirm = '', string $extra = ''): string {
  global $csrf;
  return '<form method="post" action="admin.php?p=user&amp;id=' . $id . '"' . ($confirm ? ' data-confirm="' . e($confirm) . '"' : '') . '>' . $csrf . '<input type="hidden" name="do" value="' . e($do) . '"><input type="hidden" name="id" value="' . $id . '">' . $extra . '<button class="btn sm ' . $cls . '">' . $label . '</button></form>';
}
function status_pills(array $u): string {
  $s = '';
  if (!empty($u['is_admin'])) $s .= '<span class="pill y">👑 адмін</span> ';
  if (!empty($u['is_moderator'])) $s .= '<span class="pill b">🛡 модератор</span> ';
  if (!empty($u['is_teacher'])) $s .= '<span class="pill g">🎓 вчитель</span> ';
  if (!empty($u['founder'])) $s .= '<span class="pill p">🏅 PRO #' . (int)$u['founder'] . '</span> ';
  if (!empty($u['premium'])) $s .= '<span class="pill p">💎 преміум</span> ';
  if (!empty($u['can_invite'])) $s .= '<span class="pill p">🎟 запрошує</span> ';
  if (!empty($u['blocked_at'])) $s .= '<span class="pill r">⛔ заблоковано</span> ';
  $s .= !empty($u['verified_at']) ? '<span class="pill g">✓ підтверджено</span>' : '<span class="pill">⏳ не підтверджено</span>';
  return $s;
}
// 📣 перемикач «підписаний на розсилку» (kl_users.mail_ok): галочка, що зберігається одразу
function mail_switch(array $u, string $from = ''): string {
  global $csrf;
  $on = !isset($u['mail_ok']) || (int)$u['mail_ok'] === 1;
  return '<form method="post" action="admin.php?p=' . ($from === 'list' ? 'users' : 'user&amp;id=' . (int)$u['id']) . '" data-ajax data-switch class="mail-sw">' . $csrf
    . '<input type="hidden" name="id" value="' . (int)$u['id'] . '">' . ($from ? '<input type="hidden" name="from" value="' . e($from) . '">' : '')
    . '<input type="hidden" name="do" value="' . ($on ? 'mail_off' : 'mail_on') . '">'
    . '<label class="sw" title="' . ($on ? 'Підписаний на розсилку — натисніть, щоб відписати' : 'Відписаний — натисніть, щоб підписати') . '"><input type="checkbox" data-autosubmit data-on="mail_on" data-off="mail_off"' . ($on ? ' checked' : '') . '><i aria-hidden="true"></i><span>' . ($on ? 'підписаний' : 'відписаний') . '</span></label></form>';
}
/* 📅 Дні на сайті: ключ days у прогресі акаунта — дати, коли людина щось робила (читала, проходила
   тести, грала); синхронізується з усіх пристроїв. Повертаємо кількість, серії, межі й множину для календаря. */
function user_days($raw): array {
  $days = array_values(array_unique(array_filter((array)$raw, fn($d) => is_string($d) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $d))));
  sort($days);
  $set = array_flip($days);
  $best = 0; $run = 0; $prev = null;
  foreach ($days as $d) { $run = ($prev !== null && date('Y-m-d', strtotime($prev . ' +1 day')) === $d) ? $run + 1 : 1; $best = max($best, $run); $prev = $d; }
  $cur = 0; $x = isset($set[date('Y-m-d')]) ? date('Y-m-d') : date('Y-m-d', strtotime('-1 day'));
  while (isset($set[$x])) { $cur++; $x = date('Y-m-d', strtotime($x . ' -1 day')); }
  $from30 = date('Y-m-d', strtotime('-29 days'));
  return ['n' => count($days), 'set' => $set, 'best' => $best, 'cur' => $cur, 'n30' => count(array_filter($days, fn($d) => $d >= $from30)), 'first' => $days[0] ?? '', 'last' => $days ? end($days) : ''];
}
function diag_ago_s(int $t): string { $d = max(0, time() - $t); return $d < 60 ? 'щойно' : intdiv($d, 60) . ' хв тому'; }
function user_cell(array $u): string { return '<div class="u-name"><span class="u-ava">' . e(mb_first($u['name'])) . '</span><div><b>' . e($u['name']) . '</b><small>' . e($u['email']) . '</small></div></div>'; }

/* ---------- огляд: дашборд (api/admin-dash.php) ---------- */
if ($p === 'dash') {
  echo dash_css();
  dash_render((int)($_GET['r'] ?? 30));
  dash_script($nonce);
}

/* ---------- користувачі ---------- */
if ($p === 'users') {
  $qs = trim((string)($_GET['q'] ?? '')); $f = (string)($_GET['f'] ?? 'all'); $page = max(0, (int)($_GET['page'] ?? 0)); $per = 30;
  $where = []; $args = [];
  if ($qs !== '') { $where[] = '(LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR friend_code = ?)'; $like = '%' . strtolower($qs) . '%'; array_push($args, $like, $like, strtoupper($qs)); }
  $FILTERS = ['all' => 'Усі', 'online' => '🟢 Онлайн', 'verified' => '✓ Підтверджені', 'pending' => '⏳ Не підтвердили', 'subscribed' => '📣 Підписані', 'unsub' => '🔕 Відписані', 'admins' => '👑 Адміни', 'mods' => '🛡 Модератори', 'premium' => '💎 Преміум', 'blocked' => '⛔ Заблоковані'];
  if ($f === 'subscribed') $where[] = 'mail_ok = 1';
  if ($f === 'unsub') $where[] = 'mail_ok = 0';
  if ($f === 'verified') $where[] = 'verified_at IS NOT NULL';
  if ($f === 'pending') $where[] = 'verified_at IS NULL';
  if ($f === 'admins') $where[] = 'is_admin = 1';
  if ($f === 'blocked') $where[] = 'blocked_at IS NOT NULL';
  if ($f === 'mods') $where[] = 'is_moderator = 1';
  if ($f === 'premium') $where[] = 'premium = 1';
  $w = $where ? ' WHERE ' . implode(' AND ', $where) : '';
  /* 🟢 Остання активність = найсвіжіше з: запит у сесії (оновлюється щодві хвилини, поки вкладка відкрита),
     синхронізація прогресу, вхід. Онлайн — активність за останні 5 хвилин. */
  $A = '(SELECT MAX(s.last_seen) FROM kl_sessions s WHERE s.user_id = u.id)';
  $B = '(SELECT MAX(d.updated_at) FROM kl_user_data d WHERE d.user_id = u.id)';
  $ACT = "(CASE WHEN COALESCE($A, 0) >= COALESCE($B, 0) AND COALESCE($A, 0) >= COALESCE(u.last_login, 0) THEN COALESCE($A, 0) WHEN COALESCE($B, 0) >= COALESCE(u.last_login, 0) THEN COALESCE($B, 0) ELSE COALESCE(u.last_login, 0) END)";
  // межу часу підставляємо числом: SQLite не порівнює вираз із параметром-рядком
  if ($f === 'online') { $where[] = "$ACT > " . (time() - 300); $w = ' WHERE ' . implode(' AND ', $where); }
  $sort = (string)($_GET['sort'] ?? 'active');
  $SORTS = ['active' => '🔥 Найактивніші', 'days' => '📅 Найбільше днів', 'time' => '⏱ Найбільше часу', 'new' => '🆕 Нові'];
  if (!isset($SORTS[$sort])) $sort = 'active';
  $total = (int)one("SELECT COUNT(*) n FROM kl_users u$w", $args)['n'];
  $cols = "u.*, (SELECT COUNT(*) FROM kl_user_data d WHERE d.user_id = u.id) AS nkeys, $ACT AS act";
  if ($sort === 'days' || $sort === 'time') {
    // дні й час лежать у JSON прогресу — сортуємо в PHP (акаунтів сотні, не мільйони)
    $all = q("SELECT $cols FROM kl_users u$w", $args)->fetchAll();
    $metric = [];
    if ($all) foreach (q("SELECT user_id, k, v FROM kl_user_data WHERE k IN ('days', 'usageSec') AND user_id IN (" . implode(',', array_map(fn($r) => (int)$r['id'], $all)) . ')')->fetchAll() as $dr) {
      if ($dr['k'] === ($sort === 'days' ? 'days' : 'usageSec')) $metric[(int)$dr['user_id']] = $sort === 'days' ? count((array)json_decode((string)$dr['v'], true)) : (int)json_decode((string)$dr['v'], true);
    }
    usort($all, fn($a, $b) => [($metric[(int)$b['id']] ?? 0), (int)$b['act']] <=> [($metric[(int)$a['id']] ?? 0), (int)$a['act']]);
    $rows = array_slice($all, $page * $per, $per);
  } else {
    $rows = q("SELECT $cols FROM kl_users u$w ORDER BY " . ($sort === 'new' ? 'u.created_at DESC' : 'act DESC, u.created_at DESC') . " LIMIT $per OFFSET " . ($page * $per), $args)->fetchAll();
  }
  $online = q("SELECT u.id, u.name, u.email, $ACT AS seen, (SELECT s2.ua FROM kl_sessions s2 WHERE s2.user_id = u.id ORDER BY s2.last_seen DESC LIMIT 1) AS ua FROM kl_users u WHERE $ACT > " . (time() - 300) . " ORDER BY seen DESC LIMIT 40")->fetchAll();
  echo '<h1>Користувачі <small class="muted">(' . $total . ')</small></h1>';
  // 🟢 хто зараз на сайті в акаунті (запит за останні 5 хвилин)
  echo '<div class="card online-card"><h2><span class="on-dot"></span> Зараз онлайн <small class="muted">' . count($online) . '</small></h2>';
  if (!$online) echo '<p class="muted">Зараз нікого в акаунтах. Гості рахуються окремо — «N на сайті» вгорі.</p>';
  else {
    echo '<div class="online-list">';
    foreach ($online as $o) {
      $dev = str_contains((string)$o['ua'], '; wv)') ? '📱 застосунок' : (preg_match('/Android|iPhone|iPad|Mobile/', (string)$o['ua']) ? '📱 телефон' : '💻 комп’ютер');
      echo '<a class="online-u" href="admin.php?p=user&amp;id=' . (int)$o['id'] . '"><span class="u-ava">' . e(mb_first($o['name'])) . '</span><span><b>' . e($o['name']) . '</b><small>' . e($dev) . ' · ' . e(diag_ago_s((int)$o['seen'])) . '</small></span></a>';
    }
    echo '</div>';
  }
  echo '</div>';
  echo '<details class="card"><summary style="cursor:pointer;font:800 1.05rem Rubik,sans-serif">➕ Створити безкоштовний акаунт другу</summary><form method="post" action="admin.php?p=users" style="margin-top:12px">' . $csrf . '<input type="hidden" name="do" value="create_user">'
    . '<div class="cols2"><label class="f">Ім’я<input type="text" name="name" maxlength="30" required placeholder="Alina"></label><label class="f">Пошта<input type="email" name="email" required></label>'
    . '<label class="f">Мова листа<select name="lang"><option value="uk">Українська</option><option value="en">English</option><option value="no">Norsk</option><option value="ar">العربية</option></select></label></div>'
    . '<label class="check"><input type="checkbox" name="premium" value="1" checked> 💎 Преміум — безкоштовно назавжди</label><label class="check"><input type="checkbox" name="can_invite" value="1" checked> 🎟 Може запрошувати друзів (їхні акаунти теж безкоштовні)</label><label class="check"><input type="checkbox" name="moderator" value="1"> 🛡 Модератор (чистить стіни, дає тимчасові блокування)</label>'
    . '<p class="muted">Акаунт одразу підтверджений. Другу прийде лист із посиланням, щоб задати свій пароль.</p><button class="btn pri">Створити й надіслати лист</button></form></details><div class="card"><form class="filters" method="get"><input type="hidden" name="p" value="users"><input type="hidden" name="f" value="' . e($f) . '"><input type="search" name="q" value="' . e($qs) . '" placeholder="Ім’я, пошта або код друга…"><button class="btn">🔎 Шукати</button></form><div class="chips" style="margin-bottom:14px">';
  foreach ($FILTERS as $k => $label) echo '<a class="' . ($k === $f ? 'on' : '') . '" href="admin.php?p=users&amp;f=' . $k . '&amp;q=' . urlencode($qs) . '">' . e($label) . '</a>';
  echo '</div><div class="chips u-sort">'; foreach ($SORTS as $k => $label) echo '<a class="' . ($k === $sort ? 'on' : '') . '" href="admin.php?p=users&amp;f=' . e($f) . '&amp;sort=' . $k . '&amp;q=' . urlencode($qs) . '">' . e($label) . '</a>';
  echo '</div><table class="t"><thead><tr><th>Користувач</th><th>Статус</th><th>Код</th><th>Реєстрація</th><th>Остання активність</th><th>📣 Розсилка</th><th>📅 Днів</th><th></th></tr></thead><tbody>';
  // дні на сайті для рядків сторінки — одним запитом
  $dayN = [];
  if ($rows) foreach (q('SELECT user_id, v FROM kl_user_data WHERE k = \'days\' AND user_id IN (' . implode(',', array_map(fn($r) => (int)$r['id'], $rows)) . ')')->fetchAll() as $dr) $dayN[(int)$dr['user_id']] = user_days(json_decode((string)$dr['v'], true) ?? []);
  foreach ($rows as $u) echo '<tr><td>' . user_cell($u) . '</td><td>' . status_pills($u) . '</td><td data-l="Код"><code>' . e($u['friend_code']) . '</code></td><td data-l="Реєстрація">' . date('d.m.Y', (int)$u['created_at']) . '</td><td data-l="Активність">' . ((int)$u['act'] > time() - 300 ? '<span class="on-dot" title="онлайн зараз"></span> <b>онлайн</b>' : when((int)$u['act'] ?: null)) . '</td><td data-l="Розсилка">' . mail_switch($u, 'list') . '</td><td data-l="Днів на сайті" title="Ключів прогресу: ' . (int)$u['nkeys'] . '">' . (isset($dayN[(int)$u['id']]) ? '<b>' . $dayN[(int)$u['id']]['n'] . '</b>' . ($dayN[(int)$u['id']]['cur'] ? ' <small class="muted">🔥' . $dayN[(int)$u['id']]['cur'] . '</small>' : '') : '<span class="muted">0</span>') . '</td><td><a class="btn sm" href="admin.php?p=user&amp;id=' . (int)$u['id'] . '">Відкрити →</a></td></tr>';
  if (!$rows) echo '<tr><td colspan="8" class="muted">Нікого не знайдено.</td></tr>';
  echo '</tbody></table><div class="pager">';
  $base = 'admin.php?p=users&amp;f=' . e($f) . '&amp;q=' . urlencode($qs) . '&amp;page=';
  if ($page > 0) echo '<a class="btn sm" href="' . $base . ($page - 1) . '">← Назад</a>';
  if (($page + 1) * $per < $total) echo '<a class="btn sm" href="' . $base . ($page + 1) . '">Далі →</a>';
  echo '</div></div>';
}

/* ---------- картка користувача ---------- */
if ($p === 'user') {
  $id = int_in('id');
  $u = one('SELECT * FROM kl_users WHERE id = ?', [$id]);
  if (!$u) { echo '<div class="card"><h1>Не знайдено</h1><a href="admin.php?p=users">← До списку</a></div>'; }
  else {
    $data = q('SELECT k, LENGTH(v) AS size, updated_at FROM kl_user_data WHERE user_id = ? ORDER BY updated_at DESC', [$id])->fetchAll();
    $get = function (string $k) use ($id) { $r = one('SELECT v FROM kl_user_data WHERE user_id = ? AND k = ?', [$id, $k]); return $r ? json_decode($r['v'], true) : null; };
    $progress = (array)($get('progress') ?? []);
    $tests = 0; $stars = 0; foreach ($progress as $pr) { if (is_array($pr) && ($pr['stars'] ?? 0) > 0) { $tests++; $stars += (int)$pr['stars']; } }
    $read = 0; foreach ($data as $d) if (str_starts_with($d['k'], 'seen.')) $read++;
    $known = count((array)($get('wordsKnown') ?? []));
    $act = user_days($get('days') ?? []);
    $usage = (int)($get('usageSec') ?? 0);
    $sessions = q('SELECT created_at, last_seen, ua FROM kl_sessions WHERE user_id = ? AND expires_at > ? ORDER BY last_seen DESC LIMIT 10', [$id, time()])->fetchAll();
    $loginHistory = login_history_for_user($id, 30);
    $player = one('SELECT level, stars, badges FROM kl_players WHERE code = ?', [$u['friend_code']]);
    echo '<p><a href="admin.php?p=users">← Усі користувачі</a></p><div class="card"><div class="row" style="justify-content:space-between"><div class="u-name"><span class="u-ava" style="width:56px;height:56px;font-size:1.4rem">' . e(mb_first($u['name'])) . '</span><div><h1 style="margin:0">' . e($u['name']) . '</h1><small>' . e($u['email']) . '</small></div></div><div>' . status_pills($u) . '</div></div></div>';
    echo '<div class="stats">';
    foreach ([['📅', 'Днів на сайті', $act['n'], 'r'], ['📖', 'Коміксів відкрито', $read, 'y'], ['🧩', 'Тестів пройдено', $tests, 'g'], ['⭐', 'Зірок у тестах', $stars, 'b'], ['📝', 'Слів вивчено', $known, 'p'], ['🗂️', 'Ключів прогресу', count($data), '']] as [$ic, $l, $val, $c]) echo '<div class="stat ' . $c . '"><span>' . $ic . '</span><b>' . $val . '</b><small>' . $l . '</small></div>';
    echo '</div><div class="grid"><div class="card"><h2>👤 Дані</h2><dl class="kv"><dt>ID</dt><dd>' . (int)$u['id'] . '</dd><dt>Код друга</dt><dd><code>' . e($u['friend_code']) . '</code></dd><dt>Мова</dt><dd>' . e($u['lang']) . '</dd><dt>📣 Розсилка</dt><dd>' . mail_switch($u) . '</dd>'
      . '<dt>Реєстрація</dt><dd>' . date('d.m.Y H:i', (int)$u['created_at']) . '</dd><dt>Пошту підтверджено</dt><dd>' . ($u['verified_at'] ? date('d.m.Y H:i', (int)$u['verified_at']) : '—') . '</dd>'
      . '<dt>Остання активність</dt><dd>' . (($lastAct = max((int)(one('SELECT MAX(last_seen) AS t FROM kl_sessions WHERE user_id = ?', [$id])['t'] ?? 0), (int)(one('SELECT MAX(updated_at) AS t FROM kl_user_data WHERE user_id = ?', [$id])['t'] ?? 0), (int)$u['last_login'])) > time() - 300 ? '<span class="on-dot"></span> онлайн зараз' : when($lastAct ?: null)) . '</dd><dt>Останній успішний вхід</dt><dd>' . when($u['last_login'] ? (int)$u['last_login'] : null) . '</dd><dt>Профіль у пошуку</dt><dd>' . ($player ? '✅ ' . e($player['level']) . ' · ⭐ ' . (int)$player['stars'] . ' · 🏅 ' . (int)$player['badges'] : 'прихований') . '</dd>'
      . ($u['blocked_at'] ? '<dt>Заблоковано</dt><dd>' . date('d.m.Y H:i', (int)$u['blocked_at']) . '</dd>' : '') . '</dl>'
      . ($player ? '<p style="margin-bottom:0"><a href="./#/player/c/' . e($u['friend_code']) . '" target="_blank" rel="noopener">Публічний профіль ↗</a></p>' : '') . '</div>';
    // календар за 16 тижнів: стовпчик — тиждень (пн–нд), зафарбовано — дні з активністю
    $cal = ''; $start = strtotime('monday this week', strtotime('-15 weeks'));
    for ($w = 0; $w < 16; $w++) { $cal .= '<span class="cal-w">'; for ($d = 0; $d < 7; $d++) { $t = $start + ($w * 7 + $d) * 86400; $ds = date('Y-m-d', $t); $cal .= '<i class="' . ($t > time() ? 'fut' : (isset($act['set'][$ds]) ? 'on' : '')) . '" title="' . date('d.m.Y', $t) . (isset($act['set'][$ds]) ? ' · був(ла) на сайті' : '') . '"></i>'; } $cal .= '</span>'; }
    $fmtD = fn(string $d) => $d !== '' ? date('d.m.Y', strtotime($d)) : '—';
    echo '<div class="card act-card"><h2>📅 Активність на сайті</h2><div class="act-cal" aria-label="Дні з активністю за 16 тижнів">' . $cal . '</div>'
      . '<div class="act-lg"><span><i></i> немає</span><span><i class="on"></i> був(ла) на сайті</span></div>'
      . '<dl class="kv"><dt>Днів на сайті</dt><dd><b>' . $act['n'] . '</b></dd><dt>За останні 30 днів</dt><dd>' . $act['n30'] . '</dd>'
      . '<dt>Поточна серія</dt><dd>' . ($act['cur'] ? '🔥 ' . $act['cur'] . ' дн. поспіль' : '—') . '</dd><dt>Найдовша серія</dt><dd>' . ($act['best'] ? $act['best'] . ' дн.' : '—') . '</dd>'
      . '<dt>Перший день</dt><dd>' . $fmtD($act['first']) . '</dd><dt>Останній день</dt><dd>' . $fmtD($act['last']) . '</dd>'
      . ($usage ? '<dt>Активний час</dt><dd>' . intdiv($usage, 3600) . ' год ' . intdiv($usage % 3600, 60) . ' хв</dd>' : '') . '</dl>'
      . '<p class="muted" style="margin:.6rem 0 0;font-size:.8rem">Рахуються дні, коли людина щось робила в акаунті (читала, проходила тести, грала) — з будь-якого пристрою.</p></div>';
    echo '<div class="card"><h2>🛠️ Дії</h2><div class="row">';
    if (!$u['verified_at']) { echo act('verify', $id, '✓ Підтвердити пошту', 'ok'); echo act('resend', $id, '📬 Надіслати лист підтвердження'); }
    echo act('reset', $id, '🔑 Надіслати посилання для нового пароля', '', 'Надіслати користувачу лист для зміни пароля?');
    echo act('send_remind', $id, '📬 Нагадати про навчання', '', 'Надіслати користувачу лист-нагадування про навчання: його прогрес (дні, серія, коли був востаннє) і 3 останні новини «Що нового»? Лист піде мовою його акаунта.');
    echo act('send_apps', $id, '📲 Надіслати лист про застосунок', '', 'Надіслати користувачу лист зі посиланнями на застосунок (Android — Google Play, Windows — Microsoft Store, iPhone — незабаром)? Лист піде мовою його акаунта.');
    echo act('kick', $id, '🚪 Завершити всі сесії', '', 'Вийти з усіх пристроїв цього користувача?');
    echo $u['is_admin'] ? act('admin_off', $id, '👑 Забрати права адміна', '', 'Забрати права адміністратора?') : act('admin_on', $id, '👑 Зробити адміном', '', 'Надати повний доступ до адмін-панелі?');
    echo $u['blocked_at'] ? act('unblock', $id, '✅ Розблокувати', 'ok') : act('block', $id, '⛔ Заблокувати', 'danger', 'Заблокувати користувача? Він не зможе увійти, а профіль зникне з пошуку.');
    echo '</div><h3 style="margin-top:14px">💎 Доступ і ролі</h3><div class="row">';
    echo !empty($u['premium']) ? act('premium_off', $id, '💎 Зняти преміум') : act('premium_on', $id, '💎 Зробити преміум (безкоштовно)', 'ok');
    echo !empty($u['can_invite']) ? act('invite_off', $id, '🎟 Заборонити запрошувати') : act('invite_on', $id, '🎟 Дозволити запрошувати друзів', 'ok');
    echo !empty($u['is_moderator']) ? act('mod_off', $id, '🛡 Зняти модератора') : act('mod_on', $id, '🛡 Зробити модератором', '', 'Модератор зможе прибирати дописи на стінах і тимчасово блокувати авторів. Продовжити?');
    echo '</div><h3 style="margin-top:14px">🔑 Пароль</h3><div class="row">';
    echo act('set_pass', $id, 'Задати пароль вручну', '', 'Задати новий пароль і завершити всі сесії користувача?', '<input type="text" name="pass" minlength="8" placeholder="щонайменше 8 символів" autocomplete="off" style="margin-bottom:8px;max-width:260px">');
    echo '</div><h3 style="margin-top:14px">💬 Стіни</h3><div class="row">';
    echo act('warn', $id, '⚠️ Надіслати попередження');
    echo '</div><h3 style="margin-top:14px">✉️ Своє звернення</h3>'
      . '<p class="muted">Текст побачить лише ця людина — окремим вікном, коли наступного разу відкриє сайт. Готове попередження вище не пояснює, за що саме; тут можна сказати словами.</p><div class="row">'
      . act('note', $id, '✉️ Надіслати', 'pri', '', '<textarea name="note" rows="3" maxlength="300" placeholder="Напишіть, що саме не так і що зробити" style="margin-bottom:8px"></textarea>');
    echo '</div><h3 style="margin-top:14px">💬 Стіни</h3><div class="row">';
    foreach ([1 => '1 год', 24 => '1 добу', 168 => '7 днів', 720 => '30 днів'] as $hh => $lbl) echo act('wall_ban', $id, '⛔ Заборонити писати на ' . $lbl, '', 'Тимчасово заборонити писати на стінах?', '<input type="hidden" name="hours" value="' . $hh . '">');
    $bans = q('SELECT * FROM kl_bans WHERE user_id = ? AND until_at > ? ORDER BY until_at DESC', [$id, time()])->fetchAll();
    foreach ($bans as $b) echo act('unban', $id, '✅ Зняти блок до ' . date('d.m H:i', (int)$b['until_at']), 'ok', '', '<input type="hidden" name="ban" value="' . (int)$b['id'] . '">');
    $invs = q('SELECT i.created_at, i.used_at, x.name, x.id AS xid FROM kl_invites i LEFT JOIN kl_users x ON x.id = i.used_by WHERE i.inviter_id = ? ORDER BY i.created_at DESC LIMIT 30', [$id])->fetchAll();
    $invited = $u['invited_by'] ? one('SELECT id, name FROM kl_users WHERE id = ?', [(int)$u['invited_by']]) : null;
    if ($invited) echo '</div><p style="margin-top:12px">🎟 Запрошення від <a href="admin.php?p=user&amp;id=' . (int)$invited['id'] . '">' . e($invited['name']) . '</a></p><div>';
    if ($invs) { echo '</div><h3 style="margin-top:14px">🎟 Запрошення (' . count($invs) . ')</h3><ul class="list">'; foreach ($invs as $iv) echo '<li><span>' . ($iv['used_at'] ? '✅ <a href="admin.php?p=user&amp;id=' . (int)$iv['xid'] . '">' . e($iv['name']) . '</a>' : '⏳ ще не використане') . '</span><small class="muted">' . date('d.m.Y', (int)$iv['created_at']) . '</small></li>'; echo '</ul><div>'; }
    echo '</div><hr style="border:0;border-top:3px dashed var(--line);margin:16px 0"><h3>🗑️ Видалити акаунт</h3><p class="muted">Видаляє акаунт, прогрес, профіль і коментарі. Введіть пошту користувача для підтвердження.</p>';
    echo act('delete', $id, 'Видалити назавжди', 'danger', 'Видалити акаунт і всі дані назавжди?', '<input type="email" name="confirm" placeholder="' . e($u['email']) . '" style="margin-bottom:8px">');
    echo '</div><div class="card"><h2>🛡️ Історія входів (' . count($loginHistory) . ')</h2><p class="muted">Останні успішні входи за 30 днів. IP-адреси зашифровані в базі й доступні лише адміністраторам.</p><ul class="list">';
    foreach ($loginHistory as $lh) echo '<li><div><code>' . e((string)$lh['ip']) . '</code><br><small>' . e(ua_short((string)$lh['ua'])) . ' · ' . e(login_method_label((string)$lh['method'])) . '</small></div><small class="muted">' . date('d.m.Y H:i', (int)$lh['created_at']) . '</small></li>';
    if (!$loginHistory) echo '<li class="muted">Історія з’явиться після наступного успішного входу.</li>';
    echo '</ul></div><div class="card"><h2>💻 Активні сесії (' . count($sessions) . ')</h2><ul class="list">';
    foreach ($sessions as $s) echo '<li><div><small>' . e(ua_short($s['ua'])) . '</small></div><small class="muted">' . when((int)$s['last_seen']) . '</small></li>';
    if (!$sessions) echo '<li class="muted">Немає активних сесій.</li>';
    echo '</ul></div><div class="card"><h2>🗂️ Прогрес на сервері</h2><details><summary style="cursor:pointer;font-weight:800">Показати ключі (' . count($data) . ')</summary><ul class="list" style="margin-top:10px">';
    foreach ($data as $d) echo '<li><code>' . e($d['k']) . '</code><small class="muted">' . number_format((int)$d['size'] / 1024, 1) . ' КБ · ' . when((int)$d['updated_at']) . '</small></li>';
    echo '</ul></details></div></div>';
  }
}
function mb_substr_s(string $s, int $n): string { return preg_match('/^.{0,' . $n . '}/us', $s, $m) ? $m[0] : substr($s, 0, $n); }
// віртуальні гравці-боти живуть у коді (assets/bots.js) — показуємо їх окремим списком
function bots_list(): array {
  $src = @file_get_contents(__DIR__ . '/assets/bots.js');
  if (!$src) return [];
  preg_match_all("/\{\s*code:\s*'([A-Z0-9]{6})'.*?name:\s*'([^']*)'.*?avatar:\s*'([^']*)'.*?level:\s*'([^']*)'.*?diff:\s*'([^']*)'.*?stars:\s*(\d+).*?badges:\s*(\d+).*?streak:\s*(\d+).*?games:\s*(\d+).*?raceWins:\s*(\d+)/s", $src, $m, PREG_SET_ORDER);
  return array_map(fn($x) => ['code' => $x[1], 'name' => $x[2], 'avatar' => $x[3], 'level' => $x[4], 'diff' => $x[5], 'stars' => (int)$x[6], 'badges' => (int)$x[7], 'streak' => (int)$x[8], 'games' => (int)$x[9], 'wins' => (int)$x[10]], $m);
}
function ua_short(string $ua): string {
  $os = preg_match('/iPhone|iPad/', $ua) ? '📱 iOS' : (str_contains($ua, 'Android') ? '📱 Android' : (str_contains($ua, 'Windows') ? '💻 Windows' : (str_contains($ua, 'Mac OS') ? '💻 macOS' : (str_contains($ua, 'Linux') ? '💻 Linux' : '🌐'))));
  $br = str_contains($ua, 'Edg/') ? 'Edge' : (str_contains($ua, 'Firefox') ? 'Firefox' : (str_contains($ua, 'Chrome') ? 'Chrome' : (str_contains($ua, 'Safari') ? 'Safari' : '')));
  return trim("$os $br") ?: 'невідомий пристрій';
}
function login_method_label(string $method): string {
  return ['password' => 'пароль', 'email_link' => 'посилання з листа', 'email_code' => 'код з листа', 'email_verify' => 'підтвердження email',
    'totp' => 'автентифікатор', 'backup' => 'резервний код', 'reset' => 'новий пароль', 'google' => 'Google', 'admin' => 'адмін-панель',
    'demo' => 'демо', 'account' => 'акаунт'][$method] ?? 'акаунт';
}

/* ---------- матеріали ---------- */
if ($p === 'materials') {
  $CATS = ['hverdag' => '☀️ Щоденне життя', 'familie' => '👨‍👩‍👧 Сім’я', 'skole' => '🏫 Школа', 'jobb' => '💼 Робота', 'fritid' => '⚽ Дозвілля', 'mat' => '🍎 Їжа', 'butikk' => '🛒 Магазин',
    'natur' => '🌲 Природа', 'helse' => '🩺 Здоров’я', 'bolig' => '🏠 Житло', 'kultur' => '🎭 Культура', 'grammatikk' => '📐 Граматика'];
  $CODE_CATS = ['basics' => '🧭 Основи', 'web' => '🌐 HTML, CSS і JavaScript', 'game' => '🎮 Ігрова розробка', 'blender' => '🧊 Blender і 3D', 'unity' => '🕹️ Unity', 'data' => '🗄️ Бази даних',
    'personal-safety' => '🚨 Безпека в житті', 'cyber-safety' => '🛡️ Безпека онлайн', 'scam-awareness' => '🔎 Розпізнай шахрайство', 'device-safety' => '📱 Захист пристроїв',
    'secure-coding' => '🔐 Безпечне програмування', 'hackers' => '🕵️ Хакери та кіберзахист'];
  $TRACKS = [
    'no' => ['flag' => '🇳🇴', 'title' => 'Норвезька', 'hint' => 'Комікси й тести курсу норвезької'],
    'en' => ['flag' => '🇬🇧', 'title' => 'Англійська', 'hint' => 'Окремий англійський курс та його тести'],
    'code' => ['flag' => '💻', 'title' => 'Програмування', 'hint' => 'Основи коду, web, ігри, 3D та бази даних'],
  ];
  $trackF = (string)($_GET['track'] ?? 'no');
  if (!isset($TRACKS[$trackF])) $trackF = 'no';
  $lvF = (string)($_GET['lv'] ?? '');
  $catF = (string)($_GET['cat'] ?? '');
  $qF = trim((string)($_GET['q'] ?? ''));
  $sortF = (string)($_GET['sort'] ?? '');

  /* data/comics.json створює tools/build.js із уже виконаних даних застосунку.
     Так адмінка бачить і звичайні об'єкти, і серії, створені через L('p233', ...),
     не намагаючись розбирати JavaScript регулярними виразами. */
  $readValue = static function (string $src, string $key): string {
    $key = preg_quote($key, '/');
    if (!preg_match('/\\b' . $key . '\\s*:\\s*(?:\'((?:[^\'\\\\]|\\\\.)*)\'|"((?:[^"\\\\]|\\\\.)*)")/s', $src, $m)) return '';
    return stripcslashes($m[1] !== '' ? $m[1] : ($m[2] ?? ''));
  };
  $all = [];
  $catalogFile = __DIR__ . '/data/comics.json';
  $catalog = is_file($catalogFile) ? json_decode((string)file_get_contents($catalogFile), true) : [];
  if (!is_array($catalog)) $catalog = [];
  foreach ($catalog as $item) {
    if (!is_array($item) || !preg_match('/^p\\d+$/', (string)($item['id'] ?? ''))) continue;
    $id = (string)$item['id'];
    $isCode = (($item['category'] ?? '') === 'koding');
    $source = (string)($item['file'] ?? '');
    $sourcePath = $source !== '' ? __DIR__ . '/' . ltrim($source, '/') : '';
    $all[] = ['id' => $id, 'metric' => $id, 'track' => $isCode ? 'code' : 'no', 'level' => (string)($item['level'] ?? ''),
      'cat' => $isCode ? (string)($item['track'] ?? 'basics') : (string)($item['category'] ?? ''),
      'title' => (string)($item['title'] ?? ''), 'uk' => (string)($item['titleUk'] ?? ''), 'other' => (string)($item['titleEn'] ?? ''), 'otherFlag' => '🇬🇧',
      'panels' => (int)($item['panels'] ?? 0), 'lines' => (int)($item['lines'] ?? 0),
      'kb' => $sourcePath !== '' && is_file($sourcePath) ? round(filesize($sourcePath) / 1024) : 0,
      'at' => $sourcePath !== '' && is_file($sourcePath) ? (int)filemtime($sourcePath) : (int)filemtime($catalogFile)];
  }

  /* Англійські історії розкладені між english.js, english2.js та english3.js. */
  foreach (glob(__DIR__ . '/data/english*.js') ?: [] as $file) {
    $src = (string)file_get_contents($file);
    preg_match_all('/\\bid\\s*:\\s*[\'\"](e\\d+)[\'\"]/', $src, $hits, PREG_OFFSET_CAPTURE);
    foreach ($hits[1] ?? [] as $i => $hit) {
      $from = (int)$hits[0][$i][1];
      $to = isset($hits[0][$i + 1]) ? (int)$hits[0][$i + 1][1] : strlen($src);
      $chunk = substr($src, $from, $to - $from);
      $g = fn(string $key): string => $readValue($chunk, $key);
      $id = (string)$hit[0];
      $all[] = ['id' => $id, 'metric' => 'en:' . $id, 'track' => 'en', 'level' => $g('level'), 'cat' => $g('category'),
        'title' => $g('title'), 'uk' => $g('titleUk'), 'other' => $g('titleNo'), 'otherFlag' => '🇳🇴',
        'panels' => preg_match_all('/\{\s*art\s*:/', $chunk), 'lines' => preg_match_all('/\\bwho\\s*:/', $chunk),
        'kb' => round(strlen($chunk) / 1024), 'at' => (int)filemtime($file)];
    }
  }

  $reads = comic_reads();
  $quiz = comic_quizzes();
  foreach ($all as &$c) {
    $r = $reads[$c['metric']] ?? ['opened' => 0, 'counts' => []];
    $c['opened'] = (int)$r['opened'];
    $c['done'] = count(array_filter($r['counts'], fn($n) => $c['panels'] > 0 && $n >= $c['panels']));
    $qz = $quiz[$c['metric']] ?? ['n' => 0, 'stars' => 0];
    $c['quiz'] = (int)$qz['n'];
    $c['stars'] = $qz['n'] > 0 ? round($qz['stars'] / $qz['n'], 1) : 0;
  }
  unset($c);

  $counts = [];
  foreach (array_keys($TRACKS) as $key) $counts[$key] = count(array_filter($all, fn($c) => $c['track'] === $key));
  $comics = array_values(array_filter($all, fn($c) => $c['track'] === $trackF));
  $catLabels = $trackF === 'code' ? $CODE_CATS : $CATS;
  if ($catF !== '' && !isset($catLabels[$catF])) $catF = '';
  $byLv = array_count_values(array_column($comics, 'level'));
  $nUsers = (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE is_demo IS NULL OR is_demo = 0')['n'] ?? 0);
  $totOpen = array_sum(array_column($comics, 'opened'));
  $totDone = array_sum(array_column($comics, 'done'));
  $unread = count(array_filter($comics, fn($x) => $x['opened'] === 0));

  echo '<h1>Матеріали <small class="muted">· ' . e($TRACKS[$trackF]['title']) . '</small></h1>';
  echo '<nav class="material-tracks" aria-label="Розділи матеріалів">';
  foreach ($TRACKS as $key => $meta) {
    echo '<a class="material-track' . ($trackF === $key ? ' on' : '') . '" href="admin.php?p=materials&amp;track=' . e($key) . '"' . ($trackF === $key ? ' aria-current="page"' : '') . '>'
      . '<span class="material-track-icon">' . $meta['flag'] . '</span><span><b>' . e($meta['title']) . '</b><small>' . e($meta['hint']) . '</small></span><strong>' . $counts[$key] . '</strong></a>';
  }
  echo '</nav>';

  echo '<div class="stats">'
    . '<div class="stat y"><span>📚</span><b>' . count($comics) . '</b><small>Історій у розділі</small></div>'
    . '<div class="stat g"><span>🖼️</span><b>' . array_sum(array_column($comics, 'panels')) . '</b><small>Кадрів</small></div>'
    . '<div class="stat b"><span>💬</span><b>' . array_sum(array_column($comics, 'lines')) . '</b><small>Реплік</small></div>'
    . '<div class="stat b"><span>👁️</span><b>' . $totOpen . '</b><small>Відкривань</small></div>'
    . '<div class="stat g"><span>✅</span><b>' . $totDone . '</b><small>Дочитувань</small></div>'
    . '<div class="stat' . ($unread ? ' r' : '') . '"><span>🕳️</span><b>' . $unread . '</b><small>Ніхто не відкривав</small></div>'
    . '</div>';

  /* Чесно пишемо, звідки числа: інакше «3 відкривання» виглядає як провал теми,
     хоча насправді більшість читачів — гості, і їх тут не видно. */
  echo '<p class="muted" style="margin-top:-6px">Прочитання зібрані з прогресу <b>' . $nUsers . '</b> акаунтів, які синхронізувалися. Читачі без акаунта сюди не потрапляють, тому справжні числа більші.</p>';

  // ── фільтри ──
  $qs = function (array $over) use ($trackF, $lvF, $catF, $qF, $sortF) {
    $a = array_filter(['track' => $trackF, 'lv' => $lvF, 'cat' => $catF, 'q' => $qF, 'sort' => $sortF], fn($v) => $v !== '');
    foreach ($over as $k => $v) { if ($v === '') unset($a[$k]); else $a[$k] = $v; }
    return 'admin.php?p=materials' . ($a ? '&amp;' . http_build_query($a, '', '&amp;') : '');
  };
  echo '<form method="get" action="admin.php" class="filters">'
    . '<input type="hidden" name="p" value="materials">'
    . '<input type="hidden" name="track" value="' . e($trackF) . '">'
    . '<input type="search" name="q" value="' . e($qF) . '" placeholder="Пошук за назвою або кодом…" style="flex:1 1 240px">'
    . '<select name="cat"><option value="">Усі теми</option>';
  foreach ($catLabels as $k => $label) echo '<option value="' . e($k) . '"' . ($catF === $k ? ' selected' : '') . '>' . e($label) . '</option>';
  echo '</select><select name="lv"><option value="">Усі рівні</option>';
  foreach (['A1', 'A2', 'B1', 'B2'] as $l) echo '<option value="' . $l . '"' . ($lvF === $l ? ' selected' : '') . '>' . $l . ' (' . ($byLv[$l] ?? 0) . ')</option>';
  echo '</select><select name="sort">'
    . '<option value="">За темою й рівнем</option>'
    . '<option value="top"' . ($sortF === 'top' ? ' selected' : '') . '>Найчитаніші</option>'
    . '<option value="cold"' . ($sortF === 'cold' ? ' selected' : '') . '>Найменш читані</option>'
    . '<option value="new"' . ($sortF === 'new' ? ' selected' : '') . '>Найновіші</option>'
    . '<option value="big"' . ($sortF === 'big' ? ' selected' : '') . '>Найдовші</option>'
    . '</select>'
    . '<button class="btn pri">Показати</button>'
    . ($lvF || $catF || $qF !== '' || $sortF ? ' <a class="btn" href="admin.php?p=materials&amp;track=' . e($trackF) . '">Скинути</a>' : '')
    . '</form>';

  echo '<div class="chips" style="margin-bottom:14px"><a class="' . ($lvF === '' ? 'on' : '') . '" href="' . $qs(['lv' => '']) . '">Усі рівні</a>';
  foreach (['A1', 'A2', 'B1', 'B2'] as $l) echo '<a class="' . ($lvF === $l ? 'on' : '') . '" href="' . $qs(['lv' => $l]) . '">' . $l . ' <small>(' . ($byLv[$l] ?? 0) . ')</small></a>';
  echo '</div>';

  // ── відбір ──
  $needle = mb_lower($qF);
  $show = array_values(array_filter($comics, function (array $c) use ($lvF, $catF, $needle) {
    if ($lvF !== '' && $c['level'] !== $lvF) return false;
    if ($catF !== '' && $c['cat'] !== $catF) return false;
    if ($needle === '') return true;
    $hay = mb_lower($c['id'] . ' ' . $c['title'] . ' ' . $c['uk'] . ' ' . $c['other']);
    return str_contains($hay, $needle);
  }));

  /* Картка коміксу. Обкладинка — той самий img/<id>.svg, що й на пошукових
     сторінках, тож нічого не треба генерувати окремо для панелі. */
  /* Обкладинку шукаємо так само, як її шукає збірка: намальована img/<id>.svg,
     а для фотоколміксів — перший кадр із photo/. Якщо немає нічого, лишається
     сіра пляма: краще рівна сітка з однією дірою, ніж картка іншої висоти. */
  $coverSrc = function (string $id): string {
    if (is_file(__DIR__ . '/img/' . $id . '.svg')) return 'img/' . $id . '.svg';
    foreach (glob(__DIR__ . '/photo/' . $id . '-*') ?: [] as $f) return 'photo/' . basename($f);
    return '';
  };
  $card = function (array $c) use ($coverSrc, $catLabels): string {
    $src = $coverSrc($c['id']);
    $img = $src !== ''
      ? '<img class="comic-cover" src="' . e($src) . '" alt="" loading="lazy" width="320" height="240">'
      : '<span class="comic-cover material-cover ' . e($c['track']) . '"><span>' . ($c['track'] === 'en' ? '🇬🇧' : ($c['track'] === 'code' ? '💻' : '🇳🇴')) . '</span><b>' . e($c['level']) . '</b></span>';
    $warm = $c['opened'] === 0 ? '<span class="pill r" title="Ніхто з акаунтів не відкривав">🕳️ 0</span>'
      : '<span class="pill b" title="Скільки акаунтів відкривали">👁️ ' . $c['opened'] . '</span>'
        . ' <span class="pill g" title="Скільки дійшли до останнього кадру">✅ ' . $c['done'] . '</span>';
    $qz = $c['quiz'] > 0 ? '<span class="pill y" title="Склали тест · середні зірки">🧩 ' . $c['quiz'] . ' · ⭐ ' . $c['stars'] . '</span>' : '';
    return '<div class="comic">' . $img
      . '<div class="row" style="justify-content:space-between"><span class="pill ' . e($c['level']) . '">' . e($c['level']) . '</span><code>' . e($c['id']) . '</code></div>'
      . '<b>' . e($c['title']) . '</b>'
      . '<small>🇺🇦 ' . e($c['uk']) . '<br>' . $c['otherFlag'] . ' ' . e($c['other']) . '</small>'
      . '<small>' . e($catLabels[$c['cat']] ?? $c['cat']) . ' · 🖼️ ' . $c['panels'] . ' · 💬 ' . $c['lines'] . ' · ' . $c['kb'] . ' КБ</small>'
      . '<div class="row">' . $warm . ' ' . $qz . '</div>'
      . '<div class="row"><a class="btn sm" href="./#/' . ($c['track'] === 'en' ? 'english/' : 'read/') . e($c['id']) . '/0" target="_blank" rel="noopener">📖 Читати</a>'
      . '<a class="btn sm" href="./#/quiz/' . ($c['track'] === 'en' ? 'en/' : '') . e($c['id']) . '" target="_blank" rel="noopener">🧩 Тест</a></div></div>';
  };

  if (!$show) {
    echo '<div class="card muted">Нічого не знайшлося. <a href="admin.php?p=materials&amp;track=' . e($trackF) . '">Скинути фільтри</a></div>';
  } elseif ($sortF === '') {
    // ── звичайний вигляд: групами за темою ──
    $groups = [];
    foreach ($show as $c) $groups[$c['cat']][] = $c;
    $ord = function (string $k) use ($catLabels): int { $i = array_search($k, array_keys($catLabels), true); return $i === false ? 99 : (int)$i; };
    uksort($groups, fn($a, $b) => $ord((string)$a) <=> $ord((string)$b));
    foreach ($groups as $cat => $list) {
      usort($list, fn($a, $b) => strcmp($a['level'], $b['level']) ?: strnatcmp($a['id'], $b['id']));
      echo '<section class="cat"><h2>' . e($catLabels[$cat] ?? $cat) . ' <span class="pill">' . count($list) . '</span></h2><div class="comics">';
      foreach ($list as $c) echo $card($c);
      echo '</div></section>';
    }
  } else {
    // ── відсортований вигляд: один рівний список, інакше сортування губиться в групах ──
    usort($show, match ($sortF) {
      'top' => fn($a, $b) => $b['opened'] <=> $a['opened'] ?: $b['done'] <=> $a['done'],
      'cold' => fn($a, $b) => $a['opened'] <=> $b['opened'] ?: strnatcmp($a['id'], $b['id']),
      'new' => fn($a, $b) => $b['at'] <=> $a['at'],
      default => fn($a, $b) => $b['panels'] <=> $a['panels'],
    });
    echo '<section class="cat"><h2>Знайдено <span class="pill">' . count($show) . '</span></h2><div class="comics">';
    foreach ($show as $c) echo $card($c);
    echo '</div></section>';
  }

  $other = ['data/grammar.js' => '📐 Граматика (A1–B2)', 'data/words.js' => '📝 Слова за темами', 'data/basics.js' => '🔤 Норвезький алфавіт і числа', 'data/dictionary.js' => '📖 Словник NO→UK', 'data/dictionary-en.js' => '📖 Словник EN', 'data/characters.js' => '🎭 Персонажі'];
  echo '<div class="card"><h2>🧰 Інші навчальні матеріали</h2><ul class="list">';
  foreach ($other as $f => $label) if (is_file(__DIR__ . '/' . $f)) echo '<li><b>' . $label . '</b><small class="muted"><code>' . e($f) . '</code> · ' . round(filesize(__DIR__ . '/' . $f) / 1024) . ' КБ · ' . date('d.m.Y', filemtime(__DIR__ . '/' . $f)) . '</small></li>';
  echo '</ul><p class="muted" style="margin-bottom:0">Матеріали редагуються у вихідному проєкті й заливаються новою збіркою <code>dist/</code>.</p></div>';
}

/* ---------- спільнота ---------- */
if ($p === 'community') { echo mod_css(); mod_render(preg_replace('/[^a-z]/', '', (string)($_GET['t'] ?? 'queue')), $isAdmin, $csrf); }

/* ---------- переклади ---------- */
if ($p === 'translations') {
  $f = __DIR__ . '/data/i18n-stats.json';
  $st = is_file($f) ? json_decode((string)file_get_contents($f), true) : null;
  echo '<h1>Переклади</h1>';
  if (!$st || empty($st['langs'])) {
    echo '<div class="card"><p class="muted">Немає <code>data/i18n-stats.json</code>. Він зʼявляється під час збірки: <code>node tools/build.js</code>.</p></div>';
  } else {
    $thr = (int)($st['seoThreshold'] ?? 80);
    $langs = $st['langs'];
    $ready = array_filter($langs, fn($v) => $v['total'] && $v['has'] / $v['total'] >= $thr / 100);

    echo '<p class="muted">Англійська — джерело: усе, що є нею, має бути перекладене. Українська й норвезька вбудовані в самі дані коміксів, решта мов живе в пакетах, де ключем є англійський рядок.</p>';
    echo '<div class="stats">'
      . '<div class="stat g"><span>✅</span><b>' . count($ready) . '</b><small>мов готові до пошукових сторінок</small></div>'
      . '<div class="stat r"><span>⏳</span><b>' . (count($langs) - count($ready)) . '</b><small>ще не дотягують до ' . $thr . '%</small></div>'
      . '<div class="stat b"><span>🔤</span><b>' . number_format((int)(reset($langs)['total'] ?? 0), 0, ',', ' ') . '</b><small>рядків на одну мову</small></div>'
      . '<div class="stat"><span>🕒</span><b style="font-size:1rem">' . e($st['built'] ?? '') . '</b><small>зібрано</small></div>'
      . '</div>';

    /* Смужка показує стан швидше за число: око ловить довжину, а не відсоток. */
    $bar = function (int $has, int $total) use ($thr) {
      $pct = $total ? (int)round($has / $total * 100) : 0;
      $cls = $pct >= $thr ? 'ok' : ($pct >= 40 ? 'mid' : 'low');
      return '<span class="tr-bar"><i class="' . $cls . '" style="width:' . $pct . '%"></i></span>'
        . '<b class="tr-pct">' . $pct . '%</b> <small class="muted">' . $has . '/' . $total . '</small>';
    };

    echo '<div class="card"><h2>📊 Скільки перекладено</h2><table class="t"><thead><tr><th>Мова</th><th>Разом</th>';
    $groupKeys = array_keys(reset($langs)['groups'] ?? []);
    $groupNames = [];
    foreach (reset($langs)['groups'] ?? [] as $k => $g) { $groupNames[$k] = $g['label']; echo '<th>' . e($g['label']) . '</th>'; }
    echo '</tr></thead><tbody>';
    foreach ($langs as $code => $L) {
      echo '<tr><td><b>' . e($L['name']) . '</b> <code>' . e($code) . '</code><br><small class="muted">' . ($L['builtin'] ? 'у самих даних' : 'пакет перекладів') . '</small></td>';
      echo '<td data-l="Разом">' . $bar((int)$L['has'], (int)$L['total']) . '</td>';
      foreach ($groupKeys as $k) {
        $g = $L['groups'][$k] ?? ['has' => 0, 'total' => 0];
        echo '<td data-l="' . e($groupNames[$k] ?? $k) . '">' . $bar((int)$g['has'], (int)$g['total']) . '</td>';
      }
      echo '</tr>';
    }
    echo '</tbody></table></div>';

    /* Поріг не вигаданий: нижче за нього сторінка виходить із заголовком однією
       мовою й тілом іншою, і пошукові системи вважають її неповною копією. */
    echo '<div class="card"><h2>🌐 Чому сторінки не всіма мовами</h2>'
      . '<p>Пошукові сторінки виходять лише тими мовами, де перекладено щонайменше <b>' . $thr . '%</b>. Нижче за цей поріг сторінка складається із заголовка однією мовою й тіла іншою — саме такі напівпорожні копії пошукові системи й карають, тож від них більше шкоди, ніж користі.</p>'
      . '<p class="muted">Найважливіші для сторінки — <b>описи</b> й <b>назви</b>: з них складаються заголовок і опис у видачі. Далі йдуть репліки — це тіло сторінки.</p>'
      . '<ul class="list">';
    foreach ($langs as $code => $L) {
      $pct = $L['total'] ? (int)round($L['has'] / $L['total'] * 100) : 0;
      $ok = $pct >= $thr;
      $need = [];
      foreach ($L['groups'] as $g) if ($g['total'] && $g['has'] < $g['total']) $need[] = $g['label'] . ' (' . ($g['total'] - $g['has']) . ')';
      echo '<li><div><b>' . e($L['name']) . '</b> — ' . ($ok ? '<span class="pill g">сторінки виходять</span>' : '<span class="pill r">поки ні, ' . $pct . '%</span>')
        . ($need ? '<br><small class="muted">бракує: ' . e(implode(' · ', array_slice($need, 0, 4))) . '</small>' : '')
        . '</div></li>';
    }
    echo '</ul></div>';

    /* Список того, чого бракує: без нього сторінка каже «мало», але не каже
       «що саме», і працювати з нею неможливо. */
    echo '<div class="card"><h2>🔍 Що саме не перекладено</h2><p class="muted">Перші сорок рядків кожної групи — щоб було з чого почати. Повний перелік складає збірка.</p>';
    foreach ($langs as $code => $L) {
      if ($L['total'] && $L['has'] >= $L['total']) continue;
      echo '<details class="au-det"><summary><b>' . e($L['name']) . '</b> <code>' . e($code) . '</code> — бракує ' . ((int)$L['total'] - (int)$L['has']) . '</summary>';
      foreach ($L['groups'] as $g) {
        if (empty($g['missing'])) continue;
        echo '<h3 style="margin:10px 0 4px">' . e($g['label']) . ' <span class="pill r">' . ((int)$g['total'] - (int)$g['has']) . '</span></h3><ul class="tr-miss">';
        foreach ($g['missing'] as $m) echo '<li>' . e($m) . '</li>';
        echo '</ul>';
      }
      echo '</details>';
    }
    echo '</div>';

    echo '<div class="card"><h2>🛠 Як доперекласти</h2>'
      . '<p>Пакети збираються з таблиць у <code>tools/lang/&lt;мова&gt;/*.tsv</code>: перша колонка — англійський рядок, друга — переклад. Після правок:</p>'
      . '<p><code>node tools/build-langpack.js de</code> → <code>node tools/build.js</code> → <code>node tools/deploy.js</code></p>'
      . '<p class="muted">Українська й норвезька правляться не в пакетах, а просто в даних коміксу: поля <code>titleUk</code>, <code>summaryUk</code> й <code>uk</code> у кожній репліці.</p></div>';
  }
}

/* ---------- система ---------- */
if ($p === 'voice') {
  $prov = ai_provider(); $aiKey = ai_cfg('key');
  $mask = fn(string $k) => $k === '' ? '<span class="pill r">не задано</span>' : '<span class="pill g">задано</span> <code>' . e(substr($k, 0, 6) . '…' . substr($k, -4)) . '</code>';
  $RT_VOICES = ['marin', 'cedar', 'alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse'];
  $TTS_VOICES = ['nb-NO-PernilleNeural', 'nb-NO-IselinNeural', 'nb-NO-FinnNeural', 'en-US-AvaMultilingualNeural'];
  $opt = fn(array $list, string $cur) => implode('', array_map(fn($v) => '<option value="' . e($v) . '"' . ($v === $cur ? ' selected' : '') . '>' . e($v) . '</option>', $list));
  echo '<h1>Голос і ШІ</h1><p class="muted">Тут налаштовується телефонна розмова: яка модель відповідає, яким голосом і як вона поводиться. Ключі API лежать лише в <code>api/config.php</code> на сервері — у панелі їх не видно й не редагують.</p>';
  echo '<div class="grid"><div class="card"><h2>🔑 Ключі (з config.php)</h2><dl class="kv">'
    . '<dt>Провайдер ШІ</dt><dd>' . e($prov) . '</dd>'
    . '<dt>Ключ ШІ</dt><dd>' . $mask($aiKey) . '</dd>'
    . '<dt>Голосовий режим</dt><dd>' . ($prov === 'openai' && $aiKey !== '' ? '✅ доступний (OpenAI Realtime)' : '⚠️ потрібен ключ OpenAI') . '</dd>'
    . '<dt>Синтез мови</dt><dd>' . e(tts_provider()) . (tts_provider() === 'edge' ? ' <span class="muted">(безкоштовні нейроголоси Microsoft)</span>' : '') . '</dd>'
    /* Вимикач із config.php показуємо тут навмисно: інакше незрозуміло, чому
       налаштування нижче збереглося, а голосу на сайті все одно немає. */
    . '<dt>Вимикач ШІ</dt><dd>' . (feature_off('ai') ? '⛔ вимкнено в <code>config.php</code> (<code>ai.enabled = false</code>) — налаштування нижче не діють' : '✅ увімкнено') . '</dd>'
    . '<dt>Працює на ключі</dt><dd>' . (ai_ready()
        ? implode(' · ', array_filter([
            ai_feature_on('write') ? '✍️ письмо' : null,
            ai_feature_on('chat') ? '💬 розмова' : null,
            ai_feature_on('realtime') ? '🎧 дзвінок' : null,
          ])) ?: '⛔ нічого — усі можливості вимкнені'
        : '⛔ ключ не задано') . '</dd>'
    . '<dt>Модель для письма</dt><dd><code>' . e(ai_write_model()) . '</code></dd>'
    . '<dt>Вимикач голосу</dt><dd>' . (feature_off('tts')
        ? '⛔ вимкнено в <code>config.php</code> (<code>tts.enabled = false</code>) — кнопок живого голосу на сайті немає'
        : (tts_provider() === 'none' ? '⛔ провайдер «none» — кнопок живого голосу на сайті немає' : '✅ увімкнено')) . '</dd>'
    . '</dl><form method="post" action="admin.php?p=voice" style="margin-top:10px">' . $csrf . '<input type="hidden" name="do" value="ai_test"><button class="btn">🔊 Перевірити голос</button></form></div>';

  /* Три можливості — три рядки витрат. Показуємо їх разом і з цінником у
     словах, бо рішення «що лишити» ухвалюють саме за цим, а не за назвами. */
  $chk = fn(string $k, bool $def) => (ai_get('use_' . $k, $def ? '1' : '0') === '1' ? ' checked' : '');
  echo '<div class="card"><h2>🎛️ Що працює на ключі</h2>'
    . '<p class="muted">Ключ один, а витрачають його три різні можливості. Вимкнена — зникає з сайту сама, без повідомлень про помилку.</p>'
    . '<form method="post" action="admin.php?p=voice">' . $csrf . '<input type="hidden" name="do" value="ai_save">'
    . '<label class="check"><input type="checkbox" name="use_write" value="1"' . $chk('write', true) . '><span><b>✍️ Перевірка письма</b> — один короткий запит на твір. Найдешевша з трьох і єдина, де відповідь ШІ справді не замінити заготовками.</span></label>'
    . '<label class="check"><input type="checkbox" name="use_chat" value="1"' . $chk('chat', false) . '><span><b>💬 Розмова з персонажем текстом</b> — запит на кожну репліку, з усією історією розмови. Дорожчає з довжиною бесіди.</span></label>'
    . '<label class="check"><input type="checkbox" name="use_realtime" value="1"' . $chk('realtime', false) . '><span><b>🎧 Голосовий дзвінок</b> — найдорожче: платиться за секунди звуку в обидва боки.</span></label>'
    . '<label class="f">Модель для перевірки письма<input type="text" name="write_model" value="' . e(ai_get('write_model', '')) . '" placeholder="gpt-4o-mini"><small>Порожньо — візьметься дешева швидка модель провайдера (для OpenAI це <code>gpt-4o-mini</code>). Завдання просте: знайти помилки в кількох реченнях, тож велика модель тут не потрібна.</small></label>'
    . '<button class="btn pri">Зберегти</button></form></div>';

  echo '<div class="card"><h2>🎧 Голосовий дзвінок (Realtime)</h2><form method="post" action="admin.php?p=voice">' . $csrf . '<input type="hidden" name="do" value="ai_save">'
    . '<label class="f">Модель<input type="text" name="rt_model" value="' . e(ai_get('rt_model', '')) . '" placeholder="gpt-realtime"><small>Порожньо — використається gpt-realtime.</small></label>'
    . '<label class="f">Голос<select name="rt_voice">' . $opt($RT_VOICES, ai_get('rt_voice', 'marin')) . '</select><small>Кожен персонаж має свій голос; це значення — запасне.</small></label>'
    . '<label class="f">Розпізнавання мови<select name="rt_stt">' . $opt(['gpt-realtime-whisper', 'whisper-1', 'gpt-4o-mini-transcribe'], ai_get('rt_stt', 'gpt-realtime-whisper')) . '</select><small>Чим модель «чує» учня. Типово — gpt-realtime-whisper.</small></label>'
    . '<label class="f">Мікрофон<select name="rt_noise">' . $opt(['near_field', 'far_field'], ai_get('rt_noise', 'near_field')) . '</select><small>near_field — гарнітура чи телефон біля рота, far_field — мікрофон ноутбука здалеку.</small></label>'
    . '<label class="f">Перші слова (вітання)<input type="text" name="rt_greeting" value="' . e(ai_get('rt_greeting', '')) . '" maxlength="80" placeholder="Hei! Det er meg. Har du tid et øyeblikk?"><small>Порожньо — сайт сам підбирає вітання під сценарій розмови. Модель каже його своїми словами.</small></label>'
    . '<label class="f">Промпт (додаткові вказівки)<textarea name="rt_prompt" rows="4" maxlength="1200">' . e(ai_get('rt_prompt', '')) . '</textarea><small>Порожньо — діє типовий промт: терпіння, коротка похвала, виправлення не вголос, а повтором правильної фрази. Свій текст замінює типовий.</small></label>';

  echo '<h2 style="margin-top:14px">⌨️ Текстова розмова</h2>'
    . '<label class="f">Модель<input type="text" name="model" value="' . e(ai_get('model', '')) . '" placeholder="gpt-4o-mini / grok-2-latest / llama-3.3-70b-versatile"><small>Порожньо — модель за замовчуванням для провайдера.</small></label>'
    . '<label class="f">Промпт<textarea name="chat_prompt" rows="3" maxlength="1200">' . e(ai_get('chat_prompt', '')) . '</textarea><small>Порожньо — діє типовий промт для розмови текстом.</small></label>'
    . '<label class="f">Prompt ID з консолі OpenAI (необов’язково)<input type="text" name="rt_prompt_id" value="' . e(ai_get('rt_prompt_id', '')) . '" placeholder="pmpt_…"><small>Якщо ви зберегли промт у platform.openai.com — вставте його ідентифікатор, і голосовий дзвінок використає саме його.</small></label>';

  echo '<h2 style="margin-top:14px">🔊 Синтез мови</h2>'
    . '<label class="f">Провайдер<select name="tts_provider">' . $opt(['edge', 'openai', 'elevenlabs', 'none'], ai_get('tts_provider', tts_provider())) . '</select><small>edge — безкоштовно, той самий голос, що в коміксах.</small></label>'
    . '<label class="f">Голос<input type="text" name="tts_voice" value="' . e(ai_get('tts_voice', '')) . '" placeholder="nb-NO-PernilleNeural"><small>Приклади: ' . e(implode(', ', $TTS_VOICES)) . '</small></label>'
    . '<button class="btn pri">Зберегти</button></form></div></div>';

  $rtDay = 0;
  echo '<div class="card"><h2>📞 Ліміти</h2><p class="muted">Голосові хвилини платні, тому діють денні ліміти: <b>6</b> голосових дзвінків на добу для звичайного акаунта й <b>40</b> для Преміуму; текстових реплік — 30 і 200. Змінюються в <code>api/realtime.php</code> та <code>api/call.php</code>.</p></div>';
}

if ($p === 'teachers') {
  $only = preg_replace('/[^a-z]/', '', (string)($_GET['f'] ?? '')) ?: 'pending';
  $where = $only === 'ok' ? "WHERE t.status = 'ok'" : ($only === 'all' ? '' : ($only === 'no' ? "WHERE t.status = 'no'" : "WHERE t.status = 'pending'"));
  $rows = q("SELECT t.*, u.name, u.email, u.lang FROM kl_teachers t JOIN kl_users u ON u.id = t.user_id $where ORDER BY t.created_at DESC LIMIT 200")->fetchAll();
  echo '<h1>Заявки вчителів</h1><p class="muted">Учителі отримують повний Преміум безкоштовно після ручної перевірки. Заявка приходить зі сторінки <code>#/teacher</code>, підтвердження — у вільній формі (посилання на школу, фото посвідчення, шкільна пошта).</p>';
  echo '<div class="chips" style="margin-bottom:14px">' . implode('', array_map(fn($k) => '<a class="' . ($only === $k[0] ? 'on' : '') . '" href="admin.php?p=teachers&amp;f=' . $k[0] . '">' . $k[1] . '</a>', [['pending', '⏳ Нові (' . $tcNew . ')'], ['ok', '✅ Підтверджені'], ['no', '❌ Відхилені'], ['all', '📜 Усі']])) . '</div>';
  echo '<div class="card"><ul class="list">';
  foreach ($rows as $t) {
    $tid = '<input type="hidden" name="tid" value="' . (int)$t['user_id'] . '">';
    $st = ['pending' => '<span class="pill y">⏳ нова</span>', 'ok' => '<span class="pill g">✅ вчитель</span>', 'no' => '<span class="pill r">❌ відхилено</span>'][$t['status']] ?? '';
    echo '<li><div><b>' . e($t['name']) . '</b> ' . $st . ' <small class="muted">' . e($t['email']) . ' · ' . e(gmdate('d.m.Y H:i', (int)$t['created_at'])) . '</small>'
      . '<dl class="kv" style="margin-top:6px"><dt>Школа</dt><dd>' . e($t['school']) . '</dd>'
      . ($t['role'] !== '' ? '<dt>Викладає</dt><dd>' . e($t['role']) . '</dd>' : '')
      . ($t['country'] !== '' ? '<dt>Країна</dt><dd>' . e($t['country']) . '</dd>' : '')
      . ($t['link'] !== '' ? '<dt>Посилання</dt><dd><a href="' . e($t['link']) . '" target="_blank" rel="noopener nofollow">' . e($t['link']) . '</a></dd>' : '')
      . '</dl><div class="fb-text">' . nl2br(e($t['proof'])) . '</div>'
      . (!empty($t['file']) ? (str_starts_with((string)$t['file_type'], 'image/')
        ? '<a href="admin.php?p=teachers&amp;dl=' . (int)$t['user_id'] . '" target="_blank" rel="noopener"><img class="fb-img" src="admin.php?p=teachers&amp;dl=' . (int)$t['user_id'] . '" alt="підтвердження"></a>'
        : '<p><a class="btn sm" href="admin.php?p=teachers&amp;dl=' . (int)$t['user_id'] . '">📎 ' . e($t['file_name'] ?: 'файл') . '</a></p>') : '')
      . '</div><div class="row">'
      . act('teacher_ok', 0, '✅ Підтвердити', 'pri', 'Дати цьому акаунту безкоштовний Преміум вчителя?', $tid)
      . act('teacher_no', 0, '❌ Відхилити', '', 'Відхилити заявку? Учитель отримає листа з поясненням.', $tid)
      . '<a class="btn sm" href="admin.php?p=user&amp;id=' . (int)$t['user_id'] . '">👤 Акаунт</a></div></li>';
  }
  if (!$rows) echo '<li class="muted">Поки що порожньо.</li>';
  echo '</ul></div>';
}

if ($p === 'feedback') {
  $KL = ['bug' => '🐞 Помилка', 'idea' => '💡 Правка / ідея', 'topic' => '📚 Тема для навчання', 'other' => '💬 Інше', 'android' => '🤖 Android — запит посилання для тесту'];
  $only = preg_replace('/[^a-z]/', '', (string)($_GET['f'] ?? '')) ?: 'new';
  $where = $only === 'done' ? 'WHERE f.done_at IS NOT NULL' : ($only === 'all' ? '' : ($only === 'android' ? "WHERE f.kind = 'android'" : 'WHERE f.done_at IS NULL'));
  $rows = q("SELECT f.*, u.name AS uname, u.email AS uemail FROM kl_feedback f LEFT JOIN kl_users u ON u.id = f.user_id $where ORDER BY f.created_at DESC LIMIT 200")->fetchAll();
  $androidN = (int)(one("SELECT COUNT(*) AS n FROM kl_feedback WHERE kind = 'android'")['n'] ?? 0);
  echo '<h1>Відгуки від користувачів</h1><p class="muted">Кнопка «💌 Відгук» є на кожній сторінці сайту: помилка, правка, ідея або прохання додати тему для навчання. Кожен відгук дублюється листом адміністраторам. Для Android-заявки «Опрацьовано» надсилає тестувальнику Google Play та інструкцію на 14 днів; за помилки доставки заявка лишається відкритою.</p>';
  echo '<div class="chips" style="margin-bottom:14px">' . implode('', array_map(fn($k) => '<a class="' . ($only === $k[0] ? 'on' : '') . '" href="admin.php?p=feedback&amp;f=' . $k[0] . '">' . $k[1] . '</a>', [['new', '🆕 Нові (' . $fbNew . ')'], ['android', '🤖 Android (' . $androidN . ')'], ['done', '✅ Опрацьовані'], ['all', '📜 Усі']])) . '</div>';
  echo '<div class="card"><ul class="list">';
  foreach ($rows as $f) {
    $fbId = '<input type="hidden" name="fb" value="' . (int)$f['id'] . '">';
    $who = $f['uname'] ? e($f['uname']) . ' <small class="muted">' . e($f['uemail']) . '</small>' : ($f['email'] !== '' ? e($f['email']) : '<span class="muted">гість</span>');
    echo '<li><div><b>' . e($KL[$f['kind']] ?? $f['kind']) . '</b> <span class="muted">#' . (int)$f['id'] . ' · ' . e(gmdate('d.m.Y H:i', (int)$f['created_at'])) . ($f['lang'] ? ' · ' . e($f['lang']) : '') . ($f['page'] ? ' · ' . e($f['page']) : '') . '</span><br>'
      . '<div class="fb-text">' . nl2br(e($f['text'])) . '</div>'
      . (!empty($f['file']) ? (str_starts_with((string)$f['file_type'], 'image/')
          ? '<a href="admin.php?p=feedback&amp;dl=' . (int)$f['id'] . '" target="_blank" rel="noopener"><img class="fb-img" src="admin.php?p=feedback&amp;dl=' . (int)$f['id'] . '" alt="' . e($f['file_name']) . '"></a>'
          : '<p><a class="btn sm" href="admin.php?p=feedback&amp;dl=' . (int)$f['id'] . '">📎 ' . e($f['file_name'] ?: 'файл') . ' (' . round((int)$f['file_size'] / 1024) . ' КБ)</a></p>') : '')
      . '<small class="muted">від ' . $who . ($f['ua'] ? ' · ' . e(ua_short($f['ua'])) : '') . '</small></div><div class="row">'
      . ($f['done_at'] ? act('fb_undone', 0, '↩️ Повернути', '', '', $fbId) : act('fb_done', 0, $f['kind'] === 'android' ? '📨 Надіслати посилання й опрацювати' : '✅ Опрацьовано', 'pri', '', $fbId))
      . act('fb_del', 0, '🗑 Видалити', 'dang', 'Видалити цей відгук назавжди?', $fbId) . '</div></li>';
  }
  if (!$rows) echo '<li class="muted">Поки що порожньо.</li>';
  echo '</ul></div>';
}

if ($p === 'system') {
  /* ⚙️ Налаштування — розділи з описом і станом.
     Раніше все лежало однією стіною карток: щоб знайти, чи працює пошта, треба
     було прогорнути сервер, доступи й Stripe. Тепер кожен розділ — своя адреса
     (?p=system&s=…): її можна відкрити з закладки, а дія повертає саме туди.
     Перша сторінка — огляд: що працює, а що чекає на увагу. */
  require_once __DIR__ . '/api/google-auth.php';
  try { google_install(); } catch (Throwable $e) { /* розділ Google покаже, чого бракує */ }

  /* ---- дані для станів (рахуємо один раз: потрібні й огляду, й розділам) ---- */
  $drv = db()->getAttribute(PDO::ATTR_DRIVER_NAME); $ver = db()->getAttribute(PDO::ATTR_SERVER_VERSION);
  $schema = one("SELECT v FROM kl_meta WHERE k = 'schema'")['v'] ?? '?';
  $cfgFile = is_file(__DIR__ . '/api/config.php') ? __DIR__ . '/api/config.php' : __DIR__ . '/api/config.local.php';
  $perm = is_file($cfgFile) ? substr(sprintf('%o', fileperms($cfgFile)), -4) : '—';
  $permOpen = $perm !== '—' && in_array((int)substr($perm, -1), [2, 3, 6, 7], true);   // інші можуть писати
  $installLeft = is_file(__DIR__ . '/install.php');
  $mc = mail_cfg(); $mailBad = mail_problems();
  $lastErr = (string)meta_get('mail_last_error', ''); $lastTry = (int)meta_get('mail_last_try', '0');
  $nAdmins = (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE is_admin = 1 AND blocked_at IS NULL')['n'] ?? 0);
  $myTotp = totp_on($me);
  $fu = founders_used(); $fs = founder_slots();
  $sk = stripe_key('secret'); $pk = stripe_key('publishable'); $wh = stripe_key('webhook');
  $live = str_contains($sk, '_live_');
  $gp = google_settings_public(); $gc = google_conf();

  /* ---- розділи: значок, назва, опис і стан ---- */
  $st = fn(string $tone, string $text) => ['tone' => $tone, 'text' => $text];
  $SEC = [
    'security' => ['🔐', 'Безпека та доступ', 'Ваш пароль, двофакторний вхід в адмінку, хто має доступ і журнал дій адміністратора.',
      !$myTotp ? $st('warn', 'двофакторний вхід вимкнено') : ($nAdmins > 1 ? $st('warn', 'адміністраторів: ' . $nAdmins) : $st('ok', 'захищено'))],
    'google' => ['🔑', 'Вхід через Google', 'Кнопки «Увійти через Google» і «Зареєструватися через Google» на формах сайту для користувачів. Тут — ключі, перевірка й увімкнення. Сама адмінка входить лише паролем.',
      match (true) {
        $gc['error'] === 'key' => $st('err', 'ключ шифрування недоступний'),
        $gc['enabled'] => $st('ok', 'увімкнено'),
        $gp['status'] === 'enabled' && !$gp['verified_current'] => $st('err', 'ключі змінено — перевірте'),
        $gp['verified_current'] => $st('warn', 'перевірено, вимкнено'),
        $gp['exists'] => $st('warn', 'чернетка'),
        default => $st('idle', 'не налаштовано'),
      }],
    'mail' => ['📬', 'Пошта', 'Звідки йдуть листи сайту: підтвердження пошти, коди входу, скидання пароля, розсилки. Тестовий лист собі.',
      $mailBad ? $st('err', 'є що виправити') : ($lastErr !== '' ? $st('err', 'остання спроба з помилкою') : ($lastTry ? $st('ok', 'працює') : $st('idle', 'ще не перевіряли')))],
    'billing' => ['💳', 'Оплата', 'Stripe: ключі, адреса вебхука, ціна Преміуму й кількість активних підписок.',
      stripe_ready() ? $st('ok', $live ? 'бойовий режим' : 'тестовий режим') : $st('idle', 'не налаштовано')],
    'founders' => ['🏅', 'Акція «перші 100»', 'Скільки безкоштовних місць зайнято й що отримують учасники акції.',
      $st($fu >= $fs ? 'idle' : 'ok', $fu . ' з ' . $fs)],
    'server' => ['🖥️', 'Сервер і база', 'Версія PHP, база даних і її схема, права на конфіг, чи прибрано інсталятор.',
      $installLeft ? $st('err', 'видаліть install.php') : ($permOpen ? $st('warn', 'відкриті права на конфіг') : $st('ok', 'гаразд'))],
    'stats' => ['📈', 'Статистика відвідувань', 'Власний анонімний лічильник для дашборду: без кук і сторонніх сервісів, IP не зберігається.',
      hits_enabled() ? $st('ok', 'увімкнено') : $st('idle', 'вимкнено')],
    'backup' => ['💾', 'Резервна копія', 'Повна копія бази одним файлом .sql — перед великими змінами або для перенесення на інший хостинг.',
      $st('idle', 'вручну')],
  ];
  $sec = (string)($_GET['s'] ?? '');
  if (!isset($SEC[$sec])) $sec = '';
  $TONE = ['ok' => 'g', 'warn' => 'y', 'err' => 'r', 'idle' => ''];
  $pill = fn(array $s) => '<span class="pill ' . $TONE[$s['tone']] . '">' . e($s['text']) . '</span>';
  $url = fn(string $s = '') => 'admin.php?p=system' . ($s !== '' ? '&amp;s=' . $s : '');

  echo '<div class="set-head"><h1>Налаштування</h1><p class="muted">Кожен розділ показує, чи все працює. Жовте й червоне — те, що варто переглянути першим.</p></div>';
  echo '<div class="set"><nav class="set-nav" aria-label="Розділи налаштувань">'
    . '<a href="' . $url() . '"' . ($sec === '' ? ' class="on" aria-current="page"' : '') . '><span class="ico">🧭</span><span class="t"><b>Огляд</b><small>усі розділи</small></span></a>';
  foreach ($SEC as $k => [$ic, $title, , $s]) {
    echo '<a href="' . $url($k) . '"' . ($sec === $k ? ' class="on" aria-current="page"' : '') . '><span class="ico">' . $ic . '</span>'
      . '<span class="t"><b>' . e($title) . '</b><small>' . e($s['text']) . '</small></span><i class="dot ' . $s['tone'] . '" aria-hidden="true"></i></a>';
  }
  echo '</nav><div class="set-body">';

  /* ---- огляд ---- */
  if ($sec === '') {
    $attn = array_filter($SEC, fn($x) => in_array($x[3]['tone'], ['err', 'warn'], true));
    if ($attn) {
      echo '<div class="card set-attn"><h2>⚠️ Потребує уваги</h2><ul class="list">';
      foreach ($attn as $k => [$ic, $title, , $s]) echo '<li><div>' . $ic . ' <b>' . e($title) . '</b> — ' . e($s['text']) . '</div><a class="btn sm" href="' . $url($k) . '">Відкрити →</a></li>';
      echo '</ul></div>';
    } else echo '<div class="msg ok">✅ Усі розділи в порядку.</div>';
    echo '<div class="set-grid">';
    foreach ($SEC as $k => [$ic, $title, $desc, $s]) {
      echo '<a class="card set-tile" href="' . $url($k) . '"><div class="set-tile-top"><span class="ico">' . $ic . '</span>' . $pill($s) . '</div>'
        . '<h2>' . e($title) . '</h2><p class="muted">' . e($desc) . '</p><span class="set-go">Відкрити →</span></a>';
    }
    echo '</div></div></div>';
  } else {
    [$ic, $title, $desc, $s] = $SEC[$sec];
    echo '<header class="set-sec"><div><h2>' . $ic . ' ' . e($title) . '</h2><p class="muted">' . e($desc) . '</p></div>' . $pill($s) . '</header>';
    $form = fn(string $do, string $inner, string $label, string $cls = '', string $confirm = '') => '<form method="post" action="' . $url($sec) . '"'
      . ($confirm ? ' data-confirm="' . e($confirm) . '"' : '') . ' class="set-form">' . $csrf . '<input type="hidden" name="do" value="' . $do . '">' . $inner
      . '<button class="btn ' . $cls . '">' . $label . '</button></form>';
    $reauth = '<label class="f">Ваш пароль адміністратора<input type="password" name="reauth_pass" autocomplete="current-password" required></label>'
      . ($myTotp ? '<label class="f">Код з автентифікатора<input name="reauth_code" inputmode="numeric" autocomplete="one-time-code" maxlength="12" required></label>' : '');
    $ACT = ['login' => '🔓 вхід', 'login_fail' => '🚫 невдалий вхід', 'reauth_fail' => '🚫 не підтверджено', 'google_save' => '💾 ключі Google', 'google_save_fail' => '⛔ ключі Google',
      'google_verify_start' => '🔍 перевірка Google', 'google_verified' => '✅ Google підтвердив', 'google_verify_fail' => '⛔ перевірка не пройшла', 'google_enable' => '✅ Google увімкнено',
      'google_disable' => '⏸ Google вимкнено', 'google_callback_fail' => '⛔ повернення від Google'];
    $journal = function (string $where, int $limit) use ($ACT): string {
      try { $rows = q('SELECT l.at, l.action, l.detail, u.name FROM kl_admin_log l LEFT JOIN kl_users u ON u.id = l.admin_id' . $where . ' ORDER BY l.id DESC LIMIT ' . $limit)->fetchAll(); } catch (Throwable $e) { $rows = []; }
      if (!$rows) return '<p class="muted">Поки порожньо.</p>';
      return '<div class="table-responsive"><table class="t"><thead><tr><th>Коли</th><th>Що</th><th>Деталі</th><th>Хто</th></tr></thead><tbody>'
        . implode('', array_map(fn($l) => '<tr><td data-l="Коли">' . e(date('d.m H:i', (int)$l['at'])) . '</td><td data-l="Що">' . e($ACT[$l['action']] ?? $l['action']) . '</td><td data-l="Деталі" class="muted">' . e($l['detail']) . '</td><td data-l="Хто">' . e($l['name'] ?? '—') . '</td></tr>', $rows))
        . '</tbody></table></div><p class="muted set-note">У журналі ніколи немає паролів, кодів, секретів чи токенів — лише що сталося й хто.</p>';
    };
    echo '<div class="set-cards">';

    if ($sec === 'security') {
      echo '<div class="card"><h3>🛡️ Двофакторний вхід в адмінку</h3><dl class="kv"><dt>Ваш акаунт</dt><dd>' . ($myTotp ? '<span class="pill g">✅ увімкнено</span>' : '<span class="pill y">⚠️ вимкнено</span>') . '</dd></dl>'
        . ($myTotp ? '<p class="muted">Для входу в адмінку потрібні пароль і код із застосунку. Зміна ключів Google теж просить свіжий код.</p>'
          : '<p class="muted">Зараз в адмінку можна увійти лише паролем. Увімкніть автентифікатор — тоді знадобиться ще код із телефона, і вкрадений пароль сам по собі нічого не відкриє.</p>'
            . '<p><a class="btn pri" href="' . e(site_url()) . '#/account" target="_blank" rel="noopener">🔐 Увімкнути в кабінеті сайту →</a></p><p class="muted set-note">Кабінет → «🔐 Двофакторна авторизація» → відскануйте QR будь-яким автентифікатором.</p>')
        . '</div>';
      echo '<div class="card"><h3>🔑 Мій пароль</h3>' . $form('my_pass', '<label class="f">Поточний пароль<input type="password" name="old" autocomplete="current-password" required></label><label class="f">Новий пароль<input type="password" name="new" minlength="10" autocomplete="new-password" required><small>Щонайменше 10 символів. Інші ваші сесії буде завершено.</small></label>', 'Зберегти пароль', 'pri') . '</div>';
      $admins = q('SELECT id, name, email FROM kl_users WHERE is_admin = 1 AND blocked_at IS NULL ORDER BY id LIMIT 20')->fetchAll();
      echo '<div class="card"><h3>👑 Хто має доступ</h3><dl class="kv"><dt>Адміністраторів</dt><dd><b>' . $nAdmins . '</b></dd></dl>'
        . ($nAdmins > 1 ? '<p class="err-box">Адміністратор має бути один. Зайвим зніміть права: 👥 Користувачі → фільтр «Адміністратори» → «Зняти адміна».</p>' : '')
        . '<ul class="list">' . implode('', array_map(fn($a) => '<li><div>' . e($a['name']) . ' — <code>' . e($a['email']) . '</code></div></li>', $admins)) . '</ul>'
        . '<p class="muted set-note">Учасники акції «перші 100» отримують Преміум і право запрошувати друзів, але <b>не</b> права адміністратора.</p>'
        . '<p><a class="btn" href="admin.php?p=users&amp;f=admins">👥 Показати адміністраторів</a></p></div>';
      echo '<div class="card set-wide"><h3>🧾 Журнал адміністратора</h3>' . $journal('', 40) . '</div>';
    }

    if ($sec === 'google') {
      $gDir = secret_dir();
      $gDirPublic = secret_dir_is_public($gDir, (string)($_SERVER['DOCUMENT_ROOT'] ?? ''));
      $gKeyOk = is_file($gDir . '/' . SECRET_KEY_FILE);
      $gLinked = 0; try { $gLinked = (int)(one('SELECT COUNT(*) AS n FROM kl_google_accounts')['n'] ?? 0); } catch (Throwable $e) { /* ще немає */ }
      $gLegacy = trim((string)cfg('google.client_id')) !== '' || trim((string)cfg('google.client_secret')) !== '';
      $yes = fn(bool $ok, string $good, string $bad) => $ok ? '✅ ' . $good : '⛔ ' . $bad;
      /* Крок, на якому зараз власник: показуємо його першим, решта — нижче. */
      $step = $gc['enabled'] ? 4 : ($gp['verified_current'] ? 3 : ($gp['exists'] ? 2 : 1));
      $steps = ['Ключі з Google Cloud', 'Перевірка через Google', 'Увімкнення', 'Працює'];
      echo '<ol class="set-steps">';
      foreach ($steps as $i => $t) echo '<li class="' . ($i + 1 < $step ? 'done' : ($i + 1 === $step ? 'now' : '')) . '"><b>' . ($i + 1) . '</b><span>' . e($t) . '</span></li>';
      echo '</ol>';

      echo '<div class="card"><h3>Стан</h3><dl class="kv">'
        . '<dt>Вхід для користувачів</dt><dd>' . $pill($s) . '</dd>'
        . '<dt>Де кнопки</dt><dd>форми входу й реєстрації, вхід кодом, кабінет («Прив’язати Google»)</dd>'
        . '<dt>Підключених акаунтів</dt><dd>' . $gLinked . '</dd>'
        . '<dt>Client ID</dt><dd>' . ($gp['client_id'] !== '' ? '<code class="wrap">' . e($gp['client_id']) . '</code>' : '—') . '</dd>'
        . '<dt>Client Secret</dt><dd>' . ($gp['has_secret'] ? '✅ збережено, зашифровано — на сторінку не виводиться' : '<span class="pill">не задано</span>') . '</dd>'
        . '<dt>Перевірено Google</dt><dd>' . ($gp['verified_current'] && $gp['verified_at'] ? e(date('d.m.Y H:i', $gp['verified_at'])) : '—') . '</dd>'
        . '</dl>';
      if ($step === 2) echo $form('google_verify', '<p class="muted">Відкриє сторінку Google. Увійдіть своїм Google-акаунтом зі списку Test users: ми лише перевіримо, що ключі працюють. Користувача не створюємо й у кабінет не входимо.</p>', '🔍 Перевірити через Google', 'pri');
      if ($step === 3) echo $form('google_enable', '<p class="muted">Після ввімкнення кнопки з’являться на формах сайту. Доки в Google Cloud не натиснуто <b>Publish app</b>, входити зможуть лише Test users.</p>' . $reauth, '✅ Увімкнути вхід через Google', 'ok');
      if ($step === 4) echo $form('google_disable', '<p class="muted">Вимкнути можна будь-коли без пароля — звичайний вхід лишається.</p>', '⏸ Вимкнути', '', 'Вимкнути вхід через Google? Ті, хто входив лише через Google, тимчасово не зможуть увійти цим способом.');
      if ($step === 3) echo $form('google_verify', '', '🔍 Перевірити ще раз');
      echo '</div>';

      echo '<div class="card"><h3>' . ($gp['exists'] ? '✏️ Змінити ключі' : '✏️ Ввести ключі') . '</h3>'
        . '<p class="muted">Google Cloud → Google Auth Platform → <b>Clients</b> → ваш клієнт. Після збереження вхід вимикається до нової перевірки.</p>'
        . $form('google_save',
          '<label class="f">Client ID<input name="client_id" value="' . e($gp['client_id']) . '" autocomplete="off" spellcheck="false" required placeholder="1234567890-abc….apps.googleusercontent.com"></label>'
          . '<label class="f">Client Secret<input type="password" name="client_secret" autocomplete="new-password" spellcheck="false"' . ($gp['has_secret'] ? ' placeholder="збережено — залиште порожнім, щоб не міняти"' : ' required') . '><small>Зберігається зашифрованим; ключ шифрування лежить окремо від бази.</small></label>'
          . $reauth, '💾 Зберегти як чернетку', $step === 1 ? 'pri' : '')
        . '</div>';

      echo '<div class="card"><h3>Технічні вимоги</h3><dl class="kv">'
        . '<dt>Адреса повернення</dt><dd><code class="wrap">' . e(google_callback_url()) . '</code><br><small class="muted">У Google Cloud → Clients → <b>Authorized redirect URIs</b> — точно така.</small></dd>'
        . '<dt>HTTPS</dt><dd>' . $yes(str_starts_with(site_url(), 'https://'), 'так', 'адреса сайту не https://') . '</dd>'
        . '<dt>PHP cURL</dt><dd>' . $yes(function_exists('curl_init'), 'є', 'немає — увімкніть у hPanel → PHP') . '</dd>'
        . '<dt>Сховище ключа</dt><dd>' . ($gDirPublic ? '⛔ всередині сайту — задайте secrets_dir у config.php' : $yes($gKeyOk || is_writable(dirname($gDir)) || is_dir($gDir), $gKeyOk ? 'ключ є, поза сайтом' : 'буде створено при першому збереженні', 'тека недоступна для запису')) . '<br><small class="muted"><code class="wrap">' . e($gDir) . '</code></small></dd>'
        . '<dt>Джерело ключів</dt><dd>' . ($gp['exists'] ? 'адмінка, секрет зашифровано' : ($gc['source'] === 'config' ? 'config.php (старий спосіб)' : '—')) . '</dd>'
        . '</dl>' . ($gLegacy && $gp['exists'] ? '<p class="muted set-note">Блок <code>google</code> у config.php більше не використовується — ключі з адмінки мають перевагу. Його можна прибрати.</p>' : '') . '</div>';
      echo '<div class="card set-wide"><h3>🧾 Журнал входу Google</h3>' . $journal(" WHERE l.action LIKE 'google%'", 20) . '</div>';
    }

    if ($sec === 'mail') {
      echo '<div class="card"><h3>Налаштування</h3><dl class="kv"><dt>Спосіб</dt><dd>' . e($mc['transport']) . '</dd><dt>SMTP</dt><dd>' . e($mc['host'] . ':' . $mc['port']) . ' ' . e($mc['secure']) . '</dd>'
        . '<dt>Скринька</dt><dd>' . e($mc['user'] ?: '—') . '</dd><dt>Пароль</dt><dd>' . ($mc['pass'] === '' ? '<span class="pill">не задано</span>' : '✅ задано') . '</dd>'
        . '<dt>Відправник</dt><dd>' . e($mc['from_name'] . ' <' . $mc['from'] . '>') . '</dd>'
        . ($lastTry ? '<dt>Остання спроба</dt><dd>' . e(date('d.m.Y H:i', $lastTry)) . ' — ' . ($lastErr === '' ? '✅ успішно' : '❌ помилка') . '</dd>' : '') . '</dl>';
      if ($lastErr !== '') echo '<p class="err-box"><b>Помилка SMTP:</b><br><code>' . e($lastErr) . '</code></p>';
      if ($mailBad) echo '<p class="muted"><b>Що виправити в <code>api/config.php</code> → <code>mail</code>:</b></p><ul class="muted">' . implode('', array_map(fn($x) => '<li>' . e($x) . '</li>', $mailBad)) . '</ul>';
      echo '</div><div class="card"><h3>Перевірка</h3><p class="muted">Надішле короткий лист на вашу адресу. Результат з’явиться в рядку «Остання спроба».</p>'
        . $form('test_mail', '', '📨 Надіслати тестовий лист на ' . e($me['email']), 'pri')
        . '<p class="muted set-note">Скринька створюється в hPanel → Emails. SMTP Hostinger: <code>smtp.hostinger.com</code>, порт <code>465</code>, <code>ssl</code>. Поле <code>from</code> має дорівнювати <code>user</code> — інакше сервер відхиляє лист.</p></div>';
    }

    if ($sec === 'billing') {
      $mask = fn(string $k) => $k === '' ? '<span class="pill">не задано</span>' : '<code>' . e(substr($k, 0, 8) . '…' . substr($k, -4)) . '</code>';
      $subs = 0; try { $subs = (int)(one("SELECT COUNT(*) AS n FROM kl_billing WHERE status = 'active'")['n'] ?? 0); } catch (Throwable $e) { /* немає таблиці */ }
      echo '<div class="card"><h3>Stripe</h3><dl class="kv"><dt>Стан</dt><dd>' . (stripe_ready() ? ($live ? '✅ бойовий режим' : '🧪 тестовий режим') : '⚠️ не налаштовано') . '</dd>'
        . '<dt>Секретний ключ</dt><dd>' . $mask($sk) . '</dd><dt>Публічний ключ</dt><dd>' . $mask($pk) . '</dd><dt>Вебхук</dt><dd>' . $mask($wh) . '</dd>'
        . '<dt>Ціна</dt><dd>' . number_format(PREMIUM_PRICE / 100, 0) . ' ' . PREMIUM_CURRENCY . '/міс</dd><dt>Активних підписок</dt><dd>' . $subs . '</dd></dl></div>'
        . '<div class="card"><h3>Де змінювати</h3><p class="muted">Ключі задаються лише в <code>api/config.php</code> на сервері (розділ <code>stripe</code>) і ніколи не потрапляють у браузер.</p>'
        . '<dl class="kv"><dt>Адреса вебхука</dt><dd><code class="wrap">' . e(site_url()) . 'api/stripe-webhook.php</code></dd></dl>'
        . '<p class="muted set-note">Якщо секретний ключ десь «засвітився» — зробіть <b>Roll key</b> у Stripe.</p></div>';
    }

    if ($sec === 'founders') {
      $pct = $fs > 0 ? min(100, (int)round($fu / $fs * 100)) : 0;
      echo '<div class="card"><h3>Місця</h3><div class="set-meter" role="meter" aria-valuemin="0" aria-valuemax="' . $fs . '" aria-valuenow="' . $fu . '"><i style="width:' . $pct . '%"></i></div>'
        . '<dl class="kv"><dt>Зайнято</dt><dd><b>' . $fu . '</b> з ' . $fs . '</dd><dt>Лишилось</dt><dd>' . founders_left() . '</dd></dl></div>'
        . '<div class="card"><h3>Що отримують</h3><p class="muted">Перші ' . $fs . ' підтверджених акаунтів отримують Преміум назавжди, право запрошувати друзів і прибирати погані дописи на стінах (блокувати авторів можуть лише адмін і модератор). Далі — підписка 69 крон/міс.</p>'
        . '<p class="muted set-note">Кількість місць змінюється рядком <code>define(\'MK_FOUNDER_SLOTS\', 100);</code> в <code>api/config.php</code>.</p></div>';
    }

    if ($sec === 'server') {
      echo '<div class="card"><h3>Середовище</h3><dl class="kv"><dt>PHP</dt><dd>' . PHP_VERSION . '</dd><dt>База</dt><dd>' . e($drv) . ' ' . e($ver) . '</dd><dt>Схема БД</dt><dd>v' . e($schema) . '</dd><dt>Адреса сайту</dt><dd><code class="wrap">' . e(site_url()) . '</code></dd></dl></div>'
        . '<div class="card"><h3>Файли</h3><dl class="kv"><dt>config.php</dt><dd>права <code>' . e($perm) . '</code>' . ($permOpen ? ' <span class="pill y">запис для всіх — поставте 0640</span>' : '') . '</dd>'
        . '<dt>install.php</dt><dd>' . ($installLeft ? '<span class="pill r">⚠️ є — видаліть у hPanel → File Manager</span>' : '✅ видалено') . '</dd></dl>'
        . '<p><a class="btn" href="admin.php?p=diag">🩺 Повна діагностика →</a></p></div>';
    }

    if ($sec === 'stats') {
      $on = hits_enabled(); $today = hit_day();
      $pvT = array_sum(hits_series([$today], 'pv')); $uvT = array_sum(hits_series([$today], 'uv'));
      $rows = meta_get('hits_v') === '1' ? (int)(one('SELECT COUNT(*) AS n FROM kl_hits')['n'] ?? 0) : 0;
      echo '<div class="card"><h3>Лічильник</h3><dl class="kv"><dt>Стан</dt><dd>' . ($on ? '<span class="pill g">увімкнено</span>' : '<span class="pill">вимкнено</span>') . '</dd>'
        . '<dt>Сьогодні</dt><dd>' . $uvT . ' відвідувачів · ' . $pvT . ' переглядів</dd><dt>Зараз на сайті</dt><dd>' . hits_live() . '</dd><dt>Рядків у базі</dt><dd>' . $rows . '</dd></dl>'
        . '<div class="row-btns">' . ($on ? $form('hits_off', '', '⏸ Вимкнути лічильник') : $form('hits_on', '', '▶️ Увімкнути лічильник', 'pri'))
        . '<a class="btn" href="admin.php?p=dash">📊 Відкрити дашборд</a></div></div>'
        . '<div class="card"><h3>Що саме рахується</h3><ul class="set-list"><li>Перегляди розділів і коміксів, унікальні відвідувачі за день, пристрій і система, мова інтерфейсу, домен, з якого прийшли, година.</li>'
        . '<li>Унікальність — за добовою згорткою HMAC(сіль дня, IP + браузер). Сама IP-адреса не записується, сіль змінюється щодня, а вчорашня стирається — відвідувача неможливо впізнати назавтра.</li>'
        . '<li>Кук немає. Do Not Track і Global Privacy Control — не рахуємо зовсім. Боти й автоматичні браузери відкидаються.</li>'
        . '<li>Це описано в політиці конфіденційності (privacy.html) усіма мовами.</li></ul></div>'
        . '<div class="card"><h3>Очистити</h3><p class="muted">Видаляє всю накопичену статистику відвідувань. Акаунтів і прогресу це не стосується.</p>'
        . $form('hits_clear', '', '🗑 Очистити статистику', 'danger', 'Видалити всю статистику відвідувань? Відновити не вийде.') . '</div>';
    }

    if ($sec === 'backup') {
      echo '<div class="card"><h3>Завантажити копію</h3><p class="muted">Повний дамп таблиць <code>kl_*</code> одним файлом <code>.sql</code> — можна залити через phpMyAdmin або <code>mysql &lt; файл.sql</code>.</p>'
        . $form('dump', '', '⬇️ Завантажити .sql', 'pri')
        . '<p class="err-box set-note">Файл містить пошти й хеші паролів учасників. Зберігайте його як пароль і нікому не надсилайте, зокрема в чати.</p></div>';
    }

    echo '</div></div></div>';
  }
}

/* ---------- 🩺 діагностика: огляд, API і служби, журнали, безпека (api/diag-view.php) ---------- */
if ($p === 'diag') {
  require_once __DIR__ . '/api/diag-view.php';
  diag_page((string)($_GET['tab'] ?? 'overview'), $nonce);
}

page_close($nonce);
