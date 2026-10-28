'use strict';

const assert = require('node:assert/strict');
const queue = require('./build-word-image-queue.cjs');

const audit = { entries: [
  { id: 'a_001', norwegian: 'ei hytte', ukrainian: 'хатина', english: 'a cabin', category: 'a', sharedKey: 'same', generatedPath: 'img/words/a/hytte.png', filename: 'hytte.png', prompt: 'cabin prompt', needsGeneration: true, status: 'missing' },
  { id: 'b_001', norwegian: 'ei hytte', ukrainian: 'хатина', english: 'a cabin', category: 'b', sharedKey: 'same', generatedPath: 'img/words/a/hytte.png', filename: 'hytte.png', prompt: 'cabin prompt', needsGeneration: true, status: 'missing' },
  { id: 'c_001', norwegian: 'en is', ukrainian: 'морозиво', english: 'ice cream', category: 'c', sharedKey: 'ice', generatedPath: 'img/words/c/is.png', filename: 'is.png', prompt: 'ice prompt', needsGeneration: false, status: 'generated', image: 'img/words/c/is.png', sourceType: 'generated-png' },
] };

const built = queue.buildQueue(audit, null);
assert.equal(built.items.length, 2, 'deduplicates identical meanings into one generation job');
assert.deepEqual(built.items.find(x => x.id === 'same').wordIds, ['a_001', 'b_001']);
assert.equal(built.items.find(x => x.id === 'same').status, 'pending');
assert.equal(built.items.find(x => x.id === 'ice').status, 'generated');
process.stdout.write('PASS queue deduplicates meanings and preserves generated state\n');

const resumed = queue.buildQueue(audit, { items: [{
  id: 'same', status: 'failed', attempts: 2, error: 'generator_unavailable', generatedPath: 'img/words/a/hytte.png', prompt: 'cabin prompt'
}] });
const same = resumed.items.find(x => x.id === 'same');
assert.equal(same.status, 'failed');
assert.equal(same.attempts, 2);
assert.equal(same.error, 'generator_unavailable');
process.stdout.write('PASS queue resumes without losing per-image state\n');

const mapping = queue.buildMapping({ entries: [
  { norwegian: 'en is', ukrainian: 'морозиво', status: 'generated', image: 'img/words/mat/is.png' },
  { norwegian: 'en is', ukrainian: 'лід', status: 'generated', image: 'img/words/vaer/is.png' },
  { norwegian: 'ei hytte', ukrainian: 'хатина', status: 'generated', image: 'img/words/friluft/hytte.png' },
] });
assert.deepEqual(mapping.is, [
  { src: 'img/words/mat/is.png', uk: 'морозиво' },
  { src: 'img/words/vaer/is.png', uk: 'лід' },
]);
assert.equal(mapping.hytte, 'img/words/friluft/hytte.png');
process.stdout.write('PASS mapping preserves translation-specific meanings\n');

const js = queue.mappingModule(mapping);
assert.match(js, /KomiksPics\.addPhotos/);
assert.doesNotMatch(js, /undefined/);

const indexSource = '"data/word-photos.js",\n    "data/updates.js",';
const indexed = queue.ensureIndexEntry(indexSource);
assert.match(indexed, /word-photos\.js"[\s\S]*word-images-generated\.js"[\s\S]*updates\.js"/);
assert.equal((queue.ensureIndexEntry(indexed).match(/word-images-generated\.js/g) || []).length, 1);
process.stdout.write('PASS data loader insertion is ordered and idempotent\n');
process.stdout.write('ALL WORD IMAGE QUEUE TESTS PASSED\n');

