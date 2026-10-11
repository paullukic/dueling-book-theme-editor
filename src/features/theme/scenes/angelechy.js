import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, polar, W } from './kit.js';

// Angelechy: a chessboard in perspective, white pieces, angel wings
const angelechy = (t) => {
  // The board recedes to a vanishing point; squares are true perspective quads.
  const vx = 800;
  const vy = 330;
  const top = 560;
  const bottom = H + 240;
  const colX = (k, y) => n1(vx + ((k - 4) * 260 - 0) * ((y - vy) / (bottom - vy)) * 1.6);
  const rowY = (j) => n1(top + (bottom - top) * (j / 8) ** 1.7);
  let squares = '';
  for (let j = 0; j < 8; j++) {
    for (let k = -2; k < 10; k++) {
      if ((j + k) % 2) continue;
      const y0 = rowY(j);
      const y1 = rowY(j + 1);
      squares += `<path d="M${colX(k, y0)} ${y0}L${colX(k + 1, y0)} ${y0}L${colX(k + 1, y1)} ${y1}L${colX(k, y1)} ${y1}Z"/>`;
    }
  }
  const ivory = mix(t.text, t.accent2, 0.12);
  const base = (x, y, w) => `<path d="M${x - w} ${y}h${w * 2}l-${w * 0.25} -${w * 0.35}h-${w * 1.5}Z"/>`;
  const pawn = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-96" r="22"/><path d="M-16 -74h32l12 60h-56Z"/>${base(0, 0, 40)}</g>`;
  const rook = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-36 -170v-30h14v14h14v-14h16v14h14v-14h14v30l-8 10v120h-50v-120Z"/>${base(0, 0, 50)}<path d="M-34 -14h68v-26h-68Z"/></g>`;
  const knight = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 -20C-34 -80 -10 -110 -34 -150C-20 -190 30 -200 44 -170C52 -150 40 -130 20 -128C30 -110 46 -70 30 -20Z"/><circle cx="6" cy="-160" r="5" fill="${t.bg}"/>${base(0, 0, 50)}</g>`;
  const king = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-8 -250h16v-20h14v-14h-14v-18h-16v18h-14v14h14Z"/><path d="M-46 -210C-30 -240 30 -240 46 -210L30 -40h-60Z"/>${base(0, 0, 62)}<path d="M-40 -60h80v-20h-80Z"/></g>`;
  const wing = (dir) => {
    let s = '';
    for (let i = 0; i < 8; i++) {
      const ang = dir > 0 ? -150 + i * 12 : -30 - i * 12;
      const [tx, ty] = polar(1170, 330, 170 + i * 22, ang);
      const [lx, ly] = polar(1170, 330, 90, ang - 6 * dir);
      s += `<path d="M1170 330Q${lx} ${ly} ${tx} ${ty}Q${n1((tx + 1170) / 2)} ${n1((ty + 330) / 2 + 20)} 1170 330Z"/>`;
    }
    return s;
  };
  return `<defs>${glow('dbtefx-ae-halo', t.accent, 0.5, 0.5, 0.5, 0.45)}<linearGradient id="dbtefx-ae-board" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.22"/></linearGradient></defs>
<g fill="url(#dbtefx-ae-board)" stroke="${t.accent}" stroke-opacity="0.18">${squares}</g>
<path d="M0 ${top}H${W}" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="2"/>
<!--mid-->
<circle cx="1170" cy="300" r="190" fill="url(#dbtefx-ae-halo)" ${anim('pulse', 6, 0, 'ease-in-out')}/>
<g fill="${ivory}" fill-opacity="0.16" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="1.5" ${anim('bloom', 8, 0, 'ease-in-out')}>${wing(1)}${wing(-1)}</g>
<g fill="${ivory}" fill-opacity="0.4" stroke="${t.accent}" stroke-opacity="0.65" stroke-width="2">${king(1170, 650, 1.25)}${knight(380, 700, 1.1)}${rook(1430, 690, 0.95)}${pawn(640, 620, 0.85)}${pawn(900, 640, 0.9)}</g>
<!--near-->
<g fill="${ivory}" fill-opacity="0.55" stroke="${t.accent}" stroke-opacity="0.7" stroke-width="2.5">${pawn(130, 980, 1.6)}</g>`;
};

export default angelechy;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'feather', count: 22, colors: ['text', 'accent'] }, { kind: 'mote', count: 40, colors: ['accent', 'accent2'] }];
