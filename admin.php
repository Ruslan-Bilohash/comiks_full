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
$NAV = $isAdmin ? ['dash' => '📊 Огляд', 'users' => '👥 Користувачі', 'materials' => '📚 Матеріали', 'community' => '💬 Спільнота', 'teachers' => '🎓 Вчителі' . ($tcNew ? ' (' . $tcNew . ')' : ''), 'feedback' => '💌 Відгуки' . ($fbNew ? ' (' . $fbNew . ')' : ''), 'voice' => '🎧 Голос і ШІ', 'mail' => '📣 Розсилки', 'diag' => '🩺 Діагностика', 'system' => '⚙️ Система'] : ['community' => '💬 Спільнота'];
if ($isStaff && !$isAdmin && !in_array($p, ['community', 'logout', 'login'], true)) $p = 'community'; // модератор бачить лише модерацію
function go(string $to, string $m = ''): void { $qs = trim($to . ($m !== '' ? '&m=' . $m : ''), '&'); header('Location: admin.php' . ($qs !== '' ? '?' . $qs : '')); exit; }
function int_in(string $k): int { return max(0, (int)($_POST[$k] ?? $_GET[$k] ?? 0)); }

/* ---------- вхід ---------- */
if (!$isStaff) {
  $err = '';
  if ($post && $p === 'login') {
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    if (limited('admin-login:' . ip_hash(), 10, 900)) $err = 'Забагато спроб. Зачекайте 15 хвилин.';
    else {
      $u = valid_email($email) ? one('SELECT * FROM kl_users WHERE email = ?', [$email]) : null;
      $ok = password_verify((string)($_POST['password'] ?? ''), $u['pass_hash'] ?? '$2y$10$usesomesillystringfore7hnbRJHxXVLeakoG8K30oukPsA.ztMG');
      if ($u && $ok && is_staff($u) && empty($u['blocked_at'])) { start_session((int)$u['id']); go(!empty($u['is_admin']) ? '' : 'p=community'); }
      $err = 'Неправильна пошта або пароль, або акаунт не має прав адміністратора чи модератора.';
    }
  }
  page_open('Вхід', $nonce); ?>
  <div class="auth-wrap"><div class="auth" style="width:min(420px,100%)"><div class="brand"><img src="img/logo.svg" alt="" width="32" height="32"> Komiks·Lab <small>ADMIN</small></div>
    <div class="card"><h1>🔐 Вхід</h1>
      <?php if ($me && !$isStaff): ?><div class="msg warn">Ви увійшли як <?= e($me['email']) ?>, але цей акаунт не адміністратор і не модератор.</div><?php endif; ?>
      <?php if ($err): ?><div class="msg err"><?= e($err) ?></div><?php endif; ?>
      <form method="post" action="admin.php?p=login">
        <label class="f">Пошта<input type="email" name="email" autocomplete="username" required autofocus></label>
        <label class="f">Пароль<input type="password" name="password" autocomplete="current-password" required></label>
        <button class="btn pri">Увійти →</button>
      </form>
      <?php if (is_file(__DIR__ . '/install.php')): ?><p class="muted" style="margin-bottom:0">Ще не створили адміністратора? <a href="install.php">Інсталятор</a></p><?php endif; ?>
    </div></div></div>
  <?php page_close($nonce, false); exit;
}

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

/* ---------- дії (POST) ---------- */
if ($post) {
  check_admin_csrf();
  $do = (string)($_POST['do'] ?? ($p === 'logout' ? 'logout' : ''));
  $id = int_in('id');
  $target = $id ? one('SELECT * FROM kl_users WHERE id = ?', [$id]) : null;
  $self = $target && (int)$target['id'] === (int)$me['id'];
  $back = 'p=user&id=' . $id;
  // модератору дозволено лише модерацію стін
  $modOnly = ['logout', 'comment_del', 'comment_warn', 'comment_ban', 'unban'];
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
    case 'fb_done': q('UPDATE kl_feedback SET done_at = ? WHERE id = ?', [time(), int_in('fb')]); go('p=feedback', 'saved');
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
      go('p=system', $sentOk ? 'mail_ok' : 'mail_fail');
    case 'my_pass':
      if (!password_verify((string)($_POST['old'] ?? ''), $me['pass_hash'])) go('p=system', 'wrong');
      $np = (string)($_POST['new'] ?? '');
      if (strlen($np) < 10) go('p=system', 'short');
      q('UPDATE kl_users SET pass_hash = ? WHERE id = ?', [hash_password($np), $me['id']]);
      q('DELETE FROM kl_sessions WHERE user_id = ? AND token_hash <> ?', [$me['id'], sha((string)$_COOKIE[SESSION_COOKIE])]);
      go('p=system', 'saved');
  }
  go('p=' . $p);
}

$MSG = ['verified' => ['ok', 'Пошту позначено підтвердженою.'], 'sent' => ['ok', 'Лист надіслано.'], 'blocked' => ['ok', 'Користувача заблоковано, його сесії завершено.'], 'unblocked' => ['ok', 'Блокування знято.'],
  'saved' => ['ok', 'Збережено.'], 'kicked' => ['ok', 'Усі сесії користувача завершено.'], 'deleted' => ['ok', 'Видалено.'], 'self' => ['err', 'Цю дію не можна виконати над власним акаунтом.'],
  'confirm' => ['err', 'Для видалення введіть пошту користувача точно.'], 'mail_ok' => ['ok', '📬 Тестовий лист надіслано на вашу пошту.'], 'mail_fail' => ['err', 'Лист не надіслався. Причину видно нижче, у картці «Пошта».'],
  'voice_ok' => ['ok', '🔊 Голос працює — тестову фразу синтезовано.'], 'voice_fail' => ['err', 'Голос не відповів. Перевірте, чи дозволені вихідні зʼєднання, або оберіть іншого провайдера.'],
  'wrong' => ['err', 'Поточний пароль неправильний.'], 'short' => ['err', 'Новий пароль — щонайменше 10 символів.'],
  'banned' => ['ok', '⛔ Тимчасове блокування стін застосовано, автор побачить анімоване повідомлення.'], 'unbanned' => ['ok', 'Блокування знято.'], 'warned' => ['ok', '⚠️ Попередження надіслано — автор побачить анімацію «так не можна».'],
  'forbidden' => ['err', 'Недостатньо прав.'], 'bad_input' => ['err', 'Вкажіть ім’я та правильну пошту.'], 'exists' => ['err', 'Акаунт з такою поштою вже є — відкрийте його й увімкніть преміум.'],
  'pw_set' => ['ok', '🔑 Пароль задано. Передайте його другові особисто й попросіть змінити в кабінеті.'], 'pw_pass_short' => ['err', 'Пароль закороткий — щонайменше 8 символів (12345 не підходить).'], 'pw_pass_weak' => ['err', 'Цей пароль у списку найпростіших — його підберуть за секунди. Оберіть інший.'], 'pw_pass_long' => ['err', 'Пароль задовгий.'],
  'noted' => ['ok', '✉️ Звернення надіслано — людина побачить його при наступному відкритті сайту.'],
  'note_empty' => ['warn', 'Текст порожній — нічого не надіслано.'],
  'mail_ok' => ['ok', '📣 Листи надіслано.'], 'mail_none' => ['warn', 'Нікого не позначено — листи не надсилалися.'], 'mail_part' => ['warn', '📣 Частину листів не вдалося надіслати — подивіться «Систему» → «Пошта».'],
  'created' => ['ok', '🎉 Акаунт створено. Другу надіслано лист із посиланням, щоб задати пароль (діє 7 днів).'], 'created_nomail' => ['err', 'Акаунт створено, але лист не надіслався — перевірте пошту в «Системі» й натисніть «Надіслати посилання для нового пароля».']];
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
function user_cell(array $u): string { return '<div class="u-name"><span class="u-ava">' . e(mb_first($u['name'])) . '</span><div><b>' . e($u['name']) . '</b><small>' . e($u['email']) . '</small></div></div>'; }

/* ---------- огляд ---------- */
if ($p === 'dash') {
  $now = time(); $week = $now - 7 * 86400;
  $n = fn(string $sql, array $a = []) => (int)(one($sql, $a)['n'] ?? 0);
  $stats = [
    ['👥', 'Користувачів', $n('SELECT COUNT(*) n FROM kl_users'), 'y'],
    ['✅', 'Підтвердили пошту', $n('SELECT COUNT(*) n FROM kl_users WHERE verified_at IS NOT NULL'), 'g'],
    ['🆕', 'Нових за 7 днів', $n('SELECT COUNT(*) n FROM kl_users WHERE created_at >= ?', [$week]), 'b'],
    ['🔥', 'Активні за 7 днів', $n('SELECT COUNT(DISTINCT user_id) n FROM kl_sessions WHERE last_seen >= ?', [$week]), 'r'],
    ['🔎', 'У каталозі гравців', $n('SELECT COUNT(*) n FROM kl_players'), 'p'],
    ['💬', 'Коментарів на стінах', $n('SELECT COUNT(*) n FROM kl_comments'), ''],
    ['🤖', 'Віртуальних гравців', count(bots_list()), ''],
    ['💌', 'Нових відгуків', $fbNew, $fbNew ? 'y' : ''],
    ['🎓', 'Заявок учителів', $tcNew, $tcNew ? 'g' : ''],
    ['✉️', 'Повідомлень', $n('SELECT COUNT(*) n FROM kl_messages'), 'b'],
  ];
  $days = array_fill(0, 30, 0);
  foreach (q('SELECT created_at FROM kl_users WHERE created_at >= ?', [strtotime('today') - 29 * 86400])->fetchAll() as $r) {
    $i = 29 - intdiv(strtotime('today') - strtotime(date('Y-m-d', (int)$r['created_at'])), 86400);
    if ($i >= 0 && $i < 30) $days[$i]++;
  }
  $max = max(1, max($days));
  echo '<h1>Огляд</h1><div class="stats">';
  foreach ($stats as [$ic, $label, $val, $c]) echo '<div class="stat ' . $c . '"><span>' . $ic . '</span><b>' . $val . '</b><small>' . e($label) . '</small></div>';
  echo '</div><div class="grid"><div class="card"><h2>📈 Реєстрації за 30 днів</h2><div class="bars">';
  foreach ($days as $i => $d) echo '<i style="height:' . max(3, round($d / $max * 100)) . '%;' . ($d ? '' : 'background:var(--line)') . '" data-t="' . date('d.m', strtotime('today') - (29 - $i) * 86400) . ': ' . $d . '"></i>';
  echo '</div><div class="bars-x"><span>' . date('d.m', strtotime('today') - 29 * 86400) . '</span><span>сьогодні</span></div></div>';
  echo '<div class="card"><h2>🆕 Нові користувачі</h2><ul class="list">';
  foreach (q('SELECT * FROM kl_users ORDER BY created_at DESC LIMIT 7')->fetchAll() as $u) echo '<li><div>' . user_cell($u) . '</div><a class="btn sm" href="admin.php?p=user&amp;id=' . (int)$u['id'] . '">→</a></li>';
  echo '</ul><p style="margin:12px 0 0"><a href="admin.php?p=users">Усі користувачі →</a></p></div>';
  echo '<div class="card"><h2>⭐ Найкращі гравці</h2><ul class="list">';
  $top = q('SELECT name, code, level, stars, badges FROM kl_players ORDER BY stars DESC LIMIT 6')->fetchAll();
  foreach ($top as $t) echo '<li><div><b>' . e($t['name']) . '</b> <span class="pill ' . e($t['level']) . '">' . e($t['level'] ?: '—') . '</span></div><span>⭐ ' . (int)$t['stars'] . ' · 🏅 ' . (int)$t['badges'] . '</span></li>';
  if (!$top) echo '<li class="muted">Поки порожньо — гравці з’являться, коли ввімкнуть «Показувати профіль».</li>';
  echo '</ul></div><div class="card"><h2>💬 Останні коментарі</h2><ul class="list">';
  $cm = q('SELECT * FROM kl_comments ORDER BY created_at DESC LIMIT 5')->fetchAll();
  foreach ($cm as $c) echo '<li><div><b>' . e($c['name']) . '</b> → <code>' . e($c['owner']) . '</code><br><small>' . e($c['text']) . '</small></div><small class="muted">' . when((int)$c['created_at']) . '</small></li>';
  if (!$cm) echo '<li class="muted">Коментарів ще немає.</li>';
  echo '</ul></div></div>';
}

/* ---------- користувачі ---------- */
if ($p === 'users') {
  $qs = trim((string)($_GET['q'] ?? '')); $f = (string)($_GET['f'] ?? 'all'); $page = max(0, (int)($_GET['page'] ?? 0)); $per = 30;
  $where = []; $args = [];
  if ($qs !== '') { $where[] = '(LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR friend_code = ?)'; $like = '%' . strtolower($qs) . '%'; array_push($args, $like, $like, strtoupper($qs)); }
  $FILTERS = ['all' => 'Усі', 'verified' => '✓ Підтверджені', 'pending' => '⏳ Не підтвердили', 'admins' => '👑 Адміни', 'mods' => '🛡 Модератори', 'premium' => '💎 Преміум', 'blocked' => '⛔ Заблоковані'];
  if ($f === 'verified') $where[] = 'verified_at IS NOT NULL';
  if ($f === 'pending') $where[] = 'verified_at IS NULL';
  if ($f === 'admins') $where[] = 'is_admin = 1';
  if ($f === 'blocked') $where[] = 'blocked_at IS NOT NULL';
  if ($f === 'mods') $where[] = 'is_moderator = 1';
  if ($f === 'premium') $where[] = 'premium = 1';
  $w = $where ? ' WHERE ' . implode(' AND ', $where) : '';
  $total = (int)one("SELECT COUNT(*) n FROM kl_users$w", $args)['n'];
  $rows = q("SELECT u.*, (SELECT COUNT(*) FROM kl_user_data d WHERE d.user_id = u.id) AS nkeys FROM kl_users u$w ORDER BY created_at DESC LIMIT $per OFFSET " . ($page * $per), $args)->fetchAll();
  echo '<h1>Користувачі <small class="muted">(' . $total . ')</small></h1>';
  echo '<details class="card"><summary style="cursor:pointer;font:800 1.05rem Rubik,sans-serif">➕ Створити безкоштовний акаунт другу</summary><form method="post" action="admin.php?p=users" style="margin-top:12px">' . $csrf . '<input type="hidden" name="do" value="create_user">'
    . '<div class="cols2"><label class="f">Ім’я<input type="text" name="name" maxlength="30" required placeholder="Alina"></label><label class="f">Пошта<input type="email" name="email" required></label>'
    . '<label class="f">Мова листа<select name="lang"><option value="uk">Українська</option><option value="en">English</option><option value="no">Norsk</option><option value="ar">العربية</option></select></label></div>'
    . '<label class="check"><input type="checkbox" name="premium" value="1" checked> 💎 Преміум — безкоштовно назавжди</label><label class="check"><input type="checkbox" name="can_invite" value="1" checked> 🎟 Може запрошувати друзів (їхні акаунти теж безкоштовні)</label><label class="check"><input type="checkbox" name="moderator" value="1"> 🛡 Модератор (чистить стіни, дає тимчасові блокування)</label>'
    . '<p class="muted">Акаунт одразу підтверджений. Другу прийде лист із посиланням, щоб задати свій пароль.</p><button class="btn pri">Створити й надіслати лист</button></form></details><div class="card"><form class="filters" method="get"><input type="hidden" name="p" value="users"><input type="hidden" name="f" value="' . e($f) . '"><input type="search" name="q" value="' . e($qs) . '" placeholder="Ім’я, пошта або код друга…"><button class="btn">🔎 Шукати</button></form><div class="chips" style="margin-bottom:14px">';
  foreach ($FILTERS as $k => $label) echo '<a class="' . ($k === $f ? 'on' : '') . '" href="admin.php?p=users&amp;f=' . $k . '&amp;q=' . urlencode($qs) . '">' . e($label) . '</a>';
  echo '</div><table class="t"><thead><tr><th>Користувач</th><th>Статус</th><th>Код</th><th>Реєстрація</th><th>Останній вхід</th><th>Дані</th><th></th></tr></thead><tbody>';
  foreach ($rows as $u) echo '<tr><td>' . user_cell($u) . '</td><td>' . status_pills($u) . '</td><td data-l="Код"><code>' . e($u['friend_code']) . '</code></td><td data-l="Реєстрація">' . date('d.m.Y', (int)$u['created_at']) . '</td><td data-l="Вхід">' . when($u['last_login'] ? (int)$u['last_login'] : null) . '</td><td data-l="Ключів прогресу">' . (int)$u['nkeys'] . '</td><td><a class="btn sm" href="admin.php?p=user&amp;id=' . (int)$u['id'] . '">Відкрити →</a></td></tr>';
  if (!$rows) echo '<tr><td colspan="7" class="muted">Нікого не знайдено.</td></tr>';
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
    $sessions = q('SELECT created_at, last_seen, ua FROM kl_sessions WHERE user_id = ? AND expires_at > ? ORDER BY last_seen DESC LIMIT 10', [$id, time()])->fetchAll();
    $player = one('SELECT level, stars, badges FROM kl_players WHERE code = ?', [$u['friend_code']]);
    echo '<p><a href="admin.php?p=users">← Усі користувачі</a></p><div class="card"><div class="row" style="justify-content:space-between"><div class="u-name"><span class="u-ava" style="width:56px;height:56px;font-size:1.4rem">' . e(mb_first($u['name'])) . '</span><div><h1 style="margin:0">' . e($u['name']) . '</h1><small>' . e($u['email']) . '</small></div></div><div>' . status_pills($u) . '</div></div></div>';
    echo '<div class="stats">';
    foreach ([['📖', 'Коміксів відкрито', $read, 'y'], ['🧩', 'Тестів пройдено', $tests, 'g'], ['⭐', 'Зірок у тестах', $stars, 'b'], ['📝', 'Слів вивчено', $known, 'p'], ['🗂️', 'Ключів прогресу', count($data), '']] as [$ic, $l, $val, $c]) echo '<div class="stat ' . $c . '"><span>' . $ic . '</span><b>' . $val . '</b><small>' . $l . '</small></div>';
    echo '</div><div class="grid"><div class="card"><h2>👤 Дані</h2><dl class="kv"><dt>ID</dt><dd>' . (int)$u['id'] . '</dd><dt>Код друга</dt><dd><code>' . e($u['friend_code']) . '</code></dd><dt>Мова</dt><dd>' . e($u['lang']) . '</dd>'
      . '<dt>Реєстрація</dt><dd>' . date('d.m.Y H:i', (int)$u['created_at']) . '</dd><dt>Пошту підтверджено</dt><dd>' . ($u['verified_at'] ? date('d.m.Y H:i', (int)$u['verified_at']) : '—') . '</dd>'
      . '<dt>Останній вхід</dt><dd>' . when($u['last_login'] ? (int)$u['last_login'] : null) . '</dd><dt>Профіль у пошуку</dt><dd>' . ($player ? '✅ ' . e($player['level']) . ' · ⭐ ' . (int)$player['stars'] . ' · 🏅 ' . (int)$player['badges'] : 'прихований') . '</dd>'
      . ($u['blocked_at'] ? '<dt>Заблоковано</dt><dd>' . date('d.m.Y H:i', (int)$u['blocked_at']) . '</dd>' : '') . '</dl>'
      . ($player ? '<p style="margin-bottom:0"><a href="./#/player/c/' . e($u['friend_code']) . '" target="_blank" rel="noopener">Публічний профіль ↗</a></p>' : '') . '</div>';
    echo '<div class="card"><h2>🛠️ Дії</h2><div class="row">';
    if (!$u['verified_at']) { echo act('verify', $id, '✓ Підтвердити пошту', 'ok'); echo act('resend', $id, '📬 Надіслати лист підтвердження'); }
    echo act('reset', $id, '🔑 Надіслати посилання для нового пароля', '', 'Надіслати користувачу лист для зміни пароля?');
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
    echo '</div><div class="card"><h2>💻 Активні сесії (' . count($sessions) . ')</h2><ul class="list">';
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

/* ---------- матеріали ---------- */
if ($p === 'materials') {
  $CATS = ['hverdag' => '☀️ Щоденне життя', 'familie' => '👨‍👩‍👧 Сім’я', 'skole' => '🏫 Школа', 'jobb' => '💼 Робота', 'fritid' => '⚽ Дозвілля', 'mat' => '🍎 Їжа', 'butikk' => '🛒 Магазин',
    'natur' => '🌲 Природа', 'helse' => '🩺 Здоров’я', 'bolig' => '🏠 Житло', 'kultur' => '🎭 Культура'];
  $lvF = (string)($_GET['lv'] ?? '');
  $catF = (string)($_GET['cat'] ?? '');
  $qF = trim((string)($_GET['q'] ?? ''));
  $sortF = (string)($_GET['sort'] ?? '');

  /* Читаємо метадані прямо з data/comic-*.js: єдине джерело правди — вихідні файли,
     а не копія в базі, яка роз'їхалася б із першою ж новою збіркою. */
  $comics = [];
  foreach (glob(__DIR__ . '/data/comic-*.js') ?: [] as $file) {
    $src = (string)file_get_contents($file);
    $g = fn(string $k) => preg_match("/\\b$k:\\s*'((?:[^'\\\\]|\\\\.)*)'/", $src, $m) ? stripcslashes($m[1]) : '';
    $c = ['id' => $g('id'), 'level' => $g('level'), 'cat' => $g('category'), 'title' => $g('title'), 'uk' => $g('titleUk'), 'en' => $g('titleEn'),
      'panels' => preg_match_all('/\{\s*art:/', $src), 'lines' => preg_match_all('/\bwho:\s*\'/', $src),
      'kb' => round(filesize($file) / 1024), 'at' => (int)filemtime($file)];
    if ($c['id'] !== '') $comics[] = $c;
  }

  $reads = comic_reads();
  $quiz = comic_quizzes();
  foreach ($comics as &$c) {
    $r = $reads[$c['id']] ?? ['opened' => 0, 'counts' => []];
    $c['opened'] = (int)$r['opened'];
    /* «Дочитали» — той, у кого відмічено не менше кадрів, ніж їх у коміксі. */
    $c['done'] = count(array_filter($r['counts'], fn($n) => $c['panels'] > 0 && $n >= $c['panels']));
    $qz = $quiz[$c['id']] ?? ['n' => 0, 'stars' => 0];
    $c['quiz'] = (int)$qz['n'];
    $c['stars'] = $qz['n'] > 0 ? round($qz['stars'] / $qz['n'], 1) : 0;
  }
  unset($c);

  $byLv = array_count_values(array_column($comics, 'level'));
  $audio = count(glob(__DIR__ . '/audio/*.mp3') ?: []);
  $nUsers = (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE is_demo IS NULL OR is_demo = 0')['n'] ?? 0);
  $totOpen = array_sum(array_column($comics, 'opened'));
  $totDone = array_sum(array_column($comics, 'done'));
  $unread = count(array_filter($comics, fn($x) => $x['opened'] === 0));

  echo '<h1>Матеріали</h1>';
  echo '<div class="stats">'
    . '<div class="stat y"><span>📚</span><b>' . count($comics) . '</b><small>Коміксів</small></div>'
    . '<div class="stat g"><span>🖼️</span><b>' . array_sum(array_column($comics, 'panels')) . '</b><small>Кадрів</small></div>'
    . '<div class="stat b"><span>💬</span><b>' . array_sum(array_column($comics, 'lines')) . '</b><small>Реплік</small></div>'
    . '<div class="stat p"><span>🔊</span><b>' . $audio . '</b><small>Аудіофайлів</small></div>'
    . '<div class="stat b"><span>👁️</span><b>' . $totOpen . '</b><small>Відкривань</small></div>'
    . '<div class="stat g"><span>✅</span><b>' . $totDone . '</b><small>Дочитувань</small></div>'
    . '<div class="stat' . ($unread ? ' r' : '') . '"><span>🕳️</span><b>' . $unread . '</b><small>Ніхто не відкривав</small></div>'
    . '</div>';

  /* Чесно пишемо, звідки числа: інакше «3 відкривання» виглядає як провал теми,
     хоча насправді більшість читачів — гості, і їх тут не видно. */
  echo '<p class="muted" style="margin-top:-6px">Прочитання зібрані з прогресу <b>' . $nUsers . '</b> акаунтів, які синхронізувалися. Читачі без акаунта сюди не потрапляють, тому справжні числа більші.</p>';

  // ── фільтри ──
  $qs = function (array $over) use ($lvF, $catF, $qF, $sortF) {
    $a = array_filter(['lv' => $lvF, 'cat' => $catF, 'q' => $qF, 'sort' => $sortF] + [], fn($v) => $v !== '');
    foreach ($over as $k => $v) { if ($v === '') unset($a[$k]); else $a[$k] = $v; }
    return 'admin.php?p=materials' . ($a ? '&amp;' . http_build_query($a, '', '&amp;') : '');
  };
  echo '<form method="get" action="admin.php" class="filters">'
    . '<input type="hidden" name="p" value="materials">'
    . '<input type="search" name="q" value="' . e($qF) . '" placeholder="Пошук за назвою або кодом…" style="flex:1 1 240px">'
    . '<select name="cat"><option value="">Усі теми</option>';
  foreach ($CATS as $k => $label) echo '<option value="' . e($k) . '"' . ($catF === $k ? ' selected' : '') . '>' . e($label) . '</option>';
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
    . ($lvF || $catF || $qF !== '' || $sortF ? ' <a class="btn" href="admin.php?p=materials">Скинути</a>' : '')
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
    $hay = mb_lower($c['id'] . ' ' . $c['title'] . ' ' . $c['uk'] . ' ' . $c['en']);
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
  $card = function (array $c) use ($coverSrc, $CATS): string {
    $src = $coverSrc($c['id']);
    $img = $src !== ''
      ? '<img class="comic-cover" src="' . e($src) . '" alt="" loading="lazy" width="320" height="240">'
      : '<span class="comic-cover"></span>';
    $warm = $c['opened'] === 0 ? '<span class="pill r" title="Ніхто з акаунтів не відкривав">🕳️ 0</span>'
      : '<span class="pill b" title="Скільки акаунтів відкривали">👁️ ' . $c['opened'] . '</span>'
        . ' <span class="pill g" title="Скільки дійшли до останнього кадру">✅ ' . $c['done'] . '</span>';
    $qz = $c['quiz'] > 0 ? '<span class="pill y" title="Склали тест · середні зірки">🧩 ' . $c['quiz'] . ' · ⭐ ' . $c['stars'] . '</span>' : '';
    return '<div class="comic">' . $img
      . '<div class="row" style="justify-content:space-between"><span class="pill ' . e($c['level']) . '">' . e($c['level']) . '</span><code>' . e($c['id']) . '</code></div>'
      . '<b>' . e($c['title']) . '</b>'
      . '<small>🇺🇦 ' . e($c['uk']) . '<br>🇬🇧 ' . e($c['en']) . '</small>'
      . '<small>' . e($CATS[$c['cat']] ?? $c['cat']) . ' · 🖼️ ' . $c['panels'] . ' · 💬 ' . $c['lines'] . ' · ' . $c['kb'] . ' КБ</small>'
      . '<div class="row">' . $warm . ' ' . $qz . '</div>'
      . '<div class="row"><a class="btn sm" href="./#/read/' . e($c['id']) . '/0" target="_blank" rel="noopener">📖 Читати</a>'
      . '<a class="btn sm" href="./#/quiz/' . e($c['id']) . '" target="_blank" rel="noopener">🧩 Тест</a></div></div>';
  };

  if (!$show) {
    echo '<div class="card muted">Нічого не знайшлося. <a href="admin.php?p=materials">Скинути фільтри</a></div>';
  } elseif ($sortF === '') {
    // ── звичайний вигляд: групами за темою ──
    $groups = [];
    foreach ($show as $c) $groups[$c['cat']][] = $c;
    $ord = function (string $k) use ($CATS): int { $i = array_search($k, array_keys($CATS), true); return $i === false ? 99 : (int)$i; };
    uksort($groups, fn($a, $b) => $ord((string)$a) <=> $ord((string)$b));
    foreach ($groups as $cat => $list) {
      usort($list, fn($a, $b) => strcmp($a['level'], $b['level']) ?: strnatcmp($a['id'], $b['id']));
      echo '<section class="cat"><h2>' . e($CATS[$cat] ?? $cat) . ' <span class="pill">' . count($list) . '</span></h2><div class="comics">';
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

  $other = ['data/grammar.js' => '📐 Граматика (A1–B2)', 'data/words.js' => '📝 Слова за темами', 'data/english.js' => '🇬🇧 Англійська', 'data/basics.js' => '🔤 Алфавіт і числа', 'data/dictionary.js' => '📖 Словник NO→UK', 'data/dictionary-en.js' => '📖 Словник EN', 'data/characters.js' => '🎭 Персонажі'];
  echo '<div class="card"><h2>🧰 Інші навчальні матеріали</h2><ul class="list">';
  foreach ($other as $f => $label) if (is_file(__DIR__ . '/' . $f)) echo '<li><b>' . $label . '</b><small class="muted"><code>' . e($f) . '</code> · ' . round(filesize(__DIR__ . '/' . $f) / 1024) . ' КБ · ' . date('d.m.Y', filemtime(__DIR__ . '/' . $f)) . '</small></li>';
  echo '</ul><p class="muted" style="margin-bottom:0">Матеріали редагуються у вихідному проєкті й заливаються новою збіркою <code>dist/</code>.</p></div>';
}

/* ---------- спільнота ---------- */
if ($p === 'community') {
  echo '<h1>Спільнота</h1><div class="grid"><div class="card"><h2>💬 Коментарі на стінах</h2><ul class="list">';
  $cm = q('SELECT * FROM kl_comments ORDER BY created_at DESC LIMIT 60')->fetchAll();
  $cform = fn(array $c, string $do, string $label, string $cls = '', string $confirm = '', string $extra = '') => '<form method="post" action="admin.php?p=community"' . ($confirm ? ' data-confirm="' . e($confirm) . '"' : '') . '>' . $csrf . '<input type="hidden" name="do" value="' . $do . '"><input type="hidden" name="cid" value="' . e($c['id']) . '">' . $extra . '<button class="btn sm ' . $cls . '">' . $label . '</button></form>';
  foreach ($cm as $c) echo '<li style="flex-wrap:wrap"><div style="flex:1 1 220px"><b>' . e($c['name']) . '</b>' . (!empty($c['user_id']) ? ($isAdmin ? ' <a href="admin.php?p=user&amp;id=' . (int)$c['user_id'] . '">акаунт</a>' : ' <span class="pill">акаунт</span>') : ' <span class="pill">гість</span>') . ' → <a href="./#/player/c/' . e($c['owner']) . '" target="_blank" rel="noopener"><code>' . e($c['owner']) . '</code></a> <small class="muted">' . when((int)$c['created_at']) . '</small><br>' . e($c['text']) . '</div><div class="row">'
    . $cform($c, 'comment_del', '🗑', 'danger', 'Видалити коментар?') . $cform($c, 'comment_warn', '⚠️ Попередити', '', 'Прибрати допис і показати авторові анімацію «так не можна»?')
    . $cform($c, 'comment_ban', '⛔ 1 год', '', 'Прибрати допис і заборонити авторові писати 1 годину?', '<input type="hidden" name="hours" value="1">') . $cform($c, 'comment_ban', '⛔ 1 добу', '', 'Прибрати допис і заборонити авторові писати 1 добу?', '<input type="hidden" name="hours" value="24">') . $cform($c, 'comment_ban', '⛔ 7 днів', '', 'Прибрати допис і заборонити авторові писати 7 днів?', '<input type="hidden" name="hours" value="168">') . '</div></li>';
  if (!$cm) echo '<li class="muted">Коментарів ще немає.</li>';
  $bots = bots_list();
  $DIFF = ['easy' => '🟢 легкий', 'medium' => '🟡 середній', 'hard' => '🔴 сильний', 'pro' => '🟣 майстер'];
  echo '</ul></div><div class="card"><h2>🤖 Віртуальні гравці (' . count($bots) . ')</h2><p class="muted">Завжди «онлайн», грають у Логік-гонці, Math Rocket і шахах. Живуть у коді <code>assets/bots.js</code> — у базі їх немає, писати їм не можна.</p><table class="t"><thead><tr><th>Бот</th><th>Рівень</th><th>Складність</th><th>⭐</th><th>🏅</th><th>🎮</th><th>🥇</th></tr></thead><tbody>';
  foreach ($bots as $b) echo '<tr><td><b>' . e($b['name']) . '</b> <code>' . e($b['code']) . '</code><br><small class="muted">' . e($b['avatar']) . '</small></td><td data-l="Рівень"><span class="pill ' . e($b['level']) . '">' . e($b['level']) . '</span></td><td data-l="Складність">' . e($DIFF[$b['diff']] ?? $b['diff']) . '</td><td data-l="Зірки">' . $b['stars'] . '</td><td data-l="Значки">' . $b['badges'] . '</td><td data-l="Ігри">' . $b['games'] . '</td><td data-l="Перемоги">' . $b['wins'] . '</td></tr>';
  if (!$bots) echo '<tr><td colspan="7" class="muted">Не вдалося прочитати assets/bots.js.</td></tr>';
  echo '</tbody></table>';
  $bans = q('SELECT b.*, u.name FROM kl_bans b LEFT JOIN kl_users u ON u.id = b.user_id WHERE b.until_at > ? ORDER BY b.until_at DESC LIMIT 50', [time()])->fetchAll();
  echo '</div><div class="card"><h2>⛔ Діючі блокування стін (' . count($bans) . ')</h2><ul class="list">';
  foreach ($bans as $b) echo '<li><div><b>' . e($b['name'] ?: 'гість (за IP)') . '</b><br><small class="muted">до ' . date('d.m.Y H:i', (int)$b['until_at']) . '</small></div><form method="post" action="admin.php?p=community">' . $csrf . '<input type="hidden" name="do" value="unban"><input type="hidden" name="ban" value="' . (int)$b['id'] . '"><button class="btn sm ok">Зняти</button></form></li>';
  if (!$bans) echo '<li class="muted">Блокувань немає.</li>';
  if (!$isAdmin) { echo '</ul></div></div>'; } else echo '</ul></div><div class="card"><h2>🔎 Каталог гравців</h2><table class="t"><thead><tr><th>Гравець</th><th>Рівень</th><th>⭐</th><th>Оновлено</th><th></th></tr></thead><tbody>';
  $pl = $isAdmin ? q('SELECT p.code, p.name, p.level, p.stars, p.updated, u.id AS uid FROM kl_players p LEFT JOIN kl_users u ON u.id = p.user_id ORDER BY p.updated DESC LIMIT 60')->fetchAll() : [];
  foreach ($pl as $x) echo '<tr><td><b>' . e($x['name']) . '</b> <code>' . e($x['code']) . '</code>' . ($x['uid'] ? ' <a href="admin.php?p=user&amp;id=' . (int)$x['uid'] . '">акаунт</a>' : ' <span class="pill r" title="Картка з браузера, де ніхто не ввійшов. У рейтингу не показується.">без акаунта</span>') . '</td><td data-l="Рівень"><span class="pill ' . e($x['level']) . '">' . e($x['level'] ?: '—') . '</span></td><td data-l="Зірки">' . (int)$x['stars'] . '</td><td data-l="Оновлено">' . when((int)$x['updated']) . '</td><td><form method="post" action="admin.php?p=community" data-confirm="Прибрати гравця з пошуку?">' . $csrf . '<input type="hidden" name="do" value="player_del"><input type="hidden" name="code" value="' . e($x['code']) . '"><button class="btn sm">Прибрати</button></form></td></tr>';
  if (!$pl && $isAdmin) echo '<tr><td colspan="5" class="muted">Каталог порожній.</td></tr>';
  if ($isAdmin) echo '</tbody></table></div></div>';
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
  $KL = ['bug' => '🐞 Помилка', 'idea' => '💡 Правка / ідея', 'topic' => '📚 Тема для навчання', 'other' => '💬 Інше'];
  $only = preg_replace('/[^a-z]/', '', (string)($_GET['f'] ?? '')) ?: 'new';
  $where = $only === 'done' ? 'WHERE f.done_at IS NOT NULL' : ($only === 'all' ? '' : 'WHERE f.done_at IS NULL');
  $rows = q("SELECT f.*, u.name AS uname, u.email AS uemail FROM kl_feedback f LEFT JOIN kl_users u ON u.id = f.user_id $where ORDER BY f.created_at DESC LIMIT 200")->fetchAll();
  echo '<h1>Відгуки від користувачів</h1><p class="muted">Кнопка «💌 Відгук» є на кожній сторінці сайту: помилка, правка, ідея або прохання додати тему для навчання. Кожен відгук дублюється листом адміністраторам.</p>';
  echo '<div class="chips" style="margin-bottom:14px">' . implode('', array_map(fn($k) => '<a class="' . ($only === $k[0] ? 'on' : '') . '" href="admin.php?p=feedback&amp;f=' . $k[0] . '">' . $k[1] . '</a>', [['new', '🆕 Нові (' . $fbNew . ')'], ['done', '✅ Опрацьовані'], ['all', '📜 Усі']])) . '</div>';
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
      . ($f['done_at'] ? act('fb_undone', 0, '↩️ Повернути', '', '', $fbId) : act('fb_done', 0, '✅ Опрацьовано', 'pri', '', $fbId))
      . act('fb_del', 0, '🗑 Видалити', 'dang', 'Видалити цей відгук назавжди?', $fbId) . '</div></li>';
  }
  if (!$rows) echo '<li class="muted">Поки що порожньо.</li>';
  echo '</ul></div>';
}

if ($p === 'system') {
  $drv = db()->getAttribute(PDO::ATTR_DRIVER_NAME); $ver = db()->getAttribute(PDO::ATTR_SERVER_VERSION);
  $schema = one("SELECT v FROM kl_meta WHERE k = 'schema'")['v'] ?? '?';
  $m = (array)cfg('mail');
  $cfgFile = is_file(__DIR__ . '/api/config.php') ? __DIR__ . '/api/config.php' : __DIR__ . '/api/config.local.php';
  $perm = is_file($cfgFile) ? substr(sprintf('%o', fileperms($cfgFile)), -4) : '—';
  echo '<h1>Система</h1><div class="grid"><div class="card"><h2>🖥️ Сервер</h2><dl class="kv"><dt>PHP</dt><dd>' . PHP_VERSION . '</dd><dt>База</dt><dd>' . e($drv) . ' ' . e($ver) . '</dd><dt>Схема БД</dt><dd>v' . e($schema) . '</dd><dt>Адреса сайту</dt><dd>' . e(site_url()) . '</dd><dt>config.php</dt><dd>права ' . e($perm) . '</dd><dt>install.php</dt><dd>' . (is_file(__DIR__ . '/install.php') ? '⚠️ є — видаліть' : '✅ видалено') . '</dd></dl></div>';
  $m = mail_cfg();
  $mailBad = mail_problems();
  $lastErr = (string)meta_get('mail_last_error', '');
  $lastTry = (int)meta_get('mail_last_try', '0');
  echo '<div class="card"><h2>📬 Пошта</h2><dl class="kv"><dt>Спосіб</dt><dd>' . e($m['transport']) . '</dd><dt>SMTP</dt><dd>' . e($m['host'] . ':' . $m['port']) . ' ' . e($m['secure']) . '</dd>'
    . '<dt>Скринька</dt><dd>' . e($m['user'] ?: '—') . '</dd><dt>Пароль</dt><dd>' . ($m['pass'] === '' ? '<span class="pill">не задано</span>' : '✅ задано') . '</dd>'
    . '<dt>Відправник</dt><dd>' . e($m['from_name'] . ' <' . $m['from'] . '>') . '</dd>'
    . ($lastTry ? '<dt>Остання спроба</dt><dd>' . e(date('d.m.Y H:i', $lastTry)) . ' — ' . ($lastErr === '' ? '✅ успішно' : '❌ помилка') . '</dd>' : '') . '</dl>';
  if ($lastErr !== '') echo '<p class="err-box"><b>Помилка SMTP:</b><br><code>' . e($lastErr) . '</code></p>';
  if ($mailBad) echo '<p class="muted"><b>Що виправити в <code>api/config.php</code> → <code>mail</code>:</b></p><ul class="muted">' . implode('', array_map(fn($x) => '<li>' . e($x) . '</li>', $mailBad)) . '</ul>';
  echo '<p class="muted">Скринька створюється в hPanel → Emails. SMTP Hostinger: <code>smtp.hostinger.com</code>, порт <code>465</code>, <code>ssl</code>. Поле <code>from</code> має дорівнювати <code>user</code> — інакше сервер відхиляє лист.</p>'
    . '<form method="post" action="admin.php?p=system" style="margin-top:12px">' . $csrf . '<input type="hidden" name="do" value="test_mail"><button class="btn pri">📨 Надіслати тестовий лист на ' . e($me['email']) . '</button></form></div>';
  $nAdmins = (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE is_admin = 1 AND blocked_at IS NULL')['n'] ?? 0);
  $admins = q('SELECT id, name, email FROM kl_users WHERE is_admin = 1 AND blocked_at IS NULL ORDER BY id LIMIT 20')->fetchAll();
  echo '<div class="card"><h2>👑 Доступи</h2><dl class="kv"><dt>Адміністраторів</dt><dd><b>' . $nAdmins . '</b></dd></dl>';
  if ($nAdmins > 1) echo '<p class="err-box">Адміністратор має бути один. Зайвим зніміть права: 👥 Користувачі → фільтр «Адміністратори» → «Зняти адміна».</p>';
  echo '<ul class="muted">' . implode('', array_map(fn($a) => '<li>' . e($a['name']) . ' — <code>' . e($a['email']) . '</code></li>', $admins)) . '</ul>'
    . '<p class="muted">Учасники акції «перші 100» отримують Преміум і право запрошувати друзів, але <b>не</b> права адміністратора.</p>'
    . '<p><a class="btn" href="admin.php?p=users&f=admins">👥 Показати адміністраторів</a></p></div>';
  $fu = founders_used(); $fs = founder_slots();
  echo '<div class="card"><h2>🏅 Акція «перші 100»</h2><p class="muted">Перші ' . $fs . ' підтверджених акаунтів отримують Преміум назавжди, право запрошувати друзів і прибирати погані дописи на стінах (блокувати авторів можуть лише адмін і модератор). Далі — підписка 69 крон/міс.</p>'
    . '<dl class="kv"><dt>Зайнято місць</dt><dd><b>' . $fu . '</b> з ' . $fs . '</dd><dt>Лишилось</dt><dd>' . founders_left() . '</dd></dl>'
    . '<p class="muted">Кількість місць змінюється рядком <code>define(\'MK_FOUNDER_SLOTS\', 100);</code> в <code>api/config.php</code>.</p></div>';
  $sk = stripe_key('secret'); $pk = stripe_key('publishable'); $wh = stripe_key('webhook');
  $mask = fn(string $k) => $k === '' ? '<span class="pill">не задано</span>' : '<code>' . e(substr($k, 0, 8) . '…' . substr($k, -4)) . '</code>';
  $live = str_contains($sk, '_live_');
  $subs = 0; try { $subs = (int)(one("SELECT COUNT(*) AS n FROM kl_billing WHERE status = 'active'")['n'] ?? 0); } catch (Throwable $e) { /* немає таблиці */ }
  echo '<div class="card"><h2>💳 Оплата (Stripe)</h2><dl class="kv"><dt>Стан</dt><dd>' . (stripe_ready() ? ($live ? '✅ бойовий режим' : '🧪 тестовий режим') : '⚠️ не налаштовано') . '</dd>'
    . '<dt>Секретний ключ</dt><dd>' . $mask($sk) . '</dd><dt>Публічний ключ</dt><dd>' . $mask($pk) . '</dd><dt>Вебхук</dt><dd>' . $mask($wh) . '</dd>'
    . '<dt>Ціна</dt><dd>' . number_format(PREMIUM_PRICE / 100, 0) . ' ' . PREMIUM_CURRENCY . '/міс</dd><dt>Активних підписок</dt><dd>' . $subs . '</dd></dl>'
    . '<p class="muted">Ключі задаються лише у <code>api/config.php</code> на сервері (розділ <code>stripe</code>) і ніколи не потрапляють у браузер. Адреса вебхука: <code>' . e(site_url()) . 'api/stripe-webhook.php</code>. Якщо секретний ключ десь «засвітився» — зробіть <b>Roll key</b> у Stripe.</p></div>';
  echo '<div class="card"><h2>💾 Резервна копія бази</h2><p class="muted">Повний дамп таблиць <code>kl_*</code> одним файлом <code>.sql</code> — можна залити через phpMyAdmin або <code>mysql &lt; файл.sql</code>. Файл містить пошти й хеші паролів учасників: зберігайте його як пароль і не надсилайте нікому, зокрема в чати.</p>'
    . '<form method="post" action="admin.php?p=system">' . $csrf . '<input type="hidden" name="do" value="dump"><button class="btn pri">⬇️ Завантажити .sql</button></form></div>';
  echo '<div class="card"><h2>🔑 Мій пароль</h2><form method="post" action="admin.php?p=system">' . $csrf . '<input type="hidden" name="do" value="my_pass"><label class="f">Поточний пароль<input type="password" name="old" autocomplete="current-password" required></label><label class="f">Новий пароль<input type="password" name="new" minlength="10" autocomplete="new-password" required><small>Щонайменше 10 символів. Інші ваші сесії буде завершено.</small></label><button class="btn">Зберегти</button></form></div></div>';
}

/* ---------- 📣 розсилки ---------- */
/* Випадковий комікс для листа — із покажчика, який викладає збірка.
   Назва й опис беруться мовою одержувача: лист мовою, якої людина не знає,
   не читають. */
function pick_comic(string $lang): ?array {
  static $all = null;
  if ($all === null) {
    $f = __DIR__ . '/data/comics.json';
    $all = is_file($f) ? (json_decode((string)file_get_contents($f), true) ?: []) : [];
  }
  if (!$all) return null;
  $c = $all[random_int(0, count($all) - 1)];
  return ['id' => $c['id'], 'level' => $c['level'],
    'title' => $lang === 'uk' ? $c['titleUk'] : ($lang === 'no' ? $c['title'] : $c['titleEn']),
    'summary' => $lang === 'uk' ? $c['summaryUk'] : ($lang === 'no' ? $c['summary'] : $c['summaryEn'])];
}


const MAIL_KINDS = ['back', 'news', 'comic'];

/** Кому взагалі можна писати: підтверджена пошта, не відписався, не демо, не заблокований.
 *  Нікого не відсікаємо — рішення, кому саме слати, лишається за людиною. */
function mail_audience(string $kind): array {
  $rows = q("SELECT u.id, u.email, u.name, u.lang, u.last_login, u.created_at,
      (SELECT MAX(sent_at) FROM kl_mailouts m WHERE m.user_id = u.id AND m.kind = ?) AS last_sent
    FROM kl_users u
    WHERE u.verified_at IS NOT NULL AND u.blocked_at IS NULL AND u.mail_ok = 1
      AND (u.is_demo IS NULL OR u.is_demo = 0)
    ORDER BY u.last_login IS NULL DESC, u.last_login ASC", [$kind])->fetchAll();
  $gap = time() - MAILOUT_GAP;
  foreach ($rows as &$r) {
    $r['idle'] = intdiv(time() - (int)($r['last_login'] ?: $r['created_at']), 86400);
    $r['fresh'] = (int)$r['last_sent'] > $gap;            // писали днями — типово не позначаємо
  }
  return $rows;
}

if ($isAdmin && $post && $p === 'mail' && ($_POST['do'] ?? '') === 'send') {
  $kind = in_array((string)($_POST['kind'] ?? ''), MAIL_KINDS, true) ? (string)$_POST['kind'] : 'news';
  /* Шлемо рівно тим, кого позначили. Якщо не позначено нікого — нічого не робимо:
     мовчазна розсилка «всім підряд» через недогляд була б гіршою за порожній екран. */
  $ids = array_values(array_filter(array_map('intval', (array)($_POST['u'] ?? []))));
  if (!$ids) go('p=mail', 'mail_none');
  $ids = array_slice($ids, 0, 50);
  $all = mail_audience($kind);
  $list = array_filter($all, fn($r) => in_array((int)$r['id'], $ids, true));
  $sent = 0; $failed = 0;
  foreach ($list as $r) {
    $url = site_url() . '#/whatsnew';
    $extra = '';
    if ($kind === 'comic') {
      $c = pick_comic($r['lang'] ?? 'en');
      $url = site_url() . '#/read/' . ($c['id'] ?? 'p91') . '/1';
      if ($c) $extra = '<p style="margin:14px 0 0;font-size:17px"><b>' . e($c['title']) . '</b><br><span style="color:#5d5346">' . e($c['level'] . ' · ' . ($c['summary'] ?? '')) . '</span></p>';
    }
    if (send_campaign($r, $kind, $url, $extra)) $sent++; else $failed++;
  }
  go('p=mail', $failed ? 'mail_part' : 'mail_ok');
}

/* ---------- 🩺 діагностика: чи все розгорнуто правильно ---------- */
if ($p === 'diag') {
  require_once __DIR__ . '/api/diag.php';
  $d = diag_run();
  $c = $d['count'];
  $tone = $c[DIAG_BAD] > 0 ? 'err' : ($c[DIAG_WARN] > 0 ? 'warn' : 'ok');
  $verdict = $c[DIAG_BAD] > 0
    ? 'Знайдено ' . $c[DIAG_BAD] . ' серйозних проблем — виправте їх перш ніж рухатися далі.'
    : ($c[DIAG_WARN] > 0 ? 'Працює, але ' . $c[DIAG_WARN] . ' зауважень варто прибрати.' : 'Усе гаразд — сайт розгорнуто правильно.');
  $ICON = [DIAG_OK => '✅', DIAG_WARN => '⚠️', DIAG_BAD => '⛔', DIAG_SKIP => '➖'];
  $PILL = [DIAG_OK => 'g', DIAG_WARN => 'y', DIAG_BAD => 'r', DIAG_SKIP => ''];

  echo '<h1>Діагностика</h1>'
    . '<div class="msg ' . $tone . '">' . ($c[DIAG_BAD] > 0 ? '⛔ ' : ($c[DIAG_WARN] > 0 ? '⚠️ ' : '✅ ')) . e($verdict) . '</div>'
    . '<div class="stats">'
    . '<div class="stat"><b>' . $c[DIAG_OK] . '</b><span class="lbl">гаразд</span></div>'
    . '<div class="stat"><b>' . $c[DIAG_WARN] . '</b><span class="lbl">зауважень</span></div>'
    . '<div class="stat"><b>' . $c[DIAG_BAD] . '</b><span class="lbl">проблем</span></div></div>'
    . '<p><a class="btn pri" href="admin.php?p=diag">🔄 Перевірити ще раз</a> '
    . '<a class="btn" href="api/health.php?key=' . health_key() . '" target="_blank" rel="noopener">🩺 health.php</a> '
    . '<small class="muted">перевірка зайняла ' . $d['ms'] . ' мс</small></p>';

  foreach ($d['groups'] as $g) {
    $bad = 0;
    foreach ($g['items'] as $i) if ($i['level'] === DIAG_BAD) $bad++;
    echo '<div class="card"><h2>' . e($g['title']) . ($bad ? ' <span class="pill r">' . $bad . '</span>' : '') . '</h2>'
      . '<p class="muted" style="margin-top:-4px">' . e($g['hint']) . '</p><ul class="diag">';
    foreach ($g['items'] as $i) {
      echo '<li class="d-' . e($i['level']) . '"><span class="d-ic">' . $ICON[$i['level']] . '</span>'
        . '<div><b>' . e($i['title']) . '</b> <span class="pill ' . $PILL[$i['level']] . '">' . e($i['value']) . '</span>'
        . ($i['fix'] !== '' ? '<br><small class="muted">' . e($i['fix']) . '</small>' : '') . '</div></li>';
    }
    echo '</ul></div>';
  }
  echo '<div class="card"><h2>📘 Що робити далі</h2><p class="muted">Повний посібник — файл <code>store/GUIDE.html</code> у проєкті: збірка, заливання, застосунок, Google Play і чек-листи. Ця сторінка перевіряє те саме, але вже на живому сервері.</p></div>';
}

/* ---------- 📣 розсилки: нагадати, показати нове, підкинути комікс ---------- */
if ($p === 'mail') {
  $kinds = [
    'back' => ['👋 Давно не заходили', 'Нагадування тим, хто зник. Веде на «Що нового».'],
    'news' => ['📰 Що нового', 'Коротко про останні зміни.'],
    'comic' => ['📖 Новий комікс', 'Випадкова історія, яку варто прочитати сьогодні.'],
  ];
  $selKind = in_array((string)($_GET['k'] ?? ''), MAIL_KINDS, true) ? (string)$_GET['k'] : 'news';
  $aud = mail_audience($selKind);

  $optOut = (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE mail_ok = 0')['n'] ?? 0);
  $sent7 = (int)(one('SELECT COUNT(*) AS n FROM kl_mailouts WHERE sent_at > ?', [time() - 7 * 86400])['n'] ?? 0);
  $ready = 0;
  foreach ($aud as $r) if (!$r['fresh']) $ready++;

  echo '<h1>Розсилки</h1>'
    . '<div class="stats">'
    . '<div class="stat"><b>' . count($aud) . '</b><span class="lbl">можна писати</span></div>'
    . '<div class="stat"><b>' . $ready . '</b><span class="lbl">не писали 5 днів</span></div>'
    . '<div class="stat"><b>' . $optOut . '</b><span class="lbl">відписалися</span></div>'
    . '<div class="stat"><b>' . $sent7 . '</b><span class="lbl">листів за 7 днів</span></div></div>';

  echo '<div class="card"><h2>1. Що надсилаємо</h2><div class="row" style="flex-wrap:wrap;gap:8px">';
  foreach ($kinds as $k => $info) {
    echo '<a class="btn' . ($k === $selKind ? ' pri' : '') . '" href="admin.php?p=mail&k=' . $k . '">' . e($info[0]) . '</a>';
  }
  echo '</div><p class="muted">' . e($kinds[$selKind][1]) . '</p></div>';

  if (!$aud) {
    echo '<div class="msg warn">Нікому писати: немає жодного підтвердженого акаунта без відписки.</div>';
  } else {
    echo '<form method="post" action="admin.php?p=mail" id="mailForm" data-confirm="Надіслати листи позначеним людям? Це справжні листи.">' . $csrf
      . '<input type="hidden" name="do" value="send"><input type="hidden" name="kind" value="' . e($selKind) . '">'
      . '<div class="card"><h2>2. Кому</h2>'
      . '<div class="row" style="flex-wrap:wrap;gap:8px;margin-bottom:10px">'
      . '<button class="btn sm" type="button" data-pick="all">Усіх</button>'
      . '<button class="btn sm" type="button" data-pick="none">Нікого</button>'
      . '<button class="btn sm" type="button" data-pick="idle">Хто не заходив 14+ днів</button>'
      . '<button class="btn sm" type="button" data-pick="fresh">Кому давно не писали</button>'
      . '<b class="mail-count" id="mailCount">0</b></div>'
      . '<ul class="list mail-list">';
    foreach ($aud as $r) {
      $seen = (int)$r['last_login'];
      $when = $seen ? when($seen) : 'жодного разу';
      echo '<li><label class="mail-row">'
        . '<input type="checkbox" name="u[]" value="' . (int)$r['id'] . '" data-idle="' . (int)$r['idle'] . '" data-fresh="' . ((int)$r['fresh']) . '"'
        . (!$r['fresh'] ? ' checked' : '') . '>'
        . '<span class="mail-who"><b>' . e($r['name']) . '</b> <span class="pill">' . e($r['lang']) . '</span><br>'
        . '<small class="muted">' . e($r['email']) . '</small></span>'
        . '<span class="mail-meta"><small class="muted">вхід: ' . e($when) . '</small><br>'
        . '<small class="muted">' . ((int)$r['last_sent'] ? 'писали: ' . e(when((int)$r['last_sent'])) : 'ще не писали') . '</small></span>'
        . '</label></li>';
    }
    echo '</ul>'
      . '<p class="muted">Типово позначені ті, кому цей самий лист не йшов щонайменше п’ять днів. За раз — не більше п’ятдесяти, щоб пошта Hostinger не вважала це спамом.</p>'
      . '<button class="btn pri" type="submit">📣 Надіслати позначеним</button>'
      . '</div></form>';
  }

  /* Журнал: кому й коли вже писали. Найчастіше питання саме це. */
  $log = q('SELECT m.kind, m.sent_at, m.ok, u.name, u.email FROM kl_mailouts m
    JOIN kl_users u ON u.id = m.user_id ORDER BY m.sent_at DESC LIMIT 40')->fetchAll();
  echo '<div class="card"><h2>📜 Останні відправки</h2>';
  if (!$log) echo '<p class="muted">Поки нічого не надсилали.</p>';
  else {
    echo '<table><tr><th>Коли</th><th>Кому</th><th>Що</th><th></th></tr>';
    foreach ($log as $r) {
      echo '<tr><td>' . e(when((int)$r['sent_at'])) . '</td><td>' . e($r['name']) . '<br><small class="muted">' . e($r['email']) . '</small></td>'
        . '<td>' . e($kinds[$r['kind']][0] ?? $r['kind']) . '</td><td>' . ((int)$r['ok'] ? '✅' : '❌') . '</td></tr>';
    }
    echo '</table>';
  }
  echo '</div>';

  /* Останні входи — щоб бачити, чи розсилка взагалі повертає людей. */
  $logins = q('SELECT name, email, last_login, lang FROM kl_users WHERE last_login IS NOT NULL ORDER BY last_login DESC LIMIT 15')->fetchAll();
  echo '<div class="card"><h2>🕑 Останні входи</h2><table><tr><th>Коли</th><th>Хто</th><th>Мова</th></tr>';
  foreach ($logins as $r) {
    echo '<tr><td>' . e(when((int)$r['last_login'])) . '</td><td>' . e($r['name']) . '<br><small class="muted">' . e($r['email']) . '</small></td><td>' . e($r['lang']) . '</td></tr>';
  }
  echo '</table><p class="muted">Якщо після розсилки тут порожньо кілька днів — лист не спрацював, і варто змінити текст або привід.</p></div>';

  /* Лічильник і швидкий вибір: без них у списку на сорок рядків легко
     надіслати не тим або не помітити, що не позначено нікого. */
  echo '<script nonce="' . e($nonce) . '">(() => {
    const form = document.getElementById("mailForm"); if (!form) return;
    const boxes = [...form.querySelectorAll("input[name=\'u[]\']")];
    const out = document.getElementById("mailCount");
    const paint = () => {
      const n = boxes.filter(b => b.checked).length;
      out.textContent = n ? "позначено: " + n : "нікого не позначено";
      out.classList.toggle("none", !n);
    };
    form.addEventListener("change", paint);
    for (const b of form.querySelectorAll("[data-pick]")) b.addEventListener("click", () => {
      const how = b.dataset.pick;
      for (const x of boxes) {
        if (how === "all") x.checked = true;
        else if (how === "none") x.checked = false;
        else if (how === "idle") x.checked = Number(x.dataset.idle) >= 14;
        else if (how === "fresh") x.checked = x.dataset.fresh === "0";
      }
      paint();
    });
    form.addEventListener("submit", ev => {
      if (!boxes.some(b => b.checked)) { ev.preventDefault(); out.classList.add("none"); out.textContent = "спершу позначте, кому писати"; }
    });
    paint();
  })();</script>';
}

page_close($nonce);
