import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Lightsworn: Judgment descends. A blinding sun in the upper right is the
// dragon itself, too bright to look at; only its vast feathered wings show,
// spread across the sky above a temple on the clouds. Rays, a turning
// sanctuary circle and lens ghosts make the light physical.

const SX = 1060;
const SY = 470;

const cubicAt = (p, u) => [0, 1].map((k) => n1((1 - u) ** 3 * p[0][k] + 3 * (1 - u) ** 2 * u * p[1][k] + 3 * (1 - u) * u * u * p[2][k] + u ** 3 * p[3][k]));
const scallop = (pts, cx, cy, k) => {
  let d = '';
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    d += `Q${n1((ax + bx) / 2 + (cx - (ax + bx) / 2) * k)} ${n1((ay + by) / 2 + (cy - (ay + by) / 2) * k)} ${bx} ${by}`;
  }
  return d;
};

// One great wing (pointing right; mirror for the left): flight feathers in a
// scalloped silhouette with shafts, then two rows of coverts along the arm.
const wing = (t, dir, line, shadow) => {
  const arm = [[20, 0], [110, -150], [300, -270], [560, -320]];
  const tier = (n, cx, cy, rx, ry, a0, a1, grow, from, to) => {
    const tips = [];
    for (let i = 0; i <= n; i++) {
      const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
      const k = 1 + grow * (1 - i / n) ** 2;
      tips.push([n1(cx + Math.cos(a) * rx * k), n1(cy + Math.sin(a) * ry * k)]);
    }
    const roots = tips.map((q, i) => cubicAt(arm, from - ((from - to) * i) / n));
    tips[0] = roots[0];
    const shafts = tips.slice(1, -1).map((q, i) => `M${roots[i + 1].join(' ')}L${q.join(' ')}`).join('');
    return { d: `M${roots[n].join(' ')}L${roots[0].join(' ')}${scallop(tips, cx, cy - ry * 0.4, -0.22)}Z`, shafts };
  };
  const flight = tier(16, 300, -130, 300, 160, -56, 122, 0.5, 1, 0.02);
  const mid = tier(12, 290, -190, 250, 90, -40, 120, 0.2, 0.9, 0.04);
  const small = tier(10, 270, -205, 210, 46, -10, 124, 0.1, 0.78, 0.05);
  return `<g transform="scale(${dir} 1)">
<path d="${flight.d}" fill="url(#dbtefx-ls-plume)" stroke="${line}" stroke-opacity="0.45" stroke-width="1.5"/>
<path d="${flight.shafts}" fill="none" stroke="${shadow}" stroke-opacity="0.5" stroke-width="1.4"/>
<path d="${mid.d}" fill="url(#dbtefx-ls-cov)" stroke="${line}" stroke-opacity="0.4" stroke-width="1.2"/>
<path d="${mid.shafts}" fill="none" stroke="${shadow}" stroke-opacity="0.35"/>
<path d="${small.d}" fill="#ffffff" stroke="${line}" stroke-opacity="0.35"/>
<path d="M${arm[0].join(' ')}C${arm[1].join(' ')} ${arm[2].join(' ')} ${arm[3].join(' ')}" fill="none" stroke="${t.accent}" stroke-width="4" stroke-linecap="round" stroke-opacity="0.75"/>
</g>`;
};

const lightsworn = (t) => {
  const rand = rng(41);
  const gold = t.accent;
  const warm = mix(t.bg, t.accent, 0.3);
  const line = mix(t.accent, t.bg, 0.15);
  const shadow = mix(t.bg, t.accent, 0.45);

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

  // Judgment Dragon, emerging from the light: an armoured chest, a neck
  // plated in gold arcing up to the right, and a layered head (skull, jaw,
  // helm and cheek plates, deep eye socket, swept horn crest, feathered mane).
  let throat = '';
  for (let i = 0; i < 7; i++) {
    const u = (i + 0.5) / 7;
    const x = n1(50 + u * 100 - u * u * 10);
    const y = n1(10 - u * 196);
    throat += `<path d="M${n1(x - 40 + u * 14)} ${n1(y - 4 - u * 10)}Q${n1(x - 10)} ${n1(y + 14)} ${n1(x + 5)} ${n1(y - 8)}"/>`;
  }
  let mane = '';
  for (let i = 0; i < 9; i++) {
    const u = i / 8;
    const bx = n1(-40 + u * 160 - u * u * 10);
    const by = n1(10 - u * 236 + u * u * 20);
    const len = 64 - u * 22;
    mane += `<path d="M${bx} ${by}Q${n1(bx - len * 0.8)} ${n1(by - 8)} ${n1(bx - len)} ${n1(by + len * 0.5)}Q${n1(bx - len * 0.4)} ${n1(by + 8)} ${n1(bx + 4)} ${n1(by + 16)}Z"/>`;
  }
  const ink = mix(t.bg, t.text, 0.55);
  const head = `<g transform="translate(128 -214) rotate(16) scale(1.3)">
<path d="M-20 -10C-56 -22 -98 -22 -140 -10C-98 -4 -60 2 -24 6Z" fill="url(#dbtefx-ls-goldp)"/>
<path d="M-6 -32C-40 -70 -80 -90 -124 -98C-82 -70 -46 -46 -16 -14Z" fill="url(#dbtefx-ls-goldp)"/>
<path d="M8 -38C-12 -82 -36 -118 -66 -142C-42 -104 -24 -72 -4 -28Z" fill="url(#dbtefx-ls-goldp)"/>
<path d="M2 18L-44 36L-8 28L-38 56L6 34Z" fill="url(#dbtefx-ls-hide2)" stroke="${gold}" stroke-opacity="0.6"/>
<path d="M150 6C150 40 130 70 100 92M128 10C132 36 120 56 98 70" fill="none" stroke="${gold}" stroke-opacity="0.55" stroke-width="2.5" stroke-linecap="round"/>
<path d="M10 16L120 10L156 12L112 28L40 32L4 24Z" fill="url(#dbtefx-ls-hide2)" stroke="${gold}" stroke-opacity="0.45"/>
<path d="M-26 -6L-10 -30L40 -42L96 -34L150 -18L178 -4L170 6L120 10L60 14L10 16L-20 10Z" fill="url(#dbtefx-ls-hide)" stroke="${gold}" stroke-opacity="0.55" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M-10 -30L40 -42L96 -34L150 -18L120 -12L60 -20L10 -16Z" fill="#ffffff" fill-opacity="0.8"/>
<path d="M-20 -16L-6 -34L44 -46L100 -36L70 -26L20 -22Z" fill="url(#dbtefx-ls-goldp)"/>
<path d="M50 -30L96 -30L72 -19Z" fill="url(#dbtefx-ls-goldp)"/>
<path d="M58 -16C66 -24 82 -24 90 -16C82 -11 66 -11 58 -16Z" fill="${ink}"/>
<path d="M64 -16C70 -20 80 -20 85 -16C80 -13 70 -13 64 -16Z" fill="${t.danger}"/>
<circle cx="78" cy="-17" r="1.5" fill="#ffffff"/>
<path d="M158 -6L168 -4" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>
<path d="M20 2L60 0L110 -2" fill="none" stroke="${gold}" stroke-opacity="0.3"/>
</g>`;
  const dragon = `<g fill="url(#dbtefx-ls-hide2)" stroke="${gold}" stroke-opacity="0.7" stroke-width="1.5" stroke-linejoin="round">${mane}</g>
<path d="M-44 30C-64 -80 0 -180 112 -238L170 -186C98 -158 56 -90 56 30Z" fill="url(#dbtefx-ls-neck)" stroke="${gold}" stroke-opacity="0.5" stroke-width="1.5"/>
<g fill="none" stroke="url(#dbtefx-ls-goldp)" stroke-width="3.5" stroke-linecap="round">${throat}</g>
${head}`;

  return `<style>@keyframes dbtefx-ls-rays { 0%, 100% { transform: rotate(-3deg); opacity: 0.8; } 50% { transform: rotate(3deg); opacity: 1; } }
@keyframes dbtefx-ls-wing { 0%, 100% { transform: rotate(3deg); } 50% { transform: rotate(-5deg); } }
@keyframes dbtefx-ls-wing2 { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(5deg); } }</style>
<defs>
<linearGradient id="dbtefx-ls-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.accent2, 0.32)}"/><stop offset="0.55" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.14)}"/></linearGradient>
<radialGradient id="dbtefx-ls-vig" cx="${n1(SX / W)}" cy="${n1(SY / H)}" r="1.1"><stop offset="0.3" stop-color="${warm}" stop-opacity="0"/><stop offset="1" stop-color="${warm}" stop-opacity="0.55"/></radialGradient>
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
<linearGradient id="dbtefx-ls-plume" gradientUnits="userSpaceOnUse" x1="0" y1="-260" x2="0" y2="260"><stop offset="0" stop-color="#ffffff"/><stop offset="0.55" stop-color="${mix(t.bg, '#ffffff', 0.55)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.28)}"/></linearGradient>
<linearGradient id="dbtefx-ls-cov" gradientUnits="userSpaceOnUse" x1="0" y1="-260" x2="0" y2="40"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${mix(t.bg, '#ffffff', 0.4)}"/></linearGradient>
<linearGradient id="dbtefx-ls-hide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="${mix(t.bg, '#ffffff', 0.7)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.22)}"/></linearGradient>
<linearGradient id="dbtefx-ls-hide2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#ffffff', 0.5)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-ls-goldp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.6)}"/><stop offset="0.5" stop-color="${mix(t.accent, '#ffffff', 0.2)}"/><stop offset="1" stop-color="${t.accent}"/></linearGradient>
<linearGradient id="dbtefx-ls-neck" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.bg, t.accent, 0.2)}"/><stop offset="0.45" stop-color="#ffffff"/><stop offset="1" stop-color="${mix(t.bg, '#ffffff', 0.4)}"/></linearGradient>
<radialGradient id="dbtefx-ls-flare" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ls-fadeg" gradientUnits="userSpaceOnUse" x1="980" y1="0" x2="1160" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.4"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<mask id="dbtefx-ls-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#dbtefx-ls-fadeg)"/></mask>
<radialGradient id="dbtefx-ls-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.25" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.5" stop-color="${mix(t.bg, '#ffffff', 0.6)}" stop-opacity="0.55"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
</defs>
<g mask="url(#dbtefx-ls-fade)"><g transform="translate(${SX} ${SY - 50}) scale(0.66)">
<g transform="translate(40 0)"><g style="transform-origin: 30px 0px; animation: dbtefx-ls-wing 8s ease-in-out infinite;">${wing(t, 1, line, shadow)}</g></g>
<g transform="translate(-40 0)"><g style="transform-origin: -30px 0px; animation: dbtefx-ls-wing2 8s ease-in-out infinite;">${wing(t, -1, line, shadow)}</g></g>
</g></g>
<circle cx="${SX}" cy="${SY + 20}" r="320" fill="url(#dbtefx-ls-sun)"/>
<g transform="translate(${SX} ${SY})">${dragon}</g>
<circle cx="${SX}" cy="${SY + 20}" r="190" fill="url(#dbtefx-ls-flare)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
<circle cx="${SX}" cy="${SY + 20}" r="46" fill="#ffffff"/>
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
