#!/usr/bin/env node
/* Комікс·Lab — 📸 знімки гри «Двобій 3D» для сторінки ігор.
 *
 *   node tools/shots-game.js
 *
 * Гра живе окремо (bilohash.com/games/too_much/), тож знімаємо її з живої
 * адреси, а не з локальної збірки. На відміну від знімків сайту тут потрібні
 * кліки: меню саме по собі показує лише кнопки, а продати гру може тільки
 * кадр бою.
 *
 * Розмір навмисно альбомний, 1280×720: гра тривимірна й горизонтальна, і
 * телефонний портрет показав би чорні поля замість арени. Формат — jpeg:
 * тривимірна сцена з градієнтами в png важить по 600 КБ на кадр, а на сторінці
 * їх чотири, і сторінка з них була б удвічі важча за саму гру.
 *
 * Чекаємо не час, а екран. Гра вантажить рушій і моделі, і на програмному
 * рендері це від секунд до десятків секунд: фіксована пауза дала знімок смужки
 * завантаження замість меню, а наступні кліки пішли в порожнечу й зсунули всі
 * чотири кадри. Тому кожен крок має ознаку готовності — видимий елемент.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'img', 'games');
/* Знімаємо англійською навмисно. Гра говорить трьома мовами, а сторінка ігор
   виходить вісьмома: шість із них відкривають гру з ?lang=en, тож англійський
   інтерфейс на знімку — те, що побачить більшість. Українською гра відкрилася б
   і без прапорця, і тоді німець бачив би на знімках кирилицю. */
const URL_GAME = process.env.KL_GAME_URL || 'https://bilohash.com/games/too_much/?lang=en';
const CDP = 9347;
const EDGE = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p));
if (!EDGE) { console.error('✖ Microsoft Edge не знайдено.'); process.exit(1); }

/* файл · кроки до знімка · ознака готовності · скільки ще домалювати, мс
   Крок 'RELOAD' повертає гру на початок: з бою назад у меню дороги немає. */
const SHOTS = [
  ['duel3d-1-meny', [], '#goCamp', 600],
  ['duel3d-2-velg', ['#goCpu'], '#selGo', 1200],
  /* Бій: ознака — таймер над ареною. Моделі й анімації домальовуються вже
     після появи HUD, тож тут потрібна ще й пауза, інакше бійці стоять стовпами. */
  ['duel3d-3-kamp', ['#selGo'], '#timer', 4500],
  /* Екран кампанії ховається за вибором бійця: goCamp веде лише до складу,
     а сюжет етапу показується вже після selGo. */
  ['duel3d-4-historie', ['RELOAD', '#goCamp', '#selGo'], '#stStage', 1500],
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
  fs.mkdirSync(OUT, { recursive: true });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'kl-game-'));
  const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
    '--use-gl=swiftshader', '--enable-unsafe-swiftshader',   // 3D без відеокарти: інакше арена чорна
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
  await s.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });

  /* Видимий — це саме offsetParent, а не наявність у документі: усі екрани гри
     лежать у розмітці одразу й ховаються стилем. */
  const seen = sel => s.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); return !!(e && e.offsetParent); })()`);
  const waitFor = async (sel, limit = 60000) => {
    for (let t = 0; t < limit; t += 300) { if (await seen(sel)) return true; await sleep(300); }
    return false;
  };
  const click = sel => s.eval(`(() => { const b = document.querySelector(${JSON.stringify(sel)}); if (!b || !b.offsetParent) return false; b.click(); return true; })()`);

  const open = async () => {
    await s.send('Page.navigate', { url: URL_GAME });
    /* Гра питає про поворот екрана й пропонує «Грати так» — у headless це
       вікно перекриває все інше. Кнопка зʼявляється не одразу. */
    for (let t = 0; t < 20000; t += 300) { if (await click('#rotateSkip')) break; await sleep(300); }
    if (!await waitFor('#goCamp')) console.log('   ⚠ меню так і не зʼявилося');
    await sleep(500);
  };

  await open();
  const done = [], weak = [];
  for (const [name, steps, ready, settle] of SHOTS) {
    for (const sel of steps) {
      if (sel === 'RELOAD') { await open(); continue; }
      let hit = false;
      for (let t = 0; t < 20000 && !hit; t += 300) { hit = await click(sel); if (!hit) await sleep(300); }
      if (!hit) console.log(`   ⚠ ${name}: не дочекався кнопки ${sel}`);
      await sleep(400);
    }
    if (!await waitFor(ready)) { weak.push(name); console.log(`   ⚠ ${name}: екран ${ready} не зʼявився — кадр може бути не тим`); }
    await sleep(settle);
    const shot = await s.send('Page.captureScreenshot', { format: 'jpeg', quality: 86 });
    const data = shot.result && shot.result.data;
    if (!data) { console.log(`   ✖ ${name}: кадр не вийшов`); continue; }
    fs.writeFileSync(path.join(OUT, name + '.jpg'), Buffer.from(data, 'base64'));
    done.push(name);
    process.stdout.write(`📸 ${name}  `);
  }

  ws.close();
  edge.kill();
  await sleep(300);
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* тимчасовий профіль */ }
  console.log(`\n✔ знімків: ${done.length} → img/games/`);
  if (weak.length) { console.log(`✖ сумнівні кадри: ${weak.join(', ')} — перегляньте очима`); process.exit(1); }
})();
