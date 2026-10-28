<?php
declare(strict_types=1);

require __DIR__ . '/../api/testing-mail.php';

function check(bool $ok, string $message): void {
  if (!$ok) throw new RuntimeException($message);
}

foreach (['uk', 'en', 'no', 'lt'] as $lang) {
  $t = testing_mail_text($lang);
  foreach (['subject', 'title', 'intro', 'btn', 'after', 'plain'] as $key) {
    check(!empty($t[$key]), "Missing $key for $lang");
  }
  check(str_contains($t['after'], 'email@bilohash.com'), "Missing feedback contact for $lang");
  check(str_contains($t['after'], 'com.bilohash.comiks'), "Missing store URL for $lang");
  check(str_contains($t['after'], '14'), "Missing 14-day instruction in HTML for $lang");
  check(str_contains($t['plain'], '14'), "Missing 14-day instruction in plain text for $lang");
  check(str_contains($t['plain'], 'https://play.google.com/store/apps/details?id=com.bilohash.comiks'), "Missing exact Play URL in plain text for $lang");
}
check(testing_mail_text('unknown') === testing_mail_text('en'), 'Unknown language must fall back to English');

$sent = [];
function valid_email(string $email): bool { return (bool)filter_var($email, FILTER_VALIDATE_EMAIL); }
function kl_lang(?string $lang, string $fallback = 'en'): string { return in_array($lang, ['uk', 'en', 'no'], true) ? (string)$lang : $fallback; }
function mail_layout(string $lang, string $title, string $intro, string $button, string $url, string $after, string $footer, bool $apps = false): string {
  return implode('|', [$lang, $title, $intro, $button, $url, $after, $footer, $apps ? 'apps' : '']);
}
function send_mail(string $to, string $subject, string $html, string $text): bool {
  $GLOBALS['sent'][] = compact('to', 'subject', 'html', 'text');
  return $GLOBALS['transport_ok'] ?? true;
}

$transport_ok = true;
$result = send_android_testing_invite(['email' => 'tester@example.com', 'lang' => 'uk']);
check($result === 'sent', 'Valid Android request should send');
check(count($sent) === 1, 'One click should send exactly one email');
check($sent[0]['to'] === 'tester@example.com', 'Email goes to the tester');
check(str_contains($sent[0]['html'], 'https://play.google.com/store/apps/details?id=com.bilohash.comiks'), 'HTML has the exact Play URL');
check(str_contains($sent[0]['text'], '14'), 'Plain email has the 14-day instruction');

$before = count($sent);
check(send_android_testing_invite(['email' => 'bad-address', 'lang' => 'uk']) === 'email', 'Invalid email is rejected');
check(count($sent) === $before, 'Invalid email does not call the mail transport');

$transport_ok = false;
check(send_android_testing_invite(['email' => 'tester@example.com', 'lang' => 'uk']) === 'mail', 'Transport failure is reported');

echo "PASS: Android testing invitation content, exact Play link, 14-day plan and send failures\n";
