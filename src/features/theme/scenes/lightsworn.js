import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Lightsworn: Judgment descends. Judgment Dragon, the real card artwork
// loaded live from DuelingBook (cardart.js), rises out of a blinding sun
// above the clouds in its own whites and golds, faded into the parchment
// sky by opacity and a soft feathered window. Rays and a turning sanctuary circle make the light
// physical; offline, the sun, rays and circle still stand.

const SX = 1290;
const SY = 380;

const lightsworn = (t) => {
  const rand = rng(41);
  const gold = t.accent;
  const warm = mix(t.bg, t.accent, 0.3);

  // Rays: alternating light shafts and faint shadow shafts from the sun.
  let rays = '';
  let dusk = '';
  for (let i = 0; i < 32; i++) {
    const a = i * 11.25 + (rand() - 0.5) * 4;
    const w = 0.6 + rand() * 2.2;
    const [x1, y1] = polar(SX, SY, 1500, a - w);
    const [x2, y2] = polar(SX, SY, 1500, a + w);
    const d = `M${SX} ${SY}L${x1} ${y1}L${x2} ${y2}Z`;
    if (i % 2) dusk += d;
    else rays += d;
  }

  // The sanctuary circle: rings, ticks and an eight-pointed star of light.
  let ticks = '';
  for (let i = 0; i < 96; i++) {
    const [x1, y1] = polar(SX, SY, i % 6 ? 392 : 376, i * 3.75);
    const [x2, y2] = polar(SX, SY, 404, i * 3.75);
    ticks += `M${x1} ${y1}L${x2} ${y2}`;
  }
  let starPts = '';
  for (let i = 0; i < 16; i++) starPts += `${i ? 'L' : 'M'}${polar(SX, SY, i % 2 ? 150 : 330, i * 22.5 - 90).join(' ')}`;
  let star2 = '';
  for (let i = 0; i < 16; i++) star2 += `${i ? 'L' : 'M'}${polar(SX, SY, i % 2 ? 120 : 250, i * 22.5 - 78.75).join(' ')}`;

  // Cloud banks: soft white puffs with warm undersides.
  const bank = (y, rad, step, o, seed) => {
    const r2 = rng(seed);
    let c = '';
    for (let x = -rad; x < W + rad; x += step * (0.7 + r2() * 0.6)) {
      const r = rad * (0.7 + r2() * 0.6);
      c += `<ellipse cx="${n1(x)}" cy="${n1(y + (r2() - 0.5) * rad * 0.6)}" rx="${n1(r * (1.4 + r2()))}" ry="${n1(r * (0.7 + r2() * 0.4))}"/>`;
    }
    return `<g fill="url(#dbtefx-ls-cloud)" opacity="${o}">${c}</g>`;
  };

  return `<style>${CARD_ART_KEYFRAMES} @keyframes dbtefx-ls-rays { 0%, 100% { transform: rotate(-3deg); opacity: 0.8; } 50% { transform: rotate(3deg); opacity: 1; } }
</style>
<defs>
<linearGradient id="dbtefx-ls-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.accent2, 0.32)}"/><stop offset="0.55" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.14)}"/></linearGradient>
<radialGradient id="dbtefx-ls-vig" cx="${n1(SX / W)}" cy="${n1(SY / H)}" r="1.1"><stop offset="0.3" stop-color="${warm}" stop-opacity="0"/><stop offset="1" stop-color="${warm}" stop-opacity="0.18"/></radialGradient>
<radialGradient id="dbtefx-ls-ray" gradientUnits="userSpaceOnUse" cx="${SX}" cy="${SY}" r="1300"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ls-dusk" gradientUnits="userSpaceOnUse" cx="${SX}" cy="${SY}" r="1300"><stop offset="0.1" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.5" stop-color="${t.accent}" stop-opacity="0.08"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ls-cloud" cx="0.5" cy="0.35" r="0.6"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.6" stop-color="${mix(t.bg, '#ffffff', 0.5)}" stop-opacity="0.75"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.2)}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ls-cfadeg" gradientUnits="userSpaceOnUse" x1="1000" y1="0" x2="1180" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.15"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<mask id="dbtefx-ls-cfade" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#dbtefx-ls-cfadeg)"/></mask>
<linearGradient id="dbtefx-ls-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.22)}"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ls-sky)"/>
<g style="transform-origin: ${SX}px ${SY}px; animation: dbtefx-ls-rays 30s ease-in-out infinite;"><path d="${dusk}" fill="url(#dbtefx-ls-dusk)"/><path d="${rays}" fill="url(#dbtefx-ls-ray)"/></g>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ls-vig)"/>
<g fill="none" stroke="${gold}" mask="url(#dbtefx-ls-cfade)">
<g style="transform-origin: ${SX}px ${SY}px; animation: dbtefx-spin 200s linear infinite;"><circle cx="${SX}" cy="${SY}" r="404" stroke-opacity="0.4" stroke-width="2"/><circle cx="${SX}" cy="${SY}" r="372" stroke-opacity="0.25"/><path d="${ticks}" stroke-opacity="0.35" stroke-width="1.5"/><path d="${starPts}Z" stroke-opacity="0.14" stroke-width="1.5"/></g>
<g style="transform-origin: ${SX}px ${SY}px; animation: dbtefx-spin 140s linear infinite reverse;"><circle cx="${SX}" cy="${SY}" r="470" stroke-opacity="0.2" stroke-dasharray="3 9" stroke-width="2"/><path d="${star2}Z" stroke-opacity="0.1"/><circle cx="${SX}" cy="${SY}" r="252" stroke-opacity="0.22"/></g>
</g>
${bank(820, 60, 150, 0.7, 3)}
<!--mid-->
<defs>
<radialGradient id="dbtefx-ls-flare" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ls-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.25" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.5" stop-color="${mix(t.bg, '#ffffff', 0.6)}" stop-opacity="0.55"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
</defs>
<circle cx="${SX}" cy="${SY}" r="420" fill="url(#dbtefx-ls-sun)"/>
<circle cx="${SX}" cy="${SY - 60}" r="300" fill="url(#dbtefx-ls-flare)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
${cardArt(t, { id: 'dbtefx-ls-hero', card: CARDS.judgmentDragon, x: SX - 330, y: SY - 330, w: 680, h: 640, focus: [0.5, 0.45], zoom: 0.92, feather: 0.62, fade: 0.6, blend: 'normal', grade: 'saturate(1.15) contrast(1.05)', backdrop: '#ffffff', backdropAmt: 0.7, opacity: 0.62, glow: t.accent, breathe: 16 })}
${bank(850, 80, 170, 0.8, 7)}
${bank(905, 110, 190, 1, 11)}`;
};

export default lightsworn;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 60, colors: ['raised', 'border'], rise: true },
  { kind: 'feather', count: 10, colors: ['raised'], outline: 'border', speed: 0.6 },
  { kind: 'flash', colors: ['raised'] },
];
