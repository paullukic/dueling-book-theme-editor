import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Solo Leveling: a Gate tears open over a ruined city. The blue vortex turns
// above broken towers (shader; a soft SVG glow stands in without WebGL),
// rubble lifts toward it, and below, out of a pool of violet shadow, the
// shadow army rises rank on rank with their eyes lit.

const gx = 1225;
const gy = 236;

const scene = (t) => {
  const rand = rng(2024);
  const cyan = t.accent;
  const ice = mix(cyan, '#ffffff', 0.6);
  const violet = t.accent2;
  const night = mix(t.bg, '#000000', 0.35);

  // Ruined skyline: towers with broken, jagged crowns; edges facing the Gate catch its light.
  const city = (yBase, hMin, hMax, seed, fill, rim) => {
    const r = rng(seed);
    let body = '';
    let edge = '';
    let x = -20;
    while (x < W + 20) {
      const w = 24 + r() * 58;
      const h = hMin + r() * (x > 520 && x < 1000 ? (hMax - hMin) * 0.35 : hMax - hMin);
      const y = yBase - h;
      const broken = r() < 0.6;
      let crown = `H${n1(x + w)}`;
      if (broken) {
        const k = 3 + Math.floor(r() * 3);
        crown = '';
        for (let i = 1; i <= k; i++) crown += `L${n1(x + (w * i) / k)} ${n1(y + (i === k ? r() * 40 : r() < 0.5 ? r() * 8 : r() * 46))}`;
      }
      body += `M${n1(x)} ${H}V${n1(y)}${crown}V${H}Z`;
      if (rim && x + w > 760 && r() < 0.6) edge += `M${n1(x + w)} ${n1(y + 6)}V${n1(y + 30 + h * 0.18)}`;
      x += w + r() * 10;
    }
    return `<path d="${body}" fill="${fill}"/>${edge ? `<path d="${edge}" stroke="${cyan}" stroke-opacity="${rim}" stroke-width="1.6"/>` : ''}`;
  };

  // Rubble lifting toward the Gate.
  const rocks = [[1010, 420, 14], [1080, 520, 9], [1420, 470, 12], [1340, 560, 8], [1150, 610, 10], [960, 300, 7], [1480, 330, 9], [1260, 500, 6]]
    .map(([x, y, s], i) => {
      const pts = Array.from({ length: 8 }, (_, k) => polar(0, 0, s * (0.55 + rand() * 0.6), k * 45 + rand() * 20).join(' '));
      return `<g transform="translate(${x} ${y})"><g style="animation: dbtefx-sl-lift ${n1(9 + rand() * 6)}s ease-in-out ${n1(-i * 1.7)}s infinite;"><path d="M${pts.join('L')}Z" fill="${mix(t.bg, t.muted, 0.08)}" stroke="${ice}" stroke-opacity="0.3" stroke-width="0.8"/></g></g>`;
    })
    .join('');

  // The shadow army: rank after rank of helmeted silhouettes rising out of
  // the violet shadow, every one with lit eyes; spears and a few horned helms.
  let army = '';
  [[706, 0.42, 1.0], [738, 0.56, 1.6], [778, 0.74, 0.7], [828, 0.98, 2.4]].forEach(([y, sc, delay], row) => {
    let bodies = '';
    let eyes = '';
    let spears = '';
    let x = 1004 + rand() * 20 - row * 24;
    while (x < 1470) {
      const s = sc * (0.85 + rand() * 0.3);
      const yy = y + (rand() - 0.5) * 10 * sc;
      const X = (v) => Math.round(x + v * s);
      const Y = (v) => Math.round(yy + v * s);
      const horn = rand() < 0.14 ? `M${X(-5)} ${Y(-36)}L${X(-16)} ${Y(-52)}L${X(-8)} ${Y(-35)}ZM${X(5)} ${Y(-36)}L${X(16)} ${Y(-52)}L${X(8)} ${Y(-35)}Z` : '';
      bodies += `M${X(-7)} ${Y(-28)}C${X(-8)} ${Y(-38)} ${X(-3)} ${Y(-44)} ${X(0)} ${Y(-48)}C${X(3)} ${Y(-44)} ${X(8)} ${Y(-38)} ${X(7)} ${Y(-28)}L${X(8)} ${Y(-20)}L${X(19)} ${Y(-18)}L${X(29)} ${Y(-24)}L${X(27)} ${Y(-10)}C${X(28)} ${Y(-4)} ${X(27)} ${Y(10)} ${X(25)} ${Y(30)}H${X(-25)}C${X(-27)} ${Y(10)} ${X(-28)} ${Y(-4)} ${X(-27)} ${Y(-10)}L${X(-29)} ${Y(-24)}L${X(-19)} ${Y(-18)}L${X(-8)} ${Y(-20)}Z${horn}`;
      eyes += `M${X(-5)} ${Y(-31)}L${X(-1.4)} ${Y(-30)}M${X(5)} ${Y(-31)}L${X(1.4)} ${Y(-30)}`;
      if (rand() < 0.3) spears += `M${X(22)} ${Y(10)}L${X(26)} ${Y(-90)}`;
      x += s * (36 + rand() * 30);
    }
    const ew = n1(1.3 * sc + 0.5);
    army += `<path d="${spears}" stroke="${night}" stroke-width="${n1(2.4 * sc + 0.6)}"/><path d="${bodies}" fill="url(#dbtefx-sl-shade)" stroke="${violet}" stroke-opacity="0.3" stroke-width="0.8"/><g style="animation: dbtefx-pulse 3.6s ease-in-out ${-delay}s infinite;"><path d="${eyes}" stroke="${violet}" stroke-opacity="0.5" stroke-width="${n1(ew * 3)}" stroke-linecap="round"/><path d="${eyes}" stroke="${mix(violet, '#ffffff', 0.6)}" stroke-width="${ew}" stroke-linecap="round"/></g>`;
  });

  // Shadow smoke climbing out of the pool.
  const wisps = [1130, 1210, 1300, 1380, 1450, 1060].map((x, i) => `<path d="M${x} 880C${x - 20} 820 ${x + 26} 780 ${x + 4} 720S${x - 24} 640 ${x + 10} 590" stroke="url(#dbtefx-sl-smoke)" stroke-width="${6 + (i % 3) * 4}" stroke-linecap="round" fill="none" style="animation: dbtefx-sl-wisp ${n1(7 + i * 0.9)}s ease-out ${n1(-i * 1.3)}s infinite;"/>`).join('');

  return `<defs>
<radialGradient id="dbtefx-sl-gate" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.22" stop-color="${ice}" stop-opacity="0.35"/><stop offset="0.7" stop-color="${cyan}" stop-opacity="0.14"/><stop offset="0.9" stop-color="${ice}" stop-opacity="0.16"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sl-glare" gradientUnits="userSpaceOnUse" cx="${gx}" cy="${gy}" r="620"><stop offset="0" stop-color="${cyan}" stop-opacity="0.22"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sl-shade" gradientUnits="userSpaceOnUse" x1="0" y1="700" x2="0" y2="900"><stop offset="0" stop-color="${night}"/><stop offset="0.6" stop-color="${night}"/><stop offset="1" stop-color="${mix(night, violet, 0.3)}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-sl-pool" gradientUnits="userSpaceOnUse" cx="1280" cy="880" r="360" gradientTransform="translate(0 616) scale(1 0.3)"><stop offset="0" stop-color="${violet}" stop-opacity="0.55"/><stop offset="0.6" stop-color="${violet}" stop-opacity="0.18"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sl-smoke" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${violet}" stop-opacity="0.38"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-sl-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cyan}" stop-opacity="0"/><stop offset="1" stop-color="${mix(t.bg, cyan, 0.2)}" stop-opacity="0.5"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sl-glare)"/>
<g transform="translate(${gx} ${gy}) rotate(-14) scale(1 0.62)"><circle r="250" fill="url(#dbtefx-sl-gate)"/></g>
${city(900, 220, 420, 7, mix(t.bg, cyan, 0.05), 0.1)}
<rect y="420" width="${W}" height="480" fill="url(#dbtefx-sl-haze)"/>
<!--mid-->
${city(900, 90, 280, 19, night, 0.45)}
${rocks}
<!--near-->
<ellipse cx="1280" cy="880" rx="360" ry="108" fill="url(#dbtefx-sl-pool)"/>
${wisps}
${army}
<style>
@keyframes dbtefx-sl-lift { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(8px, -26px) rotate(24deg); } }
@keyframes dbtefx-sl-wisp { 0% { transform: translateY(40px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(-120px); opacity: 0; } }
</style>`;
};

export default scene;

export const particles = [
  { kind: 'mote', count: 40, colors: ['accent', 'text'], rise: true, column: true, columnX: 0.77 },
  { kind: 'ember', count: 34, colors: ['accent2'], column: true, columnX: 0.8, speed: 0.5 },
  { kind: 'star', count: 50, colors: ['text'] },
];

// WebGL layer: the Gate itself, a blue vortex turning above the ruins, its
// arms pulled into a white core, the sky around lit by its glare.
export const shader = {
  uniforms: ['bg', 'accent', 'accent2', 'text'],
  frag: `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 c = vec2(0.795 * asp, 0.738);
  vec2 d = p - c;
  float ca = cos(0.24), sa = sin(0.24);
  vec2 q = vec2(ca * d.x - sa * d.y, sa * d.x + ca * d.y) * vec2(1.0, 1.0 / 0.62);
  float r = length(q);
  float t = u_time * 0.25;
  float th = t + 0.55 / (r + 0.08);
  vec2 s = vec2(cos(th) * q.x - sin(th) * q.y, sin(th) * q.x + cos(th) * q.y);
  float cl = fbm(s * 5.0 + 3.0);
  float cl2 = fbm(s * 11.0 - 7.0);
  float fall = exp(-r * 4.2);
  float core = exp(-r * 18.0);
  float sky = fbm(p * 1.6 + vec2(u_time * 0.01, 0.0));
  vec3 col = u_bg * 0.85 + mix(u_bg, u_accent, 0.1) * smoothstep(0.45, 0.85, sky) * 0.7;
  float arms = smoothstep(0.38, 0.8, cl * 0.75 + cl2 * 0.35);
  col += u_accent * 0.85 * arms * fall;
  col += mix(u_accent, u_text, 0.7) * 0.5 * pow(arms, 3.0) * fall;
  col = mix(col, u_bg * 0.5, (1.0 - arms) * smoothstep(0.32, 0.1, r) * 0.5);
  float storm = fbm(s * 3.0 + 11.0);
  col = mix(col, u_bg * 0.35, smoothstep(0.22, 0.42, r) * smoothstep(0.9, 0.45, r) * smoothstep(0.45, 0.75, storm) * 0.8);
  col += mix(u_accent, u_text, 0.4) * 0.25 * smoothstep(0.55, 0.8, storm) * exp(-pow((r - 0.3) * 8.0, 2.0));
  col += mix(u_text, vec3(1.0), 0.5) * core;
  col += u_accent * 0.1 * exp(-r * 1.6);
  float k = floor(u_time / 3.0);
  float f = fract(u_time / 3.0);
  float bolt = step(0.6, hash(vec2(k, 2.0))) * smoothstep(0.08, 0.0, f) * exp(-pow((r - 0.24) * 18.0, 2.0)) * step(0.55, noise(vec2(atan(q.y, q.x) * 6.0, k)));
  col += mix(u_accent, vec3(1.0), 0.6) * bolt * 0.8;
  col += u_accent2 * 0.14 * smoothstep(0.35, 0.0, uv.y) * smoothstep(0.3, 0.9, uv.x);
  col *= 1.0 - 0.5 * dot(uv - vec2(0.6, 0.55), uv - vec2(0.6, 0.55));
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
