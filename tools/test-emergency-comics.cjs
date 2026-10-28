'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load.js');
const data = load({ skipAudio:true });
const ids = Array.from({ length:8 }, (_, index) => `p${275 + index}`);

test('eight emergency comics include scenes, tests, vocabulary and sources', () => {
  const found = data.COMICS.filter(comic => ids.includes(comic.id));
  assert.deepEqual(found.map(comic => comic.id), ids);
  assert.equal(new Set(found.map(comic => comic.title)).size, 8);
  for (const comic of found) {
    assert.ok(['helse','kultur'].includes(comic.category), `${comic.id} has a visible site category`);
    assert.equal(comic.panels.length, 6, `${comic.id} has six scenes`);
    assert.ok(comic.panels.every(panel => panel.art && panel.lines.length === 2));
    assert.ok(comic.panels.flatMap(panel => panel.lines).every(line => line.no && line.uk && line.en));
    assert.ok(comic.tasks.length >= 4, `${comic.id} has at least four tests`);
    assert.ok(comic.vocab.length >= 18, `${comic.id} has at least eighteen terms`);
    assert.ok(comic.sources.length >= 1, `${comic.id} cites an official source`);
  }
});

test('the emergency series teaches the essential Norwegian help numbers', () => {
  const text = data.COMICS.filter(comic => ids.includes(comic.id)).flatMap(comic => comic.panels).flatMap(panel => panel.lines).map(line => line.no).join(' ');
  for (const number of ['110','112','113','02800','116 117','22 59 13 00','116 006']) assert.match(text, new RegExp(number.replace(' ', '\\s')));
});

test('all emergency illustrations render as valid SVG', () => {
  for (const comic of data.COMICS.filter(item => ids.includes(item.id))) for (let index = 0; index < comic.panels.length; index++) {
    const svg = data.KomiksArt.panel(comic, index, { bubbles:true, chars:data.CHARACTERS });
    assert.match(svg, /^<svg[^>]+viewBox="0 0 400 300"/);
    assert.equal(svg.includes('undefined'), false, `${comic.id}/${index} renders without missing values`);
  }
});
