import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Destiny HERO: midnight over Dark City. The Clock Tower Prison stands black
// against a blood moon, its clock showing the player's real local time (fate, D-Time).
// Before it Destiny HERO - Dogma rises, the real card artwork (loaded live
// from DuelingBook, cardart.js) graded into the moon's blood light; offline
// the tower, moon and back-glow still stand.
const destinyHero = (t) => {
  const rand = rng(23);
  const blood = t.accent;
  const steel = t.accent2;
  const ink = mix(t.bg, '#000000', 0.5);
  const stone = mix(t.bg, t.accent2, 0.14);
  const stoneLit = mix(t.bg, t.accent2, 0.3);
  const fx = 1300;

  // The clock tower: a stone shaft, corner pinnacles, a gable and a needle spire.
  const [kx, ky, kr] = [1330, 290, 92];
  const pinnacle = (x, top) => `M${x - 16} 900V${top + 40}L${x} ${top}L${x + 16} ${top + 40}V900Z`;
  const [tl, tr] = [kx - 120, kx + 120];
  const tower = `<path d="M${tl} 900V198H${tr}V900Z${pinnacle(tl - 8, 110)}${pinnacle(tr + 8, 110)}M${tl + 26} 200L${kx} 92L${tr - 26} 200ZM${kx - 16} 104L${kx} -30L${kx + 16} 104Z" fill="url(#dbtefx-dh-stone)"/>
<path d="M${tl + 26} 200L${kx} 92L${tr - 26} 200M${tl + 6} 198H${tr - 6}M${tl + 2} 410H${tr - 2}" fill="none" stroke="${stoneLit}" stroke-width="3"/>
<path d="M${tl - 8} 110V900M${tr + 8} 110V900M${kx} -30V92" stroke="${blood}" stroke-opacity="0.4" stroke-width="2"/>`;
  let ticks = '';
  for (let i = 0; i < 60; i++) {
    const [x1, y1] = polar(kx, ky, i % 5 ? kr - 7 : kr - 14, i * 6);
    const [x2, y2] = polar(kx, ky, kr - 2, i * 6);
    ticks += `M${x1} ${y1}L${x2} ${y2}`;
  }
  const roman = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  const numerals = roman
    .map((r, i) => {
      const [x, y] = polar(kx, ky, kr - 30, i * 30 - 90);
      return `<text x="${x}" y="${y}" transform="rotate(${i * 30} ${x} ${y})">${r}</text>`;
    })
    .join('');
  const hand = (len, w, tail) => `M${kx - w} ${ky + tail}L${kx - w * 0.6} ${ky - len * 0.7}L${kx} ${ky - len}L${kx + w * 0.6} ${ky - len * 0.7}L${kx + w} ${ky + tail}Z`;
  // Real local time: the outer group turns each hand to "now" (--dbte-now, seconds
  // since local midnight, set when the scene mounts), the inner one keeps it running.
  const rot = (perSecond, dur, timing, body) =>
    `<g style="transform-origin: ${kx}px ${ky}px; transform: rotate(calc(var(--dbte-now, 0) * ${perSecond}deg));"><g style="transform-origin: ${kx}px ${ky}px; animation: dbtefx-spin ${dur}s ${timing} infinite;">${body}</g></g>`;
  const clock = `<circle cx="${kx}" cy="${ky}" r="${kr + 16}" fill="${ink}" stroke="${stoneLit}" stroke-width="4"/>
<circle cx="${kx}" cy="${ky}" r="${kr}" fill="url(#dbtefx-dh-face)"/>
<path d="${ticks}" stroke="${ink}" stroke-width="2.5"/>
<g fill="${ink}" font-family="Georgia, 'Times New Roman', serif" font-size="19" font-weight="700" text-anchor="middle" dominant-baseline="central">${numerals}</g>
<circle cx="${kx}" cy="${ky}" r="${kr - 44}" fill="none" stroke="${ink}" stroke-opacity="0.35" stroke-width="1.5"/>
${rot(1 / 120, 43200, 'linear', `<path d="${hand(52, 6, 10)}" fill="${ink}"/>`)}
${rot(0.1, 3600, 'linear', `<path d="${hand(80, 5, 14)}" fill="${ink}"/>`)}
${rot(6, 60, 'steps(60, end)', `<path d="M${kx - 1.5} ${ky + 22}V${ky - 88}H${kx + 1.5}V${ky + 22}Z" fill="${blood}"/><circle cx="${kx}" cy="${ky - 70}" r="5" fill="none" stroke="${blood}" stroke-width="2"/>`)}
<circle cx="${kx}" cy="${ky}" r="7" fill="${ink}" stroke="${blood}" stroke-width="2"/>`;

  // Dark City: gothic roofs and spires on the horizon, a few lancet windows lit.
  let city = '';
  let lit = '';
  for (let x = -20; x < 1240; ) {
    const w = 60 + rand() * 90;
    const top = n1(650 + rand() * 110);
    const roof = rand();
    city += `M${n1(x)} 900V${top}`;
    if (roof < 0.4) city += `L${n1(x + w / 2)} ${n1(top - 40 - rand() * 50)}L${n1(x + w)} ${top}`;
    else if (roof < 0.6) city += `H${n1(x + w * 0.4)}L${n1(x + w * 0.5)} ${n1(top - 130 - rand() * 60)}L${n1(x + w * 0.6)} ${top}H${n1(x + w)}`;
    else city += `H${n1(x + w)}`;
    city += `V900Z`;
    if (rand() < 0.45) lit += `<path d="M${n1(x + w * 0.5 - 4)} ${n1(top + 40)}v16h8v-16l-4-7z"/>`;
    x += w - 4;
  }

  // Dogma: the real card artwork, rising before the tower in the moon's blood light.
  const dogma = cardArt(t, { id: 'dbtefx-dh-hero', card: CARDS.dogma, x: fx - 220, y: 340, w: 420, h: 600, focus: [0.5, 0.32], zoom: 0.84, blend: 'normal', feather: 0.65, fade: 0.55, grade: 'contrast(1.3) brightness(0.85) saturate(0.6)', tint: blood, tintAmt: 0.4, backdrop: ink, backdropAmt: 0.4, glow: blood, breathe: 16 });

  return `<style>${CARD_ART_KEYFRAMES}</style><defs>
<linearGradient id="dbtefx-dh-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, blood, 0.06)}"/><stop offset="0.55" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, steel, 0.09)}"/></linearGradient>
<radialGradient id="dbtefx-dh-moon" cx="0.42" cy="0.4" r="0.6"><stop offset="0" stop-color="${mix(blood, t.text, 0.3)}"/><stop offset="0.7" stop-color="${blood}"/><stop offset="1" stop-color="${mix(blood, t.bg, 0.35)}"/></radialGradient>
<radialGradient id="dbtefx-dh-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0.35" stop-color="${blood}" stop-opacity="0.35"/><stop offset="1" stop-color="${blood}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dh-stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${stone}"/><stop offset="0.5" stop-color="${mix(stone, t.bg, 0.4)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<radialGradient id="dbtefx-dh-face" cx="0.45" cy="0.4" r="0.65"><stop offset="0" stop-color="${mix(steel, t.text, 0.55)}"/><stop offset="1" stop-color="${mix(steel, t.bg, 0.35)}"/></radialGradient>
<radialGradient id="dbtefx-dh-back" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${blood}" stop-opacity="0.45"/><stop offset="1" stop-color="${blood}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dh-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${steel}" stop-opacity="0"/><stop offset="1" stop-color="${steel}" stop-opacity="0.04"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-dh-sky)"/>
<g class="dbtefx-dh-moon"><circle cx="${kx}" cy="210" r="330" fill="url(#dbtefx-dh-halo)"/>
<circle cx="${kx}" cy="210" r="190" fill="url(#dbtefx-dh-moon)"/></g>
<g fill="${ink}" fill-opacity="0.4" style="animation: dbtefx-drift 40s ease-in-out infinite;"><ellipse cx="${kx - 40}" cy="168" rx="250" ry="7"/><ellipse cx="${kx + 60}" cy="252" rx="230" ry="10"/><ellipse cx="${kx - 120}" cy="300" rx="160" ry="5"/></g>
<path d="${city}" fill="${mix(t.bg, '#000000', 0.25)}"/>
<g fill="${mix(t.warning, t.bg, 0.45)}">${lit}</g>
<rect y="620" width="1600" height="280" fill="url(#dbtefx-dh-mist)"/>
<!--mid-->
${tower}
<g opacity="0.5">${clock}</g>
<ellipse cx="${fx}" cy="600" rx="300" ry="230" fill="url(#dbtefx-dh-back)"/>
${dogma}
<!--near-->
`;
};

export default destinyHero;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ash', count: 46, colors: ['muted', 'accent2'] },
  { kind: 'ember', count: 14, colors: ['accent'] },
];
