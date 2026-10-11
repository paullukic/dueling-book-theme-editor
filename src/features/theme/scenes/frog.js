import { mix } from '../../../lib/color.js';
import { anim, H, n1, rng, W } from './kit.js';

// Frog: moonlit pond, lily pads, ripples, fireflies, reeds
const frog = (t) => {
  const rand = rng(53);
  const pad = (x, y, r, delay) =>
    `<g ${anim('bob', n1(5 + rand() * 3), delay, 'ease-in-out')}><path d="M${x} ${y}L${n1(x + r * 0.95)} ${n1(y - r * 0.32)}A${r} ${n1(r * 0.42)} 0 1 1 ${n1(x + r * 0.95)} ${n1(y + r * 0.1)}Z" fill="${t.accent}" fill-opacity="0.2" stroke="${t.accent}" stroke-opacity="0.4" stroke-width="2"/></g>`;
  const lotus = (x, y) =>
    `<g fill="${t.accent2}" fill-opacity="0.45">${[-40, -20, 0, 20, 40].map((a) => `<ellipse cx="${x}" cy="${y - 18}" rx="9" ry="22" transform="rotate(${a} ${x} ${y})"/>`).join('')}</g>`;
  const reed = (x, h, lean, delay) =>
    `<g style="transform-origin: ${x}px ${H}px; animation: dbtefx-reed ${n1(6 + rand() * 3)}s ease-in-out ${-delay}s infinite;"><path d="M${x} ${H}Q${x + lean} ${H - h / 2} ${x + lean * 1.6} ${H - h}" fill="none" stroke="${mix(t.bg, t.accent, 0.35)}" stroke-width="5" stroke-linecap="round"/><ellipse cx="${x + lean * 1.6}" cy="${H - h + 26}" rx="7" ry="26" fill="${mix(t.bg, t.warning, 0.3)}"/></g>`;
  const ripple = (x, y, delay) => `<ellipse cx="${x}" cy="${y}" rx="120" ry="30" fill="none" stroke="${t.text}" stroke-opacity="0.35" stroke-width="2" ${anim('ripple', 6, delay, 'ease-out')}/>`;
  return `<defs><linearGradient id="dbtefx-fr-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="${t.accent}" stop-opacity="0"/><stop offset="1" stop-color="${t.opp}" stop-opacity="0.16"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-fr-water)"/>
${ripple(420, 690, 0)}${ripple(1180, 760, 2)}${ripple(820, 820, 4)}
<!--mid-->
${pad(300, 620, 90, 0)}${pad(560, 780, 120, 1)}${pad(1060, 660, 100, 2)}${pad(1320, 820, 130, 3)}${pad(880, 560, 70, 1.5)}
${lotus(560, 760)}${lotus(1320, 800)}
<!--near-->
${reed(40, 420, 18, 0)}${reed(90, 340, -10, 1)}${reed(1520, 460, -20, 2)}${reed(1570, 360, 12, 0.5)}`;
};

export default frog;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'firefly', count: 50, colors: ['warning', 'accent'] }];
