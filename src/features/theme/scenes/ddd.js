import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';

// D/D/D: the throne hall of the overlord kings. Behind the throne the
// dimension gate turns, a gold clock-dial ring around a violet void (the
// doom kings' clockwork). The king sits armoured in obsidian and gold,
// horned crown on his helm, visor slit burning violet, crimson cape spread,
// both gauntlets on the pommel of a sword planted before him. In the
// foreground the Dark Contract hangs unrolled: its lines of script light
// one by one and the crimson seal glows.
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
  const kx = 1200;

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
  const pillars = pillar(1000, 44, 90, 0.7) + pillar(1480, 60, 50, 0.85) + pillar(1580, 40, 120, 0.55);

  // Mirror a left-half path across the king's centre line (local x 0).
  const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${n1(-x)} ${y}`);
  const both = (d) => d + mirror(d);

  // The throne: a tall back with three crown spires, armrests and a dais.
  const throneHalf = 'M0 -40L-14 -6L-46 -6L-58 -60L-72 -6L-120 20L-136 -20L-150 30V470H0Z';
  const throne = `<g transform="translate(${kx} 150)">
<path d="${both(throneHalf)}" fill="url(#dbtefx-ddd-throne)" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/>
<path d="${both('M0 0L-10 22H-40L-130 44V450H0Z')}" fill="none" stroke="${goldDeep}" stroke-width="2"/>
<path d="${both('M-170 330H-110V420H-170Z')}" fill="${obsidian}" stroke="${gold}" stroke-width="2.5"/>
<path d="M-260 560H260L230 520H-230Z" fill="${obsidian}" stroke="${gold}" stroke-width="2.5"/>
<path d="M-300 610H300L260 560H-260Z" fill="${mix(obsidian, t.bg, 0.4)}" stroke="${goldDeep}" stroke-width="2"/>
<path d="M-60 -6L-58 -60M60 -6L58 -60" stroke="${goldLit}" stroke-width="1.5"/>
<circle cx="0" cy="-26" r="7" fill="${violet}" style="animation: dbtefx-pulse 5s ease-in-out infinite;"/>
</g>`;

  // The overlord king, seated (local units, helm top at 0).
  const k = {
    cape: 'M-84 120C-130 200 -150 330 -176 470L-120 476C-100 400 -80 300 -56 190Z',
    horn: 'M-34 28C-62 22 -86 0 -94 -46C-78 -18 -60 -4 -34 8Z',
    crown: 'M0 18L-6 -6L-14 18L-22 0L-28 22H0Z',
    helm: 'M0 0C20 0 34 14 36 36V66C30 80 14 88 0 90Z',
    pauldron: 'M-28 100C-70 90 -114 104 -128 146C-112 140 -96 142 -84 152C-80 134 -62 120 -34 120Z',
    pauldron2: 'M-80 150C-96 144 -112 146 -124 160C-110 162 -98 168 -90 178C-88 166 -84 158 -80 150Z',
    arm: 'M-80 140C-96 170 -100 210 -96 236L-74 244C-72 214 -66 180 -60 150Z',
    forearm: 'M-96 230C-80 246 -50 256 -16 252L-14 268C-48 274 -84 266 -100 252Z',
    cuirass: 'M0 104H-40C-50 160 -46 210 -36 252H0Z',
    fauld: 'M0 252H-36L-44 276L-56 304L-62 330H0Z',
    thigh: 'M-8 318H-72C-80 336 -80 354 -72 370H-10Z',
    greave: 'M-70 364C-76 404 -74 452 -66 500L-72 524H-26L-24 500C-20 452 -18 404 -14 364Z',
  };
  let faults = '';
  for (let i = 0; i < 3; i++) faults += `M-${38 + i * 8} ${266 + i * 22}H${38 + i * 8}`;
  const king = `<g transform="translate(${kx} 196)">
<path d="${both(k.cape)}" fill="url(#dbtefx-ddd-cape)"/>
<path d="${both(k.greave)}" fill="url(#dbtefx-ddd-armor)" stroke="${gold}" stroke-width="2"/>
<path d="${both('M-60 404L-44 396L-28 404L-30 420L-44 426L-58 420Z')}" fill="url(#dbtefx-ddd-gilt)" stroke="${gold}" stroke-width="2"/><path d="${both('M-66 480H-26')}" stroke="${goldDeep}" stroke-width="2"/>
<path d="${both(k.thigh)}" fill="url(#dbtefx-ddd-armor)" stroke="${goldDeep}" stroke-width="2"/>
<path d="${both(k.fauld)}" fill="url(#dbtefx-ddd-gilt2)" stroke="${gold}" stroke-width="2"/>
<path d="${faults}" stroke="${goldDeep}" stroke-width="2"/>
<path d="${both(k.cuirass)}" fill="url(#dbtefx-ddd-armor)" stroke="${gold}" stroke-width="2.4"/>
<path d="M-30 150C-14 162 14 162 30 150M-28 196C-12 206 12 206 28 196" fill="none" stroke="${goldDeep}" stroke-width="2"/>
<path d="M0 130L14 150L0 172L-14 150Z" fill="${violet}" stroke="${goldLit}" stroke-width="2" style="animation: dbtefx-pulse 5s ease-in-out -1.5s infinite;"/>
<path d="${both(k.arm)}" fill="url(#dbtefx-ddd-armor)" stroke="${goldDeep}" stroke-width="2"/>
<path d="M-8 238V470L0 490L8 470V238Z" fill="${mix(t.muted, '#ffffff', 0.3)}"/>
<path d="M0 238V478" stroke="${obsidian}" stroke-width="5"/>
<path d="M-48 274H48L40 284H-40Z" fill="${gold}"/>
<circle cx="0" cy="236" r="10" fill="${gold}" stroke="${goldDeep}" stroke-width="2"/>
<path d="${both(k.forearm)}" fill="url(#dbtefx-ddd-armor)" stroke="${gold}" stroke-width="2"/>
<path d="${both('M-18 246C-10 240 -2 240 0 246V268C-8 272 -16 270 -20 264Z')}" fill="${obsidian}" stroke="${goldLit}" stroke-width="1.6"/>
<path d="${both(k.pauldron2)}" fill="url(#dbtefx-ddd-gilt)" stroke="${gold}" stroke-width="2"/>
<path d="${both(k.pauldron)}" fill="url(#dbtefx-ddd-gilt)" stroke="${gold}" stroke-width="2.4"/>
<path d="M-26 86H26L32 106H-32Z" fill="${obsidian}" stroke="${gold}" stroke-width="2"/>
<path d="${both(k.horn)}" fill="url(#dbtefx-ddd-horn)" stroke="${gold}" stroke-width="2"/>
<path d="${both(k.helm)}" fill="url(#dbtefx-ddd-armor)" stroke="${gold}" stroke-width="2.4"/>
<path d="M-36 30H36V38H-36Z" fill="${gold}"/>
<path d="${both(k.crown)}" fill="${gold}" stroke="${goldDeep}" stroke-width="1"/>
<path d="M-26 50H26L22 58H-22Z" fill="${violetLit}" style="animation: dbtefx-pulse 3.5s ease-in-out infinite;"/>
<path d="M0 40V88" stroke="${gold}" stroke-width="2"/>
</g>`;

  // The Dark Contract: an unrolled scroll between two rollers, lines of
  // script that light in turn, a signature and the crimson wax seal.
  const [cx0, cy0] = [1344, 700];
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
${script}
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
  const chains = `<g fill="none" stroke="${gold}" stroke-width="3">${chain}</g>`;

  return `<style>@keyframes dbtefx-ddd-ink { 0%, 100% { opacity: 0; } 12%, 30% { opacity: 0.95; } 50% { opacity: 0; } }
@keyframes dbtefx-ddd-seal { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.06); opacity: 1; } }</style>
<defs>
<linearGradient id="dbtefx-ddd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ink}"/><stop offset="0.7" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, gold, 0.08)}"/></linearGradient>
<radialGradient id="dbtefx-ddd-void"><stop offset="0" stop-color="${violetLit}" stop-opacity="0.55"/><stop offset="0.35" stop-color="${violet}" stop-opacity="0.32"/><stop offset="0.8" stop-color="${mix(violet, t.bg, 0.6)}" stop-opacity="0.35"/><stop offset="1" stop-color="${ink}" stop-opacity="0.6"/></radialGradient>
<radialGradient id="dbtefx-ddd-aura" cx="${kx}" cy="300" r="520" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${gold}" stop-opacity="0.16"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ddd-pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(obsidian, gold, 0.15)}"/><stop offset="0.35" stop-color="${obsidian}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-ddd-throne" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(obsidian, violet, 0.12)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-ddd-armor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(obsidian, '#ffffff', 0.14)}"/><stop offset="0.45" stop-color="${obsidian}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-ddd-gilt" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="${goldLit}"/><stop offset="0.35" stop-color="${gold}"/><stop offset="0.75" stop-color="${goldDeep}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-ddd-gilt2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${goldDeep}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-ddd-horn" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${obsidian}"/><stop offset="1" stop-color="${goldLit}"/></linearGradient>
<linearGradient id="dbtefx-ddd-cape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(crimson, t.bg, 0.35)}"/><stop offset="1" stop-color="${mix(crimson, t.bg, 0.75)}"/></linearGradient>
<linearGradient id="dbtefx-ddd-parch" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${parchment}"/><stop offset="1" stop-color="${mix(parchment, t.bg, 0.35)}"/></linearGradient>
<linearGradient id="dbtefx-ddd-roll" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${goldLit}"/><stop offset="0.5" stop-color="${mix(parchment, t.bg, 0.2)}"/><stop offset="1" stop-color="${mix(parchment, t.bg, 0.6)}"/></linearGradient>
<radialGradient id="dbtefx-ddd-seal" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="${mix(crimson, '#ffffff', 0.25)}"/><stop offset="1" stop-color="${mix(crimson, t.bg, 0.35)}"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-ddd-sky)"/>
<rect width="1600" height="900" fill="url(#dbtefx-ddd-aura)"/>
${gate}
${pillars}
<path d="M-20 900V780H1620V900Z" fill="${mix(obsidian, t.bg, 0.5)}"/>
<path d="M-20 780H1620" stroke="${goldDeep}" stroke-width="2"/>
<!--mid-->
${throne}
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
