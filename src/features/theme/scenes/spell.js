import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, W } from './kit.js';

// Spell Card: an open grimoire on a lectern at the right. Its pages turn on
// their own, glyph sparks rise from the spread, and a Spell card hangs in the
// teal vortex above it, turning slowly as if just cast.

const bx = 1288; // book spine
const by = 640;
const cy = 318; // card centre
const TURN = 12; // seconds per page turn cycle

// One page lying open, from the spine (0, 0) to the right.
const PAGE = 'M0 0C40 -16 96 -22 146 -10L136 50C88 40 40 42 0 60Z';

// Four-point glyph spark.
const SPARK = 'M0 -9L2 -2L9 0L2 2L0 9L-2 2L-9 0L-2 -2Z';

const spell = (t) => {
  const teal = t.accent;
  const gold = t.accent2;
  const pale = mix(teal, '#ffffff', 0.6);
  const frame = mix(teal, t.bg, 0.3);
  const leather = mix(t.bg, teal, 0.28);
  const wood = mix(t.surface, gold, 0.1);
  const paper = mix(mix(t.text, gold, 0.2), t.bg, 0.22);

  // Text lines on a right-hand page, following the page's curve.
  let lines = '';
  for (let k = 0; k < 6; k++) {
    const y = 6 + k * 7.5;
    const end = k === 5 ? 84 : 126 - k * 1.5;
    lines += `M16 ${n1(y + 1)}C46 ${n1(y - 9 + k * 0.6)} 92 ${n1(y - 12 + k * 0.8)} ${n1(end)} ${n1(y - 5 + k * 0.6)}`;
  }

  const pageSet = (side) => `<g transform="scale(${side} 1)">
<path d="${PAGE}" transform="translate(0 12)" fill="${leather}" stroke="${mix(gold, leather, 0.4)}" stroke-width="1.5"/>
<path d="${PAGE}" transform="translate(0 7)" fill="${mix(paper, t.bg, 0.45)}"/>
<path d="${PAGE}" transform="translate(0 3.5)" fill="${mix(paper, t.bg, 0.3)}"/>
<path d="${PAGE}" fill="url(#dbtefx-sp-paper)"/>
<path d="${lines}" fill="none" stroke="${mix(t.bg, teal, 0.3)}" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round"/>
</g>`;

  // The turning page: lifts from the right, stands up, settles on the left.
  const turner = (delay) => `<g style="animation: dbtefx-sp-turn ${TURN}s ease-in-out ${n1(-delay)}s infinite; transform-origin: 0 58px;"><path d="${PAGE}" fill="url(#dbtefx-sp-paper)" stroke="${mix(paper, t.bg, 0.4)}" stroke-width="1"/><path d="${lines}" fill="none" stroke="${mix(t.bg, teal, 0.3)}" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round"/></g>`;

  // Glyph sparks rising from the spread on a fan of paths.
  let sparks = '';
  for (let i = 0; i < 9; i++) {
    const a = -26 + i * 6.5;
    const s = n1(0.9 + (i % 3) * 0.3);
    sparks += `<g transform="translate(${bx + (i - 4) * 14} ${by - 6}) rotate(${a}) scale(${s})"><path d="${SPARK}" fill="${i % 3 === 1 ? mix(gold, '#ffffff', 0.4) : pale}" style="animation: dbtefx-sp-rise ${n1(5 + (i % 4) * 0.9)}s cubic-bezier(0.25, 0.6, 0.4, 1) ${n1(-i * 1.37)}s infinite;"/></g>`;
  }

  // Vortex: spiral arms drawn flat, then squashed into a disc.
  let arms = '';
  for (let k = 0; k < 5; k++) {
    let d = '';
    for (let u = 0; u <= 1.001; u += 0.05) {
      const [x, y] = polar(0, 0, 30 + 160 * u, k * 72 + u * 200);
      d += `${u ? 'L' : 'M'}${x} ${y}`;
    }
    arms += `<path d="${d}" stroke-opacity="${n1(0.55 - k * 0.06)}"/>`;
  }

  // Back-plate rune ring: thin circle with tick glyphs.
  let ring = '';
  for (let i = 0; i < 36; i++) {
    const [x, y] = polar(0, 0, 200, i * 10);
    ring += i % 3 ? `<circle cx="${x}" cy="${y}" r="1.6"/>` : `<path transform="translate(${x} ${y}) rotate(${i * 10})" d="M-5 0L0 -7L5 0L0 7Z"/>`;
  }

  // The card: Spell frame, name bar, art window holding the glyph, text box.
  const card = `<g transform="rotate(-5)">
<rect x="-66" y="-96" width="132" height="192" rx="5" transform="translate(5 4)" fill="${mix(frame, '#000000', 0.65)}"/><rect x="-68" y="-98" width="136" height="196" rx="5" fill="${mix(frame, '#000000', 0.45)}"/>
<rect x="-66" y="-96" width="132" height="192" rx="4" fill="url(#dbtefx-sp-frame)" stroke="${pale}" stroke-opacity="0.6" stroke-width="1.2"/>
<rect x="-56" y="-86" width="112" height="16" rx="1.5" fill="${mix(frame, '#ffffff', 0.25)}" stroke="#000000" stroke-opacity="0.35"/>
<circle cx="46" cy="-78" r="6" fill="${teal}" stroke="${pale}" stroke-width="1"/>
<path d="M46 -82V-74M42 -78H50" stroke="#ffffff" stroke-width="1.2"/>
<rect x="-52" y="-62" width="104" height="104" fill="url(#dbtefx-sp-art)" stroke="#000000" stroke-opacity="0.6" stroke-width="2"/>
<g transform="translate(0 -10)" fill="none" stroke="${pale}" stroke-linejoin="round">
<circle r="36" stroke-opacity="0.55" stroke-width="1.2"/><circle r="30" stroke-opacity="0.35" stroke-width="0.8" stroke-dasharray="3 3"/>
<path d="M0 -30L8 -8L30 0L8 8L0 30L-8 8L-30 0L-8 -8Z" stroke-width="1.6"/>
<path d="M0 -20L5 -5L20 0L5 5L0 20L-5 5L-20 0L-5 -5Z" fill="${pale}" fill-opacity="0.25" stroke-opacity="0.6"/>
</g>
<circle cy="-10" r="30" fill="url(#dbtefx-sp-core)" ${anim('pulse', 4, 0, 'ease-in-out')}/>
<rect x="-56" y="50" width="112" height="38" fill="${mix(frame, t.text, 0.55)}" fill-opacity="0.85" stroke="#000000" stroke-opacity="0.35"/>
<path d="M-50 59H46M-50 67H50M-50 75H30" stroke="${mix(t.bg, teal, 0.2)}" stroke-opacity="0.45" stroke-width="2"/>
<rect x="-66" y="-96" width="132" height="192" rx="4" fill="url(#dbtefx-sp-sheen)"/>
</g>`;

  return `<style>
@keyframes dbtefx-sp-turn { 0%, 48% { transform: scale(1, 1); opacity: 0; } 50% { opacity: 1; } 62% { transform: scale(0.62, 1.16); } 70% { transform: scale(0.04, 1.26); } 78% { transform: scale(-0.62, 1.16); } 88% { transform: scale(-1, 1); opacity: 1; } 92%, 100% { transform: scale(-1, 1); opacity: 0; } }
@keyframes dbtefx-sp-rise { 0% { transform: translateY(0) scale(0.3); opacity: 0; } 18% { opacity: 1; } 100% { transform: translateY(-300px) scale(1); opacity: 0; } }
@keyframes dbtefx-sp-hover { 0%, 100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-12px) rotate(1.5deg); } }
</style>
<defs>
<linearGradient id="dbtefx-sp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.4)}"/><stop offset="0.65" stop-color="${mix(t.bg, teal, 0.06)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-sp-halo" gradientUnits="userSpaceOnUse" cx="${bx}" cy="${cy + 60}" r="520"><stop offset="0" stop-color="${teal}" stop-opacity="0.34"/><stop offset="0.35" stop-color="${teal}" stop-opacity="0.1"/><stop offset="1" stop-color="${teal}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sp-core"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.3" stop-color="${pale}" stop-opacity="0.55"/><stop offset="1" stop-color="${teal}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sp-pool"><stop offset="0" stop-color="${pale}" stop-opacity="0.6"/><stop offset="0.4" stop-color="${teal}" stop-opacity="0.25"/><stop offset="1" stop-color="${teal}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sp-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${pale}" stop-opacity="0.45"/><stop offset="1" stop-color="${teal}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-sp-frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(frame, '#ffffff', 0.18)}"/><stop offset="0.5" stop-color="${frame}"/><stop offset="1" stop-color="${mix(frame, '#000000', 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-sp-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0.3" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.42" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-sp-art" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="${mix(teal, t.bg, 0.35)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}"/></radialGradient>
<linearGradient id="dbtefx-sp-paper" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="146" y2="0"><stop offset="0" stop-color="${mix(paper, t.bg, 0.55)}"/><stop offset="0.18" stop-color="${mix(paper, teal, 0.1)}"/><stop offset="1" stop-color="${mix(paper, t.bg, 0.12)}"/></linearGradient>
<linearGradient id="dbtefx-sp-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(wood, '#000000', 0.5)}"/><stop offset="0.35" stop-color="${wood}"/><stop offset="0.6" stop-color="${mix(wood, teal, 0.12)}"/><stop offset="1" stop-color="${mix(wood, '#000000', 0.6)}"/></linearGradient>
<radialGradient id="dbtefx-sp-shade" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.6"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sp-sky)"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sp-halo)" ${anim('pulse', 9, 0, 'ease-in-out')}/>
<g transform="translate(${bx} ${cy})" fill="${teal}" fill-opacity="0.3"><g style="animation: dbtefx-spin 200s linear infinite;">${ring}<circle r="200" fill="none" stroke="${teal}" stroke-opacity="0.16"/><circle r="214" fill="none" stroke="${teal}" stroke-opacity="0.08" stroke-dasharray="2 9"/></g></g>
<!--mid-->
<path d="M${bx - 100} ${by - 4}L${bx - 60} ${cy + 60}H${bx + 60}L${bx + 100} ${by - 4}Z" fill="url(#dbtefx-sp-beam)" ${anim('pulse', 6, 0, 'ease-in-out')}/>
<g transform="translate(${bx} ${by - 44}) scale(1 0.26)"><g fill="none" stroke="${pale}" stroke-width="3.5" stroke-linecap="round" style="animation: dbtefx-spin 26s linear infinite;">${arms}</g><g fill="none" stroke="${teal}" stroke-opacity="0.35" style="animation: dbtefx-spin 40s linear infinite reverse;"><circle r="196" stroke-width="2"/><circle r="110" stroke-width="1.5" stroke-dasharray="6 10"/></g></g>
<ellipse cx="${bx}" cy="${by - 44}" rx="130" ry="34" fill="url(#dbtefx-sp-pool)" ${anim('pulse', 6, 0, 'ease-in-out')}/>
<circle cx="${bx}" cy="${cy}" r="170" fill="url(#dbtefx-sp-core)" opacity="0.32"/>
<g transform="translate(${bx} ${cy})"><g style="animation: dbtefx-sp-hover 9s ease-in-out infinite;">${card}</g></g>
<path d="M${bx - 26} 690H${bx + 26}L${bx + 18} 828H${bx - 18}Z" fill="url(#dbtefx-sp-wood)"/>
<g fill="url(#dbtefx-sp-wood)"><rect x="${bx - 34}" y="${738}" width="68" height="12" rx="3"/><rect x="${bx - 30}" y="${794}" width="60" height="10" rx="3"/></g>
<path d="M${bx - 92} 852L${bx - 70} 826H${bx + 70}L${bx + 92} 852Z" fill="url(#dbtefx-sp-wood)"/>
<path d="M${bx - 70} 826H${bx + 70}M${bx - 34} 738H${bx + 34}M${bx - 30} 794H${bx + 30}" stroke="${gold}" stroke-opacity="0.45" stroke-width="1.2"/>
<path d="M${bx - 128} ${by + 15}L${bx + 128} ${by + 15}L${bx + 114} ${by + 44}H${bx - 114}Z" fill="url(#dbtefx-sp-wood)"/>
<path d="M${bx - 128} ${by + 15}H${bx + 128}" stroke="${pale}" stroke-opacity="0.45" stroke-width="1.4"/>
<path d="M${bx - 114} ${by + 44}H${bx + 114}" stroke="${gold}" stroke-opacity="0.4" stroke-width="1.2"/>
<path d="M${bx - 52} ${by + 44}L${bx - 26} 690H${bx + 26}L${bx + 52} ${by + 44}Z" fill="url(#dbtefx-sp-wood)"/>
<g transform="translate(${bx} ${by}) scale(0.82)">${pageSet(-1)}${pageSet(1)}
<path d="M0 0V60" stroke="#000000" stroke-opacity="0.35" stroke-width="3"/>
<g transform="translate(-74 22) scale(1 0.45)" fill="none" stroke="${mix(gold, t.bg, 0.25)}" stroke-width="1.6"><circle r="18"/><path d="M0 -14L4 -4L14 0L4 4L0 14L-4 4L-14 0L-4 -4Z"/></g>
${turner(0)}${turner(TURN / 2)}
</g>
${sparks}
<!--near-->
<rect width="${W}" height="${H}" fill="url(#dbtefx-sp-shade)"/>`;
};

export default spell;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 36, colors: ['accent', 'link', 'accent2'], rise: true, speed: 0.4 },
  { kind: 'star', count: 40, colors: ['text'] },
];
