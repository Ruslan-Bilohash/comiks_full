'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceMap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const builtMap = fs.readFileSync(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
const extras = fs.readFileSync(path.join(root, 'assets', 'extras.js'), 'utf8');

assert.equal(sourceMap, builtMap, 'root sitemap.xml must stay synchronized with the generated production sitemap');

const urls = [...builtMap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert(urls.length >= 2000, `expected the complete sitemap, got ${urls.length} URLs`);
assert.equal(new Set(urls).size, urls.length, 'sitemap URLs must be unique');
assert(!urls.some(url => url.includes('#')), 'XML sitemap must not contain fragment URLs');
for (const url of [
  'https://bilohash.com/comiks/uk/vyvchennya-norvezkoyi/',
  'https://bilohash.com/comiks/coding-for-kids/',
  'https://bilohash.com/comiks/english/',
  'https://bilohash.com/comiks/uk/komiks/p301/',
  'https://bilohash.com/comiks/uk/download/android/',
]) assert(urls.includes(url), `sitemap is missing ${url}`);

assert(extras.includes('window.KomiksGrammar.topics()'), 'human site map must list every grammar topic');
assert(extras.includes('window.KomiksEnglish.comics()'), 'human site map must list every English story');
for (const route of ['#/english/alphabet', '#/english/plan', '#/english/words']) {
  assert(extras.includes(route), `human site map is missing ${route}`);
}

console.log(`PASS sitemap: ${urls.length} unique indexable URLs plus dynamic grammar and English catalogues`);
