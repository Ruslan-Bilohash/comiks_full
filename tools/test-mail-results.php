<?php
declare(strict_types=1);
require __DIR__.'/test-auth.php';
function meta_set(string $k,string $v): void {$GLOBALS['metadata'][$k]=$v;}
function mail_error(): string {return $GLOBALS['transportError']??'';}
function send_template(array $u,string $kind,string $url): bool {return false;}
function site_url(): string {return 'https://example.test/';}
const VERIFY_TTL=3600;
load_functions(__DIR__.'/../api/lib.php',['auth_mail_result','send_verify','safe_mail_error']);
check(send_verify(['id'=>1])===false,'verification helper returns failed transport result');
$GLOBALS['transportError']='smtp: 535 Authentication failed after c2VjcmV0';
check(auth_mail_result('verify',false)===false,'mail failure remains failure');
check(!str_contains(json_encode($GLOBALS['metadata']),'c2VjcmV0'),'diagnostics never store SMTP command credential');
check(str_contains($GLOBALS['metadata']['auth_mail_last_failure'],'535'),'diagnostics include SMTP response code');
check(!str_contains(safe_mail_error($GLOBALS['transportError']),'c2VjcmV0'),'transport logger removes AUTH command argument');
check(auth_mail_result('verify',true)===true,'accepted mail retained');
check($GLOBALS['metadata']['auth_mail_last_status']==='accepted','last transport status is durable');
$magic=new_token(1,'magic',3600);
$hash=sha('mcode:1:123456');q('INSERT INTO kl_tokens(token_hash,user_id,kind,expires_at) VALUES(?,?,?,?)',[$hash,1,'mcode',time()+3600]);
check(claim_auth_token($hash,'mcode')!==null,'six digit credential uses shared atomic claim');
check(take_token($magic,'magic')===null,'code login invalidates sibling magic links');
check(claim_auth_token($hash,'mcode')===null,'code cannot replay');
echo "ALL MAIL RESULT TESTS PASSED\n";
