'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load.js');

const data = load({ skipAudio:true });

test('SIS and deportation comic is a complete trilingual learning object', () => {
  const comic = data.COMICS.find(item => item.id === 'p274');
  assert.ok(comic, 'p274 is registered');
  assert.equal(comic.category, 'kultur');
  assert.equal(comic.level, 'B1');
  assert.equal(comic.panels.length, 6);
  assert.ok(comic.panels.every(panel => panel.art && panel.lines.length >= 2));
  assert.ok(comic.panels.flatMap(panel => panel.lines).every(line => line.no && line.uk && line.en));
  assert.ok(comic.vocab.length >= 18);
  assert.ok(comic.tasks.length >= 4);
  assert.ok(comic.sources.length >= 3);
  assert.match(comic.summaryNo, /SIS|Schengen/);
});

test('SIS comic distinguishes the decisions and explains individual rights', () => {
  const comic = data.COMICS.find(item => item.id === 'p274');
  const no = comic.panels.flatMap(panel => panel.lines).map(line => line.no).join(' ');
  assert.match(no, /utreiseplikt/);
  assert.match(no, /innreiseforbud/);
  assert.match(no, /utvisning/i);
  assert.match(no, /innsyn/);
  assert.match(no, /rette|slette/);
  assert.match(no, /klage/);
});

test('every SIS panel renders as a valid illustration', () => {
  const comic = data.COMICS.find(item => item.id === 'p274');
  for (let index = 0; index < comic.panels.length; index++) {
    const svg = data.KomiksArt.panel(comic, index, { bubbles:true, chars:data.CHARACTERS });
    assert.match(svg, /^<svg[^>]+viewBox="0 0 400 300"/);
    assert.equal(svg.includes('undefined'), false, `panel ${index + 1} has no undefined art values`);
  }
});
