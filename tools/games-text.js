/* Комікс·Lab — 🎮 той самий текст про ігри для застосунку й для статичних сторінок.
 *
 * Проза про ігри (заголовки, опис, підписи до знімків, застереження про вік)
 * лежить в assets/games.js таблицею `G` — там її бачить переклад застосунку
 * (node tools/app-i18n.js), і звідти ж її беруть німецька, польська, турецька
 * та литовська версії.
 *
 * Статична сторінка /games/ мусить казати те саме. Скопіювати текст у build.js
 * означало б дві правди: одна в застосунку, друга в пошуковій видачі, і вони
 * розійшлися б із першою ж правкою. Тому дістаємо літерал із модуля й
 * накриваємо його словниками data/app-i18n-<код>.js — тими самими файлами, які
 * вантажить застосунок.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

/* Шукає об'єктний літерал після `<щось> = {` і рахує дужки до парної.
   Таблиця написів — чисті рядки й масиви рядків, тож її можна виконати. */
function literal(src, head) {
  const i = src.indexOf(head);
  if (i === -1) return null;
  const open = src.indexOf('{', i);
  if (open === -1) return null;
  let depth = 0;
  for (let j = open; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}') { depth--; if (!depth) { try { return new Function('return (' + src.slice(open, j + 1) + ')')(); } catch (e) { return null; } } }
  }
  return null;
}

function base() {
  const src = fs.readFileSync(path.join(ROOT, 'assets', 'games.js'), 'utf8');
  const G = literal(src, 'const G = ') || {};
  const ar = literal(src, 'G.ar = ');
  if (ar) G.ar = ar;
  return G;
}

/* Словник мови, якої в модулі не написано руками. Файла може не бути — тоді
   сторінка цією мовою просто не виходить (див. build.js), і це правильніше за
   половину сторінки англійською. */
function pack(lang) {
  const f = path.join(ROOT, 'data', `app-i18n-${lang}.js`);
  if (!fs.existsSync(f)) return null;
  const w = {};
  try { new Function('window', fs.readFileSync(f, 'utf8'))(w); } catch (e) { return null; }
  return ((w.KL_T || {})['games.js:G'] || {})[lang] || null;
}

module.exports = function gamesText(langs = ['en', 'no', 'uk', 'de', 'pl', 'tr', 'lt', 'pt', 'ar']) {
  const G = base();
  const out = {};
  for (const lang of langs) {
    const own = G[lang];
    const tr = own ? null : pack(lang);
    if (!own && !tr) continue;
    /* Починаємо завжди з англійської копії: ключа, якого в перекладі немає,
       краще показати англійським, ніж порожнім місцем. */
    out[lang] = Object.assign({}, G.en, own || tr);
  }
  return out;
};
module.exports.literal = literal;
