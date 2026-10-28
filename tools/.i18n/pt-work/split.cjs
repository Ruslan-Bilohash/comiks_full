/* Ручний переклад pt: jobs-*-pt.jsonl → пронумеровані блоки для перекладача
   і назад: блоки з перекладом → out-*-pt.jsonl у форматі ai-translate.php. */
const fs = require('fs'), path = require('path');
const W = path.join(__dirname, '..'), D = __dirname;
const FILES = { app: 'jobs-app-pt.jsonl', main: 'jobs-pt.jsonl', learn: 'jobs-learn-pt.jsonl', upd: 'jobs-upd-pt.jsonl', pages: 'jobs-pages-pt.jsonl', privacy: 'jobs-priv-pt.jsonl', mail: 'jobs-mail-pt.jsonl' };
const OUT = { app: 'out-app-pt.jsonl', main: 'out-pt.jsonl', learn: 'out-learn-pt.jsonl', upd: 'out-upd-pt.jsonl', pages: 'out-pages-pt.jsonl', privacy: 'out-priv-pt.jsonl', mail: 'out-mail-pt.jsonl' };
const cmd = process.argv[2], which = process.argv[3], size = +(process.argv[4] || 200);
const jobs = f => fs.readFileSync(path.join(W, f), 'utf8').split('\n').filter(s => s.trim()).map(s => JSON.parse(s));
if (cmd === 'split') {
  const rows = [];
  for (const j of jobs(FILES[which])) for (const it of j.items) rows.push([j.id + '#' + it.k, it.en, it.no || '', it.hint || '']);
  fs.writeFileSync(path.join(D, which + '-index.json'), JSON.stringify(rows.map(r => r[0])));
  let n = 0;
  for (let i = 0; i < rows.length; i += size) {
    const part = rows.slice(i, i + size).map((r, j) => `${i + j + 1}\t${r[1].replace(/\s+/g, ' ')}${r[2] ? `\t[no: ${r[2].replace(/\s+/g, ' ')}]` : ''}`);
    fs.writeFileSync(path.join(D, `${which}-src-${String(++n).padStart(2, '0')}.txt`), part.join('\n') + '\n');
  }
  console.log(`${which}: ${rows.length} рядків → ${n} блоків`);
} else if (cmd === 'join') {
  const idx = JSON.parse(fs.readFileSync(path.join(D, which + '-index.json'), 'utf8'));
  const got = new Map();
  for (const f of fs.readdirSync(D).filter(f => f.startsWith(which + '-pt-') && f.endsWith('.txt')).sort()) {
    for (const line of fs.readFileSync(path.join(D, f), 'utf8').split(/\r?\n/)) {
      const m = line.match(/^(\d+)\t(.*)$/); if (!m || !m[2].trim()) continue;
      got.set(+m[1], m[2].trim());
    }
  }
  const map = {};
  idx.forEach((key, i) => { const v = got.get(i + 1); if (v === undefined) return; const [id, k] = key.split('#'); (map[id] = map[id] || {})[k] = v; });
  const lines = Object.entries(map).map(([id, m]) => JSON.stringify({ id, ok: true, map: m }));
  fs.writeFileSync(path.join(W, OUT[which]), lines.join('\n') + '\n');
  const miss = idx.length - got.size;
  console.log(`${which}: перекладено ${got.size} з ${idx.length}${miss ? ` · бракує ${miss}` : ''} → ${OUT[which]}`);
  if (miss) { const m = []; idx.forEach((_, i) => { if (!got.has(i + 1)) m.push(i + 1); }); console.log('бракує:', m.slice(0, 40).join(',')); }
}
