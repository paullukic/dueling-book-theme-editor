

// Pendulum: two scale pillars and a swinging pendulum between them.
const pendulum = (t) =>
  `<defs><linearGradient id="dbtefx-pe-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.self}" stop-opacity="0.45"/><stop offset="1" stop-color="${t.self}" stop-opacity="0.05"/></linearGradient>
<linearGradient id="dbtefx-pe-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.05"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.45"/></linearGradient></defs>
<rect x="250" y="80" width="110" height="820" rx="10" fill="url(#dbtefx-pe-l)"/><rect x="1240" y="80" width="110" height="820" rx="10" fill="url(#dbtefx-pe-r)"/>
<path d="M360 140H1240" stroke="${t.text}" stroke-opacity="0.18" stroke-width="3"/>
<!--mid-->
<g style="transform-origin: 800px 140px; animation: dbtefx-sway 4s ease-in-out infinite;"><path d="M800 140V560" stroke="${t.text}" stroke-opacity="0.3" stroke-width="3"/>
<path d="M800 540L850 600L800 690L750 600Z" fill="${t.accent}" fill-opacity="0.35" stroke="${t.self}" stroke-opacity="0.6" stroke-width="3"/></g>`;

// Divine Beasts: Ra's sun disk, Obelisk's pillar of light, Slifer's coil.

export default pendulum;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 50, colors: ['self', 'accent'] }];
