/* Комікс·Lab — пошукові теми коміксів (SEO) вісьмома мовами. Одне джерело для двох місць:
   статичних сторінок /komiks/<id>/ (tools/build.js, tools/lang-pages.js) і заголовка вкладки
   в застосунку, коли комікс відкрито (assets/app.js → comicMeta).
   CAT   — що людина шукає для цілої категорії («норвезька в лікаря», «основи програмування для дітей»);
   COMIC — власна тема окремого коміксу, якщо вона точніша за категорію (комікси про програмування);
   WORDS — коротке «Слова:» для опису сторінки. Нова категорія чи новий комікс зі своєю темою → дописати сюди. */
(function (root) {
  const SEO = {
    CAT: {
      hverdag: { en: 'everyday Norwegian', no: 'norsk i hverdagen', uk: 'норвезька для повсякдення', ar: 'النرويجية في الحياة اليومية', de: 'Norwegisch im Alltag', pl: 'norweski na co dzień', tr: 'günlük hayatta Norveççe', lt: 'norvegų kalba kasdienybėje' },
      familie: { en: 'Norwegian family vocabulary', no: 'ord om familien på norsk', uk: 'норвезькі слова про сім’ю', ar: 'مفردات العائلة بالنرويجية', de: 'norwegische Wörter rund um die Familie', pl: 'norweskie słówka o rodzinie', tr: 'Norveççe aile kelimeleri', lt: 'norvegiški žodžiai apie šeimą' },
      skole: { en: 'Norwegian for school', no: 'norsk på skolen', uk: 'норвезька для школи', ar: 'النرويجية في المدرسة', de: 'Norwegisch in der Schule', pl: 'norweski w szkole', tr: 'okulda Norveççe', lt: 'norvegų kalba mokykloje' },
      mat: { en: 'Norwegian food words', no: 'mat og måltider på norsk', uk: 'норвезька: їжа й страви', ar: 'مفردات الطعام بالنرويجية', de: 'Essen auf Norwegisch', pl: 'jedzenie po norwesku', tr: 'Norveççe yemek kelimeleri', lt: 'maistas norvegiškai' },
      natur: { en: 'nature and weather in Norwegian', no: 'natur og vær på norsk', uk: 'природа й погода норвезькою', ar: 'الطبيعة والطقس بالنرويجية', de: 'Natur und Wetter auf Norwegisch', pl: 'przyroda i pogoda po norwesku', tr: 'Norveççe doğa ve hava durumu', lt: 'gamta ir orai norvegiškai' },
      fritid: { en: 'free time and hobbies in Norwegian', no: 'fritid og hobbyer på norsk', uk: 'дозвілля й хобі норвезькою', ar: 'وقت الفراغ والهوايات بالنرويجية', de: 'Freizeit und Hobbys auf Norwegisch', pl: 'czas wolny i hobby po norwesku', tr: 'Norveççe boş zaman ve hobiler', lt: 'laisvalaikis ir pomėgiai norvegiškai' },
      butikk: { en: 'shopping in Norwegian', no: 'å handle på norsk', uk: 'покупки норвезькою', ar: 'التسوّق بالنرويجية', de: 'Einkaufen auf Norwegisch', pl: 'zakupy po norwesku', tr: 'Norveççe alışveriş', lt: 'apsipirkimas norvegiškai' },
      helse: { en: 'Norwegian at the doctor and pharmacy', no: 'norsk hos legen og på apoteket', uk: 'норвезька в лікаря та аптеці', ar: 'النرويجية عند الطبيب وفي الصيدلية', de: 'Norwegisch beim Arzt und in der Apotheke', pl: 'norweski u lekarza i w aptece', tr: 'doktorda ve eczanede Norveççe', lt: 'norvegų kalba pas gydytoją ir vaistinėje' },
      jobb: { en: 'Norwegian for work', no: 'norsk på jobben', uk: 'норвезька для роботи', ar: 'النرويجية في العمل', de: 'Norwegisch für den Beruf', pl: 'norweski w pracy', tr: 'iş için Norveççe', lt: 'norvegų kalba darbe' },
      bolig: { en: 'housing in Norway: Norwegian words', no: 'bolig og leie på norsk', uk: 'житло в Норвегії: норвезькі слова', ar: 'السكن في النرويج: مفردات نرويجية', de: 'Wohnen in Norwegen: norwegische Wörter', pl: 'mieszkanie w Norwegii: słówka', tr: 'Norveç’te konut: Norveççe kelimeler', lt: 'būstas Norvegijoje: norvegiški žodžiai' },
      kultur: { en: 'Norwegian culture and traditions', no: 'norsk kultur og tradisjoner', uk: 'норвезька культура й традиції', ar: 'الثقافة والتقاليد النرويجية', de: 'norwegische Kultur und Traditionen', pl: 'norweska kultura i tradycje', tr: 'Norveç kültürü ve gelenekleri', lt: 'norvegų kultūra ir tradicijos' },
      grammatikk: { en: 'Norwegian grammar in context', no: 'norsk grammatikk i praksis', uk: 'норвезька граматика на прикладах', ar: 'القواعد النرويجية في سياقها', de: 'norwegische Grammatik im Kontext', pl: 'gramatyka norweska w praktyce', tr: 'bağlamında Norveççe dil bilgisi', lt: 'norvegų gramatika praktikoje' },
      koding: { en: 'coding basics for kids', no: 'programmering for barn', uk: 'основи програмування для дітей', ar: 'أساسيات البرمجة للأطفال', de: 'Programmieren für Kinder', pl: 'podstawy programowania dla dzieci', tr: 'çocuklar için kodlama temelleri', lt: 'programavimo pagrindai vaikams' }
    },
    TRACK: {
      foundations: { en: 'programming foundations for children', no: 'grunnleggende programmering for barn', uk: 'основи програмування для дітей' },
      basics: { en: 'coding concepts for children', no: 'kodebegreper for barn', uk: 'поняття програмування для дітей' },
      web: { en: 'HTML, CSS and JavaScript for kids', no: 'HTML, CSS og JavaScript for barn', uk: 'HTML, CSS і JavaScript для дітей' },
      game: { en: 'game development for kids', no: 'spillutvikling for barn', uk: 'розробка ігор для дітей' },
      blender: { en: 'Blender and 3D modelling for kids', no: 'Blender og 3D-modellering for barn', uk: 'Blender і 3D-моделювання для дітей' },
      unity: { en: 'Unity game development for kids', no: 'spillutvikling i Unity for barn', uk: 'розробка ігор у Unity для дітей' },
      data: { en: 'databases and SQL for kids', no: 'databaser og SQL for barn', uk: 'бази даних і SQL для дітей' },
      'personal-safety': { en: 'everyday safety for children', no: 'trygg hverdag for barn', uk: 'особиста безпека для дітей' },
      'cyber-safety': { en: 'online safety for children', no: 'nettsikkerhet for barn', uk: 'безпека дітей онлайн' },
      'scam-awareness': { en: 'how children can spot scams', no: 'slik avslører barn svindel', uk: 'як дітям розпізнати шахрайство' },
      'device-safety': { en: 'device security for children', no: 'enhetssikkerhet for barn', uk: 'захист пристроїв для дітей' },
      'secure-coding': { en: 'secure coding for children', no: 'sikker programmering for barn', uk: 'безпечне програмування для дітей' },
      hackers: { en: 'hackers and cyber defence for kids', no: 'hackere og cybervern for barn', uk: 'хакери та кіберзахист для дітей' }
    },
    COMIC: {
      p183: { en: 'What is coding? Programming for kids', no: 'Hva er programmering? Koding for barn', uk: 'Що таке програмування — для дітей', ar: 'ما هي البرمجة؟ للأطفال', de: 'Was ist Programmieren? Für Kinder erklärt', pl: 'Czym jest programowanie? Dla dzieci', tr: 'Kodlama nedir? Çocuklar için', lt: 'Kas yra programavimas? Vaikams' },
      p184: { en: 'What is an algorithm? For kids', no: 'Hva er en algoritme? For barn', uk: 'Що таке алгоритм — для дітей', ar: 'ما هي الخوارزمية؟ للأطفال', de: 'Was ist ein Algorithmus? Für Kinder', pl: 'Czym jest algorytm? Dla dzieci', tr: 'Algoritma nedir? Çocuklar için', lt: 'Kas yra algoritmas? Vaikams' },
      p185: { en: 'Loops in coding for kids', no: 'Løkker i programmering for barn', uk: 'Цикли в програмуванні для дітей', ar: 'الحلقات في البرمجة للأطفال', de: 'Schleifen beim Programmieren für Kinder', pl: 'Pętle w programowaniu dla dzieci', tr: 'Çocuklar için kodlamada döngüler', lt: 'Ciklai programavime vaikams' },
      p186: { en: 'If-then-else conditions for kids', no: 'Hvis–så–ellers: betingelser for barn', uk: 'Умови «якщо–то–інакше» для дітей', ar: 'شروط «إذا–وإلا» في البرمجة للأطفال', de: 'Wenn-dann-sonst-Bedingungen für Kinder', pl: 'Warunki „jeśli–to–inaczej” dla dzieci', tr: 'Çocuklar için eğer–ise–değilse koşulları', lt: 'Sąlygos „jei–tai–kitaip“ vaikams' },
      p187: { en: 'Variables in coding for kids', no: 'Variabler i programmering for barn', uk: 'Змінні в програмуванні для дітей', ar: 'المتغيّرات في البرمجة للأطفال', de: 'Variablen beim Programmieren für Kinder', pl: 'Zmienne w programowaniu dla dzieci', tr: 'Çocuklar için kodlamada değişkenler', lt: 'Kintamieji programavime vaikams' },
      p188: { en: 'Debugging: finding bugs, for kids', no: 'Feilsøking: finn feilen – for barn', uk: 'Налагодження: як знайти помилку — для дітей', ar: 'تصحيح الأخطاء البرمجية للأطفال', de: 'Debugging: Fehler finden – für Kinder', pl: 'Debugowanie: szukanie błędów dla dzieci', tr: 'Çocuklar için hata ayıklama', lt: 'Klaidų paieška programose vaikams' },
      p189: { en: 'Programming languages explained for kids', no: 'Programmeringsspråk forklart for barn', uk: 'Мови програмування: що для чого — для дітей', ar: 'لغات البرمجة مشروحة للأطفال', de: 'Programmiersprachen für Kinder erklärt', pl: 'Języki programowania dla dzieci', tr: 'Çocuklar için programlama dilleri', lt: 'Programavimo kalbos vaikams' },
      p190: { en: 'Modelling and flowcharts for kids', no: 'Modeller og flytskjema for barn', uk: 'Моделювання й блок-схеми для дітей', ar: 'النمذجة والمخططات الانسيابية للأطفال', de: 'Modelle und Flussdiagramme für Kinder', pl: 'Modelowanie i schematy blokowe dla dzieci', tr: 'Çocuklar için modelleme ve akış şemaları', lt: 'Modeliavimas ir blokinės schemos vaikams' },
      p191: { en: 'HTML basics for kids: your first web page', no: 'HTML for barn: lag din første nettside', uk: 'Основи HTML для дітей: перший сайт', ar: 'أساسيات HTML للأطفال: صفحتك الأولى', de: 'HTML-Grundlagen für Kinder: die erste Webseite', pl: 'Podstawy HTML dla dzieci: pierwsza strona', tr: 'Çocuklar için HTML temelleri: ilk web sayfan', lt: 'HTML pagrindai vaikams: pirmasis tinklalapis' }
    },
    WORDS: { en: 'Words', no: 'Ord', uk: 'Слова', ar: 'كلمات', de: 'Wörter', pl: 'Słówka', tr: 'Kelimeler', lt: 'Žodžiai' },
    // «комікс норвезькою, рівень A2» — для заголовка вкладки в застосунку
    KIND: { en: 'Norwegian comic', no: 'tegneserie på norsk', uk: 'комікс норвезькою', ar: 'قصة مصوّرة بالنرويجية', de: 'Comic auf Norwegisch', pl: 'komiks po norwesku', tr: 'Norveççe çizgi roman', lt: 'komiksas norvegiškai' }
  };
  /* Тема коміксу мовою lang: власна тема → тема категорії → англійська. */
  SEO.topic = (c, lang) => {
    const own = SEO.COMIC[c.id], cat = SEO.CAT[c.category] || {}, track = c.category === 'koding' ? (SEO.TRACK[c.track] || {}) : {};
    return (own && (own[lang] || own.en)) || track[lang] || track.en || cat[lang] || cat.en || '';
  };
  SEO.own = c => !!SEO.COMIC[c.id];
  /* Ключові слова з коміксу для опису: 3 перші слова словничка з перекладом. */
  SEO.words = (c, lang, trWord) => (c.vocab || []).slice(0, 3).map(v => `${v[0]} (${trWord(v)})`).join(', ');
  root.KOMIKS_SEO = SEO;
  if (typeof module !== 'undefined' && module.exports) module.exports = SEO;
})(typeof window !== 'undefined' ? window : globalThis);
