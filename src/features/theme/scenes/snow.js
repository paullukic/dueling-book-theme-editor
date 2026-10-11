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

// A faceted crystal for the scene: six tapered arms, each a long kite with
// three pairs of smaller kites, split down the middle into a lit and a shaded
// face so it reads as cut ice.
const kite = (bx, by, len, w, deg) => {
  const [tx, ty] = polar(bx, by, len, deg);
  const [lx, ly] = polar(bx, by, w, deg - 90);
  const [rx, ry] = polar(bx, by, w, deg + 90);
  const [mx, my] = polar(bx, by, len * 0.18, deg);
  return [`M${lx} ${ly}L${mx} ${my}L${tx} ${ty}Z`, `M${rx} ${ry}L${mx} ${my}L${tx} ${ty}Z`];
};
const facetCrystal = (cx, cy, r) => {
  const lit = [];
  const shade = [];
  for (let i = 0; i < 6; i++) {
    const a = i * 60 - 90;
    const [l, s] = kite(cx, cy, r, r * 0.07, a);
    lit.push(l);
    shade.push(s);
    [[0.42, 0.3], [0.62, 0.22], [0.8, 0.13]].forEach(([at, len]) => {
      const [bx, by] = polar(cx, cy, r * at, a);
      [-60, 60].forEach((side) => {
        const [bl, bs] = kite(bx, by, r * len, r * 0.032, a + side);
        lit.push(bl);
        shade.push(bs);
      });
    });
  }
  return { lit: lit.join(''), shade: shade.join('') };
};

// Snow: still winter light. A pale aurora far off, one great cut-ice crystal
// on the right turning very slowly, soft drifts in front.
const snow = (t) => {
  const c = facetCrystal(1600, 300, 200);
  return `<defs><linearGradient id="dbtefx-sn-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.75"/><stop offset="0.55" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-sn-aurora" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0"/><stop offset="0.35" stop-color="${t.accent2}" stop-opacity="0.12"/><stop offset="0.7" stop-color="${t.accent}" stop-opacity="0.1"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient><filter id="dbtefx-sn-soft" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="34"/></filter>
<linearGradient id="dbtefx-sn-ice" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.45" stop-color="${t.accent2}" stop-opacity="0.18"/><stop offset="0.7" stop-color="${t.accent}" stop-opacity="0.2"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.6"/></linearGradient></defs>
<rect width="1600" height="900" fill="url(#dbtefx-sn-sky)"/>
<path d="M-100 250Q300 120 760 210T1700 150V300Q1240 360 780 300T-100 380Z" fill="url(#dbtefx-sn-aurora)" filter="url(#dbtefx-sn-soft)" ${anim('drift', 40, 0, 'ease-in-out')}/>
<!--mid-->
<g style="transform-origin: 1600px 300px; animation: dbtefx-spin 360s linear infinite;" stroke-linejoin="round">
<path d="${c.lit}" fill="url(#dbtefx-sn-ice)" stroke="${t.accent}" stroke-opacity="0.22" stroke-width="1"/>
<path d="${c.shade}" fill="${t.accent}" fill-opacity="0.08" stroke="${t.accent}" stroke-opacity="0.22" stroke-width="1"/>
<circle cx="1600" cy="300" r="10" fill="#ffffff" fill-opacity="0.7" stroke="${t.accent}" stroke-opacity="0.25"/>
</g>
<!--near-->
<path d="M0 828Q420 812 860 822T1600 816V900H0Z" fill="${t.raised}" fill-opacity="0.9"/>
<path d="M0 828Q420 812 860 822T1600 816" fill="none" stroke="${t.border}" stroke-opacity="0.7" stroke-width="1.5"/>`;
};

export default snow;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'flake', count: 110, colors: ['raised'], outline: 'border' }];
