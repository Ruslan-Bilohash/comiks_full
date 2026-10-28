/* Комікс·Lab — вивчаємо норвезьку через комікси.
   Інтерфейс: українська / English / norsk. Голос і тести — лише норвезькою.
   Переклад показується при наведенні мовою інтерфейсу (у норвезькому інтерфейсі — вимкнено).
   Без збірки, працює з file:// */
(() => {
  'use strict';

  const COMICS = window.COMICS || [];
  const CH = window.CHARACTERS || {};
  const ART = window.KomiksArt || null;
  const B = window.BASICS || { alphabet: [], numbers: {}, pictures: [], levels: ['A1', 'A2', 'B1', 'B2'], categories: {}, upcoming: [] };
  const I18N = window.I18N || { uk: {} };
  // модулі (гонка, шахи, слова…) додають свої пункти меню не всіма мовами — бракує перекладу, беремо англійський
  for (const l of Object.keys(I18N)) if (l !== 'en' && I18N.en) for (const part of ['nav', 'modules']) I18N[l][part] = Object.assign({}, I18N.en[part], I18N[l][part]);
  window.DICT = window.DICT || { no: {}, en: {} };
  for (const c of COMICS) {
    if (!c.words) continue;
    for (const lang of ['no', 'uk', 'en']) window.DICT[lang] = Object.assign(window.DICT[lang] || {}, c.words[lang] || {});
  }
  const L = 'no';
  const LANGS = [['no', '🇳🇴 Norsk'], ['uk', '🇺🇦 Українська'], ['en', '🇬🇧 English'], ['de', '🇩🇪 Deutsch'], ['pl', '🇵🇱 Polski'], ['tr', '🇹🇷 Türkçe'], ['lt', '🇱🇹 Lietuvių'], ['ar', '🇸🇦 العربية']];
  const canHover = window.matchMedia && matchMedia('(hover: hover)').matches;
  /* 📴 Офлайн-збірка застосунку: немає сервера, тож немає акаунтів, друзів, стін,
     повідомлень, рейтингу, спільних ігор і ШІ. Лишається все, що працює на самому
     пристрої: комікси, тести, картки, «Пари», слова, граматика й одиночні ігри. */
  const OFFLINE = !!window.KOMIKS_OFFLINE;
  /* 📱 Збірка для крамниці — Play Market або App Store (Capacitor підставляє
     window.Capacitor у вебогляді). Усередині неї не показуємо сторонніх ігор:
     файтинг, на який веде посилання з навчального застосунку з категорією 4+,
     змінює і вікову категорію самого застосунку, і відповіді в анкетах
     «Data safety» та «App Privacy». На сайті посилання лишаються всі. */
  const NATIVE = !!(window.Capacitor || window.KOMIKS_NATIVE);
  const NO_EXTERNAL = OFFLINE || NATIVE;
  // сторінки, яких в офлайн-версії просто немає
  const ONLINE_ONLY = new Set(['watch', 'stats', 'friends', 'players', 'player', 'messages', 'privacy', 'alerts',
    'game', 'join', 'rating', 'call', 'write', 'teacher', 'premium', 'login', 'register',
    'forgot', 'reset', 'verify', 'verify-sent', 'verify-failed', 'welcome', 'account']);

  /* ================= helpers ================= */
  // рідні append/prepend/replaceChildren друкують null як текст «null» (було на #/plan) — відкидаємо порожні значення скрізь
  for (const P of [Element.prototype, DocumentFragment.prototype]) for (const m of ['append', 'prepend', 'replaceChildren']) {
    const orig = P[m]; if (!orig || orig.__noNull) continue;
    const safe = function (...a) { return orig.apply(this, a.filter(x => x != null && x !== false)); };
    safe.__noNull = true; P[m] = safe;
  }
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const range = n => [...Array(n).keys()];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const uniq = a => [...new Set(a)];
  const escXml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const svgEl = markup => { const d = document.createElement('div'); d.innerHTML = markup.trim(); return d.firstElementChild; };
  const norm = s => String(s).toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const fold = s => norm(s).replace(/å/g, 'a').replace(/ø/g, 'o').replace(/æ/g, 'ae');
  const ch = id => CH[id] || CH.narrator || { no: id, uk: id, en: id, emoji: '💬', color: '#ccc', gender: 'f' };
  const reducedMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const today = () => new Date().toISOString();
  /* Формат дати — мовою інтерфейсу. Доти кожне місце вирішувало це власним
     ланцюжком «uk? no? — ні, en-GB», і німець із поляком бачили британську
     дату, а подекуди й українську. */
  const LOCALE = { uk: 'uk-UA', no: 'nb-NO', ar: 'ar', de: 'de-DE', pl: 'pl-PL', tr: 'tr-TR', lt: 'lt-LT', en: 'en-GB' };
  const locale = () => LOCALE[ui] || 'en-GB';
  const fmtDate = iso => { try { return new Date(iso).toLocaleDateString(locale()); } catch { return iso.slice(0, 10); } };

  /* ================= storage & accounts ================= */
  // глобальні ключі спільні для всіх; решта — окремо для кожного акаунта (гість — без префікса)
  const GLOBAL = new Set(['users', 'session', 'consent', 'welcomed', 'ui']);
  const raw = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } }
  };
  let session = raw.get('comiks.session', null);
  const scoped = k => (GLOBAL.has(k) || !session ? 'comiks.' + k : `comiks.u.${session}.${k}`);
  const store = { get: (k, d) => raw.get(scoped(k), d), set: (k, v) => raw.set(scoped(k), v), del: k => raw.del(scoped(k)) };
  const users = () => raw.get('comiks.users', {});
  const currentUser = () => (session ? users()[session] || null : null);

  async function hashPass(pw, algo) {
    const text = 'komiks:' + pw;
    if (algo !== 'fnv') {
      try {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return 'sha256:' + [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
      } catch { /* немає crypto.subtle — нижче запасний варіант */ }
    }
    let x = 0x811c9dc5;
    for (const c of text) { x ^= c.codePointAt(0); x = Math.imul(x, 16777619) >>> 0; }
    return 'fnv:' + x.toString(16);
  }
  const checkPass = async (pw, stored) => (await hashPass(pw, stored.startsWith('fnv:') ? 'fnv' : 'sha')) === stored;
  function setSession(id) {
    session = id;
    if (id) raw.set('comiks.session', id); else raw.del('comiks.session');
    loadSettings();
  }
  // підказка «🔊 послухати · наведи — переклад» у читанці: раз на тиждень (до кінця того відвідування)
  let readHintNow = false;
  function showReadHint() {
    if (readHintNow) return true;
    const last = +raw.get('comiks.readHint', 0) || 0;
    if (Date.now() - last < 7 * 864e5) return false;
    raw.set('comiks.readHint', Date.now()); readHintNow = true;
    return true;
  }
  function copyGuestProgressTo(id) {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
      keys.filter(k => k.startsWith('comiks.') && !k.startsWith('comiks.u.') && !GLOBAL.has(k.slice(7)))
        .forEach(k => localStorage.setItem(`comiks.u.${id}.${k.slice(7)}`, localStorage.getItem(k)));
    } catch { /* ignore */ }
  }

  /* ================= мова інтерфейсу ================= */
  let ui = raw.get('comiks.ui', null) || 'no';
  if (!I18N[ui]) ui = 'no';
  const T = () => (ui === 'no' ? 'en' : ui); // мова, якою показуємо один переклад (картки, «Пари»)
  const fb = key => { const e = I18N.en || {}; return key in e ? e[key] : (I18N.uk || {})[key]; }; // нема перекладу — англійська, далі українська
  const t = (key, ...a) => { const tbl = I18N[ui] || {}; const v = key in tbl ? tbl[key] : fb(key); return typeof v === 'function' ? v(...a) : (v ?? key); };
  const tx = key => { const tbl = I18N[ui] || {}; return key in tbl ? tbl[key] : fb(key); };
  const navT = k => (tx('nav') || {})[k] || k;
  // підказки при наведенні: мови обирає учень у налаштуваннях (UA / EN / AR); арабська — з data/arabic.js за англійським текстом
  const arFor = en => (en && window.AR_EN ? window.AR_EN[en] || window.AR_EN[String(en).trim()] : undefined);
  /* Підказка може показувати кілька мов одночасно. Для мов, які йдуть словником
     (арабська, німецька, польська, турецька, литовська), шукаємо переклад за англійським
     рядком; якщо його ще немає — поля просто не буде, і підказка покаже англійську. */
  const packFor = (lang, en) => { const m = packOf(lang); const t = String(en || '').trim(); return m && t ? m[en] || m[t] : undefined; };
  /* Один рядок — одна підказка потрібною мовою. Доти кожне місце вирішувало це
     саме, трійчастим виразом «арабська? англійська? — ні, українська», і для
     німця це означало українську підказку під норвезьким словом. Тепер шлях
     один: словник → англійська → українська. */
  const trText = (en, uk, lang) => {
    const l = lang || trLang();
    if (l === 'uk') return uk || en || '';
    if (l === 'en') return en || uk || '';
    return packFor(l, en) || en || uk || '';
  };
  const both = (uk, en, ar) => {
    if (!uk && !en && !ar) return null;
    const tr = { uk, en, ar: ar || arFor(en) };
    for (const l of ['de', 'pl', 'tr', 'lt']) { const v = packFor(l, en); if (v) tr[l] = v; }
    return tr;
  };
  const qtr = k => {
    const tr = both(((I18N.uk || {}).qtr || {})[k], ((I18N.en || {}).qtr || {})[k], ((I18N.ar || {}).qtr || {})[k]);
    if (!tr) return tr;
    for (const l of TR_ALL) { const v = ((I18N[l] || {}).qtr || {})[k]; if (v) tr[l] = v; }
    return tr;
  };
  const TR_ALL = ['uk', 'en', 'ar', 'de', 'pl', 'tr', 'lt'];
  // назви мов їхньою ж мовою — так їх упізнають навіть ті, хто не читає інтерфейс
  const TR_NAME = { uk: 'Українська', en: 'English', ar: 'العربية', de: 'Deutsch', pl: 'Polski', tr: 'Türkçe', lt: 'Lietuvių' };
  // словники перекладів вантажимо окремими файлами й лише ті, які обрали
  const PACK_FILE = { ar: 'data/arabic.js', de: 'data/lang-de.js', pl: 'data/lang-pl.js', tr: 'data/lang-tr.js', lt: 'data/lang-lt.js' };
  const packLoading = {};
  function ensurePacks() {
    const need = TR_ALL.filter(l => PACK_FILE[l] && (ui === l || trLangs().includes(l)));
    for (const l of need) {
      if (packLoading[l] || packOf(l)) continue;
      packLoading[l] = true;
      const sc = document.createElement('script');
      sc.src = PACK_FILE[l] + '?v=' + ((window.KOMIKS_DATA || {}).version || '');
      sc.onload = () => route(true);
      sc.onerror = () => { packLoading[l] = false; };
      document.head.append(sc);
    }
  }
  const packOf = l => (l === 'ar' ? window.AR_EN : (window.TR_PACK || {})[l]) || null;
  const ensureAr = ensurePacks;   // стара назва лишається: її кличуть інші файли
  /* Мови підказки. Учень може тримати увімкненими кілька одразу — тоді в хмаринці
     буде кілька рядків. Поки він нічого не обрав, показуємо мову інтерфейсу
     та англійську: два рядки, яких вистачає майже завжди. */
  const trDefault = () => {
    const m = TR_ALL.includes(ui) ? ui : 'uk';
    return m === 'en' ? ['en'] : [m, 'en'];
  };
  const trLangs = () => {
    const v = (settings && settings.trLangs || []).filter(x => TR_ALL.includes(x));
    return v.length ? v : trDefault();
  };
  const trMain = () => trLangs()[0];
  const trLine = l => both(l.uk, l.en);
  const trPair = p => both(p[1], p[2]);
  const titleTr = c => both(c.titleUk, c.titleEn);
  const summaryOf = c => {
    if (ui === 'no') return c.summaryNo || c.summaryEn || '';
    if (ui === 'uk') return c.summaryUk || c.summaryEn || '';
    if (ui === 'en') return c.summaryEn || c.summaryUk || '';
    // мови зі словника: свій переклад, інакше англійська (не українська — її тут ніхто не читає)
    const v = packFor(ui, c.summaryEn) || (ui === 'ar' ? arFor(c.summaryEn) : '');
    return v || c.summaryEn || c.summaryUk || '';
  };
  const catLabel = cat => { const x = B.categories[cat]; return x ? `${x.icon} ${x[ui] || trText(x.en, x.uk, ui)}` : cat; };
  const nameOf = id => ch(id).no;

  // текст норвезькою, переклад — при наведенні (або дотику на телефоні)
  const FLAG = { uk: ['UA', ''], en: ['EN', ' en'], ar: ['AR', ' ar'], de: ['DE', ' de'], pl: ['PL', ' pl'], tr: ['TR', ' tr'], lt: ['LT', ' lt'] };
  const tipBody = tr => {
    if (typeof tr === 'string') return tr;
    let langs = trLangs().filter(l => tr[l]);
    if (!langs.length) langs = ['en', 'uk'].filter(l => tr[l]).slice(0, 1); // обраної мови немає — хоч англійська
    return [...langs.map(l => h('span', { class: 'tr-row', dir: l === 'ar' ? 'rtl' : null }, h('i', { class: 'tr-flag' + FLAG[l][1] }, FLAG[l][0]), tr[l])),
      tr.no ? h('span', { class: 'tr-row' }, h('i', { class: 'tr-flag no' }, 'NO'), tr.no) : null];
  };
  function withTr(el, tr) {
    if (!tr) return el;
    el.classList.add('has-tr');
    el.append(h('span', { class: 'tr-tip', role: 'tooltip' }, tipBody(tr)));
    if (!canHover) el.addEventListener('click', e => { if (!e.target.closest('.w, button, a')) el.classList.toggle('show-tr'); });
    return el;
  }

  /* ================= settings ================= */
  let settings;
  function loadSettings() {
    settings = Object.assign({ level: 'kids', levelFilter: 'all', rate: 1, voices: {}, voiceMode: 'multi', cheerPitch: 1.35, audio: true, autoNext: true }, store.get('settings', {}));
    if (settings.v !== 5) { settings.v = 5; settings.audio = true; settings.voiceMode = 'multi'; store.set('settings', settings); }
  }
  loadSettings();
  const saveSettings = () => store.set('settings', settings);
  const VOICE_MODES = [['cheerful', '🎀'], ['characters', '🎭'], ['multi', '🌍']];

  /* ================= panels & covers ================= */
  function fallbackSVG(c, idx) {
    const p = c.panels[idx];
    const first = p.lines.find(l => l.who !== 'sfx') || p.lines[0];
    return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img"><rect width="400" height="300" fill="${p.bg || '#ffe082'}"/>
      <rect x="12" y="12" width="376" height="60" rx="20" fill="#fff" stroke="#141414" stroke-width="3.5"/>
      <text x="200" y="48" text-anchor="middle" font-family="Pangolin, 'Comic Sans MS', cursive" font-size="18">${escXml((first ? first.no : '').slice(0, 40))}</text></svg>`;
  }
  function panelView(c, idx, { big = false, bubbles = true } = {}) {
    const svg = ART && c.panels[idx].art ? ART.panel(c, idx, { lang: L, tr: 'both', bubbles, chars: CH }) : fallbackSVG(c, idx);
    return h('div', { class: 'panel-frame' + (big ? ' big' : '') }, svgEl(svg));
  }
  const coverSVG = c => (ART && c.panels.some(p => p.art) ? ART.cover(c, { title: c.title, badge: c.level || '', chars: CH }) : fallbackSVG(c, 0));

  /* ================= speech (лише норвезька) ================= */
  const Speech = {
    ok: 'speechSynthesis' in window,
    voices: [],
    init() {
      if (!this.ok) return;
      const load = () => { this.voices = speechSynthesis.getVoices(); document.dispatchEvent(new Event('voices')); };
      load();
      if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', load); else speechSynthesis.onvoiceschanged = load;
    },
    norwegian() { return this.voices.filter(v => /^(nb|no|nn)([-_]|$)/i.test(v.lang)); },
    english() { return this.voices.filter(v => /^en([-_]|$)/i.test(v.lang)); },
    gender(v) {
      if (/finn|jon\b|male\b|\bmann|herre|man\b/i.test(v.name)) return 'm';
      if (/pernille|iselin|female|kvinne|hulda|nora|woman/i.test(v.name)) return 'f';
      return '?';
    },
    pick(g) {
      const list = this.norwegian();
      const saved = settings.voices['no' + g];
      if (saved) { const v = list.find(x => x.name === saved); if (v) return v; }
      const score = v => (this.gender(v) === g ? 4 : this.gender(v) === '?' ? 1 : 0) + (/natural|online|neural/i.test(v.name) ? 2 : 0);
      return [...list].sort((a, b) => score(b) - score(a))[0] || null;
    },
    audioFile(text, who, lang = 'no') {
      const A = window.AUDIO;
      if (!A || settings.audio === false || !text) return null;
      const mode = { cheerful: 'cheer', characters: 'cast', multi: 'multi' }[settings.voiceMode] || 'cheer';
      const f = A[`${mode}|${who}|${lang}|${text}`] || A[`word|${lang}|${String(text).toLowerCase()}`] || A[`word|${lang}|${norm(text)}`];
      return f ? `audio/${f}.mp3` : null;
    },
    speak(text, who = 'narrator', opts = {}) {
      const file = this.audioFile(text, who, opts.lang || 'no');
      return file ? this.playFile(file, text, who, opts) : this.speakTTS(text, who, opts);
    },
    playFile(src, text, who, opts) {
      const { rate = 1, onWord } = opts;
      return new Promise(res => {
        const a = this.audio || (this.audio = new Audio());
        if (this._fin) this._fin();
        a.pause(); a.src = src; a.preservesPitch = true;
        a.playbackRate = clamp(rate * settings.rate, 0.5, 2);
        let done = false, raf = 0;
        const fin = () => { if (done) return; done = true; cancelAnimationFrame(raf); a.onended = a.onerror = null; this._fin = null; res(); };
        this._fin = fin;
        a.onended = fin;
        a.onerror = () => { if (done) return; done = true; this._fin = null; this.speakTTS(text, who, opts).then(res); };
        if (onWord) {
          const tick = () => { if (done) return; if (a.duration) onWord(Math.floor(clamp((a.currentTime - 0.1) / Math.max(0.2, a.duration - 0.25), 0, 0.999) * text.length)); raf = requestAnimationFrame(tick); };
          raf = requestAnimationFrame(tick);
        }
        a.play().catch(() => { if (!done) a.onerror(); });
      });
    },
    speakTTS(text, who, { rate = 1, onWord, lang = 'no' } = {}) {
      return new Promise(res => {
        if (!this.ok || !text) return res();
        const c = ch(who);
        const u = new SpeechSynthesisUtterance(text);
        const cheerful = settings.voiceMode === 'cheerful';
        let v = this.pick(cheerful ? 'f' : (c.gender || 'm'));
        if (lang === 'en') { // англійський курс — англійський голос
          const list = this.english();
          const g = cheerful ? 'f' : (c.gender || 'm');
          v = list.find(x => (g === 'f' ? /female|zira|sonia|aria|jenny|libby|emma|hazel/i : /male|ryan|guy|george|david|brian/i).test(x.name)) || list[0] || v;
        } else if (settings.voiceMode === 'multi' && who !== 'narrator') {
          const pool = [...this.norwegian(), ...this.voices.filter(x => /multilingual/i.test(x.name))];
          if (pool.length) v = pool[Math.max(0, Object.keys(CH).indexOf(who)) % pool.length];
        }
        if (v) u.voice = v;
        u.lang = v ? v.lang : (lang === 'en' ? 'en-GB' : 'nb-NO');
        u.pitch = cheerful ? clamp(settings.cheerPitch + ((c.pitch ?? 1) - 1) * 0.25, 0.8, 2) : clamp(c.pitch ?? 1, 0, 2);
        u.rate = clamp((cheerful ? 1.08 + ((c.rate ?? 1) - 1) * 0.5 : (c.rate ?? 1)) * rate * settings.rate, 0.3, 2);
        if (onWord) u.onboundary = e => { if (!e.name || e.name === 'word') onWord(e.charIndex); };
        let done = false;
        const fin = () => { if (done) return; done = true; clearTimeout(timer); res(); };
        const timer = setTimeout(fin, 2500 + text.length * 160 / u.rate);
        u.onend = fin; u.onerror = fin;
        speechSynthesis.speak(u);
      });
    },
    stop() { if (this.ok) speechSynthesis.cancel(); if (this.audio) this.audio.pause(); if (this._fin) this._fin(); }
  };
  let playToken = 0;
  function stopAll() { playToken++; Speech.stop(); $$('.speaking').forEach(e => e.classList.remove('speaking')); $$('.w.on').forEach(e => e.classList.remove('on')); }
  async function claim() { const my = ++playToken; Speech.stop(); await sleep(70); return my; }
  // похвала голосом норвезькою: «Veldig bra! … сімнадцять» або «Ikke bra. Prøv igjen!»
  // той самий список — у tools/build-audio-list.js (нейроозвучка); не повторюємо ту саму фразу двічі поспіль
  const CHEER_OK = ['Veldig bra!', 'Kjempefint!', 'Supert!', 'Bra jobba!', 'Helt riktig!', 'Kjempebra!', 'Strålende!', 'Fantastisk!', 'Perfekt!', 'Du er flink!', 'Så flink du er!', 'Knallbra!',
    'Utmerket!', 'Nydelig!', 'Imponerende!', 'Riktig svar!', 'Sånn skal det gjøres!', 'Du klarte det!', 'Herlig!', 'Topp!', 'Glimrende!', 'Dette kan du!'];
  const CHEER_NO = ['Ikke bra. Prøv igjen!', 'Nesten! Prøv en gang til!', 'Ikke helt. Prøv igjen!', 'Oi, feil. Prøv igjen!', 'Ikke gi opp! Prøv igjen!', 'Tenk litt til og prøv igjen!'];
  let lastCheer = '';
  const freshPick = list => { let p = pick(list); for (let g = 0; g < 4 && p === lastCheer; g++) p = pick(list); lastCheer = p; return p; };
  async function cheer(ok, follow) {
    const my = await claim();
    if (my !== playToken) return my;
    if (settings.cheerVoice !== false) await Speech.speak(freshPick(ok ? CHEER_OK : CHEER_NO), 'narrator'); // «голос тамагочі» можна вимкнути
    if (follow && my === playToken) await Speech.speak(follow, 'narrator', { rate: 0.9 });
    return my;
  }

  // браузери блокують звук до першої дії користувача: після першого дотику «будимо» ефекти й аудіо
  const unlockAudio = () => {
    try { if (Sfx.ctx && Sfx.ctx.state === 'suspended') Sfx.ctx.resume(); } catch { /* ignore */ }
    try { const a = Speech.audio || (Speech.audio = new Audio()); if (!a.src) { a.muted = true; a.play().catch(() => {}).finally(() => { a.muted = false; }); } } catch { /* ignore */ }
    window.removeEventListener('pointerdown', unlockAudio, true); window.removeEventListener('keydown', unlockAudio, true);
  };
  window.addEventListener('pointerdown', unlockAudio, true); window.addEventListener('keydown', unlockAudio, true);
  const Sfx = {
    ctx: null,
    tones(freqs, dur = 0.12, type = 'triangle', vol = 0.22) {
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const c = this.ctx; if (c.state === 'suspended') c.resume();
        let tt = c.currentTime;
        for (const f of freqs) {
          const o = c.createOscillator(), g = c.createGain();
          o.type = type; o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, tt); g.gain.exponentialRampToValueAtTime(vol, tt + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, tt + dur);
          o.connect(g).connect(c.destination); o.start(tt); o.stop(tt + dur + 0.03);
          tt += dur * 0.75;
        }
      } catch { /* no audio */ }
    },
    good() { this.tones([660, 880, 1320]); }, bad() { this.tones([240, 180], 0.2, 'square', 0.08); },
    tick() { this.tones([520], 0.06, 'sine', 0.12); }, win() { this.tones([523, 659, 784, 1047, 1319], 0.14); }
  };
  function confetti(n = 170) {
    if (reducedMotion()) return;
    const cv = h('canvas', { class: 'confetti' }); document.body.append(cv);
    const g = cv.getContext('2d'), W = cv.width = innerWidth, H = cv.height = innerHeight;
    const cols = ['#ffd23f', '#ee4035', '#2e86de', '#3bb273', '#7e57c2', '#ff7a1a'];
    const ps = range(n).map(() => ({ x: W / 2 + (Math.random() - 0.5) * 160, y: H * 0.4, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 15 - 5, s: 7 + Math.random() * 7, c: pick(cols), r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35 }));
    const t0 = performance.now();
    (function frame(tm) {
      g.clearRect(0, 0, W, H);
      for (const p of ps) { p.vy += 0.38; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); }
      if (tm - t0 < 2800) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

  /* ================= слова та підказки ================= */
  let wordsMap = null;
  const themeWords = () => wordsMap || (wordsMap = new Map(((window.WORDS || { themes: [] }).themes).flatMap(t => t.words.flatMap(([no, uk, en]) => {
    const base = no.replace(/^(en|ei|et|å) /, '');
    return [[norm(no), [uk, en]], [norm(base), [uk, en]]];
  }))));
  function lookup(c, word) {
    const w = norm(word); if (!w) return null;
    const tw = themeWords().get(w); if (tw) return both(tw[0], tw[1]);
    const rawW = String(word).toLowerCase().replace(/’/g, "'");
    const dUk = window.DICT.no || {}, dEn = window.DICT.en || {};
    if (dUk[rawW] || dUk[w] || dEn[rawW] || dEn[w]) return both(dUk[rawW] || dUk[w], dEn[rawW] || dEn[w]);
    for (const vocab of [c, ...COMICS.filter(x => x !== c)].filter(Boolean).map(x => x.vocab || [])) {
      for (const pair of vocab) {
        const key = norm(pair[0]), stem = Math.min(w.length, key.length) - 2;
        if (key === w || key.split(' ').includes(w) || (stem >= 4 && !key.includes(' ') && key.slice(0, stem) === w.slice(0, stem))) return trPair(pair);
      }
    }
    return null;
  }
  let tipEl = null;
  function showWordTip(anchor, word, tr) {
    hideWordTip();
    const r = anchor.getBoundingClientRect();
    tipEl = h('div', { class: 'word-pop', role: 'tooltip' }, h('b', {}, word), tr ? h('span', { class: 'tr' }, tipBody(tr)) : h('span', { class: 'none' }, t('word_none')));
    document.body.append(tipEl);
    const left = clamp(r.left + r.width / 2 - tipEl.offsetWidth / 2 + window.scrollX, 8 + window.scrollX, window.scrollX + document.documentElement.clientWidth - tipEl.offsetWidth - 8);
    /* Утримуємо підказку в межах екрана: у режимі читання сторінка не
       гортається, тож усе, що вилізло за край, просто зникає. */
    const vh = document.documentElement.clientHeight;
    const above = r.top - tipEl.offsetHeight - 10;
    let top = above > 60 ? above : r.bottom + 10;
    top = Math.max(8, Math.min(top, vh - tipEl.offsetHeight - 8));
    Object.assign(tipEl.style, { left: left + 'px', top: (top + window.scrollY) + 'px' });
  }
  function hideWordTip() { if (tipEl) { tipEl.remove(); tipEl = null; } }
  document.addEventListener('click', e => { if (!e.target.closest('.w')) hideWordTip(); });
  // підказки лише при наведенні — для кнопок-варіантів (клік і далі обирає відповідь)
  function hoverWords(c, text) {
    const wrap = h('span', { class: 'words' });
    for (const tk of String(text).match(/[\p{L}\p{N}'’-]+|[^\p{L}\p{N}'’-]+/gu) || []) {
      if (!/[\p{L}\p{N}]/u.test(tk) || !canHover) { wrap.append(tk); continue; }
      const w = h('span', { class: 'w hw' }, tk);
      w.addEventListener('mouseenter', () => showWordTip(w, tk, lookup(c, tk)));
      w.addEventListener('mouseleave', hideWordTip);
      wrap.append(w);
    }
    return wrap;
  }
  function wordSpans(c, text) {
    const wrap = h('span', { class: 'words' });
    const re = /[\p{L}\p{N}'’-]+|[^\p{L}\p{N}'’-]+/gu;
    let m;
    while ((m = re.exec(text))) {
      const tk = m[0];
      if (!/[\p{L}\p{N}]/u.test(tk)) { wrap.append(tk); continue; }
      const w = h('span', { class: 'w', 'data-i': m.index }, tk);
      w.addEventListener('click', e => {
        e.stopPropagation();
        /* Спершу переклад, потім звук. Було навпаки, і якщо виклик звуку кидав
           виняток (на iOS це трапляється, коли аудіо ще не «розблоковане»
           дотиком), до показу підказки справа не доходила — тобто ламалося
           саме те, заради чого на слово й тиснули. */
        if (!canHover) showWordTip(w, tk, lookup(c, tk));
        try { Speech.speak(tk, 'narrator', { rate: 0.85 }); } catch { /* звук тут не головне */ }
      });
      if (canHover) { w.addEventListener('mouseenter', () => showWordTip(w, tk, lookup(c, tk))); w.addEventListener('mouseleave', hideWordTip); }
      wrap.append(w);
    }
    return wrap;
  }
  function highlight(container, idx) {
    let cur = null;
    for (const w of $$('.w', container)) { if (+w.dataset.i <= idx) cur = w; else break; }
    $$('.w.on', container).forEach(w => w.classList.remove('on'));
    if (cur) cur.classList.add('on');
  }
  const stars = n => h('span', { class: 'stars', 'aria-label': `${n}/3` }, range(3).map(i => h('span', { class: i < n ? 'f' : '' }, '★')));

  /* ================= прогрес, статистика, нагороди ================= */
  const isoDay = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  function bump(stat, n = 1) {
    const s = store.get('stats', {}); s[stat] = (s[stat] || 0) + n; store.set('stats', s);
    const days = store.get('days', []), d = isoDay(new Date());
    if (!days.includes(d)) store.set('days', [...days, d].slice(-400));
  }
  // що вже зроблено сьогодні — потрібно екрану «Сьогодні»
  function dayLog() {
    const d = store.get('dayLog', {});
    return d && d.date === isoDay(new Date()) ? d : { date: isoDay(new Date()), cards: 0, steps: 0, mistakes: 0 };
  }
  function markDay(k, n = 1) { const d = dayLog(); d[k] = (d[k] || 0) + n; store.set('dayLog', d); }
  function streak() {
    const days = new Set(store.get('days', []));
    const d = new Date();
    if (!days.has(isoDay(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (days.has(isoDay(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  /* 🔔 Друзі бачать лише помітне: добре пройдений тест і перехід на новий рівень.
     Нічого не розповідаємо, поки показ профілю вимкнено — це та сама згода, що й у пошуку. */
  function tellFriends(key, title, score, total) {
    const A = window.KomiksAlerts;
    if (!A || !currentUser() || store.get('shareProfile', false) !== true) return;
    if (total && score / total >= 0.6) A.share('quiz', String(key), String(title || ''));
    const lv = window.KomiksPlayers ? window.KomiksPlayers.level && window.KomiksPlayers.level() : null;
    const now = lv || (key.startsWith('level:') ? key.slice(6) : '');
    if (now && store.get('toldLevel', '') !== now) { store.set('toldLevel', now); A.share('level', now, ''); }
  }
  const bestStars = key => ((store.get('progress', {})[key]) || {}).stars || 0;
  const comicRead = c => store.get('seen.' + c.id, []).length >= c.panels.length;
  const comicDone = c => bestStars(c.id) > 0;
  // extra: { place, of, id } — місце в грі й id матчу (той самий матч не записується двічі)
  // 🎉 приємні повідомлення: серія правильних відповідей, гарний результат, повернення щодня
  const PRAISE = {
    uk: { streak: ['🔥 Три поспіль! Так тримати!', '⚡ П’ять правильних — ти в ударі!', '🌟 Сім без помилки! Неймовірно!'], first: '👋 Гарно, що ти знову тут!',
      res3: ['🏆 Ідеально! Три зірки!', '🎉 Бездоганно! Ти це знаєш!'], res2: ['👏 Молодець! Майже без помилок.', '💪 Дуже добре! Ще трішки — і три зірки.'], res1: ['🙂 Гарний початок! Спробуй ще раз.', '🌱 Крок за кроком — і вийде!'],
      day: n => `🔥 ${n} ${n === 1 ? 'день' : n < 5 ? 'дні' : 'днів'} поспіль! Чудова звичка!`, words: n => `📝 Уже ${n} слів у твоїй колекції!`, badge: '🏅 Новий значок!' },
    en: { streak: ['🔥 Three in a row! Keep going!', '⚡ Five correct — you are on fire!', '🌟 Seven without a mistake! Amazing!'], first: '👋 Great to see you again!',
      res3: ['🏆 Perfect! Three stars!', '🎉 Flawless! You know this!'], res2: ['👏 Well done! Almost no mistakes.', '💪 Very good! Nearly three stars.'], res1: ['🙂 Good start! Try once more.', '🌱 Step by step — you will get there!'],
      day: n => `🔥 ${n} ${n === 1 ? 'day' : 'days'} in a row! Great habit!`, words: n => `📝 ${n} words in your collection already!`, badge: '🏅 New badge!' },
    no: { streak: ['🔥 Tre på rad! Fortsett sånn!', '⚡ Fem riktige – du er på gli!', '🌟 Sju uten feil! Utrolig!'], first: '👋 Så fint at du er tilbake!',
      res3: ['🏆 Perfekt! Tre stjerner!', '🎉 Feilfritt! Dette kan du!'], res2: ['👏 Bra jobba! Nesten uten feil.', '💪 Veldig bra! Snart tre stjerner.'], res1: ['🙂 God start! Prøv en gang til.', '🌱 Steg for steg – du klarer det!'],
      day: n => `🔥 ${n} dager på rad! Flott vane!`, words: n => `📝 Allerede ${n} ord i samlingen din!`, badge: '🏅 Nytt merke!' },
    ar: { streak: ['🔥 ثلاث إجابات متتالية! واصل!', '⚡ خمس صحيحة — أنت متألّق!', '🌟 سبع بلا خطأ! مذهل!'], first: '👋 سعيد برؤيتك مجددًا!',
      res3: ['🏆 ممتاز! ثلاث نجوم!', '🎉 بلا أخطاء! أنت تعرف هذا!'], res2: ['👏 أحسنت! أخطاء قليلة جدًا.', '💪 جيد جدًا! اقتربت من ثلاث نجوم.'], res1: ['🙂 بداية جيدة! حاول مرة أخرى.', '🌱 خطوة بخطوة — ستنجح!'],
      day: n => `🔥 ${n} أيام متتالية! عادة رائعة!`, words: n => `📝 لديك ${n} كلمة في مجموعتك!`, badge: '🏅 وسام جديد!' }
  };
  if (window.KL_T_FILL) KL_T_FILL(PRAISE, 'app.js:PRAISE');
  const pr = (k, ...a) => { const T = PRAISE[ui] || PRAISE.en; const v = T[k]; return typeof v === 'function' ? v(...a) : v; };
  let toastT = 0;
  function praise(text) {
    if (!text || settings.praise === false) return;
    $$('.praise-toast').forEach(x => x.remove());
    const av = window.KomiksProfile && window.KomiksAvatars ? window.KomiksAvatars.el(window.KomiksProfile.avatar(), { size: 46, mood: 'cheer' }) : h('span', {}, '🎉');
    const el = h('div', { class: 'praise-toast', role: 'status' }, av, h('b', {}, text));
    document.body.append(el);
    clearTimeout(toastT); toastT = setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 400); }, 3200);
  }
  function praiseStreak(n) { const list = pr('streak'); if (n === 3) praise(list[0]); else if (n === 5) praise(list[1]); else if (n === 7) praise(list[2]); }
  function recordQuiz(key, title, score, total, extra = {}) {
    const d = dayLog();
    if (d.steps > 0 && d.cards > 0 && key !== 'mistakes') markDay('bonus');   // норму вже закрито — це додаткове
    markDay(key === 'mistakes' ? 'mistakes' : 'steps');
    tellFriends(key, title, score, total);
    if (extra.id) { const seen = store.get('recordedGames', []); if (seen.includes(extra.id)) return 0; store.set('recordedGames', [extra.id, ...seen].slice(0, 100)); }
    const pct = total ? score / total : 0;
    const st = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
    const prog = store.get('progress', {});
    const prev = prog[key] || {};
    prog[key] = { stars: Math.max(prev.stars || 0, st), best: Math.max(prev.best || 0, Math.round(pct * 100)), plays: (prev.plays || 0) + 1 };
    store.set('progress', prog);
    const log = store.get('quizlog', []);
    log.unshift(Object.assign({ key, title, score, total, stars: st, date: today() }, extra.place ? { place: extra.place, of: extra.of } : {}, extra.sec > 0 && extra.sec < 7200 ? { sec: extra.sec } : {}));
    store.set('quizlog', log.slice(0, 300));
    bump('quizzes'); if (st === 3) bump('perfect');
    quotaTick();
    setTimeout(() => praise(pick(pr(st === 3 ? 'res3' : st === 2 ? 'res2' : 'res1'))), 700);
    try { if (window.KomiksPlayers) window.KomiksPlayers.publish(true); } catch (e) { /* ignore */ }
    return st;
  }
  const BADGES = [
    { icon: '🧩', test: s => (s.quizzes || 0) >= 1 },
    { icon: '🌟', test: s => (s.perfect || 0) >= 1 },
    { icon: '📚', test: () => COMICS.every(comicRead) },
    { icon: '🧠', test: s => (s.pairs || 0) >= 3 },
    { icon: '🎙️', test: s => (s.speak3 || 0) >= 10 },
    { icon: '🎭', test: s => (s.roles || 0) >= 1 },
    { icon: '🃏', test: () => Object.values(store.get('cards', {})).filter(x => x.box >= 3).length >= 20 },
    { icon: '🔥', test: () => streak() >= 3 }
  ];

  /* ================= вимова ================= */
  const Rec = {
    Ctor: window.SpeechRecognition || window.webkitSpeechRecognition, cur: null,
    listen() {
      return new Promise(res => {
        let r;
        try { r = new this.Ctor(); } catch { return res({ error: 'unsupported' }); }
        r.lang = 'nb-NO'; r.interimResults = false; r.maxAlternatives = 5; r.continuous = false;
        let alts = [], err = null;
        r.onresult = e => { alts = [...e.results[0]].map(a => a.transcript); };
        r.onerror = e => { err = e.error; };
        r.onend = () => { this.cur = null; res(err && !alts.length ? { error: err } : { alts }); };
        this.cur = r;
        try { r.start(); } catch { res({ error: 'start' }); }
      });
    },
    stop() { try { if (this.cur) this.cur.stop(); } catch { /* ignore */ } }
  };
  function lev(a, b) {
    if (!a.length) return b.length; if (!b.length) return a.length;
    let prev = range(b.length + 1);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }
  const similarity = (target, heard) => { const a = fold(target), b = fold(heard); return a ? Math.max(0, 1 - lev(a, b) / Math.max(a.length, b.length)) : 0; };
  const scoreStars = s => (s >= 0.85 ? 3 : s >= 0.65 ? 2 : s >= 0.4 ? 1 : 0);
  let recBusy = false;
  async function practice(target, out, btn) {
    if (!Rec.Ctor) { out.replaceChildren(h('span', { class: 'rec-msg' }, t('rec_unsupported'))); return null; }
    if (recBusy) { Rec.stop(); return null; }
    recBusy = true; stopAll();
    if (btn) btn.classList.add('rec-on');
    out.replaceChildren(h('span', { class: 'rec-msg live' }, t('rec_listen'), h('b', {}, target)));
    const r = await Rec.listen();
    recBusy = false;
    if (btn) btn.classList.remove('rec-on');
    if (r.error) { out.replaceChildren(h('span', { class: 'rec-msg' }, '⚠️ ' + ((tx('rec_err') || {})[r.error] || t('rec_err_other', r.error)))); return null; }
    let best = { score: 0, text: r.alts[0] || '' };
    for (const x of r.alts) { const s = similarity(target, x); if (s > best.score) best = { score: s, text: x }; }
    const st = scoreStars(best.score);
    if (st === 3) { Sfx.good(); bump('speak3'); } else if (st) Sfx.tick(); else Sfx.bad();
    out.replaceChildren(h('span', { class: 'rec-res s' + st }, stars(st), ' ', h('b', {}, tx('rec_res')[st]), h('small', {}, t('rec_heard', best.text || '—', Math.round(best.score * 100)))));
    return best.score;
  }

  /* ================= тести (завжди норвезькою) ================= */
  const QNO = {
    who: ['Hvem sa dette?', '🗣️ Lytting'], panel: ['Hvilken rute er replikken fra?', '🖼️ Ruter'], order: ['Sett rutene i riktig rekkefølge', '🔢 Handling'],
    listen: ['Lytt og velg riktig ord', '🎧 Lytting'], hear: ['Lytt – hvilken setning hørte du?', '🎧 Lytteforståelse'], picture: ['Hva er dette?', '🖼️ Bilde'], blank: ['Hvilket ord mangler?', '✏️ Grammatikk'],
    type: ['Skriv ordet som mangler', '⌨️ Skriving'], truefalse: ['Riktig eller feil?', '🤔 Forståelse'], letter: ['Lytt og finn bokstaven', '🔤 Alfabet'],
    firstletter: ['Hvilken bokstav begynner ordet med?', '🔤 Alfabet'], emoji: ['Hva er dette?', '📝 Ord'], number: ['Lytt og finn tallet', '🔢 Tall'], numword: ['Hvilket tall er dette?', '🔢 Tall'], numtype: ['Skriv tallet du hører', '⌨️ Tall'],
    grammar: ['Velg riktig ord', '📐 Grammatikk'], clock: ['Hva er klokka?', '🕒 Klokka'],
    wordorder: ['Sett ordene i riktig rekkefølge', '🔀 Ordstilling'], match: ['Koble ord og bilde', '🔗 Par'],
    odd: ['Hvilket ord passer ikke?', '🧠 Tenk'], pickpic: ['Lytt og velg riktig bilde', '🖼️ Lytting'],
    reply: ['Hva svarer han eller hun?', '💬 Samtale'], prep: ['Hvilken preposisjon mangler?', '🧩 Preposisjon']
  };
  const NO = {
    exit: '← Avslutt', q_of: (i, n) => `Spørsmål ${i} av ${n}`, next: 'Neste ▶', result: 'Resultat 🏁', correct: 'Riktig svar: ',
    praise: ['Riktig!', 'Kjempebra!', 'Supert!', 'Bra jobbet!'], check: 'Sjekk', hint: '💡 Hint', slow: '🐢 Sakte', typeph: 'Skriv her …',
    almost: 'Nesten! Se på bokstavene: ', res: ['Prøv igjen – du klarer det! 💪', 'Ikke dårlig! Øv litt mer 🙂', 'Veldig bra! 👏', 'Perfekt! Du er en stjerne! 🌟'],
    score: (s, n, p) => `${s} av ${n} riktige · ${p} %`, repeat: 'Øv på disse:', again: '🔄 Prøv igjen', reread: '📖 Les igjen', home: '🏠 Hjem',
    order_hint: 'Trykk på rutene i riktig rekkefølge. Trykk igjen for å angre.', true: '✅ Riktig', false: '❌ Feil', says: (n, l) => `${n} sier: «${l}»`,
    only_no: 'Testen er på norsk.',
    hear: '🎧 Lytt – hva sa personen?', hear_hint: 'Teksten er skjult med vilje. Hør etter, og velg riktig setning.',
    wo_hint: 'Trykk på ordene i riktig rekkefølge. Trykk på et ord i svaret for å ta det bort.',
    wo_clear: '↩️ Start på nytt', match_hint: 'Trykk på et ord, og så på bildet som passer.',
    odd_hint: 'Tre ord hører sammen. Ett gjør ikke.'
  };
  const noTr = (text, key, cls = 'span') => withTr(h(cls, {}, text), qtr(key));
  const PICT = () => B.pictures.map(([type, no, uk, en]) => ({ type, no, uk, en }));
  const wordsOf = s => (s.match(/\p{L}{4,}/gu) || []);

  /* 🧠 Журнал помилок. З кожного тесту запам’ятовуємо, на чому саме учень спіткнувся:
     слово, його переклад, тип завдання й де це було. Далі сторінка «Мій аналіз» показує
     найчастіші помилки, найслабші теми й складає тест-повторення саме з них. */
  const ERRS = 'errlog';
  // переклад слова для журналу помилок (тематичні слова → словник коміксів)
  function trOf(word) {
    const w = norm(word); if (!w) return { uk: '', en: '' };
    const tw = themeWords().get(w);
    if (tw) return { uk: tw[0] || '', en: tw[1] || '' };
    return { uk: (window.DICT.no || {})[w] || '', en: (window.DICT.en || {})[w] || '' };
  }
  const errKey = q => {
    if (!q) return '';
    if (window.KomiksKoding && window.KomiksKoding.types.has(q.type)) return '';   // програмування — не слова
    if (q.type === 'listen' || q.type === 'picture') return String((q.item || {}).no || q.answer || '');
    if (q.type === 'blank' || q.type === 'type') return String(q.word || q.answer || '');
    if (q.type === 'letter' || q.type === 'firstletter') return String(q.answer || '');
    if (q.type === 'number' || q.type === 'numword' || q.type === 'numtype') return 'tall:' + q.n;
    if (q.type === 'prep') return 'prep:' + String(q.answer || '');
    if (q.type === 'who' || q.type === 'panel' || q.type === 'truefalse' || q.type === 'hear' || q.type === 'reply') return 'line:' + String((q.line || {}).no || '').slice(0, 40);
    if (q.type === 'grammar') return String(q.answer || '');
    if (q.type === 'odd' || q.type === 'pickpic') return String(q.answer || '');
    if (q.type === 'match') return 'par:' + String((q.pairs || [])[0] || '');
    if (q.type === 'wordorder') return 'line:' + String((q.line || {}).no || '').slice(0, 40);
    if (q.type === 'clock') return 'klokka';
    return String(q.answer || '');
  };
  function logMistake(q, quizKey, title) {
    const k = errKey(q); if (!k) return;
    const log = store.get(ERRS, {});
    const item = q.item || {};
    const cur = log[k] || { n: 0, type: q.type, uk: '', en: '', line: '', quiz: quizKey || '', qtitle: title || '' };
    cur.n++; cur.last = today(); cur.type = q.type;
    cur.box = 0; cur.due = Date.now();   // нова помилка — повторюємо вже сьогодні
    cur.quiz = quizKey || cur.quiz; cur.qtitle = title || cur.qtitle;
    // переклад беремо звідки можемо: словник коміксу, vocab або тематичні слова
    const tr = trOf(k);
    cur.uk = cur.uk || item.uk || tr.uk || '';
    cur.en = cur.en || item.en || tr.en || '';
    if (q.line && q.line.no) cur.line = q.line.no.slice(0, 120);
    log[k] = cur;
    // тримаємо журнал компактним: лишаємо 120 найсвіжіших/найчастіших
    const keys = Object.keys(log);
    if (keys.length > 120) {
      keys.sort((a, b) => (log[a].n - log[b].n) || String(log[a].last).localeCompare(String(log[b].last)));
      keys.slice(0, keys.length - 120).forEach(x => delete log[x]);
    }
    store.set(ERRS, log);
  }
  /* Журнал помилок спільний, але мова в нього пишеться явно. Курс англійської
     теж помиляється словами, і без позначки «welcome» потрапляло б у «Пари» та
     кросворд як норвезьке слово — тобто в норвезький тренажер лізли б англійські
     слова. Записи без позначки — норвезькі: такими вони й були досі. */
  const errLang = v => (v && v.lang) || 'no';
  const errList = (lang = 'no') => Object.entries(store.get(ERRS, {}))
    .filter(([, v]) => errLang(v) === lang)
    .map(([k, v]) => Object.assign({ k }, v)).sort((a, b) => b.n - a.n || String(b.last).localeCompare(String(a.last)));
  function errForget(k) { const log = store.get(ERRS, {}); delete log[k]; store.set(ERRS, log); }
  /* 🔁 Робота над помилками за інтервалами. Помилка «виправлена», коли учень відповів
     правильно тричі в різні дні: сьогодні, через день і ще через три. Правильна відповідь
     до настання терміну не зараховується — зубріння за один вечір не стирає помилку. */
  const REV_DAYS = [0, 1, 3];
  const REV_MS = 864e5;
  function errResolve(k) {
    const log = store.get(ERRS, {}), e = log[k]; if (!e) return;
    delete log[k]; store.set(ERRS, log);
    const fixed = (store.get('errFixed', []) || []).filter(x => x.k !== k);
    store.set('errFixed', [{ k, uk: e.uk || '', en: e.en || '', d: today() }, ...fixed].slice(0, 300));
  }
  function errReviewed(k) {
    const log = store.get(ERRS, {}), e = log[k]; if (!e) return;
    if ((e.due || 0) > Date.now()) return;            // ще рано — не зараховуємо
    e.box = (e.box || 0) + 1;
    if (e.box >= REV_DAYS.length) { errResolve(k); return; }
    e.due = Date.now() + REV_DAYS[e.box] * REV_MS;
    log[k] = e; store.set(ERRS, log);
  }
  const logCorrect = q => { const k = errKey(q); if (k) errReviewed(k); };
  const errDue = (lang = 'no') => errList(lang).filter(e => (e.due || 0) <= Date.now());
  /* Помилка не в тесті, а в грі: слово теж лягає в той самий журнал, тож «робота над
     помилками» бачить його і в тестах, і в «Парах». Так пам'ять акаунта одна на все. */
  function errWord(no, uk, en, quizKey, title, lang = 'no') {
    const k = String(no || '').trim(); if (!k) return;
    const log = store.get(ERRS, {});
    const tr = lang === 'no' ? trOf(k) : {};
    const cur = log[k] || { n: 0, type: 'listen', uk: '', en: '', line: '', quiz: quizKey || '', qtitle: title || '', lang };
    cur.n++; cur.last = today(); cur.type = cur.type || 'listen';
    cur.box = 0; cur.due = Date.now();
    cur.lang = cur.lang || lang;
    cur.uk = cur.uk || uk || tr.uk || '';
    cur.en = cur.en || en || tr.en || '';
    cur.quiz = quizKey || cur.quiz; cur.qtitle = title || cur.qtitle;
    log[k] = cur;
    store.set(ERRS, log);
  }

  /* coding — для коміксів «Програмування»: власні завдання (робот, код, алгоритм…) малює
     KomiksKoding. «Гра разом», іспит і тест рівня мови їх не знають, тож вмикаємо явно. */
  function comicQuestions(c, kids, coding = false) {
    const nOpt = kids ? 3 : 4;
    const all = c.panels.flatMap((p, pi) => p.lines.map(l => ({ ...l, pi })));
    const talk = all.filter(l => l.who !== 'sfx' && l.who !== 'narrator' && l.no.length > 4);
    const speakers = uniq(talk.map(l => l.who));
    const vocab = c.vocab.map(([no, uk, en]) => ({ no, uk, en: en || uk }));
    const opts = (ans, pool) => shuffle([ans, ...sample(uniq(pool).filter(x => x !== ans), nOpt - 1)]);
    const qs = [];
    if (speakers.length >= 2) sample(talk, kids ? 2 : 2).forEach(l => qs.push({ type: 'who', c, line: l, answer: l.who, options: opts(l.who, speakers) }));
    sample(talk.filter(l => l.no.length > 8), kids ? 1 : 2).forEach(l => qs.push({ type: 'panel', c, line: l, answer: l.pi, options: opts(l.pi, range(c.panels.length)) }));
    // «розстав картинки по порядку» прибрано — складно й відлякує; замість нього більше простих завдань на слух
    sample(vocab, kids ? 3 : 4).forEach(v => qs.push({ type: 'listen', item: v, answer: v.no, options: opts(v.no, vocab.map(x => x.no)) }));
    // «Hva er dette?» — предмети, які є в цьому коміксі
    const inComic = uniq(c.panels.flatMap(p => ((p.art || {}).props || []).map(pr => pr.type)));
    const pics = PICT();
    const own = pics.filter(p => inComic.includes(p.type));
    sample(own.length ? own : pics, kids ? 2 : 2).forEach(p => qs.push({ type: 'picture', item: p, answer: p.no, options: opts(p.no, pics.map(x => x.no)) }));
    if (speakers.length >= 2) sample(talk, kids ? 1 : 2).forEach(l => {
      const truth = Math.random() < 0.5;
      const who = truth ? l.who : pick(speakers.filter(s => s !== l.who));
      qs.push({ type: 'truefalse', c, line: l, statement: NO.says(nameOf(who), l.no), answer: truth });
    });
    // 🔀 порядок слів: складаємо репліку з окремих слів (V2 — найважче в норвезькій)
    const orderable = talk.filter(l => { const w = l.no.replace(/[«»"]/g, '').trim().split(/\s+/); return w.length >= 4 && w.length <= 9; });
    if (orderable.length) sample(orderable, kids ? 1 : 2).forEach(l => qs.push({ type: 'wordorder', c, line: l, answer: l.no }));
    // 🎧 аудіювання цілими реченнями: чути можна, бачити — ні
    const longTalk = talk.filter(l => l.no.length > 10);
    if (longTalk.length >= nOpt) sample(longTalk, kids ? 1 : 2).forEach(l => qs.push({ type: 'hear', c, line: l, answer: l.no, options: opts(l.no, longTalk.map(x => x.no)) }));
    /* 💬 «Що відповісти?»: беремо пару сусідніх реплік із різних вуст.
       Неправильні варіанти — інші відповіді цього ж коміксу, тому вгадати
       за довжиною чи темою не вийде. */
    const pairs = [];
    for (const p0 of c.panels) {
      const ls = (p0.lines || []).filter(l => l.who !== 'narrator' && l.who !== 'sfx');
      for (let i = 0; i + 1 < ls.length; i++) if (ls[i].who !== ls[i + 1].who) pairs.push([ls[i], ls[i + 1]]);
    }
    if (pairs.length >= 2) {
      const answers = uniq(pairs.map(x => x[1].no));
      sample(pairs, kids ? 1 : 2).forEach(([ask, rep]) => {
        if (answers.length >= nOpt) qs.push({ type: 'reply', c, line: ask, reply: rep, answer: rep.no, options: opts(rep.no, answers) });
      });
    }
    /* 🧩 Прийменники: ховаємо одне коротке службове слово. Варіанти — завжди
       прийменники, а не випадкові слова, інакше завдання розв'язується на око. */
    const PREPS = ['på', 'i', 'til', 'fra', 'med', 'om', 'for', 'av', 'under', 'over', 'etter', 'hos', 'ved', 'uten'];
    const prepLines = talk.filter(l => {
      const w = l.no.replace(/[«».,!?"]/g, '').split(/\s+/).map(x => x.toLowerCase());
      return w.some(x => PREPS.includes(x)) && w.length >= 4;
    });
    if (prepLines.length) sample(prepLines, kids ? 1 : 2).forEach(l => {
      const w = l.no.replace(/[«»]/g, '').split(/\s+/);
      const idx = w.map((x, i) => [x.toLowerCase().replace(/[.,!?]/g, ''), i]).filter(([x]) => PREPS.includes(x));
      if (!idx.length) return;
      const [word, at] = pick(idx);
      qs.push({ type: 'prep', c, line: l, at, word, answer: word, options: opts(word, PREPS) });
    });
    const pool = uniq(all.flatMap(x => wordsOf(x.no)));
    shuffle(talk.filter(l => wordsOf(l.no).length >= 2)).slice(0, kids ? 1 : 3).forEach((l, i) => {
      const w = pick(wordsOf(l.no));
      qs.push({ type: !kids && i === 2 ? 'type' : 'blank', c, line: l, word: w, answer: w, options: opts(w, pool.filter(x => norm(x) !== norm(w))) });
    });
    const KD = window.KomiksKoding;
    if (coding && KD && c.category === 'koding') return [...KD.questions(c, kids), ...sample(qs, kids ? 3 : 5)];
    return qs;
  }
  /* Малюнок для слова: мальована іконка, якщо вона є, інакше емодзі зі словника тем. */
  function picFor(word) {
    const P = window.KomiksPics;
    if (P && P.has(word)) { const el = P.el(word, 92); if (el) return el; }
    const th = ((window.WORDS || {}).themes || []);
    for (const t of th) for (const w of t.words) if (norm(w[0]) === norm(word)) return h('span', { class: 'pic-emoji' }, w[3] || '🔤');
    return h('span', { class: 'pic-emoji' }, '🔤');
  }
  // перемішуємо однаково для того самого речення — щоб кнопки не стрибали при перемалюванні
  function shuffleStable(list, seedText) {
    let x = 0; for (const ch of String(seedText)) x = (x * 31 + ch.codePointAt(0)) >>> 0;
    return list.map((v, i) => [v, (x + i * 2654435761) >>> 0]).sort((a, b) => a[1] - b[1]).map(p => p[0]);
  }
  function finishSet(qs, target) {
    const out = shuffle(qs).slice(0, target);
    const oi = out.findIndex(q => q.type === 'order');
    if (oi === 0 && out.length > 2) [out[0], out[2]] = [out[2], out[0]];
    return out;
  }
  /* 🎚️ Складність тестів. kids — найпростіше, expert — найбільше питань,
     без підказок-перекладу й із таймером на питання. */
  const DIFF = {
    kids: { size: 10, opts: 3, timer: 0, hints: true },
    adults: { size: 14, opts: 4, timer: 0, hints: true },
    hard: { size: 18, opts: 4, timer: 30, hints: false },
    expert: { size: 24, opts: 5, timer: 18, hints: false }
  };
  const diff = () => DIFF[settings.level] || DIFF.adults;
  const kidsMode = () => settings.level === 'kids';
  const quizSize = () => diff().size;
  const buildComicQuiz = (c, coding = false) => finishSet(comicQuestions(c, kidsMode(), coding), quizSize());
  function buildLevelQuiz(level) {
    const list = COMICS.filter(c => c.level === level);
    const per = Math.max(3, Math.ceil(quizSize() * 1.5 / Math.max(1, list.length)));
    return finishSet(list.flatMap(c => sample(comicQuestions(c, kidsMode()), per)), quizSize());
  }
  /* Набір «Порядок слів». Беремо репліки потрібного рівня: не надто короткі
     (з трьох слів порядок не вивчиш) і не надто довгі (понад дев'ять слів
     перетворюють вправу на складанку, де головне — не загубити шматок).
     Речення з інверсією ставимо першими: дієслово на другому місці — головне
     правило норвезької, і зустріти його треба одразу, а не в кінці. */
  function buildOrderQuiz(level) {
    const list = level === 'all' ? COMICS : COMICS.filter(c => c.level === level);
    const seen = new Set();
    const pool = [];
    for (const c of list) {
      for (const p of c.panels || []) {
        for (const l of p.lines || []) {
          if (l.who === 'sfx') continue;
          const words = String(l.no || '').trim().split(/\s+/);
          if (words.length < 4 || words.length > 9) continue;
          const key = norm(l.no);
          if (seen.has(key)) continue;
          seen.add(key);
          pool.push({ c, l, words });
        }
      }
    }
    if (!pool.length) return [];
    /* Інверсія — речення, що починається з обставини, а не з підмета:
       «I dag går vi…», «Nå skal vi…». Упізнаємо за тим, що перше слово не
       займенник і не ім'я, а друге схоже на дієслово з нашого ж словника. */
    const SUBJ = new Set(['jeg', 'du', 'han', 'hun', 'vi', 'de', 'det', 'den', 'dere', 'man']);
    const inverted = x => !SUBJ.has(norm(x.words[0])) && SUBJ.has(norm(x.words[1] || ''));
    const inv = pool.filter(inverted), rest = pool.filter(x => !inverted(x));
    const n = quizSize();
    const take = [...sample(inv, Math.min(inv.length, Math.ceil(n / 2))), ...sample(rest, n)];
    return take.slice(0, n).map(({ c, l }) => ({ type: 'wordorder', c, line: l, answer: l.no }));
  }

  function buildAlphabetQuiz() {
    const kids = kidsMode(), nOpt = diff().opts, letters = B.alphabet;
    const opts = ans => shuffle([ans, ...sample(letters.map(x => x[0]).filter(x => x !== ans), nOpt - 1)]);
    const qs = [];
    sample(letters, 7).forEach(x => qs.push({ type: 'letter', item: x, answer: x[0], options: opts(x[0]) }));
    sample(letters, 7).forEach(x => qs.push({ type: 'firstletter', item: x, answer: x[0], options: opts(x[0]) }));
    return finishSet(qs, quizSize());
  }
  function buildNumbersQuiz() {
    const kids = kidsMode(), nOpt = diff().opts, max = kids ? 20 : 100;
    const rnd = () => Math.floor(Math.random() * (max + 1));
    const opts = ans => { const s = new Set([ans]); while (s.size < nOpt) s.add(clamp(ans + Math.floor(Math.random() * 21) - 10, 0, max)); return shuffle([...s]); };
    const qs = [];
    range(6).forEach(() => { const n = rnd(); qs.push({ type: 'number', n, answer: n, options: opts(n) }); });
    range(5).forEach(() => { const n = rnd(); qs.push({ type: 'numword', n, answer: n, options: opts(n) }); });
    if (!kids) range(3).forEach(() => { const n = rnd(); qs.push({ type: 'numtype', n, answer: n }); });
    return finishSet(qs, quizSize());
  }

  /* 🔑 Демо-акаунти (Kaja, Espen…) — щоб подивитися сайт зсередини, а не вчитися в чужому профілі:
     20 різних тестів, далі просимо створити власний безкоштовний акаунт. Рахуємо ключі тестів. */
  const DEMO_MAX = 20;
  const DEMO_T = {
    uk: { t: '🔑 Це демо-акаунт', p: n => `У демо можна пройти ${n} різних тестів — вони вже пройдені. Створи власний безкоштовний акаунт: прогрес, зірки й друзі збережуться назавжди.`, cta: 'Створити акаунт', back: '← На головну', left: n => `Демо: лишилось ${n} тестів` },
    en: { t: '🔑 This is a demo account', p: n => `A demo lets you take ${n} different tests — they are all done. Create your own free account: progress, stars and friends are kept forever.`, cta: 'Create an account', back: '← Home', left: n => `Demo: ${n} tests left` },
    no: { t: '🔑 Dette er en demokonto', p: n => `I demoen kan du ta ${n} ulike prøver – de er allerede tatt. Lag din egen gratis konto: fremgang, stjerner og venner blir tatt vare på.`, cta: 'Lag en konto', back: '← Til forsiden', left: n => `Demo: ${n} prøver igjen` },
    ar: { t: '🔑 هذا حساب تجريبي', p: n => `يتيح الحساب التجريبي ${n} اختبارًا مختلفًا — وقد انتهت كلها. أنشئ حسابك المجاني: يُحفظ التقدّم والنجوم والأصدقاء للأبد.`, cta: 'إنشاء حساب', back: '→ الصفحة الرئيسية', left: n => `تجريبي: بقي ${n} اختبارًا` }
  };
  if (window.KL_T_FILL) KL_T_FILL(DEMO_T, 'app.js:DEMO_T');
  const isDemo = () => { const u = currentUser(); return !!(u && u.demo); };
  /* 🎟️ Ліміт тестів. Перші 100 учасників (засновники) і Преміум — без обмежень.
     Безкоштовний акаунт має місячний ліміт (лічильник на сервері), гість — 20 різних тестів. */
  /* ⚠️ Гостьові обмеження тимчасово вимкнені на прохання власника.
     Повернути: GUEST_MAX = 5 і GUEST_READ_MAX = 5. Код стіни, тексти чотирма
     мовами й перенесення прогресу лишилися на місці — вмикається одними
     цифрами, нічого переписувати не треба.
     GUEST_READ_MAX = 0 означає «читання без обмежень». */
  const GUEST_MAX = 1;         // тестів без акаунта: один, і лише пройдений до кінця
  const GUEST_READ_MAX = 0;    // 0 — стіни перед коміксом немає
  const QUOTA = { loaded: false, unlimited: true, left: null, limit: 25 };
  function quotaLoad() {
    if (!location.protocol.startsWith('http')) return Promise.resolve(null);
    return fetch('api/auth.php?action=quota', { credentials: 'same-origin', cache: 'no-store' }).then(r => r.json())
      .then(j => { if (j && j.ok && !j.guest) Object.assign(QUOTA, { loaded: true, unlimited: !!j.unlimited, left: j.left, limit: j.limit }); return j; })
      .catch(() => null);
  }
  function quotaTick() { // тест пройдено — зараховуємо на сервері
    const u = currentUser();
    if (!u || !u.server || u.demo || QUOTA.unlimited) return;
    fetch('api/auth.php', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Komiks': '1' }, body: JSON.stringify({ action: 'quiz_done' }) })
      .then(r => r.json()).then(j => { if (j && j.ok) Object.assign(QUOTA, { loaded: true, unlimited: !!j.unlimited, left: j.left, limit: j.limit }); }).catch(() => { /* офлайн */ });
  }
  setTimeout(quotaLoad, 1500);
  const guestDone = () => store.get('guestQuizKeys', []);
  function guestCount(key) { const d = guestDone(); if (!key || d.includes(key)) return; store.set('guestQuizKeys', [key, ...d].slice(0, 60)); }
  /* Комікси рахуємо окремо від тестів: читання і перевірка — різні заняття,
     і людина, яка просто читає, не має впиратися в стіну через тести. */
  const guestReadList = () => store.get('guestReadKeys', []);
  function guestReadCount(id) { const d = guestReadList(); if (!id || d.includes(id)) return; store.set('guestReadKeys', [id, ...d].slice(0, 60)); }
  const GUEST_T = {
    uk: { t: '🎟️ Безкоштовні тести закінчились', p: `Без акаунта можна пройти ${GUEST_MAX === 1 ? 'один тест' : GUEST_MAX + ' різних тестів'}. Створіть безкоштовний акаунт — прогрес, зірки й друзі збережуться, а тестів стане більше.`, cta: 'Створити акаунт', left: n => `Лишилось тестів без акаунта: ${n}` },
    en: { t: '🎟️ Free tests are used up', p: `Without an account you can take ${GUEST_MAX === 1 ? 'one test' : GUEST_MAX + ' different tests'}. Create a free account — progress, stars and friends are kept, and you get more tests.`, cta: 'Create an account', left: n => `Tests left without an account: ${n}` },
    no: { t: '🎟️ De gratis prøvene er brukt opp', p: `Uten konto kan du ta ${GUEST_MAX === 1 ? 'én prøve' : GUEST_MAX + ' ulike prøver'}. Lag en gratis konto – fremgang, stjerner og venner blir tatt vare på, og du får flere prøver.`, cta: 'Lag en konto', left: n => `Prøver igjen uten konto: ${n}` },
    ar: { t: '🎟️ انتهت الاختبارات المجانية', p: `بدون حساب يمكنك إجراء ${GUEST_MAX === 1 ? 'اختبارًا واحدًا' : GUEST_MAX + ' اختبارًا مختلفًا'}. أنشئ حسابًا مجانيًا — يُحفظ التقدّم والنجوم والأصدقاء وتحصل على اختبارات أكثر.`, cta: 'إنشاء حساب', left: n => `الاختبارات المتبقية بدون حساب: ${n}` }
  };
  if (window.KL_T_FILL) KL_T_FILL(GUEST_T, 'app.js:GUEST_T');
  /* Окремі тексти для читання: на стіні перед тестом і на стіні перед коміксом
     людина перебуває в різних станах, і обіцяти їм одне й те саме — означає
     нічого не пояснити. */
  const READ_T = {
    uk: { t: '📖 П’ять коміксів прочитано', p: `Без акаунта можна прочитати ${GUEST_READ_MAX} різних коміксів. Створіть безкоштовний акаунт — і читайте всі {n}.`,
      keep: '✅ Усе зроблене перенесемо: прочитані історії, зірки з тестів, серію днів і слова з карток.',
      why: 'Зараз прогрес живе лише в цьому браузері: почистите дані або візьмете інший телефон — і його немає. В акаунті він зберігається назавжди й відкривається з будь-якого пристрою.',
      cta: '📥 Створити акаунт і перенести прогрес', have: 'Уже маю акаунт',
      left: n => n === 0 ? 'Це останній комікс без акаунта — далі потрібен вхід' : `Лишилось коміксів без акаунта: ${n}` },
    en: { t: '📖 Five comics read', p: `Without an account you can read ${GUEST_READ_MAX} different comics. Create a free account and read all {n}.`,
      keep: '✅ Everything you have done comes with you: the stories you read, stars from tests, your day streak and the words in your cards.',
      why: 'Right now your progress lives only in this browser: clear its data or pick up another phone and it is gone. In an account it is kept for good and opens on any device.',
      cta: '📥 Create an account and move my progress', have: 'I already have an account',
      left: n => n === 0 ? 'This is the last comic without an account — after it you need to sign in' : `Comics left without an account: ${n}` },
    no: { t: '📖 Fem tegneserier lest', p: `Uten konto kan du lese ${GUEST_READ_MAX} ulike tegneserier. Lag en gratis konto og les alle {n}.`,
      keep: '✅ Alt du har gjort blir med: historiene du har lest, stjerner fra prøvene, dagrekken og ordene i kortene.',
      why: 'Nå ligger fremgangen din bare i denne nettleseren: tømmer du dataene eller tar en annen telefon, er den borte. I en konto blir den tatt vare på og åpnes på alle enheter.',
      cta: '📥 Lag konto og flytt fremgangen min', have: 'Jeg har allerede konto',
      left: n => n === 0 ? 'Dette er den siste tegneserien uten konto – etter den må du logge inn' : `Tegneserier igjen uten konto: ${n}` },
    ar: { t: '📖 قرأت خمس قصص', p: `بدون حساب يمكنك قراءة ${GUEST_READ_MAX} قصص مختلفة. أنشئ حسابًا مجانيًا واقرأ كل القصص الـ {n}.`,
      keep: '✅ كل ما أنجزته ينتقل معك: القصص المقروءة ونجوم الاختبارات وسلسلة الأيام وكلمات البطاقات.',
      why: 'تقدّمك الآن محفوظ في هذا المتصفح فقط: امسح بياناته أو استخدم هاتفًا آخر وسيختفي. أما في الحساب فيبقى محفوظًا ويفتح من أي جهاز.',
      cta: '📥 أنشئ حسابًا وانقل تقدّمي', have: 'لديّ حساب',
      left: n => n === 0 ? 'هذه آخر قصة بدون حساب — بعدها يلزم تسجيل الدخول' : `القصص المتبقية بدون حساب: ${n}` },
  };
  if (window.KL_T_FILL) KL_T_FILL(READ_T, 'app.js:READ_T');
  const rx = k => (READ_T[ui] || READ_T.en)[k];
  const gx = k => (GUEST_T[ui] || GUEST_T.en)[k];
  function guestWall(back = '#/') {
    return h('section', { class: 'demo-wall' }, h('h2', {}, gx('t')), h('p', {}, gx('p')),
      h('div', { class: 'row-left' }, h('a', { class: 'btn accent big', href: '#/register' }, gx('cta')), h('a', { class: 'btn', href: back }, '←')));
  }
  /* Стіна перед коміксом. Перший рядок — не «зареєструйтеся», а обіцянка
     нічого не втратити: саме це людину в цей момент і хвилює. */
  function readWall(back = '#/') {
    const total = COMICS.length;
    return h('section', { class: 'demo-wall read-wall' },
      h('h2', {}, rx('t')),
      h('p', {}, rx('p').replace('{n}', String(total))),
      h('p', { class: 'wall-keep' }, rx('keep')),
      h('p', { class: 'wall-why' }, rx('why')),
      h('div', { class: 'row-left' },
        h('a', { class: 'btn accent big', href: '#/register' }, rx('cta')),
        h('a', { class: 'btn', href: '#/login' }, rx('have')),
        h('a', { class: 'btn', href: back }, '←')),
      h('div', { class: 'wall-read' }, guestReadList().map(id => COMICS.find(c => c.id === id)).filter(Boolean).slice(0, 5).map(c =>
        h('a', { class: 'next-card', href: `#/read/${c.id}/0` },
          h('span', { class: 'next-pic' }, panelView(c, 0, {})),
          h('span', { class: 'next-meta' }, h('span', { class: 'lvl lvl-' + c.level }, c.level), h('b', {}, c.title))))));
  }

  /* Прочитані комікси лишаються відкритими назавжди — ліміт рахує різні
     історії, а не кількість заходів. */
  function readGate(c, back) {
    if (!GUEST_READ_MAX) return null;
    const u = currentUser();
    if (u || (window.KomiksAuth && window.KomiksAuth.user)) return null;
    const d = guestReadList();
    return (d.length >= GUEST_READ_MAX && !d.includes(c.id)) ? readWall(back) : null;
  }
  function readLeftNote() {
    if (!GUEST_READ_MAX) return null;
    const u = currentUser();
    if (u || (window.KomiksAuth && window.KomiksAuth.user)) return null;
    const n = Math.max(0, GUEST_READ_MAX - guestReadList().length);
    return n <= 3 ? h('p', { class: 'demo-left' }, rx('left')(n)) : null;
  }

  // що показати замість тесту (null — тест можна проходити)
  function quizGate(key, back) {
    const u = currentUser();
    if (isDemo()) return demoBlocked(key) ? demoWall(back) : null;
    if (!u || !u.server) { const d = guestDone(); return (d.length >= GUEST_MAX && !d.includes(key)) ? guestWall(back) : null; }
    if (!QUOTA.unlimited && QUOTA.left === 0) return guestWall(back);
    return null;
  }
  function quizLeftNote(key) {
    const u = currentUser();
    if (isDemo()) return demoNote(key);
    if (!u || !u.server) { const n = Math.max(0, GUEST_MAX - guestDone().length); return n <= 3 ? h('p', { class: 'demo-left' }, gx('left')(n)) : null; }
    // лічильника тестів більше немає — навчання безкоштовне, тож нічого не попереджаємо
    return null;
  }
  const demoDone = () => store.get('demoQuizKeys', []);
  function demoNote(key) { // повертає підказку «лишилось N», коли демо
    if (!isDemo()) return null;
    const left = Math.max(0, DEMO_MAX - demoDone().length);
    return h('p', { class: 'demo-left' }, (DEMO_T[ui] || DEMO_T.en).left(left));
  }
  function demoBlocked(key) { const d = demoDone(); return isDemo() && d.length >= DEMO_MAX && !d.includes(key); }
  function demoCount(key) {
    if (!isDemo() || !key) return;
    const d = demoDone(); if (d.includes(key)) return;
    store.set('demoQuizKeys', [key, ...d].slice(0, 60));
  }
  function demoWall(back = '#/') {
    const T = DEMO_T[ui] || DEMO_T.en;
    return h('section', { class: 'demo-wall' }, h('h2', {}, T.t), h('p', {}, T.p(DEMO_MAX)),
      h('div', { class: 'row-left' }, h('a', { class: 'btn accent big', href: '#/register' }, T.cta), h('a', { class: 'btn', href: back }, T.back)));
  }
  /* 📖 Підказка «з якого коміксу питання». Малюнки в тестах бувають незрозумілі без контексту,
     тому даємо посилання прямо на потрібний кадр — подивився й повернувся до тесту. */
  const SRC_T = { uk: c => `📖 З коміксу «${c}»`, en: c => `📖 From the comic “${c}”`, no: c => `📖 Fra tegneserien «${c}»`, ar: c => `📖 من قصة «${c}»` };
  function srcLink(q) {
    const c = q.c || COMICS.find(x => x.id === (q.quiz || '')) || (COMICS.find(x => x.id === srcLink.key) || null);
    if (!c) return null;
    const name = ui === 'uk' ? (c.titleUk || c.title) : ui === 'en' ? (c.titleEn || c.title) : c.title;
    const panel = q.line && typeof q.line.pi === 'number' ? q.line.pi : (typeof c.cover === 'number' ? c.cover : 0);
    return h('a', { class: 'q-src', href: `#/read/${c.id}/${panel}`, title: name }, (SRC_T[ui] || SRC_T.en)(name));
  }
  /* Привітання на ім'я: те саме, що й раніше, але звернене до людини —
     і окремий рядок, коли побито свій же рекорд. */
  const RES_HI_T = {
    uk: [n => `Не здавайся, ${n}! Спробуй ще раз 💪`, n => `Непогано, ${n}! Ще трохи практики 🙂`, n => `Дуже добре, ${n}! 👏`, n => `Ідеально, ${n}! Ти зірка 🌟`],
    en: [n => `Do not give up, ${n}! Try again 💪`, n => `Not bad, ${n}! A bit more practice 🙂`, n => `Very good, ${n}! 👏`, n => `Perfect, ${n}! You are a star 🌟`],
    no: [n => `Ikke gi opp, ${n}! Prøv igjen 💪`, n => `Ikke dårlig, ${n}! Øv litt mer 🙂`, n => `Veldig bra, ${n}! 👏`, n => `Perfekt, ${n}! Du er en stjerne 🌟`],
    ar: [n => `لا تستسلم يا ${n}! حاول مجددًا 💪`, n => `لا بأس يا ${n}! تدرّب قليلًا 🙂`, n => `جيد جدًا يا ${n}! 👏`, n => `ممتاز يا ${n}! أنت نجم 🌟`]
  };
  const RES_HI = (st, name) => ((RES_HI_T[ui] || RES_HI_T.en)[st] || RES_HI_T.en[0])(name);
  const RES_REC_T = { uk: p => `🏆 Новий особистий рекорд! Було ${p} %`, en: p => `🏆 New personal best! It was ${p} %`,
    no: p => `🏆 Ny personlig rekord! Det var ${p} %`, ar: p => `🏆 رقم شخصي جديد! كان ${p}٪` };
  const RES_REC = p => (RES_REC_T[ui] || RES_REC_T.en)(p);

  /* 🔎 Тест на весь екран. Вмикаємо лише там, де це справді потрібно — на вузькому
     екрані: на комп'ютері шапка не заважає й ховати її незручно. Клас знімається
     і на результаті, і коли людина пішла зі сторінки тесту. */
  const narrow = () => window.matchMedia && matchMedia('(max-width: 760px)').matches;
  function quizFocus(on) {
    document.body.classList.toggle('quiz-full', !!on && narrow());
  }
  // читання коміксу теж має вміщатися в екран телефона
  function readFocus(on) {
    document.body.classList.toggle('read-full', !!on && narrow());
  }
  function autoNext(box, btn, ok) {
    if (!box || settings.autoNext === false || reducedMotion()) return;
    const ms = ok ? 1800 : 4200;          // на правильну дивитись нема чого, неправильну треба прочитати
    /* Кнопка більше не потрібна: вона дрібна, на телефоні в неї важко влучити,
       а дія однакова. Лишаємо саму шторку — торкання будь-де веде далі. */
    box.classList.add('fb-auto-on');
    const bar = h('div', { class: 'fb-auto' }, h('i'));
    box.append(bar);
    requestAnimationFrame(() => { bar.firstChild.style.transition = `width ${ms}ms linear`; bar.firstChild.style.width = '0%'; });
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      clearTimeout(t);
      if (document.body.contains(btn)) btn.click();
    };
    const t = setTimeout(go, ms);
    box.addEventListener('click', go);
    box.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    box.tabIndex = 0;
    box.focus({ preventScroll: true });   // пробіл і Enter працюють одразу, без пошуку кнопки
  }
  function runQuiz({ key, title, qs, reread, back = '#/' }) {
    srcLink.key = key;   // для питань без прив’язки до коміксу — беремо комікс самого тесту
    const gate = quizGate(key, back);
    if (gate) return gate;
    /* Демо рахуємо на вході (там ліміт на відкриття), а гостьовий тест —
       лише коли дійшли до результату: зазирнути й передумати не має коштувати
       єдиної безкоштовної спроби. */
    demoCount(key);
    const S = { qs, i: 0, score: 0, wrong: [], t0: Date.now() };
    const root = h('section', { class: 'quiz' });
    let timerId = 0;
    const stopTimer = () => { clearInterval(timerId); timerId = 0; };
    const next = () => { stopTimer(); S.i++; draw(); };
    const TIMEUP = { uk: '⏱ Час вийшов!', en: '⏱ Time is up!', no: '⏱ Tiden er ute!', ar: '⏱ انتهى الوقت!' };
    const LETTERS = ['A', 'B', 'C', 'D'];

    function draw() {
      stopAll(); stopTimer();
      if (S.i >= S.qs.length) return drawResult();
      const q = S.qs[S.i];
      const [qtitle, tag] = QNO[q.type];
      const scoreEl = h('span', { class: 'stat' }, `⭐ ${S.score}`);
      const card = h('div', { class: 'q-card' }, window.KomiksIcons ? window.KomiksIcons.chip(q.type, tag) : h('span', { class: 'q-type' }, tag), withTr(h('h3', { class: 'q-title' }, qtitle), qtr(q.type)), q.type === 'hear' ? null : srcLink(q), quizLeftNote(key));
      const body = h('div', { class: 'q-body' });
      card.append(body);
      // ⏱ на складному й експертному рівнях питання має обмежений час
      const secs = diff().timer;
      if (secs) {
        const bar = h('div', { class: 'q-timer' }, h('i', { style: { width: '100%' } }));
        card.prepend(bar);
        let left = secs;
        timerId = setInterval(() => {
          left--;
          bar.firstChild.style.width = Math.max(0, (left / secs) * 100) + '%';
          bar.classList.toggle('low', left <= Math.ceil(secs / 3));
          if (left <= 0) { stopTimer(); timeUp(); }
        }, 1000);
      }
      /* Сам перехід: смужка показує, скільки лишилось, дотик до екрана скасовує.
         Якщо людина вимкнула автоперехід у налаштуваннях — нічого не робимо. */
      function timeUp() {
        if (card.querySelector('.feedback')) return;
        card.querySelectorAll('.opts').forEach(w => w.classList.add('locked'));
        card.querySelectorAll('button.opt, input, textarea').forEach(b => { b.disabled = true; });
        S.run = 0; S.wrong.push({ q, correctLabel: '' }); logMistake(q, key, title);
        Sfx.bad();
        const nextBtn = h('button', { class: 'btn yellow', type: 'button', onclick: next }, S.i + 1 < S.qs.length ? NO.next : NO.result);
        card.append(h('div', { class: 'feedback no', role: 'status' }, h('span', { style: { fontSize: '2rem' } }, '⏱'),
          h('span', { class: 'msg' }, (TIMEUP[ui] || TIMEUP.en)), nextBtn));
        nextBtn.focus({ preventScroll: true });
      }

      const feedback = (ok, correctLabel, sayCorrect, answerWord) => {
        stopTimer();
        if (ok) { S.score++; Sfx.good(); S.run = (S.run || 0) + 1; praiseStreak(S.run); } else S.run = 0;
        if (ok) logCorrect(q); else { S.wrong.push({ q, correctLabel }); logMistake(q, key, title); Sfx.bad(); }
        const nextBtn = withTr(h('button', { class: 'btn ' + (ok ? 'good' : 'yellow'), type: 'button', onclick: next }, S.i + 1 < S.qs.length ? NO.next : NO.result), qtr(S.i + 1 < S.qs.length ? 'next' : 'result'));
        card.append(h('div', { class: 'feedback ' + (ok ? 'ok' : 'no'), role: 'status' },
          h('span', { style: { fontSize: '2rem' } }, ok ? pick(['🎉', '🌟', '👏']) : '🤔'),
          h('span', { class: 'msg' }, ok ? pick(NO.praise) : [withTr(h('span', {}, NO.correct), qtr('correct')), h('em', {}, typeof correctLabel === 'string' ? hoverWords(q.c, correctLabel) : correctLabel)]),
          sayCorrect ? h('button', { class: 'play', type: 'button', onclick: sayCorrect }, '🔊') : null,
          nextBtn));
        nextBtn.focus({ preventScroll: true });
        nextBtn.scrollIntoView({ block: 'nearest', behavior: reducedMotion() ? 'auto' : 'smooth' });
        autoNext(card.querySelector('.feedback'), nextBtn, ok);
        // 🔊 похвала голосом норвезькою в кожному питанні, а вже після неї — правильне слово
        cheer(ok, ok ? answerWord : null).then(tok => { if (!ok && sayCorrect && tok === playToken) sayCorrect(); });
        scoreEl.textContent = `⭐ ${S.score}`;
      };
      const choice = (options, render, isRight, correctLabel, sayCorrect, cls = '', answerWord = null) => {
        const wrap = h('div', { class: 'opts ' + cls });
        const btns = options.map((o, k) => {
          const b = h('button', { class: 'opt', type: 'button' }, render(o, k));
          b.addEventListener('click', () => {
            if (wrap.classList.contains('locked')) return;
            wrap.classList.add('locked');
            const ok = isRight(o);
            btns.forEach((x, j) => { if (isRight(options[j])) x.classList.add('good'); else if (x !== b) x.classList.add('dim'); });
            if (!ok) b.classList.add('bad');
            feedback(ok, correctLabel, sayCorrect, answerWord);
          });
          return b;
        });
        wrap.append(...btns);
        return wrap;
      };
      // спроба ще раз: помилка → «Ikke bra. Prøv igjen!», друга помилка → показуємо відповідь; бал лише з першої спроби
      const retryChoice = (options, render, answer, label, answerWord, sayCorrect) => {
        const wrap = h('div', { class: 'opts letters-opts' });
        let tries = 0;
        const btns = options.map(o => {
          const b = h('button', { class: 'opt', type: 'button' }, render(o));
          b.addEventListener('click', () => {
            if (wrap.classList.contains('locked') || b.disabled) return;
            if (o !== answer) {
              tries++; b.classList.add('bad'); b.disabled = true;
              if (tries < 2) { Sfx.bad(); cheer(false); return; }
              wrap.classList.add('locked');
              btns.forEach((x, j) => { if (options[j] === answer) x.classList.add('good'); else if (!x.disabled) x.classList.add('dim'); });
              feedback(false, label, sayCorrect);
              return;
            }
            wrap.classList.add('locked');
            btns.forEach((x, j) => { if (options[j] === answer) x.classList.add('good'); else if (!x.disabled) x.classList.add('dim'); });
            if (tries > 0) S.score--;
            feedback(true, label, sayCorrect, answerWord);
          });
          return b;
        });
        wrap.append(...btns);
        return wrap;
      };
      const say = (text, who = 'narrator', rate = 1) => () => { claim().then(my => { if (my === playToken) Speech.speak(text, who, { rate }); }); };
      const bigPlay = (fn, autoPlay = true) => {
        const b = h('button', { class: 'big-play' + (settings.level === 'kids' ? ' pulse' : ''), type: 'button', 'aria-label': 'Lytt', onclick: () => { b.classList.remove('pulse'); fn(); } }, '🔊');
        if (autoPlay) setTimeout(fn, 450);
        return b;
      };
      const wordOpt = o => hoverWords(q.c, o);
      const typeRow = (answer, onDone) => {
        const input = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: NO.typeph, inputmode: typeof answer === 'number' ? 'numeric' : 'text' });
        const check = withTr(h('button', { class: 'btn primary', type: 'button' }, NO.check), qtr('check'));
        const hint = withTr(h('button', { class: 'btn', type: 'button', onclick: () => { input.value = String(answer).slice(0, Math.max(1, input.value.length + 1)); input.focus(); } }, NO.hint), qtr('hint'));
        const letters = typeof answer === 'number' ? [] : ['å', 'ø', 'æ'].map(k => h('button', { type: 'button', onclick: () => { input.setRangeText(k, input.selectionStart, input.selectionEnd, 'end'); input.focus(); } }, k));
        const submit = () => {
          if (check.disabled || !input.value.trim()) return;
          check.disabled = true; input.disabled = true; hint.disabled = true;
          onDone(input.value);
        };
        check.addEventListener('click', submit);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
        setTimeout(() => input.focus({ preventScroll: true }), 50);
        return [h('div', { class: 'type-row' }, input, check, hint), letters.length ? h('div', { class: 'letters' }, letters) : null];
      };

      if (q.type === 'who') {
        body.append(h('div', { class: 'q-prompt' }, bigPlay(say(q.line.no, q.line.who)), h('div', { class: 'say' }, '«', wordSpans(q.c, q.line.no), '»')),
          choice(q.options, w => [h('span', { class: 'ava', style: { background: ch(w).color } }, ch(w).emoji), h('span', {}, ch(w).no)], w => w === q.answer, ch(q.answer).no, say(q.line.no, q.line.who)));
      } else if (q.type === 'panel') {
        body.append(h('div', { class: 'q-prompt' }, bigPlay(say(q.line.no, q.line.who)), h('div', { class: 'say' }, '«', wordSpans(q.c, q.line.no), '»')),
          choice(q.options, (pi, k) => [h('span', { class: 'badge' }, LETTERS[k]), panelView(q.c, pi, { bubbles: false })], pi => pi === q.answer, LETTERS[q.options.indexOf(q.answer)], null, 'pics'));
        $$('.opt', body).forEach(b => b.classList.add('pic'));
      } else if (q.type === 'listen') {
        const s = say(q.item.no, 'narrator', 0.85);
        body.append(h('div', { class: 'q-prompt' }, bigPlay(s), withTr(h('button', { class: 'btn', type: 'button', onclick: say(q.item.no, 'narrator', 0.55) }, NO.slow), qtr('slow'))),
          choice(q.options, wordOpt, o => o === q.answer, q.answer, s, '', q.answer));
        $$('.opt', body).forEach(b => b.classList.add('word'));
      } else if (q.type === 'hear') {
        const s = say(q.line.no, q.line.who, 0.95);
        body.append(h('div', { class: 'q-prompt center' }, bigPlay(s),
          h('div', { class: 'row-center' }, withTr(h('button', { class: 'btn', type: 'button', onclick: say(q.line.no, q.line.who, 0.6) }, NO.slow), qtr('slow'))),
          noTr(NO.hear_hint, 'hear_hint', 'p')),
          choice(q.options, o => o, o => o === q.answer, q.answer, s));
        $$('.opt', body).forEach(b => b.classList.add('word', 'hear-opt'));
      } else if (q.type === 'reply') {
        // спершу чуємо питання — відповідь шукаємо вже «на слух розмови»
        const sAsk = say(q.line.no, q.line.who, 0.95);
        body.append(h('div', { class: 'q-prompt' }, bigPlay(sAsk),
          h('div', { class: 'say-box' },
            h('b', {}, nameOf(q.line.who) + ': '),
            hoverWords(q.c, q.line.no))),
          choice(q.options, o => o, o => o === q.answer, q.answer, say(q.answer, q.reply.who, 0.95), 'wide', q.answer));
        $$('.opt', body).forEach(b => b.classList.add('word', 'hear-opt'));
      } else if (q.type === 'prep') {
        /* Речення показуємо з пропуском на місці прийменника: решта слів лишається
           підказкою, бо саме з контексту й визначають, який прийменник доречний. */
        const w = q.line.no.replace(/[«»]/g, '').split(/\s+/);
        const shown = w.map((x, i) => i === q.at ? '____' : x).join(' ');
        const sFull = say(q.line.no, q.line.who, 0.95);
        body.append(h('div', { class: 'q-prompt' }, bigPlay(sFull), h('div', { class: 'say-box' }, shown)),
          choice(q.options, o => o, o => norm(o) === norm(q.answer), q.answer, sFull, '', q.answer));
        $$('.opt', body).forEach(b => b.classList.add('word'));
      } else if (q.type === 'wordorder') {
        const clean = q.line.no.replace(/[«»"]/g, '').trim();
        const words = clean.split(/\s+/);
        const picked = [], out = h('div', { class: 'wo-out' }), bank = h('div', { class: 'wo-bank' });
        const sayLine = say(clean, q.line.who, 0.9);
        const draw = () => {
          out.replaceChildren(...picked.map((w, i) => h('button', { class: 'wo-w', type: 'button', onclick: () => { if (out.classList.contains('locked')) return; picked.splice(i, 1); draw(); } }, w)));
          const left = words.slice();
          picked.forEach(w => { const k = left.indexOf(w); if (k >= 0) left.splice(k, 1); });
          bank.replaceChildren(...shuffleStable(left, clean).map(w => h('button', { class: 'wo-w bank', type: 'button', onclick: () => { if (out.classList.contains('locked')) return; picked.push(w); Sfx.tick(); draw(); if (picked.length === words.length) check(); } }, w)));
        };
        const check = () => {
          out.classList.add('locked');
          const ok = picked.join(' ') === words.join(' ');
          out.classList.add(ok ? 'good' : 'bad');
          feedback(ok, clean, sayLine, ok ? clean : null);
        };
        body.append(h('div', { class: 'q-prompt' }, bigPlay(sayLine), noTr(NO.wo_hint, 'wo_hint', 'p')),
          out, bank,
          h('div', { class: 'row-center' }, withTr(h('button', { class: 'btn', type: 'button', onclick: () => { if (!out.classList.contains('locked')) { picked.length = 0; draw(); } } }, NO.wo_clear), qtr('wo_clear'))));
        draw();
      } else if (q.type === 'match') {
        const pairs = q.pairs.slice();
        const left = shuffle(pairs.slice()), right = shuffle(pairs.slice());
        let sel = null, wrong = 0, done = 0;
        const wrap = h('div', { class: 'match-grid' });
        const colW = h('div', { class: 'match-col' }), colP = h('div', { class: 'match-col' });
        const btnW = new Map(), btnP = new Map();
        const finish = () => feedback(wrong <= 1, pairs.map(w => w).join(' · '), null);
        left.forEach(w => {
          const b = h('button', { class: 'opt word match-w', type: 'button', onclick: () => {
            if (b.classList.contains('done')) return;
            btnW.forEach(x => x.classList.remove('sel'));
            b.classList.add('sel'); sel = w; Sfx.tick();
            claim().then(my => { if (my === playToken) Speech.speak(w, 'narrator', { rate: 0.9 }); });   // чуємо слово, а не лише бачимо
          } }, w);
          btnW.set(w, b); colW.append(b);
        });
        right.forEach(w => {
          const b = h('button', { class: 'opt pic match-p', type: 'button', onclick: () => {
            if (!sel || b.classList.contains('done')) return;
            if (sel === w) {
              btnW.get(sel).classList.add('done'); b.classList.add('done');
              btnW.get(sel).classList.remove('sel'); sel = null; done++; Sfx.good();
              if (done === pairs.length) finish();
            } else { wrong++; b.classList.add('shake'); Sfx.bad(); setTimeout(() => b.classList.remove('shake'), 400); }
          } }, picFor(w));
          btnP.set(w, b); colP.append(b);
        });
        wrap.append(colW, colP);
        body.append(noTr(NO.match_hint, 'match_hint', 'p'), wrap);
      } else if (q.type === 'odd') {
        body.append(noTr(NO.odd_hint, 'odd_hint', 'p'),
          choice(q.options, o => o, o => o === q.answer, q.answer, say(q.answer), '', q.answer));
        $$('.opt', body).forEach(b => b.classList.add('word'));
      } else if (q.type === 'pickpic') {
        const s = say(q.answer, 'narrator', 0.85);
        body.append(h('div', { class: 'q-prompt center' }, bigPlay(s)),
          choice(q.options, o => picFor(o), o => o === q.answer, q.answer, s, 'pics', q.answer));
        $$('.opt', body).forEach(b => b.classList.add('pic', 'pic-word'));
      } else if (q.type === 'picture') {
        body.append(h('div', { class: 'q-prompt center' }, h('div', { class: 'pict' }, svgEl(ART ? ART.propSVG(q.item.type) : '<svg/>'))),
          choice(q.options, o => o, o => o === q.answer, q.answer, say(q.answer), '', q.answer));
        $$('.opt', body).forEach(b => b.classList.add('word'));
      } else if (q.type === 'truefalse') {
        body.append(h('div', { class: 'q-prompt' }, h('div', { class: 'panel-mini' }, panelView(q.c, q.line.pi, { bubbles: false })), h('div', { class: 'say' }, wordSpans(q.c, q.statement))),
          choice([true, false], v => withTr(h('span', {}, v ? NO.true : NO.false), qtr(v ? 'true' : 'false')), v => v === q.answer, q.answer ? NO.true : NO.false, say(q.line.no, q.line.who), 'two'));
      } else if (q.type === 'blank' || q.type === 'type') {
        const text = q.line.no, at = text.indexOf(q.word);
        const sentence = h('div', { class: 'say' }, wordSpans(q.c, text.slice(0, at)), h('span', { class: 'blank' }, '?'), wordSpans(q.c, text.slice(at + q.word.length)));
        const reveal = () => { $('.blank', sentence).textContent = q.word; };
        body.append(h('div', { class: 'q-prompt' }, h('span', { class: 'ava', style: { background: ch(q.line.who).color, width: '64px', height: '64px' } }, ch(q.line.who).emoji), sentence));
        if (q.type === 'blank') {
          body.append(choice(q.options, wordOpt, o => o === q.answer, q.answer, () => { reveal(); say(q.line.no, q.line.who)(); }));
          $$('.opt', body).forEach(b => b.classList.add('word'));
        } else {
          body.append(...typeRow(q.word, val => {
            const exact = norm(val) === norm(q.word), close = fold(val) === fold(q.word);
            reveal();
            if (!exact && close) { Sfx.good(); S.score++; scoreEl.textContent = `⭐ ${S.score}`; card.append(h('div', { class: 'feedback ok' }, h('span', { class: 'msg' }, NO.almost, h('em', {}, q.word)), h('button', { class: 'btn good', type: 'button', onclick: next }, NO.next))); return; }
            feedback(exact, q.word, say(q.line.no, q.line.who));
          }));
        }
      } else if (q.type === 'order') {
        const picked = [], shuffled = shuffle(q.panels);
        const wrap = h('div', { class: 'opts pics' });
        const btns = shuffled.map(pi => {
          const b = h('button', { class: 'opt pic', type: 'button' }, panelView(q.c, pi, { bubbles: false }));
          b.addEventListener('click', () => {
            if (wrap.classList.contains('locked')) return;
            const k = picked.indexOf(pi);
            if (k >= 0) picked.splice(k); else { picked.push(pi); Sfx.tick(); }
            btns.forEach((x, j) => { const pos = picked.indexOf(shuffled[j]); const old = $('.badge', x); if (old) old.remove(); if (pos >= 0) x.prepend(h('span', { class: 'badge' }, pos + 1)); });
            if (picked.length === q.panels.length) {
              wrap.classList.add('locked');
              const ok = picked.every((v, j) => v === q.panels[j]);
              btns.forEach((x, j) => x.classList.add(q.panels.indexOf(shuffled[j]) === picked.indexOf(shuffled[j]) ? 'good' : 'bad'));
              feedback(ok, q.panels.map(v => shuffled.indexOf(v) + 1).map(n => '#' + n).join(' → '), null);
            }
          });
          return b;
        });
        wrap.append(...btns);
        body.append(withTr(h('p', { class: 'hint', style: { marginBottom: '14px' } }, NO.order_hint), qtr('order_hint')), wrap);
      } else if (q.type === 'letter') {
        const s = say(q.item[1], 'narrator', 0.85);
        body.append(h('div', { class: 'q-prompt' }, bigPlay(s)), choice(q.options, o => h('span', { class: 'big-letter' }, o), o => o === q.answer, q.answer, s, 'letters-opts'));
      } else if (q.type === 'firstletter') {
        const s = say(q.item[2], 'narrator', 0.85);
        const ap = alphaPic(q.item[0], q.item[2], 120);
        body.append(h('div', { class: 'q-prompt' }, bigPlay(s), ap ? h('div', { class: 'alpha-q-pic' }, ap) : null, h('div', { class: 'say big' }, (ap ? '' : q.item[3] + ' ') + q.item[2].slice(1).replace(/./g, '_').replace(/^/, '?'))),
          choice(q.options, o => h('span', { class: 'big-letter' }, o), o => o === q.answer, `${q.answer} — ${q.item[2]}`, s, 'letters-opts'));
      } else if (q.type === 'number' || q.type === 'numword') {
        const word = B.numberWord(q.n), s = say(word, 'narrator', 0.9);
        body.append(h('div', { class: 'q-prompt' }, q.type === 'number' ? bigPlay(s) : h('div', { class: 'say big' }, word)),
          retryChoice(q.options, o => h('span', { class: 'big-letter' }, String(o)), q.answer, `${q.n} — ${word}`, word, s));
      } else if (q.type === 'emoji') {
        body.append(h('div', { class: 'q-prompt center' }, h('div', { class: 'emoji-big' }, window.KomiksPics && window.KomiksPics.has(q.item.no, q.item.uk) ? window.KomiksPics.el(q.item.no, 150, q.item.uk) : q.item.emoji)), // мальована іконка, якщо емодзі неоднозначне
          choice(q.options, o => o, o => o === q.answer, q.answer, say(q.answer, 'narrator', 0.9), '', q.answer));
        $$('.opt', body).forEach(b => b.classList.add('word'));
      } else if (q.type === 'grammar') {
        const sentence = h('div', { class: 'say' }, wordSpans(null, q.before), h('span', { class: 'blank' }, '?'), wordSpans(null, q.after));
        body.append(h('div', { class: 'q-prompt' }, h('span', { class: 'gram-q-ico' }, '📐'), sentence),
          choice(q.options, wordOpt, o => o === q.answer, q.sentence, () => { $('.blank', sentence).textContent = q.answer; say(q.sentence)(); }));
        $$('.opt', body).forEach(b => b.classList.add('word'));
      } else if (q.type === 'clock') {
        body.append(h('div', { class: 'q-prompt center' }, h('div', { class: 'pict clock-pict' }, svgEl(window.KomiksGrammar.clockSVG(q.time)))),
          choice(q.options, wordOpt, o => o === q.answer, `${q.time} — ${q.answer}`, say(q.sentence)));
        $$('.opt', body).forEach(b => b.classList.add('word'));
      } else if (window.KomiksKoding && window.KomiksKoding.types.has(q.type)) {
        window.KomiksKoding.render(q, body, { choice, feedback });
      } else if (q.type === 'numtype') {
        const word = B.numberWord(q.n), s = say(word, 'narrator', 0.9);
        body.append(h('div', { class: 'q-prompt' }, bigPlay(s)), ...typeRow(q.n, val => { const ok = parseInt(val, 10) === q.n; feedback(ok, `${q.n} — ${word}`, s); if (ok) cheer(true, word); }));
      }

      root.replaceChildren(
        h('div', { class: 'q-head' }, withTr(h('a', { class: 'btn', href: back }, NO.exit), qtr('exit')), h('h2', {}, `🧩 ${title}`), scoreEl),
        withTr(h('p', { class: 'hint only-no' }, NO.only_no), qtr('only_no')),
        h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': S.qs.length, 'aria-valuenow': S.i }, h('i', { style: { width: (S.i / S.qs.length * 100) + '%' } })),
        h('div', { class: 'panel-label', style: { marginBottom: '10px' } }, NO.q_of(S.i + 1, S.qs.length)),
        card);
      quizFocus(true);
      window.scrollTo({ top: 0 });
    }

    /* Показуємо лише для тестів, прив'язаних до коміксу: після зведеного тесту
       по рівню «наступна історія» нічого не означає. */
    function nextBlock() {
      const cur = COMICS.find(x => x.id === key);
      if (!cur) return null;
      const list = nextComics(cur, 3);
      if (!list.length) return h('p', { class: 'next-none muted' }, t('next_none'));
      return h('div', { class: 'next-up' },
        h('b', {}, t('next_up')),
        h('p', { class: 'next-lead' }, t('next_pick')),
        h('div', { class: 'next-row' }, list.map(nextCard)));
    }

    function drawResult() {
      quizFocus(false);
      guestCount(key);   // тест пройдено до кінця — ось тепер зараховуємо
      const pct = S.qs.length ? S.score / S.qs.length : 0;
      const target = Math.round(pct * 100);
      const prevBest = (store.get('progress', {})[key] || {}).best || 0;
      const st = recordQuiz(key, title, S.score, S.qs.length, { sec: Math.round((Date.now() - S.t0) / 1000) });
      if (st >= 2) { confetti(); Sfx.win(); }

      // кільце прогресу: заповнюється разом із лічильником — результат видно, а не просто написано
      const R = 52, CIRC = 2 * Math.PI * R;
      const ring = svgEl(`<svg class="res-ring" viewBox="0 0 120 120" role="img" aria-label="${target} %">
        <circle cx="60" cy="60" r="${R}" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="12"/>
        <circle class="res-arc" cx="60" cy="60" r="${R}" fill="none" stroke="currentColor" stroke-width="12"
          stroke-linecap="round" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}" transform="rotate(-90 60 60)"/>
      </svg>`);
      const num = h('b', { class: 'res-num' }, '0');
      const arc = ring.querySelector('.res-arc');
      let shown = 0;
      const tick = setInterval(() => {
        shown = Math.min(target, shown + Math.max(1, Math.round(target / 28)));
        num.textContent = shown;
        if (arc) arc.style.strokeDashoffset = String(CIRC * (1 - shown / 100));
        if (shown >= target) clearInterval(tick);
      }, 26);

      const stars = h('div', { class: 'res-stars' }, range(3).map(i => h('span', { class: i < st ? 'f' : '', style: { '--d': (i * 0.18 + 0.2) + 's' } }, '★')));
      const u = currentUser();
      const hi = u && u.name ? RES_HI(st, u.name) : NO.res[st];
      const record = target > prevBest && prevBest > 0;

      root.replaceChildren(h('div', { class: 'q-card result res-new lvl' + st },
        h('div', { class: 'res-hero' },
          window.KomiksAvatars ? h('span', { class: 'res-ava' }, window.KomiksAvatars.el(window.KomiksProfile ? window.KomiksProfile.avatar() : '🦊', { size: 110, mood: st >= 2 ? 'cheer' : 'idle' })) : null,
          h('div', { class: 'res-ringwrap' }, ring, h('span', { class: 'res-pct' }, num, h('i', {}, '%')))),
        stars,
        h('h2', { class: 'res-hi' }, hi),
        h('p', { class: 'res-score' }, NO.score(S.score, S.qs.length, target)),
        record ? h('p', { class: 'res-record' }, RES_REC(prevBest)) : null,
        S.wrong.length ? h('div', { class: 'res-wrong' }, withTr(h('b', {}, NO.repeat), qtr('repeat')),
          h('div', { class: 'res-wrong-list' }, S.wrong.map(({ q, correctLabel }) => {
            const said = String(correctLabel);
            return h('div', { class: 'res-w' },
              h('span', { class: 'res-w-t' }, QNO[q.type] ? QNO[q.type][1] : ''),
              q.line ? h('span', { class: 'res-w-q' }, '«' + q.line.no + '»') : null,
              h('b', {}, said),
              h('button', { class: 'play small', type: 'button', title: '🔊', onclick: () => { claim().then(my => { if (my === playToken) Speech.speak(q.line ? q.line.no : said, 'narrator', { rate: 0.85 }); }); } }, '🔊'));
          }))) : null,
        h('div', { class: 'row-center res-acts' },
          withTr(h('a', { class: 'btn accent big', href: location.hash, onclick: e => { e.preventDefault(); route(); } }, NO.again), qtr('again')),
          S.wrong.length ? h('a', { class: 'btn', href: '#/analysis' }, AN_T().short) : null,
          reread ? withTr(h('a', { class: 'btn primary', href: reread }, NO.reread), qtr('reread')) : null,
          withTr(h('a', { class: 'btn', href: back }, NO.home), qtr('home'))),
        window.KomiksExtras && window.KomiksExtras.shareResult ? window.KomiksExtras.shareResult({ title: title, score: S.score, total: S.qs.length }) : null,
        /* Тест — справжній кінець історії, і саме тут людина вирішує, читати ще
           чи закрити вкладку. Тому вибір пропонуємо тут, а не ховаємо на головній
           серед вісімдесяти одного пункту. */
        nextBlock()));
      window.scrollTo({ top: 0 });
    }

    keyHandler = e => {
      if (e.target.closest('input, textarea')) return;
      const k = parseInt(e.key, 10);
      if (k >= 1 && k <= 4) { const b = $$('.opts:not(.locked) .opt', root)[k - 1]; if (b) b.click(); }
    };
    draw();
    return root;
  }

  /* ================= вітання, згода ================= */
  const TERMS_VERSION = '2026-09-23';
  const hasConsent = () => (raw.get('comiks.consent', null) || {}).v === TERMS_VERSION;
  const termsList = () => h('div', { class: 'terms-list' }, tx('terms').map(([title, text], i) => h('section', {}, h('h3', {}, `${i + 1}. ${title}`), h('p', {}, text))));
  function langChoices(onPick) {
    return h('div', { class: 'choices three' }, LANGS.map(([code, label]) =>
      h('button', { type: 'button', class: 'choice' + (ui === code ? ' on' : ''), onclick: () => { setUi(code); onPick && onPick(); } }, h('b', {}, label))));
  }
  function welcome() {
    if (hasConsent()) return;
    $$('.modal-back').forEach(m => m.remove());
    const back = h('div', { class: 'modal-back welcome-back' });
    document.body.classList.add('welcome-open');
    const agree = h('input', { type: 'checkbox', id: 'agreeBox' });
    const go = h('button', { type: 'button', class: 'btn accent big welcome-go', disabled: true, onclick: () => {
      if (!agree.checked) return;
      raw.set('comiks.consent', { v: TERMS_VERSION, at: today() });
      raw.set('comiks.welcomed', true); document.body.classList.remove('welcome-open'); back.remove(); route();
    } }, t('welcome_go'));
    agree.addEventListener('change', () => { go.disabled = !agree.checked; });
    const learner = (val) => { const [label, sub] = tx('learner')[val]; return h('button', { type: 'button', class: 'choice' + (settings.level === val ? ' on' : ''), onclick: e => { settings.level = val; saveSettings(); $$('.choice.lrn', back).forEach(b => b.classList.toggle('on', b === e.currentTarget)); } }, h('b', {}, label), h('small', {}, sub)); };
    const language = h('select', { class: 'welcome-language', id: 'welcomeLanguage' },
      LANGS.map(([code, label]) => h('option', { value: code, selected: ui === code }, label)));
    const learnerSelect = h('select', { class: 'welcome-level-select', 'aria-label': t('welcome_q') },
      ['kids', 'adults', 'hard', 'expert'].map(v => h('option', { value: v, selected: settings.level === v }, tx('learner')[v][0])));
    learnerSelect.addEventListener('change', () => { settings.level = learnerSelect.value; saveSettings(); back.remove(); welcome(); document.querySelector('.welcome-level-select')?.focus(); });
    language.addEventListener('change', () => { setUi(language.value); back.remove(); welcome(); document.querySelector('.welcome-language')?.focus(); });
    const termsButton = h('button', { type: 'button', class: 'welcome-terms-button', onclick: () => {
      const modal = back.querySelector('.welcome-modal');
      modal.hidden = true;
      const close = h('button', { type: 'button', class: 'btn welcome-terms-back', onclick: () => { details.remove(); modal.hidden = false; termsButton.focus(); } }, t('back'));
      const details = h('div', { class: 'modal welcome-terms', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('terms_full') },
        close, h('h2', {}, t('warn_title')), h('ul', {}, tx('warn_points').map(x => h('li', {}, x))), termsList());
      back.append(details); close.focus();
    } }, t('terms_full'));
    back.append(h('div', { class: 'modal welcome-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'welcomeTitle' },
      h('h2', { id: 'welcomeTitle' }, t('welcome_title')),
      h('p', { class: 'welcome-lead' }, t('welcome_lead')),
      h('label', { class: 'welcome-language-label', for: 'welcomeLanguage' }, t('welcome_lang'), language),
      h('div', { class: 'welcome-learners' }, h('p', { class: 'modal-q' }, t('welcome_q')),
        learnerSelect,
        h('div', { class: 'choices' }, ['kids', 'adults', 'hard', 'expert'].map(v => learner(v)).map(b => { b.classList.add('lrn'); return b; }))),
      h('div', { class: 'warn-box' }, h('h3', {}, t('warn_title')), h('p', {}, tx('warn_points')[0]), termsButton),
      h('label', { class: 'agree', for: 'agreeBox' }, agree, h('span', {}, t('consent_label'))),
      go));
    document.body.append(back);
  }

  /* ================= знайомство після першого входу =================
     Перше вікно (welcome) питає мову й згоду — воно про правила. Це друге й
     показується рівно один раз на акаунт, одразу після першого входу: людина
     щойно зареєструвалася і ще не знає, що тут узагалі є.
     Тримаємо його в один екран без гортання: те, що не влізло, однаково не
     читають. Позначка живе в даних акаунта, тож на іншому пристрої вікно вдруге
     не вискочить. */
  const TOUR_T = {
    uk: {
      title: '👋 Вітаємо в Комікс·Lab!',
      lead: 'Тут ми вчимо норвезьку через кумедні комікси. Текст і голоси — норвезькі, а переклад вашою мовою зʼявляється, щойно ви торкнетеся тексту.',
      lang: 'Мова',
      t1: '📖 Комікси з озвученням', d1: 'A1–B2, живі голоси, переклад кожного слова',
      t2: '🧩 Тести й картки', d2: 'повертають саме ті слова, у яких ви помиляєтесь',
      t3: '🔤 Слова за темами', d3: 'з картинкою та звуком — від базових до роботи й житла',
      t4: '🎮 Ігри разом', d4: 'кімната з QR-кодом для класу, сімʼї чи друзів',
      promo_t: '🎁 Перші 100 користувачів — повний доступ назавжди',
      promo_d: 'Ви серед них. Платити не треба нічого: акаунт відкриває все без обмежень.',
      l_new: '✨ Що нового', l_help: '📘 Як користуватися', l_write: '🐞 Написати нам',
      write_hint: 'Знайшли помилку або хочете тему для нового коміксу — пишіть просто із застосунку.',
      go: '🚀 Почати',
    },
    en: {
      title: '👋 Welcome to Komiks·Lab!',
      lead: 'Here we learn Norwegian through funny comics. The text and the voices are Norwegian, and the translation into your language appears the moment you tap the text.',
      lang: 'Language',
      t1: '📖 Voiced comics', d1: 'A1–B2, real voices, every word translated',
      t2: '🧩 Tests and flashcards', d2: 'they bring back exactly the words you get wrong',
      t3: '🔤 Words by topic', d3: 'with a picture and audio — from the basics to work and housing',
      t4: '🎮 Play together', d4: 'a room with a QR code for a class, a family or friends',
      promo_t: '🎁 The first 100 users get full access for good',
      promo_d: 'You are one of them. Nothing to pay: the account opens everything, with no limits.',
      l_new: '✨ What’s new', l_help: '📘 How it works', l_write: '🐞 Write to us',
      write_hint: 'Found a mistake, or want a topic for a new comic — write to us straight from the app.',
      go: '🚀 Start',
    },
    no: {
      title: 'Velkommen til Komiks·Lab! 👋',
      lead: 'Her lærer vi norsk med morsomme tegneserier. Tekst og stemmer er på norsk, og oversettelsen til ditt språk vises når du trykker på teksten.',
      lang: 'Språk',
      t1: '📖 Tegneserier med lyd', d1: 'A1–B2, ekte stemmer, oversettelse av hvert ord',
      t2: '🧩 Prøver og kort', d2: 'de henter fram nettopp ordene du bommer på',
      t3: '🔤 Ord etter tema', d3: 'med bilde og lyd — fra det enkleste til jobb og bolig',
      t4: '🎮 Spill sammen', d4: 'et rom med QR-kode for klassen, familien eller venner',
      promo_t: '🎁 De første 100 brukerne får full tilgang for alltid',
      promo_d: 'Du er en av dem. Ingenting å betale: kontoen åpner alt, uten grenser.',
      l_new: '✨ Hva er nytt', l_help: '📘 Slik virker det', l_write: '🐞 Skriv til oss',
      write_hint: 'Fant du en feil, eller ønsker du et tema til en ny tegneserie — skriv rett fra appen.',
      go: '🚀 Kom i gang',
    },
  };
  if (window.KL_T_FILL) KL_T_FILL(TOUR_T, 'app.js:TOUR_T');
  const tourTx = k => (TOUR_T[ui] || TOUR_T.en)[k];

  function showTour() {
    $$('.modal-back').forEach(m => m.remove());
    const back = h('div', { class: 'modal-back' });
    const close = () => { store.set('tourSeen', 1); back.remove(); route(); };
    const jump = href => e => { e.preventDefault(); close(); location.hash = href; };
    const tile = (t, d) => h('div', { class: 'tour-tile' }, h('b', {}, t), h('span', {}, d));
    /* Мова — випадним списком із прапорцем і власною назвою: у перший момент
       людина шукає свою мову очима, а не читає підписи. */
    const sel = h('select', { class: 'tour-lang', 'aria-label': tourTx('lang') },
      LANGS.map(([v, label]) => h('option', { value: v, selected: v === ui }, label)));
    sel.addEventListener('change', () => { setUi(sel.value); back.remove(); showTour(); });
    back.append(h('div', { class: 'modal tour', role: 'dialog', 'aria-modal': 'true' },
      h('div', { class: 'tour-head' }, h('h2', {}, tourTx('title')),
        h('label', { class: 'tour-lang-box' }, h('span', {}, tourTx('lang')), sel)),
      h('p', { class: 'tour-lead' }, tourTx('lead')),
      h('div', { class: 'tour-grid' },
        tile(tourTx('t1'), tourTx('d1')), tile(tourTx('t2'), tourTx('d2')),
        tile(tourTx('t3'), tourTx('d3')), tile(tourTx('t4'), tourTx('d4'))),
      h('div', { class: 'tour-promo' }, h('b', {}, tourTx('promo_t')), h('span', {}, tourTx('promo_d'))),
      h('div', { class: 'tour-links' },
        h('a', { href: '#/whatsnew', onclick: jump('#/whatsnew') }, tourTx('l_new')),
        h('a', { href: '#/install', onclick: jump('#/install') }, tourTx('l_help')),
        h('a', { href: '#', onclick: e => { e.preventDefault(); close(); if (window.KomiksFeedback) window.KomiksFeedback.open(); } }, tourTx('l_write'))),
      h('p', { class: 'tour-hint' }, tourTx('write_hint')),
      h('button', { type: 'button', class: 'btn accent big', onclick: close }, tourTx('go'))));
    document.body.append(back);
  }
  /* Кличе auth.js одразу після входу: показуємо лише тому, хто справді ввійшов
     у свій акаунт, і лише якщо цей акаунт вікна ще не бачив. */
  function tourIfNew() {
    const u = currentUser();
    if (!u || !u.server || u.demo) return;
    if (store.get('tourSeen', 0)) return;
    if (!hasConsent()) return;            // спершу правила, знайомство потім
    setTimeout(showTour, 300);
  }

  /* ================= головна ================= */
  /* Вид малюнка: мальований комікс чи зі справжніх фотографій. Визначаємо з кадрів,
     щоб не заводити ще одне поле в кожному файлі історії. */
  const isPhoto = c => (c.panels || []).some(p => p.art && p.art.photo);
  const ART_T = {
    uk: { all: 'Усі', drawn: '✏️ Мальовані', photo: '📷 Живі фото', label: 'Малюнок', tag_p: '📷 фото', tag_d: '✏️ малюнок' },
    en: { all: 'All', drawn: '✏️ Drawn', photo: '📷 Real photos', label: 'Artwork', tag_p: '📷 photo', tag_d: '✏️ drawn' },
    no: { all: 'Alle', drawn: '✏️ Tegnet', photo: '📷 Ekte bilder', label: 'Bilder', tag_p: '📷 foto', tag_d: '✏️ tegnet' },
    ar: { all: 'الكل', drawn: '✏️ مرسومة', photo: '📷 صور حقيقية', label: 'الرسوم', tag_p: '📷 صورة', tag_d: '✏️ مرسوم' }
  };
  if (window.KL_T_FILL) KL_T_FILL(ART_T, 'app.js:ART_T');
  const at = k => (ART_T[ui] || ART_T.en)[k];
  function comicCard(c) {
    const st = bestStars(c.id);
    return h('article', { class: 'card' + (scoreOf(c.id) != null ? ' passed' : '') },
      h('a', { class: 'cover', href: `#/read/${c.id}/0`, 'aria-label': t('read') + ' ' + c.title }, svgEl(coverSVG(c)), stampEl(c.id)),
      h('div', { class: 'card-body' },
        h('div', { class: 'meta' }, h('span', { class: 'lvl lvl-' + c.level }, c.level), ' ', catLabel(c.category), ' · ', t('panels_n', c.panels.length),
          ' ', h('span', { class: 'art-tag' + (isPhoto(c) ? ' photo' : '') }, isPhoto(c) ? at('tag_p') : at('tag_d'))),
        withTr(h('h3', {}, c.title), titleTr(c)),
        h('p', { class: 'sum' }, summaryOf(c)),
        h('div', { class: 'card-foot' }, stars(st), comicRead(c) ? h('span', { class: 'done-mark' }, '✔') : null),
        h('div', { class: 'card-acts' }, h('a', { class: 'btn primary', href: `#/read/${c.id}/0` }, t('read')), h('a', { class: 'btn accent', href: `#/quiz/${c.id}` }, t('quiz'))),
        h('div', { class: 'card-acts2' }, h('a', { class: 'btn small', href: `#/cards/${c.id}` }, t('cards')), h('a', { class: 'btn small', href: `#/pairs/${c.id}` }, t('pairs')), h('a', { class: 'btn small', href: `#/role/${c.id}` }, t('role')))));
  }
  /* ✅ Печатка «пройдено». Бал — відсоток правильних відповідей у найкращій спробі,
     тобто оцінка зі 100. Печатка з'являється лише після тесту, а не після читання. */
  const STAMP = {
    uk: { done: 'ПРОЙДЕНО', of: 'зі 100', best: 'найкращий бал' },
    en: { done: 'PASSED', of: 'of 100', best: 'best score' },
    no: { done: 'BESTÅTT', of: 'av 100', best: 'beste poengsum' },
    ar: { done: 'مُنجز', of: 'من 100', best: 'أفضل نتيجة' }
  };
  if (window.KL_T_FILL) KL_T_FILL(STAMP, 'app.js:STAMP');
  const stampT = k => (STAMP[ui] || STAMP.en)[k];
  const scoreOf = key => { const p = store.get('progress', {})[key]; return p && typeof p.best === 'number' && p.best > 0 ? p.best : null; };
  function stampEl(key) {
    const n = scoreOf(key);
    if (n == null) return null;
    return h('span', { class: 'stamp' + (n >= 90 ? ' gold' : n >= 60 ? ' good' : ''), title: stampT('best') + ': ' + n + '/100' },
      h('b', {}, stampT('done')), h('i', {}, n), h('small', {}, stampT('of')));
  }

  /* 🏅 Акція «перші 100»: безкоштовний Преміум назавжди + право прибирати погані дописи.
     Лічильник живий — беремо з api/auth.php?action=slots (кешуємо на хвилину). */
  const FOUND = {
    uk: { kick: '🏅 Тільки для перших 100', h: 'Значок PRO для перших ста', p: 'Навчання тут безкоштовне для всіх. Перші 100 учасників Комікс·Lab додатково отримують значок PRO, право прибирати погані дописи на стінах і запрошення для друзів.',
      li: ['🏅 Значок «PRO #N» у профілі — назавжди', '🛡 Право прибирати погані дописи на стінах', '✉️ Запрошення для друзів', '💬 Твоє ім’я серед тих, хто був із самого початку'],
      cta: 'Зайняти місце', left: n => `Лишилось ${n} зі 100 місць`, gone: 'Усі 100 місць зайнято', gone_p: 'Усі значки роздано. Навчання лишається безкоштовним для всіх.', mine: n => `🏅 У тебе значок PRO #${n}. Дякуємо, що ти з нами від початку!` },
    en: { kick: '🏅 First 100 only', h: 'A PRO badge for the first hundred', p: 'Learning here is free for everyone. The first 100 members of Komiks·Lab also get a PRO badge, the right to remove bad posts on walls and invites for friends.',
      li: ['🏅 A “PRO #N” badge on your profile — forever', '🛡 The right to remove bad posts on walls', '✉️ Invites for friends', '💬 Your name among those who were here from the start'],
      cta: 'Claim a seat', left: n => `${n} of 100 seats left`, gone: 'All 100 seats are taken', gone_p: 'All the badges are taken. Learning stays free for everyone.', mine: n => `🏅 You have the PRO #${n} badge. Thank you for being here from the start!` },
    no: { kick: '🏅 Bare de 100 første', h: 'PRO-merke til de hundre første', p: 'Læringen her er gratis for alle. De 100 første medlemmene i Komiks·Lab får i tillegg et PRO-merke, rett til å fjerne stygge innlegg på veggene og invitasjoner til venner.',
      li: ['🏅 Merket «PRO #N» på profilen – for alltid', '🛡 Rett til å fjerne stygge innlegg på veggene', '✉️ Invitasjoner til venner', '💬 Navnet ditt blant dem som var med fra starten'],
      cta: 'Ta plassen din', left: n => `${n} av 100 plasser igjen`, gone: 'Alle 100 plassene er tatt', gone_p: 'Alle merkene er tatt. Læringen er fortsatt gratis for alle.', mine: n => `🏅 Du har merket PRO #${n}. Takk for at du var med fra starten!` },
    ar: { kick: '🏅 لأول 100 فقط', h: 'وسام PRO لأول مئة', p: 'التعلّم هنا مجاني للجميع. ويحصل أول 100 عضو في Komiks·Lab إضافةً إلى ذلك على وسام PRO وحق إزالة المنشورات السيئة من الجدران ودعوات للأصدقاء.',
      li: ['🏅 وسام «PRO #N» في ملفك — للأبد', '🛡 حق إزالة المنشورات السيئة من الجدران', '✉️ دعوات للأصدقاء', '💬 اسمك بين من كانوا هنا منذ البداية'],
      cta: 'احجز مقعدك', left: n => `بقي ${n} من 100 مقعد`, gone: 'اكتملت المقاعد المئة', gone_p: 'وُزّعت كل الأوسمة. ويبقى التعلّم مجانيًا للجميع.', mine: n => `🏅 لديك وسام PRO رقم ${n}. شكرًا لوجودك منذ البداية!` }
  };
  if (window.KL_T_FILL) KL_T_FILL(FOUND, 'app.js:FOUND');
  let slotsCache = null, slotsAt = 0;
  function slotsInfo() {
    if (slotsCache && Date.now() - slotsAt < 60000) return Promise.resolve(slotsCache);
    return fetch('api/auth.php?action=slots', { credentials: 'same-origin' }).then(r => r.json())
      .then(j => { if (j && j.ok) { slotsCache = j; slotsAt = Date.now(); } return slotsCache; }).catch(() => null);
  }
  function founderBlock() {
    const T = FOUND[ui] || FOUND.en;
    const u = currentUser();
    if (u && u.founder) return h('section', { class: 'found-mine' }, h('b', {}, T.mine(u.founder)));
    const bar = h('div', { class: 'found-bar' }, h('i', { style: { width: '0%' } }));
    const left = h('b', { class: 'found-left' }, '…');
    const box = h('section', { class: 'found-promo' },
      h('span', { class: 'found-kick' }, T.kick),
      h('h2', {}, T.h), h('p', {}, T.p),
      h('ul', {}, T.li.map(x => h('li', {}, x))),
      bar, left,
      h('a', { class: 'btn accent big', href: u ? '#/account' : '#/register' }, T.cta));
    slotsInfo().then(j => {
      if (!j) { box.remove(); return; }
      const n = j.left | 0, pc = Math.round(((j.used | 0) / Math.max(1, j.total | 0)) * 100);
      bar.firstChild.style.width = Math.min(100, Math.max(4, pc)) + '%';
      left.textContent = n > 0 ? T.left(n) : T.gone;
      if (n <= 0) { box.classList.add('over'); box.querySelector('p').textContent = T.gone_p; }
    });
    return box;
  }
  /* ---------- 📈 Пульс сайту на головній ----------
     Що додалося цього місяця і як це порівняно з тим самим відрізком минулого (api/pulse.php рахує
     раз на 5 годин). Лише суми, без людей. Немає сервера (file://, офлайн-збірка) — блоку немає. */
  const PULSE = {
    uk: { h: '📈 Комікс·Lab цього місяця', d: (m) => `Що додалося з 1 ${m} — порівняно з тими самими днями минулого місяця. Оновлюється раз на 5 годин.`,
      uv: 'відвідувачів', pv: 'переглядів сторінок', reg: 'нових акаунтів', quiz: 'пройдених тестів', learn: 'учнів навчалися',
      vs: (p, n) => `${p}: ${n}`, all: (p, n) => `за весь ${p}: ${n}`, fresh: 'нове', total: n => `Усього акаунтів: ${n}` },
    en: { h: '📈 Komiks·Lab this month', d: (m, p) => `What was added since ${m} 1 — compared with the same days of ${p}. Updated every 5 hours.`,
      uv: 'visitors', pv: 'page views', reg: 'new accounts', quiz: 'quizzes completed', learn: 'learners studied',
      vs: (p, n) => `${p}: ${n}`, all: (p, n) => `all of ${p}: ${n}`, fresh: 'new', total: n => `Accounts in total: ${n}` },
    no: { h: '📈 Komiks·Lab denne måneden', d: (m, p) => `Hva som har kommet til siden 1. ${m} — sammenlignet med de samme dagene i ${p}. Oppdateres hver 5. time.`,
      uv: 'besøkende', pv: 'sidevisninger', reg: 'nye kontoer', quiz: 'fullførte prøver', learn: 'elever lærte',
      vs: (p, n) => `${p}: ${n}`, all: (p, n) => `hele ${p}: ${n}`, fresh: 'nytt', total: n => `Kontoer totalt: ${n}` },
  };
  let pulseCache = null;
  // 📈 окрема сторінка «Статистика» (посилання у футері)
  function renderStats() {
    const title = (PULSE[ui] || PULSE.en).h.replace(/^📈\s*/, '');
    return h('section', { class: 'stats-page' }, pageHead('📈 ' + title), pulseBlock() || h('p', { class: 'muted' }, '—'));
  }
  function pulseBlock() {
    if (OFFLINE || !location.protocol.startsWith('http') && !window.KOMIKS_API_BASE) return null;
    const T = PULSE[ui] || PULSE.en;
    const box = h('section', { class: 'pulse' });
    box.hidden = true;
    (pulseCache || (pulseCache = fetch('api/pulse.php').then(r => r.ok ? r.json() : null).catch(() => null))).then(j => {
      if (!j || !j.ok || !j.cur) return;
      const loc = { uk: 'uk-UA', no: 'nb-NO', ar: 'ar' }[ui] || ui;
      const mon = (ym, form) => { try { return new Intl.DateTimeFormat(loc, { month: 'long', ...(form || {}) }).format(new Date(ym + '-15T12:00:00')); } catch { return ym; } };
      // «з 1 жовтня»: в українській потрібен родовий відмінок — його дає повна дата
      const curM = ui === 'uk' ? mon(j.month, { day: 'numeric' }).replace(/^\d+\s*/, '') : mon(j.month);
      const prevM = mon(j.prev_month);
      const fmt = n => (n | 0).toLocaleString(loc);
      const tile = k => {
        const now = j.cur[k] | 0, before = j.prev[k] | 0;
        const pct = before > 0 ? Math.round((now - before) / before * 100) : null;
        const delta = pct === null ? (now > 0 ? h('span', { class: 'pl-d up' }, T.fresh) : null)
          : h('span', { class: 'pl-d ' + (pct > 0 ? 'up' : pct < 0 ? 'down' : '') }, (pct > 0 ? '▲ ' : pct < 0 ? '▼ ' : '') + Math.abs(pct) + '%');
        return h('div', { class: 'pl-tile' }, h('b', {}, fmt(now)), delta, h('span', {}, T[k]),
          h('small', {}, T.vs(prevM, fmt(before))), h('small', {}, T.all(prevM, fmt(j.prev_full[k]))));
      };
      box.append(h('h2', { class: 'sec-title' }, T.h), h('p', { class: 'muted' }, T.d(curM, prevM)),
        h('div', { class: 'pl-grid' }, ['uv', 'pv', 'reg', 'quiz', 'learn'].map(tile)),
        j.total && j.total.reg ? h('p', { class: 'pl-total' }, T.total(fmt(j.total.reg))) : null);
      box.hidden = false;
    });
    return box;
  }
  /* ---------- 📊 Мій аналіз навчання ----------
     Дивиться на журнал тестів (quizlog) і журнал помилок (errlog) і відповідає на три питання:
     як я вчуся зараз, на чому спотикаюсь найчастіше і що робити далі. */
  const AN = {
    uk: { title: '📊 Мій аналіз навчання', short: '📊 Мої помилки',
      intro: 'Тут видно, як іде навчання: скільки тестів пройдено, що виходить добре, а що варто повторити. Усе рахується з твоїх тестів.',
      s_tests: 'тестів', s_acc: 'правильних', s_days: 'днів поспіль', s_words: 'слів вивчено', s_comics: 'коміксів прочитано', s_stars: 'зірок',
      trend_up: '📈 Останні тести кращі за попередні — так тримати!', trend_down: '📉 Останні тести слабші за попередні — повтори матеріал спокійно.', trend_flat: '➡️ Результати стабільні.',
      errs: '🔁 Найчастіші помилки', errs_d: 'Слова й завдання, у яких ти помиляєшся найчастіше. Натисни 🔊, щоб послухати.',
      none: '✨ Помилок поки немає — пройди кілька тестів, і тут з’явиться твій розбір.',
      times: n => `${n} ${n === 1 ? 'помилка' : n < 5 ? 'помилки' : 'помилок'}`,
      weak: '🎯 Слабкі місця', weak_d: 'Тести, де найнижчий результат — їх варто пройти ще раз.',
      redo: '🔁 Повторити мої помилки', redo_d: 'Тест лише з тих слів, у яких ти помилявся.', cards: '🃏 Додати в картки', added: '✓ Додано',
      forget: '✓ Вивчив', advice: '💡 Що робити далі', again: 'Пройти ще раз',
      tip_read: 'Перечитай комікс перед тестом — слова запам’ятовуються в історії краще, ніж списком.',
      tip_cards: 'Додай складні слова в картки: кілька хвилин на день дають більше, ніж година раз на тиждень.',
      tip_listen: 'Вмикай 🔊 і повторюй уголос — так вимова й слух ідуть разом.',
      tip_plan: 'Іди за планом навчання: наступний крок уже підібраний під твій рівень.' },
    en: { title: '📊 My learning analysis', short: '📊 My mistakes',
      intro: 'Here you can see how your learning is going: how many tests you have taken, what works well and what is worth repeating. Everything is counted from your own tests.',
      s_tests: 'tests', s_acc: 'correct', s_days: 'day streak', s_words: 'words learned', s_comics: 'comics read', s_stars: 'stars',
      trend_up: '📈 Your latest tests are better than the earlier ones — keep going!', trend_down: '📉 Your latest tests are weaker — take a calm look at the material again.', trend_flat: '➡️ Your results are steady.',
      errs: '🔁 Most frequent mistakes', errs_d: 'Words and tasks you get wrong most often. Tap 🔊 to listen.',
      none: '✨ No mistakes yet — take a few tests and your analysis will appear here.',
      times: n => `${n} ${n === 1 ? 'mistake' : 'mistakes'}`,
      weak: '🎯 Weak spots', weak_d: 'The tests with the lowest score — worth taking again.',
      redo: '🔁 Repeat my mistakes', redo_d: 'A test made only of the words you got wrong.', cards: '🃏 Add to flashcards', added: '✓ Added',
      forget: '✓ I know it', advice: '💡 What to do next', again: 'Take it again',
      tip_read: 'Read the comic again before the test — words stick better inside a story than in a list.',
      tip_cards: 'Put the hard words into flashcards: a few minutes a day beats an hour once a week.',
      tip_listen: 'Turn on 🔊 and repeat out loud — pronunciation and listening grow together.',
      tip_plan: 'Follow the study plan: the next step is already chosen for your level.' },
    no: { title: '📊 Min læringsanalyse', short: '📊 Feilene mine',
      intro: 'Her ser du hvordan læringen går: hvor mange prøver du har tatt, hva som sitter og hva du bør repetere. Alt regnes ut fra dine egne prøver.',
      s_tests: 'prøver', s_acc: 'riktige', s_days: 'dager på rad', s_words: 'ord lært', s_comics: 'tegneserier lest', s_stars: 'stjerner',
      trend_up: '📈 De siste prøvene er bedre enn de før — fortsett sånn!', trend_down: '📉 De siste prøvene er svakere — ta en rolig repetisjon.', trend_flat: '➡️ Resultatene er stabile.',
      errs: '🔁 Vanligste feil', errs_d: 'Ord og oppgaver du oftest svarer feil på. Trykk 🔊 for å høre.',
      none: '✨ Ingen feil ennå — ta noen prøver, så kommer analysen din her.',
      times: n => `${n} feil`,
      weak: '🎯 Svake punkter', weak_d: 'Prøvene med lavest resultat – ta dem en gang til.',
      redo: '🔁 Repeter feilene mine', redo_d: 'En prøve kun med ordene du svarte feil på.', cards: '🃏 Legg i kort', added: '✓ Lagt til',
      forget: '✓ Kan det', advice: '💡 Hva du bør gjøre nå', again: 'Ta den igjen',
      tip_read: 'Les tegneserien igjen før prøven – ord sitter bedre i en historie enn i en liste.',
      tip_cards: 'Legg de vanskelige ordene i kort: noen minutter hver dag gir mer enn en time i uka.',
      tip_listen: 'Slå på 🔊 og gjenta høyt – uttale og lytting henger sammen.',
      tip_plan: 'Følg læringsplanen: neste steg er allerede valgt for nivået ditt.' },
    ar: { title: '📊 تحليل تعلّمي', short: '📊 أخطائي',
      intro: 'هنا ترى كيف يسير تعلّمك: كم اختبارًا أنجزت، وما الذي تتقنه، وما يستحق المراجعة. كل شيء محسوب من اختباراتك.',
      s_tests: 'اختبارات', s_acc: 'إجابات صحيحة', s_days: 'أيام متتالية', s_words: 'كلمة تعلّمتها', s_comics: 'قصة قرأتها', s_stars: 'نجوم',
      trend_up: '📈 اختباراتك الأخيرة أفضل من السابقة — واصل!', trend_down: '📉 اختباراتك الأخيرة أضعف — راجع المادة بهدوء.', trend_flat: '➡️ نتائجك مستقرة.',
      errs: '🔁 الأخطاء الأكثر تكرارًا', errs_d: 'الكلمات والمهام التي تخطئ فيها غالبًا. اضغط 🔊 للاستماع.',
      none: '✨ لا أخطاء بعد — أنجز بعض الاختبارات وسيظهر تحليلك هنا.',
      times: n => `${n} أخطاء`,
      weak: '🎯 نقاط الضعف', weak_d: 'الاختبارات ذات أدنى نتيجة — يستحسن إعادتها.',
      redo: '🔁 كرّر أخطائي', redo_d: 'اختبار من الكلمات التي أخطأت فيها فقط.', cards: '🃏 أضف إلى البطاقات', added: '✓ أُضيفت',
      forget: '✓ أتقنتها', advice: '💡 ماذا تفعل الآن', again: 'أعد الاختبار',
      tip_read: 'أعد قراءة القصة قبل الاختبار — الكلمات تثبت داخل القصة أكثر من القائمة.',
      tip_cards: 'ضع الكلمات الصعبة في البطاقات: دقائق يوميًا أفضل من ساعة أسبوعيًا.',
      tip_listen: 'شغّل 🔊 وكرّر بصوت عالٍ — النطق والاستماع يتقدّمان معًا.',
      tip_plan: 'اتبع خطة التعلّم: الخطوة التالية مُختارة لمستواك.' }
  };
  if (window.KL_T_FILL) KL_T_FILL(AN, 'app.js:AN');
  const AN_T = () => AN[ui] || AN.en;

  // тест-повторення: беремо слова з журналу помилок і робимо з них завдання
  function buildMistakeQuiz() {
    const words = errList().filter(e => /^[\p{L}\s'’-]+$/u.test(e.k));
    const now = Date.now();
    // спершу ті, кому настав час повторення; найчастіші помилки — першими
    const list = words.filter(e => (e.due || 0) <= now).concat(words.filter(e => (e.due || 0) > now)).slice(0, 14);
    if (!list.length) return [];
    const pool = uniq(list.map(e => e.k).concat(allVocab().map(v => v.no))).filter(Boolean);
    const nOpt = diff().opts;
    const opts = ans => shuffle([ans, ...sample(uniq(pool).filter(x => x !== ans), nOpt - 1)]);
    const qs = [];
    list.forEach((e, i) => {
      const item = { no: e.k, uk: e.uk || '', en: e.en || e.uk || '' };
      qs.push({ type: 'listen', item, answer: e.k, options: opts(e.k) });
      if (e.line && i % 2 === 0) qs.push({ type: 'blank', line: { no: e.line, uk: '', en: '' }, word: e.k, answer: e.k, options: opts(e.k) });
    });
    return finishSet(qs, Math.min(quizSize(), qs.length));
  }

  /* Додаткові тексти аналізу: повторення за інтервалами, динаміка, типи помилок, етапи слів. */
  const AN2 = {
    uk: { today: '📅 Повторення на сьогодні', today_none: '✨ На сьогодні все повторено. Нові помилки й слова з’являться тут самі.',
      due_err: n => `🔁 Помилки (${n})`, due_cards: n => `🃏 Картки (${n})`, today_d: 'Помилка зникає, коли ти правильно відповіси на неї тричі в різні дні: сьогодні, завтра й через три дні.',
      dyn: '📈 Динаміка тестів', dyn_d: n => `Останні ${n} тестів: кожна точка — результат одного тесту.`, types: '🧩 Де я помиляюся', types_d: 'Які завдання найчастіше даються важко.',
      fixed: '✅ Виправлені помилки', fixed_d: n => `Уже виправлено: ${n}. Ці слова ти тричі згадав правильно в різні дні.`, s_fixed: 'виправлено помилок',
      stages: '🗂 Слова: етапи вивчення', stage: ['нові', 'вчу', 'повторюю', 'вивчено'], stages_d: 'Усі слова з коміксів і тем. «Вивчено» — ті, що ти позначив «Знаю».',
      next: { now: 'сьогодні', d1: 'завтра', dn: n => `через ${n} дн.` }, step: (a, b) => `${a} з ${b}` },
    en: { today: '📅 Due for review today', today_none: '✨ Everything is reviewed for today. New mistakes and words will appear here.',
      due_err: n => `🔁 Mistakes (${n})`, due_cards: n => `🃏 Flashcards (${n})`, today_d: 'A mistake disappears when you answer it correctly three times on different days: today, tomorrow and three days later.',
      dyn: '📈 Test progress', dyn_d: n => `Your last ${n} tests: each dot is one test result.`, types: '🧩 Where I make mistakes', types_d: 'The kinds of tasks that are hardest for you.',
      fixed: '✅ Fixed mistakes', fixed_d: n => `Fixed so far: ${n}. You recalled these correctly three times on different days.`, s_fixed: 'mistakes fixed',
      stages: '🗂 Words by stage', stage: ['new', 'learning', 'reviewing', 'learned'], stages_d: 'All words from comics and topics. “Learned” are the ones you marked “I know it”.',
      next: { now: 'today', d1: 'tomorrow', dn: n => `in ${n} days` }, step: (a, b) => `${a} of ${b}` },
    no: { today: '📅 Repetisjon i dag', today_none: '✨ Alt er repetert for i dag. Nye feil og ord dukker opp her av seg selv.',
      due_err: n => `🔁 Feil (${n})`, due_cards: n => `🃏 Kort (${n})`, today_d: 'En feil forsvinner når du svarer riktig tre ganger på ulike dager: i dag, i morgen og om tre dager.',
      dyn: '📈 Utvikling i prøvene', dyn_d: n => `De siste ${n} prøvene: hvert punkt er ett resultat.`, types: '🧩 Hvor jeg gjør feil', types_d: 'Oppgavetypene som er vanskeligst for deg.',
      fixed: '✅ Rettede feil', fixed_d: n => `Rettet så langt: ${n}. Disse husket du riktig tre ganger på ulike dager.`, s_fixed: 'feil rettet',
      stages: '🗂 Ord etter nivå', stage: ['nye', 'lærer', 'repeterer', 'lært'], stages_d: 'Alle ord fra tegneserier og temaer. «Lært» er ordene du merket «Kan det».',
      next: { now: 'i dag', d1: 'i morgen', dn: n => `om ${n} dager` }, step: (a, b) => `${a} av ${b}` },
    ar: { today: '📅 للمراجعة اليوم', today_none: '✨ راجعت كل شيء لليوم. ستظهر الأخطاء والكلمات الجديدة هنا تلقائيًا.',
      due_err: n => `🔁 الأخطاء (${n})`, due_cards: n => `🃏 البطاقات (${n})`, today_d: 'يختفي الخطأ عندما تجيب عنه صحيحًا ثلاث مرات في أيام مختلفة: اليوم وغدًا وبعد ثلاثة أيام.',
      dyn: '📈 تقدّم الاختبارات', dyn_d: n => `آخر ${n} اختبارات: كل نقطة نتيجة اختبار.`, types: '🧩 أين أخطئ', types_d: 'أنواع المهام الأصعب بالنسبة لك.',
      fixed: '✅ أخطاء صُحّحت', fixed_d: n => `صُحّح حتى الآن: ${n}. تذكّرتها صحيحًا ثلاث مرات في أيام مختلفة.`, s_fixed: 'أخطاء صُحّحت',
      stages: '🗂 الكلمات حسب المرحلة', stage: ['جديدة', 'أتعلّمها', 'أراجعها', 'متقنة'], stages_d: 'كل كلمات القصص والمواضيع. «متقنة» هي التي علّمتها «أعرفها».',
      next: { now: 'اليوم', d1: 'غدًا', dn: n => `بعد ${n} أيام` }, step: (a, b) => `${a} من ${b}` }
  };
  if (window.KL_T_FILL) KL_T_FILL(AN2, 'app.js:AN2');
  const an2 = (k, ...a) => { const tb = AN2[ui] || AN2.en; const v = k in tb ? tb[k] : AN2.en[k]; return typeof v === 'function' ? v(...a) : v; };

  function renderAnalysis() {
    const T = AN_T();
    const log = store.get('quizlog', []);
    const stats = store.get('stats', {});
    const errs = errList();
    const now = Date.now();
    const pct = arr => (arr.length ? Math.round(arr.reduce((a, x) => a + (x.total ? x.score / x.total : 0), 0) / arr.length * 100) : 0);
    const last10 = log.slice(0, 10), prev10 = log.slice(10, 20);
    const acc = pct(last10);
    const trend = !prev10.length ? 'flat' : acc - pct(prev10) >= 6 ? 'up' : pct(prev10) - acc >= 6 ? 'down' : 'flat';
    // вивчені слова: «Знаю» на сторінці «Слова» (обидва курси) + «Знаю» в картках
    const cardsState = store.get('cards', {}), wk = knownFromWords();
    const vocab = allVocab();
    const learned = vocab.filter(v => isLearned(v, cardsState, wk)).length;
    const known = learned + (store.get('wordsKnownEn', []) || []).length;
    const fixedList = store.get('errFixed', []) || [];
    const read = COMICS.filter(comicRead).length;
    const cell = (v, label) => h('div', { class: 'stat-cell' }, h('b', {}, v), h('small', {}, label));

    // 📅 на сьогодні
    const dueErr = errDue().length;
    const dueCards = vocab.filter(v => !isLearned(v, cardsState, wk) && cardsState[v.key] && (cardsState[v.key].due || 0) <= now).length;
    const todayBox = h('div', { class: 'box an-today' }, h('h3', {}, an2('today')),
      dueErr || dueCards ? h('div', { class: 'row-left' },
        dueErr ? h('a', { class: 'btn accent', href: '#/quiz/mistakes' }, an2('due_err', dueErr)) : null,
        dueCards ? h('a', { class: 'btn primary', href: '#/cards' }, an2('due_cards', dueCards)) : null) : h('p', {}, an2('today_none')),
      h('p', { class: 'hint' }, an2('today_d')));

    // 📈 динаміка: останні 20 тестів, від старих до нових
    const series = log.slice(0, 20).filter(r => r.total).reverse().map(r => Math.round(r.score / r.total * 100));
    let dyn = null;
    if (series.length >= 2) {
      const W = 600, H = 150, L = 34, R = 10, Tp = 10, B = 20, pw = W - L - R, ph = H - Tp - B, n = series.length;
      const X = i => L + (n > 1 ? i / (n - 1) * pw : pw / 2), Y = v => Tp + ph - v / 100 * ph;
      let svg = '';
      [0, 60, 90, 100].forEach(v => { svg += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === 60 || v === 90 ? '#c9d2dc' : '#e7ebef'}" stroke-dasharray="${v === 60 || v === 90 ? '4 4' : '0'}"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="#6b7480">${v}%</text>`; });
      svg += `<polyline points="${series.map((v, i) => X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ')}" fill="none" stroke="#2a78d6" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
      series.forEach((v, i) => { svg += `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="4.5" fill="${v >= 90 ? '#0ca30c' : v >= 60 ? '#2a78d6' : '#e34948'}" stroke="#fff" stroke-width="2"><title>${v}%</title></circle>`; });
      dyn = h('div', { class: 'box' }, h('h3', {}, an2('dyn')), h('p', { class: 'hint' }, an2('dyn_d', n)),
        h('div', { class: 'an-dyn' }, svgEl(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${an2('dyn')}">${svg}</svg>`)),
        h('p', { class: 'an-trend ' + trend }, T['trend_' + trend]));
    }

    // 🧩 типи завдань, де найбільше помилок
    const byType = {};
    errs.forEach(e => { const lb = QNO[e.type] ? QNO[e.type][1] : e.type; byType[lb] = (byType[lb] || 0) + e.n; });
    const typeRows = Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 7);
    const tmax = Math.max(1, ...typeRows.map(r => r[1]));
    const types = typeRows.length ? h('div', { class: 'box' }, h('h3', {}, an2('types')), h('p', { class: 'hint' }, an2('types_d')),
      h('div', { class: 'an-weak' }, typeRows.map(([lb, n]) => h('div', { class: 'an-weak-row' }, h('b', {}, lb), h('span', { class: 'an-bar' }, h('i', { style: { width: Math.max(4, n / tmax * 100) + '%' } })), h('span', {}, T.times(n)))))) : null;

    // 🔁 мої помилки: скільки кроків до «виправлено» і коли наступне повторення
    const nextTxt = e => { const d = Math.ceil(((e.due || 0) - now) / 864e5); const N = an2('next'); return d <= 0 ? N.now : d === 1 ? N.d1 : N.dn(d); };
    const errRow = e => {
      const box = Math.min(e.box || 0, REV_DAYS.length);
      const row = h('div', { class: 'an-err' + ((e.due || 0) <= now ? ' due' : '') },
        h('button', { class: 'play small', type: 'button', title: '🔊', onclick: () => Speech.speak(e.k, 'narrator', { rate: 0.85 }) }, '🔊'),
        h('div', { class: 'an-err-txt' }, h('b', { lang: 'nb' }, e.k),
          h('small', {}, [e.uk, e.en].filter(Boolean).join(' · ') || (QNO[e.type] ? QNO[e.type][1] : '')),
          e.line ? h('em', { lang: 'nb' }, '«' + e.line + '»') : null),
        h('span', { class: 'an-prog', title: an2('step', box, REV_DAYS.length) }, REV_DAYS.map((_, k) => h('i', { class: k < box ? 'on' : '' })), h('small', {}, nextTxt(e))),
        h('span', { class: 'an-n' }, T.times(e.n)),
        h('button', { class: 'btn small', type: 'button', onclick: () => { errResolve(e.k); row.remove(); } }, T.forget));
      return row;
    };
    const addCards = btn => {
      const c = store.get('cards', {});
      errs.slice(0, 20).forEach(e => { const k = norm(e.k); if (!c[k]) c[k] = { due: Date.now(), box: 0, no: e.k, uk: e.uk, en: e.en }; });
      store.set('cards', c); btn.textContent = T.added; btn.disabled = true; Sfx.good();
    };

    // 🗂 етапи слів
    const stVals = [0, 0, 0, learned];
    vocab.forEach(v => { if (isLearned(v, cardsState, wk)) return; const b = cardsState[v.key] ? cardsState[v.key].box || 0 : 0; stVals[b === 0 ? 0 : b <= 2 ? 1 : 2]++; });
    const stTotal = Math.max(1, vocab.length);
    const stages = h('div', { class: 'box' }, h('h3', {}, an2('stages')), h('p', { class: 'hint' }, an2('stages_d')),
      h('div', { class: 'an-stages' }, stVals.map((n, k) => h('i', { class: 's' + k, style: { width: (n / stTotal * 100) + '%' }, title: an2('stage')[k] + ': ' + n }))),
      h('div', { class: 'an-stage-lg' }, stVals.map((n, k) => h('span', {}, h('i', { class: 's' + k }), an2('stage')[k] + ' ', h('b', {}, n)))),
      h('div', { class: 'row-left' }, h('a', { class: 'btn', href: '#/cards' }, '🃏 ' + navT('cards')), h('a', { class: 'btn', href: '#/words' }, '📝 ' + navT('words'))));

    // ✅ виправлені
    const fixed = fixedList.length ? h('div', { class: 'box' }, h('h3', {}, an2('fixed')), h('p', { class: 'hint' }, an2('fixed_d', fixedList.length)),
      h('div', { class: 'an-fixed' }, fixedList.slice(0, 16).map(f => h('span', { class: 'an-chip', title: [f.uk, f.en].filter(Boolean).join(' · ') }, '✓ ' + f.k)))) : null;

    // 🎯 слабкі тести
    const byQuiz = {};
    log.forEach(r => {
      if (!r.key || !r.total) return;
      const b = byQuiz[r.key] || (byQuiz[r.key] = { key: r.key, title: r.title, n: 0, sum: 0 });
      b.n++; b.sum += r.score / r.total;
    });
    const weak = Object.values(byQuiz).map(b => ({ ...b, p: Math.round(b.sum / b.n * 100) })).filter(b => b.p < 90).sort((a, b) => a.p - b.p).slice(0, 6);
    const quizHref = key => (COMICS.some(c => c.id === key) ? '#/quiz/' + key : key.startsWith('level:') ? '#/quiz/level/' + key.slice(6) : '#/tests');

    const tips = [];
    if (dueErr) tips.push(an2('today_d'));
    if (acc < 60) tips.push(T.tip_read);
    if (errs.length >= 5) tips.push(T.tip_cards);
    if (errs.some(e => e.type === 'listen' || e.type === 'who')) tips.push(T.tip_listen);
    tips.push(T.tip_plan);

    return h('section', { class: 'an-page' }, pageHead(T.title),
      h('p', { class: 'lead-p' }, T.intro),
      h('div', { class: 'box' }, h('div', { class: 'stat-grid' },
        cell(stats.quizzes || log.length, T.s_tests), cell(acc + ' %', T.s_acc), cell(streak(), T.s_days),
        cell(known, T.s_words), cell(fixedList.length, an2('s_fixed')), cell(`${read}/${COMICS.length}`, T.s_comics), cell(COMICS.reduce((a, c) => a + bestStars(c.id), 0), T.s_stars))),
      todayBox,
      dyn,
      h('div', { class: 'box' }, h('h3', {}, T.errs), h('p', { class: 'hint' }, T.errs_d),
        errs.length ? h('div', { class: 'an-errs' }, errs.slice(0, 15).map(errRow)) : h('p', {}, T.none),
        errs.length ? h('div', { class: 'row-left' },
          h('a', { class: 'btn accent', href: '#/quiz/mistakes' }, T.redo),
          h('button', { class: 'btn', type: 'button', onclick: e => addCards(e.currentTarget) }, T.cards)) : null,
        errs.length ? h('p', { class: 'hint' }, T.redo_d) : null),
      types,
      fixed,
      stages,
      weak.length ? h('div', { class: 'box' }, h('h3', {}, T.weak), h('p', { class: 'hint' }, T.weak_d),
        h('div', { class: 'an-weak' }, weak.map(b => h('a', { class: 'an-weak-row', href: quizHref(b.key) },
          h('b', {}, b.title || b.key), h('span', { class: 'an-bar' }, h('i', { style: { width: Math.max(4, b.p) + '%' } })), h('span', {}, b.p + ' %'))))) : null,
      h('div', { class: 'box' }, h('h3', {}, T.advice), h('ul', { class: 'an-tips' }, tips.map(x => h('li', {}, x)))));
  }

  let homeAuthWaited = false;
  function homeFeature() {
    let storage;
    try { storage = window.localStorage; } catch (_) {}
    const c = window.KomiksHomeFeature?.choose(COMICS, storage);
    if (!c) return null;
    const labels = {
      uk: ['Слухати кадр', 'Зупинити', 'Читати історію'],
      en: ['Listen to this panel', 'Stop', 'Read the story'],
      no: ['Lytt til ruten', 'Stopp', 'Les historien'],
      lt: ['Klausyti kadro', 'Sustabdyti', 'Skaityti istoriją'],
      de: ['Bild anhören', 'Stoppen', 'Geschichte lesen'],
      pl: ['Posłuchaj kadru', 'Zatrzymaj', 'Czytaj historię'],
      tr: ['Kareyi dinle', 'Durdur', 'Hikâyeyi oku'],
      ar: ['استمع إلى المشهد', 'إيقاف', 'اقرأ القصة']
    }[ui] || ['Listen to this panel', 'Stop', 'Read the story'];
    let active = false;
    const button = h('button', { type: 'button', class: 'hero-play', 'aria-pressed': 'false' }, '▶ ' + labels[0]);
    const reset = () => { active = false; button.textContent = '▶ ' + labels[0]; button.setAttribute('aria-pressed', 'false'); };
    button.addEventListener('click', async () => {
      if (active) { stopAll(); reset(); return; }
      active = true;
      button.textContent = '■ ' + labels[1];
      button.setAttribute('aria-pressed', 'true');
      const token = await claim();
      try {
        for (const line of c.panels[0].lines) {
          if (token !== playToken || !button.isConnected) break;
          await Speech.speak(line.no, line.who || 'narrator', { lang: 'no' });
        }
      } finally { reset(); }
    });
    return h('div', { class: 'hero-cover hero-feature', 'data-comic': c.id },
      h('a', { href: `#/read/${c.id}/0`, 'aria-label': labels[2] + ': ' + c.title },
        svgEl(ART ? ART.panel(c, 0, { lang: L, tr: 'both', chars: CH }) : fallbackSVG(c, 0))),
      h('div', { class: 'hero-feature-caption' },
        withTr(h('strong', {}, c.title), titleTr(c)), h('span', {}, c.level),
        button, h('a', { href: `#/read/${c.id}/0` }, labels[2] + ' →')));
  }
  /* 🇳🇴/🇬🇧 Що я вчу: перемикає головну між норвезьким курсом і англійським (settings.learnLang).
     Той самий перемикач — у налаштуваннях, кабінеті й на головній англійського курсу. */
  const LEARN_T = { uk: ['Що я вчу', '🇳🇴 Норвезьку', '🇬🇧 Англійську'], en: ['What I am learning', '🇳🇴 Norwegian', '🇬🇧 English'], no: ['Hva jeg lærer', '🇳🇴 Norsk', '🇬🇧 Engelsk'],
    ar: ['ماذا أتعلّم', '🇳🇴 النرويجية', '🇬🇧 الإنجليزية'], de: ['Was ich lerne', '🇳🇴 Norwegisch', '🇬🇧 Englisch'], pl: ['Czego się uczę', '🇳🇴 Norweski', '🇬🇧 Angielski'], tr: ['Ne öğreniyorum', '🇳🇴 Norveççe', '🇬🇧 İngilizce'], lt: ['Ko mokausi', '🇳🇴 Norvegų', '🇬🇧 Anglų'] };
  const COURSE_SUB = {
    uk: { no: 'Вчимо норвезьку', en: 'Вчимо англійську' },
    en: { no: 'Learn Norwegian', en: 'Learn English' },
    no: { no: 'Lær norsk', en: 'Lær engelsk' },
    de: { no: 'Norwegisch lernen', en: 'Englisch lernen' },
    pl: { no: 'Uczymy się norweskiego', en: 'Uczymy się angielskiego' },
    tr: { no: 'Norveççe öğren', en: 'İngilizce öğren' },
    lt: { no: 'Mokomės norvegų', en: 'Mokomės anglų' },
    ar: { no: 'نتعلم النرويجية', en: 'نتعلم الإنجليزية' }
  };
  const learnLang = () => (settings.learnLang === 'en' && window.KomiksEnglish ? 'en' : 'no');
  const activeCourse = () => /^#\/(english(?:\/|$)|quiz\/en(?:[-/]|$))/.test(location.hash || '') ? 'en' : learnLang();
  function learnSwitch() {
    const [label, no, en] = LEARN_T[ui] || LEARN_T.en;
    const btn = (v, text) => h('button', { type: 'button', class: learnLang() === v ? 'on' : '', 'aria-pressed': String(learnLang() === v), onclick: () => {
      if (learnLang() === v) return;
      settings.learnLang = v; saveSettings();
      if ((location.hash || '#/') === '#/') route(); else location.hash = '#/';
    } }, text);
    return h('div', { class: 'learn-switch', role: 'group', 'aria-label': label }, h('span', {}, label), btn('no', no), window.KomiksEnglish ? btn('en', en) : null);
  }
  const HOME_CODING = {
    uk: { fresh: 'НОВИНКА', title: 'Програмування для дітей', desc: 'Базовий курс пояснює команди, алгоритми, сайти, ігри, бази даних і цифрову безпеку через короткі комікси та тести.', profile: 'У профілі видно прочитані уроки, результати тестів, значки та наступний крок.', try: 'Спробувати курс', progress: 'Твій прогрес', paths: n => `${n} напрямів`, lessons: n => `${n} коміксів`, badge: 'Профіль і значки' },
    en: { fresh: 'NEW', title: 'Coding for children', desc: 'A foundation course explains commands, algorithms, websites, games, databases and digital safety through short comics and quizzes.', profile: 'Your profile shows completed lessons, quiz results, badges and the next step.', try: 'Try the course', progress: 'Your progress', paths: n => `${n} paths`, lessons: n => `${n} comics`, badge: 'Profile and badges' },
    no: { fresh: 'NYHET', title: 'Programmering for barn', desc: 'Et grunnkurs forklarer kommandoer, algoritmer, nettsider, spill, databaser og digital sikkerhet med korte tegneserier og tester.', profile: 'Profilen viser leste leksjoner, testresultater, merker og neste steg.', try: 'Prøv kurset', progress: 'Fremgangen din', paths: n => `${n} spor`, lessons: n => `${n} tegneserier`, badge: 'Profil og merker' },
    ar: { fresh: 'جديد', title: 'البرمجة للأطفال', desc: 'دورة تأسيسية تشرح الأوامر والخوارزميات والمواقع والألعاب وقواعد البيانات والسلامة الرقمية من خلال قصص واختبارات قصيرة.', profile: 'يعرض ملفك الدروس المكتملة ونتائج الاختبارات والشارات والخطوة التالية.', try: 'جرّب الدورة', progress: 'تقدّمك', paths: n => `${n} مسارًا`, lessons: n => `${n} قصة`, badge: 'الملف والشارات' },
    de: { fresh: 'NEU', title: 'Programmieren für Kinder', desc: 'Ein Grundkurs erklärt Befehle, Algorithmen, Webseiten, Spiele, Datenbanken und digitale Sicherheit mit kurzen Comics und Tests.', profile: 'Im Profil siehst du gelesene Lektionen, Testergebnisse, Abzeichen und den nächsten Schritt.', try: 'Kurs ausprobieren', progress: 'Dein Fortschritt', paths: n => `${n} Lernwege`, lessons: n => `${n} Comics`, badge: 'Profil und Abzeichen' },
    pl: { fresh: 'NOWOŚĆ', title: 'Programowanie dla dzieci', desc: 'Kurs podstawowy wyjaśnia polecenia, algorytmy, strony, gry, bazy danych i bezpieczeństwo cyfrowe w krótkich komiksach i testach.', profile: 'Profil pokazuje przeczytane lekcje, wyniki testów, odznaki i kolejny krok.', try: 'Wypróbuj kurs', progress: 'Twój postęp', paths: n => `${n} ścieżek`, lessons: n => `${n} komiksów`, badge: 'Profil i odznaki' },
    tr: { fresh: 'YENİ', title: 'Çocuklar için kodlama', desc: 'Temel kurs; komutları, algoritmaları, web sitelerini, oyunları, veritabanlarını ve dijital güvenliği kısa çizgi roman ve testlerle açıklar.', profile: 'Profilin tamamlanan dersleri, test sonuçlarını, rozetleri ve sıradaki adımı gösterir.', try: 'Kursu dene', progress: 'İlerlemen', paths: n => `${n} yol`, lessons: n => `${n} çizgi roman`, badge: 'Profil ve rozetler' },
    lt: { fresh: 'NAUJIENA', title: 'Programavimas vaikams', desc: 'Pagrindų kursas trumpais komiksais ir testais paaiškina komandas, algoritmus, svetaines, žaidimus, duomenų bazes ir skaitmeninį saugumą.', profile: 'Profilyje matysi perskaitytas pamokas, testų rezultatus, ženklelius ir kitą žingsnį.', try: 'Išbandyti kursą', progress: 'Tavo pažanga', paths: n => `${n} kryptys`, lessons: n => `${n} komiksai`, badge: 'Profilis ir ženkleliai' }
  };
  function homeCodingPromo() {
    if (!window.KomiksKoding) return null;
    const T = HOME_CODING[ui] || HOME_CODING.en;
    const lessons = COMICS.filter(c => c.category === 'koding');
    const paths = new Set(lessons.map(c => c.track || 'basics')).size;
    const done = lessons.filter(c => comicRead_(c) && bestStars(c.id) > 0).length;
    const pct = lessons.length ? Math.round(done / lessons.length * 100) : 0;
    return h('section', { class: 'home-coding-promo', 'aria-labelledby': 'home-coding-title' },
      h('div', { class: 'home-coding-copy' },
        h('span', { class: 'home-coding-new' }, T.fresh),
        h('h2', { id: 'home-coding-title' }, T.title),
        h('p', {}, T.desc),
        h('div', { class: 'home-coding-facts' }, h('span', {}, '📚 ', T.lessons(lessons.length)), h('span', {}, '🧭 ', T.paths(paths)), h('span', {}, '🏅 ', T.badge)),
        h('p', { class: 'home-coding-profile' }, T.profile),
        h('div', { class: 'home-coding-actions' }, h('a', { class: 'btn accent big', href: '#/koding' }, '💻 ', T.try),
          h('div', { class: 'home-coding-progress' }, h('span', {}, T.progress, h('b', {}, `${done}/${lessons.length}`)), h('span', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': lessons.length, 'aria-valuenow': done }, h('i', { style: { width: pct + '%' } }))))),
      h('div', { class: 'home-coding-art', 'aria-hidden': 'true' },
        h('div', { class: 'home-code-window' }, h('div', { class: 'home-code-top' }, h('i'), h('i'), h('i'), h('b', {}, 'KOMIKS·LAB / KODE')),
          h('div', { class: 'home-code-lines' }, h('span', {}, 'hvis ', h('b', {}, 'nysgjerrig'), ':'), h('span', {}, '  lær(', h('em', {}, '"koding"'), ')'), h('span', {}, '  bygg(', h('em', {}, '"din idé"'), ')'))),
        h('div', { class: 'home-code-robo' }, '🤖'),
        h('div', { class: 'home-code-bits' }, h('span', {}, 'HTML'), h('span', {}, '🎮'), h('span', {}, 'SQL'), h('span', {}, '🛡️'))));
  }
  function renderHome() {
    // учень обрав англійську — головна веде одразу в англійський курс
    if (learnLang() === 'en') return window.KomiksEnglish.render(true);
    const total = COMICS.reduce((s, c) => s + bestStars(c.id), 0);
    const firstA1 = COMICS.find(c => c.level === 'A1') || COMICS[0];
    /* Тільки для тих, хто ввійшов: у гостя прогрес живе до першого очищення
       браузера, тож і «наступний», і приховування прочитаного були б
       обіцянками, яких ми не можемо дотримати. */
    const signedIn = !!currentUser() || !!(window.KomiksAuth && window.KomiksAuth.user);
    /* Стан входу приходить із сервера асинхронно, а головну малюють одразу.
       Без цього той, хто ввійшов, бачив би гостьовий вигляд — без «читати
       наступний» і з усіма прочитаними в списку — аж доки кудись не перейде.
       Чекаємо на відповідь один раз за завантаження й перемальовуємо. */
    if (!signedIn && !homeAuthWaited && window.KomiksAuth && window.KomiksAuth.ready && location.protocol.startsWith('http')) {
      homeAuthWaited = true;
      window.KomiksAuth.ready().then(() => { if (window.KomiksAuth.user && (location.hash || '#/') === '#/') route(); });
    }
    const lastRead = COMICS.find(c => c.id === store.get('lastRead', ''));
    const unread = COMICS.filter(c => !comicRead_(c));
    /* Навіть якщо людина ще нічого не відкривала, порада має бути осмисленою:
       nextComics сам візьме її рівень, а не перший комікс у файлі. */
    const nextUp = signedIn ? nextComics(lastRead || null, 1)[0] : null;
    const allRead = signedIn && !unread.length;
    const hero = h('section', { class: 'hero' },
      h('div', {},
        h('h1', {}, h('span', { class: 'norway-flag', 'aria-hidden': 'true' }), t('h1a'), h('span', {}, t('h1b'))),
        h('p', {}, t('lead')),
        h('div', { class: 'stat-row' }, h('span', { class: 'stat' }, t('stat_stars', total, COMICS.length * 3)), h('span', { class: 'stat' }, t('stat_streak', streak())), h('span', { class: 'stat' }, t('stat_comics', COMICS.length))),
        h('div', { class: 'row-left' },
          h('a', { class: 'btn accent big', href: '#/today' }, td('title')),
          /* Головне питання того, хто повернувся, — що читати далі. Кнопка несе
             назву самої історії, щоб рішення не вимагало ще одного переходу. */
          nextUp ? withTr(h('a', { class: 'btn yellow big', href: `#/read/${nextUp.id}/0` },
            t('cta_next'), h('small', { class: 'cta-sub' }, nextUp.title)), titleTr(nextUp)) : null,
          allRead ? h('span', { class: 'btn big done-all' }, t('cta_next_done')) : null,
          h('a', { class: 'btn big', href: '#/plan' }, t('cta_plan')),
          firstA1 && !nextUp && !allRead ? h('a', { class: 'btn big', href: `#/read/${firstA1.id}/0` }, t('cta_start')) : null)),
      homeFeature());

    const mods = tx('modules');
    const modules = h('section', { class: 'home-modules' }, h('h2', { class: 'sec-title' }, t('modules_title')),
      h('div', { class: 'module-grid' }, ['alphabet', 'words', 'koding', 'plan', 'tests'].filter(k => mods[k]).map(k => h('a', { class: 'module m-' + k, href: '#/' + k }, window.KomiksIcons && window.KomiksIcons.MODULES[k] ? window.KomiksIcons.badge(...window.KomiksIcons.MODULES[k], 30) : h('b', {}, mods[k][0]), h('span', {}, mods[k][1]), h('small', {}, mods[k][2])))),
      h('details', { class: 'home-disclosure' }, h('summary', {}, ({"uk":"Усі розділи","en":"All sections","no":"Alle seksjoner","ar":"جميع الأقسام","de":"Alle Bereiche","pl":"Wszystkie sekcje","tr":"Tüm bölümler","lt":"Visi skyriai"})[ui] || 'All sections'), h('div', { class: 'module-grid' }, ['numbers', 'grammar', 'english', 'math', 'game', 'race', 'chess', 'rating'].filter(k => mods[k]).map(k => h('a', { class: 'module m-' + k, href: '#/' + k }, window.KomiksIcons && window.KomiksIcons.MODULES[k] ? window.KomiksIcons.badge(...window.KomiksIcons.MODULES[k], 30) : h('b', {}, mods[k][0]), h('span', {}, mods[k][1]), h('small', {}, mods[k][2]))))));

    const how = h('section', { class: 'how' }, h('h2', { class: 'sec-title' }, t('how_title')),
      h('ol', { class: 'how-grid' }, tx('how').map(([icon, title, text], i) => h('li', { class: 'how-step' }, h('span', { class: 'how-num' }, i + 1), h('span', { class: 'how-icon' }, icon), h('b', {}, title), h('span', {}, text)))),
      h('a', { class: 'help-link', href: '#/help' }, t('help_more')));

    // фільтри
    const saved = store.get('filters', {});
    const F = Object.assign({ level: settings.levelFilter || 'all', cat: 'all', status: 'all', art: 'all' }, saved);
    /* Для тих, хто ввійшов, прочитане ховаємо — але лише доки людина сама не
       вибрала інакше. Збережений вибір сильніший за це правило, інакше фільтр
       скидався б на кожному заході й виглядав би зламаним. */
    if (signedIn && saved.status === undefined) F.status = 'new';
    const gridEl = h('div', { class: 'grid' });
    const countEl = h('span', { class: 'found' });
    const paint = () => {
      store.set('filters', F);
      const list = COMICS.filter(c => (F.level === 'all' || c.level === F.level) && (F.cat === 'all' || c.category === F.cat)
        && (F.status === 'all' || (F.status === 'done' ? comicDone(c) : !comicDone(c)))
        && (F.art === 'all' || (F.art === 'photo' ? isPhoto(c) : !isPhoto(c))));
      countEl.textContent = t('found', list.length);
      /* Приховане має бути видно як рішення, а не як зникнення: показуємо,
         скільки саме сховано, і даємо повернути одним дотиком. */
      const hidden = signedIn && F.status === 'new' ? COMICS.filter(comicDone).length : 0;
      hintEl.replaceChildren(hidden ? h('button', { class: 'btn sm', type: 'button', onclick: () => { F.status = 'all'; stSel.value = 'all'; paint(); } }, t('hid_read', hidden)) : null);
      gridEl.replaceChildren(...(list.length ? list.map(comicCard) : [h('p', { class: 'no-results' }, t('no_results'))]));
      $$('.lvl-chip', filters).forEach(b => b.classList.toggle('on', b.dataset.v === F.level));
      $$('.art-chip', filters).forEach(b => b.classList.toggle('on', b.dataset.v === F.art));
    };
    const hintEl = h('div', { class: 'hid-note' });
    const cats = uniq(COMICS.map(c => c.category)).filter(Boolean);
    const catSel = h('select', { 'aria-label': t('filter_cat') }, h('option', { value: 'all' }, t('all_cats')), cats.map(k => h('option', { value: k, selected: F.cat === k }, catLabel(k))));
    catSel.addEventListener('change', () => { F.cat = catSel.value; paint(); });
    const stSel = h('select', { 'aria-label': t('filter_status') }, ['all', 'new', 'done'].map(k => h('option', { value: k, selected: F.status === k }, tx('status')[k])));
    stSel.addEventListener('change', () => { F.status = stSel.value; paint(); });
    const filters = h('div', { class: 'filters' },
      h('div', { class: 'filter-group' }, h('span', { class: 'filter-label' }, t('filter_level')),
        h('div', { class: 'chips' }, [['all', t('all_levels')], ...B.levels.map(l => [l, l])].map(([v, label]) =>
          h('button', { type: 'button', class: 'lvl-chip' + (v !== 'all' ? ' lvl-' + v : ''), 'data-v': v, onclick: () => { F.level = v; paint(); } }, label)))),
      h('div', { class: 'filter-group' }, h('span', { class: 'filter-label' }, at('label')),
        h('div', { class: 'chips' }, [['all', at('all')], ['drawn', at('drawn')], ['photo', at('photo')]].map(([v, label]) =>
          h('button', { type: 'button', class: 'art-chip', 'data-v': v, onclick: () => { F.art = v; paint(); } }, label)))),
      h('label', { class: 'filter-group' }, h('span', { class: 'filter-label' }, t('filter_cat')), catSel),
      h('label', { class: 'filter-group' }, h('span', { class: 'filter-label' }, t('filter_status')), stSel),
      countEl, hintEl);
    const grid = h('section', { id: 'comics' }, h('h2', { class: 'sec-title' }, t('comics_title')), filters, gridEl);
    paint();

    const stats = store.get('stats', {});
    const cardsState = store.get('cards', {});
    const wkHome = knownFromWords();
    const due = allVocab().filter(v => !isLearned(v, cardsState, wkHome) && (!cardsState[v.key] || cardsState[v.key].due <= Date.now())).length;
    const got = BADGES.filter(b => b.test(stats)).length;
    const train = h('section', { class: 'train' }, h('h2', { class: 'sec-title' }, t('train_title')),
      h('div', { class: 'train-grid' },
        h('a', { class: 'train-tile today-tile', href: '#/today' }, h('b', {}, '📅'), h('span', {}, td('title')), h('small', {}, td('lead').split('.')[0] + '.')),
        h('a', { class: 'train-tile', href: '#/cards' }, h('b', {}, '🃏'), h('span', {}, t('train_cards')), h('small', {}, t('train_cards_d', due))),
        h('a', { class: 'train-tile', href: '#/pairs' }, h('b', {}, '🧠'), h('span', {}, t('train_pairs')), h('small', {}, t('train_pairs_d'))),
        h('a', { class: 'train-tile', href: '#/cross' }, h('b', {}, '🧩'), h('span', {}, t('train_cross')), h('small', {}, t('train_cross_d'))),
        h('div', { class: 'train-tile' }, h('b', {}, '🔥'), h('span', {}, t('train_streak', streak())), h('small', {}, t('train_streak_d')))),
      window.KomiksPlayers ? window.KomiksPlayers.badgeGrid() : [h('h3', { class: 'sec-sub' }, t('badges_title', got, BADGES.length)),
      h('div', { class: 'badges' }, BADGES.map((b, i) => { const ok = b.test(stats); return h('div', { class: 'badge-item' + (ok ? ' got' : '') }, h('span', { class: 'bi' }, b.icon), h('b', {}, tx('badges')[i][0]), h('small', {}, ok ? t('badge_got') : tx('badges')[i][1])); }))]);
    const games = NO_EXTERNAL || !window.KomiksGames ? null : window.KomiksGames.homeSection();
    return h('div', {}, !OFFLINE && window.KomiksDownloads && window.KomiksDownloads.smart ? window.KomiksDownloads.smart() : null, hero, window.KomiksEnglish ? learnSwitch() : null, modules, homeCodingPromo(), !signedIn && !OFFLINE && window.KomiksDownloads ? window.KomiksDownloads.section() : null, OFFLINE || !(window.KomiksExtras && window.KomiksExtras.playHero) ? null : window.KomiksExtras.playHero(), games, grid, how, train, window.KomiksExtras && window.KomiksExtras.journal ? window.KomiksExtras.journal() : null);
  }

  /* ================= допомога, умови ================= */
  function pageHead(title, back = '#/') { return h('div', { class: 'q-head' }, h('a', { class: 'btn', href: back }, t('back')), h('h2', {}, title)); }
  function renderHelp() {
    return h('section', { class: 'help' }, pageHead(t('help_title')),
      h('div', { class: 'help-grid' }, tx('help').map(([icon, title, text]) => h('div', { class: 'help-item' }, h('span', { class: 'help-icon' }, icon), h('div', {}, h('h3', {}, title), h('p', {}, text))))),
      h('p', { style: { marginTop: '18px' } }, h('a', { class: 'btn', href: '#/terms' }, '📄 ' + navT('terms'))));
  }
  function renderTerms() {
    const consent = raw.get('comiks.consent', null);
    return h('section', { class: 'help terms' }, pageHead(t('terms_title')),
      h('div', { class: 'warn-box' }, h('h3', {}, t('warn_title')), h('ul', {}, tx('warn_points').map(x => h('li', {}, x)))),
      termsList(),
      h('div', { class: 'consent-stamp' },
        consent ? h('p', {}, '✓ ', t('consent_given', fmtDate(consent.at))) : null,
        h('p', {}, t('terms_updated', fmtDate(TERMS_VERSION)))));
  }

  /* ================= читання ================= */
  let autoplay = false, autoStartNext = false;
  function lineCard(c, l) {
    const who = ch(l.who);
    const recOut = h('div', { class: 'rec-out' });
    const bubble = withTr(h('div', { class: 'bubble' }, h('p', { class: 'prim' }, wordSpans(c, l.no))), trLine(l));
    const card = h('article', { class: 'line' + (l.who === 'sfx' ? ' sfx' : '') + (l.who === 'narrator' ? ' narr' : ''), style: { '--c': who.color } },
      h('div', { class: 'who' }, h('span', { class: 'ava', 'aria-hidden': 'true' }, who.emoji), withTr(h('span', { class: 'nm' }, who.no), both(who.uk, who.en))),
      bubble,
      h('div', { class: 'acts' },
        h('button', { class: 'play', type: 'button', title: t('play'), onclick: () => playLine(card) }, '▶ ', h('span', { class: 'lang' }, 'NO')),
        h('button', { class: 'play', type: 'button', title: t('slow'), 'aria-label': t('slow'), onclick: () => playLine(card, 0.6) }, '🐢'),
        l.who !== 'sfx' ? h('button', { class: 'play mic', type: 'button', title: t('say_aloud'), 'aria-label': t('say_aloud'), onclick: e => practice(l.no, recOut, e.currentTarget) }, '🎙️') : null),
      recOut);
    card._line = l;
    return card;
  }
  async function speakCard(card, rate = 1) {
    $$('.line.speaking').forEach(x => x.classList.remove('speaking'));
    card.classList.add('speaking');
    const r = card.getBoundingClientRect();
    if (r.top < 70 || r.bottom > innerHeight) card.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
    const target = $('.prim', card);
    await Speech.speak(card._line.no, card._line.who, { rate, onWord: i => highlight(target, i) });
    $$('.w.on', card).forEach(w => w.classList.remove('on'));
  }
  async function playLine(card, rate = 1) { const my = await claim(); if (my !== playToken) return; await speakCard(card, rate); if (my === playToken) card.classList.remove('speaking'); }
  async function playPanel(cards) {
    const my = await claim();
    for (const card of cards) { if (my !== playToken) return false; await speakCard(card); await sleep(settings.level === 'kids' ? 450 : 250); }
    if (my !== playToken) return false;
    cards.forEach(x => x.classList.remove('speaking'));
    return true;
  }
  /* Куди гортаємо. Перший показ коміксу — без анімації: вона має означати
     перехід між кадрами, а не появу сторінки. */
  let lastPanel = { id: '', idx: -1 };
  function turnDir(id, idx) {
    const same = lastPanel.id === id;
    const dir = !same ? '' : idx > lastPanel.idx ? 'page-turn' : idx < lastPanel.idx ? 'page-turn-back' : '';
    lastPanel = { id, idx };
    return dir;
  }

  /* Що читати далі. Порядок підказки навмисний: спершу непрочитане того ж
     рівня — там слова вже знайомі й історія піде легко; далі сусідній рівень.
     Прочитане не пропонуємо: повернутися до нього людина може зі списку, а
     бачити в «що далі» вже пройдене — це підказка нікуди. */
  const comicRead_ = c => store.get('seen.' + c.id, []).length >= c.panels.length;
  const LV = ['A1', 'A2', 'B1', 'B2'];

  /* Рівень, на якому людина насправді зараз. Джерела за вагомістю:
       1. обраний нею фільтр рівнів — власний вибір сильніший за здогадку;
       2. сходинка знизу вгору: перший рівень, де прочитано менше за 80 %;
       3. але не нижче за результат розміщувального тесту (plan.from).
     Без цього досить було зазирнути з цікавості в B2 — і підказки назавжди
     лишалися на B2, хоча людина ледве закінчила A1. */
  function learnerLevel() {
    const picked = settings.levelFilter;
    if (LV.includes(picked)) return picked;
    const from = ((store.get('plan', {}) || {}).from) || '';
    const floor = Math.max(0, LV.indexOf(from));
    for (let i = floor; i < LV.length; i++) {
      const list = COMICS.filter(c => c.level === LV[i]);
      if (!list.length) continue;
      if (list.filter(comicRead_).length / list.length < 0.8) return LV[i];
    }
    return LV[LV.length - 1];
  }

  /* cur може бути порожнім: на головній ми радимо «що далі» ще до того, як
     людина щось відкрила. Тоді орієнтуємось лише на її рівень. */
  function nextComics(cur, limit = 3) {
    const pool = COMICS.filter(x => (!cur || x.id !== cur.id) && !comicRead_(x));
    if (!pool.length) return [];
    const bi = LV.indexOf(learnerLevel());
    const rank = x => {
      const d = LV.indexOf(x.level) - bi;
      /* Свій рівень — найкраще. Нижчий — теж добре: це повторення, і воно
         ніколи не зашкодить. Вищий відсуваємо так далеко, щоб він з'являвся
         лише коли на своєму й нижчих уже нічого не лишилось. */
      const lv = d === 0 ? 0 : d < 0 ? 2 - d : 60 + d * 10;
      /* Та сама тема — найкращий наступний крок: слова повторюються, і це
         видно з першого кадру. */
      return lv + (cur && x.category === cur.category ? 0 : 1);
    };
    return pool.sort((a, b) => rank(a) - rank(b) || strNat(a.id, b.id)).slice(0, limit);
  }
  const strNat = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });

  /* Картка-посилання на комікс: обкладинкою слугує перший кадр, бо назви
     норвезькою між собою схожі, а малюнок упізнається миттєво. */
  function nextCard(x) {
    return withTr(h('a', { class: 'next-card', href: `#/read/${x.id}/0` },
      h('span', { class: 'next-pic' }, panelView(x, 0, {})),
      h('span', { class: 'next-meta' },
        h('span', { class: 'lvl lvl-' + x.level }, x.level),
        h('b', {}, x.title))), titleTr(x));
  }

  function renderRead(c, idx, auto) {
    const n = c.panels.length; idx = clamp(idx | 0, 0, n - 1);
    const p = c.panels[idx];
    const gate = readGate(c, '#/');
    if (gate) return gate;
    if (GUEST_READ_MAX) guestReadCount(c.id);
    const seen = store.get('seen.' + c.id, []);
    if (!seen.includes(idx)) store.set('seen.' + c.id, [...seen, idx]);
    /* Потрібно головній: від цього коміксу вона рахує, який пропонувати далі. */
    if (store.get('lastRead', '') !== c.id) store.set('lastRead', c.id);
    const href = i => `#/read/${c.id}/${i}`;
    const cards = p.lines.map(l => lineCard(c, l));
    const autoBtn = h('button', { class: 'btn btn-all' + (autoplay ? ' on' : ''), type: 'button' }, autoplay ? t('pause') : t('play_all'));
    const resetAuto = () => { autoplay = false; autoBtn.classList.remove('on'); autoBtn.textContent = t('play_all'); };

    /* ▶ на самому кадрі. Та сама дія, що й «Озвучити кадр», але під пальцем і
       без окремого ряду кнопок. Поки звучить — показує ⏸ і зупиняє. */
    const playBtn = h('button', { class: 'pv-btn pv-play', type: 'button', title: t('play_panel'), 'aria-label': t('play_panel') }, '▶');
    const setPlay = on => { playBtn.textContent = on ? '⏸' : '▶'; playBtn.classList.toggle('on', !!on); };
    playBtn.addEventListener('click', async () => {
      if (playBtn.classList.contains('on')) { stopAll(); resetAuto(); setPlay(false); return; }
      autoplay = false; resetAuto(); setPlay(true);
      await playPanel(cards);
      setPlay(false);
    });
    const runAuto = async () => {
      autoplay = true; autoBtn.classList.add('on'); autoBtn.textContent = t('pause'); setPlay(true);
      const ok = await playPanel(cards);
      setPlay(false);
      if (!ok || !autoplay) return;
      if (idx < n - 1) { await sleep(500); if (!autoplay) return; autoStartNext = true; location.hash = href(idx + 1); } else { resetAuto(); Sfx.win(); }
    };
    autoBtn.addEventListener('click', () => { if (autoplay) { stopAll(); resetAuto(); } else runAuto(); });
    const after = idx === n - 1 ? nextComics(c, 1)[0] : null;
    const script = h('div', { class: 'script' },
      h('div', { class: 'panel-label' }, `${t('panel_of', idx + 1, n)} · ${t('lines_n', p.lines.length)}`),
      h('div', { class: 'lines' }, cards),
      /* Два ряди кнопок у звичайному вигляді лишаються двома рядами; на телефоні
         обгортка стає одним рядком, бо половина кнопок переїхала на кадр. */
      /* На останньому кадрі кнопок стає чотири: озвучити все, стоп, тест і
         наступна історія. Двома рядами вони не вміщаються на телефоні, тож
         підвал отримує позначку й складається в один ряд. */
      h('div', { class: 'foot-rows' + (idx === n - 1 ? ' last' : '') },
        h('div', { class: 'controls play-row' },
          h('button', { class: 'btn primary on-panel', type: 'button', onclick: () => { autoplay = false; playPanel(cards); } }, t('play_panel')), autoBtn,
          h('button', { class: 'btn icon ghost', type: 'button', title: t('stop'), 'aria-label': t('stop'), onclick: () => { stopAll(); resetAuto(); setPlay(false); } }, '🛑')),
        h('div', { class: 'controls nav-row' },
          h('a', { class: 'btn on-panel', href: href(idx - 1), 'aria-disabled': idx === 0 ? 'true' : null }, t('prev')), h('span', { class: 'grow' }),
          idx < n - 1 ? h('a', { class: 'btn yellow on-panel', href: href(idx + 1) }, t('next')) : h('a', { class: 'btn accent', href: `#/quiz/${c.id}` }, t('to_quiz')),
          /* На останньому кадрі — ще один вихід, окрім тесту: наступна історія.
             Одна кнопка, а не список: повний вибір чекає на екрані результату тесту. */
          after ? h('a', { class: 'btn', href: `#/read/${after.id}/0`, title: after.title }, t('next_one')) : null)),
      h('details', { class: 'vocab' }, h('summary', {}, t('vocab_n', c.vocab.length)),
        h('div', { class: 'vocab-list' }, c.vocab.map(pair => withTr(h('button', { class: 'chip', type: 'button', onclick: () => Speech.speak(pair[0], 'narrator', { rate: 0.85 }) }, h('b', {}, pair[0])), trPair(pair))))));
    /* Накладку кладемо всередину рамки, а не поруч: рамка знає свій розмір, тож
       стрілки завжди опиняються на краях саме малюнка. */
    const dots = cls => h('nav', { class: cls }, range(n).map(i =>
      h('a', { class: 'dot' + (i === idx ? ' on' : '') + (seen.includes(i) ? ' seen' : ''), href: href(i), 'aria-current': i === idx ? 'true' : null }, i + 1)));

    const panel = panelView(c, idx, { big: true });
    /* Поки звучить — дотик будь-де по кадру зупиняє. Коли не звучить, дотик по
       малюнку нічого не робить: випадково ввімкнути звук гірше, ніж не влучити
       в кнопку. Стрілки й ▶ опрацьовують себе самі. */
    panel.addEventListener('click', e => {
      if (e.target.closest('.pv-btn')) return;
      if (!playBtn.classList.contains('on')) return;
      stopAll(); resetAuto(); setPlay(false);
    });
    panel.append(h('div', { class: 'pv-ui' },
      idx > 0 ? h('a', { class: 'pv-btn pv-prev', href: href(idx - 1), title: t('prev'), 'aria-label': t('prev') }, '◀') : null,
      playBtn,
      idx < n - 1 ? h('a', { class: 'pv-btn pv-next', href: href(idx + 1), title: t('next'), 'aria-label': t('next') }, '▶') : null,
      h('span', { class: 'pv-n' }, `${idx + 1} / ${n}`)));

    const view = h('section', { class: 'reader' },
      h('div', { class: 'reader-top' },
        h('a', { class: 'btn', href: '#/' }, t('all_comics')),
        h('div', { class: 'reader-title' }, withTr(h('h2', {}, c.title), titleTr(c)), h('span', { class: 'meta' }, h('span', { class: 'lvl lvl-' + c.level }, c.level), ' ', catLabel(c.category))),
        dots('dots')),
      showReadHint() ? h('div', { class: 'read-hint' }, t('read_hint_tr')) : null,
      readLeftNote(),
      h('div', { class: 'reader-grid' }, h('div', { class: 'stage ' + turnDir(c.id, idx) }, panel, dots('dots dots-under')), script));
    keyHandler = e => {
      if (e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight' && idx < n - 1) location.hash = href(idx + 1);
      else if (e.key === 'ArrowLeft' && idx > 0) location.hash = href(idx - 1);
      else if (e.key === ' ') { e.preventDefault(); playPanel(cards); }
      else if (e.key === 'Escape') { stopAll(); resetAuto(); }
    };
    readFocus(true);
    if (auto && autoplay) setTimeout(runAuto, 450);
    return view;
  }

  /* ================= картки ================= */
  const DAY = 864e5, BOX_DAYS = [0, 0, 1, 3, 7, 14];
  // Колода для карток: слова з коміксів + усі тематичні слова зі сторінки «Слова».
  // Раніше тут були лише комікси, тож сотні вивчених за темами слів ніколи не поверталися на повторення.
  function allVocab() {
    const seen = new Map();
    for (const c of COMICS) for (const [no, uk, en] of c.vocab) { const key = norm(no); if (!seen.has(key)) seen.set(key, { key, no, uk, en: en || uk, c }); }
    for (const th of ((window.WORDS || {}).themes || [])) for (const [no, uk, en] of th.words) {
      const key = norm(no); if (key && !seen.has(key)) seen.set(key, { key, no, uk, en: en || uk, th });
    }
    return [...seen.values()];
  }
  function exampleFor(v) {
    const k = norm(v.no);
    for (const c of COMICS) for (const p of c.panels) for (const l of p.lines) if (l.who !== 'sfx' && (' ' + norm(l.no) + ' ').includes(' ' + k)) return l;
    return null;
  }
  const trLang = () => trLangs()[0] || T(); // «Пари»: перша з обраних мов перекладу
  /* Одна оцінка слова на весь застосунок: картки, «Пари», майбутні ігри.
     ok = згадав сам → коробка вище; ні → назад у першу й одразу в журнал помилок. */
  function gradeWord(v, ok, source) {
    if (!v || !v.key) return;
    const st = store.get('cards', {});
    const s0 = st[v.key] || { box: 0 };
    if (ok && s0.known) return;   // уже вивчене — нічого не змінюємо
    if (!ok) delete s0.known;      // помилився — слово повертається в навчання
    s0.box = ok ? Math.min(5, (s0.box || 0) + 1) : 1;
    s0.due = Date.now() + BOX_DAYS[s0.box] * DAY;
    s0.no = s0.no || v.no; s0.uk = s0.uk || v.uk; s0.en = s0.en || v.en;
    st[v.key] = s0; store.set('cards', st);
    if (!ok) errWord(v.no, v.uk, v.en, source || 'pairs', '');
    else errReviewed(v.no);   // згадав — помилка наближається до «виправлено» (інтервали — у errReviewed)
  }
  /* 🃏 Картки. Три відповіді:
       😕 Не знаю      — слово повернеться ще в цій сесії й потрапить у «Мої помилки»;
       🔁 Ще повторити — інтервали Лейтнера (1 → 3 → 7 → 14 днів);
       ✅ Знаю         — слово вивчене: більше не показуємо (повернути можна у «Вивчених словах»).
     «Знаю» спільне зі сторінкою «Слова»: позначене там теж не потрапляє в картки. */
  const CARD_T = {
    uk: { no: '😕 Не знаю', again: '🔁 Ще повторити', yes: '✅ Знаю', yes_d: 'більше не показувати', keys: 'Клавіші: Пробіл — перевернути · 1 — не знаю · 2 — ще повторити · 3 — знаю',
      sum: (a, b, c) => `✅ Знаю: ${a} · 🔁 Повторити: ${b} · 😕 Не знаю: ${c}`, known_t: n => `✅ Вивчені слова (${n})`, known_d: 'Ці слова більше не з’являються в картках. Передумали — поверніть слово в навчання.',
      restore: '↩ Повернути', learned: '✅ Вивчено — більше не покажемо', none_left: 'Усі слова цієї колоди вже вивчені або чекають свого дня. Заходьте завтра!', stage: ['нові', 'вчу', 'повторюю', 'вивчено'] },
    en: { no: '😕 Don’t know', again: '🔁 Review again', yes: '✅ I know it', yes_d: 'don’t show again', keys: 'Keys: Space — flip · 1 — don’t know · 2 — review again · 3 — I know it',
      sum: (a, b, c) => `✅ Known: ${a} · 🔁 Review: ${b} · 😕 Don’t know: ${c}`, known_t: n => `✅ Learned words (${n})`, known_d: 'These words no longer appear in flashcards. Changed your mind? Put a word back into learning.',
      restore: '↩ Put back', learned: '✅ Learned — we won’t show it again', none_left: 'Every word in this deck is learned or waiting for its day. Come back tomorrow!', stage: ['new', 'learning', 'reviewing', 'learned'] },
    no: { no: '😕 Kan ikke', again: '🔁 Repeter igjen', yes: '✅ Kan det', yes_d: 'ikke vis igjen', keys: 'Taster: Mellomrom — snu · 1 — kan ikke · 2 — repeter · 3 — kan det',
      sum: (a, b, c) => `✅ Kan: ${a} · 🔁 Repeter: ${b} · 😕 Kan ikke: ${c}`, known_t: n => `✅ Lærte ord (${n})`, known_d: 'Disse ordene vises ikke lenger i kortene. Ombestemt deg? Legg ordet tilbake.',
      restore: '↩ Legg tilbake', learned: '✅ Lært — vi viser det ikke igjen', none_left: 'Alle ordene i denne kortstokken er lært eller venter på sin dag. Kom tilbake i morgen!', stage: ['nye', 'lærer', 'repeterer', 'lært'] },
    ar: { no: '😕 لا أعرفها', again: '🔁 كرّرها لاحقًا', yes: '✅ أعرفها', yes_d: 'لا تعرضها مجددًا', keys: 'المفاتيح: مسافة — قلب · 1 — لا أعرف · 2 — كرّر · 3 — أعرف',
      sum: (a, b, c) => `✅ أعرفها: ${a} · 🔁 للتكرار: ${b} · 😕 لا أعرفها: ${c}`, known_t: n => `✅ كلمات متقنة (${n})`, known_d: 'لم تعد هذه الكلمات تظهر في البطاقات. غيّرت رأيك؟ أعد الكلمة إلى التعلّم.',
      restore: '↩ أعِدها', learned: '✅ أُتقنت — لن نعرضها مجددًا', none_left: 'كل كلمات هذه المجموعة متقنة أو تنتظر موعدها. عد غدًا!', stage: ['جديدة', 'أتعلّمها', 'أراجعها', 'متقنة'] }
  };
  if (window.KL_T_FILL) KL_T_FILL(CARD_T, 'app.js:CARD_T');
  const ct = (k, ...a) => { const tb = CARD_T[ui] || CARD_T.en; const v = k in tb ? tb[k] : CARD_T.en[k]; return typeof v === 'function' ? v(...a) : v; };
  // «знаю» зі сторінки «Слова» (ключі «тема|слово») — у нормалізованому вигляді, як ключі карток
  const knownFromWords = () => new Set((store.get('wordsKnown', []) || []).map(x => norm(String(x).split('|').slice(1).join('|') || x)));
  const isLearned = (v, state, wk) => !!((state[v.key] && state[v.key].known) || wk.has(v.key));
  function markLearned(v, state) {
    const s = state[v.key] || { box: 0 };
    s.known = true; s.box = 5; s.due = 0; s.no = s.no || v.no; s.uk = s.uk || v.uk; s.en = s.en || v.en; s.learned = today();
    state[v.key] = s; store.set('cards', state);
    if (v.th) { const list = store.get('wordsKnown', []) || [], key = v.th.id + '|' + v.no; if (!list.includes(key)) store.set('wordsKnown', [...list, key]); }
    errResolve(v.no);
  }
  function unlearn(key) {
    const state = store.get('cards', {});
    if (state[key]) { delete state[key].known; state[key].box = 1; state[key].due = Date.now(); store.set('cards', state); }
    store.set('wordsKnown', (store.get('wordsKnown', []) || []).filter(x => norm(String(x).split('|').slice(1).join('|') || x) !== key));
  }
  function renderCards(cid) {
    const c0 = COMICS.find(x => x.id === cid);
    const deck = c0 ? allVocab().filter(v => c0.vocab.some(([no]) => norm(no) === v.key)) : allVocab();
    const state = store.get('cards', {});
    const limit = settings.level === 'kids' ? 10 : 20;
    const boxOf = v => (state[v.key] ? state[v.key].box : 0);
    const wk = knownFromWords();
    const errSet = new Set(errList().map(e => norm(e.k)));
    // черга: лише невивчені, яким настав час; спершу слова з помилками, далі — за коробкою
    let queue = shuffle(deck.filter(v => !isLearned(v, state, wk) && (!state[v.key] || (state[v.key].due || 0) <= Date.now())))
      .sort((a, b) => (errSet.has(b.key) - errSet.has(a.key)) || (boxOf(a) - boxOf(b))).slice(0, limit);
    let i = 0, cntYes = 0, cntAgain = 0, cntNo = 0, reviewed = 0;
    const requeued = new Set();
    const root = h('section', { class: 'cards-view' });
    // етапи: нові · вчу (1–2) · повторюю (3–5) · вивчено
    const stages = () => {
      const learnedN = deck.filter(v => isLearned(v, state, wk)).length;
      const rest = deck.filter(v => !isLearned(v, state, wk));
      const vals = [rest.filter(v => boxOf(v) === 0).length, rest.filter(v => boxOf(v) >= 1 && boxOf(v) <= 2).length, rest.filter(v => boxOf(v) >= 3).length, learnedN];
      return h('div', { class: 'cd-stages', title: t('boxes_tip') }, vals.map((n, k) => h('div', { class: 'cd-st s' + k },
        h('span', { class: 'cd-st-bar' }, h('i', { style: { width: Math.max(n ? 4 : 0, n / Math.max(1, deck.length) * 100) + '%' } })), h('b', {}, n), h('small', {}, ct('stage')[k]))));
    };
    const learnedBox = () => {
      const list = deck.filter(v => isLearned(v, state, wk));
      if (!list.length) return null;
      const ul = h('div', { class: 'cd-known' }, list.slice(0, 200).map(v => {
        const row = h('div', { class: 'cd-known-row' }, h('b', { lang: 'nb' }, v.no), h('small', {}, trText(v.en, v.uk, trLang())),
          h('button', { class: 'btn small', type: 'button', onclick: () => { unlearn(v.key); delete (state[v.key] || {}).known; wk.delete(v.key); row.remove(); } }, ct('restore')));
        return row;
      }));
      return h('details', { class: 'box cd-known-box' }, h('summary', {}, ct('known_t', list.length)), h('p', { class: 'hint' }, ct('known_d')), ul);
    };
    const head = () => h('div', { class: 'q-head' }, h('a', { class: 'btn', href: '#/' }, t('exit')), h('h2', {}, `${t('cards_title')}: ${c0 ? c0.title : t('cards_all')}`), h('span', { class: 'stat' }, queue.length ? `${Math.min(i + 1, queue.length)} / ${queue.length}` : '✓'));
    function draw() {
      stopAll();
      if (i >= queue.length) {
        if (reviewed) { bump('cardsReviewed', reviewed); markDay('cards', reviewed); }
        if (reviewed && cntNo === 0) { confetti(); Sfx.win(); }
        root.replaceChildren(head(), h('div', { class: 'q-card result' }, h('div', { style: { fontSize: '4rem' } }, queue.length ? '🎉' : '😎'),
          h('h2', {}, queue.length ? t('cards_done', reviewed) : t('cards_all_done')), h('p', { class: 'score' }, queue.length ? ct('sum', cntYes, cntAgain, cntNo) : ct('none_left')), stages(),
          h('div', { class: 'row-center' }, h('button', { class: 'btn accent', type: 'button', onclick: () => { route(); } }, t('cards_again')),
            errList().length ? h('a', { class: 'btn', href: '#/quiz/mistakes' }, AN_T().redo) : null, h('a', { class: 'btn', href: '#/analysis' }, AN_T().short))), learnedBox());
        return;
      }
      const v = queue[i], ex = exampleFor(v);
      const say = () => Speech.speak(v.no, 'narrator', { rate: 0.9 });
      const card = h('button', { class: 'flash', type: 'button', 'aria-label': t('flip_aria') },
        h('div', { class: 'face front' }, h('span', { class: 'face-tag' }, 'NO'),
          window.KomiksPics && window.KomiksPics.has(v.no, v.uk) ? h('div', { class: 'fpic' }, window.KomiksPics.el(v.no, 90, v.uk)) : null,   // мальована картка замість емодзі
          h('div', { class: 'fw' }, v.no), ex ? h('div', { class: 'fex' }, '«' + ex.no + '»') : null, h('small', { class: 'flip-hint' }, t('flip_hint'))),
        (() => { const tr = both(v.uk, v.en), et = ex ? both(ex.uk, ex.en) : null, ls = trLangs().filter(l => tr[l]); const use = ls.length ? ls : ['en'];
          return h('div', { class: 'face back' }, h('span', { class: 'face-tag alt' }, use.map(l => FLAG[l][0]).join(' · ')), use.map((l, k) => h('div', { class: k ? 'fw-en' : 'fw', dir: l === 'ar' ? 'rtl' : null }, tr[l])),
            et ? h('div', { class: 'fex' }, use.map((l, k) => [k ? h('br') : null, et[l] ? '«' + et[l] + '»' : null])) : null); })());
      const flip = () => { card.classList.toggle('flipped'); if (!card.classList.contains('flipped')) say(); };
      card.addEventListener('click', flip);
      const grade = mode => {
        const s = state[v.key] || { box: 0 };
        s.no = s.no || v.no; s.uk = s.uk || v.uk; s.en = s.en || v.en;
        if (mode === 'yes') { markLearned(v, state); cntYes++; Sfx.good(); }
        else if (mode === 'again') { s.box = Math.min(5, Math.max(1, (s.box || 0) + 1)); s.due = Date.now() + BOX_DAYS[s.box] * DAY; state[v.key] = s; store.set('cards', state); cntAgain++; Sfx.tick(); errReviewed(v.no); }
        else {
          s.box = 1; s.due = Date.now(); state[v.key] = s; store.set('cards', state); cntNo++;
          errWord(v.no, v.uk, v.en, 'cards', '');
          if (!requeued.has(v.key)) { requeued.add(v.key); queue.push(v); }   // ще раз наприкінці сесії
        }
        reviewed++;
        if (mode === 'yes') { const note = h('div', { class: 'cd-toast', role: 'status' }, ct('learned')); root.append(note); setTimeout(() => note.remove(), 1600); }
        i++; draw();
      };
      const recOut = h('div', { class: 'rec-out center' });
      root.replaceChildren(head(), h('div', { class: 'bar' }, h('i', { style: { width: (i / queue.length * 100) + '%' } })), h('div', { class: 'flash-wrap' }, card),
        h('div', { class: 'row-center' }, h('button', { class: 'btn', type: 'button', onclick: say }, t('listen_btn')), h('button', { class: 'btn', type: 'button', onclick: e => practice(v.no, recOut, e.currentTarget) }, t('say_btn'))),
        recOut, h('div', { class: 'row-center grade grade2' },
          h('button', { class: 'btn accent', type: 'button', onclick: () => grade('no') }, ct('no')),
          h('button', { class: 'btn good', type: 'button', onclick: () => grade('yes') }, h('span', {}, ct('yes')), h('small', {}, ct('yes_d')))),
        stages());   // підказку про клавіші прибрано на прохання — самі клавіші (Пробіл, 1, 2, 3) працюють
      setTimeout(say, 350);
      keyHandler = e => { if (e.key === ' ') { e.preventDefault(); flip(); } else if (e.key === '1' || e.key === 'ArrowLeft') grade('no'); else if (e.key === '2' || e.key === '3' || e.key === 'ArrowRight') grade('yes'); };   // дві кнопки: не знаю (на повторення) / знаю (більше не показувати)
    }
    draw();
    return root;
  }

  /* ================= пари ================= */
  function renderPairs(c) {
    const kids = settings.level === 'kids', n = kids ? 6 : 8, tl = trLang();
    const root = h('section', { class: 'pairs-view' });
    function start() {
      stopAll();
      const trOf = p => trText(p[2], p[1], tl);
      const items = sample(c.vocab.filter(p => p[0].length <= 16 && trOf(p).length <= 26), n).map(p => [p[0], trOf(p)]);
      const tiles = shuffle(items.flatMap(([no, tr], k) => [{ k, lang: 'no', text: no }, { k, lang: tl, text: tr }]));
      let open = [], moves = 0, matched = 0, lock = false;
      const t0 = Date.now();
      const movesEl = h('span', { class: 'stat' }, '👣 0'), timeEl = h('span', { class: 'stat' }, '⏱ 0');
      const timer = setInterval(() => { if (!root.isConnected) return clearInterval(timer); timeEl.textContent = `⏱ ${Math.round((Date.now() - t0) / 1000)}`; }, 1000);
      const grid = h('div', { class: 'tiles' });
      const els = tiles.map(tile => {
        const b = h('button', { class: 'tile', type: 'button', 'aria-label': t('card_aria') }, h('span', { class: 'tile-in' }, h('span', { class: 'tile-back' }, '?'), h('span', { class: 'tile-front ' + (tile.lang === 'no' ? 'no' : 'uk') }, h('small', {}, tile.lang.toUpperCase()), tile.text)));
        b.addEventListener('click', () => {
          if (lock || tile.done || open.includes(tile)) return;
          b.classList.add('open');
          if (tile.lang === 'no') { Speech.stop(); Speech.speak(tile.text, 'narrator', { rate: 0.95 }); }
          open.push(tile);
          if (open.length < 2) return;
          moves++; movesEl.textContent = `👣 ${moves}`;
          const [a, z] = open;
          if (a.k === z.k && a.lang !== z.lang) {
            a.done = z.done = true; matched++; open = [];
            setTimeout(() => { els[tiles.indexOf(a)].classList.add('done'); els[tiles.indexOf(z)].classList.add('done'); Sfx.good(); }, 250);
            if (matched === n) setTimeout(win, 900);
          } else {
            lock = true;
            setTimeout(() => { els[tiles.indexOf(a)].classList.remove('open'); els[tiles.indexOf(z)].classList.remove('open'); open = []; lock = false; }, 1200);
          }
        });
        return b;
      });
      grid.append(...els);
      function win() {
        clearInterval(timer);
        const secs = Math.round((Date.now() - t0) / 1000), key = 'pairs.' + c.id + '.' + settings.level;
        const best = store.get(key, null), record = !best || moves < best.moves;
        if (record) store.set(key, { moves, secs });
        bump('pairs'); confetti(); Sfx.win();
        root.replaceChildren(h('div', { class: 'q-card result' }, h('div', { style: { fontSize: '4rem' } }, '🧠🎉'), h('h2', {}, record ? t('record') : t('all_pairs')),
          h('p', { class: 'score' }, t('pairs_score', moves, secs, best && !record ? best.moves : 0)),
          h('div', { class: 'mistakes' }, items.map(([no, tr]) => h('div', { class: 'mistake' }, h('span', {}, h('b', {}, no), ' — ', tr), h('button', { class: 'play', type: 'button', onclick: () => Speech.speak(no) }, '🔊')))),
          h('div', { class: 'row-center' }, h('button', { class: 'btn accent', type: 'button', onclick: start }, t('new_game')), h('a', { class: 'btn primary', href: `#/cards/${c.id}` }, t('cards')), h('a', { class: 'btn', href: '#/' }, t('home')))));
      }
      root.replaceChildren(h('div', { class: 'q-head' }, h('a', { class: 'btn', href: '#/' }, t('exit')), h('h2', {}, `${t('pairs_title')}: ${c.title}`), h('span', { class: 'row-center' }, movesEl, timeEl)), h('p', { class: 'hint' }, t('pairs_hint')), grid);
    }
    start();
    return root;
  }

  /* ================= рольова гра ================= */
  function renderRole(c, who) {
    const counts = {};
    c.panels.forEach(p => p.lines.forEach(l => { if (l.who !== 'sfx' && l.who !== 'narrator') counts[l.who] = (counts[l.who] || 0) + 1; }));
    const root = h('section', { class: 'role-view' });
    if (!who || !counts[who]) {
      root.append(h('div', { class: 'q-head' }, h('a', { class: 'btn', href: '#/' }, t('exit')), h('h2', {}, `${t('role_title')}: ${c.title}`)),
        h('p', { class: 'hint', style: { marginBottom: '16px' } }, t('role_choose')),
        h('div', { class: 'opts' }, Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([w, k]) => h('a', { class: 'opt', href: `#/role/${c.id}/${w}` }, h('span', { class: 'ava', style: { background: ch(w).color } }, ch(w).emoji), h('span', {}, ch(w).no, h('br'), h('small', { class: 'muted' }, t('lines_n', k)))))));
      return root;
    }
    const seq = c.panels.flatMap((p, pi) => p.lines.map(l => ({ ...l, pi })));
    const scores = [];
    let i = 0, paused = false;
    async function draw() {
      if (i >= seq.length) return finish();
      const l = seq[i], mine = l.who === who, cc = ch(l.who);
      const recOut = h('div', { class: 'rec-out' });
      const nextBtn = h('button', { class: 'btn yellow', type: 'button', onclick: () => { i++; draw(); } }, t('next'));
      const pauseBtn = h('button', { class: 'btn', type: 'button', onclick: () => { paused = !paused; if (paused) { stopAll(); pauseBtn.textContent = t('resume'); } else draw(); } }, paused ? t('resume') : t('pause'));
      const lineEl = h('article', { class: 'line' + (l.who === 'sfx' ? ' sfx' : '') + (l.who === 'narrator' ? ' narr' : ''), style: { '--c': cc.color } },
        h('div', { class: 'who' }, h('span', { class: 'ava' }, cc.emoji), h('span', { class: 'nm' }, cc.no)),
        withTr(h('div', { class: 'bubble' + (mine ? ' mine' : '') }, h('p', { class: 'prim' }, wordSpans(c, l.no))), trLine(l)));
      const actions = mine
        ? h('div', { class: 'controls' }, h('button', { class: 'btn primary big', type: 'button', onclick: async e => { const s = await practice(l.no, recOut, e.currentTarget); if (s != null) scores[i] = s; } }, Rec.Ctor ? t('say_big') : t('said')),
          h('button', { class: 'btn', type: 'button', onclick: () => Speech.speak(l.no, l.who, { rate: 0.85 }) }, t('say_hint')), h('span', { class: 'grow' }), nextBtn)
        : h('div', { class: 'controls' }, pauseBtn, h('span', { class: 'grow' }), h('button', { class: 'btn', type: 'button', onclick: () => { i++; draw(); } }, t('skip')));
      root.replaceChildren(
        h('div', { class: 'q-head' }, h('a', { class: 'btn', href: `#/role/${c.id}` }, t('other_role')), h('h2', {}, t('you_are', ch(who).emoji, ch(who).no)), h('span', { class: 'stat' }, `${i + 1} / ${seq.length}`)),
        h('div', { class: 'bar' }, h('i', { style: { width: (i / seq.length * 100) + '%' } })),
        h('div', { class: 'reader-grid' }, h('div', { class: 'stage' }, panelView(c, l.pi, { big: true })),
          h('div', { class: 'script' }, mine ? h('div', { class: 'your-turn' }, t('your_turn')) : h('div', { class: 'panel-label' }, t('speaking', cc.no)), lineEl, recOut, actions)));
      if (mine) { if (!Rec.Ctor) recOut.replaceChildren(h('span', { class: 'rec-msg' }, t('read_next'))); return; }
      if (paused) return;
      const my = await claim();
      lineEl.classList.add('speaking');
      await Speech.speak(l.no, l.who, { onWord: k => highlight($('.prim', lineEl), k) });
      if (my !== playToken || paused || !root.isConnected) return;
      await sleep(settings.level === 'kids' ? 700 : 400);
      if (my !== playToken || paused || !root.isConnected) return;
      i++; draw();
    }
    function finish() {
      const vals = seq.map((l, k) => (l.who === who ? scores[k] : undefined)).filter(v => v != null);
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      const st = avg == null ? 3 : scoreStars(avg);
      bump('roles'); confetti(); Sfx.win();
      root.replaceChildren(h('div', { class: 'q-card result' }, h('div', { style: { fontSize: '4rem' } }, '🎭👏'), h('div', { class: 'big-stars' }, range(3).map(k => h('span', { class: k < st ? 'f' : '' }, '★'))),
        h('h2', {}, t('bravo', ch(who).no)), h('p', { class: 'score' }, avg == null ? t('role_done') : t('role_avg', Math.round(avg * 100), vals.length, counts[who])),
        h('div', { class: 'row-center' }, h('button', { class: 'btn accent', type: 'button', onclick: () => { i = 0; scores.length = 0; draw(); } }, t('again')), h('a', { class: 'btn primary', href: `#/role/${c.id}` }, t('other_role_btn')), h('a', { class: 'btn', href: '#/' }, t('home')))));
    }
    draw();
    return root;
  }

  /* ================= алфавіт ================= */
  /* 🔤 картинка до літери (data/alphabet-pics.js) — лише якщо вона саме для слова з алфавіту; інакше емодзі */
  const alphaPic = (letter, word, size = 64) => {
    const p = (window.ALPHA_PICS || {})[letter];
    if (!p || norm(p[1]) !== norm(word)) return null;
    return h('img', { class: 'pic-photo alpha-pic', src: p[0], width: size, height: size, alt: word, loading: 'lazy', decoding: 'async' });
  };
  function renderAlphabet() {
    bump('alphaVisits'); store.set('alphaVisited', true);
    const spec = B.special || {};
    const cardFor = ([letter, name, word, emoji, uk, en]) => {
      const tr = both(uk, en);
      const el = h('button', { class: 'letter-card' + (spec[letter] ? ' special' : ''), type: 'button', onclick: async () => { const my = await claim(); await Speech.speak(name, 'narrator', { rate: 0.85 }); if (my !== playToken) return; await sleep(250); Speech.speak(word, 'narrator', { rate: 0.9 }); } },
        h('span', { class: 'lc-letter' }, letter, h('small', {}, letter.toLowerCase())), h('span', { class: 'lc-emoji' }, alphaPic(letter, word) || emoji), h('span', { class: 'lc-word' }, word));
      return withTr(el, tr);
    };
    const playAll = async () => { const my = await claim(); for (const [, name] of B.alphabet) { if (my !== playToken) return; await Speech.speak(name, 'narrator', { rate: 0.9 }); await sleep(120); } };
    return h('section', { class: 'basics' }, pageHead(t('alpha_title')),
      h('p', { class: 'lead-p' }, t('alpha_intro')),
      h('div', { class: 'row-left' }, h('button', { class: 'btn primary', type: 'button', onclick: playAll }, t('alpha_play_all')), h('a', { class: 'btn accent', href: '#/quiz/alphabet' }, t('alpha_test')), h('span', { class: 'stars-inline' }, stars(bestStars('alphabet')))),
      h('div', { class: 'letter-grid' }, B.alphabet.map(cardFor)),
      h('h3', { class: 'sec-sub' }, t('alpha_special')),
      h('div', { class: 'special-grid' }, Object.entries(spec).map(([letter, d]) => h('div', { class: 'special-item' }, h('b', {}, letter), h('span', {}, d[ui] || d.en || d.uk)))),
      phoneticsView());
  }
  /* голосні, дзвінкі/глухі, дифтонги, звукосполучення, склади */
  function phoneticsView() {
    const P = B.phonetics; if (!P) return null;
    const L = x => (x ? x[ui] || x.en || x.uk : '');
    const speakSeq = async list => { const my = await claim(); for (const w of list) { if (my !== playToken) return; await Speech.speak(w, 'narrator', { rate: 0.8 }); await sleep(150); } };
    const chip = (label, words, tr, cls = '') => withTr(h('button', { class: 'ph-chip ' + cls, type: 'button', onclick: () => speakSeq(words) }, h('b', {}, label), words.length ? h('small', {}, words.join(', ')) : null), tr);
    const wordTr = w => lookup(null, w);
    const letterBox = (group, cls) => h('div', { class: 'box ph-box ' + cls }, h('h4', {}, L(group.title)), h('p', { class: 'hint' }, L(group.text)),
      h('div', { class: 'ph-grid' }, group.items.map(([letter, word]) => chip(letter, [letter.toLowerCase(), word], wordTr(word)))));
    // конструктор складів
    const out = h('div', { class: 'syl-out' }, '—');
    let cons = 'm';
    const consBtns = h('div', { class: 'syl-row' }, P.syllables.consonants.map(k => h('button', { class: 'syl-btn' + (k === cons ? ' on' : ''), type: 'button', onclick: e => { cons = k; $$('button', consBtns).forEach(b => b.classList.toggle('on', b === e.currentTarget)); } }, k)));
    const vowBtns = h('div', { class: 'syl-row' }, P.vowels.items.map(([v]) => h('button', { class: 'syl-btn vow', type: 'button', onclick: () => { const syl = cons + v.toLowerCase(); out.textContent = syl.toUpperCase() + ' · ' + syl; claim().then(() => Speech.speak(syl, 'narrator', { rate: 0.75 })); } }, v.toLowerCase())));
    return h('section', { class: 'phonetics' },
      h('h3', { class: 'sec-sub' }, L(P.title)), h('p', { class: 'lead-p' }, L(P.intro)),
      letterBox(P.vowels, 'ph-vow'),
      h('div', { class: 'ph-two' }, letterBox(P.voiced, 'ph-voiced'), letterBox(P.voiceless, 'ph-voiceless')),
      h('div', { class: 'box ph-box' }, h('h4', {}, L(P.pairs.title)), h('p', { class: 'hint' }, L(P.pairs.text)),
        h('div', { class: 'ph-grid' }, P.pairs.items.map(([a, b, wa, wb]) => chip(`${a} ↔ ${b}`, [wa, wb], both(`${wa} — ${(wordTr(wa) || {}).uk || ''} · ${wb} — ${(wordTr(wb) || {}).uk || ''}`, `${wa} — ${(wordTr(wa) || {}).en || ''} · ${wb} — ${(wordTr(wb) || {}).en || ''}`))))),
      h('div', { class: 'box ph-box' }, h('h4', {}, L(P.diphthongs.title)), h('p', { class: 'hint' }, L(P.diphthongs.text)),
        h('div', { class: 'ph-grid' }, P.diphthongs.items.map(([d, words]) => chip(d, words, both(words.map(w => `${w} — ${(wordTr(w) || {}).uk || '…'}`).join('; '), words.map(w => `${w} — ${(wordTr(w) || {}).en || '…'}`).join('; ')))))),
      h('div', { class: 'box ph-box' }, h('h4', {}, L(P.combos.title)), h('p', { class: 'hint' }, L(P.combos.text)),
        h('div', { class: 'table-wrap' }, h('table', { class: 'gram-table ph-table' }, h('tbody', {}, P.combos.items.map(c => h('tr', {},
          h('td', {}, h('button', { class: 'play', type: 'button', 'aria-label': 'Lytt', onclick: () => speakSeq(c.words) }, '🔊')),
          h('td', { class: 'no-cell' }, c.spell), h('td', {}, h('b', { class: 'ipa' }, c.sound)), h('td', {}, L(c)),
          h('td', {}, c.words.map((w, i) => [i ? ', ' : '', withTr(h('span', { class: 'ph-word' }, w), wordTr(w))]))))))),
      h('div', { class: 'box ph-box' }, h('h4', {}, L(P.silent.title)), h('p', { class: 'hint' }, L(P.silent.text)),
        h('div', { class: 'ph-grid' }, P.silent.items.map(([spell, word]) => chip(spell, [word], wordTr(word))))),
      h('div', { class: 'box ph-box' }, h('h4', {}, L(P.long.title)), h('p', { class: 'hint' }, L(P.long.text)),
        h('div', { class: 'ph-grid' }, P.long.items.map(([a, b]) => chip(`${a} / ${b}`, [a, b], both(`${a} — ${(wordTr(a) || {}).uk || ''} · ${b} — ${(wordTr(b) || {}).uk || ''}`, `${a} — ${(wordTr(a) || {}).en || ''} · ${b} — ${(wordTr(b) || {}).en || ''}`))))),
      h('div', { class: 'box ph-box syl-box' }, h('h4', {}, L(P.syllables.title)), h('p', { class: 'hint' }, L(P.syllables.text)),
        consBtns, vowBtns, out,
        h('h4', {}, L(P.syllables.wordsTitle)),
        h('div', { class: 'ph-grid' }, P.syllables.words.map(([split, word]) => chip(split, [word], wordTr(word), 'syl-word'))))));
  }

  /* ================= числа ================= */
  function renderNumbers() {
    store.set('numbersVisited', true);
    const numCard = n => { const word = B.numberWord(n); return h('button', { class: 'num-card', type: 'button', onclick: () => { claim().then(() => Speech.speak(word, 'narrator', { rate: 0.9 })); } }, h('b', {}, n), h('span', {}, word)); };
    const input = h('input', { type: 'number', min: 0, max: 1000, value: 21, 'aria-label': t('num_builder') });
    const out = h('div', { class: 'num-out' });
    const show = () => { const n = clamp(parseInt(input.value, 10) || 0, 0, 1000); const w = B.numberWord(n); out.replaceChildren(h('b', {}, n), ' = ', h('span', { class: 'num-word' }, w)); return w; };
    input.addEventListener('input', show);
    show();
    return h('section', { class: 'basics' }, pageHead(t('num_title')),
      h('p', { class: 'lead-p' }, t('num_intro')),
      h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/quiz/numbers' }, t('num_test')), h('span', { class: 'stars-inline' }, stars(bestStars('numbers')))),
      h('h3', { class: 'sec-sub' }, t('num_basic')), h('div', { class: 'num-grid' }, range(21).map(numCard)),
      h('h3', { class: 'sec-sub' }, t('num_tens')), h('div', { class: 'num-grid' }, [30, 40, 50, 60, 70, 80, 90, 100, 1000].map(numCard)),
      h('div', { class: 'box builder' }, h('h3', {}, t('num_builder')), h('p', { class: 'hint' }, t('num_builder_d')),
        h('div', { class: 'row-left' }, input, h('button', { class: 'btn primary', type: 'button', onclick: () => { const w = show(); claim().then(() => Speech.speak(w, 'narrator', { rate: 0.9 })); } }, '🔊'),
          h('button', { class: 'btn', type: 'button', onclick: () => { input.value = Math.floor(Math.random() * 101); const w = show(); claim().then(() => Speech.speak(w, 'narrator', { rate: 0.9 })); } }, t('num_random'))),
        out, h('p', { class: 'hint' }, t('num_rule'))));
  }

  /* ================= список тестів ================= */
  function renderTests() {
    const I = window.KomiksIcons;
    const tile = (href, title, sub, key) => h('a', { class: 'test-tile' + (I ? ' with-ic' : ''), href }, I ? I.badge(...I.forKey(key)) : null, h('b', {}, I ? I.strip(title) : title), h('small', {}, sub), stars(bestStars(key)));
    const ROOM = { uk: ['🎬 Кімната дієслів', 'Норвезькі дієслова в інтерактивних коміксах і вправах — окрема кімната, зручна для класу.'],
      en: ['🎬 Verb room', 'Norwegian verbs in interactive comics and exercises — a separate room, handy for a class.'],
      no: ['🎬 Verbrommet', 'Norske verb i interaktive tegneserier og øvelser – et eget rom, fint for klassen.'],
      ar: ['🎬 غرفة الأفعال', 'الأفعال النرويجية في قصص وتمارين تفاعلية — غرفة منفصلة مناسبة للصف.'] }[ui] || ['🎬 Verb room', ''];
    return h('section', { class: 'tests' }, pageHead(t('tests_title')),
      h('p', { class: 'lead-p' }, t('tests_intro')),
      /* Кімната живе на сервері, тож в офлайн-збірці її немає. Посилання в
         браузер із застосунку, який обіцяє працювати без мережі, — це і
         непрацююча кнопка, і привід для відмови за правилом App Store 4.2
         («це просто обгортка навколо сайту»). */
      OFFLINE ? null : h('div', { class: 'test-grid' }, h('a', { class: 'test-tile room-tile', href: 'https://bilohash.com/comiks/room_1/' },
        h('b', {}, ROOM[0]), h('small', {}, ROOM[1]))),
      h('h3', { class: 'sec-sub' }, t('tests_levels')),
      h('div', { class: 'test-grid' }, B.levels.map(l => { const n = COMICS.filter(c => c.level === l).length; return n ? tile(`#/quiz/level/${l}`, t('level_test', l), t('level_test_d', n), 'level:' + l) : h('div', { class: 'test-tile off' }, h('b', {}, t('level_test', l)), h('small', {}, t('no_comics_level'))); })),
      h('h3', { class: 'sec-sub' }, t('order_title')),
      h('p', { class: 'lead-p' }, t('order_intro')),
      h('div', { class: 'test-grid' },
        tile('#/quiz/order/all', t('order_all'), t('order_all_d'), 'order:all'),
        ...B.levels.map(l => { const n = COMICS.filter(c => c.level === l).length;
          return n ? tile(`#/quiz/order/${l}`, t('order_lvl', l), t('order_lvl_d', l), 'order:' + l)
            : h('div', { class: 'test-tile off' }, h('b', {}, t('order_lvl', l)), h('small', {}, t('no_comics_level'))); })),
      h('h3', { class: 'sec-sub' }, t('tests_basics')),
      h('div', { class: 'test-grid' }, tile('#/quiz/alphabet', (tx('modules') || {}).alphabet[1], (tx('modules') || {}).alphabet[2], 'alphabet'), tile('#/quiz/numbers', (tx('modules') || {}).numbers[1], (tx('modules') || {}).numbers[2], 'numbers')),
      window.KomiksMath ? [h('h3', { class: 'sec-sub' }, window.KomiksMath.text('tests')),
        h('div', { class: 'test-grid' }, tile('#/quiz/math/mul/10', '✖️ ' + window.KomiksMath.text('test_mul'), '1–10 × 1–10', 'math:mul'), tile('#/quiz/math/add/20', '➕ ' + window.KomiksMath.text('test_add'), '0–20', 'math:add'), tile('#/quiz/math/div/10', '➗ ÷', '1–100', 'math:div'), window.KomiksFractions ? tile('#/quiz/math/frac', window.KomiksFractions.text('title'), '1/2 · 3/4 · 2/5', 'math:frac') : null, tile('#/math/rocket', '🚀 Math Rocket', window.KomiksMath.text('best', store.get('mathBest', 0)), 'rocket'))] : null,
      window.KomiksEnglish ? [h('h3', { class: 'sec-sub' }, window.KomiksEnglish.text('tests_title')),
        h('div', { class: 'test-grid' }, window.KomiksEnglish.comics().map(c => tile('#/quiz/en/' + c.id, '\uD83C\uDDEC\uD83C\uDDE7 ' + c.title, `${c.level} \u00b7 ${c.titleUk}`, 'en:' + c.id)))] : null,
      window.KomiksKoding ? [h('h3', { class: 'sec-sub' }, '💻 ' + window.KomiksKoding.text('nav')),
        h('div', { class: 'test-grid' }, ['', 'robot', 'code', 'html', 'algo', 'bug', 'lang'].map(k => tile('#/quiz/koding' + (k ? '/' + k : ''), window.KomiksKoding.text('t_' + (k || 'mix')), window.KomiksKoding.text('d_' + (k || 'mix')), 'koding' + (k ? ':' + k : ''))))] : null,
      window.KomiksWords ? [h('h3', { class: 'sec-sub' }, window.KomiksWords.text('tests')),
        h('div', { class: 'test-grid' }, tile('#/quiz/words', '\uD83D\uDCDD ' + window.KomiksWords.text('all_test').replace(/^\uD83E\uDDE9\s*/, ''), (tx('modules') || {}).words[2], 'words'),
          window.KomiksWords.themes().map(th => tile('#/quiz/words/' + th.id, th.icon + ' ' + th.no, `${th.level} · ${window.KomiksWords.name(th)}`, 'words:' + th.id)))] : null,
      window.KomiksGrammar ? [h('h3', { class: 'sec-sub' }, window.KomiksGrammar.text('tests')),
        h('div', { class: 'test-grid' }, tile('#/quiz/grammar', '📐 ' + window.KomiksGrammar.text('mix_test').replace(/^🧩\s*/, ''), (tx('modules') || {}).grammar[2], 'grammar'),
          tile('#/quiz/clock', (tx('modules') || {}).clock[0] + ' ' + (tx('modules') || {}).clock[1], (tx('modules') || {}).clock[2], 'clock'),
          window.KomiksGrammar.topics().map(tp => tile('#/quiz/grammar/' + tp.id, tp.icon + ' ' + tp.no, `${tp.level} · ${ui === 'no' ? tp.no : tp[ui] || trText(tp.en, tp.uk, ui)}`, 'grammar:' + tp.id)))] : null,
      h('h3', { class: 'sec-sub' }, t('tests_comics')),
      h('div', { class: 'test-grid' }, COMICS.map(c => withTr(tile(`#/quiz/${c.id}`, c.title, `${c.level} · ${catLabel(c.category)}`, c.id), titleTr(c)))));
  }

  /* ================= план навчання ================= */
  // налаштування плану: вимкнені розділи (planOff) і окремі кроки, які учень уже знає (planKnown)
  const PS = {
    uk: { title: '🎯 Мій план навчання', intro: 'Вимкни те, що вже знаєш, — план і чек-лист стануть коротшими.', groups: 'Що входить у план', show_steps: n => `Вибрати окремі кроки (${n})`, hidden: n => `Приховано кроків: ${n}`, reset: '↺ Повернути все', know: '✓ Знаю', know_t: 'Я це вже знаю — прибрати з плану', setup: '⚙️ Налаштувати план', open: 'Відкрити план →',
      g: { basics: '🔤 Алфавіт і числа', words: '📝 Слова за темами', grammar: '📐 Граматика', clock: '🕐 Годинник', read: '📖 Читання коміксів', quiz: '🧩 Тести до коміксів', level: '🏆 Тести рівня' } },
    en: { title: '🎯 My study plan', intro: 'Switch off what you already know — the plan and checklist get shorter.', groups: 'What the plan includes', show_steps: n => `Choose single steps (${n})`, hidden: n => `Hidden steps: ${n}`, reset: '↺ Show everything', know: '✓ I know', know_t: 'I already know this — remove from the plan', setup: '⚙️ Set up the plan', open: 'Open the plan →',
      g: { basics: '🔤 Alphabet & numbers', words: '📝 Words by topic', grammar: '📐 Grammar', clock: '🕐 Telling time', read: '📖 Reading comics', quiz: '🧩 Comic tests', level: '🏆 Level tests' } },
    ar: { title: '🎯 خطة تعلّمي', intro: 'أوقف ما تعرفه بالفعل — تصبح الخطة وقائمة الاختبارات أقصر.', groups: 'ما تتضمّنه الخطة', show_steps: n => `اختر خطوات منفردة (${n})`, hidden: n => `خطوات مخفية: ${n}`, reset: '↺ أظهر كل شيء', know: '✓ أعرفها', know_t: 'أعرف هذا — أزله من الخطة', setup: '⚙️ اضبط الخطة', open: 'افتح الخطة ←',
      g: { basics: '🔤 الحروف والأرقام', words: '📝 الكلمات حسب المواضيع', grammar: '📐 القواعد', clock: '🕐 الساعة', read: '📖 قراءة القصص', quiz: '🧩 اختبارات القصص', level: '🏆 اختبارات المستوى' } },
    no: { title: '🎯 Min læringsplan', intro: 'Slå av det du allerede kan – planen og sjekklisten blir kortere.', groups: 'Hva planen inneholder', show_steps: n => `Velg enkelttrinn (${n})`, hidden: n => `Skjulte trinn: ${n}`, reset: '↺ Vis alt igjen', know: '✓ Kan det', know_t: 'Jeg kan dette – fjern fra planen', setup: '⚙️ Tilpass planen', open: 'Åpne planen →',
      g: { basics: '🔤 Alfabet og tall', words: '📝 Ord etter tema', grammar: '📐 Grammatikk', clock: '🕐 Klokka', read: '📖 Lese tegneserier', quiz: '🧩 Tegneserietester', level: '🏆 Nivåtester' } }
  };
  if (window.KL_T_FILL) KL_T_FILL(PS, 'app.js:PS');
  const ps = (k, ...a) => { const T = PS[ui] || PS.en; const v = k in T ? T[k] : PS.en[k]; return typeof v === 'function' ? v(...a) : v; };
  const planOff = () => store.get('planOff', {}) || {};
  const planKnown = () => store.get('planKnown', []) || [];
  function knowStep(id, on = true) { const k = new Set(planKnown()); if (on) k.add(id); else k.delete(id); store.set('planKnown', [...k]); }
  function planSteps(p, opts = {}) {
    const all = planStepsAll(p);
    if (opts.all) return all;
    const off = planOff(), known = new Set(planKnown());
    return all.filter(s => !off[s.grp] && !known.has(s.href));
  }
  function planStepsAll(p) {
    const lv = B.levels, from = p.from === 'zero' ? 0 : lv.indexOf(p.from), to = Math.max(from, lv.indexOf(p.goal));
    const steps = [];
    if (p.from === 'zero' || p.from === 'A1') {
      steps.push({ grp: 'basics', label: t('step_alpha'), href: '#/alphabet', done: !!store.get('alphaVisited', false) });
      steps.push({ grp: 'basics', label: t('step_alpha_test'), href: '#/quiz/alphabet', done: bestStars('alphabet') > 0 });
      steps.push({ grp: 'basics', label: t('step_numbers'), href: '#/numbers', done: !!store.get('numbersVisited', false) });
      steps.push({ grp: 'basics', label: t('step_numbers_test'), href: '#/quiz/numbers', done: bestStars('numbers') > 0 });
    }
    for (let k = Math.max(0, from); k <= to; k++) {
      const Wd = window.KomiksWords;
      if (Wd) Wd.themes().filter(th => th.level === lv[k]).forEach(th => steps.push({ grp: 'words', label: Wd.text('step', Wd.name(th)), href: '#/words/' + th.id, done: bestStars('words:' + th.id) > 0, level: lv[k] }));
      const G = window.KomiksGrammar;
      if (G) G.topics().filter(tp => tp.level === lv[k]).forEach(tp => steps.push({ grp: 'grammar', label: G.text('step', ui === 'no' ? tp.no : tp[ui] || trText(tp.en, tp.uk, ui)), href: '#/grammar/' + tp.id, done: bestStars('grammar:' + tp.id) > 0, level: lv[k] }));
      if (G && k === 0) steps.push({ grp: 'clock', label: G.text('step', G.text('clock')[1]), href: '#/quiz/clock', done: bestStars('clock') > 0, level: lv[k] });
      const list = COMICS.filter(c => c.level === lv[k]);
      list.forEach(c => {
        steps.push({ grp: 'read', label: t('step_read', c.title), href: `#/read/${c.id}/0`, done: comicRead(c), level: lv[k] });
        steps.push({ grp: 'quiz', label: t('step_quiz', c.title), href: `#/quiz/${c.id}`, done: comicDone(c), level: lv[k] });
      });
      if (list.length) steps.push({ grp: 'level', label: t('step_level_test', lv[k]), href: `#/quiz/level/${lv[k]}`, done: bestStars('level:' + lv[k]) > 0, level: lv[k] });
    }
    return steps;
  }
  /* ---------- чек-лист пройдених тестів: один рядок на тест, найкращий результат, спроби, «Ще раз» ---------- */
  const CHK = {
    uk: { tests: 'тестів пройдено', tries: 'спроб усього', avg: 'середній результат', perfect: 'на 3 зірки', all: 'Усі', redo: '🔁 Треба повторити', good: '🌟 Відмінно', best: 'найкраще', last: 'востаннє', attempts: n => `спроб: ${n}`, today: 'сьогодні', yesterday: 'вчора', improve: '🔁 Покращити', again: '▶ Ще раз', place: (p, n) => `найкраще місце ${p} з ${n}`, legend: '⭐⭐⭐ — від 90 % · ⭐⭐ — від 60 % · ⭐ — від 30 %', none: 'Тут поки порожньо — чудово!', more: n => `Показати ще ${n}`,
      math: { mul: '✖️ Множення', add: '➕ Додавання й віднімання', div: '➗ Ділення', all: '🧮 Уся математика', row: n => `✖️ Таблиця множення на ${n}` }, race: '🏁 Логік-гонка', rocket: '🚀 Math Rocket', lv: { easy: '🟢 Легко', medium: '🟡 Середньо', hard: '🔴 Складно', expert: '🟣 Експерт' } },
    en: { tests: 'tests completed', tries: 'attempts', avg: 'average score', perfect: 'with 3 stars', all: 'All', redo: '🔁 Needs practice', good: '🌟 Excellent', best: 'best', last: 'last', attempts: n => `attempts: ${n}`, today: 'today', yesterday: 'yesterday', improve: '🔁 Improve', again: '▶ Again', place: (p, n) => `best place ${p} of ${n}`, legend: '⭐⭐⭐ — 90 %+ · ⭐⭐ — 60 %+ · ⭐ — 30 %+', none: 'Nothing here — great job!', more: n => `Show ${n} more`,
      math: { mul: '✖️ Multiplication', add: '➕ Addition & subtraction', div: '➗ Division', all: '🧮 All maths', row: n => `✖️ Times table of ${n}` }, race: '🏁 Logic Race', rocket: '🚀 Math Rocket', lv: { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard', expert: '🟣 Expert' } },
    no: { tests: 'tester fullført', tries: 'forsøk totalt', avg: 'gjennomsnitt', perfect: 'med 3 stjerner', all: 'Alle', redo: '🔁 Må øves mer', good: '🌟 Utmerket', best: 'beste', last: 'sist', attempts: n => `forsøk: ${n}`, today: 'i dag', yesterday: 'i går', improve: '🔁 Forbedre', again: '▶ Igjen', place: (p, n) => `beste plass ${p} av ${n}`, legend: '⭐⭐⭐ — fra 90 % · ⭐⭐ — fra 60 % · ⭐ — fra 30 %', none: 'Ingenting her – bra jobba!', more: n => `Vis ${n} til`,
      math: { mul: '✖️ Ganging', add: '➕ Pluss og minus', div: '➗ Deling', all: '🧮 All matte', row: n => `✖️ ${n}-gangen` }, race: '🏁 Logikkløpet', rocket: '🚀 Matte-raketten', lv: { easy: '🟢 Lett', medium: '🟡 Middels', hard: '🔴 Vanskelig', expert: '🟣 Ekspert' } }
  };
  if (window.KL_T_FILL) KL_T_FILL(CHK, 'app.js:CHK');
  CHK.ar = { tests: 'اختبارات منجزة', tries: 'محاولات', avg: 'متوسط النتيجة', perfect: 'بثلاث نجوم', all: 'الكل', redo: '🔁 تحتاج تدريبًا', good: '🌟 ممتاز', best: 'الأفضل', last: 'آخر مرة', attempts: n => `المحاولات: ${n}`, today: 'اليوم', yesterday: 'أمس', improve: '🔁 حسّن', again: '▶ مجددًا', place: (p, n) => `أفضل مركز ${p} من ${n}`, legend: '⭐⭐⭐ — من 90٪ · ⭐⭐ — من 60٪ · ⭐ — من 30٪', none: 'لا شيء هنا — أحسنت!', more: n => `اعرض ${n} أخرى`,
    math: { mul: '✖️ الضرب', add: '➕ الجمع والطرح', div: '➗ القسمة', all: '🧮 كل الرياضيات', row: n => `✖️ جدول ضرب ${n}` }, race: '🏁 سباق المنطق', rocket: '🚀 Math Rocket', lv: { easy: '🟢 سهل', medium: '🟡 متوسط', hard: '🔴 صعب', expert: '🟣 خبير' } };
  // куди веде «Ще раз» для кожного типу тесту
  function quizHref(key) {
    const [kind, arg] = key.split(':');
    if (kind === 'level') return `#/quiz/level/${arg}`;
    if (kind === 'grammar') return arg ? `#/quiz/grammar/${arg}` : '#/quiz/grammar';
    if (kind === 'words') return arg ? `#/quiz/words/${arg}` : '#/quiz/words';
    if (kind === 'en') return `#/quiz/en/${arg}`;
    if (kind === 'enw') return arg && arg !== 'all' ? `#/quiz/en-words/${arg}` : '#/quiz/en-words';
    if (kind === 'math') return arg && arg.startsWith('row') ? `#/quiz/math/${arg}` : `#/quiz/math/${arg || 'mul'}/${{ mul: 10, div: 10 }[arg] || 20}`;
    if (kind === 'rocket') return '#/math/rocket';
    if (kind === 'race') return '#/race/bots';
    if (kind === 'chess') return '#/chess';
    return `#/quiz/${key}`;
  }
  function quizTitle(key, title) {
    const T = CHK[ui] || CHK.en || CHK.uk, [kind, arg] = key.split(':');
    if (kind === 'math') return arg && arg.startsWith('row') ? T.math.row(arg.slice(3)) : (T.math[arg] || title);
    if (kind === 'race') return T.race + (T.lv[arg] ? ' · ' + T.lv[arg] : '');
    if (kind === 'rocket') return T.rocket;
    if (kind === 'game') return '🎮 ' + String(title || arg).replace(/^🎮\s*/, '');
    const c = COMICS.find(x => x.id === key);
    return c ? `📖 ${c.title}` : String(title || key);
  }
  function checklistView(log) {
    const T = CHK[ui] || CHK.en || CHK.uk;
    const map = new Map();
    for (const e of log) { // журнал іде від нових до старих
      const r = map.get(e.key) || { key: e.key, title: quizTitle(e.key, e.title), tries: 0, bestPct: 0, bestStars: 0, bestScore: '', last: e.date, lastPct: e.total ? Math.round(e.score / e.total * 100) : 0 };
      const pct = e.total ? Math.round(e.score / e.total * 100) : 0;
      r.tries++;
      if (pct > r.bestPct || !r.bestScore) { r.bestPct = pct; r.bestScore = `${e.score}/${e.total}`; }
      r.bestStars = Math.max(r.bestStars, e.stars || 0);
      if (e.place && (!r.bestPlace || e.place < r.bestPlace)) { r.bestPlace = e.place; r.bestOf = e.of; }
      map.set(e.key, r);
    }
    const rows = [...map.values()];
    const avg = rows.length ? Math.round(rows.reduce((n, r) => n + r.bestPct, 0) / rows.length) : 0;
    const when = d => { const day = String(d).slice(0, 10), now = new Date(); const iso = x => x.toISOString().slice(0, 10); const y = new Date(now); y.setDate(y.getDate() - 1); return day === iso(now) ? T.today : day === iso(y) ? T.yesterday : fmtDate(d); };
    const box = h('div', { class: 'chk' });
    let filter = 'all', limit = 12;
    const draw = () => {
      const list = rows.filter(r => filter === 'all' || (filter === 'redo' ? r.bestPct < 60 : r.bestStars >= 3));
      const tile = (n, label, cls) => h('div', { class: 'chk-sum ' + (cls || '') }, h('b', {}, n), h('small', {}, label));
      box.replaceChildren(
        h('div', { class: 'chk-summary' }, tile(rows.length, T.tests), tile(log.length, T.tries), tile(avg + ' %', T.avg, avg >= 90 ? 'good' : avg >= 60 ? 'ok' : 'low'), tile(rows.filter(r => r.bestStars >= 3).length, T.perfect)),
        h('div', { class: 'chk-tabs' }, [['all', T.all], ['redo', T.redo], ['good', T.good]].map(([v, label]) => h('button', { type: 'button', class: 'chk-tab' + (filter === v ? ' on' : ''), onclick: () => { filter = v; limit = 12; draw(); } },
          label, ' ', h('i', {}, v === 'all' ? rows.length : v === 'redo' ? rows.filter(r => r.bestPct < 60).length : rows.filter(r => r.bestStars >= 3).length)))),
        list.length ? h('div', { class: 'chk-list' }, list.slice(0, limit).map(r => {
          const [ic, col] = window.KomiksIcons ? window.KomiksIcons.forKey(r.key) : ['star', '#546e7a'];
          const lvl = r.bestPct >= 90 ? 'good' : r.bestPct >= 60 ? 'ok' : 'low';
          return h('div', { class: 'chk-row ' + lvl },
            window.KomiksIcons ? window.KomiksIcons.badge(ic, col, 22) : null,
            h('div', { class: 'chk-main' },
              h('b', { class: 'chk-title' }, r.title),
              h('div', { class: 'chk-bar' }, h('i', { style: { width: Math.max(4, r.bestPct) + '%' } }), h('span', {}, `${r.bestPct} % · ${r.bestScore}`)),
              h('small', {}, `${T.attempts(r.tries)} · ${T.last}: ${when(r.last)}` + (r.bestPlace ? ` · 🏆 ${T.place(r.bestPlace, r.bestOf)}` : ''))),
            h('span', { class: 'chk-stars', title: T.legend }, '⭐'.repeat(r.bestStars) + '☆'.repeat(3 - r.bestStars)),
            h('a', { class: 'btn small ' + (r.bestPct >= 90 ? '' : 'accent'), href: quizHref(r.key) }, r.bestPct >= 90 ? T.again : T.improve));
        })) : h('p', { class: 'fr-none' }, T.none),
        list.length > limit ? h('button', { class: 'btn', type: 'button', onclick: () => { limit += 12; draw(); } }, T.more(list.length - limit)) : null,
        h('p', { class: 'hint' }, T.legend));
    };
    draw();
    return box;
  }
  /* ---------- 🔒 Строгий режим (батьківський) ----------
     Коли ввімкнено, учень може відкрити лише поточний крок плану (і те, що вже пройшов).
     Решта розділів закрита, а вимкнути режим або змінити налаштування можна лише паролем
     дорослого. Пароль зберігається як хеш — ми його не бачимо. Дорослий може відкрити доступ
     на 30 хвилин, не вимикаючи режим (кнопка «Я дорослий»). */
  const ST = {
    uk: { title: '🔒 Строгий режим', d: 'Учень іде планом крок за кроком: наступні теми відкриваються лише після поточної. Вимкнути режим можна лише батьківським паролем.',
      on: 'Увімкнути', off: 'Вимкнути', pw: 'Батьківський пароль', pw2: 'Повторіть пароль', pw_short: 'Пароль — щонайменше 4 символи.', pw_diff: 'Паролі не збігаються.', pw_wrong: 'Неправильний пароль.',
      locked_t: '🔒 Спершу поточний крок', locked_d: 'Увімкнено строгий режим: іди планом по черзі. Ось твій крок:', go: 'Перейти до кроку', plan: '🎯 Мій план',
      parent: '👤 Я дорослий', parent_d: 'Відкрити доступ на 30 хвилин', open: '🔓 Доступ відкрито на 30 хвилин', ok: 'Готово', cancel: 'Скасувати',
      on_note: '🔒 Строгий режим увімкнено', off_note: 'Строгий режим вимкнено' },
    en: { title: '🔒 Strict mode', d: 'The learner follows the plan step by step: the next topics open only after the current one. Only the parent password switches it off.',
      on: 'Turn on', off: 'Turn off', pw: 'Parent password', pw2: 'Repeat the password', pw_short: 'The password needs at least 4 characters.', pw_diff: 'The passwords do not match.', pw_wrong: 'Wrong password.',
      locked_t: '🔒 Finish the current step first', locked_d: 'Strict mode is on: follow the plan in order. Here is your step:', go: 'Go to the step', plan: '🎯 My plan',
      parent: '👤 I am the adult', parent_d: 'Open everything for 30 minutes', open: '🔓 Everything is open for 30 minutes', ok: 'Done', cancel: 'Cancel',
      on_note: '🔒 Strict mode is on', off_note: 'Strict mode is off' },
    no: { title: '🔒 Streng modus', d: 'Eleven følger planen steg for steg: neste tema åpnes først når det forrige er gjort. Bare foreldrepassordet slår det av.',
      on: 'Slå på', off: 'Slå av', pw: 'Foreldrepassord', pw2: 'Gjenta passordet', pw_short: 'Passordet må ha minst fire tegn.', pw_diff: 'Passordene er ikke like.', pw_wrong: 'Feil passord.',
      locked_t: '🔒 Gjør dagens steg først', locked_d: 'Streng modus er på: følg planen i rekkefølge. Her er steget ditt:', go: 'Gå til steget', plan: '🎯 Planen min',
      parent: '👤 Jeg er voksen', parent_d: 'Åpne alt i 30 minutter', open: '🔓 Alt er åpent i 30 minutter', ok: 'Ferdig', cancel: 'Avbryt',
      on_note: '🔒 Streng modus er på', off_note: 'Streng modus er av' },
    ar: { title: '🔒 الوضع الصارم', d: 'يسير المتعلّم في الخطة خطوة بخطوة: لا تُفتح المواضيع التالية إلا بعد الحالية. لا يُوقفه إلا كلمة مرور الوالدين.',
      on: 'تشغيل', off: 'إيقاف', pw: 'كلمة مرور الوالدين', pw2: 'أعد كلمة المرور', pw_short: 'كلمة المرور من 4 أحرف على الأقل.', pw_diff: 'كلمتا المرور غير متطابقتين.', pw_wrong: 'كلمة المرور غير صحيحة.',
      locked_t: '🔒 أنهِ الخطوة الحالية أولًا', locked_d: 'الوضع الصارم مفعّل: اتبع الخطة بالترتيب. هذه خطوتك:', go: 'اذهب إلى الخطوة', plan: '🎯 خطتي',
      parent: '👤 أنا الوالد', parent_d: 'افتح كل شيء لمدة 30 دقيقة', open: '🔓 كل شيء مفتوح لمدة 30 دقيقة', ok: 'تم', cancel: 'إلغاء',
      on_note: '🔒 الوضع الصارم مفعّل', off_note: 'الوضع الصارم متوقف' }
  };
  if (window.KL_T_FILL) KL_T_FILL(ST, 'app.js:ST');
  const st = k => (ST[ui] || ST.en)[k];
  const strictOn = () => settings.strict === true && !!settings.parentHash;
  const parentOpen = () => (store.get('parentUntil', 0) || 0) > Date.now();
  // що дозволено завжди: план, кабінет, довідка, умови, налаштування, аналіз, слова-картки
  const STRICT_FREE = new Set(['', 'plan', 'account', 'player', 'help', 'terms', 'settings', 'analysis', 'whatsnew',
    'login', 'register', 'verify', 'reset', 'welcome', 'premium', 'teacher', 'privacy', 'sitemap', 'install', 'today', 'write', 'exam', 'placement', 'alerts', 'pairs', 'cross']);
  function strictStep() {
    const p = Object.assign({ from: 'zero', goal: 'A2', pace: 'normal' }, store.get('plan', {}));
    const steps = planSteps(p);
    return steps.find(x => !x.done) || null;
  }
  // чи можна відкрити цей маршрут
  function strictAllows(hash) {
    if (!strictOn() || parentOpen()) return true;
    const view = (hash || '#/').split('/')[1] || '';
    if (STRICT_FREE.has(view)) return true;
    const next = strictStep();
    if (!next) return true;                       // план пройдено — усе відкрито
    const base = h => (h || '').split('?')[0].replace(/\/$/, '');
    if (base(hash).startsWith(base(next.href))) return true;
    // уже пройдені кроки лишаються відкритими для повторення
    const p = Object.assign({ from: 'zero', goal: 'A2', pace: 'normal' }, store.get('plan', {}));
    return planSteps(p, { all: true }).some(x => x.done && base(hash).startsWith(base(x.href)));
  }
  function strictLock() {
    const next = strictStep();
    return h('section', { class: 'strict-lock' },
      h('div', { class: 'box' }, h('h2', {}, st('locked_t')), h('p', {}, st('locked_d')),
        next ? h('a', { class: 'btn accent big', href: next.href }, st('go'), ' ', h('small', {}, next.label)) : null,
        h('div', { class: 'row-left' }, h('a', { class: 'btn', href: '#/plan' }, st('plan')),
          h('button', { class: 'btn', type: 'button', onclick: () => parentAsk() }, st('parent')))));
  }
  // вікно з паролем дорослого: on = відкрити доступ, off = вимкнути режим
  function parentAsk(mode = 'open') {
    const inp = h('input', { type: 'password', autocomplete: 'off', placeholder: st('pw') });
    const msg = h('p', { class: 'fb-msg' });
    const done = async () => {
      const hash = await hashPass(inp.value, 'sha256');
      const ok = hash === settings.parentHash || (await hashPass(inp.value, 'fnv')) === settings.parentHash;
      if (!ok) { msg.textContent = st('pw_wrong'); return; }
      if (mode === 'off') { settings.strict = false; saveSettings(); }
      else store.set('parentUntil', Date.now() + 30 * 60 * 1000);
      back.remove();
      praise(mode === 'off' ? st('off_note') : st('open'));
      route();
    };
    const box = h('div', { class: 'fb-box' }, h('h2', {}, st('parent')), h('p', { class: 'hint' }, mode === 'off' ? st('d') : st('parent_d')),
      inp, msg, h('div', { class: 'row-left' }, h('button', { class: 'btn accent', type: 'button', onclick: done }, st('ok')),
        h('button', { class: 'btn', type: 'button', onclick: () => back.remove() }, st('cancel'))));
    const back = h('div', { class: 'fb-back', onclick: e => { if (e.target === back) back.remove(); } }, box);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); done(); } });
    document.body.append(back);
    setTimeout(() => inp.focus(), 60);
  }
  // вмикання: просимо новий пароль двічі
  function strictEnable() {
    const a = h('input', { type: 'password', autocomplete: 'new-password', placeholder: st('pw') });
    const b = h('input', { type: 'password', autocomplete: 'new-password', placeholder: st('pw2') });
    const msg = h('p', { class: 'fb-msg' });
    const save = async () => {
      if ((a.value || '').length < 4) { msg.textContent = st('pw_short'); return; }
      if (a.value !== b.value) { msg.textContent = st('pw_diff'); return; }
      settings.parentHash = await hashPass(a.value, 'sha256');
      settings.strict = true;
      saveSettings();
      store.set('parentUntil', 0);
      back.remove();
      praise(st('on_note'));
      route();
    };
    const box = h('div', { class: 'fb-box' }, h('h2', {}, st('title')), h('p', { class: 'hint' }, st('d')), a, b, msg,
      h('div', { class: 'row-left' }, h('button', { class: 'btn accent', type: 'button', onclick: save }, st('on')),
        h('button', { class: 'btn', type: 'button', onclick: () => back.remove() }, st('cancel'))));
    const back = h('div', { class: 'fb-back', onclick: e => { if (e.target === back) back.remove(); } }, box);
    document.body.append(back);
    setTimeout(() => a.focus(), 60);
  }

  /* ---------- 📅 «Сьогодні»: три справи на 10 хвилин ---------- */
  const TD = {
    uk: { title: '📅 Сьогодні', nav: 'Сьогодні',
      lead: 'Коротке заняття на сьогодні: повторити слова, зробити наступний крок плану й попрацювати над помилками. Десять хвилин щодня дають більше, ніж година раз на тиждень.',
      cards: '🃏 Повторити слова', cards_d: n => `${n} слів у сьогоднішній порції`, cards_none: 'Усе повторено — нових слів не назбиралося',
      step: '▶️ Наступний крок', step_none: 'План пройдено — обери новий рівень у плані', step_go: 'Відкрити',
      mist: '🔁 Робота над помилками', mist_d: n => `${n} слів, де ти помилявся`, mist_none: 'Помилок немає — чисто!',
      done: 'Готово ✓', left: n => `лишилось справ: ${n}`, all_done: '🎉 Сьогодні все зроблено! Повертайся завтра.',
      streak: n => `🔥 Серія: ${n} ${n === 1 ? 'день' : n < 5 ? 'дні' : 'днів'}`, streak0: '🔥 Почни серію сьогодні',
      extra: 'Хочеш більше?', call: '📞 Подзвонити персонажу', write: '✍️ Написати норвезькою', plan: '🎯 Увесь план',
      done_t: '🎉 План пройдено!', done_d: 'Усі кроки закрито. Можна взяти наступний рівень — план збереться заново, а пройдене лишиться позначеним.',
      done_next: l => `▶️ Наступний рівень: ${l}`, done_new: '⚙️ Скласти новий план', done_top: 'Ти пройшов усі рівні до B2. Склади власний план — або повтори те, що хочеш закріпити.',
      done_ok: l => `Готово! Новий план: до рівня ${l}.`,
      more_t: '➕ Додаткове завдання', more_d: 'Денну порцію закрито — але можна взяти ще одне. Вибери, що хочеться.',
      more_new: '🎲 Інше завдання', more_done: n => `Сьогодні зроблено додаткових: ${n}` },
    en: { title: '📅 Today', nav: 'Today',
      lead: 'A short session for today: review words, take the next step of your plan and work on your mistakes. Ten minutes a day beats an hour once a week.',
      cards: '🃏 Review words', cards_d: n => `${n} words in today’s batch`, cards_none: 'All reviewed — nothing is due',
      step: '▶️ Next step', step_none: 'Plan finished — pick a new level in the plan', step_go: 'Open',
      mist: '🔁 Work on mistakes', mist_d: n => `${n} words you got wrong`, mist_none: 'No mistakes — clean!',
      done: 'Done ✓', left: n => `still to do: ${n}`, all_done: '🎉 Everything is done for today. See you tomorrow!',
      streak: n => `🔥 Streak: ${n} ${n === 1 ? 'day' : 'days'}`, streak0: '🔥 Start your streak today',
      extra: 'Want more?', call: '📞 Call a character', write: '✍️ Write in Norwegian', plan: '🎯 The whole plan',
      done_t: '🎉 Plan finished!', done_d: 'Every step is ticked off. Take the next level — the plan is rebuilt, and what you have done stays marked.',
      done_next: l => `▶️ Next level: ${l}`, done_new: '⚙️ Build a new plan', done_top: 'You have finished every level up to B2. Build your own plan — or repeat what you want to lock in.',
      done_ok: l => `Done! New plan: up to level ${l}.`,
      more_t: '➕ An extra task', more_d: 'The daily set is finished — but you can take one more. Pick what you feel like.',
      more_new: '🎲 Another task', more_done: n => `Extra tasks today: ${n}` },
    no: { title: '📅 I dag', nav: 'I dag',
      lead: 'En kort økt for i dag: repeter ord, ta neste steg i planen og jobb med feilene dine. Ti minutter hver dag gir mer enn en time én gang i uka.',
      cards: '🃏 Repeter ord', cards_d: n => `${n} ord i dagens bolk`, cards_none: 'Alt er repetert – ingenting står for tur',
      step: '▶️ Neste steg', step_none: 'Planen er ferdig – velg et nytt nivå i planen', step_go: 'Åpne',
      mist: '🔁 Jobb med feilene', mist_d: n => `${n} ord du svarte feil på`, mist_none: 'Ingen feil – blankt!',
      done: 'Ferdig ✓', left: n => `igjen å gjøre: ${n}`, all_done: '🎉 Alt er gjort i dag. Vi ses i morgen!',
      streak: n => `🔥 Rekke: ${n} ${n === 1 ? 'dag' : 'dager'}`, streak0: '🔥 Start rekka i dag',
      extra: 'Vil du ha mer?', call: '📞 Ring en figur', write: '✍️ Skriv på norsk', plan: '🎯 Hele planen',
      done_t: '🎉 Planen er ferdig!', done_d: 'Alle stegene er gjort. Ta neste nivå – planen bygges på nytt, og det du har gjort, forblir merket.',
      done_next: l => `▶️ Neste nivå: ${l}`, done_new: '⚙️ Lag en ny plan', done_top: 'Du har fullført alle nivåene opp til B2. Lag din egen plan – eller repeter det du vil sitte trygt på.',
      done_ok: l => `Ferdig! Ny plan: til nivå ${l}.`,
      more_t: '➕ En ekstra oppgave', more_d: 'Dagens økt er ferdig – men du kan ta én til. Velg det du har lyst på.',
      more_new: '🎲 En annen oppgave', more_done: n => `Ekstra oppgaver i dag: ${n}` },
    ar: { title: '📅 اليوم', nav: 'اليوم',
      lead: 'جلسة قصيرة لليوم: راجع الكلمات، وأنجز الخطوة التالية من خطتك، واشتغل على أخطائك. عشر دقائق يوميًا أفضل من ساعة أسبوعيًا.',
      cards: '🃏 راجع الكلمات', cards_d: n => `${n} كلمة في دفعة اليوم`, cards_none: 'تمت مراجعة كل شيء',
      step: '▶️ الخطوة التالية', step_none: 'انتهت الخطة — اختر مستوى جديدًا', step_go: 'افتح',
      mist: '🔁 اشتغل على الأخطاء', mist_d: n => `${n} كلمة أخطأت فيها`, mist_none: 'لا أخطاء — ممتاز!',
      done: 'تم ✓', left: n => `المتبقي: ${n}`, all_done: '🎉 أنجزت كل شيء اليوم. نراك غدًا!',
      streak: n => `🔥 التتابع: ${n} يوم`, streak0: '🔥 ابدأ تتابعك اليوم',
      extra: 'تريد المزيد؟', call: '📞 اتصل بشخصية', write: '✍️ اكتب بالنرويجية', plan: '🎯 الخطة كاملة',
      done_t: '🎉 اكتملت الخطة!', done_d: 'أنجزت كل الخطوات. خذ المستوى التالي — تُبنى الخطة من جديد ويبقى ما أنجزته مُعلَّمًا.',
      done_next: l => `▶️ المستوى التالي: ${l}`, done_new: '⚙️ أنشئ خطة جديدة', done_top: 'أنهيت كل المستويات حتى B2. أنشئ خطتك — أو كرّر ما تريد ترسيخه.',
      done_ok: l => `تم! خطة جديدة حتى المستوى ${l}.`,
      more_t: '➕ مهمة إضافية', more_d: 'انتهت حصة اليوم — لكن يمكنك أخذ مهمة أخرى. اختر ما يحلو لك.',
      more_new: '🎲 مهمة أخرى', more_done: n => `المهام الإضافية اليوم: ${n}` }
  };
  /* 📅 Нова «Сьогодні»: вітання, кільце прогресу дня, тиждень серії, слово дня (картка-перевертиш). */
  Object.assign(TD.uk, { hi: ['Доброї ночі', 'Доброго ранку', 'Доброго дня', 'Доброго вечора'], ring: (a, b) => `${a} з ${b}`, ring_l: 'справ на сьогодні', week: 'Цей тиждень',
    wod: '✨ Слово дня', wod_tap: 'Натисни на картку — побачиш переклад', wod_know: '✅ Знаю', wod_learn: '📌 Вчити', wod_known: 'Чудово! Слово позначено як вивчене.', wod_saved: 'Додано до сьогоднішнього повторення.',
    mins: n => `≈ ${n} хв`, party: '🎉 Денну норму виконано! Так тримати.', wd: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'] });
  Object.assign(TD.en, { hi: ['Good night', 'Good morning', 'Good afternoon', 'Good evening'], ring: (a, b) => `${a} of ${b}`, ring_l: 'tasks for today', week: 'This week',
    wod: '✨ Word of the day', wod_tap: 'Tap the card to see the translation', wod_know: '✅ I know it', wod_learn: '📌 Learn it', wod_known: 'Great! The word is marked as learned.', wod_saved: 'Added to today’s review.',
    mins: n => `≈ ${n} min`, party: '🎉 Daily goal done! Keep it up.', wd: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] });
  Object.assign(TD.no, { hi: ['God natt', 'God morgen', 'God dag', 'God kveld'], ring: (a, b) => `${a} av ${b}`, ring_l: 'oppgaver i dag', week: 'Denne uka',
    wod: '✨ Dagens ord', wod_tap: 'Trykk på kortet for å se oversettelsen', wod_know: '✅ Jeg kan det', wod_learn: '📌 Lær det', wod_known: 'Flott! Ordet er merket som lært.', wod_saved: 'Lagt til dagens repetisjon.',
    mins: n => `≈ ${n} min`, party: '🎉 Dagens mål er nådd! Fortsett sånn.', wd: ['Ma', 'Ti', 'On', 'To', 'Fr', 'Lø', 'Sø'] });
  Object.assign(TD.ar, { hi: ['تصبح على خير', 'صباح الخير', 'نهارك سعيد', 'مساء الخير'], ring: (a, b) => `${a} من ${b}`, ring_l: 'مهام اليوم', week: 'هذا الأسبوع',
    wod: '✨ كلمة اليوم', wod_tap: 'اضغط على البطاقة لترى الترجمة', wod_know: '✅ أعرفها', wod_learn: '📌 أتعلّمها', wod_known: 'رائع! وُضعت الكلمة في «أعرف».', wod_saved: 'أُضيفت إلى مراجعة اليوم.',
    mins: n => `≈ ${n} د`, party: '🎉 أنجزت هدف اليوم! استمر.', wd: ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'] });
  if (window.KL_T_FILL) KL_T_FILL(TD, 'app.js:TD');
  const td = k => (TD[ui] || TD.en)[k];
  function dueCards() {
    const st = store.get('cards', {}), wkDue = knownFromWords();
    return allVocab().filter(v => !isLearned(v, st, wkDue) && (!st[v.key] || st[v.key].due <= Date.now())).length;
  }
  /* Коли всі кроки закрито, план більше не має що показувати — пропонуємо наступний рівень. */
  function nextPlanBox() {
    const LV = ['A1', 'A2', 'B1', 'B2'];
    const p = Object.assign({ from: 'zero', goal: 'A2', pace: 'normal' }, store.get('plan', {}));
    const up = LV[LV.indexOf(p.goal) + 1] || null;
    const msg = h('p', { class: 'day-ok' });
    const go = up ? h('button', { class: 'btn accent big', type: 'button', onclick: () => {
      const cur = Object.assign({ from: 'zero', goal: 'A2', pace: 'normal' }, store.get('plan', {}));
      cur.from = cur.goal; cur.goal = up;
      store.set('plan', cur);
      msg.textContent = td('done_ok')(up);
      Sfx.good(); confetti();
      setTimeout(() => { location.hash = '#/plan'; }, 900);
    } }, td('done_next')(up)) : null;
    return h('div', { class: 'box plan-next' }, h('h3', {}, td('done_t')),
      h('p', {}, up ? td('done_d') : td('done_top')), msg,
      h('div', { class: 'row-left' }, go, h('a', { class: 'btn', href: '#/plan/settings' }, td('done_new')),
        h('a', { class: 'btn', href: '#/exam' }, window.KomiksExam ? window.KomiksExam.text('nav') : '🏁')));
  }

  /* Коли три справи закрито, пропонуємо ще одну — випадкову, але завжди корисну.
     Кожне додаткове завдання рахуємо в журналі дня, щоб було видно, скільки зробив понад норму. */
  function bonusBox() {
    const log = dayLog();
    const pool = [];
    const c = pick(COMICS.filter(x => !comicDone(x)) .concat(COMICS).slice(0, 40));
    if (c) pool.push(['🧩', t('step_quiz', c.title), '#/quiz/' + c.id]);
    if (c) pool.push(['📖', t('step_read', c.title), `#/read/${c.id}/0`]);
    const Wd = window.KomiksWords;
    if (Wd) { const th = pick(Wd.themes()); if (th) pool.push(['📝', Wd.text('step', Wd.name(th)), '#/quiz/words/' + th.id]); }
    const G = window.KomiksGrammar;
    if (G) { const tp = pick(G.topics()); if (tp) pool.push(['📐', G.text('step', ui === 'no' ? tp.no : tp[ui] || trText(tp.en, tp.uk, ui)), '#/quiz/grammar/' + tp.id]); }
    pool.push(['🃏', td('cards'), '#/cards']);
    if (window.KomiksPairs) pool.push(['🧠', window.KomiksPairs.text('daily'), '#/pairs']);
    pool.push(['✍️', window.KomiksWrite ? window.KomiksWrite.text('nav') : '✍️', '#/write']);
    pool.push(['📞', td('call'), '#/call']);
    if (errList().length) pool.push(['🔁', td('mist'), '#/quiz/mistakes']);
    const box = h('div', { class: 'box bonus-box' });
    const draw = () => {
      const [icon, label, href] = pick(pool);
      box.replaceChildren(h('h3', {}, td('more_t')), h('p', {}, td('more_d')),
        h('a', { class: 'day-task bonus-one', href }, h('span', { class: 'day-ic' }, icon),
          h('div', {}, h('b', {}, label)), h('span', { class: 'day-go' }, '→')),
        h('div', { class: 'row-left' }, h('button', { class: 'btn small', type: 'button', onclick: draw }, td('more_new')),
          log.bonus ? h('span', { class: 'day-left' }, td('more_done')(log.bonus)) : null));
    };
    draw();
    return box;
  }

  // ✨ слово дня: одне на день (за датою), з тих, що ще не вивчені
  function wordOfDay() {
    const st = store.get('cards', {}), wk = knownFromWords();
    const pool = allVocab().filter(v => v && v.no && !isLearned(v, st, wk));
    if (!pool.length) return null;
    const d = isoDay(new Date());
    let x = 0; for (const ch of d) x = (x * 31 + ch.charCodeAt(0)) >>> 0;
    const v = pool[x % pool.length];
    const tr = ui === 'uk' ? v.uk || v.en : ui === 'no' ? v.uk || v.en : v.en || v.uk;
    const msg = h('p', { class: 'wod-msg', 'aria-live': 'polite' });
    const card = h('button', { class: 'wod-card', type: 'button', 'aria-label': td('wod_tap') },
      h('span', { class: 'wod-face wod-front' }, h('b', {}, v.no), h('small', {}, td('wod_tap'))),
      h('span', { class: 'wod-face wod-back' }, h('b', {}, tr || '—'), v.en && v.en !== tr ? h('small', {}, v.en) : null));
    card.addEventListener('click', () => { card.classList.toggle('flip'); if (card.classList.contains('flip')) Speech.speak(v.no, 'narrator'); });
    const know = h('button', { class: 'btn small', type: 'button', onclick: () => { markLearned(v, store.get('cards', {})); msg.textContent = td('wod_known'); Sfx.good(); know.disabled = learn.disabled = true; } }, td('wod_know'));
    const learn = h('button', { class: 'btn small accent', type: 'button', onclick: () => {
      const s = store.get('cards', {}); s[v.key] = Object.assign(s[v.key] || { box: 0 }, { due: Date.now(), no: v.no, uk: v.uk, en: v.en }); store.set('cards', s);
      msg.textContent = td('wod_saved'); Sfx.tick(); know.disabled = learn.disabled = true; } }, td('wod_learn'));
    return h('div', { class: 'box wod' }, h('div', { class: 'wod-head' }, h('h3', {}, td('wod')), h('button', { class: 'btn small icon', type: 'button', title: '🔊', onclick: () => Speech.speak(v.no, 'narrator') }, '🔊')),
      card, h('div', { class: 'row-left' }, know, learn), msg);
  }
  function renderToday() {
    const log = dayLog();
    const P = window.KomiksPairs;
    const due = dueCards();
    const errs = errList().length;
    const p = Object.assign({ from: 'zero', goal: 'A2', pace: 'normal' }, store.get('plan', {}));
    const next = planSteps(p).find(x => !x.done) || null;
    const tasks = [
      { k: 'cards', icon: '🃏', min: 4, title: td('cards'), note: due ? td('cards_d')(Math.min(due, settings.level === 'kids' ? 10 : 20)) : td('cards_none'),
        href: '#/cards', done: log.cards > 0 || !due, skip: !due },
      { k: 'steps', icon: '▶️', min: 6, title: td('step'), note: next ? next.label : td('step_none'),
        href: next ? next.href : '#/plan', done: log.steps > 0 || !next, skip: !next },
      { k: 'mistakes', icon: '🔁', min: 3, title: td('mist'), note: errs ? td('mist_d')(errs) : td('mist_none'),
        href: '#/quiz/mistakes', done: log.mistakes > 0 || !errs, skip: !errs },
      ...(P ? [{ k: 'pairs', icon: '🧠', min: 3, title: P.text('daily'), note: P.text('daily_d')(settings.level === 'kids' ? 6 : 8),
        href: '#/pairs', done: log.pairs > 0 }] : [])
    ];
    const left = tasks.filter(x => !x.done).length, doneN = tasks.length - left;
    const st = streak();
    // кільце прогресу: заповнюється після появи на екрані
    const R = 46, CIRC = 2 * Math.PI * R;
    const arc = svgEl(`<svg viewBox="0 0 120 120" class="td-ring" aria-hidden="true"><circle cx="60" cy="60" r="${R}" class="td-ring-bg"/><circle cx="60" cy="60" r="${R}" class="td-ring-fg" stroke-dasharray="${CIRC.toFixed(1)}" stroke-dashoffset="${CIRC.toFixed(1)}" transform="rotate(-90 60 60)"/></svg>`);
    setTimeout(() => { const fg = arc.querySelector('.td-ring-fg'); if (fg) fg.style.strokeDashoffset = String(CIRC * (1 - doneN / Math.max(1, tasks.length))); }, 60);
    // тиждень: пн–нд, вогник — день з навчанням
    const days = new Set(store.get('days', []));
    const mon = new Date(); mon.setDate(mon.getDate() - ((mon.getDay() + 6) % 7));
    const todayIso = isoDay(new Date());
    const week = h('div', { class: 'td-week', 'aria-label': td('week') }, td('wd').map((label, i) => {
      const d = new Date(mon); d.setDate(mon.getDate() + i); const iso = isoDay(d);
      return h('span', { class: 'td-day' + (days.has(iso) ? ' on' : '') + (iso === todayIso ? ' today' : '') + (iso > todayIso ? ' fut' : '') }, h('i', {}, days.has(iso) ? '🔥' : iso > todayIso ? '' : '·'), h('small', {}, label));
    }));
    const u = currentUser();
    const hr = new Date().getHours();
    const hi = td('hi')[hr < 5 ? 0 : hr < 12 ? 1 : hr < 18 ? 2 : 3] + (u && u.name ? ', ' + u.name : '') + '!';
    let dateTxt = ''; try { dateTxt = new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()); } catch { /* ignore */ }
    const tile = x => h(x.done ? 'div' : 'a', Object.assign({ class: 'day-task td-task' + (x.done ? ' done' : '') }, x.done ? {} : { href: x.href }),
      h('span', { class: 'day-ic' }, x.done ? '✅' : x.icon),
      h('div', {}, h('b', {}, x.title), h('small', {}, x.note)),
      x.done ? h('span', { class: 'day-ok' }, td('done')) : h('span', { class: 'td-min' }, td('mins')(x.min), h('span', { class: 'day-go' }, '→')));
    // свято — один раз на день, коли все зроблено
    if (!left && store.get('todayParty', '') !== todayIso) { store.set('todayParty', todayIso); setTimeout(() => { confetti(); Sfx.win(); }, 400); }
    return h('section', { class: 'today-page' }, pageHead(td('title')),
      window.KomiksTodayFx ? window.KomiksTodayFx.scene({ tasks: tasks.map(x => ({ icon: x.icon, title: x.title, done: x.done, href: x.href })), streak: st }) : null,
      h('div', { class: 'td-hero' },
        h('div', { class: 'td-ring-wrap' }, arc, h('div', { class: 'td-ring-txt' }, h('b', {}, td('ring')(doneN, tasks.length)), h('small', {}, td('ring_l')))),
        h('div', { class: 'td-hello' }, h('h2', {}, hi), dateTxt ? h('p', { class: 'td-date' }, dateTxt) : null,
          h('p', { class: 'td-streak' }, st ? td('streak')(st) : td('streak0')), week,
          h('p', { class: 'td-left' + (left ? '' : ' all') }, left ? td('left')(left) : td('party')))),
      h('p', { class: 'lead-p' }, td('lead')),
      h('div', { class: 'td-grid' }, h('div', { class: 'day-tasks td-tasks' }, tasks.map(tile)), wordOfDay()),
      window.KomiksTodayFx ? window.KomiksTodayFx.quiz() : null,
      left ? null : bonusBox(),
      next ? null : nextPlanBox(),
      h('div', { class: 'box td-extra' }, h('h3', {}, td('extra')),
        h('div', { class: 'td-extra-grid' }, [['📞', td('call'), '#/call'], ['✍️', td('write'), '#/write'], ['🏁', window.KomiksExam ? window.KomiksExam.text('nav') : '🏁', '#/exam'], ['🎯', td('plan'), '#/plan'], ['📊', AN_T().title, '#/account/learn']]
          .map(([ic, label, href]) => h('a', { class: 'td-x', href }, h('span', {}, ic), h('b', {}, String(label).replace(/^\S+\s/, '')))))));
  }

  function renderPlan() {
    const p = Object.assign({ from: 'zero', goal: 'A2', pace: 'normal' }, store.get('plan', {}));
    const root = h('section', { class: 'plan' });
    const sel = (key, options) => { const s = h('select', {}, options.map(([v, label]) => h('option', { value: v, selected: p[key] === v }, label))); s.addEventListener('change', () => { p[key] = s.value; store.set('plan', p); root.replaceWith(renderPlan()); }); return s; };
    const steps = planSteps(p);
    const hiddenN = planSteps(p, { all: true }).length - steps.length;
    const per = { light: 3, normal: 5, intense: 8 }[p.pace] || 5;
    const done = steps.filter(s => s.done).length;
    const nextStep = steps.find(s => !s.done);
    const user = currentUser();
    const weeks = range(Math.ceil(steps.length / per)).map(w => steps.slice(w * per, (w + 1) * per));
    const log = store.get('quizlog', []);
    const upcoming = B.upcoming.filter(([lvl]) => B.levels.indexOf(lvl) <= B.levels.indexOf(p.goal));
    root.append(pageHead(t('plan_title')),
      !user ? h('div', { class: 'note-box' }, t('guest_note'), ' ', h('a', { class: 'btn small', href: '#/register' }, navT('register')), ' ', h('a', { class: 'btn small', href: '#/login' }, navT('login'))) : null,
      h('p', { class: 'lead-p' }, t('plan_intro')),
      h('div', { class: 'plan-form box' },
        h('label', {}, h('span', {}, t('plan_from')), sel('from', [['zero', t('beginner')], ...B.levels.map(l => [l, l])])),
        h('label', {}, h('span', {}, t('plan_goal')), sel('goal', B.levels.map(l => [l, l]))),
        h('label', {}, h('span', {}, t('plan_pace')), sel('pace', Object.entries(tx('pace'))))),
      h('div', { class: 'plan-progress' },
        h('div', { class: 'bar' }, h('i', { style: { width: (steps.length ? done / steps.length * 100 : 0) + '%' } })),
        h('b', {}, t('plan_progress', done, steps.length)),
        nextStep ? h('a', { class: 'btn accent', href: nextStep.href }, t('next_step'), ' ', h('small', {}, nextStep.label)) : h('b', { class: 'plan-done' }, t('plan_done'))),
      nextStep ? null : nextPlanBox(),
      // 🔥 активність за рік (як на GitHub), рівень, серії й посилання на детальний дашборд
      window.KomiksLearnDash && window.KomiksLearnDash.activity ? window.KomiksLearnDash.activity() : null,
      h('div', { class: 'plan-setup' }, hiddenN ? h('span', { class: 'hint' }, ps('hidden', hiddenN)) : null, h('a', { class: 'btn small', href: '#/plan/settings' }, ps('setup'))),
      h('div', { class: 'weeks' }, weeks.map((ws, w) => h('div', { class: 'week' + (ws.every(s => s.done) ? ' done' : '') },
        h('h3', {}, t('week', w + 1)),
        h('ul', { class: 'checklist' }, ws.map(s => h('li', { class: s.done ? 'done' : '' }, h('span', { class: 'cb' }, s.done ? '✔' : ''), h('a', { href: s.href }, s.label), s.level ? h('span', { class: 'lvl lvl-' + s.level }, s.level) : null,
          s.done ? null : h('button', { class: 'plan-know', type: 'button', title: ps('know_t'), onclick: () => { knowStep(s.href); root.replaceWith(renderPlan()); } }, ps('know')))))))),
      h('h3', { class: 'sec-sub' }, t('checklist_title')),
      log.length ? checklistView(log) : h('p', { class: 'hint' }, t('ch_empty')),
      upcoming.length ? h('div', {}, h('h3', { class: 'sec-sub' }, t('upcoming_title')),
        h('div', { class: 'upcoming' }, upcoming.map(([lvl, cat, no, uk, en]) => withTr(h('div', { class: 'up-item' }, h('span', { class: 'lvl lvl-' + lvl }, lvl), h('b', {}, no), h('small', {}, catLabel(cat))), both(uk, en))))) : null);
    return root;
  }

  // окрема сторінка #/plan/settings: налаштування плану навчання (і для гостей)
  function renderPlanSettings() {
    const PL_HINT = { uk: 'Не знаєш свій рівень? Пройди короткий тест — план почнеться там, де треба.',
      en: 'Not sure about your level? Take the short test — the plan will start where it should.',
      no: 'Usikker på nivået? Ta den korte testen – planen starter der den skal.',
      ar: 'لست متأكدًا من مستواك؟ اختبر نفسك بسرعة — وستبدأ الخطة من المكان الصحيح.' }[ui];
    return h('section', { class: 'plan-settings' }, pageHead(ps('title'), '#/plan'),
      h('p', { class: 'lead-p' }, ps('intro')),
      window.KomiksPlacement ? h('div', { class: 'box' }, h('p', {}, PL_HINT),
        h('a', { class: 'btn accent', href: '#/placement' }, window.KomiksPlacement.text('nav'))) : null,
      planSettingsBox());
  }
  // налаштування плану — розділи та окремі кроки, які вже знаєш
  function planSettingsBox() {
    const box = h('div', { class: 'box plan-cfg', id: 'plan-cfg' });
    const draw = () => {
      const p = Object.assign({ from: 'zero', goal: 'A2', pace: 'normal' }, store.get('plan', {}));
      const all = planSteps(p, { all: true }), off = planOff(), known = new Set(planKnown());
      const shown = all.filter(s => !off[s.grp] && !known.has(s.href));
      const sel = (key, options) => { const s = h('select', {}, options.map(([v, label]) => h('option', { value: v, selected: p[key] === v }, label))); s.addEventListener('change', () => { p[key] = s.value; store.set('plan', p); draw(); }); return s; };
      const grps = Object.keys(PS.en.g).filter(g => all.some(s => s.grp === g));
      const toggle = g => { const o = planOff(); if (o[g]) delete o[g]; else o[g] = true; store.set('planOff', o); draw(); };
      const open = box.querySelector('details.plan-steps') && box.querySelector('details.plan-steps').open;
      box.replaceChildren(h('h3', {}, ps('title')), h('p', { class: 'hint' }, ps('intro')),
        h('div', { class: 'plan-form' },
          h('label', {}, h('span', {}, t('plan_from')), sel('from', [['zero', t('beginner')], ...B.levels.map(l => [l, l])])),
          h('label', {}, h('span', {}, t('plan_goal')), sel('goal', B.levels.map(l => [l, l]))),
          h('label', {}, h('span', {}, t('plan_pace')), sel('pace', Object.entries(tx('pace'))))),
        h('b', { class: 'plan-cfg-sub' }, ps('groups')),
        h('div', { class: 'plan-grps' }, grps.map(g => h('label', { class: 'plan-grp' + (off[g] ? '' : ' on') }, h('input', { type: 'checkbox', checked: !off[g], onchange: () => toggle(g) }), h('span', {}, ps('g')[g]), h('i', {}, all.filter(s => s.grp === g).length)))),
        h('details', { class: 'plan-steps', open: !!open }, h('summary', {}, ps('show_steps', all.length)),
          grps.filter(g => !off[g]).map(g => h('div', { class: 'plan-steps-g' }, h('b', {}, ps('g')[g]),
            all.filter(s => s.grp === g).map(s => h('label', { class: 'plan-step' + (known.has(s.href) ? ' known' : '') }, h('input', { type: 'checkbox', checked: !known.has(s.href), onchange: e => { knowStep(s.href, !e.target.checked); draw(); } }), h('span', {}, s.label), s.level ? h('span', { class: 'lvl lvl-' + s.level }, s.level) : null))))),
        h('div', { class: 'row-left' }, h('b', { class: 'plan-count' }, t('plan_progress', shown.filter(s => s.done).length, shown.length)),
          (Object.keys(off).length || known.size) ? h('button', { class: 'btn small', type: 'button', onclick: () => { store.del('planOff'); store.del('planKnown'); draw(); } }, ps('reset')) : null,
          h('a', { class: 'btn small accent', href: '#/plan' }, ps('open'))));
    };
    draw();
    return box;
  }

  /* ================= акаунт ================= */
  function field(label, input) { return h('label', { class: 'field' }, h('span', {}, label), input); }
  function renderLogin() {
    const name = h('input', { type: 'text', autocomplete: 'username', required: true });
    const pass = h('input', { type: 'password', autocomplete: 'current-password', placeholder: '12345' });
    const err = h('p', { class: 'form-err', role: 'alert' });
    const form = h('form', { class: 'auth box' }, h('h2', {}, t('login_title')), field(t('f_login'), name), field(t('f_password'), pass), err,
      h('button', { class: 'btn accent big', type: 'submit' }, t('btn_login')),
      h('p', {}, t('no_account'), ' ', h('a', { href: '#/register' }, navT('register'))));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const q = name.value.trim().toLowerCase();
      const u = Object.values(users()).find(x => x.name.toLowerCase() === q || (x.email && x.email.toLowerCase() === q));
      if (!u || !(await checkPass(pass.value || '12345', u.pass))) { err.textContent = t('err_wrong'); return; }
      setSession(u.id); location.hash = '#/account'; route();
    });
    setTimeout(() => name.focus(), 50);
    return h('section', { class: 'auth-wrap' }, form);
  }
  function renderRegister() {
    const name = h('input', { type: 'text', autocomplete: 'nickname', required: true });
    const email = h('input', { type: 'email', autocomplete: 'email' });
    const pass = h('input', { type: 'password', autocomplete: 'new-password', placeholder: '12345' });
    const move = h('input', { type: 'checkbox', checked: true });
    const err = h('p', { class: 'form-err', role: 'alert' });
    const form = h('form', { class: 'auth box' }, h('h2', {}, t('register_title')), field(t('f_name'), name), field(t('f_email'), email), field(t('f_password'), pass),
      h('p', { class: 'hint' }, t('pass_default')), !session ? h('label', { class: 'check' }, move, t('move_guest')) : null, err,
      h('button', { class: 'btn accent big', type: 'submit' }, t('btn_register')),
      h('p', { class: 'hint' }, t('email_note')),
      h('p', {}, t('have_account'), ' ', h('a', { href: '#/login' }, navT('login'))));
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const n = name.value.trim(), em = email.value.trim();
      if (!n) { err.textContent = t('err_name'); return; }
      const all = users();
      if (Object.values(all).some(x => x.name.toLowerCase() === n.toLowerCase() || (em && x.email && x.email.toLowerCase() === em.toLowerCase()))) { err.textContent = t('err_exists'); return; }
      const id = 'u' + Date.now().toString(36);
      all[id] = { id, name: n, email: em, pass: await hashPass(pass.value || '12345'), created: today() };
      raw.set('comiks.users', all);
      if (!session && move.checked) copyGuestProgressTo(id);
      setSession(id);
      bump('registered', 0);
      location.hash = '#/account'; route();
      setTimeout(() => { Sfx.win(); confetti(); }, 100);
    });
    setTimeout(() => name.focus(), 50);
    return h('section', { class: 'auth-wrap' }, form);
  }
  const AUTH_VIEWS = ['login', 'register', 'verify-sent', 'welcome', 'verify-failed', 'forgot', 'reset', 'magic', 'login-pass'];
  const serverAuth = () => !!(window.KomiksAuth && window.KomiksAuth.server);
  const logoutAll = () => { if (serverAuth() && window.KomiksAuth.user) window.KomiksAuth.logout(); else { setSession(null); location.hash = '#/'; route(); } };
  function renderAccount(tab) {
    const u = currentUser();
    if (!u) return serverAuth() ? window.KomiksAuth.render('login') : renderLogin();
    return renderAccountBoxes(u, !!(u.server && serverAuth() && window.KomiksAuth.user), tab);
  }
  /* 👤 Кабінет = профіль гравця + досягнення + навчання + акаунт. Колишній #/player
     живе тут, вкладки — #/account/<profile|badges|learn|settings>. */
  const ACC_TABS = ['profile', 'badges', 'learn', 'settings'];
  function renderAccountBoxes(u, server, tab) {
    tab = ACC_TABS.includes(tab) ? tab : 'profile';
    const A = window.KomiksAvatars, P = window.KomiksProfile, KA = window.KomiksAuth, PL = window.KomiksPlayers;
    const au = server ? KA.user : null;
    const AT = { uk: { edit: '🎨 Аватар', code: 'Код друга', copied: 'Скопійовано ✓', privacy: '🔒 Конфіденційність', privacy_d: 'Хто бачить мене в пошуку та хто може писати.', msgs: '✉️ Повідомлення', alerts: '🔔 Оновлення', tabs: ['👤 Профіль', '🏅 Досягнення', '📊 Навчання', '🔐 Акаунт'], admin: '⚙️ Адмінпанель', inv: '🎟 Запросити друга' },
      en: { edit: '🎨 Avatar', code: 'Friend code', copied: 'Copied ✓', privacy: '🔒 Privacy', privacy_d: 'Who can find me in search and who can message me.', msgs: '✉️ Messages', alerts: '🔔 Updates', tabs: ['👤 Profile', '🏅 Achievements', '📊 Learning', '🔐 Account'], admin: '⚙️ Admin panel', inv: '🎟 Invite a friend' },
      no: { edit: '🎨 Avatar', code: 'Vennekode', copied: 'Kopiert ✓', privacy: '🔒 Personvern', privacy_d: 'Hvem finner meg i søket og hvem kan sende meldinger.', msgs: '✉️ Meldinger', alerts: '🔔 Nytt', tabs: ['👤 Profil', '🏅 Prestasjoner', '📊 Læring', '🔐 Konto'], admin: '⚙️ Adminpanel', inv: '🎟 Inviter en venn' },
      ar: { edit: '🎨 الشخصية', code: 'رمز الصديق', copied: 'تم النسخ ✓', privacy: '🔒 الخصوصية', privacy_d: 'من يجدني في البحث ومن يمكنه مراسلتي.', msgs: '✉️ الرسائل', alerts: '🔔 الجديد', tabs: ['👤 الملف', '🏅 الإنجازات', '📊 التعلّم', '🔐 الحساب'], admin: '⚙️ لوحة الإدارة', inv: '🎟 ادعُ صديقًا' } }[ui] || {};
    if (window.KL_T_FILL) KL_T_FILL(AT, 'app.js:AT');
    const parts = PL && PL.accountParts ? PL.accountParts() : null;
    const code = raw.get(`comiks.u.${u.id}.friendCode`, null);
    const codeChip = code ? h('button', { class: 'acc-code', type: 'button', title: AT.code, onclick: e => { try { navigator.clipboard.writeText(code); } catch { /* ignore */ } e.currentTarget.lastChild.textContent = AT.copied; } }, h('small', {}, AT.code), h('b', {}, code)) : null;
    const share = parts && window.KomiksExtras && window.KomiksExtras.shareButton ? window.KomiksExtras.shareButton(parts.shareUrl(), `${u.name} · Komiks·Lab`) : null;
    const hero = h('div', { class: 'box acc-hero' },
      h('a', { class: 'acc-ava', href: '#/avatar', 'aria-label': AT.edit }, P && A ? A.el(P.avatar(), { size: 132, mood: 'cheer' }) : h('span', { class: 'avatar-big' }, u.name.slice(0, 1).toUpperCase())),
      h('div', { class: 'acc-id' }, h('h2', {}, u.name, au && au.founder ? h('span', { class: 'pro-badge acc-pro', title: 'PRO' }, '🏅 PRO #' + au.founder) : null),
        parts && parts.since ? h('small', { class: 'acc-since' }, parts.since) : null, codeChip,
        h('div', { class: 'acc-actions' }, h('a', { class: 'btn small', href: '#/avatar' }, AT.edit),
          window.KomiksMessages && au ? h('a', { class: 'btn small', href: '#/messages' }, AT.msgs) : null, h('a', { class: 'btn small', href: '#/friends' }, '👥 ' + navT('friends')),
          window.KomiksAlerts && au ? h('a', { class: 'btn small', href: '#/alerts' }, AT.alerts) : null,
          h('a', { class: 'btn small', href: '#/settings' }, '⚙️ ' + navT('settings')), share)));
    const tabs = h('nav', { class: 'acc-tabs', role: 'tablist' }, ACC_TABS.map((k, i) => h('a', { class: 'acc-tab' + (k === tab ? ' on' : ''), role: 'tab', 'aria-selected': String(k === tab), href: '#/account/' + k }, ...(([ic, ...rest]) => [h('span', { class: 'acc-tab-ic' }, ic), h('span', {}, rest.join(' '))])(AT.tabs[i].split(' ')))));
    let body;
    if (tab === 'profile') {
      // 🎮 моє лобі: QR для друзів — сканують і одразу в кімнаті «Гри разом»
      const lobby = !OFFLINE && window.KomiksGame && window.KomiksGame.lobbyBox ? window.KomiksGame.lobbyBox() : null;
      // 🔥 календар активності за рік (як на GitHub) — першим у профілі
      const act = window.KomiksLearnDash && window.KomiksLearnDash.activity ? window.KomiksLearnDash.activity() : null;
      body = parts ? [act, lobby, h('div', { class: 'box acc-cells' }, parts.cells), parts.friends, h('div', { class: 'pl-cols' }, parts.recent, parts.wall()), parts.visibility]
        : [h('p', { class: 'muted' }, '…')];
    } else if (tab === 'badges') {
      body = [h('div', { class: 'box' }, parts ? parts.badges : PL.badgeGrid())];
    } else if (tab === 'learn' && window.KomiksLearnDash) {
      body = [window.KomiksEnglish ? learnSwitch() : null, window.KomiksLearnDash.render(), !OFFLINE && window.KomiksWatch ? window.KomiksWatch.shareBox() : null,
        h('div', { class: 'box plan-cfg-link' }, h('h3', {}, ps('title')), h('p', { class: 'hint' }, ps('intro')), h('a', { class: 'btn accent', href: '#/plan/settings' }, ps('setup'))),
        premiumBox(au)];
    } else if (tab === 'learn') {
      const read = COMICS.filter(comicRead).length;
      const tests = Object.values(store.get('progress', {})).filter(x => x.stars > 0).length;
      const words = Object.values(store.get('cards', {})).filter(x => x.box >= 3).length;
      const known = (store.get('wordsKnown', []) || []).length, knownEn = (store.get('wordsKnownEn', []) || []).length;
      body = [h('div', { class: 'box' }, h('h3', {}, t('my_stats')),
          h('div', { class: 'stat-grid' }, [[t('st_read'), `${read}/${COMICS.length}`], [t('st_tests'), tests], [t('st_known'), known], ['🇬🇧 ' + t('st_known'), knownEn], [t('st_words'), words], [t('st_streak'), streak()]].map(([k, v]) => h('div', { class: 'stat-cell' }, h('b', {}, v), h('small', {}, k)))),
          h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/plan' }, t('cta_plan')), h('a', { class: 'btn', href: '#/analysis' }, AN_T().title), h('a', { class: 'btn', href: '#/words' }, '📝 ' + navT('words')), h('a', { class: 'btn', href: '#/tests' }, '🧩 ' + navT('tests')))),
        h('div', { class: 'box plan-cfg-link' }, h('h3', {}, ps('title')), h('p', { class: 'hint' }, ps('intro')), h('a', { class: 'btn accent', href: '#/plan/settings' }, ps('setup'))),
        premiumBox(au)];
    } else if (server) {
      body = [KA.googleManage ? KA.googleManage() : null, KA.accountBox(),
        h('div', { class: 'box acc-priv' }, h('h3', {}, AT.privacy), h('p', { class: 'hint' }, AT.privacy_d), h('a', { class: 'btn', href: '#/privacy' }, AT.privacy)),
        au && au.can_invite && !au.demo && KA.inviteBox ? h('details', { class: 'box au-det acc-inv' }, h('summary', {}, AT.inv), KA.inviteBox()) : null,
        au && au.role === 'admin' ? h('p', { class: 'acc-admin' }, h('a', { class: 'btn small', href: 'admin.php' }, AT.admin)) : null];
    } else {
      // локальний акаунт (без сервера): пошта, пароль, видалення — як і раніше
      const email = h('input', { type: 'email', value: u.email || '' }), emailMsg = h('span', { class: 'ok-msg' });
      const newPass = h('input', { type: 'password', autocomplete: 'new-password' }), passMsg = h('span', { class: 'ok-msg' });
      const saveEmail = () => { const all = users(); all[u.id].email = email.value.trim(); raw.set('comiks.users', all); emailMsg.textContent = t('saved'); };
      const savePass = async () => { if (!newPass.value) return; const all = users(); all[u.id].pass = await hashPass(newPass.value); raw.set('comiks.users', all); newPass.value = ''; passMsg.textContent = t('pass_changed'); };
      const del = () => {
        if (!confirm(t('delete_confirm'))) return;
        try { const keys = []; for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i)); keys.filter(k => k.startsWith(`comiks.u.${u.id}.`)).forEach(k => localStorage.removeItem(k)); } catch { /* ignore */ }
        const all = users(); delete all[u.id]; raw.set('comiks.users', all);
        setSession(null); location.hash = '#/'; route();
      };
      body = [h('div', { class: 'box' }, h('h3', {}, t('profile')), field(t('f_email'), email), h('div', { class: 'row-left' }, h('button', { class: 'btn', type: 'button', onclick: saveEmail }, t('save')), emailMsg), h('p', { class: 'hint' }, t('email_note'))),
        h('div', { class: 'box' }, h('h3', {}, t('change_pass')), field(t('new_pass'), newPass), h('div', { class: 'row-left' }, h('button', { class: 'btn', type: 'button', onclick: savePass }, t('save')), passMsg),
          h('hr'), h('div', { class: 'row-left' }, h('button', { class: 'btn', type: 'button', onclick: logoutAll }, '🚪 ' + navT('logout')), h('button', { class: 'btn accent', type: 'button', onclick: del }, t('delete_acc')))),
        h('div', { class: 'box acc-priv' }, h('h3', {}, AT.privacy), h('p', { class: 'hint' }, AT.privacy_d), h('a', { class: 'btn', href: '#/privacy' }, AT.privacy))];
    }
    // перенесення прогресу з пристрою — лише поки є що переносити
    const imp = server && KA.importBox ? KA.importBox() : null;
    return h('section', { class: 'account' }, pageHead(t('cab_title', u.name)),
      hero, imp ? h('div', { class: 'box acc-imp' }, imp) : null, tabs,
      h('div', { class: 'acc-body acc-' + tab }, body.filter(Boolean)));
  }

  /* 🎁 Навчання безкоштовне, тож у кабінеті замість підписки — просто підтвердження цього
     і значок PRO для тих, хто був серед перших ста. */
  const FREE_T = {
    uk: { t: '🎁 Усе безкоштовно', d: 'Комікси, тести, картки, ігри, слова й граматика — без обмежень і без оплати.', pro: 'Ти серед перших ста — значок PRO лишається з тобою.' },
    en: { t: '🎁 Everything is free', d: 'Comics, tests, cards, games, words and grammar — no limits, no payment.', pro: 'You are one of the first hundred — the PRO badge stays with you.' },
    no: { t: '🎁 Alt er gratis', d: 'Tegneserier, prøver, kort, spill, ord og grammatikk – uten grenser og uten betaling.', pro: 'Du er blant de hundre første – PRO-merket blir hos deg.' },
    ar: { t: '🎁 كل شيء مجاني', d: 'القصص والاختبارات والبطاقات والألعاب والكلمات والقواعد — بلا حدود وبلا دفع.', pro: 'أنت من أول مئة — وسام PRO يبقى لك.' }
  };
  if (window.KL_T_FILL) KL_T_FILL(FREE_T, 'app.js:FREE_T');
  function premiumBox(au) {
    const L = FREE_T[ui] || FREE_T.en;
    const founder = au && au.founder;
    return h('div', { class: 'box acc-prem' }, h('h3', {}, L.t),
      founder ? h('p', {}, h('span', { class: 'pro-badge', title: L.pro }, '🏅 PRO #' + founder)) : null,
      h('p', { class: 'hint' }, founder ? L.pro : L.d));
  }

  /* ================= налаштування ================= */
  const SAMPLE = { cheerful: ['mia', 'Hei hei! Nå leser jeg med glad stemme!'], characters: ['pappa', 'Nå har alle figurene sin egen stemme.'], multi: ['nora', 'Nå snakker alle med forskjellige stemmer!'] };
  function sayCheer() { const [who, text] = SAMPLE[settings.voiceMode] || SAMPLE.cheerful; stopAll(); Speech.speak(text, who); }
  const BUDDY_T = { uk: ['🐾 Тамагочі в кутку', 'Озвучувати похвалу («Veldig bra!», «Prøv igjen!»)'], en: ['🐾 Corner buddy', 'Speak the praise out loud (“Veldig bra!”, “Prøv igjen!”)'], no: ['🐾 Kompisen i hjørnet', 'Si rosen høyt («Veldig bra!», «Prøv igjen!»)'], ar: ['🐾 الرفيق في الزاوية', 'انطق المديح بصوت عالٍ («Veldig bra!»، «Prøv igjen!»)'] };
  function setCheerVoice(on) { settings.cheerVoice = !!on; saveSettings(); document.dispatchEvent(new CustomEvent('cheervoice')); }
  function renderSettings() {
    const root = h('section', { class: 'settings' }, pageHead(t('settings_title')), window.KomiksEnglish ? h('div', { class: 'box' }, learnSwitch()) : null);
    const langSel = h('select', { 'aria-label': t('lang_label') }, LANGS.map(([v, label]) => h('option', { value: v, selected: v === ui }, label)));
    langSel.addEventListener('change', () => setUi(langSel.value));
    const learner = h('div', { class: 'choices' }, ['kids', 'adults', 'hard', 'expert'].map(v => { const [label, sub] = tx('learner')[v]; return h('button', { type: 'button', class: 'choice' + (settings.level === v ? ' on' : ''), onclick: () => { settings.level = v; saveSettings(); route(); } }, h('b', {}, label), h('small', {}, sub)); }));
    const lvlSel = h('select', {}, [['all', t('all_levels')], ...B.levels.map(l => [l, l])].map(([v, label]) => h('option', { value: v, selected: settings.levelFilter === v }, label)));
    lvlSel.addEventListener('change', () => { settings.levelFilter = lvlSel.value; saveSettings(); const f = store.get('filters', {}); f.level = lvlSel.value; store.set('filters', f); });
    const modeDesc = h('p', { class: 'hint', style: { margin: '10px 0' } });
    const modeBtns = h('div', { class: 'seg wrap' }, VOICE_MODES.map(([m, icon]) => h('button', { type: 'button', 'data-mode': m, onclick: () => { settings.voiceMode = m; saveSettings(); syncChrome(); paint(); sayCheer(); } }, `${icon} ${tx('vm')[m][0]}`)));
    const paint = () => { $$('button', modeBtns).forEach(b => b.classList.toggle('on', b.dataset.mode === settings.voiceMode)); modeDesc.textContent = tx('vm')[settings.voiceMode][1]; };
    paint();
    const audioBox = h('input', { type: 'checkbox', checked: settings.audio !== false });
    audioBox.addEventListener('change', () => { settings.audio = audioBox.checked; saveSettings(); checkVoices(); sayCheer(); });
    const pitch = h('input', { type: 'range', min: '1', max: '1.8', step: '0.05', value: settings.cheerPitch });
    const pitchVal = h('b', {}, (+settings.cheerPitch).toFixed(2));
    pitch.addEventListener('input', () => { settings.cheerPitch = +pitch.value; pitchVal.textContent = settings.cheerPitch.toFixed(2); saveSettings(); });
    const list = Speech.norwegian();
    const grid = h('div', { class: 'voice-grid' }, ['f', 'm'].map(g => {
      const s = h('select', {}, h('option', { value: '' }, list.length ? t('auto') : t('no_voices')), list.map(v => h('option', { value: v.name, selected: settings.voices['no' + g] === v.name }, `${v.name}${v.localService ? '' : ' ☁'}`)));
      s.addEventListener('change', () => { if (s.value) settings.voices['no' + g] = s.value; else delete settings.voices['no' + g]; saveSettings(); });
      return h('div', { class: 'voice-row' }, h('label', {}, t('voice_row', g)), h('div', { class: 'pick' }, s, h('button', { class: 'btn', type: 'button', onclick: () => Speech.speakTTS(g === 'm' ? 'Hei! Jeg heter Leo.' : 'Hei! Jeg heter Mia.', g === 'm' ? 'leo' : 'mia') }, '▶')));
    }));
    const rate = h('input', { type: 'range', min: '0.6', max: '1.3', step: '0.05', value: settings.rate });
    const rateVal = h('b', {}, '×' + (+settings.rate).toFixed(2));
    rate.addEventListener('input', () => { settings.rate = +rate.value; rateVal.textContent = '×' + settings.rate.toFixed(2); saveSettings(); });
    const TRL = {
      uk: ['🌍 Мови перекладу в коміксах', 'Познач усі мови, які хочеш бачити в підказці — вони покажуться одразу, одна під одною. Типово: мова інтерфейсу та англійська.'],
      en: ['🌍 Translation languages in comics', 'Tick every language you want in the tooltip — they all show at once, one under another. Default: the interface language and English.'],
      no: ['🌍 Oversettelsesspråk i tegneseriene', 'Kryss av for alle språkene du vil ha i hjelpeteksten — de vises samtidig, under hverandre. Standard: grensespråket og engelsk.'],
      ar: ['🌍 لغات الترجمة في القصص', 'اختر كل اللغات التي تريدها في التلميح — تظهر جميعها معًا، سطرًا تحت سطر. الافتراضي: لغة الواجهة والإنجليزية.'],
      de: ['🌍 Übersetzungssprachen in den Comics', 'Hake alle Sprachen an, die du im Hinweis sehen willst — sie erscheinen gleichzeitig untereinander. Standard: Oberflächensprache und Englisch.'],
      pl: ['🌍 Języki tłumaczenia w komiksach', 'Zaznacz wszystkie języki, które chcesz widzieć w podpowiedzi — pokażą się naraz, jeden pod drugim. Domyślnie: język interfejsu i angielski.'],
      tr: ['🌍 Çizgi romanlarda çeviri dilleri', 'İpucunda görmek istediğin bütün dilleri işaretle — hepsi aynı anda, alt alta görünür. Varsayılan: arayüz dili ve İngilizce.'],
      lt: ['🌍 Vertimo kalbos komiksuose', 'Pažymėk visas kalbas, kurias nori matyti užuominoje — jos rodomos kartu, viena po kita. Numatyta: sąsajos kalba ir anglų.']
    }[ui] || ['🌍 Translation', ''];
    const TR_LABEL = { uk: '🇺🇦 Українська', en: '🇬🇧 English', ar: '🇸🇦 العربية', de: '🇩🇪 Deutsch', pl: '🇵🇱 Polski', tr: '🇹🇷 Türkçe', lt: '🇱🇹 Lietuvių' };
    /* Можна лишити кілька мов увімкненими — тоді підказка покаже кілька рядків.
       Порядок рядків завжди такий, як у TR_ALL, щоб він не стрибав від порядку кліків.
       Останню галочку зняти не даємо: без жодної мови підказка була б порожня. */
    const trBox = h('div', { class: 'tr-langs' }, TR_ALL.map(l => {
      const cb = h('input', { type: 'checkbox', checked: trLangs().includes(l) });
      cb.dataset.lang = l;
      cb.addEventListener('change', () => {
        const cur = trLangs();
        const next = cb.checked ? TR_ALL.filter(x => x === l || cur.includes(x)) : cur.filter(x => x !== l);
        if (!next.length) { cb.checked = true; return; }
        settings.trLangs = next; delete settings.trLang;
        saveSettings(); ensureAr(); route(true);
      });
      return h('label', { class: 'check tr-lang' }, cb, h('span', {}, TR_LABEL[l] || l));
    }));
    // 📞 дзвінки від вигаданих персонажів: пропозиція не частіше ніж раз на 6 годин
    const CALL_S = { uk: ['📞 Дзвінки норвезькою', 'Іноді персонаж пропонує коротку розмову (не частіше ніж раз на 6 годин)'],
      en: ['📞 Calls in Norwegian', 'Sometimes a character offers a short call (at most once every 6 hours)'],
      no: ['📞 Samtaler på norsk', 'Iblant foreslår en figur en kort samtale (høyst én gang hver sjette time)'],
      ar: ['📞 مكالمات بالنرويجية', 'أحيانًا تقترح إحدى الشخصيات مكالمة قصيرة (مرة كل 6 ساعات كحد أقصى)'] }[ui] || ['📞 Calls', ''];
    const AUTO_S = { uk: ['⏭️ Сам переходити до наступного питання', 'Після відповіді тест іде далі за кілька секунд. Дотик до екрана зупиняє відлік.'],
      en: ['⏭️ Move on by itself', 'After an answer the test goes on in a few seconds. Touching the screen stops the countdown.'],
      no: ['⏭️ Gå videre av seg selv', 'Etter et svar går prøven videre om noen sekunder. Ett trykk stopper nedtellingen.'],
      ar: ['⏭️ الانتقال تلقائيًا', 'بعد الإجابة ينتقل الاختبار خلال ثوانٍ. لمسة واحدة توقف العد.'] }[ui] || ['⏭️ Move on by itself', ''];
    const autoBox = h('input', { type: 'checkbox', checked: settings.autoNext !== false });
    autoBox.addEventListener('change', () => { settings.autoNext = autoBox.checked; saveSettings(); });
    const callBox = h('input', { type: 'checkbox', checked: settings.callOffer === true });
    callBox.addEventListener('change', () => { settings.callOffer = callBox.checked; saveSettings(); });
    // 🔒 строгий режим: вмикається паролем, вимикається тільки паролем
    const strictBtn = h('button', { class: 'btn' + (strictOn() ? '' : ' accent'), type: 'button',
      onclick: () => (strictOn() ? parentAsk('off') : strictEnable()) }, strictOn() ? st('off') : st('on'));
    const cheerBox = h('input', { type: 'checkbox', checked: settings.cheerVoice !== false });
    cheerBox.addEventListener('change', () => { setCheerVoice(cheerBox.checked); if (cheerBox.checked) cheer(true); });
    const u = currentUser();
    const A11 = window.KomiksA11y;
    root.append(
      ...(A11 ? [h('div', { class: 'box a11y-set' }, h('h3', {}, A11.text('title'), A11.isOn() ? h('span', { class: 'a11y-on' }, A11.text('on')) : null), h('p', { class: 'hint' }, A11.text('desc')), A11.button('btn accent'))] : []),
      h('div', { class: 'box' }, h('h3', {}, '🌐 ' + t('lang_label')), langSel),
      h('div', { class: 'box' }, h('h3', {}, TRL[0]), h('p', { class: 'hint' }, TRL[1]), trBox),
      h('div', { class: 'box' }, h('h3', {}, t('s_learner')), learner),
      ...(u ? [h('div', { class: 'box strict-box' + (strictOn() ? ' on' : '') }, h('h3', {}, st('title')), h('p', { class: 'hint' }, st('d')),
        h('div', { class: 'row-left' }, strictBtn, strictOn() && !parentOpen() ? h('button', { class: 'btn', type: 'button', onclick: () => parentAsk() }, st('parent')) : null,
          parentOpen() ? h('b', { class: 'strict-open' }, st('open')) : null))] : []),
      h('div', { class: 'box' }, h('h3', {}, AUTO_S[0]), h('label', { class: 'check' }, autoBox, h('span', {}, AUTO_S[1]))),
      ...(u ? [h('div', { class: 'box call-settings' }, h('h3', {}, CALL_S[0]), h('label', { class: 'check' }, callBox, h('span', {}, CALL_S[1])),
        h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/call' }, window.KomiksCall ? window.KomiksCall.text().start : '📞')))] : []),
      h('div', { class: 'box' }, h('h3', {}, t('s_level')), lvlSel, h('p', { class: 'hint' }, t('s_level_d'))),
      h('div', { class: 'box' }, h('h3', {}, t('s_account')), u
        ? h('div', { class: 'row-left' }, h('b', {}, u.name), h('a', { class: 'btn', href: '#/account' }, navT('account')), h('a', { class: 'btn', href: '#/account/settings' }, '🔐'))
        : h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/register' }, navT('register')), h('a', { class: 'btn', href: '#/login' }, navT('login')))),
      // 🔑 Google: підключити / відв’язати — те саме, що на вкладці «Акаунт»
      ...[u && u.server && serverAuth() && window.KomiksAuth.user && window.KomiksAuth.googleManage ? window.KomiksAuth.googleManage() : null].filter(Boolean),
      h('div', { class: 'box' }, h('h3', {}, t('vm_title')), modeBtns, modeDesc, h('label', { class: 'check' }, audioBox, t('neural', window.AUDIO ? Object.keys(window.AUDIO).length : 0))),
      h('div', { class: 'box' }, h('h3', {}, BUDDY_T[ui] ? BUDDY_T[ui][0] : BUDDY_T.en[0]), h('label', { class: 'check' }, cheerBox, BUDDY_T[ui] ? BUDDY_T[ui][1] : BUDDY_T.en[1])),
      h('div', { class: 'box' }, h('h3', {}, t('reading')), h('div', { class: 'check' }, t('speed'), rate, rateVal)),
      h('div', { class: 'box' }, h('h3', {}, t('browser_voices')), grid, h('p', { class: 'hint', style: { marginTop: '10px' } }, t('voices_found', list.length)), h('div', { class: 'check' }, t('pitch'), pitch, pitchVal), h('p', { class: 'hint' }, t('pitch_note'))),
      h('div', { class: 'box' }, h('h3', {}, t('no_voice_title')), h('ol', {}, tx('no_voice').map(x => h('li', {}, x)))),
      h('div', { class: 'box' }, h('h3', {}, t('progress_title')), h('p', { class: 'hint' }, t('progress_note')),
        h('button', { class: 'btn accent', type: 'button', onclick: () => {
          if (!confirm(t('reset_confirm'))) return;
          ['progress', 'stats', 'days', 'cards', 'quizlog', 'plan', 'alphaVisited', 'numbersVisited', 'filters'].forEach(k => store.del(k)); COMICS.forEach(c => store.del('seen.' + c.id)); location.hash = '#/';
        } }, t('reset'))));
    return root;
  }

  /* ================= шапка, футер, маршрути ================= */
  const app = $('#app');
  let keyHandler = null;
  /* Написи модулів для німецької, польської, турецької та литовської лежать
     окремим файлом і вантажаться лише своєю мовою (див. assets/boot.js). Коли
     мову перемикають уже в застосунку, цього файла ще немає — довантажуємо й
     перемальовуємо, інакше половина написів лишилася б англійською до
     наступного перезавантаження. */
  function ensureAppText(code, done) {
    if (!(window.KL_T_LANGS || []).includes(code) || (window.KL_T_HAVE || []).includes(code)) return done();
    const sc = document.createElement('script');
    sc.src = 'data/app-i18n-' + code + '.js?v=' + ((window.KOMIKS_DATA || {}).version || '');
    sc.onload = () => { if (window.KL_T_APPLY) window.KL_T_APPLY(); done(); };
    sc.onerror = done;
    document.head.append(sc);
  }
  function setUi(code) {
    if (!I18N[code]) return;
    ui = code; raw.set('comiks.ui', code);
    if (window.KomiksA11y) setTimeout(window.KomiksA11y.relabel, 0);
    ensureAppText(code, () => { syncChrome(); route(); });
  }
  function renderFooter() {
    const foot = $('.foot');
    if (!foot) return;
    const F = tx('foot') || {};
    const link = (href, label) => h('li', {}, h('a', { href }, label));
    const u = currentUser();
    const langBtns = h('ul', {}, LANGS.map(([code, label]) => h('li', {}, h('a', { href: '#', onclick: e => { e.preventDefault(); setUi(code); }, class: ui === code ? 'on' : '' }, label))));
    // колонки за категоріями; на ПК — однакова висота (див. .foot-inner у style.css)
    const FX = { uk: { games: '🎮 Ігри', community: '👥 Спільнота', players: '🔎 Пошук гравців', news: '✨ Що нового' }, en: { games: '🎮 Games', community: '👥 Community', players: '🔎 Find players', news: '✨ What’s new' }, no: { games: '🎮 Spill', community: '👥 Fellesskap', players: '🔎 Finn spillere', news: '✨ Hva er nytt' }, ar: { games: '🎮 الألعاب', community: '👥 المجتمع', players: '🔎 ابحث عن لاعبين', news: '✨ ما الجديد' } }[ui] || {};
    if (window.KL_T_FILL) KL_T_FILL(FX, 'app.js:FX');
    const col = (title, items, extra) => h('nav', { class: 'foot-col' }, h('h4', {}, title), h('ul', {}, items), extra || null);
    foot.replaceChildren(
      // значки Google Play і Microsoft Store переїхали в QR-блок над футером (KomiksExtras.storeBadges)
      h('div', { class: 'foot-inner' },
        h('div', { class: 'foot-col about' }, h('a', { class: 'logo small', href: '#/' }, h('span', { class: 'logo-bubble' }, '💬'), h('span', { class: 'logo-text' }, h('b', {}, (tx('brand') || ['Комікс', '·Lab'])[0]), h('i', {}, (tx('brand') || ['', '·Lab'])[1]))),
          h('p', {}, F.about), h('p', { class: 'ai' }, F.ai)),
        col('📚 ' + F.learn, [link('#/today', td('title')), link('#/write', window.KomiksWrite ? window.KomiksWrite.text('nav') : '✍️'), link('#/exam', window.KomiksExam ? window.KomiksExam.text('nav') : '🏁'), link('#/placement', window.KomiksPlacement ? window.KomiksPlacement.text('nav') : '🎯'), link('#/analysis', AN_T().title), link('#/', navT('comics')), link('#/words', navT('words')), link('#/grammar', navT('grammar')), link('#/english', navT('english')), link('#/math', navT('math')), window.KomiksKoding ? link('#/koding', '💻 ' + window.KomiksKoding.text('nav')) : null, link('#/alphabet', navT('alphabet')), link('#/numbers', navT('numbers')), link('#/cards', navT('cards')), link('#/pairs', window.KomiksPairs ? window.KomiksPairs.text('nav') : '🧠'), link('#/cross', window.KomiksCross ? window.KomiksCross.text('title') : '🧩'), link('#/plan', navT('plan'))]),
        col(FX.games, [NO_EXTERNAL || !window.KomiksGames ? null : h('li', {}, h('a', { href: '#/games' }, window.KomiksGames.text('nav'))), OFFLINE ? null : h('li', {}, h('a', { href: 'https://bilohash.com/comiks/room_1/' }, ({ uk: '🎬 Кімната дієслів', en: '🎬 Verb room', no: '🎬 Verbrommet', ar: '🎬 غرفة الأفعال' })[ui] || '🎬 Verb room')), link('#/call', window.KomiksCall ? window.KomiksCall.text().title : '📞'), link('#/race', '🏁 ' + navT('race')), link('#/chess', '♟ ' + navT('chess')), link('#/math/rocket', '🚀 Math Rocket'), link('#/math/race', window.KomiksRocket ? window.KomiksRocket.text('with_class') : '👥 Math Rocket'), link('#/game', navT('game')), link('#/tests', navT('tests')), link('#/rating', navT('rating'))]),
        OFFLINE ? null : col(FX.community, [link('#/friends', navT('friends')), link('#/players', FX.players), link('#/watch', '👨‍👩‍👧 ' + (({ uk: 'Батькам і вчителям', en: 'For parents & teachers', no: 'For foreldre og lærere', ar: 'للآباء والمعلمين', de: 'Für Eltern & Lehrkräfte', pl: 'Dla rodziców i nauczycieli', tr: 'Ebeveynler ve öğretmenler için', lt: 'Tėvams ir mokytojams' })[ui] || 'For parents & teachers')), ...(u ? [link('#/account', '👤 ' + navT('account')), h('li', {}, h('a', { href: '#/', onclick: e => { e.preventDefault(); logoutAll(); } }, navT('logout')))] : [link('#/login', navT('login')), link('#/register', navT('register'))]), link('#/settings', navT('settings'))]),
        col('ℹ️ ' + F.info, [window.KomiksFeedback ? h('li', {}, h('a', { href: '#', onclick: e => { e.preventDefault(); window.KomiksFeedback.open(); } }, window.KomiksFeedback ? '💌 ' + (({ uk: 'Відгук', en: 'Feedback', no: 'Tilbakemelding', ar: 'ملاحظات' })[ui] || 'Feedback') : '')) : null, link('#/help', navT('help')), link('#/whatsnew', FX.news), OFFLINE ? null : link('#/stats', '📈 ' + (({ uk: 'Статистика', en: 'Statistics', no: 'Statistikk', ar: 'الإحصاءات', de: 'Statistik', pl: 'Statystyki', tr: 'İstatistikler', lt: 'Statistika' })[ui] || 'Statistics')), link('#/install', '📲 ' + ({ uk: 'Застосунок', en: 'Get the app', no: 'Få appen', ar: 'التطبيق' }[ui] || 'Get the app')), link('#/teacher', '🎓 ' + ({ uk: 'Для вчителів', en: 'For teachers', no: 'For lærere', ar: 'للمعلّمين' }[ui] || 'For teachers')), link('#/terms', navT('terms')), link('#/sitemap', '🗺️ Sitemap')], [h('h4', {}, F.langs), langBtns])),
      h('div', { class: 'foot-bottom' }, h('span', {}, F.rights ? F.rights(new Date().getFullYear()) : ''), h('a', { class: 'made', href: 'https://bilohash.com/news/', target: '_blank', rel: 'noopener' }, F.made)));   // підказку про клавіші з футера прибрано на прохання — клавіші в читалці працюють
    if (window.KomiksExtras) window.KomiksExtras.qrPromo();
  }
  /* Прибираємо з верхнього меню те, чого в офлайні немає. Робимо це один раз
     після завантаження, а не ховаємо через CSS: порожніх місць бути не повинно. */
  function trimOfflineNav() {
    if (!OFFLINE) return;
    $$('#mainNav a[data-k]').forEach(a => { if (ONLINE_ONLY.has(a.dataset.k)) a.remove(); });
    const acc = $('#accBtn'); if (acc) acc.remove();
  }
  /* 🔎 Відкритий комікс — свій заголовок вкладки й опис мовою інтерфейсу (тема з data/seo.js:
     «Основи HTML для дітей — Сайт про Пуса»). Поза коміксом syncChrome повертає загальні. */
  function comicMeta(view, c) {
    const S = window.KOMIKS_SEO;
    if (!S || !c || (view !== 'read' && view !== 'quiz')) return;
    const nm = ui === 'no' ? c.title : ui === 'uk' ? (c.titleUk || c.title) : (packFor(ui, c.titleEn) || c.titleEn || c.title);
    const topic = S.topic(c, ui);
    document.title = (topic ? (S.own(c) ? `${topic} — ${nm}` : `${nm} — ${topic}`) : nm) + ' | Komiks·Lab';
    const md = $('meta[name="description"]');
    if (md) md.setAttribute('content', `${topic ? topic[0].toUpperCase() + topic.slice(1) + ': ' : ''}${summaryOf(c)}`.slice(0, 160));
  }
  function syncChrome() {
    document.documentElement.lang = ui === 'no' ? 'nb' : ui;
    // арабська — справа наліво + шрифт з арабськими літерами (підвантажується лише для неї)
    document.documentElement.dir = ui === 'ar' ? 'rtl' : 'ltr';
    ensureAr();
    /* Арабський шрифт тягнеться з мережі, тож в офлайн-збірці його не беремо:
       там малює системний. Інакше застосунок, який обіцяє нікуди не ходити,
       робив би запит до Google при першому ж перемиканні на арабську — і це
       вже не дрібниця, а розбіжність із власною політикою приватності. */
    if (!OFFLINE && ui === 'ar' && !document.getElementById('font-ar')) { const l = document.createElement('link'); l.id = 'font-ar'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@500;700;800&display=swap'; document.head.append(l); }
    const meta = tx('meta') || {};
    if (meta.title) document.title = meta.title;
    const md = $('meta[name="description"]'); if (md && meta.description) md.setAttribute('content', meta.description);
    document.body.classList.toggle('kids', settings.level === 'kids');
    const sel = $('#uiSel'); if (sel) sel.value = ui;
    const sub = $('.logo-text small'); if (sub) { const ct = COURSE_SUB[ui] || COURSE_SUB.en; sub.textContent = ct[activeCourse()] || t('app_sub'); }
    const brand = tx('brand') || ['Комікс', '·Lab'];
    $$('.logo-text').forEach(el => { const b = $('b', el), i = $('i', el); if (b) b.textContent = brand[0]; if (i) i.textContent = brand[1]; });
    const vm = VOICE_MODES.find(x => x[0] === settings.voiceMode) || VOICE_MODES[0];
    const vb = $('#voiceBtn'); if (vb) { vb.textContent = vm[1]; vb.title = t('voice_btn', tx('vm')[vm[0]][0]); }
    const u = currentUser();
    const ab = $('#accBtn'); if (ab) { ab.replaceChildren(h('span', { class: 'acc-ico' }, u ? u.name.slice(0, 1).toUpperCase() : '👤'), h('span', { class: 'acc-name' }, u ? u.name : navT('login'))); ab.href = u ? '#/account' : '#/login'; if (u && window.KomiksProfile) window.KomiksProfile.refreshHeader(); }
    const hb = $('#helpBtn'); if (hb) hb.title = navT('help');
    const sb = $('#setBtn'); if (sb) sb.title = navT('settings');
    $$('#mainNav a').forEach(a => { a.textContent = a.dataset.k === 'search' ? (window.KomiksSearch ? window.KomiksSearch.text('title') : '🔍') : navT(a.dataset.k); a.classList.toggle('on', (location.hash || '#/').startsWith(a.getAttribute('href')) && a.getAttribute('href') !== '#/'); });
    renderFooter();
  }
  const topbar = () => document.querySelector('.topbar');
  /* Особистий блок у бургер-меню: хто я, куди йти. Показуємо лише тому, хто ввійшов —
     гостю замість нього лишається звичайна кнопка «Увійти». */
  const NAV_ACC = {
    uk: { profile: '👤 Мій профіль', friends: '👥 Друзі', msgs: '✉️ Повідомлення', alerts: '🔔 Оновлення від друзів', settings: '⚙️ Налаштування', out: '🚪 Вийти' },
    en: { profile: '👤 My profile', friends: '👥 Friends', msgs: '✉️ Messages', alerts: '🔔 Friends’ updates', settings: '⚙️ Settings', out: '🚪 Log out' },
    no: { profile: '👤 Min profil', friends: '👥 Venner', msgs: '✉️ Meldinger', alerts: '🔔 Nytt fra venner', settings: '⚙️ Innstillinger', out: '🚪 Logg ut' },
    ar: { profile: '👤 ملفي', friends: '👥 الأصدقاء', msgs: '✉️ الرسائل', alerts: '🔔 جديد الأصدقاء', settings: '⚙️ الإعدادات', out: '🚪 خروج' }
  };
  if (window.KL_T_FILL) KL_T_FILL(NAV_ACC, 'app.js:NAV_ACC');
  const navAccT = k => (NAV_ACC[ui] || NAV_ACC.en)[k];
  function navAccBox() {
    const u = currentUser();
    if (!u) return null;
    const av = window.KomiksProfile ? window.KomiksProfile.avatar() : '🙂';
    const AVx = window.KomiksAvatars ? window.KomiksAvatars.el(av, { size: 48, mood: 'cheer' }) : document.createTextNode('🙂');
    return h('div', { class: 'nav-acc' },
      h('a', { class: 'nav-acc-me', href: '#/account' }, h('span', { class: 'nav-acc-ava' }, AVx),
        h('div', {}, h('b', {}, u.name || ''), h('small', {}, navAccT('profile')))));
  }
  function paintNavAcc(open) {
    const t = topbar(); if (!t) return;
    const old = t.querySelector('.nav-acc');
    if (old) old.remove();
    if (!open) return;
    const box = navAccBox();
    if (box) t.append(box);
  }
  const closeNav = () => { const t = topbar(); if (t) { t.classList.remove('nav-open'); const b = $('#navBtn'); if (b) b.setAttribute('aria-expanded', 'false'); const a = t.querySelector('.nav-acc'); if (a) a.remove(); } };
  (function initNav() {
    const b = document.getElementById('navBtn'); if (!b) return;
    b.addEventListener('click', e => { e.stopPropagation(); const t = topbar(); const open = t.classList.toggle('nav-open'); b.setAttribute('aria-expanded', String(open)); paintNavAcc(open); });
    document.addEventListener('click', e => { if (!e.target.closest('.topbar')) closeNav(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  })();
  /* ⬆️ Шапка ховається вгору, коли гортаєш униз, і повертається від найменшого руху вгору.
     Не ховаємо: угорі сторінки, при відкритому меню, у вікнах (відгук, пароль) та в іграх. */
  (function initHideTop() {
    const show = () => document.body.classList.remove('top-hidden');
    let last = window.scrollY, ticking = false;
    const apply = () => {
      ticking = false;
      const bar = topbar(); if (!bar) return;                         // шапку шукаємо щоразу: скрипт може стартувати раніше за неї
      const y = Math.max(0, window.scrollY), dy = y - last;
      if (Math.abs(dy) < 6) return;                                   // дрібні коливання не рахуємо
      last = y;
      if (bar.classList.contains('nav-open') || document.querySelector('.fb-back') || document.body.classList.contains('in-game')) return show();
      if (y < bar.offsetHeight + 12) return show();                   // біля самого верху шапка завжди видима
      document.body.classList.toggle('top-hidden', dy > 0);
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }, { passive: true });
    addEventListener('hashchange', () => { last = 0; show(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') show(); });
    document.addEventListener('focusin', e => { if (e.target.closest && e.target.closest('.topbar')) show(); });
    document.addEventListener('pointermove', e => { if (e.clientY < 8) show(); }, { passive: true });
  })();
  function route() {
    closeNav();
    if (!(location.hash || '').startsWith('#/quiz/')) quizFocus(false);
    /* Читання — це і норвезький комікс, і історія з курсу англійської; обидва
       лишаються в режимі одного екрана, доки з них не вийшли. */
    if (!/^#\/(read|english)\/[^/]+\//.test(location.hash || '')) readFocus(false);
    if (window.KomiksGame) window.KomiksGame.onRoute((location.hash || '#/').split('/')[1] || '');
    if (window.KomiksPairs) window.KomiksPairs.onRoute((location.hash || '#/').split('/')[1] || '');
    stopAll(); hideWordTip(); keyHandler = null;
    const auto = autoStartNext; autoStartNext = false;
    if (!auto) autoplay = false;
    const parts = (location.hash || '#/').split('/');
    const [, view = '', id, arg] = parts;
    const englishCourseRoute = view === 'english' || (view === 'quiz' && /^en(?:-|$)/.test(id || ''));
    if (englishCourseRoute && settings.learnLang !== 'en') { settings.learnLang = 'en'; saveSettings(); }
    const c = COMICS.find(x => x.id === id);
    let el;
    if (!strictAllows(location.hash)) {                      // 🔒 строгий режим: лише поточний крок плану
      const main = $('#app') || document.querySelector('main');
      if (main) { main.replaceChildren(strictLock()); window.scrollTo({ top: 0 }); }
      return;
    }
    if (OFFLINE && ONLINE_ONLY.has(view)) { location.hash = '#/'; el = renderHome(); }
    else if (view === 'read' && c) el = renderRead(c, parseInt(arg, 10) || 0, auto);
    else if (view === 'quiz' && id === 'level' && B.levels.includes(arg)) el = runQuiz({ key: 'level:' + arg, title: `Nivåtest ${arg}`, qs: buildLevelQuiz(arg), back: '#/tests' });
    else if (view === 'quiz' && id === 'order') {
      const lv = B.levels.includes(arg) ? arg : 'all';
      const qs = buildOrderQuiz(lv);
      el = qs.length
        ? runQuiz({ key: 'order:' + lv, title: t('order_title') + (lv === 'all' ? '' : ' · ' + lv), qs, back: '#/tests' })
        : h('section', { class: 'tests' }, pageHead(t('order_title')), h('p', { class: 'lead-p' }, t('no_comics_level')), h('a', { class: 'btn', href: '#/tests' }, t('home')));
    }
    else if (view === 'quiz' && id === 'alphabet') el = runQuiz({ key: 'alphabet', title: 'Alfabettest', qs: buildAlphabetQuiz(), reread: '#/alphabet', back: '#/alphabet' });
    else if (view === 'quiz' && id === 'grammar' && window.KomiksGrammar) { const G = window.KomiksGrammar; el = runQuiz({ key: arg ? 'grammar:' + arg : 'grammar', title: arg ? G.label(arg) : 'Grammatikk', qs: G.quiz(arg), reread: arg ? '#/grammar/' + arg : '#/grammar', back: '#/grammar' }); }
    else if (view === 'search' && window.KomiksSearch) el = window.KomiksSearch.page(id, arg);
    else if (view === 'koding' && window.KomiksKoding) el = id === 'spill' && window.KomiksKodeGame ? window.KomiksKodeGame.render(arg) : window.KomiksKoding.page(id);
    else if (view === 'quiz' && id === 'koding' && window.KomiksKoding) el = runQuiz({ key: arg ? 'koding:' + arg : 'koding', title: '💻 ' + (arg ? window.KomiksKoding.title(arg) : 'Programmering'), qs: window.KomiksKoding.quiz(arg, kidsMode(), quizSize()), reread: '#/koding', back: '#/koding' });
    else if (view === 'quiz' && id === 'clock' && window.KomiksGrammar) el = runQuiz({ key: 'clock', title: 'Hva er klokka?', qs: window.KomiksGrammar.clock(quizSize(), settings.level === 'kids'), reread: '#/grammar/clock', back: '#/grammar' });
    else if (view === 'grammar' && window.KomiksGrammar) el = window.KomiksGrammar.render(id);
    else if (view === 'words' && window.KomiksWords) el = window.KomiksWords.render(id);
    else if (view === 'english' && window.KomiksEnglish) el = id === 'alphabet' ? window.KomiksEnglish.alphabet() : id === 'words' ? window.KomiksEnglish.words(arg) : id === 'plan' && window.KomiksEnglish.plan ? window.KomiksEnglish.plan() : id ? window.KomiksEnglish.read(id, parseInt(arg, 10) || 0) : window.KomiksEnglish.render();
    else if (view === 'quiz' && id === 'en' && window.KomiksEnglish) el = window.KomiksEnglish.quiz(arg);
    else if (view === 'quiz' && id === 'en-alphabet' && window.KomiksEnglish) el = window.KomiksEnglish.alphabetQuiz();
    else if (view === 'quiz' && id === 'en-words' && window.KomiksEnglish) el = window.KomiksEnglish.wordsQuiz(arg);
    else if (view === 'quiz' && id === 'en-mistakes' && window.KomiksEnglish) el = window.KomiksEnglish.missQuiz();
    else if (view === 'race' && window.KomiksRace) el = window.KomiksRace.render(id, arg);
    else if (view === 'chess' && window.KomiksChess) el = window.KomiksChess.render(id, arg);
    else if ((view === 'messages' || view === 'privacy') && window.KomiksMessages) el = window.KomiksMessages.render(view, id);
    else if (view === 'whatsnew' && window.KomiksNews) el = window.KomiksNews.render();
    else if (view === 'cross' && window.KomiksCross) el = window.KomiksCross.render(id);
    else if (view === 'games' && window.KomiksGames) el = window.KomiksGames.render(id);
    else if (view === 'install' && window.KomiksInstall) el = window.KomiksInstall.page();
    else if (view === 'premium' && window.KomiksPremium) el = window.KomiksPremium.render(id);
    else if (view === 'analysis') el = renderAnalysis();
    else if (view === 'today') el = renderToday();
    else if (view === 'write' && window.KomiksWrite) el = window.KomiksWrite.render();
    else if (view === 'exam' && window.KomiksExam) el = window.KomiksExam.render();
    else if (view === 'placement' && window.KomiksPlacement) el = window.KomiksPlacement.render();
    else if (view === 'alerts' && window.KomiksAlerts) el = window.KomiksAlerts.render();
    else if (view === 'teacher' && window.KomiksTeacher) el = window.KomiksTeacher.render();
    else if (view === 'call' && window.KomiksCall) el = window.KomiksCall.render();
    else if (view === 'avatar' && window.KomiksProfile) el = window.KomiksProfile.studio();
    else if (view === 'math' && window.KomiksMath) el = window.KomiksMath.render(id, arg);
    else if (view === 'quiz' && id === 'math' && window.KomiksMath) el = window.KomiksMath.quiz(arg, parts[4]);
    else if (view === 'quiz' && id === 'words' && window.KomiksWords) { const Wd = window.KomiksWords; el = runQuiz({ key: arg ? 'words:' + arg : 'words', title: arg ? Wd.label(arg) : 'Ord', qs: Wd.quiz(arg), reread: arg ? '#/words/' + arg : '#/words', back: '#/words' }); }
    else if (view === 'quiz' && id === 'numbers') el = runQuiz({ key: 'numbers', title: 'Talltest', qs: buildNumbersQuiz(), reread: '#/numbers', back: '#/numbers' });
    else if (view === 'quiz' && id === 'exam' && window.KomiksExam) {
      const E = window.KomiksExam, n = arg === '2' ? '2' : '1';
      el = runQuiz({ key: `exam:${E.level()}:${n}`, title: E.text(n === '1' ? 'p1' : 'p2'), qs: E.questions(n), back: '#/exam' });
    }
    else if (view === 'quiz' && id === 'mistakes') { const qs = buildMistakeQuiz(); el = qs.length ? runQuiz({ key: 'mistakes', title: AN_T().short, qs, back: '#/analysis' }) : renderAnalysis(); }
    else if (view === 'quiz' && c) el = runQuiz({ key: c.id, title: c.title, qs: buildComicQuiz(c, true), reread: `#/read/${c.id}/0`, back: c.category === 'koding' ? '#/koding' : undefined });
    else if (view === 'cards') el = renderCards(id);
    else if (view === 'pairs' && window.KomiksPairs) el = window.KomiksPairs.render(id, arg);
    else if (view === 'pairs' && c) el = renderPairs(c);
    else if (view === 'role' && c) el = renderRole(c, arg);
    else if (view === 'alphabet') el = renderAlphabet();
    else if (view === 'numbers') el = renderNumbers();
    else if (view === 'tests') el = renderTests();
    else if (view === 'plan' && id === 'settings') el = renderPlanSettings();
    else if (view === 'plan') el = renderPlan();
    else if (view === 'account' && id === 'plan') el = renderPlanSettings(); // старе посилання
    else if (view === 'account') el = renderAccount(id);
    else if (view === 'player' && window.KomiksPlayers) el = window.KomiksPlayers.render(id, arg);
    else if (view === 'players' && window.KomiksPlayers) el = window.KomiksPlayers.list(id === 'tag' ? arg : '');
    else if (view === 'friends' && window.KomiksFriends) el = window.KomiksFriends.render(id, arg);
    else if (AUTH_VIEWS.includes(view) && serverAuth()) el = window.KomiksAuth.render(view, id);
    else if (view === 'login' || view === 'forgot' || view === 'login-pass') el = renderLogin();
    else if (view === 'register') el = renderRegister();
    else if (['verify-sent', 'welcome', 'verify-failed', 'reset', 'magic', 'login-pass'].includes(view) && window.KomiksAuth && location.protocol.startsWith('http')) { el = h('div', { class: 'au-wrap' }, h('div', { class: 'au-spinner' })); window.KomiksAuth.ready().then(() => { if (serverAuth()) route(true); }); }
    else if (view === 'settings') el = renderSettings();
    else if (view === 'help') el = window.KomiksExtras ? window.KomiksExtras.renderHelp() : renderHelp();
    else if (view === 'rating' && window.KomiksExtras) el = window.KomiksExtras.renderRating();
    else if (view === 'stats') el = renderStats();
    else if (view === 'watch' && window.KomiksWatch) el = window.KomiksWatch.render(id);
    else if (view === 'sitemap' && window.KomiksExtras) el = window.KomiksExtras.renderSitemap();
    else if (view === 'terms') el = renderTerms();
    else if ((view === 'game' || view === 'join') && window.KomiksGame) el = window.KomiksGame.render(view, id);
    else el = renderHome();
    app.replaceChildren(el);
    syncChrome();
    comicMeta(view, c);
    if (!auto) window.scrollTo({ top: 0 });

  }
  function checkVoices() {
    const warn = $('#voiceWarn');
    if (!warn) return;
    if (window.AUDIO && settings.audio !== false) { warn.hidden = true; return; }
    if (!Speech.ok) { warn.hidden = false; warn.textContent = t('warn_no_tts'); return; }
    if (Speech.norwegian().length) { warn.hidden = true; return; }
    warn.hidden = false;
    warn.replaceChildren(t('warn_missing'), h('a', { href: '#/settings' }, t('how_add')));
  }

  const uiSel = $('#uiSel');
  if (uiSel) uiSel.addEventListener('change', () => setUi(uiSel.value));
  const vb = $('#voiceBtn');
  if (vb) vb.addEventListener('click', () => {
    const k = VOICE_MODES.findIndex(x => x[0] === settings.voiceMode);
    settings.voiceMode = VOICE_MODES[(k + 1) % VOICE_MODES.length][0];
    saveSettings(); syncChrome(); sayCheer();
    if (location.hash.startsWith('#/settings')) route();
  });
  document.addEventListener('keydown', e => { if (keyHandler) keyHandler(e); });
  window.addEventListener('hashchange', route);
  let voiceTimer = 0;
  document.addEventListener('voices', () => { clearTimeout(voiceTimer); voiceTimer = setTimeout(() => { checkVoices(); if (location.hash.startsWith('#/settings')) route(); }, 300); });

  // внутрішній API для модуля гри (assets/game.js)
  window.KomiksCore = {
    h, $, $$, sleep, clamp, range, pick, shuffle, sample, uniq, svgEl, norm, ch, stars,
    t, tx, navT, withTr, qtr, both, panelView, pageHead, catLabel, Speech, Sfx, confetti, claim, cheer, stopAll, wordSpans, hoverWords, lookup,
    COMICS, CH, B, ART, QNO, NO, LANGS, raw, store, bump,
    /* Сторонні ігри живуть на сайті, але не в збірці для крамниці — див. NATIVE. */
    OFFLINE, NATIVE, NO_EXTERNAL, GAMES: window.KOMIKS_GAMES || [],
    get ui() { return ui; }, get settings() { return settings; }, learnSwitch, setCheerVoice, arFor, currentUser, setSession, copyGuestProgressTo,
    buildComicQuiz, buildLevelQuiz, buildAlphabetQuiz, buildNumbersQuiz, comicQuestions, recordQuiz, route,
    practice, canRecord: () => !!Rec.Ctor,
    // спільна пам'ять акаунта — щоб ігри й тести рахували «знаю / не знаю» разом
    allVocab, exampleFor, gradeWord, trLangs, trLang, trText, packFor, locale, FLAG,
    /* Режим одного екрана для читання й тесту. Курс англійської малює свої
       сторінки сам, але вигляд на телефоні має бути той самий, тож перемикачі
       віддаємо назовні, а не копіюємо правила в інший файл. */
    readFocus, quizFocus, autoNext,
    tourIfNew, showTour,
    /* Чи прийняті чинні умови у вікні привітання — потрібно входу через Google:
       новий акаунт створюємо лише з цією згодою. */
    hasConsent,
    /* Ліміт для гостя — один тест на весь сайт, а не один на кожен розділ:
       тести курсу англійської мусять рахуватися разом із норвезькими. */
    quizGate, guestCount, quizLeftNote,
    cards: { get: () => store.get('cards', {}), set: v => store.set('cards', v), boxDays: BOX_DAYS, day: DAY },
    errs: { list: errList, forget: errForget, add: errWord, resolve: errResolve, reviewed: errReviewed, due: errDue },
    day: { log: dayLog, mark: markDay }
  };

  Speech.init();
  trimOfflineNav();
  route();
  welcome();
  setTimeout(checkVoices, 1800);
})();
