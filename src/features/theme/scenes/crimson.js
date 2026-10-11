import { anim } from './kit.js';

// Crimson: two blade slashes glowing in red, one down each page edge (never across the board or the feed).
const crimson = (t) => `<defs><linearGradient id="dbtefx-cr-slash" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.45"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient></defs>
<!--mid-->
<path d="M1410 -40L1650 560L1636 572L1396 -30Z" fill="url(#dbtefx-cr-slash)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<path d="M-60 600L190 -40L204 -30L-46 612Z" fill="url(#dbtefx-cr-slash)" ${anim('pulse', 5, 2.5, 'ease-in-out')}/>`;

export default crimson;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'ember', count: 50, colors: ['accent', 'danger'], speed: 0.7 }];
