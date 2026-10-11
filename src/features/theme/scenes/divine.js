import { mix } from '../../../lib/color.js';
import { anim, H, polar, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Divine Beasts: the three Egyptian Gods as their real card artwork, each in
// a gold cartouche stepping down the right edge of a glyph-carved temple wall:
// Obelisk the Tormentor at the top, the Winged Dragon of Ra before its turning
// sun, Slifer the Sky Dragon at the foot. The art loads live from DuelingBook
// (cardart.js); without it the cartouches, sun and glows still stand.

const scene = (t) => {
  const rand = rng(2207);
  const gold = t.accent;
  const red = mix(t.danger, '#000000', 0.12);
  const blue = t.opp;

  // Ambient: carved cartouche bands across the temple wall.
  const marks = ['M-8 -8A8 8 0 1 1 8 -8L0 0ZM0 0V10M-8 3H8', 'M-10 0Q0 -9 10 0Q0 8 -10 0Z', 'M-10 -3Q-5 -9 0 -3T10 -3M-10 6Q-5 0 0 6T10 6', 'M0 -10V10M-7 -3L0 -10L7 -3', 'M-8 10V-4Q0 -12 8 -4V10'];
  let cartouches = '';
  for (let r = 0; r < 4; r++) {
    const y = 230 + r * 200;
    for (let c = 0; c < 9; c++) {
      const x = 80 + c * 180 + (r % 2) * 90;
      cartouches += `<rect x="${x - 64}" y="${y - 24}" width="128" height="48" rx="24"/><path d="M${x + 68} ${y - 20}V${y + 20}"/>`;
      for (let k = 0; k < 3; k++) cartouches += `<path transform="translate(${x - 32 + k * 32} ${y})" d="${marks[Math.floor(rand() * marks.length)]}"/>`;
    }
  }

  // Ra's sun: turning rays behind the middle cartouche.
  const raX = 1300;
  const raY = 470;
  let rays = '';
  for (let i = 0; i < 36; i++) {
    const [x1, y1] = polar(0, 0, 150, i * 10 - 1.6);
    const [x2, y2] = polar(0, 0, 150, i * 10 + 1.6);
    const [x3, y3] = polar(0, 0, i % 2 ? 250 : 330, i * 10);
    rays += `M${x1} ${y1}L${x3} ${y3}L${x2} ${y2}Z`;
  }
  const god = (key, x, y, w, h, focus, zoom, delay, look) =>
    cardArt(t, { id: `dbtefx-dv-${key}`, card: CARDS[key], x, y, w, h, feather: 0.7, fade: 0.55, focus, zoom, breathe: 16, delay, ...look });

  return `<style>${CARD_ART_KEYFRAMES}</style><defs>
<linearGradient id="dbtefx-dv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, gold, 0.12)}" stop-opacity="0.95"/><stop offset="0.55" stop-color="${t.bg}" stop-opacity="0.92"/><stop offset="1" stop-color="${mix(t.bg, red, 0.08)}" stop-opacity="0.95"/></linearGradient>
<radialGradient id="dbtefx-dv-haze" gradientUnits="userSpaceOnUse" cx="${raX}" cy="${raY - 150}" r="700"><stop offset="0" stop-color="${gold}" stop-opacity="0.3"/><stop offset="0.4" stop-color="${gold}" stop-opacity="0.08"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dv-sun"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.35" stop-color="${mix(gold, '#ffffff', 0.4)}" stop-opacity="0.7"/><stop offset="0.75" stop-color="${gold}" stop-opacity="0.2"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-dv-sky)"/>
<g fill="none" stroke="${gold}" stroke-opacity="0.05" stroke-width="2.5" stroke-linecap="round">${cartouches}</g>
<rect width="${W}" height="${H}" fill="url(#dbtefx-dv-haze)"/>
<!--mid-->
<g transform="translate(${raX} ${raY})"><path d="${rays}" fill="${gold}" fill-opacity="0.14" style="animation: dbtefx-spin 80s linear infinite;"/></g>
<circle cx="${raX}" cy="${raY}" r="190" fill="url(#dbtefx-dv-sun)" opacity="0.22" ${anim('bloom', 8, 2, 'ease-in-out')}/>
${god('obelisk', 1166, -40, 300, 390, [0.5, 0.4], 1.0, 0, { blend: 'multiply', backdrop: mix(blue, t.bg, 0.62), glow: blue })}
${god('slifer', 1160, 540, 310, 380, [0.45, 0.5], 1.0, 10, { blend: 'screen', backdrop: mix(red, t.bg, 0.8), glow: red })}
${god('ra', 1140, 262, 320, 370, [0.55, 0.45], 1.0, 5, { blend: 'screen', backdrop: mix(gold, t.bg, 0.72), fade: 0.35 })}`;
};

export default scene;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ember', count: 50, colors: ['accent', 'warning'], speed: 0.5 },
  { kind: 'mote', count: 24, colors: ['opp', 'accent'] },
];
