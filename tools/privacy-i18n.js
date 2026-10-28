/* Комікс·Lab — 🌍 політика приватності іншими мовами.
 *
 *   node tools/privacy-i18n.js plan no ar de pl tr lt
 *   node tools/privacy-i18n.js merge no ar de pl tr lt
 *
 * Сторінка privacy.html тримає всі мови в одному файлі, розділами <section id="мова">,
 * і перемикач угорі просто гортає до потрібного. Англійський і український розділи
 * написані руками — їх не чіпаємо; решту мов дописуємо поруч.
 *
 * Перекладаємо не весь файл, а кожен блок окремо (абзац, пункт, клітинку таблиці):
 * так розмітка лишається на місці, а якщо модель загубить тег — видно, який саме
 * рядок відкинути. Блок із поламаною розміткою не беремо зовсім: у політиці
 * приватності зіпсоване посилання на пошту гірше за англійський абзац.
 */
const fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..');
const WORK = path.join(__dirname, '.i18n');
const PAGE = path.join(ROOT, 'privacy.html');
const NAMES = { no: 'Norwegian (Bokmål)', ar: 'Arabic', de: 'German', pl: 'Polish', tr: 'Turkish', lt: 'Lithuanian', pt: 'Brazilian Portuguese (pt-BR)' };
const LABEL = { no: 'Norsk', ar: 'العربية', de: 'Deutsch', pl: 'Polski', tr: 'Türkçe', lt: 'Lietuvių', pt: 'Português' };
const RTL = new Set(['ar']);

const BLOCK = /<(h2|h3|p|li|th|td)\b([^>]*)>([\s\S]*?)<\/\1>/g;
const KEYBOX = /<div class="key">([\s\S]*?)<\/div>/g;

function enSection() {
  const src = fs.readFileSync(PAGE, 'utf8');
  const i = src.indexOf('<section id="en">');
  const j = src.indexOf('</section>', i);
  if (i < 0 || j < 0) throw new Error('не знайдено англійського розділу в privacy.html');
  return src.slice(i, j + '</section>'.length);
}

/* Блоки для перекладу: текст усередині, разом із посиланнями й <code>. */
function blocks(section) {
  const out = [];
  const push = (text, kind) => { if (/[A-Za-z]{3}/.test(text)) out.push({ text: text.trim(), kind }); };
  for (const m of section.matchAll(KEYBOX)) push(m[1], 'key');
  for (const m of section.matchAll(BLOCK)) push(m[3], m[1]);
  return out;
}

const tags = s => (String(s).match(/<[^>]+>/g) || []).map(t => t.replace(/\s+/g, ' ').trim());

function plan(langs) {
  const sec = enSection();
  const list = blocks(sec);
  fs.mkdirSync(WORK, { recursive: true });
  fs.writeFileSync(path.join(WORK, 'privacy-en.json'), JSON.stringify(list, null, 1), 'utf8');
  for (const lang of langs) {
    const lines = [];
    for (let i = 0; i < list.length; i += 8) {
      const items = list.slice(i, i + 8).map((b, j) => ({
        k: String(j + 1), key: String(i + j), en: b.text, no: '',
        hint: 'a block of a privacy policy; keep every HTML tag, link and <code> exactly as it is, in the same order, and keep email addresses and package names unchanged',
      }));
      lines.push(JSON.stringify({ id: `${lang}-priv-${i / 8 + 1}`, lang, langName: NAMES[lang] || lang, kind: 'pages', items }));
    }
    fs.writeFileSync(path.join(WORK, `jobs-priv-${lang}.jsonl`), lines.join('\n') + '\n', 'utf8');
    console.log(`📜 ${lang}: ${list.length} блоків → ${lines.length} запитів`);
  }
}

function merge(langs) {
  const sec = enSection();
  const list = blocks(sec);
  let page = fs.readFileSync(PAGE, 'utf8');
  const crlf = page.includes('\r\n');
  if (crlf) page = page.replace(/\r\n/g, '\n');

  for (const lang of langs) {
    const jobsF = path.join(WORK, `jobs-priv-${lang}.jsonl`), outF = path.join(WORK, `out-priv-${lang}.jsonl`);
    if (!fs.existsSync(jobsF) || !fs.existsSync(outF)) { console.log(`⚠ ${lang}: немає завдань або відповідей`); continue; }
    const jobs = new Map();
    for (const row of fs.readFileSync(jobsF, 'utf8').split('\n')) if (row.trim()) { const j = JSON.parse(row); jobs.set(j.id, j); }
    const got = {};
    let bad = 0;
    for (const row of fs.readFileSync(outF, 'utf8').split('\n')) {
      if (!row.trim()) continue;
      let r; try { r = JSON.parse(row); } catch (e) { continue; }
      const job = jobs.get(r.id);
      if (!job || !r.ok || !r.map) continue;
      for (const it of job.items) {
        const v = r.map[it.k];
        if (typeof v !== 'string' || !v.trim()) { bad++; continue; }
        /* Теги мусять лишитися ті самі й у тому ж порядку. */
        if (tags(v).join('|') !== tags(it.en).join('|')) { bad++; continue; }
        got[it.key] = v.trim();
      }
    }
    const done = Object.keys(got).length;
    if (done < list.length * 0.9) { console.log(`⚠ ${lang}: прийнято лише ${done} з ${list.length} блоків — розділ не роблю`); continue; }

    /* Збираємо розділ: той самий англійський каркас, але з перекладеними
       блоками. Чого не переклали — лишається англійським; такий абзац видно
       одразу, і він не бреше. */
    let n = 0, idx = 0;
    const byIdx = i => got[String(i)];
    let out = sec.replace(KEYBOX, (m, inner) => { const t = byIdx(idx++); n += t ? 1 : 0; return `<div class="key">${t || inner}</div>`; });
    out = out.replace(BLOCK, (m, tag, attrs, inner) => { const t = byIdx(idx++); n += t ? 1 : 0; return `<${tag}${attrs}>${t || inner}</${tag}>`; });
    out = out.replace('<section id="en">', `<section id="${lang}" lang="${lang}"${RTL.has(lang) ? ' dir="rtl"' : ''}>`);

    const marker = `<section id="${lang}"`;
    if (page.includes(marker)) {
      const s0 = page.indexOf(marker);
      const s1 = page.indexOf('</section>', s0) + '</section>'.length;
      page = page.slice(0, s0) + out + page.slice(s1);
    } else {
      const at = page.lastIndexOf('</main>');
      page = page.slice(0, at) + out + '\n\n' + page.slice(at);
    }
    /* Посилання в перемикачі — щоб розділ можна було знайти. */
    const link = `      <a href="#${lang}">${LABEL[lang] || lang}</a>\n`;
    if (!page.includes(`href="#${lang}"`)) page = page.replace('      <a href="https://bilohash.com/comiks/">', link + '      <a href="https://bilohash.com/comiks/">');
    console.log(`📜 ${lang}: ${n} блоків перекладено${bad ? ` · відкинуто ${bad}` : ''}`);
  }
  if (crlf) page = page.replace(/\n/g, '\r\n');
  fs.writeFileSync(PAGE, page, 'utf8');
}

const cmd = process.argv[2];
const langs = process.argv.slice(3).filter(x => !x.startsWith('-'));
if (cmd === 'plan') plan(langs.length ? langs : Object.keys(NAMES));
else if (cmd === 'merge') merge(langs.length ? langs : Object.keys(NAMES));
else { console.log('node tools/privacy-i18n.js plan|merge [no ar de pl tr lt]'); process.exit(1); }
