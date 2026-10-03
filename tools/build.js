// Збірка: node tools/build.js
//  1) нова версія файлів (?v=…) — браузер завжди отримує свіжий застосунок, а не старий з кешу
//  2) SEO: статичний текст сторінки, canonical, Open Graph
//  3) og-image.png та іконки через Microsoft Edge (headless), якщо їх немає або --images
//  4) публічна версія в dist/ (без private-коміксів, лише потрібне аудіо) + sitemap.xml, robots.txt
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const load = require('./load.js');
const ROOT = load.ROOT;
const site = JSON.parse(fs.readFileSync(path.join(__dirname, 'site.json'), 'utf8'));
const base = site.siteUrl.replace(/\/?$/, '/');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const wr = (f, s) => fs.writeFileSync(path.join(ROOT, f), s, 'utf8');

// 1) версія
const version = Date.now().toString(36);
/* Дати. Потрібні і сторінкам оновлень, і мапі сайту, тож оголошені тут, до
   першого використання.
   notFuture: дата з майбутнього — те саме, що брехня, пошукові системи такий
   lastmod і datePublished просто відкидають. Записи журналу часом готують
   наперед, тому стелею ставимо сьогоднішнє число. */
const iso = t => new Date(t).toISOString().slice(0, 10);
const today = iso(Date.now());
const notFuture = d => (d > today ? today : d);
/* Ідентифікатор запису — це адреса, і за день їх може бути кілька: 2026-10-02-2.
   Дата для показу й для пошукових систем — це перші десять символів, та й то
   не пізніше за сьогодні. */
const updDay = id => (/^\d{4}-\d{2}-\d{2}/.test(String(id)) ? notFuture(String(id).slice(0, 10)) : today);
// лапки навколо ключа й значення можуть бути будь-які — інакше версія тихо не оновиться
const VER_RE = /(["']?version["']?\s*:\s*)["'][^"']*["']/;
const idxSrc = rd('data/index.js');
if (!VER_RE.test(idxSrc)) { console.error('✖ У data/index.js не знайдено поля version — збірка зупинена.'); process.exit(1); }
wr('data/index.js', idxSrc.replace(VER_RE, `$1'${version}'`));
const W = load();
// скільки тематичних слів у наборі — цифру в SEO-тексті рахуємо, а не пишемо руками
const WORDS_N = ((W.WORDS || {}).themes || []).reduce((n, t) => n + t.words.length, 0);
const THEMES_N = ((W.WORDS || {}).themes || []).length;

function prerender(comics) {
  const items = comics.map(c => `  <article>
    <h3>${esc(c.titleEn || c.title)} <small lang="nb">(${esc(c.title)}, ${esc(c.level || '')})</small></h3>
    <p>${esc(c.summaryEn || '')}</p>
    <p lang="nb">${esc(c.summaryNo || '')}</p>
    <p>Words: ${c.vocab.map(([no, , en]) => `<span lang="nb">${esc(no)}</span> — ${esc(en || '')}`).join(' · ')}</p>
    <p><a href="${base}komiks/${c.id}/">Read “${esc(c.titleEn || c.title)}” — Norwegian comic with English translation</a></p>
  </article>`).join('\n');
  return `<!-- prerender:start -->
<section class="seo-static">
  <h1>Learn Norwegian with Comics — a free Norwegian course with real voices</h1>
  <p>Komiks·Lab helps you learn Norwegian (Bokmål) through short, funny comics about real life in Norway. Every line is read aloud by a natural Norwegian voice, and every word has an English translation when you hover or tap it. Levels A1, A2, B1 and B2 — from your first “Hei!” to talking with colleagues, landlords and doctors.</p>
  <p>Made for expats, international workers and families moving to Norway, and for anyone preparing for a Norwegian course or the Norskprøven exam.</p>
  <p>🤖 All stories, characters, drawings and voices are fictional and created with artificial intelligence.</p>
  <h2>What you get</h2>
  <ul>
    <li>Voiced Norwegian comics: listen to every line, slow it down, repeat.</li>
    <li>English translation of every word and sentence on hover, with grammar hints.</li>
    <li>Norwegian grammar with tables: pronouns, present and past tense, en/ei/et nouns, adjectives, prepositions and word order.</li>
    <li>${WORDS_N} words in ${THEMES_N} topics: work, housing, food, health, family, traffic, winter, public services and free time — each with a picture and audio.</li>
    <li>Tests in Norwegian, flashcards with spaced repetition, the Logic Race and Math Rocket games, and a personal study plan.</li>
    <li>Play together: a teacher or a friend opens a room with a QR code and everyone answers on their phones.</li>
  </ul>
  <h2>Norwegian comics for everyday life in Norway (A1–B2)</h2>
${items}
  <h2>FAQ</h2>
  <h3>Can I learn Norwegian from zero here?</h3>
  <p>Yes. Start with the A1 comics — simple phrases like “Hvor kommer du fra?” — and every word is translated into English.</p>
  <h3>Is it free?</h3>
  <p>You can start for free in your browser on a phone, tablet or computer — no installation needed.</p>
  <h3>Is it Bokmål or Nynorsk?</h3>
  <p>All lessons use Bokmål, the written standard most people in Norway use.</p>
  <h2 lang="nb">Lær norsk med tegneserier</h2>
  <p lang="nb">Komiks·Lab er en nettside for å lære norsk (bokmål) for voksne og barn: tegneserier på nivå A1, A2, B1 og B2 med ekte stemmer, ordforklaringer på engelsk, grammatikk, ordforråd, tester og spill. For deg som flytter til Norge, jobber i Norge eller går på norskkurs.</p>
</section>
<noscript><p>Please enable JavaScript to use Komiks·Lab.</p></noscript>
<!-- prerender:end -->`;
}
function applyHtml(html, comics) {
  return html
    .replace(/<!-- prerender:start -->[\s\S]*?<!-- prerender:end -->/, prerender(comics))
    .replace(/<!-- seo:canonical -->[\s\S]*?<!-- \/seo:canonical -->/, `<!-- seo:canonical --><link rel="canonical" href="${base}"><!-- /seo:canonical -->`)
    .replace(/<!-- seo:og -->[\s\S]*?<!-- \/seo:og -->/, `<!-- seo:og --><meta property="og:url" content="${base}">
<meta property="og:image" content="${base}og-image.png">
<meta property="og:locale" content="en_GB">
<meta property="og:locale:alternate" content="nb_NO">
<meta property="og:locale:alternate" content="uk_UA">
<!-- Корінь обслуговує всі мови інтерфейсу одразу, тож він не «англійська
     версія», а мовно-нейтральний вхід: лише x-default. Заявляти тут hreflang="en"
     означало б сперечатися з /komiks/, який справді англійський. Решта мов
     ведуть на свої каталоги. -->
<link rel="alternate" hreflang="x-default" href="${base}">
<link rel="alternate" hreflang="en" href="${base}komiks/">
<link rel="alternate" hreflang="nb" href="${base}no/komiks/">
<link rel="alternate" hreflang="uk" href="${base}uk/komiks/">
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Course', name: 'Learn Norwegian with Comics — Komiks·Lab',
  description: 'Online Norwegian course with voiced comics A1–B2, English translation of every word, grammar, vocabulary and tests. Made for expats moving to Norway.',
  /* Сторінок у нас три мови, але сам застосунок говорить вісьмома — це різні
     речі, і друге чесно називається тут. */
  inLanguage: ['en', 'nb', 'uk', 'ar', 'de', 'pl', 'tr', 'lt'], isAccessibleForFree: true, url: base, image: base + 'og-image.png',
  teaches: 'Norwegian (Bokmål), A1–B2', educationalLevel: 'A1, A2, B1, B2',
  provider: { '@type': 'Organization', name: 'Komiks·Lab', url: base },
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT20M' }
})}</script>
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'WebSite', name: 'Komiks·Lab', alternateName: 'Комікс·Lab',
  url: base, inLanguage: ['en', 'nb', 'uk', 'ar', 'de', 'pl', 'tr', 'lt'],
  description: 'Learn Norwegian with voiced comics: A1–B2 stories, tests, games and grammar.',
  publisher: { '@type': 'Organization', name: 'Komiks·Lab', url: base },
})}</script>
<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Organization', name: 'Komiks·Lab', url: base,
  logo: { '@type': 'ImageObject', url: base + 'img/logo.svg' },
  image: base + 'og-image.png',
  description: 'A free project for learning Norwegian through comics with audio.',
})}</script><!-- /seo:og -->`)
    .replace(/<!-- ver:css -->[\s\S]*?<!-- \/ver:css -->/, `<!-- ver:css --><link rel="stylesheet" href="assets/style.css?v=${version}"><!-- /ver:css -->`)
    .replace(/<!-- ver:js -->[\s\S]*?<!-- \/ver:js -->/, `<!-- ver:js --><script src="data/index.js?v=${version}"></script>\n<script src="assets/boot.js?v=${version}"></script><!-- /ver:js -->`);
}
wr('index.html', applyHtml(rd('index.html'), W.COMICS));

// 3) картинки
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(p => fs.existsSync(p));
function shot(html, out, w, hgt, query = '', quiet = false) {
  if (!EDGE) return console.log('⚠ Edge не знайдено — пропускаю ' + out);
  const src = 'file:///' + path.join(__dirname, html).replace(/\\/g, '/') + (query ? '?' + query : '');
  const dst = path.isAbsolute(out) ? out : path.join(ROOT, out);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--window-size=${w},${hgt}`, '--virtual-time-budget=6000', `--screenshot=${dst}`, src], { stdio: 'ignore' });
  if (!quiet) console.log('🖼  ' + out);
}
const force = process.argv.includes('--images');
fs.mkdirSync(path.join(ROOT, 'icons'), { recursive: true });
if (force || !fs.existsSync(path.join(ROOT, 'og-image.png'))) shot('og.html', 'og-image.png', 1200, 630);
// набір іконок для ярликів (Windows, Android, iPhone) малює tools/gen-icons.py
if (force || !fs.existsSync(path.join(ROOT, 'icons/favicon.ico'))) {
  try {
    execFileSync('python', [path.join(__dirname, 'gen-icons.py')], { cwd: ROOT, stdio: 'ignore' });
    console.log('🖼  icons/ — іконки й екрани запуску перемальовано');
  } catch { console.log('⚠ іконки не перемальовано (потрібен python + Pillow): tools/gen-icons.py'); }
}

// 4) dist/
const DIST = path.join(ROOT, 'dist');
// очищаємо вміст, а не саму папку — так збірка працює, навіть якщо dist відкрита в Провіднику
fs.mkdirSync(DIST, { recursive: true });
for (const e of fs.readdirSync(DIST)) {
  try { fs.rmSync(path.join(DIST, e), { recursive: true, force: true, maxRetries: 3 }); } catch (err) { console.log(`⚠ Не вдалося видалити dist/${e}: ${err.code}`); }
}
const copyDir = d => {                                   // тека цілком (icons/ з усіма розмірами)
  const src = path.join(ROOT, d); if (!fs.existsSync(src)) return;
  fs.mkdirSync(path.join(DIST, d), { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (e.isDirectory()) copyDir(path.join(d, e.name));
    else fs.copyFileSync(path.join(src, e.name), path.join(DIST, d, e.name));
  }
};
const copy = f => { const src = path.join(ROOT, f); if (!fs.existsSync(src)) return; const dst = path.join(DIST, f); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); };
// install.php у збірку не кладемо: це аварійний інструмент, на робочому сервері його бути не повинно
const pub = W.COMICS.filter(c => !c._private);
const reg = W.KOMIKS_DATA;
['assets/app.js', 'assets/art.js', 'assets/i18n.js', 'assets/i18n-eu.js', 'assets/a11y.js', 'assets/logo.js', 'assets/icons.js', 'assets/avatars.js', 'assets/profile.js', 'assets/game.js', 'game/index.html', 'assets/grammar.js', 'assets/words.js', 'assets/english.js', 'assets/math.js', 'assets/music.js', 'assets/rocket.js', 'assets/race.js', 'assets/chess.js', 'assets/messages.js', 'assets/pics.js', 'assets/pics2.js', 'assets/pics3.js', 'assets/pics4.js', 'assets/pics5.js', 'assets/pics6.js', 'assets/pics7.js', 'assets/news.js', 'assets/feedback.js', 'assets/premium.js', 'assets/teacher.js', 'assets/call.js', 'assets/write.js', 'assets/exam.js', 'assets/placement.js', 'assets/alerts.js', 'assets/pairs.js', 'assets/cross.js', 'assets/install.js', 'assets/bots.js', 'assets/players.js', 'assets/friends.js', 'assets/auth.js', 'api/wall.php', 'api/players.php', 'api/lib.php', 'api/auth.php', 'api/feedback.php', 'api/billing.php', 'api/teacher.php', 'api/call.php', 'api/write.php', 'api/notify.php', 'api/tts.php', 'api/realtime.php', 'api/health.php', 'api/diag.php', 'api/edge_tts.php', 'api/stripe-webhook.php', 'api/messages.php', 'api/config.sample.php', 'api/.htaccess', 'api/admin_ui.php', 'admin.php', 'assets/extras.js', 'assets/vendor/peerjs.min.js', 'assets/vendor/qrcode.js', 'assets/vendor/bootstrap.min.css', 'assets/vendor/bootstrap.bundle.min.js', 'assets/boot.js', 'assets/style.css', 'data/characters.js', 'data/dictionary.js', 'data/basics.js', 'data/phonetics.js', 'data/grammar.js', 'data/words.js', 'data/words2.js', 'data/words3.js', 'data/words4.js', 'data/english.js', 'data/dictionary-en.js', 'data/arabic.js', 'data/lang-de.js', 'data/lang-pl.js', 'data/lang-tr.js', 'data/lang-lt.js', 'data/updates.js', 'manifest.webmanifest', '.htaccess', 'privacy.html', 'sw.js', 'og-image.png', 'browserconfig.xml'].forEach(copy);
copyDir('icons');
copyDir('photo');                                        // 📷 кадри фото-коміксів
if (fs.existsSync(path.join(DIST, 'photo/README.md'))) fs.unlinkSync(path.join(DIST, 'photo/README.md')); // пояснення для нас, не для сайту
pub.forEach(c => copy(c._file));
fs.writeFileSync(path.join(DIST, 'data/index.js'), `window.KOMIKS_DATA = ${JSON.stringify({ version, shared: reg.shared, comics: reg.comics.filter(e => !e.private) }, null, 2)};\n`, 'utf8');

const pubTexts = new Set(['Hei hei! Nå leser jeg med glad stemme!', 'Nå har alle figurene sin egen stemme.', 'Nå snakker alle med forskjellige stemmer!']);
pub.forEach(c => c.panels.forEach(p => p.lines.forEach(l => pubTexts.add(l.no))));
// англійський курс: репліки теж мають озвучення
for (const c of ((W.ENGLISH || {}).comics || [])) c.panels.forEach(p => p.lines.forEach(l => pubTexts.add(l.en)));
const audio = {};
for (const [key, file] of Object.entries(W.AUDIO || {})) {
  const [kind, , , ...rest] = key.split('|');
  if (kind === 'word' || pubTexts.has(rest.join('|'))) { audio[key] = file; copy(`audio/${file}.mp3`); }
}
fs.writeFileSync(path.join(DIST, 'data/audio.js'), `window.AUDIO = ${JSON.stringify(audio)};\n`, 'utf8');
fs.writeFileSync(path.join(DIST, 'index.html'), applyHtml(rd('index.html'), pub), 'utf8');
const SW_RE = /komiks-[\w-]+/;
const swSrc = rd('sw.js');
if (!SW_RE.test(swSrc)) { console.error("✖ У sw.js не знайдено імені кешу komiks-… — збірка зупинена."); process.exit(1); }
fs.writeFileSync(path.join(DIST, 'sw.js'), swSrc.replace(SW_RE, 'komiks-' + version), 'utf8');


// 5) статичні сторінки коміксів трьома мовами (окремі адреси + hreflang) і карта сайту
//    /komiks/<id>/ — англійська (x-default), /no/komiks/<id>/ — норвезька, /uk/komiks/<id>/ — українська
const CHS = (W.CHARACTERS || {});
const PAGE_CSS = `
.top-logo{width:30px;height:30px;vertical-align:-7px;margin-right:4px}body{margin:0;font:17px/1.55 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#fff8ea;color:#141414}
main{max-width:860px;margin:0 auto;padding:20px 16px 60px}a{color:#1565c0}header.top{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:12px 16px;background:#ffd23f;border-bottom:4px solid #141414}
header.top b{font:900 1.3rem system-ui}header.top nav{display:flex;gap:10px;flex-wrap:wrap}h1{font-size:clamp(1.7rem,5vw,2.4rem);line-height:1.15;margin:.4em 0}h1 small{font-size:.55em;color:#555}.lvl{display:inline-block;padding:2px 10px;border-radius:999px;background:#141414;color:#ffd23f;font-weight:800;font-size:.85rem}
.cta{display:inline-block;margin:10px 0;padding:14px 22px;border-radius:999px;background:#ee4035;color:#fff;font-weight:900;text-decoration:none;border:3px solid #141414;box-shadow:4px 4px 0 #141414}
.card{background:#fff;border:3px solid #141414;border-radius:16px;padding:14px 16px;margin:14px 0}.line{margin:6px 0}.line small{color:#666;display:block}
table{border-collapse:collapse;width:100%}td{border-bottom:1px solid #eee;padding:6px 4px}ul.list{columns:2 260px;padding-left:18px}footer{margin-top:30px;color:#666;font-size:.9rem}
figure{margin:0 0 14px}figure img{width:100%;height:auto;display:block;border:3px solid #141414;border-radius:16px;background:#fff}figcaption{color:#666;font-size:.9rem;margin-top:6px}
.strip{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin:14px 0}
.crumbs{font-size:.9rem;color:#555;margin:10px 0 0}.crumbs a{color:#1565c0}`;
const L10N = {
  en: { dir: '', html: 'en', hl: 'en', locale: 'en_GB', flag: '🇬🇧 English', top: 'Learn Norwegian with comics →', all: 'All Norwegian comics', ai: '🤖 All stories, characters, drawings and voices are fictional and created with AI.',
    lvl: l => `Norwegian ${l}`, cta: '📖 Read the comic with Norwegian audio', dlg: 'Dialogue in Norwegian with English translation', words: 'Norwegian words from this comic', more: l => `More Norwegian comics, level ${l}`,
    name: c => c.titleEn || c.title, sum: c => c.summaryEn || '', tr: l => l.en || '', voc: v => v[2] || '', who: ch => ch.en || ch.no,
    title: c => `${c.titleEn || c.title} (${c.title}) — Learn Norwegian with a comic, ${c.level} | Komiks·Lab`, desc: c => `Learn Norwegian with “${c.titleEn || c.title}”: ${c.summaryEn || ''} Norwegian audio and English translation.`,
    hubT: 'Norwegian Comics for Learners (A1–B2) — Learn Norwegian | Komiks·Lab', hubD: n => `${n} Norwegian comics with audio and English translation for beginners and expats moving to Norway.`, hubH: n => `Norwegian comics for learners (${n})`, hubP: 'Short stories about everyday life in Norway, with Norwegian audio and English translation.', level: l => `Level ${l}` },
  no: { dir: 'no/', html: 'nb', hl: 'nb', locale: 'nb_NO', flag: '🇳🇴 Norsk', top: 'Lær norsk med tegneserier →', all: 'Alle tegneserier på norsk', ai: '🤖 Alle historier, figurer, tegninger og stemmer er oppdiktet og laget med kunstig intelligens.',
    lvl: l => `Norsk ${l}`, cta: '📖 Les tegneserien med lyd', dlg: 'Replikker på norsk med engelsk oversettelse', words: 'Ord fra tegneserien', more: l => `Flere tegneserier på nivå ${l}`,
    name: c => c.title, sum: c => c.summaryNo || '', tr: l => l.en || '', voc: v => v[2] || '', who: ch => ch.no,
    title: c => `${c.title} – norsk tegneserie med lyd, nivå ${c.level} | Komiks·Lab`, desc: c => `${c.summaryNo || ''} Lær norsk med lyd og oversettelse – for voksne, barn og deg som er ny i Norge.`,
    hubT: 'Tegneserier for å lære norsk (A1–B2) | Komiks·Lab', hubD: n => `${n} tegneserier med lyd for å lære norsk – for voksne, barn og innvandrere. Gratis på nett.`, hubH: n => `Tegneserier for å lære norsk (${n})`, hubP: 'Korte historier om hverdagen i Norge, med norsk lyd og oversettelse.', level: l => `Nivå ${l}` },
  uk: { dir: 'uk/', html: 'uk', hl: 'uk', locale: 'uk_UA', flag: '🇺🇦 Українська', top: 'Вчити норвезьку через комікси →', all: 'Усі комікси норвезькою', ai: '🤖 Усі історії, персонажі, малюнки й озвучення вигадані та створені за допомогою ШІ.',
    lvl: l => `Норвезька ${l}`, cta: '📖 Читати комікс з озвученням', dlg: 'Діалог норвезькою з перекладом українською', words: 'Норвезькі слова з коміксу', more: l => `Ще комікси рівня ${l}`,
    name: c => c.titleUk || c.title, sum: c => c.summaryUk || '', tr: l => l.uk || '', voc: v => v[1] || '', who: ch => ch.uk || ch.no,
    title: c => `${c.titleUk || c.title} (${c.title}) — норвезька через комікси, рівень ${c.level} | Komiks·Lab`, desc: c => `Вчіть норвезьку з коміксом «${c.titleUk || c.title}»: ${c.summaryUk || ''} Озвучення норвезькою й переклад українською.`,
    hubT: 'Комікси для вивчення норвезької (A1–B2) | Komiks·Lab', hubD: n => `${n} коміксів норвезькою з озвученням і перекладом українською — для дорослих і дітей.`, hubH: n => `Комікси для вивчення норвезької (${n})`, hubP: 'Короткі історії про життя в Норвегії з норвезьким озвученням і перекладом українською.', level: l => `Рівень ${l}` }
};
const LANGS3 = Object.keys(L10N);
const pageUrl = (lang, id) => `${base}${L10N[lang].dir}komiks/${id ? id + '/' : ''}`;
const alternates = id => LANGS3.map(l => `<link rel="alternate" hreflang="${L10N[l].hl}" href="${pageUrl(l, id)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${pageUrl('en', id)}">`;
const pageShell = ({ L, title, desc, url, id, body, jsonld, image = '' }) => `<!doctype html>
<html lang="${L.html}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
${alternates(id)}
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${image || base + 'og-image.png'}"><meta property="og:locale" content="${L.locale}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${image || base + 'og-image.png'}">
<link rel="icon" href="${base}icons/favicon.ico" sizes="16x16 32x32 48x48 256x256">
<link rel="apple-touch-icon" sizes="180x180" href="${base}icons/apple-touch-icon.png">
${jsonld ? (Array.isArray(jsonld) ? jsonld : [jsonld]).map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n') : ''}
<style>${PAGE_CSS}</style>
</head>
<body>
<header class="top"><b><img class="top-logo" src="${base}img/logo.svg" alt="" width="30" height="30"> Komiks·Lab</b><nav>${LANGS3.filter(l => L10N[l] !== L).map(l => `<a href="${pageUrl(l, id)}" hreflang="${L10N[l].hl}">${L10N[l].flag}</a>`).join('')}<a href="${base}">${L.top}</a></nav></header>
<main>
${body}
<footer><p>${L.ai}</p><p><a href="${pageUrl(Object.keys(L10N).find(k => L10N[k] === L), '')}">${L.all}</a> · <a href="${base}">Komiks·Lab</a></p></footer>
</main>
</body>
</html>
`;
// 🖼️ малюнки для статичних сторінок: обкладинка + перші кадри кожного коміксу (SVG, без тексту сторінки)
const ARTW = W.KomiksArt || null;
const IMG_DIR = path.join(DIST, 'img');
/* Тека карток для соцмереж. Лежить у джерелі, а не в dist: малювати їх щоразу
   довго, тож вони переживають збірки й оновлюються лише коли застаріли. */
const OG_DIR = path.join(ROOT, 'img', 'og');
function comicImages(c) {
  if (!ARTW) return [];
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const out = [];
  const titleFor = c.titleEn || c.title;
  // фото-комікс: показуємо самі світлини, без проміжного SVG
  const ph = i => ((c.panels[i] || {}).art || {}).photo;
  if (ph(c.cover || 0)) {
    const n = Math.min(4, (c.panels || []).length);
    for (let i = 0; i < n; i++) {
      const f = ph(i); if (!f) continue;
      const alt = i === (c.cover || 0) ? titleFor : ((c.panels[i].lines || []).map(l => l.no).join(' ') || titleFor);
      out.push({ file: (c.photoDir || 'photo/') + f, alt, cover: i === (c.cover || 0), i });
    }
    return out;
  }
  try {
    const cov = ARTW.cover(c, { title: titleFor, badge: c.level || '', chars: CHS });
    fs.writeFileSync(path.join(IMG_DIR, `${c.id}.svg`), cov, 'utf8');
    out.push({ file: `img/${c.id}.svg`, alt: titleFor, cover: true });
  } catch (e) { /* обкладинка не вийшла — не критично */ }
  const n = Math.min(3, (c.panels || []).length);
  for (let i = 0; i < n; i++) {
    try {
      const svg = ARTW.panel(c, i, { lang: 'no', tr: null, chars: CHS });
      fs.writeFileSync(path.join(IMG_DIR, `${c.id}-${i + 1}.svg`), svg, 'utf8');
      out.push({ file: `img/${c.id}-${i + 1}.svg`, alt: (c.panels[i].lines || []).map(l => l.no).join(' ') || titleFor, i });
    } catch (e) { /* кадр пропускаємо */ }
  }
  return out;
}
const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const byLevel = LEVELS.map(l => [l, pub.filter(c => c.level === l)]).concat([['—', pub.filter(c => !LEVELS.includes(c.level))]]).filter(([, l]) => l.length);
const IMGS = {};
for (const c of pub) IMGS[c.id] = comicImages(c);

/* ---------- картка коміксу для соцмереж ----------
   Беремо вже намальовану обкладинку (або перше фото) і складаємо з неї кадр
   1200×630 — саме такий чекають усі соцмережі. SVG туди ставити не можна:
   Facebook і LinkedIn його не малюють, тож потрібен PNG.
   Перемальовуємо лише те, що застаріло: обкладинка новіша за картку або
   картки ще немає. Інакше кожна збірка витрачала б хвилини ні на що. */
const ogComicFile = id => `c-${id}.png`;
const ogComicUrl = id => `${base}img/og/${ogComicFile(id)}`;
(() => {
  if (!EDGE) return;
  fs.mkdirSync(OG_DIR, { recursive: true });
  const toFileUrl = abs => 'file:///' + abs.replace(/\\/g, '/');
  let made = 0;
  for (const c of pub) {
    const dst = path.join(OG_DIR, ogComicFile(c.id));
    const cov = (IMGS[c.id] || []).find(x => x.cover);
    if (!cov) continue;
    const src = path.join(cov.file.startsWith('img/') ? DIST : ROOT, cov.file);
    if (!fs.existsSync(src)) continue;
    /* Порівнюємо з вихідним файлом коміксу, а не з обкладинкою: обкладинка
       лежить у dist, яку збірка щоразу створює наново, тож за нею картка
       завжди здавалася б застарілою — і дві хвилини малювання йшли б у нікуди
       на кожній збірці. */
    const srcDay = (() => { try { return fs.statSync(path.join(ROOT, c._file || '')).mtimeMs; } catch { return 0; } })();
    if (!force && fs.existsSync(dst) && fs.statSync(dst).mtimeMs >= srcDay) continue;
    const q = new URLSearchParams({
      img: toFileUrl(src),
      level: c.level || '',
      title: c.title || '',
      sub: [c.titleUk, c.titleEn].filter(Boolean).join(' · '),
      site: base.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      tag: `${(c.panels || []).length} ${(c.panels || []).length === 1 ? 'rute' : 'ruter'}`,
    }).toString();
    shot('og-comic.html', dst, 1200, 630, q, true);
    made++;
  }
  if (made) console.log(`🖼  img/og/ — ${made} карток коміксів`);
})();
for (const lang of LANGS3) {
  const L = L10N[lang];
  for (const c of pub) {
    const url = pageUrl(lang, c.id);
    const lines = c.panels.flatMap(p => p.lines).slice(0, 40);
    const others = pub.filter(x => x.id !== c.id && x.level === c.level).slice(0, 8);
    const ogImg = fs.existsSync(path.join(OG_DIR, ogComicFile(c.id))) ? ogComicUrl(c.id) : base + 'og-image.png';
    const imgs = IMGS[c.id] || [];
    const cover = imgs.find(x => x.cover);
    const strip = imgs.filter(x => !x.cover);
    const crumbs = `<p class="crumbs"><a href="${base}">Komiks·Lab</a> › <a href="${pageUrl(lang, '')}">${esc(L.all)}</a> › ${esc(L.name(c))}</p>`;
    const body = `${crumbs}
<p><span class="lvl">${esc(L.lvl(c.level || ''))}</span></p>
<h1>${esc(L.name(c))}${L.name(c) !== c.title ? ` <small lang="nb">— ${esc(c.title)}</small>` : ''}</h1>
<p><b>${esc(L.sum(c))}</b></p>
${lang !== 'no' ? `<p lang="nb">🇳🇴 ${esc(c.summaryNo || '')}</p>` : ''}
${cover ? `<figure><img src="${base}${cover.file}" width="400" height="300" alt="${esc(L.name(c))} — ${esc(L.lvl(c.level || ''))}" loading="eager"></figure>` : ''}
<a class="cta" href="${base}#/read/${c.id}">${L.cta}</a>
${strip.length ? `<div class="strip">${strip.map(im => `<figure><img src="${base}${im.file}" width="400" height="300" alt="${esc(im.alt)}" loading="lazy"><figcaption lang="nb">${esc(im.alt)}</figcaption></figure>`).join('')}</div>` : ''}
<section class="card"><h2>${L.dlg}</h2>
${lines.map(l => `<p class="line"><b>${esc(L.who(CHS[l.who] || { no: l.who }))}:</b> <span lang="nb">${esc(l.no)}</span><small>${esc(L.tr(l))}</small></p>`).join('\n')}
</section>
<section class="card"><h2>${L.words}</h2><table>
${c.vocab.map(v => `<tr><td lang="nb"><b>${esc(v[0])}</b></td><td>${esc(L.voc(v))}</td></tr>`).join('\n')}
</table></section>
${others.length ? `<section><h2>${esc(L.more(c.level || ''))}</h2><ul class="list">${others.map(o => `<li><a href="${pageUrl(lang, o.id)}">${esc(L.name(o))}</a>${L.name(o) !== o.title ? ` <span lang="nb">(${esc(o.title)})</span>` : ''}</li>`).join('')}</ul></section>` : ''}`;
    const jsonld = [
      { '@context': 'https://schema.org', '@type': 'LearningResource', name: L.name(c), description: L.sum(c), inLanguage: [L.html, 'nb'], educationalLevel: c.level, learningResourceType: 'Comic', isAccessibleForFree: true, url, image: imgs.map(im => base + im.file), teaches: (c.vocab || []).slice(0, 12).map(v => v[0]).join(', '), isPartOf: { '@type': 'Course', name: 'Komiks·Lab', url: base } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Komiks·Lab', item: base },
        { '@type': 'ListItem', position: 2, name: L.all, item: pageUrl(lang, '') },
        { '@type': 'ListItem', position: 3, name: L.name(c), item: url }] }];
    const f = path.join(DIST, L.dir, 'komiks', c.id, 'index.html');
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, pageShell({ L, title: L.title(c), desc: L.desc(c).slice(0, 160), url, id: c.id, body, jsonld, image: ogImg }), 'utf8');
  }
  fs.mkdirSync(path.join(DIST, L.dir, 'komiks'), { recursive: true });
  const hubList = { '@context': 'https://schema.org', '@type': 'ItemList', name: L.hubH(pub.length), numberOfItems: pub.length,
    itemListElement: pub.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: pageUrl(lang, c.id), name: L.name(c) })) };
  fs.writeFileSync(path.join(DIST, L.dir, 'komiks', 'index.html'), pageShell({ L, title: L.hubT, desc: L.hubD(pub.length), url: pageUrl(lang, ''), id: '', jsonld: hubList,
    body: `<h1>${esc(L.hubH(pub.length))}</h1>\n<p>${esc(L.hubP)}</p>\n` + byLevel.map(([l, list]) => `<section><h2>${esc(L.level(l))}</h2><div class="strip">${list.map(c => {
      const im = (IMGS[c.id] || []).find(x => x.cover);
      return `<figure><a href="${pageUrl(lang, c.id)}">${im ? `<img src="${base}${im.file}" width="400" height="300" alt="${esc(L.name(c))}" loading="lazy">` : ''}<figcaption><b>${esc(L.name(c))}</b>${L.name(c) !== c.title ? ` <span lang="nb">(${esc(c.title)})</span>` : ''}</figcaption></a></figure>`;
    }).join('')}</div></section>`).join('\n') }), 'utf8');
}

/* ───────── сторінки тестів: /tests/, /uk/testy/, /no/prover/ ─────────
   Тести були доступні лише за адресою з решіткою, тож для пошуку їх не
   існувало. Ця сторінка пояснює, які перевірки є і чим відрізняються, та веде
   всередину застосунку. */
const T10N = {
  en: { dir: '', seg: 'norwegian-tests',
    title: 'Norwegian tests online (A1–B2) — free practice | Komiks·Lab',
    desc: 'Free Norwegian tests: level tests A1–B2, word order, listening, vocabulary, the alphabet and numbers. Every question comes from a voiced comic.',
    h1: 'Norwegian tests online',
    lead: 'Every test here is built from the same stories you read: the sentences are real, the voices are the ones you have already heard. Nothing is invented for the exercise.',
    secLevel: 'Level tests A1–B2', secSkill: 'Practice by skill', secBasic: 'The basics',
    lvlD: l => `Questions from every comic at level ${l}: listening, word order, vocabulary and the meaning of whole lines.`,
    items: [
      ['🔀 Word order', 'The most common mistake in Norwegian is not the word but its place. The verb comes second, and after an adverbial the subject and verb swap. Half the tasks are exactly those inverted sentences.', '#/quiz/order/all'],
      ['🎧 Listening', 'You hear a line and choose what was said. The text is hidden on purpose — this is the skill the oral exam actually checks.', '#/tests'],
      ['📝 Vocabulary', 'Words from the comics, with pictures where a picture explains better than a translation.', '#/quiz/words'],
      ['🧩 Crossword', 'Recognising a word is not enough: you have to recall it and spell it out. That is what fixes å, ø, æ and double consonants.', '#/cross'],
      ['🧠 Pairs', 'A short daily game that pulls in the words you have got wrong before.', '#/pairs'],
      ['✍️ Writing', 'You write a short text and get the corrected version back, with the mistakes explained.', '#/write'],
    ],
    basics: [['🔤 The Norwegian alphabet', 'Letters and sounds, including æ, ø and å.', '#/quiz/alphabet'], ['🔢 Numbers', 'From zero to a hundred — by ear and in writing.', '#/quiz/numbers']],
    examT: 'Preparing for Norskprøven?', examD: 'There is a mock exam with the same parts as the real one, and a placement test if you are not sure where to start.',
    examB: '🏁 Mock exam', placeB: '🎯 Placement test', cta: 'Open the tests →', free: 'All tests are free. An account keeps your progress on every device.' },

  no: { dir: 'no/', seg: 'prover',
    title: 'Norskprøver på nett (A1–B2) – gratis øving | Komiks·Lab',
    desc: 'Gratis prøver i norsk: nivåprøver A1–B2, ordstilling, lytting, ordforråd, alfabetet og tall. Hvert spørsmål kommer fra en tegneserie med lyd.',
    h1: 'Prøver i norsk på nett',
    lead: 'Alle prøvene er bygget på de samme historiene du leser: setningene er ekte, og stemmene har du allerede hørt. Ingenting er funnet på til øvelsen.',
    secLevel: 'Nivåprøver A1–B2', secSkill: 'Øv på én ferdighet', secBasic: 'Grunnlaget',
    lvlD: l => `Spørsmål fra alle tegneseriene på nivå ${l}: lytting, ordstilling, ordforråd og betydningen av hele replikker.`,
    items: [
      ['🔀 Ordstilling', 'Den vanligste feilen i norsk er ikke ordet, men plassen. Verbet står på plass to, og etter et adverbial bytter subjekt og verb plass. Halvparten av oppgavene er slike setninger.', '#/quiz/order/all'],
      ['🎧 Lytting', 'Du hører en replikk og velger hva som ble sagt. Teksten er skjult med vilje – det er denne ferdigheten muntlig prøve faktisk måler.', '#/tests'],
      ['📝 Ordforråd', 'Ord fra tegneseriene, med bilder der et bilde forklarer bedre enn en oversettelse.', '#/quiz/words'],
      ['🧩 Ordkryss', 'Å kjenne igjen et ord holder ikke: du må huske det og skrive det bokstav for bokstav. Det er slik å, ø, æ og dobbeltkonsonanter setter seg.', '#/cross'],
      ['🧠 Par', 'Et kort daglig spill som henter inn ordene du har bommet på før.', '#/pairs'],
      ['✍️ Skriving', 'Du skriver en kort tekst og får den rettet tilbake, med feilene forklart.', '#/write'],
    ],
    basics: [['🔤 Det norske alfabetet', 'Bokstaver og lyder, også æ, ø og å.', '#/quiz/alphabet'], ['🔢 Tall', 'Fra null til hundre – på øret og skriftlig.', '#/quiz/numbers']],
    examT: 'Skal du ta norskprøven?', examD: 'Det finnes en øvingsprøve med de samme delene som den ekte, og en plasseringsprøve hvis du er usikker på hvor du skal begynne.',
    examB: '🏁 Øvingsprøve', placeB: '🎯 Plasseringsprøve', cta: 'Åpne prøvene →', free: 'Alle prøver er gratis. Med konto følger fremgangen deg på alle enheter.' },

  uk: { dir: 'uk/', seg: 'testy',
    title: 'Тести з норвезької онлайн (A1–B2) — безкоштовно | Komiks·Lab',
    desc: 'Безкоштовні тести з норвезької: рівні A1–B2, порядок слів, аудіювання, словниковий запас, алфавіт і числа. Кожне питання — з озвученого коміксу.',
    h1: 'Тести з норвезької онлайн',
    lead: 'Усі тести складені з тих самих історій, які ви читаєте: речення справжні, а голоси ви вже чули. Нічого не вигадано спеціально для вправи.',
    secLevel: 'Тести за рівнями A1–B2', secSkill: 'Окрема навичка', secBasic: 'Основи',
    lvlD: l => `Питання з усіх коміксів рівня ${l}: аудіювання, порядок слів, лексика й зміст цілих реплік.`,
    items: [
      ['🔀 Порядок слів', 'Найчастіша помилка в норвезькій — не слово, а його місце. Дієслово стоїть другим, а після обставини підмет і дієслово міняються місцями. Половина завдань — саме такі речення.', '#/quiz/order/all'],
      ['🎧 Аудіювання', 'Ви чуєте репліку й обираєте, що саме сказали. Текст сховано навмисно — усний іспит перевіряє саме це.', '#/tests'],
      ['📝 Лексика', 'Слова з коміксів, із малюнками там, де малюнок пояснює краще за переклад.', '#/quiz/words'],
      ['🧩 Кросворд', 'Упізнати слово мало — його треба згадати й написати по літерах. Саме це закріплює å, ø, æ і подвоєні приголосні.', '#/cross'],
      ['🧠 Пари', 'Коротка щоденна гра, яка сама підтягує слова, у яких ви вже помилялися.', '#/pairs'],
      ['✍️ Письмо', 'Ви пишете короткий текст і отримуєте виправлений варіант із поясненням помилок.', '#/write'],
    ],
    basics: [['🔤 Норвезький алфавіт', 'Літери та звуки, зокрема æ, ø і å.', '#/quiz/alphabet'], ['🔢 Числа', 'Від нуля до ста — на слух і письмом.', '#/quiz/numbers']],
    examT: 'Готуєтеся до Norskprøven?', examD: 'Є пробний іспит із тими самими частинами, що й справжній, і розміщувальний тест, якщо не знаєте, з чого почати.',
    examB: '🏁 Пробний іспит', placeB: '🎯 Розміщувальний тест', cta: 'Відкрити тести →', free: 'Усі тести безкоштовні. З акаунтом прогрес зберігається на всіх пристроях.' },
};
const tstUrl = (lang, seg) => `${base}${T10N[lang].dir}${T10N[lang].seg}/`;
const tstAlt = () => LANGS3.map(l => `    <xhtml:link rel="alternate" hreflang="${L10N[l].hl}" href="${tstUrl(l)}"/>`).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${tstUrl('en')}"/>`;

for (const lang of LANGS3) {
  const L = L10N[lang], T = T10N[lang];
  const dir = path.join(DIST, T.dir, T.seg);
  fs.mkdirSync(dir, { recursive: true });
  const alts = LANGS3.map(l => `<link rel="alternate" hreflang="${L10N[l].hl}" href="${tstUrl(l)}">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${tstUrl('en')}">`;
  const card = (t, d, href) => `<article class="upd-card"><h3><a href="${base}${href.replace('#/', '#/')}">${esc(t)}</a></h3><p>${esc(d)}</p></article>`;
  const body = `<p class="crumbs"><a href="${base}">Komiks·Lab</a> › ${esc(T.h1)}</p>
<h1>${esc(T.h1)}</h1>
<p class="upd-lead">${esc(T.lead)}</p>
<h2>${esc(T.secLevel)}</h2>
<div class="upd-list">${LEVELS.filter(l => pub.some(c => c.level === l)).map(l => card(`${L.lvl(l)}`, T.lvlD(l), `#/quiz/level/${l}`)).join('')}</div>
<h2>${esc(T.secSkill)}</h2>
<div class="upd-list">${T.items.map(([t, d, href]) => card(t, d, href)).join('')}</div>
<h2>${esc(T.secBasic)}</h2>
<div class="upd-list">${T.basics.map(([t, d, href]) => card(t, d, href)).join('')}</div>
<h2>${esc(T.examT)}</h2>
<p>${esc(T.examD)}</p>
<p class="row-left"><a class="cta" href="${base}#/exam">${esc(T.examB)}</a> <a class="cta" href="${base}#/placement">${esc(T.placeB)}</a></p>
<p>${esc(T.free)}</p>
<p><a class="cta" href="${base}#/tests">${esc(T.cta)}</a></p>`;
  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'CollectionPage', name: T.h1, url: tstUrl(lang),
      description: T.desc, inLanguage: L.hl, isPartOf: { '@type': 'WebSite', name: 'Komiks·Lab', url: base } },
    { '@context': 'https://schema.org', '@type': 'ItemList', name: T.secLevel,
      itemListElement: LEVELS.filter(l => pub.some(c => c.level === l)).map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: L.lvl(l), url: `${base}#/quiz/level/${l}` })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Komiks·Lab', item: base },
      { '@type': 'ListItem', position: 2, name: T.h1, item: tstUrl(lang) },
    ] },
  ];
  fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html>
<html lang="${L.html}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(T.title)}</title>
<meta name="description" content="${esc(T.desc)}">
<link rel="canonical" href="${tstUrl(lang)}">
${alts}
<meta property="og:type" content="website"><meta property="og:site_name" content="Komiks·Lab"><meta property="og:title" content="${esc(T.title)}"><meta property="og:description" content="${esc(T.desc)}"><meta property="og:url" content="${tstUrl(lang)}"><meta property="og:image" content="${base}og-image.png"><meta property="og:locale" content="${L.locale}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(T.title)}"><meta name="twitter:description" content="${esc(T.desc)}"><meta name="twitter:image" content="${base}og-image.png">
<link rel="icon" href="${base}icons/favicon.ico" sizes="16x16 32x32 48x48 256x256">
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
<style>${PAGE_CSS}
.upd-list{display:grid;gap:12px;margin:14px 0;grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr))}
.upd-card{border:3px solid #141414;border-radius:14px;padding:12px 14px;background:#fff}
.upd-card h3{margin:0 0 4px;font-size:1.02rem}
.upd-card a{text-decoration:none}
.upd-lead{font-size:1.05rem}</style>
</head>
<body>
<header class="top"><b><img class="top-logo" src="${base}img/logo.svg" alt="" width="30" height="30"> Komiks·Lab</b><nav>${LANGS3.filter(l => l !== lang).map(l => `<a href="${tstUrl(l)}" hreflang="${L10N[l].hl}">${L10N[l].flag}</a>`).join('')}<a href="${base}">${L.top}</a></nav></header>
<main>
${body}
<p class="crumbs">${L.ai}</p>
</main>
</body>
</html>
`, 'utf8');
}
console.log(`✔ сторінки тестів: ${LANGS3.length} (${LANGS3.map(l => T10N[l].dir + T10N[l].seg).join(', ')})`);

/* ───────── сторінки оновлень: /updates/<дата>/ трьома мовами ─────────
   Журнал лежить у data/updates.js — те саме джерело, що й «Що нового» у
   застосунку. Дублювати текст не можна: розійдеться з першим же записом. */
const UPD = (() => {
  const w = {};
  try { new Function('window', rd('data/updates.js'))(w); } catch (e) { return []; }
  return (w.KOMIKS_UPDATES || []).filter(u => u && u.id);
})();

const U10N = {
  en: { dir: '', seg: 'updates', hub: 'What’s new in Komiks·Lab — updates log',
    hubD: n => `All ${n} Komiks·Lab updates: new comics, tests, games and languages for learning Norwegian.`,
    one: d => `Komiks·Lab update ${d} — what changed`,
    oneD: (d, first) => `Komiks·Lab, ${d}: ${first}`,
    back: '← All updates', date: 'Update of', shots: 'How it looks', site: 'Open Komiks·Lab →',
    intro: 'Short notes on what changed in the app for learning Norwegian with comics.' },
  no: { dir: 'no/', seg: 'oppdateringer', hub: 'Hva er nytt i Komiks·Lab — logg over oppdateringer',
    hubD: n => `Alle ${n} oppdateringene i Komiks·Lab: nye tegneserier, prøver, spill og språk.`,
    one: d => `Komiks·Lab oppdatering ${d} — hva er nytt`,
    oneD: (d, first) => `Komiks·Lab, ${d}: ${first}`,
    back: '← Alle oppdateringer', date: 'Oppdatering', shots: 'Slik ser det ut', site: 'Åpne Komiks·Lab →',
    intro: 'Korte notater om hva som er endret i appen for å lære norsk med tegneserier.' },
  uk: { dir: 'uk/', seg: 'onovlennya', hub: 'Що нового в Комікс·Lab — журнал оновлень',
    hubD: n => `Усі ${n} оновлень Комікс·Lab: нові комікси, тести, ігри та мови для вивчення норвезької.`,
    one: d => `Оновлення Комікс·Lab ${d} — що змінилося`,
    oneD: (d, first) => `Комікс·Lab, ${d}: ${first}`,
    back: '← Усі оновлення', date: 'Оновлення від', shots: 'Як це виглядає', site: 'Відкрити Комікс·Lab →',
    intro: 'Короткі нотатки про те, що змінилося в застосунку для вивчення норвезької через комікси.' },
};
const updUrl = (lang, id) => `${base}${U10N[lang].dir}${U10N[lang].seg}/${id ? id + '/' : ''}`;

/* ---------- картка для соцмереж на кожне оновлення ----------
   Одна картинка на всі записи означала, що у стрічці Facebook чи LinkedIn
   п'ятнадцять різних посилань виглядають однаково — і ніхто не бачить, що там
   нове. Тому малюємо свою: дата, перший рядок оновлення й мітки.
   Окремо для кожної мови: ділиться людина конкретною сторінкою, і норвезька
   картка під українським текстом виглядала б помилкою.
   Кешуємо в img/og/ — перемалювати все змусить прапорець --images. */
const ogFile = (lang, id) => `${lang}-${id}.png`;
const ogUrl = (lang, id) => `${base}img/og/${ogFile(lang, id)}`;
(() => {
  if (!UPD.length) return;
  fs.mkdirSync(OG_DIR, { recursive: true });
  let made = 0;
  for (const lang of LANGS3) {
    const UL = U10N[lang];
    for (const u of UPD) {
      const dst = path.join(OG_DIR, ogFile(lang, u.id));
      if (!force && fs.existsSync(dst)) continue;
      const items = u[lang] || u.en || [];
      if (!items.length) continue;
      /* Емодзі на початку рядка вже стоїть окремим клеймом у кутку картки,
         тому з тексту його прибираємо — інакше воно двоїться. */
      const strip = x => String(x).replace(/^[^\p{L}\p{N}]+/u, '').trim();
      const first = strip(items[0]);
      const title = first.split(/(?<=[.!?:])\s/)[0].slice(0, 70);
      const lead = first.slice(title.length).trim() || strip(items[1] || '');
      /* Мітки на картку не ставимо: у data/updates.js вони службові й норвезькі
         («sikkerhet», «tofaktor»), тож під українським текстом виглядали б
         сміттям. Замість них — рядок про те, що це за сайт. */
      const q = new URLSearchParams({
        icon: u.icon || '✨', date: `${UL.date} ${u.id}`.replace(/^Update of /, ''),
        title, lead: lead.slice(0, 210), foot: UL.intro.slice(0, 90),
        site: base.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      }).toString();
      shot('og-upd.html', dst, 1200, 630, q, true);
      made++;
    }
  }
  if (made) console.log(`🖼  img/og/ — ${made} карток для соцмереж`);
})();
const updAlt = id => LANGS3.map(l => `<link rel="alternate" hreflang="${L10N[l].hl}" href="${updUrl(l, id)}">`).join('\n')
  + `\n<link rel="alternate" hreflang="x-default" href="${updUrl('en', id)}">`;

/* Знімки беремо зі store/android — це ті самі кадри, що й у магазині, тож
   сторінка показує застосунок таким, яким його справді видно. */
const SHOT_DIRS = [path.join(ROOT, 'img', 'shots'), path.join(ROOT, 'store', 'android')];
const SHOTS = [];
fs.mkdirSync(path.join(DIST, 'img', 'updates'), { recursive: true });
if (fs.existsSync(OG_DIR)) {
  fs.mkdirSync(path.join(DIST, 'img', 'og'), { recursive: true });
  for (const f of fs.readdirSync(OG_DIR)) fs.copyFileSync(path.join(OG_DIR, f), path.join(DIST, 'img', 'og', f));
}
for (const dir of SHOT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter(f => /\.png$/.test(f) && !/^(feature|icon)/.test(f))) {
    fs.copyFileSync(path.join(dir, f), path.join(DIST, 'img', 'updates', f));
    if (!SHOTS.includes(f)) SHOTS.push(f);
  }
}
/* Слова, за якими впізнаємо розділ. Усі чотири мови записів разом, бо один
   рядок може бути українською, інший англійською — а відповідає їм той самий
   екран. Корені обрізані навмисно: «тест», «теста», «тести» мають збігатися. */
const SHOT_WORDS = {
  quiz: ['тест', 'test', 'prøv', 'питанн', 'question', 'oppgav', 'відповід', 'اختبار'],
  read: ['комікс', 'comic', 'tegneseri', 'читанн', 'read', 'les ', 'кадр', 'rute', 'історі', 'قصة', 'قصص'],
  words: ['слов', 'word', ' ord', 'словник', 'лексик', 'كلم'],
  cards: ['картк', 'flashcard', 'kort', 'повторенн'],
  pairs: ['пари', 'pairs', 'par '],
  cross: ['кросворд', 'crossword', 'ordkryss'],
  grammar: ['граматик', 'grammar', 'grammatikk', 'прийменник', 'preposi'],
  alphabet: ['алфавіт', 'alphabet', 'alfabet', 'літер', 'bokstav'],
  numbers: ['числ', 'number', 'tall'],
  call: ['дзвін', 'call', 'samtale', 'голос', 'voice', 'stemme', 'розмов'],
  write: ['письм', 'writing', 'skriv', 'твір'],
  exam: ['іспит', 'exam', 'prøveeksamen', 'norskprøv'],
  plan: ['план', 'plan'],
  today: ['сьогодні', 'today', 'i dag', 'щоден'],
  players: ['рейтинг', 'ranking', 'гравц', 'player', 'spiller'],
  friends: ['друз', 'friend', 'venn'],
  profile: ['профіл', 'profile', 'аватар', 'avatar', 'налаштуванн', 'settings', 'innstilling'],
  install: ['встанов', 'install', 'apk', 'windows', '.exe', 'застосун', 'інсталятор'],
  login: ['вхід', 'вхо', 'sign in', 'logg inn', 'парол', 'password', 'двофактор', 'tofaktor', 'two-factor', 'код із пошти', 'автентифік'],
  register: ['реєстр', 'register', 'акаунт', 'account', 'konto'],
  whatsnew: ['оновленн', 'update', 'oppdatering', 'що нового'],
  english: ['англійськ', 'english', 'engelsk'],
  math: ['математ', 'math', 'matte'],
  race: ['гонк', 'race', 'løp', 'гра ', 'game', 'spill'],
  comics: ['список комікс', 'усі комікс', 'all comics'],
  home: ['головн', 'home', 'forside'],
};
/* Знімок до рядка. Якщо нічого не впізнали — краще взяти кадр самого запису,
   ніж поставити випадковий: підпис під чужою картинкою гірший за її брак. */
function shotForLine(text, fallback, used) {
  const t = String(text).toLowerCase();
  /* Рахуємо всі збіги, а не лише найкращий: якщо найсильніший розділ уже
     зайнятий сусіднім пунктом, беремо наступний за силою. Шість пунктів із
     чотирма однаковими кадрами — це не ілюстрація, а шпалери. */
  const scored = [];
  for (const [key, words] of Object.entries(SHOT_WORDS)) {
    let n = 0;
    for (const w of words) if (t.includes(w)) n++;
    if (n) scored.push([n, key]);
  }
  scored.sort((a, b) => b[0] - a[0]);
  for (const [, key] of scored) {
    const file = key + '.png';
    if (!SHOTS.includes(file)) continue;
    if (used && used.has(file)) continue;
    if (used) used.add(file);
    return [file, shotAlt[key] || 'Komiks·Lab'];
  }
  /* Нічого вільного не знайшлося — краще повторити найточніший кадр, ніж
     поставити випадковий: підпис під чужою картинкою гірший за повтор. */
  for (const [, key] of scored) {
    const file = key + '.png';
    if (SHOTS.includes(file)) return [file, shotAlt[key] || 'Komiks·Lab'];
  }
  return fallback || null;
}

const shotAlt = { '01-home': 'Komiks·Lab home screen', '02-read': 'Reading a Norwegian comic with audio',
  '03-quiz': 'A test after the comic', '04-words': 'Norwegian words by theme',
  '05-pairs': 'Pairs — a daily matching game', '06-cards': 'Flashcards with spaced repetition',
  '07-grammar': 'Norwegian grammar topics', '08-alphabet': 'The Norwegian alphabet',
  home: 'Komiks·Lab home screen', comics: 'All comics by level', read: 'Reading a comic with audio',
  quiz: 'A test after the comic', words: 'Norwegian words by theme', cards: 'Flashcards with spaced repetition',
  pairs: 'The Pairs game', cross: 'The Crossword game', grammar: 'Norwegian grammar', alphabet: 'The Norwegian alphabet',
  numbers: 'Numbers in Norwegian', today: 'The plan for today', plan: 'A personal study plan', exam: 'A mock exam',
  write: 'Writing practice', call: 'A conversation in Norwegian', race: 'The Logic Race game', players: 'Player ranking',
  friends: 'Friends', profile: 'Profile and avatar', install: 'Installing the app', login: 'Signing in',
  register: 'Creating an account', whatsnew: 'The updates log', english: 'English through comics', math: 'Maths' };

const updShell = ({ L, UL, title, desc, url, id, day = id, body, jsonld, image }) => `<!doctype html>
<html lang="${L.html}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
${updAlt(id)}
<meta property="og:type" content="article"><meta property="og:site_name" content="Komiks·Lab"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:locale" content="${L.locale}">
<meta property="og:image" content="${image}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/png"><meta property="og:image:alt" content="${esc(title)}">
<meta property="article:published_time" content="${day}"><meta property="article:modified_time" content="${day}"><meta property="article:section" content="${esc(UL.seg)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${image}"><meta name="twitter:image:alt" content="${esc(title)}">
<link rel="icon" href="${base}icons/favicon.ico" sizes="16x16 32x32 48x48 256x256">
${(Array.isArray(jsonld) ? jsonld : [jsonld]).filter(Boolean).map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
<style>${PAGE_CSS}
.top-logo{width:30px;height:30px;vertical-align:-7px;margin-right:4px}
.upd-shots{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin:16px 0}
.upd-shots figure{margin:0}
.upd-shots img{width:100%;height:auto;border:3px solid #141414;border-radius:12px;display:block;background:#fff8ea}
.upd-shots figcaption{font-size:.85rem;color:#555;margin-top:5px}
/* Пункт і його знімок — поруч. Текст ліворуч, бо його читають першим;
   знімок вузький, щоб п'ять пунктів лишалися списком, а не галереєю. */
.upd-items{list-style:none;padding:0;margin:18px 0;display:grid;gap:16px}
.upd-item{display:grid;grid-template-columns:1fr 150px;gap:14px;align-items:start;
  border:3px solid #141414;border-radius:14px;background:#fff;padding:12px 14px}
.upd-item-t{font-size:1.02rem;line-height:1.5}
.upd-item figure{margin:0}
.upd-item img{width:100%;height:auto;border:2px solid #141414;border-radius:10px;display:block;background:#fff8ea}
.upd-item figcaption{font-size:.72rem;color:#666;margin-top:4px;line-height:1.25}
@media(max-width:620px){.upd-item{grid-template-columns:1fr}.upd-item figure{max-width:190px;margin:0 auto}}
.upd-lead{font-size:1.05rem}
.upd-count{color:#555;font-size:.92rem;margin-top:-6px}
.upd-list{display:grid;gap:16px;margin:16px 0;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))}
.upd-card{border:3px solid #141414;border-radius:14px;padding:0 0 12px;background:#fff;overflow:hidden;display:flex;flex-direction:column}
.upd-card-pic{display:block}
.upd-card-pic img{width:100%;height:auto;display:block;border-bottom:3px solid #141414;background:#fff8ea}
.upd-card h2{margin:10px 14px 6px;font-size:1.05rem}
.upd-card a{text-decoration:none}
.upd-card-lead{margin:0 14px;padding-left:18px;font-size:.92rem;color:#333;line-height:1.45}
.upd-card-lead li{margin-bottom:4px}
.upd-tags{margin:8px 14px 0;display:flex;flex-wrap:wrap;gap:6px}
.upd-tags span{font-size:.75rem;font-weight:700;background:#fff1d0;border:2px solid #141414;border-radius:999px;padding:1px 9px}
.upd-when{font-size:.85rem;color:#555}</style>
</head>
<body>
<header class="top"><b><img class="top-logo" src="${base}img/logo.svg" alt="" width="30" height="30"> Komiks·Lab</b><nav>${LANGS3.filter(l => L10N[l] !== L).map(l => `<a href="${updUrl(l, id)}" hreflang="${L10N[l].hl}">${L10N[l].flag}</a>`).join('')}<a href="${base}">${UL.site}</a></nav></header>
<main>
${body}
<p class="crumbs"><a href="${updUrl(L === L10N.en ? 'en' : (L === L10N.no ? 'no' : 'uk'), '')}">${UL.back}</a> · <a href="${base}">${UL.site}</a></p>
<p class="crumbs">${L.ai}</p>
</main>
</body>
</html>
`;

/* Якщо Edge на машині складальника немає, картки не намалюються — тоді краще
   загальна картинка, ніж посилання на файл, якого не існує. */
const ogImgFor = (lang, id) => fs.existsSync(path.join(OG_DIR, ogFile(lang, id))) ? ogUrl(lang, id) : base + 'og-image.png';

let updPages = 0;
for (const lang of LANGS3) {
  const L = L10N[lang], UL = U10N[lang];
  const dirRoot = path.join(DIST, UL.dir, UL.seg);
  fs.mkdirSync(dirRoot, { recursive: true });

  for (const u of UPD) {
    const items = u[lang] || u.en || [];
    if (!items.length) continue;
    const first = String(items[0]).replace(/^[^\p{L}\p{N}]+/u, '').slice(0, 150);
    const title = UL.one(updDay(u.id));
    const desc = UL.oneD(updDay(u.id), first);
    const pick = (u.shots && u.shots.length ? u.shots : SHOTS.slice(0, 3).map(f => [f, shotAlt[f.replace('.png', '')] || 'Komiks·Lab']));
    /* Кожен пункт — зі своїм знімком. Так людина бачить, про який саме екран
       ідеться, а пошук отримує картинку з осмисленим alt замість трьох
       однакових кадрів у кінці сторінки. */
    /* Ідентифікатор запису — це адреса сторінки, тож він лишається як є.
       А дата, яку заявляємо назовні, береться з перших десяти символів і не
       буває з майбутнього: такі дати пошукові системи відкидають. */
    const day = updDay(u.id);
    const usedShots = new Set();
    const rows = items.map((x, i) => {
      const sh = shotForLine(x, pick[i % pick.length], usedShots);
      const txt = String(x);
      return `<li class="upd-item">
  <div class="upd-item-t">${esc(txt)}</div>
  ${sh ? `<figure><img src="${base}img/updates/${sh[0]}?v=${version}" alt="${esc(sh[1])}" width="1080" height="2400" loading="lazy"><figcaption>${esc(sh[1])}</figcaption></figure>` : ''}
</li>`;
    }).join('\n');
    const body = `<h1>${esc(title)}</h1>
<p class="upd-when">${esc(UL.date)} <time datetime="${esc(day)}">${esc(day)}</time> · <a href="${updUrl(lang, '')}">${esc(UL.back.replace(/^[^\p{L}]+/u, ''))}</a></p>
<p class="upd-lead">${esc(UL.intro)}</p>
<ul class="upd-items">${rows}</ul>
<p><a class="cta" href="${base}">${esc(UL.site)}</a></p>`;
    const img = ogImgFor(lang, u.id);
    /* Хлібні крихти потрібні не стільки людині (вони є й текстом унизу), скільки
       пошуку: у видачі замість голого URL показується шлях «Komiks·Lab › Оновлення
       › 2026-10-06», і зрозуміло, що це за сторінка, ще до переходу. */
    const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Komiks·Lab', item: base },
      { '@type': 'ListItem', position: 2, name: UL.hub, item: updUrl(lang, '') },
      { '@type': 'ListItem', position: 3, name: title, item: updUrl(lang, u.id) },
    ] };
    const jsonld = [{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: title,
      datePublished: day, dateModified: day, inLanguage: L.hl, url: updUrl(lang, u.id),
      mainEntityOfPage: { '@type': 'WebPage', '@id': updUrl(lang, u.id) },
      description: desc, image: img, isAccessibleForFree: true,
      author: { '@type': 'Organization', name: 'Komiks·Lab', url: base },
      publisher: { '@type': 'Organization', name: 'Komiks·Lab', url: base, logo: { '@type': 'ImageObject', url: base + 'img/logo.svg' } } }, crumbs];
    const dir = path.join(dirRoot, u.id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'),
      updShell({ L, UL, title, desc, url: updUrl(lang, u.id), id: u.id, day, body, jsonld, image: img }), 'utf8');
    updPages++;
  }

  const cards = UPD.map(u => {
    const items = u[lang] || u.en || [];
    const img = ogImgFor(lang, u.id);
    /* Два перші пункти як анонс: одного мало, щоб зрозуміти запис, а всі п'ять
       перетворюють список на стіну тексту. */
    const lead = items.slice(0, 2).map(x => `<li>${esc(String(x))}</li>`).join('');
    return `<article class="upd-card">
  <a class="upd-card-pic" href="${updUrl(lang, u.id)}"><img src="${img}" alt="${esc(UL.one(u.id))}" width="1200" height="630" loading="lazy"></a>
  <h2><a href="${updUrl(lang, u.id)}">${esc(u.icon || '✨')} ${esc(UL.date)} <time datetime="${esc(updDay(u.id))}">${esc(updDay(u.id))}</time></a></h2>
  <ul class="upd-card-lead">${lead}</ul>
  ${(u.tags || []).length ? `<p class="upd-tags">${(u.tags || []).slice(0, 4).map(t => `<span>${esc(t)}</span>`).join('')}</p>` : ''}
</article>`;
  }).join('');
  const hubCrumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Komiks·Lab', item: base },
    { '@type': 'ListItem', position: 2, name: UL.hub, item: updUrl(lang, '') },
  ] };
  const hubJson = [{ '@context': 'https://schema.org', '@type': 'Blog', name: UL.hub, url: updUrl(lang, ''),
    description: UL.hubD(UPD.length), inLanguage: L.hl,
    publisher: { '@type': 'Organization', name: 'Komiks·Lab', url: base, logo: { '@type': 'ImageObject', url: base + 'img/logo.svg' } },
    blogPost: UPD.map(u => ({ '@type': 'BlogPosting', headline: UL.one(updDay(u.id)), url: updUrl(lang, u.id),
      datePublished: updDay(u.id), dateModified: updDay(u.id), image: ogImgFor(lang, u.id), inLanguage: L.hl })) },
    { '@context': 'https://schema.org', '@type': 'ItemList', name: UL.hub, numberOfItems: UPD.length,
      itemListElement: UPD.map((u, i) => ({ '@type': 'ListItem', position: i + 1, url: updUrl(lang, u.id), name: UL.one(updDay(u.id)) })) },
    hubCrumbs];
  fs.writeFileSync(path.join(dirRoot, 'index.html'), updShell({
    L, UL, title: UL.hub, desc: UL.hubD(UPD.length), url: updUrl(lang, ''), id: '',
    image: ogImgFor(lang, UPD[0] ? UPD[0].id : ''),
    body: `<h1>${esc(UL.hub)}</h1>
<p class="upd-lead">${esc(UL.intro)}</p>
<p class="upd-count">${esc(UL.hubD(UPD.length))}</p>
<div class="upd-list">${cards}</div>
<p><a class="cta" href="${base}">${esc(UL.site)}</a></p>`, jsonld: hubJson }), 'utf8');
  updPages++;
}
console.log(`✔ сторінки оновлень: ${updPages} (${UPD.length} записів × ${LANGS3.length} мови + хаби)`);

/* Короткий покажчик коміксів для PHP: адмінка бере звідси випадкову історію
   для листа, бо читати data/*.js із PHP було б дорого й крихко. */
{
  const brief = pub.map(c => ({ id: c.id, level: c.level, title: c.title,
    titleUk: c.titleUk || c.title, titleEn: c.titleEn || c.title,
    summary: c.summaryNo || c.summaryEn || '', summaryUk: c.summaryUk || '', summaryEn: c.summaryEn || '' }));
  fs.writeFileSync(path.join(DIST, 'data', 'comics.json'), JSON.stringify(brief), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'data', 'comics.json'), JSON.stringify(brief), 'utf8');
}

/* Окремі файли з img/ (знак бренду тощо): теку dist/img збірка наповнює сама,
   тож те, що лежить у джерелі, треба перенести явно. */
for (const f of ['logo.svg']) {
  const from = path.join(ROOT, 'img', f);
  if (fs.existsSync(from)) {
    fs.mkdirSync(path.join(DIST, 'img'), { recursive: true });
    fs.copyFileSync(from, path.join(DIST, 'img', f));
  }
}

/* Дата зміни має бути правдою. Коли всі триста адрес щоразу заявляють
   сьогоднішнє число, пошуковик робить єдиний можливий висновок: полю вірити
   не можна — і перестає його читати взагалі. Тоді комікс, який справді
   переписали, нічим не відрізняється від вісімдесяти, яких ніхто не чіпав.
   Тому беремо дату самого матеріалу, а не дату збірки. */
const fileDay = f => { try { return iso(fs.statSync(path.join(ROOT, f)).mtime); } catch { return today; } };
const comicDay = {};
for (const c of pub) comicDay[c.id] = c._file ? fileDay(c._file) : today;
const updDays = UPD.map(u => updDay(u.id)).sort();
const newestUpd = updDays.length ? updDays[updDays.length - 1] : today;

const smAlt = id => LANGS3.map(l => `    <xhtml:link rel="alternate" hreflang="${L10N[l].hl}" href="${pageUrl(l, id)}"/>`).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('en', id)}"/>`;
const smUpdAlt = id => LANGS3.map(l => `    <xhtml:link rel="alternate" hreflang="${L10N[l].hl}" href="${updUrl(l, id)}"/>`).join('\n') + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${updUrl('en', id)}"/>`;
// картинки коміксу теж у мапі сайту — щоб малюнки потрапили в пошук зображень
const smImg = id => (IMGS[id] || []).map(im => `    <image:image><image:loc>${base}${im.file}</image:loc><image:title>${esc(im.alt)}</image:title></image:image>`).join('\n');
const smUrl = (loc, prio, freq, day, inner = '') => {
  const extra = inner ? '\n' + inner + '\n  ' : '';
  return `  <url><loc>${loc}</loc><lastmod>${day}</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority>${extra}</url>`;
};
const smHome = `    <image:image><image:loc>${base}og-image.png</image:loc><image:title>Komiks·Lab</image:title></image:image>`;
/* Запис журналу має власну картку для соцмереж — вона ж найкраще й представляє
   сторінку в пошуку зображень. */
const smUpdImg = (lang, id) => fs.existsSync(path.join(OG_DIR, ogFile(lang, id)))
  ? `    <image:image><image:loc>${ogUrl(lang, id)}</image:loc><image:title>${esc(U10N[lang].one(id))}</image:title></image:image>` : '';

fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${smUrl(base, '1.0', 'weekly', today, smHome)}
${LANGS3.map(l => smUrl(pageUrl(l, ''), '0.9', 'weekly', today, smAlt(''))).join('\n')}
${pub.flatMap(c => LANGS3.map(l => smUrl(pageUrl(l, c.id), l === 'en' ? '0.8' : '0.7', 'monthly', comicDay[c.id], smAlt(c.id) + '\n' + smImg(c.id)))).join('\n')}
${LANGS3.map(l => smUrl(tstUrl(l), '0.85', 'monthly', today, tstAlt())).join('\n')}
${LANGS3.map(l => smUrl(updUrl(l, ''), '0.6', 'weekly', newestUpd, smUpdAlt(''))).join('\n')}
${UPD.flatMap(u => LANGS3.map(l => smUrl(updUrl(l, u.id), '0.5', 'yearly', updDay(u.id), [smUpdAlt(u.id), smUpdImg(l, u.id)].filter(Boolean).join('\n')))).join('\n')}
${fs.existsSync(path.join(DIST, 'privacy.html')) ? smUrl(base + 'privacy.html', '0.3', 'yearly', fileDay('privacy.html')) : ''}
</urlset>
`.replace(/\n{2,}/g, '\n'), 'utf8');
// запобіжник: у dist не може бути жодного конфігу з паролями — лише зразок
for (const bad of ['api/config.php', 'api/config.local.php']) {
  const f = path.join(DIST, bad);
  if (fs.existsSync(f)) { fs.unlinkSync(f); console.log('⚠ прибрано з dist:', bad); }
}
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`, 'utf8');

const size = dir => fs.readdirSync(dir, { withFileTypes: true }).reduce((s, e) => s + (e.isDirectory() ? size(path.join(dir, e.name)) : fs.statSync(path.join(dir, e.name)).size), 0);
console.log(`✔ версія ${version} · index.html оновлено (SEO + ${W.COMICS.length} коміксів)`);
console.log(`✔ dist/: ${pub.length} коміксів, ${Object.keys(audio).length} аудіо-ключів, ${(size(DIST) / 1048576).toFixed(1)} МБ · сайт: ${base}`);
if (base.includes('example.com')) console.log('ℹ Вкажіть адресу сайту в tools/site.json і запустіть збірку ще раз.');
