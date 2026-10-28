<?php
declare(strict_types=1);
define('KOMIKS_API',1);
require __DIR__.'/lib.php';
require __DIR__.'/google-auth.php';
header('Referrer-Policy: no-referrer');
function google_redirect(string $path): never {header('Location: '.site_url().'#/'.$path,true,303);exit;}
function google_admin_redirect(string $m): never {header('Location: '.site_url().'admin.php?p=system&s=google&m='.$m,true,303);exit;}
/** Вхід із застосунку закінчується в системному браузері: віддаємо сторінку, що відкриває
 *  застосунок (komikslab://google?h=…). Код одноразовий, 5 хвилин, і без секрету
 *  застосунку (app_ch) його не обміняти — перехоплений код нічого не дає. */
function google_app_return(string $query): never {
  $q=htmlspecialchars($query,ENT_QUOTES);
  $intent='intent://google?'.$q.'#Intent;scheme=komikslab;package=com.bilohash.comiks;end';
  $plain='komikslab://google?'.$q;
  header('Content-Type: text/html; charset=utf-8');header('Cache-Control: no-store');
  $ua=(string)($_SERVER['HTTP_USER_AGENT']??'');$href=preg_match('/android/i',$ua)?$intent:$plain;
  echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Komiks·Lab</title>'
    .'<style>body{font:17px/1.5 system-ui,sans-serif;background:#fff8ea;color:#1d1b16;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px;text-align:center}'
    .'a{display:inline-block;background:#ffd23f;color:#1d1b16;border:3px solid #1d1b16;border-radius:14px;padding:14px 22px;font-weight:800;text-decoration:none;box-shadow:4px 4px 0 #1d1b16}</style></head>'
    .'<body><main><p style="font-size:44px;margin:0">📲</p><p>Komiks·Lab</p><p><a id="go" href="'.$href.'">Повернутися в застосунок · Back to the app</a></p></main>'
    .'<script>setTimeout(function(){location.href=document.getElementById("go").href},250)</script></body></html>';
  exit;
}

/** Обмін коду на токен і профіль — той самий для входу й для перевірки ключів.
 *  Токен беремо лише з власного обміну на сервері, ніколи з браузера. */
function google_exchange(string $code,array $state,string $clientId,string $secret): array {
  if ($code===''||strlen($code)>4096) throw new InvalidArgumentException('google_code');
  $token=google_http('https://oauth2.googleapis.com/token',[
    'code'=>$code,'client_id'=>$clientId,'client_secret'=>$secret,
    'redirect_uri'=>google_callback_url(),'grant_type'=>'authorization_code','code_verifier'=>$state['verifier']
  ]);
  if (!is_string($token['access_token']??null)||$token['access_token']==='') throw new RuntimeException('google_response');
  return google_identity(google_http('https://openidconnect.googleapis.com/v1/userinfo',[],$token['access_token']));
}
/** У журнал іде лише клас помилки зі списку — ні тексту відповіді Google, ні коду. */
function google_error_class(Throwable $e): string {
  $known=['google_provider'=>'Google відхилив обмін коду — найчастіше невірний Client Secret або redirect URI',
    'google_response'=>'Google відповів неочікувано','google_identity'=>'профіль Google без підтвердженої пошти',
    'google_verify_changed'=>'ключі змінилися під час перевірки','google_verify_admin'=>'перевірку завершив не той адміністратор',
    'google_cancelled'=>'перевірку скасовано на сторінці Google','google_code'=>'Google не передав код'];
  return $known[$e->getMessage()]??'інша помилка';
}

if (method()!=='GET'||!google_transport_ok()) google_redirect('login/google-unavailable');
try {
  google_install();
  $state=google_take_state((string)($_GET['state']??''),(string)($_COOKIE['kl_google_browser']??''));
} catch (Throwable $e) {
  /* Мітка не підійшла. Раніше це зникало безслідно: людина опинялася на сторінці
     входу сайту, а в журналі не лишалося нічого. Тепер пишемо причину (лише її —
     без state, коду чи кук) і, якщо це була перевірка ключів, повертаємо в адмінку. */
  $raw=(string)($_GET['state']??'');$cookie=(string)($_COOKIE['kl_google_browser']??'');
  $row=preg_match('/^[a-f0-9]{64}$/',$raw)?one('SELECT * FROM kl_google_states WHERE state_hash=?',[sha($raw)]):null;
  $why=match(true){
    !$row=>'Google повернув невідому мітку',
    $row['used_at']!==null=>'мітку вже використано — повторне відкриття сторінки',
    (int)$row['expires_at']<=time()=>'минуло більше 10 хвилин',
    $cookie===''=>'браузер не передав куку kl_google_browser — Google відкрився в іншому вікні чи браузері',
    !hash_equals((string)$row['browser_hash'],sha($cookie))=>'кука від іншої спроби — натиснули «Перевірити» кілька разів',
    default=>'мітка не пройшла перевірки',
  };
  /* Адресу повернення може відкрити будь-хто й будь-чим — не даємо засмічувати
     журнал: невідомі мітки пишемо не частіше 20 разів за 15 хвилин з однієї IP. */
  if (($row&&$row['mode']==='verify')||!limited('google-cb-log:'.ip_hash(),20,900))
    admin_log($row&&$row['mode']==='verify'?(int)$row['user_id']:null,'google_callback_fail',$why.(isset($_GET['error'])?'; Google: '.substr(preg_replace('/[^a-z_]/','',(string)$_GET['error']),0,40):''));
  if ($row&&$row['mode']==='verify') google_admin_redirect('google_verify_fail');
  if ($row&&!empty($row['app_ch'])) google_app_return('e=google-error');
  google_redirect('login/google-error');
}
setcookie('kl_google_browser','',cookie_opts(time()-3600));

/* Перевірка ключів адміністратором: справжній обмін із Google чернетковими
   ключами — і нічого більше. Ні користувача, ні сесії, ні привʼязування. */
if ($state['mode']==='verify') {
  try {
    if (isset($_GET['error'])) throw new RuntimeException('google_cancelled');
    $draft=google_draft();
    if (!$draft||!hash_equals($draft['fp'],(string)($state['cfg_fp']??''))) throw new InvalidArgumentException('google_verify_changed');
    $identity=google_exchange((string)($_GET['code']??''),$state,$draft['client_id'],$draft['client_secret']);
    google_verify_finish($state,current_user(),$identity);
    google_admin_redirect('google_verified');
  } catch (Throwable $e) {
    $u=current_user();
    /* Код помилки від Google (access_denied, invalid_request…) — коротке слово з
       латиниці, без даних користувача; саме він найкраще пояснює відмову. */
    $gErr=isset($_GET['error'])?'; Google: '.substr(preg_replace('/[^a-z_]/','',(string)$_GET['error']),0,40):'';
    admin_log($u?(int)$u['id']:null,'google_verify_fail',google_error_class($e).$gErr);
    error_log('[komiks-google] verification failed');
    google_admin_redirect('google_verify_fail');
  }
}

$app=!empty($state['app_ch']);
if (!google_enabled()) { if ($app) google_app_return('e=google-unavailable'); google_redirect('login/google-unavailable'); }
try {
  if (isset($_GET['error'])) { if ($app) google_app_return('e=google-cancelled'); google_redirect('login/google-cancelled'); }
  $conf=google_conf();
  $identity=google_exchange((string)($_GET['code']??''),$state,$conf['client_id'],$conf['client_secret']);
  $u=google_resolve_user($identity,$state,current_user());
  if (!empty($u['_google_created'])) founder_grant($u);
  if ($state['mode']==='link') google_redirect('account');
  if ($app) {
    // сесію створить застосунок, обмінявши код (auth.php google_handoff); браузер лишається без входу
    $code=rand_hex(32);
    q('DELETE FROM kl_google_handoff WHERE expires_at < ?',[time()-3600]);
    q('INSERT INTO kl_google_handoff (code_hash,user_id,app_ch,expires_at) VALUES (?,?,?,?)',[sha($code),(int)$u['id'],(string)$state['app_ch'],time()+300]);
    google_app_return('h='.$code);
  }
  if (totp_on($u)) {
    setcookie('kl_google_2fa',new_token((int)$u['id'],'2fa',600),cookie_opts(time()+600));
    google_redirect('login/google-2fa');
  }
start_session((int)$u['id'], 'google');
  google_redirect('account');
} catch (InvalidArgumentException $e) {
  $route=match($e->getMessage()){'google_link_required'=>'google-link-required','google_signup'=>'google-signup','blocked'=>'google-blocked',default=>'google-error'};
  if ($app) google_app_return('e='.$route);
  google_redirect('login/'.$route);
} catch (Throwable $e) {
  // Errors can contain network response data: keep all provider secrets out of logs.
  error_log('[komiks-google] callback failed');
  if ($app) google_app_return('e=google-error');
  google_redirect('login/google-error');
}
