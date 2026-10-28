/* Komiks·Lab: deterministic classroom challenges. Questions remain Norwegian;
   hover translations always contain Ukrainian and English. No network service. */
(() => {
  'use strict';
  const MODES = ['mixed', 'memory', 'patterns', 'attention'];
  const LEVELS = ['easy', 'medium', 'hard', 'expert'];
  const TEXT = {
    uk: {
      choose: 'Обери свою пригоду', join: '📱 Маю код кімнати',
      mixed: ['🏁', 'Логік-гонка', 'Мікс чисел, годинників і логічних задач.'],
      memory: ['🕵️', 'Детектив пам’яті', 'Запам’ятай речі. Одна зникне — знайди її!'],
      patterns: ['🧩', 'Майстер візерунків', 'Розкрий правило й продовж ряд символів або чисел.'],
      attention: ['🔎', 'Мисливець за деталями', 'Знайди зміну або порахуй потрібні предмети.'],
      how: 'Правильна відповідь рухає твого аватара вперед. Після кожного вибору з’являється пояснення. Ті самі задачі — для всього класу.',
      ages: ['6–8 років · перші кроки', '8–10 років · більше деталей', '10–12 років · складніші правила', '12+ років · виклик'],
      memoryHelp: 'Спочатку роздивись речі. Коли одна сховається, обери її серед чотирьох відповідей.',
      patternsHelp: 'Шукай частину, що повторюється, або крок між числами. Який елемент буде наступним?',
      attentionHelp: 'Порівняй дві полиці та обери номер зміни. Або порахуй усі предмети, що збігаються зі зразком.',
      preview: 'Запам’ятай!', recall: 'Що зникло?', correct: 'Так! +1 крок', answer: 'Розберімося разом',
      practice: '🤖 Тренування з ботами', room: '📺 Створити кімнату класу', mode: 'Гра', update: 'Онови сторінку, щоб зіграти в цей новий режим.'
    },
    en: {
      choose: 'Choose your adventure', join: '📱 I have a room code',
      mixed: ['🏁', 'Logic Race', 'A mix of numbers, clocks and logic puzzles.'],
      memory: ['🕵️', 'Memory Detective', 'Remember the objects. One disappears — find it!'],
      patterns: ['🧩', 'Pattern Lab', 'Discover the rule and continue a row of symbols or numbers.'],
      attention: ['🔎', 'Detail Scout', 'Spot a change or count the matching objects.'],
      how: 'A correct answer moves your avatar forward. Each choice reveals an explanation. The whole class gets the same challenges.',
      ages: ['Ages 6–8 · first steps', 'Ages 8–10 · more details', 'Ages 10–12 · trickier rules', 'Ages 12+ · challenge'],
      memoryHelp: 'Study the objects first. When one disappears, choose it from four answers.',
      patternsHelp: 'Find the repeating part or the step between numbers. Which item comes next?',
      attentionHelp: 'Compare two shelves and choose the number of the changed position. Or count all objects matching the example.',
      preview: 'Remember!', recall: 'What disappeared?', correct: 'Yes! +1 step', answer: 'Let’s work it out',
      practice: '🤖 Practise with bots', room: '📺 Create a classroom room', mode: 'Game', update: 'Refresh the page to play this new mode.'
    },
    no: {
      choose: 'Velg ditt eventyr', join: '📱 Jeg har en romkode',
      mixed: ['🏁', 'Logikkløpet', 'En blanding av tall, klokker og logiske oppgaver.'],
      memory: ['🕵️', 'Hukommelsesdetektiven', 'Husk tingene. Én forsvinner — finn den!'],
      patterns: ['🧩', 'Mønsterverkstedet', 'Finn regelen og fortsett rekken av symboler eller tall.'],
      attention: ['🔎', 'Detaljjegeren', 'Finn en endring eller tell tingene som passer.'],
      how: 'Et riktig svar flytter avataren din fram. Etter hvert valg får du en forklaring. Hele klassen får de samme oppgavene.',
      ages: ['6–8 år · første steg', '8–10 år · flere detaljer', '10–12 år · vanskeligere regler', '12+ år · utfordring'],
      memoryHelp: 'Se nøye på tingene først. Når én blir borte, velger du den blant fire svar.',
      patternsHelp: 'Finn delen som gjentas, eller steget mellom tallene. Hva kommer etterpå?',
      attentionHelp: 'Sammenlign to hyller og velg nummeret der noe er endret. Eller tell alle ting som er like eksempelet.',
      preview: 'Husk!', recall: 'Hva ble borte?', correct: 'Ja! +1 steg', answer: 'La oss finne det ut',
      practice: '🤖 Øv med roboter', room: '📺 Opprett et klasserom', mode: 'Spill', update: 'Oppdater siden for å spille denne nye varianten.'
    },
    ar: {
      choose: 'اختر مغامرتك', join: '📱 لدي رمز الغرفة',
      mixed: ['🏁', 'سباق المنطق', 'مزيج من الأرقام والساعات والألغاز المنطقية.'],
      memory: ['🕵️', 'محقق الذاكرة', 'تذكّر الأشياء. يختفي أحدها — اعثر عليه!'],
      patterns: ['🧩', 'مختبر الأنماط', 'اكتشف القاعدة وأكمل تسلسل الرموز أو الأرقام.'],
      attention: ['🔎', 'كشاف التفاصيل', 'اكتشف التغيير أو عدّ الأشياء المطابقة.'],
      how: 'تحرك الإجابة الصحيحة شخصيتك للأمام. يظهر شرح بعد كل اختيار. يحصل الصف كله على التحديات نفسها.',
      ages: ['6–8 سنوات · البداية', '8–10 سنوات · تفاصيل أكثر', '10–12 سنة · قواعد أصعب', '12+ سنة · التحدي'],
      memoryHelp: 'تأمّل الأشياء أولاً. عندما يختفي أحدها، اختره من بين أربع إجابات.',
      patternsHelp: 'ابحث عن الجزء المتكرر أو الفرق بين الأرقام. ما العنصر التالي؟',
      attentionHelp: 'قارن بين الرفّين واختر رقم الموضع الذي تغيّر، أو عدّ الأشياء المطابقة للمثال.',
      preview: 'تذكّر!', recall: 'ما الذي اختفى؟', correct: 'نعم! خطوة للأمام', answer: 'لنكتشف الإجابة معاً',
      practice: '🤖 تدريب مع الروبوتات', room: '📺 إنشاء غرفة للصف', mode: 'اللعبة', update: 'حدّث الصفحة للعب هذا النمط الجديد.'
    }
  };
  if (window.KL_T_FILL) KL_T_FILL(TEXT, 'logic.js:TEXT');
  const mode = value => MODES.includes(value) ? value : 'mixed';
  const text = (key, lang) => (TEXT[lang || ((window.KomiksCore || {}).ui)] || TEXT.en)[key] || TEXT.en[key];
  const info = value => text(mode(value));
  const title = value => info(value).slice(0, 2).join(' ');
  function round(message = {}) {
    const steps = [10, 15, 20].includes(+message.steps) ? +message.steps : 10;
    const dur = [60, 120, 180, 300].includes(+message.dur) ? +message.dur : 120;
    const startIn = Number.isFinite(+message.startIn) ? Math.max(0, Math.min(5000, +message.startIn)) : 0;
    const remaining = Number.isFinite(+message.remaining) ? Math.max(0, Math.min(dur * 1000 + startIn, +message.remaining)) : dur * 1000 + startIn;
    return { mode: mode(message.mode), level: LEVELS.includes(message.level) ? message.level : 'easy', seed: Number.isFinite(+message.seed) ? +message.seed : 0, steps, dur, startIn, remaining };
  }
  const OBJECTS = ['🍎', '🍌', '🍇', '🍓', '🥕', '🍋', '⭐', '🌙', '🌼', '🍀', '⚽', '🎈', '🚗', '🚲', '🎁', '🧸', '🐱', '🐶', '🐸', '🐼'];
  function makeQ(chosen, rand, level) {
    const m = mode(chosen);
    if (m === 'mixed') return null;
    const d = Math.max(0, LEVELS.indexOf(level));
    const R = n => Math.floor(rand() * n);
    const shuffle = values => { const a = values.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const pool = shuffle(OBJECTS);
    const numbers = answer => shuffle([answer, answer + 1, answer + 2, answer > 0 ? answer - 1 : answer + 3]);
    if (m === 'memory') {
      const before = pool.slice(0, 4 + d), missing = R(before.length), answer = before[missing];
      return { type: 'memory', title: ['Hvilken ting ble borte?', 'Яка річ зникла?', 'Which object disappeared?'], before, missing,
        after: before.map((item, i) => i === missing ? '?' : item), previewMs: [4000, 3500, 3000, 2500][d], answer,
        options: shuffle([answer, ...pool.slice(before.length, before.length + 3)]), emoji: true,
        explain: [`${answer} lå på plass ${missing + 1}.`, `${answer} був на місці ${missing + 1}.`, `${answer} was in position ${missing + 1}.`] };
    }
    if (m === 'patterns') {
      if (d > 0 && R(3) === 0) {
        const jumps = d === 1 ? [2 + R(4)] : [1 + R(4), 6 + R(5)];
        const row = [1 + R(8)];
        for (let i = 0; i < (d > 1 ? 5 : 4); i++) row.push(row.at(-1) + jumps[i % jumps.length]);
        const answer = row.at(-1) + jumps[(row.length - 1) % jumps.length];
        const rule = jumps.map(n => '+' + n).join(', ');
        return { type: 'growth', title: ['Hvilket tall kommer etterpå?', 'Яке число буде наступним?', 'Which number comes next?'], row, jumps, answer, options: numbers(answer),
          explain: [`Gjenta stegene ${rule}. Neste tall er ${answer}.`, `Повторюй кроки ${rule}. Наступне число — ${answer}.`, `Repeat the steps ${rule}. The next number is ${answer}.`] };
      }
      const rules = [[0, 1], [0, 0, 1], [0, 1, 0, 2], [0, 1, 1, 0, 2]];
      const unit = rules[d].map(i => pool[i]);
      const length = unit.length * 2 + R(unit.length);
      const row = Array.from({ length }, (_, i) => unit[i % unit.length]), answer = unit[length % unit.length];
      return { type: 'repeat', title: ['Hva kommer etterpå?', 'Що буде далі?', 'What comes next?'], row, unit, answer, emoji: true,
        options: shuffle([answer, ...pool.filter(x => x !== answer).slice(0, 3)]),
        explain: [`Mønsteret ${unit.join(' ')} gjentas. Neste er ${answer}.`, `Візерунок ${unit.join(' ')} повторюється. Далі — ${answer}.`, `The pattern ${unit.join(' ')} repeats. Next is ${answer}.`] };
    }
    if (R(2) === 0) {
      const count = [4, 6, 8, 9][d], before = Array.from({ length: count }, () => pool[R(3 + d)]), at = R(count);
      const after = before.slice(); after[at] = pool[3 + d];
      const answer = at + 1;
      return { type: 'change', title: ['Hvilken plass er endret?', 'На якому місці є зміна?', 'Which position has changed?'], before, after, answer,
        options: shuffle([answer, ...shuffle(Array.from({ length: count }, (_, i) => i + 1).filter(i => i !== answer)).slice(0, 3)]),
        explain: [`På plass ${answer}: ${before[at]} → ${after[at]}.`, `На місці ${answer}: ${before[at]} → ${after[at]}.`, `At position ${answer}: ${before[at]} → ${after[at]}.`] };
    }
    const count = [9, 12, 20, 25][d], target = pool[0], answer = 2 + R(3 + d);
    const grid = shuffle([...Array(answer).fill(target), ...Array.from({ length: count - answer }, () => pool[1 + R(3 + d)])]);
    return { type: 'spot', title: [`Hvor mange ${target} ser du?`, `Скільки ${target} ти бачиш?`, `How many ${target} can you see?`], grid, target, answer, options: numbers(answer),
      explain: [`Det er ${answer} ${target}. Tell hver ting én gang.`, `Тут ${answer} ${target}. Порахуй кожен предмет один раз.`, `There are ${answer} ${target}. Count each object once.`] };
  }
  function picker(current, onChange, compact = false) {
    const { h } = window.KomiksCore;
    return h('fieldset', { class: 'lg-picker' + (compact ? ' compact' : '') }, h('legend', {}, text('choose')),
      h('div', { class: 'lg-modes' }, MODES.map(id => { const [icon, name, desc] = info(id); return h('button', { type: 'button', class: 'lg-mode' + (id === current ? ' on' : ''), 'data-mode': id, 'aria-pressed': String(id === current), onclick: () => onChange(id) },
        h('span', { class: 'lg-mode-icon', 'aria-hidden': 'true' }, icon), h('b', {}, name), h('small', {}, desc)); })));
  }
  // Delayed work belongs to the active game; stopping it also cancels memory reveals.
  function card(q, onAnswer, schedule) {
    const K = window.KomiksCore, { h } = K;
    const translated = (tag, texts, attrs = {}) => K.withTr(h(tag, attrs, texts[0]), K.both(texts[1], texts[2]));
    const numbered = items => h('div', { class: 'lg-shelf', style: '--lg-columns:' + Math.min(items.length, 5) }, items.map((item, i) => h('span', { class: 'lg-object' + (item === '?' ? ' missing' : '') }, h('small', {}, i + 1), h('b', {}, item))));
    const opts = h('div', { class: 'lr-opts' }, q.options.map((o, i) => h('button', { type: 'button', class: 'lr-opt c' + (i + 1), onclick: e => onAnswer(o, e.currentTarget) }, h('span', { class: q.emoji ? 'emo' : '' }, String(o)))));
    const content = h('div', { class: 'lg-puzzle', dir: 'ltr' });
    const status = h('p', { class: 'lg-status', role: 'status', 'aria-live': 'polite' });
    const heading = translated('h3', q.title);
    const el = h('div', { class: 'lr-q lg-q lg-' + q.type }, heading, content, status, opts);
    if (q.type === 'memory') {
      opts.hidden = true; opts.querySelectorAll('button').forEach(b => { b.disabled = true; });
      heading.hidden = true;
      content.append(numbered(q.before));
      status.textContent = text('preview') + ' ' + Math.ceil(q.previewMs / 1000) + ' s';
      for (let passed = 1000; passed < q.previewMs; passed += 1000) schedule(() => { status.textContent = text('preview') + ' ' + Math.ceil((q.previewMs - passed) / 1000) + ' s'; }, passed);
      schedule(() => { content.replaceChildren(numbered(q.after)); heading.hidden = false; status.textContent = text('recall'); opts.hidden = false; opts.querySelectorAll('button').forEach(b => { b.disabled = false; }); }, q.previewMs);
    } else if (q.type === 'repeat' || q.type === 'growth') content.append(h('div', { class: 'lg-sequence' + (q.emoji ? ' emoji' : '') }, q.row.map(item => h('span', {}, item)), h('span', { class: 'missing' }, '?')));
    else if (q.type === 'change') content.append(h('div', { class: 'lg-compare' }, h('b', { class: 'lg-shelf-label' }, 'A'), numbered(q.before), h('b', { class: 'lg-shelf-label' }, 'B'), numbered(q.after)));
    else content.append(h('div', { class: 'lg-search', style: '--lg-columns:' + (q.grid.length < 13 ? 3 : 5) }, q.grid.map(item => h('span', { class: 'lg-object' }, item))));
    el.showFeedback = correct => {
      opts.querySelectorAll('button').forEach((b, i) => { b.disabled = true; if (q.options[i] === q.answer) { b.classList.add('good'); b.append(h('span', { class: 'lg-check', 'aria-hidden': 'true' }, ' ✓')); } });
      status.replaceChildren(h('strong', {}, text(correct ? 'correct' : 'answer')), translated('span', q.explain));
      status.classList.add('feedback', correct ? 'correct' : 'learn');
      if (q.type === 'memory') content.replaceChildren(numbered(q.before));
      if (q.type === 'change') content.querySelectorAll('.lg-shelf')[1].children[q.answer - 1].classList.add('found');
      if (q.type === 'spot') [...content.querySelectorAll('.lg-object')].forEach((cell, i) => { if (q.grid[i] === q.target) cell.classList.add('found'); });
    };
    return el;
  }
  window.KomiksLogic = { modes: MODES, mode, text, info, title, round, makeQ, picker, card };
})();
