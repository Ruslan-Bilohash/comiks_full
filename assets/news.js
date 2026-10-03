/* Комікс·Lab — ✨ «Що нового»: журнал оновлень (#/whatsnew).
   Новий запис = новий рядок на початку CHANGELOG. Якщо учень ще не бачив останнього запису,
   у шапці з’являється зірочка, а після відкриття сторінки вона зникає. */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const C = () => window.KomiksCore;
  const T = {
    uk: { title: '✨ Що нового', intro: 'Коротко про останні оновлення Комікс·Lab. Усе працює одразу — нічого встановлювати не треба.', new: 'НОВЕ', older: 'Старіші оновлення', back: '← На головну' },
    en: { title: '✨ What’s new', intro: 'A short log of the latest Komiks·Lab updates. Everything works right away — nothing to install.', new: 'NEW', older: 'Older updates', back: '← Home' },
    no: { title: '✨ Hva er nytt', intro: 'Kort logg over de siste oppdateringene i Komiks·Lab. Alt virker med en gang – ingenting å installere.', new: 'NYTT', older: 'Eldre oppdateringer', back: '← Til forsiden' },
    ar: { title: '✨ ما الجديد', intro: 'سجل قصير لآخر تحديثات Komiks·Lab. كل شيء يعمل فورًا — لا حاجة لتثبيت أي شيء.', new: 'جديد', older: 'تحديثات أقدم', back: '→ الصفحة الرئيسية' }
  };
  const tx = k => (T[C().ui] || T.en)[k];
  // Найновіше — зверху. id має бути унікальним і зростати.
  const CHANGELOG = window.KOMIKS_UPDATES || [];
  const LAST = 'newsSeen';
  const latest = () => (CHANGELOG[0] || {}).id || '';
  const unseen = () => { const K = C(); return K && K.store.get(LAST, '') !== latest(); };
  function markSeen() { const K = C(); if (K) K.store.set(LAST, latest()); const b = document.querySelector('.news-dot'); if (b) b.remove(); }
  function render() {
    const K = C(), { h } = K, ui = K.ui;
    markSeen();
    const fmt = d => { try { return new Date(d).toLocaleDateString(ui === 'uk' ? 'uk-UA' : ui === 'no' ? 'nb-NO' : ui === 'ar' ? 'ar' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return d; } };
    const open = { uk: 'Подивитися', en: 'Take a look', no: 'Se det', ar: 'ألقِ نظرة' }[ui] || 'Take a look';
    const entry = (e, i) => h('article', { class: 'news-item' + (i === 0 ? ' first' : ''), style: { '--i': i } },
      h('div', { class: 'news-when' }, h('span', { class: 'news-ico' }, e.icon || '✨'), h('time', {}, fmt(e.id)), i === 0 ? h('span', { class: 'news-new' }, tx('new')) : null),
      h('ul', {}, (e[ui] || e.en).map(x => h('li', {}, x))),
      h('div', { class: 'news-foot' },
        e.link ? h('a', { class: 'btn small accent', href: e.link }, open) : null,
        h('div', { class: 'news-tags' }, (e.tags || []).map(t => h('a', { class: 'tag', href: '#/players/tag/' + t }, '#' + t)))));
    return h('section', { class: 'news-page' }, K.pageHead(tx('title')), h('p', { class: 'lead-p' }, tx('intro')),
      h('div', { class: 'news-list' }, CHANGELOG.map(entry)),
      h('a', { class: 'btn', href: '#/' }, tx('back')));
  }
  // зірочка в шапці, доки не переглянув
  function mark() {
    const K = C(); if (!K) return setTimeout(mark, 400);
    if (!unseen()) return;
    const acc = document.getElementById('accBtn'); if (!acc || document.querySelector('.news-dot')) return;
    const a = K.h('a', { class: 'btn news-dot', href: '#/whatsnew', title: tx('title') }, '✨');
    acc.before(a);
  }
  setTimeout(mark, 1200);
  window.addEventListener('hashchange', () => { if (location.hash.startsWith('#/whatsnew')) markSeen(); });
  window.KomiksNews = { render, unseen, latest, CHANGELOG };
})();
