#!/usr/bin/env node
/* Комікс·Lab — 📸 знімки розділів сайту для сторінок оновлень і соцмереж.
 *
 *   node tools/shots.js                (сайт має працювати на localhost:8950)
 *   node tools/shots.js --port 8950
 *
 * Навіщо окремо від tools/gen-screens.js: той знімає широкі кадри для README,
 * а тут потрібні телефонні — саме такі йдуть на сторінки оновлень, і саме такий
 * вигляд має застосунок у більшості людей.
 *
 * Знімаємо справжній телефон: 360×800 логічних пікселів із потрійною щільністю,
 * тобто 1080×2400 у файлі. Чекаємо, поки потрібний блок намалюється, інакше в
 * кадр потрапляє порожній екран.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'img', 'shots');
const portArg = process.argv.indexOf('--port');
const PORT = portArg > -1 ? process.argv[portArg + 1] : '8950';
const CDP = 9343;
/* Якою мовою знятий інтерфейс. Знімки йдуть на сторінки оновлень усіма трьома
   мовами, тож одна з них однаково буде «чужою»; беремо англійську як найширшу
   для тих, хто шукає курс норвезької. Змінюється прапорцем --lang. */
const langArg = process.argv.indexOf('--lang');
const LANG = langArg > -1 ? process.argv[langArg + 1] : 'en';

const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p));
if (!EDGE) { console.error('✖ Microsoft Edge не знайдено.'); process.exit(1); }

/* файл · маршрут · що має намалюватися · що зробити перед знімком */
const SHOTS = [
  ['home', '#/', '.hero, main', null],
  ['comics', '#/comics', '.comic-card, .cm-card, main', null],
  ['read', '#/read/p93/1', '.panel-frame', null],
  ['quiz', '#/quiz/p93', '.opts .opt', 'quiz'],
  ['words', '#/words/mat', '.word-grid, .words-grid, main', null],
  ['cards', '#/cards', '.flash, main', null],
  ['pairs', '#/pairs', '.pairs-board, .pairs-menu, main', null],
  ['cross', '#/cross/familie', '.cross-grid', null],
  ['grammar', '#/grammar', '.gr-topic, .topic-card, main', null],
  ['alphabet', '#/alphabet', '.alpha-grid, .letter, main', null],
  ['numbers', '#/numbers', 'main', null],
  ['today', '#/today', '.day-task, main', null],
  ['plan', '#/plan', '.plan-step, .plan-list, .plan-cfg, main', null],
  ['exam', '#/exam', '.exam-part, main', null],
  ['write', '#/write', '.write-area, main', null],
  ['call', '#/call', '.call-page, .phone-pick, .call-setup, main', null],
  ['race', '#/race', '.lr, .lr-menu, main', null],
  ['players', '#/players', '.pl-row, .top-board, main', null],
  ['friends', '#/friends', '.fr-list, main', null],
  ['profile', '#/profile', '.pf-ava, main', null],
  ['install', '#/install', '.inst-grid, main', null],
  ['login', '#/login', '.au-card', null],
  ['register', '#/register', '.au-card', null],
  ['whatsnew', '#/whatsnew', '.news-list, main', null],
  ['english', '#/english', 'main', null],
  ['math', '#/math', 'main', null],
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

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
  async eval(expression) {
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return r.result && r.result.result ? r.result.result.value : undefined;
  }
}

(async () => {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'kl-shots-'));
  const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    `--remote-debugging-port=${CDP}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });

  let list = null;
  for (let i = 0; i < 60 && !list; i++) {
    try { list = await fetch(`http://127.0.0.1:${CDP}/json/list`).then(r => r.json()); } catch { await sleep(250); }
  }
  if (!list) { console.error('✖ Edge не відповів'); edge.kill(); process.exit(1); }

  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => { ws.onopen = r; });
  const s = new Session(ws);
  await s.send('Page.enable');
  await s.send('Runtime.enable');
  await s.send('Emulation.setDeviceMetricsOverride', { width: 360, height: 800, deviceScaleFactor: 3, mobile: true });

  fs.mkdirSync(OUT, { recursive: true });
  let done = 0, failed = [];

  /* Згоду й мову ставимо один раз: інакше привітальне вікно затуляє кожен кадр.
     Версію умов читаємо з самого app.js — вгадувати не можна, згода чинна лише
     за точного збігу дати. */
  await s.send('Page.navigate', { url: `http://localhost:${PORT}/` });
  await sleep(2500);
  const terms = await s.eval(`(async () => {
    const t = await fetch('assets/app.js').then(r => r.text());
    const m = t.match(/TERMS_VERSION\\s*=\\s*'([^']+)'/);
    return m ? m[1] : '';
  })()`);
  /* Усе, що кладемо в сховище, має бути JSON: застосунок читає значення через
     JSON.parse, і звичайний рядок 'uk' розбором падає, а далі мовчки береться
     значення за замовчуванням. Саме через це вікно виходило норвезьке. */
  await s.eval(`(() => {
    try {
      localStorage.setItem('comiks.consent', JSON.stringify({ v: ${JSON.stringify(terms)}, at: new Date().toISOString().slice(0, 10) }));
      localStorage.setItem('comiks.welcomed', JSON.stringify(true));
      localStorage.setItem('comiks.ui', JSON.stringify(${JSON.stringify(LANG)}));
      const st = JSON.parse(localStorage.getItem('comiks.settings') || '{}');
      localStorage.setItem('comiks.settings', JSON.stringify(Object.assign({ level: 'adults', levelFilter: 'all', rate: 1, voices: {}, audio: true, v: 5 }, st)));
    } catch (e) {}
    return true;
  })()`);

  /* Обов'язкове перезавантаження. Далі в циклі міняється лише хеш, а це перехід
     усередині того самого документа — застосунок не стартує наново й вікно,
     намальоване до того, як ми поставили згоду, лишилося б на екрані назавжди. */
  await s.send('Page.reload', { ignoreCache: true });
  await sleep(2500);

  /* Перевіряємо, що згода справді прийнялася: якщо ні, усі 26 кадрів будуть
     знімком привітального вікна, і помітити це можна лише очима. Краще впасти
     одразу й сказати чому. */
  const consentOk = await s.eval(`(() => { try { const c = JSON.parse(localStorage.getItem('comiks.consent') || 'null'); return c ? c.v : '(немає)'; } catch (e) { return 'err:' + e.message; } })()`);
  console.log(`   згода: ${consentOk} · у коді: ${terms || '(не прочитано)'}`);
  if (!terms || consentOk !== terms) {
    console.error('✖ Привітальне вікно не вдалося закрити — знімки були б вікном вибору мови. Зупиняюсь.');
    edge.kill(); process.exit(1);
  }

  for (const [name, hash, ready, mode] of SHOTS) {
    await s.send('Page.navigate', { url: `http://localhost:${PORT}/#/` });
    await sleep(700);
    await s.eval(`location.hash = ${JSON.stringify(hash)}; true`);

    let ok = false;
    for (let i = 0; i < 40; i++) {
      await sleep(250);
      if (await s.eval(`!!document.querySelector(${JSON.stringify(ready)})`)) { ok = true; break; }
    }

    if (mode === 'quiz') {
      // доходимо до питання з кольоровими варіантами — саме воно показує новий вигляд
      await s.eval(`(async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        for (let i = 0; i < 25; i++) {
          if (document.querySelector('.opts .opt')) return true;
          const fb = document.querySelector('.feedback .btn'); if (fb) { fb.click(); await sleep(260); continue; }
          const bank = document.querySelector('.wo-bank .wo-w'); if (bank) { bank.click(); await sleep(110); continue; }
          const any = [...document.querySelectorAll('button')].filter(b => !b.disabled && !/Avslutt|Start|^🔊/.test(b.textContent.trim()));
          if (any.length) { any[0].click(); await sleep(220); } else break;
        }
        return !!document.querySelector('.opts .opt');
      })()`);
      await sleep(500);
    }

    if (process.env.KL_DEBUG) {
      const dbg = await s.eval(`JSON.stringify({ consent: localStorage.getItem('comiks.consent'), ui: localStorage.getItem('comiks.ui'), modal: !!document.querySelector('.modal-back'), href: location.href })`);
      console.log('   ' + name + ' -> ' + dbg);
    }
    await s.eval(`document.querySelectorAll('.praise-toast, .buddy, .fr-pill, .a11y-btn, .fr-toasts, .fb-back').forEach(e => e.remove()); true`);
    /* Останній запобіжник: якщо вікно все ж з'явилося, краще зняти екран без
       нього, ніж віддати двадцять шість однакових кадрів. */
    if (await s.eval(`!!document.querySelector('.modal-back')`)) {
      await s.eval(`document.querySelectorAll('.modal-back').forEach(e => e.remove()); true`);
      await sleep(300);
      console.log(`\n⚠ ${name}: привітальне вікно довелося прибрати вручну`);
    }
    await s.eval(`document.fonts ? document.fonts.ready.then(() => true) : true`);
    await sleep(800);

    const shot = await s.send('Page.captureScreenshot', { format: 'png' });
    const data = shot.result && shot.result.data;
    if (!data) { failed.push(name); continue; }
    fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(data, 'base64'));
    done++;
    process.stdout.write(`📸 ${name}${ok ? '' : ' ⚠'}  `);
  }

  ws.close();
  edge.kill();
  await sleep(300);
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
  console.log(`\n✔ Знімків: ${done} з ${SHOTS.length} · img/shots/`);
  if (failed.length) console.log('   не вдалися: ' + failed.join(', '));
  process.exit(0);
})().catch(e => { console.error('✖ ' + e.message); process.exit(1); });
