import { mix } from '../../../lib/color.js';
import { anim, glow, n1, polar, rng, W, H } from './kit.js';

// Demon Slayer: a black nichirin blade standing in the night on the right,
// wrapped by water breathing painted as layered brush-stroke waves, the
// sun-dance flame rising off the top of the swing. A fringe of wisteria along
// the top edge, misty ridges and cedars below, petals and sparks in the air.

const CX = 1330;
const CY = 470;

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
  const wisteria = mix(mix(t.muted, t.accent2, 0.25), '#ffffff', 0.1);

  // Water breathing: brush strokes, not outlines. Overlapping tapered strokes
  // in three blues swirl around the blade (squeezed into a tall oval), dry
  // brush bristle lines inside each, a curling crest of foam at the head.
  const bristles = (a0, a1, r0, r1, n, seed) => {
    const r = rng(seed);
    let d = '';
    for (let i = 0; i < n; i++) d += `<path d="${flow(a0 + r() * 20, a1 - r() * 30, r0 + (r() - 0.5) * 22, r1 + (r() - 0.5) * 22)}" stroke-dasharray="${n1(30 + r() * 70)} ${n1(6 + r() * 16)}" stroke-width="${n1(1 + r() * 1.6)}"/>`;
    return d;
  };
  const wave = `<path d="${band(150, 410, 150, 128, 64, 0.45)}" fill="${waterDeep}" fill-opacity="0.92"/>
<path d="${band(120, 300, 186, 172, 30, 0.4)}" fill="${mix(water, t.bg, 0.25)}" fill-opacity="0.8"/>
<path d="${band(168, 398, 156, 134, 42, 0.45)}" fill="${water}"/>
<path d="${band(330, 480, 104, 118, 26, 0.5)}" fill="${mix(water, foam, 0.3)}" fill-opacity="0.85"/>
<path d="${band(200, 384, 167, 145, 12, 0.5)}" fill="${foam}"/>
<g fill="none" stroke="${foam}" stroke-linecap="round" stroke-opacity="0.75">${bristles(160, 400, 150, 128, 6, 11)}${bristles(125, 295, 186, 172, 3, 13)}</g>
<path d="${flow(160, 404, 120, 98)}" fill="none" stroke="${ink}" stroke-opacity="0.45" stroke-width="1.4"/>`;
  // The head of the stroke turns over into a curling crest: a tapered brush spiral.
  const [hx, hy] = polar(CX, CY, 136, 404);
  const crestD = 'M0 0C24 -4 42 -24 36 -44C30 -62 4 -64 -6 -48C-14 -36 -4 -22 8 -27C16 -30 14 -40 7 -40';
  const crest = `<g transform="translate(${hx} ${hy}) rotate(${404 + 90}) scale(0.9)"><path d="${crestD}" fill="none" stroke="${water}" stroke-width="13" stroke-linecap="round"/><path d="${crestD}" fill="none" stroke="${foam}" stroke-width="4" stroke-linecap="round"/></g>`;
  // Spray thrown off the swing.
  const sr = rng(77);
  let spray = '';
  for (let i = 0; i < 14; i++) {
    const [x, y] = polar(CX, CY, 175 + sr() * 50, 150 + sr() * 240);
    spray += `<circle cx="${x}" cy="${y}" r="${n1(1.4 + sr() * 3)}"/>`;
  }
  const curls = `<g fill="${foam}" fill-opacity="0.8">${spray}</g>`;

  // Sun-dance flame: the shader draws the fire; the SVG keeps its hot core
  // line and a glow so the form still reads without WebGL.
  const fire = `<path d="${band(215, 335, 196, 196, 56, 0.5)}" fill="url(#dbtefx-ds-ember)" opacity="0.8"/><path d="${band(218, 332, 196, 196, 8, 0.5)}" fill="${mix(flame, '#ffffff', 0.55)}"/><path d="${band(218, 332, 198, 198, 20, 0.5)}" fill="none" stroke="${flame}" stroke-opacity="0.7" stroke-width="2"/>`;

  // The nichirin blade, near upright: a dark steel body with a pale edge zone
  // whose boundary is a gunome hamon, the shinogi ridge and yokote line, a gold
  // habaki, a black tsuba with gold rim and openings, and an ito-wrapped hilt
  // showing diamonds of pale same between the crossings.
  let hamon = 'M380 7.6Q344 7 300 5.5';
  const hr = rng(19);
  for (let x = 300; x > -150; x -= 45) hamon += `Q${x - 12} ${n1(1 + hr() * 2)} ${x - 22} ${n1(3.5 + hr())}T${x - 45} ${n1(3.5 + hr())}`;
  let ito = '';
  for (let x = -196; x > -320; x -= 15) ito += `M${x} -11L${x - 15} 11M${x} 11L${x - 15} -11`;
  const blade = `<g transform="translate(${CX} ${n1(CY + 20)}) rotate(-80) scale(0.86)">
<path d="M-150 -10L300 -7Q350 -5 384 7Q348 12 300 11L-150 11Z" fill="${mix(t.bg, t.muted, 0.28)}"/>
<path d="${hamon}L-150 11L300 11Q348 12 384 7Z" fill="${mix(t.text, t.muted, 0.35)}" fill-opacity="0.85"/>
<path d="M-150 -3L300 -2.5L384 7M300 -7L300 -2.5" fill="none" stroke="${mix(t.text, t.muted, 0.4)}" stroke-opacity="0.6" stroke-width="1"/>
<path d="M-150 -9L298 -6.4Q340 -5 370 2" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="1.2"/>
<path d="M-150 -10L300 -7Q350 -5 384 7Q348 12 300 11L-150 11Z" fill="none" stroke="${ink}" stroke-width="1.2"/>
<path d="M-168 -12H-150V12H-168Z" fill="${mix(t.warning, t.bg, 0.25)}" stroke="${mix(t.warning, t.bg, 0.6)}"/>
<path d="M-171 -15H-168V15H-171ZM-182 -15H-179V15H-182Z" fill="${mix(t.warning, t.text, 0.2)}"/>
<ellipse cx="-175" cy="0" rx="5" ry="38" fill="${ink}" stroke="${mix(t.warning, t.bg, 0.35)}" stroke-width="1.6"/>
<g fill="${mix(t.bg, t.muted, 0.2)}"><ellipse cx="-175" cy="-24" rx="2" ry="6"/><ellipse cx="-175" cy="24" rx="2" ry="6"/></g>
<path d="M-184 -11H-326Q-334 0 -326 11H-184Z" fill="${mix(t.text, t.muted, 0.35)}"/>
<path d="${ito}" stroke="${ink}" stroke-width="6.5" stroke-linecap="square"/>
<path d="M-184 -12H-194V12H-184ZM-322 -12H-336Q-342 0 -336 12H-322Z" fill="${mix(t.warning, t.bg, 0.3)}"/>
</g>`;

  // Wisteria racemes hanging from the top edge: florets in pairs along a
  // gently curving spine, wide and deep violet at the stem, small and pale at
  // the tip, each floret tipped out and down like the real bloom.
  const raceme = (x, y, len, s, dur, delay) => {
    const r = rng(Math.round(x * 7));
    const bend = (r() - 0.5) * 14;
    let f = '';
    for (let i = 0; i < 18; i++) {
      const u = Math.pow(r(), 0.8);
      const cy = y + 6 + u * len;
      const cx = x + Math.sin(u * Math.PI) * bend + (r() - 0.5) * 2 * (1 - u * 0.8) * 20 * s;
      const fr = (2.2 + (1 - u) * 3.2 + r() * 1.5) * s;
      f += `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(fr)}" ry="${n1(fr * 0.75)}" fill="${mix(mix(wisteria, t.bg, 0.45), mix(wisteria, '#ffffff', 0.5), u * 0.7 + r() * 0.3)}"/>`;
    }
    return `<g style="transform-origin: ${n1(x)}px ${n1(y)}px; animation: dbtefx-reed ${dur}s ease-in-out ${n1(-delay)}s infinite;"><path d="M${n1(x - 21 * s)} ${y}C${n1(x - 21 * s)} ${n1(y + len * 0.5)} ${n1(x - 4)} ${n1(y + len * 0.9)} ${n1(x + bend * 0.3)} ${n1(y + len + 4)}C${n1(x + 4)} ${n1(y + len * 0.9)} ${n1(x + 21 * s)} ${n1(y + len * 0.5)} ${n1(x + 21 * s)} ${y}Z" fill="${mix(wisteria, t.bg, 0.55)}" fill-opacity="0.75"/><path d="M${n1(x)} ${n1(y - 20)}Q${n1(x + bend)} ${n1(y + len * 0.5)} ${n1(x)} ${n1(y + len)}" fill="none" stroke="${ink}" stroke-width="1.6"/>${f}</g>`;
  };
  let wisteriaL = '';
  [[110, 64, 1], [172, 50, 0.9], [236, 66, 1.05], [300, 52, 0.9], [362, 64, 1], [426, 48, 0.85], [488, 60, 0.95], [548, 44, 0.85]].forEach(([x, len, s], i) => {
    wisteriaL += raceme(x, 10 + (i % 2) * 6, len, s, n1(7 + (i % 4)), i * 1.7);
  });
  // The vine and leaves they hang from.
  const vine = `<path d="M90 14Q330 -4 580 16" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>${[100, 150, 205, 262, 320, 380, 440, 500, 556].map((x, i) => `<path d="M${x} ${8 + (i % 3) * 4}q14 -12 30 -4q-14 12 -30 4z" fill="${mix(t.success, t.bg, 0.55)}"/>`).join('')}`;

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
${ridge(720, 70, 5, mix(t.bg, t.accent2, 0.08), 0.95)}
<rect x="0" y="560" width="${W}" height="340" fill="url(#dbtefx-ds-mist)"/>
<!--mid-->
<ellipse cx="${CX}" cy="${CY}" rx="240" ry="330" fill="url(#dbtefx-ds-halo)"/>
<g style="transform-origin: ${CX}px ${CY}px; animation: dbtefx-ds-sway 9s ease-in-out infinite;">${fire}</g>
<circle cx="${CX}" cy="${n1(CY - 120)}" r="200" fill="url(#dbtefx-ds-ember)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<g style="transform-origin: ${CX}px ${CY}px; animation: dbtefx-ds-swayb 11s ease-in-out infinite;"><g transform="translate(${CX + 30} ${CY}) scale(0.62 1.12) translate(${-CX} ${-CY})">${wave}${curls}${crest}</g></g>
${blade}
<!--near-->
<path d="${cedars}" fill="${ink}"/>
${vine}
${wisteriaL}`;
};

export default scene;

// Wisteria petals drifting down, sparks thrown off the sun-dance flame.
export const particles = [
  { kind: 'petal', count: 34, colors: ['muted', 'text'] },
  { kind: 'ember', count: 30, colors: ['warning', 'accent'], column: true, columnX: 0.84 },
];

// WebGL layer (shader.js): the sun-dance flame as real fire, a crescent of
// flame streaming back along the same swing as the SVG mane (scene coordinates
// are rebuilt from the 1600x900 slice so the two line up), over a misty night.
export const shader = {
  uniforms: ['bg', 'accent', 'accent2', 'warning', 'muted'],
  frag: `
void main() {
  float sc = max(u_res.x / 1600.0, u_res.y / 900.0);
  vec2 p = vec2(gl_FragCoord.x - (u_res.x - 1600.0 * sc) * 0.5, u_res.y - gl_FragCoord.y - (u_res.y - 900.0 * sc) * 0.5) / sc;
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time;
  vec3 col = mix(u_bg, u_bg + u_accent2 * 0.05, smoothstep(0.2, 1.0, uv.y));
  col += u_muted * 0.08 * fbm(vec2(p.x / 400.0 + t * 0.02, p.y / 140.0)) * smoothstep(0.55, 0.0, uv.y);
  vec2 d = p - vec2(1330.0, 470.0);
  float r = length(d);
  float a = atan(d.y, d.x);
  // Angle along the crescent (240 to 464 degrees), 0..1.
  float ang = mod(degrees(a) - 214.0 + 720.0, 360.0) / 122.0;
  float env = smoothstep(0.0, 0.3, ang) * smoothstep(1.0, 0.7, ang) * step(ang, 1.0);
  float n = fbm(vec2(a * 5.0 - t * 1.6, (r - 196.0) / 70.0 - t * 1.1));
  float n2 = fbm(vec2(a * 9.0 - t * 2.2 - (r - 196.0) / 260.0, (r - 196.0) / 46.0 - t * 1.9) + n * 1.3);
  float h = (r - 192.0) / 210.0;
  float fire = clamp((n2 * 1.25 - h * 1.6) * env * smoothstep(-0.1, 0.02, h), 0.0, 1.0);
  vec3 flame = mix(u_accent * 0.9, u_warning, smoothstep(0.15, 0.6, fire));
  flame = mix(flame, mix(u_warning, vec3(1.0), 0.6), smoothstep(0.7, 1.0, fire));
  col = mix(col, flame, smoothstep(0.05, 0.4, fire));
  col += u_accent * 0.25 * env * smoothstep(220.0, 0.0, abs(r - 210.0)) * 0.6;
  col *= 1.0 - 0.45 * dot(uv - 0.5, uv - 0.5) * 2.0;
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
