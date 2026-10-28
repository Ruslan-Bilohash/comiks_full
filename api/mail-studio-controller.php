<?php
declare(strict_types=1);
if (!defined('KOMIKS_API') || empty($isAdmin) || empty($isStaff)) {http_response_code(403);exit;}
require_once __DIR__.'/mail-studio.php';
require_once __DIR__.'/mail-bounces.php';
ms_install();
$msError='';$msPost=[];
$msView=(string)($_GET['view']??'campaigns');
if(!in_array($msView,['campaigns','news','testers','bounces','compose','templates','recipients','history','campaign'],true))$msView='campaigns';
$ajax=($_SERVER['HTTP_X_MAIL_STUDIO']??'')==='1';
if($post){
  check_admin_csrf();
  try {
    $do=(string)($_POST['do']??'');$id=max(0,(int)($_POST['id']??0));
    if($do==='preview') {
      $mail=ms_render((array)($_POST['content']??[]),['name'=>'Олена','email'=>'olena@example.test']);
      out(['ok'=>true]+$mail);
    }
    // ✨ стаття «Що нового» → чернетки кампаній для всіх підписаних (по 50), далі — звичайний запуск
    if($do==='news_prepare'){
      $ids=ms_news_prepare((string)($_POST['update_id']??''),(int)$me['id']);
      go('p=mail&view=campaign&id='.$ids[0].'&saved=1'.(count($ids)>1?'&parts='.count($ids):''));
    }
    // 🙏 список тестувальників і чернетка подяки обраним (надсилання — лише кнопкою на сторінці кампанії)
    if($do==='testers_save'){ms_testers_save((string)($_POST['emails']??''));go('p=mail&view=testers&saved=1');}
    if($do==='thanks_prepare'){$id=ms_thanks_prepare((array)($_POST['u']??[]),(int)$me['id']);go('p=mail&view=campaign&id='.$id.'&saved=1');}
    // 🖼 фото в чернетці: додати, замінити, змінити підпис або прибрати
    // завантажити фото окремо (вставка скриншота, перетягування) — повертає назву файла й адресу
    if($do==='image_upload'){$f=ms_img_save(isset($_FILES['image'])&&is_array($_FILES['image'])?$_FILES['image']:[]);out(['ok'=>true,'image'=>$f,'url'=>ms_img_url($f)]);}
    if($do==='campaign_image'){ms_campaign_image($id,isset($_FILES['image'])&&is_array($_FILES['image'])?$_FILES['image']:null,(string)($_POST['caption']??''),!empty($_POST['remove']),(string)($_POST['image_name']??''));go('p=mail&view=campaign&id='.$id.'&saved=1&img=1');}
    // 📭 відмови: скринька (IMAP, лише читання), вставлений текст, «повернути листи», видалення — лише кнопкою з підтвердженням
    if($do==='bounce_imap'){$r=bnc_imap_scan();meta_set('ms.bounce.last',json_encode(['at'=>time(),'s'=>$r['scanned'],'f'=>$r['found'],'o'=>$r['off']]));admin_log((int)$me['id'],'bounce_scan','відмов '.$r['found'].', листи вимкнено '.$r['off']);go('p=mail&view=bounces&scan=1');}
    if($do==='bounce_paste'){$r=bnc_from_text((string)($_POST['text']??''),'paste');go('p=mail&view=bounces&found='.$r['found'].'&off='.$r['off']);}
    if($do==='bounce_forget'){$em=strtolower(trim((string)($_POST['email']??'')));bnc_install();q('DELETE FROM kl_mail_bounces WHERE email=?',[$em]);q('UPDATE kl_users SET mail_ok=1 WHERE LOWER(email)=?',[$em]);go('p=mail&view=bounces&saved=1');}
    if(in_array($do,['bounce_delete','purge_bounced','purge_unverified'],true)){
      if($do!=='bounce_delete'&&(string)($_POST['confirm']??'')!=='ВИДАЛИТИ')throw new InvalidArgumentException('Щоб видалити, напишіть ВИДАЛИТИ у полі підтвердження.');
      $hard=array_column(q("SELECT email FROM kl_mail_bounces WHERE hard=1")->fetchAll(),'email');
      $bounced=fn($u)=>in_array(strtolower((string)$u['email']),$hard,true)&&empty($u['last_login'])&&!bnc_protected($u)&&(int)$u['id']!==(int)$me['id'];
      if($do==='purge_unverified')$ids=array_column(array_filter(bnc_unverified(),'bnc_can_purge'),'id');
      elseif($do==='purge_bounced')$ids=array_column(q('SELECT id FROM kl_users WHERE LOWER(email) IN (SELECT email FROM kl_mail_bounces WHERE hard=1)')->fetchAll(),'id');
      else $ids=[(int)($_POST['id']??0)];
      $n=bnc_delete_users($ids,$do==='purge_unverified'?fn($u)=>empty($u['verified_at'])&&bnc_can_purge($u):$bounced);
      admin_log((int)$me['id'],'users_purge',['bounce_delete'=>'акаунт із відмовою','purge_bounced'=>'акаунти з відмовою','purge_unverified'=>'непідтверджені'][$do].': '.$n);
      go('p=mail&view=bounces&deleted='.$n);
    }
    if($do==='draft'){
      $id=ms_save_draft($id,(string)($_POST['title']??''),(array)($_POST['content']??[]),(array)($_POST['u']??[]),(int)$me['id'],(string)($_POST['request_key']??''));
      go('p=mail&view=campaign&id='.$id.'&saved=1');
    }
    if($do==='template_save'||$do==='template_new'){
      $tid=ms_template_save($do==='template_save'?max(0,(int)($_POST['template_id']??0)):0,(array)($_POST['content']??[]));
      go('p=mail&view=compose&template='.$tid.'&saved=1');
    }
    if($do==='template_archive'){
      q('UPDATE kl_mail_templates SET active=0,updated_at=? WHERE id=?',[time(),$id]);
      go('p=mail&view=templates&saved=1');
    }
    if($do==='start') {ms_start($id);if($ajax)out(['ok'=>true,'status'=>'running','counts'=>ms_counts($id)]);ms_step($id);go('p=mail&view=campaign&id='.$id);}
    if($do==='step') {if(!$ajax)throw new InvalidArgumentException('Оновіть сторінку.');out(['ok'=>true]+ms_step($id));}
    if($do==='pause') {ms_pause($id);if($ajax)out(['ok'=>true,'status'=>'paused','counts'=>ms_counts($id)]);go('p=mail&view=campaign&id='.$id);}
    if($do==='retry') {ms_retry($id);go('p=mail&view=campaign&id='.$id);}
    throw new InvalidArgumentException('Невідома дія. Оновіть сторінку.');
  }catch(InvalidArgumentException $e){
    if($ajax||($_POST['do']??'')==='preview')out(['ok'=>false,'error'=>$e->getMessage()],422);
    $msError=$e->getMessage();$msPost=$_POST;
    if(in_array($_POST['do']??'',['draft','template_save','template_new'],true))$msView='compose';
    http_response_code(422);
  }catch(Throwable $e){
    error_log('[mail-studio] '.$e->getMessage());
    if($ajax)out(['ok'=>false,'error'=>'Не вдалося завершити дію. Перевірте журнал: поточний лист міг бути прийнятий сервером. Не повторюйте його без перевірки.'],500);
    $msError='Не вдалося зберегти зміни. Повторно відкрийте кампанію та перевірте її стан.';
    http_response_code(500);
  }
}
$csrf='<input type="hidden" name="csrf" value="'.e(admin_csrf()).'">';
page_open('Розсилки', $nonce, $NAV, 'mail', $me);
require __DIR__.'/mail-studio-view.php';
page_close($nonce);
