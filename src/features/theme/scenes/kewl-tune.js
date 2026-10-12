import { mix } from '../../../lib/color.js';
import { glow, H, n1, W } from './kit.js';

// Kewl Tune: the club's neon arch on the right, an LED spectrum wall inside it
// and a turntable deck under it, the record turning at 33 rpm. Everything that
// lights up does so on a 120 BPM beat (one beat = 0.5 s).

const kewlTune = (t) => {
  const night = mix(t.bg, '#000000', 0.35);
  const plinth = mix(t.raised, '#000000', 0.25);
  const plinthTop = mix(t.raised, t.border, 0.35);
  const vinyl = mix(t.bg, '#000000', 0.55);
  const groove = mix(t.bg, t.border, 0.5);
  const chrome = mix(t.muted, t.text, 0.5);
  const hot = mix(t.accent, '#ffffff', 0.35);

  // LED spectrum mirrored about the centre so its silhouette rhymes with the arch;
  // mirrored bars share a rhythm, so it pumps symmetrically on the beat.
  const bars = [0.3, 0.42, 0.56, 0.72, 0.88, 1, 1, 0.88, 0.72, 0.56, 0.42, 0.3];
  const bw = 16;
  const gap = 8;
  const bx0 = 1260 - (bars.length * (bw + gap) - gap) / 2;
  const base = 452;
  const tall = 250;
  let eq = '';
  bars.forEach((h, i) => {
    const x = bx0 + i * (bw + gap);
    const m = Math.min(i, bars.length - 1 - i);
    const k = ['a', 'b', 'c'][m % 3];
    eq += `<rect x="${x}" y="${n1(base - tall * h)}" width="${bw}" height="${n1(tall * h)}" fill="url(#dbtefx-kt-led)" style="transform-box: fill-box; transform-origin: 50% 100%; animation: dbtefx-kt-eq${k} 2s ease-out ${n1(-(m % 2) * 0.5)}s infinite;"/>`;
  });
  // Dark rails across the bars split them into LED cells; they never move.
  let cells = '';
  for (let y = base - 8; y > base - tall - 4; y -= 10) bars.forEach((h, i) => { cells += `M${bx0 + i * (bw + gap)} ${y}h${bw}`; });
  let ghost = '';
  bars.forEach((h, i) => {
    ghost += `M${bx0 + i * (bw + gap)} ${base}v-${tall}h${bw}v${tall}Z`;
  });

  // Grooves of the record in plan view; the deck group squashes them into perspective.
  let grooves = '';
  for (let r = 70; r < 158; r += 7) grooves += `<circle r="${r}" fill="none" stroke="${groove}" stroke-width="${r % 21 === 0 ? 2.4 : 1.2}"/>`;

  // Neon arch: the club entrance tube, a soft halo under a hot core.
  const arch = 'M1066 1000V350A194 194 0 0 1 1454 350V1000';

  // Stage beams from the rig above, sweeping slowly across the arch.
  const beam = (x, deg, color, dur, delay) =>
    `<g style="transform-origin: ${x}px -20px; animation: dbtefx-kt-sweep ${dur}s ease-in-out ${n1(-delay)}s infinite;"><path d="M${x} -20L${x - 70} 900L${x + 70} 900Z" fill="url(#dbtefx-kt-beam-${color})" transform="rotate(${deg} ${x} -20)"/></g>`;

  return `<style>
@keyframes dbtefx-kt-eqa { 0% { transform: scaleY(1); } 12% { transform: scaleY(0.5); } 25% { transform: scaleY(0.8); } 37% { transform: scaleY(0.4); } 50% { transform: scaleY(0.95); } 62% { transform: scaleY(0.5); } 75% { transform: scaleY(0.66); } 87% { transform: scaleY(0.36); } 100% { transform: scaleY(1); } }
@keyframes dbtefx-kt-eqb { 0% { transform: scaleY(0.7); } 12% { transform: scaleY(0.36); } 25% { transform: scaleY(1); } 37% { transform: scaleY(0.46); } 50% { transform: scaleY(0.6); } 62% { transform: scaleY(0.3); } 75% { transform: scaleY(0.9); } 87% { transform: scaleY(0.4); } 100% { transform: scaleY(0.7); } }
@keyframes dbtefx-kt-eqc { 0% { transform: scaleY(0.9); } 8% { transform: scaleY(0.6); } 25% { transform: scaleY(0.7); } 33% { transform: scaleY(0.54); } 50% { transform: scaleY(0.86); } 58% { transform: scaleY(0.5); } 75% { transform: scaleY(1); } 83% { transform: scaleY(0.6); } 100% { transform: scaleY(0.9); } }
@keyframes dbtefx-kt-beat { 0% { opacity: 1; } 55% { opacity: 0.42; } 100% { opacity: 1; } }
@keyframes dbtefx-kt-vu { 0% { transform: rotate(18deg); } 30% { transform: rotate(-14deg); } 100% { transform: rotate(18deg); } }
@keyframes dbtefx-kt-push { 0% { transform: scale(1.06); } 40%, 100% { transform: scale(0.98); } }
@keyframes dbtefx-kt-spin { to { transform: rotate(360deg); } }
@keyframes dbtefx-kt-sweep { 0%, 100% { transform: rotate(-9deg); } 50% { transform: rotate(9deg); } }
</style>
<defs>${glow('dbtefx-kt-pool', t.accent, 0.5, 0.5, 0.5, 0.42)}
<linearGradient id="dbtefx-kt-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.08)}"/></linearGradient>
<linearGradient id="dbtefx-kt-led" x1="0" y1="${base}" x2="0" y2="${base - tall}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${t.accent2}"/><stop offset="0.55" stop-color="${t.accent}"/><stop offset="1" stop-color="${hot}"/></linearGradient>
<linearGradient id="dbtefx-kt-neon" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.accent2}"/><stop offset="0.5" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.warning}"/></linearGradient>
<linearGradient id="dbtefx-kt-beam-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.2"/><stop offset="0.8" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-kt-beam-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.16"/><stop offset="0.8" stop-color="${t.accent2}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-kt-cone"><stop offset="0" stop-color="${mix(t.border, t.text, 0.15)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}"/></radialGradient>
<radialGradient id="dbtefx-kt-sheen"><stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-kt-wall)"/>
${beam(1270, 12, 'a', 9, 0)}${beam(1430, -10, 'b', 11, 3)}
<ellipse cx="1340" cy="330" rx="300" ry="300" fill="url(#dbtefx-kt-pool)" style="animation: dbtefx-kt-beat 0.5s ease-out infinite;"/>
<!--mid-->
<g transform="translate(80 0)">
<g transform="translate(1258 520) scale(0.86) translate(-1260 -520)">
<path d="${arch}" fill="none" stroke="url(#dbtefx-kt-neon)" stroke-width="30" stroke-opacity="0.16"/>
<path d="${arch}" fill="none" stroke="url(#dbtefx-kt-neon)" stroke-width="12" stroke-opacity="0.45" style="animation: dbtefx-kt-beat 0.5s ease-out infinite;"/>
<path d="${arch}" fill="none" stroke="url(#dbtefx-kt-neon)" stroke-width="5"/>
<path d="${arch}" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.5"/>
<g class="dbtefx-kt-eq"><path d="${ghost}" fill="${t.accent}" fill-opacity="0.12"/>
<g>${eq}</g>
<path d="${cells}" stroke="${night}" stroke-width="3"/></g>
<path d="M1092 716H1434V1000H1092Z" fill="${mix(t.surface, '#000000', 0.35)}"/>
<path d="M1092 716H1434" stroke="${t.accent2}" stroke-width="3"/><path d="M1092 726H1434" stroke="${t.accent2}" stroke-opacity="0.25" stroke-width="8"/>
<g transform="translate(1262 842)">
<circle r="96" fill="${mix(t.surface, '#000000', 0.55)}"/><circle r="92" fill="none" stroke="${chrome}" stroke-opacity="0.5" stroke-width="3"/>
<g style="animation: dbtefx-kt-push 0.5s cubic-bezier(.2,.9,.3,1) infinite;"><circle r="80" fill="${mix(t.bg, '#000000', 0.2)}"/><circle r="80" fill="none" stroke="${mix(t.border, t.text, 0.2)}" stroke-width="6"/><path d="M-78 -16A80 80 0 0 1 16 -78" fill="none" stroke="${t.accent}" stroke-opacity="0.7" stroke-width="3"/><circle r="56" fill="url(#dbtefx-kt-cone)"/><circle r="24" fill="${mix(t.raised, t.border, 0.5)}"/><circle cx="-7" cy="-8" r="8" fill="#ffffff" fill-opacity="0.18"/></g>
</g>
<g transform="translate(1262 560) scale(0.84) translate(-1272 -560)">
<path d="M1070 712L1476 712L1468 744L1078 744Z" fill="${plinth}"/>
<path d="M1100 496L1440 496L1476 712L1070 712Z" fill="${plinthTop}"/>
<path d="M1070 712L1476 712" stroke="${t.accent}" stroke-width="2.5"/>
<path d="M1100 496L1440 496" stroke="${mix(plinthTop, '#ffffff', 0.2)}" stroke-width="2"/>
<g transform="translate(1254 606) scale(1 0.56)">
<circle r="168" fill="${mix(plinth, '#000000', 0.3)}" transform="translate(0 16)"/>
<circle r="164" fill="${chrome}"/>
<circle r="158" fill="${vinyl}"/>
${grooves}
<g style="animation: dbtefx-kt-spin 1.8s linear infinite;"><circle r="58" fill="${t.accent}"/><path d="M0 -58A58 58 0 0 1 50 -29L0 0Z" fill="${hot}"/><circle r="30" fill="none" stroke="${t.accentText}" stroke-opacity="0.5" stroke-width="2"/></g>
<circle r="5" fill="${chrome}"/>
<path d="M-150 -60L-40 -10L-40 10L-150 60Z" fill="url(#dbtefx-kt-sheen)"/><path d="M150 -60L40 -10L40 10L150 60Z" fill="url(#dbtefx-kt-sheen)"/>
</g>
<circle cx="1424" cy="528" r="22" fill="${mix(plinth, t.border, 0.4)}"/><circle cx="1424" cy="528" r="12" fill="${chrome}"/>
<path d="M1424 528L1404 650L1352 690" fill="none" stroke="${mix(chrome, '#000000', 0.45)}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 4)"/>
<path d="M1424 528L1404 650L1352 690" fill="none" stroke="${chrome}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1424 528L1404 650" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/>
<path d="M1438 512L1446 488L1460 492L1452 516Z" fill="${chrome}"/>
<path d="M1340 680L1366 674L1372 696L1346 702Z" fill="${mix(chrome, t.bg, 0.35)}"/>
<rect x="1448" y="580" width="8" height="96" rx="4" fill="${night}"/><rect x="1442" y="612" width="20" height="12" rx="2" fill="${chrome}"/>
<g transform="translate(1094 724) scale(0.9)"><rect x="-6" y="-26" width="64" height="34" rx="4" fill="${night}" stroke="${t.border}" stroke-width="1.5"/><path d="M4 0A22 22 0 0 1 48 0" fill="none" stroke="${t.muted}" stroke-opacity="0.6" stroke-width="1.5"/><path d="M38 -16A22 22 0 0 1 48 0" fill="none" stroke="${t.danger}" stroke-width="2.5"/>
<path d="M26 4L26 -20" stroke="${t.warning}" stroke-width="2" stroke-linecap="round" style="transform-origin: 26px 4px; animation: dbtefx-kt-vu 0.5s ease-out infinite;"/></g>
</g>
</g>
</g>
<!--near-->`;
};

export default kewlTune;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 44, colors: ['accent', 'accent2'], rise: true },
  { kind: 'spark', count: 10, colors: ['warning'], speed: 0.4 },
];
