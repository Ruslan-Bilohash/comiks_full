'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const load = require('./load.js');

const w = load();
const ids = ['p299', 'p300', 'p301'];
const stories = ids.map(id => w.COMICS.find(comic => comic.id === id));
assert.ok(stories.every(Boolean), 'all three A2 everyday-life comics p299-p301 must be registered');
assert.equal(new Set(stories.map(comic => comic.title)).size, 3, 'each comic needs a distinct plot');

for (const comic of stories) {
  assert.equal(comic.level, 'A2', `${comic.id} is an A2 lesson`);
  assert.notEqual(comic.category, 'koding', `${comic.id} belongs to the Norwegian course`);
  assert.equal(comic.panels.length, 6, `${comic.id} needs six illustrated scenes`);
  assert.ok(comic.tasks.length >= 8, `${comic.id} needs at least eight authored tests`);
  assert.ok(comic.vocab.length >= 18, `${comic.id} needs at least eighteen vocabulary entries`);
  for (const field of ['title', 'titleUk', 'titleEn', 'summaryNo', 'summaryUk', 'summaryEn']) {
    assert.ok(String(comic[field] || '').trim(), `${comic.id}.${field} is required`);
  }
  for (const task of comic.tasks) {
    assert.equal(task.q.length, 3, `${comic.id} test questions are trilingual`);
    assert.equal(task.answer.length, 3, `${comic.id} test answers are trilingual`);
    assert.ok(task.wrong.length >= 3, `${comic.id} test has three distractors`);
  }
}

const all = stories.map(comic => JSON.stringify(comic)).join(' ').toLowerCase();
for (const word of [
  'inntekt', 'spare', 'trives', 'leie', 'eie', 'moderne', 'pusse opp', 'ha råd til',
  'prøverom', 'kikke', 'størrelse', 'tilbud', 'handle', 'betale', 'spandere',
  'forsove seg', 'hente', 'for sent', 'lete etter', 'finne', 'opptatt', 'ledig'
]) assert.ok(all.includes(word), `comic lessons need the target word: ${word}`);

const grammar = w.GRAMMAR.topics.find(topic => topic.id === 'connectors-reason-contrast');
assert.ok(grammar, 'connector grammar topic must exist');
assert.ok(grammar.table.length >= 7, 'connector topic needs a comparison row for every form');
assert.ok(grammar.examples.length >= 7, 'connector topic needs clear contextual examples');
assert.ok(grammar.items.length >= 14, 'connector topic needs a substantial practice test');
const grammarText = JSON.stringify(grammar).toLowerCase();
for (const form of ['derfor', 'likevel', 'dessuten', 'ettersom', 'på grunn av', 'for å', 'i motsetning til']) {
  assert.ok(grammarText.includes(form), `grammar topic is missing ${form}`);
}

const updatesSource = fs.readFileSync(path.join(__dirname, '..', 'data', 'updates.js'), 'utf8');
assert.match(updatesSource, /id:\s*'2026-10-27-2'/, 'the release needs a What is new entry');
assert.match(updatesSource, /#\/read\/p299\/0/, 'the update opens the first new comic');

console.log('PASS A2 everyday course: 3 comics, 24 authored tests and connector grammar');
