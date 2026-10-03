/* Комікс·Lab — 🧠 «Пари» (#/pairs).
   Гра тримається на тій самій пам'яті акаунта, що й картки: одне слово — одна коробка
   повторень (KomiksCore.cards) і один журнал помилок (KomiksCore.errs). Тому:
     • слова, у яких помилявся в тестах, самі приходять у гру;
     • слово, яке не згадав у грі, лягає в «роботу над помилками»;
     • тричі згадав — і воно звідти зникає.
   Режими: щоденна гра, робота над помилками, слова одного коміксу та дуель по QR-коду. */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const C = () => window.KomiksCore;

  const T = {
    uk: {
      nav: '🧠 Пари', title: '🧠 Пари', lead: 'Відкривай по дві картки й склеюй норвезьке слово з перекладом. Слова беремо з твоїх слабких місць, тож гра щодня інша.',
      daily: '📅 Щоденна гра', daily_d: n => `${n} пар на сьогодні — зі слів, які ще не вляглися`,
      mist: '🔁 Робота над помилками', mist_d: n => `${n} слів, у яких ти вже помилявся`, mist_none: 'Помилок немає — чисто!',
      duel: '🤝 Грати з другом', duel_d: 'Один телефон показує QR-код, другий сканує — і граєте наввипередки',
      comic: '📖 Слова коміксу', start: 'Почати ▶', back: '← Назад', exit: '← Вийти', home: '🏠 На головну',
      again: '🔄 Ще раз', again_bad: '🔁 Повторити ці слова', to_cards: '🃏 На картки',
      done_today: '✅ Сьогодні вже зіграно', streak: n => `🔥 ${n} ${n === 1 ? 'день' : n < 5 ? 'дні' : 'днів'} поспіль`, streak0: 'Почни серію сьогодні',
      know: n => `😎 Знаю: ${n}`, learn: n => `📚 Вчу: ${n}`, weak: n => `🎯 Слабкі: ${n}`,
      hint: 'Норвезьке слово звучить, коли відкриваєш картку. Знайшов пару з першого разу — слово йде на крок далі.',
      moves: '👣', time: '⏱', left: n => `Лишилось пар: ${n}`,
      win: 'Усі пари знайдено!', record: 'Новий рекорд!', score: (m, s) => `${m} ходів · ${s} с`,
      best: b => `рекорд: ${b} ходів`, perfect: 'Жодної помилки — чисто!',
      missed: 'Ці слова ще не вляглися:', moved: n => `${n} слів пішли на крок далі`,
      theme: '🎨 Тема гри', theme_all: 'Усі слова',
      no_words: 'Слів поки замало. Почитай комікс або відкрий сторінку «Слова» — і повертайся.',
      // дуель
      duel_title: '🤝 Пари вдвох', duel_host: '📺 Створити гру', duel_join: '📱 Приєднатися',
      duel_scan: 'Хай друг відсканує код або відкриє посилання:', duel_code: 'Код гри', duel_wait: 'Чекаємо на друга…',
      duel_ready: 'Друг на зв’язку!', duel_go: '🚀 Почати', duel_rules: 'В обох однакові картки. Перемагає той, хто швидше склеїть усі пари.',
      duel_you: 'Ти', duel_friend: 'Друг', duel_win: '🏆 Ти виграв!', duel_lose: 'Друг був швидший', duel_draw: 'Нічия!',
      duel_left: 'Друг вийшов із гри.', duel_err: 'Не вдалося з’єднатися. Потрібен інтернет і сучасний браузер.',
      duel_err_room: 'Гру не знайдено. Перевір код — або друг уже її закрив.',
      duel_code_ph: 'напр. K7Q2M', duel_enter: 'Увійти ▶', duel_copy: '📋 Копіювати', duel_copied: 'Скопійовано ✓',
      duel_local: '⚠️ Сторінку відкрито з файлу — телефон не зможе приєднатися. Відкрий гру на bilohash.com/comiks/',
      duel_note: 'Слова з дуелі теж лягають у твою пам’ять: що не згадав — піде в роботу над помилками.'
    },
    en: {
      nav: '🧠 Pairs', title: '🧠 Pairs', lead: 'Turn two cards and match the Norwegian word with its translation. The words come from your weak spots, so every day is different.',
      daily: '📅 Daily game', daily_d: n => `${n} pairs for today — words that have not settled yet`,
      mist: '🔁 Work on mistakes', mist_d: n => `${n} words you have got wrong before`, mist_none: 'No mistakes — all clear!',
      duel: '🤝 Play with a friend', duel_d: 'One phone shows a QR code, the other scans it — then you race',
      comic: '📖 Words from the comic', start: 'Start ▶', back: '← Back', exit: '← Exit', home: '🏠 Home',
      again: '🔄 Again', again_bad: '🔁 Repeat these words', to_cards: '🃏 To the cards',
      done_today: '✅ Played today', streak: n => `🔥 ${n} ${n === 1 ? 'day' : 'days'} in a row`, streak0: 'Start your streak today',
      know: n => `😎 Known: ${n}`, learn: n => `📚 Learning: ${n}`, weak: n => `🎯 Weak: ${n}`,
      hint: 'The Norwegian word is read aloud when you turn a card. Match it first try and the word moves one step further.',
      moves: '👣', time: '⏱', left: n => `Pairs left: ${n}`,
      win: 'All pairs found!', record: 'New record!', score: (m, s) => `${m} moves · ${s} s`,
      best: b => `record: ${b} moves`, perfect: 'Not a single mistake!',
      missed: 'These words have not settled yet:', moved: n => `${n} words moved one step further`,
      theme: '🎨 Game topic', theme_all: 'All words',
      no_words: 'Not enough words yet. Read a comic or open the Words page and come back.',
      duel_title: '🤝 Pairs for two', duel_host: '📺 Create a game', duel_join: '📱 Join',
      duel_scan: 'Let your friend scan the code or open the link:', duel_code: 'Game code', duel_wait: 'Waiting for your friend…',
      duel_ready: 'Your friend is connected!', duel_go: '🚀 Start', duel_rules: 'You both get the same cards. The first to match them all wins.',
      duel_you: 'You', duel_friend: 'Friend', duel_win: '🏆 You win!', duel_lose: 'Your friend was faster', duel_draw: 'A draw!',
      duel_left: 'Your friend left the game.', duel_err: 'Could not connect. An internet connection and a modern browser are required.',
      duel_err_room: 'Game not found. Check the code — or your friend has closed it.',
      duel_code_ph: 'e.g. K7Q2M', duel_enter: 'Enter ▶', duel_copy: '📋 Copy', duel_copied: 'Copied ✓',
      duel_local: '⚠️ The page is opened from a file — phones cannot join. Open the game on bilohash.com/comiks/',
      duel_note: 'Words from the duel go into your memory too: whatever you miss lands in your mistakes.'
    },
    no: {
      nav: '🧠 Par', title: '🧠 Par', lead: 'Snu to kort og sett sammen det norske ordet og oversettelsen. Ordene kommer fra dine svake punkter, så spillet er nytt hver dag.',
      daily: '📅 Dagens spill', daily_d: n => `${n} par i dag – ord som ikke har satt seg ennå`,
      mist: '🔁 Jobb med feilene', mist_d: n => `${n} ord du har bommet på før`, mist_none: 'Ingen feil – alt klart!',
      duel: '🤝 Spill med en venn', duel_d: 'Én mobil viser QR-koden, den andre skanner – så kappspiller dere',
      comic: '📖 Ord fra tegneserien', start: 'Start ▶', back: '← Tilbake', exit: '← Avslutt', home: '🏠 Hjem',
      again: '🔄 En gang til', again_bad: '🔁 Øv på disse ordene', to_cards: '🃏 Til kortene',
      done_today: '✅ Spilt i dag', streak: n => `🔥 ${n} dager på rad`, streak0: 'Start rekken i dag',
      know: n => `😎 Kan: ${n}`, learn: n => `📚 Lærer: ${n}`, weak: n => `🎯 Svake: ${n}`,
      hint: 'Det norske ordet leses høyt når du snur et kort. Finner du paret på første forsøk, går ordet et steg videre.',
      moves: '👣', time: '⏱', left: n => `Par igjen: ${n}`,
      win: 'Alle par funnet!', record: 'Ny rekord!', score: (m, s) => `${m} trekk · ${s} s`,
      best: b => `rekord: ${b} trekk`, perfect: 'Ikke én feil!',
      missed: 'Disse ordene har ikke satt seg ennå:', moved: n => `${n} ord gikk et steg videre`,
      theme: '🎨 Tema for spillet', theme_all: 'Alle ord',
      no_words: 'For få ord ennå. Les en tegneserie eller åpne «Ord», og kom tilbake.',
      duel_title: '🤝 Par for to', duel_host: '📺 Lag et spill', duel_join: '📱 Bli med',
      duel_scan: 'La vennen skanne koden eller åpne lenken:', duel_code: 'Spillkode', duel_wait: 'Venter på vennen …',
      duel_ready: 'Vennen er tilkoblet!', duel_go: '🚀 Start', duel_rules: 'Dere får de samme kortene. Den som blir ferdig først, vinner.',
      duel_you: 'Du', duel_friend: 'Venn', duel_win: '🏆 Du vant!', duel_lose: 'Vennen var raskere', duel_draw: 'Uavgjort!',
      duel_left: 'Vennen forlot spillet.', duel_err: 'Kunne ikke koble til. Du trenger internett og en moderne nettleser.',
      duel_err_room: 'Fant ikke spillet. Sjekk koden – eller vennen har lukket det.',
      duel_code_ph: 'f.eks. K7Q2M', duel_enter: 'Bli med ▶', duel_copy: '📋 Kopier', duel_copied: 'Kopiert ✓',
      duel_local: '⚠️ Siden er åpnet fra en fil – mobiler kan ikke bli med. Åpne spillet på bilohash.com/comiks/',
      duel_note: 'Ord fra duellen havner også i minnet ditt: det du bommer på, går til feilene dine.'
    },
    ar: {
      nav: '🧠 أزواج', title: '🧠 أزواج', lead: 'اقلب بطاقتين وصِل الكلمة النرويجية بترجمتها. الكلمات تأتي من نقاط ضعفك، لذا تختلف اللعبة كل يوم.',
      daily: '📅 لعبة اليوم', daily_d: n => `${n} زوجًا لليوم — كلمات لم تستقر بعد`,
      mist: '🔁 العمل على الأخطاء', mist_d: n => `${n} كلمة أخطأت فيها من قبل`, mist_none: 'لا أخطاء — ممتاز!',
      duel: '🤝 العب مع صديق', duel_d: 'هاتف يعرض رمز QR والآخر يمسحه — ثم تتسابقان',
      comic: '📖 كلمات القصة', start: 'ابدأ ▶', back: '← رجوع', exit: '← خروج', home: '🏠 الرئيسية',
      again: '🔄 مرة أخرى', again_bad: '🔁 كرّر هذه الكلمات', to_cards: '🃏 إلى البطاقات',
      done_today: '✅ لعبت اليوم', streak: n => `🔥 ${n} يومًا متتاليًا`, streak0: 'ابدأ سلسلتك اليوم',
      know: n => `😎 أعرف: ${n}`, learn: n => `📚 أتعلّم: ${n}`, weak: n => `🎯 ضعيفة: ${n}`,
      hint: 'تُنطق الكلمة النرويجية عند قلب البطاقة. إذا وجدت الزوج من أول مرة تتقدّم الكلمة خطوة.',
      moves: '👣', time: '⏱', left: n => `الأزواج المتبقية: ${n}`,
      win: 'وجدت كل الأزواج!', record: 'رقم قياسي جديد!', score: (m, s) => `${m} حركة · ${s} ث`,
      best: b => `الرقم القياسي: ${b} حركة`, perfect: 'بلا خطأ واحد!',
      missed: 'هذه الكلمات لم تستقر بعد:', moved: n => `${n} كلمة تقدّمت خطوة`,
      theme: '🎨 موضوع اللعبة', theme_all: 'كل الكلمات',
      no_words: 'الكلمات قليلة حتى الآن. اقرأ قصة أو افتح صفحة «الكلمات» ثم عُد.',
      duel_title: '🤝 أزواج لاثنين', duel_host: '📺 أنشئ لعبة', duel_join: '📱 انضم',
      duel_scan: 'دع صديقك يمسح الرمز أو يفتح الرابط:', duel_code: 'رمز اللعبة', duel_wait: 'في انتظار صديقك…',
      duel_ready: 'صديقك متصل!', duel_go: '🚀 ابدأ', duel_rules: 'لديكما البطاقات نفسها. من ينهيها أولًا يفوز.',
      duel_you: 'أنت', duel_friend: 'صديق', duel_win: '🏆 فزت!', duel_lose: 'كان صديقك أسرع', duel_draw: 'تعادل!',
      duel_left: 'غادر صديقك اللعبة.', duel_err: 'تعذّر الاتصال. يلزم إنترنت ومتصفح حديث.',
      duel_err_room: 'لم يُعثر على اللعبة. تحقّق من الرمز — أو أغلقها صديقك.',
      duel_code_ph: 'مثل K7Q2M', duel_enter: 'ادخل ▶', duel_copy: '📋 نسخ', duel_copied: 'تم النسخ ✓',
      duel_local: '⚠️ الصفحة مفتوحة من ملف — لا يمكن للهواتف الانضمام. افتح اللعبة على bilohash.com/comiks/',
      duel_note: 'كلمات المباراة تدخل ذاكرتك أيضًا: ما تخطئ فيه يذهب إلى أخطائك.'
    },
    de: {
      nav: '🧠 Paare', title: '🧠 Paare', lead: 'Dreh zwei Karten um und verbinde das norwegische Wort mit seiner Übersetzung. Die Wörter kommen aus deinen Schwachstellen, darum ist jeder Tag anders.',
      daily: '📅 Tagesspiel', daily_d: n => `${n} Paare für heute — Wörter, die noch nicht sitzen`,
      mist: '🔁 Fehler aufarbeiten', mist_d: n => `${n} Wörter, bei denen du dich geirrt hast`, mist_none: 'Keine Fehler — alles sauber!',
      duel: '🤝 Mit einem Freund spielen', duel_d: 'Ein Handy zeigt den QR-Code, das andere scannt — dann spielt ihr um die Wette',
      comic: '📖 Wörter aus dem Comic', start: 'Start ▶', back: '← Zurück', exit: '← Beenden', home: '🏠 Start',
      again: '🔄 Nochmal', again_bad: '🔁 Diese Wörter wiederholen', to_cards: '🃏 Zu den Karten',
      done_today: '✅ Heute schon gespielt', streak: n => `🔥 ${n} ${n === 1 ? 'Tag' : 'Tage'} in Folge`, streak0: 'Starte deine Serie heute',
      know: n => `😎 Kann ich: ${n}`, learn: n => `📚 Lerne ich: ${n}`, weak: n => `🎯 Schwach: ${n}`,
      hint: 'Das norwegische Wort wird vorgelesen, wenn du eine Karte umdrehst. Triffst du das Paar beim ersten Versuch, geht das Wort einen Schritt weiter.',
      moves: '👣', time: '⏱', left: n => `Paare übrig: ${n}`,
      win: 'Alle Paare gefunden!', record: 'Neuer Rekord!', score: (m, s) => `${m} Züge · ${s} s`,
      best: b => `Rekord: ${b} Züge`, perfect: 'Kein einziger Fehler!',
      missed: 'Diese Wörter sitzen noch nicht:', moved: n => `${n} Wörter sind einen Schritt weiter`,
      theme: '🎨 Thema des Spiels', theme_all: 'Alle Wörter',
      no_words: 'Noch zu wenige Wörter. Lies einen Comic oder öffne die Seite „Wörter“ — und komm zurück.',
      duel_title: '🤝 Paare zu zweit', duel_host: '📺 Spiel erstellen', duel_join: '📱 Beitreten',
      duel_scan: 'Lass deinen Freund den Code scannen oder den Link öffnen:', duel_code: 'Spielcode', duel_wait: 'Warten auf den Freund…',
      duel_ready: 'Dein Freund ist verbunden!', duel_go: '🚀 Start', duel_rules: 'Ihr bekommt beide dieselben Karten. Wer alle Paare zuerst findet, gewinnt.',
      duel_you: 'Du', duel_friend: 'Freund', duel_win: '🏆 Du hast gewonnen!', duel_lose: 'Dein Freund war schneller', duel_draw: 'Unentschieden!',
      duel_left: 'Dein Freund hat das Spiel verlassen.', duel_err: 'Verbindung nicht möglich. Du brauchst Internet und einen modernen Browser.',
      duel_err_room: 'Spiel nicht gefunden. Prüfe den Code — oder dein Freund hat es schon geschlossen.',
      duel_code_ph: 'z. B. K7Q2M', duel_enter: 'Beitreten ▶', duel_copy: '📋 Kopieren', duel_copied: 'Kopiert ✓',
      duel_local: '⚠️ Die Seite wurde aus einer Datei geöffnet — Handys können nicht beitreten. Öffne das Spiel auf bilohash.com/comiks/',
      duel_note: 'Wörter aus dem Duell kommen auch in dein Gedächtnis: was du nicht weißt, landet bei deinen Fehlern.'
    },
    pl: {
      nav: '🧠 Pary', title: '🧠 Pary', lead: 'Odwracaj po dwie karty i łącz norweskie słowo z tłumaczeniem. Słowa bierzemy z twoich słabych miejsc, więc każdego dnia gra jest inna.',
      daily: '📅 Gra dnia', daily_d: n => `${n} par na dziś — słowa, które jeszcze się nie utrwaliły`,
      mist: '🔁 Praca nad błędami', mist_d: n => `${n} słów, w których już się pomyliłeś`, mist_none: 'Brak błędów — czysto!',
      duel: '🤝 Zagraj ze znajomym', duel_d: 'Jeden telefon pokazuje kod QR, drugi go skanuje — i gracie na wyścigi',
      comic: '📖 Słowa z komiksu', start: 'Zacznij ▶', back: '← Wstecz', exit: '← Wyjdź', home: '🏠 Start',
      again: '🔄 Jeszcze raz', again_bad: '🔁 Powtórz te słowa', to_cards: '🃏 Do fiszek',
      done_today: '✅ Dziś już zagrane', streak: n => `🔥 ${n} ${n === 1 ? 'dzień' : 'dni'} z rzędu`, streak0: 'Zacznij serię dzisiaj',
      know: n => `😎 Znam: ${n}`, learn: n => `📚 Uczę się: ${n}`, weak: n => `🎯 Słabe: ${n}`,
      hint: 'Norweskie słowo jest czytane, gdy odwracasz kartę. Trafisz parę za pierwszym razem — słowo idzie o krok dalej.',
      moves: '👣', time: '⏱', left: n => `Pozostało par: ${n}`,
      win: 'Wszystkie pary znalezione!', record: 'Nowy rekord!', score: (m, s) => `${m} ruchów · ${s} s`,
      best: b => `rekord: ${b} ruchów`, perfect: 'Ani jednego błędu!',
      missed: 'Te słowa jeszcze się nie utrwaliły:', moved: n => `${n} słów poszło o krok dalej`,
      theme: '🎨 Temat gry', theme_all: 'Wszystkie słowa',
      no_words: 'Za mało słów. Przeczytaj komiks albo otwórz stronę „Słowa” — i wróć.',
      duel_title: '🤝 Pary we dwoje', duel_host: '📺 Utwórz grę', duel_join: '📱 Dołącz',
      duel_scan: 'Niech znajomy zeskanuje kod albo otworzy link:', duel_code: 'Kod gry', duel_wait: 'Czekamy na znajomego…',
      duel_ready: 'Znajomy jest połączony!', duel_go: '🚀 Zaczynamy', duel_rules: 'Oboje macie te same karty. Wygrywa ten, kto szybciej połączy wszystkie pary.',
      duel_you: 'Ty', duel_friend: 'Znajomy', duel_win: '🏆 Wygrałeś!', duel_lose: 'Znajomy był szybszy', duel_draw: 'Remis!',
      duel_left: 'Znajomy wyszedł z gry.', duel_err: 'Nie udało się połączyć. Potrzebny jest internet i nowoczesna przeglądarka.',
      duel_err_room: 'Nie znaleziono gry. Sprawdź kod — albo znajomy już ją zamknął.',
      duel_code_ph: 'np. K7Q2M', duel_enter: 'Wejdź ▶', duel_copy: '📋 Kopiuj', duel_copied: 'Skopiowano ✓',
      duel_local: '⚠️ Strona otwarta z pliku — telefon nie dołączy. Otwórz grę na bilohash.com/comiks/',
      duel_note: 'Słowa z pojedynku też trafiają do twojej pamięci: czego nie pamiętasz, idzie do pracy nad błędami.'
    },
    tr: {
      nav: '🧠 Eşler', title: '🧠 Eşler', lead: 'İkişer kart çevir ve Norveççe kelimeyi çevirisiyle birleştir. Kelimeler zayıf noktalarından geldiği için oyun her gün farklı.',
      daily: '📅 Günün oyunu', daily_d: n => `bugün için ${n} çift — henüz oturmamış kelimeler`,
      mist: '🔁 Hataların üzerinden geç', mist_d: n => `daha önce yanıldığın ${n} kelime`, mist_none: 'Hata yok — tertemiz!',
      duel: '🤝 Arkadaşınla oyna', duel_d: 'Bir telefon QR kodu gösterir, diğeri okutur — sonra yarışırsınız',
      comic: '📖 Çizgi romandaki kelimeler', start: 'Başla ▶', back: '← Geri', exit: '← Çık', home: '🏠 Ana sayfa',
      again: '🔄 Tekrar', again_bad: '🔁 Bu kelimeleri tekrarla', to_cards: '🃏 Kartlara',
      done_today: '✅ Bugün oynandı', streak: n => `🔥 ${n} gün üst üste`, streak0: 'Seriye bugün başla',
      know: n => `😎 Biliyorum: ${n}`, learn: n => `📚 Öğreniyorum: ${n}`, weak: n => `🎯 Zayıf: ${n}`,
      hint: 'Kartı çevirdiğinde Norveççe kelime sesli okunur. Eşi ilk denemede bulursan kelime bir adım ilerler.',
      moves: '👣', time: '⏱', left: n => `Kalan çift: ${n}`,
      win: 'Bütün çiftler bulundu!', record: 'Yeni rekor!', score: (m, s) => `${m} hamle · ${s} sn`,
      best: b => `rekor: ${b} hamle`, perfect: 'Tek bir hata bile yok!',
      missed: 'Bu kelimeler henüz oturmadı:', moved: n => `${n} kelime bir adım ilerledi`,
      theme: '🎨 Oyunun konusu', theme_all: 'Bütün kelimeler',
      no_words: 'Kelime henüz az. Bir çizgi roman oku ya da „Kelimeler” sayfasını aç — sonra dön.',
      duel_title: '🤝 İki kişilik Eşler', duel_host: '📺 Oyun kur', duel_join: '📱 Katıl',
      duel_scan: 'Arkadaşın kodu okutsun ya da bağlantıyı açsın:', duel_code: 'Oyun kodu', duel_wait: 'Arkadaşın bekleniyor…',
      duel_ready: 'Arkadaşın bağlandı!', duel_go: '🚀 Başla', duel_rules: 'İkinizde de aynı kartlar var. Bütün çiftleri önce bulan kazanır.',
      duel_you: 'Sen', duel_friend: 'Arkadaş', duel_win: '🏆 Kazandın!', duel_lose: 'Arkadaşın daha hızlıydı', duel_draw: 'Berabere!',
      duel_left: 'Arkadaşın oyundan ayrıldı.', duel_err: 'Bağlanılamadı. İnternet ve modern bir tarayıcı gerekir.',
      duel_err_room: 'Oyun bulunamadı. Kodu kontrol et — ya da arkadaşın oyunu kapattı.',
      duel_code_ph: 'örn. K7Q2M', duel_enter: 'Gir ▶', duel_copy: '📋 Kopyala', duel_copied: 'Kopyalandı ✓',
      duel_local: '⚠️ Sayfa dosyadan açıldı — telefonlar katılamaz. Oyunu bilohash.com/comiks/ adresinde aç',
      duel_note: 'Düellodaki kelimeler de hafızana işlenir: hatırlayamadıkların hatalarına gider.'
    },
    lt: {
      nav: '🧠 Poros', title: '🧠 Poros', lead: 'Versk po dvi korteles ir sujunk norvegišką žodį su vertimu. Žodžiai imami iš tavo silpnų vietų, todėl kiekvieną dieną žaidimas kitoks.',
      daily: '📅 Dienos žaidimas', daily_d: n => `${n} poros šiandien — žodžiai, kurie dar neįsitvirtino`,
      mist: '🔁 Darbas su klaidomis', mist_d: n => `${n} žodžiai, kuriuose jau klydai`, mist_none: 'Klaidų nėra — švaru!',
      duel: '🤝 Žaisk su draugu', duel_d: 'Vienas telefonas rodo QR kodą, kitas nuskaito — ir lenktyniaujate',
      comic: '📖 Komikso žodžiai', start: 'Pradėti ▶', back: '← Atgal', exit: '← Išeiti', home: '🏠 Pradžia',
      again: '🔄 Dar kartą', again_bad: '🔁 Pakartoti šiuos žodžius', to_cards: '🃏 Į korteles',
      done_today: '✅ Šiandien jau žaista', streak: n => `🔥 ${n} ${n === 1 ? 'diena' : 'dienos'} iš eilės`, streak0: 'Pradėk seriją šiandien',
      know: n => `😎 Moku: ${n}`, learn: n => `📚 Mokausi: ${n}`, weak: n => `🎯 Silpni: ${n}`,
      hint: 'Apvertus kortelę norvegiškas žodis perskaitomas balsu. Radai porą iš pirmo karto — žodis žengia žingsnį toliau.',
      moves: '👣', time: '⏱', left: n => `Liko porų: ${n}`,
      win: 'Visos poros rastos!', record: 'Naujas rekordas!', score: (m, s) => `${m} ėjimų · ${s} s`,
      best: b => `rekordas: ${b} ėjimų`, perfect: 'Nė vienos klaidos!',
      missed: 'Šie žodžiai dar neįsitvirtino:', moved: n => `${n} žodžiai žengė žingsnį toliau`,
      theme: '🎨 Žaidimo tema', theme_all: 'Visi žodžiai',
      no_words: 'Žodžių dar per mažai. Perskaityk komiksą arba atidaryk puslapį „Žodžiai“ — ir grįžk.',
      duel_title: '🤝 Poros dviese', duel_host: '📺 Sukurti žaidimą', duel_join: '📱 Prisijungti',
      duel_scan: 'Tegul draugas nuskaito kodą arba atidaro nuorodą:', duel_code: 'Žaidimo kodas', duel_wait: 'Laukiame draugo…',
      duel_ready: 'Draugas prisijungė!', duel_go: '🚀 Pradėti', duel_rules: 'Abu gaunate tas pačias korteles. Laimi tas, kas greičiau suras visas poras.',
      duel_you: 'Tu', duel_friend: 'Draugas', duel_win: '🏆 Laimėjai!', duel_lose: 'Draugas buvo greitesnis', duel_draw: 'Lygiosios!',
      duel_left: 'Draugas paliko žaidimą.', duel_err: 'Nepavyko prisijungti. Reikia interneto ir šiuolaikinės naršyklės.',
      duel_err_room: 'Žaidimas nerastas. Patikrink kodą — arba draugas jį jau uždarė.',
      duel_code_ph: 'pvz. K7Q2M', duel_enter: 'Įeiti ▶', duel_copy: '📋 Kopijuoti', duel_copied: 'Nukopijuota ✓',
      duel_local: '⚠️ Puslapis atidarytas iš failo — telefonas neprisijungs. Atidaryk žaidimą adresu bilohash.com/comiks/',
      duel_note: 'Dvikovos žodžiai taip pat patenka į tavo atmintį: ko neprisiminei, keliauja į klaidas.'
    }
  };
  const tx = () => T[C().ui] || T.en;
  const g = (k, ...a) => { const tbl = tx(); const v = k in tbl ? tbl[k] : T.en[k]; return typeof v === 'function' ? v(...a) : v; };

  /* ---------------- колода: спільна пам'ять акаунта ---------------- */
  const today = () => new Date().toISOString().slice(0, 10);
  const trOf = v => { const K = C(); const l = K.trLang(); return (l === 'ar' ? K.arFor(v.en) || v.en : l === 'en' ? v.en : v.uk) || v.en || v.uk || ''; };
  const fits = v => v.no && v.no.length <= 18 && trOf(v).length <= 28;

  /* Кожне слово отримує вагу: помилки — найважливіші, далі нові й «перша коробка»,
     потім ті, чий час повторення вже настав. Так щоденна гра сама тягне слабкі місця. */
  function pool() {
    const K = C();
    const st = K.cards.get();
    const bad = new Map(K.errs.list().map(e => [K.norm(e.k), e.n || 1]));
    return K.allVocab().filter(fits).map(v => {
      const s = st[v.key];
      const box = s ? (s.box || 0) : 0;
      const due = !s || (s.due || 0) <= Date.now();
      const errN = bad.get(v.key) || 0;
      const weight = errN * 60 + (box === 0 ? 25 : box === 1 ? 45 : box === 2 ? 18 : 0) + (due ? 12 : 0);
      return Object.assign({ box, due, errN, weight }, v);
    });
  }
  const counts = p => ({
    weak: p.filter(v => v.errN || v.box <= 1).length,
    learn: p.filter(v => !v.errN && v.box >= 2 && v.box <= 3).length,
    know: p.filter(v => !v.errN && v.box >= 4).length
  });
  const size = () => (C().settings.level === 'kids' ? 6 : 8);
  /* Тема гри живе в налаштуваннях акаунта: обрав раз — щоденна гра далі бере слова звідти.
     Порожнє значення означає «усі слова», і тоді працює звичайний добір за слабкістю. */
  const THEME = 'pairsTheme';
  const themeId = () => C().store.get(THEME, '');
  const setTheme = id => C().store.set(THEME, id || '');
  const themeList = () => (window.KomiksWords ? window.KomiksWords.themes() : []);
  const themeKeys = id => {
    const th = themeList().find(x => x.id === id);
    if (!th) return null;
    const K = C();
    return new Set(th.words.map(([no]) => K.norm(no)));
  };
  // трохи випадковості, щоб та сама вісімка не поверталася день у день
  const byWeight = (list, n) => C().shuffle(list.map(v => [v, v.weight + Math.random() * 20]).sort((a, b) => b[1] - a[1]).slice(0, Math.max(n, n * 2)).map(x => x[0])).slice(0, n);

  function deckFor(mode, comic) {
    const K = C(), p = pool(), n = size();
    if (mode === 'mistakes') { const bad = p.filter(v => v.errN); return byWeight(bad, Math.min(n, bad.length)); }
    if (mode === 'comic' && comic) {
      const keys = new Set(comic.vocab.map(([no]) => K.norm(no)));
      return K.sample(p.filter(v => keys.has(v.key)), n);
    }
    const keys = themeKeys(themeId());
    const list = keys ? p.filter(v => keys.has(v.key)) : p;
    return byWeight(list.length >= n ? list : p, n);
  }

  /* ---------------- журнал гри ---------------- */
  const LOG = 'pairsLog';
  const logGet = () => Object.assign({ days: [], rounds: 0 }, C().store.get(LOG, {}));
  function logRound() {
    const K = C(), l = logGet(), d = today();
    if (l.days[l.days.length - 1] !== d) l.days.push(d);
    l.days = l.days.slice(-90); l.rounds = (l.rounds || 0) + 1;
    K.store.set(LOG, l); K.day.mark('pairs');
  }
  const playedToday = () => logGet().days[logGet().days.length - 1] === today();
  function streak() {
    const days = logGet().days; if (!days.length) return 0;
    const d = new Date(); let n = 0;
    for (;;) {
      const key = d.toISOString().slice(0, 10);
      if (days.includes(key)) { n++; d.setDate(d.getDate() - 1); continue; }
      if (n === 0 && key === today()) { d.setDate(d.getDate() - 1); continue; } // сьогодні ще не грали — рахуємо вчорашню серію
      return n;
    }
  }

  /* ---------------- дошка ---------------- */
  /* onEnd(res) — спільний фініш для одиночної гри й дуелі.
     net — необов'язковий канал дуелі: { send(msg), label } . */
  function board(items, { onEnd, net = null, title = '' } = {}) {
    const K = C(), h = K.h;
    const root = K.h('div', { class: 'pairs-board' });
    const tl = K.trLang();
    const tiles = K.shuffle(items.flatMap((v, k) => [{ k, v, lang: 'no', text: v.no }, { k, v, lang: tl, text: trOf(v) }]));
    let open = [], moves = 0, matched = 0, lock = false;
    const missed = new Set();                       // ключі слів, де була хоч одна помилка
    const t0 = Date.now();
    const movesEl = h('span', { class: 'stat' }, g('moves') + ' 0');
    const timeEl = h('span', { class: 'stat' }, g('time') + ' 0');
    const leftEl = h('span', { class: 'stat' }, g('left', items.length));
    const timer = setInterval(() => { if (!root.isConnected) return clearInterval(timer); timeEl.textContent = `${g('time')} ${Math.round((Date.now() - t0) / 1000)}`; }, 1000);
    const foeBar = net ? h('i', { style: { width: '0%' } }) : null;
    const foeBox = net ? h('div', { class: 'duel-foe' }, h('b', {}, '👤 ' + g('duel_friend')), h('div', { class: 'duel-bar' }, foeBar)) : null;

    const grid = h('div', { class: 'tiles pairs-grid' });
    const pic = v => (window.KomiksPics && window.KomiksPics.has(v.no) ? h('span', { class: 'tile-pic' }, window.KomiksPics.el(v.no, 46)) : null);
    const els = tiles.map(tile => {
      const b = h('button', { class: 'tile', type: 'button', 'aria-label': K.t('card_aria') },
        h('span', { class: 'tile-in' }, h('span', { class: 'tile-back' }, '?'),
          h('span', { class: 'tile-front ' + (tile.lang === 'no' ? 'no' : 'uk') },
            h('small', {}, tile.lang.toUpperCase()),
            tile.lang === 'no' ? null : pic(tile.v),
            h('span', { class: 'tile-w' }, tile.text))));
      b.addEventListener('click', () => {
        if (lock || tile.done || open.includes(tile)) return;
        b.classList.add('open');
        if (tile.lang === 'no') { K.Speech.stop(); K.Speech.speak(tile.text, 'narrator', { rate: 0.95 }); }
        open.push(tile);
        if (open.length < 2) return;
        moves++; movesEl.textContent = `${g('moves')} ${moves}`;
        const [a, z] = open;
        if (a.k === z.k && a.lang !== z.lang) {
          a.done = z.done = true; matched++; open = [];
          leftEl.textContent = g('left', items.length - matched);
          setTimeout(() => { els[tiles.indexOf(a)].classList.add('done'); els[tiles.indexOf(z)].classList.add('done'); K.Sfx.good(); }, 220);
          if (net) net.send({ t: 'progress', matched, moves });
          if (matched === items.length) setTimeout(finish, 750);
        } else {
          // помилка: обидва слова, які зараз на столі, вважаємо ще не вивченими
          missed.add(a.v.key); missed.add(z.v.key);
          lock = true;
          els[tiles.indexOf(a)].classList.add('miss'); els[tiles.indexOf(z)].classList.add('miss');
          K.Sfx.bad && K.Sfx.bad();
          setTimeout(() => {
            [a, z].forEach(x => { const e = els[tiles.indexOf(x)]; e.classList.remove('open', 'miss'); });
            open = []; lock = false;
          }, 1100);
        }
      });
      return b;
    });
    grid.append(...els);

    function finish() {
      clearInterval(timer);
      const secs = Math.round((Date.now() - t0) / 1000);
      // головне: підсумок гри йде в ту саму пам'ять, що й картки та помилки
      items.forEach(v => K.gradeWord(v, !missed.has(v.key), 'pairs'));
      logRound();
      const res = { moves, secs, missed: items.filter(v => missed.has(v.key)), items };
      if (net) net.send({ t: 'done', secs, moves });
      onEnd(res);
    }

    root.append(h('div', { class: 'pairs-head' }, h('a', { class: 'btn small', href: '#/pairs' }, g('exit')),
      title ? h('b', { class: 'pairs-title' }, title) : null,
      h('span', { class: 'row-center pairs-stats' }, leftEl, movesEl, timeEl)),
      foeBox || null, h('p', { class: 'hint' }, g('hint')), grid);
    root.setFoe = n => { if (foeBar) foeBar.style.width = Math.round(n / items.length * 100) + '%'; };
    return root;
  }

  /* ---------------- екран результату ---------------- */
  function resultView(res, { mode, comic, duel = null } = {}) {
    const K = C(), h = K.h;
    const key = 'pairsBest.' + mode + '.' + K.settings.level;
    const best = K.store.get(key, null), record = !best || res.moves < best.moves;
    if (record) K.store.set(key, { moves: res.moves, secs: res.secs });
    const clean = !res.missed.length;
    if (clean) { K.confetti(); K.Sfx.win(); } else K.Sfx.tick();
    const head = duel ? duel.title : record ? g('record') : g('win');
    return h('div', { class: 'q-card result pairs-res' },
      h('div', { class: 'res-emo' }, duel ? duel.icon : clean ? '🧠🎉' : '🧠'),
      h('h2', {}, head),
      duel ? h('p', { class: 'score' }, duel.sub) : null,
      h('p', { class: 'score' }, g('score', res.moves, res.secs) + (best && !record ? ' · ' + g('best', best.moves) : '')),
      clean ? h('p', { class: 'day-ok' }, g('perfect')) : null,
      h('p', { class: 'hint' }, g('moved', res.items.length - res.missed.length)),
      res.missed.length ? h('div', { class: 'mistakes' }, h('h3', {}, g('missed')),
        res.missed.map(v => h('div', { class: 'mistake' },
          h('span', {}, h('b', { lang: 'nb' }, v.no), ' — ', trOf(v)),
          h('button', { class: 'play', type: 'button', onclick: () => K.Speech.speak(v.no, 'narrator', { rate: 0.9 }) }, '🔊')))) : null,
      h('div', { class: 'row-center' },
        res.missed.length >= 3 ? h('button', { class: 'btn accent', type: 'button', onclick: () => play(res.missed.slice(0, size()), { mode, comic }) }, g('again_bad')) : null,
        h('button', { class: 'btn accent', type: 'button', onclick: () => location.hash = comic ? '#/pairs/' + comic.id : '#/pairs' }, g('again')),
        h('a', { class: 'btn primary', href: '#/cards' }, g('to_cards')),
        h('a', { class: 'btn', href: '#/today' }, '📅')));
  }

  let stage = null;                     // сторінка, на якій зараз гра
  function play(items, { mode, comic }) {
    if (!stage) return;
    const b = board(items, { title: comic ? comic.title : g(mode === 'mistakes' ? 'mist' : 'daily'), onEnd: res => { stage.replaceChildren(resultView(res, { mode, comic })); window.scrollTo({ top: 0 }); } });
    stage.replaceChildren(b);
    window.scrollTo({ top: 0 });
  }

  /* ---------------- головна сторінка гри ---------------- */
  function hub() {
    const K = C(), h = K.h;
    const p = pool(), cnt = counts(p);
    const badN = p.filter(v => v.errN).length;
    const st = streak();
    const root = h('section', { class: 'pairs-view' });
    stage = root;                       // гра заміщає весь екран вибору

    const card = (icon, title, note, onclick, cls = '') =>
      h('button', { class: 'pair-mode' + (cls ? ' ' + cls : ''), type: 'button', onclick },
        h('span', { class: 'pm-ic' }, icon), h('div', {}, h('b', {}, title), h('small', {}, note)), h('span', { class: 'pm-go' }, '→'));

    if (p.length < 4) {
      root.append(K.pageHead(g('title')), h('p', { class: 'lead-p' }, g('no_words')));
      return root;
    }
    root.append(K.pageHead(g('title')), h('p', { class: 'lead-p' }, g('lead')),
      h('div', { class: 'pairs-bar' },
        h('b', { class: 'day-streak' }, st ? g('streak', st) : g('streak0')),
        playedToday() ? h('span', { class: 'day-ok' }, g('done_today')) : null),
      h('div', { class: 'pairs-counts' }, [[g('weak', cnt.weak), 'w'], [g('learn', cnt.learn), 'l'], [g('know', cnt.know), 'k']]
        .map(([txt, c]) => h('span', { class: 'pc pc-' + c }, txt))),
      h('h3', { class: 'pairs-th-t' }, g('theme')),
      themeBox(),
      h('div', { class: 'pairs-modes' },
        card('📅', g('daily'), g('daily_d', size()), () => play(deckFor('daily'), { mode: 'daily' }), 'main'),
        badN >= 4
          ? card('🔁', g('mist'), g('mist_d', badN), () => play(deckFor('mistakes'), { mode: 'mistakes' }))
          : card('🔁', g('mist'), g('mist_none'), () => play(deckFor('daily'), { mode: 'daily' }), 'off'),
        card('🤝', g('duel'), g('duel_d'), () => { location.hash = '#/pairs/duel'; })));
    return root;
  }

  // рядок тем: «усі слова» + теми зі сторінки «Слова» (лише ті, де слів вистачає на гру)
  function themeBox() {
    const K = C(), h = K.h;
    const box = h('div', { class: 'pairs-themes' });
    const paint = () => {
      const cur = themeId();
      const chip = (id, label) => {
        const b = h('button', { class: 'th-chip' + (cur === id ? ' on' : ''), type: 'button', onclick: () => { setTheme(id); paint(); } }, label);
        return b;
      };
      box.replaceChildren(chip('', g('theme_all')),
        ...themeList().filter(t => t.words.length >= size()).map(t => chip(t.id, `${t.icon} ${window.KomiksWords.name(t)}`)));
    };
    paint();
    return box;
  }

  /* ---------------- дуель по QR ---------------- */
  const PREFIX = 'komiks-lab-pair-';
  const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const genCode = () => Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
  const duelUrl = code => location.href.split('#')[0].split('?')[0] + '#/pairs/duel/' + code;
  let libs = null;
  function loadLibs() {
    if (libs) return libs;
    const v = (window.KOMIKS_DATA || {}).version || '';
    const load = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src + (v ? '?v=' + v : ''); s.onload = res; s.onerror = () => rej(new Error(src)); document.head.appendChild(s); });
    libs = Promise.all([window.Peer ? null : load('assets/vendor/peerjs.min.js'), window.qrcode ? null : load('assets/vendor/qrcode.js')]).catch(e => { libs = null; throw e; });
    return libs;
  }
  function qrEl(url, size = 5) {
    try { const q = window.qrcode(0, 'M'); q.addData(url); q.make(); const box = C().h('div', { class: 'qr-box' }); box.innerHTML = q.createImgTag(size, 8); return box; }
    catch { return null; }
  }
  let duel = null;                       // { peer, conn, destroy() }
  function endDuel() { if (duel) { try { duel.destroy(); } catch { /* ignore */ } duel = null; } }

  // спільний фініш дуелі: обидва боки самі рахують, хто швидший
  function duelFinish(root, mine, theirs, mode) {
    const K = C();
    const win = !theirs ? null : mine.secs === theirs.secs ? 0 : mine.secs < theirs.secs ? 1 : -1;
    const title = win === 1 ? g('duel_win') : win === -1 ? g('duel_lose') : win === 0 ? g('duel_draw') : g('win');
    const icon = win === 1 ? '🏆' : win === -1 ? '🙂' : '🤝';
    const sub = theirs ? `${g('duel_you')}: ${mine.secs} с · ${g('duel_friend')}: ${theirs.secs} с` : '';
    root.replaceChildren(resultView(mine.res, { mode, duel: { title, icon, sub } }));
  }

  function duelView(code) {
    const K = C(), h = K.h;
    const root = h('section', { class: 'pairs-view duel-view' });
    const isJoin = !!code;
    const body = h('div', {});
    root.append(K.pageHead(g('duel_title')), h('p', { class: 'lead-p' }, g('duel_rules')),
      h('p', { class: 'hint' }, g('duel_note')), body);
    if (!location.protocol.startsWith('http')) { body.append(h('p', { class: 'warn' }, g('duel_local'))); return root; }

    const fail = msg => body.replaceChildren(h('p', { class: 'warn' }, msg), h('a', { class: 'btn', href: '#/pairs' }, g('back')));

    // мій бік гри: показуємо дошку й слухаємо прогрес друга
    function startBoard(items, conn) {
      let mine = null, theirs = null;
      const net = { send: m => { try { conn && conn.open && conn.send(m); } catch { /* ignore */ } } };
      const b = board(items, {
        title: g('duel_title'), net,
        onEnd: res => { mine = { res, secs: res.secs, moves: res.moves }; if (theirs || !conn || !conn.open) duelFinish(body, mine, theirs, 'duel'); else body.replaceChildren(h('div', { class: 'q-card result' }, h('div', { class: 'res-emo' }, '⏳'), h('h2', {}, g('duel_wait')))); }
      });
      body.replaceChildren(b);
      return {
        msg: m => {
          if (m.t === 'progress') b.setFoe(m.matched);
          if (m.t === 'done') { theirs = { secs: m.secs, moves: m.moves }; if (mine) duelFinish(body, mine, theirs, 'duel'); }
        },
        gone: () => { if (!mine) fail(g('duel_left')); }
      };
    }

    body.append(h('p', { class: 'hint' }, g(isJoin ? 'duel_wait' : 'duel_wait')));
    loadLibs().then(() => {
      endDuel();
      const myCode = isJoin ? code.toUpperCase() : genCode();
      const peer = isJoin ? new window.Peer() : new window.Peer(PREFIX + myCode);
      let live = null;
      duel = { destroy: () => { try { peer.destroy(); } catch { /* ignore */ } } };
      // причину відмови називаємо конкретно, інакше «немає зв'язку» вводить в оману
      peer.on('error', e => {
        const t = String((e && e.type) || '');
        if (t === 'peer-unavailable') return fail(g('duel_err_room'));
        if (t === 'unavailable-id') return fail(g('duel_err_room'));
        fail(g('duel_err') + (t ? ' (' + t + ')' : ''));
      });

      if (isJoin) {
        peer.on('open', () => {
          const conn = peer.connect(PREFIX + myCode, { reliable: true });
          conn.on('open', () => body.replaceChildren(h('p', { class: 'lead-p' }, g('duel_ready')), h('div', { class: 'au-spinner' })));
          conn.on('data', m => {
            if (m.t === 'deck') { live = startBoard(m.items.map(x => ({ key: x.k, no: x.no, uk: x.uk, en: x.en })), conn); return; }
            if (live) live.msg(m);
          });
          conn.on('close', () => { if (live) live.gone(); else fail(g('duel_left')); });
        });
      } else {
        const url = duelUrl(myCode);
        peer.on('open', () => {
          const copyBtn = h('button', { class: 'btn small', type: 'button', onclick: async () => { try { await navigator.clipboard.writeText(url); copyBtn.textContent = g('duel_copied'); } catch { /* ignore */ } } }, g('duel_copy'));
          body.replaceChildren(
            h('div', { class: 'box duel-box' }, h('h3', {}, g('duel_code') + ': ' + myCode),
              h('p', { class: 'hint' }, g('duel_scan')), qrEl(url),
              h('p', { class: 'duel-url' }, url), h('div', { class: 'row-center' }, copyBtn)),
            h('p', { class: 'lead-p' }, g('duel_wait')));
        });
        peer.on('connection', conn => {
          conn.on('open', () => {
            const items = deckFor('daily');
            conn.send({ t: 'deck', items: items.map(v => ({ k: v.key, no: v.no, uk: v.uk, en: v.en })) });
            live = startBoard(items, conn);
          });
          conn.on('data', m => { if (live) live.msg(m); });
          conn.on('close', () => { if (live) live.gone(); });
        });
      }
    }).catch(() => fail(g('duel_err')));
    return root;
  }

  /* ---------------- вхід із маршрутизатора ---------------- */
  function render(id, arg) {
    endDuel();
    if (id === 'duel') return duelView(arg || '');
    if (id === 'mistakes') { const root = hub(); setTimeout(() => { const bad = deckFor('mistakes'); if (bad.length >= 4) play(bad, { mode: 'mistakes' }); }, 0); return root; }
    if (id) {
      const c = C().COMICS.find(x => x.id === id);
      if (c) {
        const K = C(), root = K.h('section', { class: 'pairs-view' });
        stage = root;
        const items = deckFor('comic', c);
        if (items.length >= 3) play(items, { mode: 'comic', comic: c });
        else root.append(K.h('p', { class: 'lead-p' }, g('no_words')));
        return root;
      }
    }
    return hub();
  }
  function onRoute(view) { if (view !== 'pairs') endDuel(); }

  window.KomiksPairs = { render, onRoute, text: k => tx()[k], counts: () => counts(pool()), playedToday, streak, mistakesCount: () => pool().filter(v => v.errN).length };
})();
