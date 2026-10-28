/* Комікс·Lab — 🌄 жива сцена дня для #/today (canvas) і ⚡ «Лінквіз дня».
   Сцена: норвезький фіорд у кольорах поточної години (ранок / день / вечір / ніч із північним сяйвом),
   сонце й місяць ходять небом за справжнім часом, взимку падає сніг. Стежкою стоять завдання дня —
   прапорці; Robo стоїть біля останнього виконаного, поточне завдання пульсує, усе виконане — салют.
   Прапорець можна натиснути (відкриває завдання), при наведенні — підпис. Без анімації — якщо
   користувач вимкнув рух (prefers-reduced-motion / a11y «зупинити анімації»): тоді один кадр.
   KomiksTodayFx.scene({ tasks:[{icon,title,done,href}], streak }) · KomiksTodayFx.quiz() */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const C = () => window.KomiksCore;
  const still = () => (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.classList.contains('a11y-motion');
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (c1, c2, t) => { const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const a = p(c1), b = p(c2); return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], t))).join(',')})`; };

  // небо за годиною: [верх, низ] — плавно між опорними точками доби
  const SKY = [[0, '#0b1026', '#1b2350'], [5, '#1d2b5e', '#ff9e7a'], [7, '#5aa9e6', '#ffd6a5'], [12, '#3d8fe0', '#bfe6ff'], [17, '#4a7fd4', '#ffc58a'], [19.5, '#3b2e6e', '#ff7a59'], [21.5, '#0f1535', '#2a2a6a'], [24, '#0b1026', '#1b2350']];
  function skyAt(hr) {
    for (let i = 0; i < SKY.length - 1; i++) {
      const [h0, a0, b0] = SKY[i], [h1, a1, b1] = SKY[i + 1];
      if (hr >= h0 && hr <= h1) { const t = (hr - h0) / (h1 - h0); return [mix(a0, a1, t), mix(b0, b1, t)]; }
    }
    return [SKY[0][1], SKY[0][2]];
  }

  function scene({ tasks = [], streak = 0 } = {}) {
    const K = C(), { h } = K;
    const wrap = h('div', { class: 'td-scene' });
    const cv = h('canvas', { class: 'td-canvas', role: 'img', 'aria-label': tasks.map(t => (t.done ? '✔ ' : '') + t.title).join(' · ') });
    const tip = h('div', { class: 'td-scene-tip', hidden: true });
    wrap.append(cv, tip);
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, raf = 0, t0 = performance.now();
    const doneN = tasks.filter(t => t.done).length, all = tasks.length && doneN === tasks.length;
    const cur = tasks.findIndex(t => !t.done);
    const month = new Date().getMonth(), winter = month >= 10 || month <= 2;
    // зірки й сніжинки — один раз (координати 0..1)
    const rnd = (() => { let s = 7 + new Date().getDate(); return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
    const stars = Array.from({ length: 70 }, () => [rnd(), rnd() * 0.55, rnd()]);
    const flakes = Array.from({ length: winter ? 60 : 0 }, () => [rnd(), rnd(), 0.4 + rnd() * 0.8]);
    const clouds = Array.from({ length: 4 }, (_, i) => [rnd(), 0.1 + rnd() * 0.25, 0.6 + rnd() * 0.6, i]);
    let sparks = [];
    let hover = -1;

    function resize() {
      const r = wrap.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(280, r.width); H = W < 560 ? 190 : 240;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    // точки стежки (прапорці) — по кривій унизу сцени
    const pathY = x => H * 0.8 - Math.sin(x / W * Math.PI * 1.3 + 0.4) * H * 0.07;
    const pts = () => tasks.map((_, i) => { const x = W * (0.12 + 0.76 * (tasks.length === 1 ? 0.5 : i / (tasks.length - 1))); return [x, pathY(x)]; });

    function mountains(base, amp, color, snow, seed, shift) {
      ctx.beginPath(); ctx.moveTo(0, H);
      const n = 7;
      const peaks = [];
      for (let i = 0; i <= n; i++) {
        const x = (i / n) * W * 1.2 - W * 0.1 + shift;
        const y = base - amp * (0.55 + 0.45 * Math.sin(i * 2.3 + seed));
        peaks.push([x, y]); ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.closePath(); ctx.fillStyle = color; ctx.fill();
      if (snow) {
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        for (const [x, y] of peaks) { if (y > base - amp * 0.75) continue; ctx.beginPath(); ctx.moveTo(x - 16, y + 14); ctx.lineTo(x, y); ctx.lineTo(x + 16, y + 14); ctx.lineTo(x + 6, y + 10); ctx.lineTo(x - 4, y + 15); ctx.closePath(); ctx.fill(); }
      }
    }
    function robo(x, y, s, bob, happy) {
      ctx.save(); ctx.translate(x, y + bob); ctx.scale(s, s);
      ctx.lineWidth = 3; ctx.strokeStyle = '#141414';
      ctx.beginPath(); ctx.moveTo(0, -46); ctx.lineTo(0, -38); ctx.stroke();
      ctx.fillStyle = '#ff5252'; ctx.beginPath(); ctx.arc(0, -48, 4.5, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#4dd0e1'; roundRect(-20, -38, 40, 30, 9); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#102027'; roundRect(-14, -32, 28, 18, 5); ctx.fill();
      ctx.strokeStyle = '#76ff03'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      if (happy) { ctx.beginPath(); ctx.arc(-6, -22, 3, Math.PI, 0); ctx.arc(6, -22, 3, Math.PI, 0); ctx.stroke(); }
      else { ctx.fillStyle = '#76ff03'; ctx.fillRect(-8, -27, 4, 6); ctx.fillRect(4, -27, 4, 6); }
      ctx.strokeStyle = '#141414'; ctx.lineWidth = 3; ctx.fillStyle = '#00838f'; roundRect(-14, -8, 28, 10, 4); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    function roundRect(x, y, w, hh, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + hh, r); ctx.arcTo(x + w, y + hh, x, y + hh, r); ctx.arcTo(x, y + hh, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

    function frame(now) {
      const t = (now - t0) / 1000;
      const d = new Date(), hr = d.getHours() + d.getMinutes() / 60;
      const night = hr < 5.5 || hr > 21;
      const [top, bot] = skyAt(hr);
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // зірки й північне сяйво вночі
      if (night || hr < 6.5 || hr > 20) {
        const a = night ? 1 : 0.4;
        for (const [x, y, p] of stars) { ctx.globalAlpha = a * (0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + p * 9))); ctx.fillStyle = '#fff'; ctx.fillRect(x * W, y * H, 1.6, 1.6); }
        ctx.globalAlpha = 1;
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          for (let x = 0; x <= W; x += 12) { const y = H * (0.18 + k * 0.05) + Math.sin(x / 90 + t * 0.6 + k) * 14 + Math.sin(x / 37 + t) * 5; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.strokeStyle = ['rgba(118,255,170,.35)', 'rgba(120,220,255,.25)', 'rgba(200,120,255,.22)'][k]; ctx.lineWidth = 16 - k * 3; ctx.stroke();
        }
      }
      // сонце (6–20 год) і місяць — дугою за часом
      const arc = (p, r, fill) => { const x = lerp(W * 0.06, W * 0.94, p), y = H * 0.62 - Math.sin(p * Math.PI) * H * 0.5; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = fill; ctx.fill(); return [x, y]; };
      if (hr >= 5.5 && hr <= 21) {
        const p = (hr - 5.5) / 15.5;
        const [sx, sy] = arc(p, 20, '#ffd23f');
        ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.arc(sx, sy, 32 + Math.sin(t * 2) * 3, 0, 7); ctx.fillStyle = '#ffe680'; ctx.fill(); ctx.globalAlpha = 1;
      } else {
        const p = ((hr + 24 - 21) % 24) / 8.5;
        const [mx, my] = arc(Math.min(1, p), 14, '#f5f3ce');
        ctx.beginPath(); ctx.arc(mx + 6, my - 4, 12, 0, 7); ctx.fillStyle = top; ctx.fill();
      }
      // хмари
      for (const [cx, cy, sc] of clouds) {
        const x = ((cx * W + t * 8 * sc) % (W + 160)) - 80, y = cy * H;
        ctx.fillStyle = night ? 'rgba(200,210,255,.12)' : 'rgba(255,255,255,.85)';
        ctx.beginPath(); ctx.arc(x, y, 14 * sc, 0, 7); ctx.arc(x + 16 * sc, y - 6 * sc, 18 * sc, 0, 7); ctx.arc(x + 36 * sc, y, 14 * sc, 0, 7); ctx.fill();
      }
      // гори (3 плани) і фіорд
      const dark = night ? 0.55 : 0;
      mountains(H * 0.62, H * 0.3, mix('#7b8fc7', '#1a2147', dark), true, 1, Math.sin(t * 0.05) * 6);
      mountains(H * 0.72, H * 0.28, mix('#4f6fa8', '#141a3a', dark), true, 3.7, Math.sin(t * 0.08) * 10);
      ctx.fillStyle = mix('#3a8fc2', '#0d1a3a', dark); ctx.fillRect(0, H * 0.72, W, H * 0.06);
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5;
      for (let i = 0; i < 6; i++) { const x = ((i * W / 5 + t * 18) % W); ctx.beginPath(); ctx.moveTo(x, H * 0.745); ctx.lineTo(x + 22, H * 0.745); ctx.stroke(); }
      // земля й стежка
      ctx.fillStyle = mix(winter ? '#eef4ff' : '#7cc46a', winter ? '#3a4570' : '#1f4a2c', dark); ctx.fillRect(0, H * 0.77, W, H);
      const P = pts();
      ctx.setLineDash([2, 10]); ctx.lineCap = 'round'; ctx.lineWidth = 7; ctx.strokeStyle = winter ? 'rgba(120,140,190,.7)' : 'rgba(250,240,200,.9)';
      ctx.beginPath(); for (let x = 0; x <= W; x += 8) { const y = pathY(x); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
      // прапорці-завдання
      P.forEach(([x, y], i) => {
        const tk = tasks[i], isCur = i === cur, on = tk.done;
        const r = (W < 560 ? 15 : 19) + (hover === i ? 3 : 0);
        if (isCur) { ctx.beginPath(); ctx.arc(x, y - 26, r + 6 + Math.sin(t * 4) * 3, 0, 7); ctx.fillStyle = 'rgba(255,210,63,.35)'; ctx.fill(); }
        ctx.strokeStyle = '#141414'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 10); ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y - 26, r, 0, 7); ctx.fillStyle = on ? '#3bb273' : isCur ? '#ffd23f' : '#ffffff'; ctx.fill(); ctx.stroke();
        ctx.font = `${Math.round(r * 1.05)}px system-ui, "Segoe UI Emoji", "Apple Color Emoji", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff'; ctx.fillText(on ? '✔' : tk.icon, x, y - 25);
      });
      // Robo іде до поточного завдання (стоїть перед ним); усе виконано — стрибає біля останнього
      const ax = all ? P[P.length - 1][0] + 30 : cur >= 0 ? P[cur][0] - (W < 560 ? 30 : 38) : W * 0.05;
      const at = [Math.max(16, Math.min(W - 16, ax)), pathY(Math.max(16, Math.min(W - 16, ax)))];
      if (at) robo(at[0], at[1] - 2, W < 560 ? 0.7 : 0.85, all ? -Math.abs(Math.sin(t * 5)) * 14 : Math.sin(t * 3) * 2, all || doneN > 0);
      // сніг
      for (const f of flakes) { f[1] = (f[1] + 0.0015 * f[2]) % 1; ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(((f[0] * W + Math.sin(t + f[2] * 6) * 8) + W) % W, f[1] * H, 1.6 * f[2] + 0.6, 0, 7); ctx.fill(); }
      // салют, коли все зроблено
      if (all) {
        if (Math.random() < 0.06) { const x = W * (0.2 + Math.random() * 0.6), y = H * (0.15 + Math.random() * 0.25), col = ['#ffd23f', '#ff5c8a', '#76ff03', '#4dd0e1'][Math.floor(Math.random() * 4)]; for (let k = 0; k < 26; k++) { const a = k / 26 * Math.PI * 2; sparks.push({ x, y, vx: Math.cos(a) * (1 + Math.random() * 2), vy: Math.sin(a) * (1 + Math.random() * 2), l: 1, col }); } }
        sparks = sparks.filter(s => (s.l -= 0.018) > 0);
        for (const s of sparks) { s.x += s.vx; s.y += s.vy; s.vy += 0.03; ctx.globalAlpha = s.l; ctx.fillStyle = s.col; ctx.fillRect(s.x, s.y, 2.5, 2.5); }
        ctx.globalAlpha = 1;
      }
      // серія днів — значок у кутку
      if (streak) { ctx.font = '700 15px system-ui, sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'top'; ctx.fillStyle = 'rgba(0,0,0,.35)'; roundRect(W - 86, 10, 76, 26, 13); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText(`🔥 ${streak}`, W - 20, 15); }
    }
    function loop(now) {
      if (!cv.isConnected) { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); return; }
      frame(now);
      if (!still()) raf = requestAnimationFrame(loop);
    }
    const hit = e => {
      const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      return pts().findIndex(([px, py]) => Math.hypot(px - x, py - 26 - y) < 26);
    };
    cv.addEventListener('pointermove', e => {
      const i = hit(e); hover = i; cv.style.cursor = i >= 0 && !tasks[i].done ? 'pointer' : 'default';
      if (i >= 0) { const r = cv.getBoundingClientRect(); tip.hidden = false; tip.textContent = (tasks[i].done ? '✔ ' : '') + tasks[i].title; tip.style.left = Math.min(r.width - 160, Math.max(0, e.clientX - r.left - 60)) + 'px'; tip.style.top = Math.max(0, e.clientY - r.top - 52) + 'px'; }
      else tip.hidden = true;
      if (still()) frame(performance.now());
    });
    cv.addEventListener('pointerleave', () => { hover = -1; tip.hidden = true; });
    cv.addEventListener('click', e => { const i = hit(e); if (i >= 0 && !tasks[i].done && tasks[i].href) location.hash = tasks[i].href.replace(/^#/, ''); });
    requestAnimationFrame(() => { resize(); window.addEventListener('resize', resize); raf = requestAnimationFrame(loop); });
    return wrap;
  }

  /* ---------- ⚡ Лінквіз дня: нескінченні набори по 5 слів із картинками ---------- */
  const QT = {
    uk: { t: '⚡ Лінквіз дня', d: 'Яке це слово? 5 картинок — швидко, без тиску.', go: 'Почати', next: 'Далі', done: (s, n) => `Готово: ${s} з ${n}! Повтори ці слова або візьми наступні.`, again: 'Ще раз', more: 'Наступні 5 слів', set: n => `Набір ${n}` },
    en: { t: '⚡ Quick quiz of the day', d: 'Which word is it? 5 pictures — quick and easy.', go: 'Start', next: 'Next', done: (s, n) => `Done: ${s} of ${n}! Repeat these words or take the next set.`, again: 'Again', more: 'Next 5 words', set: n => `Set ${n}` },
    no: { t: '⚡ Dagens lynquiz', d: 'Hvilket ord er det? 5 bilder – raskt og enkelt.', go: 'Start', next: 'Neste', done: (s, n) => `Ferdig: ${s} av ${n}! Gjenta ordene eller ta neste sett.`, again: 'En gang til', more: 'Neste 5 ord', set: n => `Sett ${n}` }
  };
  const qx = (k, ...a) => { const ui = (C() && C().ui) || 'uk'; const v = (QT[ui] || QT.en)[k]; return typeof v === 'function' ? v(...a) : v; };
  function quiz() {
    const K = C(), { h } = K, P = window.KomiksPics;
    const W = (window.WORDS || {}).themes || [];
    if (!P || !W.length) return null;
    const iso = new Date().toISOString().slice(0, 10);
    // У наборі показуємо лише слова з картинками. Протягом одного циклу слово
    // не повторюється; після всього словника починається нове перемішування.
    const rawPool = W.filter(t => t.level === 'A1' || t.level === 'A2').flatMap(t => t.words.filter(w => P.photo && P.photo(w[0], w[1])).map(w => [t, w]));
    const pool = []; const unique = new Set();
    for (const item of rawPool) { const key = item[1][0].toLocaleLowerCase('nb-NO'); if (!unique.has(key)) { unique.add(key); pool.push(item); } }
    if (pool.length < 8) return null;
    const setsPerCycle = Math.max(1, Math.floor(pool.length / 5));
    const makeItems = batch => {
      const cycle = Math.floor(batch / setsPerCycle), slot = batch % setsPerCycle;
      let seed = [...`${iso}:${cycle}`].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
      const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      const shuffled = [...pool];
      for (let j = shuffled.length - 1; j > 0; j--) { const k = Math.floor(random() * (j + 1)); [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]]; }
      return shuffled.slice(slot * 5, slot * 5 + 5);
    };
    const box = h('section', { class: 'td-quiz' });
    let saved = K.store.get('todayQuiz', {});
    let batch = saved.d === iso ? Math.max(0, Number(saved.b) || 0) : 0;
    let items = makeItems(batch), i = 0, score = 0;
    const draw = () => {
      if (i >= items.length) {
        saved = { d: iso, s: score, n: items.length, b: batch };
        K.store.set('todayQuiz', saved);
        if (score === items.length && K.confetti) K.confetti();
        box.replaceChildren(h('div', { class: 'tq-head' }, h('h3', {}, qx('t')), h('b', { class: 'tq-set' }, qx('set', batch + 1))),
          h('p', { class: 'tq-done' }, '⭐'.repeat(score) + '☆'.repeat(items.length - score), ' ', qx('done', score, items.length)),
          h('div', { class: 'row-left tq-actions' },
            h('button', { type: 'button', class: 'btn', onclick: () => { i = 0; score = 0; draw(); } }, qx('again')),
            h('button', { type: 'button', class: 'btn accent', onclick: () => { batch++; items = makeItems(batch); i = 0; score = 0; draw(); } }, qx('more'))));
        return;
      }
      const [th, w] = items[i];
      const others = K.shuffle(th.words.filter(x => x[0] !== w[0] && x[1] !== w[1])).slice(0, 2).map(x => x[0]);
      const opts = K.shuffle([w[0], ...others]);
      const say = () => K.claim().then(() => K.Speech.speak(w[0], 'narrator', { rate: 0.9 }));
      const bar = h('div', { class: 'tq-dots' }, items.map((_, k) => h('i', { class: k < i ? 'on' : k === i ? 'cur' : '' })));
      const btns = opts.map(o => h('button', { type: 'button', class: 'tq-opt', onclick: e => {
        if (box.classList.contains('locked')) return; box.classList.add('locked');
        const ok = o === w[0]; if (ok) { score++; K.Sfx.good(); } else K.Sfx.bad();
        btns.forEach(b => b.classList.add(b.textContent === w[0] ? 'good' : b === e.currentTarget ? 'bad' : 'dim'));
        say(); setTimeout(() => { box.classList.remove('locked'); i++; draw(); }, 1300);
      } }, o));
      box.replaceChildren(h('div', { class: 'tq-head' }, h('h3', {}, qx('t')), h('b', { class: 'tq-set' }, qx('set', batch + 1)), bar),
        h('div', { class: 'tq-body' }, h('div', { class: 'tq-pic' }, P.el(w[0], 130, w[1])), h('div', { class: 'tq-opts' }, btns)));
    };
    if (saved.d === iso) { i = items.length; score = saved.s || 0; draw(); }
    else box.append(h('div', { class: 'tq-head' }, h('h3', {}, qx('t'))), h('p', { class: 'hint' }, qx('d')), h('button', { type: 'button', class: 'btn accent', onclick: draw }, qx('go')));
    return box;
  }

  window.KomiksTodayFx = { scene, quiz };
})();
