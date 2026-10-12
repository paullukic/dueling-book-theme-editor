import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Fire King: dusk over Fire King Island. The volcano smokes on the horizon
// across a darkening sea; on the right Sacred Fire King Garunix, the real card
// artwork, rises from the pyre inside the turning ring of the Fire Kings.
// Every few seconds the pyre flares: the phoenix is reborn. The art loads live
// from DuelingBook (cardart.js); without it the ring, pyre and glow remain.
const fireKing = (t) => {
  const rand = rng(41);
  const crimson = t.self;
  const gold = t.accent;
  const goldLit = mix(t.accent, '#ffffff', 0.45);
  const flame = t.warning;
  const ink = mix(t.bg, '#000000', 0.5);
  const sea = mix(t.bg, t.accent2, 0.16);
  const bx = 1262;

  // The ring of the Fire Kings: a gold ring wrapped in a crown of flame tongues.
  let tongues = '';
  for (let i = 0; i < 28; i++) {
    const a = i * (360 / 28);
    const [x0, y0] = polar(bx, 400, 185, a - 4);
    const [x1, y1] = polar(bx, 400, 185, a + 4);
    const [tx, ty] = polar(bx, 400, 207 + (i % 3) * 11, a + 8);
    tongues += `M${x0} ${y0}Q${polar(bx, 400, 198, a - 2).join(' ')} ${tx} ${ty}Q${polar(bx, 400, 196, a + 6).join(' ')} ${x1} ${y1}Z`;
  }

  // The pyre the phoenix rises from.
  let pyre = '';
  for (let i = 0; i < 9; i++) {
    const x = 1060 + i * 46 + rand() * 20;
    const h = 90 + rand() * 120 - Math.abs(i - 4) * 12;
    pyre += `<path d="M${n1(x - 30)} ${H + 10}C${n1(x - 34)} ${n1(H - h * 0.5)} ${n1(x - 6)} ${n1(H - h * 0.8)} ${n1(x + 4)} ${n1(H - h)}C${n1(x + 2)} ${n1(H - h * 0.6)} ${n1(x + 30)} ${n1(H - h * 0.4)} ${n1(x + 30)} ${H + 10}Z" style="animation: dbtefx-flicker ${n1(1.2 + rand())}s ease-in-out ${n1(-rand() * 2)}s infinite; transform-box: fill-box; transform-origin: center bottom;"/>`;
  }

  // Far: the island volcano across the sea, smoking.
  const horizon = 680;
  const smoke = [[560, 520, 60], [590, 440, 90], [640, 350, 120], [710, 250, 150]]
    .map(([x, y, r], i) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${n1(r * 0.6)}" fill="url(#dbtefx-fk-smoke)" ${`style="animation: dbtefx-drift ${12 + i * 3}s ease-in-out ${-i * 2}s infinite;"`}/>`)
    .join('');

  return `<style>@keyframes dbtefx-fk-reborn { 0%, 70% { transform: scale(0.2); opacity: 0; } 74% { opacity: 0.9; } 100% { transform: scale(1.5); opacity: 0; } }
${CARD_ART_KEYFRAMES}</style>
<defs>
<linearGradient id="dbtefx-fk-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.2)}"/><stop offset="0.5" stop-color="${mix(t.bg, crimson, 0.12)}"/><stop offset="0.7" stop-color="${mix(crimson, t.bg, 0.55)}"/><stop offset="0.76" stop-color="${mix(crimson, t.bg, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-fk-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(sea, crimson, 0.3)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-fk-isle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, crimson, 0.2)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<radialGradient id="dbtefx-fk-smoke"><stop offset="0" stop-color="${mix(t.muted, t.bg, 0.6)}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-fk-halo"><stop offset="0" stop-color="${flame}" stop-opacity="0.55"/><stop offset="0.4" stop-color="${crimson}" stop-opacity="0.3"/><stop offset="1" stop-color="${crimson}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-fk-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${crimson}"/><stop offset="0.5" stop-color="${flame}"/><stop offset="1" stop-color="${mix(flame, '#ffffff', 0.6)}"/></linearGradient>
<linearGradient id="dbtefx-fk-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldLit}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="1" stop-color="${mix(gold, t.bg, 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-fk-pyre" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(flame, '#ffffff', 0.35)}"/><stop offset="0.45" stop-color="${flame}"/><stop offset="0.8" stop-color="${crimson}" stop-opacity="0.8"/><stop offset="1" stop-color="${crimson}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-fk-lava"><stop offset="0" stop-color="${flame}" stop-opacity="0.9"/><stop offset="1" stop-color="${crimson}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-fk-sky)"/>
<ellipse cx="560" cy="${horizon}" rx="420" ry="70" fill="url(#dbtefx-fk-halo)" opacity="0.3"/>
${smoke}
<path d="M240 ${horizon}C330 ${horizon - 30} 420 ${horizon - 70} 500 ${horizon - 140}L530 ${horizon - 150}H596L624 ${horizon - 136}C690 ${horizon - 80} 780 ${horizon - 40} 900 ${horizon}Z" fill="url(#dbtefx-fk-isle)"/>
<path d="M540 ${horizon - 148}q-10 20 -4 40t-10 44M584 ${horizon - 148}q12 24 6 48t12 50" fill="none" stroke="${flame}" stroke-opacity="0.55" stroke-width="2.4" stroke-linecap="round"/>
<ellipse cx="563" cy="${horizon - 152}" rx="48" ry="22" fill="url(#dbtefx-fk-lava)" style="animation: dbtefx-pulse 4s ease-in-out infinite;"/>
<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#dbtefx-fk-sea)"/>
<path d="M0 ${horizon}H${W}" stroke="${flame}" stroke-opacity="0.35" stroke-width="2"/>
<path d="M480 ${horizon + 14}h160M500 ${horizon + 34}h120M530 ${horizon + 58}h70" stroke="${flame}" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round" style="animation: dbtefx-pulse 3s ease-in-out infinite;"/>
<!--mid-->
<g class="dbtefx-fk-phoenix">
<circle cx="${bx}" cy="400" r="300" fill="url(#dbtefx-fk-halo)" style="animation: dbtefx-pulse 6s ease-in-out infinite;"/>
<g style="transform-origin: ${bx}px 400px; animation: dbtefx-spin 90s linear infinite;"><path d="${tongues}" fill="url(#dbtefx-fk-fire)" opacity="0.7"/></g>
<circle cx="${bx}" cy="400" r="185" fill="none" stroke="url(#dbtefx-fk-ring)" stroke-width="10" stroke-opacity="0.55"/>
<circle cx="${bx}" cy="400" r="173" fill="none" stroke="${ink}" stroke-width="6" stroke-dasharray="14 10" stroke-opacity="0.5"/>
<circle cx="${bx}" cy="400" r="173" fill="none" stroke="${gold}" stroke-width="2" stroke-opacity="0.6"/>
<circle cx="${bx}" cy="452" r="120" fill="none" stroke="${flame}" stroke-width="8" style="animation: dbtefx-fk-reborn 8s ease-out infinite; transform-box: fill-box; transform-origin: center;"/>
${cardArt(t, { id: 'dbtefx-fk-hero', card: CARDS.sacredGarunix, x: 1050, y: 40, w: 520, h: 760, focus: [0.5, 0.42], zoom: 0.92, blend: 'normal', feather: 0.62, fade: 0.9, backdrop: mix(t.bg, crimson, 0.3), backdropAmt: 0.6, breathe: 12 })}
</g>
<!--near-->
<g fill="url(#dbtefx-fk-pyre)">${pyre}</g>`;
};

export default fireKing;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'ember', count: 80, colors: ['warning', 'self', 'accent'] }, { kind: 'ash', count: 30, colors: ['muted'], light: true }, { kind: 'spark', count: 16, colors: ['accent2'] }];
