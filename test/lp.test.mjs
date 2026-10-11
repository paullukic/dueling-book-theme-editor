import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, withDefaults } from '../src/lib/defaults.js';
import { LP_STYLES, LP_STYLE_IDS, lpCss } from '../src/features/lp/index.js';
import { effectsCss } from '../src/features/lp/effects.js';
import { PAGE, previewScope } from '../src/features/lp/kit.js';
import { PLACES, placeFields, placePath, placeById } from '../src/ui/places.js';
import { rank } from '../src/ui/search.js';
import { FULL_BAR_PX, lifeRatio, lpChange, lpLevel, lpState, parseLp } from '../src/features/lp/logic.js';

test('lp settings: theme look and no effects by default; bad values clean to the default', () => {
  assert.equal(DEFAULTS.lpStyle, 'theme');
  assert.equal(DEFAULTS.lpEffects, false);
  assert.equal(withDefaults({}).lpStyle, 'theme');
  assert.equal(withDefaults({ lpStyle: 'gx' }).lpStyle, 'gx');
  assert.equal(withDefaults({ lpStyle: '5ds' }).lpStyle, '5ds');
  assert.equal(withDefaults({ lpStyle: 'GX' }).lpStyle, 'theme');
  assert.equal(withDefaults({ lpStyle: '<style>' }).lpStyle, 'theme');
  assert.equal(withDefaults({ lpStyle: 3 }).lpStyle, 'theme');
  assert.equal(withDefaults({ lpEffects: 'yes' }).lpEffects, false);
  assert.equal(withDefaults({ lpEffects: true }).lpEffects, true);
});

test('lp logic: number, life left, change and level', () => {
  assert.equal(parseLp('8000'), 8000);
  assert.equal(parseLp(' 12,500 '), 12500);
  assert.equal(parseLp('0'), 0);
  assert.equal(parseLp(''), null);
  assert.equal(parseLp(null), null);
  // DuelingBook's snapshot: 5000 of 8000 left = 57.75px of black bar.
  assert.equal(lifeRatio('57.75px'), 0.625);
  assert.equal(lifeRatio('0px'), 1);
  assert.equal(lifeRatio(''), 1);
  assert.equal(lifeRatio(`${FULL_BAR_PX + 9}px`), 0);
  assert.equal(lpChange(8000, 7000), 'hit');
  assert.equal(lpChange(7000, 7500), 'heal');
  assert.equal(lpChange(7000, 7500, 0.9), 'heal');
  // A new duel resets the count: not a heal.
  assert.equal(lpChange(0, 8000, 0.4), null);
  assert.equal(lpChange(1200, 8000, 1), null);
  assert.equal(lpChange(8000, 1200, 1), 'hit');
  assert.equal(lpChange(7000, 7000), null);
  assert.equal(lpChange(null, 7000), null);
  assert.equal(lpChange(7000, null), null);
  assert.equal(lpLevel(0, 0), 'zero');
  assert.equal(lpLevel(1900, 0.2375), 'low');
  assert.equal(lpLevel(2000, 0.25), null);
  assert.equal(lpLevel(null, 0.1), null);
  assert.equal(lpState('hit', 'low'), 'hit low');
  assert.equal(lpState(null, null), '');
  assert.equal(lpState(null, null, true), 'wide');
  assert.equal(lpState('heal', null, true), 'heal wide');
});

const layout = /(?<![-\w])(width|height|padding|margin|font-size|line-height|letter-spacing|left|top|right|bottom|font)\s*:/i;
// Our own pseudo-elements, @font-face and @keyframes may size things.
const ownRules = (css) =>
  css
    .replace(/@font-face\s*\{[^}]*\}/g, '')
    .replace(/@keyframes[^{]*\{(?:[^{}]*\{[^}]*\})*\s*\}/g, '')
    .replace(/[^{}]*::(before|after)[^{}]*\{[^}]*\}/g, '');

test('lp styles: every style restyles both sides without layout changes', () => {
  assert.deepEqual(LP_STYLE_IDS.slice(0, 2), ['theme', 'plain']);
  assert.equal(new Set(LP_STYLE_IDS).size, LP_STYLE_IDS.length);
  assert.equal(lpCss('theme'), '');
  assert.equal(lpCss('nope'), '');
  LP_STYLES.filter((s) => s.make).forEach(({ id }) => {
    const css = lpCss(id);
    assert.ok(css.length > 200, id);
    assert.doesNotMatch(css, /NaN|undefined|\[object/, id);
    assert.doesNotMatch(ownRules(css), layout, `${id} changes layout`);
    assert.doesNotMatch(css, /\.cardfront|\.card\b|url\(["']?https?:/, `${id} touches cards or loads remote files`);
    // Every rule targets the LP block (or declares a font).
    css.replace(/@font-face\s*\{[^}]*\}/g, '').replace(/\{[^}]*\}/g, '\n').split('\n').map((s) => s.trim()).filter(Boolean).forEach((sel) => {
      sel.split(/,(?![^(]*\))/).forEach((one) => assert.ok(one.trim().startsWith(PAGE.root.split(' .lifepoints')[0]), `${id}: ${one}`));
    });
    // Theme crests on the same pseudo-elements cannot leak into the style.
    assert.match(css, /\*::after \{\s*margin: 0; inset: auto; transform: none; filter: none;/, id);
    // DuelingBook's nodes are never transformed, except GX squeezing five digits in place.
    const transforms = ownRules(css).match(/[^{}]*\{[^}]*(?<![-\w])transform: (?!none)[^}]*\}/g) || [];
    transforms.forEach((r) => assert.match(r, /~="wide"\] \.life_txt \{ transform: scaleX\(0\.8\) !important; transform-origin: 100% 50%; \}/, `${id}: ${r.trim()}`));
    // `.lifepoints::after` belongs to the effects overlay.
    assert.doesNotMatch(css.replace(/\*::after/g, ''), /\.lifepoints[^\s,{]*::after/, `${id} uses the effects slot`);
    const pv = lpCss(id, previewScope('lp-pv-x'));
    assert.match(pv, /\.lp-pv-x \.lifepoints/);
    assert.doesNotMatch(pv, /#duel|@font-face/, id);
  });
});

test('lp effects: damage, heal, low and zero states; only filter, opacity and transform animate; reduced motion is still', () => {
  ['hit', 'heal', 'low', 'zero'].forEach((s) => assert.match(effectsCss, new RegExp(`data-dbte-lp~="${s}"`)));
  const frames = effectsCss.match(/@keyframes[^{]*\{(?:[^{}]*\{[^}]*\})*\s*\}/g);
  assert.equal(frames.length, 4);
  frames.forEach((f) => {
    const props = [...f.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
    props.forEach((p) => assert.ok(['filter', 'opacity', 'transform'].includes(p), `${p} animates`));
  });
  assert.match(effectsCss, /@media \(prefers-reduced-motion: reduce\)/);
  assert.equal((effectsCss.match(/infinite/g) || []).length, 1);
  assert.doesNotMatch(ownRules(effectsCss), layout);
});

test('lp search: the setting is found by what players call it', () => {
  const top = (q) => rank(q, PLACES, placeFields).map((p) => p.id);
  ['life points', 'lp', 'health bar', 'gx', 'duel disk', 'vrains', 'zexal', '5ds', 'rush duel'].forEach((q) =>
    assert.ok(top(q).slice(0, 3).some((id) => ['lifePoints', 'lpStyle'].includes(id)), q),
  );
  assert.ok(top('damage').includes('lpEffects'));
  assert.equal(placePath(placeById.lpStyle), 'Duel › Life points');
});

test('theme numerals: every preset gets a crisp number and ink outline at 7:1, never black ink on a light theme', async () => {
  const { PRESETS } = await import('../src/features/theme/presets.js');
  const { LP_NUM_CONTRAST, isLightTheme, lpInk, varsCss } = await import('../src/features/theme/css.js');
  const { contrast } = await import('../src/lib/color.js');
  PRESETS.forEach((p) => {
    const { num, ink } = lpInk(p.tokens);
    assert.ok(contrast(num, ink) >= LP_NUM_CONTRAST, `${p.id} ${num} on ${ink}`);
    if (isLightTheme(p.tokens)) assert.notEqual(ink.toLowerCase(), '#000000', p.id);
    assert.match(varsCss({ tokens: p.tokens, radius: 4, backdrop: 0.25 }), new RegExp(`--dbt-lp-num: ${num};[^]*--dbt-lp-ink: ${ink};`), p.id);
  });
});

test('duel accent: the active phase and TURN pill take the deepened accent, white lettering at 4.5:1 on every preset', async () => {
  const { PRESETS } = await import('../src/features/theme/presets.js');
  const { accentDeep } = await import('../src/features/theme/css.js');
  const { contrast } = await import('../src/lib/color.js');
  PRESETS.forEach((p) => assert.ok(contrast('#ffffff', accentDeep(p.tokens)) >= 4.5, p.id));
});
