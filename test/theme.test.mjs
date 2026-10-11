import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, withDefaults } from '../src/lib/defaults.js';
import { contrast, mix } from '../src/lib/color.js';
import { AREAS, PRESETS, TOKENS } from '../src/features/theme/presets.js';
import { MAX_CODE_LENGTH, decodeTheme, encodeTheme } from '../src/features/theme/share.js';
import { AREA_CSS, fontCss, varsCss } from '../src/features/theme/css.js';
import { iconCss, recolorField } from '../src/features/theme/art.js';
import { launcherBottom } from '../src/lib/layout.js';

test('theme: off by default so updates change nothing', () => {
  assert.equal(DEFAULTS.themeEnabled, false);
  assert.equal(DEFAULTS.customCssEnabled, false);
});

test('theme: every preset defines every token as #rrggbb', () => {
  PRESETS.forEach((p) => {
    TOKENS.forEach(({ key }) => assert.match(p.tokens[key], /^#[0-9a-f]{6}$/i, `${p.id}.${key}`));
  });
});

test('theme: every preset is readable', () => {
  PRESETS.forEach(({ id, tokens: t }) => {
    assert.ok(contrast(t.text, t.surface) >= 4.5, `${id} text/surface`);
    assert.ok(contrast(t.text, t.raised) >= 4.5, `${id} text/raised`);
    assert.ok(contrast(t.muted, t.surface) >= 3, `${id} muted/surface`);
    assert.ok(contrast(t.accentText, t.accent) >= 4.5, `${id} accentText/accent`);
    assert.ok(contrast(t.link, t.surface) >= 4.5, `${id} link/surface`);
  });
});

test('theme: damaged theme settings fall back', () => {
  const s = withDefaults({
    themeTokens: { accent: 'red', text: '#123456', bogus: '#000000' },
    themeRadius: 99,
    themeBackdrop: -1,
    themeFont: 'comic-sans',
    themePreset: 'nope',
    themeAreas: { menu: false, duel: 'no' },
  });
  assert.equal(s.themeTokens.accent, PRESETS[0].tokens.accent);
  assert.equal(s.themeTokens.text, '#123456');
  assert.equal(s.themeTokens.bogus, undefined);
  assert.equal(s.themeRadius, 16);
  assert.equal(s.themeBackdrop, 0);
  assert.equal(s.themeFont, 'original');
  assert.equal(s.themePreset, PRESETS[0].id);
  assert.equal(s.themeAreas.menu, false);
  assert.equal(s.themeAreas.duel, true);
});

test('share: a code round-trips and turns the theme on', () => {
  const settings = withDefaults({ themePreset: 'crimson', themeTokens: PRESETS[2].tokens, themeRadius: 3, themeAreas: { chat: false } });
  const { patch, customCss, error } = decodeTheme(encodeTheme(settings, '#x { color: red }'));
  assert.equal(error, undefined);
  assert.equal(patch.themeEnabled, true);
  assert.equal(patch.themePreset, 'crimson');
  assert.deepEqual(patch.themeTokens, PRESETS[2].tokens);
  assert.equal(patch.themeRadius, 3);
  assert.equal(patch.themeAreas.chat, false);
  assert.equal(customCss, '#x { color: red }');
});

test('share: bad codes are rejected with a message', () => {
  assert.ok(decodeTheme('').error);
  assert.ok(decodeTheme('hello').error);
  assert.ok(decodeTheme('DBTE1:%%%').error);
  assert.ok(decodeTheme(`DBTE1:${btoa('{"v":2}')}`).error);
  assert.ok(decodeTheme(`DBTE1:${'A'.repeat(90000)}`).error);
});

test('share: a hostile code is cleaned like stored settings', () => {
  const code = `DBTE1:${btoa(JSON.stringify({ v: 1, themeTokens: { accent: 'url(javascript:alert(1))' }, themeRadius: 'x', chatMuted: ['a'] }))}`;
  const { patch } = decodeTheme(code);
  assert.equal(patch.themeTokens.accent, PRESETS[0].tokens.accent);
  assert.equal(patch.themeRadius, DEFAULTS.themeRadius);
  assert.equal(patch.chatMuted, undefined);
});

test('css: variables cover every token and areas use only variables', () => {
  const vars = varsCss({ tokens: PRESETS[0].tokens, radius: 6, backdrop: 0.25 });
  ['--dbt-bg:', '--dbt-accent-text:', '--dbt-accent2:', '--dbt-radius: 6px', '--dbt-bg-rgb: 13, 15, 19'].forEach((v) => assert.ok(vars.includes(v), v));
  Object.entries(AREA_CSS).forEach(([id, css]) => {
    // Attribute selectors such as font[color="#FF0000"] name the site's colours; values must not.
    assert.doesNotMatch(css.replace(/\[[^\]]*\]/g, ''), /#[0-9a-f]{6}\b/i, `${id} has a hard-coded colour`);
    assert.doesNotMatch(css, /(?<![-\w])(width|height|padding|font-size|line-height|left|top)\s*:/i, `${id} changes layout`);
  });
});

test('css: every area except the generated ones has a stylesheet', () => {
  const generated = ['field', 'icons'];
  AREAS.filter((a) => !generated.includes(a.id)).forEach((a) => assert.ok(AREA_CSS[a.id], a.id));
});

test('field: recolours the four zone gradients only', () => {
  const t = PRESETS[0].tokens;
  const svg = '<stop stop-color="red"/><stop stop-color="#90f"/><stop stop-color="#00b400"/><stop stop-color="#ff8f00"/><path fill="#fff"/>';
  const out = recolorField(svg, t);
  assert.ok(out.includes(`stop-color="${t.self}"`));
  assert.ok(out.includes(`stop-color="${t.opp}"`));
  assert.ok(out.includes(`stop-color="${mix(t.self, t.accent2, 0.55)}"`));
  assert.ok(out.includes('fill="#fff"'));
  assert.doesNotMatch(out, /stop-color="(red|#90f|#00b400|#ff8f00)"/);
});

test('css: lettering sheet only changes fonts', () => {
  assert.doesNotMatch(fontCss, /(?<![-\w])(width|height|padding|font-size|line-height|letter-spacing|left|top|border)\s*:/i);
});

test('css: a non-hex token never reaches the page', () => {
  const vars = varsCss({ tokens: { ...PRESETS[0].tokens, accent: 'red;}body{display:none' }, radius: 6, backdrop: 0.25 });
  assert.doesNotMatch(vars, /display:none/);
  assert.doesNotMatch(vars, /--dbt-accent:/);
});

test('icons: every icon is a data URI with no raw quotes', () => {
  const css = iconCss(PRESETS[1].tokens, 8);
  ['ok_btn', 'yes_btn', 'no_btn', 'cancel_btn', 'exit_btn', 'minimize_btn', 'expand_btn', 'close_btn', 'card_menu_btn_up', 'over.svg'].forEach((n) =>
    assert.ok(css.includes(`/svg/${n}`), n),
  );
  const urls = css.match(/url\("data:image\/svg\+xml,[^"]*"\)/g);
  assert.ok(urls.length >= 14);
  urls.forEach((u) => assert.doesNotMatch(u.slice(5, -2), /["<>\s]/));
});

test('share: oversized custom CSS gives a code longer than the paste limit', () => {
  const huge = '/* 漢字🃏 */'.repeat(6000).slice(0, 50000);
  const code = encodeTheme(withDefaults({}), huge);
  assert.ok(code.length > MAX_CODE_LENGTH, 'the panel must refuse to offer this code');
  assert.ok(decodeTheme(code).error);
});

test('launcher: stays in the corner unless it would cover a DuelingBook button', () => {
  const vp = { width: 1280, height: 800 };
  assert.equal(launcherBottom(vp, []), 14);
  const far = { left: 900, right: 925, top: 760, bottom: 785, width: 25, height: 25 };
  assert.equal(launcherBottom(vp, [far]), 14);
  const mute = { left: 1230, right: 1262, top: 752, bottom: 784, width: 32, height: 32 };
  const b = launcherBottom(vp, [mute]);
  assert.equal(b, 800 - 752 + 8);
  const hidden = { ...mute, width: 0, height: 0 };
  assert.equal(launcherBottom(vp, [hidden]), 14);
});
