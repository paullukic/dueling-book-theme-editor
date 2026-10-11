import { mix } from '../../../lib/color.js';
import { glow, H, n1, rng, W } from './kit.js';

// Xyz: the Xyz Summon. The materials have dived into a galaxy vortex that
// lies tilted in black space on the right; overlay units circle it on a wide
// orbit, and rank stars are scattered across the dark.
const cx = 1260;
const cy = 420;
const tilt = -14;
const squash = 0.4;

const xyz = (t) => {
  const gold = t.accent;
  const goldHi = mix(gold, '#ffffff', 0.55);
  const violet = t.opp;
  const r = rng(53);

  // Galaxy, drawn face-on around 0,0, then tilted and squashed into perspective.
  // Two arms of seeded dust along log spirals plus a soft lane under each.
  let dust = '';
  let lanes = '';
  for (let arm = 0; arm < 2; arm++) {
    let d = '';
    for (let i = 0; i <= 40; i++) {
      const th = (i / 40) * 3.6 * Math.PI;
      const rad = 17 * Math.exp(0.26 * th);
      const a = th + arm * Math.PI;
      d += `${i ? 'L' : 'M'}${n1(rad * Math.cos(a))} ${n1(rad * Math.sin(a))}`;
    }
    lanes += `<path d="${d}" fill="none" stroke="url(#dbtefx-xy-lane)" stroke-width="96" opacity="0.1"/><path d="${d}" fill="none" stroke="url(#dbtefx-xy-lane)" stroke-width="48" opacity="0.18"/><path d="${d}" fill="none" stroke="url(#dbtefx-xy-lane)" stroke-width="12" opacity="0.7"/><path d="${d}" fill="none" stroke="url(#dbtefx-xy-lane)" stroke-width="3"/>`;
    for (let i = 0; i < 100; i++) {
      const th = r() ** 0.8 * 3.6 * Math.PI;
      const rad = 17 * Math.exp(0.26 * th);
      const jitter = (r() - 0.5) * (0.25 + rad / 900) * 1.4;
      const a = th + arm * Math.PI + jitter;
      const big = r() > 0.88;
      dust += `<circle cx="${n1(rad * Math.cos(a))}" cy="${n1(rad * Math.sin(a))}" r="${n1(big ? 2.4 + r() * 1.6 : 0.8 + r() * 1.4)}" fill="${rad > 230 && r() > 0.5 ? mix(violet, '#ffffff', 0.4) : r() > 0.3 ? goldHi : '#ffffff'}" opacity="${n1(0.35 + r() * 0.6)}"/>`;
    }
  }

  // Overlay units on a tilted orbit (ellipse in screen space), dimmer behind the galaxy.
  const R = 290;
  let orbit = '';
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const x = R * Math.cos(a);
    const y = R * squash * 0.9 * Math.sin(a);
    const tr = (tilt * Math.PI) / 180;
    const back = Math.sin(a) < 0;
    orbit += `${n1((i / 24) * 100)}% { transform: translate(${n1(x * Math.cos(tr) - y * Math.sin(tr))}px, ${n1(x * Math.sin(tr) + y * Math.cos(tr))}px) scale(${back ? 0.75 : 1}); opacity: ${back ? 0.45 : 1}; } `;
  }
  let units = '';
  for (let i = 0; i < 3; i++) {
    units += `<g transform="translate(${cx} ${cy})"><g style="animation: dbtefx-xy-orbit 16s linear ${n1(-i * (16 / 3))}s infinite;"><circle r="34" fill="url(#dbtefx-xy-unit)"/><circle r="7" fill="#ffffff"/><circle r="12" fill="none" stroke="${goldHi}" stroke-width="1.5" opacity="0.7"/></g></g>`;
  }

  // The materials diving into the galaxy as streaks of light, one after the other.
  const comet = (deg, color, delay) =>
    `<g transform="translate(${cx} ${cy}) rotate(${deg})"><g opacity="0" style="animation: dbtefx-xy-dive 9s cubic-bezier(0.55, 0, 0.85, 0.5) ${n1(-delay)}s infinite;"><path d="M-420 0L-12 -14A14 14 0 0 1 -12 14Z" fill="url(#dbtefx-xy-tail-${color === gold ? 'g' : 'v'})" opacity="0.25"/><path d="M-380 0L-12 -5A5 5 0 0 1 -12 5Z" fill="url(#dbtefx-xy-tail-${color === gold ? 'g' : 'v'})"/><circle cx="-10" r="16" fill="url(#dbtefx-xy-unit)"/><circle cx="-10" r="4" fill="#ffffff"/></g></g>`;
  const comets = comet(80, gold, 1) + comet(124, violet, 5.5);
  const tail = (id, c) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="0.75" stop-color="${c}" stop-opacity="0.7"/><stop offset="1" stop-color="#ffffff"/></linearGradient>`;

  // Rank stars scattered with seeded positions and sizes; a few twinkle.
  const rs = rng(17);
  const glint = (x, y, s) => `M${x} ${n1(y - s)}Q${x} ${y} ${n1(x + s * 0.3)} ${y}Q${x} ${y} ${x} ${n1(y + s)}Q${x} ${y} ${n1(x - s * 0.3)} ${y}Q${x} ${y} ${x} ${n1(y - s)}Z`;
  let stars = '';
  for (let i = 0; i < 70; i++) {
    const x = n1(-100 + rs() * (W + 200));
    const y = n1(-60 + rs() * (H + 120));
    const s = n1(rs() < 0.85 ? 3 + rs() * 6 : 10 + rs() * 12);
    const tw = i % 6 === 0 ? ` style="transform-box: fill-box; transform-origin: center; animation: dbtefx-xy-tw ${n1(3 + rs() * 4)}s ease-in-out ${n1(-rs() * 6)}s infinite;"` : '';
    stars += `<path d="${glint(x, y, s)}" fill="${rs() > 0.4 ? gold : t.accent2}" opacity="${n1(0.25 + rs() * 0.55)}"${tw}/>`;
  }

  return `<style>
@keyframes dbtefx-xy-turn { to { transform: rotate(360deg); } }
@keyframes dbtefx-xy-orbit { ${orbit}}
@keyframes dbtefx-xy-dive { 0% { transform: translateX(-720px); opacity: 0; } 8% { opacity: 1; } 40% { opacity: 1; transform: translateX(-30px) scale(1); } 44%, 100% { transform: translateX(0) scale(0.3); opacity: 0; } }
@keyframes dbtefx-xy-tw { 0%, 100% { transform: scale(0.6); opacity: 0.3; } 50% { transform: scale(1.15); opacity: 1; } }
</style>
<defs>
<radialGradient id="dbtefx-xy-sky" cx="${cx}" cy="${cy}" r="1200" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${mix(t.bg, violet, 0.14)}"/><stop offset="0.35" stop-color="${mix(t.bg, violet, 0.05)}"/><stop offset="1" stop-color="${t.bg}"/></radialGradient>
<radialGradient id="dbtefx-xy-lane" cx="0" cy="0" r="330" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${goldHi}" stop-opacity="0.9"/><stop offset="0.35" stop-color="${gold}" stop-opacity="0.45"/><stop offset="0.7" stop-color="${violet}" stop-opacity="0.18"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
${tail('dbtefx-xy-tail-g', gold)}${tail('dbtefx-xy-tail-v', violet)}
${glow('dbtefx-xy-halo', violet, 0.5, 0.5, 0.5, 0.28)}
${glow('dbtefx-xy-bulge', goldHi, 0.5, 0.5, 0.5, 0.9)}
${glow('dbtefx-xy-unit', goldHi, 0.5, 0.5, 0.5, 0.8)}
<radialGradient id="dbtefx-xy-core" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="1" stop-color="${goldHi}" stop-opacity="0"/></radialGradient>
</defs>
<rect x="-200" y="-200" width="2000" height="1300" fill="url(#dbtefx-xy-sky)"/>
${stars}
<!--mid-->
<ellipse cx="${cx}" cy="${cy}" rx="560" ry="300" fill="url(#dbtefx-xy-halo)" transform="rotate(${tilt} ${cx} ${cy})"/>
<g transform="translate(${cx} ${cy}) rotate(${tilt}) scale(1 ${squash})"><g style="animation: dbtefx-xy-turn 90s linear infinite;">${lanes}${dust}</g>
<circle r="150" fill="url(#dbtefx-xy-bulge)"/></g>
<ellipse cx="${cx}" cy="${cy}" rx="70" ry="46" fill="url(#dbtefx-xy-core)" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-bloom 5s ease-in-out infinite;"/>
${comets}
${units}`;
};

export default xyz;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 60, colors: ['accent', 'text'] }];
