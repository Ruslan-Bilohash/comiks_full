window.COMICS = window.COMICS || [];

/* p174 — B1: B1: ввічливі звороти й уточнення. Тут важлива не швидкість, а впевненість, що тебе правильно зрозуміли. */
COMICS.push({
  id: "p174",
  level: "B1",
  category: "mat",
  title: "Allergi på restaurant",
  titleUk: "Алергія в ресторані",
  titleEn: "An allergy at a restaurant",
  summaryUk: "Розмова, яку страшно вести саме через брак слів: сказати про алергію, перепитати склад страви, попросити заміну й переконатися, що тебе зрозуміли.",
  summaryEn: "The conversation people avoid for lack of words: declaring an allergy, asking what is in a dish, asking for a substitute and making sure you were understood.",
  summaryNo: "Samtalen mange gruer seg til: å si fra om allergi, spørre hva retten inneholder, be om bytte og forsikre seg om at beskjeden kom fram.",
  cover: 0,

  panels: [
    { art: { bg: "kitchen", chars: [{ id: "alina", x: 130, mood: "normal" }, { id: "kasserer", x: 320, mood: "happy" }], props: [{ type: "table", x: 224, y: 192 }] }, lines: [
      { who: "kasserer", no: "Har dere bestemt dere?", uk: "Ви вже визначилися?", en: "Have you decided?" },
      { who: "alina", no: "Nesten. Jeg må si fra om en allergi først.", uk: "Майже. Спершу маю сказати про алергію.", en: "Almost. First I need to mention an allergy." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "alina", x: 130, mood: "normal" }, { id: "kasserer", x: 320, mood: "surprised" }], props: [{ type: "note", x: 226, y: 188 }] }, lines: [
      { who: "alina", no: "Jeg tåler ikke nøtter i det hele tatt.", uk: "Я зовсім не переношу горіхів.", en: "I cannot tolerate nuts at all." },
      { who: "kasserer", no: "Det er viktig. Jeg skriver det på bestillingen.", uk: "Це важливо. Я запишу це в замовленні.", en: "That is important. I will note it on the order." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "alina", x: 130, mood: "normal" }, { id: "kasserer", x: 320, mood: "normal" }], props: [{ type: "bowl", x: 222, y: 190 }] }, lines: [
      { who: "alina", no: "Inneholder salaten nøtter?", uk: "У салаті є горіхи?", en: "Does the salad contain nuts?" },
      { who: "kasserer", no: "Ja, den har valnøtter i dressingen.", uk: "Так, у заправці є волоські горіхи.", en: "Yes, it has walnuts in the dressing." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "alina", x: 130, mood: "normal" }, { id: "kasserer", x: 320, mood: "happy" }], props: [{ type: "cheese", x: 226, y: 190 }] }, lines: [
      { who: "alina", no: "Kan dere bytte dem ut med ost?", uk: "Можете замінити їх сиром?", en: "Could you swap them for cheese?" },
      { who: "kasserer", no: "Det går fint. Kjøkkenet lager en ny porsjon.", uk: "Без проблем. Кухня приготує нову порцію.", en: "That is fine. The kitchen will make a fresh portion." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "alina", x: 130, mood: "surprised" }, { id: "kasserer", x: 320, mood: "normal" }], props: [{ type: "docs", x: 228, y: 188 }] }, lines: [
      { who: "alina", no: "Bruker dere samme kniv og brett?", uk: "Ви користуєтесь тим самим ножем і дошкою?", en: "Do you use the same knife and board?" },
      { who: "kasserer", no: "Nei, vi har egne redskaper for allergier.", uk: "Ні, у нас окреме начиння для алергій.", en: "No, we have separate tools for allergies." }
    ]},
    { art: { bg: "kitchen", chars: [{ id: "alina", x: 140, mood: "happy" }, { id: "kasserer", x: 320, mood: "happy" }], props: [{ type: "bowl", x: 230, y: 190 }] }, lines: [
      { who: "alina", no: "Takk for at dere tar det på alvor.", uk: "Дякую, що ставитеся до цього серйозно.", en: "Thank you for taking it seriously." },
      { who: "kasserer", no: "Si alltid fra — da blir maten trygg.", uk: "Завжди кажіть — тоді їжа буде безпечною.", en: "Always say so — then the food is safe." }
    ]}
  ],

  vocab: [
    ["en allergi", "алергія", "an allergy"],
    ["å si fra", "попередити, сказати", "to let someone know"],
    ["å tåle", "переносити", "to tolerate"],
    ["ei nøtt", "горіх", "a nut"],
    ["å inneholde", "містити", "to contain"],
    ["en dressing", "заправка", "a dressing"],
    ["å bytte ut", "замінити", "to swap out"],
    ["en porsjon", "порція", "a portion"],
    ["et brett", "дошка, таця", "a board, a tray"],
    ["et redskap", "начиння, інструмент", "a tool"],
    ["å ta på alvor", "ставитися серйозно", "to take seriously"],
    ["trygg", "безпечний", "safe"]
  ],

  words: {
    no: { "allergi": "алергія", "allergier": "алергії", "tåler": "переношу", "nøtter": "горіхи", "inneholder": "містить", "salaten": "салат", "valnøtter": "волоські горіхи", "dressingen": "заправка", "bytte": "замінити", "porsjon": "порція", "kniv": "ніж", "brett": "дошка", "redskaper": "начиння", "alvor": "серйозно", "trygg": "безпечна", "bestillingen": "замовлення" },
    en: { "allergi": "allergy", "allergier": "allergies", "tåler": "tolerate", "nøtter": "nuts", "inneholder": "contains", "salaten": "the salad", "valnøtter": "walnuts", "dressingen": "the dressing", "bytte": "to swap", "porsjon": "portion", "kniv": "knife", "brett": "board", "redskaper": "tools", "alvor": "seriously", "trygg": "safe", "bestillingen": "the order" }
  }
});
