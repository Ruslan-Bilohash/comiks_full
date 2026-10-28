const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const expectedIndex = fs.readFileSync(path.join(root, 'dist', 'data', 'index.js'), 'utf8');
const expectedVersion = (expectedIndex.match(/["']?version["']?\s*:\s*["']([^"']+)["']/) || [])[1];

const base = 'https://bilohash.com/comiks/';
const get = async relative => {
  const glue = relative.includes('?') ? '&' : '?';
  const response = await fetch(base + relative + glue + 'qa=' + Date.now(), { cache: 'no-store' });
  assert.equal(response.status, 200, `${relative} HTTP 200`);
  return response.text();
};

async function main() {
  assert(expectedVersion, 'local dist build version');
  const [index, sitemap] = await Promise.all([get('data/index.js'), get('sitemap.xml')]);
  assert(index.includes(`"version": "${expectedVersion}"`) || index.includes(`version: '${expectedVersion}'`), 'live build version');
  assert(index.includes('data/comic-192-203-koding-worlds.js'), 'live p192–p203 coding bundle');
  assert(index.includes('data/comic-204-223-safety.js'), 'live p204–p223 safety bundle');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  const codingUrls = urls.filter(url => /coding-for-kids|programmering-for-barn|programuvannya-dlya-ditey/.test(url));
  assert.equal(codingUrls.length, 36, 'live sitemap coding URL count');

  const hubs = {
    en: 'coding-for-kids/',
    no: 'no/programmering-for-barn/',
    uk: 'uk/programuvannya-dlya-ditey/'
  };
  for (const [lang, relative] of Object.entries(hubs)) {
    const html = await get(relative);
    for (const type of ['Course', 'ItemList', 'FAQPage', 'BreadcrumbList']) {
      assert(html.includes(`"@type":"${type}"`), `${lang} live schema ${type}`);
    }
    assert(html.includes('hreflang="x-default"'), `${lang} live x-default`);
  }

  console.log(`PASS live: ${expectedVersion}, p192–p223, ${codingUrls.length} sitemap URLs, 3 localized schema hubs`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
