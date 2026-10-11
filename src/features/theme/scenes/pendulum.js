import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, polar, runeRing, W } from './kit.js';

// Pendulum: the ARC-V Pendulum Summon. Two Pendulum Scales stand as pillars of
// light (scale 1 in your colour, scale 12 in the opponent colour); between them a portal turns in the sky and its
// pendulum swings slowly, drawing an arc of light.
const SWING = 7; // seconds per full swing (there and back)

const pendulum = (t) => {
  const left = t.self;
  const right = t.opp;
  const hx = 1470; // hinge on the right scale's column, in the gutter
  const hy = 300;
  const len = 220;
  const lx = 118; // scale pillars flank the page (and the duel field) in the gutters
  const rx = 1470;
  const ground = 800;

  // The arc of light: short arc pieces fading away from the bob, one trail for each direction.
  const trail = (side) => {
    let s = '';
    for (let i = 0; i < 7; i++) {
      const a = 90 - side * (1 + i * 1.4);
      const [x0, y0] = polar(0, 0, len, a - 2.3);
      const [x1, y1] = polar(0, 0, len, a + 2.3);
      s += `<path d="M${x0} ${y0}A${len} ${len} 0 0 1 ${x1} ${y1}" stroke-opacity="${n1(0.85 - i * 0.12)}" stroke-width="${n1(16 - i * 1.6)}"/>`;
    }
    return s;
  };

  // A Pendulum Scale: column of light, rising rings, the scale gem and number.
  const pillar = (x, color, num, gem, id, delay) => `<ellipse cx="${x}" cy="${ground - 340}" rx="74" ry="620" fill="url(#dbtefx-pe-${id})"/>
<rect x="${x - 3}" y="0" width="6" height="${ground}" fill="${mix(color, '#ffffff', 0.6)}" fill-opacity="0.7"/>
${[0, 1, 2].map((i) => `<ellipse cx="${x}" cy="${ground}" rx="44" ry="10" fill="none" stroke="${mix(color, '#ffffff', 0.4)}" stroke-width="2" style="animation: dbtefx-pe-rise 4.5s ease-in ${n1(-(delay + i * 1.5))}s infinite;"/>`).join('')}
<g transform="translate(${x} 150)"><path d="M0 -40L22 -14L0 12L-22 -14Z" fill="${gem}" stroke="#ffffff" stroke-opacity="0.7" stroke-width="2"/><path d="M0 -40L22 -14L0 -8Z" fill="#ffffff" fill-opacity="0.35"/>
<text y="78" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#ffffff" fill-opacity="0.92" stroke="${color}" stroke-width="2">${num}</text></g>`;


  return `<style>
@keyframes dbtefx-pe-swing { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
@keyframes dbtefx-pe-ta { 0% { opacity: 0; } 22% { opacity: 1; } 46%, 100% { opacity: 0; } }
@keyframes dbtefx-pe-tb { 0%, 50% { opacity: 0; } 72% { opacity: 1; } 96%, 100% { opacity: 0; } }
@keyframes dbtefx-pe-rise { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 0.9; } 100% { transform: translateY(-560px); opacity: 0; } }
</style>
<defs>${glow('dbtefx-pe-portal', mix(t.accent, '#ffffff', 0.3), 0.5, 0.5, 0.5, 0.55)}${glow('dbtefx-pe-pool', t.accent, 0.5, 0.5, 0.5, 0.4)}${glow('dbtefx-pe-bob', mix(t.accent, '#ffffff', 0.25), 0.5, 0.5, 0.5, 0.6)}
<radialGradient id="dbtefx-pe-l"><stop offset="0" stop-color="${left}" stop-opacity="0.7"/><stop offset="0.25" stop-color="${left}" stop-opacity="0.28"/><stop offset="1" stop-color="${left}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-pe-r"><stop offset="0" stop-color="${right}" stop-opacity="0.7"/><stop offset="0.25" stop-color="${right}" stop-opacity="0.28"/><stop offset="1" stop-color="${right}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-pe-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(mix(t.bg, '#000000', 0.45), t.accent2, 0.14)}"/><stop offset="0.5" stop-color="${mix(t.bg, t.accent, 0.08)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-pe-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.4)}" stop-opacity="0.08"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-pe-gem" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.self}"/><stop offset="0.5" stop-color="${mix(t.self, t.accent, 0.5)}"/><stop offset="1" stop-color="${t.accent}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-pe-sky)"/>
<ellipse cx="${hx}" cy="${hy}" rx="200" ry="120" fill="url(#dbtefx-pe-portal)"/>
<g transform="translate(${hx} ${hy}) scale(0.62 0.17)">${runeRing(t, 0, 0, 200, mix(t.accent, '#ffffff', 0.4), 40)}${runeRing(t, 0, 0, 140, t.self, 26, true)}<circle r="92" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="5"/></g>
<ellipse cx="${hx}" cy="${hy}" rx="64" ry="18" fill="url(#dbtefx-pe-bob)" ${anim('bloom', 5, 0, 'ease-in-out')}/>
<g fill="url(#dbtefx-pe-cone)">${[1, 0.75, 0.5, 0.28].map((k) => `<path d="M${n1(hx - 50 * k)} ${hy}L${n1(hx - 120 * k)} ${ground}H${n1(hx + 120 * k)}L${n1(hx + 50 * k)} ${hy}Z"/>`).join('')}</g>
<!--mid-->
${pillar(lx, left, 1, left, 'l', 0)}
${pillar(rx, right, 12, right, 'r', 0.7)}
<path d="M${polar(hx, hy, len, 82).join(' ')}A${len} ${len} 0 0 1 ${polar(hx, hy, len, 98).join(' ')}" fill="none" stroke="${t.text}" stroke-opacity="0.12" stroke-width="2" stroke-dasharray="2 10"/>
<g transform="translate(${hx} ${hy})"><g style="animation: dbtefx-pe-swing ${SWING}s ease-in-out infinite;">
<g fill="none" stroke="${mix(t.accent, '#ffffff', 0.3)}" stroke-linecap="round"><g style="animation: dbtefx-pe-ta ${SWING}s linear infinite;">${trail(1)}</g><g style="animation: dbtefx-pe-tb ${SWING}s linear infinite;">${trail(-1)}</g></g>
<path d="M0 0V${len - 64}" stroke="${t.text}" stroke-opacity="0.55" stroke-width="2.5"/>
<circle cy="${len}" r="84" fill="url(#dbtefx-pe-bob)"/>
<path d="M0 ${len - 70}L30 ${len - 18}L0 ${len + 62}L-30 ${len - 18}Z" fill="url(#dbtefx-pe-gem)" fill-opacity="0.85" stroke="#ffffff" stroke-opacity="0.75" stroke-width="2"/>
<path d="M0 ${len - 70}L30 ${len - 18}L0 ${len - 4}Z" fill="#ffffff" fill-opacity="0.3"/><path d="M0 ${len - 70}V${len + 62}M-30 ${len - 18}H30" stroke="#ffffff" stroke-opacity="0.35"/>
<circle cy="${len - 76}" r="7" fill="none" stroke="${t.text}" stroke-opacity="0.7" stroke-width="2.5"/>
</g></g>
${[[lx, left, 1, -1], [rx, right, 12, 1]].map(([x, c, lit, side]) => Array.from({ length: 12 }, (_, i) => {
    const y = 760 - i * 30;
    const on = i + 1 === lit;
    return `<path d="M${x + side * 6} ${y}H${x + side * (on ? 22 : 13)}" stroke="${on ? mix(c, '#ffffff', 0.3) : t.text}" stroke-opacity="${on ? 0.95 : 0.3}" stroke-width="${on ? 3 : 1.5}"/>${side > 0 ? `<text x="${x + 30}" y="${y + 4}" font-family="Georgia, 'Times New Roman', serif" font-size="12" fill="${on ? '#ffffff' : t.text}" fill-opacity="${on ? 0.9 : 0.4}">${i + 1}</text>` : ''}`;
  }).join('')).join('')}
<!--near-->
<ellipse cx="${hx}" cy="${ground + 10}" rx="180" ry="36" fill="url(#dbtefx-pe-pool)"/>
<path d="M0 ${ground}H${W}" stroke="${t.text}" stroke-opacity="0.14" stroke-width="2"/>
${[[lx, left], [rx, right]].map(([x, c]) => `<ellipse cx="${x}" cy="${ground}" rx="90" ry="16" fill="none" stroke="${c}" stroke-opacity="0.7" stroke-width="3"/><ellipse cx="${x}" cy="${ground}" rx="56" ry="9" fill="${mix(c, '#ffffff', 0.5)}" fill-opacity="0.5" ${anim('pulse', 2.4, x / 1000, 'ease-in-out')}/>`).join('')}
<rect y="${ground}" width="${W}" height="${H - ground}" fill="${t.bg}" fill-opacity="0.35"/>`;
};

export default pendulum;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 40, colors: ['accent', 'self', 'accent2'], rise: true },
  { kind: 'star', count: 60, colors: ['text'] },
];
