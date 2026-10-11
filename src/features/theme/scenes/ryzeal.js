import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';

// Ryzeal: the engine room of a rank 4 Xyz. An ignition core burns white-hot
// inside a stator ring wound with gold coils while the turbine rotor spins;
// four ignition coil drums (the four overlay units) fire in engine order
// 1-3-4-2, each throwing an ice-blue arc into the stator. Dark coil drums
// with amber rings frame the corners like the card art.
const ryzeal = (t) => {
  const rand = rng(44);
  const [cx, cy] = [1215, 420];
  const amber = t.accent;
  const ice = t.accent2;
  const steel = mix(t.raised, t.text, 0.18);
  const steelDark = mix(t.bg, '#000000', 0.35);
  const hot = mix(amber, '#ffffff', 0.55);

  // A jagged arc between two points: perpendicular kicks that shrink at the ends.
  const jag = (x1, y1, x2, y2, steps, amp) => {
    const [dx, dy] = [x2 - x1, y2 - y1];
    const len = Math.hypot(dx, dy) || 1;
    const [nx, ny] = [-dy / len, dx / len];
    let d = `M${n1(x1)} ${n1(y1)}`;
    for (let i = 1; i < steps; i++) {
      const f = i / steps;
      const k = (rand() * 2 - 1) * amp * Math.sin(f * Math.PI);
      d += `L${n1(x1 + dx * f + nx * k)} ${n1(y1 + dy * f + ny * k)}`;
    }
    return `${d}L${n1(x2)} ${n1(y2)}`;
  };

  // Ignition burst: radial speed streaks out of the core (static).
  let streaks = '';
  for (let i = 0; i < 70; i++) {
    const a = rand() * 360;
    const r0 = 260 + rand() * 120;
    const r1 = r0 + 120 + rand() * 520;
    const [x1, y1] = polar(cx, cy, r0, a);
    const [x2, y2] = polar(cx, cy, r1, a);
    if (x2 < 1000 && x1 < 1000) continue;
    streaks += `M${x1} ${y1}L${x2} ${y2}`;
  }

  // Stator: a thick ring wound with 40 gold coil blocks.
  let coils = '';
  for (let i = 0; i < 24; i++) {
    const a = i * 15;
    coils += `<rect x="${cx + 212}" y="${cy - 24}" width="38" height="48" rx="6" transform="rotate(${a} ${cx} ${cy})"/>`;
  }
  let coilLines = '';
  for (let i = 0; i < 24; i++) {
    for (let k = -4; k <= 4; k++) {
      const [x1, y1] = polar(cx, cy, 214, i * 15 + k * 1.15);
      const [x2, y2] = polar(cx, cy, 248, i * 15 + k * 1.15);
      coilLines += `M${x1} ${y1}L${x2} ${y2}`;
    }
  }

  // Flywheel: a ring gear of teeth, lightening holes that show the fire behind.
  let teeth = '';
  for (let i = 0; i < 60; i++) {
    const [x1, y1] = polar(cx, cy, 180, i * 6 - 1.6);
    const [x2, y2] = polar(cx, cy, 191, i * 6 - 1);
    const [x3, y3] = polar(cx, cy, 191, i * 6 + 1);
    const [x4, y4] = polar(cx, cy, 180, i * 6 + 1.6);
    teeth += `M${x1} ${y1}L${x2} ${y2}L${x3} ${y3}L${x4} ${y4}`;
  }
  let holes = '';
  let spokes = '';
  for (let i = 0; i < 6; i++) {
    const [x, y] = polar(cx, cy, 124, i * 60);
    holes += `M${n1(x + 27)} ${y}A27 27 0 1 0 ${n1(x - 27)} ${y}A27 27 0 1 0 ${n1(x + 27)} ${y}Z`;
    const [sx, sy] = polar(cx, cy, 88, i * 60 + 30);
    const [tx, ty] = polar(cx, cy, 168, i * 60 + 30);
    spokes += `M${sx} ${sy}L${tx} ${ty}`;
  }
  const disc = `M${cx + 181} ${cy}A181 181 0 1 0 ${cx - 181} ${cy}A181 181 0 1 0 ${cx + 181} ${cy}Z${holes}`;

  // Hub bolts.
  let bolts = '';
  for (let i = 0; i < 6; i++) {
    const [x, y] = polar(cx, cy, 48, i * 60 + 30);
    bolts += `<circle cx="${x}" cy="${y}" r="5"/>`;
  }

  // An ignition coil drum seen end-on: steel barrel, amber ring, dark core,
  // winding grooves. `lit` adds the firing glow (animated by the caller).
  const drum = (x, y, r, fire) => {
    let grooves = '';
    for (let i = 0; i < 16; i++) {
      const [x1, y1] = polar(x, y, r * 0.6, i * 22.5);
      const [x2, y2] = polar(x, y, r * 0.92, i * 22.5);
      grooves += `M${x1} ${y1}L${x2} ${y2}`;
    }
    return `<g><circle cx="${x}" cy="${y}" r="${n1(r * 1.12)}" fill="${steelDark}"/>
<circle cx="${x}" cy="${y}" r="${r}" fill="url(#dbtefx-rz-barrel)" stroke="${mix(steel, '#ffffff', 0.25)}" stroke-opacity="0.6" stroke-width="2"/>
<path d="${grooves}" stroke="${steelDark}" stroke-opacity="0.8" stroke-width="${n1(r * 0.05)}"/>
<circle cx="${x}" cy="${y}" r="${n1(r * 0.62)}" fill="none" stroke="${mix(amber, t.bg, 0.45)}" stroke-width="${n1(r * 0.16)}"/>
${fire ? `<circle cx="${x}" cy="${y}" r="${n1(r * 0.62)}" fill="none" stroke="${hot}" stroke-width="${n1(r * 0.16)}" style="${fire}"/>` : ''}
<circle cx="${x}" cy="${y}" r="${n1(r * 0.42)}" fill="${steelDark}" stroke="${mix(steel, t.bg, 0.3)}" stroke-width="2"/>
<circle cx="${x}" cy="${y}" r="${n1(r * 0.16)}" fill="${mix(amber, t.bg, 0.2)}"/>
<path d="M${n1(x - r * 0.7)} ${n1(y - r * 0.5)}A${n1(r * 0.86)} ${n1(r * 0.86)} 0 0 1 ${n1(x + r * 0.5)} ${n1(y - r * 0.7)}" fill="none" stroke="#ffffff" stroke-opacity="0.22" stroke-width="${n1(r * 0.06)}" stroke-linecap="round"/></g>`;
  };

  // The four overlay drums on the diagonals, firing 1-3-4-2 over a 2.4s cycle.
  const order = [0, 2, 3, 1];
  const units = [-45, 45, 135, -135].map((a, i) => {
    const [x, y] = polar(cx, cy, 292, a);
    const delay = n1(-(2.4 - order[i] * 0.6));
    const fire = `animation: dbtefx-rz-fire 2.4s ease-out ${delay}s infinite;`;
    const [x0, y0] = polar(cx, cy, 240, a);
    const [sx, sy] = polar(cx, cy, 70, a + 8);
    const [mx, my] = polar(cx, cy, 150, a - 14);
    const arcs = [jag(x0, y0, sx, sy, 11, 26), jag(x0, y0, mx, my, 6, 16)];
    return {
      cable: `M${x} ${y}Q${polar(cx, cy, 285, a + 14).join(' ')} ${polar(cx, cy, 252, a + 16).join(' ')}`,
      drum: drum(x, y, 54, fire),
      arc: `<g style="${fire}" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="${arcs.join('')}" stroke="${ice}" stroke-opacity="0.3" stroke-width="16"/><path d="${arcs.join('')}" stroke="${ice}" stroke-width="5"/><path d="${arcs.join('')}" stroke="#ffffff" stroke-width="1.8"/></g>`,
    };
  });

  // Arcs crawling over the stator ring itself.
  let crawl = '';
  for (let i = 0; i < 4; i++) {
    const a0 = i * 90 + 20 + rand() * 30;
    let d = '';
    for (let k = 0; k <= 8; k++) {
      const [x, y] = polar(cx, cy, 231 + (rand() * 2 - 1) * 16, a0 + k * 5);
      d += `${k ? 'L' : 'M'}${x} ${y}`;
    }
    crawl += `<path d="${d}" stroke="${mix(ice, '#ffffff', 0.5)}" stroke-width="2" fill="none" style="animation: dbtefx-rz-crawl 1.7s steps(1) ${n1(-i * 0.43)}s infinite;"/>`;
  }

  return `<style>
@keyframes dbtefx-rz-fire { 0% { opacity: 1; } 22% { opacity: 0.85; } 30%, 100% { opacity: 0; } }
@keyframes dbtefx-rz-crawl { 0%, 100% { opacity: 0; } 12% { opacity: 1; } 24% { opacity: 0.2; } 30% { opacity: 0.9; } 40% { opacity: 0; } }
@keyframes dbtefx-rz-core { 0%, 100% { opacity: 0.8; transform: scale(0.94); } 50% { opacity: 1; transform: scale(1.06); } }
</style>
<defs>
<radialGradient id="dbtefx-rz-burst" cx="${cx}" cy="${cy}" r="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${hot}" stop-opacity="0.7"/><stop offset="0.22" stop-color="${amber}" stop-opacity="0.42"/><stop offset="0.5" stop-color="${mix(amber, t.danger, 0.5)}" stop-opacity="0.16"/><stop offset="1" stop-color="${t.danger}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-rz-cold" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${ice}" stop-opacity="0.22"/><stop offset="1" stop-color="${ice}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-rz-core" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.3" stop-color="${mix(ice, '#ffffff', 0.6)}"/><stop offset="0.62" stop-color="${ice}" stop-opacity="0.6"/><stop offset="1" stop-color="${ice}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-rz-fire" cx="0.5" cy="0.5" r="0.5"><stop offset="0.12" stop-color="${hot}"/><stop offset="0.38" stop-color="${amber}"/><stop offset="0.66" stop-color="${mix(amber, t.danger, 0.7)}"/><stop offset="0.8" stop-color="${mix(t.danger, '#000000', 0.3)}"/><stop offset="1" stop-color="${mix(t.danger, '#000000', 0.5)}"/></radialGradient>
<linearGradient id="dbtefx-rz-barrel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(steel, '#ffffff', 0.12)}"/><stop offset="0.5" stop-color="${mix(t.raised, t.bg, 0.3)}"/><stop offset="1" stop-color="${steelDark}"/></linearGradient>
<linearGradient id="dbtefx-rz-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(steel, '#ffffff', 0.25)}"/><stop offset="0.55" stop-color="${mix(t.raised, t.bg, 0.2)}"/><stop offset="1" stop-color="${steelDark}"/></linearGradient>
<radialGradient id="dbtefx-rz-ring" cx="${cx}" cy="${cy}" r="262" gradientUnits="userSpaceOnUse"><stop offset="0.78" stop-color="${steelDark}"/><stop offset="0.86" stop-color="${mix(steel, '#ffffff', 0.1)}"/><stop offset="0.93" stop-color="${mix(t.raised, t.bg, 0.4)}"/><stop offset="1" stop-color="${steelDark}"/></radialGradient>
</defs>
<rect x="0" y="0" width="1600" height="900" fill="url(#dbtefx-rz-burst)"/>
<ellipse cx="${cx}" cy="${cy}" rx="420" ry="420" fill="url(#dbtefx-rz-cold)"/>
<path d="${streaks}" stroke="${mix(amber, '#ffffff', 0.3)}" stroke-opacity="0.16" stroke-width="2" stroke-linecap="round"/>
<g fill="none" stroke="${amber}" stroke-opacity="0.1"><circle cx="${cx}" cy="${cy}" r="380" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="470" stroke-dasharray="3 14" stroke-width="3"/></g>
<!--mid-->
<path d="${units.map((u) => u.cable).join('')}" fill="none" stroke="${steelDark}" stroke-width="14" stroke-linecap="round"/>
<path d="${units.map((u) => u.cable).join('')}" fill="none" stroke="${mix(amber, t.bg, 0.55)}" stroke-width="3" stroke-dasharray="6 9" stroke-linecap="round"/>
<circle cx="${cx}" cy="${cy}" r="262" fill="${steelDark}"/>
<circle cx="${cx}" cy="${cy}" r="231" fill="none" stroke="url(#dbtefx-rz-ring)" stroke-width="62"/>
<g fill="${mix(amber, '#000000', 0.35)}" stroke="${mix(amber, '#000000', 0.6)}" stroke-width="1.5">${coils}</g>
<path d="${coilLines}" stroke="${mix(amber, '#ffffff', 0.25)}" stroke-opacity="0.85" stroke-width="1.6"/>
<g fill="none"><circle cx="${cx}" cy="${cy}" r="262" stroke="${mix(steel, '#ffffff', 0.2)}" stroke-opacity="0.5" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="200" stroke="${steelDark}" stroke-width="4"/></g>
${crawl}
<circle cx="${cx}" cy="${cy}" r="198" fill="url(#dbtefx-rz-fire)"/>
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 3.2s linear infinite;">
<path d="${disc}" fill="url(#dbtefx-rz-blade)" fill-rule="evenodd" stroke="${steelDark}" stroke-width="2"/>
<path d="${teeth}" fill="${mix(steel, '#ffffff', 0.15)}" stroke="${steelDark}" stroke-width="1"/>
<path d="${holes}" fill="none" stroke="${steelDark}" stroke-width="5"/><path d="${holes}" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1.5" transform="translate(-1.5 -1.5)"/>
<path d="${spokes}" stroke="${mix(steel, '#ffffff', 0.3)}" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round"/>
</g>
<g fill="none" stroke="${ice}" stroke-opacity="0.35" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 9s linear infinite reverse;"><circle cx="${cx}" cy="${cy}" r="192" stroke-width="3" stroke-dasharray="40 22 6 22"/></g>
<circle cx="${cx}" cy="${cy}" r="66" fill="${mix(steel, t.bg, 0.25)}" stroke="${mix(steel, '#ffffff', 0.3)}" stroke-width="3"/>
<g fill="${steelDark}" stroke="${mix(steel, '#ffffff', 0.2)}" stroke-width="1.5">${bolts}</g>
<circle cx="${cx}" cy="${cy}" r="110" fill="url(#dbtefx-rz-core)" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-rz-core 1.2s ease-in-out infinite;"/>
<circle cx="${cx}" cy="${cy}" r="18" fill="#ffffff"/>
${units.map((u) => u.drum).join('')}
${units.map((u) => u.arc).join('')}
<!--near-->
${drum(-10, 905, 190, '')}
${drum(1655, -30, 170, '')}
<g fill="none" stroke="${amber}" stroke-opacity="0.5" stroke-width="3"><path d="M1420 860l40-40h120M1440 880l40-40h100"/></g>`;
};

export default ryzeal;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'spark', count: 46, colors: ['accent', 'warning'], speed: 1.4 },
  { kind: 'spark', count: 18, colors: ['accent2'], speed: 1.8 },
  { kind: 'flash', count: 1, colors: ['accent2'] },
];
