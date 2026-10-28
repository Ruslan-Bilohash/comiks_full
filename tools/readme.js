#!/usr/bin/env node
/* Комікс·Lab — README.md для GitHub із самих даних проєкту.
 *
 *   node tools/readme.js            → README.md у корені
 *   node tools/readme.js --out=X    → в інший файл (наприклад, у теку експорту)
 *
 * Цифри (комікси, слова, теми, мови) і журнал «Що нового» беремо з data/,
 * а не пишемо руками: README, що відстає від сайту на сто коміксів, гірший
 * за відсутній. Знімки — img/shots/*.png (знімає tools/shots.js).
 */
'use strict';
const fs = require('fs'), path = require('path');
const load = require('./load.js');
const ROOT = load.ROOT;
const outArg = process.argv.find(a => a.startsWith('--out='));
const OUT = outArg ? path.resolve(outArg.slice(6)) : path.join(ROOT, 'README.md');

const W = load({ skipAudio: true });
const comics = W.COMICS.filter(c => !c._private);
const byLevel = {};
for (const c of comics) byLevel[c.level] = (byLevel[c.level] || 0) + 1;
const themes = (W.WORDS || {}).themes || [];
const words = themes.reduce((n, t) => n + (t.words || []).length, 0);
const grammar = ((W.GRAMMAR || {}).topics || []).length;
const english = ((W.ENGLISH || {}).comics || []).length;
const koding = comics.filter(c => c.category === 'koding').length;
const cats = Object.values(W.BASICS.categories || {}).map(c => (c.icon ? c.icon + ' ' : '') + (c.uk || c.en)).map(s => s.toLowerCase());

const upd = (() => { const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'data/updates.js'), 'utf8'))(w); return w.KOMIKS_UPDATES || []; })();
const day = id => id.slice(0, 10).split('-').reverse().join('.');

const SHOTS = [
  ['home', 'Головна'], ['read', 'Комікс з озвученням'], ['quiz', 'Тест норвезькою'],
  ['words', 'Слова за темами'], ['cross', 'Кросворд з картинками'], ['cards', 'Картки'],
  ['grammar', 'Граматика'], ['alphabet', 'Алфавіт'], ['today', 'Сьогодні'],
  ['game', 'Гра разом (QR)'], ['race', 'Логік-гонка'], ['math', 'Математика'],
  ['english', 'Курс англійської'], ['exam', 'Пробний іспит'], ['write', 'Письмо'],
  ['call', 'Дзвінок'], ['fractions', 'Дроби'], ['whatsnew', 'Що нового'],
].filter(([f]) => fs.existsSync(path.join(ROOT, 'img/shots', f + '.png')));
const gallery = [];
for (let i = 0; i < SHOTS.length; i += 3) {
  gallery.push('<tr>' + SHOTS.slice(i, i + 3).map(([f, t]) =>
    `<td align="center" width="33%"><img src="img/shots/${f}.png" width="220" alt="${t}"><br><sub>${t}</sub></td>`).join('') + '</tr>');
}

const news = upd.map(u => `### ${u.icon || '✨'} ${day(u.id)}${u.link ? ` · [відкрити](https://bilohash.com/comiks/${u.link})` : ''}\n`
  + (u.uk || u.en || []).map(x => `- ${x}`).join('\n')).join('\n\n');

const md = `# Комікс·Lab — вчимо норвезьку через комікси

**Komiks·Lab** — безкоштовний тренажер норвезької мови (bokmål) для дітей і дорослих: намальовані історії A1–B2
з живими норвезькими голосами, переклад при наведенні, тести норвезькою, слова з картинками, граматика,
ігри для класу з QR-кодом і особистий кабінет.

🌐 **Сайт:** https://bilohash.com/comiks/ · 📱 Android (Google Play) · 🪟 Windows (Microsoft Store)

> *English:* Komiks·Lab is a free app for learning Norwegian (Bokmål) through illustrated comics with native-like
> neural voices, hover translations, quizzes in Norwegian, picture vocabulary, grammar and classroom games via QR code.

| | |
|---|---|
| 📚 Коміксів | **${comics.length}** (A1 ${byLevel.A1 || 0} · A2 ${byLevel.A2 || 0} · B1 ${byLevel.B1 || 0} · B2 ${byLevel.B2 || 0}) |
| 💻 Програмування для дітей | **${koding}** коміксів + гра «Robo lærer å kode» |
| 🇬🇧 Курс англійської | **${english}** історій |
| 📝 Слова за темами | **${words}** слів у **${themes.length}** темах, більшість — з картинками |
| 📐 Граматика | **${grammar}** тем з правилами, таблицями й тестами |
| 🌍 Мови інтерфейсу | українська, English, norsk, Deutsch, Polski, Türkçe, Lietuvių, العربية |
| 🔊 Озвучення | нейроголоси для кожної репліки, слова, літери й числа |

## Як це виглядає

<table>
${gallery.join('\n')}
</table>

## Що є
- **Комікси** за темами: ${cats.join(', ')}. Кожна репліка озвучена, переклад — при наведенні.
- **Тести норвезькою** після кожного коміксу, тести рівнів A1–B2, граматика, слова, алфавіт, числа, годинник; складність kids/adults/hard/expert; аналіз помилок і повторення.
- **Слова за темами** з картинками, картки «Знаю / Не знаю», «Пари», **кросворд з картинками**, розумний пошук.
- **Граматика, алфавіт і звуки, числа, годинник, дроби, математика** (таблиця множення, 🚀 Math Rocket).
- **Ігри разом**: вікторина з QR-кодом для класу й родини, Логік-гонка, шахи, Math Rocket «з класом».
- **💻 Програмування для дітей**: комікси про алгоритми, цикли, умови, HTML і гра з рівнями, що зберігає прогрес.
- **Кабінет**: аватар-студія, план навчання, серія днів, значки, друзі, профіль гравця, рейтинг.
- **Сьогодні**: жива сцена дня з завданнями й «Лінквіз дня».
- **Пробний іспит Norskprøven**, письмо з перевіркою, «дзвінок» персонажа.
- **Доступність**: розмір тексту, контраст, шрифт для легкого читання, зупинка анімацій.

## Запуск локально
Чистий HTML/CSS/JS без збірки. Відкрийте \`index.html\` або запустіть сервер:
\`\`\`
python -m http.server 8950
\`\`\`
і відкрийте http://localhost:8950/. Серверна частина (акаунти, стіна, адмінка) — PHP 7.4+ з MySQL або SQLite у \`api/\`;
налаштування — \`api/config.sample.php\` → \`api/config.php\` (у репозиторій не входить).

## Збірка й публікація
\`\`\`
node tools/check.js        # перевірка коміксів, перекладів, граматики
node tools/build.js        # версія, SEO-сторінки, dist/
node tools/audit-all.js    # підсумкова перевірка
node tools/deploy.js       # заливання dist/ на хостинг
\`\`\`
Новий комікс — \`node tools/new-comic.js <номер> "Norsk tittel" "Українська назва"\`, поля — \`data/_template.js\`,
повна інструкція — \`CLAUDE.md\`.

## Що в цьому репозиторії немає
- **Озвучення** (\`audio/*.mp3\`, понад 150 МБ) — генерується \`tools/gen_audio.py\` (edge-tts).
- **Паролі, ключі API й база даних** — \`api/config.php\`, \`api/config.local.php\`, \`api/data/\`, дампи SQL.

## ✨ Що нового

${news}

---
🤖 Історії, персонажі, малюнки й голоси вигадані та створені за допомогою штучного інтелекту.
© ${new Date().getFullYear()} Komiks·Lab · [bilohash.com/comiks](https://bilohash.com/comiks/)
`;
fs.writeFileSync(OUT, md, 'utf8');
console.log(`✔ ${path.relative(ROOT, OUT) || OUT} · коміксів ${comics.length} · слів ${words} · записів «Що нового» ${upd.length} · знімків ${SHOTS.length}`);
