import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, polar, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Cyber Dragon: the real card artwork, coiled up the right edge inside a
// photon reactor: graded to the theme's steel and cyan, it sits in a slowly
// turning targeting ring while a cold specular glint sweeps the chrome. The
// art loads live from DuelingBook (cardart.js); without it the reactor glow,
// rings and scan lines still stand.

const cyberDragon = (t) => {
  const deep = mix(t.bg, '#000000', 0.45);
  const photon = mix(t.accent, '#ffffff', 0.55);
  const [ax, ay, aw, ah] = [1080, 100, 540, 700];
  const [rx, ry] = [ax + aw / 2, ay + ah * 0.46];

  // Speed rays from behind the dragon, very faint, the card art's backdrop.
  let rays = '';
  for (let i = 0; i < 18; i++) {
    const [x0, y0] = polar(rx, ry, 120, 180 + i * 10 - 1.4);
    const [x1, y1] = polar(rx, ry, 1600, 180 + i * 10 - 1.4);
    const [x2, y2] = polar(rx, ry, 1600, 180 + i * 10 + 1.4);
    rays += `M${x0} ${y0}L${x1} ${y1}L${x2} ${y2}Z`;
  }

  // Targeting ring: ticks, broken arcs and four chevrons around the core.
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const [x1, y1] = polar(0, 0, i % 6 ? 318 : 300, i * 5);
    const [x2, y2] = polar(0, 0, 330, i * 5);
    ticks += `M${x1} ${y1}L${x2} ${y2}`;
  }
  const chevrons = [0, 90, 180, 270].map((a) => {
    const [x0, y0] = polar(0, 0, 346, a - 4);
    const [x1, y1] = polar(0, 0, 366, a);
    const [x2, y2] = polar(0, 0, 346, a + 4);
    return `M${x0} ${y0}L${x1} ${y1}L${x2} ${y2}`;
  }).join('');

  // Circuit traces running out from the reactor toward the right edge.
  const traces = [[1040, 180, 1120, 180, 1150, 150, 1600], [1010, 690, 1100, 690, 1130, 720, 1600], [1560, 0, 1560, 60, 1520, 100, 1520, 250]]
    .map(([x0, y0, x1, y1, x2, y2, x3, y3 = y2]) => `M${x0} ${y0}H${x1}L${x2} ${y2}H${x3}${y3 !== y2 ? `V${y3}` : ''}`).join('');
  const nodes = [[1040, 180], [1010, 690], [1520, 250]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${t.accent}"/>`).join('');

  return `<style>${CARD_ART_KEYFRAMES}
@keyframes dbtefx-cd-sweep { 0%, 45% { transform: translateX(-520px); } 80%, 100% { transform: translateX(620px); } }
@keyframes dbtefx-cd-scan { 0% { transform: translateY(-80px); opacity: 0; } 10%, 90% { opacity: 1; } 100% { transform: translateY(900px); opacity: 0; } }</style>
<defs>${glow('dbtefx-cd-back', t.accent, 0.5, 0.5, 0.5, 0.32)}${glow('dbtefx-cd-core', photon, 0.5, 0.5, 0.5, 0.5)}
<linearGradient id="dbtefx-cd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.accent, 0.08)}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
<linearGradient id="dbtefx-cd-spec" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="${photon}" stop-opacity="0.5"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-cd-scanl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${photon}" stop-opacity="0"/><stop offset="0.85" stop-color="${photon}" stop-opacity="0.22"/><stop offset="0.9" stop-color="${photon}" stop-opacity="0.5"/><stop offset="1" stop-color="${photon}" stop-opacity="0"/></linearGradient>
<pattern id="dbtefx-cd-lines" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="1" fill="${deep}" fill-opacity="0.45"/></pattern>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-cd-sky)"/>
<path d="${rays}" fill="${t.accent}" fill-opacity="0.04"/>
<path d="${traces}" fill="none" stroke="${t.accent}" stroke-opacity="0.22" stroke-width="2"/>${nodes}
<ellipse cx="${rx}" cy="${ry}" rx="560" ry="560" fill="url(#dbtefx-cd-back)"/>
<!--mid-->
<g transform="translate(${rx} ${ry})" fill="none" stroke="${t.accent}">
<g style="animation: dbtefx-spin 90s linear infinite;"><path d="${ticks}" stroke-opacity="0.35" stroke-width="2"/><circle r="270" stroke-opacity="0.18" stroke-dasharray="120 40 20 40" stroke-width="3"/></g>
<g style="animation: dbtefx-spin 60s linear infinite reverse;"><path d="${chevrons}" stroke-opacity="0.6" stroke-width="3"/><circle r="390" stroke-opacity="0.1" stroke-dasharray="4 14" stroke-width="2"/></g>
</g>
<circle cx="${rx}" cy="${ry}" r="240" fill="url(#dbtefx-cd-core)" ${anim('bloom', 6, 0, 'ease-in-out')}/>
<g class="dbtefx-cd-herogrp">${cardArt(t, { id: 'dbtefx-cd-hero', card: CARDS.cyberDragon, x: ax, y: ay, w: aw, h: ah, focus: [0.5, 0.48], zoom: 0.86, feather: 0.45, fade: 0.55, blend: 'normal', backdrop: mix(t.bg, t.accent, 0.3), backdropAmt: 0.9, glow: t.accent, breathe: 14, tint: mix(t.bg, t.accent, 0.5), tintAmt: 0.55 })}
<g mask="url(#dbtefx-cd-hero-m)" style="mix-blend-mode: screen;"><g transform="rotate(20 ${rx} ${ry})"><rect x="${n1(rx - 90)}" y="${ay - 200}" width="180" height="${ah + 400}" fill="url(#dbtefx-cd-spec)" style="animation: dbtefx-cd-sweep 9s ease-in-out infinite;"/></g></g>
<g mask="url(#dbtefx-cd-hero-m)"><rect x="${ax}" y="${ay}" width="${aw}" height="${ah}" fill="url(#dbtefx-cd-lines)"/><rect x="${ax}" y="0" width="${aw}" height="80" fill="url(#dbtefx-cd-scanl)" style="animation: dbtefx-cd-scan 7s linear infinite;"/></g></g>
<!--near-->`;
};

export default cyberDragon;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'spark', count: 18, colors: ['accent2'], speed: 0.5 },
  { kind: 'mote', count: 26, colors: ['accent'] },
];
