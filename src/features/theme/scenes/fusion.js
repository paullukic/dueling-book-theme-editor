import { mix } from '../../../lib/color.js';
import { glow, H, n1, polar, rng, W } from './kit.js';

// Fusion: Polymerization. Two fusion materials, a cool stream and a warm one,
// pour in from beyond the right edge, braid into one vortex and merge in a
// white-violet burst that throws a shockwave. The vortex turns slowly, so the
// arms read as energy drawn inward.
const cx = 1324;
const cy = 430;

// Catmull-Rom through the points as cubic Beziers: smooth curves, few points.
const smooth = (p) => {
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[Math.max(i - 1, 0)];
    const b = p[i];
    const c = p[i + 1];
    const e = p[Math.min(i + 2, p.length - 1)];
    d += `C${Math.round(b[0] + (c[0] - a[0]) / 6)} ${Math.round(b[1] + (c[1] - a[1]) / 6)} ${Math.round(c[0] - (e[0] - b[0]) / 6)} ${Math.round(c[1] - (e[1] - b[1]) / 6)} ${c[0]} ${c[1]}`;
  }
  return d;
};

// A tapered ribbon along a logarithmic spiral winding in to the core.
// phase: angle of the outer end; spread: extra angle at the outer end that
// closes to nothing at the core, so strands of one stream converge.
const ribbon = (phase, reach, width, spread = 0, wobble = 0) => {
  const k = 0.45;
  const span = Math.log(reach / 8) / k;
  const steps = 24;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const th = u * span;
    const r = reach * Math.exp(-k * th);
    const f = r / reach;
    const a = phase + spread * f - (th * 180) / Math.PI;
    const w = width * Math.min(1, u * 4) * (0.1 + 0.9 * f ** 0.45) * (1 + wobble * Math.sin(u * 11 + phase));
    pts.push({ p: polar(cx, cy, r, a), w });
  }
  const left = [];
  const right = [];
  pts.forEach(({ p, w }, i) => {
    const q = pts[Math.min(i + 1, steps)].p;
    const o = pts[Math.max(i - 1, 0)].p;
    const len = Math.hypot(q[0] - o[0], q[1] - o[1]) || 1;
    const nx = (-(q[1] - o[1]) / len) * w;
    const ny = ((q[0] - o[0]) / len) * w;
    left.push([Math.round(p[0] + nx), Math.round(p[1] + ny)]);
    right.push([Math.round(p[0] - nx), Math.round(p[1] - ny)]);
  });
  return `${smooth(left)}L${smooth(right.reverse()).slice(1)}Z`;
};

const fusion = (t) => {
  const cool = mix(t.accent, t.opp, 0.6);
  const warm = mix(t.warning, t.accent2, 0.3);
  const core = mix(t.accent, '#ffffff', 0.5);

  // Each material is a braid of fine filaments that fan apart at the tail and
  // gather into one thread at the core, over one soft glow band.
  const stream = (phase, reach, fill, hi, seed) => {
    const r = rng(seed);
    let s = `<path d="${ribbon(phase, reach, 46, 0, 0.2)}" fill="url(#${fill})" opacity="0.22"/>`;
    for (let j = 0; j < 6; j++) {
      const w = j % 3 === 0 ? 5 + r() * 3 : 1.4 + r() * 2;
      s += `<path d="${ribbon(phase + (r() - 0.5) * 24, reach * (0.8 + r() * 0.3), w, (r() - 0.5) * 70, 0.35)}" fill="url(#${fill})" opacity="${n1(0.55 + r() * 0.4)}"/>`;
    }
    s += `<path d="${ribbon(phase + 2, reach * 0.95, 3.2, 4, 0.3)}" fill="url(#${hi})"/>`;
    return s;
  };
  const fade = (id, c) =>
    `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="1000" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${mix(c, '#ffffff', 0.4)}"/><stop offset="0.18" stop-color="${c}"/><stop offset="0.3" stop-color="${c}" stop-opacity="0.45"/><stop offset="0.46" stop-color="${c}" stop-opacity="0"/></radialGradient>`;

  // Faint background dust, scattered.
  const r = rng(71);
  let dust = '';
  for (let i = 0; i < 80; i++) {
    dust += `<circle cx="${n1(r() * W)}" cy="${n1(r() * H)}" r="${n1(0.6 + r() * 1.3)}" fill="${r() > 0.5 ? t.text : t.muted}" opacity="${n1(0.1 + r() * 0.35)}"/>`;
  }

  // Burst: a few long, thin spikes thrown off where the materials merge.
  const rr = rng(9);
  let rays = '';
  for (let i = 0; i < 8; i++) {
    const a = i * 45 + rr() * 20;
    const [x1, y1] = polar(cx, cy, 70 + rr() * 110, a);
    const [l1, m1] = polar(cx, cy, 5, a - 90);
    const [l2, m2] = polar(cx, cy, 5, a + 90);
    rays += `<path d="M${l1} ${m1}L${x1} ${y1}L${l2} ${m2}Z"/>`;
  }

  return `<style>
@keyframes dbtefx-fu-turn { to { transform: rotate(-360deg); } }
@keyframes dbtefx-fu-flare { 0%, 100% { transform: scale(0.92); opacity: 0.75; } 50% { transform: scale(1.1); opacity: 1; } }
@keyframes dbtefx-fu-wave { 0% { transform: scale(0.2); opacity: 0; } 8% { opacity: 0.9; } 60%, 100% { transform: scale(1.6); opacity: 0; } }
</style>
<defs>
<radialGradient id="dbtefx-fu-sky" cx="${cx}" cy="${cy}" r="1100" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${mix(t.bg, t.accent, 0.3)}"/><stop offset="0.4" stop-color="${mix(t.bg, t.accent, 0.12)}"/><stop offset="1" stop-color="${t.bg}"/></radialGradient>
${fade('dbtefx-fu-cool', cool)}${fade('dbtefx-fu-warm', warm)}${fade('dbtefx-fu-coolhi', mix(cool, '#ffffff', 0.5))}${fade('dbtefx-fu-warmhi', mix(warm, '#ffffff', 0.45))}
${glow('dbtefx-fu-halo', t.accent, 0.5, 0.5, 0.5, 0.5)}
${glow('dbtefx-fu-core', core, 0.5, 0.5, 0.5, 0.9)}
<radialGradient id="dbtefx-fu-ray" cx="${cx}" cy="${cy}" r="230" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="${core}" stop-opacity="0.55"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-fu-white" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.3" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="1" stop-color="${core}" stop-opacity="0"/></radialGradient>
</defs>
<rect x="-200" y="-200" width="2000" height="1300" fill="url(#dbtefx-fu-sky)"/>
${dust}
<circle class="dbtefx-fu-vortex" cx="${cx}" cy="${cy}" r="480" fill="url(#dbtefx-fu-halo)"/>
<!--mid-->
<g class="dbtefx-fu-vortex">
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-fu-turn 45s linear infinite;">
${stream(80, 1150, 'dbtefx-fu-cool', 'dbtefx-fu-coolhi', 3)}
${stream(-10, 1050, 'dbtefx-fu-warm', 'dbtefx-fu-warmhi', 5)}
</g>
<circle cx="${cx}" cy="${cy}" r="190" fill="url(#dbtefx-fu-core)"/>
<circle cx="${cx}" cy="${cy}" r="120" fill="none" stroke="${mix(core, '#ffffff', 0.4)}" stroke-width="3" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-fu-wave 5s ease-out infinite;"/>
<g fill="url(#dbtefx-fu-ray)" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-fu-flare 5s ease-in-out infinite;">${rays}</g>
<circle cx="${cx}" cy="${cy}" r="58" fill="url(#dbtefx-fu-white)" style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-fu-flare 5s ease-in-out -0.4s infinite;"/>
</g>`;
};

export default fusion;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 46, colors: ['accent', 'opp', 'warning'] }];
