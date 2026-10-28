'use strict';
const https = require('https');
const get = url => new Promise((resolve, reject) => https.get(url, { headers: { 'User-Agent':'Komiks-release-check' } }, response => {
  let body = ''; response.on('data', chunk => body += chunk); response.on('end', () => resolve({ url, status:response.statusCode, body }));
}).on('error', reject));

(async () => {
  const urls = [
    'https://bilohash.com/comiks/',
    'https://bilohash.com/comiks/learn-norwegian/',
    'https://bilohash.com/comiks/uk/vyvchennya-norvezkoyi/testy/',
    'https://bilohash.com/comiks/ar/taallam-alnorwijia/badil-duolingo/',
    'https://bilohash.com/comiks/privacy.html',
    'https://bilohash.com/comiks/sitemap.xml',
    'https://bilohash.com/comiks/api/health.php',
  ];
  const rows = await Promise.all(urls.map(get));
  for (const row of rows) console.log(row.status, row.body.length, row.url);
  if (rows.some(row => row.status !== 200)) throw new Error('one or more production URLs are not HTTP 200');
  if (!rows[0].body.includes('seo-foot-links')) throw new Error('footer cluster is missing');
  if (!rows[1].body.includes('Learn Norwegian from zero')) throw new Error('English landing page is missing');
  if (!rows[2].body.includes('Тести з норвезької')) throw new Error('Ukrainian tests page is missing');
  if (!rows[3].body.includes('Komiks·Lab مشروع تعليمي مستقل')) throw new Error('Arabic comparison disclosure is missing');
  if (!rows[4].body.includes('Історія успішних входів')) throw new Error('privacy disclosure is missing');
  const roots = ['learn-norwegian','uk/vyvchennya-norvezkoyi','no/laer-norsk','de/norwegisch-lernen','pl/nauka-norweskiego','tr/norvecce-ogren','lt/mokytis-norvegu','ar/taallam-alnorwijia'];
  const locs = [...rows[5].body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const count = locs.filter(url => roots.some(root => url.startsWith('https://bilohash.com/comiks/' + root))).length;
  if (count !== 40) throw new Error(`live sitemap has ${count} Norwegian SEO URLs instead of 40`);
  const health = JSON.parse(rows[6].body);
  if (!health.ok) throw new Error('production health endpoint is not ok');
  console.log('PASS production smoke: footer, three locales, privacy, 40 sitemap URLs and API health');
})().catch(error => { console.error(error); process.exit(1); });
