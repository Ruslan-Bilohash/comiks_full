'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const stats = JSON.parse(fs.readFileSync(path.join(root, 'data/i18n-stats.json'), 'utf8'));
const expected = ['uk', 'no', 'ar', 'de', 'pl', 'tr', 'lt'];

for (const lang of expected) {
  const row = stats.langs?.[lang];
  assert.ok(row, `missing language ${lang}`);
  assert.equal(row.has, row.total, `${lang} must be translated 100% (${row.has}/${row.total})`);
  for (const [group, values] of Object.entries(row.groups || {})) {
    assert.equal(values.has, values.total, `${lang}.${group} must be translated 100% (${values.has}/${values.total})`);
    assert.deepEqual(values.missing || [], [], `${lang}.${group} still lists missing strings`);
  }
}

console.log('PASS: all seven Komiks·Lab languages are translated 100% in every tracked group');
