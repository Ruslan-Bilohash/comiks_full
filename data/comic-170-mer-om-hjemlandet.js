window.COMICS = window.COMICS || [];

/* p170 — B1: друга половина того самого блоку усного іспиту. Тут питають не про
   факти, а про життя: їжа, погода, свята, спорт, традиції. Відповіді навмисно
   короткі — на іспиті цінують повне речення, а не довгий переказ. */
COMICS.push({
  id: 'p170',
  level: 'B1',
  category: 'kultur',
  title: 'Mer om hjemlandet',
  titleUk: 'Ще про батьківщину',
  titleEn: 'More about your home country',
  summaryUk: 'Друга половина усного іспиту: страви, клімат, туристичні місця, національне свято, спорт, традиції та природні багатства. Сім питань із короткими відповідями-зразками.',
  summaryEn: 'The second half of the speaking exam: food, climate, tourist places, the national day, sports, traditions and natural resources. Seven questions with short model answers.',
  summaryNo: 'Andre del av den muntlige prøven: mat, klima, turistmål, nasjonaldag, idrett, tradisjoner og naturressurser. Sju spørsmål med korte mønstersvar.',
  cover: 0,

  panels: [
    { art: { bg: 'kitchen', chars: [{ id: 'laerer', x: 110, mood: 'happy' }, { id: 'alina', x: 300, mood: 'happy' }], props: [{ type: 'bowl', x: 205, y: 190 }] }, lines: [
      { who: 'laerer', no: 'Hvilke tradisjonelle matretter er populære?', uk: 'Які традиційні страви популярні?', en: 'Which traditional dishes are popular?' },
      { who: 'alina', no: 'Borsjtsj, varenyky og holubtsi er populære.', uk: 'Популярні борщ, вареники та голубці.', en: 'Borscht, varenyky and holubtsi are popular.' }
    ]},
    { art: { bg: 'park', chars: [{ id: 'laerer', x: 110, mood: 'normal' }, { id: 'alina', x: 300, mood: 'normal' }], props: [] }, lines: [
      { who: 'laerer', no: 'Hvordan er klimaet gjennom året?', uk: 'Який клімат протягом року?', en: 'What is the climate like through the year?' },
      { who: 'alina', no: 'Sommeren er varm, og vinteren er kald.', uk: 'Літо тепле, а зима холодна.', en: 'The summer is warm and the winter is cold.' }
    ]},
    { art: { bg: 'mountain', chars: [{ id: 'laerer', x: 110, mood: 'normal', pose: 'point' }, { id: 'alina', x: 300, mood: 'happy' }], props: [] }, lines: [
      { who: 'laerer', no: 'Hva er de mest kjente turistattraksjonene?', uk: 'Які найвідоміші туристичні місця?', en: 'What are the most famous tourist attractions?' },
      { who: 'alina', no: 'Kyiv, Lviv og Karpatene er populære.', uk: 'Київ, Львів і Карпати популярні.', en: 'Kyiv, Lviv and the Carpathians are popular.' }
    ]},
    { art: { bg: 'street', chars: [{ id: 'laerer', x: 110, mood: 'normal' }, { id: 'alina', x: 300, mood: 'grin' }], props: [{ type: 'flag', x: 212, y: 186 }] }, lines: [
      { who: 'laerer', no: 'Hva er landets nasjonaldag, og hvordan feires den?', uk: 'Яке національне свято країни і як його святкують?', en: 'What is the country’s national day, and how is it celebrated?' },
      { who: 'alina', no: 'Ukrainas uavhengighetsdag er tjuefjerde august.', uk: 'День Незалежності України — двадцять четверте серпня.', en: 'Ukraine’s independence day is the twenty-fourth of August.' }
    ]},
    { art: { bg: 'park', chars: [{ id: 'laerer', x: 110, mood: 'normal' }, { id: 'alina', x: 300, mood: 'happy', pose: 'cheer' }], props: [{ type: 'ball', x: 215, y: 198 }] }, lines: [
      { who: 'laerer', no: 'Hvilke idretter er populære?', uk: 'Які види спорту популярні?', en: 'Which sports are popular?' },
      { who: 'alina', no: 'Fotball og boksing er populære.', uk: 'Популярні футбол і бокс.', en: 'Football and boxing are popular.' }
    ]},
    { art: { bg: 'home', chars: [{ id: 'laerer', x: 110, mood: 'happy' }, { id: 'alina', x: 300, mood: 'normal' }], props: [{ type: 'gift', x: 210, y: 192 }] }, lines: [
      { who: 'laerer', no: 'Hvilke tradisjoner er viktige for befolkningen?', uk: 'Які традиції важливі для населення?', en: 'Which traditions are important to the population?' },
      { who: 'alina', no: 'Jul, påske og familietradisjoner er viktige.', uk: 'Важливі Різдво, Великдень і сімейні традиції.', en: 'Christmas, Easter and family traditions are important.' }
    ]},
    { art: { bg: 'forest', chars: [{ id: 'laerer', x: 110, mood: 'normal' }, { id: 'alina', x: 300, mood: 'normal' }], props: [] }, lines: [
      { who: 'laerer', no: 'Hvilke naturressurser er landet kjent for?', uk: 'Якими природними ресурсами відома країна?', en: 'Which natural resources is the country known for?' },
      { who: 'alina', no: 'Ukraina er kjent for fruktbar jord, jernmalm og kull.', uk: 'Україна відома родючими ґрунтами, залізною рудою та вугіллям.', en: 'Ukraine is known for fertile soil, iron ore and coal.' }
    ]}
  ],

  vocab: [
    ['ei matrett', 'страва', 'a dish'],
    ['tradisjonell', 'традиційний', 'traditional'],
    ['et klima', 'клімат', 'a climate'],
    ['gjennom året', 'протягом року', 'through the year'],
    ['ei turistattraksjon', 'туристична принада', 'a tourist attraction'],
    ['en nasjonaldag', 'національне свято', 'a national day'],
    ['å feire', 'святкувати', 'to celebrate'],
    ['en uavhengighetsdag', 'день незалежності', 'an independence day'],
    ['en idrett', 'вид спорту', 'a sport'],
    ['en tradisjon', 'традиція', 'a tradition'],
    ['ei naturressurs', 'природний ресурс', 'a natural resource'],
    ['fruktbar jord', 'родючий ґрунт', 'fertile soil'],
    ['ei jernmalm', 'залізна руда', 'iron ore'],
    ['et kull', 'вугілля', 'coal']
  ],

  words: {
    no: { 'borsjtsj': 'борщ', 'varenyky': 'вареники', 'holubtsi': 'голубці', 'karpatene': 'Карпати', 'ukrainas': 'України', 'landets': 'країни', 'tradisjonelle': 'традиційні', 'matretter': 'страви', 'populære': 'популярні', 'klimaet': 'клімат', 'gjennom': 'протягом', 'året': 'рік', 'sommeren': 'літо', 'varm': 'тепле', 'vinteren': 'зима', 'kald': 'холодна', 'kjente': 'відомі', 'turistattraksjonene': 'туристичні місця', 'Lviv': 'Львів', 'Karpatene': 'Карпати', 'nasjonaldag': 'національне свято', 'feires': 'святкується', 'uavhengighetsdag': 'день незалежності', 'tjuefjerde': 'двадцять четверте', 'august': 'серпень', 'idretter': 'види спорту', 'fotball': 'футбол', 'boksing': 'бокс', 'tradisjoner': 'традиції', 'viktige': 'важливі', 'befolkningen': 'населення', 'jul': 'Різдво', 'påske': 'Великдень', 'familietradisjoner': 'сімейні традиції', 'naturressurser': 'природні ресурси', 'fruktbar': 'родючий', 'jord': 'ґрунт', 'jernmalm': 'залізна руда', 'kull': 'вугілля' },
    en: { 'borsjtsj': 'borscht', 'varenyky': 'varenyky (dumplings)', 'holubtsi': 'holubtsi (stuffed rolls)', 'karpatene': 'the Carpathians', 'ukrainas': 'of Ukraine', 'landets': 'of the country', 'tradisjonelle': 'traditional', 'matretter': 'dishes', 'populære': 'popular', 'klimaet': 'the climate', 'gjennom': 'through', 'året': 'the year', 'sommeren': 'the summer', 'varm': 'warm', 'vinteren': 'the winter', 'kald': 'cold', 'kjente': 'famous', 'turistattraksjonene': 'the tourist attractions', 'Lviv': 'Lviv', 'Karpatene': 'the Carpathians', 'nasjonaldag': 'national day', 'feires': 'is celebrated', 'uavhengighetsdag': 'independence day', 'tjuefjerde': 'twenty-fourth', 'august': 'August', 'idretter': 'sports', 'fotball': 'football', 'boksing': 'boxing', 'tradisjoner': 'traditions', 'viktige': 'important', 'befolkningen': 'the population', 'jul': 'Christmas', 'påske': 'Easter', 'familietradisjoner': 'family traditions', 'naturressurser': 'natural resources', 'fruktbar': 'fertile', 'jord': 'soil', 'jernmalm': 'iron ore', 'kull': 'coal' }
  }
});
