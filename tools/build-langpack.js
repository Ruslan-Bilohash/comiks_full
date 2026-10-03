/* Комікс·Lab — 🌍 збирає data/lang-<код>.js зі словників перекладу в tools/lang/<код>/*.tsv
 *
 *   node tools/build-langpack.js de pl tr lt      (або без аргументів — усі, які є)
 *
 * Формат tsv: «англійський рядок<TAB>переклад», по одному на рядок. Порожній переклад
 * пропускається, тож пакет можна наповнювати частинами: чого ще немає — підказка покаже англійською.
 */
const fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(__dirname, 'lang');
const NAMES = { de: 'Deutsch', pl: 'Polski', tr: 'Türkçe', lt: 'Lietuvių' };

const want = process.argv.slice(2).filter(x => !x.startsWith('-'));
const langs = (want.length ? want : Object.keys(NAMES)).filter(l => fs.existsSync(path.join(SRC, l)));
if (!langs.length) { console.log('Немає тек tools/lang/<код> — нічого збирати.'); process.exit(0); }

for (const lang of langs) {
  const dir = path.join(SRC, lang);
  const map = {};
  let lines = 0;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.tsv')).sort()) {
    for (const row of fs.readFileSync(path.join(dir, f), 'utf8').split(/\r?\n/)) {
      if (!row.trim()) continue;
      const i = row.indexOf('\t');
      if (i < 1) continue;
      const en = row.slice(0, i).trim(), tr = row.slice(i + 1).trim();
      lines++;
      if (en && tr) map[en] = tr;
    }
  }
  const out = `/* ${NAMES[lang] || lang} — переклади для підказок: англійський рядок → переклад.\n`
    + `   Збирається з tools/lang/${lang}/*.tsv (node tools/build-langpack.js ${lang}).\n`
    + '   Вантажиться лише тоді, коли учень обрав цю мову перекладу. */\n'
    + 'window.TR_PACK = window.TR_PACK || {};\n'
    + `window.TR_PACK.${lang} = ` + JSON.stringify(map, null, 0).replace(/","/g, '",\n"') + ';\n';
  fs.writeFileSync(path.join(ROOT, 'data', `lang-${lang}.js`), out, 'utf8');
  console.log(`🌍 data/lang-${lang}.js · рядків у словнику: ${Object.keys(map).length} (прочитано ${lines})`);
}
