import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Number 39: Utopia over Heartland. Dusk under the Astral sky: deep blue
// overhead, Heartland Tower's heart-crowned spire and the city low on the
// left. On the right Utopia, the real card artwork (loaded live from
// DuelingBook, cardart.js), is screened into a slowly turning golden
// sunburst so his white-and-gold armour glows and the card's dark sword
// falls away. Offline the sunburst, halo and city still stand.

const utopia = (t) => {
  const rand = rng(39);
  const cx = 1290;
  const gold = t.accent;
  const goldHi = mix(t.accent, '#ffffff', 0.45);
  const red = t.accent2;
  const night = mix(t.bg, '#000000', 0.25);
  const dusk = mix(t.bg, t.opp, 0.32);

  // ---- far: Astral sky, stars, Heartland ----
  let stars = '';
  for (let i = 0; i < 110; i++) stars += `M${n1(rand() * 1600)} ${n1(rand() * 560)}h0`;
  let glints = '';
  [[300, 120, 7], [560, 220, 5], [880, 90, 6], [180, 380, 5], [760, 420, 4]].forEach(([x, y, s]) => {
    glints += `M${x} ${y - s}L${n1(x + s * 0.22)} ${n1(y - s * 0.22)}L${x + s} ${y}L${n1(x + s * 0.22)} ${n1(y + s * 0.22)}L${x} ${y + s}L${n1(x - s * 0.22)} ${n1(y + s * 0.22)}L${x - s} ${y}L${n1(x - s * 0.22)} ${n1(y - s * 0.22)}Z`;
  });
  // Heartland: a low city of blue towers and the spire with the heart on top.
  const base = 790;
  let city = '';
  let lights = '';
  let x = 120;
  while (x < 1600) {
    const w = 24 + rand() * 40;
    const h = 30 + rand() * 90 * (x < 700 ? 1 : 0.6);
    city += `M${n1(x)} 900V${n1(base - h)}h${n1(w)}V900Z`;
    for (let k = 0; k < 3; k++) if (rand() < 0.7) lights += `M${n1(x + 5 + rand() * (w - 10))} ${n1(base - h + 10 + rand() * (h - 10))}h0`;
    x += w + 4 + rand() * 10;
  }
  const tx = 330;
  const tower = `M${tx - 26} 900L${tx - 9} 300H${tx + 9}L${tx + 26} 900ZM${tx - 40} 520H${tx + 40}L${tx + 30} 534H${tx - 30}Z`;
  const heart = `M${tx} 292C${tx - 14} 278 ${tx - 46} 262 ${tx - 46} 232C${tx - 46} 210 ${tx - 22} 200 ${tx} 220C${tx + 22} 200 ${tx + 46} 210 ${tx + 46} 232C${tx + 46} 262 ${tx + 14} 278 ${tx} 292Z`;

  // ---- mid: the sunburst and Utopia ----
  let rays = '';
  for (let i = 0; i < 36; i++) {
    const a = i * 10;
    const [x1, y1] = polar(cx, 300, 1100, a - (i % 2 ? 1.2 : 2.6));
    const [x2, y2] = polar(cx, 300, 1100, a + (i % 2 ? 1.2 : 2.6));
    rays += `M${cx} 300L${x1} ${y1}L${x2} ${y2}Z`;
  }

  // Utopia himself: the real card artwork, standing in the sunburst.
  const hero = cardArt(t, { id: 'dbtefx-ut-hero', card: CARDS.utopia, x: 1060, y: 20, w: 420, h: 760, focus: [0.68, 0.42], zoom: 0.72, blend: 'screen', feather: 0.7, fade: 0.7, grade: 'brightness(0.9) contrast(1.35) saturate(0.85)', tint: gold, tintAmt: 0.2, backdrop: night, backdropAmt: 0.75, glow: goldHi, breathe: 16 });

  return `<style>
@keyframes dbtefx-ut-glow { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }
${CARD_ART_KEYFRAMES}
@keyframes dbtefx-ut-halo { 0%, 100% { opacity: 0.55; transform: scale(0.97); } 50% { opacity: 1; transform: scale(1.03); } }
</style>
<defs>
<linearGradient id="dbtefx-ut-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}"/><stop offset="0.55" stop-color="${mix(t.bg, t.opp, 0.18)}"/><stop offset="0.86" stop-color="${dusk}"/><stop offset="1" stop-color="${mix(dusk, gold, 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-ut-sun" cx="${cx}" cy="300" r="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${goldHi}" stop-opacity="0.75"/><stop offset="0.18" stop-color="${gold}" stop-opacity="0.38"/><stop offset="0.5" stop-color="${gold}" stop-opacity="0.1"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ut-rays" cx="${cx}" cy="300" r="900" gradientUnits="userSpaceOnUse"><stop offset="0.1" stop-color="${goldHi}" stop-opacity="0.38"/><stop offset="0.4" stop-color="${gold}" stop-opacity="0.08"/><stop offset="0.75" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ut-mist" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${goldHi}" stop-opacity="0.85"/><stop offset="0.5" stop-color="${gold}" stop-opacity="0.35"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ut-gapfade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="0.06" stop-color="#000000"/><stop offset="0.94" stop-color="#000000"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<mask id="dbtefx-ut-stagegap" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900"><rect width="1600" height="900" fill="#ffffff"/><rect x="440" y="0" width="800" height="900" fill="url(#dbtefx-ut-gapfade)"/></mask>
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-ut-sky)"/>
<path d="${stars}" stroke="${t.text}" stroke-opacity="0.6" stroke-width="1.8" stroke-linecap="round"/>
<path d="${glints}" fill="${t.opp}" fill-opacity="0.8"/>
<path d="${tower}" fill="${mix(night, t.opp, 0.12)}"/>
<path d="${heart}" fill="${red}" fill-opacity="0.18"/><path d="${heart}" fill="none" stroke="${mix(night, t.opp, 0.45)}" stroke-width="9"/><path d="${heart}" fill="none" stroke="${red}" stroke-width="2.4" style="animation: dbtefx-ut-glow 4s ease-in-out infinite;"/>
<circle cx="${tx}" cy="240" r="62" fill="none" stroke="${t.opp}" stroke-opacity="0.35" stroke-width="2"/>
<path d="M${tx} 160V200" stroke="${mix(night, t.opp, 0.3)}" stroke-width="3"/><circle cx="${tx}" cy="158" r="3" fill="${red}"/>
<g class="dbtefx-ut-city"><path d="${city}" fill="${mix(night, t.opp, 0.16)}"/>
<path d="${lights}" stroke="${t.opp}" stroke-opacity="0.7" stroke-width="2.4" stroke-linecap="round"/></g>
<!--mid-->
<g class="dbtefx-ut-sunglow"><circle cx="${cx}" cy="300" r="760" fill="url(#dbtefx-ut-sun)"/>
<g style="transform-origin: ${cx}px 300px; animation: dbtefx-spin 160s linear infinite;"><path d="${rays}" fill="url(#dbtefx-ut-rays)"/></g>
<circle cx="${cx}" cy="300" r="240" fill="none" stroke="${goldHi}" stroke-opacity="0.45" stroke-width="3" style="transform-origin: ${cx}px 300px; animation: dbtefx-ut-halo 6s ease-in-out infinite;"/>
<circle cx="${cx}" cy="300" r="262" fill="none" stroke="${gold}" stroke-opacity="0.25" stroke-width="1.5" stroke-dasharray="2 10"/></g>
<ellipse cx="${cx}" cy="880" rx="340" ry="120" fill="url(#dbtefx-ut-mist)"/>
<g class="dbtefx-ut-herogrp">${hero}</g>
<!--near-->
<path d="M0 900V860Q400 830 800 850T1600 840V900Z" fill="${mix(night, t.opp, 0.1)}" fill-opacity="0.8"/>`;
};

export default utopia;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 46, colors: ['accent', 'text'], rise: true, speed: 0.6 },
  { kind: 'star', count: 50, colors: ['text', 'opp'] },
];
