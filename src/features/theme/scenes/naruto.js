import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Naruto: dusk over a hidden village in the leaves. Curled ink-line clouds,
// the great cliff behind the round red tower, rooftops with water tanks and
// sagging wires, and a spiralling chakra sphere above it all, leaves caught
// in its wind. The shader draws the dusk sky and the sphere's churning core.
const RS = [1372, 600];
const RR = 62;
const MOON = [1250, 210];

const naruto = (t) => {
  const r = rng(7);
  const ink = mix(t.bg, '#000000', 0.5);
  const dusk = mix(t.accent, t.danger, 0.3);
  const cloudLit = mix(mix(t.text, t.accent, 0.45), t.danger, 0.15);
  const cloudShade = mix(mix(t.bg, t.accent2, 0.25), t.danger, 0.2);
  const roof = mix(t.danger, t.accent, 0.3);
  const wall = mix(t.bg, t.muted, 0.16);
  const chakra = t.accent2;
  const core = mix(chakra, '#ffffff', 0.7);

  // An inward spiral (Archimedean), for cloud curls and the chakra swirl.
  const spiral = (cx, cy, r0, turns, dir, start = 0) => {
    let d = '';
    const steps = Math.round(turns * 24);
    for (let i = 0; i <= steps; i++) {
      const k = i / steps;
      const a = start + dir * k * turns * Math.PI * 2;
      const rad = r0 * (1 - k * 0.85);
      d += `${i ? 'L' : 'M'}${n1(cx + Math.cos(a) * rad)} ${n1(cy + Math.sin(a) * rad)}`;
    }
    return d;
  };

  // A curled cloud in the series' ink style: a bumped crown over a flat
  // underside, each end rolling into a spiral, outlined in ink.
  const cloud = (x, y, w, h, seed) => {
    const cr = rng(seed);
    const n = Math.max(3, Math.round(w / (h * 1.4)));
    let top = `M${n1(x)} ${n1(y)}`;
    let inner = '';
    for (let i = 0; i < n; i++) {
      const x0 = x + (i / n) * w;
      const x1 = x + ((i + 1) / n) * w;
      const lift = h * (0.25 + cr() * 0.5) * (1 - Math.abs((i + 0.5) / n - 0.5) * 1.2);
      const rad = n1((x1 - x0) * (0.55 + cr() * 0.1));
      top += `L${n1(x0)} ${n1(y - lift)}A${rad} ${rad} 0 0 1 ${n1(x1)} ${n1(y - lift)}`;
      if (i % 2 === 1) inner += spiral(x0 + (x1 - x0) * 0.5, y - lift - rad * 0.2, rad * 0.45, 0.9, i % 4 === 1 ? 1 : -1, 1.6);
    }
    const body = `${top}L${n1(x + w)} ${n1(y)}Q${n1(x + w * 0.5)} ${n1(y + h * 0.3)} ${n1(x)} ${n1(y)}Z`;
    const curls = `${spiral(x - h * 0.05, y - h * 0.45, h * 0.62, 1.3, 1, 0.6)}${spiral(x + w + h * 0.05, y - h * 0.45, h * 0.62, 1.3, -1, Math.PI - 0.6)}`;
    return `<path d="${body}" fill="url(#dbtefx-nr-cloud)" stroke="${ink}" stroke-opacity="0.6" stroke-width="2.4" stroke-linejoin="round"/>
<path d="${inner}" fill="none" stroke="${ink}" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round"/>
<path d="${curls}" fill="none" stroke="${cloudLit}" stroke-width="4" stroke-linecap="round"/><path d="${curls}" fill="none" stroke="${ink}" stroke-opacity="0.35" stroke-width="1.2" transform="translate(0 2)"/>`;
  };

  // The cliff behind the village: a broad rock face with a broken top
  // edge, ledges, vertical cracks and a canopy of trees along its crown.
  let rim = 'M930 720L952 470';
  const rimPts = [];
  for (let x = 952; x <= 1620; x += 26 + r() * 22) {
    const y = 440 - Math.sin((x - 952) / 160) * 10 + (r() - 0.5) * 16;
    rimPts.push([x, y]);
    rim += `L${n1(x)} ${n1(y)}`;
  }
  rim += 'L1620 720Z';
  let strata = '';
  for (let x = 990; x < 1600; x += 40 + r() * 34) strata += `M${n1(x)} ${n1(462 + r() * 24)}l${n1(-4 + r() * 8)} ${n1(40 + r() * 50)}l${n1(-6 + r() * 12)} ${n1(40 + r() * 70)}`;
  let ledges = '';
  [520, 590, 650].forEach((ly, i) => {
    ledges += `M${n1(960 + i * 20 + r() * 40)} ${ly}Q${1260} ${ly + 8 - i * 4} ${n1(1580 - r() * 60)} ${ly - 6}`;
  });
  let crown = '';
  rimPts.forEach(([x, y]) => {
    crown += `<circle cx="${n1(x)}" cy="${n1(y - 8)}" r="${n1(14 + r() * 12)}"/>`;
  });

  // Rooftops in two rows: hip roofs and flat roofs with water tanks on
  // legs, a hazy back row and a darker front row, lit windows; the middle
  // stays low so the feed reads.
  let windows = '';
  let lit = 0;
  const row = (base, hMin, hMax, wallC, roofC, seed, haze) => {
    const hr = rng(seed);
    let out = '';
    let tk = '';
    for (let x = -30; x < W + 40; ) {
      const w = 80 + hr() * 110;
      const calm = x > 400 && x < 1000;
      const h = (calm ? hMin * 0.6 : hMin) + hr() * (calm ? (hMax - hMin) * 0.3 : hMax - hMin);
      const top = base - h;
      out += `<rect x="${n1(x)}" y="${n1(top)}" width="${n1(w)}" height="${n1(H - top)}" fill="${wallC}"/><rect x="${n1(x)}" y="${n1(top)}" width="${n1(w * 0.18)}" height="${n1(H - top)}" fill="#ffffff" fill-opacity="0.04"/>`;
      if (hr() < 0.55) {
        const rh = 16 + hr() * 14;
        if (!haze && hr() < 0.4) {
          const r2 = 14;
          out += `<path d="M${n1(x + w * 0.2)} ${n1(top - rh + 2)}Q${n1(x + w * 0.32)} ${n1(top - rh - 4)} ${n1(x + w * 0.36)} ${n1(top - rh - r2)}H${n1(x + w * 0.64)}Q${n1(x + w * 0.68)} ${n1(top - rh - 4)} ${n1(x + w * 0.8)} ${n1(top - rh + 2)}Z" fill="${mix(roofC, ink, 0.2)}" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`;
        }
        out += `<path d="M${n1(x - 14)} ${n1(top + 1)}Q${n1(x + w * 0.12)} ${n1(top - 2)} ${n1(x + w * 0.22)} ${n1(top - rh)}H${n1(x + w * 0.78)}Q${n1(x + w * 0.88)} ${n1(top - 2)} ${n1(x + w + 14)} ${n1(top + 1)}L${n1(x + w + 8)} ${n1(top + 5)}H${n1(x - 8)}Z" fill="${roofC}"/><path d="M${n1(x + w * 0.22)} ${n1(top - rh)}H${n1(x + w * 0.78)}" stroke="${mix(t.accent, '#ffffff', 0.35)}" stroke-opacity="${haze ? 0.25 : 0.5}" stroke-width="2"/><path d="M${n1(x - 10)} ${n1(top + 4)}H${n1(x + w + 10)}" stroke="${ink}" stroke-width="3"/>`;
      } else {
        out += `<rect x="${n1(x - 3)}" y="${n1(top - 6)}" width="${n1(w + 6)}" height="8" fill="${roofC}"/>`;
        if (!calm) {
          const tx = x + w * (0.3 + hr() * 0.4);
          const ty = top - 22;
          tk += `<path d="M${n1(tx - 11)} ${n1(top - 6)}L${n1(tx - 8)} ${n1(ty)}M${n1(tx + 11)} ${n1(top - 6)}L${n1(tx + 8)} ${n1(ty)}" stroke="${ink}" stroke-width="2.5"/><rect x="${n1(tx - 15)}" y="${n1(ty - 26)}" width="30" height="28" rx="5" fill="url(#dbtefx-nr-tank)"/><path d="M${n1(tx - 15)} ${n1(ty - 17)}h30M${n1(tx - 15)} ${n1(ty - 7)}h30" stroke="${ink}" stroke-opacity="0.45" stroke-width="1.5"/>`;
        }
      }
      if (!haze) {
        for (let i = 0; i < 2; i++) {
          if (hr() < 0.6) {
            const wx = x + 14 + hr() * (w - 34);
            const wy = top + 20 + hr() * 26;
            const blink = lit < 6 && hr() < 0.35;
            if (blink) lit++;
            windows += `<rect x="${n1(wx)}" y="${n1(wy)}" width="11" height="13" rx="1" fill="${mix(t.accent, t.warning, 0.5)}" fill-opacity="0.85"${blink ? ` ${anim('pulse', n1(4 + hr() * 5), hr() * 6, 'ease-in-out')}` : ''}/>`;
          }
        }
      }
      x += w + 4 + hr() * 30;
    }
    return out + tk;
  };
  const backRow = row(780, 70, 140, mix(t.bg, dusk, 0.2), mix(roof, t.bg, 0.35), 11, true);
  const frontRow = row(880, 100, 170, mix(wall, '#000000', 0.3), roof, 13, false);

  // Utility poles with crossbars and sagging wires between them.
  const poles = [80, 300, 1080, 1420, 1580];
  let wires = '';
  let poleD = '';
  poles.forEach((px, i) => {
    poleD += `M${px} 780V560M${px - 22} 578H${px + 22}M${px - 16} 596H${px + 16}`;
    if (i < poles.length - 1) {
      const nx = poles[i + 1];
      [578, 596].forEach((wy, j) => {
        wires += `M${px + (j ? 16 : 22)} ${wy}Q${n1((px + nx) / 2)} ${wy + 40 + j * 6} ${nx - (j ? 16 : 22)} ${wy}`;
      });
    }
  });

  // The round tower: a red-banded cylinder under a flared tiered roof, a
  // blank emblem disc on its face.
  const [tx, ty] = [1130, 560];
  const tower = `<rect x="${tx - 62}" y="${ty}" width="124" height="${200}" fill="url(#dbtefx-nr-drum)"/>
<path d="M${tx - 62} ${ty + 60}h124M${tx - 62} ${ty + 120}h124" stroke="${ink}" stroke-opacity="0.45" stroke-width="3"/>
<g fill="${mix(t.warning, t.accent, 0.4)}" fill-opacity="0.85">${[-38, -6, 26].map((dx) => `<rect x="${tx + dx}" y="${ty + 76}" width="12" height="22" rx="6"/><rect x="${tx + dx}" y="${ty + 136}" width="12" height="22" rx="6"/>`).join('')}</g>
<path d="M${tx - 96} ${ty + 8}Q${tx - 50} ${ty - 6} ${tx - 40} ${ty - 30}H${tx + 40}Q${tx + 50} ${ty - 6} ${tx + 96} ${ty + 8}Z" fill="${roof}" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M${tx - 58} ${ty - 30}Q${tx - 30} ${ty - 40} ${tx - 24} ${ty - 58}H${tx + 24}Q${tx + 30} ${ty - 40} ${tx + 58} ${ty - 30}Z" fill="${mix(roof, ink, 0.2)}" stroke="${ink}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M${tx - 96} ${ty + 8}Q${tx - 50} ${ty - 6} ${tx - 40} ${ty - 30}H${tx + 40}" fill="none" stroke="${mix(t.accent, '#ffffff', 0.3)}" stroke-opacity="0.5" stroke-width="1.5"/>
<circle cx="${tx}" cy="${ty + 32}" r="20" fill="${mix(t.text, t.accent, 0.2)}" stroke="${roof}" stroke-width="5"/><circle cx="${tx}" cy="${ty + 32}" r="11" fill="none" stroke="${roof}" stroke-opacity="0.6" stroke-width="2"/>`;

  // Chakra sphere: three spiral arms spinning fast inside, a wind ring
  // turning the other way, leaves orbiting in its draft.
  let arms = '';
  for (let i = 0; i < 3; i++) arms += spiral(RS[0], RS[1], RR * 0.95, 0.9, 1, (i * Math.PI * 2) / 3);
  const leaf = (a, s) => {
    const [lx, ly] = polar(RS[0], RS[1], RR * 1.75, a);
    return `<path d="M${lx} ${ly}m-${11 * s} 0q${11 * s} -${8 * s} ${22 * s} 0q-${11 * s} ${8 * s} -${22 * s} 0z" transform="rotate(${a + 90} ${lx} ${ly})" fill="${t.success}" stroke="${mix(t.success, ink, 0.5)}" stroke-width="1"/>`;
  };
  const leaves = [0, 52, 118, 170, 236, 300].map((a, i) => leaf(a, 0.8 + (i % 3) * 0.25)).join('');

  const cr = rng(29);
  let speed = '';
  for (let i = 0; i < 10; i++) {
    const a = cr() * 360;
    const [x1, y1] = polar(RS[0], RS[1], RR * 1.15, a);
    const [x2, y2] = polar(RS[0], RS[1], RR * 1.15, a + 40 + cr() * 50);
    speed += `M${x1} ${y1}A${RR * 1.15} ${RR * 1.15} 0 0 1 ${x2} ${y2}`;
  }

  // Wind trails streaming back from the sphere as it is driven forward.
  let trails = '';
  [[-0.7, 150, 2.5], [-0.35, 210, 4], [0, 180, 3.5], [0.35, 200, 4], [0.7, 140, 2.5]].forEach(([k, len, w], i) => {
    const y = RS[1] + k * RR;
    trails += `<path d="M${RS[0] - RR * 0.7} ${n1(y)}Q${n1(RS[0] - RR - len * 0.5)} ${n1(y + k * 30 - 6)} ${n1(RS[0] - RR - len)} ${n1(y + k * 60)}" fill="none" stroke="url(#dbtefx-nr-trail)" stroke-width="${w}" stroke-linecap="round" ${anim('pulse', n1(0.9 + i * 0.17), i * 0.3, 'ease-in-out')}/>`;
  });

  return `<style>@keyframes dbtefx-nr-drift { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-36px); } }
@keyframes dbtefx-nr-wire { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }</style>
<defs>
<linearGradient id="dbtefx-nr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, chakra, 0.12)}" stop-opacity="0.6"/><stop offset="0.5" stop-color="${mix(t.bg, t.danger, 0.2)}" stop-opacity="0.35"/><stop offset="0.72" stop-color="${dusk}" stop-opacity="0.22"/><stop offset="1" stop-color="${dusk}" stop-opacity="0.1"/></linearGradient>
<linearGradient id="dbtefx-nr-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cloudLit}" stop-opacity="0.9"/><stop offset="1" stop-color="${cloudShade}" stop-opacity="0.9"/></linearGradient>
<linearGradient id="dbtefx-nr-cliff" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${mix(mix(t.bg, t.muted, 0.3), dusk, 0.25)}"/><stop offset="1" stop-color="${mix(t.bg, t.muted, 0.08)}"/></linearGradient>
<linearGradient id="dbtefx-nr-drum" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(roof, t.bg, 0.65)}"/><stop offset="0.35" stop-color="${mix(roof, t.bg, 0.25)}"/><stop offset="1" stop-color="${mix(roof, t.bg, 0.75)}"/></linearGradient>
<linearGradient id="dbtefx-nr-tank" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(wall, t.muted, 0.2)}"/><stop offset="0.4" stop-color="${mix(wall, t.muted, 0.45)}"/><stop offset="1" stop-color="${wall}"/></linearGradient>
<radialGradient id="dbtefx-nr-halo"><stop offset="0" stop-color="${chakra}" stop-opacity="0.55"/><stop offset="0.35" stop-color="${chakra}" stop-opacity="0.18"/><stop offset="1" stop-color="${chakra}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-nr-ball" cx="0.42" cy="0.4" r="0.6"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.35" stop-color="${core}" stop-opacity="0.8"/><stop offset="0.85" stop-color="${chakra}" stop-opacity="0.55"/><stop offset="1" stop-color="${chakra}" stop-opacity="0.15"/></radialGradient>
<radialGradient id="dbtefx-nr-moon" cx="0.4" cy="0.4" r="0.65"><stop offset="0" stop-color="${mix(t.text, '#ffffff', 0.4)}"/><stop offset="1" stop-color="${mix(t.text, t.accent, 0.25)}"/></radialGradient>
<radialGradient id="dbtefx-nr-moonglow"><stop offset="0.4" stop-color="${t.text}" stop-opacity="0.18"/><stop offset="1" stop-color="${t.text}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-nr-trail" gradientUnits="userSpaceOnUse" x1="${RS[0] - RR}" y1="0" x2="${RS[0] - RR - 220}" y2="0"><stop offset="0" stop-color="${core}" stop-opacity="0.7"/><stop offset="1" stop-color="${chakra}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-nr-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dusk}" stop-opacity="0"/><stop offset="0.6" stop-color="${dusk}" stop-opacity="0.22"/><stop offset="1" stop-color="${dusk}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-nr-sky)"/>
<circle cx="${MOON[0]}" cy="${MOON[1]}" r="150" fill="url(#dbtefx-nr-moonglow)"/><circle cx="${MOON[0]}" cy="${MOON[1]}" r="64" fill="url(#dbtefx-nr-moon)"/><g fill="${mix(t.text, t.muted, 0.5)}" fill-opacity="0.25"><circle cx="${MOON[0] - 18}" cy="${MOON[1] - 10}" r="12"/><circle cx="${MOON[0] + 20}" cy="${MOON[1] + 16}" r="8"/><circle cx="${MOON[0] + 6}" cy="${MOON[1] - 30}" r="5"/></g>
<g style="animation: dbtefx-nr-drift 60s ease-in-out infinite;">
${cloud(30, 270, 380, 70, 3)}
${cloud(560, 160, 280, 52, 5)}
</g>
<g fill="${mix(t.success, t.bg, 0.74)}">${crown}</g>
<path d="${rim}" fill="url(#dbtefx-nr-cliff)"/>
<path d="${ledges}" fill="none" stroke="${mix(dusk, t.text, 0.3)}" stroke-opacity="0.12" stroke-width="3" stroke-linecap="round"/>
<path d="${strata}" fill="none" stroke="${ink}" stroke-opacity="0.4" stroke-width="2"/>
<rect y="560" width="${W}" height="160" fill="url(#dbtefx-nr-mist)"/>
<!--mid-->
<path d="${wires}" fill="none" stroke="${ink}" stroke-opacity="0.8" stroke-width="1.6" style="animation: dbtefx-nr-wire 6s ease-in-out infinite;"/>
<path d="${poleD}" stroke="${ink}" stroke-width="5"/>
${backRow}
${tower}
${frontRow}
${windows}
<!--near-->
${trails}
<circle cx="${RS[0]}" cy="${RS[1]}" r="${RR * 3.4}" fill="url(#dbtefx-nr-halo)" ${anim('bloom', 3.2, 0, 'ease-in-out')}/>
<circle cx="${RS[0]}" cy="${RS[1]}" r="${RR}" fill="url(#dbtefx-nr-ball)"/>
<g style="transform-origin: ${RS[0]}px ${RS[1]}px; animation: dbtefx-spin 1.6s linear infinite;"><path d="${arms}" fill="none" stroke="#ffffff" stroke-opacity="0.75" stroke-width="3" stroke-linecap="round"/></g>
<g style="transform-origin: ${RS[0]}px ${RS[1]}px; animation: dbtefx-spin 2.4s linear infinite reverse;"><path d="${speed}" fill="none" stroke="${core}" stroke-opacity="0.7" stroke-width="2.5" stroke-linecap="round"/></g>
<g style="transform-origin: ${RS[0]}px ${RS[1]}px; animation: dbtefx-spin 7s linear infinite;">${leaves}</g>
<path d="M-40 900V830Q200 812 420 828T880 822T1300 830T1660 818V900Z" fill="${mix(t.bg, '#000000', 0.25)}"/>`;
};

export default naruto;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'leaf', count: 18, colors: ['success', 'accent'], swirl: true },
  { kind: 'mote', count: 22, colors: ['accent2'], column: true, columnX: 0.78, rise: true },
];

// WebGL layer (shader.js): the dusk sky and the chakra sphere's churning
// core, in the scene's own 1600x900 frame: a swirl of fbm streaks sheared by
// angle and radius, a hot white centre and a wide blue bloom.
export const shader = {
  uniforms: ['bg', 'accent', 'accent2', 'danger'],
  frag: `
void main() {
  float s = max(u_res.x / 1600.0, u_res.y / 900.0);
  vec2 vb = (gl_FragCoord.xy - 0.5 * u_res) / s;
  vb = vec2(vb.x + 800.0, 450.0 - vb.y);
  float k = clamp(vb.y / 760.0, 0.0, 1.0);
  vec3 dusk = mix(u_accent, u_danger, 0.3);
  vec3 col = mix(u_bg, mix(u_bg, u_danger, 0.25), smoothstep(0.2, 0.75, k));
  col = mix(col, dusk * 0.62, smoothstep(0.6, 1.0, k) * 0.5);
  col += dusk * fbm(vec2(vb.x * 0.002 + u_time * 0.01, vb.y * 0.006)) * 0.12 * k;
  vec2 d = (vb - vec2(${RS[0]}.0, ${RS[1]}.0)) / ${RR}.0;
  float r = length(d);
  float a = atan(d.y, d.x);
  float wind = fbm(vec2(a * 3.0 - u_time * 3.0, r * 1.5 - u_time * 0.5));
  col += u_accent2 * exp(-r * 0.55) * (0.35 + 0.25 * wind);
  vec2 uv = gl_FragCoord.xy / u_res;
  col *= 1.0 - 0.5 * dot(uv - 0.5, uv - 0.5);
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
