/* Комікс·Lab — 🌍 текст самого застосунку: збирання, переклад, підстановка.
 *
 *   node tools/app-i18n.js scan     що саме ще не перекладено → tools/.i18n/app-en.json
 *   node tools/app-i18n.js wire     вставляє в модулі виклик підстановки (один раз)
 *   node tools/app-i18n.js build    data/app-i18n.js зі словників tools/lang/app/<код>.json
 *
 * Чому так. Кожен модуль тримає свої написи в таблиці { uk: {…}, en: {…}, no: {…} },
 * а бере з неї рядки виразом T[ui] || T.en. Дописувати в ці таблиці ще чотири мови
 * руками — двадцять файлів і тисяча рядків у кожному; будь-яка правка тексту
 * розсинхронізує їх назавжди. Тому переклад лежить окремо (data/app-i18n.js), а
 * модуль на старті добирає з нього свої мови:
 *
 *     KL_T_FILL(TABLE, 'файл:НАЗВА')
 *
 * Підстановка завжди починає з англійської копії, тож ключ, якого в перекладі
 * немає — передусім функції з відмінюванням, — лишається англійським, а не зникає.
 * Нічого не ламається й тоді, коли словника взагалі немає.
 */
const fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const WORK = path.join(__dirname, '.i18n');
const DICT = path.join(__dirname, 'lang', 'app');
/* Арабська й норвезька частково написані просто в модулях — там, де вони є,
   нічого не чіпаємо: ручний текст кращий за машинний. Словник добирає лише
   таблиці, яких цією мовою не існує зовсім. */
/* Чуже письмо в перекладі — завжди помилка моделі: у турецькому реченні
   якось опинилося російське слово. Латинські мови не можуть містити кирилиці,
   арабська мусить бути арабською. Такий рядок не беремо зовсім. */
const LATIN = new Set(['de', 'pl', 'tr', 'lt', 'pt', 'en', 'no']);
const wrongScript = (lang, text) => (LATIN.has(lang) ? /[\u0400-\u04FF\u0600-\u06FF]/.test(text)
  : lang === 'ar' ? !/[\u0600-\u06FF]/.test(text) && /[A-Za-z\u0400-\u04FF]{4}/.test(text)
    : lang === 'uk' ? /[\u0600-\u06FF]/.test(text) : false);

const LANGS = ['de', 'pl', 'tr', 'lt', 'pt', 'ar', 'no'];
const META = () => { const f = path.join(__dirname, 'lang', 'app-meta.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}; };
const needsLang = (meta, id, lang) => !((meta[id] || {}).langs || []).includes(lang);

/* Таблиця написів може згадувати щось ізвні — наприклад скільки тестів дають
   гостю: «Without an account you can take ${GUEST_MAX} tests». Обчислена
   окремо, вона падає з «GUEST_MAX is not defined», і доти такі таблиці просто
   зникали з перекладу — стіна для гостя лишалася англійською всім мовам.
   Тепер бракуючі імена підставляємо: значення беремо з того самого файла, щоб
   текст збігався з тим, що бачить людина. */
function evalTable(lit, src) {
  const extra = {};
  for (let tries = 0; tries < 10; tries++) {
    const names = Object.keys(extra);
    try {
      const obj = new Function(...names, 'return (' + lit + ')')(...names.map(n => extra[n]));
      return (obj && obj.uk && obj.en && typeof obj.en === 'object') ? obj : null;
    } catch (e) {
      const m = /([A-Za-z_$][\w$]*) is not defined/.exec(e.message || '');
      if (!m) return null;
      const num = new RegExp('const\\s+' + m[1] + '\\s*=\\s*(-?\\d+)').exec(src);
      extra[m[1]] = num ? Number(num[1]) : 1;
    }
  }
  return null;
}

/* Знаходить таблиці виду `const NAME = { uk: {…}, en: {…} }`: від «uk: {» назад
   до дужки, що відкриває таблицю, і вперед до парної. Парсити JavaScript
   по-справжньому заради двадцяти файлів не варто, а дужки тут рахуються чесно. */
function tables(src) {
  const out = [];
  let i = 0;
  while ((i = src.indexOf('uk: {', i)) !== -1) {
    const open = src.lastIndexOf('{', i);
    if (open === -1) { i += 5; continue; }
    let depth = 0, end = -1;
    for (let j = open; j < src.length; j++) {
      const c = src[j];
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) { end = j; break; } }
    }
    if (end === -1) break;
    const lit = src.slice(open, end + 1);
    i = end;
    const obj = evalTable(lit, src);
    if (!obj) continue;
    if (!obj || !obj.uk || !obj.en || typeof obj.en !== 'object') continue;
    /* Назва таблиці — те, що стоїть перед дужкою. Без назви підставляти нікуди. */
    const before = src.slice(Math.max(0, open - 120), open);
    const m = before.match(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*$/);
    if (!m) continue;
    out.push({ name: m[1], open, end, obj });
  }
  return out;
}

/* Перекладові піддається лише простий текст: рядок або масив рядків. Функція —
   це відмінювання («1 день / 2 дні / 5 днів»), і машинний переклад тіла функції
   дав би зламаний код замість перекладу. */
const simple = v => typeof v === 'string' || (Array.isArray(v) && v.every(x => typeof x === 'string'));

function scan() {
  const out = {}, meta = {};
  let nStr = 0, nFn = 0, nTab = 0;
  for (const f of fs.readdirSync(ASSETS).filter(x => x.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(ASSETS, f), 'utf8');
    for (const t of tables(src)) {
      // мову вже дописали руками — пропускаємо лише таблицю, де написані всі мови;
      // інакше нова мова (pt) не отримала б таблиць, які мають ручну німецьку
      if (LANGS.every(l => t.obj[l])) continue;
      const vals = {};
      for (const [k, v] of Object.entries(t.obj.en)) {
        if (simple(v)) { vals[k] = v; nStr += Array.isArray(v) ? v.length : 1; }
        else if (typeof v === 'function') nFn++;
      }
      if (!Object.keys(vals).length) continue;
      const id = `${f}:${t.name}`;
      out[id] = vals;
      meta[id] = {
        n: Object.values(vals).reduce((s, v) => s + (Array.isArray(v) ? v.length : 1), 0),
        langs: Object.keys(t.obj).filter(l => t.obj[l] && typeof t.obj[l] === 'object'),
        /* Назви ключів потрібні сторінці перекладів в адмінці: без них вона
           сказала б «бракує сорока рядків», не кажучи яких саме. */
        keys: Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, Array.isArray(v) ? v.length : 1])),
      };
      nTab++;
    }
  }
  fs.mkdirSync(WORK, { recursive: true });
  fs.writeFileSync(path.join(WORK, 'app-en.json'), JSON.stringify(out, null, 1), 'utf8');
  /* Окремо — скільки рядків у кожній таблиці й якими мовами вона написана в
     самому модулі. Без цього сторінка перекладів в адмінці не змогла б сказати,
     чи закриті написи застосунку українською та арабською: вони лежать не в
     словниках, а просто в коді. */
  fs.writeFileSync(path.join(__dirname, 'lang', 'app-meta.json'), JSON.stringify(meta, null, 1), 'utf8');
  console.log(`🔍 таблиць ${nTab} · рядків ${nStr} на мову · функцій ${nFn} (лишаються англійськими)`);
  console.log('→ tools/.i18n/app-en.json');
}

function wire() {
  const todo = JSON.parse(fs.readFileSync(path.join(WORK, 'app-en.json'), 'utf8'));
  const byFile = {};
  for (const id of Object.keys(todo)) { const [f, n] = id.split(':'); (byFile[f] = byFile[f] || []).push(n); }
  let done = 0;
  for (const [f, names] of Object.entries(byFile)) {
    const p = path.join(ASSETS, f);
    let src = fs.readFileSync(p, 'utf8');
    const crlf = src.includes('\r\n');
    if (crlf) src = src.replace(/\r\n/g, '\n');
    /* Вставляємо з кінця файла, щоб попередні вставки не зсували наступних. */
    const list = tables(src).filter(t => names.includes(t.name) && !src.includes(`KL_T_FILL(${t.name},`))
      .sort((a, b) => b.end - a.end);
    for (const t of list) {
      let k = src.indexOf('\n', t.end);
      if (k === -1) k = src.length;
      const indent = (src.slice(src.lastIndexOf('\n', t.open) + 1, t.open).match(/^\s*/) || [''])[0];
      /* Виклик захищений перевіркою: без data/app-i18n.js застосунок має
         працювати так само, як працював, — просто англійською. */
      src = src.slice(0, k) + `\n${indent}if (window.KL_T_FILL) KL_T_FILL(${t.name}, '${f}:${t.name}');` + src.slice(k);
      done++;
    }
    if (crlf) src = src.replace(/\n/g, '\r\n');
    fs.writeFileSync(p, src, 'utf8');
  }
  console.log(`🔌 вставлено викликів підстановки: ${done}`);
}

function build() {
  const en = JSON.parse(fs.readFileSync(path.join(WORK, 'app-en.json'), 'utf8'));
  const data = {};
  let n = 0;
  for (const lang of LANGS) {
    const f = path.join(DICT, `${lang}.json`);
    if (!fs.existsSync(f)) { console.log(`⏭ ${lang}: немає tools/lang/app/${lang}.json`); continue; }
    const tr = JSON.parse(fs.readFileSync(f, 'utf8'));
    const meta = META();
    for (const [id, vals] of Object.entries(en)) {
      const got = tr[id]; if (!got) continue;
      if (!needsLang(meta, id, lang)) continue;   // мову цієї таблиці написали руками
      for (const [k, v] of Object.entries(vals)) {
        const t = got[k];
        if (t === undefined) continue;
        /* Довжина масиву має збігатися: три підписи проти двох — це зсув
           підписів на екрані, а не переклад. */
        if (Array.isArray(v) && (!Array.isArray(t) || t.length !== v.length)) continue;
        if (!Array.isArray(v) && typeof t !== 'string') continue;
        ((data[id] = data[id] || {})[lang] = data[id][lang] || {})[k] = t;
        n += Array.isArray(t) ? t.length : 1;
      }
    }
  }
  /* Файл на мову, а не один на всіх: разом вони важать під двісті кілобайт, і
     змушувати українця вантажити литовські написи заради однакового коду —
     найдорожча однаковість у проєкті. Потрібну мову добирає boot.js. */
  let total = 0;
  for (const lang of LANGS) {
    /* Рівень мови лишається всередині: підстановка шукає src[lang], і без нього
       вона взялася б розкладати по таблиці самі ключі. */
    const one = {};
    for (const [id, byLang] of Object.entries(data)) if (byLang[lang]) one[id] = { [lang]: byLang[lang] };
    if (!Object.keys(one).length) continue;
    const head = `/* Комікс·Lab — написи застосунку мовою «${lang}».\n`
      + '   Збирається з tools/lang/app/<код>.json через node tools/app-i18n.js build.\n'
      + '   Вантажиться лише тим, хто обрав цю мову інтерфейсу (див. assets/boot.js), а\n'
      + '   модулі беруть звідси свої рядки через KL_T_FILL: ключа немає — лишається\n'
      + '   англійський, тож неповний словник нічого не ламає. */\n';
    const body = 'window.KL_T = Object.assign(window.KL_T || {}, ' + JSON.stringify(one) + ');\n'
      /* Позначка «ця мова вже є»: за нею застосунок розуміє, чи треба
         довантажувати файл, коли мову перемикають на льоту. */
      + `window.KL_T_HAVE = (window.KL_T_HAVE || []).concat('${lang}');\n`
      + 'if (window.KL_T_APPLY) window.KL_T_APPLY();\n';
    const f = path.join(ROOT, 'data', `app-i18n-${lang}.js`);
    fs.writeFileSync(f, head + body, 'utf8');
    const kb = Math.round(fs.statSync(f).size / 1024);
    total += Object.keys(one).length;
    console.log(`🌍 data/app-i18n-${lang}.js · ${Object.keys(one).length} таблиць · ${kb} КБ`);
  }
  console.log(`   разом ${n} перекладених рядків у ${total / LANGS.length | 0} таблицях на мову`);
}

/* ───────── переклад ─────────
   Той самий поділ, що й у решті словників: тут готуємо завдання й приймаємо
   роботу, а перекладає php-робітник на сервері, бо ключ живе лише там. */
function planTr(langs) {
  const en = JSON.parse(fs.readFileSync(path.join(WORK, 'app-en.json'), 'utf8'));
  /* Ключ перекладу — «таблиця|ключ|номер у масиві». Рядок повторюється в різних
     таблицях рідко, зате порядок масиву важливий, тож нумеруємо явно. */
  const meta = META();
  const rows = [];
  for (const [id, vals] of Object.entries(en)) {
    for (const [k, v] of Object.entries(vals)) {
      if (Array.isArray(v)) v.forEach((x, i) => rows.push({ id, key: `${id}|${k}|${i}`, en: x }));
      else rows.push({ id, key: `${id}|${k}`, en: v });
    }
  }
  fs.mkdirSync(WORK, { recursive: true });
  for (const lang of langs) {
    const f = path.join(DICT, `${lang}.json`);
    const have = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
    const need = rows.filter(r => needsLang(meta, r.id, lang)).filter(r => {
      const [id, k, i] = r.key.split('|');
      const got = ((have[id] || {})[k]);
      return i === undefined ? typeof got !== 'string' : !(Array.isArray(got) && typeof got[+i] === 'string');
    });
    if (!need.length) { console.log(`🌍 ${lang}: написи застосунку вже перекладені`); continue; }
    const lines = [];
    for (let i = 0; i < need.length; i += 25) {
      const items = need.slice(i, i + 25).map((r, j) => ({ k: String(j + 1), key: r.key, en: r.en, no: '', hint: 'button, heading or short explanation inside the app' }));
      lines.push(JSON.stringify({ id: `${lang}-app-${i / 25 + 1}`, lang, langName: { de: 'German', pl: 'Polish', tr: 'Turkish', lt: 'Lithuanian', pt: 'Brazilian Portuguese (pt-BR)' }[lang] || lang, kind: 'pages', items }));
    }
    fs.writeFileSync(path.join(WORK, `jobs-app-${lang}.jsonl`), lines.join('\n') + '\n', 'utf8');
    console.log(`🌍 ${lang}: ${need.length} написів → ${lines.length} запитів`);
  }
}

function mergeTr(langs) {
  const en = JSON.parse(fs.readFileSync(path.join(WORK, 'app-en.json'), 'utf8'));
  fs.mkdirSync(DICT, { recursive: true });
  for (const lang of langs) {
    const jobsF = path.join(WORK, `jobs-app-${lang}.jsonl`), outF = path.join(WORK, `out-app-${lang}.jsonl`);
    if (!fs.existsSync(jobsF) || !fs.existsSync(outF)) { console.log(`⚠ ${lang}: немає завдань або відповідей`); continue; }
    const jobs = new Map();
    for (const row of fs.readFileSync(jobsF, 'utf8').split('\n')) if (row.trim()) { const j = JSON.parse(row); jobs.set(j.id, j); }
    const dst = path.join(DICT, `${lang}.json`);
    const tree = fs.existsSync(dst) ? JSON.parse(fs.readFileSync(dst, 'utf8')) : {};
    let got = 0, lost = 0;
    for (const row of fs.readFileSync(outF, 'utf8').split('\n')) {
      if (!row.trim()) continue;
      let r; try { r = JSON.parse(row); } catch (e) { continue; }
      const job = jobs.get(r.id);
      if (!job || !r.ok || !r.map) continue;
      for (const it of job.items) {
        const v = r.map[it.k];
        if (typeof v !== 'string' || !v.trim() || wrongScript(lang, v)) { lost++; continue; }
        /* Напис із {дужками} — це шаблон: у ньому стоять число питання або
           рахунок. Переклад, що загубив дужку, показав би «Питання з» без
           числа, тож такий рядок не беремо. */
        const need = it.en.match(/\{\w+\}/g) || [];
        if (need.some(ph => !v.includes(ph))) { lost++; continue; }
        const [id, k, i] = it.key.split('|');
        const node = (tree[id] = tree[id] || {});
        if (i === undefined) node[k] = v.trim();
        else {
          const len = ((en[id] || {})[k] || []).length;
          if (!Array.isArray(node[k])) node[k] = new Array(len).fill('');
          node[k][+i] = v.trim();
        }
        got++;
      }
    }
    fs.writeFileSync(dst, JSON.stringify(tree, null, 1) + '\n', 'utf8');
    console.log(`🌍 ${lang}: прийнято ${got}${lost ? ` · відкинуто ${lost}` : ''} → tools/lang/app/${lang}.json`);
  }
}

const cmd = process.argv[2];
const pick = process.argv.slice(3).filter(x => !x.startsWith('-'));
if (cmd === 'plan') planTr(pick.length ? pick : LANGS);
else if (cmd === 'merge') mergeTr(pick.length ? pick : LANGS);
else if (cmd === 'scan') scan();
else if (cmd === 'wire') wire();
else if (cmd === 'build') build();
else { console.log('node tools/app-i18n.js scan|wire|plan|merge|build [de pl tr lt]'); process.exit(1); }
