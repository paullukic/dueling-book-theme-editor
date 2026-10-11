import { mix } from '../../../lib/color.js';
import { H, n1, polar, W } from './kit.js';

// Duel Links: the Gate of Duel World. A monumental ring gate on stepped
// stone, its portal a turning azure vortex, rises on the right over the
// game's holographic duel floor: a bright perspective grid of glowing tiles
// and light shafts. Now and then the red half-tone Skill cut-in slashes across
// the top-left sky, and » chevrons stream along the floor's edge.

const gx = 1214;
const gy = 470;
const gr = 124;

const scene = (t) => {
  const azure = t.accent;
  const azureHi = mix(azure, '#ffffff', 0.55);
  const yellow = t.accent2;
  const red = t.danger;
  const stone = mix(t.raised, t.muted, 0.28);
  const stoneHi = mix(stone, '#ffffff', 0.35);
  const stoneLo = mix(t.bg, t.raised, 0.5);
  const night = mix(t.bg, '#000000', 0.3);

  // Holographic floor: perspective lines to a vanishing point above the horizon.
  const hz = 600;
  const vx = 800;
  let floor = '';
  for (let i = -16; i <= 16; i++) {
    const xb = vx + i * 150;
    floor += `M${n1(vx + i * 16)} ${hz}L${xb} ${H}`;
  }
  for (let k = 0; k < 8; k++) {
    const y = n1(hz + (H - hz) * Math.pow(k / 7, 1.9));
    floor += `M0 ${y}H${W}`;
  }
  // Lit tiles (zones) near the gate.
  const tile = (i, k) => {
    const y0 = hz + (H - hz) * Math.pow(k / 7, 1.9);
    const y1 = hz + (H - hz) * Math.pow((k + 1) / 7, 1.9);
    const x = (yy, j) => vx + j * 16 + ((j * 150 - j * 16) * (yy - hz)) / (H - hz);
    return `M${n1(x(y0, i))} ${n1(y0)}L${n1(x(y0, i + 1))} ${n1(y0)}L${n1(x(y1, i + 1))} ${n1(y1)}L${n1(x(y1, i))} ${n1(y1)}Z`;
  };
  const lit = [[3, 3], [4, 4], [2, 5], [5, 2], [4, 6], [3, 1], [-4, 4], [-3, 6]].map(([i, k]) => tile(i, k)).join('');

  // The gate ring: segmented stone with azure inlay and keystones.
  let keys = '';
  for (let i = 0; i < 12; i++) {
    const a = i * 30 - 90;
    const [x1, y1] = polar(gx, gy, gr + 4, a - 4);
    const [x2, y2] = polar(gx, gy, gr + 34, a - 3);
    const [x3, y3] = polar(gx, gy, gr + 34, a + 3);
    const [x4, y4] = polar(gx, gy, gr + 4, a + 4);
    keys += `M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}L${x4} ${y4}Z`;
  }
  // Pylons either side, with angular capitals and glowing slits.
  const pylon = (x, dir) => {
    const w = 34;
    return `<path d="M${x - w} 760L${x - w + 6} 360L${x} 318L${x + w - 6} 360L${x + w} 760Z" fill="url(#dbtefx-dl-stone)" stroke="${stoneHi}" stroke-opacity="0.55" stroke-width="1.4"/><path d="M${x} 318L${x + w - 6} 360L${x + w} 760H${x}Z" fill="${night}" fill-opacity="0.35"/><path d="M${x - 5} 384H${x + 5}V720H${x - 6}Z" fill="${azure}" fill-opacity="0.85" style="animation: dbtefx-pulse 3.2s ease-in-out ${dir > 0 ? 0 : -1.6}s infinite;"/><path d="M${x - w - 4} 400H${x + w + 4}V414H${x - w - 4}Z" fill="${stoneHi}" stroke="${night}" stroke-opacity="0.5"/><path d="M${x - w - 10} 760H${x + w + 10}V778H${x - w - 10}Z" fill="${stoneLo}" stroke="${stoneHi}" stroke-opacity="0.4"/><path d="M${x - 15} 330L${x} 292L${x + 15} 330Z" fill="${yellow}" fill-opacity="0.9"/>`;
  };
  // Vortex arms turning inside the portal.
  let arms = '';
  for (let a = 0; a < 4; a++) {
    const pts = [];
    for (let k = 0; k <= 36; k++) {
      const f = k / 36;
      pts.push(polar(0, 0, gr - 8 - f * (gr - 20), a * 90 + f * 260).join(' '));
    }
    arms += `M${pts.join('L')}`;
  }

  // Skill cut-in: a red half-tone slash with a yellow edge.
  let dots = '';
  for (let x = 0; x < 22; x++) for (let y = 0; y < 5; y++) dots += `<circle cx="${n1(230 + x * 14 + (y % 2) * 7)}" cy="${n1(30 + y * 14)}" r="${n1(Math.max(0.6, 5.2 - x * 0.22))}"/>`;

  const shafts = [[1030, 0.5], [1500, 0.4], [520, 0.25]].map(([x, o], i) => `<path d="M${x - 16} ${hz - 260}H${x + 16}L${x + 40} ${H}H${x - 40}Z" fill="url(#dbtefx-dl-shaft)" opacity="${o}" style="animation: dbtefx-pulse ${5 + i * 2}s ease-in-out ${-i * 1.7}s infinite;"/>`).join('');

  const chev = (x, d) => `<path d="M${x} 870l14 14-14 14h9l14-14-14-14z" fill="${azureHi}" style="animation: dbtefx-dl-chev 2.4s linear ${n1(-d)}s infinite;"/>`;

  return `<defs>
<radialGradient id="dbtefx-dl-sky" gradientUnits="userSpaceOnUse" cx="${gx}" cy="${gy}" r="700"><stop offset="0" stop-color="${mix(t.bg, azure, 0.45)}" stop-opacity="0.75"/><stop offset="0.6" stop-color="${mix(t.bg, azure, 0.15)}" stop-opacity="0.3"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dl-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${azure}" stop-opacity="0"/><stop offset="0.25" stop-color="${mix(t.bg, azure, 0.4)}" stop-opacity="0.55"/><stop offset="1" stop-color="${mix(t.surface, azure, 0.35)}" stop-opacity="0.85"/></linearGradient>
<linearGradient id="dbtefx-dl-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${azureHi}" stop-opacity="0"/><stop offset="0.7" stop-color="${azureHi}" stop-opacity="0.18"/><stop offset="1" stop-color="${azureHi}" stop-opacity="0.32"/></linearGradient>
<linearGradient id="dbtefx-dl-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${stoneHi}"/><stop offset="0.4" stop-color="${stone}"/><stop offset="1" stop-color="${stoneLo}"/></linearGradient>
<radialGradient id="dbtefx-dl-portal" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.18" stop-color="${azureHi}" stop-opacity="0.85"/><stop offset="0.6" stop-color="${azure}" stop-opacity="0.6"/><stop offset="1" stop-color="${mix(t.bg, azure, 0.4)}" stop-opacity="0.9"/></radialGradient>
<radialGradient id="dbtefx-dl-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0.55" stop-color="${azure}" stop-opacity="0.4"/><stop offset="1" stop-color="${azure}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dl-fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${red}"/><stop offset="1" stop-color="${mix(red, t.bg, 0.35)}"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-dl-sky)"/>
<g style="animation: dbtefx-dl-skill 11s ease-out infinite;"><g transform="translate(850 78) rotate(-4 280 70) scale(0.9)"><path d="M24 20H560L536 104H0Z" fill="url(#dbtefx-dl-fade)"/><g fill="${mix(red, '#000000', 0.5)}" fill-opacity="0.5">${dots}</g><path d="M24 20H560L557 30H21Z" fill="${mix(red, '#ffffff', 0.35)}"/><path d="M0 104H536L533 114H-3Z" fill="${yellow}"/><path d="M-26 104L4 20H18L-12 104Z" fill="${yellow}"/><path d="M562 20H580L556 104H538Z" fill="${yellow}" fill-opacity="0.85"/></g></g>
<!--mid-->
<path d="M0 ${hz}H${W}V${H}H0Z" fill="url(#dbtefx-dl-floor)"/>
<path d="${floor}" stroke="${azureHi}" stroke-opacity="0.32" stroke-width="1.4" fill="none"/>
<path d="${lit}" fill="${azure}" fill-opacity="0.2" stroke="${azureHi}" stroke-opacity="0.85" stroke-width="2"/>
${shafts}
<ellipse cx="${gx}" cy="${gy}" rx="${gr + 120}" ry="${gr + 120}" fill="url(#dbtefx-dl-halo)" style="animation: dbtefx-pulse 4s ease-in-out infinite;"/>
<path d="M${gx - 230} 790L${gx - 200} 760H${gx + 200}L${gx + 230} 790Z" fill="${stoneLo}" stroke="${stoneHi}" stroke-opacity="0.5"/>
<path d="M${gx - 190} 760L${gx - 165} 730H${gx + 165}L${gx + 190} 760Z" fill="${stone}" stroke="${stoneHi}" stroke-opacity="0.5"/>
<path d="M${gx - 150} 730L${gx - 130} 700H${gx + 130}L${gx + 150} 730Z" fill="${stoneHi}" fill-opacity="0.75" stroke="${azureHi}" stroke-opacity="0.6"/>
<path d="M${gx - 130} 700H${gx + 130}" stroke="${azureHi}" stroke-width="2.4"/>
<circle cx="${gx}" cy="${gy}" r="${gr}" fill="url(#dbtefx-dl-portal)"/>
<g transform="translate(${gx} ${gy})"><g style="animation: dbtefx-spin 14s linear infinite;"><path d="${arms}" fill="none" stroke="${azureHi}" stroke-opacity="0.55" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="${arms}" fill="none" stroke="#ffffff" stroke-opacity="0.75" stroke-width="2.2" stroke-linecap="round"/></g></g>
<circle cx="${gx}" cy="${gy}" r="36" fill="#ffffff" fill-opacity="0.85" style="animation: dbtefx-bloom 3s ease-in-out infinite; transform-box: fill-box; transform-origin: center;"/>
<circle cx="${gx}" cy="${gy}" r="${gr + 19}" fill="none" stroke="url(#dbtefx-dl-stone)" stroke-width="38"/>
<path d="M${polar(gx, gy, gr + 30, 200).join(' ')}A${gr + 30} ${gr + 30} 0 0 1 ${polar(gx, gy, gr + 30, 290).join(' ')}" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>
<circle cx="${gx}" cy="${gy}" r="${gr + 8}" fill="none" stroke="${night}" stroke-opacity="0.6" stroke-width="8"/>
<path d="${keys}" fill="${stoneHi}" stroke="${night}" stroke-opacity="0.6" stroke-width="1.2"/>
<circle cx="${gx}" cy="${gy}" r="${gr + 2}" fill="none" stroke="${azureHi}" stroke-width="3"/>
<circle cx="${gx}" cy="${gy}" r="${gr + 36}" fill="none" stroke="${azure}" stroke-opacity="0.8" stroke-width="2" stroke-dasharray="14 10" style="animation: dbtefx-spin 40s linear infinite reverse; transform-origin: ${gx}px ${gy}px;"/>
${pylon(gx - 186, 1)}${pylon(gx + 186, -1)}
<g style="animation: dbtefx-bob 4s ease-in-out infinite;"><path d="M${gx - 34} ${gy - gr - 60}L${gx} ${gy - gr - 108}L${gx + 34} ${gy - gr - 60}L${gx} ${gy - gr - 12}Z" fill="${yellow}" stroke="${mix(yellow, '#000000', 0.45)}" stroke-width="2"/><path d="M${gx} ${gy - gr - 108}L${gx + 34} ${gy - gr - 60}L${gx} ${gy - gr - 60}Z" fill="#ffffff" fill-opacity="0.45"/><path d="M${gx - 34} ${gy - gr - 60}L${gx} ${gy - gr - 12}V${gy - gr - 60}Z" fill="${mix(yellow, '#000000', 0.35)}"/></g>
<!--near-->
${[0, 0.4, 0.8, 1.2, 1.6, 2].map((d, i) => chev(1080 + i * 0, d)).join('')}
<style>
@keyframes dbtefx-dl-skill { 0% { transform: translateX(-90px); opacity: 0; } 5% { transform: translateX(0); opacity: 0.9; } 60% { transform: translateX(24px); opacity: 0.9; } 68% { transform: translateX(70px); opacity: 0; } 100% { transform: translateX(70px); opacity: 0; } }
@keyframes dbtefx-dl-chev { 0% { transform: translateX(0); opacity: 0; } 15% { opacity: 1; } 100% { transform: translateX(380px); opacity: 0; } }
</style>`;
};

export default scene;

export const particles = [
  { kind: 'mote', count: 36, colors: ['accent', 'link'], rise: true, column: true, columnX: 0.79 },
  { kind: 'spark', count: 14, colors: ['accent2'], column: true, columnX: 0.79 },
  { kind: 'star', count: 40, colors: ['text'] },
];
