import { n1, polar } from './kit.js';

// Parchment (light): a scholar's desk. Soft window light falls from the top
// right, away from the menu, onto a sepia-ink astrolabe drawn on the page;
// its star map (the rete) turns very slowly. Dust drifts in the light.
const CX = 1625;
const CY = 470;
const R = 235;

const astrolabe = (t) => {
  const ink = t.muted;
  // Degree scale: a tick every 5 degrees, longer every 30.
  let ticks = '';
  for (let d = 0; d < 360; d += 5) {
    const [x1, y1] = polar(CX, CY, R - 4, d);
    const [x2, y2] = polar(CX, CY, R - (d % 30 === 0 ? 30 : 14), d);
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
    const [x2, y2] = polar(CX, ecY, ecR - 14, d);
    signs += `M${x1} ${y1}L${x2} ${y2}`;
  }
  const stars = [20, 75, 140, 200, 255, 310]
    .map((d, i) => {
      const [tx, ty] = polar(CX, CY, R * (0.5 + (i % 3) * 0.1), d);
      const [bx, by] = polar(CX, CY, R * 0.22, d);
      return `<path d="M${bx} ${by}L${tx} ${ty}"/><circle cx="${tx}" cy="${ty}" r="4"/>`;
    })
    .join('');
  const [a1x, a1y] = polar(CX, CY, R - 2, 205);
  const [a2x, a2y] = polar(CX, CY, R - 2, 25);
  return `<g fill="none" stroke="${ink}" stroke-linecap="round">
<circle cx="${CX}" cy="${CY}" r="${R}" stroke-opacity="0.32" stroke-width="3"/>
<circle cx="${CX}" cy="${CY}" r="${R - 34}" stroke-opacity="0.22" stroke-width="1.4"/>
<path d="${ticks}" stroke-opacity="0.26" stroke-width="1.3"/>
<g stroke-opacity="0.16" stroke-width="1.2">${arcs}<path d="M${CX - R + 34} ${CY}H${CX + R - 34}M${CX} ${CY - R + 34}V${CY + R - 34}"/></g>
<circle cx="${CX}" cy="${n1(CY - R * 0.62)}" r="5" fill="${ink}" fill-opacity="0.22" stroke="none"/>
<path d="M${CX - 22} ${CY - R - 2}Q${CX} ${CY - R - 46} ${CX + 22} ${CY - R - 2}" stroke-opacity="0.3" stroke-width="3"/>
<circle cx="${CX}" cy="${CY - R - 30}" r="9" stroke-opacity="0.3" stroke-width="2.4"/>
<g style="transform-origin: ${CX}px ${CY}px; animation: dbtefx-spin 420s linear infinite;">
<g stroke="${t.accent}" stroke-opacity="0.2" stroke-width="1.6"><circle cx="${CX}" cy="${n1(ecY)}" r="${n1(ecR)}" stroke-width="2"/><circle cx="${CX}" cy="${n1(ecY)}" r="${n1(ecR - 14)}" stroke-width="1"/><path d="${signs}"/>${stars}</g>
</g>
<path d="M${a1x} ${a1y}L${a2x} ${a2y}" stroke-opacity="0.2" stroke-width="4"/>
<circle cx="${CX}" cy="${CY}" r="7" fill="${t.raised}" stroke-opacity="0.4" stroke-width="2"/>
</g>`;
};

const parchment = (t) => `<defs><radialGradient id="dbtefx-pc-light" cx="0.82" cy="0.05" r="0.75"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.45" stop-color="#ffffff" stop-opacity="0.18"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>
<rect width="1600" height="900" fill="url(#dbtefx-pc-light)"/>
<!--mid-->
${astrolabe(t)}`;

export default parchment;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 40, colors: ['raised'], light: true }];
