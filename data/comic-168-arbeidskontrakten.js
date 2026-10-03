window.COMICS = window.COMICS || [];

/* p168 — B2: трудовий договір. Перед підписом варто розуміти чотири речі:
   випробувальний термін, години, відпусткові й що означає «fast» проти
   «midlertidig». Розмова побудована так, щоб ці слова прозвучали в контексті. */
COMICS.push({
  id: 'p168',
  level: 'B2',
  category: 'jobb',
  title: 'Arbeidskontrakten',
  titleUk: 'Трудовий договір',
  titleEn: 'The employment contract',
  summaryUk: 'Денис отримав договір і читає його з Марією. Вони розбирають випробувальний термін, постійну й тимчасову роботу, години, відпусткові й строк попередження про звільнення.',
  summaryEn: 'Denys has received a contract and goes through it with Maria. They look at the trial period, permanent versus temporary work, hours, holiday pay and the notice period.',
  summaryNo: 'Denys har fått en kontrakt og går gjennom den med Maria. De ser på prøvetid, fast og midlertidig stilling, arbeidstid, feriepenger og oppsigelsestid.',
  cover: 0,

  panels: [
    { art: { bg: 'office', chars: [{ id: 'denys', x: 300, mood: 'normal', pose: 'hold' }, { id: 'maria', x: 110, mood: 'happy' }], props: [{ type: 'docs', x: 210, y: 190 }] }, lines: [
      { who: 'denys', no: 'Jeg fikk kontrakten i dag. Kan du se på den med meg?', uk: 'Сьогодні я отримав договір. Можеш переглянути його зі мною?', en: 'I got the contract today. Can you look at it with me?' },
      { who: 'maria', no: 'Gjerne. Det første jeg ser etter, er om stillingen er fast.', uk: 'Залюбки. Перше, на що я дивлюся, — чи посада постійна.', en: 'Gladly. The first thing I look for is whether the position is permanent.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'denys', x: 300, mood: 'normal' }, { id: 'maria', x: 110, mood: 'normal', pose: 'point' }], props: [{ type: 'docs', x: 210, y: 190 }] }, lines: [
      { who: 'denys', no: 'Her står det «fast stilling, hundre prosent».', uk: 'Тут написано «постійна посада, сто відсотків».', en: 'Here it says “permanent position, one hundred per cent”.' },
      { who: 'maria', no: 'Bra. Da er du ikke midlertidig ansatt, og det er tryggere.', uk: 'Добре. Отже ти не тимчасовий працівник, а це надійніше.', en: 'Good. Then you are not a temporary employee, and that is safer.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'maria', x: 110, mood: 'normal' }, { id: 'denys', x: 300, mood: 'surprised' }], props: [] }, lines: [
      { who: 'maria', no: 'Prøvetiden er seks måneder. Da er oppsigelsestiden kortere.', uk: 'Випробувальний термін — шість місяців. Тоді строк попередження коротший.', en: 'The trial period is six months. During it the notice period is shorter.' },
      { who: 'denys', no: 'Hvor kort? Jeg vil vite hva jeg risikerer.', uk: 'Наскільки коротший? Хочу знати, чим ризикую.', en: 'How short? I want to know what I am risking.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'maria', x: 110, mood: 'normal', pose: 'hold' }, { id: 'denys', x: 300, mood: 'normal' }], props: [{ type: 'docs', x: 215, y: 192 }] }, lines: [
      { who: 'maria', no: 'Fjorten dager i prøvetiden, én måned etterpå. Det er vanlig.', uk: 'Чотирнадцять днів під час випробування, потім один місяць. Це звичайна практика.', en: 'Fourteen days during the trial period, one month after that. That is normal.' },
      { who: 'denys', no: 'Og arbeidstiden? Det står trettisju og en halv time.', uk: 'А робочий час? Тут тридцять сім з половиною годин.', en: 'And the working hours? It says thirty-seven and a half hours.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'maria', x: 110, mood: 'happy' }, { id: 'denys', x: 300, mood: 'normal' }], props: [{ type: 'computer', x: 210, y: 188 }] }, lines: [
      { who: 'maria', no: 'Normalt. Sjekk også overtid: den skal betales med tillegg.', uk: 'Нормально. Перевір ще понаднормові: вони оплачуються з надбавкою.', en: 'Normal. Also check overtime: it must be paid with a supplement.' },
      { who: 'denys', no: 'Feriepengene står her — tolv komma to prosent.', uk: 'Відпусткові тут — дванадцять цілих дві десятих відсотка.', en: 'The holiday pay is here — twelve point two per cent.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'maria', x: 110, mood: 'happy', pose: 'point' }, { id: 'denys', x: 300, mood: 'grin' }], props: [] }, lines: [
      { who: 'maria', no: 'Da er det ryddig. Signer først når alt dette står svart på hvitt.', uk: 'Тоді все чисто. Підписуй лише тоді, коли все це написано чорним по білому.', en: 'Then it is in order. Only sign once all of this is in writing.' },
      { who: 'denys', no: 'Enig. Jeg spør HR om ett punkt til, så signerer jeg i morgen.', uk: 'Згоден. Запитаю в HR ще про один пункт — і підпишу завтра.', en: 'Agreed. I will ask HR about one more point, then I will sign tomorrow.' }
    ]}
  ],

  vocab: [
    ['en arbeidskontrakt', 'трудовий договір', 'an employment contract'],
    ['ei fast stilling', 'постійна посада', 'a permanent position'],
    ['midlertidig ansatt', 'тимчасовий працівник', 'temporarily employed'],
    ['ei prøvetid', 'випробувальний термін', 'a trial period'],
    ['ei oppsigelsestid', 'строк попередження про звільнення', 'a notice period'],
    ['ei arbeidstid', 'робочий час', 'working hours'],
    ['overtid', 'понаднормові', 'overtime'],
    ['et tillegg', 'надбавка', 'a supplement'],
    ['feriepenger', 'відпусткові', 'holiday pay'],
    ['å signere', 'підписати', 'to sign'],
    ['svart på hvitt', 'чорним по білому', 'in writing'],
    ['ryddig', 'чисто, в порядку', 'tidy, in order']
  ],

  words: {
    no: { 'stilling': 'посада', 'komma': 'кома (у числі)', 'hr': 'відділ кадрів', 'signerer': 'підписую', 'kontrakten': 'договір', 'stillingen': 'посада', 'fast': 'постійна', 'prosent': 'відсоток', 'midlertidig': 'тимчасовий', 'ansatt': 'працівник', 'tryggere': 'надійніше', 'prøvetiden': 'випробувальний термін', 'måneder': 'місяців', 'oppsigelsestiden': 'строк попередження', 'kortere': 'коротший', 'risikerer': 'ризикую', 'fjorten': 'чотирнадцять', 'arbeidstiden': 'робочий час', 'trettisju': 'тридцять сім', 'halv': 'половина', 'time': 'година', 'overtid': 'понаднормові', 'betales': 'оплачується', 'tillegg': 'надбавка', 'feriepengene': 'відпусткові', 'ryddig': 'в порядку', 'signer': 'підписуй', 'svart': 'чорне', 'hvitt': 'біле', 'punkt': 'пункт' },
    en: { 'stilling': 'position', 'komma': 'point (in a number)', 'hr': 'HR department', 'signerer': 'will sign', 'kontrakten': 'the contract', 'stillingen': 'the position', 'fast': 'permanent', 'prosent': 'per cent', 'midlertidig': 'temporary', 'ansatt': 'employee', 'tryggere': 'safer', 'prøvetiden': 'the trial period', 'måneder': 'months', 'oppsigelsestiden': 'the notice period', 'kortere': 'shorter', 'risikerer': 'am risking', 'fjorten': 'fourteen', 'arbeidstiden': 'the working hours', 'trettisju': 'thirty-seven', 'halv': 'half', 'time': 'hour', 'overtid': 'overtime', 'betales': 'is paid', 'tillegg': 'supplement', 'feriepengene': 'the holiday pay', 'ryddig': 'in order', 'signer': 'sign', 'svart': 'black', 'hvitt': 'white', 'punkt': 'point' }
  }
});
