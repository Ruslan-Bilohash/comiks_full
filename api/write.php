<?php
/* Комікс·Lab — ✍️ письмо з перевіркою: учень пише кілька речень норвезькою,
 * модель повертає виправлений текст, список помилок із поясненням і зразок.
 *
 * GET  write.php?action=state              → { ok, ai, left, limit }
 * POST { action:"check", task, level, lang, text }
 *      → { ok, fixed, errors:[{ wrong, right, why }], tip, sample, score, left }
 *
 * Ключ ШІ лишається на сервері. Без ключа сторінка працює в «тихому» режимі:
 * фронтенд просто зберігає текст і показує зразок відповіді з завдання.
 * Захист: CSRF, ліміт перевірок на добу (щоб не витратити бюджет), обрізання довжин.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

const WRITE_FREE_DAY = 6;        // перевірок на добу для гостя без акаунта
const WRITE_ACCOUNT_DAY = 15;    // для будь-якого акаунта — навчання безкоштовне
const WRITE_PREMIUM_DAY = 60;    // для вчителів і персоналу
const WRITE_MAX_TEXT = 1200;

function write_limit(?array $u): int { return has_premium($u) ? WRITE_PREMIUM_DAY : ($u ? WRITE_ACCOUNT_DAY : WRITE_FREE_DAY); }
function write_used(string $id): int {
  $k = substr(hash('sha256', 'write:' . $id . ':' . cfg('secret')), 0, 40) . ':86400';
  $row = one('SELECT n, reset_at FROM kl_rate WHERE k = ?', [$k]);
  return ($row && (int)$row['reset_at'] > time()) ? (int)$row['n'] : 0;
}

if (method() === 'GET') {
  if ((string)($_GET['action'] ?? '') !== 'state') fail('action', 404);
  $u = current_user();
  $id = $u ? 'u' . $u['id'] : ip_hash();
  $limit = write_limit($u);
  out(['ok' => true, 'ai' => ai_feature_on('write'), 'limit' => $limit, 'left' => max(0, $limit - write_used($id))]);
}
if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input();
if ((string)($in['action'] ?? '') !== 'check') fail('action', 404);

$u = current_user();
$id = $u ? 'u' . $u['id'] : ip_hash();
$limit = write_limit($u);
if (!ai_feature_on('write')) fail('no_ai', 503);
rate_or_fail('write-ip:' . ip_hash(), 40, 3600);
if (limited('write:' . $id, $limit, 86400)) fail('write_limit', 429);

$task = clean_text((string)($in['task'] ?? ''), 200);
$level = in_array($in['level'] ?? '', ['A1', 'A2', 'B1', 'B2'], true) ? (string)$in['level'] : 'A1';
$lang = in_array($in['lang'] ?? '', ['en', 'no', 'uk', 'ar'], true) ? (string)$in['lang'] : 'en';
$text = clean_text((string)($in['text'] ?? ''), WRITE_MAX_TEXT);
if (mb_strlen($text) < 5) fail('short');

$why = ['en' => 'English', 'uk' => 'Ukrainian', 'no' => 'very simple Norwegian', 'ar' => 'Arabic'][$lang];
$len = $level === 'A1' ? '2–3 short sentences' : ($level === 'A2' ? '3–5 sentences' : '5–8 sentences');
$system = <<<TXT
You are a kind Norwegian teacher marking a short piece of writing from a learner at level {$level}.
The task was: "{$task}".
Answer with JSON only, no markdown, no extra text, exactly in this shape:
{"fixed":"...","errors":[{"wrong":"...","right":"...","why":"..."}],"tip":"...","sample":"...","score":0}
Rules:
- "fixed": the learner's own text corrected into natural Norwegian (bokmål). Keep their meaning, their names and their ideas. Do not make it longer or fancier than level {$level}.
- "errors": at most five real mistakes, each with the learner's exact wrong fragment, the corrected fragment, and a short reason written in {$why} (one sentence, no grammar jargon beyond the basics).
- If the text has no mistakes, return an empty "errors" list and say so in "tip".
- "tip": one friendly sentence in {$why} about the single most useful thing to practise next.
- "sample": a model answer to the task in Norwegian at level {$level}, {$len}, different from the learner's text.
- "score": an integer 0–100 for how well the task was done at level {$level}.
- Never invent mistakes that are not in the text. Never comment on anything except the writing.
TXT;

$out = ai_chat($system, [['role' => 'user', 'content' => $text]], 700, ai_write_model());
if ($out === null) fail('ai', 502);

// модель іноді обгортає JSON у ```json … ``` — витягуємо перший об'єкт
if (preg_match('/\{.*\}/su', $out, $m)) $out = $m[0];
$j = json_decode($out, true);
if (!is_array($j)) fail('ai', 502);

$errors = [];
foreach (array_slice((array)($j['errors'] ?? []), 0, 5) as $e) {
  if (!is_array($e)) continue;
  $wrong = clean_text((string)($e['wrong'] ?? ''), 120);
  $right = clean_text((string)($e['right'] ?? ''), 120);
  $note = clean_text((string)($e['why'] ?? ''), 240);
  if ($wrong !== '' && $right !== '') $errors[] = ['wrong' => $wrong, 'right' => $right, 'why' => $note];
}
out([
  'ok' => true,
  'fixed' => clean_text((string)($j['fixed'] ?? ''), WRITE_MAX_TEXT),
  'errors' => $errors,
  'tip' => clean_text((string)($j['tip'] ?? ''), 300),
  'sample' => clean_text((string)($j['sample'] ?? ''), 800),
  'score' => max(0, min(100, (int)($j['score'] ?? 0))),
  'left' => max(0, $limit - write_used($id)),
]);
