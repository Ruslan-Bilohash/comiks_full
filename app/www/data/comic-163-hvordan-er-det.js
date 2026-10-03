window.COMICS = window.COMICS || [];

/* p163 — A2: який він насправді? Старий і молодий, сильний і слабкий, чистий і брудний,
   дорогий і дешевий, гучний і тихий, повний і порожній, світлий і темний. */
COMICS.push({
  id: 'p163',
  level: 'A2',
  category: 'bolig',
  title: 'Hvordan er leiligheten?',
  titleUk: 'Яка ця квартира?',
  titleEn: 'What is the flat like?',
  summaryUk: 'Муса дивиться квартиру й описує все, що бачить: світла чи темна, чиста чи брудна, тиха чи гучна, дорога чи дешева. Заразом вчиться ввічливо казати, що саме йому не підходить.',
  summaryEn: 'Musa views a flat and describes everything he sees: light or dark, clean or dirty, quiet or noisy, expensive or cheap. Along the way he learns to say politely what does not suit him.',
  summaryNo: 'Musa er på visning og beskriver alt han ser: lys eller mørk, ren eller skitten, stille eller støyende, dyr eller billig. Samtidig lærer han å si høflig hva som ikke passer.',
  cover: 1,

  panels: [
    { art: { bg: 'home', chars: [{ id: 'kari', x: 110, mood: 'happy', pose: 'wave' }, { id: 'musa', x: 300, mood: 'normal' }], props: [{ type: 'keys', x: 210, y: 195 }] }, lines: [
      { who: 'kari', no: 'Velkommen! Leiligheten er lys og ren.', uk: 'Вітаю! Квартира світла й чиста.', en: 'Welcome! The flat is light and clean.' },
      { who: 'musa', no: 'Ja, men gangen er ganske mørk.', uk: 'Так, але коридор доволі темний.', en: 'Yes, but the hallway is rather dark.' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'musa', x: 300, mood: 'surprised', pose: 'point' }, { id: 'kari', x: 110, mood: 'normal' }], props: [{ type: 'sofa', x: 200, y: 200 }] }, lines: [
      { who: 'musa', no: 'Er det stille her om kvelden?', uk: 'Тут тихо ввечері?', en: 'Is it quiet here in the evening?' },
      { who: 'kari', no: 'Gata er litt støyende, men vinduene er nye og tette.', uk: 'Вулиця трохи гучна, але вікна нові й щільні.', en: 'The street is a bit noisy, but the windows are new and tight.' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'musa', x: 300, mood: 'normal' }, { id: 'kari', x: 110, mood: 'normal' }], props: [{ type: 'boxes', x: 205, y: 200 }] }, lines: [
      { who: 'musa', no: 'Boden er tom. Er den stor nok for sykler?', uk: 'Комора порожня. Чи достатньо вона велика для велосипедів?', en: 'The storage room is empty. Is it big enough for bikes?' },
      { who: 'kari', no: 'To sykler får plass. Tre blir for trangt.', uk: 'Два велосипеди влізуть. Три — вже затісно.', en: 'Two bikes fit. Three would be too tight.' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'kari', x: 110, mood: 'happy' }, { id: 'musa', x: 300, mood: 'sad' }], props: [{ type: 'coins', x: 205, y: 200 }] }, lines: [
      { who: 'kari', no: 'Husleia er tolv tusen i måneden.', uk: 'Оренда — дванадцять тисяч на місяць.', en: 'The rent is twelve thousand a month.' },
      { who: 'musa', no: 'Det er dyrt for meg. Finnes det noe billigere?', uk: 'Для мене це дорого. Є щось дешевше?', en: 'That is expensive for me. Is there anything cheaper?' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'kari', x: 110, mood: 'normal', pose: 'point' }, { id: 'musa', x: 300, mood: 'normal' }], props: [{ type: 'docs', x: 205, y: 195 }] }, lines: [
      { who: 'kari', no: 'Vi har en mindre leilighet i samme hus. Den er eldre.', uk: 'У нас є менша квартира в цьому ж будинку. Вона старіша.', en: 'We have a smaller flat in the same house. It is older.' },
      { who: 'musa', no: 'Gammel er greit hvis den er varm og tørr.', uk: 'Стара — нормально, якщо тепла й суха.', en: 'Old is fine if it is warm and dry.' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'musa', x: 300, mood: 'grin', pose: 'cheer' }, { id: 'kari', x: 110, mood: 'happy', pose: 'wave' }], fx: 'stars' }, lines: [
      { who: 'kari', no: 'Den er både varm og billigere. Vil du se den?', uk: 'Вона й тепла, і дешевша. Хочете подивитися?', en: 'It is both warm and cheaper. Would you like to see it?' },
      { who: 'musa', no: 'Gjerne! Liten og varm er bedre enn stor og kald.', uk: 'Залюбки! Мала й тепла краща за велику й холодну.', en: 'Gladly! Small and warm is better than big and cold.' }
    ]}
  ],

  vocab: [
    ['lys', 'світлий', 'light, bright'],
    ['mørk', 'темний', 'dark'],
    ['ren', 'чистий', 'clean'],
    ['skitten', 'брудний', 'dirty'],
    ['stille', 'тихий', 'quiet'],
    ['støyende', 'гучний', 'noisy'],
    ['tom', 'порожній', 'empty'],
    ['trang', 'тісний', 'tight, cramped'],
    ['dyr', 'дорогий', 'expensive'],
    ['billig', 'дешевий', 'cheap'],
    ['eldre', 'старіший', 'older'],
    ['mindre', 'менший', 'smaller'],
    ['tørr', 'сухий', 'dry'],
    ['ei husleie', 'орендна плата', 'the rent'],
    ['ei bod', 'комора', 'a storage room'],
    ['å få plass', 'уміщатися', 'to fit']
  ],

  words: {
    no: { 'velkommen': 'вітаю, ласкаво просимо', 'leiligheten': 'квартира', 'lys': 'світла', 'ren': 'чиста', 'gangen': 'коридор', 'ganske': 'доволі', 'mørk': 'темний', 'stille': 'тихо', 'kvelden': 'вечір', 'gata': 'вулиця', 'støyende': 'гучна', 'vinduene': 'вікна', 'nye': 'нові', 'tette': 'щільні', 'boden': 'комора', 'tom': 'порожня', 'nok': 'достатньо', 'sykler': 'велосипеди', 'plass': 'місце', 'trangt': 'тісно', 'husleia': 'оренда', 'tolv': 'дванадцять', 'tusen': 'тисяч', 'måneden': 'місяць', 'dyrt': 'дорого', 'finnes': 'чи є', 'billigere': 'дешевше', 'mindre': 'менша', 'samme': 'той самий', 'hus': 'будинок', 'eldre': 'старіша', 'greit': 'нормально', 'varm': 'тепла', 'tørr': 'суха', 'både': 'і…, і…', 'bedre': 'краще', 'kald': 'холодна', 'liten': 'мала' },
    en: { 'velkommen': 'welcome', 'leiligheten': 'the flat', 'lys': 'light', 'ren': 'clean', 'gangen': 'the hallway', 'ganske': 'rather', 'mørk': 'dark', 'stille': 'quiet', 'kvelden': 'the evening', 'gata': 'the street', 'støyende': 'noisy', 'vinduene': 'the windows', 'nye': 'new', 'tette': 'tight', 'boden': 'the storage room', 'tom': 'empty', 'nok': 'enough', 'sykler': 'bikes', 'plass': 'room, space', 'trangt': 'cramped', 'husleia': 'the rent', 'tolv': 'twelve', 'tusen': 'thousand', 'måneden': 'the month', 'dyrt': 'expensive', 'finnes': 'is there', 'billigere': 'cheaper', 'mindre': 'smaller', 'samme': 'the same', 'hus': 'house', 'eldre': 'older', 'greit': 'fine', 'varm': 'warm', 'tørr': 'dry', 'både': 'both', 'bedre': 'better', 'kald': 'cold', 'liten': 'small' }
  }
});
