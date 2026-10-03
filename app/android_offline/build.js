/* Комікс·Lab — 📴 офлайн-збірка застосунку для Google Play.
 *
 *   node app/android_offline/build.js
 *   node app/android_offline/build.js --serve      одразу відкрити для перевірки
 *
 * Чим відрізняється від звичайної збірки:
 *   • немає сервера — жодного запиту в мережу, застосунок повністю автономний;
 *   • немає акаунтів, друзів, стін, повідомлень, рейтингу, спільних ігор і ШІ;
 *   • лишається все, що працює на самому пристрої: комікси з озвученням, тести,
 *     картки, «Пари», слова, граматика, алфавіт, числа й одиночні головоломки.
 *
 * Навіщо окремо: без акаунтів і спілкування застосунок легше провести через
 * перевірку Google (немає збору даних, немає користувацького вмісту),
 * а працює він і в літаку.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const HERE = __dirname;
const ROOT = path.join(HERE, '..', '..');
const DIST = path.join(ROOT, 'dist');
const WWW = path.join(HERE, 'www');

if (!fs.existsSync(DIST)) {
  console.error('✖ Немає dist/. Спершу зберіть сайт: node tools/build.js');
  process.exit(1);
}

/* Модулі, які без сервера не мають сенсу. Маршрути до них у app.js уже закриті
   прапорцем OFFLINE, а самі файли просто не кладемо — застосунок легший
   і в ньому фізично немає коду, який кудись стукає. */
const DROP_ASSETS = new Set([
  'auth.js', 'friends.js', 'players.js', 'messages.js', 'alerts.js',
  'game.js', 'call.js', 'write.js', 'teacher.js', 'premium.js',
  'feedback.js', 'bots.js', 'news.js'
]);
// теки та файли сайту, яких у застосунку бути не повинно
const DROP_TOP = new Set(['api', 'admin.php', 'install.php', 'sitemap.xml', 'robots.txt',
  'komiks', 'no', 'uk', 'sw.js', 'og-image.png', 'game']);

const LIGHT_COMICS = Number(process.env.LIGHT_COMICS || 0);   // 0 = усі комікси офлайн
const LIGHT_THEMES = Number(process.env.LIGHT_THEMES || 0);

fs.rmSync(WWW, { recursive: true, force: true });
fs.mkdirSync(WWW, { recursive: true });

function copyDir(src, dst, skip) {
  fs.mkdirSync(dst, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (skip && skip.has(name)) continue;
    const from = path.join(src, name), to = path.join(dst, name);
    if (fs.statSync(from).isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

// 1) сайт без серверної частини
copyDir(DIST, WWW, new Set([...DROP_TOP, 'audio']));
for (const f of DROP_ASSETS) fs.rmSync(path.join(WWW, 'assets', f), { force: true });

// 2) список файлів для завантажувача — без викинутих модулів
const idxPath = path.join(WWW, 'data', 'index.js');
let idx = fs.readFileSync(idxPath, 'utf8');
for (const f of DROP_ASSETS) {
  // лапки в зібраному файлі можуть бути і одинарні, і подвійні
  const esc = f.replace(/\./g, '\\.');
  idx = idx.replace(new RegExp(`\\s*['\"]assets/${esc}['\"],?`, 'g'), '');
}
idx = idx.replace(/,(\s*[\]}])/g, '$1');                   // прибрати кому перед ] або }
fs.writeFileSync(idxPath, idx, 'utf8');

// 3) озвучення
const audioSrc = path.join(DIST, 'audio');
const audioDst = path.join(WWW, 'audio');
let copied = 0;
if (fs.existsSync(audioSrc)) {
  fs.mkdirSync(audioDst, { recursive: true });
  let keep = null;
  if (LIGHT_COMICS || LIGHT_THEMES) {
    const W = require(path.join(ROOT, 'tools', 'load.js'))();
    const texts = new Set();
    for (const c of W.COMICS.filter(x => !x._private).slice(0, LIGHT_COMICS || 999)) {
      for (const pn of c.panels) for (const l of pn.lines) if (l.no) texts.add(l.no);
      for (const v of c.vocab || []) if (v[0]) texts.add(v[0]);
    }
    for (const th of ((W.WORDS || {}).themes || []).slice(0, LIGHT_THEMES || 999)) {
      for (const w of th.words) if (w[0]) texts.add(w[0]);
    }
    const manifest = fs.readFileSync(path.join(DIST, 'data', 'audio.js'), 'utf8');
    keep = new Set();
    for (const m of manifest.matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)) {
      const parts = m[1].split('|');
      if (!texts.has(parts[parts.length - 1])) continue;
      if (parts[0] === 'word' || parts[0] === 'cheer') keep.add(m[2] + '.mp3');
    }
  }
  for (const f of fs.readdirSync(audioSrc)) {
    if (keep && !keep.has(f)) continue;
    fs.copyFileSync(path.join(audioSrc, f), path.join(audioDst, f));
    copied++;
  }
}

/* 4) прапорець офлайну + запобіжник: якщо якийсь модуль усе ж спробує вийти
   в мережу, запит не піде нікуди й не зависне — застосунок відповість одразу. */
const indexPath = path.join(WWW, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace('</head>', `<script>
  /* 📴 Офлайн-застосунок: сервера немає взагалі. */
  window.KOMIKS_OFFLINE = true;
  (() => {
    const f = window.fetch.bind(window);
    window.fetch = (url, opts) => (typeof url === 'string' && /^(api\\/|https?:)/.test(url)
      ? Promise.resolve(new Response('{"ok":false,"error":"offline"}', { status: 503, headers: { 'Content-Type': 'application/json' } }))
      : f(url, opts));
  })();
</script>
</head>`);
fs.writeFileSync(indexPath, html, 'utf8');


/* Аудіо всередині застосунку записане одним голосовим набором (cheer|…),
   тож стартовий режим лишається «жіночий голос» — інакше репліки мовчать. */
{
  const appJs = path.join(WWW, 'assets', 'app.js');
  if (fs.existsSync(appJs)) {
    let js = fs.readFileSync(appJs, 'utf8');
    const before = js;
    js = js.replace(/voiceMode: 'multi'/g, "voiceMode: 'cheerful'");
    if (js !== before) fs.writeFileSync(appJs, js, 'utf8');
    else console.log('   ⚠ у app.js не знайдено voiceMode: multi — перевірте збірку');
  }
}
const size = d => fs.readdirSync(d, { withFileTypes: true })
  .reduce((n, e) => n + (e.isDirectory() ? size(path.join(d, e.name)) : fs.statSync(path.join(d, e.name)).size), 0);
const mb = (size(WWW) / 1048576).toFixed(1);
console.log(`✔ Офлайн-застосунок готовий · app/android_offline/www`);
console.log(`   озвучень: ${copied} · розмір: ${mb} МБ · модулів прибрано: ${DROP_ASSETS.size}`);
if (mb > 190) console.log('   ⚠ більше за ліміт Google Play (200 МБ) — зменште через LIGHT_COMICS / LIGHT_THEMES');

if (process.argv.includes('--serve')) {
  console.log('\n📱 Відкриваю для перевірки…\n');
  spawn(process.execPath, [path.join(ROOT, 'app', 'tools', 'serve.js'), '8971'],
    { stdio: 'inherit', env: { ...process.env, KOMIKS_WWW: WWW } });
}
