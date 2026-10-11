import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Shadow Realm: the void a Shadow Game opens. A vortex with the Eye of Wdjat
// at its heart and watching eyes in the clouds; broken duel-arena stones
// float in violet fog, a zombie stands on the largest, lost souls drift and
// the dead claw up from the dark below.

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
      const [x, y] = polar(vx, vy, 20 + i * 13, off + i * 6);
      d += `${i ? 'L' : 'M'}${x} ${n1(vy + (y - vy) * 0.5)}`;
    }
    arms += `<path d="${d}" stroke-width="${n1(4 + rand() * 22)}" stroke-opacity="${n1(0.03 + rand() * 0.06)}"/>`;
  }

  // Eyes splitting open in the clouds: slit pupils, staggered blinks.
  const eye = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="90" ry="44" fill="url(#dbtefx-sr-eglow)"/><path d="M-70 4Q-30 -26 0 -24Q34 -22 66 -2Q30 22 0 22Q-34 24 -70 4Z" fill="${mix(t.bg, violet, 0.12)}"/><g style="animation: dbtefx-sr-blink ${n1(8 + d)}s ease-in-out ${n1(-d * 1.9)}s infinite; transform-box: fill-box; transform-origin: center;"><path d="M-56 2Q-24 -20 0 -19Q28 -18 54 0Q26 17 0 17Q-26 18 -56 2Z" fill="${mix(t.bg, violet, 0.35)}"/><circle r="16" fill="url(#dbtefx-sr-iris)"/><path d="M0 -14Q4 0 0 14Q-4 0 0 -14Z" fill="#000000"/><circle cx="-6" cy="-6" r="2.5" fill="#ffffff" fill-opacity="0.8"/></g></g>`;
  const eyes = [[350, 96, 0.7], [640, 66, 0.55], [900, 86, 0.75], [1400, 270, 0.7], [1400, 84, 0.5]]
    .map(([x, y, s], i) => eye(x, y, s, i * 1.1)).join('');

  // Lost souls: hollow figures in glowing outline, drifting.
  const soul = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s})"><g style="animation: dbtefx-sr-drift ${n1(9 + d)}s ease-in-out ${n1(-d)}s infinite;"><path d="M0 -96C14 -96 20 -84 18 -72C16 -62 10 -58 8 -54C26 -50 40 -40 44 -20C48 6 34 30 30 60C26 84 14 100 4 120C2 96 -6 92 -12 110C-14 84 -26 70 -30 50C-38 20 -48 -8 -40 -30C-34 -44 -22 -52 -8 -54C-12 -58 -18 -64 -18 -74C-18 -88 -12 -96 0 -96Z" fill="${green}" fill-opacity="0.07" stroke="${green}" stroke-opacity="0.75" stroke-width="2.5"/></g></g>`;

  // The zombie on the big stone, both arms reaching left.
  const zombie = 'M30 0L40 -90L36 -160L48 -210L56 -260Q60 -320 30 -350L10 -362Q4 -390 -24 -392Q-50 -392 -56 -368L-62 -356L-56 -346L-60 -336L-48 -326L-56 -314L-36 -310L-30 -320L-40 -306L-110 -300L-170 -294L-198 -298L-212 -292L-192 -288L-208 -282L-188 -280L-198 -272L-172 -276L-110 -282L-50 -284L-40 -250L-30 -200L-42 -190L-28 -180L-40 -168L-30 -150L-50 -80L-40 0L-72 0L-68 -10L-14 -10L-6 -120L10 -100L4 0Z';
  const rags = 'M-40 -250L-30 -200L-42 -190L-28 -180L-40 -168M56 -260L64 -230L52 -220L60 -200';

  // The dead reaching up from below: thick knuckled fingers.
  const finger = (bx, by, ang, len, bend) => {
    const [x1, y1] = polar(bx, by, len * 0.45, ang);
    const [x2, y2] = polar(x1, y1, len * 0.33, ang + bend);
    const [x3, y3] = polar(x2, y2, len * 0.24, ang + bend * 2.2);
    return { d: `M${bx} ${by}L${x1} ${y1}L${x2} ${y2}L${x3} ${y3}`, k: `M${x1} ${y1}h0M${x2} ${y2}h0` };
  };
  const hand = (x, y, s, r, d, flip) => {
    const f = flip ? -1 : 1;
    const fs = [finger(-18, -150, -114, 74, -20 * f), finger(-6, -158, -96, 90, -24 * f), finger(8, -156, -80, 84, -24 * f), finger(20, -148, -64, 66, -22 * f), finger(-24, -124, -152, 54, 26 * f)];
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><g style="animation: dbtefx-sr-rise 6s ease-in-out ${n1(-d)}s infinite;"><path d="M-18 80L-16 -110Q-30 -130 -26 -156H28Q30 -130 18 -110L20 80Z" fill="${ink}"/><path d="${fs.map((q) => q.d).join('')}" fill="none" stroke="${ink}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="${fs.map((q) => q.k).join('')}" stroke="${ink}" stroke-width="19" stroke-linecap="round"/><path d="M18 -110L20 60M28 -156Q30 -130 18 -110" fill="none" stroke="${green}" stroke-opacity="0.5" stroke-width="2"/></g></g>`;
  };

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
<radialGradient id="dbtefx-sr-shade" cx="0.5" cy="0.45" r="0.75"><stop offset="0.5" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.8"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sr-sky)"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sr-void)"/>
<g fill="none" stroke="${violet}" stroke-linecap="round" style="transform-origin: ${vx}px ${vy}px; animation: dbtefx-spin 160s linear infinite reverse;">${arms}</g>
<g transform="translate(${vx} ${vy + 4}) scale(0.62)" fill="none" stroke="${green}" stroke-width="5" stroke-linecap="round" ${anim('pulse', 6, 0, 'ease-in-out')}><path d="M-62 2Q-14 -38 52 -2Q4 26 -62 2ZM52 -2L84 -4M-60 -30Q-4 -58 66 -30M-4 20L-10 60M14 18Q34 48 56 52Q70 54 66 40Q60 32 52 40"/><circle r="13" fill="${green}"/></g>
${eyes}
<rect width="${W}" height="${H}" fill="url(#dbtefx-sr-under)"/>
<!--mid-->
${fog}
${soul(1270, 300, 0.5, 0)}${soul(1410, 420, 0.42, 5)}
<g transform="translate(1335 720) scale(1.25)"><g style="animation: dbtefx-sr-float 12s ease-in-out infinite;"><path d="M-110 22L30 40L106 26L64 92L22 70L-8 128L-46 66L-84 60Z" fill="${ink}"/><path d="M-120 0L20 14L110 6L106 26L30 40L-110 22Z" fill="url(#dbtefx-sr-side)"/><path d="M-120 0L-62 -30L132 -24L110 6L20 14Z" fill="url(#dbtefx-sr-top)"/><path d="M-120 0L-62 -30L132 -24" fill="none" stroke="${rim}" stroke-width="1.5"/><path d="M-60 -6L-30 -20L18 -18L-8 -3ZM30 -2L52 -19L96 -18L80 -1Z" fill="none" stroke="${violet}" stroke-opacity="0.5" stroke-width="1.2"/>
<g transform="translate(30 -8) scale(0.72)"><g style="animation: dbtefx-sr-lurch 9s ease-in-out infinite;"><path d="${zombie}" fill="${ink}" stroke="${rim}" stroke-opacity="0.8" stroke-width="2.5" stroke-linejoin="round"/><path d="${rags}" fill="none" stroke="${rim}" stroke-opacity="0.5" stroke-width="2"/><path d="M-58 -370Q-46 -378 -34 -370M-40 -352Q-30 -340 -36 -326M-48 -326L-30 -322M-22 -384Q-4 -360 -12 -330" fill="none" stroke="${rim}" stroke-opacity="0.7" stroke-width="2"/><ellipse cx="-44" cy="-360" rx="8" ry="6" fill="#000000"/><path d="M-36 -270Q-20 -264 -6 -270M-38 -252Q-20 -246 -4 -252M-36 -234Q-20 -228 -8 -234M30 -350Q58 -320 56 -262" fill="none" stroke="${green}" stroke-opacity="0.35" stroke-width="2"/><circle cx="-48" cy="-362" r="13" fill="url(#dbtefx-sr-geye)" ${anim('pulse', 2.6, 0, 'ease-in-out')}/></g></g></g></g>
<style>@keyframes dbtefx-sr-blink { 0%, 86%, 100% { transform: scaleY(1); } 90%, 93% { transform: scaleY(0.05); } }
@keyframes dbtefx-sr-rise { 0%, 100% { transform: translateY(26px); } 50% { transform: translateY(-14px); } }
@keyframes dbtefx-sr-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes dbtefx-sr-drift { 0%, 100% { transform: translate(0, 0); opacity: 0.55; } 50% { transform: translate(-14px, -22px); opacity: 1; } }
@keyframes dbtefx-sr-lurch { 0%, 100% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(-10px) rotate(-2deg); } }</style>
<!--near-->
<rect width="${W}" height="${H}" fill="url(#dbtefx-sr-shade)"/>
${hand(195, 930, 1.15, 12, 0, 1)}${hand(1235, 950, 0.95, -10, 2)}${hand(1425, 935, 1.1, 12, 4, 1)}`;
};

export default scene;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 45, colors: ['accent', 'accent2'], rise: true, speed: 0.5 },
  { kind: 'ash', count: 30, colors: ['muted', 'accent2'], light: true },
];
