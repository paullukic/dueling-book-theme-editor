// Signature skins: each preset's own motif on top of its colours. A skin is a
// backdrop (drawn on #dbte-skin-layer, a fixed layer behind the game) plus a
// few details on menu tiles, pop-ups and the playmat. All art is generated
// SVG in the current theme colours, so edited colours still match.
// Same rules as the area sheets: no layout changes, never card faces.

import { isHex, mix } from '../../lib/color.js';
import { FX_ID } from './scenes.js';
import { crystal } from './scenes/snow.js';

export const LAYER_ID = 'dbte-skin-layer';
export const MOTIF_ID = 'dbte-skin-motif';

const url = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const alpha = (hex, a) => `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}`;

const TILE = 'html body #main_menu .menu_btn .content';
const TILE_HOVER = 'html body #main_menu .menu_btn:hover .content';
const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
const dialogSel = (suffix = '') => DIALOGS.map((d) => `html body #content ${d}${suffix}`).join(', ');
const FIELD = 'html body #content img.field_zones, html body #content img.field_decks';

// ---------- motifs (tileable SVG) ----------

const motifs = {
  grain: (t) =>
    svg(160, 160, `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${parseInt(t.text.slice(1, 3), 16) / 255} 0 0 0 0 ${parseInt(t.text.slice(3, 5), 16) / 255} 0 0 0 0 ${parseInt(t.text.slice(5, 7), 16) / 255} 0 0 0 0.07 0"/></filter><rect width="160" height="160" filter="url(#n)"/>`),
  stars: (t, color = t.text, n = 26, size = 220) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = (i * 97) % size;
      const y = (i * 61 + (i % 3) * 37) % size;
      const r = i % 7 === 0 ? 1.6 : 0.8;
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${i % 5 === 0 ? 0.55 : 0.28}"/>`;
    }
    return svg(size, size, s);
  },
  // Xyz rank stars: four-point sparkles.
  rankStars: (t) => {
    const star = (x, y, r, o) => `<path d="M${x} ${y - r}L${x + r * 0.28} ${y - r * 0.28}L${x + r} ${y}L${x + r * 0.28} ${y + r * 0.28}L${x} ${y + r}L${x - r * 0.28} ${y + r * 0.28}L${x - r} ${y}L${x - r * 0.28} ${y - r * 0.28}Z" fill="${t.accent}" opacity="${o}"/>`;
    return svg(240, 240, star(40, 50, 9, 0.35) + star(170, 30, 5, 0.25) + star(120, 140, 12, 0.3) + star(210, 200, 6, 0.22) + star(30, 200, 4, 0.2));
  },
  hexArrows: (t) =>
    svg(84, 72, `<path d="M21 0h42l21 36-21 36H21L0 36z" fill="none" stroke="${t.accent}" stroke-opacity="0.13" stroke-width="1.2"/><path d="M36 30l6-6 6 6" fill="none" stroke="${t.accent2}" stroke-opacity="0.35" stroke-width="2" stroke-linecap="round"/>`),
  arcane: (t) => {
    let ticks = '';
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ticks += `<line x1="${300 + Math.cos(a) * 232}" y1="${300 + Math.sin(a) * 232}" x2="${300 + Math.cos(a) * 252}" y2="${300 + Math.sin(a) * 252}" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="2"/>`;
    }
    return svg(600, 600, `<g fill="none" stroke="${t.accent}" stroke-opacity="0.22"><circle cx="300" cy="300" r="260" stroke-width="2"/><circle cx="300" cy="300" r="222" stroke-width="1"/><circle cx="300" cy="300" r="120" stroke-width="1.5"/><path d="M300 40L525 430H75z" stroke-width="1.2"/><path d="M300 560L75 170h450z" stroke-width="1.2"/></g>${ticks}`);
  },
  chains: (t) =>
    svg(60, 60, `<g fill="none" stroke="${t.accent}" stroke-opacity="0.14" stroke-width="3"><rect x="6" y="18" width="30" height="16" rx="8" transform="rotate(-45 21 26)"/><rect x="26" y="38" width="30" height="16" rx="8" transform="rotate(-45 41 46)"/></g>`),
  swirl: (t) => {
    let d = 'M300 300';
    for (let i = 1; i < 120; i++) {
      const a = i * 0.18;
      const r = i * 2.3;
      d += `L${(300 + Math.cos(a) * r).toFixed(1)} ${(300 + Math.sin(a) * r).toFixed(1)}`;
    }
    return svg(600, 600, `<path d="${d}" fill="none" stroke="${t.accent}" stroke-opacity="0.16" stroke-width="2"/><path d="${d}" fill="none" stroke="${t.accent2}" stroke-opacity="0.1" stroke-width="2" transform="rotate(180 300 300)"/>`);
  },
  rings: (t) =>
    svg(200, 200, `<g fill="none" stroke="${t.accent}" stroke-width="1"><circle cx="100" cy="100" r="30" stroke-opacity="0.14"/><circle cx="100" cy="100" r="60" stroke-opacity="0.1"/><circle cx="100" cy="100" r="90" stroke-opacity="0.07"/></g>`),
  facets: (t) =>
    svg(120, 104, `<g fill="none" stroke="${t.accent}" stroke-opacity="0.12"><path d="M0 52L30 0l30 52L90 0l30 52M0 52l30 52 30-52 30 52 30-52"/></g><path d="M30 0l30 52H0z" fill="${t.accent}" fill-opacity="0.035"/>`),
  magicCircle: (t) => {
    const p = [];
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
      p.push(`${(300 + Math.cos(a) * 200).toFixed(1)} ${(300 + Math.sin(a) * 200).toFixed(1)}`);
    }
    return svg(600, 600, `<g fill="none" stroke="${t.accent}" stroke-opacity="0.18"><circle cx="300" cy="300" r="230" stroke-width="2"/><circle cx="300" cy="300" r="200"/><path d="M${p.join('L')}Z" stroke-width="1.5"/></g>`);
  },
  scales: (t) =>
    svg(40, 22, `<path d="M0 22a20 20 0 0 1 40 0M-20 11a20 20 0 0 1 40 0M20 11a20 20 0 0 1 40 0" fill="none" stroke="${t.accent}" stroke-opacity="0.12" stroke-width="1.2"/>`),
  petals: (t) =>
    svg(180, 180, `<g fill="${t.accent}"><path d="M30 40q10-14 20 0q-10 14-20 0z" fill-opacity="0.12" transform="rotate(25 40 40)"/><path d="M120 110q8-11 16 0q-8 11-16 0z" fill-opacity="0.09" transform="rotate(-30 128 110)"/><path d="M150 30q6-8 12 0q-6 8-12 0z" fill-opacity="0.08"/></g>`),
  slashes: (t) => svg(80, 80, `<path d="M0 80L80 0" stroke="${t.accent}" stroke-opacity="0.07" stroke-width="10"/>`),
  dots: (t, color = t.accent, o = 0.1) => svg(26, 26, `<circle cx="13" cy="13" r="1.6" fill="${color}" fill-opacity="${o}"/>`),
  diagonal: (t) => svg(12, 12, `<path d="M0 12L12 0" stroke="${t.text}" stroke-opacity="0.035"/>`),
  halftone: (t) => svg(8, 8, `<circle cx="4" cy="4" r="1.3" fill="${t.text}" fill-opacity="0.08"/>`),
  brush: (t, color) =>
    svg(240, 20, `<path d="M4 12q30-9 70-4t82 0q40-5 80 2q-38 7-80 4t-82 2q-40 3-70-4z" fill="${color}"/>`),
  feathers: (t) =>
    svg(120, 120, `<path d="M30 20q8 20 0 40q-8-20 0-40zM90 70q8 20 0 40q-8-20 0-40z" fill="${t.accent}" fill-opacity="0.05"/>`),
  corner: (color) =>
    svg(46, 46, `<g fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"><path d="M3 43V14q0-11 11-11h29"/><path d="M9 43V20q0-11 11-11h23" stroke-opacity="0.5"/><circle cx="14" cy="14" r="3" fill="${color}"/></g>`),
};

// ---------- building blocks ----------

// Splits a CSS background list at its top-level commas.
const splitLayers = (list) => {
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

// Artwork (SVG) goes on the motif layer, which the "Background pattern"
// switch can hide; glows (gradients) stay on the glow layer. Each is painted
// twice (the layer and its ::before), which roughly doubles its strength.
const layer = (backgrounds) => {
  const parts = splitLayers(backgrounds);
  const motif = parts.filter((p) => p.includes('url(')).join(', ');
  const glow = parts.filter((p) => !p.includes('url(')).join(', ');
  return [
    glow && `#${LAYER_ID}, #${LAYER_ID}::before { background: ${glow} !important; }`,
    motif && `#${MOTIF_ID}, #${MOTIF_ID}::before { background: ${motif} !important; }`,
  ]
    .filter(Boolean)
    .join('\n');
};
const tileHoverGlow = (color) => `${TILE_HOVER} { box-shadow: inset 0 0 0 1px ${color}, 0 0 18px -6px ${color} !important; }`;
const fieldGlow = (t, strength = 3) => `${FIELD} { filter: drop-shadow(0 0 ${strength}px ${alpha(t.self, 0.55)}) drop-shadow(0 0 ${strength}px ${alpha(t.opp, 0.45)}); }`;
const dialogCorners = (color) => `${dialogSel('::before')}, ${dialogSel('::after')} {
  content: ""; position: absolute; width: 46px; height: 46px; pointer-events: none; z-index: 1;
  background: ${url(motifs.corner(color))} no-repeat;
}
${dialogSel('::before')} { left: 8px; top: 8px; }
${dialogSel('::after')} { right: 8px; bottom: 8px; transform: rotate(180deg); }`;

// ---------- skins ----------

const SKINS = {
  obsidian: (t) => layer(`${url(motifs.diagonal(t))}, radial-gradient(ellipse at 70% 0%, ${alpha(t.accent, 0.08)}, transparent 60%)`) + tileHoverGlow(t.accent),
  midnight: (t) => layer(`${url(motifs.stars(t, t.accent2))}, radial-gradient(ellipse at 50% 120%, ${alpha(t.accent, 0.12)}, transparent 60%)`) + tileHoverGlow(t.accent),
  crimson: (t) => layer(`${url(motifs.slashes(t))}, radial-gradient(ellipse at 0% 100%, ${alpha(t.accent, 0.14)}, transparent 55%)`) + tileHoverGlow(t.accent),
  verdant: (t) => layer(`${url(motifs.dots(t))}, radial-gradient(ellipse at 100% 100%, ${alpha(t.accent2, 0.1)}, transparent 55%)`) + tileHoverGlow(t.accent),
  sakura: (t) => layer(`${url(motifs.petals(t))}, radial-gradient(ellipse at 20% 10%, ${alpha(t.accent, 0.12)}, transparent 55%)`) + tileHoverGlow(t.accent),
  oled: () => '',
  spell: (t) => layer(`${url(motifs.arcane(t))} center / min(90vh, 900px) no-repeat, radial-gradient(circle at 50% 50%, ${alpha(t.accent, 0.1)}, transparent 60%)`) + tileHoverGlow(t.accent),
  trap: (t) => layer(`${url(motifs.chains(t))}, radial-gradient(ellipse at 50% 100%, ${alpha(t.accent, 0.12)}, transparent 60%)`) + tileHoverGlow(t.accent),
  fusion: (t) => layer(`${url(motifs.swirl(t))} center / min(110vh, 1100px) no-repeat, radial-gradient(circle, ${alpha(t.accent2, 0.08)}, transparent 65%)`) + tileHoverGlow(t.accent),
  synchro: (t) => layer(`${url(motifs.rings(t))}, linear-gradient(180deg, ${alpha(t.accent2, 0.06)}, transparent 40%)`) + tileHoverGlow(t.accent2),
  xyz: (t) => layer(`${url(motifs.rankStars(t))}, radial-gradient(ellipse at 50% 50%, ${alpha(t.accent, 0.06)}, transparent 60%)`) + tileHoverGlow(t.accent) + fieldGlow(t, 2),
  link: (t) => layer(`radial-gradient(ellipse at 50% 0%, ${alpha(t.accent2, 0.1)}, transparent 55%)`) + tileHoverGlow(t.accent2) + fieldGlow(t, 2),
  'white-dragon': (t) => layer(`${url(motifs.facets(t))}, radial-gradient(ellipse at 50% -10%, ${alpha(t.accent2, 0.14)}, transparent 55%)`) + tileHoverGlow(t.accent),
  'dark-magic': (t) => layer(`${url(motifs.magicCircle(t))} center / min(90vh, 900px) no-repeat, ${url(motifs.stars(t, t.accent2, 18))}`) + tileHoverGlow(t.accent),
  'black-dragon': (t) => layer(`${url(motifs.scales(t))}, radial-gradient(ellipse at 50% 110%, ${alpha(t.accent, 0.16)}, transparent 55%)`) + tileHoverGlow(t.accent) + fieldGlow(t, 2),
  millennium: (t) => layer(`radial-gradient(ellipse at 50% 0%, ${alpha(t.accent, 0.12)}, transparent 55%)`) + tileHoverGlow(t.accent) + dialogCorners(t.accent),

  // ---------- hero skins ----------

  // Branded: brand sigils, embers rising from below, gold filigree, fire on the playmat.
  branded: (t) =>
    layer(`${url(motifs.grain(t))}, radial-gradient(ellipse at 50% 115%, ${alpha(t.accent, 0.32)}, ${alpha(t.accent, 0.08)} 35%, transparent 62%), radial-gradient(ellipse at 50% -20%, ${alpha(t.accent2, 0.1)}, transparent 50%)`) +
    `${TILE} { background-image: linear-gradient(to top, ${alpha(t.accent, 0.22)}, transparent 55%) !important; }
${TILE_HOVER} { box-shadow: inset 0 0 0 1px ${t.accent}, 0 0 22px -4px ${alpha(t.accent, 0.8)}, 0 8px 30px -10px ${alpha(t.accent2, 0.6)} !important; }
${dialogSel()} { background-image: radial-gradient(ellipse at 50% 120%, ${alpha(t.accent, 0.18)}, transparent 60%) !important; }` +
    dialogCorners(t.accent2) +
    fieldGlow(t, 4),

  // Artmage: canvas grain, paint splashes, brush strokes under menu labels, gilded frames.
  artmage: (t) =>
    layer(`${url(motifs.grain(t))}, radial-gradient(ellipse 34% 30% at 10% 16%, ${alpha(t.accent, 0.42)}, transparent 70%), radial-gradient(ellipse 38% 34% at 90% 84%, ${alpha(t.opp, 0.36)}, transparent 70%), radial-gradient(ellipse 16% 14% at 80% 12%, ${alpha(t.accent2, 0.3)}, transparent 70%), radial-gradient(ellipse 20% 16% at 20% 90%, ${alpha(t.accent2, 0.22)}, transparent 70%), radial-gradient(ellipse 22% 18% at 55% 50%, ${alpha(t.accent, 0.12)}, transparent 70%)`) +
    `${TILE} { background-image: ${url(motifs.brush(t, alpha(t.accent, 0.35)))}, ${url(motifs.grain(t))} !important; background-repeat: no-repeat, repeat !important; background-position: 50% 88%, 0 0 !important; background-size: 82% 14px, auto !important; }
${TILE_HOVER} { box-shadow: inset 0 0 0 1px ${t.accent2}, 0 0 18px -6px ${t.accent} !important; }
${dialogSel()} { background-image: ${url(motifs.grain(t))} !important; box-shadow: 0 0 0 1px ${t.border}, inset 0 0 0 3px ${alpha(t.accent2, 0.85)}, inset 0 0 0 7px ${t.surface}, inset 0 0 0 8px ${alpha(t.accent2, 0.45)}, 0 24px 60px -20px var(--dbt-shade-strong) !important; }` +
    fieldGlow(t, 2),

  // Elemental HERO: the Skyscraper city at night, comic halftone, a heroic glint.
  hero: (t) =>
    layer(`${url(motifs.stars(t, t.text, 30))}, linear-gradient(180deg, ${mix(t.bg, t.opp, 0.18)} 0%, ${t.bg} 55%, ${mix(t.bg, t.accent2, 0.1)} 100%)`) +
    `${TILE} { background-image: ${url(motifs.halftone(t))} !important; }
${TILE_HOVER} { background-image: linear-gradient(115deg, transparent 30%, ${alpha(t.text, 0.16)} 45%, transparent 60%), ${url(motifs.halftone(t))} !important; box-shadow: inset 0 0 0 2px ${t.accent}, 4px 4px 0 ${t.accent2} !important; }
${dialogSel()} { box-shadow: 0 0 0 3px ${t.text}, 8px 8px 0 ${t.accent2}, 0 24px 60px -20px var(--dbt-shade-strong) !important; background-image: ${url(motifs.halftone(t))} !important; }` +
    fieldGlow(t, 3),

  // Pendulum: the split frame (monster colour above, spell green below) and two scale pillars.
  pendulum: (t) =>
    layer(`linear-gradient(180deg, ${alpha(t.self, 0.3)} 0%, ${alpha(t.self, 0.08)} 40%, ${alpha(t.accent, 0.08)} 60%, ${alpha(t.accent, 0.3)} 100%), linear-gradient(180deg, transparent 49.6%, ${alpha(t.text, 0.08)} 50%, transparent 50.4%)`) +
    `${TILE} { background-image: linear-gradient(180deg, ${alpha(t.self, 0.14)} 0%, transparent 50%, ${alpha(t.accent, 0.14)} 100%) !important; }
${TILE_HOVER} { box-shadow: inset 0 0 0 1px ${t.accent}, 0 0 18px -6px ${t.accent} !important; }
${dialogSel()} { background-image: linear-gradient(180deg, ${alpha(t.self, 0.16)} 0%, transparent 45%, transparent 55%, ${alpha(t.accent, 0.16)} 100%) !important; }` +
    fieldGlow(t, 3),

  // Divine Beasts: Ra gold, Obelisk blue, Slifer red; glyph walls and a sunlit sky.
  // Light: aged paper grain with a warm vignette and inked corners on pop-ups.
  parchment: (t) =>
    layer(`${url(motifs.grain(t))}, radial-gradient(ellipse at 50% 0%, ${alpha('#ffffff', 0.45)}, transparent 55%), radial-gradient(ellipse at 50% 40%, transparent 60%, ${alpha(t.border, 0.18)} 100%)`) +
    tileHoverGlow(t.accent) +
    dialogCorners(t.accent),

  // Light: brushed silver plates with a diagonal blade sheen.
  'duel-disk': (t) =>
    layer(`repeating-linear-gradient(90deg, ${alpha(t.text, 0.025)} 0 1px, transparent 1px 3px), linear-gradient(115deg, transparent 35%, ${alpha('#ffffff', 0.5)} 48%, transparent 60%), ${url(motifs.hexArrows(t))}`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 2),

  graphite: (t) => layer(`${url(motifs.grain(t))}, radial-gradient(ellipse at 80% 0%, ${alpha(t.accent, 0.1)}, transparent 55%)`) + tileHoverGlow(t.accent),

  // Snow (light): frost. Fine ice crystals on the page, frosted-glass tiles and crystals in the pop-up corners.
  snow: (t) => {
    const frost = svg(560, 460, `<g fill="none" stroke="${t.accent}" stroke-opacity="0.07" stroke-width="1.2" stroke-linecap="round">${crystal(90, 110, 18)}${crystal(400, 70, 9)}${crystal(300, 290, 13)}${crystal(500, 400, 7)}${crystal(150, 390, 6)}</g>`);
    const corner = svg(56, 56, `<g fill="none" stroke="${t.accent}" stroke-opacity="0.4" stroke-width="1.6" stroke-linecap="round">${crystal(22, 22, 18)}</g>`);
    return (
      layer(`${url(frost)}, linear-gradient(180deg, ${alpha('#ffffff', 0.65)}, transparent 45%), radial-gradient(ellipse at 50% 120%, ${alpha(t.accent2, 0.08)}, transparent 60%)`) +
      `${TILE} { background-image: linear-gradient(180deg, ${alpha('#ffffff', 0.9)}, transparent 60%), radial-gradient(ellipse at 100% 0%, ${alpha(t.accent2, 0.1)}, transparent 55%) !important; }
${TILE_HOVER} { box-shadow: inset 0 0 0 1px ${alpha(t.accent, 0.55)}, inset 3px 0 0 ${t.accent}, 0 12px 24px -12px ${alpha(t.accent, 0.45)} !important; }
${dialogSel()} { background-image: linear-gradient(180deg, ${alpha(t.accent2, 0.06)}, transparent 35%) !important; }
${dialogSel('::before')}, ${dialogSel('::after')} { content: ""; position: absolute; width: 56px; height: 56px; pointer-events: none; z-index: 1; background: ${url(corner)} no-repeat; }
${dialogSel('::before')} { left: 8px; top: 8px; }
${dialogSel('::after')} { right: 8px; bottom: 8px; transform: rotate(180deg); }`
    );
  },

  // Ritual: a candle-lit summoning circle under a cobalt sky.
  ritual: (t) =>
    layer(`radial-gradient(circle at 50% 55%, ${alpha(t.accent2, 0.1)}, transparent 45%)`) +
    tileHoverGlow(t.accent) +
    dialogCorners(t.accent2) +
    fieldGlow(t, 3),

  // Shadow Realm: drifting fog banks in two sickly colours.
  'shadow-realm': (t) =>
    layer(`radial-gradient(ellipse 60% 40% at 15% 80%, ${alpha(t.accent, 0.16)}, transparent 70%), radial-gradient(ellipse 50% 35% at 85% 25%, ${alpha(t.accent2, 0.18)}, transparent 70%), radial-gradient(ellipse 70% 30% at 50% 100%, ${alpha(t.accent2, 0.14)}, transparent 70%), ${url(motifs.grain(t))}`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 4),

  // Sky Striker: launch-bay HUD grid, red and cyan sweep lines.
  'sky-striker': (t) =>
    layer(`radial-gradient(ellipse at 70% 100%, ${alpha(t.accent2, 0.1)}, transparent 60%)`) +
    `${TILE} { background-image: linear-gradient(90deg, ${alpha(t.accent, 0.22)}, transparent 40%) !important; }
${TILE_HOVER} { box-shadow: inset 3px 0 0 ${t.accent}, inset 0 0 0 1px ${t.accent2}, 0 0 18px -6px ${t.accent2} !important; }` +
    dialogCorners(t.accent2) +
    fieldGlow(t, 3),

  // Snake-Eye: ember scales glowing up from below.
  'snake-eye': (t) =>
    layer(`radial-gradient(ellipse at 50% 115%, ${alpha(t.accent, 0.3)}, transparent 55%), radial-gradient(ellipse at 50% -10%, ${alpha(t.accent2, 0.08)}, transparent 50%)`) +
    `${TILE} { background-image: linear-gradient(to top, ${alpha(t.accent, 0.24)}, transparent 60%) !important; }
${TILE_HOVER} { box-shadow: inset 0 0 0 1px ${t.accent}, 0 0 24px -4px ${alpha(t.accent, 0.85)} !important; }` +
    fieldGlow(t, 4),

  // Labrynth: gothic arches and stained glass in wine and silver.
  labrynth: (t) =>
    layer(`${url(motifs.diagonal(t))}, radial-gradient(ellipse 40% 60% at 50% 0%, ${alpha(t.accent2, 0.14)}, transparent 70%), radial-gradient(ellipse at 50% 110%, ${alpha(t.accent, 0.18)}, transparent 55%)`) +
    tileHoverGlow(t.accent2) +
    dialogCorners(t.accent2) +
    fieldGlow(t, 2),

  // Blackwing: night sky, faint feathers; the scene adds moon, wings and falling feathers.
  blackwing: (t) =>
    layer(`${url(motifs.feathers(t))}, ${url(motifs.stars(t, t.text, 24))}, radial-gradient(ellipse at 80% 10%, ${alpha(t.text, 0.08)}, transparent 45%), radial-gradient(ellipse at 50% 120%, ${alpha(t.accent, 0.16)}, transparent 60%)`) +
    tileHoverGlow(t.accent) +
    dialogCorners(t.accent) +
    fieldGlow(t, 3),

  // Lightsworn (light): warm dawn haze; the scene adds the sunburst and motes.
  lightsworn: (t) =>
    layer(`${url(motifs.grain(t))}, radial-gradient(ellipse at 50% -10%, ${alpha('#ffffff', 0.7)}, transparent 60%), radial-gradient(ellipse at 50% 120%, ${alpha(t.accent, 0.12)}, transparent 60%)`) +
    tileHoverGlow(t.accent) +
    dialogCorners(t.accent) +
    fieldGlow(t, 2),

  // Frog: still pond water; the scene adds pads, ripples, reeds and fireflies.
  frog: (t) =>
    layer(`${url(motifs.dots(t, t.accent, 0.06))}, radial-gradient(ellipse at 50% 110%, ${alpha(t.opp, 0.16)}, transparent 60%), radial-gradient(ellipse at 50% -10%, ${alpha(t.accent, 0.08)}, transparent 50%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 3),

  // Angelechy: a gilded board glow; the scene draws the board, pieces and feathers.
  angelechy: (t) =>
    layer(`${url(motifs.grain(t))}, radial-gradient(ellipse at 70% 30%, ${alpha(t.accent, 0.12)}, transparent 55%), radial-gradient(ellipse at 50% 120%, ${alpha(t.accent2, 0.12)}, transparent 60%)`) +
    tileHoverGlow(t.accent) +
    dialogCorners(t.accent) +
    fieldGlow(t, 2),

  // Mitsurugi: moonlit night haze; the scene draws the shrine.
  mitsurugi: (t) =>
    layer(`${url(motifs.grain(t))}, radial-gradient(ellipse at 75% 20%, ${alpha(t.accent2, 0.14)}, transparent 50%), radial-gradient(ellipse at 20% 110%, ${alpha(t.accent, 0.16)}, transparent 60%)`) +
    tileHoverGlow(t.accent) +
    dialogCorners(t.accent2) +
    fieldGlow(t, 3),

  // Gladiator Beast: sun-baked arena haze; the scene draws the colosseum.
  gladiator: (t) =>
    layer(`${url(motifs.grain(t))}, radial-gradient(ellipse at 50% 120%, ${alpha(t.accent, 0.22)}, transparent 60%), radial-gradient(ellipse at 50% -10%, ${alpha(t.warning, 0.1)}, transparent 50%)`) +
    `${TILE} { background-image: linear-gradient(to top, ${alpha(t.accent, 0.18)}, transparent 55%) !important; }
${TILE_HOVER} { box-shadow: inset 0 0 0 1px ${t.accent}, 0 0 20px -6px ${t.accent} !important; }` +
    dialogCorners(t.accent) +
    fieldGlow(t, 3),

  // Toon: halftone pop over ink navy; the scene draws Toon World.
  toon: (t) =>
    layer(`${url(motifs.halftone(t))}, radial-gradient(ellipse at 75% 20%, ${alpha(t.accent, 0.14)}, transparent 55%), radial-gradient(ellipse at 20% 110%, ${alpha(t.accent2, 0.12)}, transparent 60%)`) +
    `${TILE_HOVER} { box-shadow: inset 0 0 0 2px ${t.text}, 4px 4px 0 ${t.accent2} !important; }` +
    fieldGlow(t, 2),

  // Kewl Tune: club lighting; the scene draws the stage.
  'kewl-tune': (t) =>
    layer(`radial-gradient(ellipse at 80% 10%, ${alpha(t.accent, 0.18)}, transparent 50%), radial-gradient(ellipse at 10% 100%, ${alpha(t.accent2, 0.14)}, transparent 55%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 3),

  // Cyber Dragon: cold chrome sheen; the scene draws the serpent.
  'cyber-dragon': (t) =>
    layer(`linear-gradient(115deg, transparent 30%, ${alpha(t.text, 0.04)} 45%, transparent 60%), radial-gradient(ellipse at 75% 30%, ${alpha(t.accent, 0.12)}, transparent 55%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 2),

  // Constellar: violet nebula and crosshair stars; the scene draws the star knight.
  constellar: (t) =>
    layer(`${url(svg(260, 260, `<g fill="none" stroke="${t.accent}" stroke-opacity="0.22" stroke-width="0.8"><circle cx="60" cy="70" r="5"/><path d="M60 60v20M50 70h20"/><circle cx="190" cy="190" r="3.5"/><path d="M190 183v14M183 190h14"/></g><path d="M60 70L140 40L190 190" fill="none" stroke="${t.accent}" stroke-opacity="0.07"/>`))}, ${url(motifs.stars(t, t.text, 22, 200))}, radial-gradient(ellipse 55% 45% at 78% 22%, ${alpha(t.self, 0.16)}, transparent 70%), radial-gradient(ellipse 50% 40% at 15% 90%, ${alpha(t.accent2, 0.07)}, transparent 70%)`) +
    tileHoverGlow(t.accent) +
    dialogCorners(t.accent2) +
    fieldGlow(t, 2),

  // Fire King: sacred fire glowing up from below, ash in the air.
  'fire-king': (t) =>
    layer(`${url(motifs.grain(t))}, radial-gradient(ellipse 70% 45% at 70% 110%, ${alpha(t.self, 0.3)}, transparent 70%), radial-gradient(ellipse 40% 30% at 80% 25%, ${alpha(t.accent, 0.12)}, transparent 70%), radial-gradient(ellipse at 0% 100%, ${alpha(t.accent2, 0.06)}, transparent 50%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 3),

  // Mermail: light falling from the surface into deep water; the scene adds Atlantis.
  mermail: (t) =>
    layer(`${url(svg(180, 180, `<g fill="none" stroke="${t.text}" stroke-opacity="0.08"><circle cx="40" cy="50" r="5"/><circle cx="52" cy="30" r="2.5"/><circle cx="140" cy="130" r="4"/><circle cx="130" cy="150" r="2"/></g>`))}, linear-gradient(180deg, ${alpha(t.accent, 0.14)}, transparent 45%), radial-gradient(ellipse 60% 40% at 60% -5%, ${alpha('#ffffff', 0.08)}, transparent 70%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 2),

  divine: (t) =>
    layer(`radial-gradient(ellipse at 50% -10%, ${alpha(t.accent, 0.26)}, transparent 45%), radial-gradient(ellipse at 0% 100%, ${alpha(t.self, 0.18)}, transparent 45%), radial-gradient(ellipse at 100% 100%, ${alpha(t.opp, 0.18)}, transparent 45%)`) +
    `${TILE} { background-image: linear-gradient(to top, ${alpha(t.accent, 0.16)}, transparent 50%) !important; box-shadow: inset 0 -2px 0 ${alpha(t.accent, 0.7)}, 0 10px 24px -14px var(--dbt-shade-strong) !important; }
${TILE_HOVER} { box-shadow: inset 0 0 0 1px ${t.accent}, 0 0 22px -6px ${t.accent} !important; }
${dialogSel()} { box-shadow: 0 0 0 1px ${t.accent}, 0 0 0 3px ${t.surface}, 0 0 0 4px ${alpha(t.self, 0.8)}, 0 0 0 6px ${t.surface}, 0 0 0 7px ${alpha(t.opp, 0.8)}, 0 24px 60px -20px var(--dbt-shade-strong) !important; }` +
    dialogCorners(t.accent) +
    fieldGlow(t, 3),

  // Starlight: the foil's hairline grain and a faint prism sheen; the scene and
  // shader draw the full prismatic foil.
  starlight: (t) => starlightSkin(t, 1),
  'starlight-light': (t) => starlightSkin(t, 0.55),
  // Dracotail: plum eclipse night with gold and jade; the scene draws the astrolabe and tail.
  dracotail: (t) =>
    layer(`${url(motifs.stars(t, t.accent, 24))}, radial-gradient(ellipse at 78% 40%, ${alpha(t.accent, 0.14)}, transparent 50%), radial-gradient(ellipse at 10% 100%, ${alpha(t.accent2, 0.12)}, transparent 55%)`) +
    tileHoverGlow(t.accent) +
    dialogCorners(t.accent) +
    fieldGlow(t, 2),

  // Power Patron: a cold glow under the eye; the scene draws the sigil, blades and prism road.
  'power-patron': (t) =>
    layer(`radial-gradient(ellipse at 78% 30%, ${alpha(t.accent, 0.14)}, transparent 50%), radial-gradient(ellipse at 85% 110%, ${alpha(t.accent2, 0.1)}, transparent 55%), radial-gradient(ellipse at 0% 0%, ${alpha(t.border, 0.3)}, transparent 50%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 2),

  // Ryzeal: ignition heat behind the engine; the scene draws the stator, rotor and coils.
  ryzeal: (t) =>
    layer(`radial-gradient(ellipse at 78% 47%, ${alpha(t.accent, 0.2)}, transparent 50%), radial-gradient(ellipse at 78% 47%, ${alpha(t.accent2, 0.1)}, transparent 30%), radial-gradient(ellipse at 0% 100%, ${alpha(t.accent, 0.08)}, transparent 45%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 3),

  // Attack on Titan: coursed wall stone, steam heat behind the wall; the scene draws Wall Maria.
  'attack-on-titan': (t) =>
    layer(`${url(svg(120, 60, `<g fill="none" stroke="${t.text}" stroke-opacity="0.045" stroke-width="1.2"><path d="M0 0.6H120M0 30.6H120M40 0.6V30.6M100 0.6V30.6M10 30.6V60M70 30.6V60"/></g>`))}, radial-gradient(ellipse 60% 45% at 78% 40%, ${alpha(t.accent2, 0.16)}, transparent 70%), linear-gradient(180deg, ${alpha(t.muted, 0.06)}, transparent 45%), radial-gradient(ellipse at 10% 110%, ${alpha(t.accent, 0.1)}, transparent 55%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 2),

  // Demon Slayer: seigaiha water waves, a crimson night; the scene draws the breathing forms.
  'demon-slayer': (t) =>
    layer(`${url(svg(48, 24, `<g fill="none" stroke="${t.accent2}" stroke-opacity="0.07" stroke-width="1"><path d="M0 24a12 12 0 0 1 24 0a12 12 0 0 1 24 0M4 24a8 8 0 0 1 16 0M28 24a8 8 0 0 1 16 0M-12 12a12 12 0 0 1 24 0M12 12a12 12 0 0 1 24 0M36 12a12 12 0 0 1 24 0"/></g>`))}, radial-gradient(ellipse 55% 50% at 80% 30%, ${alpha(t.accent, 0.14)}, transparent 70%), radial-gradient(ellipse at 15% 110%, ${alpha(t.accent2, 0.14)}, transparent 55%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 2),

  // Jujutsu Kaisen: ink speckle and a cursed-energy night; the scene draws the hollow purple.
  'jujutsu-kaisen': (t) =>
    layer(`${url(svg(180, 180, `<g fill="${t.text}" fill-opacity="0.05"><circle cx="30" cy="40" r="3"/><circle cx="38" cy="47" r="1.2"/><circle cx="140" cy="120" r="2.4"/><circle cx="131" cy="128" r="1"/><circle cx="96" cy="160" r="1.6"/></g>`))}, radial-gradient(ellipse 50% 50% at 78% 38%, ${alpha(t.accent, 0.18)}, transparent 70%), radial-gradient(ellipse at 0% 100%, ${alpha(t.opp, 0.1)}, transparent 50%), radial-gradient(ellipse at 100% 100%, ${alpha(t.accent2, 0.08)}, transparent 50%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 3),
  // One Piece: dusk on the Grand Line, a faint sea-chart grid; the scene draws the ship and sea.
  'one-piece': (t) =>
    layer(`${url(svg(240, 240, `<g fill="none" stroke="${t.text}" stroke-opacity="0.045"><path d="M0 120H240M120 0V240"/></g><path d="M30 200Q90 150 130 170T220 60" fill="none" stroke="${t.accent}" stroke-opacity="0.09" stroke-width="1.4" stroke-dasharray="5 6"/><path d="M214 54l10 10M224 54l-10 10" stroke="${t.accent2}" stroke-opacity="0.08" stroke-width="2"/>`))}, radial-gradient(ellipse 60% 40% at 78% 62%, ${alpha(t.accent, 0.16)}, transparent 70%), linear-gradient(180deg, transparent 55%, ${alpha(t.opp, 0.08)})`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 2),

  // Naruto: dusk over the leaf village, a faint spiral; the scene draws the village and the chakra sphere.
  naruto: (t) =>
    layer(`${url(svg(200, 200, `<path d="M100 100m0-3a3 3 0 1 1-3 3a7 7 0 0 1 7-7a11 11 0 0 1 11 11a15 15 0 0 1-15 15a19 19 0 0 1-19-19" fill="none" stroke="${t.accent}" stroke-opacity="0.07" stroke-width="1.6"/><path d="M30 40q8-10 16 0q-8 10-16 0z" fill="${t.success}" fill-opacity="0.06" transform="rotate(-30 38 40)"/>`))}, radial-gradient(ellipse 45% 40% at 80% 34%, ${alpha(t.accent2, 0.14)}, transparent 70%), radial-gradient(ellipse 80% 40% at 50% 110%, ${alpha(t.accent, 0.14)}, transparent 70%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 2),

  // Dragon Ball: a golden ki glow and faint four-point stars; the scene draws the orbs and the wasteland.
  'dragon-ball': (t) =>
    layer(`${url(svg(260, 260, `<g fill="${t.accent2}"><path d="M50 40l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill-opacity="0.16"/><path d="M190 150l1.5 4.5 4.5 1.5-4.5 1.5-1.5 4.5-1.5-4.5-4.5-1.5 4.5-1.5z" fill-opacity="0.12"/></g><circle cx="120" cy="220" r="1.2" fill="${t.text}" fill-opacity="0.2"/>`))}, radial-gradient(ellipse 45% 50% at 78% 48%, ${alpha(t.accent2, 0.16)}, transparent 70%), radial-gradient(ellipse 70% 40% at 20% 110%, ${alpha(t.accent, 0.12)}, transparent 70%)`) +
    tileHoverGlow(t.accent2) +
    fieldGlow(t, 3),

  // Death Note: the notebook's ruled lines, cold light from above, a red ember low; the scene draws the falling notebook.
  'death-note': (t) =>
    layer(`${url(svg(64, 28, `<path d="M0 27.5H64" stroke="${t.accent2}" stroke-opacity="0.05"/>`))}, radial-gradient(ellipse 50% 60% at 86% 0%, ${alpha(t.accent2, 0.14)}, transparent 70%), radial-gradient(ellipse 60% 40% at 72% 100%, ${alpha(t.accent, 0.09)}, transparent 70%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 2),

  // Fullmetal Alchemist: a faint chalk transmutation circle (hexagram and square), the Gate's pale glow and alchemy blue; the scene draws the Gate of Truth.
  'fullmetal-alchemist': (t) =>
    layer(`${url(svg(600, 600, `<g fill="none" stroke="${t.text}" stroke-opacity="0.12"><circle cx="300" cy="300" r="290" stroke-width="2"/><circle cx="300" cy="300" r="250"/><circle cx="300" cy="300" r="90"/><path d="M300 60L508 420H92ZM300 540L92 180H508ZM172 172H428V428H172Z" stroke-width="1.5"/></g>`))} right -8% bottom -14% / min(80vh, 760px) no-repeat, radial-gradient(ellipse 40% 55% at 80% 42%, ${alpha(t.text, 0.08)}, transparent 70%), radial-gradient(ellipse 50% 40% at 78% 90%, ${alpha(t.accent2, 0.12)}, transparent 70%), radial-gradient(ellipse 60% 40% at 0% 100%, ${alpha(t.accent, 0.1)}, transparent 70%)`) +
    tileHoverGlow(t.accent2) +
    fieldGlow(t, 2),

  // Solo Leveling: System scanlines, the Gate's blue glare and shadow violet below; the scene draws the Gate and the shadow army.
  'solo-leveling': (t) =>
    layer(`${url(svg(6, 6, `<path d="M0 .5H6" stroke="${t.accent}" stroke-opacity="0.028"/>`))}, radial-gradient(ellipse 45% 50% at 80% 20%, ${alpha(t.accent, 0.18)}, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 105%, ${alpha(t.accent2, 0.16)}, transparent 70%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 3),
};

// Starlight Rare foil, dark or light (`k` scales the sheen).
function starlightSkin(t, k) {
  const prism = [t.danger, t.warning, t.success, t.accent, t.link, t.accent2].map((c, i) => `${alpha(c, 0.07 * k)} ${30 + i * 8}%`).join(', ');
  return (
    layer(`${url(svg(6, 6, `<path d="M0 .5H6" stroke="${t.text}" stroke-opacity="${n2(0.035 * k)}"/>`))}, linear-gradient(112deg, transparent 22%, ${prism}, transparent 78%), radial-gradient(ellipse at 80% 0%, ${alpha(t.accent2, 0.12 * k)}, transparent 55%), radial-gradient(ellipse at 10% 110%, ${alpha(t.accent, 0.1 * k)}, transparent 55%)`) +
    tileHoverGlow(t.accent) +
    fieldGlow(t, 2)
  );
}
const n2 = (v) => Math.round(v * 1000) / 1000;

export const SKIN_IDS = Object.keys(SKINS);

// A CSS filter that turns grey-ish art into shades of `hex`: sepia gives a
// known orange hue (about 38deg), which is then rotated onto the accent's.
const hueOf = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  if (!d) return 0;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};
const tintFilter = (hex) => `grayscale(1) sepia(1) saturate(2.6) hue-rotate(${Math.round(hueOf(hex) - 38)}deg)`;

// Just the backdrop of a preset's skin (motif over glow) as a CSS background
// list, for previews.
export const skinBackdrop = (presetId, tokens) => {
  const make = SKINS[presetId];
  if (!make || !Object.values(tokens || {}).every(isHex)) return '';
  const css = make(tokens);
  const pick = (id) => {
    const m = new RegExp(`#${id}, #${id}::before \\{ background: ([^}]*) !important; \\}`).exec(css);
    return m ? m[1] : '';
  };
  return [pick(MOTIF_ID), pick(LAYER_ID)].filter(Boolean).join(', ');
};

// Which "What to restyle" area each detail belongs to: a switched-off area
// gets none of the skin either.
const AREA_OF = [
  ['menu', (sel) => sel.includes('#main_menu')],
  ['dialogs', (sel) => DIALOGS.some((d) => sel.includes(`#content ${d}`))],
  ['field', (sel) => sel.includes('img.field_')],
  ['lobby', (sel) => sel.includes('#duel_room')],
  ['deck', (sel) => sel.includes('#deck_constructor')],
  ['duel', (sel) => sel.includes('#duel ') || sel.includes('#duel.') || sel.includes('#duel:')],
  ['chat', (sel) => sel.includes('#chats')],
  ['scrollbars', (sel) => sel.includes('scrollbar')],
];

// Data URIs are percent-encoded, so every brace here is CSS structure.
// Splits CSS into top-level blocks ("selector { ... }" or "@media ... { ... }"),
// tracking brace depth so nested at-rules stay whole.
const topBlocks = (css) => {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) {
      out.push(css.slice(start, i + 1));
      start = i + 1;
    }
  }
  if (css.slice(start).trim()) out.push(css.slice(start));
  return out;
};

const ruleWanted = (sel, areas) => AREA_OF.every(([id, test]) => areas[id] !== false || !test(sel));

// Drops the rules that belong to switched-off areas; inside @media/@supports
// blocks it filters the inner rules and drops the block if nothing is left.
export const keepAreas = (css, areas) =>
  topBlocks(css)
    .map((block) => {
      const open = block.indexOf('{');
      const head = block.slice(0, open);
      if (/^\s*@(media|supports)/.test(head)) {
        const inner = keepAreas(block.slice(open + 1, block.lastIndexOf('}')), areas);
        return inner.trim() ? `${head}{${inner}}` : '';
      }
      if (/^\s*@keyframes/.test(head)) return block;
      return ruleWanted(head, areas) ? block : '';
    })
    .join('');

// CSS for the preset's skin in the given colours, or '' when it has none.
export const skinCss = (presetId, tokens, areas = {}, { motif = true } = {}) => {
  const make = SKINS[presetId];
  // Colours go straight into SVG and CSS: only well-formed hex values.
  if (!make || !Object.values(tokens || {}).every(isHex)) return '';
  const all = keepAreas(make(tokens), areas).trim();
  const own = motif ? all : all.split('\n').filter((line) => !line.includes(`#${MOTIF_ID}`)).join('\n');
  if (!own) return '';
  // The skin layer sits behind the game; DuelingBook's own cover over its
  // stage turns see-through so the motif shows.
  return `#${LAYER_ID}, #${MOTIF_ID}, #${FX_ID} { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-repeat: repeat; overflow: hidden; }
#${LAYER_ID}::before, #${MOTIF_ID}::before { content: ""; position: absolute; inset: 0; }
#${FX_ID} { perspective: 1400px; perspective-origin: 50% 45%; }
/* The stage is a little larger than the window so tilting never shows its edge.
   Planes sit at depth; each is scaled back to fill the window at rest. */
#${FX_ID} .dbtefx-stage { position: absolute; inset: -6%; transform-style: preserve-3d; will-change: transform; }
#${FX_ID} .dbtefx-stage > * { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
#${FX_ID} .dbtefx-far, #${FX_ID} .dbtefx-gl { transform: translateZ(-420px) scale(1.3); }
#${FX_ID} .dbtefx-canvas { transform: translateZ(120px) scale(0.914); }
#${FX_ID} .dbtefx-near { transform: translateZ(220px) scale(0.843); }
html #spiral { filter: ${tintFilter(tokens.accent)} brightness(0.8) !important; }
html #circuit_cover { background-color: rgba(var(--dbt-bg-rgb), var(--dbt-skin-cover, 0)) !important; }
html #circuit_board { opacity: calc(var(--dbt-backdrop) * 0.18) !important; }
html #greenlines { opacity: calc(var(--dbt-backdrop) * 0.25) !important; }
${own}`;
};
