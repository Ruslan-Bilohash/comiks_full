<?php
declare(strict_types=1);
define('KOMIKS_API',1);
require __DIR__.'/test-auth.php';
function cfg(string $key){return ['google.enabled'=>true,'google.client_id'=>'fixture.apps.googleusercontent.com','google.client_secret'=>'fixture-secret'][$key]??null;}
function site_url(): string{return 'https://example.test/comiks/';}
function valid_email(string $v): bool{return (bool)filter_var($v,FILTER_VALIDATE_EMAIL);}
function kl_lang(?string $v,string $default='en'): string{return in_array($v,['en','uk','no'],true)?$v:$default;}
function clean_text(string $v,int $max): string{return mb_substr(strip_tags($v),0,$max);}
function hash_password(string $v): string{return password_hash($v,PASSWORD_DEFAULT);}
function unique_friend_code(): string{return strtoupper(substr(bin2hex(random_bytes(5)),0,6));}
function rejects(callable $fn,string $label): void{try{$fn();}catch(InvalidArgumentException $e){check(true,$label);return;}throw new RuntimeException($label);}
$service=__DIR__.'/../api/google-auth.php';
check(is_file($service),'Google authentication service exists');require $service;
google_install();
$identity=google_identity(['sub'=>'123456789','email'=>'person@gmail.com','email_verified'=>true,'name'=>'Person']);
check($identity['sub']==='123456789','provider stable subject retained');
rejects(fn()=>google_identity(['sub'=>'1','email'=>'person@gmail.com','email_verified'=>false]),'unverified Google email rejected');
rejects(fn()=>google_identity(['sub'=>'1','email'=>"x\r\n@y.test",'email_verified'=>true]),'invalid provider email rejected');
$state=google_new_state('browser-secret','login','en',null);
rejects(fn()=>google_take_state($state['state'],'different-browser'),'state bound to initiating browser');
$row=google_take_state($state['state'],'browser-secret');check($row['mode']==='login','valid state consumed');
rejects(fn()=>google_take_state($state['state'],'browser-secret'),'replayed state rejected');
$state=google_new_state('browser-secret','login','en',null);q('UPDATE kl_google_states SET expires_at=0');
rejects(fn()=>google_take_state($state['state'],'browser-secret'),'expired state rejected');
q('DROP TABLE kl_users');
q('CREATE TABLE kl_users(id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT UNIQUE,name TEXT,pass_hash TEXT,lang TEXT,friend_code TEXT,share_profile INT,verified_at INT,created_at INT,consent_at INT,blocked_at INT NULL,is_demo INT DEFAULT 0)');
q("INSERT INTO kl_users(email,name,verified_at) VALUES ('person@gmail.com','Local',123)");
/* Пошта ще не підтверджена на сайті — збігу адреси замало для входу. */
q('UPDATE kl_users SET verified_at=NULL WHERE id=1');
rejects(fn()=>google_resolve_user($identity,['mode'=>'signup','lang'=>'en','user_id'=>null],null),'existing unverified email never automatically linked');
q('UPDATE kl_users SET verified_at=123 WHERE id=1');
rejects(fn()=>google_resolve_user($identity,['mode'=>'link','lang'=>'en','user_id'=>1],null),'link requires same authenticated browser account');
$u=google_resolve_user($identity,['mode'=>'link','lang'=>'en','user_id'=>1],['id'=>1,'verified_at'=>123]);
check((int)$u['id']===1,'authenticated existing owner can link Google');
$u=google_resolve_user($identity,['mode'=>'login','lang'=>'en','user_id'=>null],null);
check((int)$u['id']===1,'sub binding logs into original account');
q('UPDATE kl_users SET blocked_at=123 WHERE id=1');
rejects(fn()=>google_resolve_user($identity,['mode'=>'login','lang'=>'en','user_id'=>null],null),'blocked Google account rejected');
$new=google_identity(['sub'=>'222','email'=>'new@gmail.com','email_verified'=>true,'name'=>'New']);
rejects(fn()=>google_resolve_user($new,['mode'=>'login','lang'=>'en','user_id'=>null],null),'new account requires explicit signup');
$u=google_resolve_user($new,['mode'=>'signup','lang'=>'uk','user_id'=>null],null);
check($u['verified_at']>0&&$u['consent_at']>0&&(int)$u['share_profile']===0,'Google signup has verified email, consent and private profile');
check($u['_google_created']===true,'new-account result marks founder eligibility');
db()->beginTransaction();google_delete_user((int)$u['id']);q('DELETE FROM kl_users WHERE id=?',[$u['id']]);db()->commit();
$u=google_resolve_user($new,['mode'=>'signup','lang'=>'uk','user_id'=>null],null);
check($u['_google_created']===true,'deleted Google account can register again');
/* «Продовжити з Google» зі сторінки входу: новий — створюємо (згоду дано у вікні
   привітання), наявний — приєднуємо лише коли пошту підтвердили обидва боки. */
$fresh=google_identity(['sub'=>'333','email'=>'fresh@gmail.com','email_verified'=>true,'name'=>'Fresh']);
$u=google_resolve_user($fresh,['mode'=>'continue','lang'=>'en','user_id'=>null],null);
check($u['_google_created']===true,'continue creates a new account when none exists');
q("INSERT INTO kl_users(email,name,verified_at) VALUES ('owner@gmail.com','Owner',123)");
$ownerId=(int)db()->lastInsertId();
$owner=google_identity(['sub'=>'444','email'=>'owner@gmail.com','email_verified'=>true,'name'=>'Owner G']);
$u=google_resolve_user($owner,['mode'=>'continue','lang'=>'en','user_id'=>null],null);
check((int)$u['id']===$ownerId&&$u['_google_created']===false,'verified Gmail joins the verified local account automatically');
check((int)one('SELECT user_id FROM kl_google_accounts WHERE subject=?',['444'])['user_id']===$ownerId,'automatic join is remembered as a binding');
$u=google_resolve_user($owner,['mode'=>'login','lang'=>'en','user_id'=>null],null);
check((int)$u['id']===$ownerId,'joined account signs in next time');
q("INSERT INTO kl_users(email,name,verified_at) VALUES ('pending@gmail.com','Pending',NULL)");
$pending=google_identity(['sub'=>'555','email'=>'pending@gmail.com','email_verified'=>true,'name'=>'P']);
rejects(fn()=>google_resolve_user($pending,['mode'=>'continue','lang'=>'en','user_id'=>null],null),'unverified local account is never joined automatically (pre-registration takeover)');
q("INSERT INTO kl_users(email,name,verified_at) VALUES ('me@mydomain.test','Custom',123)");
$custom=google_identity(['sub'=>'666','email'=>'me@mydomain.test','email_verified'=>true,'name'=>'C']);
rejects(fn()=>google_resolve_user($custom,['mode'=>'continue','lang'=>'en','user_id'=>null],null),'non-Gmail Google account without Workspace domain is not joined automatically');
$ws=google_identity(['sub'=>'777','email'=>'me@mydomain.test','email_verified'=>true,'name'=>'C','hd'=>'mydomain.test']);
check((int)google_resolve_user($ws,['mode'=>'continue','lang'=>'en','user_id'=>null],null)['id']>0,'Workspace account of its own domain is joined automatically');
$other=google_identity(['sub'=>'888','email'=>'owner@gmail.com','email_verified'=>true,'name'=>'Other G']);
rejects(fn()=>google_resolve_user($other,['mode'=>'continue','lang'=>'en','user_id'=>null],null),'account already linked to another Google is not re-linked');
q('UPDATE kl_users SET blocked_at=1 WHERE id=?',[$ownerId]);
rejects(fn()=>google_resolve_user($owner,['mode'=>'login','lang'=>'en','user_id'=>null],null),'blocked joined account cannot sign in');
$nobody=google_identity(['sub'=>'999','email'=>'nobody@gmail.com','email_verified'=>true,'name'=>'N']);
rejects(fn()=>google_resolve_user($nobody,['mode'=>'login','lang'=>'en','user_id'=>null],null),'plain login without consent still never creates an account');
q('DROP TABLE kl_google_accounts');q('DROP TABLE kl_google_states');google_delete_user((int)$u['id']);
check(true,'account deletion works before Google tables installed');
echo "ALL GOOGLE TESTS PASSED\n";
