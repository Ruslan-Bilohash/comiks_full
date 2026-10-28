window.COMICS = window.COMICS || [];

/* p186 — A1, «Програмування»: умова «якщо… то… інакше». Мама й Лео складають для Робо
   правило про парасольку й сонцезахисні окуляри, а Лео — своє правило про морозиво. */
COMICS.push({
  id: "p186",
  level: "A1",
  category: "koding",
  style: "code",
  title: "Hvis det regner …",
  titleUk: "Якщо йде дощ…",
  titleEn: "If it rains …",
  summaryUk: "Робо не знає, коли брати парасольку. Лео й мама пишуть для нього правило: якщо йде дощ — парасолька, інакше — сонцезахисні окуляри.",
  summaryEn: "Robo does not know when to take an umbrella. Leo and Mum write him a rule: if it rains — an umbrella, otherwise — sunglasses.",
  summaryNo: "Robo vet ikke når han skal ta med paraply. Leo og mamma skriver en regel: hvis det regner – paraply, ellers – solbriller.",
  cover: 2,

  panels: [
    { art: { bg: "home", chars: [{ id: "mamma", x: 85, mood: "happy" }, { id: "leo", x: 195, mood: "happy", pose: "point" }, { id: "robo", x: 315, mood: "surprised", flip: true }], props: [{ type: "umbrella", x: 255, y: 270 }] }, lines: [
      { who: "leo", no: "Robo, vi skal gå ut. Ta med paraply.", uk: "Робо, ми йдемо на вулицю. Візьми парасольку.", en: "Robo, we are going out. Bring an umbrella." },
      { who: "robo", no: "Hvorfor? Sola skinner.", uk: "Навіщо? Світить сонце.", en: "Why? The sun is shining." }
    ]},
    { art: { bg: "home", chars: [{ id: "mamma", x: 95, mood: "happy", pose: "point" }, { id: "robo", x: 300, mood: "normal", flip: true }] }, lines: [
      { who: "mamma", no: "Du har rett, Robo. Vi trenger en regel.", uk: "Твоя правда, Робо. Нам потрібне правило.", en: "You are right, Robo. We need a rule." },
      { who: "mamma", no: "Hvis det regner, tar vi paraply.", uk: "Якщо йде дощ, беремо парасольку.", en: "If it rains, we take an umbrella." }
    ]},
    { art: { bg: "home", chars: [{ id: "leo", x: 90, mood: "grin", pose: "point" }, { id: "robo", x: 305, mood: "happy", flip: true }], props: [{ type: "codecard", x: 200, y: 100, text: "hvis regn: paraply" }, { type: "codecard", x: 200, y: 150, text: "ellers: solbriller", color: "#3949ab", ink: "#fff", tilt: 2 }] }, lines: [
      { who: "leo", no: "Hvis det regner, så tar vi paraply. Ellers tar vi solbriller.", uk: "Якщо йде дощ, то беремо парасольку. Інакше беремо сонцезахисні окуляри.", en: "If it rains, then we take an umbrella. Otherwise we take sunglasses." },
      { who: "robo", no: "Hvis … så … ellers. Forstått!", uk: "Якщо… то… інакше. Зрозумів!", en: "If … then … otherwise. Understood!" }
    ]},
    { art: { bg: "park", chars: [{ id: "leo", x: 100, mood: "happy", pose: "cheer" }, { id: "robo", x: 290, mood: "happy", pose: "hold", flip: true }], props: [{ type: "umbrella", x: 290, y: 200 }], fx: "rain" }, lines: [
      { who: "robo", no: "Det regner. Jeg tar paraplyen.", uk: "Іде дощ. Я беру парасольку.", en: "It is raining. I am taking the umbrella." },
      { who: "leo", no: "Bra, Robo!", uk: "Молодець, Робо!", en: "Good, Robo!" }
    ]},
    { art: { bg: "park", chars: [{ id: "mamma", x: 95, mood: "grin" }, { id: "robo", x: 295, mood: "grin", pose: "wave", flip: true }] }, lines: [
      { who: "robo", no: "Nå skinner sola. Jeg tar solbriller.", uk: "Тепер світить сонце. Я беру сонцезахисні окуляри.", en: "Now the sun is shining. I am taking sunglasses." },
      { who: "mamma", no: "Robo tenker som en datamaskin.", uk: "Робо думає, як комп’ютер.", en: "Robo thinks like a computer." }
    ]},
    { art: { bg: "home", chars: [{ id: "leo", x: 100, mood: "grin", pose: "point" }, { id: "mamma", x: 295, mood: "happy", pose: "hips", flip: true }], props: [{ type: "icecream", x: 200, y: 230 }] }, lines: [
      { who: "leo", no: "Hvis jeg rydder rommet, så får jeg is?", uk: "Якщо я приберу кімнату, то отримаю морозиво?", en: "If I tidy my room, then I get ice cream?" },
      { who: "mamma", no: "Ja! Det er en god regel.", uk: "Так! Це гарне правило.", en: "Yes! That is a good rule." }
    ]}
  ],

  tasks: [
    { type: "concept", q: ["«Hvis det regner, ta paraply. Ellers ta solbriller.» Sola skinner. Hva tar Robo?", "«Якщо дощ — парасолька, інакше — окуляри.» Світить сонце. Що візьме Робо?", "“If it rains, take an umbrella. Otherwise take sunglasses.” The sun is shining. What does Robo take?"],
      answer: ["Solbriller", "Сонцезахисні окуляри", "Sunglasses"], wrong: [["Paraply", "Парасольку", "An umbrella"], ["Både paraply og solbriller", "І те, і те", "Both"], ["Ingenting", "Нічого", "Nothing"]] },
    { type: "concept", q: ["Hvilket ord bruker vi for en betingelse?", "Яким словом позначаємо умову?", "Which word do we use for a condition?"], answer: ["hvis", "hvis (якщо)", "hvis (if)"],
      wrong: [["gjenta", "gjenta (повтори)", "gjenta (repeat)"], ["hopp", "hopp (стрибай)", "hopp (jump)"], ["stopp", "stopp (стоп)", "stopp (stop)"]] }
  ],

  vocab: [
    ["hvis", "якщо", "if"],
    ["ellers", "інакше", "otherwise, else"],
    ["en regel", "правило", "a rule"],
    ["en paraply", "парасолька", "an umbrella"],
    ["solbriller", "сонцезахисні окуляри", "sunglasses"],
    ["å regne", "іти (про дощ)", "to rain"],
    ["sola skinner", "світить сонце", "the sun is shining"],
    ["å gå ut", "виходити на вулицю", "to go out"],
    ["å ta med", "брати з собою", "to bring"],
    ["hvorfor", "чому, навіщо", "why"],
    ["å ha rett", "мати рацію", "to be right"],
    ["forstått", "зрозуміло", "understood"],
    ["å tenke", "думати", "to think"],
    ["å rydde", "прибирати", "to tidy"],
    ["et rom", "кімната", "a room"],
    ["en is", "морозиво", "an ice cream"]
  ]
});
