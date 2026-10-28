'use strict';

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const root = path.resolve(process.env.KOMIKS_TEST_ROOT || path.join(__dirname, '..'));
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.json': 'application/json' };
const peerStub = `window.peerjs={util:{supports:{data:true,audioVideo:true}}};window.Peer=class{constructor(){this.e={};setTimeout(()=>this.e.open&&this.e.open(),0)}on(k,f){this.e[k]=f;return this}destroy(){}};`;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const name = decodeURIComponent(url.pathname);
  if (name === '/assets/vendor/peerjs.min.js') { res.writeHead(200, { 'Content-Type': 'application/javascript' }); return res.end(peerStub); }
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  try { res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(fs.readFileSync(file)); }
  catch { res.writeHead(404); res.end(); }
});
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const watchdog = setTimeout(() => { console.error('Lobby layout test timed out'); process.exit(2); }, 60000);

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'komiks-lobby-layout-'));
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
    '--user-data-dir=' + profile, 'about:blank'
  ], { windowsHide: true, stdio: 'ignore' });
  let ws;
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    let port = '';
    for (let i = 0; i < 100 && !port; i++) { try { port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim(); } catch { await wait(100); } }
    assert.ok(port, 'Chrome debugging port opens');
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    ws = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
    await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
    let seq = 0;
    const pending = new Map();
    const errors = [];
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) { const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(message.error) : item.resolve(message.result); }
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    });
    const call = (method, params = {}) => new Promise((resolve, reject) => { const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
    const evaluate = async expression => { const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.text); return result.result.value; };
    await call('Runtime.enable'); await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
    await call('Page.navigate', { url: `http://127.0.0.1:${server.address().port}/` });
    for (let i = 0; i < 100; i++) { if (await evaluate('!!window.KomiksCore && !!window.KomiksGame')) break; await wait(100); }
    await evaluate(`localStorage.setItem('comiks.consent',JSON.stringify({v:'2026-09-23',at:'2026-10-26'}));localStorage.setItem('comiks.welcomed','true')`);
    await call('Page.reload');
    for (let i = 0; i < 100; i++) { if (await evaluate('!!window.KomiksCore && !!window.KomiksGame')) break; await wait(100); }
    await evaluate(`location.hash='#/game/lobby'`);
    for (let i = 0; i < 100; i++) { if (await evaluate("!!document.querySelector('.lobby-grid')")) break; await wait(100); }

    const viewports = [[320, 568, true], [768, 1024, true], [1366, 768, false], [1920, 1080, false]];
    for (const [width, height, mobile] of viewports) {
      await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
      await wait(100);
      const layout = await evaluate(`(()=>{const grid=document.querySelector('.lobby-grid'),room=document.querySelector('.lobby-room'),control=document.querySelector('.lobby-control'),start=document.querySelector('.lobby-start');const gr=grid?.getBoundingClientRect(),sr=start?.getBoundingClientRect();return{grid:!!grid,room:!!room,control:!!control,start:!!start,hOverflow:document.documentElement.scrollWidth>innerWidth+1,gridWidth:Math.round(gr?.width||0),startVisible:!!sr&&sr.left>=0&&sr.right<=innerWidth+1,startWidth:Math.round(sr?.width||0),columns:getComputedStyle(grid).gridTemplateColumns}})()`);
      assert.equal(layout.grid, true, `${width}x${height}: lobby grid exists`);
      assert.equal(layout.room, true, `${width}x${height}: room identity zone exists`);
      assert.equal(layout.control, true, `${width}x${height}: controls and players zone exists`);
      assert.equal(layout.start, true, `${width}x${height}: start action exists`);
      assert.equal(layout.hOverflow, false, `${width}x${height}: no horizontal overflow`);
      assert.equal(layout.startVisible, true, `${width}x${height}: start action stays inside viewport`);
      if (width <= 768) assert.equal(layout.columns.split(' ').length, 1, `${width}x${height}: one-column mobile layout`);
      else assert.ok(layout.columns.split(' ').length >= 2, `${width}x${height}: desktop uses two columns`);
      const shotDir = process.env.KOMIKS_SCREENSHOT_DIR;
      if (shotDir && ((width === 320 && height === 568) || (width === 1366 && height === 768))) {
        fs.mkdirSync(shotDir, { recursive: true });
        const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
        fs.writeFileSync(path.join(shotDir, `lobby-${width}x${height}.png`), Buffer.from(shot.data, 'base64'));
      }
    }
    assert.deepEqual(errors, [], 'no browser runtime errors');
    console.log('PASS: lobby layout is responsive from 320px phones to full-HD desktops');
  } finally {
    if (ws) ws.close();
    chrome.kill();
    if (server.closeAllConnections) server.closeAllConnections();
    server.close();
    clearTimeout(watchdog);
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
