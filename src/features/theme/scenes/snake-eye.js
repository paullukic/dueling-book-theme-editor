import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, polar, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Snake-Eye: Snake-Eyes Flamberge Dragon, the real card artwork, rising out
// of the fire behind charred branches with ember cracks (Ash, Oak, Poplar are
// trees), burning poplar blossoms, spirit flame and rising sparks. The art
// loads live from DuelingBook (cardart.js); without it the fire, branches and
// blossoms remain.
const snakeEye = (t) => {
  const rand = rng(31);

  // Spirit flame: an S-curved tongue with a brighter core.
  const tongue = (x, y, h, w, l) =>
    `M${n1(x - w)} ${y}C${n1(x - w * 1.3)} ${n1(y - h * 0.3)} ${n1(x - w * 0.2 + l * 0.3)} ${n1(y - h * 0.5)} ${n1(x - w * 0.1 + l * 0.6)} ${n1(y - h * 0.72)}C${n1(x + l * 0.8 - w * 0.3)} ${n1(y - h * 0.85)} ${n1(x + l * 0.9)} ${n1(y - h * 0.92)} ${n1(x + l)} ${n1(y - h)}C${n1(x + l * 0.5 + w * 0.5)} ${n1(y - h * 0.8)} ${n1(x + w * 0.3 + l * 0.3)} ${n1(y - h * 0.62)} ${n1(x + w * 0.7 + l * 0.2)} ${n1(y - h * 0.45)}C${n1(x + w * 1.3)} ${n1(y - h * 0.25)} ${n1(x + w * 1.1)} ${n1(y - h * 0.08)} ${n1(x + w)} ${y}Q${x} ${n1(y + w * 0.4)} ${n1(x - w)} ${y}Z`;
  const fire = (x, y, scale, grad, delay) => {
    const parts = [
      [-34, 0.62, 26, -30],
      [0, 1, 34, 22],
      [32, 0.74, 24, 40],
    ];
    return parts
      .map(([dx, k, w, lean], i) => {
        const h = 210 * k * scale;
        const fx = x + dx * scale;
        return `<g style="transform-origin: ${n1(fx)}px ${y}px; animation: dbtefx-se-lick ${n1(2.4 + i * 0.5)}s ease-in-out ${n1(-delay - i * 0.7)}s infinite;"><path d="${tongue(fx, y, h, w * scale, lean * scale)}" fill="url(#${grad})"/><path d="${tongue(fx, y, h * 0.6, w * scale * 0.45, lean * scale * 0.6)}" fill="url(#${grad})"/></g>`;
      })
      .join('');
  };

  // Charred limb: a tapered bezier with knots, glowing cracks along its grain.
  const bez = (p, s) => {
    const u = 1 - s;
    return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * s * p[1][k] + 3 * u * s * s * p[2][k] + s * s * s * p[3][k]);
  };
  const limb = (p, w0, w1, crackDelay, gn = 0) => {
    const left = [];
    const right = [];
    let crack = '';
    const n = 16;
    for (let i = 0; i <= n; i++) {
      const s = i / n;
      const [bx, by] = bez(p, s);
      const [x2, y2] = bez(p, Math.min(1, s + 0.01));
      const [x1, y1] = bez(p, Math.max(0, s - 0.01));
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const [nx, ny] = [-(y2 - y1) / len, (x2 - x1) / len];
      const bend = Math.sin(s * 9 + w0) * gn * (1 - s * 0.5);
      const [x, y] = [bx + nx * bend, by + ny * bend];
      const w = (w0 + (w1 - w0) * s) * (1 + (rand() - 0.5) * 0.25) * 0.5;
      left.push(`${n1(x + nx * w)} ${n1(y + ny * w)}`);
      right.unshift(`${n1(x - nx * w)} ${n1(y - ny * w)}`);
      if (i < n - 2) crack += `${i ? 'L' : 'M'}${n1(x + nx * w * (rand() - 0.5) * 0.7)} ${n1(y + ny * w * (rand() - 0.5) * 0.7)}`;
      if (i % 3 === 1 && i < n - 3) crack += `M${n1(x)} ${n1(y)}l${n1(nx * w * 0.6 + (rand() - 0.5) * 8)} ${n1(ny * w * 0.6 + (rand() - 0.5) * 8)}M${n1(x)} ${n1(y)}`;
    }
    return `<path d="M${left.join('L')}L${right.join('L')}Z" fill="${mix(t.bg, '#000000', 0.55)}" stroke="${mix(t.bg, t.accent, 0.25)}" stroke-width="1.5"/><path d="${crack}" fill="none" stroke="${t.accent}" stroke-opacity="0.3" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="${crack}" fill="none" stroke="${mix(t.accent, t.accent2, 0.5)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${anim('pulse', 3.6, crackDelay, 'ease-in-out')}/>`;
  };

  // Burning poplar blossom on the ash: five petals, a lick of flame.
  const blossom = (x, y, r, delay) => {
    let petals = '';
    for (let i = 0; i < 5; i++) {
      const [px, py] = polar(x, y, r * 0.55, i * 72 - 90);
      petals += `<ellipse cx="${px}" cy="${py}" rx="${n1(r * 0.5)}" ry="${n1(r * 0.32)}" transform="rotate(${i * 72 - 90} ${px} ${py})"/>`;
    }
    return `<g fill="${mix(t.danger, t.bg, 0.5)}" fill-opacity="0.95" stroke="${mix(t.bg, '#000000', 0.5)}" stroke-width="1">${petals}</g><circle cx="${x}" cy="${y}" r="${n1(r * 0.3)}" fill="${t.accent2}"/>${fire(x, y - r * 0.2, r / 70, 'dbtefx-se-lickg', delay)}`;
  };

  return `<style>@keyframes dbtefx-se-lick { 0%, 100% { transform: scale(1, 1) skewX(0deg); opacity: 0.85; } 35% { transform: scale(0.92, 1.1) skewX(-5deg); opacity: 1; } 70% { transform: scale(1.06, 0.9) skewX(4deg); opacity: 0.7; } }
</style>
<defs>
<linearGradient id="dbtefx-se-lickg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0"/><stop offset="0.15" stop-color="${mix(t.accent2, '#ffffff', 0.3)}" stop-opacity="0.85"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.6"/><stop offset="1" stop-color="${t.danger}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-se-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.6"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.danger}" stop-opacity="0"/></linearGradient>
${glow('dbtefx-se-ground', t.accent, 0.5, 1, 0.8, 0.38)}
</defs>
<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="${t.bg}" fill-opacity="0.5"/>
<rect x="-200" y="300" width="${W + 400}" height="${H}" fill="url(#dbtefx-se-ground)"/>
${fire(180, H + 20, 1.3, 'dbtefx-se-fire', 0)}${fire(1480, H + 20, 1.5, 'dbtefx-se-fire', 1.2)}
<!--mid-->
${cardArt(t, { id: 'dbtefx-se-hero', card: CARDS.flamberge, x: 1040, y: -20, w: 500, h: 740, focus: [0.62, 0.45], zoom: 0.85, blend: 'normal', tint: t.accent, tintAmt: 0.85, feather: 0.85, fade: 0.65, backdrop: mix(t.bg, t.accent, 0.3), backdropAmt: 0.6, glow: t.accent, breathe: 14 })}
<!--near-->
${limb([[1680, 960], [1520, 790], [1400, 730], [1236, 660]], 104, 22, 0, 14)}${limb([[1430, 742], [1430, 690], [1460, 640], [1500, 604]], 26, 6, 1.2, 6)}${limb([[1300, 712], [1286, 676], [1306, 646], [1340, 624]], 20, 5, 2.1, 5)}
${blossom(1500, 600, 30, 0.4)}${blossom(1340, 620, 24, 1.3)}${blossom(1238, 656, 28, 2.2)}
${limb([[-60, -40], [80, 60], [240, 70], [420, 150]], 50, 8, 2)}${limb([[200, 74], [230, 40], [260, 10], [310, -20]], 18, 4, 2.8)}`;
};

export default snakeEye;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ember', count: 110, colors: ['accent', 'accent2'] },
  { kind: 'spark', count: 18, colors: ['accent2', 'danger'], speed: 0.6 },
  { kind: 'ash', count: 30, colors: ['muted'] },
];
