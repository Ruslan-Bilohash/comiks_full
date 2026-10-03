/* Комікс·Lab — локальний перегляд застосунку.
 *
 *   node app/tools/serve.js            → http://localhost:8970
 *   node app/tools/serve.js 9000       → інший порт
 *
 * Показує рівно те, що потрапить у застосунок (теку app/www), а не сайт.
 * Так видно, чого бракує в офлайні: які озвучення не поклали, які сторінки
 * залежать від сервера. Запитів до api/… тут немає — застосунок ходить
 * по них на bilohash.com, як і на телефоні.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const WWW = process.env.KOMIKS_WWW || path.join(__dirname, '..', 'www');
const port = Number(process.argv[2]) || 8970;

if (!fs.existsSync(WWW)) {
  console.error('✖ Немає app/www. Спершу: node app/tools/prepare-web.js --light');
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.mp3': 'audio/mpeg', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8'
};

let missing = 0;
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.join(WWW, url === '/' ? 'index.html' : url.replace(/^\/+/, ''));
  // застосунок — односторінковий: невідомі шляхи віддаємо як index.html
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    if (/\.[a-z0-9]{2,5}$/i.test(url)) {
      missing++;
      console.log(`   ⚠ немає у застосунку: ${url}`);
      res.writeHead(404); res.end('not in app'); return;
    }
    file = path.join(WWW, 'index.html');
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, () => {
  const size = d => fs.readdirSync(d, { withFileTypes: true })
    .reduce((n, e) => n + (e.isDirectory() ? size(path.join(d, e.name)) : fs.statSync(path.join(d, e.name)).size), 0);
  console.log(`📱 Застосунок відкрито: http://localhost:${port}`);
  console.log(`   вміст: app/www · ${(size(WWW) / 1048576).toFixed(1)} МБ`);
  console.log('   Відсутні файли (те, що в застосунку не працюватиме офлайн) друкуються нижче.');
  console.log('   Зупинити: Ctrl+C\n');
});
process.on('SIGINT', () => { console.log(`\n   Не знайдено файлів за сесію: ${missing}`); process.exit(0); });
