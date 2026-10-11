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

// ---------- theme-styled icons ----------

// Each preset's icons share its look: the frame changes with the skin, the
// glyph stays the same so icons are always recognisable.
export const ICON_STYLES = {
  branded: 'ember',
  'black-dragon': 'ember',
  artmage: 'paint',
  hero: 'comic',
  pendulum: 'split',
  divine: 'gilded',
  xyz: 'gilded',
  millennium: 'gilded',
  link: 'hex',
  spell: 'circle',
  'dark-magic': 'circle',
};

// The frame behind a glyph, filling a w x h box.
const frame = (style, w, h, t, radius) => {
  const m = Math.max(1, Math.min(w, h) * 0.06);
  const x = m;
  const y = m;
  const fw = w - 2 * m;
  const fh = h - 2 * m;
  const sw = Math.max(1, Math.min(w, h) * 0.045);
  const r = Math.min(radius, Math.min(fw, fh) / 3);
  const cx = w / 2;
  const cy = h / 2;
  const rr = Math.min(fw, fh) / 2;
  switch (style) {
    case 'ember':
      return `<defs><linearGradient id="e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.raised}"/><stop offset="1" stop-color="${mix(t.raised, t.accent, 0.45)}"/></linearGradient></defs><rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${Math.min(r, 3)}" fill="url(#e)" stroke="${t.accent2}" stroke-width="${sw}"/><rect x="${x + sw * 1.6}" y="${y + sw * 1.6}" width="${fw - sw * 3.2}" height="${fh - sw * 3.2}" rx="1" fill="none" stroke="${t.accent2}" stroke-opacity="0.4" stroke-width="${sw * 0.5}"/>`;
    case 'paint':
      return `<path d="M${cx} ${y + fh * 0.04}C${x + fw * 0.95} ${y - fh * 0.02} ${x + fw * 1.02} ${y + fh * 0.62} ${x + fw * 0.82} ${y + fh * 0.9}S${x + fw * 0.1} ${y + fh * 1.02} ${x + fw * 0.05} ${y + fh * 0.62}S${x + fw * 0.2} ${y + fh * 0.06} ${cx} ${y + fh * 0.04}Z" fill="${mix(t.raised, t.accent, 0.28)}" stroke="${t.accent2}" stroke-width="${sw}"/>`;
    case 'comic':
      return `<rect x="${x + sw * 1.4}" y="${y + sw * 1.4}" width="${fw - sw * 1.4}" height="${fh - sw * 1.4}" rx="${Math.min(r, 4)}" fill="${t.accent2}"/><rect x="${x}" y="${y}" width="${fw - sw * 1.4}" height="${fh - sw * 1.4}" rx="${Math.min(r, 4)}" fill="${t.raised}" stroke="${t.text}" stroke-width="${sw * 1.1}"/>`;
    case 'split':
      return `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.raised, t.self, 0.4)}"/><stop offset="0.5" stop-color="${t.raised}"/><stop offset="1" stop-color="${mix(t.raised, t.accent, 0.4)}"/></linearGradient></defs><rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${r}" fill="url(#s)" stroke="${t.border}" stroke-width="${sw}"/>`;
    case 'gilded':
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${Math.min(r, 3)}" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}"/><rect x="${x + sw * 2}" y="${y + sw * 2}" width="${fw - sw * 4}" height="${fh - sw * 4}" rx="1" fill="none" stroke="${t.accent}" stroke-opacity="0.45" stroke-width="${sw * 0.6}"/>`;
    case 'hex': {
      const pts = [0, 1, 2, 3, 4, 5].map((i) => {
        const a = (Math.PI / 3) * i;
        return `${(cx + Math.cos(a) * rr).toFixed(2)},${(cy + Math.sin(a) * rr * (fh / fw > 1 ? 1 : fh / fw)).toFixed(2)}`;
      });
      return `<polygon points="${pts.join(' ')}" fill="${t.raised}" stroke="${t.accent2}" stroke-width="${sw}"/>`;
    }
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}"/><circle cx="${cx}" cy="${cy}" r="${rr - sw * 2.2}" fill="none" stroke="${t.accent}" stroke-opacity="0.4" stroke-width="${sw * 0.5}" stroke-dasharray="${sw * 1.5} ${sw * 1.2}"/>`;
    default:
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${r}" fill="${t.raised}" stroke="${t.border}" stroke-width="${sw}"/>`;
  }
};

// Glyphs drawn in a 40 x 40 box; `ink` is the main colour, `hi` the highlight.
const GLYPHS = {
  online: (ink, hi) =>
    `<g fill="none" stroke-width="2.6" stroke-linecap="round"><circle cx="16" cy="15" r="5.5" stroke="${ink}"/><path d="M6.5 31q0-9 9.5-9t9.5 9" stroke="${ink}"/><circle cx="27" cy="13" r="4.2" stroke="${hi}"/><path d="M26 19.5q8 .5 9 8" stroke="${hi}"/></g>`,
  chat: (ink, hi) =>
    `<path d="M9 9h22q3.5 0 3.5 3.5v11q0 3.5-3.5 3.5H19l-6.5 5.5V27H9q-3.5 0-3.5-3.5v-11Q5.5 9 9 9z" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linejoin="round"/><g fill="${hi}"><circle cx="13.5" cy="18" r="1.9"/><circle cx="20" cy="18" r="1.9"/><circle cx="26.5" cy="18" r="1.9"/></g>`,
  private: (ink, hi) =>
    `<path d="M15 6h17q3 0 3 3v8q0 3-3 3h-1v4l-4.5-4H24" fill="none" stroke="${hi}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/><path d="M8 14h15q3 0 3 3v9q0 3-3 3h-9l-5 4.5V29H8q-3 0-3-3v-9q0-3 3-3z" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linejoin="round"/>`,
  tools: (ink) =>
    `<path d="M27.5 7.5a7 7 0 0 0-8.6 8.6L8 27l5 5 10.9-10.9a7 7 0 0 0 8.6-8.6l-4.3 4.3-4.6-.6-.6-4.6z" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round"/>`,
  sort: (ink, hi) =>
    `<text x="20" y="21" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="14" fill="${ink}">A–Z</text><path d="M14 30h12" stroke="${hi}" stroke-width="2.2" stroke-linecap="round"/>`,
  info: (ink) =>
    `<text x="20" y="21.5" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="24" fill="${ink}">?</text>`,
  locked: (ink, hi) =>
    `<rect x="11" y="18" width="18" height="14" rx="2.5" fill="none" stroke="${ink}" stroke-width="2.6"/><path d="M14.5 18v-4a5.5 5.5 0 0 1 11 0v4" fill="none" stroke="${ink}" stroke-width="2.6"/><circle cx="20" cy="25" r="2" fill="${hi}"/>`,
  unlocked: (ink, hi) =>
    `<rect x="11" y="18" width="18" height="14" rx="2.5" fill="none" stroke="${ink}" stroke-width="2.6"/><path d="M14.5 18v-4a5.5 5.5 0 0 1 10.6-2" fill="none" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/><circle cx="20" cy="25" r="2" fill="${hi}"/>`,
};

// A framed glyph in a w x h viewBox (the size DuelingBook gives the <img>).
const framedIcon = (glyph, w, h, t, radius, style, { ink = t.text, hi = t.accent, badge = false } = {}) => {
  const s = (Math.min(w, h) * 0.78) / 40;
  const gx = (w - 40 * s) / 2;
  const gy = (h - 40 * s) / 2;
  const dot = badge ? `<circle cx="${w * 0.8}" cy="${h * 0.2}" r="${Math.min(w, h) * 0.13}" fill="${t.danger}" stroke="${t.raised}" stroke-width="${Math.min(w, h) * 0.04}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${frame(style, w, h, t, radius)}<g transform="translate(${gx.toFixed(2)} ${gy.toFixed(2)}) scale(${s.toFixed(4)})">${glyph(ink, hi)}</g>${dot}</svg>`;
};

// Banlist badges keep their meaning (1 / 2 / forbidden) in the theme's danger colour.
const banBadge = (label, t, size) => {
  const c = size / 2;
  const body =
    label === 'x'
      ? `<circle cx="${c}" cy="${c}" r="${c * 0.82}" fill="${t.surface}" stroke="${t.danger}" stroke-width="${size * 0.1}"/><path d="M${c * 0.45} ${c * 0.45}L${c * 1.55} ${c * 1.55}" stroke="${t.danger}" stroke-width="${size * 0.1}"/>`
      : `<circle cx="${c}" cy="${c}" r="${c * 0.88}" fill="${t.danger}" stroke="${t.surface}" stroke-width="${size * 0.06}"/><text x="${c}" y="${c * 1.04}" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="${size * 0.62}" fill="#ffffff">${label}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">${body}</svg>`;
};


export const iconCss = (t, radius, style = 'tile') => {
  const line = (d, color) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
  const square = (glyph) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">${frame(style, 25, 25, t, Math.min(radius, 8))}${glyph}</svg>`;
  const exit = square(line('M8.5 8.5l8 8M16.5 8.5l-8 8', t.danger));
  const minimize = square(line('M8 13h9', t.text));
  const expand = square(line('M8.5 8.5h8v8h-8z', t.text));
  const icon = (name, w, h, opts) => framedIcon(GLYPHS[name], w, h, t, radius, style, opts);
  const points = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" r="104" fill="${t.surface}" fill-opacity="0.85" stroke="${t.accent}" stroke-width="16"/><circle cx="120" cy="120" r="84" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="4"/></svg>`;
  const close = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.9 9.9"><circle cx="4.95" cy="4.95" r="4.7" fill="${t.raised}" stroke="${t.border}" stroke-width="0.5"/><path d="M3.2 3.2l3.5 3.5M6.7 3.2l-3.5 3.5" stroke="${t.text}" stroke-width="0.9" stroke-linecap="round"/></svg>`;
  const check = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><path d="M3.2 7.4l2.4 2.4 5.2-5.6" fill="none" stroke="${t.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const radio = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><circle cx="7" cy="7" r="3" fill="${t.accent}"/></svg>`;
  const arrow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 12"><path d="M6 2l6 7 6-7" fill="none" stroke="${t.muted}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const menuRow = (fill, line) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 813 122" preserveAspectRatio="none"><rect width="813" height="122" fill="${fill}"/><rect y="116" width="813" height="6" fill="${line}"/></svg>`;
  const overPanel = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 634 574"><rect x="3" y="3" width="628" height="568" rx="${Math.min(radius * 3, 40)}" fill="${t.surface}" fill-opacity="0.62" stroke="${t.border}" stroke-width="3"/></svg>`;
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
    [img('online_btn'), icon('online', 40, 39)],
    [img('chat_btn'), icon('chat', 40, 34.14)],
    [img('private_btn'), icon('private', 40.03, 35.75)],
    [img('private_btn_anim'), icon('private', 40.03, 35.73, { badge: true })],
    [img('tools_btn'), icon('tools', 35.9, 45)],
    [img('sort_btn'), icon('sort', 55.8, 55.82)],
    [img('info_btn'), icon('info', 25.01, 25.01)],
    [img('locked_btn'), icon('locked', 70.58, 70.64)],
    [img('unlocked_btn'), icon('unlocked', 70.58, 70.64)],
    [img('points.svg'), points],
    [img('limited.svg'), banBadge('1', t, 244)],
    [img('semi_limited.svg'), banBadge('2', t, 120)],
    [img('forbidden.svg'), banBadge('x', t, 244)],
    ['html #content .checkbox img.check', check],
    ['html #content .radiobutton img.check', radio],
    ['html #content .combobox .combobox_arrow img', arrow],
  ];
  const states = ['ok_btn', 'yes_btn', 'no_btn', 'cancel_btn', 'exit_btn', 'minimize_btn', 'minimize2_btn', 'expand_btn', 'close_btn', 'online_btn', 'chat_btn', 'private_btn', 'tools_btn', 'sort_btn', 'info_btn', 'locked_btn', 'unlocked_btn'];
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
    const req = fetch(`https://images.duelingbook.com/svg/${name}.svg`)
      .then((r) => (r.ok ? r.text() : null))
      .catch(() => null)
      .then((text) => {
        if (text === null) fieldCache.delete(name); // try again next time
        return text;
      });
    fieldCache.set(name, req);
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

// { css, missing }: missing counts files that could not be fetched this time.
export const fieldCss = async (t) => {
  const files = await Promise.all(FIELD_FILES.map(fetchField));
  const css = FIELD_FILES.map((name, i) => {
    if (!files[i]) return '';
    const sel = `html #content img[src*="/svg/${name}.svg"], html #content img[data-src*="/svg/${name}.svg"]`;
    return `${sel} { content: ${svgUrl(recolorField(files[i], t))} !important; }`;
  }).join('\n');
  return { css, missing: files.filter((f) => !f).length };
};
