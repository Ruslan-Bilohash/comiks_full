window.COMICS = window.COMICS || [];

/* p187 — A2, «Програмування»: змінна як коробка з назвою. Діти роблять гру «кіт ловить рибу»
   й рахують бали: poeng = poeng + 1. Наприкінці жарт Робо про змінну «радість». */
COMICS.push({
  id: "p187",
  level: "A2",
  category: "koding",
  style: "code",
  title: "Poeng i boksen",
  titleUk: "Бали в коробці",
  titleEn: "Points in the box",
  summaryUk: "Нора й Лео створюють гру: кіт ловить рибу й отримує бали. Вчителька пояснює змінну — коробку з назвою, де комп’ютер зберігає число.",
  summaryEn: "Nora and Leo make a game: a cat catches fish and gets points. The teacher explains a variable — a box with a name where the computer keeps a number.",
  summaryNo: "Nora og Leo lager et spill: en katt fanger fisk og får poeng. Læreren forklarer en variabel – en boks med et navn der datamaskinen tar vare på et tall.",
  cover: 3,

  panels: [
    { art: { bg: "lab", code: ["katt fanger fisk", "→ ???"], chars: [{ id: "nora", x: 85, mood: "grin", pose: "point" }, { id: "leo", x: 300, mood: "surprised", flip: true }], props: [{ type: "laptop", x: 195, y: 250 }] }, lines: [
      { who: "nora", no: "Vi lager et spill! Hver gang katten fanger en fisk, får vi ett poeng.", uk: "Ми робимо гру! Щоразу, коли кіт ловить рибку, ми отримуємо бал.", en: "We are making a game! Every time the cat catches a fish, we get a point." },
      { who: "leo", no: "Men hvor skal datamaskinen huske poengene?", uk: "Але де комп’ютер запам’ятає бали?", en: "But where will the computer remember the points?" }
    ]},
    { art: { bg: "lab", code: ["poeng = 0", "skriv(poeng)"], chars: [{ id: "laerer", x: 90, mood: "happy", pose: "point" }, { id: "leo", x: 305, mood: "normal", flip: true }], props: [{ type: "codecard", x: 200, y: 140, text: "poeng = 0" }, { type: "boxes", x: 200, y: 250 }] }, lines: [
      { who: "laerer", no: "I en variabel. En variabel er som en boks med et navn.", uk: "У змінній. Змінна — це як коробка з назвою.", en: "In a variable. A variable is like a box with a name." },
      { who: "laerer", no: "Boksen heter «poeng». Nå er det null i boksen.", uk: "Коробка називається «бали». Зараз у ній нуль.", en: "The box is called “points”. Right now there is zero in the box." }
    ]},
    { art: { bg: "lab", code: ["hvis fisk:", "    poeng = poeng + 1"], chars: [{ id: "nora", x: 90, mood: "grin", pose: "cheer" }, { id: "leo", x: 305, mood: "happy", pose: "point", flip: true }], props: [{ type: "codecard", x: 200, y: 140, text: "poeng = poeng + 1" }] }, lines: [
      { who: "nora", no: "Katten fanger en fisk!", uk: "Кіт ловить рибку!", en: "The cat catches a fish!" },
      { who: "leo", no: "Da skriver vi: poeng er poeng pluss én.", uk: "Тоді пишемо: бали дорівнюють бали плюс один.", en: "Then we write: points equals points plus one." }
    ]},
    { art: { bg: "lab", code: ["poeng = 1", "poeng = 2", "poeng = 3"], chars: [{ id: "robo", x: 95, mood: "grin", pose: "cheer" }, { id: "nora", x: 300, mood: "surprised", flip: true }], fx: "stars" }, lines: [
      { who: "robo", no: "Poeng er én. Poeng er to. Poeng er tre!", uk: "Балів — один. Балів — два. Балів — три!", en: "Points is one. Points is two. Points is three!" },
      { who: "nora", no: "Verdien i boksen endrer seg!", uk: "Значення в коробці змінюється!", en: "The value in the box changes!" }
    ]},
    { art: { bg: "lab", code: ["navn = \"Pus\"", "liv = 3", "fart = 5"], chars: [{ id: "leo", x: 90, mood: "happy", pose: "point" }, { id: "laerer", x: 300, mood: "happy", flip: true }] }, lines: [
      { who: "leo", no: "Kan vi ha flere bokser?", uk: "А можна мати кілька коробок?", en: "Can we have more boxes?" },
      { who: "laerer", no: "Ja. Navn, liv og fart … Et spill har mange variabler.", uk: "Так. Ім’я, життя, швидкість… У грі багато змінних.", en: "Yes. Name, lives and speed … A game has many variables." }
    ]},
    { art: { bg: "lab", code: ["poeng = 10", "glede = 100"], chars: [{ id: "nora", x: 85, mood: "grin", pose: "cheer" }, { id: "robo", x: 300, mood: "grin", pose: "wave", flip: true }], fx: "stars" }, lines: [
      { who: "nora", no: "Vi har ti poeng! Vi vant!", uk: "У нас десять балів! Ми виграли!", en: "We have ten points! We won!" },
      { who: "robo", no: "Variabelen «glede» er nå hundre.", uk: "Змінна «радість» тепер сто.", en: "The variable “joy” is now a hundred." }
    ]}
  ],

  tasks: [
    { type: "concept", q: ["Hva er en variabel?", "Що таке змінна?", "What is a variable?"], answer: ["En boks med et navn og en verdi", "Коробка з назвою і значенням", "A box with a name and a value"],
      wrong: [["En feil i programmet", "Помилка в програмі", "An error in the program"], ["En tegning", "Малюнок", "A drawing"], ["En løkke", "Цикл", "A loop"]] },
    { type: "concept", q: ["poeng = 2, så poeng = poeng + 1. Hva er poeng nå?", "poeng = 2, потім poeng = poeng + 1. Скільки тепер?", "points = 2, then points = points + 1. What is points now?"], answer: ["3", "3", "3"],
      wrong: [["2", "2", "2"], ["21", "21", "21"], ["1", "1", "1"]] }
  ],

  vocab: [
    ["et spill", "гра", "a game"],
    ["et poeng", "бал, очко", "a point"],
    ["en variabel", "змінна", "a variable"],
    ["en boks", "коробка", "a box"],
    ["et navn", "ім’я, назва", "a name"],
    ["en verdi", "значення", "a value"],
    ["å fange", "ловити", "to catch"],
    ["en fisk", "риба", "a fish"],
    ["hver gang", "щоразу", "every time"],
    ["null", "нуль", "zero"],
    ["pluss", "плюс", "plus"],
    ["å endre seg", "змінюватися", "to change"],
    ["et liv", "життя", "a life"],
    ["en fart", "швидкість", "a speed"],
    ["å vinne", "вигравати", "to win"],
    ["en glede", "радість", "a joy"],
    ["å ta vare på", "зберігати, берегти", "to keep, to take care of"]
  ]
});
