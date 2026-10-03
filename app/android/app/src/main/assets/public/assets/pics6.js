/* Комікс·Lab — 🖼️ мальовані іконки, частина 6: ознаки й протилежності.
   Прикметник важко показати одним предметом, тому малюємо ПОРІВНЯННЯ: велике поряд із малим,
   довге поряд із коротким — і потрібне підсвічене кольором, а друге сіре. Так видно різницю.
   Ключ — норвезьке слово. Файл лише дописує іконки в window.KomiksPics. */
(() => {
  'use strict';
  if (typeof document === 'undefined' || !window.KomiksPics) return;
  const C = { paper: '#fffdf5', red: '#ee4035', blue: '#2e86de', green: '#3bb273', yellow: '#ffd23f',
    grey: '#cfd8dc', dark: '#37474f', sky: '#bfe3ff', brown: '#8d6e63', pink: '#ff8fb8', orange: '#ff9f43', wood: '#c98f4a' };
  const OFF = C.grey;            // те, що НЕ мається на увазі, малюємо сірим

  const P = {
    // 📏 розмір
    stor: `<circle cx="42" cy="36" r="20" fill="${C.blue}"/><circle cx="14" cy="48" r="8" fill="${OFF}"/>`,
    liten: `<circle cx="42" cy="36" r="20" fill="${OFF}"/><circle cx="14" cy="48" r="8" fill="${C.blue}"/>`,
    høy: `<path d="M12 56V22h12v34z" fill="${OFF}"/><path d="M34 56V8h16v48z" fill="${C.blue}"/><path d="M8 58h48" stroke-width="3"/>`,
    lav: `<path d="M12 56V22h12v34z" fill="${C.blue}"/><path d="M34 56V8h16v48z" fill="${OFF}"/><path d="M8 58h48" stroke-width="3"/>`,
    lang: `<rect x="6" y="20" width="52" height="10" rx="4" fill="${C.green}"/><rect x="6" y="40" width="18" height="10" rx="4" fill="${OFF}"/>`,
    kort: `<rect x="6" y="20" width="52" height="10" rx="4" fill="${OFF}"/><rect x="6" y="40" width="18" height="10" rx="4" fill="${C.green}"/>`,
    tynn: `<rect x="10" y="14" width="8" height="38" rx="4" fill="${C.purple || '#8e6bc4'}"/><rect x="34" y="14" width="22" height="38" rx="8" fill="${OFF}"/>`,
    tykk: `<rect x="10" y="14" width="8" height="38" rx="4" fill="${OFF}"/><rect x="34" y="14" width="22" height="38" rx="8" fill="#8e6bc4"/>`,

    // ⚖️ вага
    tung: `<path d="M14 26h36l6 28H8z" fill="${C.dark}"/><path d="M26 26v-6a6 6 0 0 1 12 0v6" fill="none" stroke-width="4"/><text x="32" y="48" text-anchor="middle" font-size="16" font-weight="900" fill="${C.paper}" stroke="none">10</text>`,
    lett: `<path d="M34 8c10 10 12 24 6 34-5 8-14 10-20 6-6-4-6-14 0-22 5-7 11-13 14-18z" fill="${C.sky}"/><path d="M34 10c-4 12-10 24-14 34" stroke-width="2"/><path d="M20 48c-6 4-10 6-14 6" stroke-width="3" fill="none"/>`,

    // ⏱️ швидкість
    rask: `<path d="M8 20h30M4 32h34M10 44h28" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/><path d="M40 12l18 20-18 20z" fill="${C.orange}"/>`,
    treg: `<path d="M14 44c0-10 8-16 18-16s18 6 18 16z" fill="${C.wood}"/><path d="M50 44c4 0 6-2 6-6" fill="none" stroke-width="3"/><path d="M8 44h48" stroke-width="3"/><path d="M18 30c0-8 6-12 12-12" fill="none" stroke-width="3" opacity=".6"/>`,

    // 🌡️ температура
    varm: `<circle cx="32" cy="32" r="14" fill="${C.orange}"/><path d="M32 6v8M32 50v8M6 32h8M50 32h8M13 13l6 6M45 45l6 6M51 13l-6 6M19 45l-6 6" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/>`,
    kald: `<path d="M32 6v52M8 32h48M14 14l36 36M50 14 14 50" stroke="${C.sky}" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="32" r="5" fill="${C.sky}"/>`,

    // 💰 ціна
    dyr: `<path d="M18 12h28l10 14-24 28L8 26z" fill="${C.sky}"/><path d="M8 26h48M18 12l-10 14 24 28M46 12l10 14-24 28" stroke-width="2"/>`,
    billig: `<path d="M34 6H12a6 6 0 0 0-6 6v22l26 26 24-24z" fill="${C.green}"/><circle cx="18" cy="18" r="4" fill="${C.paper}"/><text x="40" y="42" text-anchor="middle" font-size="18" font-weight="900" fill="${C.paper}" stroke="none">kr</text>`,

    // 🥛 повний / порожній
    full: `<path d="M18 10h28l-3 42c0 3-3 4-11 4s-11-1-11-4z" fill="${C.paper}"/><path d="M19 22h26l-2 30c0 3-3 4-11 4s-11-1-11-4z" fill="${C.sky}"/>`,
    tom: `<path d="M18 10h28l-3 42c0 3-3 4-11 4s-11-1-11-4z" fill="${C.paper}"/><path d="M22 26h20" stroke-width="2" opacity=".4"/>`,

    // 🧼 чистота
    ren: `<path d="M16 26h32v22a8 8 0 0 1-8 8H24a8 8 0 0 1-8-8z" fill="${C.sky}"/><path d="M16 26c0-8 6-12 16-12s16 4 16 12z" fill="${C.paper}"/><path d="M24 36c2 6 14 6 16 0" fill="none" stroke="${C.paper}" stroke-width="3"/><circle cx="20" cy="12" r="4" fill="${C.paper}"/><circle cx="46" cy="8" r="3" fill="${C.paper}"/>`,
    skitten: `<path d="M12 42c0-12 8-20 20-20s20 8 20 20-8 14-20 14-20-2-20-14z" fill="${C.brown}"/><circle cx="24" cy="38" r="3" fill="#6d4c41" stroke="none"/><circle cx="38" cy="34" r="4" fill="#6d4c41" stroke="none"/><circle cx="34" cy="46" r="2.5" fill="#6d4c41" stroke="none"/><path d="M18 20l4-6M44 18l3-6" stroke-width="3"/>`,

    // 🆕 вік
    ny: `<path d="M32 6l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="${C.yellow}"/>`,
    gammel: `<path d="M10 52V26l22-16 22 16v26z" fill="${C.wood}"/><path d="M10 26 32 10l22 16" fill="none" stroke-width="3"/><path d="M22 52V36h10v16z" fill="${C.brown}"/><path d="M40 30h10v10H40z" fill="${C.brown}"/><path d="M14 44l6-4M50 34l-6 4" stroke-width="2" opacity=".6"/>`,
    ung: `<circle cx="32" cy="26" r="13" fill="#f6c9a0"/><path d="M22 20c2-6 18-6 20 0-4-3-16-3-20 0z" fill="${C.brown}"/><circle cx="27" cy="25" r="2" fill="#141414" stroke="none"/><circle cx="37" cy="25" r="2" fill="#141414" stroke="none"/><path d="M27 31c3 3 7 3 10 0" fill="none" stroke-width="2.5"/><path d="M14 58c0-10 8-16 18-16s18 6 18 16z" fill="${C.green}"/>`,

    // 🔇 звук і світло
    stille: `<path d="M10 26h10l12-10v32L20 38H10z" fill="${C.dark}"/><path d="M40 24l12 16M52 24l-12 16" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>`,
    støyende: `<path d="M10 26h10l12-10v32L20 38H10z" fill="${C.dark}"/><path d="M40 22c6 6 6 14 0 20M48 16c10 10 10 22 0 32" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/>`,
    lyst: `<circle cx="32" cy="30" r="14" fill="${C.yellow}"/><path d="M32 6v6M32 48v6M6 30h6M52 30h6M14 12l4 4M46 44l4 4M50 12l-4 4M18 44l-4 4" stroke-width="4" stroke-linecap="round"/>`,
    mørk: `<path d="M40 8a24 24 0 1 0 16 34A20 20 0 0 1 40 8z" fill="${C.dark}"/><circle cx="18" cy="14" r="2" fill="${C.yellow}" stroke="none"/><circle cx="12" cy="30" r="1.6" fill="${C.yellow}" stroke="none"/>`,

    // 🧩 складність
    vanskelig: `<path d="M12 12h18v8a6 6 0 0 0 12 0v-8h10v18h-8a6 6 0 0 0 0 12h8v10H30v-8a6 6 0 0 0-12 0v8H12z" fill="${C.pink}"/><path d="M40 22h4v4h-4z" fill="${C.paper}" stroke="none"/>`
  };
  window.KomiksPics.add(P);
})();
