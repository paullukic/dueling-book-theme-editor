import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Dark Magic: the Dark Magic Circle (a heavy gold ring holding a black band
// of gold runes) turning slowly at the right edge, and the Dark Magician's
// staff raised across it, its green orb burning in a gold claw setting.
// Arcane smoke drifts behind (the shader); violet sparks hang in the air.

// Rune shapes about 10 units tall, centred on (0,0).
const RUNES = [
  'M0-5v10M-3-2h6', 'M-3 5l3-10 3 10', 'M-3-5h6v10', 'M-3 5V-5l6 5-6 5', 'M0-5a3 3 0 1 1 0 6v4M-3 5h6',
  'M-3-5l6 10M3-5l-6 10', 'M-3 5V-5h6M-3 0h4', 'M0-5v10M-3-5q3 4 6 0', 'M-3-5h6l-6 10h6', 'M-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0M0-5v2',
  'M-3-5v10l6-5', 'M3-5H-3v5h6v5H-3',
];

// Runes set tangentially round a ring.
const runeBand = (cx, cy, r, count, size, color, width, seed) => {
  const rand = rng(seed);
  let s = '';
  for (let i = 0; i < count; i++) {
    const a = (i * 360) / count;
    const [x, y] = polar(cx, cy, r, a);
    s += `<path transform="translate(${x} ${y}) rotate(${n1(a + 90)}) scale(${size})" d="${RUNES[Math.floor(rand() * RUNES.length)]}"/>`;
  }
  return `<g fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${s}</g>`;
};

const darkMagic = (t) => {
  const gold = t.warning;
  const goldDeep = mix(t.warning, t.bg, 0.5);
  const orb = t.success;
  const ink = mix(t.bg, '#000000', 0.5);
  const cx = 1450;
  const cy = 430;

  // The circle: outer rim, the black rune band, inner rim, an inner script ring and a pentacle.
  const pent = [];
  for (let i = 0; i < 5; i++) pent.push(polar(cx, cy, 214, -90 + i * 144).join(' '));
  const circle = `<circle cx="${cx}" cy="${cy}" r="372" fill="none" stroke="${goldDeep}" stroke-width="62"/>
<circle cx="${cx}" cy="${cy}" r="372" fill="none" stroke="${ink}" stroke-width="50"/>
<circle cx="${cx}" cy="${cy}" r="404" fill="none" stroke="${gold}" stroke-width="5"/>
<circle cx="${cx}" cy="${cy}" r="341" fill="none" stroke="${gold}" stroke-width="5"/>
<circle cx="${cx}" cy="${cy}" r="412" fill="none" stroke="${gold}" stroke-opacity="0.4" stroke-width="1.5"/>
${runeBand(cx, cy, 372, 46, 2.1, gold, 1.6, 31)}
<circle cx="${cx}" cy="${cy}" r="262" fill="none" stroke="${t.accent}" stroke-opacity="0.55" stroke-width="2"/>
<circle cx="${cx}" cy="${cy}" r="232" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="1.2"/>
${runeBand(cx, cy, 247, 40, 1.1, t.accent, 1.3, 77).replace('<g ', '<g stroke-opacity="0.75" ')}
<path d="M${pent.join('L')}Z" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="1.6"/>`;

  // The staff: a long rod from the lower right up across the circle, gold
  // bands, and a claw of two curled prongs gripping the orb.
  const ox = 1170;
  const oy = 252;
  const rod = `M1600 972L${ox + 30} ${oy + 58}L${ox + 56} ${oy + 36}L1640 932Z`;
  const bands = [0.1, 0.15, 0.48].map((k) => {
    const x = ox + 42 + (1621 - ox - 42) * k;
    const y = oy + 46 + (950 - oy - 46) * k;
    return `<path d="M${n1(x - 13)} ${n1(y + 9)}L${n1(x + 13)} ${n1(y - 9)}" stroke="${gold}" stroke-width="9" stroke-linecap="round"/><path d="M${n1(x - 17)} ${n1(y + 12)}L${n1(x + 17)} ${n1(y - 12)}" stroke="${goldDeep}" stroke-width="2" stroke-linecap="round"/>`;
  }).join('');
  const claw = `<path d="M${ox + 34} ${oy + 64}L${ox + 66} ${oy + 30}L${ox + 74} ${oy + 52}L${ox + 50} ${oy + 76}Z" fill="${goldDeep}" stroke="${gold}" stroke-width="2"/>
<path d="M${ox + 40} ${oy + 44}C${ox + 86} ${oy - 4} ${ox + 74} ${oy - 78} ${ox + 18} ${oy - 92}C${ox + 52} ${oy - 70} ${ox + 60} ${oy - 20} ${ox + 30} ${oy + 30}Z" fill="${gold}" stroke="${goldDeep}" stroke-width="2"/>
<path d="M${ox + 30} ${oy + 52}C${ox - 20} ${oy + 76} ${ox - 86} ${oy + 40} ${ox - 92} ${oy - 18}C${ox - 66} ${oy + 22} ${ox - 18} ${oy + 40} ${ox + 22} ${oy + 36}Z" fill="${gold}" stroke="${goldDeep}" stroke-width="2"/>
<path d="M${ox + 22} ${oy - 84}C${ox + 58} ${oy - 62} ${ox + 66} ${oy - 18} ${ox + 44} ${oy + 22}M${ox - 84} ${oy - 12}C${ox - 60} ${oy + 24} ${ox - 20} ${oy + 44} ${ox + 18} ${oy + 44}" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="2"/>`;

  // Sparks of cast magic along the staff's line of power.
  const rand = rng(46);
  let sparks = '';
  for (let i = 0; i < 9; i++) {
    const [x, y] = polar(ox, oy, 70 + rand() * 120, 160 + rand() * 120);
    sparks += `<path d="M${x} ${n1(y - 7)}L${n1(x + 2)} ${n1(y - 2)}L${n1(x + 7)} ${y}L${n1(x + 2)} ${n1(y + 2)}L${x} ${n1(y + 7)}L${n1(x - 2)} ${n1(y + 2)}L${n1(x - 7)} ${y}L${n1(x - 2)} ${n1(y - 2)}Z" fill="${i % 3 ? t.accent : gold}" ${anim('pulse', n1(2 + rand() * 3), rand() * 4, 'ease-in-out')}/>`;
  }

  return `<defs>
<radialGradient id="dbtefx-dm-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.7"/></radialGradient>
<radialGradient id="dbtefx-dm-core" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="420"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.12"/><stop offset="0.75" stop-color="${t.accent}" stop-opacity="0.06"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dm-orb" cx="0.38" cy="0.35"><stop offset="0" stop-color="#ffffff"/><stop offset="0.25" stop-color="${mix(orb, '#ffffff', 0.4)}"/><stop offset="0.7" stop-color="${orb}"/><stop offset="1" stop-color="${mix(orb, '#000000', 0.55)}"/></radialGradient>
<radialGradient id="dbtefx-dm-halo"><stop offset="0" stop-color="${orb}" stop-opacity="0.55"/><stop offset="0.4" stop-color="${orb}" stop-opacity="0.18"/><stop offset="1" stop-color="${orb}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dm-rod" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stop-color="${mix(t.accent, t.bg, 0.35)}"/><stop offset="0.5" stop-color="${mix(t.accent, t.bg, 0.7)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-dm-vig)"/>
<!--mid-->
<circle cx="${cx}" cy="${cy}" r="420" fill="url(#dbtefx-dm-core)"/>
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 240s linear infinite;">${circle}</g>
<!--near-->
<circle cx="${ox}" cy="${oy}" r="190" fill="url(#dbtefx-dm-halo)" ${anim('bloom', 5, 0, 'ease-in-out')}/>
<path d="${rod}" fill="url(#dbtefx-dm-rod)" stroke="${mix(t.accent, t.bg, 0.2)}" stroke-width="1.5"/>
<path d="M1621 950L${ox + 42} ${oy + 46}" stroke="${t.accent}" stroke-opacity="0.8" stroke-width="2"/>
${bands}
${claw}
<circle cx="${ox}" cy="${oy}" r="44" fill="url(#dbtefx-dm-orb)" stroke="${goldDeep}" stroke-width="2"/>
<ellipse cx="${ox - 14}" cy="${oy - 16}" rx="12" ry="7" fill="#ffffff" fill-opacity="0.55" transform="rotate(-35 ${ox - 14} ${oy - 16})"/>
${sparks}`;
};

export default darkMagic;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'spark', count: 50, colors: ['accent', 'warning'] }, { kind: 'mote', count: 24, colors: ['success'], rise: true, speed: 0.4 }];

// WebGL layer (shader.js): drifting arcane smoke behind the circle, a
// two-level domain-warped fbm in the theme's violet and gold.
export const shader = {
  uniforms: ['bg', 'accent', 'accent2'],
  frag: `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y * 2.2;
  float t = u_time * 0.03;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.5 * q + vec2(1.7, 9.2) + 0.6 * t), fbm(p + 3.5 * q + vec2(8.3, 2.8) - 0.4 * t));
  float f = fbm(p + 3.0 * r);
  vec3 col = u_bg;
  col = mix(col, u_accent * 0.5, smoothstep(0.3, 0.9, f) * 0.85);
  col = mix(col, u_accent2 * 0.7, smoothstep(0.6, 1.1, length(r) * f) * 0.5);
  col *= 1.0 - 0.5 * dot(uv - 0.5, uv - 0.5) * 2.0;
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
