'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const moduleFile = path.join(__dirname, 'build-download-pages.js');
const base = 'https://bilohash.com/comiks/';
const original = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>https://bilohash.com/comiks/uk/komiks/p90/</loc><lastmod>2026-09-26</lastmod><xhtml:link rel="alternate" hreflang="uk" href="https://bilohash.com/comiks/uk/komiks/p90/"/><image:image><image:loc>https://bilohash.com/comiks/img/p90.svg</image:loc><image:title>Дім &amp; родина</image:title></image:image></url>
</urlset>
`;
function fixture(run) {
  assert.ok(fs.existsSync(moduleFile), 'The download landing-page generator must exist');
  const writePages = require(moduleFile);
  const workspace = path.resolve(__dirname, '..');
  const dir = fs.mkdtempSync(path.join(workspace, '.download-pages-test-'));
  try {
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), original);
    run(writePages, dir);
  } finally {
    assert.equal(path.dirname(path.resolve(dir)), workspace, 'Test cleanup stays in its workspace');
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
test('build emits indexable platform pages with matching canonical, schema and store destinations', () => fixture((writePages, dir) => {
  writePages({ outputDir: dir, base });
  const expected = [
    ['windows', 'Windows', 'https://apps.microsoft.com/detail/9MZTK7VJZ37D'],
    ['android', 'Android', 'https://play.google.com/store/apps/details?id=com.bilohash.comiks']
  ];
  for (const [slug, platform, store] of expected) {
    const html = fs.readFileSync(path.join(dir, 'uk', 'download', slug, 'index.html'), 'utf8');
    const url = `${base}uk/download/${slug}/`;
    assert.match(html, /<html lang="uk">/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(`Learning Norwegian для ${platform}`));
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
    assert.ok(html.includes(`property="og:url" content="${url}"`));
    if (slug === 'android') {
      assert.ok(html.includes(`target=${JSON.stringify(store)}`), 'Android store destination is revealed only after the request');
      assert.match(html, /kind:'android'/, 'Android request is recorded in feedback');
      assert.match(html, /type="email"[^>]*required/, 'Android email is required');
      assert.match(html, /captcha=1/, 'Android request loads a CAPTCHA');
    } else assert.ok(html.includes(`href="${store}"`));
    assert.ok(html.includes(`href="${base}uk/download/${slug === 'windows' ? 'android' : 'windows'}/"`));
    assert.ok(html.includes(`href="${base}uk/komiks/"`));
    assert.doesNotMatch(html, /noindex|http-equiv="refresh"/);
    if (slug === 'windows') assert.doesNotMatch(html, /<script(?! type="application\/ld\+json")/);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const app = graph.find(item => item['@type'] === 'SoftwareApplication');
    assert.equal(app.operatingSystem, platform);
    assert.equal(app.downloadUrl, store);
    assert.equal(app.url, url);
    for (const key of ['offers', 'aggregateRating', 'softwareVersion', 'fileSize', 'softwareRequirements']) assert.equal(app[key], undefined);
  }
}));
test('sitemap update retains existing XML exactly and is idempotent', () => fixture((writePages, dir) => {
  writePages({ outputDir: dir, base });
  const once = fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8');
  const existing = original.slice(0, original.indexOf('</urlset>'));
  assert.ok(once.startsWith(existing), 'Existing dates, alternates, image tags and order must remain unchanged');
  for (const slug of ['windows', 'android']) assert.equal(once.split(`<loc>${base}uk/download/${slug}/</loc>`).length - 1, 1);
  writePages({ outputDir: dir, base });
  assert.equal(fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8'), once);
}));
test('build respects a configured site subdirectory without inventing translated alternates', () => fixture((writePages, dir) => {
  writePages({ outputDir: dir, base: 'https://example.test/course' });
  const html = fs.readFileSync(path.join(dir, 'uk/download/android/index.html'), 'utf8');
  assert.ok(html.includes('href="https://example.test/course/uk/download/android/"'));
  assert.ok(html.includes('src="https://example.test/course/icons/icon-128.png"'));
  assert.doesNotMatch(html, /hreflang=|bilohash\.com\/comiks\//);
}));
test('invalid sitemap is rejected before generating or replacing files', () => fixture((writePages, dir) => {
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), '<not-a-sitemap/>');
  assert.throws(() => writePages({ outputDir: dir, base }), /sitemap/i);
  assert.equal(fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8'), '<not-a-sitemap/>');
  assert.equal(fs.existsSync(path.join(dir, 'uk')), false);
}));
