"""Dev tool: build the pixel digit font used by the Game Boy and GBA themes'
life point counters (src/features/theme/chrome/pixel-font.js).

    uv run --with fonttools python tools/pixel-font.py

Digits 0-9 from the 5x7 bitmap font in src/features/theme/scenes/pixel-kit.js,
bold (each row smeared one pixel right, as the handhelds drew their LP), one
pixel = 100 units, 1000 units per em. Written as a WOFF data URL module.
"""
import base64
import io
import os
import re

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(ROOT, 'src', 'features', 'theme', 'scenes', 'pixel-kit.js')
OUT = os.path.join(ROOT, 'src', 'features', 'theme', 'chrome', 'pixel-font.js')
PX = 100


def bitmaps():
    src = open(KIT, encoding='utf-8').read()
    return {d: re.search(rf"\n  {d}: '([01]{{35}})'", src).group(1) for d in '0123456789'}


def glyph(bits):
    pen = TTGlyphPen(None)
    for r in range(7):
        row = [b == '1' for b in bits[r * 5:r * 5 + 5]]
        cells = [row[i] or (i > 0 and row[i - 1]) for i in range(5)] + [row[4]]
        i = 0
        while i < 6:
            if not cells[i]:
                i += 1
                continue
            j = i
            while j < 6 and cells[j]:
                j += 1
            x0, x1 = i * PX, j * PX
            y1 = (7 - r) * PX
            y0 = y1 - PX
            pen.moveTo((x0, y0))
            pen.lineTo((x0, y1))
            pen.lineTo((x1, y1))
            pen.lineTo((x1, y0))
            pen.closePath()
            i = j
    return pen.glyph()


def main():
    maps = bitmaps()
    names = ['.notdef', 'space'] + [f'd{d}' for d in '0123456789']
    fb = FontBuilder(1000, isTTF=True)
    fb.setupGlyphOrder(names)
    fb.setupCharacterMap({32: 'space', **{ord(d): f'd{d}' for d in '0123456789'}})
    empty = TTGlyphPen(None).glyph()
    glyphs = {'.notdef': empty, 'space': empty, **{f'd{d}': glyph(maps[d]) for d in '0123456789'}}
    fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics({n: (700, 0) for n in names})
    fb.setupHorizontalHeader(ascent=800, descent=-200)
    fb.setupNameTable({'familyName': 'DBTE Pixel', 'styleName': 'Regular'})
    fb.setupOS2(sTypoAscender=800, sTypoDescender=-200, usWinAscent=800, usWinDescent=200)
    fb.setupPost()
    fb.font.flavor = 'woff'
    buf = io.BytesIO()
    fb.save(buf)
    data = base64.b64encode(buf.getvalue()).decode('ascii')
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        f.write('// Pixel digits 0-9 (bold 5x7, from scenes/pixel-kit.js) for the Game Boy and\n')
        f.write('// GBA themes\' life point counters. Built by tools/pixel-font.py: regenerate, never hand-edit.\n')
        f.write(f"export const PIXEL_DIGITS = 'data:font/woff;base64,{data}';\n")
    print('ok', OUT, len(data))


if __name__ == '__main__':
    main()
