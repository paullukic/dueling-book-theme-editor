import { anim, glow, n1 } from './kit.js';

// Trap Card: two chains cross the screen, a trap hole pulses below.
const trap = (t) => {
  const chain = (x1, y1, x2, y2, delay) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    let links = '';
    for (let d = 0; d < len; d += 46) {
      const x = x1 + ((x2 - x1) * d) / len;
      const y = y1 + ((y2 - y1) * d) / len;
      links += `<rect x="${n1(x - 26)}" y="${n1(y - 11)}" width="52" height="22" rx="11" transform="rotate(${n1(ang)} ${n1(x)} ${n1(y)})"${(d / 46) % 2 ? ` stroke-width="5"` : ''}/>`;
    }
    return `<g fill="none" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="7" ${anim('pulse', 5, delay, 'ease-in-out')}>${links}</g>`;
  };
  return `<defs>${glow('dbtefx-tr-hole', t.accent, 0.5, 0.5, 0.5, 0.5)}</defs>
<ellipse cx="800" cy="840" rx="520" ry="120" fill="url(#dbtefx-tr-hole)" ${anim('pulse', 4, 0, 'ease-in-out')}/>
<ellipse cx="800" cy="840" rx="300" ry="60" fill="${t.bg}" fill-opacity="0.6"/>
${chain(-40, 60, 1640, 820, 0)}${chain(1640, 60, -40, 820, 2.5)}`;
};

// Fusion: two colours spiralling into one, turning in opposite directions.

export default trap;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'ember', count: 40, colors: ['accent', 'accent2'], speed: 0.6 }];
