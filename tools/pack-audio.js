/* Комікс·Lab — 📦 один архів з усім озвученням для складальних машин.
 *
 *   node tools/pack-audio.js
 *
 * Навіщо. Теку audio/ у git не тримають: це понад десять тисяч mp3 на 200 МБ,
 * які й так відтворюються командою gen_audio.py. Але складальна машина в хмарі
 * (Codemagic, GitHub Actions) бачить лише репозиторій — і без озвучення збирає
 * «офлайн-застосунок», у якому нічого не звучить.
 *
 * Качати десять тисяч файлів поштучно — кілька хвилин і сотні з'єднань, тож
 * тримаємо на сервері один архів: збірка бере його одним запитом за секунди.
 *
 * Пакує сам сервер — там файли вже лежать, і гнати їх туди-сюди не треба.
 */
const { execFileSync } = require('child_process');

const HOST = process.env.KL_HOST || 'bilohash';
const DIR = 'domains/bilohash.com/public_html/comiks';
const cmd = `cd ${DIR} && tar -czf audio-pack.tar.gz.new audio && mv audio-pack.tar.gz.new audio-pack.tar.gz && ls -l audio-pack.tar.gz | awk '{print $5}'`;

process.stdout.write('📦 Пакую озвучення на сервері…\n');
/* Пишемо у .new і лише потім перейменовуємо: інакше складальна машина, яка
   саме в цю мить качає архів, отримає половину файла. */
const out = execFileSync('ssh', [HOST, cmd], { encoding: 'utf8' }).trim().split('\n').pop();
const mb = (Number(out) / 1048576).toFixed(0);
console.log(`✔ audio-pack.tar.gz · ${mb} МБ · https://bilohash.com/comiks/audio-pack.tar.gz`);
console.log('   Запускайте після кожного додавання озвучення, інакше хмарна збірка візьме старе.');
