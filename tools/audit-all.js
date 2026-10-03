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
