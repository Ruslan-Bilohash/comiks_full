const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const file = path.resolve(__dirname, '../assets/logic.js');
assert.ok(fs.existsSync(file), 'The new logic challenge module exists');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
const L = context.window.KomiksLogic;
assert.ok(L, 'Logic API is available without a DOM');
const plain = value => JSON.parse(JSON.stringify(value));
const random = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const types = new Set();
let checked = 0;
for (const mode of ['memory', 'patterns', 'attention']) {
  for (const level of ['easy', 'medium', 'hard', 'expert']) {
    for (let seed = 1; seed <= 100; seed++) {
      const a = L.makeQ(mode, random(seed), level), b = L.makeQ(mode, random(seed), level);
      assert.deepEqual(plain(a), plain(b), `${mode}/${level}: shared seed produces identical tasks`);
      assert.equal(a.options.length, 4);
      assert.equal(new Set(a.options).size, 4, 'Four distinct answers');
      assert.equal(a.options.filter(x => x === a.answer).length, 1, 'Exactly one correct answer');
      assert.equal(a.title.length, 3, 'Norwegian question with Ukrainian and English translations');
      assert.equal(a.explain.length, 3, 'Feedback translated in all three teaching languages');
      types.add(a.type);
      if (a.type === 'memory') {
        assert.ok(a.previewMs >= 2000 && a.previewMs <= 5000);
        assert.equal(a.before.length, new Set(a.before).size);
        assert.equal(a.before[a.missing], a.answer);
        assert.equal(a.after[a.missing], '?');
        assert.equal(a.after.filter(x => x === '?').length, 1);
        assert.ok(a.options.filter(x => x !== a.answer).every(x => !a.before.includes(x)), 'Missing answer cannot be inferred from visible objects');
      } else if (a.type === 'repeat') {
        assert.ok(a.row.length >= a.unit.length * 2, 'Two full repeats establish the rule');
        a.row.forEach((x, i) => assert.equal(x, a.unit[i % a.unit.length]));
        assert.equal(a.answer, a.unit[a.row.length % a.unit.length]);
      } else if (a.type === 'growth') {
        a.row.forEach((x, i) => { if (i) assert.equal(x - a.row[i - 1], a.jumps[(i - 1) % a.jumps.length]); });
        assert.equal(a.answer - a.row.at(-1), a.jumps[(a.row.length - 1) % a.jumps.length]);
      } else if (a.type === 'change') {
        const changed = a.before.flatMap((x, i) => x !== a.after[i] ? [i + 1] : []);
        assert.deepEqual(plain(changed), [a.answer], 'Exactly one position has changed');
        assert.ok(a.options.every(x => x >= 1 && x <= a.before.length));
      } else if (a.type === 'spot') {
        assert.equal(a.grid.filter(x => x === a.target).length, a.answer);
        assert.ok(a.options.every(x => Number.isInteger(x) && x >= 0));
      } else assert.fail('Unexpected puzzle type: ' + a.type);
      checked++;
    }
  }
}
assert.deepEqual([...types].sort(), ['change', 'growth', 'memory', 'repeat', 'spot']);
assert.notDeepEqual(plain(L.makeQ('memory', random(1), 'easy')), plain(L.makeQ('memory', random(2), 'easy')), 'Different seeds vary tasks');
assert.equal(L.mode('unknown'), 'mixed');
assert.equal(L.mode('memory'), 'memory');
assert.equal(L.makeQ('mixed', random(1), 'easy'), null, 'Classic mode stays with the existing generator');
const late = L.round({ mode: 'memory', level: 'hard', seed: 123, steps: 15, dur: 120, startIn: 0, remaining: 17250 });
assert.equal(late.mode, 'memory');
assert.equal(late.level, 'hard');
assert.equal(late.remaining, 17250, 'Late joiners receive only the remaining round time');
assert.deepEqual(plain(L.round({})), { mode: 'mixed', level: 'easy', seed: 0, steps: 10, dur: 120, startIn: 0, remaining: 120000 });
const bad = L.round({ mode: 'oops', level: 'oops', steps: -1, dur: Infinity, seed: 'bad', startIn: -10, remaining: -50 });
assert.deepEqual(plain(bad), { mode: 'mixed', level: 'easy', seed: 0, steps: 10, dur: 120, startIn: 0, remaining: 0 });
console.log(`PASS ${checked} deterministic challenges across 3 modes × 4 levels; answer uniqueness, independent rule checks and room normalization.`);
