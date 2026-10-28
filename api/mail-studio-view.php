<?php
declare(strict_types=1);
if (!defined('KOMIKS_API') || empty($isAdmin)) {http_response_code(403);exit;}
function ms_url(array $args=[]): string {return 'admin.php?'.http_build_query(['p'=>'mail']+$args);}
function ms_when($ts): string {return $ts?(new DateTimeImmutable('@'.(int)$ts))->setTimezone(new DateTimeZone('Europe/Berlin'))->format('d.m.Y H:i'):'—';}
function ms_badge(string $status): string {
  $labels=['draft'=>'Чернетка','running'=>'Черга запущена','paused'=>'Призупинено','completed'=>'Завершено','queued'=>'У черзі','sending'=>'Потребує перевірки','sent'=>'Прийнято сервером','failed'=>'Помилка','skipped'=>'Пропущено'];
  return '<span class="ms-badge ms-'.e($status).'">'.e($labels[$status]??$status).'</span>';
}
function ms_langs(): array {return ['uk'=>'Українська','en'=>'English','no'=>'Norsk','de'=>'Deutsch','pl'=>'Polski','lt'=>'Lietuvių','tr'=>'Türkçe','pt'=>'Português','ar'=>'العربية'];}
function ms_options(array $options,string $value): string { $html='';foreach($options as $k=>$label)$html.='<option value="'.e($k).'"'.($k===$value?' selected':'').'>'.e($label).'</option>';return $html; }
function ms_action(string $action,int $id,string $label,string $class='',string $confirm=''): string {
  global $csrf;
  return '<form method="post" action="'.e(ms_url(['view'=>'campaign','id'=>$id])).'" class="ms-inline"'.($confirm?' data-confirm="'.e($confirm).'"':'').'>'.$csrf.'<input type="hidden" name="do" value="'.e($action).'"><input type="hidden" name="id" value="'.$id.'"><button class="btn '.$class.'" type="submit">'.e($label).'</button></form>';
}
function ms_audience_table(array $rows,array $selected=[],bool $selectable=false): void {
  echo '<div class="ms-audience" data-audience><div class="ms-filters"><label class="f">Пошук<input type="search" data-filter="q" placeholder="Ім’я або email"></label><label class="f">Мова<select data-filter="lang">'.ms_options([''=>'Усі мови']+ms_langs(),'').'</select></label><label class="f">Активність<select data-filter="idle">'.ms_options([''=>'Будь-яка','14'=>'Не заходили 14+ днів','30'=>'Не заходили 30+ днів','90'=>'Не заходили 90+ днів'],'').'</select></label><label class="f">Попередні листи<select data-filter="sent">'.ms_options([''=>'Усі','never'=>'Ще не писали','recent'=>'Писали за 7 днів','notrecent'=>'Не писали 7 днів'],'').'</select></label><label class="f">Група<select data-filter="role">'.ms_options([''=>'Усі','premium'=>'Преміум','teacher'=>'Вчителі'],'').'</select></label></div>';
  if($selectable)echo '<div class="ms-selection"><button type="button" class="btn sm" data-select="visible">Обрати видимих (до 50)</button><button type="button" class="btn sm" data-select="none">Зняти вибір</button><b data-selected aria-live="polite">Обрано: '.count($selected).'</b></div>';
  echo '<p class="muted" data-visible aria-live="polite">Одержувачів: '.count($rows).'</p><div class="ms-table-scroll ms-audience-scroll"><table class="ms-table"><thead><tr>'.($selectable?'<th><span class="ms-sr">Обрати</span></th>':'').'<th>Користувач</th><th>Мова</th><th>Останній вхід</th><th>Останній лист</th></tr></thead><tbody>';
  foreach($rows as $r){
    $id=(int)$r['id'];$idle=max(0,intdiv(time()-(int)($r['last_login']?:$r['created_at']),86400));
    echo '<tr data-person data-q="'.e(mb_strtolower($r['name'].' '.$r['email'])).'" data-lang="'.e($r['lang']).'" data-idle="'.$idle.'" data-sent="'.(int)$r['last_sent'].'" data-premium="'.(int)$r['premium'].'" data-teacher="'.(int)$r['is_teacher'].'">';
    if($selectable)echo '<td><input aria-label="'.e('Обрати '.$r['email']).'" type="checkbox" name="u[]" value="'.$id.'"'.(in_array($id,$selected,true)?' checked':'').'></td>';
    echo '<td><b>'.e($r['name']).'</b><small>'.e($r['email']).'</small></td><td>'.e($r['lang']).'</td><td>'.e(ms_when($r['last_login'])).'</td><td>'.e(ms_when($r['last_sent'])).'</td></tr>';
  }
  echo '</tbody></table></div><p class="ms-empty" data-empty hidden>За цими фільтрами користувачів немає.</p></div>';
}
/* 🖼 Блок фото: вставка скриншота (Ctrl+V), перетягування або вибір файлу. У редакторі значення йде
   в content[image] і одразу оновлює перегляд; у чернетці — зберігається відразу після завантаження. */
function ms_photo_widget(string $mode,string $img,string $cap): string {
  $has=$img!==''&&ms_img_ok($img);
  return '<div class="ms-photo-box" data-photo="'.e($mode).'">'
    .($mode==='compose'?'<input type="hidden" name="content[image]" value="'.e($has?$img:'').'" data-photo-value>':'')
    .'<figure class="ms-photo-now" data-photo-now'.($has?'':' hidden').'><img src="'.($has?e(ms_img_url($img)):'').'" alt="Фото в листі">'.($mode==='compose'?'<button type="button" class="btn sm" data-photo-remove>🗑 Прибрати фото</button>':'').'</figure>'
    .'<div class="ms-drop" data-photo-drop tabindex="0" role="button" aria-label="Додати фото: вставте скриншот Ctrl+V або оберіть файл"><b>📋 Вставте скриншот — Ctrl+V</b>'
    .'<span>або перетягніть сюди файл, або <label class="ms-drop-pick">оберіть на диску<input type="file"'.($mode==='campaign'?' name="image"':'').' accept="image/png,image/jpeg,image/webp,image/gif" data-photo-file></label></span>'
    .'<small>PNG, JPG, WebP або GIF до 8 МБ · дані з фото (EXIF, геомітки) прибираються, ширина — до 1200 px</small></div>'
    .'<p class="ms-photo-status" data-photo-status aria-live="polite"></p>'
    .($mode==='compose'?'<label class="f">Підпис під фото <small>Необов’язково</small><input maxlength="200" name="content[image_caption]" value="'.e($cap).'" placeholder="Напр.: 📊 Огляд сайту за 30 днів"></label>':'')
    .'</div>';
}
?>
<link rel="stylesheet" href="assets/mail-studio.css?v=20261024-6">
<section class="ms" data-mail-studio>
<header class="ms-header"><div><h1>Розсилки</h1><p>Листи користувачам Комікс·Lab — від чернетки до історії відправлень.</p></div><a class="btn pri" href="<?=e(ms_url(['view'=>'compose']))?>">+ Новий лист</a></header>
<nav class="ms-tabs" aria-label="Розділи розсилок">
<?php foreach(['campaigns'=>'Кампанії','news'=>'✨ Що нового','testers'=>'🙏 Тестувальники','bounces'=>'📭 Відмови','compose'=>'Новий лист','templates'=>'Шаблони','recipients'=>'Одержувачі','history'=>'Журнал'] as $key=>$label): ?>
<a href="<?=e(ms_url(['view'=>$key]))?>" <?=($msView===$key||($msView==='campaign'&&$key==='campaigns'))?'aria-current="page"':''?>><?=e($label)?></a>
<?php endforeach; ?></nav>
<?php if(function_exists('meta_get') && meta_get('auth_mail_last_try') !== ''): ?>
<details class="ms-transport"><summary>Діагностика листів для входу</summary>
<p>Остання спроба: <?=e(ms_when(meta_get('auth_mail_last_try')))?> · тип: <?=e(meta_get('auth_mail_last_kind'))?> · <?=meta_get('auth_mail_last_status')==='accepted'?'прийнято поштовим сервером':'помилка надсилання'?>.</p>
<?php if(meta_get('auth_mail_last_failure')!==''): ?><p>Останній збій: <?=e(ms_when(meta_get('auth_mail_failure_at')))?> · <code><?=e(meta_get('auth_mail_last_failure'))?></code></p><?php endif; ?>
<p>Прийняття сервером не підтверджує доставку до «Вхідних». Якщо лист не прийшов, перевірте звіти доставки та папку «Спам» у поштовому сервісі.</p>
</details>
<?php endif; ?>
<?php if($msError): ?><div class="msg err" role="alert"><?=e($msError)?></div><?php endif; ?>
<?php if(isset($_GET['saved'])): ?><div class="msg ok" role="status">Збережено. Листів не надсилали.</div><?php endif; ?>
<?php
try {
if($msView==='campaigns'){
  $status=(string)($_GET['status']??'');$search=trim((string)($_GET['q']??''));$where=[];$args=[];
  if(in_array($status,['draft','running','paused','completed'],true)){$where[]='c.status=?';$args[]=$status;}
  if($search!==''){$where[]='c.title LIKE ?';$args[]='%'.$search.'%';}
  $sql=$where?' WHERE '.implode(' AND ',$where):'';
  $total=(int)one('SELECT COUNT(*) AS n FROM kl_mail_campaigns c'.$sql,$args)['n'];
  $page=max(1,(int)($_GET['page']??1));$offset=($page-1)*25;
  $rows=q('SELECT c.*,(SELECT COUNT(*) FROM kl_mail_recipients r WHERE r.campaign_id=c.id) AS recipients,(SELECT COUNT(*) FROM kl_mail_recipients r WHERE r.campaign_id=c.id AND r.status=\'sent\') AS sent FROM kl_mail_campaigns c'.$sql.' ORDER BY c.id DESC LIMIT 25 OFFSET '.$offset,$args)->fetchAll();
  echo '<form method="get" class="ms-toolbar"><input type="hidden" name="p" value="mail"><input type="hidden" name="view" value="campaigns"><label class="f">Знайти кампанію<input name="q" type="search" value="'.e($search).'" placeholder="Назва кампанії"></label><label class="f">Стан<select name="status">'.ms_options([''=>'Усі','draft'=>'Чернетки','running'=>'Запущені','paused'=>'Призупинені','completed'=>'Завершені'],$status).'</select></label><button class="btn" type="submit">Знайти</button></form>';
  if(!$rows)echo '<div class="ms-welcome"><h2>Перший лист починається з шаблону</h2><p>Оберіть приклад, відредагуйте текст і збережіть чернетку. Одержувачів та вигляд листа можна перевірити перед запуском.</p><a class="btn pri" href="'.e(ms_url(['view'=>'templates'])).'">Обрати шаблон</a></div>';
  else {
    echo '<div class="ms-table-scroll"><table class="ms-table"><thead><tr><th>Кампанія</th><th>Стан</th><th>Одержувачів</th><th>Прийнято сервером</th><th>Створено</th></tr></thead><tbody>';
    foreach($rows as $r)echo '<tr><td><a class="ms-title-link" href="'.e(ms_url(['view'=>'campaign','id'=>$r['id']])).'">'.e($r['title']).'</a><small>№ '.(int)$r['id'].'</small></td><td>'.ms_badge($r['status']).'</td><td>'.(int)$r['recipients'].'</td><td>'.(int)$r['sent'].'</td><td>'.e(ms_when($r['created_at'])).'</td></tr>';
    echo '</tbody></table></div>';
    ms_pager($page,$total,25);
  }
}
if($msView==='templates'){
  echo '<div class="ms-section-heading"><div><h2>Бібліотека шаблонів</h2><p class="muted">Приклади українською, норвезькою та англійською. Кожен можна змінити або зберегти як власний.</p></div></div><div class="ms-template-grid">';
  foreach(ms_templates() as $r){$t=json_decode($r['content'],true);echo '<article class="ms-template"><div class="ms-template-top"><span class="ms-language">'.e(ms_langs()[$t['lang']]??$t['lang']).'</span><span class="muted">'.($r['seed_key']?'Приклад':'Власний').'</span></div><h3>'.e($r['name']).'</h3><b>'.e($t['subject']).'</b><p>'.e(mb_substr($t['body'],0,145)).'…</p><div class="ms-template-actions"><a class="btn pri" href="'.e(ms_url(['view'=>'compose','template'=>$r['id']])).'">Використати / змінити</a>'.ms_action('template_archive',(int)$r['id'],'Архівувати','sm','Прибрати шаблон із бібліотеки? Історія листів залишиться.').'</div></article>';}
  echo '</div>';
}
if($msView==='news'){
  /* ✨ Обрати статтю «Що нового» й розіслати всім підписаним — кожному його мовою,
     з хештегами, посиланням на статтю та значками застосунку. */
  $aud=ms_audience();$byLang=[];foreach($aud as $u){$byLang[$u['lang']]=($byLang[$u['lang']]??0)+1;}arsort($byLang);
  echo '<div class="ms-section-heading"><div><h2>✨ Що нового — розіслати підписаним</h2><p class="muted">Оберіть статтю. Кожен підписаний отримає її своєю мовою (є всі 8), з хештегами, посиланням «Читати статтю на сайті» та значками Google Play і Microsoft Store. Спершу створюється чернетка: ви бачите лист і список одержувачів, а надсилання запускаєте самі.</p>'
    .'<p class="ms-news-aud"><b>Підписаних: '.count($aud).'</b> '.implode(' ',array_map(fn($l,$n)=>'<span class="ms-language">'.e(strtoupper($l)).' · '.$n.'</span>',array_keys($byLang),$byLang)).'</p></div></div>';
  $list=array_slice(ms_updates(),0,15);
  if(!$list)echo '<p class="msg warn">Статей не знайдено: немає data/updates.json. Зберіть сайт (node tools/build.js) і залийте його.</p>';
  echo '<div class="ms-news-grid">';
  foreach($list as $upd){
    $camps=ms_news_campaigns((string)$upd['id']);
    $lines=$upd['langs']['uk']['lines']??($upd['langs']['en']['lines']??[]);
    $date=date('d.m.Y',strtotime(substr((string)$upd['id'],0,10)));
    echo '<article class="ms-news'.($camps?' is-sent':'').'"><div class="ms-news-top"><span class="ms-news-ic" aria-hidden="true">'.e($upd['icon']??'✨').'</span><b>'.e($date).'</b><span class="muted">'.count((array)$upd['langs']).' мов</span>'
      .'<a class="ms-news-open" href="'.e((string)($upd['langs']['uk']['url']??$upd['langs']['en']['url']??'#')).'" target="_blank" rel="noopener">стаття ↗</a></div>'
      .'<ul>'.implode('',array_map(fn($l)=>'<li>'.e(mb_substr((string)$l,0,170)).(mb_strlen((string)$l)>170?'…':'').'</li>',array_slice((array)$lines,0,4))).'</ul>'
      .(!empty($upd['tags'])?'<p class="ms-news-tags">'.implode(' ',array_map(fn($t)=>'<span>#'.e($t).'</span>',(array)$upd['tags'])).'</p>':'');
    if($camps){
      echo '<div class="ms-news-camps">';
      foreach($camps as $c)echo '<a href="'.e(ms_url(['view'=>'campaign','id'=>$c['id']])).'">'.ms_badge($c['status']).' <span>'.e($c['title']).'</span> <small class="muted">'.(int)$c['sent'].' / '.(int)$c['n'].'</small></a>';
      echo '</div>';
    }
    echo '<form method="post" action="'.e(ms_url(['view'=>'news'])).'" data-confirm="'.e('Підготувати лист «Що нового '.$date.'» для '.count($aud).' підписаних? Далі ви побачите лист і запустите надсилання.').'">'.$csrf
      .'<input type="hidden" name="do" value="news_prepare"><input type="hidden" name="update_id" value="'.e($upd['id']).'"><button class="btn '.($camps?'':'pri').'"'.(count($aud)?'':' disabled').'>'.($camps?'📣 Розіслати ще раз':'📣 Розіслати підписаним ('.count($aud).')').'</button></form></article>';
  }
  echo '</div>';
}
if($msView==='testers'){
  /* 🙏 Тестувальники: найостанніше активні — вгорі, десятка вже позначена; лист подяки кожен
     отримує своєю мовою з власним «внеском» (дні на сайті, активний час). */
  $T=ms_testers();$rows=$T['rows'];$okN=count(array_filter($rows,fn($r)=>$r['why']===''));$topN=count(array_filter($rows,fn($r)=>$r['top']>0));
  $ago=function(string $d): string {if($d==='')return '<span class="muted">ще не було</span>';$n=(int)round((strtotime(date('Y-m-d'))-strtotime($d))/86400);return ($n<=0?'<b>сьогодні</b>':($n===1?'<b>вчора</b>':$n.' дн. тому')).' <small class="muted">'.e(date('d.m.Y',strtotime($d))).'</small>';};
  $time=fn(int $s)=>$s>=3600?str_replace('.',',',(string)round($s/3600,$s<36000?1:0)).' год':($s>=60?(int)round($s/60).' хв':'—');
  echo '<div class="ms-section-heading"><div><h2>🙏 Подяка тестувальникам</h2><p class="muted">Тестувальники — пошти зі списку Google Play і всі, хто заходив із застосунку Android. Вгорі — ті, хто був активний найостанніше; 🏅 10 найактивніших уже обрано (кому дякували за останні 14 днів, автоматично не обираються). Кожен отримає лист своєю мовою — українською, англійською чи норвезькою — з власним «внеском»: днями на сайті й активним часом. Спершу створюється чернетка: ви бачите лист і список, а надсилання запускаєте самі.</p>'
    .'<p class="ms-news-aud"><span class="ms-language">📋 У списку Google Play: '.$T['listed'].'</span><span class="ms-language">👤 З акаунтом: '.count($rows).'</span><span class="ms-language">📱 Із застосунку: '.count(array_filter($rows,fn($r)=>$r['app']>0)).'</span><span class="ms-language">✉️ Можна написати: '.$okN.'</span></p></div></div>';
  $sample=null;foreach($rows as $r)if($r['top']){$sample=$r;break;}
  echo '<details class="ms-panel"><summary>👀 Переглянути лист подяки (українська · English · norsk)</summary><div class="ms-thanks-prev">';
  foreach(['uk','en','no'] as $l){$m=ms_render(ms_thanks_content($l),['name'=>$sample['name']??'Олена','email'=>$sample['email']??'olena@example.test','lang'=>$l,'user_id'=>$sample['id']??0]);echo '<figure><figcaption>'.e(ms_langs()[$l]).' · <b>'.e($m['subject']).'</b></figcaption><iframe class="ms-history-preview" title="'.e('Лист подяки — '.ms_langs()[$l]).'" sandbox="allow-same-origin" srcdoc="'.e($m['html']).'"></iframe></figure>';}
  echo '</div>'.($sample?'<p class="muted">Приклад для «'.e($sample['name']).'» — з його (її) справжніми днями на сайті.</p>':'').'</details>';
  echo '<form method="post" action="'.e(ms_url(['view'=>'testers'])).'" data-testers data-confirm="Підготувати лист подяки для обраних тестувальників? Далі ви побачите лист і самі запустите надсилання.">'.$csrf.'<input type="hidden" name="do" value="thanks_prepare">';
  echo '<div class="ms-selection"><button type="button" class="btn sm" data-pick="top">🏅 Топ-10 активних</button><button type="button" class="btn sm" data-pick="all">Усіх, кому можна (до 50)</button><button type="button" class="btn sm" data-pick="none">Зняти вибір</button><b data-picked aria-live="polite">Обрано: '.$topN.'</b></div>';
  echo '<div class="ms-table-scroll"><table class="ms-table ms-testers"><thead><tr><th><span class="ms-sr">Обрати</span></th><th>#</th><th>Тестувальник</th><th>Остання активність</th><th>Днів на сайті</th><th>Активний час</th><th>Подяка</th><th>Лист</th></tr></thead><tbody>';
  foreach($rows as $i=>$r){
    $cls=trim(($r['top']?'is-top ':'').($r['why']?'is-off':''));
    echo '<tr'.($cls?' class="'.$cls.'"':'').' data-top="'.($r['top']?1:0).'">'
      .'<td><input type="checkbox" name="u[]" value="'.(int)$r['id'].'" aria-label="'.e('Обрати '.($r['name']?:$r['email'])).'"'.($r['top']?' checked':'').($r['why']?' disabled':'').'></td>'
      .'<td class="ms-rank">'.($r['top']?'🏅 '.$r['top']:'<span class="muted">'.($i+1).'</span>').'</td>'
      .'<td><a href="admin.php?p=user&amp;id='.(int)$r['id'].'"><b>'.e($r['name']?:'Без імені').'</b></a> '.($r['app']?'<span class="ms-tag" title="Сесій із застосунку Android: '.$r['app'].'">📱 застосунок</span> ':'').($r['src']==='list'?'<span class="ms-tag" title="Є в списку тестувальників Google Play">📋 список</span>':'').'<small>'.e($r['email']).' · '.e(strtoupper($r['lang'])).'</small></td>'
      .'<td>'.$ago($r['last']).'</td>'
      .'<td><b>'.$r['days'].'</b> <small class="muted">'.$r['n30'].' за 30 дн.</small></td>'
      .'<td>'.e($time($r['sec'])).'</td>'
      .'<td>'.($r['thanked']?'✅ '.e(date('d.m.Y',$r['thanked'])):'<span class="muted">ще ні</span>').'</td>'
      .'<td>'.($r['why']?'<span class="ms-error">'.e($r['why']).'</span>':'✉️ можна').'</td></tr>';
  }
  echo '</tbody></table></div>'.(!$rows?'<p class="ms-empty">Тестувальників з акаунтами ще немає. Додайте пошти зі списку Google Play нижче.</p>':'')
    .'<div class="ms-save-bar"><span>Наступний крок — перевірка листа та списку одержувачів. Нічого не надсилається, доки ви не натиснете «Надіслати».</span><button class="btn pri" data-picked-btn'.($okN?'':' disabled').'>🙏 Підготувати лист подяки ('.$topN.')</button></div></form>';
  if($T['missing'])echo '<details class="ms-panel"><summary>Без акаунта на сайті: '.count($T['missing']).'</summary><p class="muted">Ці люди є в списку тестувальників, але не зареєструвалися на сайті з цією поштою, тож розсилка їм лист не надішле.</p><p class="ms-mono">'.implode('<br>',array_map('e',$T['missing'])).'</p></details>';
  $list=ms_tester_emails();
  echo '<details class="ms-panel"'.($list?'':' open').'><summary>✏️ Список тестувальників Google Play ('.count($list).')</summary><form method="post" action="'.e(ms_url(['view'=>'testers'])).'">'.$csrf.'<input type="hidden" name="do" value="testers_save"><label class="f">Пошти — по одній у рядку (можна вставити CSV із Google Play Console)<textarea name="emails" rows="8" spellcheck="false">'.e(implode("\n",$list)).'</textarea></label><div class="ms-actions"><button class="btn pri" type="submit">Зберегти список</button></div></form></details>';
  echo '<script nonce="'.e($nonce).'">(()=>{const f=document.querySelector("[data-testers]");if(!f)return;const boxes=[...f.querySelectorAll("input[name=\'u[]\']:not(:disabled)")],out=f.querySelector("[data-picked]"),btn=f.querySelector("[data-picked-btn]");'
    .'const upd=()=>{const n=boxes.filter(b=>b.checked).length;out.textContent="Обрано: "+n+(n>50?" — не більше 50":"");btn.disabled=!n||n>50;btn.textContent="🙏 Підготувати лист подяки ("+n+")";};'
    .'f.addEventListener("change",upd);f.querySelectorAll("[data-pick]").forEach(b=>b.addEventListener("click",()=>{const m=b.dataset.pick;let k=0;boxes.forEach(x=>{x.checked=m==="top"?x.closest("tr").dataset.top==="1":m==="all"?k++<50:false;});upd();}));upd();})();</script>';
}
if($msView==='bounces'){
  /* 📭 Відмови: адреси, на які лист не доходить, і непідтверджені акаунти. Тверда відмова (адреси
     не існує) вимикає листи автоматично; видаляє акаунти лише адміністратор — кнопкою з підтвердженням. */
  bnc_install();
  $last=json_decode(meta_get('ms.bounce.last'),true);
  if(isset($_GET['scan'])&&is_array($last))echo '<div class="msg ok" role="status">📥 Скриньку перевірено: листів-відмов '.(int)$last['s'].' · адрес знайдено '.(int)$last['f'].' · листи вимкнено '.(int)$last['o'].'.</div>';
  if(isset($_GET['found']))echo '<div class="msg '.((int)$_GET['found']?'ok':'warn').'" role="status">'.((int)$_GET['found']?'Знайдено адрес: '.(int)$_GET['found'].' · листи вимкнено: '.(int)($_GET['off']??0).'.':'У тексті не знайдено адреси з помилкою доставки. Вставте повний текст листа-відмови (з рядками Final-Recipient і Status).').'</div>';
  if(isset($_GET['deleted']))echo '<div class="msg ok" role="status">🗑 Видалено акаунтів: '.(int)$_GET['deleted'].'.</div>';
  $confirm='<label class="f ms-confirm">Щоб підтвердити, напишіть <b>ВИДАЛИТИ</b><input name="confirm" required pattern="ВИДАЛИТИ" autocomplete="off"></label>';
  echo '<div class="ms-section-heading"><div><h2>📭 Відмови й непідтверджені акаунти</h2><p class="muted">Коли адреси не існує, пошта одержувача повертає лист-відмову (статус 5.1.1) у вашу скриньку. Тверда відмова — адреси немає, скриньку вимкнено — одразу вимикає листи цій адресі, щоб не псувати репутацію відправника. Видаляти акаунти — лише вашою кнопкою: масові дії не чіпають команду, тестувальників і тих, хто хоч раз входив.</p></div></div>';
  echo '<div class="ms-bnc-grid"><section class="ms-panel"><h3>📥 Перевірити скриньку</h3><p class="muted">Читаємо листи-відмови за 60 днів зі скриньки, з якої йдуть розсилки. Лише читання: нічого не видаляємо й не позначаємо прочитаним.</p>'
    .(is_array($last)?'<p class="muted">Востаннє: '.e(ms_when($last['at'])).'</p>':'')
    .(function_exists('imap_open')?'<form method="post" action="'.e(ms_url(['view'=>'bounces'])).'">'.$csrf.'<input type="hidden" name="do" value="bounce_imap"><button class="btn pri" type="submit">📥 Перевірити відмови</button></form>':'<p class="msg warn">На сервері немає розширення PHP IMAP — вставте текст відмови праворуч.</p>')
    .'</section><section class="ms-panel"><h3>📋 Вставити текст відмови</h3><form method="post" action="'.e(ms_url(['view'=>'bounces'])).'">'.$csrf.'<input type="hidden" name="do" value="bounce_paste"><label class="f">Текст листа «Undelivered Mail Returned to Sender»<textarea name="text" rows="5" required spellcheck="false" placeholder="&lt;name@gmail.com&gt;: host … said: 550-5.1.1 … Status: 5.1.1"></textarea></label><button class="btn" type="submit">Розібрати й вимкнути листи</button></form></section></div>';

  $rows=bnc_list();
  $canB=fn($r)=>$r['uid']&&(int)$r['hard']===1&&empty($r['last_login'])&&!bnc_protected($r);
  $purgeB=array_filter($rows,$canB);
  echo '<section class="ms-panel"><h3>📭 Адреси з відмовами ('.count($rows).')</h3>';
  if(!$rows)echo '<p class="muted">Відмов поки немає. 🎉</p>';
  else {
    echo '<div class="ms-table-scroll"><table class="ms-table"><thead><tr><th>Адреса</th><th>Акаунт</th><th>Причина</th><th>Коли</th><th>Листи</th><th></th></tr></thead><tbody>';
    foreach($rows as $r){
      $acc=$r['uid']?'<a href="admin.php?p=user&amp;id='.(int)$r['uid'].'"><b>'.e($r['name']).'</b></a><small>'.e(strtoupper((string)$r['lang'])).' · створено '.e(ms_when($r['created_at'])).' · '.($r['last_login']?'входив(ла) '.e(ms_when($r['last_login'])):'жодного разу не входив(ла)').'</small>':'<span class="muted">акаунта немає</span>';
      $act='';
      if($canB($r))$act.='<form method="post" action="'.e(ms_url(['view'=>'bounces'])).'" class="ms-inline" data-confirm="'.e('Видалити акаунт «'.$r['name'].'» ('.$r['email'].') разом із прогресом? Це не можна скасувати.').'">'.$csrf.'<input type="hidden" name="do" value="bounce_delete"><input type="hidden" name="id" value="'.(int)$r['uid'].'"><button class="btn sm" type="submit">🗑 Видалити акаунт</button></form> ';
      $act.='<form method="post" action="'.e(ms_url(['view'=>'bounces'])).'" class="ms-inline">'.$csrf.'<input type="hidden" name="do" value="bounce_forget"><input type="hidden" name="email" value="'.e($r['email']).'"><button class="btn sm" type="submit" title="Прибрати зі списку відмов і знову надсилати листи">↩ Повернути листи</button></form>';
      echo '<tr><td><b>'.e($r['email']).'</b><small>'.((int)$r['n']>1?(int)$r['n'].' відмови · ':'').($r['source']==='imap'?'зі скриньки':'вставлено вручну').'</small></td><td>'.$acc.'</td><td>'.e($r['reason']).' <small class="muted">'.e($r['code']).'</small></td><td>'.e(ms_when($r['at'])).'</td>'
        .'<td>'.(!$r['uid']?'—':((int)$r['mail_ok']===1?'<span class="ms-badge ms-sending">ще йдуть</span>':'<span class="ms-badge ms-sent">вимкнено</span>')).'</td><td>'.$act.'</td></tr>';
    }
    echo '</tbody></table></div>';
    if($purgeB)echo '<form method="post" action="'.e(ms_url(['view'=>'bounces'])).'" class="ms-purge" data-confirm="'.e('Видалити '.count($purgeB).' акаунтів з відмовою, які жодного разу не входили? Це не можна скасувати.').'">'.$csrf.'<input type="hidden" name="do" value="purge_bounced">'.$confirm.'<button class="btn" type="submit">🗑 Видалити акаунти з відмовою, які не входили ('.count($purgeB).')</button></form>';
  }
  echo '</section>';

  $un=bnc_unverified();
  $purgeU=array_filter($un,'bnc_can_purge');
  echo '<section class="ms-panel"><h3>✉️ Непідтверджені акаунти ('.count($un).')</h3><p class="muted">Пошту не підтвердили — листи їм не йдуть. До видалення пропонуємо лише тих, хто зареєструвався понад 3 дні тому й жодного разу не входив; команда й тестувальники захищені.</p>';
  if(!$un)echo '<p class="muted">Таких немає. 🎉</p>';
  else {
    echo '<div class="ms-table-scroll ms-audience-scroll"><table class="ms-table"><thead><tr><th>Акаунт</th><th>Створено</th><th>Входив(ла)</th><th>Стан</th></tr></thead><tbody>';
    foreach($un as $u){
      $st=bnc_protected($u)?'🛡 команда чи тестувальник':(!empty($u['last_login'])?'🔓 входив(ла) — лише вручну в картці':((int)$u['created_at']>=time()-3*86400?'⏳ ще чекаємо підтвердження':'🗑 можна видалити'));
      echo '<tr><td><a href="admin.php?p=user&amp;id='.(int)$u['id'].'"><b>'.e($u['name']).'</b></a><small>'.e($u['email']).' · '.e(strtoupper((string)$u['lang'])).'</small></td><td>'.e(ms_when($u['created_at'])).'</td><td>'.($u['last_login']?e(ms_when($u['last_login'])):'ні').'</td><td>'.e($st).'</td></tr>';
    }
    echo '</tbody></table></div>';
    if($purgeU)echo '<form method="post" action="'.e(ms_url(['view'=>'bounces'])).'" class="ms-purge" data-confirm="'.e('Видалити '.count($purgeU).' непідтверджених акаунтів, які жодного разу не входили? Це не можна скасувати.').'">'.$csrf.'<input type="hidden" name="do" value="purge_unverified">'.$confirm.'<button class="btn" type="submit">🗑 Видалити непідтверджені, які не входили ('.count($purgeU).')</button></form>';
  }
  echo '<p class="muted">Перед масовим видаленням можна зберегти резервну копію бази: <a href="admin.php?p=system">⚙️ Налаштування → Система → ⬇️ .sql</a>.</p></section>';
}
if($msView==='compose'){
  $templates=ms_templates();$tid=max(0,(int)($_GET['template']??$msPost['template_id']??0));$id=max(0,(int)($_GET['edit']??$msPost['id']??0));$copy=max(0,(int)($_GET['copy']??0));
  $data=json_decode($templates[0]['content']??'{}',true);if(!$data){$examples=ms_examples();$data=reset($examples);}
  if($tid){$found=one('SELECT * FROM kl_mail_templates WHERE id=? AND active=1',[$tid]);if(!$found)throw new InvalidArgumentException('Шаблон не знайдено.');$data=json_decode($found['content'],true);}
  $selected=[];$title=$data['name'];$key=bin2hex(random_bytes(16));
  if($id||$copy){$c=ms_campaign($id?:$copy);if($id&&$c['status']!=='draft')throw new InvalidArgumentException('Цю кампанію вже запущено. Створіть копію.');$data=json_decode($c['content'],true);$title=$c['title'].($copy?' — копія':'');if($id){$key=$c['request_key'];$selected=array_map(fn($r)=>(int)$r['user_id'],ms_recipients($id));}}
  if($msPost){$data=(array)($msPost['content']??$data);$title=(string)($msPost['title']??$title);$key=(string)($msPost['request_key']??$key);$selected=array_map('intval',(array)($msPost['u']??[]));}
  echo '<form method="post" action="'.e(ms_url(['view'=>'compose'])).'" id="ms-compose">'.$csrf.'<input type="hidden" name="id" value="'.$id.'"><input type="hidden" name="template_id" value="'.$tid.'"><input type="hidden" name="request_key" value="'.e($key).'">';
  echo '<div class="ms-editor-grid"><div class="ms-editor"><h2>'.($id?'Редагувати чернетку':'Створити лист').'</h2><label class="f">Назва кампанії <small>Лише для вас</small><input required maxlength="120" name="title" value="'.e($title).'"></label><div class="cols2"><label class="f">Назва шаблону<input required maxlength="120" name="content[name]" value="'.e($data['name']).'"></label><label class="f">Мова листа<select name="content[lang]">'.ms_options(ms_langs(),$data['lang']).'</select></label></div><p class="muted">Обрана мова стосується цього тексту. Щоб надіслати іншою мовою, оберіть відповідний шаблон або перекладіть текст.</p>';
  foreach(['subject'=>['Тема листа',160],'preheader'=>['Короткий опис у поштовій скриньці',180],'heading'=>['Заголовок у листі',160]] as $field=>[$label,$max])echo '<label class="f">'.e($label).'<input '.($field!=='preheader'?'required ':'').'maxlength="'.$max.'" name="content['.$field.']" value="'.e($data[$field]??'').'"></label>';
  echo '<label class="f">Текст листа<textarea required rows="10" maxlength="10000" name="content[body]">'.e($data['body']).'</textarea></label><p class="ms-hint">Персоналізація: <code>{{name}}</code> — ім’я, <code>{{email}}</code> — пошта. Текст без HTML; абзаци зберігаються.</p><div class="cols2"><label class="f">Підпис кнопки<input maxlength="60" name="content[button]" value="'.e($data['button']).'"></label><label class="f">Посилання кнопки<input type="url" maxlength="1000" name="content[url]" value="'.e($data['url']).'" placeholder="https://…"></label></div><label class="f">Підпис листа<textarea rows="2" maxlength="500" name="content[footer]">'.e($data['footer']).'</textarea></label><input type="hidden" name="content[apps]" value="0"><label class="ms-check"><input type="checkbox" name="content[apps]" value="1"'.((!isset($data['apps'])||(string)$data['apps']!=='0')?' checked':'').'> 📲 Додати внизу значки застосунку: Google Play, Microsoft Store, «iPhone — незабаром»</label>'.(!empty($data['thanks'])?'<input type="hidden" name="content[thanks]" value="0"><label class="ms-check"><input type="checkbox" name="content[thanks]" value="1" checked> 🙏 Подяка тестувальникам: текст складається автоматично мовою кожного одержувача, з його днями на сайті. Зніміть, щоб надіслати власний текст із полів вище.</label>':'').'<fieldset class="ms-photo-field"><legend>🖼 Фото чи скриншот у листі</legend>'.ms_photo_widget('compose',(string)($data['image']??''),(string)($data['image_caption']??'')).'</fieldset>'.'<div class="ms-actions"><button class="btn" name="do" value="template_new">Зберегти новий шаблон</button>'.($tid?'<button class="btn" name="do" value="template_save">Оновити цей шаблон</button>':'').'</div></div>';
  echo '<aside class="ms-preview"><div class="ms-preview-toolbar"><h2>Попередній перегляд</h2><div role="group" aria-label="Ширина перегляду"><button class="btn sm" type="button" data-preview-size="wide" aria-pressed="true">Комп’ютер</button><button class="btn sm" type="button" data-preview-size="phone" aria-pressed="false">Телефон</button></div></div><p class="ms-preview-subject" data-preview-subject></p><p data-preview-error class="msg err" hidden role="alert"></p><iframe title="Попередній перегляд листа" sandbox="allow-same-origin" referrerpolicy="no-referrer" data-preview-frame></iframe><p class="muted">Приклад для Олени. Ім’я та посилання відписки підставляються для кожного одержувача.</p></aside></div>';
  echo '<section class="ms-panel"><h2>Кому надіслати</h2><p class="muted">Лише підтверджені користувачі без блокування й відписки. Зміна фільтра не скасовує вже обраних адресатів.</p>';
  ms_audience_table(ms_audience(),$selected,true);
  echo '</section><div class="ms-save-bar"><span>Наступний крок — перевірка листа та списку одержувачів.</span><button class="btn pri" name="do" value="draft">Зберегти чернетку й перевірити</button></div></form>';
}
if($msView==='recipients'){
  $aud=ms_audience();echo '<h2>Одержувачі</h2><p class="muted">'.count($aud).' користувачів можуть отримувати розсилки. Час відображено для Europe/Berlin. «Останній лист» — остання успішна передача поштовому серверу.</p>';
  ms_audience_table($aud);
}
if($msView==='campaign'){
  $id=max(0,(int)($_GET['id']??$_POST['id']??0));$c=ms_campaign($id);$data=json_decode($c['content'],true);$rows=ms_recipients($id);$n=ms_counts($id);
  echo '<div class="ms-section-heading"><div><p class="muted">Кампанія № '.$id.' · '.e(ms_when($c['created_at'])).'</p><h2>'.e($c['title']).'</h2>'.ms_badge($c['status']).'</div><div class="ms-actions">'.($c['status']==='draft'?'<a class="btn" href="'.e(ms_url(['view'=>'compose','edit'=>$id])).'">Редагувати</a>':'').'<a class="btn" href="'.e(ms_url(['view'=>'compose','copy'=>$id])).'">Створити копію</a></div></div>';
  echo '<div class="ms-metrics">';foreach(['queued'=>'У черзі','sent'=>'Прийнято сервером','failed'=>'Помилки','skipped'=>'Пропущено','sending'=>'Потребує перевірки'] as $st=>$label)echo '<div><b data-count="'.$st.'">'.$n[$st].'</b><span>'.e($label).'</span></div>';echo '</div>';
  if($n['sending'])echo '<div class="msg warn">Є незавершена спроба: лист може вже бути прийнятий поштовим сервером. Перевірте журнал сервера перед повторною кампанією. Автоматично такий лист не повторюється.</div>';
  if(!$rows)echo '<div class="msg warn">У чернетці немає одержувачів. Додайте їх у редакторі.</div>';
  $different=count(array_filter($rows,fn($r)=>$r['lang']!==$data['lang']));
  if(!empty($data['update_id'])||!empty($data['thanks'])){$different=0;echo '<div class="msg ok">🌍 Текст складається окремо для кожного одержувача — його мовою'.(!empty($data['thanks'])?', з його днями на сайті':'').'. Відкрийте «Історію листа» біля людини після надсилання, щоб побачити саме її лист.</div>';}
  if($different)echo '<div class="msg warn">Мова листа: '.e(ms_langs()[$data['lang']]).'. У '.$different.' обраних користувачів інша мова профілю. Перевірте, що цей текст їм підходить.</div>';
  if($c['status']==='draft'){
    // 🖼 фото чи скриншот у тексті листа — додається перед надсиланням
    $img=(string)($data['image']??'');$has=$img!==''&&ms_img_ok($img);$cap=(string)($data['image_caption']??'');
    echo '<div class="ms-panel ms-photo" id="ms-photo"><h3>🖼 Фото в листі</h3><p class="muted">Скриншот чи світлина з’явиться прямо в тексті листа — після основного тексту, перед кнопкою. Це не вкладення: картинка зберігається на сайті, а лист її показує; клік по ній відкриває повний розмір. Метадані (EXIF, геомітки) прибираються, ширина — до 1200 px.</p>'
      .'<form method="post" enctype="multipart/form-data" action="'.e(ms_url(['view'=>'campaign','id'=>$id])).'#ms-photo">'.$csrf.'<input type="hidden" name="do" value="campaign_image"><input type="hidden" name="id" value="'.$id.'"><input type="hidden" name="image_name" value="" data-photo-value>'
      .ms_photo_widget('campaign',$img,$cap)
      .'<label class="f">Підпис під фото <small>Необов’язково · однаковий для всіх мов</small><input name="caption" maxlength="200" value="'.e($cap).'" placeholder="Напр.: 📊 Огляд сайту за 30 днів"></label>'
      .'<div class="ms-actions"><button class="btn pri" type="submit">'.($has?'💾 Зберегти підпис':'⬆️ Додати фото до листа').'</button>'.($has?'<button class="btn" type="submit" name="remove" value="1" formnovalidate>🗑 Прибрати фото</button>':'').'</div></form></div>';
  }
  echo '<div class="ms-panel"><h3>Перед відправленням</h3><p><b>Тема:</b> '.e($data['subject']).'</p><p><b>Одержувачів:</b> '.count($rows).' · <b>Мова:</b> '.(!empty($data['update_id'])||!empty($data['thanks'])?'кожному своєю':e(ms_langs()[$data['lang']])).'</p><p class="muted">Черга працює, поки ця сторінка відкрита. Якщо закрити вкладку, решту можна продовжити пізніше. Пауза діє після поточного листа.</p><div class="ms-actions">';
  if($n['queued'])echo '<form method="post" action="'.e(ms_url(['view'=>'campaign','id'=>$id])).'" data-run-mail>'.$csrf.'<input type="hidden" name="do" value="start"><input type="hidden" name="id" value="'.$id.'"><button class="btn pri" type="submit">'.($c['status']==='draft'?'Надіслати':'Продовжити відправлення').' ('.$n['queued'].')</button></form><button type="button" class="btn" data-pause-mail hidden>Призупинити</button>';
  if($n['failed'])echo ms_action('retry',$id,'Повернути помилки в чергу','','Повторити лише листи, які поштовий сервер не прийняв? Успішні спроби не повторяться.');
  echo '</div><p data-run-status aria-live="polite" class="ms-run-status"></p></div>';
  $mail=ms_render($data,$rows[0]??['name'=>'Олена','email'=>'olena@example.test']);
  echo '<details class="ms-panel"'.(isset($_GET['img'])?' open':'').'><summary>Переглянути лист цієї кампанії</summary><iframe class="ms-history-preview" title="Лист кампанії" sandbox="allow-same-origin" srcdoc="'.e($mail['html']).'"></iframe></details>';
  echo '<h3>Список одержувачів</h3><div class="ms-table-scroll"><table class="ms-table"><thead><tr><th>Кому</th><th>Стан</th><th>Оновлено</th><th>Подробиці</th></tr></thead><tbody>';
  foreach($rows as $r)echo '<tr><td><b>'.e($r['name']).'</b><small>'.e($r['email']).'</small></td><td>'.ms_badge($r['status']).'</td><td>'.e(ms_when($r['updated_at'])).'</td><td><a href="'.e(ms_url(['view'=>'campaign','id'=>$id,'recipient'=>$r['id']])).'#ms-attempts">Історія листа</a>'.($r['error']?'<small class="ms-error">'.e($r['error']).'</small>':'').'</td></tr>';
  echo '</tbody></table></div>';
  $rid=max(0,(int)($_GET['recipient']??0));
  if($rid){$r=one('SELECT * FROM kl_mail_recipients WHERE id=? AND campaign_id=?',[$rid,$id]);if(!$r)throw new InvalidArgumentException('Одержувача немає в цій кампанії.');echo '<section id="ms-attempts" class="ms-panel"><h3>Історія листа: '.e($r['email']).'</h3>';$attempts=ms_attempts($rid);if(!$attempts)echo '<p>Спроб надсилання ще немає.</p>';foreach($attempts as $a)echo '<details class="ms-attempt"><summary>'.e(ms_when($a['created_at'])).' — '.e($a['subject']).' '.ms_badge($a['status']).'</summary>'.($a['error']?'<p class="ms-error">'.e($a['error']).'</p>':'').'<p class="muted">Збережена копія саме цієї спроби.</p><iframe class="ms-history-preview" title="Збережений надісланий лист" sandbox="allow-same-origin" srcdoc="'.e($a['html']).'"></iframe><details><summary>Текстова версія</summary><pre class="ms-text">'.e($a['body']).'</pre></details></details>';echo '</section>';}
}
if($msView==='history'){
  $legacy=($_GET['source']??'')==='legacy';
  echo '<div class="ms-section-heading"><div><h2>Журнал листів</h2><p class="muted">«Прийнято сервером» не означає доставку або прочитання. Час: Europe/Berlin.</p></div><a class="btn" href="'.e(ms_url(['view'=>'history','source'=>$legacy?'studio':'legacy'])).'">'.($legacy?'Нові кампанії':'Попередні розсилки').'</a></div>';
  $search=trim((string)($_GET['q']??''));$status=(string)($_GET['status']??'');$from=(string)($_GET['from']??'');$to=(string)($_GET['to']??'');$w=[];$a=[];
  echo '<form method="get" class="ms-toolbar"><input type="hidden" name="p" value="mail"><input type="hidden" name="view" value="history"><input type="hidden" name="source" value="'.($legacy?'legacy':'studio').'"><label class="f">Пошук<input type="search" name="q" value="'.e($search).'" placeholder="Email, ім’я'.($legacy?'':' або кампанія').'"></label><label class="f">Статус<select name="status">'.ms_options([''=>'Усі','sent'=>'Прийнято сервером','failed'=>'Помилки']+($legacy?[]:['queued'=>'У черзі','sending'=>'Потребує перевірки','skipped'=>'Пропущено']),$status).'</select></label><label class="f">Від<input type="date" name="from" value="'.e($from).'"></label><label class="f">До<input type="date" name="to" value="'.e($to).'"></label><button class="btn" type="submit">Застосувати</button><a class="btn" href="'.e(ms_url(['view'=>'history','source'=>$legacy?'legacy':'studio'])).'">Скинути</a></form>';
  $timeCol=$legacy?'m.sent_at':'r.updated_at';
  foreach([[$from,'>='],[$to,'<']] as [$date,$op])if($date!==''){$dt=DateTimeImmutable::createFromFormat('!Y-m-d',$date,new DateTimeZone('Europe/Berlin'));if(!$dt||$dt->format('Y-m-d')!==$date)throw new InvalidArgumentException('Вкажіть коректні дати фільтра.');if($op==='<')$dt=$dt->modify('+1 day');$w[]=$timeCol.$op.'?';$a[]=$dt->getTimestamp();}
  if($legacy){
    $w[]="m.kind<>'studio'";
    if($search!==''){$w[]='(u.email LIKE ? OR u.name LIKE ?)';array_push($a,'%'.$search.'%','%'.$search.'%');}
    if(in_array($status,['sent','failed'],true)){$w[]='m.ok=?';$a[]=$status==='sent'?1:0;}
    $base=' FROM kl_mailouts m LEFT JOIN kl_users u ON u.id=m.user_id';$fields='m.*,u.name,u.email';$order='m.id';
    echo '<p class="msg warn">Старий журнал зберіг лише тип листа та результат. Точний текст попередніх листів відновити неможливо.</p>';
  }else{
    if($search!==''){$w[]='(r.email LIKE ? OR r.name LIKE ? OR c.title LIKE ?)';array_push($a,'%'.$search.'%','%'.$search.'%','%'.$search.'%');}
    if(in_array($status,['queued','sending','sent','failed','skipped'],true)){$w[]='r.status=?';$a[]=$status;}
    $base=' FROM kl_mail_recipients r JOIN kl_mail_campaigns c ON c.id=r.campaign_id';$fields='r.*,c.title';$order='r.updated_at';
  }
  $where=$w?' WHERE '.implode(' AND ',$w):'';$total=(int)one('SELECT COUNT(*) AS n'.$base.$where,$a)['n'];$page=max(1,(int)($_GET['page']??1));
  $rows=q('SELECT '.$fields.$base.$where.' ORDER BY '.$order.' DESC LIMIT 30 OFFSET '.(($page-1)*30),$a)->fetchAll();
  echo '<p class="muted">Знайдено: '.$total.'</p><div class="ms-table-scroll"><table class="ms-table"><thead><tr><th>Коли</th><th>Кому</th><th>Що надіслано</th><th>Результат</th></tr></thead><tbody>';
  foreach($rows as $r){$st=$legacy?($r['ok']?'sent':'failed'):$r['status'];echo '<tr><td>'.e(ms_when($legacy?$r['sent_at']:$r['updated_at'])).'</td><td><b>'.e($r['name']??'Користувача видалено').'</b><small>'.e($r['email']??'Адресу не збережено').'</small></td><td>'.($legacy?e(['back'=>'Нагадування','news'=>'Новини','comic'=>'Комікс','testing'=>'Тестування застосунку'][$r['kind']]??$r['kind']):'<a href="'.e(ms_url(['view'=>'campaign','id'=>$r['campaign_id'],'recipient'=>$r['id']])).'#ms-attempts">'.e($r['title']).'</a>').'</td><td>'.ms_badge($st).'</td></tr>';}
  echo '</tbody></table></div>';if(!$rows)echo '<p class="ms-empty">Листів за цими умовами немає.</p>';ms_pager($page,$total,30);
}
} catch(InvalidArgumentException $e){echo '<div class="msg err" role="alert">'.e($e->getMessage()).'</div><a class="btn" href="'.e(ms_url()).'">До кампаній</a>';}
function ms_pager(int $page,int $total,int $size): void {
  $pages=max(1,(int)ceil($total/$size));if($pages<2)return;
  $args=array_intersect_key($_GET,array_flip(['view','source','q','status','from','to']));
  echo '<nav class="ms-pagination" aria-label="Сторінки журналу">';
  if($page>1)echo '<a class="btn" href="'.e(ms_url($args+['page'=>$page-1])).'">Попередня</a>';
  echo '<span>Сторінка '.$page.' із '.$pages.'</span>';
  if($page<$pages)echo '<a class="btn" href="'.e(ms_url($args+['page'=>$page+1])).'">Наступна</a>';
  echo '</nav>';
}
?>
</section>
<script nonce="<?=e($nonce)?>" src="assets/mail-studio.js?v=20261024-5"></script>
