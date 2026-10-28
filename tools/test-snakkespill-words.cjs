'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const load = require('./load.js');

const w = load();
const norm = value => String(value).toLowerCase().normalize('NFKC').replace(/^(en|ei|et|å)\s+/, '').trim();
const requested = ['inntekt','spare','trives','leie','eie','moderne','pusse opp','ha råd til','prøverom','kikke','tilbud','størrelse','handle','betale','hente','ledig','opptatt','spandere','forsove seg','for sent','lønn','lete etter','finne'];
const words = w.WORDS.themes.flatMap(theme => theme.words.map(word => ({ theme:theme.id, no:word[0], uk:word[1], en:word[2], icon:word[3] })));
for (const term of requested) {
  const hits = words.filter(word => norm(word.no) === term);
  assert.ok(hits.length, `missing requested word: ${term}`);
  assert.ok(hits.every(word => word.uk && word.en && word.icon), `${term} needs Ukrainian, English and a visual cue`);
}

const expectedThemes = {
  trives:'bolig2', leie:'bolig2', eie:'bolig2', moderne:'bolig2', 'pusse opp':'bolig2', 'ha råd til':'bolig2', ledig:'bolig2', opptatt:'bolig2',
  prøverom:'butikk', kikke:'butikk', størrelse:'butikk', handle:'butikk',
  'forsove seg':'jobb2', 'for sent':'jobb2', spandere:'penger', 'lete etter':'verb', finne:'verb'
};
for (const [term, theme] of Object.entries(expectedThemes)) {
  assert.ok(words.some(word => norm(word.no) === term && word.theme === theme), `${term} must be in ${theme}`);
}

const ui = fs.readFileSync(path.join(__dirname, '..', 'assets', 'words.js'), 'utf8');
assert.match(ui, /const quiz = id => questions\(id \|\| null/, 'topic words must feed the quiz generator');
assert.match(ui, /href: '#\/quiz\/words\/' \+ th\.id/, 'every learning theme needs a visible topic-test button');
console.log(`PASS Snakkespill A2: ${requested.length} words available in learning and topic tests`);
