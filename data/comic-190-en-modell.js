window.COMICS = window.COMICS || [];

/* p190 — A2, «Програмування»: моделювання. Модель — спрощена копія справжнього (карта,
   план гри); у програмі речі мають властивості (колір, розмір, швидкість), блок-схема
   показує кроки. Спершу план, потім код. */
COMICS.push({
  id: "p190",
  level: "A2",
  category: "koding",
  style: "code",
  title: "En modell av skolen",
  titleUk: "Модель школи",
  titleEn: "A model of the school",
  summaryUk: "Клас робить модель шкільного подвір’я. Діти дізнаються, що модель — це спрощена копія, що речі в програмі мають властивості, а план малюють до коду.",
  summaryEn: "The class makes a model of the schoolyard. The children learn that a model is a simple copy, that things in a program have properties, and that you draw the plan before the code.",
  summaryNo: "Klassen lager en modell av skolegården. Barna lærer at en modell er en enkel kopi, at ting i et program har egenskaper, og at vi tegner planen før koden.",
  cover: 2,

  panels: [
    { art: { bg: "school", board: "Modell", chars: [{ id: "laerer", x: 95, mood: "happy", pose: "point" }, { id: "nora", x: 300, mood: "surprised", flip: true }] }, lines: [
      { who: "laerer", no: "I dag lager vi en modell av skolegården.", uk: "Сьогодні ми робимо модель шкільного подвір’я.", en: "Today we are making a model of the schoolyard." },
      { who: "nora", no: "Hva er en modell?", uk: "Що таке модель?", en: "What is a model?" }
    ]},
    { art: { bg: "school", board: "Kart", chars: [{ id: "laerer", x: 95, mood: "happy", pose: "point" }, { id: "leo", x: 300, mood: "grin", pose: "point", flip: true }], props: [{ type: "robotgrid", x: 205, y: 270, robot: [0, 3], star: [3, 0], walls: [[1, 1], [2, 2]] }] }, lines: [
      { who: "laerer", no: "En modell er en enkel kopi av noe ekte. Et kart er også en modell.", uk: "Модель — це проста копія чогось справжнього. Мапа — теж модель.", en: "A model is a simple copy of something real. A map is a model too." },
      { who: "leo", no: "Som kartet i et spill!", uk: "Як мапа в грі!", en: "Like the map in a game!" }
    ]},
    { art: { bg: "school", board: "🏫 ⚽ 🚪", chars: [{ id: "nora", x: 90, mood: "happy", pose: "hold" }, { id: "leo", x: 305, mood: "grin", flip: true }] }, lines: [
      { who: "nora", no: "Vi tegner bare det viktige: skolen, porten og fotballbanen.", uk: "Малюємо лише важливе: школу, ворота й футбольне поле.", en: "We only draw the important things: the school, the gate and the football pitch." },
      { who: "leo", no: "Vi trenger ikke tegne hvert eneste blad.", uk: "Не треба малювати кожен листочок.", en: "We do not need to draw every single leaf." }
    ]},
    { art: { bg: "lab", code: ["ball:", "  farge = hvit", "  størrelse = 2", "  fart = 5"], chars: [{ id: "laerer", x: 90, mood: "happy", pose: "point" }, { id: "nora", x: 305, mood: "surprised", flip: true }], props: [{ type: "ball", x: 210, y: 270 }] }, lines: [
      { who: "laerer", no: "I et program beskriver vi ting med egenskaper. En ball har farge, størrelse og fart.", uk: "У програмі ми описуємо речі властивостями. М’яч має колір, розмір і швидкість.", en: "In a program we describe things with properties. A ball has a colour, a size and a speed." },
      { who: "nora", no: "Så ballen er hvit og rask!", uk: "Тож м’яч білий і швидкий!", en: "So the ball is white and fast!" }
    ]},
    { art: { bg: "lab", code: ["START", "  ↓", "regner det? ja → inne", "  nei ↓", "spill fotball"], chars: [{ id: "leo", x: 90, mood: "happy", pose: "point" }, { id: "nora", x: 305, mood: "happy", pose: "point", flip: true }] }, lines: [
      { who: "leo", no: "Og et flytskjema viser hva som skjer, steg for steg.", uk: "А блок-схема показує, що відбувається, крок за кроком.", en: "And a flowchart shows what happens, step by step." },
      { who: "nora", no: "Først tegner vi planen, så skriver vi koden.", uk: "Спершу малюємо план, потім пишемо код.", en: "First we draw the plan, then we write the code." }
    ]},
    { art: { bg: "lab", code: ["leo:", "  sulten = ja", "  glad = ja", "  liker = fotball"], chars: [{ id: "robo", x: 100, mood: "grin", pose: "point" }, { id: "leo", x: 300, mood: "grin", pose: "cheer", flip: true }], fx: "stars" }, lines: [
      { who: "robo", no: "Jeg har laget en modell av Leo: sulten, glad og liker fotball.", uk: "Я зробив модель Лео: голодний, веселий і любить футбол.", en: "I have made a model of Leo: hungry, happy and likes football." },
      { who: "leo", no: "Ha ha! Det stemmer!", uk: "Ха-ха! Усе правильно!", en: "Ha ha! That is right!" }
    ]}
  ],

  tasks: [
    { type: "concept", q: ["Hva er en modell?", "Що таке модель?", "What is a model?"], answer: ["En enkel kopi av noe ekte", "Проста копія чогось справжнього", "A simple copy of something real"],
      wrong: [["En feil i koden", "Помилка в коді", "A bug in the code"], ["Et programmeringsspråk", "Мова програмування", "A programming language"], ["En robot som danser", "Робот, що танцює", "A dancing robot"]] },
    { type: "concept", q: ["Hva er en egenskap til en ball?", "Що є властивістю м’яча?", "What is a property of a ball?"], answer: ["Farge", "Колір", "Colour"],
      wrong: [["Hvis", "Якщо", "If"], ["Gjenta", "Повтори", "Repeat"], ["Feilsøking", "Налагодження", "Debugging"]] },
    { type: "algo", no: "Fra idé til spill", uk: "Від ідеї до гри", en: "From idea to game",
      steps: [["Få en idé", "Придумати ідею", "Get an idea"], ["Tegn en plan", "Намалювати план", "Draw a plan"], ["Skriv koden", "Написати код", "Write the code"], ["Test og rett feil", "Перевірити й виправити помилки", "Test and fix bugs"]] }
  ],

  vocab: [
    ["en modell", "модель", "a model"],
    ["en skolegård", "шкільне подвір’я", "a schoolyard"],
    ["en kopi", "копія", "a copy"],
    ["ekte", "справжній", "real"],
    ["et kart", "мапа", "a map"],
    ["å tegne", "малювати", "to draw"],
    ["en port", "ворота", "a gate"],
    ["en fotballbane", "футбольне поле", "a football pitch"],
    ["et blad", "листок", "a leaf"],
    ["å beskrive", "описувати", "to describe"],
    ["en egenskap", "властивість", "a property"],
    ["en farge", "колір", "a colour"],
    ["en størrelse", "розмір", "a size"],
    ["et flytskjema", "блок-схема", "a flowchart"],
    ["en plan", "план", "a plan"],
    ["en kode", "код", "a code"],
    ["sulten", "голодний", "hungry"],
    ["det stemmer", "це правда", "that is right"]
  ]
});
