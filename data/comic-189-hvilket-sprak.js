window.COMICS = window.COMICS || [];

/* p189 — A2, «Програмування»: мови програмування і для чого кожна. Scratch (блоки для дітей),
   Python (просто читати; ігри, дані, ШІ), JavaScript (живі сайти), HTML/CSS (будова й вигляд сайту),
   Swift (iPhone), Kotlin (Android), C# (ігри). */
COMICS.push({
  id: "p189",
  level: "A2",
  category: "koding",
  style: "code",
  title: "Hvilket språk?",
  titleUk: "Яка мова?",
  titleEn: "Which language?",
  summaryUk: "Лео питає Робо, якою мовою він говорить. Вчителька розповідає про мови програмування: Scratch, Python, JavaScript, HTML і CSS, Swift, Kotlin і C#.",
  summaryEn: "Leo asks Robo which language he speaks. The teacher explains programming languages: Scratch, Python, JavaScript, HTML and CSS, Swift, Kotlin and C#.",
  summaryNo: "Leo spør Robo hvilket språk han snakker. Læreren forteller om programmeringsspråk: Scratch, Python, JavaScript, HTML og CSS, Swift, Kotlin og C#.",
  cover: 1,

  panels: [
    { art: { bg: "lab", code: ["print(\"Hei!\")", "console.log(\"Hei!\")", "<h1>Hei!</h1>"], chars: [{ id: "leo", x: 85, mood: "happy", pose: "point" }, { id: "robo", x: 305, mood: "happy", pose: "wave", flip: true }] }, lines: [
      { who: "leo", no: "Robo, hvilket språk snakker du? Norsk?", uk: "Робо, якою мовою ти говориш? Норвезькою?", en: "Robo, which language do you speak? Norwegian?" },
      { who: "robo", no: "Jeg forstår programmeringsspråk. Det finnes mange!", uk: "Я розумію мови програмування. Їх багато!", en: "I understand programming languages. There are many!" }
    ]},
    { art: { bg: "lab", code: ["Scratch = blokker"], chars: [{ id: "laerer", x: 90, mood: "happy", pose: "point" }, { id: "nora", x: 315, mood: "grin", flip: true }], props: [{ type: "blocks", x: 210, y: 250, items: ["når 🚩 klikkes", "gjenta 10", "gå 10 steg"] }] }, lines: [
      { who: "laerer", no: "Barn starter ofte med Scratch. Der flytter vi fargerike blokker.", uk: "Діти часто починають зі Scratch. Там ми пересуваємо кольорові блоки.", en: "Children often start with Scratch. There we move colourful blocks." },
      { who: "nora", no: "Det ser ut som lego!", uk: "Схоже на лего!", en: "It looks like Lego!" }
    ]},
    { art: { bg: "lab", code: ["# Python", "for i in range(3):", "    print(\"Hei!\")"], chars: [{ id: "laerer", x: 90, mood: "happy", pose: "point" }, { id: "nora", x: 305, mood: "surprised", flip: true }] }, lines: [
      { who: "laerer", no: "Python er enkelt å lese. Det brukes til spill, data og kunstig intelligens.", uk: "Python легко читати. Його використовують для ігор, даних і штучного інтелекту.", en: "Python is easy to read. It is used for games, data and artificial intelligence." },
      { who: "nora", no: "Kunstig intelligens? Som Robo?", uk: "Штучний інтелект? Як Робо?", en: "Artificial intelligence? Like Robo?" }
    ]},
    { art: { bg: "lab", code: ["<h1>Skolen vår</h1>", "h1 { color: red; }", "knapp.onclick = hopp"], chars: [{ id: "laerer", x: 90, mood: "happy", pose: "point" }, { id: "leo", x: 305, mood: "surprised", flip: true }], props: [{ type: "laptop", x: 200, y: 250 }] }, lines: [
      { who: "laerer", no: "HTML bygger nettsider, og CSS gjør dem fine. JavaScript får dem til å bevege seg.", uk: "HTML будує сайти, а CSS робить їх гарними. JavaScript змушує їх рухатися.", en: "HTML builds web pages, and CSS makes them pretty. JavaScript makes them move." },
      { who: "leo", no: "Så nettsiden til skolen er laget med dem?", uk: "Тобто сайт школи зроблено ними?", en: "So the school website is made with them?" }
    ]},
    { art: { bg: "lab", code: ["// Swift → iPhone", "// Kotlin → Android", "// C# → spill"], chars: [{ id: "laerer", x: 90, mood: "happy", pose: "point" }, { id: "nora", x: 300, mood: "happy", pose: "hold", flip: true }], props: [{ type: "phone", x: 195, y: 230 }] }, lines: [
      { who: "laerer", no: "Apper til iPhone lager vi med Swift, og apper til Android med Kotlin.", uk: "Застосунки для iPhone робимо на Swift, а для Android — на Kotlin.", en: "We make iPhone apps with Swift, and Android apps with Kotlin." },
      { who: "nora", no: "Og spill?", uk: "А ігри?", en: "And games?" },
      { who: "laerer", no: "Mange spill lages med C#.", uk: "Багато ігор роблять на C#.", en: "Many games are made with C#." }
    ]},
    { art: { bg: "lab", code: ["start = \"Scratch\"", "neste = \"Python\""], chars: [{ id: "leo", x: 90, mood: "grin", pose: "point" }, { id: "laerer", x: 300, mood: "happy", flip: true }], props: [{ type: "bulb", x: 195, y: 200 }] }, lines: [
      { who: "leo", no: "Hvilket språk skal jeg lære først?", uk: "Яку мову мені вчити першою?", en: "Which language should I learn first?" },
      { who: "laerer", no: "Start med Scratch eller Python. Det viktigste er å tenke logisk.", uk: "Почни зі Scratch або Python. Найважливіше — думати логічно.", en: "Start with Scratch or Python. The most important thing is to think logically." }
    ]}
  ],

  tasks: [
    { type: "concept", q: ["Hvilket språk har fargerike blokker for barn?", "Яка мова має кольорові блоки для дітей?", "Which language has colourful blocks for children?"], answer: ["Scratch", "Scratch", "Scratch"],
      wrong: [["C#", "C#", "C#"], ["Kotlin", "Kotlin", "Kotlin"], ["CSS", "CSS", "CSS"]] },
    { type: "concept", q: ["Hva gjør CSS?", "Що робить CSS?", "What does CSS do?"], answer: ["Gjør nettsider fine", "Робить сайти гарними", "Makes web pages pretty"],
      wrong: [["Lager apper til iPhone", "Робить застосунки для iPhone", "Makes iPhone apps"], ["Teller poeng", "Рахує бали", "Counts points"], ["Lager kunstig intelligens", "Створює ШІ", "Makes AI"]] }
  ],

  vocab: [
    ["et språk", "мова", "a language"],
    ["et programmeringsspråk", "мова програмування", "a programming language"],
    ["å finnes", "існувати", "to exist"],
    ["ofte", "часто", "often"],
    ["å flytte", "пересувати", "to move"],
    ["fargerik", "кольоровий", "colourful"],
    ["ei blokk", "блок", "a block"],
    ["enkel", "простий", "simple, easy"],
    ["kunstig intelligens", "штучний інтелект", "artificial intelligence"],
    ["data", "дані", "data"],
    ["ei nettside", "вебсторінка, сайт", "a web page, a website"],
    ["å bevege seg", "рухатися", "to move"],
    ["ei app", "застосунок", "an app"],
    ["mange", "багато", "many"],
    ["logisk", "логічно", "logically"],
    ["det viktigste", "найважливіше", "the most important thing"]
  ]
});
