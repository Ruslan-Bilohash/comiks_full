<?php
/* Комікс·Lab — 🩺 швидка перевірка сервера: https://<сайт>/comiks/api/health.php
 *
 * Два рівні відповіді, і це головне в цьому файлі.
 *
 * Стороннім — лише «живий / не живий» і людська підказка, що робити, коли сайт мовчить.
 * Жодних версій, назв файлів, драйверів, номерів схеми й кількості людей у базі: усе це
 * нічим не допомагає відвідувачу, зате складається в готову карту для того, хто шукає,
 * чим сайт зламати. Версія PHP підказує, який набір уразливостей пробувати; номер схеми
 * й кількість адмінів кажуть, наскільки свіжа збірка й чи варто витрачати час.
 *
 * Адміністраторові — повна картина. Впізнаємо його двома способами, бо вони виручають
 * у різних бідах:
 *   • звичайна сесія (cookie) — коли база працює і в адмінку можна зайти;
 *   • ?key=… — коли не працює НІЧОГО і зайти нікуди. Ключ рахуємо з config.secret, тож
 *     нічого не треба налаштовувати окремо, а взяти його можна на сторінці «Система»
 *     в адмінці — поки туди ще є доступ.
 *
 * Паролі, ключі й адреси скриньок не показуються в жодному з рівнів — лише «задано / ні».
 */
declare(strict_types=1);
define('KOMIKS_API', 1);

$cfgFile = is_file(__DIR__ . '/config.php') ? 'config.php' : (is_file(__DIR__ . '/config.local.php') ? 'config.local.php' : '');

$pub = ['ok' => false];
$det = [];                 // те, що побачить лише адміністратор
$full = false;

if ($cfgFile === '') {
  /* Без конфіга немає ні бази, ні сесій — підказку мусимо дати відкрито, інакше
     людина, яка щойно залила файли, не зрозуміє, чому сайт порожній. */
  $pub['db'] = ['ok' => false, 'reason' => 'no_config',
    'hint' => 'Немає api/config.php — створіть його зі зразка config.sample.php або запустіть install.php.'];
} else {
  require __DIR__ . '/lib.php';

  /* Ключ доступу, похідний від config.secret: знати його може лише той, хто вже бачив
     конфіг або адмінку. Порівнюємо в сталий час, щоб ключ не підбирався за таймінгом. */
  $key = (string)($_GET['key'] ?? '');
  if ($key !== '' && hash_equals(health_key(), $key)) $full = true;

  try {
    $pdo = db();
    $pub['ok'] = true;
    $pub['db'] = ['ok' => true, 'reason' => 'ok', 'hint' => ''];
    /* Сесію перевіряємо лише коли база відповідає — інакше current_user() кине виняток
       і зіпсує саму перевірку, по яку сюди й прийшли. */
    if (!$full) { $me = current_user(); $full = $me && !empty($me['is_admin']); }
    if ($full) {
      $det['php'] = PHP_VERSION;
      $det['config'] = $cfgFile;
      $det['db_driver'] = (string)$pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
      $det['config_keys'] = ['stripe' => is_array(cfg('stripe')), 'ai' => is_array(cfg('ai')), 'tts' => is_array(cfg('tts'))];
      $mc = mail_cfg();
      $det['mail'] = [
        'transport' => $mc['transport'],
        'host' => $mc['host'] !== '' ? $mc['host'] . ':' . $mc['port'] . ' ' . $mc['secure'] : null,
        'user_set' => $mc['user'] !== '',
        'pass_set' => $mc['pass'] !== '',
        'from_matches_user' => $mc['user'] !== '' && strcasecmp($mc['user'], $mc['from']) === 0,
        'problems' => mail_problems(),
      ];
      $det['schema'] = (string)(one("SELECT v FROM kl_meta WHERE k = 'schema'")['v'] ?? '?');
      $det['users'] = (int)(one('SELECT COUNT(*) AS n FROM kl_users')['n'] ?? 0);
      $det['founders'] = (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE founder IS NOT NULL')['n'] ?? 0);
      $det['admins'] = (int)(one('SELECT COUNT(*) AS n FROM kl_users WHERE is_admin = 1 AND blocked_at IS NULL')['n'] ?? 0);
      $det['installer'] = is_file(__DIR__ . '/../install.php') ? 'є — видаліть із сервера' : 'видалено';
    }
  } catch (Throwable $e) {
    /* Назовні — лише зрозуміла причина й що робити. Текст помилки PHP не віддаємо
       нікому: у ньому бувають логіни, назви баз і шляхи на диску. */
    $m = strtolower($e->getMessage());
    if (str_contains($m, 'access denied')) { $r = 'auth'; $h = 'Неправильний логін або пароль бази. Візьміть їх у hPanel → Databases і впишіть у api/config.php (db.user, db.pass).'; }
    elseif (str_contains($m, 'unknown database')) { $r = 'no_db'; $h = 'Такої бази немає. Перевірте dbname у рядку db.dsn — він має збігатися з назвою в hPanel.'; }
    elseif (str_contains($m, 'could not find driver')) { $r = 'driver'; $h = 'У PHP не ввімкнено pdo_mysql. У hPanel → PHP Configuration увімкніть розширення pdo_mysql.'; }
    elseif (str_contains($m, "can't connect") || str_contains($m, 'connection refused') || str_contains($m, 'timed out')) { $r = 'host'; $h = 'Сервер бази не відповідає. На Hostinger host майже завжди «localhost».'; }
    else { $r = 'error'; $h = 'База не відповідає. Перевірте db.dsn, db.user і db.pass в api/config.php.'; }
    $pub['db'] = ['ok' => false, 'reason' => $r, 'hint' => $h];
  }
}

$out = $pub + ($full ? ['detail' => $det] : []);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
http_response_code($out['ok'] ? 200 : 503);
echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), "\n";
