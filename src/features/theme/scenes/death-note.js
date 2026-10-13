import { mix } from '../../../lib/color.js';
import { anim, H, n1, rng, W } from './kit.js';

// Death Note: the notebook falls from the shinigami realm to the human world.
// It hangs open in a shaft of cold light above night-time Tokyo: the black
// first page left bare (it sits under the menu feed), the ruled page
// beside it half full of handwritten names, a red ribbon trailing from the
// spine. One bitten red apple slips from the pages and falls. Torn pages drift down; storm
// clouds churn behind (shader).

// Joined-up handwriting along a ruled line: loops and strokes in words.
const script = (rand, x0, x1, y, size) => {
  let d = '';
  let x = x0;
  while (x < x1 - 18) {
    const letters = 3 + Math.floor(rand() * 6);
    d += `M${n1(x)} ${n1(y)}`;
    for (let i = 0; i < letters && x < x1 - 6; i++) {
      const w = size * (0.55 + rand() * 0.5);
      const tall = rand() < 0.22 ? size * 1.7 : size * (0.7 + rand() * 0.3);
      const dip = rand() < 0.1 ? size * 0.9 : 0;
      d += `C${n1(x + w * 0.1)} ${n1(y - tall)} ${n1(x + w * 0.7)} ${n1(y - tall)} ${n1(x + w * 0.45)} ${n1(y + dip)}`;
      x += w;
      d += `L${n1(x)} ${n1(y - size * 0.15)}`;
    }
    x += size * (1.2 + rand() * 1.4);
  }
  return d;
};

const scene = (t) => {
  const rand = rng(1107);
  const paperLit = mix(t.text, '#ffffff', 0.3);
  const paperDim = mix(t.text, t.bg, 0.55);
  const ink = mix(t.bg, '#000000', 0.3);
  const leather = mix(t.bg, '#000000', 0.5);
  const cold = t.accent2;
  const red = t.accent;

  // Right page: ruled paper with names, half full.
  let lines = '';
  let names = '';
  for (let i = 0; i < 17; i++) {
    const y = -92 + i * 12.4;
    lines += `M14 ${n1(y)}L166 ${n1(y + 1.5)}`;
    if (i > 0 && i < 7) names += script(rand, 20, i === 6 ? 90 : 160, y - 1.5, 4.6);
  }

  // Torn pages drifting down in the near plane.
  const scrap = (x, s, i) => {
    const w = 40 * s;
    const h = 28 * s;
    const rl = [0.3, 0.55, 0.8].map((f) => `M${n1(-w / 2 + 4)} ${n1(-h / 2 + h * f)}L${n1(w / 2 - 6)} ${n1(-h / 2 + h * f)}`).join('');
    return `<g transform="translate(${n1(x)} 0)"><g ${anim('fall', n1(19 + rand() * 9), i * 5.3 + rand() * 4, 'ease-in-out')}><path d="M${n1(-w / 2)} ${n1(-h / 2)}L${n1(w / 2)} ${n1(-h / 2 + 3)}L${n1(w / 2 - 3)} ${n1(h / 2 - 6)}L${n1(w / 4)} ${n1(h / 2)}L${n1(-w / 8)} ${n1(h / 2 - 4)}L${n1(-w / 2 + 2)} ${n1(h / 2)}Z" fill="${paperDim}" fill-opacity="0.5"/><path d="${rl}" stroke="${cold}" stroke-opacity="0.35" stroke-width="0.7"/></g></g>`;
  };

  // Night-time Tokyo far below: two rows of blocks (the far row paler in
  // the haze), stepped roofs, antennas and scattered lit windows.
  const row = (base, tall, pale) => {
    let d = '';
    let ant = '';
    let lit = '';
    let x = -10;
    while (x < W) {
      const w = 18 + rand() * 50;
      const h = base + rand() * (x > 560 && x < 1060 ? tall * 0.4 : tall);
      const step = rand() < 0.4 ? 6 + rand() * 14 : 0;
      d += `M${n1(x)} ${H}V${n1(H - h + step)}H${n1(x + w * 0.2)}V${n1(H - h)}H${n1(x + w * 0.8)}V${n1(H - h + step)}H${n1(x + w)}V${H}Z`;
      if (rand() < 0.25) ant += `M${n1(x + w * 0.5)} ${n1(H - h)}v-${n1(10 + rand() * 18)}`;
      if (!pale) for (let k = 0; k < 4; k++) if (rand() < 0.6) lit += `M${Math.round(x + 4 + rand() * (w - 8))} ${Math.round(H - h + 8 + rand() * (h - 12))}h2v2h-2z`;
      x += w + rand() * 3;
    }
    return { d, ant, lit };
  };
  const farRow = row(60, 150, true);
  const nearRow = row(20, 80, false);
  const tx = 330;
  const tower = `<path d="M${tx} 640L${tx - 3} 700L${tx - 9} 744H${tx - 13}V752H${tx - 11}L${tx - 22} 812H${tx - 27}V820H${tx - 24}L${tx - 40} ${H}H${tx + 40}L${tx + 24} 820H${tx + 27}V812H${tx + 22}L${tx + 11} 752H${tx + 13}V744H${tx + 9}L${tx + 3} 700Z" fill="${mix(t.bg, cold, 0.1)}"/><circle cx="${tx}" cy="640" r="2.4" fill="${t.danger}" ${anim('pulse', 2.4, 0, 'ease-in-out')}/>`;

  const bx = 1424;
  const by = 340;
  const apple = 'M0 -34C20 -50 50 -42 50 -6C50 32 28 56 6 52C0 50 -6 50 -12 52C-32 56 -52 32 -50 -6C-50 -42 -20 -50 0 -34Z';
  return `<defs>
<linearGradient id="dbtefx-dn-shaft" gradientUnits="userSpaceOnUse" x1="1080" y1="0" x2="1560" y2="0"><stop offset="0" stop-color="${cold}" stop-opacity="0"/><stop offset="0.55" stop-color="${mix(cold, '#ffffff', 0.4)}" stop-opacity="0.16"/><stop offset="1" stop-color="${cold}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-dn-fadeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<mask id="dbtefx-dn-fade"><rect width="${W}" height="${H}" fill="url(#dbtefx-dn-fadeG)"/></mask>
<linearGradient id="dbtefx-dn-black" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(leather, cold, 0.16)}"/><stop offset="0.5" stop-color="${mix(t.bg, '#000000', 0.25)}"/><stop offset="1" stop-color="${leather}"/></linearGradient>
<linearGradient id="dbtefx-dn-pageR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(paperDim, t.bg, 0.25)}"/><stop offset="0.35" stop-color="${paperLit}"/><stop offset="1" stop-color="${mix(paperLit, paperDim, 0.7)}"/></linearGradient>
<linearGradient id="dbtefx-dn-gutter" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000000" stop-opacity="0"/><stop offset="0.5" stop-color="#000000" stop-opacity="0.55"/><stop offset="1" stop-color="#000000" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-dn-apple" cx="0.66" cy="0.26" r="0.85"><stop offset="0" stop-color="${mix(red, '#ffffff', 0.2)}"/><stop offset="0.3" stop-color="${red}"/><stop offset="0.75" stop-color="${mix(red, '#000000', 0.62)}"/><stop offset="1" stop-color="${mix(red, '#000000', 0.82)}"/></radialGradient>
<linearGradient id="dbtefx-dn-flesh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.text, t.warning, 0.32)}"/><stop offset="1" stop-color="${mix(mix(t.text, t.warning, 0.3), t.bg, 0.35)}"/></linearGradient>
<radialGradient id="dbtefx-dn-halo" gradientUnits="userSpaceOnUse" cx="${bx + 30}" cy="${by - 20}" r="360"><stop offset="0" stop-color="${cold}" stop-opacity="0.18"/><stop offset="1" stop-color="${cold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dn-city" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cold}" stop-opacity="0"/><stop offset="1" stop-color="${cold}" stop-opacity="0.22"/></linearGradient>
<linearGradient id="dbtefx-dn-ribbon" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(red, '#000000', 0.5)}"/><stop offset="0.5" stop-color="${red}"/><stop offset="1" stop-color="${mix(red, '#000000', 0.55)}"/></linearGradient>
<radialGradient id="dbtefx-dn-vig" cx="0.55" cy="0.45" r="0.8"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.55"/></radialGradient>
</defs>
<path d="M1380 -20H1640L1440 920H1020Z" fill="url(#dbtefx-dn-shaft)" mask="url(#dbtefx-dn-fade)" ${anim('pulse', 11, 0, 'ease-in-out')}/>
<rect y="600" width="${W}" height="300" fill="url(#dbtefx-dn-city)"/>
<path d="${farRow.d}" fill="${mix(t.bg, cold, 0.13)}"/><path d="${farRow.ant}" stroke="${mix(t.bg, cold, 0.13)}" stroke-width="1.5"/>
${tower}
<rect y="760" width="${W}" height="140" fill="url(#dbtefx-dn-city)"/>
<path d="${nearRow.d}" fill="${mix(t.bg, '#000000', 0.35)}"/><path d="${nearRow.ant}" stroke="${mix(t.bg, '#000000', 0.35)}" stroke-width="1.5"/>
<path d="${nearRow.lit}" fill="${t.text}" fill-opacity="0.35"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-dn-vig)"/>
<!--mid-->
<g class="dbtefx-dn-book"><circle cx="${bx + 30}" cy="${by - 20}" r="360" fill="url(#dbtefx-dn-halo)"/>
<g style="transform-origin: ${bx}px ${by}px; animation: dbtefx-dn-drift 14s ease-in-out infinite;">
<g transform="translate(${bx} ${by}) rotate(-12) skewX(-7) scale(0.47)">
<path d="M0 -130C-62 -144 -132 -140 -190 -128L-194 132C-128 122 -62 126 0 140C62 126 128 122 196 128L192 -132C132 -146 62 -146 0 -130Z" fill="${leather}" stroke="${mix(t.border, cold, 0.35)}" stroke-width="1.4"/>
<path d="M184 -126L188 122M180 -124L184 121M176 -123L180 120M2 130C60 118 124 114 184 120" fill="none" stroke="${paperDim}" stroke-opacity="0.6" stroke-width="0.9"/>
<path d="M0 -120C-55 -134 -120 -130 -174 -118L-178 120C-120 110 -55 114 0 128Z" fill="url(#dbtefx-dn-black)" stroke="${mix(t.border, cold, 0.2)}" stroke-width="0.8"/>
<path d="M-166 -108C-118 -120 -56 -122 -10 -110L-10 116C-56 106 -118 104 -168 112Z" fill="none" stroke="${paperDim}" stroke-opacity="0.35" stroke-width="0.8"/>
<g style="transform-origin: 0px 0px; animation: dbtefx-dn-page 7s ease-in-out infinite;">
<path d="M0 -120C55 -136 120 -132 172 -122L178 116C120 108 55 112 0 128Z" fill="url(#dbtefx-dn-pageR)"/>
<path d="${lines}" stroke="${cold}" stroke-opacity="0.34" stroke-width="0.7"/>
<path d="${names}" fill="none" stroke="${ink}" stroke-width="1.1" stroke-linecap="round" stroke-opacity="0.85" transform="skewY(0.5)"/>
</g>
<rect x="-24" y="-140" width="48" height="282" fill="url(#dbtefx-dn-gutter)"/>
<g style="transform-origin: 2px 126px; animation: dbtefx-dn-ribbon 6s ease-in-out infinite;"><path d="M-2 120C-6 170 10 210 2 262L12 254L18 266C24 214 8 172 10 120Z" fill="url(#dbtefx-dn-ribbon)"/></g>
</g>
</g>
<g transform="translate(${bx + 52} 470) scale(0.72)"><g style="animation: dbtefx-dn-apple 12s cubic-bezier(0.5, 0, 0.9, 0.6) -4s infinite;">
<path d="${apple}" fill="url(#dbtefx-dn-apple)"/>
<path d="M49 -16C41 -14 36 -8 39 -1C33 3 33 11 39 16C35 21 38 27 45 25C50 14 51 0 49 -16Z" fill="url(#dbtefx-dn-flesh)" stroke="${mix(red, '#000000', 0.45)}" stroke-width="1.4"/>
<path d="M14 -40C32 -42 48 -32 52 -12" fill="none" stroke="${mix(cold, '#ffffff', 0.4)}" stroke-opacity="0.55" stroke-width="1.6" stroke-linecap="round"/>
<ellipse cx="22" cy="-24" rx="6" ry="10" transform="rotate(-35 22 -24)" fill="#ffffff" fill-opacity="0.4"/>
<path d="M0 -34C0 -44 2 -52 8 -62" fill="none" stroke="${mix(t.bg, t.warning, 0.28)}" stroke-width="3" stroke-linecap="round"/>
</g></g></g>
<!--near-->
${[1500, 1060, 140, 1380].map((sx, i) => scrap(sx, 0.6 + rand() * 0.35, i)).join('')}
<style>
@keyframes dbtefx-dn-drift { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-10px, 14px) rotate(-1.6deg); } }
@keyframes dbtefx-dn-page { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(0.93) skewY(-1.2deg); } }
@keyframes dbtefx-dn-ribbon { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(7deg); } }
@keyframes dbtefx-dn-apple { 0% { transform: translate(0, 0) rotate(-10deg); opacity: 0; } 6% { opacity: 1; } 62% { transform: translate(-18px, 400px) rotate(150deg); opacity: 1; } 68%, 100% { transform: translate(-20px, 440px) rotate(160deg); opacity: 0; } }
</style>`;
};

export default scene;

export const particles = [
  { kind: 'mote', count: 46, colors: ['text', 'accent2'], column: true, columnX: 0.8 },
  { kind: 'ash', count: 40, colors: ['muted'] },
  { kind: 'flash', count: 1, colors: ['accent2'] },
];

// WebGL layer: storm clouds churning above the city, lit cold from the top
// right where the notebook fell through; a far sheet of lightning now and then.
export const shader = {
  uniforms: ['bg', 'accent2', 'text'],
  frag: `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * asp, uv.y) * 2.4;
  float t = u_time * 0.025;
  float w = fbm(p * 0.8 + vec2(-t, t * 0.6));
  float c = fbm(p * vec2(1.0, 1.7) + vec2(t * 1.6, t * 0.3) + w * 1.4);
  vec2 lp = vec2(0.86 * asp, 1.08);
  vec2 q = vec2(uv.x * asp, uv.y) - lp;
  float d = length(q);
  float glow = exp(-d * 1.7);
  float ang = atan(q.y, q.x);
  float rays = pow(0.5 + 0.5 * sin(ang * 34.0 + fbm(vec2(ang * 5.0, t * 2.0)) * 5.0), 4.0) * smoothstep(1.4, 0.1, d);
  vec3 col = u_bg * 0.85;
  col = mix(col, mix(u_bg, u_accent2, 0.22), smoothstep(0.42, 0.9, c) * 0.9);
  col += u_accent2 * 0.16 * glow * (0.5 + c);
  col += mix(u_accent2, u_text, 0.5) * 0.045 * rays * (0.4 + c);
  float k = floor(u_time / 8.0);
  float f = fract(u_time / 8.0);
  float flash = step(0.45, hash(vec2(k, 7.0))) * smoothstep(0.0, 0.01, f) * smoothstep(0.07, 0.015, f);
  col += u_accent2 * 0.14 * flash * smoothstep(0.4, 0.9, c);
  col *= 1.0 - 0.7 * dot(uv - vec2(0.62, 0.55), uv - vec2(0.62, 0.55));
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
