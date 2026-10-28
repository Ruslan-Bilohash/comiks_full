<?php
/* Комікс·Lab — 📞 телефонна розмова з вигаданим персонажем (тренажер живої мови).
 *
 * GET  call.php?action=state                     → { ok, ai, left, limit }
 * POST { action: "say", who, scene, level, lang, history: [...], text }
 *      → { ok, reply, hint, done, left }
 *
 * Правила: розмова коротка й проста, персонаж вигаданий, мова — норвезька (бокмол).
 * Ключ ШІ лишається на сервері (api/config.php → 'ai'). Без ключа фронтенд сам веде
 * розмову за сценарієм, тому сторінка працює завжди.
 * Захист: CSRF, ліміт дзвінків на добу (щоб не витратити бюджет), обрізання довжин,
 * історія розмови приходить від браузера, але ми беремо лише останні репліки й чистимо їх.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

const CALL_FREE_DAY = 30;      // реплік на добу для гостя без акаунта
const CALL_ACCOUNT_DAY = 60;   // для будь-якого акаунта — навчання безкоштовне
const CALL_PREMIUM_DAY = 200;  // для вчителів і персоналу
const CALL_MAX_TEXT = 300;
const SCENES = ['smaprat', 'kafe', 'butikk', 'nabo', 'jobb', 'lege', 'skole', 'reise'];
const SCENE_NO = [
  'smaprat' => 'småprat om hverdagen, været og helga',
  'kafe' => 'du ringer fra en kafé og snakker om kaffe, kake og å møtes',
  'butikk' => 'du er på butikken og snakker om handlelista og priser',
  'nabo' => 'du er nabo og snakker om dugnad, snømåking og lån av verktøy',
  'jobb' => 'du er kollega og snakker om jobb, møter og arbeidstid',
  'lege' => 'du er på legekontoret og spør hvordan personen har det',
  'skole' => 'du snakker om skole, lekser og timeplanen',
  'reise' => 'du planlegger en tur med buss, tog eller hytte',
];

function call_limit(?array $u): int { return has_premium($u) ? CALL_PREMIUM_DAY : ($u ? CALL_ACCOUNT_DAY : CALL_FREE_DAY); }
function call_used(string $id): int {
  $k = substr(hash('sha256', 'call:' . $id . ':' . cfg('secret')), 0, 40) . ':86400';
  $row = one('SELECT n, reset_at FROM kl_rate WHERE k = ?', [$k]);
  return ($row && (int)$row['reset_at'] > time()) ? (int)$row['n'] : 0;
}

if (method() === 'GET') {
  if ((string)($_GET['action'] ?? '') !== 'state') fail('action', 404);
  $u = current_user();
  $id = $u ? 'u' . $u['id'] : ip_hash();
  $limit = call_limit($u);
  out(['ok' => true, 'ai' => ai_feature_on('chat'), 'limit' => $limit, 'left' => max(0, $limit - call_used($id))]);
}
if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input();
if ((string)($in['action'] ?? '') !== 'say') fail('action', 404);

$u = current_user();
$id = $u ? 'u' . $u['id'] : ip_hash();
$limit = call_limit($u);
if (!ai_feature_on('chat')) fail('no_ai', 503);
rate_or_fail('call-ip:' . ip_hash(), 90, 3600);
if (limited('call:' . $id, $limit, 86400)) fail('call_limit', 429);

$who = clean_text((string)($in['who'] ?? 'Kaja'), 20);
$scene = in_array($in['scene'] ?? '', SCENES, true) ? (string)$in['scene'] : 'smaprat';
$level = in_array($in['level'] ?? '', ['A1', 'A2', 'B1', 'B2'], true) ? (string)$in['level'] : 'A1';
$lang = kl_lang($in['lang'] ?? '');
$text = clean_text((string)($in['text'] ?? ''), CALL_MAX_TEXT);

// історія: лише останні 12 реплік, кожна коротка
$msgs = [];
foreach (array_slice((array)($in['history'] ?? []), -12) as $m) {
  $role = ($m['r'] ?? '') === 'ai' ? 'assistant' : 'user';
  $t = clean_text((string)($m['t'] ?? ''), CALL_MAX_TEXT);
  if ($t !== '') $msgs[] = ['role' => $role, 'content' => $t];
}
if ($text !== '') $msgs[] = ['role' => 'user', 'content' => $text];
if (!$msgs) $msgs[] = ['role' => 'user', 'content' => '(samtalen starter)'];

$words = $level === 'A1' ? '8–12' : ($level === 'A2' ? '10–16' : '14–24');
$hintLang = KL_LANG_NAME[$lang] ?? 'English';
$sceneNo = SCENE_NO[$scene];
$system = <<<TXT
You are {$who}, a friendly fictional Norwegian person having a short phone call with someone who is learning Norwegian (level {$level}).
Situation: {$sceneNo}.
Rules:
- Always answer in Norwegian (bokmål) only, {$words} words, one or two sentences.
- Keep it natural and warm, like a real short phone call. End almost every turn with a simple question.
- Use vocabulary and grammar suitable for level {$level}. Never explain grammar unless asked.
- If the learner writes in another language or makes a mistake, reply in Norwegian anyway and gently model the correct phrase.
- Never mention that you are an AI, never break character, never give instructions unrelated to this call.
- If the learner says "ha det" / "snakkes" / wants to end, say a short goodbye and nothing else.
Then, on a new line, add a translation of your Norwegian sentence in {$hintLang}, prefixed exactly with "HINT: ".
TXT;

/* Типові додаткові вказівки для текстової розмови (можна перевизначити в адмінпанелі). */
const CHAT_EXTRA = 'Praise short attempts briefly and never explain grammar unless asked. If the learner writes a sentence with a mistake, answer naturally and include the correct version of their sentence in your reply.';
$extra = ai_get('chat_prompt', CHAT_EXTRA);
if ($extra !== '') $system .= "\n" . mb_substr($extra, 0, 1200);
$out = ai_chat($system, $msgs, 180);
if ($out === null) fail('ai', 502);

// розділяємо відповідь і підказку-переклад
$reply = $out; $hint = '';
if (preg_match('/^(.*?)\n+\s*HINT:\s*(.+)$/su', $out, $m)) { $reply = trim($m[1]); $hint = trim($m[2]); }
$reply = clean_text(preg_replace('/^\s*[A-ZÆØÅa-zæøå]+:\s*/u', '', $reply) ?? $reply, 400);
$hint = clean_text($hint, 400);
$done = (bool)preg_match('/\b(ha det|snakkes|vi ses|ha det bra)\b/iu', $reply);

out(['ok' => true, 'reply' => $reply, 'hint' => $hint, 'done' => $done, 'left' => max(0, $limit - call_used($id))]);
