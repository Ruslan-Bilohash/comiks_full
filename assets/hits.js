/* Комікс·Lab — 📈 анонімний лічильник відвідувань (api/hit.php). Без кук і сторонніх сервісів:
   надсилаємо лише розділ (#/read → «read»), номер коміксу, мову інтерфейсу, домен, звідки прийшли
   (тільки на першому перегляді), і чи бував тут раніше. Do Not Track / Global Privacy Control,
   file:// і автоматизовані браузери — не рахуємо зовсім. */
(() => {
  'use strict';
  if (typeof document === 'undefined' || typeof location === 'undefined') return;
  if (!/^https?:$/.test(location.protocol)) return;
  const nav = navigator;
  if (nav.doNotTrack === '1' || window.doNotTrack === '1' || nav.globalPrivacyControl === true || nav.webdriver) return;
  // у застосунку (Android) сторінки лежать усередині, а сервер — на сайті: шлемо туди, інакше лічильник мовчить
  const URL_ = (window.KOMIKS_API_BASE || '') + 'api/hit.php';
  const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* приватний режим */ } } };
  let first = true, last = '';
  const send = body => {
    const data = JSON.stringify(body);
    try {
      if (nav.sendBeacon && nav.sendBeacon(URL_, new Blob([data], { type: 'text/plain' }))) return;
    } catch { /* запасний шлях нижче */ }
    fetch(URL_, { method: 'POST', body: data, keepalive: true, credentials: 'omit', headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
  };
  function track() {
    const parts = (location.hash || '#/').replace(/^#\/?/, '').split('/');
    const s = (parts[0] || '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 16);
    const id = (parts[1] || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 16);
    const key = s + '/' + id;
    if (key === last) return;          // той самий екран (перемальовування) — не новий перегляд
    last = key;
    const body = { s, id, l: (store.get('comiks.ui') || '"uk"').replace(/"/g, '').slice(0, 2), ret: store.get('comiks.hitSeen') ? 1 : 0 };
    if (nav.maxTouchPoints > 1) body.tp = 1;                       // iPad у Safari видає себе за Mac — сенсорний екран його видає
    if (/[?&]app=windows(&|$)/.test(location.search)) body.wa = 1; // Windows-застосунок
    if (first) {
      first = false;
      try { const r = document.referrer ? new URL(document.referrer).hostname : ''; if (r && r !== location.hostname) body.r = r; } catch { /* некоректний referrer */ }
      // Соцмережі та ChatGPT часто приховують referrer. Стандартна UTM-мітка
      // дозволяє коректно визначити джерело без кук і сторонньої аналітики.
      try {
        const q = new URLSearchParams(location.search);
        let u = (q.get('utm_source') || '').trim().slice(0, 80);
        if (!u && q.has('igshid')) u = 'instagram';
        if (!u && q.has('li_fat_id')) u = 'linkedin';
        if (!u && q.has('fbclid')) u = 'facebook';
        if (!u && q.has('gclid')) u = 'google';
        if (u) body.u = u;
      } catch { /* старий WebView без URLSearchParams */ }
    }
    send(body);
    store.set('comiks.hitSeen', '1');
  }
  /* 📲 Встановлення: один раз на пристрій, коли сайт уперше відкрито як застосунок — Android-застосунок
     із Google Play (вбудований браузер), «на головний екран» (iPhone, Android), встановлення з браузера
     на комп’ютері, Windows-застосунок (?app=windows). Лише вид пристрою, без людей. */
  const osOf = () => { const ua = nav.userAgent || ''; return /iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && nav.maxTouchPoints > 1) ? 'ios' : /android/i.test(ua) ? 'android' : /windows/i.test(ua) ? 'windows' : /mac os x|macintosh/i.test(ua) ? 'mac' : 'other'; };
  const instKind = () => {
    if (/; wv\)/.test(nav.userAgent || '') || window.Capacitor) return osOf() + '-app';
    if (/[?&]app=windows(&|$)/.test(location.search)) return 'windows-app';
    const sa = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || nav.standalone === true;
    return sa ? osOf() + '-home' : '';
  };
  const sendInst = k => { if (!k || store.get('comiks.instSent')) return; send({ inst: k }); store.set('comiks.instSent', k); };
  sendInst(instKind());
  window.addEventListener('appinstalled', () => sendInst(osOf() + '-home'));
  window.addEventListener('hashchange', track);
  // «зараз на сайті»: легкий сигнал раз на 2 хвилини, поки вкладка видима
  setInterval(() => { if (document.visibilityState === 'visible') send({ hb: 1 }); }, 120000);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', track); else track();
})();
