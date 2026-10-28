/* Комікс·Lab — 🌍 навчальні дані іншими мовами: граматика, основи, персонажі.
 *
 *   node tools/learn-i18n.js plan de pl tr lt ar
 *   node tools/learn-i18n.js merge de pl tr lt ar   → tools/lang/<код>/95-learn.tsv
 *
 * Граматика зберігає переклад позиційно: ["jeg", "я", "I"] — норвезька,
 * українська, англійська. Дописати туди ще п'ять мов означало б переписати і
 * дані, і все, що їх читає. Натомість застосунок уже вміє шукати переклад за
 * англійським рядком у словнику (так зроблено для арабської), тож цим шляхом
 * і йдемо: звідси беремо англійські рядки, а переклад лягає у звичайні tsv.
 */
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.join(__dirname, '..');
const WORK = path.join(__dirname, '.i18n');
/* Чуже письмо в перекладі — завжди помилка моделі: у турецькому реченні
   якось опинилося російське слово. Латинські мови не можуть містити кирилиці,
   арабська мусить бути арабською. Такий рядок не беремо зовсім. */
const LATIN = new Set(['de', 'pl', 'tr', 'lt', 'pt', 'en', 'no']);
const wrongScript = (lang, text) => (LATIN.has(lang) ? /[\u0400-\u04FF\u0600-\u06FF]/.test(text)
  : lang === 'ar' ? !/[\u0600-\u06FF]/.test(text) && /[A-Za-z\u0400-\u04FF]{4}/.test(text)
    : lang === 'uk' ? /[\u0600-\u06FF]/.test(text) : false);

const NAMES = { de: 'German', pl: 'Polish', tr: 'Turkish', lt: 'Lithuanian', pt: 'Brazilian Portuguese (pt-BR)', ar: 'Arabic' };

function data() {
  const w = {}; w.window = w; vm.createContext(w);
  for (const f of ['data/grammar.js', 'data/basics.js', 'data/characters.js', 'data/english.js', 'data/dictionary-en.js']) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) { try { vm.runInContext(fs.readFileSync(p, 'utf8'), w, { filename: f }); } catch (e) { } }
  }
  return w;
}

/* Англійські рядки, які показуються учневі. Норвезькі не чіпаємо: це сам
   предмет вивчення, і перекладати його нікуди не треба. */
function strings() {
  const w = data();
  const out = new Map();                       // текст → звідки (для підказки моделі)
  const put = (en, hint) => { const t = String(en || '').trim(); if (t && !out.has(t)) out.set(t, hint); };

  for (const tp of ((w.GRAMMAR || {}).topics || [])) {
    put(tp.en, 'name of a Norwegian grammar topic');
    put((tp.rule || {}).en, 'short rule that explains a point of Norwegian grammar to a learner');
    for (const row of tp.table || []) put(row[2], `translation of the Norwegian form “${row[0]}” in a grammar table`);
    for (const ex of tp.examples || []) put(ex[2], `translation of the Norwegian example “${ex[0]}”`);
  }
  const walk = (node, hint, depth = 0) => {
    if (!node || depth > 6) return;
    if (Array.isArray(node)) return node.forEach(x => walk(x, hint, depth + 1));
    if (typeof node !== 'object') return;
    if (typeof node.en === 'string' && (node.uk !== undefined || node.no !== undefined)) put(node.en, hint);
    for (const v of Object.values(node)) walk(v, hint, depth + 1);
  };
  walk(w.BASICS, 'explanation of a Norwegian letter, sound or number for a learner');
  walk(w.CHARACTERS, 'short description of a character in a comic');
  /* Курс англійської: історії написані англійською, а підказка під ними —
     мовою учня. Доти вона була тільки українською й норвезькою, тож німець
     бачив під англійським реченням українське. */
  for (const c of ((w.ENGLISH || {}).comics || [])) {
    put(c.title, 'title of a short comic strip in an English course');
    for (const p of c.panels || []) for (const l of p.lines || []) put(l.en, 'spoken line from an English comic strip; the learner reads it in English and needs it in their own language');
    for (const v of c.vocab || []) put(v[0], 'English word or phrase from the story, as a dictionary entry');
  }
  return out;
}

/* Що вже є у словнику цієї мови: збираємо з усіх tsv, щоб не платити двічі. */
function known(lang) {
  const dir = path.join(__dirname, 'lang', lang);
  const have = new Set();
  if (!fs.existsSync(dir)) return have;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.tsv'))) {
    for (const row of fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/)) {
      const i = row.indexOf('\t');
      if (i > 0 && row.slice(i + 1).trim()) have.add(row.slice(0, i).trim());
    }
  }
  return have;
}

function plan(langs) {
  const all = strings();
  fs.mkdirSync(WORK, { recursive: true });
  for (const lang of langs) {
    const have = known(lang);
    const need = [...all.entries()].filter(([en]) => !have.has(en));
    if (!need.length) { console.log(`🌍 ${lang}: навчальні тексти вже у словнику`); continue; }
    const lines = [];
    for (let i = 0; i < need.length; i += 20) {
      const items = need.slice(i, i + 20).map(([en, hint], j) => ({ k: String(j + 1), en, no: '', hint }));
      lines.push(JSON.stringify({ id: `${lang}-learn-${i / 20 + 1}`, lang, langName: NAMES[lang] || lang, kind: 'pages', items }));
    }
    fs.writeFileSync(path.join(WORK, `jobs-learn-${lang}.jsonl`), lines.join('\n') + '\n', 'utf8');
    console.log(`🌍 ${lang}: ${need.length} рядків → ${lines.length} запитів`);
  }
}

function merge(langs) {
  for (const lang of langs) {
    const jobsF = path.join(WORK, `jobs-learn-${lang}.jsonl`), outF = path.join(WORK, `out-learn-${lang}.jsonl`);
    if (!fs.existsSync(jobsF) || !fs.existsSync(outF)) { console.log(`⚠ ${lang}: немає завдань або відповідей`); continue; }
    const jobs = new Map();
    for (const row of fs.readFileSync(jobsF, 'utf8').split('\n')) if (row.trim()) { const j = JSON.parse(row); jobs.set(j.id, j); }
    const rows = [];
    for (const row of fs.readFileSync(outF, 'utf8').split('\n')) {
      if (!row.trim()) continue;
      let r; try { r = JSON.parse(row); } catch (e) { continue; }
      const job = jobs.get(r.id);
      if (!job || !r.ok || !r.map) continue;
      for (const it of job.items) {
        const v = r.map[it.k];
        if (typeof v !== 'string' || !v.trim() || wrongScript(lang, v)) continue;
        rows.push([it.en, v.trim().replace(/[\t\r\n]+/g, ' ')]);
      }
    }
    if (!rows.length) { console.log(`⚠ ${lang}: нічого приймати`); continue; }
    const dir = path.join(__dirname, 'lang', lang);
    fs.mkdirSync(dir, { recursive: true });
    const f = path.join(dir, '95-learn.tsv');
    const prev = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').replace(/\n*$/, '\n') : '';
    fs.writeFileSync(f, prev + rows.map(([a, b]) => `${a}\t${b}`).join('\n') + '\n', 'utf8');
    console.log(`🌍 ${lang}: ${rows.length} рядків → tools/lang/${lang}/95-learn.tsv`);
  }
  console.log('\nДалі: node tools/build-langpack.js && node tools/build.js');
}

const cmd = process.argv[2];
const langs = process.argv.slice(3).filter(x => !x.startsWith('-'));
if (cmd === 'plan') plan(langs.length ? langs : Object.keys(NAMES));
else if (cmd === 'merge') merge(langs.length ? langs : Object.keys(NAMES));
else { console.log('node tools/learn-i18n.js plan|merge [de pl tr lt ar]'); process.exit(1); }
