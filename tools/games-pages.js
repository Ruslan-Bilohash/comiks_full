/* Комікс·Lab — 🎮 статичні сторінки ігор: /games/, /uk/ihry/, /no/spill/ …
 *
 * Ігри зроблені в тій самій майстерні, що й комікси, але живуть окремими
 * адресами — і доти пошук не знав про них нічого: ні назви, ні знімка, ні
 * того, що грати можна без встановлення й без акаунта. Ця сторінка — єдине
 * місце, де все це сказано словами, які можна процитувати.
 *
 * Два джерела, жодного переказу:
 *   • паспорт гри — data/games.js (адреса, знімки, склад бійців, арени);
 *   • проза — assets/games.js через tools/games-text.js, тобто той самий
 *     текст, який бачить людина в застосунку, вісьмома мовами.
 * Переписати опис тут означало б дві правди: одну в застосунку, другу у
 * видачі, і розійшлися б вони з першою ж правкою.
 *
 * Окремим файлом, а не всередині build.js: build.js і без того на тисячу
 * рядків, а тут є власний шаблон сторінки, власна розмітка для Google і
 * власний перелік адрес.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

/* Адреса — не переклад, тож лежить у коді, а не в словнику. Арабська
   лишається латиницею з тієї самої причини, що й решта розділів: кирилиця й
   арабиця в шляху виглядають у видачі як набір відсотків. */
const SEG = { en: 'games', no: 'spill', uk: 'ihry', de: 'spiele', pl: 'gry', tr: 'oyunlar', lt: 'zaidimai', pt: 'jogos', ar: 'games' };
const LANG_NAME = { uk: 'Українська', en: 'English', no: 'Norsk' };

const catalogue = () => {
  const w = {};
  try { new Function('window', fs.readFileSync(path.join(ROOT, 'data', 'games.js'), 'utf8'))(w); } catch (e) { return []; }
  return w.KOMIKS_GAMES || [];
};

module.exports = function gamesPages({ DIST, base, esc, L10N, PAGE_CSS, pageUrl }) {
  const GAMES = catalogue();
  const T_ALL = require('./games-text.js')();
  const langs = GAMES.length ? Object.keys(L10N).filter(l => T_ALL[l] && SEG[l]) : [];

  const url = lang => `${base}${L10N[lang].dir}${SEG[lang]}/`;
  const shot = f => `${base}img/games/${f}.jpg`;
  /* Мова самої гри: своя, якщо гра її знає, інакше англійська. Обіцяти
     переклад, якого в грі немає, не можна — людина відкриє її й побачить
     чуже. */
  const gl = (g, lang) => ((g.langs || []).includes(lang) ? lang : 'en');
  const cover = g => shot((g.shots || [])[2] || (g.shots || [])[0]);

  const alt = () => langs.map(l => `    <xhtml:link rel="alternate" hreflang="${L10N[l].hl}" href="${url(l)}"/>`).join('\n')
    + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${url('en')}"/>`;
  /* Знімки гри в мапі сайту: єдиний спосіб потрапити в пошук зображень, бо
     самої гри як сторінки з картинками в індексі немає. */
  const img = lang => GAMES.flatMap(g => (g.shots || []).map((f, i) => {
    const caps = T_ALL[lang].caps || [];
    return `    <image:image><image:loc>${shot(f)}</image:loc><image:title>${esc((g.name[gl(g, lang)] || g.name.en) + ' — ' + (caps[i] || ''))}</image:title></image:image>`;
  })).join('\n');

  const CSS = `
.upd-list{display:grid;gap:12px;margin:14px 0;grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr))}
.upd-card{border:3px solid #141414;border-radius:14px;padding:12px 14px;background:#fff}
.upd-card h4{margin:0 0 4px;font-size:1.02rem}
.upd-lead{font-size:1.05rem}
article.gm{margin:0 0 26px;padding-top:8px}
article.gm h2{margin:12px 0 6px;font-size:clamp(1.3rem,4vw,1.8rem)}
.strip figure img{aspect-ratio:16/9;object-fit:cover;background:#000}
.pills{list-style:none;display:flex;flex-wrap:wrap;gap:8px;padding:0;margin:0}
.pills li{padding:5px 11px;border:2px solid #141414;border-radius:999px;background:#fff;font-weight:700;font-size:.9rem}
.gm-facts th{text-align:left;white-space:nowrap;color:#5d5346;padding-right:12px;vertical-align:top;font-weight:700}
.gm-note{font-size:.9rem;color:#5d5346}
.gm-camp li{margin:0 0 10px}`;

  function article(g, lang, T) {
    const l = gl(g, lang);
    const nm = g.name[l] || g.name.en, sub = g.sub[l] || g.sub.en;
    const caps = T.caps || [];
    const play = `<a class="cta" href="${g.url}?lang=${l}" target="_blank" rel="noopener">${esc(T.play)}</a>`;
    const facts = [
      [T.f_price, T.f_price_v],
      [T.f_players, T.f_players_v],
      [T.f_age, g.age + '+'],
      [T.f_langs, (g.langs || []).map(x => LANG_NAME[x] || x).join(' · ')],
      [T.f_tech, g.engine],
      [T.f_size, g.size + ' MB'],
      [T.f_save, T.f_save_v],
    ];
    const shots = (g.shots || []).map((f, i) =>
      `<figure><img src="${shot(f)}" width="1280" height="720" loading="lazy" alt="${esc(nm + ' — ' + (caps[i] || ''))}"><figcaption>${esc(caps[i] || '')}</figcaption></figure>`).join('');
    const fighters = (g.roster || []).map(f => {
      const r = f[l] || f.en;
      return `<div class="upd-card"><h4>${esc(r[0])}</h4><p><b>${esc(r[1])}</b><br>⚡ ${esc(r[2])} — ${esc(r[3])}<br>💥 ${esc(r[4])} — ${esc(r[5])}</p></div>`;
    }).join('');
    const camp = (((g.camp || {})[l]) || (g.camp || {}).en || [])
      .map(([t, d]) => `<li><b>${esc(t)}</b><br>${esc(d)}</li>`).join('');
    return `<article class="gm" id="${g.id}">
<h2>${esc(g.emoji + ' ' + nm)} — ${esc(sub)}</h2>
<p>${play}</p>
<p class="crumbs">${esc(T.newtab)}</p>
<h3>${esc(T.shots)}</h3>
<div class="strip">${shots}</div>
<h3>${esc(T.modes)}</h3>
<ul class="pills">${(g.modes || []).map(m => `<li>${esc(m.emoji + ' ' + (m[l] || m.en))}</li>`).join('')}</ul>
<h3>${esc(T.facts)}</h3>
<table class="gm-facts"><tbody>${facts.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
<p class="gm-note">${esc(T.note_lang)}</p>
<p class="gm-note">${esc(T.note_age)}</p>
<h3>${esc(T.keys)}</h3>
<p>${esc(g.keys[l] || g.keys.en)}</p>
<h3>${esc(T.roster)}</h3>
<div class="upd-list">${fighters}</div>
<h3>${esc(T.arenas)}</h3>
<ul class="pills">${(g.arenas || []).map(a => `<li>${esc(a[l] || a.en)}</li>`).join('')}</ul>
<h3>${esc(T.camp)}</h3>
<ol class="gm-camp">${camp}</ol>
<p>${play}</p>
</article>`;
  }

  function schema(g, lang, T) {
    const l = gl(g, lang);
    const nm = g.name[l] || g.name.en;
    const org = { '@type': 'Organization', name: 'Komiks·Lab', url: base, logo: { '@type': 'ImageObject', url: base + 'img/logo.svg' } };
    return {
      '@context': 'https://schema.org', '@type': 'VideoGame',
      name: nm,
      alternateName: Object.values(g.name).filter(x => x !== nm),
      url: g.url,
      mainEntityOfPage: url(lang) + '#' + g.id,
      /* Опис гри — той самий рядок, що йде в <meta description>: гра поки одна,
         і писати про неї двічі означало б розійтися в дрібницях. З другою грою
         опис переїде в паспорт гри. */
      description: T.meta_d,
      image: cover(g),
      screenshot: (g.shots || []).map(shot),
      genre: ['Fighting', 'Arcade'],
      applicationCategory: 'GameApplication',
      gamePlatform: 'Web browser',
      operatingSystem: 'Any device with a WebGL browser',
      playMode: ['SinglePlayer', 'MultiPlayer'],
      numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2 },
      /* Вікова позначка наша власна, а не PEGI чи ESRB: офіційної оцінки гра не
         проходила, і назвати чужу систему було б неправдою. */
      contentRating: g.age + '+',
      typicalAgeRange: g.age + '-',
      inLanguage: (g.langs || []).map(x => ({ uk: 'uk', en: 'en', no: 'nb' })[x] || x),
      datePublished: g.live,
      author: org, publisher: org,
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: g.url },
      character: (g.roster || []).map(f => { const r = f[l] || f.en; return { '@type': 'Person', name: r[0], description: r[1] }; }),
    };
  }

  for (const lang of langs) {
    const L = L10N[lang], T = T_ALL[lang];
    const dir = path.join(DIST, L.dir, SEG[lang]);
    fs.mkdirSync(dir, { recursive: true });
    const alts = langs.map(l => `<link rel="alternate" hreflang="${L10N[l].hl}" href="${url(l)}">`).join('\n')
      + `\n<link rel="alternate" hreflang="x-default" href="${url('en')}">`;
    const og = cover(GAMES[0]);
    const jsonld = [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: T.h1, url: url(lang),
        description: T.meta_d, inLanguage: L.hl, isPartOf: { '@type': 'WebSite', name: 'Komiks·Lab', url: base } },
      ...GAMES.map(g => schema(g, lang, T)),
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Komiks·Lab', item: base },
        { '@type': 'ListItem', position: 2, name: T.h1, item: url(lang) },
      ] },
    ];
    const body = `<p class="crumbs"><a href="${base}">Komiks·Lab</a> › ${esc(T.h1)}</p>
<h1>${esc(T.h1)}</h1>
<p class="upd-lead">${esc(T.lead)}</p>
${GAMES.map(g => article(g, lang, T)).join('\n')}
<p class="crumbs"><a href="${pageUrl(lang, '')}">${esc(L.all)}</a> · <a href="${base}">${esc(L.top)}</a></p>`;

    fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html>
<html lang="${L.html}"${L.rtl ? ' dir="rtl"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(T.meta_t)}</title>
<meta name="description" content="${esc(T.meta_d)}">
<link rel="canonical" href="${url(lang)}">
${alts}
<meta property="og:type" content="website"><meta property="og:site_name" content="Komiks·Lab"><meta property="og:title" content="${esc(T.meta_t)}"><meta property="og:description" content="${esc(T.meta_d)}"><meta property="og:url" content="${url(lang)}"><meta property="og:image" content="${og}"><meta property="og:locale" content="${L.locale}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(T.meta_t)}"><meta name="twitter:description" content="${esc(T.meta_d)}"><meta name="twitter:image" content="${og}">
<link rel="icon" href="${base}icons/favicon.ico" sizes="16x16 32x32 48x48 256x256">
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
<style>${PAGE_CSS}${CSS}</style>
</head>
<body>
<header class="top"><b><img class="top-logo" src="${base}img/logo.svg" alt="" width="30" height="30"> Komiks·Lab</b><nav>${langs.filter(l => l !== lang).map(l => `<a href="${url(l)}" hreflang="${L10N[l].hl}">${L10N[l].flag}</a>`).join('')}<a href="${base}">${L.top}</a></nav></header>
<main>
${body}
<p class="crumbs">${L.ai}</p>
</main>
</body>
</html>
`, 'utf8');
  }

  const newest = GAMES.reduce((d, g) => (g.live && g.live > d ? g.live : d), '2000-01-01');
  return { games: GAMES, langs, seg: SEG, url, alt, img, newest, text: T_ALL };
};
module.exports.SEG = SEG;
