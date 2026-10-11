import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';

// Stardust Dragon: Satellite at night. The unfinished Daedalus Bridge reaches
// out over black water toward the lights of Neo Domino; above the scrap
// heaps Stardust Dragon rears on the right, slender silver-white crystal
// armour with a mint sheen, blade wings raised in a V. A river of stardust
// pours off the wings and sweeps across the top of the sky, sparkles flaring
// in a wave along it. Not Synchro (no tuner rings, no light column) and not
// Blue-Eyes White Dragon (no lightning, no ice): a serpentine crystal dragon,
// a night city and the sparkle trail.

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

// Frames along a sampled centreline: point, unit normal, width at that point
// (widths given per control point, interpolated).
const frames = (pts, widths, per) => {
  const c = spline(pts, per);
  return c.map(([x, y], i) => {
    const [ax, ay] = c[Math.max(0, i - 1)];
    const [bx, by] = c[Math.min(c.length - 1, i + 1)];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    const u = (i / (c.length - 1)) * (widths.length - 1);
    const k = Math.min(widths.length - 2, Math.floor(u));
    const w = widths[k] + (widths[k + 1] - widths[k]) * (u - k);
    return { x, y, nx: -(by - ay) / len, ny: (bx - ax) / len, tx: (bx - ax) / len, ty: (by - ay) / len, w };
  });
};

// A tapering limb: offset (-1..1) shifts it toward one flank, scale narrows it.
const ribbon = (pts, widths, per = 8, offset = 0, scale = 1) => {
  const f = frames(pts, widths, per);
  const side = (sgn) => f.map(({ x, y, nx, ny, w }) => `${n1(x + nx * w * (offset * 0.5 + sgn * scale * 0.5))} ${n1(y + ny * w * (offset * 0.5 + sgn * scale * 0.5))}`);
  return `M${side(1).join('L')}L${side(-1).reverse().join('L')}Z`;
};

// Cross-bands along a limb (armour segment seams).
const bands = (pts, widths, per, every, offset = 0, scale = 1, skip = 1) => {
  const f = frames(pts, widths, per);
  let d = '';
  f.forEach(({ x, y, nx, ny, tx, ty, w }, i) => {
    if (i < skip || i > f.length - 1 - skip || i % every) return;
    const a = w * (offset * 0.5 + scale * 0.5);
    const b = w * (offset * 0.5 - scale * 0.5);
    d += `M${n1(x + nx * a)} ${n1(y + ny * a)}Q${n1(x + nx * (a + b) * 0.5 + tx * w * 0.18)} ${n1(y + ny * (a + b) * 0.5 + ty * w * 0.18)} ${n1(x + nx * b)} ${n1(y + ny * b)}`;
  });
  return d;
};

const lerp = (a, b, s) => [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s];

// Dots as zero-length round-capped segments (compact).
const dots = (list) => list.map(([x, y]) => `M${n1(x)} ${n1(y)}h0`).join('');

const stardust = (t) => {
  const rand = rng(57);
  const night = mix(t.bg, '#000000', 0.35);
  const silver = mix(t.text, t.accent, 0.15);
  const plate = mix(t.text, t.accent, 0.5);
  const shade = mix(t.accent, t.bg, 0.5);
  const deep = mix(t.accent, t.bg, 0.74);
  const seam = mix(t.accent, t.bg, 0.62);
  const gem = mix(t.link, t.bg, 0.4);
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

  // ---- mid: the dragon ----
  // A wing: an armoured bone and three ranks of crystal blades (primaries off the
  // hand, secondaries along the forearm, short coverts over their roots), with a
  // soft glow behind so the fan reads as one surface. Each blade is cut in two
  // facets, lit and shaded, like cut crystal.
  const blade = (b, tip, w, cls) => {
    const dx = tip[0] - b[0];
    const dy = tip[1] - b[1];
    const len = Math.hypot(dx, dy) || 1;
    const [nx, ny] = [-dy / len, dx / len];
    const h = w / 2;
    const p = (s, k) => `${n1(b[0] + dx * s + nx * h * k)} ${n1(b[1] + dy * s + ny * h * k)}`;
    return {
      fill: `<path d="M${p(0, 1)}C${p(0.4, 1.1)} ${p(0.75, 0.6)} ${tip[0]} ${tip[1]}L${p(0, 0)}Z" fill="url(#dbtefx-sd-${cls})"/><path d="M${p(0, -1)}C${p(0.4, -0.9)} ${p(0.75, -0.25)} ${tip[0]} ${tip[1]}L${p(0, 0)}Z" fill="url(#dbtefx-sd-facet)"/>`,
      ridge: `M${p(0.05, 0.1)}L${p(0.92, 0.06)}`,
      lit: `M${p(0.04, 1)}C${p(0.4, 1.1)} ${p(0.75, 0.6)} ${tip[0]} ${tip[1]}`,
    };
  };
  const wing = (root, elbow, wrist, claw, primaries, secondaries) => {
    const bone = spline([root, elbow, wrist], 10);
    const at = (s) => bone[Math.round(s * (bone.length - 1))];
    const all = [...secondaries.map(([s, tip, w]) => blade(at(s), tip, w, 'blade1')), ...primaries.map(([s, tip, w]) => blade(lerp(at(s), claw, 0.12), tip, w, 'blade0'))];
    const coverts = secondaries.map(([s, tip, w]) => blade(at(s), lerp(at(s), tip, 0.36), w * 0.95, 'blade0'));
    const tips = [...primaries, ...secondaries.slice().reverse()].map(([, tip]) => `${tip[0]} ${tip[1]}`);
    return `<path d="M${n1(root[0])} ${n1(root[1])}L${n1(wrist[0])} ${n1(wrist[1])}L${tips.join('L')}Z" fill="${t.accent}" fill-opacity="0.07"/>
<g stroke="${seam}" stroke-width="1.4" stroke-linejoin="round">${all.map((b) => b.fill).join('')}</g>
<path d="${all.map((b) => b.ridge).join('')}" stroke="${shade}" stroke-opacity="0.8" stroke-width="1.6"/>
<path d="${all.map((b) => b.lit).join('')}" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="1.6"/>
<g stroke="${seam}" stroke-width="1.2" stroke-linejoin="round">${coverts.map((b) => b.fill).join('')}</g>
<path d="${ribbon([root, elbow, wrist], [56, 36, 22], 10)}" fill="url(#dbtefx-sd-plate)" stroke="${seam}" stroke-width="1.8"/>
<path d="${ribbon([root, elbow, wrist], [56, 36, 22], 10, -0.55, 0.3)}" fill="#ffffff" fill-opacity="0.6"/>
<path d="${bands([root, elbow, wrist], [56, 36, 22], 10, 3)}" fill="none" stroke="${shade}" stroke-width="1.4"/>
<path d="M${n1(wrist[0] + 12)} ${n1(wrist[1] + 4)}Q${n1(wrist[0] - 6)} ${n1(claw[1] + 30)} ${claw[0]} ${claw[1]}Q${n1(wrist[0] + 4)} ${n1(claw[1] + 36)} ${n1(wrist[0] - 12)} ${n1(wrist[1] + 10)}Z" fill="url(#dbtefx-sd-plate)" stroke="${seam}" stroke-width="1.4"/>
<circle cx="${elbow[0]}" cy="${elbow[1]}" r="20" fill="url(#dbtefx-sd-plate)" stroke="${seam}" stroke-width="1.8"/><circle cx="${elbow[0]}" cy="${elbow[1]}" r="11" fill="${gem}"/><circle cx="${elbow[0]}" cy="${elbow[1]}" r="11" fill="url(#dbtefx-sd-gem)"/>`;
  };

  // A close-up: one great wing rising behind, the neck climbing out of the
  // bottom-right corner, the head turned left toward the sky it has just crossed.
  const theWing = wing([1450, 560], [1330, 330], [1190, 130], [1158, 80],
    [[1, [1108, 44], 40], [0.97, [1176, 14], 44], [0.93, [1260, 6], 46], [0.88, [1340, 26], 46]],
    [[0.74, [1404, 72], 46], [0.6, [1452, 140], 44], [0.46, [1482, 216], 40], [0.32, [1494, 300], 36]]);

  const neckPts = [[1338, 372], [1388, 448], [1418, 548], [1404, 656], [1374, 760], [1384, 930]];
  const neckW = [100, 116, 124, 132, 144, 156];
  const neck = ribbon(neckPts, neckW, 6);
  const throat = ribbon(neckPts.slice(1), neckW.slice(1), 6, 0.5, 0.42);
  const throatSeams = bands(neckPts.slice(1), neckW.slice(1), 8, 2, 0.5, 0.42);
  const nape = ribbon(neckPts, neckW, 6, -0.62, 0.24);
  const napeSeams = bands(neckPts, neckW, 8, 3, -0.3, 0.6);
  let crest = '';
  frames(neckPts, neckW, 4).forEach(({ x, y, nx, ny, tx, ty, w }, i, f) => {
    if (i < 1 || i > f.length - 2) return;
    const h = -w * 0.5;
    const r = 18 + i * 0.8;
    const [bx, by] = [x + nx * h, y + ny * h];
    crest += `M${n1(bx - tx * r)} ${n1(by - ty * r)}Q${n1(bx - nx * r * 1.3 - tx * r * 0.2)} ${n1(by - ny * r * 1.3 - ty * r * 0.2)} ${n1(bx + tx * r * 0.9 - nx * r * 0.2)} ${n1(by + ty * r * 0.9 - ny * r * 0.2)}Z`;
  });

  // The head: a long beaked skull of crystal plates, a crown of blade horns.
  const head = `<path d="M1318 304Q1372 226 1452 176Q1384 246 1350 316ZM1336 330Q1400 280 1474 262Q1408 300 1356 344ZM1300 296Q1326 198 1392 124Q1346 214 1324 306ZM1270 292Q1280 228 1316 182Q1298 240 1290 296Z" fill="url(#dbtefx-sd-plate)" stroke="${seam}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="M1350 316Q1384 246 1452 176Q1392 236 1334 310ZM1324 306Q1346 214 1392 124Q1338 200 1312 300ZM1356 344Q1408 300 1474 262Q1400 292 1346 334ZM1290 296Q1298 240 1316 182Q1290 236 1282 294Z" fill="${deep}" fill-opacity="0.55"/>
<path d="M1086 344L1124 352L1206 358L1300 380L1356 396L1300 406L1222 394L1180 374Z" fill="${shade}" stroke="${seam}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="M1086 344L1150 336Q1210 326 1270 324L1330 334L1378 342L1358 396L1300 380L1206 358L1124 352Z" fill="url(#dbtefx-sd-cheek)" stroke="${seam}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="M1086 344L1096 330Q1150 312 1216 298L1290 290Q1332 292 1354 308L1378 342L1330 334Q1270 322 1210 326L1150 336Z" fill="url(#dbtefx-sd-skull)" stroke="${seam}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="M1096 330Q1150 312 1216 298L1290 290Q1332 292 1354 308" fill="none" stroke="#ffffff" stroke-width="2.4"/>
<path d="M1108 349L1206 357L1300 379" fill="none" stroke="${deep}" stroke-width="3" stroke-linecap="round"/>
<path d="M1212 334L1272 320L1298 326L1286 342L1236 346Z" fill="${deep}"/>
<path d="M1230 337L1276 326L1286 331L1268 340Z" fill="${t.accent}"/>
<path d="M1240 336L1270 329" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
<path d="M1200 328L1290 310L1322 318" fill="none" stroke="${deep}" stroke-width="3.4" stroke-linecap="round"/>
<path d="M1112 334L1128 330" stroke="${deep}" stroke-width="2.4" stroke-linecap="round"/>
<path d="M1300 396L1366 466L1344 396ZM1330 388L1414 424L1366 382Z" fill="url(#dbtefx-sd-plate)" stroke="${seam}" stroke-width="1.4" stroke-linejoin="round"/>
<path d="M1344 396L1366 466L1324 400ZM1366 382L1414 424L1356 392Z" fill="${deep}" fill-opacity="0.5"/>`;


  // ---- the stardust trail: a band off the wings, sparkles flaring in a wave ----
  const strand = (dy, bow) => spline([[1140, 200 + dy * 0.3], [1040, 128 + dy * 0.6], [860, 86 + dy - bow], [620, 90 + dy - bow], [420, 128 + dy], [250, 200 + dy * 0.8], [120, 284 + dy * 0.6]], 7);
  const trail = strand(0, 0);
  const pathOf = (pts) => `M${pts.map(([x, y]) => `${n1(x)} ${n1(y)}`).join('L')}`;
  const trailD = pathOf(trail);
  const strands = pathOf(strand(-34, 16)) + pathOf(strand(30, -10));
  let sparkles = '';
  const nSp = 24;
  for (let i = 0; i < nSp; i++) {
    const p = trail[Math.round(((i + 0.5) / nSp) * (trail.length - 1))];
    const s = 5 + rand() * 7 * (1 - i / nSp) + 4;
    sparkles += `<path d="${glint(p[0] + (rand() - 0.5) * 60, p[1] + (rand() - 0.5) * 48, s)}" fill="${i % 4 ? '#ffffff' : t.accent}" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-sd-flare 6s ease-in-out ${n1(-(i / nSp) * 6)}s infinite;"/>`;
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

  return `<style>
@keyframes dbtefx-sd-flare { 0%, 100% { opacity: 0.12; transform: scale(0.4) rotate(0deg); } 10% { opacity: 1; transform: scale(1.2) rotate(25deg); } 28% { opacity: 0.3; transform: scale(0.65) rotate(45deg); } }
@keyframes dbtefx-sd-beatn { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-4deg); } }
@keyframes dbtefx-sd-beatf { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(4deg); } }
@keyframes dbtefx-sd-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
@keyframes dbtefx-sd-rise { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
</style>
<defs>
<pattern id="dbtefx-sd-win" width="6" height="10" patternUnits="userSpaceOnUse"><rect x="2" y="3" width="2.4" height="3" fill="${city}"/></pattern>
<pattern id="dbtefx-sd-win2" width="30" height="40" patternUnits="userSpaceOnUse"><path d="M2 3h2.4v3H2ZM14 13h2.4v3H14ZM26 23h2.4v3H26ZM8 33h2.4v3H8ZM20 3h2.4v3H20Z" fill="${city}" fill-opacity="0.85"/></pattern>
<linearGradient id="dbtefx-sd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}"/><stop offset="0.66" stop-color="${mix(t.bg, t.accent, 0.07)}"/><stop offset="0.785" stop-color="${mix(t.bg, city, 0.16)}"/><stop offset="0.787" stop-color="${night}"/><stop offset="1" stop-color="${mix(night, '#000000', 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-sd-neb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.2"/><stop offset="0.6" stop-color="${t.accent}" stop-opacity="0.06"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-neb2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.12"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.5)}" stop-opacity="0.3"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.09"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sd-blade0" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.5" stop-color="${silver}" stop-opacity="0.8"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.45"/></linearGradient>
<linearGradient id="dbtefx-sd-blade1" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${silver}" stop-opacity="0.9"/><stop offset="0.6" stop-color="${plate}" stop-opacity="0.7"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.35"/></linearGradient>
<linearGradient id="dbtefx-sd-blade2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${plate}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
<linearGradient id="dbtefx-sd-blade3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade}"/><stop offset="1" stop-color="${mix(deep, t.bg, 0.4)}"/></linearGradient>
<linearGradient id="dbtefx-sd-cheek" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${silver}"/><stop offset="1" stop-color="${shade}"/></linearGradient>
<linearGradient id="dbtefx-sd-facet" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade}" stop-opacity="0.85"/><stop offset="1" stop-color="${deep}" stop-opacity="0.7"/></linearGradient>
<linearGradient id="dbtefx-sd-membrane" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.3)}" stop-opacity="0.32"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.12"/></linearGradient>
<linearGradient id="dbtefx-sd-plate" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="${silver}"/><stop offset="1" stop-color="${shade}"/></linearGradient>
<linearGradient id="dbtefx-sd-body" x1="0" y1="0.2" x2="1" y2="0"><stop offset="0" stop-color="${mix(silver, '#ffffff', 0.4)}"/><stop offset="0.5" stop-color="${plate}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
<linearGradient id="dbtefx-sd-skull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.55" stop-color="${silver}"/><stop offset="1" stop-color="${plate}"/></linearGradient>
<radialGradient id="dbtefx-sd-gem" cx="0.4" cy="0.35" r="0.6"><stop offset="0" stop-color="${mix(t.link, '#ffffff', 0.6)}" stop-opacity="0.95"/><stop offset="0.5" stop-color="${t.link}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.link}" stop-opacity="0"/></radialGradient>
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
<ellipse cx="1290" cy="340" rx="340" ry="400" fill="url(#dbtefx-sd-halo)" style="animation: dbtefx-sd-glow 7s ease-in-out infinite;"/>
<g transform="translate(-24 60)"><g style="animation: dbtefx-sd-rise 8s ease-in-out infinite;">
<g style="transform-origin: 1450px 560px; animation: dbtefx-sd-beatf 8s ease-in-out infinite;">${theWing}</g>
<path d="${neck}" fill="url(#dbtefx-sd-body)" stroke="${seam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="${nape}" fill="${deep}" fill-opacity="0.5"/>
<path d="${crest}" fill="url(#dbtefx-sd-plate)" stroke="${seam}" stroke-width="1.2" stroke-linejoin="round"/>
<path d="${throat}" fill="url(#dbtefx-sd-skull)"/>
<path d="${ribbon(neckPts, neckW, 6, 0.9, 0.08)}" fill="#ffffff" fill-opacity="0.7"/>
<path d="${throatSeams}" fill="none" stroke="${shade}" stroke-opacity="0.7" stroke-width="1.4"/>
<circle cx="1330" cy="800" r="30" fill="${gem}" stroke="${seam}" stroke-width="2"/><circle cx="1330" cy="800" r="30" fill="url(#dbtefx-sd-gem)"/>
<path d="M1314 786A18 18 0 0 1 1334 780" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="3" stroke-linecap="round"/>
${head}
<circle cx="1330" cy="800" r="52" fill="url(#dbtefx-sd-gem)" style="animation: dbtefx-sd-glow 3.5s ease-in-out infinite;"/>
</g></g>
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
