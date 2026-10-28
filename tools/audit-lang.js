/* Комікс·Lab — 🌍 перевірка перекладів.
 *
 *   node tools/audit-lang.js            коротко по всіх мовах
 *   node tools/audit-lang.js de --miss   що саме бракує німецькою (перші 40 рядків)
 *
 * Дивимося з боку учня: що він побачить у підказці, якщо увімкне цю мову.
 * Українська й англійська лежать у самих коміксах, решта — у словниках data/lang-*.js,
 * які збираються з tools/lang/<код>/*.tsv.
 */
const fs = require('fs'), path = require('path');
const load = require('./load.js');
const ROOT = load.ROOT;
const W = load();

const PACK_LANGS = ['de', 'pl', 'tr', 'lt', 'pt'];
const want = process.argv.slice(2).filter(x => !x.startsWith('-'));
const showMiss = process.argv.includes('--miss');
const langs = want.length ? want.filter(l => PACK_LANGS.includes(l)) : PACK_LANGS;

// словники вантажимо так само, як браузер: файл ставить window.TR_PACK.<код>
const win = { TR_PACK: {} };
for (const l of PACK_LANGS) {
  const f = path.join(ROOT, 'data', `lang-${l}.js`);
  if (!fs.existsSync(f)) continue;
  const src = fs.readFileSync(f, 'utf8');
  new Function('window', src)(win);
}

const pub = W.COMICS.filter(c => !c._private);
const themes = ((W.WORDS || {}).themes || []);

/* Кожен рядок, який учень може побачити перекладеним: назва, опис, репліки,
   слова коміксу, тематичні слова й назви тем. Ключ у словнику — англійський текст. */
function strings() {
  const out = { title: [], summary: [], line: [], vocab: [], word: [], theme: [] };
  for (const c of pub) {
    if (c.titleEn) out.title.push(c.titleEn);
    if (c.summaryEn) out.summary.push(c.summaryEn);
    for (const p of c.panels) for (const l of p.lines) if (l.who !== 'sfx' && l.en) out.line.push(l.en);
    for (const v of c.vocab || []) if (v[2]) out.vocab.push(v[2]);
  }
  for (const th of themes) {
    if (th.en) out.theme.push(th.en);
    for (const w of th.words) if (w[2]) out.word.push(w[2]);
  }
  for (const k of Object.keys(out)) out[k] = [...new Set(out[k])];
  return out;
}

const S = strings();
const KINDS = ['title', 'summary', 'line', 'vocab', 'word', 'theme'];
const NAMES = { title: 'назви коміксів', summary: 'описи коміксів', line: 'репліки', vocab: 'слова коміксів', word: 'тематичні слова', theme: 'назви тем' };

// ── 1) структура: чи кожен комікс придатний до показу ──
const broken = [];
for (const c of pub) {
  const bad = [];
  if (!c.title) bad.push('немає норвезької назви');
  if (!c.titleEn) bad.push('немає titleEn');
  if (!c.summaryEn) bad.push('немає summaryEn');
  if (!c.panels || !c.panels.length) bad.push('немає кадрів');
  else {
    const noArt = c.panels.filter(p => !p.art).length;
    if (noArt) bad.push(`кадрів без малюнка: ${noArt}`);
    const noTr = c.panels.flatMap(p => p.lines).filter(l => l.who !== 'sfx' && (!l.uk || !l.en)).length;
    if (noTr) bad.push(`реплік без uk/en: ${noTr}`);
  }
  if (!c.vocab || !c.vocab.length) bad.push('немає словника');
  if (bad.length) broken.push([c.id, bad]);
}

console.log(`📚 Коміксів у збірці: ${pub.length} (приватних приховано: ${W.COMICS.length - pub.length})`);
if (broken.length) {
  console.log(`\n❌ Комікси з проблемами (${broken.length}):`);
  for (const [id, bad] of broken) console.log(`   ${id}: ${bad.join('; ')}`);
} else {
  console.log('✔ Усі комікси цілі: назва, опис, кадри, репліки з перекладом, словник.');
}

// ── 2) покриття словниками ──
console.log('\n🌍 Покриття перекладом (uk та en є в самих коміксах — тут лише словникові мови):');
const pad = (s, n) => String(s).padEnd(n);
console.log('   ' + pad('', 18) + KINDS.map(k => pad(k, 9)).join('') + 'разом');
for (const l of langs) {
  const pack = win.TR_PACK[l] || {};
  const row = [];
  let have = 0, all = 0;
  for (const k of KINDS) {
    const n = S[k].filter(x => pack[x] || pack[String(x).trim()]).length;
    have += n; all += S[k].length;
    row.push(pad(`${n}/${S[k].length}`, 9));
  }
  const pct = all ? Math.round(have / all * 100) : 0;
  console.log('   ' + pad(l.toUpperCase() + ' ' + (pct + '%'), 18) + row.join('') + `${have}/${all}`);
}
console.log('\n   ' + KINDS.map(k => `${k} — ${NAMES[k]}`).join('\n   '));

// ── 3) що саме бракує ──
if (showMiss) {
  for (const l of langs) {
    const pack = win.TR_PACK[l] || {};
    console.log(`\n── ${l.toUpperCase()}: найближче до роботи ──`);
    for (const k of KINDS) {
      const miss = S[k].filter(x => !pack[x] && !pack[String(x).trim()]);
      if (!miss.length) { console.log(`   ${NAMES[k]}: ✔ усе є`); continue; }
      console.log(`   ${NAMES[k]}: бракує ${miss.length}`);
      for (const x of miss.slice(0, 40)) console.log(`      ${x}`);
      if (miss.length > 40) console.log(`      … і ще ${miss.length - 40}`);
    }
  }
}
