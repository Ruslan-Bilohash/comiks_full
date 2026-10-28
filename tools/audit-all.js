/* Комікс·Lab — 🩺 повна перевірка проєкту одним запуском.
 *
 *   node tools/audit-all.js
 *
 * Збирає всі окремі перевірки в один звіт, щоб перед релізом не забути жодної:
 *   check.js        — чи має кожне норвезьке слово переклад uk/en
 *   check-lang.js   — чи немає помилок у словниках і таблицях інтерфейсу
 *   audit-lang.js   — цілість коміксів і покриття перекладом
 *   audit-audio.js  — чи кожен текст, який озвучує сайт, має запис
 *   плюс власні перевірки: секрети в dist, розмір застосунку, матеріали для стору.
 */
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');

let fails = 0;
const line = () => console.log('─'.repeat(64));
function step(title, fn) {
  console.log(`\n▶ ${title}`);
  try { fn(); } catch (e) { fails++; console.log('   ✖ ' + (e.message || e)); }
}
function run(script, args = []) {
  const out = execFileSync(process.execPath, [path.join(__dirname, script), ...args], { cwd: ROOT, encoding: 'utf8' });
  process.stdout.write(out.split('\n').map(l => (l ? '   ' + l : '')).join('\n'));
}
const size = d => (fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true })
  .reduce((n, e) => n + (e.isDirectory() ? size(path.join(d, e.name)) : fs.statSync(path.join(d, e.name)).size), 0) : 0);
const mb = n => (n / 1048576).toFixed(1) + ' МБ';

console.log('🩺 Комікс·Lab — перевірка перед релізом');
line();

step('Дані коміксів і словник', () => run('check.js'));
step('Помилки в перекладах', () => run('check-lang.js'));
step('Цілість коміксів і покриття мовами', () => run('audit-lang.js'));
step('Озвучення', () => { if (fs.existsSync(path.join(__dirname, 'audit-audio.js'))) run('audit-audio.js'); else console.log('   (audit-audio.js немає)'); });

/* Журнал оновлень пишуть не лише руками, а й скриптами, і там легко лишити
   опис емодзі замість самого емодзі («\\u{1F30D}») або порожній рядок. На
   сторінці це видно як дивний текст і порожній пункт — краще ловити тут. */
step('Журнал оновлень', () => {
  const vm = require('vm');
  const w = {}; w.window = w; vm.createContext(w);
  for (const f of ['data/updates.js', 'data/updates-lang.js']) {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), w, { filename: f });
  }
  const list = w.KOMIKS_UPDATES || [];
  const tr = w.KOMIKS_UPDATES_TR || {};
  const bad = [];
  const look = (where, rows) => (rows || []).forEach((r, i) => {
    const s = String(r);
    if (!s.trim()) bad.push(`${where}[${i}] порожній`);
    if (/\\u\{/.test(s)) bad.push(`${where}[${i}] емодзі лишилося текстом: ${s.slice(0, 24)}`);
  });
  for (const u of list) {
    if (isNaN(new Date(String(u.id).slice(0, 10)))) bad.push(`${u.id}: з ідентифікатора не виходить дата`);
    for (const l of ['uk', 'en', 'no', 'ar']) if (u[l]) look(`${u.id}/${l}`, u[l]);
  }
  for (const [l, byId] of Object.entries(tr)) for (const [id, rows] of Object.entries(byId)) look(`${id}/${l}`, rows);
  console.log(`   записів: ${list.length} · мов із перекладом: ${Object.keys(tr).length + 4}`);
  if (bad.length) { bad.slice(0, 6).forEach(b => console.log('   ✖ ' + b)); throw new Error(`зламаних рядків: ${bad.length}`); }
  console.log('   ✔ порожніх рядків і неперетворених емодзі немає');
});

/* Вітрина ігор живе з трьох джерел одразу: паспорт у data/games.js, проза в
   assets/games.js і знімки в img/games. Варто випасти одному — і сторінка
   виходить із порожньою назвою або битою картинкою, причому мовчки. */
step('Каталог ігор', () => {
  const vm = require('vm');
  const w = {}; w.window = w; vm.createContext(w);
  const f = path.join(ROOT, 'data', 'games.js');
  if (!fs.existsSync(f)) { console.log('   (ігор у каталозі немає)'); return; }
  vm.runInContext(fs.readFileSync(f, 'utf8'), w, { filename: 'games.js' });
  const games = w.KOMIKS_GAMES || [];
  const text = require('./games-text.js')();
  const LANGS = ['en', 'no', 'uk', 'de', 'pl', 'tr', 'lt', 'ar'];
  const bad = [];
  for (const l of LANGS) {
    if (!text[l]) { bad.push(`немає тексту мовою «${l}»`); continue; }
    for (const k of ['h1', 'lead', 'meta_t', 'meta_d', 'play', 'note_age']) if (!String(text[l][k] || '').trim()) bad.push(`${l}: порожнє «${k}»`);
    if (!Array.isArray(text[l].caps) || text[l].caps.length !== 4) bad.push(`${l}: підписів до знімків не чотири`);
  }
  for (const g of games) {
    if (!/^https?:\/\//.test(String(g.url || ''))) bad.push(`${g.id}: немає адреси гри`);
    for (const sh of (g.shots || [])) {
      const img = path.join(ROOT, 'img', 'games', sh + '.jpg');
      if (!fs.existsSync(img)) bad.push(`${g.id}: немає знімка ${sh}.jpg — зніміть: node tools/shots-game.js`);
    }
    for (const l of (g.langs || [])) if (!g.name[l] || !g.keys[l] || !(g.camp || {})[l]) bad.push(`${g.id}: мова «${l}» заявлена, але тексту гри нею немає`);
  }
  console.log(`   ігор: ${games.length} · знімків: ${games.reduce((n, g) => n + (g.shots || []).length, 0)} · мов сторінки: ${LANGS.filter(l => text[l]).length}`);
  if (bad.length) { bad.slice(0, 6).forEach(b => console.log('   ✖ ' + b)); throw new Error(`дірок у каталозі ігор: ${bad.length}`); }
  console.log('   ✔ паспорт, текст вісьмома мовами й знімки на місці');
});

step('Збірка dist/', () => {
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) throw new Error('немає dist/ — зберіть: node tools/build.js');
  console.log(`   розмір: ${mb(size(dist))}`);
  // у збірку не можна класти конфіг із паролями й аварійний інсталятор
  for (const bad of ['api/config.php', 'api/config.local.php', 'install.php']) {
    if (fs.existsSync(path.join(dist, bad))) { fails++; console.log(`   ✖ у dist потрапив ${bad} — прибрати!`); }
  }
  const secrets = [];
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== 'audio') walk(p); continue; }
    if (!/\.(php|js|html|json|webmanifest)$/i.test(e.name)) continue;
    const t = fs.readFileSync(p, 'utf8');
    if (/sk-proj-[A-Za-z0-9]|sk_live_[A-Za-z0-9]|whsec_[A-Za-z0-9]/.test(t)) secrets.push(path.relative(dist, p));
  } };
  walk(dist);
  if (secrets.length) { fails++; console.log('   ✖ схоже на справжні ключі: ' + secrets.join(', ')); }
  else console.log('   ✔ ні конфігів, ні ключів у збірці немає');
});

/* build.js копіює PHP за явним переліком. Новий модуль, який забули туди
   дописати, у dist/ не потрапляє — а файл, що його підключає, потрапляє. На
   сервері, куди модуль колись залили руками, усе працює; чисте встановлення з
   dist/ падає з фатальною помилкою. Так було з admin-auth.php 23 жовтня. */
step('PHP-залежності в dist/', () => {
  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) return;
  const missing = [];
  let files = 0, reqs = 0;
  const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!['audio', 'data', 'img', 'photo', 'icons'].includes(e.name) || d !== dist) walk(p); continue; }
    if (!e.name.endsWith('.php')) continue;
    files++;
    const src = fs.readFileSync(p, 'utf8');
    /* Лише прості шляхи від __DIR__ — їх можна перевірити без PHP. config.php
       і config.local.php навмисно не кладуться в dist, їх пропускаємо. */
    for (const m of src.matchAll(/\b(?:require|include)(?:_once)?\s*\(?\s*__DIR__\s*\.\s*'([^']+\.php)'/g)) {
      reqs++;
      const target = path.normalize(path.join(path.dirname(p), m[1]));
      if (/config(\.local)?\.php$/.test(target)) continue;
      if (!fs.existsSync(target)) missing.push(path.relative(dist, p) + ' → ' + m[1]);
    }
  } };
  walk(dist);
  console.log(`   PHP-файлів: ${files} · підключень: ${reqs}`);
  if (missing.length) { fails++; missing.slice(0, 8).forEach(x => console.log('   ✖ немає в dist: ' + x)); console.log('   Допишіть файл у перелік копіювання в tools/build.js.'); }
  else console.log('   ✔ кожне підключення веде на файл, що є в збірці');
});

step('Вміст застосунку app/www', () => {
  const www = path.join(ROOT, 'app', 'www');
  if (!fs.existsSync(www)) { console.log('   (ще не зібрано: node app/tools/prepare-web.js --light)'); return; }
  const s = size(www);
  const audio = fs.existsSync(path.join(www, 'audio')) ? fs.readdirSync(path.join(www, 'audio')).length : 0;
  console.log(`   розмір: ${mb(s)} · озвучень офлайн: ${audio}`);
  if (s > 150 * 1048576) { fails++; console.log('   ✖ завеликий для стору — зберіть із --light'); }
  const html = fs.readFileSync(path.join(www, 'index.html'), 'utf8');
  if (!html.includes('KOMIKS_API_BASE')) { fails++; console.log('   ✖ немає перенаправлення api/ на сайт'); }
  if (!html.includes("credentials: 'include'")) { fails++; console.log('   ✖ немає credentials include — вхід не працюватиме'); }
  if (!fails) console.log('   ✔ сервер і кукі налаштовані правильно');
});

step('Матеріали для магазину', () => {
  const dir = path.join(ROOT, 'store', 'android');
  const need = [['feature-graphic.png', 1024, 500], ['icon-512.png', 512, 512]];
  if (!fs.existsSync(dir)) { fails++; console.log('   ✖ немає store/android — зберіть: python tools/gen-feature.py'); return; }
  for (const [f] of need) {
    if (!fs.existsSync(path.join(dir, f))) { fails++; console.log(`   ✖ немає ${f}`); }
  }
  const shots = fs.readdirSync(dir).filter(f => /^\d\d-.*\.png$/.test(f));
  console.log(`   знімків екрана: ${shots.length}` + (shots.length < 2 ? '  ✖ потрібно щонайменше 2' : '  ✔'));
  if (shots.length < 2) fails++;
  if (fs.existsSync(path.join(dir, 'feature-graphic.png'))) console.log('   ✔ банер 1024×500 на місці');
});

line();
console.log(fails ? `\n❌ Треба виправити: ${fails}` : '\n✅ Усе гаразд — можна публікувати.');
process.exit(fails ? 1 : 0);
