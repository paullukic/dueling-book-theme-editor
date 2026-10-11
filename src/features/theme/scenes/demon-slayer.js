import { mix } from '../../../lib/color.js';
import { anim, glow, n1, polar, rng, W, H } from './kit.js';

// Demon Slayer: a black nichirin blade cutting through the night, wrapped by
// two breathing forms drawn as ukiyo-e: a woodblock water wheel with clawed
// foam and a sun-dance flame ring. Wisteria hangs from the top edge, misty
// ridges behind, petals and sparks in the air.

const CX = 1215;
const CY = 480;

// A tapering band along an arc (a0 -> a1 degrees), radius drifting r0 -> r1.
const band = (a0, a1, r0, r1, w, taper = 0.25) => {
  const outer = [];
  const inner = [];
  const steps = 36;
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const a = a0 + (a1 - a0) * u;
    const r = r0 + (r1 - r0) * u;
    const k = Math.pow(Math.sin(Math.min(1, u / taper) * Math.PI * 0.5) * Math.sin(Math.min(1, (1 - u) / taper) * Math.PI * 0.5), 0.8);
    outer.push(polar(CX, CY, r + (w * k) / 2, a).join(' '));
    inner.push(polar(CX, CY, r - (w * k) / 2, a).join(' '));
  }
  return `M${outer.join('L')}L${inner.reverse().join('L')}Z`;
};
// A thin flow line along the same arc.
const flow = (a0, a1, r0, r1) => {
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const u = i / 24;
    pts.push(polar(CX, CY, r0 + (r1 - r0) * u, a0 + (a1 - a0) * u).join(' '));
  }
  return `M${pts.join('L')}`;
};

const scene = (t) => {
  const ink = mix(t.bg, '#000000', 0.5);
  const waterDeep = mix(t.accent2, t.bg, 0.55);
  const water = t.accent2;
  const foam = mix(t.accent2, '#ffffff', 0.78);
  const flame = t.warning;
  const wisteria = t.link;

  // Water: a crescent slash of woodblock water, thin at both ends and full in
  // the middle, scalloped eddies on its inner edge, foam fingers curling
  // forward off its leading tip.
  const A0 = 92;
  const A1 = 336;
  const wave = `<path d="${band(A0, A1, 176, 158, 82, 0.5)}" fill="${waterDeep}" stroke="${ink}" stroke-width="3"/>
<path d="${band(A0 + 8, A1 - 6, 181, 163, 56, 0.5)}" fill="${water}"/>
<path d="${band(A0 + 30, A1 - 18, 193, 175, 14, 0.5)}" fill="${foam}"/>
<g fill="none" stroke="${foam}" stroke-width="2.4" stroke-linecap="round" stroke-opacity="0.8"><path d="${flow(A0 + 40, A1 - 40, 171, 153)}" stroke-dasharray="70 24"/><path d="${flow(A0 + 70, A1 - 30, 180, 162)}" stroke-dasharray="30 36" stroke-opacity="0.55"/></g>`;
  // The head of the slash turns over into a curling crest.
  const [hx, hy] = polar(CX, CY, 170, A1 - 2);
  const crestD = 'M0 0C30 -6 52 -30 44 -56C36 -80 2 -82 -10 -62C-20 -46 -6 -28 10 -34C20 -38 18 -52 8 -52';
  const crest = `<g transform="translate(${hx} ${hy}) rotate(${A1 + 90}) scale(0.85)"><path d="${crestD}" fill="none" stroke="${ink}" stroke-width="20" stroke-linecap="round"/><path d="${crestD}" fill="none" stroke="${water}" stroke-width="13" stroke-linecap="round"/><path d="${crestD}" fill="none" stroke="${foam}" stroke-width="4" stroke-linecap="round"/></g>`;
  // Scroll eddies on the inner edge.
  let curls = '';
  [170, 225, 280, 330].forEach((a, i) => {
    const [x, y] = polar(CX, CY, 132 - i * 3, a);
    curls += `<g transform="translate(${x} ${y}) rotate(${a + 90}) scale(${n1(1.05 - i * 0.08)})"><path d="M-22 0C-22 -18 4 -24 14 -10C20 -2 12 10 2 6C-4 3 -2 -6 4 -4" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/><path d="M-22 0C-22 -18 4 -24 14 -10C20 -2 12 10 2 6C-4 3 -2 -6 4 -4" fill="none" stroke="${foam}" stroke-width="3.4" stroke-linecap="round"/></g>`;
  });

  // Sun-dance flame: the shader draws the fire; the SVG keeps its hot core
  // line and a glow so the form still reads without WebGL.
  const fire = `<path d="${band(196, 344, 214, 214, 60, 0.5)}" fill="url(#dbtefx-ds-ember)" opacity="0.8"/><path d="${band(200, 340, 214, 214, 9, 0.5)}" fill="${mix(flame, '#ffffff', 0.55)}"/><path d="${band(200, 340, 216, 216, 22, 0.5)}" fill="none" stroke="${flame}" stroke-opacity="0.7" stroke-width="2"/>`;

  // The black nichirin blade on the diagonal, its hamon pale, a round guard and wrapped hilt.
  let wrap = '';
  for (let x = -206; x > -326; x -= 12) wrap += `M${x} -12L${x - 12} 12M${x} 12L${x - 12} -12`;
  const blade = `<g transform="translate(${CX} ${CY}) rotate(-52) scale(0.82)">
<path d="M-150 -11L300 -8Q356 -6 384 6Q344 11 300 11L-150 11Z" fill="${mix(t.bg, t.muted, 0.12)}" stroke="${ink}" stroke-width="2"/>
<path d="M-140 4Q-110 0 -80 4T-20 4T40 4T100 4T160 4T220 4L300 5Q344 6 380 6" fill="none" stroke="${mix(t.text, t.accent2, 0.15)}" stroke-width="3" stroke-opacity="0.85"/>
<path d="M-150 -8L296 -6" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>
<path d="M-178 -12H-150V12H-178Z" fill="${mix(t.warning, t.bg, 0.4)}"/>
<ellipse cx="-188" cy="0" rx="10" ry="40" fill="${ink}" stroke="${mix(t.muted, t.bg, 0.2)}" stroke-width="2"/>
<path d="M-198 -12H-330Q-338 0 -330 12H-198Z" fill="${ink}"/>
<path d="${wrap}" stroke="${mix(t.accent, t.bg, 0.4)}" stroke-width="2"/>
</g>`;

  // Wisteria racemes hanging from the top edge: florets in pairs along a
  // gently curving spine, wide and deep violet at the stem, small and pale at
  // the tip, each floret tipped out and down like the real bloom.
  const raceme = (x, y, len, s, dur, delay) => {
    const r = rng(Math.round(x * 7));
    const bend = (r() - 0.5) * 14;
    let f = '';
    for (let i = 0; i < 30; i++) {
      const u = Math.pow(r(), 0.8);
      const cy = y + 6 + u * len;
      const cx = x + Math.sin(u * Math.PI) * bend + (r() - 0.5) * 2 * (1 - u * 0.8) * 20 * s;
      const fr = (2.2 + (1 - u) * 3.2 + r() * 1.5) * s;
      f += `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(fr)}" ry="${n1(fr * 0.75)}" fill="${mix(mix(wisteria, t.bg, 0.45), mix(wisteria, '#ffffff', 0.5), u * 0.7 + r() * 0.3)}"/>`;
    }
    return `<g style="transform-origin: ${n1(x)}px ${n1(y)}px; animation: dbtefx-reed ${dur}s ease-in-out ${n1(-delay)}s infinite;"><path d="M${n1(x - 21 * s)} ${y}C${n1(x - 21 * s)} ${n1(y + len * 0.5)} ${n1(x - 4)} ${n1(y + len * 0.9)} ${n1(x + bend * 0.3)} ${n1(y + len + 4)}C${n1(x + 4)} ${n1(y + len * 0.9)} ${n1(x + 21 * s)} ${n1(y + len * 0.5)} ${n1(x + 21 * s)} ${y}Z" fill="${mix(wisteria, t.bg, 0.55)}" fill-opacity="0.75"/><path d="M${n1(x)} ${n1(y - 20)}Q${n1(x + bend)} ${n1(y + len * 0.5)} ${n1(x)} ${n1(y + len)}" fill="none" stroke="${ink}" stroke-width="1.6"/>${f}</g>`;
  };
  let wisteriaL = '';
  let wisteriaR = '';
  [[150, 200, 1.1], [214, 150, 0.9], [276, 240, 1.15], [340, 170, 0.95], [396, 120, 0.8]].forEach(([x, len, s], i) => {
    wisteriaL += raceme(x, 22 + (i % 2) * 18, len, s, n1(7 + i), i * 1.7);
  });
  [[1370, 140, 0.9], [1424, 190, 1.05]].forEach(([x, len, s], i) => {
    wisteriaR += raceme(x, 14 + (i % 2) * 14, len, s, n1(8 + i), i * 2.1);
  });
  // The vine and leaves they hang from.
  const vine = `<path d="M100 30Q260 -6 420 40M1280 22Q1390 -10 1490 30" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>${[120, 180, 236, 300, 350, 400, 1300, 1350, 1410, 1460].map((x, i) => `<path d="M${x} ${20 + (i % 3) * 5}q14 -12 30 -4q-14 12 -30 4z" fill="${mix(t.success, t.bg, 0.55)}"/>`).join('')}`;

  // A cedar forest along the foot, inked dark: depth under the mist.
  let cedars = '';
  const cr = rng(41);
  for (let x = -20; x < 1630; x += 46 + cr() * 50) {
    if (x > 470 && x < 980 && cr() < 0.7) continue;
    const h = 90 + cr() * 100;
    const w = 26 + cr() * 16;
    const b = 905;
    cedars += `M${n1(x)} ${n1(b - h)}L${n1(x + w * 0.55)} ${n1(b - h * 0.62)}L${n1(x + w * 0.3)} ${n1(b - h * 0.62)}L${n1(x + w)} ${n1(b - h * 0.25)}L${n1(x + w * 0.4)} ${n1(b - h * 0.25)}L${n1(x + w * 1.2)} ${b}H${n1(x - w * 1.2)}L${n1(x - w * 0.4)} ${n1(b - h * 0.25)}L${n1(x - w)} ${n1(b - h * 0.25)}L${n1(x - w * 0.3)} ${n1(b - h * 0.62)}L${n1(x - w * 0.55)} ${n1(b - h * 0.62)}Z`;
  }

  // Mountain ridges in mist (the wisteria mountain of the Final Selection).
  const ridge = (y, amp, seed, color, o) => {
    const r = rng(seed);
    let d = `M-10 ${H}V${y}`;
    for (let x = -10; x <= 1610; x += 80) d += `L${x} ${n1(y - r() * amp)}`;
    return `<path d="${d}V${H}Z" fill="${color}" fill-opacity="${o}"/>`;
  };

  return `<style>@keyframes dbtefx-ds-sway { 0%, 100% { transform: rotate(-7deg); } 50% { transform: rotate(5deg); } }
@keyframes dbtefx-ds-swayb { 0%, 100% { transform: rotate(5deg); } 50% { transform: rotate(-6deg); } }</style>
<defs>
${glow('dbtefx-ds-halo', t.accent2, 0.5, 0.5, 0.5, 0.28)}
${glow('dbtefx-ds-ember', flame, 0.5, 0.5, 0.5, 0.3)}
<linearGradient id="dbtefx-ds-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent}"/><stop offset="0.55" stop-color="${flame}"/><stop offset="1" stop-color="${mix(flame, '#ffffff', 0.45)}"/></linearGradient>
<linearGradient id="dbtefx-ds-fireband" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${flame}"/></linearGradient>
<linearGradient id="dbtefx-ds-wis" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(wisteria, t.bg, 0.35)}"/><stop offset="0.5" stop-color="${wisteria}"/><stop offset="1" stop-color="${mix(wisteria, '#ffffff', 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-ds-wglow"><stop offset="0" stop-color="${wisteria}" stop-opacity="0.55"/><stop offset="1" stop-color="${wisteria}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ds-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.muted}" stop-opacity="0"/><stop offset="1" stop-color="${t.muted}" stop-opacity="0.12"/></linearGradient>
</defs>
${ridge(640, 90, 3, mix(t.bg, t.muted, 0.16), 0.9)}
${ridge(720, 70, 5, mix(t.bg, t.link, 0.1), 0.95)}
<rect x="0" y="560" width="${W}" height="340" fill="url(#dbtefx-ds-mist)"/>
<!--mid-->
<circle cx="${CX}" cy="${CY}" r="330" fill="url(#dbtefx-ds-halo)"/>
<g style="transform-origin: ${CX}px ${CY}px; animation: dbtefx-ds-sway 9s ease-in-out infinite;">${fire}</g>
<circle cx="${CX}" cy="${CY}" r="280" fill="url(#dbtefx-ds-ember)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<g style="transform-origin: ${CX}px ${CY}px; animation: dbtefx-ds-swayb 11s ease-in-out infinite;">${wave}${curls}${crest}</g>
${blade}
<!--near-->
<path d="${cedars}" fill="${ink}"/>
${vine}
${wisteriaL}
${wisteriaR}`;
};

export default scene;

// Wisteria petals drifting down, sparks thrown off the sun-dance flame.
export const particles = [
  { kind: 'petal', count: 34, colors: ['link', 'text'] },
  { kind: 'ember', count: 30, colors: ['warning', 'accent'], column: true, columnX: 0.72 },
];

// WebGL layer (shader.js): the sun-dance flame as real fire, a crescent of
// flame streaming back along the same swing as the SVG mane (scene coordinates
// are rebuilt from the 1600x900 slice so the two line up), over a misty night.
export const shader = {
  uniforms: ['bg', 'accent', 'warning', 'link', 'muted'],
  frag: `
void main() {
  float sc = max(u_res.x / 1600.0, u_res.y / 900.0);
  vec2 p = vec2(gl_FragCoord.x - (u_res.x - 1600.0 * sc) * 0.5, u_res.y - gl_FragCoord.y - (u_res.y - 900.0 * sc) * 0.5) / sc;
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time;
  vec3 col = mix(u_bg, u_bg + u_link * 0.06, smoothstep(0.2, 1.0, uv.y));
  col += u_muted * 0.08 * fbm(vec2(p.x / 400.0 + t * 0.02, p.y / 140.0)) * smoothstep(0.55, 0.0, uv.y);
  vec2 d = p - vec2(1215.0, 480.0);
  float r = length(d);
  float a = atan(d.y, d.x);
  // Angle along the crescent (240 to 464 degrees), 0..1.
  float ang = mod(degrees(a) - 196.0 + 720.0, 360.0) / 148.0;
  float env = smoothstep(0.0, 0.3, ang) * smoothstep(1.0, 0.7, ang) * step(ang, 1.0);
  float n = fbm(vec2(a * 5.0 - t * 1.6, (r - 214.0) / 70.0 - t * 1.1));
  float n2 = fbm(vec2(a * 9.0 - t * 2.2 - (r - 214.0) / 260.0, (r - 214.0) / 46.0 - t * 1.9) + n * 1.3);
  float h = (r - 210.0) / 200.0;
  float fire = clamp((n2 * 1.25 - h * 1.6) * env * smoothstep(-0.1, 0.02, h), 0.0, 1.0);
  vec3 flame = mix(u_accent * 0.9, u_warning, smoothstep(0.15, 0.6, fire));
  flame = mix(flame, mix(u_warning, vec3(1.0), 0.6), smoothstep(0.7, 1.0, fire));
  col = mix(col, flame, smoothstep(0.05, 0.4, fire));
  col += u_accent * 0.25 * env * smoothstep(220.0, 0.0, abs(r - 228.0)) * 0.6;
  col *= 1.0 - 0.45 * dot(uv - 0.5, uv - 0.5) * 2.0;
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
