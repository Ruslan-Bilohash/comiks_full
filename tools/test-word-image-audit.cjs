'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const audit = require('./audit-word-images.cjs');

const eq = (actual, expected, label) => {
  assert.deepEqual(actual, expected, label);
  process.stdout.write(`PASS ${label}\n`);
};

eq(audit.normalizeWord('et blåbær'), 'blåbær', 'normalizes Norwegian article');
eq(audit.stableSlug('å gå tur'), 'gaa_tur', 'transliterates Norwegian filename characters');
eq(audit.stableSlug('en lærer'), 'laerer', 'transliterates ae ligature');

const prompt = audit.buildPrompt({
  norwegian: 'ei hytte',
  english: 'a cabin',
  ukrainian: 'хатина',
  categoryName: 'Friluftsliv'
});
assert.match(prompt, /Norwegian wooden mountain cabin/i);
assert.match(prompt, /transparent background/i);
assert.match(prompt, /10%/i);
assert.match(prompt, /no text/i);
process.stdout.write('PASS deterministic word-specific prompt\n');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'komiks-word-audit-'));
for (const dir of ['data', 'assets', 'img/words/dyr']) fs.mkdirSync(path.join(root, dir), { recursive: true });
fs.writeFileSync(path.join(root, 'data/words.js'), `window.WORDS={themes:[{id:'dyr',icon:'🐾',level:'A1',no:'Dyr',uk:'Тварини',en:'Animals',words:[['en hund','собака','a dog','🐶'],['en katt','кіт','a cat','🐱'],['en rev','лисиця','a fox','🦊']]}]};`);
for (const n of ['words2.js', 'words3.js', 'words4.js']) fs.writeFileSync(path.join(root, `data/${n}`), '');
fs.writeFileSync(path.join(root, 'assets/pics.js'), `window.KomiksPics=(()=>{const p={hund:'<path/>'},ph={};return{add:m=>Object.assign(p,m),addPhotos:m=>Object.assign(ph,m),has:(w)=>!!p[String(w).replace(/^(en|ei|et|å)\\s+/, '')]||!!ph[String(w).replace(/^(en|ei|et|å)\\s+/, '')],photo:(w)=>ph[String(w).replace(/^(en|ei|et|å)\\s+/, '')]||'',get keys(){return [...Object.keys(p),...Object.keys(ph)]}}})();`);
for (const n of ['pics2.js', 'pics3.js', 'pics4.js', 'pics5.js', 'pics6.js', 'pics7.js']) fs.writeFileSync(path.join(root, `assets/${n}`), '');
fs.writeFileSync(path.join(root, 'data/words-tools.js'), '');
fs.writeFileSync(path.join(root, 'data/word-photos.js'), `window.KomiksPics.addPhotos({katt:'img/words/dyr/katt.png'});`);
fs.writeFileSync(path.join(root, 'img/words/dyr/katt.png'), 'not-a-real-png');

const result = audit.collectProject(root);
eq(result.entries.length, 3, 'collects every word from every theme');
eq(result.entries[0].sourceType, 'inline-svg', 'detects existing inline SVG');
eq(result.entries[1].image, 'img/words/dyr/katt.png', 'keeps current raster path');
eq(result.entries[1].status, 'pending-validation', 'defers raster health to pixel validator');
eq(result.entries[2].needsGeneration, true, 'queues a word with no image');
assert.equal(new Set(result.entries.map(x => x.id)).size, 3, 'IDs are unique');
assert.equal(new Set(result.entries.map(x => x.filename)).size, 3, 'filenames are unique within output paths');
process.stdout.write('PASS stable unique IDs and filenames\n');

fs.rmSync(root, { recursive: true, force: true });
process.stdout.write('ALL WORD IMAGE AUDIT TESTS PASSED\n');

