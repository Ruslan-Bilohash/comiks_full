/* Комікс·Lab — 🌍 добір перекладів: що саме не перекладено → завдання для ШІ → назад у tools/lang/<код>/
 *
 *   node tools/i18n-fill.js plan de pl tr lt ar     завдання у tools/.i18n/jobs-<код>.jsonl
 *   node tools/i18n-fill.js merge de                відповіді з out-<код>.jsonl у tsv-словники
 *
 * Чому воно розділене на «plan» і «merge», а не один прохід: ключ до ШІ лежить
 * лише на сервері (локально config.php немає й бути не повинно), тож переклад
 * виконує php-робітник там, а тут ми тільки готуємо завдання й приймаємо роботу.
 * Такий поділ ще й дозволяє перервати справу посередині — завдання лежать
 * файлом, відповіді накопичуються рядками, і повторний запуск доробляє решту.
 *
 * Англійська — джерело. Норвезький оригінал іде з кожним рядком як контекст:
 * ключ у словнику англійський, але учень читає норвезьке речення, і без нього
 * «a measure, programme» перекладається навмання.
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const load = require('./load.js');
const ROOT = load.ROOT;
const WORK = path.join(__dirname, '.i18n');

/* Чуже письмо в перекладі — завжди помилка моделі: у турецькому реченні
   якось опинилося російське слово. Латинські мови не можуть містити кирилиці,
   арабська мусить бути арабською. Такий рядок не беремо зовсім. */
const LATIN = new Set(['de', 'pl', 'tr', 'lt', 'pt', 'en', 'no']);
const wrongScript = (lang, text) => (LATIN.has(lang) ? /[\u0400-\u04FF\u0600-\u06FF]/.test(text)
  : lang === 'ar' ? !/[\u0600-\u06FF]/.test(text) && /[A-Za-z\u0400-\u04FF]{4}/.test(text)
    : lang === 'uk' ? /[\u0600-\u06FF]/.test(text) : false);

const NAMES = { de: 'German', pl: 'Polish', tr: 'Turkish', lt: 'Lithuanian', pt: 'Brazilian Portuguese (pt-BR)', ar: 'Arabic' };
/* Скільки рядків в одному запиті. Довгий текст б'ємо дрібніше: чим більше
   речень в одній відповіді, тим охочіше модель починає їх скорочувати. */
const BATCH = { titles: 20, summaries: 12, lines: 20, vocab: 40, words: 40 };

/* Словник мови: де лежить і під якою назвою. Арабська старша за решту й живе
   окремо — так само, як у збирачі пакетів. */
function packs() {
  const w = {}; w.window = w; vm.createContext(w);
  for (const f of ['data/arabic.js', 'data/lang-de.js', 'data/lang-pl.js', 'data/lang-tr.js', 'data/lang-lt.js', 'data/lang-pt.js']) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), w, { filename: f });
  }
  const out = Object.assign({}, w.TR_PACK || {});
  if (w.AR_EN) out.ar = w.AR_EN;
  return out;
}

/* Усе, що мусить бути перекладене, одним списком. Порядок не випадковий:
   назви й описи йдуть першими, бо саме з них складається сторінка для пошуку,
   а отже з них є сенс починати, якщо роботу доведеться урвати. */
function sources(W) {
  const out = [];
  const comics = W.COMICS.filter(c => !c._private);
  for (const c of comics) {
    const en = c.titleEn || c.title;
    if (en) out.push({ kind: 'titles', en, no: c.title, hint: `comic title, level ${c.level || '?'}` });
  }
  for (const c of comics) {
    if (c.summaryEn) out.push({ kind: 'summaries', en: c.summaryEn, no: c.summaryNo || '', hint: `one-paragraph summary of the comic “${c.titleEn || c.title}”` });
  }
  for (const c of comics) {
    for (const p of c.panels || []) for (const l of p.lines || []) {
      if (l.en) out.push({ kind: 'lines', en: l.en, no: l.no || '', hint: `spoken line from “${c.titleEn || c.title}”${l.who ? `, said by ${l.who}` : ''}` });
    }
  }
  for (const c of comics) {
    for (const v of c.vocab || []) if (v[2]) out.push({ kind: 'vocab', en: v[2], no: v[0] || '', hint: 'dictionary entry' });
  }
  for (const th of ((W.WORDS || {}).themes || [])) {
    for (const wd of th.words || []) if (wd[2]) out.push({ kind: 'words', en: wd[2], no: wd[0] || '', hint: `dictionary entry, topic “${th.title || th.id}”` });
  }
  return out;
}

function plan(langs) {
  const W = load({ skipAudio: true });
  const PK = packs();
  const src = sources(W);
  fs.mkdirSync(WORK, { recursive: true });

  for (const lang of langs) {
    const pack = PK[lang] || {};
    /* Один англійський рядок — один переклад, навіть якщо він трапляється і в
       репліці, і в словничку. Інакше платимо двічі за те саме. */
    const seen = new Set(), need = [];
    for (const s of src) {
      if (seen.has(s.en)) continue;
      seen.add(s.en);
      const have = pack[s.en];
      if (typeof have === 'string' && have.trim()) continue;
      need.push(s);
    }
    const byKind = {};
    for (const n of need) (byKind[n.kind] = byKind[n.kind] || []).push(n);

    const lines = [];
    let id = 0;
    for (const kind of ['titles', 'summaries', 'lines', 'vocab', 'words']) {
      const list = byKind[kind] || [];
      const size = BATCH[kind] || 25;
      for (let i = 0; i < list.length; i += size) {
        const items = list.slice(i, i + size).map((s, j) => ({ k: String(j + 1), en: s.en, no: s.no, hint: s.hint }));
        lines.push(JSON.stringify({ id: `${lang}-${kind}-${++id}`, lang, langName: NAMES[lang] || lang, kind, items }));
      }
    }
    fs.writeFileSync(path.join(WORK, `jobs-${lang}.jsonl`), lines.join('\n') + (lines.length ? '\n' : ''), 'utf8');
    const counts = Object.entries(byKind).map(([k, v]) => `${k} ${v.length}`).join(' · ');
    console.log(`🌍 ${lang}: бракує ${need.length} рядків (${counts || '—'}) → ${lines.length} запитів`);
  }
  console.log(`\nЗавдання: tools/.i18n/jobs-<код>.jsonl`);
}

function merge(langs) {
  for (const lang of langs) {
    const jobsF = path.join(WORK, `jobs-${lang}.jsonl`);
    const outF = path.join(WORK, `out-${lang}.jsonl`);
    if (!fs.existsSync(jobsF) || !fs.existsSync(outF)) { console.log(`⚠ ${lang}: немає jobs- або out-файла — пропускаю`); continue; }
    const jobs = new Map();
    for (const row of fs.readFileSync(jobsF, 'utf8').split('\n')) { if (row.trim()) { const j = JSON.parse(row); jobs.set(j.id, j); } }

    const rows = {}; // kind → [[en, tr], …]
    let got = 0, skipped = 0, same = 0;
    for (const row of fs.readFileSync(outF, 'utf8').split('\n')) {
      if (!row.trim()) continue;
      let r; try { r = JSON.parse(row); } catch (e) { continue; }
      const job = jobs.get(r.id);
      if (!job || !r.ok || !r.map) { skipped++; continue; }
      for (const it of job.items) {
        const tr = r.map[it.k];
        if (typeof tr !== 'string' || !tr.trim()) { skipped++; continue; }
        if (wrongScript(lang, tr)) { skipped++; continue; }
        /* Переклад, що дослівно повторює англійське, трапляється законно
           («Oslo», «NAV»), тож не відкидаємо — лише рахуємо, щоб було видно,
           коли модель почала просто переписувати вхід. */
        if (tr.trim() === it.en.trim()) same++;
        (rows[job.kind] = rows[job.kind] || []).push([it.en, tr.trim().replace(/[\t\r\n]+/g, ' ')]);
        got++;
      }
    }
    const dir = path.join(__dirname, 'lang', lang);
    fs.mkdirSync(dir, { recursive: true });
    for (const [kind, list] of Object.entries(rows)) {
      const f = path.join(dir, `90-ai-${kind}.tsv`);
      /* Дописуємо, а не перезаписуємо: роботу можна робити кількома заходами.
         Повторний ключ не шкодить — збирач пакетів бере останній. */
      const prev = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').replace(/\n*$/, '\n') : '';
      fs.writeFileSync(f, prev + list.map(([a, b]) => `${a}\t${b}`).join('\n') + '\n', 'utf8');
    }
    const where = Object.entries(rows).map(([k, v]) => `${k} ${v.length}`).join(' · ');
    console.log(`🌍 ${lang}: прийнято ${got} (${where || '—'})${skipped ? ` · пропущено ${skipped}` : ''}${same ? ` · збіглося з англійською ${same}` : ''}`);
  }
  console.log('\nДалі: node tools/build-langpack.js && node tools/build.js');
}

/* ───────── рядки самих сторінок ─────────
   Словник перекладу дає зміст коміксу, але сторінка складається ще й із власного
   тексту: заголовки, кнопки, опис для пошуку. Його мало (десятки рядків), зате
   без нього сторінка виходить двомовною — саме те, через що її й не варто
   публікувати. Тримаємо його окремим файлом на мову, а не в коді збірки:
   перекладати json простіше, ніж правити шаблони. */
const flat = (obj, pre = '') => Object.entries(obj).flatMap(([k, v]) =>
  k.startsWith('_') ? [] : (typeof v === 'object' && v ? flat(v, pre + k + '.') : [[pre + k, String(v)]]));

const HINTS = {
  Tpl: 'keep the {…} placeholder exactly as it is',
  title: 'page title for search results, keep “| Komiks·Lab” at the end',
  desc: 'meta description for search results, one sentence',
  cta: 'button label, keep the emoji and the arrow',
};
const hintFor = key => {
  const h = [];
  if (/Tpl$/.test(key)) h.push(HINTS.Tpl);
  if (/^tests\.title$|hubT$/.test(key)) h.push(HINTS.title);
  if (/\.desc$|hubD/.test(key)) h.push(HINTS.desc);
  if (/cta$|examB$|placeB$|^comics\.top$/.test(key)) h.push(HINTS.cta);
  if (/^tests\.item\dd$|^tests\.basic\dd$|lead$|examD$|free$|hubP$/.test(key)) h.push('explanatory text for learners, translate fully and naturally');
  /* «English translation» на англійській сторінці означає «переклад мовою цієї
     сторінки». Дослівний переклад дав «Dialog auf Norwegisch mit englischer
     Übersetzung» на німецькій сторінці, де переклад насправді німецький —
     тому саме про ці рядки треба сказати моделі окремо. */
  if (/^comics\.(dlg|descPost|hubDTpl|hubP)$/.test(key)) {
    h.push('IMPORTANT: this page shows the translation INTO your target language, so do not keep the word “English” — write “<your language> translation” instead, correctly inflected for the sentence');
  }
  return (h.length ? h.join('; ') : 'interface text of the page') + '; the subject is learning Norwegian';
};

function planPages(langs) {
  const en = JSON.parse(fs.readFileSync(path.join(__dirname, 'lang', 'pages-en.json'), 'utf8'));
  const rows = flat(en);
  fs.mkdirSync(WORK, { recursive: true });
  for (const lang of langs) {
    const outF = path.join(__dirname, 'lang', 'pages', `${lang}.json`);
    const have = fs.existsSync(outF) ? flat(JSON.parse(fs.readFileSync(outF, 'utf8'))) : [];
    const haveK = new Set(have.filter(([, v]) => v.trim()).map(([k]) => k));
    const need = rows.filter(([k]) => !haveK.has(k));
    if (!need.length) { console.log(`🌍 ${lang}: сторінкові рядки вже перекладені`); continue; }
    const lines = [];
    /* По групах: заголовки сторінки коміксів і сторінки тестів — різні за
       настроєм тексти, і моделі легше тримати один регістр на запит. */
    for (const grp of ['comics', 'tests', 'updates', 'news']) {
      const list = need.filter(([k]) => k.startsWith(grp + '.'));
      for (let i = 0; i < list.length; i += 18) {
        const items = list.slice(i, i + 18).map(([k, v], j) => ({ k: String(j + 1), key: k, en: v, no: '', hint: hintFor(k) }));
        lines.push(JSON.stringify({ id: `${lang}-pages-${grp}-${i / 18 + 1}`, lang, langName: NAMES[lang] || lang, kind: 'pages', items }));
      }
    }
    fs.writeFileSync(path.join(WORK, `jobs-pages-${lang}.jsonl`), lines.join('\n') + '\n', 'utf8');
    console.log(`🌍 ${lang}: ${need.length} сторінкових рядків → ${lines.length} запитів`);
  }
}

function mergePages(langs) {
  for (const lang of langs) {
    const jobsF = path.join(WORK, `jobs-pages-${lang}.jsonl`);
    const outF = path.join(WORK, `out-pages-${lang}.jsonl`);
    if (!fs.existsSync(jobsF) || !fs.existsSync(outF)) { console.log(`⚠ ${lang}: немає завдань або відповідей для сторінок`); continue; }
    const jobs = new Map();
    for (const row of fs.readFileSync(jobsF, 'utf8').split('\n')) if (row.trim()) { const j = JSON.parse(row); jobs.set(j.id, j); }
    const dst = path.join(__dirname, 'lang', 'pages', `${lang}.json`);
    const tree = fs.existsSync(dst) ? JSON.parse(fs.readFileSync(dst, 'utf8')) : {};
    let got = 0, lost = 0;
    for (const row of fs.readFileSync(outF, 'utf8').split('\n')) {
      if (!row.trim()) continue;
      let r; try { r = JSON.parse(row); } catch (e) { continue; }
      const job = jobs.get(r.id);
      if (!job || !r.ok || !r.map) continue;
      for (const it of job.items) {
        const tr = r.map[it.k];
        if (typeof tr !== 'string' || !tr.trim()) { lost++; continue; }
        /* Загублена дужка у шаблоні — це «Рівень {l}» без рівня на живій
           сторінці, тож такий рядок краще не брати зовсім. */
        const need = (it.en.match(/\{[a-z]+\}/g) || []);
        if (need.some(ph => !tr.includes(ph))) { lost++; continue; }
        const parts = it.key.split('.');
        let node = tree;
        while (parts.length > 1) { const p = parts.shift(); node = node[p] = node[p] || {}; }
        node[parts[0]] = tr.trim();
        got++;
      }
    }
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.writeFileSync(dst, JSON.stringify(tree, null, 2) + '\n', 'utf8');
    console.log(`🌍 ${lang}: сторінкових рядків прийнято ${got}${lost ? ` · відкинуто ${lost}` : ''} → tools/lang/pages/${lang}.json`);
  }
}

/* ───────── журнал оновлень ─────────
   Записи журналу лежать у data/updates.js — по масиву рядків на мову. Українська,
   англійська, норвезька й арабська написані там руками; решту мов тримаємо
   окремим файлом (data/updates-lang.js), щоб не чіпати джерело, яке людина
   редагує щоразу, коли щось випускає.
   Підписи до знімків написані лише українською, тож на англійській сторінці під
   картинкою досі стояв український рядок. Їх перекладаємо з української. */
function loadUpd() {
  const w = {}; w.window = w; vm.createContext(w);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'data', 'updates.js'), 'utf8'), w, { filename: 'updates.js' });
  const f = path.join(ROOT, 'data', 'updates-lang.js');
  if (fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, 'utf8'), w, { filename: 'updates-lang.js' });
  return { list: w.KOMIKS_UPDATES || [], tr: w.KOMIKS_UPDATES_TR || {} };
}
const SHOTS_F = path.join(__dirname, 'lang', 'shots.json');
const loadCaps = () => (fs.existsSync(SHOTS_F) ? JSON.parse(fs.readFileSync(SHOTS_F, 'utf8')) : {});

/* Для журналу цільовою мовою буває й та, що в словниках не зустрічається: підписи
   до знімків треба перекласти й англійською, і норвезькою. */
const FULL = Object.assign({ en: 'English', no: 'Norwegian (Bokmål)', uk: 'Ukrainian' }, NAMES);

function planUpd(langs) {
  const { list, tr } = loadUpd();
  const caps = loadCaps();
  /* Підписи приходять із двох місць: у самих записах вони написані українською,
     а для знімків, дібраних за словами рядка, — англійською. Мову оригіналу
     треба знати напевно, інакше модель перекладає навмання. */
  const altF = path.join(__dirname, 'lang', 'shot-alt.json');
  const alts = fs.existsSync(altF) ? Object.values(JSON.parse(fs.readFileSync(altF, 'utf8'))) : [];
  const capUk = [...new Set(list.flatMap(u => (u.shots || []).map(s => s[1])).filter(Boolean))];
  const isUk = new Set(capUk);
  const capList = capUk.concat([...new Set(alts)].filter(c => c && c !== 'Komiks·Lab' && !isUk.has(c)));
  fs.mkdirSync(WORK, { recursive: true });
  for (const lang of langs) {
    const items = [];
    /* Рядки запису. Мова, яку вже написали руками в data/updates.js, нас не
       обходить: ручний текст завжди кращий за машинний. */
    for (const u of list) {
      if (Array.isArray(u[lang]) && u[lang].length) continue;
      const done = (tr[lang] || {})[u.id];
      if (Array.isArray(done) && done.length === (u.en || []).length) continue;
      (u.en || []).forEach((line, i) => items.push({ key: `upd:${u.id}#${i}`, en: line, hint: 'entry in the update log of the app, written for learners' }));
    }
    /* Перекладати рядок тією самою мовою, якою він уже написаний, нема сенсу. */
    const capNeed = capList.filter(c => !((caps[c] || {})[lang] || '').trim() && !(isUk.has(c) ? lang === 'uk' : lang === 'en'));
    for (const c of capNeed) items.push({ key: `cap:${c}`, en: c, srcUk: isUk.has(c), hint: 'caption under a screenshot, a few words' });

    if (!items.length) { console.log(`🌍 ${lang}: журнал уже перекладено`); continue; }
    const lines = [];
    /* Підписи йдуть з української, записи — з англійської, тож це різні запити:
       мову оригіналу модель мусить знати напевно. */
    for (const [srcLang, group] of [['English', items.filter(i => !i.srcUk)], ['Ukrainian', items.filter(i => i.srcUk)]]) {
      for (let i = 0; i < group.length; i += 20) {
        const chunk = group.slice(i, i + 20).map((it, j) => ({ k: String(j + 1), key: it.key, en: it.en, no: '', hint: it.hint }));
        lines.push(JSON.stringify({ id: `${lang}-news-${srcLang}-${i / 20 + 1}`, lang, langName: FULL[lang] || lang, srcLang, kind: 'news', items: chunk }));
      }
    }
    fs.writeFileSync(path.join(WORK, `jobs-upd-${lang}.jsonl`), lines.join('\n') + '\n', 'utf8');
    console.log(`🌍 ${lang}: ${items.length} рядків журналу → ${lines.length} запитів`);
  }
}

function mergeUpd(langs) {
  const { list, tr } = loadUpd();
  const caps = loadCaps();
  const byId = new Map(list.map(u => [u.id, u]));
  for (const lang of langs) {
    const jobsF = path.join(WORK, `jobs-upd-${lang}.jsonl`), outF = path.join(WORK, `out-upd-${lang}.jsonl`);
    if (!fs.existsSync(jobsF) || !fs.existsSync(outF)) { console.log(`⚠ ${lang}: немає завдань або відповідей журналу`); continue; }
    const jobs = new Map();
    for (const row of fs.readFileSync(jobsF, 'utf8').split('\n')) if (row.trim()) { const j = JSON.parse(row); jobs.set(j.id, j); }
    let got = 0, capGot = 0;
    for (const row of fs.readFileSync(outF, 'utf8').split('\n')) {
      if (!row.trim()) continue;
      let r; try { r = JSON.parse(row); } catch (e) { continue; }
      const job = jobs.get(r.id);
      if (!job || !r.ok || !r.map) continue;
      for (const it of job.items) {
        const v = r.map[it.k];
        if (typeof v !== 'string' || !v.trim()) continue;
        if (it.key.startsWith('cap:')) { const c = it.key.slice(4); (caps[c] = caps[c] || {})[lang] = v.trim(); capGot++; continue; }
        const [id, idx] = it.key.slice(4).split('#');
        const u = byId.get(id); if (!u) continue;
        const arr = ((tr[lang] = tr[lang] || {})[id] = tr[lang][id] || new Array((u.en || []).length).fill(''));
        arr[Number(idx)] = v.trim();
        got++;
      }
    }
    console.log(`🌍 ${lang}: журнал +${got} рядків · підписи +${capGot}`);
  }
  /* Записуємо обидва файли одразу: вони разом описують журнал іншими мовами,
     і розсинхронізувати їх було б найлегшим способом отримати напівпорожню
     сторінку. */
  const head = '/* Комікс·Lab — журнал оновлень іншими мовами.\n'
    + '   Українська, англійська, норвезька й арабська живуть у data/updates.js — їх пишуть руками.\n'
    + '   Тут лежить машинний переклад решти мов: збирається через node tools/i18n-fill.js plan-upd/merge-upd.\n'
    + '   Ключ — той самий id запису. */\n';
  fs.writeFileSync(path.join(ROOT, 'data', 'updates-lang.js'),
    head + 'window.KOMIKS_UPDATES_TR = ' + JSON.stringify(tr, null, 1) + ';\n', 'utf8');
  fs.mkdirSync(path.dirname(SHOTS_F), { recursive: true });
  fs.writeFileSync(SHOTS_F, JSON.stringify(caps, null, 1) + '\n', 'utf8');
  console.log('→ data/updates-lang.js · tools/lang/shots.json');
}

const [cmd, ...rest] = process.argv.slice(2);
const langs = rest.filter(x => !x.startsWith('-'));
const pick = langs.length ? langs : Object.keys(NAMES);
if (cmd === 'plan') plan(pick);
else if (cmd === 'merge') merge(pick);
else if (cmd === 'plan-pages') planPages(pick);
else if (cmd === 'merge-pages') mergePages(pick);
else if (cmd === 'plan-upd') planUpd(pick);
else if (cmd === 'merge-upd') mergeUpd(pick);
else { console.log('node tools/i18n-fill.js plan|merge|plan-pages|merge-pages|plan-upd|merge-upd [de pl tr lt ar]'); process.exit(1); }
