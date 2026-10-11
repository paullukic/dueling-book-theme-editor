// Life point effects: the LP block glows red when a side loses life, green
// when it gains, breathes slowly under 25% and stays lit at 0. The glow is a
// drop-shadow filter on the .lifepoints box itself, so it takes the exact
// silhouette of whatever frame is drawn there: a theme's rounded, square or
// chamfered border and its crest, or a life point style's plate. A style may
// tune the colours with --lp-hit and --lp-heal. Short pulses and the low-life
// breath animate the filter on that small box only; reduced motion gets the
// same states, still. Filters are never !important: an !important value
// would beat the keyframes.

import { PAGE } from './kit.js';

const hit = 'var(--lp-hit, #ff3b2f)';
const heal = 'var(--lp-heal, #3cf08c)';
// A tight bright rim, then a wider bloom: reads as a lit edge, not a haze.
// Every value has the same function list, so keyframes interpolate smoothly.
const glow = (c, rim, bloom, lift = 1) =>
  `drop-shadow(0 0 ${rim}px ${c}) drop-shadow(0 0 ${rim}px ${c}) drop-shadow(0 0 ${bloom}px ${c}) brightness(${lift})`;

export const fxCss = (k) => `
${k.when('low')} { filter: ${glow(hit, 1, 6)}; animation: dbte-lp-breathe 1.8s ease-in-out infinite alternate !important; }
${k.when('zero')} { filter: ${glow(hit, 1.5, 9)}; animation: none !important; }
${k.when('hit')} { animation: dbte-lp-hit 0.8s cubic-bezier(0.2, 0.7, 0.3, 1) both !important; }
${k.when('heal')} { animation: dbte-lp-heal 1.1s ease-out both !important; }
${k.when('zero', 'life_txt')} { color: ${hit} !important; -webkit-text-fill-color: currentColor !important; }
@keyframes dbte-lp-hit {
  0% { filter: ${glow('#ffffff', 1, 4)}; }
  12% { filter: ${glow(hit, 2, 14, 1.25)}; }
  40% { filter: ${glow(hit, 1.5, 10)}; }
  100% { filter: ${glow(hit, 0, 0)}; }
}
@keyframes dbte-lp-heal {
  0% { filter: ${glow(heal, 0, 0)}; }
  30% { filter: ${glow(heal, 1.5, 12, 1.12)}; }
  100% { filter: ${glow(heal, 0, 0)}; }
}
@keyframes dbte-lp-breathe { from { filter: ${glow(hit, 0.5, 3)}; } to { filter: ${glow(hit, 1.5, 9)}; } }
@media (prefers-reduced-motion: reduce) {
  ${k.when('hit')} { animation: none !important; filter: ${glow(hit, 1.5, 10)}; }
  ${k.when('heal')} { animation: none !important; filter: ${glow(heal, 1.5, 10)}; }
  ${k.when('low')} { animation: none !important; }
}
`;

export const effectsCss = fxCss(PAGE);
