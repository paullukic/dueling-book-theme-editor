import { mix } from '../../../lib/color.js';
import { n1, rng } from './kit.js';

// Forbidden Memories (PlayStation, 1999): the duel field floating in a black
// void. A gold-tiled board recedes in hard perspective, flat-shaded and
// dithered like a PS1 frame; above its far edge a card spins on its axis as
// it is summoned, the yellow pyramid cursor bobbing over it, and a winged
// sun-disk plate hangs in the dark above (not in a duel: its wing tips
// would show in the stage's top corner; chrome/forbidden-memories.js). Gold dust drifts up.

const VX = 1250;
const VY = 432;

// Board space (u across, v away) -> screen.
const proj = (u, v) => {
  const z = 1 + v * 0.55;
  return [n1(VX + (u * 132) / z), n1(VY + 468 / z)];
};
const quad = (u0, v0, u1, v1) => [proj(u0, v0), proj(u1, v0), proj(u1, v1), proj(u0, v1)];
const pts = (q) => q.map((p) => p.join(' ')).join(' ');

const scene = (t) => {
  const rand = rng(1999);
  const gold = t.accent;
  const goldHi = mix(gold, '#ffffff', 0.45);
  const goldLo = mix(gold, t.bg, 0.55);
  const goldDeep = mix(gold, t.bg, 0.78);
  const void0 = mix(t.bg, '#000000', 0.4);

  // PS1 ordered dither: a 4x4 Bayer pattern of black dots laid over gradients.
  const bay = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const dither = bay.map((b, k) => `<rect x="${(k % 4) * 2}" y="${Math.floor(k / 4) * 2}" width="2" height="2" fill-opacity="${n1((b / 16) * 0.5)}"/>`).join('');

  // The board: 5 x 4 gold tiles, flat-shaded per tile, an X carved in each.
  let tiles = '';
  let carve = '';
  for (let v = 0; v < 4; v++) {
    for (let c = 0; c < 5; c++) {
      const u0 = c - 2.5;
      const q = quad(u0, v, u0 + 1, v + 1);
      const k = (c + v) % 2 ? 0.16 : 0;
      const fall = v * 0.12 + Math.abs(c - 2) * 0.05 + rand() * 0.06;
      tiles += `<polygon points="${pts(q)}" fill="${mix(mix(gold, goldLo, k), t.bg, n1(fall))}"/>`;
      const [a, b, cc, d] = q;
      carve += `M${a.join(' ')}L${cc.join(' ')}M${b.join(' ')}L${d.join(' ')}`;
      const m = quad(u0 + 0.12, v + 0.12, u0 + 0.88, v + 0.88);
      carve += `M${m.map((p) => p.join(' ')).join('L')}Z`;
    }
  }
  // Grout lines.
  let grout = '';
  for (let c = 0; c <= 5; c++) grout += `M${proj(c - 2.5, 0).join(' ')}L${proj(c - 2.5, 4).join(' ')}`;
  for (let v = 0; v <= 4; v++) grout += `M${proj(-2.5, v).join(' ')}L${proj(2.5, v).join(' ')}`;
  // The board's front edge: a slab of darker gold.
  const [fl, fr] = [proj(-2.5, 0), proj(2.5, 0)];
  const edge = `<polygon points="${fl.join(' ')} ${fr.join(' ')} ${fr[0]} ${fr[1] + 40} ${fl[0]} ${fl[1] + 40}" fill="${goldDeep}"/>`;

  // Face-down cards lying on the board.
  const lying = (c, v) => {
    const q = quad(c - 2.5 + 0.18, v + 0.1, c - 2.5 + 0.82, v + 0.9);
    const inner = quad(c - 2.5 + 0.27, v + 0.24, c - 2.5 + 0.73, v + 0.76);
    return `<polygon points="${pts(q)}" fill="${mix(t.warning, t.bg, 0.55)}" stroke="${goldHi}" stroke-width="2"/><polygon points="${pts(inner)}" fill="${mix(t.bg, t.danger, 0.25)}"/>`;
  };

  // The summoned card, spinning on its vertical axis: face, then back.
  const cx = VX;
  const cy = 372;
  const cw = 148;
  const ch = 212;
  const x0 = cx - cw / 2;
  const y0 = cy - ch / 2;
  const face = `<rect x="${x0}" y="${y0}" width="${cw}" height="${ch}" fill="${mix(t.warning, t.danger, 0.35)}" stroke="${goldHi}" stroke-width="3"/><rect x="${x0 + 10}" y="${y0 + 12}" width="${cw - 20}" height="16" fill="${mix(t.warning, '#ffffff', 0.55)}"/><rect x="${x0 + 14}" y="${y0 + 36}" width="${cw - 28}" height="${cw - 28}" fill="${void0}" stroke="${goldLo}" stroke-width="2"/><polygon points="${cx - 44},${y0 + 140} ${cx},${y0 + 62} ${cx + 44},${y0 + 140}" fill="${gold}"/><polygon points="${cx},${y0 + 62} ${cx + 44},${y0 + 140} ${cx + 12},${y0 + 140}" fill="${goldLo}"/><circle cx="${cx + 30}" cy="${y0 + 66}" r="10" fill="${t.danger}"/><rect x="${x0 + 10}" y="${y0 + ch - 50}" width="${cw - 20}" height="38" fill="${mix(t.warning, '#ffffff', 0.6)}"/><path d="M${x0 + 18} ${y0 + ch - 38}h${cw - 70}M${x0 + 18} ${y0 + ch - 26}h${cw - 52}" stroke="${goldDeep}" stroke-width="4"/>`;
  const back = `<rect x="${x0}" y="${y0}" width="${cw}" height="${ch}" fill="${mix(t.warning, t.bg, 0.5)}" stroke="${goldHi}" stroke-width="3"/><rect x="${x0 + 10}" y="${y0 + 10}" width="${cw - 20}" height="${ch - 20}" fill="none" stroke="${goldLo}" stroke-width="3"/><ellipse cx="${cx}" cy="${cy}" rx="44" ry="66" fill="${mix(t.bg, t.danger, 0.3)}"/><ellipse cx="${cx}" cy="${cy}" rx="22" ry="34" fill="${void0}"/>`;

  // The yellow pyramid cursor: two flat-shaded faces, point down.
  const tri = `<polygon points="${cx - 34},${y0 - 74} ${cx + 34},${y0 - 74} ${cx},${y0 - 22}" fill="${t.warning}"/><polygon points="${cx + 6},${y0 - 74} ${cx + 34},${y0 - 74} ${cx},${y0 - 22}" fill="${mix(t.warning, t.bg, 0.4)}"/><polygon points="${cx - 34},${y0 - 74} ${cx + 34},${y0 - 74} ${cx + 22},${y0 - 84} ${cx - 22},${y0 - 84}" fill="${mix(t.warning, '#ffffff', 0.4)}"/>`;

  // Winged sun disk: a plate between stepped feather rows, flat gold.
  const wing = (dir) => {
    let f = '';
    for (let r = 0; r < 4; r++) {
      const y = 116 + r * 13;
      const len = 150 - r * 26;
      const x = VX + dir * 92;
      f += `<polygon points="${x},${y} ${n1(x + dir * len)},${y - 16 + r * 4} ${n1(x + dir * (len - 14))},${y + 10} ${x},${y + 12}" fill="${r % 2 ? goldLo : gold}"/>`;
    }
    return f;
  };
  const disk = `<g class="dbtefx-fm-disk">${wing(-1)}${wing(1)}<rect x="${VX - 92}" y="108" width="184" height="58" fill="${void0}" stroke="${gold}" stroke-width="5"/><rect x="${VX - 83}" y="117" width="166" height="40" fill="none" stroke="${goldLo}" stroke-width="2"/><circle cx="${VX}" cy="98" r="18" fill="${t.danger}" stroke="${gold}" stroke-width="4"/></g>`;

  // The title screen's hieroglyph wall, carved faintly into the dark: columns of glyphs between rules.
  const G = ['M6 1.2a2.6 3 0 1 0 0.01 0M6 7.2V12M2.4 8H9.6', 'M6 1V12M3 3H9M3 5.4H9M3 7.8H9M2 12H10', 'M0 4.5l2-2 2 2 2-2 2 2 2-2 2 2M0 9.5l2-2 2 2 2-2 2 2 2-2 2 2', 'M6 12V4.5Q6 1 9 1.2Q7.5 3 7.5 5.5M6 7Q4 6 3.5 4', 'M1 11H11M2 11V7Q6 2 10 7V11', 'M2 2H10V10H2ZM4 4H8V8H4Z'];
  let glyphs = '';
  let rules = '';
  for (let c = 0; c < 16; c++) {
    const x = 24 + c * 100;
    rules += `M${x - 22} 0V900`;
    for (let r = 0; r < 10; r++) glyphs += `<use href="#dbtefx-fm-g${Math.floor(rand() * G.length)}" x="${x}" y="${20 + r * 90}"/>`;
  }
  const glyphDefs = G.map((d, k) => `<path id="dbtefx-fm-g${k}" d="${d}" transform="scale(4)"/>`).join('');
  const wall = `<g fill="none" stroke="${t.muted}" stroke-opacity="0.08" stroke-width="0.45">${glyphs}</g><path d="${rules}" stroke="${t.muted}" stroke-opacity="0.06" stroke-width="2"/><rect width="1600" height="900" fill="url(#dbtefx-fm-vig)"/>`;

  return `<defs>${glyphDefs}
<pattern id="dbtefx-fm-dither" width="8" height="8" patternUnits="userSpaceOnUse"><g fill="#000000">${dither}</g></pattern>
<radialGradient id="dbtefx-fm-vig" cx="0.72" cy="0.6" r="0.75"><stop offset="0" stop-color="${void0}" stop-opacity="0"/><stop offset="1" stop-color="${void0}" stop-opacity="0.9"/></radialGradient>
<radialGradient id="dbtefx-fm-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${gold}" stop-opacity="0.28"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
</defs>
<style>@keyframes dbtefx-fm-spin { 0% { transform: scaleX(1); } 22% { transform: scaleX(0.02); } 50% { transform: scaleX(-1); } 78% { transform: scaleX(0.02); } 100% { transform: scaleX(1); } }
@keyframes dbtefx-fm-face { 0%, 21.9% { opacity: 1; } 22%, 77.9% { opacity: 0; } 78%, 100% { opacity: 1; } }
@keyframes dbtefx-fm-back { 0%, 21.9% { opacity: 0; } 22%, 77.9% { opacity: 1; } 78%, 100% { opacity: 0; } }
@keyframes dbtefx-fm-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes dbtefx-fm-sheen { 0% { transform: translateX(-700px); opacity: 0; } 15% { opacity: 1; } 60%, 100% { transform: translateX(700px); opacity: 0; } }</style>
<rect width="1600" height="900" fill="${void0}"/>
${wall}
<ellipse cx="${VX}" cy="560" rx="620" ry="260" fill="url(#dbtefx-fm-halo)"/>
<!--mid-->
<g opacity="0.6">${edge}${tiles}<path d="${carve}" fill="none" stroke="${goldDeep}" stroke-opacity="0.55" stroke-width="1.5"/><path d="${grout}" stroke="${goldDeep}" stroke-width="3"/>${lying(1, 1)}${lying(3, 0)}${lying(4, 2)}</g>
<g style="mix-blend-mode: screen; animation: dbtefx-fm-sheen 9s ease-in-out infinite;"><polygon points="1140,900 1220,900 1300,560 1260,560" fill="${goldHi}" fill-opacity="0.18"/></g>
<polygon points="${pts(quad(-2.5, 0, 2.5, 4))}" fill="url(#dbtefx-fm-dither)" opacity="0.7"/>
<ellipse cx="${cx}" cy="${cy + 40}" rx="150" ry="230" fill="url(#dbtefx-fm-halo)" style="animation: dbtefx-pulse 4s ease-in-out infinite;"/>
<ellipse cx="${cx}" cy="560" rx="120" ry="26" fill="url(#dbtefx-fm-halo)" style="animation: dbtefx-pulse 4s ease-in-out infinite;"/>
<g opacity="0.26">${disk}
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-fm-spin 8s linear infinite;"><g style="animation: dbtefx-fm-face 8s linear infinite;">${face}</g><g style="animation: dbtefx-fm-back 8s linear infinite;">${back}</g></g>
<g style="animation: dbtefx-fm-bob 1.6s ease-in-out infinite;">${tri}</g></g>`;
};

export default scene;

export const particles = [{ kind: 'mote', count: 26, colors: ['accent', 'warning'], rise: true, speed: 0.6 }];
