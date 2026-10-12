import { anim, glow, H, W } from './kit.js';

// Midnight: a gold crescent and a faint nebula.
const midnight = (t) => `<defs>${glow('dbtefx-mn-neb', t.accent2, 0.3, 0.3, 0.5, 0.16)}${glow('dbtefx-mn-moon', t.accent, 0.5, 0.5, 0.5, 0.3)}</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-mn-neb)"/>
<!--mid-->
<g class="dbtefx-mn-moon"><circle cx="1456" cy="560" r="110" fill="url(#dbtefx-mn-moon)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
<path d="M1456 506A54 54 0 1 0 1484 609A46 46 0 1 1 1456 506Z" fill="${t.accent}" fill-opacity="0.6"/></g>`;

// Snow: layered hills and pines under falling snow.

export default midnight;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 60, colors: ['text', 'accent2'] }, { kind: 'meteor', count: 1, colors: ['accent'] }];
