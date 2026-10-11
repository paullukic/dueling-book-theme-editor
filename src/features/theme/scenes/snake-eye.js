import { anim, glow, H, polar, W } from './kit.js';

// Snake-Eye: the serpent's eye, a coiled body, embers
const snakeEye = (t) => {
  let fibres = '';
  for (let a = 0; a < 360; a += 8) {
    const [x1, y1] = polar(800, 200, 70, a);
    const [x2, y2] = polar(800, 200, 160, a);
    fibres += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  const coil = 'M-60 780C200 640 420 900 700 780S1180 620 1400 760S1640 860 1680 820';
  return `<defs>
<radialGradient id="dbtefx-se-iris"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.9"/><stop offset="0.55" stop-color="${t.accent}" stop-opacity="0.6"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.08"/></radialGradient>
<linearGradient id="dbtefx-se-body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.05"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.32"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.05"/></linearGradient>
<radialGradient id="dbtefx-se-glow" cx="0.5" cy="0.25" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.25"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-se-glow)"/>
<path d="${coil}" fill="none" stroke="url(#dbtefx-se-body)" stroke-width="86" stroke-linecap="round"/>
<path d="${coil}" fill="none" stroke="${t.accent2}" stroke-opacity="0.22" stroke-width="64" stroke-dasharray="3 15" stroke-linecap="round"/>
<!--mid-->
<g ${anim('blink', 9, 2, 'ease-in-out')}>
<path d="M380 200Q800 -80 1220 200Q800 480 380 200Z" fill="${t.bg}" fill-opacity="0.6" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="4"/>
<circle cx="800" cy="200" r="168" fill="url(#dbtefx-se-iris)" opacity="0.75" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<g stroke="${t.accent2}" stroke-opacity="0.22">${fibres}</g>
<ellipse cx="800" cy="200" rx="24" ry="150" fill="${t.bg}" fill-opacity="0.92" stroke="${t.accent}" stroke-opacity="0.6" stroke-width="2"/>
<ellipse cx="748" cy="132" rx="22" ry="10" fill="#ffffff" fill-opacity="0.18" transform="rotate(-25 748 132)"/>
</g>`;
};

export default snakeEye;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'ember', count: 120, colors: ['accent', 'accent2'] }, { kind: 'burst', count: 1, colors: ['accent'] }];
