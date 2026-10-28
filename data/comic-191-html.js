window.COMICS = window.COMICS || [];

/* p191 — A2, «Програмування»: основи HTML. Нора й Лео роблять сайт про кота Пуса: теги в
   кутових дужках, відкривальний і закривальний тег, h1, p, img, a. Нові малюнки: вікно
   браузера з готовою сторінкою (browser) і пара тегів (tagpair). */
COMICS.push({
  id: "p191",
  level: "A2",
  category: "koding",
  style: "code",
  title: "Nettsiden til Pus",
  titleUk: "Сайт про Пуса: основи HTML",
  titleEn: "A website for Pus: HTML basics",
  summaryUk: "Нора й Лео роблять сайт про кота Пуса. Робо пояснює HTML: теги в кутових дужках, заголовок <h1>, абзац <p>, картинка <img> і посилання <a>.",
  summaryEn: "Nora and Leo make a website about Pus the cat. Robo explains HTML: tags in angle brackets, a heading <h1>, a paragraph <p>, an image <img> and a link <a>.",
  summaryNo: "Nora og Leo lager en nettside om katten Pus. Robo forklarer HTML: tagger i spisse klammer, overskrift <h1>, avsnitt <p>, bilde <img> og lenke <a>.",
  cover: 4,

  panels: [
    { art: { bg: "lab", code: ["<!DOCTYPE html>", "<html>", "  <body>", "  </body>", "</html>"], chars: [{ id: "nora", x: 80, mood: "grin", pose: "point" }, { id: "leo", x: 195, mood: "happy" }, { id: "pus", x: 320, mood: "happy", flip: true }] }, lines: [
      { who: "nora", no: "Jeg vil lage en nettside om katten vår, Pus!", uk: "Я хочу зробити сайт про нашого кота Пуса!", en: "I want to make a website about our cat, Pus!" },
      { who: "leo", no: "Da trenger vi HTML.", uk: "Тоді нам потрібен HTML.", en: "Then we need HTML." }
    ]},
    { art: { bg: "lab", code: ["<h1>", "<p>", "<img>", "<a>"], chars: [{ id: "robo", x: 95, mood: "happy", pose: "point" }, { id: "leo", x: 315, mood: "surprised", flip: true }], props: [{ type: "codecard", x: 205, y: 205, text: "< >", tilt: -4 }] }, lines: [
      { who: "robo", no: "HTML bygger nettsider. Det består av tagger.", uk: "HTML будує сайти. Він складається з тегів.", en: "HTML builds web pages. It is made of tags." },
      { who: "leo", no: "Hva er en tagg?", uk: "Що таке тег?", en: "What is a tag?" },
      { who: "robo", no: "En tagg er et kort ord i spisse klammer, for eksempel p.", uk: "Тег — це коротке слово в кутових дужках, наприклад p.", en: "A tag is a short word in angle brackets, for example p." }
    ]},
    { art: { bg: "lab", code: ["<p>Hei!</p>"], chars: [{ id: "robo", x: 80, mood: "happy", pose: "point" }, { id: "nora", x: 325, mood: "grin", pose: "point", flip: true }], props: [{ type: "tagpair", x: 205, y: 215, tag: "p", text: "Hei!" }] }, lines: [
      { who: "robo", no: "De fleste tagger har en start og en slutt. Slutt-taggen har en skråstrek.", uk: "Більшість тегів мають початок і кінець. У закривальному тезі є скісна риска.", en: "Most tags have a start and an end. The end tag has a slash." },
      { who: "nora", no: "Som en sandwich!", uk: "Як бутерброд!", en: "Like a sandwich!" }
    ]},
    { art: { bg: "lab", code: ["<h1>Pus</h1>"], chars: [{ id: "nora", x: 70, mood: "happy", pose: "point" }, { id: "robo", x: 330, mood: "grin", flip: true }], props: [{ type: "browser", x: 200, y: 262, items: [{ t: "h1", x: "Pus" }] }] }, lines: [
      { who: "nora", no: "Jeg skriver h1 og «Pus». Det blir en stor overskrift!", uk: "Я пишу h1 і «Пус». Виходить великий заголовок!", en: "I write h1 and “Pus”. It becomes a big heading!" },
      { who: "robo", no: "Ja. h1 betyr overskrift nummer én.", uk: "Так. h1 означає заголовок номер один.", en: "Yes. h1 means heading number one." }
    ]},
    { art: { bg: "lab", code: ["<p>Pus er en katt.</p>", "<img src=\"pus.png\">"], chars: [{ id: "leo", x: 70, mood: "happy", pose: "point" }, { id: "nora", x: 330, mood: "surprised", flip: true }], props: [{ type: "browser", x: 200, y: 262, items: [{ t: "h1", x: "Pus" }, { t: "p", x: "Pus er en katt." }, { t: "img", x: "🐱" }] }] }, lines: [
      { who: "leo", no: "Med p lager vi et avsnitt, og med img viser vi et bilde.", uk: "Тегом p робимо абзац, а тегом img показуємо картинку.", en: "With p we make a paragraph, and with img we show a picture." },
      { who: "nora", no: "Se, et bilde av Pus!", uk: "Дивись, фото Пуса!", en: "Look, a picture of Pus!" }
    ]},
    { art: { bg: "lab", code: ["<a href=\"mer.html\">", "  Les mer", "</a>"], chars: [{ id: "nora", x: 70, mood: "grin", pose: "cheer" }, { id: "robo", x: 330, mood: "grin", pose: "wave", flip: true }], props: [{ type: "browser", x: 200, y: 262, items: [{ t: "h1", x: "Pus" }, { t: "img", x: "🐱" }, { t: "a", x: "Les mer om Pus" }] }], fx: "stars" }, lines: [
      { who: "nora", no: "Til slutt en lenke. Taggen a tar oss til en annen side.", uk: "Наостанок посилання. Тег a веде на іншу сторінку.", en: "Finally a link. The a tag takes us to another page." },
      { who: "robo", no: "Nettsiden er klar! Neste gang gjør vi den fin med CSS.", uk: "Сайт готовий! Наступного разу зробимо його гарним за допомогою CSS.", en: "The website is ready! Next time we will make it pretty with CSS." }
    ]}
  ],

  tasks: [
    { type: "concept", q: ["Hva betyr <h1>?", "Що означає <h1>?", "What does <h1> mean?"], answer: ["En stor overskrift", "Великий заголовок", "A big heading"],
      wrong: [["Et bilde", "Картинка", "An image"], ["En lenke", "Посилання", "A link"], ["Et lite avsnitt", "Маленький абзац", "A small paragraph"]] },
    { type: "concept", q: ["Hvordan ser slutt-taggen til <p> ut?", "Як виглядає закривальний тег для <p>?", "What does the end tag for <p> look like?"], answer: ["</p>", "</p>", "</p>"],
      wrong: [["<p>", "<p>", "<p>"], ["<\\p>", "<\\p>", "<\\p>"], ["(p)", "(p)", "(p)"]] },
    { type: "concept", q: ["Hvilken tagg viser et bilde?", "Який тег показує картинку?", "Which tag shows an image?"], answer: ["<img>", "<img>", "<img>"],
      wrong: [["<a>", "<a>", "<a>"], ["<h1>", "<h1>", "<h1>"], ["<p>", "<p>", "<p>"]] },
    { type: "algo", no: "Lag en enkel nettside", uk: "Зроби простий сайт", en: "Make a simple web page",
      steps: [["Skriv <html> og <body>", "Напиши <html> і <body>", "Write <html> and <body>"], ["Lag en overskrift med <h1>", "Зроби заголовок тегом <h1>", "Make a heading with <h1>"], ["Skriv et avsnitt med <p>", "Напиши абзац тегом <p>", "Write a paragraph with <p>"], ["Lukk med </body> og </html>", "Закрий тегами </body> і </html>", "Close with </body> and </html>"]] }
  ],

  vocab: [
    ["ei nettside", "сайт, вебсторінка", "a website, a web page"],
    ["HTML", "HTML — мова розмітки сторінок", "HTML — the language of web pages"],
    ["ei tagg", "тег", "a tag"],
    ["spisse klammer", "кутові дужки < >", "angle brackets < >"],
    ["å bestå av", "складатися з", "to consist of"],
    ["en start", "початок", "a start"],
    ["en slutt", "кінець", "an end"],
    ["ei slutt-tagg", "закривальний тег", "an end tag"],
    ["en skråstrek", "скісна риска /", "a slash /"],
    ["ei overskrift", "заголовок", "a heading"],
    ["et avsnitt", "абзац", "a paragraph"],
    ["et bilde", "картинка, фото", "a picture, an image"],
    ["ei lenke", "посилання", "a link"],
    ["å vise", "показувати", "to show"],
    ["til slutt", "наостанок", "finally"],
    ["klar", "готовий", "ready"],
    ["neste gang", "наступного разу", "next time"]
  ]
});
