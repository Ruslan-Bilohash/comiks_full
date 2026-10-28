const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const generator = path.join(__dirname, 'build-norwegian-seo.js');
assert(fs.existsSync(generator), 'Norwegian SEO generator exists');

const mod = require(generator);
const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'komiks-seo-'));
const result = mod({ DIST: tmp, base: 'https://bilohash.com/comiks/', today: '2026-10-28' });
const languages = ['en','uk','no','de','pl','tr','lt','ar'];
const intents = ['start','tests','trainer','app','duolingo'];
assert.strictEqual(result.entries.length, languages.length * intents.length, 'five intents exist in eight languages');

const titles = new Set();
for (const entry of result.entries) {
  const file = path.join(tmp, ...entry.path.split('/'), 'index.html');
  assert(fs.existsSync(file), `generated ${entry.path}`);
  const html = fs.readFileSync(file, 'utf8');
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1];
  const h1 = (html.match(/<h1>(.*?)<\/h1>/s) || [])[1];
  assert(title && desc && h1, `${entry.path} has title, description and H1`);
  assert(!titles.has(title), `${entry.path} title is unique`); titles.add(title);
  assert(html.includes(`<link rel="canonical" href="${entry.url}">`), `${entry.path} has its canonical URL`);
  for (const lang of languages) assert(html.includes(`hreflang="${lang === 'no' ? 'nb' : lang}"`), `${entry.path} links ${lang}`);
  assert(html.includes('hreflang="x-default"'), `${entry.path} has x-default`);
  assert((html.match(/application\/ld\+json/g) || []).length >= 3, `${entry.path} has structured data`);
  for (const block of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(block[1]);
  assert(html.includes('<details') && html.includes('<footer'), `${entry.path} has visible FAQ and footer`);
  assert(html.includes('#/'), `${entry.path} links to an interactive Komiks Lab exercise`);
  if (entry.key === 'duolingo') assert(/independent|незалеж|uavhengig|unabhängig|niezależ|bağımsız|nepriklaus|مستقل/i.test(html), 'comparison states independence');
}

const groups = Object.groupBy(result.entries, x => x.key);
for (const intent of intents) {
  assert.strictEqual(groups[intent].length, languages.length, `${intent} has every language`);
  for (const e of groups[intent]) assert.strictEqual(e.alternates.length, languages.length + 1, `${e.path} alternates are reciprocal`);
}

const build = fs.readFileSync(path.join(__dirname, 'build.js'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(build.includes("require('./build-norwegian-seo.js')"), 'main build invokes Norwegian SEO generator');
assert(build.includes('NORWEGIAN_SEO.entries'), 'sitemap includes Norwegian SEO entries');
assert(home.includes('seo-foot-links') && home.includes('Вивчення норвезької'), 'main footer exposes the SEO cluster');

console.log('ALL NORWEGIAN SEO PAGE TESTS PASSED');
