import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';

// Yubel: the loving defender stands before a gothic rose window on a
// nightmare night, arms crossed, back-lit so the body is a dark silhouette
// edged in rose on one side and teal on the other (Yubel's two-coloured
// eyes). The great membrane wings spread behind, gold claws at the wrists,
// and slowly breathe. Only the third eye is lit. A castle's spires stand
// below; thorned roses climb in from the corner and petals fall.
const yubel = (t) => {
  const rand = rng(23);
  const rose = t.accent;
  const roseDeep = mix(t.accent, t.bg, 0.55);
  const teal = t.accent2;
  const gold = t.warning;
  const goldLit = mix(t.warning, '#ffffff', 0.4);
  const ink = mix(t.bg, '#000000', 0.5);
  const silver = mix(t.text, t.muted, 0.25);
  const mauve = mix(rose, teal, 0.32);
  const cx = 1230;

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

  // One membrane wing: shoulder, elbow and wrist along the leading edge,
  // four curved finger bones fanning to the tips, the membrane scalloped
  // deep between them, a gold claw hooking up from the wrist.
  const wing = (S, E, Wr, tips, hip, dir) => {
    const side = dir < 0 ? 'l' : 'r';
    const arm = `M${S[0]} ${S[1]}Q${n1((S[0] + E[0]) / 2)} ${n1(Math.min(S[1], E[1]) - 14)} ${E[0]} ${E[1]}Q${n1((E[0] + Wr[0]) / 2 + dir * 6)} ${n1((E[1] + Wr[1]) / 2 - 10)} ${Wr[0]} ${Wr[1]}`;
    let d = `${arm}L${tips[0][0]} ${tips[0][1]}`;
    const pts = [...tips, hip];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i];
      const [mx, my] = [(ax + bx) / 2, (ay + by) / 2];
      d += `Q${n1(mx + (Wr[0] - mx) * 0.3)} ${n1(my + (Wr[1] - my) * 0.3)} ${bx} ${by}`;
    }
    d += `Q${n1((hip[0] + S[0]) / 2 + dir * 10)} ${n1((hip[1] + S[1]) / 2)} ${S[0]} ${S[1]}Z`;
    const bones = tips.map(([tx, ty], i) => {
      const [mx, my] = [(Wr[0] + tx) / 2, (Wr[1] + ty) / 2];
      const k = i === 0 ? 0 : 0.1;
      return `M${Wr[0]} ${Wr[1]}Q${n1(mx - (ty - Wr[1]) * k * dir)} ${n1(my + (tx - Wr[0]) * k * dir)} ${tx} ${ty}`;
    }).join('');
    const [c1x, c1y] = [Wr[0], Wr[1] - 4];
    const claw = `<path d="M${n1(c1x - dir * 9)} ${n1(c1y + 6)}C${n1(c1x - dir * 8)} ${n1(c1y - 30)} ${n1(c1x + dir * 12)} ${n1(c1y - 56)} ${n1(c1x + dir * 34)} ${n1(c1y - 66)}C${n1(c1x + dir * 16)} ${n1(c1y - 48)} ${n1(c1x + dir * 9)} ${n1(c1y - 24)} ${n1(c1x + dir * 11)} ${n1(c1y + 4)}Z" fill="url(#dbtefx-yb-gold)" stroke="${mix(gold, t.bg, 0.5)}" stroke-width="1"/>`;
    const tipClaws = tips.slice(1).map(([tx, ty]) => `<path d="M${tx} ${ty}l${dir * 4} 9l${dir * -8} -3Z" fill="${gold}"/>`).join('');
    return `<g style="transform-origin: ${S[0]}px ${S[1]}px; animation: dbtefx-yb-wing${side} 8s ease-in-out infinite;"><path d="${d}" fill="url(#dbtefx-yb-membrane${side})" stroke="${dir < 0 ? rose : teal}" stroke-opacity="0.6" stroke-width="1.6"/><path d="${bones}" fill="none" stroke="${ink}" stroke-width="4.5" stroke-linecap="round"/><path d="${bones}" fill="none" stroke="${dir < 0 ? rose : teal}" stroke-opacity="0.35" stroke-width="1.2"/><path d="${arm}" fill="none" stroke="${ink}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="${arm}" fill="none" stroke="${dir < 0 ? rose : teal}" stroke-opacity="0.55" stroke-width="2"/>${claw}${tipClaws}</g>`;
  };
  const wings =
    wing([1196, 334], [1134, 268], [1086, 178], [[1046, 118], [1034, 262], [1064, 404], [1134, 520]], [1204, 470], -1) +
    wing([1264, 334], [1356, 258], [1424, 160], [[1506, 100], [1528, 262], [1494, 420], [1400, 548]], [1256, 470], 1);

  // Figure in local units (head top at 0, centre line x 0), drawn as the
  // left half and mirrored. About eight heads tall.
  const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${n1(-x)} ${y}`);
  const both = (d) => d + mirror(d);
  const half = {
    torso: 'M0 82H-10C-14 90 -34 90 -50 96C-58 100 -56 118 -46 132C-42 160 -30 190 -26 212C-30 232 -42 250 -42 268L0 282Z',
    leg: 'M-42 266C-54 310 -46 352 -34 384C-30 410 -30 444 -24 480C-20 496 -20 508 -24 518L-36 534L-24 530L-20 544L-12 530L-4 540L-5 520C-6 498 -8 470 -8 440C-8 410 -6 380 -4 330L0 288Z',
    arm: 'M-46 98C-62 104 -66 140 -62 190L-44 194C-44 160 -40 130 -36 110Z',
    pauldron: 'M-60 108C-64 94 -54 84 -38 86C-30 90 -28 98 -32 106C-40 112 -52 114 -60 108Z',
    spike: 'M-48 92C-62 78 -66 58 -60 38C-58 58 -50 74 -38 86Z',
    knee: 'M-36 372C-30 364 -18 364 -10 372L-12 392C-18 388 -28 388 -34 392Z',
  };
  // The mane: one wild mass per side, long spikes swept back and down to
  // the shoulders, dark against the window with a coloured rim.
  const mane = (dir) => {
    const r = rng(dir > 0 ? 5 : 6);
    let d = 'M0 -4';
    const n = 9;
    for (let i = 0; i <= n; i++) {
      const a = -92 + dir * (6 + (i * 190) / n);
      if (i % 2) {
        d += `L${polar(0, 30, 36 + r() * 6, a).join(' ')}`;
      } else {
        const len = 66 + r() * 26 + i * 10;
        const sweep = dir * (14 + i * 3);
        d += `C${polar(0, 30, len * 0.55, a - dir * 14).join(' ')} ${polar(0, 30, len * 0.85, a + sweep * 0.4).join(' ')} ${polar(0, 30, len, a + sweep).join(' ')}`;
        d += `Q${polar(0, 30, len * 0.6, a + dir * 20).join(' ')} `;
        d = d.trimEnd();
        d += ` ${polar(0, 30, 44, a + dir * 22).join(' ')}`;
      }
    }
    return `${d}L${dir * 40} 128L${dir * 8} 74Z`;
  };
  const hairL = mane(-1);
  const hairR = mane(1);
  const face = 'M0 0C16 0 24 14 24 30C24 46 14 60 0 66C-14 60 -24 46 -24 30C-24 14 -16 0 0 0Z';
  const figure = `<g transform="translate(${cx} 230)">
<path d="${hairL}" fill="url(#dbtefx-yb-hairl)" stroke="${silver}" stroke-opacity="0.55" stroke-width="1.6" stroke-linejoin="round"/><path d="${hairR}" fill="url(#dbtefx-yb-hairr)" stroke="${mauve}" stroke-opacity="0.85" stroke-width="1.6" stroke-linejoin="round"/>
<path d="${both(half.leg)}" fill="url(#dbtefx-yb-body)"/>
<path d="${both('M-36 534l-5 6l7 -3ZM-20 544l-1 7l4 -6ZM-4 540l2 7l1 -7Z')}" fill="${gold}"/>
<path d="${both(half.knee)}" fill="${ink}" stroke="${gold}" stroke-opacity="0.6" stroke-width="1.2"/>
<path d="${both(half.torso)}" fill="url(#dbtefx-yb-body)"/>
<path d="M-46 132C-42 160 -30 190 -26 212M-42 268C-46 310 -40 350 -32 384C-30 410 -30 444 -22 480" fill="none" stroke="${rose}" stroke-opacity="0.75" stroke-width="2"/>
<path d="M46 132C42 160 30 190 26 212M42 268C46 310 40 350 32 384C30 410 30 444 22 480" fill="none" stroke="${teal}" stroke-opacity="0.7" stroke-width="2"/>
<path d="M0 176V214" fill="none" stroke="${roseDeep}" stroke-width="1.4"/>
<path d="${half.arm}" fill="url(#dbtefx-yb-body)" stroke="${rose}" stroke-opacity="0.5" stroke-width="1.4"/>
<path d="${mirror(half.arm)}" fill="url(#dbtefx-yb-body)" stroke="${teal}" stroke-opacity="0.45" stroke-width="1.4"/>
<path d="M-64 182C-30 172 10 158 40 147L42 159C14 172 -24 194 -54 204Z" fill="url(#dbtefx-yb-arm)"/>
<path d="M64 182C30 176 -8 164 -38 155L-40 167C-8 178 28 196 54 204Z" fill="url(#dbtefx-yb-arm)" stroke="${mauve}" stroke-opacity="0.4" stroke-width="1"/>
<path d="M40 148l12 -6l-5 10l9 2l-14 6ZM-38 156l-12 -6l5 10l-9 2l14 6Z" fill="${gold}"/>
<path d="${both(half.pauldron)}" fill="${ink}" stroke="${gold}" stroke-opacity="0.7" stroke-width="1.4"/>
<path d="${both(half.spike)}" fill="url(#dbtefx-yb-gold)"/>
<path d="M-9 60h18v26h-18Z" fill="${ink}"/>
<path d="${face}" fill="url(#dbtefx-yb-face)"/>
<path d="M-24 30C-24 46 -14 60 0 66" fill="none" stroke="${rose}" stroke-opacity="0.75" stroke-width="2"/><path d="M24 30C24 46 14 60 0 66" fill="none" stroke="${teal}" stroke-opacity="0.7" stroke-width="2"/>
<path d="M-2 2C-16 4 -26 16 -26 34C-22 24 -16 16 -6 14Z" fill="url(#dbtefx-yb-hairl)"/><path d="M2 2C16 4 26 16 26 34C22 24 16 16 6 14Z" fill="url(#dbtefx-yb-hairr)"/>
<path d="M0 10C5 16 6 22 0 30C-6 22 -5 16 0 10Z" fill="${goldLit}" style="animation: dbtefx-pulse 4.5s ease-in-out infinite;"/>
<path d="M0 14V26" stroke="${ink}" stroke-width="1.6"/>
</g>`;

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

  return `<style>@keyframes dbtefx-yb-wingl { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
@keyframes dbtefx-yb-wingr { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-5deg); } }</style>
<defs>
<linearGradient id="dbtefx-yb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ink}"/><stop offset="0.6" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, rose, 0.16)}"/></linearGradient>
<radialGradient id="dbtefx-yb-halo" cx="${wx}" cy="${wy}" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${mix(rose, '#ffffff', 0.2)}" stop-opacity="0.55"/><stop offset="0.35" stop-color="${rose}" stop-opacity="0.22"/><stop offset="1" stop-color="${rose}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-yb-chill" cx="0.15" cy="1" r="0.7"><stop offset="0" stop-color="${teal}" stop-opacity="0.12"/><stop offset="1" stop-color="${teal}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-yb-membranel" cx="1196" cy="334" r="360" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${ink}" stop-opacity="0.95"/><stop offset="0.6" stop-color="${mix(t.raised, rose, 0.25)}" stop-opacity="0.9"/><stop offset="1" stop-color="${mix(rose, t.bg, 0.3)}" stop-opacity="0.8"/></radialGradient>
<radialGradient id="dbtefx-yb-membraner" cx="1264" cy="334" r="360" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${ink}" stop-opacity="0.95"/><stop offset="0.6" stop-color="${mix(t.raised, mauve, 0.3)}" stop-opacity="0.9"/><stop offset="1" stop-color="${mix(mauve, t.bg, 0.35)}" stop-opacity="0.8"/></radialGradient>
<linearGradient id="dbtefx-yb-body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(ink, rose, 0.22)}"/><stop offset="0.3" stop-color="${ink}"/><stop offset="0.7" stop-color="${ink}"/><stop offset="1" stop-color="${mix(ink, teal, 0.2)}"/></linearGradient>
<linearGradient id="dbtefx-yb-arm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(ink, mauve, 0.3)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-yb-hairl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(ink, silver, 0.22)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-yb-hairr" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(ink, mauve, 0.4)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-yb-face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(ink, mauve, 0.25)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-yb-gold" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(gold, t.bg, 0.4)}"/><stop offset="0.6" stop-color="${gold}"/><stop offset="1" stop-color="${goldLit}"/></linearGradient>
<radialGradient id="dbtefx-yb-rose" cx="0.45" cy="0.4" r="0.65"><stop offset="0" stop-color="${roseDeep}"/><stop offset="0.55" stop-color="${rose}"/><stop offset="1" stop-color="${mix(rose, t.bg, 0.4)}"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-yb-sky)"/>
<rect width="1600" height="900" fill="url(#dbtefx-yb-chill)"/>
<circle cx="${wx}" cy="${wy}" r="420" fill="url(#dbtefx-yb-halo)" style="animation: dbtefx-pulse 9s ease-in-out infinite;"/>
${window}
<path d="${skyline}" fill="${mix(t.bg, t.raised, 0.5)}"/>
<g fill="${gold}" fill-opacity="0.7">${windows}</g>
<!--mid-->
<g transform="translate(1230 450) scale(0.9) translate(-1230 -450)">${wings}
${figure}</g>
<!--near-->
${vines}`;
};

export default yubel;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'petal', count: 26, colors: ['accent'], outline: 'bg' },
  { kind: 'mote', count: 30, colors: ['accent2', 'warning'], rise: true },
];
