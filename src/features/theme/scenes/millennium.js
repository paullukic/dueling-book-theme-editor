import { anim, glow, H, W } from './kit.js';

// Millennium: the Eye of Wdjat over a pyramid, drifting sand.
const millennium = (t) => {
  return `<defs>${glow('dbtefx-mi-g', t.accent, 0.5, 0.4, 0.45, 0.3)}</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-mi-g)" ${anim('pulse', 6, 0, 'ease-in-out')}/>
<path d="M800 140L1220 860H380Z" fill="${t.accent}" fill-opacity="0.05" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="3"/>
<g fill="none" stroke="${t.accent}" stroke-opacity="0.6" stroke-width="5" stroke-linecap="round">
<path d="M690 470Q800 390 910 470Q800 530 690 470Z"/><circle cx="800" cy="468" r="26" fill="${t.accent}" fill-opacity="0.5"/>
<path d="M690 470L640 470M780 500Q770 560 730 590Q760 600 770 570M820 500Q840 540 880 560"/></g>`;
};

// Pendulum: two scale pillars and a swinging pendulum between them.

export default millennium;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 90, colors: ['accent', 'warning'] }];
