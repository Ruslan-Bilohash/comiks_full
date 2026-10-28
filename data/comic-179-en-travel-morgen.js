window.COMICS = window.COMICS || [];

/* p179 — A1: ранкова рутина. Зворотні дієслова (vaske seg, kle på seg) і час (kvart på åtte)
   з’являються там, де їх справді кажуть — коли всі запізнюються на автобус. */
COMICS.push({
  id: "p179",
  level: "A1",
  category: "hverdag",
  title: "En travel morgen",
  titleUk: "Метушливий ранок",
  titleEn: "A busy morning",
  summaryUk: "Лео не хоче вставати, сніданок затягується, а кіт Пус заснув на рюкзаку. Чи встигне Лео на автобус?",
  summaryEn: "Leo does not want to get up, breakfast takes too long, and Pus the cat is asleep on the backpack. Will Leo catch the bus?",
  summaryNo: "Leo vil ikke stå opp, frokosten tar tid, og katten Pus sover på sekken. Rekker Leo bussen?",
  cover: 4,

  panels: [
    { art: { bg: "home", chars: [{ id: "mamma", x: 110, mood: "normal", pose: "hips" }, { id: "leo", x: 290, mood: "sad", pose: "down" }], props: [{ type: "clock", x: 200, y: 110, time: "07:00" }] }, lines: [
      { who: "narrator", no: "Klokka er sju om morgenen.", uk: "Сьома година ранку.", en: "It is seven in the morning." },
      { who: "mamma", no: "Leo, stå opp! Du må på skolen.", uk: "Лео, вставай! Тобі до школи.", en: "Leo, get up! You have to go to school." },
      { who: "leo", no: "Jeg er så trøtt …", uk: "Я такий сонний …", en: "I am so tired …" }
    ]},
    { art: { bg: "home", chars: [{ id: "leo", x: 130, mood: "grin", pose: "hold" }, { id: "mamma", x: 300, mood: "happy", pose: "point" }] }, lines: [
      { who: "leo", no: "Først vasker jeg meg og pusser tennene.", uk: "Спочатку я вмиваюся і чищу зуби.", en: "First I wash and brush my teeth." },
      { who: "mamma", no: "Bra! Så må du kle på deg.", uk: "Добре! Потім треба одягнутися.", en: "Good! Then you must get dressed." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "pappa", x: 110, mood: "happy", pose: "hold" }, { id: "leo", x: 300, mood: "happy" }], props: [{ type: "bread", x: 200, y: 200 }, { type: "cheese", x: 240, y: 204 }, { type: "glass", x: 170, y: 204 }] }, lines: [
      { who: "pappa", no: "God morgen! Vil du ha brød eller havregryn?", uk: "Доброго ранку! Хочеш хліб чи вівсянку?", en: "Good morning! Do you want bread or porridge?" },
      { who: "leo", no: "Brød med ost, takk. Og et glass melk.", uk: "Хліб із сиром, дякую. І склянку молока.", en: "Bread with cheese, please. And a glass of milk." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "pappa", x: 110, mood: "surprised", pose: "point" }, { id: "leo", x: 300, mood: "surprised" }], props: [{ type: "clock", x: 205, y: 110, time: "07:45" }] }, lines: [
      { who: "pappa", no: "Å nei! Klokka er kvart på åtte!", uk: "Ой ні! Уже за чверть восьма!", en: "Oh no! It is a quarter to eight!" },
      { who: "leo", no: "Bussen går ti over åtte!", uk: "Автобус їде о восьмій десять!", en: "The bus leaves at ten past eight!" }
    ]},
    { art: { bg: "home", chars: [{ id: "leo", x: 100, mood: "sad", pose: "hips" }, { id: "pus", x: 235 }, { id: "mamma", x: 330, mood: "grin", pose: "point", flip: true }], props: [{ type: "backpack", x: 185, y: 292 }] }, lines: [
      { who: "leo", no: "Hvor er sekken min?", uk: "Де мій рюкзак?", en: "Where is my backpack?" },
      { who: "mamma", no: "Se! Pus sover på sekken din.", uk: "Дивись! Пус спить на твоєму рюкзаку.", en: "Look! Pus is sleeping on your backpack." },
      { who: "pus", no: "Mjau.", uk: "Няв.", en: "Meow." }
    ]},
    { art: { bg: "street", chars: [{ id: "leo", x: 130, mood: "happy", pose: "cheer" }, { id: "mamma", x: 300, mood: "happy", pose: "wave", flip: true }], props: [{ type: "busstop", x: 60 }] }, lines: [
      { who: "leo", no: "Ha det, mamma! Jeg rakk bussen!", uk: "Бувай, мамо! Я встиг на автобус!", en: "Bye, Mum! I made it to the bus!" },
      { who: "mamma", no: "Ha en fin dag på skolen!", uk: "Гарного дня в школі!", en: "Have a nice day at school!" }
    ]}
  ],

  vocab: [
    ["å stå opp", "вставати", "to get up"],
    ["trøtt", "сонний, втомлений", "tired, sleepy"],
    ["å vaske seg", "вмиватися", "to wash (oneself)"],
    ["å pusse tennene", "чистити зуби", "to brush one’s teeth"],
    ["å kle på seg", "одягатися", "to get dressed"],
    ["først", "спочатку", "first"],
    ["så", "потім", "then"],
    ["frokost", "сніданок", "breakfast"],
    ["havregryn", "вівсянка", "porridge, oats"],
    ["brød med ost", "хліб із сиром", "bread with cheese"],
    ["et glass melk", "склянка молока", "a glass of milk"],
    ["kvart på åtte", "за чверть восьма", "a quarter to eight"],
    ["ti over åtte", "десять на дев’яту (8:10)", "ten past eight"],
    ["bussen går", "автобус їде (відходить)", "the bus leaves"],
    ["en sekk", "рюкзак", "a backpack"],
    ["å sove", "спати", "to sleep"],
    ["å rekke bussen", "встигнути на автобус", "to catch the bus"],
    ["ha det", "бувай", "bye"],
    ["ha en fin dag", "гарного дня", "have a nice day"]
  ],

  words: {
    no: { "havregryn": "вівсянка", "kle": "одягати (kle på seg — одягатися)", "pusser": "чищу (pusse tennene — чистити зуби)", "rakk": "встиг (rekke)" },
    en: { "havregryn": "porridge, oats", "kle": "dress (kle på seg — get dressed)", "pusser": "brush (pusse tennene — brush teeth)", "rakk": "made it, caught (rekke)" }
  }
});
