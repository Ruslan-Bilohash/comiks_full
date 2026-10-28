/* Комікс·Lab — 👨‍👩‍👧 батьки й вчителі бачать прогрес учня (бета).
 * #/watch — «Мої учні»: додати учня за кодом, підсумок по кожному (дні, серія, тести, точність, швидкість,
 *            слова, помилки, граматика), #/watch/<id> — детальний дашборд учня (лише перегляд).
 * shareBox() — блок у кабінеті учня: створити код доступу, хто вже бачить прогрес, прибрати доступ.
 * Сервер — api/watch.php. Доступ дає лише сам учень, кодом на 24 години. */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const API = 'api/watch.php';
  const C = () => window.KomiksCore;
  const T = {
    uk: { title: '👨‍👩‍👧 Мої учні', beta: 'бета', lead: 'Батьки й вчителі бачать, як іде навчання: дні й серії, тести, точність і швидкість, вивчені слова, помилки й граматику. Доступ дає сам учень — кодом зі свого кабінету.',
      add: '➕ Додати учня', code: 'Код від учня', role: 'Я', parent: '👪 батько / мати', teacher: '🎓 вчитель', label: 'Підпис (клас, ім’я)', label_ph: 'Напр.: 5-Б або Даша', go: 'Додати',
      none: 'Поки нікого. Попросіть учня відкрити Кабінет → Навчання → «Доступ для батьків і вчителя» і передати вам код.', detail: '📊 Детально', remove: 'Прибрати',
      days: 'днів', streak: 'серія', tests7: 'тестів за 7 днів', acc: 'точність (30 дн.)', speed: 'с на тест', known: 'слів знає', errs: 'помилок у роботі', due: 'на сьогодні', gram: 'граматика (30 дн.)', time: 'активний час', last: 'був(ла)',
      err_code: 'Код не підійшов або вже минув. Попросіть новий.', err_self: 'Це ваш власний код.', added: n => `✅ ${n} тепер у вашому списку.`, guest: 'Увійдіть в акаунт, щоб бачити учнів.', login: 'Увійти', off: 'Працює на сайті bilohash.com.',
      teacher_hint: 'Ви вчитель? Подайте заявку — отримаєте все безкоштовно для класу.', teacher_go: '🎓 Заявка вчителя', back: '← Мої учні', of: n => `Прогрес: ${n}`,
      sh_title: '👨‍👩‍👧 Доступ для батьків і вчителя', sh_d: 'Створіть код і передайте його батькам чи вчителю — вони побачать ваш прогрес (тести, слова, помилки, дні). Повідомлення, друзі й пошта лишаються приватними.',
      sh_btn: '🔑 Створити код доступу', sh_code: (c) => `Код: ${c}`, sh_exp: 'Діє 24 години і лише один раз.', sh_who: 'Бачать мій прогрес:', sh_none: 'Ніхто.', ago: { now: 'щойно', m: n => `${n} хв тому`, h: n => `${n} год тому`, d: n => `${n} дн. тому` } },
    en: { title: '👨‍👩‍👧 My learners', beta: 'beta', lead: 'Parents and teachers see how learning goes: days and streaks, quizzes, accuracy and speed, learned words, mistakes and grammar. Access is given by the learner — with a code from their account.',
      add: '➕ Add a learner', code: 'Code from the learner', role: 'I am a', parent: '👪 parent', teacher: '🎓 teacher', label: 'Label (class, name)', label_ph: 'E.g. 5B or Dasha', go: 'Add',
      none: 'Nobody yet. Ask the learner to open Account → Learning → “Access for parents and teacher” and give you the code.', detail: '📊 Details', remove: 'Remove',
      days: 'days', streak: 'streak', tests7: 'quizzes in 7 days', acc: 'accuracy (30 d)', speed: 's per quiz', known: 'words known', errs: 'mistakes in progress', due: 'due today', gram: 'grammar (30 d)', time: 'active time', last: 'active',
      err_code: 'The code did not work or has expired. Ask for a new one.', err_self: 'This is your own code.', added: n => `✅ ${n} is now on your list.`, guest: 'Sign in to see your learners.', login: 'Sign in', off: 'Works on bilohash.com.',
      teacher_hint: 'Are you a teacher? Apply — everything is free for your class.', teacher_go: '🎓 Teacher application', back: '← My learners', of: n => `Progress: ${n}`,
      sh_title: '👨‍👩‍👧 Access for parents and teacher', sh_d: 'Create a code and give it to a parent or teacher — they will see your progress (quizzes, words, mistakes, days). Messages, friends and e-mail stay private.',
      sh_btn: '🔑 Create an access code', sh_code: (c) => `Code: ${c}`, sh_exp: 'Valid for 24 hours and only once.', sh_who: 'Can see my progress:', sh_none: 'Nobody.', ago: { now: 'just now', m: n => `${n} min ago`, h: n => `${n} h ago`, d: n => `${n} d ago` } },
    no: { title: '👨‍👩‍👧 Mine elever', beta: 'beta', lead: 'Foreldre og lærere ser hvordan læringen går: dager og rekker, prøver, treff og tempo, lærte ord, feil og grammatikk. Tilgangen gir eleven selv – med en kode fra kontoen sin.',
      add: '➕ Legg til elev', code: 'Kode fra eleven', role: 'Jeg er', parent: '👪 forelder', teacher: '🎓 lærer', label: 'Merke (klasse, navn)', label_ph: 'F.eks. 5B eller Dasha', go: 'Legg til',
      none: 'Ingen ennå. Be eleven åpne Konto → Læring → «Tilgang for foreldre og lærer» og gi deg koden.', detail: '📊 Detaljer', remove: 'Fjern',
      days: 'dager', streak: 'rekke', tests7: 'prøver siste 7 dager', acc: 'treff (30 d)', speed: 's per prøve', known: 'ord kan', errs: 'feil under arbeid', due: 'i dag', gram: 'grammatikk (30 d)', time: 'aktiv tid', last: 'aktiv',
      err_code: 'Koden virket ikke eller er utløpt. Be om en ny.', err_self: 'Dette er din egen kode.', added: n => `✅ ${n} er nå på lista di.`, guest: 'Logg inn for å se elevene dine.', login: 'Logg inn', off: 'Virker på bilohash.com.',
      teacher_hint: 'Er du lærer? Søk – alt er gratis for klassen din.', teacher_go: '🎓 Lærersøknad', back: '← Mine elever', of: n => `Fremgang: ${n}`,
      sh_title: '👨‍👩‍👧 Tilgang for foreldre og lærer', sh_d: 'Lag en kode og gi den til en forelder eller lærer – de ser fremgangen din (prøver, ord, feil, dager). Meldinger, venner og e-post forblir private.',
      sh_btn: '🔑 Lag tilgangskode', sh_code: (c) => `Kode: ${c}`, sh_exp: 'Gjelder i 24 timer og bare én gang.', sh_who: 'Ser fremgangen min:', sh_none: 'Ingen.', ago: { now: 'nå', m: n => `${n} min siden`, h: n => `${n} t siden`, d: n => `${n} d siden` } },
  };
  const tx = () => T[C().ui] || T.en;
  const get = (q) => fetch(API + '?' + q, { credentials: 'same-origin', cache: 'no-store' }).then(r => r.json()).catch(() => null);
  const post = body => fetch(API, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Komiks': '1' }, body: JSON.stringify(body) }).then(r => r.json()).catch(() => null);
  const ago = t => { const L = tx().ago; if (!t) return '—'; const d = Math.max(0, Date.now() / 1000 - t); return d < 90 ? L.now : d < 3600 ? L.m(Math.round(d / 60)) : d < 86400 ? L.h(Math.round(d / 3600)) : L.d(Math.round(d / 86400)); };
  const hours = s => s >= 3600 ? (s / 3600).toFixed(1) + ' h' : Math.round(s / 60) + ' min';

  function render(id) {
    const K = C(); if (!K) return null;
    const { h } = K, L = tx();
    const root = h('section', { class: 'watch' });
    if (!K.currentUser()) {
      root.append(K.pageHead(L.title), h('div', { class: 'box center' }, h('p', {}, L.guest), h('a', { class: 'btn accent', href: '#/login' }, L.login)));
      return root;
    }
    if (id) return detail(root, id);
    const list = h('div', { class: 'w-list' }, h('p', { class: 'muted' }, '…'));
    const msg = h('p', { class: 'w-msg', 'aria-live': 'polite' });
    const code = h('input', { type: 'text', maxlength: 6, placeholder: 'ABC123', autocapitalize: 'characters', class: 'code-input' });
    code.addEventListener('input', () => { code.value = code.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); });
    const role = h('select', {}, h('option', { value: 'parent' }, L.parent), h('option', { value: 'teacher' }, L.teacher));
    const label = h('input', { type: 'text', maxlength: 40, placeholder: L.label_ph });
    const form = h('form', { class: 'box w-add', onsubmit: async e => {
      e.preventDefault(); msg.textContent = '…';
      const j = await post({ action: 'link', code: code.value, role: role.value, label: label.value });
      if (!j || !j.ok) { msg.textContent = j && j.error === 'self' ? L.err_self : L.err_code; msg.classList.add('err'); return; }
      msg.classList.remove('err'); msg.textContent = L.added(j.name); code.value = ''; label.value = ''; load();
    } }, h('h3', {}, L.add),
      h('div', { class: 'w-fields' }, h('label', { class: 'field' }, h('span', {}, L.code), code), h('label', { class: 'field' }, h('span', {}, L.role), role), h('label', { class: 'field' }, h('span', {}, L.label), label)),
      h('button', { class: 'btn accent', type: 'submit' }, L.go), msg);
    const card = x => {
      const s = x.sum || {};
      const cell = (v, l) => h('div', { class: 'w-cell' }, h('b', {}, v === null || v === undefined ? '—' : String(v)), h('small', {}, l));
      return h('article', { class: 'w-card' },
        h('div', { class: 'w-head' }, h('div', {}, h('h3', {}, x.name), h('small', { class: 'muted' }, (x.label ? x.label + ' · ' : '') + (x.role === 'teacher' ? L.teacher : L.parent) + ' · ' + L.last + ': ' + ago(s.last))),
          h('div', { class: 'row-left' }, h('a', { class: 'btn small accent', href: '#/watch/' + x.id }, L.detail),
            h('button', { class: 'btn small', type: 'button', onclick: async () => { if (!confirm(L.remove + '?')) return; await post({ action: 'revoke', id: x.link }); load(); } }, L.remove))),
        h('div', { class: 'w-cells' }, cell(s.days, L.days), cell(s.streak ? '🔥 ' + s.streak : 0, L.streak), cell(s.tests7, L.tests7), cell(s.acc30 === null ? null : s.acc30 + '%', L.acc),
          cell(s.sec, L.speed), cell(s.known, L.known), cell(s.errs, L.errs), cell(s.due, L.due), cell(s.gram === null ? null : s.gram + '%', L.gram), cell(s.usage ? hours(s.usage) : null, L.time)));
    };
    const load = async () => {
      const j = await get('action=learners');
      if (!j || !j.ok) { list.replaceChildren(h('p', { class: 'muted' }, L.off)); return; }
      list.replaceChildren(...(j.learners.length ? j.learners.map(card) : [h('p', { class: 'muted' }, L.none)]));
    };
    load();
    root.append(K.pageHead(L.title + ' · ' + L.beta), h('p', { class: 'lead-p' }, L.lead), form, list,
      h('p', { class: 'hint w-teacher' }, L.teacher_hint, ' ', h('a', { class: 'btn small', href: '#/teacher' }, L.teacher_go)));
    return root;
  }
  // детальний дашборд учня — той самий, що в кабінеті, але з його даними й без кнопок дій
  function detail(root, id) {
    const K = C(), { h } = K, L = tx();
    root.append(h('div', { class: 'row-left' }, h('a', { class: 'btn', href: '#/watch' }, L.back)), h('p', { class: 'muted' }, '…'));
    get('action=learner&id=' + encodeURIComponent(id)).then(j => {
      if (!j || !j.ok) { root.lastChild.textContent = L.err_code; return; }
      const data = j.data || {};
      const store = { get: (k, d) => (k in data && data[k] !== null ? data[k] : d) };
      root.lastChild.replaceWith(window.KomiksLearnDash ? window.KomiksLearnDash.render({ store, readonly: true, title: L.of(j.name + (j.label ? ' · ' + j.label : '')) }) : h('p', {}, '—'));
    });
    return root;
  }
  // блок у кабінеті учня
  function shareBox() {
    const K = C(); if (!K || !K.currentUser()) return null;
    const { h } = K, L = tx();
    const out = h('div', { class: 'w-code', 'aria-live': 'polite' });
    const who = h('ul', { class: 'w-who' });
    const loadWho = async () => {
      const j = await get('action=mine');
      if (!j || !j.ok) { who.replaceChildren(h('li', { class: 'muted' }, L.off)); return; }
      who.replaceChildren(...(j.observers.length ? j.observers.map(o => h('li', {}, h('b', {}, o.name), ' · ', o.role === 'teacher' ? L.teacher : L.parent, ' ',
        h('button', { class: 'btn small', type: 'button', onclick: async () => { await post({ action: 'revoke', id: o.id }); loadWho(); } }, L.remove))) : [h('li', { class: 'muted' }, L.sh_none)]));
    };
    loadWho();
    return h('div', { class: 'box w-share' }, h('h3', {}, L.sh_title, ' ', h('small', { class: 'w-beta' }, L.beta)), h('p', { class: 'hint' }, L.sh_d),
      h('button', { class: 'btn accent', type: 'button', onclick: async () => {
        const j = await post({ action: 'code' });
        out.replaceChildren(j && j.ok ? h('div', {}, h('b', { class: 'w-big' }, L.sh_code(j.code)), h('small', {}, L.sh_exp)) : h('p', { class: 'muted' }, L.off));
      } }, L.sh_btn), out, h('h4', {}, L.sh_who), who);
  }
  window.KomiksWatch = { render, shareBox };
})();
