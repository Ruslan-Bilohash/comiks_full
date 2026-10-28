const fs = require('fs');
const path = require('path');

module.exports = function buildKodingSeo({ DIST, base, comics, today }) {
  const esc = value => String(value == null ? '' : value).replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]));
  const lessons = new Map((comics || []).map(c => [c.id, c]));
  const TRACK_KEY = { foundations:'foundations', basics:'foundations', web:'web', game:'game', blender:'blender', unity:'unity', data:'databases', 'personal-safety':'personalSafety', 'cyber-safety':'cyberSafety', 'scam-awareness':'scamAwareness', 'device-safety':'deviceSafety', 'secure-coding':'secureCoding', hackers:'hackers' };
  const ids = Object.fromEntries([...new Set(Object.values(TRACK_KEY))].map(k => [k, []]));
  for (const c of comics || []) {
    const key = TRACK_KEY[c.track || 'foundations'];
    if (c.category === 'koding' && key) ids[key].push(c.id);
  }
  const languages = [
    { name: 'Scratch', use: { en:'visual programming, first algorithms and games', nb:'visuell programmering, de første algoritmene og spillene', uk:'візуальне програмування, перші алгоритми та ігри' }, age: '7–11' },
    { name: 'Python', use: { en:'first text programs, data, automation and AI', nb:'de første tekstprogrammene, data, automatisering og KI', uk:'перші текстові програми, дані, автоматизація та ШІ' }, age: '10+' },
    { name: 'HTML', use: { en:'the structure and content of web pages', nb:'struktur og innhold på nettsider', uk:'структура та вміст вебсторінок' }, age: '9+' },
    { name: 'CSS', use: { en:'colours, layout and responsive web design', nb:'farger, oppsett og responsivt webdesign', uk:'кольори, верстка й адаптивний вебдизайн' }, age: '9+' },
    { name: 'JavaScript', use: { en:'interactive websites and browser games', nb:'interaktive nettsider og nettleserspill', uk:'інтерактивні сайти та браузерні ігри' }, age: '10+' },
    { name: 'C#', use: { en:'games and interactive projects in Unity', nb:'spill og interaktive prosjekter i Unity', uk:'ігри та інтерактивні проєкти в Unity' }, age: '12+' },
    { name: 'SQL', use: { en:'asking, sorting and updating data in databases', nb:'spørring, sortering og oppdatering av data i databaser', uk:'пошук, сортування й оновлення даних у базах' }, age: '12+' },
    { name: 'Swift', use: { en:'apps for iPhone, iPad and Apple platforms', nb:'apper for iPhone, iPad og Apple-plattformer', uk:'застосунки для iPhone, iPad та платформ Apple' }, age: '12+' },
    { name: 'Kotlin', use: { en:'Android apps and modern server programs', nb:'Android-apper og moderne serverprogrammer', uk:'Android-застосунки та сучасні серверні програми' }, age: '12+' },
  ];
  const local = {
    en: {
      html:'en', hl:'en', locale:'en_GB', root:'coding-for-kids', flag:'English',
      title:'Coding for Kids: Programming Basics, Languages and Projects | Komiks·Lab',
      desc:'Free coding course for kids: algorithms, loops, HTML, CSS, JavaScript, game development, Blender, Unity, databases and SQL in comics and quizzes.',
      h1:'Coding for kids — learn by building', intro:'A free visual course that explains programming concepts in plain language. Children read short comics, see each idea in action and check their understanding with a quiz.',
      open:'Open the interactive coding course', tracks:'Learning paths', concepts:'Programming and safety concepts children will understand', conceptsText:'Commands, algorithms, loops, conditions, debugging, web and game development, databases, personal safety, phishing, scams, CAPTCHA, validation, HTTPS, password hashing and data privacy.',
      langH:'Which programming language is used for what?', langIntro:'There is no single “best” language. The right choice depends on the project and the child’s age.',
      table:['Language or tool','What it is used for','Suggested start'], lessons:'Comic lessons and quizzes', read:'Read comic', quiz:'Take quiz', home:'Coding for kids', app:'Interactive course', free:'Free online learning resource for children, families and schools.',
      faq:[['What should a child learn first?','Start with sequences, algorithms, loops and conditions. A visual tool such as Scratch makes these ideas tangible before text syntax.'],['Which language is best for a beginner?','Scratch is friendly for younger children; Python is a clear first text language. HTML, CSS and JavaScript are ideal when the goal is a website.'],['Can children learn game development here?','Yes. The lessons introduce scenes, player controls, collisions, scoring, Unity GameObjects and reusable prefabs.'],['Is the course free?','Yes. The comics, quizzes and learning paths open in the browser without payment.']],
      track: {
        foundations:['foundations','Programming foundations for children','Understand commands, algorithms, loops, conditions, variables, bugs, programming languages and models.','Algorithms, computational thinking, loops, conditions, variables, debugging, programming languages'],
        web:['web','HTML, CSS and JavaScript for kids','Build a first web page and learn how structure, design and interaction work together.','HTML for kids, CSS for kids, JavaScript for kids, web development'],
        game:['game-development','Game development basics for kids','Plan a game scene, move a character, detect collisions, count points and test a prototype.','game development for kids, game design, collision, player controls, prototype'],
        blender:['blender-3d','Blender and 3D modelling for kids','Explore 3D space, axes, basic shapes, materials, light and a simple character model.','Blender for kids, 3D modelling, 3D objects, materials, lighting'],
        unity:['unity','Unity for kids: first game objects','Understand scenes, GameObjects, components and prefabs through visual stories.','Unity for kids, C#, GameObject, components, prefab, game engine'],
        databases:['databases','Databases and SQL for kids','Learn tables, rows, fields, SQL queries, safe data handling and privacy.','databases for kids, SQL for beginners, tables, queries, data privacy'],
        personalSafety:['everyday-safety','Everyday safety for children','Practise safe routes, trusted-adult rules, what to do when lost and how to call 112.','child safety, trusted adults, stranger safety, getting lost, emergency number 112'],
        cyberSafety:['online-safety','Online safety for children','Use strong passwords and learn to spot phishing, unsafe QR codes and private details in photos.','online safety for kids, strong passwords, phishing, QR code safety, digital footprint'],
        scamAwareness:['spot-scams','Help children spot scams','Recognise fake prizes, cloned voices, marketplace fraud and impersonation before sharing or paying.','scam awareness for children, fake prize, voice cloning, marketplace fraud, fake profile'],
        deviceSafety:['device-safety','Device safety for children','Manage app permissions, official updates, public Wi-Fi and reliable backups.','device safety for kids, app permissions, security updates, public Wi-Fi, backups'],
        secureCoding:['secure-coding','Secure coding for children','Understand CAPTCHA, server-side validation, HTTPS and safe password hashing through visual stories.','secure coding for kids, CAPTCHA, input validation, HTTPS, password hashing'],
        hackers:['hackers-cyber-defence','Hackers and cyber defence for children','Understand ethical security work, social engineering, account theft, ransomware, extortion and recovery.','hackers explained for kids, cyber defence, social engineering, ransomware, account security'],
      },
    },
    no: {
      html:'nb', hl:'nb', locale:'nb_NO', root:'no/programmering-for-barn', flag:'Norsk',
      title:'Programmering for barn: grunnleggende koding, språk og prosjekter | Komiks·Lab',
      desc:'Gratis programmeringskurs for barn med algoritmer, HTML, CSS, JavaScript, spillutvikling, Blender, Unity, databaser og SQL i tegneserier og tester.',
      h1:'Programmering for barn — lær ved å skape', intro:'Et gratis visuelt kurs som forklarer programmering med enkle ord. Barn leser korte tegneserier, ser hvordan begrepene virker og sjekker forståelsen i en test.',
      open:'Åpne det interaktive kodekurset', tracks:'Læringsstier', concepts:'Programmering og sikkerhet barna lærer', conceptsText:'Kommandoer, algoritmer, løkker, vilkår, feilsøking, web, spill, databaser, personlig sikkerhet, nettfisking, svindel, CAPTCHA, validering, HTTPS, passordhashing og personvern.',
      langH:'Hvilket programmeringsspråk brukes til hva?', langIntro:'Det finnes ikke ett språk som er best til alt. Velg etter prosjektet og barnets alder.',
      table:['Språk eller verktøy','Hva brukes det til?','Passer fra'], lessons:'Tegneserier og tester', read:'Les tegneserien', quiz:'Ta testen', home:'Programmering for barn', app:'Interaktivt kurs', free:'Gratis nettressurs for barn, familier og skoler.',
      faq:[['Hva bør et barn lære først?','Start med rekkefølge, algoritmer, løkker og vilkår. Scratch gjør ideene synlige før barnet møter tekstsyntaks.'],['Hvilket språk passer for nybegynnere?','Scratch passer yngre barn, mens Python er et tydelig første tekstspråk. HTML, CSS og JavaScript passer når målet er en nettside.'],['Kan barn lære spillutvikling her?','Ja. Løypa forklarer scener, styring, kollisjoner, poeng, Unity GameObjects og prefabs.'],['Er kurset gratis?','Ja. Tegneserier, tester og læringsstier åpnes gratis i nettleseren.']],
      track: {
        foundations:['grunnlag','Grunnleggende programmering for barn','Lær kommandoer, algoritmer, løkker, vilkår, variabler, feil, språk og modeller.','programmering for barn, algoritmer, løkker, vilkår, variabler, feilsøking'],
        web:['web','HTML, CSS og JavaScript for barn','Lag en første nettside og se hvordan struktur, design og interaksjon virker sammen.','HTML for barn, CSS for barn, JavaScript for barn, webutvikling'],
        game:['spillutvikling','Grunnleggende spillutvikling for barn','Planlegg en scene, styr en figur, finn kollisjoner, tell poeng og test en prototype.','spillutvikling for barn, spilldesign, kollisjon, styring, prototype'],
        blender:['blender-3d','Blender og 3D-modellering for barn','Utforsk 3D-rom, akser, former, materialer, lys og en enkel figurmodell.','Blender for barn, 3D-modellering, 3D-objekter, materialer, lys'],
        unity:['unity','Unity for barn: de første spillobjektene','Forstå scener, GameObjects, komponenter og prefabs gjennom visuelle historier.','Unity for barn, C#, GameObject, komponenter, prefab, spillmotor'],
        databases:['databaser','Databaser og SQL for barn','Lær tabeller, rader, felt, SQL-spørringer, trygg databruk og personvern.','databaser for barn, SQL for nybegynnere, tabeller, spørringer, personvern'],
        personalSafety:['trygg-hverdag','Trygg hverdag for barn','Øv på trygg skolevei, trygge voksne, hva du gjør når du går deg bort og når du ringer 112.','sikkerhet for barn, trygge voksne, fremmede, gå seg bort, nødnummer 112'],
        cyberSafety:['nettsikkerhet','Nettsikkerhet for barn','Bruk sterke passord og lær å avsløre nettfisking, usikre QR-koder og private detaljer i bilder.','nettsikkerhet for barn, sterke passord, nettfisking, QR-kode, digitalt fotavtrykk'],
        scamAwareness:['avslor-svindel','Lær barn å avsløre svindel','Kjenn igjen falske premier, klonede stemmer, markedsplassvindel og falske profiler.','svindel mot barn, falsk premie, klonet stemme, markedsplass, falsk profil'],
        deviceSafety:['enhetssikkerhet','Sikre telefon og datamaskin','Styr apptillatelser, offisielle oppdateringer, offentlig Wi-Fi og pålitelige sikkerhetskopier.','enhetssikkerhet for barn, apptillatelser, oppdateringer, offentlig Wi-Fi, backup'],
        secureCoding:['sikker-programmering','Sikker programmering for barn','Forstå CAPTCHA, validering på serveren, HTTPS og trygg passordhashing i visuelle historier.','sikker programmering for barn, CAPTCHA, validering, HTTPS, passordhashing'],
        hackers:['hackere-cybervern','Hackere og cybervern for barn','Forstå etisk sikkerhetsarbeid, sosial manipulering, kontotyveri, løsepengevirus, utpressing og gjenoppretting.','hackere forklart for barn, cybervern, sosial manipulering, løsepengevirus, kontosikkerhet'],
      },
    },
    uk: {
      html:'uk', hl:'uk', locale:'uk_UA', root:'uk/programuvannya-dlya-ditey', flag:'Українська',
      title:'Програмування для дітей: основи, мови та практичні проєкти | Komiks·Lab',
      desc:'Безкоштовне програмування для дітей: алгоритми, HTML, CSS, JavaScript, створення ігор, Blender, Unity, бази даних і SQL у коміксах та тестах.',
      h1:'Програмування для дітей — навчайся, створюючи', intro:'Безкоштовний наочний курс пояснює поняття програмування простими словами. Діти читають короткі комікси, бачать ідею в дії та перевіряють знання в тесті.',
      open:'Відкрити інтерактивний курс', tracks:'Напрями навчання', concepts:'Програмування й безпека, які зрозуміє дитина', conceptsText:'Команди, алгоритми, цикли, умови, налагодження, веб, ігри, бази даних, особиста безпека, фішинг, шахрайство, CAPTCHA, валідація, HTTPS, хешування паролів і приватність.',
      langH:'Яка мова програмування для чого створена?', langIntro:'Однієї найкращої мови немає. Вибір залежить від проєкту та віку дитини.',
      table:['Мова або інструмент','Для чого використовують','Вік для старту'], lessons:'Навчальні комікси й тести', read:'Читати комікс', quiz:'Пройти тест', home:'Програмування для дітей', app:'Інтерактивний курс', free:'Безкоштовний онлайн-ресурс для дітей, родин і шкіл.',
      faq:[['З чого дитині почати програмування?','Почніть із послідовностей, алгоритмів, циклів та умов. Scratch допомагає побачити ці ідеї до знайомства з текстовим кодом.'],['Яка мова найкраща для початківця?','Scratch зручний для молодших дітей, Python — зрозуміла перша текстова мова. HTML, CSS і JavaScript підходять для створення сайтів.'],['Чи можна тут вивчати створення ігор?','Так. Уроки пояснюють сцени, керування, зіткнення, бали, Unity GameObject і повторне використання префабів.'],['Курс безкоштовний?','Так. Комікси, тести й навчальні напрями доступні в браузері без оплати.']],
      track: {
        foundations:['osnovy','Основи програмування для дітей','Зрозумійте команди, алгоритми, цикли, умови, змінні, помилки, мови та моделі.','основи програмування для дітей, алгоритми, цикли, умови, змінні, налагодження'],
        web:['veb','HTML, CSS і JavaScript для дітей','Створіть першу вебсторінку та дізнайтеся, як разом працюють структура, дизайн і взаємодія.','HTML для дітей, CSS для дітей, JavaScript для дітей, веброзробка'],
        game:['rozrobka-igor','Основи розробки ігор для дітей','Сплануйте сцену, керуйте героєм, знаходьте зіткнення, рахуйте бали й тестуйте прототип.','розробка ігор для дітей, геймдизайн, зіткнення, керування, прототип'],
        blender:['blender-3d','Blender і 3D-моделювання для дітей','Дослідіть 3D-простір, осі, базові форми, матеріали, світло та просту модель героя.','Blender для дітей, 3D-моделювання, 3D-об’єкти, матеріали, світло'],
        unity:['unity','Unity для дітей: перші ігрові об’єкти','Зрозумійте сцени, GameObject, компоненти й префаби за допомогою наочних історій.','Unity для дітей, C#, GameObject, компоненти, префаб, ігровий рушій'],
        databases:['bazy-danyh','Бази даних і SQL для дітей','Вивчіть таблиці, записи, поля, SQL-запити, безпечну роботу з даними та приватність.','бази даних для дітей, SQL для початківців, таблиці, запити, захист даних'],
        personalSafety:['bezpeka-v-zhytti','Особиста безпека для дітей','Вивчіть безпечну дорогу, правила з незнайомцями, дії при втраті дорослих і дзвінок 112.','безпека дітей, незнайомці, надійні дорослі, дитина загубилася, номер 112'],
        cyberSafety:['bezpeka-onlain','Безпека дітей онлайн','Створюйте надійні паролі та розпізнавайте фішинг, небезпечні QR-коди й приватні деталі на фото.','безпека дітей онлайн, надійні паролі, фішинг, QR-коди, цифровий слід'],
        scamAwareness:['rozpiznavannia-shakhraistva','Як дітям розпізнати шахрайство','Розпізнавайте фальшиві призи, клоновані голоси, шахрайські оголошення та профілі.','шахрайство для дітей, фальшивий приз, клонування голосу, фальшивий профіль'],
        deviceSafety:['zakhyst-prystroiv','Захист телефону й комп’ютера','Керуйте дозволами, офіційними оновленнями, відкритим Wi-Fi та резервними копіями.','захист пристроїв для дітей, дозволи застосунків, оновлення, відкритий Wi-Fi, резервні копії'],
        secureCoding:['bezpechne-programuvannia','Безпечне програмування для дітей','Зрозумійте CAPTCHA, серверну валідацію, HTTPS і безпечне хешування паролів через комікси.','безпечне програмування для дітей, CAPTCHA, валідація, HTTPS, хешування паролів'],
        hackers:['khakery-kiberzakhyst','Хакери та кіберзахист для дітей','Зрозумійте етичну кібербезпеку, соціальну інженерію, викрадення акаунтів, віруси-вимагачі, шантаж і відновлення.','хакери для дітей, кіберзахист, соціальна інженерія, віруси-вимагачі, захист акаунтів'],
      },
    },
  };
  const locales = Object.values(local);
  const byCode = Object.fromEntries(locales.map(L => [L.hl, L]));
  const keyUrl = (L, key) => `${base}${L.root}/${key === 'hub' ? '' : L.track[key][0] + '/'}`;
  const comicUrl = (L, id) => `${base}${L.hl === 'uk' ? 'uk/' : L.hl === 'nb' ? 'no/' : ''}komiks/${id}/`;
  const alternateLinks = key => locales.map(L => `<link rel="alternate" hreflang="${L.hl}" href="${keyUrl(L,key)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${keyUrl(byCode.en,key)}">`;
  const alternateNav = key => locales.map(L => `<a hreflang="${L.hl}" href="${keyUrl(L,key)}">${L.flag}</a>`).join(' · ');
  const entries = [];
  const org = { '@type':'Organization', name:'Komiks·Lab', url:base };
  const style = `body{margin:0;background:#fff8ea;color:#171717;font:17px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif}a{color:#0759a8}header{background:#ffd23f;border-bottom:4px solid #171717;padding:13px max(16px,calc((100% - 1040px)/2));display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}header b{font-size:1.2rem}main{max-width:1040px;margin:auto;padding:24px 16px 64px}h1{font-size:clamp(2rem,6vw,3.5rem);line-height:1.05;max-width:850px}h2{margin-top:2em}.lead{font-size:1.2rem;max-width:800px}.cta{display:inline-block;background:#ee4035;color:#fff;border:3px solid #171717;border-radius:14px;box-shadow:4px 4px 0 #171717;padding:12px 18px;font-weight:900;text-decoration:none}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px}.card{background:#fff;border:3px solid #171717;border-radius:18px;padding:16px}.card h3{margin-top:0}.tag{display:inline-block;background:#171717;color:#ffd23f;border-radius:999px;padding:2px 10px;font-weight:800;font-size:.85rem}table{width:100%;border-collapse:collapse;background:#fff;border:3px solid #171717}th,td{padding:10px;border-bottom:1px solid #ddd;text-align:left}.crumbs{font-size:.9rem}footer{margin-top:40px;color:#555}@media(max-width:600px){table{font-size:.88rem}th,td{padding:7px 5px}}`;

  function shell(L, key, title, desc, keywords, body, schema) {
    const url = keyUrl(L, key);
    return `<!doctype html><html lang="${L.html}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><meta name="keywords" content="${esc(keywords)}"><link rel="canonical" href="${url}">${alternateLinks(key)}<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}og-image.png"><meta property="og:locale" content="${L.locale}"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="${base}icons/favicon.ico">${schema.map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('')}<style>${style}</style></head><body><header><b>🧩 Komiks·Lab</b><nav>${alternateNav(key)} · <a href="${base}#/koding">${esc(L.app)}</a></nav></header><main>${body}<footer>${esc(L.free)} · <a href="${base}">Komiks·Lab</a></footer></main></body></html>`;
  }

  for (const L of locales) {
    const trackCards = Object.entries(L.track).map(([key, t]) => `<article class="card"><span class="tag">${ids[key].length} ${esc(L.lessons.toLowerCase())}</span><h3><a href="${keyUrl(L,key)}">${esc(t[1])}</a></h3><p>${esc(t[2])}</p></article>`).join('');
    const langRows = languages.map(x => `<tr><th>${esc(x.name)}</th><td>${esc(x.use[L.hl])}</td><td>${esc(x.age)}</td></tr>`).join('');
    const faqHtml = L.faq.map(x => `<details class="card"><summary><b>${esc(x[0])}</b></summary><p>${esc(x[1])}</p></details>`).join('');
    const hubUrl = keyUrl(L,'hub');
    const allKeywords = ['coding for kids','programming for children','programmering for barn','програмування для дітей','algorithms','Scratch','Python','HTML','CSS','JavaScript','game development','Blender','Unity','C#','databases','SQL','child safety','online safety','phishing','scam awareness','CAPTCHA','HTTPS','secure coding','password hashing','coding lessons','coding quizzes'].join(', ');
    const courses = Object.entries(L.track).map(([key,t], i) => ({ '@type':'Course', name:t[1], description:t[2], url:keyUrl(L,key), provider:org, educationalLevel:'Beginner to intermediate', inLanguage:L.html, position:i+1 }));
    const schema = [
      { '@context':'https://schema.org', '@type':'Course', name:L.h1, description:L.desc, url:hubUrl, provider:org, inLanguage:L.html, isAccessibleForFree:true, educationalLevel:'Children, beginner to intermediate', teaches:L.conceptsText, hasCourseInstance:{ '@type':'CourseInstance', courseMode:'online', courseWorkload:'PT20M', inLanguage:L.html } },
      { '@context':'https://schema.org', '@type':'ItemList', name:L.tracks, numberOfItems:courses.length, itemListElement:courses.map((c,i) => ({ '@type':'ListItem', position:i+1, url:c.url, item:c })) },
      { '@context':'https://schema.org', '@type':'FAQPage', mainEntity:L.faq.map(x => ({ '@type':'Question', name:x[0], acceptedAnswer:{ '@type':'Answer', text:x[1] } })) },
      { '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:[{ '@type':'ListItem', position:1, name:'Komiks·Lab', item:base },{ '@type':'ListItem', position:2, name:L.home, item:hubUrl }] },
    ];
    const body = `<p class="crumbs"><a href="${base}">Komiks·Lab</a> › ${esc(L.home)}</p><h1>${esc(L.h1)}</h1><p class="lead">${esc(L.intro)}</p><p><a class="cta" href="${base}#/koding">🚀 ${esc(L.open)}</a></p><h2>${esc(L.tracks)}</h2><div class="grid">${trackCards}</div><section class="card"><h2>${esc(L.concepts)}</h2><p>${esc(L.conceptsText)}</p></section><h2>${esc(L.langH)}</h2><p>${esc(L.langIntro)}</p><table><thead><tr>${L.table.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${langRows}</tbody></table><h2>FAQ</h2>${faqHtml}`;
    const dir = path.join(DIST, ...L.root.split('/')); fs.mkdirSync(dir,{recursive:true});
    fs.writeFileSync(path.join(dir,'index.html'), shell(L,'hub',L.title,L.desc,allKeywords,body,schema),'utf8');
    entries.push({ lang:L.hl, key:'hub', url:hubUrl });

    for (const [key,t] of Object.entries(L.track)) {
      const list = ids[key].map(id => lessons.get(id)).filter(Boolean);
      const lessonHtml = list.map(c => {
        const title = L.hl === 'uk' ? (c.titleUk || c.title) : L.hl === 'en' ? (c.titleEn || c.title) : c.title;
        const summary = L.hl === 'uk' ? (c.summaryUk || '') : L.hl === 'en' ? (c.summaryEn || '') : (c.summaryNo || '');
        return `<article class="card"><span class="tag">${esc(c.level || '')}</span><h3><a href="${comicUrl(L,c.id)}">${esc(title)}</a></h3><p>${esc(summary)}</p><p><a href="${base}#/read/${c.id}/0">📖 ${esc(L.read)}</a> · <a href="${base}#/quiz/${c.id}">🧩 ${esc(L.quiz)}</a></p></article>`;
      }).join('');
      const url = keyUrl(L,key);
      const keywords = `${t[3]}, coding for kids, programming concepts, coding lessons, Komiks Lab`;
      const pageTitle = `${t[1]} | Komiks·Lab`;
      const schemaTrack = [
        { '@context':'https://schema.org', '@type':'Course', name:t[1], description:t[2], url, provider:org, inLanguage:L.html, isAccessibleForFree:true, educationalLevel:'Children, beginner to intermediate', teaches:t[3], hasCourseInstance:{ '@type':'CourseInstance', courseMode:'online', inLanguage:L.html } },
        { '@context':'https://schema.org', '@type':'LearningResource', name:t[1], description:t[2], url, inLanguage:L.html, isAccessibleForFree:true, learningResourceType:['Comic lesson','Quiz'], educationalLevel:'Children, beginner to intermediate', teaches:t[3], keywords:t[3] },
        { '@context':'https://schema.org', '@type':'ItemList', name:L.lessons, numberOfItems:list.length, itemListElement:list.map((c,i)=>({ '@type':'ListItem', position:i+1, url:comicUrl(L,c.id), name:L.hl==='uk'?(c.titleUk||c.title):L.hl==='en'?(c.titleEn||c.title):c.title })) },
        { '@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement:[{ '@type':'ListItem', position:1, name:'Komiks·Lab', item:base },{ '@type':'ListItem', position:2, name:L.home, item:hubUrl },{ '@type':'ListItem', position:3, name:t[1], item:url }] },
      ];
      const trackBody = `<p class="crumbs"><a href="${base}">Komiks·Lab</a> › <a href="${hubUrl}">${esc(L.home)}</a> › ${esc(t[1])}</p><h1>${esc(t[1])}</h1><p class="lead">${esc(t[2])}</p><section class="card"><h2>${esc(L.concepts)}</h2><p>${esc(t[3])}</p></section><p><a class="cta" href="${base}#/koding">🚀 ${esc(L.open)}</a></p><h2>${esc(L.lessons)}</h2><div class="grid">${lessonHtml}</div><h2>${esc(L.tracks)}</h2><div class="grid">${Object.entries(L.track).filter(([k])=>k!==key).map(([k,x])=>`<a class="card" href="${keyUrl(L,k)}"><b>${esc(x[1])}</b></a>`).join('')}</div>`;
      const outDir = path.join(DIST, ...L.root.split('/'), t[0]); fs.mkdirSync(outDir,{recursive:true});
      fs.writeFileSync(path.join(outDir,'index.html'), shell(L,key,pageTitle,`${t[2]} ${L.free}`.slice(0,160),keywords,trackBody,schemaTrack),'utf8');
      entries.push({ lang:L.hl, key, url });
    }
  }
  const byKey = Object.groupBy(entries, x => x.key);
  for (const e of entries) e.alternates = byKey[e.key].map(x => ({ lang:x.lang, url:x.url })).concat([{lang:'x-default',url:byKey[e.key].find(x=>x.lang==='en').url}]);
  console.log(`✔ coding SEO: ${entries.length} сторінок (${locales.length} мови × ${Object.keys(locales[0].track).length + 1})`);
  return { entries, today };
};
