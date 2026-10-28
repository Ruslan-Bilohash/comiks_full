window.COMICS = window.COMICS || [];

/* p182 — B2: вибори в Норвегії для тих, хто тут живе, але ще не громадянин. Факти — нейтрально:
   на комунальних і фюльке-виборах голосують іноземці з трьома роками легального проживання,
   на виборах до Стортингу — лише громадяни; 169 представників, вибори кожні чотири роки. */
COMICS.push({
  id: "p182",
  level: "B2",
  category: "kultur",
  title: "Valg og demokrati i Norge",
  titleUk: "Вибори й демократія в Норвегії",
  titleEn: "Elections and democracy in Norway",
  summaryUk: "Аліна отримала картку виборця. Вчитель Мортен і Марія пояснюють, хто може голосувати, як проголосувати достроково і чому голосування таємне.",
  summaryEn: "Alina has received a polling card. Teacher Morten and Maria explain who can vote, how to vote in advance and why the ballot is secret.",
  summaryNo: "Alina har fått valgkort. Lærer Morten og Maria forklarer hvem som kan stemme, hvordan man forhåndsstemmer, og hvorfor valget er hemmelig.",
  cover: 5,

  panels: [
    { art: { bg: "street", flags: true, chars: [{ id: "alina", x: 110, mood: "surprised", pose: "hold", s: 0.85 }, { id: "morten", x: 300, mood: "happy", s: 0.85, flip: true }], props: [{ type: "docs", x: 155, y: 225 }] }, lines: [
      { who: "narrator", no: "Det er kommunevalg i september.", uk: "У вересні — муніципальні вибори.", en: "There is a municipal election in September." },
      { who: "alina", no: "Jeg har fått valgkort i posten. Kan jeg stemme?", uk: "Я отримала поштою картку виборця. Я можу голосувати?", en: "I got a polling card in the post. Can I vote?" },
      { who: "morten", no: "Ja! Etter tre år med lovlig opphold kan du stemme ved kommunevalget.", uk: "Так! Після трьох років легального проживання можна голосувати на муніципальних виборах.", en: "Yes! After three years of legal residence you can vote in the municipal election." }
    ]},
    { art: { bg: "school", board: "Stortinget: 169", chars: [{ id: "morten", x: 110, mood: "normal", pose: "point", s: 0.85 }, { id: "alina", x: 300, mood: "normal", s: 0.85, flip: true }] }, lines: [
      { who: "morten", no: "Stortingsvalget er annerledes. Der må man være norsk statsborger.", uk: "Вибори до Стортингу — інша справа. Там треба бути громадянином Норвегії.", en: "The parliamentary election is different. There you have to be a Norwegian citizen." },
      { who: "morten", no: "På Stortinget sitter hundre og sekstini representanter. De velges hvert fjerde år.", uk: "У Стортингу сто шістдесят дев’ять депутатів. Їх обирають кожні чотири роки.", en: "One hundred and sixty-nine representatives sit in the Storting. They are elected every four years." }
    ]},
    { art: { bg: "street", chars: [{ id: "maria", x: 110, mood: "happy", pose: "wave", s: 0.85 }, { id: "alina", x: 300, mood: "surprised", s: 0.85, flip: true }], props: [{ type: "book", x: 70, y: 230 }] }, lines: [
      { who: "maria", no: "Jeg forhåndsstemte på biblioteket i går. Det tok fem minutter.", uk: "Я вчора проголосувала достроково в бібліотеці. Це зайняло п’ять хвилин.", en: "I voted in advance at the library yesterday. It took five minutes." },
      { who: "alina", no: "Kan man forhåndsstemme? Det visste jeg ikke.", uk: "Можна голосувати достроково? Я не знала.", en: "Can you vote in advance? I didn’t know that." },
      { who: "maria", no: "Ja, du må bare ta med legitimasjon.", uk: "Так, треба лише взяти з собою посвідчення особи.", en: "Yes, you just have to bring ID." }
    ]},
    { art: { bg: "school", board: "Hemmelig valg", chars: [{ id: "morten", x: 110, mood: "normal", pose: "point", s: 0.85 }, { id: "alina", x: 300, mood: "happy", s: 0.85, flip: true }] }, lines: [
      { who: "morten", no: "Valget er hemmelig. Ingen får se stemmeseddelen din – heller ikke familien.", uk: "Голосування таємне. Ніхто не має бачити твій бюлетень — навіть сім’я.", en: "The vote is secret. Nobody may see your ballot paper – not even your family." },
      { who: "alina", no: "Det er viktig. Slik var det ikke alltid der jeg kommer fra.", uk: "Це важливо. Там, звідки я, так було не завжди.", en: "That is important. It was not always like that where I come from." }
    ]},
    { art: { bg: "street", flags: true, chars: [{ id: "alina", x: 110, mood: "normal", pose: "hips", s: 0.85 }, { id: "morten", x: 300, mood: "happy", pose: "point", s: 0.85, flip: true }] }, lines: [
      { who: "alina", no: "Men hvordan velger jeg parti? Jeg kjenner ikke alle.", uk: "Але як мені обрати партію? Я не всіх знаю.", en: "But how do I choose a party? I don’t know them all." },
      { who: "morten", no: "Les partiprogrammene og prøv en valgomat. Tenk på hva som er viktig for deg i kommunen.", uk: "Почитай програми партій і спробуй «валгомат». Подумай, що важливо для тебе в комуні.", en: "Read the party programmes and try a voting advice app. Think about what matters to you in your municipality." }
    ]},
    { art: { bg: "street", flags: true, chars: [{ id: "alina", x: 120, mood: "grin", pose: "cheer", s: 0.85 }, { id: "morten", x: 300, mood: "happy", s: 0.85, flip: true }], fx: "stars" }, lines: [
      { who: "alina", no: "For meg er barnehager og kollektivtransport viktigst. Jeg bruker stemmeretten for første gang!", uk: "Для мене найважливіші садочки й громадський транспорт. Я вперше скористаюся правом голосу!", en: "Kindergartens and public transport matter most to me. I am using my right to vote for the first time!" },
      { who: "morten", no: "Godt sagt. Demokratiet fungerer best når mange deltar.", uk: "Добре сказано. Демократія працює найкраще, коли беруть участь багато людей.", en: "Well said. Democracy works best when many people take part." }
    ]}
  ],

  vocab: [
    ["et valg", "вибори; вибір", "an election; a choice"],
    ["et kommunevalg", "муніципальні вибори", "a municipal election"],
    ["et stortingsvalg", "вибори до Стортингу", "a parliamentary election"],
    ["å stemme", "голосувати", "to vote"],
    ["en stemmerett", "право голосу", "the right to vote"],
    ["et valgkort", "картка виборця", "a polling card"],
    ["lovlig", "легально, законно", "legally"],
    ["et opphold", "проживання, перебування", "residence, stay"],
    ["en statsborger", "громадянин", "a citizen"],
    ["en representant", "представник, депутат", "a representative"],
    ["Stortinget", "Стортинг (парламент Норвегії)", "the Storting (Norwegian parliament)"],
    ["hvert fjerde år", "кожні чотири роки", "every four years"],
    ["å forhåndsstemme", "голосувати достроково", "to vote in advance"],
    ["en legitimasjon", "посвідчення особи", "ID"],
    ["hemmelig", "таємний", "secret"],
    ["en stemmeseddel", "виборчий бюлетень", "a ballot paper"],
    ["ei urne", "урна", "a ballot box"],
    ["et parti", "партія", "a party"],
    ["et partiprogram", "програма партії", "a party programme"],
    ["en valgomat", "онлайн-тест для вибору партії", "a voting advice app"],
    ["en kommune", "комуна (муніципалітет)", "a municipality"],
    ["kollektivtransport", "громадський транспорт", "public transport"],
    ["å delta", "брати участь", "to take part"],
    ["et demokrati", "демократія", "a democracy"]
  ],

  words: {
    no: { "barnehager": "дитячі садки", "deltar": "беруть участь", "demokratiet": "демократія", "fjerde": "четвертий", "forhåndsstemme": "голосувати достроково", "forhåndsstemte": "проголосувала достроково", "opphold": "проживання, перебування", "kommunevalget": "муніципальні вибори", "stemmeseddelen": "бюлетень", "viktigst": "найважливіше", "hemmelig": "таємний", "kollektivtransport": "громадський транспорт", "kommunevalg": "муніципальні вибори", "parti": "партія", "partiprogrammene": "програми партій", "prøv": "спробуй", "representanter": "представники, депутати", "sekstini": "шістдесят дев’ять", "statsborger": "громадянин", "stemme": "голосувати", "stemmeretten": "право голосу", "stemmeseddel": "виборчий бюлетень", "stortinget": "Стортинг (парламент)", "stortingsvalget": "вибори до Стортингу", "tenk": "подумай", "urnen": "урна", "valgkort": "картка виборця", "valgomat": "онлайн-тест для вибору партії", "velges": "обираються", "visste": "знала" },
    en: { "barnehager": "kindergartens", "deltar": "take part", "demokratiet": "democracy", "fjerde": "fourth", "forhåndsstemme": "vote in advance", "forhåndsstemte": "voted in advance", "opphold": "residence, stay", "kommunevalget": "the municipal election", "stemmeseddelen": "the ballot paper", "viktigst": "most important", "hemmelig": "secret", "kollektivtransport": "public transport", "kommunevalg": "municipal election", "parti": "party", "partiprogrammene": "the party programmes", "prøv": "try", "representanter": "representatives", "sekstini": "sixty-nine", "statsborger": "citizen", "stemme": "vote", "stemmeretten": "the right to vote", "stemmeseddel": "ballot paper", "stortinget": "the Storting (parliament)", "stortingsvalget": "the parliamentary election", "tenk": "think", "urnen": "the ballot box", "valgkort": "polling card", "valgomat": "voting advice app", "velges": "are elected", "visste": "knew" }
  }
});
