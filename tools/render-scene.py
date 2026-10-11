"""Dev tool: screenshot theme scenes from tools/scene-preview.html.

    uv run --with playwright python tools/render-scene.py <out_dir> <theme> [<theme> ...] [--ui] [--frames N]

Writes <out_dir>/<theme>.png (and <theme>_ui.png with --ui: the scene under a
mock of DuelingBook's main menu). --frames N also writes N frames one second
apart (<theme>_f1.png ...) to judge motion. The pointer is parked off-centre
so the 3D tilt shows.
"""
import functools
import http.server
import os
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    # Never cached: an edited scene module must show on the next render.
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *args):
        pass


def serve():
    handler = functools.partial(Handler, directory=ROOT)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    out, themes = args[0], args[1:]
    ui = '--ui' in sys.argv
    frames = int(sys.argv[sys.argv.index('--frames') + 1]) if '--frames' in sys.argv else 0
    if frames:
        themes = [t for t in themes if not t.isdigit()]
    os.makedirs(out, exist_ok=True)
    server = serve()
    port = server.server_address[1]
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        for theme in themes:
            for with_ui in ([False, True] if ui else [False]):
                page.goto(f'http://127.0.0.1:{port}/tools/scene-preview.html?theme={theme}&ui={1 if with_ui else 0}')
                page.wait_for_function('window.__ready === true')
                page.mouse.move(900, 300)
                page.wait_for_timeout(2500)
                name = f'{theme}_ui' if with_ui else theme
                page.screenshot(path=os.path.join(out, f'{name}.png'))
                if frames and not with_ui:
                    for i in range(frames):
                        page.wait_for_timeout(1000)
                        page.screenshot(path=os.path.join(out, f'{theme}_f{i + 1}.png'))
        browser.close()
    server.shutdown()
    if errors:
        print('PAGE ERRORS:', *errors, sep='\n  ')
        sys.exit(1)
    print('ok', out)


if __name__ == '__main__':
    main()
