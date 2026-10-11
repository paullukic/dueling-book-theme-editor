import { anim, glow, H, n1, rng, W } from './kit.js';

// Black Dragon: two red eyes in the dark, molten cracks, embers.
const blackDragon = (t) => {
  const rand = rng(89);
  let cracks = '';
  for (let i = 0; i < 7; i++) {
    let x = rand() * W;
    let d = `M${n1(x)} ${H}`;
    for (let y = H - 40; y > 640; y -= 40) {
      x += (rand() - 0.5) * 80;
      d += `L${n1(x)} ${y}`;
    }
    cracks += `<path d="${d}"/>`;
  }
  const eye = (x) => `<path d="M${x - 70} 300Q${x} 250 ${x + 70} 300Q${x} 320 ${x - 70} 300Z" fill="${t.accent}" fill-opacity="0.85"/><ellipse cx="${x}" cy="298" rx="7" ry="20" fill="${t.bg}"/>`;
  return `<defs>${glow('dbtefx-bd-eyes', t.accent, 0.5, 0.33, 0.35, 0.4)}${glow('dbtefx-bd-lava', t.accent, 0.5, 1, 0.6, 0.45)}</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-bd-eyes)" ${anim('pulse', 6, 0, 'ease-in-out')}/>
<g ${anim('blink', 10, 3, 'ease-in-out')}>${eye(690)}${eye(910)}</g>
<rect y="500" width="${W}" height="400" fill="url(#dbtefx-bd-lava)"/>
<!--near-->
<g fill="none" stroke="${t.warning}" stroke-opacity="0.45" stroke-width="3" ${anim('pulse', 3, 1, 'ease-in-out')}>${cracks}</g>`;
};

// Millennium: the Eye of Wdjat over a pyramid, drifting sand.

export default blackDragon;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'ember', count: 110, colors: ['accent', 'warning'] }, { kind: 'ash', count: 40, colors: ['muted'] }];
