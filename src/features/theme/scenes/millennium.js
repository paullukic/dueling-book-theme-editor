import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, star, W } from './kit.js';

// Millennium: the Millennium Stone in a starlit tomb, six Items set in its
// ring and the Puzzle risen out of the centre, wrapped in Shadow Game aura.

// The Eye of Wdjat, facing left, iris at the origin, about 130 wide.
const wdjat = 'M-62 2Q-14 -38 52 -2Q4 26 -62 2ZM52 -2L84 -4M-60 -30Q-4 -58 66 -30M-4 20L-10 60M14 18Q34 48 56 52Q70 54 66 40Q60 32 52 40';

const scene = (t) => {
  const rand = rng(1131);
  const hi = mix(t.accent, '#ffffff', 0.55);
  const deep = mix(t.accent, '#000000', 0.55);
  const stone = mix(t.bg, t.muted, 0.16);
  const night = mix(t.bg, t.accent2, 0.2);
  const cx = 1290;
  const ry = 560;

  // Tomb ceiling: lapis band with gold stars and a khekeru frieze under it.
  let stars = '';
  for (let i = 0; i < 22; i++) stars += `<path d="${star(n1(150 + i * 62 + (i % 2) * 20), i % 2 ? 98 : 76, 6)}"/>`;
  let frieze = '';
  for (let x = 0; x < W; x += 40) frieze += `<path d="M${x + 10} 156V136Q${x + 20} 126 ${x + 30} 136V156M${x + 20} 142V156"/>`;

  // Distant pyramids on the dune line, lit on one face by the aura.
  const pyramid = (x, b, w, h) => `<path d="M${x - w} ${b}L${x} ${b - h}L${x + w} ${b}Z" fill="${mix(t.bg, '#000000', 0.25)}"/><path d="M${x} ${b - h}L${x + w} ${b}L${x + w * 0.35} ${b}Z" fill="${t.accent}" fill-opacity="0.09"/>`;

  // The six Items in the Stone's ring, drawn in a 60-unit box.
  const items = [
    // Ring: triangle and eye inside a hoop, five hanging prongs.
    `<circle r="22" fill="none" stroke-width="5"/><path d="M0 -14L13 9H-13Z" fill="none" stroke-width="3"/><circle cy="1" r="3"/><path d="M-18 14L-22 34M-9 20L-10 38M0 22V40M9 20L10 38M18 14L22 34" stroke-width="3"/><circle cy="-27" r="5" fill="none" stroke-width="3"/>`,
    // Rod: staff crowned by an orb and two wings.
    `<path d="M0 -8V38M-6 38H6" stroke-width="5"/><circle cy="-18" r="11"/><path d="M-6 -18Q0 -23 6 -18Q0 -13 -6 -18Z" fill="${t.bg}" stroke="none"/><path d="M-10 -10Q-30 -14 -26 -36Q-20 -20 -6 -6ZM10 -10Q30 -14 26 -36Q20 -20 6 -6Z" stroke="none"/>`,
    // Key: an ankh.
    `<ellipse cy="-18" rx="11" ry="15" fill="none" stroke-width="6"/><path d="M-22 0H22M0 -2V36" stroke-width="6"/>`,
    // Scale: post, beam and two hanging pans.
    `<path d="M0 -30V32M-16 32H16M-28 -16H28M-28 -16L-36 10M-28 -16L-20 10M28 -16L20 10M28 -16L36 10" stroke-width="3"/><path d="M-40 10H-16Q-28 22 -40 10ZM16 10H40Q28 22 16 10Z"/><circle cy="-30" r="5"/>`,
    // Necklace: a gold collar arc with the eye as pendant.
    `<path d="M-30 -24Q0 18 30 -24" fill="none" stroke-width="5"/><path d="M-14 6Q0 -4 14 6Q0 30 -14 6Z"/><circle cy="10" r="4" fill="${t.bg}"/>`,
    // Eye: a gold orb with the iris.
    `<circle r="16"/><path d="M-12 0Q0 -10 12 0Q0 10 -12 0Z" fill="${t.bg}"/><circle r="4"/>`,
  ];
  let ring = '';
  items.forEach((body, i) => {
    const [x, y] = polar(cx, ry, 122, -180 + i * 60);
    ring += `<circle cx="${x}" cy="${y}" r="31" fill="${mix(t.bg, '#000000', 0.4)}" stroke="${deep}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="36" fill="url(#dbtefx-mi-slot)" ${anim('pulse', 5, i * 0.8, 'ease-in-out')}/><g transform="translate(${x} ${y}) scale(0.74)" fill="url(#dbtefx-mi-gold)" stroke="url(#dbtefx-mi-gold)" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;
  });

  // Shadow Game rays fanning out of the Puzzle.
  let rays = '';
  for (let i = 0; i < 18; i++) {
    const a = i * 20 + rand() * 8;
    const w = 1.2 + rand() * 2.4;
    const [x1, y1] = polar(cx, ry, 1100, a - w);
    const [x2, y2] = polar(cx, ry, 1100, a + w);
    rays += `<path d="M${cx} ${ry}L${x1} ${y1}L${x2} ${y2}Z"/>`;
  }

  // Carved glyph columns down the Stone's flanks.
  const glyphs = ['M-7 -8A7 7 0 1 1 7 -8L0 0ZM0 0V12M-8 3H8', 'M-8 -10V10M0 -10V10M8 -10V10', 'M-10 -4Q-5 -10 0 -4T10 -4M-10 6Q-5 0 0 6T10 6', 'M-10 0Q0 -10 10 0Q0 8 -10 0Z', 'M-8 10V-6Q0 -14 8 -6V10', 'M-10 8H10M-6 8V-8H6V8'];
  let cols = '';
  [-104, 104].forEach((dx, c) => {
    for (let j = 0; j < 9; j++) cols += `<path transform="translate(${cx + dx} ${300 + j * 52})" d="${glyphs[(j + c * 3) % glyphs.length]}"/>`;
  });

  // The Puzzle: an inverted pyramid in three-quarter view.
  const k = 0.8;
  const at = (dx, dy) => [n1(cx + dx * k), n1(ry + dy * k)];
  const p = { l: at(-112, -70), r: at(104, -76), f: at(20, -50), b: at(-14, -92), v: at(2, 124) };
  const P = (q) => p[q].join(' ');
  let seams = '';
  for (let i = 1; i < 4; i++) {
    const f = i / 4;
    const lerp = (a, b) => `${n1(a[0] + (b[0] - a[0]) * f)} ${n1(a[1] + (b[1] - a[1]) * f)}`;
    seams += `M${lerp(p.l, p.v)}L${lerp(p.f, p.v)}L${lerp(p.r, p.v)}`;
  }
  const front = `M${P('l')}L${P('f')}L${P('v')}Z`;

  // Shadow Game fog banks rolling along the floor.
  let fog = '';
  for (let i = 0; i < 6; i++) fog += `<ellipse cx="${n1(120 + i * 280 + rand() * 80)}" cy="${n1(850 + rand() * 30)}" rx="${n1(260 + rand() * 120)}" ry="${n1(60 + rand() * 30)}" fill="url(#dbtefx-mi-fog)" ${anim('drift', n1(14 + rand() * 8), rand() * 10, 'ease-in-out')}/>`;

  return `<defs>
<linearGradient id="dbtefx-mi-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}" stop-opacity="0.96"/><stop offset="0.55" stop-color="${t.bg}" stop-opacity="0.9"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.1)}" stop-opacity="0.95"/></linearGradient>
<radialGradient id="dbtefx-mi-aura" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${ry}" r="720"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.5"/><stop offset="0.3" stop-color="${t.accent}" stop-opacity="0.12"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-mi-halo"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.5"/><stop offset="0.4" stop-color="${t.accent}" stop-opacity="0.18"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-mi-shade" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.7"/></radialGradient>
<radialGradient id="dbtefx-mi-fog"><stop offset="0" stop-color="${mix(t.bg, t.accent2, 0.3)}" stop-opacity="0.75"/><stop offset="1" stop-color="${mix(t.bg, t.accent2, 0.3)}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-mi-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="0.45" stop-color="${t.accent}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
<linearGradient id="dbtefx-mi-face" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="0.5" stop-color="${t.accent}"/><stop offset="1" stop-color="${mix(t.accent, '#000000', 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-mi-dark" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent, '#000000', 0.25)}"/><stop offset="1" stop-color="${mix(t.accent, '#000000', 0.7)}"/></linearGradient>
<linearGradient id="dbtefx-mi-stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(stone, t.accent, 0.22)}"/><stop offset="0.3" stop-color="${stone}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-mi-glint" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.75"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-mi-slot"><stop offset="0.6" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.8" stop-color="${t.accent}" stop-opacity="0.5"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-mi-ray" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${ry}" r="1100"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.24"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<clipPath id="dbtefx-mi-clip"><path d="${front}"/></clipPath>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-mi-sky)"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-mi-aura)" ${anim('pulse', 7, 0, 'ease-in-out')}/>
<g fill="url(#dbtefx-mi-ray)" style="transform-origin: ${cx}px ${ry}px; animation: dbtefx-spin 240s linear infinite;">${rays}</g>
<path d="M0 780Q240 740 520 772T1040 760T1600 770V900H0Z" fill="${mix(t.bg, '#000000', 0.15)}"/>
${pyramid(300, 784, 190, 150)}${pyramid(600, 778, 120, 96)}${pyramid(960, 772, 90, 70)}
<rect width="${W}" height="126" fill="${mix(t.bg, t.accent2, 0.3)}" fill-opacity="0.9"/>
<g fill="${t.accent}" fill-opacity="0.75">${stars}</g>
<rect y="120" width="${W}" height="6" fill="${t.accent}" fill-opacity="0.6"/><rect y="126" width="${W}" height="30" fill="${t.bg}" fill-opacity="0.6"/><rect y="156" width="${W}" height="3" fill="${t.accent}" fill-opacity="0.4"/>
<g fill="none" stroke="${t.accent}" stroke-opacity="0.45" stroke-width="3">${frieze}</g>
<!--mid-->
<path d="M${cx - 128} 900V300Q${cx - 128} 196 ${cx} 186Q${cx + 128} 196 ${cx + 128} 300V900Z" fill="url(#dbtefx-mi-stone)" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="2"/>
<path d="M${cx - 88} 900V310Q${cx - 88} 222 ${cx} 214Q${cx + 88} 222 ${cx + 88} 310V900M${cx - 120} 900V304M${cx + 120} 900V304" fill="none" stroke="${deep}" stroke-width="2.5"/>
<g fill="none" stroke="${deep}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${cols}</g>
<g transform="translate(${cx} 292) scale(0.82)" fill="none" stroke="${deep}" stroke-width="8" stroke-linecap="round"><path d="${wdjat}"/><circle r="15" fill="${deep}"/></g>
<g transform="translate(${cx} 290) scale(0.82)" fill="none" stroke="${t.accent}" stroke-opacity="0.7" stroke-width="3" stroke-linecap="round" ${anim('pulse', 6, 1, 'ease-in-out')}><path d="${wdjat}"/><circle r="15"/></g>
<circle cx="${cx}" cy="${ry}" r="122" fill="none" stroke="${deep}" stroke-width="3"/><circle cx="${cx}" cy="${ry}" r="160" fill="none" stroke="${t.accent}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="2 8"/>
${ring}
<g style="transform-origin: ${cx}px ${ry}px; animation: dbtefx-mi-shadow 6s ease-out infinite;"><circle cx="${cx}" cy="${ry}" r="90" fill="none" stroke="${t.accent}" stroke-opacity="0.5" stroke-width="2"/></g>
<g style="transform-origin: ${cx}px ${ry}px; animation: dbtefx-mi-shadow 6s ease-out -3s infinite;"><circle cx="${cx}" cy="${ry}" r="90" fill="none" stroke="${t.accent2}" stroke-opacity="0.45" stroke-width="5"/></g>
<circle cx="${cx}" cy="${ry}" r="190" fill="url(#dbtefx-mi-halo)" ${anim('bloom', 7, 0, 'ease-in-out')}/>
<g style="animation: dbtefx-mi-hover 7s ease-in-out infinite;">
<ellipse cx="${n1(cx - 10)}" cy="${n1(p.b[1] - 2)}" rx="9" ry="11" fill="none" stroke="url(#dbtefx-mi-gold)" stroke-width="5"/>
<path d="M${P('l')}L${P('b')}L${P('r')}L${P('v')}Z" fill="none" stroke="${deep}" stroke-width="6" stroke-linejoin="round"/>
<path d="${front}" fill="url(#dbtefx-mi-face)"/>
<path d="M${P('f')}L${P('r')}L${P('v')}Z" fill="url(#dbtefx-mi-dark)"/>
<path d="M${P('l')}L${P('b')}L${P('r')}L${P('f')}Z" fill="${mix(t.accent, '#ffffff', 0.3)}"/>
<path d="${seams}" fill="none" stroke="${deep}" stroke-opacity="0.6" stroke-width="1.5"/>
<g transform="translate(${n1(cx - 26)} ${n1(ry - 12)}) scale(0.38) rotate(4)" fill="none" stroke="${deep}" stroke-width="9" stroke-linecap="round"><path d="${wdjat}"/><circle r="15" fill="${deep}"/></g>
<g transform="translate(${n1(cx - 26)} ${n1(ry - 12)}) scale(0.38) rotate(4)" fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round" ${anim('pulse', 6, 1, 'ease-in-out')}><path d="${wdjat}"/></g>
<g clip-path="url(#dbtefx-mi-clip)"><rect x="${cx - 260}" y="${ry - 120}" width="80" height="260" fill="url(#dbtefx-mi-glint)" style="animation: dbtefx-mi-glint 9s ease-in-out infinite;"/></g>
<path d="M${P('l')}L${P('f')}L${P('r')}M${P('f')}L${P('v')}" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.5"/>
</g>
<style>@keyframes dbtefx-mi-hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@keyframes dbtefx-mi-shadow { 0% { transform: scale(0.7); opacity: 0; } 15% { opacity: 1; } 100% { transform: scale(3.4); opacity: 0; } }
@keyframes dbtefx-mi-glint { 0%, 55% { transform: translateX(0); } 85%, 100% { transform: translateX(420px); } }</style>
<!--near-->
<rect width="${W}" height="${H}" fill="url(#dbtefx-mi-shade)"/>
${fog}`;
};

export default scene;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 70, colors: ['accent', 'warning'], speed: 0.6 },
  { kind: 'spark', count: 14, colors: ['accent'], speed: 0.4, column: true, columnX: 0.8 },
];
