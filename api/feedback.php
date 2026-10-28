<?php
/* Комікс·Lab — 💌 відгук розробнику з будь-якої сторінки.
 * GET  feedback.php?captcha=1            → { ok, q, opts, token } — приклад-капча (як на стінах)
 * POST feedback.php                      → { action: "send", kind, text, email?, page, lang, token, answer }
 *      kind: bug | idea | topic | other | android
 * Захист: капча + обмеження за IP (5 за годину, 20 за добу), довжина тексту, однакова відповідь при помилці.
 * Усе лягає в kl_feedback і листом іде адміністраторам; читати — в адмінпанелі (admin.php?p=feedback).
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

const KINDS = ['bug', 'idea', 'topic', 'other', 'android'];
const KIND_LABEL = ['bug' => '🐞 Помилка', 'idea' => '💡 Правка / ідея', 'topic' => '📚 Тема для навчання', 'other' => '💬 Інше', 'android' => '🤖 Android — запит посилання для тесту'];
const MAX_FEEDBACK = 2000;
function fb_len(string $s): int { return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : (int)preg_match_all('/./us', $s); }

if (method() === 'GET') {
  // max_file — скільки байтів може важити вкладення саме на цьому сервері (клієнт стискає фото під нього)
  if (isset($_GET['captcha'])) { rate_or_fail('fb-cap:' . ip_hash(), 60, 3600); out(['ok' => true, 'max_file' => upload_file_max()] + new_captcha()); }
  if (isset($_GET['limits'])) out(['ok' => true, 'max_file' => upload_file_max()]);
  fail('action', 404);
}
if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input(upload_input_max());
$ip = ip_hash();

if ((string)($in['action'] ?? '') !== 'send') fail('action', 404);
// «медова пастка» для ботів: поле, якого людина не бачить
if (trim((string)($in['website'] ?? '')) !== '') out(['ok' => true]);
rate_or_fail('fb:' . $ip, 5, 3600);
rate_or_fail('fb-day:' . $ip, 20, 86400);

$kind = in_array($in['kind'] ?? '', KINDS, true) ? (string)$in['kind'] : 'other';
$text = clean_text((string)($in['text'] ?? ''), MAX_FEEDBACK);
$email = strtolower(trim((string)($in['email'] ?? '')));
if ($email !== '' && !valid_email($email)) fail('email');
if ($kind === 'android' && $email === '') fail('email');
if (fb_len($text) < 10) fail('short');
if (!check_captcha((string)($in['token'] ?? ''), (int)($in['answer'] ?? -1))) fail('captcha', 403);

$u = current_user();
$ban = active_ban($u ? (int)$u['id'] : null, $ip);
if ($ban) fail('banned', 403);

// 📎 необов’язкове вкладення: фото, pdf або txt (до 4 МБ)
$up = save_upload((string)($in['file'] ?? ''), (string)($in['file_name'] ?? ''));
if ($up === false) fail('file');

$page = clean_text((string)($in['page'] ?? ''), 190);
$lang = kl_lang($in['lang'] ?? '', '');
$ua = clean_text((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 190);
q('INSERT INTO kl_feedback (kind, text, email, page, lang, user_id, ip_hash, ua, created_at, file, file_name, file_type, file_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  [$kind, $text, $email, $page, $lang, $u ? (int)$u['id'] : null, $ip, $ua, time(), $up['file'] ?? '', $up['name'] ?? '', $up['type'] ?? '', $up['size'] ?? 0]);
$id = (int)db()->lastInsertId();

notify_admins(KIND_LABEL[$kind] . ' — новий відгук #' . $id, [
  ['Тип', KIND_LABEL[$kind]],
  ['Від', $u ? $u['name'] . ' (' . $u['email'] . ')' : ($email !== '' ? $email : 'гість')],
  ['Сторінка', $page !== '' ? $page : '—'],
  ['Мова', $lang !== '' ? $lang : '—'],
  ['Текст', $text],
  ['Вкладення', $up ? $up['name'] . ' (' . round(($up['size'] ?? 0) / 1024) . ' КБ)' : '—'],
], 'admin.php?p=feedback');

out(['ok' => true, 'id' => $id]);
