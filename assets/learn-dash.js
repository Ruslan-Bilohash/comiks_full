/* Комікс·Lab — 📊 дашборд навчання в кабінеті (#/account/learn).
 * Усе рахується з прогресу акаунта (той самий, що синхронізується між пристроями): журнал тестів
 * (quizlog: результат, дата, час проходження), дні активності, журнал помилок з інтервальним
 * повторенням (errlog / errFixed), картки слів (cards), «знаю» (wordsKnown), активний час (usageSec).
 * Період 7/30/90 днів порівнюється з попереднім таким самим. Графіки — власний SVG, без бібліотек. */
(() => {
  'use strict';
  const K = () => window.KomiksCore;
  const C = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#6250d6'];
  const L = {
    uk: { title: '📊 Моє навчання', sub: 'Як іде навчання: результати, ефективність, слова й помилки. Порівняння — з попереднім таким самим періодом.',
      p: { 7: '7 днів', 30: '30 днів', 90: '90 днів' }, lang: { all: 'Усе', no: '🇳🇴 Норвезька', en: '🇬🇧 Англійська' },
      k_tests: 'Пройдено тестів', k_acc: 'Середня точність', k_days: 'Днів навчання', k_words: 'Слів вивчено', k_fixed: 'Помилок виправлено', k_time: 'Активний час',
      h_tests: 'тестів за період', h_acc: 'правильних відповідей', h_days: n => `серія: ${n} дн. поспіль`, h_words: n => `+${n} за період`, h_fixed: n => `у роботі: ${n}`, h_time: 'на сайті за весь час', h_speed: s => `≈ ${s} с на тест`,
      chart: '📈 Результати за днями', chart_d: 'Стовпчики — кількість тестів, лінія — середня точність.', tests: 'тестів', acc: 'точність',
      cal: '🗓 Календар навчання', cal_d: 'Дні з активністю за 17 тижнів — що темніше, то більше тестів.', less: 'менше', more: 'більше',
      areas: '🎯 Ефективність за розділами', areas_d: 'Середня точність і кількість спроб у кожному розділі за період.', tries: n => `${n} спроб`, none_area: 'За цей період тестів ще немає.',
      words: '🃏 Слова', words_d: 'Де зараз твої слова в інтервальному повторенні.', st_new: 'нові', st_learn: 'вчу', st_rev: 'закріплюю', st_known: 'знаю', due: n => `Сьогодні на повторення: ${n}`, go_cards: '🃏 Повторити картки',
      errs: '🔁 Робота над помилками', errs_d: 'Помилка вважається виправленою, коли відповідаєш правильно сьогодні, через день і ще через 3 дні.',
      e_today: 'на сьогодні', e_later: 'чекають терміну', e_fixed: 'виправлено за період', top: 'Найчастіші помилки', go_err: '🔁 Пройти помилки', go_an: '📊 Повний розбір',
      recent: '🧾 Останні тести', r_when: 'Коли', r_what: 'Тест', r_res: 'Результат', r_time: 'Час', none: 'Ще немає пройдених тестів — почни з будь-якого, і тут з’являться графіки.',
      tips: '💡 Що робити далі', t_weak: (a, p) => `Найслабше зараз — «${a}» (${p}%). Повтори цей розділ.`, t_err: n => `${n} помилок чекають повторення сьогодні.`, t_cards: n => `${n} карток на повторення — 5 хвилин, і готово.`,
      t_streak0: 'Почни серію: один тест на день — і календар заповниться.', t_good: 'Чудовий темп! Спробуй тест наступного рівня.', open: 'Відкрити →',
      area: { comics: '📖 Комікси', level: '🏆 Тести рівнів', grammar: '📐 Граматика', words: '📝 Слова', basics: '🔤 Алфавіт і числа', math: '🧮 Математика й логіка', english: '🇬🇧 Англійська', games: '🎮 Ігри разом', chess: '♟ Шахи', mistakes: '🔁 Помилки', other: '🧩 Інше' } },
    en: { title: '📊 My learning', sub: 'How your learning is going: results, effectiveness, words and mistakes. Compared with the previous period of the same length.',
      p: { 7: '7 days', 30: '30 days', 90: '90 days' }, lang: { all: 'All', no: '🇳🇴 Norwegian', en: '🇬🇧 English' },
      k_tests: 'Quizzes completed', k_acc: 'Average accuracy', k_days: 'Study days', k_words: 'Words learned', k_fixed: 'Mistakes fixed', k_time: 'Active time',
      h_tests: 'quizzes in the period', h_acc: 'correct answers', h_days: n => `streak: ${n} days`, h_words: n => `+${n} in the period`, h_fixed: n => `in progress: ${n}`, h_time: 'on the site in total', h_speed: s => `≈ ${s} s per quiz`,
      chart: '📈 Results by day', chart_d: 'Bars — number of quizzes, line — average accuracy.', tests: 'quizzes', acc: 'accuracy',
      cal: '🗓 Study calendar', cal_d: 'Active days over 17 weeks — the darker, the more quizzes.', less: 'less', more: 'more',
      areas: '🎯 Effectiveness by section', areas_d: 'Average accuracy and number of attempts per section in the period.', tries: n => `${n} attempts`, none_area: 'No quizzes in this period yet.',
      words: '🃏 Words', words_d: 'Where your words are in spaced repetition.', st_new: 'new', st_learn: 'learning', st_rev: 'reviewing', st_known: 'known', due: n => `Due for review today: ${n}`, go_cards: '🃏 Review cards',
      errs: '🔁 Working on mistakes', errs_d: 'A mistake counts as fixed after correct answers today, a day later and 3 days later.',
      e_today: 'due today', e_later: 'waiting', e_fixed: 'fixed in the period', top: 'Most frequent mistakes', go_err: '🔁 Practise mistakes', go_an: '📊 Full analysis',
      recent: '🧾 Recent quizzes', r_when: 'When', r_what: 'Quiz', r_res: 'Result', r_time: 'Time', none: 'No quizzes yet — take any one and the charts will appear here.',
      tips: '💡 What to do next', t_weak: (a, p) => `Weakest right now: “${a}” (${p}%). Practise this section.`, t_err: n => `${n} mistakes are due for review today.`, t_cards: n => `${n} cards to review — 5 minutes and done.`,
      t_streak0: 'Start a streak: one quiz a day and the calendar fills up.', t_good: 'Great pace! Try a quiz at the next level.', open: 'Open →',
      area: { comics: '📖 Comics', level: '🏆 Level tests', grammar: '📐 Grammar', words: '📝 Words', basics: '🔤 Alphabet & numbers', math: '🧮 Maths & logic', english: '🇬🇧 English', games: '🎮 Games together', chess: '♟ Chess', mistakes: '🔁 Mistakes', other: '🧩 Other' } },
    no: { title: '📊 Min læring', sub: 'Hvordan læringen går: resultater, effektivitet, ord og feil. Sammenlignet med forrige periode av samme lengde.',
      p: { 7: '7 dager', 30: '30 dager', 90: '90 dager' }, lang: { all: 'Alt', no: '🇳🇴 Norsk', en: '🇬🇧 Engelsk' },
      k_tests: 'Fullførte prøver', k_acc: 'Gjennomsnittlig treff', k_days: 'Læringsdager', k_words: 'Lærte ord', k_fixed: 'Rettede feil', k_time: 'Aktiv tid',
      h_tests: 'prøver i perioden', h_acc: 'riktige svar', h_days: n => `rekke: ${n} dager`, h_words: n => `+${n} i perioden`, h_fixed: n => `under arbeid: ${n}`, h_time: 'på nettsiden totalt', h_speed: s => `≈ ${s} s per prøve`,
      chart: '📈 Resultater per dag', chart_d: 'Søyler — antall prøver, linje — gjennomsnittlig treff.', tests: 'prøver', acc: 'treff',
      cal: '🗓 Læringskalender', cal_d: 'Aktive dager de siste 17 ukene — jo mørkere, jo flere prøver.', less: 'mindre', more: 'mer',
      areas: '🎯 Effektivitet per del', areas_d: 'Gjennomsnittlig treff og antall forsøk per del i perioden.', tries: n => `${n} forsøk`, none_area: 'Ingen prøver i denne perioden ennå.',
      words: '🃏 Ord', words_d: 'Hvor ordene dine er i repetisjonen.', st_new: 'nye', st_learn: 'lærer', st_rev: 'repeterer', st_known: 'kan', due: n => `Til repetisjon i dag: ${n}`, go_cards: '🃏 Repeter kort',
      errs: '🔁 Arbeid med feil', errs_d: 'En feil regnes som rettet etter riktige svar i dag, i morgen og om tre dager.',
      e_today: 'i dag', e_later: 'venter', e_fixed: 'rettet i perioden', top: 'Hyppigste feil', go_err: '🔁 Øv på feil', go_an: '📊 Full analyse',
      recent: '🧾 Siste prøver', r_when: 'Når', r_what: 'Prøve', r_res: 'Resultat', r_time: 'Tid', none: 'Ingen prøver ennå — ta en hvilken som helst, så kommer grafene her.',
      tips: '💡 Hva nå', t_weak: (a, p) => `Svakest nå: «${a}» (${p} %). Øv på denne delen.`, t_err: n => `${n} feil venter på repetisjon i dag.`, t_cards: n => `${n} kort å repetere — 5 minutter, så er det gjort.`,
      t_streak0: 'Start en rekke: én prøve om dagen, så fylles kalenderen.', t_good: 'Flott tempo! Prøv en prøve på neste nivå.', open: 'Åpne →',
      area: { comics: '📖 Tegneserier', level: '🏆 Nivåprøver', grammar: '📐 Grammatikk', words: '📝 Ord', basics: '🔤 Alfabet og tall', math: '🧮 Matte og logikk', english: '🇬🇧 Engelsk', games: '🎮 Spill sammen', chess: '♟ Sjakk', mistakes: '🔁 Feil', other: '🧩 Annet' } },
  };
  if (window.KL_T_FILL) KL_T_FILL(L, 'learn-dash.js:L');
  const AREA_HREF = { comics: '#/', level: '#/tests', grammar: '#/grammar', words: '#/words', basics: '#/numbers', math: '#/math', english: '#/english', games: '#/game', chess: '#/chess', mistakes: '#/analysis', other: '#/tests' };
  const pad = n => String(n).padStart(2, '0');
  const dayOf = d => { const x = d instanceof Date ? d : new Date(d); return isNaN(x) ? '' : x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate()); };
  const daysBack = (n, from = 0) => { const out = []; for (let i = n - 1 + from; i >= from; i--) { const d = new Date(); d.setDate(d.getDate() - i); out.push(dayOf(d)); } return out; };
  const langOf = key => /^en[:-]/.test(String(key)) ? 'en' : 'no';
  function areaOf(key) {
    const k = String(key);
    if (/^en[:-]/.test(k)) return 'english';
    if (k.startsWith('grammar') || k === 'clock') return 'grammar';
    if (k.startsWith('words')) return 'words';
    if (['alphabet', 'numbers'].includes(k) || k.startsWith('numbers')) return 'basics';
    if (k.startsWith('level')) return 'level';
    if (k.startsWith('math') || k === 'rocket' || k.startsWith('race')) return 'math';
    if (k.startsWith('game')) return 'games';
    if (k.startsWith('chess')) return 'chess';
    if (k === 'mistakes') return 'mistakes';
    return (K().COMICS || []).some(c => c.id === k) ? 'comics' : 'other';
  }

  /* ---------- маленька SVG-бібліотека ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  function S(tag, attrs = {}, ...kids) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined) el.setAttribute(k, String(v));
    kids.flat().forEach(c => { if (c === null || c === undefined) return; el.append(typeof c === 'object' ? c : document.createTextNode(String(c))); });
    return el;
  }
  function spark(vals, color) {
    if (vals.length < 2) return null;
    const max = Math.max(1, ...vals), w = 120, hh = 28;
    const pts = vals.map((v, i) => (i / (vals.length - 1) * w).toFixed(1) + ',' + (hh - 2 - v / max * (hh - 4)).toFixed(1)).join(' ');
    return S('svg', { class: 'ld-spark', viewBox: `0 0 ${w} ${hh}`, preserveAspectRatio: 'none', 'aria-hidden': 'true' },
      S('polyline', { points: pts, fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' }));
  }
  // стовпчики (тести) + лінія (точність, %) по днях; підказка — <title> у кожному стовпчику
  function combo(days, bars, line, T) {
    const W = 720, H = 230, Lm = 34, Rm = 40, Tm = 12, Bm = 26, pw = W - Lm - Rm, ph = H - Tm - Bm, n = days.length;
    const bmax = Math.max(2, ...bars), bw = pw / n;
    const g = [];
    for (let k = 0; k <= 4; k++) {
      const y = Tm + ph - ph * k / 4;
      g.push(S('line', { x1: Lm, x2: W - Rm, y1: y, y2: y, class: 'ld-gl' }),
        S('text', { x: Lm - 6, y: y + 4, class: 'ld-ax', 'text-anchor': 'end' }, Math.round(bmax * k / 4)),
        S('text', { x: W - Rm + 6, y: y + 4, class: 'ld-ax' }, (25 * k) + '%'));
    }
    const step = Math.max(1, Math.ceil(n / 8));
    days.forEach((d, i) => { if (i % step === 0) g.push(S('text', { x: Lm + (i + .5) * bw, y: H - 8, class: 'ld-ax', 'text-anchor': 'middle' }, d.slice(8) + '.' + d.slice(5, 7))); });
    bars.forEach((v, i) => {
      const hh = v / bmax * ph, x = Lm + i * bw + Math.max(1, bw * .15), w = Math.max(1, bw * .7);
      g.push(S('rect', { x, y: Tm + ph - hh, width: w, height: Math.max(0, hh), rx: Math.min(4, w / 2), fill: C[0], opacity: .85 },
        S('title', {}, `${d2(days[i])} · ${v} ${T.tests}${line[i] !== null ? ' · ' + line[i] + '%' : ''}`)));
    });
    let path = '';
    line.forEach((v, i) => { if (v === null) return; path += (path ? 'L' : 'M') + (Lm + (i + .5) * bw).toFixed(1) + ' ' + (Tm + ph - v / 100 * ph).toFixed(1); });
    if (path) g.push(S('path', { d: path, fill: 'none', stroke: C[1], 'stroke-width': 2.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    line.forEach((v, i) => { if (v !== null) g.push(S('circle', { cx: Lm + (i + .5) * bw, cy: Tm + ph - v / 100 * ph, r: 3.2, fill: C[1] }, S('title', {}, `${d2(days[i])} · ${T.acc} ${v}%`))); });
    return S('svg', { class: 'ld-combo', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': T.chart }, g);
  }
  const d2 = d => d.slice(8) + '.' + d.slice(5, 7);

  /* opts.store — чужі дані (батьки/вчитель бачать прогрес учня, assets/watch.js), opts.readonly —
     без кнопок «пройти»/«повторити», opts.title — заголовок замість «Моє навчання». */
  function render(opts = {}) {
    const { h, ui, COMICS } = K();
    const store = opts.store || K().store;
    const errList = lang => opts.store
      ? Object.entries(store.get('errlog', {}) || {}).map(([k, v]) => Object.assign({ k }, v)).filter(e => (e.lang || 'no') === lang).sort((a, b) => (b.n || 0) - (a.n || 0))
      : K().errs.list(lang);
    const T = L[ui] || L.en;
    let period = 30, lang = 'all';
    try { period = +localStorage.getItem('comiks.ldPeriod') || 30; lang = localStorage.getItem('comiks.ldLang') || 'all'; } catch { /* приватний режим */ }
    const root = h('div', { class: 'ld' });
    const draw = () => {
      const log = (store.get('quizlog', []) || []).filter(q => q && q.date && (lang === 'all' || langOf(q.key) === lang));
      const cur = daysBack(period), prev = daysBack(period, period);
      const inCur = new Set(cur), inPrev = new Set(prev);
      const curLog = log.filter(q => inCur.has(dayOf(q.date))), prevLog = log.filter(q => inPrev.has(dayOf(q.date)));
      const acc = list => { const t = list.reduce((s, q) => s + (q.total | 0), 0); return t ? Math.round(list.reduce((s, q) => s + (q.score | 0), 0) / t * 100) : null; };
      const actDays = new Set(store.get('days', []) || []);
      const daysIn = list => list.filter(d => actDays.has(d)).length;
      let streak = 0; { const d = new Date(); if (!actDays.has(dayOf(d))) d.setDate(d.getDate() - 1); while (actDays.has(dayOf(d))) { streak++; d.setDate(d.getDate() - 1); } }
      const known = (store.get('wordsKnown', []) || []).length + (store.get('wordsKnownEn', []) || []).length;
      const cards = store.get('cards', {}) || {};
      const cv = Object.values(cards);
      const learnedIn = list => cv.filter(c => c && c.known && c.learned && list.includes(dayOf(c.learned))).length;
      const fixed = store.get('errFixed', []) || [];
      const fixedIn = list => fixed.filter(f => list.includes(dayOf(f.d))).length;
      const errs = [...errList('no'), ...errList('en')].filter(e => lang === 'all' || (e.lang || 'no') === lang);
      const secs = curLog.map(q => q.sec | 0).filter(Boolean);
      const usage = store.get('usageSec', 0) | 0;
      const perDay = d => curLog.filter(q => dayOf(q.date) === d);
      const series = cur.map(d => perDay(d).length);
      const accSeries = cur.map(d => acc(perDay(d)));
      const delta = (now, before, suffix = '%') => {
        if (before === null || now === null) return null;
        if (!before) return now ? h('span', { class: 'ld-d up' }, '▲') : null;
        const p = suffix === 'pp' ? now - before : Math.round((now - before) / before * 100);
        return p ? h('span', { class: 'ld-d ' + (p > 0 ? 'up' : 'down') }, (p > 0 ? '▲ ' : '▼ ') + Math.abs(p) + (suffix === 'pp' ? (ui === 'uk' ? ' п.п.' : ' pp') : '%')) : h('span', { class: 'ld-d' }, '0');
      };
      const fmtTime = s => s >= 3600 ? (s / 3600).toFixed(s < 36000 ? 1 : 0).replace('.', ',') + ' год' : Math.round(s / 60) + ' хв';
      const timeTxt = s => ui === 'uk' ? fmtTime(s) : (s >= 3600 ? (s / 3600).toFixed(1) + ' h' : Math.round(s / 60) + ' min');
      const kpi = (label, val, d, hint, sp, col) => h('div', { class: 'ld-kpi' }, h('small', {}, label), h('div', { class: 'ld-n' }, h('b', {}, val), d), h('span', { class: 'ld-hint' }, hint), sp ? spark(sp, col) : null);
      const aNow = acc(curLog), aPrev = acc(prevLog);
      const kpis = h('div', { class: 'ld-kpis' },
        kpi(T.k_tests, curLog.length, delta(curLog.length, prevLog.length), secs.length ? T.h_speed(Math.round(secs.reduce((a, b) => a + b, 0) / secs.length)) : T.h_tests, series, C[0]),
        kpi(T.k_acc, aNow === null ? '—' : aNow + '%', delta(aNow, aPrev, 'pp'), T.h_acc, accSeries.map(v => v || 0), C[1]),
        kpi(T.k_days, daysIn(cur), delta(daysIn(cur), daysIn(prev)), T.h_days(streak), cur.map(d => actDays.has(d) ? 1 : 0), C[2]),
        kpi(T.k_words, known, null, T.h_words(learnedIn(cur)), null),
        kpi(T.k_fixed, fixedIn(cur), delta(fixedIn(cur), fixedIn(prev)), T.h_fixed(errs.length), cur.map(d => fixed.filter(f => dayOf(f.d) === d).length), C[4]),
        kpi(T.k_time, usage ? timeTxt(usage) : '—', null, T.h_time, null));

      // календар 17 тижнів: колір — кількість тестів (або просто активний день)
      const allByDay = {}; log.forEach(q => { const d = dayOf(q.date); allByDay[d] = (allByDay[d] || 0) + 1; });
      const start = new Date(); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - 16 * 7);
      const weeks = [];
      for (let w = 0; w < 17; w++) {
        const col = [];
        for (let d = 0; d < 7; d++) {
          const x = new Date(start); x.setDate(start.getDate() + w * 7 + d);
          const ds = dayOf(x), n = allByDay[ds] || 0, fut = x > new Date();
          const lvl = fut ? 'fut' : n >= 5 ? 'l4' : n >= 3 ? 'l3' : n >= 1 ? 'l2' : actDays.has(ds) ? 'l1' : '';
          col.push(h('i', { class: lvl, title: `${d2(ds)}.${ds.slice(0, 4)} · ${n} ${T.tests}` }));
        }
        weeks.push(h('span', { class: 'ld-w' }, col));
      }
      const cal = h('section', { class: 'ld-card' }, h('h3', {}, T.cal), h('p', { class: 'ld-sub' }, T.cal_d), h('div', { class: 'ld-cal' }, weeks),
        h('div', { class: 'ld-lg' }, T.less, ...['', 'l1', 'l2', 'l3', 'l4'].map(c => h('i', { class: c })), T.more));

      // ефективність за розділами
      const byArea = {};
      curLog.forEach(q => { const a = areaOf(q.key); (byArea[a] = byArea[a] || []).push(q); });
      const areaRows = Object.entries(byArea).map(([a, list]) => ({ a, n: list.length, p: acc(list) || 0 })).sort((x, y) => y.n - x.n);
      const areas = h('section', { class: 'ld-card' }, h('h3', {}, T.areas), h('p', { class: 'ld-sub' }, T.areas_d),
        areaRows.length ? h('ul', { class: 'ld-hb' }, areaRows.map(r => h('li', {},
          h('a', { href: AREA_HREF[r.a] || '#/' }, T.area[r.a] || r.a),
          h('span', { class: 'ld-bar' }, h('i', { style: { width: Math.max(3, r.p) + '%', background: r.p >= 80 ? C[2] : r.p >= 60 ? C[3] : C[1] } })),
          h('b', {}, r.p + '%'), h('small', {}, T.tries(r.n))))) : h('p', { class: 'ld-empty' }, T.none_area));

      // слова: стадії інтервального повторення
      const st = { new: 0, learn: 0, rev: 0, known: 0 };
      cv.forEach(c => { if (!c) return; if (c.known) st.known++; else if ((c.box | 0) >= 3) st.rev++; else if ((c.box | 0) >= 1) st.learn++; else st.new++; });
      st.known = Math.max(st.known, known);
      const totW = Math.max(1, st.new + st.learn + st.rev + st.known);
      const dueCards = cv.filter(c => c && !c.known && c.due && c.due <= Date.now()).length;
      const words = h('section', { class: 'ld-card' }, h('h3', {}, T.words), h('p', { class: 'ld-sub' }, T.words_d),
        h('div', { class: 'ld-stack' }, [['new', C[5]], ['learn', C[1]], ['rev', C[3]], ['known', C[2]]].map(([k, col]) => st[k] ? h('i', { style: { flex: String(st[k]), background: col }, title: `${T['st_' + k]}: ${st[k]}` }) : null)),
        h('ul', { class: 'ld-legend' }, [['new', C[5]], ['learn', C[1]], ['rev', C[3]], ['known', C[2]]].map(([k, col]) => h('li', {}, h('i', { style: { background: col } }), T['st_' + k], h('b', {}, String(st[k]))))),
        h('p', { class: 'ld-due' }, T.due(dueCards)), opts.readonly ? null : h('a', { class: 'btn small', href: '#/cards' }, T.go_cards));
      void totW;

      // помилки
      const dueE = errs.filter(e => (e.due || 0) <= Date.now()).length;
      const errBox = h('section', { class: 'ld-card' }, h('h3', {}, T.errs), h('p', { class: 'ld-sub' }, T.errs_d),
        h('div', { class: 'ld-trio' }, h('div', {}, h('b', {}, String(dueE)), h('span', {}, T.e_today)), h('div', {}, h('b', {}, String(errs.length - dueE)), h('span', {}, T.e_later)), h('div', {}, h('b', {}, String(fixedIn(cur))), h('span', {}, T.e_fixed))),
        errs.length ? h('div', {}, h('h4', {}, T.top), h('ol', { class: 'ld-top' }, errs.slice(0, 5).map(e => h('li', {}, h('b', {}, e.k), e.uk || e.en ? h('small', {}, ' — ' + (ui === 'uk' ? e.uk || e.en : e.en || e.uk)) : null, h('span', { class: 'ld-x' }, '×' + e.n))))) : null,
        opts.readonly ? null : h('div', { class: 'ld-btns' }, dueE ? h('a', { class: 'btn small accent', href: '#/quiz/mistakes' }, T.go_err) : null, h('a', { class: 'btn small', href: '#/analysis' }, T.go_an)));

      // останні тести
      const recent = h('section', { class: 'ld-card ld-span2' }, h('h3', {}, T.recent),
        log.length ? h('div', { class: 'ld-scroll' }, h('table', { class: 'ld-t' }, h('thead', {}, h('tr', {}, [T.r_when, T.r_what, T.r_res, T.r_time].map(x => h('th', {}, x)))),
          h('tbody', {}, log.slice(0, 12).map(q => { const p = q.total ? Math.round(q.score / q.total * 100) : 0; return h('tr', {},
            h('td', {}, d2(dayOf(q.date))), h('td', {}, String(q.title || q.key)), h('td', {}, h('span', { class: 'ld-pill ' + (p >= 80 ? 'g' : p >= 60 ? 'y' : 'r') }, `${q.score}/${q.total} · ${p}%`), ' ', '⭐'.repeat(q.stars | 0)),
            h('td', {}, q.sec ? (q.sec >= 60 ? Math.floor(q.sec / 60) + ':' + pad(q.sec % 60) : q.sec + ' с') : '—')); })))) : h('p', { class: 'ld-empty' }, T.none));

      // поради
      const tips = [];
      const weak = areaRows.filter(r => r.n >= 2).sort((x, y) => x.p - y.p)[0];
      if (weak && weak.p < 75) tips.push([T.t_weak(T.area[weak.a] || weak.a, weak.p), AREA_HREF[weak.a]]);
      if (dueE) tips.push([T.t_err(dueE), '#/quiz/mistakes']);
      if (dueCards) tips.push([T.t_cards(dueCards), '#/cards']);
      if (!streak) tips.push([T.t_streak0, '#/today']);
      if (aNow !== null && aNow >= 85 && curLog.length >= 3) tips.push([T.t_good, '#/tests']);
      const tipBox = tips.length && !opts.readonly ? h('section', { class: 'ld-card ld-tips' }, h('h3', {}, T.tips), h('ul', {}, tips.map(([text, href]) => h('li', {}, text, ' ', h('a', { href }, T.open))))) : null;

      const chart = h('section', { class: 'ld-card ld-span2' }, h('h3', {}, T.chart), h('p', { class: 'ld-sub' }, T.chart_d),
        curLog.length ? combo(cur, series, accSeries, T) : h('p', { class: 'ld-empty' }, T.none));

      const seg = (opts, val, key, set) => h('div', { class: 'ld-seg', role: 'group' }, Object.entries(opts).map(([k, label]) =>
        h('button', { type: 'button', class: String(k) === String(val) ? 'on' : '', 'aria-pressed': String(String(k) === String(val)), onclick: () => { set(k); try { localStorage.setItem(key, String(k)); } catch { /* ignore */ } draw(); } }, label)));
      root.replaceChildren(
        h('div', { class: 'ld-head' }, h('div', {}, h('h2', {}, opts.title || T.title), h('p', { class: 'ld-sub' }, T.sub)),
          h('div', { class: 'ld-ctl' }, seg(T.lang, lang, 'comiks.ldLang', v => { lang = v; }), seg(T.p, period, 'comiks.ldPeriod', v => { period = +v; }))),
        kpis, tipBox, h('div', { class: 'ld-grid' }, chart, areas, cal, words, errBox, recent));
    };
    draw();
    void COMICS;
    return root;
  }
  /* 🔥 Компактна активність для плану навчання: календар за рік як на GitHub (53 тижні), рівень,
     серії й посилання на детальний дашборд у кабінеті. */
  const ACT = {
    uk: { t: '🔥 Моя активність', days: 'днів навчання', streak: 'серія зараз', best: 'найдовша серія', level: 'рівень', tests: 'тестів за 30 днів', more: '📊 Детальний аналіз навчання →', wd: ['Пн', '', 'Ср', '', 'Пт', '', ''], tip: (d, n) => `${d}: ${n ? n + ' тест.' : 'активний день'}`, none: d => `${d}: без навчання`, less: 'менше', moreL: 'більше' },
    en: { t: '🔥 My activity', days: 'study days', streak: 'current streak', best: 'longest streak', level: 'level', tests: 'quizzes in 30 days', more: '📊 Detailed learning analysis →', wd: ['Mon', '', 'Wed', '', 'Fri', '', ''], tip: (d, n) => `${d}: ${n ? n + ' quiz(zes)' : 'active day'}`, none: d => `${d}: no study`, less: 'less', moreL: 'more' },
    no: { t: '🔥 Min aktivitet', days: 'læringsdager', streak: 'rekke nå', best: 'lengste rekke', level: 'nivå', tests: 'prøver siste 30 dager', more: '📊 Detaljert læringsanalyse →', wd: ['Ma', '', 'Ons', '', 'Fre', '', ''], tip: (d, n) => `${d}: ${n ? n + ' prøve(r)' : 'aktiv dag'}`, none: d => `${d}: ingen læring`, less: 'mindre', moreL: 'mer' },
  };
  if (window.KL_T_FILL) KL_T_FILL(ACT, 'learn-dash.js:ACT');
  function levelNow() {
    const { store, COMICS } = K(), order = ['A1', 'A2', 'B1', 'B2'];
    let best = -1;
    (COMICS || []).forEach(c => { if ((store.get('seen.' + c.id, []) || []).length) best = Math.max(best, order.indexOf(c.level)); });
    Object.keys(store.get('progress', {}) || {}).forEach(k => { if (k.startsWith('level:')) best = Math.max(best, order.indexOf(k.slice(6))); });
    return best >= 0 ? order[best] : 'A1';
  }
  function activity() {
    const { h, store, ui } = K();
    const T = ACT[ui] || ACT.en;
    const days = new Set(store.get('days', []) || []);
    const byDay = {};
    (store.get('quizlog', []) || []).forEach(q => { if (q && q.date) { const d = dayOf(q.date); byDay[d] = (byDay[d] || 0) + 1; } });
    // серії: поточна (сьогодні або вчора) і найдовша
    let cur = 0; { const d = new Date(); if (!days.has(dayOf(d))) d.setDate(d.getDate() - 1); while (days.has(dayOf(d))) { cur++; d.setDate(d.getDate() - 1); } }
    let best = 0, run = 0, prev = null;
    [...days].sort().forEach(ds => { const x = new Date(ds + 'T12:00:00'); run = prev && Math.round((x - prev) / 864e5) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = x; });
    const from30 = daysBack(30)[0];
    const tests30 = Object.entries(byDay).filter(([d]) => d >= from30).reduce((s, [, n]) => s + n, 0);
    // календар: 53 тижні, тиждень з понеділка, останній стовпчик — поточний тиждень
    const loc = { uk: 'uk-UA', no: 'nb-NO' }[ui] || ui;
    const start = new Date(); start.setHours(12, 0, 0, 0); start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - 52 * 7);
    const cols = [], months = [];
    let lastM = -1;
    for (let w = 0; w < 53; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const x = new Date(start); x.setDate(start.getDate() + w * 7 + d);
        const ds = dayOf(x), n = byDay[ds] || 0, fut = x > new Date();
        if (d === 0 && x.getMonth() !== lastM) { lastM = x.getMonth(); months.push([w, new Intl.DateTimeFormat(loc, { month: 'short' }).format(x)]); }
        const lvl = fut ? 'fut' : n >= 5 ? 'l4' : n >= 3 ? 'l3' : n >= 1 ? 'l2' : days.has(ds) ? 'l1' : '';
        col.push(h('i', { class: lvl, title: fut ? '' : (n || days.has(ds) ? T.tip(d2(ds) + '.' + ds.slice(0, 4), n) : T.none(d2(ds) + '.' + ds.slice(0, 4))) }));
      }
      cols.push(h('span', { class: 'ld-w' }, col));
    }
    const monthRow = h('div', { class: 'gh-months' }, months.map(([w, m]) => h('span', { style: { gridColumn: String(w + 1) } }, m)));
    const grid = h('div', { class: 'gh-cal' }, h('div', { class: 'gh-wd' }, T.wd.map(x => h('span', {}, x))), h('div', { class: 'gh-body' }, monthRow, h('div', { class: 'ld-cal gh-weeks' }, cols)));
    const stat = (n, label) => h('div', { class: 'gh-stat' }, h('b', {}, String(n)), h('span', {}, label));
    const box = h('section', { class: 'ld-card gh-card' },
      h('div', { class: 'gh-head' }, h('h3', {}, T.t), h('a', { class: 'btn small', href: '#/account/learn' }, T.more)),
      h('div', { class: 'gh-stats' }, stat(days.size, T.days), stat('🔥 ' + cur, T.streak), stat(best, T.best), stat(levelNow(), T.level), stat(tests30, T.tests)),
      grid,
      h('div', { class: 'ld-lg' }, T.less, ...['', 'l1', 'l2', 'l3', 'l4'].map(c => h('i', { class: c })), T.moreL));
    // на телефоні календар гортається — показуємо свіжі тижні одразу
    setTimeout(() => { const sc = box.querySelector('.gh-cal'); if (sc) sc.scrollLeft = sc.scrollWidth; }, 0);
    return box;
  }
  window.KomiksLearnDash = { render, areaOf, activity };
})();
