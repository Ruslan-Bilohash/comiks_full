const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const admin = fs.readFileSync(path.join(root, 'admin.php'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'api', 'admin_ui.php'), 'utf8');
const lib = fs.readFileSync(path.join(root, 'api', 'lib.php'), 'utf8');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data', 'comics.json'), 'utf8'));
const loaded = require('./load.js')().COMICS.filter(comic => !comic._private);

assert.match(admin, /\$trackF\s*=.*\$_GET\['track'\]/s, 'materials must accept a track filter');
assert.match(admin, /'no'\s*=>\s*\[.*Норвезька/s, 'Norwegian track is missing');
assert.match(admin, /'en'\s*=>\s*\[.*Англійська/s, 'English track is missing');
assert.match(admin, /'code'\s*=>\s*\[.*Програмування/s, 'programming track is missing');
assert.match(admin, /\? 'english\/' : 'read\/'/, 'cards must switch to the English reader route');
assert.match(admin, /\? 'en\/' : ''/, 'cards must switch to the English quiz route');
assert.match(admin, /data\/english\*\.js/, 'all English story files must be loaded');
assert.match(admin, /data\/comics\.json/, 'Norwegian and programming materials must use the generated catalog');
assert.match(admin, /json_decode/, 'the generated comic catalog must be decoded instead of scraping JavaScript');
assert.match(ui, /\.material-tracks\b/, 'materials track navigation needs dedicated responsive styles');
assert.match(lib, /k LIKE 'en\.seen\.%'/, 'English reading activity must be included in admin analytics');

function sourceItems(src, prefix) {
  const starts = [...src.matchAll(new RegExp(`\\\\bid\\\\s*:\\\\s*['\"](${prefix}\\\\d+)['\"]`, 'g'))];
  return starts.map((match, i) => {
    const chunk = src.slice(match.index, starts[i + 1]?.index ?? src.length);
    const value = key => {
      const found = chunk.match(new RegExp(`\\\\b${key}\\\\s*:\\\\s*(?:'((?:[^'\\\\\\\\]|\\\\\\\\.)*)'|\"((?:[^\"\\\\\\\\]|\\\\\\\\.)*)\")`, 's'));
      return found ? (found[1] || found[2] || '') : '';
    };
    return { id: match[1], level: value('level'), category: value('category'), title: value('title') };
  });
}

const englishFiles = fs.readdirSync(path.join(root, 'data')).filter(x => /^english\d*\.js$/.test(x));
const englishIds = englishFiles.flatMap(file => {
  const src = fs.readFileSync(path.join(root, 'data', file), 'utf8');
  return [...src.matchAll(/\bid\s*:\s*['"](e\d+)['"]/g)].map(m => m[1]);
});
assert.equal(new Set(englishIds).size, 28, 'expected all 28 English stories in source data');
const englishStories = englishFiles.flatMap(file => sourceItems(fs.readFileSync(path.join(root, 'data', file), 'utf8'), 'e'));
assert.ok(englishStories.every(x => x.id && x.level && x.category && x.title), 'every English story needs admin metadata');

assert.equal(catalog.length, loaded.length, 'admin catalog must contain every public comic');
assert.deepEqual(new Set(catalog.map(x => x.id)), new Set(loaded.map(x => x.id)), 'catalog ids must match the real loaded comics');
assert.ok(catalog.every(x => x.id && x.level && x.category && x.title && Number.isInteger(x.panels)), 'every catalog item needs complete admin metadata');
const codingStories = catalog.filter(x => x.category === 'koding');
assert.equal(codingStories.length, 99, 'expected all 99 programming stories in admin catalog');
for (const track of ['basics', 'web', 'game', 'blender', 'unity', 'data', 'personal-safety', 'cyber-safety', 'scam-awareness', 'device-safety', 'secure-coding', 'hackers']) {
  assert.match(admin, new RegExp(`['"]${track}['"]\\s*=>`), `admin category label is missing: ${track}`);
  assert.ok(codingStories.some(x => (x.track || 'basics') === track), `catalog has no story in ${track}`);
}

console.log(`admin materials sections: ok (${englishIds.length} English, ${catalog.length} Norwegian/programming, ${codingStories.length} programming)`);
