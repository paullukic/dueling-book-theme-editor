import { mix } from '../../../lib/color.js';
import { H, n1, rng, W } from './kit.js';

// Power of Chaos (PC, 2003-04): the Joey-edition street duel. A brick wall
// with a chain-link fence down the left gutter; at the right edge the game's
// duel board in perspective (chalk-white zone lines over a painted field,
// card backs, face-up cards) with your fanned hand in front. Everything sits
// in the gutters so the real duel stage and the menu feed stay clear.
// Motion: the hand breathes, a card on the board glints.
const powerOfChaos = (t) => {
  const rand = rng(2003);
  const sand = mix(t.muted, t.warning, 0.35);
  const sandLit = mix(sand, '#ffffff', 0.35);
  const sandDeep = mix(sand, t.bg, 0.55);
  const umber = mix(t.border, t.bg, 0.25);
  const chalk = t.text;
  const blue = t.opp;
  const red = t.accent;

  // Board in perspective: u across (0-1), v down (0-1).
  const [top, bot, tl, tr, bl, br] = [214, 730, 1264, 1404, 1234, 1428];
  const P = (u, v) => {
    const pv = (v * 1.32) / (1 + 0.32 * v);
    const y = top + (bot - top) * pv;
    const xl = tl + (bl - tl) * pv;
    const xr = tr + (br - tr) * pv;
    return [n1(xl + (xr - xl) * u), n1(y)];
  };
  const quad = (u0, v0, u1, v1) => {
    const p = [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)];
    return `M${p.map((q) => q.join(' ')).join('L')}Z`;
  };
  // Rows: opp spell/trap, opp monsters, (midline), your monsters, your spell/trap.
  const rows = [[0, 0.22], [0.22, 0.46], [0.54, 0.78], [0.78, 1]];
  const cols = [0, 0.2, 0.4, 0.6, 0.8, 1];
  let cells = '';
  rows.forEach(([v0, v1]) => {
    for (let c = 0; c < 5; c++) cells += `<path d="${quad(cols[c] + 0.012, v0 + 0.012, cols[c + 1] - 0.012, v1 - 0.012)}"/>`;
  });
  let chalkLines = '';
  rows.forEach(([v0, v1]) => {
    chalkLines += `<path d="M${P(0, v0).join(' ')}L${P(1, v0).join(' ')}M${P(0, v1).join(' ')}L${P(1, v1).join(' ')}"/>`;
    cols.forEach((u) => (chalkLines += `<path d="M${P(u, v0).join(' ')}L${P(u, v1).join(' ')}"/>`));
  });

  // A card laid in a zone (inset quad), face down or face up.
  const inZone = (c, r, pad = 0.03) => {
    const [v0, v1] = rows[r];
    return quad(cols[c] + pad + 0.012, v0 + pad * 1.4, cols[c + 1] - pad - 0.012, v1 - pad * 1.4);
  };
  const back = (c, r) => {
    const [v0, v1] = rows[r];
    const [cx, cy] = P((cols[c] + cols[c + 1]) / 2, (v0 + v1) / 2);
    const rx = n1(11 + v0 * 4);
    const ry = n1(16 + v0 * 6);
    return `<path d="${inZone(c, r)}" fill="url(#dbtefx-pc-back)" stroke="${mix(umber, '#000000', 0.45)}" stroke-width="2"/><path d="${inZone(c, r, 0.05)}" fill="none" stroke="${sand}" stroke-opacity="0.55" stroke-width="1.2"/><ellipse cx="${cx}" cy="${cy}" rx="${n1(rx * 1.5)}" ry="${n1(ry * 1.35)}" fill="url(#dbtefx-pc-swirl)"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${mix(t.bg, '#000000', 0.55)}"/>`;
  };
  const faceUp = (c, r, frame) => {
    const [v0, v1] = rows[r];
    const art = quad(cols[c] + 0.06, v0 + 0.07, cols[c + 1] - 0.06, v0 + (v1 - v0) * 0.6);
    return `<path d="${inZone(c, r)}" fill="${frame}" stroke="${mix(frame, '#000000', 0.5)}" stroke-width="2"/><path d="${art}" fill="url(#dbtefx-pc-art)" stroke="${mix(frame, '#000000', 0.45)}" stroke-width="1.2"/>`;
  };


  // Painted field under the grid: soft daubs of colour like a field-spell painting.
  let paint = '';
  for (let i = 0; i < 14; i++) {
    const [x, y] = P(rand(), rand());
    paint += `<ellipse cx="${x}" cy="${y}" rx="${n1(50 + rand() * 90)}" ry="${n1(24 + rand() * 40)}" fill="${[sand, t.success, blue, umber][i % 4]}" fill-opacity="${n1(0.12 + rand() * 0.12)}" transform="rotate(${n1(-20 + rand() * 40)} ${x} ${y})"/>`;
  }
  // Brush strokes across the field.
  let strokes = '';
  for (let i = 0; i < 16; i++) {
    const [x1, y1] = P(rand(), rand());
    const len = 40 + rand() * 90;
    strokes += `<path d="M${x1} ${y1}q${n1(len * 0.5)} ${n1(-10 - rand() * 20)} ${n1(len)} ${n1(-4 + rand() * 8)}"/>`;
  }


  // Far: carved sandstone courses, lit from the upper right.
  let courses = '';
  for (let y = 0; y < H; y += 60) {
    const off = (y / 60) % 2 ? 0 : 75;
    courses += `M0 ${y}H${W}`;
    for (let x = off; x < W; x += 150) courses += `M${x} ${y}v60`;
  }

  // Your hand: four cards fanned in front of the board.
  const hand = [
    [mix(t.warning, t.accent, 0.35), -14],
    [mix(t.success, t.bg, 0.15), -5],
    [mix(t.warning, '#ffffff', 0.1), 4],
    [mix(t.danger, t.opp, 0.4), 13],
  ]
    .map(([frame, rot], i) => {
      const x = 1436 + i * 34;
      const y = 812 + Math.abs(rot) * 1.6;
      return `<g transform="translate(${x} ${n1(y)}) rotate(${rot})"><g style="animation: dbtefx-bob ${n1(5 + i * 0.7)}s ease-in-out ${n1(-i * 1.3)}s infinite;"><rect x="-44" y="-62" width="88" height="128" rx="4" fill="${frame}" stroke="${mix(frame, '#000000', 0.55)}" stroke-width="2.5"/><rect x="-37" y="-55" width="74" height="12" fill="${mix(frame, '#ffffff', 0.45)}" fill-opacity="0.8"/><path d="M-32 -49h44" stroke="${mix(frame, '#000000', 0.6)}" stroke-width="2.5"/><circle cx="31" cy="-49" r="4" fill="${mix(frame, t.accent2, 0.5)}" stroke="#000000" stroke-opacity="0.5"/>${i === 1 ? '' : [0, 1, 2, 3].map((k) => `<circle cx="${28 - k * 9}" cy="-37" r="3.2" fill="${t.danger}" stroke="${t.warning}" stroke-width="1"/>`).join('')}<rect x="-35" y="-31" width="70" height="60" fill="url(#dbtefx-pc-art)" stroke="${mix(frame, '#000000', 0.45)}" stroke-width="1.5"/><rect x="-37" y="34" width="74" height="24" fill="${mix(frame, '#ffffff', 0.6)}" fill-opacity="0.85"/><path d="M-31 41h50M-31 47h40M-31 53h46" stroke="${mix(frame, '#000000', 0.5)}" stroke-width="1.6" stroke-opacity="0.6"/><path d="M-42 -60h84" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.5"/></g></g>`;
    })
    .join('');

  return `<style>@keyframes dbtefx-pc-glint { 0%, 70%, 100% { opacity: 0; } 80% { opacity: 0.9; } }</style>
<defs>
<radialGradient id="dbtefx-pc-warm" cx="0.78" cy="0.42" r="0.6"><stop offset="0" stop-color="${sand}" stop-opacity="0.22"/><stop offset="0.6" stop-color="${umber}" stop-opacity="0.12"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-pc-field" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="${mix(t.opp, t.bg, 0.45)}"/><stop offset="0.38" stop-color="${mix(t.opp, sand, 0.55)}"/><stop offset="0.62" stop-color="${mix(t.success, sand, 0.5)}"/><stop offset="1" stop-color="${mix(t.success, t.bg, 0.5)}"/></linearGradient>
<radialGradient id="dbtefx-pc-swirl" cx="0.5" cy="0.5" r="0.5"><stop offset="0.55" stop-color="${mix(t.warning, t.accent, 0.4)}" stop-opacity="0.9"/><stop offset="1" stop-color="${mix(umber, sand, 0.3)}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-pc-back" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(umber, sand, 0.45)}"/><stop offset="1" stop-color="${mix(umber, t.bg, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-pc-art" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(blue, '#ffffff', 0.25)}"/><stop offset="0.55" stop-color="${mix(blue, t.bg, 0.35)}"/><stop offset="1" stop-color="${mix(t.success, t.bg, 0.45)}"/></linearGradient>
<pattern id="dbtefx-pc-mesh" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 11L11 0L22 11L11 22Z" fill="none" stroke="${t.muted}" stroke-opacity="0.18" stroke-width="1.6"/></pattern>
<radialGradient id="dbtefx-pc-vig" cx="0.42" cy="0.45" r="0.45"><stop offset="0" stop-color="${t.bg}" stop-opacity="0.6"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-pc-warm)"/>
<rect width="${W}" height="${H}" fill="${sand}" fill-opacity="0.07"/>
<path d="${courses}" fill="none" stroke="${mix(sand, '#000000', 0.5)}" stroke-opacity="0.35" stroke-width="3"/>
<path d="${courses}" fill="none" stroke="${sandLit}" stroke-opacity="0.08" stroke-width="1.5" transform="translate(1.5 1.5)"/>
<rect x="150" y="0" width="150" height="${H}" fill="url(#dbtefx-pc-mesh)"/>
<path d="M150 0V${H}M300 0V${H}" stroke="${mix(t.muted, t.bg, 0.3)}" stroke-opacity="0.5" stroke-width="6"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-pc-vig)"/>
<!--mid-->
<g transform="translate(150 0)" opacity="0.6">
<path d="M${P(0, 0).join(' ')}L${P(1, 0).join(' ')}L${P(1, 1).join(' ')}L${P(0, 1).join(' ')}Z" fill="${mix(t.bg, '#000000', 0.3)}" fill-opacity="0.6" transform="translate(10 14)"/>
<path d="M${n1(tl - 14)} ${top - 14}L${n1(tr + 14)} ${top - 14}L${n1(br + 18)} ${bot + 14}L${n1(bl - 18)} ${bot + 14}Z" fill="${sandDeep}" stroke="${sand}" stroke-width="3"/>
<path d="M${n1(tl - 8)} ${top - 8}L${n1(tr + 8)} ${top - 8}L${n1(br + 11)} ${bot + 8}L${n1(bl - 11)} ${bot + 8}Z" fill="none" stroke="${sandLit}" stroke-opacity="0.5" stroke-width="1.5"/>
<path d="M${P(0, 0).join(' ')}L${P(1, 0).join(' ')}L${P(1, 1).join(' ')}L${P(0, 1).join(' ')}Z" fill="url(#dbtefx-pc-field)"/>
${paint}
<g fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="6" stroke-linecap="round">${strokes}</g>
<g fill="${t.bg}" fill-opacity="0.1">${cells}</g>
<path d="${quad(0, 0.46, 1, 0.54)}" fill="${mix(red, t.bg, 0.55)}" fill-opacity="0.55"/>
<g fill="none" stroke="${chalk}" stroke-opacity="0.62" stroke-width="5" stroke-linecap="square">${chalkLines}</g>
${back(0, 0)}${back(3, 0)}${back(1, 1)}
${faceUp(2, 1, mix(t.warning, t.accent, 0.3))}
${back(4, 2)}
${faceUp(1, 2, mix(t.warning, t.accent, 0.3))}
${faceUp(3, 3, mix(t.success, t.bg, 0.15))}
${back(0, 3)}
<path d="${inZone(1, 2)}" fill="#ffffff" style="opacity: 0; animation: dbtefx-pc-glint 9s ease-in-out -3s infinite;"/>
</g>
<!--near-->
${hand}
`;
};

export default powerOfChaos;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 26, colors: ['warning', 'muted'], rise: true, speed: 0.6 }];
