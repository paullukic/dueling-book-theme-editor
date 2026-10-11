import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Fullmetal Alchemist: the Gate of Truth. A stone double door carved with the
// Tree of Life stands in a pale void; the doors part a hand's width and close
// again, and in the dark between them eyes open and black tendrils reach out. At its foot a chalk
// transmutation circle is active: blue-white alchemical arcs crackle off its
// rim and sparks rise. Shader: the void's haze and the arcs' flicker.

const gx = 1205;
const top = 128;
const base = 680;
const dw = 150;

// Tree of Life (10 spheres, 22 paths) in door space: x -1..1, y 0..1.
const SEPH = [[0, 0.08], [0.62, 0.2], [-0.62, 0.2], [0.62, 0.42], [-0.62, 0.42], [0, 0.53], [0.62, 0.68], [-0.62, 0.68], [0, 0.81], [0, 0.94]];
const PATHS = [[0, 1], [0, 2], [0, 5], [1, 2], [1, 3], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5], [3, 6], [4, 5], [4, 7], [5, 6], [5, 7], [5, 8], [6, 7], [6, 8], [6, 9], [7, 8], [7, 9], [8, 9]];

const scene = (t) => {
  const rand = rng(1903);
  const stone = mix(mix(t.muted, t.bg, 0.45), t.accent2, 0.08);
  const stoneHi = mix(t.text, t.muted, 0.3);
  const stoneLo = mix(t.muted, t.bg, 0.7);
  const groove = mix(t.bg, '#000000', 0.2);
  const blue = t.accent2;
  const bluePale = mix(blue, '#ffffff', 0.6);
  const ih = base - 10 - (top + 28);
  const iy = top + 28;
  const sx = (v) => n1(gx + v * dw * 0.82);
  const sy = (v) => n1(iy + 14 + v * (ih - 28));

  // One leaf carries the half of the Tree on its side of the seam (the
  // spheres on the seam are split in two).
  const tree = (side) => {
    let d = '';
    PATHS.forEach(([a, b]) => {
      const [ax, ay] = SEPH[a];
      const [bx, by] = SEPH[b];
      if ((ax * side < 0 || bx * side < 0) && !(ax === 0 && bx === 0)) {
        if (ax * side < 0 && bx * side < 0) return;
        if (ax !== 0 && bx !== 0) {
          const f = ax / (ax - bx);
          const my = ay + (by - ay) * f;
          d += ax * side > 0 ? `M${sx(ax)} ${sy(ay)}L${sx(0)} ${sy(my)}` : `M${sx(0)} ${sy(my)}L${sx(bx)} ${sy(by)}`;
          return;
        }
      }
      if (ax === 0 && bx === 0) return;
      d += `M${sx(ax)} ${sy(ay)}L${sx(bx)} ${sy(by)}`;
    });
    let rings = '';
    let inner = '';
    SEPH.forEach(([x, y]) => {
      if (x * side < 0) return;
      rings += `M${sx(x) + 17} ${sy(y)}A17 17 0 1 0 ${sx(x) - 17} ${sy(y)}A17 17 0 1 0 ${sx(x) + 17} ${sy(y)}`;
      inner += `M${sx(x) + 10} ${sy(y)}A10 10 0 1 0 ${sx(x) - 10} ${sy(y)}A10 10 0 1 0 ${sx(x) + 10} ${sy(y)}`;
    });
    return { d, rings, inner };
  };

  // Carved bands of script across each leaf.
  const band = (x0, x1, y) => {
    let d = '';
    for (let x = x0; x < x1 - 3; x += 4 + rand() * 4) d += `M${Math.round(x)} ${Math.round(y - 3 - rand() * 3)}v${Math.round(4 + rand() * 4)}`;
    return d;
  };

  const leaf = (side) => {
    const tr = tree(side);
    const x0 = side < 0 ? gx - dw : gx;
    const x1 = side < 0 ? gx : gx + dw;
    const bands = band(x0 + 10, x1 - 10, iy + 6) + band(x0 + 10, x1 - 10, base - 18) + band(x0 + 10, x1 - 10, sy(0.31)) + band(x0 + 10, x1 - 10, sy(0.745));
    const clip = `dbtefx-fma-clip${side < 0 ? 'l' : 'r'}`;
    return `<clipPath id="${clip}"><rect x="${x0}" y="${iy}" width="${dw}" height="${ih}"/></clipPath><g style="animation: dbtefx-fma-door${side < 0 ? 'l' : 'r'} 16s ease-in-out infinite;"><rect x="${x0}" y="${iy}" width="${dw}" height="${ih}" fill="url(#dbtefx-fma-leaf)" stroke="${stoneLo}" stroke-width="1.5"/><g clip-path="url(#${clip})" fill="none"><path d="${tr.d}" stroke="${stoneHi}" stroke-opacity="0.6" stroke-width="5" transform="translate(0.8 1.2)"/><path d="${tr.d}" stroke="${groove}" stroke-opacity="0.75" stroke-width="3.2"/><path d="${tr.rings}" stroke="${stoneHi}" stroke-opacity="0.6" stroke-width="4" transform="translate(0.8 1.2)" fill="${mix(stone, t.bg, 0.12)}"/><path d="${tr.rings}" stroke="${groove}" stroke-opacity="0.8" stroke-width="2.6"/><path d="${tr.inner}" stroke="${groove}" stroke-opacity="0.45" stroke-width="1"/><path d="${bands}" stroke="${groove}" stroke-width="1.6"/></g><rect x="${x0 + 6}" y="${iy + 6}" width="${dw - 12}" height="${ih - 12}" fill="none" stroke="${groove}" stroke-opacity="0.6" stroke-width="1.2"/></g>`;
  };

  // Eyes waking in the dark between the doors.
  const eyes = [[gx - 2, 330, 0], [gx + 3, 470, 2.2], [gx - 1, 610, 4.1], [gx + 2, 270, 6.3], [gx, 540, 8.5]]
    .map(([x, y, d]) => `<g transform="translate(${x} ${y})"><g style="animation: dbtefx-fma-eye 16s ease-in-out ${-d}s infinite; transform-box: fill-box; transform-origin: center;"><path d="M-9 0Q0 -7 9 0Q0 7 -9 0Z" fill="${mix(t.text, '#ffffff', 0.4)}"/><circle r="3.4" fill="${mix(t.accent, t.bg, 0.2)}"/></g></g>`)
    .join('');

  // Black tendrils spilling out of the gap: tapered, curling, swaying from the seam.
  // One tapered stroke along a wavy centreline from (x0, y0) heading `ang` degrees.
  const arm = (x0, y0, ang, len, w0, bend, wave) => {
    const pts = [];
    let [x, y] = [x0, y0];
    let a = ang;
    for (let i = 0; i <= 10; i++) {
      pts.push([x, y, w0 * (1 - (i / 10) * 0.94)]);
      a += bend + Math.sin(i * 1.3 + wave) * 7;
      x += Math.cos((a * Math.PI) / 180) * (len / 10);
      y += Math.sin((a * Math.PI) / 180) * (len / 10);
    }
    const side = (sgn) => pts.map(([px, py, w], i) => {
      const [nx, ny] = i < 10 ? [pts[i + 1][0] - px, pts[i + 1][1] - py] : [px - pts[i - 1][0], py - pts[i - 1][1]];
      const l = Math.hypot(nx, ny) || 1;
      return `${Math.round(px - (ny / l) * w * sgn)} ${Math.round(py + (nx / l) * w * sgn)}`;
    });
    return { d: `M${side(1).join('L')}L${side(-1).reverse().join('L')}Z`, tip: pts[7] };
  };
  // Black arms spilling out of the gap, each splitting into grasping fingers.
  const tendril = (y0, dir, len, bend, w0, delay) => {
    const main = arm(gx, y0, dir > 0 ? -8 : 188, len, w0, bend * dir, delay);
    const [fx, fy, fw] = main.tip;
    const base = dir > 0 ? -8 + bend * 7 : 188 - bend * 7;
    const fingers = [-30, 0, 28].map((o, i) => arm(fx, fy, base + o, len * 0.32, fw * 0.9, bend * dir * 1.5, i).d).join('');
    return `<g style="transform-origin: ${gx}px ${y0}px; animation: dbtefx-fma-reach ${n1(7 + delay)}s ease-in-out ${n1(-delay * 1.7)}s infinite;"><path d="${main.d}${fingers}" fill="url(#dbtefx-fma-ink)"/></g>`;
  };
  const tendrils = [[310, -1, 170, -3, 15, 0], [390, 1, 180, -2, 16, 1.3], [480, -1, 200, 2, 17, 2.1], [560, 1, 150, 3, 13, 0.6], [620, -1, 130, 4, 12, 2.8]]
    .map(([y, d, l, bend, w, del]) => tendril(y, d, l, bend, w, del))
    .join('');

  // The transmutation circle, drawn flat (r 300) and squashed into perspective.
  const R = 270;
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const [a, b] = polar(0, 0, R - 10, i * 5);
    const [c, d] = polar(0, 0, R - (i % 3 ? 18 : 30), i * 5);
    ticks += `M${a} ${b}L${c} ${d}`;
  }
  const hexA = [0, 120, 240].map((a) => polar(0, 0, 230, a - 90).join(' '));
  const hexB = [60, 180, 300].map((a) => polar(0, 0, 230, a - 90).join(' '));
  const sq = [45, 135, 225, 315].map((a) => polar(0, 0, 162, a).join(' '));
  const nodes = [0, 60, 120, 180, 240, 300].map((a) => polar(0, 0, 230, a - 90)).map(([x, y]) => `M${x + 20} ${y}A20 20 0 1 0 ${x - 20} ${y}A20 20 0 1 0 ${x + 20} ${y}`).join('');
  const circle = `<circle r="${R}"/><circle r="${R - 10}"/><circle r="${R - 40}"/><circle r="230"/><circle r="110"/><circle r="70"/><path d="M${hexA.join('L')}ZM${hexB.join('L')}ZM${sq.join('L')}Z${nodes}"/><path d="${ticks}"/>`;

  // Alchemical arcs: jagged bolts from the rim, each flashing on its own beat.
  const cy = 742;
  const ry = 0.2;
  const bolt = (deg, len, i) => {
    const [x0, y0] = polar(gx, cy, R, deg);
    const y0s = n1(cy + (y0 - cy) * ry);
    let d = `M${x0} ${y0s}`;
    let x = x0;
    let y = y0s;
    const n = 9;
    for (let k = 1; k <= n; k++) {
      x += (k % 2 ? 1 : -1) * (rand() < 0.75 ? 1 : -0.4) * (4 + rand() * 20);
      y -= (len / n) * (0.6 + rand() * 0.8);
      d += `L${n1(x)} ${n1(y)}`;
      if (k === 3 && rand() < 0.7) d += `M${n1(x)} ${n1(y)}l${n1((rand() - 0.5) * 50)} ${n1(-len * 0.25)}M${n1(x)} ${n1(y)}`;
    }
    return `<g style="animation: dbtefx-fma-arc ${n1(1.8 + rand() * 1.4)}s steps(1, end) ${n1(-i * 0.73)}s infinite;"><path d="${d}" stroke="${blue}" stroke-opacity="0.2" stroke-width="11"/><path d="${d}" stroke="${blue}" stroke-opacity="0.5" stroke-width="4.5"/><path d="${d}" stroke="#ffffff" stroke-width="1.6"/></g>`;
  };
  const bolts = [[200, 150], [222, 210], [250, 120], [290, 180], [318, 230], [340, 140], [160, 110], [20, 120], [140, 170], [185, 260], [270, 90], [330, 200]].map(([a, l], i) => bolt(a, l, i)).join('');

  // Pillars, lintel, stepped cornice and plinth, jointed like cut stone.
  const P = 38;
  const xl = gx - dw - P;
  const xr = gx + dw + P;
  let joints = '';
  for (let y = iy + 60; y < base - 20; y += 74) joints += `M${xl} ${y}H${gx - dw}M${gx + dw} ${y + 30}H${xr}`;
  const flutes = [10, 19, 28].map((k) => `M${xl + k} ${iy + 14}V${base - 14}M${gx + dw + k} ${iy + 14}V${base - 14}`).join('');
  const arch = `<path d="M${xl} ${top}H${xr}V${base}H${gx + dw}V${iy}H${gx - dw}V${base}H${xl}Z" fill="url(#dbtefx-fma-frame)" stroke="${stoneLo}" stroke-width="1.5"/>
<path d="${flutes}" stroke="${groove}" stroke-opacity="0.35" stroke-width="2.4"/><path d="${joints}M${xl} ${iy}H${xr}" stroke="${groove}" stroke-opacity="0.45" stroke-width="1.2"/>
<path d="M${xl - 16} ${top}H${xr + 16}V${top - 16}H${xl - 16}ZM${xl - 6} ${top - 16}H${xr + 6}V${top - 30}H${xl - 6}ZM${xl + 14} ${top - 30}H${xr - 14}V${top - 40}H${xl + 14}Z" fill="${mix(stone, stoneHi, 0.3)}" stroke="${stoneLo}" stroke-width="1.2"/>
<path d="M${xl - 16} ${top - 1}H${xr + 16}" stroke="#000000" stroke-opacity="0.25" stroke-width="3"/>
<path d="M${xl - 10} ${base}H${xr + 10}V${base + 12}H${xl - 10}ZM${xl - 30} ${base + 12}H${xr + 30}V${base + 26}H${xl - 30}Z" fill="${mix(stone, stoneLo, 0.35)}" stroke="${stoneLo}" stroke-width="1.2"/>
<path d="${band(xl + 4, xr - 4, top + 18)}" stroke="${groove}" stroke-opacity="0.8" stroke-width="1.4"/>`;
  return `<defs>
<radialGradient id="dbtefx-fma-void" gradientUnits="userSpaceOnUse" cx="${gx}" cy="470" r="560"><stop offset="0" stop-color="${mix(t.text, '#ffffff', 0.3)}" stop-opacity="0.34"/><stop offset="0.45" stop-color="${t.text}" stop-opacity="0.1"/><stop offset="1" stop-color="${t.text}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-fma-leaf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(stone, stoneHi, 0.3)}"/><stop offset="0.45" stop-color="${stone}"/><stop offset="1" stop-color="${mix(stoneLo, t.accent2, 0.08)}"/></linearGradient>
<linearGradient id="dbtefx-fma-frame" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${stoneLo}"/><stop offset="0.5" stop-color="${mix(stone, stoneHi, 0.35)}"/><stop offset="1" stop-color="${stoneLo}"/></linearGradient>
<linearGradient id="dbtefx-fma-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.text}" stop-opacity="0.08"/><stop offset="1" stop-color="${t.text}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-fma-pool" gradientUnits="userSpaceOnUse" cx="${gx}" cy="${cy}" r="${R}" gradientTransform="translate(0 ${n1(cy * (1 - 0.24))}) scale(1 0.24)"><stop offset="0" stop-color="${blue}" stop-opacity="0.3"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-fma-ink" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000000"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.4)}"/></linearGradient>
<linearGradient id="dbtefx-fma-grime" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0.1"/><stop offset="0.5" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.4"/></linearGradient>
<linearGradient id="dbtefx-fma-shadow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0.5"/><stop offset="1" stop-color="#000000" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-fma-void)"/>
<!--mid-->
<path d="M${gx - 220} ${base + 26}L${gx - 420} ${H}H${gx + 420}L${gx + 220} ${base + 26}Z" fill="url(#dbtefx-fma-shadow)" opacity="0.6"/>
<rect x="${gx - dw}" y="${iy}" width="${dw * 2}" height="${ih}" fill="${mix(t.bg, '#000000', 0.5)}"/>
${eyes}
${leaf(-1)}${leaf(1)}
<rect x="${gx - dw}" y="${iy}" width="${dw * 2}" height="${ih}" fill="url(#dbtefx-fma-grime)"/>
${tendrils}
${arch}
<!--near-->
<ellipse cx="${gx}" cy="${cy}" rx="${R + 40}" ry="${n1((R + 40) * 0.24)}" fill="url(#dbtefx-fma-pool)" style="animation: dbtefx-pulse 3.2s ease-in-out infinite;"/>
<g transform="translate(${gx} ${cy}) scale(1 ${ry})" fill="none"><g stroke="${blue}" stroke-opacity="0.3" stroke-width="9" vector-effect="non-scaling-stroke">${circle}</g><g stroke="${blue}" stroke-opacity="0.5" stroke-width="3.5" vector-effect="non-scaling-stroke">${circle}</g><g stroke="${bluePale}" stroke-width="1.6" vector-effect="non-scaling-stroke">${circle}</g></g>
<g fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.5">${bolts}</g>
<style>
@keyframes dbtefx-fma-doorl { 0%, 30%, 100% { transform: translateX(-8px); } 55%, 72% { transform: translateX(-20px); } }
@keyframes dbtefx-fma-doorr { 0%, 30%, 100% { transform: translateX(8px); } 55%, 72% { transform: translateX(20px); } }
@keyframes dbtefx-fma-reach { 0%, 100% { transform: rotate(-5deg) scale(0.92); } 50% { transform: rotate(6deg) scale(1.04); } }
@keyframes dbtefx-fma-eye { 0%, 40%, 88%, 100% { transform: scaleY(0.05); opacity: 0; } 52%, 76% { transform: scaleY(1); opacity: 1; } }
@keyframes dbtefx-fma-arc { 0% { opacity: 0; } 6% { opacity: 1; } 14% { opacity: 0.25; } 20% { opacity: 1; } 30% { opacity: 0.5; } 36%, 100% { opacity: 0; } }
</style>`;
};

export default scene;

export const particles = [
  { kind: 'spark', count: 46, colors: ['accent2', 'text'], column: true, columnX: 0.79 },
  { kind: 'mote', count: 30, colors: ['text'] },
];

// WebGL layer: the white void of Truth as a pale haze around the Gate, a
// floor fading into it, and the floor lit blue in flickers by the arcs.
export const shader = {
  uniforms: ['bg', 'text', 'accent2', 'accent'],
  frag: `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 g = vec2(0.79 * asp, 0.48);
  float t = u_time * 0.02;
  float haze = fbm(p * 2.2 + vec2(t, -t * 0.5) + fbm(p * 1.3 - t) * 0.8);
  float d = length((p - g) * vec2(0.8, 1.0));
  float glow = exp(-d * 2.4);
  vec3 col = u_bg;
  col = mix(col, mix(u_bg, u_text, 0.32), glow * (0.75 + 0.35 * haze));
  float horizon = 1.0 - smoothstep(0.0, 0.004, abs(uv.y - 0.143));
  float floorY = step(uv.y, 0.143);
  col += u_text * 0.04 * floorY * (1.0 - uv.y / 0.143) * glow * 2.0;
  float fl = noise(vec2(u_time * 9.0, 1.0));
  float spot = exp(-length((p - vec2(0.79 * asp, 0.09)) * vec2(0.55, 2.6)) * 2.2);
  col += u_accent2 * 0.22 * spot * (0.35 + fl * 0.9);
  col += u_accent * 0.05 * smoothstep(0.6, 0.0, length(uv - vec2(0.0, 0.0)));
  col *= 1.0 - 0.55 * dot(uv - vec2(0.6, 0.5), uv - vec2(0.6, 0.5));
  gl_FragColor = vec4(dither(col + horizon * 0.0), 1.0);
}`,
};
