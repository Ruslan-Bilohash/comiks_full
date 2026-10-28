const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'home-coding-qa');
fs.mkdirSync(out, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const name = decodeURIComponent(url.pathname);
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  try {
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(fs.readFileSync(file));
  } catch {
    res.writeHead(404);
    res.end();
  }
});
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'komiks-home-coding-'));
  const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
    '--headless=old', '--no-sandbox', '--disable-gpu', '--disable-gpu-sandbox',
    '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
    '--user-data-dir=' + profile, 'about:blank'
  ], { windowsHide: true, stdio: 'ignore' });
  let ws;
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await wait(100);
    assert.ok(fs.existsSync(portFile), 'Chrome debugging port opens');
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim();
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    ws = new WebSocket(pages.find(page => page.type === 'page').webSocketDebuggerUrl);
    await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
    let seq = 0;
    const pending = new Map();
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const item = pending.get(message.id);
      pending.delete(message.id);
      message.error ? item.reject(message.error) : item.resolve(message.result);
    });
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++seq;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async expression => (await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
    await call('Runtime.enable');
    await call('Page.enable');
    const base = `http://127.0.0.1:${server.address().port}/`;
    await call('Page.navigate', { url: base });
    for (let i = 0; i < 100 && !(await evaluate('!!window.KomiksCore')); i++) await wait(100);
    await evaluate(`localStorage.setItem('comiks.consent',JSON.stringify({v:'2026-09-23',at:'2026-10-26'}));localStorage.setItem('comiks.welcomed','true');localStorage.setItem('comiks.ui','"uk"');location.reload()`);
    for (let i = 0; i < 100 && !(await evaluate("!!document.querySelector('.home-coding-promo')")); i++) await wait(100);

    const inspect = async (width, height, mobile, fileName) => {
      await call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
      await wait(300);
      await evaluate("document.querySelector('.home-coding-promo')?.scrollIntoView({block:'center'})");
      await wait(200);
      const state = await evaluate(`(()=>{const p=document.querySelector('.home-coding-promo');const a=p?.querySelector('a[href="#/koding"]');return{
        promo:!!p,newBadge:!!p?.querySelector('.home-coding-new'),cta:!!a,
        progress:!!p?.querySelector('.home-coding-progress'),facts:p?.querySelectorAll('.home-coding-facts span').length||0,
        overflow:document.documentElement.scrollWidth>innerWidth,columns:p?getComputedStyle(p).gridTemplateColumns:''
      }})()`);
      const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(out, fileName), Buffer.from(shot.data, 'base64'));
      return state;
    };

    const desktop = await inspect(1440, 1100, false, 'home-coding-desktop.png');
    const mobile = await inspect(390, 844, true, 'home-coding-mobile.png');
    for (const state of [desktop, mobile]) {
      assert.equal(state.promo, true, 'coding promo renders');
      assert.equal(state.newBadge, true, 'coding promo is marked new');
      assert.equal(state.cta, true, 'coding promo links to the coding course');
      assert.equal(state.progress, true, 'coding promo shows profile progress');
      assert.ok(state.facts >= 2, 'coding promo shows course facts');
      assert.equal(state.overflow, false, 'coding promo has no horizontal overflow');
    }
    assert.equal(desktop.columns.split(' ').length, 2, 'coding promo uses two columns on desktop');
    assert.equal(mobile.columns.split(' ').length, 1, 'coding promo stacks on mobile');
    console.log('PASS home coding promo: desktop and mobile');
  } finally {
    if (ws) ws.close();
    chrome.kill();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
