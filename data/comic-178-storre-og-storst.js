window.COMICS = window.COMICS || [];

/* p178 — A2: граматика кількості й розміру всередині звичайної сценки.
   Правило показуємо так, як його чують у житті: спершу репліка, потім пояснення
   в наступному кадрі — а не таблиця, яку треба вчити до того, як вона знадобиться. */
COMICS.push({
  id: "p178",
  level: "A2",
  category: "grammatikk",
  title: "Større og størst",
  titleUk: "Більший і найбільший",
  titleEn: "Bigger and biggest",
  summaryUk: "Муса з Карі йдуть у гори й тренують stor–større–størst, mange–flere–flest і god–bedre–best.",
  summaryEn: "Musa and Kari hike in the mountains and practise stor–større–størst, mange–flere–flest and god–bedre–best.",
  summaryNo: "Musa og Kari går i fjellet og øver på stor–større–størst, mange–flere–flest og god–bedre–best.",
  cover: 0,

  panels: [
    { art: { bg: "mountain", chars: [{ id: "musa", x: 120, mood: "normal" }, { id: "kari", x: 300, mood: "happy" }], props: [] }, lines: [
      { who: "musa", no: "Dette fjellet er stort.", uk: "Ця гора велика.", en: "This mountain is big." },
      { who: "kari", no: "Ja, men det der er større.", uk: "Так, але он та більша.", en: "Yes, but that one is bigger." }
    ]},
    { art: { bg: "mountain", chars: [{ id: "kari", x: 120, mood: "normal" }, { id: "musa", x: 300, mood: "happy" }], props: [] }, lines: [
      { who: "kari", no: "Og det høyeste er størst.", uk: "А найвища — найбільша.", en: "And the highest one is the biggest." },
      { who: "musa", no: "Stor, større, størst. Jeg skjønner.", uk: "Stor, større, størst. Зрозумів.", en: "Stor, større, størst. I get it." }
    ]},
    { art: { bg: "mountain", chars: [{ id: "musa", x: 120, mood: "normal" }, { id: "kari", x: 300, mood: "happy" }], props: [{ type: "backpack", x: 210, y: 196 }] }, lines: [
      { who: "musa", no: "Jeg har mange bilder fra turen.", uk: "У мене багато фото з походу.", en: "I have many photos from the hike." },
      { who: "kari", no: "Jeg har flere enn deg.", uk: "А в мене більше, ніж у тебе.", en: "I have more than you." }
    ]},
    { art: { bg: "mountain", chars: [{ id: "kari", x: 120, mood: "normal" }, { id: "musa", x: 300, mood: "happy" }], props: [{ type: "tent", x: 206, y: 198 }] }, lines: [
      { who: "kari", no: "Men Leo har flest. Han tar bilder hele tiden.", uk: "Але найбільше в Лео. Він знімає весь час.", en: "But Leo has the most. He takes photos all the time." },
      { who: "musa", no: "Mange, flere, flest.", uk: "Mange, flere, flest.", en: "Many, more, most." }
    ]},
    { art: { bg: "mountain", chars: [{ id: "musa", x: 120, mood: "normal" }, { id: "kari", x: 300, mood: "happy" }], props: [] }, lines: [
      { who: "musa", no: "Og hvordan blir det med «lite»?", uk: "А як буде з «lite»?", en: "And what happens with “lite”?" },
      { who: "kari", no: "Lite, mindre, minst.", uk: "Lite, mindre, minst.", en: "Little, less, least." }
    ]},
    { art: { bg: "mountain", chars: [{ id: "kari", x: 120, mood: "normal" }, { id: "musa", x: 300, mood: "happy" }], props: [{ type: "elg", x: 300, y: 190 }] }, lines: [
      { who: "kari", no: "Ser du den lille hytta? Den er minst her.", uk: "Бачиш ту хатинку? Вона тут найменша.", en: "Do you see the little cabin? It is the smallest here." },
      { who: "musa", no: "Men turen er best. God, bedre, best!", uk: "Зате похід — найкращий. God, bedre, best!", en: "But the hike is the best. God, bedre, best!" }
    ]}
  ],

  vocab: [
    ["stor", "великий", "big"],
    ["større", "більший", "bigger"],
    ["størst", "найбільший", "biggest"],
    ["mange", "багато", "many"],
    ["flere", "більше", "more"],
    ["flest", "найбільше", "most"],
    ["mindre", "менший", "smaller"],
    ["minst", "найменший", "smallest"],
    ["bedre", "кращий", "better"],
    ["best", "найкращий", "best"],
    ["et fjell", "гора", "a mountain"],
    ["ei hytte", "хатинка", "a cabin"]
  ],

  words: {
    no: { "stort": "велика", "større": "більша", "størst": "найбільша", "høyeste": "найвища", "mange": "багато", "flere": "більше", "flest": "найбільше", "mindre": "менше", "minst": "найменша", "bedre": "краще", "best": "найкращий", "fjellet": "гора", "hytta": "хатинка", "bilder": "фото", "turen": "похід", "skjønner": "розумію" },
    en: { "stort": "big", "større": "bigger", "størst": "biggest", "høyeste": "the highest", "mange": "many", "flere": "more", "flest": "the most", "mindre": "smaller", "minst": "the smallest", "bedre": "better", "best": "best", "fjellet": "the mountain", "hytta": "the cabin", "bilder": "photos", "turen": "the hike", "skjønner": "understand" }
  }
});
