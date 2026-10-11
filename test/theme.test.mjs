import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, withDefaults } from '../src/lib/defaults.js';
import { contrast, flattenLayers, mix, parseCssColor, readableOn } from '../src/lib/color.js';
import { DEFAULT_PSCT_COLORS } from '../src/lib/defaults.js';
import { AREAS, PRESETS, TOKENS } from '../src/features/theme/presets.js';
import { MAX_CODE_LENGTH, decodeTheme, encodeTheme } from '../src/features/theme/share.js';
import { AREA_CSS, fieldEdgeMix, fontCss, isLightTheme, panelVars, readingTextCss, varsCss } from '../src/features/theme/css.js';
import { ICON_STYLES, iconCss, recolorField } from '../src/features/theme/art.js';
import { skinBackdrop, skinCss } from '../src/features/theme/skins.js';
import { launcherBottom } from '../src/lib/layout.js';
import { inkCss, inkFor } from '../src/features/theme/inkGuard.js';

test('theme: off by default so updates change nothing', () => {
  assert.equal(DEFAULTS.themeEnabled, false);
  assert.equal(DEFAULTS.customCssEnabled, false);
});

test('theme: every preset defines every token as #rrggbb', () => {
  PRESETS.forEach((p) => {
    TOKENS.forEach(({ key }) => assert.match(p.tokens[key], /^#[0-9a-f]{6}$/i, `${p.id}.${key}`));
  });
});

test('theme: active phase labels are readable on both side colours', () => {
  PRESETS.forEach(({ id, tokens: t, radius }) => {
    const vars = varsCss({ tokens: t, radius, backdrop: 0.25 });
    const self = /--dbt-self-text: (#[0-9a-f]{6})/.exec(vars)[1];
    const opp = /--dbt-opp-text: (#[0-9a-f]{6})/.exec(vars)[1];
    assert.ok(contrast(self, t.self) >= 3, `${id} self label`);
    assert.ok(contrast(opp, t.opp) >= 3, `${id} opp label`);
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
    // Shadows may use plain black or white for depth; every other colour comes from a token.
    const values = css.replace(/\[[^\]]*\]/g, '').replace(/(text|box)-shadow\s*:[^;]*;/g, '');
    assert.doesNotMatch(values, /#[0-9a-f]{3,8}\b|rgba?\(\s*\d/i, `${id} has a hard-coded colour`);
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
  assert.ok(out.includes(`stop-color="${mix(t.opp, t.accent2, 0.55)}"`));
  assert.ok(out.includes('fill="#fff"'));
  assert.doesNotMatch(out, /stop-color="(red|#90f|#00b400|#ff8f00)"/);
});

test('css: lettering sheets only change fonts', () => {
  ['system'].forEach((id) => {
    const css = fontCss(id);
    assert.ok(css && css.includes('font-family'), id);
    assert.doesNotMatch(css, /(?<![-\w])(width|height|padding|font-size|line-height|letter-spacing|left|top|border)\s*:/i, id);
  });
  assert.equal(fontCss('original'), null);
  assert.equal(fontCss('card'), null);
});

test('css: reading text size touches only wrapping text boxes', () => {
  const css = readingTextCss(1.25);
  assert.ok(css.includes('font-size: 15px'));
  assert.doesNotMatch(css, /\.button|\.menu_btn|\.cell\b|\.body_txt|(?<![-\w])(width|height)\s*:/);
});

test('css: a non-hex token never reaches the page', () => {
  const vars = varsCss({ tokens: { ...PRESETS[0].tokens, accent: 'red;}body{display:none' }, radius: 6, backdrop: 0.25 });
  assert.doesNotMatch(vars, /display:none/);
  assert.doesNotMatch(vars, /--dbt-accent:/);
});

const ICON_NAMES = ['ok_btn', 'yes_btn', 'no_btn', 'cancel_btn', 'exit_btn', 'minimize_btn', 'expand_btn', 'close_btn', 'card_menu_btn_up', 'over.svg',
  'online_btn', 'chat_btn', 'private_btn', 'private_btn_anim', 'tools_btn', 'sort_btn', 'info_btn', 'locked_btn', 'unlocked_btn', 'points.svg',
  'limited.svg', 'semi_limited.svg', 'forbidden.svg'];

test('icons: every icon in every frame style is a data URI with no raw quotes', () => {
  ['tile', ...new Set(Object.values(ICON_STYLES))].forEach((style) => {
    const css = iconCss(PRESETS[1].tokens, 8, style);
    ICON_NAMES.forEach((n) => assert.ok(css.includes(`/svg/${n}`), `${style} ${n}`));
    const urls = css.match(/url\("data:image\/svg\+xml,[^"]*"\)/g);
    assert.ok(urls.length >= ICON_NAMES.length + 3, style);
    urls.forEach((u) => assert.doesNotMatch(u.slice(5, -2), /["<>\s]|NaN|undefined/, style));
  });
});

test('icons: frames follow the theme, so themed presets look different from the plain tile', () => {
  const t = PRESETS[1].tokens;
  const tile = iconCss(t, 8, 'tile');
  new Set(Object.values(ICON_STYLES)).forEach((style) => assert.notEqual(iconCss(t, 8, style), tile, style));
  Object.keys(ICON_STYLES).forEach((id) => assert.ok(PRESETS.some((p) => p.id === id), `${id} is a preset`));
});

test('card text: colours made for dark boxes stay readable on a light one', () => {
  Object.values(DEFAULT_PSCT_COLORS).forEach((c) => {
    assert.ok(contrast(readableOn(c, '#ffffff'), '#ffffff') >= 4.5, c);
    assert.ok(contrast(readableOn(c, '#f2ead8'), '#f2ead8') >= 4.5, c);
    assert.equal(readableOn(c, '#101418'), c, 'already readable on dark stays as chosen');
  });
  assert.ok(contrast(readableOn('#222222', '#0a0a0a'), '#0a0a0a') >= 4.5, 'dark ink on a dark box lightens');
});

test('card text: reads the computed background behind the text', () => {
  assert.deepEqual(parseCssColor('rgb(1, 2, 3)'), [1, 2, 3, 1]);
  assert.deepEqual(parseCssColor('rgba(10, 20, 30, 0.5)'), [10, 20, 30, 0.5]);
  assert.deepEqual(parseCssColor('color(srgb 1 0 0 / 0.25)'), [255, 0, 0, 0.25]);
  assert.equal(parseCssColor('transparent'), null);
  assert.equal(flattenLayers([], '#ffffff'), '#ffffff');
  assert.equal(flattenLayers([[0, 0, 0, 0.5]], '#ffffff'), '#808080');
  assert.equal(flattenLayers([[0, 0, 0, 0.5], [255, 255, 255, 1]]), '#808080');
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

test('skins: every preset has a signature skin (OLED stays bare on purpose)', () => {
  PRESETS.forEach(({ id, tokens }) => {
    const css = skinCss(id, tokens);
    if (id === 'oled') assert.equal(css, '');
    else assert.ok(css.includes('#dbte-skin-layer') && css.length > 200, id);
  });
});

test('skins: no layout changes on DuelingBook elements', () => {
  PRESETS.forEach(({ id, tokens }) => {
    // Our own layer and pseudo-element ornaments may be positioned; nothing else.
    const css = skinCss(id, tokens)
      .replace(/#dbte-skin-layer\s*\{[^}]*\}/g, '')
      .replace(/[^{}]*::(before|after)[^{}]*\{[^}]*\}/g, '');
    assert.doesNotMatch(css, /(?<![-\w])(width|height|padding|margin|font-size|line-height|left|top|right|bottom|border-width)\s*:/i, id);
    assert.doesNotMatch(css, /\.card\b|cardfront/, id);
  });
});

test('skins: malformed colours never reach the page', () => {
  assert.equal(skinCss('branded', { ...PRESETS[0].tokens, accent: '"/><script>' }), '');
  assert.equal(skinCss('nope', PRESETS[0].tokens), '');
});

test('card text font: off by default, unknown values fall back', () => {
  assert.equal(DEFAULTS.cardTextFont, 'original');
  assert.equal(withDefaults({ cardTextFont: 'card' }).cardTextFont, 'card');
  assert.equal(withDefaults({ cardTextFont: 'comic' }).cardTextFont, 'original');
});

test('skins: a switched-off area gets none of the skin', () => {
  const t = PRESETS.find((p) => p.id === 'branded').tokens;
  const all = skinCss('branded', t);
  ['#main_menu', '#content #msg', 'img.field_zones'].forEach((s) => assert.ok(all.includes(s), s));
  const off = skinCss('branded', t, { menu: false, dialogs: false, field: false });
  ['#main_menu', '#content #msg', 'img.field_zones'].forEach((s) => assert.ok(!off.includes(s), `${s} still styled`));
  assert.ok(off.includes('#dbte-skin-layer {'), 'backdrop stays');
  assert.equal((off.match(/\{/g) || []).length, (off.match(/\}/g) || []).length, 'braces balanced');
});

test('background: the theme overlay over the user’s picture is a choice, on by default', () => {
  assert.equal(DEFAULTS.backgroundThemeOverlay, true);
  assert.equal(withDefaults({ backgroundThemeOverlay: false }).backgroundThemeOverlay, false);
  PRESETS.forEach(({ id, tokens }) => assert.doesNotMatch(skinCss(id, tokens), /background-img/, id));
});

test('css: text field edges reach 3:1 in every preset', () => {
  assert.ok(AREA_CSS.widgets.includes('border-color: var(--dbt-field-edge)'));
  PRESETS.forEach(({ id, tokens: t }) => {
    const edge = mix(t.raised, t.text, fieldEdgeMix(t));
    assert.ok(Math.min(contrast(edge, t.raised), contrast(edge, t.surface)) >= 3, id);
  });
});

test('light themes: there are some, and they switch the page and panel to light controls', () => {
  const light = PRESETS.filter((p) => isLightTheme(p.tokens));
  assert.deepEqual(light.map((p) => p.id).sort(), ['duel-disk', 'parchment', 'snow']);
  light.forEach(({ tokens, radius }) => {
    assert.ok(varsCss({ tokens, radius, backdrop: 0.25 }).includes('--dbt-scheme: light'));
    assert.equal(panelVars(tokens).colorScheme, 'light');
  });
  assert.ok(varsCss({ tokens: PRESETS[0].tokens, radius: 6, backdrop: 0.25 }).includes('--dbt-scheme: dark'));
  assert.doesNotMatch(Object.values(AREA_CSS).join(''), /color-scheme:\s*dark/);
});

test('panel: follows the theme colours, refuses malformed ones', () => {
  const t = PRESETS[0].tokens;
  const v = panelVars(t);
  assert.equal(v['--gold'], t.accent);
  assert.equal(v['--on-gold'], t.accentText);
  assert.equal(v['--ink'], t.text);
  assert.equal(panelVars({ ...t, accent: 'red;}' }), null);
});

test('skins: chips and spiral art follow the theme', () => {
  PRESETS.filter((p) => p.id !== 'oled').forEach(({ id, tokens }) => {
    assert.ok(skinBackdrop(id, tokens).length > 20, `${id} backdrop for chip`);
    assert.match(skinCss(id, tokens), /#spiral \{ filter: grayscale\(1\) sepia\(1\) saturate\(2\.6\) hue-rotate\(-?\d+deg\)/, id);
  });
});

test('ink guard: re-inks only unreadable text, preferring the theme colour', () => {
  assert.equal(inkFor('#ffffff', '#101418', '#eeeeee'), null, 'readable stays');
  assert.equal(inkFor('#ffffff', '#f6efdc', '#2b2115'), 'theme', 'white on parchment takes the theme text');
  assert.equal(inkFor('#ffffff', '#f6efdc', '#f0f0f0'), 'dark', 'theme text unreadable there too');
  assert.equal(inkFor('#000000', '#0d0f13', '#000000'), 'light');
  assert.equal(inkFor('rgb(1,2,3)', '#ffffff', '#000000'), null, 'only hex input');
  assert.ok(inkCss.includes('html body #content [data-dbte-ink="theme"][data-dbte-ink][data-dbte-ink]'));
  assert.ok(inkCss.includes('{ color: var(--dbt-text) !important; }'));
});
