'use strict';
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');
const work = path.join(root, 'tools', '.i18n-identical');
const overrides = {
  de: {
    'En sekk matches din.': '„En sekk“ passt zu „din“.',
    'Et håndkle matches ditt.': '„Et håndkle“ passt zu „ditt“.',
    'Plural matches dine.': 'Der Plural passt zu „dine“.',
    'En vei takes vår.': '„En vei“ verwendet „vår“.',
    horizontal: 'waagerecht',
    Transform: 'Transformation',
    HTTPS: 'HTTPS-Protokoll',
    'a CAPTCHA': 'ein CAPTCHA-Test',
    TLS: 'TLS-Protokoll',
    neutral: 'Neutrum',
    JSON: 'JSON-Format',
    CPR: 'Herz-Lungen-Wiederbelebung (CPR)',
    illegal: 'rechtswidrig',
    modern: 'zeitgemäß',
  },
  pl: {
    'En vei takes vår.': '„En vei” łączy się z „vår”.',
    'Et hus takes vårt.': '„Et hus” łączy się z „vårt”.',
    'a GameObject': 'obiekt GameObject',
    SELECT: 'polecenie SELECT',
    HTTPS: 'protokół HTTPS',
    'a CAPTCHA': 'test CAPTCHA',
    TLS: 'protokół TLS',
    Start: 'początek',
    JOIN: 'polecenie JOIN',
    'a Canvas': 'element Canvas',
    CRUD: 'CRUD — tworzenie, odczyt, aktualizacja i usuwanie',
    JSON: 'format JSON',
    CPR: 'resuscytacja krążeniowo-oddechowa (CPR)',
  },
  tr: {
    'SIS, expulsion and what to do next': 'SIS, sınır dışı edilme ve sonrasında yapılacaklar',
    tidy: 'düzenli',
    WHERE: 'WHERE koşulu',
    'ORDER BY': 'ORDER BY sıralaması',
    bait: 'yem',
    TLS: 'TLS protokolü',
    'Play Mode': 'Oyun Modu',
    JOIN: 'JOIN işlemi',
    CRUD: 'CRUD işlemleri',
    JSON: 'JSON biçimi',
    CPR: 'kalp masajı ve suni solunum (CPR)',
  },
  lt: {
    'Inside Blender': 'Blender viduje',
    SELECT: 'SQL komanda SELECT',
    TLS: 'TLS protokolas',
    CPR: 'širdies ir plaučių gaivinimas (CPR)',
    neuter: 'niekatroji giminė',
  },
};

for (const lang of ['de', 'pl', 'tr', 'lt']) {
  const file = path.join(work, `out-mymemory-${lang}.jsonl`);
  const rows = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).map(JSON.parse);
  const entries = [];
  for (const row of rows) {
    if (!row.ok) throw new Error(`${lang}: failed batch ${row.id}`);
    for (const [english, translated] of Object.entries(row.map || {})) {
      const value = overrides[lang]?.[english] || String(translated).trim();
      if (value === english && english !== 'BEEEP! BEEEP!') {
        throw new Error(`${lang}: still identical: ${english}`);
      }
      entries.push([english, value]);
    }
  }
  const body = entries.map(([english, translated]) => `${english}\t${translated}`).join('\n') + '\n';
  fs.writeFileSync(path.join(root, 'tools', 'lang', lang, '99-quality.tsv'), body, 'utf8');
  console.log(`${lang}: wrote ${entries.length} reviewed overrides`);
}
