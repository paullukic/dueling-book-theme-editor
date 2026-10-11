import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, star, W } from './kit.js';

// Dragon Ball: a rocky wasteland of buttes under a violet sky. A great amber
// four-star orb hangs in a golden ki aura, the other six orbs ringed around
// it and lighting up in turn, rocks lifting off the ground in the power-up.
// The shader draws the sky and the aura's rising flame.
const C = [1210, 470];
const R = 138;

const dragonBall = (t) => {
  const r = rng(5);
  const ink = mix(t.bg, '#000000', 0.5);
  const amber = t.accent;
  const gold = t.accent2;
  const red = t.danger;
  const haze = mix(t.bg, mix(t.accent, t.danger, 0.4), 0.35);
  const rock = mix(mix(t.bg, t.accent, 0.22), t.muted, 0.12);

  // A glass orb with n red stars: amber body lit from within, a bright
  // caustic crescent at the foot, a soft window highlight and a hard glint.
  const STARS = {
    1: [[0, 0]],
    2: [[-0.3, -0.1], [0.3, 0.1]],
    3: [[0, -0.32], [-0.3, 0.2], [0.3, 0.2]],
    4: [[0, -0.38], [-0.36, 0], [0.36, 0], [0, 0.38]],
    5: [[0, -0.38], [-0.36, -0.1], [0.36, -0.1], [-0.22, 0.32], [0.22, 0.32]],
    6: [[-0.22, -0.34], [0.22, -0.34], [-0.4, 0], [0.4, 0], [-0.22, 0.34], [0.22, 0.34]],
    7: [[0, 0], [0, -0.42], [-0.38, -0.2], [0.38, -0.2], [-0.38, 0.22], [0.38, 0.22], [0, 0.42]],
  };
  const orb = (cx, cy, rad, n) => {
    const stars = STARS[n].map(([sx, sy]) => {
      const d = Math.hypot(sx, sy);
      const k = 1 - d * 0.35;
      return `<path d="${star(n1(cx + sx * rad), n1(cy + sy * rad), n1(rad * 0.2 * k))}" fill="${red}" stroke="${mix(red, ink, 0.4)}" stroke-width="${n1(rad * 0.012)}" stroke-linejoin="round"/>`;
    }).join('');
    return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="url(#dbtefx-db-glass)"/>
<ellipse cx="${cx}" cy="${n1(cy + rad * 0.52)}" rx="${n1(rad * 0.62)}" ry="${n1(rad * 0.3)}" fill="url(#dbtefx-db-caustic)"/>
${stars}
<circle cx="${cx}" cy="${cy}" r="${rad}" fill="url(#dbtefx-db-rim)"/>
<path d="M${n1(cx - rad * 0.72)} ${n1(cy - rad * 0.2)}A${n1(rad * 0.76)} ${n1(rad * 0.76)} 0 0 1 ${n1(cx + rad * 0.1)} ${n1(cy - rad * 0.74)}A${n1(rad * 0.62)} ${n1(rad * 0.62)} 0 0 0 ${n1(cx - rad * 0.72)} ${n1(cy - rad * 0.2)}Z" fill="#ffffff" fill-opacity="0.38"/>
<ellipse cx="${n1(cx - rad * 0.38)}" cy="${n1(cy - rad * 0.5)}" rx="${n1(rad * 0.13)}" ry="${n1(rad * 0.07)}" transform="rotate(-38 ${n1(cx - rad * 0.38)} ${n1(cy - rad * 0.5)})" fill="#ffffff" fill-opacity="0.9"/>
<circle cx="${cx}" cy="${cy}" r="${n1(rad - 1)}" fill="none" stroke="${mix(amber, ink, 0.55)}" stroke-width="${n1(Math.max(1.5, rad * 0.025))}"/>`;
  };

  // The six other orbs on an arc around the hero, each glowing in turn.
  const ring = [[200, 1], [228, 2], [256, 3], [292, 5], [320, 6], [346, 7]].map(([a, n], i) => {
    const [x, y] = [n1(C[0] + Math.cos((a * Math.PI) / 180) * 222), n1(C[1] + Math.sin((a * Math.PI) / 180) * 300)];
    const rad = 24 + (i % 3) * 3;
    return `<circle cx="${x}" cy="${y}" r="${rad * 2.6}" fill="url(#dbtefx-db-halo)" style="animation: dbtefx-db-call 6s ease-in-out ${n1(-6 + i)}s infinite;"/><g ${anim('bob', n1(5 + i * 0.6), i, 'ease-in-out')}>${orb(x, y, rad, n)}</g>`;
  }).join('');

  // Buttes: flat-topped mesas in hazy depths; the flank facing the aura
  // catches its gold, horizontal strata band the faces.
  const buttes = (base, count, hMin, hMax, fill, lip, seed) => {
    const br = rng(seed);
    let d = '';
    let lit = '';
    let tops = '';
    let bands = '';
    for (let i = 0; i < count; i++) {
      const x = 40 + (i + br() * 0.6) * (W / count);
      const w = 70 + br() * 150;
      const h = hMin + br() * (hMax - hMin);
      const top = base - h;
      const sl = 3 + br() * 6;
      const [l, rr] = [x - w / 2, x + w / 2];
      d += `M${n1(l - sl * 6)} ${base}L${n1(l - sl)} ${n1(base - h * 0.18)}L${n1(l)} ${n1(top + 8)}L${n1(l + 6)} ${n1(top)}H${n1(x + w * 0.1)}L${n1(x + w * 0.14)} ${n1(top + 6)}H${n1(rr - 4)}L${n1(rr)} ${n1(top + 10)}L${n1(rr + sl)} ${n1(base - h * 0.2)}L${n1(rr + sl * 7)} ${base}Z`;
      lit += `M${n1(rr - w * 0.18)} ${n1(top + 2)}H${n1(rr - 4)}L${n1(rr)} ${n1(top + 10)}L${n1(rr + sl)} ${n1(base - h * 0.2)}L${n1(rr + sl * 7)} ${base}H${n1(rr - w * 0.12)}Z`;
      tops += `M${n1(l + 6)} ${n1(top + 1)}H${n1(rr - 4)}`;
      for (let k = 1; k < 3; k++) {
        const y = top + (h * k) / 3.4;
        bands += `M${n1(l + 2)} ${n1(y)}H${n1(rr - 2)}`;
      }
    }
    return `<path d="${d}" fill="${fill}"/><path d="${lit}" fill="${lip}" fill-opacity="0.32"/><path d="${bands}" stroke="${ink}" stroke-opacity="0.18" stroke-width="3"/><path d="${tops}" stroke="${lip}" stroke-width="2.5"/>`;
  };

  // A chunk of rock: an irregular polygon with a lit upper face.
  const chunk = (cx, cy, s, seed) => {
    const cr = rng(seed);
    const pts = [];
    for (let i = 0; i < 7; i++) pts.push(polar(cx, cy, s * (0.7 + cr() * 0.45), i * (360 / 7) + cr() * 20));
    const d = `M${pts.map((p) => p.join(' ')).join('L')}Z`;
    const top = `M${pts[4].join(' ')}L${pts[5].join(' ')}L${pts[6].join(' ')}L${n1(cx)} ${n1(cy - s * 0.1)}Z`;
    return `<path d="${d}" fill="${rock}"/><path d="${top}" fill="${mix(rock, gold, 0.35)}"/><path d="${d}" fill="none" stroke="${ink}" stroke-opacity="0.5" stroke-width="1.5"/>`;
  };
  const lift = (x, y, s, seed, dur, delay) => `<g style="animation: dbtefx-db-lift ${dur}s ease-in-out ${-delay}s infinite;">${chunk(x, y, s, seed)}</g>`;

  // Ki lightning crackling around the aura, flashing rarely.
  let bolts = '';
  [[1050, 300, 3, 0], [1380, 560, 9, 3.8]].forEach(([x, y, seed, delay]) => {
    const lr = rng(seed);
    let d = `M${x} ${y}`;
    let [px, py] = [x, y];
    for (let i = 0; i < 6; i++) {
      px += (lr() - 0.3) * 40;
      py += (lr() - 0.5) * 50 + 16;
      d += `L${n1(px)} ${n1(py)}`;
    }
    bolts += `<path d="${d}" fill="none" stroke="${mix(gold, '#ffffff', 0.6)}" stroke-width="2.4" stroke-linejoin="bevel" style="animation: dbtefx-db-bolt 7s linear ${-delay}s infinite;"/>`;
  });

  // Craters pocking the plain.
  let craters = '';
  [[260, 800, 90], [700, 770, 50], [1500, 830, 70]].forEach(([x, y, w]) => {
    craters += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${n1(w * 0.18)}" fill="${ink}" fill-opacity="0.3"/><path d="M${x - w} ${y}A${w} ${n1(w * 0.18)} 0 0 0 ${x + w} ${y}" fill="none" stroke="${mix(rock, gold, 0.3)}" stroke-opacity="0.5" stroke-width="2"/>`;
  });

  return `<style>@keyframes dbtefx-db-call { 0%, 70%, 100% { opacity: 0.15; transform: scale(0.8); } 80% { opacity: 1; transform: scale(1.1); } }
@keyframes dbtefx-db-hover { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes dbtefx-db-lift { 0% { transform: translateY(0); } 50% { transform: translateY(-30px); } 100% { transform: translateY(0); } }
@keyframes dbtefx-db-shock { 0% { transform: scale(0.3); opacity: 0; } 15% { opacity: 0.9; } 100% { transform: scale(1.9); opacity: 0; } }
@keyframes dbtefx-db-bolt { 0%, 88%, 93%, 100% { opacity: 0; } 89%, 92% { opacity: 1; } 90.5% { opacity: 0.2; } }</style>
<defs>
<linearGradient id="dbtefx-db-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.bg}" stop-opacity="0.6"/><stop offset="0.55" stop-color="${mix(t.bg, t.border, 0.5)}" stop-opacity="0.3"/><stop offset="0.72" stop-color="${haze}" stop-opacity="0.45"/><stop offset="0.73" stop-color="${haze}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-db-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(rock, t.bg, 0.4)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-db-glass" cx="0.5" cy="0.62" r="0.62"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.45)}"/><stop offset="0.45" stop-color="${mix(amber, gold, 0.45)}"/><stop offset="0.85" stop-color="${amber}"/><stop offset="1" stop-color="${mix(amber, red, 0.45)}"/></radialGradient>
<radialGradient id="dbtefx-db-rim" cx="0.5" cy="0.5" r="0.5"><stop offset="0.7" stop-color="${mix(amber, red, 0.6)}" stop-opacity="0"/><stop offset="1" stop-color="${mix(amber, red, 0.6)}" stop-opacity="0.75"/></radialGradient>
<radialGradient id="dbtefx-db-caustic"><stop offset="0" stop-color="#ffffff" stop-opacity="0.7"/><stop offset="0.5" stop-color="${gold}" stop-opacity="0.35"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-db-halo"><stop offset="0" stop-color="${gold}" stop-opacity="0.6"/><stop offset="0.4" stop-color="${amber}" stop-opacity="0.22"/><stop offset="1" stop-color="${amber}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-db-aura" cx="0.5" cy="0.5" r="0.5"><stop offset="0.55" stop-color="${gold}" stop-opacity="0.55"/><stop offset="0.75" stop-color="${gold}" stop-opacity="0.15"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-db-pool"><stop offset="0" stop-color="${gold}" stop-opacity="0.55"/><stop offset="0.5" stop-color="${amber}" stop-opacity="0.2"/><stop offset="1" stop-color="${amber}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-db-sky)"/>
${buttes(650, 8, 50, 120, mix(haze, t.bg, 0.45), mix(haze, gold, 0.35), 11)}
${buttes(700, 6, 120, 230, mix(rock, t.bg, 0.6), mix(rock, gold, 0.45), 13)}
<path d="M0 690Q400 676 800 690T1600 684V${H}H0Z" fill="url(#dbtefx-db-ground)"/>
${craters}
<ellipse cx="${C[0]}" cy="706" rx="330" ry="40" fill="url(#dbtefx-db-pool)"/>
<!--mid-->
<g style="transform-origin: ${C[0]}px 706px; animation: dbtefx-db-shock 4s ease-out infinite;"><ellipse cx="${C[0]}" cy="706" rx="200" ry="22" fill="none" stroke="${gold}" stroke-opacity="0.25" stroke-width="14"/><ellipse cx="${C[0]}" cy="706" rx="200" ry="22" fill="none" stroke="${mix(gold, '#ffffff', 0.4)}" stroke-opacity="0.7" stroke-width="3"/></g>
<g style="transform-origin: ${C[0]}px 706px; animation: dbtefx-db-shock 4s ease-out -2s infinite;"><ellipse cx="${C[0]}" cy="706" rx="200" ry="22" fill="none" stroke="${amber}" stroke-opacity="0.3" stroke-width="10"/></g>
<circle cx="${C[0]}" cy="${C[1]}" r="${R * 1.6}" fill="url(#dbtefx-db-aura)" ${anim('pulse', 1.2, 0, 'ease-in-out')}/>
${bolts}
${ring}
<g style="animation: dbtefx-db-hover 7s ease-in-out infinite;">${orb(C[0], C[1], R, 4)}</g>
<!--near-->
${lift(1060, 790, 34, 21, 6, 0)}${lift(1130, 850, 20, 23, 5, 1.5)}${lift(1400, 770, 28, 25, 7, 3)}${lift(1330, 850, 16, 27, 4.5, 2)}${lift(1210, 740, 12, 29, 5.5, 4)}
<path d="M-40 ${H}L-40 760L60 740L130 770L210 750L260 800L330 830L380 ${H}Z" fill="${mix(rock, t.bg, 0.6)}"/><path d="M60 740L130 770L210 750" fill="none" stroke="${mix(rock, gold, 0.4)}" stroke-width="2.5"/>
<path d="M1660 ${H}V780L1560 760L1500 800L1440 820L1400 ${H}Z" fill="${mix(rock, t.bg, 0.6)}"/><path d="M1660 780L1560 760L1500 800" fill="none" stroke="${mix(rock, gold, 0.4)}" stroke-width="2.5"/>`;
};

export default dragonBall;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ember', count: 34, colors: ['accent2', 'accent'], column: true, columnX: 0.76 },
  { kind: 'star', count: 40, colors: ['text'] },
];

// WebGL layer (shader.js): the violet sky and the golden ki aura in the
// scene's own 1600x900 frame: flame tongues rising in an egg-shaped envelope
// around the orb, hottest at its edge, over a slow churning sky.
export const shader = {
  uniforms: ['bg', 'border', 'accent', 'accent2', 'danger'],
  frag: `
void main() {
  float s = max(u_res.x / 1600.0, u_res.y / 900.0);
  vec2 vb = (gl_FragCoord.xy - 0.5 * u_res) / s;
  vb = vec2(vb.x + 800.0, 450.0 - vb.y);
  float k = clamp(vb.y / 680.0, 0.0, 1.0);
  vec3 haze = mix(u_bg, mix(u_accent, u_danger, 0.4), 0.35);
  vec3 col = mix(u_bg, mix(u_bg, u_border, 0.6), smoothstep(0.0, 0.8, k));
  col = mix(col, haze, smoothstep(0.6, 1.0, k));
  col += mix(u_border, u_danger, 0.3) * fbm(vec2(vb.x * 0.0018 + u_time * 0.006, vb.y * 0.004)) * 0.1;
  vec2 p = (vb - vec2(${C[0]}.0, ${C[1]}.0)) / ${R}.0;
  float t = u_time;
  float up = p.y < 0.0 ? 0.55 : 1.2;
  float env = length(vec2(p.x * 1.3, p.y * up));
  float f = fbm(vec2(p.x * 3.6, p.y * 0.9 + t * 2.0));
  float g = fbm(vec2(p.x * 7.0 + 3.0, p.y * 1.6 + t * 3.4));
  float edge = env + (f - 0.5) * 0.8 + (g - 0.5) * 0.3;
  float body = smoothstep(1.85, 1.6, edge);
  float tongue = smoothstep(1.85, 1.7, edge) * smoothstep(1.5, 1.7, edge);
  vec3 ki = mix(u_accent2, u_accent, 0.4);
  col = mix(col, ki * (0.95 + 0.35 * f), body * 0.88);
  col = mix(col, mix(u_accent2, vec3(1.0), 0.6), tongue * 0.8);
  col += u_accent * exp(-max(edge - 1.6, 0.0) * 4.0) * 0.18 * (1.0 - body);
  vec2 uv = gl_FragCoord.xy / u_res;
  col *= 1.0 - 0.5 * dot(uv - 0.5, uv - 0.5);
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
