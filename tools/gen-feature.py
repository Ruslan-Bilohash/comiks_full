# -*- coding: utf-8 -*-
"""Комікс·Lab — 🖼 банер 1024×500 для Google Play (feature graphic).

    python tools/gen-feature.py

Google Play вимагає цей банер обов'язково, і без нього застосунок не опублікувати.
Малюємо з тих самих кольорів, що й сайт, у подвійному розмірі та зменшуємо —
так краї виходять рівні, без «сходинок».
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = 'C:/comiks/store/android'
os.makedirs(OUT, exist_ok=True)

W, H, K = 1024, 500, 3                 # K — у скільки разів малюємо більше
YELLOW, INK, CREAM, RED = (255, 210, 63), (20, 20, 20), (255, 248, 234), (238, 64, 53)


def font(size, bold=True):
    for name in ('segoeuib.ttf' if bold else 'segoeui.ttf', 'arialbd.ttf' if bold else 'arial.ttf'):
        p = 'C:/Windows/Fonts/' + name
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


img = Image.new('RGB', (W * K, H * K), CREAM)
d = ImageDraw.Draw(img)

# ── фон: жовта смуга з нахилом, як шапка сайту ──
d.polygon([(0, 0), (W * K, 0), (W * K, int(H * K * 0.46)), (0, int(H * K * 0.60))], fill=YELLOW)
# крапки, як на тлі сайту
for y in range(0, H * K, 26 * K // 3):
    for x in range(0, W * K, 26 * K // 3):
        d.ellipse([x, y, x + 3, y + 3], fill=(0, 0, 0, 20) if y > H * K * 0.6 else (255, 255, 255))

# ── бульбашка з трьома крапками (логотип) ──
bx, by, bw, bh = 62 * K, 96 * K, 150 * K, 118 * K
d.rounded_rectangle([bx, by, bx + bw, by + bh], 38 * K, fill=(255, 255, 255), outline=INK, width=9 * K)
d.polygon([(bx + 36 * K, by + bh - 4 * K), (bx + 40 * K, by + bh + 34 * K), (bx + 78 * K, by + bh - 4 * K)],
          fill=(255, 255, 255), outline=INK)
d.polygon([(bx + 40 * K, by + bh - 10 * K), (bx + 44 * K, by + bh + 26 * K), (bx + 72 * K, by + bh - 10 * K)],
          fill=(255, 255, 255))
for i in range(3):
    cx = bx + 42 * K + i * 34 * K
    cy = by + bh // 2
    d.ellipse([cx - 10 * K, cy - 10 * K, cx + 10 * K, cy + 10 * K], fill=INK)

# ── назва й підпис ──
d.text((250 * K, 96 * K), 'Komiks·Lab', font=font(86 * K), fill=INK)
d.text((252 * K, 196 * K), 'Learn Norwegian with comics', font=font(40 * K), fill=INK)

# ── плашка з рівнями ──
tag = 'A1 · A2 · B1 · B2'
tw = d.textlength(tag, font=font(34 * K))
d.rounded_rectangle([252 * K, 262 * K, 252 * K + tw + 44 * K, 322 * K], 30 * K, fill=RED)
d.text((274 * K, 272 * K), tag, font=font(34 * K), fill=(255, 255, 255))

# ── три короткі переваги внизу ──
items = ['🔊  Real Norwegian voices', '🧩  75 comics', '🎮  Games & tests']
x = 252 * K
for it in items:
    d.text((x, 392 * K), it.replace('🔊  ', '').replace('🧩  ', '').replace('🎮  ', ''),
           font=font(30 * K, False), fill=INK)
    x += int(d.textlength(it.split('  ')[1], font=font(30 * K, False))) + 62 * K

img = img.resize((W, H), Image.LANCZOS)
path = os.path.join(OUT, 'feature-graphic.png')
img.save(path, optimize=True)
print(f'🖼  {path} · {W}x{H} · {os.path.getsize(path) // 1024} КБ')

# іконка 512×512 для сторінки магазину — беремо готову
src = 'C:/comiks/app/resources/icon.png'
if os.path.exists(src):
    ic = Image.open(src).convert('RGB').resize((512, 512), Image.LANCZOS)
    p2 = os.path.join(OUT, 'icon-512.png')
    ic.save(p2, optimize=True)
    print(f'🖼  {p2} · 512x512 · {os.path.getsize(p2) // 1024} КБ')
