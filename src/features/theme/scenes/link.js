import { mix } from '../../../lib/color.js';
import { glow, H, n1, polar, W } from './kit.js';

// Link: a Link Summon circuit over the Cyberse grid. The eight Link Arrows
// light one by one, clockwise, over 1.6 s; the core fires a beam upward; the
// arrows go dark in turn and the circuit rests before the next summon.
const C = 7; // one summon, seconds
const STEP = 0.2; // gap between arrows lighting

// Inline animation that reaches phase 0 at `start` seconds (negative delay, so nothing waits).
const a = (name, start = 0, origin = 'center') =>
  `style="animation: dbtefx-lk-${name} ${C}s linear ${n1(start ? -(C - (start % C)) : 0)}s infinite; transform-box: fill-box; transform-origin: ${origin};"`;

const link = (t) => {
  const cx = 1050;
  const cy = 360;
  const k = 1.4; // portal scale
  const s = 112 * k; // half side of the portal frame
  const lit = mix(t.accent2, '#ffffff', 0.6);
  const halo = mix(t.danger, t.warning, 0.15);
  const red = t.danger;
  const dim = mix(t.bg, t.accent, 0.3);
  const line = t.accent2;

  // Card-frame arrow shapes, pointing up: flat triangle on an edge, right-angled one at a corner.
  const edge = 'M-50 0L0 -30L50 0Z';
  const edgeIn = 'M-30 -5L0 -22L30 -5Z';
  const corner = 'M-38 0L0 -38L38 0Z';
  const cornerIn = 'M-22 -6L0 -28L22 -6Z';
  const reach = (i) => (i % 2 ? s * 1.414 + 22 * k : s + 14 * k);
  const place = (i) => {
    const [x, y] = polar(cx, cy, reach(i), i * 45 - 90);
    return `translate(${x} ${y}) rotate(${i * 45}) scale(${k})`;
  };
  // A bevelled arrow: gradient body, a lit left facet, shaded right and base
  // facets, and a raised inner face. Points are [outer, inner] triangles.
  const pt = (d) => d.match(/-?[\d.]+/g).map(Number);
  const arrow = (shape, inner, body, face, rim) => {
    const [ax, ay, bx, by, cx2, cy2] = pt(shape);
    const [px, py, qx, qy, rx, ry] = pt(inner);
    return `<path d="${shape}" fill="url(#${body})" stroke="${rim}" stroke-width="1.5" stroke-linejoin="round"/>`
      + `<path d="M${ax} ${ay}L${bx} ${by}L${qx} ${qy}L${px} ${py}Z" fill="#ffffff" fill-opacity="0.4"/>`
      + `<path d="M${bx} ${by}L${cx2} ${cy2}L${rx} ${ry}L${qx} ${qy}Z" fill="#000000" fill-opacity="0.16"/>`
      + `<path d="M${ax} ${ay}L${cx2} ${cy2}L${rx} ${ry}L${px} ${py}Z" fill="#000000" fill-opacity="0.32"/>`
      + `<path d="${inner}" fill="url(#${face})"/>`;
  };
  let bases = '';
  let lights = '';
  for (let i = 0; i < 8; i++) {
    const shape = i % 2 ? corner : edge;
    const inner = i % 2 ? cornerIn : edgeIn;
    bases += `<g transform="${place(i)}" opacity="0.85">${arrow(shape, inner, 'dbtefx-lk-cyan', 'dbtefx-lk-cyanf', line)}</g>`;
    // Active arrows light red, as on a Link card. Still frames show the first three set.
    lights += `<g transform="${place(i)}"><g opacity="${i < 3 ? 1 : 0}" ${a('arm', i * STEP)}><circle cy="-14" r="52" fill="url(#dbtefx-lk-halo)"/>${arrow(shape, inner, 'dbtefx-lk-red', 'dbtefx-lk-redf', '#ffffff')}</g></g>`;
  }

  // Three circuit traces feed the portal: from the top, the right and the floor.
  const feed = (i, jog, len) => {
    const r = reach(i) + (i % 2 ? 38 : 30) * k;
    return `<g transform="translate(${cx} ${cy}) rotate(${i * 45})"><path d="M0 ${n1(-r - 6)}V${n1(-r - 120)}L${jog * 50} ${n1(-r - 170)}V${n1(-r - len)}"/><rect x="-2.5" y="${n1(-r - 126)}" width="5" height="34" rx="2.5" fill="${lit}" stroke="none" opacity="0" ${a('in', i * STEP - 0.35)}/></g>`;
  };

  // Cyberse floor: a perspective grid to a vanishing point under the portal.
  const hy = 660;
  let grid = '';
  for (let j = -14; j <= 14; j++) grid += `<path d="M${cx + j * 24} ${hy}L${cx + j * 260} ${H + 20}"/>`;
  for (let j = 1; j < 9; j++) grid += `<path d="M0 ${n1(hy + (H + 20 - hy) * (j / 8) ** 1.8)}H${W}"/>`;

  return `<style>
@keyframes dbtefx-lk-arm { 0% { opacity: 0; transform: scale(1.3); } 2% { opacity: 1; transform: scale(1); } 48% { opacity: 1; } 52%, 100% { opacity: 0; } }
@keyframes dbtefx-lk-fire { 0%, 27% { opacity: 0; } 29% { opacity: 1; } 40% { opacity: 0.5; } 50%, 100% { opacity: 0; } }
@keyframes dbtefx-lk-beam { 0%, 27% { opacity: 0; transform: scaleY(0); } 32% { opacity: 1; transform: scaleY(1); } 46% { opacity: 0.6; transform: scaleY(1); } 58%, 100% { opacity: 0; transform: scaleY(1); } }
@keyframes dbtefx-lk-wave { 0%, 28% { opacity: 0; transform: scale(0.5); } 29% { opacity: 1; transform: scale(0.55); } 45%, 100% { opacity: 0; transform: scale(1.6); } }
@keyframes dbtefx-lk-in { 0% { transform: translateY(0); opacity: 0; } 1% { opacity: 1; } 4.5% { opacity: 1; } 5% { transform: translateY(110px); opacity: 0; } 100% { transform: translateY(110px); opacity: 0; } }
@keyframes dbtefx-lk-spin { to { transform: rotate(360deg); } }
</style>
<defs>${glow('dbtefx-lk-halo', halo, 0.5, 0.5, 0.5, 0.6)}${glow('dbtefx-lk-sky', t.accent, 0.5, 0.5, 0.5, 0.3)}${glow('dbtefx-lk-core', line, 0.5, 0.5, 0.5, 0.75)}${glow('dbtefx-lk-burst', lit, 0.5, 0.5, 0.5, 0.95)}
<linearGradient id="dbtefx-lk-cyan" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(line, t.accent, 0.5)}"/><stop offset="0.55" stop-color="${line}"/><stop offset="1" stop-color="${mix(line, '#ffffff', 0.85)}"/></linearGradient>
<linearGradient id="dbtefx-lk-cyanf" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(line, '#ffffff', 0.35)}"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<linearGradient id="dbtefx-lk-red" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(red, '#000000', 0.45)}"/><stop offset="0.6" stop-color="${red}"/><stop offset="1" stop-color="${mix(red, '#ffffff', 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-lk-redf" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${red}"/><stop offset="1" stop-color="${mix(red, '#ffffff', 0.75)}"/></linearGradient>
<linearGradient id="dbtefx-lk-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${line}" stop-opacity="0"/><stop offset="1" stop-color="${line}" stop-opacity="0.5"/></linearGradient>
<linearGradient id="dbtefx-lk-shaft" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="0.4" stop-color="${lit}" stop-opacity="0.45"/><stop offset="1" stop-color="${lit}" stop-opacity="0"/></linearGradient></defs>
<ellipse cx="${cx}" cy="${cy}" rx="620" ry="500" fill="url(#dbtefx-lk-sky)"/>
<g stroke="url(#dbtefx-lk-floor)" stroke-width="1.5" fill="none">${grid}</g>
<!--mid-->
<g fill="none" stroke="${line}" stroke-opacity="0.35" stroke-width="2.5">${feed(0, 1, 260)}${feed(2, -1, 420)}${feed(4, 1, 300)}</g>
<path d="M${cx - 56} ${cy}L${cx - 18} -40H${cx + 18}L${cx + 56} ${cy}Z" fill="url(#dbtefx-lk-shaft)" opacity="0" ${a('beam', 0, '50% 100%')}/>
<g fill="none" stroke="${line}">
<rect x="${cx - s}" y="${cy - s}" width="${s * 2}" height="${s * 2}" fill="${t.bg}" fill-opacity="0.6" stroke-opacity="0.85" stroke-width="3.5"/>
<rect x="${n1(cx - s + 18)}" y="${n1(cy - s + 18)}" width="${n1(s * 2 - 36)}" height="${n1(s * 2 - 36)}" stroke-opacity="0.3" stroke-width="1.5"/>
</g>
<circle cx="${cx}" cy="${cy}" r="140" fill="url(#dbtefx-lk-core)"/>
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-lk-spin 30s linear infinite;" fill="none" stroke="${line}" stroke-opacity="0.45"><circle cx="${cx}" cy="${cy}" r="118" stroke-width="2" stroke-dasharray="34 10 4 10"/></g>
<path d="M${cx} ${cy - 76}L${cx + 76} ${cy}L${cx} ${cy + 76}L${cx - 76} ${cy}Z" fill="${t.bg}" fill-opacity="0.7" stroke="${line}" stroke-width="3.5" stroke-opacity="0.9"/>
<path d="M${cx} ${cy - 48}L${cx + 48} ${cy}L${cx} ${cy + 48}L${cx - 48} ${cy}Z" fill="${dim}" stroke="${line}" stroke-opacity="0.5" stroke-width="1.5"/>
<circle cx="${cx}" cy="${cy}" r="150" fill="url(#dbtefx-lk-burst)" opacity="0" ${a('fire')}/>
${bases}
${lights}
<rect x="${cx - s}" y="${cy - s}" width="${s * 2}" height="${s * 2}" fill="none" stroke="${lit}" stroke-width="2.5" opacity="0" ${a('wave')}/>`;
};

export default link;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 36, colors: ['accent2', 'accent'] }];
