window.COMICS = window.COMICS || [];

/* p157 — A2: в оптика. Перевірити зір, вибрати оправу, ціна й коли будуть готові окуляри. */
COMICS.push({
  id: 'p157',
  level: 'A2',
  category: 'helse',
  title: 'Hos optikeren',
  titleUk: 'В оптика',
  titleEn: 'At the optician',
  summaryUk: 'Руслан погано бачить дорожні знаки. Він іде до оптика, перевіряє зір, вибирає оправу й дізнається, коли окуляри будуть готові.',
  summaryEn: 'Ruslan cannot read the road signs clearly. He goes to an optician, has his eyes tested, picks a frame and learns when the glasses will be ready.',
  summaryNo: 'Ruslan ser dårlig på skiltene. Han går til optikeren, tar en synstest, velger innfatning og får vite når brillene er klare.',
  cover: 0,

  panels: [
    { art: { bg: 'shop', chars: [{ id: 'ruslan', x: 300, mood: 'sad' }, { id: 'kasserer', x: 100, mood: 'happy', pose: 'wave' }], props: [{ type: 'counter', x: 100 }, { type: 'glass', x: 160, y: 190 }] }, lines: [
      { who: 'ruslan', no: 'Hei. Jeg ser dårlig på skiltene når jeg kjører.', uk: 'Вітаю. Я погано бачу знаки, коли їду за кермом.', en: 'Hello. I see the road signs badly when I drive.' },
      { who: 'kasserer', no: 'Da tar vi en synstest. Sett deg her.', uk: 'Тоді зробимо перевірку зору. Сідайте сюди.', en: 'Then we will do an eye test. Please sit down here.' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'kasserer', x: 100, mood: 'normal', pose: 'point' }, { id: 'ruslan', x: 300, mood: 'normal' }], props: [{ type: 'docs', x: 210, y: 190 }] }, lines: [
      { who: 'kasserer', no: 'Les den nederste linja, takk.', uk: 'Прочитайте нижній рядок, будь ласка.', en: 'Read the bottom line, please.' },
      { who: 'ruslan', no: 'Jeg klarer bare den tredje linja.', uk: 'Я бачу лише третій рядок.', en: 'I can only manage the third line.' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'kasserer', x: 100, mood: 'normal' }, { id: 'ruslan', x: 300, mood: 'surprised' }], props: [{ type: 'glass', x: 200, y: 195 }] }, lines: [
      { who: 'kasserer', no: 'Du trenger briller til bilkjøring.', uk: 'Вам потрібні окуляри для водіння.', en: 'You need glasses for driving.' },
      { who: 'ruslan', no: 'Må jeg bruke dem hele tiden?', uk: 'Треба носити їх увесь час?', en: 'Do I have to wear them all the time?' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'kasserer', x: 100, mood: 'happy' }, { id: 'ruslan', x: 300, mood: 'normal' }], props: [{ type: 'glass', x: 150, y: 190 }, { type: 'counter', x: 100 }] }, lines: [
      { who: 'kasserer', no: 'Nei, bare når du kjører og leser skilt.', uk: 'Ні, лише коли за кермом і читаєте знаки.', en: 'No, only when you drive and read signs.' },
      { who: 'ruslan', no: 'Greit. Hvilken innfatning passer meg?', uk: 'Зрозуміло. Яка оправа мені пасує?', en: 'All right. Which frame suits me?' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'ruslan', x: 300, mood: 'happy' }, { id: 'kasserer', x: 100, mood: 'normal' }], props: [{ type: 'coins', x: 210, y: 200 }] }, lines: [
      { who: 'kasserer', no: 'Den svarte er enkel og billig — to tusen kroner.', uk: 'Чорна проста й недорога — дві тисячі крон.', en: 'The black one is simple and cheap — two thousand kroner.' },
      { who: 'ruslan', no: 'Dekker forsikringen min noe av det?', uk: 'Чи покриває це моя страховка?', en: 'Does my insurance cover any of it?' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'kasserer', x: 100, mood: 'happy', pose: 'point' }, { id: 'ruslan', x: 300, mood: 'grin', pose: 'cheer' }], fx: 'stars' }, lines: [
      { who: 'kasserer', no: 'Spør arbeidsgiveren din — mange dekker briller til skjermarbeid.', uk: 'Спитайте роботодавця — багато хто оплачує окуляри для роботи за екраном.', en: 'Ask your employer — many of them cover glasses for screen work.' },
      { who: 'ruslan', no: 'Bra tips! Når er brillene klare?', uk: 'Гарна порада! Коли окуляри будуть готові?', en: 'Good tip! When will the glasses be ready?' }
    ]}
  ],

  vocab: [
    ['en optiker', 'оптик', 'an optician'],
    ['ei synstest', 'перевірка зору', 'an eye test'],
    ['et skilt', 'знак', 'a sign'],
    ['ei linje', 'рядок, лінія', 'a line'],
    ['briller', 'окуляри', 'glasses'],
    ['ei bilkjøring', 'водіння', 'driving'],
    ['ei innfatning', 'оправа', 'a frame'],
    ['enkel', 'простий', 'simple'],
    ['billig', 'дешевий', 'cheap'],
    ['å dekke', 'покривати', 'to cover'],
    ['ei forsikring', 'страхування', 'insurance'],
    ['en arbeidsgiver', 'роботодавець', 'an employer'],
    ['et skjermarbeid', 'робота за екраном', 'screen work'],
    ['klar', 'готовий', 'ready']
  ],

  words: {
    no: { 'optikeren': 'оптик', 'dårlig': 'погано', 'skiltene': 'знаки', 'kjører': 'їду за кермом', 'synstest': 'перевірка зору', 'sett': 'сідайте', 'les': 'прочитайте', 'nederste': 'нижній', 'linja': 'рядок', 'klarer': 'можу, справляюся', 'tredje': 'третій', 'trenger': 'потребуєте', 'briller': 'окуляри', 'bilkjøring': 'водіння', 'bruke': 'носити, користуватися', 'hele': 'увесь', 'tiden': 'час', 'leser': 'читаєте', 'skilt': 'знаки', 'greit': 'добре, зрозуміло', 'innfatning': 'оправа', 'passer': 'пасує', 'svarte': 'чорна', 'enkel': 'проста', 'billig': 'недорога', 'tusen': 'тисяча', 'dekker': 'покриває', 'forsikringen': 'страховка', 'spør': 'спитайте', 'arbeidsgiveren': 'роботодавець', 'mange': 'багато', 'skjermarbeid': 'робота за екраном', 'tips': 'порада', 'brillene': 'окуляри', 'klare': 'готові' },
    en: { 'optikeren': 'the optician', 'dårlig': 'badly', 'skiltene': 'the signs', 'kjører': 'drive', 'synstest': 'eye test', 'sett': 'sit', 'les': 'read', 'nederste': 'bottom', 'linja': 'the line', 'klarer': 'manage', 'tredje': 'third', 'trenger': 'need', 'briller': 'glasses', 'bilkjøring': 'driving', 'bruke': 'to wear', 'hele': 'whole', 'tiden': 'the time', 'leser': 'read', 'skilt': 'signs', 'greit': 'all right', 'innfatning': 'frame', 'passer': 'suits', 'svarte': 'the black one', 'enkel': 'simple', 'billig': 'cheap', 'tusen': 'thousand', 'dekker': 'covers', 'forsikringen': 'the insurance', 'spør': 'ask', 'arbeidsgiveren': 'your employer', 'mange': 'many', 'skjermarbeid': 'screen work', 'tips': 'tip', 'brillene': 'the glasses', 'klare': 'ready' }
  }
});
