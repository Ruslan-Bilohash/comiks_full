<?php
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/../api/stats.php';

function same($actual, $expected, string $message): void {
  if ($actual !== $expected) {
    fwrite(STDERR, "FAIL $message\nExpected: " . var_export($expected, true) . "\nActual: " . var_export($actual, true) . "\n");
    exit(1);
  }
  echo "PASS $message\n";
}

same(hit_source('chatgpt.com', ''), 'chatgpt', 'UTM ChatGPT domain');
same(hit_source('openai', ''), 'chatgpt', 'UTM OpenAI alias');
same(hit_source('meta', ''), 'facebook', 'UTM Meta alias');
same(hit_source('ig', ''), 'instagram', 'UTM Instagram alias');
same(hit_source('linkedin', ''), 'linkedin', 'UTM LinkedIn');
same(hit_source('', 'platform.openai.com'), 'chatgpt', 'referrer fallback');
same(hit_source('', ''), 'direct', 'direct fallback');
same(hit_source('school-newsletter', 'google.com'), 'school-newsletter', 'custom UTM source wins');

same(hit_merge_sources([
  'direct' => 118,
  'platform.openai.com' => 4,
  'chatgpt' => 3,
  'l.instagram.com' => 5,
  'lm.facebook.com' => 6,
  'lnkd.in' => 2,
]), [
  'direct' => 118,
  'chatgpt' => 7,
  'facebook' => 6,
  'instagram' => 5,
  'linkedin' => 2,
], 'historical referrer domains are merged and sorted');

echo "ALL TRAFFIC ATTRIBUTION PHP TESTS PASSED\n";
