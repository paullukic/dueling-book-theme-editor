import { H, polar } from './kit.js';

// Duel Disk (light): the disk's rotating blade ring and a metallic sheen.
const duelDisk = (t) => {
  let blades = '';
  for (let i = 0; i < 5; i++) {
    blades += `<path d="M800 450L${polar(800, 450, 360, i * 72 - 10).join(' ')}A360 360 0 0 1 ${polar(800, 450, 360, i * 72 + 22).join(' ')}Z" fill="${t.text}" fill-opacity="0.05" stroke="${t.accent}" stroke-opacity="0.3" stroke-width="2"/>`;
  }
  return `<defs><linearGradient id="dbtefx-dd-sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0.4" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>
<g style="transform-origin: 800px 450px; animation: dbtefx-spin 70s linear infinite;">${blades}</g>
<circle cx="800" cy="450" r="120" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="10"/><circle cx="800" cy="450" r="40" fill="${t.accent2}" fill-opacity="0.35"/>
<rect x="-400" y="0" width="1200" height="${H}" fill="url(#dbtefx-dd-sheen)" style="animation: dbtefx-scanx 9s ease-in-out infinite;"/>`;
};

// Ritual: a summoning circle ringed by candles.

export default duelDisk;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 40, colors: ['accent', 'accent2'], light: true }];
