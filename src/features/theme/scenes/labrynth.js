import { mix } from '../../../lib/color.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';
import { H, n1, polar, rng, W } from './kit.js';

// Labrynth: the great hall of the Silver Castle at night. A rose window of
// stained glass throws cold light down the nave; Lady Labrynth stands in a
// tall gothic window in the right third; crimson
// velvet swags frame the top; a checkered marble floor catches the glow.

const lancet = (cx, cy, r0, r1, deg, half) => {
  const [ax, ay] = polar(cx, cy, r0, deg - half);
  const [bx, by] = polar(cx, cy, r0, deg + half);
  const [sx, sy] = polar(cx, cy, r1 * 0.82, deg - half * 0.95);
  const [ex, ey] = polar(cx, cy, r1 * 0.82, deg + half * 0.95);
  const [tx, ty] = polar(cx, cy, r1, deg);
  const [c1x, c1y] = polar(cx, cy, r1 * 0.97, deg - half * 0.7);
  const [c2x, c2y] = polar(cx, cy, r1 * 0.97, deg + half * 0.7);
  return `M${ax} ${ay}L${sx} ${sy}Q${c1x} ${c1y} ${tx} ${ty}Q${c2x} ${c2y} ${ex} ${ey}L${bx} ${by}Z`;
};

const labrynth = (t) => {
  const rand = rng(23);
  const stone = mix(t.bg, t.text, 0.42);
  const glassCols = [t.opp, t.accent2, mix(t.text, t.accent2, 0.4), mix(t.opp, t.success, 0.35)].map((c) => mix(c, t.bg, 0.2));

  // Rose window: sixteen lancets, eight roundels, a six-petal heart.
  const RX = 920;
  const RY = 140;
  let glass = '';
  let lead = '';
  let thin = '';
  for (let i = 0; i < 16; i++) {
    const d = lancet(RX, RY, 104, 186, i * 22.5, 8.6);
    glass += `<path d="${d}" fill="${glassCols[i % 4]}" fill-opacity="${i % 2 ? 0.42 : 0.55}"/>`;
    lead += `<path d="${d}"/>`;
    const [m0x, m0y] = polar(RX, RY, 104, i * 22.5);
    const [m1x, m1y] = polar(RX, RY, 150, i * 22.5);
    thin += `M${m0x} ${m0y}L${m1x} ${m1y}`;
  }
  for (let i = 0; i < 8; i++) {
    const [x, y] = polar(RX, RY, 72, i * 45 + 11.25);
    glass += `<circle cx="${x}" cy="${y}" r="24" fill="${glassCols[(i + 1) % 4]}" fill-opacity="0.6"/>`;
    lead += `<circle cx="${x}" cy="${y}" r="24"/>`;
    for (let k = 0; k < 4; k++) {
      const [qx, qy] = polar(x, y, 8, k * 90 + i * 45);
      thin += `M${n1(qx + 8)} ${qy}A8 8 0 1 0 ${n1(qx - 8)} ${qy}A8 8 0 1 0 ${n1(qx + 8)} ${qy}`;
    }
  }
  let heart = '';
  for (let i = 0; i < 6; i++) {
    const [x, y] = polar(RX, RY, 20, i * 60);
    heart += `<circle cx="${x}" cy="${y}" r="17"/>`;
  }

  // Checkered marble floor receding to the nave's vanishing point.
  const VX = 920;
  const VY = 470;
  const fx = (k, y) => n1(VX + k * 150 * ((y - VY) / (H - VY)) * 1.4);
  const fy = (j) => n1(VY + (H + 60 - VY) * (0.62 + j * 0.065) ** 2.2);
  let tiles = '';
  for (let j = 0; j < 6; j++) {
    for (let k = -9; k < 9; k++) {
      if ((j + k) % 2) continue;
      const y0 = fy(j);
      const y1 = fy(j + 1);
      tiles += `M${fx(k, y0)} ${y0}L${fx(k + 1, y0)} ${y0}L${fx(k + 1, y1)} ${y1}L${fx(k, y1)} ${y1}Z`;
    }
  }

  // White marble columns framing the hall: base, fluted shaft, capital.
  const column = (x, w) => {
    let flutes = '';
    for (let i = 1; i < 5; i++) flutes += `M${n1(x - w / 2 + (w * i) / 5)} 120V${H - 70}`;
    return `<rect x="${x - w / 2}" y="110" width="${w}" height="${H - 170}" fill="url(#dbtefx-lb-marble)"/><path d="${flutes}" stroke="${mix(t.bg, t.text, 0.35)}" stroke-opacity="0.5" stroke-width="2"/><path d="M${x - w / 2 - 18} 110h${w + 36}l-10 -22h${-w - 16}Z" fill="url(#dbtefx-lb-marble)"/><rect x="${x - w / 2 - 24}" y="66" width="${w + 48}" height="22" fill="url(#dbtefx-lb-marble)"/><path d="M${x - w / 2 - 14} ${H - 60}h${w + 28}v60h${-w - 28}Z" fill="url(#dbtefx-lb-marble)"/><path d="M${x - w / 2 - 6} ${H - 70}h${w + 12}v10h${-w - 12}Z" fill="url(#dbtefx-lb-marble)"/>`;
  };

  // The labyrinth beyond: pointed arches receding down a corridor under the
  // rose window, each a little dimmer.
  let corridor = '';
  for (let k = 0; k < 6; k++) {
    const sc = 0.8 ** k;
    const w = n1(250 * sc);
    const h = n1(470 * sc);
    const by = n1(VY + 360 * sc);
    const x0 = n1(VX - w / 2);
    const x1 = n1(VX + w / 2);
    const d = `M${x0} ${by}V${n1(by - h + w * 0.6)}Q${x0} ${n1(by - h)} ${VX} ${n1(by - h - w * 0.15)}Q${x1} ${n1(by - h)} ${x1} ${n1(by - h + w * 0.6)}V${by}`;
    corridor += `<path d="${d}Z" fill="${mix(t.bg, t.text, 0.16 - k * 0.025)}"/><path d="${d}" fill="none" stroke="${mix(t.bg, t.text, 0.42)}" stroke-opacity="${n1(0.6 - k * 0.08)}" stroke-width="${n1(8 * sc + 1)}"/>`;
  }
  corridor += `<ellipse cx="${VX}" cy="${VY + 40}" rx="40" ry="70" fill="url(#dbtefx-lb-rose)"/>`;

  // Velvet swag: stacked festoons, each a crescent of fabric whose gradient
  // turns from shadow to a lit ridge, gathered at the ends.
  const swag = (x0, x1, sag) => {
    let f = '';
    for (let i = 0; i < 4; i++) {
      const top = sag * (0.2 + i * 0.28);
      const bot = sag * (0.62 + i * 0.3);
      const m = n1((x0 + x1) / 2);
      f += `<path d="M${x0} -10Q${m} ${n1(top * 2)} ${x1} -10Q${m} ${n1(bot * 2)} ${x0} -10Z" fill="url(#dbtefx-lb-fold)"/>`;
    }
    return `<path d="M${x0} -20H${x1}V-4Q${n1((x0 + x1) / 2)} ${n1(sag * 0.5)} ${x0} -4Z" fill="${mix(t.accent, '#000000', 0.6)}"/>${f}`;
  };
  const tassel = (x, y) => {
    let fringe = '';
    for (let i = -4; i <= 4; i++) fringe += `M${x + i * 2.4} ${y + 22}L${n1(x + i * 3.4)} ${y + 62}`;
    return `<path d="M${x} -20V${y}" stroke="${t.warning}" stroke-width="2.5"/><circle cx="${x}" cy="${y - 4}" r="9" fill="url(#dbtefx-lb-tassel)"/><path d="M${x - 7} ${y + 4}C${x - 14} ${y + 14} ${x + 14} ${y + 14} ${x + 7} ${y + 4}L${x + 12} ${y + 24}H${x - 12}Z" fill="url(#dbtefx-lb-tassel)"/><path d="${fringe}" stroke="${t.warning}" stroke-width="1.6" stroke-opacity="0.85"/>`;
  };

  let dust = '';
  for (let i = 0; i < 26; i++) {
    const u = rand();
    dust += `<circle cx="${n1(RX - 160 + u * 360 + rand() * 200)}" cy="${n1(260 + u * 520)}" r="${n1(0.8 + rand() * 1.6)}"/>`;
  }

  // Lady Labrynth of the Silver Castle in a tall gothic window at the right,
  // her own silver-and-glass hall blending into ours.
  const lady = cardArt(t, { id: 'dbtefx-lb-lady', card: CARDS.ladyLabrynth, x: 1352, y: 60, w: 260, h: 800, frame: 'arch', focus: [0.56, 0.44], zoom: 0.92, feather: 0.4, fade: 0.55, grade: 'brightness(0.86) contrast(1.08)', tint: mix(t.accent2, t.accent, 0.3), tintAmt: 0.12, backdrop: mix(t.bg, t.accent2, 0.2), backdropAmt: 0.8, glow: t.accent2, breathe: 16 });

  return `<style>${CARD_ART_KEYFRAMES}
@keyframes dbtefx-lb-shaft { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }</style>
<defs>
<linearGradient id="dbtefx-lb-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.text, 0.2)}"/><stop offset="0.55" stop-color="${mix(t.bg, t.text, 0.1)}"/><stop offset="1" stop-color="${mix(t.bg, t.text, 0.05)}"/></linearGradient>
<linearGradient id="dbtefx-lb-marble" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.text, t.bg, 0.55)}"/><stop offset="0.35" stop-color="${mix(t.text, '#ffffff', 0.3)}"/><stop offset="0.6" stop-color="${mix(t.text, t.bg, 0.25)}"/><stop offset="1" stop-color="${mix(t.text, t.bg, 0.7)}"/></linearGradient>
<radialGradient id="dbtefx-lb-rose" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(t.text, t.accent2, 0.4)}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-lb-shaftg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.2"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-lb-pier" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.4)}"/><stop offset="0.35" stop-color="${mix(t.bg, t.accent2, 0.16)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-lb-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.text}" stop-opacity="0.05"/><stop offset="1" stop-color="${t.text}" stop-opacity="0.2"/></linearGradient>
<radialGradient id="dbtefx-lb-pool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.warning}" stop-opacity="0.22"/><stop offset="1" stop-color="${t.warning}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-lb-wall)"/>
<path d="M${VX - 130} ${H}V420Q${VX - 130} 300 ${VX} 260Q${VX + 130} 300 ${VX + 130} 420V${H}Z" fill="${mix(t.bg, '#000000', 0.25)}" opacity="0.7"/>
<circle cx="${RX}" cy="${RY}" r="330" fill="url(#dbtefx-lb-rose)"/>
<g style="animation: dbtefx-lb-shaft 11s ease-in-out infinite;"><path d="M${RX - 100} 200L${RX + 60} 200L${RX + 340} ${H}L${RX - 300} ${H}Z" fill="url(#dbtefx-lb-shaftg)"/><path d="M${RX - 40} 200L${RX + 20} 200L${RX + 160} ${H}L${RX - 120} ${H}Z" fill="url(#dbtefx-lb-shaftg)"/></g>
<g fill="${t.accent2}" fill-opacity="0.5">${dust}</g>
<path d="${tiles}" fill="url(#dbtefx-lb-floor)"/>
${corridor}
<ellipse cx="1440" cy="${H - 40}" rx="260" ry="64" fill="url(#dbtefx-lb-pool)"/>
${column(196, 64)}${column(1585, 64)}
<!--mid-->
<defs>
<radialGradient id="dbtefx-lb-glass" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="0.6" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-lb-warm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.warning}" stop-opacity="0.2"/><stop offset="1" stop-color="${t.warning}" stop-opacity="0"/></radialGradient>
</defs>
<g class="dbtefx-lb-rosewin">
<circle cx="${RX}" cy="${RY}" r="200" fill="${mix(t.bg, '#000000', 0.35)}"/>
${glass}
<circle cx="${RX}" cy="${RY}" r="190" fill="url(#dbtefx-lb-glass)" style="animation: dbtefx-lb-shaft 9s ease-in-out infinite;"/>
<path d="${thin}" fill="none" stroke="${mix(t.bg, '#000000', 0.3)}" stroke-width="2"/>
<g fill="none" stroke="${stone}" stroke-width="5" stroke-linejoin="round">${lead}<circle cx="${RX}" cy="${RY}" r="104"/><circle cx="${RX}" cy="${RY}" r="44"/></g>
<g fill="${mix(t.text, t.accent2, 0.3)}" fill-opacity="0.7" stroke="${stone}" stroke-width="4">${heart}</g>
<circle cx="${RX}" cy="${RY}" r="200" fill="none" stroke="${stone}" stroke-width="12"/>
<circle cx="${RX}" cy="${RY}" r="214" fill="none" stroke="${stone}" stroke-opacity="0.6" stroke-width="4"/>
</g>
<circle cx="1480" cy="380" r="280" fill="url(#dbtefx-lb-warm)"/>
${lady}
<!--near-->
<defs>
<linearGradient id="dbtefx-lb-fold" x1="0" y1="0" x2="0" y2="1"><stop offset="0.4" stop-color="${mix(t.accent, '#000000', 0.7)}"/><stop offset="0.85" stop-color="${mix(t.accent, '#000000', 0.25)}"/><stop offset="0.95" stop-color="${mix(t.accent, '#ffffff', 0.15)}"/><stop offset="1" stop-color="${mix(t.accent, '#000000', 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-lb-tassel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.warning, '#000000', 0.35)}"/><stop offset="0.5" stop-color="${t.warning}"/><stop offset="1" stop-color="${mix(t.warning, '#000000', 0.45)}"/></linearGradient>
</defs>
${swag(-40, 560, 92)}${swag(1180, 1660, 74)}
<g class="dbtefx-lb-tassels">${tassel(560, 120)}${tassel(1180, 104)}</g>`;
};

export default labrynth;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 50, colors: ['accent2', 'warning'] },
  { kind: 'petal', count: 12, colors: ['accent'], speed: 0.6 },
];
