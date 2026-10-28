const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'../app/android/tools/smoke.cjs');
let source=fs.readFileSync(file,'utf8')
 .replace("path.resolve(__dirname,'../app/src/main/assets/public')",JSON.stringify(path.resolve(__dirname,'..')))
 .replace("path.resolve(__dirname,'../release/screenshots')",JSON.stringify(path.resolve(__dirname,'welcome-qa')))
 .replace("assert.equal(await evaluate('COMICS.length'),89);", `
  assert.equal(await evaluate('COMICS.length'),89);
  assert.equal(await evaluate("document.querySelectorAll('.modal select.welcome-language').length"),1,'Welcome language is a dropdown');
  for(const [width,height] of [[375,667],[320,568],[1280,800],[844,390]]) {
   await call('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<900});
   for(const lang of ['uk','no','en','lt','de','pl','tr','ar']) {
    await evaluate("(()=>{const s=document.querySelector('.welcome-language');s.value='"+lang+"';s.dispatchEvent(new Event('change',{bubbles:true}));})()");
    await wait(150);
    const fit=await evaluate("(()=>{const m=document.querySelector('.welcome-modal'),b=m.getBoundingClientRect();return {scroll:m.scrollHeight>m.clientHeight+1,inside:b.top>=0&&b.bottom<=innerHeight+1,disabled:m.querySelector('.welcome-go').disabled};})()");
    if(fit.scroll) {console.log(await evaluate("Array.from(document.querySelector('.welcome-modal').children).map(e=>({tag:e.tagName,cls:e.className,height:e.getBoundingClientRect().height}))"));const p=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'overflow.png'),Buffer.from(p.data,'base64'));}
    assert.equal(fit.scroll,false,'No welcome scroll '+width+'x'+height+' '+lang);
    assert.equal(fit.inside,true,'Welcome stays on screen '+lang);
    assert.equal(fit.disabled,true,'Consent required');
   }
  }
  await call('Emulation.setDeviceMetricsOverride',{width:375,height:667,deviceScaleFactor:1,mobile:true});
  await evaluate("(()=>{const s=document.querySelector('.welcome-language');s.value='uk';s.dispatchEvent(new Event('change',{bubbles:true}));})()");await wait(200);
  const welcomePNG=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'welcome.png'),Buffer.from(welcomePNG.data,'base64'));
  await evaluate("document.querySelector('.welcome-terms-button').click()");
  assert.ok(await evaluate("document.querySelector('.welcome-terms').textContent.length>500"),'Full terms accessible');
  await evaluate("document.querySelector('.welcome-terms-back').click()");
  await evaluate("document.querySelector('#agreeBox').click();document.querySelector('.welcome-go').click()");
  assert.equal(await evaluate("!!document.querySelector('.welcome-back')"),false,'Consent closes welcome');
  assert.equal(await evaluate("!!JSON.parse(localStorage.getItem('comiks.consent')).v"),true,'Consent saved');
  console.log('PASS: welcome dropdown, 32 language/viewport checks, terms and consent');
  await evaluate("location.hash='#/settings'");await wait(400);
  assert.equal(await evaluate("document.querySelectorAll('.strict-box,.call-settings').length"),0,'Guest does not see account-only settings');
  await evaluate("location.hash='#/'");await wait(400);
  assert.equal(await evaluate("document.querySelectorAll('.hero .ai-note').length"),0,'AI notice removed from hero');
  assert.equal(await evaluate("document.querySelectorAll('.norway-flag').length"),1,'Norwegian flag visible');
  assert.equal(await evaluate("document.querySelector('.play-store-banner').href"),'https://play.google.com/store/apps/details?id=com.bilohash.comiks','Correct Play listing');
  assert.equal(await evaluate("KOMIKS_UPDATES.some(x=>x.link==='#/games')"),false,'Fighting game announcement removed');
  await evaluate("location.hash='#/terms'");await wait(300);
  assert.ok(await evaluate("document.querySelector('.consent-stamp').textContent.includes('2026')"),'Real consent/version stamp');
  await evaluate("location.hash='#/'");await wait(300);
 `);
const mod=new Module(file);mod.filename=file;mod.paths=module.paths;mod._compile(source,file);
