/*
 * Англійський курс, частина 3: історії e19–e28 (A2–B1). Граматична тема кожної — поле grammar
 * (див. план у data/english2.js). Репліки { who, en, uk, no }, vocab [en, uk, no].
 */
(function () {
  const E = window.ENGLISH = window.ENGLISH || { comics: [] };
  E.comics.push(
    {
      id: 'e19', level: 'A2', category: 'hverdag', style: 'strip', grammar: 'imperatives',
      title: 'Which Bus Goes to the Museum?', titleUk: 'Який автобус їде до музею?', titleNo: 'Hvilken buss går til museet?',
      summaryUk: 'Руслан їде автобусом до музею: get on, get off, sit down, turn right.', summaryEn: 'Ruslan takes the bus to the museum: get on, get off, sit down, turn right.', summaryNo: 'Ruslan tar bussen til museet: get on, get off, sit down, turn right.',
      cover: 1,
      panels: [
        { art: { bg: 'street', chars: [{ id: 'ruslan', x: 110, mood: 'happy', pose: 'point' }, { id: 'bestemor', x: 300, mood: 'happy' }], props: [{ type: 'busstop', x: 210 }] }, lines: [
          { who: 'ruslan', en: 'Excuse me, which bus goes to the museum?', uk: 'Перепрошую, який автобус їде до музею?', no: 'Unnskyld, hvilken buss går til museet?' },
          { who: 'bestemor', en: 'Take bus number five. It stops right here.', uk: 'Сідайте на п’ятий автобус. Він зупиняється просто тут.', no: 'Ta buss nummer fem. Den stopper akkurat her.' }
        ]},
        { art: { bg: 'bus', sign: '5 MUSEUM', chars: [{ id: 'kari', x: 110, mood: 'happy', pose: 'wave' }, { id: 'ruslan', x: 300, mood: 'surprised', pose: 'hold' }] }, lines: [
          { who: 'kari', en: 'Good morning! Get on, please. Tickets are in the app.', uk: 'Доброго ранку! Заходьте, будь ласка. Квитки — у застосунку.', no: 'God morgen! Bare gå på. Billettene er i appen.' },
          { who: 'ruslan', en: 'Oh, I haven\'t got the app. Can I pay by card?', uk: 'Ой, у мене немає застосунку. Можна заплатити карткою?', no: 'Å, jeg har ikke appen. Kan jeg betale med kort?' }
        ]},
        { art: { bg: 'bus', sign: '5 MUSEUM', chars: [{ id: 'kari', x: 110, mood: 'grin', pose: 'point' }, { id: 'ruslan', x: 300, mood: 'happy' }] }, lines: [
          { who: 'kari', en: 'Yes. Hold your card here. Now sit down and hold on!', uk: 'Так. Прикладіть картку сюди. А тепер сідайте й тримайтеся!', no: 'Ja. Hold kortet her. Sett deg ned og hold deg fast!' },
          { who: 'ruslan', en: 'Please tell me when to get off.', uk: 'Скажіть, будь ласка, коли мені виходити.', no: 'Si fra når jeg skal gå av, er du snill.' }
        ]},
        { art: { bg: 'bus', sign: '5 MUSEUM', chars: [{ id: 'ruslan', x: 200, mood: 'grin', pose: 'point' }] }, lines: [
          { who: 'narrator', en: 'The bus goes over the bridge and past the old church.', uk: 'Автобус їде через міст і повз стару церкву.', no: 'Bussen kjører over brua og forbi den gamle kirken.' },
          { who: 'ruslan', en: 'What a beautiful city!', uk: 'Яке гарне місто!', no: 'For en vakker by!' }
        ]},
        { art: { bg: 'bus', sign: '5 MUSEUM', chars: [{ id: 'kari', x: 110, mood: 'happy', pose: 'point' }, { id: 'ruslan', x: 300, mood: 'happy', pose: 'wave' }] }, lines: [
          { who: 'kari', en: 'This is your stop. Get off here and turn right.', uk: 'Це ваша зупинка. Виходьте тут і поверніть праворуч.', no: 'Dette er stoppet ditt. Gå av her og ta til høyre.' },
          { who: 'ruslan', en: 'Thank you so much! Have a nice day.', uk: 'Щиро дякую! Гарного дня.', no: 'Tusen takk! Ha en fin dag.' }
        ]},
        { art: { bg: 'street', flags: true, chars: [{ id: 'ruslan', x: 300, mood: 'grin', pose: 'cheer' }, { id: 'alina', x: 110, mood: 'happy', pose: 'wave' }] }, lines: [
          { who: 'alina', en: 'You found it! Was the bus easy?', uk: 'Ти знайшов! З автобусом було легко?', no: 'Du fant det! Var det lett å ta bussen?' },
          { who: 'ruslan', en: 'Yes! The driver helped me a lot.', uk: 'Так! Водійка мені дуже допомогла.', no: 'Ja! Sjåføren hjalp meg mye.' }
        ]}
      ],
      vocab: [
        ['which bus', 'який автобус', 'hvilken buss'], ['museum', 'музей', 'museum'], ['stops', 'зупиняється', 'stopper'], ['right here', 'просто тут', 'akkurat her'],
        ['get on', 'заходити (в транспорт)', 'gå på'], ['tickets', 'квитки', 'billetter'], ['app', 'застосунок', 'app'], ['pay by card', 'платити карткою', 'betale med kort'],
        ['hold', 'тримати, прикласти', 'holde'], ['sit down', 'сідайте', 'sett deg ned'], ['hold on', 'тримайтеся', 'hold deg fast'], ['get off', 'виходити (з транспорту)', 'gå av'],
        ['bridge', 'міст', 'bru'], ['past', 'повз', 'forbi'], ['church', 'церква', 'kirke'], ['turn right', 'поверніть праворуч', 'ta til høyre'], ['driver', 'водій', 'sjåfør'], ['helped', 'допоміг', 'hjalp']
      ]
    },
    {
      id: 'e20', level: 'A2', category: 'natur', style: 'strip', grammar: 'going-to',
      title: 'Our Camping Trip', titleUk: 'Наш похід із наметом', titleNo: 'Campingturen vår',
      summaryUk: 'Сім’я Мії збирається в похід: плани з going to.', summaryEn: 'Mia’s family plans a camping trip: plans with going to.', summaryNo: 'Familien til Mia planlegger en campingtur: planer med going to.',
      cover: 2,
      panels: [
        { art: { bg: 'home', chars: [{ id: 'pappa', x: 110, mood: 'happy', pose: 'point' }, { id: 'mia', x: 300, mood: 'grin', pose: 'cheer' }], props: [{ type: 'backpack', x: 210, y: 250, front: true }] }, lines: [
          { who: 'pappa', en: 'Tomorrow we are going to sleep in a tent!', uk: 'Завтра ми ночуватимемо в наметі!', no: 'I morgen skal vi sove i telt!' },
          { who: 'mia', en: 'Yay! I am going to pack my backpack now.', uk: 'Ура! Я зараз зберу рюкзак.', no: 'Hurra! Jeg skal pakke sekken min nå.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'mamma', x: 110, mood: 'happy', pose: 'point' }, { id: 'leo', x: 300, mood: 'happy', pose: 'hold' }], props: [{ type: 'backpack', x: 230, y: 250, front: true }] }, lines: [
          { who: 'mamma', en: 'Are you going to take a warm jumper?', uk: 'Ти візьмеш теплий светр?', no: 'Skal du ta med en varm genser?' },
          { who: 'leo', en: 'Yes, and I am going to bring my torch.', uk: 'Так, а ще я візьму свій ліхтарик.', no: 'Ja, og jeg skal ta med lommelykta mi.' }
        ]},
        { art: { bg: 'mountain', chars: [{ id: 'pappa', x: 110, mood: 'happy', pose: 'hold' }, { id: 'leo', x: 300, mood: 'grin', pose: 'cheer' }], props: [{ type: 'tent', x: 210 }] }, lines: [
          { who: 'pappa', en: 'Here we are! First we are going to put up the tent.', uk: 'Ось ми й на місці! Спершу поставимо намет.', no: 'Nå er vi framme! Først skal vi sette opp teltet.' },
          { who: 'leo', en: 'I am going to help you, Dad!', uk: 'Я тобі допоможу, тату!', no: 'Jeg skal hjelpe deg, pappa!' }
        ]},
        { art: { bg: 'forest', chars: [{ id: 'mia', x: 110, mood: 'happy', pose: 'point' }, { id: 'mamma', x: 300, mood: 'happy' }], props: [{ type: 'berries', x: 200, y: 270, front: true }, { type: 'mushroom', x: 250, y: 275, front: true }] }, lines: [
          { who: 'mia', en: 'Look, berries! Are we going to pick them?', uk: 'Дивись, ягоди! Ми їх зберемо?', no: 'Se, bær! Skal vi plukke dem?' },
          { who: 'mamma', en: 'Yes, we are going to eat them with pancakes.', uk: 'Так, ми з’їмо їх із млинцями.', no: 'Ja, vi skal spise dem med pannekaker.' }
        ]},
        { art: { bg: 'mountain', chars: [{ id: 'mia', x: 110, mood: 'surprised' }, { id: 'pappa', x: 300, mood: 'happy', pose: 'hold' }], props: [{ type: 'tent', x: 210 }, { type: 'thermos', x: 340, y: 255, front: true }] }, lines: [
          { who: 'mia', en: 'It is getting dark. What are we going to do now?', uk: 'Сутеніє. Що ми робитимемо тепер?', no: 'Det begynner å bli mørkt. Hva skal vi gjøre nå?' },
          { who: 'pappa', en: 'We are going to drink hot cocoa and look at the stars.', uk: 'Питимемо гаряче какао й дивитимемося на зорі.', no: 'Vi skal drikke varm kakao og se på stjernene.' }
        ]},
        { art: { bg: 'mountain', chars: [{ id: 'leo', x: 90, mood: 'grin', pose: 'point' }, { id: 'mia', x: 210, mood: 'happy' }, { id: 'mamma', x: 330, mood: 'happy', pose: 'cheer' }], props: [{ type: 'tent', x: 210, s: 0.8 }] }, lines: [
          { who: 'leo', en: 'Next summer I am going to climb that big mountain!', uk: 'Наступного літа я зійду на ту велику гору!', no: 'Neste sommer skal jeg klatre opp på det store fjellet!' },
          { who: 'mamma', en: 'And we are all going to come with you!', uk: 'І ми всі підемо з тобою!', no: 'Og vi skal alle bli med deg!' }
        ]}
      ],
      vocab: [
        ['tomorrow', 'завтра', 'i morgen'], ['going to', 'збиратися (план)', 'skal'], ['tent', 'намет', 'telt'], ['pack', 'пакувати', 'pakke'], ['backpack', 'рюкзак', 'sekk'],
        ['warm', 'теплий', 'varm'], ['jumper', 'светр', 'genser'], ['bring', 'взяти з собою', 'ta med'], ['torch', 'ліхтарик', 'lommelykt'], ['put up', 'поставити (намет)', 'sette opp'],
        ['berries', 'ягоди', 'bær'], ['pick', 'збирати', 'plukke'], ['pancakes', 'млинці', 'pannekaker'], ['getting dark', 'сутеніє', 'begynner å bli mørkt'], ['hot cocoa', 'гаряче какао', 'varm kakao'],
        ['stars', 'зорі', 'stjerner'], ['climb', 'підніматися, лізти', 'klatre'], ['next summer', 'наступного літа', 'neste sommer']
      ]
    },
    {
      id: 'e21', level: 'A2', category: 'mat', style: 'strip', grammar: 'some-any',
      title: 'Let’s Make Pancakes', titleUk: 'Печемо млинці', titleNo: 'Vi lager pannekaker',
      summaryUk: 'Мія з бабусею печуть млинці: some / any, how much / how many.', summaryEn: 'Mia and Grandma make pancakes: some / any, how much / how many.', summaryNo: 'Mia og bestemor lager pannekaker: some / any, how much / how many.',
      cover: 4,
      panels: [
        { art: { bg: 'kitchen', chars: [{ id: 'bestemor', x: 110, mood: 'happy', pose: 'point' }, { id: 'mia', x: 300, mood: 'grin', pose: 'cheer' }], props: [{ type: 'eggs', x: 210, y: 250, front: true }] }, lines: [
          { who: 'bestemor', en: 'Let\'s make pancakes! Have we got any eggs?', uk: 'Спечімо млинці! У нас є яйця?', no: 'La oss lage pannekaker! Har vi noen egg?' },
          { who: 'mia', en: 'Yes, there are some eggs in the fridge.', uk: 'Так, у холодильнику є кілька яєць.', no: 'Ja, det er noen egg i kjøleskapet.' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'mia', x: 110, mood: 'happy', pose: 'hold' }, { id: 'bestemor', x: 300, mood: 'happy', pose: 'point' }], props: [{ type: 'flour', x: 180, y: 250, front: true }, { type: 'milk', x: 240, y: 250, front: true }] }, lines: [
          { who: 'mia', en: 'How much flour do we need?', uk: 'Скільки борошна нам треба?', no: 'Hvor mye mel trenger vi?' },
          { who: 'bestemor', en: 'Two cups of flour and some milk.', uk: 'Дві чашки борошна й трохи молока.', no: 'To kopper mel og litt melk.' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'bestemor', x: 110, mood: 'happy' }, { id: 'mia', x: 300, mood: 'surprised', pose: 'hold' }], props: [{ type: 'eggs', x: 300, y: 215, front: true }, { type: 'bowl', x: 200, y: 250, front: true }] }, lines: [
          { who: 'bestemor', en: 'How many eggs are there?', uk: 'Скільки там яєць?', no: 'Hvor mange egg er det?' },
          { who: 'mia', en: 'Only two. Is that enough?', uk: 'Лише два. Цього досить?', no: 'Bare to. Er det nok?' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'bestemor', x: 110, mood: 'grin', pose: 'point' }, { id: 'mia', x: 300, mood: 'happy', pose: 'hold' }], props: [{ type: 'bowl', x: 280, y: 245, front: true }, { type: 'sugar', x: 200, y: 250, front: true }] }, lines: [
          { who: 'bestemor', en: 'Yes. Now mix everything in the bowl. Don\'t add too much sugar!', uk: 'Так. Тепер змішай усе в мисці. Не додавай забагато цукру!', no: 'Ja. Bland alt i bollen nå. Ikke ha i for mye sukker!' },
          { who: 'mia', en: 'Is there any butter for the pan?', uk: 'А є масло для сковорідки?', no: 'Har vi noe smør til stekepanna?' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'bestemor', x: 110, mood: 'happy', pose: 'hold' }, { id: 'mia', x: 300, mood: 'surprised', pose: 'cheer' }], props: [{ type: 'butter', x: 190, y: 250, front: true }, { type: 'waffles', x: 250, y: 240, front: true }] }, lines: [
          { who: 'bestemor', en: 'There is a little butter left. Turn the pancake now!', uk: 'Масла ще трохи є. Перевертай млинець!', no: 'Det er litt smør igjen. Snu pannekaken nå!' },
          { who: 'mia', en: 'Look! It flew up into the air!', uk: 'Дивись! Він злетів у повітря!', no: 'Se! Den fløy opp i lufta!' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'bestemor', x: 210, mood: 'grin' }, { id: 'mia', x: 90, mood: 'happy', pose: 'point' }, { id: 'pus', x: 330 }], props: [{ type: 'table', x: 200 }, { type: 'berries', x: 200, y: 222, front: true }] }, lines: [
          { who: 'mia', en: 'Can I have some jam with my pancakes?', uk: 'Можна мені трохи варення до млинців?', no: 'Kan jeg få litt syltetøy på pannekakene?' },
          { who: 'bestemor', en: 'Of course. But don\'t give any to the cat!', uk: 'Звісно. Але котові не давай!', no: 'Selvfølgelig. Men ikke gi noe til katten!' }
        ]}
      ],
      vocab: [
        ['pancakes', 'млинці', 'pannekaker'], ['any', 'якісь (у питаннях)', 'noen, noe'], ['eggs', 'яйця', 'egg'], ['some', 'трохи, кілька', 'litt, noen'], ['fridge', 'холодильник', 'kjøleskap'],
        ['how much', 'скільки (незлічуване)', 'hvor mye'], ['flour', 'борошно', 'mel'], ['cups', 'чашки', 'kopper'], ['milk', 'молоко', 'melk'], ['how many', 'скільки (злічуване)', 'hvor mange'],
        ['enough', 'досить', 'nok'], ['mix', 'змішувати', 'blande'], ['bowl', 'миска', 'bolle'], ['too much', 'забагато', 'for mye'], ['sugar', 'цукор', 'sukker'], ['butter', 'масло', 'smør'],
        ['pan', 'сковорідка', 'stekepanne'], ['left', 'залишилося', 'igjen'], ['turn', 'перевертати', 'snu'], ['jam', 'варення', 'syltetøy']
      ]
    },
    {
      id: 'e22', level: 'A2', category: 'fritid', style: 'strip', grammar: 'can',
      title: 'The Football Match', titleUk: 'Футбольний матч', titleNo: 'Fotballkampen',
      summaryUk: 'Хто що вміє на полі: can / can’t і could / couldn’t.', summaryEn: 'Who can do what on the pitch: can / can’t and could / couldn’t.', summaryNo: 'Hvem kan hva på banen: can / can’t og could / couldn’t.',
      cover: 4,
      panels: [
        { art: { bg: 'park', chars: [{ id: 'laerer', x: 110, mood: 'happy', pose: 'point' }, { id: 'leo', x: 300, mood: 'grin', pose: 'cheer' }], props: [{ type: 'ball', x: 210 }] }, lines: [
          { who: 'laerer', en: 'Who can play in goal today?', uk: 'Хто сьогодні може стати на ворота?', no: 'Hvem kan stå i mål i dag?' },
          { who: 'leo', en: 'I can! I can jump very high.', uk: 'Я можу! Я вмію дуже високо стрибати.', no: 'Jeg kan! Jeg kan hoppe veldig høyt.' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'humphrey', x: 110, mood: 'sad' }, { id: 'nora', x: 300, mood: 'happy', pose: 'point' }], props: [{ type: 'ball', x: 210 }] }, lines: [
          { who: 'humphrey', en: 'I can run fast, but I can\'t kick the ball far.', uk: 'Я вмію швидко бігати, але не вмію далеко бити по м’ячу.', no: 'Jeg kan løpe fort, men jeg kan ikke sparke ballen langt.' },
          { who: 'nora', en: 'I can teach you! Watch my left foot.', uk: 'Я можу тебе навчити! Дивись на мою ліву ногу.', no: 'Jeg kan lære deg det! Se på venstrefoten min.' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'nora', x: 110, mood: 'grin', pose: 'cheer' }, { id: 'humphrey', x: 300, mood: 'surprised', pose: 'point' }], props: [{ type: 'ball', x: 200 }] }, lines: [
          { who: 'nora', en: 'Kick with the side of your foot. Like this!', uk: 'Бий внутрішньою стороною стопи. Ось так!', no: 'Spark med innsiden av foten. Sånn!' },
          { who: 'humphrey', en: 'Wow, now I can do it too!', uk: 'Ого, тепер і я так можу!', no: 'Wow, nå klarer jeg det også!' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'laerer', x: 170, mood: 'grin', pose: 'cheer' }], props: [{ type: 'ball', x: 300 }] }, lines: [
          { who: 'narrator', en: 'The match starts. The other team can play very well.', uk: 'Матч починається. Інша команда грає дуже добре.', no: 'Kampen begynner. Det andre laget spiller veldig godt.' },
          { who: 'laerer', en: 'Come on, team! You can do it!', uk: 'Вперед, команда! Ви зможете!', no: 'Kom igjen, laget! Dere klarer det!' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'leo', x: 110, mood: 'grin', pose: 'cheer' }, { id: 'nora', x: 300, mood: 'grin', pose: 'point' }], props: [{ type: 'ball', x: 60 }] }, lines: [
          { who: 'leo', en: 'I saved it! They can\'t score!', uk: 'Я відбив! Вони не можуть забити!', no: 'Jeg reddet den! De klarer ikke å score!' },
          { who: 'nora', en: 'Humphrey has got the ball… Goal!', uk: 'М’яч у Гамфрі… Гол!', no: 'Humphrey har ballen … Mål!' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'humphrey', x: 90, mood: 'grin', pose: 'cheer' }, { id: 'leo', x: 210, mood: 'happy' }, { id: 'laerer', x: 330, mood: 'happy', pose: 'wave' }] }, lines: [
          { who: 'humphrey', en: 'Last year I couldn\'t play football at all!', uk: 'Торік я взагалі не вмів грати у футбол!', no: 'I fjor kunne jeg ikke spille fotball i det hele tatt!' },
          { who: 'laerer', en: 'And now you can win a match. Well done, everyone!', uk: 'А тепер ви можете виграти матч. Молодці всі!', no: 'Og nå kan dere vinne en kamp. Bra jobbet, alle sammen!' }
        ]}
      ],
      vocab: [
        ['can', 'могти, вміти', 'kan'], ['play in goal', 'стояти на воротах', 'stå i mål'], ['jump', 'стрибати', 'hoppe'], ['high', 'високо', 'høyt'], ['run', 'бігати', 'løpe'],
        ['fast', 'швидко', 'fort'], ['can\'t', 'не може, не вміє', 'kan ikke'], ['kick', 'бити ногою', 'sparke'], ['far', 'далеко', 'langt'], ['teach', 'навчити', 'lære'],
        ['foot', 'стопа, нога', 'fot'], ['side', 'бік, сторона', 'side'], ['match', 'матч', 'kamp'], ['team', 'команда', 'lag'], ['saved', 'відбив, урятував', 'reddet'],
        ['score', 'забити гол', 'score'], ['goal', 'гол, ворота', 'mål'], ['couldn\'t', 'не міг, не вмів', 'kunne ikke'], ['at all', 'зовсім, взагалі', 'i det hele tatt'], ['win', 'вигравати', 'vinne']
      ]
    },
    {
      id: 'e23', level: 'B1', category: 'jobb', style: 'strip', grammar: 'present-perfect',
      title: 'Have You Finished the Report?', titleUk: 'Ти вже закінчив звіт?', titleNo: 'Er du ferdig med rapporten?',
      summaryUk: 'Офіс, дедлайн і комп’ютер, що завис: Present Perfect — already, just, yet, ever.', summaryEn: 'An office, a deadline and a frozen computer: the Present Perfect — already, just, yet, ever.', summaryNo: 'Et kontor, en frist og en datamaskin som henger seg opp: Present Perfect – already, just, yet, ever.',
      cover: 2,
      panels: [
        { art: { bg: 'office', chars: [{ id: 'alina', x: 110, mood: 'normal', pose: 'point' }, { id: 'ruslan', x: 300, mood: 'surprised' }], props: [{ type: 'computer', x: 300, y: 240 }] }, lines: [
          { who: 'alina', en: 'Ruslan, have you finished the report yet?', uk: 'Руслане, ти вже закінчив звіт?', no: 'Ruslan, er du ferdig med rapporten ennå?' },
          { who: 'ruslan', en: 'Not yet. I have just started the last page.', uk: 'Ще ні. Я щойно почав останню сторінку.', no: 'Ikke ennå. Jeg har nettopp begynt på den siste siden.' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'alina', x: 110, mood: 'happy' }, { id: 'ruslan', x: 300, mood: 'grin', pose: 'hold' }], props: [{ type: 'docs', x: 330, y: 215, front: true }] }, lines: [
          { who: 'alina', en: 'Have you checked the numbers?', uk: 'Ти перевірив цифри?', no: 'Har du sjekket tallene?' },
          { who: 'ruslan', en: 'Yes, I have already checked them twice.', uk: 'Так, я вже двічі їх перевірив.', no: 'Ja, jeg har allerede sjekket dem to ganger.' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'ruslan', x: 110, mood: 'sad', pose: 'point' }, { id: 'alina', x: 300, mood: 'surprised' }], props: [{ type: 'computer', x: 200, y: 240 }] }, lines: [
          { who: 'ruslan', en: 'Oh no, the computer has frozen!', uk: 'Ой ні, комп’ютер завис!', no: 'Å nei, datamaskinen har hengt seg opp!' },
          { who: 'alina', en: 'Have you saved your work?', uk: 'Ти зберіг свою роботу?', no: 'Har du lagret arbeidet ditt?' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'ruslan', x: 110, mood: 'grin', pose: 'cheer' }, { id: 'alina', x: 300, mood: 'happy' }], props: [{ type: 'computer', x: 200, y: 240 }] }, lines: [
          { who: 'ruslan', en: 'Yes! I have learned to save every five minutes.', uk: 'Так! Я навчився зберігати кожні п’ять хвилин.', no: 'Ja! Jeg har lært meg å lagre hvert femte minutt.' },
          { who: 'alina', en: 'Smart. Have you ever lost a whole report?', uk: 'Розумно. А ти колись втрачав цілий звіт?', no: 'Smart. Har du noen gang mistet en hel rapport?' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'ruslan', x: 110, mood: 'grin' }, { id: 'alina', x: 300, mood: 'happy', pose: 'hold' }], props: [{ type: 'mug', x: 330, y: 215, front: true }] }, lines: [
          { who: 'ruslan', en: 'Once, in my first job. I have never forgotten it!', uk: 'Одного разу, на першій роботі. Я ніколи цього не забуду!', no: 'Én gang, i min første jobb. Det har jeg aldri glemt!' },
          { who: 'alina', en: 'We have all made that mistake.', uk: 'Ми всі колись так помилялися.', no: 'Vi har alle gjort den feilen.' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'ruslan', x: 110, mood: 'grin', pose: 'cheer' }, { id: 'alina', x: 300, mood: 'grin', pose: 'wave' }], props: [{ type: 'docs', x: 210, y: 240, front: true }] }, lines: [
          { who: 'ruslan', en: 'Done! I have sent you the report.', uk: 'Готово! Я надіслав тобі звіт.', no: 'Ferdig! Jeg har sendt deg rapporten.' },
          { who: 'alina', en: 'Great work. You have done a lot this week.', uk: 'Чудова робота. Ти багато зробив цього тижня.', no: 'Godt jobbet. Du har gjort mye denne uka.' }
        ]}
      ],
      vocab: [
        ['have you finished', 'ти закінчив', 'er du ferdig'], ['report', 'звіт', 'rapport'], ['yet', 'вже (у питанні), ще (не)', 'ennå'], ['just', 'щойно', 'nettopp'],
        ['started', 'почав', 'begynt'], ['last page', 'остання сторінка', 'siste side'], ['checked', 'перевірив', 'sjekket'], ['numbers', 'цифри, числа', 'tall'], ['already', 'вже', 'allerede'],
        ['twice', 'двічі', 'to ganger'], ['frozen', 'завис', 'hengt seg opp'], ['saved', 'зберіг', 'lagret'], ['learned', 'навчився', 'lært'], ['ever', 'колись', 'noen gang'],
        ['lost', 'втратив', 'mistet'], ['whole', 'цілий', 'hel'], ['never', 'ніколи', 'aldri'], ['forgotten', 'забув', 'glemt'], ['mistake', 'помилка', 'feil'], ['sent', 'надіслав', 'sendt']
      ]
    },
    {
      id: 'e24', level: 'B1', category: 'hverdag', style: 'strip', grammar: 'past-continuous',
      title: 'Musa and the Speed Camera', titleUk: 'Муса і камера швидкості', titleNo: 'Musa og fotoboksen',
      summaryUk: 'Муса співав за кермом і не помітив знака: Past Continuous проти Past Simple.', summaryEn: 'Musa was singing at the wheel and missed a sign: the Past Continuous versus the Past Simple.', summaryNo: 'Musa sang bak rattet og overså et skilt: Past Continuous mot Past Simple.',
      cover: 1,
      panels: [
        { art: { bg: 'street', chars: [{ id: 'musa', x: 110, mood: 'grin', pose: 'hold', s: 0.9 }], props: [{ type: 'car', x: 250 }] }, lines: [
          { who: 'narrator', en: 'Yesterday Musa was driving home from work.', uk: 'Учора Муса їхав додому з роботи.', no: 'I går kjørte Musa hjem fra jobben.' },
          { who: 'musa', en: 'I was listening to loud music and singing along.', uk: 'Я слухав гучну музику й підспівував.', no: 'Jeg hørte på høy musikk og sang med.' }
        ]},
        { art: { bg: 'street', chars: [{ id: 'musa', x: 110, mood: 'surprised', s: 0.9 }], props: [{ type: 'car', x: 220 }, { type: 'speedsign', x: 345, label: '50' }] }, lines: [
          { who: 'narrator', en: 'While he was singing, he didn\'t see the speed sign.', uk: 'Поки він співав, не помітив знака обмеження швидкості.', no: 'Mens han sang, så han ikke fartsskiltet.' },
          { who: 'musa', en: 'Flash! Oh no, was that a speed camera?', uk: 'Спалах! Ой ні, це була камера швидкості?', no: 'Blink! Å nei, var det en fotoboks?' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'musa', x: 300, mood: 'sad', s: 0.9 }, { id: 'storesoster', x: 110, mood: 'surprised', pose: 'point' }], props: [{ type: 'sofa', x: 210 }] }, lines: [
          { who: 'storesoster', en: 'Dad, what were you doing when it happened?', uk: 'Тату, що ти робив, коли це сталося?', no: 'Pappa, hva holdt du på med da det skjedde?' },
          { who: 'musa', en: 'I was driving at sixty in a fifty zone.', uk: 'Я їхав шістдесят там, де можна п’ятдесят.', no: 'Jeg kjørte i seksti i en femtisone.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'lillesoster', x: 110, mood: 'grin', pose: 'point' }, { id: 'musa', x: 300, mood: 'sad', s: 0.9 }] }, lines: [
          { who: 'lillesoster', en: 'You were driving too fast again!', uk: 'Ти знову їхав надто швидко!', no: 'Du kjørte for fort igjen!' },
          { who: 'musa', en: 'I know. I was thinking about my new tyres.', uk: 'Знаю. Я думав про свої нові шини.', no: 'Jeg vet det. Jeg tenkte på de nye dekkene mine.' }
        ]},
        { art: { bg: 'street', chars: [{ id: 'alina', x: 110, mood: 'happy', pose: 'wave' }, { id: 'musa', x: 300, mood: 'grin', pose: 'point', s: 0.9 }], props: [{ type: 'car', x: 210, s: 0.8 }] }, lines: [
          { who: 'alina', en: 'I saw you this morning. You were driving very slowly!', uk: 'Я бачила тебе сьогодні вранці. Ти їхав дуже повільно!', no: 'Jeg så deg i morges. Du kjørte veldig sakte!' },
          { who: 'musa', en: 'Yes! I was watching every sign on the road.', uk: 'Так! Я стежив за кожним знаком на дорозі.', no: 'Ja! Jeg fulgte med på hvert eneste skilt langs veien.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'musa', x: 100, mood: 'grin', s: 0.9 }, { id: 'storesoster', x: 220, mood: 'happy' }, { id: 'lillesoster', x: 330, mood: 'grin', pose: 'cheer' }], props: [{ type: 'sofa', x: 210 }] }, lines: [
          { who: 'musa', en: 'From now on, the music is quieter and the car is slower.', uk: 'Відтепер музика тихіша, а машина повільніша.', no: 'Fra nå av er musikken lavere og bilen saktere.' },
          { who: 'storesoster', en: 'We will remind you, Dad!', uk: 'Ми тобі нагадуватимемо, тату!', no: 'Vi skal minne deg på det, pappa!' }
        ]}
      ],
      vocab: [
        ['yesterday', 'учора', 'i går'], ['was driving', 'їхав (тривало)', 'kjørte'], ['listening', 'слухаючи', 'hørte på'], ['loud', 'гучний', 'høy'], ['singing along', 'підспівуючи', 'sang med'],
        ['while', 'поки', 'mens'], ['speed sign', 'знак обмеження швидкості', 'fartsskilt'], ['flash', 'спалах', 'blink'], ['speed camera', 'камера швидкості', 'fotoboks'],
        ['happened', 'сталося', 'skjedde'], ['zone', 'зона', 'sone'], ['too fast', 'надто швидко', 'for fort'], ['thinking', 'думаючи', 'tenkte'], ['tyres', 'шини', 'dekk'],
        ['slowly', 'повільно', 'sakte'], ['road', 'дорога', 'vei'], ['quieter', 'тихіший', 'lavere'], ['slower', 'повільніший', 'saktere'], ['remind', 'нагадувати', 'minne på']
      ]
    },
    {
      id: 'e25', level: 'B1', category: 'skole', style: 'strip', grammar: 'second-conditional',
      title: 'If I Had More Time…', titleUk: 'Якби в мене було більше часу…', titleNo: 'Hvis jeg hadde mer tid …',
      summaryUk: 'Мрії на уроці в Мортена: If I won a million, I would… — умовний спосіб.', summaryEn: 'Dreams in Morten’s class: If I won a million, I would… — the second conditional.', summaryNo: 'Drømmer i timen til Morten: If I won a million, I would … – andre kondisjonal.',
      cover: 0,
      panels: [
        { art: { bg: 'school', board: 'IF I…', clock: false, chars: [{ id: 'morten', x: 110, mood: 'happy', pose: 'point' }, { id: 'maria', x: 300, mood: 'grin' }] }, lines: [
          { who: 'morten', en: 'Today\'s question: what would you do if you won a million?', uk: 'Питання дня: що б ви зробили, якби виграли мільйон?', no: 'Dagens spørsmål: Hva ville du gjort hvis du vant en million?' },
          { who: 'maria', en: 'If I won a million, I would travel around the world.', uk: 'Якби я виграла мільйон, я б подорожувала світом.', no: 'Hvis jeg vant en million, ville jeg reist jorden rundt.' }
        ]},
        { art: { bg: 'school', board: 'IF I…', clock: false, chars: [{ id: 'denys', x: 110, mood: 'grin', pose: 'hold' }, { id: 'morten', x: 300, mood: 'happy' }] }, lines: [
          { who: 'denys', en: 'I would buy a small house by the sea.', uk: 'А я б купив невеликий будиночок біля моря.', no: 'Jeg ville kjøpt et lite hus ved sjøen.' },
          { who: 'morten', en: 'And if you lived by the sea, would you still work?', uk: 'А якби ти жив біля моря, ти б однаково працював?', no: 'Og hvis du bodde ved sjøen, ville du fortsatt jobbet?' }
        ]},
        { art: { bg: 'school', board: 'IF I…', clock: false, chars: [{ id: 'denys', x: 110, mood: 'grin', pose: 'cheer' }, { id: 'maria', x: 300, mood: 'happy', pose: 'point' }] }, lines: [
          { who: 'denys', en: 'Yes, but only three days a week!', uk: 'Так, але лише три дні на тиждень!', no: 'Ja, men bare tre dager i uka!' },
          { who: 'maria', en: 'If I had more free time, I would learn to play the piano.', uk: 'Якби в мене було більше вільного часу, я б навчилася грати на піаніно.', no: 'Hvis jeg hadde mer fritid, ville jeg lært å spille piano.' }
        ]},
        { art: { bg: 'school', board: 'IF I WERE YOU…', clock: false, chars: [{ id: 'morten', x: 110, mood: 'grin', pose: 'point' }, { id: 'denys', x: 300, mood: 'surprised' }] }, lines: [
          { who: 'morten', en: 'If I were you, I would start today. Ten minutes a day is enough.', uk: 'На твоєму місці я б почав сьогодні. Десяти хвилин на день досить.', no: 'Hvis jeg var deg, ville jeg begynt i dag. Ti minutter om dagen er nok.' },
          { who: 'denys', en: 'That is good advice. It works for languages too.', uk: 'Слушна порада. Для мов це теж працює.', no: 'Det er et godt råd. Det fungerer for språk også.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'maria', x: 170, mood: 'happy', pose: 'hold' }], props: [{ type: 'computer', x: 280, y: 240 }] }, lines: [
          { who: 'narrator', en: 'That evening Maria found a piano course online.', uk: 'Того вечора Марія знайшла онлайн-курс гри на піаніно.', no: 'Den kvelden fant Maria et pianokurs på nett.' },
          { who: 'maria', en: 'If I practise every day, I will be ready by summer.', uk: 'Якщо займатимуся щодня, то до літа буду готова.', no: 'Hvis jeg øver hver dag, er jeg klar til sommeren.' }
        ]},
        { art: { bg: 'school', board: 'SMALL STEPS', clock: false, chars: [{ id: 'maria', x: 90, mood: 'grin', pose: 'cheer' }, { id: 'denys', x: 210, mood: 'happy' }, { id: 'morten', x: 330, mood: 'happy', pose: 'wave' }] }, lines: [
          { who: 'maria', en: 'Imagine what we could do if we didn\'t give up!', uk: 'Уявіть, що ми могли б зробити, якби не здавалися!', no: 'Tenk hva vi kunne gjort hvis vi ikke ga opp!' },
          { who: 'morten', en: 'Exactly. Small steps every day.', uk: 'Саме так. Маленькі кроки щодня.', no: 'Nettopp. Små skritt hver dag.' }
        ]}
      ],
      vocab: [
        ['what would you do', 'що б ти зробив', 'hva ville du gjort'], ['if', 'якщо, якби', 'hvis'], ['won', 'виграв', 'vant'], ['million', 'мільйон', 'million'],
        ['travel', 'подорожувати', 'reise'], ['around the world', 'світом, навколо світу', 'jorden rundt'], ['would buy', 'купив би', 'ville kjøpt'], ['by the sea', 'біля моря', 'ved sjøen'],
        ['lived', 'жив', 'bodde'], ['still', 'однаково, все ще', 'fortsatt'], ['free time', 'вільний час', 'fritid'], ['piano', 'піаніно', 'piano'], ['if I were you', 'на твоєму місці', 'hvis jeg var deg'],
        ['advice', 'порада', 'råd'], ['online', 'в інтернеті', 'på nett'], ['practise', 'займатися, тренуватися', 'øve'], ['imagine', 'уявіть', 'tenk'], ['give up', 'здаватися', 'gi opp'], ['steps', 'кроки', 'skritt']
      ]
    },
    {
      id: 'e26', level: 'B1', category: 'hverdag', style: 'strip', grammar: 'must',
      title: 'The Lost Phone', titleUk: 'Загублений телефон', titleNo: 'Den mistede telefonen',
      summaryUk: 'Нора залишила телефон в автобусі: must, have to, mustn’t, should.', summaryEn: 'Nora left her phone on the bus: must, have to, mustn’t, should.', summaryNo: 'Nora glemte telefonen på bussen: must, have to, mustn’t, should.',
      cover: 3,
      panels: [
        { art: { bg: 'street', chars: [{ id: 'nora', x: 110, mood: 'surprised' }, { id: 'mamma', x: 300, mood: 'normal', pose: 'point' }], props: [{ type: 'busstop', x: 210 }] }, lines: [
          { who: 'nora', en: 'Mum, I can\'t find my phone anywhere!', uk: 'Мамо, я ніде не можу знайти телефон!', no: 'Mamma, jeg finner ikke telefonen min noe sted!' },
          { who: 'mamma', en: 'Don\'t panic. You should think about where you used it last.', uk: 'Не панікуй. Подумай, де ти користувалася ним востаннє.', no: 'Ikke få panikk. Du bør tenke på hvor du brukte den sist.' }
        ]},
        { art: { bg: 'bus', sign: '24 SENTRUM', chars: [{ id: 'nora', x: 110, mood: 'sad', pose: 'point' }, { id: 'mamma', x: 300, mood: 'happy' }] }, lines: [
          { who: 'nora', en: 'I think I left it on the bus.', uk: 'Здається, я залишила його в автобусі.', no: 'Jeg tror jeg glemte den på bussen.' },
          { who: 'mamma', en: 'Then we must call the bus company right away.', uk: 'Тоді треба негайно подзвонити в автобусну компанію.', no: 'Da må vi ringe busselskapet med en gang.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'mamma', x: 110, mood: 'happy', pose: 'hold' }, { id: 'nora', x: 300, mood: 'sad' }], props: [{ type: 'phone', x: 145, y: 205, front: true }] }, lines: [
          { who: 'mamma', en: 'They say you have to come to the office and show your ID.', uk: 'Кажуть, тобі треба прийти в офіс і показати посвідчення.', no: 'De sier at du må komme til kontoret og vise legitimasjon.' },
          { who: 'nora', en: 'Do I have to go today?', uk: 'Мені треба йти сьогодні?', no: 'Må jeg dra i dag?' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'kasserer', x: 110, mood: 'happy', pose: 'hold' }, { id: 'nora', x: 300, mood: 'grin', pose: 'cheer' }], props: [{ type: 'counter', x: 110 }, { type: 'phone', x: 150, y: 205, front: true }] }, lines: [
          { who: 'kasserer', en: 'Is this your phone? You must sign here.', uk: 'Це ваш телефон? Вам треба розписатися тут.', no: 'Er dette telefonen din? Du må skrive under her.' },
          { who: 'nora', en: 'Yes, it is mine! Thank you so much!', uk: 'Так, це мій! Щиро дякую!', no: 'Ja, den er min! Tusen takk!' }
        ]},
        { art: { bg: 'street', chars: [{ id: 'mamma', x: 110, mood: 'normal', pose: 'point' }, { id: 'nora', x: 300, mood: 'happy', pose: 'hold' }], props: [{ type: 'phone', x: 335, y: 205, front: true }] }, lines: [
          { who: 'mamma', en: 'You mustn\'t leave it on the seat again.', uk: 'Більше не залишай його на сидінні.', no: 'Du må ikke glemme den på setet igjen.' },
          { who: 'nora', en: 'I know. I should put it in my bag.', uk: 'Знаю. Мені варто класти його в сумку.', no: 'Jeg vet. Jeg burde legge den i veska.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'nora', x: 130, mood: 'grin', pose: 'hold' }, { id: 'pus', x: 300 }], props: [{ type: 'sofa', x: 300 }, { type: 'phone', x: 165, y: 205, front: true }] }, lines: [
          { who: 'nora', en: 'From now on, I have to check my pockets before I get off.', uk: 'Відтепер я мушу перевіряти кишені, перш ніж виходити.', no: 'Fra nå av må jeg sjekke lommene før jeg går av.' },
          { who: 'narrator', en: 'And Pus? He doesn\'t have to worry about phones at all.', uk: 'А Пус? Йому взагалі не треба перейматися телефонами.', no: 'Og Pus? Han trenger ikke å bekymre seg for telefoner i det hele tatt.' }
        ]}
      ],
      vocab: [
        ['find', 'знайти', 'finne'], ['anywhere', 'ніде, будь-де', 'noe sted'], ['panic', 'панікувати', 'få panikk'], ['should', 'варто, слід', 'bør'], ['used', 'користувався', 'brukte'],
        ['last', 'востаннє', 'sist'], ['left', 'залишив', 'glemte'], ['must', 'мусити, треба', 'må'], ['call', 'дзвонити', 'ringe'], ['right away', 'негайно', 'med en gang'],
        ['have to', 'треба, мусиш', 'må'], ['office', 'офіс', 'kontor'], ['ID', 'посвідчення', 'legitimasjon'], ['sign', 'розписатися', 'skrive under'], ['mine', 'мій (без іменника)', 'min'],
        ['mustn\'t', 'не можна', 'må ikke'], ['seat', 'сидіння', 'sete'], ['pockets', 'кишені', 'lommer'], ['worry', 'хвилюватися', 'bekymre seg']
      ]
    },
    {
      id: 'e27', level: 'B1', category: 'familie', style: 'strip', grammar: 'will',
      title: 'Moving to a New Flat', titleUk: 'Переїзд у нову квартиру', titleNo: 'Flytting til ny leilighet',
      summaryUk: 'Марія й Денис переїжджають: will (обіцянки, рішення зараз) і going to (плани).', summaryEn: 'Maria and Denys move house: will for promises and quick decisions, going to for plans.', summaryNo: 'Maria og Denys flytter: will om løfter og raske beslutninger, going to om planer.',
      cover: 0,
      panels: [
        { art: { bg: 'home', chars: [{ id: 'maria', x: 110, mood: 'grin', pose: 'hold' }, { id: 'denys', x: 300, mood: 'grin', pose: 'cheer' }], props: [{ type: 'keys', x: 150, y: 200, front: true }, { type: 'boxes', x: 220 }] }, lines: [
          { who: 'maria', en: 'Here are the keys! We are going to live here from today.', uk: 'Ось ключі! Віднині ми житимемо тут.', no: 'Her er nøklene! Fra i dag skal vi bo her.' },
          { who: 'denys', en: 'Great! I will carry the heavy boxes.', uk: 'Чудово! Я понесу важкі коробки.', no: 'Flott! Jeg bærer de tunge eskene.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'denys', x: 110, mood: 'surprised', pose: 'hold' }, { id: 'maria', x: 300, mood: 'happy', pose: 'point' }], props: [{ type: 'boxes', x: 150, y: 250, front: true }] }, lines: [
          { who: 'denys', en: 'This box is really heavy. What is in it?', uk: 'Ця коробка дуже важка. Що в ній?', no: 'Denne esken er skikkelig tung. Hva er det i den?' },
          { who: 'maria', en: 'My books! Wait, I will help you.', uk: 'Мої книжки! Зачекай, я тобі допоможу.', no: 'Bøkene mine! Vent, jeg hjelper deg.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'maria', x: 110, mood: 'happy', pose: 'point' }, { id: 'denys', x: 300, mood: 'normal' }], props: [{ type: 'sofa', x: 210 }, { type: 'plant', x: 360 }] }, lines: [
          { who: 'maria', en: 'I think the sofa will look better by the window.', uk: 'Думаю, диван краще виглядатиме біля вікна.', no: 'Jeg tror sofaen vil se bedre ut ved vinduet.' },
          { who: 'denys', en: 'OK, I will move it after lunch, I promise.', uk: 'Гаразд, я пересуну його після обіду, обіцяю.', no: 'Ok, jeg skal flytte den etter lunsj, jeg lover.' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'maria', x: 110, mood: 'surprised' }, { id: 'denys', x: 300, mood: 'happy', pose: 'hold' }], props: [{ type: 'phone', x: 335, y: 205, front: true }, { type: 'boxes', x: 210 }] }, lines: [
          { who: 'maria', en: 'Oh no, the fridge isn\'t working!', uk: 'Ой ні, холодильник не працює!', no: 'Å nei, kjøleskapet virker ikke!' },
          { who: 'denys', en: 'Don\'t worry. I will call the landlord now.', uk: 'Не хвилюйся. Я зараз подзвоню власникові квартири.', no: 'Ikke tenk på det. Jeg ringer utleieren nå.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'alina', x: 110, mood: 'happy', pose: 'hold' }, { id: 'maria', x: 300, mood: 'grin', pose: 'wave' }], props: [{ type: 'cake', x: 150, y: 215, front: true }] }, lines: [
          { who: 'alina', en: 'Welcome to the building! I\'m your new neighbour.', uk: 'Ласкаво просимо в наш будинок! Я ваша нова сусідка.', no: 'Velkommen til bygget! Jeg er den nye naboen deres.' },
          { who: 'maria', en: 'How kind! Will you have some tea with us?', uk: 'Як мило! Вип’єте з нами чаю?', no: 'Så hyggelig! Vil du ta en kopp te med oss?' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'maria', x: 90, mood: 'happy' }, { id: 'denys', x: 210, mood: 'grin', pose: 'cheer' }, { id: 'alina', x: 330, mood: 'happy', pose: 'point' }], props: [{ type: 'balloons', x: 360 }] }, lines: [
          { who: 'denys', en: 'Next month we are going to have a big housewarming party.', uk: 'Наступного місяця ми влаштуємо велике новосілля.', no: 'Neste måned skal vi ha en stor innflytningsfest.' },
          { who: 'alina', en: 'I will bring a cake!', uk: 'Я принесу торт!', no: 'Jeg tar med kake!' }
        ]}
      ],
      vocab: [
        ['keys', 'ключі', 'nøkler'], ['going to', 'збиратися (план)', 'skal'], ['live', 'жити', 'bo'], ['will', 'допоміжне слово майбутнього', 'vil, skal'], ['carry', 'нести', 'bære'],
        ['heavy', 'важкий', 'tung'], ['boxes', 'коробки', 'esker'], ['wait', 'зачекай', 'vent'], ['help', 'допомагати', 'hjelpe'], ['look better', 'виглядати краще', 'se bedre ut'],
        ['window', 'вікно', 'vindu'], ['move', 'пересувати', 'flytte'], ['promise', 'обіцяти', 'love'], ['fridge', 'холодильник', 'kjøleskap'], ['landlord', 'власник житла', 'utleier'],
        ['neighbour', 'сусід', 'nabo'], ['building', 'будинок', 'bygg'], ['kind', 'добрий, милий', 'hyggelig'], ['housewarming party', 'новосілля', 'innflytningsfest'], ['bring', 'принести', 'ta med']
      ]
    },
    {
      id: 'e28', level: 'B1', category: 'jobb', style: 'strip', grammar: 'passive',
      title: 'A New Job in Norway', titleUk: 'Нова робота в Норвегії', titleNo: 'En ny jobb i Norge',
      summaryUk: 'Перший день Муси на новій роботі: пасив (was built, is used) і who / which / that.', summaryEn: 'Musa’s first day at a new job: the passive (was built, is used) and who / which / that.', summaryNo: 'Musas første dag i ny jobb: passiv (was built, is used) og who / which / that.',
      cover: 2,
      panels: [
        { art: { bg: 'office', chars: [{ id: 'alina', x: 110, mood: 'happy', pose: 'wave' }, { id: 'musa', x: 300, mood: 'grin', s: 0.9 }], props: [{ type: 'officedesk', x: 210 }] }, lines: [
          { who: 'alina', en: 'Welcome! This is the office where you will work.', uk: 'Ласкаво просимо! Це офіс, де ти працюватимеш.', no: 'Velkommen! Dette er kontoret der du skal jobbe.' },
          { who: 'musa', en: 'Thank you! The building was built in 1900, wasn\'t it?', uk: 'Дякую! Будинок збудували 1900 року, так?', no: 'Takk! Bygget ble bygget i 1900, ikke sant?' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'alina', x: 110, mood: 'happy', pose: 'point' }, { id: 'musa', x: 300, mood: 'happy', pose: 'hold', s: 0.9 }], props: [{ type: 'docs', x: 330, y: 215, front: true }] }, lines: [
          { who: 'alina', en: 'Yes. These documents must be signed today.', uk: 'Так. Ці документи треба підписати сьогодні.', no: 'Ja. Disse dokumentene må skrives under i dag.' },
          { who: 'musa', en: 'No problem. Who is the person that checks them?', uk: 'Без проблем. А хто та людина, яка їх перевіряє?', no: 'Ikke noe problem. Hvem er personen som sjekker dem?' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'alina', x: 110, mood: 'happy' }, { id: 'morten', x: 300, mood: 'grin', pose: 'wave' }] }, lines: [
          { who: 'alina', en: 'Morten, who teaches Norwegian to new staff, checks everything.', uk: 'Мортен, який навчає новий персонал норвезької, перевіряє все.', no: 'Morten, som lærer nye ansatte norsk, sjekker alt.' },
          { who: 'morten', en: 'Hello, Musa! The course that starts on Monday is free.', uk: 'Привіт, Мусо! Курс, що починається в понеділок, безкоштовний.', no: 'Hei, Musa! Kurset som starter på mandag, er gratis.' }
        ]},
        { art: { bg: 'school', board: 'NORSK A1', clock: false, chars: [{ id: 'morten', x: 110, mood: 'happy', pose: 'point' }, { id: 'musa', x: 300, mood: 'surprised', pose: 'hold', s: 0.9 }], props: [{ type: 'book', x: 335, y: 215, front: true }] }, lines: [
          { who: 'morten', en: 'All lessons are taught in small groups.', uk: 'Усі уроки проводять у малих групах.', no: 'Alle timene undervises i små grupper.' },
          { who: 'musa', en: 'Great. The book which you gave me looks interesting.', uk: 'Чудово. Книжка, яку ви мені дали, виглядає цікаво.', no: 'Flott. Boka som du ga meg, ser interessant ut.' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'musa', x: 110, mood: 'grin', pose: 'hold', s: 0.9 }, { id: 'alina', x: 300, mood: 'happy' }], props: [{ type: 'mug', x: 145, y: 205, front: true }] }, lines: [
          { who: 'musa', en: 'Was this coffee machine made in Italy?', uk: 'Цю кавомашину зробили в Італії?', no: 'Ble denne kaffemaskinen laget i Italia?' },
          { who: 'alina', en: 'Yes! It is used by everyone who works here.', uk: 'Так! Нею користуються всі, хто тут працює.', no: 'Ja! Den brukes av alle som jobber her.' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'musa', x: 90, mood: 'grin', pose: 'cheer', s: 0.9 }, { id: 'morten', x: 210, mood: 'happy' }, { id: 'alina', x: 330, mood: 'happy', pose: 'wave' }], props: [{ type: 'plant', x: 380 }] }, lines: [
          { who: 'musa', en: 'I think I have found a job that I will love.', uk: 'Здається, я знайшов роботу, яку любитиму.', no: 'Jeg tror jeg har funnet en jobb som jeg kommer til å elske.' },
          { who: 'morten', en: 'And your Norwegian will be improved step by step!', uk: 'А твоя норвезька крок за кроком ставатиме кращою!', no: 'Og norsken din blir bedre steg for steg!' }
        ]}
      ],
      vocab: [
        ['office', 'офіс', 'kontor'], ['where', 'де (у якому)', 'der'], ['was built', 'був збудований', 'ble bygget'], ['documents', 'документи', 'dokumenter'], ['must be signed', 'мають бути підписані', 'må skrives under'],
        ['person', 'людина', 'person'], ['who', 'який (про людей)', 'som'], ['teaches', 'навчає', 'lærer'], ['staff', 'персонал', 'ansatte'], ['that', 'який, що', 'som'],
        ['course', 'курс', 'kurs'], ['free', 'безкоштовний', 'gratis'], ['are taught', 'викладаються', 'undervises'], ['groups', 'групи', 'grupper'], ['which', 'який (про речі)', 'som'],
        ['interesting', 'цікавий', 'interessant'], ['made in', 'зроблений у', 'laget i'], ['is used by', 'використовується (кимось)', 'brukes av'], ['improved', 'покращений', 'forbedret'], ['step by step', 'крок за кроком', 'steg for steg']
      ]
    }
  );
})();
