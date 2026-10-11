import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, rng, W } from './kit.js';

// Mitsurugi: moonlit shrine, sacred mirror and sword, shimenawa
const mitsurugi = (t) => {
  const ridge = (y, amp, seed) => {
    const rand = rng(seed);
    let d = `M0 ${H}V${y}`;
    for (let x = 0; x <= W; x += 80) d += `L${x} ${n1(y - rand() * amp)}`;
    return `${d}V${H}Z`;
  };
  let shide = '';
  for (let x = 140; x < W; x += 220) {
    shide += `<g style="transform-origin: ${x}px 70px; animation: dbtefx-reed ${n1(4 + (x % 3))}s ease-in-out ${-x / 300}s infinite;"><path d="M${x} 70l14 18h-10l14 18h-10l14 18" fill="none" stroke="${t.text}" stroke-opacity="0.75" stroke-width="5" stroke-linejoin="miter"/></g>`;
  }
  return `<defs>${glow('dbtefx-mt-moon', t.accent2, 0.5, 0.5, 0.5, 0.5)}<radialGradient id="dbtefx-mt-mirror"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.5" stop-color="${t.accent2}" stop-opacity="0.25"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0.05"/></radialGradient></defs>
<circle cx="1210" cy="220" r="260" fill="url(#dbtefx-mt-moon)"/>
<circle cx="1210" cy="220" r="110" fill="${t.accent2}" fill-opacity="0.35"/>
<path d="${ridge(600, 120, 3)}" fill="${mix(t.bg, t.accent, 0.12)}"/>
<path d="${ridge(700, 90, 9)}" fill="${mix(t.bg, t.accent, 0.06)}"/>
<!--mid-->
<g fill="${t.accent}" fill-opacity="0.55"><path d="M220 360Q380 330 540 360L548 384Q380 356 212 384Z"/><rect x="248" y="400" width="276" height="16"/><rect x="278" y="380" width="22" height="380"/><rect x="472" y="380" width="22" height="380"/></g>
<path d="M980 760L1430 300" stroke="${t.text}" stroke-opacity="0.5" stroke-width="8" stroke-linecap="round"/><path d="M1430 300l22 -30" stroke="${t.accent2}" stroke-opacity="0.7" stroke-width="10" stroke-linecap="round"/>
<circle cx="1210" cy="520" r="130" fill="url(#dbtefx-mt-mirror)" stroke="${t.accent2}" stroke-opacity="0.7" stroke-width="10" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<circle cx="1210" cy="520" r="150" fill="none" stroke="${t.accent2}" stroke-opacity="0.3" stroke-width="3" stroke-dasharray="6 14"/>
<!--near-->
<path d="M-20 52Q800 120 1620 52" fill="none" stroke="${mix(t.accent2, t.text, 0.4)}" stroke-opacity="0.75" stroke-width="16" stroke-linecap="round" stroke-dasharray="26 6"/>
${shide}`;
};

export default mitsurugi;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'leaf', count: 26, colors: ['accent', 'accent2'] }, { kind: 'mote', count: 30, colors: ['accent2'] }];
