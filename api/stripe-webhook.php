<?php
/* Комікс·Lab — 💳 вебхук Stripe: продовження та скасування підписки.
 * Адреса для Stripe: https://<сайт>/comiks/api/stripe-webhook.php
 * Події: checkout.session.completed, invoice.paid, invoice.payment_failed, customer.subscription.updated|deleted
 *
 * Безпека: приймаємо лише запити з дійсним підписом Stripe (заголовок Stripe-Signature, ключ whsec_…
 * з api/config.php). Без налаштованого секрета вебхук нічого не змінює — преміум тоді вмикається
 * лише через перевірку сесії оплати в billing.php.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

if (method() !== 'POST') { http_response_code(405); exit; }
$secret = stripe_key('webhook');
$payload = file_get_contents('php://input') ?: '';
$sig = (string)($_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '');

// перевірка підпису: t=<час>,v1=<hmac_sha256("t.payload", whsec)>
function stripe_sig_ok(string $payload, string $sig, string $secret, int $tolerance = 300): bool {
  if ($secret === '' || $sig === '') return false;
  $t = 0; $vs = [];
  foreach (explode(',', $sig) as $part) {
    $kv = explode('=', trim($part), 2);
    if (count($kv) !== 2) continue;
    if ($kv[0] === 't') $t = (int)$kv[1];
    elseif ($kv[0] === 'v1') $vs[] = $kv[1];
  }
  if ($t <= 0 || !$vs || abs(time() - $t) > $tolerance) return false;
  $expected = hash_hmac('sha256', $t . '.' . $payload, $secret);
  foreach ($vs as $v) if (hash_equals($expected, $v)) return true;
  return false;
}

if (!stripe_sig_ok($payload, $sig, $secret)) { error_log('[komiks-stripe] bad signature'); http_response_code(400); echo 'bad signature'; exit; }
$ev = json_decode($payload, true);
if (!is_array($ev)) { http_response_code(400); exit; }
$type = (string)($ev['type'] ?? '');
$obj = (array)($ev['data']['object'] ?? []);

// знаходимо нашого користувача: metadata → client_reference_id → id клієнта Stripe
function wh_user(array $obj): ?array {
  $uid = (int)($obj['metadata']['user_id'] ?? 0) ?: (int)($obj['client_reference_id'] ?? 0);
  if (!$uid && !empty($obj['subscription_details']['metadata']['user_id'])) $uid = (int)$obj['subscription_details']['metadata']['user_id'];
  if ($uid) return one('SELECT * FROM kl_users WHERE id = ?', [$uid]);
  $cust = (string)($obj['customer'] ?? '');
  if ($cust === '') return null;
  $row = one('SELECT user_id FROM kl_billing WHERE customer = ?', [$cust]);
  return $row ? one('SELECT * FROM kl_users WHERE id = ?', [(int)$row['user_id']]) : null;
}

$u = wh_user($obj);
if ($u) {
  if ($type === 'checkout.session.completed' && (($obj['payment_status'] ?? '') === 'paid' || ($obj['status'] ?? '') === 'complete')) {
    premium_apply((int)$u['id'], time() + 31 * 86400, (string)($obj['customer'] ?? ''), (string)($obj['subscription'] ?? ''), 'active');
  } elseif ($type === 'invoice.paid') {
    $end = (int)($obj['lines']['data'][0]['period']['end'] ?? 0) ?: time() + 31 * 86400;
    premium_apply((int)$u['id'], $end, (string)($obj['customer'] ?? ''), (string)($obj['subscription'] ?? ''), 'active');
  } elseif ($type === 'customer.subscription.updated') {
    $end = (int)($obj['current_period_end'] ?? 0);
    $status = (string)($obj['status'] ?? '');
    if ($end && in_array($status, ['active', 'trialing', 'past_due'], true)) premium_apply((int)$u['id'], $end, (string)($obj['customer'] ?? ''), (string)($obj['id'] ?? ''), $status);
    else q("UPDATE kl_billing SET status = ?, updated_at = ? WHERE user_id = ?", [$status, time(), (int)$u['id']]);
  } elseif ($type === 'customer.subscription.deleted' || $type === 'invoice.payment_failed') {
    // преміум не обриваємо посеред оплаченого періоду — просто позначаємо стан
    q("UPDATE kl_billing SET status = ?, updated_at = ? WHERE user_id = ?", [$type === 'invoice.payment_failed' ? 'past_due' : 'canceled', time(), (int)$u['id']]);
  }
}
http_response_code(200);
echo 'ok';
