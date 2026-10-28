<?php
/* Комікс·Lab — 📈 «Пульс сайту» для головної: що додалося цього місяця і як це порівняно з тим самим
 * відрізком попереднього місяця (1–24 жовтня проти 1–24 вересня), плюс підсумок усього попереднього місяця.
 * Лише суми — без людей. Рахується не частіше ніж раз на 5 годин і лежить у кеші api/data/pulse.json,
 * тож головна не навантажує базу. */
declare(strict_types=1);
define('KOMIKS_API', 1);
require __DIR__ . '/lib.php';
require __DIR__ . '/stats.php';
require __DIR__ . '/admin-dash.php';

const PULSE_TTL = 5 * 3600;

/** Дні від $from (DateTimeImmutable, північ) — $n штук, рядками Y-m-d. */
function pulse_days(DateTimeImmutable $from, int $n): array {
  $out = [];
  for ($i = 0; $i < $n; $i++) $out[] = $from->modify('+' . $i . ' day')->format('Y-m-d');
  return $out;
}
function pulse_sum(array $days): array {
  $tz = new DateTimeZone(HIT_TZ);
  $a = (new DateTimeImmutable($days[0] . ' 00:00:00', $tz))->getTimestamp();
  $b = (new DateTimeImmutable(end($days) . ' 00:00:00', $tz))->modify('+1 day')->getTimestamp();
  $learn = dash_learning($days);
  return [
    'uv' => array_sum(hits_series($days, 'uv')),
    'pv' => array_sum(hits_series($days, 'pv')),
    'reg' => (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE created_at >= ? AND created_at < ?', [$a, $b])['n'] ?? 0),
    'quiz' => array_sum($learn['quiz']),
    'learn' => (int)$learn['learners'],
  ];
}
function pulse_build(): array {
  $tz = new DateTimeZone(HIT_TZ);
  $now = new DateTimeImmutable('now', $tz);
  $d = (int)$now->format('j');
  $m0 = $now->modify('first day of this month')->setTime(0, 0);
  $p0 = $m0->modify('-1 month');
  $pn = (int)$p0->format('t');
  return [
    'at' => time(), 'month' => $m0->format('Y-m'), 'prev_month' => $p0->format('Y-m'), 'day' => $d,
    'cur' => pulse_sum(pulse_days($m0, $d)),
    'prev' => pulse_sum(pulse_days($p0, min($d, $pn))),
    'prev_full' => pulse_sum(pulse_days($p0, $pn)),
    'total' => ['reg' => (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE is_demo IS NULL OR is_demo = 0')['n'] ?? 0)],
  ];
}

$file = __DIR__ . '/data/pulse.json';
$c = is_file($file) ? json_decode((string)file_get_contents($file), true) : null;
if (!is_array($c) || (int)($c['at'] ?? 0) < time() - PULSE_TTL) {
  try {
    $c = pulse_build();
    if (!is_dir(dirname($file))) @mkdir(dirname($file), 0750, true);
    @file_put_contents($file, json_encode($c), LOCK_EX);
  } catch (Throwable $e) {
    error_log('[komiks-pulse] ' . $e->getMessage());
    if (!is_array($c)) fail('server', 503);   // стара копія краща за нічого
  }
}
header('Cache-Control: public, max-age=1800');
out(['ok' => true] + $c);
