window.COMICS = window.COMICS || [];

/* p158 — A2: купити вживане. Домовитися про зустріч, оглянути річ, поторгуватися, оплатити. */
COMICS.push({
  id: 'p158',
  level: 'A2',
  category: 'hverdag',
  title: 'Å kjøpe brukt',
  titleUk: 'Купити вживане',
  titleEn: 'Buying second-hand',
  summaryUk: 'Аліна знайшла вживаний велосипед в оголошенні. Вона домовляється про зустріч, оглядає його, торгується й платить через застосунок.',
  summaryEn: 'Alina has found a second-hand bike in an ad. She arranges a meeting, checks it over, haggles a little and pays through an app.',
  summaryNo: 'Alina har funnet en brukt sykkel i en annonse. Hun avtaler et møte, sjekker sykkelen, prutter litt og betaler med app.',
  cover: 1,

  panels: [
    { art: { bg: 'home', chars: [{ id: 'alina', x: 160, mood: 'happy' }], props: [{ type: 'computer', x: 260, y: 190 }, { type: 'phone', x: 110, y: 195 }] }, lines: [
      { who: 'alina', no: 'Se her — en brukt sykkel for åtte hundre kroner.', uk: 'Дивись — вживаний велосипед за вісімсот крон.', en: 'Look here — a used bike for eight hundred kroner.' },
      { who: 'narrator', no: 'Alina sender en melding til selgeren.', uk: 'Аліна пише повідомлення продавцю.', en: 'Alina sends a message to the seller.' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'alina', x: 300, mood: 'normal' }, { id: 'morten', x: 110, mood: 'happy', pose: 'wave' }], props: [{ type: 'bike', x: 200, y: 205 }] }, lines: [
      { who: 'morten', no: 'Hei! Her er sykkelen. Den er tre år gammel.', uk: 'Вітаю! Ось велосипед. Йому три роки.', en: 'Hi! Here is the bike. It is three years old.' },
      { who: 'alina', no: 'Kan jeg prøve den litt?', uk: 'Можна трохи проїхатися?', en: 'May I try it a little?' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'alina', x: 300, mood: 'surprised', pose: 'point' }, { id: 'morten', x: 110, mood: 'normal' }], props: [{ type: 'bike', x: 200, y: 205 }] }, lines: [
      { who: 'alina', no: 'Bremsen bak virker dårlig.', uk: 'Заднє гальмо працює погано.', en: 'The rear brake works badly.' },
      { who: 'morten', no: 'Det stemmer. Den må justeres.', uk: 'Так і є. Його треба відрегулювати.', en: 'That is right. It needs adjusting.' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'alina', x: 300, mood: 'normal' }, { id: 'morten', x: 110, mood: 'normal' }], props: [{ type: 'coins', x: 200, y: 200 }] }, lines: [
      { who: 'alina', no: 'Kan vi si seks hundre da?', uk: 'Тоді, може, шістсот?', en: 'Could we say six hundred then?' },
      { who: 'morten', no: 'Syv hundre, og du får lyset og låsen med.', uk: 'Сімсот, і ліхтар із замком на додачу.', en: 'Seven hundred, and you get the light and the lock with it.' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'alina', x: 300, mood: 'happy' }, { id: 'morten', x: 110, mood: 'happy' }], props: [{ type: 'phone', x: 200, y: 195 }] }, lines: [
      { who: 'alina', no: 'Avtale. Jeg betaler med appen nå.', uk: 'Домовились. Плачу через застосунок зараз.', en: 'Deal. I will pay with the app now.' },
      { who: 'morten', no: 'Fint. Si fra hvis noe er galt.', uk: 'Добре. Скажіть, якщо щось не так.', en: 'Good. Let me know if anything is wrong.' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'alina', x: 250, mood: 'grin', pose: 'cheer' }, { id: 'morten', x: 110, mood: 'happy', pose: 'wave' }], props: [{ type: 'bike', x: 120, y: 205 }], fx: 'stars' }, lines: [
      { who: 'alina', no: 'Takk! Nå sykler jeg til jobben hver dag.', uk: 'Дякую! Тепер їздитиму на роботу щодня.', en: 'Thanks! Now I will cycle to work every day.' },
      { who: 'morten', no: 'Lykke til! Husk hjelm.', uk: 'Успіхів! Не забудь шолом.', en: 'Good luck! Remember your helmet.' }
    ]}
  ],

  vocab: [
    ['brukt', 'вживаний', 'used, second-hand'],
    ['ei annonse', 'оголошення', 'an ad'],
    ['en selger', 'продавець', 'a seller'],
    ['å avtale', 'домовитися', 'to arrange'],
    ['å prøve', 'спробувати', 'to try'],
    ['ei bremse', 'гальмо', 'a brake'],
    ['å justere', 'регулювати', 'to adjust'],
    ['å prute', 'торгуватися', 'to haggle'],
    ['ei lås', 'замок', 'a lock'],
    ['et lys', 'ліхтар, світло', 'a light'],
    ['ei avtale', 'домовленість', 'a deal'],
    ['en hjelm', 'шолом', 'a helmet']
  ],

  words: {
    no: { 'brukt': 'вживаний', 'sykkel': 'велосипед', 'åtte': 'вісім', 'hundre': 'сто', 'kroner': 'крони', 'sender': 'надсилає', 'melding': 'повідомлення', 'selgeren': 'продавець', 'sykkelen': 'велосипед', 'gammel': 'старий', 'prøve': 'спробувати', 'bremsen': 'гальмо', 'bak': 'ззаду', 'virker': 'працює', 'dårlig': 'погано', 'stemmer': 'правда, так і є', 'justeres': 'відрегулювати', 'seks': 'шість', 'syv': 'сім', 'lyset': 'ліхтар', 'låsen': 'замок', 'avtale': 'домовились', 'betaler': 'плачу', 'appen': 'застосунок', 'fint': 'добре', 'galt': 'не так', 'sykler': 'їжджу на велосипеді', 'jobben': 'робота', 'hver': 'кожен', 'lykke': 'щастя, успіх', 'husk': 'пам’ятай', 'hjelm': 'шолом', 'annonse': 'оголошення' },
    en: { 'brukt': 'used', 'sykkel': 'bike', 'åtte': 'eight', 'hundre': 'hundred', 'kroner': 'kroner', 'sender': 'sends', 'melding': 'message', 'selgeren': 'the seller', 'sykkelen': 'the bike', 'gammel': 'old', 'prøve': 'to try', 'bremsen': 'the brake', 'bak': 'at the back', 'virker': 'works', 'dårlig': 'badly', 'stemmer': 'that is right', 'justeres': 'be adjusted', 'seks': 'six', 'syv': 'seven', 'lyset': 'the light', 'låsen': 'the lock', 'avtale': 'deal', 'betaler': 'pay', 'appen': 'the app', 'fint': 'fine', 'galt': 'wrong', 'sykler': 'cycle', 'jobben': 'work', 'hver': 'every', 'lykke': 'luck', 'husk': 'remember', 'hjelm': 'helmet', 'annonse': 'ad' }
  }
});
