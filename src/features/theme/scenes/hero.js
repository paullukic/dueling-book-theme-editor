import { anim, H, n1, rng, W } from './kit.js';

// Elemental HERO: searchlights over the Skyscraper city
const hero = (t) => {
  const beam = (x, delay) =>
    `<g style="transform-origin: ${x}px ${H}px; animation: dbtefx-sway 11s ease-in-out ${-delay}s infinite;"><path d="M${x - 10} ${H}L${x - 140} -40L${x + 140} -40L${x + 10} ${H}Z" fill="url(#dbtefx-hr-beam)"/></g>`;
  const rand = rng(5);
  return `<defs><linearGradient id="dbtefx-hr-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.32"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient></defs>
${beam(330, 0)}${beam(1270, 5)}
<!--mid-->
<path d="M760 120L840 120L860 150L800 220L740 150Z" fill="${t.accent}" fill-opacity="0.12" stroke="${t.accent}" stroke-opacity="0.3" stroke-width="3"/>
<text x="800" y="176" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="46" font-weight="900" fill="${t.accent}" fill-opacity="0.3">H</text>
${Array.from({ length: 14 }, () => `<rect x="${n1(rand() * W)}" y="${n1(H - 60 - rand() * 300)}" width="5" height="7" fill="${t.warning}" ${anim('pulse', n1(2 + rand() * 4), rand() * 4, 'steps(2)')}/>`).join('')}`;
};

export default hero;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 90, colors: ['text'] }, { kind: 'meteor', count: 1, colors: ['accent'] }];
