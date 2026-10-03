window.COMICS = window.COMICS || [];

/* p172 — A1: A1: назви кімнат і прийменник «på/i». Жодних описів — лише «ось це», «тут ми робимо те». */
COMICS.push({
  id: "p172",
  level: "A1",
  category: "bolig",
  title: "Hjemme hos meg",
  titleUk: "У мене вдома",
  titleEn: "At my place",
  summaryUk: "Кімнати житла простими словами: кухня, вітальня, спальня, ванна, балкон. Музa показує Лео свою квартиру.",
  summaryEn: "The rooms of a home in simple words: kitchen, living room, bedroom, bathroom, balcony. Musa shows Leo around his flat.",
  summaryNo: "Rommene i et hjem med enkle ord: kjøkken, stue, soverom, bad, balkong. Musa viser Leo leiligheten sin.",
  cover: 0,

  panels: [
    { art: { bg: "home", chars: [{ id: "musa", x: 130, mood: "happy", pose: "wave" }, { id: "leo", x: 310, mood: "happy" }], props: [{ type: "keys", x: 220, y: 188 }] }, lines: [
      { who: "musa", no: "Velkommen hjem til meg!", uk: "Ласкаво прошу до мене!", en: "Welcome to my home!" },
      { who: "leo", no: "Takk! Leiligheten er fin.", uk: "Дякую! Гарна квартира.", en: "Thanks! The flat is nice." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "musa", x: 140, mood: "normal", pose: "point" }, { id: "leo", x: 320, mood: "normal" }], props: [{ type: "table", x: 225, y: 194 }] }, lines: [
      { who: "musa", no: "Her er kjøkkenet. Vi spiser her.", uk: "Ось кухня. Ми тут їмо.", en: "Here is the kitchen. We eat here." },
      { who: "leo", no: "Bordet er stort!", uk: "Стіл великий!", en: "The table is big!" }
    ]},
    { art: { bg: "home", chars: [{ id: "musa", x: 140, mood: "normal", pose: "point" }, { id: "leo", x: 320, mood: "happy" }], props: [{ type: "sofa", x: 222, y: 196 }] }, lines: [
      { who: "musa", no: "Dette er stua. Her ser vi på TV.", uk: "Це вітальня. Тут ми дивимось телевізор.", en: "This is the living room. We watch TV here." },
      { who: "leo", no: "Sofaen er myk.", uk: "Диван мʼякий.", en: "The sofa is soft." }
    ]},
    { art: { bg: "home", chars: [{ id: "musa", x: 140, mood: "normal" }, { id: "leo", x: 320, mood: "surprised" }], props: [{ type: "book", x: 224, y: 190 }] }, lines: [
      { who: "musa", no: "Soverommet mitt er der.", uk: "Моя спальня он там.", en: "My bedroom is over there." },
      { who: "musa", no: "Jeg leser hver kveld.", uk: "Я читаю щовечора.", en: "I read every evening." }
    ]},
    { art: { bg: "home", chars: [{ id: "musa", x: 140, mood: "normal" }, { id: "leo", x: 320, mood: "normal" }], props: [{ type: "plant", x: 226, y: 192 }] }, lines: [
      { who: "leo", no: "Har dere balkong?", uk: "А балкон у вас є?", en: "Do you have a balcony?" },
      { who: "musa", no: "Ja, med blomster. Kom og se!", uk: "Так, із квітами. Ходімо подивимось!", en: "Yes, with flowers. Come and see!" }
    ]},
    { art: { bg: "home", chars: [{ id: "musa", x: 150, mood: "grin" }, { id: "leo", x: 320, mood: "happy", pose: "cheer" }], props: [{ type: "mug", x: 230, y: 190 }] }, lines: [
      { who: "leo", no: "Her vil jeg bo også!", uk: "Я б теж хотів тут жити!", en: "I want to live here too!" },
      { who: "musa", no: "Du er alltid velkommen.", uk: "Ти завжди бажаний гість.", en: "You are always welcome." }
    ]}
  ],

  vocab: [
    ["ei leilighet", "квартира", "a flat"],
    ["et kjøkken", "кухня", "a kitchen"],
    ["ei stue", "вітальня", "a living room"],
    ["et soverom", "спальня", "a bedroom"],
    ["et bad", "ванна кімната", "a bathroom"],
    ["en balkong", "балкон", "a balcony"],
    ["et bord", "стіл", "a table"],
    ["en sofa", "диван", "a sofa"],
    ["myk", "мʼякий", "soft"],
    ["en blomst", "квітка", "a flower"],
    ["å bo", "жити", "to live"],
    ["velkommen", "ласкаво просимо", "welcome"]
  ],

  words: {
    no: { "leiligheten": "квартира", "kjøkkenet": "кухня", "stua": "вітальня", "soverommet": "спальня", "balkong": "балкон", "bordet": "стіл", "sofaen": "диван", "myk": "мʼякий", "blomster": "квіти", "bo": "жити", "velkommen": "ласкаво просимо", "spiser": "їмо", "leser": "читаю", "kveld": "вечір" },
    en: { "leiligheten": "the flat", "kjøkkenet": "the kitchen", "stua": "the living room", "soverommet": "the bedroom", "balkong": "balcony", "bordet": "the table", "sofaen": "the sofa", "myk": "soft", "blomster": "flowers", "bo": "to live", "velkommen": "welcome", "spiser": "eat", "leser": "read", "kveld": "evening" }
  }
});
