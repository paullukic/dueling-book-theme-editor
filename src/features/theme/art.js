// Theme-coloured artwork. DuelingBook draws icons and the playmat as <img>
// SVGs; CSS `content: url()` on an <img> replaces what it shows, whatever
// src the site's own script swaps in on hover.

import { mix } from '../../lib/color.js';

const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const FONT = 'Segoe UI, system-ui, Roboto, Arial, sans-serif';

// Matches an icon whether it is loaded (src) or still waiting to lazy-load (data-src).
const img = (name) => `html #content img[src*="/svg/${name}"], html #content img[data-src*="/svg/${name}"]`;

const button = (label, fill, stroke, text, radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153.4 78.47"><rect x="6" y="10" width="141.4" height="58.47" rx="${Math.min(radius * 2.2, 29)}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="76.7" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${text}">${label}</text></svg>`;

const wideButton = (label, fill, stroke, text, radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 234.85 78.5"><rect x="6" y="10" width="222.85" height="58.5" rx="${Math.min(radius * 2.2, 29)}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><text x="117.4" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${text}">${label}</text></svg>`;

const square = (glyph, fill, stroke, radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><rect x="1" y="1" width="23" height="23" rx="${Math.min(radius, 8)}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>${glyph}</svg>`;

export const iconCss = (t, radius) => {
  const line = (d, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  const exit = square(line('M8.5 8.5l8 8M16.5 8.5l-8 8', t.danger), t.raised, t.border, radius);
  const minimize = square(line('M8 13h9', t.text), t.raised, t.border, radius);
  const expand = square(line('M8.5 8.5h8v8h-8z', t.text), t.raised, t.border, radius);
  const close = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.9 9.9"><circle cx="4.95" cy="4.95" r="4.7" fill="${t.raised}" stroke="${t.border}" stroke-width="0.5"/><path d="M3.2 3.2l3.5 3.5M6.7 3.2l-3.5 3.5" stroke="${t.text}" stroke-width="0.9" stroke-linecap="round"/></svg>`;
  const check = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path d="M3.2 7.4l2.4 2.4 5.2-5.6" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const radio = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><circle cx="7" cy="7" r="3" fill="${t.accent}"/></svg>`;
  const arrow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 12"><path d="M6 2l6 7 6-7" fill="none" stroke="${t.muted}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const menuRow = (fill, line) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 813 122" preserveAspectRatio="none"><rect width="813" height="122" fill="${fill}"/><rect y="116" width="813" height="6" fill="${line}"/></svg>`;
  const overPanel = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 634 574"><rect x="3" y="3" width="628" height="568" rx="${Math.min(radius * 3, 40)}" fill="${t.surface}" stroke="${t.border}" stroke-width="3"/></svg>`;
  const primary = (label) => button(label, t.accent, t.accent, t.accentText, radius);
  const secondary = (label) => button(label, t.raised, t.border, t.text, radius);

  const rules = [
    [img('ok_btn'), primary('OK')],
    [img('yes_btn'), primary('Yes')],
    [img('no_btn'), secondary('No')],
    [img('cancel_btn'), wideButton('Cancel', t.raised, t.border, t.text, radius)],
    [img('exit_btn'), exit],
    [img('minimize_btn'), minimize],
    [img('minimize2_btn'), minimize],
    [img('expand_btn'), expand],
    [img('close_btn'), close],
    [img('card_menu_btn_up'), menuRow(t.raised, t.border)],
    [img('card_menu_btn_over'), menuRow(mix(t.raised, t.accent, 0.22), t.accent)],
    [img('card_menu_btn_down'), menuRow(mix(t.raised, t.accent, 0.4), t.accent)],
    [img('over.svg'), overPanel],
    ['html #content .checkbox img.check', check],
    ['html #content .radiobutton img.check', radio],
    ['html #content .combobox .combobox_arrow img', arrow],
  ];
  const states = ['ok_btn', 'yes_btn', 'no_btn', 'cancel_btn', 'exit_btn', 'minimize_btn', 'minimize2_btn', 'expand_btn', 'close_btn'];
  return `${rules.map(([sel, svg]) => `${sel} { content: ${svgUrl(svg)} !important; filter: none !important; }`).join('\n')}
${states.map((n) => `html #content img[src*="/svg/${n}_over"]`).join(', ')} { filter: brightness(1.18) !important; }
${states.map((n) => `html #content img[src*="/svg/${n}_down"]`).join(', ')} { filter: brightness(0.85) !important; }
`;
};

// The playmat: fetch DuelingBook's own zone art (served with CORS *), swap its
// four gradient colours for the side colours and show that instead. Geometry
// stays pixel-identical for every field layout.
const FIELD_FILES = ['field_zones', 'field_zones1', 'field_zones2', 'field_zones3', 'field_zones4', 'field_decks', 'field_decks2'];
const fieldCache = new Map();

const fetchField = (name) => {
  if (!fieldCache.has(name)) {
    fieldCache.set(
      name,
      fetch(`https://images.duelingbook.com/svg/${name}.svg`)
        .then((r) => (r.ok ? r.text() : null))
        .catch(() => null),
    );
  }
  return fieldCache.get(name);
};

export const recolorField = (svg, t) => {
  const selfAlt = mix(t.self, t.accent2, 0.55);
  const oppAlt = mix(t.opp, t.accent2, 0.55);
  const map = [
    [/stop-color="(red|#f00|#ff0000)"/gi, t.self],
    [/stop-color="(#90f|#9900ff)"/gi, selfAlt],
    [/stop-color="(#00b400)"/gi, t.opp],
    [/stop-color="(#ff8f00|#ff8b00)"/gi, oppAlt],
  ];
  return map.reduce((out, [re, color]) => out.replace(re, `stop-color="${color}"`), svg);
};

export const fieldCss = async (t) => {
  const files = await Promise.all(FIELD_FILES.map(fetchField));
  return FIELD_FILES.map((name, i) => {
    if (!files[i]) return '';
    const sel = `html #content img[src*="/svg/${name}.svg"], html #content img[data-src*="/svg/${name}.svg"]`;
    return `${sel} { content: ${svgUrl(recolorField(files[i], t))} !important; }`;
  }).join('\n');
};
