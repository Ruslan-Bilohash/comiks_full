window.COMICS = window.COMICS || [];

/* p160 — B1: на невідкладній уночі. Пояснити симптоми, тріаж, очікування, рецепт і лікарняний. */
COMICS.push({
  id: 'p160',
  level: 'B1',
  category: 'helse',
  title: 'På legevakta om natta',
  titleUk: 'На невідкладній уночі',
  titleEn: 'At the emergency clinic at night',
  summaryUk: 'У Марії вночі сильно болить вухо. Вона дзвонить на 116 117, їде на легевакт, пояснює симптоми, чекає в черзі й отримує рецепт.',
  summaryEn: 'Maria has a bad earache in the night. She calls 116 117, goes to the emergency clinic, explains her symptoms, waits her turn and gets a prescription.',
  summaryNo: 'Maria har sterke øreverk om natta. Hun ringer 116 117, drar på legevakta, forklarer symptomene, venter på tur og får resept.',
  cover: 0,

  panels: [
    { art: { bg: 'home', chars: [{ id: 'maria', x: 200, mood: 'sad' }], props: [{ type: 'phone', x: 110, y: 195 }] }, lines: [
      { who: 'maria', no: 'Jeg har vondt i øret og feber. Er det farlig?', uk: 'У мене болить вухо і є температура. Це небезпечно?', en: 'My ear hurts and I have a fever. Is it dangerous?' },
      { who: 'narrator', no: 'Hun ringer legevakta på 116 117.', uk: 'Вона телефонує на невідкладну за номером 116 117.', en: 'She calls the emergency clinic on 116 117.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'kari', x: 110, mood: 'normal' }, { id: 'maria', x: 300, mood: 'sad' }], props: [{ type: 'docs', x: 200, y: 190 }] }, lines: [
      { who: 'kari', no: 'Hvor lenge har du hatt smertene?', uk: 'Як довго тримається біль?', en: 'How long have you had the pain?' },
      { who: 'maria', no: 'Siden i går kveld. Det ble verre i natt.', uk: 'Від учорашнього вечора. Уночі стало гірше.', en: 'Since yesterday evening. It got worse during the night.' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'kari', x: 110, mood: 'normal', pose: 'point' }, { id: 'maria', x: 300, mood: 'normal' }] }, lines: [
      { who: 'kari', no: 'Du må vente litt. De sykeste går først.', uk: 'Треба трохи зачекати. Найважчих приймають першими.', en: 'You will have to wait a little. The sickest are seen first.' },
      { who: 'maria', no: 'Jeg forstår. Omtrent hvor lenge blir det?', uk: 'Розумію. Приблизно скільки це триватиме?', en: 'I understand. Roughly how long will it be?' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'humphrey', x: 110, mood: 'happy' }, { id: 'maria', x: 300, mood: 'normal' }], props: [{ type: 'stetoskop', x: 200, y: 190 }] }, lines: [
      { who: 'humphrey', no: 'Jeg ser på øret. Ja, det er en betennelse.', uk: 'Огляну вухо. Так, це запалення.', en: 'Let me look at the ear. Yes, it is an infection.' },
      { who: 'maria', no: 'Trenger jeg antibiotika?', uk: 'Мені потрібні антибіотики?', en: 'Do I need antibiotics?' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'humphrey', x: 110, mood: 'normal' }, { id: 'maria', x: 300, mood: 'normal' }], props: [{ type: 'docs', x: 200, y: 190 }] }, lines: [
      { who: 'humphrey', no: 'Ja. Jeg sender resepten elektronisk til apoteket.', uk: 'Так. Надішлю рецепт в аптеку електронно.', en: 'Yes. I will send the prescription to the pharmacy electronically.' },
      { who: 'maria', no: 'Kan jeg få sykmelding for i morgen?', uk: 'Можна лікарняний на завтра?', en: 'Could I get a sick note for tomorrow?' }
    ]},
    { art: { bg: 'office', chars: [{ id: 'humphrey', x: 110, mood: 'happy', pose: 'wave' }, { id: 'maria', x: 300, mood: 'happy' }], fx: 'stars' }, lines: [
      { who: 'humphrey', no: 'Ja, to dager. Ta kontakt hvis feberen holder seg.', uk: 'Так, на два дні. Зверніться знову, якщо температура триматиметься.', en: 'Yes, two days. Get in touch if the fever keeps up.' },
      { who: 'maria', no: 'Tusen takk for hjelpen midt på natta.', uk: 'Дуже дякую за допомогу серед ночі.', en: 'Thank you so much for the help in the middle of the night.' }
    ]}
  ],

  vocab: [
    ['ei legevakt', 'невідкладна допомога', 'an emergency clinic'],
    ['et øre', 'вухо', 'an ear'],
    ['en feber', 'температура, гарячка', 'a fever'],
    ['ei smerte', 'біль', 'pain'],
    ['verre', 'гірше', 'worse'],
    ['å vente på tur', 'чекати своєї черги', 'to wait your turn'],
    ['ei betennelse', 'запалення', 'an infection'],
    ['antibiotika', 'антибіотики', 'antibiotics'],
    ['en resept', 'рецепт', 'a prescription'],
    ['elektronisk', 'електронно', 'electronically'],
    ['ei sykmelding', 'лікарняний', 'a sick note'],
    ['å ta kontakt', 'звернутися', 'to get in touch'],
    ['midt på natta', 'серед ночі', 'in the middle of the night']
  ],

  words: {
    no: { '116': 'сто шістнадцять (номер 116 117)', '117': 'сто сімнадцять (номер 116 117)', 'legevakta': 'невідкладна', 'vondt': 'боляче', 'øret': 'вухо', 'feber': 'температура', 'farlig': 'небезпечно', 'ringer': 'телефонує', 'lenge': 'довго', 'hatt': 'мала', 'smertene': 'біль', 'siden': 'від, з', 'kveld': 'вечір', 'verre': 'гірше', 'natt': 'ніч', 'vente': 'чекати', 'sykeste': 'найважчі', 'først': 'першими', 'forstår': 'розумію', 'omtrent': 'приблизно', 'betennelse': 'запалення', 'trenger': 'потрібні', 'antibiotika': 'антибіотики', 'sender': 'надішлю', 'resepten': 'рецепт', 'elektronisk': 'електронно', 'apoteket': 'аптека', 'sykmelding': 'лікарняний', 'dager': 'дні', 'kontakt': 'контакт', 'feberen': 'температура', 'holder': 'тримається', 'hjelpen': 'допомога', 'midt': 'посеред', 'natta': 'ніч' },
    en: { '116': 'one one six (the number 116 117)', '117': 'one one seven (the number 116 117)', 'legevakta': 'the emergency clinic', 'vondt': 'painful', 'øret': 'the ear', 'feber': 'fever', 'farlig': 'dangerous', 'ringer': 'calls', 'lenge': 'long', 'hatt': 'had', 'smertene': 'the pain', 'siden': 'since', 'kveld': 'evening', 'verre': 'worse', 'natt': 'night', 'vente': 'to wait', 'sykeste': 'the sickest', 'først': 'first', 'forstår': 'understand', 'omtrent': 'roughly', 'betennelse': 'infection', 'trenger': 'need', 'antibiotika': 'antibiotics', 'sender': 'send', 'resepten': 'the prescription', 'elektronisk': 'electronically', 'apoteket': 'the pharmacy', 'sykmelding': 'sick note', 'dager': 'days', 'kontakt': 'contact', 'feberen': 'the fever', 'holder': 'keeps', 'hjelpen': 'the help', 'midt': 'in the middle', 'natta': 'the night' }
  }
});
