import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, rng } from './kit.js';

// Elemental HERO: the Skyscraper city at night. Searchlights sweep, a rooftop
// lamp throws a fusion vortex onto the clouds, Neos keeps watch, and
// apartment lights switch on and off across the skyline.
const hero = (t) => {
  const rand = rng(5);
  const beam = (x, delay) =>
    `<g style="transform-origin: ${x}px ${H}px; animation: dbtefx-sway 11s ease-in-out ${-delay}s infinite;"><path d="M${x - 10} ${H}L${x - 140} -40L${x + 140} -40L${x + 10} ${H}Z" fill="url(#dbtefx-hr-beam)"/></g>`;

  // The signal: the beam cone ends in a pool of light on the cloud base.
  const [cx, cy, prx, pry, tilt] = [1312, 168, 114, 66, -8];
  const [lx, ly, aim] = [1414, 462, -112];
  const [sx, sy] = [n1(lx + 20 * Math.cos((aim * Math.PI) / 180)), n1(ly + 20 * Math.sin((aim * Math.PI) / 180))];
  const tr = (tilt * Math.PI) / 180;
  const [ax, ay] = [n1(cx - prx * Math.cos(tr)), n1(cy - prx * Math.sin(tr))];
  const [bx, by] = [n1(cx + prx * Math.cos(tr)), n1(cy + prx * Math.sin(tr))];
  const signalBeam = `M${sx - 12} ${sy}L${ax} ${ay}L${bx} ${by}L${sx + 12} ${sy}Z`;
  let rays = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    rays += `M${cx} ${cy}L${n1(cx + Math.cos(a - 0.04) * 330)} ${n1(cy + Math.sin(a - 0.04) * 170)}L${n1(cx + Math.cos(a + 0.04) * 330)} ${n1(cy + Math.sin(a + 0.04) * 170)}Z`;
  }
  const puff = (x, y, rx, ry, o) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#dbtefx-hr-cloud)" fill-opacity="${o}"/>`;
  const cloudBank = [
    [1160, 150, 220, 70, 0.9],
    [1330, 120, 260, 80, 0.95],
    [1500, 160, 200, 70, 0.9],
    [1260, 200, 240, 50, 0.8],
    [1100, 120, 160, 50, 0.5],
  ]
    .map((p) => puff(...p))
    .join('');

  // The city: windows are two patterns (dim grid, scattered lit) so every
  // building costs three shapes; a few apartments switch with a short fade.
  const cell = [12, 16];
  let litTile = '';
  for (let c = 0; c < 7; c++) for (let r = 0; r < 9; r++) if (rand() < 0.27) litTile += `<rect x="${c * 12 + 3}" y="${r * 16 + 4}" width="5" height="7"/>`;
  let switches = '';
  let switching = 0;
  const switcher = (x, y, w, h) => {
    if (switching >= 22) return;
    const dur = n1(9 + rand() * 6);
    const fill = switching === 7 ? t.link : t.warning;
    switches += `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="${fill}" style="animation: dbtefx-hr-${switching === 7 ? 'tv' : 'sw'} ${dur}s linear ${n1(-rand() * dur)}s infinite;"/>`;
    switching += 1;
  };
  const building = (x, top, w, tone, scale, crown, sw) => {
    const [gx, gy] = [cell[0] * scale, cell[1] * scale];
    const x0 = Math.ceil((x + 5) / gx) * gx;
    const x1 = Math.floor((x + w - 5) / gx) * gx;
    const y0 = Math.ceil((top + 8) / gy) * gy;
    const id = scale === 1 ? '' : scale === 1.6 ? '-m' : '-n';
    let s = `<rect x="${n1(x)}" y="${n1(top)}" width="${n1(w)}" height="${n1(H - top + 10)}" fill="${tone}"/>`;
    const rx = n1(x + w / 2);
    if (crown === 'water') s += `<path d="M${rx - 18} ${top}v-14h4v14zM${rx + 14} ${top}v-14h4v14zM${rx - 22} ${top - 14}h44v-22q-22-8-44 0z" fill="${tone}"/><path d="M${rx - 24} ${top - 36}l24-10 24 10z" fill="${tone}"/>`;
    if (crown === 'mast') s += `<rect x="${rx - 2}" y="${top - 70}" width="4" height="70" fill="${tone}"/><circle cx="${rx}" cy="${top - 72}" r="3" fill="${t.accent2}" ${anim('hr-air', 2.6, rand() * 2)}/>`;
    if (crown === 'setback') s += `<rect x="${n1(x + w * 0.18)}" y="${top - 40}" width="${n1(w * 0.64)}" height="40" fill="${tone}"/><rect x="${n1(x + w * 0.34)}" y="${top - 64}" width="${n1(w * 0.32)}" height="24" fill="${tone}"/>`;
    if (crown === 'spire') s += `<path d="M${n1(x + w * 0.15)} ${top}V${top - 30}H${n1(x + w * 0.3)}V${top - 56}H${n1(x + w * 0.42)}L${rx} ${top - 130}L${n1(x + w * 0.58)} ${top - 56}H${n1(x + w * 0.7)}V${top - 30}H${n1(x + w * 0.85)}V${top}Z" fill="${tone}"/>`;
    if (crown === 'slant') s += `<path d="M${n1(x)} ${top}L${n1(x + w)} ${top - 34}V${top}Z" fill="${tone}"/>`;
    if (x1 > x0) {
      const win = `x="${n1(x0)}" y="${n1(y0)}" width="${n1(x1 - x0)}" height="${n1(H - y0)}"`;
      s += `<rect ${win} fill="url(#dbtefx-hr-grid${id})"/><rect ${win} fill="url(#dbtefx-hr-lit${id})"/>`;
      for (let k = 0; k < sw; k++) {
        const c = Math.floor(rand() * ((x1 - x0) / gx));
        const r = 1 + Math.floor(rand() * 6);
        switcher(x0 + c * gx + 3 * scale, y0 + r * gy + 4 * scale, 5 * scale, 7 * scale);
      }
    }
    return s;
  };

  const crowns = ['flat', 'water', 'setback', 'flat', 'slant', 'mast', 'flat', 'spire', 'water', 'flat', 'setback'];
  let back = '';
  for (let x = -20, i = 0; x < 1620; i++) {
    const w = 54 + rand() * 66;
    back += building(x, n1(486 + rand() * 80), w, mix(t.bg, t.surface, 0.75), 1, crowns[i % crowns.length], i % 4 === 0 ? 1 : 0);
    x += w + 2;
  }
  let middle = '';
  for (let x = -40, i = 0; x < 1640; i++) {
    const w = 80 + rand() * 80;
    middle += building(x, n1(640 + rand() * 110), w, mix(t.bg, t.surface, 0.35), 1.6, crowns[(i + 4) % crowns.length], i % 2);
    x += w + 24 + rand() * 60;
  }

  // Foreground towers: darkest, rim-lit; the right one carries the lamp.
  const facade = mix(t.bg, '#000000', 0.35);
  const front = [
    [40, 410, 236, 'water', t.opp, 268],
    [262, 640, 150, 'flat', t.opp, 404],
    [1330, 500, 300, 'flat', t.accent, 1330],
    [1186, 670, 150, 'flat', t.accent, 1186],
  ]
    .map(([x, top, w, crown, rimColor, rimX]) => `${building(x, top, w, facade, 2.2, crown, 4)}<rect x="${rimX}" y="${top}" width="3" height="${H - top}" fill="${rimColor}" fill-opacity="0.3"/><rect x="${x}" y="${top}" width="${w}" height="5" fill="${t.border}" fill-opacity="0.8"/>`)
    .join('');
  const lamp = `<path d="M${lx - 16} 500L${lx - 6} ${ly + 10}H${lx + 6}L${lx + 16} 500z" fill="${facade}" stroke="${t.border}" stroke-width="1.5"/><g transform="translate(${lx} ${ly}) rotate(${aim})"><rect x="-21" y="-14" width="8" height="28" rx="2" fill="${facade}" stroke="${t.border}" stroke-width="1.5"/><rect x="-14" y="-22" width="30" height="44" rx="4" fill="${facade}" stroke="${t.border}" stroke-width="1.5"/><ellipse cx="17" cy="0" rx="5" ry="20" fill="${mix(t.accent, '#ffffff', 0.75)}"/></g>`;

  // The hero: Elemental HERO Neos in silhouette, the swept head fin and
  // pointed shoulder guards rim-lit by the lamp (no cape).
  const ink = mix(t.bg, '#000000', 0.55);
  const figure = `<g transform="translate(1362 500)">
<path fill-rule="evenodd" fill="${ink}" d="M-4 -127L4 -127L6 -123L22 -117Q28 -115 29 -108L37 -88Q37 -84 33 -82L20 -73L15 -68L18 -36L20 -4L25 0L11 0L9 -32L2 -58L-2 -58L-9 -32L-11 0L-25 0L-20 -4L-18 -36L-15 -68L-20 -73L-33 -82Q-37 -84 -37 -88L-29 -108Q-28 -115 -22 -117L-6 -123ZM20 -101L28 -89L18 -80L14 -88ZM-20 -101L-28 -89L-18 -80L-14 -88Z"/>
<path d="M18 -118L34 -126L30 -110ZM-18 -118L-34 -126L-30 -110Z" fill="${ink}"/>
<ellipse cx="0" cy="-136" rx="7.5" ry="9.5" fill="${ink}"/><path d="M-5 -140C-2 -152 8 -162 22 -167C13 -157 9 -146 7 -132Z" fill="${ink}"/>
<path d="M6 -123L22 -117L34 -126M29 -108L37 -88M8 -140C10 -150 14 -160 22 -167" fill="none" stroke="${t.accent}" stroke-opacity="0.8" stroke-width="1.6" stroke-linejoin="round"/>
</g>`;

  // A fusion vortex cast onto the cloud: the HERO Polymerization swirl, four
  // spiral arms turning slowly in the pool of light.
  let arms = '';
  for (let k = 0; k < 4; k++) {
    let d = '';
    for (let i = 0; i <= 24; i++) {
      const a = (k * Math.PI) / 2 + i * 0.16;
      const r = 6 + i * 4.4;
      d += `${i ? 'L' : 'M'}${n1(Math.cos(a) * r)} ${n1(Math.sin(a) * r)}`;
    }
    arms += `<path d="${d}"/>`;
  }
  const glyph = `<g transform="translate(${cx} ${cy}) rotate(${tilt}) scale(0.9 0.52)"><g style="animation: dbtefx-spin 24s linear infinite;" fill="none" stroke="${mix(t.bg, '#000000', 0.3)}" stroke-opacity="0.7" stroke-width="9" stroke-linecap="round">${arms}</g><circle r="10" fill="${mix(t.bg, '#000000', 0.3)}" fill-opacity="0.7"/></g>`;


  return `<style>@keyframes dbtefx-hr-sw { 0%, 46% { opacity: 0; } 48%, 96% { opacity: 1; } 98%, 100% { opacity: 0; } }
@keyframes dbtefx-hr-tv { 0%, 30% { opacity: 0; } 32% { opacity: 0.55; } 40% { opacity: 0.9; } 48% { opacity: 0.4; } 56% { opacity: 0.8; } 64% { opacity: 0.5; } 72% { opacity: 1; } 80% { opacity: 0.45; } 88% { opacity: 0.75; } 90%, 100% { opacity: 0; } }
@keyframes dbtefx-hr-air { 0%, 100% { opacity: 0.15; } 6% { opacity: 1; } 18% { opacity: 0.15; } }
@keyframes dbtefx-hr-wisp { 0% { transform: translateX(-160px); opacity: 0; } 15%, 85% { opacity: 1; } 100% { transform: translateX(220px); opacity: 0; } }</style>
<defs><linearGradient id="dbtefx-hr-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.32"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-hr-sig" gradientUnits="userSpaceOnUse" x1="${sx}" y1="${sy}" x2="${cx}" y2="${cy}"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.6)}" stop-opacity="0.55"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.2"/></linearGradient>
<radialGradient id="dbtefx-hr-pool"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.7)}" stop-opacity="0.95"/><stop offset="0.75" stop-color="${mix(t.accent, '#ffffff', 0.4)}" stop-opacity="0.75"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<pattern id="dbtefx-hr-grid" width="12" height="16" patternUnits="userSpaceOnUse"><rect x="3" y="4" width="5" height="7" fill="${mix(t.bg, t.surface, 0.3)}"/></pattern>
<pattern id="dbtefx-hr-lit" width="84" height="144" patternUnits="userSpaceOnUse"><g fill="${t.warning}" fill-opacity="0.85">${litTile}</g></pattern>
<pattern id="dbtefx-hr-grid-m" href="#dbtefx-hr-grid" patternTransform="scale(1.6)"/><pattern id="dbtefx-hr-lit-m" href="#dbtefx-hr-lit" patternTransform="scale(1.6)"/>
<pattern id="dbtefx-hr-grid-n" href="#dbtefx-hr-grid" patternTransform="scale(2.2)"/><pattern id="dbtefx-hr-lit-n" href="#dbtefx-hr-lit" patternTransform="scale(2.2)"/>
${glow('dbtefx-hr-halo', t.accent, 0.5, 0.5, 0.5, 0.4)}${glow('dbtefx-hr-cloud', mix(t.bg, t.opp, 0.22), 0.5, 0.5, 0.5, 0.9)}${glow('dbtefx-hr-wispg', mix(t.bg, t.opp, 0.3), 0.5, 0.5, 0.5, 0.85)}</defs>
${beam(330, 0)}${beam(1270, 5)}
<!--mid-->
${cloudBank}
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 160s linear infinite;"><path d="${rays}" fill="${t.accent}" fill-opacity="0.05"/></g>
<ellipse cx="${cx}" cy="${cy}" rx="${prx * 2.3}" ry="${pry * 2.6}" fill="url(#dbtefx-hr-halo)" ${anim('bloom', 6, 0, 'ease-in-out')}/>
<ellipse cx="${cx}" cy="${cy}" rx="${prx}" ry="${pry}" transform="rotate(${tilt} ${cx} ${cy})" fill="url(#dbtefx-hr-pool)"/>
${glyph}
<g style="animation: dbtefx-hr-wisp 26s linear infinite;"><ellipse cx="${cx - 40}" cy="${cy + 26}" rx="170" ry="16" fill="url(#dbtefx-hr-wispg)"/></g>
<g style="animation: dbtefx-hr-wisp 34s linear -15s infinite;"><ellipse cx="${cx + 10}" cy="${cy - 22}" rx="130" ry="12" fill="url(#dbtefx-hr-wispg)"/></g>
<!--near-->
${back}${middle}
<path d="${signalBeam}" fill="url(#dbtefx-hr-sig)"/>
${front}${lamp}
${switches}
${figure}`;
};

export default hero;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 90, colors: ['text'] }, { kind: 'meteor', count: 1, colors: ['accent'] }];
