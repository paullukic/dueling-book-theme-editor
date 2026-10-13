import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, withDefaults } from '../src/lib/defaults.js';
import { contrast, flattenLayers, mix, parseCssColor, readableOn } from '../src/lib/color.js';
import { DEFAULT_PSCT_COLORS } from '../src/lib/defaults.js';
import { AREAS, PRESETS, TOKENS } from '../src/features/theme/presets.js';
import { MAX_CODE_LENGTH, decodeTheme, encodeTheme } from '../src/features/theme/share.js';
import { AREA_CSS, fieldEdgeMix, fontCss, isLightTheme, panelVars, readingTextCss, roleColors, varsCss } from '../src/features/theme/css.js';
import { ICON_STYLES, iconCss, recolorField } from '../src/features/theme/art.js';
import { keepAreas, skinBackdrop, skinCss } from '../src/features/theme/skins.js';
import { CHROME_IDS, chromeCss } from '../src/features/theme/chrome.js';
import { MENU_ART } from '../src/features/theme/menuArt.js';
import { PARTICLES, SCENE_IDS, SHADERS, sceneMarkup } from '../src/features/theme/scenes.js';
import { QUALITY, fragmentSource, uniformName } from '../src/features/theme/shader.js';
import { PARTICLE_KINDS, createSystems, stepSystems } from '../src/features/theme/particles.js';
import { launcherBottom } from '../src/lib/layout.js';
import { sameShape } from '../src/lib/shape.js';
import { elementLayers, inkCss, inkFor, paintedColor, worstBackground } from '../src/features/theme/inkGuard.js';

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
    // Our own pseudo-elements (e.g. the click strip under a lifted tile) may be positioned.
    const own = css.replace(/[^{}]*::(before|after)[^{}]*\{[^}]*\}/g, '');
    assert.doesNotMatch(own, /(?<![-\w])(width|height|padding|font-size|line-height|left|top)\s*:/i, `${id} changes layout`);
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
  assert.ok(out.includes(`stop-color="${mix(t.self, t.text, 0.35)}"`));
  assert.ok(out.includes(`stop-color="${mix(t.opp, t.text, 0.35)}"`));
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
      .replace(/#dbte-skin-(layer|motif|fx)[^{]*\{[^}]*\}/g, '')
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
  assert.ok(off.includes('#dbte-skin-layer, #dbte-skin-motif, #dbte-skin-fx {'), 'backdrop stays');
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
  assert.deepEqual(light.map((p) => p.id).sort(), ['duel-disk', 'duel-monsters-gb', 'lightsworn', 'parchment', 'snow', 'starlight-light']);
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

test('ink guard: reads what is painted under the text, layer by layer', () => {
  const plate = { backgroundColor: 'rgba(0, 0, 0, 0)', backgroundImage: 'linear-gradient(180deg, rgb(217, 236, 252), rgb(197, 230, 253))', tag: 'DIV' };
  const page = { backgroundColor: 'rgb(10, 18, 32)', backgroundImage: 'none', tag: 'BODY' };
  const clear = { backgroundColor: 'rgba(0, 0, 0, 0)', backgroundImage: 'none', tag: 'SPAN' };
  // A label beside a pale tile (a sibling layer) reads against the tile, not the dark page.
  assert.equal(paintedColor([clear, plate, page]), '#d9ecfc');
  assert.equal(paintedColor([clear, page]), '#0a1220');
  // See-through layers blend down to the first opaque one.
  assert.equal(paintedColor([{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backgroundImage: 'none' }, page]), '#858990');
  // Opacity thins the element's paint: a 35% black veil over white is grey.
  assert.equal(paintedColor([{ backgroundColor: 'rgb(0, 0, 0)', backgroundImage: 'none', opacity: '0.35' }], '#ffffff'), '#a6a6a6');
  // Decorative url() layers are skipped when a colour is painted too; image-only or <img> is unreadable.
  assert.deepEqual(elementLayers({ backgroundColor: 'rgba(0, 0, 0, 0)', backgroundImage: 'url("data:x"), linear-gradient(rgb(1, 2, 3), red)' }), [[1, 2, 3, 1]]);
  assert.equal(elementLayers({ backgroundColor: 'rgba(0, 0, 0, 0)', backgroundImage: 'url("a.png")' }), 'unknown');
  assert.equal(paintedColor([clear, { tag: 'IMG', backgroundColor: 'rgba(0, 0, 0, 0)', backgroundImage: 'none' }, page]), null);
  // Gradients with commas inside their colours split at the top level only.
  assert.deepEqual(elementLayers({ backgroundColor: 'rgb(9, 9, 9)', backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.5) 30%, rgb(0, 0, 0))' }), [[255, 255, 255, 0.5], [9, 9, 9, 1]]);
  // Of several sample points the worst-reading one wins; unreadable samples are ignored.
  assert.equal(worstBackground('#0a1220', ['#d9ecfc', '#0a1220', null]), '#0a1220');
  assert.equal(worstBackground('#0a1220', [null]), null);
  // Decoration is not a fill: the base under it decides.
  const darkFill = 'linear-gradient(180deg, rgb(30, 20, 40), rgb(10, 8, 16))';
  const underline = { backgroundColor: 'rgba(0, 0, 0, 0)', backgroundImage: `linear-gradient(0deg, rgb(200, 120, 255) 0px, rgb(200, 120, 255) 1px, rgba(0, 0, 0, 0) 1px), ${darkFill}`, backgroundSize: '50% 100%, auto', backgroundRepeat: 'no-repeat, repeat', width: 200, height: 30 };
  assert.equal(paintedColor([underline]), '#1e1428', '1px underline over a dark fill reads dark');
  const brackets = { backgroundColor: 'rgb(12, 14, 30)', backgroundImage: 'linear-gradient(rgb(240, 200, 90), rgb(240, 200, 90)), linear-gradient(rgb(240, 200, 90), rgb(240, 200, 90))', backgroundSize: '5px 1px, 1px 5px', backgroundRepeat: 'no-repeat, no-repeat', width: 120, height: 24 };
  assert.equal(paintedColor([brackets]), '#0c0e1e', 'corner brackets over a dark fill read dark');
  const rivets = { backgroundColor: 'rgb(20, 20, 20)', backgroundImage: 'radial-gradient(circle, rgb(220, 220, 220) 2px, rgba(0, 0, 0, 0) 3px)', backgroundSize: '14px 14px', backgroundRepeat: 'repeat', width: 252, height: 60 };
  assert.equal(paintedColor([rivets]), '#141414', 'rivet dots over a dark fill read dark');
  const sheen = { backgroundColor: 'rgb(16, 24, 48)', backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent 50%)', backgroundSize: 'auto', backgroundRepeat: 'repeat', width: 100, height: 30 };
  assert.equal(paintedColor([sheen]), '#101830', 'a highlight fading to transparent is decoration');
  assert.equal(elementLayers({ backgroundColor: 'rgba(0, 0, 0, 0)', backgroundImage: 'url("a.png"), linear-gradient(rgb(1, 1, 1) 1px, transparent 1px)' }), 'unknown', 'image with only decoration stays unreadable');
  // Navy text on the pale plate stays; on the dark page it turns light.
  assert.equal(inkFor('#0a1220', paintedColor([clear, plate, page]), '#eef6ff'), null);
  assert.equal(inkFor('#0a1220', paintedColor([clear, page]), '#eef6ff'), 'theme');
});

test('skins: the pattern switch removes only the artwork, glows stay', () => {
  ['branded', 'artmage', 'hero', 'labrynth'].forEach((id) => {
    const t = PRESETS.find((p) => p.id === id).tokens;
    const on = skinCss(id, t);
    const off = skinCss(id, t, {}, { motif: false });
    assert.ok(on.includes('#dbte-skin-motif, #dbte-skin-motif::before { background:'), `${id} has artwork`);
    assert.ok(!off.includes('#dbte-skin-motif, #dbte-skin-motif::before { background:'), `${id} artwork gone`);
    assert.ok(off.includes('#dbte-skin-layer, #dbte-skin-layer::before { background:'), `${id} glow stays`);
    assert.doesNotMatch(on.split('#dbte-skin-layer, #dbte-skin-layer::before')[1].split('}')[0], /url\(/, `${id} glow layer has no artwork`);
  });
  assert.equal(DEFAULTS.themeMotif, true);
});

test('skins: archetype art renders the same every time and stays compact', () => {
  SCENE_IDS.forEach((id) => {
    const t = PRESETS.find((p) => p.id === id).tokens;
    const a = sceneMarkup(id, t);
    assert.equal(a, sceneMarkup(id, t), id);
    assert.doesNotMatch(a, /NaN|undefined/, id);
    assert.ok(a.length > 1500 && a.length < 40000, `${id} is ${a.length} bytes`);
  });
});

test('scenes: every archetype has one, it can hold still, and bad colours draw nothing', () => {
  PRESETS.filter((p) => p.group !== 'clean').forEach((p) => assert.ok(SCENE_IDS.includes(p.id), p.id));
  const t = PRESETS.find((p) => p.id === 'blackwing').tokens;
  const moving = sceneMarkup('blackwing', t);
  assert.match(moving, /animation: dbtefx-fall/);
  assert.match(moving, /prefers-reduced-motion: reduce\) \{ #dbte-skin-fx \* \{ animation: none/, 'reduced motion is scoped to our layer, never the page');
  assert.doesNotMatch(moving, /\n\* \{|\{ \* \{/, 'no page-wide selectors');
  assert.match(sceneMarkup('blackwing', t, { still: true }), /class="dbtefx-stage dbtefx-still"/);
  assert.equal(sceneMarkup('blackwing', { ...t, accent: '"/><script>' }), '');
  assert.equal(sceneMarkup('oled', PRESETS.find((p) => p.id === 'oled').tokens), '');
  assert.doesNotMatch(moving, /<script|on\w+=/i);
  assert.equal(DEFAULTS.themeMotion, true);
});

test('scenes: card artwork loads only from DuelingBook, never as a broken-icon <image>', () => {
  SCENE_IDS.forEach((id) => {
    const m = sceneMarkup(id, PRESETS.find((p) => p.id === id).tokens);
    (m.match(/(?:https?:)?\/\/[^\s"')]+/g) || []).filter((u) => !u.includes('www.w3.org/')).forEach((u) => {
      assert.match(u, /^https:\/\/images\.duelingbook\.com\/card-pics\/\d+\.jpg$/, `${id}: ${u}`);
    });
    assert.doesNotMatch(m, /<image[\s>]/, `${id}: a failed <image> paints a broken-image icon`);
  });
  ['divine', 'branded'].forEach((id) => assert.match(sceneMarkup(id, PRESETS.find((p) => p.id === id).tokens), /card-pics\/\d+\.jpg/, `${id} shows card art`));
});

test('scenes: only transform and opacity move (cheap to animate)', () => {
  const css = sceneMarkup('frog', PRESETS.find((p) => p.id === 'frog').tokens).match(/@keyframes[^}]*\{([^@]*?)\}\s*\}/g).join('');
  assert.doesNotMatch(css.replace(/@keyframes [\w-]+/g, ''), /(?<![-\w])(width|height|left|top|r|cx|cy|fill|stroke|filter)\s*:/);
});

test('scenes: Sakura petals fall', () => {
  assert.ok(PARTICLES.sakura.some((sys) => sys.kind === 'petal'));
});

test('3D: scenes split into far, middle and near planes around the particle canvas', () => {
  const t = PRESETS.find((p) => p.id === 'blackwing').tokens;
  const m = sceneMarkup('blackwing', t, { particles: true });
  const order = ['dbtefx-far', 'dbtefx-mid', 'dbtefx-canvas', 'dbtefx-near'].map((c) => m.indexOf(c));
  order.forEach((i) => assert.ok(i > 0));
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'far, mid, canvas, near in paint order');
  const branded = sceneMarkup('branded', PRESETS.find((p) => p.id === 'branded').tokens);
  assert.doesNotMatch(branded, /cathedral|towers/i);
  assert.match(branded, /dbtefx-bd-ice/, 'Mirrorjade ice blades');
});

test('particles: every config is valid and the simulation keeps particles alive and on screen', () => {
  Object.entries(PARTICLES).forEach(([id, systems]) => {
    const preset = PRESETS.find((p) => p.id === id);
    assert.ok(preset, `${id} is a preset`);
    systems.forEach((sys) => {
      assert.ok(PARTICLE_KINDS.includes(sys.kind), `${id} ${sys.kind}`);
      sys.colors.forEach((c) => assert.ok(/^#[0-9a-f]{6}$/i.test(preset.tokens[c]), `${id} colour ${c}`));
    });
    const live = createSystems(PARTICLES[id], 1280, 800);
    const before = live.reduce((n, s) => n + s.particles.length, 0);
    for (let i = 0; i < 600; i++) stepSystems(live, 1 / 30, i / 30, 1280, 800);
    live.forEach((s) => s.particles.forEach((p) => {
      assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), `${id} finite`);
      assert.ok(p.x > -200 && p.x < 1480 && p.y > -200 && p.y < 1000, `${id} on screen`);
    }));
    assert.equal(live.reduce((n, s) => n + s.particles.length, 0), before, `${id} count steady`);
  });
  assert.equal(PARTICLES.oled, undefined, 'OLED stays bare');
});

test('3D: UI depth never moves a pressed control out from under the pointer', () => {
  assert.match(AREA_CSS.menu, /menu_btn:hover \.content \{[^}]*transform: translateY\(-3px\)/);
  assert.match(AREA_CSS.menu, /menu_btn:hover \.content::after \{[^}]*bottom: -4px/, 'lifted tile keeps its old edge clickable');
  assert.match(AREA_CSS.menu, /menu_btn:active \.content \{[^}]*transform: none/);
  assert.doesNotMatch(AREA_CSS.widgets, /transform:/, 'buttons never move');
});

test('local values: a stored value only counts when it has the default shape', () => {
  assert.equal(sameShape('a', ''), true);
  assert.equal(sameShape(12345, ''), false);
  assert.equal(sameShape([], {}), false);
  assert.equal(sameShape({}, []), false);
  assert.equal(sameShape(null, {}), false);
  assert.equal(sameShape({ a: 1 }, {}), true);
});

test('particles: events (shooting stars, flashes, bursts) fire and finish', () => {
  ['midnight', 'white-dragon', 'branded'].forEach((id) => {
    const live = createSystems(PARTICLES[id], 1280, 800);
    let fired = 0;
    for (let i = 0; i < 900; i++) {
      stepSystems(live, 1 / 30, i / 30, 1280, 800);
      live.forEach((sys) => { if (sys.active && sys.active.age === 0) fired++; });
    }
    assert.ok(fired >= 1, `${id} fired ${fired}`);
    live.forEach((sys) => { if (sys.active) assert.ok(sys.active.age <= sys.active.life + 0.05, id); });
  });
});

test('background: solid colour mode is validated like every colour', () => {
  assert.equal(DEFAULTS.backgroundMode, 'image');
  assert.equal(withDefaults({ backgroundMode: 'color', backgroundColor: '#123abc' }).backgroundColor, '#123abc');
  assert.equal(withDefaults({ backgroundColor: 'red;}body{display:none' }).backgroundColor, DEFAULTS.backgroundColor);
  assert.equal(withDefaults({ backgroundMode: 'video' }).backgroundMode, 'image');
});

test('shaders: registered shaders are well-formed and sit behind the scene', () => {
  assert.ok(Object.keys(SHADERS).length >= 1);
  Object.entries(SHADERS).forEach(([id, def]) => {
    assert.match(def.frag, /void main\(\)/, id);
    const src = fragmentSource(def);
    (def.uniforms || []).forEach((tk) => assert.ok(src.includes(`uniform vec3 ${uniformName(tk)};`), `${id} ${tk}`));
    assert.match(src, /^precision mediump float;/, id);
    const preset = PRESETS.find((p) => p.id === id);
    const m = sceneMarkup(id, preset.tokens, { particles: true, shader: true });
    assert.ok(m.indexOf('dbtefx-gl') < m.indexOf('dbtefx-far') || !m.includes('dbtefx-far'), `${id} gl canvas is the farthest plane`);
  });
  assert.equal(uniformName('accentText'), 'u_accent_text');
  assert.equal(DEFAULTS.themeQuality, 'low');
  assert.equal(withDefaults({ themeQuality: 'ultra' }).themeQuality, 'low');
  assert.equal(QUALITY.off, null);
});

test('chrome: theme UI chrome never changes layout or card faces, and follows the area switches', () => {
  CHROME_IDS.forEach((id) => {
    const t = PRESETS.find((p) => p.id === id).tokens;
    const css = chromeCss(id, t);
    assert.ok(css.length > 50, `${id} has chrome`);
    assert.doesNotMatch(css, /NaN|undefined/, id);
    // Our own pseudo-elements may be positioned; DuelingBook elements may not.
    const own = css.replace(/[^{}]*::(before|after)[^{}]*\{[^}]*\}/g, '');
    assert.doesNotMatch(own, /(?<![-\w])(width|height|padding|margin|font-size|line-height|left|top|right|bottom)\s*:/i, `${id} changes layout`);
    assert.doesNotMatch(css, /\.cardfront|\.card\b/, `${id} touches card faces`);
    const off = chromeCss(id, t, { menu: false, dialogs: false, duel: false, chat: false, lobby: false, deck: false });
    assert.doesNotMatch(off, /#main_menu|#content #msg|#duel |#chats|#duel_room|#deck_constructor/, `${id} ignores area switches`);
  });
  assert.equal(chromeCss('obsidian', PRESETS[0].tokens), '');
});

test('areas: switched-off rules inside @media blocks drop cleanly, the rest survives', () => {
  const css = 'html body #chats .a { color: red; }\n@media (prefers-reduced-motion: reduce) { html body #chats .b { animation: none; } html body .c { opacity: 1; } }\n@keyframes k { to { opacity: 0; } }\nhtml body #duel_room .d { color: blue; }';
  const out = keepAreas(css, { chat: false });
  assert.doesNotMatch(out, /#chats/);
  assert.match(out, /@media \(prefers-reduced-motion: reduce\) \{ html body \.c \{ opacity: 1; \}\s*\}/);
  assert.match(out, /@keyframes k \{ to \{ opacity: 0; \} \}/);
  assert.match(out, /#duel_room \.d \{ color: blue; \}/);
  assert.equal((out.match(/\{/g) || []).length, (out.match(/\}/g) || []).length);
});

test('chrome: every archetype and duel theme has its own UI chrome', () => {
  PRESETS.filter((p) => p.group !== 'clean').forEach((p) => assert.ok(CHROME_IDS.includes(p.id), p.id));
});

test('user lists: following, admin and adjudicator names get distinct, readable colours on every preset', () => {
  // The Game Boy LCD has one readable ink; its four shades cannot carry four roles.
  PRESETS.filter((p) => p.id !== 'duel-monsters-gb').forEach((p) => {
    const roles = Object.values(roleColors(p.tokens));
    assert.equal(new Set(roles).size, roles.length, `${p.id} reuses a role colour`);
    roles.forEach((c) => assert.ok(contrast(c, p.tokens.surface) >= 4.5, `${p.id} role ${c} unreadable`));
  });
});

test('chrome: compact output - no comments, and every inline SVG decodes to a well-formed SVG', () => {
  CHROME_IDS.forEach((id) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    const css = chromeCss(id, preset.tokens);
    assert.ok(!css.includes('/*'), `${id} ships a comment`);
    const uris = css.match(/url\("data:image\/svg\+xml,[^"]*"\)/g) || [];
    uris.forEach((u) => {
      const body = u.slice('url("data:image/svg+xml,'.length, -2);
      assert.doesNotMatch(body, /[#{}<>]/, `${id} has an unescaped character in an SVG`);
      const svg = decodeURIComponent(body);
      assert.ok(svg.trimStart().startsWith('<svg'), `${id} SVG does not start with <svg`);
      assert.ok(svg.includes('</svg>'), `${id} SVG is not closed`);
    });
  });
});

test('menu art: every hero and hidden piece exists in its scene, and the menu CSS places the hero', () => {
  Object.entries(MENU_ART).forEach(([id, art]) => {
    const preset = PRESETS.find((p) => p.id === id);
    assert.ok(preset, id);
    const scene = sceneMarkup(id, preset.tokens);
    [art.hero, ...(art.hide || [])].forEach((sel) => {
      (sel.match(/\.dbtefx-[a-z0-9-]+/g) || []).forEach((cls) => assert.match(scene, new RegExp(`class="(?:[^"]* )?${cls.slice(1)}[ "]`), `${id}: ${cls}`));
    });
    assert.equal(art.at.length, 3, id);
    assert.ok(art.at.every(Number.isFinite) && art.at[2] > 0, id);
    assert.ok(chromeCss(id, preset.tokens).includes(`transform: translate(${art.at[0]}px, ${art.at[1]}px) scale(${art.at[2]})`), id);
  });
});
