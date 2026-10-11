"""Dev tool: render real DuelingBook screens (page snapshots) under a theme.

    uv run --with playwright python tools/render-ui.py <snapshot_dir> <out_dir> <theme> [<theme> ...] [--screens a,b]

<snapshot_dir> holds <screen>.html page snapshots taken from a logged-in
session (scripts and the extension's own nodes stripped, <base> set to
duelingbook.com so DuelingBook's own CSS and images load). For each theme and
screen it injects the theme's full page CSS (tools/theme-css.mjs) and the skin
layers, and writes <out_dir>/<theme>/<screen>.png at the snapshot's viewport.
Snapshots contain account data: keep them out of the repo.
tools/render-duel.py builds on theme_css() and snapshot_html() to add the
theme's scene, life point styles and states, and the ink guard.
"""
import os
import re
import subprocess
import sys

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def theme_css(theme):
    return subprocess.run(['node', os.path.join(ROOT, 'tools', 'theme-css.mjs'), theme],
                          cwd=ROOT, capture_output=True, text=True, check=True).stdout


def snapshot_html(path, css, layers=True):
    """The snapshot at `path` with `css` injected, plus the empty skin layers
    unless layers=False. Returns (html, width, height)."""
    html = open(path, encoding='utf-8').read()
    m = re.search(r'<!-- snapshot \S+ (\d+)x(\d+) -->', html)
    w, h = (int(m.group(1)), int(m.group(2))) if m else (1280, 800)
    html = html.replace('</head>', f'<style id="dbte-theme-preview">{css}</style></head>', 1)
    if layers:
        html = re.sub(r'(<body[^>]*>)', r'\1<div id="dbte-skin-layer"></div><div id="dbte-skin-motif"></div>', html, count=1)
    return html, w, h


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    snaps, out, themes = args[0], args[1], args[2:]
    only = None
    if '--screens' in sys.argv:
        only = sys.argv[sys.argv.index('--screens') + 1].split(',')
        themes = [t for t in themes if t not in only and ',' not in t]
    screens = sorted(f[:-5] for f in os.listdir(snaps) if f.endswith('.html'))
    if only:
        screens = [s for s in screens if s in only]
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for theme in themes:
            css = theme_css(theme)
            os.makedirs(os.path.join(out, theme), exist_ok=True)
            for screen in screens:
                html, w, h = snapshot_html(os.path.join(snaps, screen + '.html'), css)
                page = browser.new_page(viewport={'width': w, 'height': h})
                page.set_content(html, wait_until='load')
                page.wait_for_timeout(1500)
                page.screenshot(path=os.path.join(out, theme, screen + '.png'))
                page.close()
        browser.close()
    print('ok', out)


if __name__ == '__main__':
    main()
