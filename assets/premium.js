/* Комікс·Lab — 💎 Преміум: сторінка #/premium, оплата через Stripe Checkout (69 крон/міс).
   Картку вводять на сторінці Stripe — ми не бачимо й не зберігаємо її. Преміум вмикає сервер
   після перевірки оплати (api/billing.php → confirm), а не браузер. */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  // оплати більше немає — навчання безкоштовне; api/billing.php лишається лише для історії підписок
  const C = () => window.KomiksCore;
  const T = {
    uk: { title: '💎 Преміум', price: n => `${n} крон/міс`, lead: 'Перші 100 учасників отримали Преміум назавжди безкоштовно. Далі — підписка: усі тести й ігри без обмежень.',
      li: ['📝 Тести без обмежень (безкоштовно — 25 на місяць)', '🎮 Усі ігри: Логік-гонка, Math Rocket, шахи', '🃏 Картки з повторенням і власний план навчання', '✉️ Повідомлення друзям і стіна профілю', '❤️ Підтримка проєкту — без реклами'],
      buy: 'Оформити підписку', wait: 'Відкриваємо Stripe…', manage: '⚙️ Керувати підпискою', cancel_note: 'Скасувати можна будь-коли — Преміум діє до кінця оплаченого місяця.',
      have: d => `✅ Преміум активний до ${d}`, forever: '🏅 У тебе Преміум назавжди', login: 'Спочатку увійдіть в акаунт', login_btn: 'Увійти',
      ok: '🎉 Дякуємо! Преміум увімкнено.', checking: 'Перевіряємо оплату…', off: 'Оплату ще не налаштовано на сервері.',
      safe: '🔒 Оплата відбувається на сторінці Stripe. Дані картки не потрапляють на наш сервер.',
      err: { already: 'У вас уже є Преміум.', not_configured: 'Оплату ще не налаштовано.', unpaid: 'Оплата не пройшла.', forbidden: 'Ця оплата належить іншому акаунту.', server: 'Сервер не зміг завершити операцію. Спробуйте ще раз.', too_big: 'Запит завеликий.', net: 'Немає зв’язку із сервером.', auth: 'Спочатку увійдіть в акаунт.' },
      quota: (l, n) => `Лишилось тестів цього місяця: ${l} з ${n}`, over: 'Безкоштовні тести на цей місяць закінчились.' },
    en: { title: '💎 Premium', price: n => `${n} NOK/month`, lead: 'The first 100 members got Premium free forever. After that it is a subscription: all tests and games without limits.',
      li: ['📝 Unlimited tests (free plan: 25 a month)', '🎮 All games: Logic Race, Math Rocket, chess', '🃏 Flashcards with repetition and your own study plan', '✉️ Messages to friends and your profile wall', '❤️ Support the project — no ads'],
      buy: 'Subscribe', wait: 'Opening Stripe…', manage: '⚙️ Manage subscription', cancel_note: 'Cancel any time — Premium stays until the end of the paid month.',
      have: d => `✅ Premium is active until ${d}`, forever: '🏅 You have Premium forever', login: 'Please sign in first', login_btn: 'Sign in',
      ok: '🎉 Thank you! Premium is on.', checking: 'Checking the payment…', off: 'Payments are not configured on the server yet.',
      safe: '🔒 Payment happens on Stripe’s page. Card details never reach our server.',
      err: { already: 'You already have Premium.', not_configured: 'Payments are not configured yet.', unpaid: 'The payment did not go through.', forbidden: 'This payment belongs to another account.', server: 'The server could not finish the operation. Please try again.', too_big: 'The request is too large.', net: 'No connection to the server.', auth: 'Please sign in first.' },
      quota: (l, n) => `Tests left this month: ${l} of ${n}`, over: 'You have used the free tests for this month.' },
    no: { title: '💎 Premium', price: n => `${n} kr/mnd`, lead: 'De 100 første medlemmene fikk Premium gratis for alltid. Deretter er det abonnement: alle prøver og spill uten grenser.',
      li: ['📝 Prøver uten grenser (gratis: 25 i måneden)', '🎮 Alle spill: Logikkløpet, Matte-raketten, sjakk', '🃏 Kort med repetisjon og egen læringsplan', '✉️ Meldinger til venner og profilvegg', '❤️ Støtt prosjektet – ingen reklame'],
      buy: 'Bli abonnent', wait: 'Åpner Stripe …', manage: '⚙️ Administrer abonnementet', cancel_note: 'Du kan si opp når som helst – Premium varer ut den betalte måneden.',
      have: d => `✅ Premium er aktivt til ${d}`, forever: '🏅 Du har Premium for alltid', login: 'Logg inn først', login_btn: 'Logg inn',
      ok: '🎉 Takk! Premium er på.', checking: 'Sjekker betalingen …', off: 'Betaling er ikke satt opp på serveren ennå.',
      safe: '🔒 Betalingen skjer hos Stripe. Kortopplysninger kommer aldri til vår server.',
      err: { already: 'Du har allerede Premium.', not_configured: 'Betaling er ikke satt opp ennå.', unpaid: 'Betalingen gikk ikke gjennom.', forbidden: 'Denne betalingen tilhører en annen konto.', server: 'Serveren klarte ikke å fullføre. Prøv igjen.', too_big: 'Forespørselen er for stor.', net: 'Ingen forbindelse med serveren.', auth: 'Logg inn først.' },
      quota: (l, n) => `Prøver igjen denne måneden: ${l} av ${n}`, over: 'De gratis prøvene for denne måneden er brukt opp.' },
    ar: { title: '💎 بريميوم', price: n => `${n} كرونة شهريًا`, lead: 'حصل أول 100 عضو على بريميوم مجانًا للأبد. بعد ذلك اشتراك: كل الاختبارات والألعاب بلا حدود.',
      li: ['📝 اختبارات بلا حدود (المجاني: 25 شهريًا)', '🎮 كل الألعاب: سباق المنطق، Math Rocket، الشطرنج', '🃏 بطاقات المراجعة وخطة تعلّم خاصة', '✉️ رسائل للأصدقاء وجدار الملف', '❤️ دعم المشروع — بلا إعلانات'],
      buy: 'اشترك الآن', wait: 'جارٍ فتح Stripe…', manage: '⚙️ إدارة الاشتراك', cancel_note: 'يمكنك الإلغاء في أي وقت — يستمر البريميوم حتى نهاية الشهر المدفوع.',
      have: d => `✅ البريميوم فعّال حتى ${d}`, forever: '🏅 لديك بريميوم للأبد', login: 'سجّل الدخول أولًا', login_btn: 'تسجيل الدخول',
      ok: '🎉 شكرًا! تم تفعيل البريميوم.', checking: 'نتحقق من الدفع…', off: 'لم يتم إعداد الدفع على الخادم بعد.',
      safe: '🔒 يتم الدفع على صفحة Stripe. بيانات البطاقة لا تصل إلى خادمنا أبدًا.',
      err: { already: 'لديك بريميوم بالفعل.', not_configured: 'لم يتم إعداد الدفع بعد.', unpaid: 'لم تتم عملية الدفع.', forbidden: 'هذه العملية تخص حسابًا آخر.', server: 'تعذّر على الخادم إتمام العملية. حاول مجددًا.', too_big: 'الطلب كبير جدًا.', net: 'لا اتصال بالخادم.', auth: 'سجّل الدخول أولًا.' },
      quota: (l, n) => `الاختبارات المتبقية هذا الشهر: ${l} من ${n}`, over: 'انتهت الاختبارات المجانية لهذا الشهر.' }
  };
  const tx = () => T[(C() || {}).ui] || T.en;

  /* Навчання в Комікс·Lab безкоштовне. Сторінку лишаємо, щоб старі посилання
     й закладки на #/premium відкривали пояснення, а не порожнечу. */
  const FREE = {
    uk: { t: '🎁 Усе безкоштовно', d: 'Комікси, озвучення, тести, картки, слова, граматика та ігри — без обмежень і без оплати. Акаунт потрібен лише для того, щоб зберегти прогрес, зірки й друзів.',
      li: ['📖 Усі 75 коміксів A1–B2 з голосом', '🧩 Тести, картки та «Пари» без ліміту', '🎮 Ігри разом із класом чи сім’єю', '👥 Друзі, стіни й повідомлення'], go: '📅 Почати заняття', home: '🏠 На головну' },
    en: { t: '🎁 Everything is free', d: 'Comics, audio, tests, cards, words, grammar and games — no limits, no payment. An account only keeps your progress, stars and friends.',
      li: ['📖 All 75 comics A1–B2 with audio', '🧩 Tests, cards and Pairs without a limit', '🎮 Games with your class or family', '👥 Friends, walls and messages'], go: '📅 Start today’s lesson', home: '🏠 Home' },
    no: { t: '🎁 Alt er gratis', d: 'Tegneserier, lyd, prøver, kort, ord, grammatikk og spill – uten grenser og uten betaling. Kontoen tar bare vare på fremgangen, stjernene og vennene dine.',
      li: ['📖 Alle 75 tegneserier A1–B2 med lyd', '🧩 Prøver, kort og Par uten grense', '🎮 Spill med klassen eller familien', '👥 Venner, vegger og meldinger'], go: '📅 Start dagens økt', home: '🏠 Hjem' },
    ar: { t: '🎁 كل شيء مجاني', d: 'القصص والصوت والاختبارات والبطاقات والكلمات والقواعد والألعاب — بلا حدود وبلا دفع. الحساب يحفظ تقدّمك ونجومك وأصدقاءك فقط.',
      li: ['📖 كل القصص الـ75 من A1 إلى B2 بالصوت', '🧩 اختبارات وبطاقات و«أزواج» بلا حدّ', '🎮 ألعاب مع الصف أو العائلة', '👥 أصدقاء وجدران ورسائل'], go: '📅 ابدأ درس اليوم', home: '🏠 الرئيسية' }
  };
  const fx = () => FREE[(C() || {}).ui] || FREE.en;
  function render() {
    const K = C(), { h } = K, L = fx();
    return h('section', { class: 'pm-page' }, K.pageHead(L.t),
      h('div', { class: 'pm-card' }, h('p', {}, L.d), h('ul', {}, L.li.map(x => h('li', {}, x)))),
      h('div', { class: 'row-left' }, h('a', { class: 'btn accent big', href: '#/today' }, L.go), h('a', { class: 'btn', href: '#/' }, L.home)));
  }
  // колишня стіна «тести закінчились» більше не потрібна: ліміту немає
  function wall() { return render(); }
  window.KomiksPremium = { render, wall, text: () => tx() };
})();
