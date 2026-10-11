import { mix } from '../../../lib/color.js';
import { anim, H, polar, W } from './kit.js';

// Branded: Dogmatika cathedral, the brand, rising embers
const branded = (t) => {
  const ice = mix(t.text, '#9fd8ff', 0.55);
  // Mirrorjade's ice blades fanned in a crown above the fusion vortex.
  let blades = '';
  for (let i = 0; i < 9; i++) {
    const ang = -90 + (i - 4) * 17;
    const len = 300 - Math.abs(i - 4) * 26;
    const [tx, ty] = polar(1120, 330, len, ang);
    const [lx, ly] = polar(1120, 330, len * 0.42, ang - 5);
    const [rx, ry] = polar(1120, 330, len * 0.42, ang + 5);
    blades += `<path d="M1120 330L${lx} ${ly}L${tx} ${ty}L${rx} ${ry}Z" fill="url(#dbtefx-bd-ice)" stroke="${ice}" stroke-opacity="0.7" stroke-width="2"/>`;
  }
  // Jagged crags of the burning wasteland.
  let crags = `M0 ${H}`;
  [[0, 700], [90, 640], [160, 690], [260, 600], [330, 660], [420, 620], [520, 700], [640, 650], [760, 710], [900, 660], [1010, 700], [1120, 610], [1220, 670], [1330, 590], [1440, 660], [1600, 620]].forEach(([x, y]) => {
    crags += `L${x} ${y}`;
  });
  crags += `L${W} ${H}Z`;
  // Albaz's chains hanging from the top-left corner.
  let chain = '';
  for (let i = 0; i < 9; i++) chain += `<ellipse cx="${150 + i * 26}" cy="${40 + i * 30}" rx="14" ry="22" transform="rotate(${i % 2 ? 60 : -30} ${150 + i * 26} ${40 + i * 30})"/>`;
  return `<defs>
<linearGradient id="dbtefx-bd-ice" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${ice}" stop-opacity="0.15"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.55"/></linearGradient>
<radialGradient id="dbtefx-bd-fire" cx="0.3" cy="1" r="0.75"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.6"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.18"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-bd-core"><stop offset="0" stop-color="#ffffff" stop-opacity="0.7"/><stop offset="0.35" stop-color="${t.accent2}" stop-opacity="0.45"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-bd-fire)" ${anim('pulse', 6, 0, 'ease-in-out')}/>
<path d="${crags}" fill="${mix(t.bg, t.accent, 0.1)}"/>
<!--mid-->
<g ${anim('bloom', 7, 0, 'ease-in-out')}>${blades}</g>
<g style="transform-origin: 1120px 330px; animation: dbtefx-spin 24s linear infinite;" fill="none" stroke-width="5" stroke-linecap="round"><path d="M1120 230A100 100 0 0 1 1220 330" stroke="${t.accent}" stroke-opacity="0.7"/><path d="M1120 430A100 100 0 0 1 1020 330" stroke="${ice}" stroke-opacity="0.7"/><path d="M1190 260A100 100 0 0 1 1190 400" stroke="${t.accent2}" stroke-opacity="0.4" stroke-dasharray="4 10"/></g>
<circle cx="1120" cy="330" r="120" fill="url(#dbtefx-bd-core)" ${anim('pulse', 3.5, 0, 'ease-in-out')}/>
<!--near-->
<g fill="none" stroke="${mix(t.bg, t.text, 0.35)}" stroke-width="7" opacity="0.8" style="transform-origin: 150px 0px; animation: dbtefx-reed 7s ease-in-out infinite;">${chain}</g>`;
};

export default branded;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'ember', count: 130, colors: ['accent2', 'accent', 'warning'] }, { kind: 'burst', count: 1, colors: ['accent2'] }];
