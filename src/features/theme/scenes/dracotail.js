import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';

// Dracotail: the eclipse of the dragon's nodes. Rahu, a jade dragon with
// swept black horns banded in gold, rises out of the plum night with jaws
// parted toward the eclipsed sun; its body coils down into Ketu, the tail,
// ending in a gold-ribbed fan fin. The head breathes, the barbel drifts,
// the corona swells.
const dracotail = (t) => {
  const rand = rng(57);
  const [cx, cy] = [1090, 178];
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
  const twinkles = [[1500, 110, 22], [1560, 330, 14], [1540, 780, 18], [1250, 860, 12], [700, 60, 13], [1240, 60, 10], [180, 120, 15]]
    .map(([x, y, s], i) => `<path d="${sparkle(x, y, s)}" fill="${i % 3 ? t.text : goldHi}" style="animation: dbtefx-bloom ${n1(3 + i * 0.7)}s ease-in-out ${n1(-i * 1.3)}s infinite; transform-box: fill-box; transform-origin: center;"/>`).join('');


  // The eclipse Rahu reaches for: corona rays around the dark disc, a diamond-ring flare.
  let rays = '';
  for (let i = 0; i < 36; i++) {
    const a = i * 10 + rand() * 4;
    const len = 34 + rand() * (i % 3 ? 34 : 80);
    const [x1, y1] = polar(cx, cy, 44, a - 3);
    const [x2, y2] = polar(cx, cy, 44, a + 3);
    const [tx, ty] = polar(cx, cy, 44 + len, a);
    rays += `M${x1} ${y1}L${tx} ${ty}L${x2} ${y2}Z`;
  }
  const [fx, fy] = polar(cx, cy, 46, -40);

  // Near: a few large gold sparkles drifting at the edges.
  const nearSparks = [[90, 300, 26], [1560, 860, 30], [300, 860, 18]].map(([x, y, k], i) => `<path d="${sparkle(x, y, k)}" fill="${goldHi}" fill-opacity="0.7" style="animation: dbtefx-bloom ${5 + i}s ease-in-out ${-i * 2}s infinite; transform-box: fill-box; transform-origin: center;"/>`).join('');

  // The dragon's body: a centreline through control points, sampled.
  const pts = [[1340, 404], [1430, 490], [1422, 650], [1290, 738], [1140, 716], [1060, 630], [1066, 540], [1112, 496]];
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
  const half = (i) => 50 * (1 - i / N) ** 0.75 + 4;
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

  // Rahu, the dragon's head (profile, facing left; origin at the back of the
  // skull): long jaws parted toward the sun, a heavy brow over a lit eye,
  // two swept black horns banded in gold, a fin frill and a long barbel.
  let upperTeeth = '';
  for (let x = -236; x <= -100; x += 17) {
    const y = 7 + ((x + 250) / 200) * 7;
    const l = x < -220 ? 17 : 9;
    upperTeeth += `M${x - 4} ${n1(y)}L${x} ${n1(y + l)}L${x + 4} ${n1(y)}Z`;
  }
  let lowerTeeth = '';
  for (let x = -204; x <= -96; x += 18) {
    const y = 60 - ((x + 210) / 150) * 20;
    const l = x < -190 ? 15 : 8;
    lowerTeeth += `M${x - 4} ${n1(y)}L${x} ${n1(y - l)}L${x + 4} ${n1(y)}Z`;
  }
  const skull = 'M0 -22C-18 -52 -58 -66 -96 -58C-112 -56 -124 -50 -134 -44C-160 -42 -200 -36 -236 -24C-252 -19 -262 -12 -264 -4C-264 2 -258 6 -250 7L-150 12C-110 14 -76 18 -52 24C-30 30 -6 22 0 10Z';
  const jaw = 'M-52 26C-96 34 -150 44 -214 60C-222 62 -226 68 -220 72C-170 70 -110 64 -64 56C-46 52 -34 42 -52 26Z';
  const hornA = 'M-80 -58C-80 -120 -50 -170 -6 -200C-30 -160 -40 -110 -38 -50Z';
  const hornB = 'M-44 -50C-30 -104 6 -140 50 -160C20 -124 4 -84 -14 -32Z';
  const frill = 'M-34 38L18 66L-6 30ZM-14 26L46 44L4 14ZM-4 6L58 14L6 -8ZM-10 -22L52 -24L0 -38ZM-20 -44L40 -70L-4 -30ZM-70 30L-40 76L-46 32Z';
  const ink = mix(jade, '#000000', 0.55);
  const head = `<g transform="translate(1335 402) rotate(30) scale(0.95 1.08)"><g style="animation: dbtefx-dt-head 9s ease-in-out infinite; transform-origin: 0px 0px;">
<path d="${frill}" fill="${jadeDark}" stroke="${mix(jade, '#ffffff', 0.2)}" stroke-opacity="0.6" stroke-width="1.2"/>
<path d="${hornB}" fill="${mix(t.bg, '#000000', 0.5)}" stroke="${goldDim}" stroke-width="1.4"/>
<path d="M-246 8L-52 24L-58 50L-214 64Z" fill="${mix(silk, '#000000', 0.72)}"/>
<path d="${upperTeeth}${lowerTeeth}" fill="${mix(t.text, gold, 0.25)}"/>
<path d="${jaw}" fill="url(#dbtefx-dt-jaw)" stroke="${ink}" stroke-width="2"/>
<path d="${skull}" fill="url(#dbtefx-dt-head)" stroke="${ink}" stroke-width="2"/>
<path d="M-140 -42C-170 -38 -206 -30 -232 -20M-60 4C-80 -6 -96 -24 -100 -46M-36 10C-50 -2 -58 -20 -58 -40M-170 6C-176 -6 -186 -14 -200 -16" fill="none" stroke="${ink}" stroke-opacity="0.7" stroke-width="1.5"/>
<path d="M-96 -58C-112 -56 -124 -50 -134 -44C-160 -42 -200 -36 -236 -24" fill="none" stroke="${mix(jade, '#ffffff', 0.5)}" stroke-opacity="0.6" stroke-width="2"/>
<path d="M-102 -42C-116 -50 -138 -44 -148 -32C-134 -26 -114 -28 -102 -36Z" fill="${mix(t.bg, '#000000', 0.6)}"/>
<ellipse cx="-126" cy="-36" rx="10" ry="3.6" transform="rotate(-10 -126 -36)" fill="${goldHi}" style="animation: dbtefx-pulse 4s ease-in-out infinite;"/>
<path d="M-126 -39.5V-32.5" stroke="${mix(t.bg, '#000000', 0.6)}" stroke-width="2"/>
<path d="M-250 -12Q-244 -16 -238 -12" fill="none" stroke="${mix(t.bg, '#000000', 0.5)}" stroke-width="2.4" stroke-linecap="round"/>
<path d="${hornA}" fill="${mix(t.bg, '#000000', 0.35)}" stroke="${gold}" stroke-width="1.6"/>
<path d="M-79 -96L-49 -92M-62 -146L-38 -136" stroke="${goldHi}" stroke-width="4" stroke-linecap="round"/>
<path d="M-238 2C-210 40 -150 96 -40 104C40 110 100 96 150 128" fill="none" stroke="${goldHi}" stroke-opacity="0.85" stroke-width="2.6" stroke-linecap="round" style="animation: dbtefx-dt-whisk 7s ease-in-out infinite; transform-origin: -238px 2px;"/>

</g></g>`;

  return `<style>
@keyframes dbtefx-dt-head { 0%, 100% { transform: rotate(1.5deg); } 50% { transform: rotate(-2.5deg); } }
@keyframes dbtefx-dt-whisk { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-4deg); } }
@keyframes dbtefx-dt-corona { 0%, 100% { transform: scale(0.95) rotate(0deg); opacity: 0.75; } 50% { transform: scale(1.06) rotate(4deg); opacity: 1; } }
</style>
<defs>
<radialGradient id="dbtefx-dt-neb1" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(t.border, gold, 0.25)}" stop-opacity="0.55"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-neb2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${jade}" stop-opacity="0.16"/><stop offset="1" stop-color="${jade}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-neb3" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${silk}" stop-opacity="0.13"/><stop offset="1" stop-color="${silk}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0.3" stop-color="${goldHi}" stop-opacity="0.9"/><stop offset="0.5" stop-color="${gold}" stop-opacity="0.45"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-moon" cx="0.42" cy="0.4" r="0.6"><stop offset="0" stop-color="${mix(t.surface, t.bg, 0.4)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.5)}"/></radialGradient>
<linearGradient id="dbtefx-dt-scale" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${jade}"/><stop offset="0.5" stop-color="${mix(jade, t.bg, 0.4)}"/><stop offset="1" stop-color="${jadeDark}"/></linearGradient>
<linearGradient id="dbtefx-dt-head" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(jade, '#ffffff', 0.15)}"/><stop offset="0.6" stop-color="${mix(jade, t.bg, 0.35)}"/><stop offset="1" stop-color="${jadeDark}"/></linearGradient>
<linearGradient id="dbtefx-dt-jaw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(jade, t.bg, 0.45)}"/><stop offset="1" stop-color="${mix(jade, t.text, 0.4)}"/></linearGradient>
<radialGradient id="dbtefx-dt-fin" cx="${end.p[0]}" cy="${end.p[1]}" r="95" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${jade}"/><stop offset="1" stop-color="${mix(jade, '#ffffff', 0.5)}" stop-opacity="0.75"/></radialGradient>
<path id="dbtefx-dt-body" d="${body}"/><path id="dbtefx-dt-scales" d="${scales}"/>
<linearGradient id="dbtefx-dt-cuff" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldHi}"/><stop offset="1" stop-color="${goldDim}"/></linearGradient>
</defs>
<ellipse cx="1340" cy="430" rx="460" ry="420" fill="url(#dbtefx-dt-neb1)"/>
<ellipse cx="260" cy="760" rx="520" ry="300" fill="url(#dbtefx-dt-neb2)"/>
<ellipse cx="760" cy="90" rx="520" ry="200" fill="url(#dbtefx-dt-neb3)"/>
<g stroke="${t.text}" stroke-linecap="round">${stars.map((d, i) => `<path d="${d}" stroke-width="${1.4 + i}" stroke-opacity="${0.75 - i * 0.2}"/>`).join('')}</g>
<!--mid-->
<g transform="translate(1480 440) scale(0.74) translate(-1480 -440)">
<circle cx="${cx}" cy="${cy}" r="140" fill="url(#dbtefx-dt-sun)" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-dt-corona 7s ease-in-out infinite;"/>
<path d="${rays}" fill="${goldHi}" fill-opacity="0.5" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-dt-corona 7s ease-in-out -1.5s infinite;"/>
<circle cx="${cx}" cy="${cy}" r="46" fill="url(#dbtefx-dt-moon)"/>
<circle cx="${cx}" cy="${cy}" r="46" fill="none" stroke="${goldHi}" stroke-width="2" stroke-opacity="0.9"/>
<path d="${sparkle(fx, fy, 24)}" fill="#ffffff" style="animation: dbtefx-pulse 3.5s ease-in-out infinite;"/>
<circle cx="${fx}" cy="${fy}" r="7" fill="#ffffff"/>
<use href="#dbtefx-dt-body" fill="${mix(t.bg, '#000000', 0.4)}" transform="translate(10 16)" fill-opacity="0.55"/>
<path d="${spines}" fill="${jadeDark}" stroke="${mix(jade, '#ffffff', 0.2)}" stroke-opacity="0.55" stroke-width="1.2"/>
<use href="#dbtefx-dt-body" fill="url(#dbtefx-dt-scale)" stroke="${mix(jade, '#000000', 0.55)}" stroke-width="2"/>
<path d="${band(-0.8, -0.38)}" fill="#ffffff" fill-opacity="0.1"/>
<path d="${belly}" fill="${mix(jade, t.text, 0.55)}" fill-opacity="0.78"/>
<path d="${band(0.8, 1)}" fill="${mix(t.bg, '#000000', 0.3)}" fill-opacity="0.45"/>
<path d="${plates}" stroke="${mix(jade, t.bg, 0.4)}" stroke-width="1.6"/>
<use href="#dbtefx-dt-scales" fill="none" stroke="${mix(jade, '#000000', 0.5)}" stroke-opacity="0.75" stroke-width="1.6"/>
<use href="#dbtefx-dt-scales" fill="none" stroke="${mix(jade, '#ffffff', 0.45)}" stroke-opacity="0.35" stroke-width="0.8" transform="translate(-1.5 -1.5)"/>
${cuff(30)}${cuff(52)}
<path d="${fin}" fill="url(#dbtefx-dt-fin)" stroke="${goldHi}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="${rib}" fill="none" stroke="${gold}" stroke-width="2.2" stroke-linecap="round"/>
${head}
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
