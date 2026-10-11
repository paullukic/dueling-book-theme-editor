import { mix } from '../../../lib/color.js';
import { anim, H, n1, rng, W } from './kit.js';

// Angelechy: a celestial chessboard above a sea of cloud, seen low and still.
// Ivory Staunton pieces in angelic armour (a winged, haloed king, a winged
// knight, a rook and the e4 pawn) stand on true one-point perspective squares.

// Ground plane to screen: X across (squares), Z depth (squares from the eye).
const VX = 700;
const HY = 420;
const BOFF = 2;
const F = 1000;
const CAM = 1.5;
const PIECE = 760;
const Z0 = 3.1;
const at = (x, z) => [n1(VX + (F * x) / z), n1(HY + (F * CAM) / z)];
const quad = (x0, z0, x1, z1) => {
  const p = [at(x0, z0), at(x1, z0), at(x1, z1), at(x0, z1)];
  return `M${p.map((q) => q.join(' ')).join('L')}Z`;
};

// A lathe silhouette from the right-hand profile, mirrored to the left.
// Nodes: [x, y] line, or [x, y, c1x, c1y, c2x, c2y] cubic, in piece units.
const lathe = (nodes) => {
  const f = (v) => n1(v * 100);
  let d = 'M0 0';
  nodes.forEach((n) => {
    d += n.length > 2 ? `C${f(n[2])} ${f(n[3])} ${f(n[4])} ${f(n[5])} ${f(n[0])} ${f(n[1])}` : `L${f(n[0])} ${f(n[1])}`;
  });
  const back = [];
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    const prev = i ? nodes[i - 1] : [0, 0];
    back.push(n.length > 2 ? `C${f(-n[4])} ${f(n[5])} ${f(-n[2])} ${f(n[3])} ${f(-prev[0])} ${f(prev[1])}` : `L${f(-prev[0])} ${f(prev[1])}`);
  }
  return `${d}${back.join('')}Z`;
};

const BASE = [
  [0.5, 0], [0.5, -0.07], [0.43, -0.15, 0.5, -0.12, 0.47, -0.14], [0.41, -0.27, 0.48, -0.17, 0.48, -0.25], [0.3, -0.33, 0.35, -0.28, 0.31, -0.3],
];
const KING = lathe([
  ...BASE,
  [0.19, -1.15, 0.28, -0.6, 0.19, -0.85], [0.33, -1.2], [0.33, -1.27], [0.2, -1.31], [0.37, -1.8, 0.21, -1.5, 0.31, -1.7], [0.39, -1.86], [0.22, -1.93, 0.37, -1.92, 0.29, -1.93],
  [0.06, -2.1, 0.19, -2.02, 0.12, -2.08], [0.06, -2.22], [0.17, -2.22], [0.17, -2.33], [0.06, -2.33], [0.06, -2.48], [0, -2.48],
]);
const ROOK = lathe([
  ...BASE,
  [0.27, -1.12, 0.25, -0.6, 0.24, -0.95], [0.4, -1.22, 0.3, -1.16, 0.37, -1.18], [0.4, -1.55], [0.27, -1.55], [0.27, -1.47], [0.12, -1.47], [0.12, -1.55], [0, -1.55],
]);
const PAWN = lathe([
  [0.42, 0], [0.42, -0.06], [0.36, -0.13, 0.42, -0.1, 0.39, -0.12], [0.34, -0.22, 0.4, -0.15, 0.4, -0.2], [0.24, -0.27, 0.28, -0.23, 0.25, -0.25],
  [0.15, -0.74, 0.21, -0.45, 0.15, -0.62], [0.28, -0.78], [0.28, -0.84], [0.14, -0.88], [0.25, -1.08, 0.22, -0.91, 0.25, -0.99], [0, -1.32, 0.25, -1.21, 0.14, -1.32],
]);
// The Destrier: a Staunton horse head (facing left) on a turned base.
const KNIGHT =
  'M-50 0L50 0L50 -7C50 -12 47 -14 43 -15C48 -17 48 -25 41 -27C37 -30 37 -33 36 -36' +
  'C48 -70 46 -110 34 -140C30 -152 24 -164 16 -172L19 -192L4 -177C-8 -175 -20 -168 -30 -157' +
  'C-40 -146 -50 -134 -56 -122C-62 -112 -58 -100 -46 -98C-36 -96 -26 -98 -20 -100' +
  'C-12 -104 -6 -108 -3 -110C-16 -92 -30 -72 -34 -56C-38 -46 -40 -40 -36 -36' +
  'C-37 -33 -37 -30 -41 -27C-48 -25 -48 -17 -43 -15C-47 -14 -50 -12 -50 -7Z';

const angelechy = (t) => {
  const rand = rng(64);
  const ivory = mix(t.text, t.accent, 0.06);
  const shade = mix(t.text, t.opp, 0.45);
  const deep = mix(t.bg, t.opp, 0.35);
  const gold = t.accent;
  const darkSq = mix(t.bg, t.opp, 0.16);
  const lightSq = mix(t.bg, t.text, 0.28);

  // Board squares, a gilt frame and an engraved ring on the cloud floor.
  let dark = '';
  let light = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = quad(c - 4 + BOFF, Z0 + r, c - 3 + BOFF, Z0 + r + 1);
      if ((r + c) % 2) light += sq;
      else dark += sq;
    }
  }
  const ring = (rad, zc) => {
    const pts = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      const z = zc + rad * Math.sin(a);
      if (z > 1.2) pts.push(at(BOFF + rad * Math.cos(a), z).join(' '));
    }
    return `M${pts.join('L')}`;
  };
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const z1 = Z0 + 4 + 6.1 * Math.sin(a);
    const z2 = Z0 + 4 + 6.6 * Math.sin(a);
    if (z1 < 1.6 || z2 < 1.6) continue;
    const p1 = at(BOFF + 6.1 * Math.cos(a), z1);
    const p2 = at(BOFF + 6.6 * Math.cos(a), z2);
    ticks += `M${p1.join(' ')}L${p2.join(' ')}`;
  }

  // A piece standing on square (file 0-7, rank 0-7): contact shadow, a
  // glossy reflection in the board, then the piece, shaded as a turned solid.
  let shapes = '';
  const piece = (file, rank, body, extra = '', behind = '', dim = 1) => {
    const z = Z0 + rank + 0.5;
    const [px, py] = at(file - 3.5 + BOFF, z);
    const s = Math.round((PIECE * F) / z / 100) / 1000;
    const id = `dbtefx-ae-p${file}${rank}`;
    const ref = `href="#${id}"`;
    shapes += `<path id="${id}" d="${body}"/>`;
    const solid = `<use ${ref} fill="url(#dbtefx-ae-ivory)" stroke="${gold}" stroke-opacity="0.6" stroke-width="1" vector-effect="non-scaling-stroke"/><use ${ref} fill="url(#dbtefx-ae-ao)"/>${dim < 1 ? `<use ${ref} fill="${mix(t.bg, t.opp, 0.3)}" fill-opacity="${n1(1 - dim)}"/>` : ''}`;
    return `<g transform="translate(${px} ${py}) scale(${s})">
<ellipse cx="0" cy="2" rx="64" ry="10" fill="#000000" fill-opacity="0.5"/>
<g transform="scale(1 -0.6)" opacity="0.2" mask="url(#dbtefx-ae-fade)">${solid}</g>
${behind}${solid}${extra}</g>`;
  };
  const bands = (ys) => ys.map(([y, w]) => `<path d="M${-w} ${y}h${w * 2}" stroke="${gold}" stroke-width="3" stroke-opacity="0.85"/>`).join('');

  // An angel wing: one solid swept silhouette with a scalloped trailing
  // edge, feather lines running from each tip back to the arm, and a band of
  // coverts along the arm.
  const cubicAt = (p, u) => [0, 1].map((k) => n1((1 - u) ** 3 * p[0][k] + 3 * (1 - u) ** 2 * u * p[1][k] + 3 * (1 - u) * u * u * p[2][k] + u ** 3 * p[3][k]));
  const scallop = (pts, cx, cy, k) => {
    let d = '';
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      d += `Q${n1((ax + bx) / 2 + (cx - (ax + bx) / 2) * k)} ${n1((ay + by) / 2 + (cy - (ay + by) / 2) * k)} ${bx} ${by}`;
    }
    return d;
  };
  const wing = (dir) => {
    const arm = [[14, -128], [44, -210], [100, -300], [175, -370]];
    const tips = [];
    for (let i = 0; i <= 11; i++) {
      const a = ((-56 + i * 15.5) * Math.PI) / 180;
      const k = 1 + 0.3 * (1 - i / 11) ** 2;
      tips.push([n1(56 + Math.cos(a) * 128 * k), n1(-218 + Math.sin(a) * 112 * k)]);
    }
    tips[0] = arm[3];
    const roots = tips.map((q, i) => cubicAt(arm, 1 - i / 13));
    const lines = tips.slice(1, -1).map((q, i) => `M${roots[i + 1].join(' ')}L${q.join(' ')}`).join('');
    const cov = [];
    for (let i = 0; i <= 8; i++) {
      const [x, y] = cubicAt(arm, 1 - i / 9);
      cov.push([n1(x + 16 - i * 1.5), n1(y + 30 - i * 1.5)]);
    }
    const shape = `M${arm[0].join(' ')}C${arm[1].join(' ')} ${arm[2].join(' ')} ${arm[3].join(' ')}${scallop(tips, 60, -230, -0.2)}L${arm[0].join(' ')}Z`;
    const covShape = `M${arm[0].join(' ')}C${arm[1].join(' ')} ${arm[2].join(' ')} ${arm[3].join(' ')}L${cov[0].join(' ')}${scallop(cov, 40, -300, -0.25)}Z`;
    return `<g transform="scale(${dir} 1)"><path d="${shape}" fill="url(#dbtefx-ae-plume)"/><path d="${lines}" fill="none" stroke="${shade}" stroke-width="1.6" stroke-opacity="0.9"/><path d="${covShape}" fill="url(#dbtefx-ae-plume2)"/><path d="M${arm[0].join(' ')}C${arm[1].join(' ')} ${arm[2].join(' ')} ${arm[3].join(' ')}" fill="none" stroke="${gold}" stroke-width="3.5" stroke-linecap="round"/></g>`;
  };
  const halo = (cy, rx) =>
    `<ellipse cx="0" cy="${cy}" rx="${n1(rx * 2.4)}" ry="${n1(rx * 1.3)}" fill="url(#dbtefx-ae-glow)"/><ellipse cx="0" cy="${cy}" rx="${rx}" ry="${n1(rx * 0.28)}" fill="none" stroke="${gold}" stroke-width="4"/><ellipse cx="0" cy="${cy}" rx="${rx}" ry="${n1(rx * 0.28)}" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.8"/>`;

  const kingWings = `<g stroke="${gold}" stroke-opacity="0.45" stroke-width="0.8" vector-effect="non-scaling-stroke" style="transform-origin: 0px -128px; animation: dbtefx-ae-breathe 5s ease-in-out infinite;"><g transform="translate(0 -128) scale(0.85) translate(0 128)">${wing(1)}${wing(-1)}</g></g>`;
  const king = piece(6, 5, KING, `${bands([[-124, 31], [-185, 37]])}<path d="M-6 -222h12" stroke="#ffffff" stroke-width="2" stroke-opacity="0.7"/><g ${anim('pulse', 5, 0, 'ease-in-out')}>${halo(-282, 36)}</g>`, kingWings);
  const knightWing = `<g transform="translate(24 -30) rotate(-4) scale(0.5)" stroke="${gold}" stroke-opacity="0.5" stroke-width="0.8" vector-effect="non-scaling-stroke">${wing(1)}</g>`;
  const mane = [[37, -64], [40, -82], [40, -100], [37, -117], [32, -133], [26, -148], [19, -162]]
    .map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="11" transform="rotate(${-20 + i * 6} ${x} ${y})" fill="url(#dbtefx-ae-leaf)"/>`)
    .join('');
  const knight = piece(6, 3, KNIGHT, `<path d="M-24 -142C-10 -132 -6 -118 -10 -106C-22 -110 -34 -122 -24 -142Z" fill="${shade}" fill-opacity="0.45"/><path d="M-42 -128C-34 -124 -28 -116 -26 -104" fill="none" stroke="${shade}" stroke-opacity="0.6" stroke-width="2"/><path d="M-28 -150C-24 -154 -18 -155 -13 -151C-18 -148 -23 -148 -28 -150Z" fill="${deep}"/><path d="M-30 -156C-24 -162 -16 -162 -10 -156" fill="none" stroke="${shade}" stroke-width="2"/>${mane}${bands([[-37, 37]])}`, knightWing);
  const rook = piece(5, 7, ROOK, `${bands([[-119, 37]])}<path d="M-7 -108v-22a7 7 0 0 1 14 0v22z" fill="${deep}" stroke="${gold}" stroke-opacity="0.6"/>`, '', 0.8);
  const pawn = piece(4, 3, PAWN, `${bands([[-81, 27]])}<g ${anim('pulse', 6, 2, 'ease-in-out')}>${halo(-150, 22)}</g>`);

  // e4: the square the opening pawn claims, glowing gold.
  const e4 = quad(0 + BOFF, Z0 + 3, 1 + BOFF, Z0 + 3 + 1);

  let stars = '';
  for (let i = 0; i < 60; i++) {
    stars += `<circle cx="${n1(rand() * W)}" cy="${n1(rand() * 360)}" r="${n1(0.6 + rand() * 1.3)}"/>`;
  }
  const twinkles = [[1180, 70], [1420, 160], [930, 120], [1320, 40], [250, 90], [640, 60]]
    .map(([x, y], i) => `<path d="M${x} ${y - 9}L${x + 1.6} ${y - 1.6}L${x + 9} ${y}L${x + 1.6} ${y + 1.6}L${x} ${y + 9}L${x - 1.6} ${y + 1.6}L${x - 9} ${y}L${x - 1.6} ${y - 1.6}Z" ${anim('bloom', n1(3 + i * 0.7), i * 1.3, 'ease-in-out')}/>`)
    .join('');
  // A sea of cloud from the horizon down: puffs lit from above, growing
  // with nearness.
  let sea = '';
  for (let row = 0; row < 6; row++) {
    const rad = 16 + row ** 1.7 * 15;
    const y = HY + 8 + row ** 1.5 * 40;
    let puffs = '';
    for (let x = -rad - rand() * rad; x < W + rad; x += rad * (2 + rand() * 1.2)) {
      const r = rad * (0.8 + rand() * 0.5);
      puffs += `<ellipse cx="${n1(x)}" cy="${n1(y + (rand() - 0.5) * rad * 0.4)}" rx="${n1(r * 1.9)}" ry="${n1(r * 0.8)}"/>`;
    }
    sea += `<g fill="url(#dbtefx-ae-puff)" opacity="${n1(0.35 + row * 0.11)}">${puffs}</g>`;
  }
  const sx = 1220;
  let rays = '';
  for (let i = 0; i < 22; i++) {
    const a0 = -96 + i * 5.2 + (rand() - 0.5) * 3;
    const w = 0.5 + rand() * (i % 3 ? 1.2 : 2.6);
    const [x1, y1] = [sx + Math.cos(((a0 - w) * Math.PI) / 180) * 640, HY + Math.sin(((a0 - w) * Math.PI) / 180) * 640];
    const [x2, y2] = [sx + Math.cos(((a0 + w) * Math.PI) / 180) * 640, HY + Math.sin(((a0 + w) * Math.PI) / 180) * 640];
    rays += `M${sx} ${HY}L${n1(x1)} ${n1(y1)}L${n1(x2)} ${n1(y2)}Z`;
  }
  let ticks2 = '';
  for (let i = 0; i < 64; i++) {
    const a0 = (i / 64) * Math.PI * 2;
    const r0 = i % 4 ? 192 : 180;
    ticks2 += `M${n1(sx + Math.cos(a0) * r0)} ${n1(HY + Math.sin(a0) * r0)}L${n1(sx + Math.cos(a0) * 200)} ${n1(HY + Math.sin(a0) * 200)}`;
  }

  return `<style>@keyframes dbtefx-ae-rays { 0%, 100% { transform: rotate(-2.5deg); opacity: 0.75; } 50% { transform: rotate(2.5deg); opacity: 1; } }</style>
<defs>
<linearGradient id="dbtefx-ae-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.bg}"/><stop offset="0.4" stop-color="${mix(t.bg, t.opp, 0.2)}"/><stop offset="0.56" stop-color="${mix(t.bg, t.accent, 0.32)}"/><stop offset="0.7" stop-color="${mix(t.bg, t.opp, 0.16)}"/><stop offset="1" stop-color="${t.bg}"/></linearGradient>
<radialGradient id="dbtefx-ae-puff" cx="0.5" cy="0.3" r="0.6"><stop offset="0" stop-color="${mix(t.opp, t.text, 0.5)}" stop-opacity="0.38"/><stop offset="0.55" stop-color="${mix(t.bg, t.opp, 0.45)}" stop-opacity="0.3"/><stop offset="1" stop-color="${mix(t.bg, t.opp, 0.3)}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ae-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.7"/><stop offset="0.12" stop-color="${t.accent}" stop-opacity="0.45"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ae-ray" gradientUnits="userSpaceOnUse" cx="${sx}" cy="${HY}" r="640"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.24"/><stop offset="0.35" stop-color="${t.accent}" stop-opacity="0.06"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ae-sky)"/>
<g fill="${t.text}" fill-opacity="0.55">${stars}</g>
<g fill="${t.accent}" fill-opacity="0.85">${twinkles}</g>
<path d="${rays}" fill="url(#dbtefx-ae-ray)" style="transform-origin: ${sx}px ${HY}px; animation: dbtefx-ae-rays 24s ease-in-out infinite;"/>
<g style="transform-origin: ${sx}px ${HY}px; animation: dbtefx-spin 240s linear infinite;" fill="none" stroke="${t.accent}"><circle cx="${sx}" cy="${HY}" r="200" stroke-opacity="0.35" stroke-width="2"/><circle cx="${sx}" cy="${HY}" r="180" stroke-opacity="0.22"/><path d="${ticks2}" stroke-opacity="0.3" stroke-width="1.5"/><circle cx="${sx}" cy="${HY}" r="224" stroke-opacity="0.14" stroke-dasharray="2 10"/></g>
<ellipse cx="${sx}" cy="${HY}" rx="320" ry="220" fill="url(#dbtefx-ae-sun)" ${anim('pulse', 9, 0, 'ease-in-out')}/>
<g ${anim('drift', 46, 0, 'ease-in-out')}>${sea}</g>
<!--mid-->
<style>@keyframes dbtefx-ae-breathe { 0%, 100% { transform: scale(0.96, 1); } 50% { transform: scale(1.04, 1); } }</style>
<defs>
<linearGradient id="dbtefx-ae-ivory" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(shade, t.bg, 0.45)}"/><stop offset="0.16" stop-color="${shade}"/><stop offset="0.34" stop-color="${ivory}"/><stop offset="0.44" stop-color="#ffffff"/><stop offset="0.56" stop-color="${ivory}"/><stop offset="0.82" stop-color="${shade}"/><stop offset="0.94" stop-color="${mix(shade, t.bg, 0.35)}"/><stop offset="1" stop-color="${mix(t.accent, t.text, 0.4)}"/></linearGradient>
<linearGradient id="dbtefx-ae-ao" x1="0" y1="0" x2="0" y2="1"><stop offset="0.8" stop-color="${t.bg}" stop-opacity="0"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0.45"/></linearGradient>
<linearGradient id="dbtefx-ae-plume" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="${ivory}"/><stop offset="1" stop-color="${shade}"/></linearGradient>
<linearGradient id="dbtefx-ae-plume2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${mix(ivory, t.accent, 0.35)}"/></linearGradient>
<linearGradient id="dbtefx-ae-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.5)}"/><stop offset="1" stop-color="${mix(t.accent, '#000000', 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-ae-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.45"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ae-fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.opp, 0.2)}"/><stop offset="0.5" stop-color="${mix(t.bg, t.opp, 0.2)}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-ae-fadeg" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<mask id="dbtefx-ae-fade" maskContentUnits="userSpaceOnUse"><rect x="-200" y="-300" width="400" height="300" fill="url(#dbtefx-ae-fadeg)"/></mask>
<linearGradient id="dbtefx-ae-lsq" gradientUnits="userSpaceOnUse" x1="0" y1="${at(0, Z0 + 8)[1]}" x2="0" y2="${H}"><stop offset="0" stop-color="${mix(t.bg, t.text, 0.16)}"/><stop offset="1" stop-color="${lightSq}"/></linearGradient>
<linearGradient id="dbtefx-ae-dsq" gradientUnits="userSpaceOnUse" x1="0" y1="${at(0, Z0 + 8)[1]}" x2="0" y2="${H}"><stop offset="0" stop-color="${mix(t.bg, t.opp, 0.08)}"/><stop offset="1" stop-color="${darkSq}"/></linearGradient>
${shapes}
<radialGradient id="dbtefx-ae-e4" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.75"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.15"/></radialGradient>
<radialGradient id="dbtefx-ae-sheen" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
</defs>
<g fill="none" stroke="${gold}" stroke-opacity="0.35"><path d="${ring(6.1, Z0 + 4)}" stroke-width="1.5"/><path d="${ring(6.6, Z0 + 4)}" stroke-width="2.5"/><path d="${ticks}" stroke-opacity="0.25"/></g>
<path d="${quad(BOFF - 4.25, Z0 - 0.25, BOFF + 4.25, Z0 + 8.25)}" fill="${mix(t.bg, t.accent, 0.35)}" stroke="${gold}" stroke-opacity="0.8" stroke-width="2"/>
<path d="${quad(BOFF - 4.08, Z0 - 0.08, BOFF + 4.08, Z0 + 8.08)}" fill="${t.bg}" stroke="${gold}" stroke-opacity="0.5"/>
<path d="${dark}" fill="url(#dbtefx-ae-dsq)"/>
<path d="${light}" fill="url(#dbtefx-ae-lsq)"/>
<ellipse cx="${sx}" cy="${at(0, Z0 + 5)[1]}" rx="70" ry="150" fill="url(#dbtefx-ae-sheen)" ${anim('pulse', 9, 0, 'ease-in-out')}/>
<path d="${e4}" fill="url(#dbtefx-ae-e4)" ${anim('pulse', 4, 0, 'ease-in-out')}/>
<path d="${quad(BOFF - 4.25, Z0 + 3, BOFF + 4.25, Z0 + 8.25)}" fill="url(#dbtefx-ae-fog)"/>
${rook}<g class="dbtefx-ae-hero">${king}</g>${pawn}<g class="dbtefx-ae-hero">${knight}</g>`;
};

export default angelechy;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'feather', count: 14, colors: ['text', 'accent'], speed: 0.7 },
  { kind: 'mote', count: 36, colors: ['accent', 'text'] },
];
