import { glow, H, runeRing, star, W } from './kit.js';

// Dark Magic: a pentagram circle turning, violet sparkles, a wand's streak.
const darkMagic = (t) => {
  return `<defs>${glow('dbtefx-dm-g', t.accent, 0.5, 0.5, 0.5, 0.25)}</defs><rect width="${W}" height="${H}" fill="url(#dbtefx-dm-g)"/>
${runeRing(t, 800, 450, 320, t.accent, 120)}
<g style="transform-origin: 800px 450px; animation: dbtefx-spin 60s linear infinite reverse;"><path d="${star(800, 450, 270)}" fill="none" stroke="${t.accent2}" stroke-opacity="0.35" stroke-width="3"/></g>
<path d="M200 760Q700 520 1400 140" fill="none" stroke="${t.accent2}" stroke-opacity="0.3" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round"/>`;
};

// Black Dragon: two red eyes in the dark, molten cracks, embers.

export default darkMagic;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'spark', count: 70, colors: ['accent2', 'accent'] }];

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
