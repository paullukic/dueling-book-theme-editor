import { n1, polar } from './kit.js';

// Parchment (light): a scholar's desk. Soft window light falls from the top
// right, away from the menu, onto a sepia-ink astrolabe drawn on the page;
// its star map (the rete) turns very slowly. Dust drifts in the light.
// Small enough to sit whole in the right gutter (round 6's 60px nudge still
// left half of it past the viewport edge): lengths scale with K, line widths
// stay readable.
const CX = 1442;
const CY = 450;
const R = 70;
const K = R / 235;
const L = (v) => n1(v * K);

const astrolabe = (t) => {
  const ink = t.muted;
  // Degree scale: a tick every 10 degrees, longer every 30.
  let ticks = '';
  for (let d = 0; d < 360; d += 10) {
    const [x1, y1] = polar(CX, CY, R - L(4), d);
    const [x2, y2] = polar(CX, CY, R - (d % 30 === 0 ? L(34) : L(16)), d);
    ticks += `M${x1} ${y1}L${x2} ${y2}`;
  }
  // Hour arcs of the plate: circles through the zenith at several sizes.
  const arcs = [0.25, 0.42, 0.6].map((k) => `<circle cx="${CX}" cy="${n1(CY - R * 0.62 + R * k)}" r="${n1(R * k)}"/>`).join('');
  // The rete: an off-centre ecliptic ring with its twelve sign divisions, and star pointers ending in small rings.
  const ecR = R * 0.6;
  const ecY = CY - R * 0.2;
  let signs = '';
  for (let d = 0; d < 360; d += 30) {
    const [x1, y1] = polar(CX, ecY, ecR, d);
    const [x2, y2] = polar(CX, ecY, ecR - L(14), d);
    signs += `M${x1} ${y1}L${x2} ${y2}`;
  }
  const stars = [20, 75, 140, 200, 255, 310]
    .map((d, i) => {
      const [tx, ty] = polar(CX, CY, R * (0.5 + (i % 3) * 0.1), d);
      const [bx, by] = polar(CX, CY, R * 0.22, d);
      return `<path d="M${bx} ${by}L${tx} ${ty}"/><circle cx="${tx}" cy="${ty}" r="2"/>`;
    })
    .join('');
  const [a1x, a1y] = polar(CX, CY, R - 1, 205);
  const [a2x, a2y] = polar(CX, CY, R - 1, 25);
  return `<g fill="none" stroke="${ink}" stroke-linecap="round">
<circle cx="${CX}" cy="${CY}" r="${R}" stroke-opacity="0.4" stroke-width="2"/>
<circle cx="${CX}" cy="${CY}" r="${n1(R - L(38))}" stroke-opacity="0.26" stroke-width="1"/>
<path d="${ticks}" stroke-opacity="0.32" stroke-width="1"/>
<g stroke-opacity="0.18" stroke-width="0.9">${arcs}<path d="M${n1(CX - R + L(38))} ${CY}H${n1(CX + R - L(38))}M${CX} ${n1(CY - R + L(38))}V${n1(CY + R - L(38))}"/></g>
<circle cx="${CX}" cy="${n1(CY - R * 0.62)}" r="2.5" fill="${ink}" fill-opacity="0.26" stroke="none"/>
<path d="M${n1(CX - L(28))} ${n1(CY - R - 1)}Q${CX} ${n1(CY - R - L(56))} ${n1(CX + L(28))} ${n1(CY - R - 1)}" stroke-opacity="0.36" stroke-width="2"/>
<circle cx="${CX}" cy="${n1(CY - R - L(36))}" r="${n1(Math.max(4, L(11)))}" stroke-opacity="0.36" stroke-width="1.6"/>
<g style="transform-origin: ${CX}px ${CY}px; animation: dbtefx-spin 420s linear infinite;">
<g stroke="${t.accent}" stroke-opacity="0.26" stroke-width="1"><circle cx="${CX}" cy="${n1(ecY)}" r="${n1(ecR)}" stroke-width="1.4"/><circle cx="${CX}" cy="${n1(ecY)}" r="${n1(ecR - L(14))}" stroke-width="0.8"/><path d="${signs}"/>${stars}</g>
</g>
<path d="M${a1x} ${a1y}L${a2x} ${a2y}" stroke-opacity="0.24" stroke-width="2.4"/>
<circle cx="${CX}" cy="${CY}" r="3.5" fill="${t.raised}" stroke-opacity="0.45" stroke-width="1.4"/>
</g>`;
};

const parchment = (t) => `<defs><radialGradient id="dbtefx-pc-light" cx="0.82" cy="0.05" r="0.75"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.45" stop-color="#ffffff" stop-opacity="0.18"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#dbtefx-pc-light)"/>
<!--mid-->
${astrolabe(t)}`;

export default parchment;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 40, colors: ['raised'], light: true }];
