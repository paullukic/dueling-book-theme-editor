import { H, polar, W } from './kit.js';

// Lightsworn: dawn sunburst, halo rings, rising motes
const lightsworn = (t) => {
  let rays = '';
  for (let i = 0; i < 36; i++) {
    const [x1, y1] = polar(800, -60, 1400, i * 10 - 2);
    const [x2, y2] = polar(800, -60, 1400, i * 10 + 2);
    rays += `<path d="M800 -60L${x1} ${y1}L${x2} ${y2}Z"/>`;
  }
  return `<defs><radialGradient id="dbtefx-ls-sun" cx="0.5" cy="0" r="0.75"><stop offset="0" stop-color="#ffffff" stop-opacity="0.8"/><stop offset="0.3" stop-color="${t.accent}" stop-opacity="0.18"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient></defs>
<g fill="${t.accent}" fill-opacity="0.07" style="transform-origin: 800px -60px; animation: dbtefx-spin 160s linear infinite;">${rays}</g>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ls-sun)"/>
<g fill="none" stroke="${t.accent}"><circle cx="800" cy="-60" r="260" stroke-opacity="0.22" stroke-width="3"/><circle cx="800" cy="-60" r="330" stroke-opacity="0.14" stroke-dasharray="4 12" stroke-width="2"/><circle cx="800" cy="-60" r="420" stroke-opacity="0.1"/></g>
<!--mid-->
<g fill="${t.accent}" fill-opacity="0.12"><path d="M800 300L828 380L800 620L772 380Z"/><path d="M700 400L800 380L900 400L800 420Z"/></g>`;
};

export default lightsworn;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 90, colors: ['warning', 'accent'], light: true, rise: true }];
