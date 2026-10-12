"""Dev tool: render DuelingBook page snapshots as a player sees them under a
theme: the theme's page CSS and skin, its scene behind the stage, life point
styles and states, and the runtime ink guard.

    uv run --with playwright --with pillow python tools/render-duel.py <snapshot_dir> <out_dir> [<theme> ...]
        [--all] [--jobs N] [--lp 8000,2300] [--opp-state low] [--lp-style theme]
        [--chat 1] [--no-ink] [--lp-sheet obsidian,lightsworn,blackwing]

<snapshot_dir> holds the page snapshots described in tools/render-ui.py
(duel-watch.html, main-menu.html, dialog.html are used). For each theme
(--all: every preset) it writes <out_dir>/<theme>/:
  duel.png       duel-watch with a hovered card's preview and card text
                 shown (left column); bottom player (#lifepoints1) and top player
                 (#lifepoints2) at --lp, the top side forced into --opp-state
  duel-hit.png   the same with a "hit" pulse stacked on the top side's state
  lp-crop.png    both LP counters (top, then bottom) at device scale 2
  menu.png       main-menu
  dialog.png     the error pop-up
  regions.json   key rectangles of duel.png in px ([x, y, width, height]):
                 stage (the scaled playmat, so the whole board area), lpSelf,
                 lpOpp, phases, chat, cardPreview, cardText, watchers
and <out_dir>/_report.json (seconds per theme, scene card art, ink changes,
errors). --lp-sheet instead writes <out_dir>/_lp-styles.png: every life point
style (rows) over the given themes (columns), LP crops at device scale 2.

How it is built: tools/theme-css.mjs gives the theme's full page CSS (via
render-ui.py); tools/duel-rig.mjs, bundled once per run with esbuild (npx),
mounts the skin layers and scene, LP style and effects CSS, LP values and
states, the duel chat transparency and the ink guard from the extension's own
modules, in the order ThemeEffect.jsx and LifePointsEffect.jsx use (layers
are the first children of <body>, so behind DuelingBook's stage).

Limits: the scene is its still frame (`still: true`, every animation off),
with no particle canvas and no WebGL shader. LP glow animations are paused at
their peak (see freezeLp in duel-rig.mjs). The ink guard runs one full pass
after the page settles, as the extension's first pass does; it does not
follow later changes. --lp-style other than "theme" also applies to duel.png.
Card art (scene and duel) loads live from images.duelingbook.com: network on.
Snapshots contain account data: keep them and the renders out of the repo.
"""
import argparse
import base64
import importlib.util
import io
import json
import os
import subprocess
import sys
import time
from concurrent.futures import ProcessPoolExecutor

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(ROOT, 'tools')
LP_STYLES = ['plain', 'dm', 'gx', '5ds', 'zexal', 'arcv', 'vrains', 'rush']
ATTEMPTS = 3
CROP_PAD = 14  # CSS px around each LP box, so the glows fit
# Nodes the snapshot browser's automation left in the page; never part of DuelingBook.
HIDE_CSS = '[id^="claude-"] { display: none !important; }'


def _render_ui():
    spec = importlib.util.spec_from_file_location('render_ui', os.path.join(TOOLS, 'render-ui.py'))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


ui = _render_ui()


def node(*args):
    return subprocess.run(['node', *args], cwd=ROOT, capture_output=True, text=True, check=True, shell=False).stdout


def build_rig(out):
    path = os.path.join(out, '.duel-rig.js')
    subprocess.run(
        ['npx', '--yes', 'esbuild@0.24.0', os.path.join(TOOLS, 'duel-rig.mjs'), '--bundle', '--format=iife',
         '--jsx=automatic', '--define:process.env.NODE_ENV="production"', '--log-level=warning', f'--outfile={path}'],
        cwd=ROOT, check=True, shell=sys.platform == 'win32')
    return path


def presets():
    script = "import { PRESETS } from './src/features/theme/presets.js'; console.log(JSON.stringify(PRESETS.map((p) => [p.id, p.group])));"
    return json.loads(node('--no-warnings', '--input-type=module', '-e', script))


class Screen:
    """One snapshot under one theme, with the rig loaded and the scene mounted."""

    def __init__(self, browser, opts, screen, theme, css):
        html, self.w, self.h = ui.snapshot_html(os.path.join(opts.snaps, screen + '.html'), css + '\n' + HIDE_CSS, layers=False)
        self.page = browser.new_page(viewport={'width': self.w, 'height': self.h})
        self.page.set_content(html, wait_until='load', timeout=120000)
        try:
            self.page.wait_for_load_state('networkidle', timeout=20000)
        except Exception:
            pass
        self.page.add_script_tag(path=opts.rig)
        self.theme = theme
        self.scene = self.page.evaluate('t => dbteRig.layers(t)', theme)
        if self.scene['failed']:
            self.scene = self.page.evaluate('t => dbteRig.layers(t)', theme)
        if self.scene['failed']:
            raise RuntimeError(f'{screen}: {self.scene["failed"]} of {self.scene["pics"]} scene pictures failed to load')
        self.page.evaluate('a => dbteRig.chat(a)', opts.chat)
        self.ink_changes = None

    def js(self, expr, arg=None):
        return self.page.evaluate(expr, arg)

    def settle(self, ink):
        self.page.wait_for_timeout(500)
        self.js('() => dbteRig.freezeLp()')
        if ink:
            self.ink_changes = self.js('t => dbteRig.ink(t)', self.theme)
        self.page.wait_for_timeout(250)

    def shot(self, path, **kw):
        return self.page.screenshot(path=path, **kw)

    def lp_crops(self, scale=2):
        """PNG bytes of the top and bottom LP boxes, rendered at device scale `scale`."""
        cdp = self.page.context.new_cdp_session(self.page)
        cdp.send('Emulation.setDeviceMetricsOverride', {'width': self.w, 'height': self.h, 'deviceScaleFactor': scale, 'mobile': False})
        self.page.wait_for_timeout(300)
        self.js('() => dbteRig.freezeLp()')
        crops = []
        for sel in ('#lifepoints2', '#lifepoints1'):
            x, y, w, h = self.js('s => dbteRig.rect(s)', sel)
            clip = {'x': x - CROP_PAD, 'y': y - CROP_PAD, 'width': w + 2 * CROP_PAD, 'height': h + 2 * CROP_PAD}
            shot = cdp.send('Page.captureScreenshot', {'format': 'png', 'clip': {**clip, 'scale': 1}})
            crops.append(base64.b64decode(shot['data']))
        cdp.send('Emulation.clearDeviceMetricsOverride')
        cdp.detach()
        self.page.wait_for_timeout(200)
        return crops

    def close(self):
        self.page.close()


def stack(pngs, gap=12, bg=(24, 24, 24), horizontal=False):
    from PIL import Image
    ims = [Image.open(io.BytesIO(b)).convert('RGB') for b in pngs]
    if horizontal:
        out = Image.new('RGB', (sum(i.width for i in ims) + gap * (len(ims) + 1), max(i.height for i in ims) + 2 * gap), bg)
        x = gap
        for im in ims:
            out.paste(im, (x, gap))
            x += im.width + gap
    else:
        out = Image.new('RGB', (max(i.width for i in ims) + 2 * gap, sum(i.height for i in ims) + gap * (len(ims) + 1)), bg)
        y = gap
        for im in ims:
            out.paste(im, (gap, y))
            y += im.height + gap
    return out


def render_theme(browser, opts, theme):
    out = os.path.join(opts.out, theme)
    os.makedirs(out, exist_ok=True)
    css = ui.theme_css(theme)
    self_lp, opp_lp = opts.lp
    info = {}

    duel = Screen(browser, opts, 'duel-watch', theme, css)
    try:
        info['scenePics'] = duel.scene['pics']
        info['scene'] = duel.scene['scene']
        duel.js('() => dbteRig.preview()')
        duel.js('s => dbteRig.lpStyle(s, true)', opts.lp_style)
        duel.js('a => dbteRig.setLp(1, a[0])', [self_lp])
        duel.js('a => dbteRig.setLp(2, a[0], a[1])', [opp_lp, opts.opp_state])
        duel.settle(opts.ink)
        info['inkDuel'] = duel.ink_changes
        duel.shot(os.path.join(out, 'duel.png'))
        regions = duel.js('() => dbteRig.regions()')
        with open(os.path.join(out, 'regions.json'), 'w', encoding='utf-8') as f:
            json.dump(regions, f, indent=1)
        stack(duel.lp_crops()).save(os.path.join(out, 'lp-crop.png'))
        duel.js('a => dbteRig.setLp(2, a[0], a[1], a[2])', [opp_lp, opts.opp_state, 'hit'])
        duel.settle(False)
        duel.shot(os.path.join(out, 'duel-hit.png'))
    finally:
        duel.close()

    for screen, name in (('main-menu', 'menu'), ('dialog', 'dialog')):
        s = Screen(browser, opts, screen, theme, css)
        try:
            s.settle(opts.ink)
            info[f'ink_{name}'] = s.ink_changes
            s.shot(os.path.join(out, name + '.png'))
        finally:
            s.close()
    return info


def lp_sheet(browser, opts, themes):
    from PIL import Image, ImageDraw, ImageFont
    font = ImageFont.load_default(size=22)
    self_lp, opp_lp = opts.lp
    cells = {}
    for theme in themes:
        s = Screen(browser, opts, 'duel-watch', theme, ui.theme_css(theme))
        try:
            s.js('a => dbteRig.setLp(1, a[0])', [self_lp])
            s.js('a => dbteRig.setLp(2, a[0], a[1])', [opp_lp, opts.opp_state])
            for style in LP_STYLES:
                s.js('s => dbteRig.lpStyle(s, true)', style)
                s.settle(opts.ink)
                cells[theme, style] = stack(s.lp_crops(), gap=6, bg=(0, 0, 0))
        finally:
            s.close()
    cw = max(c.width for c in cells.values())
    ch = max(c.height for c in cells.values())
    label_w, head_h, gap = 110, 44, 10
    sheet = Image.new('RGB', (label_w + len(themes) * (cw + gap) + gap, head_h + len(LP_STYLES) * (ch + gap) + gap), (16, 16, 16))
    draw = ImageDraw.Draw(sheet)
    for j, theme in enumerate(themes):
        draw.text((label_w + j * (cw + gap) + gap, 10), theme, fill=(235, 235, 235), font=font)
    for i, style in enumerate(LP_STYLES):
        y = head_h + i * (ch + gap)
        draw.text((10, y + ch // 2 - 11), style, fill=(235, 235, 235), font=font)
        for j, theme in enumerate(themes):
            sheet.paste(cells[theme, style], (label_w + j * (cw + gap) + gap, y))
    path = os.path.join(opts.out, '_lp-styles.png')
    sheet.save(path)
    return path


def worker(opts, themes):
    report = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for theme in themes:
            for attempt in range(1, ATTEMPTS + 1):
                t0 = time.time()
                try:
                    info = render_theme(browser, opts, theme)
                    report[theme] = {'ok': True, 'seconds': round(time.time() - t0, 1), 'attempts': attempt, **info}
                    break
                except Exception as e:  # flaky network or page: try again
                    report[theme] = {'ok': False, 'seconds': round(time.time() - t0, 1), 'attempts': attempt, 'error': str(e)[:500]}
            print(theme, 'ok' if report[theme]['ok'] else 'FAILED', report[theme]['seconds'], 's', flush=True)
        browser.close()
    return report


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    ap.add_argument('snaps')
    ap.add_argument('out')
    ap.add_argument('themes', nargs='*')
    ap.add_argument('--all', action='store_true', help='every preset')
    ap.add_argument('--jobs', type=int, default=1, help='browsers in parallel')
    ap.add_argument('--lp', default='8000,2300', help='bottom,top life points')
    ap.add_argument('--opp-state', default='low', help='forced state of the top side ("" = computed)')
    ap.add_argument('--lp-style', default='theme')
    ap.add_argument('--chat', type=float, default=1, help='duel chat / card text opacity (1 = DuelingBook default)')
    ap.add_argument('--no-ink', dest='ink', action='store_false')
    ap.add_argument('--lp-sheet', help='comma-separated themes: write _lp-styles.png only')
    opts = ap.parse_args()
    opts.lp = [int(v) for v in opts.lp.split(',')]
    opts.opp_state = opts.opp_state or None
    os.makedirs(opts.out, exist_ok=True)
    opts.rig = build_rig(opts.out)

    if opts.lp_sheet:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            print('ok', lp_sheet(browser, opts, opts.lp_sheet.split(',')))
            browser.close()
        return

    groups = dict(presets())
    themes = list(groups) if opts.all else opts.themes
    unknown = [t for t in themes if t not in groups]
    if unknown:
        sys.exit(f'unknown theme(s): {", ".join(unknown)}')
    jobs = max(1, min(opts.jobs, len(themes)))
    chunks = [themes[i::jobs] for i in range(jobs)]
    t0 = time.time()
    report = {}
    if jobs == 1:
        report = worker(opts, themes)
    else:
        with ProcessPoolExecutor(jobs) as pool:
            for part in pool.map(worker, [opts] * jobs, chunks):
                report.update(part)
    for t in report:
        report[t]['group'] = groups[t]
    report = {t: report[t] for t in themes}
    with open(os.path.join(opts.out, '_report.json'), 'w', encoding='utf-8') as f:
        json.dump({'wallSeconds': round(time.time() - t0, 1), 'jobs': jobs, 'themes': report}, f, indent=1)
    failed = [t for t in themes if not report[t]['ok']]
    print('done', len(themes) - len(failed), 'ok;', 'failed:', ', '.join(failed) or 'none')


if __name__ == '__main__':
    main()
