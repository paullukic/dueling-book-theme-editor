import { mix } from '../../../lib/color.js';
import { n1, rng } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Stardust Dragon: Satellite at night. The unfinished Daedalus Bridge reaches
// out over black water toward the lights of Neo Domino; above the city
// Stardust Dragon rises on the right: the real card artwork (loaded
// live from DuelingBook, cardart.js), its busy card sky sunk by a contrast
// grade and screened into a mint glow. A river of stardust pours off the
// wings and sweeps across the top of the sky, sparkles flaring in a wave
// along it. Offline the glow, trail, city and bridge still stand.

// Catmull-Rom through points, sampled `per` times per segment.
const spline = (pts, per = 8) => {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < per; k++) {
      const s = k / per;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s * s + (-a + 3 * b - 3 * c + d) * s * s * s);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

// Dots as zero-length round-capped segments (compact).
const dots = (list) => list.map(([x, y]) => `M${n1(x)} ${n1(y)}h0`).join('');

const stardust = (t) => {
  const rand = rng(57);
  const night = mix(t.bg, '#000000', 0.35);
  const city = t.warning;
  const iron = mix(night, t.accent, 0.16);

  // ---- far: sky, nebula, stars, Neo Domino, the Daedalus Bridge, the sea ----
  const starSets = [[], [], []];
  for (let i = 0; i < 150; i++) starSets[i % 3].push([rand() * 1600, rand() * 660]);
  const glint = (x, y, s) => { const k = s * 0.2; return `M${n1(x)} ${n1(y - s)}L${n1(x + k)} ${n1(y - k)}L${n1(x + s * 0.7)} ${n1(y)}L${n1(x + k)} ${n1(y + k)}L${n1(x)} ${n1(y + s)}L${n1(x - k)} ${n1(y + k)}L${n1(x - s * 0.7)} ${n1(y)}L${n1(x - k)} ${n1(y - k)}Z`; };
  const skyGlints = [[262, 430, 9], [1482, 560, 7], [700, 540, 6], [176, 300, 7], [1570, 330, 6], [930, 600, 5], [610, 300, 5]].map(([x, y, s]) => glint(x, y, s)).join('');

  // Neo Domino across the water: towers with lit windows, two beacon masts.
  const sky = 708;
  let towers = '';
  [[840, 26, 40], [870, 20, 64], [894, 34, 50], [934, 22, 92], [962, 30, 58], [1000, 18, 128], [1024, 40, 72], [1072, 26, 214], [1104, 30, 120], [1140, 22, 84], [1168, 36, 154], [1210, 20, 66], [1236, 30, 106], [1272, 26, 186], [1304, 34, 94], [1344, 22, 132], [1372, 40, 72], [1418, 24, 154], [1448, 34, 88], [1488, 28, 124], [1522, 40, 66], [1566, 30, 100]].forEach(([x, w, h]) => {
    towers += `M${x} ${sky}V${sky - h}h${w}V${sky}Z`;
  });

  // The Daedalus Bridge: an H-frame pylon, stays, a truss deck that stops in mid-air.
  const deckY = 640;
  const deckEnd = 742;
  let stays = '';
  for (let i = 1; i <= 8; i++) stays += `M232 ${452 + i * 6}L${232 - i * 22} ${deckY}M280 ${452 + i * 6}L${280 + i * 40} ${deckY}`;
  let truss = '';
  for (let x = 150; x < deckEnd - 20; x += 24) truss += `M${x} ${deckY + 10}L${x + 12} ${deckY + 22}L${x + 24} ${deckY + 10}`;
  const pylon = `M222 ${sky + 30}L228 446H240L244 ${sky + 30}ZM268 ${sky + 30}L272 446H284L290 ${sky + 30}ZM226 470H286V480H226ZM224 560H288V570H224ZM216 438L256 418L296 438L292 446H220Z`;
  const deck = `M120 ${deckY}H${deckEnd}L${deckEnd - 6} ${deckY + 6}L${deckEnd - 18} ${deckY + 3}L${deckEnd - 26} ${deckY + 10}L${deckEnd - 40} ${deckY + 22}H120Z`;
  let streaks = '';
  for (let i = 0; i < 32; i++) {
    const x = 840 + rand() * 740;
    const y = sky + 6 + rand() * 150;
    streaks += `M${n1(x)} ${n1(y)}h${n1(4 + rand() * 26 * (1 - (y - sky) / 200))}`;
  }

  // ---- the stardust trail: a band off the wings, sparkles flaring in a wave ----
  const strand = (dy, bow) => spline([[1140, 200 + dy * 0.3], [1040, 128 + dy * 0.6], [860, 86 + dy - bow], [620, 90 + dy - bow], [420, 128 + dy], [250, 200 + dy * 0.8], [120, 284 + dy * 0.6]], 7);
  const trail = strand(0, 0);
  const pathOf = (pts) => `M${pts.map(([x, y]) => `${n1(x)} ${n1(y)}`).join('L')}`;
  const trailD = pathOf(trail);
  const strands = pathOf(strand(-34, 16)) + pathOf(strand(30, -10));
  let sparkles = '';
  // Sparkles over the duel stage (x ~430-1190) are hidden while a duel is open (chrome).
  let stageSparkles = '';
  const nSp = 24;
  for (let i = 0; i < nSp; i++) {
    const p = trail[Math.round(((i + 0.5) / nSp) * (trail.length - 1))];
    const s = 5 + rand() * 7 * (1 - i / nSp) + 4;
    const gx = p[0] + (rand() - 0.5) * 60;
    const piece = `<path d="${glint(gx, p[1] + (rand() - 0.5) * 48, s)}" fill="${i % 4 ? '#ffffff' : t.accent}" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-sd-flare 6s ease-in-out ${n1(-(i / nSp) * 6)}s infinite;"/>`;
    if (gx > 430 && gx < 1190) stageSparkles += piece;
    else sparkles += piece;
  }
  const dust = [[], []];
  for (let i = 0; i < 120; i++) {
    const p = trail[Math.floor(rand() * trail.length)];
    const spread = 30 + rand() * rand() * 70;
    dust[i % 2].push([p[0] + (rand() - 0.5) * spread * 2, p[1] + (rand() - 0.5) * spread * 1.6]);
  }

  // ---- near: Satellite's scrap heaps ----
  const heap = (x0, x1, base, peak, seed) => {
    const r = rng(seed);
    let d = `M${x0} 900L${x0} ${base}`;
    for (let i = 1; i < 16; i++) {
      const x = x0 + ((x1 - x0) * i) / 16;
      d += `L${n1(x)} ${n1(base - Math.sin((i / 16) * Math.PI) * (base - peak) + (r() - 0.5) * 24)}`;
    }
    return `${d}L${x1} ${base}L${x1} 900Z`;
  };
  const scrap = `M150 790L132 714M196 786L230 708l14 -6M320 812L352 746L380 752M100 830L74 762M410 846L444 806L468 812M260 760l40 -10l6 16`;

  // ---- mid: Stardust Dragon, the real card artwork, rising off the heaps ----
  const hero = cardArt(t, { id: 'dbtefx-sd-hero', card: CARDS.stardust, x: 1140, y: 0, w: 400, h: 560, focus: [0.5, 0.4], zoom: 0.82, blend: 'screen', feather: 0.75, fade: 0.8, grade: 'brightness(0.75) contrast(1.9) saturate(0.6)', tint: t.accent, tintAmt: 0.35, backdrop: night, backdropAmt: 0.5, glow: t.accent, breathe: 14 });

  return `<style>
@keyframes dbtefx-sd-flare { 0%, 100% { opacity: 0.12; transform: scale(0.4) rotate(0deg); } 10% { opacity: 1; transform: scale(1.2) rotate(25deg); } 28% { opacity: 0.3; transform: scale(0.65) rotate(45deg); } }
@keyframes dbtefx-sd-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
${CARD_ART_KEYFRAMES}
</style>
<defs>
<pattern id="dbtefx-sd-win" width="6" height="10" patternUnits="userSpaceOnUse"><rect x="2" y="3" width="2.4" height="3" fill="${city}"/></pattern>
<pattern id="dbtefx-sd-win2" width="30" height="40" patternUnits="userSpaceOnUse"><path d="M2 3h2.4v3H2ZM14 13h2.4v3H14ZM26 23h2.4v3H26ZM8 33h2.4v3H8ZM20 3h2.4v3H20Z" fill="${city}" fill-opacity="0.85"/></pattern>
<linearGradient id="dbtefx-sd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}"/><stop offset="0.66" stop-color="${mix(t.bg, t.accent, 0.07)}"/><stop offset="0.785" stop-color="${mix(t.bg, city, 0.16)}"/><stop offset="0.787" stop-color="${night}"/><stop offset="1" stop-color="${mix(night, '#000000', 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-sd-neb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.2"/><stop offset="0.6" stop-color="${t.accent}" stop-opacity="0.06"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-neb2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.12"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.5)}" stop-opacity="0.3"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.09"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sd-trail" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.32"/><stop offset="0.55" stop-color="${t.accent}" stop-opacity="0.14"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-sd-sky)"/>
<ellipse cx="1180" cy="290" rx="640" ry="300" fill="url(#dbtefx-sd-neb)" transform="rotate(-16 1180 290)"/>
<ellipse cx="300" cy="230" rx="440" ry="210" fill="url(#dbtefx-sd-neb2)" transform="rotate(-12 300 230)"/>
<g stroke="${t.text}" stroke-linecap="round"><path d="${dots(starSets[0])}" stroke-width="1.2" stroke-opacity="0.45"/><path d="${dots(starSets[1])}" stroke-width="1.8" stroke-opacity="0.6"/><path d="${dots(starSets[2])}" stroke-width="2.6" stroke-opacity="0.75"/></g>
<path d="${skyGlints}" fill="#ffffff" fill-opacity="0.75"/>
<path d="${towers}" fill="${mix(night, t.border, 0.4)}"/>
<path d="${towers}" fill="url(#dbtefx-sd-win)" fill-opacity="0.35"/><path d="${towers}" fill="url(#dbtefx-sd-win2)"/>
<path d="M1085 494v-30M1285 522v-24" stroke="${t.accent2}" stroke-width="2"/><circle cx="1085" cy="462" r="3" fill="${t.accent2}"/><circle cx="1285" cy="496" r="3" fill="${t.accent2}"/>
<path d="${streaks}" stroke="${city}" stroke-opacity="0.32" stroke-width="2" stroke-linecap="round"/>
<path d="M0 ${sky}H1600" stroke="${mix(t.accent, t.bg, 0.5)}" stroke-opacity="0.6"/>
<path d="${stays}" stroke="${mix(t.accent, night, 0.4)}" stroke-opacity="0.5" stroke-width="1.1"/>
<path d="${pylon}${deck}" fill="${iron}"/>
<path d="${truss}M${deckEnd - 26} ${deckY + 10}q6 34 -4 58M${deckEnd - 40} ${deckY + 22}q-4 22 6 40" fill="none" stroke="${iron}" stroke-width="2"/>
<path d="M120 ${deckY}H${deckEnd}M228 446V${sky}M272 446V${sky}" stroke="${t.accent}" stroke-opacity="0.28" stroke-width="1.2"/>
<circle cx="256" cy="414" r="3" fill="${t.accent2}"/>
<!--mid-->
<path d="${trailD}" fill="none" stroke="url(#dbtefx-sd-trail)" stroke-width="90" stroke-linecap="round" stroke-opacity="0.45"/>
<path d="${trailD}" fill="none" stroke="url(#dbtefx-sd-trail)" stroke-width="18" stroke-linecap="round"/>
<path d="${strands}" fill="none" stroke="url(#dbtefx-sd-trail)" stroke-width="5" stroke-linecap="round"/>
<g stroke="${mix(t.accent, '#ffffff', 0.55)}" stroke-linecap="round"><path d="${dots(dust[0])}" stroke-width="1.6" stroke-opacity="0.7"/><path d="${dots(dust[1])}" stroke-width="2.6" stroke-opacity="0.85"/></g>
${sparkles}
<g class="dbtefx-sd-stage">${stageSparkles}</g>
<ellipse cx="1290" cy="340" rx="340" ry="400" fill="url(#dbtefx-sd-halo)" style="animation: dbtefx-sd-glow 7s ease-in-out infinite;"/>
${hero}
<!--near-->
<path d="${heap(-20, 520, 840, 728, 5)}" fill="${mix(night, '#000000', 0.45)}"/>
<path d="${heap(370, 760, 884, 820, 9)}" fill="${mix(night, '#000000', 0.3)}"/>
<path d="${scrap}" fill="none" stroke="${mix(night, '#000000', 0.45)}" stroke-width="4" stroke-linecap="round"/>
<path d="${heap(-20, 520, 840, 728, 5)}" fill="none" stroke="${t.accent}" stroke-opacity="0.16" stroke-width="1.5" transform="translate(0 1)"/>`;
};

export default stardust;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'star', count: 70, colors: ['text', 'accent'] },
  { kind: 'mote', count: 26, colors: ['accent', 'text'], rise: true, speed: 0.5 },
  { kind: 'meteor', count: 1, colors: ['accent'] },
];
