// Browser regression test: a stale cached PeerJS bundle reports data-channel
// support as false, while the browser can really create one. The game must
// fetch the repaired bundle and create the room without asking the user to
// clear browser data.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const root = path.resolve(process.env.KOMIKS_TEST_ROOT || path.resolve(__dirname, '..'));
const out = path.join(os.tmpdir(), 'komiks-game-language-qa');
fs.mkdirSync(out, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
let stalePeerRequests = 0;
let repairedPeerRequests = 0;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const name = decodeURIComponent(url.pathname);
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  try {
    let data = fs.readFileSync(file);
    if (name === '/assets/vendor/peerjs.min.js') {
      if (url.searchParams.get('rtc') === '2') repairedPeerRequests++;
      else {
        stalePeerRequests++;
        let source = data.toString('utf8');
        source = source.replace(/\/\* komiks-peer-fix[\s\S]*$/, '');
        source += ';window.peerjs.util.supports.audioVideo=false;window.peerjs.util.supports.data=false;';
        data = Buffer.from(source);
      }
    }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'komiks-webrtc-test-'));
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
    const evaluate = async expression => (await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
    await call('Runtime.enable');
    await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    const base = `http://127.0.0.1:${server.address().port}/`;
    await call('Page.navigate', { url: base });
    for (let i = 0; i < 100; i++) { if (await evaluate('!!window.KomiksCore')) break; await wait(100); }
    await evaluate(`localStorage.setItem('comiks.consent',JSON.stringify({v:'2026-09-23',at:'2026-10-25'}));localStorage.setItem('comiks.welcomed','true');location.reload()`);
    for (let i = 0; i < 100 && !(await evaluate("!!window.KomiksCore&&!document.querySelector('.welcome-back')")); i++) await wait(100);
    await evaluate(`location.hash='#/game'`);
    for (let i = 0; i < 100 && !(await evaluate("document.querySelectorAll('.gh-language-pick a').length===2")); i++) await wait(100);
    const languageChoice = await evaluate(`(()=>({
      choices:document.querySelectorAll('.gh-language-pick a').length,
      norwegian:document.querySelectorAll('.gh-language-pick a[href="#/game/no"]').length,
      english:document.querySelectorAll('.gh-language-pick a[href="#/game/en"]').length,
      illustrations:document.querySelectorAll('.gh-language-pick .gh-choice-art img').length,
      loadedIllustrations:Array.from(document.querySelectorAll('.gh-language-pick .gh-choice-art img')).filter(img=>img.complete&&img.naturalWidth>0).length,
      rooms:document.querySelectorAll('.gh-tile').length,
      overflow:document.documentElement.scrollWidth>innerWidth
    }))()`);
    assert.equal(languageChoice.choices, 2, 'game opens with exactly two language choices');
    assert.equal(languageChoice.norwegian, 1, 'Norwegian language choice is available');
    assert.equal(languageChoice.english, 1, 'English language choice is available');
    assert.equal(languageChoice.illustrations, 2, 'both language choices have learning illustrations');
    assert.equal(languageChoice.loadedIllustrations, 2, 'language learning illustrations load');
    assert.equal(languageChoice.rooms, 0, 'rooms stay hidden until a language is chosen');
    assert.equal(languageChoice.overflow, false, 'language choice fits the viewport');
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.gh-language-pick')).gridTemplateColumns.split(' ').length"), 1, 'language choices stack on mobile');
    const mobileShot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(out, 'game-languages-mobile.png'), Buffer.from(mobileShot.data, 'base64'));
    await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await wait(200);
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.gh-language-pick')).gridTemplateColumns.split(' ').length"), 2, 'language choices sit side by side on desktop');
    assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'), true, 'desktop language choice has no overflow');
    const desktopShot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(out, 'game-languages-desktop.png'), Buffer.from(desktopShot.data, 'base64'));

    await evaluate(`location.hash='#/game/no'`);
    for (let i = 0; i < 100 && !(await evaluate("document.querySelector('.gh-lang[data-lang=no] .gh-tile')")); i++) await wait(100);
    assert.equal(await evaluate("document.querySelectorAll('.gh-lang[data-lang=no] a[href^=\"#/game/src:\"]').length>=4"), true, 'Norwegian rooms appear after choosing Norwegian');
    assert.equal(await evaluate("document.querySelectorAll('.gh-lang[data-lang=en]').length"), 0, 'English rooms are hidden in Norwegian mode');

    await evaluate(`location.hash='#/game/en'`);
    for (let i = 0; i < 100 && !(await evaluate("document.querySelector('.gh-lang[data-lang=en] .gh-tile')")); i++) await wait(100);
    assert.equal(await evaluate("document.querySelectorAll('.gh-lang[data-lang=en] a[href^=\"#/game/src:en-\"]').length>=2"), true, 'English rooms appear after choosing English');
    assert.equal(await evaluate("document.querySelectorAll('.gh-lang[data-lang=no]').length"), 0, 'Norwegian rooms are hidden in English mode');

    if (process.argv.includes('--ui-only')) {
      console.log('PASS game language picker: illustrations, routes and responsive layout');
      return;
    }

    await evaluate(`location.hash='#/game/src:level:A1'`);
    for (let i = 0; i < 100; i++) {
      const state = await evaluate(`(()=>{const text=document.querySelector('#app')?.innerText||'';return{
        lobby:/Чекаємо на учасників|Waiting for players|Venter på deltakere/.test(text),
        incompatible:/прямих з’єднань|direct connections|direkte tilkoblinger/.test(text)
      }})()`);
      if (state.lobby || state.incompatible) break;
      await wait(100);
    }
    const result = await evaluate(`(()=>{const text=document.querySelector('#app')?.innerText||'';return{
      lobby:/Чекаємо на учасників|Waiting for players|Venter på deltakere/.test(text),
      incompatible:/прямих з’єднань|direct connections|direkte tilkoblinger/.test(text),
      hash:location.hash,
      text:text.slice(0,500),
      nativeData:(()=>{try{const pc=new RTCPeerConnection();const dc=pc.createDataChannel('test');dc.close();pc.close();return true}catch{return false}})()
    }})()`);
    assert.equal(result.nativeData, true, 'Chrome can create a native WebRTC data channel');
    assert.equal(result.incompatible, false, 'game does not show a false browser-incompatible error');
    assert.equal(result.lobby, true, 'game creates a room after recovering PeerJS: ' + JSON.stringify(result));
    assert.equal(stalePeerRequests, 1, 'the stale versioned PeerJS bundle was loaded once');
    assert.equal(repairedPeerRequests, 1, 'the repaired PeerJS bundle was fetched once');
    assert.deepEqual(runtimeErrors, [], 'no browser runtime errors');
    console.log('PASS: stale PeerJS capability recovered automatically');
  } finally {
    if (ws) ws.close();
    chrome.kill();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
