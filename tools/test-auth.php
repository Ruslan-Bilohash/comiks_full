<?php
declare(strict_types=1);
// Isolate real helper functions from lib.php: no configuration, real DB or transport.
function load_functions(string $path,array $wanted): void {
  $tokens=token_get_all(file_get_contents($path));
  for($i=0;$i<count($tokens);$i++) {
    if(!is_array($tokens[$i])||$tokens[$i][0]!==T_FUNCTION)continue;
    $j=$i+1;while(is_array($tokens[$j])&&$tokens[$j][0]===T_WHITESPACE)$j++;
    if(!is_array($tokens[$j])||!in_array($tokens[$j][1],$wanted,true))continue;
    $src='';$depth=0;$started=false;
    for(;$i<count($tokens);$i++){$t=$tokens[$i];$s=is_array($t)?$t[1]:$t;$src.=$s;if($s==='{'){$depth++;$started=true;}elseif($s==='}'){$depth--;if($started&&$depth===0)break;}}
    eval($src);
  }
}
$pdo=new PDO('sqlite::memory:',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
function db(): PDO{return $GLOBALS['pdo'];}
function q(string $sql,array $args=[]): PDOStatement{$s=db()->prepare($sql);$s->execute($args);return $s;}
function one(string $sql,array $args=[]): ?array{return q($sql,$args)->fetch()?:null;}
function check(bool $ok,string $message): void{if(!$ok)throw new RuntimeException($message);echo "PASS $message\n";}
load_functions(__DIR__.'/../api/lib.php',['rand_hex','sha','new_token','take_token','claim_auth_token']);
q('CREATE TABLE kl_tokens (token_hash TEXT PRIMARY KEY,user_id INT,kind TEXT,expires_at INT,used_at INT NULL)');
q('CREATE TABLE kl_users (id INT PRIMARY KEY,name TEXT)');q("INSERT INTO kl_users VALUES (1,'Fixture')");
$old=new_token(1,'verify',3600);$new=new_token(1,'verify',3600);
check(take_token($old,'verify')!==null,'resending does not invalidate an earlier verification email');
check(take_token($old,'verify')===null,'verification token cannot be used twice');
check(take_token($new,'verify')===null,'successful verification consumes sibling verification tokens');
$unsub=new_token(1,'unsub',3600);new_token(1,'unsub',3600);
check(take_token($unsub,'unsub')!==null,'older campaign unsubscribe link remains valid');
$expired=new_token(1,'reset',-1);check(take_token($expired,'reset')===null,'expired token rejected');
$auth=file_get_contents(__DIR__.'/../api/auth.php');
check(strpos($auth,"if ($"."action === 'unsub')")<strpos($auth,"if (method() !== 'POST')"),'unsubscribe is dispatched before POST-only guard');
echo "ALL AUTH TESTS PASSED\n";
