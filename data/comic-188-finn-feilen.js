window.COMICS = window.COMICS || [];

/* p188 — A2, «Програмування»: помилка (bug) і пошук помилок. Робо врізається в стіну,
   діти читають програму рядок за рядком і виправляють «праворуч» на «ліворуч». */
COMICS.push({
  id: "p188",
  level: "A2",
  category: "koding",
  style: "code",
  title: "Finn feilen!",
  titleUk: "Знайди помилку!",
  titleEn: "Find the bug!",
  summaryUk: "Робо має дійти до зірки, але врізається в стіну. Діти читають програму рядок за рядком, знаходять помилку й виправляють її.",
  summaryEn: "Robo has to reach the star but walks into a wall. The children read the program line by line, find the bug and fix it.",
  summaryNo: "Robo skal gå til stjerna, men går rett inn i veggen. Barna leser programmet linje for linje, finner feilen og retter den.",
  cover: 4,

  panels: [
    { art: { bg: "lab", code: ["fram", "fram", "høyre", "fram"], chars: [{ id: "leo", x: 85, mood: "happy", pose: "point" }, { id: "robo", x: 305, mood: "happy", flip: true }], props: [{ type: "robotgrid", x: 200, y: 262, robot: [0, 3], star: [3, 0], walls: [[1, 2], [2, 0]] }] }, lines: [
      { who: "leo", no: "Robo skal gå til stjerna. Jeg har skrevet programmet.", uk: "Робо має дійти до зірки. Я написав програму.", en: "Robo has to walk to the star. I have written the program." },
      { who: "robo", no: "Jeg starter programmet nå.", uk: "Я запускаю програму.", en: "I am starting the program now." }
    ]},
    { art: { bg: "lab", code: ["fram", "fram", "høyre", "BANG!"], chars: [{ id: "robo", x: 110, mood: "angry", pose: "hips" }, { id: "nora", x: 300, mood: "surprised", flip: true }], fx: "stars" }, lines: [
      { who: "robo", no: "Au! Jeg gikk rett inn i veggen.", uk: "Ой! Я пішов просто в стіну.", en: "Ouch! I walked straight into the wall." },
      { who: "nora", no: "Oi! Programmet har en feil.", uk: "Ой! У програмі помилка.", en: "Oops! The program has a bug." }
    ]},
    { art: { bg: "lab", code: ["bug = feil", "feilsøking = å finne feilen"], chars: [{ id: "laerer", x: 95, mood: "happy", pose: "point" }, { id: "leo", x: 305, mood: "sad", flip: true }] }, lines: [
      { who: "laerer", no: "En feil i et program kaller vi en bug.", uk: "Помилку в програмі називаємо «баг».", en: "We call an error in a program a bug." },
      { who: "laerer", no: "Å finne og rette feilen kaller vi feilsøking.", uk: "Шукати й виправляти помилку — це налагодження.", en: "Finding and fixing the error is called debugging." }
    ]},
    { art: { bg: "lab", code: ["1 fram", "2 fram", "3 høyre  ← ?", "4 fram"], chars: [{ id: "nora", x: 90, mood: "normal", pose: "point" }, { id: "leo", x: 305, mood: "grin", pose: "point", flip: true }] }, lines: [
      { who: "nora", no: "Vi leser programmet linje for linje: fram, fram, høyre …", uk: "Читаємо програму рядок за рядком: вперед, вперед, праворуч…", en: "We read the program line by line: forward, forward, right …" },
      { who: "leo", no: "Der! Det skal stå venstre, ikke høyre.", uk: "Ось! Там має бути «ліворуч», а не «праворуч».", en: "There! It should say left, not right." }
    ]},
    { art: { bg: "lab", code: ["fram", "fram", "venstre ✔", "fram"], chars: [{ id: "leo", x: 90, mood: "happy", pose: "hold" }, { id: "robo", x: 305, mood: "grin", pose: "cheer", flip: true }], props: [{ type: "robotgrid", x: 200, y: 262, robot: [3, 0], star: [3, 0], walls: [[1, 2], [2, 0]], path: [[0, 3], [0, 1], [3, 1], [3, 0]] }] }, lines: [
      { who: "leo", no: "Nå retter jeg feilen og prøver igjen.", uk: "Зараз я виправлю помилку й спробую знову.", en: "Now I will fix the bug and try again." },
      { who: "robo", no: "Jeg er ved stjerna! Programmet virker.", uk: "Я біля зірки! Програма працює.", en: "I am at the star! The program works." }
    ]},
    { art: { bg: "lab", code: ["prøv()", "hvis feil:", "    prøv_igjen()"], chars: [{ id: "laerer", x: 95, mood: "happy", pose: "point" }, { id: "nora", x: 300, mood: "grin", pose: "cheer", flip: true }], props: [{ type: "bulb", x: 200, y: 200 }] }, lines: [
      { who: "laerer", no: "Alle programmerere lager feil. Det viktige er å prøve igjen.", uk: "Усі програмісти помиляються. Головне — пробувати знову.", en: "All programmers make mistakes. The important thing is to try again." },
      { who: "nora", no: "Feil er en del av læringen!", uk: "Помилки — частина навчання!", en: "Mistakes are part of learning!" }
    ]}
  ],

  tasks: [
    { type: "concept", q: ["Hva er en bug?", "Що таке баг?", "What is a bug?"], answer: ["En feil i et program", "Помилка в програмі", "An error in a program"],
      wrong: [["Et insekt i datamaskinen", "Комаха в комп’ютері", "An insect in the computer"], ["Et nytt spill", "Нова гра", "A new game"], ["En rask robot", "Швидкий робот", "A fast robot"]] },
    { type: "concept", q: ["Hva gjør vi når programmet har en feil?", "Що робимо, коли в програмі помилка?", "What do we do when the program has a bug?"], answer: ["Leser linje for linje og retter feilen", "Читаємо рядок за рядком і виправляємо", "Read line by line and fix the bug"],
      wrong: [["Kaster datamaskinen", "Викидаємо комп’ютер", "Throw away the computer"], ["Gir opp", "Здаємося", "Give up"], ["Skriver alt på nytt med en gang", "Одразу все переписуємо", "Rewrite everything at once"]] }
  ],

  vocab: [
    ["ei stjerne", "зірка", "a star"],
    ["en vegg", "стіна", "a wall"],
    ["å starte", "запускати, починати", "to start"],
    ["rett inn i", "просто в", "straight into"],
    ["en feil", "помилка", "a mistake, an error"],
    ["en bug", "баг, помилка в програмі", "a bug"],
    ["feilsøking", "налагодження, пошук помилок", "debugging"],
    ["å rette", "виправляти", "to fix, to correct"],
    ["ei linje", "рядок", "a line"],
    ["høyre", "праворуч", "right"],
    ["venstre", "ліворуч", "left"],
    ["å prøve igjen", "пробувати знову", "to try again"],
    ["en programmerer", "програміст", "a programmer"],
    ["læring", "навчання", "learning"],
    ["en del av", "частина", "a part of"]
  ]
});
