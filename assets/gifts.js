/* Комікс·Lab — 🎁 безкоштовні подарунки друзям (api/gifts.php).
   Подарунок — річ для аватара, яку можна лише отримати від друга (gift: true в avatars.js).
   KomiksGifts.picker(friend) — вікно «що подарувати» з приміркою на аватарі друга;
   вхідні подарунки перевіряються після входу, раз на 3 хвилини і на сторінках друзів/кабінету/студії.
   Віртуальні гравці (боти) теж «дякують» — їхній подарунок у відповідь лишається на цьому пристрої. */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const API = 'api/gifts.php';
  const C = () => window.KomiksCore;
  const AVS = () => window.KomiksAvatars;
  const TX = {
    uk: { btn: '🎁 Подарунок', title: n => `🎁 Подарунок для ${n}`, intro: 'Обери річ для аватара друга — її не можна купити чи виграти, лише отримати в подарунок. Подарунки безкоштовні: одному другові — раз на добу.',
      note: 'Побажання (норвезькою)', send: '🎁 Подарувати', sent: n => `🎁 Подарунок для ${n} уже летить!`, left: n => `Сьогодні можна подарувати ще ${n}`, today: 'Сьогодні ти вже дарував(ла) цьому другові — завтра знову можна 🙂',
      from: n => `🎁 Подарунок від ${n}!`, open: 'Відкрити', got: 'Нова річ для аватара!', wear: '👕 Надягнути', later: 'Пізніше', thank: '🎁 Віддячити', close: 'Закрити',
      err: { not_friend: 'Друг ще не підтвердив дружбу — подарунок дійде, щойно ви станете друзями.', today: 'Сьогодні ти вже дарував(ла) цьому другові.', limit: 'На сьогодні подарунки скінчилися — завтра будуть нові.', unverified: 'Підтвердь пошту, щоб дарувати подарунки.', demo: 'У демо-акаунті подарунків немає.', net: 'Немає зв’язку із сервером. Спробуй пізніше.', login: 'Увійди в акаунт, щоб дарувати подарунки.' } },
    en: { btn: '🎁 Gift', title: n => `🎁 A gift for ${n}`, intro: 'Pick an item for your friend’s avatar — it cannot be bought or won, only given. Gifts are free: one per friend per day.',
      note: 'A wish (in Norwegian)', send: '🎁 Give', sent: n => `🎁 Your gift to ${n} is on its way!`, left: n => `You can give ${n} more today`, today: 'You already gave this friend a gift today — try again tomorrow 🙂',
      from: n => `🎁 A gift from ${n}!`, open: 'Open', got: 'A new avatar item!', wear: '👕 Wear it', later: 'Later', thank: '🎁 Give one back', close: 'Close',
      err: { not_friend: 'Your friend has not confirmed the friendship yet — gifts arrive once you are friends.', today: 'You already gave this friend a gift today.', limit: 'No more gifts today — new ones tomorrow.', unverified: 'Confirm your email to give gifts.', demo: 'Demo accounts cannot give gifts.', net: 'No connection to the server. Try again later.', login: 'Log in to give gifts.' } },
    no: { btn: '🎁 Gave', title: n => `🎁 En gave til ${n}`, intro: 'Velg en ting til vennens figur – den kan ikke kjøpes eller vinnes, bare gis. Gavene er gratis: én per venn per dag.',
      note: 'En hilsen', send: '🎁 Gi', sent: n => `🎁 Gaven til ${n} er på vei!`, left: n => `Du kan gi ${n} til i dag`, today: 'Du har allerede gitt denne vennen en gave i dag – prøv igjen i morgen 🙂',
      from: n => `🎁 En gave fra ${n}!`, open: 'Åpne', got: 'En ny ting til figuren!', wear: '👕 Ta på', later: 'Senere', thank: '🎁 Gi tilbake', close: 'Lukk',
      err: { not_friend: 'Vennen har ikke bekreftet vennskapet ennå – gaven kommer når dere er venner.', today: 'Du har allerede gitt denne vennen en gave i dag.', limit: 'Ingen flere gaver i dag – nye i morgen.', unverified: 'Bekreft e-posten for å gi gaver.', demo: 'Demokontoer kan ikke gi gaver.', net: 'Ingen forbindelse med serveren. Prøv igjen senere.', login: 'Logg inn for å gi gaver.' } },
    ar: { btn: '🎁 هدية', title: n => `🎁 هدية لـ ${n}`, intro: 'اختر قطعة لشخصية صديقك — لا تُشترى ولا تُربح، بل تُهدى فقط. الهدايا مجانية: هدية لكل صديق يوميًا.',
      note: 'تمنٍّ (بالنرويجية)', send: '🎁 أهدِ', sent: n => `🎁 هديتك إلى ${n} في الطريق!`, left: n => `يمكنك إهداء ${n} اليوم`, today: 'أهديت هذا الصديق اليوم — حاول غدًا 🙂',
      from: n => `🎁 هدية من ${n}!`, open: 'افتح', got: 'قطعة جديدة لشخصيتك!', wear: '👕 ارتدِها', later: 'لاحقًا', thank: '🎁 ردّ الهدية', close: 'إغلاق',
      err: { not_friend: 'لم يؤكّد صديقك الصداقة بعد — تصل الهدية حين تصبحان صديقين.', today: 'أهديت هذا الصديق اليوم.', limit: 'انتهت هدايا اليوم — هدايا جديدة غدًا.', unverified: 'أكّد بريدك لتهدي.', demo: 'لا هدايا في الحساب التجريبي.', net: 'لا اتصال بالخادم. حاول لاحقًا.', login: 'سجّل الدخول لتهدي.' } }
  };
  if (window.KL_T_FILL) KL_T_FILL(TX, 'gifts.js:TX');
  const tx = (k, ...a) => { const t = TX[C().ui] || TX.en; const v = k in t ? t[k] : TX.en[k]; return typeof v === 'function' ? v(...a) : v; };
  // готові побажання норвезькою (номер іде на сервер) — заодно маленький урок
  const NOTES = [
    ['Takk for at du er vennen min!', 'Дякую, що ти мій друг!', 'Thank you for being my friend!'],
    ['Lykke til med norsken!', 'Успіхів із норвезькою!', 'Good luck with your Norwegian!'],
    ['Du er best!', 'Ти найкращий!', 'You are the best!'],
    ['God helg!', 'Гарних вихідних!', 'Have a nice weekend!'],
    ['Gratulerer!', 'Вітаю!', 'Congratulations!'],
    ['Hei hei, vi spilles!', 'Привіт, пограємо!', 'Hi, let’s play soon!']
  ];
  const authed = () => !!(window.KomiksAuth && window.KomiksAuth.server && window.KomiksAuth.user);
  const isBot = code => !!(window.KomiksBots && window.KomiksBots.isBot && window.KomiksBots.isBot(code));
  const get = () => fetch(API + '?action=inbox', { credentials: 'same-origin', cache: 'no-store' }).then(r => r.json()).catch(() => ({ ok: false, error: 'net' }));
  const post = body => fetch(API, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Komiks': '1' }, body: JSON.stringify(body) }).then(r => r.json()).catch(() => ({ ok: false, error: 'net' }));
  const itemOf = key => { const [slot, id] = String(key || '').split(':'); const A = AVS(); const it = A && A.catalog[slot] && A.catalog[slot][id]; return it ? { slot, id, it } : null; };
  const label = it => it[C().ui] || it.en || it.uk;
  let sentToday = new Set(), left = null;

  // річ стає твоєю назавжди: той самий список, що й нагороди з ігор
  function unlock(slot, id) {
    const K = C(), u = K.store.get('unlockedItems', []) || [];
    if (!u.includes(slot + ':' + id)) K.store.set('unlockedItems', [slot + ':' + id, ...u].slice(0, 400));
  }
  const modal = card => { const box = C().h('div', { class: 'free-modal gift-modal', role: 'dialog', 'aria-modal': 'true' }, card); document.body.append(box); return box; };

  /* ---------- 🎁 подарувати ---------- */
  function picker(friend) {
    const K = C(), { h } = K, A = AVS();
    if (!A) return;
    if (!isBot(friend.code) && !authed()) { K.toast ? K.toast(tx('err').login) : alert(tx('err').login); return; }
    const base = A.parse(friend.avatar || '🙂');
    let pick = A.gifts[0], note = 0;
    const preview = h('div', { class: 'gift-preview' });
    const msg = h('p', { class: 'gift-msg', role: 'status' });
    const tryOn = ([slot, id]) => A.encode(Object.assign({}, base, { [slot]: id }));
    const drawPreview = () => preview.replaceChildren(A.el(tryOn(pick), { size: 150, mood: 'cheer' }));
    const grid = h('div', { class: 'gift-grid' });
    const drawGrid = () => grid.replaceChildren(...A.gifts.map(g => {
      const it = A.catalog[g[0]][g[1]];
      return h('button', { type: 'button', class: 'gift-item' + (g === pick ? ' on' : ''), 'aria-pressed': String(g === pick), onclick: () => { pick = g; drawGrid(); drawPreview(); } },
        A.el(tryOn(g), { size: 64 }), h('small', {}, label(it)));
    }));
    const notes = h('div', { class: 'gift-notes' });
    const drawNotes = () => notes.replaceChildren(...NOTES.map((n, i) => h('button', { type: 'button', class: 'gift-note' + (i === note ? ' on' : ''), onclick: () => { note = i; drawNotes(); } },
      h('b', {}, n[0]), h('small', {}, C().ui === 'uk' ? n[1] : n[2]))));
    const already = sentToday.has(friend.code);
    const sendBtn = h('button', { class: 'btn accent big', type: 'button', disabled: already }, tx('send'));
    const close = () => box.remove();
    sendBtn.addEventListener('click', async () => {
      sendBtn.disabled = true;
      if (isBot(friend.code)) { botThanks(friend); fly(preview); setTimeout(close, 900); return; }
      const r = await post({ action: 'send', code: friend.code, item: pick.join(':'), note });
      if (!r.ok) { msg.textContent = tx('err')[r.error] || tx('err').net; sendBtn.disabled = r.error === 'today'; return; }
      sentToday.add(friend.code); left = r.left;
      K.Sfx.win(); fly(preview);
      msg.textContent = tx('sent', friend.name || friend.code);
      setTimeout(close, 1400);
    });
    drawPreview(); drawGrid(); drawNotes();
    const box = modal(h('div', { class: 'free-card gift-card' },
      h('button', { class: 'gift-x', type: 'button', 'aria-label': tx('close'), onclick: () => close() }, '✕'),
      h('h2', {}, tx('title', friend.name || friend.code)), h('p', { class: 'hint' }, tx('intro')),
      h('div', { class: 'gift-body' }, preview, h('div', {}, grid, h('h4', {}, tx('note')), notes)),
      already ? h('p', { class: 'gift-msg' }, tx('today')) : left != null ? h('p', { class: 'hint' }, tx('left', left)) : null,
      h('div', { class: 'row-center' }, sendBtn), msg));
    box.addEventListener('click', e => { if (e.target === box) close(); });
  }
  // коробка злітає з вікна — маленька радість відправника
  function fly(from) {
    const r = from.getBoundingClientRect();
    const b = C().h('span', { class: 'gift-fly', 'aria-hidden': 'true' }, '🎁');
    b.style.left = (r.left + r.width / 2) + 'px'; b.style.top = (r.top + r.height / 2) + 'px';
    document.body.append(b); setTimeout(() => b.remove(), 1300);
  }
  // бот дякує подарунком у відповідь (раз на добу від кожного бота, лише на цьому пристрої)
  function botThanks(friend) {
    const K = C(), A = AVS(), day = new Date().toISOString().slice(0, 10);
    const log = K.store.get('botGifts', {}) || {};
    if (log[friend.code] === day) return;
    K.store.set('botGifts', Object.assign({}, log, { [friend.code]: day }));
    const [slot, id] = K.pick(A.gifts);
    setTimeout(() => showGift({ id: 0, item: slot + ':' + id, note: K.pick([0, 1, 2]), from: { name: friend.name, code: friend.code, avatar: friend.avatar } }, () => unlock(slot, id)), 2600);
  }

  /* ---------- 📬 отримати ---------- */
  let showing = false;
  function showGift(g, onOpen) {
    const K = C(), { h } = K, A = AVS();
    const got = itemOf(g.item); if (!got || !A) return;
    showing = true;
    const me = window.KomiksProfile ? window.KomiksProfile.avatar() : '🦊';
    const tryOn = A.encode(Object.assign({}, A.parse(me), { [got.slot]: got.id }));
    const n = NOTES[g.note] || NOTES[0];
    const stage = h('div', { class: 'rw-stage gift-stage' }, h('div', { class: 'rw-chest gift-box' }, h('span', { class: 'rw-lid' }), h('span', { class: 'rw-box' }), h('span', { class: 'rw-glow' })));
    const done = () => { box.remove(); showing = false; setTimeout(check, 400); };
    const card = h('div', { class: 'free-card rw-card gift-card' },
      h('div', { class: 'gift-from' }, A.el(g.from.avatar || '🙂', { size: 64, mood: 'cheer' }), h('h2', {}, tx('from', g.from.name || g.from.code))),
      h('p', { class: 'gift-wish' }, '«' + n[0] + '»', h('small', {}, K.ui === 'uk' ? n[1] : n[2])),
      stage, h('button', { class: 'btn accent big', type: 'button', onclick: open }, tx('open')));
    const box = modal(card);
    K.Sfx.tick();
    async function open() {
      if (g.id) { const r = await post({ action: 'open', id: g.id }); if (!r.ok) { done(); return; } }
      unlock(got.slot, got.id); if (onOpen) onOpen();
      stage.classList.add('open'); K.Sfx.win(); if (K.confetti) K.confetti();
      try { K.Speech.speak(n[0], 'narrator'); } catch { /* без звуку */ }
      setTimeout(() => {
        card.replaceChildren(h('h2', {}, tx('got')), h('div', { class: 'rw-show' }, A.el(tryOn, { size: 170, mood: 'cheer' })),
          h('b', { class: 'rw-name' }, label(got.it) + ' 🎁'),
          h('div', { class: 'row-center' },
            h('button', { class: 'btn accent', type: 'button', onclick: () => { if (window.KomiksProfile) window.KomiksProfile.setAvatar(tryOn); done(); } }, tx('wear')),
            h('button', { class: 'btn', type: 'button', onclick: () => { done(); picker(g.from); } }, tx('thank')),
            h('button', { class: 'btn', type: 'button', onclick: done }, tx('later'))));
      }, 900);
    }
  }
  let lastCheck = 0;
  async function check(force) {
    if (showing || !authed() || document.hidden) return;
    if (!force && Date.now() - lastCheck < 20000) return;
    lastCheck = Date.now();
    const j = await get();
    if (!j || !j.ok) return;
    sentToday = new Set(j.sent || []); left = j.left;
    if (j.gifts && j.gifts.length && !document.body.classList.contains('in-game')) showGift(j.gifts[0]);
  }
  if (typeof window.addEventListener === 'function') {
    window.addEventListener('hashchange', () => { if (/^#\/(friends|account|avatar)/.test(location.hash)) check(true); });
    setInterval(() => check(), 180000);
    // перша перевірка — коли сервер уже сказав, хто ввійшов
    const first = () => { if (window.KomiksAuth && window.KomiksAuth.ready) Promise.resolve(window.KomiksAuth.ready()).then(() => setTimeout(() => check(true), 2500)); else setTimeout(first, 500); };
    first();
  }
  // кнопка для картки друга
  const button = (friend, cls = 'btn') => C().h('button', { class: cls + ' gift-btn' + (sentToday.has(friend.code) ? ' done' : ''), type: 'button', title: tx('btn'), onclick: () => picker(friend) }, tx('btn'));
  window.KomiksGifts = { picker, button, check, text: tx };
})();
