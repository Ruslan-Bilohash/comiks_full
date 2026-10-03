<?php
/* Комікс·Lab — 🎓 Преміум для вчителів: безкоштовно, після підтвердження, що людина навчає.
 *
 * GET  teacher.php?action=state        → { ok, status, teacher, premium }
 * POST { action: "apply", school, role, country, proof, link, file, file_name }
 *      підтвердження — у вільній формі: посилання на сторінку школи, фото посвідчення,
 *      робоча пошта, розклад — що завгодно, що переконає адміністратора.
 * POST { action: "cancel" }            → скасувати свою заявку, поки її не розглянули
 *
 * Рішення ухвалює людина в адмінпанелі (admin.php?p=teachers) — автоматично преміум не вмикається.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

if (method() === 'GET') {
  if ((string)($_GET['action'] ?? '') !== 'state') fail('action', 404);
  $u = current_user();
  if (!$u) out(['ok' => true, 'auth' => false, 'status' => '', 'teacher' => false, 'max_file' => upload_file_max()]);
  $row = one('SELECT status, created_at, note FROM kl_teachers WHERE user_id = ?', [$u['id']]);
  out(['ok' => true, 'auth' => true, 'teacher' => !empty($u['is_teacher']), 'premium' => has_premium($u), 'max_file' => upload_file_max(),
    'status' => $row ? (string)$row['status'] : '', 'note' => $row ? (string)$row['note'] : '',
    'sent' => $row ? gmdate('c', (int)$row['created_at']) : null]);
}
if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input(upload_input_max());
$u = require_user();
$action = (string)($in['action'] ?? '');

if ($action === 'cancel') {
  q("DELETE FROM kl_teachers WHERE user_id = ? AND status = 'pending'", [$u['id']]);
  out(['ok' => true, 'status' => '']);
}
if ($action !== 'apply') fail('action', 404);
if (!empty($u['is_teacher'])) fail('already', 409);
rate_or_fail('teach:' . $u['id'], 5, 86400);

$school = clean_text((string)($in['school'] ?? ''), 120);
$role = clean_text((string)($in['role'] ?? ''), 80);
$country = clean_text((string)($in['country'] ?? ''), 60);
$proof = clean_text((string)($in['proof'] ?? ''), 1200);
$link = clean_text((string)($in['link'] ?? ''), 190);
if (mb_strlen($school) < 2 || mb_strlen($proof) < 10) fail('short');
if ($link !== '' && !preg_match('~^https?://[\w.-]+\.[a-z]{2,}(/\S*)?$~i', $link)) fail('link');

$up = save_upload((string)($in['file'] ?? ''), (string)($in['file_name'] ?? ''));
if ($up === false) fail('file');

$old = one('SELECT file FROM kl_teachers WHERE user_id = ?', [$u['id']]);
if ($old && !empty($old['file']) && $up) delete_upload((string)$old['file']);
upsert('kl_teachers', ['user_id'], [
  'user_id' => (int)$u['id'], 'school' => $school, 'role' => $role, 'country' => $country,
  'proof' => $proof, 'link' => $link, 'file' => $up['file'] ?? ($old['file'] ?? ''), 'file_name' => $up['name'] ?? '',
  'file_type' => $up['type'] ?? '', 'status' => 'pending', 'note' => '', 'created_at' => time(), 'decided_at' => null, 'by_id' => null,
]);

notify_admins('🎓 Заявка вчителя: ' . $u['name'], [
  ['Ім’я', $u['name']], ['Пошта', $u['email']], ['Школа', $school], ['Роль', $role !== '' ? $role : '—'],
  ['Країна', $country !== '' ? $country : '—'], ['Посилання', $link !== '' ? $link : '—'],
  ['Підтвердження', $proof], ['Файл', $up ? $up['name'] : '—'],
], 'admin.php?p=teachers');

out(['ok' => true, 'status' => 'pending']);
