window.COMICS = window.COMICS || [];

/* p171 — A1: A1: найперші слова про самопочуття. Жодного минулого часу — лише «я є», «мені болить», «я лишаюся». */
COMICS.push({
  id: "p171",
  level: "A1",
  category: "helse",
  title: "Jeg er syk",
  titleUk: "Я захворів",
  titleEn: "I am ill",
  summaryUk: "Перші слова про самопочуття: болить голова, температура, лишитися вдома, подзвонити в садок. Усе в теперішньому часі й короткими реченнями.",
  summaryEn: "The first words about how you feel: a headache, a temperature, staying home, calling the kindergarten. All in the present tense and short sentences.",
  summaryNo: "De første ordene om hvordan du har det: vondt i hodet, feber, bli hjemme, ringe barnehagen. Alt i presens og korte setninger.",
  cover: 0,

  panels: [
    { art: { bg: "home", chars: [{ id: "mia", x: 120, mood: "sad" }, { id: "mamma", x: 300, mood: "surprised" }], props: [{ type: "sofa", x: 210, y: 196 }] }, lines: [
      { who: "mia", no: "Mamma, jeg er syk.", uk: "Мамо, я захворіла.", en: "Mum, I am ill." },
      { who: "mamma", no: "Å nei! Hva er galt?", uk: "Ой ні! Що сталося?", en: "Oh no! What is wrong?" }
    ]},
    { art: { bg: "home", chars: [{ id: "mia", x: 120, mood: "sad" }, { id: "mamma", x: 300, mood: "normal" }], props: [{ type: "mug", x: 212, y: 190 }] }, lines: [
      { who: "mia", no: "Jeg har vondt i hodet.", uk: "У мене болить голова.", en: "I have a headache." },
      { who: "mamma", no: "Har du feber også?", uk: "А температура теж є?", en: "Do you have a fever as well?" }
    ]},
    { art: { bg: "home", chars: [{ id: "mia", x: 120, mood: "normal" }, { id: "mamma", x: 300, mood: "normal", pose: "hold" }], props: [{ type: "thermos", x: 208, y: 192 }] }, lines: [
      { who: "mia", no: "Ja, jeg tror det. Jeg er varm.", uk: "Так, здається. Мені жарко.", en: "Yes, I think so. I am warm." },
      { who: "mamma", no: "Da blir du hjemme i dag.", uk: "Тоді сьогодні ти лишаєшся вдома.", en: "Then you are staying home today." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "mamma", x: 150, mood: "normal", pose: "hold" }, { id: "mia", x: 320, mood: "normal" }], props: [{ type: "phone", x: 230, y: 188 }] }, lines: [
      { who: "mamma", no: "Jeg ringer skolen nå.", uk: "Я зараз подзвоню в школу.", en: "I am calling the school now." },
      { who: "mamma", no: "Hei, Mia er syk i dag.", uk: "Добрий день, Мія сьогодні хвора.", en: "Hello, Mia is ill today." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "mamma", x: 150, mood: "happy" }, { id: "mia", x: 320, mood: "normal" }], props: [{ type: "mug", x: 236, y: 190 }] }, lines: [
      { who: "mamma", no: "Her er te med honning.", uk: "Ось чай із медом.", en: "Here is tea with honey." },
      { who: "mia", no: "Tusen takk, mamma.", uk: "Дуже дякую, мамо.", en: "Thank you so much, Mum." }
    ]},
    { art: { bg: "home", chars: [{ id: "mia", x: 200, mood: "happy" }], props: [{ type: "sofa", x: 212, y: 196 }] }, lines: [
      { who: "mia", no: "I morgen er jeg frisk igjen.", uk: "Завтра я знову буду здорова.", en: "Tomorrow I will be well again." },
      { who: "narrator", no: "Hvile og varm te hjelper.", uk: "Відпочинок і теплий чай допомагають.", en: "Rest and warm tea help." }
    ]}
  ],

  vocab: [
    ["syk", "хворий", "ill"],
    ["å ha vondt", "боліти", "to be in pain"],
    ["et hode", "голова", "a head"],
    ["en feber", "температура", "a fever"],
    ["varm", "гарячий", "warm"],
    ["å bli hjemme", "лишитися вдома", "to stay at home"],
    ["å ringe", "телефонувати", "to call"],
    ["ei te", "чай", "tea"],
    ["en honning", "мед", "honey"],
    ["frisk", "здоровий", "healthy"],
    ["i morgen", "завтра", "tomorrow"],
    ["ei hvile", "відпочинок", "rest"]
  ],

  words: {
    no: { "syk": "хвора", "vondt": "боляче", "hodet": "голова", "feber": "температура", "varm": "гаряча", "hjemme": "вдома", "ringer": "телефоную", "skolen": "школа", "te": "чай", "honning": "мед", "frisk": "здорова", "igjen": "знову", "hvile": "відпочинок", "hjelper": "допомагає", "galt": "не так" },
    en: { "syk": "ill", "vondt": "pain", "hodet": "the head", "feber": "fever", "varm": "warm", "hjemme": "at home", "ringer": "am calling", "skolen": "the school", "te": "tea", "honning": "honey", "frisk": "healthy", "igjen": "again", "hvile": "rest", "hjelper": "helps", "galt": "wrong" }
  }
});
