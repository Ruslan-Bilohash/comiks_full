/* Комікс·Lab — генератор ілюстрацій SVG: фони, персонажі, предмети, ефекти, бульбашки.
   Кадр описується в даних коміксу полем art:
   { bg: 'kitchen', board: 'Hei!', chars: [{ id: 'mia', x: 150, mood: 'happy', pose: 'wave' }],
     props: [{ type: 'cake', x: 200, y: 198, s: 1, front: false }], fx: 'snow', sfx: { x: 320, y: 90 } } */
(() => {
  'use strict';
  const INK = '#141414';
  const O = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const O2 = `stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
  const FONT = `font-family="Pangolin, 'Comic Sans MS', cursive"`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rng = seed => { let s = 7; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
  const f1 = n => Math.round(n * 10) / 10;

  /* ---------------- backgrounds ---------------- */
  const sky = (id, top, bottom) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="400" height="300" fill="url(#${id})"/>`;
  const pine = (x, y, h, c = '#2e7d32', snow = false) => {
    const w = h * 0.42;
    let s = `<rect x="${f1(x - h * 0.05)}" y="${f1(y - h * 0.18)}" width="${f1(h * 0.1)}" height="${f1(h * 0.18)}" fill="#6d4c41" ${O2}/>`;
    for (let i = 0; i < 3; i++) {
      const ty = y - h * 0.15 - i * h * 0.27, tw = w * (1 - i * 0.22);
      s += `<path d="M${f1(x - tw)},${f1(ty)} L${f1(x)},${f1(ty - h * 0.42)} L${f1(x + tw)},${f1(ty)}Z" fill="${c}" ${O2}/>`;
      if (snow) s += `<path d="M${f1(x - tw * 0.45)},${f1(ty - h * 0.23)} L${f1(x)},${f1(ty - h * 0.42)} L${f1(x + tw * 0.45)},${f1(ty - h * 0.23)} Q${f1(x)},${f1(ty - h * 0.3)} ${f1(x - tw * 0.45)},${f1(ty - h * 0.23)}Z" fill="#fff"/>`;
    }
    return s;
  };
  const roundTree = (x, y, h) => `<rect x="${x - 6}" y="${y - h * 0.45}" width="12" height="${h * 0.45}" fill="#795548" ${O2}/><circle cx="${x}" cy="${y - h * 0.62}" r="${h * 0.3}" fill="#66bb6a" ${O2}/><circle cx="${x - h * 0.2}" cy="${y - h * 0.5}" r="${h * 0.2}" fill="#4caf50" ${O2}/><circle cx="${x + h * 0.2}" cy="${y - h * 0.5}" r="${h * 0.2}" fill="#4caf50" ${O2}/>`;
  const cloud = (x, y, k = 1) => `<g transform="translate(${x},${y}) scale(${k})"><path d="M-30,10 q-14,0 -12,-12 q2,-12 16,-10 q6,-16 24,-12 q14,2 16,16 q14,-2 16,10 q0,10 -12,8Z" fill="#fff" stroke="#b0bec5" stroke-width="2"/></g>`;

  const BG = {
    kitchen() {
      let s = `<rect width="400" height="300" fill="#fde7c8"/>`;
      s += `<rect x="16" y="12" width="190" height="72" rx="4" fill="#ffb74d" ${O}/><line x1="111" y1="12" x2="111" y2="84" ${O}/><circle cx="100" cy="50" r="3" fill="${INK}"/><circle cx="122" cy="50" r="3" fill="${INK}"/>`;
      s += `<rect x="256" y="18" width="112" height="84" rx="4" fill="#bfe6ff" ${O}/><line x1="312" y1="18" x2="312" y2="102" ${O}/><line x1="256" y1="60" x2="368" y2="60" ${O}/>`;
      s += `<path d="M246,12 h22 q-8,50 0,96 h-22z" fill="#ff8fb8" ${O}/><path d="M378,12 h-22 q8,50 0,96 h22z" fill="#ff8fb8" ${O}/>`;
      for (let x = 0; x < 400; x += 25) for (let y = 124; y < 196; y += 24) s += `<rect x="${x}" y="${y}" width="25" height="24" fill="${((x / 25) + (y - 124) / 24) % 2 ? '#ffffff' : '#e1f5fe'}" stroke="#cfd8dc" stroke-width="1"/>`;
      s += `<rect x="-5" y="194" width="410" height="14" fill="#a1887f" ${O}/><rect x="-5" y="208" width="410" height="100" fill="#ffcc80" ${O}/>`;
      for (let x = 0; x < 400; x += 80) s += `<rect x="${x + 8}" y="218" width="64" height="74" rx="3" fill="none" stroke="#d39a4f" stroke-width="3"/><circle cx="${x + 40}" cy="230" r="3" fill="#8d6e63"/>`;
      return { svg: s, ground: 292 };
    },
    lab(o) {
      // 💻 комп'ютерний клас: стіна в клітинку, велика дошка-екран із кодом, полиця з деталями
      let s = `<defs><pattern id="labgrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20,0 H0 V20" fill="none" stroke="#c5cae9" stroke-width="1"/></pattern></defs>`;
      s += `<rect width="400" height="300" fill="#eef1ff"/><rect width="400" height="232" fill="url(#labgrid)"/>`;
      s += `<rect x="96" y="26" width="208" height="122" rx="8" fill="#1d2433" ${O}/><rect x="96" y="26" width="208" height="18" rx="8" fill="#2f3b52"/><circle cx="110" cy="35" r="4" fill="#ff5f57"/><circle cx="123" cy="35" r="4" fill="#febc2e"/><circle cx="136" cy="35" r="4" fill="#28c840"/>`;
      const code = (o.code || ['gjenta 4 ganger:', '  gå fram', '  snu høyre', 'si("Hei!")']).slice(0, 5);
      code.forEach((ln, i) => { s += `<text x="110" y="${64 + i * 18}" font-family="ui-monospace, Consolas, monospace" font-weight="700" font-size="13" fill="${['#82aaff', '#c3e88d', '#c3e88d', '#ffcb6b', '#f78c6c'][i]}" xml:space="preserve">${esc(ln)}</text>`; });
      s += `<rect x="314" y="58" width="74" height="8" fill="#8d6e63" ${O2}/><circle cx="330" cy="48" r="9" fill="#ffd23f" ${O2}/><rect x="346" y="38" width="16" height="20" rx="3" fill="#4dd0e1" ${O2}/><path d="M372,58 l6,-18 l6,18Z" fill="#ff8a65" ${O2}/>`;
      s += `<rect x="12" y="40" width="70" height="52" rx="4" fill="#fff" ${O2}/><path d="M22,56 h18 v14 h18 v-8 h14" fill="none" stroke="#3949ab" stroke-width="3"/><circle cx="72" cy="62" r="4" fill="#e53935"/>`;
      s += `<rect x="-5" y="228" width="410" height="80" fill="#b0bec5" ${O}/>`;
      for (let x = 0; x < 400; x += 50) s += `<line x1="${x}" y1="228" x2="${x}" y2="300" stroke="#90a4ae" stroke-width="2"/>`;
      return { svg: s, ground: 292 };
    },
    school(o) {
      let s = `<rect width="400" height="300" fill="#e3f2fd"/>`;
      s += `<rect x="70" y="30" width="260" height="120" rx="4" fill="#2e7d32" stroke="#6d4c41" stroke-width="9"/>`;
      s += `<text x="200" y="104" text-anchor="middle" ${FONT} font-size="36" fill="#f1f8e9">${esc(o.board || 'Hei!')}</text>`;
      s += `<rect x="90" y="150" width="60" height="6" fill="#bcaaa4"/>`;
      const abc = ['A', 'B', 'C', 'D', 'Æ', 'Ø', 'Å'];
      abc.forEach((ch, i) => { const x = 22 + i * 54; s += `<rect x="${x}" y="170" width="34" height="38" rx="4" fill="${['#ffcdd2', '#fff9c4', '#c8e6c9', '#bbdefb', '#ffe0b2', '#e1bee7', '#b2ebf2'][i]}" ${O2}/><text x="${x + 17}" y="197" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="20" fill="${INK}">${ch}</text>`; });
      if (o.clock !== false) s += `<circle cx="365" cy="44" r="22" fill="#fff" ${O}/><path d="M365,44 V30 M365,44 H376" ${O}/>`;
      s += `<rect x="-5" y="226" width="410" height="80" fill="#d7a86e" ${O}/>`;
      for (let x = 0; x < 400; x += 57) s += `<line x1="${x}" y1="226" x2="${x - 30}" y2="300" stroke="#b9854a" stroke-width="2"/>`;
      return { svg: s, ground: 292 };
    },
    forest() {
      let s = sky('skyF', '#8fd3ff', '#e6f7ff');
      s += `<circle cx="340" cy="52" r="26" fill="#ffd54f" stroke="#ffb300" stroke-width="3"/>` + cloud(90, 50, 1) + cloud(230, 36, 0.8);
      s += `<path d="M-10,180 Q80,120 170,170 T410,150 V300 H-10Z" fill="#a5d6a7" stroke="#6a9d6c" stroke-width="3"/>`;
      [[40, 190, 70], [120, 176, 60], [210, 180, 66], [300, 170, 70], [370, 182, 58]].forEach(([x, y, hh]) => { s += pine(x, y, hh, '#66a36a'); });
      s += `<path d="M-10,222 Q200,200 410,222 V310 H-10Z" fill="#7cb342" ${O}/>`;
      s += `<path d="M150,302 Q190,262 176,224 L214,224 Q236,262 262,302Z" fill="#d7ccc8" stroke="#a1887f" stroke-width="2"/>`;
      s += pine(18, 262, 140, '#2e7d32') + pine(388, 266, 130, '#2e7d32');
      return { svg: s, ground: 290 };
    },
    shop() {
      const r = rng('shop');
      let s = `<rect width="400" height="300" fill="#fff8e1"/>`;
      const cols = ['#ef5350', '#42a5f5', '#66bb6a', '#ffca28', '#ab47bc', '#ff7043', '#26c6da'];
      [66, 128, 190].forEach(y => {
        let x = 14;
        while (x < 236) {
          const w = 18 + Math.floor(r() * 18), hh = 24 + Math.floor(r() * 26);
          if (x + w > 240) break;
          s += `<rect x="${x}" y="${y - hh}" width="${w}" height="${hh}" rx="3" fill="${cols[Math.floor(r() * cols.length)]}" ${O2}/><rect x="${x + 4}" y="${y - hh + 8}" width="${w - 8}" height="6" fill="#fff" opacity=".7"/>`;
          x += w + 4;
        }
        s += `<rect x="8" y="${y}" width="236" height="9" fill="#8d6e63" ${O2}/>`;
      });
      s += `<rect x="262" y="14" width="126" height="40" rx="6" fill="#e53935" ${O}/><text x="325" y="42" text-anchor="middle" font-family="Rubik, 'Arial Black', sans-serif" font-weight="900" font-size="22" fill="#fff">BUTIKK</text>`;
      s += `<circle cx="300" cy="100" r="16" fill="#ffca28" ${O2}/><text x="300" y="106" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="13">kr</text>`;
      for (let x = 0; x < 400; x += 40) for (let y = 230; y < 300; y += 35) s += `<rect x="${x}" y="${y}" width="40" height="35" fill="${((x / 40) + (y - 230) / 35) % 2 ? '#eceff1' : '#cfd8dc'}"/>`;
      s += `<line x1="0" y1="230" x2="400" y2="230" ${O}/>`;
      return { svg: s, ground: 292 };
    },
    winter() {
      let s = sky('skyW', '#b3dcff', '#eef7ff');
      s += cloud(70, 44, 1.1) + cloud(200, 30, 0.8);
      s += `<path d="M-10,190 Q90,140 200,178 T410,160 V300 H-10Z" fill="#f5fbff" stroke="#9fc4e0" stroke-width="3"/>`;
      s += `<rect x="286" y="118" width="104" height="96" fill="#e53935" ${O}/><path d="M276,124 L338,72 L400,124Z" fill="#fff" ${O}/><rect x="300" y="140" width="30" height="28" fill="#fff59d" ${O2}/><line x1="315" y1="140" x2="315" y2="168" ${O2}/><rect x="348" y="160" width="26" height="54" fill="#6d4c41" ${O2}/>`;
      s += pine(36, 214, 110, '#2e7d32', true) + pine(100, 200, 80, '#388e3c', true);
      s += `<path d="M-10,214 Q200,198 410,214 V310 H-10Z" fill="#ffffff" stroke="#9fc4e0" stroke-width="3"/>`;
      return { svg: s, ground: 290 };
    },
    /* Звичайна кімната (вдома, у школі, в бібліотеці): не кухня й не кабінет, тож
       підходить до розмов про безпеку, гроші, право — коли місце дії неважливе. */
    room() {
      let s = `<rect width="400" height="300" fill="#ede7f6"/>`;
      for (let x = 0; x < 400; x += 40) s += `<rect x="${x}" y="0" width="20" height="230" fill="#e3dcf3"/>`;
      s += `<rect x="20" y="40" width="96" height="150" rx="4" fill="#a1887f" ${O}/>`;
      for (const y of [76, 112, 148]) s += `<line x1="20" y1="${y}" x2="116" y2="${y}" ${O}/>`;
      const books = [['#ef5350', 12], ['#42a5f5', 10], ['#66bb6a', 14], ['#ffca28', 11], ['#ab47bc', 12]];
      for (const [row, y] of [[0, 46], [1, 82], [2, 118]]) {
        let x = 26 + row * 4;
        books.forEach(([c, w], i) => { if ((i + row) % 5 === 4) return; s += `<rect x="${x}" y="${y + (i % 2) * 4}" width="${w}" height="${26 - (i % 2) * 4}" fill="${c}" ${O2}/>`; x += w + 3; });
      }
      s += `<rect x="232" y="30" width="120" height="92" rx="4" fill="#bfe6ff" ${O}/><line x1="292" y1="30" x2="292" y2="122" ${O}/><line x1="232" y1="76" x2="352" y2="76" ${O}/>`;
      s += `<path d="M226,24 h24 q-8,54 0,104 h-24z" fill="#ffcc80" ${O}/><path d="M358,24 h-24 q8,54 0,104 h24z" fill="#ffcc80" ${O}/>`;
      s += `<rect x="148" y="52" width="58" height="44" fill="#fff" stroke="#8d6e63" stroke-width="5"/><path d="M152,92 L170,72 L184,84 L202,66 V92Z" fill="#81c784"/><circle cx="192" cy="62" r="6" fill="#ffca28"/>`;
      s += `<path d="M372,230 q-6,-40 8,-62 M372,230 q4,-46 -14,-70 M372,230 q10,-30 22,-44" fill="none" stroke="#388e3c" stroke-width="6" stroke-linecap="round"/><path d="M358,230 h28 l-4,22 h-20z" fill="#ff8a65" ${O}/>`;
      s += `<rect x="-5" y="230" width="410" height="76" fill="#d7b48a" ${O}/>`;
      for (let x = 0; x < 400; x += 56) s += `<line x1="${x}" y1="230" x2="${x - 20}" y2="300" stroke="#b98d5e" stroke-width="3"/>`;
      return { svg: s, ground: 292 };
    },
    home() {
      let s = `<rect width="400" height="300" fill="#e8f5e9"/>`;
      for (let x = 10; x < 400; x += 34) s += `<rect x="${x}" y="0" width="14" height="236" fill="#dcedc8"/>`;
      s += `<rect x="150" y="26" width="104" height="90" rx="4" fill="#bfe6ff" ${O}/><line x1="202" y1="26" x2="202" y2="116" ${O}/><line x1="150" y1="70" x2="254" y2="70" ${O}/>`;
      s += `<rect x="30" y="40" width="70" height="54" fill="#fff" stroke="#8d6e63" stroke-width="6"/><circle cx="54" cy="62" r="9" fill="#ffca28"/><path d="M34,90 L60,70 L78,84 L96,72 V90Z" fill="#81c784"/>`;
      s += `<path d="M330,236 V120 M312,120 H348 L340,92 H320Z" fill="#fff59d" ${O}/>`;
      s += `<rect x="-5" y="236" width="410" height="70" fill="#bcaaa4" ${O}/><ellipse cx="200" cy="270" rx="150" ry="18" fill="#ef9a9a" stroke="#c77" stroke-width="2"/>`;
      return { svg: s, ground: 292 };
    },
    park() {
      let s = sky('skyP', '#90d5ff', '#e8f8ff');
      s += `<circle cx="60" cy="54" r="26" fill="#ffd54f" stroke="#ffb300" stroke-width="3"/>` + cloud(250, 44, 1) + cloud(360, 70, 0.7);
      s += `<path d="M-10,196 Q120,170 250,190 T410,184 V300 H-10Z" fill="#9ccc65" stroke="#689f38" stroke-width="3"/>`;
      s += roundTree(40, 214, 130) + roundTree(360, 212, 120);
      for (let x = 70; x < 330; x += 22) s += `<rect x="${x}" y="180" width="8" height="34" fill="#fff" ${O2}/>`;
      s += `<rect x="64" y="190" width="272" height="7" fill="#fff" ${O2}/>`;
      s += `<path d="M-10,226 Q200,210 410,226 V310 H-10Z" fill="#8bc34a" ${O}/>`;
      return { svg: s, ground: 290 };
    },
    bus(o) {
      let s = `<rect width="400" height="300" fill="#cfd8dc"/>`;
      [10, 140, 270].forEach(x => {
        s += `<rect x="${x}" y="40" width="120" height="86" rx="6" fill="#b3e5fc" ${O}/>`;
        [[8, 34, 18, 52], [30, 20, 22, 66], [56, 44, 20, 42], [80, 28, 28, 58]].forEach(([dx, dy, w, hh]) => { s += `<rect x="${x + dx}" y="${40 + dy}" width="${w}" height="${hh - 2}" fill="#90a4ae"/>`; });
      });
      s += `<line x1="0" y1="34" x2="400" y2="34" stroke="#90a4ae" stroke-width="5"/>`;
      s += `<rect x="-5" y="140" width="112" height="70" rx="12" fill="#1565c0" ${O}/><rect x="295" y="140" width="112" height="70" rx="12" fill="#1565c0" ${O}/>`;
      s += `<rect x="132" y="34" width="8" height="258" fill="#ffd23f" ${O2}/><rect x="262" y="34" width="8" height="258" fill="#ffd23f" ${O2}/>`;
      s += `<rect x="-5" y="240" width="410" height="66" fill="#78909c" ${O}/>`;
      // табло зупинок — між поручнями, щоб його не закривали бульбашки
      const sign = String(o.sign || 'SENTRUM'), sw = Math.min(124, 20 + sign.length * 8.5), sfs = sign.length > 12 ? 9 : 12;
      s += `<rect x="${200 - sw / 2}" y="98" width="${sw}" height="24" rx="4" fill="#212121" ${O2}/><text x="200" y="114" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="${sfs}" fill="#ffb300">${esc(sign)}</text>`;
      for (let x = 10; x < 400; x += 40) s += `<circle cx="${x}" cy="270" r="3" fill="#607d8b"/>`;
      return { svg: s, ground: 292 };
    },
    street(o) {
      let s = sky('skyS', '#90d5ff', '#e8f8ff');
      s += cloud(320, 36, 0.8);
      const cols = ['#e53935', '#fdd835', '#fb8c00', '#6d4c41', '#fff3e0', '#c62828'];
      for (let i = 0; i < 6; i++) {
        const x = i * 68 - 4, hh = 118 + (i % 3) * 14, top = 232 - hh;
        s += `<rect x="${x}" y="${top}" width="66" height="${hh}" fill="${cols[i]}" ${O2}/><path d="M${x - 4},${top} L${x + 33},${top - 34} L${x + 70},${top}Z" fill="#5d4037" ${O2}/>`;
        s += `<rect x="${x + 12}" y="${top + 16}" width="16" height="20" fill="#fffde7" ${O2}/><rect x="${x + 38}" y="${top + 16}" width="16" height="20" fill="#fffde7" ${O2}/><rect x="${x + 12}" y="${top + 52}" width="16" height="20" fill="#fffde7" ${O2}/><rect x="${x + 38}" y="${top + 52}" width="16" height="20" fill="#fffde7" ${O2}/>`;
      }
      if (o.flags) {
        s += `<path d="M-10,34 Q200,90 410,34" fill="none" stroke="${INK}" stroke-width="2"/>`;
        for (let i = 0; i < 12; i++) { const t = (i + 0.5) / 12, x = -10 + 420 * t, y = 34 + 56 * 4 * t * (1 - t) * 0.5 + 0; s += `<path d="M${f1(x - 9)},${f1(y)} L${f1(x + 9)},${f1(y)} L${f1(x)},${f1(y + 20)}Z" fill="${i % 3 === 0 ? '#ba0c2f' : i % 3 === 1 ? '#fff' : '#00205b'}" ${O2}/>`; }
      }
      s += `<rect x="-5" y="232" width="410" height="74" fill="#bdbdbd" ${O}/>`;
      for (let x = 0; x < 400; x += 50) s += `<line x1="${x}" y1="232" x2="${x - 20}" y2="300" stroke="#9e9e9e" stroke-width="2"/>`;
      return { svg: s, ground: 292 };
    },
    mountain() {
      let s = sky('skyM', '#7ec8f5', '#e3f4ff');
      s += `<circle cx="330" cy="46" r="24" fill="#ffd54f" stroke="#ffb300" stroke-width="3"/>` + cloud(120, 40, 0.9);
      s += `<path d="M-10,190 L80,70 L150,150 L230,50 L320,160 L410,90 V230 H-10Z" fill="#78909c" ${O}/>`;
      s += `<path d="M62,94 L80,70 L98,94 L88,90 L80,98 L72,90Z M210,78 L230,50 L250,78 L238,74 L230,84 L222,74Z M392,112 L410,90 V114Z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
      s += `<path d="M-10,180 Q200,168 410,184 V222 H-10Z" fill="#4fc3f7" stroke="#0277bd" stroke-width="3"/>`;
      s += `<path d="M20,198 h40 M260,194 h50 M150,206 h30" stroke="#e1f5fe" stroke-width="3" stroke-linecap="round"/>`;
      s += `<path d="M-10,214 Q200,196 410,216 V310 H-10Z" fill="#8bc34a" ${O}/>`;
      s += pine(20, 262, 110, '#2e7d32') + pine(385, 266, 100, '#2e7d32');
      return { svg: s, ground: 290 };
    },
    office(o) {
      let s = `<rect width="400" height="300" fill="#e8eef3"/>`;
      s += `<rect x="18" y="26" width="120" height="96" rx="4" fill="#b3dcff" ${O}/>`;
      [[26, 70, 22, 52], [52, 50, 26, 72], [82, 64, 20, 58], [106, 44, 26, 78]].forEach(([x, y, w, hh]) => { s += `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#90a4ae" stroke="#607d8b" stroke-width="2"/>`; });
      s += `<line x1="78" y1="26" x2="78" y2="122" ${O}/><line x1="18" y1="74" x2="138" y2="74" ${O2}/>`;
      s += `<rect x="160" y="22" width="130" height="40" rx="6" fill="#37474f" ${O}/><text x="225" y="49" text-anchor="middle" font-family="Rubik, 'Arial Black', sans-serif" font-weight="900" font-size="${String(o.sign || 'KONTOR').length > 10 ? 13 : 17}" fill="#fff">${esc(o.sign || 'KONTOR')}</text>`;
      s += `<circle cx="352" cy="46" r="22" fill="#fff" ${O}/><path d="M352,46 V32 M352,46 H362" ${O}/>`;
      s += `<rect x="300" y="100" width="84" height="10" fill="#8d6e63" ${O2}/>`;
      [['#ef5350', 306], ['#42a5f5', 322], ['#66bb6a', 338], ['#ffca28', 354], ['#ab47bc', 368]].forEach(([c, x]) => { s += `<rect x="${x}" y="72" width="12" height="28" fill="${c}" ${O2}/>`; });
      s += `<rect x="-5" y="232" width="410" height="74" fill="#90a4ae" ${O}/>`;
      for (let x = 0; x < 400; x += 50) s += `<line x1="${x}" y1="232" x2="${x}" y2="300" stroke="#78909c" stroke-width="2"/>`;
      return { svg: s, ground: 292 };
    }
  };

  /* ---------------- props (0,0 = низ по центру) ---------------- */
  const P = {
    cake: o => `<g${o.skew ? ' transform="rotate(-7)"' : ''}><ellipse cx="0" cy="-3" rx="52" ry="9" fill="#fff" ${O}/><rect x="-40" y="-52" width="80" height="46" rx="8" fill="#8d5a3b" ${O}/><path d="M-40,-38 q10,12 20,0 t20,0 t20,0 t20,0 V-52 H-40Z" fill="#ffb3cf" ${O}/><circle cx="-20" cy="-26" r="4" fill="#ffca28"/><circle cx="8" cy="-20" r="4" fill="#4fc3f7"/><circle cx="26" cy="-30" r="4" fill="#ff7043"/><rect x="-3" y="-72" width="6" height="20" fill="#4fc3f7" ${O2}/><path d="M0,-88 q8,9 0,13 q-8,-4 0,-13Z" fill="#ffca28" stroke="#ff6f00" stroke-width="2"/></g>`,
    bowl: () => `<line x1="10" y1="-30" x2="34" y2="-70" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><line x1="10" y1="-30" x2="34" y2="-70" stroke="#a1887f" stroke-width="5" stroke-linecap="round"/><path d="M-38,-34 H38 Q34,0 0,0 Q-34,0 -38,-34Z" fill="#4fc3f7" ${O}/><ellipse cx="0" cy="-34" rx="38" ry="8" fill="#fff8e1" ${O}/>`,
    eggs: () => `<ellipse cx="-16" cy="-12" rx="10" ry="13" fill="#fffde7" ${O2}/><ellipse cx="4" cy="-13" rx="10" ry="13" fill="#fff" ${O2}/><ellipse cx="22" cy="-11" rx="9" ry="12" fill="#ffe0b2" ${O2}/>`,
    flour: () => `<path d="M-22,0 V-48 l6,-8 h32 l6,8 V0Z" fill="#fff" ${O}/><text x="0" y="-20" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="13" fill="${INK}">MEL</text>`,
    sugar: () => `<rect x="-16" y="-44" width="32" height="44" rx="5" fill="#fff" ${O}/><rect x="-18" y="-52" width="36" height="9" rx="3" fill="#90caf9" ${O2}/><text x="0" y="-18" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="8" fill="${INK}">SUKKER</text>`,
    butter: () => `<ellipse cx="0" cy="-4" rx="30" ry="6" fill="#fff" ${O2}/><rect x="-20" y="-24" width="40" height="18" rx="3" fill="#fff176" ${O}/>`,
    milk: () => `<path d="M-14,0 V-40 L-8,-52 H8 L14,-40 V0Z" fill="#e3f2fd" ${O}/><rect x="-12" y="-32" width="24" height="15" fill="#1e88e5"/><text x="0" y="-21" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="8" fill="#fff">MELK</text>`,
    bread: () => `<path d="M-32,0 Q-36,-30 0,-32 Q36,-30 32,0Z" fill="#d7a15b" ${O}/><path d="M-14,-24 l6,10 M0,-26 l6,10 M14,-24 l6,10" stroke="#8d5a3b" stroke-width="3" stroke-linecap="round"/>`,
    apples: o => { const n = o.n || 3; let s = ''; for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * 17, y = i % 2 ? -22 : -10; s += `<circle cx="${x}" cy="${y}" r="10" fill="#e53935" ${O2}/><path d="M${x},${y - 10} q4,-6 9,-5" stroke="#43a047" stroke-width="3" fill="none"/>`; } return s; },
    note: o => `<g transform="rotate(-8)"><rect x="-26" y="-30" width="52" height="28" rx="3" fill="#a5d6a7" ${O2}/><text x="0" y="-11" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="14" fill="#1b5e20">${esc(o.label || '100')}</text></g>`,
    coins: () => `<circle cx="-8" cy="-12" r="12" fill="#ffd54f" ${O2}/><circle cx="10" cy="-10" r="10" fill="#ffca28" ${O2}/><text x="-8" y="-8" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="10">20</text>`,
    backpack: () => `<path d="M-10,-52 q10,-14 20,0" fill="none" ${O}/><rect x="-22" y="-54" width="44" height="54" rx="12" fill="#ff7043" ${O}/><rect x="-14" y="-28" width="28" height="20" rx="5" fill="#ffab91" ${O2}/>`,
    desk: () => `<rect x="-58" y="-64" width="116" height="11" rx="3" fill="#bcaaa4" ${O}/><rect x="-50" y="-53" width="9" height="53" fill="#8d6e63" ${O2}/><rect x="41" y="-53" width="9" height="53" fill="#8d6e63" ${O2}/><rect x="-30" y="-74" width="36" height="10" rx="2" fill="#42a5f5" ${O2}/><rect x="10" y="-72" width="22" height="8" rx="2" fill="#ffca28" ${O2}/>`,
    table: () => `<rect x="-64" y="-58" width="128" height="12" rx="3" fill="#8d6e63" ${O}/><rect x="-54" y="-46" width="10" height="46" fill="#6d4c41" ${O2}/><rect x="44" y="-46" width="10" height="46" fill="#6d4c41" ${O2}/>`,
    counter: () => `<rect x="-80" y="-100" width="170" height="100" fill="#90a4ae" ${O}/><rect x="-86" y="-108" width="182" height="12" rx="3" fill="#607d8b" ${O}/><rect x="30" y="-146" width="52" height="38" rx="4" fill="#ffd54f" ${O}/><rect x="38" y="-140" width="36" height="12" fill="#263238"/><text x="56" y="-131" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="9" fill="#69f0ae">80 kr</text>`,
    ball: () => `<circle cx="0" cy="-16" r="16" fill="#fff" ${O}/><path d="M0,-23 l6,4 -2,7 h-8 l-2,-7Z" fill="${INK}"/>`,
    basket: o => `<path d="M-20,-30 q20,-34 40,0" fill="none" stroke="${INK}" stroke-width="8"/><path d="M-20,-30 q20,-34 40,0" fill="none" stroke="#c68b59" stroke-width="4"/>${o.berries ? '<circle cx="-10" cy="-32" r="6" fill="#3f51b5"/><circle cx="2" cy="-34" r="6" fill="#303f9f"/><circle cx="13" cy="-31" r="6" fill="#3f51b5"/>' : ''}<path d="M-26,-30 H26 L20,0 H-20Z" fill="#c68b59" ${O}/><path d="M-22,-18 H22 M-20,-8 H20" stroke="#8d5a3b" stroke-width="2"/>`,
    mushroom: () => `<rect x="-7" y="-26" width="14" height="26" rx="5" fill="#fff8e1" ${O}/><path d="M-26,-22 Q-26,-54 0,-54 Q26,-54 26,-22Z" fill="#e53935" ${O}/><circle cx="-11" cy="-38" r="4.5" fill="#fff"/><circle cx="8" cy="-44" r="4" fill="#fff"/><circle cx="14" cy="-30" r="3.5" fill="#fff"/>`,
    berries: () => { let s = `<path d="M-46,0 q-12,-42 20,-46 q22,-26 44,0 q32,4 22,46Z" fill="#43a047" ${O}/>`; [[-26, -24], [-8, -36], [10, -22], [26, -34], [-16, -10], [18, -8], [0, -14]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="6" fill="#3949ab" ${O2}/>`; }); return s; },
    umbrella: () => `<path d="M0,-60 V-4 q0,10 -10,10" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M-56,-60 Q0,-122 56,-60 q-14,-9 -28,0 q-14,-9 -28,0 q-14,-9 -28,0 q-14,-9 -28,0Z" fill="#ffca28" ${O}/>`,
    snowman: o => {
      const st = o.stage || 3;
      let s = `<circle cx="0" cy="-42" r="42" fill="#fff" ${O}/>`;
      if (st >= 2) s += `<circle cx="0" cy="-110" r="31" fill="#fff" ${O}/><circle cx="0" cy="-118" r="3.5" fill="${INK}"/><circle cx="0" cy="-102" r="3.5" fill="${INK}"/><path d="M-30,-112 L-62,-136 M-50,-127 L-58,-114" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/><path d="M30,-112 L62,-136" stroke="#6d4c41" stroke-width="4" stroke-linecap="round"/>`;
      if (st >= 3) s += `<circle cx="0" cy="-162" r="23" fill="#fff" ${O}/><circle cx="-8" cy="-167" r="3.5" fill="${INK}"/><circle cx="8" cy="-167" r="3.5" fill="${INK}"/><path d="M0,-160 L28,-156 L0,-153Z" fill="#ff7043" ${O2}/><path d="M-9,-150 q9,6 18,0" fill="none" ${O2}/><path d="M-22,-176 Q0,-212 22,-176Z" fill="#e53935" ${O}/><rect x="-24" y="-182" width="48" height="11" rx="4" fill="#fff59d" ${O2}/><circle cx="0" cy="-204" r="7" fill="#fff" ${O2}/>`;
      return s;
    },
    snowball: () => `<circle cx="0" cy="-12" r="12" fill="#fff" ${O}/>`,
    carrot: () => `<path d="M-22,-8 L24,-2 L-22,4Z" fill="#ff7043" ${O2}/><path d="M-22,-4 l-10,-8 M-22,-2 l-12,2 M-22,0 l-8,8" stroke="#43a047" stroke-width="3" stroke-linecap="round"/>`,
    mug: () => `<path d="M-8,-40 q-5,-8 0,-15 M4,-40 q-5,-8 0,-15" fill="none" stroke="#90a4ae" stroke-width="3" stroke-linecap="round"/><path d="M14,-26 q12,0 12,10 q0,10 -12,8" fill="none" ${O}/><path d="M-14,-32 h28 v26 q0,6 -6,6 h-16 q-6,0 -6,-6z" fill="#ef5350" ${O}/>`,
    elg: () => `<rect x="-44" y="-74" width="13" height="74" rx="4" fill="#4e342e" ${O2}/><rect x="-20" y="-74" width="13" height="74" rx="4" fill="#5d4037" ${O2}/><rect x="34" y="-74" width="13" height="74" rx="4" fill="#4e342e" ${O2}/><rect x="58" y="-74" width="13" height="74" rx="4" fill="#5d4037" ${O2}/><ellipse cx="14" cy="-98" rx="74" ry="38" fill="#6d4c41" ${O}/><path d="M-44,-116 L-76,-160 L-50,-170 L-24,-124Z" fill="#6d4c41" ${O}/><path d="M-84,-176 C-94,-212 -56,-220 -46,-194 L-54,-206 L-60,-192 L-70,-210 L-72,-190Z" fill="#d7ccc8" ${O2}/><path d="M-60,-172 C-40,-206 -6,-196 -14,-174 L-22,-186 L-28,-172 L-38,-188 L-44,-172Z" fill="#d7ccc8" ${O2}/><path d="M-64,-166 C-100,-172 -122,-156 -116,-140 C-108,-128 -86,-138 -60,-142Z" fill="#795548" ${O}/><circle cx="-80" cy="-160" r="3.5" fill="${INK}"/><path d="M-112,-146 q4,4 8,1" stroke="${INK}" stroke-width="2" fill="none"/><path d="M-70,-140 q-6,26 4,34" stroke="${INK}" stroke-width="3" fill="#5d4037"/>`,
    gift: () => `<rect x="-22" y="-40" width="44" height="40" fill="#ab47bc" ${O}/><rect x="-5" y="-40" width="10" height="40" fill="#ffca28"/><path d="M0,-40 q-20,-18 -18,-2 M0,-40 q20,-18 18,-2" fill="none" ${O}/>`,
    balloons: () => `<path d="M0,0 Q-10,-40 -22,-86 M0,0 Q2,-50 2,-108 M0,0 Q14,-40 26,-82" fill="none" stroke="${INK}" stroke-width="1.5"/><ellipse cx="-22" cy="-104" rx="17" ry="21" fill="#ef5350" ${O}/><ellipse cx="2" cy="-128" rx="17" ry="21" fill="#42a5f5" ${O}/><ellipse cx="26" cy="-100" rx="17" ry="21" fill="#ffca28" ${O}/><path d="M-28,-114 q3,-6 8,-6 M-4,-138 q3,-6 8,-6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    book: () => `<path d="M-30,0 L-30,-14 Q-15,-20 0,-14 Q15,-20 30,-14 L30,0 Q15,-6 0,0 Q-15,-6 -30,0Z" fill="#fff" ${O2}/><path d="M0,-14 V0" ${O2}/><path d="M-22,-9 h14 M8,-9 h14" stroke="#90a4ae" stroke-width="2"/>`,
    drawing: () => `<g transform="rotate(-6)"><rect x="-34" y="-50" width="68" height="50" fill="#fff" ${O}/><path d="M-16,-12 v-12 h26 v12 M-12,-24 l-8,-10 M10,-24 l6,-12 M-20,-34 l-4,-6 M-20,-34 l4,-6" stroke="#6d4c41" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="-40" r="6" fill="#ffca28"/></g>`,
    sofa: () => `<rect x="-90" y="-78" width="180" height="46" rx="14" fill="#7e57c2" ${O}/><rect x="-104" y="-56" width="30" height="48" rx="10" fill="#673ab7" ${O}/><rect x="74" y="-56" width="30" height="48" rx="10" fill="#673ab7" ${O}/><rect x="-78" y="-40" width="156" height="30" rx="8" fill="#9575cd" ${O}/><path d="M-82,-10 V0 M82,-10 V0" ${O}/>`,
    // 💻 предмети для «Програмування»: ноутбук із кодом, картка-команда, блоки як у Scratch, поле робота, лампочка-ідея
    laptop: o => `<path d="M-40,0 L-34,-8 H34 L40,0Z" fill="#90a4ae" ${O2}/><rect x="-32" y="-52" width="64" height="44" rx="4" fill="#1d2433" ${O}/>`
      + (o.text ? `<text x="0" y="-26" text-anchor="middle" font-family="ui-monospace, Consolas, monospace" font-weight="700" font-size="9" fill="#c3e88d">${esc(o.text)}</text>` : `<path d="M-24,-40 h22 M-20,-31 h30 M-20,-22 h16" stroke="#82aaff" stroke-width="3" stroke-linecap="round"/>`),
    codecard: o => {
      const t = String(o.text || 'gå fram'), w = Math.max(70, t.length * 8.2 + 22);
      return `<g transform="rotate(${o.tilt ?? -3})"><rect x="${f1(-w / 2)}" y="-40" width="${f1(w)}" height="34" rx="7" fill="${o.color || '#1d2433'}" ${O}/><text x="0" y="-18" text-anchor="middle" font-family="ui-monospace, Consolas, monospace" font-weight="700" font-size="14" fill="${o.ink || '#c3e88d'}">${esc(t)}</text></g>`;
    },
    blocks: o => {
      const items = (o.items || ['når 🚩 klikkes', 'gjenta 4', 'gå 10 steg']).slice(0, 4), col = ['#ffbf00', '#ffab19', '#4c97ff', '#9966ff'];
      return items.map((t, i) => {
        const y = -32 * (items.length - i), w = Math.max(90, String(t).length * 8 + 26), x = i && i < items.length - 1 ? -34 : -44;
        return `<path d="M${x},${y} h12 l4,5 h12 l4,-5 h${f1(w - 32)} v27 h${f1(-(w - 32))} l-4,5 h-12 l-4,-5 h-12Z" fill="${col[i % 4]}" ${O2}/><text x="${x + 10}" y="${y + 18}" font-family="Rubik, sans-serif" font-weight="700" font-size="12" fill="#fff">${esc(t)}</text>`;
      }).join('');
    },
    robotgrid: o => {
      // 4×4 поле: робот, стіни, зірка; path — маршрут пунктиром
      const n = 4, k = 22, ox = -n * k / 2, oy = -n * k - 6;
      let s = `<rect x="${ox - 6}" y="${oy - 6}" width="${n * k + 12}" height="${n * k + 12}" rx="6" fill="#fff" ${O}/>`;
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) s += `<rect x="${ox + c * k}" y="${oy + r * k}" width="${k}" height="${k}" fill="${(r + c) % 2 ? '#e8eaf6' : '#f5f7ff'}" stroke="#9fa8da" stroke-width="1"/>`;
      const cell = ([c, r]) => [ox + c * k + k / 2, oy + r * k + k / 2];
      (o.walls || [[2, 1]]).forEach(w => { const [x, y] = cell(w); s += `<rect x="${x - k / 2 + 1}" y="${y - k / 2 + 1}" width="${k - 2}" height="${k - 2}" fill="#8d6e63"/>`; });
      if (o.path) s += `<path d="M${o.path.map(p => cell(p).join(',')).join(' L')}" fill="none" stroke="#e53935" stroke-width="3" stroke-dasharray="4 4"/>`;
      const [sx, sy] = cell(o.star || [3, 0]); s += `<text x="${sx}" y="${sy + 7}" text-anchor="middle" font-size="18">⭐</text>`;
      const [rx, ry] = cell(o.robot || [0, 3]); s += `<text x="${rx}" y="${ry + 7}" text-anchor="middle" font-size="18">🤖</text>`;
      return s;
    },
    bulb: () => `<path d="M-14,-46 a18,18 0 1 1 28,0 q-6,6 -6,14 h-16 q0,-8 -6,-14Z" fill="#fff59d" ${O}/><rect x="-8" y="-32" width="16" height="10" rx="2" fill="#b0bec5" ${O2}/><path d="M-22,-74 l-8,-6 M22,-74 l8,-6 M0,-84 v-10" stroke="#ffb300" stroke-width="3" stroke-linecap="round"/>`,
    /* 🌐 вікно браузера з готовою сторінкою: items — елементи HTML, які сторінка показує
       ({ t: 'h1'|'p'|'img'|'a'|'ul'|'btn', x: текст }), url — адреса. Ним же малюємо
       варіанти відповіді в тесті «Як виглядатиме сторінка?» (KomiksKoding). */
    browser: o => {
      const W = o.w || 176, H = o.h || 128, x0 = -W / 2, y0 = -H;
      const mono = 'font-family="ui-monospace, Consolas, monospace"', rub = 'font-family="Rubik, sans-serif"';
      let s = `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" rx="9" fill="#fff" ${O}/>`;
      s += `<rect x="${x0 + 2}" y="${y0 + 2}" width="${W - 4}" height="17" rx="7" fill="#e8eaf6"/><path d="M${x0},${y0 + 19} h${W}" stroke="${INK}" stroke-width="2"/>`;
      s += `<circle cx="${x0 + 9}" cy="${y0 + 10}" r="2.8" fill="#ff5f57"/><circle cx="${x0 + 17}" cy="${y0 + 10}" r="2.8" fill="#febc2e"/><circle cx="${x0 + 25}" cy="${y0 + 10}" r="2.8" fill="#28c840"/>`;
      s += `<rect x="${x0 + 34}" y="${y0 + 5}" width="${W - 42}" height="10" rx="5" fill="#fff" stroke="#9fa8da" stroke-width="1"/><text x="${x0 + 39}" y="${y0 + 13}" ${mono} font-size="7" fill="#5c6bc0">${esc(o.url || 'pus.html')}</text>`;
      let y = y0 + 26;
      const L = x0 + 10;
      for (const it of o.items || [{ t: 'h1', x: 'Pus' }, { t: 'p' }, { t: 'img' }]) {
        if (y > -8) break;
        if (it.t === 'h1') { s += `<text x="${L}" y="${y + 14}" ${rub} font-weight="900" font-size="17" fill="${INK}">${esc(it.x || 'Overskrift')}</text>`; y += 22; }
        else if (it.t === 'p') {
          if (it.x) { s += `<text x="${L}" y="${y + 9}" ${rub} font-size="9" fill="#37474f">${esc(it.x)}</text>`; y += 14; }
          else { s += `<path d="M${L},${y + 4} h${W - 26} M${L},${y + 11} h${W - 52}" stroke="#b0bec5" stroke-width="4" stroke-linecap="round"/>`; y += 18; }
        }
        else if (it.t === 'img') { s += `<rect x="${L}" y="${y}" width="58" height="38" rx="4" fill="#bbdefb" stroke="#64b5f6" stroke-width="1.5"/><text x="${L + 29}" y="${y + 28}" text-anchor="middle" font-size="22">${it.x || '🐱'}</text>`; y += 44; }
        else if (it.t === 'a') { s += `<text x="${L}" y="${y + 10}" ${rub} font-weight="700" font-size="10" fill="#1e63d6" text-decoration="underline">${esc(it.x || 'Les mer')}</text><path d="M${L},${y + 12} h${(it.x || 'Les mer').length * 5.6}" stroke="#1e63d6" stroke-width="1.2"/>`; y += 16; }
        else if (it.t === 'btn') { const t = it.x || 'Klikk!', bw = t.length * 6.5 + 18; s += `<rect x="${L}" y="${y}" width="${bw}" height="16" rx="8" fill="#ffd23f" stroke="${INK}" stroke-width="1.5"/><text x="${L + bw / 2}" y="${y + 11}" text-anchor="middle" ${rub} font-weight="800" font-size="9" fill="${INK}">${esc(t)}</text>`; y += 22; }
        else if (it.t === 'ul') { for (let i = 0; i < 3; i++) s += `<circle cx="${L + 3}" cy="${y + 5 + i * 9}" r="2.2" fill="${INK}"/><path d="M${L + 10},${y + 5 + i * 9} h${44 - i * 8}" stroke="#b0bec5" stroke-width="3.5" stroke-linecap="round"/>`; y += 30; }
      }
      return s;
    },
    // 🏷️ HTML-тег: відкривальний тег, вміст і закривальний тег окремими картками
    tagpair: o => {
      const tag = o.tag || 'p', t = o.text ?? 'Hei!', a = `<${tag}>`, b = `</${tag}>`;
      const wa = a.length * 9 + 16, wt = Math.max(30, String(t).length * 8.5 + 16), wb = b.length * 9 + 16, gap = 6, tot = wa + wt + wb + gap * 2;
      let x = -tot / 2;
      const card = (w, fill, ink, txt, mono = true) => { const r = `<rect x="${f1(x)}" y="-40" width="${f1(w)}" height="32" rx="7" fill="${fill}" ${O}/><text x="${f1(x + w / 2)}" y="-19" text-anchor="middle" ${mono ? 'font-family="ui-monospace, Consolas, monospace"' : 'font-family="Rubik, sans-serif"'} font-weight="800" font-size="15" fill="${ink}">${esc(txt)}</text>`; x += w + gap; return r; };
      return card(wa, '#3949ab', '#fff', a) + card(wt, '#fff', INK, t, false) + card(wb, '#e53935', '#fff', b);
    },
    csscard: (o = {}) => `<rect x="-88" y="-118" width="176" height="112" rx="10" fill="#1d2433" ${O}/><text x="-72" y="-78" font-family="monospace" font-size="12" font-weight="800" fill="#82aaff">h1 {</text><text x="-59" y="-56" font-family="monospace" font-size="12" font-weight="800" fill="#c3e88d">color: ${esc(o.color || '#7c4dff')};</text><text x="-72" y="-34" font-family="monospace" font-size="12" font-weight="800" fill="#82aaff">}</text><rect x="22" y="-82" width="54" height="48" rx="8" fill="#fff" ${O2}/><text x="49" y="-51" text-anchor="middle" font-family="Rubik,sans-serif" font-size="15" font-weight="900" fill="${o.color || '#7c4dff'}">${esc(o.label || 'Pus')}</text>`,
    gameview: (o = {}) => `<rect x="-112" y="-132" width="224" height="126" rx="10" fill="#8ed8ff" ${O}/><circle cx="72" cy="-104" r="17" fill="#fff176"/><path d="M-110,-44 Q-70,-70 -30,-45 T55,-48 T112,-42 V-6 H-112Z" fill="#70c56a"/><rect x="-94" y="-30" width="62" height="12" rx="4" fill="#8d6e63" ${O2}/><rect x="14" y="-55" width="58" height="12" rx="4" fill="#8d6e63" ${O2}/><text x="-62" y="-38" text-anchor="middle" font-size="28">${o.player || '🦊'}</text><text x="72" y="-63" text-anchor="middle" font-size="25">⭐</text><rect x="-103" y="-123" width="74" height="22" rx="7" fill="#1d2433"/><text x="-66" y="-108" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">POENG ${o.score ?? 3}</text>${o.collision ? '<path d="M-8,-58 l12,-13 l4,17 l17,-7 l-8,17 l17,5 l-18,6" fill="#ffd23f" stroke="#141414" stroke-width="3"/>' : ''}`,
    blender: (o = {}) => { const col = o.color || '#ff9f43'; const mesh = o.shape === 'sphere' ? `<circle cx="0" cy="-61" r="31" fill="${col}" ${O}/><ellipse cx="0" cy="-61" rx="31" ry="12" fill="none" stroke="#fff" stroke-width="2"/>` : `<path d="M-31,-80 l34,-19 l34,19 l-34,20Z" fill="#ffd39a" ${O2}/><path d="M-31,-80 v39 l34,20 v-39Z" fill="${col}" ${O2}/><path d="M37,-80 v39 l-34,20 v-39Z" fill="#e67e22" ${O2}/>`; return `<rect x="-112" y="-132" width="224" height="126" rx="10" fill="#333842" ${O}/><path d="M-108,-34 H108 M-108,-52 H108 M-108,-70 H108 M-108,-88 H108 M-75,-128 V-8 M-38,-128 V-8 M0,-128 V-8 M38,-128 V-8 M75,-128 V-8" stroke="#59616f"/>${mesh}<path d="M3,-60 h54" stroke="#e53935" stroke-width="3"/><path d="M3,-60 v-51" stroke="#43a047" stroke-width="3"/><text x="-101" y="-114" font-size="11" font-weight="900" fill="#fff">3D VIEWPORT</text>`; },
    unity: (o = {}) => `<rect x="-118" y="-136" width="236" height="132" rx="9" fill="#25282d" ${O}/><rect x="-112" y="-116" width="54" height="106" rx="4" fill="#34383f"/><rect x="60" y="-116" width="52" height="106" rx="4" fill="#34383f"/><rect x="-52" y="-116" width="106" height="106" rx="4" fill="#87ceeb"/><path d="M-51,-36 Q-15,-55 12,-38 T54,-38 V-10 H-52Z" fill="#61b15a"/><text x="1" y="-48" text-anchor="middle" font-size="31">🦊</text><text x="-105" y="-99" font-size="9" font-weight="900" fill="#fff">HIERARKI</text><text x="-98" y="-63" font-size="9" fill="#9de2ff">● ${esc(o.label || 'Player')}</text><text x="66" y="-99" font-size="9" font-weight="900" fill="#fff">INSPECTOR</text><rect x="66" y="-86" width="40" height="18" rx="3" fill="#4b515b"/><rect x="66" y="-62" width="40" height="18" rx="3" fill="#4b515b"/>${o.prefab ? '<path d="M-18,-91 l18,-11 l18,11 l-18,11Z" fill="#7c8cff" stroke="#fff" stroke-width="2"/>' : ''}`,
    database: (o = {}) => { const rows = o.rows || [['1','Nora','8'],['2','Leo','6'],['3','Ali','9']]; let s = `<ellipse cx="0" cy="-108" rx="79" ry="21" fill="#72b7ff" ${O}/><path d="M-79,-108 v79 c0,12 35,21 79,21 s79,-9 79,-21 v-79" fill="#4d96e8" ${O}/><rect x="-67" y="-99" width="134" height="72" rx="5" fill="#fff" ${O2}/><rect x="-67" y="-99" width="134" height="20" rx="5" fill="#283593"/>`; rows.slice(0,3).forEach((r,i)=>{const y=-64+i*17;s+=`<rect x="-65" y="${y-12}" width="130" height="16" fill="${o.highlight===i?'#fff3b0':i%2?'#eef4ff':'#fff'}"/><text x="-49" y="${y}" font-size="9">${esc(r[0])}</text><text x="-11" y="${y}" font-size="9">${esc(r[1])}</text><text x="45" y="${y}" font-size="9">${esc(r[2])}</text>`;}); return s; },
    datashield: () => `<path d="M0,-118 C28,-108 48,-108 62,-108 v42 c0,35 -22,55 -62,68 c-40,-13 -62,-33 -62,-68 v-42 c14,0 34,0 62,-10Z" fill="#43a047" ${O}/><rect x="-22" y="-76" width="44" height="36" rx="8" fill="#fff" ${O2}/><path d="M-14,-76 v-12 a14,14 0 0 1 28,0 v12" fill="none" stroke="#141414" stroke-width="7"/><circle cx="0" cy="-58" r="5" fill="#43a047"/>`,
    computer: () => `<rect x="-34" y="-62" width="68" height="46" rx="4" fill="#263238" ${O}/><rect x="-28" y="-56" width="56" height="34" fill="#80deea"/><path d="M-22,-44 h30 M-22,-36 h40 M-22,-28 h22" stroke="#006064" stroke-width="3"/><rect x="-6" y="-16" width="12" height="10" fill="#607d8b" ${O2}/><rect x="-26" y="-6" width="52" height="6" rx="2" fill="#90a4ae" ${O2}/>`,
    officedesk: () => `<rect x="-70" y="-66" width="140" height="12" rx="3" fill="#a1887f" ${O}/><rect x="-62" y="-54" width="12" height="54" fill="#8d6e63" ${O2}/><rect x="50" y="-54" width="12" height="54" fill="#8d6e63" ${O2}/><g transform="translate(-10,-66) scale(.8)">${P.computer()}</g><rect x="30" y="-76" width="26" height="10" fill="#fff" ${O2}/>`,
    plant: () => `<path d="M0,-40 C-30,-60 -34,-90 -8,-96 C-6,-70 -2,-60 0,-40 C4,-66 12,-96 34,-90 C34,-64 14,-50 0,-40Z" fill="#43a047" ${O2}/><path d="M-18,-42 H18 L12,0 H-12Z" fill="#ff7043" ${O}/>`,
    // спорткар (color — колір кузова, speed — лінії руху позаду)
    car: (o = {}) => { const col = o.color || '#e53935'; return `${o.speed ? '<path d="M-150,-40 h-40 M-146,-60 h-60 M-150,-22 h-30" stroke="#90a4ae" stroke-width="5" stroke-linecap="round"/>' : ''}<path d="M-128,-18 C-130,-40 -118,-50 -96,-54 L-54,-60 C-36,-86 -8,-96 26,-94 C58,-92 80,-78 98,-60 L120,-56 C134,-52 138,-38 134,-18 Z" fill="${col}" ${O}/><path d="M-44,-62 C-28,-84 -4,-88 22,-86 L20,-62 Z" fill="#b3e5fc" ${O2}/><path d="M30,-86 C52,-84 70,-74 84,-62 L30,-62 Z" fill="#b3e5fc" ${O2}/><path d="M-120,-34 h26" stroke="#fff176" stroke-width="7" stroke-linecap="round"/><rect x="118" y="-44" width="14" height="10" rx="3" fill="#ff8a80" ${O2}/><path d="M-100,-40 H110" stroke="rgba(0,0,0,.25)" stroke-width="3"/><circle cx="-78" cy="-14" r="22" fill="#263238" ${O}/><circle cx="-78" cy="-14" r="9" fill="#cfd8dc" ${O2}/><circle cx="80" cy="-14" r="22" fill="#263238" ${O}/><circle cx="80" cy="-14" r="9" fill="#cfd8dc" ${O2}/>`; },
    // велосипед (studs — шипи на шинах для зими)
    bike: (o = {}) => { const col = o.color || '#00897b'; const wheel = cx => `<circle cx="${cx}" cy="-34" r="32" fill="none" stroke="${INK}" stroke-width="7"/><circle cx="${cx}" cy="-34" r="32" fill="none" stroke="#455a64" stroke-width="3"/><circle cx="${cx}" cy="-34" r="4" fill="${INK}"/>${o.studs ? Array.from({ length: 12 }, (_, i) => `<circle cx="${(cx + 35 * Math.cos(i * Math.PI / 6)).toFixed(1)}" cy="${(-34 + 35 * Math.sin(i * Math.PI / 6)).toFixed(1)}" r="2.6" fill="#cfd8dc" stroke="${INK}" stroke-width="1"/>`).join('') : ''}`; return `${wheel(-56)}${wheel(56)}<path d="M-56,-34 L-18,-34 L22,-84 L-28,-84 Z M-18,-34 L-34,-96 M22,-84 L56,-34 M22,-84 L30,-108" fill="none" stroke="${INK}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/><path d="M-56,-34 L-18,-34 L22,-84 L-28,-84 Z M-18,-34 L-34,-96 M22,-84 L56,-34 M22,-84 L30,-108" fill="none" stroke="${col}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><path d="M-46,-98 h26" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M20,-110 h22" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`; },
    // знак обмеження швидкості
    speedsign: (o = {}) => `<rect x="-4" y="-150" width="8" height="150" fill="#9e9e9e" ${O2}/><circle cx="0" cy="-160" r="30" fill="#fff" stroke="#e53935" stroke-width="9"/><circle cx="0" cy="-160" r="34" fill="none" ${O2}/><text x="0" y="-151" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="26" fill="${INK}">${esc(String(o.label || '80'))}</text>`,
    keys: () => `<circle cx="-8" cy="-14" r="10" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="-8" cy="-14" r="10" fill="none" stroke="#ffca28" stroke-width="3"/><path d="M0,-12 H26 M18,-12 v8 M24,-12 v6" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><path d="M0,-12 H26 M18,-12 v8 M24,-12 v6" stroke="#ffca28" stroke-width="3" stroke-linecap="round"/>`,
    boxes: () => `<rect x="-44" y="-40" width="50" height="40" fill="#d7a86e" ${O}/><rect x="0" y="-34" width="44" height="34" fill="#c68b59" ${O}/><rect x="-26" y="-72" width="44" height="32" fill="#e0b27a" ${O}/><path d="M-44,-28 H6 M0,-24 H44 M-26,-60 H18" stroke="#8d5a3b" stroke-width="2"/>`,
    rake: () => `<path d="M0,0 L0,-120" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M0,0 L0,-120" stroke="#a1887f" stroke-width="4" stroke-linecap="round"/><path d="M-26,-120 H26 M-24,-120 v12 M-12,-120 v12 M0,-120 v12 M12,-120 v12 M24,-120 v12" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
    trashbag: () => `<path d="M-26,0 Q-34,-40 -12,-50 L-6,-60 L6,-60 L12,-50 Q34,-40 26,0Z" fill="#37474f" ${O}/><path d="M-6,-60 l-6,-8 M6,-60 l6,-8" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M-14,-30 q6,4 12,0" stroke="#78909c" stroke-width="2" fill="none"/>`,
    phone: () => `<rect x="-14" y="-50" width="28" height="50" rx="6" fill="#263238" ${O}/><rect x="-10" y="-44" width="20" height="34" fill="#a5d6a7"/><path d="M-6,-32 l4,4 8,-10" stroke="#1b5e20" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    docs: () => `<g transform="rotate(-6)"><rect x="-24" y="-34" width="48" height="34" fill="#fff" ${O2}/><path d="M-16,-26 h32 M-16,-18 h32 M-16,-10 h20" stroke="#90a4ae" stroke-width="2"/></g>`,
    waffles: () => `<ellipse cx="0" cy="-4" rx="36" ry="7" fill="#fff" ${O2}/><path d="M-26,-8 C-30,-26 -10,-30 -2,-18 C6,-30 26,-26 22,-8Z" fill="#f4b860" ${O2}/><path d="M-18,-12 l8,-10 M-8,-10 l8,-10 M4,-10 l8,-10 M-20,-16 h36" stroke="#c98a2b" stroke-width="2"/><circle cx="-6" cy="-24" r="4" fill="#e53935"/>`,
    clock: o => {
      const [hh, mm] = String(o.time || '12:00').split(':').map(Number);
      const ha = ((hh % 12) + mm / 60) * 30 * Math.PI / 180, ma = mm * 6 * Math.PI / 180;
      let s = `<circle cx="0" cy="-34" r="32" fill="#fff" ${O}/>`;
      for (let k = 0; k < 12; k++) { const a = k * 30 * Math.PI / 180; s += `<line x1="${f1(Math.sin(a) * 26)}" y1="${f1(-34 - Math.cos(a) * 26)}" x2="${f1(Math.sin(a) * 30)}" y2="${f1(-34 - Math.cos(a) * 30)}" stroke="${INK}" stroke-width="${k % 3 ? 2 : 4}"/>`; }
      s += `<line x1="0" y1="-34" x2="${f1(Math.sin(ha) * 16)}" y2="${f1(-34 - Math.cos(ha) * 16)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
      s += `<line x1="0" y1="-34" x2="${f1(Math.sin(ma) * 24)}" y2="${f1(-34 - Math.cos(ma) * 24)}" stroke="#e53935" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="-34" r="3.5" fill="${INK}"/>`;
      if (o.pole) s = `<rect x="-4" y="${-o.pole}" width="8" height="${o.pole}" fill="#455a64" ${O2}/><g transform="translate(0,${-o.pole})">${s}</g>`;
      return s;
    },
    flag: () => `<line x1="0" y1="0" x2="0" y2="-96" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><rect x="0" y="-96" width="46" height="32" fill="#ba0c2f" ${O2}/><rect x="12" y="-96" width="9" height="32" fill="#fff"/><rect x="0" y="-84" width="46" height="9" fill="#fff"/><rect x="14.5" y="-96" width="4" height="32" fill="#00205b"/><rect x="0" y="-81.5" width="46" height="4" fill="#00205b"/><rect x="0" y="-96" width="46" height="32" fill="none" ${O2}/>`,
    xmastree: () => `<rect x="-10" y="-26" width="20" height="26" fill="#6d4c41" ${O2}/><path d="M-62,-26 L0,-86 L62,-26Z M-50,-70 L0,-124 L50,-70Z M-36,-110 L0,-156 L36,-110Z" fill="#2e7d32" ${O}/><path d="M0,-172 l6,12 13,1 -10,9 3,13 -12,-7 -12,7 3,-13 -10,-9 13,-1Z" fill="#ffd23f" ${O2}/><circle cx="-24" cy="-40" r="6" fill="#e53935" ${O2}/><circle cx="20" cy="-52" r="6" fill="#42a5f5" ${O2}/><circle cx="-10" cy="-90" r="6" fill="#ffca28" ${O2}/><circle cx="18" cy="-96" r="5" fill="#e53935" ${O2}/><circle cx="-6" cy="-128" r="5" fill="#ab47bc" ${O2}/>`,
    tent: () => `<path d="M-62,0 L0,-78 L62,0Z" fill="#ff7043" ${O}/><path d="M-18,0 L0,-40 L18,0Z" fill="#5d4037" ${O2}/><path d="M0,-78 V-92 M0,-92 l14,6 -14,6" stroke="${INK}" stroke-width="3" fill="#ffd23f"/>`,
    cheese: () => `<ellipse cx="0" cy="-4" rx="34" ry="7" fill="#fff" ${O2}/><path d="M-24,-8 V-34 L-12,-42 H26 V-16 L14,-8Z" fill="#c1782f" ${O}/><path d="M-24,-34 L-12,-42 H26 L14,-34Z" fill="#d99550" ${O2}/><path d="M-4,-30 h14 M-8,-22 h18" stroke="#8d5524" stroke-width="2"/>`,
    icecream: () => `<path d="M-12,-40 L0,0 L12,-40Z" fill="#e0a95b" ${O}/><circle cx="0" cy="-48" r="14" fill="#f8bbd0" ${O2}/><circle cx="-6" cy="-62" r="10" fill="#fff9c4" ${O2}/><circle cx="7" cy="-62" r="10" fill="#8d6e63" ${O2}/>`,
    thermos: () => `<rect x="-14" y="-62" width="28" height="62" rx="8" fill="#43a047" ${O}/><rect x="-16" y="-72" width="32" height="14" rx="4" fill="#9e9e9e" ${O2}/><rect x="-14" y="-40" width="28" height="8" fill="#a5d6a7"/><path d="M-6,-80 q-4,-8 0,-14 M6,-80 q-4,-8 0,-14" stroke="#90a4ae" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    busstop: (o = {}) => `<rect x="-4" y="-150" width="8" height="150" fill="#9e9e9e" ${O2}/><rect x="-30" y="-152" width="60" height="44" rx="6" fill="#fdd835" ${O}/><rect x="-22" y="-146" width="44" height="20" rx="3" fill="#2e7d32"/><text x="0" y="-131" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="12" fill="#fff">${esc(o.label || 'BUSS')}</text><text x="0" y="-114" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="10" fill="${INK}">31 · 70</text>`,
    glass: () => `<path d="M-10,-30 H10 L8,0 H-8Z" fill="#fff" ${O2}/><path d="M-9,-20 H9 L8,-1 H-8Z" fill="#fffde7"/>`,
    passport: () => `<rect x="-18" y="-50" width="36" height="50" rx="4" fill="#8e1b2c" ${O}/><circle cx="0" cy="-30" r="9" fill="none" stroke="#f4c542" stroke-width="2.5"/><path d="M-6,-30 h12 M0,-36 v12" stroke="#f4c542" stroke-width="2"/><rect x="-11" y="-14" width="22" height="4" rx="2" fill="#f4c542"/>`,
    stetoskop: () => `<path d="M-14,-40 Q-18,-10 0,-6 Q18,-10 14,-40" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="0" cy="-6" r="6" fill="#90a4ae" ${O2}/>`
  };

  /* ---------------- faces ---------------- */
  const eyes = mood => {
    const pair = f => f(-11) + f(11);
    if (mood === 'happy' || mood === 'grin') return pair(x => `<path d="M${x - 6},-1 q6,-8 12,0" fill="none" ${O}/>`);
    if (mood === 'surprised') return pair(x => `<circle cx="${x}" cy="-3" r="7" fill="#fff" ${O2}/><circle cx="${x}" cy="-3" r="3" fill="${INK}"/>`);
    if (mood === 'think') return pair(x => `<ellipse cx="${x + 2}" cy="-5" rx="3.6" ry="4.6" fill="${INK}"/>`) + `<path d="M-18,-14 L-6,-13 M6,-17 Q12,-21 18,-16" ${O}/>`;
    let s = pair(x => `<ellipse cx="${x}" cy="-2" rx="3.8" ry="5.2" fill="${INK}"/><circle cx="${x + 1.3}" cy="-4" r="1.4" fill="#fff"/>`);
    if (mood === 'sad') s += `<path d="M-18,-13 L-6,-10 M18,-13 L6,-10" ${O}/>`;
    if (mood === 'angry') s += `<path d="M-18,-10 L-6,-14 M18,-10 L6,-14" ${O}/>`;
    return s;
  };
  const mouth = mood => ({
    happy: `<path d="M-9,10 q9,9 18,0" fill="none" ${O}/>`,
    grin: `<path d="M-12,8 q12,17 24,0Z" fill="#c62828" ${O}/><path d="M-6,14 q6,4 12,0" fill="#ff8a80"/>`,
    surprised: `<ellipse cx="0" cy="14" rx="5.5" ry="7.5" fill="#7f1d1d" ${O2}/>`,
    sad: `<path d="M-8,17 q8,-8 16,0" fill="none" ${O}/>`,
    angry: `<path d="M-8,14 q8,-4 16,0" fill="none" ${O}/>`,
    think: `<path d="M-4,13 q6,-1 11,-4" fill="none" ${O}/>`
  }[mood] || `<path d="M-7,12 q7,5 14,0" fill="none" ${O}/>`);
  const HAIR = {
    short: h => `<path d="M-31,-2 C-35,-42 35,-42 31,-2 C25,-20 9,-24 0,-18 C-10,-26 -25,-20 -31,-2Z" fill="${h}" ${O}/>`,
    spiky: h => `<path d="M-31,0 C-36,-26 -24,-40 -10,-40 L-6,-48 L2,-39 L12,-45 L14,-35 C28,-34 36,-20 31,0 C26,-12 20,-18 12,-16 L8,-24 L0,-15 L-8,-22 L-14,-14 C-22,-16 -28,-10 -31,0Z" fill="${h}" ${O}/>`,
    pigtails: (h, a) => `<path d="M-32,2 C-36,-44 36,-44 32,2 C26,-18 5,-22 0,-28 C-5,-22 -26,-18 -32,2Z" fill="${h}" ${O}/><circle cx="-29" cy="-2" r="4.5" fill="${a}" ${O2}/><circle cx="29" cy="-2" r="4.5" fill="${a}" ${O2}/>`,
    long: h => `<path d="M-32,4 C-36,-44 36,-44 32,4 C28,-16 10,-24 -2,-24 C-14,-22 -28,-14 -32,4Z" fill="${h}" ${O}/>`,
    bun: h => `<circle cx="0" cy="-36" r="13" fill="${h}" ${O}/><path d="M-31,-2 C-35,-42 35,-42 31,-2 C24,-20 -24,-20 -31,-2Z" fill="${h}" ${O}/>`,
    curly: h => { let s = ''; for (let a = 190; a <= 350; a += 20) { const r = a * Math.PI / 180; s += `<circle cx="${f1(Math.cos(r) * 28)}" cy="${f1(Math.sin(r) * 28 - 2)}" r="11" fill="${h}" ${O2}/>`; } return s + `<path d="M-26,-8 C-20,-30 20,-30 26,-8 C14,-18 -14,-18 -26,-8Z" fill="${h}"/>`; },
    bald: () => ''
  };
  const HAIR_BACK = {
    long: h => `<path d="M-36,-4 C-42,-50 42,-50 36,-4 L40,44 H-40Z" fill="${h}" ${O}/>`,
    pigtails: h => `<circle cx="-38" cy="6" r="14" fill="${h}" ${O}/><circle cx="38" cy="6" r="14" fill="${h}" ${O}/>`
  };

  /* ---------------- characters ---------------- */
  const limb = (x1, y1, x2, y2, color, w) =>
    `<path d="M${f1(x1)},${f1(y1)} L${f1(x2)},${f1(y2)}" stroke="${INK}" stroke-width="${w + 6}" stroke-linecap="round"/><path d="M${f1(x1)},${f1(y1)} L${f1(x2)},${f1(y2)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;

  function person(look, c, ground) {
    const kid = look.type !== 'adult';
    // tall — довші ноги й тулуб, slim — вужча («жилиста») фігура
    const tall = look.tall ? 1.2 : 1, slim = look.slim ? 0.78 : 1;
    const legH = (kid ? 38 : 62) * tall, bodyW = (kid ? 46 : 54) * slim, bodyH = (kid ? 56 : 74) * (look.tall ? 1.1 : 1), headR = kid ? 30 : 27, armL = (kid ? 40 : 54) * (look.tall ? 1.12 : 1);
    const yHip = -legH, ySh = -(legH + bodyH), headCY = ySh - headR + 8, k = headR / 30;
    const skin = look.skin || '#f6c9a0', shirt = look.shirt || '#4fc3f7', hair = look.hair || '#6d4c41';
    const legColor = look.dress ? (look.tights || skin) : (look.pants || '#3949ab');
    const style = look.hairStyle || 'short', mood = c.mood || 'normal', pose = c.pose || 'down';
    const sc = c.s || 1;
    const headG = inner => `<g transform="translate(0,${headCY}) scale(${f1(k * 100) / 100})">${inner}</g>`;
    let s = '';
    if (HAIR_BACK[style]) s += headG(HAIR_BACK[style](hair));
    const lx = bodyW / 4, walk = pose === 'walk';
    const feet = walk ? [[-lx - 14, -6], [lx + 14, -6]] : [[-lx, -6], [lx, -6]];
    s += limb(-lx, yHip + 4, feet[0][0], feet[0][1], legColor, 12) + limb(lx, yHip + 4, feet[1][0], feet[1][1], legColor, 12);
    s += feet.map(([x, y]) => `<ellipse cx="${x + 3}" cy="${y + 2}" rx="12" ry="6" fill="${look.shoes || '#37474f'}" ${O}/>`).join('');
    s += look.dress
      ? `<path d="M${-bodyW / 2 + 4},${ySh} H${bodyW / 2 - 4} L${bodyW / 2 + 12},${yHip + 10} H${-bodyW / 2 - 12}Z" fill="${shirt}" ${O}/>`
      : `<rect x="${-bodyW / 2}" y="${ySh}" width="${bodyW}" height="${bodyH + 6}" rx="${kid ? 14 : 12}" fill="${shirt}" ${O}/>`;
    if (look.apron) s += `<path d="M-16,${ySh + 18} H16 V${yHip + 4} H-16Z" fill="#fff" ${O2}/>`;
    // білий халат лікаря: { coat: true } у кадрі
    if (c.coat) s += `<path d="M${-bodyW / 2 - 4},${ySh + 2} H${bodyW / 2 + 4} L${bodyW / 2 + 10},${yHip + 22} H${-bodyW / 2 - 10}Z" fill="#fafafa" ${O}/><path d="M0,${ySh + 4} V${yHip + 20}" stroke="#b0bec5" stroke-width="2"/><path d="M-10,${ySh + 4} L0,${ySh + 22} L10,${ySh + 4}" fill="${shirt}" ${O2}/><path d="M-14,${ySh + 30} Q-18,${ySh + 60} 0,${ySh + 64} Q18,${ySh + 60} 14,${ySh + 30}" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="0" cy="${ySh + 64}" r="5" fill="#90a4ae" ${O2}/>`;
    const shx = bodyW / 2 - 3, shy = ySh + 12;
    const A = {
      down: [[-shx - 8, shy + armL], [shx + 8, shy + armL]],
      wave: [[-shx - 8, shy + armL], [shx + 20, shy - armL * 0.8]],
      cheer: [[-shx - 20, shy - armL * 0.8], [shx + 20, shy - armL * 0.8]],
      point: [[-shx - 8, shy + armL], [shx + armL, shy - 8]],
      hold: [[-9, shy + armL * 0.6], [9, shy + armL * 0.6]],
      hips: [[-shx - 18, shy + armL * 0.5], [shx + 18, shy + armL * 0.5]],
      walk: [[-shx - 16, shy + armL * 0.9], [shx + 16, shy + armL * 0.9]],
      talk: [[-shx - 8, shy + armL], [shx + armL * 0.72, shy + armL * 0.22]]
    }[pose] || [[-shx - 8, shy + armL], [shx + 8, shy + armL]];
    const sleeve = c.coat ? '#fafafa' : shirt;
    s += limb(-shx, shy, A[0][0], A[0][1], sleeve, 11) + limb(shx, shy, A[1][0], A[1][1], sleeve, 11);
    s += A.map(([x, y]) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="7" fill="${skin}" ${O2}/>`).join('');
    let f = `<circle cx="0" cy="0" r="30" fill="${skin}" ${O}/>`;
    if (look.beard) f += `<path d="M-25,8 Q-23,38 0,38 Q23,38 25,8 Q16,24 0,24 Q-16,24 -25,8Z" fill="${hair}" ${O}/>`;
    f += `<circle cx="-19" cy="9" r="5" fill="#ff8a80" opacity=".55"/><circle cx="19" cy="9" r="5" fill="#ff8a80" opacity=".55"/>`;
    f += eyes(mood) + mouth(mood);
    if (look.glasses) f += `<circle cx="-11" cy="-2" r="9.5" fill="none" ${O}/><circle cx="11" cy="-2" r="9.5" fill="none" ${O}/><path d="M-1.5,-3 h3" ${O}/>`;
    f += (HAIR[style] || HAIR.short)(hair, look.accent || '#ff4081');
    s += headG(f);
    const flip = c.flip ? -1 : 1;
    const headTop = ground + (headCY - headR - (style === 'bun' ? 14 : 8)) * sc;
    return { svg: `<g transform="translate(${c.x},${ground}) scale(${flip * sc},${sc})">${s}</g>`, head: { x: c.x, y: headTop } };
  }

  function cat(look, c, ground) {
    const fur = look.fur || '#ffb74d', dark = look.stripes || '#e65100', sc = c.s || 1, mood = c.mood || 'normal';
    let s = `<path d="M24,-16 C62,-18 60,-62 42,-66" fill="none" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><path d="M24,-16 C62,-18 60,-62 42,-66" fill="none" stroke="${fur}" stroke-width="8" stroke-linecap="round"/>`;
    s += `<ellipse cx="0" cy="-28" rx="30" ry="27" fill="${fur}" ${O}/><path d="M-12,-48 q6,8 0,16 M12,-48 q-6,8 0,16" stroke="${dark}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    s += `<ellipse cx="-13" cy="-4" rx="10" ry="6" fill="${fur}" ${O2}/><ellipse cx="13" cy="-4" rx="10" ry="6" fill="${fur}" ${O2}/>`;
    let hd = `<path d="M-21,-8 L-19,-36 L-4,-20Z" fill="${fur}" ${O}/><path d="M21,-8 L19,-36 L4,-20Z" fill="${fur}" ${O}/><circle r="24" fill="${fur}" ${O}/>`;
    hd += `<path d="M-6,-22 v7 M0,-24 v8 M6,-22 v7" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>`;
    hd += `<g transform="scale(.72) translate(0,2)">${eyes(mood)}</g>`;
    hd += `<path d="M-3.5,5 h7 l-3.5,4Z" fill="#f06292"/><path d="M0,9 q-4,5 -8,2 M0,9 q4,5 8,2" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
    hd += `<path d="M-9,7 L-28,2 M-9,10 L-28,12 M9,7 L28,2 M9,10 L28,12" stroke="${INK}" stroke-width="1.5" stroke-linecap="round"/>`;
    s += `<g transform="translate(0,-66)">${hd}</g>`;
    return { svg: `<g transform="translate(${c.x},${ground}) scale(${(c.flip ? -1 : 1) * sc},${sc})">${s}</g>`, head: { x: c.x, y: ground - 100 * sc } };
  }

  /* 🤖 Робот Robo (категорія «Програмування»): корпус-коробка, екран-обличчя зі світлодіодними
     очима, антена. Пози ті самі, що в людей, настрій — малюнком очей і рота на екрані. */
  function robot(look, c, ground) {
    const sc = c.s || 1, mood = c.mood || 'normal', pose = c.pose || 'down';
    const body = look.body || '#4dd0e1', trim = look.trim || '#00838f', scr = '#102027', led = look.led || '#76ff03';
    const A = { down: [[-40, -46], [40, -46]], wave: [[-40, -46], [50, -124]], cheer: [[-48, -128], [48, -128]], point: [[-40, -46], [68, -92]],
      hold: [[-18, -58], [18, -58]], hips: [[-48, -62], [48, -62]], walk: [[-42, -52], [42, -64]], talk: [[-40, -46], [62, -72]] }[pose] || [[-40, -46], [40, -46]];
    const arm = (x, [ex, ey]) => `<path d="M${x},-84 L${ex},${ey}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x},-84 L${ex},${ey}" stroke="#b0bec5" stroke-width="6" stroke-linecap="round"/><circle cx="${ex}" cy="${ey}" r="7.5" fill="${trim}" ${O2}/>`;
    let s = `<rect x="-22" y="-36" width="12" height="28" fill="#90a4ae" ${O2}/><rect x="10" y="-36" width="12" height="28" fill="#90a4ae" ${O2}/>`;
    s += `<rect x="-34" y="-13" width="30" height="13" rx="6" fill="${trim}" ${O}/><rect x="4" y="-13" width="30" height="13" rx="6" fill="${trim}" ${O}/>`;
    s += arm(-30, A[0]) + arm(30, A[1]);
    s += `<rect x="-33" y="-98" width="66" height="66" rx="12" fill="${body}" ${O}/>`;
    s += `<rect x="-21" y="-86" width="42" height="22" rx="5" fill="${scr}" ${O2}/><path d="M-15,-75 h8 M-3,-75 h18" stroke="${led}" stroke-width="3" stroke-linecap="round"/>`;
    s += `<circle cx="-12" cy="-48" r="4.5" fill="#ff5252" ${O2}/><circle cx="0" cy="-48" r="4.5" fill="#ffd23f" ${O2}/><circle cx="12" cy="-48" r="4.5" fill="#69f0ae" ${O2}/>`;
    s += `<rect x="-8" y="-108" width="16" height="12" fill="#90a4ae" ${O2}/>`;
    const arc = x => `<path d="M${x - 6},-1 q6,-9 12,0" fill="none" stroke="${led}" stroke-width="3.5" stroke-linecap="round"/>`;
    const eye = {
      happy: arc, grin: arc,
      surprised: x => `<circle cx="${x}" cy="-3" r="6" fill="none" stroke="${led}" stroke-width="3"/>`,
      sad: x => `<path d="M${x - 6},${x < 0 ? -1 : -6} L${x + 6},${x < 0 ? -6 : -1}" stroke="${led}" stroke-width="3.5" stroke-linecap="round"/>`,
      angry: x => `<path d="M${x - 6},${x < 0 ? -7 : -1} L${x + 6},${x < 0 ? -1 : -7}" stroke="#ff5252" stroke-width="3.5" stroke-linecap="round"/>`,
      think: x => `<rect x="${x - 2}" y="-12" width="8" height="8" rx="3" fill="${led}"/>`
    }[mood] || (x => `<rect x="${x - 4}" y="-9" width="8" height="12" rx="3" fill="${led}"/>`);
    const mouth = {
      happy: `<path d="M-9,7 q9,8 18,0" fill="none" stroke="${led}" stroke-width="3" stroke-linecap="round"/>`,
      grin: `<path d="M-12,5 h24 q-2,10 -12,10 q-10,0 -12,-10Z" fill="${led}"/>`,
      surprised: `<circle cx="0" cy="10" r="4" fill="none" stroke="${led}" stroke-width="3"/>`,
      sad: `<path d="M-8,13 q8,-7 16,0" fill="none" stroke="${led}" stroke-width="3" stroke-linecap="round"/>`,
      angry: `<path d="M-8,11 h16" stroke="#ff5252" stroke-width="3" stroke-linecap="round"/>`,
      think: `<path d="M-8,10 q4,-4 8,0 q4,4 8,0" fill="none" stroke="${led}" stroke-width="3" stroke-linecap="round"/>`
    }[mood] || `<path d="M-8,9 h16" stroke="${led}" stroke-width="3" stroke-linecap="round"/>`;
    let hd = `<path d="M0,-26 V-42" stroke="${INK}" stroke-width="3"/><circle cy="-46" r="6.5" fill="#ff5252" ${O2}/>`;
    hd += `<circle cx="-39" cy="0" r="7" fill="${trim}" ${O2}/><circle cx="39" cy="0" r="7" fill="${trim}" ${O2}/>`;
    hd += `<rect x="-36" y="-26" width="72" height="54" rx="15" fill="${body}" ${O}/><rect x="-28" y="-18" width="56" height="38" rx="10" fill="${scr}" ${O2}/>`;
    hd += eye(-12) + eye(12) + mouth;
    s += `<g transform="translate(0,-136)">${hd}</g>`;
    return { svg: `<g transform="translate(${c.x},${ground}) scale(${(c.flip ? -1 : 1) * sc},${sc})">${s}</g>`, head: { x: c.x, y: ground - 168 * sc, robot: true } };
  }

  /* ---------------- effects ---------------- */
  const heart = (x, y, k, c) => `<path transform="translate(${x},${y}) scale(${k})" d="M0,6 C-14,-8 -8,-20 0,-11 C8,-20 14,-8 0,6Z" fill="${c}" ${O2}/>`;
  const FX = {
    flour: r => { let s = ''; for (let i = 0; i < 26; i++) s += `<circle cx="${f1(120 + r() * 170)}" cy="${f1(120 + r() * 130)}" r="${f1(10 + r() * 22)}" fill="#fff" opacity="${f1(0.55 + r() * 0.35)}"/>`; return s; },
    snow: r => { let s = ''; for (let i = 0; i < 46; i++) s += `<circle cx="${f1(r() * 400)}" cy="${f1(r() * 300)}" r="${f1(1.5 + r() * 3)}" fill="#fff" stroke="#9fc4e0" stroke-width="1"/>`; return s; },
    rain: r => { let s = ''; for (let i = 0; i < 50; i++) { const x = r() * 420, y = r() * 300; s += `<path d="M${f1(x)},${f1(y)} l-6,14" stroke="#42a5f5" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>`; } return `<rect width="400" height="300" fill="#546e7a" opacity=".18"/>` + s; },
    hearts: r => { let s = ''; for (let i = 0; i < 6; i++) s += heart(f1(40 + r() * 320), f1(110 + r() * 90), f1(0.8 + r() * 0.7), ['#ff4081', '#f06292', '#e91e63'][i % 3]); return s; },
    stars: r => { let s = ''; for (let i = 0; i < 6; i++) { const x = i % 2 ? 12 + r() * 40 : 348 + r() * 40, y = 120 + r() * 120, k = 0.6 + r() * 0.7; s += `<path transform="translate(${f1(x)},${f1(y)}) scale(${f1(k)})" d="M0,-12 L3,-3 L12,0 L3,3 L0,12 L-3,3 L-12,0 L-3,-3Z" fill="#ffd54f" ${O2}/>`; } return s; }
  };

  /* ---------------- speech bubbles ---------------- */
  function wrap(text, max) {
    const out = []; let cur = '';
    for (const w of String(text).split(/\s+/)) {
      if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
    }
    if (cur) out.push(cur);
    return out;
  }
  function burst(cx, cy, r1, r2, n) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) { const r = i % 2 ? r2 : r1, a = i / (n * 2) * Math.PI * 2 - Math.PI / 2; pts.push(f1(cx + Math.cos(a) * r) + ',' + f1(cy + Math.sin(a) * r)); }
    return pts.join(' ');
  }
  function bubbles(p, lang, heads, a, tr, style) {
    /* Мови підказки на бульбашці — ті самі, що обрані в налаштуваннях: якщо учень
       увімкнув німецьку, вона має бути і в кадрі, а не лише в спливній підказці.
       Для мов зі словника (de/pl/tr/lt/ar) текст добуває KomiksCore.both за англійським рядком. */
    const TIP_FLAG = { uk: 'UA', en: 'EN', ar: 'AR', de: 'DE', pl: 'PL', tr: 'TR', lt: 'LT', pt: 'BR' };
    const tipLangs = () => {
      const K = window.KomiksCore;
      const v = K && K.trLangs ? K.trLangs() : ['uk', 'en'];
      return v.length ? v : ['uk', 'en'];
    };
    const tipRows = l => {
      const K = window.KomiksCore;
      const full = K && K.both ? (K.both(l.uk, l.en) || {}) : { uk: l.uk, en: l.en };
      return tipLangs().map(x => (full[x] ? TIP_FLAG[x] + ': ' + full[x] : null)).filter(Boolean);
    };
    const tip = l => (tr === 'both' ? (rows => (rows.length ? `<title>${esc(rows.join('\n'))}</title>` : ''))(tipRows(l))
      : tr === 'uk+no' ? `<title>${esc(['UA: ' + (l.uk || ''), 'NO: ' + (l.no || '')].join('\n'))}</title>`
      : tr && l[tr] ? `<title>${esc(l[tr])}</title>` : '');
    // другий стиль (англійські історії): прямокутні бульбашки й інший шрифт
    const strip = style === 'strip';
    const BF = strip ? 'font-family="Rubik, sans-serif" font-weight="700"' : FONT;
    let svg = '';
    const placed = [];
    const fits = (x, y, w, h) => !placed.some(q => x < q.x + q.w + 4 && x + w + 4 > q.x && y < q.y + q.h + 6 && y + h + 6 > q.y);
    for (const l of p.lines.filter(l => l.who === 'narrator')) {
      const rows = wrap(l[lang], 34), fs = 14;
      const w = Math.min(388, Math.max(...rows.map(r => r.length)) * fs * 0.52 + 22), h = rows.length * (fs + 3) + 12;
      svg += `<g class="bub">${tip(l)}<rect x="6" y="6" width="${f1(w)}" height="${h}" fill="${strip ? '#dff5ff' : '#fff3b0'}" ${O}/>` + rows.map((r, i) => `<text x="16" y="${6 + (i + 1) * (fs + 3) + 1}" ${BF} font-size="${fs}" fill="${INK}">${esc(r)}</text>`).join('') + '</g>';
      placed.push({ x: 6, y: 6, w, h });
    }
    for (const l of p.lines.filter(l => l.who !== 'narrator' && l.who !== 'sfx')) {
      const head = heads[l.who];
      const cx = head ? head.x : 200;
      const allHeads = Object.values(heads);
      // шукаємо місце: не накривати жодне обличчя, бути ближче до мовця й вище; за потреби — дрібніший шрифт
      let best = null;
      for (const [size, per] of [[15, 22], [13, 27], [12, 31], [11, 36]]) {
        const rw = wrap(l[lang], per);
        const cw = size * (lang === 'uk' ? 0.56 : 0.52);
        const bw = Math.min(310, Math.max(...rw.map(r => r.length)) * cw + 26), bh = rw.length * (size + 3) + 14;
        const xs = [];
        for (let xx = 6; xx <= 394 - bw; xx += 8) xs.push(xx);
        xs.push(Math.max(6, 394 - bw), clamp(cx - bw / 2, 6, Math.max(6, 394 - bw)));
        for (const xx of xs) {
          for (let yy = 6; yy <= 294 - bh; yy += 6) {
            if (!fits(xx, yy, bw, bh)) continue;
            const hit = allHeads.some(hd => yy + bh > hd.y - 4 && yy < hd.y + 62 && xx < hd.x + 30 && xx + bw > hd.x - 30);
            const cost = (hit ? 10000 : 0) + yy * 2 + Math.abs(xx + bw / 2 - cx) * 0.6 + (15 - size) * 12;
            if (!best || cost < best.cost) best = { cost, fs: size, rows: rw, w: bw, h: bh, x: xx, y: yy };
          }
        }
        if (best && best.cost < 10000) break;
      }
      const { fs, rows, w, h, x, y } = best;
      placed.push({ x, y, w, h });
      const rx = strip ? 5 : Math.min(18, h / 2);
      // робот говорить «терміналом»: темна бульбашка й зелені літери
      const bot = head && head.robot, bf = bot ? '#1d2433' : '#fff';
      svg += `<g class="bub">${tip(l)}<rect x="${f1(x)}" y="${y}" width="${f1(w)}" height="${h}" rx="${bot ? 8 : rx}" fill="${bf}" ${O}/>${bot ? `<rect x="${f1(x + 3.5)}" y="${y + 3.5}" width="${f1(w - 7)}" height="${h - 7}" rx="5" fill="none" stroke="#76ff03" stroke-width="2.5"/>` : ''}${strip ? `<rect x="${f1(x + 4)}" y="${y + 4}" width="${f1(w - 8)}" height="${h - 8}" rx="3" fill="none" stroke="${INK}" stroke-width="1" opacity=".45"/>` : ''}`;
      if (head && head.y > y + h + 8) {
        const bx = clamp(cx, x + 18, x + w - 18);
        const ty = Math.min(head.y - 4, y + h + 30), tx = f1(bx + (cx - bx) * 0.5);
        svg += `<path d="M${f1(bx - 9)},${y + h - 2} L${tx},${f1(ty)} L${f1(bx + 9)},${y + h - 2}" fill="${bf}" ${O}/><rect x="${f1(bx - 8)}" y="${y + h - 5}" width="16" height="5" fill="${bf}"/>`;
      }
      svg += rows.map((r, i) => `<text x="${f1(x + w / 2)}" y="${y + 6 + (i + 1) * (fs + 3) - 1}" text-anchor="middle" ${bot ? 'font-family="ui-monospace, Consolas, monospace" font-weight="700"' : BF} font-size="${fs}" fill="${bot ? '#c3e88d' : INK}">${esc(r)}</text>`).join('') + '</g>';
    }
    p.lines.filter(l => l.who === 'sfx').forEach((l, i) => {
      const pos = a.sfx || { x: 330, y: 150 };
      const x = pos.x, y = pos.y + i * 70, t = l[lang];
      const fs = t.length > 7 ? 19 : 23;
      svg += `<g class="bub">${tip(l)}<polygon points="${burst(x, y, 54, 34, 11)}" fill="#ffd23f" ${O}/><text x="${x}" y="${y + 7}" text-anchor="middle" font-family="Bangers, Impact, sans-serif" font-size="${fs}" fill="#ee4035" stroke="${INK}" stroke-width="1.2" paint-order="stroke" transform="rotate(-8 ${x} ${y})">${esc(t)}</text></g>`;
    });
    return svg;
  }

  /* ---------------- public API ---------------- */
  function scene(c, idx, chars) {
    const p = c.panels[idx], a = p.art || {};
    const r = rng(c.id + ':' + idx);
    /* 📷 фото-кадр: замість намальованої сцени — світлина з теки photo/.
       chars тут нікого не малюють, а лише кажуть, де в кадрі обличчя, щоб хвостик
       хмаринки показував на того, хто говорить. Внизу — легке затемнення під текст. */
    if (a.photo) {
      const src = (c.photoDir || 'photo/') + a.photo;
      let svg = `<defs><linearGradient id="ph-${c.id}-${idx}" x1="0" y1="0" x2="0" y2="1">`
        + '<stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient></defs>'
        + `<rect width="400" height="300" fill="#e9e2d4"/><image href="${esc(src)}" x="0" y="0" width="400" height="300" preserveAspectRatio="xMidYMid slice"/>`
        + `<rect width="400" height="300" fill="url(#ph-${c.id}-${idx})" pointer-events="none"/>`;
      const heads = {};
      for (const ch of a.chars || []) heads[ch.id] = { x: ch.x ?? 200, y: ch.y ?? 170 };
      if (FX[a.fx]) svg += FX[a.fx](r);
      return { svg, heads, a, p };
    }
    const bg = (BG[a.bg] || BG.park)(a);
    const prop = pr => { const fn = P[pr.type]; return fn ? `<g transform="translate(${pr.x},${pr.y ?? bg.ground}) scale(${pr.s || 1})">${fn(pr)}</g>` : ''; };
    let svg = bg.svg + (a.props || []).filter(pr => !pr.front).map(prop).join('');
    const heads = {};
    for (const ch of a.chars || []) {
      const look = (chars[ch.id] && chars[ch.id].look) || { type: 'kid' };
      const out = (look.type === 'cat' ? cat : look.type === 'robot' ? robot : person)(look, ch, ch.y ?? bg.ground);
      svg += out.svg; heads[ch.id] = out.head;
    }
    svg += (a.props || []).filter(pr => pr.front).map(prop).join('');
    if (FX[a.fx]) svg += FX[a.fx](r);
    return { svg, heads, a, p };
  }

  // style: '' — звичайні комікси; 'strip' — інший стиль (англійський курс): растрові крапки й рамка
  const STRIP_FX = `<defs><pattern id="halftone" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="${INK}" opacity=".14"/></pattern></defs>`;
  const stripOverlay = `<rect width="400" height="300" fill="url(#halftone)" pointer-events="none"/><rect x="3" y="3" width="394" height="294" rx="2" fill="none" stroke="${INK}" stroke-width="6"/><rect x="9" y="9" width="382" height="282" fill="none" stroke="#ffffff" stroke-width="2" opacity=".6"/>`;
  // style 'code' — «Програмування»: рамка вікна програми й тонка піксельна сітка
  const CODE_FX = `<defs><pattern id="pixgrid" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="1.4" height="1.4" fill="#3949ab" opacity=".16"/></pattern></defs>`;
  const codeOverlay = `<rect width="400" height="300" fill="url(#pixgrid)" pointer-events="none"/><rect x="3" y="3" width="394" height="294" rx="12" fill="none" stroke="#1d2433" stroke-width="6"/>`
    + `<path d="M356,286 l-8,-7 l8,-7 M372,270 l-6,16 M382,272 l8,7 l-8,7" fill="none" stroke="#3949ab" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>`;
  function panel(c, idx, { lang = 'no', tr = null, bubbles: withBubbles = true, chars = {}, style = '' } = {}) {
    const st = style || c.style || '';
    const sc = scene(c, idx, chars);
    const label = sc.p.lines.map(l => l[lang]).join(' ');
    const deco = st === 'strip' ? STRIP_FX + sc.svg + stripOverlay : st === 'code' ? CODE_FX + sc.svg + codeOverlay : sc.svg;
    return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">${deco}${withBubbles ? bubbles(sc.p, lang, sc.heads, sc.a, tr, st) : ''}</svg>`;
  }

  function cover(c, { title, badge, chars = {} }) {
    const sc = scene(c, c.cover || 0, chars);
    const fs = title.length > 26 ? 18 : title.length > 20 ? 21 : 25;
    return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(title)}">${sc.svg}
      <g transform="rotate(-2.5 200 268)"><rect x="16" y="242" width="368" height="48" rx="8" fill="#fff" ${O}/>
      <text x="200" y="274" text-anchor="middle" font-family="Rubik, 'Arial Black', sans-serif" font-weight="900" font-size="${fs}" fill="${INK}">${esc(title)}</text></g>
      <circle cx="36" cy="34" r="24" fill="#ffd23f" ${O}/><text x="36" y="40" text-anchor="middle" font-family="Rubik, sans-serif" font-weight="900" font-size="16" fill="${INK}">${esc(badge)}</text></svg>`;
  }

  // окремий предмет у рамці (для тесту «Hva er dette?»)
  function propSVG(type, { bg = '#fff8e1' } = {}) {
    const fn = P[type];
    if (!fn) return '';
    const big = { elg: 0.62, snowman: 0.6, sofa: 0.8, umbrella: 1.1, balloons: 0.9, rake: 0.85, officedesk: 1, plant: 1.1, table: 1.1 }[type] || 1.7;
    return `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img"><rect width="200" height="150" fill="${bg}"/><circle cx="100" cy="80" r="62" fill="#fff" opacity=".7"/><g transform="translate(100,${type === 'umbrella' ? 150 : 128}) scale(${big})">${fn({ stage: 3, n: 4, berries: true, label: '100' })}</g></svg>`;
  }

  const propRaw = (type, o = {}) => (P[type] ? P[type](o) : '');
  window.KomiksArt = { panel, cover, propSVG, propRaw, props: Object.keys(P), backgrounds: Object.keys(BG), moods: ['normal', 'happy', 'grin', 'surprised', 'sad', 'angry', 'think'], poses: ['down', 'wave', 'cheer', 'point', 'hold', 'hips', 'walk', 'talk'] };
})();
