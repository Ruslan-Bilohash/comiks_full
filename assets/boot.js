/* 🐞 Помилки JavaScript → журнал у адмінці (🩺 Діагностика → Журнали). Анонімно: текст помилки, файл
   і рядок, розділ сайту та версія збірки; не більше 5 різних помилок за сторінку. Ставимо першим,
   щоб бачити й збої під час завантаження решти файлів. */
(function () {
  if (!/^https?:$/.test(location.protocol) && !window.KOMIKS_API_BASE) return;
  var sent = 0, seen = {};
  function report(k, msg, src, line, col, stack) {
    try {
      msg = String(msg || '').slice(0, 300);
      if (!msg || sent >= 5 || (navigator.webdriver && !/^game: /.test(msg))) return;   // звіт гри про WebRTC — навіть із вбудованих браузерів
      var key = msg + '|' + src + '|' + line;
      if (seen[key]) return;
      seen[key] = 1; sent++;
      var body = JSON.stringify({ k: k, m: msg, s: String(src || '').slice(0, 300), l: line | 0, c: col | 0, st: String(stack || '').slice(0, 1500),
        p: String(location.hash || '#/').slice(0, 120), v: (window.KOMIKS_DATA || {}).version || '' });
      fetch('api/err.php', { method: 'POST', body: body, keepalive: true, credentials: 'omit', headers: { 'Content-Type': 'text/plain' } }).catch(function () {});
    } catch (e) { /* звіт про помилку сам не повинен падати */ }
  }
  window.KomiksReport = report;   // інші модулі можуть самі повідомити про збій (наприклад, гра без WebRTC)
  window.addEventListener('error', function (ev) {
    // невдале завантаження картинки чи скрипта приходить без тексту — такі не шлемо
    if (ev && ev.message) report('e', ev.message, ev.filename, ev.lineno, ev.colno, ev.error && ev.error.stack);
  });
  window.addEventListener('unhandledrejection', function (ev) {
    var r = ev && ev.reason;
    if (r) report('p', (r && r.message) || String(r), '', 0, 0, r && r.stack);
  });
})();

/* Завантажує дані з реєстру data/index.js (паралельно, виконання — по черзі), потім запускає застосунок.
   ?v=<версія> змушує браузер брати свіжі файли після оновлення. Працює і з file://, і на хостингу. */
(function () {
  var reg = window.KOMIKS_DATA || { shared: [], comics: [] };
  var v = reg.version ? '?v=' + encodeURIComponent(reg.version) : '';
  var files = reg.shared.concat(reg.comics.map(function (c) { return c.file; }), ['assets/app.js']);

  /* Написи застосунку німецькою, польською, турецькою та литовською лежать
     окремими файлами приблизно по п'ятдесят кілобайт. Вантажимо лише ту мову,
     яку справді обрали: решті цей вантаж ні до чого.
     Саму підстановку оголошуємо тут, до модулів, і запам'ятовуємо таблиці —
     тоді мову можна додати й пізніше, коли учень перемкне її на льоту, не
     перезавантажуючи сторінку. */
  var PACK = ['de', 'pl', 'tr', 'lt', 'pt', 'ar', 'no'];
  window.KL_T_REG = window.KL_T_REG || [];
  function fill(table, id) {
    var src = (window.KL_T || {})[id];
    if (!src || !table || typeof table.en !== 'object') return;
    for (var lang in src) if (Object.prototype.hasOwnProperty.call(src, lang)) table[lang] = Object.assign({}, table.en, src[lang]);
  }
  window.KL_T_FILL = function (table, id) { window.KL_T_REG.push([table, id]); fill(table, id); };
  window.KL_T_APPLY = function () { window.KL_T_REG.forEach(function (x) { fill(x[0], x[1]); }); };
  window.KL_T_LANGS = PACK;
  var ui = '';
  try { ui = JSON.parse(localStorage.getItem('comiks.ui') || '""'); } catch (e) { ui = ''; }
  if (PACK.indexOf(ui) !== -1) files.unshift('data/app-i18n-' + ui + '.js');

  // завантажуємо всі файли паралельно, а виконуємо строго по черзі (async = false) — сторінка з’являється в рази швидше
  files.forEach(function (f) {
    var s = document.createElement('script');
    s.src = f + v; s.async = false;
    s.onerror = function () { if (window.console) console.warn('Не вдалося завантажити', f); };
    document.body.appendChild(s);
  });
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !/localhost|127\.0\.0\.1/.test(location.hostname)) {
    navigator.serviceWorker.register('sw.js').catch(function () { /* офлайн-режим необов'язковий */ });
  }
})();
