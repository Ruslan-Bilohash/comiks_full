window.COMICS = window.COMICS || [];

/* p155 — A1: у кафе. Замовити каву й вафлю, спитати ціну, заплатити карткою, подякувати. */
COMICS.push({
  id: 'p155',
  level: 'A1',
  category: 'hverdag',
  title: 'På kafé',
  titleUk: 'У кафе',
  titleEn: 'At the café',
  summaryUk: 'Мія і Лео заходять у кафе. Вони замовляють каву, какао й вафлю, питають ціну та платять карткою.',
  summaryEn: 'Mia and Leo go into a café. They order coffee, cocoa and a waffle, ask about the price and pay by card.',
  summaryNo: 'Mia og Leo går inn på en kafé. De bestiller kaffe, kakao og vaffel, spør om prisen og betaler med kort.',
  cover: 0,

  panels: [
    { art: { bg: 'shop', chars: [{ id: 'mia', x: 300, mood: 'happy' }, { id: 'kasserer', x: 100, mood: 'happy', pose: 'wave' }], props: [{ type: 'counter', x: 100 }, { type: 'waffles', x: 150, y: 190 }] }, lines: [
      { who: 'kasserer', no: 'Hei! Hva kan jeg hjelpe med?', uk: 'Вітаю! Чим можу допомогти?', en: 'Hi! What can I help you with?' },
      { who: 'mia', no: 'Hei! Vi vil gjerne ha en kaffe og en kakao.', uk: 'Вітаю! Ми хочемо каву й какао.', en: 'Hi! We would like a coffee and a cocoa.' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'leo', x: 310, mood: 'grin', pose: 'point' }, { id: 'kasserer', x: 100, mood: 'normal' }], props: [{ type: 'waffles', x: 150, y: 190 }] }, lines: [
      { who: 'leo', no: 'Og en vaffel, takk. Med syltetøy!', uk: 'І вафлю, будь ласка. З варенням!', en: 'And a waffle, please. With jam!' },
      { who: 'kasserer', no: 'Vaffel med syltetøy og brunost. Noe mer?', uk: 'Вафля з варенням і брунустом. Ще щось?', en: 'A waffle with jam and brown cheese. Anything else?' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'mia', x: 300, mood: 'normal' }, { id: 'kasserer', x: 100, mood: 'normal' }], props: [{ type: 'counter', x: 100 }, { type: 'coins', x: 220, y: 200 }] }, lines: [
      { who: 'mia', no: 'Nei takk. Hva koster det til sammen?', uk: 'Ні, дякую. Скільки разом?', en: 'No thanks. How much is it altogether?' },
      { who: 'kasserer', no: 'Hundre og tjue kroner.', uk: 'Сто двадцять крон.', en: 'One hundred and twenty kroner.' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'mia', x: 300, mood: 'happy' }, { id: 'kasserer', x: 100, mood: 'happy' }], props: [{ type: 'phone', x: 220, y: 195 }] }, lines: [
      { who: 'mia', no: 'Kan jeg betale med kort?', uk: 'Можна заплатити карткою?', en: 'Can I pay by card?' },
      { who: 'kasserer', no: 'Ja, selvfølgelig. Hold kortet her.', uk: 'Так, звісно. Прикладіть картку тут.', en: 'Yes, of course. Hold the card here.' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'leo', x: 310, mood: 'grin' }, { id: 'mia', x: 180, mood: 'happy' }], props: [{ type: 'mug', x: 110, y: 190 }, { type: 'waffles', x: 250, y: 195 }] }, lines: [
      { who: 'leo', no: 'Skal vi sitte ved vinduet?', uk: 'Сядемо біля вікна?', en: 'Shall we sit by the window?' },
      { who: 'mia', no: 'Ja, der er det ledig bord.', uk: 'Так, там є вільний столик.', en: 'Yes, there is a free table there.' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'mia', x: 180, mood: 'grin', pose: 'cheer' }, { id: 'leo', x: 310, mood: 'happy', pose: 'cheer' }], fx: 'stars' }, lines: [
      { who: 'leo', no: 'Vaffelen er kjempegod. Takk for i dag!', uk: 'Вафля дуже смачна. Дякую за сьогодні!', en: 'The waffle is really good. Thanks for today!' },
      { who: 'mia', no: 'Bare hyggelig. Neste gang spanderer du!', uk: 'Нема за що. Наступного разу пригощаєш ти!', en: 'You are welcome. Next time you are paying!' }
    ]}
  ],

  vocab: [
    ['en kafé', 'кафе', 'a café'],
    ['en kaffe', 'кава', 'coffee'],
    ['en kakao', 'какао', 'cocoa'],
    ['en vaffel', 'вафля', 'a waffle'],
    ['et syltetøy', 'варення', 'jam'],
    ['en brunost', 'брунуст (коричневий сир)', 'brown cheese'],
    ['til sammen', 'разом', 'altogether'],
    ['å betale', 'платити', 'to pay'],
    ['et kort', 'картка', 'a card'],
    ['et bord', 'стіл, столик', 'a table'],
    ['ledig', 'вільний', 'free, available'],
    ['å spandere', 'пригощати', 'to treat, to pay for someone']
  ],

  words: {
    no: { 'kafé': 'кафе', 'hjelpe': 'допомогти', 'gjerne': 'охоче', 'kaffe': 'кава', 'kakao': 'какао', 'vaffel': 'вафля', 'syltetøy': 'варення', 'brunost': 'брунуст', 'koster': 'коштує', 'sammen': 'разом', 'hundre': 'сто', 'tjue': 'двадцять', 'kroner': 'крони', 'betale': 'заплатити', 'kort': 'картка', 'selvfølgelig': 'звісно', 'hold': 'тримайте, прикладіть', 'kortet': 'картку', 'sitte': 'сидіти', 'vinduet': 'вікно', 'ledig': 'вільний', 'bord': 'столик', 'vaffelen': 'вафля', 'kjempegod': 'дуже смачна', 'hyggelig': 'приємно', 'neste': 'наступний', 'gang': 'раз', 'spanderer': 'пригощаєш' },
    en: { 'kafé': 'café', 'hjelpe': 'help', 'gjerne': 'gladly', 'kaffe': 'coffee', 'kakao': 'cocoa', 'vaffel': 'waffle', 'syltetøy': 'jam', 'brunost': 'brown cheese', 'koster': 'costs', 'sammen': 'together', 'hundre': 'hundred', 'tjue': 'twenty', 'kroner': 'kroner', 'betale': 'to pay', 'kort': 'card', 'selvfølgelig': 'of course', 'hold': 'hold', 'kortet': 'the card', 'sitte': 'to sit', 'vinduet': 'the window', 'ledig': 'free', 'bord': 'table', 'vaffelen': 'the waffle', 'kjempegod': 'really good', 'hyggelig': 'nice', 'neste': 'next', 'gang': 'time', 'spanderer': 'are treating' }
  }
});
