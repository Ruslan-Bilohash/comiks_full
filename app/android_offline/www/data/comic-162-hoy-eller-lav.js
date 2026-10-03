window.COMICS = window.COMICS || [];

/* p162 — A1: який він? Високий і низький, тонкий і товстий, довгий і короткий,
   великий і малий, старий і новий, швидкий і повільний, важкий і легкий. */
COMICS.push({
  id: 'p162',
  level: 'A1',
  category: 'hverdag',
  title: 'Høy eller lav?',
  titleUk: 'Високий чи низький?',
  titleEn: 'Tall or short?',
  summaryUk: 'Мія і Лео міряються зростом, порівнюють шарфи, рюкзаки й собак — і вчаться описувати все навколо: високий і низький, довгий і короткий, великий і малий, важкий і легкий.',
  summaryEn: 'Mia and Leo measure each other, compare scarves, backpacks and dogs — and learn to describe everything around them: tall and short, long and short, big and small, heavy and light.',
  summaryNo: 'Mia og Leo måler seg mot hverandre, sammenligner skjerf, sekker og hunder – og lærer å beskrive alt rundt seg: høy og lav, lang og kort, stor og liten, tung og lett.',
  cover: 0,

  panels: [
    { art: { bg: 'home', chars: [{ id: 'leo', x: 130, mood: 'grin', pose: 'point' }, { id: 'mia', x: 300, mood: 'surprised' }] }, lines: [
      { who: 'leo', no: 'Se! Jeg er høy. Du er lav.', uk: 'Дивись! Я високий. Ти низька.', en: 'Look! I am tall. You are short.' },
      { who: 'mia', no: 'Nei, jeg er ikke lav. Jeg er bare litt lavere enn deg.', uk: 'Ні, я не низька. Я лише трохи нижча за тебе.', en: 'No, I am not short. I am just a bit shorter than you.' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'mamma', x: 110, mood: 'happy' }, { id: 'mia', x: 300, mood: 'happy' }], props: [{ type: 'book', x: 210, y: 195 }] }, lines: [
      { who: 'mamma', no: 'Hvem er høyest i familien?', uk: 'Хто найвищий у сім’ї?', en: 'Who is the tallest in the family?' },
      { who: 'mia', no: 'Pappa er høyest, og Leo er høyere enn meg.', uk: 'Тато найвищий, а Лео вищий за мене.', en: 'Dad is the tallest, and Leo is taller than me.' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'leo', x: 130, mood: 'normal' }, { id: 'mia', x: 300, mood: 'grin', pose: 'point' }], props: [{ type: 'backpack', x: 215, y: 200 }] }, lines: [
      { who: 'mia', no: 'Sekken din er tung. Min er lett.', uk: 'Твій рюкзак важкий. Мій легкий.', en: 'Your backpack is heavy. Mine is light.' },
      { who: 'leo', no: 'Den er tung fordi den er full av bøker.', uk: 'Він важкий, бо повний книжок.', en: 'It is heavy because it is full of books.' }
    ]},
    { art: { bg: 'winter', chars: [{ id: 'mia', x: 120, mood: 'happy' }, { id: 'nora', x: 310, mood: 'happy' }] }, lines: [
      { who: 'nora', no: 'Skjerfet mitt er langt. Ditt er kort.', uk: 'Мій шарф довгий. Твій короткий.', en: 'My scarf is long. Yours is short.' },
      { who: 'mia', no: 'Ja, men mitt er tykt og varmt. Ditt er tynt.', uk: 'Так, але мій товстий і теплий. Твій тонкий.', en: 'Yes, but mine is thick and warm. Yours is thin.' }
    ]},
    { art: { bg: 'park', chars: [{ id: 'leo', x: 130, mood: 'surprised' }, { id: 'nora', x: 310, mood: 'normal' }], props: [{ type: 'ball', x: 215, y: 205 }] }, lines: [
      { who: 'leo', no: 'Den hunden er stor, og den er liten.', uk: 'Той собака великий, а цей малий.', en: 'That dog is big, and that one is small.' },
      { who: 'nora', no: 'Den lille er rask. Den store er langsom.', uk: 'Малий швидкий. Великий повільний.', en: 'The small one is fast. The big one is slow.' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'mia', x: 300, mood: 'grin', pose: 'cheer' }, { id: 'leo', x: 130, mood: 'happy', pose: 'cheer' }], fx: 'stars' }, lines: [
      { who: 'mia', no: 'Sykkelen min er gammel, men den er god.', uk: 'Мій велосипед старий, але хороший.', en: 'My bike is old, but it is good.' },
      { who: 'leo', no: 'Min er ny og rask. Vi er like glade!', uk: 'Мій новий і швидкий. Ми однаково раді!', en: 'Mine is new and fast. We are equally happy!' }
    ]}
  ],

  vocab: [
    ['høy', 'високий', 'tall, high'],
    ['lav', 'низький', 'short, low'],
    ['tynn', 'тонкий', 'thin'],
    ['tykk', 'товстий', 'thick, fat'],
    ['stor', 'великий', 'big'],
    ['liten', 'малий', 'small'],
    ['lang', 'довгий', 'long'],
    ['kort', 'короткий', 'short'],
    ['tung', 'важкий', 'heavy'],
    ['lett', 'легкий', 'light, easy'],
    ['rask', 'швидкий', 'fast'],
    ['langsom', 'повільний', 'slow'],
    ['gammel', 'старий', 'old'],
    ['ny', 'новий', 'new'],
    ['høyere', 'вищий', 'taller'],
    ['høyest', 'найвищий', 'tallest']
  ],

  words: {
    no: { 'høy': 'високий', 'lav': 'низька', 'lavere': 'нижча', 'enn': 'за, ніж', 'deg': 'тебе', 'hvem': 'хто', 'høyest': 'найвищий', 'familien': 'сім’я', 'pappa': 'тато', 'høyere': 'вищий', 'meg': 'мене', 'sekken': 'рюкзак', 'din': 'твій', 'tung': 'важкий', 'min': 'мій', 'lett': 'легкий', 'fordi': 'бо', 'full': 'повний', 'bøker': 'книжки', 'skjerfet': 'шарф', 'mitt': 'мій', 'langt': 'довгий', 'ditt': 'твій', 'kort': 'короткий', 'tykt': 'товстий', 'varmt': 'теплий', 'tynt': 'тонкий', 'hunden': 'собака', 'stor': 'великий', 'liten': 'малий', 'lille': 'малий (той, що малий)', 'rask': 'швидкий', 'store': 'великий (той, що великий)', 'langsom': 'повільний', 'sykkelen': 'велосипед', 'gammel': 'старий', 'god': 'хороший', 'ny': 'новий', 'like': 'однаково', 'glade': 'раді' },
    en: { 'høy': 'tall', 'lav': 'short', 'lavere': 'shorter', 'enn': 'than', 'deg': 'you', 'hvem': 'who', 'høyest': 'tallest', 'familien': 'the family', 'pappa': 'dad', 'høyere': 'taller', 'meg': 'me', 'sekken': 'the backpack', 'din': 'your', 'tung': 'heavy', 'min': 'mine', 'lett': 'light', 'fordi': 'because', 'full': 'full', 'bøker': 'books', 'skjerfet': 'the scarf', 'mitt': 'mine', 'langt': 'long', 'ditt': 'yours', 'kort': 'short', 'tykt': 'thick', 'varmt': 'warm', 'tynt': 'thin', 'hunden': 'the dog', 'stor': 'big', 'liten': 'small', 'lille': 'the little one', 'rask': 'fast', 'store': 'the big one', 'langsom': 'slow', 'sykkelen': 'the bike', 'gammel': 'old', 'god': 'good', 'ny': 'new', 'like': 'equally', 'glade': 'happy' }
  }
});
