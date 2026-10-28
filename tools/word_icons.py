"""Іконки для теми слів з архіву PNG: python tools/word_icons.py <архів.zip> <тема> [--skip a,b] [--checker a,b]

Файли в архіві: NN_<артикль>_<слово>.png (01_en_mor.png, 09_a_banke_pa.png …), прозоре тло.
Що робить:
  * з кожної іконки лишає головний предмет: шматки сусідніх картинок біля країв (якщо
    іконки нарізали з одного аркуша) прибирає;
  * тло #FF00FF (пурпурове) прибирається само;
  * --checker a,b | all: прибирає сіро-білу «шахівницю», яку генератор іноді малює замість прозорості;
  * --hull a,b: для білих предметів без контуру — тло прибираємо лише поза оболонкою кольорових частин;
  * --halo: прибрати напівпрозорі сірі цятки навколо предмета (залишок шахівниці);
  * --main: лишити тільки головний предмет (уламки поруч — геть, навіть не біля краю);
  * --skip: слова, чиї картинки зіпсовані, — їх не беремо (лишається емодзі);
  * вписує предмет у прозоре полотно 300×300 і зберігає img/words/<тема>/<слово>.webp,
    а поруч — контрольний аркуш _sheet.png, щоб глянути все одним поглядом (у збірку він не йде).
Після цього допишіть слова в SETS у data/word-photos.js (ключ — слово без артикля).
Потрібен лише Pillow; архів розпаковується в тимчасову теку, нічого з нього не виконується.
"""
import sys, os, re, zipfile, tempfile
from collections import deque
from PIL import Image

def hull_mask(px, W, H):
    """Опукла оболонка кольорових (не сіро-білих) пікселів: усередині неї тло не прибираємо —
    так білі частини предмета (біла шкарпетка, сорочка) лишаються, навіть без контуру."""
    from PIL import ImageDraw
    pts = [(x, y) for y in range(0, H, 2) for x in range(0, W, 2)
           if px[x, y][3] > 24 and (max(px[x, y][:3]) - min(px[x, y][:3]) > 28 or min(px[x, y][:3]) < 150)]
    if len(pts) < 3: return None
    pts = sorted(set(pts))
    cross = lambda o, a, b: (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, up = [], []
    for p_ in pts:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p_) <= 0: lo.pop()
        lo.append(p_)
    for p_ in reversed(pts):
        while len(up) >= 2 and cross(up[-2], up[-1], p_) <= 0: up.pop()
        up.append(p_)
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon(lo[:-1] + up[:-1], fill=255, outline=255)
    return m.load()

def clean(path, checker=False, hull=False, main=False, halo=False):
    im = Image.open(path).convert('RGBA'); W, H = im.size; px = im.load()
    # однотонне пурпурове тло #FF00FF (запасний варіант, коли генератор не дає прозорості) — геть
    corners = [px[0, 0], px[W - 1, 0], px[0, H - 1], px[W - 1, H - 1]]
    if sum(1 for c in corners if c[3] > 0 and c[0] > 200 and c[1] < 80 and c[2] > 200) >= 3:
        for y in range(H):
            for x in range(W):
                r, g, b, a = px[x, y]
                if r > 150 and b > 150 and g < 110 and abs(r - b) < 70: px[x, y] = (r, g, b, 0)
                elif r > 120 and b > 120 and g < r - 40 and g < b - 40: px[x, y] = (min(r, (g + b) // 2 + 20), g, min(b, (g + r) // 2 + 20), a)  # пурпурова облямівка
    if halo:
        # напівпрозорі світло-сірі цятки (залишок шахівниці навколо предмета) — геть;
        # непрозоре сіре (хутро кота, вовка) не чіпаємо
        for y in range(H):
            for x in range(W):
                r, g, b, al = px[x, y]
                if 0 < al < 235 and max(r, g, b) - min(r, g, b) < 28 and min(r, g, b) > 140: px[x, y] = (r, g, b, 0)
                elif 0 < al < 70: px[x, y] = (r, g, b, 0)
    if checker:
        # «шахівниця»: заливка від країв картинки по світлих нейтральних (сірих/білих) пікселях —
        # так білі частини самого предмета, обведені контуром чи тінню, лишаються цілими
        hm = hull_mask(px, W, H) if hull else None
        bg0 = lambda c: c[3] > 0 and max(c[:3]) - min(c[:3]) < 16 and min(c[:3]) > 180
        bg = lambda x, y: bg0(px[x, y]) and not (hm and hm[x, y])
        seen = [[False] * W for _ in range(H)]; q = deque()
        for x in range(W):
            for y in (0, H - 1):
                if bg(x, y): seen[y][x] = True; q.append((y, x))
        for y in range(H):
            for x in (0, W - 1):
                if bg(x, y) and not seen[y][x]: seen[y][x] = True; q.append((y, x))
        while q:
            cy, cx = q.popleft(); r, g, b, a = px[cx, cy]; px[cx, cy] = (r, g, b, 0)
            for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                if 0 <= ny < H and 0 <= nx < W and not seen[ny][nx] and bg(nx, ny): seen[ny][nx] = True; q.append((ny, nx))
        if hm:
            # усередині оболонки — лише сірі клітинки шахівниці (білі на білій картці не видно)
            for y in range(H):
                for x in range(W):
                    r, g, b, al = px[x, y]
                    if al and hm[x, y] and max(r, g, b) - min(r, g, b) < 10 and 186 <= min(r, g, b) and max(r, g, b) <= 228: px[x, y] = (r, g, b, 0)
        # світла облямівка на межі з прибраним тлом — теж геть (інакше лишається сіра «аура»)
        for _ in range(2):
            edge = [(x, y) for y in range(H) for x in range(W) if px[x, y][3] and not (hm and hm[x, y]) and max(px[x, y][:3]) - min(px[x, y][:3]) < 24 and min(px[x, y][:3]) > 165
                    and any(0 <= x + dx < W and 0 <= y + dy < H and px[x + dx, y + dy][3] == 0 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))]
            for x, y in edge: r, g, b, a = px[x, y]; px[x, y] = (r, g, b, 0)
    mask = [[px[x, y][3] > 24 for x in range(W)] for y in range(H)]
    lab = [[0] * W for _ in range(H)]; comps = []
    for y in range(H):
        for x in range(W):
            if not mask[y][x] or lab[y][x]: continue
            n = len(comps) + 1; q = deque([(y, x)]); lab[y][x] = n; cnt = 0; x0 = x1 = x; y0 = y1 = y
            while q:
                cy, cx = q.popleft(); cnt += 1
                x0, x1, y0, y1 = min(x0, cx), max(x1, cx), min(y0, cy), max(y1, cy)
                for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                    if 0 <= ny < H and 0 <= nx < W and mask[ny][nx] and not lab[ny][nx]: lab[ny][nx] = n; q.append((ny, nx))
            comps.append((cnt, (x0, y0, x1, y1)))
    if not comps: return None
    big = max(c[0] for c in comps)
    keep = set()
    bb = comps[[c[0] for c in comps].index(big)][1]
    for i, (s, (x0, y0, x1, y1)) in enumerate(comps, start=1):
        edge = x0 <= 1 or y0 <= 1 or x1 >= W - 2 or y1 >= H - 2
        if main:
            # лише головний предмет: великі частини або ті, чий центр — у рамці найбільшої
            cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
            inside = bb[0] - 8 <= cx <= bb[2] + 8 and bb[1] - 8 <= cy <= bb[3] + 8
            if s == big or s >= big * 0.25 or (inside and s > big * 0.002): keep.add(i)
        elif s == big or (s > big * 0.02 and not (edge and s < big * 0.35)): keep.add(i)
    for y in range(H):
        for x in range(W):
            if lab[y][x] not in keep: r, g, b, a = px[x, y]; px[x, y] = (r, g, b, 0)
    box = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    obj = im.crop(box); k = min(276 / obj.width, 276 / obj.height)
    obj = obj.resize((max(1, round(obj.width * k)), max(1, round(obj.height * k))), Image.LANCZOS)
    c = Image.new('RGBA', (300, 300), (0, 0, 0, 0)); c.paste(obj, ((300 - obj.width) // 2, (300 - obj.height) // 2), obj)
    return c

def main():
    try: sys.stdout.reconfigure(encoding="utf-8")
    except Exception: pass
    args = sys.argv[1:]
    if len(args) < 2: print(__doc__); sys.exit(1)
    zpath, theme = args[0], args[1]
    if not re.fullmatch(r'[a-z0-9_-]+', theme): sys.exit('тема — латиницею: naboer, familie …')
    opt = lambda k: set(args[args.index(k) + 1].split(',')) if k in args else set()
    skip, checker, hull = opt('--skip'), opt('--checker'), opt('--hull')
    root = os.path.join(os.path.dirname(__file__), '..')
    out_dir = os.path.join(root, 'img', 'words', theme); os.makedirs(out_dir, exist_ok=True)
    done = []
    with tempfile.TemporaryDirectory() as tmp:
        with zipfile.ZipFile(zpath) as z:
            for n in z.namelist():
                if n.lower().endswith('.png') and '/' not in n.strip('/') and not n.startswith('..'): z.extract(n, tmp)
        for f in sorted(os.listdir(tmp)):
            if not f.lower().endswith('.png'): continue
            name = re.sub(r'^\d+_(en_|ei_|et_|a_)?', '', f)[:-4].lower()
            if name in skip: continue
            img = clean(os.path.join(tmp, f), name in checker or 'all' in checker, name in hull, '--main' in args, '--halo' in args)
            if img is None: continue
            img.save(os.path.join(out_dir, name + '.webp'), 'WEBP', quality=86, method=6); done.append(name)
    sheet = Image.new('RGB', (6 * 150, ((len(done) + 5) // 6) * 150), (235, 235, 235))
    for i, n in enumerate(done):
        im = Image.open(os.path.join(out_dir, n + '.webp')).convert('RGBA').resize((140, 140)); sheet.paste(im, ((i % 6) * 150 + 5, (i // 6) * 150 + 5), im)
    sheet.save(os.path.join(tempfile.gettempdir(), f'word_icons_{theme}_sheet.png'))
    print(f'{theme}: {len(done)} іконок → img/words/{theme}/ · аркуш: {os.path.join(tempfile.gettempdir(), "word_icons_" + theme + "_sheet.png")}')
    print(' '.join(done))

if __name__ == '__main__':
    main()
