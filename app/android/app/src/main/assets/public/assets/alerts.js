/* Комікс·Lab — 🔔 сповіщення від друзів (#/alerts).
   Що сюди потрапляє: «ми тепер друзі», «друг пройшов тест», «друг перейшов на рівень B1»
   і «твій результат вподобали». Події складає сервер (api/notify.php) і показує лише друзям —
   тим, кого людина сама підтвердила у списку друзів.
   Кожну подію друга можна вподобати ❤️ — автор побачить це у своїй стрічці. */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const API = 'api/notify.php';
  const C = () => window.KomiksCore;

  const T = {
    uk: { title: '🔔 Сповіщення', nav: '🔔 Сповіщення',
      lead: 'Що встигли твої друзі. Тут видно лише тих, кого ти додав у друзі, — і лише якщо вони дозволили показ профілю.',
      empty: 'Поки тихо. Додай друзів — і побачиш, як вони проходять тести й піднімаються рівнями.',
      friends: '👥 Мої друзі', guest: 'Увійди в акаунт, щоб бачити сповіщення від друзів.', login: 'Увійти',
      k_friend: n => `${n} і ти тепер друзі 🎉`,
      k_quiz: (n, t) => `${n} пройшов тест «${t}»`,
      k_level: (n, l) => `${n} перейшов на рівень ${l} 🏅`,
      k_like: n => `${n} вподобав твій результат ❤️`,
      like: 'Подобається', liked: 'Вже подобається', open: 'Відкрити',
      ago: { now: 'щойно', m: n => `${n} хв тому`, h: n => `${n} год тому`, d: n => `${n} дн тому` },
      off: 'Сповіщення працюють на bilohash.com — тут сервера немає.' },
    en: { title: '🔔 Notifications', nav: '🔔 Notifications',
      lead: 'What your friends have been up to. Only people you added as friends show up here — and only if they allow their profile to be shown.',
      empty: 'Quiet for now. Add friends and you will see them passing tests and moving up levels.',
      friends: '👥 My friends', guest: 'Log in to see notifications from your friends.', login: 'Log in',
      k_friend: n => `${n} and you are friends now 🎉`,
      k_quiz: (n, t) => `${n} passed the test “${t}”`,
      k_level: (n, l) => `${n} reached level ${l} 🏅`,
      k_like: n => `${n} liked your result ❤️`,
      like: 'Like', liked: 'Liked', open: 'Open',
      ago: { now: 'just now', m: n => `${n} min ago`, h: n => `${n} h ago`, d: n => `${n} d ago` },
      off: 'Notifications work on bilohash.com — there is no server here.' },
    no: { title: '🔔 Varsler', nav: '🔔 Varsler',
      lead: 'Hva vennene dine har gjort. Bare de du har lagt til som venner vises her – og bare hvis de har tillatt at profilen vises.',
      empty: 'Stille så langt. Legg til venner, så ser du dem ta prøver og gå opp i nivå.',
      friends: '👥 Vennene mine', guest: 'Logg inn for å se varsler fra vennene dine.', login: 'Logg inn',
      k_friend: n => `${n} og du er venner nå 🎉`,
      k_quiz: (n, t) => `${n} tok prøven «${t}»`,
      k_level: (n, l) => `${n} gikk opp til nivå ${l} 🏅`,
      k_like: n => `${n} likte resultatet ditt ❤️`,
      like: 'Lik', liked: 'Likt', open: 'Åpne',
      ago: { now: 'akkurat nå', m: n => `${n} min siden`, h: n => `${n} t siden`, d: n => `${n} d siden` },
      off: 'Varsler virker på bilohash.com – her finnes ingen server.' },
    ar: { title: '🔔 الإشعارات', nav: '🔔 الإشعارات',
      lead: 'ما فعله أصدقاؤك. يظهر هنا من أضفتهم أصدقاء فقط — وفقط إن سمحوا بعرض ملفهم.',
      empty: 'هادئ حتى الآن. أضف أصدقاء لترى إنجازهم للاختبارات وصعودهم في المستويات.',
      friends: '👥 أصدقائي', guest: 'سجّل الدخول لرؤية إشعارات أصدقائك.', login: 'تسجيل الدخول',
      k_friend: n => `${n} وأنت صديقان الآن 🎉`,
      k_quiz: (n, t) => `${n} أنهى اختبار «${t}»`,
      k_level: (n, l) => `${n} وصل إلى المستوى ${l} 🏅`,
      k_like: n => `${n} أعجبته نتيجتك ❤️`,
      like: 'إعجاب', liked: 'أعجبني', open: 'افتح',
      ago: { now: 'الآن', m: n => `قبل ${n} د`, h: n => `قبل ${n} س`, d: n => `قبل ${n} ي` },
      off: 'تعمل الإشعارات على bilohash.com — لا يوجد خادم هنا.' },
    de: { title: '🔔 Benachrichtigungen', nav: '🔔 Benachrichtigungen',
      lead: 'Was deine Freunde gemacht haben. Hier erscheinen nur Leute, die du als Freunde hinzugefügt hast — und nur, wenn sie ihr Profil zeigen lassen.',
      empty: 'Noch ruhig. Füge Freunde hinzu, dann siehst du, wie sie Tests bestehen und Stufen aufsteigen.',
      friends: '👥 Meine Freunde', guest: 'Melde dich an, um Benachrichtigungen deiner Freunde zu sehen.', login: 'Anmelden',
      k_friend: n => `${n} und du seid jetzt Freunde 🎉`,
      k_quiz: (n, t) => `${n} hat den Test „${t}“ bestanden`,
      k_level: (n, l) => `${n} hat Stufe ${l} erreicht 🏅`,
      k_like: n => `${n} gefällt dein Ergebnis ❤️`,
      like: 'Gefällt mir', liked: 'Gefällt dir', open: 'Öffnen',
      ago: { now: 'gerade eben', m: n => `vor ${n} Min.`, h: n => `vor ${n} Std.`, d: n => `vor ${n} T.` },
      off: 'Benachrichtigungen laufen auf bilohash.com — hier gibt es keinen Server.' },
    pl: { title: '🔔 Powiadomienia', nav: '🔔 Powiadomienia',
      lead: 'Co porabiali twoi znajomi. Pojawiają się tu tylko osoby dodane do znajomych — i tylko jeśli pozwalają pokazywać swój profil.',
      empty: 'Na razie cisza. Dodaj znajomych, a zobaczysz, jak zdają testy i wchodzą na wyższe poziomy.',
      friends: '👥 Moi znajomi', guest: 'Zaloguj się, aby zobaczyć powiadomienia od znajomych.', login: 'Zaloguj się',
      k_friend: n => `${n} i ty jesteście już znajomymi 🎉`,
      k_quiz: (n, t) => `${n} zdał test „${t}”`,
      k_level: (n, l) => `${n} osiągnął poziom ${l} 🏅`,
      k_like: n => `${n} polubił twój wynik ❤️`,
      like: 'Lubię to', liked: 'Polubione', open: 'Otwórz',
      ago: { now: 'przed chwilą', m: n => `${n} min temu`, h: n => `${n} godz. temu`, d: n => `${n} dni temu` },
      off: 'Powiadomienia działają na bilohash.com — tutaj nie ma serwera.' },
    tr: { title: '🔔 Bildirimler', nav: '🔔 Bildirimler',
      lead: 'Arkadaşların neler yapmış. Burada yalnızca arkadaş olarak eklediğin kişiler görünür — üstelik yalnızca profillerinin gösterilmesine izin veriyorlarsa.',
      empty: 'Şimdilik sessiz. Arkadaş ekle, testleri geçişlerini ve seviye atlayışlarını gör.',
      friends: '👥 Arkadaşlarım', guest: 'Arkadaşlarından gelen bildirimleri görmek için giriş yap.', login: 'Giriş yap',
      k_friend: n => `${n} ile artık arkadaşsınız 🎉`,
      k_quiz: (n, t) => `${n}, „${t}” testini geçti`,
      k_level: (n, l) => `${n}, ${l} seviyesine ulaştı 🏅`,
      k_like: n => `${n} sonucunu beğendi ❤️`,
      like: 'Beğen', liked: 'Beğenildi', open: 'Aç',
      ago: { now: 'az önce', m: n => `${n} dk önce`, h: n => `${n} sa önce`, d: n => `${n} gün önce` },
      off: 'Bildirimler bilohash.com üzerinde çalışır — burada sunucu yok.' },
    lt: { title: '🔔 Pranešimai', nav: '🔔 Pranešimai',
      lead: 'Ką veikė tavo draugai. Čia rodomi tik tie, kuriuos įsitraukei į draugus — ir tik jei jie leidžia rodyti savo profilį.',
      empty: 'Kol kas tylu. Pridėk draugų ir matysi, kaip jie išlaiko testus ir kyla lygiais.',
      friends: '👥 Mano draugai', guest: 'Prisijunk, kad matytum draugų pranešimus.', login: 'Prisijungti',
      k_friend: n => `${n} ir tu dabar draugai 🎉`,
      k_quiz: (n, t) => `${n} išlaikė testą „${t}“`,
      k_level: (n, l) => `${n} pasiekė ${l} lygį 🏅`,
      k_like: n => `${n} patiko tavo rezultatas ❤️`,
      like: 'Patinka', liked: 'Patiko', open: 'Atidaryti',
      ago: { now: 'ką tik', m: n => `prieš ${n} min.`, h: n => `prieš ${n} val.`, d: n => `prieš ${n} d.` },
      off: 'Pranešimai veikia bilohash.com — čia serverio nėra.' }
  };
  const tx = () => T[(C() || {}).ui] || T.en;
  const AV = (code, o) => (window.KomiksAvatars ? window.KomiksAvatars.el(code, o) : document.createTextNode(String(code || '🙂').split('|')[0]));

  let unseen = 0, lastCheck = 0;
  const post = body => fetch(API, { method: 'POST', credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'X-Komiks': '1' }, body: JSON.stringify(body) })
    .then(r => r.json()).catch(() => null);
  const feed = () => fetch(API + '?action=feed', { credentials: 'same-origin', cache: 'no-store' })
    .then(r => r.json()).catch(() => null);

  const when = at => {
    const L = tx(), s = Math.max(0, Math.floor(Date.now() / 1000 - at));
    if (s < 90) return L.ago.now;
    if (s < 3600) return L.ago.m(Math.round(s / 60));
    if (s < 86400) return L.ago.h(Math.round(s / 3600));
    return L.ago.d(Math.round(s / 86400));
  };

  function line(it) {
    const L = tx(), n = it.who.name || '?';
    if (it.kind === 'friend') return L.k_friend(n);
    if (it.kind === 'level') return L.k_level(n, it.ref || 'A1');
    if (it.kind === 'like') return L.k_like(n);
    return L.k_quiz(n, it.text || '…');
  }
  // куди веде подія: тест — на сам тест, решта — на профіль друга
  const href = it => (it.kind === 'quiz' && it.ref ? quizHref(it.ref) : (it.who.code ? '#/player/c/' + it.who.code : '#/players'));
  function quizHref(key) {
    const [kind, arg] = String(key).split(':');
    if (kind === 'level') return '#/quiz/level/' + arg;
    if (kind === 'words') return arg ? '#/quiz/words/' + arg : '#/quiz/words';
    if (kind === 'grammar') return arg ? '#/quiz/grammar/' + arg : '#/quiz/grammar';
    if (kind === 'mistakes') return '#/analysis';
    return '#/quiz/' + key;
  }

  function render() {
    const K = C(); if (!K) return null;
    const { h } = K, L = tx();
    const root = h('section', { class: 'alerts-page' }, K.pageHead(L.title), h('p', { class: 'lead-p' }, L.lead));
    const list = h('div', { class: 'al-list' }, h('p', { class: 'muted' }, '…'));
    root.append(list, h('div', { class: 'row-left' }, h('a', { class: 'btn', href: '#/friends' }, L.friends),
      h('a', { class: 'btn', href: '#/players' }, '🔎')));

    if (!K.currentUser()) {
      list.replaceChildren(h('div', { class: 'box center' }, h('p', {}, L.guest),
        h('a', { class: 'btn accent', href: '#/login' }, L.login)));
      return root;
    }

    feed().then(j => {
      if (!j || !j.ok) { list.replaceChildren(h('p', { class: 'muted' }, L.off)); return; }
      unseen = 0; paintBell();
      post({ action: 'seen' });
      if (!j.items.length) { list.replaceChildren(h('div', { class: 'box center' }, h('p', {}, L.empty))); return; }
      list.replaceChildren(...j.items.map(card));
    });

    function card(it) {
      const { h } = C(), L = tx();
      const likeable = it.kind === 'quiz' || it.kind === 'level';
      const count = h('span', { class: 'al-n' }, it.likes ? String(it.likes) : '');
      const btn = likeable ? h('button', { class: 'al-like' + (it.liked ? ' on' : ''), type: 'button',
        title: it.liked ? L.liked : L.like, 'aria-pressed': String(!!it.liked),
        onclick: async () => {
          const r = await post({ action: 'like', id: it.id });
          if (!r || !r.ok) return;
          it.liked = r.liked; it.likes = r.likes;
          btn.classList.toggle('on', !!r.liked);
          btn.setAttribute('aria-pressed', String(!!r.liked));
          count.textContent = r.likes ? String(r.likes) : '';
          C().Sfx.tick();
        } }, '❤️') : null;
      return h('div', { class: 'al-item' + (it.seen ? '' : ' fresh') },
        h('span', { class: 'al-ava' }, AV(it.who.avatar, { size: 46 })),
        h('div', { class: 'al-txt' }, h('b', {}, line(it)), h('small', {}, when(it.at))),
        btn, count, h('a', { class: 'btn small', href: href(it) }, L.open));
    }
    return root;
  }

  /* ---------- дзвіночок у шапці ---------- */
  function paintBell() {
    document.querySelectorAll('.al-bell').forEach(b => {
      b.classList.toggle('has', unseen > 0);
      b.dataset.n = unseen > 9 ? '9+' : String(unseen || '');
    });
  }
  async function check(force) {
    const K = C(); if (!K || !K.currentUser()) return;
    if (!force && Date.now() - lastCheck < 180000) return;
    lastCheck = Date.now();
    const j = await feed();
    if (j && j.ok) { unseen = j.unseen || 0; paintBell(); }
  }
  function bell(cls = 'btn icon') {
    const K = C(); if (!K || !K.currentUser()) return null;
    const b = K.h('a', { class: cls + ' al-bell', href: '#/alerts', title: tx().title }, '🔔');
    setTimeout(() => { check(true); paintBell(); }, 1500);
    return b;
  }

  /* ---------- що розповідаємо друзям ---------- */
  const share = (kind, ref, text) => post({ action: 'share', kind, ref, text: String(text || '').slice(0, 160) });
  const friend = code => post({ action: 'friend', code });

  // дзвіночок ставимо поруч із кнопкою акаунта, щойно вона з'явиться
  function mount() {
    const K = C(); if (!K) return setTimeout(mount, 500);
    const acc = document.getElementById('accBtn');
    if (!acc || !K.currentUser() || document.querySelector('.al-bell')) return;
    const b = bell('btn');
    if (b) acc.before(b);
  }
  if (typeof window !== 'undefined') {
    setTimeout(mount, 1400);
    setInterval(() => check(false), 180000);
    window.addEventListener('hashchange', () => { mount(); check(false); });
  }
  window.KomiksAlerts = { render, bell, share, friend, check, text: k => tx()[k] };
})();
