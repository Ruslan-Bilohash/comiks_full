/* Scoped admin UI. Merely opening a page never starts delivery. */
(() => {
  'use strict';
  const root=document.querySelector('[data-mail-studio]'); if(!root)return;
  async function post(data) {
    const response=await fetch('admin.php?p=mail',{method:'POST',body:data,credentials:'same-origin',headers:{'X-Mail-Studio':'1'},signal:AbortSignal.timeout(65000)});
    const json=await response.json();if(!response.ok||!json.ok)throw new Error(json.error||'Не вдалося завершити дію.');return json;
  }
  for(const audience of root.querySelectorAll('[data-audience]')){
    const rows=[...audience.querySelectorAll('[data-person]')],filters=[...audience.querySelectorAll('[data-filter]')];
    const boxes=[...audience.querySelectorAll('input[name="u[]"]')];
    function paint(){
      const values=Object.fromEntries(filters.map(el=>[el.dataset.filter,el.value.trim().toLowerCase()]));
      const cutoff=Date.now()/1000-7*86400;
      for(const row of rows){const d=row.dataset;row.hidden=!!((values.q&&!d.q.includes(values.q))||(values.lang&&d.lang!==values.lang)||(values.idle&&Number(d.idle)<Number(values.idle))||(values.role&&d[values.role]!=='1')||(values.sent==='never'&&Number(d.sent)>0)||(values.sent==='recent'&&Number(d.sent)<=cutoff)||(values.sent==='notrecent'&&Number(d.sent)>cutoff));}
      const visible=rows.filter(r=>!r.hidden).length;audience.querySelector('[data-visible]').textContent='Показано: '+visible+' із '+rows.length;audience.querySelector('[data-empty]').hidden=visible!==0;
      const selected=boxes.filter(b=>b.checked),out=audience.querySelector('[data-selected]');
      if(out){const hidden=selected.filter(b=>b.closest('tr').hidden).length;out.textContent='Обрано: '+selected.length+' / 50'+(hidden?' (поза фільтром: '+hidden+')':'');out.classList.toggle('ms-error',selected.length>50);}
    }
    filters.forEach(f=>f.addEventListener('input',paint));boxes.forEach(b=>b.addEventListener('change',paint));
    audience.querySelectorAll('[data-select]').forEach(button=>button.addEventListener('click',()=>{
      if(button.dataset.select==='none')boxes.forEach(b=>{b.checked=false;});
      else {let count=boxes.filter(b=>b.checked).length;for(const b of boxes)if(!b.checked&&!b.closest('tr').hidden&&count<50){b.checked=true;count++;}}
      paint();
    }));paint();
  }
  const compose=root.querySelector('#ms-compose');
  if(compose){
    let timer,version=0,dirty=false;const frame=root.querySelector('[data-preview-frame]'),error=root.querySelector('[data-preview-error]');
    async function preview(){const current=++version;const data=new FormData(compose);data.set('do','preview');try{const result=await post(data);if(current!==version)return;frame.srcdoc=result.html;root.querySelector('[data-preview-subject]').textContent='Тема: '+result.subject;error.hidden=true;}catch(e){if(current!==version)return;error.hidden=false;error.textContent=e.message;}}
    compose.addEventListener('input',event=>{dirty=true;if(event.target.name?.startsWith('content[')){clearTimeout(timer);timer=setTimeout(preview,450);}});
    compose.addEventListener('submit',event=>{if(event.submitter?.value==='draft'&&compose.querySelectorAll('input[name="u[]"]:checked').length>50){event.preventDefault();alert('Оберіть не більше 50 одержувачів.');return;}dirty=false;});
    window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
    root.querySelectorAll('[data-preview-size]').forEach(b=>b.addEventListener('click',()=>{frame.classList.toggle('ms-phone',b.dataset.previewSize==='phone');root.querySelectorAll('[data-preview-size]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
    preview();
  }
  const run=root.querySelector('[data-run-mail]');
  if(run){
    const pause=root.querySelector('[data-pause-mail]'),status=root.querySelector('[data-run-status]'),button=run.querySelector('button');let active=false,stop=false;
    const payload=action=>{const data=new FormData(run);data.set('do',action);return data;};
    function counts(result){for(const [key,n] of Object.entries(result.counts||{})){const el=root.querySelector('[data-count="'+key+'"]');if(el)el.textContent=n;}}
    pause.addEventListener('click',()=>{stop=true;pause.disabled=true;status.textContent='Завершуємо поточний лист і призупиняємо чергу…';});
    run.addEventListener('submit',async event=>{
      event.preventDefault();if(active)return;
      if(!confirm('Надіслати цю кампанію одержувачам у черзі? Перевірте тему, мову та список нижче.'))return;
      active=true;stop=false;button.disabled=true;pause.hidden=false;pause.disabled=false;
      root.querySelectorAll('.ms-actions a,.ms-actions form:not([data-run-mail]) button').forEach(el=>el.setAttribute('aria-disabled','true'));
      try{
        let result=await post(payload('start'));counts(result);
        while(!stop&&result.status==='running'&&result.counts.queued>0){status.textContent='Відправляємо листи. У черзі: '+result.counts.queued;result=await post(payload('step'));counts(result);if(result.busy){status.textContent='Цю кампанію вже обробляє інша вкладка. Зупинено тут.';break;}if(result.counts.queued>0&&!stop)await new Promise(r=>setTimeout(r,1500));}
        if(stop){await post(payload('pause'));status.textContent='Чергу призупинено.';}else if(!result.busy)status.textContent='Обробку завершено. Оновлюємо журнал…';
        setTimeout(()=>location.reload(),800);
      }catch(e){status.textContent=e.message+' Відкрийте кампанію повторно, щоб перевірити результат.';status.classList.add('ms-error');}
      finally {active=false;button.disabled=false;pause.hidden=true;}
    });
    window.addEventListener('beforeunload',event=>{if(active){event.preventDefault();event.returnValue='';}});
  }
})();

/* 🖼 Фото в листі: вставка скриншота (Ctrl+V), перетягування або вибір файлу → do=image_upload
   (сервер перекодовує й повертає адресу). У редакторі одразу оновлюється перегляд листа,
   у чернетці фото зберігається відразу. */
(() => {
  'use strict';
  const box=document.querySelector('[data-photo]'); if(!box)return;
  const mode=box.dataset.photo,form=box.closest('form'),val=form&&form.querySelector('[data-photo-value]');
  const now=box.querySelector('[data-photo-now]'),img=now.querySelector('img'),status=box.querySelector('[data-photo-status]');
  const file=box.querySelector('[data-photo-file]'),drop=box.querySelector('[data-photo-drop]');
  const csrf=(document.querySelector('input[name="csrf"]')||{}).value||'';
  const say=(t,err)=>{status.textContent=t;status.classList.toggle('ms-error',!!err);};
  async function send(f){
    if(!f||!/^image\/(png|jpe?g|webp|gif)$/.test(f.type)){say('Підходять PNG, JPG, WebP або GIF.',true);return;}
    if(f.size>8*1024*1024){say('Файл завеликий: до 8 МБ.',true);return;}
    say('⏳ Завантажуємо фото…');drop.classList.add('is-busy');
    try{
      const fd=new FormData();fd.set('csrf',csrf);fd.set('do','image_upload');fd.set('image',f,f.name||'screenshot.png');
      const r=await fetch(location.href.split('#')[0],{method:'POST',body:fd,credentials:'same-origin',headers:{'X-Mail-Studio':'1'}});
      const j=await r.json().catch(()=>({ok:false,error:'Сервер відповів незрозуміло. Оновіть сторінку й спробуйте ще раз.'}));
      if(!j.ok)throw new Error(j.error||'Не вдалося завантажити фото.');
      val.value=j.image;img.src=j.url;now.hidden=false;if(file)file.value='';
      if(mode==='campaign'){say('💾 Зберігаємо в чернетці…');form.submit();return;}
      say('✅ Фото додано — його видно в перегляді листа.');
      val.dispatchEvent(new Event('input',{bubbles:true}));
    }catch(e){say('⛔ '+e.message,true);}
    finally{drop.classList.remove('is-busy');}
  }
  if(file)file.addEventListener('change',()=>{if(file.files[0])send(file.files[0]);});
  drop.addEventListener('click',e=>{if(e.target===drop&&file)file.click();});
  drop.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&file){e.preventDefault();file.click();}});
  ['dragenter','dragover'].forEach(t=>drop.addEventListener(t,e=>{e.preventDefault();drop.classList.add('is-over');}));
  ['dragleave','drop'].forEach(t=>drop.addEventListener(t,()=>drop.classList.remove('is-over')));
  drop.addEventListener('drop',e=>{e.preventDefault();const f=[...((e.dataTransfer&&e.dataTransfer.files)||[])].find(x=>x.type.startsWith('image/'));if(f)send(f);});
  // скриншот із буфера: Win+Shift+S / PrtSc → Ctrl+V будь-де на сторінці
  document.addEventListener('paste',e=>{const f=[...((e.clipboardData&&e.clipboardData.files)||[])].find(x=>x.type.startsWith('image/'));if(!f)return;e.preventDefault();send(f);});
  const rm=box.querySelector('[data-photo-remove]');
  if(rm)rm.addEventListener('click',()=>{val.value='';now.hidden=true;img.removeAttribute('src');say('Фото прибрано.');val.dispatchEvent(new Event('input',{bubbles:true}));});
})();
