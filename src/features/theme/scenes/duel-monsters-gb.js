import { n1 } from './kit.js';
import { bayer, inPoly, pxGrid, pxText, raster, textWidth } from './pixel-kit.js';

// Duel Monsters (Game Boy, 1998): the pea-green four-shade LCD. The right
// third is the handheld's duel screen drawn pixel for pixel: an LP window, a
// card in a heavy ink frame holding a dithered dragon, its ATK/DEF window, a
// row of hand cards and the message window typing out its line with a
// blinking cursor. Everything sits on the LCD's faint pixel grid.

const P = 5;

// Ink shapes with a one-pixel stepped corner (the LCD's rounded window).
const stepRect = (x, y, w, h, c) => `M${n1(x + c)} ${n1(y)}H${n1(x + w - c)}V${n1(y + c)}H${n1(x + w)}V${n1(y + h - c)}H${n1(x + w - c)}V${n1(y + h)}H${n1(x + c)}V${n1(y + h - c)}H${n1(x)}V${n1(y + c)}H${n1(x + c)}Z`;

// Shade 0-3 with ordered dithering between neighbours.
const tone = (v, i, j) => {
  const c = Math.max(0, Math.min(3, v));
  const f = Math.floor(c);
  return String(Math.min(3, f + (c - f > bayer(i, j) ? 1 : 0)));
};

// The dragon: head left, open jaw, horns swept back, bat wing behind, neck down to the right.
const WING = [[27, 31], [31, 18], [37, 8], [44, 2], [48, 1], [48, 34], [44, 29], [41, 35], [37, 30], [33, 37], [29, 37]];
const NECK = [[21, 25], [30, 23], [37, 30], [43, 41], [47, 56], [29, 56], [29, 47], [25, 36]];
const HEAD = [[2, 21], [8, 17], [16, 14], [23, 12], [29, 13], [33, 18], [32, 24], [25, 26], [16, 25], [8, 24], [2, 24]];
const JAW = [[6, 30], [14, 29], [22, 29], [28, 27], [31, 30], [25, 34], [15, 35], [7, 33]];
const MOUTH = [[3, 24.5], [29, 25.5], [29, 28.5], [6, 30.5]];
const HORN = [[23, 13], [28, 7], [34, 2.5], [42, 0.5], [38, 5.5], [33, 10.5], [31, 16]];
const BROW = [[16, 14.5], [19, 8], [22, 4.5], [22, 9], [21, 14]];
const RIBS = [[[28, 31], [44, 2]], [[28, 31], [48, 18]]];

const nearSeg = (x, y, [[ax, ay], [bx, by]]) => {
  const dx = bx - ax;
  const dy = by - ay;
  const k = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - ax - k * dx, y - ay - k * dy) < 0.55;
};

const dragon = () => {
  const rows = raster(48, 56, (x0, y) => {
    const x = x0 - 1.5;
    const i = Math.floor(x);
    const j = Math.floor(y);
    if (i >= 18 && i <= 19 && j >= 17 && j <= 18) return i === 19 && j === 17 ? '3' : '0';
    if (i === 4 && j === 20) return '0';
    if (inPoly(x, y, HORN)) return tone(3.2 - (x - 23) / 12, i, j);
    if (inPoly(x, y, BROW)) return tone(2.8 - (14 - y) / 8, i, j);
    if (inPoly(x, y, MOUTH)) return (j === 25 || j === 28) && i % 3 === 1 && i > 6 && i < 27 ? '3' : '0';
    if (inPoly(x, y, HEAD)) return j === 16 && i > 15 && i < 22 ? '1' : tone(3.3 - (y - 12) / 5.5 + (i < 6 ? 0.4 : 0), i, j);
    if (inPoly(x, y, JAW)) return tone(2.2 - (y - 29) / 3.5, i, j);
    if (inPoly(x, y, NECK)) {
      const belly = x - 25 - (y - 30) * 0.55;
      if (belly < 4 && (j % 3 === 0)) return '1';
      return tone(belly < 4 ? 2.9 : 2.3 - (belly - 4) / 6, i, j);
    }
    if (inPoly(x, y, WING)) return RIBS.some((s) => nearSeg(x, y, s)) ? '0' : tone(1.25 - (y - 4) / 60, i, j);
    return '';
  }, '0');
  // Sky behind: diagonal hatching on the lightest shade, darker toward the ground.
  return rows.map((row, j) => [...row].map((c, i) => {
    if (c !== '.') return c;
    if (j > 47) return tone(1.9 - (j - 47) / 9, i, j);
    return (i + j) % 5 === 0 ? '2' : '3';
  }).join(''));
};

// A sword and a shield, 7x7 pixels.
const SWORD = ['0000001', '0000010', '0000100', '1001000', '0110000', '0110000', '1001000'];
const SHIELD = ['1111111', '1000001', '1011101', '1011101', '0100010', '0010100', '0001000'];
const icon = (rows, x, y, p) => pxGrid(rows, x, y, p, ['1'])['1'];

const scene = (t) => {
  const ink = t.text;
  const dark = t.muted;
  const light = t.bg;
  const pale = t.surface;

  // A window: ink outline two pixels thick around the palest shade.
  const win = (x, y, w, h) => `<path d="${stepRect(x, y, w, h, P)}" fill="${ink}"/><path d="${stepRect(x + 2 * P, y + 2 * P, w - 4 * P, h - 4 * P, P)}" fill="${pale}"/>`;

  // LP window.
  const lp = `${win(1160, 92, 256, 64)}<path d="${pxText('LP', 1180, 114, 3, true)}" fill="${ink}"/>`;
  const lpA = `<path d="${pxText('8000', 1258, 107, 5, true)}" fill="${ink}"/>`;
  const lpB = `<path d="${pxText('6500', 1258, 107, 5, true)}" fill="${ink}"/>`;

  // The card: heavy ink frame with a pale inner rule, then the art.
  const cx = 1176;
  const cy = 172;
  const A = 4;
  const art = pxGrid(dragon(), cx + 4 * A, cy + 4 * A, A, ['0', '1', '2', '3']);
  const card = `<path d="${stepRect(cx, cy, 224, 256, A)}" fill="${ink}"/><path d="M${cx + 2 * A} ${cy + 2 * A}h${224 - 4 * A}v${256 - 4 * A}h${-(224 - 4 * A)}z" fill="none" stroke="${light}" stroke-width="${A / 2}"/><g shape-rendering="crispEdges"><path d="${art['3']}" fill="${pale}"/><path d="${art['2']}" fill="${light}"/><path d="${art['1']}" fill="${dark}"/><path d="${art['0']}" fill="${ink}"/></g>`;

  // ATK / DEF window.
  const stats = `${win(1160, 446, 256, 58)}<path d="${icon(SWORD, 1180, 461, 4)}${pxText('1500', 1212, 465, 3)}${icon(SHIELD, 1290, 461, 4)}${pxText('1200', 1326, 465, 3)}" fill="${ink}"/>`;

  // Hand: five small card backs.
  let hand = '';
  for (let k = 0; k < 5; k++) {
    const x = 1164 + k * 51;
    hand += `<path d="${stepRect(x, 520, 40, 50, 4)}" fill="${ink}"/><rect x="${x + 8}" y="${528}" width="24" height="34" fill="${pale}"/><path d="M${x + 20} ${533}l8 12l-8 12l-8-12z" fill="${dark}"/>`;
  }

  // Message window: the first line printed, the second typing in behind a sliding mask.
  const mx = 1140;
  const my = 590;
  const line1 = 'YOUR MOVE.';
  const line2 = 'CHOOSE A CARD';
  const w2 = textWidth(line2, 3);
  const msg = `${win(mx, my, 280, 116)}<path d="${pxText(line1, mx + 22, my + 24, 3)}${pxText(line2, mx + 22, my + 60, 3)}" fill="${ink}"/>`;
  const steps = line2.length;
  const mask = `<rect x="${mx + 20}" y="${my + 57}" width="${w2 + 4}" height="28" fill="${pale}" style="animation: dbtefx-gb-type 7s steps(${steps}, end) infinite; transform-box: fill-box; transform-origin: right center;"/>`;
  const cursor = `<path d="M${mx + 248} ${my + 90}h12l-6 8z" fill="${ink}" style="animation: dbtefx-gb-blink 1s steps(1, end) infinite;"/>`;

  // The LCD's pixel grid and its slight darkening toward the bezel.
  const grid = `<defs><pattern id="dbtefx-gb-px" width="${P}" height="${P}" patternUnits="userSpaceOnUse"><path d="M0 ${P - 0.5}H${P}M${P - 0.5} 0V${P}" stroke="${ink}" stroke-opacity="0.07" stroke-width="1"/></pattern><radialGradient id="dbtefx-gb-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="${dark}" stop-opacity="0"/><stop offset="1" stop-color="${dark}" stop-opacity="0.22"/></radialGradient></defs><rect width="1600" height="900" fill="${light}"/><rect width="1600" height="900" fill="url(#dbtefx-gb-px)"/><rect width="1600" height="900" fill="url(#dbtefx-gb-vig)"/>`;

  return `<style>@keyframes dbtefx-gb-type { 0% { transform: scaleX(1); } 55%, 100% { transform: scaleX(0); } }
@keyframes dbtefx-gb-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes dbtefx-gb-lpa { 0%, 49.9% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes dbtefx-gb-lpb { 0%, 49.9% { opacity: 0; } 50%, 100% { opacity: 1; } }
@keyframes dbtefx-gb-idle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(${P}px); } }</style>${grid}
<!--mid-->
<g shape-rendering="crispEdges" opacity="0.18">${lp}<g style="animation: dbtefx-gb-lpa 14s steps(1, end) infinite;">${lpA}</g><g style="animation: dbtefx-gb-lpb 14s steps(1, end) infinite;">${lpB}</g>
<g style="animation: dbtefx-gb-idle 1.6s steps(1, end) infinite;">${card}</g>${stats}${hand}${msg}${mask}${cursor}</g>`;
};

export default scene;
