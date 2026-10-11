// Theme scenes: one full-screen illustration per archetype and duel theme, drawn
// as inline SVG behind the game (#dbte-skin-fx) in the theme's colours, with
// a few slow animations (transform and opacity only). Three depth planes:
// far (silhouettes), middle (the centrepiece), near (particles).
// `still` stops every animation; so does the system's reduced-motion setting.

import { isHex, mix } from '../../lib/color.js';

export const FX_ID = 'dbte-skin-fx';

// Seeded scatter: the same picture on every render.
const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};
const n1 = (v) => Math.round(v * 10) / 10;
const polar = (cx, cy, r, deg) => [n1(cx + r * Math.cos((deg * Math.PI) / 180)), n1(cy + r * Math.sin((deg * Math.PI) / 180))];
const W = 1600;
const H = 900;

// Shared keyframes. Every animated element sets its own duration and delay.
const KEYFRAMES = `
@keyframes dbtefx-rise { 0% { transform: translateY(0); opacity: 0; } 12% { opacity: 1; } 85% { opacity: 0.8; } 100% { transform: translateY(-980px); opacity: 0; } }
@keyframes dbtefx-fall { 0% { transform: translate(0, -120px) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 50% { transform: translate(60px, 440px) rotate(140deg); } 100% { transform: translate(-30px, 1040px) rotate(300deg); opacity: 0.6; } }
@keyframes dbtefx-spin { to { transform: rotate(360deg); } }
@keyframes dbtefx-sway { 0%, 100% { transform: rotate(-14deg); } 50% { transform: rotate(14deg); } }
@keyframes dbtefx-reed { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2.5deg); } }
@keyframes dbtefx-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.04); } }
@keyframes dbtefx-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
@keyframes dbtefx-flicker { 0%, 100% { opacity: 0.8; transform: scale(1); } 30% { opacity: 1; transform: scale(1.08, 1.14); } 60% { opacity: 0.7; transform: scale(0.96, 0.9); } }
@keyframes dbtefx-ripple { 0% { transform: scale(0.15); opacity: 0.9; } 100% { transform: scale(1.7); opacity: 0; } }
@keyframes dbtefx-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes dbtefx-scan { 0% { transform: translateY(-40px); } 100% { transform: translateY(940px); } }
@keyframes dbtefx-bloom { 0%, 100% { transform: scale(0.94); opacity: 0.75; } 50% { transform: scale(1.04); opacity: 1; } }
@keyframes dbtefx-scanx { 0% { transform: translateX(0); } 100% { transform: translateX(2000px); } }
@keyframes dbtefx-drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(18px, -10px); } }
`;

// Inline animation for one element: name, seconds, delay seconds, extras.
const anim = (name, dur, delay = 0, extra = '') =>
  `style="animation: dbtefx-${name} ${dur}s ${extra || 'linear'} ${n1(-delay)}s infinite;${name === 'fall' || name === 'sway' || name === 'blink' || name === 'flicker' || name === 'ripple' || name === 'bloom' ? ' transform-box: fill-box; transform-origin: center;' : ''}"`;

const embers = (rand, colors, count, { x0 = 0, x1 = W, size = 1 } = {}) => {
  let s = '';
  for (let i = 0; i < count; i++) {
    const x = x0 + rand() * (x1 - x0);
    const r = (0.9 + rand() * 2.2) * size;
    const c = colors[i % colors.length];
    s += `<ellipse cx="${n1(x)}" cy="${n1(H + 20)}" rx="${n1(r)}" ry="${n1(r * 2.3)}" fill="${c}" ${anim('rise', n1(9 + rand() * 9), rand() * 18)}/>`;
  }
  return s;
};

// ---------- Branded: Dogmatika cathedral, the brand, rising embers ----------
const branded = (t) => {
  const rand = rng(3);
  let towers = '';
  const spires = [[120, 70, 300], [260, 50, 220], [380, 110, 380], [540, 60, 250], [1040, 60, 260], [1180, 110, 400], [1330, 50, 230], [1460, 80, 320]];
  spires.forEach(([x, w, h]) => {
    towers += `<path d="M${x} ${H}V${H - h}L${x + w / 2} ${H - h - w * 1.3}L${x + w} ${H - h}V${H}Z"/>`;
  });
  return `<defs>
<linearGradient id="dbtefx-bd-brand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent2}"/><stop offset="1" stop-color="${t.accent}"/></linearGradient>
<radialGradient id="dbtefx-bd-heat" cx="0.5" cy="1" r="0.7"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.55"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect x="0" y="420" width="${W}" height="480" fill="url(#dbtefx-bd-heat)" ${anim('pulse', 7, 0, 'ease-in-out')}/>
<g fill="${mix(t.bg, t.accent, 0.14)}" opacity="0.9">${towers}<rect x="0" y="${H - 60}" width="${W}" height="60"/></g>
<g fill="none" stroke="${t.accent2}" stroke-opacity="0.2" stroke-width="2"><circle cx="800" cy="400" r="330" stroke-dasharray="420 60"/><circle cx="800" cy="400" r="296" stroke-dasharray="6 16"/></g>
<g opacity="0.3" fill="url(#dbtefx-bd-brand)">
<path d="M800 110C812 220 822 320 818 400C822 500 812 600 800 700C788 600 778 500 782 400C778 320 788 220 800 110Z"/>
<path d="M560 330C660 352 740 360 800 352C860 360 940 352 1040 330C950 392 870 412 800 418C730 412 650 392 560 330Z"/>
<path d="M800 470C760 520 700 560 640 580C710 590 770 560 800 520C830 560 890 590 960 580C900 560 840 520 800 470Z" opacity="0.8"/>
</g>
<circle cx="800" cy="396" r="22" fill="${t.accent2}" fill-opacity="0.45" ${anim('pulse', 4, 1, 'ease-in-out')}/>
${embers(rand, [t.accent2, t.accent, t.warning], 26)}`;
};

// ---------- Artmage: gilded frame, sweeping paint, blooming splashes ----------
const artmage = (t) => {
  const rand = rng(11);
  const curl = (x, y, sx, sy) =>
    `<path d="M${x} ${y}c${44 * sx} ${-9 * sy} ${80 * sx} ${15 * sy} ${70 * sx} ${47 * sy}c${-7 * sx} ${24 * sy} ${-38 * sx} ${24 * sy} ${-41 * sx} ${3 * sy}c${-1 * sx} ${-13 * sy} ${15 * sx} ${-18 * sy} ${22 * sx} ${-9 * sy}"/>`;
  const curls = [
    [800, 60, 1, 1], [800, 60, -1, 1], [800, 840, 1, -1], [800, 840, -1, -1],
    [470, 450, 1, 1], [470, 450, 1, -1], [1130, 450, -1, 1], [1130, 450, -1, -1],
  ];
  let splats = '';
  [[260, 240, t.accent], [1360, 640, t.opp], [1300, 180, t.accent2], [300, 700, t.accent2]].forEach(([cx, cy, c], k) => {
    let drops = `<circle cx="${cx}" cy="${cy}" r="${46 + k * 6}" fill="${c}"/>`;
    for (let i = 0; i < 10; i++) {
      const [x, y] = polar(cx, cy, 60 + rand() * 80, rand() * 360);
      drops += `<circle cx="${x}" cy="${y}" r="${n1(3 + rand() * 9)}" fill="${c}"/>`;
    }
    splats += `<g opacity="0.2" ${anim('bloom', n1(8 + k * 2), k * 2, 'ease-in-out')}>${drops}</g>`;
  });
  return `<defs>
<linearGradient id="dbtefx-am-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.4" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.opp}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-am-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0"/><stop offset="0.6" stop-color="${t.accent2}"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></linearGradient>
</defs>
<path d="M-40 260C300 160 620 300 900 230S1400 120 1660 200L1660 250C1400 190 1180 300 900 300S300 230 -40 330Z" fill="url(#dbtefx-am-a)" opacity="0.22"/>
<path d="M-40 640C320 720 640 560 960 640S1420 760 1660 660L1660 700C1420 800 1200 690 960 700S320 780 -40 700Z" fill="url(#dbtefx-am-b)" opacity="0.18"/>
${splats}
<g fill="none" stroke="${t.accent2}" stroke-linecap="round">
<ellipse cx="800" cy="450" rx="330" ry="392" stroke-width="4" stroke-opacity="0.3"/>
<ellipse cx="800" cy="450" rx="312" ry="374" stroke-width="1.5" stroke-opacity="0.2"/>
<g stroke-width="3" stroke-opacity="0.34">${curls.map((p) => curl(...p)).join('')}</g>
</g>
${[[568, 180], [1032, 180], [568, 720], [1032, 720]].map(([x, y]) => `<path d="M${x} ${y - 12}L${x + 8} ${y}L${x} ${y + 12}L${x - 8} ${y}Z" fill="${t.accent2}" fill-opacity="0.45"/>`).join('')}
${Array.from({ length: 10 }, (_, i) => `<circle cx="${n1(80 + rand() * 1440)}" cy="${n1(80 + rand() * 740)}" r="${n1(2 + rand() * 4)}" fill="${[t.accent, t.opp, t.accent2][i % 3]}" fill-opacity="0.35" ${anim('drift', n1(10 + rand() * 8), rand() * 10, 'ease-in-out')}/>`).join('')}`;
};

// ---------- Sky Striker: launch-bay HUD, rotating radar, scanline ----------
const skyStriker = (t) => {
  const cx = 1180;
  const cy = 470;
  let ticks = '';
  for (let a = 0; a < 360; a += 10) {
    const [x1, y1] = polar(cx, cy, a % 30 ? 292 : 280, a);
    const [x2, y2] = polar(cx, cy, 302, a);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  const [ex, ey] = polar(cx, cy, 302, -55);
  const blip = ([x, y], d) => `<g ${anim('pulse', 2.4, d, 'ease-in-out')}><circle cx="${x}" cy="${y}" r="6" fill="${t.accent}"/><circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${t.accent}" stroke-opacity="0.5"/></g>`;
  const bracket = (x, y, dx, dy) => `<path d="M${x + dx * 70} ${y}H${x}V${y + dy * 70}"/>`;
  return `<defs>
<linearGradient id="dbtefx-ss-sweep" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0.38"/></linearGradient>
<linearGradient id="dbtefx-ss-scan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0.18"/></linearGradient>
<linearGradient id="dbtefx-ss-trail" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.7" stop-color="${t.accent}" stop-opacity="0.5"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.7"/></linearGradient>
</defs>
<path d="M-60 980L760 -40L790 -40L-20 980Z" fill="url(#dbtefx-ss-trail)" opacity="0.35"/>
<g fill="none" stroke="${t.accent2}"><circle cx="${cx}" cy="${cy}" r="302" stroke-width="3" stroke-opacity="0.38"/>${[220, 140, 60].map((r) => `<circle cx="${cx}" cy="${cy}" r="${r}" stroke-opacity="0.2"/>`).join('')}
<path d="M${cx - 320} ${cy}H${cx + 320}M${cx} ${cy - 320}V${cy + 320}" stroke-opacity="0.16"/><g stroke-opacity="0.4" stroke-width="1.5">${ticks}</g></g>
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 6s linear infinite;"><path d="M${cx} ${cy}L${cx + 302} ${cy}A302 302 0 0 0 ${ex} ${ey}Z" fill="url(#dbtefx-ss-sweep)"/></g>
${blip(polar(cx, cy, 190, -30), 0)}${blip(polar(cx, cy, 110, 140), 0.8)}${blip(polar(cx, cy, 250, 75), 1.6)}
<g fill="none" stroke="${t.accent2}" stroke-width="3" stroke-opacity="0.45">${bracket(40, 40, 1, 1)}${bracket(W - 40, 40, -1, 1)}${bracket(40, H - 40, 1, -1)}${bracket(W - 40, H - 40, -1, -1)}</g>
<rect x="0" y="0" width="${W}" height="40" fill="url(#dbtefx-ss-scan)" ${anim('scan', 7)}/>
<g fill="${t.accent2}" fill-opacity="0.25">${[0, 1, 2, 3].map((i) => `<rect x="70" y="${720 + i * 22}" width="${120 + ((i * 53) % 90)}" height="6"/>`).join('')}</g>
<rect x="${W / 2 - 60}" y="40" width="120" height="5" fill="${t.accent}" fill-opacity="0.6"/>`;
};

// ---------- Snake-Eye: the serpent's eye, a coiled body, embers ----------
const snakeEye = (t) => {
  const rand = rng(23);
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
<g ${anim('blink', 9, 2, 'ease-in-out')}>
<path d="M380 200Q800 -80 1220 200Q800 480 380 200Z" fill="${t.bg}" fill-opacity="0.6" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="4"/>
<circle cx="800" cy="200" r="168" fill="url(#dbtefx-se-iris)" opacity="0.75" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<g stroke="${t.accent2}" stroke-opacity="0.22">${fibres}</g>
<ellipse cx="800" cy="200" rx="24" ry="150" fill="${t.bg}" fill-opacity="0.92" stroke="${t.accent}" stroke-opacity="0.6" stroke-width="2"/>
<ellipse cx="748" cy="132" rx="22" ry="10" fill="#ffffff" fill-opacity="0.18" transform="rotate(-25 748 132)"/>
</g>
${embers(rand, [t.accent, t.accent2], 24)}`;
};

// ---------- Labrynth: rose window, candlelit colonnade ----------
const labrynth = (t) => {
  let glass = '';
  for (let i = 0; i < 12; i++) {
    const [x, y] = polar(800, 250, 150, i * 30);
    glass += `<circle cx="${x}" cy="${y}" r="52" fill="${[t.accent, t.opp, t.accent2][i % 3]}" fill-opacity="0.16" stroke="${t.accent2}" stroke-opacity="0.35" stroke-width="2"/>`;
    const [x1, y1] = polar(800, 250, 46, i * 30 + 15);
    const [x2, y2] = polar(800, 250, 214, i * 30 + 15);
    glass += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${t.accent2}" stroke-opacity="0.25" stroke-width="2"/>`;
  }
  let arches = '';
  let candles = '';
  for (let x = -40; x < W; x += 180) {
    arches += `<path d="M${x + 14} ${H}V${H - 230}Q${x + 14} ${H - 340} ${x + 90} ${H - 370}Q${x + 166} ${H - 340} ${x + 166} ${H - 230}V${H}Z"/>`;
    candles += `<rect x="${x + 84}" y="${H - 70}" width="12" height="40" rx="2" fill="${t.text}" fill-opacity="0.25"/><ellipse cx="${x + 90}" cy="${H - 82}" rx="6" ry="12" fill="${t.warning}" fill-opacity="0.85" ${anim('flicker', n1(1.6 + ((x / 180) % 3) * 0.4), (x / 180) * 0.37, 'ease-in-out')}/>`;
  }
  return `<defs><radialGradient id="dbtefx-lb-light" cx="0.5" cy="0.28" r="0.45"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.22"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-lb-light)"/>
<g ${anim('pulse', 6, 0, 'ease-in-out')}><circle cx="800" cy="250" r="236" fill="${t.bg}" fill-opacity="0.35" stroke="${t.accent2}" stroke-opacity="0.45" stroke-width="5"/>${glass}<circle cx="800" cy="250" r="44" fill="${t.accent}" fill-opacity="0.3" stroke="${t.accent2}" stroke-opacity="0.5" stroke-width="3"/></g>
<g fill="${mix(t.bg, t.surface, 0.5)}" stroke="${t.accent2}" stroke-opacity="0.2" stroke-width="2">${arches}</g>
${candles}`;
};

// ---------- Elemental HERO: searchlights over the Skyscraper city ----------
const hero = (t) => {
  const beam = (x, delay) =>
    `<g style="transform-origin: ${x}px ${H}px; animation: dbtefx-sway 11s ease-in-out ${-delay}s infinite;"><path d="M${x - 10} ${H}L${x - 140} -40L${x + 140} -40L${x + 10} ${H}Z" fill="url(#dbtefx-hr-beam)"/></g>`;
  const rand = rng(5);
  return `<defs><linearGradient id="dbtefx-hr-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.32"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient></defs>
${beam(330, 0)}${beam(1270, 5)}
<path d="M760 120L840 120L860 150L800 220L740 150Z" fill="${t.accent}" fill-opacity="0.12" stroke="${t.accent}" stroke-opacity="0.3" stroke-width="3"/>
<text x="800" y="176" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="46" font-weight="900" fill="${t.accent}" fill-opacity="0.3">H</text>
${Array.from({ length: 14 }, () => `<rect x="${n1(rand() * W)}" y="${n1(H - 60 - rand() * 300)}" width="5" height="7" fill="${t.warning}" ${anim('pulse', n1(2 + rand() * 4), rand() * 4, 'steps(2)')}/>`).join('')}`;
};

// ---------- Blackwing: moonlit night, spread wings, falling feathers ----------
const blackwing = (t) => {
  const rand = rng(31);
  const wing = (ox, oy, dir) => {
    let s = '';
    for (let i = 0; i < 11; i++) {
      const ang = dir > 0 ? -95 + i * 7.5 : -85 - i * 7.5;
      const len = 330 + i * 34;
      const [tx, ty] = polar(ox, oy, len, ang);
      const [lx, ly] = polar(ox, oy, len * 0.5, ang - 5 * dir);
      const [rx, ry] = polar(ox, oy, len * 0.5, ang + 5 * dir);
      s += `<path d="M${ox} ${oy}Q${lx} ${ly} ${tx} ${ty}Q${rx} ${ry} ${ox} ${oy}Z"/>`;
    }
    return s;
  };
  const feather = (x, s) =>
    `<g transform="translate(${n1(x)} 0)"><g ${anim('fall', n1(12 + rand() * 10), rand() * 20, 'ease-in-out')}><path d="M0 ${-30 * s}Q${9 * s} 0 0 ${30 * s}Q${-9 * s} 0 0 ${-30 * s}Z" fill="${mix(t.bg, t.accent, 0.3)}" fill-opacity="0.85" stroke="${t.accent}" stroke-opacity="0.85" stroke-width="1.4"/><path d="M0 ${-30 * s}V${36 * s}" stroke="${t.text}" stroke-opacity="0.5"/></g></g>`;
  return `<defs>
<radialGradient id="dbtefx-bw-moon"><stop offset="0.6" stop-color="${t.text}" stop-opacity="0.18"/><stop offset="1" stop-color="${t.text}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-bw-wing" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(t.bg, t.accent, 0.2)}" stop-opacity="0.5"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.42"/></linearGradient>
</defs>
<circle cx="1060" cy="150" r="240" fill="url(#dbtefx-bw-moon)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
<path d="M1060 60A92 92 0 1 0 1106 232A78 78 0 1 1 1060 60Z" fill="${t.text}" fill-opacity="0.45"/>
<g fill="${t.text}" fill-opacity="0.05"><ellipse cx="400" cy="230" rx="420" ry="30"/><ellipse cx="1150" cy="330" rx="380" ry="24"/></g>
<g fill="url(#dbtefx-bw-wing)" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="1.5">${wing(120, 900, 1)}${wing(1480, 900, -1)}</g>
<ellipse cx="800" cy="460" rx="8" ry="4" fill="${t.accent2}" fill-opacity="0.7" ${anim('pulse', 3, 0, 'ease-in-out')}/>
<ellipse cx="840" cy="460" rx="8" ry="4" fill="${t.accent2}" fill-opacity="0.7" ${anim('pulse', 3, 0, 'ease-in-out')}/>
${Array.from({ length: 20 }, () => feather(rand() * W, 1.1 + rand() * 1.2)).join('')}`;
};

// ---------- Lightsworn: dawn sunburst, halo rings, rising motes ----------
const lightsworn = (t) => {
  const rand = rng(41);
  let rays = '';
  for (let i = 0; i < 36; i++) {
    const [x1, y1] = polar(800, -60, 1400, i * 10 - 2);
    const [x2, y2] = polar(800, -60, 1400, i * 10 + 2);
    rays += `<path d="M800 -60L${x1} ${y1}L${x2} ${y2}Z"/>`;
  }
  return `<defs><radialGradient id="dbtefx-ls-sun" cx="0.5" cy="0" r="0.75"><stop offset="0" stop-color="#ffffff" stop-opacity="0.8"/><stop offset="0.3" stop-color="${t.accent}" stop-opacity="0.18"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient></defs>
<g fill="${t.accent}" fill-opacity="0.07" style="transform-origin: 800px -60px; animation: dbtefx-spin 160s linear infinite;">${rays}</g>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ls-sun)"/>
<g fill="none" stroke="${t.accent}"><circle cx="800" cy="-60" r="260" stroke-opacity="0.22" stroke-width="3"/><circle cx="800" cy="-60" r="330" stroke-opacity="0.14" stroke-dasharray="4 12" stroke-width="2"/><circle cx="800" cy="-60" r="420" stroke-opacity="0.1"/></g>
<g fill="${t.accent}" fill-opacity="0.12"><path d="M800 300L828 380L800 620L772 380Z"/><path d="M700 400L800 380L900 400L800 420Z"/></g>
${embers(rand, ['#ffffff', t.accent, t.warning], 22, { size: 1.1 })}`;
};

// ---------- Frog: moonlit pond, lily pads, ripples, fireflies, reeds ----------
const frog = (t) => {
  const rand = rng(53);
  const pad = (x, y, r, delay) =>
    `<g ${anim('bob', n1(5 + rand() * 3), delay, 'ease-in-out')}><path d="M${x} ${y}L${n1(x + r * 0.95)} ${n1(y - r * 0.32)}A${r} ${n1(r * 0.42)} 0 1 1 ${n1(x + r * 0.95)} ${n1(y + r * 0.1)}Z" fill="${t.accent}" fill-opacity="0.2" stroke="${t.accent}" stroke-opacity="0.4" stroke-width="2"/></g>`;
  const lotus = (x, y) =>
    `<g fill="${t.accent2}" fill-opacity="0.45">${[-40, -20, 0, 20, 40].map((a) => `<ellipse cx="${x}" cy="${y - 18}" rx="9" ry="22" transform="rotate(${a} ${x} ${y})"/>`).join('')}</g>`;
  const reed = (x, h, lean, delay) =>
    `<g style="transform-origin: ${x}px ${H}px; animation: dbtefx-reed ${n1(6 + rand() * 3)}s ease-in-out ${-delay}s infinite;"><path d="M${x} ${H}Q${x + lean} ${H - h / 2} ${x + lean * 1.6} ${H - h}" fill="none" stroke="${mix(t.bg, t.accent, 0.35)}" stroke-width="5" stroke-linecap="round"/><ellipse cx="${x + lean * 1.6}" cy="${H - h + 26}" rx="7" ry="26" fill="${mix(t.bg, t.warning, 0.3)}"/></g>`;
  const ripple = (x, y, delay) => `<ellipse cx="${x}" cy="${y}" rx="120" ry="30" fill="none" stroke="${t.text}" stroke-opacity="0.35" stroke-width="2" ${anim('ripple', 6, delay, 'ease-out')}/>`;
  return `<defs><linearGradient id="dbtefx-fr-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="${t.accent}" stop-opacity="0"/><stop offset="1" stop-color="${t.opp}" stop-opacity="0.16"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-fr-water)"/>
${ripple(420, 690, 0)}${ripple(1180, 760, 2)}${ripple(820, 820, 4)}
${pad(300, 620, 90, 0)}${pad(560, 780, 120, 1)}${pad(1060, 660, 100, 2)}${pad(1320, 820, 130, 3)}${pad(880, 560, 70, 1.5)}
${lotus(560, 760)}${lotus(1320, 800)}
${reed(40, 420, 18, 0)}${reed(90, 340, -10, 1)}${reed(1520, 460, -20, 2)}${reed(1570, 360, 12, 0.5)}
${Array.from({ length: 14 }, () => `<circle cx="${n1(80 + rand() * 1440)}" cy="${n1(120 + rand() * 520)}" r="${n1(2 + rand() * 2.5)}" fill="${t.warning}" ${anim('pulse', n1(2.5 + rand() * 3), rand() * 5, 'ease-in-out')}/>`).join('')}`;
};

// ---------- Duel themes ----------

// A slowly turning ring of runes around a centre point.
const runeRing = (t, cx, cy, r, color, dur, reverse = false) => {
  let ticks = '';
  for (let i = 0; i < 48; i++) {
    const [x1, y1] = polar(cx, cy, r - (i % 4 ? 8 : 18), i * 7.5);
    const [x2, y2] = polar(cx, cy, r, i * 7.5);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  return `<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin ${dur}s linear infinite${reverse ? ' reverse' : ''};" fill="none" stroke="${color}"><circle cx="${cx}" cy="${cy}" r="${r}" stroke-opacity="0.35" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="${r - 26}" stroke-opacity="0.2" stroke-dasharray="10 8"/><g stroke-opacity="0.35" stroke-width="2">${ticks}</g></g>`;
};

const star = (cx, cy, r, points = 5) => {
  const p = [];
  for (let i = 0; i < points; i++) p.push(polar(cx, cy, r, -90 + (i * 720) / points).join(' '));
  return `M${p.join('L')}Z`;
};

const sparkles = (rand, color, count, area = [0, 0, W, H]) =>
  Array.from({ length: count }, () => {
    const x = area[0] + rand() * area[2];
    const y = area[1] + rand() * area[3];
    const r = 3 + rand() * 6;
    return `<path d="M${n1(x)} ${n1(y - r)}L${n1(x + r * 0.25)} ${n1(y - r * 0.25)}L${n1(x + r)} ${n1(y)}L${n1(x + r * 0.25)} ${n1(y + r * 0.25)}L${n1(x)} ${n1(y + r)}L${n1(x - r * 0.25)} ${n1(y + r * 0.25)}L${n1(x - r)} ${n1(y)}L${n1(x - r * 0.25)} ${n1(y - r * 0.25)}Z" fill="${color}" ${anim('pulse', n1(2 + rand() * 3), rand() * 4, 'ease-in-out')}/>`;
  }).join('');

const glow = (id, color, cx = 0.5, cy = 0.5, r = 0.5, o = 0.25) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${color}" stop-opacity="${o}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;

// Spell Card: a turning spell circle, sparkles rising like cast magic.
const spell = (t) => {
  const rand = rng(61);
  return `<defs>${glow('dbtefx-sp-g', t.accent)}</defs><rect width="${W}" height="${H}" fill="url(#dbtefx-sp-g)"/>
${runeRing(t, 800, 450, 340, t.accent, 90)}${runeRing(t, 800, 450, 220, t.accent2, 60, true)}
<path d="${star(800, 450, 190, 6)}" fill="none" stroke="${t.accent}" stroke-opacity="0.25" stroke-width="2"/>
${embers(rand, [t.accent, t.accent2], 18, { size: 0.9 })}`;
};

// Trap Card: two chains cross the screen, a trap hole pulses below.
const trap = (t) => {
  const chain = (x1, y1, x2, y2, delay) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    let links = '';
    for (let d = 0; d < len; d += 46) {
      const x = x1 + ((x2 - x1) * d) / len;
      const y = y1 + ((y2 - y1) * d) / len;
      links += `<rect x="${n1(x - 26)}" y="${n1(y - 11)}" width="52" height="22" rx="11" transform="rotate(${n1(ang)} ${n1(x)} ${n1(y)})"${(d / 46) % 2 ? ` stroke-width="5"` : ''}/>`;
    }
    return `<g fill="none" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="7" ${anim('pulse', 5, delay, 'ease-in-out')}>${links}</g>`;
  };
  return `<defs>${glow('dbtefx-tr-hole', t.accent, 0.5, 0.5, 0.5, 0.5)}</defs>
<ellipse cx="800" cy="840" rx="520" ry="120" fill="url(#dbtefx-tr-hole)" ${anim('pulse', 4, 0, 'ease-in-out')}/>
<ellipse cx="800" cy="840" rx="300" ry="60" fill="${t.bg}" fill-opacity="0.6"/>
${chain(-40, 60, 1640, 820, 0)}${chain(1640, 60, -40, 820, 2.5)}`;
};

// Fusion: two colours spiralling into one, turning in opposite directions.
const fusion = (t) => {
  const spiral = (rot) => {
    let d = 'M800 450';
    for (let i = 1; i < 140; i++) {
      const [x, y] = polar(800, 450, i * 3.1, i * 9 + rot);
      d += `L${x} ${y}`;
    }
    return d;
  };
  return `<defs>${glow('dbtefx-fu-core', t.accent2, 0.5, 0.5, 0.3, 0.5)}</defs>
<g style="transform-origin: 800px 450px; animation: dbtefx-spin 40s linear infinite;"><path d="${spiral(0)}" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="6" stroke-linecap="round"/></g>
<g style="transform-origin: 800px 450px; animation: dbtefx-spin 40s linear infinite reverse;"><path d="${spiral(180)}" fill="none" stroke="${t.accent2}" stroke-opacity="0.3" stroke-width="6" stroke-linecap="round"/></g>
<circle cx="800" cy="450" r="260" fill="url(#dbtefx-fu-core)" ${anim('pulse', 5, 0, 'ease-in-out')}/>`;
};

// Synchro: tuner rings stacked in a column of light, stars passing through.
const synchro = (t) => {
  const rand = rng(67);
  let rings = '';
  for (let i = 0; i < 5; i++) {
    rings += `<ellipse cx="800" cy="${170 + i * 140}" rx="230" ry="40" fill="none" stroke="${t.accent2}" stroke-opacity="0.45" stroke-width="4" ${anim('bloom', 3, i * 0.4, 'ease-in-out')}/>`;
  }
  return `<defs><linearGradient id="dbtefx-sy-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.3"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient></defs>
<rect x="640" y="0" width="320" height="${H}" fill="url(#dbtefx-sy-beam)" ${anim('pulse', 4, 0, 'ease-in-out')}/>${rings}
${Array.from({ length: 10 }, () => `<circle cx="${n1(720 + rand() * 160)}" cy="${H + 10}" r="${n1(2 + rand() * 3)}" fill="${t.text}" ${anim('rise', n1(4 + rand() * 3), rand() * 6)}/>`).join('')}`;
};

// Xyz: overlay units orbiting a black hole, rank stars twinkling.
const xyz = (t) => {
  const rand = rng(71);
  const unit = (r, dur, delay, size) =>
    `<g style="transform-origin: 800px 450px; animation: dbtefx-spin ${dur}s linear ${-delay}s infinite;"><circle cx="${800 + r}" cy="450" r="${size}" fill="${t.accent}" fill-opacity="0.8"/><circle cx="${800 + r}" cy="450" r="${size * 2.6}" fill="${t.accent}" fill-opacity="0.15"/></g>`;
  return `<defs>${glow('dbtefx-xy-hole', t.accent, 0.5, 0.5, 0.5, 0.3)}</defs>
<circle cx="800" cy="450" r="330" fill="url(#dbtefx-xy-hole)"/>
<g fill="none" stroke="${t.accent}" stroke-opacity="0.2"><ellipse cx="800" cy="450" rx="300" ry="300"/><ellipse cx="800" cy="450" rx="210" ry="210" stroke-dasharray="4 10"/></g>
<circle cx="800" cy="450" r="120" fill="${t.bg}" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="3"/>
${unit(300, 14, 0, 9)}${unit(210, 10, 3, 7)}${unit(300, 14, 7, 9)}
${sparkles(rand, t.accent, 16)}`;
};

// Link: eight link arrows around a marker, lighting in turn; circuit traces.
const link = (t) => {
  let arrows = '';
  for (let i = 0; i < 8; i++) {
    const [x, y] = polar(800, 450, 230, i * 45 - 90);
    arrows += `<path d="M-34 14L0 -22L34 14Z" transform="translate(${x} ${y}) rotate(${i * 45})" fill="${t.accent}" ${anim('pulse', 4, i * 0.5, 'ease-in-out')}/>`;
  }
  let traces = '';
  const rand = rng(73);
  for (let i = 0; i < 9; i++) {
    const y = 80 + i * 90;
    const x = rand() * 500;
    traces += `<path d="M${n1(x)} ${y}H${n1(x + 200)}L${n1(x + 240)} ${y + 40}H${n1(x + 420)}" />`;
  }
  return `<g fill="none" stroke="${t.accent2}" stroke-opacity="0.16" stroke-width="2">${traces}</g>
<g fill="none" stroke="${t.accent2}" stroke-opacity="0.16" stroke-width="2" transform="translate(1600 0) scale(-1 1)">${traces}</g>
<g fill-opacity="0.65">${arrows}</g>
<rect x="740" y="390" width="120" height="120" transform="rotate(45 800 450)" fill="${t.bg}" fill-opacity="0.7" stroke="${t.accent2}" stroke-opacity="0.5" stroke-width="4"/>`;
};

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
const darkMagic = (t) => {
  const rand = rng(83);
  return `<defs>${glow('dbtefx-dm-g', t.accent, 0.5, 0.5, 0.5, 0.25)}</defs><rect width="${W}" height="${H}" fill="url(#dbtefx-dm-g)"/>
${runeRing(t, 800, 450, 320, t.accent, 120)}
<g style="transform-origin: 800px 450px; animation: dbtefx-spin 60s linear infinite reverse;"><path d="${star(800, 450, 270)}" fill="none" stroke="${t.accent2}" stroke-opacity="0.35" stroke-width="3"/></g>
<path d="M200 760Q700 520 1400 140" fill="none" stroke="${t.accent2}" stroke-opacity="0.3" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>
${sparkles(rand, t.accent2, 18)}`;
};

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
<g fill="none" stroke="${t.warning}" stroke-opacity="0.45" stroke-width="3" ${anim('pulse', 3, 1, 'ease-in-out')}>${cracks}</g>
${embers(rand, [t.accent, t.warning], 22)}`;
};

// Millennium: the Eye of Wdjat over a pyramid, drifting sand.
const millennium = (t) => {
  const rand = rng(97);
  return `<defs>${glow('dbtefx-mi-g', t.accent, 0.5, 0.4, 0.45, 0.3)}</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-mi-g)" ${anim('pulse', 6, 0, 'ease-in-out')}/>
<path d="M800 140L1220 860H380Z" fill="${t.accent}" fill-opacity="0.05" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="3"/>
<g fill="none" stroke="${t.accent}" stroke-opacity="0.6" stroke-width="5" stroke-linecap="round">
<path d="M690 470Q800 390 910 470Q800 530 690 470Z"/><circle cx="800" cy="468" r="26" fill="${t.accent}" fill-opacity="0.5"/>
<path d="M690 470L640 470M780 500Q770 560 730 590Q760 600 770 570M820 500Q840 540 880 560"/></g>
${Array.from({ length: 24 }, () => `<circle cx="${n1(rand() * W)}" cy="${n1(500 + rand() * 400)}" r="${n1(1 + rand() * 2)}" fill="${t.accent}" fill-opacity="0.5" ${anim('drift', n1(6 + rand() * 6), rand() * 6, 'ease-in-out')}/>`).join('')}`;
};

// Pendulum: two scale pillars and a swinging pendulum between them.
const pendulum = (t) =>
  `<defs><linearGradient id="dbtefx-pe-l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.self}" stop-opacity="0.45"/><stop offset="1" stop-color="${t.self}" stop-opacity="0.05"/></linearGradient>
<linearGradient id="dbtefx-pe-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.05"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.45"/></linearGradient></defs>
<rect x="250" y="80" width="110" height="820" rx="10" fill="url(#dbtefx-pe-l)"/><rect x="1240" y="80" width="110" height="820" rx="10" fill="url(#dbtefx-pe-r)"/>
<path d="M360 140H1240" stroke="${t.text}" stroke-opacity="0.18" stroke-width="3"/>
<g style="transform-origin: 800px 140px; animation: dbtefx-sway 4s ease-in-out infinite;"><path d="M800 140V560" stroke="${t.text}" stroke-opacity="0.3" stroke-width="3"/>
<path d="M800 540L850 600L800 690L750 600Z" fill="${t.accent}" fill-opacity="0.35" stroke="${t.self}" stroke-opacity="0.6" stroke-width="3"/></g>`;

// Divine Beasts: Ra's sun disk, Obelisk's pillar of light, Slifer's coil.
const divine = (t) => {
  const rand = rng(101);
  return `<defs>${glow('dbtefx-dv-sun', t.accent, 0.5, 0.5, 0.5, 0.6)}<linearGradient id="dbtefx-dv-ob" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.opp}" stop-opacity="0"/><stop offset="0.5" stop-color="${t.opp}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.opp}" stop-opacity="0"/></linearGradient></defs>
<rect x="160" y="0" width="200" height="${H}" fill="url(#dbtefx-dv-ob)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<path d="M1700 120C1400 160 1500 360 1300 420S1100 700 1340 820" fill="none" stroke="${t.self}" stroke-opacity="0.3" stroke-width="40" stroke-linecap="round"/>
<circle cx="800" cy="260" r="220" fill="url(#dbtefx-dv-sun)" ${anim('bloom', 6, 0, 'ease-in-out')}/>
${runeRing(t, 800, 260, 170, t.accent, 80)}
${embers(rand, [t.accent, t.warning], 14, { x0: 500, x1: 1100 })}`;
};

// Duel Disk (light): the disk's rotating blade ring and a metallic sheen.
const duelDisk = (t) => {
  let blades = '';
  for (let i = 0; i < 5; i++) {
    blades += `<path d="M800 450L${polar(800, 450, 360, i * 72 - 10).join(' ')}A360 360 0 0 1 ${polar(800, 450, 360, i * 72 + 22).join(' ')}Z" fill="${t.text}" fill-opacity="0.05" stroke="${t.accent}" stroke-opacity="0.3" stroke-width="2"/>`;
  }
  return `<defs><linearGradient id="dbtefx-dd-sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0.4" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>
<g style="transform-origin: 800px 450px; animation: dbtefx-spin 70s linear infinite;">${blades}</g>
<circle cx="800" cy="450" r="120" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="10"/><circle cx="800" cy="450" r="40" fill="${t.accent2}" fill-opacity="0.35"/>
<rect x="-400" y="0" width="1200" height="${H}" fill="url(#dbtefx-dd-sheen)" style="animation: dbtefx-scanx 9s ease-in-out infinite;"/>`;
};

// Ritual: a summoning circle ringed by candles.
const ritual = (t) => {
  let candles = '';
  for (let i = 0; i < 8; i++) {
    const [x, y] = polar(800, 470, 330, i * 45);
    candles += `<rect x="${n1(x - 7)}" y="${n1(y - 10)}" width="14" height="36" rx="2" fill="${t.text}" fill-opacity="0.3"/><ellipse cx="${x}" cy="${n1(y - 22)}" rx="7" ry="14" fill="${t.accent2}" ${anim('flicker', n1(1.5 + (i % 3) * 0.4), i * 0.3, 'ease-in-out')}/>`;
  }
  return `<defs>${glow('dbtefx-ri-g', t.accent2, 0.5, 0.52, 0.45, 0.22)}</defs><rect width="${W}" height="${H}" fill="url(#dbtefx-ri-g)"/>
${runeRing(t, 800, 470, 290, t.accent, 100)}
<path d="${star(800, 470, 250)}" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="3" ${anim('pulse', 5, 0, 'ease-in-out')}/>
${candles}`;
};

// Shadow Realm: fog banks drifting, wisps rising, eyes in the mist.
const shadowRealm = (t) => {
  const rand = rng(107);
  const bank = (y, c, dur, delay) => `<ellipse cx="800" cy="${y}" rx="1000" ry="120" fill="${c}" fill-opacity="0.14" ${anim('drift', dur, delay, 'ease-in-out')}/>`;
  return `${bank(220, t.accent2, 16, 0)}${bank(520, t.accent, 20, 5)}${bank(800, t.accent2, 18, 9)}
${Array.from({ length: 3 }, (_, i) => {
    const x = 300 + i * 500 + rand() * 120;
    const y = 300 + rand() * 300;
    return `<g ${anim('pulse', n1(5 + rand() * 4), rand() * 5, 'ease-in-out')}><ellipse cx="${n1(x)}" cy="${n1(y)}" rx="14" ry="5" fill="${t.accent}" fill-opacity="0.7"/><ellipse cx="${n1(x + 40)}" cy="${n1(y)}" rx="14" ry="5" fill="${t.accent}" fill-opacity="0.7"/></g>`;
  }).join('')}
${embers(rand, [t.accent, t.accent2], 16, { size: 1.4 })}`;
};

// Sakura: a blossoming branch in the corner, petals drifting down.
const sakura = (t) => {
  const rand = rng(113);
  const petal = (x, s) =>
    `<g transform="translate(${n1(x)} 0)"><g ${anim('fall', n1(11 + rand() * 9), rand() * 20, 'ease-in-out')}><path d="M0 ${-12 * s}C${9 * s} ${-10 * s} ${10 * s} ${4 * s} 0 ${12 * s}C${-10 * s} ${4 * s} ${-9 * s} ${-10 * s} -2 ${-9 * s}L0 ${-12 * s}Z" fill="${rand() < 0.5 ? t.accent : mix(t.accent, '#ffffff', 0.4)}" fill-opacity="${n1(0.5 + rand() * 0.35)}"/></g></g>`;
  const blossom = (x, y, r) => {
    let p = '';
    for (let i = 0; i < 5; i++) {
      const [px, py] = polar(x, y, r * 0.55, i * 72 - 90);
      p += `<circle cx="${px}" cy="${py}" r="${n1(r * 0.5)}"/>`;
    }
    return `<g fill="${mix(t.accent, '#ffffff', 0.3)}" fill-opacity="0.55">${p}</g><circle cx="${x}" cy="${y}" r="${n1(r * 0.22)}" fill="${t.warning}" fill-opacity="0.7"/>`;
  };
  const flowers = [[300, 120, 22], [420, 70, 18], [520, 160, 24], [230, 230, 20], [640, 110, 16], [380, 200, 14], [700, 190, 20], [150, 60, 18]];
  return `<defs><radialGradient id="dbtefx-sk-g" cx="0.15" cy="0.1" r="0.6"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sk-g)"/>
<g fill="none" stroke="${mix(t.bg, t.text, 0.25)}" stroke-linecap="round"><path d="M-30 40Q200 90 380 130T760 180" stroke-width="14"/><path d="M260 106Q300 170 250 240" stroke-width="8"/><path d="M470 140Q520 90 640 100" stroke-width="7"/></g>
${flowers.map(([x, y, r]) => blossom(x, y, r)).join('')}
${Array.from({ length: 22 }, () => petal(rand() * W, 0.8 + rand() * 0.8)).join('')}`;
};

const SCENES = {
  branded,
  artmage,
  hero,
  'sky-striker': skyStriker,
  'snake-eye': snakeEye,
  labrynth,
  blackwing,
  lightsworn,
  frog,
  sakura,
  spell,
  trap,
  fusion,
  synchro,
  xyz,
  link,
  'white-dragon': whiteDragon,
  'dark-magic': darkMagic,
  'black-dragon': blackDragon,
  millennium,
  pendulum,
  divine,
  'duel-disk': duelDisk,
  ritual,
  'shadow-realm': shadowRealm,
};

export const SCENE_IDS = Object.keys(SCENES);

// The scene's markup for the fx layer, or '' when the preset has none.
export const sceneSvg = (presetId, tokens, { still = false } = {}) => {
  const draw = SCENES[presetId];
  // Colours go straight into markup: only well-formed hex values.
  if (!draw || !Object.values(tokens || {}).every(isHex)) return '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" width="100%" height="100%" class="${still ? 'dbtefx-still' : ''}"><style>${KEYFRAMES}
.dbtefx-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }</style>${draw(tokens)}</svg>`;
};
