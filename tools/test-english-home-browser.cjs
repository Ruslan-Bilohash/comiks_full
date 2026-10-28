const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const root = process.env.KOMIKS_QA_ROOT ? path.resolve(process.env.KOMIKS_QA_ROOT) : path.resolve(__dirname, '..');
const out = path.join(os.tmpdir(), 'komiks-english-qa');
const edgePath = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe'
].find(fs.existsSync);
assert(edgePath, 'Microsoft Edge is available');
fs.mkdirSync(out, { recursive: true });

const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
const missing = [];
const errors = [];
const server = http.createServer((req, res) => {
  const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  try {
    const data = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    if (!name.startsWith('/api/') && !name.startsWith('/audio/') && !name.includes('favicon')) missing.push(name);
    res.writeHead(404); res.end();
  }
});
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const watchdog = setTimeout(() => { console.error('QA_TIMEOUT'); process.exit(2); }, 45000);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  console.log('QA_PHASE server', server.address().port);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'komiks-en-qa-'));
  /* На керованому Windows-хості GPU-процес Edge завершується ще до відповіді
     CDP. Ці прапорці переводять QA у програмний headless-режим і не впливають
     на звичайний браузер користувача. */
  const edge = spawn(edgePath, ['--headless=old', '--no-sandbox', '--disable-gpu', '--disable-gpu-sandbox', '--disable-software-rasterizer', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', '--user-data-dir=' + profile, '--autoplay-policy=no-user-gesture-required', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let ws;
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    let portText = '';
    for (let i = 0; i < 100 && !portText; i++) {
      try { portText = fs.readFileSync(portFile, 'utf8'); } catch { await wait(200); }
    }
    assert(portText, 'Chromium debugging port');
    console.log('QA_PHASE edge');
    const port = portText.split('\n')[0];
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    ws = new WebSocket(pages.find(p => p.type === 'page').webSocketDebuggerUrl);
    await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
    console.log('QA_PHASE websocket');
    let seq = 0;
    const pending = new Map();
    ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (msg.id) { const p = pending.get(msg.id); pending.delete(msg.id); msg.error ? p.reject(msg.error) : p.resolve(msg.result); }
      if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
    });
    const call = (method, params = {}) => new Promise((resolve, reject) => { const id = ++seq; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
    const evaluate = async expression => (await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
    const shot = async name => {
      const png = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(png.data, 'base64'));
    };
    const route = async hash => { await evaluate('location.hash=' + JSON.stringify(hash)); await wait(900); };

    await call('Runtime.enable');
    console.log('QA_PHASE runtime');
    await call('Page.enable');
    console.log('QA_PHASE page');
    await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    console.log('QA_PHASE emulation');
    await call('Page.navigate', { url: `http://127.0.0.1:${server.address().port}/` });
    console.log('QA_PHASE navigate');
    for (let i = 0; i < 100; i++) { if (await evaluate('!!window.KomiksCore && !!window.KomiksEnglish')) break; await wait(200); }
    await evaluate(`localStorage.setItem('comiks.consent',JSON.stringify({v:'2026-09-23',at:'2026-10-26'}));localStorage.setItem('comiks.welcomed','true');localStorage.setItem('comiks.ui','"uk"');location.reload()`);
    await wait(2200);
    console.log('QA_PHASE ready');

    await route('#/english');
    console.log('QA_PHASE home-mobile');
    assert.equal(await evaluate("document.querySelector('.logo-text small').textContent"), 'Вчимо англійську');
    assert.equal(await evaluate("document.querySelectorAll('.en-home-tool').length"), 4);
    assert.equal(await evaluate("document.querySelectorAll('.en-letter-board button').length"), 3);
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'English mobile home has no horizontal overflow');
    await shot('english-home-mobile');

    await route('#/english/alphabet');
    console.log('QA_PHASE alphabet-mobile');
    assert.equal(await evaluate("document.querySelectorAll('.en-alpha-card').length"), 26);
    assert.equal(await evaluate("[...document.querySelectorAll('.en-alpha-card')].map(x=>x.textContent.trim()[0]).join('')"), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    assert.equal(await evaluate("document.querySelectorAll('.en-alpha-card .pic-photo,.en-alpha-card .pic-svg').length > 0"), true, 'Alphabet reuses Norwegian learning pictures');
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'Alphabet mobile page has no horizontal overflow');
    await shot('english-alphabet-mobile');

    await route('#/english/plan');
    console.log('QA_PHASE plan-mobile');
    assert.equal(await evaluate("document.querySelectorAll('.en-plan-node').length"), 22);
    assert.equal(await evaluate("document.querySelectorAll('.en-topic').length"), 22);
    assert.equal(await evaluate("!!document.querySelector('.en-plan-node.active')"), true);
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'English plan mobile page has no horizontal overflow');
    await shot('english-plan-mobile');

    const pictureTheme = await evaluate("window.WORDS.themes.find(t=>t.words.some(w=>window.KomiksPics&&window.KomiksPics.has(w[0],w[1])))?.id || window.WORDS.themes[0].id");
    await route('#/english/words/' + pictureTheme);
    console.log('QA_PHASE words-images-mobile');
    assert.equal(await evaluate("document.querySelectorAll('.word-card .pic-photo,.word-card .pic-svg').length > 0"), true, 'English word cards reuse Norwegian learning pictures');
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'English word cards have no horizontal overflow');

    await route('#/quiz/en-alphabet');
    console.log('QA_PHASE quiz-mobile');
    assert.equal(await evaluate("document.querySelectorAll('.english-quiz .opt').length >= 3"), true);
    assert.equal(await evaluate("!!document.querySelector('.en-alpha-prompt')"), true);

    await call('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await route('#/english');
    console.log('QA_PHASE home-desktop');
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'English desktop home has no horizontal overflow');
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.en-home-hero')).gridTemplateColumns.split(' ').length >= 2"), true);
    await shot('english-home-desktop');

    await route('#/english/plan');
    console.log('QA_PHASE plan-desktop');
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'English desktop plan has no page overflow');
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.en-plan-journey')).gridTemplateColumns.split(' ').length >= 2"), true);
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.en-plan-route')).gridTemplateColumns.split(' ').length"), 22, 'Topic journey is a horizontal 22-step scale');
    await shot('english-plan-desktop');

    assert.deepEqual(errors, [], 'No browser runtime errors');
    assert.deepEqual([...new Set(missing)], [], 'No missing local assets');
    console.log({ result: 'PASS', alphabetCards: 26, homeTools: 4, viewports: ['390x844', '1440x900'], errors });
    clearTimeout(watchdog);
  } finally {
    clearTimeout(watchdog);
    if (ws) ws.close();
    edge.kill();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
