/* Комікс·Lab — 💻 Програмування для дітей (#/koding, #/quiz/koding[/<тип>]).
   Комікси категорії «koding» (p183–p190) + нові типи завдань, завжди норвезькою з підказкою при наведенні:
   robot   — поле з роботом: куди він прийде / яка програма веде до зірки (генерується щоразу нове);
   code    — «що виведе програма»: псевдокод норвезькою, для старших — Python;
   algo    — розстав кроки алгоритму в правильному порядку;
   bug     — один крок програми хибний: знайди його;
   lang    — мови програмування й для чого вони;
   concept — питання з самих коміксів (поле tasks). */
(() => {
  'use strict';
  const K = () => window.KomiksCore;
  const TYPES = new Set(['robot', 'code', 'algo', 'bug', 'lang', 'html', 'concept']);

  /* ---------- тексти сторінки ---------- */
  const T = {
    uk: {
      nav: 'Програмування', title: '💻 Програмування для дітей',
      intro: 'Комікси з роботом Робо й тести, де треба керувати роботом, читати маленькі програми, складати алгоритми й шукати помилки. Усе норвезькою — переклад при наведенні.',
      what_t: 'Що таке програмування?',
      what: 'Програмування — це коли ми даємо комп’ютеру точні команди. Програма — це команди в правильному порядку. Комп’ютер не здогадується, що ми мали на увазі: він робить рівно те, що написано.',
      ideas_t: 'Головні ідеї', langs_t: 'Мови програмування: що для чого', kids: 'для початку',
      comics_t: 'Комікси', tests_t: 'Тести', read: 'Читати', test: 'Тест',
      game: 'Гра: Robo вчиться кодити', t_mix: '🎲 Усе разом', t_robot: '🤖 Керуй роботом', t_code: '💻 Що виведе програма?', t_algo: '🧩 Алгоритми', t_bug: '🐞 Знайди помилку', t_lang: '🗂️ Мови програмування', t_html: '🌐 HTML: як виглядатиме сторінка?', d_html: 'теги, заголовок, картинка, посилання',
      d_mix: 'усі типи завдань', d_robot: 'стрілки на полі', d_code: 'псевдокод і Python', d_algo: 'кроки по порядку', d_bug: 'налагодження', d_lang: 'що для чого',
      tip: 'Порада для батьків і вчителів: спершу прочитайте комікс, потім пройдіть тест цього коміксу, а наприкінці — «Усе разом».'
    },
    en: {
      nav: 'Coding', title: '💻 Coding for kids',
      intro: 'Comics with Robo the robot and tests where you steer a robot, read tiny programs, build algorithms and hunt for bugs. Everything is in Norwegian — hover for a translation.',
      what_t: 'What is coding?',
      what: 'Coding means giving a computer exact commands. A program is commands in the right order. The computer does not guess what we meant: it does exactly what is written.',
      ideas_t: 'Big ideas', langs_t: 'Programming languages: what is each for?', kids: 'to start with',
      comics_t: 'Comics', tests_t: 'Tests', read: 'Read', test: 'Test',
      game: 'Game: Robo learns to code', t_mix: '🎲 Everything', t_robot: '🤖 Steer the robot', t_code: '💻 What does it print?', t_algo: '🧩 Algorithms', t_bug: '🐞 Find the bug', t_lang: '🗂️ Programming languages', t_html: '🌐 HTML: what will the page look like?', d_html: 'tags, heading, image, link',
      d_mix: 'all task types', d_robot: 'arrows on a grid', d_code: 'pseudocode and Python', d_algo: 'steps in order', d_bug: 'debugging', d_lang: 'what each is for',
      tip: 'Tip for parents and teachers: read a comic first, then take that comic’s test, and finish with “Everything”.'
    },
    no: {
      nav: 'Programmering', title: '💻 Programmering for barn',
      intro: 'Tegneserier med roboten Robo og tester der du styrer en robot, leser små programmer, lager algoritmer og finner feil. Alt er på norsk – hold over teksten for oversettelse.',
      what_t: 'Hva er programmering?',
      what: 'Programmering er å gi datamaskinen nøyaktige kommandoer. Et program er kommandoer i riktig rekkefølge. Datamaskinen gjetter ikke hva vi mente: den gjør nøyaktig det som står.',
      ideas_t: 'De viktigste ideene', langs_t: 'Programmeringsspråk: hva brukes de til?', kids: 'fint å starte med',
      comics_t: 'Tegneserier', tests_t: 'Tester', read: 'Les', test: 'Test',
      game: 'Spill: Robo lærer å kode', t_mix: '🎲 Alt sammen', t_robot: '🤖 Styr roboten', t_code: '💻 Hva skriver programmet?', t_algo: '🧩 Algoritmer', t_bug: '🐞 Finn feilen', t_lang: '🗂️ Programmeringsspråk', t_html: '🌐 HTML: hvordan ser siden ut?', d_html: 'tagger, overskrift, bilde, lenke',
      d_mix: 'alle oppgavetyper', d_robot: 'piler på et rutenett', d_code: 'pseudokode og Python', d_algo: 'steg i riktig rekkefølge', d_bug: 'feilsøking', d_lang: 'hva brukes de til',
      tip: 'Tips til foreldre og lærere: les en tegneserie først, ta testen til tegneserien, og avslutt med «Alt sammen».'
    }
  };
  if (window.KL_T_FILL) KL_T_FILL(T, 'koding.js:T');
  const tx = k => { const ui = (K() && K().ui) || 'uk'; return (T[ui] || T.en)[k] ?? T.en[k]; };

  /* ---------- зміст: ідеї, мови, алгоритми ---------- */
  // [норвезький термін (як у vocab коміксу), uk, en, пояснення uk, en, no, комікс]
  const IDEAS = [
    ['en kommando', 'команда', 'a command', 'Коротке точне доручення: «іди», «повернись».', 'A short, exact instruction: “walk”, “turn”.', 'En kort, nøyaktig beskjed: «gå», «snu».', 'p183'],
    ['en algoritme', 'алгоритм', 'an algorithm', 'Кроки в правильному порядку — як рецепт.', 'Steps in the right order — like a recipe.', 'Steg i riktig rekkefølge – som en oppskrift.', 'p184'],
    ['ei løkke', 'цикл', 'a loop', 'Повторює команди: «повтори 4 рази».', 'Repeats commands: “repeat 4 times”.', 'Gjentar kommandoer: «gjenta 4 ganger».', 'p185'],
    ['hvis', 'якщо', 'if', 'Умова: якщо дощ — парасолька, інакше — окуляри.', 'A condition: if it rains — umbrella, otherwise — sunglasses.', 'En betingelse: hvis det regner – paraply, ellers – solbriller.', 'p186'],
    ['en variabel', 'змінна', 'a variable', 'Коробка з назвою, де лежить значення: poeng = 3.', 'A box with a name that holds a value: points = 3.', 'En boks med et navn og en verdi: poeng = 3.', 'p187'],
    ['en bug', 'баг', 'a bug', 'Помилка в програмі. Шукаємо її рядок за рядком.', 'An error in a program. We hunt for it line by line.', 'En feil i programmet. Vi leter linje for linje.', 'p188'],
    ['et programmeringsspråk', 'мова програмування', 'a programming language', 'Мова, якою ми пишемо програми: Scratch, Python…', 'The language we write programs in: Scratch, Python…', 'Språket vi skriver programmer på: Scratch, Python …', 'p189'],
    ['ei tagg', 'тег', 'a tag', 'HTML-слово в кутових дужках: <p> … </p>. Закривальний тег має скісну риску.', 'An HTML word in angle brackets: <p> … </p>. The end tag has a slash.', 'Et HTML-ord i spisse klammer: <p> … </p>. Slutt-taggen har en skråstrek.', 'p191'],
    ['en modell', 'модель', 'a model', 'Спрощена копія справжнього: мапа, план гри.', 'A simple copy of something real: a map, a game plan.', 'En enkel kopi av noe ekte: et kart, en plan for et spill.', 'p190']
  ];
  // [мова, для чого no, uk, en, іконка, для початку]
  const LANGS = [
    ['Scratch', 'fargerike blokker for barn', 'кольорові блоки для дітей', 'colourful blocks for children', '🧩', true],
    ['Python', 'enkel kode, data og kunstig intelligens', 'простий код, дані й штучний інтелект', 'simple code, data and AI', '🐍', true],
    ['JavaScript', 'nettsider som beveger seg', 'живі сайти, що рухаються', 'web pages that move', '⚡', false],
    ['HTML', 'bygger nettsider', 'будує вебсторінки', 'builds web pages', '🧱', true],
    ['CSS', 'gjør nettsider fine', 'робить сайти гарними', 'makes web pages pretty', '🎨', false],
    ['Swift', 'apper til iPhone', 'застосунки для iPhone', 'iPhone apps', '🍏', false],
    ['Kotlin', 'apper til Android', 'застосунки для Android', 'Android apps', '🤖', false],
    ['C#', 'spill, for eksempel i Unity', 'ігри, наприклад у Unity', 'games, for example in Unity', '🎮', false],
    ['SQL', 'databaser: lagre og finne data', 'бази даних: зберігати й шукати дані', 'databases: store and find data', '🗄️', false]
  ];
  const ALGOS = [
    { no: 'Plant en blomst', uk: 'Посади квітку', en: 'Plant a flower', steps: [['Grav et hull', 'Викопай ямку', 'Dig a hole'], ['Legg frøet i hullet', 'Поклади насінину в ямку', 'Put the seed in the hole'], ['Dekk frøet med jord', 'Присип землею', 'Cover the seed with soil'], ['Vann frøet', 'Полий', 'Water the seed']] },
    { no: 'Ta på skoene', uk: 'Взуй черевики', en: 'Put on your shoes', steps: [['Finn skoene', 'Знайди черевики', 'Find the shoes'], ['Sett deg ned', 'Сядь', 'Sit down'], ['Ta på skoene', 'Взуй черевики', 'Put on the shoes'], ['Knyt lissene', 'Зав’яжи шнурки', 'Tie the laces']] },
    { no: 'Lag te', uk: 'Зроби чай', en: 'Make tea', steps: [['Kok vann', 'Закип’яти воду', 'Boil water'], ['Legg teposen i koppen', 'Поклади пакетик у чашку', 'Put the tea bag in the cup'], ['Hell vann i koppen', 'Налий воду в чашку', 'Pour water into the cup'], ['Vent tre minutter', 'Зачекай три хвилини', 'Wait three minutes']] },
    { no: 'Gå over gata', uk: 'Перейди вулицю', en: 'Cross the street', steps: [['Stopp ved fortauet', 'Зупинись біля тротуару', 'Stop at the kerb'], ['Vent på grønt lys', 'Дочекайся зеленого', 'Wait for the green light'], ['Se til venstre og høyre', 'Подивись ліворуч і праворуч', 'Look left and right'], ['Gå over gata', 'Переходь вулицю', 'Cross the street']] },
    { no: 'Send en melding', uk: 'Надішли повідомлення', en: 'Send a message', steps: [['Åpne appen', 'Відкрий застосунок', 'Open the app'], ['Velg en venn', 'Вибери друга', 'Choose a friend'], ['Skriv meldingen', 'Напиши повідомлення', 'Write the message'], ['Trykk på «send»', 'Натисни «надіслати»', 'Press “send”']] },
    { no: 'Start et spill', uk: 'Запусти гру', en: 'Start a game', steps: [['Slå på datamaskinen', 'Увімкни комп’ютер', 'Turn on the computer'], ['Åpne spillet', 'Відкрий гру', 'Open the game'], ['Trykk på «start»', 'Натисни «старт»', 'Press “start”'], ['Spill og ha det gøy', 'Грай і веселись', 'Play and have fun']] }
  ];

  /* ---------- допоміжне ---------- */
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const uniqBy = (a, f) => { const s = new Set(); return a.filter(x => { const k = f(x); if (s.has(k)) return false; s.add(k); return true; }); };
  const tr3 = a => ({ no: a[0], uk: a[1], en: a[2] });
  const comicsK = () => (window.COMICS || []).filter(c => c.category === 'koding');
  const TRACKS = [
    { id: 'basics', icon: '🧠', name: { no: 'Grunnlag', uk: 'Основи', en: 'Foundations' }, desc: { no: 'Kommandoer, algoritmer, løkker og feil', uk: 'Команди, алгоритми, цикли й помилки', en: 'Commands, algorithms, loops and bugs' } },
    { id: 'web', icon: '🌐', name: { no: 'HTML og web', uk: 'HTML і веб', en: 'HTML and web' }, desc: { no: 'HTML, CSS og JavaScript', uk: 'HTML, CSS і JavaScript', en: 'HTML, CSS and JavaScript' } },
    { id: 'game', icon: '🎮', name: { no: 'Spillutvikling', uk: 'Розробка ігор', en: 'Game development' }, desc: { no: 'Figurer, styring, kollisjoner og poeng', uk: 'Персонажі, керування, зіткнення й бали', en: 'Characters, input, collisions and score' } },
    { id: 'blender', icon: '🧊', name: { no: '3D og Blender', uk: '3D і Blender', en: '3D and Blender' }, desc: { no: 'Former, modellering, materialer og lys', uk: 'Форми, моделювання, матеріали й світло', en: 'Shapes, modelling, materials and light' } },
    { id: 'unity', icon: '🚀', name: { no: 'Unity', uk: 'Unity', en: 'Unity' }, desc: { no: 'GameObjects, komponenter, scener og prefabs', uk: 'GameObject, компоненти, сцени й префаби', en: 'GameObjects, components, scenes and prefabs' } },
    { id: 'data', icon: '🗄️', name: { no: 'Databaser', uk: 'Бази даних', en: 'Databases' }, desc: { no: 'Tabeller, søk, SQL og trygg lagring', uk: 'Таблиці, пошук, SQL і безпечне зберігання', en: 'Tables, search, SQL and safe storage' } },
    { id: 'personal-safety', icon: '🚨', name: { no: 'Trygg i hverdagen', uk: 'Безпека в житті', en: 'Everyday safety' }, desc: { no: 'Trygge voksne, fremmede, å gå seg bort og 112', uk: 'Надійні дорослі, незнайомці, як не загубитися та 112', en: 'Trusted adults, strangers, getting lost and 112' } },
    { id: 'cyber-safety', icon: '🛡️', name: { no: 'Trygg på nettet', uk: 'Безпека онлайн', en: 'Online safety' }, desc: { no: 'Passord, nettfisking, QR-koder og private bilder', uk: 'Паролі, фішинг, QR-коди й приватні фото', en: 'Passwords, phishing, QR codes and private photos' } },
    { id: 'scam-awareness', icon: '🔎', name: { no: 'Avslør svindel', uk: 'Розпізнай шахрайство', en: 'Spot scams' }, desc: { no: 'Falske premier, stemmer, annonser og profiler', uk: 'Фальшиві призи, голоси, оголошення й профілі', en: 'Fake prizes, voices, listings and profiles' } },
    { id: 'device-safety', icon: '📱', name: { no: 'Sikre enheter', uk: 'Захист пристроїв', en: 'Secure devices' }, desc: { no: 'Tillatelser, oppdateringer, Wi-Fi og backup', uk: 'Дозволи, оновлення, Wi-Fi й резервні копії', en: 'Permissions, updates, Wi-Fi and backups' } },
    { id: 'secure-coding', icon: '🔐', name: { no: 'Sikker programmering', uk: 'Безпечне програмування', en: 'Secure coding' }, desc: { no: 'CAPTCHA, validering, HTTPS og passordhashing', uk: 'CAPTCHA, валідація, HTTPS і хешування паролів', en: 'CAPTCHA, validation, HTTPS and password hashing' } },
    { id: 'hackers', icon: '🕵️', name: { no: 'Hackere og cybervern', uk: 'Хакери та кіберзахист', en: 'Hackers and cyber defence' }, desc: { no: 'Etikk, datatyveri, utpressing, skadevare og hjelp', uk: 'Етика, крадіжка даних, шантаж, віруси та допомога', en: 'Ethics, data theft, extortion, malware and recovery' } }
  ];
  const trackOf = comic => comic.track || (/^p18[3-9]$|^p190$/.test(comic.id) ? 'basics' : comic.id === 'p191' ? 'web' : 'basics');

  /* ---------- 🤖 поле з роботом ---------- */
  const DIRS = { opp: [0, -1, '⬆', 'вгору', 'up'], ned: [0, 1, '⬇', 'вниз', 'down'], venstre: [-1, 0, '⬅', 'ліворуч', 'left'], 'høyre': [1, 0, '➡', 'праворуч', 'right'] };
  const same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
  function walk(n, start, prog, walls) {
    let [x, y] = start;
    for (const d of prog) {
      x += DIRS[d][0]; y += DIRS[d][1];
      if (x < 0 || y < 0 || x >= n || y >= n || walls.some(w => same(w, [x, y]))) return null;
    }
    return [x, y];
  }
  function genProg(n, start, len, walls) {
    for (let t = 0; t < 200; t++) {
      const p = Array.from({ length: len }, () => pick(Object.keys(DIRS)));
      // без «туди й назад» поспіль — інакше програма виглядає безглуздою
      if (p.some((d, i) => i && DIRS[d][0] === -DIRS[p[i - 1]][0] && DIRS[d][1] === -DIRS[p[i - 1]][1])) continue;
      const end = walk(n, start, p, walls);
      if (end && !same(end, start)) return { prog: p, end };
    }
    return null;
  }
  function gridSetup(kids) {
    const n = kids ? 4 : 5;
    const start = [rnd(n), rnd(n)];
    const walls = [];
    for (let i = 0; i < (kids ? 1 : 3); i++) { const w = [rnd(n), rnd(n)]; if (!same(w, start) && !walls.some(x => same(x, w))) walls.push(w); }
    return { n, start, walls };
  }
  function robotQ(kids, mode = pick(['where', 'which'])) {
    for (let t = 0; t < 50; t++) {
      const g = gridSetup(kids), len = kids ? 3 : 4 + rnd(2);
      const r = genProg(g.n, g.start, len, g.walls);
      if (!r) continue;
      if (mode === 'where') {
        // хибні клітинки: куди прийшов би робот, якби одна стрілка була інша
        const cand = [];
        for (let i = 0; i < r.prog.length; i++) for (const d of Object.keys(DIRS)) {
          const p = r.prog.slice(); p[i] = d; const e = walk(g.n, g.start, p, g.walls);
          if (e && !same(e, r.end) && !same(e, g.start)) cand.push(e);
        }
        const opts = uniqBy(shuffle(cand), e => e.join()).slice(0, kids ? 2 : 3);
        if (opts.length < (kids ? 2 : 3)) continue;
        return { type: 'robot', mode, ...g, prog: r.prog, answer: r.end.join(), options: shuffle([r.end, ...opts]).map(e => e.join()) };
      }
      const wrong = [];
      for (let i = 0; i < 60 && wrong.length < (kids ? 2 : 3); i++) {
        const p = r.prog.slice(); p[rnd(p.length)] = pick(Object.keys(DIRS));
        if (rnd(3) === 0 && p.length > 2) [p[0], p[1]] = [p[1], p[0]];
        const e = walk(g.n, g.start, p, g.walls);
        if (!same(e, r.end) && !wrong.some(w => w.join() === p.join())) wrong.push(p);
      }
      if (wrong.length < (kids ? 2 : 3)) continue;
      return { type: 'robot', mode, ...g, star: r.end, prog: r.prog, answer: r.prog.join(), options: shuffle([r.prog, ...wrong]).map(p => p.join()) };
    }
    return null;
  }
  function gridSVG({ n, start, walls = [], star = null, robotAt = null }, px) {
    const k = 40, W = n * k + 8;
    let s = `<svg viewBox="0 0 ${W} ${W}" width="${px}" height="${px}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="rutenett"><rect width="${W}" height="${W}" rx="12" fill="#1d2433"/>`;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) s += `<rect x="${4 + c * k + 1}" y="${4 + r * k + 1}" width="${k - 2}" height="${k - 2}" rx="7" fill="${(r + c) % 2 ? '#2b3a55' : '#34476d'}"/>`;
    const at = ([c, r]) => [4 + c * k + k / 2, 4 + r * k + k / 2];
    for (const w of walls) { const [x, y] = at(w); s += `<rect x="${x - 17}" y="${y - 17}" width="34" height="34" rx="4" fill="#a1887f"/><path d="M${x - 17},${y - 6} h34 M${x - 17},${y + 6} h34 M${x - 4},${y - 17} v11 M${x + 6},${y - 6} v12 M${x - 4},${y + 6} v11" stroke="#6d4c41" stroke-width="2"/>`; }
    if (star) { const [x, y] = at(star); s += `<text x="${x}" y="${y + 9}" text-anchor="middle" font-size="26">⭐</text>`; }
    const [rx, ry] = at(robotAt || start);
    s += `<text x="${rx}" y="${ry + 10}" text-anchor="middle" font-size="28">🤖</text>`;
    if (robotAt && !same(robotAt, start)) { const [sx, sy] = at(start); s += `<circle cx="${sx}" cy="${sy}" r="7" fill="none" stroke="#76ff03" stroke-width="3" stroke-dasharray="3 3"/>`; }
    return s + '</svg>';
  }

  /* ---------- 💻 «Що виведе програма?» ---------- */
  const CODE = {
    sum: () => { const a = 1 + rnd(6), b = 1 + rnd(5); return { lines: [`x = ${a}`, `x = x + ${b}`, 'skriv(x)'], answer: String(a + b), pool: [a, b, `${a}${b}`, a + b + 1, a + b - 1] }; },
    stars: () => { const n = 2 + rnd(4); return { ask: ['Hvor mange stjerner skriver programmet?', 'Скільки зірок виведе програма?', 'How many stars does the program print?'], lines: [`gjenta ${n} ganger:`, '    skriv("⭐")'], answer: String(n), pool: [1, n + 1, n - 1, n * 2] }; },
    loopadd: () => { const n = 2 + rnd(3), b = 2 + rnd(3); return { lines: ['poeng = 0', `gjenta ${n} ganger:`, `    poeng = poeng + ${b}`, 'skriv(poeng)'], answer: String(n * b), pool: [b, n + b, n * b + b, n] }; },
    cond: () => { const a = 4 + rnd(12), lim = 10; return { lines: [`alder = ${a}`, `hvis alder > ${lim}:`, '    skriv("stor")', 'ellers:', '    skriv("liten")'], answer: a > lim ? 'stor' : 'liten', pool: ['stor', 'liten', 'stor liten', 'ingenting'] }; },
    pyloop: () => { const n = 2 + rnd(4); return { ask: ['Hvor mange ganger skriver Python «Hei»?', 'Скільки разів Python виведе «Hei»?', 'How many times does Python print “Hei”?'], lines: ['# Python', `for i in range(${n}):`, '    print("Hei")'], answer: String(n), pool: [n - 1, n + 1, 1, n * 2] }; },
    pymul: () => { const a = 2 + rnd(5), b = 2 + rnd(4); return { lines: ['# Python', `a = ${a}`, `b = ${b}`, 'print(a * b)'], answer: String(a * b), pool: [a + b, `${a}${b}`, a * b + a, a * b - 1] }; },
    pyif: () => { const t = rnd(30); return { lines: ['# Python', `temp = ${t}`, 'if temp > 20:', '    print("varmt")', 'else:', '    print("kaldt")'], answer: t > 20 ? 'varmt' : 'kaldt', pool: ['varmt', 'kaldt', 'varmt kaldt', 'temp'] }; }
  };
  const CODE_SETS = { all: Object.keys(CODE), kids: ['sum', 'stars', 'cond', 'loopadd'], loop: ['stars', 'loopadd', 'pyloop'], cond: ['cond', 'pyif'], var: ['sum', 'loopadd', 'pymul'] };
  function codeQ(kids, set = 'all') {
    const keys = kids && set === 'all' ? CODE_SETS.kids : CODE_SETS[set] || CODE_SETS.all;
    const g = CODE[pick(keys)]();
    const n = kids ? 3 : 4;
    const wrong = uniqBy(shuffle(g.pool.map(String)), x => x).filter(x => x !== g.answer && !/^-/.test(x) && x !== '0').slice(0, n - 1);
    return { type: 'code', lines: g.lines, ask: g.ask || ['Hva skriver programmet?', 'Що виведе програма?', 'What does the program print?'], answer: g.answer, options: shuffle([g.answer, ...wrong]) };
  }

  /* ---------- 🧩 алгоритм і 🐞 помилка ---------- */
  const algoPool = () => [...ALGOS, ...comicsK().flatMap(c => (c.tasks || []).filter(t => t.type === 'algo'))];
  const algoQ = a => ({ type: 'algo', task: a, answer: a.steps.map(s => s[0]).join(' → ') });
  function bugQ(kids) {
    const pool = algoPool(), a = pick(pool);
    const other = pick(pool.filter(x => x !== a));
    const i = rnd(a.steps.length), wrongStep = pick(other.steps);
    const steps = a.steps.slice(); steps[i] = wrongStep;
    return { type: 'bug', task: a, steps, answer: i, options: steps.map((_, k) => k), kids };
  }
  /* ---------- 🗂️ мови ---------- */
  function langQ(kids) {
    const L = pick(LANGS), n = kids ? 3 : 4;
    const others = shuffle(LANGS.filter(x => x !== L)).slice(0, n - 1);
    if (rnd(2)) return { type: 'lang', ask: [`Hva bruker vi ${L[0]} til?`, `Для чого використовують ${L[0]}?`, `What do we use ${L[0]} for?`], answer: L[1], options: shuffle([L, ...others]).map(x => x[1]), mode: 'use', table: LANGS };
    return { type: 'lang', ask: [`Hvilket språk bruker vi til: ${L[1]}?`, `Яку мову використовують для: ${L[2]}?`, `Which language do we use for: ${L[3]}?`], answer: L[0], options: shuffle([L, ...others]).map(x => x[0]), mode: 'name', table: LANGS };
  }
  const conceptQs = c => (c.tasks || []).filter(t => t.type === 'concept').map(t => ({ type: 'concept', c, ask: t.q, answer: t.answer[0], options: shuffle([t.answer, ...t.wrong]).map(x => x[0]), table: [t.answer, ...t.wrong] }));

  /* ---------- 🌐 HTML: як виглядатиме сторінка / закривальний тег / який тег що робить ---------- */
  const HT = { h1: ['<h1>', 'en overskrift', 'заголовок', 'a heading'], p: ['<p>', 'et avsnitt', 'абзац', 'a paragraph'], img: ['<img>', 'et bilde', 'картинку', 'an image'],
    a: ['<a>', 'en lenke', 'посилання', 'a link'], ul: ['<ul>', 'en liste', 'список', 'a list'], button: ['<button>', 'en knapp', 'кнопку', 'a button'] };
  const PAGES = [['Pus', '🐱'], ['Robo', '🤖'], ['Nora', '👧'], ['Fotball', '⚽'], ['Is', '🍦'], ['Skolen', '🏫'], ['Hytta', '🏡']];
  const htmlLine = (it, name) => ({ h1: `<h1>${it.x}</h1>`, p: `<p>${it.x}</p>`, img: `<img src="${name.toLowerCase()}.png">`, a: `<a href="mer.html">${it.x}</a>`, btn: `<button>${it.x}</button>` })[it.t];
  function htmlQ(kids, mode = pick(['preview', 'preview', 'close', 'which'])) {
    if (mode === 'preview') {
      const [name, emo] = pick(PAGES);
      const mk = t => ({ h1: { t, x: name }, p: { t, x: `${name} er fin.` }, img: { t, x: emo }, a: { t, x: 'Les mer' }, btn: { t, x: 'Klikk!' } })[t];
      const items = ['h1', ...shuffle(['p', 'img', 'a', 'btn']).slice(0, kids ? 1 : 2)].map(mk);
      if (!kids && rnd(3) === 0) [items[0], items[1]] = [items[1], items[0]];
      const wrong = [];
      const add = v => { if (JSON.stringify(v) !== JSON.stringify(items) && !wrong.some(w => JSON.stringify(w) === JSON.stringify(v))) wrong.push(v); };
      add(items.map(it => (it.t === 'h1' ? { t: 'p', x: it.x } : it)));                       // overskrift blir vanlig tekst
      if (items.length > 1) { const v = items.slice(); [v[0], v[1]] = [v[1], v[0]]; add(v); }  // feil rekkefølge
      add(items.slice(0, -1));                                                                 // et element mangler
      const o = pick(PAGES.filter(x => x[0] !== name)); add(items.map(it => (it.t === 'img' ? { t: 'img', x: o[1] } : it.t === 'h1' ? { t: 'h1', x: o[0] } : it)));
      const opts = shuffle([items, ...shuffle(wrong).slice(0, kids ? 2 : 3)]);
      return { type: 'html', mode, lines: items.map(it => htmlLine(it, name)), url: name.toLowerCase() + '.html', answer: JSON.stringify(items), options: opts.map(x => JSON.stringify(x)) };
    }
    if (mode === 'close') {
      const t = pick(['p', 'h1', 'a', 'li', 'b']), other = pick(['p', 'h1', 'a', 'li', 'b'].filter(x => x !== t));
      return { type: 'html', mode, lines: [`<${t}>Hei!`, '???'], answer: `</${t}>`, options: shuffle([`</${t}>`, ...shuffle([`<${t}>`, `<\\${t}>`, `</${other}>`]).slice(0, kids ? 2 : 3)]) };
    }
    const keys = Object.keys(HT), k = pick(keys);
    const others = shuffle(keys.filter(x => x !== k)).slice(0, kids ? 2 : 3);
    return { type: 'html', mode: 'which', ask: [`Hvilken tagg lager ${HT[k][1]}?`, `Який тег робить ${HT[k][2]}?`, `Which tag makes ${HT[k][3]}?`], answer: HT[k][0], options: shuffle([k, ...others]).map(x => HT[x][0]) };
  }
  const browserSVG = (items, url, px) => `<svg viewBox="-92 -133 184 137" width="${px}" height="${Math.round(px * 137 / 184)}" xmlns="http://www.w3.org/2000/svg" role="img">${K().ART.propRaw('browser', { items, url, w: 176, h: 128 })}</svg>`;

  /* ---------- набори питань ---------- */
  const PLAN = { p183: ['robot', 'algo'], p184: ['bug', 'robot'], p185: ['code:loop', 'code:loop'], p186: ['code:cond', 'robot'], p187: ['code:var', 'code:var'], p188: ['bug', 'robot'], p189: ['lang', 'lang', 'lang'], p190: ['lang', 'bug'], p191: ['html', 'html', 'html'] };
  function make(kind, kids) {
    const [t, sub] = kind.split(':');
    if (t === 'robot') return robotQ(kids);
    if (t === 'code') return codeQ(kids, sub || (kids ? 'kids' : 'all'));
    if (t === 'algo') return algoQ(pick(algoPool()));
    if (t === 'bug') return bugQ(kids);
    if (t === 'lang') return langQ(kids);
    if (t === 'html') return htmlQ(kids, sub);
    return null;
  }
  function questions(c, kids) {
    ensureQNO();
    const own = [...conceptQs(c), ...(c.tasks || []).filter(t => t.type === 'algo').map(algoQ)];
    return [...own, ...(PLAN[c.id] || ['robot', 'code']).map(k => make(k, kids))].filter(Boolean);
  }
  function quiz(arg, kids, size) {
    ensureQNO();
    const n = size || 10;
    if (TYPES.has(arg) && arg !== 'concept') {
      const out = [];
      if (arg === 'algo') return shuffle(algoPool()).slice(0, n).map(algoQ);
      for (let i = 0; i < n * 2 && out.length < n; i++) { const q = make(arg, kids); if (q) out.push(q); }
      return out;
    }
    const kinds = ['robot', 'robot', 'code', 'code', 'algo', 'bug', 'lang', 'html'];
    const out = shuffle(comicsK().flatMap(conceptQs)).slice(0, Math.ceil(n / 4));
    for (let i = 0; out.length < n && i < n * 3; i++) { const q = make(kinds[i % kinds.length], kids); if (q) out.push(q); }
    return shuffle(out);
  }

  /* ---------- заголовки завдань (норвезькою) і їхні переклади ---------- */
  const QT = {
    robot: ['Styr roboten', '🤖 Robot', 'Керуй роботом', 'Steer the robot'],
    code: ['Les koden', '💻 Kode', 'Прочитай код', 'Read the code'],
    algo: ['Sett stegene i riktig rekkefølge', '🧩 Algoritme', 'Розстав кроки в правильному порядку', 'Put the steps in the right order'],
    bug: ['Finn feilen i programmet', '🐞 Feilsøking', 'Знайди помилку в програмі', 'Find the bug in the program'],
    lang: ['Programmeringsspråk', '🗂️ Språk', 'Мови програмування', 'Programming languages'],
    html: ['Les HTML-koden', '🌐 HTML', 'Прочитай HTML-код', 'Read the HTML code'],
    concept: ['Hva vet du om koding?', '💡 Koding', 'Що ти знаєш про програмування?', 'What do you know about coding?']
  };
  const HINT = {
    where: ['Følg pilene. Hvor står roboten til slutt?', 'Пройди за стрілками. Де опиниться робот?', 'Follow the arrows. Where does the robot end up?'],
    which: ['Hvilket program fører roboten til stjerna uten å treffe en vegg?', 'Яка програма приведе робота до зірки, не врізавшись у стіну?', 'Which program takes the robot to the star without hitting a wall?'],
    algo: ['Trykk på stegene i riktig rekkefølge. Trykk på et steg i svaret for å ta det bort.', 'Натискай кроки по порядку. Натисни крок у відповіді, щоб прибрати його.', 'Tap the steps in order. Tap a step in the answer to remove it.'],
    bug: ['Ett steg er feil. Hvilket?', 'Один крок хибний. Який?', 'One step is wrong. Which one?'],
    check: ['Sjekk', 'Перевірити', 'Check'], clear: ['↩️ Start på nytt', 'Почати знову', 'Start again']
  };
  let qnoDone = false;
  function ensureQNO() {
    if (qnoDone || !K()) return;
    qnoDone = true;
    for (const [k, v] of Object.entries(QT)) K().QNO[k] = [v[0], v[1]];
    const I = window.I18N || {};
    for (const [k, v] of Object.entries(QT)) {
      if (I.uk) (I.uk.qtr = I.uk.qtr || {})[k] = v[2];
      if (I.en) (I.en.qtr = I.en.qtr || {})[k] = v[3];
    }
  }

  /* ---------- малювання завдання в runQuiz ---------- */
  function render(q, body, api) {
    const { h, withTr, svgEl } = K(), { choice, feedback } = api;
    const grid = (g, px, cls = '') => h('div', { class: 'kd-grid ' + cls }, svgEl(gridSVG(g, px)));
    const say3 = (a, cls = 'p') => withTr(h(cls, {}, a[0]), { uk: a[1], en: a[2] });
    if (q.type === 'robot') {
      const progRow = p => h('div', { class: 'kd-prog' }, p.map(d => withTr(h('span', { class: 'kd-arrow' }, h('b', {}, DIRS[d][2]), h('small', {}, d)), { uk: DIRS[d][3], en: DIRS[d][4] })));
      if (q.mode === 'where') {
        body.append(h('div', { class: 'q-prompt kd-prompt' }, grid(q, 220), say3(HINT.where, 'p'), progRow(q.prog)),
          choice(q.options, k => grid({ ...q, robotAt: k.split(',').map(Number) }, 120, 'sm'), k => k === q.answer,
            grid({ ...q, robotAt: q.answer.split(',').map(Number) }, 72, 'xs'), null, 'pics kd-pics'));
      } else {
        body.append(h('div', { class: 'q-prompt kd-prompt' }, grid(q, 220), say3(HINT.which, 'p')),
          choice(q.options, k => progRow(k.split(',')), k => k === q.answer, h('span', {}, q.prog.map(d => DIRS[d][2]).join(' ')), null, 'kd-progs'));
      }
      return;
    }
    if (q.type === 'html') {
      if (q.mode === 'preview') {
        const view = (s, px) => h('div', { class: 'kd-grid kd-web' }, svgEl(browserSVG(JSON.parse(s), q.url, px)));
        body.append(h('div', { class: 'q-prompt kd-prompt' }, codeBlock(q.lines, q.url), say3(['Hvordan ser nettsiden ut?', 'Як виглядатиме сторінка?', 'What will the web page look like?'], 'p')),
          choice(q.options, s => view(s, 200), s => s === q.answer, view(q.answer, 120), null, 'pics kd-pics'));
      } else if (q.mode === 'close') {
        body.append(h('div', { class: 'q-prompt kd-prompt' }, codeBlock(q.lines, 'side.html'), say3(['Hvilken slutt-tagg mangler?', 'Якого закривального тегу бракує?', 'Which end tag is missing?'], 'p')),
          choice(q.options, o => h('span', { class: 'kd-out' }, o), o => o === q.answer, q.answer, null, 'kd-outs'));
      } else {
        body.append(h('div', { class: 'q-prompt kd-prompt' }, say3(q.ask, 'p')),
          choice(q.options, o => h('span', { class: 'kd-out' }, o), o => o === q.answer, q.answer, null, 'kd-outs'));
      }
      return;
    }
    if (q.type === 'code') {
      body.append(h('div', { class: 'q-prompt kd-prompt' }, codeBlock(q.lines), say3(q.ask, 'p')),
        choice(q.options, o => h('span', { class: 'kd-out' }, o), o => o === q.answer, q.answer, null, 'kd-outs', q.answer));
      return;
    }
    if (q.type === 'lang' || q.type === 'concept') {
      const trOf = o => { const row = q.table.find(x => (q.type === 'lang' && q.mode === 'name' ? x[0] : q.type === 'lang' ? x[1] : x[0]) === o); return row ? (q.type === 'lang' ? (q.mode === 'name' ? null : { uk: row[2], en: row[3] }) : { uk: row[1], en: row[2] }) : null; };
      const icon = o => { if (q.type !== 'lang' || q.mode !== 'name') return null; const row = q.table.find(x => x[0] === o); return row ? h('span', { class: 'kd-ic' }, row[4]) : null; };
      body.append(h('div', { class: 'q-prompt kd-prompt' }, say3(q.ask, 'p')),
        choice(q.options, o => withTr(h('span', {}, icon(o), ' ', o), trOf(o)), o => o === q.answer, q.answer, null, '', q.answer));
      return;
    }
    if (q.type === 'bug') {
      body.append(h('div', { class: 'q-prompt kd-prompt' }, say3([q.task.no, q.task.uk, q.task.en], 'h4'), say3(HINT.bug, 'p')),
        choice(q.options, i => [h('span', { class: 'kd-ln' }, String(i + 1)), withTr(h('span', {}, q.steps[i][0]), { uk: q.steps[i][1], en: q.steps[i][2] })], i => i === q.answer,
          `${q.answer + 1}. ${q.steps[q.answer][0]} → ${q.task.steps[q.answer][0]}`, null, 'kd-lines'));
      return;
    }
    if (q.type === 'algo') {
      const steps = q.task.steps, picked = [];
      const out = h('ol', { class: 'kd-algo-out' }), bank = h('div', { class: 'kd-algo-bank' });
      const order = shuffle(steps.map((_, i) => i));
      if (order.every((v, i) => v === i)) order.reverse();
      const draw = () => {
        out.replaceChildren(...picked.map((i, k) => h('li', {}, h('button', { class: 'kd-step on', type: 'button', onclick: () => { if (out.classList.contains('locked')) return; picked.splice(k, 1); draw(); } }, steps[i][0]))));
        bank.replaceChildren(...order.filter(i => !picked.includes(i)).map(i => withTr(h('button', { class: 'kd-step', type: 'button', onclick: () => {
          if (out.classList.contains('locked')) return;
          picked.push(i); K().Sfx.tick(); draw();
          if (picked.length === steps.length) check();
        } }, steps[i][0]), { uk: steps[i][1], en: steps[i][2] })));
      };
      const check = () => {
        out.classList.add('locked');
        const ok = picked.every((v, i) => v === i);
        out.classList.add(ok ? 'good' : 'bad');
        feedback(ok, steps.map((s, i) => `${i + 1}. ${s[0]}`).join('  '), null, null);
      };
      body.append(h('div', { class: 'q-prompt kd-prompt' }, say3([q.task.no, q.task.uk, q.task.en], 'h4'), say3(HINT.algo, 'p')), out, bank,
        h('div', { class: 'row-center' }, withTr(h('button', { class: 'btn', type: 'button', onclick: () => { if (!out.classList.contains('locked')) { picked.length = 0; draw(); } } }, HINT.clear[0]), { uk: HINT.clear[1], en: HINT.clear[2] })));
      draw();
    }
  }
  // рядки коду з простим підсвічуванням: ключові слова, числа, рядки
  function codeBlock(lines, file = 'program.kode') {
    const { h } = K();
    const KW = /^(gjenta|ganger|hvis|ellers|skriv|for|in|range|print|if|else)$/;
    const line = s => {
      const parts = s.match(/("[^"]*"|#.*$|<\/?[A-Za-z0-9!]+|>|\d+|[A-Za-zæøåÆØÅ_]+|\s+|.)/g) || [];
      return h('div', { class: 'kd-cl' }, parts.map(p => /^<|^>$/.test(p) ? h('span', { class: 'kd-t' }, p) : /^"/.test(p) ? h('span', { class: 'kd-s' }, p) : /^#/.test(p) ? h('span', { class: 'kd-c' }, p) : /^\d+$/.test(p) ? h('span', { class: 'kd-n' }, p) : KW.test(p) ? h('span', { class: 'kd-k' }, p) : p));
    };
    return h('pre', { class: 'kd-code', dir: 'ltr' }, h('div', { class: 'kd-bar' }, h('i'), h('i'), h('i'), h('small', {}, file)), lines.map(line));
  }

  /* ---------- 🎮 картка гри, 🧭 кодоподорож і 🏅 значки (сторінка #/koding) ---------- */
  const HX = {
    uk: { game_t: '🤖 Гра: Robo вчиться кодити', game_d: 'Склади програму з блоків — і робот пройде лабіринт. 17 рівнів: команди, цикли, функції, баги й майстер-проба.', cont: n => `▶ Продовжити · рівень ${n}`, start: '▶ Почати гру', done: '🏆 Усі рівні пройдено', stars: (a, b) => `★ ${a} з ${b}`, lv: (a, b) => `Рівнів: ${a} з ${b}`,
      path_t: '🧭 Моя кодоподорож', path_d: 'Кожен комікс — крок: прочитай історію й пройди її тест. Зелене — готово.', progress: (a, b) => `Пройдено ${a} із ${b}`, all: 'Усі кроки', complete: 'Кодоподорож завершена!', mixed: '🎲 Підсумковий тест', read: 'прочитано', test: 'тест', badges_t: '🏅 Мої значки', got: n => `Зібрано ${n}`, rank: ['Новачок', 'Учень', 'Кодер', 'Програміст', 'Майстер коду'], rank_t: 'Твій рівень' },
    en: { game_t: '🤖 Game: Robo learns to code', game_d: 'Build a program from blocks and the robot walks the maze. 17 levels: commands, loops, functions, bugs and a master test.', cont: n => `▶ Continue · level ${n}`, start: '▶ Start the game', done: '🏆 All levels done', stars: (a, b) => `★ ${a} of ${b}`, lv: (a, b) => `Levels: ${a} of ${b}`,
      path_t: '🧭 My coding journey', path_d: 'Each comic is a step: read the story and pass its test. Green means done.', progress: (a, b) => `${a} of ${b} completed`, all: 'All steps', complete: 'Coding journey complete!', mixed: '🎲 Final mixed test', read: 'read', test: 'test', badges_t: '🏅 My badges', got: n => `Collected ${n}`, rank: ['Beginner', 'Learner', 'Coder', 'Programmer', 'Code master'], rank_t: 'Your rank' },
    no: { game_t: '🤖 Spill: Robo lærer å kode', game_d: 'Lag et program av blokker, så går roboten gjennom labyrinten. 17 nivåer: kommandoer, løkker, funksjoner, bugs og en mesterprøve.', cont: n => `▶ Fortsett · nivå ${n}`, start: '▶ Start spillet', done: '🏆 Alle nivåene er klare', stars: (a, b) => `★ ${a} av ${b}`, lv: (a, b) => `Nivåer: ${a} av ${b}`,
      path_t: '🧭 Min kodereise', path_d: 'Hver tegneserie er et steg: les historien og ta testen. Grønt er ferdig.', progress: (a, b) => `${a} av ${b} fullført`, all: 'Vis alle steg', complete: 'Kodereisen er fullført!', mixed: '🎲 Avsluttende test', read: 'lest', test: 'test', badges_t: '🏅 Merkene mine', got: n => `Samlet ${n}`, rank: ['Nybegynner', 'Elev', 'Koder', 'Programmerer', 'Kodemester'], rank_t: 'Nivået ditt' }
  };
  if (window.KL_T_FILL) KL_T_FILL(HX, 'koding.js:HX');
  const hx = (k, ...a) => { const ui = (K() && K().ui) || 'uk'; const v = (HX[ui] || HX.en)[k] ?? HX.en[k]; return typeof v === 'function' ? v(...a) : v; };
  // значки: [іконка, назва no, uk, en, умова]
  const BADGES = [
    ['👣', 'Første program', 'Перша програма', 'First program', s => s.g.done >= 1],
    ['🔁', 'Løkkemester', 'Майстер циклів', 'Loop master', s => s.g.chapters[2]],
    ['🧩', 'Funksjonsprofi', 'Профі функцій', 'Function pro', s => s.g.chapters[3]],
    ['🐞', 'Feilsøker', 'Мисливець на баги', 'Bug hunter', s => s.g.chapters[4]],
    ['🏆', 'Kodemester', 'Майстер коду', 'Code master', s => s.g.chapters[5]],
    ['⭐', 'Perfekt', 'Ідеально', 'Perfect', s => s.g.perfect],
    ['📚', 'Leseorm', 'Книголюб', 'Bookworm', s => s.read >= s.comics],
    ['🧠', 'Testhelt', 'Герой тестів', 'Test hero', s => s.tested >= s.comics],
    ['🌐', 'HTML-helt', 'Герой HTML', 'HTML hero', s => s.stars('p191') >= 2],
    ['🗂️', 'Språkkjenner', 'Знавець мов', 'Language expert', s => s.stars('p189') >= 2 || s.stars('koding:lang') >= 2],
    ['🛡️', 'Nettvokter', 'Захисник мережі', 'Online guardian', s => s.stars('p209') >= 2],
    ['🚨', 'Sikkerhetshelt', 'Герой безпеки', 'Safety hero', s => s.stars('p207') >= 2],
    ['🤖', 'CAPTCHA-kjenner', 'Знавець CAPTCHA', 'CAPTCHA expert', s => s.stars('p220') >= 2]
  ];
  function journeyModel(items) {
    const steps = (items || []).map((item, index) => {
      const done = !!item.read && Number(item.stars) > 0;
      const started = done || !!item.read || Number(item.stars) > 0;
      return { ...item, index, state: done ? 'done' : started ? 'started' : 'todo', active: false };
    });
    const done = steps.filter(step => step.state === 'done').length;
    const complete = steps.length > 0 && done === steps.length;
    let activeIndex = steps.findIndex(step => step.state !== 'done');
    if (activeIndex < 0 && steps.length) activeIndex = steps.length - 1;
    if (activeIndex >= 0) steps[activeIndex].active = true;
    return { steps, done, total: steps.length, activeIndex, complete };
  }
  function curriculumModel(items) {
    const source = items || [];
    const tracks = TRACKS.map(def => {
      const journey = journeyModel(source.filter(item => trackOf(item.comic || item) === def.id));
      return { ...def, ...journey, journey };
    });
    const total = tracks.reduce((sum, track) => sum + track.total, 0);
    const done = tracks.reduce((sum, track) => sum + track.done, 0);
    return { tracks, total, done, complete: total > 0 && done === total };
  }
  function hubState() {
    const C = K(), st = C.store;
    const prog = st.get('progress', {}) || {};
    const stars = key => ((prog[key] || {}).stars) || 0;
    const list = comicsK();
    const isRead = c => (st.get('seen.' + c.id, []) || []).length >= c.panels.length;
    const g = window.KomiksKodeGame ? window.KomiksKodeGame.progress() : { stars: 0, max: 0, done: 0, total: 0, next: 0, chapters: {}, perfect: false };
    const s = { g, stars, comics: list.length, read: list.filter(isRead).length, tested: list.filter(c => stars(c.id) > 0).length, isRead };
    const items = list.map(comic => ({ id: comic.id, comic, read: isRead(comic), stars: stars(comic.id) }));
    s.journey = journeyModel(items);
    s.curriculum = curriculumModel(items);
    s.badges = BADGES.map(b => ({ b, on: !!b[4](s) }));
    const pts = s.read + s.tested * 2 + g.done * 2 + s.badges.filter(x => x.on).length * 3;
    s.rank = Math.min(4, Math.floor(pts / 14));
    s.pts = pts;
    return s;
  }
  function gameCard(s) {
    const C = K(), { h, svgEl } = C;
    if (!window.KomiksKodeGame) return null;
    const g = s.g, href = '#/koding/spill' + (g.next ? '/' + g.next : '');
    const robo = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6v8" stroke="#141414" stroke-width="3"/><circle cx="32" cy="6" r="4" fill="#ff5252" stroke="#141414" stroke-width="2"/><rect x="10" y="14" width="44" height="34" rx="10" fill="#4dd0e1" stroke="#141414" stroke-width="3"/><rect x="16" y="20" width="32" height="20" rx="6" fill="#102027"/><path d="M21 31q3-5 6 0M37 31q3-5 6 0" stroke="#76ff03" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="18" y="48" width="28" height="10" rx="4" fill="#00838f" stroke="#141414" stroke-width="3"/></svg>';
    // мініатюра поля: доріжка з кодобітами
    const mini = h('div', { class: 'kd-g-mini', 'aria-hidden': 'true' }, Array.from({ length: 15 }, (_, i) => h('i', { class: [0, 1, 2, 7, 12, 13, 14].includes(i) ? 'p' : i === 6 ? 'w' : '' }, i === 2 ? '💎' : i === 14 ? '⚡' : '')));
    return h('a', { class: 'kd-gamecard', href },
      h('div', { class: 'kd-g-robo' }, svgEl(robo)),
      h('div', { class: 'kd-g-body' }, h('b', {}, hx('game_t')), h('span', {}, hx('game_d')),
        h('div', { class: 'kd-g-meter' }, h('div', { class: 'bar' }, h('i', { style: { width: (g.max ? g.stars / g.max * 100 : 0) + '%' } })), h('small', {}, `${hx('stars', g.stars, g.max)} · ${hx('lv', g.done, g.total)}`)),
        h('span', { class: 'btn yellow big' }, g.done >= g.total && g.total ? hx('done') : g.done ? hx('cont', g.next) : hx('start'))),
      mini);
  }
  function journey(s) {
    const C = K(), { h, withTr } = C, curriculum = s.curriculum;
    const ui = ['no', 'uk', 'en'].includes(C.ui) ? C.ui : 'en';
    let activeTrack = Math.max(0, curriculum.tracks.findIndex(track => track.total && !track.complete));
    if (activeTrack < 0) activeTrack = 0;
    const title = c => withTr(h('span', {}, c.title), { uk: c.titleUk, en: c.titleEn });
    const idea = c => c.term || (IDEAS.find(x => x[6] === c.id) || (c.id === 'p191' ? ['ei tagg'] : ['']))[0] || '';
    const status = step => [
      h('span', { class: 'chip' + (step.read ? ' on' : '') }, (step.read ? '✔ ' : '📖 ') + hx('read')),
      h('span', { class: 'chip' + (step.stars ? ' on' : '') }, step.stars ? '★'.repeat(step.stars) : '🧩 ' + hx('test'))
    ];
    const stage = h('div', { class: 'kd-track-stage' });
    let trackButtons = [];
    function trackView(track) {
      let selected = Math.max(0, track.activeIndex);
      const card = h('article', { class: 'kd-focus-card', 'aria-live': 'polite' });
      const nodes = track.steps.map(step => h('button', {
        type: 'button', class: 'kd-scale-node ' + step.state, 'aria-pressed': 'false',
        'aria-label': `${step.index + 1}. ${step.comic.title}`,
        onclick: () => { selected = step.index; draw(); }
      }, h('b', {}, step.state === 'done' ? '✓' : String(step.index + 1)),
      h('span', { class: 'kd-scale-copy' }, h('strong', {}, title(step.comic)), h('small', {}, step.comic.level))));
      const scale = h('div', { class: 'kd-scale', style: { '--steps': String(Math.max(1, track.total)), minWidth: Math.max(360, track.total * 64) + 'px' } }, nodes);
      const scaleWrap = h('div', { class: 'kd-scale-wrap' }, scale);
      function draw() {
        nodes.forEach((node, i) => { const on = i === selected; node.classList.toggle('active', on); node.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        const step = track.steps[selected];
        if (!step) return;
        const c = step.comic;
        card.replaceChildren(
          h('div', { class: 'kd-focus-main' },
            h('small', { class: 'kd-focus-kicker' }, `${track.icon} ${track.name[ui]} · ${selected + 1}/${track.total} · ${c.level}`),
            withTr(h('h3', {}, c.title), { uk: c.titleUk, en: c.titleEn }),
            idea(c) ? h('p', {}, idea(c)) : null,
            h('div', { class: 'kd-focus-status' }, status(step))),
          h('div', { class: 'kd-focus-actions' },
            h('a', { class: 'btn' + (!step.read ? ' accent' : ''), href: `#/read/${c.id}/0` }, (step.read ? '✔ ' : '📖 ') + tx('read')),
            h('a', { class: 'btn yellow' + (step.read && !step.stars ? ' primary' : ''), href: `#/quiz/${c.id}` }, '🧩 ' + tx('test')),
            track.complete ? h('a', { class: 'btn accent', href: '#/quiz/koding' }, hx('mixed')) : null));
        requestAnimationFrame(() => { const node = nodes[selected]; if (!node || !scaleWrap.isConnected) return; scaleWrap.scrollLeft = Math.max(0, node.offsetLeft - (scaleWrap.clientWidth - node.offsetWidth) / 2); });
      }
      const all = h('details', { class: 'kd-all' },
        h('summary', {}, hx('all'), h('span', {}, `${track.done}/${track.total}`)),
        h('div', { class: 'kd-all-list' }, track.steps.map(step => {
          const c = step.comic;
          return h('div', { class: 'kd-all-row ' + step.state },
            h('span', { class: 'kd-all-n' }, step.state === 'done' ? '✓' : String(step.index + 1)),
            h('div', {}, h('b', {}, title(c)), h('small', {}, `${idea(c)}${idea(c) ? ' · ' : ''}${c.level}`)),
            h('div', { class: 'kd-all-actions' },
              h('a', { href: `#/read/${c.id}/0`, 'aria-label': `${tx('read')}: ${c.title}` }, step.read ? '✔' : '📖'),
              h('a', { href: `#/quiz/${c.id}`, 'aria-label': `${tx('test')}: ${c.title}` }, step.stars ? '★' : '🧩')));
        })));
      draw();
      return h('div', { class: 'kd-track-view', 'data-track': track.id }, scaleWrap, card, all);
    }
    function selectTrack(index) {
      activeTrack = index;
      trackButtons.forEach((button, i) => { const on = i === index; button.classList.toggle('active', on); button.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      stage.replaceChildren(trackView(curriculum.tracks[index]));
    }
    trackButtons = curriculum.tracks.map((track, index) => {
      const pct = track.total ? Math.round(track.done / track.total * 100) : 0;
      return h('button', { type: 'button', class: 'kd-track-card', 'data-track': track.id, 'aria-pressed': 'false', onclick: () => selectTrack(index) },
        h('span', { class: 'kd-track-icon' }, track.icon), h('span', { class: 'kd-track-copy' }, h('b', {}, track.name[ui]), h('small', {}, track.desc[ui])),
        h('span', { class: 'kd-track-meter' }, h('i', { style: { width: pct + '%' } })), h('em', {}, `${track.done}/${track.total}`));
    });
    const pct = curriculum.total ? Math.round(curriculum.done / curriculum.total * 100) : 0;
    const out = h('section', { class: 'kd-journey' },
      h('div', { class: 'kd-j-head' },
        h('div', {}, h('h2', {}, hx('path_t')), h('p', { class: 'hint' }, hx('path_d'))),
        h('div', { class: 'kd-rank' }, h('small', {}, hx('rank_t')), h('b', {}, ['🐣', '🧒', '💻', '🚀', '👑'][s.rank] + ' ' + hx('rank')[s.rank]))),
      h('div', { class: 'kd-journey-progress' },
        h('div', { class: 'kd-progress-copy' }, h('b', {}, curriculum.complete ? hx('complete') : hx('progress', curriculum.done, curriculum.total)), h('span', {}, `${pct}%`)),
        h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(curriculum.total), 'aria-valuenow': String(curriculum.done), 'aria-label': hx('progress', curriculum.done, curriculum.total) }, h('i', { style: { width: pct + '%' } }))),
      h('div', { class: 'kd-tracks', role: 'tablist' }, trackButtons),
      stage);
    selectTrack(activeTrack);
    return out;
  }
  function badges(s) {
    const C = K(), { h, withTr } = C, ui = C.ui;
    const n = s.badges.filter(x => x.on).length;
    return h('section', { class: 'kd-badges-box' },
      h('h2', {}, hx('badges_t'), ' ', h('span', { class: 'sr-n' }, `${n}/${BADGES.length}`)),
      h('div', { class: 'kd-badges' }, s.badges.map(({ b, on }) => withTr(h('div', { class: 'kd-badge' + (on ? ' on' : '') }, h('span', {}, b[0]), h('b', {}, b[1])), { uk: b[2], en: b[3] }))));
  }

  /* ---------- сторінка #/koding ---------- */
  function render_(id) {
    ensureQNO();
    const C = K(), { h, withTr, svgEl, ART, CH } = C;
    const ui = C.ui;
    const exp = (uk, en, no) => (ui === 'no' ? no : ui === 'uk' ? uk : en);
    const say = w => () => { try { C.Speech.speak(w, 'narrator'); } catch { /* без звуку */ } };
    const tiles = [['mix', ''], ['robot', 'robot'], ['code', 'code'], ['html', 'html'], ['algo', 'algo'], ['bug', 'bug'], ['lang', 'lang']];
    const S = hubState();
    return h('section', { class: 'koding' },
      h('div', { class: 'kd-hero' },
        h('div', {}, h('h1', {}, tx('title')), h('p', { class: 'lead-p' }, tx('intro')),
          h('div', { class: 'kd-hero-btns' }, window.KomiksKodeGame ? h('a', { class: 'btn yellow big kd-game-btn', href: '#/koding/spill' }, '🤖 ' + tx('game')) : null, h('a', { class: 'btn accent big', href: '#/read/p183/0' }, '📖 ' + tx('read')), h('a', { class: 'btn big', href: '#/quiz/koding' }, '🎲 ' + tx('t_mix').replace(/^🎲\s*/, '')))),
        h('div', { class: 'kd-hero-art' }, svgEl(ART.panel(comicsK()[0], 0, { bubbles: false, chars: CH })))),
      gameCard(S),
      journey(S),
      badges(S),
      h('div', { class: 'kd-what' }, h('h2', {}, tx('what_t')), h('p', {}, tx('what')), codeBlock(['gjenta 4 ganger:', '    gå fram', '    snu høyre', 'skriv("Ferdig!")'])),
      h('h2', {}, tx('ideas_t')),
      h('div', { class: 'kd-ideas' }, IDEAS.map(i => h('a', { class: 'kd-idea', href: `#/read/${i[6]}/0` },
        h('b', {}, i[0], ' ', h('button', { class: 'play', type: 'button', 'aria-label': 'Lytt', onclick: e => { e.preventDefault(); say(i[0])(); } }, '🔊')),
        h('small', {}, ui === 'no' ? '' : (ui === 'uk' ? i[1] : i[2])), h('span', {}, exp(i[3], i[4], i[5]))))),
      h('h2', {}, tx('langs_t')),
      h('div', { class: 'kd-langs' }, LANGS.map(L => h('div', { class: 'kd-lang' + (L[5] ? ' kids' : '') },
        h('span', { class: 'kd-ic big' }, L[4]), h('b', {}, L[0]), withTr(h('span', {}, L[1]), { uk: L[2], en: L[3] }),
        L[5] ? h('em', {}, tx('kids')) : null))),
      h('details', { class: 'kd-library' }, h('summary', {}, '📚 ' + tx('comics_t'), h('span', {}, comicsK().length)),
        h('div', { class: 'kd-comics' }, comicsK().map(c => h('div', { class: 'kd-comic' },
          h('a', { class: 'kd-cover', href: `#/read/${c.id}/0` }, svgEl(ART.panel(c, c.cover || 0, { bubbles: false, chars: CH }))),
          withTr(h('b', {}, c.title), { uk: c.titleUk, en: c.titleEn }),
          h('small', {}, c.level),
          h('div', { class: 'kd-comic-btns' }, h('a', { class: 'btn', href: `#/read/${c.id}/0` }, '📖 ' + tx('read')), h('a', { class: 'btn yellow', href: `#/quiz/${c.id}` }, '🧩 ' + tx('test'))))))),
      h('h2', {}, tx('tests_t')),
      h('div', { class: 'test-grid' }, tiles.map(([k, a]) => h('a', { class: 'test-tile', href: '#/quiz/koding' + (a ? '/' + a : '') }, h('b', {}, tx('t_' + k)), h('small', {}, tx('d_' + k))))),
      h('p', { class: 'hint kd-tip' }, tx('tip')));
  }

  // плитка на головній («Розділи») і в меню — тими ж мовами, що й інтерфейс
  const MOD = { uk: ['💻', 'Програмування', 'комікси з роботом, код і алгоритми'], en: ['💻', 'Coding', 'robot comics, code and algorithms'], no: ['💻', 'Programmering', 'tegneserier med robot, kode og algoritmer'], ar: ['💻', 'البرمجة', 'قصص مصوّرة مع روبوت وشيفرة وخوارزميات'], pt: ['💻', 'Programação', 'quadrinhos com robô, código e algoritmos'] };
  for (const [l, I] of Object.entries(window.I18N || {})) if (I && typeof I === 'object') { I.modules = I.modules || {}; I.modules.koding = MOD[l] || MOD.en; }

  window.KomiksKoding = { types: TYPES, questions, quiz, render, page: render_, text: tx, title: k => ({ robot: 'Styr roboten', code: 'Les koden', algo: 'Algoritmer', bug: 'Finn feilen', lang: 'Programmeringsspråk', html: 'HTML' })[k] || 'Programmering', LANGS, IDEAS, TRACKS, journeyModel, curriculumModel };
})();
