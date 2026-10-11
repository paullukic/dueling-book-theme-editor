import { mix } from '../../../lib/color.js';
import { glow, H, n1, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// White Dragon: Blue-Eyes White Dragon, the real card artwork, rearing over a
// frozen spire at the right edge, White Lightning crackling from its jaws
// across the upper sky. The art loads live from DuelingBook (cardart.js);
// without it the halo, lightning, ice range and spire still stand.

const pt = (p) => `${n1(p[0])} ${n1(p[1])}`;

// A jagged bolt between two points, seeded.
const bolt = (rand, a, b, steps, jitter) => {
  let d = `M${pt(a)}`;
  for (let i = 1; i < steps; i++) {
    const s = i / steps;
    const nx = -(b[1] - a[1]);
    const ny = b[0] - a[0];
    const len = Math.hypot(nx, ny) || 1;
    const j = (rand() - 0.5) * 2 * jitter;
    d += `L${pt([a[0] + (b[0] - a[0]) * s + (nx / len) * j, a[1] + (b[1] - a[1]) * s + (ny / len) * j])}`;
  }
  return `${d}L${pt(b)}`;
};

const whiteDragon = (t) => {
  const ice = t.accent;
  const night = mix(t.bg, '#000000', 0.35);
  const rand = rng(79);

  // White Lightning: from the jaws up and left across the sky, forking.
  const mx = 1350;
  const my = 312;
  const main = bolt(rand, [mx, my], [1290, 110], 6, 12) + bolt(rand, [1290, 110], [1262, -20], 5, 12);
  const forkA = bolt(rand, [1315, 200], [1236, 226], 4, 8);
  const forkB = bolt(rand, [1290, 110], [1232, 136], 4, 7);
  const forkC = bolt(rand, [1278, 40], [1240, 56], 3, 6);
  const lightning = [main, forkA, forkB, forkC];
  const strike = (o) => lightning.map((d, i) => `<path d="${d}" fill="none" stroke="${ice}" stroke-width="${i ? 9 : 16}" stroke-opacity="${o * 0.35}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#ffffff" stroke-width="${i ? 2.6 : 4.5}" stroke-linejoin="round" stroke-linecap="round"/>`).join('');

  // Ice spires on the horizon and the frozen spire the dragon stands on.
  const range = 'M0 742L90 720L150 640L176 700L260 716L340 660L372 610L398 668L470 708L620 722L760 700L900 730L1080 712L1180 736L1600 748V900H0Z';
  let spire = 'M1176 900L1214 772L1240 744L1262 712L1300 724L1340 700L1420 704L1470 690L1520 720L1560 700L1600 730V900Z';
  let shards = '';
  [[1214, 772, 1186, 650], [1300, 724, 1280, 610], [1470, 690, 1490, 560], [1560, 700, 1590, 600]].forEach(([x, y, tx, ty]) => {
    shards += `<path d="M${x - 22} ${y + 30}L${tx} ${ty}L${x + 22} ${y + 30}Z"/>`;
  });
  spire += shards.replace(/<path d="|"\/>/g, '');

  return `<style>${CARD_ART_KEYFRAMES}
@keyframes dbtefx-wd-strike { 0%, 100% { opacity: 0.55; } 8%, 13% { opacity: 1; } 15% { opacity: 0.35; } 17%, 26% { opacity: 1; } 40% { opacity: 0.6; } }
@keyframes dbtefx-wd-charge { 0%, 100% { transform: scale(0.75); opacity: 0.7; } 50% { transform: scale(1.25); opacity: 1; } }
</style>
<defs>${glow('dbtefx-wd-moon', t.accent2, 0.5, 0.5, 0.5, 0.42)}${glow('dbtefx-wd-orb', '#ffffff', 0.5, 0.5, 0.5, 1)}${glow('dbtefx-wd-halo', ice, 0.5, 0.5, 0.5, 0.55)}
<linearGradient id="dbtefx-wd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}"/><stop offset="0.55" stop-color="${t.bg}"/><stop offset="0.85" stop-color="${mix(t.bg, ice, 0.14)}"/><stop offset="1" stop-color="${mix(t.surface, ice, 0.2)}"/></linearGradient>
<linearGradient id="dbtefx-wd-ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent2, ice, 0.4)}"/><stop offset="1" stop-color="${mix(t.surface, ice, 0.25)}"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-wd-sky)"/>
<circle cx="1360" cy="300" r="520" fill="url(#dbtefx-wd-moon)"/>
<path d="${range}" fill="${mix(t.surface, ice, 0.12)}"/>
<path d="${range}" fill="none" stroke="${ice}" stroke-opacity="0.35" stroke-width="2"/>
<!--mid-->
<circle cx="1300" cy="300" r="300" fill="url(#dbtefx-wd-halo)"/>
${cardArt(t, { id: 'dbtefx-wd-hero', card: CARDS.blueEyes, x: 1300, y: 10, w: 400, h: 720, focus: [0.62, 0.5], zoom: 0.78, blend: 'normal', grade: 'saturate(0.9) brightness(1.05)', tint: ice, tintAmt: 0.22, feather: 0.6, fade: 0.6, backdrop: mix(t.bg, ice, 0.55), glow: ice, breathe: 16 })}
<g style="animation: dbtefx-wd-strike 5s linear infinite;">${strike(1)}</g>
<circle cx="${mx}" cy="${my}" r="60" fill="url(#dbtefx-wd-orb)" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-wd-charge 2.5s ease-in-out infinite;"/>
<!--near-->
<path d="${spire}" fill="${ice}" transform="translate(5 0)"/>
<path d="${spire}" fill="url(#dbtefx-wd-ice)"/>
<path d="M0 900L0 800L40 760L70 812L110 770L150 830L190 900Z" fill="url(#dbtefx-wd-ice)" fill-opacity="0.8"/>`;
};

export default whiteDragon;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'flake', count: 60, colors: ['accent2', 'text'] }, { kind: 'flash', count: 1, colors: ['text'] }];
