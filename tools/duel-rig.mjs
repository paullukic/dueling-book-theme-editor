// Dev tool: the in-page half of tools/render-duel.py. Bundled by esbuild into
// an IIFE that sets window.dbteRig; it mounts what the extension mounts on a
// DuelingBook page snapshot, built from the extension's own modules:
//   layers(theme)          the skin layers and the theme's scene (a still
//                          frame, no particles, no shader), as ThemeEffect does
//   lpStyle(id, effects)   a life point style and the life point effects
//   chat(alpha)            the duel chat / card text transparency
//   setLp(side, lp, state) a side's life (number, lost-life bar, --dbte-lp)
//                          and its effects state, as lp/watch.js writes them
//   freezeLp()             holds each LP glow animation at its peak
//   preview()              shows the hovered-card preview and its card text
//                          box, as DuelingBook does on hover (the watch
//                          snapshot has them hidden)
//   ink(theme)             one full pass of the runtime ink guard
//   regions()              key rectangles of the duel screen, in CSS px
import { PRESETS } from '../src/features/theme/presets.js';
import { LAYER_ID, MOTIF_ID } from '../src/features/theme/skins.js';
import { FX_ID, sceneMarkup } from '../src/features/theme/scenes.js';
import { inkPass } from '../src/features/theme/inkGuard.js';
import { lpCss } from '../src/features/lp/index.js';
import { effectsCss } from '../src/features/lp/effects.js';
import { LP_RADIUS_VAR, LP_VAR, STATE_ATTR, STYLE_ATTR } from '../src/features/lp/kit.js';
import { FULL_BAR_PX, WIDE_LP, lifeRatio, lpLevel, lpState } from '../src/features/lp/logic.js';
import { duelChatCss } from '../src/features/look.jsx';

const START_LP = 8000;
const SCENE_CARD_ART = /https:[^ "')]+card-pics[^ "')]+/g;

const tokensOf = (id) => {
  const preset = PRESETS.find((p) => p.id === id);
  if (!preset) throw new Error(`unknown theme: ${id}`);
  return preset.tokens;
};

const style = (id, css) => {
  let el = document.getElementById(id);
  if (!css) return el && el.remove();
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = css;
};

// Same order as ThemeEffect: glow first, artwork over it, the scene on top,
// all before DuelingBook's own nodes (so behind its stage).
const layers = async (theme) => {
  [FX_ID, MOTIF_ID, LAYER_ID].forEach((id) => {
    if (document.getElementById(id)) return;
    const el = document.createElement('div');
    el.id = id;
    el.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(el, document.body.firstChild);
  });
  const fx = document.getElementById(FX_ID);
  fx.innerHTML = sceneMarkup(theme, tokensOf(theme), { still: true, particles: false, shader: false });
  const now = new Date();
  fx.style.setProperty('--dbte-now', String(now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()));
  // Card art in the scene loads live; wait until each picture loads or fails.
  const pics = [...new Set(fx.innerHTML.match(SCENE_CARD_ART) || [])];
  const results = await Promise.all(
    pics.map(
      (src) =>
        new Promise((done) => {
          const img = new Image();
          img.onload = () => done(true);
          img.onerror = () => done(false);
          img.src = src;
          setTimeout(() => done(false), 15000);
        }),
    ),
  );
  return { scene: !!fx.innerHTML, pics: pics.length, failed: results.filter((ok) => !ok).length };
};

const lpStyle = (id, effects = true) => {
  style('dbte-lp-style', lpCss(id) || null);
  style('dbte-lp-effects', effects ? effectsCss : null);
  // As LifePointsEffect: the theme's own LP rules stand aside under a style.
  if (id && id !== 'theme') document.documentElement.setAttribute(STYLE_ATTR, '');
  else document.documentElement.removeAttribute(STYLE_ATTR);
};

const chat = (alpha) => style('dbte-duel-chat', alpha < 1 ? duelChatCss(alpha) : null);

// side 1 = the bottom player, 2 = the top one. `state` forces the effects
// state ("hit", "heal", "low", "zero", or a combination); left out, the level
// follows the life as watch.js would compute it.
const setLp = (side, lp, state) => {
  const box = document.getElementById(`lifepoints${side}`);
  if (!box) return false;
  const black = box.querySelector('.black_bar');
  box.querySelector('.life_txt').textContent = String(lp);
  black.style.width = `${(Math.max(0, START_LP - lp) / START_LP) * FULL_BAR_PX}px`;
  const ratio = lifeRatio(black.style.width);
  box.style.setProperty(LP_VAR, ratio.toFixed(3));
  const value = lpState(null, state === undefined ? lpLevel(lp, ratio) : state, lp >= WIDE_LP);
  if (value) box.setAttribute(STATE_ATTR, value);
  else box.removeAttribute(STATE_ATTR);
  // As watch.js does when a pulse starts: the hit ring takes the frame's radius.
  box.style.setProperty(LP_RADIUS_VAR, getComputedStyle(box.querySelector('.life_border') || box).borderRadius);
  return true;
};

// A screenshot catches an animation wherever it is; hold each glow at its
// brightest instead: the hit flash at 8% (its burst ring a third of the way
// out), the heal at 30%, the low breath at its "to" frame.
const PEAKS = { 'dbte-lp-hit': 0.08, 'dbte-lp-burst': 0.3, 'dbte-lp-heal': 0.3, 'dbte-lp-breathe': 0.999 };
const freezeLp = () =>
  document.getAnimations().filter((a) => {
    const at = PEAKS[a.animationName];
    if (at === undefined) return false;
    a.pause();
    a.currentTime = at * a.effect.getTiming().duration;
    return true;
  }).length;

const preview = () =>
  ['preview', 'preview_txt'].filter((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
    return !!el;
  }).length;

const ink = (theme) => inkPass(document.getElementById('content') || document.body, tokensOf(theme).text);

const rect = (sel) => {
  const els = [...document.querySelectorAll(sel)].filter((el) => el.getClientRects().length);
  if (!els.length) return null;
  const r = els.map((el) => el.getBoundingClientRect()).filter((b) => b.width && b.height);
  if (!r.length) return null;
  const x = Math.min(...r.map((b) => b.left));
  const y = Math.min(...r.map((b) => b.top));
  return [x, y, Math.max(...r.map((b) => b.right)) - x, Math.max(...r.map((b) => b.bottom)) - y].map(Math.round);
};

const REGIONS = {
  stage: '#duel img[src*="field_zones"]',
  lpSelf: '#lifepoints1',
  lpOpp: '#lifepoints2',
  phases: '#duel :is(#dp, #sp, #m1, #bp, #m2, #ep)',
  chat: '#duel .cout_txt',
  cardPreview: '#duel #preview',
  cardText: '#duel #preview_txt',
  watchers: '#duel #watchers',
};
const regions = () => Object.fromEntries(Object.entries(REGIONS).map(([k, sel]) => [k, rect(sel)]));

window.dbteRig = { layers, lpStyle, chat, setLp, freezeLp, preview, ink, regions, rect };
