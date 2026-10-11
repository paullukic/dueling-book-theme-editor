// Safety net for text DuelingBook colours itself (inline styles, <font>,
// hard-coded white): wherever such text ends up unreadable on the colour the
// theme put behind it, it is re-inked. Card faces and the card text preview
// keep their own colours.

import { contrast, isHex, parseCssColor, toHex } from '../../lib/color.js';
import { backgroundBehind } from '../../lib/dom.js';

export const INK_ATTR = 'data-dbte-ink';
const MIN_CONTRAST = 4.5;
const SKIP = '.cardfront, .card, #preview_txt, .dbte-psct, img, svg, canvas, input, textarea, select, option';

// null = leave it; 'theme' = the theme's text colour reads well there;
// 'light' / 'dark' = plain white or near-black, whichever reads.
export const inkFor = (textHex, bgHex, themeText) => {
  if (!isHex(textHex) || !isHex(bgHex)) return null;
  if (contrast(textHex, bgHex) >= MIN_CONTRAST) return null;
  if (isHex(themeText) && contrast(themeText, bgHex) >= MIN_CONTRAST) return 'theme';
  return contrast('#ffffff', bgHex) >= contrast('#111111', bgHex) ? 'light' : 'dark';
};

// Specific enough to beat the area sheets' own colour rules (one id, a few
// attributes), since the guard only acts where those left text unreadable.
const sel = (v) => `html body #content [${INK_ATTR}="${v}"][${INK_ATTR}][${INK_ATTR}], html body [${INK_ATTR}="${v}"][${INK_ATTR}][${INK_ATTR}]`;
export const inkCss = `
${sel('theme')} { color: var(--dbt-text) !important; }
${sel('light')} { color: #ffffff !important; }
${sel('dark')} { color: #111111 !important; }
`;

const ownsText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

// Checks every visible element that holds text directly; returns how many
// changed. Clears, reads, then writes in separate passes so the page is
// restyled once, not once per element.
export const inkPass = (root, themeText) => {
  const els = [...root.querySelectorAll('*')].filter((el) => ownsText(el) && !el.closest(SKIP));
  const had = els.map((el) => el.getAttribute(INK_ATTR));
  // Judge DuelingBook's own colour, not one we set on an earlier pass.
  els.forEach((el, i) => had[i] && el.removeAttribute(INK_ATTR));
  const inks = els.map((el) => {
    if (el.offsetParent === null) return null;
    const rgb = parseCssColor(getComputedStyle(el).color);
    const bg = rgb && backgroundBehind(el);
    return rgb && bg ? inkFor(toHex(rgb), bg, themeText) : null;
  });
  let changed = 0;
  els.forEach((el, i) => {
    if (inks[i]) el.setAttribute(INK_ATTR, inks[i]);
    if (inks[i] !== had[i]) changed += 1;
  });
  return changed;
};

export const clearInk = (root) => root.querySelectorAll(`[${INK_ATTR}]`).forEach((el) => el.removeAttribute(INK_ATTR));
