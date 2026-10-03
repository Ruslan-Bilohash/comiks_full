window.COMICS = window.COMICS || [];

/* p167 — B1: повідомити про переїзд. Класична діра в житті новоприбулого:
   адресу треба змінити в кількох місцях, і через пропущений крок потім не
   приходять листи від держави. Тут проговорюються саме ці кроки. */
COMICS.push({
  id: 'p167',
  level: 'B1',
  category: 'bolig',
  title: 'Å melde flytting',
  titleUk: 'Повідомити про переїзд',
  titleEn: 'Reporting a change of address',
  summaryUk: 'Руслан переїхав і не отримує листів. Аліна пояснює: адресу змінюють у Folkeregisteret протягом восьми днів, окремо налаштовують пересилання пошти й повідомляють роботодавця та банк.',
  summaryEn: 'Ruslan has moved and is not getting any letters. Alina explains: you change your address in the National Registry within eight days, set up mail forwarding separately, and tell your employer and bank.',
  summaryNo: 'Ruslan har flyttet og får ikke brev. Alina forklarer: adressen endres i Folkeregisteret innen åtte dager, ettersending av post bestilles separat, og arbeidsgiver og bank må få beskjed.',
  cover: 0,

  panels: [
    { art: { bg: 'home', chars: [{ id: 'ruslan', x: 300, mood: 'sad', pose: 'hold' }, { id: 'alina', x: 110, mood: 'normal' }], props: [{ type: 'docs', x: 210, y: 190 }] }, lines: [
      { who: 'ruslan', no: 'Jeg har flyttet for tre uker siden, men får ingen brev.', uk: 'Я переїхав три тижні тому, але не отримую жодних листів.', en: 'I moved three weeks ago, but I am not getting any letters.' },
      { who: 'alina', no: 'Har du meldt flytting til Folkeregisteret?', uk: 'Ти повідомив про переїзд до Folkeregisteret?', en: 'Have you reported the move to the National Registry?' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'ruslan', x: 300, mood: 'surprised' }, { id: 'alina', x: 110, mood: 'normal', pose: 'point' }], props: [{ type: 'computer', x: 200, y: 185 }] }, lines: [
      { who: 'ruslan', no: 'Nei. Jeg trodde posten fulgte med automatisk.', uk: 'Ні. Я думав, що пошта переїжджає автоматично.', en: 'No. I thought the post would follow automatically.' },
      { who: 'alina', no: 'Dessverre ikke. Du må gjøre det selv, innen åtte dager.', uk: 'На жаль, ні. Це треба зробити самому, протягом восьми днів.', en: 'Unfortunately not. You have to do it yourself, within eight days.' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'alina', x: 110, mood: 'normal' }, { id: 'ruslan', x: 300, mood: 'normal' }], props: [{ type: 'computer', x: 200, y: 185 }] }, lines: [
      { who: 'alina', no: 'Logg inn med elektronisk ID og fyll ut skjemaet.', uk: 'Увійди з електронною ідентифікацією і заповни форму.', en: 'Log in with your electronic ID and fill in the form.' },
      { who: 'ruslan', no: 'Må hele familien stå på samme melding?', uk: 'Уся родина має бути в одному повідомленні?', en: 'Does the whole family have to be on the same notification?' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'alina', x: 110, mood: 'happy' }, { id: 'ruslan', x: 300, mood: 'normal' }], props: [] }, lines: [
      { who: 'alina', no: 'Ja, hvis dere flytter sammen. Ellers melder hver for seg.', uk: 'Так, якщо ви переїжджаєте разом. Інакше кожен подає окремо.', en: 'Yes, if you move together. Otherwise each person reports separately.' },
      { who: 'ruslan', no: 'Og de gamle brevene som allerede er sendt?', uk: 'А старі листи, які вже надіслали?', en: 'And the old letters that have already been sent?' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'alina', x: 110, mood: 'normal', pose: 'hold' }, { id: 'ruslan', x: 300, mood: 'normal' }], props: [{ type: 'docs', x: 215, y: 192 }] }, lines: [
      { who: 'alina', no: 'Bestill ettersending hos Posten. Det koster litt, men hjelper.', uk: 'Замов пересилання на Пошті. Коштує трохи, але допомагає.', en: 'Order mail forwarding from the post office. It costs a little, but it helps.' },
      { who: 'ruslan', no: 'Er det noe mer jeg glemmer?', uk: 'Я ще щось забуваю?', en: 'Is there anything else I am forgetting?' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'alina', x: 110, mood: 'happy', pose: 'point' }, { id: 'ruslan', x: 300, mood: 'grin' }], props: [] }, lines: [
      { who: 'alina', no: 'Si fra til arbeidsgiver, bank og fastlege. Da stemmer alt.', uk: 'Скажи роботодавцю, банку й сімейному лікарю. Тоді все збігатиметься.', en: 'Tell your employer, your bank and your doctor. Then everything matches.' },
      { who: 'ruslan', no: 'Takk. Nå skjønner jeg hvorfor det ble stille i postkassa.', uk: 'Дякую. Тепер розумію, чому в скриньці стало тихо.', en: 'Thanks. Now I understand why the mailbox went quiet.' }
    ]}
  ],

  vocab: [
    ['å melde flytting', 'повідомити про переїзд', 'to report a change of address'],
    ['Folkeregisteret', 'реєстр населення', 'the National Registry'],
    ['en adresse', 'адреса', 'an address'],
    ['innen åtte dager', 'протягом восьми днів', 'within eight days'],
    ['en elektronisk ID', 'електронна ідентифікація', 'an electronic ID'],
    ['et skjema', 'форма, бланк', 'a form'],
    ['ei melding', 'повідомлення', 'a notification'],
    ['ettersending', 'пересилання пошти', 'mail forwarding'],
    ['en postkasse', 'поштова скринька', 'a mailbox'],
    ['en arbeidsgiver', 'роботодавець', 'an employer'],
    ['en fastlege', 'сімейний лікар', 'a regular GP'],
    ['å stemme', 'збігатися, бути правильним', 'to match, to be correct']
  ],

  words: {
    no: { 'dessverre': 'на жаль', 'ellers': 'інакше', 'folkeregisteret': 'реєстр населення', 'fulgte': 'слідувала', 'fyll': 'заповни', 'flyttet': 'переїхав', 'flytting': 'переїзд', 'brev': 'листи', 'brevene': 'листи', 'meldt': 'повідомив', 'Folkeregisteret': 'реєстр населення', 'posten': 'пошта', 'automatisk': 'автоматично', 'selv': 'сам', 'åtte': 'вісім', 'dager': 'днів', 'logg': 'увійди', 'elektronisk': 'електронна', 'skjemaet': 'форма', 'familien': 'родина', 'melding': 'повідомлення', 'sammen': 'разом', 'ettersending': 'пересилання', 'bestill': 'замов', 'koster': 'коштує', 'arbeidsgiver': 'роботодавець', 'bank': 'банк', 'fastlege': 'сімейний лікар', 'stemmer': 'збігається', 'postkassa': 'скринька', 'stille': 'тихо' },
    en: { 'dessverre': 'unfortunately', 'ellers': 'otherwise', 'folkeregisteret': 'the National Registry', 'fulgte': 'followed', 'fyll': 'fill in', 'flyttet': 'moved', 'flytting': 'moving', 'brev': 'letters', 'brevene': 'the letters', 'meldt': 'reported', 'Folkeregisteret': 'the National Registry', 'posten': 'the post', 'automatisk': 'automatically', 'selv': 'yourself', 'åtte': 'eight', 'dager': 'days', 'logg': 'log in', 'elektronisk': 'electronic', 'skjemaet': 'the form', 'familien': 'the family', 'melding': 'notification', 'sammen': 'together', 'ettersending': 'forwarding', 'bestill': 'order', 'koster': 'costs', 'arbeidsgiver': 'employer', 'bank': 'bank', 'fastlege': 'GP', 'stemmer': 'matches', 'postkassa': 'the mailbox', 'stille': 'quiet' }
  }
});
