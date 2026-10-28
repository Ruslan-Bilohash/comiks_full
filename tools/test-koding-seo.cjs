const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const pages = {
  en: ['coding-for-kids', 'foundations', 'web', 'game-development', 'blender-3d', 'unity', 'databases', 'everyday-safety', 'online-safety', 'spot-scams', 'device-safety', 'secure-coding', 'hackers-cyber-defence'],
  no: ['no/programmering-for-barn', 'grunnlag', 'web', 'spillutvikling', 'blender-3d', 'unity', 'databaser', 'trygg-hverdag', 'nettsikkerhet', 'avslor-svindel', 'enhetssikkerhet', 'sikker-programmering', 'hackere-cybervern'],
  uk: ['uk/programuvannya-dlya-ditey', 'osnovy', 'veb', 'rozrobka-igor', 'blender-3d', 'unity', 'bazy-danyh', 'bezpeka-v-zhytti', 'bezpeka-onlain', 'rozpiznavannia-shakhraistva', 'zakhyst-prystroiv', 'bezpechne-programuvannia', 'khakery-kiberzakhyst'],
};

const paths = [];
for (const [lang, list] of Object.entries(pages)) {
  const hub = list[0];
  paths.push({ lang, key: 'hub', rel: `${hub}/index.html` });
  for (const slug of list.slice(1)) paths.push({ lang, key: slug, rel: `${hub}/${slug}/index.html` });
}

assert.equal(paths.length, 39, 'expected 39 localized coding SEO pages');
for (const page of paths) {
  const file = path.join(dist, ...page.rel.split('/'));
  assert(fs.existsSync(file), `missing ${page.rel}`);
  const html = fs.readFileSync(file, 'utf8');
  assert(/<link rel="canonical" href="https:\/\/bilohash\.com\/comiks\//.test(html), `${page.rel}: canonical`);
  assert.equal((html.match(/hreflang="x-default"/g) || []).length, 1, `${page.rel}: x-default`);
  for (const code of ['en', 'nb', 'uk']) assert(html.includes(`hreflang="${code}"`), `${page.rel}: hreflang ${code}`);
  assert(html.includes('application/ld+json'), `${page.rel}: JSON-LD`);
  assert(html.includes('BreadcrumbList'), `${page.rel}: BreadcrumbList`);
  assert(/<meta name="description" content=".{70,170}">/.test(html), `${page.rel}: useful description`);
  assert(/<meta name="keywords" content="[^\"]{40,}">/.test(html), `${page.rel}: keywords`);
  assert(/href="https:\/\/bilohash\.com\/comiks\/#\/koding/.test(html), `${page.rel}: app link`);
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert(scripts.length >= 2, `${page.rel}: multiple schema blocks`);
  for (const [, json] of scripts) assert.doesNotThrow(() => JSON.parse(json), `${page.rel}: valid JSON-LD`);
}

const hub = fs.readFileSync(path.join(dist, 'coding-for-kids', 'index.html'), 'utf8');
for (const type of ['Course', 'ItemList', 'FAQPage']) assert(hub.includes(`"@type":"${type}"`), `hub schema ${type}`);
for (const term of ['Scratch', 'Python', 'JavaScript', 'HTML', 'CSS', 'C#', 'SQL', 'Swift', 'Kotlin']) {
  assert(hub.includes(term), `hub explains ${term}`);
}
for (const term of ['CAPTCHA', 'phishing', 'HTTPS', 'password']) assert(hub.toLowerCase().includes(term.toLowerCase()), `hub explains ${term}`);

const secureCoding = fs.readFileSync(path.join(dist, 'coding-for-kids', 'secure-coding', 'index.html'), 'utf8');
for (const id of ['p220', 'p221', 'p222', 'p223']) assert(secureCoding.includes(`#/read/${id}/0`), `secure coding links ${id}`);
const everydaySafety = fs.readFileSync(path.join(dist, 'coding-for-kids', 'everyday-safety', 'index.html'), 'utf8');
for (const id of ['p204', 'p205', 'p206', 'p207']) assert(everydaySafety.includes(`#/read/${id}/0`), `everyday safety links ${id}`);
const hackers = fs.readFileSync(path.join(dist, 'coding-for-kids', 'hackers-cyber-defence', 'index.html'), 'utf8');
for (const id of ['p283','p284','p285','p286','p287','p288','p289','p290']) assert(hackers.includes(`#/read/${id}/0`), `hackers links ${id}`);

const W = require('./load.js')();
const coding = W.COMICS.filter(c => c.category === 'koding');
const allTrackHtml = pages.en.slice(1).map(slug => fs.readFileSync(path.join(dist, 'coding-for-kids', slug, 'index.html'), 'utf8')).join('\n');
for (const c of coding) assert(allTrackHtml.includes(`#/read/${c.id}/0`), `coding track pages include ${c.id}`);

const noWeb = fs.readFileSync(path.join(dist, 'no/programmering-for-barn/web/index.html'), 'utf8');
assert(noWeb.includes('https://bilohash.com/comiks/no/komiks/p192/'), 'Norwegian ItemList uses localized comic URLs');
const ukWeb = fs.readFileSync(path.join(dist, 'uk/programuvannya-dlya-ditey/veb/index.html'), 'utf8');
assert(ukWeb.includes('https://bilohash.com/comiks/uk/komiks/p192/'), 'Ukrainian ItemList uses localized comic URLs');

const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
for (const page of paths) {
  const url = `https://bilohash.com/comiks/${page.rel.replace(/index\.html$/, '')}`;
  assert(sitemap.includes(`<loc>${url}</loc>`), `sitemap missing ${url}`);
}

console.log(`PASS koding SEO: ${paths.length} pages, metadata, JSON-LD, hreflang and sitemap`);
