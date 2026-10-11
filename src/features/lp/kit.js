// Shared kit for life point styles (styles/<id>.js). DuelingBook draws each
// side's LP as a 155x30 box (stage px):
//   .lifepoints            the box (#lifepoints1 = you, #lifepoints2 = opponent)
//     .life_bar            fill, 151x26 at 2,2 (paints first)
//       .black_bar         lost life, grows from the left over the fill
//     .life_border         150x25 + 3px border at 0,0 (paints over the bar)
//     .life_txt            the number, 73px wide at 75,3.5, 20px bold, right aligned
// Rules (tested): no layout properties on those elements; our own
// ::before/::after may be positioned. `.lifepoints::after` is reserved for the
// life point effects overlay, so styles never use it.

import { DSEG7_BOLD, DSEG7_BOLD_ITALIC } from './fonts/dseg7.js';

export { svgUrl, svg, alpha } from '../theme/chrome/kit.js';

// The life left, 0-1, written on each .lifepoints by LifePointsEffect.
export const LP_VAR = '--dbte-lp';
export const lp = `var(${LP_VAR}, 1)`;
// Effects state on each .lifepoints: "hit" | "heal", plus "low" | "zero".
export const STATE_ATTR = 'data-dbte-lp';

// Seven-segment faces. The ascent override sits the digits where
// DuelingBook's 20px Arial numbers sit, without touching line-height.
export const SEG = '"DBTE Seg7", "Arial Black", Arial, sans-serif';
export const SEG_ITALIC = '"DBTE Seg7 Italic", "Arial Black", Arial, sans-serif';
export const fontFaces = `
@font-face { font-family: "DBTE Seg7"; src: url(${DSEG7_BOLD}) format("woff2"); font-weight: 100 900; ascent-override: 92%; descent-override: 23%; }
@font-face { font-family: "DBTE Seg7 Italic"; src: url(${DSEG7_BOLD_ITALIC}) format("woff2"); font-weight: 100 900; ascent-override: 92%; descent-override: 23%; }
`;

// A scope: where the style's rules point. The page uses DuelingBook's ids
// (the :is() adds an id, so styles outrank theme chrome in any order); the
// panel preview uses its own copy of the markup.
const scope = (root, self, opp) => ({
  root,
  self,
  opp,
  bar: `${root} .life_bar`,
  black: `${root} .black_bar`,
  border: `${root} .life_border`,
  txt: `${root} .life_txt`,
  // A part on one side: k.on(k.self, 'life_bar').
  on: (side, part) => `${side} .${part}`,
  // A state ("low", "zero", "hit", "heal") on either side.
  when: (state, part = '') => `${root}[${STATE_ATTR}~="${state}"]${part ? ` .${part}` : ''}`,
});

export const PAGE = scope(
  'html body #duel .lifepoints:is(#lifepoints1, #lifepoints2)',
  'html body #duel .lifepoints#lifepoints1',
  'html body #duel .lifepoints#lifepoints2',
);
// A panel preview: its own copy of the markup inside `.<cls>`.
export const previewScope = (cls) => scope(`.${cls} .lifepoints`, `.${cls} .lifepoints.is-self`, `.${cls} .lifepoints.is-opp`);

// Clears whatever the theme (or DuelingBook) painted on the LP block, so a
// style starts from nothing. Styles come after it at the same weight. The box
// itself keeps its filter and animation free for the life point effects. Theme
// crests live on the same pseudo-elements: their last block resets what a
// style may not set, without !important so the style rules after it win.
export const resetCss = (k) => `
${k.root} { background: none !important; box-shadow: none !important; }
${k.bar}, ${k.black}, ${k.border}, ${k.txt} {
  background: none !important; border-color: transparent !important; border-image: none !important; border-radius: 0 !important;
  box-shadow: none !important; filter: none !important; clip-path: none !important; -webkit-mask: none !important; mask: none !important;
  animation: none !important; opacity: 1 !important; text-shadow: none !important; transform: none !important; outline: none !important;
}
${k.txt} { font-family: Arial, sans-serif !important; font-style: normal !important; font-weight: 700 !important; color: #ffffff !important; }
${k.root}::before, ${k.root} *::before, ${k.root} *::after { content: none !important; }
${k.root}::before, ${k.root} *::before, ${k.root} *::after {
  margin: 0; inset: auto; transform: none; filter: none; opacity: 1; background: none; border: 0; border-radius: 0;
  box-shadow: none; clip-path: none; -webkit-mask: none; mask: none; animation: none; z-index: auto; text-shadow: none; pointer-events: none;
}
`;

// Place a .life_border pseudo-element by the LP box's own coordinates
// (0,0 = the box's top-left, 156x31 with the border): the pseudo's
// containing block starts inside the 3px border.
export const box = (x, y, w, h) => `position: absolute; left: ${x - 3}px; top: ${y - 3}px; width: ${w}px; height: ${h}px;`;

// A text outline from shadows (works on DuelingBook's text without touching
// its size), plus an optional extra shadow or glow.
export const outline = (color, w = 1.2, extra = '') => {
  const d = [[w, 0], [-w, 0], [0, w], [0, -w], [w, w], [-w, w], [w, -w], [-w, -w]];
  return [...d.map(([x, y]) => `${x}px ${y}px 0 ${color}`), extra].filter(Boolean).join(', ');
};

// The lit share of a gauge: `fill(colour)` paints from the left (or top/bottom
// with `dir`) up to the life left, the rest in `rest`.
export const fill = (on, rest = 'transparent', dir = '90deg') => `linear-gradient(${dir}, ${on} calc(${lp} * 100%), ${rest} calc(${lp} * 100%))`;
