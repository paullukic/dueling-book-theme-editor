import { mix } from '../../../lib/color.js';
import { glow, H, n1, rng, W } from './kit.js';

// Sky Striker: dusk over Area Zero. A Sky Striker Ace, an angular jet-wing
// in Kagari red, Shizuku blue and Hayate green, banks across the upper right
// above the cloud deck; below, the targeting system snaps onto an enemy drone
// and locks red. The launch pad she left from waits at the bottom right.
const C = 6; // one lock-on sequence, seconds

const a = (name, origin = 'center', ease = 'linear') =>
  `style="animation: dbtefx-ss-${name} ${C}s ${ease} infinite; transform-box: fill-box; transform-origin: ${origin};"`;

// The ace, nose to the left, seen from above: fuselage, cranked wings, canards, twin fins.
const ace = (edge) => `<path d="M-270 0L-160 -24L120 -32L206 -16V16L120 32L-160 24Z"/>
<path d="M-90 -26L36 -236L92 -244L104 -150L160 -36Z"/><path d="M-90 26L36 236L92 244L104 150L160 36Z"/>
<path d="M-196 -18L-160 -84L-132 -82L-136 -24Z"/><path d="M-196 18L-160 84L-132 82L-136 24Z"/>
<path d="M110 -30L178 -118L208 -112L198 -30Z"/><path d="M110 30L178 118L208 112L198 30Z"/>
<g fill="none" stroke="${edge}" stroke-opacity="0.35" stroke-width="2"><path d="M-160 -24L120 -32M-160 24L120 32M-40 -60L80 -60M-40 60L80 60"/><path d="M36 -236L60 -110M36 236L60 110"/></g>`;

const skyStriker = (t) => {
  const kagari = t.accent;
  const shizuku = t.accent2;
  const hayate = t.success;
  const hull = mix(t.bg, t.text, 0.16);
  const shade = mix(t.bg, '#000000', 0.5);
  const rand = rng(17);
  const dx = 1300; // drone and reticle
  const dy = 560;

  // Dusk cloud deck: soft banks stacked toward the horizon.
  let deck = '';
  for (let i = 0; i < 10; i++) {
    const y = n1(590 + i * 30 + rand() * 12);
    const w = n1(360 + rand() * 300 + i * 30);
    deck += `<ellipse cx="${n1(rand() * W)}" cy="${y}" rx="${w}" ry="${n1(22 + i * 5)}" fill="url(#dbtefx-ss-cloud)" fill-opacity="${n1(0.55 + i * 0.045)}"/>`;
  }

  // Three distant contrails curving across the dusk.
  const trails = ['M180 300Q520 220 860 250', 'M260 420Q560 380 900 400', 'M640 150Q900 90 1120 120'];
  // Speed lines streaking past the ace.
  let speed = '';
  for (let i = 0; i < 6; i++) {
    const y = n1(90 + rand() * 360);
    const x = n1(1000 + rand() * 400);
    speed += `<rect x="${x}" y="${y}" width="${n1(120 + rand() * 140)}" height="2" fill="#ffffff" fill-opacity="0.5" style="animation: dbtefx-ss-streak ${n1(1.2 + rand())}s linear ${n1(-rand() * 2)}s infinite;"/>`;
  }

  const corner = (sx, sy) => `<path d="M${dx + sx * 70} ${dy + sy * 40}V${dy + sy * 70}H${dx + sx * 40}"/>`;
  const brackets = `${corner(-1, -1)}${corner(1, -1)}${corner(-1, 1)}${corner(1, 1)}`;

  return `<style>
@keyframes dbtefx-ss-snap { 0%, 30% { transform: scale(1.9); opacity: 0; } 31% { opacity: 0.9; } 35% { transform: scale(1); opacity: 1; } 88% { transform: scale(1); opacity: 1; } 94%, 100% { transform: scale(1); opacity: 0; } }
@keyframes dbtefx-ss-lock { 0%, 44% { opacity: 0; } 45% { opacity: 1; } 49% { opacity: 0.3; } 53% { opacity: 1; } 88% { opacity: 1; } 94%, 100% { opacity: 0; } }
@keyframes dbtefx-ss-ping { 0%, 45% { transform: scale(0.6); opacity: 0; } 46% { opacity: 0.9; } 64%, 100% { transform: scale(2.4); opacity: 0; } }
@keyframes dbtefx-ss-bank { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-10px, 8px) rotate(-1.5deg); } }
@keyframes dbtefx-ss-streak { 0% { transform: translateX(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateX(520px); opacity: 0; } }
@keyframes dbtefx-ss-burn { 0%, 100% { transform: scaleX(1); opacity: 0.9; } 50% { transform: scaleX(1.25); opacity: 1; } }
</style>
<defs>${glow('dbtefx-ss-sun', mix(kagari, t.warning, 0.5), 0.5, 0.5, 0.5, 0.5)}${glow('dbtefx-ss-pad', shizuku, 0.5, 0.5, 0.5, 0.35)}${glow('dbtefx-ss-shadow', '#000000', 0.5, 0.5, 0.5, 0.55)}
<radialGradient id="dbtefx-ss-cloud" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.15"><stop offset="0" stop-color="${mix(mix(t.bg, kagari, 0.5), t.warning, 0.3)}"/><stop offset="0.45" stop-color="${mix(t.bg, kagari, 0.2)}" stop-opacity="0.9"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ss-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.3)}"/><stop offset="0.45" stop-color="${mix(t.bg, shizuku, 0.12)}"/><stop offset="0.68" stop-color="${mix(mix(t.bg, kagari, 0.32), t.warning, 0.15)}"/><stop offset="1" stop-color="${mix(t.bg, shizuku, 0.06)}"/></linearGradient>
<linearGradient id="dbtefx-ss-hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(hull, '#ffffff', 0.2)}"/><stop offset="0.5" stop-color="${hull}"/><stop offset="1" stop-color="${mix(hull, kagari, 0.25)}"/></linearGradient>
<linearGradient id="dbtefx-ss-flame" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="0.3" stop-color="${hayate}" stop-opacity="0.9"/><stop offset="1" stop-color="${hayate}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-ss-trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.45"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ss-sky)"/>
<ellipse cx="1100" cy="640" rx="760" ry="200" fill="url(#dbtefx-ss-sun)"/>
<g fill="none" stroke="url(#dbtefx-ss-trail)" stroke-width="2.5" stroke-linecap="round">${trails.map((d) => `<path d="${d}"/>`).join('')}</g>
${deck}
<!--mid-->
${speed}
<g transform="translate(1318 236) rotate(42) scale(0.66 0.52)"><g style="animation: dbtefx-ss-bank 7s ease-in-out infinite;">
<g fill="url(#dbtefx-ss-flame)" style="animation: dbtefx-ss-burn 0.6s ease-in-out infinite; transform-box: fill-box; transform-origin: left center;"><path d="M206 -16L330 -8L206 -2Z"/><path d="M206 2L330 8L206 16Z"/></g>
<g fill="url(#dbtefx-ss-hull)" stroke="${mix(hull, '#ffffff', 0.3)}" stroke-width="1.5" stroke-linejoin="round">${ace('#ffffff')}</g>
<path d="M-84 -34L32 -226L42 -228L-70 -36Z" fill="${kagari}"/><path d="M-84 34L32 226L42 228L-70 36Z" fill="${shizuku}"/>
<path d="M150 -50L182 -104L196 -100L168 -48Z" fill="${hayate}"/><path d="M150 50L182 104L196 100L168 48Z" fill="${hayate}"/>
<path d="M-214 0L-176 -10L-130 -8L-130 8L-176 10Z" fill="${shizuku}" fill-opacity="0.85"/><path d="M-200 -3L-160 -7V-2Z" fill="#ffffff" fill-opacity="0.8"/>
</g></g>
<g transform="translate(${dx} ${dy})"><g style="animation: dbtefx-bob 4s ease-in-out infinite;"><path d="M-34 -6L0 -20L34 -6L22 10L0 4L-22 10Z" fill="${shade}" stroke="${t.warning}" stroke-opacity="0.6" stroke-width="1.5"/><path d="M-52 -10H-30M30 -10H52" stroke="${shade}" stroke-width="6" stroke-linecap="round"/><circle r="4" cy="-4" fill="${kagari}"/></g></g>
<g fill="none" stroke="${shizuku}" stroke-width="3.5" opacity="0" ${a('snap')}>${brackets}</g>
<g opacity="0" ${a('lock')}><g fill="none" stroke="${kagari}" stroke-width="4">${brackets}</g><text x="${dx}" y="${dy - 86}" text-anchor="middle" font-family="'Arial Narrow', Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="6" fill="${kagari}">LOCK ON</text></g>
<circle cx="${dx}" cy="${dy}" r="56" fill="none" stroke="${kagari}" stroke-width="3" opacity="0" ${a('ping')}/>
<!--near-->
<g transform="translate(1260 776) scale(0.85)">
<ellipse rx="230" ry="46" fill="url(#dbtefx-ss-pad)"/>
<ellipse rx="180" ry="34" fill="${shade}" fill-opacity="0.75" stroke="${shizuku}" stroke-opacity="0.7" stroke-width="3"/>
<ellipse rx="120" ry="22" fill="none" stroke="${shizuku}" stroke-opacity="0.4" stroke-dasharray="10 8" stroke-width="2"/>
<g fill="${kagari}" fill-opacity="0.8">${[-1, 1].map((s) => `<path d="M${s * 150} -4L${s * 168} 0L${s * 150} 4L${s * 156} 0Z"/>`).join('')}</g>
<g transform="rotate(42) scale(0.3 0.1)" fill="url(#dbtefx-ss-shadow)"><path d="M-270 0L-160 -24L120 -32L206 -16V16L120 32L-160 24Z"/><path d="M-90 -26L36 -236L92 -244L104 -150L160 -36Z"/><path d="M-90 26L36 236L92 244L104 150L160 36Z"/></g>
<text y="66" text-anchor="middle" font-family="'Arial Narrow', Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="10" fill="${shizuku}" fill-opacity="0.6">AREA-0</text>
</g>`;
};

export default skyStriker;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 40, colors: ['text'] }];
