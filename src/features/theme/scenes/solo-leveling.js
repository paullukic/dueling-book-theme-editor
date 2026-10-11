import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Solo Leveling: a dungeon Gate stands open in a ruined street. The upright
// oval portal swirls blue at the end of the road (shader; a glowing SVG oval
// stands in without WebGL), rubble lifts toward it, and in front of it a rank
// of shadow soldiers rises out of black ground smoke, backlit, eyes lit violet.

// The Gate, in viewBox units: centre, half-width, half-height (its foot on the street).
const gx = 1352;
const gy = 470;
const rx = 84;
const ry = 232;
const ground = gy + ry - 6;

const scene = (t) => {
  const rand = rng(2024);
  const cyan = t.accent;
  const ice = mix(cyan, '#ffffff', 0.6);
  const violet = t.accent2;
  const night = mix(t.bg, '#000000', 0.45);

  // Ruined skyline: towers with broken crowns; edges facing the Gate catch its light.
  const city = (yBase, hMin, hMax, seed, fill, rim, skip = false) => {
    const r = rng(seed);
    let body = '';
    let edge = '';
    let x = -20;
    while (x < W + 20) {
      const w = 24 + r() * 58;
      const h = hMin + r() * (hMax - hMin);
      const y = yBase - h;
      let crown = `H${n1(x + w)}`;
      if (r() < 0.6) {
        const k = 3 + Math.floor(r() * 3);
        crown = '';
        for (let i = 1; i <= k; i++) crown += `L${n1(x + (w * i) / k)} ${n1(y + (i === k ? r() * 40 : r() < 0.5 ? r() * 8 : r() * 46))}`;
      }
      if (!(skip && x + w > gx - rx - 24 && x < gx + rx + 24)) body += `M${n1(x)} ${H}V${n1(y)}${crown}V${H}Z`;
      if (rim && x + w > 1000 && r() < 0.7 && !(skip && x + w > gx - rx - 24 && x < gx + rx + 24)) edge += `M${n1(x + w)} ${n1(y + 6)}V${n1(y + 30 + h * 0.2)}`;
      x += w + r() * 10;
    }
    return `<path d="${body}" fill="${fill}"/>${edge ? `<path d="${edge}" stroke="${cyan}" stroke-opacity="${rim}" stroke-width="1.6"/>` : ''}`;
  };

  // The street running up to the Gate: kerbs, broken lane marks, cracks.
  const street = `<path d="M0 ${H}L${gx - 70} ${ground}H${gx + 70}L${W} ${H}Z" fill="url(#dbtefx-sl-road)"/>
<path d="M${gx - 70} ${ground}L760 ${H}M${gx + 70} ${ground}L${W} 820" stroke="${cyan}" stroke-opacity="0.22" stroke-width="2"/>
<path d="M${gx} ${ground + 14}L${gx - 10} ${ground + 40}M${gx - 18} ${ground + 64}L${gx - 34} ${ground + 104}M${gx - 50} ${ground + 136}L${gx - 76} ${H}" stroke="${ice}" stroke-opacity="0.3" stroke-width="3"/>
<path d="M${gx - 40} ${ground + 30}l-40 22l-26 -4l-30 24M${gx + 30} ${ground + 40}l36 26l40 2" fill="none" stroke="#000000" stroke-opacity="0.5" stroke-width="1.5"/>`;

  // Rubble lifting toward the Gate.
  const rocks = [[1250, 300, 9], [1460, 360, 12], [1430, 560, 8], [1270, 600, 10], [1500, 220, 7], [1200, 470, 6]]
    .map(([x, y, s], i) => {
      const pts = Array.from({ length: 8 }, (_, k) => polar(0, 0, s * (0.55 + rand() * 0.6), k * 45 + rand() * 20).join(' '));
      return `<g transform="translate(${x} ${y})"><g style="animation: dbtefx-sl-lift ${n1(9 + rand() * 6)}s ease-in-out ${n1(-i * 1.7)}s infinite;"><path d="M${pts.join('L')}Z" fill="${night}" stroke="${ice}" stroke-opacity="0.4" stroke-width="0.9"/></g></g>`;
    })
    .join('');

  // Shadow soldiers: helm, pauldrons, cloak and weapon, backlit by the Gate.
  const soldier = (x, base, s, kind, delay) => {
    const k = (v) => n1(v * s);
    const C = (d) => d.replace(/-?\d+(\.\d+)?/g, (v) => k(+v));
    const helm = kind === 'horn'
      ? C('M-11 -168C-14 -186 -10 -200 0 -205C10 -200 14 -186 11 -168C6 -162 -6 -162 -11 -168ZM-9 -194L-30 -228L-15 -191ZM9 -194L30 -228L15 -191Z')
      : C('M-11 -168C-14 -186 -10 -200 0 -205C10 -200 14 -186 11 -168C6 -162 -6 -162 -11 -168Z');
    const plume = kind === 'plume' ? C('M0 -204C12 -224 34 -224 50 -206C38 -212 22 -210 4 -198Z') : '';
    const torso = C('M-8 -163C-18 -162 -30 -158 -40 -150C-48 -144 -50 -134 -46 -126C-42 -120 -38 -116 -36 -108C-34 -96 -30 -86 -24 -76C-20 -70 -20 -62 -22 -50L-26 -20L-28 0H28L26 -20L22 -50C20 -62 20 -70 24 -76C30 -86 34 -96 36 -108C38 -116 42 -120 46 -126C50 -134 48 -144 40 -150C30 -158 18 -162 8 -163Z');
    const rim = C('M-46 -128C-50 -138 -48 -146 -40 -151C-30 -158 -18 -162 -8 -163M11 -170C14 -186 10 -200 0 -205M8 -163C18 -162 30 -158 40 -151C48 -146 50 -138 46 -128');
    const cape = C('M-40 -150C-54 -100 -62 -50 -74 0H70C60 -56 52 -100 40 -150Z');
    const gear = kind === 'horn'
      ? C('M46 -270L42 0')
      : kind === 'plume' ? C('M-44 -82L-86 -6M-54 -88L-36 -76') : C('M44 -86L64 6M38 -88L54 -80');
    const tip = kind === 'horn' ? `<path d="${C('M46 -292L53 -264H39Z')}" fill="${night}"/>` : '';
    const eyes = C('M-9 -182L-2.5 -180.5M9 -182L2.5 -180.5');
    return `<g transform="translate(${x} ${base})"><path d="${cape}" fill="url(#dbtefx-sl-cape)"/><path d="${C('M-42 -136L-44 -70M42 -136L44 -70')}${gear}" stroke="${night}" stroke-width="${k(8)}" stroke-linecap="round"/>${tip}<path d="${torso}${helm}${plume}" fill="url(#dbtefx-sl-shade)"/><path d="${rim}" fill="none" stroke="${ice}" stroke-opacity="0.55" stroke-width="1.4"/><g style="animation: dbtefx-pulse 3.4s ease-in-out ${-delay}s infinite;"><ellipse cx="0" cy="${k(-181)}" rx="${k(20)}" ry="${k(8)}" fill="url(#dbtefx-sl-eye)"/><path d="${eyes}" stroke="${mix(violet, '#ffffff', 0.55)}" stroke-width="${k(2.6)}" stroke-linecap="round"/></g></g>`;
  };
  const army = [[1284, 770, 0.74, 'axe', 1.4], [1404, 772, 0.76, 'horn', 2.6], [1344, 812, 0.92, 'plume', 0]]
    .map(([x, b, s, kind, d]) => soldier(x, b, s, kind, d))
    .join('');

  // Black ground smoke the soldiers rise out of.
  const wisps = [1250, 1310, 1380, 1440, 1500].map((x, i) => `<path d="M${x} 900C${x - 20} 860 ${x + 22} 830 ${x + 4} 790S${x - 20} 740 ${x + 8} 700" stroke="url(#dbtefx-sl-smoke)" stroke-width="${12 + (i % 3) * 6}" stroke-linecap="round" fill="none" style="animation: dbtefx-sl-wisp ${n1(7 + i * 0.9)}s ease-out ${n1(-i * 1.3)}s infinite;"/>`).join('');

  return `<defs>
<radialGradient id="dbtefx-sl-gate" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${ice}" stop-opacity="0.5"/><stop offset="0.55" stop-color="${cyan}" stop-opacity="0.3"/><stop offset="0.86" stop-color="${mix(t.bg, cyan, 0.4)}" stop-opacity="0.5"/><stop offset="0.95" stop-color="${ice}" stop-opacity="0.75"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sl-glare" gradientUnits="userSpaceOnUse" cx="${gx}" cy="${gy}" r="520"><stop offset="0" stop-color="${cyan}" stop-opacity="0.22"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sl-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, cyan, 0.16)}"/><stop offset="1" stop-color="${night}"/></linearGradient>
<radialGradient id="dbtefx-sl-spill" gradientUnits="userSpaceOnUse" cx="${gx}" cy="${ground}" r="260" gradientTransform="translate(0 ${n1(ground * 0.7)}) scale(1 0.3)"><stop offset="0" stop-color="${ice}" stop-opacity="0.45"/><stop offset="1" stop-color="${cyan}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sl-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}"/><stop offset="0.7" stop-color="${night}"/><stop offset="1" stop-color="${night}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-sl-cape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(night, violet, 0.15)}"/><stop offset="1" stop-color="${night}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-sl-eye"><stop offset="0" stop-color="${violet}" stop-opacity="0.95"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-sl-fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0"/><stop offset="0.5" stop-color="${mix(t.bg, violet, 0.12)}" stop-opacity="0.75"/><stop offset="1" stop-color="#000000" stop-opacity="0.95"/></linearGradient>
<linearGradient id="dbtefx-sl-smoke" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(night, violet, 0.3)}" stop-opacity="0.7"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-sl-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cyan}" stop-opacity="0"/><stop offset="1" stop-color="${mix(t.bg, cyan, 0.2)}" stop-opacity="0.45"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sl-glare)"/>
${city(ground, 120, 280, 7, mix(t.bg, cyan, 0.04), 0.12, true)}
<rect y="380" width="${W}" height="${ground - 380}" fill="url(#dbtefx-sl-haze)"/>
${street}
<ellipse cx="${gx}" cy="${ground}" rx="260" ry="78" fill="url(#dbtefx-sl-spill)"/>
<ellipse cx="${gx}" cy="${gy}" rx="${rx + 10}" ry="${ry + 10}" fill="url(#dbtefx-sl-gate)"/>
<!--mid-->
${city(H, 40, 150, 19, night, 0.45)}
${rocks}
<!--near-->
<rect y="700" width="${W}" height="200" fill="url(#dbtefx-sl-fog)"/>
${wisps}
${army}
<style>
@keyframes dbtefx-sl-lift { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-8px, -26px) rotate(24deg); } }
@keyframes dbtefx-sl-wisp { 0% { transform: translateY(40px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(-110px); opacity: 0; } }
</style>`;
};

export default scene;

export const particles = [
  { kind: 'mote', count: 40, colors: ['accent', 'text'], rise: true, column: true, columnX: 0.86 },
  { kind: 'ember', count: 30, colors: ['accent2'], column: true, columnX: 0.86, speed: 0.5 },
  { kind: 'star', count: 50, colors: ['text'] },
];

// WebGL layer: the Gate's surface. An upright oval of blue light standing on
// the street: its face swirls toward a bright heart, its rim crackles, and
// its glare washes the sky and the road around it.
export const shader = {
  uniforms: ['bg', 'accent', 'accent2', 'text'],
  frag: `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 c = vec2(0.885 * asp, 0.478);
  vec2 q = (p - c) / vec2(0.094, 0.258);
  float r = length(q);
  float a = atan(q.y, q.x);
  float t = u_time * 0.3;
  float th = t + 1.1 / (r + 0.25);
  vec2 s = vec2(cos(th) * q.x - sin(th) * q.y, sin(th) * q.x + cos(th) * q.y);
  float sw = fbm(s * 2.6 + 4.0);
  float sw2 = fbm(s * 6.0 - 3.0);
  float inside = smoothstep(1.02, 0.94, r);
  float sky = fbm(p * 1.6 + vec2(u_time * 0.01, 0.0));
  vec3 col = u_bg * 0.85 + mix(u_bg, u_accent, 0.1) * smoothstep(0.45, 0.85, sky) * 0.6;
  col += u_accent * 0.2 * exp(-max(r - 1.0, 0.0) * 1.8);
  vec3 face = mix(mix(u_bg, u_accent, 0.25), u_accent, 0.45 + 0.55 * smoothstep(0.3, 0.8, sw * 0.8 + sw2 * 0.3));
  face += mix(u_accent, u_text, 0.7) * pow(smoothstep(0.5, 0.85, sw2), 2.0) * 0.6;
  face += mix(u_text, vec3(1.0), 0.5) * exp(-r * 3.2) * 0.8;
  col = mix(col, face, inside);
  float crackle = 0.6 + 0.8 * noise(vec2(a * 9.0, u_time * 3.0));
  col += mix(u_accent, vec3(1.0), 0.55) * exp(-pow((r - 1.0) * 14.0, 2.0)) * crackle;
  float k = floor(u_time / 2.5);
  float f = fract(u_time / 2.5);
  float bolt = step(0.5, hash(vec2(k, 5.0))) * smoothstep(0.1, 0.0, f) * exp(-pow((r - 1.15) * 10.0, 2.0)) * step(0.6, noise(vec2(a * 5.0, k)));
  col += mix(u_accent, vec3(1.0), 0.6) * bolt;
  col += u_accent2 * 0.1 * smoothstep(0.3, 0.0, uv.y) * smoothstep(0.4, 0.95, uv.x);
  col *= 1.0 - 0.5 * dot(uv - vec2(0.6, 0.55), uv - vec2(0.6, 0.55));
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
