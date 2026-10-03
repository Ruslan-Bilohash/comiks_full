/* Комікс·Lab — 🧩 «Ordkryss»: кросворд із норвезьких слів (#/cross).
 *
 * Навіщо ще одна гра, коли вже є «Пари» й картки: там слово треба впізнати
 * серед показаних, а тут — згадати й написати по літерах. Це різні зусилля,
 * і саме друге закріплює написання: å, ø, æ та подвоєні приголосні перестають
 * бути «якось так».
 *
 * Сітку збираємо самі: перше слово кладемо по центру, кожне наступне чіпляємо
 * до вже розставлених через спільну літеру. Якщо слово нікуди не чіпляється —
 * просто пропускаємо його: краще менша чесна сітка, ніж набір незв'язаних рядів.
 */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const C = () => window.KomiksCore;

  const T = {
    uk: {
      title: '🧩 Кросворд', lead: 'Згадайте норвезьке слово за перекладом і впишіть його по літерах. Так запам’ятовується написання, а не лише вигляд.',
      theme: 'Тема', across: 'Горизонталь', down: 'Вертикаль', check: '✓ Перевірити', again: '🔄 Інший кросворд',
      hint: '💡 Підказка', hint_d: 'Відкрити одну літеру', reveal: '👁️ Показати відповідь',
      done: '🎉 Готово! Усі слова на місці.', part: n => `Ще ${n} — не здавайтеся.`, wrong: 'Червоні літери треба виправити.',
      empty: 'Заповніть хоча б одне слово.', left: n => `Залишилось слів: ${n}`, words: 'слів',
      pick: 'Виберіть тему', back: '← До тем'
    },
    en: {
      title: '🧩 Crossword', lead: 'Recall the Norwegian word from its translation and type it letter by letter. That is what fixes the spelling, not just the look of the word.',
      theme: 'Theme', across: 'Across', down: 'Down', check: '✓ Check', again: '🔄 Another crossword',
      hint: '💡 Hint', hint_d: 'Reveal one letter', reveal: '👁️ Show the answer',
      done: '🎉 Done! Every word is in place.', part: n => `${n} to go — keep at it.`, wrong: 'The red letters need fixing.',
      empty: 'Fill in at least one word.', left: n => `Words left: ${n}`, words: 'words',
      pick: 'Choose a theme', back: '← Back to themes'
    },
    no: {
      title: '🧩 Ordkryss', lead: 'Husk det norske ordet ut fra oversettelsen og skriv det bokstav for bokstav. Det er slik skrivemåten fester seg.',
      theme: 'Tema', across: 'Vannrett', down: 'Loddrett', check: '✓ Sjekk', again: '🔄 Nytt ordkryss',
      hint: '💡 Hint', hint_d: 'Vis én bokstav', reveal: '👁️ Vis svaret',
      done: '🎉 Ferdig! Alle ordene er på plass.', part: n => `${n} igjen – stå på.`, wrong: 'De røde bokstavene må rettes.',
      empty: 'Fyll inn minst ett ord.', left: n => `Ord igjen: ${n}`, words: 'ord',
      pick: 'Velg et tema', back: '← Tilbake til temaene'
    },
    ar: {
      title: '🧩 الكلمات المتقاطعة', lead: 'تذكّر الكلمة النرويجية من ترجمتها واكتبها حرفًا حرفًا. هكذا تثبت طريقة الكتابة لا الشكل فقط.',
      theme: 'الموضوع', across: 'أفقي', down: 'عمودي', check: '✓ تحقق', again: '🔄 لغز آخر',
      hint: '💡 تلميح', hint_d: 'اكشف حرفًا', reveal: '👁️ أظهر الإجابة',
      done: '🎉 أحسنت! كل الكلمات في مكانها.', part: n => `بقي ${n} — واصل.`, wrong: 'الحروف الحمراء تحتاج تصحيحًا.',
      empty: 'املأ كلمة واحدة على الأقل.', left: n => `الكلمات المتبقية: ${n}`, words: 'كلمات',
      pick: 'اختر موضوعًا', back: '← إلى المواضيع'
    }
  };
  const tx = () => T[(C() || {}).ui] || T.en;

  /* Голе слово без артикля: у сітці має стояти «mor», а не «en mor». */
  const bare = no => String(no).replace(/^(en|ei|et)\s+/i, '').trim();
  /* Для сітки лишаємо тільки літери — дефіси й пробіли в клітинки не влазять. */
  const grid = w => bare(w).toLowerCase().replace(/[^a-zæøå]/g, '');

  const SIZE = 13;                       // стільки клітинок уміщається на телефоні

  /* ───────── складання сітки ─────────
     Жадібний алгоритм: кожне наступне слово шукає спільну літеру з уже
     розставленими й стає перпендикулярно. Перевіряємо не лише вільність
     клітинок, а й сусідів — інакше поряд виникають випадкові «слова»
     з двох літер, і кросворд перестає читатися. */
  function build(words) {
    const cells = new Map();             // "x,y" → літера
    const placed = [];
    const key = (x, y) => x + ',' + y;
    const at = (x, y) => cells.get(key(x, y));

    const fits = (w, x, y, dir) => {
      const dx = dir === 'a' ? 1 : 0, dy = dir === 'a' ? 0 : 1;
      // не вилазимо за поле
      if (x < 0 || y < 0 || x + dx * (w.length - 1) >= SIZE || y + dy * (w.length - 1) >= SIZE) return false;
      // клітинки до і після слова мають бути порожні
      if (at(x - dx, y - dy) || at(x + dx * w.length, y + dy * w.length)) return false;
      let touch = 0;
      for (let i = 0; i < w.length; i++) {
        const cx = x + dx * i, cy = y + dy * i, cur = at(cx, cy);
        if (cur) {
          if (cur !== w[i]) return false;
          touch++;
          continue;
        }
        // збоку від вільної клітинки не має бути інших літер
        const sx = dir === 'a' ? 0 : 1, sy = dir === 'a' ? 1 : 0;
        if (at(cx - sx, cy - sy) || at(cx + sx, cy + sy)) return false;
      }
      return touch > 0 || placed.length === 0;
    };

    const put = (item, x, y, dir) => {
      const w = item.g, dx = dir === 'a' ? 1 : 0, dy = dir === 'a' ? 0 : 1;
      for (let i = 0; i < w.length; i++) cells.set(key(x + dx * i, y + dy * i), w[i]);
      placed.push({ ...item, x, y, dir });
    };

    const list = words.slice().sort((a, b) => b.g.length - a.g.length);
    if (!list.length) return { placed: [], cells };
    const first = list.shift();
    put(first, Math.max(0, Math.floor((SIZE - first.g.length) / 2)), Math.floor(SIZE / 2), 'a');

    for (const item of list) {
      let done = false;
      for (const p of placed) {
        if (done) break;
        for (let i = 0; i < p.g.length && !done; i++) {
          for (let j = 0; j < item.g.length && !done; j++) {
            if (p.g[i] !== item.g[j]) continue;
            const dir = p.dir === 'a' ? 'd' : 'a';
            const x = p.dir === 'a' ? p.x + i : p.x - j;
            const y = p.dir === 'a' ? p.y - j : p.y + i;
            if (fits(item.g, x, y, dir)) { put(item, x, y, dir); done = true; }
          }
        }
      }
    }
    return { placed, cells };
  }

  /* Номери як у звичайному кросворді: нумеруємо початки слів зліва направо, згори вниз. */
  function number(placed) {
    const starts = placed.slice().sort((a, b) => a.y - b.y || a.x - b.x);
    const seen = new Map();
    let n = 0;
    for (const p of starts) {
      const k = p.x + ',' + p.y;
      if (!seen.has(k)) { seen.set(k, ++n); }
      p.num = seen.get(k);
    }
    return placed;
  }

  let state = null;

  function makePuzzle(theme) {
    const pool = (theme.words || [])
      .map(w => ({ no: w[0], uk: w[1], en: w[2], emoji: w[3] || '', g: grid(w[0]) }))
      .filter(w => w.g.length >= 3 && w.g.length <= 11);
    const pick = [];
    const copy = pool.slice();
    while (copy.length && pick.length < 10) pick.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    const { placed } = build(pick);
    return { theme, words: number(placed) };
  }

  /* ───────── малювання ───────── */
  function render(arg) {
    const K = C(); if (!K) return null;
    const { h } = K, L = tx();
    const themes = ((window.WORDS || {}).themes || []).filter(t => (t.words || []).length >= 8);
    if (!themes.length) return h('section', {}, h('h1', {}, L.title), h('p', {}, L.pick));

    if (!arg) {
      // вибір теми: та сама сітка, що й у «Словах», щоб не вчити нову навігацію
      return h('section', { class: 'cross-page' },
        K.pageHead ? K.pageHead(L.title) : h('h1', {}, L.title),
        h('p', { class: 'lead-p' }, L.lead),
        h('div', { class: 'theme-grid' }, themes.map(t => h('a', { class: 'theme-card', href: '#/cross/' + t.id },
          h('span', { class: 'theme-ico' }, t.icon || '🧩'),
          h('b', {}, K.ui === 'uk' ? t.uk : K.ui === 'no' ? t.no : t.en),
          h('small', { class: 'muted' }, (t.words || []).length + ' ' + L.words)))));
    }

    const theme = themes.find(t => String(t.id) === String(arg)) || themes[0];
    state = makePuzzle(theme);
    return board(state);
  }

  function board(st) {
    const K = C(); const { h } = K, L = tx();
    const inputs = new Map();                       // "x,y" → <input>
    const minX = Math.min(...st.words.map(w => w.x));
    const minY = Math.min(...st.words.map(w => w.y));
    const maxX = Math.max(...st.words.map(w => w.dir === 'a' ? w.x + w.g.length - 1 : w.x));
    const maxY = Math.max(...st.words.map(w => w.dir === 'd' ? w.y + w.g.length - 1 : w.y));
    const cols = maxX - minX + 1, rows = maxY - minY + 1;

    const msg = h('p', { class: 'cross-msg', role: 'status' });
    const wrap = h('div', { class: 'cross-grid', style: { gridTemplateColumns: `repeat(${cols}, 1fr)` } });

    const cellOf = (x, y) => st.words.some(w => {
      const dx = w.dir === 'a' ? 1 : 0, dy = w.dir === 'a' ? 0 : 1;
      for (let i = 0; i < w.g.length; i++) if (w.x + dx * i === x && w.y + dy * i === y) return true;
      return false;
    });
    const startNo = (x, y) => { const w = st.words.find(w => w.x === x && w.y === y); return w ? w.num : 0; };
    const letterAt = (x, y) => {
      for (const w of st.words) {
        const dx = w.dir === 'a' ? 1 : 0, dy = w.dir === 'a' ? 0 : 1;
        for (let i = 0; i < w.g.length; i++) if (w.x + dx * i === x && w.y + dy * i === y) return w.g[i];
      }
      return '';
    };

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (!cellOf(x, y)) { wrap.append(h('div', { class: 'cc void' })); continue; }
        const inp = h('input', { class: 'cc-in', type: 'text', maxlength: 1, inputmode: 'text',
          autocapitalize: 'none', autocomplete: 'off', spellcheck: 'false', 'aria-label': `${x},${y}` });
        inputs.set(x + ',' + y, inp);
        const n = startNo(x, y);
        /* Друк переводить у наступну клітинку того самого слова — інакше доводиться
           цілити пальцем у кожну, і гра перетворюється на вправу з влучності. */
        inp.addEventListener('input', () => {
          inp.value = (inp.value || '').slice(-1).toLowerCase();
          inp.classList.remove('bad');
          const horiz = inputs.get((x + 1) + ',' + y);
          const vert = inputs.get(x + ',' + (y + 1));
          const next = (inp.dataset.dir === 'd' ? vert : horiz) || horiz || vert;
          if (inp.value && next) next.focus();
        });
        inp.addEventListener('keydown', e => {
          const map = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
          if (map[e.key]) { const [dx, dy] = map[e.key]; const n2 = inputs.get((x + dx) + ',' + (y + dy)); if (n2) { e.preventDefault(); n2.focus(); } }
          if (e.key === 'Backspace' && !inp.value) { const p = inputs.get((x - 1) + ',' + y) || inputs.get(x + ',' + (y - 1)); if (p) { e.preventDefault(); p.focus(); p.value = ''; } }
        });
        wrap.append(h('div', { class: 'cc' }, n ? h('span', { class: 'cc-no' }, n) : null, inp));
      }
    }

    const clue = w => h('li', { class: 'cross-clue', onclick: () => { const i = inputs.get(w.x + ',' + w.y); if (i) { i.dataset.dir = w.dir; i.focus(); } } },
      h('b', {}, w.num + '. '), w.emoji ? h('span', { class: 'cross-emo' }, w.emoji) : null,
      /* Для норвезького інтерфейсу підказка англійською: норвезьке слово — це
         якраз відповідь, і показувати його було б безглуздо. */
      h('span', {}, K.ui === 'uk' ? w.uk : w.en),
      h('small', { class: 'muted' }, ' · ' + w.g.length));

    const across = st.words.filter(w => w.dir === 'a');
    const down = st.words.filter(w => w.dir === 'd');

    /* Слово записуємо в журнал помилок один раз за гру: натиснути «Перевірити»
       можна скільки завгодно, і без цього лічильник роздувся б до безглуздих
       чисел, а «Пари» вважали б одне слово найслабшим місцем усього курсу. */
    const logged = new Set();
    const logBad = w => {
      if (!w || logged.has(w.no)) return;
      logged.add(w.no);
      if (K.errs && K.errs.add) K.errs.add(w.no, w.uk || '', w.en || '', 'cross', L.title || 'Ordkryss');
    };

    const check = () => {
      let filled = 0, wrong = 0, left = 0;
      for (const w of st.words) {
        const dx = w.dir === 'a' ? 1 : 0, dy = w.dir === 'a' ? 0 : 1;
        let ok = true, any = false;
        for (let i = 0; i < w.g.length; i++) {
          const inp = inputs.get((w.x + dx * i) + ',' + (w.y + dy * i));
          const v = (inp.value || '').toLowerCase();
          if (v) any = true;
          if (v !== w.g[i]) { ok = false; if (v) inp.classList.add('bad'); }
        }
        if (any) filled++;
        if (ok) { markDone(w, inputs); } else left++;
        if (!ok && any) { wrong++; logBad(w); }
      }
      if (!filled) { msg.textContent = L.empty; msg.className = 'cross-msg'; return; }
      if (!left) {
        msg.textContent = L.done; msg.className = 'cross-msg ok';
        if (K.day && K.day.mark) K.day.mark('bonus');
        if (window.KomiksSfx && window.KomiksSfx.win) window.KomiksSfx.win();
      } else {
        msg.textContent = (wrong ? L.wrong + ' ' : '') + L.part(left);
        msg.className = 'cross-msg warn';
      }
    };

    const hint = () => {
      // відкриваємо одну порожню літеру — найкоротший шлях зрушити з місця
      const empty = [];
      for (const w of st.words) {
        const dx = w.dir === 'a' ? 1 : 0, dy = w.dir === 'a' ? 0 : 1;
        for (let i = 0; i < w.g.length; i++) {
          const inp = inputs.get((w.x + dx * i) + ',' + (w.y + dy * i));
          if (!inp.value) empty.push([inp, w.g[i], w]);
        }
      }
      if (!empty.length) return;
      const [inp, ch, word] = empty[Math.floor(Math.random() * empty.length)];
      inp.value = ch; inp.classList.add('hinted'); inp.classList.remove('bad');
      /* Попросити літеру — це теж сказати «не згадав». Для журналу помилок це
         не менш цінний сигнал, ніж неправильна відповідь. */
      logBad(word);
    };

    const reveal = () => {
      for (const w of st.words) {
        const dx = w.dir === 'a' ? 1 : 0, dy = w.dir === 'a' ? 0 : 1;
        let had = true;
        for (let i = 0; i < w.g.length; i++) {
          const inp = inputs.get((w.x + dx * i) + ',' + (w.y + dy * i));
          if ((inp.value || '').toLowerCase() !== w.g[i]) had = false;
          inp.value = w.g[i]; inp.classList.remove('bad'); inp.classList.add('hinted');
        }
        /* Записуємо лише те, що людина не розгадала сама: слова, які вже стояли
           правильно, помилками не є. */
        if (!had) logBad(w);
      }
      msg.textContent = ''; msg.className = 'cross-msg';
    };

    return h('section', { class: 'cross-page' },
      h('div', { class: 'row-left' }, h('a', { class: 'btn small', href: '#/cross' }, L.back),
        h('b', { class: 'cross-theme' }, (st.theme.icon || '🧩') + ' ' + (K.ui === 'uk' ? st.theme.uk : K.ui === 'no' ? st.theme.no : st.theme.en))),
      h('div', { class: 'cross-board' }, wrap),
      msg,
      h('div', { class: 'row-center cross-acts' },
        h('button', { class: 'btn accent', type: 'button', onclick: check }, L.check),
        h('button', { class: 'btn', type: 'button', title: L.hint_d, onclick: hint }, L.hint),
        h('button', { class: 'btn', type: 'button', onclick: reveal }, L.reveal),
        h('a', { class: 'btn', href: '#/cross/' + st.theme.id, onclick: () => setTimeout(() => C().route(true), 0) }, L.again)),
      h('div', { class: 'cross-clues' },
        across.length ? h('div', {}, h('h3', {}, L.across), h('ul', {}, across.map(clue))) : null,
        down.length ? h('div', {}, h('h3', {}, L.down), h('ul', {}, down.map(clue))) : null));
  }

  function markDone(w, inputs) {
    const dx = w.dir === 'a' ? 1 : 0, dy = w.dir === 'a' ? 0 : 1;
    for (let i = 0; i < w.g.length; i++) {
      const inp = inputs.get((w.x + dx * i) + ',' + (w.y + dy * i));
      if (inp) { inp.classList.add('good'); inp.classList.remove('bad'); }
    }
  }

  window.KomiksCross = { render, text: k => tx()[k] };
})();
