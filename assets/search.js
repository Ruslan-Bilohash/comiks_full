/* Комікс·Lab — 🔍 розумний пошук (#/search/<запит>, кнопка 🔍 у шапці, клавіша «/»).
   Шукає одразу в усьому: слова тем (1100+), словник коміксів, комікси й їхні репліки, граматика,
   англійські історії, розділи сайту. Запит — будь-якою мовою (норвезька, українська, англійська).
   «Розумний»: без різниці великі/малі літери й æ/ø/å ↔ ae/o/a, без артиклів (en/ei/et/å/a/the/to),
   норвезькі закінчення (bøker → bok не вгадає, але husene → hus, spiste → spise), помилки на 1–2 літери
   (hamer → hammer), підказка «Можливо, ви мали на увазі…». Блок пошуку слів — і на сторінці «Слова». */
(() => {
  'use strict';
  const C = () => window.KomiksCore;
  const T = {
    uk: { title: '🔍 Пошук', ph: 'Слово, фраза, комікс, розділ… будь-якою мовою', words_ph: 'Знайди слово: норвезькою, українською чи англійською', all: 'Усе', words: 'Слова', dict: 'Зі словника коміксів', comics: 'Комікси', lines: 'Репліки в коміксах', grammar: 'Граматика', english: 'Англійські історії', topics: 'Теми слів', pages: 'Розділи сайту',
      none: 'Нічого не знайдено.', mean: 'Можливо, ви мали на увазі:', hint: 'Порада: пишіть як завгодно — «hamer», «молоток» чи «hammer» знайдуть те саме. Enter — відкрити перший результат.', try: 'Спробуйте:', more: n => `ще ${n}…`, theme: 'тема', level: 'рівень', open: 'Відкрити', btn: 'Пошук' },
    en: { title: '🔍 Search', ph: 'A word, phrase, comic, section… in any language', words_ph: 'Find a word: in Norwegian, Ukrainian or English', all: 'All', words: 'Words', dict: 'From the comics dictionary', comics: 'Comics', lines: 'Lines in comics', grammar: 'Grammar', english: 'English stories', topics: 'Word topics', pages: 'Site sections',
      none: 'Nothing found.', mean: 'Did you mean:', hint: 'Tip: type however you like — “hamer”, “молоток” or “hammer” find the same thing. Enter opens the first result.', try: 'Try:', more: n => `${n} more…`, theme: 'topic', level: 'level', open: 'Open', btn: 'Search' },
    no: { title: '🔍 Søk', ph: 'Et ord, en setning, en tegneserie, en side … på hvilket som helst språk', words_ph: 'Finn et ord: på norsk, ukrainsk eller engelsk', all: 'Alt', words: 'Ord', dict: 'Fra ordlista i tegneseriene', comics: 'Tegneserier', lines: 'Replikker i tegneseriene', grammar: 'Grammatikk', english: 'Engelske historier', topics: 'Ordtemaer', pages: 'Sider på nettstedet',
      none: 'Fant ingenting.', mean: 'Mente du:', hint: 'Tips: skriv som du vil – «hamer», «молоток» eller «hammer» finner det samme. Enter åpner det første treffet.', try: 'Prøv:', more: n => `${n} til …`, theme: 'tema', level: 'nivå', open: 'Åpne', btn: 'Søk' }
  };
  const tx = k => { const ui = (C() && C().ui) || 'uk'; return (T[ui] || T.en)[k] ?? T.en[k]; };

  /* ---------- нормалізація й «розумне» порівняння ---------- */
  const fold = s => String(s || '').toLowerCase()
    .replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
    .replace(/ї/g, 'і').replace(/є/g, 'е').replace(/ґ/g, 'г').replace(/ё/g, 'е')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[’'`ʼ]/g, '').replace(/[^\p{L}\p{N}#+]+/gu, ' ').trim();
  const ART = /^(en|ei|et|an|a|the|to)\s+/;   // å вже стала «a» після fold()
  const noArt = s => s.replace(ART, '');
  // норвезькі закінчення: husene → hus, bilen → bil, spiste → spis, jenter → jent
  const stem = w => (w.length > 4 ? w.replace(/(ene|ane|ende|ede|en|et|er|ar|te|de|a|e|r)$/, '') : w);
  // відстань Дамерау–Левенштейна (перестановка сусідніх літер — одна помилка); max — для швидкого виходу
  function lev(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      let rowMin = Infinity;
      for (let j = 1; j <= b.length; j++) {
        const c = a[i - 1] === b[j - 1] ? 0 : 1;
        let v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2][j - 2] + 1);
        d[i][j] = v; if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
    }
    return d[a.length][b.length];
  }
  const allow = w => (w.length <= 3 ? 0 : w.length <= 6 ? 1 : 2);
  /* Оцінка збігу запиту з текстом (0 — немає). Кожне слово запиту має знайтися в тексті:
     точно, як початок слова, усередині, за основою (закінчення) чи з помилкою. */
  // t — уже нормалізований текст (fold), щоб не робити це на кожне натискання клавіші
  function score(q, t) {
    if (!t) return 0;
    const tn = noArt(t), qn = noArt(q);
    if (tn === qn) return 100;
    if (tn.startsWith(qn)) return 85 - Math.min(10, tn.length - qn.length);
    const words = tn.split(' ');
    let sum = 0;
    for (const qw of qn.split(' ')) {
      if (!qw) continue;
      let best = 0;
      for (const w of words) {
        if (w === qw) best = Math.max(best, 70);
        else if (w.startsWith(qw)) best = Math.max(best, qw.length >= 2 ? 60 : 0);
        else if (qw.length >= 5 && stem(qw).length >= 4 && stem(w) === stem(qw)) best = Math.max(best, 55);
        else if (qw.length >= 3 && w.includes(qw)) best = Math.max(best, 40);
        else { const a = allow(qw); if (a && Math.abs(w.length - qw.length) <= a) { const d = lev(qw, w, a); if (d <= a) best = Math.max(best, 34 - d * 6); } }
      }
      if (!best) return 0;
      sum += best;
    }
    const n = qn.split(' ').filter(Boolean).length || 1;
    return Math.round(sum / n);
  }

  /* ---------- індекс (будується один раз, коли потрібен) ---------- */
  let IDX = null;
  function index() {
    if (IDX) return IDX;
    const K = C(), out = [];
    const W = (window.WORDS || {}).themes || [];
    for (const th of W) out.push({ kind: 'topics', th, keys: [th.no, th.uk, th.en, th.id], href: '#/words/' + th.id });
    for (const th of W) for (const w of th.words) out.push({ kind: 'words', no: w[0], uk: w[1], en: w[2], emoji: w[3], th, keys: [w[0], w[1], w[2]], href: '#/words/' + th.id });
    const seen = new Set(out.filter(x => x.kind === 'words').map(x => noArt(fold(x.no))));
    const D = window.DICT || {};
    for (const [no, uk] of Object.entries(D.no || {})) {
      if (seen.has(fold(no))) continue;
      out.push({ kind: 'dict', no, uk, en: (D.en || {})[no] || '', keys: [no, uk, (D.en || {})[no] || ''], href: '#/search/' + encodeURIComponent(no) + '/lines' });
    }
    for (const c of K.COMICS || []) {
      out.push({ kind: 'comics', c, keys: [c.title, c.titleUk, c.titleEn, c.summaryUk, c.summaryEn, c.summaryNo, c.category, c.level], href: `#/read/${c.id}/0` });
      c.panels.forEach((p, pi) => (p.lines || []).forEach(l => out.push({ kind: 'lines', c, pi, l, keys: [l.no, l.uk, l.en], href: `#/read/${c.id}/${pi}` })));
    }
    const G = window.KomiksGrammar;
    if (G) for (const tp of G.topics()) out.push({ kind: 'grammar', tp, keys: [tp.no, tp.uk, tp.en, tp.id], href: '#/grammar/' + tp.id });
    const E = window.KomiksEnglish;
    if (E && E.comics) for (const c of E.comics()) out.push({ kind: 'english', c, keys: [c.title, c.titleUk, c.titleNo, c.summaryEn, c.summaryUk].filter(Boolean), href: `#/english/${c.id}/0` });
    for (const pg of PAGES) out.push({ kind: 'pages', pg, keys: pg.slice(1), href: pg[0] });
    for (const it of out) it.fk = it.keys.filter(Boolean).map(k => fold(k));
    return (IDX = out);
  }
  // [адреса, назви й ключові слова uk/en/no]
  const PAGES = [
    ['#/today', '📅 Сьогодні', 'Today', 'I dag', 'план на день', 'daily plan'],
    ['#/', '📚 Комікси', 'Comics', 'Tegneserier', 'читати', 'read'],
    ['#/words', '📝 Слова за темами', 'Words by topic', 'Ord etter tema', 'словник', 'vocabulary'],
    ['#/grammar', '📐 Граматика', 'Grammar', 'Grammatikk'],
    ['#/english', '🇬🇧 Англійська', 'English course', 'Engelsk'],
    ['#/alphabet', '🔤 Алфавіт', 'Alphabet', 'Alfabetet', 'вимова', 'pronunciation'],
    ['#/numbers', '🔢 Числа', 'Numbers', 'Tall'],
    ['#/math', '➗ Математика', 'Maths', 'Matte', 'таблиця множення', 'multiplication'],
    ['#/koding', '💻 Програмування', 'Coding', 'Programmering', 'html', 'python', 'robot'],
    ['#/koding/spill', '🤖 Robo вчиться кодити (гра)', 'Robo learns to code (game)', 'Robo lærer å kode (spill)', 'кодер', 'coder', 'game', 'гра'],
    ['#/tests', '🧩 Тести', 'Tests', 'Tester', 'quiz', 'перевірка'],
    ['#/plan', '🗺️ План навчання', 'Study plan', 'Læringsplan'],
    ['#/game', '🎮 Гра разом', 'Play together', 'Spill sammen', 'вікторина', 'quiz', 'qr', 'клас', 'class'],
    ['#/race', '🏁 Логік-гонка', 'Logic race', 'Logikkløp'],
    ['#/math/rocket', '🚀 Math Rocket', 'Math Rocket', 'Matterakett'],
    ['#/chess', '♟ Шахи', 'Chess', 'Sjakk'],
    ['#/cards', '🃏 Картки', 'Flashcards', 'Kort'],
    ['#/pairs', '🧠 Пари', 'Pairs', 'Par', 'memory'],
    ['#/cross', '🧩 Кросворд', 'Crossword', 'Kryssord'],
    ['#/call', '📞 Дзвінок з ШІ', 'AI call', 'Telefonsamtale', 'розмова', 'speaking'],
    ['#/write', '✍️ Письмо', 'Writing', 'Skriving'],
    ['#/exam', '🏁 Іспит', 'Exam', 'Norskprøven', 'норскпрøвен'],
    ['#/placement', '🎯 Визначити рівень', 'Placement test', 'Nivåtest'],
    ['#/analysis', '📊 Аналіз помилок', 'Mistake analysis', 'Feilanalyse'],
    ['#/rating', '🏆 Рейтинг', 'Rating', 'Rangering'],
    ['#/friends', '👥 Друзі', 'Friends', 'Venner'],
    ['#/players', '🔎 Гравці', 'Players', 'Spillere'],
    ['#/account', '👤 Кабінет', 'My account', 'Min side', 'профіль', 'profile'],
    ['#/avatar', '🎨 Аватар', 'Avatar', 'Avatar'],
    ['#/settings', '⚙️ Налаштування', 'Settings', 'Innstillinger', 'мова', 'language'],
    ['#/premium', '💎 Преміум', 'Premium', 'Premium', 'підписка', 'subscription'],
    ['#/teacher', '🎓 Для вчителів', 'For teachers', 'For lærere'],
    ['#/install', '📲 Встановити застосунок', 'Install the app', 'Installer appen', 'android', 'iphone', 'windows'],
    ['#/whatsnew', '✨ Що нового', 'What’s new', 'Hva er nytt'],
    ['#/help', '❓ Допомога', 'Help', 'Hjelp', 'faq'],
    ['#/sitemap', '🗺️ Карта сайту', 'Site map', 'Nettstedskart'],
    ['#/stats', '📈 Статистика', 'Statistics', 'Statistikk']
  ];

  function find(query, kinds = null) {
    const q = fold(query);
    if (!q) return [];
    const W = { words: 1.15, topics: 1.12, pages: 1.1, grammar: 1.05, comics: 1, english: 0.95, dict: 0.9, lines: 0.7 };
    const res = [];
    for (const it of index()) {
      if (kinds && !kinds.includes(it.kind)) continue;
      let s = 0;
      for (const k of it.fk) { const v = score(q, k); if (v > s) s = v; if (s >= 100) break; }
      if (s) res.push({ it, s: s * (W[it.kind] || 1) });
    }
    res.sort((a, b) => b.s - a.s);
    // слабкі «схожі» збіги показуємо лише тоді, коли сильніших немає
    const top = res.length ? res[0].s : 0, cut = Math.max(24, top * 0.35);
    // одне й те саме слово з кількох тем — один раз (перша тема)
    const seen = new Set();
    return res.filter(r => r.s >= cut).filter(r => { if (r.it.kind !== 'words') return true; const k = fold(r.it.no) + '|' + fold(r.it.uk); if (seen.has(k)) return false; seen.add(k); return true; });
  }
  // «Можливо, ви мали на увазі»: найближчі слова тем і словника
  function suggest(query) {
    const q = noArt(fold(query)); if (q.length < 3) return [];
    const cand = [];
    for (const it of index()) {
      if (it.kind !== 'words' && it.kind !== 'dict') continue;
      for (const k of [it.no, it.uk, it.en]) {
        const w = noArt(fold(k)); if (!w || Math.abs(w.length - q.length) > 3) continue;
        const d = lev(q, w, 2); if (d <= 2) cand.push([d, k]);
      }
    }
    return [...new Map(cand.sort((a, b) => a[0] - b[0]).map(x => [fold(x[1]), x[1]])).values()].slice(0, 5);
  }

  /* ---------- малювання результатів ---------- */
  function mark(h, text, query) {
    const s = String(text || ''); const q = fold(query).split(' ').filter(x => x.length >= 2);
    if (!q.length) return s;
    const f = fold(s); let at = -1, len = 0;
    for (const w of q) { const i = f.indexOf(w); if (i >= 0) { at = i; len = w.length; break; } }
    // fold() може змінити довжину (æ → ae) — тоді просто без підсвітки
    if (at < 0 || f.length !== s.length) return s;
    return [s.slice(0, at), h('mark', {}, s.slice(at, at + len)), s.slice(at + len)];
  }
  function wordCard(it, q) {
    const K = C(), { h } = K, ui = K.ui;
    const P = window.KomiksPics;
    const pic = P && P.has(it.no, it.uk) ? P.el(it.no, 56, it.uk) : h('span', { class: 'sr-emoji' }, it.emoji || '🔤');
    const tr = ui === 'no' ? `${it.uk} · ${it.en}` : ui === 'en' ? it.en : ui === 'uk' ? it.uk : (K.packFor && K.packFor(ui, it.en)) || it.en;
    const say = e => { e.preventDefault(); e.stopPropagation(); K.claim().then(() => K.Speech.speak(it.no, 'narrator', { rate: 0.9 })); };
    return h('a', { class: 'sr-word', href: it.href },
      h('span', { class: 'sr-pic' }, pic),
      h('span', { class: 'sr-main' }, h('b', {}, mark(h, it.no, q)), h('span', {}, mark(h, tr, q)),
        it.th ? h('small', {}, `${it.th.icon} ${window.KomiksWords ? window.KomiksWords.name(it.th) : it.th.no} · ${it.th.level}`) : null),
      h('button', { class: 'play', type: 'button', 'aria-label': 'Lytt', onclick: say }, '🔊'));
  }
  function row(it, q) {
    const K = C(), { h } = K, ui = K.ui;
    const nm = c => (ui === 'no' ? c.title : ui === 'uk' ? c.titleUk || c.title : c.titleEn || c.title);
    if (it.kind === 'words' || it.kind === 'dict') return wordCard(it, q);
    if (it.kind === 'comics') return h('a', { class: 'sr-row', href: it.href }, h('span', { class: 'sr-ico' }, '📖'), h('span', { class: 'sr-main' }, h('b', {}, mark(h, nm(it.c), q)), h('small', {}, `${it.c.title} · ${it.c.level} · ${K.catLabel ? K.catLabel(it.c.category) : it.c.category}`)));
    if (it.kind === 'lines') return h('a', { class: 'sr-row', href: it.href }, h('span', { class: 'sr-ico' }, '💬'), h('span', { class: 'sr-main' }, h('span', { lang: 'nb' }, mark(h, it.l.no, q)), h('small', {}, `${ui === 'en' ? it.l.en : it.l.uk} — ${nm(it.c)}, ${it.pi + 1}`)));
    if (it.kind === 'topics') return h('a', { class: 'sr-row', href: it.href }, h('span', { class: 'sr-ico' }, it.th.icon), h('span', { class: 'sr-main' }, h('b', {}, mark(h, window.KomiksWords ? window.KomiksWords.name(it.th) : it.th.no, q)), h('small', {}, `${it.th.no} · ${it.th.words.length} · ${it.th.level}`)));
    if (it.kind === 'grammar') return h('a', { class: 'sr-row', href: it.href }, h('span', { class: 'sr-ico' }, it.tp.icon || '📐'), h('span', { class: 'sr-main' }, h('b', {}, mark(h, it.tp.no, q)), h('small', {}, `${ui === 'en' ? it.tp.en : it.tp.uk} · ${it.tp.level}`)));
    if (it.kind === 'english') return h('a', { class: 'sr-row', href: it.href }, h('span', { class: 'sr-ico' }, '🇬🇧'), h('span', { class: 'sr-main' }, h('b', {}, mark(h, it.c.title, q)), h('small', {}, `${it.c.titleUk || ''} · ${it.c.level || ''}`)));
    const pg = it.pg; const label = ui === 'no' ? pg[3] : ui === 'en' ? pg[2] : pg[1];
    return h('a', { class: 'sr-row', href: it.href }, h('span', { class: 'sr-ico' }, '🧭'), h('span', { class: 'sr-main' }, h('b', {}, mark(h, label, q)), h('small', {}, pg[0])));
  }
  const ORDER = ['words', 'topics', 'pages', 'grammar', 'comics', 'english', 'dict', 'lines'];
  function results(q, only, limit = 8) {
    const K = C(), { h } = K;
    const res = find(q, only ? [only] : null);
    if (!res.length) {
      const sug = suggest(q);
      return h('div', { class: 'sr-empty' }, h('p', {}, tx('none')),
        sug.length ? h('p', {}, tx('mean'), ' ', sug.map(s => h('a', { class: 'tag', href: '#/search/' + encodeURIComponent(s) }, s))) : null);
    }
    const groups = {};
    for (const r of res) (groups[r.it.kind] = groups[r.it.kind] || []).push(r.it);
    return h('div', { class: 'sr-groups' }, ORDER.filter(k => groups[k]).map(k => {
      const list = groups[k], max = only ? 60 : limit;
      return h('section', { class: 'sr-group sr-' + k },
        h('h3', {}, tx(k), ' ', h('span', { class: 'sr-n' }, list.length)),
        h('div', { class: k === 'words' || k === 'dict' ? 'sr-words' : 'sr-list' }, list.slice(0, max).map(it => row(it, q))),
        list.length > max ? h('a', { class: 'btn sr-more', href: '#/search/' + encodeURIComponent(q) + '/' + k }, tx('more')(list.length - max)) : null);
    }));
  }

  /* ---------- сторінка #/search/<запит>[/<вид>] ---------- */
  function page(rawQ, only) {
    const K = C(), { h } = K;
    let q = rawQ ? decodeURIComponent(rawQ) : '';
    const box = h('div', { class: 'sr-out' });
    const input = h('input', { type: 'search', class: 'sr-input', value: q, placeholder: tx('ph'), autocomplete: 'off', spellcheck: 'false', 'aria-label': tx('btn') });
    const chips = h('div', { class: 'sr-chips' });
    let cur = ORDER.includes(only) ? only : '';
    const drawChips = () => chips.replaceChildren(...['', ...ORDER].map(k => h('button', { type: 'button', class: 'tag' + (k === cur ? ' on' : ''), onclick: () => { cur = k; drawChips(); draw(); sync(); } }, k ? tx(k) : tx('all'))));
    const sync = () => { try { history.replaceState(null, '', '#/search' + (q ? '/' + encodeURIComponent(q) + (cur ? '/' + cur : '') : '')); } catch { /* ignore */ } };
    const draw = () => {
      if (!fold(q)) {
        const ex = ['hammer', 'молоток', 'kjøkken', 'weather', 'hva heter du', 'preposisjoner', 'skole'];
        box.replaceChildren(h('p', { class: 'hint' }, tx('hint')), h('p', {}, tx('try'), ' ', ex.map(e => h('a', { class: 'tag', href: '#/search/' + encodeURIComponent(e) }, e))));
        return;
      }
      box.replaceChildren(results(q, cur));
    };
    let t = 0;
    input.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { q = input.value; draw(); sync(); }, 140); });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { const a = box.querySelector('a.sr-row, a.sr-word'); if (a) location.hash = a.getAttribute('href'); } });
    drawChips(); draw();
    setTimeout(() => { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }, 60);
    return h('section', { class: 'search-page' }, K.pageHead(tx('title')), h('div', { class: 'sr-bar' }, input), chips, box);
  }

  /* ---------- блок пошуку слів (сторінка «Слова») ---------- */
  function wordsBox() {
    const K = C(), { h } = K;
    const out = h('div', { class: 'sr-out' });
    const input = h('input', { type: 'search', class: 'sr-input', placeholder: tx('words_ph'), autocomplete: 'off', spellcheck: 'false', 'aria-label': tx('words_ph') });
    let t = 0;
    input.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => { const q = input.value; out.replaceChildren(fold(q) ? results(q, 'words', 24) : ''); }, 140);
    });
    return h('div', { class: 'sr-words-box' }, input, out);
  }

  // «/» відкриває пошук (якщо курсор не в полі вводу)
  if (typeof document !== 'undefined') document.addEventListener('keydown', e => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    const el = document.activeElement;
    if (el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable)) return;
    e.preventDefault(); location.hash = '#/search';
  });

  window.KomiksSearch = { page, wordsBox, find, suggest, text: tx, _fold: fold, _score: score };
})();
