import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';

// Dracotail: the eclipse of the dragon's nodes. Rahu swallows the sun inside
// a golden zodiac astrolabe (the magic circle behind every Dracotail caster)
// while Ketu, a vast jade dragon tail banded with gold cuffs, coils through
// the plum night under Draco's stars. Rings counter-rotate, the tail sways, the corona breathes.
const dracotail = (t) => {
  const rand = rng(57);
  const [cx, cy] = [1195, 385];
  const gold = t.accent;
  const goldHi = mix(gold, '#ffffff', 0.45);
  const goldDim = mix(gold, t.bg, 0.45);
  const jade = t.accent2;
  const jadeDark = mix(jade, t.bg, 0.62);
  const silk = t.danger;

  // Far: a scatter of stars, with a few cross-shaped sparkles.
  const stars = ['', '', ''];
  for (let i = 0; i < 120; i++) stars[i % 3] += `M${Math.round(rand() * 1600)} ${Math.round(rand() * 900)}h0`;
  const sparkle = (x, y, s) => `M${x} ${n1(y - s)}L${n1(x + s * 0.16)} ${n1(y - s * 0.16)}L${n1(x + s)} ${y}L${n1(x + s * 0.16)} ${n1(y + s * 0.16)}L${x} ${n1(y + s)}L${n1(x - s * 0.16)} ${n1(y + s * 0.16)}L${n1(x - s)} ${y}L${n1(x - s * 0.16)} ${n1(y - s * 0.16)}Z`;
  const twinkles = [[1490, 120, 22], [960, 250, 14], [1530, 700, 18], [1060, 760, 12], [700, 70, 13], [1380, 830, 10], [180, 120, 15]]
    .map(([x, y, s], i) => `<path d="${sparkle(x, y, s)}" fill="${i % 3 ? t.text : goldHi}" style="animation: dbtefx-bloom ${n1(3 + i * 0.7)}s ease-in-out ${n1(-i * 1.3)}s infinite; transform-box: fill-box; transform-origin: center;"/>`).join('');

  // Draco, the dragon whose tail winds between the Dippers (faint, upper band).
  const draco = [[520, 150], [575, 118], [640, 128], [700, 96], [770, 104], [818, 70], [880, 86], [905, 132], [870, 160], [830, 140]];
  const dracoLine = draco.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
  const dracoStars = draco.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i > 6 ? 3 : 2.2}"/>`).join('');

  // Zodiac glyphs, drawn on a 14px box.
  const glyphs = [
    'M-7 6C-7-8 0-8 0 0C0-8 7-8 7 6',
    'M-7-7Q0 0 7-7M4 3A4 4 0 1 1-4 3A4 4 0 1 1 4 3',
    'M-6-7H6M-6 7H6M-3-7V7M3-7V7',
    'M-7-1A6 6 0 0 1 6-4M7 1A6 6 0 0 1-6 4',
    'M-5 6A3 3 0 1 1-3 0C-6-8 6-9 4 0C3 4 6 7 7 5',
    'M-7-6V6M-7-4Q-4-8-2-4V6M-2-4Q1-8 3-4V6Q6 8 7 2',
    'M-7 6H7M-7 2H-3A3.5 3.5 0 1 1 3 2H7',
    'M-7-6V6M-7-4Q-4-8-2-4V6M-2-4Q1-8 3-4V5L6 7L7 4',
    'M-6 7L7-6M1-6H7V0M-4-1L1 4',
    'M-7-6L-4 6L-1-6V4A3 3 0 1 0 5 4',
    'M-7-2L-3.5-5L0-2L3.5-5L7-2M-7 4L-3.5 1L0 4L3.5 1L7 4',
    'M-6-7Q-2 0-6 7M6-7Q2 0 6 7M-4 0H4',
  ];
  const zodiac = glyphs.map((d, i) => {
    const a = i * 30 - 75;
    const [x, y] = polar(cx, cy, 262, a);
    return `<path d="${d}" transform="translate(${x} ${y}) rotate(${a + 90}) scale(1.25)"/>`;
  }).join('');
  let ticks = '';
  for (let i = 0; i < 120; i++) {
    const a = i * 3;
    const [x1, y1] = polar(cx, cy, 236, a);
    const [x2, y2] = polar(cx, cy, i % 10 === 0 ? 248 : i % 5 === 0 ? 244 : 240, a);
    ticks += `M${x1} ${y1}L${x2} ${y2}`;
  }
  let dividers = '';
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = polar(cx, cy, 250, i * 30 - 60);
    const [x2, y2] = polar(cx, cy, 276, i * 30 - 60);
    dividers += `M${x1} ${y1}L${x2} ${y2}`;
  }
  let hours = '';
  for (let i = 0; i < 24; i++) {
    const [x, y] = polar(cx, cy, 208, i * 15);
    hours += `<circle cx="${x}" cy="${y}" r="${i % 6 ? 2.2 : 4.5}"/>`;
  }

  // The eclipse: corona rays around the dark disc, a diamond-ring flare.
  let rays = '';
  for (let i = 0; i < 36; i++) {
    const a = i * 10 + rand() * 4;
    const len = 70 + rand() * (i % 3 ? 50 : 110);
    const [x1, y1] = polar(cx, cy, 64, a - 2.2);
    const [x2, y2] = polar(cx, cy, 64, a + 2.2);
    const [tx, ty] = polar(cx, cy, 64 + len, a);
    rays += `M${x1} ${y1}L${tx} ${ty}L${x2} ${y2}Z`;
  }
  const [fx, fy] = polar(cx, cy, 66, -52);

  // Near: a few large gold sparkles drifting at the edges.
  const nearSparks = [[90, 300, 26], [1560, 860, 30], [300, 860, 18]].map(([x, y, k], i) => `<path d="${sparkle(x, y, k)}" fill="${goldHi}" fill-opacity="0.7" style="animation: dbtefx-bloom ${5 + i}s ease-in-out ${-i * 2}s infinite; transform-box: fill-box; transform-origin: center;"/>`).join('');

  // Ketu: the dragon tail. A centreline through control points, sampled.
  const pts = [[1460, -80], [1385, 60], [1362, 230], [1385, 410], [1350, 580], [1236, 670], [1092, 648], [1022, 552], [1030, 462], [1068, 405]];
  const cr = (p0, p1, p2, p3, u) => {
    const u2 = u * u;
    const u3 = u2 * u;
    return [0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3));
  };
  const line = [];
  for (let s = 0; s < pts.length - 1; s++) {
    const p0 = pts[Math.max(0, s - 1)];
    const p3 = pts[Math.min(pts.length - 1, s + 2)];
    for (let k = 0; k < 10; k++) line.push(cr(p0, pts[s], pts[s + 1], p3, k / 10));
  }
  line.push(pts[pts.length - 1]);
  const N = line.length - 1;
  const half = (i) => 44 * (1 - i / N) ** 0.8 + 4;
  const frame = line.map((p, i) => {
    const q = line[Math.min(N, i + 1)];
    const o = line[Math.max(0, i - 1)];
    const [dx, dy] = [q[0] - o[0], q[1] - o[1]];
    const len = Math.hypot(dx, dy) || 1;
    return { p, tx: dx / len, ty: dy / len, nx: -dy / len, ny: dx / len, w: half(i) };
  });
  const at = (f, k) => [n1(f.p[0] + f.nx * f.w * k), n1(f.p[1] + f.ny * f.w * k)];
  const edge = (k, from = 0, to = N) => frame.slice(from, to + 1).map((f) => at(f, k).join(' '));
  const body = `M${edge(1).join('L')}L${edge(-1).reverse().join('L')}Z`;
  const belly = `M${edge(0.96, 0, N - 3).join('L')}L${edge(0.34, 0, N - 3).reverse().join('L')}Z`;
  // Overlapping scales in staggered rows, cupped toward the tip.
  let scales = '';
  for (let i = 2; i < N - 4; i += 2) {
    [-0.72, -0.28, 0.12].forEach((k, row) => {
      const f = frame[i + (row % 2)];
      const [ax, ay] = at(f, k - 0.24);
      const [bx, by] = at(f, k + 0.24);
      const [mx, my] = at(f, k);
      scales += `M${ax} ${ay}Q${n1(mx + f.tx * f.w * 0.55)} ${n1(my + f.ty * f.w * 0.55)} ${bx} ${by}`;
    });
  }
  let plates = '';
  for (let i = 1; i < N - 4; i += 2) plates += `M${at(frame[i], 0.36).join(' ')}L${at(frame[i], 0.94).join(' ')}`;
  const band = (k0, k1, to = N - 2) => `M${edge(k0, 0, to).join('L')}L${edge(k1, 0, to).reverse().join('L')}Z`;
  // Dorsal spines along the outer edge, swept toward the tip.
  let spines = '';
  for (let i = 3; i < N - 8; i += 4) {
    const f = frame[i];
    const g = frame[i + 2];
    const [ax, ay] = at(f, -0.92);
    const [bx, by] = at(g, -0.92);
    const [sx, sy] = [n1(g.p[0] - g.nx * g.w * 1.75 + g.tx * f.w * 0.6), n1(g.p[1] - g.ny * g.w * 1.75 + g.ty * f.w * 0.6)];
    spines += `M${ax} ${ay}Q${n1((ax + sx) / 2 - f.tx * 4)} ${n1((ay + sy) / 2 - f.ty * 4)} ${sx} ${sy}L${bx} ${by}Z`;
  }
  // Gold cuffs around the tail.
  const cuff = (i) => [0, 3].map((d) => {
    const f = frame[i + d];
    return `<path d="M${at(f, 1.12).join(' ')}L${at(f, -1.12).join(' ')}" stroke="${mix(gold, '#000000', 0.5)}" stroke-width="7" stroke-linecap="round"/><path d="M${at(f, 1.08).join(' ')}L${at(f, -1.08).join(' ')}" stroke="url(#dbtefx-dt-cuff)" stroke-width="4.5" stroke-linecap="round"/>`;
  }).join('');
  // The fin at the tip: a spade with a rib.
  const end = frame[N];
  const tip = (k, s) => [n1(end.p[0] + end.tx * k + end.nx * s), n1(end.p[1] + end.ty * k + end.ny * s)];
  const fan = [-46, -24, 0, 24, 46];
  const ray = (y) => tip(Math.cos((y * Math.PI) / 180) * 92, Math.sin((y * Math.PI) / 180) * 70);
  let fin = `M${tip(0, -8).join(' ')}`;
  fan.forEach((y, k) => {
    const [rx, ry] = ray(y);
    if (k) {
      const m = ray((y + fan[k - 1]) / 2);
      const c = [n1(end.p[0] + (m[0] - end.p[0]) * 0.72), n1(end.p[1] + (m[1] - end.p[1]) * 0.72)];
      fin += `Q${c.join(' ')} ${rx} ${ry}`;
    } else fin += `L${rx} ${ry}`;
  });
  fin += `L${tip(0, 8).join(' ')}Z`;
  const rib = fan.map((y) => `M${tip(2, 0).join(' ')}L${ray(y).join(' ')}`).join('');

  return `<style>
@keyframes dbtefx-dt-sway { 0%, 100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.6deg); } }
@keyframes dbtefx-dt-corona { 0%, 100% { transform: scale(0.95) rotate(0deg); opacity: 0.75; } 50% { transform: scale(1.05) rotate(4deg); opacity: 1; } }
</style>
<defs>
<radialGradient id="dbtefx-dt-neb1" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(t.border, gold, 0.25)}" stop-opacity="0.55"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-neb2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${jade}" stop-opacity="0.16"/><stop offset="1" stop-color="${jade}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-neb3" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${silk}" stop-opacity="0.13"/><stop offset="1" stop-color="${silk}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0.3" stop-color="${goldHi}" stop-opacity="0.9"/><stop offset="0.5" stop-color="${gold}" stop-opacity="0.45"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-moon" cx="0.42" cy="0.4" r="0.6"><stop offset="0" stop-color="${mix(t.surface, t.bg, 0.4)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.5)}"/></radialGradient>
<linearGradient id="dbtefx-dt-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldHi}"/><stop offset="0.45" stop-color="${gold}"/><stop offset="1" stop-color="${goldDim}"/></linearGradient>
<linearGradient id="dbtefx-dt-scale" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${jade}"/><stop offset="0.5" stop-color="${mix(jade, t.bg, 0.4)}"/><stop offset="1" stop-color="${jadeDark}"/></linearGradient>
<radialGradient id="dbtefx-dt-fin" cx="${end.p[0]}" cy="${end.p[1]}" r="95" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${jade}"/><stop offset="1" stop-color="${mix(jade, '#ffffff', 0.5)}" stop-opacity="0.75"/></radialGradient>
<path id="dbtefx-dt-body" d="${body}"/><path id="dbtefx-dt-scales" d="${scales}"/>
<linearGradient id="dbtefx-dt-cuff" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldHi}"/><stop offset="1" stop-color="${goldDim}"/></linearGradient>
</defs>
<ellipse cx="${cx}" cy="${cy}" rx="620" ry="470" fill="url(#dbtefx-dt-neb1)"/>
<ellipse cx="260" cy="760" rx="520" ry="300" fill="url(#dbtefx-dt-neb2)"/>
<ellipse cx="760" cy="90" rx="520" ry="200" fill="url(#dbtefx-dt-neb3)"/>
<g stroke="${t.text}" stroke-linecap="round">${stars.map((d, i) => `<path d="${d}" stroke-width="${1.4 + i}" stroke-opacity="${0.75 - i * 0.2}"/>`).join('')}</g>
<path d="${dracoLine}" fill="none" stroke="${goldHi}" stroke-opacity="0.22" stroke-width="1.2"/>
<g fill="${goldHi}" fill-opacity="0.75">${dracoStars}</g>
<!--mid-->
<g transform="translate(${cx} ${cy}) scale(0.86) translate(${-cx} ${-cy})">
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 160s linear infinite;" fill="none">
<circle cx="${cx}" cy="${cy}" r="282" stroke="url(#dbtefx-dt-ring)" stroke-width="4"/>
<circle cx="${cx}" cy="${cy}" r="250" stroke="url(#dbtefx-dt-ring)" stroke-width="2.5"/>
<circle cx="${cx}" cy="${cy}" r="234" stroke="${gold}" stroke-opacity="0.6" stroke-width="1.2"/>
<path d="${ticks}" stroke="${gold}" stroke-opacity="0.8" stroke-width="1.3"/>
<path d="${dividers}" stroke="${gold}" stroke-width="1.8"/>
<g stroke="${goldHi}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${zodiac}</g>
</g>
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 110s linear infinite reverse;">
<circle cx="${cx}" cy="${cy}" r="208" fill="none" stroke="${gold}" stroke-opacity="0.45" stroke-width="1.2" stroke-dasharray="2 7"/>
<g fill="${gold}">${hours}</g>
<path d="M${cx} ${cy - 190}L${cx + 9} ${cy - 170}H${cx - 9}Z" fill="${goldHi}"/>
</g>
<g fill="none" stroke="${gold}" stroke-opacity="0.55" stroke-width="2">
<ellipse cx="${cx}" cy="${cy}" rx="228" ry="74" transform="rotate(-24 ${cx} ${cy})"/>
<ellipse cx="${cx}" cy="${cy}" rx="228" ry="96" transform="rotate(52 ${cx} ${cy})" stroke-opacity="0.35"/>
</g>
<circle cx="${cx}" cy="${cy}" r="200" fill="url(#dbtefx-dt-sun)" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-dt-corona 7s ease-in-out infinite;"/>
<path d="${rays}" fill="${goldHi}" fill-opacity="0.5" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-dt-corona 7s ease-in-out -1.5s infinite;"/>
<circle cx="${cx}" cy="${cy}" r="68" fill="url(#dbtefx-dt-moon)"/>
<circle cx="${cx}" cy="${cy}" r="68" fill="none" stroke="${goldHi}" stroke-width="2.4" stroke-opacity="0.9"/>
<path d="${sparkle(fx, fy, 30)}" fill="#ffffff" style="animation: dbtefx-pulse 3.5s ease-in-out infinite;"/>
<circle cx="${fx}" cy="${fy}" r="9" fill="#ffffff"/>
</g>
<g style="transform-origin: 1460px -80px; animation: dbtefx-dt-sway 11s ease-in-out infinite;">
<use href="#dbtefx-dt-body" fill="${mix(t.bg, '#000000', 0.4)}" transform="translate(10 16)" fill-opacity="0.55"/>
<path d="${spines}" fill="${jadeDark}" stroke="${mix(jade, '#ffffff', 0.2)}" stroke-opacity="0.55" stroke-width="1.2"/>
<use href="#dbtefx-dt-body" fill="url(#dbtefx-dt-scale)" stroke="${mix(jade, '#000000', 0.55)}" stroke-width="2"/>
<path d="${band(-0.8, -0.38)}" fill="#ffffff" fill-opacity="0.1"/>
<path d="${belly}" fill="${mix(jade, t.text, 0.55)}" fill-opacity="0.78"/>
<path d="${band(0.8, 1)}" fill="${mix(t.bg, '#000000', 0.3)}" fill-opacity="0.45"/>
<path d="${plates}" stroke="${mix(jade, t.bg, 0.4)}" stroke-width="1.6"/>
<use href="#dbtefx-dt-scales" fill="none" stroke="${mix(jade, '#000000', 0.5)}" stroke-opacity="0.75" stroke-width="1.6"/>
<use href="#dbtefx-dt-scales" fill="none" stroke="${mix(jade, '#ffffff', 0.45)}" stroke-opacity="0.35" stroke-width="0.8" transform="translate(-1.5 -1.5)"/>
${cuff(26)}${cuff(46)}
<path d="${fin}" fill="url(#dbtefx-dt-fin)" stroke="${goldHi}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="${rib}" fill="none" stroke="${gold}" stroke-width="2.2" stroke-linecap="round"/>
</g>
${twinkles}
<!--near-->
${nearSparks}`;
};

export default dracotail;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'star', count: 70, colors: ['text', 'accent'] },
  { kind: 'mote', count: 26, colors: ['accent', 'accent2'], rise: true },
  { kind: 'meteor', count: 1, colors: ['accent'] },
];
