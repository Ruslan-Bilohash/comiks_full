/* Комікс·Lab — готовий промпт для ChatGPT на ще не намальовані слова:
 *   node tools/chatgpt-prompt.js [тема,тема]   → chatgpt-prompt.txt у корені проєкту
 * Формат збігається з тим, що читає tools/import_word_images.py: файли img/words/<тема>/<слово>.png
 * + manifest.json. Слова, що вже мають картинку, у список не потрапляють. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = global;
global.document = { createElement: () => ({}) };
for (const f of ['data/words.js', 'data/words2.js', 'data/words3.js', 'data/words4.js']) require(path.join(ROOT, f));
require(path.join(ROOT, 'assets/pics.js'));
require(path.join(ROOT, 'data/words-tools.js'));
require(path.join(ROOT, 'data/word-photos.js'));
require(path.join(ROOT, 'data/word-photos-gen.js'));
const P = window.KomiksPics;
// node tools/chatgpt-prompt.js [теми,…] [--redo теми,…] — --redo: ці теми перемалювати ПОВНІСТЮ в новому стилі
const args = process.argv.slice(2);
const ri = args.indexOf('--redo');
const redo = ri >= 0 ? (args[ri + 1] || '').split(',').filter(Boolean) : [];
const only = (args.find((a, i) => !a.startsWith('--') && i !== ri + 1) || '').split(',').filter(Boolean);
// ім'я файлу так, як його розпізнає import_word_images.py --dir: без артикля, æ→ae, ø→o, å→aa
const slug = w => String(w).toLowerCase().replace(/^(en|ei|et|å)\s+/, '').replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'aa').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

const themes = window.WORDS.themes.filter(t => !only.length || only.includes(t.id));
const lists = [];
let total = 0;
for (const th of themes) {
  const need = redo.includes(th.id) ? th.words : th.words.filter(w => !P.photo(w[0], w[1]));
  if (!need.length) continue;
  const used = new Set();
  const rows = need.map(w => {
    let f = slug(w[0]);
    if (used.has(f)) f = th.id + '_' + f;            // однакові слова в одній темі — з префіксом теми
    used.add(f);
    return `${f}.png | ${w[0]} | ${w[2]} | ${w[1]}`;
  });
  total += rows.length;
  lists.push(`### ${th.id} — ${th.en} (${th.uk}) · рівень ${th.level} · ${rows.length} шт.${redo.includes(th.id) ? ' · ПЕРЕМАЛЮВАТИ ВСЮ ТЕМУ в новому стилі (замінюємо старі картинки)' : ''}\n` + rows.join('\n'));
}

// 🔤 літери алфавіту без картинки (data/alphabet-pics.js) — окремим розділом
require(path.join(ROOT, 'data/basics.js')); require(path.join(ROOT, 'data/alphabet-pics.js'));
const AP = window.ALPHA_PICS || {};
const pre = L => ({ 'Æ': 'ae', 'Ø': 'oe', 'Å': 'aa' })[L] || L.toLowerCase();
const alphaRows = window.BASICS.alphabet.filter(a => !AP[a[0]]).map(a => `${pre(a[0])}_${slug(a[2])}.png | ${a[2]} | ${a[5]} | ${a[4]}   (літера ${a[0]})`);
if (alphaRows.length && (!only.length || only.includes('alphabet'))) { lists.push(`### alphabet — Alphabet (Алфавіт) · ${alphaRows.length} шт. · файли в img/alphabet/ (не img/words/)\n` + alphaRows.join('\n')); total += alphaRows.length; }

const text = `Ти — ілюстратор навчальних карток для сайту вивчення норвезької Komiks·Lab.
Згенеруй ${total} окремих картинок для слів зі списку нижче.

СТИЛЬ (однаковий для всіх, як у вже готових картках):
Colorful premium 3D cartoon educational icon, soft rounded shapes, beautiful realistic materials, vibrant colors,
professional studio lighting, subtle ambient occlusion, polished mobile learning app aesthetic, centered composition,
one main subject, full object visible with 10% safe margins on every side, crisp clean silhouette.
Персонажі (коли потрібні) — ті самі: хлопчик у синій худі та дівчинка у фіолетовому светрі, дружні, 3D-мультяшні.

ТЕХНІЧНІ ВИМОГИ (обов'язково — інакше картинку не вийде використати):
1. Кожне слово — ОКРЕМИЙ файл PNG 512×512, RGBA, СПРАВЖНЄ прозоре тло (альфа-канал).
   НЕ колаж і НЕ аркуш із кількома картинками. НЕ малювати сіро-білу «шахівницю» замість прозорості.
   Якщо прозорість неможлива — суцільне тло кольору #FF00FF (його приберемо самі).
2. Без жодного тексту, літер, цифр, підписів, рамок і водяних знаків на картинці.
3. Не обрізати предмет краями й не прибирати тло «чарівною паличкою»: білі частини (сніг, папір, білий одяг) мають лишитися.
4. Ім'я файлу — точно як у першій колонці списку. Файли клади в теку img/words/<тема>/ (тема — назва розділу ###).
5. Наприкінці дай архів ZIP з теками тем і файлом manifest.json:
   { "items": [ { "category": "<тема>", "norwegian": "<слово як у списку>", "ukrainian": "<переклад>", "filename": "<файл>.png" }, … ] }

ЯК МАЛЮВАТИ РІЗНІ ВИДИ СЛІВ:
• Предмети й місця — сам предмет крупно.
• Дієслова — персонаж, який виконує дію (одна чітка дія).
• Прикметники й почуття — персонаж або предмет, на якому видно ознаку (великий/маленький, сумний, швидкий…).
• Протилежності — лише ОДНА сторона, яка є в слові (для «stor» — великий слон, не порівняння двох).
• Абстрактні слова, фрази й питальні слова — проста зрозуміла сцена-символ без тексту
  (напр. «hvor?» — персонаж із картою й знаком питання-жестом, «takk» — персонаж дарує квітку, «miljø» — зелена планета).
• Числа й кількість — групи предметів потрібної кількості (без цифр на картинці).
• Напрямки (venstre, høyre, opp, ned…) — персонаж і велика 3D-стрілка.
Головне: дитина має впізнати слово з картинки без підпису.

ФОРМАТ СПИСКУ: файл.png | норвезькою | англійською | українською

${lists.join('\n\n')}

Можна робити частинами: по одній-дві теми за раз, кожна — окремий ZIP з manifest.json (або просто файли в img/words/<тема>/).
`;
const out = path.join(ROOT, 'chatgpt-prompt.txt');
fs.writeFileSync(out, '﻿' + text.replace(/\n/g, '\r\n'), 'utf8');
console.log(`✔ ${out} · тем ${lists.length} · слів ${total}`);
