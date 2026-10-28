window.COMICS = window.COMICS || [];

/* p181 — B1: пожежні навчання в офісі. Корисна лексика безпеки на роботі (nødutgang, samlingsplass,
   verneombud) і модальні дієслова в минулому (måtte, skulle) — через смішну помилку Дениса. */
COMICS.push({
  id: "p181",
  level: "B1",
  category: "jobb",
  title: "Brannøvelse på jobben",
  titleUk: "Пожежні навчання на роботі",
  titleEn: "Fire drill at work",
  summaryUk: "Марія лише починає працювати в офісі, а тут — навчальна пожежна тривога. Руслан пояснює правила, а Денис повертається по каву.",
  summaryEn: "Maria has just started at the office when a fire drill begins. Ruslan explains the rules, and Denys goes back for his coffee.",
  summaryNo: "Maria er ny på kontoret, og så er det brannøvelse. Ruslan forklarer reglene, og Denys går tilbake etter kaffen.",
  cover: 2,

  panels: [
    { art: { bg: "office", chars: [{ id: "denys", x: 110, mood: "happy", s: 0.9 }, { id: "maria", x: 300, mood: "surprised", s: 0.9, flip: true }], props: [{ type: "officedesk", x: 300, y: 292 }, { type: "computer", x: 300, y: 214 }] }, lines: [
      { who: "narrator", no: "Mandag klokka ti på kontoret.", uk: "Понеділок, десята година, офіс.", en: "Monday, ten o’clock, at the office." },
      { who: "denys", no: "Maria, har du hørt? Vi skal ha brannøvelse i dag.", uk: "Маріє, ти чула? Сьогодні в нас пожежні навчання.", en: "Maria, have you heard? We are having a fire drill today." },
      { who: "maria", no: "I dag? Jeg vet ikke engang hvor nødutgangen er.", uk: "Сьогодні? Я навіть не знаю, де аварійний вихід.", en: "Today? I don’t even know where the emergency exit is." }
    ]},
    { art: { bg: "office", board: "NØDUTGANG → TRAPP", chars: [{ id: "ruslan", x: 110, mood: "normal", pose: "point", s: 0.9 }, { id: "maria", x: 300, mood: "normal", s: 0.9, flip: true }] }, lines: [
      { who: "ruslan", no: "Jeg er verneombud. Nødutgangen er ved trappa. Ikke ta heisen – den kan stoppe hvis det brenner.", uk: "Я уповноважений з охорони праці. Аварійний вихід біля сходів. Не їдьте ліфтом — під час пожежі він може зупинитися.", en: "I am the safety representative. The emergency exit is by the stairs. Don’t take the lift – it can stop if there is a fire." },
      { who: "maria", no: "Takk! Det er godt å vite.", uk: "Дякую! Добре знати.", en: "Thanks! That is good to know." }
    ]},
    { art: { bg: "office", chars: [{ id: "denys", x: 110, mood: "surprised", pose: "point", s: 0.9 }, { id: "maria", x: 300, mood: "surprised", pose: "hold", s: 0.9, flip: true }], props: [{ type: "computer", x: 300, y: 214 }], sfx: { x: 205, y: 262 } }, lines: [
      { who: "sfx", no: "PIIIP! PIIIP!", uk: "ПІ-І-ІП! ПІ-І-ІП!", en: "BEEEP! BEEEP!" },
      { who: "denys", no: "Der går alarmen! Vi lar alt ligge og går rolig ut.", uk: "Ось і тривога! Усе залишаємо й спокійно виходимо.", en: "There goes the alarm! We leave everything and walk out calmly." },
      { who: "maria", no: "Skal jeg ikke ta med PC-en?", uk: "А ноутбук не брати?", en: "Shouldn’t I take my laptop?" },
      { who: "denys", no: "Nei. Liv er viktigere enn ting.", uk: "Ні. Життя важливіше за речі.", en: "No. Lives are more important than things." }
    ]},
    { art: { bg: "street", chars: [{ id: "ruslan", x: 110, mood: "normal", pose: "hold", s: 0.9 }, { id: "maria", x: 300, mood: "normal", s: 0.9, flip: true }], props: [{ type: "docs", x: 150, y: 230 }, { type: "car", x: 330, y: 292, s: 0.7 }] }, lines: [
      { who: "ruslan", no: "Alle møtes på samlingsplassen ved parkeringsplassen. Jeg krysser av på lista.", uk: "Усі збираються на місці збору біля парковки. Я відмічаю за списком.", en: "Everyone meets at the assembly point by the car park. I tick people off the list." },
      { who: "maria", no: "Er alle her?", uk: "Усі тут?", en: "Is everyone here?" },
      { who: "ruslan", no: "Nei, Denys mangler!", uk: "Ні, бракує Дениса!", en: "No, Denys is missing!" }
    ]},
    { art: { bg: "street", chars: [{ id: "denys", x: 110, mood: "grin", pose: "walk", s: 0.9 }, { id: "ruslan", x: 300, mood: "angry", pose: "hips", s: 0.9, flip: true }], props: [{ type: "mug", x: 150, y: 220 }] }, lines: [
      { who: "denys", no: "Beklager, jeg måtte bare hente kaffen min …", uk: "Вибачте, я мусив лише забрати свою каву …", en: "Sorry, I just had to get my coffee …" },
      { who: "ruslan", no: "Denys! Det var akkurat det vi ikke skulle gjøre.", uk: "Денисе! Саме цього ми й не мали робити.", en: "Denys! That was exactly what we were not supposed to do." }
    ]},
    { art: { bg: "office", chars: [{ id: "ruslan", x: 90, mood: "happy", pose: "point", s: 0.9 }, { id: "denys", x: 220, mood: "sad", s: 0.85 }, { id: "maria", x: 330, mood: "happy", s: 0.9, flip: true }] }, lines: [
      { who: "ruslan", no: "Øvelsen tok fire minutter. Neste gang går vi raskere ut – uten kaffe.", uk: "Навчання тривали чотири хвилини. Наступного разу виходимо швидше — без кави.", en: "The drill took four minutes. Next time we get out faster – without coffee." },
      { who: "maria", no: "Nå vet jeg hvor både nødutgangen og brannslukkeren er.", uk: "Тепер я знаю, де і аварійний вихід, і вогнегасник.", en: "Now I know where both the emergency exit and the fire extinguisher are." }
    ]}
  ],

  vocab: [
    ["en brannøvelse", "пожежні навчання", "a fire drill"],
    ["en brannalarm", "пожежна сигналізація", "a fire alarm"],
    ["en nødutgang", "аварійний вихід", "an emergency exit"],
    ["ei trapp", "сходи", "stairs"],
    ["en heis", "ліфт", "a lift, an elevator"],
    ["et verneombud", "уповноважений з охорони праці", "a safety representative"],
    ["å brenne", "горіти", "to burn"],
    ["å la alt ligge", "усе залишити", "to leave everything"],
    ["rolig", "спокійно", "calmly"],
    ["å ta med", "брати з собою", "to bring, to take along"],
    ["viktigere enn", "важливіше, ніж", "more important than"],
    ["en samlingsplass", "місце збору", "an assembly point"],
    ["å krysse av", "відмічати (галочкою)", "to tick off"],
    ["ei liste", "список", "a list"],
    ["å mangle", "бракувати", "to be missing"],
    ["å måtte", "мусити", "to have to"],
    ["akkurat", "саме, якраз", "exactly"],
    ["raskere", "швидше", "faster"],
    ["en brannslukker", "вогнегасник", "a fire extinguisher"],
    ["engang", "навіть", "even"]
  ],

  words: {
    no: { "alarmen": "тривога, сигналізація", "brannslukkeren": "вогнегасник", "brannøvelse": "пожежні навчання", "brenner": "горить", "engang": "навіть", "heisen": "ліфт", "hørt": "чув(ла)", "krysser": "відмічаю (krysse av)", "ligge": "лежати (la ligge — залишити)", "lista": "список", "liv": "життя", "nødutgangen": "аварійний вихід", "pc-en": "комп’ютер, ноутбук", "piiip": "пі-і-іп", "raskere": "швидше", "samlingsplassen": "місце збору", "skulle": "мали, мусили", "stoppe": "зупинитися", "trappa": "сходи", "verneombud": "уповноважений з охорони праці", "viktigere": "важливіше", "øvelsen": "навчання (вправа)", "beklager": "вибачте" },
    en: { "alarmen": "the alarm", "brannslukkeren": "the fire extinguisher", "brannøvelse": "fire drill", "brenner": "is burning", "engang": "even", "heisen": "the lift", "hørt": "heard", "krysser": "tick (krysse av — tick off)", "ligge": "lie (la ligge — leave)", "lista": "the list", "liv": "life, lives", "nødutgangen": "the emergency exit", "pc-en": "the PC, laptop", "piiip": "beeep", "raskere": "faster", "samlingsplassen": "the assembly point", "skulle": "were supposed to", "stoppe": "stop", "trappa": "the stairs", "verneombud": "safety representative", "viktigere": "more important", "øvelsen": "the drill", "beklager": "sorry" }
  }
});
