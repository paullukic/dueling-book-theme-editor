import { anim, n1, polar } from './kit.js';

// A six-armed ice crystal (dendrite) as line art: each arm carries three pairs
// of side branches at 60 degrees, round a small hexagonal core.
export const crystal = (cx, cy, r) => {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = i * 60 - 90;
    const [ex, ey] = polar(cx, cy, r, a);
    d += `M${n1(cx)} ${n1(cy)}L${ex} ${ey}`;
    [[0.38, 0.3], [0.6, 0.24], [0.8, 0.14]].forEach(([at, len]) => {
      const [bx, by] = polar(cx, cy, r * at, a);
      [-60, 60].forEach((s) => {
        const [tx, ty] = polar(bx, by, r * len, a + s);
        d += `M${bx} ${by}L${tx} ${ty}`;
      });
    });
  }
  const hex = Array.from({ length: 6 }, (_, i) => polar(cx, cy, r * 0.13, i * 60 - 90).join(' ')).join('L');
  return `<path d="${d}M${hex}Z"/>`;
};

// Snow: still winter light. A pale aurora far off, two great ice crystals
// turning very slowly, soft drifts in front.
const snow = (t) => `<defs><linearGradient id="dbtefx-sn-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.75"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-sn-aurora" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0"/><stop offset="0.35" stop-color="${t.accent2}" stop-opacity="0.12"/><stop offset="0.7" stop-color="${t.accent}" stop-opacity="0.1"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient><filter id="dbtefx-sn-soft" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="34"/></filter></defs>
<rect width="1600" height="900" fill="url(#dbtefx-sn-sky)"/>
<path d="M-100 250Q300 120 760 210T1700 150V300Q1240 360 780 300T-100 380Z" fill="url(#dbtefx-sn-aurora)" filter="url(#dbtefx-sn-soft)" ${anim('drift', 40, 0, 'ease-in-out')}/>
<!--mid-->
<g fill="none" stroke="${t.accent}" stroke-opacity="0.13" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" style="transform-origin: 1290px 300px; animation: dbtefx-spin 360s linear infinite;">${crystal(1290, 300, 230)}</g>
<g fill="none" stroke="${t.accent2}" stroke-opacity="0.12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform-origin: 250px 230px; animation: dbtefx-spin 300s linear infinite;">${crystal(250, 230, 110)}</g>
<!--near-->
<path d="M0 790Q420 720 860 770T1600 740V900H0Z" fill="${t.raised}" fill-opacity="0.9"/>
<path d="M0 790Q420 720 860 770T1600 740" fill="none" stroke="${t.border}" stroke-opacity="0.7" stroke-width="1.5"/>`;

export default snow;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'flake', count: 110, colors: ['raised'], outline: 'border' }];
