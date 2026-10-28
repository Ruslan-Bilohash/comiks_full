/* Public store links: no account required, no automatic downloads. */
(() => {
  const texts = {
    uk: ['Learning Norwegian — завантажуйте застосунок', 'Навчайтеся на Android та Windows. Спробуйте застосунок і допоможіть зробити його кращим.', 'Завантажити в', 'iPhone / App Store — незабаром', 'Станьте тестувальником! Залишайте чесні відгуки та побажання в Google Play і Microsoft Store або пишіть нам.', 'Написати відгук', 'Усі способи завантаження', 'Для онлайн-функцій потрібен інтернет. Доступність залежить від країни та етапу випуску.', "Інструкції українською"],
    en: ['Learning Norwegian — get the app', 'Learn on Android and Windows. Try the app and help us improve it.', 'Get it on', 'iPhone / App Store — coming soon', 'Help us test! Leave honest feedback and suggestions on Google Play and Microsoft Store, or email us.', 'Send feedback', 'Download options', 'Online features require internet. Availability depends on your country and release track.', "Download guides in Ukrainian"],
    pt: ['Learning Norwegian — baixe o app', 'Estude no Android e no Windows. Experimente o app e ajude a melhorá-lo.', 'Baixe no', 'iPhone / App Store — em breve', 'Ajude a testar! Deixe uma avaliação sincera e sugestões no Google Play e na Microsoft Store, ou mande um e-mail para nós.', 'Enviar comentário', 'Opções de download', 'Os recursos online precisam de internet. A disponibilidade depende do seu país e do canal de lançamento.', 'Guias de download em ucraniano'],
    no: ['Learning Norwegian — last ned appen', 'Lær på Android og Windows. Prøv appen og hjelp oss å gjøre den bedre.', 'Last ned fra', 'iPhone / App Store — kommer snart', 'Bli med og test! Legg igjen ærlige vurderinger og ønsker i Google Play og Microsoft Store, eller send oss en e-post.', 'Send tilbakemelding', 'Nedlastingsalternativer', 'Nettfunksjoner krever internett. Tilgjengelighet avhenger av land og utgivelse.', "Nedlastingsveiledninger på ukrainsk"],
    lt: ['Learning Norwegian — atsisiųskite programėlę', 'Mokykitės Android ir Windows. Padėkite mums tobulėti.', 'Atsisiųsti iš', 'iPhone / App Store — netrukus', 'Išbandykite! Palikite atsiliepimą Google Play ar Microsoft Store arba parašykite mums.', 'Siųsti atsiliepimą', 'Atsisiuntimo būdai', 'Internetinėms funkcijoms reikia interneto. Prieinamumas priklauso nuo šalies ir leidimo.', "Atsisiuntimo instrukcijos ukrainiečių kalba"],
    de: ['Learning Norwegian — App herunterladen', 'Lerne auf Android und Windows. Hilf uns, die App zu verbessern.', 'Herunterladen bei', 'iPhone / App Store — demnächst', 'Teste mit! Hinterlasse ehrliches Feedback bei Google Play oder Microsoft Store oder schreibe uns.', 'Feedback senden', 'Downloadmöglichkeiten', 'Online-Funktionen benötigen Internet. Verfügbarkeit abhängig von Land und Veröffentlichung.', "Download-Anleitungen auf Ukrainisch"],
    pl: ['Learning Norwegian — pobierz aplikację', 'Ucz się na Androidzie i Windows. Pomóż nam ulepszyć aplikację.', 'Pobierz z', 'iPhone / App Store — wkrótce', 'Zostań testerem! Zostaw szczerą opinię w Google Play lub Microsoft Store albo napisz do nas.', 'Wyślij opinię', 'Opcje pobierania', 'Funkcje online wymagają internetu. Dostępność zależy od kraju i wydania.', "Instrukcje pobierania po ukraińsku"],
    tr: ['Learning Norwegian — uygulamayı indir', 'Android ve Windows’ta öğrenin. Uygulamayı geliştirmemize yardım edin.', 'İndirin:', 'iPhone / App Store — yakında', 'Test edin! Google Play veya Microsoft Store’da dürüst görüşlerinizi paylaşın ya da bize yazın.', 'Geri bildirim gönder', 'İndirme seçenekleri', 'Çevrimiçi özellikler internet gerektirir. Kullanılabilirlik ülkeye ve yayına bağlıdır.', "Ukraynaca indirme kılavuzları"],
    ar: ['Learning Norwegian — تنزيل التطبيق', 'تعلّم على Android وWindows وساعدنا على تحسين التطبيق.', 'تنزيل من', 'iPhone / App Store — قريبًا', 'شارك في الاختبار! اترك رأيك واقتراحاتك في Google Play وMicrosoft Store أو راسلنا.', 'إرسال ملاحظات', 'خيارات التنزيل', 'تتطلب الميزات المتصلة الإنترنت. يختلف التوفر حسب البلد ومرحلة الإصدار.', "أدلة التنزيل باللغة الأوكرانية"]
  };
  function section(full = false) {
    const { h, ui } = window.KomiksCore;
    const t = texts[ui] || texts.en;
    const card = (name, platform, url, icon = 'icons/icon-128.png', androidRequest = false) => h(androidRequest ? 'button' : 'a', androidRequest
      ? { class: 'download-store android-test-trigger', type: 'button', onclick: () => window.KomiksFeedback ? window.KomiksFeedback.openAndroid(url, 'google-play-card') : window.open(url, '_blank', 'noopener') }
      : { class: 'download-store', href: url, target: '_blank', rel: 'noopener noreferrer' },
      h('img', { src: icon, width: 64, height: 64, alt: '', loading: 'lazy' }),
      h('span', {}, h('small', {}, platform), h('strong', {}, name), h('span', {}, t[2] + ' ' + name)));
    return h('section', { class: 'downloads-block', 'aria-label': t[0] },
      h(full ? 'h1' : 'h2', {}, t[0]), h('p', {}, t[1]),
      h('div', { class: 'download-grid' },
        card('Google Play', 'Android', 'https://play.google.com/store/apps/details?id=com.bilohash.comiks', 'icons/icon-128.png', true),
        card('Microsoft Store', 'Windows', 'https://apps.microsoft.com/detail/9MZTK7VJZ37D', 'icons/microsoft-store.png')),
      h('nav', { class: 'download-guides', 'aria-label': t[8] },
        h('span', {}, t[8] + ': '),
        h('a', { href: 'uk/download/windows/', hreflang: 'uk' }, 'Windows'), ' · ',
        h('a', { href: 'uk/download/android/', hreflang: 'uk' }, 'Android')),
      h('p', { class: 'download-coming' }, t[3]),
      h('p', {}, t[4]), h('a', { class: 'btn', href: 'mailto:email@bilohash.com?subject=Learning%20Norwegian%20feedback' }, t[5] + ' · email@bilohash.com'),
      full ? null : h('a', { class: 'download-more', href: '#/install' }, t[6]),
      h('p', { class: 'hint' }, t[7]));
  }
  /* 📲 Розумна смужка: пропонує саме ту версію, що пасує пристрою — Android → Google Play,
     Windows → Microsoft Store, iPhone/iPad → «на головний екран» (застосунок незабаром), Mac/Linux →
     встановлення з браузера. Не показуємо в застосунку й у вже встановленому вікні; «Приховати» — на 3 дні. */
  const ST = {
    uk: { and: ['Є застосунок для Android', 'Встановіть із Google Play — швидше, з озвученням і без браузера.', 'Відкрити в Google Play'], win: ['Є застосунок для Windows', 'Встановіть із Microsoft Store — окреме вікно, як звичайна програма.', 'Відкрити в Microsoft Store'],
      ios: ['Застосунок для iPhone — незабаром', 'Поки додайте Комікс·Lab на головний екран: Safari → «Поділитися» → «На екран “Додому”».', 'Як це зробити'], pc: ['Встановіть Комікс·Lab', 'Застосунок у власному вікні — одним натиском у браузері.', 'Як встановити'], x: 'Приховати', xt: 'Сховати на 3 дні' },
    en: { and: ['There is an Android app', 'Install it from Google Play — faster, with audio and no browser.', 'Open in Google Play'], win: ['There is a Windows app', 'Install it from the Microsoft Store — its own window, like a normal program.', 'Open in Microsoft Store'],
      ios: ['iPhone app — coming soon', 'For now, add Komiks·Lab to your Home Screen: Safari → Share → “Add to Home Screen”.', 'Show me how'], pc: ['Install Komiks·Lab', 'The app in its own window — one click in your browser.', 'How to install'], x: 'Hide', xt: 'Hide for 3 days' },
    no: { and: ['Det finnes en Android-app', 'Installer den fra Google Play – raskere, med lyd og uten nettleser.', 'Åpne i Google Play'], win: ['Det finnes en Windows-app', 'Installer den fra Microsoft Store – eget vindu, som et vanlig program.', 'Åpne i Microsoft Store'],
      ios: ['iPhone-app – kommer snart', 'Legg Komiks·Lab på Hjem-skjermen så lenge: Safari → Del → «Legg til på Hjem-skjerm».', 'Vis meg hvordan'], pc: ['Installer Komiks·Lab', 'Appen i eget vindu – ett klikk i nettleseren.', 'Slik installerer du'], x: 'Skjul', xt: 'Skjul i 3 dager' },
  };
  if (window.KL_T_FILL) KL_T_FILL(ST, 'downloads.js:ST');
  function smart() {
    const { h, ui } = window.KomiksCore;
    const ua = navigator.userAgent || '';
    if (/; wv\)/.test(ua) || window.Capacitor || /[?&]app=windows/.test(location.search)) return null;
    if ((window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone) return null;
    try { if (+localStorage.getItem('comiks.smartHide') > Date.now()) return null; } catch { /* приватний режим */ }
    const T = ST[ui] || ST.en;
    const ios = /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
    const kind = /android/i.test(ua) ? 'and' : ios ? 'ios' : /windows/i.test(ua) ? 'win' : 'pc';
    const href = { and: 'https://play.google.com/store/apps/details?id=com.bilohash.comiks', win: 'https://apps.microsoft.com/detail/9MZTK7VJZ37D', ios: '#/install', pc: '#/install' }[kind];
    const [title, text, cta] = T[kind];
    const bar = h('aside', { class: 'smart-app smart-' + kind, 'aria-label': title },
      h('img', { src: kind === 'win' ? 'icons/microsoft-store.png' : 'icons/icon-128.png', width: 48, height: 48, alt: '' }),
      h('div', {}, h('b', {}, title), h('small', {}, text)),
      kind === 'and'
        ? h('button', { class: 'btn accent small android-test-trigger', type: 'button', onclick: () => window.KomiksFeedback ? window.KomiksFeedback.openAndroid(href, 'smart-android-banner') : window.open(href, '_blank', 'noopener') }, cta)
        : h('a', { class: 'btn accent small', href, ...(href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {}) }, cta),
      h('button', { class: 'smart-x', type: 'button', title: T.xt, 'aria-label': T.xt, onclick: () => { try { localStorage.setItem('comiks.smartHide', String(Date.now() + 3 * 864e5)); } catch { /* ignore */ } bar.remove(); } }, '✕ ', h('span', {}, T.x)));
    return bar;
  }
  window.KomiksDownloads = { section, smart };
})();
