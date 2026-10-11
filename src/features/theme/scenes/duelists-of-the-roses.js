import { mix } from '../../../lib/color.js';
import { n1, rng } from './kit.js';

// Duelists of the Roses (PlayStation 2, 2001): the Wars of the Roses fought
// as a duel. In the lower right the game's 7 x 7 terrain board recedes in
// perspective (forest, meadow, sea, wasteland, mountain, dark, toon and
// crush squares under white grid lines), the selection square stepping
// across it; above, a gold-rimmed shield parted crimson and white carries a
// red rose and a white rose crossed at the stem, glowing in PS2 bloom.
// Rose petals drift down.

const VX = 1230;
const VY = 470;

const proj = (u, v) => {
  const z = 1 + v * 0.3;
  return [n1(VX + (u * 74) / z), n1(VY + 430 / z)];
};
const quad = (u0, v0, u1, v1) => `${proj(u0, v0).join(' ')} ${proj(u1, v0).join(' ')} ${proj(u1, v1).join(' ')} ${proj(u0, v1).join(' ')}`;

// Terrain map (rows near to far): F forest, M meadow, S sea, W wasteland, R mountain, D dark, T toon, C crush, N normal.
const MAP = ['WWNMMFF', 'WNNMFFS', 'RNNNMSS', 'RRNDNSS', 'NRDDCTN', 'NNDCTTN', 'MNNNTNN'];

const scene = (t) => {
  const rand = rng(1485);
  const gold = t.accent;
  const goldHi = mix(gold, '#ffffff', 0.5);
  const goldLo = mix(gold, t.bg, 0.5);
  const red = t.danger;
  const crimson = mix(t.opp, t.bg, 0.15);
  const white = t.accent2;
  const leaf = mix(t.success, t.bg, 0.35);

  const terrain = {
    F: mix(t.success, t.bg, 0.55),
    M: mix(t.success, t.warning, 0.3),
    S: mix(t.self, t.bg, 0.35),
    W: mix(t.warning, t.bg, 0.5),
    R: mix(t.muted, t.bg, 0.45),
    D: mix(mix(t.opp, t.self, 0.5), t.bg, 0.55),
    C: mix(t.opp, '#ffffff', 0.45),
    N: mix(t.muted, t.surface, 0.6),
  };
  const toon = [t.danger, t.warning, t.success, t.self, t.link];

  // The board.
  let tiles = '';
  let marks = '';
  MAP.forEach((row, v) => {
    [...row].forEach((k, c) => {
      const u0 = c - 3.5;
      const fade = n1(v * 0.07);
      if (k === 'T') {
        toon.forEach((col, i) => {
          tiles += `<polygon points="${quad(u0, v + i / 5, u0 + 1, v + (i + 1) / 5)}" fill="${mix(col, t.bg, 0.15 + fade)}"/>`;
        });
        return;
      }
      tiles += `<polygon points="${quad(u0, v, u0 + 1, v + 1)}" fill="${mix(terrain[k], t.bg, fade)}"/>`;
      const [mx, my] = proj(u0 + 0.5, v + 0.5);
      const s = n1(9 / (1 + v * 0.3));
      if (k === 'F') marks += `<path d="M${mx - s} ${my + s * 0.6}l${s} ${-s * 1.8}l${s} ${s * 1.8}z" fill="${mix(t.success, t.bg, 0.7)}"/>`;
      if (k === 'R') marks += `<path d="M${mx - s * 1.4} ${my + s * 0.5}l${s * 0.9} ${-s * 1.3}l${s * 0.6} ${s * 0.6}l${s * 0.5} ${-s * 0.5}l${s * 0.8} ${s * 1.2}z" fill="${mix(t.muted, t.bg, 0.25)}"/>`;
      if (k === 'S') marks += `<path d="M${mx - s} ${my}q${s / 2} ${-s / 2} ${s} 0t${s} 0" fill="none" stroke="${mix(t.self, '#ffffff', 0.5)}" stroke-width="1.5"/>`;
      if (k === 'D') marks += `<circle cx="${mx}" cy="${my}" r="${n1(s * 0.6)}" fill="${mix(t.opp, t.bg, 0.6)}"/>`;
    });
  });
  let grid = '';
  for (let c = 0; c <= 7; c++) grid += `M${proj(c - 3.5, 0).join(' ')}L${proj(c - 3.5, 7).join(' ')}`;
  for (let v = 0; v <= 7; v++) grid += `M${proj(-3.5, v).join(' ')}L${proj(3.5, v).join(' ')}`;

  // The selection square stepping across a path of tiles.
  const path = [[3, 1], [3, 2], [4, 2], [4, 3], [3, 3], [2, 3]];
  const sel = path.map(([c, v], i) => `<polygon points="${quad(c - 3.5, v, c - 2.5, v + 1)}" fill="${'#ffffff'}" fill-opacity="0.22" stroke="#ffffff" stroke-width="3" style="opacity: 0; animation: dbtefx-dor-step 9s steps(1, end) ${n1(-9 + i * 1.5)}s infinite;"/>`).join('');

  // A heraldic rose (the Wars of the Roses badge): five notched petals over
  // green barbs, five inner petals, a gold heart ringed with seeds. Shaded
  // with a radial gradient so it still reads as a flower, not a stamp.
  const rose = (cx, cy, s, base, id) => {
    const deep = mix(base, t.bg, 0.55);
    const hi = mix(base, '#ffffff', 0.5);
    const P = (d) => d.replace(/-?\d+(\.\d+)?/g, (v) => n1(Number(v) * s));
    const petal = P('M0 0C-0.5 -0.15 -0.64 -0.8 -0.3 -0.98C-0.15 -1.05 -0.05 -0.96 0 -0.86C0.05 -0.96 0.15 -1.05 0.3 -0.98C0.64 -0.8 0.5 -0.15 0 0Z');
    const barb = P('M0 0L-0.13 -0.72L0 -1.1L0.13 -0.72Z');
    const ring = (d, k, off, fill, extra = '') => Array.from({ length: 5 }, (_, i) => `<path d="${d}" transform="rotate(${off + i * 72}) scale(${k})" fill="${fill}"${extra}/>`).join('');
    let seeds = '';
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5;
      seeds += `<circle cx="${n1(Math.cos(a) * s * 0.15)}" cy="${n1(Math.sin(a) * s * 0.15)}" r="${n1(s * 0.035)}"/>`;
    }
    return `<defs><radialGradient id="dbtefx-dor-${id}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="${n1(s)}"><stop offset="0.15" stop-color="${deep}"/><stop offset="0.6" stop-color="${base}"/><stop offset="1" stop-color="${hi}"/></radialGradient></defs><g transform="translate(${cx} ${cy})">
${ring(barb, 1, 36, leaf)}
${ring(petal, 1, 0, `url(#dbtefx-dor-${id})`, ` stroke="${deep}" stroke-width="2"`)}
${ring(petal, 0.56, 36, base, ` stroke="${hi}" stroke-opacity="0.8" stroke-width="2"`)}
<circle r="${n1(s * 0.22)}" fill="${gold}" stroke="${goldLo}" stroke-width="2"/><g fill="${goldLo}">${seeds}</g><circle r="${n1(s * 0.08)}" fill="${goldHi}"/>
</g>`;
  };
  const leafAt = (x, y, a, s) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})"><path d="M0 0Q16 -14 40 0Q16 14 0 0Z" fill="${leaf}"/><path d="M2 0H36" stroke="${mix(t.success, t.bg, 0.65)}" stroke-width="1.6"/></g>`;

  // The shield: gold rim, parted per pale crimson and white, a fine inner rule.
  const sx = 1150;
  const sy = 100;
  const sw = 260;
  const sh = 290;
  const shield = (inset) => `M${sx + inset} ${sy + inset}H${sx + sw - inset}V${n1(sy + sh * 0.55)}Q${sx + sw - inset} ${n1(sy + sh * 0.88)} ${sx + sw / 2} ${sy + sh - inset}Q${sx + inset} ${n1(sy + sh * 0.88)} ${sx + inset} ${n1(sy + sh * 0.55)}Z`;
  const shieldArt = `<path d="${shield(0)}" fill="url(#dbtefx-dor-gold)"/><clipPath id="dbtefx-dor-clip"><path d="${shield(12)}"/></clipPath><g clip-path="url(#dbtefx-dor-clip)"><rect x="${sx}" y="${sy}" width="${sw / 2}" height="${sh}" fill="${crimson}"/><rect x="${sx + sw / 2}" y="${sy}" width="${sw / 2}" height="${sh}" fill="${mix(white, t.bg, 0.25)}"/><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="url(#dbtefx-dor-sheen)"/></g><path d="${shield(18)}" fill="none" stroke="${goldHi}" stroke-opacity="0.7" stroke-width="2"/>`;
  // Filigree scrolls flanking the shield.
  const scroll = (dir) => {
    const x = sx + sw / 2 + dir * (sw / 2 + 4);
    return `<path d="M${x} ${sy + 40}c${dir * 40} 10 ${dir * 60} 50 ${dir * 30} 80c${dir * -20} 18 ${dir * -44} 0 ${dir * -30} -16c${dir * 10} -12 ${dir * 26} -4 ${dir * 22} 6" fill="none" stroke="${gold}" stroke-width="7" stroke-linecap="round"/><path d="M${x} ${sy + 150}c${dir * 34} 12 ${dir * 44} 54 ${dir * 14} 74" fill="none" stroke="${goldLo}" stroke-width="5" stroke-linecap="round"/>`;
  };

  // Crossed stems and the two roses.
  const stems = `<path d="M1110 500Q1200 400 1330 262" fill="none" stroke="${leaf}" stroke-width="11" stroke-linecap="round"/><path d="M1440 500Q1350 400 1222 262" fill="none" stroke="${mix(leaf, t.bg, 0.2)}" stroke-width="11" stroke-linecap="round"/>${leafAt(1170, 432, -40, 1)}${leafAt(1385, 440, 220, 1)}${leafAt(1262, 346, -70, 0.8)}`;
  const roses = `${rose(1218, 250, 70, white, 'w')}${rose(1342, 250, 70, red, 'r')}`;

  // Falling petals (near plane).
  let petals = '';
  for (let i = 0; i < 9; i++) {
    const x = n1(980 + rand() * 600);
    const s = n1(0.8 + rand() * 0.8);
    const c = i % 2 ? red : white;
    petals += `<g transform="translate(${x} 0)"><g style="animation: dbtefx-fall ${n1(14 + rand() * 10)}s ease-in-out ${n1(-rand() * 24)}s infinite; transform-box: fill-box; transform-origin: center;"><path d="M0 0q${n1(9 * s)} ${n1(-12 * s)} ${n1(18 * s)} 0q${n1(-9 * s)} ${n1(9 * s)} ${n1(-18 * s)} 0z" fill="${c}" fill-opacity="0.85"/></g></g>`;
  }

  return `<defs>
<radialGradient id="dbtefx-dor-bloom" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${gold}" stop-opacity="0.35"/><stop offset="0.5" stop-color="${red}" stop-opacity="0.12"/><stop offset="1" stop-color="${red}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dor-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldHi}"/><stop offset="0.45" stop-color="${gold}"/><stop offset="1" stop-color="${goldLo}"/></linearGradient>
<linearGradient id="dbtefx-dor-sheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.3"/></linearGradient>
<linearGradient id="dbtefx-dor-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, crimson, 0.25)}"/><stop offset="1" stop-color="${t.bg}"/></linearGradient>
</defs>
<style>@keyframes dbtefx-dor-step { 0% { opacity: 1; } 16.6%, 100% { opacity: 0; } }</style>
<rect width="1600" height="900" fill="url(#dbtefx-dor-sky)"/>
<ellipse cx="1280" cy="270" rx="420" ry="340" fill="url(#dbtefx-dor-bloom)" style="animation: dbtefx-pulse 7s ease-in-out infinite;"/>
<!--mid-->
<g opacity="0.6">${tiles}${marks}<path d="${grid}" stroke="#ffffff" stroke-opacity="0.75" stroke-width="2"/>${sel}</g>
<polygon points="${quad(-3.5, 0, 3.5, 7)}" fill="url(#dbtefx-dor-sky)" fill-opacity="0.25"/>
<g opacity="0.22">${scroll(-1)}${scroll(1)}${shieldArt}${stems}${roses}</g>
<!--near-->
${petals}`;
};

export default scene;

export const particles = [{ kind: 'petal', count: 18, colors: ['danger', 'accent2'] }, { kind: 'mote', count: 20, colors: ['accent'], rise: true, speed: 0.5 }];
