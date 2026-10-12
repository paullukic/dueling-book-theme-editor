import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Master Duel: a corner of its 3D duel field over the home screen's violet
// space. Octagonal stone zones recede in perspective, seams lit blue; above
// the centre zone an Ultra Rare is being summoned, hanging in a violet-gold
// rarity aura and a burst of light, a foil glint sweeping its face, a winged
// silhouette blazing in its art. Behind, the home menu's slashed
// glass panels and hairlines cross a nebula (WebGL) under fine scanlines. In a
// duel the field, the card and the hairlines stand aside (chrome/master-duel.js),
// so the right gutter is only sky and nothing reads as a stray UI frame.

const cx = 1430;
// Field plane (X across, Z away from the viewer) to screen.
const proj = (X, Z) => [n1(cx + (X * 330) / (Z + 4)), n1(373 + 1947 / (Z + 4))];

const scene = (t) => {
  const rand = rng(2022);
  const ur = t.accent2;
  const gold = t.warning;
  const blue = t.self;
  const ink = mix(t.bg, '#000000', 0.5);
  const stone = mix(t.raised, t.muted, 0.3);
  const stoneHi = mix(stone, '#ffffff', 0.3);
  const stoneLo = mix(stone, ink, 0.55);

  // An octagon on the field plane, projected.
  const oct = (X, Z, rad) => `M${Array.from({ length: 8 }, (_, i) => {
    const [dx, dz] = polar(0, 0, rad, i * 45 + 22.5);
    return proj(X + dx, Z + dz).join(' ');
  }).join('L')}Z`;
  let tiles = '';
  [2.7, 1.6, 0.5].forEach((Z) => {
    [-1.05, 0, 1.05].forEach((X) => {
      const centre = X === 0 && Z === 1.6;
      tiles += `<path d="${oct(X, Z, 0.5)}" fill="${stoneLo}"/><path d="${oct(X, Z - 0.02, 0.47)}" fill="url(#dbtefx-md-stone)" stroke="${stoneHi}" stroke-opacity="0.6" stroke-width="1.2"/><path d="${oct(X, Z, 0.33)}" fill="none" stroke="${centre ? mix(blue, '#ffffff', 0.4) : stoneLo}" stroke-opacity="${centre ? 0.9 : 0.8}" stroke-width="${centre ? 2.4 : 3}"/>`;
    });
  });
  // Seams between the zones glow faintly blue.
  const seams = [-0.52, 0.52].map((X) => `M${proj(X, 0).join(' ')}L${proj(X, 3.3).join(' ')}`).join('') + [1.05, 2.15].map((Z) => `M${proj(-1.6, Z).join(' ')}L${proj(1.6, Z).join(' ')}`).join('');

  // The Ultra Rare: dark card body, gold rim, violet art with a winged silhouette of light.
  const cw = 118;
  const ch = n1(cw * 1.46);
  const fan = (dir) => {
    let s = '';
    for (let i = 0; i < 5; i++) {
      const a = dir > 0 ? -70 + i * 17 : -110 - i * 17;
      const [tx, ty] = polar(0, 6, 46 - i * 4, a);
      const [lx, ly] = polar(0, 6, 22, a - 7 * dir);
      s += `M0 6Q${lx} ${ly} ${tx} ${ty}Q${polar(0, 6, 24, a + 6 * dir).join(' ')} 0 10Z`;
    }
    return s;
  };
  const art = `<g transform="translate(0 -42) scale(1.3)"><circle r="44" fill="url(#dbtefx-md-halo)"/><path d="${fan(1)}${fan(-1)}" fill="#ffffff" fill-opacity="0.92"/><path d="M0 -14L6 2L3 26L0 34L-3 26L-6 2Z" fill="#ffffff"/><path d="M0 -24L5 -12L0 -8L-5 -12Z" fill="${mix(gold, '#ffffff', 0.4)}"/></g>`;
  const card = `<rect x="${-cw / 2 - 16}" y="${-ch / 2 - 16}" width="${cw + 32}" height="${n1(ch + 32)}" rx="16" fill="url(#dbtefx-md-aura)"/>
<rect x="${-cw / 2}" y="${-ch / 2}" width="${cw}" height="${ch}" rx="5" fill="url(#dbtefx-md-body)" stroke="${gold}" stroke-width="3"/>
<rect x="${-cw / 2 + 12}" y="${-ch / 2 + 26}" width="${cw - 24}" height="${cw - 24}" fill="url(#dbtefx-md-art)" stroke="${mix(gold, '#ffffff', 0.4)}" stroke-opacity="0.8"/>
<path d="M${-cw / 2 + 12} ${-ch / 2 + 15}H${n1(cw * 0.15)}" stroke="#ffffff" stroke-opacity="0.6" stroke-width="5"/>
<path d="M${n1(cw / 2 - 26)} ${-ch / 2 + 9}l8 7-8 7-8-7z" fill="${ur}" stroke="#ffffff" stroke-opacity="0.85"/>
<path d="M${-cw / 2 + 12} ${n1(ch * 0.3)}H${cw / 2 - 12}M${-cw / 2 + 12} ${n1(ch * 0.36)}H${cw / 2 - 30}M${-cw / 2 + 12} ${n1(ch * 0.42)}H${cw / 2 - 52}" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3"/>
${art}
<g clip-path="url(#dbtefx-md-clip)"><rect x="${-cw / 2 - 70}" y="${-ch / 2 - 40}" width="60" height="${n1(ch + 80)}" fill="url(#dbtefx-md-glint)" style="animation: dbtefx-md-glint 5s ease-in-out infinite;"/></g>`;

  // Light burst behind the summon.
  let rays = '';
  for (let i = 0; i < 24; i++) {
    const a = i * 15 + (i % 2) * 4;
    rays += `M0 0L${polar(0, 0, 480, a - 2.2).join(' ')}L${polar(0, 0, 480, a + 2.2).join(' ')}Z`;
  }

  // Home-menu glass slashes and hairlines.
  const slashes = [[-120, 520, 0.22], [180, 300, 0.12], [1500, 260, 0.16]]
    .map(([x, w, o]) => `<path d="M${x + 420} -20H${x + 420 + w}L${x + w} ${H + 20}H${x}Z" fill="${mix(t.surface, ur, 0.12)}" fill-opacity="${o}"/><path d="M${x + 420 + w} -20L${x + w} ${H + 20}" stroke="${mix(ur, '#ffffff', 0.35)}" stroke-opacity="${n1(o * 1.6)}" stroke-width="1.4"/>`)
    .join('');
  const hair = [140, 168].map((y) => `<path d="M0 ${y}H620" stroke="#ffffff" stroke-opacity="0.12"/><rect x="560" y="${y - 2}" width="60" height="4" fill="#ffffff" fill-opacity="0.22"/>`).join('');

  const motes = Array.from({ length: 12 }, (_, i) => {
    const [x, y] = polar(cx, 520, 150 + rand() * 150, rand() * 360);
    return `<path d="M${x} ${n1(y - 5)}l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z" fill="${i % 3 ? mix(gold, '#ffffff', 0.4) : mix(ur, '#ffffff', 0.4)}" style="animation: dbtefx-pulse ${n1(2 + rand() * 3)}s ease-in-out ${n1(-rand() * 4)}s infinite;"/>`;
  }).join('');

  const [px, py] = proj(0, 1.6);
  const cy = n1(py - 170);

  return `<defs>
<radialGradient id="dbtefx-md-sky" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="700"><stop offset="0" stop-color="${mix(t.bg, ur, 0.4)}" stop-opacity="0.6"/><stop offset="0.6" stop-color="${mix(t.bg, ur, 0.15)}" stop-opacity="0.25"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-md-burst" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="480"><stop offset="0" stop-color="#ffffff" stop-opacity="0.45"/><stop offset="0.25" stop-color="${mix(gold, '#ffffff', 0.4)}" stop-opacity="0.18"/><stop offset="1" stop-color="${ur}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-md-aura" cx="0.5" cy="0.5" r="0.55"><stop offset="0.68" stop-color="${ur}" stop-opacity="0.85"/><stop offset="0.8" stop-color="${gold}" stop-opacity="0.35"/><stop offset="1" stop-color="${ur}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-md-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.7"/><stop offset="1" stop-color="${ur}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-md-art" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(ur, '#ffffff', 0.25)}"/><stop offset="0.55" stop-color="${mix(ur, t.bg, 0.35)}"/><stop offset="1" stop-color="${mix(blue, ink, 0.45)}"/></linearGradient>
<linearGradient id="dbtefx-md-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.raised, '#ffffff', 0.08)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-md-glint" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.7"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-md-stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${stoneHi}"/><stop offset="1" stop-color="${stone}"/></linearGradient>
<radialGradient id="dbtefx-md-pool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(blue, '#ffffff', 0.4)}" stop-opacity="0.85"/><stop offset="0.6" stop-color="${blue}" stop-opacity="0.35"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
<clipPath id="dbtefx-md-clip"><rect x="${-cw / 2}" y="${-ch / 2}" width="${cw}" height="${ch}" rx="5"/></clipPath>
<linearGradient id="dbtefx-md-fadeg" gradientUnits="userSpaceOnUse" x1="1290" y1="0" x2="1420" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.32"/><stop offset="1" stop-color="#ffffff"/></linearGradient><mask id="dbtefx-md-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="url(#dbtefx-md-fadeg)"/></mask>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-md-sky)"/>
${slashes}
<g class="dbtefx-md-hair">${hair}</g>
<!--mid-->
<g class="dbtefx-md-field" mask="url(#dbtefx-md-fade)" opacity="0.45">
<g transform="translate(${cx} ${cy})"><g style="animation: dbtefx-spin 90s linear infinite;"><path d="${rays}" fill="url(#dbtefx-md-burst)"/></g></g>
${tiles}
<path d="${seams}" stroke="${mix(blue, '#ffffff', 0.3)}" stroke-opacity="0.35" stroke-width="1.6"/>
<ellipse cx="${px}" cy="${py}" rx="120" ry="34" fill="url(#dbtefx-md-pool)" style="animation: dbtefx-pulse 3.5s ease-in-out infinite;"/>
<path d="M${px - 40} ${py}L${px - 64} ${n1(cy + 60)}H${px + 64}L${px + 40} ${py}Z" fill="${mix(ur, '#ffffff', 0.4)}" fill-opacity="0.12"/>
<g transform="translate(${cx} ${cy})"><g style="animation: dbtefx-bob 6s ease-in-out infinite;">${card}</g></g>
</g>
<!--near-->
${motes}
<style>
@keyframes dbtefx-md-glint { 0%, 55% { transform: translateX(0); opacity: 0; } 62% { opacity: 1; } 85% { transform: translateX(260px); opacity: 0.9; } 92%, 100% { transform: translateX(300px); opacity: 0; } }
</style>`;
};

export default scene;

export const particles = [
  { kind: 'star', count: 90, colors: ['text', 'accent2'] },
  { kind: 'mote', count: 26, colors: ['accent2', 'warning'], rise: true, column: true, columnX: 0.9 },
  { kind: 'meteor', count: 1, colors: ['accent2'] },
];

// WebGL layer: deep violet space, a slow nebula drifting behind the field,
// fine scanlines like the home screen.
export const shader = {
  uniforms: ['bg', 'accent2', 'self', 'text'],
  frag: `
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float t = u_time * 0.02;
  float n = fbm(p * 1.4 + vec2(t, -t * 0.6));
  float n2 = fbm(p * 3.1 - vec2(t * 1.6, 0.0) + n);
  vec3 col = u_bg * 0.9;
  float neb = smoothstep(0.35, 0.95, n * 0.7 + n2 * 0.45);
  col += mix(u_accent2, u_self, 0.25 + 0.5 * n2) * neb * 0.42;
  vec2 c = vec2(0.76 * asp, 0.5);
  col += u_accent2 * 0.22 * exp(-length(p - c) * 2.2);
  float st = step(0.996, hash(floor(gl_FragCoord.xy / 2.0)));
  col += u_text * st * 0.5 * (0.5 + 0.5 * sin(u_time * 2.0 + hash(floor(gl_FragCoord.xy / 2.0)) * 40.0));
  col *= 0.94 + 0.06 * step(0.5, fract(gl_FragCoord.y / 3.0));
  col *= 1.0 - 0.45 * dot(uv - vec2(0.6, 0.5), uv - vec2(0.6, 0.5));
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
