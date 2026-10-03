window.COMICS = window.COMICS || [];

/* p169 — B1: «Питання про батьківщину». Це справжній блок усного Norskprøven:
   екзаменатор питає про країну, звідки ти приїхав, і чекає коротких повних речень.
   Аліна відповідає про Україну — не щоб вивчити саме ці факти, а щоб побачити
   форму відповіді: «Hovedstaden i … heter …». Свою країну кожен підставляє сам,
   тому в словнику внизу лежать саме каркасні слова, а не назви. */
COMICS.push({
  id: 'p169',
  level: 'B1',
  category: 'kultur',
  title: 'Spørsmål om hjemlandet',
  titleUk: 'Питання про батьківщину',
  titleEn: 'Questions about your home country',
  summaryUk: 'Перша частина усного іспиту: столиця, населення, сусіди, мова, валюта, президент і чим країна відома. Аліна відповідає про Україну — за цим зразком легко скласти розповідь про свою країну.',
  summaryEn: 'The first half of the speaking exam: capital, population, neighbours, language, currency, president and what the country is known for. Alina answers about Ukraine — use her sentences as a pattern for your own country.',
  summaryNo: 'Første del av den muntlige prøven: hovedstad, folketall, naboland, språk, valuta, president og hva landet er kjent for. Alina svarer om Ukraina – bruk setningene som mønster for ditt eget land.',
  cover: 0,

  panels: [
    { art: { bg: 'school', chars: [{ id: 'laerer', x: 110, mood: 'happy', pose: 'wave' }, { id: 'alina', x: 300, mood: 'normal' }], props: [{ type: 'desk', x: 200 }] }, lines: [
      { who: 'laerer', no: 'Hva heter hovedstaden i hjemlandet ditt?', uk: 'Як називається столиця твоєї батьківщини?', en: 'What is the capital of your home country?' },
      { who: 'alina', no: 'Hovedstaden i Ukraina heter Kyiv.', uk: 'Столиця України — Київ.', en: 'The capital of Ukraine is Kyiv.' }
    ]},
    { art: { bg: 'school', chars: [{ id: 'laerer', x: 110, mood: 'normal' }, { id: 'alina', x: 300, mood: 'normal' }], props: [] }, lines: [
      { who: 'laerer', no: 'Hvor mange mennesker bor det i landet?', uk: 'Скільки людей живе в країні?', en: 'How many people live in the country?' },
      { who: 'alina', no: 'Det bor omtrent trettisju millioner mennesker i Ukraina.', uk: 'В Україні живе приблизно тридцять сім мільйонів людей.', en: 'About thirty-seven million people live in Ukraine.' }
    ]},
    { art: { bg: 'school', chars: [{ id: 'laerer', x: 110, mood: 'normal', pose: 'point' }, { id: 'alina', x: 300, mood: 'normal' }], props: [] }, lines: [
      { who: 'laerer', no: 'Hvilke land grenser til hjemlandet ditt?', uk: 'Які країни межують із твоєю батьківщиною?', en: 'Which countries border your home country?' },
      { who: 'alina', no: 'Ukraina grenser til Polen, Slovakia, Ungarn, Romania, Moldova, Belarus og Russland.', uk: 'Україна межує з Польщею, Словаччиною, Угорщиною, Румунією, Молдовою, Білоруссю та Росією.', en: 'Ukraine borders Poland, Slovakia, Hungary, Romania, Moldova, Belarus and Russia.' }
    ]},
    { art: { bg: 'school', chars: [{ id: 'laerer', x: 110, mood: 'normal' }, { id: 'alina', x: 300, mood: 'happy' }], props: [] }, lines: [
      { who: 'laerer', no: 'Hvilket språk snakker folk i landet ditt?', uk: 'Якою мовою говорять люди у твоїй країні?', en: 'What language do people speak in your country?' },
      { who: 'alina', no: 'Det offisielle språket er ukrainsk.', uk: 'Офіційна мова — українська.', en: 'The official language is Ukrainian.' }
    ]},
    { art: { bg: 'school', chars: [{ id: 'laerer', x: 110, mood: 'normal' }, { id: 'alina', x: 300, mood: 'normal' }], props: [{ type: 'coins', x: 210, y: 195 }] }, lines: [
      { who: 'laerer', no: 'Hvilken valuta bruker landet?', uk: 'Яку валюту використовує країна?', en: 'What currency does the country use?' },
      { who: 'alina', no: 'Ukraina bruker hryvnia.', uk: 'Україна використовує гривню.', en: 'Ukraine uses the hryvnia.' }
    ]},
    { art: { bg: 'school', chars: [{ id: 'laerer', x: 110, mood: 'normal' }, { id: 'alina', x: 300, mood: 'normal' }], props: [] }, lines: [
      { who: 'laerer', no: 'Hva heter landets konge eller president?', uk: 'Як звати короля або президента країни?', en: 'What is the name of the country’s king or president?' },
      { who: 'alina', no: 'Presidenten heter Volodymyr Zelenskyj.', uk: 'Президента звати Володимир Зеленський.', en: 'The president is Volodymyr Zelenskyj.' }
    ]},
    { art: { bg: 'school', chars: [{ id: 'laerer', x: 110, mood: 'happy' }, { id: 'alina', x: 300, mood: 'grin', pose: 'cheer' }], props: [{ type: 'flag', x: 215, y: 185 }] }, lines: [
      { who: 'laerer', no: 'Hva er landet mest kjent for?', uk: 'Чим країна найбільш відома?', en: 'What is the country best known for?' },
      { who: 'alina', no: 'Ukraina er kjent for natur, kultur og jordbruk.', uk: 'Україна відома природою, культурою та сільським господарством.', en: 'Ukraine is known for its nature, culture and agriculture.' }
    ]}
  ],

  vocab: [
    ['et hjemland', 'батьківщина', 'a home country'],
    ['en hovedstad', 'столиця', 'a capital'],
    ['et folketall', 'кількість населення', 'a population'],
    ['omtrent', 'приблизно', 'about, approximately'],
    ['en million', 'мільйон', 'a million'],
    ['å grense til', 'межувати з', 'to border on'],
    ['et naboland', 'сусідня країна', 'a neighbouring country'],
    ['offisiell', 'офіційний', 'official'],
    ['et språk', 'мова', 'a language'],
    ['en valuta', 'валюта', 'a currency'],
    ['en president', 'президент', 'a president'],
    ['kjent for', 'відомий чимось', 'known for'],
    ['et jordbruk', 'сільське господарство', 'agriculture'],
    ['ei befolkning', 'населення', 'a population']
  ],

  words: {
    no: { 'polen': 'Польща', 'slovakia': 'Словаччина', 'ungarn': 'Угорщина', 'romania': 'Румунія', 'moldova': 'Молдова', 'belarus': 'Білорусь', 'russland': 'Росія', 'landets': 'країни', 'volodymyr': 'Володимир', 'zelenskyj': 'Зеленський', 'hovedstaden': 'столиця', 'hjemlandet': 'батьківщина', 'ditt': 'твоя', 'Ukraina': 'Україна', 'Kyiv': 'Київ', 'mennesker': 'люди', 'bor': 'живе', 'landet': 'країна', 'omtrent': 'приблизно', 'trettisju': 'тридцять сім', 'millioner': 'мільйонів', 'grenser': 'межує', 'Polen': 'Польща', 'Slovakia': 'Словаччина', 'Ungarn': 'Угорщина', 'Romania': 'Румунія', 'Moldova': 'Молдова', 'Belarus': 'Білорусь', 'Russland': 'Росія', 'språk': 'мова', 'språket': 'мова', 'snakker': 'говорять', 'folk': 'люди', 'offisielle': 'офіційна', 'ukrainsk': 'українська', 'valuta': 'валюта', 'bruker': 'використовує', 'hryvnia': 'гривня', 'konge': 'король', 'president': 'президент', 'presidenten': 'президент', 'kjent': 'відомий', 'natur': 'природа', 'kultur': 'культура', 'jordbruk': 'сільське господарство', 'mest': 'найбільше' },
    en: { 'polen': 'Poland', 'slovakia': 'Slovakia', 'ungarn': 'Hungary', 'romania': 'Romania', 'moldova': 'Moldova', 'belarus': 'Belarus', 'russland': 'Russia', 'landets': 'of the country', 'volodymyr': 'Volodymyr', 'zelenskyj': 'Zelenskyj', 'hovedstaden': 'the capital', 'hjemlandet': 'the home country', 'ditt': 'your', 'Ukraina': 'Ukraine', 'Kyiv': 'Kyiv', 'mennesker': 'people', 'bor': 'live', 'landet': 'the country', 'omtrent': 'about', 'trettisju': 'thirty-seven', 'millioner': 'million', 'grenser': 'borders', 'Polen': 'Poland', 'Slovakia': 'Slovakia', 'Ungarn': 'Hungary', 'Romania': 'Romania', 'Moldova': 'Moldova', 'Belarus': 'Belarus', 'Russland': 'Russia', 'språk': 'language', 'språket': 'the language', 'snakker': 'speak', 'folk': 'people', 'offisielle': 'official', 'ukrainsk': 'Ukrainian', 'valuta': 'currency', 'bruker': 'uses', 'hryvnia': 'hryvnia', 'konge': 'king', 'president': 'president', 'presidenten': 'the president', 'kjent': 'known', 'natur': 'nature', 'kultur': 'culture', 'jordbruk': 'agriculture', 'mest': 'most' }
  }
});
