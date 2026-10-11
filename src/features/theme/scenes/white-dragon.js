import { anim, glow, H, n1, rng, W } from './kit.js';

// White Dragon: crackling light, ice crystals, a burst of white.
const whiteDragon = (t) => {
  const rand = rng(79);
  const bolt = (x, delay) => {
    let d = `M${x} -20`;
    let cx = x;
    for (let y = 60; y < 620; y += 70) {
      cx += (rand() - 0.5) * 120;
      d += `L${n1(cx)} ${y}`;
    }
    return `<path d="${d}" fill="none" stroke="${t.accent2}" stroke-width="3" stroke-opacity="0.7" ${anim('pulse', n1(3 + rand() * 3), delay, 'steps(3)')}/>`;
  };
  return `<defs>${glow('dbtefx-wd-burst', t.text, 0.5, 0.35, 0.5, 0.18)}</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-wd-burst)"/>
${bolt(320, 0)}${bolt(1300, 1.5)}
${Array.from({ length: 10 }, () => {
    const x = rand() * W;
    const y = 120 + rand() * 600;
    const s = 10 + rand() * 18;
    return `<path d="M${n1(x)} ${n1(y - s)}L${n1(x + s * 0.5)} ${n1(y)}L${n1(x)} ${n1(y + s)}L${n1(x - s * 0.5)} ${n1(y)}Z" fill="${t.accent}" fill-opacity="0.25" stroke="${t.text}" stroke-opacity="0.3" ${anim('pulse', n1(3 + rand() * 4), rand() * 4, 'ease-in-out')}/>`;
  }).join('')}`;
};

// Dark Magic: a pentagram circle turning, violet sparkles, a wand's streak.

export default whiteDragon;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'flake', count: 70, colors: ['accent2', 'text'] }, { kind: 'flash', count: 1, colors: ['text'] }];
