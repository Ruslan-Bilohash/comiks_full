/* Комікс·Lab — англійський курс: історії в іншому стилі коміксу (`style: 'strip'`) і тести англійською.
   Дані — data/english.js (window.ENGLISH), словник — data/dictionary-en.js (window.DICT_EN).
   Завдання тестів — англійською; при наведенні на слово видно українською та норвезькою. */
(() => {
  'use strict';
  const EN = {
    uk: {
      nav: 'Англійська', module: ['🇬🇧', 'Англійська', 'окремий курс в іншому стилі коміксу'],
      title: '🇬🇧 Англійська через комікси', intro: 'Окремий курс: інший стиль малюнка, історії англійською та тести англійською мовою. Наведи на слово — побачиш переклад українською та норвезькою.',
      read: '📖 Читати', test: '🧩 Тест', tests_title: '🇬🇧 Англійські тести', words: n => `${n} слів`,
      panel_of: (i, n) => `Кадр ${i} з ${n}`, stop: 'Стоп', mistakes: '🔁 Робота над помилками', mistakes_none: 'Поки що помилок немає — пройдіть тест, і слова, у яких схибите, зберуться тут.', prev: '◀ Назад', next: 'Далі ▶', play: '🔊 Озвучити кадр', all: '▶️ Увесь комікс',
      to_test: '🧩 До тесту', vocab: n => `📒 Слова історії (${n})`, back: '← Усі історії', level: l => `Рівень ${l}`,
      step: x => `Англійська: ${x}`, lang_note: '🇬🇧 Цей розділ — англійською. Норвезька частина сайту не змінюється.',
      stories: '📚 Історії', words_title: '📝 Англійські слова за темами', words_intro: 'Ті самі 19 тем, що й у норвезькому розділі, — тепер англійською. Натисни на картку, щоб почути слово, і постав ✓, якщо вже знаєш його.',
      words_btn: '📝 Слова за темами', all_words_test: '🧩 Тест з усіх слів', known_n: (a, b) => `✅ Знаю: ${a} з ${b}`, known_all: n => `✅ Знаю: ${n}`, know: 'Знаю',
      hide: '🙈 Сховати переклад', show: '👀 Показати переклад', play_all: '🔊 Прослухати всі', topic_test: '🧩 Тест з теми', back_words: '← Усі теми',
      home_kicker: 'Англійський курс Komiks·Lab', home_title: 'Англійська, яку дитина одразу використовує', home_intro: 'Літери, слова, граматика й живі історії складаються в один зрозумілий маршрут. Слухай британську вимову, відповідай у тестах і рухайся від A1 до B1.',
      home_start: 'Почати з першої історії', home_continue: 'Продовжити навчання', home_paths: 'З чого почати', home_stories: 'Історії за рівнями',
      alphabet_btn: 'Англійський алфавіт', alphabet_desc: '26 літер, слова-приклади й озвучення', plan_desc: n => `${n} тем граматики крок за кроком`, words_desc: n => `${n} слів із картинками та вимовою`, test_desc: 'Перевір слова на слух і за картинками',
      alpha_title: '🔤 Англійський алфавіт', alpha_intro: '26 літер від A до Z. Натисни картку: спочатку почуєш назву літери, потім англійське слово-приклад.', alpha_listen: 'Прослухати весь алфавіт', alpha_test: 'Тест з англійського алфавіту', alpha_traps: 'Літери, які варто запам’ятати'
    },
    en: {
      nav: 'English', module: ['🇬🇧', 'English', 'a separate course in a different comic style'],
      title: '🇬🇧 English through comics', intro: 'A separate course: a different drawing style, stories in English and tests in English. Hover over a word to see the Ukrainian and Norwegian translation.',
      read: '📖 Read', test: '🧩 Test', tests_title: '🇬🇧 English tests', words: n => `${n} words`,
      panel_of: (i, n) => `Panel ${i} of ${n}`, stop: "Stop", mistakes: '🔁 Work on mistakes', mistakes_none: 'No mistakes yet — take a test, and the words you get wrong will gather here.', prev: '◀ Back', next: 'Next ▶', play: '🔊 Read the panel', all: '▶️ Whole comic',
      to_test: '🧩 Go to the test', vocab: n => `📒 Words in this story (${n})`, back: '← All stories', level: l => `Level ${l}`,
      step: x => `English: ${x}`, lang_note: '🇬🇧 This section is in English. The Norwegian part of the site stays as it is.',
      stories: '📚 Stories', words_title: '📝 English words by topic', words_intro: 'The same 19 topics as in the Norwegian section — now in English. Tap a card to hear the word and tick ✓ if you already know it.',
      words_btn: '📝 Words by topic', all_words_test: '🧩 Test on all words', known_n: (a, b) => `✅ Known: ${a} of ${b}`, known_all: n => `✅ Known: ${n}`, know: 'I know it',
      hide: '🙈 Hide translation', show: '👀 Show translation', play_all: '🔊 Listen to all', topic_test: '🧩 Topic test', back_words: '← All topics',
      home_kicker: 'The Komiks·Lab English course', home_title: 'English children can use right away', home_intro: 'Letters, words, grammar and lively stories form one clear path. Listen to British pronunciation, answer quizzes and move from A1 to B1.',
      home_start: 'Start with the first story', home_continue: 'Continue learning', home_paths: 'Where to start', home_stories: 'Stories by level',
      alphabet_btn: 'English alphabet', alphabet_desc: '26 letters, example words and audio', plan_desc: n => `${n} grammar topics step by step`, words_desc: n => `${n} illustrated words with pronunciation`, test_desc: 'Test words by sound and pictures',
      alpha_title: '🔤 The English alphabet', alpha_intro: '26 letters from A to Z. Tap a card to hear the letter name followed by an English example word.', alpha_listen: 'Listen to the whole alphabet', alpha_test: 'English alphabet quiz', alpha_traps: 'Letters worth remembering'
    },
    no: {
      nav: 'Engelsk', module: ['🇬🇧', 'Engelsk', 'et eget kurs i en annen tegneseriestil'],
      title: '🇬🇧 Engelsk med tegneserier', intro: 'Et eget kurs: en annen tegnestil, historier på engelsk og tester på engelsk. Hold over et ord for å se oversettelsen til ukrainsk og norsk.',
      read: '📖 Les', test: '🧩 Test', tests_title: '🇬🇧 Engelske tester', words: n => `${n} ord`,
      panel_of: (i, n) => `Rute ${i} av ${n}`, stop: "Stopp", mistakes: '🔁 Jobb med feilene', mistakes_none: 'Ingen feil ennå – ta en prøve, så samler ordene du bommer på seg her.', prev: '◀ Tilbake', next: 'Neste ▶', play: '🔊 Les ruten', all: '▶️ Hele serien',
      to_test: '🧩 Til testen', vocab: n => `📒 Ord i historien (${n})`, back: '← Alle historier', level: l => `Nivå ${l}`,
      step: x => `Engelsk: ${x}`, lang_note: '🇬🇧 Denne delen er på engelsk.',
      stories: '📚 Historier', words_title: '📝 Engelske ord etter tema', words_intro: 'De samme 19 temaene som i den norske delen – nå på engelsk. Trykk på et kort for å høre ordet og kryss av ✓ hvis du kan det.',
      words_btn: '📝 Ord etter tema', all_words_test: '🧩 Test i alle ordene', known_n: (a, b) => `✅ Kan: ${a} av ${b}`, known_all: n => `✅ Kan: ${n}`, know: 'Jeg kan det',
      hide: '🙈 Skjul oversettelsen', show: '👀 Vis oversettelsen', play_all: '🔊 Hør alle', topic_test: '🧩 Test i temaet', back_words: '← Alle temaer',
      home_kicker: 'Engelskkurset i Komiks·Lab', home_title: 'Engelsk barn kan bruke med én gang', home_intro: 'Bokstaver, ord, grammatikk og levende historier blir én tydelig løype. Lytt til britisk uttale, svar på prøver og gå fra A1 til B1.',
      home_start: 'Start med den første historien', home_continue: 'Fortsett å lære', home_paths: 'Hvor skal jeg starte?', home_stories: 'Historier etter nivå',
      alphabet_btn: 'Det engelske alfabetet', alphabet_desc: '26 bokstaver, eksempelord og lyd', plan_desc: n => `${n} grammatikktemaer steg for steg`, words_desc: n => `${n} ord med bilder og uttale`, test_desc: 'Test ord med lyd og bilder',
      alpha_title: '🔤 Det engelske alfabetet', alpha_intro: '26 bokstaver fra A til Z. Trykk på et kort for å høre bokstavnavnet og deretter et engelsk eksempelord.', alpha_listen: 'Hør hele alfabetet', alpha_test: 'Test i det engelske alfabetet', alpha_traps: 'Bokstaver det er lurt å huske'
    }
  };
  if (window.KL_T_FILL) KL_T_FILL(EN, 'english.js:EN');
  // тексти завдань — англійською (сам тест), підказка при наведенні — uk/en
  const QE = {
    who: ['Who says this?', '🗣️ Listening'], panel: ['Which picture is this line from?', '🖼️ Pictures'],
    listen: ['Listen and choose the word', '🎧 Listening'], picture: ['What is this?', '🖼️ Picture'],
    blank: ['Which word is missing?', '✏️ Grammar'], emoji: ['What is this?', '📝 Words'],
    enletter: ['Which letter do you hear?', '🔤 Alphabet'], enfirstletter: ['Which letter does this word start with?', '🔤 Alphabet']
  };
  const QTIP = {
    uk: { who: 'Хто це каже?', panel: 'З якого кадру ця репліка?', listen: 'Послухай і вибери слово', picture: 'Що це?', blank: 'Якого слова бракує?', emoji: 'Що це? Вибери англійське слово', enletter: 'Яку англійську літеру ти чуєш?', enfirstletter: 'З якої літери починається це слово?' },
    en: { who: 'Who says this?', panel: 'Which picture is this line from?', listen: 'Listen and choose the word', picture: 'What is this?', blank: 'Which word is missing?', emoji: 'What is this? Choose the English word', enletter: 'Which English letter do you hear?', enfirstletter: 'Which letter does this word start with?' }
  };
  if (window.KL_T_FILL) KL_T_FILL(QTIP, 'english.js:QTIP');
  const UI = {
    uk: { exit: '← Вийти', q_of_tpl: 'Питання {i} з {n}', score_tpl: '{s} з {n} правильних · {p} %', next: 'Далі ▶', result: 'Результат 🏁', correct: 'Правильна відповідь: ', again: '🔄 Ще раз', reread: '📖 Прочитати знову', home: '🏠 На головну', score: (s, n, p) => `${s} з ${n} правильних · ${p} %` },
    en: { exit: '← Exit', q_of_tpl: 'Question {i} of {n}', score_tpl: '{s} of {n} correct · {p} %', next: 'Next ▶', result: 'Result 🏁', correct: 'Correct answer: ', again: '🔄 Try again', reread: '📖 Read again', home: '🏠 Home', score: (s, n, p) => `${s} of ${n} correct · ${p} %` },
    no: { exit: '← Avslutt', q_of_tpl: 'Spørsmål {i} av {n}', score_tpl: '{s} av {n} riktige · {p} %', next: 'Neste ▶', result: 'Resultat 🏁', correct: 'Riktig svar: ', again: '🔄 Prøv igjen', reread: '📖 Les igjen', home: '🏠 Hjem', score: (s, n, p) => `${s} av ${n} riktige · ${p} %` }
  };
  if (window.KL_T_FILL) KL_T_FILL(UI, 'english.js:UI');
  /* Похвала англійською — і на екрані, і вголос. Курс англійської, тож хвалимо
     мовою, яку вчать: почути «Brilliant!» корисніше, ніж прочитати «Чудово».
     Список довгий навмисно: чотири фрази на дванадцять питань поспіль
     перетворюються на шум, який уже не читають. */
  const PRAISE = ['Great!', 'Well done!', 'Excellent!', 'Nice work!', 'Perfect!', 'Brilliant!',
    'That’s right!', 'Awesome!', 'You got it!', 'Fantastic!', 'Very good!', 'Spot on!'];
  const CHEER_OK = ['Excellent!', 'Well done!', 'Great job!', 'Perfect!', 'That’s right!', 'Brilliant!',
    'Nice work!', 'Awesome!', 'You got it!', 'Fantastic!', 'Very good!', 'Wonderful!'];
  const CHEER_NO = ['Not quite. Try again!', 'Almost! Have another go!', 'Not this time. Keep going!',
    'Oops, not that one.', 'Nearly there!', 'Don’t give up!'];
  /* Та сама фраза двічі поспіль звучить як поломка, а не як похвала. */
  let lastCheer = '';
  const freshPick = list => {
    const K = C();
    let p = K.pick(list);
    for (let g = 0; g < 4 && p === lastCheer; g++) p = K.pick(list);
    lastCheer = p;
    return p;
  };
  /* Голос можна вимкнути в налаштуваннях — тим самим перемикачем, що й
     норвезький «голос тамагочі». */
  async function cheer(ok) {
    const K = C();
    if (K.settings.cheerVoice === false) return;
    try { await speak(freshPick(ok ? CHEER_OK : CHEER_NO)); } catch (e) { /* без голосу теж нормально */ }
  }

  if (window.I18N) for (const l of ['uk', 'en', 'no']) {
    const I = window.I18N[l]; if (!I) continue;
    I.nav = Object.assign({}, I.nav, { english: EN[l].nav });
    I.modules = Object.assign({}, I.modules, { english: EN[l].module });
  }

  const C = () => window.KomiksCore;
  const ex = (k, ...a) => { const tbl = EN[C().ui] || EN.en || EN.uk; const v = k in tbl ? tbl[k] : (EN.en || EN.uk)[k]; return typeof v === 'function' ? v(...a) : v; };
  const ui = (k, ...a) => { const tbl = UI[C().ui] || UI.en || UI.uk; const v = typeof tbl[k] === 'function' ? tbl[k](...a) : tbl[k]; return v; };
  const comics = () => ((window.ENGLISH || { comics: [] }).comics);
  const byId = id => comics().find(c => c.id === id);
  const stars = key => (((C().store.get('progress', {}))[key]) || {}).stars || 0;
  const tip = type => C().both(QTIP.uk[type], QTIP.en[type]);
  const fmt = (tpl, vals) => String(tpl || '').replace(/\{(\w+)\}/g, (m, k) => (k in vals ? vals[k] : m));
  /* Підказка до англійського тексту. Українська й норвезька лежать у самих
     даних курсу, решта мов — у словнику за англійським рядком. Англійську в
     підказку не кладемо: вона й так написана в кадрі.
     Доти німець бачив під англійським словом українське — це виглядало як збій,
     а не як запасний варіант. */
  const enTip = (en, uk, no) => {
    const t = Object.assign({}, C().both(uk, en) || {});
    delete t.en;
    if (no) t.no = no;
    return Object.keys(t).length ? t : null;
  };
  /* Переклад, який видно просто на картці слова, а не в підказці. */
  const enCard = (en, uk, no) => { const K = C(); return (K.packFor && K.packFor(K.ui, en)) || (K.ui === 'no' ? no || uk : uk); };

  /* переклад слова: словник англійських слів + vocab історій */
  let emap = null;
  function lookupEn(word) {
    const K = C();
    const w = K.norm(word);
    if (!w) return null;
    if (!emap) {
      emap = new Map();
      const D = window.DICT_EN || {};
      for (const [k, v] of Object.entries(D.uk || {})) emap.set(K.norm(k), { uk: v, no: (D.no || {})[k] || '' });
      comics().forEach(c => c.vocab.forEach(([en, uk, no]) => { const key = K.norm(en); if (!emap.has(key)) emap.set(key, { uk, no }); }));
    }
    const hit = emap.get(w);
    return hit ? { uk: hit.uk, no: hit.no || '' } : null;
  }
  /* ---------------- слова за темами (дані — data/words.js, поле en) ---------------- */
  const themes = () => ((window.WORDS || { themes: [] }).themes);
  const LEVELS = ['A1', 'A2', 'B1', 'B2'];
  /* Англійський курс використовує ту саму перевірену бібліотеку малюнків,
     що й норвезький. Ключем лишається норвезьке слово з вихідного словника,
     а англійський підпис і озвучення не змінюються. */
  const sharedPicture = (no, uk, fallback, size = 64) => {
    const P = window.KomiksPics;
    return P && P.has(no, uk) ? (P.el(no, size, uk) || fallback) : fallback;
  };
  const themePicture = th => {
    const P = window.KomiksPics;
    if (!P) return th.icon;
    const word = th.words.find(w => P.has(w[0], w[1]));
    return word ? (P.el(word[0], 46, word[1]) || th.icon) : th.icon;
  };
  /* Англійська абетка має власні приклади: вони прості, однозначні й
     починаються з потрібної літери. Останні два поля — українська та
     норвезька підказки; у самій картці лишається англійське слово. */
  const ALPHABET = [
    ['A', 'a', 'apple', '🍎', 'яблуко', 'eple'],
    ['B', 'b', 'ball', '⚽', 'м’яч', 'ball'],
    ['C', 'c', 'cat', '🐱', 'кіт', 'katt'],
    ['D', 'd', 'dog', '🐶', 'собака', 'hund'],
    ['E', 'e', 'elephant', '🐘', 'слон', 'elefant'],
    ['F', 'f', 'fish', '🐟', 'риба', 'fisk'],
    ['G', 'g', 'grapes', '🍇', 'виноград', 'druer'],
    ['H', 'h', 'house', '🏠', 'будинок', 'hus'],
    ['I', 'i', 'ice cream', '🍦', 'морозиво', 'is'],
    ['J', 'j', 'juice', '🧃', 'сік', 'juice'],
    ['K', 'k', 'kite', '🪁', 'повітряний змій', 'drage'],
    ['L', 'l', 'lion', '🦁', 'лев', 'løve'],
    ['M', 'm', 'moon', '🌙', 'місяць', 'måne'],
    ['N', 'n', 'nose', '👃', 'ніс', 'nese'],
    ['O', 'o', 'orange', '🍊', 'апельсин', 'appelsin'],
    ['P', 'p', 'pear', '🍐', 'груша', 'pære'],
    ['Q', 'q', 'queen', '👑', 'королева', 'dronning'],
    ['R', 'r', 'robot', '🤖', 'робот', 'robot'],
    ['S', 's', 'sun', '☀️', 'сонце', 'sol'],
    ['T', 't', 'train', '🚂', 'потяг', 'tog'],
    ['U', 'u', 'umbrella', '☂️', 'парасолька', 'paraply'],
    ['V', 'v', 'violin', '🎻', 'скрипка', 'fiolin'],
    ['W', 'w', 'whale', '🐋', 'кит', 'hval'],
    ['X', 'x', 'xylophone', '🎹', 'ксилофон', 'xylofon'],
    ['Y', 'y', 'yoghurt', '🥣', 'йогурт', 'yoghurt'],
    ['Z', 'z', 'zebra', '🦓', 'зебра', 'sebra']
  ];
  const ALPHA_TRAPS = {
    uk: [['C', 'може звучати як k або s'], ['G', 'може звучати як g або dж'], ['Q', 'майже завжди дружить з u'], ['W', 'назва складається з кількох звуків'], ['X', 'часто звучить як ks']],
    en: [['C', 'can sound like k or s'], ['G', 'can sound like g or j'], ['Q', 'is usually followed by u'], ['W', 'has a multi-syllable name'], ['X', 'often sounds like ks']],
    no: [['C', 'kan høres ut som k eller s'], ['G', 'kan høres ut som g eller j'], ['Q', 'står vanligvis foran u'], ['W', 'har et navn med flere stavelser'], ['X', 'høres ofte ut som ks']]
  };
  const knownList = () => C().store.get('wordsKnownEn', []);
  const kKey = (t, en) => t + '|' + en;
  const isKnown = (t, en) => knownList().includes(kKey(t, en));
  function toggleKnown(t, en) { const list = knownList(), k = kKey(t, en); const next = list.includes(k) ? list.filter(x => x !== k) : [...list, k]; C().store.set('wordsKnownEn', next); return next.includes(k); }
  const knownCount = t => { const l = knownList(); return t ? l.filter(x => x.startsWith(t + '|')).length : l.length; };
  // filter: null — усі теми; 'level:A2' — до рівня; інакше id теми. Питання: емодзі або на слух
  function wordQuestions(filter, n) {
    const K = C();
    const nOpt = K.settings.level === 'kids' ? 3 : 4;
    let list = themes();
    if (filter && filter.startsWith('level:')) { const max = LEVELS.indexOf(filter.slice(6)); list = list.filter(t => LEVELS.indexOf(t.level) <= max); }
    else if (filter) list = list.filter(t => t.id === filter);
    const all = list.flatMap(t => t.words.map(w => [t, w]));
    return K.shuffle(all).slice(0, n).map(([t, w], i) => {
      const pool = K.uniq(t.words.filter(x => x[2] !== w[2] && x[3] !== w[3] && x[1] !== w[1]).map(x => x[2]));
      const options = K.shuffle([w[2], ...K.sample(pool, nOpt - 1)]);
      const item = { no: w[2], en: w[2], uk: w[1], nb: w[0], emoji: w[3] };
      return i % 2 === 0 ? { type: 'emoji', lang: 'en', theme: t.id, item, answer: w[2], options } : { type: 'listen', lang: 'en', theme: t.id, item, word: w[2], answer: w[2], options };
    });
  }

  const speak = (text, who = 'narrator', rate = 1) => C().claim().then(() => C().Speech.speak(text, who, { rate, lang: 'en' }));

  /* Помилка в англійському тесті лягає в ту саму пам'ять акаунта, що й
     норвезька, але з позначкою мови. Без позначки слово «welcome» потрапило б
     у «Пари» та кросворд як норвезьке — норвезький тренажер почав би питати
     англійські слова. З позначкою ті тренажери його не бачать, зате курс
     англійської може повернути його у власній «роботі над помилками».
     Питання «хто це сказав» і «з якого кадру» не записуємо: там немає слова,
     яке можна повторити. */
  function logMiss(q, quizKey, title) {
    const K = C();
    if (!K.errs || !K.errs.add) return;
    const word = q.type === 'listen' || q.type === 'blank' ? q.word
      : (q.type === 'picture' || q.type === 'emoji') ? q.answer : '';
    if (!word) return;
    const item = q.item || {};
    K.errs.add(String(word), item.uk || '', String(word), quizKey || 'en', title || '', 'en');
  }
  const missList = () => { const K = C(); return (K.errs && K.errs.list) ? K.errs.list('en') : []; };
  function enWords(text) {
    const K = C(), { h } = K;
    const wrap = h('span', { class: 'words' });
    for (const tk of String(text).match(/[\p{L}\p{N}'’-]+|[^\p{L}\p{N}'’-]+/gu) || []) {
      if (!/[\p{L}\p{N}]/u.test(tk)) { wrap.append(tk); continue; }
      const w = h('span', { class: 'w' }, tk);
      const tr = lookupEn(tk);
      K.withTr(w, tr ? enTip(tk, tr.uk, tr.no) : null);
      w.addEventListener('click', e => { e.stopPropagation(); speak(tk, 'narrator', 0.9); });
      wrap.append(w);
    }
    return wrap;
  }

  /* ---------------- сторінки ---------------- */
  /* ---------------- 🗺 план англійської: граматика сходинками ----------------
     Теми й правила — window.ENGLISH.plan (data/english2.js). Тема пройдена, коли в кожній її
     історії є бодай одна зірка за тест. «Наступний крок» — перша непройдена історія по порядку. */
  const PT = {
    uk: { btn: '🗺 План англійської', title: '🗺 План англійської: граматика крок за кроком', intro: 'Від «I am» до пасиву — 22 теми, і кожну видно в живих діалогах коміксів. Прочитай історію, пройди тест — тема зарахується.',
      done: (a, b) => `Пройдено тем: ${a} з ${b}`, next: '▶ Наступний крок', all_done: '🏆 Усі теми пройдено! Повтори слабкі тести або вчи слова за темами.', rule: '📐 Правило', ex: '💬 Приклади', st: '📚 Історії', ok: '✅ пройдено', now: '▶ далі', wait: '⏳',
      level: l => `Рівень ${l}`, topic: 'Тема', journey: 'Моя подорож англійською', journey_hint: 'Кожна тема — крок. Читай комікс, слухай живу англійську й проходь тест.', stories_done: (a, b) => `${a} з ${b} історій`, current: 'Твій поточний крок', level_progress: (a, b) => `${a}/${b} тем`, open_topic: 'Відкрити тему', home_hint: 'Ти вчиш англійську. Перемкнути мову можна вгорі або в налаштуваннях.' },
    en: { btn: '🗺 English plan', title: '🗺 English plan: grammar step by step', intro: 'From “I am” to the passive — 22 topics, each one shown in real comic dialogues. Read the story, take the quiz and the topic counts as done.',
      done: (a, b) => `Topics done: ${a} of ${b}`, next: '▶ Next step', all_done: '🏆 All topics done! Repeat weak quizzes or learn words by topic.', rule: '📐 Rule', ex: '💬 Examples', st: '📚 Stories', ok: '✅ done', now: '▶ next', wait: '⏳',
      level: l => `Level ${l}`, topic: 'Topic', journey: 'My English journey', journey_hint: 'Each topic is one step. Read a comic, listen to real English and take the quiz.', stories_done: (a, b) => `${a} of ${b} stories`, current: 'Your current step', level_progress: (a, b) => `${a}/${b} topics`, open_topic: 'Open topic', home_hint: 'You are learning English. Switch the language at the top or in the settings.' },
    no: { btn: '🗺 Engelskplan', title: '🗺 Engelskplan: grammatikk steg for steg', intro: 'Fra «I am» til passiv – 22 temaer, og hvert tema vises i ekte dialoger i tegneseriene. Les historien, ta prøven, så regnes temaet som fullført.',
      done: (a, b) => `Fullførte temaer: ${a} av ${b}`, next: '▶ Neste steg', all_done: '🏆 Alle temaene er fullført! Ta svake prøver på nytt eller lær ord etter tema.', rule: '📐 Regel', ex: '💬 Eksempler', st: '📚 Historier', ok: '✅ fullført', now: '▶ neste', wait: '⏳',
      level: l => `Nivå ${l}`, topic: 'Tema', journey: 'Min engelskreise', journey_hint: 'Hvert tema er ett steg. Les en tegneserie, lytt til ekte engelsk og ta prøven.', stories_done: (a, b) => `${a} av ${b} historier`, current: 'Ditt nåværende steg', level_progress: (a, b) => `${a}/${b} temaer`, open_topic: 'Åpne tema', home_hint: 'Du lærer engelsk. Bytt språk øverst eller i innstillingene.' },
  };
  if (window.KL_T_FILL) KL_T_FILL(PT, 'english.js:PT');
  const pt = (k, ...a) => { const tbl = PT[C().ui] || PT.en; const v = k in tbl ? tbl[k] : PT.en[k]; return typeof v === 'function' ? v(...a) : v; };
  const plan = () => ((window.ENGLISH || {}).plan || []);
  const topicOf = id => plan().find(t => t.id === id);
  const topicName = t => (t ? (t[C().ui === 'no' ? 'no' : C().ui === 'uk' ? 'uk' : 'en'] || t.en) : '');
  const topicDone = t => t.stories.every(id => stars('en:' + id) > 0);
  function planModel(topics, storyIsDone = id => stars('en:' + id) > 0) {
    const rows = topics.map((topic, index) => {
      const storiesDone = topic.stories.filter(storyIsDone).length;
      return { topic, index, storiesDone, storiesTotal: topic.stories.length, state: storiesDone === topic.stories.length ? 'done' : 'todo' };
    });
    const firstOpen = rows.findIndex(row => row.state !== 'done');
    const activeIndex = firstOpen < 0 ? Math.max(0, rows.length - 1) : firstOpen;
    if (rows[activeIndex] && rows[activeIndex].state !== 'done') rows[activeIndex].state = 'active';
    const levels = [...new Set(topics.map(t => t.level))].map(level => {
      const list = rows.filter(row => row.topic.level === level);
      return { level, done: list.filter(row => row.state === 'done').length, total: list.length };
    });
    return {
      rows,
      levels,
      activeIndex,
      done: rows.filter(row => row.state === 'done').length,
      total: rows.length,
      storiesDone: rows.reduce((n, row) => n + row.storiesDone, 0),
      storiesTotal: rows.reduce((n, row) => n + row.storiesTotal, 0),
      complete: rows.length > 0 && rows.every(row => row.state === 'done')
    };
  }
  function renderPlan() {
    const K = C(), { h } = K;
    const L = K.ui === 'no' ? 'no' : K.ui === 'uk' ? 'uk' : 'en';
    const topics = plan();
    const model = planModel(topics);
    // наступна історія: перша без зірки, в порядку тем
    let next = null;
    for (const t of topics) { const id = t.stories.find(s => byId(s) && !stars('en:' + s)); if (id) { next = byId(id); break; } }
    const say = text => K.Speech && K.Speech.speak ? K.Speech.speak(text, 'narrator', { lang: 'en' }) : null;
    const pct = model.total ? Math.round(model.done / model.total * 100) : 0;
    const jump = id => { const node = document.getElementById(id); if (node) node.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    const active = model.rows[model.activeIndex];
    const route = h('div', { class: 'en-plan-route', style: { gridTemplateColumns: `repeat(${model.total}, minmax(58px, 1fr))`, minWidth: Math.max(760, model.total * 58) + 'px' } }, model.rows.map(row => h('button', {
      class: 'en-plan-node ' + row.state, type: 'button', title: topicName(row.topic), 'aria-label': `${row.index + 1}. ${topicName(row.topic)}`,
      'aria-current': row.state === 'active' ? 'step' : null, onclick: () => jump('en-topic-' + row.topic.id)
    }, h('b', {}, row.state === 'done' ? '✓' : row.index + 1), h('small', {}, row.topic.level))));
    const topicCard = row => {
      const t = row.topic, ok = row.state === 'done', isNext = row.state === 'active';
      const stories = t.stories.map(byId).filter(Boolean).map(c => h('div', { class: 'en-t-story' },
        h('a', { href: `#/english/${c.id}/0` }, c.title), K.stars(stars('en:' + c.id)),
        h('a', { class: 'btn small', href: `#/quiz/en/${c.id}` }, ex('test'))));
      return h('article', { id: 'en-topic-' + t.id, class: 'en-topic ' + row.state },
        h('div', { class: 'en-t-head' },
          h('span', { class: 'en-topic-number' }, ok ? '✓' : row.index + 1),
          h('div', {}, h('small', {}, pt('topic') + ' ' + (row.index + 1)), h('b', {}, topicName(t))),
          h('span', { class: 'en-t-st' }, ok ? pt('ok') : isNext ? pt('now') : pt('wait'))),
        h('div', { class: 'en-topic-meter' }, h('i', { style: { width: (row.storiesTotal ? row.storiesDone / row.storiesTotal * 100 : 0) + '%' } })),
        h('p', { class: 'en-rule' }, (t.rule || {})[L] || (t.rule || {}).en || ''),
        h('ul', { class: 'en-ex' }, (t.ex || []).map(x => h('li', {}, h('button', { class: 'en-say', type: 'button', title: '🔊', onclick: () => say(x) }, '🔊'), ' ', x))),
        h('div', { class: 'en-t-stories' }, stories));
    };
    const levelSections = model.levels.map(lv => h('section', { class: 'en-lv', id: 'en-level-' + lv.level },
      h('h3', { class: 'en-lv-h' }, h('span', { class: 'lvl lvl-' + lv.level }, lv.level), ' ', pt('level', lv.level), h('small', {}, ' · ' + pt('level_progress', lv.done, lv.total))),
      h('div', { class: 'en-topics' }, model.rows.filter(row => row.topic.level === lv.level).map(topicCard))));
    const journey = h('section', { class: 'en-plan-journey' },
      h('div', { class: 'en-plan-copy' },
        h('p', { class: 'en-plan-kicker' }, '🇬🇧 ', pt('journey')),
        h('h2', {}, active ? topicName(active.topic) : pt('all_done')),
        h('p', {}, pt('journey_hint')),
        next ? h('a', { class: 'btn yellow big', href: `#/english/${next.id}/0` }, pt('next'), ' · ', h('small', {}, next.title)) : h('b', { class: 'en-plan-finished' }, pt('all_done'))),
      h('div', { class: 'en-plan-score' },
        h('div', { class: 'en-plan-ring', style: { '--progress': pct + '%' } }, h('span', {}, h('b', {}, pct + '%'), h('small', {}, pt('done', model.done, model.total)))),
        h('div', { class: 'en-plan-stats' },
          h('span', {}, h('b', {}, model.done + '/' + model.total), h('small', {}, pt('topic'))),
          h('span', {}, h('b', {}, model.storiesDone + '/' + model.storiesTotal), h('small', {}, ex('stories'))))));
    const levelButtons = model.levels.map(lv => {
      const progress = (lv.total ? lv.done / lv.total * 100 : 0) + '%';
      return h('button', { type: 'button', onclick: () => jump('en-level-' + lv.level) },
        h('span', { class: 'lvl lvl-' + lv.level }, lv.level),
        h('b', {}, pt('level', lv.level)),
        h('small', {}, pt('level_progress', lv.done, lv.total)),
        h('i', {}, h('em', { style: { width: progress } })));
    });
    const levelNav = h('div', { class: 'en-plan-levels' }, levelButtons);
    setTimeout(() => {
      const node = document.querySelector('.en-plan-node.active');
      const wrap = node && node.closest('.en-plan-scale-wrap');
      if (node && wrap) wrap.scrollLeft = Math.max(0, node.offsetLeft - (wrap.clientWidth - node.offsetWidth) / 2);
    }, 40);
    return h('section', { class: 'english en-plan' }, K.pageHead(pt('title'), '#/english'), journey,
      h('p', { class: 'lead-p en-plan-intro' }, pt('intro')), levelNav,
      h('div', { class: 'en-plan-scale-wrap' }, route), levelSections);
  }

  function alphabetQuestions() {
    const K = C();
    const nOpt = K.settings.level === 'kids' ? 3 : 4;
    const n = K.settings.level === 'kids' ? 10 : 14;
    const rows = K.shuffle(ALPHABET).slice(0, n);
    return rows.map((row, i) => {
      const [letter, lower, word, emoji, uk, no] = row;
      const pool = ALPHABET.map(x => x[0]).filter(x => x !== letter);
      const options = K.shuffle([letter, ...K.sample(pool, nOpt - 1)]);
      const item = { emoji, uk, no, nb: no, en: word };
      return i % 2
        ? { type: 'enfirstletter', letter, lower, word, item, answer: letter, options }
        : { type: 'enletter', letter, lower, word, item, answer: letter, options };
    });
  }

  function renderAlphabet() {
    const K = C(), { h } = K;
    const sayRow = async row => {
      await K.claim();
      await K.Speech.speak(row[0], 'narrator', { rate: 0.78, lang: 'en' });
      await K.sleep(130);
      await K.Speech.speak(row[2], 'narrator', { rate: 0.9, lang: 'en' });
    };
    const playAll = async () => {
      await K.claim();
      for (const row of ALPHABET) {
        await K.Speech.speak(row[0], 'narrator', { rate: 0.78, lang: 'en' });
        await K.sleep(90);
      }
    };
    const traps = ALPHA_TRAPS[K.ui] || ALPHA_TRAPS.en;
    return h('section', { class: 'english en-alphabet' },
      K.pageHead(ex('alpha_title'), '#/english'),
      h('p', { class: 'lead-p' }, ex('alpha_intro')),
      h('div', { class: 'en-alpha-actions' },
        h('button', { class: 'btn primary big', type: 'button', onclick: playAll }, '🔊 ', ex('alpha_listen')),
        h('a', { class: 'btn accent big', href: '#/quiz/en-alphabet' }, '🧩 ', ex('alpha_test'))),
      h('div', { class: 'en-alpha-grid' }, ALPHABET.map(row => {
        const [letter, lower, word, emoji, uk, no] = row;
        return K.withTr(h('button', { class: 'en-alpha-card', type: 'button', onclick: () => sayRow(row), 'aria-label': `${letter}, ${word}` },
          h('span', { class: 'en-alpha-letters' }, letter, h('small', {}, lower)),
          h('span', { class: 'en-alpha-emoji en-alpha-visual', 'aria-hidden': 'true' }, sharedPicture(no, uk, emoji, 72)),
          h('b', {}, word), h('span', { class: 'en-alpha-play', 'aria-hidden': 'true' }, '🔊')), enTip(word, uk, no));
      })),
      h('aside', { class: 'en-alpha-traps' }, h('h2', {}, ex('alpha_traps')),
        h('div', {}, traps.map(([letter, note]) => h('p', {}, h('b', {}, letter), h('span', {}, note))))));
  }

  function renderAlphabetQuiz() {
    return runQuiz({ key: 'en-alphabet', title: ex('alpha_test'), build: alphabetQuestions, reread: '#/english/alphabet' });
  }

  function renderList(asHome) {
    const K = C(), { h } = K;
    const card = c => h('article', { class: 'card strip-card' },
      h('a', { class: 'card-cover', href: `#/english/${c.id}/0` }, K.svgEl(K.ART.panel(c, c.cover || 0, { lang: 'en', tr: 'uk+no', bubbles: false, chars: K.CH, style: 'strip' }))),
      h('div', { class: 'card-body' },
        h('span', { class: 'lvl lvl-' + c.level }, c.level), c.grammar && topicOf(c.grammar) ? h('a', { class: 'en-gram', href: '#/english/plan' }, '📐 ' + topicName(topicOf(c.grammar))) : null,
        h('h3', {}, c.title), h('p', { class: 'muted' }, K.ui === 'no' ? (c.summaryNo || c.summaryEn) : K.ui === 'uk' ? c.summaryUk : (c.summaryEn || c.summaryUk)),
        h('div', { class: 'row-left' },
          h('a', { class: 'btn primary', href: `#/english/${c.id}/0` }, ex('read')),
          h('a', { class: 'btn accent', href: `#/quiz/en/${c.id}` }, ex('test')),
          K.stars(stars('en:' + c.id)),
          h('span', { class: 'hint' }, ex('words', c.vocab.length)))));
    const lvls = LEVELS.filter(l => comics().some(c => c.level === l));
    const next = comics().find(c => !stars('en:' + c.id)) || comics()[0];
    const storyDone = comics().filter(c => stars('en:' + c.id)).length;
    const wordTotal = themes().reduce((n, t) => n + t.words.length, 0);
    const sample = ALPHABET.slice(0, 3);
    const tool = (href, icon, title, desc, tone) => h('a', { class: 'en-home-tool ' + tone, href },
      h('span', { class: 'en-home-tool-icon', 'aria-hidden': 'true' }, icon),
      h('span', {}, h('b', {}, title), h('small', {}, desc)), h('i', { 'aria-hidden': 'true' }, '→'));
    return h('section', { class: 'english en-home' },
      K.learnSwitch ? K.learnSwitch() : null,
      h('section', { class: 'en-home-hero' },
        h('div', { class: 'en-home-copy' },
          h('p', { class: 'en-home-kicker' }, '🇬🇧 ', ex('home_kicker')),
          h('h1', {}, ex('home_title')),
          h('p', { class: 'en-home-intro' }, ex('home_intro')),
          h('div', { class: 'en-home-actions' },
            h('a', { class: 'btn yellow big', href: `#/english/${next.id}/0` }, storyDone ? '▶ ' + ex('home_continue') : '▶ ' + ex('home_start')),
            h('a', { class: 'btn en-hero-outline big', href: '#/english/alphabet' }, '🔤 ', ex('alphabet_btn'))),
          h('div', { class: 'en-home-stats' },
            h('span', {}, h('b', {}, comics().length), h('small', {}, ex('stories'))),
            h('span', {}, h('b', {}, plan().length), h('small', {}, pt('topic'))),
            h('span', {}, h('b', {}, storyDone + '/' + comics().length), h('small', {}, pt('ok'))))),
        h('div', { class: 'en-letter-board', 'aria-label': ex('alphabet_btn') },
          h('div', { class: 'en-board-pin', 'aria-hidden': 'true' }),
          h('strong', {}, 'A · B · C'),
          h('p', {}, ex('alphabet_desc')),
          h('div', {}, sample.map(row => h('button', { type: 'button', onclick: () => speak(row[2], 'narrator', 0.86), 'aria-label': row[2] },
            h('b', {}, row[0], h('small', {}, row[1])), h('span', { class: 'en-alpha-visual' }, sharedPicture(row[5], row[4], row[3], 42)), h('em', {}, row[2])))),
          h('a', { href: '#/english/alphabet' }, ex('alpha_title'), ' →'))),
      h('div', { class: 'en-home-section-head' }, h('div', {}, h('span', {}, '01'), h('h2', {}, ex('home_paths'))), h('p', {}, ex('lang_note'))),
      h('div', { class: 'en-home-tools' },
        tool('#/english/alphabet', '🔤', ex('alphabet_btn'), ex('alphabet_desc'), 'red'),
        tool('#/english/plan', '🗺️', pt('btn').replace(/^\S+\s*/, ''), ex('plan_desc', plan().length), 'blue'),
        tool('#/english/words', '📝', ex('words_btn').replace(/^\S+\s*/, ''), ex('words_desc', wordTotal), 'yellow'),
        tool('#/quiz/en-words', '🎧', ex('all_words_test').replace(/^\S+\s*/, ''), ex('test_desc'), 'green')),
      missList().length ? h('div', { class: 'en-home-mistakes' }, h('a', { class: 'btn yellow', href: '#/quiz/en-mistakes' }, ex('mistakes') + ' (' + missList().length + ')')) : null,
      h('div', { class: 'en-home-section-head stories' }, h('div', {}, h('span', {}, '02'), h('h2', {}, ex('home_stories'))), h('p', {}, ex('known_all', knownCount()))),
      lvls.map(l => h('div', { class: 'en-lv' }, h('h3', { class: 'en-lv-h' }, h('span', { class: 'lvl lvl-' + l }, l), ' ', pt('level', l), h('small', {}, ' · ' + comics().filter(c => c.level === l).length)),
        h('div', { class: 'grid' }, comics().filter(c => c.level === l).map(card)))));
  }

  /* Читання історії. Розмітка навмисно та сама, що й у норвезьких коміксах
     (.reader → .stage з накладкою .pv-ui → .script з .foot-rows): увесь
     телефонний вигляд — один екран без гортання — описаний у style.css для цих
     класів, тож курс англійської отримує його разом із ними, а не власною
     копією правил, яка почала б розходитися з першою ж правкою. */
  function renderRead(id, idx) {
    const K = C(), { h } = K;
    const c = byId(id); if (!c) return renderList();
    const n = c.panels.length;
    const i = Math.max(0, Math.min(n - 1, idx | 0));
    const panelData = c.panels[i];
    const href = k => `#/english/${c.id}/${k}`;

    const playBtn = h('button', { class: 'pv-btn pv-play', type: 'button', title: ex('play'), 'aria-label': ex('play') }, '▶');
    const setPlay = on => { playBtn.classList.toggle('on', !!on); playBtn.textContent = on ? '⏸' : '▶'; };
    const stop = () => { K.stopAll(); setPlay(false); };
    const say = async lines => {
      await K.claim();
      for (const l of lines) { await K.Speech.speak(l.en, l.who, { lang: 'en' }); await K.sleep(160); }
    };
    const playPanel = async () => { setPlay(true); await say(panelData.lines); setPlay(false); };
    const playAll = async () => {
      setPlay(true);
      await K.claim();
      for (let k = i; k < n; k++) {
        location.hash = href(k);
        await say(c.panels[k].lines);
      }
      setPlay(false);
    };
    playBtn.addEventListener('click', () => (playBtn.classList.contains('on') ? stop() : playPanel()));

    const line = l => h('li', {}, h('button', { class: 'play', type: 'button', 'aria-label': 'Listen', onclick: () => speak(l.en, l.who) }, '🔊'),
      h('b', { style: { color: K.ch(l.who).color } }, K.ch(l.who).emoji + ' ' + (K.ch(l.who).en || K.ch(l.who).no) + ': '),
      K.withTr(h('span', { class: 'en-line' }, enWords(l.en)), enTip(l.en, l.uk, l.no || '')));

    const seen = K.store.get('en.seen.' + c.id, []);
    if (!seen.includes(i)) K.store.set('en.seen.' + c.id, [...seen, i]);
    const dots = cls => h('nav', { class: cls }, K.range(n).map(k =>
      h('a', { class: 'dot' + (k === i ? ' on' : '') + (seen.includes(k) ? ' seen' : ''), href: href(k), 'aria-current': k === i ? 'true' : null }, k + 1)));

    /* Накладка живе всередині рамки: рамка знає свій розмір, тож стрілки стоять
       на краях саме малюнка, а не десь поруч із ним. */
    const panel = h('div', { class: 'panel-frame strip-frame big' }, K.svgEl(K.ART.panel(c, i, { lang: 'en', tr: 'uk+no', chars: K.CH, style: 'strip' })));
    panel.append(h('div', { class: 'pv-ui' },
      i > 0 ? h('a', { class: 'pv-btn pv-prev', href: href(i - 1), title: ex('prev'), 'aria-label': ex('prev') }, '◀') : null,
      playBtn,
      i + 1 < n ? h('a', { class: 'pv-btn pv-next', href: href(i + 1), title: ex('next'), 'aria-label': ex('next') }, '▶') : null,
      h('span', { class: 'pv-n' }, `${i + 1} / ${n}`)));
    /* Поки звучить — дотик будь-де по кадру зупиняє. Коли тихо, дотик по
       малюнку нічого не робить: випадково ввімкнути звук гірше, ніж не влучити
       в кнопку. */
    panel.addEventListener('click', e => {
      if (e.target.closest('.pv-btn')) return;
      if (playBtn.classList.contains('on')) stop();
    });

    const script = h('div', { class: 'script' },
      h('div', { class: 'panel-label' }, ex('panel_of', i + 1, n)),
      h('ul', { class: 'lines' }, panelData.lines.map(line)),
      h('div', { class: 'foot-rows' + (i === n - 1 ? ' last' : '') },
        h('div', { class: 'controls play-row' },
          h('button', { class: 'btn primary on-panel', type: 'button', onclick: playPanel }, ex('play')),
          h('button', { class: 'btn', type: 'button', onclick: playAll }, ex('all')),
          h('button', { class: 'btn icon ghost', type: 'button', title: ex('stop'), 'aria-label': ex('stop'), onclick: stop }, '🛑')),
        h('div', { class: 'controls nav-row' },
          h('a', { class: 'btn on-panel', href: href(i - 1), 'aria-disabled': i === 0 ? 'true' : null }, ex('prev')), h('span', { class: 'grow' }),
          i + 1 < n ? h('a', { class: 'btn yellow on-panel', href: href(i + 1) }, ex('next')) : h('a', { class: 'btn accent', href: `#/quiz/en/${c.id}` }, ex('to_test')))),
      h('details', { class: 'vocab' }, h('summary', {}, ex('vocab', c.vocab.length)),
        h('div', { class: 'vocab-list word-grid' }, c.vocab.map(([en, uk, no]) => K.withTr(h('button', { class: 'word-card', type: 'button', onclick: () => speak(en) },
          h('span', { class: 'wc-main' }, h('b', { class: 'wc-no' }, en), h('span', { class: 'wc-tr' }, enCard(en, uk, no)))), enTip(en, uk, no))))));

    const view = h('section', { class: 'reader english-reader' },
      h('div', { class: 'reader-top' },
        h('a', { class: 'btn', href: '#/english' }, ex('back')),
        h('div', { class: 'reader-title' }, h('h2', {}, c.title),
          h('span', { class: 'meta' }, h('span', { class: 'lvl lvl-' + c.level }, c.level))),
        dots('dots')),
      h('div', { class: 'reader-grid' }, h('div', { class: 'stage' }, panel, dots('dots dots-under')), script));
    if (K.readFocus) K.readFocus(true);
    return view;
  }

  /* ---------------- тест ---------------- */
  function buildQuiz(c) {
    const K = C();
    const kids = K.settings.level === 'kids', nOpt = kids ? 3 : 4;
    const all = c.panels.flatMap((p, pi) => p.lines.map(l => ({ ...l, pi })));
    const talk = all.filter(l => l.who !== 'narrator' && l.en.length > 8);
    const speakers = K.uniq(talk.map(l => l.who));
    const opts = (ans, pool) => K.shuffle([ans, ...K.sample(K.uniq(pool).filter(x => x !== ans), nOpt - 1)]);
    const qs = [];
    if (speakers.length >= 2) K.sample(talk, 3).forEach(l => qs.push({ type: 'who', line: l, answer: l.who, options: opts(l.who, speakers) }));
    K.sample(talk, 2).forEach(l => qs.push({ type: 'panel', line: l, answer: l.pi, options: opts(l.pi, K.range(c.panels.length)) }));
    K.sample(c.vocab, 3).forEach(([en]) => qs.push({ type: 'listen', word: en, answer: en, options: opts(en, c.vocab.map(v => v[0])) }));
    const pics = (K.B.pictures || []).map(([type, , , en]) => ({ type, en })).filter(p => p.en);
    K.sample(pics, 2).forEach(p => qs.push({ type: 'picture', pict: p.type, answer: p.en, options: opts(p.en, pics.map(x => x.en)) }));
    const pool = K.uniq(all.flatMap(x => (x.en.match(/[A-Za-z']{4,}/g) || [])));
    K.shuffle(talk.filter(l => (l.en.match(/[A-Za-z']{4,}/g) || []).length >= 2)).slice(0, kids ? 2 : 4).forEach(l => {
      const w = K.pick(l.en.match(/[A-Za-z']{4,}/g));
      qs.push({ type: 'blank', line: l, word: w, answer: w, options: opts(w, pool) });
    });
    return K.shuffle(qs).slice(0, kids ? 10 : 12);
  }

  function renderQuiz(id) {
    const c = byId(id); if (!c) return renderList();
    return runQuiz({ key: 'en:' + c.id, title: c.title, build: () => buildQuiz(c), c, reread: `#/english/${c.id}/0` });
  }
  /* Питання будуємо з журналу помилок цього курсу. Слово, яке знайшлося серед
     тематичних, повертається з картинкою й перекладом; решту питаємо на слух —
     це все одно краще, ніж не повертати його взагалі. */
  function missQuestions(n) {
    const K = C();
    const nOpt = K.settings.level === 'kids' ? 3 : 4;
    const all = themes().flatMap(t => t.words.map(w => [t, w]));
    const byEn = new Map(all.map(([t, w]) => [String(w[2]).toLowerCase(), [t, w]]));
    const pool = K.uniq(all.map(([, w]) => w[2]));
    const out = [];
    for (const e of missList()) {
      const hit = byEn.get(String(e.k).toLowerCase());
      const word = hit ? hit[1][2] : e.k;
      const item = hit
        ? { no: hit[1][2], en: hit[1][2], uk: hit[1][1], nb: hit[1][0], emoji: hit[1][3] }
        : { no: word, en: word, uk: e.uk || '' };
      const options = K.shuffle([word, ...K.sample(pool.filter(x => x !== word), nOpt - 1)]);
      const asEmoji = hit && hit[1][3] && out.length % 2 === 1;
      out.push(asEmoji
        ? { type: 'emoji', lang: 'en', item, answer: word, options }
        : { type: 'listen', lang: 'en', item, word, answer: word, options });
      if (out.length >= n) break;
    }
    return out;
  }
  function renderMissQuiz() {
    const K = C(), { h } = K;
    const n = missList().length;
    if (!n) return h('section', { class: 'english' }, K.pageHead(ex('mistakes'), '#/english'), h('p', { class: 'lead-p' }, ex('mistakes_none')));
    return runQuiz({ key: 'en-miss', title: ex('mistakes'), build: () => missQuestions(K.settings.level === 'kids' ? 8 : 12) });
  }
  function renderWordsQuiz(themeId) {
    const K = C();
    const t = themes().find(x => x.id === themeId);
    return runQuiz({ key: 'enw:' + (t ? t.id : 'all'), title: t ? `${t.icon} ${t.en}` : 'Words', build: () => wordQuestions(t ? t.id : null, K.settings.level === 'kids' ? 10 : 14), reread: t ? '#/english/words/' + t.id : '#/english/words' });
  }
  function runQuiz({ key, title, build, c = null, reread = '#/english' }) {
    const K = C(), { h } = K;
    /* Без акаунта тестів можна пройти обмежену кількість — і рахунок один на
       весь сайт. Доти курс англійської цього не питав, тож через нього ліміт
       просто обходився: лічильник норвезьких тестів лишався недоторканим. */
    const gate = K.quizGate ? K.quizGate(key, reread) : null;
    if (gate) return gate;
    const S = { qs: build(), i: 0, score: 0 };
    const root = h('section', { class: 'quiz english-quiz' });
    const draw = () => {
      K.stopAll();
      if (S.i >= S.qs.length) return result();
      const q = S.qs[S.i];
      const [title, tag] = QE[q.type];
      const scoreEl = h('span', { class: 'stat' }, `⭐ ${S.score}`);
      const card = h('div', { class: 'q-card' }, window.KomiksIcons ? window.KomiksIcons.chip(q.type, tag) : h('span', { class: 'q-type' }, tag), K.withTr(h('h3', { class: 'q-title' }, title), tip(q.type)));
      /* Клас обов'язковий: у режимі одного екрана саме .q-body стає гнучкою
         колонкою всередині картки, а варіанти — тим, що гортається, якщо не
         влізли. Без нього картка з overflow: hidden просто обрізала відповіді
         знизу — на телефоні з короткою видимою частиною екрана це й виглядало
         як збита розмітка. */
      const body = h('div', { class: 'q-body' });
      card.append(body);
      const sayIt = () => {
        if (q.type === 'listen') speak(q.word, 'narrator', 0.85);
        else if (q.type === 'enletter') speak(q.letter, 'narrator', 0.78);
        else if (q.type === 'enfirstletter') speak(q.word, 'narrator', 0.86);
        else if (q.type === 'picture' || q.type === 'emoji') speak(q.answer, 'narrator', 0.9);
        else if (q.line) speak(q.line.en, q.line.who);
      };
      const finish = ok => {
        if (ok) { S.score++; K.Sfx.good(); } else { K.Sfx.bad(); logMiss(q, key, title); }
        const label = q.type === 'panel' ? '#' + (q.answer + 1) : q.type === 'who' ? (K.ch(q.answer).en || K.ch(q.answer).no) : q.answer;
        const nextBtn = h('button', { class: 'btn ' + (ok ? 'good' : 'yellow'), type: 'button', onclick: () => { S.i++; draw(); } }, S.i + 1 < S.qs.length ? ui('next') : ui('result'));
        const box = h('div', { class: 'feedback ' + (ok ? 'ok' : 'no'), role: 'status' },
          h('span', { style: { fontSize: '2rem' } }, ok ? K.pick(['🎉', '🌟', '👏']) : '🤔'),
          h('span', { class: 'msg' }, ok ? freshPick(PRAISE) : [ui('correct'), h('em', {}, String(label))]),
          h('button', { class: 'play', type: 'button', onclick: sayIt }, '🔊'), nextBtn);
        card.append(box);
        scoreEl.textContent = `⭐ ${S.score}`;
        nextBtn.focus({ preventScroll: true });
        /* Далі саме, без зайвого дотику: на правильну відповідь дивитися нема
           чого, а неправильну встигаєш прочитати. Дотик будь-де або пробіл
           перескакують одразу — так само, як у норвезьких тестах. */
        if (K.autoNext) K.autoNext(box, nextBtn, ok);
        /* Похвала голосом — англійською, бо це курс англійської: учень чує
           живу фразу, а не лише бачить галочку. Після помилки спершу похвали
           не буде, зате прозвучить правильна відповідь. */
        cheer(ok).then(() => { if (!ok) sayIt(); });
      };
      const choice = (options, render, isRight, cls = '') => {
        const wrap = h('div', { class: 'opts ' + cls });
        const btns = options.map(o => {
          const b = h('button', { class: 'opt', type: 'button' }, render(o));
          b.addEventListener('click', () => {
            if (wrap.classList.contains('locked')) return;
            wrap.classList.add('locked');
            const ok = isRight(o);
            btns.forEach((x, j) => { if (isRight(options[j])) x.classList.add('good'); else if (x !== b) x.classList.add('dim'); });
            if (!ok) b.classList.add('bad');
            finish(ok);
          });
          return b;
        });
        wrap.append(...btns);
        return wrap;
      };
      const bigPlay = fn => { const b = h('button', { class: 'big-play', type: 'button', 'aria-label': 'Listen', onclick: fn }, '🔊'); setTimeout(fn, 400); return b; };
      if (q.type === 'enletter') {
        body.append(h('div', { class: 'q-prompt center en-alpha-prompt' }, bigPlay(() => speak(q.letter, 'narrator', 0.78)), h('span', { class: 'en-alpha-question' }, '?')),
          choice(q.options, o => h('span', { class: 'en-alpha-option' }, o, h('small', {}, o.toLowerCase())), o => o === q.answer));
      } else if (q.type === 'enfirstletter') {
        body.append(h('div', { class: 'q-prompt center en-alpha-prompt' }, h('div', { class: 'emoji-big en-alpha-visual' }, sharedPicture(q.item.nb || q.item.no, q.item.uk, q.item.emoji, 132)), h('div', { class: 'en-alpha-word' }, q.word), bigPlay(() => speak(q.word, 'narrator', 0.86))),
          choice(q.options, o => h('span', { class: 'en-alpha-option' }, o, h('small', {}, o.toLowerCase())), o => o === q.answer));
      } else if (q.type === 'who') {
        body.append(h('div', { class: 'q-prompt' }, bigPlay(() => speak(q.line.en, q.line.who)), h('div', { class: 'say' }, '«', enWords(q.line.en), '»')),
          choice(q.options, w => [h('span', { class: 'ava', style: { background: K.ch(w).color } }, K.ch(w).emoji), h('span', {}, K.ch(w).en || K.ch(w).no)], w => w === q.answer));
      } else if (q.type === 'panel') {
        body.append(h('div', { class: 'q-prompt' }, bigPlay(() => speak(q.line.en, q.line.who)), h('div', { class: 'say' }, '«', enWords(q.line.en), '»')),
          choice(q.options, pi => h('div', { class: 'panel-frame strip-frame' }, K.svgEl(K.ART.panel(c, pi, { lang: 'en', bubbles: false, chars: K.CH, style: 'strip' }))), pi => pi === q.answer, 'pics'));
        K.$$('.opt', body).forEach(b => b.classList.add('pic'));
      } else if (q.type === 'listen') {
        body.append(h('div', { class: 'q-prompt' }, bigPlay(() => speak(q.word, 'narrator', 0.85)), h('button', { class: 'btn', type: 'button', onclick: () => speak(q.word, 'narrator', 0.6) }, '🐢')),
          choice(q.options, o => o, o => o === q.answer));
        K.$$('.opt', body).forEach(b => b.classList.add('word'));
      } else if (q.type === 'emoji') {
        body.append(h('div', { class: 'q-prompt center' }, h('div', { class: 'emoji-big en-word-visual' }, sharedPicture(q.item.nb, q.item.uk, q.item.emoji, 150))),
          choice(q.options, o => o, o => o === q.answer));
        K.$$('.opt', body).forEach(b => b.classList.add('word'));
      } else if (q.type === 'picture') {
        body.append(h('div', { class: 'q-prompt center' }, h('div', { class: 'pict' }, K.svgEl(K.ART.propSVG(q.pict)))),
          choice(q.options, o => o, o => o === q.answer));
        K.$$('.opt', body).forEach(b => b.classList.add('word'));
      } else if (q.type === 'blank') {
        const at = q.line.en.indexOf(q.word);
        const sentence = h('div', { class: 'say' }, enWords(q.line.en.slice(0, at)), h('span', { class: 'blank' }, '?'), enWords(q.line.en.slice(at + q.word.length)));
        body.append(h('div', { class: 'q-prompt' }, h('span', { class: 'ava', style: { background: K.ch(q.line.who).color, width: '64px', height: '64px' } }, K.ch(q.line.who).emoji), sentence),
          choice(q.options, o => o, o => o === q.answer));
        K.$$('.opt', body).forEach(b => b.classList.add('word'));
      }
      root.replaceChildren(
        h('div', { class: 'q-head' }, h('a', { class: 'btn', href: reread }, ui('exit')), h('h2', {}, `🇬🇧 ${title}`), scoreEl),
        h('div', { class: 'bar', role: 'progressbar' }, h('i', { style: { width: (S.i / S.qs.length * 100) + '%' } })),
        h('div', { class: 'panel-label', style: { marginBottom: '10px' } }, fmt(ui('q_of_tpl'), { i: S.i + 1, n: S.qs.length })),
        card);
      /* Той самий режим одного екрана, що й у норвезьких тестах: на телефоні
         питання з відповідями мусить поміщатися без гортання. */
      if (K.quizFocus) K.quizFocus(true);
      window.scrollTo({ top: 0 });
    };
    const result = () => {
      if (K.quizFocus) K.quizFocus(false);
      /* Гостьовий тест зараховуємо аж тут: зазирнути й передумати не має
         коштувати єдиної спроби — так само, як у норвезьких тестах. */
      if (K.guestCount) K.guestCount(key);
      const pct = Math.round(S.score / S.qs.length * 100);
      K.recordQuiz(key, '🇬🇧 ' + title, S.score, S.qs.length);
      if (pct >= 60) { K.confetti(); K.Sfx.win(); }
      root.replaceChildren(h('div', { class: 'q-card result' },
        h('div', { class: 'big-stars' }, K.stars(pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0)),
        h('h2', {}, ui('result')), h('p', { class: 'score' }, fmt(ui('score_tpl'), { s: S.score, n: S.qs.length, p: pct })),
        h('div', { class: 'row-center' },
          h('button', { class: 'btn accent', type: 'button', onclick: () => { S.qs = build(); S.i = 0; S.score = 0; draw(); } }, ui('again')),
          h('a', { class: 'btn', href: reread }, ui('reread')),
          h('a', { class: 'btn', href: '#/english' }, ui('home'))),
        window.KomiksExtras && window.KomiksExtras.shareResult ? window.KomiksExtras.shareResult({ title: title, score: S.score, total: S.qs.length }) : null));
    };
    draw();
    return root;
  }

  let hideTr = false;
  function renderWords(themeId) {
    const K = C(), { h } = K;
    const t = themeId ? themes().find(x => x.id === themeId) : null;
    if (!t) {
      return h('section', { class: 'english words-page' }, K.pageHead(ex('words_title'), '#/english'),
        h('p', { class: 'lead-p' }, ex('words_intro')),
        h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/quiz/en-words' }, ex('all_words_test')), h('span', { class: 'known-chip' }, ex('known_all', knownCount())), K.stars(stars('enw:all'))),
        ...LEVELS.flatMap(l => { const list = themes().filter(x => x.level === l); return list.length ? [h('h3', { class: 'sec-sub' }, l),
          h('div', { class: 'theme-grid' }, list.map(x => K.withTr(h('a', { class: 'theme-tile strip-card', href: '#/english/words/' + x.id }, h('span', { class: 'tt-ico' }, themePicture(x)), h('b', {}, x.en), h('small', {}, x.uk),
            h('span', { class: 'tt-meta' }, ex('known_n', knownCount(x.id), x.words.length), ' ', K.stars(stars('enw:' + x.id)))), { uk: x.uk, no: x.no })))] : []; }));
    }
    const grid = h('div', { class: 'word-grid' + (hideTr ? ' hide-tr' : '') });
    const counter = h('span', { class: 'known-chip' }, ex('known_n', knownCount(t.id), t.words.length));
    grid.append(...t.words.map(([no, uk, en, emoji]) => {
      const mark = h('button', { class: 'wc-know', type: 'button', title: ex('know'), 'aria-label': ex('know'), 'aria-pressed': String(isKnown(t.id, en)) }, '✓');
      const card = h('div', { class: 'word-card strip-word' + (isKnown(t.id, en) ? ' known' : '') },
        h('button', { class: 'wc-main', type: 'button', onclick: () => { speak(en, 'narrator', 0.9); card.classList.add('peek'); } },
          h('span', { class: 'wc-emoji' }, sharedPicture(no, uk, emoji, 78)), h('b', { class: 'wc-no' }, en), h('span', { class: 'wc-tr' }, uk)), mark);
      mark.addEventListener('click', e => { e.stopPropagation(); const on = toggleKnown(t.id, en); card.classList.toggle('known', on); mark.setAttribute('aria-pressed', String(on)); K.Sfx.tick(); counter.textContent = ex('known_n', knownCount(t.id), t.words.length); });
      return K.withTr(card, { uk, no });
    }));
    const toggle = h('button', { class: 'btn', type: 'button', onclick: () => { hideTr = !hideTr; grid.classList.toggle('hide-tr', hideTr); toggle.textContent = hideTr ? ex('show') : ex('hide'); } }, hideTr ? ex('show') : ex('hide'));
    const playAll = async () => { await K.claim(); for (const w of t.words) { await K.Speech.speak(w[2], 'narrator', { rate: 0.9, lang: 'en' }); await K.sleep(200); } };
    return h('section', { class: 'english words-page' }, K.pageHead(`${t.icon} ${t.en} — ${t.uk}`, '#/english/words'),
      h('div', { class: 'gram-chips' }, themes().map(x => h('a', { class: 'chip' + (x.id === t.id ? ' on' : ''), href: '#/english/words/' + x.id }, x.icon + ' ' + x.en))),
      h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/quiz/en-words/' + t.id }, ex('topic_test')), toggle, h('button', { class: 'btn', type: 'button', onclick: playAll }, ex('play_all')), counter, h('span', { class: 'lvl lvl-' + t.level }, t.level), K.stars(stars('enw:' + t.id))),
      grid);
  }

  window.KomiksEnglish = { comics, byId, render: renderList, plan: renderPlan, planModel, alphabet: renderAlphabet, alphabetQuiz: renderAlphabetQuiz, alphabetData: ALPHABET, read: renderRead, quiz: renderQuiz, words: renderWords, wordsQuiz: renderWordsQuiz, missQuiz: renderMissQuiz, wordQuestions, knownCount, text: ex, stars, lookup: lookupEn };
})();
