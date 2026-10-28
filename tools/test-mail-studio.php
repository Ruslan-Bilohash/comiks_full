<?php
declare(strict_types=1);
define('KOMIKS_API', 1);
const KL_LANGS = ['uk','en','no','ar','de','pl','tr','lt'];
$pdo=new PDO('sqlite::memory:',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
function db(): PDO {return $GLOBALS['pdo'];}
function q(string $sql,array $a=[]): PDOStatement {$s=db()->prepare($sql);$s->execute($a);return $s;}
function one(string $sql,array $a=[]): ?array {return q($sql,$a)->fetch()?:null;}
function site_url(): string {return 'https://example.test/comiks/';}
function new_token(int $id,string $kind,int $ttl): string {return 'fixture-token-'.$id;}
function mail_error(): string {return $GLOBALS['transportError']??'smtp data: 550 Fixture rejection';}
$sent=[];$transportOK=true;
function send_mail(string $to,string $subject,string $html,string $text): bool {$GLOBALS['sent'][]=func_get_args();return $GLOBALS['transportOK'];}
function check(bool $v,string $msg): void {if(!$v)throw new RuntimeException($msg);echo "PASS $msg\n";}
function rejects(callable $fn,string $msg): void {try{$fn();}catch(InvalidArgumentException $e){check(true,$msg);return;}throw new RuntimeException($msg);}
q('CREATE TABLE kl_users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, lang TEXT, verified_at INT, blocked_at INT, mail_ok INT, is_demo INT, last_login INT, created_at INT, premium INT, is_teacher INT)');
q('CREATE TABLE kl_mailouts (id INTEGER PRIMARY KEY, user_id INT, kind TEXT, sent_at INT, ok INT)');
for($i=1;$i<=5;$i++)q('INSERT INTO kl_users VALUES (?,?,?,?,?,NULL,?,0,?,?,0,0)',[$i,$i===1?'<Nora>':'Nora '.$i,'nora'.$i.'@example.test',$i===5?'en':'uk',time(),$i===3?0:1,time(),time()]);
require __DIR__.'/../api/mail-studio.php';
ms_install();ms_install();
check(count(ms_templates())===12,'starter templates seeded once');
$t=ms_templates()[0];$data=json_decode($t['content'],true);
$data['lang']='uk';$data['subject']='Вітаю {{name}}';$data['body']='Привіт {{name}} <script>alert(1)</script>';
$valid=ms_validate($data);
$render=ms_render($valid,['name'=>'<Nora>','email'=>'nora@example.test'],'https://example.test/unsubscribe');
check(!str_contains($render['html'],'<script>')&&str_contains($render['html'],'&lt;Nora&gt;'),'content and personalization escaped');
rejects(fn()=>ms_validate(array_replace($data,['url'=>'javascript:alert(1)'])),'unsafe URL rejected');
rejects(fn()=>ms_validate(array_replace($data,['subject'=>"Hi\r\nBcc:x@y.test"])),'header injection rejected');
rejects(fn()=>ms_validate(array_replace($data,['body'=>'{{password}}'])),'unknown placeholder rejected');
check(count(ms_audience(['lang'=>'uk']))===3,'audience excludes opted out and filters language');
$id=ms_save_draft(0,'Осінні новини',$data,[1,1,2,3],1,'draft-key-1');
check(count(ms_recipients($id))===2,'draft deduplicates and excludes ineligible recipients');
check(ms_save_draft(0,'Осінні новини',$data,[1,2],1,'draft-key-1')===$id,'draft submission idempotent');
check(count($sent)===0,'saving draft sends no mail');
ms_start($id);
q('UPDATE kl_users SET mail_ok=0 WHERE id=2');
ms_step($id);ms_step($id);ms_step($id);
check(count($sent)===1,'rechecks consent and does not resend');
$r=ms_recipients($id);
check($r[0]['status']==='sent'&&$r[1]['status']==='skipped','accepted and skipped statuses recorded');
check(count(ms_attempts($r[0]['id']))===1,'exact attempt recorded');
check(ms_attempts($r[0]['id'])[0]['subject']==='Вітаю <Nora>','personalized subject preserved');
rejects(fn()=>ms_save_draft($id,'Changed',$data,[4],1,'other'),'started campaign immutable');
$transportOK=false;
$fail=ms_save_draft(0,'Fail',$data,[4],1,'draft-key-2');ms_start($fail);ms_step($fail);
check(ms_recipients($fail)[0]['status']==='failed','transport failure recorded');
ms_retry($fail);$transportOK=true;ms_start($fail);ms_step($fail);
check(count(ms_attempts(ms_recipients($fail)[0]['id']))===2,'retry retains failed attempt');
$pending=ms_save_draft(0,'Pending',$data,[4],1,'draft-key-3');ms_start($pending);
q("UPDATE kl_mail_recipients SET status='sending' WHERE campaign_id=?",[$pending]);
$n=count($sent);ms_retry($pending);ms_step($pending);
check(count($sent)===$n,'ambiguous delivery never automatically retried');
$uncertain=ms_save_draft(0,'Uncertain SMTP',$data,[4],1,'draft-key-4');ms_start($uncertain);
$transportOK=false;$transportError='smtp data: ';ms_step($uncertain);
check(ms_recipients($uncertain)[0]['status']==='sending','SMTP timeout after DATA is not a retryable rejection');
$n=count($sent);ms_retry($uncertain);ms_step($uncertain);check(count($sent)===$n,'uncertain SMTP result cannot be retried');
check(ms_transport_result(false,'smtp: 535 Authentication failed after c2VjcmV0')[1]==='smtp: 535 Authentication failed','legacy AUTH command is redacted from history');
check(ms_transport_result(false,'smtp data: 451 Please retry')[0]==='failed','explicit SMTP rejection remains retryable');
$templateId=ms_template_save(0,$data);$changed=$data;$changed['subject']='Changed template';ms_template_save($templateId,$changed);
check(json_decode(ms_campaign($id)['content'],true)['subject']==='Вітаю {{name}}','template edits do not change campaign snapshot');
$paused=ms_save_draft(0,'Pause',$data,[4],1,'draft-key-5');ms_start($paused);ms_pause($paused);$n=count($sent);ms_step($paused);check(count($sent)===$n,'paused queue does not send');
rejects(fn()=>ms_save_draft(0,'Too many',$data,range(1,51),1,'draft-key-6'),'recipient limit enforced on server');
$address=ms_save_draft(0,'Address changed',$data,[4],1,'draft-key-7');q('UPDATE kl_users SET email=? WHERE id=4',['different@example.test']);ms_start($address);ms_step($address);check(ms_recipients($address)[0]['status']==='skipped','email changes invalidate draft recipient');
check(mb_strlen(ms_render(array_replace($data,['subject'=>str_repeat('{{name}}',20)]),['name'=>str_repeat('N',120),'email'=>'n@example.test'])['subject'])===200,'expanded subject fits durable history column');
echo "ALL MAIL STUDIO TESTS PASSED\n";
