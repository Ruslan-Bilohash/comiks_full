/* Комікс·Lab — 🖼️ мальовані іконки, частина 7: місто й транспорт, професії, природа.
   Ключ — норвезьке слово без артикля. Файл лише дописує іконки в window.KomiksPics. */
(() => {
  'use strict';
  if (typeof document === 'undefined' || !window.KomiksPics) return;
  const C = { paper: '#fffdf5', red: '#ee4035', blue: '#2e86de', green: '#3bb273', yellow: '#ffd23f',
    grey: '#9aa0a6', dark: '#37474f', sky: '#bfe3ff', brown: '#8d6e63', pink: '#ff8fb8', orange: '#ff9f43',
    purple: '#8e6bc4', cream: '#fff3d6', skin: '#f6c9a0', silver: '#cfd8dc', sand: '#f0dCA0' };
  // людина в робочому одязі: та сама постать, змінюється лише колір і деталь у руці
  const worker = (clothes, head, tool = '') =>
    `<circle cx="32" cy="22" r="12" fill="${C.skin}"/>${head}` +
    `<circle cx="28" cy="21" r="1.8" fill="#141414" stroke="none"/><circle cx="36" cy="21" r="1.8" fill="#141414" stroke="none"/>` +
    `<path d="M27 26c3 3 7 3 10 0" fill="none" stroke-width="2.5"/>` +
    `<path d="M12 58c0-11 9-17 20-17s20 6 20 17z" fill="${clothes}"/>${tool}`;

  const P = {
    // 🏙️ місто й транспорт
    trikk: `<rect x="10" y="12" width="44" height="34" rx="5" fill="${C.red}"/><rect x="15" y="18" width="14" height="12" rx="2" fill="${C.sky}"/><rect x="35" y="18" width="14" height="12" rx="2" fill="${C.sky}"/><circle cx="20" cy="50" r="5" fill="${C.dark}"/><circle cx="44" cy="50" r="5" fill="${C.dark}"/><path d="M32 12V4h14" fill="none" stroke-width="3"/>`,
    fly: `<path d="M30 6c4 0 6 6 6 14l18 10v8l-18-5v10l7 6v6l-13-4-13 4v-6l7-6V33L6 38v-8l18-10c0-8 2-14 6-14z" fill="${C.sky}"/>`,
    båt: `<path d="M8 40h48l-8 14H16z" fill="${C.brown}"/><path d="M32 38V8l18 22z" fill="${C.paper}"/><path d="M30 38V14L14 38z" fill="${C.red}"/><path d="M6 56c6-4 10 0 16 0s10-4 16 0 10 0 16 0" fill="none" stroke="${C.blue}" stroke-width="3"/>`,
    drosje: `<path d="M8 34l8-14h32l8 14v14H8z" fill="${C.yellow}"/><path d="M18 24h28l4 10H14z" fill="${C.sky}"/><circle cx="18" cy="48" r="6" fill="${C.dark}"/><circle cx="46" cy="48" r="6" fill="${C.dark}"/><rect x="24" y="8" width="16" height="10" rx="2" fill="${C.dark}"/><text x="32" y="16" text-anchor="middle" font-size="8" font-weight="900" fill="${C.yellow}" stroke="none">TAXI</text>`,
    gate: `<path d="M6 56 24 8h16l18 48z" fill="${C.grey}"/><path d="M32 14v6M32 26v6M32 38v6M32 50v4" stroke="${C.paper}" stroke-width="4"/>`,
    lyskryss: `<rect x="20" y="6" width="24" height="44" rx="8" fill="${C.dark}"/><circle cx="32" cy="17" r="6" fill="${C.red}"/><circle cx="32" cy="29" r="6" fill="${C.yellow}"/><circle cx="32" cy="41" r="6" fill="${C.green}"/><path d="M32 50v10" stroke-width="4"/>`,
    apotek: `<path d="M8 10h48v44H8z" fill="${C.paper}"/><path d="M26 18h12v10h10v12H38v10H26V40H16V28h10z" fill="${C.green}"/>`,
    bank: `<path d="M6 26 32 10l26 16z" fill="${C.paper}"/><path d="M12 28h6v18h-6zM29 28h6v18h-6zM46 28h6v18h-6z" fill="${C.blue}"/><path d="M6 48h52v8H6z" fill="${C.brown}"/><circle cx="32" cy="20" r="3" fill="${C.yellow}" stroke="none"/>`,
    kirke: `<path d="M14 56V26l18-12 18 12v30z" fill="${C.paper}"/><path d="M28 56V40h8v16z" fill="${C.brown}"/><path d="M32 14V4M27 8h10" stroke-width="4"/><rect x="24" y="26" width="6" height="8" rx="3" fill="${C.sky}"/><rect x="34" y="26" width="6" height="8" rx="3" fill="${C.sky}"/>`,
    bibliotek: `<path d="M10 14h12v40H10zM24 12h10v42H24zM36 16h9v38h-9zM47 14h7v40h-7z" fill="${C.red}"/><path d="M24 12h10v42H24z" fill="${C.blue}"/><path d="M36 16h9v38h-9z" fill="${C.green}"/><path d="M47 14h7v40h-7z" fill="${C.yellow}"/><path d="M6 54h52v6H6z" fill="${C.brown}"/>`,
    holdeplass: `<path d="M12 10h34v8H12z" fill="${C.blue}"/><path d="M12 10v34" stroke-width="4"/><path d="M12 44h34" stroke-width="3"/><rect x="20" y="22" width="20" height="14" rx="2" fill="${C.paper}"/><path d="M24 28h12" stroke-width="2"/><path d="M12 44v14" stroke-width="4"/>`,
    stasjon: `<path d="M8 40h48v10H8z" fill="${C.grey}"/><rect x="14" y="14" width="36" height="26" rx="4" fill="${C.blue}"/><rect x="20" y="20" width="10" height="10" rx="2" fill="${C.sky}"/><rect x="34" y="20" width="10" height="10" rx="2" fill="${C.sky}"/><circle cx="22" cy="52" r="4" fill="${C.dark}"/><circle cx="42" cy="52" r="4" fill="${C.dark}"/><path d="M6 58h52" stroke-width="3"/>`,
    flyplass: `<path d="M6 46h52v8H6z" fill="${C.grey}"/><path d="M16 46V28h32v18z" fill="${C.paper}"/><path d="M20 32h24v8H20z" fill="${C.sky}"/><path d="M40 20c4 0 6 3 6 8H34c0-5 2-8 6-8z" fill="${C.blue}"/><path d="M12 50h40" stroke="${C.paper}" stroke-width="2" stroke-dasharray="6 4"/>`,

    // 👷 професії
    lege: worker(C.paper, `<path d="M20 22c0-9 5-13 12-13s12 4 12 13l-3-4c-4-3-18-3-21 4z" fill="${C.brown}"/>`,
      `<circle cx="44" cy="46" r="5" fill="none" stroke-width="3"/><path d="M44 41V34c0-4-8-4-8 0" fill="none" stroke-width="3"/>`),
    sykepleier: worker('#e8f5ff', `<path d="M20 20h24v8H20z" fill="${C.paper}"/><path d="M29 20h6v8h-6z" fill="${C.red}"/>`,
      `<path d="M30 46h4v10h-4zM26 50h12v4H26z" fill="${C.red}"/>`),
    kokk: worker(C.paper, `<path d="M18 20c-6-2-6-12 2-12 0-6 10-8 12-2 4-4 12-2 12 4 6 2 4 10-2 10z" fill="${C.paper}"/>`,
      `<path d="M42 44v12M38 44c0 6 8 6 8 0" fill="none" stroke-width="3"/>`),
    brannmann: worker(C.red, `<path d="M16 22a16 12 0 0 1 32 0z" fill="${C.yellow}"/><path d="M14 22h36v4H14z" fill="${C.dark}"/>`,
      `<path d="M44 40c8 2 10 10 4 14" fill="none" stroke-width="4"/>`),
    bonde: worker(C.green, `<path d="M12 24c4-10 36-10 40 0z" fill="${C.sand || '#f0dca0'}"/><path d="M20 20c0-7 4-10 12-10s12 3 12 10z" fill="#e0c070"/>`,
      `<path d="M44 38v18M40 38h8" fill="none" stroke-width="3"/>`),
    snekker: worker('#c98f4a', `<path d="M18 20h28v6H18z" fill="${C.red}"/><path d="M20 20c0-8 4-11 12-11s12 3 12 11z" fill="${C.red}"/>`,
      `<path d="M40 42l10-6 4 6-10 6z" fill="${C.grey}"/><path d="M38 46l-6 6" stroke-width="4"/>`),
    elektriker: worker(C.yellow, `<path d="M18 22a14 11 0 0 1 28 0z" fill="${C.orange}"/>`,
      `<path d="M44 34l-6 12h6l-4 10 10-14h-6z" fill="${C.yellow}"/>`),
    frisør: worker(C.pink, `<path d="M19 22c0-9 6-13 13-13s13 4 13 13l-3-4c-4-3-18-3-20 4z" fill="${C.dark}"/>`,
      `<path d="M40 38l10 10M50 38l-10 10" stroke-width="3"/><circle cx="40" cy="52" r="4" fill="none" stroke-width="3"/><circle cx="50" cy="52" r="4" fill="none" stroke-width="3"/>`),
    sjåfør: worker(C.blue, `<path d="M18 20h28v6H18z" fill="${C.dark}"/><path d="M20 20c0-8 4-11 12-11s12 3 12 11z" fill="${C.dark}"/>`,
      `<circle cx="44" cy="46" r="8" fill="none" stroke-width="4"/><path d="M44 38v16M36 46h16" stroke-width="3"/>`),
    pilot: worker('#2b3a67', `<path d="M18 20h28v6H18z" fill="#1b2747"/><path d="M20 20c0-8 4-11 12-11s12 3 12 11z" fill="#1b2747"/><path d="M28 20h8v6h-8z" fill="${C.yellow}"/>`,
      `<path d="M46 40c4 0 6 4 6 8h-12c0-4 2-8 6-8z" fill="${C.silver}"/>`),
    ingeniør: worker(C.orange, `<path d="M16 22a16 12 0 0 1 32 0z" fill="${C.yellow}"/>`,
      `<path d="M40 40h14v14H40z" fill="${C.paper}"/><path d="M43 44h8M43 48h8" stroke-width="2"/>`),
    advokat: worker(C.dark, `<path d="M19 22c0-9 6-13 13-13s13 4 13 13l-3-4c-4-3-18-3-20 4z" fill="#26323d"/>`,
      `<path d="M38 40h16M46 40v12M40 52h12" stroke-width="3"/><path d="M38 44l-4 6h8z" fill="${C.silver}"/>`),
    tannlege: worker(C.paper, `<path d="M20 20h24v8H20z" fill="#d7f0ff"/>`,
      `<path d="M40 38c6-4 12-4 14 0 2 4 0 10-2 14-1 3-3 3-4 0l-2-6h-2l-2 6c-1 3-3 3-4 0-2-4-4-10 2-14z" fill="${C.paper}"/>`),
    kasserer: worker(C.green, `<path d="M19 22c0-9 6-13 13-13s13 4 13 13l-3-4c-4-3-18-3-20 4z" fill="${C.yellow}"/>`,
      `<rect x="38" y="40" width="16" height="12" rx="2" fill="${C.paper}"/><path d="M41 44h10M41 48h6" stroke-width="2"/>`),

    // 🌲 природа
    fjord: `<path d="M6 44 20 16l12 18 8-12 18 22z" fill="${C.grey}"/><path d="M20 16l5 8h-10zM40 22l4 6h-8z" fill="${C.paper}" stroke="none"/><path d="M6 44h52v14H6z" fill="${C.blue}"/><path d="M10 50c6-3 10 0 16 0s10-3 16 0 10 0 12 0" fill="none" stroke="${C.sky}" stroke-width="3"/>`,
    skog: `<path d="M16 46 6 46 16 26 8 26 20 8 32 26h-8l10 20h-10z" fill="${C.green}"/><path d="M18 46h6v10h-6z" fill="${C.brown}"/><path d="M44 46h-8l8-16h-6l10-14 10 14h-6l8 16h-8z" fill="#2f8f4f"/><path d="M42 46h6v10h-6z" fill="${C.brown}"/>`,
    innsjø: `<ellipse cx="32" cy="40" rx="26" ry="14" fill="${C.blue}"/><path d="M12 38c6-3 10 0 16 0s10-3 16 0" fill="none" stroke="${C.sky}" stroke-width="3"/><path d="M8 26 18 12l8 12z" fill="${C.green}"/><path d="M38 24l8-10 8 10z" fill="${C.green}"/>`,
    elv: `<path d="M20 6c-8 10 8 16 0 26s8 16 0 26" fill="none" stroke="${C.blue}" stroke-width="12" stroke-linecap="round"/><path d="M44 6c-8 10 8 16 0 26s8 16 0 26" fill="none" stroke="${C.sky}" stroke-width="8" stroke-linecap="round"/>`,
    hav: `<path d="M6 30h52v26H6z" fill="${C.blue}"/><path d="M8 34c6-4 10 0 16 0s10-4 16 0 10 0 16 0M8 44c6-4 10 0 16 0s10-4 16 0 10 0 16 0" fill="none" stroke="${C.sky}" stroke-width="3"/><circle cx="48" cy="16" r="8" fill="${C.yellow}"/>`,
    strand: `<path d="M6 40h52v18H6z" fill="#f2dfa8"/><path d="M6 24h52v16H6z" fill="${C.blue}"/><path d="M8 36c6-4 10 0 16 0s10-4 16 0 10 0 16 0" fill="none" stroke="${C.sky}" stroke-width="3"/><path d="M44 40V24" stroke-width="3"/><path d="M44 24c-8-6-14 0-14 0 6-2 10 0 14 0zM44 24c8-6 14 0 14 0-6-2-10 0-14 0z" fill="${C.green}"/>`,
    øy: `<path d="M6 42h52v14H6z" fill="${C.blue}"/><path d="M18 42c0-8 6-12 14-12s14 4 14 12z" fill="#f2dfa8"/><path d="M32 30V16" stroke-width="3"/><path d="M32 16c-8-4-12 2-12 2 6-2 9 0 12-2zM32 16c8-4 12 2 12 2-6-2-9 0-12-2z" fill="${C.green}"/>`,
    foss: `<path d="M12 6h40v10H12z" fill="${C.grey}"/><path d="M20 16c0 14-4 24-4 34h10c0-10 2-20 2-34zM34 16c0 14 2 24 2 34h10c0-10-4-20-4-34z" fill="${C.sky}"/><path d="M8 50h48v8H8z" fill="${C.blue}"/>`,
    stein: `<path d="M10 46c-2-10 6-20 16-22 12-2 22 6 24 16 1 8-6 12-18 12-12 0-20-2-22-6z" fill="${C.grey}"/><path d="M20 34c6-4 12-4 16 0" stroke="${C.silver}" stroke-width="3" fill="none"/>`,
    himmel: `<rect width="64" height="64" fill="${C.sky}"/><circle cx="18" cy="18" r="8" fill="${C.yellow}"/><path d="M28 40a10 10 0 0 1 3-19 12 12 0 0 1 22 4 8 8 0 0 1-3 15z" fill="${C.paper}"/>`,
    stjerne: `<path d="M32 4l8 18 20 2-15 13 5 20-18-11-18 11 5-20L4 24l20-2z" fill="${C.yellow}"/>`,
    måne: `<path d="M40 6a26 26 0 1 0 18 38A22 22 0 0 1 40 6z" fill="${C.yellow}"/><circle cx="20" cy="12" r="2" fill="${C.paper}" stroke="none"/><circle cx="12" cy="26" r="1.6" fill="${C.paper}" stroke="none"/>`,
    hytte: `<path d="M8 52 32 22l24 30z" fill="${C.brown}"/><path d="M20 52V38h10v14z" fill="#6d4c41"/><rect x="36" y="36" width="10" height="9" rx="2" fill="${C.yellow}"/><path d="M6 52h52v6H6z" fill="#4e342e"/><path d="M44 22v-8h6v14" fill="${C.grey}"/>`,

    // ⚽ дозвілля
    fotball: `<circle cx="32" cy="32" r="22" fill="${C.paper}"/><path d="M32 16l10 7-4 12H26l-4-12z" fill="${C.dark}"/><path d="M32 10v6M14 26l8 5M50 26l-8 5M22 50l4-9M42 50l-4-9" stroke-width="3"/>`,
    svømming: `<path d="M6 46c6-4 10 0 16 0s10-4 16 0 10 0 16 0" fill="none" stroke="${C.blue}" stroke-width="5"/><path d="M6 56c6-4 10 0 16 0s10-4 16 0 10 0 16 0" fill="none" stroke="${C.sky}" stroke-width="5"/><circle cx="40" cy="20" r="7" fill="${C.skin}"/><path d="M12 34c8-6 18-8 26-6l10-4" fill="none" stroke="${C.skin}" stroke-width="7" stroke-linecap="round"/>`,
    løping: `<circle cx="38" cy="14" r="7" fill="${C.skin}"/><path d="M20 30l14-6 10 8 8 2" fill="none" stroke="${C.red}" stroke-width="7" stroke-linecap="round"/><path d="M34 32l-6 12-10 6M34 32l8 10 2 14" fill="none" stroke="${C.blue}" stroke-width="7" stroke-linecap="round"/>`,
    dans: `<circle cx="26" cy="14" r="7" fill="${C.skin}"/><path d="M26 22c6 4 8 12 6 18l-8 16" fill="none" stroke="${C.pink}" stroke-width="8" stroke-linecap="round"/><path d="M28 28l14-8M30 40l14 12" fill="none" stroke="${C.skin}" stroke-width="6" stroke-linecap="round"/><path d="M18 56h16l-8-12z" fill="${C.pink}"/>`
  };
  window.KomiksPics.add(P);
})();
