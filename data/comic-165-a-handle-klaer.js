window.COMICS = window.COMICS || [];

/* p165 — A1: купити одяг. Найкоротший шлях до перших потрібних слів у магазині:
   розмір, приміряти, задорого, обміняти. Усе, що каже продавець, звучить так само,
   як у справжньому магазині, тому репліки навмисно короткі. */
COMICS.push({
  id: 'p165',
  level: 'A1',
  category: 'hverdag',
  title: 'Å handle klær',
  titleUk: 'Купити одяг',
  titleEn: 'Buying clothes',
  summaryUk: 'Нора з мамою купують куртку. Вони питають розмір, міряють, дивляться ціну й дізнаються, що можна обміняти протягом тижня.',
  summaryEn: 'Nora and her mum are buying a jacket. They ask about the size, try it on, look at the price and learn that it can be exchanged within a week.',
  summaryNo: 'Nora og mamma kjøper en jakke. De spør om størrelse, prøver den, ser på prisen og får vite at den kan byttes innen en uke.',
  cover: 0,

  panels: [
    { art: { bg: 'shop', chars: [{ id: 'nora', x: 300, mood: 'happy', pose: 'point' }, { id: 'mamma', x: 110, mood: 'normal' }], props: [{ type: 'counter', x: 100 }] }, lines: [
      { who: 'nora', no: 'Mamma, se på den blå jakka!', uk: 'Мамо, подивися на ту синю куртку!', en: 'Mum, look at that blue jacket!' },
      { who: 'mamma', no: 'Den er fin. Vi spør om størrelsen.', uk: 'Вона гарна. Запитаймо про розмір.', en: 'It is nice. Let us ask about the size.' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'kasserer', x: 100, mood: 'happy', pose: 'wave' }, { id: 'mamma', x: 300, mood: 'normal' }], props: [{ type: 'counter', x: 100 }] }, lines: [
      { who: 'mamma', no: 'Unnskyld, har dere denne jakka i størrelse ti?', uk: 'Перепрошую, у вас є ця куртка десятого розміру?', en: 'Excuse me, do you have this jacket in size ten?' },
      { who: 'kasserer', no: 'Ja, vi har både ti og tolv. Vil hun prøve?', uk: 'Так, є і десятий, і дванадцятий. Вона хоче приміряти?', en: 'Yes, we have both ten and twelve. Does she want to try it on?' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'nora', x: 300, mood: 'grin', pose: 'cheer' }, { id: 'kasserer', x: 100, mood: 'happy', pose: 'point' }], props: [{ type: 'counter', x: 100 }] }, lines: [
      { who: 'nora', no: 'Ja! Hvor er prøverommet?', uk: 'Так! Де примірочна?', en: 'Yes! Where is the fitting room?' },
      { who: 'kasserer', no: 'Rett bak deg, til venstre.', uk: 'Прямо за тобою, ліворуч.', en: 'Right behind you, on the left.' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'nora', x: 300, mood: 'happy', pose: 'hips' }, { id: 'mamma', x: 110, mood: 'surprised' }], props: [] }, lines: [
      { who: 'nora', no: 'Den passer! Den er ikke for stor.', uk: 'Вона підходить! Не завелика.', en: 'It fits! It is not too big.' },
      { who: 'mamma', no: 'Veldig bra. Hva koster den?', uk: 'Дуже добре. Скільки вона коштує?', en: 'Very good. How much does it cost?' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'kasserer', x: 100, mood: 'normal' }, { id: 'mamma', x: 300, mood: 'normal' }], props: [{ type: 'counter', x: 100 }, { type: 'coins', x: 220, y: 200 }] }, lines: [
      { who: 'kasserer', no: 'Fire hundre kroner. Den er på salg.', uk: 'Чотириста крон. Вона на розпродажі.', en: 'Four hundred kroner. It is on sale.' },
      { who: 'mamma', no: 'Det er greit. Kan vi bytte den hvis noe er galt?', uk: 'Це нормально. Чи можна обміняти, якщо щось не так?', en: 'That is fine. Can we exchange it if something is wrong?' }
    ]},
    { art: { bg: 'shop', chars: [{ id: 'kasserer', x: 100, mood: 'happy' }, { id: 'nora', x: 300, mood: 'grin', pose: 'hold' }], props: [{ type: 'counter', x: 100 }] }, lines: [
      { who: 'kasserer', no: 'Ja, innen en uke. Ta vare på kvitteringen.', uk: 'Так, протягом тижня. Збережіть чек.', en: 'Yes, within a week. Keep the receipt.' },
      { who: 'nora', no: 'Takk! Nå har jeg en ny jakke.', uk: 'Дякую! Тепер у мене є нова куртка.', en: 'Thank you! Now I have a new jacket.' }
    ]}
  ],

  vocab: [
    ['en jakke', 'куртка', 'a jacket'],
    ['en størrelse', 'розмір', 'a size'],
    ['å prøve', 'приміряти, пробувати', 'to try on'],
    ['et prøverom', 'примірочна', 'a fitting room'],
    ['å passe', 'підходити (за розміром)', 'to fit'],
    ['for stor', 'завеликий', 'too big'],
    ['for liten', 'замалий', 'too small'],
    ['et salg', 'розпродаж', 'a sale'],
    ['å bytte', 'обміняти', 'to exchange'],
    ['en kvittering', 'чек', 'a receipt'],
    ['innen en uke', 'протягом тижня', 'within a week'],
    ['til venstre', 'ліворуч', 'on the left']
  ],

  words: {
    no: { 'jakka': 'куртка', 'jakke': 'куртка', 'blå': 'синій', 'størrelse': 'розмір', 'størrelsen': 'розмір', 'prøve': 'приміряти', 'prøverommet': 'примірочна', 'passer': 'підходить', 'stor': 'великий', 'liten': 'малий', 'koster': 'коштує', 'salg': 'розпродаж', 'bytte': 'обміняти', 'kvitteringen': 'чек', 'uke': 'тиждень', 'venstre': 'ліворуч', 'bak': 'позаду', 'hundre': 'сто', 'fire': 'чотири', 'greit': 'нормально', 'galt': 'не так', 'ny': 'новий' },
    en: { 'jakka': 'the jacket', 'jakke': 'jacket', 'blå': 'blue', 'størrelse': 'size', 'størrelsen': 'the size', 'prøve': 'to try on', 'prøverommet': 'the fitting room', 'passer': 'fits', 'stor': 'big', 'liten': 'small', 'koster': 'costs', 'salg': 'sale', 'bytte': 'to exchange', 'kvitteringen': 'the receipt', 'uke': 'week', 'venstre': 'left', 'bak': 'behind', 'hundre': 'hundred', 'fire': 'four', 'greit': 'fine', 'galt': 'wrong', 'ny': 'new' }
  }
});
