import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, rng, W } from './kit.js';

// Black Dragon: Red-Eyes perched on a volcanic crag at the right edge, wings
// raised against a blood-red sky, one burning eye, an Inferno Fire Blast
// gathering in its open jaws. Drawn as a silhouette rim-lit from the lava below.

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
// Straight-ish limb segment with a gentle bow (k: bow toward the left normal).
const bone = (a, d, w0, w1, k = 0) => {
  const nx = -(d[1] - a[1]) * k;
  const ny = (d[0] - a[0]) * k;
  return taper(a, [a[0] + (d[0] - a[0]) / 3 + nx, a[1] + (d[1] - a[1]) / 3 + ny], [a[0] + (2 * (d[0] - a[0])) / 3 + nx, a[1] + (2 * (d[1] - a[1])) / 3 + ny], d, w0, w1, 6);
};

// A bat wing: arm to the wrist, curved finger bones fanning out, membrane scalloped between the tips.
const wing = (shoulder, elbow, wrist, thumb, tips, attach, bow) => {
  const all = [...tips, attach];
  let d = `M${pt(shoulder)}L${pt(elbow)}L${pt(wrist)}L${pt(tips[0])}`;
  for (let i = 1; i < all.length; i++) {
    const [ax, ay] = all[i - 1];
    const [bx, by] = all[i];
    // Scallop: the edge sags from its midpoint toward the wrist.
    d += `Q${pt([(ax + bx) / 2 + (wrist[0] - (ax + bx) / 2) * 0.28, (ay + by) / 2 + (wrist[1] - (ay + by) / 2) * 0.28])} ${pt(all[i])}`;
  }
  d += 'Z';
  const bones = bone(shoulder, elbow, 30, 22, 0.05) + bone(elbow, wrist, 22, 14, -0.06) + bone(wrist, thumb, 12, 1, 0.1) + tips.map((p) => bone(wrist, p, 10, 2, bow)).join('');
  return { d, bones };
};

const blackDragon = (t) => {
  const ink = mix(t.bg, '#000000', 0.6);
  const membrane = mix(ink, t.accent, 0.05);
  const boneTone = mix(ink, t.accent, 0.2);
  const fire = mix(t.accent, t.warning, 0.45);
  const core = mix(t.warning, '#ffffff', 0.65);
  const rand = rng(89);

  const far = wing([1372, 404], [1316, 286], [1346, 112], [1324, 60], [[1236, 66], [1196, 150], [1196, 262], [1240, 352]], [1334, 424], 0.08);
  const near = wing([1414, 398], [1470, 262], [1436, 92], [1404, 46], [[1528, 22], [1596, 104], [1612, 236], [1576, 368]], [1478, 470], -0.08);

  // Body: barrel chest, S-curved neck, bent haunch, forelimb, tail sweeping off bottom-right.
  const body = [
    'M1500 604C1524 520 1476 428 1406 388C1354 362 1296 372 1276 420C1256 476 1290 548 1340 584C1384 622 1466 642 1500 604Z',
    taper([1350, 424], [1288, 336], [1404, 282], [1326, 206], 76, 36, 14),
    'M1504 556C1530 616 1488 664 1418 662C1384 660 1364 640 1368 614C1374 580 1424 552 1476 540Z',
    bone([1392, 640], [1442, 684], 50, 32, 0.04),
    bone([1442, 684], [1372, 704], 30, 14, 0.04),
    bone([1334, 468], [1290, 574], 50, 34, -0.06),
    bone([1290, 574], [1290, 696], 34, 20, 0.06),
    taper([1492, 598], [1560, 690], [1610, 740], [1690, 772], 64, 18, 12),
  ].map((d) => `<path d="${d}"/>`).join('');
  const talons = [[1270, 700], [1286, 704], [1302, 702], [1366, 706], [1382, 708], [1398, 706]].map(([x, y]) => `<path d="M${x - 4} ${y - 6}L${x - 12} ${y + 12}L${x + 6} ${y}Z"/>`).join('');
  // Spines down the back of the neck (pointing back) and along the spine.
  let spines = '';
  [[1342, 236], [1362, 280], [1352, 322], [1336, 362], [1376, 392]].forEach(([x, y], i) => {
    spines += `<path d="M${x - 4} ${y - 10}L${x + 20 + i * 2} ${y - 14}L${x} ${y + 8}Z"/>`;
  });
  [[1452, 420], [1484, 462]].forEach(([x, y]) => {
    spines += `<path d="M${x - 10} ${y - 4}L${x + 14} ${y - 14}L${x + 4} ${y + 10}Z"/>`;
  });

  // Head, facing left: skull with brow ridge over the eye socket, hooked snout, open jaw, swept-back horns.
  const head = [
    'M1334 176L1302 160Q1272 154 1252 166L1216 176L1186 190L1176 204L1196 206L1250 202L1296 214L1330 216Z',
    'M1302 216L1252 224L1206 242L1196 250L1216 252L1264 238L1314 230Z',
    bone([1318, 166], [1412, 118], 20, 1, 0.1),
    bone([1326, 182], [1418, 168], 14, 1, 0.08),
    bone([1300, 218], [1336, 246], 10, 1, 0),
    bone([1262, 162], [1278, 134], 8, 1, 0),
  ].map((d) => `<path d="${d}"/>`).join('');
  let teeth = '';
  for (let i = 0; i < 5; i++) teeth += `<path d="M${1204 + i * 18} ${205 - i * 0.6}l4 10l4 -10Z"/><path d="M${1214 + i * 17} ${240 - i * 3.4}l4 -9l4 9Z"/>`;

  // Embers drawn into the charging fireball.
  const fx = 1196;
  const fy = 226;
  const embers = [200, 235, 160, 290].map((deg, i) => `<g transform="translate(${fx} ${fy}) rotate(${deg})"><circle cx="0" cy="0" r="${3 - (i % 2)}" fill="${core}" style="animation: dbtefx-rb-draw 2.4s ease-in ${n1(-i * 0.6)}s infinite;"/></g>`).join('');

  // Smoke strata banked across the sky: soft, lit from below.
  let smoke = '';
  for (let i = 0; i < 6; i++) {
    smoke += `<ellipse cx="${n1(100 + rand() * 1400)}" cy="${n1(90 + rand() * 420)}" rx="${n1(280 + rand() * 260)}" ry="${n1(26 + rand() * 26)}" fill="url(#dbtefx-rb-haze)" ${anim('drift', 28 + i * 6, i * 4, 'ease-in-out')}/>`;
  }
  // Distant range with a low, jagged, broken cone; the crater rim glows.
  const ridge = 'M0 730L120 712L214 724L282 690L318 650L338 662L356 640L384 646L402 664L444 700L520 718L660 704L780 728L940 708L1100 732L1600 744V900H0Z';
  const crag = 'M1176 900L1204 770L1250 716L1330 702L1462 698L1540 722L1600 760V900Z';

  return `<style>
@keyframes dbtefx-rb-wr { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(4deg); } }
@keyframes dbtefx-rb-wl { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-4deg); } }
@keyframes dbtefx-rb-charge { 0%, 100% { transform: scale(0.8); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 1; } }
@keyframes dbtefx-rb-draw { 0% { transform: translateX(90px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateX(6px); opacity: 0; } }
</style>
<defs>${glow('dbtefx-rb-sun', t.accent, 0.5, 0.5, 0.5, 0.6)}${glow('dbtefx-rb-crater', fire, 0.5, 0.5, 0.5, 0.6)}${glow('dbtefx-rb-eye', t.accent, 0.5, 0.5, 0.5, 0.95)}${glow('dbtefx-rb-haze', ink, 0.5, 0.5, 0.5, 0.8)}
<radialGradient id="dbtefx-rb-ball"><stop offset="0" stop-color="${core}"/><stop offset="0.3" stop-color="${fire}" stop-opacity="0.95"/><stop offset="0.65" stop-color="${t.accent}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-rb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ink}"/><stop offset="0.5" stop-color="${mix(t.bg, t.accent, 0.12)}"/><stop offset="0.8" stop-color="${mix(t.bg, t.accent, 0.3)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent2, 0.22)}"/></linearGradient>
<path id="dbtefx-rb-wn" d="${near.d}"/><path id="dbtefx-rb-wf" d="${far.d}"/><g id="dbtefx-rb-body">${body}${spines}${talons}${head}</g></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-rb-sky)"/>
<circle cx="1380" cy="300" r="460" fill="url(#dbtefx-rb-sun)"/>
<ellipse cx="358" cy="650" rx="150" ry="90" fill="url(#dbtefx-rb-crater)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
${smoke}
<path d="${ridge}" fill="${ink}"/>
<!--mid-->
<g transform="translate(1176 720) scale(0.76) translate(-1176 -720)">
<g style="transform-origin: 1372px 404px; animation: dbtefx-rb-wl 4s ease-in-out infinite;"><use href="#dbtefx-rb-wf" fill="${t.accent}" fill-opacity="0.4" transform="translate(2 5)"/><use href="#dbtefx-rb-wf" fill="${membrane}"/><path d="${far.bones}" fill="${boneTone}"/></g>
<use href="#dbtefx-rb-body" fill="${t.accent}" fill-opacity="0.6" transform="translate(2 5)"/>
<use href="#dbtefx-rb-body" fill="${ink}"/>
<g fill="${fire}" fill-opacity="0.85">${teeth}</g>
<circle cx="1266" cy="178" r="34" fill="url(#dbtefx-rb-eye)" ${anim('pulse', 3, 0, 'ease-in-out')}/>
<path d="M1254 180L1270 173L1281 177L1266 183Z" fill="${mix(t.accent, '#ffffff', 0.4)}"/>
<circle cx="${fx}" cy="${fy}" r="64" fill="url(#dbtefx-rb-ball)" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-rb-charge 2.4s ease-in-out infinite;"/>
${embers}
<g style="transform-origin: 1414px 398px; animation: dbtefx-rb-wr 4s ease-in-out infinite;"><use href="#dbtefx-rb-wn" fill="${t.accent}" fill-opacity="0.5" transform="translate(2 5)"/><use href="#dbtefx-rb-wn" fill="${membrane}"/><path d="${near.bones}" fill="${boneTone}"/></g>
</g>
<!--near-->
<path d="${crag}" fill="${t.accent}" fill-opacity="0.5" transform="translate(0 -4)"/>
<path d="${crag}" fill="${ink}"/>`;
};

export default blackDragon;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ember', count: 80, colors: ['accent', 'warning', 'accent2'] },
  { kind: 'ash', count: 30, colors: ['muted'] },
];
