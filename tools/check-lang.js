/* Комікс·Lab — 🔎 перевірка перекладів на помилки.
 *
 *   node tools/check-lang.js
 *
 * Дві незалежні перевірки:
 *  1) словники data/lang-*.js — чи не лишилася англійська замість перекладу, чи немає
 *     порожніх значень, кирилиці в латинських мовах, суперечливих повторів;
 *  2) таблиці інтерфейсу в assets/*.js — чи збігаються ключі нових мов з англійськими.
 *     Помилка в назві ключа тихо падає на англійську, тож її інакше не видно.
 */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const LANGS = ['de', 'pl', 'tr', 'lt', 'pt'];
let problems = 0;
const say = (s) => { console.log(s); };
const bad = (s) => { problems++; console.log('   ❌ ' + s); };

/* ---------------- 1) словники перекладу ---------------- */
const win = { TR_PACK: {} };
for (const l of LANGS) {
  const f = path.join(ROOT, 'data', `lang-${l}.js`);
  if (fs.existsSync(f)) new Function('window', fs.readFileSync(f, 'utf8'))(win);
}
// кирилиця в мовах із латинкою — майже завжди наслідок копіювання не того рядка
const CYR = /[Ѐ-ӿ]/;
/* Імена персонажів беремо з самих даних: Mia лишається Mia всіма мовами, і
   видавати це за неперекладений рядок — значить привчати не дивитися у звіт. */
const NAMES = (() => {
  try {
    const w = {};
    new Function('window', fs.readFileSync(path.join(ROOT, 'data', 'characters.js'), 'utf8'))(w);
    const out = new Set();
    for (const c of Object.values(w.CHARACTERS || {})) for (const v of Object.values(c || {})) {
      if (typeof v === 'string' && /^[A-ZÅÆØ][\p{L}'’ -]{1,20}$/u.test(v)) out.add(v);
    }
    return [...out];
  } catch (e) { return []; }
})();
// літери, без яких мова виглядає «англізованою»: якщо їх немає взагалі — варто глянути
const MARKS = { de: /[äöüßÄÖÜ]/, pl: /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/, tr: /[çğıöşüÇĞİÖŞÜ]/, lt: /[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]/, pt: /[ãõçáéíóúâêôàÃÕÇÁÉÍÓÚÂÊÔÀ]/ };

say('🔎 Словники перекладу (data/lang-*.js)\n');
for (const l of LANGS) {
  const pack = win.TR_PACK[l];
  say(`── ${l.toUpperCase()} ──`);
  if (!pack) { bad('словника немає'); continue; }
  const keys = Object.keys(pack);
  // слова, які в цій мові справді пишуться так само, як англійською
  const SAME_OK = {
    // назви мовних норм — власні назви, однакові в усіх мовах
    de: ['orange', 'a pizza', 'April', 'August', 'September', 'November', 'warm', 'Nynorsk', 'Bokmål'],
    pl: ['a pizza', 'Nynorsk', 'Bokmål', 'kutia'], tr: ['a pizza', 'Nynorsk', 'Bokmål'], lt: ['a pizza', 'Nynorsk', 'Bokmål'],
    // у португальській ці слова й технічні терміни справді пишуться так само
    pt: ['Aaaah...', 'waffles', 'hospital', 'kutia', 'plural', 'zero', 'horizontal', 'Inspector', 'Transform', 'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'phishing', 'HTTPS', 'ransomware', 'TLS', 'game over', 'Start', 'Update', 'Play Mode', 'Console', 'JOIN', 'CRUD', 'JSON', 'cyberbullying', 'individual', 'legal', 'malware', 'singular', 'chocolate', 'lactose', 'Nynorsk', 'Bokmål']
  };
  /* Слова, однакові в усіх наших мовах: міжнародні запозичення й звуки. Доти
     перевірка видавала їх за неперекладені, і через цей шум вона ніколи не
     закінчувалася зеленим — тобто нею переставали користуватися. */
  const SAME_ANY = ['online', 'plus', 'digital', 'permanent', 'protein', 'gluten', 'weekend', 'RIIING!', 'BEEEP! BEEEP!', 'Narrator'];
  const okSame = new Set([...(SAME_OK[l] || []), ...SAME_ANY, ...NAMES]);
  // точний збіг (з регістром) — майже напевно неперекладений рядок
  const same = keys.filter(k => String(pack[k]).trim() === String(k).trim() && !okSame.has(k));
  // збіг лише без регістру — часто нормально (нім. Butter, Pizza), тож це попередження
  const softSame = keys.filter(k => String(pack[k]).trim() !== String(k).trim()
    && String(pack[k]).trim().toLowerCase() === String(k).trim().toLowerCase());
  const empty = keys.filter(k => !String(pack[k]).trim());
  const cyr = keys.filter(k => CYR.test(String(pack[k])));
  const spaces = keys.filter(k => String(pack[k]) !== String(pack[k]).trim() || /\s{2,}/.test(String(pack[k])));
  // один і той самий переклад на кілька різних англійських рядків
  const byVal = {};
  for (const k of keys) { const v = String(pack[k]).trim().toLowerCase(); (byVal[v] = byVal[v] || []).push(k); }
  const dup = Object.entries(byVal).filter(([, ks]) => ks.length > 1);

  say(`   рядків: ${keys.length}`);
  if (same.length) { bad(`лишилася англійська (${same.length}): ${same.slice(0, 6).join(' · ')}`); }
  if (softSame.length) say(`   ⚠ слово збігається з англійським, лише регістр інший (${softSame.length}): ${softSame.slice(0, 6).join(' · ')}`);
  if (empty.length) { bad(`порожній переклад (${empty.length}): ${empty.slice(0, 6).join(' · ')}`); }
  if (cyr.length) { bad(`кирилиця в латинській мові (${cyr.length}): ${cyr.slice(0, 6).join(' · ')}`); }
  if (spaces.length) { bad(`зайві пробіли (${spaces.length}): ${spaces.slice(0, 6).join(' · ')}`); }
  if (dup.length) {
    say(`   ⚠ однаковий переклад для різних слів (${dup.length}) — буває правильно, але варто глянути:`);
    for (const [v, ks] of dup.slice(0, 6)) say(`      «${v}» ← ${ks.join(' · ')}`);
  }
  const m = MARKS[l];
  if (m && !keys.some(k => m.test(String(pack[k])))) bad('у жодному рядку немає діакритики цієї мови — схоже на підміну мови');
  if (!same.length && !empty.length && !cyr.length && !spaces.length) say('   ✔ машинних помилок немає');
  say('');
}

/* ---------------- 2) ключі інтерфейсу ---------------- */
say('\n🔎 Таблиці інтерфейсу (assets/*.js): чи збігаються ключі з англійськими\n');
// беремо верхньорівневі ключі блоку мови: «  xx: {» … до наступного «  yy: {» того ж рівня
function tables(src) {
  const out = {};
  const re = /^(\s{2,6})(uk|en|no|ar|de|pl|tr|lt):\s*\{/gm;
  let m;
  while ((m = re.exec(src))) {
    // тіло блоку — від відкритої дужки до парної їй закритої, з урахуванням рядків
    let i = src.indexOf('{', m.index), depth = 0, end = i, q = '';
    for (; i < src.length; i++) {
      const ch = src[i], prev = src[i - 1];
      if (q) { if (ch === q && prev !== '\\') q = ''; continue; }
      if (ch === "'" || ch === '"' || ch === '`') { q = ch; continue; }
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (!depth) { end = i; break; } }
    }
    const body = src.slice(m.index, end);
    // лише ключі першого рівня цього блоку
    const inner = new RegExp('^\\s{' + (m[1].length + 2) + '}([a-z_0-9]+):', 'gm');
    const keys = [...body.matchAll(inner)].map(x => x[1]);
    if (keys.length) out[m[2]] = new Set(keys);
  }
  return out;
}
const files = fs.readdirSync(path.join(ROOT, 'assets')).filter(f => f.endsWith('.js'));
let checked = 0;
for (const f of files) {
  const src = fs.readFileSync(path.join(ROOT, 'assets', f), 'utf8');
  const t = tables(src);
  if (!t.en || !LANGS.some(l => t[l])) continue;
  checked++;
  const notes = [];
  for (const l of LANGS) {
    if (!t[l]) continue;
    const missing = [...t.en].filter(k => !t[l].has(k));
    const extra = [...t[l]].filter(k => !t.en.has(k));
    if (missing.length) notes.push(`${l}: немає ${missing.length} (${missing.slice(0, 8).join(', ')})`);
    if (extra.length) notes.push(`${l}: зайві/помилка в назві ${extra.length} (${extra.slice(0, 8).join(', ')})`);
  }
  if (notes.length) { say(`── ${f} ──`); notes.forEach(bad); say(''); }
}
say(`   перевірено файлів із новими мовами: ${checked}`);

say(problems ? `\n❌ Знайдено проблем: ${problems}` : '\n✔ Помилок у перекладах не знайдено.');
process.exit(problems ? 1 : 0);
