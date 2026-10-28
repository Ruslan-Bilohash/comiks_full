"""Картинки до літер алфавіту: python tools/import_alphabet.py <архів.zip з manifest.json> | --dir

manifest.json (формат експорту ChatGPT): items[] з letter, word, filename (a_ape.png …).
--dir: PNG прямо в img/alphabet/ (ім'я <літера>_<слово>.png, як у manifest; Æ → ae_, Ø → oe_, Å → aa_).
Чистить картинку (головний предмет, сірі цятки), кладе img/alphabet/<файл>.webp і переписує
data/alphabet-pics.js: літера → [файл, слово]. Слово має збігатися зі словом у data/basics.js —
інакше сторінка покаже емодзі (так захищаємося від чужої картинки).
"""
import sys, os, re, json, zipfile, tempfile
sys.path.insert(0, os.path.dirname(__file__))
from word_icons import clean

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'data', 'alphabet-pics.js')
IMG = os.path.join(ROOT, 'img', 'alphabet')

def alphabet():
    import subprocess
    js = "global.window=global;require('./data/basics.js');process.stdout.write(JSON.stringify(window.BASICS.alphabet.map(a=>[a[0],a[2]])))"
    return json.loads(subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, encoding='utf-8').stdout)

def main():
    try: sys.stdout.reconfigure(encoding='utf-8')
    except Exception: pass
    if len(sys.argv) < 2: print(__doc__); sys.exit(1)
    os.makedirs(IMG, exist_ok=True)
    data = {}
    if os.path.exists(OUT):
        m = re.search(r'window\.ALPHA_PICS = (\{.*\});', open(OUT, encoding='utf-8').read(), re.S)
        if m: data = json.loads(m.group(1))
    letters = alphabet()
    pref = lambda L: {'Æ': 'ae', 'Ø': 'oe', 'Å': 'aa'}.get(L, L.lower())
    jobs = []
    with tempfile.TemporaryDirectory() as tmp:
        if sys.argv[1] == '--dir':
            for L, word in letters:
                for fn in os.listdir(IMG):
                    if fn.lower().endswith('.png') and fn.lower().startswith(pref(L) + '_'):
                        src = os.path.join(IMG, fn); webp = src[:-4] + '.webp'
                        if not os.path.exists(webp) or os.path.getmtime(webp) < os.path.getmtime(src): jobs.append((L, word, src, fn[:-4]))
        else:
            with zipfile.ZipFile(sys.argv[1]) as z:
                for n in z.namelist():
                    if '..' not in n and not n.startswith('/') and (n.endswith('manifest.json') or n.lower().endswith('.png')): z.extract(n, tmp)
            man = next((os.path.join(dp, 'manifest.json') for dp, _, fs in os.walk(tmp) if 'manifest.json' in fs), None)
            if not man: sys.exit('у архіві немає manifest.json')
            for it in json.load(open(man, encoding='utf-8'))['items']:
                src = os.path.join(os.path.dirname(man), it.get('filename', ''))
                if it.get('filename') and os.path.exists(src): jobs.append((it['letter'], it['word'], src, it['filename'][:-4]))
        for L, word, src, stem in jobs:
            if not re.fullmatch(r'[a-z0-9_]+', stem): continue
            img = clean(src, False, False, True, True)
            if img is None: continue
            img.save(os.path.join(IMG, stem + '.webp'), 'WEBP', quality=86, method=6)
            data[L] = [f'img/alphabet/{stem}.webp', word]
    order = [L for L, _ in letters]
    data = {k: data[k] for k in sorted(data, key=lambda k: order.index(k) if k in order else 99)}
    open(OUT, 'w', encoding='utf-8').write('/* 🔤 Картинки для сторінки «Алфавіт» і тестів на літери: літера → [файл, слово].\n'
        '   Згенеровано tools/import_alphabet.py; літер без картинки тут немає — для них лишається емодзі з data/basics.js. */\n'
        'window.ALPHA_PICS = ' + json.dumps(data, ensure_ascii=False) + ';\n')
    missing = [f'{L} — {w}' for L, w in letters if L not in data]
    print(f'оброблено {len(jobs)} · з картинкою {len(data)} з {len(letters)} · бракує: {", ".join(missing) or "—"}')

if __name__ == '__main__':
    main()
