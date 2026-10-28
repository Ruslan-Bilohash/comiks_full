const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const englishSource = fs.readFileSync(path.join(root, 'assets', 'english.js'), 'utf8');
const appSource = fs.readFileSync(path.join(root, 'assets', 'app.js'), 'utf8');
const styleSource = fs.readFileSync(path.join(root, 'assets', 'style.css'), 'utf8');

const window = { I18N: { uk: {}, en: {}, no: {} } };
vm.runInNewContext(englishSource, { window, console, setTimeout, clearTimeout }, { filename: 'assets/english.js' });

assert(window.KomiksEnglish, 'English module is exposed');
assert.equal(typeof window.KomiksEnglish.alphabet, 'function', 'English alphabet page is exposed');
assert.equal(typeof window.KomiksEnglish.alphabetQuiz, 'function', 'English alphabet quiz is exposed');
assert(Array.isArray(window.KomiksEnglish.alphabetData), 'English alphabet data is exposed for QA');
assert.equal(window.KomiksEnglish.alphabetData.length, 26, 'English alphabet has 26 letters');
assert.equal(new Set(window.KomiksEnglish.alphabetData.map(row => row[0])).size, 26, 'letters are unique');
assert.deepEqual(Array.from(window.KomiksEnglish.alphabetData, row => row[0]).join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'alphabet order');
for (const row of window.KomiksEnglish.alphabetData) {
  assert.equal(row.length, 6, `${row[0]} includes name, word, picture and two translations`);
  assert(row.every(Boolean), `${row[0]} has no empty learning field`);
  assert.equal(row[2][0].toUpperCase(), row[0], `${row[2]} begins with ${row[0]}`);
}

assert.match(appSource, /view === 'english'.*id === 'alphabet'/s, 'English alphabet route exists');
assert.match(appSource, /id === 'en-alphabet'/, 'English alphabet quiz route exists');
assert.match(appSource, /Вчимо англійську/, 'Ukrainian contextual English brand label exists');
assert.match(appSource, /Вчимо норвезьку/, 'Ukrainian contextual Norwegian brand label exists');
assert.match(styleSource, /\.en-home-hero/, 'English home has a dedicated visual hero');
assert.match(styleSource, /\.en-alpha-card/, 'English alphabet has dedicated card styling');

console.log('PASS English course: contextual brand, designed home, 26-letter alphabet and quiz routes');
