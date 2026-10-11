import { anim, glow, H, n1, polar, runeRing, star, W } from './kit.js';

// Ritual: a summoning circle ringed by candles.
const ritual = (t) => {
  let candles = '';
  for (let i = 0; i < 8; i++) {
    const [x, y] = polar(800, 470, 330, i * 45);
    candles += `<rect x="${n1(x - 7)}" y="${n1(y - 10)}" width="14" height="36" rx="2" fill="${t.text}" fill-opacity="0.3"/><ellipse cx="${x}" cy="${n1(y - 22)}" rx="7" ry="14" fill="${t.accent2}" ${anim('flicker', n1(1.5 + (i % 3) * 0.4), i * 0.3, 'ease-in-out')}/>`;
  }
  return `<defs>${glow('dbtefx-ri-g', t.accent2, 0.5, 0.52, 0.45, 0.22)}</defs><rect width="${W}" height="${H}" fill="url(#dbtefx-ri-g)"/>
${runeRing(t, 800, 470, 290, t.accent, 100)}
<path d="${star(800, 470, 250)}" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="3" ${anim('pulse', 5, 0, 'ease-in-out')}/>
${candles}`;
};

// Shadow Realm: fog banks drifting, wisps rising, eyes in the mist.

export default ritual;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'ember', count: 50, colors: ['accent2', 'accent'], speed: 0.5 }];
