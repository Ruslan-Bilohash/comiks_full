<?php
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(404); exit; }

/* Ключі тепер можна ввести в адмінці («⚙️ Система» → «Вхід через Google»):
   секрет лежить у базі зашифрованим. Без них працює старий блок config.php. */
require_once __DIR__.'/secret-box.php';
require_once __DIR__.'/admin-auth.php';
require_once __DIR__.'/google-settings.php';

/** Confidential-client OAuth: identity comes only from Google's authenticated UserInfo API.
 * No browser-supplied identity or unverified JWT claims are accepted. */
function google_transport_ok(): bool { return str_starts_with(site_url(), 'https://') && function_exists('curl_init'); }
function google_enabled(): bool { return google_conf()['enabled'] && google_transport_ok(); }
function google_callback_url(): string { return site_url().'api/google-callback.php'; }
function google_install(): void {
  $my=db()->getAttribute(PDO::ATTR_DRIVER_NAME)==='mysql';
  $end=$my?' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin':'';
  q('CREATE TABLE IF NOT EXISTS kl_google_states (state_hash CHAR(64) PRIMARY KEY, browser_hash CHAR(64) NOT NULL, verifier VARCHAR(128) NOT NULL, mode VARCHAR(10) NOT NULL, lang VARCHAR(5) NOT NULL, user_id INT NULL, expires_at INT NOT NULL, used_at INT NULL)'.$end);
  q('CREATE TABLE IF NOT EXISTS kl_google_accounts (subject VARCHAR(255) PRIMARY KEY, user_id INT NOT NULL UNIQUE, created_at INT NOT NULL)'.$end);
  /* Перевірка ключів адміном привʼязана до тих самих ключів, з якими почалася. */
  try { q('ALTER TABLE kl_google_states ADD COLUMN cfg_fp CHAR(64) NULL'); } catch (Throwable $e) { /* вже є */ }
  /* Застосунок: вхід іде в системному браузері (Google не пускає вбудовані), а сесію
     забирає застосунок одноразовим кодом. app_ch — sha256 секрету, який знає лише він. */
  try { q('ALTER TABLE kl_google_states ADD COLUMN app_ch CHAR(64) NULL'); } catch (Throwable $e) { /* вже є */ }
  q('CREATE TABLE IF NOT EXISTS kl_google_handoff (code_hash CHAR(64) PRIMARY KEY, user_id INT NOT NULL, app_ch CHAR(64) NOT NULL, expires_at INT NOT NULL, used_at INT NULL)'.$end);
  google_settings_install();
}
/** Адреса входу Google. Одна на всі режими, щоб параметри не розійшлися. */
function google_auth_url(string $clientId,array $state): string {
  return 'https://accounts.google.com/o/oauth2/v2/auth?'.http_build_query([
    'client_id'=>$clientId,'redirect_uri'=>google_callback_url(),'response_type'=>'code',
    'scope'=>'openid email profile','state'=>$state['state'],'code_challenge'=>$state['challenge'],'code_challenge_method'=>'S256','prompt'=>'select_account'
  ],'','&',PHP_QUERY_RFC3986);
}
/** Called within account deletion's transaction; no DDL or ignored database errors. */
function google_delete_user(int $id): void {
  $my=db()->getAttribute(PDO::ATTR_DRIVER_NAME)==='mysql';
  foreach (['kl_google_states','kl_google_accounts'] as $table) {
    $exists=$my?one('SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?',[$table])
      :one("SELECT name FROM sqlite_master WHERE type='table' AND name=?",[$table]);
    if ($exists) q('DELETE FROM '.$table.' WHERE user_id=?',[$id]);
  }
}
function google_new_state(string $browser,string $mode,string $lang,?int $userId,?string $cfgFp=null,?string $appCh=null): array {
  if (!in_array($mode,['login','continue','signup','link','verify'],true)) throw new InvalidArgumentException('google_mode');
  if ($mode==='verify'&&(!$userId||!$cfgFp)) throw new InvalidArgumentException('google_mode');
  $state=rand_hex(32);$verifier=rand_hex(32);
  q('DELETE FROM kl_google_states WHERE expires_at < ?', [time()-3600]);
  q('INSERT INTO kl_google_states (state_hash,browser_hash,verifier,mode,lang,user_id,expires_at,cfg_fp,app_ch) VALUES (?,?,?,?,?,?,?,?,?)',
    [sha($state),sha($browser),$verifier,$mode,kl_lang($lang),$userId,time()+600,$cfgFp,$appCh]);
  return ['state'=>$state,'challenge'=>rtrim(strtr(base64_encode(hash('sha256',$verifier,true)),'+/','-_'),'=')];
}
function google_take_state(string $state,string $browser): array {
  if (!preg_match('/^[a-f0-9]{64}$/',$state)) throw new InvalidArgumentException('google_state');
  $r=one('SELECT * FROM kl_google_states WHERE state_hash=?',[sha($state)]);
  /* Спроба із застосунку куки браузера не має: її замінює секрет застосунку — сесію
     без нього ніхто не забере, а в самому браузері сесія не створюється. */
  $app=$r&&!empty($r['app_ch']);
  if (!$r||$r['used_at']!==null||(int)$r['expires_at']<=time()||(!$app&&($browser===''||!hash_equals($r['browser_hash'],sha($browser))))) throw new InvalidArgumentException('google_state');
  $claim=q('UPDATE kl_google_states SET used_at=? WHERE state_hash=? AND used_at IS NULL AND expires_at>?',[time(),sha($state),time()]);
  if (!$claim->rowCount()) throw new InvalidArgumentException('google_state');
  return $r;
}
/** Fixed HTTPS endpoints only. Never log response bodies, codes or access tokens. */
function google_http(string $endpoint,array $form=[],string $accessToken=''): array {
  if (!in_array($endpoint,['https://oauth2.googleapis.com/token','https://openidconnect.googleapis.com/v1/userinfo'],true)) throw new LogicException('Google endpoint');
  $ch=curl_init($endpoint);
  $headers=['Accept: application/json'];
  if ($accessToken!=='') {
    if (preg_match('/[\r\n]/',$accessToken)) throw new RuntimeException('google_response');
    $headers[]='Authorization: Bearer '.$accessToken;
  }
  curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>false,CURLOPT_CONNECTTIMEOUT=>10,CURLOPT_TIMEOUT=>20,
    CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_HTTPHEADER=>$headers]);
  if ($form) {curl_setopt($ch,CURLOPT_POST,true);curl_setopt($ch,CURLOPT_POSTFIELDS,http_build_query($form,'','&',PHP_QUERY_RFC3986));}
  $body=curl_exec($ch);$status=(int)curl_getinfo($ch,CURLINFO_RESPONSE_CODE);curl_close($ch);
  if (!is_string($body)||$status!==200) throw new RuntimeException('google_provider');
  $data=json_decode($body,true);
  if (!is_array($data)||isset($data['error'])) throw new RuntimeException('google_response');
  return $data;
}
function google_identity(array $data): array {
  $sub=$data['sub']??null;$email=$data['email']??null;
  if (!is_string($sub)||$sub===''||strlen($sub)>255||preg_match('/[\x00-\x20\x7f]/',$sub)
    ||!is_string($email)||strlen($email)>190||!valid_email($email)||($data['email_verified']??false)!==true) throw new InvalidArgumentException('google_identity');
  $name=clean_text(is_string($data['name']??null)?$data['name']:'Google user',30);
  if (mb_strlen($name)<2) $name='Google user';
  /* hd — домен Google Workspace. Він є лише в робочих акаунтах і означає, що
     адресу видає сама організація через Google. */
  $hd=is_string($data['hd']??null)&&preg_match('/^[a-z0-9.-]{1,190}$/i',$data['hd'])?strtolower($data['hd']):'';
  return ['sub'=>$sub,'email'=>strtolower(trim($email)),'name'=>$name,'hd'=>$hd];
}
/** Чи можна приєднати Google до наявного акаунта без кроку «Прив’язати Google».
 *  Лише коли пошту підтвердили обидва боки:
 *   • Google — і він справді господар адреси: Gmail або домен Workspace (hd).
 *     Для інших адрес у Google-акаунті email_verified означає лише, що колись
 *     прийшов лист, а не що адреса досі належить цій людині;
 *   • наш сайт — людина відкрила лист підтвердження.
 *  Друга умова закриває відому крадіжку: хтось реєструє чужу пошту без
 *  підтвердження й чекає, поки власник зайде через Google у його акаунт. */
function google_can_autolink(array $identity,array $u): bool {
  if (empty($u['verified_at'])||!empty($u['blocked_at'])||!empty($u['is_demo'])) return false;
  if (strcasecmp((string)$u['email'],$identity['email'])!==0) return false;
  $domain=strtolower(substr(strrchr($identity['email'],'@')?:'',1));
  $owned=in_array($domain,['gmail.com','googlemail.com'],true)||(($identity['hd']??'')!==''&&$identity['hd']===$domain);
  if (!$owned) return false;
  /* Акаунт уже має інший Google — не підміняємо його мовчки. */
  return !one('SELECT subject FROM kl_google_accounts WHERE user_id=?',[$u['id']]);
}
function google_resolve_user(array $identity,array $state,?array $sessionUser): array {
  db()->beginTransaction();
  try {
    $created=false;
    $binding=one('SELECT user_id FROM kl_google_accounts WHERE subject=?',[$identity['sub']]);
    if ($binding) {
      if ($state['mode']==='link'&&(!$sessionUser||(int)$binding['user_id']!==(int)$sessionUser['id']||(int)$state['user_id']!==(int)$sessionUser['id'])) throw new InvalidArgumentException('google_link_required');
      $u=one('SELECT * FROM kl_users WHERE id=?',[$binding['user_id']]);
    } elseif ($state['mode']==='link') {
      if (!$sessionUser||(int)$state['user_id']!==(int)$sessionUser['id']) throw new InvalidArgumentException('google_link_required');
      $u=one('SELECT * FROM kl_users WHERE id=?',[$sessionUser['id']]);
      if (!$u||empty($u['verified_at'])||!empty($u['blocked_at'])||!empty($u['is_demo'])||strcasecmp($u['email'],$identity['email'])!==0) throw new InvalidArgumentException('google_link_required');
      q('INSERT INTO kl_google_accounts (subject,user_id,created_at) VALUES (?,?,?)',[$identity['sub'],$u['id'],time()]);
    } else {
      // Email matching alone never grants access or changes an existing password —
      // only when both Google and this site have verified the same mailbox.
      $existing=one('SELECT * FROM kl_users WHERE email=?',[$identity['email']]);
      if ($existing) {
        if (!google_can_autolink($identity,$existing)) throw new InvalidArgumentException('google_link_required');
        q('INSERT INTO kl_google_accounts (subject,user_id,created_at) VALUES (?,?,?)',[$identity['sub'],$existing['id'],time()]);
        $u=one('SELECT * FROM kl_users WHERE id=?',[$existing['id']]);
        if (!$u||!empty($u['blocked_at'])||!empty($u['is_demo'])) throw new InvalidArgumentException('blocked');
        db()->commit();return $u+['_google_created'=>false];
      }
      /* Новий акаунт — лише зі згодою: на реєстрації це галочка, а «continue»
         зі сторінки входу приходить тільки від того, хто прийняв умови у вікні
         привітання (сервер перевіряє consent у google-start.php). */
      if (!in_array($state['mode'],['signup','continue'],true)) throw new InvalidArgumentException('google_signup');
      q('INSERT INTO kl_users (email,name,pass_hash,lang,friend_code,share_profile,verified_at,created_at,consent_at) VALUES (?,?,?,?,?,0,?,?,?)',
        [$identity['email'],$identity['name'],hash_password(rand_hex(32)),kl_lang($state['lang']),unique_friend_code(),time(),time(),time()]);
      $id=(int)db()->lastInsertId();
      q('INSERT INTO kl_google_accounts (subject,user_id,created_at) VALUES (?,?,?)',[$identity['sub'],$id,time()]);
      $u=one('SELECT * FROM kl_users WHERE id=?',[$id]);
      $created=true;
    }
    if (!$u||!empty($u['blocked_at'])||!empty($u['is_demo'])) throw new InvalidArgumentException('blocked');
    db()->commit();return $u+['_google_created'=>$created];
  } catch (Throwable $e) {if(db()->inTransaction())db()->rollBack();throw $e;}
}
