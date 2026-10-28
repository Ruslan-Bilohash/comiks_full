const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync(require('path').join(__dirname,'../assets/auth.js'),'utf8');
class El {
  constructor(tag,attrs={},children=[]) {this.tag=tag;Object.assign(this,attrs);this.children=children.flat(Infinity).filter(x=>x!=null);this.events={};this.dataset={};this.style={};this.value=this.value||'';this.classList={toggle(){},add(){},remove(){}};}
  addEventListener(name,fn){this.events[name]=fn;}
  append(...nodes){this.children.push(...nodes.flat(Infinity).filter(x=>x!=null));}
  replaceChildren(...nodes){this.children=nodes;}
  focus(){} select(){}
}
const walk=n=>n instanceof El?[n,...n.children.flatMap(walk)]:[];
const tick=()=>new Promise(r=>setImmediate(r));
async function fixture({enabled=false,lang='en',magicOK=false}={}) {
  const calls=[],main=new El('main'),stored=new Map();
  const store={get:(k,d)=>stored.has(k)?stored.get(k):d,set:(k,v)=>stored.set(k,v),del:k=>stored.delete(k)};
  const core={ui:lang,h:(tag,attrs,...children)=>new El(tag,attrs,children),store,raw:store,currentUser:()=>null,setSession(){},route(){}};
  const context={window:{KomiksCore:core},document:{addEventListener(){},querySelector:()=>main,body:main},location:{protocol:'https:',hash:'#/login',assign(){}},navigator:{userAgent:'Fixture Browser'},sessionStorage:{getItem:()=>null,setItem(){},removeItem(){}},localStorage:{length:0,getItem:()=>null},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},console,
    fetch:async(url,opts)=>{const body=opts?.body?JSON.parse(opts.body):{};calls.push({url,body});let value={ok:true,auth:1,user:null};if(url.includes('google_status'))value={ok:true,enabled};if(body.action==='magic')value=magicOK?{ok:true}:{ok:false,error:'slow_down'};if(url.includes('google-start'))value={ok:false,error:'server'};if(body.action==='google_pending')value={ok:true,ticket:'a'.repeat(64)};return {ok:true,json:async()=>value};}};
  vm.runInNewContext(source,context);await tick();
  return {api:context.window.KomiksAuth,calls,core,main,context};
}
(async()=>{
  let f=await fixture();let page=f.api.render('login');await tick();
  assert.equal(walk(page).find(e=>e.class==='au-google').hidden,true,'unconfigured Google hidden');
  const form=walk(page).find(e=>e.tag==='form');walk(form).find(e=>e.type==='email').value='fixture@example.test';form.events.submit({preventDefault(){}});await tick();
  assert.match(walk(form).find(e=>e.class==='au-msg').textContent,/Too many/,'rate-limit error shown');
  assert.equal(walk(form).find(e=>e.class==='au-step2').hidden,true,'failed send does not open code success panel');
  f=await fixture({enabled:true});page=f.api.render('register');await tick();
  const google=walk(page).find(e=>e.class==='au-google');assert.equal(google.hidden,false,'configured Google shown');
  await walk(google).find(e=>e.tag==='button').events.click();
  assert.equal(f.calls.some(c=>c.url.includes('google-start')),false,'signup without consent does not start OAuth');
  const consent=walk(page).find(e=>e.type==='checkbox');consent.checked=true;
  await walk(google).find(e=>e.tag==='button').events.click();
  assert.equal(f.calls.find(c=>c.url.includes('google-start')).body.consent,true,'explicit signup consent submitted');
  f=await fixture();f.context.location.hash='#/login/google-2fa';f.api.render('login','google-2fa');await tick();
  assert.equal(f.calls.filter(c=>c.body.action==='google_pending').length,1,'Google second factor ticket requested');
  assert.ok(walk(f.main).some(e=>e.class?.includes('au-tfa-login')),'Google callback shows existing second factor UI');
  for(const lang of ['uk','en','no','de','pl','lt','tr','ar']){f=await fixture({lang,magicOK:true});page=f.api.render('login');const form=walk(page).find(e=>e.tag==='form');walk(form).find(e=>e.type==='email').value='fixture@example.test';form.events.submit({preventDefault(){}});await tick();assert.ok(walk(form).find(e=>e.class==='au-msg').textContent.length>30,lang+' generic request confirmation');}
  console.log('PASS auth UI: disabled/configured Google, explicit consent, 2FA, failed-send UI, eight-language request confirmation');
})().catch(e=>{console.error(e);process.exitCode=1;});
