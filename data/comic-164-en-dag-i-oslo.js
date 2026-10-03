window.COMICS = window.COMICS || [];

/* p164 — A2, фото-комікс. Кадри тут не намальовані, а фотографічні: у теці photo/
   лежать шість світлин, а хмаринки з норвезьким текстом лягають зверху.
   Сенс саме в цьому: на справжньому фото видно вивіски, цінники й табло — те,
   що учень читатиме в Норвегії насправді. */
COMICS.push({
  id: 'p164',
  level: 'A2',
  category: 'hverdag',
  photoDir: 'photo/',          // 📷 звідси беруться кадри цього коміксу
  title: 'En dag i Oslo',
  titleUk: 'Один день в Осло',
  titleEn: 'A day in Oslo',
  summaryUk: 'Фото-комікс: Муса й Карі проходять звичайний день в Осло — зупинка, вулиця, магазин, кав’ярня, парк і фіорд увечері. Кадри справжні, тож заразом вчимося читати вивіски, цінники й табло.',
  summaryEn: 'A photo comic: Musa and Kari walk through an ordinary day in Oslo — the bus stop, the street, the shop, the café, the park and the fjord in the evening. The frames are real photos, so you also learn to read signs, price tags and departure boards.',
  summaryNo: 'En tegneserie med ekte bilder: Musa og Kari går gjennom en vanlig dag i Oslo – holdeplassen, gata, butikken, kafeen, parken og fjorden om kvelden. Du lærer også å lese skilt, prislapper og tavler.',
  cover: 0,

  panels: [
    { art: { photo: 'p164-1.jpg', chars: [{ id: 'kari', x: 110, y: 108 }, { id: 'musa', x: 178, y: 90 }] }, lines: [
      { who: 'kari', no: 'Se på tavla. Bussen går om tre minutter.', uk: 'Подивися на табло. Автобус їде через три хвилини.', en: 'Look at the board. The bus leaves in three minutes.' },
      { who: 'musa', no: 'Da rekker vi den. Har du billett på appen?', uk: 'Тоді ми встигнемо. У тебе є квиток у застосунку?', en: 'Then we will make it. Do you have a ticket in the app?' }
    ]},
    { art: { photo: 'p164-2.jpg', chars: [{ id: 'musa', x: 172, y: 76 }, { id: 'kari', x: 118, y: 100 }] }, lines: [
      { who: 'musa', no: 'Hva står det på skiltet i vinduet?', uk: 'Що написано на вивісці у вітрині?', en: 'What does the sign in the window say?' },
      { who: 'kari', no: 'Det står åpent fra ni til tjue på hverdager.', uk: 'Там написано: відчинено з дев’ятої до двадцятої в будні.', en: 'It says open from nine to eight on weekdays.' }
    ]},
    { art: { photo: 'p164-3.jpg', chars: [{ id: 'musa', x: 216, y: 92 }, { id: 'kari', x: 130, y: 96 }] }, lines: [
      { who: 'musa', no: 'Hva koster melka her?', uk: 'Скільки тут коштує молоко?', en: 'How much is the milk here?' },
      { who: 'kari', no: 'Prislappen sier nitten kroner. Det er billig.', uk: 'На ціннику дев’ятнадцять крон. Це дешево.', en: 'The price tag says nineteen kroner. That is cheap.' }
    ]},
    { art: { photo: 'p164-4.jpg', chars: [{ id: 'musa', x: 306, y: 96 }, { id: 'kari', x: 102, y: 112 }] }, lines: [
      { who: 'musa', no: 'En kaffe og en kanelbolle, takk.', uk: 'Одну каву й одну булочку з корицею, будь ласка.', en: 'One coffee and one cinnamon bun, please.' },
      { who: 'kari', no: 'Jeg tar det samme. Kan vi betale med kort?', uk: 'Я візьму те саме. Можна заплатити карткою?', en: 'I will have the same. Can we pay by card?' }
    ]},
    { art: { photo: 'p164-5.jpg', chars: [{ id: 'kari', x: 98, y: 98 }, { id: 'musa', x: 232, y: 88 }] }, lines: [
      { who: 'kari', no: 'La oss sette oss på benken litt.', uk: 'Посидьмо трохи на лавці.', en: 'Let us sit on the bench for a while.' },
      { who: 'musa', no: 'Gjerne. Her er det stille midt i byen.', uk: 'Залюбки. Тут тихо посеред міста.', en: 'Gladly. It is quiet here in the middle of the city.' }
    ]},
    { art: { photo: 'p164-6.jpg', chars: [{ id: 'musa', x: 186, y: 80 }, { id: 'kari', x: 131, y: 84 }] }, lines: [
      { who: 'musa', no: 'Se, sola går ned over fjorden.', uk: 'Дивись, сонце сідає над фіордом.', en: 'Look, the sun is setting over the fjord.' },
      { who: 'kari', no: 'En helt vanlig dag, men veldig fin.', uk: 'Зовсім звичайний день, але дуже гарний.', en: 'A completely ordinary day, but a very nice one.' }
    ]}
  ],

  vocab: [
    ['ei tavle', 'табло, дошка', 'a board'],
    ['å rekke', 'встигати', 'to make it in time'],
    ['ein billett', 'квиток', 'a ticket'],
    ['eit skilt', 'вивіска, знак', 'a sign'],
    ['eit vindu', 'вікно, вітрина', 'a window'],
    ['ein hverdag', 'будній день', 'a weekday'],
    ['ein prislapp', 'цінник', 'a price tag'],
    ['å koste', 'коштувати', 'to cost'],
    ['ei krone', 'крона', 'a krone'],
    ['ein kanelbolle', 'булочка з корицею', 'a cinnamon bun'],
    ['å betale', 'платити', 'to pay'],
    ['eit kort', 'картка', 'a card'],
    ['ein benk', 'лавка', 'a bench'],
    ['ein by', 'місто', 'a city'],
    ['ein fjord', 'фіорд', 'a fjord'],
    ['vanlig', 'звичайний', 'ordinary']
  ],

  words: {
    no: { 'se': 'дивись', 'på': 'на', 'tavla': 'табло', 'bussen': 'автобус', 'går': 'їде, йде', 'om': 'через', 'tre': 'три', 'minutter': 'хвилини', 'da': 'тоді', 'rekker': 'встигаємо', 'vi': 'ми', 'den': 'його', 'har': 'маєш', 'du': 'ти', 'billett': 'квиток', 'appen': 'застосунок', 'hva': 'що', 'står': 'написано', 'det': 'це', 'skiltet': 'вивіска', 'i': 'у', 'vinduet': 'вітрина', 'åpent': 'відчинено', 'fra': 'з', 'ni': 'дев’ятої', 'til': 'до', 'tjue': 'двадцятої', 'hverdager': 'будні', 'koster': 'коштує', 'melka': 'молоко', 'her': 'тут', 'prislappen': 'цінник', 'sier': 'каже', 'nitten': 'дев’ятнадцять', 'kroner': 'крон', 'er': 'є', 'billig': 'дешево', 'en': 'одну', 'kaffe': 'кава', 'og': 'і', 'kanelbolle': 'булочка з корицею', 'takk': 'дякую', 'jeg': 'я', 'tar': 'беру', 'samme': 'те саме', 'kan': 'можна', 'betale': 'платити', 'med': '(карткою)', 'kort': 'картка', 'la': 'нехай', 'oss': 'нам', 'sette': 'сісти', 'benken': 'лавка', 'litt': 'трохи', 'gjerne': 'залюбки', 'stille': 'тихо', 'midt': 'посеред', 'byen': 'місто', 'sola': 'сонце', 'ned': 'вниз', 'over': 'над', 'fjorden': 'фіорд', 'helt': 'зовсім', 'vanlig': 'звичайний', 'dag': 'день', 'men': 'але', 'veldig': 'дуже', 'fin': 'гарний' },
    en: { 'se': 'look', 'på': 'at, on', 'tavla': 'the board', 'bussen': 'the bus', 'går': 'goes, leaves', 'om': 'in', 'tre': 'three', 'minutter': 'minutes', 'da': 'then', 'rekker': 'make it', 'vi': 'we', 'den': 'it', 'har': 'have', 'du': 'you', 'billett': 'ticket', 'appen': 'the app', 'hva': 'what', 'står': 'says', 'det': 'it', 'skiltet': 'the sign', 'i': 'in', 'vinduet': 'the window', 'åpent': 'open', 'fra': 'from', 'ni': 'nine', 'til': 'to', 'tjue': 'twenty', 'hverdager': 'weekdays', 'koster': 'costs', 'melka': 'the milk', 'her': 'here', 'prislappen': 'the price tag', 'sier': 'says', 'nitten': 'nineteen', 'kroner': 'kroner', 'er': 'is', 'billig': 'cheap', 'en': 'a, one', 'kaffe': 'coffee', 'og': 'and', 'kanelbolle': 'cinnamon bun', 'takk': 'thanks, please', 'jeg': 'I', 'tar': 'take, have', 'samme': 'the same', 'kan': 'can', 'betale': 'pay', 'med': 'with, by', 'kort': 'card', 'la': 'let', 'oss': 'us', 'sette': 'sit down', 'benken': 'the bench', 'litt': 'a little', 'gjerne': 'gladly', 'stille': 'quiet', 'midt': 'in the middle', 'byen': 'the city', 'sola': 'the sun', 'ned': 'down', 'over': 'over', 'fjorden': 'the fjord', 'helt': 'completely', 'vanlig': 'ordinary', 'dag': 'day', 'men': 'but', 'veldig': 'very', 'fin': 'nice' }
  }
});
