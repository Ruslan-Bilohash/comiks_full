/* Комікс·Lab — 🤖 «Robo lærer å kode»: гра-програмування з прогресом (#/koding/spill[/<рівень>]).
   Гравець складає програму з блоків (кроки ⬆⬇⬅➡, «gjenta N ganger», власна функція F), робот Robo
   виконує її на полі: збирає кодобіти 💎 і доходить до зарядки ⚡. Розділи: команди → цикли → функції →
   пошук помилок. Зірки за рівень: що коротша програма, то більше (★★★ — оптимальна довжина).
   Прогрес — store 'kodeGame' ({ best: {рівень: зірки}, last }) — синхронізується з акаунтом, як і решта.
   Тексти гри норвезькою (переклад при наведенні), підписи інтерфейсу — мовою сайту. */
(() => {
  'use strict';
  const C = () => window.KomiksCore;

  /* ---------- рівні ----------
     map: '#' стіна, '.' підлога, 'R' старт, '*' кодобіт, 'G' зарядка (мета).
     tools: які блоки доступні; max — скільки блоків можна використати; opt — оптимальна довжина (★★★);
     start — заготовка програми (розділ «Feilsøking»). Кожен рівень перевірено розв'язком sol (tools/… test у коментарі нижче). */
  const L = [
    // 1 — команди
    { ch: 1, map: ['R..G'], tools: 'arrows', max: 6, opt: 3, sol: { main: 'RRR' },
      tip: ['Hei! Jeg er Robo. Gi meg kommandoer, så går jeg til laderen ⚡.', 'Привіт! Я Робо. Дай мені команди — і я дійду до зарядки ⚡.', 'Hi! I am Robo. Give me commands and I will walk to the charger ⚡.'] },
    { ch: 1, map: ['....G', '.####', 'R....'], tools: 'arrows', max: 10, opt: 6, sol: { main: 'UURRRR' },
      tip: ['Veggen er i veien. Gå opp først!', 'Стіна заважає. Спершу йди вгору!', 'The wall is in the way. Go up first!'] },
    { ch: 1, map: ['#*#', '.R.', '#G#'], tools: 'arrows', max: 6, opt: 3, sol: { main: 'UDD' },
      tip: ['Hent kodebiten 💎, og gå så tilbake.', 'Забери кодобіт 💎 і повернись.', 'Grab the code bit 💎, then go back.'] },
    { ch: 1, map: ['R*..', '...*', 'G...'], tools: 'arrows', max: 12, opt: 8, sol: { main: 'RRRDDLLL' },
      tip: ['Samle alle kodebitene før du lader.', 'Збери всі кодобіти, перш ніж заряджатися.', 'Collect all code bits before you charge.'] },
    { ch: 1, map: ['R..#G', '##.#.', '...#.', '.###.', '.....'], tools: 'arrows', max: 20, opt: 16, sol: { main: 'RRDDLLDDRRRRUUUU' },
      tip: ['En labyrint! Tenk steg for steg.', 'Лабіринт! Думай крок за кроком.', 'A maze! Think step by step.'] },
    // 2 — цикли
    { ch: 2, map: ['R.......G'], tools: 'loop', max: 3, opt: 2, sol: { main: '8(R)' },
      tip: ['Så mange like steg! Bruk «gjenta»: én kommando, mange ganger.', 'Стільки однакових кроків! Використай «gjenta» — одна команда багато разів.', 'So many identical steps! Use “repeat”: one command, many times.'] },
    { ch: 2, map: ['R.###', '#..##', '##..#', '###..', '####G'], tools: 'loop', max: 4, opt: 3, sol: { main: '4(RD)' },
      tip: ['En trapp: høyre, ned, høyre, ned … Det er et mønster!', 'Сходи: праворуч, вниз, праворуч, вниз… Це шаблон!', 'Stairs: right, down, right, down … That is a pattern!'] },
    { ch: 2, map: ['R..####', '##*..##', '####*..', '######G'], tools: 'loop', max: 5, opt: 4, sol: { main: '3(RRD)' },
      tip: ['Finn mønsteret og gjenta det tre ganger.', 'Знайди шаблон і повтори його тричі.', 'Find the pattern and repeat it three times.'] },
    { ch: 2, map: ['R.....', '#####.', '#####*', '#####.', '#####G'], tools: 'loop', max: 5, opt: 4, sol: { main: '5(R)4(D)' },
      tip: ['To løkker etter hverandre.', 'Два цикли один за одним.', 'Two loops, one after the other.'] },
    // 3 — функції
    { ch: 3, map: ['R..####', '##*..##', '####*..', '######G'], tools: 'func', max: 7, opt: 6, sol: { main: 'FFF', f: 'RRD' },
      tip: ['Lag din egen kommando F og bruk den flere ganger.', 'Створи власну команду F і використай її кілька разів.', 'Make your own command F and use it several times.'] },
    { ch: 3, map: ['R.####', '#..###', '##*.##', '###..#', '####.*', '#####G'], tools: 'all', max: 6, opt: 4, sol: { main: '5(F)', f: 'RD' },
      tip: ['En funksjon inni en løkke – supersterkt!', 'Функція всередині циклу — суперсила!', 'A function inside a loop – super strong!'] },
    { ch: 3, map: ['R.*.###', '###.###', '###.###', '###....', '######*', '######.', '######G'], tools: 'all', max: 8, opt: 6, sol: { main: '2(F)', f: '3(R)3(D)' },
      tip: ['Tre til høyre, tre ned – to ganger.', 'Три праворуч, три вниз — двічі.', 'Three right, three down – twice.'] },
    // 4 — пошук помилок
    { ch: 4, map: ['R..', '...', '..G'], tools: 'arrows', max: 6, opt: 4, start: { main: 'RRUU' }, sol: { main: 'RRDD' },
      tip: ['Oi! Programmet har en bug. Finn feilen og rett den.', 'Ой! У програмі баг. Знайди помилку й виправ її.', 'Oops! The program has a bug. Find it and fix it.'] },
    { ch: 4, map: ['R.......G'], tools: 'loop', max: 3, opt: 2, start: { main: '7(R)' }, sol: { main: '8(R)' },
      tip: ['Roboten stopper ett steg for tidlig. Trykk på tallet i løkka.', 'Робот зупиняється на крок раніше. Натисни на число в циклі.', 'The robot stops one step too early. Tap the number in the loop.'] },
    { ch: 4, map: ['R.*.###', '###.###', '###.###', '###....', '######*', '######.', '######G'], tools: 'all', max: 8, opt: 6, start: { main: '2(F)', f: '3(R)2(D)' }, sol: { main: '2(F)', f: '3(R)3(D)' },
      tip: ['Feilen er i funksjonen F. Les den linje for linje.', 'Помилка у функції F. Прочитай її рядок за рядком.', 'The bug is in function F. Read it line by line.'] },
    // 5 — майстер-проба: усе разом
    { ch: 5, map: ['R......', '######.', '.*....*', '.######', '.......', '######.', 'G......'], tools: 'all', max: 12, opt: 10, sol: { main: '2(F)', f: '6(R)2(D)6(L)2(D)' },
      tip: ['Mesterprøve! En slange av gangveier. Finn ett mønster og gjenta det.', 'Майстер-проба! Звивистий коридор. Знайди один шаблон і повтори його.', 'Master test! A winding corridor. Find one pattern and repeat it.'] },
    { ch: 5, map: ['R......', '######.', '.*....*', '.######', '.......', '######.', 'G......'], tools: 'all', max: 12, opt: 10, start: { main: '2(F)', f: '6(R)2(D)5(L)2(D)' }, sol: { main: '2(F)', f: '6(R)2(D)6(L)2(D)' },
      tip: ['Siste bug! Programmet er nesten riktig – ett tall er feil.', 'Останній баг! Програма майже правильна — одне число хибне.', 'The last bug! The program is almost right – one number is wrong.'] }
  ];
  const CH = {
    1: ['🧭', 'Kommandoer', 'Команди', 'Commands'],
    2: ['🔁', 'Løkker', 'Цикли', 'Loops'],
    3: ['🧩', 'Funksjoner', 'Функції', 'Functions'],
    4: ['🐞', 'Feilsøking', 'Пошук помилок', 'Debugging'],
    5: ['🏆', 'Mesterprøve', 'Майстер-проба', 'Master test']
  };
  const MOVES = { U: [0, -1, '⬆', 'opp', 'вгору', 'up'], D: [0, 1, '⬇', 'ned', 'вниз', 'down'], L: [-1, 0, '⬅', 'venstre', 'ліворуч', 'left'], R: [1, 0, '➡', 'høyre', 'праворуч', 'right'] };
  /* Маленька демонстрація не розкриває розв'язок рівня. Вона показує сам
     принцип виконання: програма читає блоки зліва направо, а кожна команда
     змінює стан поля рівно один раз. */
  const EXEC_EXAMPLE = Object.freeze({ moves: Object.freeze(['R', 'R', 'R']), cells: 4 });

  /* ---------- програма: розбір заготовок «3(RD)F» і підрахунок ---------- */
  let uid = 0;
  function parse(src) {
    const out = []; let i = 0;
    while (i < (src || '').length) {
      const c = src[i];
      if (MOVES[c]) { out.push({ id: ++uid, t: c }); i++; }
      else if (c === 'F') { out.push({ id: ++uid, t: 'F' }); i++; }
      else if (/\d/.test(c)) { const j = src.indexOf(')', i); const n = parseInt(src.slice(i, src.indexOf('(', i)), 10); out.push({ id: ++uid, t: 'loop', n, body: parse(src.slice(src.indexOf('(', i) + 1, j)) }); i = j + 1; }
      else i++;
    }
    return out;
  }
  const count = list => list.reduce((n, b) => n + 1 + (b.body ? b.body.length : 0), 0);
  // розгортаємо в послідовність кроків; кожен крок пам'ятає блок, щоб підсвітити його під час виконання
  function flatten(prog) {
    const steps = [];
    const walk = (list, depth) => {
      for (const b of list) {
        if (steps.length > 400 || depth > 6) return;
        if (MOVES[b.t]) steps.push({ m: b.t, id: b.id });
        else if (b.t === 'loop') for (let k = 0; k < b.n; k++) walk(b.body, depth + 1);
        else if (b.t === 'F') { steps.push({ m: null, id: b.id }); walk(prog.f, depth + 1); }
      }
    };
    walk(prog.main, 0);
    return steps;
  }
  function board(lv) {
    const g = lv.map.map(r => r.split(''));
    let start = [0, 0], goal = [0, 0]; const gems = [];
    g.forEach((r, y) => r.forEach((c, x) => { if (c === 'R') start = [x, y]; if (c === 'G') goal = [x, y]; if (c === '*') gems.push([x, y]); }));
    return { g, w: g[0].length, h: g.length, start, goal, gems };
  }
  // чистий прогін (без анімації): для перевірки розв'язків і для гри
  function simulate(lv, prog) {
    const B = board(lv); let [x, y] = B.start; const left = new Set(B.gems.map(p => p.join())); const trace = [];
    for (const s of flatten(prog)) {
      if (!s.m) { trace.push({ x, y, id: s.id }); continue; }
      const nx = x + MOVES[s.m][0], ny = y + MOVES[s.m][1];
      if (ny < 0 || ny >= B.h || nx < 0 || nx >= B.w || B.g[ny][nx] === '#') { trace.push({ x, y, id: s.id, bump: s.m }); return { ok: false, why: 'wall', trace }; }
      x = nx; y = ny; left.delete(x + ',' + y);
      trace.push({ x, y, id: s.id, m: s.m });
      if (x === B.goal[0] && y === B.goal[1] && !left.size) return { ok: true, trace };
    }
    if (x === B.goal[0] && y === B.goal[1]) return { ok: false, why: 'gems', trace };
    return { ok: false, why: 'short', trace };
  }
  const stars = (lv, n) => (n <= lv.opt ? 3 : n <= lv.opt + 2 ? 2 : 1);

  /* ---------- прогрес ---------- */
  const KEY = 'kodeGame';
  const load = () => Object.assign({ best: {}, last: 1 }, (C() && C().store.get(KEY, {})) || {});
  const save = p => { try { C().store.set(KEY, p); } catch { /* ignore */ } };
  const unlocked = (p, n) => n === 1 || (p.best[n - 1] || 0) > 0;
  const totalStars = p => Object.values(p.best).reduce((a, b) => a + b, 0);

  /* ---------- тексти інтерфейсу ---------- */
  const T = {
    uk: { title: '🤖 Robo вчиться кодити', lead: 'Склади програму з блоків — і Робо виконає її крок за кроком. Збирай кодобіти 💎, доходь до зарядки ⚡, отримуй зірки за найкоротшу програму. Прогрес зберігається.', map: '🗺️ Рівні', level: n => `Рівень ${n}`, run: '▶ Запустити', reset: '↺ Спочатку', clear: '🗑️ Очистити', main: 'Програма', func: 'Функція F', blocks: (n, m) => `Блоків: ${n} з ${m}`, next: 'Наступний рівень ▶', again: '🔄 Ще раз', stars: n => `★ ${n}`, locked: 'Спершу пройди попередній рівень', hint_edit: 'Натисни блок у програмі, щоб прибрати його. Натисни на 🔁, щоб класти блоки в цикл; на число — щоб змінити його.', progress: (s, m) => `Зірок: ${s} з ${m}`, play: '🎮 Грати', cont: '▶ Продовжити', done_all: '🏆 Усі рівні пройдено!', max: 'Забагато блоків для цього рівня.', target_main: 'Додаю в програму', target_f: 'Додаю у функцію F', target_loop: 'Додаю в цикл 🔁', example_title: 'Маленький приклад', example_note: 'Код виконується зліва направо — одна команда за крок.', example_play: 'Показати', example_again: 'Ще раз' },
    en: { title: '🤖 Robo learns to code', lead: 'Build a program from blocks and Robo runs it step by step. Collect code bits 💎, reach the charger ⚡ and earn stars for the shortest program. Your progress is saved.', map: '🗺️ Levels', level: n => `Level ${n}`, run: '▶ Run', reset: '↺ Restart', clear: '🗑️ Clear', main: 'Program', func: 'Function F', blocks: (n, m) => `Blocks: ${n} of ${m}`, next: 'Next level ▶', again: '🔄 Again', stars: n => `★ ${n}`, locked: 'Finish the previous level first', hint_edit: 'Tap a block in the program to remove it. Tap 🔁 to put blocks inside the loop; tap the number to change it.', progress: (s, m) => `Stars: ${s} of ${m}`, play: '🎮 Play', cont: '▶ Continue', done_all: '🏆 All levels done!', max: 'Too many blocks for this level.', target_main: 'Adding to the program', target_f: 'Adding to function F', target_loop: 'Adding to loop 🔁', example_title: 'Small example', example_note: 'Code runs from left to right — one command per step.', example_play: 'Show me', example_again: 'Again' },
    no: { title: '🤖 Robo lærer å kode', lead: 'Lag et program av blokker, så kjører Robo det steg for steg. Samle kodebiter 💎, kom deg til laderen ⚡ og få stjerner for det korteste programmet. Fremgangen blir lagret.', map: '🗺️ Nivåer', level: n => `Nivå ${n}`, run: '▶ Kjør', reset: '↺ Start på nytt', clear: '🗑️ Tøm', main: 'Program', func: 'Funksjon F', blocks: (n, m) => `Blokker: ${n} av ${m}`, next: 'Neste nivå ▶', again: '🔄 En gang til', stars: n => `★ ${n}`, locked: 'Fullfør forrige nivå først', hint_edit: 'Trykk på en blokk i programmet for å fjerne den. Trykk på 🔁 for å legge blokker i løkka, og på tallet for å endre det.', progress: (s, m) => `Stjerner: ${s} av ${m}`, play: '🎮 Spill', cont: '▶ Fortsett', done_all: '🏆 Alle nivåene er klare!', max: 'For mange blokker på dette nivået.', target_main: 'Legger til i programmet', target_f: 'Legger til i funksjon F', target_loop: 'Legger til i løkka 🔁', example_title: 'Lite eksempel', example_note: 'Koden kjøres fra venstre mot høyre – én kommando per steg.', example_play: 'Vis meg', example_again: 'En gang til' }
  };
  if (window.KL_T_FILL) KL_T_FILL(T, 'kodegame.js:T');
  const tx = (k, ...a) => { const ui = (C() && C().ui) || 'uk'; const v = (T[ui] || T.en)[k] ?? T.en[k]; return typeof v === 'function' ? v(...a) : v; };
  // повідомлення Робо (норвезькою + переклад при наведенні)
  const SAY = {
    win: ['Jippi! Jeg er ladet ⚡ Programmet virker!', 'Ура! Я заряджений ⚡ Програма працює!', 'Yay! I am charged ⚡ The program works!'],
    wall: ['Au! Jeg gikk inn i en vegg. Finn feilen 🐞', 'Ой! Я врізався в стіну. Знайди помилку 🐞', 'Ouch! I walked into a wall. Find the bug 🐞'],
    gems: ['Jeg mangler kodebiter 💎. Samle alle først!', 'Мені бракує кодобітів 💎. Спершу збери всі!', 'I am missing code bits 💎. Collect them all first!'],
    short: ['Programmet stoppet før laderen. Legg til flere steg.', 'Програма зупинилась до зарядки. Додай кроків.', 'The program stopped before the charger. Add more steps.'],
    empty: ['Programmet er tomt. Trykk på blokkene nedenfor.', 'Програма порожня. Натискай блоки внизу.', 'The program is empty. Tap the blocks below.']
  };

  // маленький Robo (SVG): голова-екран, антена; dir — куди дивиться
  const ROBO = `<svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true"><path d="M32 6v8" stroke="#141414" stroke-width="3"/><circle cx="32" cy="6" r="4" fill="#ff5252" stroke="#141414" stroke-width="2"/><rect x="10" y="14" width="44" height="34" rx="10" fill="#4dd0e1" stroke="#141414" stroke-width="3"/><rect x="16" y="20" width="32" height="20" rx="6" fill="#102027"/><g class="kg-eyes"><rect x="21" y="25" width="6" height="8" rx="2" fill="#76ff03"/><rect x="37" y="25" width="6" height="8" rx="2" fill="#76ff03"/></g><rect x="18" y="48" width="28" height="10" rx="4" fill="#00838f" stroke="#141414" stroke-width="3"/></svg>`;

  /* ---------- карта рівнів ---------- */
  function mapView() {
    const K = C(), { h, withTr } = K, p = load();
    const max = L.length * 3, total = totalStars(p);
    const next = L.findIndex((_, i) => !(p.best[i + 1] > 0)) + 1;
    return h('section', { class: 'kodegame' },
      K.pageHead(tx('title'), '#/koding'),
      h('div', { class: 'kg-hero' }, h('div', { class: 'kg-hero-robo' }, K.svgEl(ROBO)),
        h('div', {}, h('p', { class: 'lead-p' }, tx('lead')),
          h('div', { class: 'kg-prog' }, h('div', { class: 'bar' }, h('i', { style: { width: (total / max * 100) + '%' } })), h('b', {}, tx('progress', total, max))),
          next > 0 ? h('a', { class: 'btn accent big', href: '#/koding/spill/' + next }, (total ? tx('cont') : tx('play')) + ' · ' + tx('level', next)) : h('p', { class: 'kg-done' }, tx('done_all')))),
      Object.entries(CH).map(([ch, c]) => h('div', { class: 'kg-chapter' },
        withTr(h('h3', {}, `${c[0]} ${c[1]}`), { uk: c[2], en: c[3] }),
        h('div', { class: 'kg-levels' }, L.map((lv, i) => [lv, i + 1]).filter(([lv]) => String(lv.ch) === ch).map(([lv, n]) => {
          const open = unlocked(p, n), st = p.best[n] || 0;
          return open
            ? h('a', { class: 'kg-lvl' + (st ? ' done' : ''), href: '#/koding/spill/' + n }, h('b', {}, n), h('span', { class: 'kg-st' }, '★'.repeat(st) + '☆'.repeat(3 - st)))
            : h('span', { class: 'kg-lvl locked', title: tx('locked') }, h('b', {}, '🔒'), h('span', { class: 'kg-st' }, n));
        })))));
  }

  /* ---------- рівень ---------- */
  function levelView(n) {
    const K = C(), { h, withTr, svgEl } = K;
    const lv = L[n - 1], p = load();
    if (!lv || !unlocked(p, n)) { location.hash = '#/koding/spill'; return mapView(); }
    p.last = n; save(p);
    const B = board(lv);
    const prog = { main: parse((lv.start || {}).main || ''), f: parse((lv.start || {}).f || '') };
    let target = { list: 'main', loop: null };
    const hasLoop = lv.tools === 'loop' || lv.tools === 'all', hasF = lv.tools === 'func' || lv.tools === 'all';
    const say3 = (a, cls = 'p') => withTr(h(cls, {}, a[0]), { uk: a[1], en: a[2] });

    // поле
    const cells = h('div', { class: 'kg-grid', style: { gridTemplateColumns: `repeat(${B.w}, 1fr)` } });
    const gemEls = {};
    B.g.forEach((r, y) => r.forEach((c, x) => {
      const cell = h('div', { class: 'kg-cell' + (c === '#' ? ' wall' : '') + (c === 'G' ? ' goal' : '') });
      if (c === 'G') cell.append(h('span', { class: 'kg-goal' }, '⚡'));
      if (c === '*') { const gm = h('span', { class: 'kg-gem' }, '💎'); gemEls[x + ',' + y] = gm; cell.append(gm); }
      cells.append(cell);
    }));
    const robo = h('div', { class: 'kg-robo' }, svgEl(ROBO));
    const place = (x, y) => { robo.style.left = (x / B.w * 100) + '%'; robo.style.top = (y / B.h * 100) + '%'; };
    robo.style.width = (100 / B.w) + '%'; robo.style.height = (100 / B.h) + '%';
    place(...B.start);
    const field = h('div', { class: 'kg-field', style: { aspectRatio: `${B.w} / ${B.h}`, maxWidth: Math.min(560, B.w * 92) + 'px' } }, cells, robo);

    // повідомлення Робо
    const bubble = h('div', { class: 'kg-say' });
    const sayNow = a => bubble.replaceChildren(h('span', { class: 'kg-say-robo' }, svgEl(ROBO)), say3(a, 'p'));
    sayNow(lv.tip);

    // наочний приклад виконання: окремий від задачі, тому не видає її розв'язок
    const exBlocks = EXEC_EXAMPLE.moves.map(m => h('span', { class: 'kg-b kg-' + m, 'aria-hidden': 'true' }, h('b', {}, MOVES[m][2]), h('small', {}, MOVES[m][3])));
    const exTrack = h('div', { class: 'kg-example-track', 'aria-hidden': 'true' },
      Array.from({ length: EXEC_EXAMPLE.cells }, (_, i) => h('span', { class: 'kg-example-cell' + (i === EXEC_EXAMPLE.cells - 1 ? ' goal' : '') }, i === EXEC_EXAMPLE.cells - 1 ? '⚡' : '')));
    const exRobo = h('span', { class: 'kg-example-robo', 'aria-hidden': 'true' }, svgEl(ROBO));
    exTrack.append(exRobo);
    let exTimer = 0, exRun = 0;
    const stopExample = () => { clearTimeout(exTimer); exRun++; };
    const resetExample = () => {
      stopExample(); exRobo.style.left = '0%';
      exBlocks.forEach(b => b.classList.remove('on', 'done'));
    };
    const exBtn = h('button', { class: 'kg-example-play', type: 'button' }, '▶ ', tx('example_play'));
    function runExample() {
      resetExample();
      const runId = exRun;
      exBtn.disabled = true;
      exBtn.textContent = '⏸ ' + tx('example_play');
      let i = 0;
      const step = () => {
        if (runId !== exRun) return;
        exBlocks.forEach((b, k) => b.classList.toggle('on', k === i));
        if (i >= EXEC_EXAMPLE.moves.length) {
          exBlocks.forEach(b => b.classList.remove('on'));
          exBtn.disabled = false; exBtn.textContent = '↺ ' + tx('example_again');
          return;
        }
        if (i > 0) exBlocks[i - 1].classList.add('done');
        exRobo.style.left = ((i + 1) / EXEC_EXAMPLE.cells * 100) + '%';
        i++;
        exTimer = setTimeout(step, 520);
      };
      exTimer = setTimeout(step, 180);
    }
    exBtn.addEventListener('click', runExample);
    const example = h('aside', { class: 'kg-example' },
      h('div', { class: 'kg-example-copy' }, h('b', {}, '▶ ', tx('example_title')), h('p', {}, tx('example_note'))),
      h('div', { class: 'kg-example-code', 'aria-label': tx('example_note') }, exBlocks),
      exTrack, exBtn);

    // програма
    const counter = h('span', { class: 'kg-count' });
    const mainBox = h('div', { class: 'kg-code' }), fBox = h('div', { class: 'kg-code' });
    const targetNote = h('small', { class: 'kg-target' });
    const blockEl = (b, list, parent) => {
      if (b.t === 'loop') {
        const inner = h('div', { class: 'kg-loop-body' }, b.body.map(x => blockEl(x, list, b)));
        const isT = target.loop === b;
        return h('div', { class: 'kg-loop' + (isT ? ' target' : ''), 'data-id': b.id },
          h('div', { class: 'kg-loop-head' },
            h('button', { type: 'button', class: 'kg-loop-tgl', title: tx('target_loop'), onclick: () => { target = isT ? { list, loop: null } : { list, loop: b }; draw(); } }, '🔁'),
            withTr(h('span', {}, 'gjenta'), { uk: 'повтори', en: 'repeat' }),
            h('button', { type: 'button', class: 'kg-n', onclick: () => { b.n = b.n >= 9 ? 2 : b.n + 1; K.Sfx.tick(); draw(); } }, String(b.n)),
            withTr(h('span', {}, 'ganger'), { uk: 'разів', en: 'times' }),
            h('button', { type: 'button', class: 'kg-x', 'aria-label': 'x', onclick: () => { removeBlock(b); draw(); } }, '✕')),
          inner);
      }
      const label = b.t === 'F' ? ['F', 'F', 'F'] : [MOVES[b.t][2], MOVES[b.t][3]];
      return withTr(h('button', { type: 'button', class: 'kg-b kg-' + b.t, 'data-id': b.id, onclick: () => { removeBlock(b); K.Sfx.tick(); draw(); } }, h('b', {}, label[0]), b.t !== 'F' ? h('small', {}, label[1]) : null),
        b.t === 'F' ? { uk: 'функція F', en: 'function F' } : { uk: MOVES[b.t][4], en: MOVES[b.t][5] });
    };
    function removeBlock(b) {
      const rm = list => { const i = list.indexOf(b); if (i >= 0) { list.splice(i, 1); return true; } return list.some(x => x.body && rm(x.body)); };
      rm(prog.main) || rm(prog.f);
      if (target.loop === b) target = { list: target.list, loop: null };
    }
    const used = () => count(prog.main) + count(prog.f);
    function add(t) {
      if (used() >= lv.max) { sayNow(['For mange blokker! Prøv en løkke eller en funksjon.', 'Забагато блоків! Спробуй цикл або функцію.', 'Too many blocks! Try a loop or a function.']); K.Sfx.bad(); return; }
      const b = t === 'loop' ? { id: ++uid, t: 'loop', n: 3, body: [] } : { id: ++uid, t };
      if (target.loop && t !== 'loop') target.loop.body.push(b);
      else (target.list === 'f' ? prog.f : prog.main).push(b);
      if (t === 'loop') target = { list: target.list, loop: b };
      K.Sfx.tick(); draw();
    }
    function draw() {
      mainBox.replaceChildren(...prog.main.map(b => blockEl(b, 'main')), prog.main.length ? '' : h('span', { class: 'kg-empty' }, '…'));
      fBox.replaceChildren(...prog.f.map(b => blockEl(b, 'f')), prog.f.length ? '' : h('span', { class: 'kg-empty' }, '…'));
      mainWrap.classList.toggle('target', target.list === 'main' && !target.loop);
      fWrap.classList.toggle('target', target.list === 'f' && !target.loop);
      counter.textContent = tx('blocks', used(), lv.max);
      counter.classList.toggle('full', used() >= lv.max);
      targetNote.textContent = target.loop ? tx('target_loop') : target.list === 'f' ? tx('target_f') : tx('target_main');
    }
    const mainWrap = h('div', { class: 'kg-codewrap', onclick: e => { if (e.target === mainWrap || e.target === mainBox || e.target.classList.contains('kg-code-t')) { target = { list: 'main', loop: null }; draw(); } } }, h('div', { class: 'kg-code-t' }, '📜 ' + tx('main')), mainBox);
    const fWrap = h('div', { class: 'kg-codewrap kg-fwrap', hidden: !hasF, onclick: e => { if (e.target === fWrap || e.target === fBox || e.target.classList.contains('kg-code-t')) { target = { list: 'f', loop: null }; draw(); } } }, h('div', { class: 'kg-code-t' }, '🧩 ' + tx('func')), fBox);

    // палітра
    const pal = h('div', { class: 'kg-pal' },
      ['U', 'D', 'L', 'R'].map(m => withTr(h('button', { type: 'button', class: 'kg-b kg-' + m, onclick: () => add(m) }, h('b', {}, MOVES[m][2]), h('small', {}, MOVES[m][3])), { uk: MOVES[m][4], en: MOVES[m][5] })),
      hasLoop ? withTr(h('button', { type: 'button', class: 'kg-b kg-loopbtn', onclick: () => add('loop') }, h('b', {}, '🔁'), h('small', {}, 'gjenta')), { uk: 'повтори N разів', en: 'repeat N times' }) : null,
      hasF ? withTr(h('button', { type: 'button', class: 'kg-b kg-F', onclick: () => add('F') }, h('b', {}, 'F'), h('small', {}, 'funksjon')), { uk: 'виклик функції F', en: 'call function F' }) : null);

    // виконання з анімацією
    let timer = 0, running = false;
    const stop = () => { clearTimeout(timer); running = false; runBtn.disabled = false; field.classList.remove('running'); };
    const resetField = () => {
      stop(); place(...B.start); robo.classList.remove('bump', 'win');
      Object.values(gemEls).forEach(g => g.classList.remove('got'));
      document.querySelectorAll('.kg-b.on, .kg-loop.on').forEach(x => x.classList.remove('on'));
    };
    const runBtn = h('button', { type: 'button', class: 'btn accent big', onclick: () => run() }, tx('run'));
    const result = h('div', { class: 'kg-result' });
    function run() {
      if (running) return;
      resetField(); result.replaceChildren();
      if (!prog.main.length) { sayNow(SAY.empty); K.Sfx.bad(); return; }
      const res = simulate(lv, prog);
      running = true; runBtn.disabled = true; field.classList.add('running');
      let i = 0;
      const step = () => {
        document.querySelectorAll('.kg-b.on').forEach(x => x.classList.remove('on'));
        if (i >= res.trace.length) return finish(res);
        const s = res.trace[i++];
        const el = document.querySelector(`.kg-code [data-id="${s.id}"]`); if (el) el.classList.add('on');
        if (s.bump) { robo.classList.add('bump'); K.Sfx.bad(); return finish(res); }
        if (s.m) { place(s.x, s.y); robo.dataset.dir = s.m; const gm = gemEls[s.x + ',' + s.y]; if (gm && !gm.classList.contains('got')) { gm.classList.add('got'); K.Sfx.good(); } else K.Sfx.tick(); }
        timer = setTimeout(step, 420);
      };
      step();
    }
    function finish(res) {
      running = false; runBtn.disabled = false; field.classList.remove('running');
      if (!res.ok) { sayNow(SAY[res.why] || SAY.short); if (res.why !== 'wall') K.Sfx.bad(); return; }
      const n2 = used(), st = stars(lv, n2), prog2 = load();
      prog2.best[n] = Math.max(prog2.best[n] || 0, st); prog2.last = Math.min(L.length, n + 1); save(prog2);
      robo.classList.add('win'); sayNow(SAY.win); K.Sfx.good(); if (K.confetti) K.confetti();
      result.replaceChildren(h('div', { class: 'kg-win' },
        h('div', { class: 'kg-stars' }, '★'.repeat(st) + '☆'.repeat(3 - st)),
        h('p', {}, tx('blocks', n2, lv.max), st < 3 ? ` · ★★★ ≤ ${lv.opt}` : ''),
        h('div', { class: 'row-center' },
          n < L.length ? h('a', { class: 'btn accent big', href: '#/koding/spill/' + (n + 1) }, tx('next')) : h('a', { class: 'btn accent big', href: '#/koding/spill' }, tx('done_all')),
          h('button', { type: 'button', class: 'btn', onclick: () => { resetField(); result.replaceChildren(); } }, tx('again')))));
    }

    draw();
    const c = CH[lv.ch];
    return h('section', { class: 'kodegame' },
      K.pageHead(`${c[0]} ${tx('level', n)} · ${c[1]}`, '#/koding/spill'),
      h('div', { class: 'kg-play' },
        h('div', { class: 'kg-left' }, bubble, example, field, result),
        h('div', { class: 'kg-right' },
          h('div', { class: 'kg-toolbar' }, counter, targetNote),
          mainWrap, fWrap,
          h('p', { class: 'hint kg-hint' }, tx('hint_edit')),
          pal,
          h('div', { class: 'kg-ctrl' }, runBtn,
            h('button', { type: 'button', class: 'btn', onclick: resetField }, tx('reset')),
            h('button', { type: 'button', class: 'btn', onclick: () => { resetField(); prog.main.length = 0; prog.f.length = 0; target = { list: 'main', loop: null }; draw(); } }, tx('clear'))))));
  }

  function render(arg) { const n = parseInt(arg, 10); return n ? levelView(n) : mapView(); }
  window.KomiksKodeGame = { render, levels: L, exampleData: EXEC_EXAMPLE, simulate, parse, count, stars, progress: () => { const p = load(); const ch = n => L.every((lv, i) => lv.ch !== n || (p.best[i + 1] || 0) > 0); return { stars: totalStars(p), max: L.length * 3, done: Object.keys(p.best).length, total: L.length, next: (L.findIndex((_, i) => !(p.best[i + 1] > 0)) + 1) || 0, chapters: Object.fromEntries(Object.keys(CH).map(k => [k, ch(+k)])), perfect: L.every((_, i) => (p.best[i + 1] || 0) === 3) }; } };
})();
