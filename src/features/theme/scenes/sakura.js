import { mix } from '../../../lib/color.js';
import { H, W } from './kit.js';

// Sakura: blossoming branches reaching in from the page edges (never over the
// board), five-petal flowers at varied size, turn and depth, a few petals
// already falling.
const PETAL = 'M0 0C-7-4-8-15-3-19L0-16L3-19C8-15 7-4 0 0Z';

const sakura = (t) => {
  const pink = mix(t.accent, '#ffffff', 0.3);
  const flower = ([x, y, k, rot, o]) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})" fill="${pink}" fill-opacity="${o}">${[0, 72, 144, 216, 288].map((a) => `<path d="${PETAL}" transform="rotate(${a}) translate(0 -2)"/>`).join('')}<circle r="3" fill="${t.warning}" fill-opacity="${Math.min(1, o + 0.15)}"/></g>`;
  const petal = ([x, y, k, rot, o]) => `<path d="${PETAL}" transform="translate(${x} ${y}) rotate(${rot}) scale(${k})" fill="${pink}" fill-opacity="${o}"/>`;
  const bark = mix(t.bg, t.text, 0.25);
  // Right edge: a branch hanging from the top; left edge: a low sprig.
  const right = [[1478, 92, 1.5, 10, 0.7], [1530, 160, 1.1, 40, 0.55], [1450, 210, 0.8, -25, 0.5], [1570, 260, 1.3, 70, 0.62], [1500, 330, 0.9, 15, 0.45], [1585, 70, 0.7, -50, 0.5]];
  const left = [[70, 560, 1.2, 30, 0.6], [140, 630, 0.8, -15, 0.5], [40, 690, 1, 55, 0.55]];
  const falling = [[1440, 420, 0.8, 120, 0.5], [1555, 470, 0.6, 200, 0.4], [1490, 560, 0.7, 60, 0.45], [120, 470, 0.7, 160, 0.45], [60, 780, 0.6, 250, 0.4], [170, 820, 0.8, 30, 0.35]];
  return `<defs><radialGradient id="dbtefx-sk-g" cx="0.95" cy="0.1" r="0.55"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.2"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sk-g)"/>
<!--near-->
<g fill="none" stroke="${bark}" stroke-linecap="round"><path d="M1640 -20Q1540 60 1520 180T1560 340" stroke-width="12"/><path d="M1530 120Q1480 140 1460 200" stroke-width="6"/><path d="M1540 250Q1590 240 1600 280" stroke-width="5"/><path d="M-30 740Q60 640 150 620" stroke-width="9"/><path d="M60 660Q50 600 80 560" stroke-width="5"/></g>
${right.map(flower).join('')}${left.map(flower).join('')}${falling.map(petal).join('')}`;
};

export default sakura;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'petal', count: 70, colors: ['accent', 'text'] }];
