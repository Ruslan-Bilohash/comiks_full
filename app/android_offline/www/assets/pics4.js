/* Комікс·Lab — 🖼️ мальовані іконки, частина 4: одяг, тіло, їжа, фрукти й овочі.
   Емодзі на різних телефонах малюються по-різному, а в тестах це заважає: учень має бачити
   предмет, а не здогадуватися. Тут — прості чіткі малюнки в тому самому стилі, що й pics.js.
   Ключ — норвезьке слово без артикля. Файл лише дописує іконки в window.KomiksPics. */
(() => {
  'use strict';
  if (typeof document === 'undefined' || !window.KomiksPics) return;
  const C = { wood: '#c98f4a', wood2: '#a9702f', paper: '#fffdf5', red: '#ee4035', blue: '#2e86de', green: '#3bb273',
    yellow: '#ffd23f', skin: '#f6c9a0', grey: '#9aa0a6', pink: '#ff8fb8', dark: '#37474f', sky: '#bfe3ff',
    brown: '#8d6e63', white: '#ffffff', orange: '#ff9f43', purple: '#8e6bc4', cream: '#fff3d6', meat: '#e07a63' };

  const P = {
    // 👕 одяг
    jakke: `<path d="M22 12h20l12 8-7 9-5-4v31H22V25l-5 4-7-9z" fill="${C.blue}"/><path d="M32 12v44" stroke-width="2"/><path d="M26 10h12l-6 7z" fill="${C.dark}"/><circle cx="36" cy="30" r="2" fill="${C.paper}" stroke="none"/><circle cx="36" cy="40" r="2" fill="${C.paper}" stroke="none"/>`,
    genser: `<path d="M22 14h20l12 7-6 12-6-4v27H22V29l-6 4-6-12z" fill="${C.red}"/><path d="M22 20c6 4 14 4 20 0" fill="none" stroke-width="3"/><path d="M18 46h28" stroke-width="2" opacity=".5"/>`,
    bukse: `<path d="M18 10h28v10l-3 36h-9l-2-24-2 24h-9l-3-36z" fill="${C.blue}"/><path d="M18 20h28" stroke-width="3"/><path d="M32 26v30" stroke-width="2"/>`,
    tskjorte: `<path d="M22 14h20l10 7-6 9-4-3v29H22V27l-4 3-6-9z" fill="${C.paper}"/><path d="M24 14c4 5 12 5 16 0" fill="none" stroke-width="3"/>`,
    skjorte: `<path d="M22 12h20l10 8-6 8-4-3v31H22V25l-4 3-6-8z" fill="${C.sky}"/><path d="M26 12l6 10 6-10" fill="none" stroke-width="3"/><path d="M32 22v34" stroke-width="2"/><path d="M28 12h8l-4 6z" fill="${C.red}"/>`,
    sko: `<path d="M8 40h18l10 8h14c4 0 6 2 6 6v4H8z" fill="${C.brown}"/><path d="M8 50h48" stroke-width="3"/><path d="M14 40v-6h8v6" fill="${C.wood2}"/>`,
    sokk: `<path d="M20 8h16v24c0 6 4 8 10 10 6 3 6 12-2 14-8 2-24-6-24-18z" fill="${C.pink}"/><path d="M20 16h16" stroke-width="3"/>`,
    lue: `<path d="M10 40a22 22 0 0 1 44 0z" fill="${C.red}"/><path d="M8 40h48v10H8z" fill="${C.paper}"/><circle cx="32" cy="14" r="5" fill="${C.paper}"/>`,
    skjerf: `<path d="M12 14h40v12H12z" fill="${C.green}"/><path d="M12 14h40v12H12z" fill="none"/><path d="M18 26v22c0 4 6 4 6 0V26" fill="${C.green}"/><path d="M40 26v28c0 4 6 4 6 0V26" fill="${C.green}"/><path d="M14 20h36" stroke="${C.paper}" stroke-width="3"/><path d="M18 36h6M40 40h6" stroke="${C.paper}" stroke-width="3"/><path d="M18 50h6M40 56h6" stroke-width="2" opacity=".5"/>`,
    vott: `<path d="M18 22h18c3 0 5 2 5 6v8h3c5 0 8 4 8 8s-3 8-8 8H18c-3 0-5-2-5-5V27c0-3 2-5 5-5z" fill="${C.purple}"/><path d="M41 36v8" stroke-width="3" fill="none"/><path d="M13 46h38" stroke-width="3"/><path d="M13 46h38v8H13z" fill="${C.paper}"/><path d="M22 30c6-2 10-2 14 0" stroke="${C.paper}" stroke-width="2" fill="none" opacity=".7"/>`,
    hatt: `<ellipse cx="32" cy="46" rx="26" ry="8" fill="${C.dark}"/><path d="M18 46V22a14 10 0 0 1 28 0v24z" fill="${C.dark}"/><path d="M18 36h28" stroke="${C.red}" stroke-width="5"/>`,

    // 🧍 тіло
    hår: `<circle cx="32" cy="36" r="17" fill="${C.skin}"/><path d="M14 34c0-16 8-24 18-24s18 8 18 24c-2-8-6-12-10-13-6 3-18 3-22 1-2 3-3 7-4 12z" fill="${C.wood2}"/><circle cx="26" cy="36" r="2" fill="#141414" stroke="none"/><circle cx="38" cy="36" r="2" fill="#141414" stroke="none"/>`,
    øye: `<path d="M6 32c8-12 18-18 26-18s18 6 26 18c-8 12-18 18-26 18S14 44 6 32z" fill="${C.paper}"/><circle cx="32" cy="32" r="11" fill="${C.blue}"/><circle cx="32" cy="32" r="5" fill="#141414" stroke="none"/><circle cx="28" cy="28" r="2" fill="${C.paper}" stroke="none"/>`,
    øre: `<path d="M40 8c-12 0-20 9-20 22 0 10-2 14-6 18 6 6 14 8 18 2 3-4 2-8 6-10 8-4 12-10 12-18S48 8 40 8z" fill="${C.skin}"/><path d="M38 20c6 0 8 8 2 12-4 3-4 8-8 8" fill="none" stroke-width="3"/>`,
    nese: `<path d="M26 6c2 12 0 20-6 30-4 7-1 14 6 14h12c7 0 10-7 6-14-6-10-8-18-6-30z" fill="${C.skin}"/><path d="M20 42c4 4 20 4 24 0" fill="none" stroke-width="3"/><ellipse cx="26" cy="44" rx="3.5" ry="2.5" fill="${C.wood2}" stroke="none"/><ellipse cx="38" cy="44" rx="3.5" ry="2.5" fill="${C.wood2}" stroke="none"/>`,
    munn: `<path d="M8 32c8-12 40-12 48 0-8 14-40 14-48 0z" fill="${C.red}"/><path d="M14 30c8 4 28 4 36 0" fill="${C.paper}" stroke="none"/><path d="M8 32h48" stroke-width="2"/>`,
    hånd: `<path d="M18 56V30c0-4 5-4 5 0v-6c0-5 5-5 5 0v-4c0-5 5-5 5 0v5c0-4 5-4 5 0v6c4-2 8 1 7 6l-3 14c-2 6-6 9-12 9H24c-4 0-6-2-6-4z" fill="${C.skin}"/><path d="M28 30v10M36 28v12" fill="none" stroke-width="2" opacity=".5"/>`,
    finger: `<path d="M26 58V22c0-8 12-8 12 0v36z" fill="${C.skin}"/><path d="M26 34h12" stroke-width="2" opacity=".6"/><path d="M28 18c0-6 8-6 8 0" fill="${C.skin}"/><path d="M28 22h8" stroke-width="2"/>`,
    bein: `<path d="M22 6h18v20l4 14-4 18h-14l-2-18 2-14z" fill="${C.skin}"/><path d="M22 52h18v6H22z" fill="${C.dark}"/><circle cx="32" cy="32" r="7" fill="none" stroke-width="2" opacity=".5"/>`,
    fot: `<path d="M18 10h16c4 0 6 4 6 10v14c8 2 14 8 14 16v6H16V36c0-8 2-14 2-26z" fill="${C.skin}"/><circle cx="46" cy="42" r="3" fill="${C.wood2}" stroke="none"/><circle cx="52" cy="46" r="2.5" fill="${C.wood2}" stroke="none"/>`,
    hjerte: `<path d="M32 56S6 40 6 24C6 14 14 8 22 8c5 0 8 3 10 6 2-3 5-6 10-6 8 0 16 6 16 16 0 16-26 32-26 32z" fill="${C.red}"/><path d="M20 20c-4 2-6 6-6 10" fill="none" stroke="${C.paper}" stroke-width="3"/>`,

    // 🍽️ їжа
    pølse: `<path d="M8 44c0-6 5-10 12-10h24c7 0 12 4 12 10s-5 10-12 10H20c-7 0-12-4-12-10z" fill="${C.cream}"/><path d="M10 38c2-6 8-10 16-10h12c8 0 14 4 16 10 2 5-3 8-8 8H18c-5 0-10-3-8-8z" fill="${C.meat}"/><path d="M16 34c8 8 24 8 32 0" stroke="${C.yellow}" stroke-width="4" fill="none"/>`,
    kjøtt: `<path d="M12 28c2-12 14-20 26-16 12 4 16 16 12 26-4 12-18 16-28 10-8-4-12-12-10-20z" fill="${C.meat}"/><path d="M24 26c6-4 14-2 16 6 2 8-4 14-12 12-6-2-8-12-4-18z" fill="#f0a08c"/><path d="M40 52c8 2 12-4 10-8-4 0-8 2-10 8z" fill="${C.paper}"/><path d="M14 22c-6-2-10 2-8 6 4 0 7-2 8-6z" fill="${C.paper}"/>`,
    kylling: `<path d="M26 10c8-4 16 0 18 8l4 20c2 10-6 18-16 18s-18-8-16-18z" fill="${C.wood}"/><path d="M28 14c6-2 10 0 12 6" fill="none" stroke="${C.paper}" stroke-width="3"/><path d="M24 50h16l-2 8H26z" fill="${C.paper}"/>`,
    pizza: `<path d="M32 8 58 52a60 60 0 0 1-52 0z" fill="${C.cream}"/><path d="M32 16 52 50a52 52 0 0 1-40 0z" fill="${C.orange}"/><circle cx="32" cy="34" r="4" fill="${C.red}" stroke="none"/><circle cx="22" cy="44" r="3.5" fill="${C.red}" stroke="none"/><circle cx="42" cy="44" r="3.5" fill="${C.red}" stroke="none"/>`,
    ris: `<path d="M10 34h44c0 12-10 20-22 20S10 46 10 34z" fill="${C.paper}"/><path d="M8 32h48" stroke-width="3"/><ellipse cx="24" cy="24" rx="4" ry="2.5" fill="${C.paper}"/><ellipse cx="34" cy="20" rx="4" ry="2.5" fill="${C.paper}"/><ellipse cx="42" cy="26" rx="4" ry="2.5" fill="${C.paper}"/>`,
    pasta: `<path d="M12 36h40c0 10-9 16-20 16S12 46 12 36z" fill="${C.paper}"/><path d="M10 34h44" stroke-width="3"/><path d="M18 30c6-8 22-8 28 0" fill="none" stroke="${C.yellow}" stroke-width="5"/><path d="M20 24c6-6 18-6 24 0" fill="none" stroke="${C.yellow}" stroke-width="5"/><circle cx="32" cy="30" r="4" fill="${C.red}" stroke="none"/>`,
    is: `<path d="M22 24h20l-6 32h-8z" fill="${C.wood}"/><circle cx="24" cy="20" r="10" fill="${C.pink}"/><circle cx="40" cy="20" r="10" fill="${C.cream}"/><circle cx="32" cy="12" r="10" fill="${C.brown}"/>`,
    smør: `<path d="M10 30 22 18h32v22H10z" fill="${C.yellow}"/><path d="M22 18v22" stroke-width="2"/><path d="M54 18 42 30" stroke-width="2"/><path d="M10 40h44v6H10z" fill="${C.paper}"/>`,
    juice: `<path d="M18 14h28v40a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6z" fill="${C.orange}"/><path d="M18 26h28" stroke-width="3"/><path d="M40 14v-6h6" fill="none" stroke-width="3"/><circle cx="32" cy="40" r="6" fill="${C.paper}" stroke="none" opacity=".7"/>`,
    vann: `<path d="M32 6c10 14 18 22 18 32a18 18 0 0 1-36 0c0-10 8-18 18-32z" fill="${C.sky}"/><path d="M24 40c0 6 4 10 9 10" fill="none" stroke="${C.paper}" stroke-width="4"/>`,
    sjokolade: `<rect x="10" y="14" width="44" height="36" rx="3" fill="${C.brown}"/><path d="M10 26h44M10 38h44M24 14v36M40 14v36" stroke-width="3"/><path d="M40 14 54 26" stroke-width="2" opacity=".4"/>`,

    // 🍎 фрукти й овочі
    banan: `<path d="M12 18c2 22 18 34 38 30 4-1 6-6 2-8-16-2-26-12-28-24-1-4-13-2-12 2z" fill="${C.yellow}"/><path d="M50 48c4 0 6-4 4-6" stroke-width="3" fill="none"/><path d="M12 16c0-4 8-6 10-2" fill="${C.wood2}"/>`,
    appelsin: `<circle cx="32" cy="36" r="22" fill="${C.orange}"/><path d="M32 14v-6" stroke-width="4"/><path d="M32 8c6-4 12 0 10 6-4 2-8 0-10-6z" fill="${C.green}"/><path d="M20 30c8-4 16-4 24 0" stroke="${C.paper}" stroke-width="2" fill="none" opacity=".6"/>`,
    pære: `<path d="M32 10c8 0 8 10 4 16 8 4 12 12 12 20a16 16 0 0 1-32 0c0-8 4-16 12-20-4-6-4-16 4-16z" fill="#c8d94a"/><path d="M32 12V4" stroke-width="3"/><path d="M32 8c5-4 9-1 8 3-3 2-6 1-8-3z" fill="${C.green}"/>`,
    drue: `<circle cx="32" cy="18" r="7" fill="${C.purple}"/><circle cx="23" cy="30" r="7" fill="${C.purple}"/><circle cx="41" cy="30" r="7" fill="${C.purple}"/><circle cx="32" cy="34" r="7" fill="${C.purple}"/><circle cx="27" cy="46" r="7" fill="${C.purple}"/><circle cx="38" cy="46" r="7" fill="${C.purple}"/><path d="M32 10V4" stroke-width="3"/><path d="M32 6c5-4 10 0 8 4-4 2-6 0-8-4z" fill="${C.green}"/>`,
    jordbær: `<path d="M32 58C18 48 10 38 12 26c2-8 12-10 20-4 8-6 18-4 20 4 2 12-6 22-20 32z" fill="${C.red}"/><path d="M22 18h20l-10-8z" fill="${C.green}"/><circle cx="26" cy="32" r="2" fill="${C.yellow}" stroke="none"/><circle cx="38" cy="32" r="2" fill="${C.yellow}" stroke="none"/><circle cx="32" cy="42" r="2" fill="${C.yellow}" stroke="none"/>`,
    sitron: `<ellipse cx="32" cy="34" rx="24" ry="17" fill="${C.yellow}"/><path d="M8 34h48" stroke-width="2" opacity=".4"/><path d="M56 30c4-2 6 2 4 5" stroke-width="3" fill="none"/><path d="M14 28c8-4 14-4 20 0" stroke="${C.paper}" stroke-width="2" fill="none" opacity=".6"/>`,
    gulrot: `<path d="M26 22h12l-4 34c-1 4-3 4-4 0z" fill="${C.orange}"/><path d="M27 32h10M28 42h8" stroke-width="2" opacity=".6"/><path d="M30 22c-6-10-14-10-16-6 6 0 10 3 12 6z" fill="${C.green}"/><path d="M34 22c4-12 12-14 16-10-6 1-10 5-12 10z" fill="${C.green}"/>`,
    potet: `<path d="M12 32c0-12 12-20 24-18 14 2 20 14 16 24-4 12-20 16-30 10-7-4-10-10-10-16z" fill="${C.wood}"/><circle cx="24" cy="30" r="2.5" fill="${C.wood2}" stroke="none"/><circle cx="38" cy="26" r="2" fill="${C.wood2}" stroke="none"/><circle cx="34" cy="42" r="2.5" fill="${C.wood2}" stroke="none"/>`,
    tomat: `<circle cx="32" cy="38" r="20" fill="${C.red}"/><path d="M20 20h24l-12 6z" fill="${C.green}"/><path d="M32 18v-6" stroke-width="3"/><path d="M22 22c4 4 16 4 20 0" fill="${C.green}"/><path d="M22 32c6-4 10-4 14 0" stroke="${C.paper}" stroke-width="2" fill="none" opacity=".5"/>`,
    agurk: `<path d="M12 46c-4-12 6-30 22-36 10-4 20 2 18 12-2 14-14 26-26 28-8 2-12-1-14-4z" fill="#4c9a4c"/><path d="M20 38c6-8 14-16 22-20" stroke="#7bc47b" stroke-width="3" fill="none"/><circle cx="26" cy="36" r="1.6" fill="#2f6b2f" stroke="none"/><circle cx="34" cy="28" r="1.6" fill="#2f6b2f" stroke="none"/>`,
    løk: `<path d="M32 14c12 6 18 16 18 24a18 18 0 0 1-36 0c0-8 6-18 18-24z" fill="#e8d6f0"/><path d="M32 16v40M22 22c-2 12-2 24 4 32M42 22c2 12 2 24-4 32" stroke="${C.purple}" stroke-width="2" fill="none" opacity=".7"/><path d="M32 14c-2-8 2-10 4-10-2 4-1 7-4 10z" fill="${C.green}"/>`,
    sopp: `<path d="M8 34c0-14 11-22 24-22s24 8 24 22z" fill="${C.red}"/><circle cx="20" cy="26" r="4" fill="${C.paper}" stroke="none"/><circle cx="34" cy="22" r="5" fill="${C.paper}" stroke="none"/><circle cx="46" cy="28" r="3.5" fill="${C.paper}" stroke="none"/><path d="M26 34h12v16c0 4-12 4-12 0z" fill="${C.cream}"/>`,
    mais: `<path d="M32 6c10 6 14 18 14 28 0 12-6 22-14 22s-14-10-14-22c0-10 4-22 14-28z" fill="${C.yellow}"/><path d="M24 20c6-2 10-2 16 0M22 30c8-2 12-2 20 0M22 40c8-2 12-2 20 0" stroke="${C.wood2}" stroke-width="2" fill="none"/><path d="M18 34c-8 0-12 8-10 18 8 0 12-8 10-18z" fill="${C.green}"/>`,
    salat: `<path d="M10 36c0-16 10-24 22-24s22 8 22 24c0 10-10 16-22 16s-22-6-22-16z" fill="#7bc47b"/><path d="M18 30c6-8 10-10 14-10M32 20c4 0 10 4 14 12M20 42c6-6 10-8 12-14M34 28c4 6 8 10 12 14" stroke="#3f8f3f" stroke-width="2" fill="none"/>`
  };
  window.KomiksPics.add(P);
})();
