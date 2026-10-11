import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Toon: Toon World as a pop-up book on the right. A page turns, the castle
// flats spring up out of the spread one after another with squash and stretch,
// a POW burst lands with them, then everything folds flat again. Inked like a
// printed comic: heavy black line, a misregistered second line, Ben-Day dots.

const ink = '#000000';

// A wobbly hand-inked quad: straight sides bowed a little, like a brush line.
const wob = (pts, bow = 4) => {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const k = (i % 2 ? -bow : bow) / len;
    d += `Q${n1(mx - (b[1] - a[1]) * k)} ${n1(my + (b[0] - a[0]) * k)} ${b[0]} ${b[1]}`;
  }
  return `${d}Z`;
};

const toon = (t) => {
  const stone = mix(t.border, t.text, 0.5);
  const stoneDk = mix(t.border, t.text, 0.25);
  const roof = t.link;
  const roofDk = mix(t.link, t.bg, 0.35);
  const page = t.text;
  const cover = t.accent2;
  const lit = t.accent;
  const off = t.accent2;
  const rayTone = mix(t.bg, t.border, 0.6);
  const rand = rng(31);

  // Rays behind the castle, turning slowly: the comic splash-panel backdrop.
  let rays = '';
  for (let i = 0; i < 16; i++) {
    const [x1, y1] = polar(1250, 560, 1100, i * 22.5);
    const [x2, y2] = polar(1250, 560, 1100, i * 22.5 + 11);
    rays += `M1250 560L${x1} ${y1}L${x2} ${y2}Z`;
  }

  // One crooked tower: a banana-bent wall, a witch-hat roof whose tip curls over,
  // pointed gothic windows lit from inside, a dotted shade side, a pennant.
  const tower = (x, base, w, h, lean, roofH, windows, delay, back = false) => {
    const top = base - h;
    const c = lean < 0 ? -1 : 1;
    const bend = -lean * 0.6;
    const side = (x0, x1) => `M${x0} ${base}Q${n1(x0 + bend)} ${n1(base - h / 2)} ${n1(x1)} ${top}`;
    const wall = `${side(x, x + lean)}L${n1(x + w + lean)} ${top}Q${n1(x + w + bend)} ${n1(base - h / 2)} ${x + w} ${base}Z`;
    const shade = `${side(x + w * 0.64, x + lean + w * 0.64)}L${n1(x + w + lean)} ${top}Q${n1(x + w + bend)} ${n1(base - h / 2)} ${x + w} ${base}Z`;
    const rx = n1(x + lean - 12);
    const rw = w + 24;
    const tipX = n1(x + lean + w / 2 + c * roofH * 0.32);
    const tipY = n1(top - roofH);
    const cone = `M${rx} ${top + 6}Q${n1(rx + rw * 0.4)} ${n1(top - roofH * 0.35)} ${tipX} ${tipY}Q${n1(tipX + c * 24)} ${n1(tipY - 16)} ${n1(tipX + c * 30)} ${n1(tipY + 4)}Q${n1(tipX + c * 18)} ${n1(tipY - 2)} ${n1(tipX + c * 6)} ${n1(tipY + 14)}Q${n1(rx + rw * 0.66)} ${n1(top - roofH * 0.3)} ${n1(rx + rw)} ${top + 6}Q${n1(rx + rw / 2)} ${top + 20} ${rx} ${top + 6}Z`;
    let win = '';
    windows.forEach(([fx, fy, ww, wh]) => {
      const wx = n1(x + fx * w + lean * fy + bend * Math.sin(fy * Math.PI) * 0.5);
      const wy = n1(base - fy * h);
      win += `M${wx} ${wy}v${-wh}Q${wx} ${n1(wy - wh - ww * 0.6)} ${n1(wx + ww / 2)} ${n1(wy - wh - ww * 0.9)}Q${n1(wx + ww)} ${n1(wy - wh - ww * 0.6)} ${n1(wx + ww)} ${n1(wy - wh)}v${wh}Z`;
    });
    const fx = n1(tipX + c * 30);
    const fy = n1(tipY + 4);
    return `<g style="transform-box: fill-box; transform-origin: 50% 100%; animation: dbtefx-tn-pop 9s cubic-bezier(.3,.7,.4,1) ${n1(-9 + delay)}s infinite;">
<path d="${wall}" fill="none" stroke="${off}" stroke-width="5" transform="translate(6 4)"/><path d="${cone}" fill="none" stroke="${off}" stroke-width="5" transform="translate(6 4)"/>
<path d="${wall}" fill="${back ? stoneDk : stone}"/><path d="${shade}" fill="${back ? mix(stoneDk, t.bg, 0.3) : stoneDk}"/><path d="${shade}" fill="url(#dbtefx-tn-dots)"/>
<path d="${win}" fill="${lit}" stroke="${ink}" stroke-width="3.5" stroke-linejoin="round"/>
<path d="${wall}" fill="none" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
<path d="${cone}" fill="${back ? roofDk : roof}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
<path d="M${fx} ${fy}l${c * 4} -30" stroke="${ink}" stroke-width="4"/>
<path d="M${n1(fx + c * 4)} ${n1(fy - 30)}q${c * 18} -3 ${c * 34} 8q${c * -16} 5 ${c * -34} 13Z" fill="${off}" stroke="${ink}" stroke-width="3.5" stroke-linejoin="round" style="transform-box: fill-box; transform-origin: ${c > 0 ? '0' : '100%'} 50%; animation: dbtefx-tn-flag 1.2s ease-in-out ${n1(-rand() * 1.2)}s infinite;"/>
</g>`;
  };

  // Front wall with crenellations and an arched gate, springing up last.
  const wallTop = 612;
  let cren = `M1124 760L1124 ${wallTop}`;
  for (let x = 1124; x < 1376; x += 42) cren += `h21v-22h21v22`;
  cren += `L1376 ${wallTop}L1376 760Z`;
  const gate = `M1214 760v-74q36 -52 72 0v74Z`;
  let bars = '';
  for (let x = 1228; x < 1286; x += 14) bars += `M${x} 760v-${x > 1240 && x < 1262 ? 108 : 90}`;
  const front = `<g style="transform-box: fill-box; transform-origin: 50% 100%; animation: dbtefx-tn-pop 9s cubic-bezier(.3,.7,.4,1) ${n1(-9 + 0.75)}s infinite;">
<path d="${cren}" fill="none" stroke="${off}" stroke-width="5" transform="translate(6 4)"/>
<path d="${cren}" fill="${stone}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
<path d="M1124 ${wallTop + 34}H1376M1124 ${wallTop + 76}H1214M1286 ${wallTop + 76}H1376M1160 ${wallTop}v34M1330 ${wallTop}v34M1190 ${wallTop + 34}v42M1312 ${wallTop + 34}v42" stroke="${stoneDk}" stroke-width="3"/>
<path d="${gate}" fill="${mix(t.bg, ink, 0.3)}" stroke="${ink}" stroke-width="5"/>
<path d="${bars}" stroke="${roof}" stroke-width="4"/>
<path d="M1300 ${wallTop}L1376 ${wallTop}L1376 760L1300 760Z" fill="url(#dbtefx-tn-dots)"/>
</g>`;

  // The open book lying on its back, spine toward the viewer's centre.
  const leftPage = 'M1250 676Q1160 650 1074 660L1050 784Q1150 772 1250 806Z';
  const rightPage = 'M1250 676Q1340 650 1426 660L1450 784Q1350 772 1250 806Z';
  let lines = '';
  for (let i = 0; i < 6; i++) {
    const y = 690 + i * 16;
    lines += `M${1086 - i * 4} ${y - 14 + i * 1.5}Q1160 ${y - 22} 1232 ${y + 2}M${1268} ${y + 2}Q1340 ${y - 22} ${1414 + i * 4} ${y - 14 + i * 1.5}`;
  }

  // POW: a jagged burst that lands with the castle.
  const burst = (cx, cy, r) => {
    const p = [];
    for (let i = 0; i < 22; i++) p.push(polar(cx, cy, i % 2 ? r * 0.62 : r * (0.9 + rand() * 0.25), i * (360 / 22) + rand() * 6).join(' '));
    return `M${p.join('L')}Z`;
  };
  const pow = burst(1352, 178, 70);

  return `<style>
@keyframes dbtefx-tn-pop { 0%, 9% { transform: scale(1.04, 0.02); } 15% { transform: scale(0.9, 1.16); } 19% { transform: scale(1.08, 0.9); } 23% { transform: scale(0.98, 1.03); } 26%, 84% { transform: scale(1, 1); } 90%, 100% { transform: scale(1.04, 0.02); } }
@keyframes dbtefx-tn-turn { 0% { transform: scaleX(1); opacity: 1; } 9% { transform: scaleX(-1); opacity: 1; } 10%, 92% { transform: scaleX(-1); opacity: 0; } 93%, 100% { transform: scaleX(1); opacity: 0; } }
@keyframes dbtefx-tn-pow { 0%, 25% { transform: scale(0) rotate(-20deg); } 29% { transform: scale(1.22) rotate(4deg); } 32% { transform: scale(0.94) rotate(-2deg); } 35%, 82% { transform: scale(1) rotate(0deg); } 86%, 100% { transform: scale(0) rotate(10deg); } }
@keyframes dbtefx-tn-flag { 0%, 100% { transform: scaleX(1) skewY(0deg); } 50% { transform: scaleX(0.82) skewY(8deg); } }
@keyframes dbtefx-tn-turnrays { to { transform: rotate(360deg); } }
</style>
<defs>
<pattern id="dbtefx-tn-dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><circle cx="4.5" cy="4.5" r="2.1" fill="${ink}" fill-opacity="0.45"/></pattern>
<pattern id="dbtefx-tn-ben" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="8" cy="8" r="3.2" fill="${t.accent2}" fill-opacity="0.38"/></pattern>
<radialGradient id="dbtefx-tn-ray" cx="1250" cy="560" r="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${rayTone}" stop-opacity="0.9"/><stop offset="0.5" stop-color="${rayTone}" stop-opacity="0.35"/><stop offset="1" stop-color="${rayTone}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-tn-spot" cx="1250" cy="540" r="420" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<mask id="dbtefx-tn-fade"><rect width="${W}" height="${H}" fill="url(#dbtefx-tn-spot)"/></mask>
</defs>
<rect width="${W}" height="${H}" fill="${t.bg}"/>
<g style="transform-origin: 1250px 560px; animation: dbtefx-tn-turnrays 90s linear infinite;"><path d="${rays}" fill="url(#dbtefx-tn-ray)"/></g>
<rect width="${W}" height="${H}" fill="url(#dbtefx-tn-ben)" mask="url(#dbtefx-tn-fade)"/>
<!--mid-->
<g transform="translate(-24 0) translate(1250 850) scale(0.92) translate(-1250 -850)">
<path d="M1040 770L1250 820L1460 770L1468 800L1250 850L1032 800Z" fill="none" stroke="${off}" stroke-width="5" transform="translate(6 4)"/>
<path d="M1040 770L1250 820L1460 770L1468 800L1250 850L1032 800Z" fill="${cover}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
<path d="M1050 784Q1150 772 1250 806Q1350 772 1450 784L1456 798Q1350 788 1250 824Q1150 788 1044 798Z" fill="${mix(page, t.muted, 0.4)}" stroke="${ink}" stroke-width="3.5" stroke-linejoin="round"/>
${tower(1146, 686, 44, 250, -30, 96, [[0.28, 0.72, 18, 24]], 0.1, true)}
${tower(1302, 686, 46, 270, 30, 104, [[0.28, 0.7, 18, 24], [0.28, 0.4, 18, 22]], 0.18, true)}
${tower(1090, 700, 62, 180, -22, 88, [[0.3, 0.52, 20, 26], [0.3, 0.18, 20, 24]], 0.28)}
${tower(1346, 700, 60, 186, 22, 86, [[0.3, 0.56, 20, 26], [0.3, 0.2, 20, 24]], 0.38)}
${tower(1204, 690, 92, 300, -8, 140, [[0.16, 0.76, 22, 30], [0.58, 0.76, 22, 30], [0.37, 0.46, 24, 36]], 0.5)}
<path d="${leftPage}" fill="${page}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
<path d="${rightPage}" fill="${page}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
<path d="${lines}" fill="none" stroke="${t.muted}" stroke-width="3" stroke-linecap="round"/>
<path d="M1250 676V806" stroke="${ink}" stroke-width="4"/>
${front}
<g style="transform-origin: 1250px 740px; animation: dbtefx-tn-turn 9s ease-in-out infinite;"><path d="${rightPage}" fill="${mix(page, t.muted, 0.15)}" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/></g>
</g>
<!--near-->
<g style="transform-box: fill-box; transform-origin: center; animation: dbtefx-tn-pow 9s cubic-bezier(.3,.7,.4,1) infinite;">
<path d="${pow}" fill="none" stroke="${off}" stroke-width="6" transform="translate(7 5)"/>
<path d="${pow}" fill="${lit}" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/>
<text x="1352" y="194" text-anchor="middle" font-family="Impact, 'Arial Black', sans-serif" font-size="42" font-weight="900" fill="${t.accent2}" stroke="${ink}" stroke-width="4" paint-order="stroke" transform="rotate(-8 1352 178)">POW!</text>
</g>`;
};

export default toon;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'star', count: 26, colors: ['accent', 'text'] },
  { kind: 'mote', count: 16, colors: ['accent2', 'link'], light: true },
];
