"""Dev tool: fit each theme's main-menu hero art into the shared right-margin slot.

    uv run --with playwright --with pillow python tools/menu-art.py inventory <snapshot_dir> <out_dir> [themes...]
    uv run --with playwright --with pillow python tools/menu-art.py fit <snapshot_dir> [themes...]
    uv run --with playwright --with pillow python tools/menu-art.py check <snapshot_dir> [themes...]

inventory  sheets of every named scene piece (dbtefx-* class), each rendered
           alone, so a hero can be picked by eye.
fit        prints the `at: [tx, ty, k]` that puts each hero listed in
           src/features/theme/menuArt.js whole and centred in MENU_SLOT.
check      renders the menu with the full theme CSS and reports each hero's
           visible box against the slot (exit 1 when one is off).

Uses the main-menu.html snapshot; a piece is measured by the pixels that
change when it is hidden, so faint glows and empty groups never count.
"""

import importlib.util
import io
import json
import os
import subprocess
import sys
from types import SimpleNamespace

from PIL import Image, ImageChops, ImageDraw
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIFF = 24
TOLERANCE = 6


def _load(name):
    spec = importlib.util.spec_from_file_location(name.replace('-', '_'), os.path.join(ROOT, 'tools', name + '.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


rd = _load('render-duel')


def node_json(script):
    out = subprocess.run(['node', '--no-warnings', '--input-type=module', '-e', script], cwd=ROOT,
                         capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def table():
    return node_json("import { MENU_ART, MENU_SLOT } from './src/features/theme/menuArt.js';"
                     "console.log(JSON.stringify({ art: MENU_ART, slot: MENU_SLOT }));")


# The piece under test: hidden (opacity 0) and/or moved, at the highest specificity
# so it beats the theme's own menu rules. The page itself steps out of the way so
# nothing opaque (tiles, a light theme's feed) covers the piece.
PROBE = '''([sel, tf, hidden]) => {
  let el = document.getElementById('dbte-menu-art-probe');
  if (!el) { el = document.createElement('style'); el.id = 'dbte-menu-art-probe'; document.head.appendChild(el); }
  const rules = [tf && `transform-origin: 0 0 !important; transform: ${tf} !important;`, hidden && 'opacity: 0 !important;'].filter(Boolean);
  el.textContent = `#content { visibility: hidden !important; }
#dbte-skin-fx#dbte-skin-fx#dbte-skin-fx ${sel} { ${rules.join(' ')} }`;
}'''
# Inventory: pieces the menu hides come back, so every candidate shows.
SHOW_ALL = '#dbte-skin-fx#dbte-skin-fx#dbte-skin-fx [class*="dbtefx-"] { display: inline !important; opacity: 1 !important; }'
CLASSES = '''() => [...new Set([...document.querySelectorAll('#dbte-skin-fx [class*="dbtefx-"]')]
  .flatMap((e) => [...e.classList]).filter((c) => /^dbtefx-[a-z0-9]+-/.test(c)))]'''


# Everything in the scene but the piece and its ancestors fades out, so nearer
# layers (a skyline, a frame) never cover part of it while it is measured.
ALONE = '''(sel) => {
  const fx = document.getElementById('dbte-skin-fx');
  const keep = new Set(['defs', 'style', 'mask', 'clipPath', 'linearGradient', 'radialGradient', 'pattern', 'filter', 'symbol']);
  const hero = fx.querySelectorAll(sel);
  const chain = new Set();
  hero.forEach((h) => { for (let e = h; e && e !== fx; e = e.parentElement) chain.add(e); });
  for (const e of chain) {
    for (const sib of e.parentElement.children) {
      if (chain.has(sib) || keep.has(sib.tagName) || [...hero].some((h) => sib.contains(h))) continue;
      sib.style.setProperty('opacity', '0', 'important');
    }
  }
}'''


def grab(screen):
    return Image.open(io.BytesIO(screen.page.screenshot())).convert('RGB')


def piece(screen, sel, tf=None):
    """The page with the piece, and the box of the pixels the piece changes."""
    screen.js(PROBE, [sel, tf, False])
    screen.page.wait_for_timeout(150)
    shown = grab(screen)
    screen.js(PROBE, [sel, tf, True])
    screen.page.wait_for_timeout(150)
    gone = grab(screen)
    diff = ImageChops.difference(shown, gone).convert('L').point(lambda v: 255 if v > DIFF else 0)
    return shown, diff.getbbox()


def open_menu(browser, opts, theme, css, alone=None):
    s = rd.Screen(browser, opts, 'main-menu', theme, css)
    if alone:
        s.js(ALONE, alone)
    s.page.wait_for_timeout(400)
    return s


def inventory(browser, opts, themes, out):
    tiles = []
    for t in themes:
        s = open_menu(browser, opts, t, rd.ui.theme_css(t) + SHOW_ALL)
        try:
            for cls in s.js(CLASSES):
                im, box = piece(s, '.' + cls)
                if not box:
                    continue
                crop = im.crop(box)
                crop.thumbnail((180, 180))
                crop = crop.convert('RGBA')
                tiles.append((f'{t} .{cls[7:]}', f'{box[2] - box[0]}x{box[3] - box[1]} @{box[0]},{box[1]}', crop))
        finally:
            s.close()
        print(t, flush=True)
    per = 48
    for p in range(0, len(tiles), per):
        chunk = tiles[p:p + per]
        sheet = Image.new('RGB', (8 * 200, ((len(chunk) + 7) // 8) * 216), (40, 40, 40))
        d = ImageDraw.Draw(sheet)
        for i, (label, size, crop) in enumerate(chunk):
            x, y = (i % 8) * 200, (i // 8) * 216
            sheet.paste(crop, (x + 10, y + 30), crop)
            d.text((x + 4, y + 2), label[:32], fill='yellow')
            d.text((x + 4, y + 14), size, fill='white')
        sheet.save(os.path.join(out, f'inventory_{p // per}.png'))


# Measured from a shrunk copy, always whole in the window: at scale S and offset O,
# then at scale S2, then moved by D.
# Screen = a * (s * u + t) + e per axis.
S, S2, O, D = 0.25, 0.2, 400, 50
PROBES = (f'translate({O}px, {O}px) scale({S})', f'translate({O}px, {O}px) scale({S2})',
          f'translate({O + D}px, {O + D}px) scale({S})')


REFINE = 3  # rounds of render-measure-correct at the real size


def solve(box, k, t, a, e, slot):
    """Scale and offset that put a piece measured at `box` (drawn at scale k,
    offset t, screen = a * (k * u + t) + e) whole and centred in the slot."""
    w, h = box[2] - box[0], box[3] - box[1]
    k2 = min(k * slot['w'] / w, k * slot['h'] / h, slot['maxScale'])
    out = []
    for i, c, size in ((0, slot['x'], w), (1, slot['y'], h)):
        au = (box[i] - a[i] * t[i] - e[i]) / k
        out.append((c - k2 / k * size / 2 - e[i]) / a[i] - k2 * au / a[i])
    return k2, out


def fit(browser, opts, themes, art, slot):
    for t in themes:
        hero = art[t]['hero']
        s = open_menu(browser, opts, t, rd.ui.theme_css(t), alone=hero)
        try:
            boxes = [piece(s, hero, tf)[1] for tf in PROBES]
            if not all(boxes):
                print(f"  '{t}': hero {hero} not visible on the menu", flush=True)
                continue
            b0, b1, b2 = boxes
            a = [(b2[i] - b0[i]) / D for i in (0, 1)]
            e = [b0[i] - S * (b0[i] - b1[i]) / (S - S2) - O * a[i] for i in (0, 1)]
            k, off = solve(b0, S, [O, O], a, e, slot)
            for _ in range(REFINE):
                box = piece(s, hero, f'translate({off[0]:.1f}px, {off[1]:.1f}px) scale({k:.3f})')[1]
                if not box:
                    break
                k, off = solve(box, k, off, a, e, slot)
        finally:
            s.close()
        print(f"  '{t}': [{off[0]:.1f}, {off[1]:.1f}, {k:.3f}],", flush=True)


def check(browser, opts, themes, art, slot):
    bad = 0
    cx, cy, sw, sh = slot['x'], slot['y'], slot['w'], slot['h']
    for t in themes:
        s = open_menu(browser, opts, t, rd.ui.theme_css(t), alone=art[t]['hero'])
        try:
            box = piece(s, art[t]['hero'])[1]
        finally:
            s.close()
        if not box:
            print(f'{t}: hero not visible', flush=True)
            bad += 1
            continue
        mx, my = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
        inside = box[0] >= cx - sw / 2 - TOLERANCE and box[2] <= cx + sw / 2 + TOLERANCE and box[1] >= cy - sh / 2 - TOLERANCE and box[3] <= cy + sh / 2 + TOLERANCE
        centred = abs(mx - cx) <= TOLERANCE and abs(my - cy) <= TOLERANCE
        ok = inside and centred
        bad += not ok
        print(f"{t}: {'ok ' if ok else 'OFF'} box={box} centre=({mx:.0f},{my:.0f})", flush=True)
    return bad


def main():
    mode, snaps = sys.argv[1], sys.argv[2]
    rest = sys.argv[3:]
    out = None
    if mode == 'inventory':
        out, rest = rest[0], rest[1:]
        os.makedirs(out, exist_ok=True)
    work = out or os.path.join(os.path.expanduser('~'), '.dbte-menu-art')
    os.makedirs(work, exist_ok=True)
    opts = SimpleNamespace(snaps=snaps, rig=rd.build_rig(work), chat=1)
    data = None if mode == 'inventory' else table()
    themes = rest or ([p[0] for p in rd.presets()] if mode == 'inventory' else list(data['art']))
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        try:
            if mode == 'inventory':
                inventory(browser, opts, themes, out)
            elif mode == 'fit':
                fit(browser, opts, themes, data['art'], data['slot'])
            else:
                sys.exit(1 if check(browser, opts, themes, data['art'], data['slot']) else 0)
        finally:
            browser.close()


if __name__ == '__main__':
    main()
