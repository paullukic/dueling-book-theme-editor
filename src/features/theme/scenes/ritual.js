import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, W } from './kit.js';

// Ritual: one engraved summoning seal hangs over a stone altar. Its rings
// turn slowly against each other, a pulse of light leaves the centre on a
// long loop, and candle smoke climbs from the altar into the dark.

const cx = 1292;
const cy = 392;

// Tiny engraved runes for the seal's rune band.
const RUNES = ['M-3 -4V4M-3 0L3 -4M-3 0L3 4', 'M-4 4L0 -4L4 4M-2 1H2', 'M-3 -4V4H3M-3 0H2', 'M0 -4V4M-4 -1L0 -4L4 -1', 'M-4 -4H4L0 4Z', 'M-4 0H4M0 -4V4M-3 -3L3 3'];

const scene = (t) => {
  const blue = t.accent;
  const gold = t.accent2;
  const pale = mix(blue, '#ffffff', 0.55);
  const stone = mix(t.bg, t.muted, 0.12);
  const stoneHi = mix(stone, blue, 0.4);
  const dark = mix(t.bg, '#000000', 0.45);

  // Ring A (turns clockwise): rune band between two hairlines, fine ticks.
  let runes = '';
  for (let i = 0; i < 40; i++) {
    const [x, y] = polar(0, 0, 112, i * 9);
    runes += `<path transform="translate(${x} ${y}) rotate(${i * 9 + 90})" d="${RUNES[i % RUNES.length]}"/>`;
  }
  let ticks = '';
  for (let i = 0; i < 120; i++) {
    const [a, b] = polar(0, 0, 104, i * 3);
    const [c, d] = polar(0, 0, i % 5 ? 100 : 95, i * 3);
    ticks += `M${a} ${b}L${c} ${d}`;
  }

  // Ring B (turns back): the Ritual Spell's downward triangle with orbs at
  // its points, linked by arcs.
  const tri = [90, 210, 330].map((a) => polar(0, 0, 90, a));
  const triPath = `M${tri.map((p) => p.join(' ')).join('L')}Z`;
  const inner = [90, 210, 330].map((a) => polar(0, 0, 45, a + 180));
  const arcs = [0, 1, 2].map((i) => `M${tri[i].join(' ')}A90 90 0 0 1 ${tri[(i + 1) % 3].join(' ')}`).join('');

  // Centre: six interlocking circles around a seventh.
  let seed = '<circle r="20"/>';
  for (let i = 0; i < 6; i++) {
    const [x, y] = polar(0, 0, 20, i * 60);
    seed += `<circle cx="${x}" cy="${y}" r="20"/>`;
  }

  // Crescent horns framing the seal, gold, after the Nekroz mirror frames.
  const horn = (dir) => {
    const a = polar(0, 0, 156, dir > 0 ? -74 : -106).join(' ');
    const b = polar(0, 0, 156, dir > 0 ? 62 : 118).join(' ');
    return `M${a}A156 156 0 0 ${dir > 0 ? 1 : 0} ${b}A176 176 0 0 ${dir > 0 ? 0 : 1} ${a}Z`;
  };

  // Candles on the altar, each trailing a ribbon of smoke.
  const candles = [[1206, 46], [1244, 64], [1376, 64], [1414, 46]];
  let wax = '';
  let dishes = '';
  let flames = '';
  let smoke = '';
  candles.forEach(([x, h], i) => {
    const top = 690 - h;
    wax += `<rect x="${x - 7}" y="${top}" width="14" height="${h}" rx="2"/>`;
    dishes += `<path d="M${x - 15} 690H${x + 15}L${x + 10} 684H${x - 10}Z"/>`;
    flames += `<ellipse cx="${x}" cy="${top - 12}" rx="5" ry="11" fill="url(#dbtefx-ri-flame)" style="animation: dbtefx-ri-glim ${n1(2.6 + i * 0.4)}s ease-in-out ${n1(-i * 0.7)}s infinite;"/>`;
    [0, 1].forEach((k) => {
      const d = n1(i * 2.3 + k * 4.5);
      smoke += `<path d="M${x} ${top - 24}C${x - 6} ${top - 50} ${x + 10} ${top - 70} ${x + 2} ${top - 100}S${x - 14} ${top - 150} ${x + 4} ${top - 190}S${x + 22} ${top - 240} ${x + 8} ${top - 280}" style="animation: dbtefx-ri-smoke 9s ease-out ${-d}s infinite;"/>`;
    });
  });

  return `<defs>
<linearGradient id="dbtefx-ri-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.35)}" stop-opacity="0.96"/><stop offset="0.6" stop-color="${mix(t.bg, blue, 0.08)}" stop-opacity="0.93"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}" stop-opacity="0.96"/></linearGradient>
<radialGradient id="dbtefx-ri-halo" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="520"><stop offset="0" stop-color="${blue}" stop-opacity="0.32"/><stop offset="0.35" stop-color="${blue}" stop-opacity="0.08"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ri-core"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.3" stop-color="${pale}" stop-opacity="0.5"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ri-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${blue}" stop-opacity="0"/><stop offset="0.5" stop-color="${pale}" stop-opacity="0.3"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-ri-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${stoneHi}"/><stop offset="0.12" stop-color="${stone}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
<linearGradient id="dbtefx-ri-wax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.text, t.bg, 0.55)}"/><stop offset="0.4" stop-color="${mix(t.text, t.bg, 0.25)}"/><stop offset="1" stop-color="${mix(t.text, t.bg, 0.7)}"/></linearGradient>
<radialGradient id="dbtefx-ri-flame" cx="0.5" cy="0.65" r="0.6"><stop offset="0" stop-color="#ffffff"/><stop offset="0.45" stop-color="${gold}"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ri-candle" gradientUnits="userSpaceOnUse" cx="${cx}" cy="660" r="190"><stop offset="0" stop-color="${gold}" stop-opacity="0.22"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ri-smoke" gradientUnits="userSpaceOnUse" x1="0" y1="660" x2="0" y2="380"><stop offset="0" stop-color="${t.muted}" stop-opacity="0.45"/><stop offset="1" stop-color="${t.muted}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-ri-shade" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.7"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ri-sky)"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ri-halo)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
<g fill="none" stroke="${blue}" stroke-opacity="0.12"><circle cx="${cx}" cy="${cy}" r="172" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="214" stroke-width="1" stroke-dasharray="2 10"/></g>
<!--mid-->
<path d="M${cx - 14} ${cy + 96}H${cx + 14}L${cx + 70} 690H${cx - 70}Z" fill="url(#dbtefx-ri-beam)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
<g transform="translate(${cx} ${cy}) scale(0.9)">
<circle r="160" fill="url(#dbtefx-ri-core)" opacity="0.35"/>
<g fill="${mix(t.bg, gold, 0.35)}" stroke="${gold}" stroke-width="1.2" stroke-linejoin="round"><path d="${horn(1)}"/><path d="${horn(-1)}"/></g>
<g fill="none" stroke="${mix(gold, '#ffffff', 0.45)}" stroke-opacity="0.55" stroke-width="0.8"><path d="M${polar(0, 0, 163, -66).join(' ')}A163 163 0 0 1 ${polar(0, 0, 163, 54).join(' ')}"/><path d="M${polar(0, 0, 163, -114).join(' ')}A163 163 0 0 0 ${polar(0, 0, 163, 126).join(' ')}"/></g>
${[-74, -106].map((a) => `<circle cx="${polar(0, 0, 156, a)[0]}" cy="${polar(0, 0, 156, a)[1]}" r="4" fill="${gold}"/>`).join('')}
<circle r="128" fill="none" stroke="${blue}" stroke-opacity="0.14" stroke-width="10"/>
<g fill="none" stroke="${pale}" style="animation: dbtefx-spin 120s linear infinite;">
<circle r="128" stroke-width="2"/><circle r="122" stroke-width="0.8"/><circle r="104" stroke-width="0.8"/>
<g stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${runes}</g>
<path d="${ticks}" stroke-width="0.9"/>
</g>
<g fill="none" style="animation: dbtefx-spin 90s linear infinite reverse;">
<circle r="90" stroke="${blue}" stroke-width="1.4"/>
<path d="${arcs}" stroke="${gold}" stroke-opacity="0.5" stroke-width="5"/>
<path d="${triPath}" stroke="${gold}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M${inner.map((p) => p.join(' ')).join('L')}Z" stroke="${gold}" stroke-opacity="0.55" stroke-width="1"/>
${tri.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="${mix(t.bg, gold, 0.3)}" stroke="${gold}" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="3.5" fill="${gold}"/>`).join('')}
</g>
<g fill="none" stroke="${pale}" stroke-width="1" stroke-opacity="0.8">${seed}<circle r="46" stroke-width="1.4"/></g>
<circle r="42" fill="url(#dbtefx-ri-core)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
<g style="animation: dbtefx-ri-pulse 8s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;"><circle r="100" fill="none" stroke="${pale}" stroke-width="2"/></g>
</g>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ri-candle)"/>
<path d="M${cx - 150} 852V720H${cx + 150}V852Z" fill="url(#dbtefx-ri-stone)"/>
<path d="M${cx - 134} 720V700H${cx + 134}V720ZM${cx - 120} 700V690H${cx + 120}V700Z" fill="${stoneHi}"/>
<path d="M${cx - 150} 720H${cx + 150}M${cx - 134} 700H${cx + 134}" stroke="${pale}" stroke-opacity="0.45" stroke-width="1"/>
<g fill="none" stroke="${blue}" stroke-opacity="0.45" stroke-width="1.2"><rect x="${cx - 110}" y="738" width="220" height="92"/><rect x="${cx - 102}" y="746" width="204" height="76"/><path d="M${cx - 30} 762H${cx + 30}L${cx} 812Z"/><circle cx="${cx}" cy="779" r="9"/></g>
<g fill="url(#dbtefx-ri-wax)">${wax}</g>
<g fill="${gold}" fill-opacity="0.8">${dishes}</g>
${flames}
<g fill="none" stroke="url(#dbtefx-ri-smoke)" stroke-width="2.5" stroke-linecap="round">${smoke}</g>
<style>@keyframes dbtefx-ri-pulse { 0%, 30% { transform: scale(0.4); opacity: 0; } 40% { opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }
@keyframes dbtefx-ri-smoke { 0% { transform: translateY(10px); opacity: 0; } 25% { opacity: 1; } 100% { transform: translate(6px, -70px); opacity: 0; } }
@keyframes dbtefx-ri-glim { 0%, 100% { opacity: 0.85; } 50% { opacity: 1; } }</style>
<!--near-->
<rect width="${W}" height="${H}" fill="url(#dbtefx-ri-shade)"/>`;
};

export default scene;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 40, colors: ['accent', 'text'], rise: true, speed: 0.35 },
];
