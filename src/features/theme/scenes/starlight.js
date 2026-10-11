import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Starlight: a Starlight Rare seen up close. The whole surface is the foil:
// fine horizontal prismatic lines whose rainbow slides as if the card were
// tilting under a lamp. One great foil card stands on the right, its name in
// silver foil, a starburst in its art box; a band of light sweeps across it.
// `foil(t, light)` draws the dark (navy/black) or light (silver-white) cut.

// The prism: six tokens around the colour wheel (rose, gold, mint, cyan, blue, violet).
const PRISM = ['danger', 'warning', 'success', 'accent', 'link', 'accent2'];
const prismStops = (t, light, o = 1) =>
  [...PRISM, PRISM[0]]
    .map((k, i) => `<stop offset="${n1((i / 6) * 100)}%" stop-color="${light ? mix(t[k], '#ffffff', 0.2) : mix(t[k], '#ffffff', 0.12)}" stop-opacity="${o}"/>`)
    .join('');

// A four-point foil glint (long thin rays, the Starlight sparkle).
const glint = (x, y, r, k = 0.16) =>
  `M${x} ${n1(y - r)}Q${n1(x + r * k)} ${n1(y - r * k)} ${n1(x + r)} ${y}Q${n1(x + r * k)} ${n1(y + r * k)} ${x} ${n1(y + r)}Q${n1(x - r * k)} ${n1(y + r * k)} ${n1(x - r)} ${y}Q${n1(x - r * k)} ${n1(y - r * k)} ${x} ${n1(y - r)}Z`;

export const foil = (t, light) => {
  const rand = rng(light ? 77 : 71);
  const ink = light ? t.text : '#000000';
  const silverHi = light ? '#ffffff' : t.text;
  const silver = light ? mix(t.border, t.bg, 0.35) : mix(t.text, t.muted, 0.45);
  const silverLo = light ? mix(t.muted, t.border, 0.4) : mix(t.muted, t.bg, 0.45);

  // Card geometry (59 x 86 proportions), tilted a little, in the right third.
  const cw = 336;
  const ch = 490;
  const cx = 1222;
  const cy = 452;
  const x0 = -cw / 2;
  const y0 = -ch / 2;
  const body = light ? mix(t.bg, t.border, 0.28) : mix(t.accent2, t.bg, 0.82);
  const bodyLo = light ? mix(t.bg, t.border, 0.5) : t.bg;

  // Level stars on the card: eight foil sparkles in a row, right-aligned.
  let levels = '';
  for (let i = 0; i < 8; i++) {
    const sx = n1(x0 + cw - 40 - i * 25);
    levels += `<circle cx="${sx}" cy="${y0 + 84}" r="9.5" fill="${light ? t.accent2 : mix(t.danger, t.warning, 0.5)}" fill-opacity="${light ? 0.75 : 0.95}" stroke="${silverHi}" stroke-opacity="0.8" stroke-width="1.2"/><path d="${glint(sx, y0 + 84, 7.5, 0.22)}" fill="${light ? '#ffffff' : t.warning}"/>`;
  }

  // Art box: a starburst of light rays behind one great four-point star.
  const ax = x0 + 36;
  const ay = y0 + 106;
  const as = cw - 72;
  const acx = n1(ax + as / 2);
  const acy = n1(ay + as / 2);
  let rays = '';
  for (let i = 0; i < 72; i++) {
    const a = i * 5 + (i % 2 ? 1.5 : 0);
    const [ex, ey] = polar(acx, acy, as * (i % 4 === 0 ? 0.95 : i % 2 ? 0.5 : 0.7), a);
    const [lx, ly] = polar(acx, acy, i % 4 === 0 ? 3 : 1.6, a + 90);
    const [rx, ry] = polar(acx, acy, i % 4 === 0 ? 3 : 1.6, a - 90);
    rays += `M${lx} ${ly}L${ex} ${ey}L${rx} ${ry}Z`;
  }
  let sparks = '';
  for (let i = 0; i < 16; i++) {
    const [sx, sy] = polar(acx, acy, as * (0.16 + rand() * 0.32), rand() * 360);
    sparks += `<path d="${glint(sx, sy, n1(3 + rand() * 6), 0.18)}"/>`;
  }
  let rings = '';
  [0.18, 0.3, 0.42].forEach((k, i) => {
    rings += `<circle cx="${acx}" cy="${acy}" r="${n1(as * k)}" fill="none" stroke="${silverHi}" stroke-opacity="${0.35 - i * 0.08}" stroke-width="${1.6 - i * 0.4}"${i === 1 ? ' stroke-dasharray="2 7"' : ''}/>`;
  });

  // Rule-text box: a few grey lines of "text", never legible.
  let rule = '';
  const tx = x0 + 22;
  const ty = y0 + 386;
  [0.92, 0.86, 0.9, 0.62].forEach((k, i) => {
    rule += `<rect x="${tx + 12}" y="${n1(ty + 16 + i * 14)}" width="${n1((cw - 68) * k)}" height="5" rx="2.5"/>`;
  });

  // Background glints: a few foil sparkles in the top band and around the card.
  const glints = [
    [1372, 112, 40, 0], [1018, 128, 30, 1.6], [1392, 742, 38, 3.1], [1090, 700, 22, 4.4], [214, 96, 30, 2.2], [612, 62, 18, 5.2],
  ]
    .map(([gx, gy, r, d]) => `<g style="transform-origin: ${gx}px ${gy}px; animation: dbtefx-sl-twinkle ${n1(5.5 + rand() * 3)}s ease-in-out ${-d}s infinite;"><path d="${glint(gx, gy, r)}" fill="${light ? mix(t.accent, '#ffffff', 0.35) : silverHi}"/><path d="${glint(gx, gy, r * 0.45, 0.22)}" fill="#ffffff"/></g>`)
    .join('');

  // Glitter: tiny static specks of foil (the grain of the stock).
  let glitter = '';
  for (let i = 0; i < 90; i++) {
    const gx = n1(rand() * W);
    const gy = n1(rand() * H);
    const calm = gx > 430 && gx < 1010 && gy > 160 && gy < 820;
    glitter += `<circle cx="${gx}" cy="${gy}" r="${n1(0.6 + rand() * 1.3)}" fill="${t[PRISM[i % 6]]}" fill-opacity="${n1((calm ? 0.12 : 0.5) * (0.4 + rand() * 0.6))}"/>`;
  }

  return `<style>@keyframes dbtefx-sl-cslide { from { transform: translateX(0); } to { transform: translateX(-962px); } }
@keyframes dbtefx-sl-sweep { 0%, 12% { transform: translateX(-560px); opacity: 0; } 16% { opacity: 1; } 52% { opacity: 1; } 58%, 100% { transform: translateX(600px); opacity: 0; } }
@keyframes dbtefx-sl-twinkle { 0%, 100% { transform: scale(0.35) rotate(0deg); opacity: 0.25; } 50% { transform: scale(1) rotate(12deg); opacity: 1; } }
@keyframes dbtefx-sl-breathe { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }</style>
<defs>
<linearGradient id="dbtefx-sl-rc" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="420" y2="160" spreadMethod="repeat">${prismStops(t, light)}</linearGradient>
<pattern id="dbtefx-sl-lf" width="16" height="4" patternUnits="userSpaceOnUse"><rect width="16" height="1.3" fill="#ffffff"/></pattern>
<mask id="dbtefx-sl-mc" maskUnits="userSpaceOnUse" x="${x0}" y="${y0}" width="${cw}" height="${ch}"><rect x="${x0}" y="${y0}" width="${cw}" height="${ch}" fill="url(#dbtefx-sl-lf)"/></mask>
<clipPath id="dbtefx-sl-clip"><rect x="${x0}" y="${y0}" width="${cw}" height="${ch}" rx="12"/></clipPath>
<linearGradient id="dbtefx-sl-body" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="${body}"/><stop offset="1" stop-color="${bodyLo}"/></linearGradient>
<linearGradient id="dbtefx-sl-name" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${silverHi}"/><stop offset="0.45" stop-color="${silver}"/><stop offset="0.55" stop-color="${silverLo}"/><stop offset="1" stop-color="${silverHi}"/></linearGradient>
<linearGradient id="dbtefx-sl-band" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.42" stop-color="#ffffff" stop-opacity="${light ? 0.75 : 0.32}"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="${light ? 0.95 : 0.55}"/><stop offset="0.58" stop-color="#ffffff" stop-opacity="${light ? 0.75 : 0.32}"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-sl-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${light ? '#ffffff' : t.accent2}" stop-opacity="${light ? 0.9 : 0.26}"/><stop offset="0.55" stop-color="${light ? '#ffffff' : t.accent}" stop-opacity="${light ? 0.4 : 0.08}"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sl-art" cx="0.5" cy="0.5" r="0.7"><stop offset="0" stop-color="${light ? '#ffffff' : mix(t.accent2, t.bg, 0.55)}"/><stop offset="1" stop-color="${light ? mix(t.bg, t.border, 0.45) : t.bg}"/></radialGradient>
<radialGradient id="dbtefx-sl-star" gradientUnits="userSpaceOnUse" cx="${acx}" cy="${acy}" r="${n1(as * 0.47)}"><stop offset="0" stop-color="#ffffff"/><stop offset="0.25" stop-color="${silverHi}" stop-opacity="0.95"/><stop offset="0.65" stop-color="${light ? t.accent : t.accent}" stop-opacity="0.55"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sl-bloom"><stop offset="0" stop-color="#ffffff" stop-opacity="${light ? 0.9 : 0.45}"/><stop offset="0.4" stop-color="${light ? '#ffffff' : t.accent}" stop-opacity="${light ? 0.5 : 0.14}"/><stop offset="1" stop-color="${light ? '#ffffff' : t.accent}" stop-opacity="0"/></radialGradient>
</defs>
${glitter}
<!--mid-->
<ellipse cx="${cx}" cy="${cy}" rx="360" ry="400" fill="url(#dbtefx-sl-halo)" style="animation: dbtefx-sl-breathe 9s ease-in-out infinite;"/>
<g transform="translate(${cx} ${cy}) rotate(-7)">
<rect x="${x0 + 10}" y="${y0 + 18}" width="${cw}" height="${ch}" rx="12" fill="${ink}" fill-opacity="${light ? 0.12 : 0.55}"/>
<rect x="${x0}" y="${y0}" width="${cw}" height="${ch}" rx="12" fill="url(#dbtefx-sl-body)"/>
<rect x="${x0 + 18}" y="${y0 + 18}" width="${cw - 36}" height="48" rx="3" fill="${light ? '#ffffff' : t.bg}" fill-opacity="${light ? 0.55 : 0.6}" stroke="${silver}" stroke-width="1.5"/>
<text x="${x0 + 32}" y="${y0 + 53}" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="30" letter-spacing="1" fill="url(#dbtefx-sl-name)" stroke="${light ? t.text : '#000000'}" stroke-opacity="${light ? 0.55 : 0.4}" stroke-width="0.8">Starlight</text>
<circle cx="${x0 + cw - 44}" cy="${y0 + 42}" r="17" fill="${light ? t.accent : mix(t.accent2, t.bg, 0.3)}" stroke="url(#dbtefx-sl-name)" stroke-width="3"/>
<path d="${glint(x0 + cw - 44, y0 + 42, 12, 0.2)}" fill="${silverHi}"/>
${levels}
<rect x="${ax - 6}" y="${ay - 6}" width="${as + 12}" height="${as + 12}" fill="none" stroke="url(#dbtefx-sl-name)" stroke-width="4"/>
<rect x="${ax}" y="${ay}" width="${as}" height="${as}" fill="url(#dbtefx-sl-art)"/>
<svg x="${ax}" y="${ay}" width="${as}" height="${as}" viewBox="${ax} ${ay} ${as} ${as}" overflow="hidden">
<path d="${rays}" fill="url(#dbtefx-sl-rc)" fill-opacity="${light ? 0.55 : 0.5}"/>
${rings}
<circle cx="${acx}" cy="${acy}" r="${n1(as * 0.34)}" fill="url(#dbtefx-sl-bloom)"/>
<g fill="${silverHi}" fill-opacity="0.85">${sparks}</g>
<path d="${glint(acx, acy, as * 0.22, 0.14)}" fill="url(#dbtefx-sl-star)" transform="rotate(45 ${acx} ${acy})"/>
<path d="${glint(acx, acy, as * 0.47, 0.07)}" fill="url(#dbtefx-sl-star)"/>
<circle cx="${acx}" cy="${acy}" r="5" fill="#ffffff"/>
</svg>
<rect x="${tx}" y="${ty}" width="${cw - 44}" height="${ch - 386 - 22}" rx="3" fill="${light ? '#ffffff' : mix(t.surface, t.muted, 0.12)}" fill-opacity="${light ? 0.75 : 0.85}" stroke="${silver}" stroke-width="1.5"/>
<g fill="${t.muted}" fill-opacity="0.4">${rule}</g>
<g clip-path="url(#dbtefx-sl-clip)">
<g mask="url(#dbtefx-sl-mc)" opacity="${light ? 0.45 : 0.5}"><rect x="${x0 - 20}" y="${y0}" width="${cw + 1010}" height="${ch}" fill="url(#dbtefx-sl-rc)" style="animation: dbtefx-sl-cslide 24s linear infinite;"/></g>
</g>
<rect x="${x0}" y="${y0}" width="${cw}" height="${ch}" rx="12" fill="none" stroke="url(#dbtefx-sl-name)" stroke-width="3"/>
<rect x="${x0 + 7}" y="${y0 + 7}" width="${cw - 14}" height="${ch - 14}" rx="7" fill="none" stroke="url(#dbtefx-sl-rc)" stroke-width="2" stroke-opacity="0.85"/>
<g clip-path="url(#dbtefx-sl-clip)"><g transform="rotate(20)"><rect x="-120" y="-700" width="200" height="1400" fill="url(#dbtefx-sl-band)" style="animation: dbtefx-sl-sweep 9s cubic-bezier(.45,0,.25,1) infinite;"/></g></g>
</g>
<!--near-->
${glints}`;
};

const starlight = (t) => foil(t, false);

export default starlight;

export const particles = [{ kind: 'star', count: 70, colors: ['text', 'accent', 'accent2', 'warning'] }];

// WebGL foil: hairline horizontal lines carrying a slowly drifting rainbow
// (warped by noise so the bands are organic, about 1.2 cycles across the
// screen), a diagonal light band that sweeps by every ~20 s, and glitter.
// The centre, where DuelingBook's feed sits, is kept calm.
export const foilShader = (light) => ({
  uniforms: ['bg', 'text', 'danger', 'warning', 'success', 'accent', 'link', 'accent2'],
  fps: 30,
  frag: `
vec3 prism(float h) {
  h = fract(h) * 6.0;
  vec3 c = mix(u_danger, u_warning, clamp(h, 0.0, 1.0));
  c = mix(c, u_success, clamp(h - 1.0, 0.0, 1.0));
  c = mix(c, u_accent, clamp(h - 2.0, 0.0, 1.0));
  c = mix(c, u_link, clamp(h - 3.0, 0.0, 1.0));
  c = mix(c, u_accent2, clamp(h - 4.0, 0.0, 1.0));
  return mix(c, u_danger, clamp(h - 5.0, 0.0, 1.0));
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float t = u_time;
  vec2 p = vec2(uv.x * u_res.x / u_res.y, uv.y);
  float warp = fbm(p * 1.8 + vec2(t * 0.01, -t * 0.007));
  float hue = (uv.x * 0.9 + (1.0 - uv.y) * 0.35) * 1.2 + warp * 0.5 + t * 0.008;
  float ly = fract(gl_FragCoord.y / 3.0);
  float line = smoothstep(0.0, 0.34, ly) * smoothstep(0.67, 0.34, ly);
  // Where the light catches: a broad diagonal swell plus the noise.
  float lit = smoothstep(0.35, 0.95, fbm(p * 0.9 + vec2(-t * 0.006, 0.0)) * 0.7 + (uv.x * 0.45 + uv.y * 0.35) * 0.6);
  float calm = max(smoothstep(0.0, 0.16, abs(uv.x - 0.48) - 0.12), smoothstep(0.86, 0.97, uv.y));
  float strength = mix(0.22, 1.0, calm);
  float s = mod(t * 0.045, 1.9) - 0.45;
  float band = exp(-pow((uv.x * 0.8 + (1.0 - uv.y) * 0.45 - s * 1.5) * 5.0, 2.0));
  vec2 cell = floor(gl_FragCoord.xy / 2.0);
  float h = hash(cell);
  float glitter = step(0.9965, h) * pow(0.5 + 0.5 * sin(t * 1.7 + h * 60.0), 4.0);
  vec3 rb = prism(hue);
  ${light
    ? `vec3 col = u_bg;
  col = mix(col, vec3(1.0), (0.1 + 0.25 * lit) * strength * 0.5);
  col = mix(col, mix(rb, vec3(1.0), 0.3), line * (0.16 + 0.5 * lit + 0.4 * band) * strength);
  col = mix(col, vec3(1.0), band * 0.3 * strength);
  col = mix(col, u_text, glitter * 0.3 * strength);`
    : `vec3 col = u_bg;
  col += rb * line * (0.12 + 0.75 * lit + 0.6 * band) * strength;
  col += rb * (0.03 + 0.1 * lit) * strength;
  col += mix(rb, u_text, 0.6) * band * 0.05 * strength;
  col += u_text * glitter * 0.75 * strength;
  col *= 1.0 - 0.3 * dot(uv - 0.5, uv - 0.5);`}
  gl_FragColor = vec4(dither(col), 1.0);
}`,
});

export const shader = foilShader(false);
