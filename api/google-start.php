<?php
declare(strict_types=1);
define('KOMIKS_API',1);
require __DIR__.'/lib.php';
require __DIR__.'/google-auth.php';
if (method()!=='POST') fail('method',405);
require_csrf();
if (!google_enabled()) fail('google_unavailable',503);
// Google's OAuth policy disallows embedded user agents. The app opens the returned URL in the
// system browser and later redeems a one-time handoff code with its own secret (app_ch).
$in=input();
$appCh=strtolower((string)($in['app_ch']??''));
$isApp=app_origin()!==''||preg_match('/; wv\)|\bwv\b|KomiksApp/i',$_SERVER['HTTP_USER_AGENT']??'');
if ($isApp&&!preg_match('/^[a-f0-9]{64}$/',$appCh)) fail('google_browser',400);
if (!$isApp) $appCh='';
rate_or_fail('google-start:'.ip_hash(),20,900);
$mode=(string)($in['mode']??'login');
/* 'verify' сюди не приймаємо: перевірку ключів запускає лише адмінка, під своїм CSRF. */
if (!in_array($mode,['login','continue','signup','link'],true)) fail('action');
if ($appCh!==''&&$mode==='link') fail('google_browser',400);   // привʼязування — лише на сайті
/* 'continue' — кнопка на сторінці входу: заходить, а новому створює акаунт. Тому
   згода обовʼязкова так само, як на реєстрації. */
if (($mode==='signup'||$mode==='continue')&&($in['consent']??false)!==true) fail('consent');
$u=$mode==='link'?require_user():null;
if ($u&&(empty($u['verified_at'])||!empty($u['is_demo']))) fail('auth',403);
google_install();
$browser=rand_hex(32);$state=google_new_state($browser,$mode,kl_lang($in['lang']??'en'),$u?(int)$u['id']:null,null,$appCh!==''?$appCh:null);
if ($appCh==='') {
  $opts=cookie_opts(time()+600);$opts['samesite']='Lax';$opts['secure']=true;
  setcookie('kl_google_browser',$browser,$opts);
}
out(['ok'=>true,'url'=>google_auth_url(google_conf()['client_id'],$state)]);
