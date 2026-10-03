<?php
/* Комікс·Lab — 🎧 живий голосовий дзвінок із ШІ (OpenAI Realtime, голос-у-голос).
 *
 * GET  realtime.php?action=state                 → { ok, ready, model, left, limit }
 * POST { action: "session", who, scene, level, lang }
 *      → { ok, token, expires, model, voice }    — одноразовий ключ на 60 секунд
 *
 * Як це працює: браузер не бачить наш ключ. Сервер просить у OpenAI короткочасний
 * «ephemeral» ключ на одну сесію, браузер з ним відкриває WebRTC-з’єднання й говорить
 * із моделлю голосом — без запису, без кнопок «надіслати». Якщо ключа немає або
 * провайдер інший (Grok, Groq), застосунок лишається в текстовому режимі з нейроголосом.
 *
 * Ліміти: голосові хвилини дорогі, тому 6 сесій на добу безкоштовно й 40 для Преміуму.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

const RT_FREE_DAY = 6;
const RT_PREMIUM_DAY = 40;
/* Типові перші слова під кожен сценарій — персонаж каже їх своїми словами.
   Адміністратор може задати власні в панелі («🎧 Голос і ШІ» → Перші слова). */
const RT_GREETING = [
  'smaprat' => 'Hei! Det er meg. Hvordan går det med deg i dag?',
  'kafe' => 'Hei! Jeg sitter på kafé nå. Vil du komme og ta en kaffe?',
  'butikk' => 'Hei! Jeg står på butikken. Trenger vi noe hjem?',
  'nabo' => 'Hei, det er naboen din. Har du et øyeblikk?',
  'jobb' => 'Hei! Det er meg fra jobben. Passer det å snakke nå?',
  'lege' => 'Hei, det er legekontoret. Hvordan har du det i dag?',
  'skole' => 'Hei! Det er fra skolen. Har du tid et lite øyeblikk?',
  'reise' => 'Hei! Skal vi planlegge turen til helga?',
];
/* Типові додаткові вказівки: терпіння, похвала, м’яке виправлення. Адміністратор може
   замінити їх своїм текстом у панелі — тоді використається його версія. */
const RT_EXTRA = 'Be extra patient: wait a couple of seconds before helping. Praise every attempt briefly ("Bra!", "Kjempefint!") and never correct grammar out loud — just repeat the sentence correctly as your own answer. Use only words a beginner meets in everyday Norway: home, food, weather, work, shop, school, health. Keep your turns short, ask one question at a time, and let the learner talk more than you.';
const RT_SCENES = [
  'smaprat' => 'småprat om hverdagen, været og helga',
  'kafe' => 'dere snakker om kaffe, kake og å møtes på kafé',
  'butikk' => 'dere snakker om handlelista, priser og tilbud',
  'nabo' => 'dere er naboer og snakker om dugnad, snømåking og å låne verktøy',
  'jobb' => 'dere er kolleger og snakker om jobb, møter og arbeidstid',
  'lege' => 'du jobber på legekontoret og spør hvordan personen har det',
  'skole' => 'dere snakker om skole, lekser og timeplanen',
  'reise' => 'dere planlegger en tur med buss, tog eller hytte',
];

/* Живий голосовий дзвінок — це той самий ШІ, тож вимикач 'ai' у config.php глушить
   і його. Голос вимкнено окремо ('tts') — теж без дзвінка: розмова без голосу
   безглузда, це просто чат. */
function rt_ready(): bool { return ai_feature_on('realtime') && !tts_voice_off() && ai_provider() === 'openai' && ai_cfg('key') !== ''; }
function rt_model(): string { return ai_get('rt_model', (string)(cfg('ai.realtime_model') ?? '')) ?: 'gpt-realtime'; }
function rt_limit(?array $u): int { return has_premium($u) ? RT_PREMIUM_DAY : RT_FREE_DAY; }
function rt_used(string $id): int {
  $k = substr(hash('sha256', 'rt:' . $id . ':' . cfg('secret')), 0, 40) . ':86400';
  $row = one('SELECT n, reset_at FROM kl_rate WHERE k = ?', [$k]);
  return ($row && (int)$row['reset_at'] > time()) ? (int)$row['n'] : 0;
}

if (method() === 'GET') {
  if ((string)($_GET['action'] ?? '') !== 'state') fail('action', 404);
  $u = current_user();
  $id = $u ? 'u' . $u['id'] : ip_hash();
  $limit = rt_limit($u);
  out(['ok' => true, 'ready' => rt_ready(), 'model' => rt_model(), 'limit' => $limit, 'left' => max(0, $limit - rt_used($id))]);
}
if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input();
if ((string)($in['action'] ?? '') !== 'session') fail('action', 404);
if (!rt_ready()) fail('no_realtime', 503);

$u = current_user();
$id = $u ? 'u' . $u['id'] : ip_hash();
rate_or_fail('rt-ip:' . ip_hash(), 20, 3600);
if (limited('rt:' . $id, rt_limit($u), 86400)) fail('rt_limit', 429);

$who = clean_text((string)($in['who'] ?? 'Kaja'), 20);
$scene = isset(RT_SCENES[$in['scene'] ?? '']) ? (string)$in['scene'] : 'smaprat';
$level = in_array($in['level'] ?? '', ['A1', 'A2', 'B1', 'B2'], true) ? (string)$in['level'] : 'A1';
// голос: або той, що прислав персонаж, або загальний з адмінпанелі
$voice = preg_replace('/[^a-z0-9_-]/', '', strtolower((string)($in['voice'] ?? ''))) ?: ai_get('rt_voice', 'marin');
$sceneNo = RT_SCENES[$scene];
$words = $level === 'A1' ? '6–12' : ($level === 'A2' ? '8–16' : '12–22');

$instructions = <<<TXT
You are {$who}, a warm, ordinary Norwegian person on a short phone call with someone who is learning Norwegian (level {$level}).
Situation: {$sceneNo}.
Speak only Norwegian (bokmål), clearly and a little slowly, {$words} words per turn, one or two sentences, and end most turns with a simple question.
Keep the level at {$level}: simple words, present tense first, no long explanations.
If the learner hesitates, wait a moment, then help with a shorter question or repeat more slowly.
If they answer in another language, reply in Norwegian anyway and gently model the Norwegian phrase.
Never say that you are an AI or a model, never break character, never discuss anything unrelated to this phone call.
When the learner says "ha det", "snakkes" or wants to stop, say a short, friendly goodbye.
TXT;
// додаткові вказівки від адміністратора (поле «Промпт» у панелі)
$extra = ai_get('rt_prompt', RT_EXTRA);
if ($extra !== '') $instructions .= "\n" . mb_substr($extra, 0, 1200);
$greeting = ai_get('rt_greeting', RT_GREETING[$scene] ?? RT_GREETING['smaprat']);

// один запит до OpenAI
function rt_post(string $url, array $body, array $extraHeaders = []): array {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_TIMEOUT => 20,
    CURLOPT_SSL_VERIFYPEER => true, CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HTTPHEADER => array_merge(['Authorization: Bearer ' . ai_cfg('key'), 'Content-Type: application/json'], $extraHeaders),
    CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
  ]);
  $res = curl_exec($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  return ['code' => $code, 'body' => is_string($res) ? $res : '', 'err' => $err];
}

/* OpenAI має дві версії Realtime: нову (POST /v1/realtime/client_secrets) і стару бета
   (POST /v1/realtime/sessions). Пробуємо нову, а якщо акаунт її ще не має — стару.
   Браузер отримує разом із ключем позначку, до якої адреси підключатися. */
$promptId = ai_get('rt_prompt_id', '');
/* Формат сесії — як у консолі OpenAI (POST /v1/realtime/client_secrets).
   Пауза перед відповіддю навмисно довша за типову (700 мс замість 500): той, хто вчить мову,
   часто робить паузу посеред речення, і модель не має його перебивати. */
$sessionGa = ['type' => 'realtime', 'model' => rt_model(), 'instructions' => $instructions,
  'audio' => [
    'input' => [
      'format' => ['type' => 'audio/pcm', 'rate' => 24000],
      'transcription' => ['model' => ai_get('rt_stt', 'gpt-realtime-whisper'), 'language' => 'no'],
      'noise_reduction' => ['type' => ai_get('rt_noise', 'near_field')],
      'turn_detection' => ['type' => 'server_vad', 'threshold' => 0.5, 'prefix_padding_ms' => 300, 'silence_duration_ms' => 700],
    ],
    'output' => ['format' => ['type' => 'audio/pcm', 'rate' => 24000], 'voice' => $voice],
  ],
  'output_modalities' => ['audio'],
];
if ($promptId !== '') $sessionGa['prompt'] = ['id' => $promptId];

$r = rt_post('https://api.openai.com/v1/realtime/client_secrets', ['session' => $sessionGa]);
$api = 'ga';
$j = $r['code'] < 400 ? json_decode($r['body'], true) : null;
$token = is_array($j) ? (string)($j['value'] ?? ($j['client_secret']['value'] ?? '')) : '';
$expires = is_array($j) ? (int)($j['expires_at'] ?? 0) : 0;

if ($token === '') {
  // запасний шлях — стара бета-версія
  $legacy = ['model' => rt_model(), 'voice' => $voice, 'instructions' => $instructions,
    'modalities' => ['audio', 'text'],
    'input_audio_transcription' => ['model' => 'whisper-1', 'language' => 'no'],
    'turn_detection' => ['type' => 'server_vad', 'threshold' => 0.55, 'silence_duration_ms' => 700, 'prefix_padding_ms' => 300]];
  $r2 = rt_post('https://api.openai.com/v1/realtime/sessions', $legacy, ['OpenAI-Beta: realtime=v1']);
  $j2 = $r2['code'] < 400 ? json_decode($r2['body'], true) : null;
  $token = is_array($j2) ? (string)($j2['client_secret']['value'] ?? '') : '';
  $expires = is_array($j2) ? (int)($j2['client_secret']['expires_at'] ?? 0) : 0;
  $api = 'beta';
  if ($token === '') {
    error_log('[komiks-realtime] ga ' . $r['code'] . ': ' . substr($r['body'] ?: $r['err'], 0, 200)
      . ' | beta ' . $r2['code'] . ': ' . substr($r2['body'] ?: $r2['err'], 0, 200));
    fail('realtime', 502);
  }
}

out(['ok' => true, 'token' => $token, 'expires' => $expires ?: (time() + 60), 'api' => $api,
  'model' => rt_model(), 'voice' => $voice, 'greeting' => $greeting, 'left' => max(0, rt_limit($u) - rt_used($id))]);
