'use strict';
const assert = require('node:assert/strict');
const load = require('./load.js');

const w = load();
const ids = Array.from({ length: 8 }, (_, i) => `p${291 + i}`);
const stories = ids.map(id => w.COMICS.find(c => c.id === id));
assert.ok(stories.every(Boolean), 'all eight possessive comics p291-p298 must be registered');
assert.equal(new Set(stories.map(c => c.title)).size, 8, 'every comic needs a distinct Norwegian title');
assert.equal(new Set(stories.map(c => c.summaryNo)).size, 8, 'every comic needs a distinct plot');
for (const comic of stories) {
  assert.notEqual(comic.category, 'koding', `${comic.id} belongs to the Norwegian course`);
  assert.ok(['A1', 'A2', 'B1'].includes(comic.level), `${comic.id} has a supported level`);
  assert.equal(comic.panels.length, 6, `${comic.id} needs six story scenes`);
  assert.ok(comic.tasks.length >= 4, `${comic.id} needs at least four original tests`);
  assert.ok(comic.vocab.length >= 18, `${comic.id} needs at least 18 vocabulary entries`);
  for (const field of ['title', 'titleUk', 'titleEn', 'summaryNo', 'summaryUk', 'summaryEn']) {
    assert.ok(String(comic[field] || '').trim(), `${comic.id}.${field} is required`);
  }
  assert.ok(comic.sources?.some(source => /ntnu\.edu/.test(source.url || source[1] || '')), `${comic.id} cites the grammar source`);
}

const topics = w.GRAMMAR.topics;
for (const id of ['possessive-my-your', 'possessive-our-third', 'possessive-order']) {
  const topic = topics.find(x => x.id === id);
  assert.ok(topic, `grammar topic ${id} must exist`);
  assert.ok(topic.items.length >= 10, `${id} needs enough practice questions`);
  assert.ok(topic.table.length >= 4, `${id} needs a clear comparison table`);
}
const allGrammar = topics.filter(x => /^possessive/.test(x.id)).map(x => JSON.stringify(x)).join(' ');
for (const form of ['min', 'mi', 'mitt', 'mine', 'din', 'di', 'ditt', 'dine', 'vår', 'vårt', 'våre', 'hans', 'hennes', 'deres']) {
  assert.match(allGrammar, new RegExp(`\\b${form}\\b`, 'i'), `grammar practice is missing ${form}`);
}

console.log('PASS possessive course: 8 comics, 3 focused grammar topics');
