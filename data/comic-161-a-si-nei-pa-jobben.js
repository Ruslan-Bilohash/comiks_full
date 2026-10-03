window.COMICS = window.COMICS || [];

/* p161 — B2: ввічливо сказати «ні» на роботі. Межі, пріоритети, зустрічна пропозиція. */
COMICS.push({
  id: 'p161',
  level: 'B2',
  category: 'jobb',
  title: 'Å si nei på en høflig måte',
  titleUk: 'Ввічливо сказати «ні»',
  titleEn: 'Saying no politely',
  summaryUk: 'Денису дають третє завдання поспіль. Він учиться відмовляти ввічливо: називає навантаження, пропонує вибір пріоритетів і зустрічну умову.',
  summaryEn: 'Denys is handed a third task in a row. He learns to decline politely: he names his workload, asks the manager to choose priorities and offers an alternative.',
  summaryNo: 'Denys får den tredje oppgaven på rad. Han lærer å si nei på en høflig måte: han sier hva han har på bordet, ber lederen prioritere og foreslår et alternativ.',
  cover: 0,

  panels: [
    { art: { bg: 'office', chars: [{ id: 'morten', x: 110, mood: 'happy', pose: 'point' }, { id: 'denys', x: 300, mood: 'surprised' }], props: [{ type: 'officedesk', x: 200 }, { type: 'docs', x: 210, y: 190 }] }, lines: [
      { who: 'morten', no: 'Kan du ta rapporten også? Den haster litt.', uk: 'Можеш узяти ще й звіт? Він трохи горить.', en: 'Could you take the report too? It is a bit urgent.' },
      { who: 'denys', no: 'Jeg vil gjerne hjelpe, men da må vi se på rekkefølgen.', uk: 'Я радо допоможу, але тоді треба глянути на черговість.', en: 'I would like to help, but then we need to look at the order of things.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'denys', x: 300, mood: 'normal', pose: 'point' }, { id: 'morten', x: 110, mood: 'normal' }], props: [{ type: 'computer', x: 200, y: 190 }] }, lines: [
      { who: 'denys', no: 'Nå har jeg budsjettet på fredag og kundemøtet i morgen.', uk: 'Зараз у мене бюджет на п’ятницю й зустріч із клієнтом завтра.', en: 'Right now I have the budget for Friday and the client meeting tomorrow.' },
      { who: 'morten', no: 'Stemmer, det glemte jeg.', uk: 'Точно, я про це забув.', en: 'True, I had forgotten that.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'denys', x: 300, mood: 'normal' }, { id: 'morten', x: 110, mood: 'normal' }] }, lines: [
      { who: 'denys', no: 'Hva er viktigst for deg av de tre?', uk: 'Що з цих трьох для тебе найважливіше?', en: 'Which of the three matters most to you?' },
      { who: 'morten', no: 'Kundemøtet, helt klart.', uk: 'Зустріч із клієнтом, однозначно.', en: 'The client meeting, definitely.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'denys', x: 300, mood: 'happy' }, { id: 'morten', x: 110, mood: 'happy' }], props: [{ type: 'docs', x: 200, y: 190 }] }, lines: [
      { who: 'denys', no: 'Da tar jeg rapporten på mandag, eller Kari kan begynne på den.', uk: 'Тоді звіт беру в понеділок — або Карі може почати його.', en: 'Then I will do the report on Monday, or Kari could start on it.' },
      { who: 'morten', no: 'God løsning. Jeg spør Kari.', uk: 'Гарне рішення. Спитаю Карі.', en: 'Good solution. I will ask Kari.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'denys', x: 300, mood: 'normal' }, { id: 'morten', x: 110, mood: 'normal' }] }, lines: [
      { who: 'denys', no: 'Takk for at du lytter. Jeg sier ikke nei til deg, men til overtid.', uk: 'Дякую, що вислухав. Я кажу «ні» не тобі, а понаднормовим.', en: 'Thanks for listening. I am not saying no to you, but to overtime.' },
      { who: 'morten', no: 'Helt rimelig. Vi vil ikke slite deg ut.', uk: 'Цілком розумно. Ми не хочемо тебе виснажити.', en: 'Completely fair. We do not want to wear you out.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'denys', x: 300, mood: 'grin', pose: 'cheer' }, { id: 'morten', x: 110, mood: 'happy', pose: 'wave' }], fx: 'stars' }, lines: [
      { who: 'morten', no: 'Si fra tidlig neste gang også — det gjør planleggingen enklere.', uk: 'Кажи наперед і наступного разу — так легше планувати.', en: 'Speak up early next time as well — it makes planning easier.' },
      { who: 'denys', no: 'Avtale. Et tydelig nei er bedre enn et halvt ja.', uk: 'Домовились. Чітке «ні» краще за половинчасте «так».', en: 'Deal. A clear no is better than half a yes.' }
    ]}
  ],

  vocab: [
    ['høflig', 'ввічливо', 'polite'],
    ['å haste', 'горіти, бути терміновим', 'to be urgent'],
    ['ei rekkefølge', 'черговість, порядок', 'the order'],
    ['et budsjett', 'бюджет', 'a budget'],
    ['et kundemøte', 'зустріч із клієнтом', 'a client meeting'],
    ['viktigst', 'найважливіше', 'most important'],
    ['å prioritere', 'визначати пріоритети', 'to prioritise'],
    ['ei løsning', 'рішення', 'a solution'],
    ['å lytte', 'слухати', 'to listen'],
    ['ei overtid', 'понаднормові', 'overtime'],
    ['rimelig', 'розумний, справедливий', 'fair, reasonable'],
    ['å slite ut', 'виснажувати', 'to wear out'],
    ['ei planlegging', 'планування', 'planning'],
    ['tydelig', 'чіткий', 'clear']
  ],

  words: {
    no: { 'høflig': 'ввічливо', 'måte': 'спосіб', 'rapporten': 'звіт', 'haster': 'горить, терміново', 'hjelpe': 'допомогти', 'rekkefølgen': 'черговість', 'budsjettet': 'бюджет', 'fredag': 'п’ятниця', 'kundemøtet': 'зустріч із клієнтом', 'stemmer': 'точно', 'glemte': 'забув', 'viktigst': 'найважливіше', 'tre': 'три', 'klart': 'однозначно', 'mandag': 'понеділок', 'begynne': 'почати', 'løsning': 'рішення', 'spør': 'спитаю', 'lytter': 'слухаєш', 'sier': 'кажу', 'overtid': 'понаднормові', 'rimelig': 'розумно', 'slite': 'виснажити', 'tidlig': 'рано, наперед', 'planleggingen': 'планування', 'enklere': 'легше', 'avtale': 'домовились', 'tydelig': 'чітке', 'bedre': 'краще', 'halvt': 'половинчасте' },
    en: { 'høflig': 'polite', 'måte': 'way', 'rapporten': 'the report', 'haster': 'is urgent', 'hjelpe': 'to help', 'rekkefølgen': 'the order', 'budsjettet': 'the budget', 'fredag': 'Friday', 'kundemøtet': 'the client meeting', 'stemmer': 'that is right', 'glemte': 'forgot', 'viktigst': 'most important', 'tre': 'three', 'klart': 'clearly', 'mandag': 'Monday', 'begynne': 'to start', 'løsning': 'solution', 'spør': 'will ask', 'lytter': 'listen', 'sier': 'say', 'overtid': 'overtime', 'rimelig': 'reasonable', 'slite': 'to wear out', 'tidlig': 'early', 'planleggingen': 'the planning', 'enklere': 'easier', 'avtale': 'deal', 'tydelig': 'clear', 'bedre': 'better', 'halvt': 'half a' }
  }
});
