'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const childProcess = require('node:child_process');

const DATA_FILES = ['data/words.js', 'data/words2.js', 'data/words3.js', 'data/words4.js'];
const PIC_FILES = ['assets/pics.js', 'assets/pics2.js', 'assets/pics3.js', 'assets/pics4.js', 'assets/pics5.js', 'assets/pics6.js', 'assets/pics7.js'];
const PHOTO_FILES = ['data/words-tools.js', 'data/word-photos.js', 'data/word-images-generated.js'];

function normalizeWord(value) {
  return String(value || '').normalize('NFC').toLowerCase().replace(/^(en|ei|et|å)\s+/u, '').trim();
}

function stableSlug(value) {
  let text = normalizeWord(value)
    .replace(/å/g, 'aa').replace(/æ/g, 'ae').replace(/ø/g, 'o')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  text = text.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').replace(/_+/g, '_');
  return text || 'word';
}

function englishSubject(word) {
  const raw = String(word.english || word.ukrainian || word.norwegian || '').trim();
  return raw.replace(/^(a|an|the|to)\s+/i, '').replace(/[;,].*$/, '').trim();
}

function buildPrompt(word) {
  const key = normalizeWord(word.norwegian);
  const special = {
    hund: 'Friendly golden dog sitting, full body visible, expressive eyes and realistic soft fur',
    hytte: 'Traditional Norwegian wooden mountain cabin with red timber walls, green roof and cozy windows',
    'gå tur': 'Friendly person walking on a small Norwegian hiking trail with a backpack, full body visible'
  };
  const subject = special[key] || `A clear, culturally accurate visual representation of “${englishSubject(word)}” (${word.norwegian}, ${word.ukrainian})`;
  const action = /^(å)\s+/u.test(String(word.norwegian || '')) ? ', show the action in one immediately understandable pose' : '';
  return `${subject}${action}. Colorful premium 3D cartoon educational icon, soft rounded shapes, beautiful realistic materials, vibrant colors, professional studio lighting, subtle ambient occlusion, polished mobile learning app aesthetic, centered composition, one main subject, isolated on a genuine transparent background, full object visible with generous 10% safe margins on every side, crisp clean silhouette, 512x512 RGBA PNG, no text, no letters, no watermark, no border, no unrelated objects.`;
}

function runScript(context, root, relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) return false;
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 5000 });
  return true;
}

function gitState(root) {
  const run = args => {
    try { return childProcess.execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
    catch { return ''; }
  };
  return {
    capturedAt: new Date().toISOString(),
    head: run(['rev-parse', 'HEAD']),
    branch: run(['branch', '--show-current']),
    status: run(['status', '--short']).split(/\r?\n/).filter(Boolean)
  };
}

function collectProject(root) {
  root = path.resolve(root);
  const context = vm.createContext({ window: {}, document: {}, console, setTimeout, clearTimeout });
  for (const file of DATA_FILES) runScript(context, root, file);
  const themes = context.window.WORDS && Array.isArray(context.window.WORDS.themes) ? context.window.WORDS.themes : [];
  if (!themes.length) throw new Error('No WORDS themes were loaded');

  const inlineSources = new Map();
  let known = new Set();
  for (const file of PIC_FILES) {
    if (!runScript(context, root, file) || !context.window.KomiksPics) continue;
    const next = new Set(context.window.KomiksPics.keys || []);
    for (const key of next) if (!known.has(key)) inlineSources.set(normalizeWord(key), file);
    known = next;
  }
  for (const file of PHOTO_FILES) runScript(context, root, file);

  const pics = context.window.KomiksPics || null;
  const semanticTargets = new Map();
  const usedTargets = new Map();
  const entries = [];
  for (const theme of themes) {
    if (!theme || !Array.isArray(theme.words)) continue;
    theme.words.forEach((tuple, index) => {
      const [norwegian = '', ukrainian = '', english = '', emoji = ''] = tuple || [];
      const normalized = normalizeWord(norwegian);
      const semanticKey = `${normalized}\u0000${String(ukrainian).toLowerCase().trim()}\u0000${String(english).toLowerCase().trim()}`;
      let target = semanticTargets.get(semanticKey);
      if (!target) {
        let slug = stableSlug(norwegian);
        const collision = usedTargets.get(slug);
        if (collision && collision !== semanticKey) slug = `${stableSlug(theme.id)}_${slug}`;
        let suffix = 2;
        const base = slug;
        while (usedTargets.has(slug) && usedTargets.get(slug) !== semanticKey) slug = `${base}_${suffix++}`;
        usedTargets.set(slug, semanticKey);
        target = { filename: `${slug}.png`, image: `img/words/${stableSlug(theme.id)}/${slug}.png` };
        semanticTargets.set(semanticKey, target);
      }

      let currentImage = '';
      if (pics && typeof pics.photo === 'function') currentImage = String(pics.photo(norwegian, ukrainian) || '');
      const hasAny = !!(pics && typeof pics.has === 'function' && pics.has(norwegian, ukrainian));
      const sourceType = currentImage ? 'raster' : hasAny ? 'inline-svg' : 'none';
      const status = currentImage ? 'pending-validation' : hasAny ? 'existing-inline-svg' : 'missing';
      entries.push({
        id: `${stableSlug(theme.id)}_${String(index + 1).padStart(3, '0')}`,
        category: String(theme.id),
        categoryName: String(theme.no || theme.en || theme.uk || theme.id),
        level: String(theme.level || ''),
        norwegian: String(norwegian),
        ukrainian: String(ukrainian),
        english: String(english),
        emoji: String(emoji),
        normalized,
        image: currentImage || (hasAny ? `inline-svg:${inlineSources.get(normalized) || 'KomiksPics'}` : target.image),
        sourceType,
        status,
        needsGeneration: !hasAny,
        filename: target.filename,
        generatedPath: target.image,
        sharedKey: crypto.createHash('sha256').update(semanticKey).digest('hex').slice(0, 16),
        prompt: buildPrompt({ norwegian, ukrainian, english, categoryName: theme.no || theme.id })
      });
    });
  }
  return { generatedAt: new Date().toISOString(), root, themes: themes.length, entries };
}

function main() {
  const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
  const reportDir = path.join(root, 'reports');
  fs.mkdirSync(reportDir, { recursive: true });
  const audit = collectProject(root);
  fs.writeFileSync(path.join(reportDir, 'image-audit.json'), JSON.stringify(audit, null, 2) + '\n');
  fs.writeFileSync(path.join(reportDir, 'image-source-state.json'), JSON.stringify(gitState(root), null, 2) + '\n');
  const missing = audit.entries.filter(x => x.needsGeneration).length;
  process.stdout.write(`Audited ${audit.entries.length} words in ${audit.themes} themes; ${missing} need generation before pixel validation.\n`);
}

module.exports = { normalizeWord, stableSlug, buildPrompt, collectProject, gitState };
if (require.main === module) main();

