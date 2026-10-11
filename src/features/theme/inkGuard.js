// Safety net for text DuelingBook colours itself (inline styles, <font>,
// hard-coded white): wherever such text ends up unreadable on the colour the
// theme put behind it, it is re-inked. Card faces and the card text preview
// keep their own colours.
//
// "Behind it" means what is actually painted under the text, read from the
// stack of elements at a few points across the text, not the text's parent
// chain: a menu label sits beside its tile (a sibling layer), not inside it.

import { contrast, flattenLayers, isHex, parseCssColor, toHex } from '../../lib/color.js';

export const INK_ATTR = 'data-dbte-ink';
const MIN_CONTRAST = 4.5;
const SKIP = '.cardfront, .card, #preview_txt, .dbte-psct, img, svg, canvas, input, textarea, select, option';
const OPAQUE_TAGS = new Set(['IMG', 'CANVAS', 'VIDEO', 'SVG', 'IFRAME']);

// null = leave it; 'theme' = the theme's text colour reads well there;
// 'light' / 'dark' = plain white or near-black, whichever reads.
export const inkFor = (textHex, bgHex, themeText) => {
  if (!isHex(textHex) || !isHex(bgHex)) return null;
  if (contrast(textHex, bgHex) >= MIN_CONTRAST) return null;
  if (isHex(themeText) && contrast(themeText, bgHex) >= MIN_CONTRAST) return 'theme';
  return contrast('#ffffff', bgHex) >= contrast('#111111', bgHex) ? 'light' : 'dark';
};

// Splits a computed background-image list at top-level commas.
const splitTop = (list) => {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === ',' && depth === 0) {
      out.push(list.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(list.slice(start).trim());
  return out.filter(Boolean);
};

const COLOR_RE = /(rgba?\([^)]*\)|color\(srgb[^)]*\))/i;

// The paint layers of one element, top first, as [r, g, b, a] colours.
// Gradients count as their first colour stop. Image layers (url()) are
// decoration when the element also paints a colour; an element painted only
// by an image cannot be read and yields 'unknown'. The element's own opacity
// thins every layer (a 35% black veil is not black).
export const elementLayers = ({ backgroundColor, backgroundImage, tag, opacity = 1 }) => {
  if (tag && OPAQUE_TAGS.has(tag.toUpperCase())) return 'unknown';
  const layers = [];
  let image = false;
  if (backgroundImage && backgroundImage !== 'none') {
    splitTop(backgroundImage).forEach((part) => {
      if (/gradient\(/i.test(part)) {
        const m = COLOR_RE.exec(part);
        const c = m && parseCssColor(m[1]);
        if (c && c[3] > 0) layers.push(c);
      } else if (/url\(/i.test(part)) image = true;
    });
  }
  const bg = parseCssColor(backgroundColor);
  if (bg && bg[3] > 0) layers.push(bg);
  if (image && !layers.length) return 'unknown';
  const o = Number(opacity);
  return o >= 1 || !(o >= 0) ? layers : layers.map(([r, g, b, a]) => [r, g, b, a * o]);
};

// The colour the eye sees under text, from paint descriptions top first
// (see elementLayers): layers are blended down to the first opaque one.
// null when an unreadable layer (an image) shows through first.
export const paintedColor = (stack, base = '#ffffff') => {
  const layers = [];
  for (const desc of stack) {
    const own = elementLayers(desc);
    if (own === 'unknown') return null;
    for (const c of own) {
      layers.push(c);
      if (c[3] >= 1) return flattenLayers(layers, base);
    }
  }
  return layers.length ? flattenLayers(layers, base) : null;
};

// Of several samples, the one that reads worst against the text.
export const worstBackground = (textHex, samples) =>
  samples.filter(isHex).reduce((worst, bg) => (worst === null || contrast(textHex, bg) < contrast(textHex, worst) ? bg : worst), null);

// Specific enough to beat the area sheets' own colour rules (one id, a few
// attributes), since the guard only acts where those left text unreadable.
const sel = (v) => `html body #content [${INK_ATTR}="${v}"][${INK_ATTR}][${INK_ATTR}], html body [${INK_ATTR}="${v}"][${INK_ATTR}][${INK_ATTR}]`;
export const inkCss = `
${sel('theme')} { color: var(--dbt-text) !important; }
${sel('light')} { color: #ffffff !important; }
${sel('dark')} { color: #111111 !important; }
`;

const ownsText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());

const describe = (node) => {
  const s = getComputedStyle(node);
  return { backgroundColor: s.backgroundColor, backgroundImage: s.backgroundImage, tag: node.tagName, opacity: s.opacity };
};

// The page colour at the very bottom (html, then body), used as the base
// that see-through layers are blended onto.
const pageBase = () => {
  for (const node of [document.body, document.documentElement]) {
    const c = node && parseCssColor(getComputedStyle(node).backgroundColor);
    if (c && c[3] > 0) return toHex(c);
  }
  return '#ffffff';
};

// Where the element's own text is drawn: one box per line of each direct
// text node, plus their union (for the cache key).
const textBoxes = (el) => {
  const range = document.createRange();
  const boxes = [];
  el.childNodes.forEach((n) => {
    if (n.nodeType !== 3 || !n.textContent.trim()) return;
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) if (r.width > 1 && r.height > 1) boxes.push(r);
  });
  return boxes;
};

// Up to three points to sample: the middle of the first, middle and last line,
// or across a single line.
export const samplePoints = (boxes) => {
  if (!boxes.length) return [];
  const mid = (b, f = 0.5) => [b.left + (b.right - b.left) * f, (b.top + b.bottom) / 2];
  if (boxes.length === 1) return [0.2, 0.5, 0.8].map((f) => mid(boxes[0], f));
  const picks = [boxes[0], boxes[Math.floor(boxes.length / 2)], boxes[boxes.length - 1]];
  return [...new Set(picks)].map((b) => mid(b));
};

// Our own layers (scene, skin, the settings panel) are not DuelingBook's page.
const OWN = '#dbte-skin-layer, #dbte-skin-motif, #dbte-skin-fx, #duelingbook-theme-editor';
const PROBE_ID = 'dbte-ink-probe';

// What is painted under `el`'s text at one point: the element's own
// background first, then the hit-test stack below it (DuelingBook turns
// pointer events off on most of its layers; a probe style turns them back on
// while the guard reads), skipping the element's own content and our layers.
const backgroundAt = (el, x, y, base, desc) => {
  const hits = document.elementsFromPoint(x, y);
  // Only what lies under the text counts. Not hit at all (scrolled out of a
  // list, clipped) or covered by something that paints (a pop-up): no sample.
  // Clear overlays above it (DuelingBook's notification layer) do not count.
  const at = hits.findIndex((node) => node === el || el.contains(node));
  const paints = (node) => { const own = elementLayers(desc(node)); return own === 'unknown' || own.length > 0; };
  if (at < 0 || hits.slice(0, at).some((node) => !node.closest(OWN) && paints(node))) return null;
  const stack = [desc(el)];
  for (const node of hits.slice(at)) {
    if (node === el || el.contains(node) || node.closest(OWN)) continue;
    stack.push(desc(node));
  }
  return paintedColor(stack, base);
};

// Off screen or clipped there is nothing to hit-test: walk up the parent
// chain (what the text sits on once scrolled into view), and at each level
// count the earlier siblings whose box lies under the text's centre (a label
// painted over its tile, as DuelingBook builds its menu buttons).
const backgroundByChain = (el, cx, cy, base, desc) => {
  const stack = [];
  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    stack.push(desc(node));
    for (let sib = node.previousElementSibling, n = 0; sib && n < 6; sib = sib.previousElementSibling, n++) {
      if (sib.matches(OWN)) continue;
      const r = sib.getBoundingClientRect();
      if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) stack.push(desc(sib));
    }
  }
  return paintedColor(stack, base);
};

const cache = new WeakMap();

// Checks every visible element under `roots` (an element or a list) that
// holds text directly; returns how many changed. Clears, reads, then writes
// in separate passes so the page is restyled once, not once per element.
export const inkPass = (roots, themeText) => {
  const seen = new Set();
  (Array.isArray(roots) ? roots : [roots]).forEach((root) => {
    if (root.nodeType !== 1 || !root.isConnected) return;
    seen.add(root);
    root.querySelectorAll('*').forEach((el) => seen.add(el));
  });
  const els = [...seen].filter((el) => ownsText(el) && !el.closest(SKIP));
  const had = els.map((el) => el.getAttribute(INK_ATTR));
  // Judge DuelingBook's own colour, not one we set on an earlier pass.
  els.forEach((el, i) => had[i] && el.removeAttribute(INK_ATTR));
  const base = pageBase();
  const styles = new Map();
  const desc = (node) => {
    if (!styles.has(node)) styles.set(node, describe(node));
    return styles.get(node);
  };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let probe = null;
  const inks = els.map((el) => {
    // Hidden (display: none anywhere above) has no boxes; fixed text still counts.
    if (!el.getClientRects().length) return null;
    const rgb = parseCssColor(getComputedStyle(el).color);
    if (!rgb) return null;
    const textHex = toHex(rgb);
    const boxes = textBoxes(el);
    if (!boxes.length) return null;
    const u = boxes.reduce((acc, b) => [Math.min(acc[0], b.left), Math.min(acc[1], b.top), Math.max(acc[2], b.right), Math.max(acc[3], b.bottom)], [Infinity, Infinity, -Infinity, -Infinity]);
    // Same colour in the same place as last time: same answer.
    const key = `${textHex}|${u.map(Math.round).join('|')}|${boxes.length}|${themeText}|${base}`;
    const hit = cache.get(el);
    if (hit && hit.key === key) return hit.ink;
    const pts = samplePoints(boxes).filter(([x, y]) => x >= 0 && x < vw && y >= 0 && y < vh);
    let bg = null;
    if (pts.length) {
      if (!probe) {
        probe = document.createElement('style');
        probe.id = PROBE_ID;
        probe.textContent = 'html body * { pointer-events: auto !important; }';
        (document.head || document.documentElement).appendChild(probe);
      }
      bg = worstBackground(textHex, pts.map(([x, y]) => backgroundAt(el, x, y, base, desc)));
    }
    // Off screen or clipped everywhere (a list row scrolled out of view): judge it by its parents.
    if (bg === null) bg = backgroundByChain(el, (u[0] + u[2]) / 2, (u[1] + u[3]) / 2, base, desc);
    const ink = bg ? inkFor(textHex, bg, themeText) : null;
    cache.set(el, { key, ink });
    return ink;
  });
  if (probe) probe.remove();
  let changed = 0;
  els.forEach((el, i) => {
    if (inks[i]) el.setAttribute(INK_ATTR, inks[i]);
    if (inks[i] !== had[i]) changed += 1;
  });
  return changed;
};

export const clearInk = (root) => root.querySelectorAll(`[${INK_ATTR}]`).forEach((el) => el.removeAttribute(INK_ATTR));
