#!/usr/bin/env node
/* Комікс·Lab — заливання dist/ на Hostinger через SSH.
 *
 * Навіщо окремий скрипт: заливати руками — це щоразу згадувати, чого не можна
 * чіпати. Тут це записано один раз:
 *   • api/config.php ніколи не передається — у ньому паролі бази й пошти, і на
 *     сервері лежить єдиний правильний примірник;
 *   • api/data/ (вкладення відгуків, лічильники) теж належить серверу;
 *   • _private/, tools/ і архіви на сервер не потрапляють узагалі.
 *
 * Передаємо потоком tar через ssh: rsync на Windows немає, а tar і ssh є в самій
 * Windows 10. Жодного bash: у cmd.exe «bash» — це заглушка WSL, і виклик через неї
 * падає з «execvpe(/bin/bash) failed» на машині, де WSL не встановлено.
 *
 * Аудіо за замовчуванням не чіпаємо — воно змінюється лише разом із новими
 * текстами, а це 158 МБ проти 7 МБ решти.
 *
 *   node tools/deploy.js                 — код, дані й сторінки (швидко)
 *   node tools/deploy.js --full          — разом з озвученням
 *   node tools/deploy.js --only=api      — лише вказані теки
 *   node tools/deploy.js --dry           — показати, що пішло б, і не заливати
 *   node tools/deploy.js --clean         — ще й прибрати з сервера робочі теки
 *
 * Доступ береться з ~/.ssh/config (хост bilohash) — паролів у проєкті немає.
 */
'use strict';
const { spawn, spawnSync, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const HOST = process.env.KOMIKS_SSH || 'bilohash';
const REMOTE = process.env.KOMIKS_REMOTE || 'domains/bilohash.com/public_html/comiks';
const SITE = 'https://bilohash.com/comiks/';

const args = process.argv.slice(2);
const has = f => args.includes(f);
const only = (args.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);

/* Належить серверу — не передаємо навіть випадково. */
/* './tests' колись захищав від заливання власних перевірок проєкту — але вони
   й так ніколи не потрапляють у dist, бо копіюється лише перелік файлів. Зате
   це правило мовчки викидало нову пошукову сторінку /tests/, і вона віддавала
   403. Прибрано. */
const EXCLUDE = ['./api/config.php', './api/config.local.php', './api/data', './_private', './tools', './node_modules'];

const die = m => { console.error('✖ ' + m); process.exit(1); };

/* Шукаємо справжні програми, а не те, що трапиться в PATH. Системний bash у
   Windows — заглушка WSL; ssh і tar натомість є в самій системі з 2018 року. */
function findExe(name, candidates) {
  for (const p of candidates) if (p && fs.existsSync(p)) return p;
  const where = spawnSync(process.platform === 'win32' ? 'where' : 'which', [name], { encoding: 'utf8' });
  const first = (where.stdout || '').split(/\r?\n/).map(s => s.trim())
    .filter(Boolean)
    .filter(p => !/\\system32\\bash\.exe$/i.test(p))   // та сама заглушка WSL
    [0];
  if (!first) die(`Не знайдено ${name}. Встановіть його або додайте в PATH.`);
  return first;
}

const win = process.platform === 'win32';
const SYS = process.env.SystemRoot || 'C:\\Windows';
const TAR = findExe('tar', win ? [path.join(SYS, 'System32', 'tar.exe')] : ['/usr/bin/tar']);
const SSH = findExe('ssh', win ? [path.join(SYS, 'System32', 'OpenSSH', 'ssh.exe')] : ['/usr/bin/ssh']);

if (!fs.existsSync(path.join(DIST, 'index.html'))) die('Немає dist/index.html — спершу node tools/build.js');

/* Версія збірки: її ж перевіряємо на живому сайті, щоб знати, що заливання дійшло. */
const version = (fs.readFileSync(path.join(DIST, 'data', 'index.js'), 'utf8')
  .match(/["']?version["']?\s*:\s*["']([^"']+)["']/) || [])[1] || '';
if (!version) die('У dist/data/index.js немає версії — збірка неповна');

const swVer = (fs.readFileSync(path.join(DIST, 'sw.js'), 'utf8').match(/komiks-([\w-]+)/) || [])[1] || '';
if (swVer !== version) die(`sw.js каже «${swVer}», а дані — «${version}». Зберіть заново: node tools/build.js`);

/* Секрет у збірці — привід зупинитися ще до того, як він опиниться в мережі. */
for (const f of ['api/config.php', 'install.php']) {
  if (fs.existsSync(path.join(DIST, f))) die(`У dist/ лежить ${f} — його не можна заливати.`);
}

/* Що саме передаємо */
let items;
if (only.length) {
  for (const d of only) if (!fs.existsSync(path.join(DIST, d))) die(`У dist/ немає «${d}»`);
  items = only.map(d => './' + d);
} else {
  items = fs.readdirSync(DIST).filter(n => has('--full') || n !== 'audio').map(n => './' + n);
}

/* «-f -» (архів у stdout) має стояти серед перших опцій: bsdtar усе, що йде після
   першого імені файлу, вважає іменами файлів, і без цього пише в стрічковий
   пристрій \\.\tape0 — рівно та помилка, якою це спершу й упало. */
const tarBase = ['-czf', '-', '-C', DIST, ...EXCLUDE.flatMap(e => ['--exclude', e]), ...items];

if (has('--dry')) {
  const list = spawnSync(TAR, ['-cvzf', win ? 'NUL' : '/dev/null',
    '-C', DIST, ...EXCLUDE.flatMap(e => ['--exclude', e]), ...items], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  // tar друкує перелік то в stdout, то в stderr — залежно від збірки програми.
  const names = ((list.stdout || '') + (list.stderr || '')).split('\n')
    .map(s => s.replace(/^a /, '').trim()).filter(Boolean)
    // bsdtar не дописує «/» до тек, тому теки відсіваємо перевіркою на диску
    .filter(n => /^\.?\//.test(n) && !n.endsWith('/'))
    .filter(n => { try { return !fs.statSync(path.join(DIST, n)).isDirectory(); } catch { return true; } });
  console.log(`▶ Пробний запуск · версія ${version} · файлів: ${names.length}`);
  console.log(names.slice(0, 12).map(n => '  ' + n).join('\n'));
  if (names.length > 12) console.log(`  …і ще ${names.length - 12}`);
  const leak = names.filter(n => /config\.php|install\.php|\.jks|keystore/.test(n));
  console.log(leak.length ? '✖ У переліку є те, чого не можна заливати: ' + leak.join(', ') : '✔ Секретів у переліку немає');
  process.exit(leak.length ? 1 : 0);
}

console.log(`▶ Заливаю ${only.length ? only.join(', ') : (has('--full') ? 'усю збірку разом з аудіо' : 'код, дані й сторінки (без аудіо)')}`);
console.log(`  версія ${version} → ${HOST}:${REMOTE}`);

/* tar пише архів у свій stdout, ssh читає його зі свого stdin: те саме, що
   «tar … | ssh …» у командному рядку, але без оболонки-посередника. */
function upload() {
  return new Promise(resolve => {
    const tar = spawn(TAR, tarBase, { stdio: ['ignore', 'pipe', 'inherit'] });
    const ssh = spawn(SSH, ['-o', 'BatchMode=yes', HOST,
      `mkdir -p ${REMOTE} && tar -xz -C ${REMOTE}`], { stdio: ['pipe', 'inherit', 'inherit'] });
    let codes = 0, tarCode = 0, sshCode = 0;
    const done = () => { if (++codes === 2) resolve(tarCode || sshCode); };
    tar.on('error', e => die('tar не запустився: ' + e.message));
    ssh.on('error', e => die('ssh не запустився: ' + e.message));
    tar.stdout.pipe(ssh.stdin);
    tar.on('close', c => { tarCode = c; done(); });
    ssh.on('close', c => { sshCode = c; done(); });
  });
}

const curl = (url, extra = []) => {
  try { return execFileSync('curl', ['-s', '--max-time', '25', ...extra, url], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 }); }
  catch { return ''; }
};

(async () => {
  const t0 = Date.now();
  const code = await upload();
  if (code !== 0) die('Передача не вдалася (код ' + code + ')');
  console.log(`✔ Передано за ${((Date.now() - t0) / 1000).toFixed(1)} с`);

  if (has('--clean')) {
    console.log('▶ Прибираю з сервера робочі теки');
    const out = spawnSync(SSH, ['-o', 'BatchMode=yes', HOST,
      `cd ${REMOTE} && rm -rf tools tests _private node_modules install.php && echo cleaned`], { encoding: 'utf8' });
    console.log('  ' + ((out.stdout || out.stderr || '').trim() || 'без змін'));
  }

  /* Перевіряємо не «чи відпрацював tar», а що саме тепер віддає живий сайт. */
  const stamp = '?t=' + Date.now();
  const liveVer = (curl(SITE + 'data/index.js' + stamp).match(/["']?version["']?\s*:\s*["']([^"']+)["']/) || [])[1] || '?';
  const liveSw = (curl(SITE + 'sw.js' + stamp).match(/komiks-([\w-]+)/) || [])[1] || '?';
  const health = curl(SITE + 'api/health.php');
  const healthOk = /"ok"\s*:\s*true/.test(health);
  /* Номер схеми health.php віддає лише адміністраторові — звідси його не видно,
     і це нормально: для перевірки деплою достатньо «ok». Схема є в 🩺 Діагностиці. */
  const schema = (health.match(/"schema"\s*:\s*"?(\d+)/) || [])[1] || '';

  console.log('\n▶ Живий сайт');
  console.log(`  версія даних : ${liveVer} ${liveVer === version ? '✔' : '✖ очікувалося ' + version}`);
  console.log(`  кеш sw.js    : ${liveSw} ${liveSw === version ? '✔' : '✖'}`);
  console.log(`  API          : ${healthOk ? '✔ ok' : '✖ health.php не каже ok'}${schema ? ', схема v' + schema : ''}`);

  const bad = (liveVer !== version && !only.length) || !healthOk;
  console.log(bad
    ? '\n✖ Щось не доїхало — перевірте 🩺 Діагностику в адмінці.'
    : '\n✅ Готово. Діагностика: ' + SITE + 'admin.php?p=diag');
  process.exit(bad ? 1 : 0);
})();
