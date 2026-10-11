import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Yubel: the loving defender stands before a gothic rose window on a
// nightmare night: the real card artwork (loaded live from DuelingBook,
// cardart.js), graded rose and feathered into the window's glow, wings
// spread. A castle's spires stand below; thorned roses climb in from the
// corner and petals fall. Offline the window, glow and roses still stand.
const yubel = (t) => {
  const rand = rng(23);
  const rose = t.accent;
  const roseDeep = mix(t.accent, t.bg, 0.55);
  const teal = t.accent2;
  const gold = t.warning;
  const ink = mix(t.bg, '#000000', 0.5);
  const cx = 1320;

  // Gothic rose window behind the figure: outer ring, twelve lobed petals,
  // an inner quatrefoil ring, all slowly turning.
  const [wx, wy] = [cx, 322];
  let lobes = '';
  let spokes = '';
  for (let i = 0; i < 12; i++) {
    const a = i * 30 - 90;
    const [lx, ly] = polar(wx, wy, 196, a);
    const [px, py] = polar(wx, wy, 132, a);
    const [qx, qy] = polar(wx, wy, 250, a + 15);
    lobes += `<circle cx="${lx}" cy="${ly}" r="46"/><path d="M${px} ${py}Q${polar(wx, wy, 170, a - 8).join(' ')} ${lx} ${n1(ly)}Q${polar(wx, wy, 170, a + 8).join(' ')} ${px} ${py}Z"/>`;
    spokes += `M${polar(wx, wy, 118, a + 15).join(' ')}L${qx} ${qy}`;
  }
  const window = `<g style="transform-origin: ${wx}px ${wy}px; animation: dbtefx-spin 260s linear infinite;" fill="none">
<circle cx="${wx}" cy="${wy}" r="262" stroke="${rose}" stroke-opacity="0.32" stroke-width="5"/>
<circle cx="${wx}" cy="${wy}" r="250" stroke="${gold}" stroke-opacity="0.22" stroke-width="1.5"/>
<g stroke="${rose}" stroke-opacity="0.24" stroke-width="2.5">${lobes}</g>
<path d="${spokes}" stroke="${gold}" stroke-opacity="0.2" stroke-width="2"/>
<circle cx="${wx}" cy="${wy}" r="118" stroke="${teal}" stroke-opacity="0.28" stroke-width="3"/>
<circle cx="${wx}" cy="${wy}" r="62" stroke="${rose}" stroke-opacity="0.3" stroke-width="2"/>
</g>`;

  // Castle and cathedral spires along the horizon.
  const spire = (x, w, h, base) => `M${n1(x - w)} ${base}V${n1(base - h)}L${x} ${n1(base - h - w * 3.2)}L${n1(x + w)} ${n1(base - h)}V${base}Z`;
  let skyline = '';
  let windows = '';
  [[960, 16, 120], [1010, 24, 180], [1080, 14, 90], [1150, 30, 240], [1230, 18, 130], [1330, 22, 170], [1400, 34, 280], [1480, 16, 120], [1540, 26, 200], [1600, 18, 140], [40, 22, 110], [120, 16, 70], [220, 26, 150], [300, 14, 80]].forEach(([x, w, h]) => {
    skyline += spire(x, w, h, 900);
    if (h > 150) windows += `<path d="M${x - 4} ${900 - h + 40}v-12a4 4 0 0 1 8 0v12Z" style="animation: dbtefx-pulse ${n1(5 + rand() * 4)}s ease-in-out ${n1(-rand() * 6)}s infinite;"/>`;
  });

  // Yubel: the real card artwork, wings spread before the rose window.
  const figure = cardArt(t, { id: 'dbtefx-yb-hero', card: CARDS.yubel, x: cx - 210, y: 60, w: 420, h: 800, focus: [0.5, 0.45], zoom: 0.68, blend: 'normal', feather: 0.7, fade: 0.9, grade: 'contrast(1.2) saturate(0.85)', tint: rose, tintAmt: 0.22, backdrop: ink, backdropAmt: 0.4, glow: rose, breathe: 16 });

  // Thorned rose vines climbing in from the bottom-right corner.
  // A rose seen from above: five cupped outer petals, three inner ones
  // turned against them, a tight bud; shaded from the deep rose out.
  const petal = (x, y, r, a, len, wid) => {
    const [tx, ty] = polar(x, y, len, a);
    const [lx, ly] = polar(x, y, len * 0.8, a - wid);
    const [rx, ry] = polar(x, y, len * 0.8, a + wid);
    return `M${x} ${y}Q${lx} ${ly} ${tx} ${ty}Q${rx} ${ry} ${x} ${y}Z`;
  };
  // A rose: nested crescent petals wrapping round a spiral bud, each turned
  // further than the last, alternating light and shadow.
  const bloom = (x, y, r, a) => {
    let petals = '';
    for (let i = 0; i < 6; i++) {
      const R = r * (1 - i * 0.14);
      const an = a + i * 74;
      const [p1x, p1y] = polar(x, y, R, an);
      const [p2x, p2y] = polar(x, y, R, an + 220);
      petals += `<path d="M${p1x} ${p1y}A${n1(R)} ${n1(R)} 0 1 1 ${p2x} ${p2y}A${n1(R * 0.78)} ${n1(R * 0.78)} 0 0 0 ${p1x} ${p1y}Z" fill="${i % 2 ? roseDeep : 'url(#dbtefx-yb-rose)'}" stroke="${ink}" stroke-width="1.1"/>`;
    }
    return `<circle cx="${x}" cy="${y}" r="${n1(r * 1.02)}" fill="${roseDeep}" stroke="${ink}" stroke-width="1.4"/>${petals}<circle cx="${x}" cy="${y}" r="${n1(r * 0.14)}" fill="${mix(roseDeep, ink, 0.4)}"/>`;
  };
  const leaf = (x, y, a, l) => `<path d="${petal(x, y, l, a, l, 22)}" fill="${mix(ink, teal, 0.25)}" stroke="${ink}" stroke-width="1"/>`;
  const vine = (d) => `<path d="${d}" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${roseDeep}" stroke-width="2.4" stroke-linecap="round"/>`;
  const thorns = [[1430, 812, -40], [1478, 742, 20], [1536, 700, -60], [1350, 866, 30], [1572, 640, 10], [60, 838, -30], [150, 860, 40]]
    .map(([x, y, a]) => `<path d="M${x} ${y}l${polar(0, 0, 14, a - 90).join(' ')}l${polar(0, 0, 8, a + 30).join(' ')}Z" fill="${ink}"/>`)
    .join('');
  const vines = `<g style="transform-origin: 1600px 900px; animation: dbtefx-reed 12s ease-in-out infinite;">
${vine('M1640 900C1560 860 1470 860 1400 820C1350 790 1330 760 1336 730')}
${vine('M1640 820C1580 760 1540 700 1560 620C1570 580 1600 560 1620 540')}
${vine('M1520 900C1500 860 1480 800 1490 740')}
${thorns}
${leaf(1360, 770, 160, 34)}${leaf(1520, 690, -150, 30)}${leaf(1470, 830, 200, 28)}
${bloom(1336, 724, 32, 10)}${bloom(1494, 734, 24, 40)}${bloom(1566, 612, 28, 20)}
</g>
<g style="transform-origin: 0px 900px; animation: dbtefx-reed 14s ease-in-out -4s infinite;">
${vine('M-40 900C40 880 120 870 200 850C240 840 260 820 262 800')}
${leaf(236, 818, 200, 26)}${bloom(262, 794, 24, 30)}
</g>`;

  return `<style>${CARD_ART_KEYFRAMES}</style>
<defs>
<linearGradient id="dbtefx-yb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ink}"/><stop offset="0.6" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, rose, 0.16)}"/></linearGradient>
<radialGradient id="dbtefx-yb-halo" cx="${wx}" cy="${wy}" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${mix(rose, '#ffffff', 0.2)}" stop-opacity="0.55"/><stop offset="0.35" stop-color="${rose}" stop-opacity="0.22"/><stop offset="1" stop-color="${rose}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-yb-chill" cx="0.15" cy="1" r="0.7"><stop offset="0" stop-color="${teal}" stop-opacity="0.12"/><stop offset="1" stop-color="${teal}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-yb-rose" cx="0.45" cy="0.4" r="0.65"><stop offset="0" stop-color="${roseDeep}"/><stop offset="0.55" stop-color="${rose}"/><stop offset="1" stop-color="${mix(rose, t.bg, 0.4)}"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-yb-sky)"/>
<rect width="1600" height="900" fill="url(#dbtefx-yb-chill)"/>
<circle cx="${wx}" cy="${wy}" r="420" fill="url(#dbtefx-yb-halo)" style="animation: dbtefx-pulse 9s ease-in-out infinite;"/>
${window}
<path d="${skyline}" fill="${mix(t.bg, t.raised, 0.5)}"/>
<g fill="${gold}" fill-opacity="0.7">${windows}</g>
<!--mid-->
${figure}
<!--near-->
${vines}`;
};

export default yubel;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'petal', count: 26, colors: ['accent'], outline: 'bg' },
  { kind: 'mote', count: 30, colors: ['accent2', 'warning'], rise: true },
];
