import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Dark Magic: the Dark Magic Circle (a heavy gold ring holding a black band
// of gold runes) turning slowly at the right edge, and the Dark Magician
// himself, the real card artwork, standing inside it. Arcane smoke drifts
// behind (the shader). The art loads live from DuelingBook (cardart.js);
// without it the circle and smoke remain.

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
  const ink = mix(t.bg, '#000000', 0.5);
  const cx = 1420;
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

  return `<style>${CARD_ART_KEYFRAMES}</style><defs>
<radialGradient id="dbtefx-dm-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.7"/></radialGradient>
<radialGradient id="dbtefx-dm-core" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="420"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.12"/><stop offset="0.75" stop-color="${t.accent}" stop-opacity="0.06"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dm-hole"><stop offset="0.45" stop-color="#000000"/><stop offset="1" stop-color="#ffffff"/></radialGradient>
<mask id="dbtefx-dm-links" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#ffffff"/><ellipse cx="1360" cy="175" rx="200" ry="140" fill="url(#dbtefx-dm-hole)"/></mask>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-dm-vig)"/>
<!--mid-->
<g class="dbtefx-dm-seal"><circle cx="${cx}" cy="${cy}" r="420" fill="url(#dbtefx-dm-core)"/>
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 240s linear infinite;">${circle}</g></g>
${cardArt(t, { id: 'dbtefx-dm-hero', card: CARDS.darkMagician, x: 1330, y: 120, w: 300, h: 620, focus: [0.5, 0.45], zoom: 0.9, blend: 'normal', feather: 0.55, fade: 0.6, backdrop: mix(t.bg, t.accent, 0.15), backdropAmt: 0.7, glow: t.accent, breathe: 14 })}`;
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
