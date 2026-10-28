window.COMICS = window.COMICS || [];

/* p185 — A1, «Програмування»: цикл. Нора довго диктує Робо танець «стрибок, оплеск…»,
   а вчителька показує коротший запис: «gjenta 4 ganger». Робо врешті паморочиться. */
COMICS.push({
  id: "p185",
  level: "A1",
  category: "koding",
  style: "code",
  title: "Gjenta! Robo danser",
  titleUk: "Повтори! Робо танцює",
  titleEn: "Repeat! Robo dances",
  summaryUk: "Нора хоче, щоб Робо танцював, але команд забагато. Вчителька показує цикл: «повтори 4 рази» — і програма стає короткою.",
  summaryEn: "Nora wants Robo to dance, but there are too many commands. The teacher shows a loop: “repeat 4 times” — and the program becomes short.",
  summaryNo: "Nora vil at Robo skal danse, men det blir altfor mange kommandoer. Læreren viser en løkke: «gjenta 4 ganger» – og programmet blir kort.",
  cover: 3,

  panels: [
    { art: { bg: "lab", code: ["hopp", "klapp", "hopp", "klapp", "hopp …"], chars: [{ id: "nora", x: 85, mood: "grin", pose: "point" }, { id: "robo", x: 300, mood: "happy", pose: "cheer", flip: true }] }, lines: [
      { who: "nora", no: "Robo, hopp! Klapp! Hopp! Klapp! Hopp! Klapp!", uk: "Робо, стрибок! Оплеск! Стрибок! Оплеск! Стрибок! Оплеск!", en: "Robo, jump! Clap! Jump! Clap! Jump! Clap!" },
      { who: "robo", no: "Hopp. Klapp. Hopp. Klapp …", uk: "Стрибок. Оплеск. Стрибок. Оплеск…", en: "Jump. Clap. Jump. Clap …" }
    ]},
    { art: { bg: "lab", code: ["hopp", "klapp", "hopp", "klapp", "hopp …"], chars: [{ id: "nora", x: 95, mood: "sad", pose: "hips" }, { id: "laerer", x: 295, mood: "happy", pose: "point", flip: true }] }, lines: [
      { who: "nora", no: "Puh, det er mye å skrive.", uk: "Фух, це так багато писати.", en: "Phew, that is a lot to write." },
      { who: "laerer", no: "Bruk en løkke! En løkke gjentar kommandoer.", uk: "Використай цикл! Цикл повторює команди.", en: "Use a loop! A loop repeats commands." }
    ]},
    { art: { bg: "lab", code: ["gjenta 4 ganger:", "    hopp", "    klapp"], chars: [{ id: "laerer", x: 85, mood: "happy", pose: "point" }, { id: "nora", x: 315, mood: "surprised", flip: true }], props: [{ type: "blocks", x: 205, y: 250, items: ["gjenta 4 ganger", "hopp", "klapp"] }] }, lines: [
      { who: "laerer", no: "Skriv: gjenta fire ganger: hopp og klapp.", uk: "Напиши: повтори чотири рази: стрибок і оплеск.", en: "Write: repeat four times: jump and clap." },
      { who: "nora", no: "Så kort!", uk: "Як коротко!", en: "So short!" }
    ]},
    { art: { bg: "lab", code: ["gjenta 4 ganger:", "  hopp", "  klapp"], chars: [{ id: "leo", x: 85, mood: "grin", pose: "cheer" }, { id: "robo", x: 290, mood: "grin", pose: "cheer", flip: true }], fx: "stars" }, lines: [
      { who: "robo", no: "Hopp, klapp! Hopp, klapp! Hopp, klapp! Hopp, klapp!", uk: "Стрибок, оплеск! Стрибок, оплеск! Стрибок, оплеск! Стрибок, оплеск!", en: "Jump, clap! Jump, clap! Jump, clap! Jump, clap!" },
      { who: "leo", no: "Robo danser!", uk: "Робо танцює!", en: "Robo is dancing!" }
    ]},
    { art: { bg: "lab", code: ["gjenta 100 ganger:", "  hopp", "  klapp"], chars: [{ id: "leo", x: 90, mood: "happy", pose: "point" }, { id: "laerer", x: 300, mood: "happy", flip: true }] }, lines: [
      { who: "leo", no: "Kan vi gjenta hundre ganger?", uk: "А можна повторити сто разів?", en: "Can we repeat it a hundred times?" },
      { who: "laerer", no: "Ja. Datamaskiner blir aldri slitne.", uk: "Так. Комп’ютери ніколи не втомлюються.", en: "Yes. Computers never get tired." }
    ]},
    { art: { bg: "lab", code: ["gjenta 100 ganger:", "    hopp", "stopp()"], chars: [{ id: "robo", x: 110, mood: "surprised", pose: "hips" }, { id: "nora", x: 300, mood: "grin", pose: "point", flip: true }], fx: "stars" }, lines: [
      { who: "robo", no: "Men Robo blir svimmel …", uk: "Але в Робо паморочиться голова…", en: "But Robo is getting dizzy …" },
      { who: "nora", no: "Ha ha! Vi stopper løkka nå.", uk: "Ха-ха! Зупиняємо цикл.", en: "Ha ha! We are stopping the loop now." }
    ]}
  ],

  tasks: [
    { type: "concept", q: ["Hva gjør en løkke?", "Що робить цикл?", "What does a loop do?"], answer: ["Den gjentar kommandoer", "Повторює команди", "It repeats commands"],
      wrong: [["Den sletter programmet", "Видаляє програму", "It deletes the program"], ["Den slår av datamaskinen", "Вимикає комп’ютер", "It turns off the computer"], ["Den tegner et bilde", "Малює картинку", "It draws a picture"]] },
    { type: "concept", q: ["«gjenta 3 ganger: klapp». Hvor mange klapp blir det?", "«повтори 3 рази: оплеск». Скільки буде оплесків?", "“repeat 3 times: clap”. How many claps?"], answer: ["3", "3", "3"],
      wrong: [["1", "1", "1"], ["6", "6", "6"], ["30", "30", "30"]] }
  ],

  vocab: [
    ["å gjenta", "повторювати", "to repeat"],
    ["ei løkke", "цикл, петля", "a loop"],
    ["å hoppe", "стрибати", "to jump"],
    ["å klappe", "плескати", "to clap"],
    ["å danse", "танцювати", "to dance"],
    ["mye", "багато", "a lot"],
    ["å skrive", "писати", "to write"],
    ["å bruke", "використовувати", "to use"],
    ["fire ganger", "чотири рази", "four times"],
    ["kort", "короткий", "short"],
    ["hundre", "сто", "a hundred"],
    ["ei datamaskin", "комп’ютер", "a computer"],
    ["aldri", "ніколи", "never"],
    ["sliten", "втомлений", "tired"],
    ["svimmel", "з запамороченням", "dizzy"],
    ["å stoppe", "зупиняти", "to stop"]
  ]
});
