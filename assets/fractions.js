/* Комікс·Lab — ½ «Дроби» в математиці: урок (#/math/fractions) і окремий тест (#/quiz/math/frac).
   Кожен дріб звучить норвезькою: 3/4 — «tre fjerdedeler», 1/3 від 9 — «en tredjedel av ni er tre».
   Назви й приклади — з data/basics.js (fractionWord, fractionOf), за ними ж генерується аудіо. */
(() => {
  'use strict';
  const FX = {
    uk: {
      title: '½ Дроби', module: 'Дроби', module_d: 'частини цілого, назви норвезькою й тест',
      intro: 'Дріб показує частину цілого: піцу розрізали на 4 шматки, ти з’їв 3 — це 3/4, норвезькою «tre fjerdedeler». Натискай — кожен дріб звучить норвезькою.',
      what: '🍕 Що таке дріб', what_d: 'Нижнє число (nevner — знаменник) каже, на скільки рівних частин поділили ціле. Верхнє (teller — чисельник) — скільки частин узяли. Між ними — brøkstrek, риска дробу.',
      teller: 'teller — чисельник: скільки взяли', nevner: 'nevner — знаменник: на скільки частин поділили',
      build: '🧩 Конструктор дробів', build_d: 'Змінюй числа — побачиш дріб на піці й на смужці та почуєш його назву.',
      names: '🗣️ Назви дробів', names_d: 'Майже всі назви — порядкове число + «-del»: tredjedel, fjerdedel… Винятки: en halv (1/2) і en tidel (1/10). Коли частин більше однієї — «-deler»: to tredjedeler.',
      eq: '⚖️ Однакові дроби', eq_d: 'Різні записи — та сама частина: 1/2 = 2/4 = 3/6 = 4/8 = 5/10. Порівняй довжину зафарбованих смужок.',
      of: '🍎 Частина від числа', of_d: 'Щоб знайти 1/3 від 12, поділи 12 на 3 рівні групи — в одній групі 4. А 2/3 — це дві такі групи, тобто 8.', of_new: '🔄 Інший приклад',
      words: '📖 Слова', test: '▶️ Тест «Дроби»', test_d: '10 завдань: картинки, назви, порівняння й частина від числа.', back: '← Математика',
      q_pic: 'Який дріб зафарбовано?', q_word: 'Який це дріб?', q_name: 'Як це сказати норвезькою?', q_cmp: 'Який дріб більший?', q_of: 'Скільки буде?', q_eq: 'Який дріб дорівнює цьому?',
      result: (a, b) => `${a} з ${b} правильних`, again: '🔄 Ще раз', lesson: '½ До уроку', test_name: 'Дроби'
    },
    en: {
      title: '½ Fractions', module: 'Fractions', module_d: 'parts of a whole, Norwegian names and a test',
      intro: 'A fraction is a part of a whole: a pizza cut into 4 slices, you ate 3 — that is 3/4, in Norwegian “tre fjerdedeler”. Tap anything to hear it in Norwegian.',
      what: '🍕 What is a fraction', what_d: 'The bottom number (nevner — denominator) says into how many equal parts the whole is cut. The top number (teller — numerator) says how many parts you take. Between them is the brøkstrek, the fraction bar.',
      teller: 'teller — numerator: parts taken', nevner: 'nevner — denominator: equal parts in the whole',
      build: '🧩 Fraction builder', build_d: 'Change the numbers to see the fraction on a pizza and a bar and hear its name.',
      names: '🗣️ Fraction names', names_d: 'Most names are the ordinal number + “-del”: tredjedel, fjerdedel… Exceptions: en halv (1/2) and en tidel (1/10). For more than one part use “-deler”: to tredjedeler.',
      eq: '⚖️ Equal fractions', eq_d: 'Different numbers, the same amount: 1/2 = 2/4 = 3/6 = 4/8 = 5/10. Compare the coloured bars.',
      of: '🍎 A fraction of a number', of_d: 'To find 1/3 of 12, split 12 into 3 equal groups — each group has 4. And 2/3 is two such groups, so 8.', of_new: '🔄 Another example',
      words: '📖 Words', test: '▶️ Fractions test', test_d: '10 tasks: pictures, names, comparing and a fraction of a number.', back: '← Maths',
      q_pic: 'Which fraction is coloured?', q_word: 'Which fraction is it?', q_name: 'How do you say it in Norwegian?', q_cmp: 'Which fraction is bigger?', q_of: 'What is the answer?', q_eq: 'Which fraction is equal to this?',
      result: (a, b) => `${a} of ${b} correct`, again: '🔄 Again', lesson: '½ To the lesson', test_name: 'Fractions'
    },
    no: {
      title: '½ Brøk', module: 'Brøk', module_d: 'deler av en hel, navn på norsk og en prøve',
      intro: 'En brøk viser en del av en hel: pizzaen er delt i 4 stykker, og du har spist 3 – det er 3/4, «tre fjerdedeler». Trykk for å høre brøkene på norsk.',
      what: '🍕 Hva er en brøk', what_d: 'Tallet under streken (nevneren) forteller hvor mange like deler det hele er delt i. Tallet over (telleren) forteller hvor mange deler vi tar. Mellom dem står brøkstreken.',
      teller: 'teller: hvor mange deler vi tar', nevner: 'nevner: hvor mange like deler det hele har',
      build: '🧩 Lag en brøk', build_d: 'Endre tallene, så ser du brøken på en pizza og en stripe og hører navnet.',
      names: '🗣️ Navn på brøker', names_d: 'De fleste navnene er ordenstall + «-del»: tredjedel, fjerdedel … Unntak: en halv (1/2) og en tidel (1/10). Flere deler: «-deler» – to tredjedeler.',
      eq: '⚖️ Like store brøker', eq_d: 'Ulike tall, samme mengde: 1/2 = 2/4 = 3/6 = 4/8 = 5/10. Sammenlign de fargede stripene.',
      of: '🍎 Brøkdel av et tall', of_d: 'For å finne 1/3 av 12 deler du 12 i 3 like grupper – i hver gruppe er det 4. 2/3 er to slike grupper, altså 8.', of_new: '🔄 Nytt eksempel',
      words: '📖 Ord', test: '▶️ Prøve: brøk', test_d: '10 oppgaver: bilder, navn, sammenligning og brøkdel av et tall.', back: '← Matte',
      q_pic: 'Hvilken brøk er farget?', q_word: 'Hvilken brøk er det?', q_name: 'Hva heter brøken?', q_cmp: 'Hvilken brøk er størst?', q_of: 'Hvor mye blir det?', q_eq: 'Hvilken brøk er like stor?',
      result: (a, b) => `${a} av ${b} riktige`, again: '🔄 Igjen', lesson: '½ Til leksjonen', test_name: 'Brøk'
    },
    ar: {
      title: '½ الكسور', module: 'الكسور', module_d: 'أجزاء الكل وأسماؤها بالنرويجية واختبار',
      intro: 'الكسر جزء من كل: قُطّعت البيتزا 4 قطع وأكلت 3 — هذا 3/4، وبالنرويجية «tre fjerdedeler». اضغط لتسمع كل كسر بالنرويجية.',
      what: '🍕 ما هو الكسر', what_d: 'العدد السفلي (nevner — المقام) يقول إلى كم جزءًا متساويًا قُسّم الكل. والعدد العلوي (teller — البسط) يقول كم جزءًا أخذنا. وبينهما خط الكسر brøkstrek.',
      teller: 'teller — البسط: كم جزءًا أخذنا', nevner: 'nevner — المقام: عدد الأجزاء المتساوية',
      build: '🧩 صانع الكسور', build_d: 'غيّر الأعداد لترى الكسر على بيتزا وشريط وتسمع اسمه.',
      names: '🗣️ أسماء الكسور', names_d: 'معظم الأسماء عدد ترتيبي + «-del»: tredjedel وfjerdedel… الاستثناءات: en halv (1/2) وen tidel (1/10). لأكثر من جزء: «-deler» — to tredjedeler.',
      eq: '⚖️ كسور متساوية', eq_d: 'أعداد مختلفة والكمية نفسها: 1/2 = 2/4 = 3/6 = 4/8 = 5/10. قارن الأشرطة الملوّنة.',
      of: '🍎 كسر من عدد', of_d: 'لإيجاد 1/3 من 12 قسّم 12 إلى 3 مجموعات متساوية — في كل مجموعة 4. و2/3 مجموعتان، أي 8.', of_new: '🔄 مثال آخر',
      words: '📖 كلمات', test: '▶️ اختبار الكسور', test_d: '10 مهام: صور وأسماء ومقارنة وكسر من عدد.', back: '→ الرياضيات',
      q_pic: 'أي كسر ملوّن؟', q_word: 'أي كسر هذا؟', q_name: 'كيف يُقال بالنرويجية؟', q_cmp: 'أي كسر أكبر؟', q_of: 'كم الناتج؟', q_eq: 'أي كسر يساوي هذا؟',
      result: (a, b) => `${a} من ${b} صحيحة`, again: '🔄 مرة أخرى', lesson: '½ إلى الدرس', test_name: 'الكسور'
    }
  };
  if (window.KL_T_FILL) KL_T_FILL(FX, 'fractions.js:FX');
  const C = () => window.KomiksCore;
  const fx = (k, ...a) => { const t = FX[C().ui] || FX.en; const v = k in t ? t[k] : FX.en[k]; return typeof v === 'function' ? v(...a) : v; };
  const B = () => C().B;
  const word = (n, d) => B().fractionWord(n, d);
  const say = text => C().claim().then(() => C().Speech.speak(text, 'narrator', { rate: 0.9 }));
  const INK = '#141414', FILL = ['#ff7043', '#ffca28', '#42a5f5', '#66bb6a', '#ab47bc'];
  const colorOf = d => FILL[d % FILL.length];

  /* ---------- малюнки ---------- */
  // піца/коло на d частин, n зафарбовано
  function pieSVG(n, d, size = 120) {
    const r = 46, cx = 50, cy = 50, col = colorOf(d);
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fffbe8" stroke="${INK}" stroke-width="4"/>`;
    if (d === 1) s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${n ? col : '#fffbe8'}" stroke="${INK}" stroke-width="4"/>`;
    else for (let i = 0; i < d; i++) {
      const a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d;
      const p = (a) => `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
      s += `<path d="M${cx},${cy} L${p(a0)} A${r},${r} 0 ${d === 1 ? 1 : 0} 1 ${p(a1)} Z" fill="${i < n ? col : '#fffbe8'}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`;
    }
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${INK}" stroke-width="4"/>`;
    return `<svg class="fr-pie" viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${n}/${d}">${s}</svg>`;
  }
  // смужка на d клітинок, n зафарбовано
  function barSVG(n, d, w = 300) {
    const hgt = 40, cw = (w - 8) / d, col = colorOf(d);
    let s = '';
    for (let i = 0; i < d; i++) s += `<rect x="${(4 + i * cw).toFixed(2)}" y="4" width="${cw.toFixed(2)}" height="${hgt - 8}" fill="${i < n ? col : '#fffbe8'}" stroke="${INK}" stroke-width="3"/>`;
    return `<svg class="fr-bar" viewBox="0 0 ${w} ${hgt}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${n}/${d}">${s}</svg>`;
  }
  // total предметів у d групах, n груп підсвічено
  function groupsSVG(n, d, total) {
    const per = total / d, icon = ['🍎', '🍓', '🍪', '⭐', '🎈'][d % 5];
    const cols = Math.min(per, 5), rows = Math.ceil(per / 5), gw = cols * 22 + 14, gh = rows * 24 + 14, gap = 8;
    const perRow = Math.min(d, 5), w = perRow * (gw + gap) + gap, lines = Math.ceil(d / perRow), hgt = lines * (gh + gap) + gap;
    let s = '';
    for (let g = 0; g < d; g++) {
      const gx = gap + (g % perRow) * (gw + gap), gy = gap + Math.floor(g / perRow) * (gh + gap), on = g < n;
      s += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="10" fill="${on ? '#fff3c4' : '#f4f4f4'}" stroke="${on ? INK : '#9aa3ad'}" stroke-width="${on ? 3 : 2}" stroke-dasharray="${on ? '0' : '5 4'}"/>`;
      for (let i = 0; i < per; i++) s += `<text x="${gx + 7 + (i % 5) * 22 + 11}" y="${gy + 7 + Math.floor(i / 5) * 24 + 19}" text-anchor="middle" font-size="18" opacity="${on ? 1 : 0.45}">${icon}</text>`;
    }
    return `<svg class="fr-groups" viewBox="0 0 ${w} ${hgt}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${n}/${d} av ${total}">${s}</svg>`;
  }
  // записаний дріб: чисельник над рискою, знаменник під нею
  const fracEl = (n, d, cls = '') => { const { h } = C(); return h('span', { class: 'fr-num ' + cls, 'aria-label': `${n}/${d}` }, h('b', {}, String(n)), h('i', { 'aria-hidden': 'true' }), h('b', {}, String(d))); };

  /* ---------- урок ---------- */
  function render() {
    const K = C(), { h } = K;
    // 1) що таке дріб: 3/4 з підписами
    const anatomy = h('div', { class: 'fr-anatomy' },
      h('div', { class: 'fr-pic' }, K.svgEl(pieSVG(3, 4, 150))),
      h('div', { class: 'fr-parts' },
        h('button', { class: 'fr-part top', type: 'button', onclick: () => say('teller') }, h('b', {}, '3'), h('span', {}, fx('teller'))),
        h('button', { class: 'fr-part mid', type: 'button', onclick: () => say('brøkstrek') }, h('i'), h('span', {}, 'brøkstrek')),
        h('button', { class: 'fr-part bot', type: 'button', onclick: () => say('nevner') }, h('b', {}, '4'), h('span', {}, fx('nevner')))),
      h('button', { class: 'btn primary', type: 'button', onclick: () => say(word(3, 4)) }, '🔊 3/4 — ' + word(3, 4)));

    // 2) конструктор
    const st = { n: 3, d: 4 };
    const out = h('div', { class: 'fr-out' });
    let sayTimer = 0;
    const paint = (speak) => {
      out.replaceChildren(
        h('div', { class: 'fr-visual' }, K.svgEl(pieSVG(st.n, st.d, 140)), K.svgEl(barSVG(st.n, st.d))),
        h('div', { class: 'fr-name' }, fracEl(st.n, st.d, 'big'), h('button', { class: 'btn primary', type: 'button', onclick: () => say(word(st.n, st.d)) }, '🔊 ' + word(st.n, st.d))));
      clearTimeout(sayTimer);
      if (speak) sayTimer = setTimeout(() => say(word(st.n, st.d)), 350);
    };
    const step = (k, dlt) => {
      if (k === 'd') { st.d = Math.max(2, Math.min(10, st.d + dlt)); st.n = Math.min(st.n, st.d); }
      else st.n = Math.max(1, Math.min(st.d, st.n + dlt));
      paint(true);
    };
    const stepper = (k, label) => h('div', { class: 'fr-step' }, h('span', {}, label),
      h('button', { class: 'btn small', type: 'button', 'aria-label': '−', onclick: () => step(k, -1) }, '−'),
      h('button', { class: 'btn small', type: 'button', 'aria-label': '+', onclick: () => step(k, 1) }, '+'));
    paint(false);

    // 3) назви
    const names = [[1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10], [2, 3], [3, 4], [2, 5]];
    const nameGrid = h('div', { class: 'fr-names' }, names.map(([n, d]) => h('button', { class: 'fr-chip', type: 'button', onclick: () => say(word(n, d)) },
      K.svgEl(pieSVG(n, d, 56)), fracEl(n, d), h('small', {}, word(n, d)))));

    // 4) однакові дроби
    const eqRows = h('div', { class: 'fr-eq' }, [[1, 2], [2, 4], [3, 6], [4, 8], [5, 10]].map(([n, d]) => h('button', { class: 'fr-eq-row', type: 'button', onclick: () => say(word(n, d)) }, fracEl(n, d), K.svgEl(barSVG(n, d)))));

    // 5) частина від числа
    const tasks = B().fractionOfTasks().filter(([, d, t]) => t / d >= 2 && t <= 12);
    const ofBox = h('div', { class: 'fr-of' });
    const showOf = () => {
      const [n, d, t] = K.pick(tasks), ans = t / d * n;
      ofBox.replaceChildren(K.svgEl(groupsSVG(n, d, t)),
        h('div', { class: 'fr-of-eq' }, fracEl(n, d), h('span', {}, ` av ${t} = `), h('b', {}, String(ans))),
        h('button', { class: 'btn primary', type: 'button', onclick: () => say(B().fractionOf(n, d, t, true)) }, '🔊 ' + B().fractionOf(n, d, t, true)));
    };
    showOf();

    return h('section', { class: 'math-page fr-page' }, K.pageHead(fx('title'), '#/math'),
      h('p', { class: 'lead-p' }, fx('intro')),
      h('div', { class: 'box fr-cta' }, h('div', {}, h('b', {}, fx('test')), h('p', { class: 'hint' }, fx('test_d'))), h('a', { class: 'btn accent big', href: '#/quiz/math/frac' }, fx('test'))),
      h('div', { class: 'box' }, h('h3', {}, fx('what')), h('p', {}, fx('what_d')), anatomy),
      h('div', { class: 'box' }, h('h3', {}, fx('build')), h('p', { class: 'hint' }, fx('build_d')),
        h('div', { class: 'fr-steps' }, stepper('n', 'teller'), stepper('d', 'nevner')), out),
      h('div', { class: 'box' }, h('h3', {}, fx('names')), h('p', { class: 'hint' }, fx('names_d')), nameGrid),
      h('div', { class: 'box' }, h('h3', {}, fx('eq')), h('p', { class: 'hint' }, fx('eq_d')), eqRows),
      h('div', { class: 'box' }, h('h3', {}, fx('of')), h('p', { class: 'hint' }, fx('of_d')), ofBox, h('button', { class: 'btn', type: 'button', onclick: showOf }, fx('of_new'))),
      h('div', { class: 'box' }, h('h3', {}, fx('words')), h('div', { class: 'ph-grid' }, B().FRACTION_WORDS.map(w => h('button', { class: 'ph-chip', type: 'button', onclick: () => say(w) }, h('b', {}, w))))),
      h('div', { class: 'row-center' }, h('a', { class: 'btn accent big', href: '#/quiz/math/frac' }, fx('test'))));
  }

  /* ---------- тест: 10 завдань різних типів ---------- */
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const randFrac = (dMax = 10) => { const d = R(2, dMax); return [R(1, d - 1), d]; };
  const key2 = ([n, d]) => n + '/' + d;
  // варіанти-дроби: правильний + 3 інші (без однакових значень, щоб не було двох правильних)
  function fracOptions(right, make) {
    const seen = new Set([right[0] / right[1]]), out = [right];
    for (let g = 0; g < 80 && out.length < 4; g++) { const f = make(); const v = f[0] / f[1]; if (!seen.has(v)) { seen.add(v); out.push(f); } }
    return C().shuffle(out);
  }
  function buildQuestions() {
    const K = C(), types = K.shuffle(['pic', 'pic', 'word', 'word', 'name', 'cmp', 'cmp', 'of', 'of', 'eq']);
    return types.map(type => {
      if (type === 'pic' || type === 'word') {
        const f = randFrac(type === 'pic' ? 8 : 10);
        return { type, f, options: fracOptions(f, () => (Math.random() < 0.5 ? [R(1, f[1] - 1), f[1]] : randFrac(type === 'pic' ? 8 : 10))), answer: key2(f), sayText: word(...f) };
      }
      if (type === 'name') {
        const f = randFrac(10);
        return { type, f, options: fracOptions(f, () => (Math.random() < 0.5 ? [f[0], R(f[0] + 1, 10)] : randFrac(10))), answer: key2(f), sayText: word(...f) };
      }
      if (type === 'cmp') {
        // однакові знаменники або однакові чисельники — так порівняння можна побачити й зрозуміти
        let a, b;
        do {
          if (Math.random() < 0.5) { const d = R(3, 10); a = [R(1, d - 1), d]; b = [R(1, d - 1), d]; }
          else { const n = R(1, 3); a = [n, R(n + 1, 10)]; b = [n, R(n + 1, 10)]; }
        } while (a[0] / a[1] === b[0] / b[1]);
        const big = a[0] / a[1] > b[0] / b[1] ? a : b;
        return { type, options: K.shuffle([a, b]), answer: key2(big), sayText: word(...big) };
      }
      if (type === 'of') {
        const [n, d, t] = K.pick(B().fractionOfTasks()), ans = t / d * n;
        const near = new Set([ans]);
        for (let g = 0; near.size < 4 && g < 60; g++) { const v = K.pick([t / d, t - ans, ans + 1, ans - 1, ans + 2, t, n, d, ans * 2]); if (v >= 0 && v <= 20 && Number.isInteger(v)) near.add(v); }
        return { type, f: [n, d], t, options: K.shuffle([...near]), answer: ans, sayText: B().fractionOf(n, d, t, true), askText: B().fractionOf(n, d, t, false) };
      }
      // eq: 1/2 = ? → 2/4
      const base = K.pick([[1, 2], [1, 3], [1, 4], [2, 3], [1, 5], [3, 4], [2, 5]]), m = R(2, Math.floor(10 / base[1]));
      const right = [base[0] * m, base[1] * m];
      const opts = fracOptions(right, () => { const d = R(2, 10); return [R(1, d - 1), d]; });
      return { type, f: base, options: opts, answer: key2(right), sayText: word(...right), showText: word(...base) + ' = ' + word(...right) };
    });
  }
  const PROMPT_NO = { pic: 'Hvilken brøk er farget?', word: 'Hvilken brøk er det?', name: 'Hva heter brøken?', cmp: 'Hvilken brøk er størst?', of: 'Hvor mye blir det?', eq: 'Hvilken brøk er like stor?' };
  function quiz() {
    const K = C(), { h } = K;
    const S = { qs: buildQuestions(), i: 0, score: 0 };
    const root = h('section', { class: 'quiz math-quiz fr-quiz' });
    const draw = () => {
      if (S.i >= S.qs.length) return result();
      const q = S.qs[S.i];
      const tr = K.both(FX.uk['q_' + q.type], FX.en['q_' + q.type]);
      const card = h('div', { class: 'q-card' }, window.KomiksIcons ? window.KomiksIcons.chip('math', 'Brøk') : h('span', { class: 'q-type' }, '½ Brøk'),
        K.withTr(h('h3', { class: 'q-title' }, PROMPT_NO[q.type]), tr));
      const listen = q.type === 'word' ? q.sayText : q.type === 'of' ? q.askText : null;
      let prompt;
      if (q.type === 'pic') prompt = h('div', { class: 'fr-q-pic' }, K.svgEl(pieSVG(q.f[0], q.f[1], 150)));
      else if (q.type === 'word') prompt = h('div', { class: 'fr-q-word' }, h('button', { class: 'big-play', type: 'button', 'aria-label': 'Lytt', onclick: () => say(listen) }, '🔊'), h('b', {}, q.sayText));
      else if (q.type === 'name') prompt = h('div', { class: 'fr-q-pic' }, fracEl(q.f[0], q.f[1], 'big'), K.svgEl(barSVG(q.f[0], q.f[1], 260)));
      else if (q.type === 'cmp') prompt = null;
      else if (q.type === 'of') prompt = h('div', { class: 'fr-q-pic' }, h('button', { class: 'big-play', type: 'button', 'aria-label': 'Lytt', onclick: () => say(listen) }, '🔊'), h('div', { class: 'math-expr' }, fracEl(q.f[0], q.f[1]), ` av ${q.t} = ?`));
      else prompt = h('div', { class: 'fr-q-pic' }, h('div', { class: 'math-expr' }, fracEl(q.f[0], q.f[1], 'big'), ' = ?'), K.svgEl(barSVG(q.f[0], q.f[1], 260)));
      if (listen) setTimeout(() => say(listen), 350);
      const opts = h('div', { class: 'opts two fr-opts' + (q.type === 'name' ? ' fr-words' : '') });
      const keyOf = o => (Array.isArray(o) ? key2(o) : o);
      let tries = 0;
      q.options.forEach(o => {
        const label = q.type === 'name' ? h('span', { class: 'fr-opt-word' }, word(...o))
          : q.type === 'cmp' ? h('span', { class: 'fr-opt-cmp' }, K.svgEl(pieSVG(o[0], o[1], 84)), fracEl(o[0], o[1]))
          : Array.isArray(o) ? fracEl(o[0], o[1], 'big') : h('span', { class: 'big-letter' }, String(o));
        const b = h('button', { class: 'opt', type: 'button' }, label);
        b.addEventListener('click', () => {
          if (opts.classList.contains('locked') || b.disabled) return;
          const ok = keyOf(o) === q.answer;
          // друга спроба, як у тестах математики; бал — лише з першої
          if (!ok && tries === 0) { tries++; b.classList.add('bad'); b.disabled = true; K.Sfx.bad(); K.cheer(false); return; }
          opts.classList.add('locked');
          K.$$('.opt', opts).forEach((x, j) => { if (keyOf(q.options[j]) === q.answer) x.classList.add('good'); else if (x !== b && !x.disabled) x.classList.add('dim'); });
          if (!ok) b.classList.add('bad');
          if (ok && tries === 0) S.score++;
          if (ok) { K.Sfx.good(); K.cheer(true, q.sayText); } else { K.Sfx.bad(); say(q.sayText); }
          card.append(h('div', { class: 'feedback ' + (ok ? 'ok' : 'no') }, h('span', { style: { fontSize: '2rem' } }, ok ? '🎉' : '🤔'), h('span', { class: 'msg' }, h('em', {}, q.showText || q.sayText)),
            h('button', { class: 'btn ' + (ok ? 'good' : 'yellow'), type: 'button', onclick: () => { S.i++; draw(); } }, S.i + 1 < S.qs.length ? 'Neste ▶' : 'Resultat 🏁')));
        });
        opts.append(b);
      });
      if (prompt) card.append(h('div', { class: 'q-prompt center math-prompt' }, prompt));
      card.append(opts);
      root.replaceChildren(h('div', { class: 'q-head' }, h('a', { class: 'btn', href: '#/math/fractions' }, fx('lesson')), h('h2', {}, fx('title')), h('span', { class: 'stat' }, `⭐ ${S.score}`)),
        h('div', { class: 'bar' }, h('i', { style: { width: (S.i / S.qs.length * 100) + '%' } })), card);
    };
    const result = () => {
      const pct = Math.round(S.score / S.qs.length * 100);
      K.recordQuiz('math:frac', '½ ' + fx('test_name'), S.score, S.qs.length);
      if (pct >= 60) { K.confetti(); K.Sfx.win(); }
      root.replaceChildren(h('div', { class: 'q-card result' }, h('div', { class: 'big-stars' }, K.stars(pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0)),
        h('h2', {}, fx('result', S.score, S.qs.length)),
        h('div', { class: 'row-center' }, h('button', { class: 'btn accent', type: 'button', onclick: () => { S.qs = buildQuestions(); S.i = 0; S.score = 0; draw(); } }, fx('again')), h('a', { class: 'btn', href: '#/math/fractions' }, fx('lesson'))),
        window.KomiksExtras && window.KomiksExtras.shareResult ? window.KomiksExtras.shareResult({ title: fx('test_name'), score: S.score, total: S.qs.length }) : null));
    };
    draw();
    return root;
  }

  // плитка на сторінці математики
  function promo() {
    const K = C(), { h } = K;
    return h('div', { class: 'box fr-promo' },
      h('div', { class: 'fr-promo-art', 'aria-hidden': 'true' }, K.svgEl(pieSVG(3, 4, 96)), K.svgEl(pieSVG(1, 2, 72))),
      h('div', {}, h('h3', {}, fx('title')), h('p', { class: 'hint' }, fx('module_d')),
        h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/math/fractions' }, fx('lesson')), h('a', { class: 'btn', href: '#/quiz/math/frac' }, fx('test')))));
  }

  window.KomiksFractions = { render, quiz, promo, pieSVG, barSVG, text: fx };
})();
