'use strict';
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');
const out = path.join(root, 'tools', '.i18n-identical');
fs.mkdirSync(out, { recursive: true });

const win = { TR_PACK: {} };
for (const lang of ['de', 'pl', 'tr', 'lt']) {
  const file = path.join(root, 'data', `lang-${lang}.js`);
  new Function('window', fs.readFileSync(file, 'utf8'))(win);
}

const names = (() => {
  const sandbox = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'characters.js'), 'utf8'))(sandbox);
  const found = new Set();
  for (const character of Object.values(sandbox.CHARACTERS || {})) {
    for (const value of Object.values(character || {})) {
      if (typeof value === 'string' && /^[A-ZÅÆØ][\p{L}'’ -]{1,20}$/u.test(value)) found.add(value);
    }
  }
  return [...found];
})();

const sameOk = {
  de: ['orange', 'a pizza', 'April', 'August', 'September', 'November', 'warm', 'Nynorsk', 'Bokmål'],
  pl: ['a pizza', 'Nynorsk', 'Bokmål', 'kutia'],
  tr: ['a pizza', 'Nynorsk', 'Bokmål'],
  lt: ['a pizza', 'Nynorsk', 'Bokmål'],
};
const sameAny = ['online', 'plus', 'digital', 'permanent', 'protein', 'gluten', 'weekend', 'RIIING!', 'Narrator'];

for (const lang of ['de', 'pl', 'tr', 'lt']) {
  const pack = win.TR_PACK[lang] || {};
  const allow = new Set([...(sameOk[lang] || []), ...sameAny, ...names]);
  const keys = Object.keys(pack).filter(key => String(pack[key]).trim() === key.trim() && !allow.has(key));
  const jobs = [];
  for (let i = 0; i < keys.length; i += 20) {
    jobs.push({
      id: `${lang}-identical-${Math.floor(i / 20) + 1}`,
      items: keys.slice(i, i + 20).map(key => ({ k: key, en: key })),
    });
  }
  fs.writeFileSync(path.join(out, `jobs-${lang}.jsonl`), jobs.map(row => JSON.stringify(row)).join('\n') + '\n');
  console.log(`${lang}: ${keys.length} identical strings -> ${jobs.length} batches`);
}
