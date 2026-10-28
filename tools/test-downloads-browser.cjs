const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const file=path.resolve(__dirname,'../app/android/tools/smoke.cjs');
let source=fs.readFileSync(file,'utf8')
 .replace("path.resolve(__dirname,'../app/src/main/assets/public')",JSON.stringify(path.resolve(__dirname,'..')))
 .replace("path.resolve(__dirname,'../release/screenshots')",JSON.stringify(path.resolve(__dirname,'downloads-qa')))
 .replace("assert.equal(await evaluate('COMICS.length'),89);",'')
 .replace("for(const [name,route]", `
 for(const width of [375,1280]) {
  await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});
  for(const route of ['#/','#/install']) {
   await evaluate('location.hash='+JSON.stringify(route));await wait(700);
   const links=await evaluate("Array.from(document.querySelectorAll('.download-store')).map(a=>({tag:a.tagName,href:a.href||''}))");
   assert.deepEqual(links,[{tag:'BUTTON',href:''},{tag:'A',href:'https://apps.microsoft.com/detail/9MZTK7VJZ37D'}]);
   const androidStyle=await evaluate("(()=>{const e=document.querySelector('.download-store.android-test-trigger'),s=getComputedStyle(e);return{color:s.color,background:s.backgroundColor,text:e.innerText.trim()}})()");
   assert.match(androidStyle.text,/Android[\\s\\S]*Google Play/,'Android card keeps its visible label');
   assert.equal(androidStyle.color,'rgb(255, 255, 255)','Android card text stays white on the dark store button');
   assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'Responsive download cards');
   assert.equal(await evaluate("document.querySelectorAll('.download-coming a').length"),0,'No fake iPhone store link');
   if(route==='#/install'){const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(out,'downloads-'+width+'.png'),Buffer.from(shot.data,'base64'));}
  }
 }
 console.log('PASS: guest home and download page, mobile/desktop, both store links');
 for(const [name,route]`);
const mod=new Module(file);mod.filename=file;mod.paths=module.paths;mod._compile(source,file);
