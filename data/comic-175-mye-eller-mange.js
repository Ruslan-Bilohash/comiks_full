window.COMICS = window.COMICS || [];

/* p175 — A1: граматика кількості й розміру всередині звичайної сценки.
   Правило показуємо так, як його чують у житті: спершу репліка, потім пояснення
   в наступному кадрі — а не таблиця, яку треба вчити до того, як вона знадобиться. */
COMICS.push({
  id: "p175",
  level: "A1",
  category: "grammatikk",
  title: "Mye eller mange?",
  titleUk: "Mye чи mange?",
  titleEn: "Much or many?",
  summaryUk: "Мія з мамою печуть торт і розбираються, коли кажуть «mye», а коли «mange».",
  summaryEn: "Mia and Mum bake a cake and work out when Norwegian says “mye” and when it says “mange”.",
  summaryNo: "Mia og mamma baker kake og finner ut når vi sier «mye» og når vi sier «mange».",
  cover: 0,

  panels: [
    { art: { bg: "kitchen", chars: [{ id: "mamma", x: 120, mood: "normal" }, { id: "mia", x: 300, mood: "happy" }], props: [{ type: "milk", x: 210, y: 190 }] }, lines: [
      { who: "mamma", no: "Vi skal bake en kake. Har vi mye melk?", uk: "Ми печемо торт. У нас багато молока?", en: "We are going to bake a cake. Do we have a lot of milk?" },
      { who: "mia", no: "Ja, vi har mye melk.", uk: "Так, молока багато.", en: "Yes, we have a lot of milk." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "mia", x: 120, mood: "normal" }, { id: "mamma", x: 300, mood: "happy" }], props: [{ type: "eggs", x: 215, y: 188 }] }, lines: [
      { who: "mia", no: "Og har vi mange egg?", uk: "А яєць багато?", en: "And do we have many eggs?" },
      { who: "mamma", no: "Vi har fire egg. Det er nok.", uk: "У нас чотири яйця. Цього досить.", en: "We have four eggs. That is enough." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "mamma", x: 120, mood: "normal" }, { id: "mia", x: 300, mood: "happy" }], props: [{ type: "flour", x: 208, y: 190 }] }, lines: [
      { who: "mamma", no: "Vi sier «mye» om melk, mel og sukker.", uk: "Ми кажемо «mye» про молоко, борошно й цукор.", en: "We say “mye” about milk, flour and sugar." },
      { who: "mia", no: "Og «mange» om egg, epler og kaker?", uk: "А «mange» — про яйця, яблука й торти?", en: "And “mange” about eggs, apples and cakes?" }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "mamma", x: 120, mood: "normal" }, { id: "mia", x: 300, mood: "happy" }], props: [{ type: "sugar", x: 212, y: 190 }] }, lines: [
      { who: "mamma", no: "Nettopp. Mange teller vi, mye måler vi.", uk: "Саме так. «Mange» ми рахуємо, «mye» — міряємо.", en: "Exactly. We count “mange”, we measure “mye”." },
      { who: "mia", no: "Hvor mye sukker trenger vi?", uk: "Скільки цукру нам треба?", en: "How much sugar do we need?" }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "mamma", x: 120, mood: "normal" }, { id: "mia", x: 300, mood: "happy" }], props: [{ type: "bowl", x: 210, y: 192 }] }, lines: [
      { who: "mamma", no: "Ikke mye. Bare litt.", uk: "Небагато. Лише трохи.", en: "Not much. Just a little." },
      { who: "mia", no: "Og hvor mange epler?", uk: "А скільки яблук?", en: "And how many apples?" }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "mamma", x: 120, mood: "normal" }, { id: "mia", x: 300, mood: "happy" }], props: [{ type: "apples", x: 214, y: 190 }] }, lines: [
      { who: "mamma", no: "Tre epler. Nå baker vi!", uk: "Три яблука. Тепер печемо!", en: "Three apples. Now we bake!" },
      { who: "mia", no: "Jeg teller: ett, to, tre.", uk: "Я рахую: одне, два, три.", en: "I am counting: one, two, three." }
    ]}
  ],

  vocab: [
    ["mye", "багато (незлічуване)", "much"],
    ["mange", "багато (штук)", "many"],
    ["ei melk", "молоко", "milk"],
    ["et egg", "яйце", "an egg"],
    ["et mel", "борошно", "flour"],
    ["et sukker", "цукор", "sugar"],
    ["å bake", "пекти", "to bake"],
    ["ei kake", "торт", "a cake"],
    ["nok", "досить", "enough"],
    ["å telle", "рахувати", "to count"],
    ["å måle", "міряти", "to measure"],
    ["litt", "трохи", "a little"]
  ],

  words: {
    no: { "mye": "багато", "mange": "багато", "melk": "молоко", "egg": "яйця", "mel": "борошно", "sukker": "цукор", "kake": "торт", "nok": "досить", "teller": "рахую", "måler": "міряємо", "litt": "трохи", "epler": "яблука", "kaker": "торти", "bake": "пекти", "baker": "печемо", "trenger": "потрібно" },
    en: { "mye": "much", "mange": "many", "melk": "milk", "egg": "eggs", "mel": "flour", "sukker": "sugar", "kake": "cake", "nok": "enough", "teller": "am counting", "måler": "measure", "litt": "a little", "epler": "apples", "kaker": "cakes", "bake": "to bake", "baker": "are baking", "trenger": "need" }
  }
});
