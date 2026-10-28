"""Імпорт згенерованих картинок слів з архіву з manifest.json (формат ChatGPT-експорту):
    python tools/import_word_images.py <архів.zip> [--skip тема/файл,тема/файл] [--only тема,тема] [--sheets]
    python tools/import_word_images.py --dir          — без архіву: нові PNG прямо в img/words/<тема>/ (слово шукаємо за
                                                      назвою файлу: hybel, i_gaar, haandball, <тема>_<слово>)

manifest.json: items[] з category (= id теми), norwegian, ukrainian, filename (<тема>/<файл>.png в архіві).
Для кожної картинки: чистить її тим самим clean() з tools/word_icons.py (головний предмет + сірі цятки),
кладе img/words/<тема>/<файл>.webp і записує прив'язку в data/word-photos-gen.js
(слово → [файл, переклад] — фото лише там, де переклад збігається; друге значення того самого слова в іншій
темі не зачіпає). --skip — зіпсовані картинки; --sheets — контрольні аркуші в TEMP для перегляду.
Архів розпаковується в тимчасову теку; з нього нічого не виконується.
"""
import sys, os, re, json, zipfile, tempfile
sys.path.insert(0, os.path.dirname(__file__))
from word_icons import clean
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..')
GEN = os.path.join(ROOT, 'data', 'word-photos-gen.js')

def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except Exception: pass
    args = sys.argv[1:]
    if not args: print(__doc__); sys.exit(1)
    opt = lambda k: set(x for x in args[args.index(k) + 1].split(',') if x) if k in args else set()
    skip, only = opt('--skip'), opt('--only')
    # уже наявні прив'язки (щоб повторний запуск дописував, а не затирав)
    data = {}
    if os.path.exists(GEN):
        m = re.search(r'const SETS = (\{.*?\});\n', open(GEN, encoding='utf-8').read(), re.S)
        if m: data = json.loads(m.group(1))
    if args[0] == '--dir':
        items = dir_items()
        return finish(items, None, data, skip, only, args)
    with tempfile.TemporaryDirectory() as tmp:
        with zipfile.ZipFile(args[0]) as z:
            for n in z.namelist():
                if '..' in n or n.startswith('/'): continue
                if n.endswith('manifest.json') or n.lower().endswith('.png'): z.extract(n, tmp)
        man = None
        for dp, _, fs in os.walk(tmp):
            if 'manifest.json' in fs: man = os.path.join(dp, 'manifest.json'); break
        if not man: sys.exit('у архіві немає manifest.json')
        base = os.path.dirname(man)
        items = json.load(open(man, encoding='utf-8'))['items']
        return finish(items, base, data, skip, only, args)

def dir_items():
    import subprocess
    js = ("global.window=global;for(const f of ['words','words2','words3','words4'])require('./data/'+f+'.js');"
          "process.stdout.write(JSON.stringify(window.WORDS.themes.map(t=>({id:t.id,words:t.words.map(w=>[w[0],w[1]])}))))")
    themes = json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, encoding='utf-8').stdout)
    def slugs(w, th):
        b = re.sub(r'^(en|ei|et|å)\s+', '', w.lower())
        out = set()
        for aa in ('aa', 'a'):
            s = re.sub(r'[^a-z0-9]+', '_', b.replace('æ', 'ae').replace('ø', 'o').replace('å', aa)).strip('_')
            out |= {s, th + '_' + s}
        return out
    items = []
    for t in themes:
        d = os.path.join(ROOT, 'img', 'words', t['id'])
        if not os.path.isdir(d): continue
        for fn in sorted(os.listdir(d)):
            if not fn.lower().endswith('.png'): continue
            stem = fn[:-4]
            webp = os.path.join(d, stem + '.webp')
            if os.path.exists(webp) and os.path.getmtime(webp) >= os.path.getmtime(os.path.join(d, fn)): continue   # уже оброблено
            w = next((w for w in t['words'] if stem in slugs(w[0], t['id'])), None)
            if not w: print('не знайшов слова для', t['id'], fn); continue
            items.append({'category': t['id'], 'filename': fn, 'norwegian': w[0], 'ukrainian': w[1]})
    return items

def finish(items, base, data, skip, only, args):
    if True:
        done = {}
        for it in items:
            th, fn = it['category'], it['filename']
            if not re.fullmatch(r'[a-z0-9_-]+', th) or not re.fullmatch(r'[a-z0-9_-]+\.png', fn): continue
            if only and th not in only: continue
            stem = fn[:-4]
            if f'{th}/{stem}' in skip: data.get(th, {}).pop(it['norwegian'], None); continue
            src = os.path.join(base, th, fn) if base else os.path.join(ROOT, 'img', 'words', th, fn)
            if not os.path.exists(src): print('немає файлу', th, fn); continue
            img = clean(src, False, False, True, True)
            if img is None: print('порожня картинка', th, fn); continue
            od = os.path.join(ROOT, 'img', 'words', th); os.makedirs(od, exist_ok=True)
            img.save(os.path.join(od, stem + '.webp'), 'WEBP', quality=86, method=6)
            key = re.sub(r'^(en|ei|et|å)\s+', '', it['norwegian'].strip().lower())
            data.setdefault(th, {})[key] = [stem, it.get('ukrainian', '')]
            done.setdefault(th, []).append(stem)
    out = ('/* 🖼 Згенеровано tools/import_word_images.py — не правити руками (зіпсовані картинки: --skip тема/файл).\n'
           '   Слово (без артикля) → [файл img/words/<тема>/<файл>.webp, переклад]: фото лише там, де переклад збігається. */\n'
           '(() => {\n  \'use strict\';\n  if (!window.KomiksPics || !window.KomiksPics.addPhotos) return;\n'
           f'  const SETS = {json.dumps(data, ensure_ascii=False, sort_keys=True)};\n'
           '  for (const [theme, words] of Object.entries(SETS)) {\n    const map = {};\n'
           '    for (const [w, [file, uk]] of Object.entries(words)) map[w] = { src: `img/words/${theme}/${file}.webp`, uk };\n'
           '    window.KomiksPics.addPhotos(map);\n  }\n})();\n')
    open(GEN, 'w', encoding='utf-8').write(out)
    for th, stems in sorted(done.items()):
        print(f'{th}: {len(stems)}')
        if '--sheets' in args:
            sheet = Image.new('RGB', (6 * 160, ((len(stems) + 5) // 6) * 175), (235, 235, 235))
            for i, s in enumerate(stems):
                im = Image.open(os.path.join(ROOT, 'img', 'words', th, s + '.webp')).convert('RGBA').resize((140, 140))
                sheet.paste(im, ((i % 6) * 160 + 10, (i // 6) * 175 + 5), im)
            from PIL import ImageDraw
            d = ImageDraw.Draw(sheet)
            for i, s in enumerate(stems): d.text(((i % 6) * 160 + 10, (i // 6) * 175 + 150), s[:22], fill=(20, 20, 20))
            sheet.save(os.path.join(tempfile.gettempdir(), f'import_{th}.png'))
    print('→', os.path.relpath(GEN, ROOT), '·', sum(len(v) for v in data.values()), 'слів')

if __name__ == '__main__':
    main()
