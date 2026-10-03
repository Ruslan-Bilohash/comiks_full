/* Комікс·Lab — 🏪 знімки екранів для Google Play / App Store.
 *
 *   node app/tools/prepare-web.js --light     (щоб було що знімати)
 *   node app/tools/serve.js 8970              (в іншому вікні)
 *   node tools/gen-store.js --port 8970 --ui=en
 *
 * Знімає САМ ЗАСТОСУНОК (app/www), а не сайт: у сторі мають бути екрани того,
 * що людина справді поставить. 1080×1920 — звичайний телефон, приймають усі стори.
 * Готові файли лягають у store/android/.
 */
const fs = require('fs'), path = require('path'), os = require('os'), { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'store', 'android');
const arg = (name, def) => { const v = process.argv.find(a => a.startsWith(`--${name}=`)); if (v) return v.slice(name.length + 3); const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : def; };
const PORT = arg('port', '8970');
const LANG = arg('ui', 'en');
const CDP = 9334;
// версія умов: якщо згода в localStorage має іншу — застосунок покаже вітальне вікно
const TERMS = (fs.readFileSync(path.join(ROOT, 'assets', 'app.js'), 'utf8')
  .match(/TERMS_VERSION\s*=\s*'([^']+)'/) || [, ''])[1];

const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(p => fs.existsSync(p));
if (!EDGE) { console.error('⚠ Microsoft Edge не знайдено — знімки не зроблено.'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

// назва файла · сторінка · що має з’явитися, перш ніж знімати
const SHOTS = [
  ['01-home', '#/', '.hero, .play-hero'],
  ['02-read', '#/read/p93/1', '.panel-frame svg, .panel-frame img'],
  ['03-quiz', '#/quiz/p93', '.q-card .opts'],
  ['04-words', '#/words/familie', '.word-grid .word-card'],
  ['05-pairs', '#/pairs', '.pairs-modes .pair-mode'],
  ['06-today', '#/today', '.day-tasks .day-task'],
  ['07-write', '#/write', '.write-tabs .wt-tab'],
  ['08-cards', '#/cards', '.flash']
];
// малюємо в 360×640 і множимо втричі: так текст лишається чітким, а розмір — 1080×1920
const CSS_W = 360, CSS_H = 640, DPR = 3;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'kl-store-'));
const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
  `--remote-debugging-port=${CDP}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });

async function cdpList() {
  for (let i = 0; i < 60; i++) {
    try { return await fetch(`http://127.0.0.1:${CDP}/json/list`).then(r => r.json()); } catch { await sleep(250); }
  }
  throw new Error('Edge не відповів на порту налагодження');
}
class Session {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.waiting = new Map();
    ws.onmessage = e => { const m = JSON.parse(e.data); const w = this.waiting.get(m.id); if (w) { this.waiting.delete(m.id); w(m); } };
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise(res => this.waiting.set(id, res));
  }
}

(async () => {
  const list = await cdpList();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => { ws.onopen = r; });
  const s = new Session(ws);
  await s.send('Page.enable');
  await s.send('Runtime.enable');
  await s.send('Emulation.setDeviceMetricsOverride', { width: CSS_W, height: CSS_H, deviceScaleFactor: DPR, mobile: true });

  let done = 0;
  for (const [name, hash, ready] of SHOTS) {
    /* Згоду з умовами ставимо ДО того, як застосунок намалюється, інакше на кожному
       знімку буде вітальне вікно. Версія умов береться з коду — не з голови. */
    await s.send('Page.navigate', { url: `http://localhost:${PORT}/` });
    await sleep(400);
    await s.send('Runtime.evaluate', { expression:
      `try { localStorage.setItem('comiks.consent', JSON.stringify({ v: '${TERMS}', at: new Date().toISOString().slice(0,10) }));
        localStorage.setItem('comiks.welcomed', 'true'); localStorage.setItem('comiks.ui', '"${LANG}"'); } catch (e) {}` });
    await s.send('Page.navigate', { url: `http://localhost:${PORT}/${hash}` });
    await sleep(1800);
    await s.send('Runtime.evaluate', { expression: `location.hash = '${hash}';` });
    let ok = false;
    for (let i = 0; i < 60; i++) {
      await sleep(250);
      const r = await s.send('Runtime.evaluate', { expression: `!!document.querySelector(${JSON.stringify(ready)})`, returnByValue: true });
      if (r.result && r.result.result && r.result.result.value) { ok = true; break; }
    }
    await sleep(600);
    const shot = await s.send('Page.captureScreenshot', { format: 'png' });
    if (!shot.result || !shot.result.data) { console.log(`✖ ${name}: знімок не вийшов`); continue; }
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(shot.result.data, 'base64'));
    console.log(`${ok ? '📸' : '⚠ (не дочекався)'} ${name}.png`);
    done++;
  }
  ws.close();
  edge.kill();
  console.log(`\n✔ Знімків: ${done} · тека store/android/ · ${CSS_W * DPR}×${CSS_H * DPR}`);
})().catch(e => { console.error('✖', e.message); edge.kill(); process.exit(1); });
