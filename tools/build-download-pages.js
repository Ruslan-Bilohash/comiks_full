'use strict';
/* Ukrainian download landing pages. Build integration runs this after sitemap.xml.
   Store destinations match assets/downloads.js. Do not add unverified price,
   reviews, system versions, download sizes or full-offline promises. */
const fs = require('node:fs');
const path = require('node:path');
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PAGES = [
  {
    slug: 'windows', platform: 'Windows', store: 'Microsoft Store',
    storeUrl: 'https://apps.microsoft.com/detail/9MZTK7VJZ37D',
    title: 'Завантажити Learning Norwegian для Windows | Komiks·Lab',
    description: 'Learning Norwegian для Windows: вивчайте норвезьку через комікси з озвученням, перекладом і тестами. Посилання на Microsoft Store та інструкція встановлення.',
    lead: 'Вивчайте норвезьку на комп’ютері у власному темпі: читайте комікси, слухайте діалоги та закріплюйте нові слова. Відкрийте Learning Norwegian у Microsoft Store, щоб перевірити сумісність і встановити застосунок для Windows.',
    purpose: 'Навчання за комп’ютером',
    purposeText: 'Виділіть час на коротку історію про життя в Норвегії. На великому екрані зручно читати діалоги, повертатися до перекладу й розбирати приклади з граматики. Оберіть матеріал свого рівня — від перших знайомств до розмов на роботі.',
    steps: [
      'Відкрийте сторінку Learning Norwegian у Microsoft Store за кнопкою на цій сторінці.',
      'Перегляньте опис, системні вимоги й доступність для свого пристрою та регіону.',
      'Якщо встановлення доступне, скористайтеся кнопкою магазину й виконайте його підказки.',
      'Запустіть застосунок і почніть із коміксу або вправи свого рівня.'
    ],
    deviceQuestion: 'Яка версія Windows потрібна?',
    deviceAnswer: 'Актуальні системні вимоги наведено на сторінці Learning Norwegian у Microsoft Store. Перевірте їх перед встановленням: сумісність залежить від вашого пристрою та поточного випуску.',
    other: 'android', otherName: 'Android',
    session: 'Прочитайте короткий діалог, прослухайте репліки й повторіть їх уголос. Потім перегляньте незнайомі слова та пройдіть тест до історії. Так читання, слухання і повторення складаються в одне заняття.'
  },
  {
    slug: 'android', platform: 'Android', store: 'Google Play',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.bilohash.comiks',
    title: 'Завантажити Learning Norwegian для Android | Komiks·Lab',
    description: 'Learning Norwegian для Android: норвезькі комікси з озвученням, перекладом і вправами на телефоні. Перейдіть у Google Play та перегляньте, як встановити застосунок.',
    lead: 'Практикуйте норвезьку на телефоні або планшеті: читайте короткі історії, слухайте репліки та повторюйте слова. Відкрийте Learning Norwegian у Google Play, щоб перевірити сумісність і встановити застосунок для Android.',
    purpose: 'Норвезька у щоденному ритмі',
    purposeText: 'Поверніться до короткого діалогу, коли маєте час на навчання. Історії про знайомства, покупки, житло та роботу допомагають пов’язувати норвезькі слова зі звичними ситуаціями. Переклад підтримує розуміння, а озвучення дає змогу почути репліку ще раз.',
    steps: [
      'На телефоні або планшеті Android відкрийте сторінку Learning Norwegian у Google Play за кнопкою нижче.',
      'Перевірте в магазині сумісність із пристроєм та доступність для свого облікового запису й країни.',
      'Якщо встановлення доступне, натисніть відповідну кнопку в Google Play і дочекайтеся завершення.',
      'Відкрийте застосунок, оберіть комікс свого рівня та прослухайте перші репліки.'
    ],
    deviceQuestion: 'Чи підійде застосунок моєму телефону або планшету?',
    deviceAnswer: 'Google Play показує сумісність із вашим пристроєм. Перевірте інформацію на сторінці Learning Norwegian перед встановленням. Доступність може залежати від моделі пристрою, країни та етапу випуску.',
    other: 'windows', otherName: 'Windows',
    session: 'Оберіть коротку історію, прослухайте діалог і повторіть кілька реплік. Перегляньте переклад нових слів, а потім перевірте себе у вправах. До знайомої історії можна повернутися під час наступного заняття.'
  }
];
/* Same cream, yellow and ink palette, rounded cards and system font as PAGE_CSS
   in tools/build.js. Styles are self-contained so this generator also works alone. */
const CSS = `
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#fff8ea;color:#141414;font:17px/1.6 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}a{color:#1565c0;text-underline-offset:3px}a:focus-visible,summary:focus-visible{outline:3px solid #1565c0;outline-offset:5px}h1,h2,h3{line-height:1.18}h1{font-size:clamp(2rem,6vw,3.15rem);letter-spacing:-.035em;margin:.3em 0}h2{font-size:clamp(1.5rem,4vw,2rem);margin:0 0 .65em}h3{font-size:1.13rem;margin:0 0 .55em}p{margin:.7em 0 1em}header.top{background:#ffd23f;border-bottom:4px solid #141414;padding:13px max(16px,calc((100vw - 1060px)/2));display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}.brand{display:inline-flex;align-items:center;gap:10px;color:#141414;font-weight:900;font-size:1.25rem;text-decoration:none}.brand img{border-radius:8px}header nav{display:flex;gap:16px;flex-wrap:wrap;font-size:.94rem}main{max-width:1060px;margin:auto;padding:20px 20px 64px}.crumbs{font-size:.88rem;color:#555;margin:0 0 22px}.crumbs span{margin:0 6px}.hero{background:white;border:3px solid #141414;border-radius:24px;box-shadow:7px 7px 0 #141414;padding:clamp(22px,5vw,44px);display:grid;grid-template-columns:minmax(0,1fr) 120px;gap:18px}.hero .app-icon{width:112px;height:112px;border-radius:24px;align-self:start;margin-top:6px}.eyebrow{font-weight:800;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;margin:0}.lead{font-size:1.09rem;max-width:720px}.tags{display:flex;gap:8px;flex-wrap:wrap;list-style:none;margin:20px 0 12px;padding:0}.tags li{background:#fff8ea;border:1px solid #d5cbb9;border-radius:999px;padding:3px 10px;font-size:.85rem;font-weight:650}.actions{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin:20px 0 14px}.cta{display:inline-block;padding:13px 20px;border:3px solid #141414;border-radius:999px;background:#b72b24;color:#fff;font-weight:800;text-decoration:none;box-shadow:3px 3px 0 #141414;line-height:1.4}.cta:hover{background:#94221c}.note{font-size:.87rem;color:#555;margin-bottom:0}.section{margin-top:48px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.card{background:#fff;border:2px solid #141414;border-radius:16px;padding:22px}.card p{margin:0;color:#414141}.card .number{font-size:.8rem;font-weight:850;display:block;margin-bottom:10px;color:#755700}.steps{padding-left:24px}.steps li{padding-left:6px;margin:12px 0}.practice{background:#ffd23f;border:3px solid #141414;border-radius:18px;padding:26px}.practice p{margin-bottom:0}.faq details{border-bottom:1px solid #c9c1b3;padding:17px 0}.faq summary{cursor:pointer;font-weight:750}.faq p{max-width:850px;margin-bottom:0}.related{display:flex;gap:12px;flex-wrap:wrap;list-style:none;padding:0}.related a{display:block;background:#fff;border:2px solid #141414;border-radius:12px;padding:12px 16px;font-weight:650}footer{border-top:2px solid #141414;margin-top:42px;padding-top:22px;font-size:.88rem;color:#555}.skip{position:absolute;top:-120px;left:12px;background:white;padding:10px;z-index:2}.skip:focus{top:10px}.cta.android-test-trigger{cursor:pointer;font:inherit}.android-test-back{position:fixed;inset:0;z-index:20;background:#0008;display:grid;place-items:center;padding:16px}.android-test-back[hidden]{display:none}.android-test-form{width:min(540px,100%);max-height:92vh;overflow:auto;background:#fff8ea;border:3px solid #141414;border-radius:22px;box-shadow:7px 7px 0 #141414;padding:22px}.android-test-form h2{margin-top:0}.android-test-form input{width:100%;min-height:48px;box-sizing:border-box;border:2px solid #141414;border-radius:12px;padding:10px;font:inherit;font-size:16px}.android-cap{background:#fff;border:2px dashed #141414;border-radius:14px;padding:12px;margin:14px 0}.android-cap-options{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.android-cap-options button{min-width:58px;min-height:48px;border:2px solid #141414;border-radius:12px;background:#ffd23f;font:800 1.1rem system-ui;cursor:pointer}.android-cap-options button[aria-pressed="true"]{background:#1565c0;color:#fff}.android-msg{font-weight:700;color:#9d211b}.android-actions{display:flex;gap:10px;flex-wrap:wrap}.android-close{border:2px solid #141414;border-radius:999px;background:#fff;padding:11px 18px;font:700 1rem system-ui;cursor:pointer}@media(max-width:600px){main{padding:18px 16px 42px}.hero{grid-template-columns:1fr;padding:24px 20px;box-shadow:4px 4px 0 #141414}.hero .app-icon{display:none}.grid{grid-template-columns:1fr}.actions{align-items:flex-start;flex-direction:column}.cta{width:100%;text-align:center}.section{margin-top:36px}header.top{align-items:flex-start}header nav{gap:12px}.related{display:grid}.card{padding:20px}.practice{padding:22px}.android-actions{display:grid}.android-actions>*{width:100%;text-align:center}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;
function render(page, base) {
  const url = `${base}uk/download/${page.slug}/`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url + '#webpage', url, name: page.title, description: page.description, inLanguage: 'uk', mainEntity: { '@id': url + '#app' }, breadcrumb: { '@id': url + '#breadcrumbs' } },
      { '@type': 'SoftwareApplication', '@id': url + '#app', name: 'Learning Norwegian', url, description: page.description, applicationCategory: 'EducationalApplication', operatingSystem: page.platform, downloadUrl: page.storeUrl, image: base + 'icons/icon-512.png' },
      { '@type': 'BreadcrumbList', '@id': url + '#breadcrumbs', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Komiks·Lab', item: base },
        { '@type': 'ListItem', position: 2, name: `Learning Norwegian для ${page.platform}`, item: url }
      ] }
    ]
  };
  const androidGate = page.slug === 'android';
  const storeLink = androidGate ? `<button class="cta android-test-trigger" type="button">Отримати посилання для тесту в ${esc(page.store)}</button>` : `<a class="cta" href="${esc(page.storeUrl)}">Відкрити в ${esc(page.store)}</a>`;
  return `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:locale" content="uk_UA">
<meta property="og:site_name" content="Komiks·Lab">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${base}og-image.png">
<meta property="og:image:alt" content="Komiks·Lab — вивчення норвезької через комікси">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${base}og-image.png">
<link rel="icon" href="${base}icons/favicon.ico" sizes="16x16 32x32 48x48 256x256">
<link rel="apple-touch-icon" href="${base}icons/apple-touch-icon.png">
<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>
<style>${CSS}</style>
</head>
<body>
<a class="skip" href="#content">Перейти до вмісту</a>
<header class="top">
  <a class="brand" href="${base}"><img src="${base}icons/icon-128.png" width="36" height="36" alt="">Komiks·Lab</a>
  <nav aria-label="Основна навігація"><a href="${base}uk/komiks/">Комікси норвезькою</a><a href="${base}uk/download/${page.other}/">Для ${page.otherName}</a></nav>
</header>
<main id="content">
<nav class="crumbs" aria-label="Навігаційний ланцюжок"><a href="${base}">Komiks·Lab</a><span aria-hidden="true">/</span><span aria-current="page">Learning Norwegian для ${page.platform}</span></nav>
<section class="hero" aria-labelledby="page-title">
  <div>
    <p class="eyebrow">Застосунок для вивчення норвезької</p>
    <h1 id="page-title">Learning Norwegian для ${page.platform}</h1>
    <p class="lead">${page.lead}</p>
    <ul class="tags" aria-label="Навчальні матеріали"><li>Букмол</li><li>Рівні A1–B2</li><li>Комікси з озвученням</li><li>Переклад українською</li></ul>
    <div class="actions">${storeLink}<a href="${base}">Спробувати у браузері</a></div>
    <p class="note">Доступність залежить від країни та етапу випуску. Для онлайн-функцій потрібен інтернет.</p>
  </div>
  <img class="app-icon" src="${base}icons/icon-128.png" width="112" height="112" alt="Іконка Learning Norwegian">
</section>
<section class="section" aria-labelledby="learn-title">
  <h2 id="learn-title">Норвезька через історії та практику</h2>
  <p>Learning Norwegian — застосунок проєкту Komiks·Lab для вивчення норвезької мови, букмолу. Матеріали рівнів A1–B2 поєднують читання, слухання та вправи на теми повсякденного життя.</p>
  <div class="grid">
    <article class="card"><span class="number" aria-hidden="true">01 / ЧИТАЙТЕ</span><h3>Комікси про життя в Норвегії</h3><p>Короткі діалоги допомагають бачити слова в контексті. Український переклад підтримує розуміння фраз і сюжету.</p></article>
    <article class="card"><span class="number" aria-hidden="true">02 / СЛУХАЙТЕ</span><h3>Норвезьке озвучення</h3><p>Слухайте репліки персонажів, повертайтеся до них і повторюйте вголос, щоб практикувати сприйняття на слух.</p></article>
    <article class="card"><span class="number" aria-hidden="true">03 / РОЗБИРАЙТЕСЯ</span><h3>Слова та граматика</h3><p>Тематичний словник, пояснення й приклади допомагають розібрати нову лексику та будову норвезьких речень.</p></article>
    <article class="card"><span class="number" aria-hidden="true">04 / ПОВТОРЮЙТЕ</span><h3>Тести й навчальні вправи</h3><p>Закріплюйте прочитане за допомогою тестів, карток і вправ. Повертайтеся до матеріалів, які потребують повторення.</p></article>
  </div>
</section>
<section class="section" aria-labelledby="device-title"><h2 id="device-title">${page.purpose}</h2><p>${page.purposeText}</p></section>
<section class="section card" aria-labelledby="install-title">
  <h2 id="install-title">Як завантажити й встановити на ${page.platform}</h2>
  <ol class="steps">${page.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol>
  <div class="actions">${storeLink}</div>
  <p class="note">Умови встановлення та актуальні відомості про застосунок наведено в ${page.store}.</p>
</section>
<section class="section practice" aria-labelledby="practice-title"><h2 id="practice-title">Почніть з однієї історії</h2><p>${page.session}</p></section>
<section class="section faq" aria-labelledby="faq-title">
  <h2 id="faq-title">Запитання про застосунок для ${page.platform}</h2>
  <details open><summary>${page.deviceQuestion}</summary><p>${page.deviceAnswer}</p></details>
  <details><summary>Що робити, якщо магазин не пропонує встановлення?</summary><p>Перегляньте повідомлення магазину про регіон, пристрій або доступ до поточного випуску. Поки встановлення недоступне, можна <a href="${base}">відкрити Komiks·Lab у браузері</a>.</p></details>
  <details><summary>Чи потрібне підключення до інтернету?</summary><p>Для завантаження з магазину та онлайн-функцій потрібен інтернет. Не всі можливості доступні без мережі; доступний вміст залежить від версії застосунку.</p></details>
  <details><summary>Чи підходить Learning Norwegian початківцям?</summary><p>Так, почніть із матеріалів рівня A1: простих діалогів, базових слів і коротких вправ. Переклад українською допоможе розібрати зміст, а норвезьке озвучення — почути нові фрази.</p></details>
</section>
<section class="section" aria-labelledby="related-title">
  <h2 id="related-title">Продовжуйте навчання</h2>
  <ul class="related"><li><a href="${base}uk/komiks/">Комікси норвезькою A1–B2</a></li><li><a href="${base}uk/download/${page.other}/">Learning Norwegian для ${page.otherName}</a></li><li><a href="${base}#/install">Усі способи встановлення</a></li></ul>
</section>
<footer><p>Усі історії, персонажі, малюнки й озвучення вигадані та створені за допомогою ШІ.</p><p><a href="${base}privacy.html">Політика конфіденційності</a> · <a href="mailto:email@bilohash.com?subject=Learning%20Norwegian%20feedback">Зворотний зв’язок</a> · <a href="${base}">Komiks·Lab</a></p></footer>
</main>
${androidGate ? `<div class="android-test-back" id="android-test-back" hidden><form class="android-test-form" id="android-test-form">
<h2>🤖 Тестування Android-застосунку</h2><p>Введіть email і пройдіть коротку перевірку від спаму. Заявка збережеться у розробника, після чого відкриється посилання для тесту.</p>
<label><b>Email для тестування</b><input id="android-test-email" type="email" inputmode="email" autocomplete="email" placeholder="name@gmail.com" required></label>
<p class="note">Email використовується лише для доступу до тесту та відповіді на цю заявку.</p><div class="android-cap" id="android-test-cap" aria-live="polite">Завантаження перевірки…</div><p class="android-msg" id="android-test-msg" role="status" aria-live="polite"></p>
<div class="android-actions"><button class="cta" type="submit" id="android-test-send">Отримати посилання</button><button class="android-close" type="button" id="android-test-close">Закрити</button></div></form></div>
<script>(()=>{const api=${JSON.stringify(base + 'api/feedback.php')},target=${JSON.stringify(page.storeUrl)},back=document.getElementById('android-test-back'),form=document.getElementById('android-test-form'),email=document.getElementById('android-test-email'),capBox=document.getElementById('android-test-cap'),msg=document.getElementById('android-test-msg'),send=document.getElementById('android-test-send');let cap=null,answer=null;const close=()=>{back.hidden=true};const draw=()=>{if(!cap){capBox.textContent='Завантаження перевірки…';return}capBox.replaceChildren();const q=document.createElement('b');q.textContent='Скільки буде '+cap.q.a+' '+cap.q.op+' '+cap.q.b+'?';capBox.append(q);const opts=document.createElement('div');opts.className='android-cap-options';cap.opts.forEach(v=>{const b=document.createElement('button');b.type='button';b.textContent=v;b.setAttribute('aria-pressed',String(answer===v));b.onclick=()=>{answer=v;draw()};opts.append(b)});capBox.append(opts)};const load=()=>fetch(api+'?captcha=1',{cache:'no-store',credentials:'same-origin'}).then(r=>r.json()).then(j=>{cap=j&&j.ok?j:null;answer=null;draw()}).catch(()=>{cap=null;capBox.textContent='Не вдалося завантажити перевірку. Оновіть сторінку.'});document.querySelectorAll('.android-test-trigger').forEach(b=>b.addEventListener('click',()=>{back.hidden=false;msg.textContent='';email.focus();load()}));document.getElementById('android-test-close').onclick=close;back.addEventListener('click',e=>{if(e.target===back)close()});form.addEventListener('submit',async e=>{e.preventDefault();if(!email.reportValidity())return;if(!cap||answer==null){msg.textContent='Оберіть правильну відповідь.';return}send.disabled=true;msg.textContent='';try{const r=await fetch(api,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','X-Komiks':'1'},body:JSON.stringify({action:'send',kind:'android',text:'Android пристрій хоче посилання для тесту. Джерело: статична сторінка Android.',email:email.value.trim(),page:location.pathname,lang:'uk',token:cap.token,answer})}).then(x=>x.json());if(!r||!r.ok){msg.textContent=r&&r.error==='email'?'Перевірте адресу email.':r&&r.error==='captcha'?'Неправильна відповідь. Спробуйте ще раз.':'Не вдалося надіслати заявку.';if(r&&r.error==='captcha')load();return}form.innerHTML='<h2>✅ Заявку прийнято</h2><p>Тепер можна відкрити посилання для тестування Android-застосунку.</p><p><a class="cta" target="_blank" rel="noopener noreferrer" href="'+target.replace(/"/g,'&quot;')+'">Відкрити Google Play</a></p><button class="android-close" type="button">Закрити</button>';form.querySelector('button').onclick=close}catch(_){msg.textContent='Немає зв’язку із сервером.'}finally{send.disabled=false}})})();</script>` : ''}
</body>
</html>
`;
}
function writeDownloadPages({ outputDir, base }) {
  base = new URL(base).href.replace(/\/?$/, '/');
  const sitemapFile = path.join(outputDir, 'sitemap.xml');
  const sitemap = fs.readFileSync(sitemapFile, 'utf8');
  if (!/<urlset\b[^>]*\bxmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(sitemap) || !sitemap.includes('</urlset>')) {
    throw new Error('Expected a sitemap URL set before generating download pages');
  }
  const lastmod = new Date(Math.min(fs.statSync(__filename).mtimeMs, Date.now())).toISOString().slice(0, 10);
  const existing = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]));
  const entries = [];
  for (const page of PAGES) {
    const rel = `uk/download/${page.slug}/`;
    const dir = path.join(outputDir, rel);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), render(page, base), 'utf8');
    const url = base + rel;
    if (!existing.has(url)) entries.push(`  <url><loc>${esc(url)}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`);
  }
  if (entries.length) fs.writeFileSync(sitemapFile, sitemap.replace('</urlset>', entries.join('\n') + '\n</urlset>'), 'utf8');
  console.log(`✔ Download pages: Windows + Android · ${entries.length} sitemap entries added`);
}
module.exports = writeDownloadPages;
if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const site = JSON.parse(fs.readFileSync(path.join(__dirname, 'site.json'), 'utf8'));
  writeDownloadPages({ outputDir: path.join(root, 'dist'), base: site.siteUrl });
}
