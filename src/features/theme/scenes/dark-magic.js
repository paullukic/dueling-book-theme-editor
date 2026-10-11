import { glow, H, runeRing, star, W } from './kit.js';

// Dark Magic: a pentagram circle turning, violet sparkles, a wand's streak.
const darkMagic = (t) => {
  return `<defs>${glow('dbtefx-dm-g', t.accent, 0.5, 0.5, 0.5, 0.25)}</defs><rect width="${W}" height="${H}" fill="url(#dbtefx-dm-g)"/>
${runeRing(t, 800, 450, 320, t.accent, 120)}
<g style="transform-origin: 800px 450px; animation: dbtefx-spin 60s linear infinite reverse;"><path d="${star(800, 450, 270)}" fill="none" stroke="${t.accent2}" stroke-opacity="0.35" stroke-width="3"/></g>
<path d="M200 760Q700 520 1400 140" fill="none" stroke="${t.accent2}" stroke-opacity="0.3" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>`;
};

// Black Dragon: two red eyes in the dark, molten cracks, embers.

export default darkMagic;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'spark', count: 70, colors: ['accent2', 'accent'] }];
