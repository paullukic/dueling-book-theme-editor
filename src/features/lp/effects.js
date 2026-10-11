// Life point effects. Glows are drop-shadow filters on the .lifepoints box
// itself, so they trace the exact silhouette of whatever frame is drawn there
// (a theme's rounded, square or chamfered border and its crest, or a style's
// plate), kept tight (a lit rim, a short bloom) so they never blur into a slab.
//   hit   a short white-hot core flash into a red rim, and a red ring with a
//         white hairline bursting outward from the frame (our ::after, the
//         frame's own radius); unmistakable on any theme, gold frames too.
//   heal  a green rim that swells and fades.
//   low   an amber-to-red rim breathing slowly, a colour pair no side colour
//         uses at rest.
//   zero  a steady red rim, the number in red.
// The top counter sits at the page edge: its glow leans down. A style may tune
// colours with --lp-hit and --lp-heal. Filters are never !important (it would
// beat the keyframes); reduced motion gets the same states, still.

import { LP_RADIUS_VAR, PAGE } from './kit.js';

const hit = 'var(--lp-hit, #ff3b2f)';
const amber = '#ffb21e';
const heal = 'var(--lp-heal, #3cf08c)';
// Same function list everywhere, so keyframes interpolate smoothly.
const rim = (c1, c2, r1, r2, lift = 1) =>
  `drop-shadow(0 var(--lp-fx-dy, 0px) ${r1}px ${c1}) drop-shadow(0 var(--lp-fx-dy, 0px) ${r1}px ${c1}) drop-shadow(0 var(--lp-fx-dy, 0px) ${r2}px ${c2}) brightness(${lift})`;

export const fxCss = (k) => `
${k.opp} { --lp-fx-dy: 1.5px; }
${k.when('low')} { filter: ${rim(amber, hit, 1, 2.5)}; animation: dbte-lp-breathe 1.6s ease-in-out infinite alternate !important; }
${k.when('zero')} { filter: ${rim(hit, hit, 1.2, 3)}; animation: none !important; }
${k.when('hit')} { animation: dbte-lp-hit 0.75s cubic-bezier(0.2, 0.7, 0.3, 1) both !important; }
${k.when('heal')} { animation: dbte-lp-heal 1.1s ease-out both !important; }
${k.when('hit')}::after {
  content: "" !important; position: absolute; left: 0; top: 0; width: 150px; height: 25px; pointer-events: none;
  border: 3px solid ${hit}; border-radius: var(${LP_RADIUS_VAR}, 15px); box-sizing: content-box;
  box-shadow: inset 0 0 0 1px #ffffff, 0 0 0 1px #ffffff, 0 0 12px 4px ${hit};
  animation: dbte-lp-burst 0.5s cubic-bezier(0.1, 0.6, 0.3, 1) both;
}
${k.when('zero', 'life_txt')} { color: ${hit} !important; -webkit-text-fill-color: currentColor !important; }
@keyframes dbte-lp-hit {
  0% { filter: ${rim('#ffffff', hit, 1, 5, 1.5)}; }
  14% { filter: ${rim(hit, hit, 1.6, 6, 1.25)}; }
  45% { filter: ${rim(hit, hit, 1.2, 3, 1)}; }
  100% { filter: ${rim(hit, hit, 0, 0, 1)}; }
}
@keyframes dbte-lp-burst { 0% { opacity: 1; transform: scale(1); } 45% { opacity: 1; transform: scale(1.07, 1.3); } 100% { opacity: 0; transform: scale(1.16, 1.6); } }
@keyframes dbte-lp-heal {
  0% { filter: ${rim(heal, heal, 0, 0, 1)}; }
  30% { filter: ${rim(heal, heal, 1.5, 6, 1.15)}; }
  100% { filter: ${rim(heal, heal, 0, 0, 1)}; }
}
@keyframes dbte-lp-breathe { from { filter: ${rim(amber, hit, 0.6, 1.5)}; } to { filter: ${rim(hit, amber, 1.4, 3)}; } }
@media (prefers-reduced-motion: reduce) {
  ${k.when('hit')} { animation: none !important; filter: ${rim('#ffffff', hit, 1.5, 6, 1.3)}; }
  ${k.when('hit')}::after { animation: none; opacity: 0; }
  ${k.when('heal')} { animation: none !important; filter: ${rim(heal, heal, 1.5, 6)}; }
  ${k.when('low')} { animation: none !important; }
}
`;

export const effectsCss = fxCss(PAGE);
