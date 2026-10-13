import { mix } from '../../../lib/color.js';
import { anim, H, n1, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Branded: Albion the Branded Dragon, the real card artwork, rising out of
// the burning Despia wasteland behind a black rock ridge, backlit by a
// white-gold Dogmatika halo, the Branded Fusion cross-brand smouldering on
// the rock at its feet and Mirrorjade's ice shards drifting through the
// embers. The art loads live from DuelingBook (cardart.js); without it the
// halo, brand, ridge and shards still stand.
const branded = (t) => {
  const ice = mix(t.text, t.opp, 0.35);
  const gold = mix(t.opp, '#ffffff', 0.25);
  const brand = t.accent;

  // Despia spires: far silhouettes on the left horizon.
  const spire = (x, w, h) => {
    const b = 760;
    return `M${x} ${b}V${b - h * 0.62}L${n1(x + w * 0.18)} ${b - h * 0.7}L${n1(x + w / 2)} ${b - h}L${n1(x + w * 0.82)} ${b - h * 0.7}L${x + w} ${b - h * 0.62}V${b}Z`;
  };
  const spires = [[150, 46, 330], [210, 30, 230], [92, 34, 250], [260, 52, 380], [330, 28, 210], [40, 40, 190], [1500, 40, 240], [1556, 30, 170]].map(([x, w, h]) => spire(x, w, h)).join('');
  const windows = [[173, 560], [286, 520], [286, 600], [109, 640]].map(([x, y]) => `M${x - 5} ${y + 34}V${y + 8}Q${x} ${y} ${x + 5} ${y + 8}V${y + 34}Z`).join('');

  // The cross-brand: a long vertical bar, a short crossbar, a diamond heart.
  const crossBrand = (cx, cy, s) => {
    const p = (pts) => pts.map(([x, y]) => `${n1(cx + x * s)} ${n1(cy + y * s)}`).join('L');
    return `M${p([[0, -40], [5, -12], [26, -6], [30, 0], [26, 6], [5, 12], [0, 52], [-5, 12], [-26, 6], [-30, 0], [-26, -6], [-5, -12]])}Z`;
  };

  // Mirrorjade's floating crystal shards, each scored with a brand.
  const shard = (x, y, s, d, cls = '') => `<g${cls && ` class="${cls}"`} ${anim('bob', 5 + d, d, 'ease-in-out')}><path d="M${x} ${n1(y - 40 * s)}L${n1(x + 16 * s)} ${n1(y - 6 * s)}L${n1(x + 8 * s)} ${n1(y + 38 * s)}L${n1(x - 12 * s)} ${n1(y + 8 * s)}Z" fill="url(#dbtefx-bd-ice)" stroke="${ice}" stroke-opacity="0.8" stroke-width="1.5"/><path d="M${x} ${n1(y - 40 * s)}L${n1(x - 2 * s)} ${n1(y + 6 * s)}L${n1(x + 8 * s)} ${n1(y + 38 * s)}" fill="none" stroke="#ffffff" stroke-opacity="0.4"/><path d="${crossBrand(x + 1 * s, y, 0.28 * s)}" fill="${brand}" fill-opacity="0.85"/></g>`;

  // Burning crags of the wasteland.
  let crags = `M0 ${H}`;
  [[0, 770], [120, 740], [240, 780], [420, 760], [620, 800], [820, 770], [1020, 800], [1140, 760], [1210, 724], [1300, 700], [1400, 704], [1500, 690], [1600, 700]].forEach(([x, y]) => {
    crags += `L${x} ${y}`;
  });
  crags += `L${W} ${H}Z`;

  const ridge = 'M1150 760L1196 700L1240 690L1270 650L1318 662L1350 640L1400 668L1446 650L1500 672L1560 640L1600 650';

  return `<style>${CARD_ART_KEYFRAMES} @keyframes dbtefx-bd-brand { 0%, 100% { opacity: 0.6; transform: scale(0.96); } 50% { opacity: 1; transform: scale(1.06); } }</style>
<defs>
<linearGradient id="dbtefx-bd-ice" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.6"/><stop offset="0.5" stop-color="${ice}" stop-opacity="0.32"/><stop offset="1" stop-color="${ice}" stop-opacity="0.08"/></linearGradient>
<radialGradient id="dbtefx-bd-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${gold}" stop-opacity="0.6"/><stop offset="0.4" stop-color="${gold}" stop-opacity="0.2"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-bd-fire" cx="0.5" cy="1" r="0.8"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.5"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.12"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-bd-core"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.3" stop-color="${t.accent}" stop-opacity="0.7"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-bd-fire)" ${anim('pulse', 7, 0, 'ease-in-out')}/>
<g fill="${mix(t.bg, t.accent, 0.06)}"><path d="${spires}"/></g>
<path d="${windows}" fill="${t.accent}" fill-opacity="0.5"/>
<path d="${crags}" fill="${mix(t.bg, t.accent, 0.08)}"/>
<!--mid-->
<circle cx="1310" cy="300" r="330" fill="url(#dbtefx-bd-halo)" ${anim('bloom', 9, 0, 'ease-in-out')}/>
<g class="dbtefx-bd-herogrp">${cardArt(t, { id: 'dbtefx-bd-hero', card: CARDS.albion, x: 1100, y: -40, w: 420, h: 760, focus: [0.75, 0.4], zoom: 0.8, blend: 'screen', feather: 0.6, fade: 0.7, backdrop: mix(t.bg, t.accent, 0.12), backdropAmt: 0.85, glow: t.accent, breathe: 14 })}</g>
<!--near-->
<path d="M1130 900L${ridge.slice(1)}L1600 900Z" fill="${mix(t.bg, '#000000', 0.4)}"/>
<path d="${ridge}" fill="none" stroke="${t.accent}" stroke-opacity="0.55" stroke-width="2"/>
<g class="dbtefx-bd-brand"><g style="transform-origin: 1340px 760px; animation: dbtefx-bd-brand 4s ease-in-out infinite;"><circle cx="1340" cy="760" r="56" fill="url(#dbtefx-bd-core)"/><path d="${crossBrand(1340, 756, 0.8)}" fill="${brand}" stroke="#ffffff" stroke-opacity="0.85" stroke-width="2"/><path d="M1340 749L1345 756L1340 763L1335 756Z" fill="#ffffff"/></g></g>
${shard(1150, 110, 0.7, 0, 'dbtefx-bd-top')}${shard(1462, 520, 0.8, 1.6, 'dbtefx-bd-edge')}${shard(1120, 560, 0.65, 3)}`;
};

export default branded;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'ember', count: 110, colors: ['accent', 'opp'] }, { kind: 'ash', count: 30, colors: ['muted'] }, { kind: 'burst', count: 1, colors: ['accent'] }];
