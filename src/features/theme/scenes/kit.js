// Shared drawing kit for theme scenes: seeded scatter, rounding, polar
// coordinates, the 1600x900 canvas, keyframes and small SVG builders.

// Seeded scatter: the same picture on every render.
export const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

export const n1 = (v) => Math.round(v * 10) / 10;

export const polar = (cx, cy, r, deg) => [n1(cx + r * Math.cos((deg * Math.PI) / 180)), n1(cy + r * Math.sin((deg * Math.PI) / 180))];

export const W = 1600;

export const H = 900;

// Shared keyframes. Every animated element sets its own duration and delay.

// Shared keyframes. Every animated element sets its own duration and delay.
export const KEYFRAMES = `
@keyframes dbtefx-fall { 0% { transform: translate(0, -120px) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 50% { transform: translate(60px, 440px) rotate(140deg); } 100% { transform: translate(-30px, 1040px) rotate(300deg); opacity: 0.6; } }
@keyframes dbtefx-spin { to { transform: rotate(360deg); } }
@keyframes dbtefx-sway { 0%, 100% { transform: rotate(-14deg); } 50% { transform: rotate(14deg); } }
@keyframes dbtefx-reed { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2.5deg); } }
@keyframes dbtefx-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.04); } }
@keyframes dbtefx-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
@keyframes dbtefx-flicker { 0%, 100% { opacity: 0.8; transform: scale(1); } 30% { opacity: 1; transform: scale(1.08, 1.14); } 60% { opacity: 0.7; transform: scale(0.96, 0.9); } }
@keyframes dbtefx-ripple { 0% { transform: scale(0.15); opacity: 0.9; } 100% { transform: scale(1.7); opacity: 0; } }
@keyframes dbtefx-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes dbtefx-scan { 0% { transform: translateY(-40px); } 100% { transform: translateY(940px); } }
@keyframes dbtefx-bloom { 0%, 100% { transform: scale(0.94); opacity: 0.75; } 50% { transform: scale(1.04); opacity: 1; } }
@keyframes dbtefx-scanx { 0% { transform: translateX(0); } 100% { transform: translateX(2000px); } }
@keyframes dbtefx-drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(18px, -10px); } }
`;

// Inline animation for one element: name, seconds, delay seconds, extras.

// Inline animation for one element: name, seconds, delay seconds, extras.
export const anim = (name, dur, delay = 0, extra = '') =>
  `style="animation: dbtefx-${name} ${dur}s ${extra || 'linear'} ${n1(-delay)}s infinite;${name === 'fall' || name === 'sway' || name === 'blink' || name === 'flicker' || name === 'ripple' || name === 'bloom' ? ' transform-box: fill-box; transform-origin: center;' : ''}"`;

// A slowly turning ring of runes around a centre point.
export const runeRing = (t, cx, cy, r, color, dur, reverse = false) => {
  let ticks = '';
  for (let i = 0; i < 48; i++) {
    const [x1, y1] = polar(cx, cy, r - (i % 4 ? 8 : 18), i * 7.5);
    const [x2, y2] = polar(cx, cy, r, i * 7.5);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  return `<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin ${dur}s linear infinite${reverse ? ' reverse' : ''};" fill="none" stroke="${color}"><circle cx="${cx}" cy="${cy}" r="${r}" stroke-opacity="0.35" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="${r - 26}" stroke-opacity="0.2" stroke-dasharray="10 8"/><g stroke-opacity="0.35" stroke-width="2">${ticks}</g></g>`;
};

export const star = (cx, cy, r, points = 5) => {
  const p = [];
  for (let i = 0; i < points; i++) p.push(polar(cx, cy, r, -90 + (i * 720) / points).join(' '));
  return `M${p.join('L')}Z`;
};

export const glow = (id, color, cx = 0.5, cy = 0.5, r = 0.5, o = 0.25) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${color}" stop-opacity="${o}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;

// Spell Card: a turning spell circle, sparkles rising like cast magic.
