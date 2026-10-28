/* Комікс·Lab — 🌍 листи з сервера іншими мовами.
 *
 *   node tools/mail-i18n.js plan de pl tr lt    завдання для перекладу
 *   node tools/mail-i18n.js merge de pl tr lt   вписує готові мови в api/lib.php
 *
 * Листи — перше, що людина бачить від продукту: підтвердження пошти, код для
 * входу, вітання. Доти вони були лише чотирма мовами, а німець чи поляк,
 * зареєструвавшись німецькою, отримував англійський лист.
 *
 * Тексти живуть у mail_texts() в api/lib.php, бо їх шле сервер, а не застосунок.
 * Тому перекладені мови треба саме вписати у файл — окремим словником їх не
 * підкласти. Звідси обережність: %s у рядку — це ім'я людини, і якщо переклад
 * його загубить, лист піде зі зламаним привітанням; такі рядки не беремо.
 */
const fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..');
const WORK = path.join(__dirname, '.i18n');
const LIB = path.join(ROOT, 'api', 'lib.php');
const NAMES = { de: 'German', pl: 'Polish', tr: 'Turkish', lt: 'Lithuanian', pt: 'Brazilian Portuguese (pt-BR)' };

const hintFor = (k, v) => {
  const h = [];
  if (k.endsWith('_subject')) h.push('subject line of an email, short');
  else if (k.endsWith('_btn')) h.push('label on a button inside an email');
  else if (k.endsWith('_title')) h.push('big heading at the top of the email');
  else if (k.endsWith('_after')) h.push('small print under the button');
  if (v.includes('%s')) h.push('%s is the person’s name and MUST stay exactly as %s, in a place where a name fits');
  if (v.includes('<br>')) h.push('keep the <br> tags exactly where they are');
  return (h.join('; ') || 'text of an email from a Norwegian-learning app') + '; keep the product name Komiks·Lab unchanged';
};

function plan(langs) {
  const en = JSON.parse(fs.readFileSync(path.join(WORK, 'mail-en.json'), 'utf8'));
  const rows = Object.entries(en);
  fs.mkdirSync(WORK, { recursive: true });
  for (const lang of langs) {
    const lines = [];
    for (let i = 0; i < rows.length; i += 12) {
      const items = rows.slice(i, i + 12).map(([k, v], j) => ({ k: String(j + 1), key: k, en: v, no: '', hint: hintFor(k, v) }));
      lines.push(JSON.stringify({ id: `${lang}-mail-${i / 12 + 1}`, lang, langName: NAMES[lang] || lang, kind: 'pages', items }));
    }
    fs.writeFileSync(path.join(WORK, `jobs-mail-${lang}.jsonl`), lines.join('\n') + '\n', 'utf8');
    console.log(`📧 ${lang}: ${rows.length} рядків листів → ${lines.length} запитів`);
  }
}

const php = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";

function merge(langs) {
  const en = JSON.parse(fs.readFileSync(path.join(WORK, 'mail-en.json'), 'utf8'));
  let src = fs.readFileSync(LIB, 'utf8');
  const crlf = src.includes('\r\n');
  if (crlf) src = src.replace(/\r\n/g, '\n');

  for (const lang of langs) {
    const jobsF = path.join(WORK, `jobs-mail-${lang}.jsonl`), outF = path.join(WORK, `out-mail-${lang}.jsonl`);
    if (!fs.existsSync(jobsF) || !fs.existsSync(outF)) { console.log(`⚠ ${lang}: немає завдань або відповідей`); continue; }
    const jobs = new Map();
    for (const row of fs.readFileSync(jobsF, 'utf8').split('\n')) if (row.trim()) { const j = JSON.parse(row); jobs.set(j.id, j); }
    const got = {};
    let lost = 0;
    for (const row of fs.readFileSync(outF, 'utf8').split('\n')) {
      if (!row.trim()) continue;
      let r; try { r = JSON.parse(row); } catch (e) { continue; }
      const job = jobs.get(r.id);
      if (!job || !r.ok || !r.map) continue;
      for (const it of job.items) {
        const v = r.map[it.k];
        if (typeof v !== 'string' || !v.trim()) { lost++; continue; }
        /* Ім'я людини та розмітка мусять лишитися на місці. Рядок, де їх
           загубили, не беремо зовсім: краще англійський лист, ніж лист
           зі «Привіт, !» замість імені. */
        const want = (it.en.match(/%s/g) || []).length;
        if ((v.match(/%s/g) || []).length !== want) { lost++; continue; }
        if ((it.en.match(/<br>/g) || []).length !== (v.match(/<br>/g) || []).length) { lost++; continue; }
        got[it.key] = v.trim();
      }
    }
    const missing = Object.keys(en).filter(k => !got[k]);
    if (missing.length) { console.log(`⚠ ${lang}: бракує ${missing.length} рядків (${missing.slice(0, 3).join(', ')}) — мову не вписую`); continue; }

    const body = Object.keys(en).map(k => `      ${php(k)} => ${php(got[k])},`).join('\n');
    const block = `    '${lang}' => [\n${body}\n    ],\n`;
    const anchor = '  ];\n  return $T[$lang] ?? $T[\'en\'];';
    if (src.includes(`    '${lang}' => [`)) {
      /* Мова вже є — замінюємо її блок цілком, щоб не плодити дублікатів. */
      const start = src.indexOf(`    '${lang}' => [`);
      const stop = src.indexOf('\n    ],\n', start) + '\n    ],\n'.length;
      src = src.slice(0, start) + block + src.slice(stop);
      console.log(`📧 ${lang}: оновлено ${Object.keys(got).length} рядків${lost ? ` · відкинуто ${lost}` : ''}`);
    } else {
      if (!src.includes(anchor)) throw new Error('не знайдено кінця таблиці листів у api/lib.php');
      src = src.replace(anchor, block + anchor);
      console.log(`📧 ${lang}: вписано ${Object.keys(got).length} рядків${lost ? ` · відкинуто ${lost}` : ''}`);
    }
  }
  if (crlf) src = src.replace(/\n/g, '\r\n');
  fs.writeFileSync(LIB, src, 'utf8');
}

const cmd = process.argv[2];
const langs = process.argv.slice(3).filter(x => !x.startsWith('-'));
if (cmd === 'plan') plan(langs.length ? langs : Object.keys(NAMES));
else if (cmd === 'merge') merge(langs.length ? langs : Object.keys(NAMES));
else { console.log('node tools/mail-i18n.js plan|merge [de pl tr lt]'); process.exit(1); }
