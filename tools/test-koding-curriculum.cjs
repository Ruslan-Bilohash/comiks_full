'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const load = require('./load.js');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets', 'koding.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: 'assets/koding.js' });
const { curriculumModel } = sandbox.window.KomiksKoding;
const data = load({ skipAudio: true });
const coding = data.COMICS.filter(comic => comic.category === 'koding');

test('coding curriculum contains the twelve approved learning worlds', () => {
  assert.equal(typeof curriculumModel, 'function');
  const model = curriculumModel(coding.map(comic => ({ comic, read: false, stars: 0 })));
  assert.deepEqual(Array.from(model.tracks, track => track.id), ['basics', 'web', 'game', 'blender', 'unity', 'data', 'personal-safety', 'cyber-safety', 'scam-awareness', 'device-safety', 'secure-coding', 'hackers']);
  assert.deepEqual(Array.from(model.tracks, track => track.total), [12, 8, 8, 7, 7, 8, 8, 9, 8, 8, 8, 8]);
  assert.equal(model.total, 99);
});

test('fifty expansion comics complete the ninety-one-comic curriculum', () => {
  const expected = Array.from({ length: 50 }, (_, index) => `p${224 + index}`);
  const found = coding.filter(comic => expected.includes(comic.id));
  assert.deepEqual(Array.from(found, comic => comic.id), expected);
  const counts = Object.fromEntries(Array.from(new Set(found.map(comic => comic.track)), track => [track, found.filter(comic => comic.track === track).length]));
  assert.deepEqual(counts, { web:5, game:5, blender:5, unity:5, data:5, 'personal-safety':4, 'cyber-safety':5, 'scam-awareness':4, 'secure-coding':4, basics:4, 'device-safety':4 });
  assert.equal(new Set(found.map(comic => comic.title)).size, 50, 'new Norwegian titles are unique');
  for (const comic of found) {
    assert.equal(comic.panels.length, 6, `${comic.id} has six illustrated panels`);
    assert.ok(comic.panels.every(panel => panel.art && panel.lines.length === 2), `${comic.id} panels have art and dialogue`);
    assert.ok(comic.panels.flatMap(panel => panel.lines).every(line => line.no && line.uk && line.en), `${comic.id} dialogue is trilingual`);
    assert.ok(comic.tasks.length >= 3, `${comic.id} has at least three tasks`);
    assert.ok(comic.vocab.length >= 12, `${comic.id} has a useful vocabulary list`);
    assert.ok(comic.summaryNo && comic.summaryUk && comic.summaryEn, `${comic.id} has trilingual summaries`);
  }
});

test('the twelve new comics are complete learning objects', () => {
  const expected = Array.from({ length: 12 }, (_, index) => `p${192 + index}`);
  const found = coding.filter(comic => expected.includes(comic.id));
  assert.deepEqual(Array.from(found, comic => comic.id), expected);
  for (const comic of found) {
    assert.ok(['web', 'game', 'blender', 'unity', 'data'].includes(comic.track), `${comic.id} has a valid track`);
    assert.equal(comic.panels.length, 6, `${comic.id} has six illustrated panels`);
    assert.ok(comic.panels.every(panel => panel.art && Array.isArray(panel.lines) && panel.lines.length), `${comic.id} panels have art and dialogue`);
    assert.ok(comic.tasks.length >= 3, `${comic.id} has at least three tasks`);
    assert.ok(comic.vocab.length >= 12, `${comic.id} has a useful vocabulary list`);
    for (const item of comic.tasks) {
      assert.equal(item.q.length, 3, `${comic.id} task has three-language question`);
      assert.equal(item.answer.length, 3, `${comic.id} task has three-language answer`);
      assert.equal(item.wrong.length, 3, `${comic.id} task has three distractors`);
      assert.ok(item.wrong.every(option => option[0] !== item.answer[0]), `${comic.id} correct answer is not a distractor`);
    }
  }
});

test('twenty safety and secure coding comics are complete learning objects', () => {
  const expected = Array.from({ length: 20 }, (_, index) => `p${204 + index}`);
  const found = coding.filter(comic => expected.includes(comic.id));
  assert.deepEqual(Array.from(found, comic => comic.id), expected);
  assert.equal(new Set(found.map(comic => comic.title)).size, 20, 'Norwegian titles are unique');
  for (const comic of found) {
    assert.ok(['personal-safety', 'cyber-safety', 'scam-awareness', 'device-safety', 'secure-coding'].includes(comic.track), `${comic.id} has a valid safety track`);
    assert.equal(comic.panels.length, 6, `${comic.id} has six illustrated panels`);
    assert.ok(comic.panels.every(panel => panel.art && panel.lines.length === 2), `${comic.id} panels have art and dialogue`);
    assert.ok(comic.panels.flatMap(panel => panel.lines).every(line => line.no && line.uk && line.en), `${comic.id} dialogue is trilingual`);
    assert.ok(comic.tasks.length >= 3, `${comic.id} has at least three tasks`);
    assert.ok(comic.vocab.length >= 12, `${comic.id} has a useful vocabulary list`);
    assert.ok(comic.summaryNo && comic.summaryUk && comic.summaryEn, `${comic.id} has trilingual summaries`);
  }
});

test('every new illustration renders as valid SVG without missing values', () => {
  const found = coding.filter(comic => /^p(19[2-9]|2[0-6][0-9]|27[0-3])$/.test(comic.id));
  for (const comic of found) for (let index = 0; index < comic.panels.length; index++) {
    const svg = data.KomiksArt.panel(comic, index, { bubbles: true, chars: data.CHARACTERS });
    assert.match(svg, /^<svg[^>]+viewBox="0 0 400 300"/);
    assert.equal(svg.includes('undefined'), false, `${comic.id}/${index} has no undefined art values`);
  }
});

test('category progress is calculated independently', () => {
  const items = coding.map(comic => ({ comic, read: comic.id === 'p191', stars: comic.id === 'p191' ? 2 : 0 }));
  const model = curriculumModel(items);
  const web = model.tracks.find(track => track.id === 'web');
  assert.equal(web.done, 1);
  assert.equal(web.total, 8);
  assert.equal(web.journey.activeIndex, 1);
  assert.equal(model.done, 1);
});
