import { glow, H, runeRing, star, W } from './kit.js';

// Spell Card: a turning spell circle, sparkles rising like cast magic.
const spell = (t) => {
  return `<defs>${glow('dbtefx-sp-g', t.accent)}</defs><rect width="${W}" height="${H}" fill="url(#dbtefx-sp-g)"/>
${runeRing(t, 800, 450, 340, t.accent, 90)}${runeRing(t, 800, 450, 220, t.accent2, 60, true)}
<path d="${star(800, 450, 190, 6)}" fill="none" stroke="${t.accent}" stroke-opacity="0.25" stroke-width="2"/>`;
};

// Trap Card: two chains cross the screen, a trap hole pulses below.

export default spell;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'spark', count: 60, colors: ['accent', 'accent2'] }];
