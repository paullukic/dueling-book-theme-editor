import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Shadow Realm: the void behind a Shadow Game. A slow vortex and watching
// eyes in the clouds, a ruined keep and a graveyard in violet fog, a zombie
// lurching in from the edge and the dead clawing up out of the ground.

const scene = (t) => {
  const rand = rng(6606);
  const green = t.accent;
  const violet = t.accent2;
  const ink = mix(t.bg, '#000000', 0.55);
  const rim = mix(t.bg, violet, 0.55);

  // The vortex: many thin spiral arms flattened into the sky.
  const vx = 1150;
  const vy = 120;
  let arms = '';
  for (let a = 0; a < 12; a++) {
    let d = '';
    const off = a * 30 + rand() * 12;
    for (let i = 0; i <= 50; i++) {
      const r = 20 + i * 13;
      const [x, y] = polar(vx, vy, r, off + i * 6);
      d += `${i ? 'L' : 'M'}${x} ${n1(vy + (y - vy) * 0.5)}`;
    }
    arms += `<path d="${d}" stroke-width="${n1(4 + rand() * 22)}" stroke-opacity="${n1(0.03 + rand() * 0.06)}"/>`;
  }

  // Eyes splitting open in the clouds: slit pupils, no outlines.
  const eye = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="90" ry="44" fill="url(#dbtefx-sr-eglow)" ${anim('pulse', n1(5 + d), d, 'ease-in-out')}/><path d="M-70 4Q-30 -26 0 -24Q34 -22 66 -2Q30 22 0 22Q-34 24 -70 4Z" fill="${mix(t.bg, violet, 0.12)}"/><g style="animation: dbtefx-sr-blink ${n1(8 + d)}s ease-in-out ${n1(-d * 1.9)}s infinite; transform-box: fill-box; transform-origin: center;"><path d="M-56 2Q-24 -20 0 -19Q28 -18 54 0Q26 17 0 17Q-26 18 -56 2Z" fill="${mix(t.bg, violet, 0.35)}"/><circle r="16" fill="url(#dbtefx-sr-iris)"/><path d="M0 -14Q4 0 0 14Q-4 0 0 -14Z" fill="#000000"/><circle cx="-6" cy="-6" r="2.5" fill="#ffffff" fill-opacity="0.8"/></g></g>`;
  const eyes = [[360, 110, 0.75], [640, 70, 0.55], [900, 120, 0.85], [1390, 250, 0.7], [1420, 80, 0.5], [220, 230, 0.5]]
    .map(([x, y, s], i) => eye(x, y, s, i * 1.1)).join('');

  // Ruined keep on the horizon.
  const keep = 'M1000 770V610L1016 600V540L1030 470L1044 540V600L1060 610V650H1090V560L1110 500L1130 560V650H1156V580L1182 370L1208 580V660H1240V600L1256 540L1272 600V700L1300 690L1316 620L1332 700V770Z';

  // Tombstones and grave markers along the hill.
  let stones = '';
  for (let i = 0; i < 13; i++) {
    const x = 140 + i * 104 + rand() * 40;
    const y = 790 + rand() * 24;
    const h = 46 + rand() * 44;
    const w = 24 + rand() * 16;
    const tilt = n1((rand() - 0.5) * 24);
    const kind = Math.floor(rand() * 3);
    const shape = kind === 0
      ? `M${n1(-w)} 0V${n1(-h + w)}A${n1(w)} ${n1(w)} 0 0 1 ${n1(w)} ${n1(-h + w)}V0Z`
      : kind === 1
        ? `M-6 0V${n1(-h)}H6V${n1(-h * 0.72)}H${n1(w * 0.8)}V${n1(-h * 0.56)}H6V0ZM-6 ${n1(-h * 0.72)}H${n1(-w * 0.8)}V${n1(-h * 0.56)}H-6Z`
        : `M${n1(-w)} 0V${n1(-h * 0.7)}L${n1(-w * 0.3)} ${n1(-h)}L${n1(w * 0.2)} ${n1(-h * 0.8)}L${n1(w)} ${n1(-h * 0.9)}V0Z`;
    stones += `<path transform="translate(${n1(x)} ${n1(y)}) rotate(${tilt})" d="${shape}"/>`;
  }

  // Grave-light: souls glowing up through the earth.
  let glows = '';
  [300, 640, 980, 1240].forEach((x, i) => {
    glows += `<ellipse cx="${x}" cy="840" rx="190" ry="90" fill="url(#dbtefx-sr-soul)" ${anim('pulse', n1(4 + i * 0.7), i * 1.3, 'ease-in-out')}/>`;
  });

  // Souls slipping free of the graves and rising.
  let souls = '';
  [[420, 8], [760, 11], [1060, 9], [1280, 12]].forEach(([x, d], i) => {
    souls += `<g style="animation: dbtefx-sr-soul ${d}s ease-in ${n1(-i * 2.7)}s infinite;"><path transform="translate(${x} 800)" d="M0 -26C14 -26 18 -8 10 6C4 18 8 40 -2 70C-2 40 -14 20 -14 4C-16 -14 -10 -26 0 -26Z" fill="url(#dbtefx-sr-wisp)"/><circle cx="${x - 3}" cy="786" r="3" fill="#ffffff" fill-opacity="0.8"/></g>`;
  });

  // A dead tree: gnarled branches split from the trunk.
  let tree = '';
  const branch = (x, y, ang, len, w, depth) => {
    const [ex, ey] = polar(x, y, len, ang);
    const [cx, cy] = polar(x, y, len * 0.5, ang + (rand() - 0.5) * 50);
    tree += `<path d="M${n1(x)} ${n1(y)}Q${cx} ${cy} ${ex} ${ey}" stroke-width="${n1(w)}"/>`;
    if (depth > 0) {
      branch(ex, ey, ang - 16 - rand() * 26, len * 0.72, w * 0.62, depth - 1);
      branch(ex, ey, ang + 12 + rand() * 26, len * 0.64, w * 0.58, depth - 1);
    }
  };
  branch(150, 900, -78, 250, 38, 5);

  // A zombie lurching left, both arms reaching.
  const zombie = 'M30 0L40 -90L36 -160L48 -210L56 -260Q60 -320 30 -350L10 -362Q4 -390 -24 -392Q-50 -392 -56 -368L-62 -356L-56 -346L-60 -336L-48 -326L-56 -314L-36 -310L-30 -320L-40 -306L-110 -300L-170 -294L-198 -298L-212 -292L-192 -288L-208 -282L-188 -280L-198 -272L-172 -276L-110 -282L-50 -284L-40 -250L-30 -200L-42 -190L-28 -180L-40 -168L-30 -150L-50 -80L-40 0L-72 0L-68 -10L-14 -10L-6 -120L10 -100L4 0Z';
  const zArm = 'M-30 -334L-120 -344L-180 -350L-204 -360L-198 -346L-214 -344L-194 -336L-120 -326L-34 -318Z';

  // The dead reaching up out of the ground: bony, jointed fingers.
  const finger = (bx, by, ang, len, bend) => {
    const [x1, y1] = polar(bx, by, len * 0.45, ang);
    const [x2, y2] = polar(x1, y1, len * 0.35, ang + bend);
    const [x3, y3] = polar(x2, y2, len * 0.25, ang + bend * 2.2);
    return `M${bx} ${by}L${x1} ${y1}L${x2} ${y2}L${x3} ${y3}`;
  };
  const hand = (x, y, s, r, d, flip) => {
    const f = flip ? -1 : 1;
    const fingers = finger(-16, -150, -112, 70, -22 * f) + finger(-6, -156, -96, 86, -26 * f) + finger(6, -154, -82, 80, -26 * f) + finger(16, -148, -66, 64, -24 * f) + finger(-20, -126, -150, 50, 28 * f);
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><g style="transform-origin: 0px 40px; animation: dbtefx-sr-claw ${n1(6 + d)}s ease-in-out ${n1(-d)}s infinite;"><path d="M-14 60L-12 -110Q-24 -128 -20 -152H22Q24 -128 14 -110L16 60Z" fill="${ink}"/><path d="${fingers}" fill="none" stroke="${ink}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 -110L16 40M22 -152Q24 -128 14 -110" fill="none" stroke="${green}" stroke-opacity="0.45" stroke-width="2"/><path d="M-12 30L-4 18L4 32L12 20" fill="none" stroke="${rim}" stroke-width="2"/></g></g>`;
  };

  // Fog banks.
  let fog = '';
  for (let i = 0; i < 7; i++) fog += `<ellipse cx="${n1(80 + i * 240 + rand() * 80)}" cy="${n1(690 + rand() * 120)}" rx="${n1(280 + rand() * 140)}" ry="${n1(50 + rand() * 30)}" fill="url(#dbtefx-sr-fog${i % 2})" ${anim('drift', n1(16 + rand() * 10), rand() * 12, 'ease-in-out')}/>`;

  return `<defs>
<linearGradient id="dbtefx-sr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, violet, 0.26)}" stop-opacity="0.96"/><stop offset="0.45" stop-color="${mix(t.bg, violet, 0.06)}" stop-opacity="0.93"/><stop offset="0.8" stop-color="${mix(t.bg, green, 0.05)}" stop-opacity="0.95"/><stop offset="1" stop-color="${t.bg}"/></linearGradient>
<radialGradient id="dbtefx-sr-void" gradientUnits="userSpaceOnUse" cx="${vx}" cy="${vy}" r="640"><stop offset="0" stop-color="#000000" stop-opacity="0.95"/><stop offset="0.1" stop-color="${violet}" stop-opacity="0.32"/><stop offset="0.45" stop-color="${violet}" stop-opacity="0.1"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sr-eglow"><stop offset="0" stop-color="${green}" stop-opacity="0.3"/><stop offset="1" stop-color="${green}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sr-iris"><stop offset="0" stop-color="${mix(green, '#ffffff', 0.5)}"/><stop offset="0.6" stop-color="${green}"/><stop offset="1" stop-color="${mix(green, '#000000', 0.6)}"/></radialGradient>
<radialGradient id="dbtefx-sr-soul"><stop offset="0" stop-color="${green}" stop-opacity="0.32"/><stop offset="1" stop-color="${green}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sr-fog0"><stop offset="0" stop-color="${mix(t.bg, violet, 0.4)}" stop-opacity="0.7"/><stop offset="1" stop-color="${mix(t.bg, violet, 0.4)}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sr-fog1"><stop offset="0" stop-color="${mix(t.bg, green, 0.25)}" stop-opacity="0.5"/><stop offset="1" stop-color="${mix(t.bg, green, 0.25)}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sr-geye"><stop offset="0" stop-color="#ffffff"/><stop offset="0.3" stop-color="${green}"/><stop offset="1" stop-color="${green}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sr-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, violet, 0.32)}"/><stop offset="0.35" stop-color="${mix(t.bg, violet, 0.1)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-sr-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, violet, 0.12)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<radialGradient id="dbtefx-sr-shade" cx="0.5" cy="0.45" r="0.75"><stop offset="0.5" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.8"/></radialGradient>
<linearGradient id="dbtefx-sr-wisp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(green, '#ffffff', 0.4)}" stop-opacity="0.75"/><stop offset="1" stop-color="${green}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sr-sky)"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sr-void)"/>
<g fill="none" stroke="${violet}" stroke-linecap="round" style="transform-origin: ${vx}px ${vy}px; animation: dbtefx-spin 160s linear infinite reverse;">${arms}</g>
<g transform="translate(${vx} ${vy + 4}) scale(0.62)" fill="none" stroke="${green}" stroke-width="5" stroke-linecap="round" ${anim('pulse', 6, 0, 'ease-in-out')}><path d="M-62 2Q-14 -38 52 -2Q4 26 -62 2ZM52 -2L84 -4M-60 -30Q-4 -58 66 -30M-4 20L-10 60M14 18Q34 48 56 52Q70 54 66 40Q60 32 52 40"/><circle r="13" fill="${green}"/></g>
${eyes}
<g transform="translate(-60 0)"><path d="${keep}" fill="${ink}"/><path d="M1182 370L1208 580M1110 500L1130 560M1030 470L1044 540" stroke="${violet}" stroke-opacity="0.35" stroke-width="2"/></g>
<!--mid-->
${fog}
<path d="M0 810Q200 770 420 794T880 786T1300 780T1600 790V900H0Z" fill="url(#dbtefx-sr-ground)"/>
${glows}
${souls}
<g fill="url(#dbtefx-sr-stone)">${stones}</g>
<g fill="none" stroke="${ink}" stroke-linecap="round">${tree}</g>
<g transform="translate(860 812) scale(0.5)" opacity="0.55"><g style="animation: dbtefx-sr-lurch 11s ease-in-out -4s infinite;"><path d="${zArm}" fill="${ink}"/><path d="${zombie}" fill="${ink}"/><circle cx="-48" cy="-362" r="14" fill="url(#dbtefx-sr-geye)"/></g></g>
<g transform="translate(1400 870) scale(1.05)"><g style="animation: dbtefx-sr-lurch 9s ease-in-out infinite;"><path d="${zArm}" fill="${mix(ink, violet, 0.08)}"/><path d="${zombie}" fill="${ink}" stroke="${rim}" stroke-opacity="0.7" stroke-width="2" stroke-linejoin="round"/><circle cx="-48" cy="-362" r="12" fill="url(#dbtefx-sr-geye)" ${anim('pulse', 2.6, 0, 'ease-in-out')}/></g></g>
<style>@keyframes dbtefx-sr-blink { 0%, 86%, 100% { transform: scaleY(1); } 90%, 93% { transform: scaleY(0.05); } }
@keyframes dbtefx-sr-claw { 0%, 100% { transform: rotate(-4deg) translateY(0); } 50% { transform: rotate(5deg) translateY(-12px); } }
@keyframes dbtefx-sr-soul { 0% { transform: translate(0, 0) scale(0.6); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(-30px, -560px) scale(1.2); opacity: 0; } }
@keyframes dbtefx-sr-lurch { 0%, 100% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(-16px) rotate(-2deg); } }</style>
<!--near-->
<rect width="${W}" height="${H}" fill="url(#dbtefx-sr-shade)"/>
${hand(250, 905, 1.1, -14, 0)}${hand(560, 940, 0.85, 10, 2, 1)}${hand(890, 925, 0.95, -6, 4)}${hand(1180, 940, 1.15, 12, 1, 1)}
<path d="M0 875Q300 850 640 876T1280 866T1600 860V900H0Z" fill="${ink}"/>`;
};

export default scene;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 45, colors: ['accent', 'accent2'], rise: true, speed: 0.5 },
  { kind: 'ash', count: 40, colors: ['muted', 'accent2'], light: true },
];
