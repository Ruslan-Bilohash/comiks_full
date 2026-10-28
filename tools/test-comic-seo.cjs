'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const W = require('./load.js')();
const base = 'https://bilohash.com/comiks/';
const langs = {
  en: { root:'english', html:'en' },
  nb: { root:'no/engelsk', html:'nb' },
  uk: { root:'uk/anhliiska', html:'uk' },
};
const titles = new Set(), descriptions = new Set();
for (const [lang,L] of Object.entries(langs)) {
  const hub=path.join(dist,...L.root.split('/'),'index.html');
  assert.ok(fs.existsSync(hub), `missing English hub ${L.root}`);
  for (const c of W.ENGLISH.comics) {
    const rel=`${L.root}/comics/${c.id}/index.html`, file=path.join(dist,...rel.split('/'));
    assert.ok(fs.existsSync(file), `missing ${rel}`);
    const html=fs.readFileSync(file,'utf8');
    assert.match(html,new RegExp(`<html lang="${L.html}"`),`${rel}: language`);
    assert.match(html,/<link rel="canonical" href="https:\/\/bilohash\.com\/comiks\//,`${rel}: canonical`);
    for (const code of ['en','nb','uk','x-default']) assert.ok(html.includes(`hreflang="${code}"`),`${rel}: hreflang ${code}`);
    assert.ok(html.includes('"@type":"LearningResource"'),`${rel}: LearningResource`);
    assert.ok(html.includes('"@type":"BreadcrumbList"'),`${rel}: breadcrumbs`);
    assert.ok(html.includes(`#/english/${c.id}/0`),`${rel}: interactive story link`);
    assert.ok(html.includes(`#/quiz/en/${c.id}`),`${rel}: quiz link`);
    assert.ok(html.includes(c.panels[0].lines[0].en),`${rel}: visible story dialogue`);
    const title=(html.match(/<title>([^<]+)<\/title>/)||[])[1], desc=(html.match(/<meta name="description" content="([^"]+)"/ )||[])[1];
    assert.ok(title && title.length>25 && title.length<140,`${rel}: useful title`);
    assert.ok(desc && desc.length>60 && desc.length<=160,`${rel}: useful description`);
    assert.ok(!titles.has(lang+'|'+title),`${rel}: unique title`);titles.add(lang+'|'+title);
    assert.ok(!descriptions.has(lang+'|'+desc),`${rel}: unique description`);descriptions.add(lang+'|'+desc);
  }
}
const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
for(const c of W.ENGLISH.comics) for(const L of Object.values(langs)) assert.ok(sitemap.includes(`<loc>${base}${L.root}/comics/${c.id}/</loc>`),`sitemap ${L.root}/${c.id}`);

for (const c of W.COMICS) {
  for (const rootDir of ['komiks','no/komiks','uk/komiks']) {
    const file=path.join(dist,...rootDir.split('/'),c.id,'index.html');
    assert.ok(fs.existsSync(file),`missing Norwegian comic SEO page ${rootDir}/${c.id}`);
    const html=fs.readFileSync(file,'utf8');
    assert.ok(html.includes(`#/quiz/${c.id}`),`${rootDir}/${c.id}: quiz CTA`);
    assert.ok(html.includes('"@type":"LearningResource"'),`${rootDir}/${c.id}: LearningResource`);
    assert.ok(html.includes('"@type":"Quiz"'),`${rootDir}/${c.id}: quiz schema`);
  }
}
console.log(`PASS comic SEO: ${W.ENGLISH.comics.length*3} English story pages and ${W.COMICS.length*3} Norwegian/localized story pages`);
