'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load.js');

const data = load({ skipAudio: true });
const expected = Array.from({ length: 8 }, (_, index) => `p${283 + index}`);
const comics = expected.map(id => data.COMICS.find(comic => comic.id === id));

test('the hacker safety path contains eight complete trilingual comics', () => {
  assert.deepEqual(comics.map(comic => comic && comic.id), expected);
  assert.equal(new Set(comics.map(comic => comic.title)).size, 8, 'Norwegian titles are unique');
  for (const comic of comics) {
    assert.equal(comic.category, 'koding', `${comic.id} belongs to the coding course`);
    assert.equal(comic.track, 'hackers', `${comic.id} belongs to the hacker safety path`);
    assert.equal(comic.panels.length, 6, `${comic.id} has six illustrated panels`);
    assert.ok(comic.panels.every(panel => panel.art && panel.lines.length === 2), `${comic.id} panels are complete`);
    assert.ok(comic.panels.flatMap(panel => panel.lines).every(line => line.no && line.uk && line.en), `${comic.id} dialogue is trilingual`);
    assert.ok(comic.tasks.length >= 4, `${comic.id} has at least four tests`);
    assert.ok(comic.vocab.length >= 18, `${comic.id} has at least eighteen vocabulary items`);
    assert.ok(comic.sources.length >= 1, `${comic.id} cites an official or specialist source`);
  }
});

test('the series teaches risks, help-seeking and recovery without offensive instructions', () => {
  const no = comics.flatMap(comic => comic.panels.flatMap(panel => panel.lines)).map(line => line.no).join(' ');
  assert.match(no, /hacker|hacking/i);
  assert.match(no, /ulovlig|kriminell/i);
  assert.match(no, /sosial manipulering|nettfisking/i);
  assert.match(no, /konto(kapring|en)|kapret konto/i);
  assert.match(no, /identitet|personopplysninger/i);
  assert.match(no, /utpressing/i);
  assert.match(no, /løsepengevirus/i);
  assert.match(no, /sikkerhetskopi/i);
  assert.match(no, /voksen|politiet/i);
  assert.doesNotMatch(no, /steg-for-steg.+bryt|slik bryter du/i);
});

test('every hacker comic panel renders as valid SVG', () => {
  for (const comic of comics) for (let index = 0; index < comic.panels.length; index++) {
    const svg = data.KomiksArt.panel(comic, index, { bubbles: true, chars: data.CHARACTERS });
    assert.match(svg, /^<svg[^>]+viewBox="0 0 400 300"/);
    assert.equal(svg.includes('undefined'), false, `${comic.id}/${index + 1} has no undefined art values`);
  }
});
