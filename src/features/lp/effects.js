// Life point effects. Glows are drop-shadow filters on the .lifepoints box
// itself, so they trace the exact silhouette of whatever frame is drawn there
// (a theme's rounded, square or chamfered border and its crest, or a style's
// plate), kept tight (a lit rim, a short bloom) so they never blur into a slab.
//   hit   a white rim flashing into a tight red one, and over the frame a
//         white-hot core (white centre, red edge) that fades with a red ring
//         with a white hairline bursting outward (our ::after, the frame's own radius,
//         skewed by --dbte-lp-skew for a slanted frame); unmistakable on any
//         theme, gold frames too. No brightness lift: the box keeps its own
//         values (a light theme's pale track never blows out to white, a dark
//         empty track stays dark), and a hit stacks on low ("hit low").
//   heal  a green rim that swells and fades.
//   low   an amber-to-danger rim breathing slowly (the theme's danger colour,
//         red without a theme), a colour pair no side colour uses at rest.
//   zero  a steady danger rim, the number in red.
// The top counter sits at the page edge: its glow and ring lean down. A style may tune
// colours with --lp-hit and --lp-heal. Filters are never !important (it would
// beat the keyframes); reduced motion gets the same states, still.

import { LP_RADIUS_VAR, LP_SKEW_VAR, PAGE, STATE_ATTR } from './kit.js';

const hit = 'var(--lp-hit, #ff3b2f)';
const amber = '#ffb21e';
// Low and zero ring in the theme's own danger colour (red without a theme).
const danger = 'var(--dbt-danger, #ff3b2f)';
const heal = 'var(--lp-heal, #3cf08c)';
// Same function list everywhere, so keyframes interpolate smoothly.
const rim = (c1, c2, r1, r2) =>
  `drop-shadow(0 var(--lp-fx-dy, 0px) ${r1}px ${c1}) drop-shadow(0 var(--lp-fx-dy, 0px) ${r1}px ${c1}) drop-shadow(0 var(--lp-fx-dy, 0px) ${r2}px ${c2})`;
const skew = `skewX(var(${LP_SKEW_VAR}, 0deg))`;

export const fxCss = (k) => `
${k.opp} { --lp-fx-dy: 1.5px; }
${k.when('low')} { filter: ${rim(amber, danger, 1, 2.5)}; animation: dbte-lp-breathe 1.6s ease-in-out infinite alternate !important; }
${k.when('zero')} { filter: ${rim(danger, danger, 1.2, 3)}; animation: none !important; }
${k.when('hit')} { animation: dbte-lp-hit 0.75s cubic-bezier(0.2, 0.7, 0.3, 1) both !important; }
${k.when('heal')} { animation: dbte-lp-heal 1.1s ease-out both !important; }
${k.when('hit')}::after {
  content: "" !important; position: absolute; left: 0; top: 0; width: 150px; height: 25px; pointer-events: none;
  border: 3px solid ${hit}; border-radius: var(${LP_RADIUS_VAR}, 15px); box-sizing: content-box;
  box-shadow: inset 0 0 0 1px #ffffff, 0 0 0 1px #ffffff, 0 0 7px 2px ${hit};
  background: radial-gradient(closest-side, rgba(255, 255, 255, 0.6), rgba(255, 120, 100, 0.3) 60%, rgba(255, 59, 47, 0.12));
  transform-origin: 50% 50%;
  animation: dbte-lp-burst 0.5s cubic-bezier(0.1, 0.6, 0.3, 1) both;
}
${k.opp}[${STATE_ATTR}~="hit"]::after { transform-origin: 50% 0; }
${k.when('zero', 'life_txt')} { color: ${hit} !important; -webkit-text-fill-color: currentColor !important; }
@keyframes dbte-lp-hit {
  0% { filter: ${rim('#ffffff', hit, 1.2, 4)}; }
  14% { filter: ${rim(hit, hit, 1.4, 4)}; }
  45% { filter: ${rim(hit, hit, 1, 2.5)}; }
  100% { filter: ${rim(hit, hit, 0, 0)}; }
}
@keyframes dbte-lp-burst {
  0% { opacity: 1; transform: ${skew} scale(1); }
  45% { opacity: 0.85; transform: ${skew} scale(1.07, 1.3); }
  100% { opacity: 0; transform: ${skew} scale(1.16, 1.6); }
}
@keyframes dbte-lp-heal {
  0% { filter: ${rim(heal, heal, 0, 0)}; }
  30% { filter: ${rim(heal, heal, 1.5, 6)}; }
  100% { filter: ${rim(heal, heal, 0, 0)}; }
}
@keyframes dbte-lp-breathe { from { filter: ${rim(amber, danger, 0.6, 1.5)}; } to { filter: ${rim(danger, amber, 1.4, 3)}; } }
@media (prefers-reduced-motion: reduce) {
  ${k.when('hit')} { animation: none !important; filter: ${rim('#ffffff', hit, 1.5, 4)}; }
  ${k.when('hit')}::after { animation: none; opacity: 0; }
  ${k.when('heal')} { animation: none !important; filter: ${rim(heal, heal, 1.5, 6)}; }
  ${k.when('low')} { animation: none !important; }
}
`;

export const effectsCss = fxCss(PAGE);
