const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets', 'english.js'), 'utf8');
const style = fs.readFileSync(path.join(root, 'assets', 'style.css'), 'utf8');
const window = { I18N: { uk: {}, en: {}, no: {} } };

vm.runInNewContext(source, { window, console, setTimeout, clearTimeout }, { filename: 'assets/english.js' });

assert.equal(typeof window.KomiksEnglish.planModel, 'function', 'English plan exposes a testable progress model');
const model = window.KomiksEnglish.planModel([
  { id: 'one', level: 'A1', stories: ['s1'] },
  { id: 'two', level: 'A1', stories: ['s2', 's3'] },
  { id: 'three', level: 'A2', stories: ['s4'] }
], id => id === 's1' || id === 's2');
assert.equal(model.done, 1, 'only a fully completed topic counts as done');
assert.equal(model.storiesDone, 2, 'completed stories are counted');
assert.equal(model.storiesTotal, 4, 'all linked stories are counted');
assert.equal(model.activeIndex, 1, 'the first incomplete topic is active');
assert.equal(model.rows[0].state, 'done');
assert.equal(model.rows[1].state, 'active');
assert.equal(model.rows[2].state, 'todo');
assert.deepEqual(Array.from(model.levels, x => x.level), ['A1', 'A2']);

assert.match(source, /window\.KomiksPics/, 'English course connects to the shared Norwegian picture library');
assert.match(source, /P\.has\(no, uk\)/, 'English course checks whether a shared picture exists');
assert.match(source, /P\.el\(no, size, uk\)/, 'English course renders a shared picture');
assert.match(style, /\.en-plan-journey/, 'English plan has a designed journey dashboard');
assert.match(style, /\.en-plan-node/, 'English plan has a visual topic scale');
assert.match(style, /\.en-alpha-visual/, 'English alphabet pictures have dedicated layout');

console.log('PASS English plan: progress model, 22-step journey styles and shared Norwegian learning images');
