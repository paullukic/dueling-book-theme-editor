import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Divine Beasts: the three Egyptian Gods stacked in the right-hand column,
// stepping down the right edge in one rendering: a deep body, a lighter
// plane, a thin rim of the god's own colour and one breathing inner glow.
// Obelisk the Tormentor (blue) stands at the top, the Winged Dragon of Ra
// (gold) rises before its turning sun below him, and Slifer the Sky Dragon
// (crimson) coils at the foot with both mouths open.

// Samples a chain of cubic segments [[p0, p1, p2, p3], ...] into points.
const sample = (segs, steps) => {
  const out = [];
  segs.forEach(([a, b, c, d], s) => {
    for (let i = s ? 1 : 0; i <= steps; i++) {
      const u = i / steps;
      const v = 1 - u;
      out.push([0, 1].map((k) => v * v * v * a[k] + 3 * v * v * u * b[k] + 3 * v * u * u * c[k] + u * u * u * d[k]));
    }
  });
  return out;
};

// A tapering body along points: outline, side edges and normals.
const ribbon = (pts, w0, w1) => {
  const L = [];
  const R = [];
  const N = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const n = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
    const w = (w0 + (w1 - w0) * (i / (pts.length - 1))) / 2;
    N.push([n[0], n[1], w]);
    L.push([n1(p[0] + n[0] * w), n1(p[1] + n[1] * w)]);
    R.push([n1(p[0] - n[0] * w), n1(p[1] - n[1] * w)]);
  });
  const d = `M${L.map((q) => q.join(' ')).join('L')}L${[...R].reverse().map((q) => q.join(' ')).join('L')}Z`;
  return { d, L, R, N };
};

// Obelisk's right half (horned head to chest); the left half mirrors it.
const titan = 'M-1 -150Q8 -100 16 -70L54 -112Q46 -70 34 -40L36 0L30 30L14 54L40 62Q90 60 120 40L150 10Q196 -12 236 -74Q230 -16 208 36L282 -14Q262 48 248 88L316 76Q272 110 250 140Q268 220 262 300L262 420L-1 420Z';
const titanRim = 'M-1 -150Q8 -100 16 -70L54 -112Q46 -70 34 -40L36 0L30 30L14 54L40 62Q90 60 120 40L150 10Q196 -12 236 -74Q230 -16 208 36L282 -14Q262 48 248 88L316 76Q272 110 250 140Q268 220 262 300';
const titanPlanes = 'M14 54Q30 90 60 100Q110 100 130 60M40 62Q60 150 40 220M-1 120Q50 130 90 170M150 10Q180 60 200 140';

const scene = (t) => {
  const rand = rng(2207);
  const gold = t.accent;
  const goldDeep = mix(gold, '#000000', 0.62);
  const goldMid = mix(gold, '#000000', 0.38);
  const red = mix(t.danger, '#000000', 0.12);
  const redDeep = mix(red, '#000000', 0.58);
  const redBelly = mix(red, '#000000', 0.38);
  const blue = t.opp;
  const blueDeep = mix(blue, '#000000', 0.7);

  // Ambient: carved cartouche bands across the temple wall.
  const marks = ['M-8 -8A8 8 0 1 1 8 -8L0 0ZM0 0V10M-8 3H8', 'M-10 0Q0 -9 10 0Q0 8 -10 0Z', 'M-10 -3Q-5 -9 0 -3T10 -3M-10 6Q-5 0 0 6T10 6', 'M0 -10V10M-7 -3L0 -10L7 -3', 'M-8 10V-4Q0 -12 8 -4V10'];
  let cartouches = '';
  for (let r = 0; r < 4; r++) {
    const y = 230 + r * 200;
    for (let c = 0; c < 9; c++) {
      const x = 80 + c * 180 + (r % 2) * 90;
      cartouches += `<rect x="${x - 64}" y="${y - 24}" width="128" height="48" rx="24"/><path d="M${x + 68} ${y - 20}V${y + 20}"/>`;
      for (let k = 0; k < 3; k++) cartouches += `<path transform="translate(${x - 32 + k * 32} ${y})" d="${marks[Math.floor(rand() * marks.length)]}"/>`;
    }
  }

  // Ra: wings of three feather rows, raised over the turning sun.
  const raX = 1300;
  const raY = 470;
  const feather = (bx, by, ang, len, wid) => {
    const [tx, ty] = polar(bx, by, len, ang);
    const [lx, ly] = polar(bx, by, len * 0.42, ang - wid);
    const [rx, ry] = polar(bx, by, len * 0.42, ang + wid);
    return `M${n1(bx)} ${n1(by)}Q${lx} ${ly} ${tx} ${ty}Q${rx} ${ry} ${n1(bx)} ${n1(by)}Z`;
  };
  const wing = (dir, k) => {
    const S = [raX - 10 * dir, raY - 90];
    const E = [raX - 60 * dir * k, raY - 190 * k];
    const Wr = [raX - 110 * dir * k, raY - 300 * k];
    const on = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
    const turn = (deg) => (dir > 0 ? deg : 180 - deg);
    let prim = '';
    let sec = '';
    let cov = '';
    for (let i = 0; i < 7; i++) {
      const f = i / 6;
      const [bx, by] = on(Wr, E, f);
      prim += feather(bx, by, turn(262 - f * 60), (180 - f * 40) * k, 15);
    }
    for (let i = 0; i < 6; i++) {
      const f = i / 5;
      const [bx, by] = on(E, S, f * 0.9);
      sec += feather(bx, by, turn(200 - f * 30), (140 - f * 50) * k, 17);
      cov += feather(bx, by, turn(214 - f * 30), (80 - f * 24) * k, 22);
    }
    const arm = `M${S[0]} ${S[1]}Q${n1(E[0] + 20 * dir)} ${n1(E[1] + 10)} ${n1(Wr[0])} ${n1(Wr[1])}Q${n1(E[0] + 2 * dir)} ${n1(E[1] + 30)} ${S[0] + 6 * dir} ${S[1] + 30}Z`;
    return `<path d="${prim}" fill="${goldDeep}"/><path d="${sec}" fill="url(#dbtefx-dv-plume)"/><path d="${cov}" fill="${goldMid}"/><path d="${arm}" fill="${goldMid}"/><path d="${prim}${sec}" fill="none" stroke="${gold}" stroke-opacity="0.75" stroke-width="1.2"/>`;
  };
  let rays = '';
  for (let i = 0; i < 36; i++) {
    const [x1, y1] = polar(0, 0, 150, i * 10 - 1.6);
    const [x2, y2] = polar(0, 0, 150, i * 10 + 1.6);
    const [x3, y3] = polar(0, 0, i % 2 ? 250 : 330, i * 10);
    rays += `M${x1} ${y1}L${x3} ${y3}L${x2} ${y2}Z`;
  }
  const neck = ribbon(sample([[[raX + 6, raY - 60], [raX + 10, raY - 120], [raX - 40, raY - 150], [raX - 34, raY - 214]]], 12), 70, 40);
  let neckPlates = '';
  neck.L.forEach((q, i) => {
    if (i % 2 === 0 && i > 0 && i < 12) neckPlates += `M${q.join(' ')}Q${n1((q[0] + neck.R[i][0]) / 2 + 6)} ${n1((q[1] + neck.R[i][1]) / 2 + 8)} ${neck.R[i].join(' ')}`;
  });
  const chest = `M${raX - 46} ${raY - 80}C${raX - 74} ${raY} ${raX - 40} ${raY + 100} ${raX + 6} ${raY + 150}C${raX + 50} ${raY + 100} ${raX + 66} ${raY} ${raX + 46} ${raY - 80}Z`;
  const raHead = 'M0 0C2 -24 -18 -38 -42 -38C-60 -38 -72 -30 -80 -20L-110 -16C-124 -14 -132 -4 -128 10C-122 4 -114 2 -104 4L-82 8C-70 18 -50 24 -30 22C-12 20 2 12 0 0Z';
  const raCrest = 'M-14 -30L58 -92L30 -36L84 -64L36 -14L80 -20L20 8Z';

  // Slifer: three S-coils across the bottom right, head raised at the top.
  const sp = sample([
    [[1214, 616], [1300, 600], [1410, 610], [1420, 664]],
    [[1420, 664], [1430, 716], [1300, 712], [1252, 742]],
    [[1252, 742], [1196, 778], [1236, 830], [1340, 812]],
    [[1340, 812], [1430, 796], [1470, 846], [1530, 920]],
  ], 14);
  const sl = ribbon(sp, 70, 14);
  const belly = ribbon(sp.map((p, i) => [p[0] + sl.N[i][0] * sl.N[i][2] * 0.6, p[1] + sl.N[i][1] * sl.N[i][2] * 0.6]), 24, 5);
  let ribs = '';
  let spines = '';
  sp.forEach((p, i) => {
    const [nx, ny, w] = sl.N[i];
    if (i % 2 === 0) ribs += `M${n1(p[0] + nx * w * 0.06)} ${n1(p[1] + ny * w * 0.06)}L${sl.L[i].join(' ')}`;
    if (i % 4 === 2 && i < sp.length - 4) {
      const a = sl.R[i - 1];
      const b = sl.R[i + 1];
      const len = 8 + w * 0.45;
      spines += `M${a.join(' ')}L${n1(p[0] - nx * (w + len) - (b[0] - a[0]) * 1.4)} ${n1(p[1] - ny * (w + len) - (b[1] - a[1]) * 1.4)}L${b.join(' ')}Z`;
    }
  });
  const skull = 'M6 -6C-10 -40 -56 -56 -98 -48C-120 -44 -140 -36 -156 -30C-170 -26 -180 -18 -182 -8C-170 -10 -160 -8 -150 -6C-120 -4 -90 -2 -40 4Z';
  const jaw = 'M-40 8C-80 12 -120 18 -150 26C-158 30 -160 36 -152 40C-120 36 -80 32 -36 30Z';
  const jaw2 = 'M-30 40C-60 44 -90 50 -114 58C-122 62 -120 70 -110 70C-80 66 -50 62 -22 58Z';
  const throat = 'M6 -6L-40 4L-40 30L-30 40L-24 60L10 56L18 20Z';
  const horns = 'M-84 -48Q-40 -120 30 -140Q-14 -96 -50 -42ZM-56 -42Q8 -102 92 -106Q22 -72 -24 -30ZM-26 -30Q44 -60 110 -50Q40 -28 0 -12ZM-6 28Q40 40 80 70Q34 62 -2 46Z';
  const teeth = 'M-142 -6L-137 6L-132 -5ZM-122 -5L-118 4L-114 -4ZM-102 -4L-99 3L-96 -3ZM-140 22L-135 13L-130 21ZM-118 19L-114 11L-110 18ZM-106 54L-102 46L-98 53ZM-86 52L-82 45L-78 51Z';

  return `<defs>
<linearGradient id="dbtefx-dv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, gold, 0.12)}" stop-opacity="0.95"/><stop offset="0.55" stop-color="${t.bg}" stop-opacity="0.92"/><stop offset="1" stop-color="${mix(t.bg, red, 0.08)}" stop-opacity="0.95"/></linearGradient>
<radialGradient id="dbtefx-dv-haze" gradientUnits="userSpaceOnUse" cx="${raX}" cy="${raY - 150}" r="700"><stop offset="0" stop-color="${gold}" stop-opacity="0.3"/><stop offset="0.4" stop-color="${gold}" stop-opacity="0.08"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dv-titan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(blueDeep, blue, 0.5)}"/><stop offset="0.6" stop-color="${mix(blueDeep, blue, 0.2)}" stop-opacity="0.95"/><stop offset="1" stop-color="${blueDeep}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-dv-trim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(blue, '#ffffff', 0.35)}"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-dv-oeye"><stop offset="0" stop-color="#ffffff"/><stop offset="0.25" stop-color="${blue}" stop-opacity="0.85"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dv-sun"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.35" stop-color="${mix(gold, '#ffffff', 0.4)}" stop-opacity="0.7"/><stop offset="0.75" stop-color="${gold}" stop-opacity="0.2"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dv-plume" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${goldMid}"/><stop offset="1" stop-color="${goldDeep}"/></linearGradient>
<linearGradient id="dbtefx-dv-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${goldMid}"/><stop offset="0.55" stop-color="${goldDeep}"/><stop offset="1" stop-color="${goldDeep}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-dv-orb"><stop offset="0" stop-color="#ffffff"/><stop offset="0.3" stop-color="${gold}" stop-opacity="0.9"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dv-maw"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.3" stop-color="${mix(red, gold, 0.5)}" stop-opacity="0.8"/><stop offset="1" stop-color="${red}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-dv-sky)"/>
<g fill="none" stroke="${gold}" stroke-opacity="0.05" stroke-width="2.5" stroke-linecap="round">${cartouches}</g>
<rect width="${W}" height="${H}" fill="url(#dbtefx-dv-haze)"/>
<g transform="translate(1346 222) scale(0.52)">
<path d="${titan}" fill="url(#dbtefx-dv-titan)"/><path d="${titan}" fill="url(#dbtefx-dv-titan)" transform="scale(-1 1)"/>
<g fill="none" stroke="${blue}" stroke-opacity="0.3" stroke-width="2.5"><path d="${titanPlanes}"/><path d="${titanPlanes}" transform="scale(-1 1)"/></g>
<g fill="none" stroke="url(#dbtefx-dv-trim)" stroke-width="3" stroke-linejoin="round"><path d="${titanRim}"/><path d="${titanRim}" transform="scale(-1 1)"/></g>
<path d="M-30 -8L-8 -2L-10 6L-32 1ZM30 -8L8 -2L10 6L32 1Z" fill="#000000"/>
<g ${anim('pulse', 6, 0, 'ease-in-out')}><circle cx="-19" cy="-1" r="34" fill="url(#dbtefx-dv-oeye)"/><circle cx="19" cy="-1" r="34" fill="url(#dbtefx-dv-oeye)"/></g>
</g>
<!--mid-->
<g transform="translate(1226 560) scale(0.68) translate(${-raX} ${-raY})">
<g transform="translate(${raX + 10} ${raY - 150})"><path d="${rays}" fill="${gold}" fill-opacity="0.16" style="animation: dbtefx-spin 60s linear infinite;"/></g>
<circle cx="${raX + 10}" cy="${raY - 150}" r="170" fill="url(#dbtefx-dv-sun)" ${anim('bloom', 6, 2, 'ease-in-out')}/>
<circle cx="${raX + 10}" cy="${raY - 150}" r="150" fill="none" stroke="${mix(gold, '#ffffff', 0.5)}" stroke-opacity="0.45" stroke-width="2"/>
${wing(-1, 0.86)}
<path d="${chest}" fill="url(#dbtefx-dv-body)"/>
<path d="M${raX - 46} ${raY - 80}C${raX - 74} ${raY} ${raX - 40} ${raY + 100} ${raX + 6} ${raY + 150}" fill="none" stroke="${gold}" stroke-opacity="0.75" stroke-width="1.5"/>
<path d="M${raX - 40} ${raY - 30}Q${raX} ${raY - 6} ${raX + 44} ${raY - 30}M${raX - 40} ${raY + 14}Q${raX} ${raY + 38} ${raX + 42} ${raY + 14}M${raX - 30} ${raY + 58}Q${raX} ${raY + 80} ${raX + 32} ${raY + 58}" fill="none" stroke="${gold}" stroke-opacity="0.4" stroke-width="1.5"/>
<circle cx="${raX}" cy="${raY - 50}" r="40" fill="url(#dbtefx-dv-orb)" ${anim('pulse', 6, 2, 'ease-in-out')}/>
${wing(1, 1)}
<path d="${neck.d}" fill="${goldMid}"/>
<path d="M${neck.L.map((q) => q.join(' ')).join('L')}" fill="none" stroke="${gold}" stroke-opacity="0.8" stroke-width="1.5"/>
<path d="${neckPlates}" fill="none" stroke="${goldDeep}" stroke-width="2"/>
<g transform="translate(${raX - 28} ${raY - 226}) scale(1.45)">
<path d="${raCrest}" fill="${goldDeep}" stroke="${gold}" stroke-opacity="0.8" stroke-width="1"/>
<path d="${raHead}" fill="${goldMid}" stroke="${gold}" stroke-width="1.2" stroke-linejoin="round"/>
<path d="M-80 -20Q-60 -14 -40 -24M-82 8Q-60 6 -44 -2M-30 22Q-12 6 -14 -18" fill="none" stroke="${goldDeep}" stroke-width="1.5"/>
<path d="M-66 -24Q-58 -30 -48 -26Q-56 -18 -66 -24Z" fill="#ffffff"/>
</g>
</g>
<!--near-->
<g transform="translate(1372 760) scale(0.58) translate(-1300 -700)">
<path d="${sl.d}" fill="${redDeep}"/>
<path d="${belly.d}" fill="${redBelly}"/>
<path d="${ribs}" stroke="${redDeep}" stroke-width="2.5"/>
<path d="${spines}" fill="${redDeep}" stroke="${red}" stroke-opacity="0.8" stroke-width="1.2" stroke-linejoin="round"/>
<path d="M${sl.R.map((q) => q.join(' ')).join('L')}" fill="none" stroke="${red}" stroke-opacity="0.85" stroke-width="1.5"/>
<g transform="translate(1216 612) rotate(-24)">
<path d="${horns}" fill="${redDeep}" stroke="${red}" stroke-opacity="0.85" stroke-width="1.2" stroke-linejoin="round"/>
<path d="${throat}" fill="${redDeep}"/>
<path d="M-40 4L-150 -6L-148 22L-40 30ZM-40 30L-140 38L-112 54L-30 40Z" fill="#000000" fill-opacity="0.7"/>
<circle cx="-110" cy="16" r="58" fill="url(#dbtefx-dv-maw)" ${anim('pulse', 6, 4, 'ease-in-out')}/>
<path d="${skull}" fill="${redDeep}" stroke="${red}" stroke-width="1.5" stroke-linejoin="round"/>
<path d="${jaw}" fill="${redDeep}" stroke="${red}" stroke-width="1.5" stroke-linejoin="round"/>
<path d="${jaw2}" fill="${redDeep}" stroke="${red}" stroke-width="1.5" stroke-linejoin="round"/>
<path d="${teeth}" fill="#ffffff" fill-opacity="0.9"/>
<path d="M-98 -48Q-70 -40 -40 -34M-70 -2Q-50 -14 -20 -12M-36 -30Q-10 -20 0 4" fill="none" stroke="${red}" stroke-opacity="0.6" stroke-width="1.5"/>
<path d="M-122 -30Q-108 -40 -92 -32Q-106 -24 -122 -30Z" fill="${t.warning}"/>
<path d="M-107 -37Q-104 -31 -107 -25Q-110 -31 -107 -37Z" fill="#000000"/>
<circle cx="-70" cy="-46" r="6" fill="${t.accent2}" stroke="#ffffff" stroke-opacity="0.7" stroke-width="1"/>
</g>
</g>`;
};

export default scene;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ember', count: 50, colors: ['accent', 'warning'], speed: 0.5 },
  { kind: 'mote', count: 24, colors: ['opp', 'accent'] },
];
