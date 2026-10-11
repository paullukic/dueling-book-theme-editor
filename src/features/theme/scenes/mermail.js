import { mix } from '../../../lib/color.js';
import { H, n1, rng, W } from './kit.js';

// Mermail: drowned Atlantis. Light falls in shafts from a rippling surface far
// above (the shader layer) onto the throne temple of the Atlantean king: a
// coral-crusted colonnade under a ribbed dome, and between its central
// columns the Abyss-sphere, a crown of light breathing over an empty throne
// with the king's gold trident planted beside it. The drowned city fades into
// the deep behind; a far school of fish turns and a manta's shadow passes.
// Kelp sways at the edges, bubbles and drifting particles climb.
const mermail = (t) => {
  const rand = rng(53);
  const deep = mix(t.bg, '#000000', 0.3);
  const haze = mix(t.bg, t.accent, 0.26);
  const stone = mix(t.bg, t.accent, 0.34);
  const stoneLit = mix(t.accent, t.text, 0.45);
  const stoneDark = mix(t.bg, t.accent, 0.12);
  const gold = t.accent2;
  const goldLit = mix(t.accent2, '#ffffff', 0.4);
  const coral = mix(t.danger, t.bg, 0.5);
  const coral2 = mix(t.accent2, t.bg, 0.5);
  const glow = mix(t.accent, '#ffffff', 0.55);

  // The temple, all in user units: centre 1240, stylobate at 742.
  const cx = 1240;
  const k = 0.9;
  const ox = 1214 - cx * k;
  const oy = 800 * (1 - k);
  const sty = 742;
  const colTop = 494;
  const colW = 34;
  const colXs = [-196, -134, -72, 72, 134, 196];

  // A column: moulded base, tapering fluted shaft lit from the left, Ionic capital.
  const column = (x, broken) => {
    const top = broken ? colTop + 70 : colTop;
    const w0 = colW / 2;
    const w1 = colW * 0.42;
    const shaft = broken
      ? `M${x - w0} ${sty - 14}L${n1(x - w1)} ${top + 10}L${x - 4} ${top}L${x + 3} ${top + 14}L${x + 9} ${top + 4}L${n1(x + w1)} ${top + 12}L${x + w0} ${sty - 14}Z`
      : `M${x - w0} ${sty - 14}L${n1(x - w1)} ${top + 18}H${n1(x + w1)}L${x + w0} ${sty - 14}Z`;
    const cap = broken
      ? ''
      : `<path d="M${x - 24} ${top + 18}h48v-7h-48Z" fill="url(#dbtefx-mm-stone)"/><circle cx="${x - 20}" cy="${top + 18}" r="6" fill="url(#dbtefx-mm-stone)" stroke="${stoneLit}" stroke-opacity="0.4"/><circle cx="${x + 20}" cy="${top + 18}" r="6" fill="url(#dbtefx-mm-stone)" stroke="${stoneLit}" stroke-opacity="0.4"/><path d="M${x - 26} ${top + 11}h52v-11h-52Z" fill="${stone}"/>`;
    const flutes = [-0.5, -0.15, 0.2, 0.55].map((f) => `M${n1(x + f * colW * 0.6)} ${sty - 18}L${n1(x + f * colW * 0.5)} ${top + 22}`).join('');
    return `<path d="M${x - 24} ${sty}h48v-7h-6v-7h-36v7h-6Z" fill="${stone}"/><path d="${shaft}" fill="url(#dbtefx-mm-col)"/><path d="${flutes}" stroke="${deep}" stroke-opacity="0.35" stroke-width="1.6"/>${cap}`;
  };

  // Coral crust: lumpy encrustation plus a few branching fans.
  const crust = (x0, x1, y, seed) => {
    const r = rng(seed);
    let lumps = '';
    for (let x = x0; x < x1; x += 10 + r() * 22) lumps += `<ellipse cx="${n1(x)}" cy="${n1(y - 1)}" rx="${n1(5 + r() * 9)}" ry="${n1(2 + r() * 3)}"/>`;
    return `<g fill="${mix(r() > 0.5 ? coral : coral2, stone, 0.45)}">${lumps}</g>`;
  };
  const fan = (x, y, h, color, flip = 1) => {
    let d = '';
    for (let i = 0; i < 7; i++) {
      const a = ((-90 + (i - 3) * 16) * Math.PI) / 180;
      const len = h * (0.6 + ((i * 37) % 5) * 0.1);
      const mx = x + Math.cos(a) * len * 0.5 * flip + (i - 3) * 2;
      d += `M${x} ${y}Q${n1(mx)} ${n1(y + Math.sin(a) * len * 0.5)} ${n1(x + Math.cos(a) * len * flip)} ${n1(y + Math.sin(a) * len)}`;
    }
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round"/>`;
  };

  // Dome over a drum, ribbed, crowned by a small lantern.
  let ribs = '';
  for (let i = -3; i <= 3; i++) ribs += `M${cx + i * 40} 398Q${n1(cx + i * 30)} 300 ${cx} 262`;
  let drumWins = '';
  for (let i = -3; i <= 3; i++) drumWins += `M${cx + i * 38 - 6} 430v-18a6 6 0 0 1 12 0v18Z`;

  // Wave-scroll frieze, the Mermail armour motif carved in stone.
  let frieze = `M${cx - 222} 461`;
  for (let x = cx - 222; x < cx + 200; x += 22) frieze += 'q5.5 -9 11 0t11 0';

  // The empty throne: a high back fanned like a shell, armrests, a dais.
  let shell = '';
  for (let i = 0; i < 9; i++) {
    const a = ((-170 + i * 20) * Math.PI) / 180;
    shell += `M${cx} 704L${n1(cx + Math.cos(a) * 54)} ${n1(704 + Math.sin(a) * 66)}`;
  }
  const throne = `<path d="M${cx - 70} ${sty}h140v-10h-12v-8h-116v8h-12Z" fill="${stone}"/>
<path d="M${cx - 56} 704A56 68 0 0 1 ${cx + 56} 704Z" fill="url(#dbtefx-mm-stone)"/><path d="${shell}" stroke="${stoneDark}" stroke-width="2"/><path d="M${cx - 56} 704A56 68 0 0 1 ${cx + 56} 704" fill="none" stroke="${gold}" stroke-width="2.4"/>
<path d="M${cx - 44} 724h88v-20h-88Z" fill="${stone}"/><path d="M${cx - 50} 706h18v18h-18ZM${cx + 32} 706h18v18h-18Z" fill="${stoneDark}"/><path d="M${cx - 44} 704h88" stroke="${goldLit}" stroke-opacity="0.7" stroke-width="2"/>`;

  // The king's trident, planted beside the throne, head catching the light.
  const [tx, ty] = [cx + 96, 724];
  const trident = `<g transform="translate(${tx} ${ty}) rotate(4)" fill="url(#dbtefx-mm-gold)"><path d="M-3.5 0V-178h7V0Z"/><path d="M-7 -96h14v6h-14ZM-7 -40h14v6h-14Z"/><path d="M-24 -178Q-24 -194 -12 -200Q-18 -188 -15 -182H15Q18 -188 12 -200Q24 -194 24 -178Q12 -172 0 -172Q-12 -172 -24 -178Z"/><path d="M-3 -196L0 -244L3 -196ZM-19 -194L-24 -232L-12 -200ZM19 -194L24 -232L12 -200Z"/><path d="M0 -244l-5 10h10ZM-24 -232l-1 10l6 -4ZM24 -232l1 10l-6 -4Z"/><circle cy="-180" r="4" fill="${t.danger}"/></g>`;

  // The Abyss-sphere: a globe of water and light breathing over the throne.
  const [sx, sy] = [cx, 588];
  const sphere = `<circle cx="${sx}" cy="${sy}" r="150" fill="url(#dbtefx-mm-aura)" style="animation: dbtefx-mm-breathe 7s ease-in-out infinite; transform-box: fill-box; transform-origin: center;"/>
<g style="transform-origin: ${sx}px ${sy}px; animation: dbtefx-spin 60s linear infinite;"><ellipse cx="${sx}" cy="${sy}" rx="64" ry="18" fill="none" stroke="${glow}" stroke-opacity="0.45" stroke-width="1.4" stroke-dasharray="16 8 3 8"/></g>
<circle cx="${sx}" cy="${sy}" r="40" fill="url(#dbtefx-mm-orb)" stroke="${glow}" stroke-opacity="0.8" stroke-width="1.5"/>
<path d="M${sx - 26} ${sy - 12}a30 30 0 0 1 20 -20" fill="none" stroke="#ffffff" stroke-opacity="0.8" stroke-width="3" stroke-linecap="round"/>
<circle cx="${sx}" cy="${sy}" r="40" fill="none" stroke="#ffffff" stroke-width="2" style="animation: dbtefx-mm-pulse 7s ease-out infinite; transform-box: fill-box; transform-origin: center;"/>`;

  // Far: the drowned city fading into the deep, in two hazed rows.
  const cityRow = (y, k, seed, from, to) => {
    const r = rng(seed);
    let d = '';
    for (let x = from; x < to; ) {
      const w = (40 + r() * 70) * k;
      const h = (60 + r() * 160) * k;
      const kind = r();
      if (kind < 0.3) d += `M${n1(x)} ${y}V${n1(y - h)}A${n1(w / 2)} ${n1(w / 2)} 0 0 1 ${n1(x + w)} ${n1(y - h)}V${y}Z`;
      else if (kind < 0.55) d += `M${n1(x)} ${y}V${n1(y - h)}L${n1(x + w / 2)} ${n1(y - h - w * 0.5)}L${n1(x + w)} ${n1(y - h)}V${y}Z`;
      else if (kind < 0.8) d += `M${n1(x + w * 0.3)} ${y}V${n1(y - h * 1.3)}L${n1(x + w / 2)} ${n1(y - h * 1.3 - w)}L${n1(x + w * 0.7)} ${n1(y - h * 1.3)}V${y}Z`;
      else {
        for (let i = 0; i < 3; i++) d += `M${n1(x + (i * w) / 3)} ${y}V${n1(y - h * 0.6)}h${n1(w / 3)}V${y}h${n1(-w / 12)}V${n1(y - h * 0.6 + w / 6)}a${n1(w / 12)} ${n1(w / 12)} 0 0 0 ${n1(-w / 6)} 0V${y}Z`;
      }
      x += w + r() * 30 * k;
    }
    return d;
  };

  // Aqueduct arches on the far left.
  let aqueduct = 'M20 690V540H460V690';
  for (let i = 0; i < 6; i++) aqueduct += `H${n1(440 - i * 72)}V610A26 26 0 0 0 ${n1(388 - i * 72)} 610V690`;
  aqueduct += 'Z';

  // A far school of fish turning, and a manta's shadow.
  let school = '';
  for (let i = 0; i < 46; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand());
    const x = 560 + Math.cos(a) * d * 120;
    const y = 190 + Math.sin(a) * d * 46;
    school += `M${n1(x)} ${n1(y)}l7 -2l-1 2l1 2Z`;
  }
  const manta = 'M0 0C-30 -6 -70 4 -110 22C-80 20 -50 18 -30 24C-20 30 -8 34 0 36C8 34 20 30 30 24C50 18 80 20 110 22C70 4 30 -6 0 0ZM-2 34L0 80L2 34Z';

  // Kelp: giant kelp stipes with long ribbon blades and float bladders.
  const kelp = (x, h, lean, delay) => {
    let stipe = `M${x} ${H + 20}`;
    let blades = '';
    let floats = '';
    for (let i = 1; i <= 8; i++) {
      const y = H + 20 - (h * i) / 8;
      const xx = x + Math.sin(i * 0.8) * 12 + lean * i * 5;
      stipe += `L${n1(xx)} ${n1(y)}`;
      if (i > 1) {
        const s = i % 2 ? 1 : -1;
        blades += `M${n1(xx)} ${n1(y)}C${n1(xx + s * 14)} ${n1(y - 18)} ${n1(xx + s * 40)} ${n1(y - 30)} ${n1(xx + s * 52)} ${n1(y - 62)}C${n1(xx + s * 30)} ${n1(y - 40)} ${n1(xx + s * 10)} ${n1(y - 26)} ${n1(xx)} ${n1(y)}Z`;
        floats += `<circle cx="${n1(xx + s * 4)}" cy="${n1(y - 3)}" r="4"/>`;
      }
    }
    return `<g style="transform-origin: ${x}px ${H + 20}px; animation: dbtefx-reed ${n1(8 + delay)}s ease-in-out ${n1(-delay * 2)}s infinite;"><path d="${stipe}" fill="none" stroke="url(#dbtefx-mm-kelp)" stroke-width="4" stroke-linecap="round"/><path d="${blades}" fill="url(#dbtefx-mm-kelp)"/><g fill="${mix(t.bg, t.success, 0.4)}">${floats}</g></g>`;
  };

  // Bubbles escaping the temple's cracks.
  let bubbles = '';
  for (let i = 0; i < 12; i++) {
    const x = 1060 + rand() * 360;
    const y = 520 + rand() * 220;
    const r = n1(2 + rand() * 5);
    bubbles += `<g style="animation: dbtefx-mm-rise ${n1(10 + rand() * 8)}s linear ${n1(-rand() * 18)}s infinite;"><circle cx="${n1(x)}" cy="${n1(y)}" r="${r}" fill="url(#dbtefx-mm-bub)" stroke="${t.text}" stroke-opacity="0.4" stroke-width="0.8"/></g>`;
  }

  // Light shafts slanting onto the temple (the shader adds the moving ones).
  let rays = '';
  for (let i = 0; i < 6; i++) {
    const x0 = 900 + i * 90;
    const x1 = 820 + i * 120 + rand() * 40;
    rays += `<path d="M${x0} -20h${n1(26 + rand() * 24)}L${n1(x1 + 80 + rand() * 50)} ${H}H${n1(x1)}Z" style="animation: dbtefx-pulse ${n1(6 + i * 1.4)}s ease-in-out ${n1(-i * 1.9)}s infinite;"/>`;
  }

  return `<style>@keyframes dbtefx-mm-rise { 0% { transform: translate(0, 0); opacity: 0; } 10% { opacity: 1; } 100% { transform: translate(20px, -700px); opacity: 0; } }
@keyframes dbtefx-mm-breathe { 0%, 100% { transform: scale(0.9); opacity: 0.65; } 50% { transform: scale(1.08); opacity: 1; } }
@keyframes dbtefx-mm-pulse { 0%, 55% { transform: scale(1); opacity: 0; } 60% { opacity: 0.7; } 100% { transform: scale(3.2); opacity: 0; } }
@keyframes dbtefx-mm-school { 0%, 100% { transform: translate(0, 0) scaleX(1); } 45% { transform: translate(120px, 18px) scaleX(1); } 50% { transform: translate(126px, 20px) scaleX(-1); } 95% { transform: translate(6px, 2px) scaleX(-1); } }
@keyframes dbtefx-mm-manta { 0% { transform: translate(-260px, 30px); opacity: 0; } 15%, 85% { opacity: 1; } 100% { transform: translate(260px, -30px); opacity: 0; } }</style>
<defs>
<linearGradient id="dbtefx-mm-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.accent, 0.35)}" stop-opacity="0.5"/><stop offset="0.55" stop-color="${haze}" stop-opacity="0.2"/><stop offset="1" stop-color="${deep}" stop-opacity="0.75"/></linearGradient>
<linearGradient id="dbtefx-mm-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${glow}" stop-opacity="0.2"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-mm-col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(stone, stoneLit, 0.45)}"/><stop offset="0.35" stop-color="${stone}"/><stop offset="1" stop-color="${stoneDark}"/></linearGradient>
<linearGradient id="dbtefx-mm-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(stone, stoneLit, 0.35)}"/><stop offset="1" stop-color="${stoneDark}"/></linearGradient>
<linearGradient id="dbtefx-mm-dome" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stop-color="${mix(stone, stoneLit, 0.5)}"/><stop offset="0.5" stop-color="${stone}"/><stop offset="1" stop-color="${stoneDark}"/></linearGradient>
<linearGradient id="dbtefx-mm-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldLit}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="1" stop-color="${mix(gold, t.bg, 0.45)}"/></linearGradient>
<linearGradient id="dbtefx-mm-kelp" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${deep}"/><stop offset="1" stop-color="${mix(t.bg, t.success, 0.32)}"/></linearGradient>
<linearGradient id="dbtefx-mm-cella" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${deep}"/><stop offset="1" stop-color="${mix(deep, t.accent, 0.2)}"/></linearGradient>
<radialGradient id="dbtefx-mm-bub" cx="0.35" cy="0.35"><stop offset="0" stop-color="#ffffff" stop-opacity="0.05"/><stop offset="0.8" stop-color="${t.accent}" stop-opacity="0.12"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.45"/></radialGradient>
<radialGradient id="dbtefx-mm-aura"><stop offset="0" stop-color="${glow}" stop-opacity="0.55"/><stop offset="0.35" stop-color="${t.accent}" stop-opacity="0.22"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-mm-orb" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#ffffff"/><stop offset="0.3" stop-color="${glow}"/><stop offset="0.8" stop-color="${t.accent}"/><stop offset="1" stop-color="${mix(t.accent, t.bg, 0.4)}"/></radialGradient>
<linearGradient id="dbtefx-mm-fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haze}" stop-opacity="0"/><stop offset="1" stop-color="${haze}" stop-opacity="0.55"/></linearGradient>
<radialGradient id="dbtefx-mm-pool"><stop offset="0" stop-color="${glow}" stop-opacity="0.3"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-mm-sea)"/>
<g fill="${haze}" fill-opacity="0.35"><path d="${cityRow(700, 0.8, 5, 0, 1000)}"/></g>
<path d="${aqueduct}" fill="${haze}" fill-opacity="0.45"/>
<g fill="${mix(haze, t.bg, 0.3)}" fill-opacity="0.5"><path d="${cityRow(760, 1, 11, 380, 1000)}"/></g>
<rect y="480" width="${W}" height="320" fill="url(#dbtefx-mm-fog)"/>
<g fill="${mix(haze, t.bg, 0.3)}" fill-opacity="0.5" style="animation: dbtefx-mm-school 40s ease-in-out infinite;"><path d="${school}"/></g>
<g transform="translate(860 120)"><path d="${manta}" fill="${deep}" fill-opacity="0.25" style="animation: dbtefx-mm-manta 46s linear infinite;"/></g>
<!--mid-->
<path d="M-40 ${H + 40}V790C200 770 420 800 700 784S1200 770 1640 780V${H + 40}Z" fill="${mix(stone, t.bg, 0.55)}"/><path d="M-40 790C200 770 420 800 700 784S1200 770 1640 780" fill="none" stroke="${stoneLit}" stroke-opacity="0.18" stroke-width="2"/>
<g fill="url(#dbtefx-mm-ray)">${rays}</g>
<g transform="translate(${n1(ox)} ${n1(oy)}) scale(${k})">
<ellipse cx="${cx}" cy="${sty + 20}" rx="360" ry="60" fill="url(#dbtefx-mm-pool)"/>
<path d="M${cx - 250} 800h500v-20h-16v-18h-16v-20h-436v20h-16v18h-16Z" fill="url(#dbtefx-mm-stone)"/>
<path d="M${cx - 218} ${sty}h436M${cx - 234} 762h468M${cx - 250} 780h500" stroke="${stoneLit}" stroke-opacity="0.3" stroke-width="1.5"/>
<path d="M${cx - 150} ${sty}V${colTop}H${cx + 150}V${sty}Z" fill="url(#dbtefx-mm-cella)"/>
<path d="M${cx - 150} ${sty}V560h40v${sty - 560}ZM${cx + 110} ${sty}V560h40v${sty - 560}Z" fill="${stoneDark}" fill-opacity="0.7"/>
${throne}
${sphere}
${trident}
${colXs.map((dx, i) => column(cx + dx, i === 0)).join('')}
<path d="M${cx - 160} 494h390v-24h-390Z" fill="url(#dbtefx-mm-stone)"/>
<path d="M${cx - 236} 470h472v-26h-472Z" fill="${stone}"/>
<path d="${frieze}" fill="none" stroke="${gold}" stroke-opacity="0.45" stroke-width="2"/>
<path d="M${cx - 248} 444h496v-12h-496Z" fill="url(#dbtefx-mm-stone)"/><path d="M${cx - 248} 432h496" stroke="${stoneLit}" stroke-opacity="0.55" stroke-width="2"/>
<path d="M${cx - 150} 432V398H${cx + 150}V432Z" fill="url(#dbtefx-mm-stone)"/><path d="${drumWins}" fill="${deep}" fill-opacity="0.75"/>
<path d="M${cx - 160} 398A160 136 0 0 1 ${cx + 160} 398Z" fill="url(#dbtefx-mm-dome)"/>
<path d="${ribs}" fill="none" stroke="${stoneLit}" stroke-opacity="0.28" stroke-width="2"/>
<path d="M${cx - 160} 398A160 136 0 0 1 ${cx + 160} 398" fill="none" stroke="${stoneLit}" stroke-opacity="0.5" stroke-width="2"/>
<path d="M${cx - 14} 266v-26h28v26ZM${cx - 18} 240h36v-6h-36ZM${cx} 234l-4 -22h8Z" fill="${stone}"/>
${[[-226, 40], [-170, 70], [-60, 54], [40, 80], [150, 46], [210, 64]].map(([dx, l]) => `<path d="M${cx + dx} 444q-6 ${n1(l * 0.3)} 2 ${n1(l * 0.55)}t-2 ${n1(l * 0.45)}" fill="none" stroke="${mix(t.bg, t.success, 0.35)}" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
${crust(cx - 246, cx + 246, 432, 7)}${crust(cx - 150, cx + 150, 398, 9)}${crust(cx - 236, cx - 120, 471, 13)}
${fan(cx - 222, 432, 34, coral)}${fan(cx + 214, 432, 26, coral2, -1)}${fan(cx + 120, 398, 22, coral)}${fan(cx - 196, colTop + 70, 20, coral2)}
</g>
${bubbles}
<!--near-->
<g fill="${mix(t.bg, '#000000', 0.2)}"><path d="M-40 ${H + 20}V840C40 810 120 830 180 860S260 ${H} 300 ${H + 20}Z"/><path d="M1640 ${H + 20}V820C1560 800 1500 830 1460 860S1400 ${H} 1380 ${H + 20}Z"/></g>
${fan(120, 852, 70, mix(coral, t.bg, 0.3))}${fan(1500, 840, 80, mix(coral2, t.bg, 0.3), -1)}
${kelp(34, 620, 0.5, 0)}${kelp(84, 420, 0.8, 1.5)}${kelp(1566, 640, -0.6, 0.8)}${kelp(1520, 400, -0.4, 2.2)}`;
};

export default mermail;

// Particle systems for this theme (kinds and options: particles.js):
// rising bubbles and slow marine snow.
export const particles = [{ kind: 'mote', count: 60, colors: ['text', 'accent'], rise: true, speed: 0.7 }, { kind: 'mote', count: 50, colors: ['muted'], light: true, speed: 0.3 }];

// WebGL layer (shader.js): sunlight through deep water. Shafts fan from a sun
// above the frame, drifting with the swell; caustic ripples near the surface.
export const shader = {
  uniforms: ['bg', 'accent', 'text'],
  frag: `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  float t = u_time;
  vec3 col = mix(u_bg * 0.7, mix(u_bg, u_accent, 0.42), smoothstep(0.0, 1.0, uv.y));
  vec2 d = vec2((uv.x - 0.62) * asp, uv.y - 1.35);
  float a = atan(d.x, -d.y);
  float sw = noise(vec2(a * 16.0 + sin(t * 0.21) * 0.6, t * 0.18)) * noise(vec2(a * 41.0 - t * 0.12, 3.0 + t * 0.1));
  float shafts = smoothstep(0.18, 0.75, sw) * smoothstep(-0.05, 0.85, uv.y) * exp(-length(d) * 0.55);
  col += mix(u_accent, u_text, 0.5) * shafts * 0.42;
  vec2 cp = vec2(uv.x * asp, uv.y) * 7.0;
  float c1 = noise(cp + vec2(t * 0.35, t * 0.22));
  float c2 = noise(cp * 1.3 - vec2(t * 0.27, -t * 0.3));
  float caus = pow(1.0 - abs(c1 - c2), 7.0) * smoothstep(0.6, 1.0, uv.y);
  col += u_text * caus * 0.18;
  float surf = smoothstep(0.93, 1.0, uv.y) * (0.6 + 0.4 * fbm(vec2(uv.x * asp * 3.0 + t * 0.1, t * 0.15)));
  col = mix(col, mix(u_accent, u_text, 0.6), surf * 0.35);
  col *= 1.0 - 0.35 * dot(uv - vec2(0.5, 0.6), uv - vec2(0.5, 0.6));
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
