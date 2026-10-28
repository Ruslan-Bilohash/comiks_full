window.COMICS = window.COMICS || [];

/* p177 — A2: граматика кількості й розміру всередині звичайної сценки.
   Правило показуємо так, як його чують у житті: спершу репліка, потім пояснення
   в наступному кадрі — а не таблиця, яку треба вчити до того, як вона знадобиться. */
COMICS.push({
  id: "p177",
  level: "A2",
  category: "grammatikk",
  title: "Litt, lite og få",
  titleUk: "Litt, lite і få",
  titleEn: "A little, little and few",
  summaryUk: "Нора з татом влаштували пікнік у парку й розбирають три слова, що означають «небагато».",
  summaryEn: "Nora and Dad have a picnic in the park and sort out three words that all mean “not much”.",
  summaryNo: "Nora og pappa har piknik i parken og rydder opp i tre ord som alle betyr «ikke mye».",
  cover: 0,

  panels: [
    { art: { bg: "park", chars: [{ id: "pappa", x: 120, mood: "normal" }, { id: "nora", x: 300, mood: "happy" }], props: [{ type: "thermos", x: 208, y: 192 }] }, lines: [
      { who: "pappa", no: "Vil du ha litt kaffe?", uk: "Хочеш трохи кави?", en: "Would you like a little coffee?" },
      { who: "nora", no: "Ja takk, bare litt.", uk: "Так, дякую, лише трохи.", en: "Yes please, just a little." }
    ]},
    { art: { bg: "park", chars: [{ id: "nora", x: 120, mood: "normal" }, { id: "pappa", x: 300, mood: "happy" }], props: [{ type: "sugar", x: 212, y: 190 }] }, lines: [
      { who: "nora", no: "Vi har lite sukker igjen.", uk: "У нас лишилося мало цукру.", en: "We have little sugar left." },
      { who: "pappa", no: "Ja, «lite» betyr nesten ingenting.", uk: "Так, «lite» означає майже нічого.", en: "Yes, “lite” means almost nothing." }
    ]},
    { art: { bg: "park", chars: [{ id: "pappa", x: 120, mood: "normal" }, { id: "nora", x: 300, mood: "happy" }], props: [{ type: "basket", x: 206, y: 194 }] }, lines: [
      { who: "pappa", no: "Og vi har få epler i kurven.", uk: "І в кошику мало яблук.", en: "And we have few apples in the basket." },
      { who: "nora", no: "«Få» er som «lite», men om ting vi kan telle.", uk: "«Få» — як «lite», але про те, що можна порахувати.", en: "“Få” is like “lite”, but about things we can count." }
    ]},
    { art: { bg: "park", chars: [{ id: "nora", x: 120, mood: "normal" }, { id: "pappa", x: 300, mood: "happy" }], props: [{ type: "apples", x: 214, y: 190 }] }, lines: [
      { who: "nora", no: "Så: litt kaffe, lite sukker, få epler.", uk: "Отже: трохи кави, мало цукру, мало яблук.", en: "So: a little coffee, little sugar, few apples." },
      { who: "pappa", no: "Helt riktig.", uk: "Саме так.", en: "Exactly right." }
    ]},
    { art: { bg: "park", chars: [{ id: "pappa", x: 120, mood: "normal" }, { id: "nora", x: 300, mood: "happy" }], props: [{ type: "mug", x: 210, y: 192 }] }, lines: [
      { who: "pappa", no: "«Litt» er positivt: litt kaffe er fint.", uk: "«Litt» — це добре: трохи кави — то приємно.", en: "“Litt” is positive: a little coffee is nice." },
      { who: "nora", no: "Og «lite kaffe» høres trist ut.", uk: "А «lite kaffe» звучить сумно.", en: "And “lite kaffe” sounds sad." }
    ]},
    { art: { bg: "park", chars: [{ id: "nora", x: 120, mood: "normal" }, { id: "pappa", x: 300, mood: "happy" }], props: [{ type: "cake", x: 208, y: 194 }] }, lines: [
      { who: "nora", no: "Da tar jeg litt kake også.", uk: "Тоді візьму ще трохи торта.", en: "Then I will have a little cake as well." },
      { who: "pappa", no: "Bare litt, ja.", uk: "Лише трохи, так.", en: "Just a little, yes." }
    ]}
  ],

  vocab: [
    ["litt", "трохи", "a little"],
    ["lite", "мало", "little"],
    ["få", "мало (штук)", "few"],
    ["en kaffe", "кава", "coffee"],
    ["igjen", "лишилося", "left"],
    ["å bety", "означати", "to mean"],
    ["nesten", "майже", "almost"],
    ["ingenting", "нічого", "nothing"],
    ["ei kurv", "кошик", "a basket"],
    ["å telle", "рахувати", "to count"],
    ["å høres ut", "звучати", "to sound"],
    ["trist", "сумний", "sad"]
  ],

  words: {
    no: { "litt": "трохи", "lite": "мало", "få": "мало", "kaffe": "кава", "sukker": "цукор", "igjen": "лишилося", "betyr": "означає", "nesten": "майже", "ingenting": "нічого", "kurven": "кошик", "telle": "рахувати", "høres": "звучить", "trist": "сумно", "positivt": "добре", "epler": "яблука" },
    en: { "litt": "a little", "lite": "little", "få": "few", "kaffe": "coffee", "sukker": "sugar", "igjen": "left", "betyr": "means", "nesten": "almost", "ingenting": "nothing", "kurven": "the basket", "telle": "to count", "høres": "sounds", "trist": "sad", "positivt": "positive", "epler": "apples" }
  }
});
