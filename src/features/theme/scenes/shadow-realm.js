import { anim, n1, rng } from './kit.js';

// Shadow Realm: fog banks drifting, wisps rising, eyes in the mist.
const shadowRealm = (t) => {
  const rand = rng(107);
  const bank = (y, c, dur, delay) => `<ellipse cx="800" cy="${y}" rx="1000" ry="120" fill="${c}" fill-opacity="0.14" ${anim('drift', dur, delay, 'ease-in-out')}/>`;
  return `${bank(220, t.accent2, 16, 0)}${bank(520, t.accent, 20, 5)}${bank(800, t.accent2, 18, 9)}
${Array.from({ length: 3 }, (_, i) => {
    const x = 300 + i * 500 + rand() * 120;
    const y = 300 + rand() * 300;
    return `<g ${anim('pulse', n1(5 + rand() * 4), rand() * 5, 'ease-in-out')}><ellipse cx="${n1(x)}" cy="${n1(y)}" rx="14" ry="5" fill="${t.accent}" fill-opacity="0.7"/><ellipse cx="${n1(x + 40)}" cy="${n1(y)}" rx="14" ry="5" fill="${t.accent}" fill-opacity="0.7"/></g>`;
  }).join('')}`;
};

// Sakura: a blossoming branch in the corner, petals drifting down.

export default shadowRealm;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'firefly', count: 40, colors: ['accent', 'accent2'] }, { kind: 'ash', count: 30, colors: ['accent2'] }];
