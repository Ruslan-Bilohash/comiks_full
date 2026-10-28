/* Комікс·Lab — 🌍 мови, що з'являються словником, а не кодом збірки.
 *
 * Для англійської, норвезької та української текст сторінок написаний руками
 * просто у build.js: їх троє, вони найважливіші, і там видно кожну дрібницю.
 * Решта мов складається звідси: зміст коміксу бере словник перекладу
 * (data/lang-*.js, ключ — англійський рядок), а власний текст сторінки —
 * tools/lang/pages/<код>.json.
 *
 * Мова з'являється лише тоді, коли словник справді заповнений. Напівпорожня
 * сторінка — заголовок однією мовою, тіло іншою — для пошуку гірша за
 * відсутню: це неповна копія вже наявної, і карають за неї обидві.
 */
const fs = require('fs'), path = require('path');

/* Прапорець у шапці — не про країну, а про мову, тож для арабської його немає:
   нею говорять у двох десятках країн, і будь-який прапор був би неправдою. */
const META = {
  de: { dir: 'de/', html: 'de', hl: 'de', locale: 'de_DE', flag: '🇩🇪 Deutsch', seg: 'norwegisch-tests', useg: 'neuigkeiten' },
  pl: { dir: 'pl/', html: 'pl', hl: 'pl', locale: 'pl_PL', flag: '🇵🇱 Polski', seg: 'testy-norweskiego', useg: 'aktualnosci' },
  tr: { dir: 'tr/', html: 'tr', hl: 'tr', locale: 'tr_TR', flag: '🇹🇷 Türkçe', seg: 'norvecce-testler', useg: 'guncellemeler' },
  lt: { dir: 'lt/', html: 'lt', hl: 'lt', locale: 'lt_LT', flag: '🇱🇹 Lietuvių', seg: 'norvegu-testai', useg: 'naujienos' },
  /* Арабська адреса лишається латиницею: кирилиця й арабиця в шляху виглядають
     у пошуковій видачі як набір відсотків, а сам шлях ніхто не читає. */
  ar: { dir: 'ar/', html: 'ar', hl: 'ar', locale: 'ar_AR', flag: '🌐 العربية', seg: 'norwegian-tests', useg: 'updates', rtl: true },
};

/* Посилання всередину застосунку. Лежать тут, а не в перекладі: адреса — не
   текст, і перекладати її нема чого. Порядок мусить збігатися з англійським
   набором у build.js, звідки взято самі підписи. */
const ITEM_HREFS = ['#/quiz/order/all', '#/tests', '#/quiz/words', '#/cross', '#/pairs', '#/write'];
const BASIC_HREFS = ['#/quiz/alphabet', '#/quiz/numbers'];

const NEED_C = ['top', 'all', 'ai', 'lvlTpl', 'cta', 'dlg', 'words', 'moreTpl', 'titleMid', 'descPre', 'descPost', 'hubT', 'hubDTpl', 'hubHTpl', 'hubP', 'levelTpl'];
const NEED_T = ['title', 'desc', 'h1', 'lead', 'secLevel', 'secSkill', 'secBasic', 'lvlDTpl', 'examT', 'examD', 'examB', 'placeB', 'cta', 'free']
  .concat([1, 2, 3, 4, 5, 6].flatMap(i => [`item${i}t`, `item${i}d`]))
  .concat([1, 2].flatMap(i => [`basic${i}t`, `basic${i}d`]));

const NEED_U = ['hub', 'hubDTpl', 'oneTpl', 'oneDTpl', 'back', 'date', 'shots', 'site', 'intro'];

const SEO = require('../data/seo.js');
const cap = s => (s ? s[0].toUpperCase() + s.slice(1) : '');
const fitDesc = (...parts) => parts.filter(Boolean).reduce((acc, p) => { const next = (acc + ' ' + p).trim(); return !acc ? (p.length > 160 ? p.slice(0, 157) + '…' : p) : next.length <= 160 ? next : acc; }, '');
module.exports = function extraLangs({ packs = {}, stat = null, threshold = 80, quiet = false } = {}) {
  const comics = {}, tests = {}, updates = {};
  const skipped = [];
  for (const [code, M] of Object.entries(META)) {
    const f = path.join(__dirname, 'lang', 'pages', `${code}.json`);
    if (!fs.existsSync(f)) { skipped.push(`${code}: немає tools/lang/pages/${code}.json`); continue; }

    const cover = stat && stat.langs && stat.langs[code];
    const pct = cover && cover.total ? Math.round(cover.has / cover.total * 100) : 0;
    if (cover && pct < threshold) { skipped.push(`${code}: словник заповнений на ${pct}% (поріг ${threshold}%)`); continue; }

    let P;
    try { P = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { skipped.push(`${code}: ${f} не читається`); continue; }
    const C = P.comics || {}, T = P.tests || {};
    const holesC = NEED_C.filter(k => !String(C[k] || '').trim());
    const holesT = NEED_T.filter(k => !String(T[k] || '').trim());
    if (holesC.length) { skipped.push(`${code}: у pages/${code}.json бракує ${holesC.slice(0, 4).join(', ')}`); continue; }

    const pack = packs[code] || {};
    /* Якщо рядка в словнику немає — лишаємо англійський. Так сторінка виходить
       із дірками в тексті, а не з порожніми місцями, і це видно одразу. */
    const tr = en => { const v = pack[String(en)]; return (typeof v === 'string' && v.trim()) ? v : String(en || ''); };
    const name = c => tr(c.titleEn || c.title);
    const sum = c => (c.summaryEn ? tr(c.summaryEn) : '');
    const fill = (s, vals) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vals ? String(vals[k]) : m));

    comics[code] = {
      dir: M.dir, html: M.html, hl: M.hl, locale: M.locale, flag: M.flag, rtl: !!M.rtl,
      top: C.top, all: C.all, ai: C.ai,
      lvl: l => fill(C.lvlTpl, { l }),
      cta: C.cta, dlg: C.dlg, words: C.words,
      more: l => fill(C.moreTpl, { l }),
      name, sum,
      tr: l => tr(l.en || ''),
      voc: v => tr(v[2] || ''),
      /* Імена персонажів не перекладаємо: Mia лишається Mia всіма мовами. */
      who: ch => ch.en || ch.no,
      // тема пошуку коміксу цією мовою (data/seo.js): власна в коміксів про програмування, інакше — категорії
      title: c => SEO.own(c) ? `${SEO.topic(c, code)} — ${name(c)} | Komiks·Lab` : `${name(c)} — ${SEO.topic(c, code) || C.titleMid}, ${c.level} | Komiks·Lab`,
      desc: c => fitDesc(`${cap(SEO.topic(c, code))}: ${sum(c)}`, `${SEO.WORDS[code] || 'Words'}: ${SEO.words(c, code, v => tr(v[2] || ''))}.`, C.descPost),
      hubT: C.hubT,
      hubD: n => fill(C.hubDTpl, { n }),
      hubH: n => fill(C.hubHTpl, { n }),
      hubP: C.hubP,
      level: l => fill(C.levelTpl, { l }),
    };

    if (holesT.length) { skipped.push(`${code}: сторінка тестів без ${holesT.slice(0, 3).join(', ')} — не роблю`); continue; }
    tests[code] = {
      dir: M.dir, seg: M.seg, rtl: !!M.rtl,
      title: T.title, desc: T.desc, h1: T.h1, lead: T.lead,
      secLevel: T.secLevel, secSkill: T.secSkill, secBasic: T.secBasic,
      lvlD: l => fill(T.lvlDTpl, { l }),
      items: ITEM_HREFS.map((href, i) => [T[`item${i + 1}t`], T[`item${i + 1}d`], href]),
      basics: BASIC_HREFS.map((href, i) => [T[`basic${i + 1}t`], T[`basic${i + 1}d`], href]),
      examT: T.examT, examD: T.examD, examB: T.examB, placeB: T.placeB, cta: T.cta, free: T.free,
    };

    const U = P.updates || {};
    const holesU = NEED_U.filter(k => !String(U[k] || '').trim());
    if (holesU.length) { skipped.push(`${code}: журнал без ${holesU.slice(0, 3).join(', ')} — сторінок оновлень не роблю`); continue; }
    updates[code] = {
      dir: M.dir, seg: M.useg, rtl: !!M.rtl,
      hub: U.hub,
      hubD: n => fill(U.hubDTpl, { n }),
      one: d => fill(U.oneTpl, { d }),
      oneD: (d, first) => fill(U.oneDTpl, { d, first }),
      back: U.back, date: U.date, shots: U.shots, site: U.site, intro: U.intro,
    };
  }
  if (!quiet && skipped.length) for (const s of skipped) console.log(`   ⏭ ${s}`);
  return { comics, tests, updates, skipped };
};
module.exports.META = META;
