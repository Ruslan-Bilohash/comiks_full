/* Комікс·Lab — ✍️ письмо норвезькою з перевіркою (#/write).
   Учень обирає завдання свого рівня, пише кілька речень — і одразу бачить виправлений текст,
   список помилок із поясненням рідною мовою, пораду й зразок відповіді.
   Перевіряє модель на сервері (api/write.php); якщо ключ ШІ не налаштовано, сторінка
   працює в «тихому» режимі: чернетка зберігається, а зразок можна відкрити самому.
   Чернетка й останні роботи лежать у сховищі учня — нічого не губиться. */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const API = 'api/write.php';
  const C = () => window.KomiksCore;

  const T = {
    uk: { title: '✍️ Письмо норвезькою', nav: '✍️ Письмо',
      lead: 'Напиши кілька речень норвезькою — і отримаєш виправлений текст, пояснення помилок і зразок. Писати щодня важливіше, ніж писати багато.',
      level: 'Рівень', task: 'Завдання', other: '🎲 Інше завдання', ph: 'Пиши норвезькою…', words: n => `слів: ${n}`,
      check: '✅ Перевірити', checking: 'Перевіряю…', clear: 'Очистити',
      res: '📋 Перевірка', fixed: 'Виправлений текст', errs: 'Помилки', no_errs: '✨ Помилок не знайшов — чудова робота!',
      tip: '💡 Порада', sample: '📗 Зразок відповіді', show_sample: 'Показати зразок', score: n => `Оцінка: ${n} зі 100`,
      left: n => `Перевірок сьогодні: ${n}`, hist: '🗂️ Мої роботи', again: '✍️ Написати ще',
      noai: 'Автоматичної перевірки зараз немає. Текст збережено — порівняй його зі зразком самостійно.',
      err: { short: 'Напиши хоча б одне повне речення.', write_limit: 'Перевірок на сьогодні вже немає. Повертайся завтра — або відкрий Преміум.', no_ai: 'Перевірку ще не налаштовано на сервері.', ai: 'Перевірка не вдалася. Спробуй ще раз.', net: 'Немає зв’язку із сервером.' } },
    en: { title: '✍️ Writing in Norwegian', nav: '✍️ Writing',
      lead: 'Write a few sentences in Norwegian and get your text corrected, your mistakes explained and a model answer. Writing every day matters more than writing a lot.',
      level: 'Level', task: 'Task', other: '🎲 Another task', ph: 'Write in Norwegian…', words: n => `words: ${n}`,
      check: '✅ Check', checking: 'Checking…', clear: 'Clear',
      res: '📋 Feedback', fixed: 'Corrected text', errs: 'Mistakes', no_errs: '✨ No mistakes found — great work!',
      tip: '💡 Tip', sample: '📗 Model answer', show_sample: 'Show the model answer', score: n => `Score: ${n} out of 100`,
      left: n => `Checks left today: ${n}`, hist: '🗂️ My writing', again: '✍️ Write another',
      noai: 'Automatic checking is off right now. Your text is saved — compare it with the model answer yourself.',
      err: { short: 'Write at least one full sentence.', write_limit: 'No checks left today. Come back tomorrow.', no_ai: 'Checking is not set up on the server yet.', ai: 'The check failed. Please try again.', net: 'No connection to the server.' } },
    no: { title: '✍️ Skriving på norsk', nav: '✍️ Skriving',
      lead: 'Skriv noen setninger på norsk, og få teksten rettet, feilene forklart og et eksempelsvar. Å skrive hver dag betyr mer enn å skrive mye.',
      level: 'Nivå', task: 'Oppgave', other: '🎲 En annen oppgave', ph: 'Skriv på norsk …', words: n => `ord: ${n}`,
      check: '✅ Sjekk', checking: 'Sjekker …', clear: 'Tøm',
      res: '📋 Tilbakemelding', fixed: 'Rettet tekst', errs: 'Feil', no_errs: '✨ Fant ingen feil – veldig bra!',
      tip: '💡 Tips', sample: '📗 Eksempelsvar', show_sample: 'Vis eksempelsvaret', score: n => `Poeng: ${n} av 100`,
      left: n => `Sjekker igjen i dag: ${n}`, hist: '🗂️ Tekstene mine', again: '✍️ Skriv en til',
      noai: 'Automatisk retting er av akkurat nå. Teksten er lagret – sammenlign den med eksempelsvaret selv.',
      err: { short: 'Skriv minst én hel setning.', write_limit: 'Ingen sjekker igjen i dag. Kom tilbake i morgen – eller få Premium.', no_ai: 'Retting er ikke satt opp på serveren ennå.', ai: 'Rettingen mislyktes. Prøv igjen.', net: 'Ingen forbindelse med serveren.' } },
    ar: { title: '✍️ الكتابة بالنرويجية', nav: '✍️ الكتابة',
      lead: 'اكتب بضع جمل بالنرويجية واحصل على نص مصحّح وشرح لأخطائك ونموذج إجابة. الكتابة كل يوم أهم من الكتابة كثيرًا.',
      level: 'المستوى', task: 'المهمة', other: '🎲 مهمة أخرى', ph: 'اكتب بالنرويجية…', words: n => `الكلمات: ${n}`,
      check: '✅ تحقّق', checking: 'جارٍ التحقّق…', clear: 'مسح',
      res: '📋 التقييم', fixed: 'النص المصحّح', errs: 'الأخطاء', no_errs: '✨ لا أخطاء — عمل ممتاز!',
      tip: '💡 نصيحة', sample: '📗 نموذج إجابة', show_sample: 'أظهر النموذج', score: n => `النتيجة: ${n} من 100`,
      left: n => `التحققات المتبقية اليوم: ${n}`, hist: '🗂️ نصوصي', again: '✍️ اكتب نصًا آخر',
      noai: 'التصحيح التلقائي متوقف الآن. حُفظ نصك — قارنه بالنموذج بنفسك.',
      err: { short: 'اكتب جملة كاملة على الأقل.', write_limit: 'لا تحققات متبقية اليوم. عد غدًا.', no_ai: 'التصحيح غير مُعد على الخادم بعد.', ai: 'فشل التحقّق. حاول مجددًا.', net: 'لا اتصال بالخادم.' } },
    de: { title: '✍️ Schreiben auf Norwegisch', nav: '✍️ Schreiben',
      lead: 'Schreib ein paar Sätze auf Norwegisch und bekomme deinen Text korrigiert, deine Fehler erklärt und eine Musterantwort. Jeden Tag zu schreiben zählt mehr als viel zu schreiben.',
      level: 'Stufe', task: 'Aufgabe', other: '🎲 Andere Aufgabe', ph: 'Schreib auf Norwegisch…', words: n => `Wörter: ${n}`,
      check: '✅ Prüfen', checking: 'Wird geprüft…', clear: 'Leeren',
      res: '📋 Rückmeldung', fixed: 'Korrigierter Text', errs: 'Fehler', no_errs: '✨ Keine Fehler gefunden — gute Arbeit!',
      tip: '💡 Tipp', sample: '📗 Musterantwort', show_sample: 'Musterantwort zeigen', score: n => `Punkte: ${n} von 100`,
      left: n => `Prüfungen heute übrig: ${n}`, hist: '🗂️ Meine Texte', again: '✍️ Noch einen schreiben',
      noai: 'Die automatische Prüfung ist gerade aus. Dein Text ist gespeichert — vergleich ihn selbst mit der Musterantwort.',
      err: { short: 'Schreib mindestens einen vollständigen Satz.', write_limit: 'Heute sind keine Prüfungen mehr übrig. Komm morgen wieder.', no_ai: 'Die Prüfung ist auf dem Server noch nicht eingerichtet.', ai: 'Die Prüfung ist fehlgeschlagen. Bitte versuch es nochmal.', net: 'Keine Verbindung zum Server.' } },
    pl: { title: '✍️ Pisanie po norwesku', nav: '✍️ Pisanie',
      lead: 'Napisz kilka zdań po norwesku, a dostaniesz poprawiony tekst, wyjaśnienie błędów i wzorcową odpowiedź. Pisanie codziennie znaczy więcej niż pisanie dużo.',
      level: 'Poziom', task: 'Zadanie', other: '🎲 Inne zadanie', ph: 'Pisz po norwesku…', words: n => `słowa: ${n}`,
      check: '✅ Sprawdź', checking: 'Sprawdzam…', clear: 'Wyczyść',
      res: '📋 Ocena', fixed: 'Poprawiony tekst', errs: 'Błędy', no_errs: '✨ Nie znaleziono błędów — świetna robota!',
      tip: '💡 Wskazówka', sample: '📗 Wzorcowa odpowiedź', show_sample: 'Pokaż wzorcową odpowiedź', score: n => `Wynik: ${n} na 100`,
      left: n => `Pozostało sprawdzeń dziś: ${n}`, hist: '🗂️ Moje teksty', again: '✍️ Napisz kolejny',
      noai: 'Automatyczne sprawdzanie jest teraz wyłączone. Twój tekst jest zapisany — porównaj go sam z wzorcem.',
      err: { short: 'Napisz przynajmniej jedno pełne zdanie.', write_limit: 'Na dziś nie ma już sprawdzeń. Wróć jutro.', no_ai: 'Sprawdzanie nie jest jeszcze skonfigurowane na serwerze.', ai: 'Sprawdzanie się nie udało. Spróbuj ponownie.', net: 'Brak połączenia z serwerem.' } },
    tr: { title: '✍️ Norveççe yazma', nav: '✍️ Yazma',
      lead: 'Norveççe birkaç cümle yaz; metnin düzeltilsin, hataların açıklansın ve örnek bir cevap gelsin. Her gün yazmak, çok yazmaktan daha önemlidir.',
      level: 'Seviye', task: 'Görev', other: '🎲 Başka görev', ph: 'Norveççe yaz…', words: n => `kelime: ${n}`,
      check: '✅ Kontrol et', checking: 'Kontrol ediliyor…', clear: 'Temizle',
      res: '📋 Geri bildirim', fixed: 'Düzeltilmiş metin', errs: 'Hatalar', no_errs: '✨ Hata bulunamadı — harika iş!',
      tip: '💡 İpucu', sample: '📗 Örnek cevap', show_sample: 'Örnek cevabı göster', score: n => `Puan: 100 üzerinden ${n}`,
      left: n => `Bugün kalan kontrol: ${n}`, hist: '🗂️ Metinlerim', again: '✍️ Bir tane daha yaz',
      noai: 'Otomatik kontrol şu anda kapalı. Metnin kaydedildi — örnek cevapla kendin karşılaştır.',
      err: { short: 'En az bir tam cümle yaz.', write_limit: 'Bugün kontrol hakkın kalmadı. Yarın tekrar gel.', no_ai: 'Kontrol sunucuda henüz kurulmadı.', ai: 'Kontrol başarısız oldu. Lütfen tekrar dene.', net: 'Sunucuyla bağlantı yok.' } },
    lt: { title: '✍️ Rašymas norvegiškai', nav: '✍️ Rašymas',
      lead: 'Parašyk kelis sakinius norvegiškai ir gauk pataisytą tekstą, klaidų paaiškinimą bei pavyzdinį atsakymą. Rašyti kasdien svarbiau nei rašyti daug.',
      level: 'Lygis', task: 'Užduotis', other: '🎲 Kita užduotis', ph: 'Rašyk norvegiškai…', words: n => `žodžiai: ${n}`,
      check: '✅ Tikrinti', checking: 'Tikrinama…', clear: 'Išvalyti',
      res: '📋 Atsiliepimas', fixed: 'Pataisytas tekstas', errs: 'Klaidos', no_errs: '✨ Klaidų nerasta — puikus darbas!',
      tip: '💡 Patarimas', sample: '📗 Pavyzdinis atsakymas', show_sample: 'Rodyti pavyzdinį atsakymą', score: n => `Įvertinimas: ${n} iš 100`,
      left: n => `Šiandien liko patikrų: ${n}`, hist: '🗂️ Mano tekstai', again: '✍️ Rašyti dar vieną',
      noai: 'Automatinė patikra dabar išjungta. Tavo tekstas išsaugotas — palygink jį su pavyzdžiu pats.',
      err: { short: 'Parašyk bent vieną pilną sakinį.', write_limit: 'Šiandien patikrų nebeliko. Grįžk rytoj.', no_ai: 'Patikra serveryje dar nesukonfigūruota.', ai: 'Patikra nepavyko. Bandyk dar kartą.', net: 'Nėra ryšio su serveriu.' } }
  };
  const tx = () => T[(C() || {}).ui] || T.en;

  /* Прості вправи: жодного сервера й жодного ШІ — усе перевіряється в браузері
     за реченнями з коміксів, які учень уже читав. */
  const S = {
    uk: { tab_easy: '🧩 Прості вправи', tab_free: '✍️ Вільне письмо', easy_lead: 'Короткі вправи з коміксів: перекласти речення, вставити слово, записати почуте. Перевіряються одразу, без інтернету.',
      q_type: 'Напиши це речення норвезькою', q_blank: 'Встав слово, якого бракує', q_dict: 'Послухай і запиши почуте',
      listen: '🔊 Послухати', again: '🔁 Ще раз', check: '✅ Перевірити', next: 'Далі ▶', skip: 'Не знаю', start: '▶ Почати вправи',
      right: '✅ Правильно!', wrong: 'Правильно так:', yours: 'Ти написав:', res: '🏁 Готово!', score: (a, b) => `${a} з ${b} правильно`,
      more: '🔄 Ще вправи', hint_type: 'Пиши норвезькою. Розділові знаки й великі літери не враховуються.',
      none: 'Для цього рівня ще замало речень — вибери інший рівень.', ai_off: 'Перевірка через ШІ зараз не відповідає, тож відкрито прості вправи. Вільне письмо збережеться — спробуй пізніше.' },
    en: { tab_easy: '🧩 Simple exercises', tab_free: '✍️ Free writing', easy_lead: 'Short exercises from the comics: translate a sentence, fill in a word, write down what you hear. Checked instantly, no internet needed.',
      q_type: 'Write this sentence in Norwegian', q_blank: 'Fill in the missing word', q_dict: 'Listen and write what you hear',
      listen: '🔊 Listen', again: '🔁 Again', check: '✅ Check', next: 'Next ▶', skip: 'I don’t know', start: '▶ Start the exercises',
      right: '✅ Correct!', wrong: 'The correct answer is:', yours: 'You wrote:', res: '🏁 Done!', score: (a, b) => `${a} of ${b} correct`,
      more: '🔄 More exercises', hint_type: 'Write in Norwegian. Punctuation and capital letters are ignored.',
      none: 'Too few sentences at this level yet — pick another level.', ai_off: 'The AI check is not responding right now, so the simple exercises are open instead. Your free writing is saved — try again later.' },
    no: { tab_easy: '🧩 Enkle øvelser', tab_free: '✍️ Fri skriving', easy_lead: 'Korte øvelser fra tegneseriene: oversett en setning, fyll inn et ord, skriv det du hører. Sjekkes med en gang, uten internett.',
      q_type: 'Skriv denne setningen på norsk', q_blank: 'Fyll inn ordet som mangler', q_dict: 'Lytt og skriv det du hører',
      listen: '🔊 Lytt', again: '🔁 En gang til', check: '✅ Sjekk', next: 'Neste ▶', skip: 'Vet ikke', start: '▶ Start øvelsene',
      right: '✅ Riktig!', wrong: 'Riktig svar er:', yours: 'Du skrev:', res: '🏁 Ferdig!', score: (a, b) => `${a} av ${b} riktige`,
      more: '🔄 Flere øvelser', hint_type: 'Skriv på norsk. Tegnsetting og store bokstaver teller ikke.',
      none: 'For få setninger på dette nivået — velg et annet nivå.', ai_off: 'KI-sjekken svarer ikke nå, så de enkle øvelsene er åpnet i stedet. Teksten din er lagret — prøv igjen senere.' },
    ar: { tab_easy: '🧩 تمارين بسيطة', tab_free: '✍️ كتابة حرّة', easy_lead: 'تمارين قصيرة من القصص: ترجم جملة، أكمل كلمة، اكتب ما تسمعه. تُصحّح فورًا وبلا إنترنت.',
      q_type: 'اكتب هذه الجملة بالنرويجية', q_blank: 'أكمل الكلمة الناقصة', q_dict: 'استمع واكتب ما تسمعه',
      listen: '🔊 استمع', again: '🔁 مرة أخرى', check: '✅ تحقّق', next: 'التالي ▶', skip: 'لا أعرف', start: '▶ ابدأ التمارين',
      right: '✅ صحيح!', wrong: 'الإجابة الصحيحة:', yours: 'كتبت:', res: '🏁 انتهى!', score: (a, b) => `${a} من ${b} صحيحة`,
      more: '🔄 تمارين أخرى', hint_type: 'اكتب بالنرويجية. علامات الترقيم والحروف الكبيرة لا تُحتسب.',
      none: 'الجمل قليلة في هذا المستوى — اختر مستوى آخر.', ai_off: 'التصحيح بالذكاء الاصطناعي لا يستجيب الآن، لذا فُتحت التمارين البسيطة. نصّك محفوظ — حاول لاحقًا.' },
    de: { tab_easy: '🧩 Einfache Übungen', tab_free: '✍️ Freies Schreiben', easy_lead: 'Kurze Übungen aus den Comics: einen Satz übersetzen, ein Wort einsetzen, das Gehörte aufschreiben. Sofort geprüft, ganz ohne Internet.',
      q_type: 'Schreib diesen Satz auf Norwegisch', q_blank: 'Setz das fehlende Wort ein', q_dict: 'Hör zu und schreib, was du hörst',
      listen: '🔊 Hören', again: '🔁 Nochmal', check: '✅ Prüfen', next: 'Weiter ▶', skip: 'Weiß ich nicht', start: '▶ Übungen starten',
      right: '✅ Richtig!', wrong: 'Richtig ist:', yours: 'Du hast geschrieben:', res: '🏁 Fertig!', score: (a, b) => `${a} von ${b} richtig`,
      more: '🔄 Mehr Übungen', hint_type: 'Schreib auf Norwegisch. Satzzeichen und Großschreibung zählen nicht.',
      none: 'Auf dieser Stufe gibt es noch zu wenige Sätze — wähle eine andere Stufe.', ai_off: 'Die KI-Prüfung antwortet gerade nicht, darum sind die einfachen Übungen offen. Dein Text ist gespeichert — versuch es später nochmal.' },
    pl: { tab_easy: '🧩 Proste ćwiczenia', tab_free: '✍️ Wolne pisanie', easy_lead: 'Krótkie ćwiczenia z komiksów: przetłumacz zdanie, wstaw słowo, zapisz to, co słyszysz. Sprawdzane od razu, bez internetu.',
      q_type: 'Napisz to zdanie po norwesku', q_blank: 'Wstaw brakujące słowo', q_dict: 'Posłuchaj i zapisz, co słyszysz',
      listen: '🔊 Posłuchaj', again: '🔁 Jeszcze raz', check: '✅ Sprawdź', next: 'Dalej ▶', skip: 'Nie wiem', start: '▶ Zacznij ćwiczenia',
      right: '✅ Dobrze!', wrong: 'Poprawnie jest:', yours: 'Napisałeś:', res: '🏁 Gotowe!', score: (a, b) => `${a} z ${b} poprawnie`,
      more: '🔄 Więcej ćwiczeń', hint_type: 'Pisz po norwesku. Znaki interpunkcyjne i wielkie litery nie mają znaczenia.',
      none: 'Na tym poziomie jest jeszcze za mało zdań — wybierz inny poziom.', ai_off: 'Sprawdzanie przez SI teraz nie odpowiada, więc otworzyliśmy proste ćwiczenia. Twój tekst jest zapisany — spróbuj później.' },
    tr: { tab_easy: '🧩 Basit alıştırmalar', tab_free: '✍️ Serbest yazma', easy_lead: 'Çizgi romanlardan kısa alıştırmalar: cümleyi çevir, eksik kelimeyi yaz, duyduğunu yaz. Anında kontrol edilir, internet gerekmez.',
      q_type: 'Bu cümleyi Norveççe yaz', q_blank: 'Eksik kelimeyi yaz', q_dict: 'Dinle ve duyduğunu yaz',
      listen: '🔊 Dinle', again: '🔁 Tekrar', check: '✅ Kontrol et', next: 'İleri ▶', skip: 'Bilmiyorum', start: '▶ Alıştırmalara başla',
      right: '✅ Doğru!', wrong: 'Doğrusu şu:', yours: 'Sen şunu yazdın:', res: '🏁 Bitti!', score: (a, b) => `${b} içinden ${a} doğru`,
      more: '🔄 Daha fazla alıştırma', hint_type: 'Norveççe yaz. Noktalama ve büyük harfler sayılmaz.',
      none: 'Bu seviyede henüz çok az cümle var — başka bir seviye seç.', ai_off: 'Yapay zekâ kontrolü şu anda yanıt vermiyor, bu yüzden basit alıştırmalar açıldı. Metnin kaydedildi — sonra tekrar dene.' },
    lt: { tab_easy: '🧩 Paprastos užduotys', tab_free: '✍️ Laisvas rašymas', easy_lead: 'Trumpos užduotys iš komiksų: išversk sakinį, įrašyk žodį, užrašyk tai, ką girdi. Tikrinama iškart, be interneto.',
      q_type: 'Parašyk šį sakinį norvegiškai', q_blank: 'Įrašyk trūkstamą žodį', q_dict: 'Klausyk ir užrašyk, ką girdi',
      listen: '🔊 Klausyti', again: '🔁 Dar kartą', check: '✅ Tikrinti', next: 'Toliau ▶', skip: 'Nežinau', start: '▶ Pradėti užduotis',
      right: '✅ Teisingai!', wrong: 'Teisingas atsakymas:', yours: 'Tu parašei:', res: '🏁 Baigta!', score: (a, b) => `${a} iš ${b} teisingai`,
      more: '🔄 Daugiau užduočių', hint_type: 'Rašyk norvegiškai. Skyryba ir didžiosios raidės neskaičiuojamos.',
      none: 'Šiame lygyje dar per mažai sakinių — pasirink kitą lygį.', ai_off: 'DI patikra dabar neatsako, todėl atidarytos paprastos užduotys. Tavo tekstas išsaugotas — pabandyk vėliau.' }
  };
  const sx = () => S[(C() || {}).ui] || S.en;

  // порівняння відповіді: розділові знаки, регістр і подвійні пробіли не рахуються
  const norm = t => String(t || '').toLowerCase().replace(/[.,!?;:«»„“”"'()\-]/g, ' ').replace(/\s+/g, ' ').trim();

  /* Вправи будуємо з реплік коміксів обраного рівня: учень уже бачив ці речення,
     тож завдання перевіряє пам'ять, а не вгадування. */
  function buildTasks(level, n) {
    const K = C();
    const lines = [];
    for (const c of K.COMICS) {
      if (c.level !== level || c._private) continue;
      for (const p of c.panels) for (const l of p.lines) {
        if (l.who === 'sfx' || !l.no) continue;
        const w = l.no.split(/\s+/).length;
        if (w < 3 || w > 9) continue;
        lines.push({ no: l.no, uk: l.uk || '', en: l.en || '', c });
      }
    }
    if (lines.length < 4) return [];
    const pick = K.shuffle(lines).slice(0, n);
    return pick.map((l, i) => {
      const kind = ['type', 'blank', 'dict'][i % 3];
      if (kind === 'blank') {
        const words = l.no.split(/\s+/);
        const idx = words.findIndex((w, k) => k > 0 && w.replace(/[^\p{L}]/gu, '').length > 2);
        const at = idx < 0 ? 1 : idx;
        const answer = words[at].replace(/[^\p{L}\p{N}]/gu, '');
        return { kind, line: l, at, answer, shown: words.map((w, k) => (k === at ? '___' : w)).join(' ') };
      }
      return { kind, line: l, answer: l.no };
    });
  }

  function simpleView(level, onLevel) {
    const K = C(), { h } = K, L = sx();
    const root = h('div', { class: 'write-easy' });
    let tasks = buildTasks(level, 9), i = 0, right = 0;
    if (!tasks.length) { root.append(h('p', { class: 'lead-p' }, L.none)); return root; }

    const draw = () => {
      if (i >= tasks.length) {
        K.day && K.day.mark('write');
        if (right >= tasks.length - 1) { K.confetti && K.confetti(); K.Sfx.win(); }
        root.replaceChildren(h('div', { class: 'q-card result' },
          h('div', { style: { fontSize: '3.4rem' } }, right >= tasks.length - 1 ? '🏁🎉' : '🏁'),
          h('h2', {}, L.res), h('p', { class: 'score' }, L.score(right, tasks.length)),
          h('div', { class: 'row-center' },
            h('button', { class: 'btn accent', type: 'button', onclick: () => { tasks = buildTasks(level, 9); i = 0; right = 0; draw(); } }, L.more),
            h('a', { class: 'btn', href: '#/today' }, '📅'))));
        window.scrollTo({ top: 0 });
        return;
      }
      const t = tasks[i];
      const say = () => { K.Speech.stop(); K.Speech.speak(t.line.no, 'narrator', { rate: 0.9 }); };
      const input = h('input', { type: 'text', class: 'fr-input write-in', autocomplete: 'off', spellcheck: 'false',
        placeholder: t.kind === 'blank' ? '…' : 'Norsk…' });
      const fb = h('div', { class: 'write-fb2' });
      const title = L[t.kind === 'type' ? 'q_type' : t.kind === 'blank' ? 'q_blank' : 'q_dict'];
      const prompt = t.kind === 'dict'
        ? h('div', { class: 'row-center' }, h('button', { class: 'btn accent big', type: 'button', onclick: say }, L.listen))
        : t.kind === 'blank'
          ? h('p', { class: 'write-line', lang: 'nb' }, t.shown)
          : h('p', { class: 'write-line' }, K.trLangs().filter(l => t.line[l]).map(l => h('span', { class: 'wl-tr' }, t.line[l])));
      const done = ok => {
        if (ok) { right++; K.Sfx.good(); } else { K.Sfx.bad && K.Sfx.bad(); if (t.kind === 'blank') K.errs.add(t.answer, '', ''); }
        fb.replaceChildren(
          h('p', { class: ok ? 'day-ok' : 'warn' }, ok ? L.right : L.wrong),
          ok ? null : h('p', { class: 'write-line', lang: 'nb' }, t.kind === 'blank' ? t.answer : t.line.no),
          ok || !input.value.trim() ? null : h('p', { class: 'hint' }, L.yours + ' ' + input.value.trim()),
          h('button', { class: 'play', type: 'button', onclick: say }, '🔊 ' + t.line.no));
        acts.replaceChildren(h('button', { class: 'btn accent big', type: 'button', onclick: () => { i++; draw(); } }, L.next));
        input.disabled = true;
      };
      const acts = h('div', { class: 'row-center' },
        h('button', { class: 'btn accent big', type: 'button', onclick: () => done(norm(input.value) === norm(t.answer)) }, L.check),
        h('button', { class: 'btn', type: 'button', onclick: () => done(false) }, L.skip));
      input.addEventListener('keydown', e => { if (e.key === 'Enter' && !input.disabled) done(norm(input.value) === norm(t.answer)); });
      root.replaceChildren(
        h('div', { class: 'q-head' }, h('a', { class: 'btn small', href: '#/today' }, '←'),
          h('h3', {}, title), h('span', { class: 'stat' }, `${i + 1} / ${tasks.length}`)),
        h('div', { class: 'bar' }, h('i', { style: { width: (i / tasks.length * 100) + '%' } })),
        h('div', { class: 'box' }, prompt, input, h('p', { class: 'hint' }, L.hint_type)),
        fb, acts);
      if (t.kind === 'dict') setTimeout(say, 400);
      setTimeout(() => input.focus(), 120);
    };
    draw();
    return root;
  }

  /* Завдання: норвезькою (так їх і треба читати) + короткий переклад. */
  const TASKS = {
    A1: [
      ['Fortell om dagen din i dag.', { uk: 'Розкажи про свій сьогоднішній день.', en: 'Tell about your day today.', ar: 'تحدّث عن يومك اليوم.' }],
      ['Skriv om familien din: hvem er de, hva heter de?', { uk: 'Напиши про свою сім’ю: хто вони, як їх звати?', en: 'Write about your family: who they are, what their names are.', ar: 'اكتب عن عائلتك: من هم وما أسماؤهم؟' }],
      ['Hva spiser du til frokost, lunsj og middag?', { uk: 'Що ти їси на сніданок, обід і вечерю?', en: 'What do you eat for breakfast, lunch and dinner?', ar: 'ماذا تأكل في الإفطار والغداء والعشاء؟' }],
      ['Beskriv rommet ditt. Hva er der?', { uk: 'Опиши свою кімнату. Що в ній є?', en: 'Describe your room. What is in it?', ar: 'صِف غرفتك. ماذا فيها؟' }],
      ['Hvordan er været i dag? Hva har du på deg?', { uk: 'Яка сьогодні погода? Що ти вдягнув?', en: 'What is the weather like today? What are you wearing?', ar: 'كيف الطقس اليوم؟ وماذا ترتدي؟' }]
    ],
    A2: [
      ['Fortell om forrige helg. Hva gjorde du?', { uk: 'Розкажи про минулі вихідні. Що ти робив?', en: 'Tell about last weekend. What did you do?', ar: 'تحدّث عن عطلة الأسبوع الماضية. ماذا فعلت؟' }],
      ['Skriv en kort melding til naboen om dugnaden på lørdag.', { uk: 'Напиши коротке повідомлення сусідові про толоку в суботу.', en: 'Write a short message to your neighbour about Saturday’s dugnad.', ar: 'اكتب رسالة قصيرة لجارك عن يوم العمل التطوعي السبت.' }],
      ['Du er syk og må melde fra på jobb. Skriv meldingen.', { uk: 'Ти захворів і маєш повідомити на роботу. Напиши повідомлення.', en: 'You are ill and must tell your workplace. Write the message.', ar: 'أنت مريض وعليك إبلاغ العمل. اكتب الرسالة.' }],
      ['Fortell om veien fra hjemmet ditt til butikken.', { uk: 'Опиши дорогу від дому до магазину.', en: 'Describe the way from your home to the shop.', ar: 'صِف الطريق من بيتك إلى المتجر.' }],
      ['Hva gjør du på fritiden? Skriv om to ting du liker.', { uk: 'Що ти робиш у вільний час? Напиши про дві улюблені справи.', en: 'What do you do in your free time? Write about two things you like.', ar: 'ماذا تفعل في وقت فراغك؟ اكتب عن أمرين تحبهما.' }]
    ],
    B1: [
      ['Skriv en kort søknad på en jobb du har lyst på.', { uk: 'Напиши коротку заяву на роботу, яку хочеш.', en: 'Write a short application for a job you want.', ar: 'اكتب طلب توظيف قصيرًا لوظيفة تريدها.' }],
      ['Du har en klage på en vare du kjøpte. Skriv til butikken.', { uk: 'У тебе скарга на куплений товар. Напиши в магазин.', en: 'You have a complaint about something you bought. Write to the shop.', ar: 'لديك شكوى بشأن سلعة اشتريتها. اكتب إلى المتجر.' }],
      ['Fortell om en gang du flyttet. Hvordan gikk det?', { uk: 'Розкажи, як ти переїжджав. Як усе минуло?', en: 'Tell about a time you moved house. How did it go?', ar: 'تحدّث عن مرة انتقلت فيها للسكن. كيف جرى الأمر؟' }],
      ['Skriv til utleieren om en vannlekkasje på badet.', { uk: 'Напиши орендодавцю про протікання у ванній.', en: 'Write to your landlord about a water leak in the bathroom.', ar: 'اكتب إلى المالك عن تسرّب ماء في الحمّام.' }],
      ['Hva synes du om kollektivtransporten der du bor?', { uk: 'Що ти думаєш про громадський транспорт там, де живеш?', en: 'What do you think about public transport where you live?', ar: 'ما رأيك في النقل العام حيث تسكن؟' }]
    ],
    B2: [
      ['Skriv et leserinnlegg om strømprisene.', { uk: 'Напиши допис у газету про ціни на електрику.', en: 'Write a letter to the editor about electricity prices.', ar: 'اكتب رسالة إلى المحرّر عن أسعار الكهرباء.' }],
      ['Bør alle jobbe fire dager i uka? Begrunn svaret.', { uk: 'Чи мають усі працювати чотири дні на тиждень? Обґрунтуй.', en: 'Should everyone work four days a week? Give your reasons.', ar: 'هل يجب أن يعمل الجميع أربعة أيام أسبوعيًا؟ برّر إجابتك.' }],
      ['Sammenlign livet i hjemlandet ditt og i Norge.', { uk: 'Порівняй життя на батьківщині і в Норвегії.', en: 'Compare life in your home country and in Norway.', ar: 'قارن بين الحياة في بلدك وفي النرويج.' }],
      ['Skriv en kort rapport fra et møte på jobben.', { uk: 'Напиши короткий звіт про робочу нараду.', en: 'Write a short report from a meeting at work.', ar: 'اكتب تقريرًا قصيرًا عن اجتماع في العمل.' }],
      ['Hva kan gjøres for å få flere til å sortere søppel?', { uk: 'Що зробити, щоб більше людей сортувало сміття?', en: 'What can be done to get more people to sort their rubbish?', ar: 'ما الذي يمكن فعله ليفرز عدد أكبر من الناس نفاياتهم؟' }]
    ]
  };
  const LEVELS = ['A1', 'A2', 'B1', 'B2'];

  const draftKey = 'writeDraft';
  const histKey = 'writeHist';

  function render() {
    const K = C(); if (!K) return null;
    const { h, store } = K, L = tx();
    const plan = store.get('plan', {}) || {};
    const saved = store.get(draftKey, {}) || {};
    let level = LEVELS.includes(saved.level) ? saved.level : (LEVELS.includes(plan.goal) ? plan.goal : 'A1');
    let task = saved.task || TASKS[level][0][0];
    let state = null;                                   // { ai, left, limit }

    const root = h('section', { class: 'write-page' });
    const area = h('textarea', { class: 'write-area', rows: 7, placeholder: L.ph, spellcheck: 'false' });
    area.value = saved.text || '';
    const counter = h('small', { class: 'write-count' });
    const msg = h('p', { class: 'fb-msg' });
    const result = h('div', { class: 'write-result' });
    const leftEl = h('small', { class: 'write-left' });

    const wordCount = () => (area.value.trim().match(/[\p{L}\p{N}'’-]+/gu) || []).length;
    const saveDraft = () => store.set(draftKey, { level, task, text: area.value });
    const drawCount = () => { counter.textContent = L.words(wordCount()); };
    area.addEventListener('input', () => { drawCount(); saveDraft(); });

    const taskText = () => {
      const list = TASKS[level];
      const row = list.find(x => x[0] === task) || list[0];
      const tr = row[1][(C() || {}).ui];
      return [row[0], tr && (C() || {}).ui !== 'no' ? tr : ''];
    };
    const taskBox = h('div', { class: 'write-task' });
    function drawTask() {
      const [no, tr] = taskText();
      taskBox.replaceChildren(h('b', { lang: 'nb' }, no), tr ? h('small', {}, tr) : null);
    }
    const nextTask = () => {
      const list = TASKS[level].map(x => x[0]);
      task = list[(list.indexOf(task) + 1) % list.length];
      drawTask(); saveDraft();
    };
    const levelRow = h('div', { class: 'write-levels' }, LEVELS.map(lv => {
      const b = h('button', { class: 'btn small' + (lv === level ? ' accent' : ''), type: 'button', onclick: () => {
        level = lv; task = TASKS[lv][0][0];
        [...levelRow.children].forEach(x => x.classList.toggle('accent', x.textContent === lv));
        drawTask(); saveDraft();
      } }, lv);
      return b;
    }));

    const btn = h('button', { class: 'btn accent big', type: 'button' }, L.check);
    btn.addEventListener('click', check);

    async function check() {
      if (wordCount() < 3) { msg.textContent = L.err.short; return; }
      msg.textContent = ''; btn.disabled = true; btn.textContent = L.checking;
      try {
        const r = await fetch(API, { method: 'POST', credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json', 'X-Komiks': '1' },
          body: JSON.stringify({ action: 'check', task: taskText()[0], level, lang: K.ui, text: area.value })
        }).then(x => x.json());
        if (r && r.ok) { show(r); K.Sfx.good(); keep(r); if (typeof r.left === 'number') leftEl.textContent = L.left(r.left); }
        else { msg.textContent = (r && L.err[r.error]) || L.err.net; offerEasy(); }
      } catch { msg.textContent = L.err.net; offerEasy(); }
      btn.disabled = false; btn.textContent = L.check;
    }

    // перевірка не вдалася — показуємо шлях до вправ, які працюють без сервера
    function offerEasy() {
      const SXX = sx();
      result.replaceChildren(h('div', { class: 'box write-fallback' },
        h('p', {}, SXX.ai_off),
        h('button', { class: 'btn accent big', type: 'button', onclick: () => {
          store.set('writeMode', 'easy'); K.route(true);
        } }, SXX.tab_easy)));
    }

    function keep(r) {
      const list = store.get(histKey, []);
      list.unshift({ at: Date.now(), level, task: taskText()[0], text: area.value, fixed: r.fixed, score: r.score });
      store.set(histKey, list.slice(0, 10));
    }

    function show(r) {
      const errs = r.errors || [];
      const sample = h('div', { class: 'write-sample', hidden: true }, h('h4', {}, L.sample), h('p', { lang: 'nb' }, r.sample || ''));
      result.replaceChildren(
        h('div', { class: 'box write-fb' },
          h('h3', {}, L.res, ' ', h('span', { class: 'write-score' }, L.score(r.score || 0))),
          r.fixed ? [h('h4', {}, L.fixed), h('p', { class: 'write-fixed', lang: 'nb' }, r.fixed)] : null,
          h('h4', {}, L.errs),
          errs.length
            ? h('ul', { class: 'write-errs' }, errs.map(e => h('li', {},
              h('s', { lang: 'nb' }, e.wrong), ' → ', h('b', { lang: 'nb' }, e.right), e.why ? h('small', {}, e.why) : null)))
            : h('p', { class: 'write-ok' }, L.no_errs),
          r.tip ? h('p', { class: 'write-tip' }, L.tip + ': ' + r.tip) : null,
          r.sample ? h('button', { class: 'btn small', type: 'button', onclick: e => { sample.hidden = false; e.currentTarget.remove(); } }, L.show_sample) : null,
          sample,
          h('button', { class: 'btn', type: 'button', onclick: () => { area.value = ''; drawCount(); saveDraft(); result.replaceChildren(); area.focus(); } }, L.again)));
      result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    // скільки перевірок лишилося й чи взагалі налаштовано ШІ
    fetch(API + '?action=state', { cache: 'no-store', credentials: 'same-origin' }).then(r => r.json()).then(j => {
      state = j && j.ok ? j : null;
      if (!state) return;
      leftEl.textContent = L.left(state.left);
      if (!state.ai) { msg.textContent = L.noai; btn.disabled = true; }
    }).catch(() => { /* офлайн — просто пишемо без перевірки */ });

    const hist = store.get(histKey, []);
    drawTask(); drawCount();

    /* Дві вкладки. Типово відкриті прості вправи: вони працюють завжди, навіть коли
       сервер із ШІ мовчить. Вільне письмо лишається поруч, на сусідній вкладці. */
    const SX = sx();
    const freeBox = h('div', { class: 'write-free' },
      h('div', { class: 'box' },
        h('div', { class: 'row-left write-top' }, h('b', {}, L.level), levelRow, h('span', { class: 'grow' }), leftEl),
        h('h3', {}, L.task), taskBox,
        h('button', { class: 'btn small', type: 'button', onclick: nextTask }, L.other)),
      area, h('div', { class: 'row-left' }, btn, counter), msg, result,
      hist.length ? h('div', { class: 'box write-hist' }, h('h3', {}, L.hist),
        h('ul', {}, hist.slice(0, 5).map(x => h('li', {},
          h('b', {}, x.level + ' · ' + (x.score || 0) + '/100'), ' ', h('span', {}, x.task))))) : null);
    const stage = h('div', { class: 'write-stage' });
    let mode = store.get('writeMode', 'easy');
    const tabs = h('div', { class: 'write-tabs' });
    const paint = () => {
      tabs.replaceChildren(...[['easy', SX.tab_easy], ['free', SX.tab_free]].map(([m, label]) =>
        h('button', { class: 'wt-tab' + (mode === m ? ' on' : ''), type: 'button',
          onclick: () => { if (mode === m) return; mode = m; store.set('writeMode', m); paint(); } }, label)));
      stage.replaceChildren(mode === 'easy'
        ? h('div', {}, h('p', { class: 'lead-p' }, SX.easy_lead), simpleView(level))
        : h('div', {}, h('p', { class: 'lead-p' }, L.lead), freeBox));
    };
    paint();
    root.append(K.pageHead ? K.pageHead(L.title) : h('h1', {}, L.title), tabs, stage);
    return root;
  }

  window.KomiksWrite = { render, text: k => tx()[k] };
})();
