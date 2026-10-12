import { mix } from '../../../lib/color.js';
import { anim, glow, n1, polar, rng, W, H } from './kit.js';

// Jujutsu Kaisen: Shibuya on Halloween night under a descending veil. Over
// the skyline a hollow purple swells where a red and a blue orb circle and
// converge; black-flash lightning cracks around it, sealing talismans drift
// down, ink splatter on the edges.

const SX = 1420;
const SY = 290;

const scene = (t) => {
  const rand = rng(1031);
  const ink = mix(t.bg, '#000000', 0.6);
  const violet = t.accent;
  const red = t.self;
  const blue = t.opp;
  const paper = mix(t.text, t.warning, 0.12);

  // Shibuya skyline: towers with window grids, a cylinder tower, blank screens.
  let towers = '';
  let lights = '';
  const lit = rng(9);
  let x = -20;
  while (x < 1620) {
    const w = 44 + lit() * 70;
    const h = 120 + lit() * 220 * (x > 1000 || x < 380 ? 1 : 0.55);
    const top = 900 - h;
    towers += `M${n1(x)} 900V${n1(top)}H${n1(x + w)}V900Z`;
    if (lit() < 0.35) towers += `M${n1(x + w * 0.4)} ${n1(top)}V${n1(top - 26)}h2V${n1(top)}Z`;
    for (let wy = top + 14; wy < 880; wy += 16) {
      for (let wx = x + 6; wx < x + w - 8; wx += 12) {
        // No lit windows behind the duel's watcher list (left column, above y 740).
        const behindWatchers = wx > 110 && wx < 420 && wy < 740;
        if (lit() < 0.16 && !behindWatchers) lights += `M${n1(wx)} ${n1(wy)}h5v6h-5Z`;
      }
    }
    x += w + 4;
  }
  // A tall stepped tower with an antenna, rooftop tanks, unlit billboard frames.
  const tower = `<g transform="translate(110 130)"><path d="M1286 900V420H1300V380H1316V350H1356V380H1372V420H1386V900Z" fill="${mix(ink, t.surface, 0.2)}"/><path d="M1336 350V280" stroke="${mix(ink, t.surface, 0.2)}" stroke-width="3"/><circle cx="1336" cy="280" r="3" fill="${red}" ${anim('pulse', 2.4, 0, 'ease-in-out')}/><path d="M1296 430H1376M1296 470H1376M1296 510H1376M1296 550H1376M1296 590H1376M1296 630H1376M1296 670H1376M1296 710H1376M1296 750H1376" stroke="${mix(t.opp, ink, 0.6)}" stroke-opacity="0.6" stroke-width="2"/></g>`;
  const extras = [[540, 712], [760, 740], [1120, 690], [1460, 700], [160, 700]].map(([bx, by]) => `<path d="M${bx} ${by}h16v-14q-8 -5 -16 0Z" fill="${ink}"/>`).join('');
  // The cylinder tower with its vertical fins.
  const cyl = `<path d="M300 900V560Q336 540 372 560V900Z" fill="${mix(ink, t.surface, 0.3)}"/>${[312, 324, 336, 348, 360].map((fx) => `<path d="M${fx} 556V900" stroke="${mix(t.muted, ink, 0.6)}" stroke-width="1.2"/>`).join('')}<path d="M300 560Q336 540 372 560" fill="none" stroke="${violet}" stroke-opacity="0.6" stroke-width="2"/>`;
  // The veil: a vast dark dome descending over the city, its rim inked.
  const veil = `<path d="M-60 900C-60 300 420 120 800 120C1180 120 1660 300 1660 900" fill="url(#dbtefx-jjk-veil)"/><path d="M-60 900C-60 300 420 120 800 120C1180 120 1660 300 1660 900" fill="none" stroke="${ink}" stroke-width="10" stroke-opacity="0.75"/><path d="M-50 900C-50 310 424 132 800 132C1176 132 1650 310 1650 900" fill="none" stroke="${violet}" stroke-width="1.5" stroke-opacity="0.35" stroke-dasharray="3 9"/>`;

  // Hollow purple: an energy shell, white-hot inside, a dark band, a bright
  // rim; swirls turning within, a corona of streaks around it.
  let swirl = '';
  for (let i = 0; i < 6; i++) {
    const r0 = 28 + i * 12;
    const a0 = i * 67;
    const [x1, y1] = polar(SX, SY, r0, a0);
    const [x2, y2] = polar(SX, SY, r0, a0 + 150);
    swirl += `<path d="M${x1} ${y1}A${r0} ${r0} 0 0 1 ${x2} ${y2}"/>`;
  }
  let corona = '';
  for (let i = 0; i < 36; i++) {
    const a = i * 10 + rand() * 6;
    const [x1, y1] = polar(SX, SY, 112, a);
    const [x2, y2] = polar(SX, SY, 120 + rand() * (i % 3 ? 26 : 56), a);
    corona += `M${x1} ${y1}L${x2} ${y2}`;
  }
  const purple = `<circle cx="${SX}" cy="${SY}" r="280" fill="url(#dbtefx-jjk-aura)"/>
<g style="transform-origin: ${SX}px ${SY}px; animation: dbtefx-spin 80s linear infinite;"><path d="${corona}" stroke="${mix(violet, '#ffffff', 0.4)}" stroke-width="2" stroke-linecap="round" stroke-opacity="0.55"/></g>
<g style="transform-origin: ${SX}px ${SY}px; animation: dbtefx-jjk-throb 6s ease-in-out infinite;"><circle cx="${SX}" cy="${SY}" r="108" fill="url(#dbtefx-jjk-sphere)" fill-opacity="0.35"/><circle cx="${SX}" cy="${SY}" r="108" fill="none" stroke="${mix(violet, '#ffffff', 0.7)}" stroke-width="3"/></g>
<g style="transform-origin: ${SX}px ${SY}px; animation: dbtefx-spin 14s linear infinite reverse;" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round">${swirl}</g>`;
  // Red and blue: two orbs circling the sphere, swinging in toward it.
  const orb = (color, r, phase, dur) => `<g style="transform-origin: ${SX}px ${SY}px; animation: dbtefx-spin ${dur}s linear ${n1(-phase)}s infinite;"><g transform="translate(${SX + 150} ${SY})"><g ${anim('jjk-near', dur / 2, phase / 2, 'ease-in-out')}><circle r="${r * 3.4}" fill="url(#dbtefx-jjk-${color === red ? 'red' : 'blue'})"/><circle r="${r}" fill="${color}"/><circle r="${r}" fill="none" stroke="${mix(color, '#ffffff', 0.6)}" stroke-width="2"/><circle r="${n1(r * 0.5)}" fill="#ffffff" fill-opacity="0.9"/></g></g></g>`;

  // Black flash: jagged black lightning haloed in red, cracking from the
  // sphere's rim down toward the city, each bolt tapering and forking.
  const zig = (ax, ay, bx, by, w0, seed, segs = 8) => {
    const r = rng(seed);
    const dx = bx - ax;
    const dy = by - ay;
    const l = Math.hypot(dx, dy);
    const nx = -dy / l;
    const ny = dx / l;
    const pts = [];
    for (let i = 0; i <= segs; i++) {
      const u = i / segs;
      const j = i === 0 || i === segs ? 0 : (i % 2 ? 1 : -1) * (0.04 + r() * 0.07) * l;
      pts.push([ax + dx * u + nx * j, ay + dy * u + ny * j]);
    }
    const left = [];
    const right = [];
    pts.forEach(([px, py], i) => {
      const w = w0 * (1 - (i / segs) * 0.85);
      left.push(`${n1(px + nx * w)} ${n1(py + ny * w)}`);
      right.unshift(`${n1(px - nx * w)} ${n1(py - ny * w)}`);
    });
    return { d: `M${left.join('L')}L${right.join('L')}Z`, pts };
  };
  let strikes = '';
  [[1410, 405, 1390, 650, 9, 3], [1510, 400, 1550, 640, 8, 5], [1550, 250, 1600, 150, 6, 7]].forEach(([ax, ay, bx, by, w, sd]) => {
    const main = zig(ax, ay, bx, by, w, sd);
    strikes += main.d;
    const [mx, my] = main.pts[3];
    const [ex, ey] = main.pts[6];
    strikes += zig(mx, my, mx + (bx - ax) * 0.3 + (by - ay) * 0.25, my + (by - ay) * 0.3 - (bx - ax) * 0.25, w * 0.5, sd + 20, 5).d;
    strikes += zig(ex, ey, ex + (bx - ax) * 0.2 - (by - ay) * 0.2, ey + (by - ay) * 0.2 + (bx - ax) * 0.2, w * 0.35, sd + 40, 4).d;
  });
  const bolts = `<g ${anim('jjk-flash', 4.5, 0)}><path d="${strikes}" fill="none" stroke="${red}" stroke-width="22" stroke-opacity="0.18" stroke-linejoin="round"/><path d="${strikes}" fill="${red}" stroke="${mix(red, '#ffffff', 0.25)}" stroke-width="8" stroke-opacity="0.7" stroke-linejoin="miter"/><path d="${strikes}" fill="${ink}" stroke="${ink}" stroke-width="1" stroke-linejoin="miter"/></g>`;

  // Sealing talismans: paper strips, a red border, a column of brush strokes
  // (no real characters) and a red seal.
  const talisman = (tx, s, dur, delay) => {
    const r = rng(Math.round(tx));
    const k = r();
    const strokes = `M0 -34Q${n1(-2 + k * 4)} -6 1 16q-3 3 -6 1M-8 ${n1(-26 + k * 4)}q8 -2 16 0M-6 ${n1(-14 + k * 6)}q6 2 13 -1M-9 ${n1(0 + k * 4)}q9 -1 18 1`;
    return `<g transform="translate(${n1(tx)} 0) scale(${s})"><g ${anim('fall', dur, delay, 'ease-in-out')}><rect x="-17" y="-48" width="34" height="96" fill="${paper}"/><rect x="-13.5" y="-44.5" width="27" height="89" fill="none" stroke="${red}" stroke-width="1.8"/><path d="${strokes}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><rect x="-7" y="24" width="14" height="14" fill="${red}" fill-opacity="0.85"/><path d="M-4 27h8M-4 31h8M0 27v8" stroke="${paper}" stroke-width="1.2"/></g></g>`;
  };
  const talismans = [[200, 1, 19, 2], [1300, 1.15, 23, 9], [1470, 0.85, 17, 4], [1110, 0.9, 26, 15], [300, 0.75, 21, 12]].map(([tx, sc, dur, d]) => talisman(tx, sc, dur, d)).join('');

  // Ink splatter: brush-flung blots in the corners, one red.
  const splat = (cx, cy, s, color, seed) => {
    const r = rng(seed);
    let d = '';
    const pts = 14;
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * 360;
      const rr = (i % 2 ? 26 : 40) * (0.7 + r() * 0.6);
      const [px, py] = polar(0, 0, rr, a);
      d += `${i ? 'L' : 'M'}${px} ${py}`;
    }
    let drops = '';
    for (let i = 0; i < 9; i++) {
      const [px, py] = polar(0, 0, 50 + r() * 70, r() * 360);
      drops += `<circle cx="${px}" cy="${py}" r="${n1(2 + r() * 6)}"/>`;
    }
    return `<g transform="translate(${cx} ${cy}) scale(${s})" fill="${color}"><path d="${d}Z" stroke="${color}" stroke-width="10" stroke-linejoin="round"/>${drops}</g>`;
  };

  return `<style>@keyframes dbtefx-jjk-throb { 0%, 100% { transform: scale(0.97); } 50% { transform: scale(1.04); } }
@keyframes dbtefx-jjk-near { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-90px, 0) scale(0.75); } }
@keyframes dbtefx-jjk-flash { 0%, 64%, 100% { opacity: 0.55; } 70% { opacity: 1; } 76% { opacity: 0.6; } 80% { opacity: 1; } 90% { opacity: 0.4; } }</style>
<defs>
${glow('dbtefx-jjk-aura', violet, 0.5, 0.5, 0.5, 0.5)}
${glow('dbtefx-jjk-red', red, 0.5, 0.5, 0.5, 0.6)}
${glow('dbtefx-jjk-blue', blue, 0.5, 0.5, 0.5, 0.6)}
<radialGradient id="dbtefx-jjk-sphere"><stop offset="0" stop-color="#ffffff"/><stop offset="0.22" stop-color="${mix(violet, '#ffffff', 0.6)}"/><stop offset="0.55" stop-color="${violet}"/><stop offset="0.86" stop-color="${mix(violet, t.bg, 0.6)}"/><stop offset="1" stop-color="${mix(violet, '#ffffff', 0.35)}"/></radialGradient>
<linearGradient id="dbtefx-jjk-veil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ink}" stop-opacity="0.15"/><stop offset="1" stop-color="${mix(violet, t.bg, 0.8)}" stop-opacity="0.35"/></linearGradient>
</defs>
${veil}
<!--mid-->
${purple}
${bolts}
${orb(red, 24, 0, 18)}
${orb(blue, 24, 9, 18)}
<g fill="${ink}"><path d="${towers}"/></g>
${tower}
${extras}
${cyl}
<path d="${lights}" fill="${mix(t.warning, t.text, 0.4)}" fill-opacity="0.55"/>
<!--near-->
${splat(1500, 120, 0.9, red, 4)}
${talismans}`;
};

export default scene;

// Cursed-energy sparks in violet and blue; now and then a black flash.
export const particles = [
  { kind: 'spark', count: 46, colors: ['accent', 'opp'] },
  { kind: 'ash', count: 40, colors: ['muted'] },
  { kind: 'flash', count: 1, colors: ['accent2'] },
];

// WebGL layer (shader.js): cursed energy, dark flame-like turbulence rising
// over the city and pooling around the hollow purple.
export const shader = {
  uniforms: ['bg', 'accent', 'opp', 'accent2'],
  frag: `
void main() {
  float sc = max(u_res.x / 1600.0, u_res.y / 900.0);
  vec2 p = vec2(gl_FragCoord.x - (u_res.x - 1600.0 * sc) * 0.5, u_res.y - gl_FragCoord.y - (u_res.y - 900.0 * sc) * 0.5) / sc;
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time * 0.12;
  vec2 q = p / 260.0;
  vec2 w = vec2(fbm(q + vec2(0.0, t)), fbm(q + vec2(3.7, t * 1.3)));
  float f = fbm(q * 1.6 + w * 2.2 + vec2(0.0, t * 1.8));
  // Rising tongues: stretched noise moving upward.
  float tongues = fbm(vec2(q.x * 3.0 + w.x, q.y * 1.2 + t * 2.5));
  float near = smoothstep(560.0, 80.0, length(p - vec2(1420.0, 290.0)));
  float energy = smoothstep(0.45, 0.9, f * 0.7 + tongues * 0.5) * (0.35 + 0.65 * near);
  vec3 col = u_bg;
  col = mix(col, u_opp * 0.45, energy * 0.75 * (1.0 - uv.y * 0.3));
  col = mix(col, u_accent * 0.75, smoothstep(0.6, 1.0, f) * near * 0.9);
  // Black wisps cut through.
  col *= 1.0 - 0.5 * smoothstep(0.55, 0.75, fbm(q * 2.4 - w + vec2(t, 0.0))) * near;
  // Hollow purple: a turbulent ball of violet energy, white-hot at the core.
  vec2 sp = p - vec2(1420.0, 290.0);
  float sr = length(sp) / 108.0;
  float tw = sr * 3.2 - u_time * 0.6;
  vec2 tp = mat2(cos(tw), -sin(tw), sin(tw), cos(tw)) * (sp / 108.0);
  float swirl = fbm(tp * 2.6 + vec2(0.0, u_time * 0.1));
  float ball = smoothstep(1.05, 0.9, sr);
  vec3 core = mix(u_accent, vec3(1.0), smoothstep(0.55, 0.0, sr) * 0.85);
  col = mix(col, core * (0.6 + swirl * 0.8), ball);
  col += u_accent * 0.6 * smoothstep(1.6, 1.0, sr) * (1.0 - ball) * (0.5 + swirl);
  col *= 1.0 - 0.45 * dot(uv - 0.5, uv - 0.5) * 2.0;
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
