'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const audit = JSON.parse(fs.readFileSync(path.join(root, 'reports', 'image-audit.json'), 'utf8'));
const mappingSource = fs.readFileSync(path.join(root, 'data', 'word-photos-gen.js'), 'utf8');
const mappingMatch = mappingSource.match(/const SETS = (\{.*?\});\r?\n/s);
assert(mappingMatch, 'generated word-photo mapping is readable');
const mapping = JSON.parse(mappingMatch[1]);

const expected = {
  retning: [
    'her', 'der', 'foran', 'bak', 'over', 'under', 'ved_siden_av', 'mellom', 'inne', 'ute',
    'oppe', 'nede', 'til_hoyre', 'til_venstre', 'rett_fram', 'langt', 'naer', 'rundt', 'gjennom', 'tilbake'
  ],
  allergi: [
    'taale', 'inneholde', 'nott', 'valnott', 'gluten', 'laktose', 'skalldyr', 'soya', 'innhold',
    'merking', 'spor', 'bytte_ut', 'dressing', 'redskap', 'trygg', 'si_fra', 'ta_paa_alvor',
    'krysskontaminering', 'reaksjon'
  ],
  tall2: [
    'halv', 'kvart', 'dusin', 'par', 'mange', 'faa', 'nok', 'for_mye', 'omtrent',
    'minst', 'hoyst', 'dobbelt', 'halvpart', 'tredjedel', 'prosent', 'sum', 'telle', 'maale'
  ]
};

for (const [category, stems] of Object.entries(expected)) {
  const entries = audit.entries.filter(entry => entry.category === category);
  assert(entries.length >= stems.length, `${category} is present in the vocabulary audit`);
  assert.equal(entries.filter(entry => entry.needsGeneration).length, 0, `${category} has no missing images`);
  assert(mapping[category], `${category} is connected to the browser image mapping`);
  for (const stem of stems) {
    assert(fs.existsSync(path.join(root, 'img', 'words', category, `${stem}.png`)), `${category}/${stem}.png exists`);
    assert(fs.existsSync(path.join(root, 'img', 'words', category, `${stem}.webp`)), `${category}/${stem}.webp exists`);
  }
  assert(fs.existsSync(path.join(root, 'exports', `${category}.zip`)), `${category}.zip exists`);
}

console.log('PASS priority word images: 57 PNG + WebP assets, mappings, audits and category ZIP files');
