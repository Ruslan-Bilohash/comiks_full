'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'data', 'updates.js'), 'utf8'), sandbox);
const latest = sandbox.window.KOMIKS_UPDATES[0];
const everyday = sandbox.window.KOMIKS_UPDATES.find(item => item.id === '2026-10-27-2');
const possessives = sandbox.window.KOMIKS_UPDATES.find(item => item.id === '2026-10-27');
const hackers = sandbox.window.KOMIKS_UPDATES.find(item => item.id === '2026-10-26-6');
const coding = sandbox.window.KOMIKS_UPDATES.find(item => item.id === '2026-10-26-3');
assert.equal(latest.id, '2026-10-27-4', 'Android testing request is the latest update');
assert.equal(latest.link, '#/install', 'latest update opens the install page');
for (const language of ['uk', 'en', 'no', 'ar', 'de', 'pl', 'tr', 'lt']) {
  assert.ok(Array.isArray(latest[language]) && latest[language].length >= 2, `${language} update copy exists`);
}
assert.match(latest.uk.join(' '), /Android.+email|перевірк.+спам|категор/i, 'Ukrainian update describes the Android testing gate');
assert.equal(everyday.link, '#/read/p299/0', 'A2 update still opens the first everyday comic');
assert.match(everyday.uk.join(' '), /три нові|24.+тест|derfor/i, 'previous update still describes the A2 series');
assert.equal(possessives.link, '#/read/p291/0', 'possessive update still opens the first possessive comic');
assert.match(possessives.uk.join(' '), /8.+комікс|min.+mine|присвій/i, 'previous update still describes the possessive series');
assert.equal(hackers.link, '#/read/p283/0', 'hacker update still opens the first hacker safety comic');
assert.equal(coding.link, '#/koding', 'previous update still opens the coding course');
assert.match(coding.uk.join(' '), /50.+комікс|91 урок/i, 'coding update still describes fifty additional comics');
console.log('PASS A2 update: 8 languages and retained previous release routes');
