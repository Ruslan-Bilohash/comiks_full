<?php
/* Комікс·Lab — 💳 Преміум-підписка (Stripe Checkout, 69 NOK/міс).
 *
 * GET  billing.php?action=state                → { ok, premium, until, price, currency, configured, founder }
 * POST { action: "checkout" }                  → { ok, url } — адреса оплати на checkout.stripe.com
 * POST { action: "confirm", session_id }       → { ok, premium, until } — перевірка після повернення з оплати
 * POST { action: "portal" }                    → { ok, url } — кабінет Stripe (скасувати / змінити картку)
 *
 * Безпека:
 *  • секретний ключ Stripe живе ЛИШЕ в api/config.php на сервері (MK_STRIPE_SECRET_KEY або cfg('stripe.secret')),
 *    ніколи не потрапляє ні в dist, ні в браузер;
 *  • преміум вмикається тільки з відповіді Stripe (payment_status = paid) або з підписаного вебхука,
 *    ніколи — зі слова браузера;
 *  • session_id перевіряється на належність саме цьому користувачеві (client_reference_id);
 *  • усі запити до Stripe — через HTTPS з перевіркою сертифіката.
 */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';

if (method() === 'GET') {
  if ((string)($_GET['action'] ?? '') !== 'state') fail('action', 404);
  $u = current_user();
  out(['ok' => true, 'configured' => stripe_ready(), 'price' => PREMIUM_PRICE / 100, 'currency' => PREMIUM_CURRENCY,
    'premium' => $u ? (bool)public_user($u)['premium'] : false,
    'until' => $u && !empty($u['premium_until']) ? gmdate('c', (int)$u['premium_until']) : null,
    'forever' => $u ? (!empty($u['founder']) || !empty($u['premium']) || is_staff($u)) : false,
    'founder' => $u && !empty($u['founder']) ? (int)$u['founder'] : null]);
}
if (method() !== 'POST') fail('method', 405);
require_csrf();
$in = input();
$u = require_user();
$action = (string)($in['action'] ?? '');
if (!stripe_ready()) fail('not_configured', 503);

if ($action === 'checkout') {
  rate_or_fail('pay:' . $u['id'], 10, 3600);
  if (!empty($u['founder']) || !empty($u['premium']) || is_staff($u)) fail('already', 409);
  $row = billing_row((int)$u['id']);
  $params = [
    'mode' => 'subscription',
    'success_url' => site_url() . '#/premium/ok?s={CHECKOUT_SESSION_ID}',
    'cancel_url' => site_url() . '#/premium',
    'client_reference_id' => (string)$u['id'],
    'locale' => in_array($u['lang'], ['en', 'nb', 'uk', 'ar'], true) ? ($u['lang'] === 'no' ? 'nb' : $u['lang']) : 'auto',
    'line_items[0][quantity]' => '1',
    'line_items[0][price_data][currency]' => strtolower(PREMIUM_CURRENCY),
    'line_items[0][price_data][unit_amount]' => (string)PREMIUM_PRICE,
    'line_items[0][price_data][recurring][interval]' => 'month',
    'line_items[0][price_data][product_data][name]' => 'Komiks·Lab Premium',
    'line_items[0][price_data][product_data][description]' => 'Alle tegneserier, spill og prøver uten grenser — månedlig abonnement.',
    'metadata[user_id]' => (string)$u['id'],
    'subscription_data[metadata][user_id]' => (string)$u['id'],
    'allow_promotion_codes' => 'true',
  ];
  if ($row && $row['customer'] !== '') $params['customer'] = $row['customer'];
  else $params['customer_email'] = (string)$u['email'];
  $s = stripe_call('POST', '/v1/checkout/sessions', $params);
  if (!$s || empty($s['url'])) fail('stripe', 502);
  out(['ok' => true, 'url' => $s['url']]);
}

if ($action === 'confirm') {
  rate_or_fail('pay-ok:' . $u['id'], 30, 3600);
  $sid = (string)($in['session_id'] ?? '');
  if (!preg_match('/^cs_[A-Za-z0-9_]{10,200}$/', $sid)) fail('session');
  $s = stripe_call('GET', '/v1/checkout/sessions/' . $sid . '?expand[]=subscription');
  if (!$s) fail('stripe', 502);
  // сесія має належати саме цьому акаунту, і оплата має бути дійсно проведена
  if ((string)($s['client_reference_id'] ?? '') !== (string)$u['id']) fail('forbidden', 403);
  if (($s['payment_status'] ?? '') !== 'paid' && ($s['status'] ?? '') !== 'complete') fail('unpaid', 402);
  $sub = is_array($s['subscription'] ?? null) ? $s['subscription'] : null;
  $until = (int)($sub['current_period_end'] ?? 0) ?: time() + 31 * 86400;
  premium_apply((int)$u['id'], $until, (string)($s['customer'] ?? ''), (string)($sub['id'] ?? ''), (string)($sub['status'] ?? 'active'));
  $fresh = one('SELECT * FROM kl_users WHERE id = ?', [$u['id']]);
  notify_admins('💳 Нова підписка: ' . $u['name'], [['Ім’я', $u['name']], ['Пошта', $u['email']], ['До', gmdate('d.m.Y', $until)]], 'admin.php?p=user&id=' . (int)$u['id']);
  out(['ok' => true, 'premium' => true, 'until' => gmdate('c', (int)$fresh['premium_until'])]);
}

if ($action === 'portal') {
  $row = billing_row((int)$u['id']);
  if (!$row || $row['customer'] === '') fail('no_customer', 404);
  $s = stripe_call('POST', '/v1/billing_portal/sessions', ['customer' => $row['customer'], 'return_url' => site_url() . '#/premium']);
  if (!$s || empty($s['url'])) fail('stripe', 502);
  out(['ok' => true, 'url' => $s['url']]);
}

fail('action', 404);
