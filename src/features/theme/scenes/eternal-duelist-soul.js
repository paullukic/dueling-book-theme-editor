import { mix } from '../../../lib/color.js';
import { bayer, inPoly, pxGrid, raster } from './pixel-kit.js';

// The Eternal Duelist Soul (Game Boy Advance, 2002): bright 15-bit sprites on
// the title screen's glowing grid. The right third is the handheld's duel
// field seen from above: a sandstone-brick board with pale blue card slots
// and a dragon card in attack position. No HUD text; the board shows only off the
// main menu, duel and front page (chrome/eternal-duelist-soul.js).

const A = 4;

// A small winged dragon in profile for the card art (keys: o outline, 1 dark, 2 mid, 3 light).
const WING = [[16, 10], [22, 2], [30, 1], [27, 7], [31, 9], [24, 13], [20, 16]];
const BODY = [[6, 14], [12, 11], [19, 12], [24, 17], [26, 24], [20, 27], [12, 26], [8, 22]];
const HEAD = [[1, 9], [5, 6], [10, 6], [13, 9], [12, 13], [6, 14], [2, 12]];
const TAIL = [[22, 24], [28, 25], [31, 30], [26, 28], [20, 27]];
const dragon = () => raster(32, 32, (x, y) => {
  const i = Math.floor(x);
  const j = Math.floor(y);
  if (i === 8 && j === 8) return 'o';
  if (inPoly(x, y, HEAD)) return j < 9 ? '3' : '2';
  if (inPoly(x, y, WING)) return (i + j) % 6 === 0 ? '1' : j < 6 ? '2' : '1';
  if (inPoly(x, y, BODY)) return y < 16 + (x - 6) * 0.1 ? '3' : (y > 22 ? '1' : (0.5 > bayer(i, j) ? '2' : '3'));
  if (inPoly(x, y, TAIL)) return '2';
  if ((i === 11 || i === 17) && j >= 25 && j <= 28) return '1';
  return '';
}, 'o');

const scene = (t) => {
  const sand = mix(mix(t.warning, t.accent, 0.3), t.muted, 0.45);
  const sandLo = mix(sand, t.bg, 0.45);
  const sandHi = mix(sand, '#ffffff', 0.35);
  const slot = mix(t.border, '#ffffff', 0.25);
  const ink = mix(t.bg, '#000000', 0.5);

  // The board: sandstone bricks, 5 x 4 card slots.
  const bx = 1140;
  const by = 160;
  const bw = 292;
  const bh = 392;
  let slots = '';
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 5; c++) {
      const x = bx + 10 + c * 56;
      const y = by + 12 + r * 94 + (r > 1 ? 4 : 0);
      slots += `<rect x="${x + A}" y="${y + A}" width="${48 - 2 * A}" height="${72 - 2 * A}" fill="${mix(slot, sand, 0.55)}"/><path d="M${x} ${y + A}h${A}v${-A}h${48 - 2 * A}v${A}h${A}v${72 - 2 * A}h${-A}v${A}h${-(48 - 2 * A)}v${-A}h${-A}z" fill="none" stroke="${slot}" stroke-width="${A}"/>`;
    }
  }
  const slotXY = (c, r) => [bx + 10 + c * 56, by + 12 + r * 94 + (r > 1 ? 4 : 0)];

  // Face-down cards (opponent's), drawn as GBA sprites.
  const faceDown = (c, r) => {
    const [x, y] = slotXY(c, r);
    return `<rect x="${x + 2}" y="${y + 2}" width="44" height="68" fill="${ink}"/><rect x="${x + 6}" y="${y + 6}" width="36" height="60" fill="${mix(t.accent, t.bg, 0.45)}"/><rect x="${x + 14}" y="${y + 18}" width="20" height="36" fill="${mix(t.danger, t.bg, 0.5)}"/><rect x="${x + 18}" y="${y + 26}" width="12" height="20" fill="${ink}"/>`;
  };
  // Our dragon in attack position: yellow monster frame, art, ATK bar.
  const [dx, dy] = slotXY(2, 2);
  const art = pxGrid(dragon(), dx + 8, dy + 10, 1, ['o', '1', '2', '3']);
  const ours = `<rect x="${dx + 2}" y="${dy + 2}" width="44" height="68" fill="${ink}"/><rect x="${dx + 5}" y="${dy + 5}" width="38" height="62" fill="${t.warning}"/><rect x="${dx + 7}" y="${dy + 9}" width="34" height="34" fill="${mix(t.self, '#ffffff', 0.3)}"/><g shape-rendering="crispEdges"><path d="${art['3']}" fill="${mix(t.accent, '#ffffff', 0.45)}"/><path d="${art['2']}" fill="${t.accent}"/><path d="${art['1']}" fill="${mix(t.accent, t.danger, 0.6)}"/><path d="${art['o']}" fill="${ink}"/></g><rect x="${dx + 8}" y="${dy + 48}" width="32" height="14" fill="${mix(t.warning, '#ffffff', 0.55)}"/>`;

  // Title-screen grid.
  let grid = '';
  for (let x = 0; x <= 1600; x += 50) grid += `M${x} 0V900`;
  for (let y = 0; y <= 900; y += 50) grid += `M0 ${y}H1600`;

  return `<defs>
<pattern id="dbtefx-eds-brick" width="32" height="16" patternUnits="userSpaceOnUse"><rect width="32" height="16" fill="${sand}"/><path d="M0 0H32V4H0Z" fill="${sandHi}" fill-opacity="0.5"/><path d="M0 7H32V8H0ZM0 15H32V16H0ZM15 0H16V8H15ZM31 8H32V16H31Z" fill="${sandLo}"/><rect x="4" y="10" width="4" height="2" fill="${sandLo}" fill-opacity="0.5"/><rect x="22" y="2" width="4" height="2" fill="${sandHi}" fill-opacity="0.6"/></pattern>
<radialGradient id="dbtefx-eds-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.success}" stop-opacity="0.22"/><stop offset="1" stop-color="${t.success}" stop-opacity="0"/></radialGradient>
</defs>
<style>@keyframes dbtefx-eds-lunge { 0%, 8%, 100% { transform: translateY(0); } 3% { transform: translateY(-24px); } }</style>
<rect width="1600" height="900" fill="${t.bg}"/>
<ellipse cx="1150" cy="420" rx="900" ry="560" fill="url(#dbtefx-eds-glow)"/>
<path d="${grid}" stroke="${t.success}" stroke-opacity="0.07" stroke-width="7"/>
<path d="${grid}" stroke="${t.success}" stroke-opacity="0.22" stroke-width="1.5"/>
<!--mid-->
<g class="dbtefx-eds-board" shape-rendering="crispEdges" opacity="0.18">
<rect x="${bx - A}" y="${by - A}" width="${bw + 2 * A}" height="${bh + 2 * A}" fill="${ink}"/><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#dbtefx-eds-brick)"/>${slots}${faceDown(1, 0)}${faceDown(3, 1)}${faceDown(0, 1)}
<g style="animation: dbtefx-eds-lunge 5s steps(2, end) infinite;">${ours}</g>
</g>`;
};

export default scene;

export const particles = [{ kind: 'spark', count: 14, colors: ['warning', 'accent2'], speed: 0.6 }];
