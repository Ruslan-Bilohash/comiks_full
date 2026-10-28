/* Комікс·Lab — 🎮 каталог ігор, зроблених у тій самій майстерні.
 *
 * Гра живе окремо (bilohash.com/games/too_much/) і нічого не знає про
 * застосунок: у неї свій рушій, свої моделі й своя сторінка. Тут — лише
 * паспорт: адреса, знімки, факти й той текст, який гра показує сама.
 *
 * Чому склад бійців, арени й кампанія скопійовані з гри, а не описані
 * заново: переказ розійшовся б із грою з першою ж правкою, і сторінка
 * обіцяла б те, чого немає. Назви взяті дослівно з FIGHTER_TEXT, ARENA_TEXT
 * і CAMP_TEXT самої гри — трьома мовами, якими вона говорить.
 *
 * Мови гри — українська, англійська, норвезька (?lang=uk|en|no). Для решти
 * мов інтерфейсу відкриваємо англійською: це єдине, що гра зрозуміє.
 *
 * Прозу про гру (заголовки, опис, переваги) тримає assets/games.js — звідти
 * її забирає переклад на вісім мов. Тут лишаються тільки факти.
 */
window.KOMIKS_GAMES = [
  {
    id: 'duel3d',
    url: 'https://bilohash.com/games/too_much/',
    emoji: '🥊',
    color: '#b71c1c',
    /* Файтинг із мультиплікаційними ударами, без крові — але це все одно
       бійка, тож 12+. Комікси й тести лишаються без насильства зовсім. */
    age: 12,
    size: 14,                    // МБ усієї гри разом із моделями
    engine: 'Three.js r160 · WebGL',
    langs: ['uk', 'en', 'no'],
    live: '2026-10-08',
    /* Гра зберігає проходження в браузері: акаунта вона не просить і
       api/config.php на цьому хостингу не налаштований. */
    account: false,
    shots: ['duel3d-1-meny', 'duel3d-2-velg', 'duel3d-3-kamp', 'duel3d-4-historie'],

    name: { uk: 'Двобій 3D', en: 'Duel 3D', no: 'Duell 3D' },
    sub: { uk: '3D-бій на двох', en: '3D two-player fighting', no: '3D-kamp for to' },

    /* Підказка керування — дослівно з гри, щоб сторінка не вчила іншим
       кнопкам, ніж ті, що справді працюють. */
    keys: {
      uk: 'Телефон: джойстик під лівим пальцем (вгору — стрибок, вниз — блок), удари праворуч. Клавіатура: A/D хід, W стрибок, S блок, J рука, K нога, L важкий, F сальто, U спец, I супер. Геймпад теж працює.',
      en: 'Phone: joystick under your left thumb (up — jump, down — block), attacks on the right. Keyboard: A/D move, W jump, S block, J punch, K kick, L heavy, F flip, U special, I super. Gamepads work too.',
      no: 'Mobil: styrespak under venstre tommel (opp — hopp, ned — blokk), angrep til høyre. Tastatur: A/D gå, W hopp, S blokk, J slag, K spark, L tungt, F salto, U spesial, I super. Spillkontroller fungerer også.',
    },

    modes: [
      { id: 'camp', emoji: '🗺️', uk: 'Проходження', en: 'Story mode', no: 'Historiemodus' },
      { id: 'cpu', emoji: '🤖', uk: 'Проти комп’ютера', en: 'Versus computer', no: 'Mot datamaskinen' },
      { id: 'local', emoji: '👥', uk: 'Удвох тут', en: 'Two players here', no: 'To spillere her' },
    ],

    arenas: [
      { id: 'zala', uk: 'Бойова світлиця', en: 'Training Hall', no: 'Treningssalen' },
      { id: 'tron', uk: 'Тронна зала', en: 'Throne Room', no: 'Tronsalen' },
      { id: 'shynok', uk: 'Шинок', en: 'Tavern', no: 'Vertshuset' },
      { id: 'pidval', uk: 'Катакомби', en: 'Catacombs', no: 'Katakombene' },
      { id: 'kurhan', uk: 'Курган на заході сонця', en: 'Burial Mound at Sunset', no: 'Gravhaugen i solnedgang' },
      { id: 'porohy', uk: 'Скелі під грозою', en: 'Cliffs in the Storm', no: 'Klippene i uværet' },
      { id: 'kuznia', uk: 'Нічна цитадель', en: 'Night Citadel', no: 'Nattcitadellet' },
    ],

    /* [імʼя, хто це, спецудар, що робить, супер, що робить] */
    roster: [
      { id: 'taras',
        uk: ['Тарас', 'Булат, козак-характерник', 'Ривок', 'Стрімкий наскок з ударом', 'Вовчий шквал', 'Серія з п’яти ударів, від якої не втекти'],
        en: ['Taras', 'Bulat, Cossack mystic', 'Dash', 'A swift lunge with a strike', 'Wolf Squall', 'Five unstoppable blows in a row'],
        no: ['Taras', 'Bulat, kosakk-mystiker', 'Utfall', 'Et lynraskt utfall med slag', 'Ulvekast', 'Fem slag på rad som ikke kan unngås'] },
      { id: 'olena',
        uk: ['Олена', 'Буря, вулична чаклунка', 'Вогняна куля', 'Кидає полум’я на відстань', 'Блискавка Перуна', 'Удар блискавки з неба'],
        en: ['Olena', 'Storm, street sorceress', 'Fireball', 'Hurls fire from a distance', 'Perun’s Lightning', 'Lightning strikes from the sky'],
        no: ['Olena', 'Storm, gateheks', 'Ildkule', 'Kaster ild på avstand', 'Peruns lyn', 'Lyn slår ned fra himmelen'] },
      { id: 'baron',
        uk: ['Барон', 'Залізний легіонер', 'Таран', 'Плечем уперед, збиває з ніг', 'Землетрус', 'Удар об землю, хвиля валить суперника'],
        en: ['Baron', 'Iron legionnaire', 'Ram', 'Shoulder charge that knocks down', 'Earthquake', 'Slams the ground, the wave knocks the foe down'],
        no: ['Baron', 'Jernlegionær', 'Rambukk', 'Skulderstøt som slår ned', 'Jordskjelv', 'Slår i bakken, bølgen velter motstanderen'] },
      { id: 'voron',
        uk: ['Ворон', 'Тіньовий убивця', 'Кинджал', 'Кидає ніж у суперника', 'Тіньовий клинок', 'Зникає в диму й б’є зі спини'],
        en: ['Voron', 'Shadow assassin', 'Dagger', 'Throws a knife at the opponent', 'Shadow Blade', 'Vanishes in smoke and strikes from behind'],
        no: ['Voron', 'Skyggeleiemorder', 'Dolk', 'Kaster en kniv mot motstanderen', 'Skyggeblad', 'Forsvinner i røyk og slår bakfra'] },
      { id: 'otaman',
        uk: ['Отаман', 'Сивий отаман із шаблею', 'Козацький наскок', 'Влітає плечем, збиває з ніг', 'Шабельний вихор', 'П’ять ударів шаблею поспіль'],
        en: ['Otaman', 'Grey ataman with a sabre', 'Cossack Charge', 'Crashes in with a shoulder, knocks down', 'Sabre Whirlwind', 'Five sabre strikes in a row'],
        no: ['Otaman', 'Gråhåret ataman med sabel', 'Kosakkangrep', 'Braser inn med skulderen og slår ned', 'Sabelvirvel', 'Fem sabelhugg på rad'] },
      { id: 'mavka',
        uk: ['Мавка', 'Лісова відьма', 'Блудний вогник', 'Зелений вогонь летить до суперника', 'Гнів лісу', 'Зелені блискавки з неба'],
        en: ['Mavka', 'Forest witch', 'Will-o’-the-wisp', 'Green fire flies at the opponent', 'Wrath of the Forest', 'Green lightning from the sky'],
        no: ['Mavka', 'Skogheks', 'Lyktemann', 'Grønn ild flyr mot motstanderen', 'Skogens vrede', 'Grønne lyn fra himmelen'] },
      { id: 'lytsar',
        uk: ['Чорний лицар', 'Володар цитаделі, фінальний бос', 'Темний спис', 'Метає спис через усю арену', 'Темний розлам', 'Земля розколюється хвилею'],
        en: ['Black Knight', 'Lord of the citadel, final boss', 'Dark Spear', 'Throws a spear across the arena', 'Dark Rift', 'The ground splits in a wave'],
        no: ['Den svarte ridderen', 'Herre over citadellet, siste sjef', 'Mørkt spyd', 'Kaster et spyd over hele arenaen', 'Mørk revne', 'Bakken sprekker i en bølge'] },
    ],

    /* Сюжет кампанії: сім етапів, по парі [назва, що відбувається]. */
    camp: {
      uk: [
        ['Перший поєдинок', 'Про Турнір семи арен ходять легенди: хто переможе всіх чемпіонів, той кине виклик Чорному лицарю. У світлиці на тебе вже чекає Олена — вона перевірить, чи ти взагалі вмієш битися.'],
        ['Курган на заході', 'Біля старого кургану Мавка стереже степ. Вона швидка й кидається зеленим вогнем. Тримай дистанцію коротко й не давай їй чаклувати.'],
        ['Бійка в шинку', 'Тарас «Булат» не любить, коли хтось бере його чарку. У тісному шинку місця мало — блокуй і відповідай серіями.'],
        ['Катакомби', 'Під містом, серед смолоскипів і ланцюгів, ховається Ворон. Він зникає в диму й б’є зі спини. Слухай кроки.'],
        ['Гроза над порогами', 'Залізний легіонер Барон важкий, але кожен його удар збиває з ніг. Ухиляйся сальто і бий, коли він промахнувся.'],
        ['Тронна зала', 'Сивий Отаман охороняє вхід до цитаделі. Колись він сам виграв турнір. Покажи йому, що виросла нова зміна.'],
        ['Цитадель Чорного лицаря', 'Брама кузні розпечена до червоного. Чорний лицар чекає. У нього більше сил, ніж у будь-кого, — переможи його, і турнір твій.'],
      ],
      en: [
        ['First Duel', 'Legends tell of the Tournament of Seven Arenas: whoever defeats every champion may challenge the Black Knight. Olena is waiting for you in the hall — she will test whether you can fight at all.'],
        ['Mound at Sunset', 'Mavka guards the steppe by the old burial mound. She is fast and throws green fire. Stay close and don’t let her cast spells.'],
        ['Tavern Brawl', 'Taras “Bulat” hates it when someone takes his drink. The tavern is cramped — block and answer with combos.'],
        ['Catacombs', 'Beneath the city, among torches and chains, Voron is hiding. He vanishes in smoke and strikes from behind. Listen for footsteps.'],
        ['Storm over the Rapids', 'Baron, the iron legionnaire, is slow, but every blow knocks you down. Flip away and strike when he misses.'],
        ['Throne Room', 'The grey Otaman guards the citadel gate. He once won the tournament himself. Show him a new generation has risen.'],
        ['Citadel of the Black Knight', 'The forge gate glows red-hot. The Black Knight is waiting. He is stronger than anyone — defeat him and the tournament is yours.'],
      ],
      no: [
        ['Den første duellen', 'Det går sagn om Turneringen med sju arenaer: den som slår alle mesterne, kan utfordre Den svarte ridderen. Olena venter i salen — hun vil teste om du i det hele tatt kan slåss.'],
        ['Gravhaugen i solnedgang', 'Mavka vokter steppen ved den gamle gravhaugen. Hun er rask og kaster grønn ild. Hold deg tett innpå og ikke la henne trylle.'],
        ['Slagsmål på vertshuset', 'Taras «Bulat» liker ikke at noen tar glasset hans. Det er trangt på vertshuset — blokker og svar med kombinasjoner.'],
        ['Katakombene', 'Under byen, blant fakler og lenker, gjemmer Voron seg. Han forsvinner i røyk og slår bakfra. Lytt etter skritt.'],
        ['Uvær over strykene', 'Jernlegionæren Baron er tung, men hvert slag slår deg ned. Hopp unna med salto og slå når han bommer.'],
        ['Tronsalen', 'Den gråhårede Otaman vokter porten til citadellet. Han vant selv turneringen en gang. Vis ham at en ny generasjon har vokst opp.'],
        ['Den svarte ridderens citadell', 'Smieporten gløder rødt. Den svarte ridderen venter. Han er sterkere enn noen — slå ham, og turneringen er din.'],
      ],
    },
  },
];
