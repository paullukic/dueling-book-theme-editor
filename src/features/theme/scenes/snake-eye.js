import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, polar, rng, W } from './kit.js';

// Snake-Eye: the serpent's slit eye opens in the dark. A scaled head lit by
// its own iris and the fire below, blue spirit flame, charred branches with
// ember cracks (Ash, Oak, Poplar are trees) and rising sparks.
const snakeEye = (t) => {
  const rand = rng(31);
  const [ex, ey, ir] = [1235, 236, 104];
  const upper = 'M1075 262C1120 140 1330 120 1400 205';
  const lowerBack = 'C1350 320 1130 345 1075 262';
  const lowerFwd = 'M1075 262C1130 345 1350 320 1400 205';
  const opening = `${upper}${lowerBack}Z`;

  // Iris: radial fibres, a ragged collarette, light and dark flecks.
  let fibreLight = '';
  let fibreDark = '';
  for (let i = 0; i < 84; i++) {
    const a = (i * 360) / 84 + rand() * 3;
    const [x0, y0] = polar(ex, ey, 14 + rand() * 12, a);
    const [xm, ym] = polar(ex, ey, 56, a + (rand() - 0.5) * 8);
    const [x1, y1] = polar(ex, ey, 70 + rand() * 30, a + (rand() - 0.5) * 4);
    const d = `M${x0} ${y0}Q${xm} ${ym} ${x1} ${y1}`;
    if (i % 2) fibreLight += d;
    else fibreDark += d;
  }
  // The Snake-Eye emblem: a ring of flame licks around the pupil.
  let emblem = '';
  for (let i = 0; i < 14; i++) {
    const a = i * (360 / 14);
    emblem += `M${polar(ex, ey, 34, a - 8).join(' ')}Q${polar(ex, ey, 52, a - 10).join(' ')} ${polar(ex, ey, 70, a + 5).join(' ')}Q${polar(ex, ey, 50, a + 9).join(' ')} ${polar(ex, ey, 34, a + 8).join(' ')}Z`;
  }
  let flecks = '';
  for (let i = 0; i < 22; i++) {
    const [fx, fy] = polar(ex, ey, 46 + rand() * 50, rand() * 360);
    flecks += `<circle cx="${fx}" cy="${fy}" r="${n1(1 + rand() * 2)}" fill="${i % 3 ? mix(t.accent2, '#ffffff', 0.4) : mix(t.accent, '#000000', 0.6)}" fill-opacity="0.6"/>`;
  }

  // Skin: one tile of overlapping scales, upper rows laid over lower ones so
  // every rounded free edge catches the light.
  const sc = (cx, cy) => `<path d="M${cx - 21} ${cy - 13}H${cx + 21}V${cy + 2}C${cx + 21} ${cy + 13} ${cx + 9} ${cy + 18} ${cx} ${cy + 18}C${cx - 9} ${cy + 18} ${cx - 21} ${cy + 13} ${cx - 21} ${cy + 2}Z"/>`;
  const tile = [sc(0, 30), sc(40, 30), sc(20, 15), sc(0, 0), sc(40, 0), sc(20, -15)].join('');

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

  // The coiled body: scales laid along the spine, each pointing to the tail,
  // so the coil reads as one serpent winding under the head.
  const segs = [
    [[1720, 560], [1420, 540], [1190, 690], [1290, 810]],
    [[1290, 810], [1350, 890], [1530, 900], [1720, 960]],
  ];
  const spine = [];
  segs.forEach((seg, k) => {
    for (let i = k ? 1 : 0; i <= 12; i++) {
      const s0 = i / 12;
      const [x, y] = bez(seg, s0);
      const [xa, ya] = bez(seg, Math.min(1, s0 + 0.01));
      const [xb, yb] = bez(seg, Math.max(0, s0 - 0.01));
      const l = Math.hypot(xa - xb, ya - yb) || 1;
      spine.push([x, y, (xa - xb) / l, (ya - yb) / l, 104 - spine.length * 1.5]);
    }
  });
  // Band chunks, each with the skin tile turned to run along the body.
  const edge = (i, v) => {
    const [x, y, tx, ty, w] = spine[i];
    return `${n1(x - ty * v * w)} ${n1(y + tx * v * w)}`;
  };
  let pats = '';
  let body = '';
  for (let i = 0; i < spine.length - 1; i += 3) {
    const j = Math.min(spine.length - 1, i + 3);
    const [, , tx, ty] = spine[Math.min(spine.length - 1, i + 1)];
    pats += `<pattern id="dbtefx-se-b${i}" href="#dbtefx-se-skin" patternTransform="rotate(${n1((Math.atan2(ty, tx) * 180) / Math.PI - 90)}) scale(0.8)"/>`;
    const top = [];
    const bot = [];
    for (let k = i; k <= j; k++) {
      top.push(edge(k, -0.52));
      bot.unshift(edge(k, 0.52));
    }
    body += `<path d="M${top.join('L')}L${bot.join('L')}Z" fill="url(#dbtefx-se-b${i})"/>`;
  }
  let rim = '';
  let belly = '';
  spine.forEach((_, i) => {
    rim += `${i ? 'L' : 'M'}${edge(i, -0.5)}`;
    belly += `${i ? 'L' : 'M'}${edge(i, 0.3)}`;
  });
  const coil = `<defs>${pats}</defs>${body}<path d="${belly}" fill="none" stroke="#000000" stroke-opacity="0.45" stroke-width="40" stroke-linejoin="round"/><path d="${rim}" fill="none" stroke="${mix(t.accent, t.accent2, 0.4)}" stroke-opacity="0.5" stroke-width="2.5" stroke-linejoin="round"/>`;

  // The head: brow over the eye, snout reaching left, jaw lit from below.
  const head = 'M1700 -60H1050C1025 80 1020 220 1030 330C1040 400 1070 440 1120 460C1210 500 1330 540 1450 560C1560 575 1640 570 1700 560Z';

  return `<style>@keyframes dbtefx-se-lick { 0%, 100% { transform: scale(1, 1) skewX(0deg); opacity: 0.85; } 35% { transform: scale(0.92, 1.1) skewX(-5deg); opacity: 1; } 70% { transform: scale(1.06, 0.9) skewX(4deg); opacity: 0.7; } }
@keyframes dbtefx-se-dilate { 0%, 100% { transform: scaleX(0.7); } 50% { transform: scaleX(1.2); } }
@keyframes dbtefx-se-gaze { 0%, 38%, 100% { transform: translate(0, 0); } 44%, 66% { transform: translate(-12px, 3px); } 72%, 94% { transform: translate(6px, -2px); } }
@keyframes dbtefx-se-lidu { 0%, 90%, 100% { transform: translateY(0); } 93.5%, 94.5% { transform: translateY(150px); } }
@keyframes dbtefx-se-lidl { 0%, 90%, 100% { transform: translateY(0); } 93.5%, 94.5% { transform: translateY(-30px); } }</style>
<defs>
<clipPath id="dbtefx-se-clip"><path d="${opening}"/></clipPath>
<linearGradient id="dbtefx-se-scale" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.5)}"/><stop offset="0.55" stop-color="${mix(t.bg, t.accent, 0.12)}"/><stop offset="0.88" stop-color="${mix(t.bg, t.accent, 0.32)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent2, 0.42)}"/></linearGradient>
<pattern id="dbtefx-se-skin" width="40" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-14) scale(0.9)"><g fill="url(#dbtefx-se-scale)" stroke="#000000" stroke-opacity="0.55" stroke-width="1.2">${tile}</g></pattern>
<pattern id="dbtefx-se-fine" width="40" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(-8) scale(0.45)"><g fill="url(#dbtefx-se-scale)" stroke="#000000" stroke-opacity="0.55" stroke-width="1.6">${tile}</g></pattern>
<radialGradient id="dbtefx-se-fade" gradientUnits="userSpaceOnUse" cx="${ex + 90}" cy="${ey + 40}" r="400"><stop offset="0.3" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<mask id="dbtefx-se-mask"><rect x="700" y="-100" width="1000" height="800" fill="url(#dbtefx-se-fade)"/></mask>
<linearGradient id="dbtefx-se-light" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0.75"/><stop offset="0.45" stop-color="#000000" stop-opacity="0.1"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.12"/></linearGradient>
<radialGradient id="dbtefx-se-iris"><stop offset="0" stop-color="${mix(t.accent2, '#ffffff', 0.35)}"/><stop offset="0.3" stop-color="${t.accent2}"/><stop offset="0.62" stop-color="${t.accent}"/><stop offset="0.9" stop-color="${mix(t.accent, '#000000', 0.45)}"/><stop offset="1" stop-color="${mix(t.accent, '#000000', 0.75)}"/></radialGradient>
<linearGradient id="dbtefx-se-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0.8"/><stop offset="0.4" stop-color="#000000" stop-opacity="0"/><stop offset="0.85" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.45"/></linearGradient>
<radialGradient id="dbtefx-se-corner" gradientUnits="userSpaceOnUse" cx="${ex}" cy="${ey}" r="175"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.7"/></radialGradient>
<linearGradient id="dbtefx-se-lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.3)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.28)}"/></linearGradient>
<linearGradient id="dbtefx-se-brow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0.85"/><stop offset="1" stop-color="#000000" stop-opacity="0.35"/></linearGradient>
<linearGradient id="dbtefx-se-lickg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0"/><stop offset="0.15" stop-color="${mix(t.accent2, '#ffffff', 0.3)}" stop-opacity="0.85"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.6"/><stop offset="1" stop-color="${t.danger}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-se-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.6"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.danger}" stop-opacity="0"/></linearGradient>
${glow('dbtefx-se-halo', t.accent, 0.5, 0.5, 0.5, 0.55)}${glow('dbtefx-se-ground', t.accent, 0.5, 1, 0.8, 0.38)}${glow('dbtefx-se-wet', '#ffffff', 0.5, 0.5, 0.5, 0.35)}
</defs>
<rect x="-200" y="-200" width="${W + 400}" height="${H + 400}" fill="${t.bg}" fill-opacity="0.5"/>
<rect x="-200" y="300" width="${W + 400}" height="${H}" fill="url(#dbtefx-se-ground)"/>
${fire(180, H + 20, 1.3, 'dbtefx-se-fire', 0)}${fire(1480, H + 20, 1.5, 'dbtefx-se-fire', 1.2)}
<!--mid-->
${coil}
<g transform="translate(1302 232) scale(0.85) translate(-1235 -236)">
<g mask="url(#dbtefx-se-mask)">
<path d="${head}" fill="url(#dbtefx-se-skin)"/>
<ellipse cx="${ex + 5}" cy="${ey}" rx="235" ry="150" fill="url(#dbtefx-se-fine)"/>
<path d="${head}" fill="url(#dbtefx-se-light)"/>
<ellipse cx="${ex}" cy="${ey + 10}" rx="330" ry="230" fill="url(#dbtefx-se-halo)" ${anim('pulse', 6, 0, 'ease-in-out')}/>
</g>
<path d="M1030 150C1100 50 1300 10 1480 90C1520 110 1540 140 1530 170C1420 90 1200 80 1060 190C1040 205 1030 185 1030 150Z" fill="url(#dbtefx-se-skin)"/><path d="M1030 150C1100 50 1300 10 1480 90C1520 110 1540 140 1530 170C1420 90 1200 80 1060 190C1040 205 1030 185 1030 150Z" fill="url(#dbtefx-se-brow)"/>
<path d="M1060 190C1200 80 1420 90 1530 170" fill="none" stroke="${mix(t.bg, t.accent, 0.45)}" stroke-width="3" stroke-opacity="0.8"/>
<path d="M1050 250C1090 110 1340 70 1430 190C1340 100 1130 120 1075 262Z" fill="url(#dbtefx-se-lid)"/>
<path d="M1075 262C1130 345 1350 320 1400 205C1380 350 1120 380 1075 262Z" fill="url(#dbtefx-se-lid)"/>
<g clip-path="url(#dbtefx-se-clip)">
<rect x="1060" y="100" width="360" height="260" fill="${mix(t.bg, t.danger, 0.3)}"/>
<g ${anim('se-gaze', 17, 3, 'ease-in-out')}>
<circle cx="${ex}" cy="${ey}" r="${ir}" fill="url(#dbtefx-se-iris)"/>
<path d="${fibreDark}" fill="none" stroke="${mix(t.accent, '#000000', 0.5)}" stroke-opacity="0.5" stroke-width="1.3"/>
<path d="${fibreLight}" fill="none" stroke="${mix(t.accent2, '#ffffff', 0.3)}" stroke-opacity="0.4" stroke-width="1.1"/>
<path d="${emblem}" fill="${mix(t.danger, '#000000', 0.35)}" fill-opacity="0.5" stroke="${mix(t.accent2, '#ffffff', 0.3)}" stroke-opacity="0.55" stroke-width="1.2"/>
<circle cx="${ex}" cy="${ey}" r="34" fill="none" stroke="${mix(t.accent2, '#ffffff', 0.3)}" stroke-opacity="0.55" stroke-width="2"/>
${flecks}
<circle cx="${ex}" cy="${ey}" r="${ir - 3}" fill="none" stroke="${mix(t.accent, '#000000', 0.7)}" stroke-opacity="0.8" stroke-width="6"/>
<g style="transform-origin: ${ex}px ${ey}px; animation: dbtefx-se-dilate 5s ease-in-out -1s infinite;">
<path d="M${ex} ${ey - 98}Q${ex + 26} ${ey} ${ex} ${ey + 98}Q${ex - 26} ${ey} ${ex} ${ey - 98}Z" fill="${mix(t.bg, '#000000', 0.75)}"/>
</g>
</g>
<rect x="1060" y="100" width="360" height="260" fill="url(#dbtefx-se-corner)"/>
<rect x="1060" y="120" width="360" height="220" fill="url(#dbtefx-se-shade)"/>
<ellipse cx="${ex - 42}" cy="${ey - 50}" rx="40" ry="26" fill="url(#dbtefx-se-wet)"/>
<rect x="${ex - 58}" y="${ey - 60}" width="30" height="17" rx="7" fill="#ffffff" fill-opacity="0.85" transform="rotate(-14 ${ex - 43} ${ey - 52})"/>
<circle cx="${ex + 46}" cy="${ey + 52}" r="3.5" fill="#ffffff" fill-opacity="0.55"/>
<path d="M1084 266C1140 340 1345 316 1392 212" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2"/>
<g style="animation: dbtefx-se-lidu 9s ease-in-out -2s infinite;"><path d="${upper}L1420 -40L1060 -40Z" fill="url(#dbtefx-se-lid)" stroke="${mix(t.accent, t.bg, 0.45)}" stroke-width="4"/></g>
<g style="animation: dbtefx-se-lidl 9s ease-in-out -2s infinite;"><path d="${lowerFwd}L1420 380L1060 380Z" fill="url(#dbtefx-se-lid)" stroke="${mix(t.accent, t.bg, 0.55)}" stroke-width="3"/></g>
</g>
<path d="${upper}" fill="none" stroke="${mix(t.accent, t.bg, 0.45)}" stroke-width="4"/>
<path d="${lowerFwd}" fill="none" stroke="${mix(t.accent, t.bg, 0.55)}" stroke-width="3"/>
</g>
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
