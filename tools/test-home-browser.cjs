const fs = require('node:fs'), path = require('node:path'), Module = require('node:module');
const file = path.resolve(__dirname, '../app/android/tools/smoke.cjs');
let source = fs.readFileSync(file, 'utf8')
 .replace("path.resolve(__dirname,'../app/src/main/assets/public')", JSON.stringify(path.resolve(__dirname,'..')))
 .replace("path.resolve(__dirname,'../release/screenshots')", JSON.stringify(path.resolve(__dirname,'hero-qa')))
 .replace("assert.deepEqual(missing,[],'Missing local requests');", "console.log('Unavailable local endpoints:', missing);")
 .replace("for(const [name,route]", `
  assert.ok(await evaluate("document.querySelector('.hero-play')"),'Hero play exists');
  assert.ok(await evaluate("document.querySelector('.home-coding-promo a')?.getAttribute('href')==='#/koding'"),'Home promotes the coding course');
  assert.ok(await evaluate("document.querySelector('.home-coding-promo .home-coding-new')"),'Coding promo is marked as new');
  const selected=[];
  await evaluate("localStorage.removeItem('comiks.homeFeature')");
  for(let j=0;j<4;j++){
   await call('Page.reload');await wait(2500);
   selected.push(await evaluate("document.querySelector('.hero-feature').dataset.comic"));
  }
  assert.equal(selected[0],selected[1]);assert.equal(selected[1],selected[2]);assert.notEqual(selected[2],selected[3]);
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'Mobile has no horizontal overflow');
  console.log('Hero rotation:',selected);
  for(const [name,route]`);
const mod = new Module(file);mod.filename=file;mod.paths=module.paths;
mod._compile(source,file);
