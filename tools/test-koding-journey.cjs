'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets', 'koding.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: 'assets/koding.js' });

const journeyModel = sandbox.window.KomiksKoding.journeyModel;

test('selects the first lesson when no coding progress exists', () => {
  const model = journeyModel([
    { id: 'p183', read: false, stars: 0 },
    { id: 'p184', read: false, stars: 0 },
    { id: 'p185', read: false, stars: 0 }
  ]);

  assert.equal(model.done, 0);
  assert.equal(model.total, 3);
  assert.equal(model.activeIndex, 0);
  assert.equal(model.complete, false);
  assert.deepEqual(Array.from(model.steps, step => step.state), ['todo', 'todo', 'todo']);
  assert.equal(model.steps[0].active, true);
});

test('requires both reading and a test result to complete a lesson', () => {
  const model = journeyModel([
    { id: 'p183', read: true, stars: 3 },
    { id: 'p184', read: true, stars: 0 },
    { id: 'p185', read: false, stars: 2 },
    { id: 'p186', read: false, stars: 0 }
  ]);

  assert.equal(model.done, 1);
  assert.equal(model.activeIndex, 1);
  assert.deepEqual(Array.from(model.steps, step => step.state), ['done', 'started', 'started', 'todo']);
  assert.equal(model.steps[1].active, true);
  assert.equal(model.steps[2].active, false);
});

test('selects the final lesson and marks the journey complete when all lessons are done', () => {
  const model = journeyModel([
    { id: 'p183', read: true, stars: 1 },
    { id: 'p184', read: true, stars: 3 }
  ]);

  assert.equal(model.done, 2);
  assert.equal(model.total, 2);
  assert.equal(model.activeIndex, 1);
  assert.equal(model.complete, true);
  assert.deepEqual(Array.from(model.steps, step => step.state), ['done', 'done']);
  assert.equal(model.steps[1].active, true);
});
