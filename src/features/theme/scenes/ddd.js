import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// D/D/D: the throne hall of the overlord kings. At its head the
// dimension gate turns, a gold clock-dial ring around a violet void (the
// doom kings' clockwork). Inside it D/D/D Doom King Armageddon, the real
// card artwork (loaded live from DuelingBook, cardart.js), graded violet.
// In the foreground the Dark Contract hangs unrolled: its lines of script
// light one by one and the crimson seal glows. Offline the gate stands empty.
const ddd = (t) => {
  const rand = rng(91);
  const gold = t.accent;
  const goldLit = mix(t.accent, '#ffffff', 0.45);
  const goldDeep = mix(t.accent, t.bg, 0.55);
  const violet = t.accent2;
  const violetLit = mix(t.accent2, '#ffffff', 0.45);
  const crimson = t.danger;
  const ink = mix(t.bg, '#000000', 0.5);
  const obsidian = mix(t.bg, t.raised, 0.6);
  const parchment = mix(t.text, t.warning, 0.25);
  const kx = 1310;

  // The dimension gate: gold dial rings around a violet void, counter-turning.
  const [gx, gy] = [kx, 300];
  let ticks = '';
  let numerals = '';
  for (let i = 0; i < 60; i++) {
    const big = i % 5 === 0;
    const [x1, y1] = polar(gx, gy, big ? 222 : 232, i * 6);
    const [x2, y2] = polar(gx, gy, 244, i * 6);
    ticks += `M${x1} ${y1}L${x2} ${y2}`;
    if (big) {
      const [nx, ny] = polar(gx, gy, 204, i * 6 - 90);
      numerals += `<rect x="${n1(nx - 3)}" y="${n1(ny - 9)}" width="6" height="18" transform="rotate(${i * 6} ${nx} ${ny})"/>`;
    }
  }
  const gate = `<circle cx="${gx}" cy="${gy}" r="250" fill="url(#dbtefx-ddd-void)"/>
<g style="transform-origin: ${gx}px ${gy}px; animation: dbtefx-spin 110s linear infinite;" fill="none">
<circle cx="${gx}" cy="${gy}" r="250" stroke="${gold}" stroke-width="5"/>
<circle cx="${gx}" cy="${gy}" r="216" stroke="${goldDeep}" stroke-width="2"/>
<path d="${ticks}" stroke="${gold}" stroke-width="2.5"/>
<g fill="${gold}" fill-opacity="0.75">${numerals}</g>
</g>
<g style="transform-origin: ${gx}px ${gy}px; animation: dbtefx-spin 60s linear infinite reverse;" fill="none" stroke="${violet}" stroke-opacity="0.45">
<circle cx="${gx}" cy="${gy}" r="170" stroke-width="2" stroke-dasharray="40 12 6 12"/>
<circle cx="${gx}" cy="${gy}" r="140" stroke-width="1.2"/>
</g>`;

  // Obsidian pillars with gold bands, receding on either side of the hall.
  const pillar = (x, w, top, k) => `<rect x="${n1(x - w / 2)}" y="${top}" width="${w}" height="${900 - top}" fill="url(#dbtefx-ddd-pillar)" fill-opacity="${k}"/><path d="M${n1(x - w / 2)} ${top + 40}h${w}M${n1(x - w / 2)} ${top + 52}h${w}M${n1(x - w / 2)} 780h${w}" stroke="${gold}" stroke-opacity="${n1(0.6 * k)}" stroke-width="3"/><path d="M${n1(x - w / 2 - 10)} ${top}h${w + 20}l-10 22h${-w}Z" fill="${goldDeep}" fill-opacity="${k}"/>`;
  const pillars = `<g class="dbtefx-ddd-nearpillar">${pillar(1030, 44, 90, 0.6)}</g>${pillar(1590, 60, 50, 0.85)}`;

  // D/D/D Doom King Armageddon: the real card artwork, enthroned in the gate.
  const king = cardArt(t, { id: 'dbtefx-ddd-hero', card: CARDS.doomKingArmageddon, x: kx - 230, y: 40, w: 460, h: 560, focus: [0.5, 0.42], zoom: 0.92, blend: 'normal', feather: 0.7, fade: 0.6, grade: 'contrast(1.2) saturate(0.8)', tint: violet, tintAmt: 0.25, backdrop: ink, backdropAmt: 0.85, glow: violet, breathe: 16 });

  // The Dark Contract: an unrolled scroll between two rollers, lines of
  // script that light in turn, a signature and the crimson wax seal.
  const [cx0, cy0] = [1480, 720];
  let script = '';
  for (let i = 0; i < 7; i++) {
    const y = -62 + i * 16;
    const w = i === 6 ? 70 : 150 - rand() * 30;
    let dash = '';
    for (let j = 0; j < 6; j++) dash += `${n1(6 + rand() * 18)} ${n1(3 + rand() * 4)} `;
    script += `<path d="M-84 ${y}h${n1(w)}" stroke="${ink}" stroke-width="3" stroke-dasharray="${dash.trim()}"/><path d="M-84 ${y}h${n1(w)}" stroke="${violetLit}" stroke-width="3" stroke-dasharray="${dash.trim()}" style="animation: dbtefx-ddd-ink 7s ease-in-out ${n1(-7 + i * 0.6)}s infinite;" opacity="0"/>`;
  }
  const contract = `<g transform="translate(${cx0} ${cy0}) rotate(-6) scale(0.8)">
<path d="M-104 -96H104V112H-104Z" fill="url(#dbtefx-ddd-parch)"/>
<path d="M-104 -96H104M-104 112H104" stroke="${mix(parchment, ink, 0.5)}" stroke-width="2"/>
<g class="dbtefx-ddd-script" opacity="0.7">${script}</g>
<path d="M-80 82C-66 70 -58 92 -44 78C-34 68 -26 88 -12 76" fill="none" stroke="${crimson}" stroke-width="2.4"/>
<circle cx="64" cy="76" r="24" fill="url(#dbtefx-ddd-seal)" stroke="${mix(crimson, t.bg, 0.5)}" stroke-width="2" style="animation: dbtefx-ddd-seal 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center;"/>
<circle cx="64" cy="76" r="15" fill="none" stroke="${goldLit}" stroke-width="1.6"/>
<path d="M64 64L67.5 72.5L76 73L69.5 78.5L71.5 87L64 82.5L56.5 87L58.5 78.5L52 73L60.5 72.5Z" fill="${goldLit}" fill-opacity="0.85"/>
<path d="M58 98L52 124L62 116L68 126L70 98Z" fill="${crimson}"/>
<rect x="-118" y="-112" width="236" height="20" rx="10" fill="url(#dbtefx-ddd-roll)" stroke="${goldDeep}" stroke-width="1.5"/>
<rect x="-118" y="104" width="236" height="20" rx="10" fill="url(#dbtefx-ddd-roll)" stroke="${goldDeep}" stroke-width="1.5"/>
<path d="M-124 -102h-10M124 -102h10M-124 114h-10M124 114h10" stroke="${gold}" stroke-width="8" stroke-linecap="round"/>
</g>`;
  // A gold chain hanging from the top roller up out of frame.
  let chain = '';
  for (let i = 0; i < 9; i++) {
    const [x, y] = [n1(cx0 - 52 + i * 2.4), n1(cy0 - 96 - i * 22)];
    chain += i % 2 ? `<rect x="${x - 3}" y="${y - 10}" width="6" height="20" rx="3"/>` : `<ellipse cx="${x}" cy="${y}" rx="7" ry="11"/>`;
  }
  const chains = `<g class="dbtefx-ddd-chain" fill="none" stroke="${gold}" stroke-width="3">${chain}</g>`;

  return `<style>@keyframes dbtefx-ddd-ink { 0%, 100% { opacity: 0; } 12%, 30% { opacity: 0.95; } 50% { opacity: 0; } }
@keyframes dbtefx-ddd-seal { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.06); opacity: 1; } } ${CARD_ART_KEYFRAMES}</style>
<defs>
<linearGradient id="dbtefx-ddd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ink}"/><stop offset="0.7" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, gold, 0.08)}"/></linearGradient>
<radialGradient id="dbtefx-ddd-void"><stop offset="0" stop-color="${violetLit}" stop-opacity="0.55"/><stop offset="0.35" stop-color="${violet}" stop-opacity="0.32"/><stop offset="0.8" stop-color="${mix(violet, t.bg, 0.6)}" stop-opacity="0.35"/><stop offset="1" stop-color="${ink}" stop-opacity="0.6"/></radialGradient>
<radialGradient id="dbtefx-ddd-aura" cx="${kx}" cy="300" r="520" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${gold}" stop-opacity="0.16"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ddd-pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(obsidian, gold, 0.15)}"/><stop offset="0.35" stop-color="${obsidian}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-ddd-parch" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${parchment}"/><stop offset="1" stop-color="${mix(parchment, t.bg, 0.35)}"/></linearGradient>
<linearGradient id="dbtefx-ddd-roll" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${goldLit}"/><stop offset="0.5" stop-color="${mix(parchment, t.bg, 0.2)}"/><stop offset="1" stop-color="${mix(parchment, t.bg, 0.6)}"/></linearGradient>
<radialGradient id="dbtefx-ddd-seal" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="${mix(crimson, '#ffffff', 0.25)}"/><stop offset="1" stop-color="${mix(crimson, t.bg, 0.35)}"/></radialGradient>
<linearGradient id="dbtefx-ddd-hz" gradientUnits="userSpaceOnUse" x1="400" y1="0" x2="620" y2="0"><stop offset="0" stop-color="${goldDeep}" stop-opacity="0"/><stop offset="1" stop-color="${goldDeep}"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-ddd-sky)"/>
<rect width="1600" height="900" fill="url(#dbtefx-ddd-aura)"/>
${gate}
${pillars}
<path d="M-20 900V780H1620V900Z" fill="${mix(obsidian, t.bg, 0.5)}"/>
<path d="M400 780H1620" stroke="url(#dbtefx-ddd-hz)" stroke-width="2"/>
<!--mid-->
${king}
<!--near-->
${chains}
${contract}`;
};

export default ddd;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 40, colors: ['accent'], rise: true },
  { kind: 'spark', count: 14, colors: ['accent2'] },
];
