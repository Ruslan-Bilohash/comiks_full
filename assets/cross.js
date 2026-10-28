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
      title: '🧩 Кросворд', lead: 'Подивіться на картинку, згадайте норвезьке слово й впишіть його по літерах. Так запам’ятовується написання, а не лише вигляд.',
      theme: 'Тема', across: 'Горизонталь', down: 'Вертикаль', check: '✓ Перевірити', again: '🔄 Інший кросворд',
      hint: '💡 Підказка', hint_d: 'Відкрити одну літеру', reveal: '👁️ Показати відповідь',
      done: '🎉 Готово! Усі слова на місці.', part: n => `Ще ${n} — не здавайтеся.`, wrong: 'Червоні літери треба виправити.',
      empty: 'Заповніть хоча б одне слово.', left: n => `Залишилось слів: ${n}`, words: 'слів',
      pick: 'Виберіть тему', back: '← До тем',
      how: 'Подивіться на картинку, згадайте норвезьке слово й впишіть його в клітинки з тим самим номером. Натисніть на картку — і курсор стане на початок слова.',
      first: '🔤 Підказка: перша літера в кожному слові', listen: 'Послухати слово', prev: 'Попереднє слово', next: 'Наступне слово', letters: 'літер'
    },
    en: {
      title: '🧩 Crossword', lead: 'Look at the picture, recall the Norwegian word and type it letter by letter. That is what fixes the spelling, not just the look of the word.',
      theme: 'Theme', across: 'Across', down: 'Down', check: '✓ Check', again: '🔄 Another crossword',
      hint: '💡 Hint', hint_d: 'Reveal one letter', reveal: '👁️ Show the answer',
      done: '🎉 Done! Every word is in place.', part: n => `${n} to go — keep at it.`, wrong: 'The red letters need fixing.',
      empty: 'Fill in at least one word.', left: n => `Words left: ${n}`, words: 'words',
      pick: 'Choose a theme', back: '← Back to themes',
      how: 'Look at the picture, recall the Norwegian word and type it into the squares with the same number. Tap a card and the cursor jumps to the start of the word.',
      first: '🔤 Hint: first letter of every word', listen: 'Listen to the word', prev: 'Previous word', next: 'Next word', letters: 'letters'
    },
    no: {
      title: '🧩 Ordkryss', lead: 'Se på bildet, husk det norske ordet og skriv det bokstav for bokstav. Det er slik skrivemåten fester seg.',
      theme: 'Tema', across: 'Vannrett', down: 'Loddrett', check: '✓ Sjekk', again: '🔄 Nytt ordkryss',
      hint: '💡 Hint', hint_d: 'Vis én bokstav', reveal: '👁️ Vis svaret',
      done: '🎉 Ferdig! Alle ordene er på plass.', part: n => `${n} igjen – stå på.`, wrong: 'De røde bokstavene må rettes.',
      empty: 'Fyll inn minst ett ord.', left: n => `Ord igjen: ${n}`, words: 'ord',
      pick: 'Velg et tema', back: '← Tilbake til temaene',
      how: 'Se på bildet, husk det norske ordet og skriv det i rutene med samme nummer. Trykk på et kort, så hopper markøren til starten av ordet.',
      first: '🔤 Hint: første bokstav i hvert ord', listen: 'Hør ordet', prev: 'Forrige ord', next: 'Neste ord', letters: 'bokstaver'
    },
    ar: {
      title: '🧩 الكلمات المتقاطعة', lead: 'انظر إلى الصورة وتذكّر الكلمة النرويجية واكتبها حرفًا حرفًا. هكذا تثبت طريقة الكتابة لا الشكل فقط.',
      theme: 'الموضوع', across: 'أفقي', down: 'عمودي', check: '✓ تحقق', again: '🔄 لغز آخر',
      hint: '💡 تلميح', hint_d: 'اكشف حرفًا', reveal: '👁️ أظهر الإجابة',
      done: '🎉 أحسنت! كل الكلمات في مكانها.', part: n => `بقي ${n} — واصل.`, wrong: 'الحروف الحمراء تحتاج تصحيحًا.',
      empty: 'املأ كلمة واحدة على الأقل.', left: n => `الكلمات المتبقية: ${n}`, words: 'كلمات',
      pick: 'اختر موضوعًا', back: '← إلى المواضيع',
      how: 'انظر إلى الصورة وتذكّر الكلمة النرويجية واكتبها في المربعات التي تحمل الرقم نفسه. اضغط على البطاقة لينتقل المؤشر إلى بداية الكلمة.',
      first: '🔤 تلميح: الحرف الأول من كل كلمة', listen: 'استمع إلى الكلمة', prev: 'الكلمة السابقة', next: 'الكلمة التالية', letters: 'أحرف'
    }
  };
  if (window.KL_T_FILL) KL_T_FILL(T, 'cross.js:T');
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
  const Pics = () => window.KomiksPics;
  const hasPic = w => { const P = Pics(); return !!(P && P.photo && P.photo(w.no, w.uk)); };
  /* Мініатюра слова: фото, мальована іконка або хоча б емодзі. Саме картинка
     робить кросворд зрозумілим: переклад — це ще одне слово, яке треба прочитати,
     а малюнок дитина впізнає одразу. */
  const thumb = (K, w, size) => {
    const P = Pics();
    const el = P && P.el ? P.el(w.no, size, w.uk) : null;
    if (el) return el;
    return K.h('span', { class: 'cross-emo', style: { fontSize: Math.round(size * 0.62) + 'px' } }, w.emoji || '❓');
  };

  /* «Перша літера в кожному слові» — вмикається перемикачем і запам'ятовується. */
  const FIRST_KEY = 'comiks.crossFirst';
  const firstOn = () => { try { return localStorage.getItem(FIRST_KEY) === '1'; } catch { return false; } };
  const setFirst = on => { try { localStorage.setItem(FIRST_KEY, on ? '1' : '0'); } catch { /* приватне вікно */ } };

  function makePuzzle(theme) {
    const pool = (theme.words || [])
      .map(w => ({ no: w[0], uk: w[1], en: w[2], emoji: w[3] || '', g: grid(w[0]) }))
      .filter(w => w.g.length >= 3 && w.g.length <= 11);
    for (const w of pool) w.pic = hasPic(w);
    /* Два слова з однаковим перекладом («батьки») чи однаковим написанням
       зробили б кросворд нерозв'язним без вгадування — лишаємо одне. */
    const seen = new Set();
    const uniq = pool.sort((a, b) => b.pic - a.pic).filter(w => {
      const a = 'g:' + w.g, b = 'u:' + String(w.uk).toLowerCase().trim();
      if (seen.has(a) || seen.has(b)) return false;
      seen.add(a); seen.add(b); return true;
    });
    /* Слова з картинками — першими: кросворд за малюнками читається без перекладу.
       Сітку складаємо кілька разів і беремо ту, де вмістилося найбільше слів. */
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    let best = null;
    for (let t = 0; t < 14; t++) {
      const withPic = shuffle(uniq.filter(w => w.pic)), rest = shuffle(uniq.filter(w => !w.pic));
      const pick = withPic.concat(rest).slice(0, 12);
      const { placed } = build(pick);
      const score = Math.min(placed.length, 10) * 10 + placed.filter(w => w.pic).length;
      if (!best || score > best.score) best = { score, placed };
      if (placed.length >= 10 && placed.every(w => w.pic || !withPic.length)) break;
    }
    return { theme, words: number(best.placed.slice(0, 10)) };
  }

  /* ───────── малювання ───────── */
  function render(arg) {
    const K = C(); if (!K) return null;
    const { h } = K, L = Object.assign({}, T.en, tx());
    const themes = ((window.WORDS || {}).themes || []).filter(t => (t.words || []).length >= 8);
    if (!themes.length) return h('section', {}, h('h1', {}, L.title), h('p', {}, L.pick));

    if (!arg) {
      // вибір теми: плитки як у «Словах» — з першою картинкою теми замість емодзі
      const P = Pics();
      const cover = t => {
        const w = P && P.photo ? t.words.find(x => P.photo(x[0], x[1])) : null;
        return (w && P.el(w[0], 46, w[1])) || (t.icon || '🧩');
      };
      return h('section', { class: 'cross-page' },
        K.pageHead ? K.pageHead(L.title) : h('h1', {}, L.title),
        h('p', { class: 'lead-p' }, L.lead),
        h('div', { class: 'theme-grid' }, themes.map(t => h('a', { class: 'theme-tile', href: '#/cross/' + t.id },
          h('span', { class: 'tt-ico' }, cover(t)),
          h('b', {}, K.ui === 'uk' ? t.uk : K.ui === 'no' ? t.no : t.en),
          h('small', { class: 'muted' }, (t.words || []).length + ' ' + L.words)))));
    }

    const theme = themes.find(t => String(t.id) === String(arg)) || themes[0];
    state = makePuzzle(theme);
    return board(state);
  }

  function board(st) {
    const K = C(); const { h } = K, L = Object.assign({}, T.en, tx());
    const inputs = new Map();                       // "x,y" → <input>
    const step = w => w.dir === 'a' ? [1, 0] : [0, 1];
    const wordsAt = (x, y) => st.words.filter(w => { const [dx, dy] = step(w); for (let i = 0; i < w.g.length; i++) if (w.x + dx * i === x && w.y + dy * i === y) return true; return false; });
    /* Як у дитячих кросвордах: мініатюра стоїть у клітинці просто перед словом
       (ліворуч від горизонтального, над вертикальним). build() і так тримає цю
       клітинку порожньою; якщо її хочуть два слова — дістається першому, а друге
       лишається з карткою під сіткою. */
    const picCells = new Map();                     // "x,y" → слово
    for (const w of st.words.slice().sort((a, b) => a.num - b.num)) {
      const [dx, dy] = step(w), k = (w.x - dx) + ',' + (w.y - dy);
      if (!picCells.has(k) && !wordsAt(w.x - dx, w.y - dy).length) picCells.set(k, w);
    }
    const xs = [], ys = [];
    for (const w of st.words) { const [dx, dy] = step(w); xs.push(w.x, w.x + dx * (w.g.length - 1)); ys.push(w.y, w.y + dy * (w.g.length - 1)); }
    for (const k of picCells.keys()) { const [x, y] = k.split(',').map(Number); xs.push(x); ys.push(y); }
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const cols = maxX - minX + 1;

    const msg = h('p', { class: 'cross-msg', role: 'status' });
    const wrap = h('div', { class: 'cross-grid', style: { gridTemplateColumns: `repeat(${cols}, 1fr)` } });
    const cellsOf = w => { const [dx, dy] = step(w); return w.g.split('').map((_, i) => inputs.get((w.x + dx * i) + ',' + (w.y + dy * i))); };
    // підказка для норвезького інтерфейсу — англійською: норвезьке слово і є відповіддю
    const meaning = w => K.ui === 'uk' ? w.uk : w.en;
    const arrow = w => w.dir === 'a' ? '→' : '↓';

    let active = null, curDir = 'a';
    const cards = new Map();                        // слово → картка підказки

    /* Головна підказка над сіткою: велика картинка слова, яке зараз пишемо.
       Над сіткою, а не під нею — на телефоні клавіатура закриває низ екрана. */
    const nowPic = h('div', { class: 'cn-pic' });
    const nowNo = h('b', { class: 'cn-no' });
    const nowTr = h('span', { class: 'cn-tr' });
    const nowBoxes = h('span', { class: 'cn-boxes', 'aria-hidden': 'true' });
    const say = () => { if (active && K.Speech) K.claim().then(() => K.Speech.speak(active.no, 'narrator', { rate: 0.9 })); };
    const go = d => {
      const list = st.words.slice().sort((a, b) => a.num - b.num || (a.dir === 'a' ? -1 : 1));
      const i = Math.max(0, list.indexOf(active));
      focusWord(list[(i + d + list.length) % list.length]);
    };
    const now = h('div', { class: 'cross-now' },
      h('button', { class: 'cn-nav', type: 'button', 'aria-label': L.prev, onclick: () => go(-1) }, '‹'),
      nowPic,
      h('div', { class: 'cn-txt' }, h('div', {}, nowNo, nowTr), nowBoxes),
      h('button', { class: 'cn-say', type: 'button', title: L.listen, 'aria-label': L.listen, onclick: say }, '🔊'),
      h('button', { class: 'cn-nav', type: 'button', 'aria-label': L.next, onclick: () => go(1) }, '›'));

    const boxes = (w, size) => cellsOf(w).map(inp => h('i', { class: inp && inp.value ? (inp.classList.contains('given') ? 'on given' : 'on') : '' }, size && inp && inp.value ? inp.value : ''));

    const refresh = () => {
      for (const [w, card] of cards) {
        const b = card.querySelector('.cl-boxes'); if (b) b.replaceChildren(...boxes(w, true));
        card.classList.toggle('on', w === active);
        card.classList.toggle('solved', cellsOf(w).every((inp, i) => (inp.value || '') === w.g[i]) && cellsOf(w).every(inp => inp.classList.contains('good')));
      }
      for (const inp of inputs.values()) inp.parentNode.classList.remove('lit');
      for (const b of wrap.querySelectorAll('.cc-pic')) b.classList.toggle('lit', !!active && b.dataset.w === active.num + active.dir);
      if (!active) return;
      for (const inp of cellsOf(active)) inp.parentNode.classList.add('lit');
      nowPic.replaceChildren(thumb(K, active, 84));
      nowNo.textContent = active.num + ' ' + arrow(active) + ' ';
      nowTr.textContent = meaning(active);
      nowBoxes.replaceChildren(...boxes(active, true));
    };

    function focusWord(w, at) {
      if (!w) return;
      active = w; curDir = w.dir;
      const list = cellsOf(w);
      // слово з відкритою першою літерою починаємо з неї: тоді можна друкувати слово повністю
      const fresh = list[0].classList.contains('given') && list.slice(1).every(inp => !inp.value);
      const target = at || (fresh ? list[0] : list.find(inp => !inp.value)) || list[0];
      if (target) target.focus({ preventScroll: true });
      refresh();
    }

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const pw = picCells.get(x + ',' + y);
        if (pw) {
          wrap.append(h('button', { class: 'cc cc-pic', type: 'button', title: pw.num + ' ' + arrow(pw) + ' ' + meaning(pw), 'data-w': pw.num + pw.dir, onclick: () => focusWord(pw) },
            thumb(K, pw, 40), h('span', { class: 'cc-arr' }, arrow(pw))));
          continue;
        }
        if (!wordsAt(x, y).length) { wrap.append(h('div', { class: 'cc void' })); continue; }
        const inp = h('input', { class: 'cc-in', type: 'text', maxlength: 1, inputmode: 'text',
          autocapitalize: 'none', autocomplete: 'off', spellcheck: 'false', 'aria-label': `${x},${y}` });
        inputs.set(x + ',' + y, inp);
        const startW = st.words.find(w => w.x === x && w.y === y);
        /* Друк переводить у наступну клітинку того самого слова — інакше доводиться
           цілити пальцем у кожну, і гра перетворюється на вправу з влучності.
           Відкрита перша літера не змінюється: хто друкує слово повністю, разом
           із нею, просто проходить далі, а інша літера переходить у наступну клітинку. */
        const nextCell = () => (curDir === 'd' ? inputs.get(x + ',' + (y + 1)) : inputs.get((x + 1) + ',' + y)) || inputs.get((x + 1) + ',' + y) || inputs.get(x + ',' + (y + 1));
        inp.addEventListener('input', () => {
          const v = (inp.value || '').slice(-1).toLowerCase();
          const next = nextCell();
          if (inp.classList.contains('given')) {
            inp.value = inp.dataset.given;
            if (v && next) { next.focus({ preventScroll: true }); if (v !== inp.dataset.given) { next.value = v; next.dispatchEvent(new Event('input')); } }
            refresh();
            return;
          }
          inp.value = v;
          inp.classList.remove('bad');
          if (inp.value && next) next.focus({ preventScroll: true });
          refresh();
        });
        // виділяємо літеру, щоб новий натиск її замінив (maxlength=1 інакше не дасть друкувати)
        inp.addEventListener('focus', () => { try { inp.select(); } catch { /* ignore */ } });
        inp.addEventListener('focus', () => {
          const ws = wordsAt(x, y);
          const w = ws.find(v => v === active) || ws.find(v => v.dir === curDir) || ws[0];
          if (w !== active) { active = w; curDir = w.dir; refresh(); }
        });
        // другий дотик до клітинки на перетині — перемикає напрям
        inp.addEventListener('pointerdown', () => {
          if (document.activeElement !== inp) return;
          const ws = wordsAt(x, y); if (ws.length < 2) return;
          active = ws.find(v => v !== active) || ws[0]; curDir = active.dir; refresh();
        });
        inp.addEventListener('keydown', e => {
          const map = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
          if (map[e.key]) { const [dx, dy] = map[e.key]; const n2 = inputs.get((x + dx) + ',' + (y + dy)); if (n2) { e.preventDefault(); curDir = dx ? 'a' : 'd'; n2.focus(); } }
          if (e.key === 'Backspace' && inp.classList.contains('given')) e.preventDefault();
          if (e.key === 'Backspace' && (!inp.value || inp.classList.contains('given'))) {
            const p = curDir === 'd' ? inputs.get(x + ',' + (y - 1)) : inputs.get((x - 1) + ',' + y);
            const q = p || inputs.get((x - 1) + ',' + y) || inputs.get(x + ',' + (y - 1));
            if (q) { e.preventDefault(); q.focus(); if (!q.classList.contains('given')) q.value = ''; refresh(); }
          }
        });
        wrap.append(h('div', { class: 'cc' + (startW && startW.pic ? ' has-pic' : '') }, startW ? h('span', { class: 'cc-no' }, startW.num) : null, inp));
      }
    }

    /* Картка підказки — як у кросвордах із малюнками: номер, стрілка напрямку,
       мініатюра, переклад і клітинки за кількістю літер. */
    const clue = w => {
      const card = h('li', { class: 'cross-card', tabindex: 0, role: 'button', onclick: () => focusWord(w),
          onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focusWord(w); } } },
        h('span', { class: 'cl-no' }, w.num, h('small', {}, arrow(w))),
        h('span', { class: 'cl-pic' }, thumb(K, w, 56)),
        h('span', { class: 'cl-txt' }, h('span', { class: 'cl-tr' }, meaning(w)), h('span', { class: 'cl-boxes', 'aria-label': w.g.length + ' ' + L.letters }, boxes(w, true))));
      cards.set(w, card);
      return card;
    };

    const across = st.words.filter(w => w.dir === 'a').sort((a, b) => a.num - b.num);
    const down = st.words.filter(w => w.dir === 'd').sort((a, b) => a.num - b.num);

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
        let ok = true, any = false;
        cellsOf(w).forEach((inp, i) => {
          const v = (inp.value || '').toLowerCase();
          // відкрита перша літера — не відповідь учня
          if (v && !inp.classList.contains('given')) any = true;
          if (v !== w.g[i]) { ok = false; if (v) inp.classList.add('bad'); }
        });
        if (any) filled++;
        if (ok) { markDone(w, inputs); } else left++;
        if (!ok && any) { wrong++; logBad(w); }
      }
      refresh();
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
      // відкриваємо одну порожню літеру — спершу в слові, яке зараз пишемо
      const pool = ws => { const out = []; for (const w of ws) cellsOf(w).forEach((inp, i) => { if (!inp.value) out.push([inp, w.g[i], w]); }); return out; };
      let empty = active ? pool([active]) : [];
      if (!empty.length) empty = pool(st.words);
      if (!empty.length) return;
      const [inp, ch, word] = empty[Math.floor(Math.random() * empty.length)];
      inp.value = ch; inp.classList.add('hinted'); inp.classList.remove('bad');
      /* Попросити літеру — це теж сказати «не згадав». Для журналу помилок це
         не менш цінний сигнал, ніж неправильна відповідь. */
      logBad(word);
      refresh();
    };

    const reveal = () => {
      for (const w of st.words) {
        let had = true;
        cellsOf(w).forEach((inp, i) => {
          if ((inp.value || '').toLowerCase() !== w.g[i]) had = false;
          inp.value = w.g[i]; inp.classList.remove('bad'); inp.classList.add('hinted');
        });
        /* Записуємо лише те, що людина не розгадала сама: слова, які вже стояли
           правильно, помилками не є. */
        if (!had) logBad(w);
      }
      msg.textContent = ''; msg.className = 'cross-msg';
      refresh();
    };

    /* «По одній літері на слово» — перша літера кожного слова стоїть одразу.
       Свідомий вибір режиму, а не прохання про допомогу, тож у журнал помилок не йде. */
    const applyFirst = on => {
      for (const w of st.words) {
        const inp = cellsOf(w)[0];
        if (on) {
          if (!inp.value || inp.value === w.g[0]) { inp.value = w.g[0]; inp.dataset.given = w.g[0]; inp.classList.add('given'); inp.classList.remove('bad'); }
        } else if (inp.classList.contains('given')) { inp.value = ''; inp.classList.remove('given'); delete inp.dataset.given; }
      }
      refresh();
    };
    const firstBox = h('input', { type: 'checkbox', checked: firstOn(),
      onchange: e => { setFirst(e.target.checked); applyFirst(e.target.checked); } });

    const page = h('section', { class: 'cross-page' },
      h('div', { class: 'row-left' }, h('a', { class: 'btn small', href: '#/cross' }, L.back),
        h('b', { class: 'cross-theme' }, (st.theme.icon || '🧩') + ' ' + (K.ui === 'uk' ? st.theme.uk : K.ui === 'no' ? st.theme.no : st.theme.en))),
      h('p', { class: 'cross-how muted' }, L.how),
      h('div', { class: 'cross-main' },
        h('div', { class: 'cross-left' },
          now,
          h('div', { class: 'cross-board' }, wrap),
          msg,
          h('label', { class: 'cross-first' }, firstBox, h('span', {}, L.first)),
          h('div', { class: 'row-center cross-acts' },
            h('button', { class: 'btn accent', type: 'button', onclick: check }, L.check),
            h('button', { class: 'btn', type: 'button', title: L.hint_d, onclick: hint }, L.hint),
            h('button', { class: 'btn', type: 'button', onclick: reveal }, L.reveal),
            h('a', { class: 'btn', href: '#/cross/' + st.theme.id, onclick: () => setTimeout(() => C().route(true), 0) }, L.again))),
        h('div', { class: 'cross-clues' },
          across.length ? h('div', {}, h('h3', {}, '→ ' + L.across), h('ul', { class: 'cross-cards' }, across.map(clue))) : null,
          down.length ? h('div', {}, h('h3', {}, '↓ ' + L.down), h('ul', { class: 'cross-cards' }, down.map(clue))) : null)));

    if (firstOn()) applyFirst(true);
    active = across[0] || down[0] || null;
    if (active) curDir = active.dir;
    refresh();
    return page;
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
