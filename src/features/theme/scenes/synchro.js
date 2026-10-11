import { anim, H } from './kit.js';

// Synchro: tuner rings stacked in a column of light, stars passing through.
const synchro = (t) => {
  let rings = '';
  for (let i = 0; i < 5; i++) {
    rings += `<ellipse cx="800" cy="${170 + i * 140}" rx="230" ry="40" fill="none" stroke="${t.accent2}" stroke-opacity="0.45" stroke-width="4" ${anim('bloom', 3, i * 0.4, 'ease-in-out')}/>`;
  }
  return `<defs><linearGradient id="dbtefx-sy-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.3"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient></defs>
<rect x="640" y="0" width="320" height="${H}" fill="url(#dbtefx-sy-beam)" ${anim('pulse', 4, 0, 'ease-in-out')}/>${rings}`;
};

// Xyz: overlay units orbiting a black hole, rank stars twinkling.

export default synchro;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'spark', count: 50, colors: ['text', 'accent2'], column: true }];
