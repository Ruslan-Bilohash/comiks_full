window.COMICS = window.COMICS || [];

/* p166 — A2: на вокзалі. Поїзд запізнюється, пересадка під загрозою — саме та
   ситуація, у якій доводиться слухати оголошення й питати чужих людей.
   Тому тут багато слів про час, платформу й пересадку. */
COMICS.push({
  id: 'p166',
  level: 'A2',
  category: 'hverdag',
  title: 'På togstasjonen',
  titleUk: 'На вокзалі',
  titleEn: 'At the train station',
  summaryUk: 'Мусі треба на поїзд, а той запізнюється на двадцять хвилин. Карі допомагає знайти платформу, зрозуміти оголошення й устигнути на пересадку.',
  summaryEn: 'Musa needs to catch a train, but it is twenty minutes late. Kari helps him find the platform, understand the announcement and still make his connection.',
  summaryNo: 'Musa skal rekke et tog, men det er tjue minutter forsinket. Kari hjelper ham å finne spor, forstå beskjeden og likevel rekke overgangen.',
  cover: 0,

  panels: [
    { art: { bg: 'street', chars: [{ id: 'musa', x: 300, mood: 'normal', pose: 'hold' }, { id: 'kari', x: 110, mood: 'happy' }], props: [{ type: 'clock', x: 200, y: 70 }] }, lines: [
      { who: 'musa', no: 'Toget til Bergen går klokka ti. Hvilket spor?', uk: 'Поїзд до Бергена о десятій. Яка платформа?', en: 'The train to Bergen leaves at ten. Which platform?' },
      { who: 'kari', no: 'Det står på tavla. Spor tre, tror jeg.', uk: 'Це написано на табло. Платформа три, здається.', en: 'It is on the board. Platform three, I think.' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'kari', x: 120, mood: 'surprised', pose: 'point' }, { id: 'musa', x: 290, mood: 'sad' }], props: [] }, lines: [
      { who: 'kari', no: 'Vent — nå står det «forsinket, tjue minutter».', uk: 'Чекай — тепер написано «запізнення, двадцять хвилин».', en: 'Wait — now it says “delayed, twenty minutes”.' },
      { who: 'musa', no: 'Å nei. Jeg skal bytte tog i Hønefoss.', uk: 'О ні. Мені пересідати в Генефоссі.', en: 'Oh no. I have to change trains in Hønefoss.' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'musa', x: 300, mood: 'normal' }, { id: 'morten', x: 110, mood: 'normal', pose: 'wave' }], props: [] }, lines: [
      { who: 'musa', no: 'Unnskyld, rekker jeg overgangen i Hønefoss?', uk: 'Перепрошую, я встигну на пересадку в Генефоссі?', en: 'Excuse me, will I make the connection in Hønefoss?' },
      { who: 'morten', no: 'Ja, det neste toget venter på oss. Det er vanlig.', uk: 'Так, наступний поїзд нас чекає. Так зазвичай буває.', en: 'Yes, the next train waits for us. That is normal.' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'kari', x: 110, mood: 'happy', pose: 'point' }, { id: 'musa', x: 300, mood: 'happy' }], props: [{ type: 'phone', x: 210, y: 190 }] }, lines: [
      { who: 'kari', no: 'Appen sier det samme. Billetten gjelder hele veien.', uk: 'Застосунок каже те саме. Квиток дійсний на всю дорогу.', en: 'The app says the same. The ticket is valid the whole way.' },
      { who: 'musa', no: 'Bra. Da slipper jeg å kjøpe ny billett.', uk: 'Добре. Тоді не доведеться купувати новий квиток.', en: 'Good. Then I do not have to buy a new ticket.' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'musa', x: 290, mood: 'normal', pose: 'hold' }, { id: 'kari', x: 120, mood: 'normal' }], props: [{ type: 'backpack', x: 230, y: 195 }] }, lines: [
      { who: 'musa', no: 'Hvor er vogn fem? Jeg har plass tjueto.', uk: 'Де вагон п’ять? У мене місце двадцять два.', en: 'Where is carriage five? I have seat twenty-two.' },
      { who: 'kari', no: 'Midt på toget. Følg skiltene på perrongen.', uk: 'Посередині поїзда. Іди за табличками на пероні.', en: 'In the middle of the train. Follow the signs on the platform.' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'musa', x: 300, mood: 'grin', pose: 'wave' }, { id: 'kari', x: 110, mood: 'happy', pose: 'wave' }], props: [] }, lines: [
      { who: 'musa', no: 'Takk for hjelpen! Jeg ringer når jeg er framme.', uk: 'Дякую за допомогу! Подзвоню, коли доїду.', en: 'Thanks for the help! I will call when I arrive.' },
      { who: 'kari', no: 'God tur. Husk å sjekke tavla én gang til!', uk: 'Гарної дороги. Не забудь ще раз глянути на табло!', en: 'Have a good trip. Remember to check the board once more!' }
    ]}
  ],

  vocab: [
    ['et tog', 'поїзд', 'a train'],
    ['et spor', 'платформа, колія', 'a platform, a track'],
    ['en perrong', 'перон', 'a platform'],
    ['forsinket', 'із запізненням', 'delayed'],
    ['en overgang', 'пересадка', 'a connection'],
    ['å bytte tog', 'пересідати на інший поїзд', 'to change trains'],
    ['å rekke', 'встигнути', 'to make it in time'],
    ['en vogn', 'вагон', 'a carriage'],
    ['en plass', 'місце', 'a seat'],
    ['å gjelde', 'бути дійсним', 'to be valid'],
    ['ei tavle', 'табло', 'a board'],
    ['framme', 'на місці, прибув', 'arrived, there']
  ],

  words: {
    no: { 'vent': 'зачекай', 'hønefoss': 'Генефосс (місто)', 'følg': 'іди за', 'skiltene': 'таблички', 'toget': 'поїзд', 'tog': 'поїзд', 'spor': 'платформа', 'tavla': 'табло', 'forsinket': 'із запізненням', 'tjue': 'двадцять', 'minutter': 'хвилин', 'bytte': 'пересісти', 'overgangen': 'пересадка', 'rekker': 'встигаю', 'venter': 'чекає', 'vanlig': 'звично', 'appen': 'застосунок', 'billetten': 'квиток', 'gjelder': 'дійсний', 'veien': 'дорога', 'kjøpe': 'купити', 'vogn': 'вагон', 'plass': 'місце', 'midt': 'посередині', 'skiltene': 'таблички', 'perrongen': 'перон', 'hjelpen': 'допомога', 'ringer': 'подзвоню', 'framme': 'на місці', 'sjekke': 'перевірити' },
    en: { 'vent': 'wait', 'hønefoss': 'Hønefoss (a town)', 'følg': 'follow', 'skiltene': 'the signs', 'toget': 'the train', 'tog': 'train', 'spor': 'platform', 'tavla': 'the board', 'forsinket': 'delayed', 'tjue': 'twenty', 'minutter': 'minutes', 'bytte': 'to change', 'overgangen': 'the connection', 'rekker': 'make it', 'venter': 'waits', 'vanlig': 'normal', 'appen': 'the app', 'billetten': 'the ticket', 'gjelder': 'is valid', 'veien': 'the way', 'kjøpe': 'to buy', 'vogn': 'carriage', 'plass': 'seat', 'midt': 'in the middle', 'skiltene': 'the signs', 'perrongen': 'the platform', 'hjelpen': 'the help', 'ringer': 'will call', 'framme': 'there', 'sjekke': 'to check' }
  }
});
