/* Комікс·Lab — 🎮 ігри (#/games).
 *
 * Ігри зроблені в тій самій майстерні, але живуть окремими адресами й нічого
 * не знають про застосунок. Тут — вітрина: паспорт кожної гри з data/games.js,
 * знімки, склад бійців і кнопка «Грати».
 *
 * Два правила, які видно в коді:
 *
 *  • У збірці для крамниці (Play Market, App Store) вітрини немає зовсім —
 *    див. NO_EXTERNAL в app.js. Посилання на файтинг із навчального застосунку
 *    з категорією 4+ змінює його вікову категорію, і це не та ціна, яку варто
 *    платити за одне посилання.
 *  • Мова. Гра говорить українською, англійською та норвезькою; решті мов
 *    інтерфейсу відкриваємо англійською, бо іншого вона не зрозуміє. Список
 *    мов не вигаданий — він лежить у паспорті гри.
 */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const C = () => window.KomiksCore;
  const list = () => (window.KOMIKS_GAMES || []);

  const G = {
    uk: {
      nav: '🎮 Ігри', title: '🎮 Ігри',
      lead: 'Ігри з тієї самої майстерні, що й комікси. Нічого не треба встановлювати й ні за що платити: відкривається у вкладці браузера й одразу починається.',
      meta_t: 'Браузерні ігри — «Двобій 3D» і не тільки | Комікс·Lab',
      meta_d: '«Двобій 3D» — безкоштовний 3D-файтинг у браузері: сім бійців, сім арен, кампанія і гра вдвох на одній клавіатурі. Без встановлення й без акаунта.',
      h1: 'Ігри Комікс·Lab',
      play: '🎮 Грати', open: 'Відкрити гру',
      newtab: 'Відкриється в новій вкладці на bilohash.com',
      shots: '📸 Як це виглядає',
      caps: ['Головне меню: режими гри', 'Вибір бійця й арени', 'Бій на одній із семи арен', 'Кампанія: сім етапів із сюжетом'],
      keys: '🎛️ Керування',
      roster: '🥊 Сім бійців',
      arenas: '🏟️ Сім арен',
      camp: '🗺️ Кампанія: сім етапів',
      modes: '🎯 Як грати',
      facts: 'ℹ️ Коротко',
      f_price: 'Ціна', f_price_v: 'Безкоштовно, без акаунта й без реклами',
      f_players: 'Гравці', f_players_v: 'Один або двоє на одній клавіатурі',
      f_tech: 'Технологія', f_size: 'Вага', f_langs: 'Мови гри', f_age: 'Вік',
      f_save: 'Прогрес', f_save_v: 'Зберігається у вашому браузері',
      note_lang: 'Гра говорить українською, англійською та норвезькою. З будь-якою іншою мовою інтерфейсу вона відкриється англійською.',
      note_age: 'Удари мультиплікаційні, крові немає — але це все одно бійка, тож ставимо 12+. У коміксах і тестах насильства немає зовсім.',
      home_t: '🎮 Ігри',
      home_p: 'Зроблені в тій самій майстерні, що й комікси, але без жодного домашнього завдання.',
      more: 'Усі ігри →', back: '← Назад',
      soon: 'Наступні ігри вже в роботі.',
    },
    en: {
      nav: '🎮 Games', title: '🎮 Games',
      lead: 'Games from the same workshop as the comics. Nothing to install and nothing to pay for: they open in a browser tab and start right away.',
      meta_t: 'Free browser games — Duel 3D and more | Komiks·Lab',
      meta_d: 'Duel 3D — a free 3D fighting game in the browser: seven fighters, seven arenas, a campaign and two players on one keyboard. No install, no account.',
      h1: 'Games from Komiks·Lab',
      play: '🎮 Play', open: 'Open the game',
      newtab: 'Opens in a new tab on bilohash.com',
      shots: '📸 How it looks',
      caps: ['The main menu: ways to play', 'Choosing a fighter and an arena', 'A fight in one of the seven arenas', 'The campaign: seven stages with a story'],
      keys: '🎛️ Controls',
      roster: '🥊 The seven fighters',
      arenas: '🏟️ The seven arenas',
      camp: '🗺️ The campaign, stage by stage',
      modes: '🎯 Ways to play',
      facts: 'ℹ️ In short',
      f_price: 'Price', f_price_v: 'Free, no account and no ads',
      f_players: 'Players', f_players_v: 'One, or two on one keyboard',
      f_tech: 'Technology', f_size: 'Size', f_langs: 'Game languages', f_age: 'Age',
      f_save: 'Progress', f_save_v: 'Saved in your own browser',
      note_lang: 'The game speaks Ukrainian, English and Norwegian. With any other interface language it opens in English.',
      note_age: 'Cartoon punches and no blood — but it is still a fighting game, so we mark it 12+. The comics and the tests have no violence at all.',
      home_t: '🎮 Games',
      home_p: 'Made in the same workshop as the comics, but with no homework at all.',
      more: 'All games →', back: '← Back',
      soon: 'More games are already in the works.',
    },
    no: {
      nav: '🎮 Spill', title: '🎮 Spill',
      lead: 'Spill fra samme verksted som tegneseriene. Ingenting å installere og ingenting å betale: de åpnes i en fane i nettleseren og starter med én gang.',
      meta_t: 'Gratis nettleserspill — Duell 3D og flere | Komiks·Lab',
      meta_d: 'Duell 3D – et gratis 3D-kampspill i nettleseren: sju kjempere, sju arenaer, historiemodus og to spillere på ett tastatur. Ingen installering, ingen konto.',
      h1: 'Spill fra Komiks·Lab',
      play: '🎮 Spill', open: 'Åpne spillet',
      newtab: 'Åpnes i en ny fane på bilohash.com',
      shots: '📸 Slik ser det ut',
      caps: ['Hovedmenyen: måter å spille på', 'Velg kjemper og arena', 'En kamp på en av de sju arenaene', 'Historiemodus: sju trinn med fortelling'],
      keys: '🎛️ Kontroller',
      roster: '🥊 De sju kjemperne',
      arenas: '🏟️ De sju arenaene',
      camp: '🗺️ Historiemodus, trinn for trinn',
      modes: '🎯 Måter å spille på',
      facts: 'ℹ️ Kort fortalt',
      f_price: 'Pris', f_price_v: 'Gratis, uten konto og uten reklame',
      f_players: 'Spillere', f_players_v: 'Én, eller to på ett tastatur',
      f_tech: 'Teknologi', f_size: 'Størrelse', f_langs: 'Språk i spillet', f_age: 'Alder',
      f_save: 'Fremgang', f_save_v: 'Lagres i din egen nettleser',
      note_lang: 'Spillet snakker ukrainsk, engelsk og norsk. Med et annet grensesnittspråk åpnes det på engelsk.',
      note_age: 'Tegnefilmslag og ikke noe blod – men det er likevel et kampspill, så vi setter 12+. Tegneseriene og prøvene har ingen vold i det hele tatt.',
      home_t: '🎮 Spill',
      home_p: 'Laget i samme verksted som tegneseriene, men helt uten lekser.',
      more: 'Alle spill →', back: '← Tilbake',
      soon: 'Flere spill er allerede under arbeid.',
    },
  };
  if (window.KL_T_FILL) KL_T_FILL(G, 'games.js:G');
  G.ar = {
    nav: '🎮 الألعاب', title: '🎮 الألعاب',
    lead: 'ألعاب من الورشة نفسها التي تصدر منها القصص المصوّرة. لا شيء تثبّته ولا شيء تدفعه: تُفتح في تبويب المتصفّح وتبدأ فورًا.',
    meta_t: 'ألعاب مجانية في المتصفّح — «ديول 3D» وغيرها | Komiks·Lab',
    meta_d: '«ديول 3D» — لعبة قتال ثلاثية الأبعاد مجانية في المتصفّح: سبعة مقاتلين، سبع حلبات، حملة قصصية ولاعبان على لوحة مفاتيح واحدة. بلا تثبيت وبلا حساب.',
    h1: 'ألعاب Komiks·Lab',
    play: '🎮 العب', open: 'افتح اللعبة',
    newtab: 'تُفتح في تبويب جديد على bilohash.com',
    shots: '📸 كيف تبدو',
    caps: ['القائمة الرئيسية: طرق اللعب', 'اختيار المقاتل والحلبة', 'قتال في إحدى الحلبات السبع', 'الحملة: سبع مراحل بقصة'],
    keys: '🎛️ التحكّم',
    roster: '🥊 المقاتلون السبعة',
    arenas: '🏟️ الحلبات السبع',
    camp: '🗺️ الحملة، مرحلة بمرحلة',
    modes: '🎯 طرق اللعب',
    facts: 'ℹ️ باختصار',
    f_price: 'السعر', f_price_v: 'مجانًا، بلا حساب وبلا إعلانات',
    f_players: 'اللاعبون', f_players_v: 'لاعب واحد أو اثنان على لوحة مفاتيح واحدة',
    f_tech: 'التقنية', f_size: 'الحجم', f_langs: 'لغات اللعبة', f_age: 'العمر',
    f_save: 'التقدّم', f_save_v: 'يُحفظ في متصفّحك',
    note_lang: 'اللعبة تتحدّث الأوكرانية والإنجليزية والنرويجية. مع أي لغة واجهة أخرى تُفتح بالإنجليزية.',
    note_age: 'لكمات كرتونية بلا دم — لكنها لعبة قتال، لذلك نضع 12+. أمّا القصص والاختبارات فلا عنف فيها على الإطلاق.',
    home_t: '🎮 الألعاب',
    home_p: 'مصنوعة في الورشة نفسها التي تصدر منها القصص، لكن بلا أي واجب منزلي.',
    more: 'كل الألعاب →', back: '← رجوع',
    soon: 'ألعاب أخرى قيد العمل.',
  };
  const T = () => G[(C() || {}).ui] || G.en;
  const tt = k => (T()[k] !== undefined ? T()[k] : G.en[k]);

  /* Мова самої гри: своя, якщо вона її знає, інакше англійська. */
  /* Мова гри й мова її власного тексту — одне й те саме: імена бійців, арени
     та кампанія існують лише трьома мовами, які вона знає. Для решти мов
     інтерфейсу беремо англійську, а не ключ замість назви. */
  const own = g => ((g.langs || []).includes((C() || {}).ui) ? (C() || {}).ui : 'en');
  const url = g => g.url + '?lang=' + own(g);
  const nameOf = g => g.name[own(g)] || g.name.en;
  const subOf = g => g.sub[own(g)] || g.sub.en;

  function shotFig(g, file, i) {
    const { h } = C();
    const caps = tt('caps') || [];
    return h('figure', { class: 'gm-shot' },
      h('img', { src: 'img/games/' + file + '.jpg', width: 1280, height: 720, loading: i ? 'lazy' : null, alt: nameOf(g) + ' — ' + (caps[i] || '') }),
      h('figcaption', {}, caps[i] || ''));
  }

  function facts(g) {
    const { h } = C();
    const rows = [
      [tt('f_price'), tt('f_price_v')],
      [tt('f_players'), tt('f_players_v')],
      [tt('f_age'), g.age + '+'],
      [tt('f_langs'), (g.langs || []).map(l => ({ uk: 'Українська', en: 'English', no: 'Norsk' })[l] || l).join(' · ')],
      [tt('f_tech'), g.engine],
      [tt('f_size'), g.size + ' MB'],
      [tt('f_save'), tt('f_save_v')],
    ];
    return h('table', { class: 'gm-facts' }, h('tbody', {}, rows.map(([k, v]) => h('tr', {}, h('th', {}, k), h('td', {}, v)))));
  }

  function playBtn(g, cls = 'btn accent big') {
    const { h } = C();
    return h('a', { class: cls, href: url(g), target: '_blank', rel: 'noopener' }, tt('play'));
  }

  /* ---------------- сторінка #/games ---------------- */
  function render() {
    const K = C(), { h } = K;
    if (K.NO_EXTERNAL) { location.hash = '#/'; return h('div', {}); }
    const body = list().map(g => {
      const L = own(g);
      return h('article', { class: 'gm-game', style: { '--c': g.color } },
        h('header', { class: 'gm-head' },
          h('span', { class: 'gm-ico' }, g.emoji),
          h('div', {}, h('h3', {}, nameOf(g)), h('small', {}, subOf(g))),
          playBtn(g)),
        h('p', { class: 'gm-tab' }, tt('newtab')),
        h('div', { class: 'gm-shots' }, (g.shots || []).map((f, i) => shotFig(g, f, i))),
        h('h4', {}, tt('modes')),
        h('ul', { class: 'gm-modes' }, (g.modes || []).map(m => h('li', {}, m.emoji + ' ' + (m[L] || m.en)))),
        h('h4', {}, tt('facts')),
        facts(g),
        h('p', { class: 'gm-note' }, tt('note_lang')),
        h('p', { class: 'gm-note' }, tt('note_age')),
        h('h4', {}, tt('keys')),
        h('p', {}, g.keys[L] || g.keys.en),
        h('h4', {}, tt('roster')),
        h('div', { class: 'gm-roster' }, (g.roster || []).map(f => {
          const r = f[L] || f.en;
          return h('div', { class: 'gm-fighter' }, h('b', {}, r[0]), h('small', {}, r[1]),
            h('span', {}, '⚡ ' + r[2] + ' — ' + r[3]), h('span', {}, '💥 ' + r[4] + ' — ' + r[5]));
        })),
        h('h4', {}, tt('arenas')),
        h('ul', { class: 'gm-arenas' }, (g.arenas || []).map(a => h('li', {}, a[L] || a.en))),
        h('h4', {}, tt('camp')),
        h('ol', { class: 'gm-camp' }, ((g.camp || {})[L] || (g.camp || {}).en || []).map(([t, s]) => h('li', {}, h('b', {}, t), h('span', {}, s)))),
        h('p', { class: 'row-left' }, playBtn(g)));
    });
    return h('section', { class: 'gm' }, K.pageHead(tt('title')),
      h('p', { class: 'lead-p' }, tt('lead')),
      body,
      h('p', { class: 'hint' }, tt('soon')));
  }

  /* ---------------- категорія «Ігри» на головній ---------------- */
  function homeSection() {
    const K = C(), { h } = K;
    if (K.NO_EXTERNAL || !list().length) return null;
    return h('section', { class: 'gm-home' },
      h('h2', { class: 'sec-title' }, tt('home_t')),
      h('p', { class: 'lead-p' }, tt('home_p')),
      h('div', { class: 'gm-home-grid' }, list().map(g => h('div', { class: 'gm-card', style: { '--c': g.color } },
        h('a', { class: 'gm-card-img', href: url(g), target: '_blank', rel: 'noopener' },
          h('img', { src: 'img/games/' + (g.shots || [])[2] + '.jpg', width: 1280, height: 720, loading: 'lazy', alt: nameOf(g) })),
        h('div', { class: 'gm-card-t' }, h('b', {}, g.emoji + ' ' + nameOf(g)), h('small', {}, subOf(g))),
        h('div', { class: 'row-left' }, playBtn(g, 'btn accent'), h('a', { class: 'btn', href: '#/games' }, tt('more')))))));
  }


  window.KomiksGames = { render, homeSection, text: tt, url, lang: own, name: nameOf };
})();
