import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Constellar: the star knights' sky. A violet nebula over a celestial chart;
// on the right the Constellar crest (the eight-point star compass the knights
// wear on their breastplates) turns inside a silver-and-gold armillary, two
// Xyz overlay units orbiting it; below it Scorpius curls down to the Ptolemy
// cluster, M7, its lines lighting star by star as the knights are called.
const constellar = (t) => {
  const rand = rng(77);
  const silver = t.accent;
  const silverDeep = mix(t.accent, t.bg, 0.55);
  const gold = t.accent2;
  const goldDeep = mix(t.accent2, t.bg, 0.45);
  const violet = t.self;
  const red = mix(t.danger, t.warning, 0.25);

  // Crosshair star: the ringed four-point sparkle from Constellar card art.
  const crossStar = (x, y, r, color, o = 1) => `<use href="#dbtefx-cs-x" color="${color}" opacity="${o}" transform="translate(${n1(x)} ${n1(y)}) scale(${n1(r)})"/>`;

  // Far: nebula, a static star field and the chart's coordinate arcs.
  let field = '';
  for (let i = 0; i < 120; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const r = rand() < 0.1 ? 1.6 : 0.5 + rand() * 0.7;
    field += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" fill-opacity="${n1(0.25 + rand() * 0.55)}"/>`;
  }
  let arcs = '';
  for (let i = 0; i < 6; i++) {
    const ry = 520 + i * 150;
    arcs += `<ellipse cx="1240" cy="${n1(330 + ry * 0.92)}" rx="${n1(ry * 1.6)}" ry="${ry}"/>`;
  }
  for (let i = -3; i <= 3; i++) arcs += `<path d="M1240 330Q${n1(1240 + i * 260)} ${n1(330 + 400)} ${n1(1240 + i * 520)} ${H + 80}"/>`;

  // Faint far constellations: Leo (Leonis) top left, Gemini (Castor and Pollux) top centre.
  const figure = (pts, links, ox, oy, k) => {
    const p = pts.map(([x, y]) => [n1(ox + x * k), n1(oy + y * k)]);
    return {
      lines: links.map(([a, b]) => `M${p[a][0]} ${p[a][1]}L${p[b][0]} ${p[b][1]}`).join(''),
      stars: p,
    };
  };
  const leo = figure([[0, 60], [30, 40], [62, 44], [80, 20], [70, 0], [48, -6], [100, 70], [170, 76], [196, 54], [130, 50]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7], [7, 8], [8, 9], [9, 2]], 150, 120, 1.25);
  const gem = figure([[0, 0], [40, -10], [10, 40], [50, 30], [20, 90], [62, 84], [30, 140], [74, 136]], [[0, 2], [2, 4], [4, 6], [1, 3], [3, 5], [5, 7], [0, 1]], 640, 70, 1.05);
  const farFig = [leo, gem];

  // Scorpius from Acrab to the stinger, then the M7 cluster beyond the tail.
  const sco = [[0, 0], [-8, 18], [-12, 38], [30, 40], [45, 56], [58, 70], [68, 104], [70, 134], [72, 164], [86, 190], [106, 204], [131, 200], [141, 180], [128, 168]];
  const [ox, oy, k] = [1090, 548, 1.36];
  const sp = sco.map(([x, y]) => [n1(ox + x * k), n1(oy + y * k)]);
  const order = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13]];
  const seg = (a, b) => `M${sp[a][0]} ${sp[a][1]}L${sp[b][0]} ${sp[b][1]}`;
  const tracePeriod = 14;
  const traced = order
    .map(([a, b], i) => `<path d="${seg(a, b)}" style="animation: dbtefx-cs-trace ${tracePeriod}s ease-in-out ${n1(-tracePeriod + i * 0.55)}s infinite;"/>`)
    .join('');
  const [mx, my] = [n1(ox + 160 * k), n1(oy + 150 * k)];
  let m7 = '';
  for (let i = 0; i < 26; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * 34;
    m7 += `<circle cx="${n1(mx + Math.cos(a) * d)}" cy="${n1(my + Math.sin(a) * d * 0.8)}" r="${n1(0.7 + rand() * 1.3)}"/>`;
  }

  // The armillary: a graduated meridian ring, a gold horizon band, turning ecliptic rings.
  const [cx, cy] = [1236, 318];
  let ticks = '';
  for (let i = 0; i < 72; i++) {
    const r0 = i % 6 ? 170 : 162;
    const [x1, y1] = polar(cx, cy, r0, i * 5);
    const [x2, y2] = polar(cx, cy, 176, i * 5);
    ticks += `M${x1} ${y1}L${x2} ${y2}`;
  }
  const ring = (rx, ry, rot, dur, rev, color, w, o) =>
    `<g transform="translate(${cx} ${cy})"><g style="animation: dbtefx-spin ${dur}s linear infinite${rev ? ' reverse' : ''};"><ellipse rx="${rx}" ry="${ry}" transform="rotate(${rot})" fill="none" stroke="${color}" stroke-width="${w}" stroke-opacity="${o}"/></g></g>`;

  // The crest: four long points, four short, a ring and a cabochon.
  const crest = (r) => {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const long = i % 4 === 0;
      const mid = i % 4 === 2;
      const rad = long ? r : mid ? r * 0.62 : r * 0.2;
      pts.push(polar(cx, cy, rad, -90 + i * 22.5).join(' '));
    }
    let facets = '';
    for (let i = 0; i < 8; i++) {
      const rad = i % 2 ? r * 0.62 : r;
      const a = -90 + i * 45;
      const tip = polar(cx, cy, rad, a).join(' ');
      const l = polar(cx, cy, r * 0.2, a - 22.5).join(' ');
      const rr2 = polar(cx, cy, r * 0.2, a + 22.5).join(' ');
      facets += `<path d="M${cx} ${cy}L${l}L${tip}Z" fill="${i % 2 ? goldDeep : mix(gold, '#ffffff', 0.35)}"/><path d="M${cx} ${cy}L${tip}L${rr2}Z" fill="${i % 2 ? gold : goldDeep}"/>`;
    }
    return `<path d="M${pts.join('L')}Z" fill="${gold}" stroke="${mix(gold, '#ffffff', 0.5)}" stroke-width="1.2"/>${facets}
<circle cx="${cx}" cy="${cy}" r="${n1(r * 0.42)}" fill="none" stroke="${silver}" stroke-width="3"/>
<circle cx="${cx}" cy="${cy}" r="${n1(r * 0.24)}" fill="url(#dbtefx-cs-gem)" stroke="${silver}" stroke-width="1.5"/>
<circle cx="${n1(cx - r * 0.07)}" cy="${n1(cy - r * 0.08)}" r="${n1(r * 0.07)}" fill="#ffffff" fill-opacity="0.85"/>`;
  };

  // Overlay units: two light orbs on an elliptical orbit (translate keyframes).
  const orbit = [];
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const x = Math.cos(a) * 222;
    const y = Math.sin(a) * 64;
    const [rx, ry] = [x * Math.cos(-0.33) - y * Math.sin(-0.33), x * Math.sin(-0.33) + y * Math.cos(-0.33)];
    const front = Math.sin(a) > 0;
    orbit.push(`${n1((i / 16) * 100)}% { transform: translate(${n1(rx)}px, ${n1(ry)}px) scale(${front ? 1.15 : 0.75}); opacity: ${front ? 1 : 0.45}; }`);
  }
  const orb = (delay) =>
    `<g transform="translate(${cx} ${cy})"><g style="animation: dbtefx-cs-orbit 16s linear ${-delay}s infinite;"><circle r="26" fill="url(#dbtefx-cs-orb)"/><circle r="6" fill="#ffffff"/><circle r="10" fill="none" stroke="${silver}" stroke-width="1.2" stroke-opacity="0.8"/></g></g>`;

  // Swept gold armour blades on the meridian ring, like the knights' pauldron fins.
  const fins = [-67.5, -22.5, 22.5, 67.5, 112.5, 157.5, -157.5, -112.5]
    .map((a, i) => {
      const len = i % 2 ? 58 : 92;
      const b0 = polar(cx, cy, 186, a - 2.6);
      const b1 = polar(cx, cy, 186, a + 2.6);
      const tip = polar(cx, cy, 186 + len, a + 3);
      const c0 = polar(cx, cy, 186 + len * 0.55, a - 1.4);
      return `<path d="M${b0.join(' ')}Q${c0.join(' ')} ${tip.join(' ')}L${b1.join(' ')}Z" fill="url(#dbtefx-cs-gold)" stroke="${mix(gold, '#ffffff', 0.4)}" stroke-width="0.8"/>`;
    })
    .join('');

  // Near: a few large ringed sparkles at the edges, breathing slowly.
  const near = [[90, 70, 7], [1530, 820, 9], [1490, 90, 5], [40, 640, 6], [1000, 860, 5]]
    .map(([x, y, r], i) => `<g style="animation: dbtefx-bloom ${n1(5 + i * 1.3)}s ease-in-out ${n1(-i * 1.7)}s infinite; transform-box: fill-box; transform-origin: center;">${crossStar(x, y, r, i % 2 ? gold : silver, 0.85)}</g>`)
    .join('');

  return `<style>@keyframes dbtefx-cs-trace { 0%, 100% { opacity: 0.05; } 6% { opacity: 1; } 40% { opacity: 0.7; } 70% { opacity: 0.12; } }
@keyframes dbtefx-cs-orbit { ${orbit.join(' ')} }
@keyframes dbtefx-cs-twinkle { 0%, 100% { opacity: 0.35; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.15); } }</style>
<defs>
<symbol id="dbtefx-cs-x" overflow="visible"><path d="M0 -2.4L0.22 -0.22L2.4 0L0.22 0.22L0 2.4L-0.22 0.22L-2.4 0L-0.22 -0.22Z" fill="currentColor"/><circle r="0.95" fill="none" stroke="currentColor" stroke-width="0.2"/><circle r="0.35" fill="#ffffff"/></symbol>
<linearGradient id="dbtefx-cs-sky" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${mix(t.bg, violet, 0.22)}"/><stop offset="0.55" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.4)}"/></linearGradient>
<radialGradient id="dbtefx-cs-neb1"><stop offset="0" stop-color="${violet}" stop-opacity="0.42"/><stop offset="0.5" stop-color="${mix(violet, t.bg, 0.5)}" stop-opacity="0.2"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-cs-neb2"><stop offset="0" stop-color="${mix(violet, t.link, 0.5)}" stop-opacity="0.2"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-cs-band"><stop offset="0" stop-color="${mix(silver, violet, 0.3)}" stop-opacity="0.2"/><stop offset="0.6" stop-color="${violet}" stop-opacity="0.08"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-cs-neb3"><stop offset="0" stop-color="${mix(t.link, violet, 0.4)}" stop-opacity="0.24"/><stop offset="1" stop-color="${t.link}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-cs-halo"><stop offset="0" stop-color="${silver}" stop-opacity="0.38"/><stop offset="0.35" stop-color="${violet}" stop-opacity="0.2"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-cs-silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="${silver}"/><stop offset="0.7" stop-color="${silverDeep}"/><stop offset="1" stop-color="${silver}"/></linearGradient>
<linearGradient id="dbtefx-cs-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.55)}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="1" stop-color="${goldDeep}"/></linearGradient>
<radialGradient id="dbtefx-cs-gem" cx="0.4" cy="0.35"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="${mix(violet, '#ffffff', 0.3)}"/><stop offset="1" stop-color="${mix(violet, t.bg, 0.4)}"/></radialGradient>
<radialGradient id="dbtefx-cs-orb"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.3" stop-color="${silver}" stop-opacity="0.6"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-cs-m7"><stop offset="0" stop-color="${silver}" stop-opacity="0.45"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-cs-sky)"/>
<ellipse cx="1180" cy="300" rx="620" ry="380" fill="url(#dbtefx-cs-neb1)" transform="rotate(-24 1180 300)"/>
<ellipse cx="700" cy="520" rx="900" ry="120" fill="url(#dbtefx-cs-band)" transform="rotate(-28 700 520)"/>
<ellipse cx="660" cy="540" rx="760" ry="26" fill="${t.bg}" fill-opacity="0.35" transform="rotate(-29 660 540)"/>
<ellipse cx="300" cy="780" rx="460" ry="220" fill="url(#dbtefx-cs-neb2)" transform="rotate(-12 300 780)"/>
<ellipse cx="640" cy="120" rx="560" ry="160" fill="url(#dbtefx-cs-neb3)" transform="rotate(8 640 120)"/>
<ellipse cx="1350" cy="700" rx="360" ry="200" fill="url(#dbtefx-cs-neb3)"/>
<g fill="none" stroke="${silver}" stroke-opacity="0.06" stroke-width="1.2">${arcs}</g>
<g fill="${t.text}">${field}</g>
<g stroke="${silver}" stroke-opacity="0.16" stroke-width="1" fill="none">${farFig.map((f) => `<path d="${f.lines}"/>`).join('')}</g>
${farFig.map((f) => f.stars.map(([x, y], i) => crossStar(x, y, i % 3 ? 1.6 : 2.4, silver, 0.45)).join('')).join('')}
${[[120, 330], [300, 520], [80, 820], [560, 40], [720, 300], [880, 620], [960, 180], [430, 700], [1500, 520], [1420, 860], [700, 860], [1100, 40]].map(([x, y], i) => crossStar(x, y, 2.4 + (i % 3) * 0.9, i % 4 === 1 ? gold : silver, 0.55 + (i % 3) * 0.12)).join('')}
<!--mid-->
<g class="dbtefx-cs-armillary" transform="translate(${n1(1292 - 0.78 * cx)} ${n1(336 - 0.78 * cy)}) scale(0.78)">
<circle cx="${cx}" cy="${cy}" r="330" fill="url(#dbtefx-cs-halo)" style="animation: dbtefx-pulse 9s ease-in-out infinite;"/>
<ellipse cx="${mx}" cy="${my}" rx="90" ry="70" fill="url(#dbtefx-cs-m7)"/>
<g fill="${t.text}" fill-opacity="0.85">${m7}</g>
<g stroke="${silver}" stroke-opacity="0.4" stroke-width="1.6" fill="none">${order.map(([a, b]) => `<path d="${seg(a, b)}"/>`).join('')}</g>
<g stroke="${mix(silver, '#ffffff', 0.4)}" stroke-width="2.4" stroke-linecap="round" fill="none">${traced}</g>
${sp.map(([x, y], i) => (i === 4 ? `<circle cx="${x}" cy="${y}" r="16" fill="url(#dbtefx-cs-orb)"/>${crossStar(x, y, 5, red)}` : crossStar(x, y, i % 4 === 0 ? 4.4 : 3, i % 5 === 2 ? gold : silver, 0.95))).join('')}
${ring(212, 58, -20, 70, false, gold, 2, 0.6)}
${ring(192, 84, 34, 95, true, silver, 1.5, 0.5)}
${ring(228, 36, -62, 120, false, mix(violet, silver, 0.3), 2.5, 0.55)}
${fins}
<circle cx="${cx}" cy="${cy}" r="180" fill="none" stroke="url(#dbtefx-cs-silver)" stroke-width="14"/>
<circle cx="${cx}" cy="${cy}" r="173" fill="none" stroke="${gold}" stroke-width="1.6"/>
<circle cx="${cx}" cy="${cy}" r="187" fill="none" stroke="${goldDeep}" stroke-width="1.5"/>
<path d="${ticks}" stroke="${mix(silver, t.bg, 0.25)}" stroke-width="1.4"/>
<ellipse cx="${cx}" cy="${cy}" rx="180" ry="48" transform="rotate(-18 ${cx} ${cy})" fill="none" stroke="url(#dbtefx-cs-gold)" stroke-width="7"/>
<path d="M${cx} ${cy - 200}V${cy + 200}" stroke="url(#dbtefx-cs-silver)" stroke-width="5"/>
${crossStar(cx, cy - 206, 6, gold)}${crossStar(cx, cy + 206, 5, silver)}
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 180s linear infinite;">${crest(108)}</g>
${orb(0)}${orb(8)}
</g>
<!--near-->
${near}`;
};

export default constellar;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 90, colors: ['text', 'accent'] }, { kind: 'mote', count: 24, colors: ['accent2', 'accent'] }, { kind: 'meteor', count: 1, colors: ['accent'] }];
