import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Shadow Realm: the void a Shadow Game opens. A vortex with the Eye of Wdjat
// at its heart and watching eyes in the clouds; a shaft of green light falls
// on an empty, broken duel-arena stone floating in violet fog, and lost
// souls drift up into the vortex.

const scene = (t) => {
  const rand = rng(6606);
  const green = t.accent;
  const violet = t.accent2;
  const ink = mix(t.bg, '#000000', 0.55);
  const rim = mix(t.bg, violet, 0.6);

  // The vortex: many thin spiral arms flattened into the sky.
  const vx = 1150;
  const vy = 120;
  let arms = '';
  for (let a = 0; a < 12; a++) {
    let d = '';
    const off = a * 30 + rand() * 12;
    for (let i = 0; i <= 50; i++) {
      const [x, y] = polar(vx, vy, 20 + i * 15, off + i * 6);
      d += `${i ? 'L' : 'M'}${x} ${n1(vy + (y - vy) * 0.5)}`;
    }
    arms += `<path d="${d}" stroke-width="${n1(4 + rand() * 22)}" stroke-opacity="${n1(0.03 + rand() * 0.06)}"/>`;
  }

  // Eyes splitting open in the clouds: slit pupils, staggered blinks.
  const eye = (x, y, s, d, cls = '') => `<g${cls ? ` class="${cls}"` : ''} transform="translate(${x} ${y}) scale(${s})"><ellipse rx="90" ry="44" fill="url(#dbtefx-sr-eglow)"/><path d="M-70 4Q-30 -26 0 -24Q34 -22 66 -2Q30 22 0 22Q-34 24 -70 4Z" fill="${mix(t.bg, violet, 0.12)}"/><g style="animation: dbtefx-sr-blink ${n1(8 + d)}s ease-in-out ${n1(-d * 1.9)}s infinite; transform-box: fill-box; transform-origin: center;"><path d="M-56 2Q-24 -20 0 -19Q28 -18 54 0Q26 17 0 17Q-26 18 -56 2Z" fill="${mix(t.bg, violet, 0.35)}"/><circle r="16" fill="url(#dbtefx-sr-iris)"/><path d="M0 -14Q4 0 0 14Q-4 0 0 -14Z" fill="#000000"/><circle cx="-6" cy="-6" r="2.5" fill="#ffffff" fill-opacity="0.8"/></g></g>`;
  const eyes = [[350, 120, 0.7], [540, 112, 0.55], [1000, 110, 0.75], [1400, 270, 0.7], [1462, 122, 0.5], [1478, 600, 0.5]]
    .map(([x, y, s], i) => eye(x, y, s, i * 1.1, i === 2 ? 'dbtefx-sr-instage' : '')).join('');

  // Lost souls: hollow figures in glowing outline, drifting.
  const soul = (x, y, s, d) => `<g class="dbtefx-sr-nomenu" transform="translate(${x} ${y}) scale(${s})"><g style="animation: dbtefx-sr-drift ${n1(9 + d)}s ease-in-out ${n1(-d)}s infinite;"><path d="M0 -96C14 -96 20 -84 18 -72C16 -62 10 -58 8 -54C26 -50 40 -40 44 -20C48 6 34 30 30 60C26 84 14 100 4 120C2 96 -6 92 -12 110C-14 84 -26 70 -30 50C-38 20 -48 -8 -40 -30C-34 -44 -22 -52 -8 -54C-12 -58 -18 -64 -18 -74C-18 -88 -12 -96 0 -96Z" fill="${green}" fill-opacity="0.07" stroke="${green}" stroke-opacity="0.75" stroke-width="2.5"/></g></g>`;

  // Fog banks rolling through the void.
  let fog = '';
  for (let i = 0; i < 7; i++) fog += `<ellipse cx="${n1(80 + i * 240 + rand() * 80)}" cy="${n1(640 + rand() * 180)}" rx="${n1(300 + rand() * 140)}" ry="${n1(50 + rand() * 30)}" fill="url(#dbtefx-sr-fog${i % 2})" ${anim('drift', n1(16 + rand() * 10), rand() * 12, 'ease-in-out')}/>`;

  return `<defs>
<linearGradient id="dbtefx-sr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, violet, 0.26)}" stop-opacity="0.96"/><stop offset="0.45" stop-color="${mix(t.bg, violet, 0.06)}" stop-opacity="0.93"/><stop offset="0.8" stop-color="${mix(t.bg, violet, 0.12)}" stop-opacity="0.95"/><stop offset="1" stop-color="${t.bg}"/></linearGradient>
<radialGradient id="dbtefx-sr-void" gradientUnits="userSpaceOnUse" cx="${vx}" cy="${vy}" r="640"><stop offset="0" stop-color="#000000" stop-opacity="0.95"/><stop offset="0.1" stop-color="${violet}" stop-opacity="0.32"/><stop offset="0.45" stop-color="${violet}" stop-opacity="0.1"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sr-eglow"><stop offset="0" stop-color="${green}" stop-opacity="0.3"/><stop offset="1" stop-color="${green}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sr-iris"><stop offset="0" stop-color="${mix(green, '#ffffff', 0.5)}"/><stop offset="0.6" stop-color="${green}"/><stop offset="1" stop-color="${mix(green, '#000000', 0.6)}"/></radialGradient>
<radialGradient id="dbtefx-sr-fog0"><stop offset="0" stop-color="${mix(t.bg, violet, 0.4)}" stop-opacity="0.7"/><stop offset="1" stop-color="${mix(t.bg, violet, 0.4)}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sr-fog1"><stop offset="0" stop-color="${mix(t.bg, green, 0.22)}" stop-opacity="0.45"/><stop offset="1" stop-color="${mix(t.bg, green, 0.22)}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sr-geye"><stop offset="0" stop-color="#ffffff"/><stop offset="0.3" stop-color="${green}"/><stop offset="1" stop-color="${green}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sr-top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, violet, 0.38)}"/><stop offset="1" stop-color="${mix(t.bg, violet, 0.16)}"/></linearGradient>
<linearGradient id="dbtefx-sr-side" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, violet, 0.14)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<radialGradient id="dbtefx-sr-under" gradientUnits="userSpaceOnUse" cx="800" cy="900" r="700"><stop offset="0" stop-color="${green}" stop-opacity="0.16"/><stop offset="1" stop-color="${green}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sr-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${green}" stop-opacity="0.22"/><stop offset="1" stop-color="${green}" stop-opacity="0.02"/></linearGradient>
<radialGradient id="dbtefx-sr-shade" cx="0.5" cy="0.45" r="0.75"><stop offset="0.5" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.8"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sr-sky)"/>
<rect class="dbtefx-sr-instage" width="${W}" height="${H}" fill="url(#dbtefx-sr-void)"/>
<g class="dbtefx-sr-instage" fill="none" stroke="${violet}" stroke-linecap="round" style="transform-origin: ${vx}px ${vy}px; animation: dbtefx-spin 160s linear infinite reverse;">${arms}</g>
<g class="dbtefx-sr-instage dbtefx-sr-nomenu" transform="translate(${vx} ${vy + 4}) scale(0.62)" fill="none" stroke="${green}" stroke-width="5" stroke-linecap="round" ${anim('pulse', 6, 0, 'ease-in-out')}><path d="M-62 2Q-14 -38 52 -2Q4 26 -62 2ZM52 -2L84 -4M-60 -30Q-4 -58 66 -30M-4 20L-10 60M14 18Q34 48 56 52Q70 54 66 40Q60 32 52 40"/><circle r="13" fill="${green}"/></g>
${eyes}
<rect width="${W}" height="${H}" fill="url(#dbtefx-sr-under)"/>
<!--mid-->
${fog}
${soul(1270, 300, 0.5, 0)}${soul(1410, 420, 0.42, 5)}
<path class="dbtefx-sr-nomenu" d="M1130 140L1250 690H1420L1170 140Z" fill="url(#dbtefx-sr-shaft)"/>
<g transform="translate(1335 720) scale(1.25)"><g style="animation: dbtefx-sr-float 12s ease-in-out infinite;"><path d="M-110 22L30 40L106 26L64 92L22 70L-8 128L-46 66L-84 60Z" fill="${ink}"/><path d="M-120 0L20 14L110 6L106 26L30 40L-110 22Z" fill="url(#dbtefx-sr-side)"/><path d="M-120 0L-62 -30L132 -24L110 6L20 14Z" fill="url(#dbtefx-sr-top)"/><path d="M-120 0L-62 -30L132 -24" fill="none" stroke="${rim}" stroke-width="1.5"/><path d="M-60 -6L-30 -20L18 -18L-8 -3ZM30 -2L52 -19L96 -18L80 -1Z" fill="none" stroke="${violet}" stroke-opacity="0.5" stroke-width="1.2"/></g></g>
<style>@keyframes dbtefx-sr-blink { 0%, 86%, 100% { transform: scaleY(1); } 90%, 93% { transform: scaleY(0.05); } }
@keyframes dbtefx-sr-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes dbtefx-sr-drift { 0%, 100% { transform: translate(0, 0); opacity: 0.55; } 50% { transform: translate(-14px, -22px); opacity: 1; } }
</style>
<!--near-->
<rect width="${W}" height="${H}" fill="url(#dbtefx-sr-shade)"/>
`;
};

export default scene;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 45, colors: ['accent', 'accent2'], rise: true, speed: 0.5 },
  { kind: 'ash', count: 30, colors: ['muted', 'accent2'], light: true },
];
