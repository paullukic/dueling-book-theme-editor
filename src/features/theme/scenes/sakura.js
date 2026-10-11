import { mix } from '../../../lib/color.js';
import { H, n1, polar, W } from './kit.js';

// Sakura: a blossoming branch in the corner, petals drifting down.
const sakura = (t) => {
  const blossom = (x, y, r) => {
    let p = '';
    for (let i = 0; i < 5; i++) {
      const [px, py] = polar(x, y, r * 0.55, i * 72 - 90);
      p += `<circle cx="${px}" cy="${py}" r="${n1(r * 0.5)}"/>`;
    }
    return `<g fill="${mix(t.accent, '#ffffff', 0.3)}" fill-opacity="0.55">${p}</g><circle cx="${x}" cy="${y}" r="${n1(r * 0.22)}" fill="${t.warning}" fill-opacity="0.7"/>`;
  };
  const flowers = [[300, 120, 22], [420, 70, 18], [520, 160, 24], [230, 230, 20], [640, 110, 16], [380, 200, 14], [700, 190, 20], [150, 60, 18]];
  return `<defs><radialGradient id="dbtefx-sk-g" cx="0.15" cy="0.1" r="0.6"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sk-g)"/>
<!--near-->
<g fill="none" stroke="${mix(t.bg, t.text, 0.25)}" stroke-linecap="round"><path d="M-30 40Q200 90 380 130T760 180" stroke-width="14"/><path d="M260 106Q300 170 250 240" stroke-width="8"/><path d="M470 140Q520 90 640 100" stroke-width="7"/></g>
${flowers.map(([x, y, r]) => blossom(x, y, r)).join('')}`;
};

export default sakura;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'petal', count: 70, colors: ['accent', 'text'] }];
