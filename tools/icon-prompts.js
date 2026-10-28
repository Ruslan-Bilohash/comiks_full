/* Комікс·Lab — документ із підказками (промптами) для іконок усіх тем слів:
 *   node tools/icon-prompts.js            → icon-prompts.txt у корені проєкту
 * Для кожної теми: список слів з ім'ям файлу, перекладом і готовим промптом; слова, що вже мають
 * картинку (data/word-photos.js, data/words-tools.js, мальовані pics*.js), позначені ✅ — їх генерувати не треба.
 * Готовий архів потім: python tools/word_icons.py <архів.zip> <тема> → дописати слова в SETS (data/word-photos.js). */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = global;
global.document = { createElement: () => ({}) };
for (const f of ['data/words.js', 'data/words2.js', 'data/words3.js', 'data/words4.js']) require(path.join(ROOT, f));
require(path.join(ROOT, 'assets/pics.js'));
for (const f of ['assets/pics2.js', 'assets/pics3.js', 'assets/pics4.js', 'assets/pics5.js', 'assets/pics6.js', 'assets/pics7.js']) { try { require(path.join(ROOT, f)); } catch { /* без DOM деякі файли мовчать */ } }
require(path.join(ROOT, 'data/words-tools.js'));
require(path.join(ROOT, 'data/word-photos.js'));
require(path.join(ROOT, 'data/word-photos-gen.js'));

const P = window.KomiksPics;
const norm = w => String(w).toLowerCase().replace(/^(en|ei|et|å)\s+/, '').trim();
// ім'я файлу латиницею: 01_en_laerer.png — як у вже готових архівах
const slug = w => String(w).toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const photoOf = w => (P.photo ? P.photo(w[0], w[1]) : '');

const STYLE = [
  'СТИЛЬ (однаковий для всіх файлів):',
  'Friendly colorful 3D educational flashcard icon, soft studio lighting, clean polished look, front three-quarter view,',
  'single subject centered with 10% padding, NO text, NO letters, NO numbers, NO watermark, NO border, NO frame.',
  '',
  'ВИМОГИ ДО ФАЙЛІВ (важливо — інакше картинку не вийде використати):',
  '1. Кожна картинка — ОКРЕМИЙ файл PNG 1024×1024, а не колаж/аркуш, який потім ріжуть на шматки.',
  '2. Справжнє прозоре тло (альфа-канал). НЕ малювати «шахівницю» замість прозорості.',
  '   Якщо генератор не вміє прозорість — однотонне тло чисто-пурпурового кольору #FF00FF (його приберемо самі).',
  '   Не прибирати тло автоматично «чарівною паличкою»: вона стирає білі частини предметів (білий кіт, сніг, унітаз).',
  '3. Ім\'я файлу — як у списку нижче (номер_слово.png), архів .zip на тему.',
  '4. Для дієслів, прикметників і фраз — проста зрозуміла сцена з 1–2 персонажами в тому ж стилі; без тексту на картинці.',
  ''
].join('\n');

const themes = window.WORDS.themes;
let total = 0, done = 0;
const out = [];
out.push('КОМІКС·LAB — ПРОМПТИ ДЛЯ ІКОНОК УСІХ ТЕМ СЛІВ', `Згенеровано: ${new Date().toISOString().slice(0, 10)} (node tools/icon-prompts.js)`, '', STYLE);
const summary = [];
for (const th of themes) {
  const rows = th.words.map((w, i) => ({ w, n: String(i + 1).padStart(2, '0'), has: !!photoOf(w) }));
  const need = rows.filter(r => !r.has);
  total += rows.length; done += rows.length - need.length;
  summary.push(`${th.icon} ${th.uk} (${th.id}) — ${rows.length - need.length}/${rows.length} готово${need.length ? `, треба ${need.length}` : ' ✅'}`);
  out.push('='.repeat(78));
  out.push(`${th.icon} ${th.uk} / ${th.no} / ${th.en}   ·   тема: ${th.id}   ·   рівень ${th.level}`);
  out.push(`Архів: ${th.id}_norwegian_${rows.length}.zip   ·   готово ${rows.length - need.length} з ${rows.length}`);
  out.push(`Потім: python tools/word_icons.py "<архів>.zip" ${th.id}`);
  out.push('-'.repeat(78));
  for (const r of rows) {
    const [no, uk, en, emoji] = r.w;
    const file = `${r.n}_${slug(no)}.png`;
    if (r.has) { out.push(`✅ ${file} | ${no} | ${uk} — вже є картинка`); continue; }
    out.push(`${file} | ${no} | ${uk} | ${en} ${emoji || ''}`);
    out.push(`   Prompt: Friendly colorful 3D educational flashcard icon that clearly shows "${en}" (Norwegian: ${no}). Single subject, centered, true transparent background, no text, no letters, no numbers.`);
  }
  out.push('');
}
out.splice(4, 0, `РАЗОМ: тем ${themes.length}, слів ${total}, уже з картинками ${done}, треба згенерувати ${total - done}.`, '', 'ЗМІСТ:', ...summary, '');
const file = path.join(ROOT, 'icon-prompts.txt');
fs.writeFileSync(file, '﻿' + out.join('\r\n'), 'utf8');
console.log(`✔ ${file} · тем ${themes.length} · слів ${total} · з картинками ${done} · треба ${total - done}`);
