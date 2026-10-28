window.COMICS = window.COMICS || [];

/* p176 — A1: граматика кількості й розміру всередині звичайної сценки.
   Правило показуємо так, як його чують у житті: спершу репліка, потім пояснення
   в наступному кадрі — а не таблиця, яку треба вчити до того, як вона знадобиться. */
COMICS.push({
  id: "p176",
  level: "A1",
  category: "grammatikk",
  title: "Stor eller liten?",
  titleUk: "Великий чи малий?",
  titleEn: "Big or small?",
  summaryUk: "Лео робить покупки й дізнається, чому кажуть «en liten pose», але «et lite brød».",
  summaryEn: "Leo goes shopping and learns why Norwegian says “en liten pose” but “et lite brød”.",
  summaryNo: "Leo handler i butikken og lærer hvorfor det heter «en liten pose», men «et lite brød».",
  cover: 0,

  panels: [
    { art: { bg: "shop", chars: [{ id: "leo", x: 120, mood: "normal" }, { id: "kasserer", x: 300, mood: "happy" }], props: [{ type: "counter", x: 200, y: 200 }] }, lines: [
      { who: "leo", no: "Hei! Jeg trenger en stor pose.", uk: "Привіт! Мені потрібен великий пакет.", en: "Hi! I need a big bag." },
      { who: "kasserer", no: "Her er en stor pose og en liten pose.", uk: "Ось великий пакет і малий пакет.", en: "Here is a big bag and a small bag." }
    ]},
    { art: { bg: "shop", chars: [{ id: "leo", x: 120, mood: "normal" }, { id: "kasserer", x: 300, mood: "happy" }], props: [{ type: "basket", x: 210, y: 196 }] }, lines: [
      { who: "leo", no: "Den store posen, takk.", uk: "Великий, будь ласка.", en: "The big one, please." },
      { who: "kasserer", no: "Vær så god.", uk: "Прошу.", en: "Here you are." }
    ]},
    { art: { bg: "shop", chars: [{ id: "leo", x: 120, mood: "normal" }, { id: "kasserer", x: 300, mood: "happy" }], props: [{ type: "bread", x: 206, y: 194 }] }, lines: [
      { who: "leo", no: "Har dere et lite brød også?", uk: "А маленький хліб у вас є?", en: "Do you have a small loaf as well?" },
      { who: "kasserer", no: "Ja, et lite brød og et stort brød.", uk: "Так, маленький хліб і великий хліб.", en: "Yes, a small loaf and a big loaf." }
    ]},
    { art: { bg: "shop", chars: [{ id: "leo", x: 120, mood: "normal" }, { id: "kasserer", x: 300, mood: "happy" }], props: [{ type: "bread", x: 214, y: 192 }] }, lines: [
      { who: "leo", no: "Det lille brødet, takk.", uk: "Маленький, будь ласка.", en: "The small one, please." },
      { who: "kasserer", no: "Fint. Noe mer?", uk: "Добре. Ще щось?", en: "Fine. Anything else?" }
    ]},
    { art: { bg: "shop", chars: [{ id: "leo", x: 120, mood: "normal" }, { id: "kasserer", x: 300, mood: "happy" }], props: [{ type: "coins", x: 208, y: 198 }] }, lines: [
      { who: "leo", no: "Hvorfor sier vi «liten pose», men «lite brød»?", uk: "Чому кажуть «liten pose», але «lite brød»?", en: "Why do we say “liten pose” but “lite brød”?" },
      { who: "kasserer", no: "Fordi pose er et en-ord, og brød er et et-ord.", uk: "Бо «pose» — це en-слово, а «brød» — et-слово.", en: "Because “pose” is an en-word and “brød” is an et-word." }
    ]},
    { art: { bg: "shop", chars: [{ id: "kasserer", x: 120, mood: "normal" }, { id: "leo", x: 300, mood: "happy" }], props: [{ type: "note", x: 212, y: 196 }] }, lines: [
      { who: "kasserer", no: "En liten pose, et lite brød, små sko.", uk: "En liten pose, et lite brød, små sko.", en: "A small bag, a small loaf, small shoes." },
      { who: "leo", no: "Nå husker jeg det. Takk!", uk: "Тепер запамʼятав. Дякую!", en: "Now I will remember it. Thanks!" }
    ]}
  ],

  vocab: [
    ["stor", "великий", "big"],
    ["liten", "малий (en-слово)", "small (en-word)"],
    ["lite", "малий (et-слово)", "small (et-word)"],
    ["små", "малі (множина)", "small (plural)"],
    ["en pose", "пакет", "a bag"],
    ["et brød", "хліб", "a loaf"],
    ["sko", "взуття", "shoes"],
    ["å trenge", "потребувати", "to need"],
    ["hvorfor", "чому", "why"],
    ["fordi", "бо", "because"],
    ["å huske", "памʼятати", "to remember"],
    ["noe mer", "ще щось", "anything else"]
  ],

  words: {
    no: { "stor": "великий", "store": "великий", "liten": "малий", "lite": "малий", "lille": "малий", "små": "малі", "pose": "пакет", "posen": "пакет", "brød": "хліб", "brødet": "хліб", "sko": "взуття", "trenger": "потрібен", "hvorfor": "чому", "fordi": "бо", "en-ord": "en-слово", "et-ord": "et-слово", "husker": "памʼятаю" },
    en: { "stor": "big", "store": "the big", "liten": "small", "lite": "small", "lille": "the small", "små": "small", "pose": "bag", "posen": "the bag", "brød": "loaf", "brødet": "the loaf", "sko": "shoes", "trenger": "need", "hvorfor": "why", "fordi": "because", "en-ord": "an en-word", "et-ord": "an et-word", "husker": "remember" }
  }
});
