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
  'black-dragon': 'claw',
  artmage: 'paint',
  hero: 'comic',
  pendulum: 'split',
  divine: 'gilded',
  xyz: 'rank',
  millennium: 'eye',
  link: 'hex',
  spell: 'rune',
  ritual: 'circle',
  'sky-striker': 'hud',
  'snake-eye': 'fang',
  labrynth: 'arch',
  blackwing: 'wing',
  lightsworn: 'halo',
  frog: 'pad',
  angelechy: 'board',
  mitsurugi: 'torii',
  gladiator: 'shield',
  toon: 'comic',
  'kewl-tune': 'vinyl',
  'cyber-dragon': 'bezel',
  constellar: 'starplate',
  'fire-king': 'banded',
  mermail: 'scaleplate',
  'dark-magic': 'circle',
  starlight: 'prism',
  'starlight-light': 'prism',
  dracotail: 'astrolabe',
  'power-patron': 'sigil',
  ryzeal: 'coil',
  'attack-on-titan': 'blade',
  'demon-slayer': 'haori',
  'jujutsu-kaisen': 'talisman',
  'one-piece': 'helm',
  naruto: 'scroll',
  'dragon-ball': 'orb',
};

const n2 = (v) => Math.round(v * 100) / 100;

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
      // A canvas tile with a brush stroke of paint along its foot.
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${r}" fill="${mix(t.raised, t.accent, 0.18)}" stroke="${t.accent2}" stroke-width="${sw}"/><path d="M${x + fw * 0.1} ${y + fh * 0.9}Q${x + fw * 0.35} ${y + fh * 0.8} ${x + fw * 0.6} ${y + fh * 0.88}T${x + fw * 0.92} ${y + fh * 0.84}" fill="none" stroke="${t.accent}" stroke-opacity="0.85" stroke-width="${sw * 1.6}" stroke-linecap="round"/>`;
    case 'comic':
      return `<rect x="${x + sw * 1.4}" y="${y + sw * 1.4}" width="${fw - sw * 1.4}" height="${fh - sw * 1.4}" rx="${Math.min(r, 4)}" fill="${t.accent2}"/><rect x="${x}" y="${y}" width="${fw - sw * 1.4}" height="${fh - sw * 1.4}" rx="${Math.min(r, 4)}" fill="${t.raised}" stroke="${t.text}" stroke-width="${sw * 1.1}"/>`;
    case 'split':
      return `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0.5" stop-color="${mix(t.raised, t.self, 0.35)}"/><stop offset="0.5" stop-color="${mix(t.raised, t.accent, 0.35)}"/></linearGradient></defs><rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${r}" fill="url(#s)" stroke="${t.border}" stroke-width="${sw}"/>`;
    case 'gilded':
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${Math.min(r, 3)}" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}"/><rect x="${x + sw * 2}" y="${y + sw * 2}" width="${fw - sw * 4}" height="${fh - sw * 4}" rx="1" fill="none" stroke="${t.accent}" stroke-opacity="0.45" stroke-width="${sw * 0.6}"/>`;
    case 'claw': {
      // Sharp plate with two corners clipped like scales.
      const c = Math.min(fw, fh) * 0.22;
      return `<path d="M${x + c} ${y}H${x + fw}V${y + fh - c}L${x + fw - c} ${y + fh}H${x}V${y + c}Z" fill="${mix(t.raised, t.accent, 0.3)}" stroke="${t.accent}" stroke-width="${sw}" stroke-linejoin="miter"/>`;
    }
    case 'rank': {
      // Black overlay-unit plate with a gold rank star in each corner.
      const d = Math.min(fw, fh) * 0.11;
      const star = (sx, sy) => `<circle cx="${sx}" cy="${sy}" r="${d * 0.55}" fill="${t.accent}"/>`;
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${Math.min(r, 2)}" fill="${mix(t.bg, t.raised, 0.5)}" stroke="${t.accent}" stroke-width="${sw}"/>${star(x + d * 1.4, y + d * 1.4)}${star(x + fw - d * 1.4, y + d * 1.4)}${star(x + d * 1.4, y + fh - d * 1.4)}${star(x + fw - d * 1.4, y + fh - d * 1.4)}`;
    }
    case 'eye': {
      // Gold plate with a pyramid notch rising from its top edge.
      const p = Math.min(fw, fh) * 0.16;
      return `<path d="M${x} ${y + p}H${cx - p}L${cx} ${y}L${cx + p} ${y + p}H${x + fw}V${y + fh}H${x}Z" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M${x + sw * 2} ${y + fh - sw * 2}H${x + fw - sw * 2}" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="${sw * 0.6}"/>`;
    }
    case 'rune':
      return `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}"/><circle cx="${cx}" cy="${cy}" r="${rr - sw * 2}" fill="none" stroke="${t.accent2}" stroke-opacity="0.55" stroke-width="${sw * 0.6}"/>`;
    case 'hud': {
      // Targeting brackets on a dark plate with a red tick.
      const k = Math.min(fw, fh) * 0.28;
      const corner = (px, py, dx, dy) => `M${px + dx * k} ${py}H${px}V${py + dy * k}`;
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" fill="${t.raised}" fill-opacity="0.9"/><path d="${corner(x, y, 1, 1)}${corner(x + fw, y, -1, 1)}${corner(x, y + fh, 1, -1)}${corner(x + fw, y + fh, -1, -1)}" fill="none" stroke="${t.accent2}" stroke-width="${sw * 1.2}"/><rect x="${x + fw * 0.42}" y="${y}" width="${fw * 0.16}" height="${sw * 1.2}" fill="${t.accent}"/>`;
    }
    case 'fang':
      // A shield tapering to a fang point, ember gradient.
      return `<defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.raised}"/><stop offset="1" stop-color="${mix(t.raised, t.accent, 0.5)}"/></linearGradient></defs><path d="M${x} ${y + r}Q${x} ${y} ${x + r} ${y}H${x + fw - r}Q${x + fw} ${y} ${x + fw} ${y + r}V${y + fh * 0.62}Q${x + fw} ${y + fh * 0.8} ${cx} ${y + fh}Q${x} ${y + fh * 0.8} ${x} ${y + fh * 0.62}Z" fill="url(#f)" stroke="${t.accent}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    case 'arch':
      // A gothic pointed arch with a silver inner line.
      return `<path d="M${x} ${y + fh}V${y + fh * 0.4}Q${x} ${y + fh * 0.05} ${cx} ${y}Q${x + fw} ${y + fh * 0.05} ${x + fw} ${y + fh * 0.4}V${y + fh}Z" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M${x + sw * 2.2} ${y + fh - sw}V${y + fh * 0.42}Q${x + sw * 2.2} ${y + fh * 0.12} ${cx} ${y + sw * 2.4}Q${x + fw - sw * 2.2} ${y + fh * 0.12} ${x + fw - sw * 2.2} ${y + fh * 0.42}V${y + fh - sw}" fill="none" stroke="${t.accent2}" stroke-opacity="0.55" stroke-width="${sw * 0.6}"/>`;
    case 'wing': {
      // A plate whose top edge is three overlapping feather scallops.
      const q = fw / 3;
      return `<path d="M${x} ${y + fh}V${y + fh * 0.3}Q${x + q * 0.5} ${y - fh * 0.05} ${x + q} ${y + fh * 0.22}Q${x + q * 1.5} ${y - fh * 0.08} ${x + q * 2} ${y + fh * 0.22}Q${x + q * 2.5} ${y - fh * 0.05} ${x + fw} ${y + fh * 0.3}V${y + fh}Z" fill="${mix(t.raised, t.accent, 0.12)}" stroke="${t.accent}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    }
    case 'halo': {
      // A disc ringed by short rays of light.
      let rays = '';
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI / 6) * i;
        rays += `<line x1="${n2(cx + Math.cos(a) * rr * 0.86)}" y1="${n2(cy + Math.sin(a) * rr * 0.86)}" x2="${n2(cx + Math.cos(a) * rr)}" y2="${n2(cy + Math.sin(a) * rr)}"/>`;
      }
      return `<circle cx="${cx}" cy="${cy}" r="${rr * 0.8}" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}"/><g stroke="${t.accent}" stroke-width="${sw * 0.8}" stroke-linecap="round">${rays}</g>`;
    }
    case 'pad': {
      // A lily pad: a disc with a wedge cut out.
      const [ax, ay] = [cx + rr * 0.95, cy - rr * 0.32];
      const [bx, by] = [cx + rr * 0.95, cy + rr * 0.1];
      return `<path d="M${cx} ${cy}L${n2(ax)} ${n2(ay)}A${rr} ${rr} 0 1 0 ${n2(bx)} ${n2(by)}Z" fill="${mix(t.raised, t.accent, 0.22)}" stroke="${t.accent}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    }
    case 'board': {
      // A plate with a chequered square in each corner.
      const q = Math.min(fw, fh) * 0.18;
      const sq = (sx, sy) => `<rect x="${n2(sx)}" y="${n2(sy)}" width="${n2(q)}" height="${n2(q)}" fill="${t.accent}" fill-opacity="0.7"/>`;
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${Math.min(r, 2)}" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}"/>${sq(x, y)}${sq(x + fw - q, y + fh - q)}${sq(x + fw - q, y)}${sq(x, y + fh - q)}`;
    }
    case 'torii': {
      // A plate under a vermilion torii lintel with upturned ends.
      const lh = fh * 0.14;
      return `<rect x="${n2(x + fw * 0.08)}" y="${n2(y + lh * 1.6)}" width="${n2(fw * 0.84)}" height="${n2(fh - lh * 1.6)}" rx="${Math.min(r, 3)}" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}"/><path d="M${x} ${n2(y + lh * 0.3)}Q${cx} ${n2(y - lh * 0.3)} ${x + fw} ${n2(y + lh * 0.3)}L${n2(x + fw * 0.95)} ${n2(y + lh * 1.2)}H${n2(x + fw * 0.05)}Z" fill="${t.accent}"/>`;
    }
    case 'shield': {
      // A round bronze shield with a raised rim and boss.
      return `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${mix(t.raised, t.accent, 0.25)}" stroke="${t.accent}" stroke-width="${sw * 1.4}"/><circle cx="${cx}" cy="${cy}" r="${n2(rr * 0.78)}" fill="none" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="${sw * 0.6}"/>`;
    }
    case 'starplate': {
      // Constellar: a silver plate with gold-chamfered corners and a crosshair star on top.
      const c = Math.min(fw, fh) * 0.2;
      const k = Math.min(fw, fh) * 0.13;
      return `<path d="M${n2(x + c)} ${y}H${n2(x + fw - c)}L${x + fw} ${n2(y + c)}V${n2(y + fh - c)}L${n2(x + fw - c)} ${y + fh}H${n2(x + c)}L${x} ${n2(y + fh - c)}V${n2(y + c)}Z" fill="${mix(t.raised, t.accent, 0.1)}" stroke="${t.accent}" stroke-width="${sw}" stroke-linejoin="miter"/><path d="M${x} ${n2(y + c)}L${n2(x + c)} ${y}M${n2(x + fw - c)} ${y}L${x + fw} ${n2(y + c)}M${x + fw} ${n2(y + fh - c)}L${n2(x + fw - c)} ${y + fh}M${n2(x + c)} ${y + fh}L${x} ${n2(y + fh - c)}" stroke="${t.accent2}" stroke-width="${n2(sw * 1.6)}"/><path d="M${cx} ${n2(y - k * 0.6)}L${n2(cx + k * 0.25)} ${n2(y - k * 0.1)}L${n2(cx + k)} ${y}L${n2(cx + k * 0.25)} ${n2(y + k * 0.1)}L${cx} ${n2(y + k * 0.6)}L${n2(cx - k * 0.25)} ${n2(y + k * 0.1)}L${n2(cx - k)} ${y}L${n2(cx - k * 0.25)} ${n2(y - k * 0.1)}Z" fill="${t.accent2}"/>`;
    }
    case 'banded': {
      // Fire King: crimson lacquer between black-and-gold armour bands, a turquoise gem.
      const b = fh * 0.16;
      const g = Math.min(fw, fh) * 0.08;
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${Math.min(r, 2)}" fill="${mix(t.raised, t.self, 0.3)}" stroke="${t.accent}" stroke-width="${sw}"/><g fill="${mix(t.bg, '#000000', 0.4)}"><rect x="${x}" y="${y}" width="${fw}" height="${n2(b)}"/><rect x="${x}" y="${n2(y + fh - b)}" width="${fw}" height="${n2(b)}"/></g><path d="M${x} ${n2(y + b)}H${x + fw}M${x} ${n2(y + fh - b)}H${x + fw}" stroke="${t.accent}" stroke-width="${n2(sw * 0.8)}"/><path d="M${cx} ${n2(y + b * 0.5 - g)}l${n2(g)} ${n2(g)}l${n2(-g)} ${n2(g)}l${n2(-g)} ${n2(-g)}Z" fill="${t.accent2}"/>`;
    }
    case 'scaleplate': {
      // Mermail: a rounded silver-blue plate, wave scroll along its foot, a red gem above.
      const w4 = fw / 4;
      let wave = `M${x} ${n2(y + fh * 0.84)}`;
      for (let i = 0; i < 4; i++) wave += `q${n2(w4 * 0.5)} ${n2(-fh * 0.14)} ${n2(w4)} 0`;
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${n2(Math.min(fw, fh) * 0.22)}" fill="${mix(t.raised, t.accent, 0.12)}" stroke="${mix(t.accent, '#ffffff', 0.3)}" stroke-width="${sw}"/><path d="${wave}" fill="none" stroke="${t.accent}" stroke-opacity="0.7" stroke-width="${n2(sw * 0.8)}"/><circle cx="${cx}" cy="${n2(y + sw * 0.4)}" r="${n2(Math.min(fw, fh) * 0.08)}" fill="${t.danger}" stroke="${t.accent2}" stroke-width="${n2(sw * 0.6)}"/>`;
    }
    case 'vinyl': {
      // A record label: groove rings and a centre hole.
      return `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${mix(t.bg, t.raised, 0.5)}" stroke="${t.accent}" stroke-width="${sw}"/><circle cx="${cx}" cy="${cy}" r="${n2(rr * 0.82)}" fill="none" stroke="${t.muted}" stroke-opacity="0.35" stroke-width="${sw * 0.4}"/><circle cx="${cx}" cy="${cy}" r="${n2(rr * 0.68)}" fill="none" stroke="${t.muted}" stroke-opacity="0.25" stroke-width="${sw * 0.4}"/>`;
    }
    case 'bezel': {
      // A riveted chrome bezel with a cyan core gem at the top.
      const g = Math.min(fw, fh) * 0.09;
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${Math.min(r, 3)}" fill="${t.raised}" stroke="${mix(t.border, t.text, 0.35)}" stroke-width="${sw * 1.3}"/><circle cx="${n2(x + sw * 2)}" cy="${n2(y + fh - sw * 2)}" r="${n2(sw * 0.7)}" fill="${t.muted}"/><circle cx="${n2(x + fw - sw * 2)}" cy="${n2(y + fh - sw * 2)}" r="${n2(sw * 0.7)}" fill="${t.muted}"/><path d="M${cx} ${n2(y - g * 0.2)}l${n2(g)} ${n2(g)}l${n2(-g)} ${n2(g)}l${n2(-g)} ${n2(-g)}Z" fill="${t.accent}"/>`;
    }
    case 'hex': {
      const pts = [0, 1, 2, 3, 4, 5].map((i) => {
        const a = (Math.PI / 3) * i;
        return `${(cx + Math.cos(a) * rr).toFixed(2)},${(cy + Math.sin(a) * rr * (fh / fw > 1 ? 1 : fh / fw)).toFixed(2)}`;
      });
      return `<polygon points="${pts.join(' ')}" fill="${t.raised}" stroke="${t.accent2}" stroke-width="${sw}"/>`;
    }
    case 'prism': {
      // A Starlight Rare foil plate: a rainbow foil rim, hairline foil lines and a star glint.
      const stops = [t.danger, t.warning, t.success, t.accent, t.link, t.accent2].map((c, i) => `<stop offset="${n2(i / 5)}" stop-color="${c}"/>`).join('');
      let lines = '';
      for (let ly = y + sw * 2; ly < y + fh - sw; ly += Math.max(1.5, fh / 14)) lines += `M${n2(x + sw)} ${n2(ly)}H${n2(x + fw - sw)}`;
      const g = Math.min(fw, fh) * 0.16;
      const gx = x + fw - g * 0.9;
      const gy = y + g * 0.9;
      return `<defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient></defs><rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${Math.min(r, 4)}" fill="${t.raised}" stroke="url(#p)" stroke-width="${n2(sw * 1.3)}"/><path d="${lines}" stroke="url(#p)" stroke-opacity="0.22" stroke-width="${n2(sw * 0.35)}"/><path d="M${n2(gx)} ${n2(gy - g)}Q${n2(gx)} ${n2(gy)} ${n2(gx + g)} ${n2(gy)}Q${n2(gx)} ${n2(gy)} ${n2(gx)} ${n2(gy + g)}Q${n2(gx)} ${n2(gy)} ${n2(gx - g)} ${n2(gy)}Q${n2(gx)} ${n2(gy)} ${n2(gx)} ${n2(gy - g)}Z" fill="${t.text}" fill-opacity="0.85"/>`;
    }
    case 'blade': {
      // Attack on Titan: an ODM blade plate, steel with the diagonal snap-off scores and a clipped tip.
      const c = Math.min(fw, fh) * 0.24;
      let scores = '';
      for (let i = 1; i < 4; i++) scores += `M${n2(x + (fw * i) / 4 - c * 0.35)} ${n2(y + fh - sw)}L${n2(x + (fw * i) / 4 + c * 0.35)} ${n2(y + sw)}`;
      return `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.raised, t.text, 0.22)}"/><stop offset="0.5" stop-color="${t.raised}"/><stop offset="1" stop-color="${mix(t.raised, t.bg, 0.5)}"/></linearGradient></defs><path d="M${x} ${y}H${n2(x + fw - c)}L${x + fw} ${n2(y + c)}V${y + fh}H${x}Z" fill="url(#b)" stroke="${mix(t.text, t.border, 0.45)}" stroke-width="${sw}" stroke-linejoin="miter"/><path d="${scores}" stroke="${t.bg}" stroke-opacity="0.55" stroke-width="${n2(sw * 0.7)}"/><path d="M${n2(x + sw)} ${n2(y + fh - sw * 1.4)}H${n2(x + fw - sw)}" stroke="${t.accent}" stroke-width="${n2(sw * 1.1)}"/>`;
    }
    case 'haori': {
      // Demon Slayer: black lacquer with a crimson rim, a checkered haori band along the foot.
      const q = Math.max(1.5, fh * 0.12);
      let checks = '';
      for (let i = 0, cx0 = x + sw; cx0 < x + fw - sw - 0.1; i++, cx0 += q) {
        const cw = Math.min(q, x + fw - sw - cx0);
        checks += `<rect x="${n2(cx0)}" y="${n2(y + fh - sw - q * (i % 2 ? 1 : 2))}" width="${n2(cw)}" height="${n2(q)}"/>`;
      }
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="${Math.min(r, 3)}" fill="${mix(t.raised, t.bg, 0.3)}" stroke="${t.accent}" stroke-width="${sw}"/><rect x="${n2(x + sw)}" y="${n2(y + fh - sw - q * 2)}" width="${n2(fw - sw * 2)}" height="${n2(q * 2)}" fill="${mix(t.bg, '#000000', 0.3)}"/><g fill="${t.success}">${checks}</g>`;
    }
    case 'talisman': {
      // Jujutsu Kaisen: a sealing talisman, a pale paper strip with a red seal band and an ink stroke.
      const b = fh * 0.2;
      return `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" rx="1" fill="${mix(t.raised, t.text, 0.12)}" stroke="${mix(t.text, t.muted, 0.4)}" stroke-width="${n2(sw * 0.8)}"/><rect x="${x}" y="${y}" width="${fw}" height="${n2(b)}" fill="${t.accent2}"/><rect x="${n2(x + sw * 1.5)}" y="${n2(y + b + sw * 1.2)}" width="${n2(fw - sw * 3)}" height="${n2(fh - b - sw * 2.7)}" fill="none" stroke="${t.accent2}" stroke-opacity="0.55" stroke-width="${n2(sw * 0.5)}"/><path d="M${n2(x + fw * 0.12)} ${n2(y + fh - sw * 1.6)}Q${n2(cx)} ${n2(y + fh - sw * 3.2)} ${n2(x + fw * 0.88)} ${n2(y + fh - sw * 1.4)}" fill="none" stroke="${t.accent}" stroke-width="${n2(sw * 0.9)}" stroke-linecap="round"/>`;
    }
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}"/><circle cx="${cx}" cy="${cy}" r="${rr - sw * 2.2}" fill="none" stroke="${t.accent}" stroke-opacity="0.4" stroke-width="${sw * 0.5}" stroke-dasharray="${sw * 1.5} ${sw * 1.2}"/>`;
    case 'astrolabe': {
      // A gold zodiac ring with tick marks around a jade inner ring.
      let ticks = '';
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI / 6) * i;
        ticks += `M${n2(cx + Math.cos(a) * rr * 0.8)} ${n2(cy + Math.sin(a) * rr * 0.8)}L${n2(cx + Math.cos(a) * rr * 0.95)} ${n2(cy + Math.sin(a) * rr * 0.95)}`;
      }
      return `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${t.raised}" stroke="${t.accent}" stroke-width="${sw}"/><path d="${ticks}" stroke="${t.accent}" stroke-opacity="0.7" stroke-width="${n2(sw * 0.5)}"/><circle cx="${cx}" cy="${cy}" r="${n2(rr * 0.74)}" fill="none" stroke="${t.accent2}" stroke-opacity="0.6" stroke-width="${n2(sw * 0.5)}"/>`;
    }
    case 'sigil':
      // A black almond eye-plate with a pale sigil rim and a forked crest.
      return `<path d="M${x} ${cy}Q${cx} ${n2(y - fh * 0.1)} ${x + fw} ${cy}Q${cx} ${n2(y + fh * 1.1)} ${x} ${cy}Z" fill="${mix(t.bg, t.raised, 0.5)}" stroke="${t.accent}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M${cx} ${y}V${n2(y + fh * 0.16)}M${n2(cx - fw * 0.12)} ${y}V${n2(y + fh * 0.1)}M${n2(cx + fw * 0.12)} ${y}V${n2(y + fh * 0.1)}" stroke="${t.accent}" stroke-width="${n2(sw * 0.7)}"/>`;
    case 'coil': {
      // A chamfered gunmetal plate with an amber ignition ring in one corner.
      const c = Math.min(fw, fh) * 0.2;
      return `<path d="M${n2(x + c)} ${y}H${x + fw}V${n2(y + fh - c)}L${n2(x + fw - c)} ${y + fh}H${x}V${n2(y + c)}Z" fill="${t.raised}" stroke="${mix(t.border, t.text, 0.3)}" stroke-width="${sw}" stroke-linejoin="round"/><circle cx="${n2(x + fw - c * 0.9)}" cy="${n2(y + c * 0.9)}" r="${n2(c * 0.45)}" fill="none" stroke="${t.accent}" stroke-width="${n2(sw * 0.9)}"/><path d="M${n2(x + c * 0.6)} ${n2(y + fh - sw * 1.6)}H${n2(x + fw * 0.55)}" stroke="${t.accent2}" stroke-width="${n2(sw * 0.7)}"/>`;
    }
    case 'helm': {
      // One Piece: a ship's wheel, timber rim and eight turned handles.
      let spokes = '';
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI / 4) * i + Math.PI / 8;
        spokes += `M${n2(cx + Math.cos(a) * rr * 0.8)} ${n2(cy + Math.sin(a) * rr * 0.8)}L${n2(cx + Math.cos(a) * rr)} ${n2(cy + Math.sin(a) * rr)}`;
      }
      return `<path d="${spokes}" stroke="${t.accent}" stroke-width="${n2(sw * 1.6)}" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="${n2(rr * 0.8)}" fill="${mix(t.raised, t.accent, 0.12)}" stroke="${t.accent}" stroke-width="${n2(sw * 1.2)}"/><circle cx="${cx}" cy="${cy}" r="${n2(rr * 0.66)}" fill="none" stroke="${t.accent2}" stroke-opacity="0.55" stroke-width="${n2(sw * 0.5)}"/>`;
    }
    case 'scroll': {
      // Naruto: an unrolled ninja scroll between two wooden rollers, an orange seal band.
      const rw = Math.max(2, fw * 0.1);
      return `<rect x="${n2(x + rw * 0.5)}" y="${n2(y + fh * 0.06)}" width="${n2(fw - rw)}" height="${n2(fh * 0.88)}" fill="${t.raised}" stroke="${mix(t.border, t.text, 0.25)}" stroke-width="${n2(sw * 0.6)}"/><rect x="${n2(x + rw * 0.5)}" y="${n2(y + fh * 0.06)}" width="${n2(fw - rw)}" height="${n2(fh * 0.1)}" fill="${t.accent}"/><g fill="${mix(t.accent, t.bg, 0.6)}" stroke="${t.accent}" stroke-width="${n2(sw * 0.5)}"><rect x="${x}" y="${y}" width="${n2(rw)}" height="${fh}" rx="${n2(rw / 2)}"/><rect x="${n2(x + fw - rw)}" y="${y}" width="${n2(rw)}" height="${fh}" rx="${n2(rw / 2)}"/></g>`;
    }
    case 'orb': {
      // Dragon Ball: an amber glass orb rim with a red star.
      const [sx, sy] = [cx + rr * 0.62, cy - rr * 0.62];
      const k = rr * 0.24;
      let star = '';
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const rad = i % 2 ? k * 0.42 : k;
        star += `${i ? 'L' : 'M'}${n2(sx + Math.cos(a) * rad)} ${n2(sy + Math.sin(a) * rad)}`;
      }
      return `<defs><radialGradient id="o" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="${mix(t.accent2, '#ffffff', 0.4)}"/><stop offset="0.6" stop-color="${t.accent}"/><stop offset="1" stop-color="${mix(t.accent, t.bg, 0.5)}"/></radialGradient></defs><circle cx="${cx}" cy="${cy}" r="${rr}" fill="url(#o)"/><circle cx="${cx}" cy="${cy}" r="${n2(rr * 0.78)}" fill="${mix(t.raised, t.accent, 0.2)}"/><path d="${star}Z" fill="${t.danger}" stroke="${mix(t.danger, t.bg, 0.5)}" stroke-width="${n2(sw * 0.3)}"/>`;
    }
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
  // Round and hexagonal frames have less room inside than a tile.
  const s = (Math.min(w, h) * (['hex', 'circle', 'rune', 'halo', 'pad', 'shield', 'vinyl', 'helm', 'orb'].includes(style) ? 0.6 : 0.78)) / 40;
  const gx = (w - 40 * s) / 2;
  const gy = (h - 40 * s) / 2;
  const dot = badge ? `<circle cx="${w * 0.8}" cy="${h * 0.2}" r="${Math.min(w, h) * 0.13}" fill="${t.danger}" stroke="${t.raised}" stroke-width="${Math.min(w, h) * 0.04}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${frame(style, w, h, t, radius)}<g transform="translate(${gx.toFixed(2)} ${gy.toFixed(2)}) scale(${s.toFixed(4)})">${glyph(ink, hi)}</g>${dot}</svg>`;
};

// One framed sample icon as an image URL, for the preset chips.
export const iconPreview = (t, radius, style = 'tile') =>
  `data:image/svg+xml,${encodeURIComponent(framedIcon(GLYPHS.chat, 40, 34.14, t, radius, style))}`;

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
  const overPanel = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 634 574"><rect x="3" y="3" width="628" height="568" rx="${Math.min(radius * 3, 40)}" fill="${t.surface}" fill-opacity="0.94" stroke="${t.border}" stroke-width="3"/></svg>`;
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
  const states = ['ok_btn', 'yes_btn', 'no_btn', 'cancel_btn', 'exit_btn', 'minimize_btn', 'minimize2_btn', 'expand_btn', 'close_btn', 'online_btn', 'chat_btn', 'private_btn', 'private_btn_anim', 'tools_btn', 'sort_btn', 'info_btn', 'locked_btn', 'unlocked_btn'];
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
