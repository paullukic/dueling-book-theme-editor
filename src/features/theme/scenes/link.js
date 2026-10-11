import { mix } from '../../../lib/color.js';
import { glow, H, n1, polar, rng, W } from './kit.js';

// Link: a Link Summon circuit in the Cyberse network. Eight Link Arrows ring
// the portal and light up one by one, clockwise; when the last is set the
// circuit fires (every arrow flares, a shock ring, a beam through the core).
const C = 8; // one summon cycle, seconds
const STEP = 0.45; // gap between arrows lighting

// Inline animation that reaches phase 0 at `start` seconds (negative delay, so nothing waits).
const a = (name, dur, start = 0, ease = 'linear') =>
  `style="animation: dbtefx-lk-${name} ${dur}s ${ease} ${n1(start ? -(dur - (start % dur)) : 0)}s infinite; transform-box: fill-box; transform-origin: center;"`;

const link = (t) => {
  const cx = 1262;
  const cy = 350;
  const s = 112; // half side of the portal frame
  const lit = mix(t.self, t.warning, 0.3);
  const hot = mix(lit, '#ffffff', 0.55);
  const dim = mix(t.bg, t.accent, 0.3);
  const line = t.accent2;
  const rand = rng(41);

  // Card-frame arrow shapes, pointing up: flat triangle on an edge, right-angled one at a corner.
  const edge = 'M-50 0L0 -30L50 0Z';
  const edgeIn = 'M-30 -5L0 -22L30 -5Z';
  const corner = 'M-38 0L0 -38L38 0Z';
  const cornerIn = 'M-22 -6L0 -28L22 -6Z';
  const reach = (i) => (i % 2 ? s * 1.414 + 22 : s + 14);
  const place = (i) => {
    const [x, y] = polar(cx, cy, reach(i), i * 45 - 90);
    return `translate(${x} ${y}) rotate(${i * 45})`;
  };
  let bases = '';
  let lights = '';
  let flare = '';
  let feeds = '';
  let packets = '';
  for (let i = 0; i < 8; i++) {
    const shape = i % 2 ? corner : edge;
    const inner = i % 2 ? cornerIn : edgeIn;
    const r = reach(i) + (i % 2 ? 38 : 30);
    bases += `<g transform="${place(i)}"><path d="${shape}" fill="${dim}" stroke="${line}" stroke-opacity="0.6" stroke-width="2"/><path d="${inner}" fill="${t.bg}" fill-opacity="0.6"/></g>`;
    // Still frames show the first three arrows set.
    lights += `<g transform="${place(i)}"><g opacity="${i < 3 ? 1 : 0}" ${a('arm', C, i * STEP)}><circle cy="-14" r="54" fill="url(#dbtefx-lk-halo)"/><path d="${shape}" fill="${lit}" stroke="${hot}" stroke-width="2"/><path d="${inner}" fill="${hot}"/></g></g>`;
    flare += `<path d="${shape}" transform="${place(i)}"/>`;
    // A circuit line runs out from each arrow; a material packet rides it in just before the arrow lights.
    const jog = i % 2 ? -1 : 1;
    feeds += `<path transform="translate(${cx} ${cy}) rotate(${i * 45})" d="M0 ${-r - 6}V${-r - 190}L${jog * 46} ${-r - 236}V${-r - 380}"/><circle transform="translate(${cx} ${cy}) rotate(${i * 45})" cx="${jog * 46}" cy="${-r - 386}" r="6"/>`;
    packets += `<g transform="translate(${cx} ${cy}) rotate(${i * 45})"><rect x="-2.5" y="${-r - 196}" width="5" height="34" rx="2.5" fill="${hot}" opacity="0" ${a('in', C, i * STEP - 0.55)}/></g>`;
  }

  // Cyberse floor: a perspective grid to a vanishing point under the portal.
  const vx = cx;
  const hy = 640;
  let grid = '';
  for (let k = -14; k <= 14; k++) grid += `<path d="M${vx + k * 22} ${hy}L${vx + k * 260} ${H + 20}"/>`;
  for (let j = 1; j < 9; j++) {
    const y = n1(hy + (H + 20 - hy) * (j / 8) ** 1.8);
    grid += `<path d="M0 ${y}H${W}"/>`;
  }

  // Data columns rising in the distance.
  let columns = '';
  for (let i = 0; i < 18; i++) {
    const x = n1(80 + rand() * 1440);
    const h = n1(60 + rand() * 260);
    columns += `<rect x="${x}" y="${hy - h}" width="${n1(2 + rand() * 5)}" height="${h}" opacity="${n1(0.25 + rand() * 0.5)}"/>`;
  }

  // Wireframe data cubes drifting at the edges.
  const cube = (x, y, r, d) =>
    `<g style="animation: dbtefx-bob ${d}s ease-in-out infinite;"><path d="M${x} ${y - r}L${n1(x + r * 0.87)} ${y - r / 2}V${y + r / 2}L${x} ${y + r}L${n1(x - r * 0.87)} ${y + r / 2}V${y - r / 2}ZM${x} ${y}V${y + r}M${x} ${y}L${n1(x + r * 0.87)} ${y - r / 2}M${x} ${y}L${n1(x - r * 0.87)} ${y - r / 2}"/></g>`;

  return `<style>
@keyframes dbtefx-lk-arm { 0% { opacity: 0; transform: scale(1.3); } 2.5% { opacity: 1; transform: scale(1); } 43% { opacity: 1; } 49%, 100% { opacity: 0; } }
@keyframes dbtefx-lk-fire { 0%, 41% { opacity: 0; } 43% { opacity: 1; } 52% { opacity: 0.45; } 62%, 100% { opacity: 0; } }
@keyframes dbtefx-lk-wave { 0%, 41% { opacity: 0; transform: scale(0.4); } 42.5% { opacity: 1; transform: scale(0.45); } 62%, 100% { opacity: 0; transform: scale(2.6); } }
@keyframes dbtefx-lk-beam { 0%, 41% { opacity: 0; transform: scaleX(0.2); } 45% { opacity: 1; transform: scaleX(1); } 70%, 100% { opacity: 0; transform: scaleX(0.6); } }
@keyframes dbtefx-lk-in { 0% { transform: translateY(0); opacity: 0; } 1% { opacity: 1; } 6.5% { opacity: 1; } 7% { transform: translateY(170px); opacity: 0; } 100% { transform: translateY(170px); opacity: 0; } }
@keyframes dbtefx-lk-spin { to { transform: rotate(360deg); } }
</style>
<defs>${glow('dbtefx-lk-halo', lit, 0.5, 0.5, 0.5, 0.55)}${glow('dbtefx-lk-sky', t.accent, 0.5, 0.5, 0.5, 0.32)}${glow('dbtefx-lk-core', line, 0.5, 0.5, 0.5, 0.75)}${glow('dbtefx-lk-burst', hot, 0.5, 0.5, 0.5, 0.95)}
<linearGradient id="dbtefx-lk-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${line}" stop-opacity="0"/><stop offset="1" stop-color="${line}" stop-opacity="0.5"/></linearGradient>
<linearGradient id="dbtefx-lk-col" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${line}" stop-opacity="0"/><stop offset="1" stop-color="${line}" stop-opacity="0.5"/></linearGradient>
<radialGradient id="dbtefx-lk-shaft"><stop offset="0" stop-color="${hot}" stop-opacity="0.7"/><stop offset="0.35" stop-color="${lit}" stop-opacity="0.3"/><stop offset="1" stop-color="${lit}" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="${cx}" cy="${cy}" rx="560" ry="460" fill="url(#dbtefx-lk-sky)"/>
<g fill="url(#dbtefx-lk-col)">${columns}</g>
<g stroke="url(#dbtefx-lk-floor)" stroke-width="1.5" fill="none">${grid}</g>
<g fill="none" stroke="${line}" stroke-opacity="0.22" stroke-width="2">${cube(170, 120, 34, 7)}${cube(1520, 760, 26, 9)}${cube(250, 820, 20, 8)}</g>
<!--mid-->
<path d="M${cx} ${cy - 250}L${cx + 250} ${cy}L${cx} ${cy + 250}L${cx - 250} ${cy}Z" fill="none" stroke="${line}" stroke-opacity="0.14" stroke-width="2"/>
<g fill="none" stroke="${line}" stroke-opacity="0.3" stroke-width="2.5">${feeds}</g>
${packets}
<ellipse cx="${cx}" cy="${cy}" rx="80" ry="${H}" fill="url(#dbtefx-lk-shaft)" opacity="0" ${a('beam', C, 0)}/>
<g fill="none" stroke="${line}">
<rect x="${cx - s}" y="${cy - s}" width="${s * 2}" height="${s * 2}" fill="${t.bg}" fill-opacity="0.55" stroke-opacity="0.8" stroke-width="3"/>
<rect x="${cx - s + 14}" y="${cy - s + 14}" width="${s * 2 - 28}" height="${s * 2 - 28}" stroke-opacity="0.3" stroke-width="1.5"/>
<path d="M${cx - s + 14} ${cy}H${cx - 56}M${cx + 56} ${cy}H${cx + s - 14}M${cx} ${cy - s + 14}V${cy - 56}M${cx} ${cy + 56}V${cy + s - 14}" stroke-opacity="0.35" stroke-dasharray="4 6"/>
</g>
<circle cx="${cx}" cy="${cy}" r="100" fill="url(#dbtefx-lk-core)"/>
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-lk-spin 24s linear infinite;" fill="none" stroke="${line}" stroke-opacity="0.45"><circle cx="${cx}" cy="${cy}" r="84" stroke-width="2" stroke-dasharray="26 8 4 8"/></g>
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-lk-spin 16s linear infinite reverse;" fill="none" stroke="${line}" stroke-opacity="0.35"><circle cx="${cx}" cy="${cy}" r="70" stroke-width="6" stroke-dasharray="2 10"/></g>
<path d="M${cx} ${cy - 54}L${cx + 54} ${cy}L${cx} ${cy + 54}L${cx - 54} ${cy}Z" fill="${t.bg}" fill-opacity="0.7" stroke="${line}" stroke-width="3" stroke-opacity="0.9"/>
<path d="M${cx} ${cy - 34}L${cx + 34} ${cy}L${cx} ${cy + 34}L${cx - 34} ${cy}Z" fill="${dim}" stroke="${line}" stroke-opacity="0.5" stroke-width="1.5"/>
<circle cx="${cx}" cy="${cy}" r="110" fill="url(#dbtefx-lk-burst)" opacity="0" ${a('fire', C, 0)}/>
${bases}
${lights}
<g fill="${hot}" opacity="0" ${a('fire', C, 0)}>${flare}</g>
<circle cx="${cx}" cy="${cy}" r="${s}" fill="none" stroke="${lit}" stroke-width="6" opacity="0" ${a('wave', C, 0)}/><rect x="${cx - s}" y="${cy - s}" width="${s * 2}" height="${s * 2}" fill="none" stroke="${hot}" stroke-width="3" opacity="0" ${a('wave', C, 0.25)}/>
<!--near-->
<g fill="none" stroke="${line}" stroke-opacity="0.12" stroke-width="3"><path d="${corner}" transform="translate(1420 830) rotate(135) scale(2.4)"/></g>`;
};

export default link;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 40, colors: ['accent2', 'accent'] },
  { kind: 'star', count: 60, colors: ['accent2'] },
];
