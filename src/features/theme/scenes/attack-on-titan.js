import { mix } from '../../../lib/color.js';
import { anim, glow, n1, rng, W, H } from './kit.js';

// Attack on Titan: Wall Maria curving out of the haze, a colossal column of
// steam boiling up behind it in ember light, Survey Corps scouts swinging on
// ODM wires from the wall face, birds over the parapet, town roofs below.

const q = (a, c, b, u) => n1((1 - u) * (1 - u) * a + 2 * (1 - u) * u * c + u * u * b);
// Wall top and foot as quadratic curves (perspective: far left, near right).
const TOP = [[-20, 548], [820, 470], [1620, 120]];
const FOOT = [[-20, 606], [820, 640], [1620, 940]];
const pt = (curve, u) => [q(curve[0][0], curve[1][0], curve[2][0], u), q(curve[0][1], curve[1][1], curve[2][1], u)];
const lerpCurve = (f) => TOP.map((p, i) => [p[0] + (FOOT[i][0] - p[0]) * f, p[1] + (FOOT[i][1] - p[1]) * f]);
const curvePath = (c) => `M${c[0][0]} ${n1(c[0][1])}Q${c[1][0]} ${n1(c[1][1])} ${c[2][0]} ${n1(c[2][1])}`;

const scene = (t) => {
  const rand = rng(1845);
  const stone = mix(t.bg, t.muted, 0.2);
  const stoneLit = mix(t.bg, t.muted, 0.34);
  const ink = mix(t.bg, '#000000', 0.55);
  const steam = mix(t.muted, t.text, 0.4);
  const heat = t.accent2;
  const cloak = mix(t.accent, t.bg, 0.45);

  // Coursed masonry: horizontal courses converge to the far end, joints staggered.
  let courses = '';
  const rows = 9;
  for (let r = 1; r < rows; r++) courses += curvePath(lerpCurve(r / rows));
  let joints = '';
  for (let r = 0; r < rows; r++) {
    const a = lerpCurve(r / rows);
    const b = lerpCurve((r + 1) / rows);
    for (let i = 0; i < 26; i++) {
      const u = Math.pow((i + (r % 2) * 0.5) / 26, 0.62);
      if (u > 1) continue;
      const [x1, y1] = pt(a, u);
      const [x2, y2] = pt(b, u);
      joints += `M${x1} ${y1}L${x2} ${y2}`;
    }
  }

  // Cannons on the parapet, nearer ones bigger.
  let cannons = '';
  for (let i = 0; i < 7; i++) {
    const u = 0.5 + i * 0.075;
    if (u > 0.74 && u < 0.92) continue;
    const [x, y] = pt(TOP, u);
    const s = 0.4 + u * 0.9;
    cannons += `<g transform="translate(${x} ${y}) scale(${n1(s)})"><rect x="-9" y="-11" width="18" height="9" rx="2"/><path d="M-4 -9L-26 -15L-26 -10L-4 -5Z"/><circle cx="-6" cy="-3" r="4.5"/><circle cx="6" cy="-3" r="4.5"/></g>`;
  }

  // The steam column: a few big soft billows at the base, rising out of the
  // heat behind the wall (the shader adds the rolling texture above).
  let billows = '';
  for (let i = 0; i < 16; i++) {
    const k = i / 15;
    const y = 250 - k * 330 + (rand() - 0.5) * 40;
    const spread = 60 + k * 170;
    const x = 1250 + (rand() - 0.5) * spread * 2 + k * 50;
    const r = 110 + k * 120 + rand() * 50;
    const moving = i % 3 === 0;
    billows += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" fill="url(#dbtefx-aot-puff)" ${moving ? anim('aot-boil', n1(16 + rand() * 10), rand() * 20, 'ease-in-out') : `opacity="${n1(0.5 + rand() * 0.4)}"`}/>`;
  }

  // A Survey Corps scout in flight: body leaning into the swing, cloak
  // streaming back, legs trailing, blades forward. The wire meets the belt at (0, 0).
  const scout = (s) => `<g transform="scale(${s}) translate(2 -16)"><path d="M3 9C-5 7 -14 5 -25 9C-19 13 -18 18 -21 24C-14 21 -8 21 -4 23C-2 18 0 13 3 9Z" fill="${cloak}"/><path d="M3 9C-5 7 -14 5 -25 9" fill="none" stroke="${mix(t.accent, t.text, 0.3)}" stroke-opacity="0.5" stroke-width="0.8"/><path d="M5 7C8 8 8 12 6 15L-2 25L-12 36L-16 35L-8 25L-14 30L-22 38L-25 36L-12 22L-4 12C-2 8 2 6 5 7Z" fill="${ink}"/><circle cx="7.5" cy="3.4" r="3.5" fill="${ink}"/><path d="M-6 17L-11 21L-8 24L-3 20Z" fill="${mix(t.muted, t.bg, 0.25)}"/><path d="M6 12L30 7M4 15L27 15" stroke="${mix(t.text, t.muted, 0.2)}" stroke-width="1.3" stroke-linecap="round"/><path d="M-9 22Q-30 30 -58 26" fill="none" stroke="${t.text}" stroke-opacity="0.35" stroke-width="1.1" stroke-linecap="round"/><path d="M-9 22Q-34 34 -80 32" fill="none" stroke="${t.text}" stroke-opacity="0.14" stroke-width="2.4" stroke-linecap="round"/></g>`;
  // Wire from an anchor in the wall face; the scout swings on it like a pendulum.
  const swing = (ax, ay, len, s, dur, delay, dir) =>
    `<g style="transform-origin: ${ax}px ${ay}px; animation: dbtefx-aot-swing${dir < 0 ? 'b' : ''} ${dur}s ease-in-out ${n1(-delay)}s infinite;"><path d="M${ax} ${ay}Q${ax + 26 * dir} ${n1(ay + len * 0.55)} ${ax} ${ay + len}" fill="none" stroke="${mix(t.text, t.muted, 0.5)}" stroke-opacity="0.75" stroke-width="${n1(0.9 * s)}"/><circle cx="${ax}" cy="${ay}" r="${n1(2 * s)}" fill="${ink}"/><g transform="translate(${ax} ${ay + len})${dir < 0 ? ' scale(-1 1)' : ''}">${scout(s)}</g></g>`;

  // The colossal hand: four skinless fingers hooked over the parapet from
  // behind the wall, red muscle with pale tendons, steam lifting off them.
  const finger = (len, w) => {
    // Outline down one side (x sign flips for the other): knuckle arch over
    // the parapet, then phalanges narrowing with a swell at each joint.
    const side = [[0.5, -14], [0.44, 0.28], [0.49, 0.4], [0.39, 0.52], [0.34, 0.66], [0.38, 0.74], [0.3, 0.86], [0.2, 0.97]];
    const P = (k, [fx, fy]) => `${n1(k * fx * w)} ${fy < 0 ? fy : n1(fy * len)}`;
    const d = `M${P(-1, side[0])}C${n1(-w * 0.5)} -44 ${n1(w * 0.5)} -44 ${P(1, side[0])}${side.slice(1).map((q) => `L${P(1, q)}`).join('')}Q0 ${n1(len * 1.04)} ${P(-1, side[7])}${side.slice(1, 7).reverse().map((q) => `L${P(-1, q)}`).join('')}Z`;
    return `<path d="${d}" fill="url(#dbtefx-aot-flesh)" stroke="${ink}" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M${n1(-w * 0.24)} -26Q${n1(-w * 0.3)} ${n1(len * 0.4)} ${n1(-w * 0.12)} ${n1(len * 0.9)}M${n1(w * 0.22)} -26Q${n1(w * 0.26)} ${n1(len * 0.4)} ${n1(w * 0.12)} ${n1(len * 0.9)}M${n1(-w * 0.08)} -30Q${n1(-w * 0.1)} ${n1(len * 0.5)} 0 ${n1(len * 0.95)}" fill="none" stroke="${mix(t.danger, t.text, 0.45)}" stroke-opacity="0.35" stroke-width="1.4"/>
<path d="M${n1(w * 0.06)} -32V${n1(len * 0.86)}" stroke="${t.text}" stroke-opacity="0.22" stroke-width="2.4" stroke-linecap="round"/>
<path d="M${n1(-w * 0.2)} ${n1(len * 0.9)}Q0 ${n1(len * 0.86)} ${n1(w * 0.2)} ${n1(len * 0.9)}Q${n1(w * 0.18)} ${n1(len * 1.01)} 0 ${n1(len * 1.02)}Q${n1(-w * 0.18)} ${n1(len * 1.01)} ${n1(-w * 0.2)} ${n1(len * 0.9)}Z" fill="${mix(t.text, t.danger, 0.35)}" fill-opacity="0.75" stroke="${ink}" stroke-width="1.4"/>
<path d="M${n1(-w * 0.46)} ${n1(len * 0.4)}Q0 ${n1(len * 0.46)} ${n1(w * 0.46)} ${n1(len * 0.4)}M${n1(-w * 0.36)} ${n1(len * 0.74)}Q0 ${n1(len * 0.79)} ${n1(w * 0.36)} ${n1(len * 0.74)}" fill="none" stroke="${ink}" stroke-opacity="0.7" stroke-width="2"/>`;
  };
  // The back of the hand rises from behind the wall into the steam; the
  // fingers sit side by side, splayed a little, knuckles over the parapet.
  const [hx, hy] = pt(TOP, 0.81);
  const fingers = [[-66, 98, 38, -12], [-22, 128, 44, -4], [22, 140, 46, 3], [66, 120, 42, 10]].map(([dx, len, w, rot]) => `<g transform="translate(${dx} 8) rotate(${rot})">${finger(len, w)}</g>`).join('');
  const back = `<path d="M-96 -2C-112 -60 -76 -128 -46 -190H54C82 -128 110 -60 92 -2Z" fill="url(#dbtefx-aot-back)"/><path d="M-66 -10Q-40 -100 -10 -190M-22 -14Q-10 -100 4 -190M22 -14Q16 -100 14 -190M66 -10Q46 -100 26 -190" fill="none" stroke="${t.text}" stroke-opacity="0.2" stroke-width="3" stroke-linecap="round"/><path d="M-82 -20Q-62 -100 -30 -190M-44 -16Q-26 -100 -6 -190M0 -16Q4 -100 9 -190M44 -16Q32 -100 20 -190M82 -20Q64 -100 40 -190" fill="none" stroke="${ink}" stroke-opacity="0.35" stroke-width="1.6"/><path d="M-96 -2C-106 -40 -100 -70 -86 -100M92 -2C104 -40 100 -70 88 -100" fill="none" stroke="${ink}" stroke-opacity="0.45" stroke-width="2.4" stroke-linecap="round"/>`;
  const hand = `<g transform="translate(${hx} ${n1(hy + 2)}) rotate(-21) scale(0.86)">${back}${fingers}</g>`;
  let handSteam = '';
  [[1260, 160, 56], [1340, 130, 70], [1400, 110, 56], [1300, 100, 48], [1370, 70, 52]].forEach(([x, y, r], i) => {
    handSteam += `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#dbtefx-aot-puff)" ${anim('aot-boil', 9 + i * 2, i * 3, 'ease-in-out')}/>`;
  });

  // Birds: freedom over the wall.
  const bird = (x, y, s, d) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><g ${anim('aot-glide', n1(16 + d), d)}><path d="M-16 -2Q-8 -10 0 0Q8 -10 16 -2Q8 -5 0 3Q-8 -5 -16 -2Z" fill="${ink}" fill-opacity="0.85"/></g></g>`;

  // Town roofs: steep gables, hipped roofs with dormers, chimneys, a church spire.
  let roofs = 'M-10 900V830';
  let extras = '';
  let x = -10;
  const roofRand = rng(77);
  while (x < 1610) {
    const w = 46 + roofRand() * 80;
    const h = 26 + roofRand() * 44;
    const base = 832 + roofRand() * 26;
    if (roofRand() < 0.4) {
      const k = w * 0.28;
      roofs += `L${n1(x)} ${n1(base)}L${n1(x + k)} ${n1(base - h)}H${n1(x + w - k)}L${n1(x + w)} ${n1(base)}`;
      if (w > 80) extras += `M${n1(x + w * 0.42)} ${n1(base - h * 0.5)}h10l5 -10l5 10h4V${n1(base)}H${n1(x + w * 0.42)}Z`;
    } else roofs += `L${n1(x)} ${n1(base)}L${n1(x + w / 2)} ${n1(base - h)}L${n1(x + w)} ${n1(base)}`;
    if (roofRand() < 0.45) extras += `M${n1(x + w * 0.72)} ${n1(base)}V${n1(base - h * 0.75 - 14)}h9V${n1(base)}Z`;
    x += w;
  }
  roofs += 'L1610 900H-10Z';
  const spire = `<path d="M232 900V742H222V722L244 712L266 722V742H256V900Z"/><path d="M244 560L230 712H258Z"/><path d="M242.5 548h3v14h-3zM238 552h12v2.6h-12z"/><path d="M237 728h14v14h-14z" fill="${mix(heat, t.bg, 0.35)}" fill-opacity="0.7"/>`;

  // Window lights in the town.
  let windows = '';
  for (let i = 0; i < 16; i++) {
    const wx = 40 + rand() * 1520;
    if (wx > 400 && wx < 1040 && rand() < 0.6) continue;
    windows += `<rect x="${n1(wx)}" y="${n1(856 + rand() * 30)}" width="5" height="7" fill="${heat}" fill-opacity="${n1(0.35 + rand() * 0.4)}"/>`;
  }

  // The banner: two crossed ODM blades over a crenellated wall line, our own
  // garrison device (no real insignia).
  const flagBlade = (rot) => `<g transform="rotate(${rot})"><path d="M-34 -2.6H22L30 0L22 2.6H-34Z" fill="${mix(t.text, t.muted, 0.2)}"/><path d="M-20 -2.6L-23 2.6M-6 -2.6L-9 2.6M8 -2.6L5 2.6" stroke="${ink}" stroke-width="0.8"/><path d="M-44 -3H-34V3H-44Z" fill="${mix(t.warning, t.bg, 0.45)}"/></g>`;
  const device = `${flagBlade(-32)}${flagBlade(212)}<path d="M-30 30V22H-24V26H-18V22H-12V26H-6V22H0V26H6V22H12V26H18V22H24V26H30V22V30Z" fill="${mix(t.text, t.muted, 0.35)}"/>`;
  const banner = `<g transform="translate(1268 640)"><path d="M0 0V250" stroke="${ink}" stroke-width="6"/><circle cx="0" cy="-4" r="6" fill="${ink}"/><g style="transform-origin: 0 10px; animation: dbtefx-aot-flag 7s ease-in-out infinite;"><path d="M-3 8H120Q112 50 120 92H-3Z" fill="${cloak}" stroke="${mix(t.accent, t.bg, 0.2)}" stroke-width="1.5"/><path d="M6 16H111M6 84H111" stroke="${mix(t.accent, t.text, 0.4)}" stroke-opacity="0.5"/><g transform="translate(60 46) scale(1.1)">${device}</g></g></g>`;

  return `<style>@keyframes dbtefx-aot-swing { 0%, 100% { transform: rotate(4deg); } 50% { transform: rotate(16deg); } }
@keyframes dbtefx-aot-swingb { 0%, 100% { transform: rotate(14deg); } 50% { transform: rotate(-20deg); } }
@keyframes dbtefx-aot-boil { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; } 50% { transform: translate(14px, -26px) scale(1.08); opacity: 1; } }
@keyframes dbtefx-aot-glide { 0% { transform: translate(0, 0); } 50% { transform: translate(-60px, -14px); } 100% { transform: translate(0, 0); } }
@keyframes dbtefx-aot-flag { 0%, 100% { transform: skewY(-3deg) scaleX(0.96); } 50% { transform: skewY(3deg) scaleX(1); } }</style>
<defs>
${glow('dbtefx-aot-heat', heat, 0.5, 0.6, 0.5, 0.55)}
${glow('dbtefx-aot-haze', t.muted, 0.5, 0.5, 0.5, 0.16)}
<radialGradient id="dbtefx-aot-puff" cx="0.42" cy="0.38" r="0.6"><stop offset="0" stop-color="${steam}" stop-opacity="0.22"/><stop offset="0.55" stop-color="${mix(steam, heat, 0.3)}" stop-opacity="0.1"/><stop offset="1" stop-color="${steam}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-aot-wall" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stop-color="${stone}" stop-opacity="0.5"/><stop offset="0.55" stop-color="${stone}"/><stop offset="1" stop-color="${stoneLit}"/></linearGradient>
<linearGradient id="dbtefx-aot-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${heat}" stop-opacity="0.18"/><stop offset="0.25" stop-color="${t.bg}" stop-opacity="0"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0.7"/></linearGradient>
<linearGradient id="dbtefx-aot-flesh" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="${mix(mix(t.danger, heat, 0.35), t.bg, 0.2)}"/><stop offset="0.3" stop-color="${mix(t.danger, t.bg, 0.45)}"/><stop offset="1" stop-color="${mix(t.danger, t.bg, 0.78)}"/></linearGradient>
<linearGradient id="dbtefx-aot-back" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(t.danger, t.bg, 0.55)}"/><stop offset="0.5" stop-color="${mix(mix(t.danger, heat, 0.25), t.bg, 0.3)}" stop-opacity="0.9"/><stop offset="1" stop-color="${steam}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-aot-town" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${heat}" stop-opacity="0"/><stop offset="0.6" stop-color="${heat}" stop-opacity="0.14"/><stop offset="1" stop-color="${heat}" stop-opacity="0.05"/></linearGradient>
<linearGradient id="dbtefx-aot-gas" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.text}" stop-opacity="0.5"/><stop offset="1" stop-color="${t.text}" stop-opacity="0"/></linearGradient>
</defs>
<rect x="0" y="0" width="${W}" height="520" fill="url(#dbtefx-aot-haze)"/>
<path d="M-10 560L120 520L260 540L420 500L560 530L700 505L820 520L900 500V600H-10Z" fill="${mix(t.bg, t.muted, 0.12)}" fill-opacity="0.8"/>
<ellipse cx="1370" cy="170" rx="420" ry="320" fill="url(#dbtefx-aot-heat)"/>
<g>${billows}</g>
<!--mid-->
<path d="${curvePath(TOP)}L1620 940Q820 640 -20 606Z" fill="url(#dbtefx-aot-wall)"/>
<path d="${curvePath(TOP)}L1620 940Q820 640 -20 606Z" fill="url(#dbtefx-aot-shade)"/>
<path d="${courses}" fill="none" stroke="${ink}" stroke-opacity="0.5" stroke-width="1.2"/>
<path d="${joints}" stroke="${ink}" stroke-opacity="0.32" stroke-width="1"/>
<path d="${curvePath(TOP)}" fill="none" stroke="${mix(heat, t.text, 0.4)}" stroke-opacity="0.7" stroke-width="3"/>
<path d="${curvePath(lerpCurve(0.035))}" fill="none" stroke="${ink}" stroke-opacity="0.6" stroke-width="2"/>
<g fill="${ink}">${cannons}</g>
${bird(1080, 150, 1.2, 0)}${bird(1150, 110, 0.9, 3)}${bird(1030, 190, 0.8, 6)}${bird(1210, 80, 0.8, 9)}
${hand}
${handSteam}
${swing(1432, 206, 290, 3.1, 8, 0, 1)}
<!--near-->
<rect x="0" y="760" width="${W}" height="140" fill="url(#dbtefx-aot-town)"/>
<g fill="${ink}"><path d="${roofs}${extras}"/>${spire}</g>
${windows}
${banner}`;
};

export default scene;

// Ash drifting down, embers lifting off the steam.
export const particles = [
  { kind: 'ash', count: 60, colors: ['muted', 'text'] },
  { kind: 'ember', count: 26, colors: ['accent2', 'warning'], column: true, columnX: 0.8 },
];

// WebGL layer (shader.js): the colossal steam column, a domain-warped fbm
// plume rising behind the wall, lit hot from below; cold overcast elsewhere.
export const shader = {
  uniforms: ['bg', 'muted', 'text', 'accent2'],
  frag: `
float steamAt(vec2 p, vec2 q, float t) { return fbm(p * 2.6 + q * 2.0 + vec2(0.0, -t * 3.5)); }
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time * 0.04;
  // Overcast dusk: warm haze low, cold cloud banks drifting high.
  vec3 sky = mix(u_bg + u_accent2 * 0.08, u_bg + u_muted * 0.08, smoothstep(0.35, 1.0, uv.y));
  float cloud = fbm(vec2(p.x * 1.2 + t, p.y * 3.5));
  sky += u_muted * 0.2 * smoothstep(0.5, 0.8, cloud) * smoothstep(0.4, 0.95, uv.y);
  // The steam column: rising out of the heat behind the wall, widening and
  // rolling; lit from below by the heat, shaded by a fake normal.
  float base = 0.52;
  float h = max(uv.y - base, 0.0);
  float cx = 0.83 * aspect + 0.06 * sin(h * 4.0 + t * 2.0) + h * 0.15;
  float width = 0.16 + h * 1.1;
  vec2 q = vec2(fbm(p * 1.6 + vec2(0.0, -t * 3.0)), fbm(p * 1.6 + vec2(4.1, -t * 2.5)));
  float b0 = steamAt(p, q, t);
  float b1 = steamAt(p + vec2(0.012, -0.018), q, t);
  float dx = abs(p.x - cx + (q.x - 0.5) * 0.45);
  float column = smoothstep(width, width * 0.25, dx) * smoothstep(base - 0.04, base + 0.1, uv.y);
  float plume = smoothstep(0.32, 0.62, b0 * 0.9 + column * 0.55 - 0.3) * column;
  float shade = clamp((b0 - b1) * 3.5 + 0.55, 0.0, 1.0);
  float hot = smoothstep(0.85, base, uv.y);
  vec3 cool = mix(u_muted * 0.45, u_text * 0.8, shade);
  vec3 warm = mix(u_accent2 * 0.55, mix(u_text, u_accent2, 0.6), shade);
  vec3 col = mix(sky, mix(cool, warm, hot), plume * 0.92);
  col += u_accent2 * 0.3 * smoothstep(0.55, 0.0, length((p - vec2(0.85 * aspect, base + 0.05)) * vec2(0.8, 2.6)));
  col *= 1.0 - 0.5 * dot(uv - 0.5, uv - 0.5) * 2.0;
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
