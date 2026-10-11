import { anim, glow, H, runeRing } from './kit.js';

// Divine Beasts: Ra's sun disk, Obelisk's pillar of light, Slifer's coil.
const divine = (t) => {
  return `<defs>${glow('dbtefx-dv-sun', t.accent, 0.5, 0.5, 0.5, 0.6)}<linearGradient id="dbtefx-dv-ob" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.opp}" stop-opacity="0"/><stop offset="0.5" stop-color="${t.opp}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.opp}" stop-opacity="0"/></linearGradient></defs>
<rect x="160" y="0" width="200" height="${H}" fill="url(#dbtefx-dv-ob)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<path d="M1700 120C1400 160 1500 360 1300 420S1100 700 1340 820" fill="none" stroke="${t.self}" stroke-opacity="0.3" stroke-width="40" stroke-linecap="round"/>
<circle cx="800" cy="260" r="220" fill="url(#dbtefx-dv-sun)" ${anim('bloom', 6, 0, 'ease-in-out')}/>
${runeRing(t, 800, 260, 170, t.accent, 80)}`;
};

// Duel Disk (light): the disk's rotating blade ring and a metallic sheen.

export default divine;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'ember', count: 80, colors: ['accent', 'warning', 'opp'] }];
