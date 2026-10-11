import { mix } from '../../../lib/color.js';
import { anim, n1, polar, rng, W } from './kit.js';

// Blackwing: moonlit night, spread wings, falling feathers
const blackwing = (t) => {
  const rand = rng(31);
  const wing = (ox, oy, dir) => {
    let s = '';
    for (let i = 0; i < 11; i++) {
      const ang = dir > 0 ? -95 + i * 7.5 : -85 - i * 7.5;
      const len = 330 + i * 34;
      const [tx, ty] = polar(ox, oy, len, ang);
      const [lx, ly] = polar(ox, oy, len * 0.5, ang - 5 * dir);
      const [rx, ry] = polar(ox, oy, len * 0.5, ang + 5 * dir);
      s += `<path d="M${ox} ${oy}Q${lx} ${ly} ${tx} ${ty}Q${rx} ${ry} ${ox} ${oy}Z"/>`;
    }
    return s;
  };
  const feather = (x, s) =>
    `<g transform="translate(${n1(x)} 0)"><g ${anim('fall', n1(12 + rand() * 10), rand() * 20, 'ease-in-out')}><path d="M0 ${-30 * s}Q${9 * s} 0 0 ${30 * s}Q${-9 * s} 0 0 ${-30 * s}Z" fill="${mix(t.bg, t.accent, 0.3)}" fill-opacity="0.85" stroke="${t.accent}" stroke-opacity="0.85" stroke-width="1.4"/><path d="M0 ${-30 * s}V${36 * s}" stroke="${t.text}" stroke-opacity="0.5"/></g></g>`;
  return `<defs>
<linearGradient id="dbtefx-bw-wing" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(t.bg, t.accent, 0.2)}" stop-opacity="0.5"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.42"/></linearGradient>
</defs>
<g fill="${t.text}" fill-opacity="0.05"><ellipse cx="400" cy="230" rx="420" ry="30"/><ellipse cx="1150" cy="330" rx="380" ry="24"/></g>
<!--mid-->
<g fill="url(#dbtefx-bw-wing)" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="1.5">${wing(120, 900, 1)}${wing(1480, 900, -1)}</g>
<ellipse cx="800" cy="460" rx="8" ry="4" fill="${t.accent2}" fill-opacity="0.7" ${anim('pulse', 3, 0, 'ease-in-out')}/>
<ellipse cx="840" cy="460" rx="8" ry="4" fill="${t.accent2}" fill-opacity="0.7" ${anim('pulse', 3, 0, 'ease-in-out')}/>
<!--near-->
${Array.from({ length: 20 }, () => feather(rand() * W, 1.1 + rand() * 1.2)).join('')}`;
};

export default blackwing;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'feather', count: 26, colors: ['accent'] }, { kind: 'star', count: 80, colors: ['text'] }, { kind: 'meteor', count: 1, colors: ['accent'] }];
