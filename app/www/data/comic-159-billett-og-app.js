window.COMICS = window.COMICS || [];

/* p159 — A2: квиток і застосунок у транспорті. Зона, знижка для дітей, контроль, штраф. */
COMICS.push({
  id: 'p159',
  level: 'A2',
  category: 'fritid',
  title: 'Billett og app',
  titleUk: 'Квиток і застосунок',
  titleEn: 'Ticket and app',
  summaryUk: 'Муса вперше їде автобусом у новому місті. Він купує квиток у застосунку, розбирається із зонами й дитячим тарифом — і саме тоді заходить контролер.',
  summaryEn: 'Musa takes the bus in a new city for the first time. He buys a ticket in the app, works out the zones and the child fare — and then an inspector gets on.',
  summaryNo: 'Musa tar bussen i en ny by for første gang. Han kjøper billett i appen, finner ut av soner og barnebillett — og så kommer kontrolløren.',
  cover: 1,

  panels: [
    { art: { bg: 'bus', chars: [{ id: 'musa', x: 290, mood: 'normal' }, { id: 'lillesoster', x: 120, mood: 'happy' }], props: [{ type: 'phone', x: 200, y: 195 }, { type: 'busstop', x: 60 }] }, lines: [
      { who: 'musa', no: 'Jeg må kjøpe billett i appen før vi går på.', uk: 'Мені треба купити квиток у застосунку, перш ніж зайдемо.', en: 'I have to buy a ticket in the app before we get on.' },
      { who: 'lillesoster', no: 'Trenger jeg egen billett, pappa?', uk: 'Мені потрібен окремий квиток, тату?', en: 'Do I need my own ticket, Dad?' }
    ]},
    { art: { bg: 'bus', chars: [{ id: 'musa', x: 290, mood: 'normal', pose: 'point' }, { id: 'lillesoster', x: 120, mood: 'surprised' }], props: [{ type: 'phone', x: 200, y: 195 }] }, lines: [
      { who: 'musa', no: 'Ja, men barn under seks år reiser gratis.', uk: 'Так, але діти до шести років їздять безкоштовно.', en: 'Yes, but children under six travel for free.' },
      { who: 'lillesoster', no: 'Jeg er sju. Da må du kjøpe barnebillett.', uk: 'Мені сім. Тоді треба дитячий квиток.', en: 'I am seven. Then you have to buy a child ticket.' }
    ]},
    { art: { bg: 'bus', chars: [{ id: 'musa', x: 290, mood: 'surprised' }], props: [{ type: 'phone', x: 190, y: 190 }] }, lines: [
      { who: 'musa', no: 'Appen spør om sone. Hvilken sone er vi i?', uk: 'Застосунок питає про зону. У якій ми зоні?', en: 'The app asks about the zone. Which zone are we in?' },
      { who: 'narrator', no: 'Han ser på kartet i appen: sone 1.', uk: 'Він дивиться на карту в застосунку: зона 1.', en: 'He looks at the map in the app: zone 1.' }
    ]},
    { art: { bg: 'bus', chars: [{ id: 'kari', x: 110, mood: 'normal', pose: 'point' }, { id: 'musa', x: 290, mood: 'normal' }], props: [{ type: 'docs', x: 200, y: 190 }] }, lines: [
      { who: 'kari', no: 'God dag, billettkontroll. Kan jeg få se billetten?', uk: 'Добрий день, перевірка квитків. Можна побачити квиток?', en: 'Good day, ticket inspection. May I see your ticket?' },
      { who: 'musa', no: 'Ja, her. Den er aktivert for to minutter siden.', uk: 'Так, ось. Активований дві хвилини тому.', en: 'Yes, here. It was activated two minutes ago.' }
    ]},
    { art: { bg: 'bus', chars: [{ id: 'kari', x: 110, mood: 'happy' }, { id: 'musa', x: 290, mood: 'happy' }], props: [{ type: 'phone', x: 200, y: 195 }] }, lines: [
      { who: 'kari', no: 'Alt i orden. Husk å aktivere før du går om bord.', uk: 'Усе гаразд. Пам’ятайте: активуйте до посадки.', en: 'All in order. Remember to activate before you board.' },
      { who: 'musa', no: 'Hva skjer hvis man glemmer det?', uk: 'А що буде, якщо забути?', en: 'What happens if you forget?' }
    ]},
    { art: { bg: 'bus', chars: [{ id: 'kari', x: 110, mood: 'normal' }, { id: 'lillesoster', x: 290, mood: 'grin', pose: 'cheer' }], fx: 'stars' }, lines: [
      { who: 'kari', no: 'Da blir det gebyr — elleve hundre kroner.', uk: 'Тоді штраф — тисяча сто крон.', en: 'Then there is a fine — eleven hundred kroner.' },
      { who: 'lillesoster', no: 'Oi! Pappa, kjøp alltid billett!', uk: 'Ого! Тату, завжди купуй квиток!', en: 'Wow! Dad, always buy a ticket!' }
    ]}
  ],

  vocab: [
    ['en billett', 'квиток', 'a ticket'],
    ['ei app', 'застосунок', 'an app'],
    ['ei sone', 'зона', 'a zone'],
    ['en barnebillett', 'дитячий квиток', 'a child ticket'],
    ['gratis', 'безкоштовно', 'free of charge'],
    ['å aktivere', 'активувати', 'to activate'],
    ['en billettkontroll', 'перевірка квитків', 'ticket inspection'],
    ['om bord', 'на борт', 'on board'],
    ['å glemme', 'забути', 'to forget'],
    ['et gebyr', 'штраф, збір', 'a fine, a fee'],
    ['et kart', 'карта', 'a map'],
    ['i orden', 'у порядку', 'in order']
  ],

  words: {
    no: { '1': 'один (номер зони)', 'billett': 'квиток', 'appen': 'застосунок', 'kjøpe': 'купити', 'egen': 'власний', 'barn': 'діти', 'under': 'до, менше ніж', 'seks': 'шість', 'reiser': 'їздять', 'gratis': 'безкоштовно', 'sju': 'сім', 'barnebillett': 'дитячий квиток', 'spør': 'питає', 'sone': 'зона', 'kartet': 'карта', 'billettkontroll': 'перевірка квитків', 'billetten': 'квиток', 'aktivert': 'активований', 'minutter': 'хвилини', 'siden': 'тому', 'orden': 'порядок', 'husk': 'пам’ятайте', 'aktivere': 'активувати', 'bord': 'борт (om bord — на борту)', 'skjer': 'стається', 'glemmer': 'забуває', 'gebyr': 'штраф', 'elleve': 'одинадцять', 'kjøp': 'купуй', 'alltid': 'завжди' },
    en: { '1': 'one (zone number)', 'billett': 'ticket', 'appen': 'the app', 'kjøpe': 'to buy', 'egen': 'own', 'barn': 'children', 'under': 'under', 'seks': 'six', 'reiser': 'travel', 'gratis': 'free', 'sju': 'seven', 'barnebillett': 'child ticket', 'spør': 'asks', 'sone': 'zone', 'kartet': 'the map', 'billettkontroll': 'ticket inspection', 'billetten': 'the ticket', 'aktivert': 'activated', 'minutter': 'minutes', 'siden': 'ago', 'orden': 'order', 'husk': 'remember', 'aktivere': 'to activate', 'bord': 'board (om bord — on board)', 'skjer': 'happens', 'glemmer': 'forgets', 'gebyr': 'fine', 'elleve': 'eleven', 'kjøp': 'buy', 'alltid': 'always' }
  }
});
