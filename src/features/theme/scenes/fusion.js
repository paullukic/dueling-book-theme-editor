import { anim, glow, polar } from './kit.js';

// Fusion: two colours spiralling into one, turning in opposite directions.
const fusion = (t) => {
  const spiral = (rot) => {
    let d = 'M800 450';
    for (let i = 1; i < 140; i++) {
      const [x, y] = polar(800, 450, i * 3.1, i * 9 + rot);
      d += `L${x} ${y}`;
    }
    return d;
  };
  return `<defs>${glow('dbtefx-fu-core', t.accent2, 0.5, 0.5, 0.3, 0.5)}</defs>
<g style="transform-origin: 800px 450px; animation: dbtefx-spin 40s linear infinite;"><path d="${spiral(0)}" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="6" stroke-linecap="round"/></g>
<g style="transform-origin: 800px 450px; animation: dbtefx-spin 40s linear infinite reverse;"><path d="${spiral(180)}" fill="none" stroke="${t.accent2}" stroke-opacity="0.3" stroke-width="6" stroke-linecap="round"/></g>
<circle cx="800" cy="450" r="260" fill="url(#dbtefx-fu-core)" ${anim('pulse', 5, 0, 'ease-in-out')}/>`;
};

// Synchro: tuner rings stacked in a column of light, stars passing through.

export default fusion;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 70, colors: ['accent', 'accent2'], swirl: true }];
