'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const htmlFile = path.join(root, 'dist', 'sitemap.html');
assert(fs.existsSync(htmlFile), 'dist/sitemap.html must exist for /comiks/sitemap');

const html = fs.readFileSync(htmlFile, 'utf8');
assert(html.includes('<link rel="canonical" href="https://bilohash.com/comiks/sitemap">'), 'friendly sitemap needs a self canonical');
assert(html.includes('<meta name="robots" content="index,follow">'), 'friendly sitemap must be indexable');
assert(html.includes('application/ld+json'), 'friendly sitemap needs structured data');
assert(html.includes('href="https://bilohash.com/comiks/sitemap.xml"'), 'friendly sitemap must link to sitemap.xml');
assert((html.match(/<a\s/g) || []).length >= 200, 'friendly sitemap must expose the real site catalogue');
for (const href of [...html.matchAll(/href="(https:\/\/bilohash\.com\/comiks\/[^"#]*)/g)].map(match => match[1])) {
  const pathname = new URL(href).pathname.replace(/^\/comiks\/?/, '');
  const target = pathname === 'sitemap' ? 'sitemap.html' : !pathname ? 'index.html' : pathname.endsWith('/') ? pathname + 'index.html' : pathname;
  assert(fs.existsSync(path.join(root, 'dist', target)), `friendly sitemap links to a missing build file: ${href}`);
}

const htaccess = fs.readFileSync(path.join(root, '.htaccess'), 'utf8');
assert(/RewriteRule \^sitemap\$ sitemap\.html \[L\]/.test(htaccess), '/sitemap must internally resolve to sitemap.html');
assert(/RewriteRule \^sitemap\/\$ \/comiks\/sitemap \[R=301,L\]/.test(htaccess), '/sitemap/ must canonicalize to /sitemap');

const xml = fs.readFileSync(path.join(root, 'dist', 'sitemap.xml'), 'utf8');
assert(xml.includes('<loc>https://bilohash.com/comiks/sitemap</loc>'), 'XML sitemap must list the indexable HTML site map');

console.log('PASS friendly sitemap: indexable HTML page, canonical rewrite and XML discovery');
