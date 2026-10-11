import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Divine Beasts: the three Egyptian Gods in one temple sky. Obelisk the
// Tormentor looms behind everything, the Winged Dragon of Ra rises out of
// its sun at the upper right, Slifer the Sky Dragon coils up from below.

// Samples a chain of cubic segments [[p0, p1, p2, p3], ...] into points.
const sample = (segs, steps) => {
  const out = [];
  segs.forEach(([a, b, c, d], s) => {
    for (let i = s ? 1 : 0; i <= steps; i++) {
      const u = i / steps;
      const v = 1 - u;
      out.push([0, 1].map((k) => v * v * v * a[k] + 3 * v * v * u * b[k] + 3 * v * u * u * c[k] + u * u * u * d[k]));
    }
  });
  return out;
};

// A tapering body along points: outline, plus the side edges and normals.
const ribbon = (pts, w0, w1) => {
  const L = [];
  const R = [];
  const N = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const n = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
    const w = (w0 + (w1 - w0) * (i / (pts.length - 1))) / 2;
    N.push([n[0], n[1], w]);
    L.push([n1(p[0] + n[0] * w), n1(p[1] + n[1] * w)]);
    R.push([n1(p[0] - n[0] * w), n1(p[1] - n[1] * w)]);
  });
  const d = `M${L.map((q) => q.join(' ')).join('L')}L${R.reverse().map((q) => q.join(' ')).join('L')}Z`;
  R.reverse();
  return { d, L, R, N };
};

// Obelisk's right half (head to chest); the left half is its mirror.
const titan = 'M-1 -150Q8 -100 16 -70L54 -112Q46 -70 34 -40L36 0L30 30L14 54L40 62Q90 60 120 40L150 10Q196 -12 236 -74Q230 -16 208 36L282 -14Q262 48 248 88L316 76Q272 110 250 140Q268 220 262 300L262 420L-1 420Z';
const titanRim = 'M-1 -150Q8 -100 16 -70L54 -112Q46 -70 34 -40L36 0L30 30L14 54L40 62Q90 60 120 40L150 10Q196 -12 236 -74Q230 -16 208 36L282 -14Q262 48 248 88L316 76Q272 110 250 140Q268 220 262 300';

const scene = (t) => {
  const rand = rng(2207);
  const gold = t.accent;
  const goldHi = mix(gold, '#ffffff', 0.6);
  const goldLo = mix(gold, '#000000', 0.55);
  const goldEdge = mix(gold, '#000000', 0.3);
  const red = t.self;
  const redHi = mix(red, '#ffffff', 0.35);
  const redLo = mix(red, '#000000', 0.6);
  const blue = t.opp;

  // Carved registers of the temple wall.
  const glyphs = ['M-8 -10A8 8 0 1 1 8 -10L0 -2ZM0 -2V14M-9 4H9', 'M-10 0Q0 -10 10 0Q0 8 -10 0Z', 'M-10 -4Q-5 -10 0 -4T10 -4M-10 6Q-5 0 0 6T10 6', 'M-6 12V-12L6 -6L-6 0', 'M-10 10H10M-6 10V-8H6V10', 'M-2 -12Q8 -12 8 -2Q8 8 -2 8Q-10 8 -10 0', 'M0 -12V12M-8 -4L0 -12L8 -4'];
  let wall = '';
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 26; c++) wall += `<path transform="translate(${n1(40 + c * 60 + (r % 2) * 30)} ${200 + r * 96})" d="${glyphs[Math.floor(rand() * glyphs.length)]}"/>`;
  }
  let registers = '';
  for (let r = 0; r < 8; r++) registers += `M0 ${150 + r * 96}H${W}`;

  // Divine light falling from the upper right.
  let beams = '';
  for (let i = 0; i < 6; i++) {
    const x = 300 + i * 240 + rand() * 60;
    beams += `<path d="M${n1(x)} 0L${n1(x + 70)} 0L${n1(x - 200)} ${H}L${n1(x - 360)} ${H}Z" ${anim('pulse', n1(7 + rand() * 5), rand() * 6, 'ease-in-out')}/>`;
  }

  // Soft cloud banks.
  const cloud = (x, y, rx, ry, fill, d) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${anim('drift', d, d / 3, 'ease-in-out')}/>`;

  // Ra: raised wings of layered feathers, a beaked head, an armoured chest.
  const raX = 1290;
  const raY = 380;
  const feather = (bx, by, ang, len, wid) => {
    const [tx, ty] = polar(bx, by, len, ang);
    const [lx, ly] = polar(bx, by, len * 0.45, ang - wid);
    const [rx, ry] = polar(bx, by, len * 0.45, ang + wid);
    return `<path d="M${n1(bx)} ${n1(by)}Q${lx} ${ly} ${tx} ${ty}Q${rx} ${ry} ${n1(bx)} ${n1(by)}Z"/>`;
  };
  const wing = (dir, k) => {
    const S = [raX - 20 * dir, raY - 60];
    const E = [raX - 100 * dir * k, raY - 170 * k];
    const Wr = [raX - 150 * dir * k, raY - 300 * k];
    const on = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
    const turn = (deg) => (dir > 0 ? deg : 180 - deg);
    let back = '';
    let front = '';
    // Primaries fan up and out from the wrist, secondaries sweep down.
    for (let i = 0; i < 7; i++) {
      const f = i / 6;
      const [bx, by] = on(Wr, E, f * 0.9);
      back += feather(bx, by, turn(250 - f * 70), (230 - f * 60) * k, 13);
      front += feather(bx, by, turn(244 - f * 70), (170 - f * 50) * k, 15);
    }
    for (let i = 0; i < 6; i++) {
      const f = i / 5;
      const [bx, by] = on(E, S, f * 0.85);
      back += feather(bx, by, turn(170 - f * 40), (150 - f * 40) * k, 14);
      front += feather(bx, by, turn(166 - f * 40), (110 - f * 30) * k, 16);
    }
    const arm = `M${S[0]} ${S[1]}Q${n1(E[0] + 30 * dir)} ${n1(E[1] - 10)} ${n1(Wr[0])} ${n1(Wr[1])}Q${n1(E[0] + 12 * dir)} ${n1(E[1] + 10)} ${S[0]} ${S[1] + 22}Z`;
    return `<g fill="url(#dbtefx-dv-gold2)" stroke="${goldEdge}" stroke-width="1">${back}</g><g fill="url(#dbtefx-dv-gold)" stroke="${goldEdge}" stroke-width="1">${front}</g><path d="${arm}" fill="url(#dbtefx-dv-gold)" stroke="${goldLo}" stroke-width="2"/><path d="M${S[0]} ${S[1]}Q${n1(E[0] + 30 * dir)} ${n1(E[1] - 10)} ${n1(Wr[0])} ${n1(Wr[1])}" fill="none" stroke="${goldHi}" stroke-width="3"/><circle cx="${n1(E[0])}" cy="${n1(E[1])}" r="${n1(12 * k)}" fill="url(#dbtefx-dv-gold)" stroke="${goldLo}" stroke-width="2"/>`;
  };
  const raBody = ribbon(sample([[[raX - 4, raY - 90], [raX + 36, raY - 30], [raX + 40, raY + 50], [raX + 6, raY + 100]], [[raX + 6, raY + 100], [raX - 14, raY + 130], [raX + 6, raY + 170], [raX + 44, raY + 160]]], 12), 96, 14);
  const raNeck = ribbon(sample([[[raX, raY - 70], [raX - 4, raY - 120], [raX - 30, raY - 150], [raX - 26, raY - 196]]], 10), 56, 36);
  let plates = '';
  raBody.L.forEach((q, i) => {
    if (i % 3 || i > 7) return;
    const r = raBody.R[i];
    plates += `M${q.join(' ')}Q${n1((q[0] + r[0]) / 2 - 8)} ${n1((q[1] + r[1]) / 2 + 12)} ${r.join(' ')}`;
  });
  let sunRays = '';
  for (let i = 0; i < 24; i++) {
    const [x1, y1] = polar(raX, raY - 150, 160, i * 15 - 3);
    const [x2, y2] = polar(raX, raY - 150, 160, i * 15 + 3);
    const [x3, y3] = polar(raX, raY - 150, i % 2 ? 250 : 330, i * 15);
    sunRays += `<path d="M${x1} ${y1}L${x3} ${y3}L${x2} ${y2}Z"/>`;
  }

  // Slifer: a tapering coil with dorsal spikes and a ribbed belly.
  const sp = sample([
    [[1196, 620], [1260, 600], [1330, 610], [1400, 660]],
    [[1400, 660], [1470, 710], [1470, 800], [1380, 820]],
    [[1380, 820], [1290, 840], [1220, 780], [1130, 800]],
    [[1130, 800], [1040, 820], [980, 880], [900, 940]],
  ], 14);
  const sl = ribbon(sp, 74, 18);
  let spikes = '';
  let ribs = '';
  sp.forEach((p, i) => {
    const [nx, ny, w] = sl.N[i];
    if (i % 4 === 2 && i < sp.length - 3) {
      const a = sl.R[i - 1];
      const b = sl.R[i + 1];
      const len = 10 + w * 0.5;
      spikes += `M${a.join(' ')}L${n1(p[0] - nx * (w + len) - (b[0] - a[0]) * 1.2)} ${n1(p[1] - ny * (w + len) - (b[1] - a[1]) * 1.2)}L${b.join(' ')}Z`;
    }
    if (i % 2 === 0) ribs += `M${n1(p[0] + nx * w * 0.1)} ${n1(p[1] + ny * w * 0.1)}L${sl.L[i].join(' ')}`;
  });
  const hl = ribbon(sp.map((p, i) => [p[0] - sl.N[i][0] * sl.N[i][2] * 0.4, p[1] - sl.N[i][1] * sl.N[i][2] * 0.4]), 14, 3);
  const sHead = 'M0 -8C-16 -40 -64 -50 -98 -40C-120 -34 -148 -26 -176 -12C-170 -4 -160 -2 -150 -2L-62 2L-152 32C-150 40 -142 44 -136 42L-62 28L-112 60C-108 66 -102 70 -96 68L-30 50C-14 46 0 30 0 -8Z';
  const belly = ribbon(sp.map((p, i) => [p[0] + sl.N[i][0] * sl.N[i][2] * 0.5, p[1] + sl.N[i][1] * sl.N[i][2] * 0.5]), 37, 9);
  const sMaw = 'M-60 0L-150 -4L-150 30L-60 26ZM-60 26L-110 58L-30 48Z';
  const sHorns = 'M-74 -40Q-40 -120 26 -156Q-16 -104 -40 -34ZM-44 -36Q16 -104 96 -116Q26 -74 -12 -22ZM-18 -24Q50 -64 120 -54Q46 -34 0 -6ZM-4 -4Q60 -8 108 14Q44 12 4 14ZM-30 44Q0 82 34 98Q4 60 -6 36Z';
  const sTeeth = 'M-140 -4L-134 8L-128 -3ZM-118 -3L-113 7L-108 -2ZM-96 -2L-92 6L-88 -1ZM-136 30L-130 20L-124 29ZM-112 28L-107 19L-102 27ZM-100 56L-95 48L-90 55Z';

  return `<defs>
<linearGradient id="dbtefx-dv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, gold, 0.14)}" stop-opacity="0.95"/><stop offset="0.5" stop-color="${t.bg}" stop-opacity="0.9"/><stop offset="1" stop-color="${mix(t.bg, red, 0.12)}" stop-opacity="0.95"/></linearGradient>
<linearGradient id="dbtefx-dv-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${goldHi}" stop-opacity="0.13"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-dv-titan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, blue, 0.3)}"/><stop offset="0.5" stop-color="${mix(t.bg, blue, 0.12)}" stop-opacity="0.9"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-dv-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(blue, '#ffffff', 0.45)}" stop-opacity="0.9"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-dv-eye"><stop offset="0" stop-color="#ffffff"/><stop offset="0.25" stop-color="${blue}" stop-opacity="0.85"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dv-sun"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.3" stop-color="${goldHi}" stop-opacity="0.8"/><stop offset="0.65" stop-color="${gold}" stop-opacity="0.28"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dv-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldHi}"/><stop offset="0.45" stop-color="${gold}"/><stop offset="1" stop-color="${mix(gold, '#000000', 0.35)}"/></linearGradient>
<linearGradient id="dbtefx-dv-gold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${gold}"/><stop offset="1" stop-color="${goldLo}"/></linearGradient>
<linearGradient id="dbtefx-dv-red" gradientUnits="userSpaceOnUse" x1="1150" y1="600" x2="1400" y2="900"><stop offset="0" stop-color="${redHi}"/><stop offset="0.4" stop-color="${red}"/><stop offset="1" stop-color="${redLo}"/></linearGradient>
<linearGradient id="dbtefx-dv-head" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="${redHi}"/><stop offset="0.55" stop-color="${red}"/><stop offset="1" stop-color="${redLo}"/></linearGradient>
<radialGradient id="dbtefx-dv-maw"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.3" stop-color="${gold}" stop-opacity="0.75"/><stop offset="1" stop-color="${red}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dv-cloud"><stop offset="0" stop-color="${mix(t.bg, gold, 0.22)}" stop-opacity="0.9"/><stop offset="1" stop-color="${mix(t.bg, gold, 0.22)}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dv-cloud2"><stop offset="0" stop-color="${mix(t.bg, gold, 0.4)}" stop-opacity="0.95"/><stop offset="0.6" stop-color="${mix(t.bg, gold, 0.25)}" stop-opacity="0.6"/><stop offset="1" stop-color="${mix(t.bg, gold, 0.2)}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dv-goldfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${goldHi}"/><stop offset="0.3" stop-color="${gold}"/><stop offset="0.75" stop-color="${gold}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-dv-sky)"/>
<g fill="none" stroke="${gold}" stroke-opacity="0.07" stroke-width="3" stroke-linecap="round">${wall}</g>
<path d="${registers}" stroke="${gold}" stroke-opacity="0.1" stroke-width="2"/>
<g fill="url(#dbtefx-dv-beam)">${beams}</g>
<g transform="translate(780 160) scale(1.1)">
<path d="${titan}" fill="url(#dbtefx-dv-titan)"/><path d="${titan}" fill="url(#dbtefx-dv-titan)" transform="scale(-1 1)"/>
<g fill="none" stroke="url(#dbtefx-dv-rim)" stroke-width="3" stroke-linejoin="round"><path d="${titanRim}"/><path d="${titanRim}" transform="scale(-1 1)"/></g>
<path d="M-28 -8L-8 -2L-10 6L-30 1ZM28 -8L8 -2L10 6L30 1Z" fill="#ffffff"/>
<circle cx="-19" cy="-1" r="30" fill="url(#dbtefx-dv-eye)" ${anim('pulse', 4, 0, 'ease-in-out')}/><circle cx="19" cy="-1" r="30" fill="url(#dbtefx-dv-eye)" ${anim('pulse', 4, 0, 'ease-in-out')}/>
</g>
${cloud(760, 560, 520, 90, 'url(#dbtefx-dv-cloud)', 18)}${cloud(300, 640, 380, 70, 'url(#dbtefx-dv-cloud)', 22)}${cloud(1100, 660, 420, 80, 'url(#dbtefx-dv-cloud)', 20)}
<!--mid-->
<g fill="${gold}" fill-opacity="0.2" style="transform-origin: ${raX}px ${raY - 150}px; animation: dbtefx-spin 120s linear infinite;">${sunRays}</g>
<circle cx="${raX}" cy="${raY - 150}" r="250" fill="url(#dbtefx-dv-sun)" ${anim('bloom', 6, 0, 'ease-in-out')}/>
<circle cx="${raX}" cy="${raY - 150}" r="150" fill="none" stroke="${goldHi}" stroke-opacity="0.5" stroke-width="2"/>
<g style="transform-origin: ${raX + 20}px ${raY - 60}px; animation: dbtefx-dv-flap 7s ease-in-out -3.5s infinite;">${wing(-1, 0.82)}</g>
<path d="${raBody.d}" fill="url(#dbtefx-dv-goldfade)"/>
<path d="${plates}" fill="none" stroke="${goldLo}" stroke-width="2.5"/>
<g style="transform-origin: ${raX - 20}px ${raY - 60}px; animation: dbtefx-dv-flap 7s ease-in-out infinite;">${wing(1, 1)}</g>
<path d="${raNeck.d}" fill="url(#dbtefx-dv-gold)" stroke="${goldLo}" stroke-width="2" stroke-linejoin="round"/>
<g transform="translate(${raX - 20} ${raY - 210}) scale(1.75)" stroke="${goldLo}" stroke-width="1.6" stroke-linejoin="round">
<path d="M6 -6L72 -50L46 -12L88 -24L44 6L80 12L30 14Z" fill="url(#dbtefx-dv-gold2)"/>
<path d="M18 2C14 -30 -30 -40 -56 -22L-94 -6L-72 2L-82 14L-50 10C-30 22 4 22 18 2Z" fill="url(#dbtefx-dv-gold)"/>
<path d="M-56 -22L-60 -44L-38 -28Z" fill="url(#dbtefx-dv-gold)"/>
<path d="M-28 -16L-14 -18L-19 -10Z" fill="#ffffff" stroke="none" ${anim('pulse', 3, 0, 'ease-in-out')}/>
</g>
<ellipse cx="${raX + 30}" cy="${raY + 190}" rx="280" ry="70" fill="url(#dbtefx-dv-cloud2)" ${anim('drift', 16, 4, 'ease-in-out')}/>
<style>@keyframes dbtefx-dv-flap { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-4deg) scale(1.02); } }
@keyframes dbtefx-dv-roar { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-3deg); } }</style>
<!--near-->
<g transform="translate(96 10)">
<path d="${sl.d}" fill="url(#dbtefx-dv-red)" stroke="${redLo}" stroke-width="3" stroke-linejoin="round"/>
<path d="${spikes}" fill="${red}" stroke="${redLo}" stroke-width="2" stroke-linejoin="round"/>
<path d="${belly.d}" fill="${redLo}" fill-opacity="0.55"/>
<path d="${ribs}" stroke="${redLo}" stroke-width="3" stroke-opacity="0.8"/>
<path d="${hl.d}" fill="${redHi}" fill-opacity="0.35"/>
<g transform="translate(1200 616) rotate(-12) scale(1.15)">
<g style="animation: dbtefx-dv-roar 5s ease-in-out infinite;">
<path d="${sHorns}" fill="url(#dbtefx-dv-head)" stroke="${redLo}" stroke-width="2" stroke-linejoin="round"/>
<path d="${sHead}" fill="url(#dbtefx-dv-head)" stroke="${redLo}" stroke-width="3" stroke-linejoin="round"/>
<path d="${sMaw}" fill="${redLo}"/>
<path d="${sTeeth}" fill="#ffffff" fill-opacity="0.92"/>
<path d="M-104 -38Q-80 -30 -60 -36" fill="none" stroke="${redHi}" stroke-width="3"/>
<path d="M-92 -26L-74 -30L-80 -21Z" fill="#ffffff"/>
<circle cx="-52" cy="-30" r="8" fill="${t.accent2}" stroke="#ffffff" stroke-width="1.5"/>
<circle cx="-120" cy="14" r="46" fill="url(#dbtefx-dv-maw)" ${anim('pulse', 2.6, 0, 'ease-in-out')}/>
</g>
</g>
</g>`;
};

export default scene;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ember', count: 70, colors: ['accent', 'warning'], speed: 0.6 },
  { kind: 'mote', count: 30, colors: ['opp', 'accent'] },
  { kind: 'flash', count: 1, colors: ['accent'] },
];
