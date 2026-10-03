/* Комікс·Lab — 🖼️ мальовані іконки, частина 5: тварини, дім, школа, погода.
   Ключ — норвезьке слово без артикля. Файл лише дописує іконки в window.KomiksPics. */
(() => {
  'use strict';
  if (typeof document === 'undefined' || !window.KomiksPics) return;
  const C = { wood: '#c98f4a', wood2: '#a9702f', paper: '#fffdf5', red: '#ee4035', blue: '#2e86de', green: '#3bb273',
    yellow: '#ffd23f', skin: '#f6c9a0', grey: '#9aa0a6', pink: '#ff8fb8', dark: '#37474f', sky: '#bfe3ff',
    brown: '#8d6e63', white: '#ffffff', orange: '#ff9f43', purple: '#8e6bc4', cream: '#fff3d6', snow: '#eaf4ff' };
  // спільна голова тварини: морда, вуха й очі малюються однаково, змінюється лише форма й колір
  const face = (col, ear, extra = '') =>
    `${ear}<circle cx="32" cy="34" r="20" fill="${col}"/><circle cx="25" cy="31" r="2.4" fill="#141414" stroke="none"/>` +
    `<circle cx="39" cy="31" r="2.4" fill="#141414" stroke="none"/>${extra}`;
  const snout = (y = 42) => `<ellipse cx="32" cy="${y}" rx="9" ry="6" fill="${C.paper}"/><path d="M29 ${y - 2}h6l-3 3z" fill="#141414" stroke="none"/><path d="M32 ${y + 1}v3" stroke-width="2"/>`;

  const P = {
    // 🐾 тварини
    hund: face(C.wood, `<path d="M12 18l6 14-8 4z" fill="${C.wood2}"/><path d="M52 18l-6 14 8 4z" fill="${C.wood2}"/>`, snout(43)),
    katt: face(C.grey, `<path d="M14 16l6 12-10 2z" fill="${C.grey}"/><path d="M50 16l-6 12 10 2z" fill="${C.grey}"/>`,
      `<path d="M27 42h10" stroke-width="2"/><path d="M32 38l-2 4h4z" fill="${C.pink}" stroke="none"/><path d="M12 38h8M12 44h8M44 38h8M44 44h8" stroke-width="2"/>`),
    hest: `<path d="M18 14c0-6 6-8 10-4l14 14c6 6 8 14 8 22v14h-12V40l-10-8-4 8h-10l4-14z" fill="${C.wood2}"/><path d="M20 12l-4-6 10 2z" fill="${C.wood2}"/><path d="M28 10l-2-7 9 4z" fill="${C.wood2}"/><circle cx="26" cy="20" r="2.4" fill="#141414" stroke="none"/><path d="M40 30h8" stroke-width="2"/>`,
    ku: face(C.paper, `<path d="M10 22c-4-6 2-10 8-6z" fill="${C.pink}"/><path d="M54 22c4-6-2-10-8-6z" fill="${C.pink}"/>`,
      `<ellipse cx="32" cy="44" rx="11" ry="7" fill="${C.pink}"/><circle cx="28" cy="43" r="1.8" fill="#141414" stroke="none"/><circle cx="36" cy="43" r="1.8" fill="#141414" stroke="none"/><path d="M16 22c-2-6 2-8 6-6" fill="${C.dark}"/>`),
    gris: face(C.pink, `<path d="M14 18l4 10-10-2z" fill="${C.pink}"/><path d="M50 18l-4 10 10-2z" fill="${C.pink}"/>`,
      `<ellipse cx="32" cy="44" rx="10" ry="7" fill="#ffa8c8"/><circle cx="29" cy="44" r="2" fill="#141414" stroke="none"/><circle cx="35" cy="44" r="2" fill="#141414" stroke="none"/>`),
    sau: `<path d="M14 30a10 10 0 0 1 8-14 12 12 0 0 1 20-2 10 10 0 0 1 8 16 10 10 0 0 1-8 14H22a10 10 0 0 1-8-14z" fill="${C.paper}"/><circle cx="32" cy="40" r="11" fill="${C.dark}"/><circle cx="28" cy="38" r="2" fill="${C.paper}" stroke="none"/><circle cx="36" cy="38" r="2" fill="${C.paper}" stroke="none"/><path d="M20 40h-6M50 40h-6" stroke-width="3"/>`,
    geit: face(C.cream, `<path d="M16 16c-4-8 0-12 4-8l2 8z" fill="${C.wood2}"/><path d="M48 16c4-8 0-12-4-8l-2 8z" fill="${C.wood2}"/>`,
      `<path d="M27 42h10" stroke-width="2"/><path d="M28 48c2 8 6 8 8 0z" fill="${C.paper}"/>`),
    høne: `<path d="M18 36a14 14 0 0 1 28 0c0 10-6 16-14 16s-14-6-14-16z" fill="${C.paper}"/><circle cx="32" cy="20" r="10" fill="${C.paper}"/><path d="M26 12c0-6 4-6 4-2 2-4 6-4 6 2z" fill="${C.red}"/><circle cx="29" cy="19" r="2" fill="#141414" stroke="none"/><path d="M38 21l6 2-6 3z" fill="${C.orange}"/><path d="M24 52l-4 6M40 52l4 6" stroke-width="3"/>`,
    fugl: `<path d="M16 34a16 14 0 0 1 32 0c0 10-8 16-16 16s-16-6-16-16z" fill="${C.blue}"/><circle cx="26" cy="30" r="2.4" fill="#141414" stroke="none"/><path d="M16 32l-8 4 8 4z" fill="${C.orange}"/><path d="M34 34c8-4 14 0 14 6-6 4-12 2-14-6z" fill="${C.sky}"/><path d="M28 50l-2 8M38 50l2 8" stroke-width="3"/>`,
    mus: face(C.grey, `<circle cx="14" cy="20" r="9" fill="${C.pink}"/><circle cx="50" cy="20" r="9" fill="${C.pink}"/>`,
      `<ellipse cx="32" cy="44" rx="7" ry="5" fill="${C.paper}"/><circle cx="32" cy="42" r="2" fill="${C.pink}" stroke="none"/><path d="M52 48c8 2 10 8 4 10" fill="none" stroke-width="3"/>`),
    kanin: face(C.paper, `<ellipse cx="22" cy="12" rx="5" ry="13" fill="${C.paper}"/><ellipse cx="42" cy="12" rx="5" ry="13" fill="${C.paper}"/><ellipse cx="22" cy="13" rx="2.5" ry="9" fill="${C.pink}" stroke="none"/><ellipse cx="42" cy="13" rx="2.5" ry="9" fill="${C.pink}" stroke="none"/>`,
      `<path d="M32 40l-2 3h4z" fill="${C.pink}" stroke="none"/><path d="M27 46h10" stroke-width="2"/>`),
    bjørn: face(C.brown, `<circle cx="14" cy="18" r="8" fill="${C.brown}"/><circle cx="50" cy="18" r="8" fill="${C.brown}"/>`,
      `<ellipse cx="32" cy="44" rx="10" ry="7" fill="${C.wood}"/><circle cx="32" cy="41" r="3" fill="#141414" stroke="none"/><path d="M32 44v4" stroke-width="2"/>`),
    ulv: face(C.grey, `<path d="M12 16l8 12-12 2z" fill="${C.grey}"/><path d="M52 16l-8 12 12 2z" fill="${C.grey}"/>`,
      `<path d="M22 42h20l-10 10z" fill="${C.paper}"/><circle cx="32" cy="42" r="3" fill="#141414" stroke="none"/>`),
    rev: face(C.orange, `<path d="M12 14l8 14-12 2z" fill="${C.orange}"/><path d="M52 14l-8 14 12 2z" fill="${C.orange}"/>`,
      `<path d="M20 40h24l-12 12z" fill="${C.paper}"/><circle cx="32" cy="43" r="3" fill="#141414" stroke="none"/>`),
    elg: `<path d="M20 20h24c4 0 6 4 6 10v10c0 10-8 16-18 16s-18-6-18-16V30c0-6 2-10 6-10z" fill="${C.wood2}"/><path d="M18 18C8 14 6 6 12 4c2 6 8 8 10 12z" fill="${C.wood}"/><path d="M46 18c10-4 12-12 6-14-2 6-8 8-10 12z" fill="${C.wood}"/><circle cx="26" cy="32" r="2.4" fill="#141414" stroke="none"/><circle cx="38" cy="32" r="2.4" fill="#141414" stroke="none"/><ellipse cx="32" cy="46" rx="9" ry="6" fill="${C.dark}"/>`,
    reinsdyr: `<path d="M20 22h24c4 0 6 4 6 10v8c0 10-8 16-18 16s-18-6-18-16v-8c0-6 2-10 6-10z" fill="${C.brown}"/><path d="M18 20C10 14 8 4 14 4c0 6 6 10 8 14zM22 12c-6-2-8-8-4-10 0 4 4 6 6 8z" fill="${C.wood}"/><path d="M46 20c8-6 10-16 4-16 0 6-6 10-8 14zM42 12c6-2 8-8 4-10 0 4-4 6-6 8z" fill="${C.wood}"/><circle cx="26" cy="34" r="2.4" fill="#141414" stroke="none"/><circle cx="38" cy="34" r="2.4" fill="#141414" stroke="none"/><circle cx="32" cy="46" r="5" fill="${C.red}"/>`,
    hval: `<path d="M6 36c8-14 26-18 38-10 8 6 12 14 14 20-10 4-22 6-32 2-10-4-16-8-20-12z" fill="${C.blue}"/><path d="M58 46c4 4 6 10 2 12-4 0-6-6-6-10z" fill="${C.blue}"/><circle cx="20" cy="32" r="2.4" fill="#141414" stroke="none"/><path d="M8 40c10 6 22 8 32 4" stroke="${C.sky}" stroke-width="3" fill="none"/><path d="M24 18c0-6 6-8 8-4-4 0-6 2-8 4z" fill="${C.sky}"/>`,
    sel: `<path d="M14 40c0-14 10-22 22-22 12 0 18 8 18 18 0 10-8 16-18 16H20c-4 0-6-4-6-12z" fill="${C.grey}"/><circle cx="44" cy="32" r="2.6" fill="#141414" stroke="none"/><path d="M50 38c4 0 6 2 6 4h-8z" fill="${C.dark}"/><path d="M14 44c-6 2-10 8-6 10 6 0 10-4 12-8z" fill="${C.grey}"/>`,
    ugle: `<path d="M14 34a18 18 0 0 1 36 0c0 12-8 20-18 20s-18-8-18-20z" fill="${C.wood}"/><circle cx="24" cy="30" r="8" fill="${C.paper}"/><circle cx="40" cy="30" r="8" fill="${C.paper}"/><circle cx="24" cy="30" r="3.4" fill="#141414" stroke="none"/><circle cx="40" cy="30" r="3.4" fill="#141414" stroke="none"/><path d="M28 38h8l-4 6z" fill="${C.orange}"/><path d="M14 20l6 6M50 20l-6 6" stroke-width="3"/>`,
    løve: `<circle cx="32" cy="34" r="24" fill="${C.orange}"/><circle cx="32" cy="34" r="16" fill="${C.wood}"/><circle cx="26" cy="31" r="2.4" fill="#141414" stroke="none"/><circle cx="38" cy="31" r="2.4" fill="#141414" stroke="none"/><path d="M26 42h12l-6 6z" fill="${C.paper}"/><path d="M22 40h-6M42 40h6" stroke-width="2"/>`,
    slange: `<path d="M10 50c0-8 34-4 34-14s-22-6-22-14 14-8 22-4" fill="none" stroke-width="9" stroke-linecap="round" stroke="${C.green}"/><circle cx="44" cy="18" r="7" fill="${C.green}"/><circle cx="46" cy="16" r="1.8" fill="#141414" stroke="none"/><path d="M50 20l7 2-7 2z" fill="${C.red}"/>`,
    sommerfugl: `<path d="M32 18v28" stroke-width="5"/><path d="M30 22C18 6 4 14 8 26c3 9 15 10 22 4z" fill="${C.orange}"/><path d="M34 22C46 6 60 14 56 26c-3 9-15 10-22 4z" fill="${C.pink}"/><path d="M30 34c-10 4-16 14-8 18 7 3 13-6 16-12z" fill="${C.yellow}"/><path d="M34 34c10 4 16 14 8 18-7 3-13-6-16-12z" fill="${C.purple}"/><path d="M30 16l-6-8M34 16l6-8" stroke-width="3"/>`,

    // 🏠 дім
    stue: `<path d="M8 40h48v14H8z" fill="${C.wood}"/><path d="M12 24h40v16H12z" fill="${C.blue}"/><path d="M12 32h40" stroke-width="2"/><path d="M6 40h8v14H6zM50 40h8v14h-8z" fill="${C.blue}"/><rect x="24" y="14" width="16" height="10" rx="2" fill="${C.paper}"/>`,
    soverom: `<path d="M6 40h52v16H6z" fill="${C.wood}"/><path d="M10 26h20v14H10z" fill="${C.paper}"/><path d="M30 30h24v10H30z" fill="${C.sky}"/><path d="M6 56v4M58 56v4" stroke-width="3"/><path d="M6 40h52" stroke-width="3"/>`,
    bad: `<path d="M8 32h48v8c0 10-8 16-18 16h-12c-10 0-18-6-18-16z" fill="${C.sky}"/><path d="M6 32h52" stroke-width="3"/><path d="M14 32V18c0-4 8-4 8 0" fill="none" stroke-width="3"/><path d="M8 56l-2 6M56 56l2 6" stroke-width="3"/>`,
    sofa: `<path d="M8 32c0-6 4-8 8-8h32c4 0 8 2 8 8v6H8z" fill="${C.red}"/><path d="M6 36h52v14H6z" fill="#f36b6b"/><path d="M6 50v6M58 50v6" stroke-width="3"/><path d="M32 36v14" stroke-width="2" opacity=".5"/>`,
    komfyr: `<rect x="10" y="16" width="44" height="40" rx="4" fill="${C.grey}"/><rect x="16" y="30" width="32" height="20" rx="3" fill="${C.dark}"/><rect x="20" y="34" width="24" height="12" rx="2" fill="${C.orange}"/><circle cx="18" cy="23" r="3" fill="${C.paper}"/><circle cx="30" cy="23" r="3" fill="${C.paper}"/><circle cx="42" cy="23" r="3" fill="${C.paper}"/>`,
    dusj: `<path d="M18 20h4v34h-4z" fill="${C.grey}"/><path d="M12 14h26c4 0 6 3 6 6H12z" fill="${C.grey}"/><path d="M34 22v6M42 22v8M50 22v6" stroke="${C.sky}" stroke-width="3"/><path d="M30 36v8M38 34v10M46 36v8" stroke="${C.sky}" stroke-width="3"/><path d="M8 56h48" stroke-width="3"/>`,
    toalett: `<path d="M16 16h10v14H16z" fill="${C.paper}"/><path d="M12 30h32c0 12-6 18-14 18h-6c-8 0-12-6-12-18z" fill="${C.paper}"/><path d="M22 48h10v10H18z" fill="${C.paper}"/><rect x="14" y="10" width="14" height="8" rx="2" fill="${C.sky}"/>`,
    hage: `<path d="M6 44h52v12H6z" fill="#7bc47b"/><circle cx="18" cy="34" r="8" fill="${C.green}"/><path d="M18 42v8" stroke-width="3"/><circle cx="34" cy="30" r="6" fill="${C.pink}"/><path d="M34 36v14" stroke-width="3"/><circle cx="48" cy="34" r="7" fill="${C.yellow}"/><path d="M48 41v9" stroke-width="3"/>`,

    // 🏫 школа
    lærer: `<circle cx="32" cy="22" r="11" fill="${C.skin}"/><path d="M21 22c0-9 5-13 11-13s11 4 11 13l-3-4c-4-3-16-3-19 4z" fill="${C.dark}"/><circle cx="28" cy="21" r="1.8" fill="#141414" stroke="none"/><circle cx="36" cy="21" r="1.8" fill="#141414" stroke="none"/><path d="M12 58c0-11 9-17 20-17s20 6 20 17z" fill="${C.blue}"/><path d="M44 42l12-8v18l-12-4z" fill="${C.paper}"/>`,
    elev: `<circle cx="32" cy="24" r="10" fill="${C.skin}"/><path d="M22 24c0-8 5-12 10-12s10 4 10 12c-3-4-16-4-20 0z" fill="${C.wood2}"/><circle cx="28" cy="23" r="1.8" fill="#141414" stroke="none"/><circle cx="36" cy="23" r="1.8" fill="#141414" stroke="none"/><path d="M14 58c0-10 8-16 18-16s18 6 18 16z" fill="${C.green}"/><rect x="40" y="40" width="14" height="16" rx="3" fill="${C.red}"/>`,
    penn: `<path d="M46 6l12 12-30 30-16 4 4-16z" fill="${C.blue}"/><path d="M42 10l12 12" stroke-width="3"/><path d="M12 52l6-2-4-4z" fill="#141414"/><path d="M46 6l12 12-4 4-12-12z" fill="${C.grey}"/>`,
    linjal: `<path d="M6 24h52v16H6z" fill="${C.yellow}"/><path d="M12 24v8M20 24v6M28 24v8M36 24v6M44 24v8M52 24v6" stroke-width="2"/><path d="M6 24h52v16H6z" fill="none" stroke-width="3"/>`,
    saks: `<path d="M18 8l24 32M46 8L22 40" stroke-width="5" fill="none"/><circle cx="18" cy="48" r="9" fill="none" stroke-width="5"/><circle cx="46" cy="48" r="9" fill="none" stroke-width="5"/><circle cx="32" cy="36" r="3" fill="${C.grey}"/>`,
    gym: `<path d="M10 28h6v12h-6zM48 28h6v12h-6z" fill="${C.dark}"/><path d="M16 30h6v8h-6zM42 30h6v8h-6z" fill="${C.red}"/><path d="M22 32h20v4H22z" fill="${C.grey}"/>`,

    // 🌤️ погода
    vind: `<path d="M8 22h26a7 7 0 1 0-7-7" fill="none" stroke-width="5" stroke-linecap="round"/><path d="M8 34h34a7 7 0 1 1-7 7" fill="none" stroke-width="5" stroke-linecap="round"/><path d="M8 46h18a6 6 0 1 0-6-6" fill="none" stroke-width="5" stroke-linecap="round"/>`,
    tåke: `<circle cx="24" cy="24" r="12" fill="${C.paper}"/><circle cx="40" cy="26" r="10" fill="${C.paper}"/><path d="M8 38h48M12 46h40M16 54h32" stroke="${C.grey}" stroke-width="5" stroke-linecap="round"/>`,
    torden: `<path d="M16 32a12 12 0 0 1 4-23 15 15 0 0 1 27 5 10 10 0 0 1-2 20z" fill="${C.grey}"/><path d="M32 34l-8 14h7l-4 12 14-18h-8l5-8z" fill="${C.yellow}"/>`,
    lyn: `<path d="M36 4 14 34h12l-6 26 24-32H30z" fill="${C.yellow}"/>`,
    regnbue: `<path d="M6 50a26 26 0 0 1 52 0" fill="none" stroke="${C.red}" stroke-width="7"/><path d="M13 50a19 19 0 0 1 38 0" fill="none" stroke="${C.orange}" stroke-width="7"/><path d="M20 50a12 12 0 0 1 24 0" fill="none" stroke="${C.yellow}" stroke-width="7"/><path d="M27 50a5 5 0 0 1 10 0" fill="none" stroke="${C.green}" stroke-width="7"/>`,
    skye: `<path d="M18 46a13 13 0 0 1 3-25 16 16 0 0 1 29 6 10 10 0 0 1-3 19z" fill="${C.paper}"/>`,
    vinter: `<path d="M32 6v52M8 32h48M14 14l36 36M50 14 14 50" stroke="${C.sky}" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="32" r="6" fill="${C.snow}"/>`,
    vår: `<circle cx="32" cy="26" r="8" fill="${C.yellow}"/><ellipse cx="20" cy="20" rx="8" ry="6" fill="${C.pink}"/><ellipse cx="44" cy="20" rx="8" ry="6" fill="${C.pink}"/><ellipse cx="20" cy="34" rx="8" ry="6" fill="${C.pink}"/><ellipse cx="44" cy="34" rx="8" ry="6" fill="${C.pink}"/><path d="M32 36v20" stroke-width="4"/><path d="M32 46c8 0 10-6 10-6-6 0-10 3-10 6z" fill="${C.green}"/>`,
    sommer: `<circle cx="32" cy="32" r="14" fill="${C.yellow}"/><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M52 12l-6 6M18 46l-6 6" stroke-width="5" stroke-linecap="round"/>`,
    høst: `<path d="M32 8c10 8 16 16 16 24a16 16 0 0 1-32 0c0-8 6-16 16-24z" fill="${C.orange}"/><path d="M32 12v44" stroke-width="3"/><path d="M32 26c-6-2-10-6-12-10M32 34c6-2 10-6 12-10M32 42c-6-2-10-6-12-10" stroke-width="2"/>`,
    grad: `<path d="M26 10a6 6 0 0 1 12 0v26a12 12 0 1 1-12 0z" fill="${C.paper}"/><circle cx="32" cy="44" r="8" fill="${C.red}"/><path d="M32 20v20" stroke="${C.red}" stroke-width="5"/><path d="M42 16h6M42 24h6M42 32h6" stroke-width="2"/>`,
    nordlys: `<rect width="64" height="64" fill="#101a33"/><path d="M6 46c6-22 14-32 22-34 8-2 12 8 10 18-2 10-8 16-10 22" fill="none" stroke="#3ddc97" stroke-width="7" opacity=".9"/><path d="M20 48c6-18 12-26 18-28 6-2 10 6 8 14" fill="none" stroke="#8ef0c0" stroke-width="5" opacity=".8"/><circle cx="50" cy="14" r="2" fill="${C.paper}" stroke="none"/><circle cx="14" cy="12" r="1.6" fill="${C.paper}" stroke="none"/>`,
    storm: `<path d="M18 30a12 12 0 0 1 4-22 15 15 0 0 1 27 5 10 10 0 0 1-2 19z" fill="${C.grey}"/><path d="M14 38h30M18 46h24M24 54h14" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/><path d="M40 36l-6 12h6l-4 10 12-16h-6z" fill="${C.yellow}"/>`
  };
  window.KomiksPics.add(P);
})();
