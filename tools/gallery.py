"""Dev tool: a local HTML gallery of every theme as a player sees it.

    uv run --with playwright --with pillow python tools/gallery.py [--snapshots DIR] [--out DIR] [--all] [--jobs N]
    (npm run gallery -- [same flags])

Renders each preset with tools/render-duel.py (healthy duel 8000 vs 6500, low
duel 8000 vs 1800 with the hit pulse, LP counters, main menu, error dialog) and
writes <out>/index.html: themes grouped like the panel, a search box, a group
filter, and a viewer with every shot. Only themes whose own files changed (their
chrome, scene or preset tokens) are rendered again; a change to shared code
(anything else under src/, or the render tools) renders every theme. New
presets appear on their own. --all forces a full render.

<out> defaults to ~/dbte-gallery. The snapshot folder is remembered in
<out>/manifest.json after the first run. Snapshots and renders contain account
data: both stay outside the repo.
"""
import argparse
import hashlib
import html
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')
THEME = os.path.join(SRC, 'features', 'theme')
RENDER = os.path.join(ROOT, 'tools', 'render-duel.py')
TOOL_FILES = ['tools/render-duel.py', 'tools/duel-rig.mjs', 'tools/render-ui.py', 'tools/theme-css.mjs', 'tools/gallery.py']
SHOTS = [('duel', 'Duel'), ('low', 'Low LP'), ('hit', 'Hit at low LP'), ('lp', 'LP counters'), ('menu', 'Main menu'), ('dialog', 'Dialog')]
THUMB_W = 520


def presets():
    script = (
        "import { PRESETS, PRESET_GROUPS } from %s;"
        "console.log(JSON.stringify({ groups: PRESET_GROUPS, presets: PRESETS.map(({ id, group, name, blurb, tokens }) => ({ id, group, name, blurb, tokens })) }));"
    ) % json.dumps('file:///' + os.path.join(THEME, 'presets.js').replace('\\', '/'))
    out = subprocess.run(['node', '--input-type=module', '-e', script], capture_output=True, text=True, check=True, cwd=ROOT)
    return json.loads(out.stdout)


def file_hash(paths):
    h = hashlib.sha256()
    for p in sorted(paths):
        h.update(p.replace('\\', '/').encode())
        if os.path.exists(p):
            with open(p, 'rb') as f:
                h.update(f.read())
    return h.hexdigest()


def own_files(pid):
    return [os.path.join(THEME, 'chrome', pid + '.js'), os.path.join(THEME, 'scenes', pid + '.js')]


def shared_hash(ids):
    own = {os.path.normcase(p) for pid in ids for p in own_files(pid)}
    files = [os.path.join(ROOT, t) for t in TOOL_FILES]
    for base, _, names in os.walk(SRC):
        for n in names:
            p = os.path.join(base, n)
            if os.path.normcase(p) not in own and not p.endswith(os.path.join('theme', 'presets.js')):
                files.append(p)
    return file_hash(files)


def theme_hash(p):
    return hashlib.sha256((file_hash(own_files(p['id'])) + json.dumps(p['tokens'], sort_keys=True)).encode()).hexdigest()


def render(snapshots, ids, jobs, tmp):
    common = [sys.executable, RENDER, snapshots]
    subprocess.run(common + [os.path.join(tmp, 'low')] + ids + ['--jobs', str(jobs), '--lp', '8000,1800'], check=True)
    subprocess.run(common + [os.path.join(tmp, 'ok')] + ids + ['--jobs', str(jobs), '--lp', '8000,6500', '--opp-state', ''], check=True)


def save(src, dest_full, dest_thumb):
    im = Image.open(src).convert('RGB')
    im.save(dest_full, quality=88)
    t = im.copy()
    t.thumbnail((THUMB_W, THUMB_W * 2))
    t.save(dest_thumb, quality=82)


def collect(tmp, out, pid):
    d = os.path.join(out, 'img', pid)
    os.makedirs(d, exist_ok=True)
    pairs = {
        'duel': os.path.join(tmp, 'ok', pid, 'duel.png'),
        'low': os.path.join(tmp, 'low', pid, 'duel.png'),
        'hit': os.path.join(tmp, 'low', pid, 'duel-hit.png'),
        'lp': os.path.join(tmp, 'low', pid, 'lp-crop.png'),
        'menu': os.path.join(tmp, 'low', pid, 'menu.png'),
        'dialog': os.path.join(tmp, 'low', pid, 'dialog.png'),
    }
    ok = True
    for key, src in pairs.items():
        if os.path.exists(src):
            save(src, os.path.join(d, key + '.jpg'), os.path.join(d, key + '.t.jpg'))
        else:
            ok = False
    return ok


PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Theme Gallery</title>
<style>
:root { --bg: #101218; --panel: #181b23; --line: #2a2f3b; --text: #e8ebf2; --muted: #98a0b0; --accent: #5fd0e0; --new: #ffcf4a; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.45 system-ui, Segoe UI, sans-serif; }
header { position: sticky; top: 0; z-index: 2; background: color-mix(in srgb, var(--bg) 92%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); padding: 14px 20px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
h1 { font-size: 18px; margin: 0 16px 0 0; }
.meta { color: var(--muted); font-size: 13px; }
input[type=search] { background: var(--panel); border: 1px solid var(--line); color: var(--text); border-radius: 8px; padding: 8px 12px; min-width: 220px; font: inherit; }
.pills { display: flex; gap: 6px; flex-wrap: wrap; }
.pills button { background: var(--panel); border: 1px solid var(--line); color: var(--text); border-radius: 999px; padding: 5px 12px; cursor: pointer; font: inherit; font-size: 13px; }
.pills button[aria-pressed=true] { border-color: var(--accent); color: var(--accent); }
main { padding: 8px 20px 40px; }
h2 { font-size: 15px; color: var(--muted); font-weight: 600; margin: 26px 0 10px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
.card { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; cursor: pointer; text-align: left; padding: 0; color: inherit; font: inherit; }
.card:hover, .card:focus-visible { border-color: var(--accent); outline: none; }
.card img { display: block; width: 100%; aspect-ratio: 2047 / 1070; object-fit: cover; background: #000; }
.card .t { padding: 9px 12px 11px; }
.card b { font-size: 15px; }
.card .b { color: var(--muted); font-size: 13px; }
.badge { font-size: 11px; font-weight: 700; color: #111; background: var(--new); border-radius: 4px; padding: 1px 6px; margin-left: 6px; vertical-align: 2px; }
.empty { color: var(--muted); padding: 30px 0; }
dialog { width: min(1400px, 96vw); max-height: 94vh; background: var(--panel); color: var(--text); border: 1px solid var(--line); border-radius: 12px; padding: 0; }
dialog::backdrop { background: rgba(0, 0, 0, 0.75); }
.vh { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
.vh h3 { margin: 0; font-size: 17px; flex: 1; }
.vh button { background: var(--bg); border: 1px solid var(--line); color: var(--text); border-radius: 6px; padding: 5px 10px; cursor: pointer; font: inherit; font-size: 13px; }
.vh button[aria-pressed=true] { border-color: var(--accent); color: var(--accent); }
.vb { padding: 12px; overflow: auto; max-height: calc(94vh - 60px); text-align: center; }
.vb img { max-width: 100%; height: auto; }
</style></head>
<body>
<header><h1>Theme Gallery</h1><span class="meta" id="meta"></span>
<input type="search" id="q" placeholder="Search themes" aria-label="Search themes">
<div class="pills" id="pills"></div></header>
<main id="main"></main>
<dialog id="viewer"><div class="vh"><h3 id="vt"></h3><span id="tabs"></span><button id="prev" aria-label="Previous theme">&larr;</button><button id="next" aria-label="Next theme">&rarr;</button><button id="close">Close</button></div><div class="vb"><img id="vi" alt=""></div></dialog>
<script>
const DATA = __DATA__;
const SHOTS = __SHOTS__;
const main = document.getElementById('main'), q = document.getElementById('q'), pills = document.getElementById('pills');
let group = 'all', order = [], cur = 0, shot = 'duel';
document.getElementById('meta').textContent = `${DATA.presets.length} themes, updated ${DATA.updated}`;
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
[{ id: 'all', label: 'All' }, ...DATA.groups].forEach((g) => {
  const b = document.createElement('button'); b.textContent = g.label; b.setAttribute('aria-pressed', g.id === group);
  b.onclick = () => { group = g.id; [...pills.children].forEach((x) => x.setAttribute('aria-pressed', x === b)); draw(); };
  pills.appendChild(b);
});
const draw = () => {
  const term = q.value.trim().toLowerCase();
  const hit = (p) => (group === 'all' || p.group === group) && (!term || (p.name + ' ' + p.id + ' ' + (p.blurb || '')).toLowerCase().includes(term));
  order = DATA.presets.filter(hit);
  main.innerHTML = DATA.groups.map((g) => {
    const list = order.filter((p) => p.group === g.id);
    if (!list.length) return '';
    return `<h2>${esc(g.label)} (${list.length})</h2><div class="grid">${list.map((p) => `
      <button class="card" data-id="${p.id}"><img loading="lazy" src="img/${p.id}/duel.t.jpg?v=${p.v}" alt="">
      <div class="t"><b>${esc(p.name)}</b>${p.fresh ? '<span class="badge">updated</span>' : ''}<div class="b">${esc(p.blurb || '')}</div></div></button>`).join('')}</div>`;
  }).join('') || '<p class="empty">No theme matches.</p>';
  main.querySelectorAll('.card').forEach((c) => (c.onclick = () => open(order.findIndex((p) => p.id === c.dataset.id))));
};
const viewer = document.getElementById('viewer'), vi = document.getElementById('vi'), tabs = document.getElementById('tabs');
const show = () => {
  const p = order[cur]; document.getElementById('vt').textContent = p.name;
  vi.src = `img/${p.id}/${shot}.jpg?v=${p.v}`; vi.alt = `${p.name}: ${SHOTS.find((s) => s[0] === shot)[1]}`;
  tabs.innerHTML = SHOTS.map(([k, l]) => `<button data-k="${k}" aria-pressed="${k === shot}">${l}</button>`).join(' ');
  tabs.querySelectorAll('button').forEach((b) => (b.onclick = () => { shot = b.dataset.k; show(); }));
};
const open = (i) => { cur = i; show(); if (!viewer.open) viewer.showModal(); };
document.getElementById('close').onclick = () => viewer.close();
document.getElementById('prev').onclick = () => open((cur + order.length - 1) % order.length);
document.getElementById('next').onclick = () => open((cur + 1) % order.length);
viewer.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') open((cur + order.length - 1) % order.length);
  if (e.key === 'ArrowRight') open((cur + 1) % order.length);
  const n = Number(e.key); if (n >= 1 && n <= SHOTS.length) { shot = SHOTS[n - 1][0]; show(); }
});
q.oninput = draw; draw();
</script></body></html>
"""


def write_page(out, data):
    page = PAGE.replace('__DATA__', json.dumps(data)).replace('__SHOTS__', json.dumps(SHOTS))
    with open(os.path.join(out, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(page)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--snapshots')
    ap.add_argument('--out', default=os.path.join(os.path.expanduser('~'), 'dbte-gallery'))
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--jobs', type=int, default=4)
    a = ap.parse_args()
    out = os.path.abspath(a.out)
    if os.path.normcase(out).startswith(os.path.normcase(ROOT)):
        sys.exit('--out must be outside the repo: renders contain account data')
    os.makedirs(out, exist_ok=True)
    mpath = os.path.join(out, 'manifest.json')
    manifest = json.load(open(mpath, encoding='utf-8')) if os.path.exists(mpath) else {'themes': {}}
    snapshots = a.snapshots or manifest.get('snapshots')
    if not snapshots or not os.path.isfile(os.path.join(snapshots, 'duel-watch.html')):
        sys.exit('Give --snapshots <dir> holding duel-watch.html, main-menu.html, dialog.html (tools/render-ui.py)')
    manifest['snapshots'] = os.path.abspath(snapshots)

    info = presets()
    ids = [p['id'] for p in info['presets']]
    shared = shared_hash(ids)
    full = a.all or manifest.get('shared') != shared
    todo = [p for p in info['presets'] if full or manifest['themes'].get(p['id'], {}).get('hash') != theme_hash(p)
            or not os.path.exists(os.path.join(out, 'img', p['id'], 'duel.jpg'))]
    print(f"{len(todo)} of {len(ids)} themes to render" + (' (shared code changed)' if full and not a.all else ''))

    stamp = time.strftime('%Y-%m-%d %H:%M')
    if todo:
        tmp = tempfile.mkdtemp(prefix='dbte-gallery-')
        try:
            render(manifest['snapshots'], [p['id'] for p in todo], a.jobs, tmp)
            for p in todo:
                if collect(tmp, out, p['id']):
                    manifest['themes'][p['id']] = {'hash': theme_hash(p), 'rendered': stamp}
                else:
                    print('missing renders for', p['id'])
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
        manifest['shared'] = shared
    for gone in set(manifest['themes']) - set(ids):
        manifest['themes'].pop(gone)
        shutil.rmtree(os.path.join(out, 'img', gone), ignore_errors=True)
    json.dump(manifest, open(mpath, 'w', encoding='utf-8'), indent=1)

    fresh = {p['id'] for p in todo} if todo and len(todo) < len(ids) else set()
    data = {
        'updated': stamp,
        'groups': info['groups'],
        'presets': [{'id': p['id'], 'group': p['group'], 'name': p['name'], 'blurb': p.get('blurb', ''),
                     'fresh': p['id'] in fresh, 'v': manifest['themes'].get(p['id'], {}).get('rendered', '').replace(' ', '_')}
                    for p in info['presets'] if p['id'] in manifest['themes']],
    }
    write_page(out, data)
    print('Gallery:', os.path.join(out, 'index.html'))


if __name__ == '__main__':
    main()
