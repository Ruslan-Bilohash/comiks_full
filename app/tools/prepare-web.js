/* Комікс·Lab — готує вміст застосунку (app/www) із готової збірки сайту (dist).
 *
 *   node app/tools/prepare-web.js            — повний офлайн-застосунок (сайт + аудіо, ~100 МБ)
 *   node app/tools/prepare-web.js --light    — тільки код і 200 найпотрібніших озвучень (~15 МБ)
 *   node app/tools/prepare-web.js --remote   — лише оболонка: застосунок відкриває сайт онлайн
 *
 * Навіщо три режими: у сторах є обмеження на розмір, а повне аудіо важить майже сто мегабайтів.
 * Для першого релізу зручно --light: слова й перші комікси звучать одразу, решта підвантажується
 * з bilohash.com, коли є інтернет.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DIST = path.join(ROOT, 'dist');
const WWW = path.join(__dirname, '..', 'www');
// адресу сервера можна підмінити для локальної перевірки:
//   node app/tools/prepare-web.js --light --api=http://localhost:8950/
const apiArg = (process.argv.find(x => x.startsWith('--api=')) || '').slice(6);
const SITE = (apiArg || 'https://bilohash.com/comiks/').replace(/\/?$/, '/');
const mode = process.argv.includes('--remote') ? 'remote' : process.argv.includes('--light') ? 'light' : 'full';

if (!fs.existsSync(DIST)) {
  console.error('✖ Немає dist/. Спершу зберіть сайт: node tools/build.js');
  process.exit(1);
}

fs.rmSync(WWW, { recursive: true, force: true });
fs.mkdirSync(WWW, { recursive: true });

// оболонка «онлайн»: маленький index.html, який відкриває сайт у вебвʼю
if (mode === 'remote') {
  fs.writeFileSync(path.join(WWW, 'index.html'), `<!doctype html>
<html lang="no"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Komiks·Lab</title><style>html,body{margin:0;height:100%;background:#fff8ea}iframe{border:0;width:100%;height:100%}</style></head>
<body><iframe src="${SITE}" allow="microphone; autoplay; clipboard-write"></iframe></body></html>
`, 'utf8');
  console.log('✔ app/www: режим «онлайн» — застосунок відкриває', SITE);
  process.exit(0);
}

// копіюємо сайт
const skipTop = new Set(['audio', 'komiks', 'no', 'uk', 'sitemap.xml', 'robots.txt', 'install.php', 'admin.php', 'api']);
function copyDir(src, dst, filter) {
  fs.mkdirSync(dst, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dst, name);
    if (filter && !filter(name, from)) continue;
    const st = fs.statSync(from);
    if (st.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}
copyDir(DIST, WWW, name => !skipTop.has(name));

// аудіо: у light-режимі беремо лише слова й перші комікси
const audioSrc = path.join(DIST, 'audio');
const audioDst = path.join(WWW, 'audio');
let copied = 0;
if (fs.existsSync(audioSrc)) {
  fs.mkdirSync(audioDst, { recursive: true });
  const manifestPath = path.join(DIST, 'data', 'audio.js');
  const manifest = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, 'utf8') : '';
  const keep = new Set();
  if (mode === 'light') {
    /* Ключі озвучення не містять номера коміксу — лише сам норвезький текст
       (cheer|хто|no|текст для реплік і word|no|текст для слів). Тому спершу
       збираємо потрібні тексти з даних, а вже потім знаходимо їхні файли. */
    const load = require(path.join(ROOT, 'tools', 'load.js'));
    const W = load();
    const LIGHT_COMICS = Number(process.env.LIGHT_COMICS || 8);   // скільки історій звучать офлайн
    const LIGHT_THEMES = Number(process.env.LIGHT_THEMES || 10);  // скільки тем слів
    const texts = new Set();
    for (const c of W.COMICS.filter(x => !x._private).slice(0, LIGHT_COMICS)) {
      for (const pn of c.panels) for (const l of pn.lines) if (l.no) texts.add(l.no);
      for (const v of c.vocab || []) if (v[0]) texts.add(v[0]);
    }
    for (const th of ((W.WORDS || {}).themes || []).slice(0, LIGHT_THEMES)) {
      for (const w of th.words) if (w[0]) texts.add(w[0]);
    }
    // один голосовий режим замість трьох: решту застосунок дотягне з сайту
    for (const m of manifest.matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)) {
      const [, key, file] = m;
      const parts = key.split('|');
      const text = parts[parts.length - 1];
      if (!texts.has(text)) continue;
      if (parts[0] === 'word' || parts[0] === 'cheer') keep.add(file + '.mp3');
    }
    console.log(`   light: історій ${LIGHT_COMICS}, тем ${LIGHT_THEMES}, унікальних текстів ${texts.size}`);
  }
  for (const f of fs.readdirSync(audioSrc)) {
    if (mode === 'light' && !keep.has(f)) continue;
    fs.copyFileSync(path.join(audioSrc, f), path.join(audioDst, f));
    copied++;
  }
}

/* У застосунку немає PHP, тому серверні можливості (акаунти, дзвінки, стіни) ходять
   на сайт. Додаємо один рядок, який перенаправляє всі запити api/… на bilohash.com. */
const indexPath = path.join(WWW, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
if (!html.includes('KOMIKS_API_BASE')) {
  html = html.replace('</head>', `<script>
  /* Мобільний застосунок: файли лежать усередині, а сервер — на сайті.
     Дві речі, без яких нічого не працює:
       1) адресу api/… дописуємо до повної, бо всередині застосунку іншого сервера немає;
       2) credentials: 'include' — застосунок для сервера чуже джерело, і з 'same-origin'
          кука сесії не надсилається, тобто вхід не тримається. */
  window.KOMIKS_API_BASE = '${SITE}';
  (() => {
    const f = window.fetch.bind(window);
    window.fetch = (url, opts) => {
      const isApi = typeof url === 'string' && (url.startsWith('api/') || url.startsWith('${SITE}api/'));
      if (!isApi) return f(url, opts);
      const o = Object.assign({}, opts, { credentials: 'include' });
      return f(url.startsWith('api/') ? '${SITE}' + url : url, o);
    };
  })();
</script>
</head>`);
  fs.writeFileSync(indexPath, html, 'utf8');
}


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
const size = (dir) => {
  let n = 0;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    n += f.isDirectory() ? size(p) : fs.statSync(p).size;
  }
  return n;
};
console.log(`✔ app/www готово · режим: ${mode} · аудіофайлів: ${copied} · розмір: ${(size(WWW) / 1048576).toFixed(1)} МБ`);
