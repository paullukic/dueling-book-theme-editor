import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, rng, W } from './kit.js';

// White Dragon: the white dragon of light reared on an ice spire at the right
// edge, wings raised, lit white from the left with a cold ice-blue rim on its
// right side, White Lightning crackling from its open jaws across the upper sky.

const pt = (p) => `${n1(p[0])} ${n1(p[1])}`;

// A tapered limb along a cubic curve: neck, tail, legs, horns, finger bones.
const taper = (a, b, c, d, w0, w1, steps = 10) => {
  const left = [];
  const right = [];
  for (let i = 0; i <= steps; i++) {
    const s = i / steps;
    const u = 1 - s;
    const x = u ** 3 * a[0] + 3 * u * u * s * b[0] + 3 * u * s * s * c[0] + s ** 3 * d[0];
    const y = u ** 3 * a[1] + 3 * u * u * s * b[1] + 3 * u * s * s * c[1] + s ** 3 * d[1];
    const dx = 3 * u * u * (b[0] - a[0]) + 6 * u * s * (c[0] - b[0]) + 3 * s * s * (d[0] - c[0]);
    const dy = 3 * u * u * (b[1] - a[1]) + 6 * u * s * (c[1] - b[1]) + 3 * s * s * (d[1] - c[1]);
    const len = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * s) / 2;
    left.push([x - (dy / len) * w, y + (dx / len) * w]);
    right.push([x + (dy / len) * w, y - (dx / len) * w]);
  }
  return `M${left.map(pt).join('L')}L${right.reverse().map(pt).join('L')}Z`;
};
const bone = (a, d, w0, w1, k = 0) => {
  const nx = -(d[1] - a[1]) * k;
  const ny = (d[0] - a[0]) * k;
  return taper(a, [a[0] + (d[0] - a[0]) / 3 + nx, a[1] + (d[1] - a[1]) / 3 + ny], [a[0] + (2 * (d[0] - a[0])) / 3 + nx, a[1] + (2 * (d[1] - a[1])) / 3 + ny], d, w0, w1, 6);
};

// A bat wing: arm to the wrist, finger bones fanning out, membrane scalloped between the tips.
const wing = (shoulder, elbow, wrist, thumb, tips, attach, bow) => {
  const all = [...tips, attach];
  let d = `M${pt(shoulder)}L${pt(elbow)}L${pt(wrist)}L${pt(tips[0])}`;
  for (let i = 1; i < all.length; i++) {
    const [ax, ay] = all[i - 1];
    const [bx, by] = all[i];
    d += `Q${pt([(ax + bx) / 2 + (wrist[0] - (ax + bx) / 2) * 0.28, (ay + by) / 2 + (wrist[1] - (ay + by) / 2) * 0.28])} ${pt(all[i])}`;
  }
  d += 'Z';
  const bones = bone(shoulder, elbow, 30, 22, 0.05) + bone(elbow, wrist, 22, 14, -0.06) + bone(wrist, thumb, 12, 1, 0.1) + tips.map((p) => bone(wrist, p, 10, 2, bow)).join('');
  return { d, bones };
};

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
  const white = mix('#ffffff', t.accent2, 0.5);
  const shade = mix(t.accent2, t.border, 0.42);
  const membrane = mix(ice, t.surface, 0.3);
  const rand = rng(79);

  const far = wing([1372, 404], [1316, 286], [1346, 112], [1324, 60], [[1236, 66], [1196, 150], [1196, 262], [1240, 352]], [1334, 424], 0.08);
  const near = wing([1414, 398], [1470, 262], [1436, 92], [1404, 46], [[1528, 22], [1596, 104], [1612, 236], [1576, 368]], [1478, 470], -0.08);

  // Body: deep chest, long S-curved neck, haunch, forelimb, tail sweeping off bottom-right.
  const body = [
    'M1500 604C1524 520 1476 428 1406 388C1354 362 1296 372 1276 420C1256 476 1290 548 1340 584C1384 622 1466 642 1500 604Z',
    taper([1350, 424], [1288, 336], [1404, 282], [1326, 206], 70, 32, 14),
    'M1504 556C1530 616 1488 664 1418 662C1384 660 1364 640 1368 614C1374 580 1424 552 1476 540Z',
    bone([1392, 640], [1442, 684], 50, 32, 0.04),
    bone([1442, 684], [1372, 704], 30, 14, 0.04),
    bone([1334, 468], [1290, 574], 46, 32, -0.06),
    bone([1290, 574], [1290, 696], 32, 18, 0.06),
    taper([1492, 598], [1560, 690], [1610, 740], [1690, 772], 64, 18, 12),
  ].map((d) => `<path d="${d}"/>`).join('');
  const talons = [[1270, 700], [1286, 704], [1302, 702], [1366, 706], [1382, 708], [1398, 706]].map(([x, y]) => `<path d="M${x - 4} ${y - 6}L${x - 12} ${y + 12}L${x + 6} ${y}Z"/>`).join('');
  // Low smooth ridges down the neck: this dragon is sleek, not spiked.
  let ridges = '';
  [[1340, 244], [1356, 286], [1350, 328], [1338, 366]].forEach(([x, y], i) => {
    ridges += `<path d="M${x - 2} ${y - 8}L${x + 14 + i} ${y - 8}L${x} ${y + 8}Z"/>`;
  });

  // Head, facing left: a long narrow skull, flat brow over the socket, open jaw, crest swept back.
  const head = [
    'M1340 182L1314 160Q1282 150 1252 158L1196 172L1158 188L1150 198L1176 202L1240 200L1296 212L1336 216Z',
    'M1306 216L1252 226L1196 246L1180 256L1200 258L1260 242L1318 230Z',
    bone([1318, 164], [1426, 118], 22, 1, 0.1),
    bone([1330, 180], [1432, 164], 16, 1, 0.08),
    bone([1300, 160], [1352, 122], 10, 1, 0.06),
    bone([1304, 220], [1342, 250], 10, 1, 0),
  ].map((d) => `<path d="${d}"/>`).join('');
  // Skull planes: brow line, cheek line and nostril groove in the shadow tone.
  const planes = `<path d="M1176 190L1232 178L1290 168L1318 176" fill="none" stroke="${shade}" stroke-width="3" stroke-linecap="round"/><path d="M1206 200L1262 202L1300 212" fill="none" stroke="${shade}" stroke-width="2.4" stroke-linecap="round"/><path d="M1166 190L1180 188" stroke="${shade}" stroke-width="3" stroke-linecap="round"/>`;

  // White Lightning: from the jaws up and left across the sky, forking.
  const mx = 1178;
  const my = 232;
  const main = bolt(rand, [mx, my], [1060, 90], 6, 14) + bolt(rand, [1060, 90], [1010, -20], 5, 16);
  const forkA = bolt(rand, [1110, 170], [1010, 190], 4, 10);
  const forkB = bolt(rand, [1060, 90], [980, 120], 4, 9);
  const forkC = bolt(rand, [1040, 30], [970, 40], 3, 8);
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

  return `<style>
@keyframes dbtefx-wd-wr { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
@keyframes dbtefx-wd-wl { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-5deg); } }
@keyframes dbtefx-wd-strike { 0%, 100% { opacity: 0.55; } 8%, 13% { opacity: 1; } 15% { opacity: 0.35; } 17%, 26% { opacity: 1; } 40% { opacity: 0.6; } }
@keyframes dbtefx-wd-charge { 0%, 100% { transform: scale(0.75); opacity: 0.7; } 50% { transform: scale(1.25); opacity: 1; } }
</style>
<defs>${glow('dbtefx-wd-moon', t.accent2, 0.5, 0.5, 0.5, 0.42)}${glow('dbtefx-wd-orb', '#ffffff', 0.5, 0.5, 0.5, 1)}${glow('dbtefx-wd-halo', ice, 0.5, 0.5, 0.5, 0.55)}${glow('dbtefx-wd-eye', ice, 0.5, 0.5, 0.5, 1)}
<linearGradient id="dbtefx-wd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}"/><stop offset="0.55" stop-color="${t.bg}"/><stop offset="0.85" stop-color="${mix(t.bg, ice, 0.14)}"/><stop offset="1" stop-color="${mix(t.surface, ice, 0.2)}"/></linearGradient>
<linearGradient id="dbtefx-wd-hide" gradientUnits="userSpaceOnUse" x1="1160" y1="160" x2="1540" y2="520"><stop offset="0" stop-color="#ffffff"/><stop offset="0.55" stop-color="${white}"/><stop offset="1" stop-color="${shade}"/></linearGradient>
<linearGradient id="dbtefx-wd-ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent2, ice, 0.4)}"/><stop offset="1" stop-color="${mix(t.surface, ice, 0.25)}"/></linearGradient>
<path id="dbtefx-wd-wn" d="${near.d}"/><path id="dbtefx-wd-wf" d="${far.d}"/><g id="dbtefx-wd-body">${body}${ridges}${talons}${head}</g></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-wd-sky)"/>
<circle cx="1360" cy="300" r="520" fill="url(#dbtefx-wd-moon)"/>
<path d="${range}" fill="${mix(t.surface, ice, 0.12)}"/>
<path d="${range}" fill="none" stroke="${ice}" stroke-opacity="0.35" stroke-width="2"/>
<!--mid-->
<g transform="translate(1176 720) scale(0.78) translate(-1176 -720)">
<circle cx="1260" cy="230" r="300" fill="url(#dbtefx-wd-halo)"/>
<g style="transform-origin: 1372px 404px; animation: dbtefx-wd-wl 6s ease-in-out infinite;"><use href="#dbtefx-wd-wf" fill="${ice}" transform="translate(5 0)"/><use href="#dbtefx-wd-wf" fill="${membrane}" fill-opacity="0.7"/><path d="${far.bones}" fill="${white}"/></g>
<use href="#dbtefx-wd-body" fill="${ice}" transform="translate(6 1)"/>
<use href="#dbtefx-wd-body" fill="url(#dbtefx-wd-hide)"/>
${planes}
<circle cx="1262" cy="182" r="26" fill="url(#dbtefx-wd-eye)" ${anim('pulse', 3, 0, 'ease-in-out')}/>
<path d="M1250 184L1266 177L1278 181L1264 187Z" fill="${mix(ice, t.bg, 0.25)}"/>
<path d="M1258 182L1266 179" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
<g style="transform-origin: 1414px 398px; animation: dbtefx-wd-wr 6s ease-in-out infinite;"><use href="#dbtefx-wd-wn" fill="${ice}" transform="translate(6 0)"/><use href="#dbtefx-wd-wn" fill="${membrane}" fill-opacity="0.78"/><path d="${near.bones}" fill="#ffffff"/></g>
<g style="animation: dbtefx-wd-strike 5s linear infinite;">${strike(1)}</g>

<circle cx="${mx}" cy="${my}" r="70" fill="url(#dbtefx-wd-orb)" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-wd-charge 2.5s ease-in-out infinite;"/>
</g>
<!--near-->
<path d="${spire}" fill="${ice}" transform="translate(5 0)"/>
<path d="${spire}" fill="url(#dbtefx-wd-ice)"/>
<path d="M0 900L0 800L40 760L70 812L110 770L150 830L190 900Z" fill="url(#dbtefx-wd-ice)" fill-opacity="0.8"/>`;
};

export default whiteDragon;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'flake', count: 60, colors: ['accent2', 'text'] }, { kind: 'flash', count: 1, colors: ['text'] }];
