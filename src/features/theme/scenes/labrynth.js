import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Labrynth: the great hall of the Silver Castle at night. A rose window of
// stained glass throws cold light down the nave; a silver chandelier with
// crystal drops and real candle flames hangs in the right third; crimson
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
  const stone = mix(t.bg, t.accent2, 0.3);
  const silver = mix(t.accent2, '#ffffff', 0.35);
  const glassCols = [t.accent, t.opp, t.accent2, mix(t.accent, t.opp, 0.5)].map((c) => mix(c, t.bg, 0.2));

  // Rose window: sixteen lancets, eight roundels, a six-petal heart.
  const RX = 800;
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

  // Chandelier: arms on an ellipse (front ones lower and brighter).
  const CX = 1250;
  const CY = 330;
  const flameAt = [];
  const arm = (a, rx, ry, drop, lift) => {
    const x = n1(CX + Math.cos(a) * rx);
    const y = n1(CY + drop + Math.sin(a) * ry);
    const mx = n1(CX + Math.cos(a) * rx * 0.55);
    const front = Math.sin(a) > 0;
    flameAt.push([x, y - lift, front]);
    return {
      front,
      d: `M${CX} ${CY + drop * 0.3}C${mx} ${n1(y + 46)} ${n1(x - Math.cos(a) * 10)} ${n1(y + 20)} ${x} ${n1(y - lift + 14)}`,
      x,
      y: n1(y - lift),
    };
  };
  const arms = [];
  for (let i = 0; i < 8; i++) arms.push(arm(((i + 0.5) / 8) * Math.PI * 2, 172, 32, 36, 18));
  for (let i = 0; i < 5; i++) arms.push(arm(((i + 0.25) / 5) * Math.PI * 2, 112, 20, -40, 16));
  const cup = (x, y) =>
    `<path d="M${n1(x - 13)} ${n1(y + 14)}h26l-6 6h-14Z"/><rect x="${n1(x - 5)}" y="${n1(y - 34)}" width="10" height="48" rx="2" fill="url(#dbtefx-lb-wax)"/>`;
  const armPaths = (front) => arms.filter((a) => a.front === front).map((a) => `<path d="${a.d}"/>`).join('');
  const cups = (front) => arms.filter((a) => a.front === front).map((a) => cup(a.x, a.y)).join('');
  // Crystal swags: strings of drops between neighbouring lower arms.
  let crystals = '';
  for (let i = 0; i < 8; i++) {
    const a = arms[i];
    const b = arms[(i + 1) % 8];
    if (!a.front && !b.front) continue;
    const mx = n1((a.x + b.x) / 2);
    const my = n1(Math.max(a.y, b.y) + 44);
    crystals += `<path d="M${a.x} ${n1(a.y + 16)}Q${mx} ${n1(my + 18)} ${b.x} ${n1(b.y + 16)}" fill="none" stroke="${silver}" stroke-opacity="0.5" stroke-dasharray="2 5"/>`;
    crystals += `<path d="M${mx} ${my}l6 12l-6 16l-6 -16Z" fill="url(#dbtefx-lb-crystal)"/>`;
    if (a.front) crystals += `<path d="M${a.x} ${n1(a.y + 20)}v14" stroke="${silver}" stroke-opacity="0.5"/><path d="M${a.x} ${n1(a.y + 34)}l5 9l-5 13l-5 -13Z" fill="url(#dbtefx-lb-crystal)"/>`;
  }
  const flames = flameAt
    .map(([x, y, front], i) => {
      const fy = n1(y - 34);
      const s = front ? 1.25 : 1;
      return `<g style="transform-origin: ${x}px ${fy}px; animation: dbtefx-lb-flame ${n1(1.6 + (i % 5) * 0.37)}s ease-in-out ${n1(-i * 0.41)}s infinite;" opacity="${front ? 1 : 0.75}"><circle cx="${x}" cy="${n1(fy - 10)}" r="${n1(46 * s)}" fill="url(#dbtefx-lb-halo)"/><path d="M${x} ${n1(fy - 26 * s)}C${n1(x + 8 * s)} ${n1(fy - 12 * s)} ${n1(x + 7 * s)} ${fy} ${x} ${fy}C${n1(x - 7 * s)} ${fy} ${n1(x - 8 * s)} ${n1(fy - 12 * s)} ${x} ${n1(fy - 26 * s)}Z" fill="url(#dbtefx-lb-flame)"/></g>`;
    })
    .join('');

  // Checkered marble floor receding to the nave's vanishing point.
  const VX = 800;
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

  // Gothic nave piers: clustered shafts rising into the dark on both sides.
  const pier = (x, w) => {
    let s = `<rect x="${x - w / 2}" y="0" width="${w}" height="${H}" fill="url(#dbtefx-lb-pier)"/>`;
    for (let i = 1; i < 4; i++) s += `<path d="M${n1(x - w / 2 + (w * i) / 4)} 0V${H}" stroke="#000000" stroke-opacity="0.35" stroke-width="2"/>`;
    return s;
  };

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
    dust += `<circle cx="${n1(640 + u * 360 + rand() * 200)}" cy="${n1(260 + u * 520)}" r="${n1(0.8 + rand() * 1.6)}"/>`;
  }

  return `<style>@keyframes dbtefx-lb-flame { 0%, 100% { transform: scale(1, 1); opacity: 0.92; } 35% { transform: scale(0.94, 1.1); opacity: 1; } 70% { transform: scale(1.05, 0.93); opacity: 0.85; } }
@keyframes dbtefx-lb-sway { 0%, 100% { transform: rotate(-0.6deg); } 50% { transform: rotate(0.6deg); } }
@keyframes dbtefx-lb-shaft { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }</style>
<defs>
<linearGradient id="dbtefx-lb-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.accent2, 0.1)}"/><stop offset="0.6" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.12)}"/></linearGradient>
<radialGradient id="dbtefx-lb-rose" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-lb-shaftg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.2"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-lb-pier" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.4)}"/><stop offset="0.35" stop-color="${mix(t.bg, t.accent2, 0.16)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-lb-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.04"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0.16"/></linearGradient>
<radialGradient id="dbtefx-lb-pool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.warning}" stop-opacity="0.22"/><stop offset="1" stop-color="${t.warning}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-lb-wall)"/>
<path d="M${VX - 60} ${VY}V160Q${VX - 60} 90 ${VX} 60Q${VX + 60} 90 ${VX + 60} 160V${VY}Z" fill="${mix(t.bg, '#000000', 0.3)}" opacity="0.6"/>
<circle cx="${RX}" cy="${RY}" r="330" fill="url(#dbtefx-lb-rose)"/>
<g style="animation: dbtefx-lb-shaft 11s ease-in-out infinite;"><path d="M700 200L860 200L1240 ${H}L520 ${H}Z" fill="url(#dbtefx-lb-shaftg)"/><path d="M760 200L820 200L980 ${H}L700 ${H}Z" fill="url(#dbtefx-lb-shaftg)"/></g>
<g fill="${t.accent2}" fill-opacity="0.5">${dust}</g>
<path d="${tiles}" fill="url(#dbtefx-lb-floor)"/>
<ellipse cx="${CX}" cy="${H - 40}" rx="300" ry="70" fill="url(#dbtefx-lb-pool)"/>
<g opacity="0.85">${pier(120, 120)}${pier(1520, 130)}</g>
<!--mid-->
<defs>
<radialGradient id="dbtefx-lb-glass" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="0.6" stop-color="#ffffff" stop-opacity="0.06"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-lb-silver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.accent2, t.bg, 0.7)}"/><stop offset="0.35" stop-color="${mix(t.accent2, t.bg, 0.2)}"/><stop offset="0.5" stop-color="#ffffff"/><stop offset="0.65" stop-color="${mix(t.accent2, t.bg, 0.3)}"/><stop offset="1" stop-color="${mix(t.accent2, t.bg, 0.75)}"/></linearGradient>
<linearGradient id="dbtefx-lb-wax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.text, t.warning, 0.3)}"/><stop offset="0.5" stop-color="#ffffff"/><stop offset="1" stop-color="${mix(t.text, t.bg, 0.4)}"/></linearGradient>
<radialGradient id="dbtefx-lb-flame" cx="0.5" cy="0.72" r="0.6"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="${mix(t.warning, '#ffffff', 0.5)}"/><stop offset="0.75" stop-color="${t.warning}"/><stop offset="1" stop-color="${t.accent}"/></radialGradient>
<radialGradient id="dbtefx-lb-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.warning}" stop-opacity="0.5"/><stop offset="0.35" stop-color="${t.warning}" stop-opacity="0.16"/><stop offset="1" stop-color="${t.warning}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-lb-crystal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="${t.accent2}" stop-opacity="0.7"/><stop offset="1" stop-color="${t.opp}" stop-opacity="0.5"/></linearGradient>
<radialGradient id="dbtefx-lb-warm" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.warning}" stop-opacity="0.2"/><stop offset="1" stop-color="${t.warning}" stop-opacity="0"/></radialGradient>
</defs>
<g>
<circle cx="${RX}" cy="${RY}" r="200" fill="${mix(t.bg, '#000000', 0.35)}"/>
${glass}
<circle cx="${RX}" cy="${RY}" r="190" fill="url(#dbtefx-lb-glass)" style="animation: dbtefx-lb-shaft 9s ease-in-out infinite;"/>
<path d="${thin}" fill="none" stroke="${mix(t.bg, '#000000', 0.3)}" stroke-width="2"/>
<g fill="none" stroke="${stone}" stroke-width="5" stroke-linejoin="round">${lead}<circle cx="${RX}" cy="${RY}" r="104"/><circle cx="${RX}" cy="${RY}" r="44"/></g>
<g fill="${t.accent}" fill-opacity="0.7" stroke="${stone}" stroke-width="4">${heart}</g>
<circle cx="${RX}" cy="${RY}" r="200" fill="none" stroke="${stone}" stroke-width="12"/>
<circle cx="${RX}" cy="${RY}" r="214" fill="none" stroke="${stone}" stroke-opacity="0.6" stroke-width="4"/>
</g>
<circle cx="${CX}" cy="${CY - 20}" r="320" fill="url(#dbtefx-lb-warm)"/>
<g style="transform-origin: ${CX}px -40px; animation: dbtefx-lb-sway 16s ease-in-out infinite;">
<path d="M${CX} -40V${CY - 140}" stroke="${silver}" stroke-width="3" stroke-dasharray="7 3"/>
<g fill="none" stroke="${mix(t.accent2, t.bg, 0.35)}" stroke-width="5" stroke-linecap="round" opacity="0.7">${armPaths(false)}</g>
<g fill="${silver}" opacity="0.7">${cups(false)}</g>
<g fill="url(#dbtefx-lb-silver)" stroke="${mix(t.accent2, t.bg, 0.4)}">
<path d="M${CX - 4} ${CY - 140}h8v60h-8Z"/><circle cx="${CX}" cy="${CY - 90}" r="11"/><path d="M${CX - 22} ${CY - 66}C${CX - 22} ${CY - 80} ${CX + 22} ${CY - 80} ${CX + 22} ${CY - 66}L${CX + 6} ${CY - 50}H${CX - 6}Z"/>
<path d="M${CX - 5} ${CY - 50}h10v44h-10Z"/><circle cx="${CX}" cy="${CY - 14}" r="16"/>
<path d="M${CX - 48} ${CY + 26}C${CX - 40} ${CY + 70} ${CX + 40} ${CY + 70} ${CX + 48} ${CY + 26}C${CX + 30} ${CY + 18} ${CX - 30} ${CY + 18} ${CX - 48} ${CY + 26}Z"/>
<path d="M${CX - 4} ${CY + 2}h8v26h-8Z"/><circle cx="${CX}" cy="${CY + 70}" r="8"/></g>
<ellipse cx="${CX}" cy="${CY + 36}" rx="44" ry="9" fill="url(#dbtefx-lb-silver)"/>
<g fill="none" stroke="url(#dbtefx-lb-silver)" stroke-width="5.5" stroke-linecap="round">${armPaths(true)}</g>
<g fill="url(#dbtefx-lb-silver)">${cups(true)}</g>
${crystals}
<path d="M${CX} ${CY + 80}l14 24l-14 42l-14 -42Z" fill="url(#dbtefx-lb-crystal)"/>
${flames}
</g>
<!--near-->
<defs>
<linearGradient id="dbtefx-lb-fold" x1="0" y1="0" x2="0" y2="1"><stop offset="0.4" stop-color="${mix(t.accent, '#000000', 0.7)}"/><stop offset="0.85" stop-color="${mix(t.accent, '#000000', 0.25)}"/><stop offset="0.95" stop-color="${mix(t.accent, '#ffffff', 0.15)}"/><stop offset="1" stop-color="${mix(t.accent, '#000000', 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-lb-tassel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.warning, '#000000', 0.35)}"/><stop offset="0.5" stop-color="${t.warning}"/><stop offset="1" stop-color="${mix(t.warning, '#000000', 0.45)}"/></linearGradient>
</defs>
${swag(-40, 540, 92)}${swag(1060, 1660, 80)}
${tassel(540, 120)}${tassel(1060, 108)}`;
};

export default labrynth;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 50, colors: ['accent2', 'warning'] },
  { kind: 'petal', count: 12, colors: ['accent'], speed: 0.6 },
];
