import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, W } from './kit.js';

// Labrynth: rose window, candlelit colonnade
const labrynth = (t) => {
  let glass = '';
  for (let i = 0; i < 12; i++) {
    const [x, y] = polar(800, 250, 150, i * 30);
    glass += `<circle cx="${x}" cy="${y}" r="52" fill="${[t.accent, t.opp, t.accent2][i % 3]}" fill-opacity="0.16" stroke="${t.accent2}" stroke-opacity="0.35" stroke-width="2"/>`;
    const [x1, y1] = polar(800, 250, 46, i * 30 + 15);
    const [x2, y2] = polar(800, 250, 214, i * 30 + 15);
    glass += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${t.accent2}" stroke-opacity="0.25" stroke-width="2"/>`;
  }
  let arches = '';
  let candles = '';
  for (let x = -40; x < W; x += 180) {
    arches += `<path d="M${x + 14} ${H}V${H - 230}Q${x + 14} ${H - 340} ${x + 90} ${H - 370}Q${x + 166} ${H - 340} ${x + 166} ${H - 230}V${H}Z"/>`;
    candles += `<rect x="${x + 84}" y="${H - 70}" width="12" height="40" rx="2" fill="${t.text}" fill-opacity="0.25"/><ellipse cx="${x + 90}" cy="${H - 82}" rx="6" ry="12" fill="${t.warning}" fill-opacity="0.85" ${anim('flicker', n1(1.6 + ((x / 180) % 3) * 0.4), (x / 180) * 0.37, 'ease-in-out')}/>`;
  }
  return `<defs><radialGradient id="dbtefx-lb-light" cx="0.5" cy="0.28" r="0.45"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.22"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-lb-light)"/>
<!--mid-->
<g ${anim('pulse', 6, 0, 'ease-in-out')}><circle cx="800" cy="250" r="236" fill="${t.bg}" fill-opacity="0.35" stroke="${t.accent2}" stroke-opacity="0.45" stroke-width="5"/>${glass}<circle cx="800" cy="250" r="44" fill="${t.accent}" fill-opacity="0.3" stroke="${t.accent2}" stroke-opacity="0.5" stroke-width="3"/></g>
<!--near-->
<g fill="${mix(t.bg, t.surface, 0.5)}" stroke="${t.accent2}" stroke-opacity="0.2" stroke-width="2">${arches}</g>
${candles}`;
};

export default labrynth;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 60, colors: ['accent2', 'warning'] }];
