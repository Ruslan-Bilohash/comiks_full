<?php
/* Комікс·Lab — 🌍 робітник перекладу. Запускається на сервері, бо лише там є ключ.
 *
 *   php tools/ai-translate.php --config=/шлях/api/config.php \
 *       --jobs=jobs-de.jsonl --out=out-de.jsonl [--model=gpt-5.4-mini] [--conc=4]
 *
 * Завдання готує й приймає node (tools/i18n-fill.js). Тут лише те, що без ключа
 * не зробити, і ключ з цього файла нікуди не виходить: ні в аргументи запуску,
 * ні у вивід, ні в журнал помилок.
 *
 * Відповіді дописуються рядком на запит, тож перерваний переклад не пропадає:
 * повторний запуск бачить, що вже зроблено, і бере лише решту. Платити двічі за
 * той самий рядок — найдорожча з можливих помилок у цій справі.
 */
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }

$opt = [];
foreach (array_slice($argv, 1) as $a) {
  if (preg_match('/^--([a-z-]+)=(.*)$/', $a, $m)) $opt[$m[1]] = $m[2];
}
foreach (['config', 'jobs', 'out'] as $need) {
  if (empty($opt[$need])) { fwrite(STDERR, "потрібно --$need=…\n"); exit(1); }
}
$model = $opt['model'] ?? 'gpt-5.4-mini';
$conc = max(1, min(8, (int)($opt['conc'] ?? 4)));

$cfg = require $opt['config'];
$key = (string)($cfg['ai']['key'] ?? '');
if ($key === '') { fwrite(STDERR, "у config.php немає ai.key\n"); exit(1); }
$url = 'https://api.openai.com/v1/chat/completions';

/* Що вже зроблено. Файл відповідей — журнал: кожен рядок самодостатній, тож
   навіть обірваний на півслові останній рядок не псує попередні. */
$done = [];
if (is_file($opt['out'])) {
  foreach (file($opt['out'], FILE_IGNORE_NEW_LINES) as $row) {
    $j = json_decode($row, true);
    if (is_array($j) && !empty($j['id']) && !empty($j['ok'])) $done[$j['id']] = true;
  }
}

$jobs = [];
foreach (file($opt['jobs'], FILE_IGNORE_NEW_LINES) as $row) {
  if (trim($row) === '') continue;
  $j = json_decode($row, true);
  if (is_array($j) && !empty($j['id']) && !isset($done[$j['id']])) $jobs[] = $j;
}
$total = count($jobs);
if (!$total) { echo "усе вже перекладено (готових запитів: ", count($done), ")\n"; exit; }
echo "до роботи: $total запитів · модель $model · по $conc одночасно\n";

/* Настанова для моделі. Головне тут — норвезький оригінал: ключ у словнику
   англійський, але учень читає норвезьке речення, і без нього короткі статті
   на кілька значень («a measure, programme») перекладаються навмання. */
function sys_prompt(array $job): string {
  $L = $job['langName'];
  $kind = $job['kind'];
  $src = $job['srcLang'] ?? 'English';
  $common = "You translate content for Komiks·Lab, an app where learners read short Norwegian (Bokmål) comics. "
    . "Translate from $src into $L. Each item also shows the Norwegian original the learner actually reads — use it to resolve ambiguity; "
    . "the translation must match the Norwegian meaning. Keep names as they are (Mia, Nora, Pus, Oslo, NAV, Norge). "
    . "Keep any emoji and final punctuation. Never add explanations, transliterations or alternatives in brackets.";
  $extra = match ($kind) {
    'lines' => "These are spoken comic lines. Use natural, everyday spoken $L — what a person would really say, not a literal word-for-word rendering. Keep them short, like the original.",
    'titles' => "These are comic titles. Keep them short and catchy, with the capitalisation normal for titles in $L.",
    'summaries' => "These are short descriptions shown to readers and search engines. Translate fully and fluently, one paragraph, no shortening.",
    'news' => "These are entries from the app's update log, written for learners: what is new, in plain language. Keep the emoji at the start of each line, keep the product name Komiks·Lab, and keep the tone short and friendly.",
    'pages' => "These are the page's own interface and marketing strings for $L speakers learning Norwegian: headings, buttons, descriptions for search engines. Translate so it reads like it was written in $L, not translated. Keep every {placeholder} exactly as it is, keep emoji and arrows, and keep the product name Komiks·Lab unchanged.",
    default => "These are dictionary entries for single words or set phrases. Give the plain dictionary form in $L, following the convention of $L dictionaries for nouns (include the article or gender marker only where $L dictionaries normally do). One translation per entry, no commentary.",
  };
  return $common . ' ' . $extra . ' Answer with a JSON object whose keys are exactly the item numbers given and whose values are the translations, and nothing else.';
}

function user_prompt(array $job): string {
  $out = [];
  foreach ($job['items'] as $it) {
    $line = $it['k'] . '. EN: ' . $it['en'];
    if (!empty($it['no'])) $line .= "\n   NO: " . $it['no'];
    if (!empty($it['hint'])) $line .= "\n   (" . $it['hint'] . ')';
    $out[] = $line;
  }
  return implode("\n", $out);
}

function body_for(array $job, string $model): string {
  $n = count($job['items']);
  /* Запас на відповідь: описи бувають довгі, а обрізана відповідь — це
     зіпсований JSON і витрачений запит. */
  $cap = match ($job['kind']) { 'summaries' => 220, 'pages' => 320, 'news' => 320, 'lines' => 90, default => 50 };
  $max = max(600, $n * $cap);
  $b = [
    'model' => $model,
    'messages' => [
      ['role' => 'system', 'content' => sys_prompt($job)],
      ['role' => 'user', 'content' => user_prompt($job)],
    ],
    'response_format' => ['type' => 'json_object'],
  ];
  /* Нові моделі лічать відповідь інакше й не приймають temperature — старі не
     знають про max_completion_tokens. Дешевше розпізнати, ніж ламатися. */
  if (preg_match('/^(gpt-5|o\d)/', $model)) {
    $b['max_completion_tokens'] = $max * 3;      // на роздуми теж іде запас
    $b['reasoning_effort'] = 'low';
  } else {
    $b['max_tokens'] = $max;
    $b['temperature'] = 0.2;
  }
  return json_encode($b, JSON_UNESCAPED_UNICODE);
}

/* Відповідь приймаємо лише повну: бракує номера — вертаємо запит у роботу.
   Напівпорожній пакет гірший за відсутній, бо дірку в ньому вже ніхто не
   побачить. */
function parse_reply(array $job, string $res, ?string &$why): ?array {
  $j = json_decode($res, true);
  if (!is_array($j)) { $why = 'відповідь не JSON'; return null; }
  if (isset($j['error'])) { $why = 'API: ' . substr((string)($j['error']['message'] ?? ''), 0, 120); return null; }
  $txt = (string)($j['choices'][0]['message']['content'] ?? '');
  if ($txt === '') { $why = 'порожня відповідь (' . (string)($j['choices'][0]['finish_reason'] ?? '?') . ')'; return null; }
  $map = json_decode($txt, true);
  if (!is_array($map)) { $why = 'вміст не JSON'; return null; }
  $out = [];
  foreach ($job['items'] as $it) {
    $v = $map[$it['k']] ?? null;
    if (!is_string($v) || trim($v) === '') { $why = 'бракує номера ' . $it['k']; return null; }
    $out[$it['k']] = trim($v);
  }
  return $out;
}

$fh = fopen($opt['out'], 'a');
$mh = curl_multi_init();
$queue = $jobs;
$tries = [];
$ok = 0; $bad = 0; $n = 0;

while ($queue) {
  $wave = array_splice($queue, 0, $conc);
  $handles = [];
  foreach ($wave as $job) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true, CURLOPT_POST => true, CURLOPT_TIMEOUT => 180,
      CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'],
      CURLOPT_POSTFIELDS => body_for($job, $model),
    ]);
    curl_multi_add_handle($mh, $ch);
    $handles[] = [$ch, $job];
  }
  do {
    curl_multi_exec($mh, $running);
    if ($running) curl_multi_select($mh, 1.0);
  } while ($running);

  foreach ($handles as [$ch, $job]) {
    $res = (string)curl_multi_getcontent($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err = curl_error($ch);
    curl_multi_remove_handle($mh, $ch);
    curl_close($ch);
    $n++;
    $why = $err !== '' ? $err : ($code >= 400 ? "HTTP $code" : null);
    $map = $why === null ? parse_reply($job, $res, $why) : null;
    if ($map !== null) {
      fwrite($fh, json_encode(['id' => $job['id'], 'ok' => true, 'map' => $map], JSON_UNESCAPED_UNICODE) . "\n");
      fflush($fh);
      $ok++;
      printf("[%d/%d] %s ✔ %d\n", $n, $total, $job['id'], count($map));
    } else {
      /* Дві спроби, і далі не чіпаємо: одна осічка буває від перевантаження
         сервера, а три поспіль означають, що завдання саме не те. */
      $t = ($tries[$job['id']] ?? 0) + 1;
      $tries[$job['id']] = $t;
      if ($t < 3) { $queue[] = $job; $total++; printf("[%d/%d] %s ↻ спроба %d (%s)\n", $n, $total, $job['id'], $t, (string)$why); }
      else {
        fwrite($fh, json_encode(['id' => $job['id'], 'ok' => false, 'why' => (string)$why], JSON_UNESCAPED_UNICODE) . "\n");
        fflush($fh);
        $bad++;
        printf("[%d/%d] %s ✖ %s\n", $n, $total, $job['id'], (string)$why);
      }
    }
  }
}
curl_multi_close($mh);
fclose($fh);
echo "готово: $ok запитів перекладено", $bad ? ", $bad не вдалося" : '', "\n";
