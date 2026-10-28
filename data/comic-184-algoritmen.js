window.COMICS = window.COMICS || [];

/* p184 — A1, «Програмування»: алгоритм як рецепт. Лео пише для Робо інструкцію «бутерброд»,
   а Робо виконує її буквально (масло — на стіл). Висновок: точність і порядок кроків. */
COMICS.push({
  id: "p184",
  level: "A1",
  category: "koding",
  style: "code",
  title: "Brødskive-algoritmen",
  titleUk: "Алгоритм бутерброда",
  titleEn: "The sandwich algorithm",
  summaryUk: "Лео вчить робота Робо робити бутерброд. Робо виконує все буквально, тож Лео дізнається, що алгоритм має бути точним і в правильному порядку.",
  summaryEn: "Leo teaches Robo the robot to make a sandwich. Robo does everything literally, so Leo learns that an algorithm must be exact and in the right order.",
  summaryNo: "Leo lærer roboten Robo å lage ei brødskive. Robo gjør alt helt nøyaktig, så Leo lærer at en algoritme må være presis og i riktig rekkefølge.",
  cover: 2,

  panels: [
    { art: { bg: "kitchen", chars: [{ id: "pappa", x: 85, mood: "happy" }, { id: "leo", x: 195, mood: "grin", pose: "point" }, { id: "robo", x: 315, mood: "normal", flip: true }], props: [{ type: "bread", x: 255, y: 200 }] }, lines: [
      { who: "leo", no: "Pappa, jeg skal lære Robo å lage ei brødskive.", uk: "Тату, я навчу Робо робити бутерброд.", en: "Dad, I am going to teach Robo to make a sandwich." },
      { who: "pappa", no: "Da trenger du en algoritme.", uk: "Тоді тобі потрібен алгоритм.", en: "Then you need an algorithm." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "leo", x: 100, mood: "surprised" }, { id: "pappa", x: 290, mood: "happy", pose: "point", flip: true }], props: [{ type: "codecard", x: 200, y: 200, text: "1 → 2 → 3 → 4" }] }, lines: [
      { who: "leo", no: "Hva er en algoritme?", uk: "Що таке алгоритм?", en: "What is an algorithm?" },
      { who: "pappa", no: "En algoritme er som en oppskrift: steg for steg, i riktig rekkefølge.", uk: "Алгоритм — це як рецепт: крок за кроком, у правильному порядку.", en: "An algorithm is like a recipe: step by step, in the right order." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "leo", x: 90, mood: "happy", pose: "hold" }, { id: "robo", x: 290, mood: "happy", pose: "hold", flip: true }], props: [{ type: "butter", x: 230, y: 200 }, { type: "codecard", x: 180, y: 110, text: "ha på smør" }] }, lines: [
      { who: "leo", no: "Steg én: Ta brødet. Steg to: Ha på smør.", uk: "Крок перший: візьми хліб. Крок другий: намаж масло.", en: "Step one: Take the bread. Step two: Put on butter." },
      { who: "robo", no: "Smør på … bordet? Utført!", uk: "Масло на… стіл? Виконано!", en: "Butter on … the table? Done!" }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "pappa", x: 95, mood: "grin", pose: "hips" }, { id: "leo", x: 290, mood: "angry", pose: "point", flip: true }], props: [{ type: "butter", x: 200, y: 200 }], fx: "stars" }, lines: [
      { who: "pappa", no: "Ha ha! Du må si nøyaktig hva Robo skal gjøre.", uk: "Ха-ха! Треба точно сказати, що Робо має робити.", en: "Ha ha! You have to say exactly what Robo should do." },
      { who: "leo", no: "Nytt steg to: Ha smør på brødskiva!", uk: "Новий крок другий: намаж масло на скибку хліба!", en: "New step two: Put butter on the slice of bread!" }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "leo", x: 90, mood: "happy", pose: "point" }, { id: "robo", x: 290, mood: "grin", pose: "hold", flip: true }], props: [{ type: "cheese", x: 240, y: 200 }] }, lines: [
      { who: "leo", no: "Steg tre: Legg på ost. Steg fire: Gi brødskiva til Leo.", uk: "Крок третій: поклади сир. Крок четвертий: дай бутерброд Лео.", en: "Step three: Put on cheese. Step four: Give the sandwich to Leo." },
      { who: "robo", no: "Utført! Vær så god.", uk: "Виконано! Прошу.", en: "Done! Here you are." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "leo", x: 100, mood: "grin", pose: "cheer" }, { id: "pappa", x: 290, mood: "happy", pose: "point", flip: true }], props: [{ type: "bread", x: 195, y: 200 }], fx: "hearts" }, lines: [
      { who: "leo", no: "Mmm! Algoritmen virker!", uk: "Ммм! Алгоритм працює!", en: "Mmm! The algorithm works!" },
      { who: "pappa", no: "Og husk: rekkefølgen er viktig. Først smør, så ost.", uk: "І пам’ятай: порядок важливий. Спершу масло, потім сир.", en: "And remember: the order is important. First butter, then cheese." }
    ]}
  ],

  tasks: [
    { type: "algo", no: "Lag ei brødskive", uk: "Зроби бутерброд", en: "Make a sandwich",
      steps: [["Ta ei brødskive", "Візьми скибку хліба", "Take a slice of bread"], ["Ha smør på brødskiva", "Намаж масло на хліб", "Put butter on the bread"], ["Legg på ost", "Поклади сир", "Put on cheese"], ["Spis brødskiva", "З’їж бутерброд", "Eat the sandwich"]] },
    { type: "algo", no: "Puss tennene", uk: "Почисть зуби", en: "Brush your teeth",
      steps: [["Ta tannbørsten", "Візьми зубну щітку", "Take the toothbrush"], ["Ha på tannkrem", "Видави пасту", "Put on toothpaste"], ["Puss tennene", "Почисть зуби", "Brush your teeth"], ["Skyll munnen", "Прополощи рот", "Rinse your mouth"]] },
    { type: "concept", q: ["Hva er en algoritme?", "Що таке алгоритм?", "What is an algorithm?"], answer: ["Steg for steg i riktig rekkefølge", "Кроки в правильному порядку", "Steps in the right order"],
      wrong: [["Et dyr", "Тварина", "An animal"], ["En slags mat", "Різновид їжі", "A kind of food"], ["Et tilfeldig ord", "Випадкове слово", "A random word"]] }
  ],

  vocab: [
    ["en algoritme", "алгоритм", "an algorithm"],
    ["ei brødskive", "скибка хліба, бутерброд", "a slice of bread, a sandwich"],
    ["en oppskrift", "рецепт", "a recipe"],
    ["et steg", "крок", "a step"],
    ["å trenge", "потребувати", "to need"],
    ["smør", "масло", "butter"],
    ["en ost", "сир", "a cheese"],
    ["å legge på", "покласти зверху", "to put on"],
    ["utført", "виконано", "done, carried out"],
    ["nøyaktig", "точно", "exactly"],
    ["nytt", "новий", "new"],
    ["å virke", "працювати, діяти", "to work"],
    ["viktig", "важливий", "important"],
    ["først", "спершу", "first"],
    ["så", "потім", "then"],
    ["å huske", "пам’ятати", "to remember"],
    ["vær så god", "прошу, будь ласка", "here you are"]
  ]
});
