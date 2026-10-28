/* Комікс·Lab — «Слова»: тематичні словники з емодзі, озвученням, режимом навчання й тестами.
   Дані — data/words.js (window.WORDS). Тести лише норвезькою: «Hva er dette?» за емодзі та «Lytt og velg». */
(() => {
  'use strict';
  const WX = {
    uk: {
      room: '🎮 Гра разом (QR)', room_hint: 'Створити кімнату з цією темою: учні сканують QR-код і відповідають з телефонів',
      nav: 'Слова', module: ['📝', 'Слова', 'понад {n} слів за темами з озвученням'],
      title: '📝 Слова за темами', intro: 'Найпотрібніші норвезькі слова: сім’я, їжа, одяг, тварини, місто, професії, почуття… Натисни на картку — почуєш слово. Для іменників показано рід: en, ei або et.',
      themes: '🗂️ Теми', words_n: n => `${n} слів`, learn: '🙈 Сховати переклад', show: '👀 Показати переклад', play_all: '🔊 Прослухати всі', test: '🧩 Тест з теми',
      all_test: '🧩 Тест з усіх слів', tip: 'Порада: сховай переклад і спробуй згадати значення, потім натисни на картку, щоб перевірити.', back: '← Усі теми', tests: '📝 Слова за темами',
      step: x => `Слова: ${x}`, gender: 'en — чоловічий, ei — жіночий, et — середній рід',
      say: 'Сказати вголос', know: 'Знаю', know_hint: 'Позначай слова, які вже знаєш, — лічильник потрапляє в кабінет.', known_n: (a, b) => `✅ Знаю: ${a} з ${b}`, known_all: n => `✅ Знаю: ${n}`, reset_known: '↩️ Зняти позначки теми'
    },
    en: {
      room: '🎮 Play together (QR)', room_hint: 'Create a room with this topic: students scan the QR code and answer on their phones',
      nav: 'Words', module: ['📝', 'Words', '{n}+ words by topic with audio'],
      title: '📝 Words by topic', intro: 'The most useful Norwegian words: family, food, clothes, animals, town, jobs, feelings… Tap a card to hear the word. Nouns show their gender: en, ei or et.',
      themes: '🗂️ Topics', words_n: n => `${n} words`, learn: '🙈 Hide translation', show: '👀 Show translation', play_all: '🔊 Listen to all', test: '🧩 Topic test',
      all_test: '🧩 Test on all words', tip: 'Tip: hide the translation and try to remember the meaning, then tap the card to check.', back: '← All topics', tests: '📝 Words by topic',
      step: x => `Words: ${x}`, gender: 'en — masculine, ei — feminine, et — neuter',
      say: 'Say it out loud', know: 'I know it', know_hint: 'Mark the words you already know — the counter shows up in your account.', known_n: (a, b) => `✅ Known: ${a} of ${b}`, known_all: n => `✅ Known: ${n}`, reset_known: '↩️ Clear marks in this topic'
    },
    de: {
      room: '🎮 Gemeinsam spielen (QR)', room_hint: 'Einen Raum mit diesem Thema erstellen: Die Schüler scannen den QR-Code und antworten auf dem Handy',
      nav: 'Wörter', module: ['📝', 'Wörter', '{n}+ Wörter nach Themen mit Ton'],
      title: '📝 Wörter nach Themen', intro: 'Die nützlichsten norwegischen Wörter: Familie, Essen, Kleidung, Tiere, Stadt, Berufe, Gefühle… Tippe eine Karte an, um das Wort zu hören. Bei Substantiven steht das Geschlecht: en, ei oder et.',
      themes: '🗂️ Themen', words_n: n => `${n} Wörter`, learn: '🙈 Übersetzung verbergen', show: '👀 Übersetzung zeigen', play_all: '🔊 Alle anhören', test: '🧩 Themen-Test',
      all_test: '🧩 Test über alle Wörter', tip: 'Tipp: verbirg die Übersetzung, versuch dich zu erinnern und tippe dann die Karte an, um zu prüfen.', back: '← Alle Themen', tests: '📝 Wörter nach Themen',
      step: x => `Wörter: ${x}`, gender: 'en — männlich, ei — weiblich, et — sächlich',
      say: 'Sprich es laut', know: 'Kann ich', know_hint: 'Markiere die Wörter, die du schon kannst — der Zähler erscheint in deinem Konto.', known_n: (a, b) => `✅ Kann ich: ${a} von ${b}`, known_all: n => `✅ Kann ich: ${n}`, reset_known: '↩️ Markierungen in diesem Thema löschen'
    },
    pl: {
      room: '🎮 Grajmy razem (QR)', room_hint: 'Utwórz pokój z tym tematem: uczniowie skanują kod QR i odpowiadają na telefonach',
      nav: 'Słowa', module: ['📝', 'Słowa', '{n}+ słów tematycznie z dźwiękiem'],
      title: '📝 Słowa według tematów', intro: 'Najbardziej przydatne norweskie słowa: rodzina, jedzenie, ubrania, zwierzęta, miasto, zawody, uczucia… Dotknij karty, aby usłyszeć słowo. Przy rzeczownikach widać rodzaj: en, ei albo et.',
      themes: '🗂️ Tematy', words_n: n => `${n} słów`, learn: '🙈 Ukryj tłumaczenie', show: '👀 Pokaż tłumaczenie', play_all: '🔊 Posłuchaj wszystkich', test: '🧩 Test z tematu',
      all_test: '🧩 Test ze wszystkich słów', tip: 'Wskazówka: ukryj tłumaczenie, spróbuj przypomnieć sobie znaczenie, a potem dotknij karty, aby sprawdzić.', back: '← Wszystkie tematy', tests: '📝 Słowa według tematów',
      step: x => `Słowa: ${x}`, gender: 'en — rodzaj męski, ei — żeński, et — nijaki',
      say: 'Powiedz na głos', know: 'Znam', know_hint: 'Zaznacz słowa, które już znasz — licznik pojawi się w twoim koncie.', known_n: (a, b) => `✅ Znane: ${a} z ${b}`, known_all: n => `✅ Znane: ${n}`, reset_known: '↩️ Wyczyść zaznaczenia w tym temacie'
    },
    tr: {
      room: '🎮 Birlikte oyna (QR)', room_hint: 'Bu konuyla bir oda oluştur: öğrenciler QR kodu tarar ve telefonlarından cevaplar',
      nav: 'Kelimeler', module: ['📝', 'Kelimeler', 'konulara göre {n}+ kelime, sesli'],
      title: '📝 Konulara göre kelimeler', intro: 'En işe yarayan Norveççe kelimeler: aile, yemek, kıyafet, hayvanlar, şehir, meslekler, duygular… Kelimeyi duymak için karta dokun. İsimlerde cinsiyet görünür: en, ei ya da et.',
      themes: '🗂️ Konular', words_n: n => `${n} kelime`, learn: '🙈 Çeviriyi gizle', show: '👀 Çeviriyi göster', play_all: '🔊 Hepsini dinle', test: '🧩 Konu testi',
      all_test: '🧩 Bütün kelimelerin testi', tip: 'İpucu: çeviriyi gizle, anlamı hatırlamaya çalış, sonra kontrol için karta dokun.', back: '← Bütün konular', tests: '📝 Konulara göre kelimeler',
      step: x => `Kelimeler: ${x}`, gender: 'en — eril, ei — dişil, et — nötr',
      say: 'Yüksek sesle söyle', know: 'Biliyorum', know_hint: 'Bildiğin kelimeleri işaretle — sayaç hesabında görünür.', known_n: (a, b) => `✅ Bilinen: ${b} içinden ${a}`, known_all: n => `✅ Bilinen: ${n}`, reset_known: '↩️ Bu konudaki işaretleri temizle'
    },
    lt: {
      room: '🎮 Žaiskime kartu (QR)', room_hint: 'Sukurti kambarį šia tema: mokiniai nuskaito QR kodą ir atsako telefonais',
      nav: 'Žodžiai', module: ['📝', 'Žodžiai', '{n}+ žodžių pagal temas su garsu'],
      title: '📝 Žodžiai pagal temas', intro: 'Naudingiausi norvegiški žodžiai: šeima, maistas, drabužiai, gyvūnai, miestas, profesijos, jausmai… Bakstelėk kortelę, kad išgirstum žodį. Prie daiktavardžių matyti giminė: en, ei arba et.',
      themes: '🗂️ Temos', words_n: n => `${n} žodžiai`, learn: '🙈 Slėpti vertimą', show: '👀 Rodyti vertimą', play_all: '🔊 Klausyti visų', test: '🧩 Temos testas',
      all_test: '🧩 Visų žodžių testas', tip: 'Patarimas: paslėpk vertimą, pabandyk prisiminti reikšmę, tada bakstelėk kortelę pasitikrinti.', back: '← Visos temos', tests: '📝 Žodžiai pagal temas',
      step: x => `Žodžiai: ${x}`, gender: 'en — vyriškoji, ei — moteriškoji, et — bevardė giminė',
      say: 'Pasakyk balsu', know: 'Moku', know_hint: 'Pažymėk žodžius, kuriuos jau moki — skaitiklis matomas tavo paskyroje.', known_n: (a, b) => `✅ Moku: ${a} iš ${b}`, known_all: n => `✅ Moku: ${n}`, reset_known: '↩️ Išvalyti šios temos žymas'
    },
    no: {
      room: '🎮 Spill sammen (QR)', room_hint: 'Lag et rom med dette temaet: elevene skanner QR-koden og svarer på mobilen',
      nav: 'Ord', module: ['📝', 'Ord', 'over {n} ord etter tema, med lyd'],
      title: '📝 Ord etter tema', intro: 'De viktigste norske ordene: familie, mat, klær, dyr, byen, yrker, følelser … Trykk på et kort for å høre ordet. Substantiv står med kjønn: en, ei eller et.',
      themes: '🗂️ Temaer', words_n: n => `${n} ord`, learn: '🙈 Skjul oversettelsen', show: '👀 Vis oversettelsen', play_all: '🔊 Hør alle', test: '🧩 Test i temaet',
      all_test: '🧩 Test i alle ordene', tip: 'Tips: skjul oversettelsen og prøv å huske betydningen.', back: '← Alle temaer', tests: '📝 Ord etter tema',
      step: x => `Ord: ${x}`, gender: 'en — hankjønn, ei — hunkjønn, et — intetkjønn',
      say: 'Si det høyt', know: 'Jeg kan det', know_hint: 'Merk ordene du allerede kan – telleren vises på siden din.', known_n: (a, b) => `✅ Kan: ${a} av ${b}`, known_all: n => `✅ Kan: ${n}`, reset_known: '↩️ Fjern merkene i temaet'
    }
  };
  const wordCount = () => { const set = new Set(); for (const th of ((window.WORDS || {}).themes || [])) for (const w of th.words) set.add(String(w[0]).toLowerCase()); return Math.floor(set.size / 10) * 10; };
  if (window.I18N) for (const l of ['uk', 'en', 'no', 'de', 'pl', 'tr', 'lt']) {
    const I = window.I18N[l]; if (!I) continue;
    I.nav = Object.assign({}, I.nav, { words: WX[l].nav });
    /* скільки слів насправді: рахуємо унікальні слова всіх тем у момент показу (теми дописують
       words2–4, words-tools тощо), округлюємо вниз до десятків — «понад 1110» */
    const mod = WX[l].module;
    I.modules = Object.assign({}, I.modules);
    Object.defineProperty(I.modules, 'words', { enumerable: true, configurable: true, get: () => mod.map(x => String(x).replace('{n}', wordCount())) });
    // підказка до завдання «Hva er dette?» — мовою учня
    const EMOJI_Q = { uk: 'Що це? Вибери норвезьке слово', en: 'What is this? Choose the Norwegian word',
      de: 'Was ist das? Wähle das norwegische Wort', pl: 'Co to jest? Wybierz norweskie słowo',
      tr: 'Bu nedir? Norveççe kelimeyi seç', lt: 'Kas tai? Pasirink norvegišką žodį' };
    if (EMOJI_Q[l]) I.qtr = Object.assign({}, I.qtr, { emoji: EMOJI_Q[l] });
  }
  const C = () => window.KomiksCore;
  // інші модулі копіюють I18N.*.modules (Object.assign) — тоді лічильник «застигає»; ставимо його знову, коли все завантажилось
  const liveCount = () => { for (const l of Object.keys(WX)) { const I = (window.I18N || {})[l]; if (!I || !I.modules) continue; const mod = WX[l].module; Object.defineProperty(I.modules, 'words', { enumerable: true, configurable: true, get: () => mod.map(x => String(x).replace('{n}', wordCount())) }); } };
  if (typeof setTimeout === 'function') (function wait(n) { if (window.KomiksCore || n > 200) { liveCount(); return; } setTimeout(() => wait(n + 1), 50); })(0);
  WX.ar = {
    nav: 'الكلمات', module: ['📝', 'الكلمات', 'أكثر من {n} كلمة حسب المواضيع مع الصوت'],
    title: '📝 الكلمات حسب المواضيع', intro: 'أهم الكلمات النرويجية: العائلة، الطعام، الملابس، الحيوانات، المدينة، المهن، المشاعر… اضغط على بطاقة لتسمع الكلمة. تُظهر الأسماء جنسها: en أو ei أو et.',
    themes: '🗂️ المواضيع', words_n: n => `${n} كلمة`, learn: '🙈 أخفِ الترجمة', show: '👀 أظهر الترجمة', play_all: '🔊 استمع إلى الكل', test: '🧩 اختبار الموضوع',
    all_test: '🧩 اختبار كل الكلمات', tip: 'نصيحة: أخفِ الترجمة وحاول تذكّر المعنى، ثم اضغط على البطاقة للتحقق.', back: '→ كل المواضيع', tests: '📝 الكلمات حسب المواضيع',
    step: x => `الكلمات: ${x}`, gender: 'en — مذكّر، ei — مؤنّث، et — محايد',
    say: 'قلها بصوت عالٍ', know: 'أعرفها', know_hint: 'علّم الكلمات التي تعرفها — يظهر العدد في حسابك.', known_n: (a, b) => `✅ أعرفها: ${a} من ${b}`, known_all: n => `✅ أعرفها: ${n}`, reset_known: '↩️ امسح العلامات في هذا الموضوع'
  };
  const wx = (k, ...a) => { const tbl = WX[C().ui] || WX.en || WX.uk; const v = k in tbl ? tbl[k] : (WX.en || WX.uk)[k]; return typeof v === 'function' ? v(...a) : v; };
  const themes = () => (window.WORDS || { themes: [] }).themes;
  const LEVELS = ['A1', 'A2', 'B1', 'B2'];
  const stars = key => (((C().store.get('progress', {}))[key]) || {}).stars || 0;
  const PACK_UI = ['de', 'pl', 'tr', 'lt'];
  // обкладинка теми: перша картинка з самої теми (якщо є), інакше емодзі теми
  const themePic = th => {
    const P = window.KomiksPics; if (!P || !P.photo) return null;
    const w = th.words.find(x => P.photo(x[0], x[1]));
    return w ? P.el(w[0], 46, w[1]) : null;
  };
  const tName = th => {
    const K = C(), ui = K.ui;
    if (ui === 'no') return th.no;
    if (th[ui]) return th[ui];
    if (PACK_UI.includes(ui) && K.both) { const tr = K.both(th.uk, th.en || th.uk); if (tr && tr[ui]) return tr[ui]; }
    return th.en || th.uk;
  };
  const label = id => { const th = themes().find(x => x.id === id); return th ? `${th.icon} ${th.no}` : id; };
  /* слова, позначені «знаю» (ключ «тема|слово») — рахуються в кабінеті */
  const knownList = () => C().store.get('wordsKnown', []);
  const keyOf = (themeId, no) => themeId + '|' + no;
  const isKnown = (themeId, no) => knownList().includes(keyOf(themeId, no));
  function toggleKnown(themeId, no) {
    const K = C(), key = keyOf(themeId, no), list = knownList();
    const next = list.includes(key) ? list.filter(x => x !== key) : [...list, key];
    K.store.set('wordsKnown', next);
    // зняли «знаю» — слово повертається і в картки (там «знаю» спільне з цією сторінкою)
    if (!next.includes(key) && K.cards) {
      const st = K.cards.get(), nk = String(no).toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
      if (st[nk] && st[nk].known) { delete st[nk].known; st[nk].box = 1; st[nk].due = Date.now(); K.cards.set(st); }
    }
    return next.includes(key);
  }
  const knownCount = themeId => { const list = knownList(); return themeId ? list.filter(x => x.startsWith(themeId + '|')).length : list.length; };

  /* ---------------- завдання ---------------- */
  function questions(filter, n) {
    const K = C();
    const nOpt = K.settings.level === 'kids' ? 3 : 4;
    let list = themes();
    if (filter && filter.startsWith('level:')) { const max = LEVELS.indexOf(filter.slice(6)); list = list.filter(th => LEVELS.indexOf(th.level) <= max); }
    else if (filter) list = list.filter(th => th.id === filter);
    const all = list.flatMap(th => th.words.map(w => [th, w]));
    // малюнок є лише в тих слів, які ми вже намалювали: тести з картинками беруть тільки їх
    const drawn = (w, uk) => !!(window.KomiksPics && window.KomiksPics.has(w, uk));
    const picSet = th => K.uniq(th.words.filter(w => drawn(w[0], w[1])).map(w => w[0]));
    const other = th => { const rest = themes().filter(x => x.id !== th.id && x.level === th.level); return rest.length ? K.pick(rest) : null; };
    return K.shuffle(all).slice(0, n).map(([th, w], i) => {
      // варіанти з тієї ж теми, без слів з однаковим емодзі чи значенням
      const pool = K.uniq(th.words.filter(x => x[0] !== w[0] && x[3] !== w[3] && x[1] !== w[1]).map(x => x[0]));
      const options = K.shuffle([w[0], ...K.sample(pool, nOpt - 1)]);
      const step = i % 5;
      if (step === 2 && drawn(w[0], w[1])) {                    // 🔗 з'єднай слово з малюнком
        const four = K.sample(picSet(th).filter(x => x !== w[0]), 3).concat(w[0]);
        if (four.length === 4) return { type: 'match', theme: th.id, pairs: K.shuffle(four), answer: w[0] };
      }
      if (step === 3) {                                  // 🧠 яке слово зайве
        const o = other(th);
        const three = K.sample(pool, 3);
        if (o && three.length === 3) {
          const odd = K.pick(o.words)[0];
          return { type: 'odd', theme: th.id, answer: odd, options: K.shuffle(three.concat(odd)) };
        }
      }
      if (step === 4 && drawn(w[0], w[1])) {                    // 🖼️ послухай і вибери малюнок
        const pics = K.sample(picSet(th).filter(x => x !== w[0]), nOpt - 1);
        if (pics.length === nOpt - 1) return { type: 'pickpic', theme: th.id, item: { no: w[0], uk: w[1], en: w[2] }, answer: w[0], options: K.shuffle([w[0], ...pics]) };
      }
      // «Що це?» показує малюнок, тож без намальованої іконки це завдання не має сенсу
      return step === 0 && drawn(w[0], w[1])
        ? { type: 'emoji', theme: th.id, item: { no: w[0], uk: w[1], en: w[2], emoji: w[3] }, answer: w[0], options }
        : { type: 'listen', theme: th.id, item: { no: w[0], uk: w[1], en: w[2] }, answer: w[0], options };
    });
  }
  const quizSize = () => (C().settings.level === 'kids' ? 10 : 14);
  const quiz = id => questions(id || null, quizSize());

  /* ---------------- сторінка ---------------- */
  let hideTr = false;
  function render(id) {
    const K = C(), { h } = K;
    const ui = K.ui;
    const th = id ? themes().find(x => x.id === id) : null;
    const say = text => K.claim().then(() => K.Speech.speak(text, 'narrator', { rate: 0.9 }));
    if (!th) {
      const total = themes().reduce((a, x) => a + x.words.length, 0);
      return h('section', { class: 'words-page' }, K.pageHead(wx('title')),
        h('p', { class: 'lead-p' }, wx('intro')),
        window.KomiksSearch ? window.KomiksSearch.wordsBox() : null,
        window.KomiksGame && window.KomiksGame.wordRoomBox ? window.KomiksGame.wordRoomBox() : null,
        h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/quiz/words' }, wx('all_test')), h('span', { class: 'hint' }, wx('words_n', total)), h('span', { class: 'known-chip' }, wx('known_all', knownCount())), K.stars(stars('words'))),
        h('p', { class: 'hint' }, '✅ ' + wx('know_hint')),
        h('p', { class: 'hint' }, '💡 ' + wx('gender')),
        ...LEVELS.flatMap(l => { const list = themes().filter(x => x.level === l); return list.length ? [h('h3', { class: 'sec-sub' }, l),
          h('div', { class: 'theme-grid' }, list.map(x => K.withTr(h('a', { class: 'theme-tile', href: '#/words/' + x.id }, h('span', { class: 'tt-ico' }, themePic(x) || x.icon), h('b', {}, x.no), ui !== 'no' ? h('small', {}, x[ui] || x.en || x.uk) : null, h('span', { class: 'tt-meta' }, wx('words_n', x.words.length), ' · ', wx('known_n', knownCount(x.id), x.words.length), ' ', K.stars(stars('words:' + x.id)))), K.both(x.uk, x.en))))] : []; }));
    }
    const grid = h('div', { class: 'word-grid' + (hideTr ? ' hide-tr' : '') });
    const counter = h('span', { class: 'known-chip' }, wx('known_n', knownCount(th.id), th.words.length));
    const refreshCounter = () => { counter.textContent = wx('known_n', knownCount(th.id), th.words.length); };
    grid.append(...th.words.map(([no, uk, en, emoji]) => {
      const mark = h('button', { class: 'wc-know', type: 'button', title: wx('know'), 'aria-label': wx('know'), 'aria-pressed': String(isKnown(th.id, no)) }, '✓');
      // 🎙️ сказати слово вголос і почути оцінку вимови (де браузер це вміє)
      const recOut = h('div', { class: 'wc-rec' });
      const sayBtn = K.canRecord && K.canRecord()
        ? h('button', { class: 'wc-say', type: 'button', title: wx('say'), 'aria-label': wx('say'), onclick: e => { e.stopPropagation(); K.practice(no, recOut, e.currentTarget); } }, '🎙️')
        : null;
      const card = h('div', { class: 'word-card' + (isKnown(th.id, no) ? ' known' : '') },
        h('button', { class: 'wc-main', type: 'button', onclick: () => { say(no); card.classList.add('peek'); } },
          h('span', { class: 'wc-emoji' }, window.KomiksPics && window.KomiksPics.has(no, uk) ? window.KomiksPics.el(no, 46, uk) : emoji), h('b', { class: 'wc-no' }, no), h('span', { class: 'wc-tr' }, ui === 'en' ? en : ui === 'no' ? `${uk} · ${en}` : uk)),
        mark, sayBtn, recOut);
      mark.addEventListener('click', e => {
        e.stopPropagation();
        const on = toggleKnown(th.id, no);
        card.classList.toggle('known', on);
        mark.setAttribute('aria-pressed', String(on));
        K.Sfx.tick();
        refreshCounter();
      });
      return K.withTr(card, K.both(uk, en));
    }));
    const toggle = h('button', { class: 'btn', type: 'button', onclick: () => { hideTr = !hideTr; grid.classList.toggle('hide-tr', hideTr); K.$$('.word-card', grid).forEach(c => c.classList.remove('peek')); toggle.textContent = hideTr ? wx('show') : wx('learn'); } }, hideTr ? wx('show') : wx('learn'));
    const playAll = async () => { await K.claim(); for (const [no] of th.words) { await K.Speech.speak(no, 'narrator', { rate: 0.9 }); await K.sleep(200); } };
    return h('section', { class: 'words-page' }, K.pageHead(`${th.icon} ${th.no}` + (ui !== 'no' ? ` — ${tName(th)}` : ''), '#/words'),
      window.KomiksGame && window.KomiksGame.wordRoomBox ? window.KomiksGame.wordRoomBox({ current: th.id }) : null,
      h('div', { class: 'gram-chips' }, themes().map(x => h('a', { class: 'chip' + (x.id === th.id ? ' on' : ''), href: '#/words/' + x.id }, x.icon + ' ' + (ui === 'no' ? x.no : x[ui] || x.en || x.uk)))),
      h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/quiz/words/' + th.id }, wx('test')), h('a', { class: 'btn yellow', href: '#/game/src:word:' + th.id, title: wx('room_hint') }, wx('room')), toggle, h('button', { class: 'btn', type: 'button', onclick: playAll }, wx('play_all')), counter, h('span', { class: 'lvl lvl-' + th.level }, th.level), K.stars(stars('words:' + th.id))),
      h('p', { class: 'hint' }, wx('tip')),
      grid);
  }

  window.KomiksWords = { liveCount, themes, label, questions, quiz, render, text: wx, name: tName, stars, knownCount, isKnown, toggleKnown };
})();
