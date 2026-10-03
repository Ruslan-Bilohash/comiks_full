/* Комікс·Lab — 🎨 знак бренду.
 *
 * Малюємо його кодом, а не картинкою, з трьох причин: він лишається різким на
 * будь-якому екрані, важить кілька сотень байтів і підхоплює кольори теми —
 * тож у темному режимі не доводиться тримати другий файл.
 *
 * Сам знак: мовна бульбашка коміксу з літерою K і зіркою. Бульбашка — бо весь
 * застосунок про те, що персонажі говорять; зірка — бо за правильні відповіді
 * дають зірки, і вони ж стоять у профілі.
 *
 *   KomiksLogo.svg({ size, star, ink, paper })  → рядок SVG
 *   KomiksLogo.el({ size })                     → готовий вузол
 */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;

  const PALETTE = { ink: '#141414', yellow: '#ffd23f', red: '#ee4035', paper: '#fff8ea', white: '#ffffff' };

  /* viewBox 120×120: бульбашка з хвостиком, що не вилазить за межі, тож знак
     однаково добре сідає і в коло, і в квадрат. */
  function svg(opt) {
    const o = Object.assign({ size: 92, star: true, title: '' }, opt || {});
    const P = PALETTE;
    const t = o.title ? `<title>${String(o.title).replace(/[<&]/g, '')}</title>` : '';
    return `<svg viewBox="0 0 120 120" width="${o.size}" height="${o.size}" xmlns="http://www.w3.org/2000/svg" role="img" ${o.title ? '' : 'aria-hidden="true"'} focusable="false">${t}
  <g stroke="${P.ink}" stroke-width="6.5" stroke-linejoin="round" stroke-linecap="round">
    <!-- хвостик малюємо першим, щоб тіло бульбашки перекрило його стик -->
    <path d="M42 80 L36 98 L58 84 Z" fill="${P.yellow}"/>
    <rect x="20" y="28" width="80" height="54" rx="16" fill="${P.yellow}"/>
    <!-- K: дві лінії замість літери зі шрифту — так знак не залежить від шрифтів -->
    <path d="M46 42 L46 68" fill="none"/>
    <path d="M66 42 L48 55 L68 68" fill="none"/>
  </g>
  ${o.star ? `<path d="M86 24 l4.4 9 9.9 1.4-7.2 7 1.7 9.8-8.8-4.6-8.9 4.6 1.7-9.8-7.1-7 9.9-1.4Z"
    fill="${P.red}" stroke="${P.ink}" stroke-width="5" stroke-linejoin="round"/>` : ''}
</svg>`;
  }

  function el(opt) {
    const d = document.createElement('div');
    d.className = 'kl-logo';
    d.innerHTML = svg(opt);
    return d.firstElementChild;
  }

  window.KomiksLogo = { svg, el, palette: PALETTE };
})();
