/* Комікс·Lab — 🌍 список англійських рядків, які треба перекласти для нової мови підказок.
 *
 *   node tools/lang-strings.js              # оновити tools/lang/en_strings.json
 *   node tools/lang-strings.js --chunk 120  # додатково розкласти по файлах для перекладу
 *
 * Мова підказок працює так: у коміксах зберігається норвезький текст і англійський переклад,
 * а решта мов — це словник «англійський рядок → переклад». Тут ми збираємо всі англійські
 * рядки: назви коміксів, описи, репліки, слова зі словника коміксу й тематичні слова.
 */
const fs = require('fs'), path = require('path');
const load = require('./load.js');

const ROOT = load.ROOT;
const OUT = path.join(ROOT, 'tools', 'lang');
fs.mkdirSync(OUT, { recursive: true });

const W = load({ skipAudio: true });
const seen = new Set();
const rows = [];
const add = (text, kind) => {
  const t = String(text || '').trim();
  if (!t || seen.has(t)) return;
  seen.add(t);
  rows.push([t, kind]);
};

for (const c of W.COMICS.filter(x => !x._private)) {
  add(c.titleEn, 'title');
  add(c.summaryEn, 'summary');
  c.panels.forEach(p => p.lines.forEach(l => add(l.en, 'line')));
  (c.vocab || []).forEach(([, , en]) => add(en, 'word'));
  for (const en of Object.values((c.words || {}).en || {})) add(en, 'word');
}
for (const th of ((W.WORDS || {}).themes || [])) {
  add(th.en, 'theme');
  th.words.forEach(([, , en]) => add(en, 'word'));
}

fs.writeFileSync(path.join(OUT, 'en_strings.json'), JSON.stringify(rows), 'utf8');
const byKind = rows.reduce((m, r) => { m[r[1]] = (m[r[1]] || 0) + 1; return m; }, {});
console.log(`🌍 рядків до перекладу: ${rows.length}`);
console.log('   ' + Object.entries(byKind).map(([k, n]) => `${k}: ${n}`).join(' · '));

const ci = process.argv.indexOf('--chunk');
if (ci > -1) {
  const size = Math.max(20, parseInt(process.argv[ci + 1], 10) || 120);
  const dir = path.join(OUT, 'todo');
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) fs.rmSync(path.join(dir, f), { force: true });
  for (let i = 0; i < rows.length; i += size) {
    const part = rows.slice(i, i + size).map((r, k) => `${i + k}|${r[0]}`).join('\n');
    fs.writeFileSync(path.join(dir, `part-${String(Math.floor(i / size) + 1).padStart(2, '0')}.txt`), part + '\n', 'utf8');
  }
  console.log(`   розкладено по ${size} у tools/lang/todo/`);
}
