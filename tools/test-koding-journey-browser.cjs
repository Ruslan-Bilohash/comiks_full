'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const root = path.resolve(process.env.KOMIKS_TEST_ROOT || path.join(__dirname, '..'));
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let name = decodeURIComponent(url.pathname);
  if (name === '/comiks' || name === '/comiks/') name = '/index.html';
  else if (name.startsWith('/comiks/')) name = name.slice('/comiks'.length);
  else if (name === '/') name = '/index.html';
  const file = path.resolve(root, '.' + name);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  try {
    const body = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const watchdog = setTimeout(() => { console.error('Koding browser test timed out'); process.exit(2); }, 60000);

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'komiks-koding-journey-'));
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=old', '--no-sandbox', '--disable-gpu', '--disable-gpu-sandbox', '--disable-software-rasterizer',
    '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
    '--user-data-dir=' + profile, 'about:blank'
  ], { windowsHide: true, stdio: 'ignore' });
  let ws;
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    let port = '';
    for (let i = 0; i < 100 && !port; i++) {
      try { port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim(); }
      catch { await wait(100); }
    }
    assert.ok(port, 'Chrome debugging port opens');
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    ws = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
    await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
    let seq = 0;
    const pending = new Map();
    const runtimeErrors = [];
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const item = pending.get(message.id);
        pending.delete(message.id);
        message.error ? item.reject(message.error) : item.resolve(message.result);
      }
      if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.text);
    });
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++seq;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async expression => {
      const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
      return result.result.value;
    };
    await call('Runtime.enable');
    await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    const base = `http://127.0.0.1:${server.address().port}/`;
    await call('Page.navigate', { url: base });
    for (let i = 0; i < 100; i++) { if (await evaluate('!!window.KomiksCore && !!window.KomiksKoding')) break; await wait(100); }
    await evaluate(`localStorage.setItem('comiks.consent',JSON.stringify({v:'2026-09-23',at:'2026-10-25'}));localStorage.setItem('comiks.welcomed','true')`);
    await call('Page.reload');
    for (let i = 0; i < 100; i++) { if (await evaluate('!!window.KomiksCore && !!window.KomiksKoding')) break; await wait(100); }
    await evaluate(`location.hash='#/koding'`);
    for (let i = 0; i < 100; i++) { if (await evaluate("!!document.querySelector('.kd-journey')")) break; await wait(100); }

    const initial = await evaluate(`(()=>({
      progress:!!document.querySelector('.kd-journey-progress [role="progressbar"]'),
      tracks:document.querySelectorAll('.kd-track-card').length,
      nodes:document.querySelectorAll('.kd-scale-node').length,
      focus:document.querySelector('.kd-focus-card')?.innerText||'',
      details:!!document.querySelector('details.kd-all'),
      height:Math.round(document.querySelector('.kd-journey')?.getBoundingClientRect().height||0),
      overflow:document.documentElement.scrollWidth>innerWidth,
      trackColumns:getComputedStyle(document.querySelector('.kd-tracks')).gridTemplateColumns.split(' ').length,
      trackOverflow:document.querySelector('.kd-tracks').scrollWidth>document.querySelector('.kd-tracks').clientWidth,
      fullWidthTracks:Array.from(document.querySelectorAll('.kd-track-card')).every(card=>card.getBoundingClientRect().width>=document.querySelector('.kd-tracks').clientWidth-4),
      scaleColumns:getComputedStyle(document.querySelector('.kd-scale')).gridTemplateColumns.split(' ').length,
      scaleOverflow:document.querySelector('.kd-scale-wrap').scrollWidth>document.querySelector('.kd-scale-wrap').clientWidth,
      lessonLabels:document.querySelectorAll('.kd-scale-copy strong').length,
      totalText:document.querySelector('.kd-progress-copy')?.innerText||''
    }))()`);
    assert.equal(initial.progress, true, 'compact journey exposes a progress bar');
    assert.equal(initial.tracks, 12, 'curriculum exposes all twelve learning worlds');
    assert.equal(initial.nodes, 12, 'foundations world has twelve selectable lesson nodes');
    assert.match(initial.focus, /Hva er programmering\?|Що таке програмування\?|What is coding\?/i, 'first unfinished lesson is focused');
    assert.equal(initial.details, true, 'all lessons are available in a collapsed details block');
    assert.ok(initial.height > 900, 'mobile curriculum flows vertically instead of clipping rows');
    assert.equal(initial.overflow, false, 'mobile page has no horizontal overflow');
    assert.equal(initial.trackColumns, 1, 'mobile learning worlds use one column');
    assert.equal(initial.trackOverflow, false, 'mobile learning worlds do not scroll horizontally');
    assert.equal(initial.fullWidthTracks, true, 'every mobile learning world fills the available row');
    assert.equal(initial.scaleColumns, 1, 'mobile lesson steps use one vertical column');
    assert.equal(initial.scaleOverflow, false, 'mobile lesson steps do not scroll horizontally');
    assert.equal(initial.lessonLabels, 12, 'vertical lesson steps show a readable lesson label');
    assert.match(initial.totalText, /99/, 'coding journey reports the complete curriculum including hacker safety');

    const shotDir = process.argv.includes('--screenshots') ? path.join(__dirname, 'koding-qa') : process.env.KOMIKS_SCREENSHOT_DIR;
    if (shotDir) {
      fs.mkdirSync(shotDir, { recursive: true });
      await evaluate(`document.querySelector('.kd-journey').scrollIntoView({block:'start'})`);
      await wait(100);
      const mobile = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(shotDir, 'koding-journey-mobile.png'), Buffer.from(mobile.data, 'base64'));
      await evaluate(`document.querySelector('.kd-scale-wrap').scrollIntoView({block:'start'})`);
      await wait(100);
      const mobileLessons = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(shotDir, 'koding-lessons-mobile.png'), Buffer.from(mobileLessons.data, 'base64'));
      await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
      await wait(150);
      const desktop = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(shotDir, 'koding-journey-desktop.png'), Buffer.from(desktop.data, 'base64'));
      await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    }

    const selected = await evaluate(`(()=>{const n=document.querySelectorAll('.kd-scale-node')[2];n.click();const card=document.querySelector('.kd-focus-card');return{title:card.innerText,links:Array.from(card.querySelectorAll('a')).map(a=>a.getAttribute('href')),active:n.getAttribute('aria-pressed')}})()`);
    assert.match(selected.title, /Gjenta! Robo danser/i, 'selecting a node updates the focused lesson');
    assert.deepEqual(selected.links, ['#/read/p185/0', '#/quiz/p185'], 'focused lesson keeps existing read and quiz routes');
    assert.equal(selected.active, 'true', 'selected node exposes its active state');

    const expandedRows = await evaluate(`(()=>{const d=document.querySelector('details.kd-all');d.open=true;return d.querySelectorAll('.kd-all-row').length})()`);
    assert.equal(expandedRows, 12, 'expanded list contains every foundations lesson');

    const web = await evaluate(`(()=>{const b=document.querySelector('.kd-track-card[data-track="web"]');b.click();return{pressed:b.getAttribute('aria-pressed'),nodes:document.querySelectorAll('.kd-scale-node').length,focus:document.querySelector('.kd-focus-card').innerText}})()`);
    assert.equal(web.pressed, 'true', 'web category exposes its selected state');
    assert.equal(web.nodes, 8, 'web category contains the original lessons and five new web lessons');
    assert.match(web.focus, /Nettsiden til Pus|Сайт про Пуса|website for Pus/i, 'web category opens its first lesson');
    await evaluate(`document.querySelector('.kd-track-card[data-track="basics"]').click()`);

    await evaluate(`(()=>{
      const progress={};
      ['p183','p184','p185','p186','p187','p188'].forEach(id=>{
        const comic=COMICS.find(c=>c.id===id);
        KomiksCore.store.set('seen.'+id,comic.panels.map((_,i)=>i));
        progress[id]={stars:3};
      });
      KomiksCore.store.set('progress',progress);
      location.hash='#/';
    })()`);
    await wait(150);
    await evaluate(`location.hash='#/koding'`);
    for (let i = 0; i < 50; i++) { if (await evaluate("document.querySelector('.kd-focus-card')?.innerText.includes('Hvilket språk')")) break; await wait(50); }
    await wait(150);
    const resumed = await evaluate(`(()=>{const w=document.querySelector('.kd-scale-wrap'),n=document.querySelector('.kd-scale-node.active'),wr=w.getBoundingClientRect(),nr=n.getBoundingClientRect();return{focus:document.querySelector('.kd-focus-card').innerText,visible:nr.left>=wr.left-1&&nr.right<=wr.right+1}})()`);
    assert.match(resumed.focus, /Hvilket språk\?/i, 'saved progress resumes at the first unfinished lesson');
    assert.equal(resumed.visible, true, 'resumed lesson node is automatically visible on mobile');

    await evaluate(`(()=>{KomiksCore.store.set('kodeGame',{best:{1:3,2:3,3:3,4:3},last:5});location.hash='#/koding/spill/5'})()`);
    for (let i = 0; i < 80; i++) { if (await evaluate("!!document.querySelector('.kg-example')")) break; await wait(100); }
    const codeExample = await evaluate(`(()=>( {
      blocks:document.querySelectorAll('.kg-example-code .kg-b').length,
      cells:document.querySelectorAll('.kg-example-cell').length,
      button:document.querySelector('.kg-example-play')?.textContent||'',
      overflow:document.documentElement.scrollWidth>innerWidth
    }))()`);
    assert.equal(codeExample.blocks, 3, 'small example shows three commands');
    assert.equal(codeExample.cells, 4, 'small example shows the execution track');
    assert.match(codeExample.button, /Показати|Vis meg|Show me/i, 'small example has a clear play action');
    assert.equal(codeExample.overflow, false, 'example does not create mobile overflow');
    await evaluate(`document.querySelector('.kg-example-play').click()`);
    await wait(850);
    const animated = await evaluate(`(()=>( {
      left:parseFloat(document.querySelector('.kg-example-robo').style.left||'0'),
      active:document.querySelectorAll('.kg-example-code .kg-b.on').length
    }))()`);
    assert.ok(animated.left > 0, 'example moves Robo after play');
    assert.equal(animated.active, 1, 'example highlights one executing command');
    await wait(1300);
    assert.match(await evaluate(`document.querySelector('.kg-example-play').textContent`), /Ще раз|En gang til|Again/i, 'example can be replayed after finishing');
    assert.deepEqual(runtimeErrors, [], 'no browser runtime errors');
    console.log('PASS: coding curriculum and animated execution example work on mobile');
  } finally {
    if (ws) ws.close();
    chrome.kill();
    if (server.closeAllConnections) server.closeAllConnections();
    server.close();
    clearTimeout(watchdog);
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
