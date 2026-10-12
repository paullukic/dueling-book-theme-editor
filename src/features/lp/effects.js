// Life point effects. Glows are drop-shadow filters on the .lifepoints box
// itself, so they trace the exact silhouette of whatever frame is drawn there
// (a theme's rounded, square or chamfered border and its crest, or a style's
// plate), kept tight (a lit rim, a short bloom) so they never blur into a slab.
//   hit   a white rim flashing into a tight red one, and on the frame a ring
//         (our ::after: the frame's own radius, skewed by --dbte-lp-skew,
//         clipped by --dbte-lp-clip) that opens as a short white-hot flash
//         (the ring lifted to white with a white bloom) and turns into a red
//         ring whose bloom shrinks and fades in place. The ring never moves or grows and never
//         paints inside the frame, so the number stays crisp in its own
//         colour and outline. No brightness lift: the box keeps its own
//         values, and a hit stacks on low ("hit low").
//         A theme that draws its own hit (a palette blink) sets
//         --dbte-lp-hit-bloom: none, which drops the coloured rim and the ring.
//   heal  a green rim that swells and fades.
//   low   an amber-to-danger rim breathing slowly (the theme's danger colour,
//         red without a theme), a colour pair no side colour uses at rest.
//   zero  a steady danger rim, the number in red.
// The top counter sits at the page edge: its glow leans down. A style may tune
// colours with --lp-hit and --lp-heal. Filters are never !important (it would
// beat the keyframes); reduced motion gets the same states, still.

import { LP_CLIP_VAR, LP_HIT_BLOOM_VAR, LP_RADIUS_VAR, LP_SKEW_VAR, PAGE } from './kit.js';

const hit = 'var(--lp-hit, #ff3b2f)';
const amber = '#ffb21e';
// Low and zero ring in the theme's own danger colour (red without a theme).
const danger = 'var(--dbt-danger, #ff3b2f)';
const heal = 'var(--lp-heal, #3cf08c)';
// Same function list everywhere, so keyframes interpolate smoothly.
const rim = (c1, c2, r1, r2) =>
  `drop-shadow(0 var(--lp-fx-dy, 0px) ${r1}px ${c1}) drop-shadow(0 var(--lp-fx-dy, 0px) ${r1}px ${c1}) drop-shadow(0 var(--lp-fx-dy, 0px) ${r2}px ${c2})`;
const skew = `skewX(var(${LP_SKEW_VAR}, 0deg))`;
// --dbte-lp-hit-bloom: none turns off the hit's animation, filter and ring.
const bloom = (fallback) => `var(${LP_HIT_BLOOM_VAR}, ${fallback})`;
// The ring's flash: a brightness lift turns it white-hot, its bloom a
// drop-shadow that shrinks in place (compositor-only, like every effect).
const flash = (lift, c, r1, r2) => `brightness(${lift}) drop-shadow(0 0 ${r1}px ${c}) drop-shadow(0 0 ${r2}px ${c})`;

export const fxCss = (k) => `
${k.opp} { --lp-fx-dy: 1.5px; }
${k.when('low')} { filter: ${rim(amber, danger, 1, 2.5)}; animation: dbte-lp-breathe 1.6s ease-in-out infinite alternate !important; }
${k.when('zero')} { filter: ${rim(danger, danger, 1.2, 3)}; animation: none !important; }
${k.when('hit')} { animation: ${bloom('dbte-lp-hit')} 0.75s cubic-bezier(0.2, 0.7, 0.3, 1) both !important; }
${k.when('heal')} { animation: dbte-lp-heal 1.1s ease-out both !important; }
${k.when('hit')}::after {
  content: "" !important; display: ${bloom('block')}; position: absolute; left: 0; top: 0; width: 150px; height: 25px; pointer-events: none;
  border: 3px solid ${hit}; border-radius: var(${LP_RADIUS_VAR}, 15px); box-sizing: content-box;
  box-shadow: inset 0 0 0 1px #ffffff, 0 0 0 1px #ffffff;
  clip-path: var(${LP_CLIP_VAR}, none); transform: ${skew}; transform-origin: 50% 50%;
  animation: dbte-lp-burst 0.5s cubic-bezier(0.2, 0.7, 0.3, 1) both;
}
${k.when('zero', 'life_txt')} { color: ${hit} !important; -webkit-text-fill-color: currentColor !important; }
@keyframes dbte-lp-hit {
  0% { filter: ${rim('#ffffff', hit, 1.2, 4)}; }
  14% { filter: ${rim(hit, hit, 1.4, 4)}; }
  45% { filter: ${rim(hit, hit, 1, 2.5)}; }
  100% { filter: ${rim(hit, hit, 0, 0)}; }
}
@keyframes dbte-lp-burst {
  0% { opacity: 1; filter: ${flash(8, '#ffffff', 2.5, 1)}; }
  8% { opacity: 1; filter: ${flash(8, '#ffffff', 2.5, 1)}; }
  22% { opacity: 1; filter: ${flash(1, hit, 3, 1)}; }
  100% { opacity: 0; filter: ${flash(1, hit, 0, 0)}; }
}
@keyframes dbte-lp-heal {
  0% { filter: ${rim(heal, heal, 0, 0)}; }
  30% { filter: ${rim(heal, heal, 1.5, 6)}; }
  100% { filter: ${rim(heal, heal, 0, 0)}; }
}
@keyframes dbte-lp-breathe { from { filter: ${rim(amber, danger, 0.6, 1.5)}; } to { filter: ${rim(danger, amber, 1.4, 3)}; } }
@media (prefers-reduced-motion: reduce) {
  ${k.when('hit')} { animation: none !important; filter: ${bloom(rim('#ffffff', hit, 1.5, 4))}; }
  ${k.when('hit')}::after { animation: none; opacity: 0; }
  ${k.when('heal')} { animation: none !important; filter: ${rim(heal, heal, 1.5, 6)}; }
  ${k.when('low')} { animation: none !important; }
}
`;

export const effectsCss = fxCss(PAGE);
