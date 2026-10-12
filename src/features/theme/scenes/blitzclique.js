import { mix } from '../../../lib/color.js';
import { H, n1, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Blitzclique: Hideout in the Sky, Coulomb. Surge Blitzclique, the real card
// artwork loaded live from DuelingBook (cardart.js), stands in front of the
// storm at dusk; below her the scrapyard gang's floating shanty-island
// crosses the low sun: a craggy rock trailing pipes and cables, graffitied
// container-shacks, the crew banner and badge billboard, a windmill, a crane,
// two tesla coils and the lattice radio tower that catches the storm's
// lightning. Warm haze rises from the city far below. Offline, the storm,
// island and glow remain.
const blitzclique = (t) => {
  const rand = rng(77);
  const dark = mix(t.bg, '#000000', 0.35);
  const mint = t.accent;
  const mintHi = mix(t.accent, '#ffffff', 0.55);
  const orange = t.accent2;
  const steel = mix(t.bg, t.muted, 0.38);
  const steelHi = mix(t.muted, t.text, 0.3);
  const haze = mix(t.bg, t.accent2, 0.5);

  // A container-shack seen three-quarter: lit roof, front face, dark side face,
  // a window grid (some lit) and an optional graffiti tag.
  const shack = (x, y, w, h, col, seed, tag) => {
    const r = rng(seed);
    const d = 13;
    const front = mix(col, t.bg, 0.6);
    const side = mix(col, t.bg, 0.8);
    const roof = mix(mix(col, t.bg, 0.35), mint, 0.18);
    let wins = '';
    let lit = '';
    const cols = Math.max(1, Math.floor((w - 12) / 18));
    const rows = Math.max(1, Math.floor((h - 18) / 24));
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (r() < 0.25) continue;
        const wx = n1(x + 8 + i * ((w - 16) / cols) + 2);
        const wy = n1(y + 10 + j * 24);
        const ww = n1((w - 16) / cols - 6);
        if (r() < 0.42) lit += `M${wx} ${wy}h${ww}v11h${-ww}Z`;
        else wins += `M${wx} ${wy}h${ww}v11h${-ww}Z`;
      }
    }
    const ribs = Array.from({ length: Math.floor(w / 9) }, (_, i) => `M${n1(x + 4 + i * 9)} ${y + 2}v${h - 4}`).join('');
    const scrawl = tag ? `<path d="M${x + 10} ${y + h - 30}h14l-6 8h8l-16 18l5 -12h-8Z" fill="${tag}" fill-opacity="0.85"/><path d="M${x + 13} ${y + h - 21}v7M${x + 27} ${y + h - 22}v5" stroke="${tag}" stroke-opacity="0.7" stroke-width="1.6" stroke-linecap="round"/>` : '';
    return `<path d="M${x} ${y}l${d} ${-d * 0.6}h${w}l${-d} ${d * 0.6}Z" fill="${roof}"/><path d="M${x + w} ${y}l${d} ${-d * 0.6}v${h}l${-d} ${d * 0.6}Z" fill="${side}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${front}"/><path d="${ribs}" stroke="${dark}" stroke-opacity="0.22" stroke-width="2"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#dbtefx-bcq-shade)"/><path d="${wins}" fill="${dark}" fill-opacity="0.75"/><path d="${lit}" fill="${t.warning}" fill-opacity="0.8"/>${scrawl}<path d="M${x} ${y}h${w}" stroke="${mintHi}" stroke-opacity="0.35" stroke-width="1.4"/>`;
  };

  // The crew badge: a rounded shield with a notched crown edge, a cream top,
  // a dark lower half split by a bolt, ringed in orange.
  const badge = (cx, cy, s) => {
    const p = (pts) => pts.map(([a, b], i) => `${i ? 'L' : 'M'}${n1(cx + a * s)} ${n1(cy + b * s)}`).join('');
    const outer = `${p([[-20, -12], [-12, -20], [-6, -13], [2, -23], [8, -14], [14, -20], [20, -12], [20, 10]])}Q${n1(cx + 20 * s)} ${n1(cy + 22 * s)} ${n1(cx + 8 * s)} ${n1(cy + 22 * s)}H${n1(cx - 8 * s)}Q${n1(cx - 20 * s)} ${n1(cy + 22 * s)} ${n1(cx - 20 * s)} ${n1(cy + 10 * s)}Z`;
    const lower = `${p([[-17, 2], [-4, 2], [2, -4], [4, 3], [17, 0], [17, 9]])}Q${n1(cx + 17 * s)} ${n1(cy + 19 * s)} ${n1(cx + 7 * s)} ${n1(cy + 19 * s)}H${n1(cx - 7 * s)}Q${n1(cx - 17 * s)} ${n1(cy + 19 * s)} ${n1(cx - 17 * s)} ${n1(cy + 9 * s)}Z`;
    const bolt = p([[-2, -18], [6, -18], [1, -9], [7, -9], [-5, 1], [-1, -6], [-6, -6]]);
    return `<path d="${outer}" fill="${mix(t.text, orange, 0.08)}" stroke="${orange}" stroke-width="${n1(3.4 * s)}" stroke-linejoin="round"/><path d="${lower}" fill="${mix(t.bg, '#000000', 0.2)}"/><path d="${bolt}Z" fill="${orange}"/><text x="${cx}" y="${n1(cy + 15.5 * s)}" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="${n1(12 * s)}" fill="${orange}" letter-spacing="${n1(-0.5 * s)}">BC</text>`;
  };

  // Hero geometry: island centre 1300, deck at 560.
  const deck = 560;
  const rock = 'M1094 566L1112 598L1138 610L1150 648L1178 668L1196 706L1226 726L1246 764L1272 790L1290 818L1306 792L1336 764L1368 740L1398 704L1428 684L1450 644L1476 612L1506 566Z';
  const strata = 'M1120 600Q1300 640 1480 606M1156 654Q1300 690 1446 650M1200 708Q1300 736 1396 708M1244 758Q1290 772 1340 760';
  const cracks = 'M1160 612L1172 640L1166 662M1330 620L1322 660L1336 690M1420 640L1410 668M1250 690L1262 724L1256 748';

  // Pipes and rebar hanging under the rock; two cables sway.
  const pipes = `<path d="M1232 724l-6 30M1350 748l8 26M1300 790l-2 24" stroke="${steel}" stroke-width="2.4" stroke-linecap="round"/>`;
  const cable = (x, y, len, bend, dur, delay) =>
    `<g style="transform-origin: ${x}px ${y}px; animation: dbtefx-reed ${dur}s ease-in-out ${-delay}s infinite;"><path d="M${x} ${y}q${bend} ${len * 0.5} ${bend * 0.4} ${len}" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><circle cx="${n1(x + bend * 0.4)}" cy="${y + len}" r="3.2" fill="${orange}" fill-opacity="0.8"/></g>`;

  // Stacked shacks, back rows first so each lower row's roof hides the bases above it.
  const rows = [
    [1262, 266, 76, 64, orange, 4, null],
    [1176, 330, 72, 84, t.danger, 5, null],
    [1252, 304, 100, 110, t.muted, 6, t.opp],
    [1356, 344, 56, 70, t.success, 7, null],
    [1140, 390, 78, 118, t.warning, 8, t.accent],
    [1222, 412, 70, 96, mint, 9, null],
    [1298, 378, 90, 130, t.opp, 10, t.success],
    [1392, 408, 64, 100, orange, 11, null],
    [1112, 498, 70, 62, orange, 12, null],
    [1186, 482, 96, 78, t.muted, 13, t.danger],
    [1286, 504, 64, 56, t.danger, 14, null],
    [1354, 476, 82, 84, t.success, 15, t.opp],
    [1440, 506, 48, 54, t.opp, 16, null],
  ];
  const shacks = rows.map(([x, y, w, h, c, s, tag]) => shack(x, y, w, h, c, s, tag)).join('');

  // An outdoor stair climbing the front, with a rail.
  let steps = '';
  for (let i = 0; i < 7; i++) steps += `h9v-8`;
  const stair = `<path d="M1288 560${steps}V560Z" fill="${mix(t.bg, t.muted, 0.3)}"/><path d="M1288 548l63 -56" stroke="${steelHi}" stroke-opacity="0.6" stroke-width="1.6"/>`;

  // Deck slab and railing.
  let posts = '';
  for (let x = 1100; x <= 1500; x += 16) posts += `M${x} ${deck}v-12`;
  const slab = `<path d="M1090 ${deck}h420v10l-6 6H1096l-6 -6Z" fill="${mix(t.bg, t.muted, 0.32)}"/><path d="M1090 ${deck}h420" stroke="${steelHi}" stroke-opacity="0.5" stroke-width="1.5"/><path d="${posts}M1100 ${deck - 12}H1500" stroke="${steel}" stroke-width="1.4"/>`;

  // Lattice radio tower with an observation saucer and a mast, like the card's.
  let lattice = '';
  for (let i = 0; i < 5; i++) {
    const y0 = 266 - i * 23;
    const y1 = y0 - 23;
    const w0 = 22 - i * 3;
    const w1 = 22 - (i + 1) * 3;
    lattice += `M${1300 - w0} ${y0}L${1300 + w1} ${y1}M${1300 + w0} ${y0}L${1300 - w1} ${y1}M${1300 - w1} ${y1}H${1300 + w1}`;
  }
  const tower = `<path d="M1278 266L1293 151M1322 266L1307 151" stroke="${steelHi}" stroke-width="4" stroke-linecap="round"/><path d="${lattice}" stroke="${steel}" stroke-width="1.6"/>
<path d="M1262 152Q1300 132 1338 152Q1300 168 1262 152Z" fill="${mix(t.bg, t.muted, 0.42)}"/><path d="M1264 150Q1300 136 1336 150" fill="none" stroke="${mintHi}" stroke-opacity="0.7" stroke-width="1.6"/><path d="M1272 156h56" stroke="${t.warning}" stroke-opacity="0.75" stroke-width="3" stroke-dasharray="5 4"/>
<path d="M1300 140V58M1296 120h8M1295 96h10" stroke="${steelHi}" stroke-width="3"/><path d="M1286 110a10 10 0 0 0 8 10" fill="none" stroke="${steelHi}" stroke-width="2"/>`;

  // Tesla coil: base, wound column, two rings and a torus cap, haloed.
  const coil = (x, y, s, delay) => {
    let wind = '';
    for (let i = 0; i < 6; i++) wind += `M${x - 5 * s} ${n1(y - 10 * s - i * 5 * s)}h${10 * s}`;
    return `<circle cx="${x}" cy="${n1(y - 50 * s)}" r="${n1(30 * s)}" fill="url(#dbtefx-bcq-halo)" style="animation: dbtefx-pulse 2.6s ease-in-out ${-delay}s infinite;"/><path d="M${x - 10 * s} ${y}h${20 * s}l-3 ${-6 * s}h${-14 * s}Z" fill="${steel}"/><rect x="${n1(x - 5 * s)}" y="${n1(y - 42 * s)}" width="${n1(10 * s)}" height="${n1(36 * s)}" fill="${mix(t.bg, mint, 0.35)}"/><path d="${wind}" stroke="${mint}" stroke-width="${n1(2 * s)}"/><ellipse cx="${x}" cy="${n1(y - 50 * s)}" rx="${n1(14 * s)}" ry="${n1(5.5 * s)}" fill="${steelHi}" stroke="${mint}" stroke-width="1.5"/><ellipse cx="${x}" cy="${n1(y - 26 * s)}" rx="${n1(9 * s)}" ry="${n1(3 * s)}" fill="none" stroke="${steelHi}" stroke-width="1.6"/>`;
  };

  // Windmill on the right shack, blades turning slowly.
  let blades = '';
  for (let i = 0; i < 4; i++) blades += `<path d="M0 -6L3 -58L12 -56L5 -4Z" fill="${mix(t.text, t.bg, 0.3)}" transform="rotate(${i * 90})"/>`;
  const windmill = `<path d="M1430 408L1438 330H1444L1452 408Z" fill="${steel}"/><path d="M1434 380h14M1436 356h10" stroke="${dark}" stroke-width="1.5"/><g transform="translate(1441 330)"><g style="animation: dbtefx-spin 16s linear infinite;">${blades}</g><circle r="6" fill="${steelHi}" stroke="${dark}" stroke-width="2"/></g>`;

  // Tower crane on the right with a swinging load.
  let jibLat = '';
  for (let x = 1384; x < 1476; x += 14) jibLat += `M${x} ${n1(222 - (x - 1380) * 0.2)}l7 -5l7 5`;
  const crane = `<path d="M1396 344V214M1408 344V214" stroke="${orange}" stroke-width="3"/><path d="M1396 344l12 -16l-12 -16l12 -16l-12 -16l12 -16l-12 -16l12 -16l-12 -16" fill="none" stroke="${mix(orange, t.bg, 0.3)}" stroke-width="1.4"/><path d="M1350 222L1490 194M1350 210L1490 188" stroke="${orange}" stroke-width="2.4"/><path d="${jibLat}" fill="none" stroke="${mix(orange, t.bg, 0.3)}" stroke-width="1.2"/><path d="M1402 214V186M1402 186L1360 211M1402 186L1480 190" stroke="${steelHi}" stroke-width="1.2"/><rect x="1344" y="214" width="20" height="16" fill="${steel}"/>
<g style="transform-origin: 1470px 196px; animation: dbtefx-reed 7s ease-in-out infinite;"><path d="M1470 196V286" stroke="${dark}" stroke-width="1.5"/><path d="M1464 286h12l-3 6h-6Z" fill="${steelHi}"/><path d="M1454 292h32v18h-32Z" fill="${mix(t.success, t.bg, 0.55)}"/><path d="M1458 296v10M1464 296v10M1470 296v10M1476 296v10M1482 296v10" stroke="${dark}" stroke-opacity="0.4" stroke-width="1.5"/></g>`;

  // The crew banner on a pole: dark cloth, a white chevron bolt edged in orange, the badge.
  const flag = `<path d="M1236 332V214" stroke="${steelHi}" stroke-width="3.4"/><circle cx="1236" cy="212" r="4" fill="${orange}"/><g style="transform-origin: 1236px 230px; animation: dbtefx-bcq-flag 5s ease-in-out infinite;"><g transform="translate(1236 228) scale(1.45) translate(-1236 -228)"><path d="M1236 228Q1206 220 1178 232Q1158 240 1142 234L1150 254L1140 276Q1162 280 1182 272Q1208 262 1236 272Z" fill="${mix(t.bg, t.text, 0.14)}" stroke="${mix(t.bg, t.text, 0.3)}" stroke-width="1.2"/><path d="M1236 238L1196 246L1212 254L1166 264L1218 258L1206 252L1236 248Z" fill="${t.text}" stroke="${orange}" stroke-width="2" stroke-linejoin="round"/></g></g>`;

  // Billboard on scaffolding with the badge.
  const board = `<path d="M1132 470V500M1196 470V500" stroke="${steel}" stroke-width="3"/><rect x="1122" y="404" width="84" height="66" fill="${mix(t.bg, t.text, 0.12)}" stroke="${steelHi}" stroke-width="2"/><rect x="1126" y="408" width="76" height="58" fill="url(#dbtefx-bcq-board)"/>${badge(1164, 438, 1.12)}<path d="M1128 474h72" stroke="${t.warning}" stroke-opacity="0.8" stroke-width="2.2" stroke-dasharray="3 5"/>`;

  // Lightning: storm cloud to the tower mast, with a branch; flashes on a slow cycle.
  const bolt = 'M1446 96L1420 164L1438 172L1392 262L1410 270L1352 372L1368 380L1330 489';
  const branch = 'M1420 164L1468 204L1456 210L1490 254M1392 262L1352 282L1362 292L1324 314';
  const strike = `<g style="animation: dbtefx-bcq-strike 7s linear -5.6s infinite;"><circle cx="1330" cy="489" r="90" fill="url(#dbtefx-bcq-halo)"/><path d="${bolt}" fill="none" stroke="${mint}" stroke-opacity="0.35" stroke-width="22" stroke-linejoin="round"/><path d="${bolt}" fill="none" stroke="${mint}" stroke-opacity="0.8" stroke-width="9" stroke-linejoin="round"/><path d="${bolt}" fill="none" stroke="#ffffff" stroke-width="3.6" stroke-linejoin="round"/><path d="${branch}" fill="none" stroke="${mint}" stroke-opacity="0.5" stroke-width="6" stroke-linejoin="round"/><path d="${branch}" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="1.8" stroke-linejoin="round"/></g>`;
  const arc = (d, dur, delay) => `<g style="animation: dbtefx-bcq-arc ${dur}s linear ${-delay}s infinite;"><path d="${d}" fill="none" stroke="${mint}" stroke-opacity="0.5" stroke-width="6" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/></g>`;

  // Far: storm and haze cloud banks, the low sun and the city below.
  const cloud = (x, y, s, n, fill, rim, dy, op) => {
    const r = rng(Math.round(x * 3 + y));
    let d = '';
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1);
      d += `<ellipse cx="${n1(x + (f - 0.5) * n * 40 * s)}" cy="${n1(y - Math.sin(f * Math.PI) * 22 * s - r() * 10 * s)}" rx="${n1((34 + r() * 18) * s)}" ry="${n1((20 + r() * 10) * s)}"/>`;
    }
    const base = `<rect x="${n1(x - n * 20 * s + 6 * s)}" y="${n1(y - 6 * s)}" width="${n1(n * 40 * s - 12 * s)}" height="${n1(26 * s)}" rx="${n1(13 * s)}"/>`;
    return `<g fill-opacity="${op}"><g fill="${rim}" transform="translate(0 ${dy})">${d}${base}</g><g fill="${fill}">${d}${base}</g></g>`;
  };
  // Storm cloud underside: a scalloped belly lit mint by the strike below.
  const storm = (x, y, n) => {
    const r = rng(n * 13);
    let d = '';
    for (let i = 0; i < n; i++) d += `<ellipse cx="${n1(x + (i - (n - 1) / 2) * 42 + r() * 12)}" cy="${n1(y + Math.sin((i / (n - 1)) * Math.PI) * 18 + r() * 12)}" rx="${n1(38 + r() * 22)}" ry="${n1(24 + r() * 12)}"/>`;
    return `<g fill="${mix(t.bg, mint, 0.42)}" fill-opacity="0.8" transform="translate(0 5)">${d}</g><g fill="${mix(t.bg, '#000000', 0.3)}">${d}</g><rect x="${x - n * 22}" y="-40" width="${n * 44}" height="${y + 40}" fill="${mix(t.bg, '#000000', 0.3)}"/>`;
  };
  let city = '';
  for (let x = 0; x < W; ) {
    const w = 30 + rand() * 50;
    const h = 20 + rand() * 50;
    city += `M${n1(x)} ${H}V${n1(H - h)}h${n1(w)}V${H}Z`;
    x += w + rand() * 12;
  }
  const pylons = [210, 640, 1010, 1520].map((x) => `M${x} ${H}L${x + 10} 790L${x + 20} ${H}M${x - 2} 806h24M${x + 2} 820h16`).join('');

  // Near: a utility pole at the far left, its wires running off the top.
  const pole = `<path d="M172 900V96" stroke="${dark}" stroke-width="10"/><path d="M138 118h70M146 140h54" stroke="${dark}" stroke-width="6"/><g fill="${steel}"><rect x="140" y="106" width="6" height="12"/><rect x="200" y="106" width="6" height="12"/><rect x="170" y="106" width="6" height="12"/></g><rect x="178" y="168" width="22" height="36" rx="4" fill="${dark}"/><path d="M143 108Q-40 150 -60 120M203 108Q430 170 720 -6M173 108Q400 150 610 -6" fill="none" stroke="${dark}" stroke-width="2"/>`;

  // Surge Blitzclique, the real card artwork, in front of the storm; the
  // crew's island floats small in the haze below her.
  const hx = 1215;
  const [ix, iy, is] = [810, 466, 0.4];
  const surge = cardArt(t, { id: 'dbtefx-bcq-hero', card: CARDS.surgeBlitzclique, x: hx - 230, y: 10, w: 460, h: 740, focus: [0.42, 0.42], zoom: 0.92, feather: 0.6, fade: 0.6, blend: 'normal', grade: 'contrast(1.1) brightness(0.88)', tint: mix(t.accent2, t.bg, 0.3), tintAmt: 0.14, backdrop: mix(t.bg, mint, 0.2), backdropAmt: 0.85, glow: mint, breathe: 16 });

  return `<style>${CARD_ART_KEYFRAMES}
@keyframes dbtefx-bcq-strike { 0%, 100% { opacity: 0; } 1% { opacity: 1; } 2.5% { opacity: 0.15; } 4% { opacity: 0.95; } 8% { opacity: 0; } }
@keyframes dbtefx-bcq-arc { 0%, 100% { opacity: 0; } 8% { opacity: 1; } 12% { opacity: 0.1; } 16% { opacity: 0.9; } 22% { opacity: 0; } }
@keyframes dbtefx-bcq-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes dbtefx-bcq-flag { 0%, 100% { transform: skewY(0deg) scaleX(1); } 50% { transform: skewY(-5deg) scaleX(0.93); } }
@keyframes dbtefx-bcq-cloud { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-36px); } }
</style>
<defs>
<linearGradient id="dbtefx-bcq-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.opp, 0.16)}" stop-opacity="0.85"/><stop offset="0.38" stop-color="${mix(t.bg, t.opp, 0.06)}" stop-opacity="0.5"/><stop offset="0.62" stop-color="${mix(t.bg, t.accent2, 0.14)}" stop-opacity="0.6"/><stop offset="1" stop-color="${haze}" stop-opacity="0.8"/></linearGradient>
<linearGradient id="dbtefx-bcq-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.muted, 0.34)}"/><stop offset="0.6" stop-color="${mix(t.bg, t.muted, 0.16)}"/><stop offset="1" stop-color="${mix(t.bg, orange, 0.35)}"/></linearGradient>
<linearGradient id="dbtefx-bcq-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.35"/></linearGradient>
<linearGradient id="dbtefx-bcq-board" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(t.bg, orange, 0.45)}"/><stop offset="1" stop-color="${mix(t.bg, t.danger, 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-bcq-halo"><stop offset="0" stop-color="${mint}" stop-opacity="0.6"/><stop offset="1" stop-color="${mint}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-bcq-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${orange}" stop-opacity="0.4"/><stop offset="1" stop-color="${orange}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-bcq-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(t.warning, '#ffffff', 0.4)}"/><stop offset="0.7" stop-color="${mix(t.warning, orange, 0.5)}"/><stop offset="1" stop-color="${orange}" stop-opacity="0.6"/></radialGradient>
<linearGradient id="dbtefx-bcq-boltgrad" gradientUnits="userSpaceOnUse" x1="0" y1="250" x2="0" y2="360"><stop offset="0" stop-color="#000000"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<mask id="dbtefx-bcq-boltfade" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900"><rect width="1600" height="900" fill="url(#dbtefx-bcq-boltgrad)"/></mask>
</defs>
<rect x="-100" y="-60" width="1800" height="1020" fill="url(#dbtefx-bcq-sky)"/>

<circle cx="1290" cy="690" r="320" fill="url(#dbtefx-bcq-glow)"/><circle cx="1290" cy="700" r="112" fill="url(#dbtefx-bcq-sun)"/>
<g style="animation: dbtefx-bcq-cloud 60s ease-in-out infinite;">${cloud(1300, 850, 1.5, 11, mix(t.bg, orange, 0.24), mix(t.bg, orange, 0.62), -3, 0.92)}${cloud(300, 860, 1.8, 9, mix(t.bg, orange, 0.16), mix(t.bg, orange, 0.4), -3, 0.8)}</g>
<g style="animation: dbtefx-bcq-cloud 80s ease-in-out -30s infinite;">${cloud(980, 10, 1.2, 7, mix(t.bg, '#000000', 0.22), mix(t.bg, mint, 0.22), 4, 0.8)}</g>
<path d="${city}" fill="${mix(t.bg, orange, 0.12)}" fill-opacity="0.8"/><path d="${pylons}" stroke="${mix(t.bg, orange, 0.18)}" stroke-width="2" fill="none"/>
<!--mid-->
<g class="dbtefx-bcq-storm"><g style="animation: dbtefx-bcq-cloud 50s ease-in-out infinite;">${storm(1250, 66, 9)}</g></g>
<circle cx="${hx}" cy="330" r="300" fill="url(#dbtefx-bcq-halo)" fill-opacity="0.5" style="animation: dbtefx-pulse 6s ease-in-out infinite;"/>
<g class="dbtefx-bcq-herogrp">${surge}</g>
<g style="animation: dbtefx-bcq-float 10s ease-in-out infinite;">
<g class="dbtefx-bcq-bolt">${strike}</g>
<g transform="translate(${ix} ${iy}) scale(${is})">
<path d="${rock}" fill="url(#dbtefx-bcq-rock)"/><path d="${strata}" fill="none" stroke="${dark}" stroke-opacity="0.35" stroke-width="2"/><path d="${cracks}" fill="none" stroke="${dark}" stroke-opacity="0.5" stroke-width="1.6"/><path d="M1094 566L1112 598L1138 610" fill="none" stroke="${mintHi}" stroke-opacity="0.3" stroke-width="2"/><path d="M1150 648L1178 668L1196 706L1226 726L1246 764L1272 790L1290 818L1306 792L1336 764L1368 740L1398 704L1428 684L1450 644" fill="none" stroke="${mix(orange, t.warning, 0.5)}" stroke-opacity="0.7" stroke-width="3" stroke-linejoin="round"/>
${pipes}${cable(1196, 706, 70, -14, 6, 1)}${cable(1336, 764, 56, 12, 7.5, 3)}${cable(1446, 650, 64, 10, 6.8, 2)}
${tower}${shacks}${stair}${slab}
${coil(1250, 412, 1.3, 0)}${coil(1462, 506, 1.05, 1.2)}
${arc('M1250 345L1262 322L1255 318L1270 300L1280 280', 3.4, 0)}${arc('M1462 453L1450 436L1458 430L1444 414L1446 400', 4.2, 1.5)}
${windmill}${crane}${flag}${board}
</g>
</g>
<!--near-->
${pole}`;
};

export default blitzclique;

// Particle systems: tesla sparks, dry leaves blown off the rooftops, and a storm flash.
export const particles = [
  { kind: 'spark', count: 34, colors: ['accent', 'accent2'] },
  { kind: 'leaf', count: 12, colors: ['accent2', 'muted'] },
  { kind: 'flash', count: 1, colors: ['accent'] },
];
