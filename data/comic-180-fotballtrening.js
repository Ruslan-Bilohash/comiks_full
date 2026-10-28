window.COMICS = window.COMICS || [];

/* p180 — A2: футбольне тренування. Наказовий спосіб (løp, send, husk), «skal» про найближчі плани
   й спортивні слова. Тато — тренер команди, тож і жартувати з дітьми йому можна. */
COMICS.push({
  id: "p180",
  level: "A2",
  category: "fritid",
  title: "Fotballtrening",
  titleUk: "Футбольне тренування",
  titleEn: "Football practice",
  summaryUk: "Тато тренує дитячу команду. Лео забув пляшку з водою, запустив м’яч у кущі, а потім забив гол Норі.",
  summaryEn: "Dad coaches the children’s team. Leo forgot his water bottle, kicked the ball into a bush and then scored against Nora.",
  summaryNo: "Pappa er trener for barnelaget. Leo glemte vannflaska, sparket ballen inn i en busk og scoret til slutt på Nora.",
  cover: 4,

  panels: [
    { art: { bg: "park", chars: [{ id: "pappa", x: 110, mood: "happy", pose: "cheer" }, { id: "nora", x: 250, mood: "grin" }, { id: "leo", x: 340, mood: "sad", flip: true }], props: [{ type: "ball", x: 185 }] }, lines: [
      { who: "pappa", no: "Velkommen på trening! Først løper vi to runder.", uk: "Ласкаво просимо на тренування! Спочатку пробігаємо два кола.", en: "Welcome to practice! First we run two laps." },
      { who: "nora", no: "To runder? Det er lett!", uk: "Два кола? Це легко!", en: "Two laps? That is easy!" },
      { who: "leo", no: "Å nei, jeg glemte vannflaska mi …", uk: "Ой ні, я забув свою пляшку з водою …", en: "Oh no, I forgot my water bottle …" }
    ]},
    { art: { bg: "park", chars: [{ id: "nora", x: 90, mood: "happy", pose: "point" }, { id: "pappa", x: 215, mood: "happy", pose: "point" }, { id: "leo", x: 335, mood: "grin", pose: "hold", flip: true }], props: [{ type: "ball", x: 150, y: 270 }] }, lines: [
      { who: "pappa", no: "Nå skal vi øve på pasninger. Send ballen til hverandre!", uk: "Тепер потренуємо передачі. Пасуйте м’яч одне одному!", en: "Now we are going to practise passing. Pass the ball to each other!" },
      { who: "nora", no: "Leo, ta imot!", uk: "Лео, приймай!", en: "Leo, here it comes!" }
    ]},
    { art: { bg: "park", chars: [{ id: "pappa", x: 110, mood: "grin", pose: "hips" }, { id: "leo", x: 290, mood: "surprised", pose: "point", flip: true }], props: [{ type: "ball", x: 368, y: 150 }], fx: "stars" }, lines: [
      { who: "pappa", no: "Ikke så hardt, Leo! Nå havnet ballen i busken.", uk: "Не так сильно, Лео! Тепер м’яч у кущах.", en: "Not so hard, Leo! Now the ball has landed in the bush." },
      { who: "leo", no: "Unnskyld! Jeg henter den.", uk: "Вибач! Я його принесу.", en: "Sorry! I will get it." }
    ]},
    { art: { bg: "park", chars: [{ id: "pappa", x: 100, mood: "happy", pose: "point" }, { id: "nora", x: 290, mood: "angry", pose: "hips", flip: true }], props: [{ type: "ball", x: 200 }] }, lines: [
      { who: "pappa", no: "Nå spiller vi kamp: tre mot tre. Nora står i mål for det røde laget.", uk: "Тепер граємо матч: троє на троє. Нора стоїть на воротах червоної команди.", en: "Now we play a match: three against three. Nora is in goal for the red team." },
      { who: "nora", no: "Ingen skal score på meg!", uk: "Мені ніхто не заб’є!", en: "Nobody is going to score against me!" }
    ]},
    { art: { bg: "park", chars: [{ id: "leo", x: 120, mood: "grin", pose: "cheer" }, { id: "nora", x: 300, mood: "surprised", flip: true }], props: [{ type: "ball", x: 360, y: 250 }], fx: "stars" }, lines: [
      { who: "leo", no: "Mål! Jeg scoret!", uk: "Гол! Я забив!", en: "Goal! I scored!" },
      { who: "nora", no: "Neiii! Men det var et fint skudd.", uk: "Ні-і-і! Але удар був гарний.", en: "Nooo! But it was a nice shot." }
    ]},
    { art: { bg: "park", chars: [{ id: "pappa", x: 110, mood: "happy", pose: "hold" }, { id: "leo", x: 300, mood: "grin", flip: true }], props: [{ type: "thermos", x: 160, y: 230 }] }, lines: [
      { who: "pappa", no: "Bra jobba i dag! Husk å drikke vann. Neste trening er på torsdag.", uk: "Сьогодні ви добре попрацювали! Не забувайте пити воду. Наступне тренування в четвер.", en: "Well done today! Remember to drink water. The next practice is on Thursday." },
      { who: "leo", no: "Pappa, kan jeg låne vannflaska di?", uk: "Тату, можна позичити твою пляшку з водою?", en: "Dad, can I borrow your water bottle?" }
    ]}
  ],

  vocab: [
    ["en trening", "тренування", "a practice, training"],
    ["en trener", "тренер", "a coach"],
    ["å løpe", "бігати", "to run"],
    ["en runde", "коло", "a lap"],
    ["ei vannflaske", "пляшка з водою", "a water bottle"],
    ["å glemme", "забувати", "to forget"],
    ["å øve på", "тренувати, вправлятися", "to practise"],
    ["en pasning", "передача (м’яча)", "a pass"],
    ["hverandre", "одне одного", "each other"],
    ["å ta imot", "приймати", "to receive"],
    ["hardt", "сильно", "hard"],
    ["å havne", "опинитися", "to end up"],
    ["en busk", "кущ", "a bush"],
    ["å hente", "принести, забрати", "to fetch"],
    ["en kamp", "матч", "a match"],
    ["et lag", "команда", "a team"],
    ["å stå i mål", "стояти на воротах", "to be in goal"],
    ["å score", "забити гол", "to score"],
    ["et mål", "гол; ворота", "a goal"],
    ["et skudd", "удар", "a shot"],
    ["bra jobba", "добре попрацювали", "well done"],
    ["å låne", "позичати", "to borrow"],
    ["på torsdag", "у четвер", "on Thursday"]
  ],

  words: {
    no: { "busken": "кущ (той кущ)", "hardt": "сильно", "havnet": "опинився", "kamp": "матч", "løper": "біжимо, бігаємо", "neiii": "ні-і-і", "pasninger": "передачі (м’яча)", "runder": "кола", "score": "забити гол", "skudd": "удар", "vannflaska": "пляшка з водою" },
    en: { "busken": "the bush", "hardt": "hard", "havnet": "ended up, landed", "kamp": "match", "løper": "run", "neiii": "nooo", "pasninger": "passes", "runder": "laps", "score": "score", "skudd": "shot", "vannflaska": "the water bottle" }
  }
});
