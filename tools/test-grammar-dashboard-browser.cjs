'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const root = path.resolve(process.env.KOMIKS_TEST_ROOT || path.join(__dirname, '..'));
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.woff2':'font/woff2', '.json':'application/json' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let name = decodeURIComponent(url.pathname);
  if (name === '/comiks' || name === '/comiks/') name = '/index.html';
  else if (name.startsWith('/comiks/')) name = name.slice('/comiks'.length);
  else if (name === '/') name = '/index.html';
  const file = path.resolve(root, '.' + name);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  try { const body = fs.readFileSync(file); res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' }); res.end(body); }
  catch { res.writeHead(404); res.end(); }
});
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const watchdog = setTimeout(() => { console.error('Grammar dashboard browser test timed out'); process.exit(2); }, 60000);

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'komiks-grammar-dashboard-'));
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=old', '--no-sandbox', '--disable-gpu', '--disable-gpu-sandbox', '--disable-software-rasterizer',
    '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, 'about:blank'
  ], { windowsHide:true, stdio:'ignore' });
  let ws;
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    let port = '';
    for (let i = 0; i < 100 && !port; i++) { try { port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim(); } catch { await wait(100); } }
    assert.ok(port, 'Chrome debugging port opens');
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    ws = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
    await new Promise(resolve => ws.addEventListener('open', resolve, { once:true }));
    let seq = 0;
    const pending = new Map();
    const runtimeErrors = [];
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) { const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(message.error) : item.resolve(message.result); }
      if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.text);
    });
    const call = (method, params = {}) => new Promise((resolve, reject) => { const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
    const evaluate = async expression => {
      const result = await call('Runtime.evaluate', { expression, returnByValue:true, awaitPromise:true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
      return result.result.value;
    };
    await call('Runtime.enable');
    await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride', { width:390, height:844, deviceScaleFactor:1, mobile:true });
    await call('Page.navigate', { url:`http://127.0.0.1:${server.address().port}/` });
    for (let i = 0; i < 100; i++) { if (await evaluate('!!window.KomiksCore && !!window.KomiksGrammar')) break; await wait(100); }
    await evaluate(`localStorage.setItem('comiks.consent',JSON.stringify({v:'2026-09-23',at:'2026-10-26'}));localStorage.setItem('comiks.welcomed','true')`);
    await call('Page.reload');
    for (let i = 0; i < 100; i++) { if (await evaluate('!!window.KomiksCore && !!window.KomiksGrammar')) break; await wait(100); }
    await evaluate(`(()=>{KomiksCore.store.set('quizlog',[
      {key:'grammar:pron-subj',title:'Pronomen',score:7,total:10,stars:2,date:'2026-10-26'},
      {key:'clock',title:'Klokka',score:4,total:10,stars:1,date:'2026-10-25'},
      {key:'grammar:pron-subj',title:'Pronomen',score:9,total:10,stars:3,date:'2026-10-24'}
    ]);location.hash='#/grammar'})()`);
    for (let i = 0; i < 100; i++) { if (await evaluate("!!document.querySelector('.gram-cabinet')")) break; await wait(100); }
    const mobile = await evaluate(`(() => ({
      cabinet:!!document.querySelector('.gram-cabinet'),
      stats:Array.from(document.querySelectorAll('.gram-stat strong')).map(x=>x.textContent.trim()),
      history:document.querySelectorAll('.gram-history-row').length,
      review:document.querySelectorAll('.gram-review-card').length,
      repeatLinks:Array.from(document.querySelectorAll('.gram-history-row a')).map(a=>a.getAttribute('href')),
      statColumns:getComputedStyle(document.querySelector('.gram-cabinet-stats')).gridTemplateColumns.split(' ').length,
      overflow:document.documentElement.scrollWidth>innerWidth
    }))()`);
    assert.equal(mobile.cabinet, true, 'grammar dashboard is rendered');
    assert.deepEqual(mobile.stats, ['2/21', '65%', '2'], 'dashboard shows completion, average and review count');
    assert.equal(mobile.history, 2, 'completed test history contains both completed topics');
    assert.equal(mobile.review, 2, 'weak and recently weaker topics are suggested for review');
    assert.deepEqual(mobile.repeatLinks, ['#/quiz/grammar/pron-subj', '#/quiz/clock'], 'repeat actions open the matching quizzes');
    assert.equal(mobile.statColumns, 1, 'mobile statistics use one column');
    assert.equal(mobile.overflow, false, 'grammar cabinet does not overflow a phone viewport');
    await call('Emulation.setDeviceMetricsOverride', { width:1280, height:900, deviceScaleFactor:1, mobile:false });
    await wait(100);
    const desktopColumns = await evaluate(`getComputedStyle(document.querySelector('.gram-cabinet-stats')).gridTemplateColumns.split(' ').length`);
    assert.equal(desktopColumns, 3, 'desktop statistics use three columns');
    assert.deepEqual(runtimeErrors, [], 'page has no runtime errors');
    console.log('PASS grammar dashboard browser: scores, review links and responsive layout');
  } finally {
    clearTimeout(watchdog);
    if (ws) ws.close();
    chrome.kill();
    server.close();
  }
})().catch(error => { clearTimeout(watchdog); console.error(error); process.exitCode = 1; });
