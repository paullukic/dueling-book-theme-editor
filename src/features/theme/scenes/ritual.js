import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Ritual: a pillared sanctum in one-point perspective. Offerings rise from a
// stone altar into a column of light, a Ritual knight takes shape inside it,
// braziers burn either side and the summoning seal turns on the floor.

const scene = (t) => {
  const rand = rng(3301);
  const vx = 1240;
  const vy = 430;
  const blue = t.accent;
  const gold = t.accent2;
  const stone = mix(t.bg, t.muted, 0.14);
  const stoneLit = mix(stone, blue, 0.35);
  const dark = mix(t.bg, '#000000', 0.35);

  // A pillar at depth s (1 = nearest) standing at world offset X.
  const pillar = (X, s, lit) => {
    const x = vx + X * s;
    const w = 120 * s;
    const top = vy - 620 * s;
    const foot = vy + 470 * s;
    const cap = 34 * s;
    const fill = lit > 0 ? 'url(#dbtefx-ri-pl)' : 'url(#dbtefx-ri-pr)';
    let flutes = '';
    for (let k = 1; k < 4; k++) flutes += `M${n1(x - w / 2 + (w * k) / 4)} ${n1(top + cap * 2)}V${n1(foot - cap)}`;
    return `<path d="M${n1(x - w / 2)} ${n1(top + cap)}H${n1(x + w / 2)}V${n1(foot - cap)}H${n1(x - w / 2)}Z" fill="${fill}"/><path d="M${n1(x - w * 0.7)} ${n1(top)}H${n1(x + w * 0.7)}L${n1(x + w * 0.56)} ${n1(top + cap)}H${n1(x - w * 0.56)}ZM${n1(x - w * 0.66)} ${n1(foot)}H${n1(x + w * 0.66)}L${n1(x + w * 0.56)} ${n1(foot - cap)}H${n1(x - w * 0.56)}Z" fill="${stone}"/><path d="${flutes}" stroke="${dark}" stroke-width="${n1(2 * s + 0.5)}"/><path d="M${n1(x + (w / 2) * lit)} ${n1(top + cap)}V${n1(foot - cap)}" stroke="${blue}" stroke-opacity="${n1(0.25 + 0.3 * (1 - s))}" stroke-width="${n1(3 * s + 1)}"/>`;
  };
  const depths = [1, 0.66, 0.46, 0.33, 0.24, 0.18];
  let left = '';
  let right = '';
  [...depths].reverse().forEach((s) => {
    left += pillar(-1150, s, 1);
    right += pillar(300, s, -1);
  });

  // Floor: perspective joints running to the vanishing point.
  let floor = '';
  for (let i = -12; i <= 6; i++) {
    const [x2] = [vx + i * 170];
    floor += `M${vx} ${vy}L${n1(x2 + (x2 - vx) * 0.2)} ${H}`;
  }
  depths.forEach((s) => {
    floor += `M0 ${n1(vy + 470 * s)}H${W}`;
  });

  // The turning seal: concentric rings of runes and ticks.
  let runes = '';
  for (let i = 0; i < 24; i++) {
    const [x, y] = polar(0, 0, 255, i * 15);
    runes += `<path transform="translate(${x} ${y}) rotate(${i * 15 + 90})" d="${['M-8 -8V8M-8 0L6 -8M-8 0L6 8', 'M-8 8L0 -8L8 8M-4 2H4', 'M-6 -8V8H6M-6 0H4', 'M0 -8V8M-8 -2L0 -8L8 -2'][i % 4]}"/>`;
  }
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const [a, b] = polar(0, 0, 200, i * 5);
    const [c, d] = polar(0, 0, i % 3 ? 188 : 176, i * 5);
    ticks += `M${a} ${b}L${c} ${d}`;
  }
  const seal = `<circle r="300" stroke-width="4"/><circle r="280" stroke-width="1.5"/><circle r="230" stroke-width="3"/><circle r="200" stroke-width="1.5"/><path d="${ticks}" stroke-width="2"/><circle r="150" stroke-width="2" stroke-dasharray="18 8"/><circle r="110" stroke-width="3"/><circle r="60" stroke-width="1.5"/>${runes}`;

  // Ritual Spell sigils (rings around a downward triangle) orbiting the beam.
  const sigil = (d) => `<g style="animation: dbtefx-ri-orbit 18s linear ${n1(-d)}s infinite;"><g transform="translate(${vx} 380)" fill="none" stroke="${gold}" stroke-width="2.5"><circle r="26" fill="${mix(t.bg, gold, 0.2)}" fill-opacity="0.8"/><circle r="19"/><path d="M-13 -7H13L0 15Z" fill="${gold}" fill-opacity="0.6"/></g></g>`;

  // Braziers: bowl on legs with a layered flame.
  const brazier = (x, y, s, d) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0L-40 90M30 0L40 90M0 4V90" stroke="${dark}" stroke-width="6"/><path d="M-44 -10H44Q40 22 0 26Q-40 22 -44 -10Z" fill="${stone}" stroke="${gold}" stroke-opacity="0.5" stroke-width="2"/><ellipse cy="-80" rx="90" ry="110" fill="url(#dbtefx-ri-fire)" ${anim('pulse', 2.4, d, 'ease-in-out')}/><path d="M-30 -8Q-40 -50 -12 -86Q-14 -56 0 -48Q-4 -96 18 -130Q22 -80 34 -60Q40 -30 30 -8Z" fill="${gold}" ${anim('flicker', 1.6, d, 'ease-in-out')}/><path d="M-14 -8Q-18 -34 0 -60Q6 -34 14 -24Q18 -14 14 -8Z" fill="#ffffff" fill-opacity="0.85" ${anim('flicker', 1.2, d + 0.4, 'ease-in-out')}/></g>`;

  // The Ritual knight forming in the beam: horned helm, shield and blade.
  const knight = 'M-30 0L-22 -70L-30 -120L-40 -150L-34 -175L-60 -195L-70 -215L-92 -222L-74 -236L-40 -238L-18 -244L-20 -262L-46 -326L-8 -276L0 -290L8 -276L44 -330L20 -262L18 -244L40 -238L74 -236L92 -222L70 -215L94 -248L108 -282L96 -292L80 -262L56 -230L50 -200L36 -175L40 -150L30 -120L24 -70L32 0L6 0L0 -46L-6 0Z';
  const sword = 'M98 -286L170 -416L180 -410L110 -280ZM84 -298L124 -276L120 -268L80 -290ZM102 -286L94 -270L100 -266L108 -282Z';
  const cape = 'M-40 -236Q-104 -160 -112 0H-30L0 -50L30 0H112Q104 -160 40 -236Z';

  // Moonlight shafts slanting in from high windows.
  let shafts = '';
  [180, 520, 820].forEach((x, i) => {
    shafts += `<path d="M${x} 0H${x + 90}L${x + 390} ${H}H${x + 220}Z" ${anim('pulse', 9 + i * 2, i * 3, 'ease-in-out')}/>`;
  });

  // Dust motes hanging in the light.
  let dust = '';
  for (let i = 0; i < 26; i++) dust += `<circle cx="${n1(vx - 140 + rand() * 280)}" cy="${n1(80 + rand() * 440)}" r="${n1(1 + rand() * 2)}"/>`;

  return `<defs>
<linearGradient id="dbtefx-ri-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.3)}" stop-opacity="0.95"/><stop offset="0.48" stop-color="${mix(t.bg, blue, 0.12)}" stop-opacity="0.92"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0.95"/></linearGradient>
<radialGradient id="dbtefx-ri-glow" gradientUnits="userSpaceOnUse" cx="${vx}" cy="${vy + 80}" r="760"><stop offset="0" stop-color="${blue}" stop-opacity="0.55"/><stop offset="0.3" stop-color="${blue}" stop-opacity="0.14"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ri-pl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${dark}"/><stop offset="0.7" stop-color="${stone}"/><stop offset="1" stop-color="${stoneLit}"/></linearGradient>
<linearGradient id="dbtefx-ri-pr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${stoneLit}"/><stop offset="0.3" stop-color="${stone}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
<linearGradient id="dbtefx-ri-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${blue}" stop-opacity="0"/><stop offset="0.3" stop-color="${blue}" stop-opacity="0.45"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.7" stop-color="${blue}" stop-opacity="0.45"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-ri-beamfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.35" stop-color="#ffffff" stop-opacity="1"/></linearGradient>
<mask id="dbtefx-ri-bm"><rect x="${vx - 200}" y="0" width="400" height="560" fill="url(#dbtefx-ri-beamfade)"/></mask>
<radialGradient id="dbtefx-ri-fire"><stop offset="0" stop-color="${gold}" stop-opacity="0.5"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ri-shade" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.75"/></radialGradient>
<linearGradient id="dbtefx-ri-shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${blue}" stop-opacity="0.2"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ri-sky)"/>
<path d="M0 ${vy}H${W}V${H}H0Z" fill="${mix(t.bg, blue, 0.06)}"/>
<path d="${floor}" stroke="${blue}" stroke-opacity="0.08" stroke-width="1.5"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ri-glow)" ${anim('pulse', 6, 0, 'ease-in-out')}/>
<g fill="url(#dbtefx-ri-shaft)">${shafts}</g>
<g opacity="0.5">${left}</g>${right}
<!--mid-->
<g transform="translate(${vx} 760) scale(1 0.2)"><g fill="none" stroke="${blue}" stroke-opacity="0.55" style="animation: dbtefx-spin 60s linear infinite;">${seal}</g></g>
<g transform="translate(${vx} 760) scale(1 0.2)"><circle r="300" fill="${blue}" fill-opacity="0.1" ${anim('pulse', 3, 0, 'ease-in-out')}/></g>
<path d="M${vx - 150} 640L${vx - 120} 560H${vx + 120}L${vx + 150} 640ZM${vx - 190} 690L${vx - 160} 640H${vx + 160}L${vx + 190} 690Z" fill="${stone}" stroke="${blue}" stroke-opacity="0.35" stroke-width="2"/>
<path d="M${vx - 120} 560H${vx + 120}L${vx + 104} 548H${vx - 104}Z" fill="${stoneLit}"/>
<g transform="translate(${vx} 600) scale(1 0.9)" fill="none" stroke="#ffffff" stroke-width="2" ${anim('pulse', 3, 0, 'ease-in-out')}><circle r="30"/><circle r="20"/><path d="M0 -30L30 0L0 30L-30 0Z"/><circle r="5" fill="#ffffff"/></g>
<g mask="url(#dbtefx-ri-bm)"><rect x="${vx - 110}" y="0" width="220" height="556" fill="url(#dbtefx-ri-beam)" style="animation: dbtefx-ri-beam 4s ease-in-out infinite; transform-box: fill-box; transform-origin: center;"/></g>
<g fill="${mix(t.bg, blue, 0.22)}" stroke="${mix(blue, '#ffffff', 0.6)}" stroke-opacity="0.8" stroke-width="2" stroke-linejoin="round"><g transform="translate(${vx} 548)"><path d="${cape}" fill="${mix(t.bg, blue, 0.15)}" fill-opacity="0.55" stroke="none"/><path d="${knight}"/><ellipse cx="-76" cy="-162" rx="30" ry="40"/><ellipse cx="-76" cy="-162" rx="18" ry="26" fill="none" stroke-opacity="0.5"/><path d="M-12 -258H12" stroke="#ffffff" stroke-width="3"/></g></g>
<g transform="translate(${vx} 548)"><path d="${sword}" fill="${mix(blue, '#ffffff', 0.75)}" stroke="#ffffff" stroke-width="1"/></g>
<g transform="translate(${vx} 548)" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round" ${anim('pulse', 4, 0, 'ease-in-out')}><path d="${knight}"/></g>
<g fill="#ffffff" fill-opacity="0.8">${dust}</g>
${sigil(0)}${sigil(6)}${sigil(12)}
${brazier(vx - 150, 616, 0.72, 0)}${brazier(vx + 150, 616, 0.72, 0.7)}
<style>@keyframes dbtefx-ri-orbit { 0% { transform: translate(150px, 0) scale(1); opacity: 1; } 25% { transform: translate(0, 46px) scale(1.15); opacity: 1; } 50% { transform: translate(-150px, 0) scale(1); opacity: 1; } 75% { transform: translate(0, -46px) scale(0.8); opacity: 0.35; } 100% { transform: translate(150px, 0) scale(1); opacity: 1; } }
@keyframes dbtefx-ri-beam { 0%, 100% { transform: scaleX(0.85); opacity: 0.8; } 50% { transform: scaleX(1.1); opacity: 1; } }</style>
<!--near-->
<rect width="${W}" height="${H}" fill="url(#dbtefx-ri-shade)"/>`;
};

export default scene;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 60, colors: ['accent', 'text'], rise: true, speed: 0.6 },
  { kind: 'ember', count: 24, colors: ['accent2', 'warning'], speed: 0.5 },
  { kind: 'spark', count: 16, colors: ['accent', 'text'], speed: 0.5, column: true, columnX: 0.78 },
];
