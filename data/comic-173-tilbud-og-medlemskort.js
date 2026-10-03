window.COMICS = window.COMICS || [];

/* p173 — A2: A2: торг і цифри. Головне тут — питати ціну й розуміти відповідь, а не просто читати цінник. */
COMICS.push({
  id: "p173",
  level: "A2",
  category: "butikk",
  title: "Tilbud og medlemskort",
  titleUk: "Знижки й картка покупця",
  titleEn: "Offers and a loyalty card",
  summaryUk: "Те, що в Норвегії трапляється щотижня: ціна за кілограм, «три за двома», термін придатності й картка покупця на касі.",
  summaryEn: "What happens every week in Norway: the price per kilo, three-for-two, the use-by date and the loyalty card at the till.",
  summaryNo: "Det som skjer hver uke i Norge: kilopris, tre for to, holdbarhetsdato og medlemskort i kassa.",
  cover: 0,

  panels: [
    { art: { bg: "shop", chars: [{ id: "maria", x: 130, mood: "normal" }, { id: "kasserer", x: 320, mood: "happy" }], props: [{ type: "apples", x: 220, y: 190 }] }, lines: [
      { who: "maria", no: "Unnskyld, hva koster eplene?", uk: "Перепрошую, скільки коштують яблука?", en: "Excuse me, how much are the apples?" },
      { who: "kasserer", no: "Tjuefem kroner kiloen.", uk: "Двадцять пʼять крон за кілограм.", en: "Twenty-five kroner a kilo." }
    ]},
    { art: { bg: "shop", chars: [{ id: "maria", x: 130, mood: "surprised" }, { id: "kasserer", x: 320, mood: "normal", pose: "point" }], props: [{ type: "note", x: 224, y: 186 }] }, lines: [
      { who: "kasserer", no: "I dag er det tre for to.", uk: "Сьогодні три за ціною двох.", en: "Today it is three for two." },
      { who: "maria", no: "Så bra! Gjelder det alt?", uk: "Чудово! Це на все?", en: "Great! Does that apply to everything?" }
    ]},
    { art: { bg: "shop", chars: [{ id: "maria", x: 130, mood: "normal" }, { id: "kasserer", x: 320, mood: "normal" }], props: [{ type: "milk", x: 222, y: 190 }] }, lines: [
      { who: "kasserer", no: "Nei, bare frukt og grønt.", uk: "Ні, тільки фрукти й овочі.", en: "No, only fruit and vegetables." },
      { who: "maria", no: "Greit. Jeg tar tre poser.", uk: "Гаразд. Візьму три пакети.", en: "All right. I will take three bags." }
    ]},
    { art: { bg: "shop", chars: [{ id: "maria", x: 130, mood: "surprised" }, { id: "kasserer", x: 320, mood: "normal" }], props: [{ type: "cheese", x: 226, y: 190 }] }, lines: [
      { who: "maria", no: "Går denne osten ut snart?", uk: "А цей сир скоро псується?", en: "Does this cheese go off soon?" },
      { who: "kasserer", no: "Den holder til fredag.", uk: "Він придатний до пʼятниці.", en: "It lasts until Friday." }
    ]},
    { art: { bg: "shop", chars: [{ id: "maria", x: 140, mood: "normal" }, { id: "kasserer", x: 320, mood: "happy" }], props: [{ type: "counter", x: 228, y: 192 }] }, lines: [
      { who: "kasserer", no: "Har du medlemskort hos oss?", uk: "У вас є наша картка покупця?", en: "Do you have our loyalty card?" },
      { who: "maria", no: "Nei, men jeg vil gjerne ha et.", uk: "Ні, але я хотіла б її оформити.", en: "No, but I would like one." }
    ]},
    { art: { bg: "shop", chars: [{ id: "maria", x: 140, mood: "grin" }, { id: "kasserer", x: 320, mood: "happy" }], props: [{ type: "coins", x: 230, y: 190 }] }, lines: [
      { who: "kasserer", no: "Da sparer du ti prosent på frukt.", uk: "Тоді ви заощадите десять відсотків на фруктах.", en: "Then you save ten per cent on fruit." },
      { who: "maria", no: "Det blir billigere enn jeg trodde.", uk: "Виходить дешевше, ніж я думала.", en: "That is cheaper than I thought." }
    ]}
  ],

  vocab: [
    ["et tilbud", "акція, знижка", "an offer"],
    ["en kilopris", "ціна за кілограм", "a price per kilo"],
    ["tre for to", "три за ціною двох", "three for two"],
    ["å gjelde", "стосуватися, діяти", "to apply"],
    ["frukt og grønt", "фрукти й овочі", "fruit and vegetables"],
    ["ei pose", "пакет", "a bag"],
    ["å gå ut", "псуватися, закінчуватися", "to go off"],
    ["å holde", "бути придатним", "to last"],
    ["et medlemskort", "картка покупця", "a membership card"],
    ["å spare", "заощаджувати", "to save"],
    ["en prosent", "відсоток", "a per cent"],
    ["billig", "дешевий", "cheap"]
  ],

  words: {
    no: { "koster": "коштують", "eplene": "яблука", "tjuefem": "двадцять пʼять", "kiloen": "кілограм", "tilbud": "акція", "gjelder": "стосується", "frukt": "фрукти", "grønt": "овочі", "poser": "пакети", "osten": "сир", "holder": "придатний", "fredag": "пʼятниця", "medlemskort": "картка покупця", "sparer": "заощаджуєте", "prosent": "відсоток", "billigere": "дешевше", "trodde": "думала" },
    en: { "koster": "cost", "eplene": "the apples", "tjuefem": "twenty-five", "kiloen": "the kilo", "tilbud": "an offer", "gjelder": "applies", "frukt": "fruit", "grønt": "vegetables", "poser": "bags", "osten": "the cheese", "holder": "lasts", "fredag": "Friday", "medlemskort": "membership card", "sparer": "save", "prosent": "per cent", "billigere": "cheaper", "trodde": "thought" }
  }
});
