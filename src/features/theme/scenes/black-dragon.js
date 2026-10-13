import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Black Dragon: Red-Eyes Black Dragon, the real card artwork, rearing out of a
// blood-red sky over a volcanic crag at the right edge, an Inferno Fire Blast
// gathering in its open jaws. The art loads live from DuelingBook
// (cardart.js); without it the sky, smoke, volcano, crag and fireball remain.

const blackDragon = (t) => {
  const ink = mix(t.bg, '#000000', 0.6);
  const fire = mix(t.accent, t.warning, 0.45);
  const core = mix(t.warning, '#ffffff', 0.65);
  const rand = rng(89);

  // Embers drawn into the charging fireball.
  const fx = 1436;
  const fy = 552;
  const embers = [200, 235, 160, 290].map((deg, i) => `<g transform="translate(${fx} ${fy}) rotate(${deg})"><circle cx="0" cy="0" r="${3 - (i % 2)}" fill="${core}" style="animation: dbtefx-rb-draw 2.4s ease-in ${n1(-i * 0.6)}s infinite;"/></g>`).join('');

  // Smoke strata banked across the sky: soft, lit from below.
  let smoke = '';
  for (let i = 0; i < 6; i++) {
    smoke += `<ellipse cx="${n1(100 + rand() * 1400)}" cy="${n1(90 + rand() * 420)}" rx="${n1(280 + rand() * 260)}" ry="${n1(26 + rand() * 26)}" fill="url(#dbtefx-rb-haze)" ${anim('drift', 28 + i * 6, i * 4, 'ease-in-out')}/>`;
  }
  // Distant range with a low, jagged, broken cone; the crater rim glows.
  const ridge = 'M0 730L120 712L214 724L282 690L318 650L338 662L356 640L384 646L402 664L444 700L520 718L660 704L780 728L940 708L1100 732L1600 744V900H0Z';
  const crag = 'M1176 900L1204 770L1250 716L1330 702L1462 698L1540 722L1600 760V900Z';

  return `<style>
${CARD_ART_KEYFRAMES}
@keyframes dbtefx-rb-charge { 0%, 100% { transform: scale(0.8); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 1; } }
@keyframes dbtefx-rb-draw { 0% { transform: translateX(90px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateX(6px); opacity: 0; } }
</style>
<defs>${glow('dbtefx-rb-sun', t.accent, 0.5, 0.5, 0.5, 0.6)}${glow('dbtefx-rb-crater', fire, 0.5, 0.5, 0.5, 0.6)}${glow('dbtefx-rb-haze', ink, 0.5, 0.5, 0.5, 0.8)}
<radialGradient id="dbtefx-rb-ball"><stop offset="0" stop-color="${core}"/><stop offset="0.3" stop-color="${fire}" stop-opacity="0.95"/><stop offset="0.65" stop-color="${t.accent}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-rb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ink}"/><stop offset="0.5" stop-color="${mix(t.bg, t.accent, 0.12)}"/><stop offset="0.8" stop-color="${mix(t.bg, t.accent, 0.3)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent2, 0.22)}"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-rb-sky)"/>
<circle cx="1380" cy="300" r="460" fill="url(#dbtefx-rb-sun)"/>
<ellipse cx="358" cy="650" rx="150" ry="90" fill="url(#dbtefx-rb-crater)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
${smoke}
<path d="${ridge}" fill="${ink}"/>
<!--mid-->
<g class="dbtefx-rb-herogrp">${cardArt(t, { id: 'dbtefx-rb-hero', card: CARDS.redEyes, x: 1330, y: 0, w: 400, h: 740, focus: [0.55, 0.5], zoom: 0.8, blend: 'luminosity', feather: 0.6, fade: 0.65, backdrop: mix(t.bg, t.accent, 0.55), breathe: 14 })}</g>
<circle cx="${fx}" cy="${fy}" r="56" fill="url(#dbtefx-rb-ball)" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-rb-charge 2.4s ease-in-out infinite;"/>
${embers}
<!--near-->
<path d="${crag}" fill="${t.accent}" fill-opacity="0.5" transform="translate(0 -4)"/>
<path d="${crag}" fill="${ink}"/>`;
};

export default blackDragon;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ember', count: 80, colors: ['accent', 'warning', 'accent2'] },
  { kind: 'ash', count: 30, colors: ['muted'] },
];
