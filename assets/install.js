/* Комікс·Lab — 📲 «Встановити застосунок»: ярлик на телефоні (Android) і в меню «Пуск» (Windows).
   Сайт уже є PWA (manifest + sw.js), тут лише зручна кнопка: ловимо beforeinstallprompt
   і показуємо її поруч із QR-кодом у підвалі. На iPhone події немає — там показуємо коротку
   інструкцію «Поділитися → На початковий екран». */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const C = () => window.KomiksCore;
  const T = {
    uk: { btn: '📲 Встановити застосунок', d: 'Ярлик на екрані телефона або в меню «Пуск» — сайт відкривається як звичайний застосунок, навіть без інтернету.',
      ios_t: '📲 Як додати на iPhone', ios: 'Натисніть «Поділитися» внизу Safari, далі «На початковий екран».', ok: 'Зрозуміло',
      done: '✅ Застосунок установлено', installing: 'Встановлюємо…' },
    en: { btn: '📲 Install the app', d: 'A shortcut on your phone or in the Start menu — the site opens like a normal app, even offline.',
      ios_t: '📲 How to add it on iPhone', ios: 'Tap “Share” at the bottom of Safari, then “Add to Home Screen”.', ok: 'Got it',
      done: '✅ The app is installed', installing: 'Installing…' },
    no: { btn: '📲 Installer appen', d: 'En snarvei på telefonen eller i Start-menyen – siden åpnes som en vanlig app, også uten nett.',
      ios_t: '📲 Slik legger du den til på iPhone', ios: 'Trykk «Del» nederst i Safari, og velg «Legg til på Hjem-skjerm».', ok: 'Skjønner',
      done: '✅ Appen er installert', installing: 'Installerer …' },
    ar: { btn: '📲 ثبّت التطبيق', d: 'اختصار على هاتفك أو في قائمة ابدأ — يفتح الموقع كتطبيق عادي، حتى بدون إنترنت.',
      ios_t: '📲 كيف تضيفه على iPhone', ios: 'اضغط «مشاركة» أسفل Safari ثم «إضافة إلى الشاشة الرئيسية».', ok: 'فهمت',
      done: '✅ تم تثبيت التطبيق', installing: 'جارٍ التثبيت…' }
  };
  if (window.KL_T_FILL) KL_T_FILL(T, 'install.js:T');
  const tx = () => T[(C() || {}).ui] || T.en;

  let deferred = null;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();          // показуємо власну кнопку замість системної смужки
    deferred = e;
    document.querySelectorAll('.pwa-btn').forEach(b => { b.hidden = false; });
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    document.querySelectorAll('.pwa-btn').forEach(b => { b.textContent = tx().done; b.disabled = true; });
  });

  async function install(btn) {
    const L = tx();
    if (deferred) {
      btn.disabled = true; btn.textContent = L.installing;
      deferred.prompt();
      const res = await deferred.userChoice.catch(() => null);
      deferred = null;
      btn.disabled = false;
      btn.textContent = res && res.outcome === 'accepted' ? L.done : L.btn;
      return;
    }
    if (isIOS()) return iosHelp();
    // деякі браузери не дають події — підказуємо, де шукати пункт меню
    iosHelp(true);
  }

  function iosHelp(desktop) {
    const K = C(); if (!K) return;
    const { h } = K, L = tx();
    const close = () => back.remove();
    const text = desktop
      ? { uk: 'У меню браузера (⋮ або значок ⊕ у рядку адреси) виберіть «Установити застосунок».',
          en: 'In the browser menu (⋮ or the ⊕ icon in the address bar) choose “Install app”.',
          no: 'I nettlesermenyen (⋮ eller ⊕-ikonet i adressefeltet) velger du «Installer app».',
          ar: 'من قائمة المتصفح (⋮ أو أيقونة ⊕ في شريط العنوان) اختر «تثبيت التطبيق».' }[(C() || {}).ui] || L.ios
      : L.ios;
    const back = h('div', { class: 'fb-back', onclick: e => { if (e.target === back) close(); } },
      h('div', { class: 'fb-box' }, h('h2', {}, L.ios_t), h('p', {}, text),
        h('button', { class: 'btn accent', type: 'button', onclick: close }, L.ok)));
    document.body.append(back);
  }

  // кнопка для підвалу (поруч із QR-кодом і відгуком)
  function button(cls = 'btn small') {
    const K = C(); if (!K) return null;
    if (standalone()) return null;                       // уже встановлено — кнопка не потрібна
    const b = K.h('button', { class: cls + ' pwa-btn', type: 'button', title: tx().d, onclick: () => install(b) }, tx().btn);
    b.hidden = !deferred && !isIOS();                    // покажемо, щойно браузер дозволить
    return b;
  }
  // ---------- 📲 сторінка «Встановити застосунок» (#/install) ----------
  // Три платформи без жодного маркету: Windows, Android, iPhone. Кроки того пристрою,
  // з якого людина зайшла, підсвічуємо, решту лишаємо поруч.
  const P = {
    uk: {
      title: '📲 Застосунок Komiks·Lab',
      lead: 'Без App Store і Google Play: сайт ставиться просто з браузера. Іконка на робочому столі або в меню «Пуск», окреме вікно без адресного рядка, уроки працюють і без інтернету.',
      here: 'ви зараз тут',
      win: ['💻 Windows', [
        'Відкрийте сайт у Microsoft Edge або Google Chrome.',
        'Натисніть «Встановити застосунок» угорі цієї сторінки — або значок ⊕ у рядку адреси.',
        'Підтвердьте «Встановити». Ярлик із нашою іконкою з’явиться на робочому столі й у меню «Пуск».',
        'Правий клік по іконці в панелі задач відкриє швидкі переходи: план, слова, дзвінок, тести.'
      ]],
      and: ['🤖 Android', [
        'Відкрийте сайт у Chrome.',
        'Натисніть «Встановити застосунок» угорі — або меню ⋮ → «Додати на головний екран».',
        'Іконка стане поруч зі звичайними застосунками; довгий тап відкриє швидкі дії.'
      ]],
      ios: ['🍏 iPhone та iPad', [
        'Відкрийте сайт у Safari (у Chrome на iPhone такої кнопки немає).',
        'Натисніть «Поділитися» ⬆️ внизу екрана.',
        'Прогорніть список і виберіть «На початковий екран» → «Додати».',
        'Застосунок відкриється на весь екран, із власною заставкою — без App Store.'
      ]],
      mac: ['🍎 Mac', [
        'Відкрийте сайт у Chrome або Edge.',
        'Меню ⋮ → «Передати, зберегти та поділитися» → «Встановити сторінку як застосунок».',
        'У Safari: меню «Файл» → «Додати в Dock».'
      ]],
      extra_t: 'Якщо браузер не пропонує встановлення',
      extra: 'Firefox і старі браузери не вміють ставити застосунок. Тоді збережіть звичайний ярлик — і за бажання підставте нашу іконку: правий клік по ярлику → «Властивості» → «Змінити значок» → виберіть завантажений файл.',
      exe_t: '💻 Інсталятор для Windows',
      exe_d: 'Звичайний .exe: ставить ярлик на робочий стіл і в меню «Пуск». Відкривається окремим вікном, без адресного рядка.',
      exe_light: '⚡ Легкий — {s}',
      exe_light_d: 'Ярлик на сайт у вікні застосунку. Уроки працюють і без мережі — браузер тримає їх у себе.',
      exe_full: '📚 Повний — {s}',
      exe_full_d: 'Усі комікси, озвучення й тести лягають на диск. Працює взагалі без інтернету.',
      exe_steps_t: 'Як встановити',
      exe_steps: ['Натисніть кнопку — файл завантажиться у «Завантаження».',
        'Відкрийте його. Windows може попередити про невідомого видавця: «Докладніше» → «Виконати в будь-якому разі».',
        'Лишіть позначку «Ярлик на робочому столі» й натисніть «Встановити».'],
      exe_warn: 'Інсталятор не просить прав адміністратора й ставить усе в теку вашого користувача. Видаляється як звичайна програма — через «Параметри» → «Застосунки».',
      exe_ss_t: '⚠️ Якщо Windows покаже синє вікно',
      exe_ss: 'Напис «ОС Windows захистила цей ПК» з’являється на кожній програмі, яку завантажило ще мало людей, — це не про віруси. Натисніть «Докладніше», а потім «Виконати в будь-якому разі».',
      exe_ss2: 'Попередження зникне само, коли програму завантажить достатньо людей. Прибрати його раніше можна лише дорогим сертифікатом на юридичну особу — ми до цього ще не дійшли й не хочемо вдавати, що дійшли.',
      exe_ss3: 'Хочете взагалі без попереджень — скористайтеся кнопкою «Встановити застосунок» угорі цієї сторінки: ярлик буде той самий, а ставить його сам браузер.',
      apk_t: '📦 Файл APK для Android',
      apk_d: 'Якщо не хочете ставити з браузера — ось справжній застосунок одним файлом. Google Play не потрібен.',
      apk_light: '⚡ Легкий — {s}',
      apk_light_d: 'Вісім історій і десять тем слів усередині, решта підвантажується з сайту. Є акаунт, друзі й рейтинг.',
      apk_full: '📚 Повний — {s}',
      apk_full_d: 'Усі комікси, озвучення й тести всередині. Працює без інтернету взагалі, акаунта немає.',
      apk_steps_t: 'Як встановити',
      apk_steps: ['Натисніть кнопку — файл завантажиться у «Завантаження».',
        'Відкрийте його. Android спитає дозвіл ставити застосунки з цього джерела — дозвольте.',
        'Натисніть «Встановити», потім «Відкрити».'],
      apk_warn: 'Застосунок підписаний нами й не містить реклами. Android попередить, що джерело не Google Play — це звичайна поведінка для файлів APK.',
      url_btn: '🔗 Завантажити ярлик для Windows',
      ico_btn: '🖼️ Завантажити іконку (.ico)',
      done: '✅ Застосунок уже встановлено — ви відкрили його у власному вікні.'
    },
    en: {
      title: '📲 The Komiks·Lab app',
      lead: 'No App Store, no Google Play: the site installs straight from the browser. An icon on your desktop or home screen, its own window without an address bar, and lessons that work offline.',
      here: 'you are here',
      win: ['💻 Windows', [
        'Open the site in Microsoft Edge or Google Chrome.',
        'Press “Install the app” at the top of this page — or the ⊕ icon in the address bar.',
        'Confirm “Install”. A shortcut with our icon appears on the desktop and in the Start menu.',
        'Right-click the taskbar icon for quick jumps: plan, words, call, tests.'
      ]],
      and: ['🤖 Android', [
        'Open the site in Chrome.',
        'Press “Install the app” at the top — or menu ⋮ → “Add to Home screen”.',
        'The icon sits next to your normal apps; long-press it for quick actions.'
      ]],
      ios: ['🍏 iPhone and iPad', [
        'Open the site in Safari (Chrome on iPhone has no such button).',
        'Tap “Share” ⬆️ at the bottom of the screen.',
        'Scroll down and choose “Add to Home Screen” → “Add”.',
        'It opens full screen with its own splash — no App Store needed.'
      ]],
      mac: ['🍎 Mac', [
        'Open the site in Chrome or Edge.',
        'Menu ⋮ → “Cast, save and share” → “Install page as app”.',
        'In Safari: File → “Add to Dock”.'
      ]],
      extra_t: 'If your browser does not offer installing',
      extra: 'Firefox and older browsers cannot install web apps. Save a plain shortcut instead — and give it our icon if you like: right-click the shortcut → “Properties” → “Change icon” → pick the downloaded file.',
      exe_t: '💻 Installer for Windows',
      exe_d: 'A normal .exe: it puts a shortcut on your desktop and in the Start menu. The app opens in its own window, without an address bar.',
      exe_light: '⚡ Light — {s}',
      exe_light_d: 'A shortcut to the site in an app window. Lessons work offline too — the browser keeps them.',
      exe_full: '📚 Full — {s}',
      exe_full_d: 'Every comic, all audio and all tests go onto your disk. Works with no internet at all.',
      exe_steps_t: 'How to install',
      exe_steps: ['Press the button — the file goes to your Downloads.',
        'Open it. Windows may warn about an unknown publisher: “More info” → “Run anyway”.',
        'Keep “Shortcut on the desktop” ticked and press Install.'],
      exe_warn: 'The installer asks for no administrator rights and installs into your own user folder. Remove it like any program, through Settings → Apps.',
      exe_ss_t: '⚠️ If Windows shows a blue window',
      exe_ss: '“Windows protected your PC” appears for every program that few people have downloaded yet — it is not about viruses. Click “More info”, then “Run anyway”.',
      exe_ss2: 'The warning goes away on its own once enough people install the app. Removing it earlier takes an expensive certificate issued to a registered company — we are not there yet, and we would rather not pretend otherwise.',
      exe_ss3: 'If you want no warnings at all, use the “Install the app” button at the top of this page: the shortcut is the same, but the browser puts it there itself.',
      apk_t: '📦 APK file for Android',
      apk_d: 'If you would rather not install from the browser, here is the real app as a single file. No Google Play needed.',
      apk_light: '⚡ Light — {s}',
      apk_light_d: 'Eight stories and ten word themes inside, the rest loads from the site. Includes account, friends and ranking.',
      apk_full: '📚 Full — {s}',
      apk_full_d: 'Every comic, all audio and all tests inside. Works with no internet at all; no account.',
      apk_steps_t: 'How to install',
      apk_steps: ['Press the button — the file goes to your Downloads.',
        'Open it. Android will ask for permission to install from this source — allow it.',
        'Press “Install”, then “Open”.'],
      apk_warn: 'The app is signed by us and has no ads. Android warns that the source is not Google Play — that is normal for APK files.',
      url_btn: '🔗 Download a Windows shortcut',
      ico_btn: '🖼️ Download the icon (.ico)',
      done: '✅ The app is already installed — you are running it in its own window.'
    },
    no: {
      title: '📲 Appen Komiks·Lab',
      lead: 'Uten App Store og Google Play: siden installeres rett fra nettleseren. Et ikon på skrivebordet eller hjem-skjermen, eget vindu uten adressefelt, og leksjoner som virker uten nett.',
      here: 'du er her',
      win: ['💻 Windows', [
        'Åpne siden i Microsoft Edge eller Google Chrome.',
        'Trykk «Installer appen» øverst på denne siden – eller ⊕-ikonet i adressefeltet.',
        'Bekreft «Installer». Snarveien med ikonet vårt havner på skrivebordet og i Start-menyen.',
        'Høyreklikk ikonet på oppgavelinja for snarveier: plan, ord, samtale, prøver.'
      ]],
      and: ['🤖 Android', [
        'Åpne siden i Chrome.',
        'Trykk «Installer appen» øverst – eller meny ⋮ → «Legg til på startskjerm».',
        'Ikonet står sammen med vanlige apper; hold inne for hurtigvalg.'
      ]],
      ios: ['🍏 iPhone og iPad', [
        'Åpne siden i Safari (Chrome på iPhone har ikke knappen).',
        'Trykk «Del» ⬆️ nederst på skjermen.',
        'Bla ned og velg «Legg til på Hjem-skjerm» → «Legg til».',
        'Appen åpnes i fullskjerm med egen startskjerm – helt uten App Store.'
      ]],
      mac: ['🍎 Mac', [
        'Åpne siden i Chrome eller Edge.',
        'Meny ⋮ → «Cast, lagre og del» → «Installer siden som app».',
        'I Safari: Arkiv → «Legg til i Dock».'
      ]],
      extra_t: 'Hvis nettleseren ikke tilbyr installering',
      extra: 'Firefox og eldre nettlesere kan ikke installere nettapper. Lagre en vanlig snarvei i stedet – og gi den gjerne ikonet vårt: høyreklikk snarveien → «Egenskaper» → «Endre ikon» → velg den nedlastede fila.',
      exe_t: '💻 Installasjonsfil for Windows',
      exe_d: 'En vanlig .exe: den legger en snarvei på skrivebordet og i Start-menyen. Appen åpnes i eget vindu, uten adressefelt.',
      exe_light: '⚡ Lett — {s}',
      exe_light_d: 'Snarvei til nettsiden i et appvindu. Leksjonene virker også uten nett – nettleseren tar vare på dem.',
      exe_full: '📚 Full — {s}',
      exe_full_d: 'Alle tegneserier, all lyd og alle prøver legges på disken. Virker helt uten internett.',
      exe_steps_t: 'Slik installerer du',
      exe_steps: ['Trykk på knappen – filen havner i «Nedlastinger».',
        'Åpne den. Windows kan advare om ukjent utgiver: «Mer info» → «Kjør likevel».',
        'La «Snarvei på skrivebordet» stå avkrysset og trykk Installer.'],
      exe_warn: 'Installasjonsfilen ber ikke om administratorrettigheter og installerer i din egen brukermappe. Den fjernes som et vanlig program under Innstillinger → Apper.',
      exe_ss_t: '⚠️ Hvis Windows viser et blått vindu',
      exe_ss: '«Windows beskyttet PC-en» dukker opp for alle programmer som ennå er lastet ned av få – det handler ikke om virus. Trykk «Mer info», og deretter «Kjør likevel».',
      exe_ss2: 'Advarselen forsvinner av seg selv når nok folk har installert appen. Å fjerne den tidligere krever et dyrt sertifikat utstedt til et registrert selskap – der er vi ikke ennå.',
      exe_ss3: 'Vil du helt slippe advarsler, bruk knappen «Installer appen» øverst på siden: snarveien blir den samme, men nettleseren legger den inn selv.',
      apk_t: '📦 APK-fil for Android',
      apk_d: 'Vil du heller ikke installere fra nettleseren? Her er appen som én fil. Google Play trengs ikke.',
      apk_light: '⚡ Lett — {s}',
      apk_light_d: 'Åtte historier og ti ordtemaer inni, resten hentes fra nettsiden. Med konto, venner og ranking.',
      apk_full: '📚 Full — {s}',
      apk_full_d: 'Alle tegneserier, all lyd og alle prøver inni. Virker helt uten nett; ingen konto.',
      apk_steps_t: 'Slik installerer du',
      apk_steps: ['Trykk på knappen – filen havner i «Nedlastinger».',
        'Åpne den. Android spør om lov til å installere fra denne kilden – gi tillatelse.',
        'Trykk «Installer», og deretter «Åpne».'],
      apk_warn: 'Appen er signert av oss og har ingen reklame. Android advarer om at kilden ikke er Google Play – det er normalt for APK-filer.',
      url_btn: '🔗 Last ned snarvei for Windows',
      ico_btn: '🖼️ Last ned ikonet (.ico)',
      done: '✅ Appen er allerede installert – du kjører den i sitt eget vindu.'
    },
    ar: {
      title: '📲 تطبيق Komiks·Lab',
      lead: 'بدون App Store أو Google Play: يُثبَّت الموقع من المتصفح مباشرة. أيقونة على سطح المكتب أو الشاشة الرئيسية، ونافذة خاصة بلا شريط عنوان، ودروس تعمل دون إنترنت.',
      here: 'أنت هنا',
      win: ['💻 Windows', [
        'افتح الموقع في Microsoft Edge أو Google Chrome.',
        'اضغط «ثبّت التطبيق» أعلى هذه الصفحة — أو أيقونة ⊕ في شريط العنوان.',
        'أكّد «تثبيت». سيظهر الاختصار بأيقونتنا على سطح المكتب وفي قائمة ابدأ.',
        'اضغط بالزر الأيمن على الأيقونة في شريط المهام للوصول السريع: الخطة، الكلمات، المكالمة، الاختبارات.'
      ]],
      and: ['🤖 Android', [
        'افتح الموقع في Chrome.',
        'اضغط «ثبّت التطبيق» في الأعلى — أو القائمة ⋮ ← «إضافة إلى الشاشة الرئيسية».',
        'تظهر الأيقونة مع بقية التطبيقات؛ اضغط مطوّلًا للإجراءات السريعة.'
      ]],
      ios: ['🍏 iPhone و iPad', [
        'افتح الموقع في Safari (لا يوجد هذا الزر في Chrome على iPhone).',
        'اضغط «مشاركة» ⬆️ أسفل الشاشة.',
        'مرّر واختر «إضافة إلى الشاشة الرئيسية» ← «إضافة».',
        'يفتح التطبيق بملء الشاشة بشاشة بدء خاصة — دون App Store.'
      ]],
      mac: ['🍎 Mac', [
        'افتح الموقع في Chrome أو Edge.',
        'القائمة ⋮ ← «حفظ ومشاركة» ← «تثبيت الصفحة كتطبيق».',
        'في Safari: ملف ← «إضافة إلى Dock».'
      ]],
      extra_t: 'إذا لم يعرض المتصفح التثبيت',
      extra: 'لا تستطيع Firefox والمتصفحات القديمة تثبيت تطبيقات الويب. احفظ اختصارًا عاديًا — ويمكنك وضع أيقونتنا عليه: زر أيمن ← «خصائص» ← «تغيير الأيقونة» ← اختر الملف المحمَّل.',
      exe_t: '💻 مثبّت لنظام Windows',
      exe_d: 'ملف .exe عادي: يضع اختصارًا على سطح المكتب وفي قائمة ابدأ، ويفتح التطبيق في نافذة خاصة بلا شريط عنوان.',
      exe_light: '⚡ خفيف — {s}',
      exe_light_d: 'اختصار إلى الموقع في نافذة تطبيق. الدروس تعمل بلا إنترنت أيضًا.',
      exe_full: '📚 كامل — {s}',
      exe_full_d: 'كل القصص والأصوات والاختبارات تُنسخ إلى القرص. يعمل بلا إنترنت تمامًا.',
      exe_steps_t: 'كيف تثبّته',
      exe_steps: ['اضغط الزر — ينزل الملف إلى «التنزيلات».',
        'افتحه. قد ينبّه Windows عن ناشر غير معروف: «مزيد من المعلومات» ← «تشغيل على أي حال».',
        'اترك «اختصار على سطح المكتب» محددًا واضغط «تثبيت».'],
      exe_warn: 'لا يطلب المثبّت صلاحيات المسؤول ويثبّت داخل مجلد المستخدم. يُزال كأي برنامج من الإعدادات ← التطبيقات.',
      exe_ss_t: '⚠️ إذا ظهرت نافذة Windows الزرقاء',
      exe_ss: 'عبارة «حمى Windows جهازك» تظهر لكل برنامج لم ينزّله كثيرون بعد، ولا علاقة لها بالفيروسات. اضغط «مزيد من المعلومات» ثم «تشغيل على أي حال».',
      exe_ss2: 'يختفي التحذير وحده عندما يثبّت التطبيق عدد كافٍ من الناس. وإزالته قبل ذلك تتطلب شهادة باهظة باسم شركة مسجّلة.',
      exe_ss3: 'وإن أردت بلا تحذيرات إطلاقًا، استخدم زر «ثبّت التطبيق» أعلى الصفحة: الاختصار نفسه، لكن المتصفح هو من يضعه.',
      apk_t: '📦 ملف APK لأندرويد',
      apk_d: 'إن لم ترغب بالتثبيت من المتصفح، هذا هو التطبيق الحقيقي بملف واحد. لا حاجة إلى Google Play.',
      apk_light: '⚡ خفيف — {s}',
      apk_light_d: 'ثماني قصص وعشرة مواضيع كلمات بالداخل، والباقي يُحمّل من الموقع. فيه حساب وأصدقاء وتصنيف.',
      apk_full: '📚 كامل — {s}',
      apk_full_d: 'كل القصص والأصوات والاختبارات بالداخل. يعمل بلا إنترنت نهائيًا، وبلا حساب.',
      apk_steps_t: 'كيف تثبّته',
      apk_steps: ['اضغط الزر — ينزل الملف إلى «التنزيلات».',
        'افتحه. سيطلب أندرويد إذنًا بالتثبيت من هذا المصدر — اسمح به.',
        'اضغط «تثبيت» ثم «فتح».'],
      apk_warn: 'التطبيق موقّع منا وبلا إعلانات. ينبّه أندرويد أن المصدر ليس Google Play — وهذا طبيعي لملفات APK.',
      url_btn: '🔗 تنزيل اختصار لنظام Windows',
      ico_btn: '🖼️ تنزيل الأيقونة (.ico)',
      done: '✅ التطبيق مثبَّت بالفعل — أنت تستخدمه في نافذته الخاصة.'
    }
  };
  if (window.KL_T_FILL) KL_T_FILL(P, 'install.js:P');
  const px = () => P[(C() || {}).ui] || P.en;
  const isAndroid = () => /android/i.test(navigator.userAgent);
  const isMac = () => /macintosh|mac os x/i.test(navigator.userAgent) && !isIOS();
  const isWin = () => /windows/i.test(navigator.userAgent);

  // простий ярлик .url — для браузерів, які не вміють ставити застосунок
  function downloadUrlFile() {
    const url = location.href.split('#')[0];
    const body = ['[InternetShortcut]', 'URL=' + url, 'IconIndex=0', 'IconFile=' + url + 'icons/favicon.ico', ''].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'application/internet-shortcut' }));
    a.download = 'Komiks-Lab.url';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  function page() {
    if (window.KomiksDownloads) return window.KomiksDownloads.section(true);
    const K = C(); if (!K) return null;
    const { h } = K, L = px();
    const mine = isIOS() ? 'ios' : isAndroid() ? 'and' : isMac() ? 'mac' : isWin() ? 'win' : '';
    const card = key => {
      const [name, steps] = L[key];
      return h('div', { class: 'box inst-card' + (key === mine ? ' mine' : '') },
        h('h3', {}, name, key === mine ? h('span', { class: 'inst-here' }, L.here) : null),
        h('ol', { class: 'inst-steps' }, steps.map(t => h('li', {}, t))));
    };
    const btn = button('btn accent big');
    if (btn) btn.hidden = false;                          // на цій сторінці кнопка видима завжди
    const top = standalone()
      ? h('p', { class: 'inst-done' }, L.done)
      : h('div', { class: 'row-left inst-top' }, btn, h('img', { class: 'inst-icon', src: 'icons/icon-192.png', alt: '', width: 72, height: 72 }));
    /* Файли лежать поруч із сайтом і оновлюються окремо від збірки, тому розмір
       читаємо з самого сервера: показувати «15 МБ», коли там уже 18, — обманювати. */
    const apkBox = h('div', { class: 'box inst-apk' },
      h('h3', {}, L.apk_t), h('p', {}, L.apk_d),
      h('div', { class: 'inst-apk-grid' },
        h('div', {},
          h('a', { class: 'btn accent big', href: 'app/komikslab.apk', download: 'Komiks-Lab.apk', 'data-apk': 'light' }, L.apk_light.replace('{s}', '~15 МБ')),
          h('p', { class: 'hint' }, L.apk_light_d)),
        h('div', {},
          h('a', { class: 'btn big', href: 'app/komikslab-offline.apk', download: 'Komiks-Lab-offline.apk', 'data-apk': 'full' }, L.apk_full.replace('{s}', '~150 МБ')),
          h('p', { class: 'hint' }, L.apk_full_d))),
      h('h4', {}, L.apk_steps_t),
      h('ol', { class: 'inst-steps' }, L.apk_steps.map(t => h('li', {}, t))),
      h('p', { class: 'hint' }, L.apk_warn));
    /* Точні розміри підставляємо, щойно сервер відповість; якщо файлів ще немає —
       ховаємо кнопку, щоб людина не тиснула в нікуди. */
    setTimeout(() => {
      for (const a of apkBox.querySelectorAll('a[data-apk]')) {
        a.addEventListener('click', e => {
          if (!window.KomiksFeedback || !window.KomiksFeedback.openAndroid) return;
          e.preventDefault();
          const name = a.getAttribute('download') || '';
          window.KomiksFeedback.openAndroid(a.getAttribute('href'), 'apk-' + a.dataset.apk, name);
        });
        fetch(a.getAttribute('href'), { method: 'HEAD' }).then(r => {
          if (!r.ok) { a.parentElement.hidden = true; return; }
          const n = Number(r.headers.get('content-length') || 0);
          if (!n) return;
          const mb = n / 1048576;
          const key = a.dataset.apk === 'light' ? 'apk_light' : 'apk_full';
          a.textContent = L[key].replace('{s}', (mb >= 100 ? Math.round(mb) : mb.toFixed(1)) + ' МБ');
        }).catch(() => { a.parentElement.hidden = true; });
      }
    }, 0);

    const exeBox = h('div', { class: 'box inst-apk' },
      h('h3', {}, L.exe_t), h('p', {}, L.exe_d),
      h('div', { class: 'inst-apk-grid' },
        h('div', {},
          h('a', { class: 'btn accent big', href: 'app/KomiksLab-Setup.exe', download: 'KomiksLab-Setup.exe', 'data-exe': 'light' }, L.exe_light.replace('{s}', '~2 МБ')),
          h('p', { class: 'hint' }, L.exe_light_d)),
        h('div', {},
          h('a', { class: 'btn big', href: 'app/KomiksLab-Offline-Setup.exe', download: 'KomiksLab-Offline-Setup.exe', 'data-exe': 'full' }, L.exe_full.replace('{s}', '~120 МБ')),
          h('p', { class: 'hint' }, L.exe_full_d))),
      h('h4', {}, L.exe_steps_t),
      h('ol', { class: 'inst-steps' }, L.exe_steps.map(t => h('li', {}, t))),
      h('p', { class: 'hint' }, L.exe_warn),
      /* Пояснення SmartScreen: людина, яка розуміє, що бачить, не лякається
         й не кидає встановлення на пів дорозі. */
      h('div', { class: 'inst-ss' },
        h('b', {}, L.exe_ss_t),
        h('p', {}, L.exe_ss),
        h('p', { class: 'hint' }, L.exe_ss2),
        h('p', { class: 'hint' }, L.exe_ss3)));
    setTimeout(() => {
      for (const a of exeBox.querySelectorAll('a[data-exe]')) {
        fetch(a.getAttribute('href'), { method: 'HEAD' }).then(r => {
          if (!r.ok) { a.parentElement.hidden = true; return; }
          const n = Number(r.headers.get('content-length') || 0);
          if (!n) return;
          const mb = n / 1048576;
          const key = a.dataset.exe === 'light' ? 'exe_light' : 'exe_full';
          a.textContent = L[key].replace('{s}', (mb >= 100 ? Math.round(mb) : mb.toFixed(1)) + ' МБ');
        }).catch(() => { a.parentElement.hidden = true; });
      }
    }, 0);

    /* Windows показуємо першим тим, хто зайшов з Windows, Android — з телефона:
       свій варіант має бути зверху, а не десь нижче по сторінці. */
    const boxes = isAndroid() ? [apkBox, exeBox] : isWin() ? [exeBox, apkBox] : [apkBox, exeBox];

    return h('section', { class: 'install-page' },
      K.pageHead ? K.pageHead(L.title) : h('h1', {}, L.title),
      h('p', { class: 'lead-p' }, L.lead),
      top,
      ...boxes,
      h('div', { class: 'inst-grid' }, card('win'), card('and'), card('ios'), card('mac')),
      h('div', { class: 'box' }, h('h3', {}, L.extra_t), h('p', {}, L.extra),
        h('div', { class: 'row-left' },
          h('button', { class: 'btn', type: 'button', onclick: downloadUrlFile }, L.url_btn),
          h('a', { class: 'btn', href: 'icons/favicon.ico', download: 'Komiks-Lab.ico' }, L.ico_btn))));
  }

  window.KomiksInstall = { button, page, install: () => install(document.createElement('button')), canInstall: () => !!deferred || isIOS() };
})();
