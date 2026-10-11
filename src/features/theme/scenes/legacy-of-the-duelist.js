import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Legacy of the Duelist / Link Evolution: the HD duel board seen from the
// player's seat, tilted on the indigo menu sky. Cyan zone outlines glow on a
// holographic mat, chunky deck stacks sit at its corners, and from the centre
// zone a summoning vortex climbs: flat rings of light and swirling ribbons
// turning at different speeds around a bright column, a card of light rising
// at its top. Soft diagonal beams and cyan lightning cross the sky like the
// game's menu backdrops.

const bx = 1430;
const top = 610;
const bot = 852;
const halfTop = 118;
const halfBot = 198;

// Perspective: far rows are shorter than near ones.
const depth = (v) => v / (1 + 0.6 - 0.6 * v);
const pt = (u, v) => {
  const d = depth(v);
  const hw = halfTop + (halfBot - halfTop) * d;
  return [n1(bx - hw + 2 * hw * u), n1(top + (bot - top) * d)];
};
const quad = (u0, v0, u1, v1) => {
  const p = [pt(u0, v0), pt(u1, v0), pt(u1, v1), pt(u0, v1)];
  return `M${p.map((q) => q.join(' ')).join('L')}Z`;
};

const scene = (t) => {
  const rand = rng(2015);
  const cyan = t.accent;
  const cyanHi = mix(cyan, '#ffffff', 0.55);
  const gold = t.accent2;
  const violet = mix(t.self, t.opp, 0.5);

  // Menu-sky lightning: thin cyan zigzags.
  const bolt = (x, y, len, ang, seed) => {
    const r = rng(seed);
    let d = `M${x} ${y}`;
    let cx = x;
    let cy = y;
    for (let i = 1; i <= 9; i++) {
      cx += (len / 9) * Math.cos(ang) + (r() - 0.5) * 30;
      cy += (len / 9) * Math.sin(ang) + (r() - 0.5) * 30;
      d += `L${n1(cx)} ${n1(cy)}`;
    }
    return d;
  };
  const bolts = [bolt(1200, 60, 300, 0.3, 9), bolt(1520, 420, 200, 2.5, 5)].join('');

  // Zones: 5 columns x 4 rows, a wider gap in the middle; the near rows are yours.
  let zones = '';
  [[0, 0.21], [0.24, 0.45], [0.55, 0.76], [0.79, 1]].forEach(([v0, v1], ri) => {
    for (let c = 0; c < 5; c++) {
      const u0 = 0.03 + c * 0.19;
      const mine = ri > 1;
      zones += `<path d="${quad(u0, v0, u0 + 0.17, v1)}" fill="${mine ? cyan : t.opp}" fill-opacity="${ri === 1 || ri === 2 ? 0.12 : 0.06}" stroke="${mine ? cyanHi : mix(t.opp, '#ffffff', 0.3)}" stroke-opacity="${mine ? 0.85 : 0.55}" stroke-width="1.5"/>`;
    }
  });
  // Deck stacks beside the board: a chunky pile of card backs.
  const stack = (u, v) => {
    const [x, y] = pt(u, v);
    let s = '';
    for (let k = 0; k < 5; k++) s += `<path d="M${n1(x - 24)} ${n1(y - k * 3.4)}h48l-5 -34h-38z" fill="${mix(t.warning, t.bg, 0.4 + k * 0.05)}" stroke="${mix(t.warning, '#000000', 0.45)}" stroke-width="1"/>`;
    return `${s}<path d="M${n1(x - 13)} ${n1(y - 21)}h26l-2 -15h-22z" fill="none" stroke="${mix(t.warning, '#ffffff', 0.4)}" stroke-opacity="0.8" stroke-width="1.2"/>`;
  };

  // Vortex: flat rings (squashed circles) and swirl ribbons turning around the column.
  const flat = (y, inner) => `<g transform="translate(${bx} ${y}) scale(1 0.27)">${inner}</g>`;
  const spin = (dur, rev, body) => `<g style="animation: dbtefx-spin ${dur}s linear infinite${rev ? ' reverse' : ''};">${body}</g>`;
  const ring = (y, r, dur, rev, color, w, dash, o) =>
    flat(y, spin(dur, rev, `<circle r="${r}" fill="none" stroke="${color}" stroke-opacity="${n1(o * 0.3)}" stroke-width="${w * 4}" stroke-dasharray="${dash}"/><circle r="${r}" fill="none" stroke="${color}" stroke-opacity="${o}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round"/>`));
  // A swirl: three spiral arms winding in toward the axis.
  const arms = (r0, r1, color, o) => {
    let d = '';
    for (let a = 0; a < 3; a++) {
      const pts = [];
      for (let k = 0; k <= 10; k++) {
        const f = k / 10;
        pts.push(polar(0, 0, r0 + (r1 - r0) * f, a * 120 + f * 200).join(' '));
      }
      d += `M${pts.join('L')}`;
    }
    return `<path d="${d}" fill="none" stroke="${color}" stroke-opacity="${o}" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#ffffff" stroke-opacity="${n1(o * 0.8)}" stroke-width="1.6" stroke-linecap="round"/>`;
  };
  const vortex = [
    flat(712, spin(16, false, arms(228, 40, cyan, 0.4))),
    ring(712, 214, 30, false, cyan, 4, '300 110 70 80', 0.6),
    flat(610, spin(11, true, arms(190, 30, gold, 0.28))),
    ring(620, 190, 20, true, cyanHi, 3.2, '200 90 40 70', 0.65),
    ring(520, 150, 15, false, gold, 2.8, '140 70 30 60', 0.7),
    flat(430, spin(8, false, arms(130, 20, cyanHi, 0.3))),
    ring(430, 118, 12, true, cyanHi, 2.6, '110 60 20 50', 0.75),
    ring(345, 90, 9, false, cyan, 2.2, '80 40 16 40', 0.8),
  ].join('');

  // Sunburst behind the rising card.
  let rays = '';
  for (let i = 0; i < 16; i++) {
    const [x1, y1] = polar(0, 0, 70, i * 22.5 - 4);
    const [x2, y2] = polar(0, 0, 70, i * 22.5 + 4);
    rays += `M0 0L${x1} ${y1}L${x2} ${y2}Z`;
  }

  // Soft diagonal beams of the menu sky.
  const beams = [[860, 0.9], [1180, 0.7]]
    .map(([x, o], i) => `<path d="M${x} -40H${x + 150}L${x + 790} ${H + 40}H${x + 640}Z" fill="url(#dbtefx-ld-beam)" opacity="${o}" style="animation: dbtefx-pulse ${9 + i * 3}s ease-in-out ${-i * 2.5}s infinite;"/>`)
    .join('');

  const motes = Array.from({ length: 14 }, (_, i) => {
    const x = n1(bx - 160 + rand() * 320);
    const y = n1(300 + rand() * 380);
    return `<circle cx="${x}" cy="${y}" r="${n1(1.6 + rand() * 2.2)}" fill="${i % 3 ? cyanHi : gold}" style="animation: dbtefx-ld-rise ${n1(5 + rand() * 5)}s ease-in ${n1(-rand() * 8)}s infinite;"/>`;
  }).join('');

  return `<defs>
<radialGradient id="dbtefx-ld-sky" gradientUnits="userSpaceOnUse" cx="${bx}" cy="420" r="640"><stop offset="0" stop-color="${mix(t.bg, cyan, 0.3)}" stop-opacity="0.75"/><stop offset="0.55" stop-color="${mix(t.bg, cyan, 0.1)}" stop-opacity="0.3"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ld-violet" gradientUnits="userSpaceOnUse" cx="300" cy="120" r="760"><stop offset="0" stop-color="${violet}" stop-opacity="0.3"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ld-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cyanHi}" stop-opacity="0"/><stop offset="0.4" stop-color="${cyanHi}" stop-opacity="0.07"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-ld-col" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.25" stop-color="${cyanHi}" stop-opacity="0.45"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-ld-mat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.surface, cyan, 0.3)}" stop-opacity="0.7"/><stop offset="1" stop-color="${mix(t.surface, cyan, 0.12)}" stop-opacity="0.92"/></linearGradient>
<radialGradient id="dbtefx-ld-pool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="0.3" stop-color="${cyanHi}" stop-opacity="0.5"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ld-card" cx="0.5" cy="0.45" r="0.65"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="${cyanHi}" stop-opacity="0.75"/><stop offset="1" stop-color="${cyan}" stop-opacity="0.25"/></radialGradient>
<radialGradient id="dbtefx-ld-burst" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${gold}" stop-opacity="0.55"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ld-fadeg" gradientUnits="userSpaceOnUse" x1="1290" y1="0" x2="1420" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.32"/><stop offset="1" stop-color="#ffffff"/></linearGradient><mask id="dbtefx-ld-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#dbtefx-ld-fadeg)"/></mask>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ld-violet)"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ld-sky)"/>
${beams}
<path d="${bolts}" fill="none" stroke="${cyan}" stroke-opacity="0.1" stroke-width="7" stroke-linejoin="bevel"/>
<path d="${bolts}" fill="none" stroke="${cyanHi}" stroke-opacity="0.4" stroke-width="1.5" stroke-linejoin="bevel"/>
<!--mid-->
<g mask="url(#dbtefx-ld-fade)"><g transform="translate(${bx} 860) scale(0.62) translate(${-bx} -860)">
<path d="${quad(-0.03, -0.04, 1.03, 1.04)}" fill="${cyan}" fill-opacity="0.1" stroke="${cyan}" stroke-opacity="0.3" stroke-width="14" stroke-linejoin="round"/>
<path d="${quad(-0.03, -0.04, 1.03, 1.04)}" fill="url(#dbtefx-ld-mat)" stroke="${cyanHi}" stroke-opacity="0.9" stroke-width="2.4"/>
<path d="${quad(-0.03, 0.47, 1.03, 0.53)}" fill="${cyanHi}" fill-opacity="0.12"/>
${zones}
${stack(-0.13, 0.22)}${stack(1.13, 0.22)}${stack(-0.15, 0.95)}${stack(1.15, 0.95)}
<ellipse cx="${bx}" cy="712" rx="210" ry="58" fill="url(#dbtefx-ld-pool)" style="animation: dbtefx-pulse 4s ease-in-out infinite;"/>
<path d="M${bx - 46} 712L${bx - 22} 260H${bx + 22}L${bx + 46} 712Z" fill="url(#dbtefx-ld-col)" style="animation: dbtefx-pulse 5s ease-in-out -1s infinite;"/>
<ellipse cx="${bx}" cy="560" rx="230" ry="150" fill="url(#dbtefx-ld-pool)" opacity="0.35"/>
${vortex}
<g transform="translate(${bx} 206) scale(1.4)"><g style="animation: dbtefx-ld-hover 6s ease-in-out infinite;"><g style="animation: dbtefx-spin 40s linear infinite;"><path d="${rays}" fill="url(#dbtefx-ld-burst)"/></g><rect x="-42" y="-60" width="84" height="120" rx="5" fill="url(#dbtefx-ld-card)" stroke="#ffffff" stroke-width="2.2"/><rect x="-34" y="-50" width="68" height="60" rx="2" fill="none" stroke="${cyan}" stroke-opacity="0.75" stroke-width="1.4"/><path d="M-34 20H34M-34 31H22M-34 42H28" stroke="${cyan}" stroke-opacity="0.6" stroke-width="2"/></g></g>
</g></g>
<!--near-->
${motes}
<style>
@keyframes dbtefx-ld-rise { 0% { transform: translateY(40px); opacity: 0; } 25% { opacity: 1; } 100% { transform: translateY(-170px); opacity: 0; } }
@keyframes dbtefx-ld-hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
</style>`;
};

export default scene;

export const particles = [
  { kind: 'spark', count: 30, colors: ['accent', 'accent2'], column: true, columnX: 0.9 },
  { kind: 'star', count: 60, colors: ['text'] },
  { kind: 'meteor', count: 1, colors: ['accent'] },
];
