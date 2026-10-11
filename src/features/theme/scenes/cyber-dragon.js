import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, W } from './kit.js';

// Cyber Dragon: a chrome serpent coiled up the right edge, armour rings
// cel-shaded like polished steel, a photon-cyan core set in its chest and a
// visor eye. A glint runs down the coil from head to tail: the signature move.

const pt = (p) => `${n1(p[0])} ${n1(p[1])}`;
const poly = (ps) => `M${ps.map(pt).join('L')}Z`;

// Catmull-Rom spine through the control points, resampled every `step` px of arc.
const spine = (ctrl, step) => {
  const dense = [];
  for (let i = 0; i < ctrl.length - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)];
    const p1 = ctrl[i];
    const p2 = ctrl[i + 1];
    const p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
    for (let k = 0; k < 24; k++) {
      const s = k / 24;
      const s2 = s * s;
      const s3 = s2 * s;
      dense.push([0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * s + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * s2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * s3)));
    }
  }
  dense.push(ctrl[ctrl.length - 1]);
  const out = [dense[0]];
  let acc = 0;
  for (let i = 1; i < dense.length; i++) {
    acc += Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]);
    if (acc >= step) {
      out.push(dense[i]);
      acc = 0;
    }
  }
  return out;
};

const cyberDragon = (t) => {
  const deep = mix(t.bg, '#000000', 0.45);
  const steelHi = mix(t.text, '#ffffff', 0.5);
  const steelLt = mix(t.muted, t.text, 0.45);
  const steelMd = mix(t.border, t.muted, 0.45);
  const steelDk = mix(t.bg, t.border, 0.55);
  const steelRf = mix(t.border, t.accent, 0.35);
  const seam = mix(t.bg, '#000000', 0.5);
  const photon = mix(t.accent, '#ffffff', 0.55);

  // The coil: tail enters bottom right, loops low, rises up the right edge into the neck.
  const ctrl = [[1560, 950], [1460, 850], [1290, 838], [1170, 762], [1162, 640], [1272, 564], [1404, 530], [1462, 430], [1420, 336], [1350, 284], [1322, 262]];
  const sp = spine(ctrl, 30);
  const last = sp.length - 1;
  const width = (i) => {
    const s = i / last;
    return s < 0.5 ? 30 + (s / 0.5) * 84 : 114 - ((s - 0.5) / 0.5) * 28;
  };
  let body = '';
  let glints = '';
  let spikes = '';
  for (let i = 0; i < last; i++) {
    const a = sp[i];
    const b = sp[i + 1];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const tx = dx / len;
    const ty = dy / len;
    // A fixed normal (left of travel); k says how much it faces the key light (upper left),
    // so the specular stripe slides smoothly across the tube as the coil turns.
    const nx = -ty;
    const ny = tx;
    const k = nx * -0.45 + ny * -0.89;
    const w0 = width(i) / 2;
    const w1 = width(i + 1) / 2;
    // Plates overlap toward the head; the leading edge is a chevron pointing forward.
    const e = [b[0] + tx * 6, b[1] + ty * 6];
    const at = (p, w, f, fwd = 0) => [p[0] + nx * w * f + tx * fwd, p[1] + ny * w * f + ty * fwd];
    const chev = (f) => (1 - Math.abs(f)) * 12;
    const band = (f0, f1, c, o = 1) => {
      const lo = Math.max(-1, Math.min(1, f0));
      const hi = Math.max(-1, Math.min(1, f1));
      if (Math.abs(hi - lo) < 0.02 || o < 0.04) return;
      body += `<path d="${poly([at(a, w0, lo), at(e, w1, lo, chev(lo)), at(e, w1, hi, chev(hi)), at(a, w0, hi)])}" fill="${c}"${o < 1 ? ` fill-opacity="${n1(o * 10) / 10}"` : ''}/>`;
    };
    const c = 0.5 * k;
    const sgn = k >= 0 ? 1 : -1;
    band(1, -1, steelLt);
    band(-sgn, -sgn * 0.62, steelRf);
    band(-sgn * 0.62, -sgn * 0.3, steelMd);
    band(sgn, sgn * 0.84, steelMd);
    band(c + 0.2, c - 0.2, steelHi);
    band(c - sgn * 0.3, c - sgn * 0.44, steelDk, Math.min(1, Math.abs(k) * 1.6));
    // Seam at the leading edge of each ring with a lit bevel just behind it.
    body += `<path d="M${pt(at(e, w1, 1))}L${pt(at(e, w1, 0, 12))}L${pt(at(e, w1, -1))}" fill="none" stroke="${seam}" stroke-width="3"/><path d="M${pt(at(e, w1, 0.95, -4))}L${pt(at(e, w1, 0, 8))}" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>`;
    // A photon surge on every other ring, phased from head to tail.
    if (i % 2 === 1 && w0 > 10) {
      glints += `<path d="${poly([at(a, w0, 0.92), at(e, w1, 0.92, chev(0.92)), at(e, w1, 0, 12), at(e, w1, -0.92, chev(0.92)), at(a, w0, -0.92)])}" fill="${photon}" style="opacity: 0; animation: dbtefx-cd-glint 7s ease-in-out ${n1(-(last - i) * 0.07)}s infinite;"/>`;
    }
    // Dorsal blades along the upper body and neck, raked back toward the tail.
    if (i > last * 0.76 && i % 2 === 0) {
      const base = at(a, w0, 1);
      const tip = [base[0] + nx * 34 - tx * 30, base[1] + ny * 34 - ty * 30];
      spikes += `<path d="${poly([at(a, w0, 0.9, 10), tip, at(a, w0, 0.9, -14)])}" fill="${steelLt}"/><path d="${poly([at(a, w0, 0.9, 10), tip, at(a, w0, 0.9, -2)])}" fill="${steelHi}"/>`;
    }
  }

  // Head in local coordinates facing left, origin at the neck joint: crown, cheek
  // and underside planes, a recessed visor, swept-back blade, hinged lower jaw.
  const jaw = 'M-30 24L-236 44L-258 56L-240 72L-70 78L-14 56Z';
  const head = `
<path d="M-34 -50L104 -122L66 -76L120 -80L20 -14Z" fill="${steelMd}"/><path d="M-34 -50L104 -122L40 -54Z" fill="${steelHi}"/>
<path d="M-6 -60L70 -110L40 -66Z" fill="${steelLt}"/>
<g style="transform-origin: -30px 26px; transform: rotate(-12deg); animation: dbtefx-cd-jaw 7s ease-in-out infinite;">
<path d="M-30 24L-250 46L-262 -70L-30 -70Z" fill="${mix(seam, t.accent, 0.12)}"/><path d="${jaw}" fill="${steelMd}"/><path d="M-258 56L-240 72L-70 78L-14 56L-60 58L-200 62Z" fill="${steelDk}"/>
<path d="M-222 44l9 -22l8 20ZM-186 40l8 -19l7 17ZM-146 36l7 -15l6 13ZM-106 32l6 -12l5 11Z" fill="${steelHi}"/>
</g>
<path d="M10 -40L-40 -70L-120 -76L-252 -32L-304 -10L-286 6L-160 16L-60 22L10 30Z" fill="${steelMd}"/>
<path d="M10 -40L-40 -70L-120 -76L-252 -32L-304 -10L-252 -20L-130 -52L-50 -52L10 -28Z" fill="${steelHi}"/><path d="M-252 -20L-130 -52L-50 -52L10 -28L10 -10L-60 -30L-140 -30L-270 -4Z" fill="${steelLt}"/>
<path d="M-304 -10L-286 6L-160 16L-60 22L10 30L10 40L-60 32L-160 26L-276 18Z" fill="${steelDk}"/>
<path d="M-286 6L-266 30L-258 8ZM-246 10L-232 32L-224 11ZM-206 13L-194 31L-188 14Z" fill="${steelHi}"/>
<circle cx="-146" cy="-30" r="44" fill="url(#dbtefx-cd-eye)" ${anim('pulse', 3.5, 0, 'ease-in-out')}/>
<path d="M-96 -48L-196 -24L-186 -12L-104 -30Z" fill="${seam}"/>
<path d="M-108 -40L-184 -22L-180 -17L-110 -33Z" fill="${photon}"/>
<path d="M-80 -62L-206 -28L-194 -24L-92 -50Z" fill="${steelHi}"/>
<path d="M-264 -20L-236 -26M-258 -12L-232 -18" stroke="${seam}" stroke-width="2.5"/>
<path d="M-52 -26L-6 -32L12 8L-36 14Z" fill="${steelMd}"/><circle cx="-38" cy="-18" r="3.5" fill="${steelHi}"/><circle cx="-6" cy="-22" r="3.5" fill="${steelHi}"/><circle cx="-26" cy="6" r="3.5" fill="${steelHi}"/>
<path d="M-250 -6L-70 -20M-240 2L-70 -6M-200 8L-70 8" stroke="#ffffff" stroke-opacity="0.16" stroke-width="1.5"/>
<path d="M-60 -50L-60 22M-214 -30L-214 12" stroke="${seam}" stroke-width="2" stroke-opacity="0.6"/>`;

  // Core gem set in the chest where the neck leaves the coil.
  const gi = Math.round(last * 0.68);
  const [gx, gy] = sp[gi];
  const gr = n1((Math.atan2(sp[gi + 1][1] - gy, sp[gi + 1][0] - gx) * 180) / Math.PI);

  // Speed rays from behind the head, very faint, the card art's backdrop.
  let rays = '';
  for (let i = 0; i < 18; i++) {
    const deg = 180 + i * 10;
    const r0 = 120;
    const r1 = 1600;
    const a0 = ((deg - 1.4) * Math.PI) / 180;
    const a1 = ((deg + 1.4) * Math.PI) / 180;
    rays += `<path d="M${n1(1300 + Math.cos(a0) * r0)} ${n1(300 + Math.sin(a0) * r0)}L${n1(1300 + Math.cos(a0) * r1)} ${n1(300 + Math.sin(a0) * r1)}L${n1(1300 + Math.cos(a1) * r1)} ${n1(300 + Math.sin(a1) * r1)}Z"/>`;
  }

  return `<style>
@keyframes dbtefx-cd-glint { 0%, 12%, 100% { opacity: 0; } 4% { opacity: 0.6; } }
@keyframes dbtefx-cd-jaw { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(-17deg); } }
@keyframes dbtefx-cd-rear { 0%, 100% { transform: rotate(0deg) translate(0, 0); } 50% { transform: rotate(-3deg) translate(-4px, -6px); } }
</style>
<defs>${glow('dbtefx-cd-back', t.accent, 0.5, 0.5, 0.5, 0.32)}${glow('dbtefx-cd-core', photon, 0.5, 0.5, 0.5, 0.95)}${glow('dbtefx-cd-eye', t.accent, 0.5, 0.5, 0.5, 0.7)}
<linearGradient id="dbtefx-cd-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.accent, 0.08)}"/><stop offset="1" stop-color="${deep}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-cd-sky)"/>
<g fill="${t.accent}" fill-opacity="0.04">${rays}</g>
<ellipse cx="1320" cy="420" rx="520" ry="520" fill="url(#dbtefx-cd-back)"/>
<!--mid-->
<g>${body}</g>
<g>${glints}</g>
<g>${spikes}</g>
<circle cx="${n1(gx)}" cy="${n1(gy)}" r="70" fill="url(#dbtefx-cd-core)" ${anim('bloom', 3.5, 0, 'ease-in-out')}/>
<g transform="translate(${n1(gx)} ${n1(gy)}) rotate(${gr})"><path d="M-44 0L-18 -30L18 -30L44 0L18 30L-18 30Z" fill="${steelHi}"/><path d="M-44 0L-18 30L18 30L44 0Z" fill="${steelMd}"/><path d="M-32 0L-13 -21L13 -21L32 0L13 21L-13 21Z" fill="${seam}"/>
<circle r="17" fill="${t.accent}"/><circle cx="-5" cy="-6" r="6" fill="#ffffff" fill-opacity="0.85"/></g>
<g transform="translate(${n1(sp[last][0] + 4)} ${n1(sp[last][1] - 4)}) rotate(4)"><g style="animation: dbtefx-cd-rear 7s ease-in-out infinite;">${head}</g></g>
<!--near-->`;
};

export default cyberDragon;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'spark', count: 18, colors: ['accent2'], speed: 0.5 },
  { kind: 'mote', count: 26, colors: ['accent'] },
];
