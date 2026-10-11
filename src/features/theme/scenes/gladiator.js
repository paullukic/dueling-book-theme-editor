import { mix } from '../../../lib/color.js';
import { anim, glow, n1, polar, W } from './kit.js';

// Gladiator Beast: the colosseum, a laurelled shield, banners
const gladiator = (t) => {
  let tiers = '';
  [[520, 64, 18], [590, 56, 22], [650, 48, 26]].forEach(([y, h, n], row) => {
    const w = W / n;
    for (let i = 0; i < n; i++) {
      const x = i * w;
      const dy = n1(Math.sin((i / (n - 1)) * Math.PI) * -30);
      tiers += `<path d="M${n1(x + w * 0.18)} ${n1(y + dy + h)}V${n1(y + dy + h * 0.45)}Q${n1(x + w * 0.5)} ${n1(y + dy)} ${n1(x + w * 0.82)} ${n1(y + dy + h * 0.45)}V${n1(y + dy + h)}Z" fill-opacity="${0.5 - row * 0.12}"/>`;
    }
  });
  let laurel = '';
  for (let i = 0; i < 9; i++) {
    const [lx, ly] = polar(1150, 300, 150, 110 + i * 15);
    const [rx, ry] = polar(1150, 300, 150, 70 - i * 15);
    laurel += `<ellipse cx="${lx}" cy="${ly}" rx="10" ry="22" transform="rotate(${20 + i * 15} ${lx} ${ly})"/><ellipse cx="${rx}" cy="${ry}" rx="10" ry="22" transform="rotate(${-20 - i * 15} ${rx} ${ry})"/>`;
  }
  const banner = (x, delay) => `<g style="transform-origin: ${x}px 0px; animation: dbtefx-reed 7s ease-in-out ${-delay}s infinite;"><path d="M${x - 50} 0h100v330l-50 -40l-50 40Z" fill="${t.accent2}" fill-opacity="0.75" stroke="${t.accent}" stroke-opacity="0.8" stroke-width="4"/><circle cx="${x}" cy="150" r="26" fill="none" stroke="${t.accent}" stroke-opacity="0.8" stroke-width="4"/></g>`;
  return `<defs><linearGradient id="dbtefx-gb-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.warning}" stop-opacity="0"/><stop offset="1" stop-color="${t.warning}" stop-opacity="0.2"/></linearGradient>${glow('dbtefx-gb-sun', t.warning, 0.5, 0.5, 0.5, 0.35)}</defs>
<rect y="560" width="${W}" height="340" fill="url(#dbtefx-gb-sand)"/>
<g fill="${mix(t.bg, t.accent, 0.25)}">${tiers}</g>
<!--mid-->
<circle cx="1150" cy="300" r="220" fill="url(#dbtefx-gb-sun)"/>
<g stroke="${t.text}" stroke-opacity="0.55" stroke-width="10" stroke-linecap="round"><path d="M990 140L1310 460M1310 140L990 460"/></g>
<g fill="${t.success}" fill-opacity="0.45">${laurel}</g>
<circle cx="1150" cy="300" r="96" fill="${mix(t.bg, t.accent, 0.35)}" stroke="${t.accent}" stroke-opacity="0.85" stroke-width="10"/>
<circle cx="1150" cy="300" r="60" fill="none" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="4"/>
<circle cx="1150" cy="300" r="20" fill="${t.accent}" fill-opacity="0.8" ${anim('pulse', 4, 0, 'ease-in-out')}/>
<!--near-->
${banner(80, 0)}${banner(1520, 3)}`;
};

export default gladiator;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 80, colors: ['warning', 'accent'] }, { kind: 'ash', count: 30, colors: ['muted'] }];
