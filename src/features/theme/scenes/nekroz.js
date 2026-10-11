import { mix } from '../../../lib/color.js';
import { H, n1, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Nekroz: the mirror hall in the glacier. A great pointed mirror of ice
// stands between crystal pillars, its frame bristling with frost blades
// like folded wings. In the glass is not the hall but the Nekroz on the
// other side: Trishula, the real card artwork loaded live from DuelingBook
// (cardart.js); offline the glass stays an empty, glinting mirror. A glint sweeps
// the glass on a slow loop, kaleidoscope shards turn around the frame, the
// floor of ice reflects it all, snow falls.

const cx = 1258;
const top = 128;
const bot = 708;
const half = 150;

// A pointed oval (vesica) between top and bottom tips, `w` wide each side.
const vesica = (y0, y1, w) => {
  const c = (y1 - y0) / 2;
  const r = n1((c * c + w * w) / (2 * w));
  return `M${cx} ${y0}A${r} ${r} 0 0 1 ${cx} ${y1}A${r} ${r} 0 0 1 ${cx} ${y0}Z`;
};
// A point on the right half of that vesica at height y, and its outward normal.
const edge = (y0, y1, w, y) => {
  const c = (y1 - y0) / 2;
  const r = (c * c + w * w) / (2 * w);
  const my = (y0 + y1) / 2;
  const ox = cx + w - r;
  const dy = y - my;
  const x = ox + Math.sqrt(Math.max(0, r * r - dy * dy));
  return [x, (x - ox) / r, dy / r];
};

const scene = (t) => {
  const rand = rng(41);
  const ice = t.accent;
  const iceLit = mix(t.accent, '#ffffff', 0.55);
  const iceMid = mix(t.accent, t.bg, 0.35);
  const iceDark = mix(t.bg, t.accent, 0.22);
  const deep = mix(t.bg, '#000000', 0.35);
  const violet = t.accent2;

  // Frost blades around the frame, longest at the shoulders like folded wings.
  let blades = '';
  for (let side = -1; side <= 1; side += 2) {
    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 12; i++) {
        const y = top + 40 + i * 44 + row * 22;
        const [ex, nx, ny] = edge(top - 18, bot + 18, half + 22, y);
        const x = cx + side * (ex - cx);
        const wing = Math.exp(-(((y - 270) / 150) ** 2));
        const len = (row ? 0.65 : 1) * (22 + wing * (side < 0 ? 110 : 150));
        const ux = side * (nx * 0.6 + 0.4);
        const uy = ny * 0.5 - 1.1 * wing - 0.2;
        const m = Math.hypot(ux, uy);
        const [dx, dy] = [ux / m, uy / m];
        const tipX = x + dx * len;
        const tipY = y + dy * len;
        const w = 6 + wing * 7;
        blades += `<path d="M${n1(x - dy * w)} ${n1(y + dx * w)}L${n1(tipX)} ${n1(tipY)}L${n1(x + dy * w)} ${n1(y - dx * w)}Z" fill="url(#dbtefx-nk-blade)" fill-opacity="${row ? 0.75 : 1}"/><path d="M${n1(x)} ${n1(y)}L${n1(tipX)} ${n1(tipY)}" stroke="${iceLit}" stroke-opacity="0.7" stroke-width="1.2"/>`;
      }
    }
  }

  // Crystal pillars of the hall: hexagonal prisms with pointed tops.
  const pillar = (x, h, w, o) => {
    const y = 770;
    return `<g fill-opacity="${o}"><path d="M${x} ${y}V${y - h}L${x + w / 2} ${y - h - w * 0.9}L${x + w / 2} ${y}Z" fill="${iceMid}"/><path d="M${x + w / 2} ${y}V${y - h - w * 0.9}L${x + w} ${y - h}V${y}Z" fill="${iceDark}"/><path d="M${x + w * 0.2} ${y}V${y - h * 0.8}" stroke="${iceLit}" stroke-opacity="0.3" stroke-width="2"/></g>`;
  };
  let pillars = '';
  [[40, 420, 70, 0.55], [130, 300, 50, 0.45], [210, 520, 80, 0.5], [330, 260, 46, 0.4], [1470, 480, 76, 0.5], [1550, 340, 54, 0.45]].forEach((p) => (pillars += pillar(...p)));
  let farPillars = '';
  for (let i = 0; i < 14; i++) farPillars += pillar(n1(i * 118 + rand() * 40), n1(200 + rand() * 320), n1(30 + rand() * 30), 0.22);

  // Kaleidoscope shards turning around the mirror.
  const shard = (x, y, s, i) => `<g transform="translate(${x} ${y}) scale(${s})"><g style="animation: dbtefx-spin ${n1(30 + i * 7)}s linear ${n1(-i * 5)}s infinite${i % 2 ? ' reverse' : ''};"><path d="M0 -26L8 0L0 26L-8 0Z" fill="url(#dbtefx-nk-blade)" style="animation: dbtefx-pulse ${n1(4 + i)}s ease-in-out ${n1(-i * 1.3)}s infinite;"/><path d="M0 -26V26" stroke="${iceLit}" stroke-opacity="0.6"/></g></g>`;
  const shards = [[1050, 230, 1.2], [1420, 190, 1], [1060, 600, 0.9], [1430, 640, 1.3], [1110, 90, 0.7], [1400, 420, 0.6]].map(([x, y, s], i) => shard(x, y, s, i)).join('');

  const glass = vesica(top, bot, half);
  const frame = `<path d="${vesica(top - 18, bot + 18, half + 22)}" fill="url(#dbtefx-nk-frame)"/><path d="${vesica(top - 12, bot + 12, half + 15)}" fill="none" stroke="${iceDark}" stroke-opacity="0.6" stroke-width="1.5"/><path d="${vesica(top - 6, bot + 6, half + 8)}" fill="${deep}"/>`;
  const gem = (y, s) => `<path d="M${cx} ${y - 16 * s}L${cx + 11 * s} ${y}L${cx} ${y + 16 * s}L${cx - 11 * s} ${y}Z" fill="url(#dbtefx-nk-gem)" stroke="${iceLit}" stroke-width="1.2"/>`;

  return `<style>${CARD_ART_KEYFRAMES}
@keyframes dbtefx-nk-glint { 0%, 55% { transform: translateX(-420px); opacity: 0; } 60% { opacity: 1; } 85% { transform: translateX(420px); opacity: 1; } 90%, 100% { transform: translateX(420px); opacity: 0; } }
</style>
<defs>
<linearGradient id="dbtefx-nk-hall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, ice, 0.14)}"/><stop offset="0.65" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, ice, 0.1)}"/></linearGradient>
<radialGradient id="dbtefx-nk-aura" cx="0.5" cy="0.45" r="0.5"><stop offset="0" stop-color="${ice}" stop-opacity="0.3"/><stop offset="0.6" stop-color="${violet}" stop-opacity="0.08"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-nk-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${iceLit}" stop-opacity="0.18"/><stop offset="1" stop-color="${ice}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-nk-frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${iceLit}"/><stop offset="0.35" stop-color="${ice}"/><stop offset="0.6" stop-color="${iceMid}"/><stop offset="0.8" stop-color="${iceLit}"/><stop offset="1" stop-color="${iceDark}"/></linearGradient>
<linearGradient id="dbtefx-nk-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${iceLit}" stop-opacity="0.95"/><stop offset="0.5" stop-color="${ice}" stop-opacity="0.7"/><stop offset="1" stop-color="${iceDark}" stop-opacity="0.9"/></linearGradient>
<linearGradient id="dbtefx-nk-glass" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${mix(t.bg, violet, 0.3)}"/><stop offset="0.55" stop-color="${mix(t.bg, ice, 0.18)}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
<linearGradient id="dbtefx-nk-sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.45"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-nk-gem" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="${mix(violet, '#ffffff', 0.3)}"/><stop offset="1" stop-color="${mix(violet, t.bg, 0.4)}"/></radialGradient>
<linearGradient id="dbtefx-nk-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, ice, 0.2)}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
<linearGradient id="dbtefx-nk-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<mask id="dbtefx-nk-refl" maskUnits="userSpaceOnUse" x="0" y="760" width="${W}" height="200"><rect x="0" y="760" width="${W}" height="160" fill="url(#dbtefx-nk-fade)"/></mask>
<clipPath id="dbtefx-nk-clip"><path d="${glass}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-nk-hall)" fill-opacity="0.9"/>
<g fill="url(#dbtefx-nk-shaft)">${[980, 1120, 1290, 1420].map((x, i) => `<path d="M${x} -10h${30 + i * 8}L${x + 120 + i * 20} 780H${x + 40}Z" style="animation: dbtefx-pulse ${n1(7 + i * 1.6)}s ease-in-out ${n1(-i * 2.2)}s infinite;"/>`).join('')}</g>
${farPillars}
<path d="M-20 770H1620V${H + 20}H-20Z" fill="url(#dbtefx-nk-floor)"/>
<path d="M-20 770H1620" stroke="${iceLit}" stroke-opacity="0.35" stroke-width="1.5"/>
<!--mid-->
<ellipse cx="${cx}" cy="420" rx="420" ry="400" fill="url(#dbtefx-nk-aura)"/>
<g mask="url(#dbtefx-nk-refl)"><g transform="translate(0 ${n1(770 * 2)}) scale(1 -1)">${frame}<path d="${glass}" fill="url(#dbtefx-nk-glass)"/></g></g>
${blades}
${frame}
<path d="${glass}" fill="url(#dbtefx-nk-glass)"/>
<g clip-path="url(#dbtefx-nk-clip)">
${cardArt(t, { id: 'dbtefx-nk-hero', card: CARDS.trishula, x: cx - half, y: top, w: half * 2, h: bot - top, focus: [0.52, 0.4], zoom: 1.1, feather: 0.3, fade: 0.5, blend: 'normal', backdrop: mix(t.bg, ice, 0.2), backdropAmt: 0.6, opacity: 0.95, breathe: 14, tint: mix(ice, violet, 0.3), tintAmt: 0.15 })}
<path d="M${cx - 60} 60L${cx + 30} 60L${cx - 40} 780L${cx - 130} 780Z" fill="url(#dbtefx-nk-sheen)" style="animation: dbtefx-nk-glint 9s ease-in-out infinite;"/>
</g>
<path d="${glass}" fill="none" stroke="${iceLit}" stroke-opacity="0.8" stroke-width="2"/>
${gem(top - 30, 1.3)}${gem(bot + 26, 0.9)}
<path d="M${cx - 190} 770h380l-24 -20h-332Z" fill="${iceMid}"/><path d="M${cx - 166} 750h332l-30 -24h-272Z" fill="url(#dbtefx-nk-frame)"/>
${shards}
<!--near-->
${pillars}`;
};

export default scene;

// Particle systems (particles.js): snow falling through the hall, cold motes.
export const particles = [{ kind: 'flake', count: 70, colors: ['text', 'accent'], speed: 0.6 }, { kind: 'mote', count: 30, colors: ['accent2', 'accent'], speed: 0.5 }];
