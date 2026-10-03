window.COMICS = window.COMICS || [];

/* p156 — A1: у парку. Гратися з м’ячем, ділитися, погода й «додому, коли стемніє». */
COMICS.push({
  id: 'p156',
  level: 'A1',
  category: 'fritid',
  title: 'I parken',
  titleUk: 'У парку',
  titleEn: 'In the park',
  summaryUk: 'Лео й Нора гуляють у парку. Вони грають у м’яч, діляться, звикають до норвезької погоди й ідуть додому, коли темніє.',
  summaryEn: 'Leo and Nora are out in the park. They play ball, share, get used to the Norwegian weather and go home when it gets dark.',
  summaryNo: 'Leo og Nora er i parken. De spiller ball, deler, venner seg til det norske været og går hjem når det blir mørkt.',
  cover: 0,

  panels: [
    { art: { bg: 'park', chars: [{ id: 'leo', x: 120, mood: 'happy', pose: 'wave' }, { id: 'nora', x: 300, mood: 'happy' }], props: [{ type: 'ball', x: 210, y: 210 }] }, lines: [
      { who: 'leo', no: 'Hei, Nora! Vil du spille ball?', uk: 'Привіт, Норо! Хочеш пограти в м’яч?', en: 'Hi, Nora! Do you want to play ball?' },
      { who: 'nora', no: 'Ja, gjerne! Jeg står i mål.', uk: 'Так, залюбки! Я на воротах.', en: 'Yes, gladly! I will be in goal.' }
    ]},
    { art: { bg: 'park', chars: [{ id: 'nora', x: 300, mood: 'surprised' }, { id: 'leo', x: 120, mood: 'grin', pose: 'point' }], props: [{ type: 'ball', x: 250, y: 200 }] }, lines: [
      { who: 'leo', no: 'Se her! Jeg skyter!', uk: 'Дивись! Б’ю!', en: 'Look here! I am shooting!' },
      { who: 'nora', no: 'Oi! Den gikk rett over meg.', uk: 'Ой! Він пролетів просто над мною.', en: 'Oops! It went right over me.' }
    ]},
    { art: { bg: 'park', chars: [{ id: 'mia', x: 90, mood: 'sad' }, { id: 'nora', x: 300, mood: 'normal' }], props: [{ type: 'ball', x: 190, y: 205 }] }, lines: [
      { who: 'mia', no: 'Kan jeg være med? Jeg har ingen å leke med.', uk: 'Можна мені з вами? Мені немає з ким гратися.', en: 'Can I join? I have no one to play with.' },
      { who: 'nora', no: 'Klart du kan! Vi deler alltid.', uk: 'Звісно, можна! Ми завжди ділимося.', en: 'Of course you can! We always share.' }
    ]},
    { art: { bg: 'park', chars: [{ id: 'leo', x: 120, mood: 'normal' }, { id: 'mia', x: 300, mood: 'happy' }], props: [{ type: 'umbrella', x: 210, y: 190 }] }, lines: [
      { who: 'leo', no: 'Det begynner å regne litt.', uk: 'Починається невеликий дощ.', en: 'It is starting to rain a little.' },
      { who: 'mia', no: 'Det gjør ingenting. Vi har gode jakker.', uk: 'Нічого страшного. У нас гарні куртки.', en: 'That does not matter. We have good jackets.' }
    ]},
    { art: { bg: 'park', chars: [{ id: 'nora', x: 300, mood: 'happy' }, { id: 'leo', x: 120, mood: 'happy' }], props: [{ type: 'berries', x: 200, y: 205 }] }, lines: [
      { who: 'nora', no: 'Se, det vokser bær her!', uk: 'Дивіться, тут ростуть ягоди!', en: 'Look, there are berries growing here!' },
      { who: 'leo', no: 'Vi tar noen med hjem til mamma.', uk: 'Візьмемо трохи додому мамі.', en: 'We will take some home to Mum.' }
    ]},
    { art: { bg: 'park', chars: [{ id: 'mia', x: 300, mood: 'happy', pose: 'wave' }, { id: 'leo', x: 120, mood: 'grin', pose: 'wave' }], fx: 'stars' }, lines: [
      { who: 'leo', no: 'Det blir mørkt. Vi må gå hjem nå.', uk: 'Темніє. Треба йти додому.', en: 'It is getting dark. We have to go home now.' },
      { who: 'mia', no: 'Takk for i dag! Sees i morgen!', uk: 'Дякую за сьогодні! До завтра!', en: 'Thanks for today! See you tomorrow!' }
    ]}
  ],

  vocab: [
    ['en park', 'парк', 'a park'],
    ['en ball', 'м’яч', 'a ball'],
    ['et mål', 'ворота, гол', 'a goal'],
    ['å skyte', 'бити (по м’ячу)', 'to shoot'],
    ['å leke', 'гратися', 'to play'],
    ['å dele', 'ділитися', 'to share'],
    ['å regne', 'дощити', 'to rain'],
    ['ei jakke', 'куртка', 'a jacket'],
    ['et bær', 'ягода', 'a berry'],
    ['å vokse', 'рости', 'to grow'],
    ['mørkt', 'темно', 'dark'],
    ['i morgen', 'завтра', 'tomorrow']
  ],

  words: {
    no: { 'parken': 'парк', 'spille': 'грати', 'ball': 'м’яч', 'gjerne': 'залюбки', 'står': 'стою', 'mål': 'ворота', 'skyter': 'б’ю', 'gikk': 'пішов, полетів', 'rett': 'просто, прямо', 'over': 'над', 'være': 'бути', 'med': 'з, разом', 'ingen': 'нікого', 'leke': 'гратися', 'klart': 'звісно', 'deler': 'ділимося', 'alltid': 'завжди', 'begynner': 'починається', 'regne': 'дощити', 'litt': 'трохи', 'gjør': 'робить', 'ingenting': 'нічого', 'gode': 'гарні', 'jakker': 'куртки', 'vokser': 'ростуть', 'bær': 'ягоди', 'noen': 'трохи, кілька', 'hjem': 'додому', 'mørkt': 'темно', 'sees': 'побачимось', 'morgen': 'ранок, завтра' },
    en: { 'parken': 'the park', 'spille': 'to play', 'ball': 'ball', 'gjerne': 'gladly', 'står': 'stand', 'mål': 'goal', 'skyter': 'shoot', 'gikk': 'went', 'rett': 'right, straight', 'over': 'over', 'være': 'to be', 'med': 'with', 'ingen': 'no one', 'leke': 'to play', 'klart': 'of course', 'deler': 'share', 'alltid': 'always', 'begynner': 'is starting', 'regne': 'to rain', 'litt': 'a little', 'gjør': 'does', 'ingenting': 'nothing', 'gode': 'good', 'jakker': 'jackets', 'vokser': 'grow', 'bær': 'berries', 'noen': 'some', 'hjem': 'home', 'mørkt': 'dark', 'sees': 'see you', 'morgen': 'morning, tomorrow' }
  }
});
