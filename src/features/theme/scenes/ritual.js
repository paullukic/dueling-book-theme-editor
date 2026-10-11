import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, W } from './kit.js';

// Ritual: one engraved summoning seal hangs in a stone shrine over the altar. Its rings
// turn slowly against each other, a pulse of light leaves the centre on a
// long loop, and candle smoke climbs from the altar into the dark.

const cx = 1252;
const cy = 392;
// The altar is drawn around cx and placed, smaller, in the right gutter (AX), clear of the menu feed.
const AX = 1478;
const AY = 880;
const AK = 0.62;

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

  // The shrine: a stone arch of wedge blocks over the seal, keystone carved
  // with the Ritual triangle, carried by two pillars standing on the altar.
  const block = (r1, r2, a0, a1) => {
    const [p, q, u, v] = [polar(0, 0, r1, a0), polar(0, 0, r1, a1), polar(0, 0, r2, a1), polar(0, 0, r2, a0)];
    return `M${p.join(' ')}A${r1} ${r1} 0 0 1 ${q.join(' ')}L${u.join(' ')}A${r2} ${r2} 0 0 0 ${v.join(' ')}Z`;
  };
  let arch = '';
  for (let k = 0; k < 9; k++) {
    const a0 = 180 + k * 20;
    arch += k === 4 ? `<path d="${block(136, 184, a0 + 0.8, a0 + 19.2)}"/>` : `<path d="${block(140, 172, a0 + 0.8, a0 + 19.2)}"/>`;
  }
  const pillar = `<g fill="url(#dbtefx-ri-pillar)" stroke="#000000" stroke-opacity="0.5" stroke-width="1">
<rect x="142" y="10" width="26" height="336"/><rect x="134" y="0" width="42" height="12"/><rect x="136" y="344" width="38" height="12"/></g>
<path d="M134 0H176M142 12V346" stroke="${pale}" stroke-opacity="0.35" stroke-width="1"/>
<rect x="142" y="118" width="26" height="5" fill="${gold}" fill-opacity="0.55"/>
<path d="M149 40H161L155 52Z" fill="none" stroke="#000000" stroke-opacity="0.6" stroke-width="2.2"/><path d="M149 40H161L155 52Z" transform="translate(0.6 0.8)" fill="none" stroke="${gold}" stroke-opacity="0.5" stroke-width="0.9"/>`;
  const shrine = `${pillar}<g transform="scale(-1 1)">${pillar}</g>
<g fill="url(#dbtefx-ri-slab)" stroke="#000000" stroke-opacity="0.55" stroke-width="1.2">${arch}</g>
<path d="M${polar(0, 0, 141, 181).join(' ')}A141 141 0 0 1 ${polar(0, 0, 141, 359).join(' ')}" fill="none" stroke="${pale}" stroke-opacity="0.35" stroke-width="1.2"/>
<path d="M-11 -166H11L0 -148Z" fill="none" stroke="#000000" stroke-opacity="0.7" stroke-width="2.6"/><path d="M-11 -166H11L0 -148Z" transform="translate(0.6 0.8)" fill="none" stroke="${gold}" stroke-opacity="0.75" stroke-width="1.1"/>`;

  // Candles on the altar, each trailing a ribbon of smoke.
  const candles = [[cx - 104, 46], [cx - 66, 64], [cx + 66, 64], [cx + 104, 46]];
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
<radialGradient id="dbtefx-ri-halo" gradientUnits="userSpaceOnUse" cx="${AX}" cy="${n1(AY - (AY - cy) * AK)}" r="380"><stop offset="0" stop-color="${blue}" stop-opacity="0.32"/><stop offset="0.35" stop-color="${blue}" stop-opacity="0.08"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ri-core"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.3" stop-color="${pale}" stop-opacity="0.5"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ri-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${blue}" stop-opacity="0"/><stop offset="0.5" stop-color="${pale}" stop-opacity="0.3"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-ri-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${stoneHi}"/><stop offset="0.12" stop-color="${stone}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
<linearGradient id="dbtefx-ri-pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(stoneHi, pale, 0.15)}"/><stop offset="0.4" stop-color="${stone}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
<linearGradient id="dbtefx-ri-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${pale}" stop-opacity="0.08"/><stop offset="0.3" stop-color="#000000" stop-opacity="0"/><stop offset="0.75" stop-color="#000000" stop-opacity="0.15"/><stop offset="1" stop-color="#000000" stop-opacity="0.5"/></linearGradient>
<linearGradient id="dbtefx-ri-slab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(stoneHi, pale, 0.2)}"/><stop offset="1" stop-color="${mix(stone, '#000000', 0.2)}"/></linearGradient>
<linearGradient id="dbtefx-ri-panel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0.35"/><stop offset="0.35" stop-color="${stone}" stop-opacity="0.6"/><stop offset="1" stop-color="${mix(stone, blue, 0.15)}" stop-opacity="0.7"/></linearGradient>
<linearGradient id="dbtefx-ri-wax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.text, t.bg, 0.55)}"/><stop offset="0.4" stop-color="${mix(t.text, t.bg, 0.25)}"/><stop offset="1" stop-color="${mix(t.text, t.bg, 0.7)}"/></linearGradient>
<radialGradient id="dbtefx-ri-flame" cx="0.5" cy="0.65" r="0.6"><stop offset="0" stop-color="#ffffff"/><stop offset="0.45" stop-color="${gold}"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ri-candle" gradientUnits="userSpaceOnUse" cx="${cx}" cy="660" r="190"><stop offset="0" stop-color="${gold}" stop-opacity="0.22"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ri-smoke" gradientUnits="userSpaceOnUse" x1="0" y1="660" x2="0" y2="380"><stop offset="0" stop-color="${t.muted}" stop-opacity="0.45"/><stop offset="1" stop-color="${t.muted}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-ri-shade" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.7"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ri-sky)"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ri-halo)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
<g fill="none" stroke="${blue}" stroke-opacity="0.12" transform="translate(${AX} ${AY}) scale(${AK}) translate(${-cx} ${-AY})"><circle cx="${cx}" cy="${cy}" r="172" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="214" stroke-width="1" stroke-dasharray="2 10"/></g>
<!--mid-->
<g transform="translate(${AX} ${AY}) scale(${AK}) translate(${-cx} ${-AY})">
<path d="M${cx - 14} ${cy + 96}H${cx + 14}L${cx + 70} 690H${cx - 70}Z" fill="url(#dbtefx-ri-beam)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
<g transform="translate(${cx} ${cy}) scale(0.9)">
<circle r="160" fill="url(#dbtefx-ri-core)" opacity="0.35"/>
${shrine}
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
<path d="M${cx - 146} 852V724H${cx + 146}V852Z" fill="url(#dbtefx-ri-stone)"/>
<path d="M${cx - 146} 852V724H${cx + 146}V852Z" fill="url(#dbtefx-ri-side)"/>
<path d="M${cx - 146} 852V724" stroke="${pale}" stroke-opacity="0.22" stroke-width="1.5"/>
<path d="M${cx - 156} 724V712H${cx + 156}V724Z" fill="url(#dbtefx-ri-slab)"/>
<path d="M${cx - 156} 712H${cx + 156}" stroke="${pale}" stroke-opacity="0.6" stroke-width="1.2"/>
<path d="M${cx - 156} 724H${cx + 156}" stroke="#000000" stroke-opacity="0.55" stroke-width="2"/>
<path d="M${cx - 146} 727H${cx + 146}" stroke="#000000" stroke-opacity="0.25" stroke-width="5"/>
<path d="M${cx - 134} 712V700H${cx + 134}V712Z" fill="url(#dbtefx-ri-slab)"/>
<path d="M${cx - 134} 700H${cx + 134}" stroke="${pale}" stroke-opacity="0.5" stroke-width="1"/>
<path d="M${cx - 120} 700V690H${cx + 120}V700Z" fill="url(#dbtefx-ri-slab)"/>
<path d="M${cx - 120} 690H${cx + 120}" stroke="${mix(pale, gold, 0.4)}" stroke-opacity="0.65" stroke-width="1"/>
<rect x="${cx - 112}" y="742" width="224" height="92" fill="${dark}" fill-opacity="0.75"/>
<path d="M${cx - 112} 834V742H${cx + 112}" fill="none" stroke="#000000" stroke-opacity="0.7" stroke-width="3"/>
<path d="M${cx - 112} 834H${cx + 112}V742" fill="none" stroke="${pale}" stroke-opacity="0.28" stroke-width="1.5"/>
<rect x="${cx - 100}" y="752" width="200" height="72" fill="url(#dbtefx-ri-panel)"/>
<path d="M${cx - 100} 824V752H${cx + 100}" fill="none" stroke="${pale}" stroke-opacity="0.22" stroke-width="1"/>
<path d="M${cx - 100} 824H${cx + 100}V752" fill="none" stroke="#000000" stroke-opacity="0.5" stroke-width="1.5"/>
<g fill="none" stroke-linejoin="round"><g stroke="#000000" stroke-opacity="0.7" stroke-width="3"><path d="M${cx - 34} 764H${cx + 34}L${cx} 816Z"/><circle cx="${cx}" cy="781" r="10"/><path d="M${cx - 84} 788H${cx - 50}M${cx + 50} 788H${cx + 84}"/></g>
<g stroke="${mix(blue, gold, 0.3)}" stroke-opacity="0.6" stroke-width="1.2" transform="translate(0.8 1.2)"><path d="M${cx - 34} 764H${cx + 34}L${cx} 816Z"/><circle cx="${cx}" cy="781" r="10"/><path d="M${cx - 84} 788H${cx - 50}M${cx + 50} 788H${cx + 84}"/></g></g>
${[-1, 1].map((d) => `<circle cx="${cx + d * 67}" cy="788" r="4" fill="${dark}" stroke="${gold}" stroke-opacity="0.55"/>`).join('')}
<g fill="url(#dbtefx-ri-wax)">${wax}</g>
<g fill="${gold}" fill-opacity="0.8">${dishes}</g>
${flames}
<g fill="none" stroke="url(#dbtefx-ri-smoke)" stroke-width="2.5" stroke-linecap="round">${smoke}</g>
</g>
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
