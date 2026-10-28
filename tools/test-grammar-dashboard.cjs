'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets', 'grammar.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: 'assets/grammar.js' });
const Grammar = sandbox.window.KomiksGrammar;

test('grammar dashboard aggregates attempts, best scores and review priority', () => {
  assert.equal(typeof Grammar.historyModel, 'function');
  const topics = [{ id:'pronouns', no:'Pronomen', level:'A1' }, { id:'verbs', no:'Verb', level:'A2' }];
  const log = [
    { key:'grammar:pronouns', title:'Pronomen', score:7, total:10, date:'2026-10-26' },
    { key:'clock', title:'Klokka', score:4, total:10, date:'2026-10-25' },
    { key:'grammar:pronouns', title:'Pronomen', score:9, total:10, date:'2026-10-24' },
    { key:'p100', title:'Other test', score:10, total:10, date:'2026-10-23' }
  ];
  const model = Grammar.historyModel(topics, log, {});
  assert.equal(model.completed, 2);
  assert.equal(model.total, 3);
  assert.equal(model.average, 65);
  assert.deepEqual(Array.from(model.completedItems, item => item.key), ['grammar:pronouns', 'clock']);
  assert.equal(model.completedItems[0].attempts, 2);
  assert.equal(model.completedItems[0].bestPct, 90);
  assert.equal(model.completedItems[0].lastPct, 70);
  assert.equal(model.reviewItems[0].key, 'clock');
  assert.equal(model.reviewItems[0].bestPct, 40);
});

test('grammar page exposes a cabinet, completed tests and repeat actions', () => {
  assert.match(source, /class:\s*'gram-cabinet\s+box'/);
  assert.match(source, /class:\s*'gram-history'/);
  assert.match(source, /class:\s*'gram-review'/);
  assert.match(source, /#\/quiz\/grammar/);
});
