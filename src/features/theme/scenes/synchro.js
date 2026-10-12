import { mix } from '../../../lib/color.js';
import { glow, H, n1, rng, W } from './kit.js';

// Synchro: the Synchro Summon. A tuner has become a column of glowing green
// rings; the non-tuner levels rise through them as stars, and a pearl-white
// beam climbs the column to the summon flare at the top.
const cx = 1496;

const synchro = (t) => {
  const green = mix(t.success, t.self, 0.5);
  const greenHi = mix(green, '#ffffff', 0.55);
  const pearl = mix(t.accent, '#ffffff', 0.5);
  const cool = t.accent2;

  // Tuner rings in perspective: the far half sits behind the beam, the near half in front.
  const rings = [
    { y: 280, rx: 70, ry: 16 },
    { y: 430, rx: 86, ry: 20 },
    { y: 590, rx: 102, ry: 24 },
  ];
  const arc = (rx, ry, y, back) => `M${cx - rx} ${y}A${rx} ${ry} 0 0 ${back ? 1 : 0} ${cx + rx} ${y}`;
  let backs = '';
  let fronts = '';
  rings.forEach(({ y, rx, ry }, i) => {
    const a = `style="transform-box: fill-box; transform-origin: center; animation: dbtefx-sy-ring 4s ease-in-out ${n1(-i * 0.6)}s infinite;"`;
    backs += `<ellipse cx="${cx}" cy="${y}" rx="${rx + 40}" ry="${ry + 22}" fill="url(#dbtefx-sy-halo)"/>`;
    backs += `<path d="${arc(rx, ry, y, true)}" fill="none" stroke="${green}" stroke-opacity="0.45" stroke-width="7" stroke-linecap="round"/>`;
    fronts += `<g ${a}><path d="${arc(rx, ry, y, false)}" fill="none" stroke="${green}" stroke-opacity="0.18" stroke-width="26" stroke-linecap="round"/>`;
    fronts += `<path d="${arc(rx, ry, y, false)}" fill="none" stroke="${green}" stroke-width="9" stroke-linecap="round"/>`;
    fronts += `<path d="${arc(rx - 2, ry - 1, y, false)}" fill="none" stroke="${greenHi}" stroke-width="2.5" stroke-linecap="round"/></g>`;
  });

  // Non-tuner levels: stars rising through the rings, staggered.
  const sparkle = (s) => `M0 ${-s}Q${n1(s * 0.14)} ${n1(-s * 0.14)} ${s} 0Q${n1(s * 0.14)} ${n1(s * 0.14)} 0 ${s}Q${n1(-s * 0.14)} ${n1(s * 0.14)} ${-s} 0Q${n1(-s * 0.14)} ${n1(-s * 0.14)} 0 ${-s}Z`;
  let stars = '';
  for (let i = 0; i < 5; i++) {
    const s = 30 - i * 2;
    stars += `<g transform="translate(${cx} 760)"><g opacity="0" style="animation: dbtefx-sy-rise 7.5s cubic-bezier(0.45, 0, 0.6, 1) ${n1(-i * 1.5 - 0.6)}s infinite;"><circle r="${s * 2.6}" fill="url(#dbtefx-sy-star)"/><path d="${sparkle(s)}" fill="#ffffff"/><path d="${sparkle(s * 0.5)}" fill="${pearl}" transform="rotate(45)"/></g></g>`;
  }

  // Energy streaks climbing the column.
  const rs = rng(41);
  let streaks = '';
  for (let i = 0; i < 6; i++) {
    const x = n1(cx + (rs() - 0.5) * 90);
    const len = n1(80 + rs() * 120);
    streaks += `<rect x="${x}" y="900" width="${n1(1.5 + rs() * 2)}" height="${len}" rx="1.5" fill="url(#dbtefx-sy-streak)" style="animation: dbtefx-sy-climb ${n1(2.4 + rs() * 1.8)}s cubic-bezier(0.4, 0, 1, 1) ${n1(-rs() * 4)}s infinite;"/>`;
  }

  // Graphite night with faint, scattered stars.
  const r = rng(29);
  let dust = '';
  for (let i = 0; i < 70; i++) {
    dust += `<circle cx="${n1(r() * W)}" cy="${n1(r() * H * 0.8)}" r="${n1(0.5 + r() * 1.2)}" fill="${t.text}" opacity="${n1(0.08 + r() * 0.3)}"/>`;
  }

  return `<style>
@keyframes dbtefx-sy-rise { 0% { transform: translateY(0) scale(0.6); opacity: 0; } 10% { opacity: 1; } 75% { opacity: 1; } 100% { transform: translateY(-640px) scale(1.05); opacity: 0; } }
@keyframes dbtefx-sy-climb { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: 0.9; } 100% { transform: translateY(-1000px); opacity: 0; } }
@keyframes dbtefx-sy-ring { 0%, 100% { opacity: 0.8; transform: scale(1); } 50% { opacity: 1; transform: scale(1.03); } }
@keyframes dbtefx-sy-beam { 0%, 100% { opacity: 0.7; transform: scaleX(0.9); } 50% { opacity: 1; transform: scaleX(1.08); } }
</style>
<defs>
<linearGradient id="dbtefx-sy-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, cool, 0.08)}"/><stop offset="0.7" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.4)}"/></linearGradient>
<radialGradient id="dbtefx-sy-wash" cx="${cx}" cy="420" r="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${pearl}" stop-opacity="0.14"/><stop offset="0.5" stop-color="${cool}" stop-opacity="0.05"/><stop offset="1" stop-color="${cool}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sy-glow" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${pearl}" stop-opacity="0"/><stop offset="0.5" stop-color="${pearl}" stop-opacity="0.3"/><stop offset="1" stop-color="${pearl}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-sy-core" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-sy-streak" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${pearl}" stop-opacity="0"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<linearGradient id="dbtefx-sy-fadeup" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.15" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<mask id="dbtefx-sy-mask" maskUnits="userSpaceOnUse" x="${cx - 200}" y="-20" width="400" height="${H + 40}"><rect x="${cx - 200}" y="-20" width="400" height="${H + 40}" fill="url(#dbtefx-sy-fadeup)"/></mask>
${glow('dbtefx-sy-halo', green, 0.5, 0.5, 0.5, 0.22)}
${glow('dbtefx-sy-star', pearl, 0.5, 0.5, 0.5, 0.7)}
${glow('dbtefx-sy-flare', '#ffffff', 0.5, 0.5, 0.5, 0.85)}
${glow('dbtefx-sy-pool', cool, 0.5, 0.5, 0.5, 0.35)}
</defs>
<rect x="-200" y="-200" width="2000" height="1300" fill="url(#dbtefx-sy-sky)"/>
${dust}
<rect x="-200" y="-200" width="2000" height="1300" fill="url(#dbtefx-sy-wash)"/>
<!--mid-->
<ellipse cx="${cx}" cy="830" rx="200" ry="40" fill="url(#dbtefx-sy-pool)"/>
<g class="dbtefx-sy-rings">${backs}</g>
<g mask="url(#dbtefx-sy-mask)">
<rect x="${cx - 110}" y="-20" width="220" height="940" fill="url(#dbtefx-sy-glow)" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-sy-beam 4s ease-in-out infinite;"/>
<rect x="${cx - 12}" y="-20" width="24" height="940" fill="url(#dbtefx-sy-core)"/>
${streaks}
</g>
${stars}
<g class="dbtefx-sy-rings">${fronts}</g>
<ellipse cx="${cx}" cy="130" rx="170" ry="60" fill="url(#dbtefx-sy-flare)" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-bloom 4s ease-in-out infinite;"/>
<path d="M${cx - 160} 130L${cx} 125L${cx + 160} 130L${cx} 135Z" fill="#ffffff" opacity="0.8"/>`;
};

export default synchro;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'spark', count: 40, colors: ['text', 'success'], column: true, columnX: 0.85, rise: true }];
