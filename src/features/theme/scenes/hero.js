import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, rng } from './kit.js';

// Elemental HERO: searchlights over the Skyscraper city, the HERO signal in
// the sky and a caped hero on the rooftop; apartment lights come and go.
const hero = (t) => {
  const rand = rng(5);
  const beam = (x, delay) =>
    `<g style="transform-origin: ${x}px ${H}px; animation: dbtefx-sway 11s ease-in-out ${-delay}s infinite;"><path d="M${x - 10} ${H}L${x - 140} -40L${x + 140} -40L${x + 10} ${H}Z" fill="url(#dbtefx-hr-beam)"/></g>`;

  // The signal: a rooftop searchlight throws the H onto the clouds.
  const [cx, cy, r] = [1300, 178, 96];
  const [lx, ly, aim] = [1414, 462, -110];
  const [sx, sy] = [n1(lx + 20 * Math.cos((aim * Math.PI) / 180)), n1(ly + 20 * Math.sin((aim * Math.PI) / 180))];
  const len = Math.hypot(cx - sx, cy - sy);
  const [px, py] = [-(cy - sy) / len, (cx - sx) / len];
  const signalBeam = `M${n1(sx - px * 15)} ${n1(sy - py * 15)}L${n1(cx - px * r)} ${n1(cy - py * r)}L${n1(cx + px * r)} ${n1(cy + py * r)}L${n1(sx + px * 15)} ${n1(sy + py * 15)}Z`;
  let rays = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const reach = i % 2 ? 250 : 380;
    rays += `M${n1(cx + Math.cos(a - 0.05) * r)} ${n1(cy + Math.sin(a - 0.05) * r)}L${n1(cx + Math.cos(a) * reach)} ${n1(cy + Math.sin(a) * reach)}L${n1(cx + Math.cos(a + 0.05) * r)} ${n1(cy + Math.sin(a + 0.05) * r)}Z`;
  }

  // Towers: dark, close, rim-lit. Lit windows are warm; some apartments switch.
  const facade = mix(t.bg, '#000000', 0.35);
  const towers = [
    { x: 40, top: 410, w: 236, crown: 'water', rim: 'right' },
    { x: 262, top: 620, w: 150, rim: 'right' },
    { x: 1330, top: 500, w: 300, crown: 'roof', rim: 'left' },
    { x: 1190, top: 660, w: 150, rim: 'left' },
  ];
  let dark = '';
  let lit = '';
  let moving = '';
  let movers = 0;
  const kinds = ['lit', 'lit', 'lit', 'tube', 'tv'];
  towers.forEach(({ x, top, w }, ti) => {
    for (let wy = top + 26; wy < H - 10; wy += 34) {
      for (let wx = x + 16; wx < x + w - 26; wx += 26) {
        if (wx < 0) continue;
        const roll = rand();
        const rect = `x="${n1(wx)}" y="${n1(wy)}" width="14" height="19"`;
        if (roll < 0.3) lit += `<rect ${rect}/>`;
        else if (roll < 0.42 && movers < 28 && ti !== 3) {
          const kind = kinds[movers % kinds.length];
          const dur = n1(30 + rand() * 40);
          const delay = rand() * dur;
          const fill = kind === 'tv' ? t.link : t.warning;
          dark += `<rect ${rect}/>`;
          moving += `<rect ${rect} fill="${fill}" style="animation: dbtefx-hr-${kind} ${dur}s linear ${n1(-delay)}s infinite;"/>`;
          movers += 1;
        } else dark += `<rect ${rect}/>`;
      }
    }
  });

  const shapes = towers
    .map(({ x, top, w, crown, rim }) => {
      const rx = rim === 'left' ? x : x + w - 3;
      let s = `<rect x="${x}" y="${top}" width="${w}" height="${H - top + 10}" fill="${facade}"/><rect x="${x}" y="${top}" width="${w}" height="6" fill="${t.border}" fill-opacity="0.8"/><rect x="${rx}" y="${top}" width="3" height="${H - top}" fill="${rim === 'left' ? t.accent : t.opp}" fill-opacity="0.3"/>`;
      for (let ly = top + 128; ly < H; ly += 136) s += `<rect x="${x}" y="${ly}" width="${w}" height="3" fill="${t.border}" fill-opacity="0.35"/>`;
      if (crown === 'water')
        s += `<g fill="${facade}"><path d="M${x + 40} ${top}v-34h8v34zM${x + 92} ${top}v-34h8v34z"/><path d="M${x + 30} ${top - 34}h80v-46q-40-16-80 0z"/><path d="M${x + 28} ${top - 80}l42-20 42 20z"/><rect x="${x + 170}" y="${top - 70}" width="4" height="70"/></g><circle cx="${x + 172}" cy="${top - 74}" r="4" fill="${t.accent2}" ${anim('hr-air', 2.4, 0)}/>`;
      if (crown === 'roof')
        s += `<path d="M${x + 60} ${top}v-14h${w - 60}v14z" fill="${facade}"/><path d="M${lx - 16} ${top - 14}L${lx - 6} ${ly + 10}H${lx + 6}L${lx + 16} ${top - 14}z" fill="${facade}" stroke="${t.border}" stroke-width="1.5"/><g transform="translate(${lx} ${ly}) rotate(${aim})"><rect x="-21" y="-14" width="8" height="28" rx="2" fill="${facade}" stroke="${t.border}" stroke-width="1.5"/><rect x="-14" y="-22" width="30" height="44" rx="4" fill="${facade}" stroke="${t.border}" stroke-width="1.5"/><ellipse cx="17" cy="0" rx="5" ry="20" fill="${mix(t.accent, '#ffffff', 0.75)}"/></g>`;
      return s;
    })
    .join('');

  // A caped hero, fists on hips, watches from the right tower's roof.
  const ink = mix(t.bg, '#000000', 0.55);
  const figure = `<g transform="translate(1358 500)">
<g style="transform-origin: -18px -117px; animation: dbtefx-hr-cape 5s ease-in-out infinite;"><path d="M-20 -117C-36 -100 -52 -70 -70 -30L-58 -34L-62 -18L-46 -26L-44 -12C-28 -50 -6 -90 20 -117Z" fill="${mix(t.accent2, t.bg, 0.3)}"/><path d="M-22 -108C-34 -88 -44 -62 -56 -36L-50 -38C-40 -64 -28 -90 -16 -112Z" fill="#000000" fill-opacity="0.3"/></g>
<path fill-rule="evenodd" fill="${ink}" d="M-4 -127L4 -127L6 -123L22 -117Q28 -115 29 -108L37 -88Q37 -84 33 -82L20 -73L15 -68L18 -36L20 -4L25 0L11 0L9 -32L2 -58L-2 -58L-9 -32L-11 0L-25 0L-20 -4L-18 -36L-15 -68L-20 -73L-33 -82Q-37 -84 -37 -88L-29 -108Q-28 -115 -22 -117L-6 -123ZM20 -101L28 -89L18 -80L14 -88ZM-20 -101L-28 -89L-18 -80L-14 -88Z"/>
<ellipse cx="0" cy="-136" rx="7.5" ry="9.5" fill="${ink}"/><path d="M-3 -142Q6 -150 15 -152Q7 -144 5 -133Z" fill="${ink}"/>
<path d="M6 -123L22 -117Q28 -115 29 -108L37 -88M6 -144Q8 -136 5 -128" fill="none" stroke="${t.accent}" stroke-opacity="0.8" stroke-width="1.6" stroke-linejoin="round"/>
</g>`;

  // The H: two horned blades with barbs and a rising bar, slanted forward.
  const glyph = `<g transform="translate(${cx} ${cy + 2}) skewX(-10) scale(0.92)" fill="${mix(t.bg, '#000000', 0.2)}" fill-opacity="0.9">
<path d="M-78 -70C-52 -70 -32 -60 -28 -42L-26 44L-42 84L-54 44L-54 -2L-66 -12L-54 -18L-54 -34C-56 -52 -64 -62 -78 -70Z"/>
<path d="M80 -78C54 -76 34 -64 30 -46L28 40L44 82L56 40L56 -4L68 -14L56 -20L56 -36C58 -56 66 -68 80 -78Z"/>
<path d="M-28 6C0 -4 16 -10 30 -14L30 8C14 10 0 14 -28 26Z"/>
</g>`;

  return `<style>@keyframes dbtefx-hr-lit { 0%, 44% { opacity: 0; } 44.5%, 86% { opacity: 1; } 86.5%, 100% { opacity: 0; } }
@keyframes dbtefx-hr-tube { 0%, 50% { opacity: 0; } 50.4% { opacity: 1; } 50.8% { opacity: 0.1; } 51.4%, 93% { opacity: 1; } 93.4%, 100% { opacity: 0; } }
@keyframes dbtefx-hr-tv { 0%, 30% { opacity: 0; } 31% { opacity: 0.55; } 38% { opacity: 0.9; } 46% { opacity: 0.4; } 55% { opacity: 0.8; } 63% { opacity: 0.5; } 72% { opacity: 1; } 80% { opacity: 0.45; } 88% { opacity: 0.75; } 90%, 100% { opacity: 0; } }
@keyframes dbtefx-hr-air { 0%, 100% { opacity: 0.15; } 6% { opacity: 1; } 18% { opacity: 0.15; } }
@keyframes dbtefx-hr-cape { 0%, 100% { transform: rotate(0deg) scaleX(1); } 50% { transform: rotate(9deg) scaleX(1.12); } }</style>
<defs><linearGradient id="dbtefx-hr-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.32"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-hr-sig" gradientUnits="userSpaceOnUse" x1="${sx}" y1="${sy}" x2="${cx}" y2="${cy}"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.6)}" stop-opacity="0.5"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.12"/></linearGradient>
<radialGradient id="dbtefx-hr-disc"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.8)}"/><stop offset="0.8" stop-color="${mix(t.accent, '#ffffff', 0.55)}"/><stop offset="1" stop-color="${mix(t.accent, '#ffffff', 0.3)}"/></radialGradient>
${glow('dbtefx-hr-halo', t.accent, 0.5, 0.5, 0.5, 0.45)}${glow('dbtefx-hr-cloud', mix(t.bg, t.opp, 0.15), 0.5, 0.5, 0.5, 0.75)}</defs>
${beam(330, 0)}${beam(1270, 5)}
<!--mid-->
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 140s linear infinite;"><path d="${rays}" fill="${t.accent}" fill-opacity="0.06"/></g>
<circle cx="${cx}" cy="${cy}" r="${r * 2.8}" fill="url(#dbtefx-hr-halo)" ${anim('bloom', 6, 0, 'ease-in-out')}/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#dbtefx-hr-disc)" fill-opacity="0.92"/>
<circle cx="${cx}" cy="${cy}" r="${r - 6}" fill="none" stroke="${mix(t.accent, '#000000', 0.3)}" stroke-opacity="0.35" stroke-width="2"/>
${glyph}
<g ${anim('drift', 26, 0, 'ease-in-out')}><ellipse cx="${cx - 30}" cy="${cy + 62}" rx="190" ry="22" fill="url(#dbtefx-hr-cloud)" fill-opacity="0.6"/><ellipse cx="${cx + 90}" cy="${cy - 52}" rx="140" ry="14" fill="url(#dbtefx-hr-cloud)" fill-opacity="0.6"/></g>
<!--near-->
<path d="${signalBeam}" fill="url(#dbtefx-hr-sig)"/>
${shapes}
<g fill="${mix(t.bg, t.surface, 0.5)}">${dark}</g>
<g fill="${t.warning}" fill-opacity="0.85">${lit}</g>
${moving}
${figure}`;
};

export default hero;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 90, colors: ['text'] }, { kind: 'meteor', count: 1, colors: ['accent'] }];
