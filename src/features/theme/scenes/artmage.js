import { anim, n1, polar, rng } from './kit.js';

// Artmage: gilded frame, sweeping paint, blooming splashes
const artmage = (t) => {
  const rand = rng(11);
  const curl = (x, y, sx, sy) =>
    `<path d="M${x} ${y}c${44 * sx} ${-9 * sy} ${80 * sx} ${15 * sy} ${70 * sx} ${47 * sy}c${-7 * sx} ${24 * sy} ${-38 * sx} ${24 * sy} ${-41 * sx} ${3 * sy}c${-1 * sx} ${-13 * sy} ${15 * sx} ${-18 * sy} ${22 * sx} ${-9 * sy}"/>`;
  const curls = [
    [800, 60, 1, 1], [800, 60, -1, 1], [800, 840, 1, -1], [800, 840, -1, -1],
    [470, 450, 1, 1], [470, 450, 1, -1], [1130, 450, -1, 1], [1130, 450, -1, -1],
  ];
  let splats = '';
  [[260, 240, t.accent], [1360, 640, t.opp], [1300, 180, t.accent2], [300, 700, t.accent2]].forEach(([cx, cy, c], k) => {
    let drops = `<circle cx="${cx}" cy="${cy}" r="${46 + k * 6}" fill="${c}"/>`;
    for (let i = 0; i < 10; i++) {
      const [x, y] = polar(cx, cy, 60 + rand() * 80, rand() * 360);
      drops += `<circle cx="${x}" cy="${y}" r="${n1(3 + rand() * 9)}" fill="${c}"/>`;
    }
    splats += `<g opacity="0.2" ${anim('bloom', n1(8 + k * 2), k * 2, 'ease-in-out')}>${drops}</g>`;
  });
  return `<defs>
<linearGradient id="dbtefx-am-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.4" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.opp}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-am-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0"/><stop offset="0.6" stop-color="${t.accent2}"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></linearGradient>
</defs>
<path d="M-40 260C300 160 620 300 900 230S1400 120 1660 200L1660 250C1400 190 1180 300 900 300S300 230 -40 330Z" fill="url(#dbtefx-am-a)" opacity="0.22"/>
<path d="M-40 640C320 720 640 560 960 640S1420 760 1660 660L1660 700C1420 800 1200 690 960 700S320 780 -40 700Z" fill="url(#dbtefx-am-b)" opacity="0.18"/>
<!--mid-->
${splats}
<g fill="none" stroke="${t.accent2}" stroke-linecap="round">
<ellipse cx="800" cy="450" rx="330" ry="392" stroke-width="4" stroke-opacity="0.3"/>
<ellipse cx="800" cy="450" rx="312" ry="374" stroke-width="1.5" stroke-opacity="0.2"/>
<g stroke-width="3" stroke-opacity="0.34">${curls.map((p) => curl(...p)).join('')}</g>
</g>
${[[568, 180], [1032, 180], [568, 720], [1032, 720]].map(([x, y]) => `<path d="M${x} ${y - 12}L${x + 8} ${y}L${x} ${y + 12}L${x - 8} ${y}Z" fill="${t.accent2}" fill-opacity="0.45"/>`).join('')}`;
};

export default artmage;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 60, colors: ['accent', 'opp', 'accent2'] }];
