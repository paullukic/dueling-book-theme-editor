import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Dracotail: the eclipse of the dragon's nodes. A Dracotail, the real card
// artwork, rises out of the plum night under the eclipsed sun; the corona
// swells, gold sparkles drift. The art loads live from DuelingBook
// (cardart.js); without it the eclipse, nebulae and stars remain.
const dracotail = (t) => {
  const rand = rng(57);
  const [cx, cy] = [1468, 481];
  const gold = t.accent;
  const goldHi = mix(gold, '#ffffff', 0.45);
  const jade = t.accent2;
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

  return `<style>
${CARD_ART_KEYFRAMES}
@keyframes dbtefx-dt-corona { 0%, 100% { transform: scale(0.95) rotate(0deg); opacity: 0.75; } 50% { transform: scale(1.06) rotate(4deg); opacity: 1; } }
</style>
<defs>
<radialGradient id="dbtefx-dt-neb1" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(t.border, gold, 0.25)}" stop-opacity="0.55"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-neb2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${jade}" stop-opacity="0.16"/><stop offset="1" stop-color="${jade}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-neb3" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${silk}" stop-opacity="0.13"/><stop offset="1" stop-color="${silk}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0.3" stop-color="${goldHi}" stop-opacity="0.9"/><stop offset="0.5" stop-color="${gold}" stop-opacity="0.45"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dt-moon" cx="0.42" cy="0.4" r="0.6"><stop offset="0" stop-color="${mix(t.surface, t.bg, 0.4)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.5)}"/></radialGradient>
</defs>
<ellipse cx="1340" cy="430" rx="460" ry="420" fill="url(#dbtefx-dt-neb1)"/>
<ellipse cx="260" cy="760" rx="520" ry="300" fill="url(#dbtefx-dt-neb2)"/>
<ellipse cx="760" cy="90" rx="520" ry="200" fill="url(#dbtefx-dt-neb3)"/>
<g stroke="${t.text}" stroke-linecap="round">${stars.map((d, i) => `<path d="${d}" stroke-width="${1.4 + i}" stroke-opacity="${0.75 - i * 0.2}"/>`).join('')}</g>
<!--mid-->
${cardArt(t, { id: 'dbtefx-dt-hero', card: CARDS.faimena, x: 1060, y: 150, w: 460, h: 720, focus: [0.6, 0.42], zoom: 0.9, blend: 'normal', feather: 0.75, fade: 0.75, backdrop: mix(t.bg, t.border, 0.4), backdropAmt: 0.6, breathe: 14 })}
<g transform="translate(1446 440) scale(0.74) translate(-1480 -440)">
<circle cx="${cx}" cy="${cy}" r="140" fill="url(#dbtefx-dt-sun)" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-dt-corona 7s ease-in-out infinite;"/>
<path d="${rays}" fill="${goldHi}" fill-opacity="0.5" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-dt-corona 7s ease-in-out -1.5s infinite;"/>
<circle cx="${cx}" cy="${cy}" r="46" fill="url(#dbtefx-dt-moon)"/>
<circle cx="${cx}" cy="${cy}" r="46" fill="none" stroke="${goldHi}" stroke-width="2" stroke-opacity="0.9"/>
<path d="${sparkle(fx, fy, 24)}" fill="#ffffff" style="animation: dbtefx-pulse 3.5s ease-in-out infinite;"/>
<circle cx="${fx}" cy="${fy}" r="7" fill="#ffffff"/>
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
