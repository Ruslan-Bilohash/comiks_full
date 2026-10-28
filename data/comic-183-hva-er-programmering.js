window.COMICS = window.COMICS || [];

/* p183 — A1, «Програмування»: що таке команда й програма. Робот Robo робить лише те,
   що йому точно сказали, тому «зроби піцу» він не розуміє. Стиль кадрів — 'code'. */
COMICS.push({
  id: "p183",
  level: "A1",
  category: "koding",
  style: "code",
  title: "Hva er programmering?",
  titleUk: "Що таке програмування?",
  titleEn: "What is coding?",
  summaryUk: "У школі з’явився робот Робо. Він виконує лише точні команди, і діти дізнаються, що програма — це команди в правильному порядку.",
  summaryEn: "The school has a robot called Robo. He only follows exact commands, and the children learn that a program is commands in the right order.",
  summaryNo: "Skolen har fått roboten Robo. Han gjør bare nøyaktige kommandoer, og barna lærer at et program er kommandoer i riktig rekkefølge.",
  cover: 0,

  panels: [
    { art: { bg: "lab", code: ["hei()", "gå fram", "snu høyre"], chars: [{ id: "leo", x: 80, mood: "surprised", pose: "point" }, { id: "nora", x: 175, mood: "happy", pose: "wave" }, { id: "robo", x: 305, mood: "happy", pose: "wave", flip: true }] }, lines: [
      { who: "leo", no: "Se, Nora! Skolen har fått en robot.", uk: "Дивись, Норо! У школі з’явився робот.", en: "Look, Nora! The school has got a robot." },
      { who: "nora", no: "Hei, robot! Hva heter du?", uk: "Привіт, роботе! Як тебе звати?", en: "Hi, robot! What is your name?" },
      { who: "robo", no: "Hei! Jeg heter Robo. Jeg gjør det dere sier.", uk: "Привіт! Мене звати Робо. Я роблю те, що ви кажете.", en: "Hi! My name is Robo. I do what you tell me." }
    ]},
    { art: { bg: "lab", code: ["gå", "snu", "stopp"], chars: [{ id: "laerer", x: 95, mood: "happy", pose: "point" }, { id: "leo", x: 215, mood: "normal" }, { id: "robo", x: 320, mood: "normal", flip: true }] }, lines: [
      { who: "laerer", no: "Robo forstår bare kommandoer. Det kaller vi programmering.", uk: "Робо розуміє лише команди. Це ми називаємо програмуванням.", en: "Robo only understands commands. We call that programming." },
      { who: "leo", no: "Hva er en kommando?", uk: "Що таке команда?", en: "What is a command?" },
      { who: "laerer", no: "En kommando er en kort beskjed, for eksempel «gå» eller «snu».", uk: "Команда — це коротке доручення, наприклад «іди» або «повернись».", en: "A command is a short instruction, for example “walk” or “turn”." }
    ]},
    { art: { bg: "lab", code: ["gå(2)", "# to skritt fram"], chars: [{ id: "nora", x: 95, mood: "grin", pose: "point" }, { id: "robo", x: 280, mood: "happy", pose: "walk", flip: true }], props: [{ type: "codecard", x: 190, y: 120, text: "gå 2 skritt" }] }, lines: [
      { who: "nora", no: "Robo, gå to skritt fram!", uk: "Робо, зроби два кроки вперед!", en: "Robo, take two steps forward!" },
      { who: "robo", no: "Går. Ett, to. Ferdig!", uk: "Іду. Один, два. Готово!", en: "Walking. One, two. Done!" }
    ]},
    { art: { bg: "lab", code: ["lag_pizza()", "# ukjent kommando!"], chars: [{ id: "leo", x: 90, mood: "grin", pose: "point" }, { id: "robo", x: 290, mood: "surprised", pose: "hips", flip: true }], props: [{ type: "codecard", x: 200, y: 120, text: "pizza ???", color: "#b71c1c", ink: "#fff" }] }, lines: [
      { who: "leo", no: "Robo, lag pizza til meg!", uk: "Робо, зроби мені піцу!", en: "Robo, make me a pizza!" },
      { who: "robo", no: "Feil! Jeg kjenner ikke kommandoen «pizza».", uk: "Помилка! Я не знаю команди «піца».", en: "Error! I do not know the command “pizza”." }
    ]},
    { art: { bg: "lab", code: ["1. ta brød", "2. ha på ost", "3. stek", "4. spis"], chars: [{ id: "laerer", x: 100, mood: "happy", pose: "point" }, { id: "nora", x: 300, mood: "surprised", flip: true }] }, lines: [
      { who: "laerer", no: "Et program er mange kommandoer i riktig rekkefølge.", uk: "Програма — це багато команд у правильному порядку.", en: "A program is many commands in the right order." },
      { who: "nora", no: "Så vi må tenke steg for steg!", uk: "Отже, треба думати крок за кроком!", en: "So we have to think step by step!" }
    ]},
    { art: { bg: "lab", code: ["lær(\"koding\")", "skriv(\"Hurra!\")"], chars: [{ id: "leo", x: 90, mood: "happy", pose: "cheer" }, { id: "robo", x: 300, mood: "grin", pose: "wave", flip: true }], props: [{ type: "laptop", x: 195, y: 250 }], fx: "stars" }, lines: [
      { who: "leo", no: "Jeg vil lære å programmere!", uk: "Я хочу навчитися програмувати!", en: "I want to learn to code!" },
      { who: "robo", no: "Og jeg vil lære å lage pizza.", uk: "А я хочу навчитися робити піцу.", en: "And I want to learn to make pizza." }
    ]}
  ],

  tasks: [
    { type: "concept", q: ["Hva er et program?", "Що таке програма?", "What is a program?"], answer: ["Kommandoer i riktig rekkefølge", "Команди в правильному порядку", "Commands in the right order"],
      wrong: [["Et bilde av en robot", "Малюнок робота", "A picture of a robot"], ["En datamaskin", "Комп’ютер", "A computer"], ["Et spill på telefonen", "Гра в телефоні", "A game on the phone"]] },
    { type: "concept", q: ["Hva er en kommando?", "Що таке команда?", "What is a command?"], answer: ["En kort beskjed til datamaskinen", "Коротке доручення комп’ютеру", "A short instruction to the computer"],
      wrong: [["En lang historie", "Довга історія", "A long story"], ["En robot", "Робот", "A robot"], ["En feil", "Помилка", "An error"]] },
    { type: "algo", no: "Robo skal hente ballen", uk: "Робо має принести м’яч", en: "Robo has to fetch the ball",
      steps: [["Gå til ballen", "Підійти до м’яча", "Walk to the ball"], ["Ta ballen", "Взяти м’яч", "Take the ball"], ["Snu deg", "Повернутися", "Turn around"], ["Gå tilbake", "Повернутися назад", "Walk back"]] }
  ],

  vocab: [
    ["en robot", "робот", "a robot"],
    ["programmering", "програмування", "programming, coding"],
    ["å programmere", "програмувати", "to code"],
    ["en kommando", "команда", "a command"],
    ["et program", "програма", "a program"],
    ["en beskjed", "повідомлення, доручення", "a message, an instruction"],
    ["å forstå", "розуміти", "to understand"],
    ["et skritt", "крок", "a step"],
    ["fram", "вперед", "forward"],
    ["å snu", "повертати(ся)", "to turn"],
    ["ferdig", "готово", "done, finished"],
    ["feil", "помилка; неправильно", "error; wrong"],
    ["å kjenne", "знати", "to know"],
    ["en rekkefølge", "порядок, послідовність", "an order, a sequence"],
    ["riktig", "правильний", "right, correct"],
    ["steg for steg", "крок за кроком", "step by step"],
    ["å lære", "вчити(ся)", "to learn"],
    ["for eksempel", "наприклад", "for example"]
  ]
});
