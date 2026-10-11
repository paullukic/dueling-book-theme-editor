import { glow } from './kit.js';

// Xyz: overlay units orbiting a black hole, rank stars twinkling.
const xyz = (t) => {
  const unit = (r, dur, delay, size) =>
    `<g style="transform-origin: 800px 450px; animation: dbtefx-spin ${dur}s linear ${-delay}s infinite;"><circle cx="${800 + r}" cy="450" r="${size}" fill="${t.accent}" fill-opacity="0.8"/><circle cx="${800 + r}" cy="450" r="${size * 2.6}" fill="${t.accent}" fill-opacity="0.15"/></g>`;
  return `<defs>${glow('dbtefx-xy-hole', t.accent, 0.5, 0.5, 0.5, 0.3)}</defs>
<circle cx="800" cy="450" r="330" fill="url(#dbtefx-xy-hole)"/>
<g fill="none" stroke="${t.accent}" stroke-opacity="0.2"><ellipse cx="800" cy="450" rx="300" ry="300"/><ellipse cx="800" cy="450" rx="210" ry="210" stroke-dasharray="4 10"/></g>
<circle cx="800" cy="450" r="120" fill="${t.bg}" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="3"/>
${unit(300, 14, 0, 9)}${unit(210, 10, 3, 7)}${unit(300, 14, 7, 9)}`;
};

// Link: eight link arrows around a marker, lighting in turn; circuit traces.

export default xyz;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 120, colors: ['accent', 'text'] }];
