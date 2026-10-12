import { mix } from '../../../lib/color.js';
import { anim, n1, polar, rng } from './kit.js';

// Power Patron: the Eye of the Patrons opens over the Plundered Plane. The
// sigil eye with its forked rays hangs in a halo of black thorn-lace blades
// (Vidolium's wings); the three Patrons orbit it as gems (Nerva crimson,
// Junora silver, Jupiter green) and the prismatic road of Vilaea pours down
// from it. The eye blinks, the gems circle, light runs down the road.
const powerPatron = (t) => {
  const rand = rng(83);
  const [ex, ey] = [1310, 300];
  const ice = t.accent;
  const iceHi = mix(ice, '#ffffff', 0.5);
  const obsidian = mix(t.bg, '#000000', 0.6);
  const lace = mix(t.surface, t.bg, 0.3);

  // Halo: black thorn blades fanning out of the eye, kept out of the feed.
  let blades = '';
  let rims = '';
  let holes = '';
  let veins = '';
  for (let i = 0; i < 24; i++) {
    const a = i * 15 + rand() * 5;
    const left = Math.cos((a * Math.PI) / 180);
    let len = 180 + rand() * 200 + (i % 2 ? 0 : 100);
    if (left < -0.1) len = Math.min(len, (ex - 1160) / -left - 92);
    if (len < 70) continue;
    const r0 = 92;
    const w = (i % 2 ? 14 : 22) + rand() * 6;
    const bend = (rand() * 2 - 1) * 0.1 + 0.06;
    const [ax, ay] = polar(ex, ey, r0, a - (w / r0) * 30);
    const [bx, by] = polar(ex, ey, r0, a + (w / r0) * 30);
    const [tx, ty] = polar(ex, ey, r0 + len, a + bend * 30);
    const [m1x, m1y] = polar(ex, ey, r0 + len * 0.55, a - (w / (r0 + len * 0.55)) * 40 + bend * 18);
    const [m2x, m2y] = polar(ex, ey, r0 + len * 0.5, a + (w / (r0 + len * 0.5)) * 40 + bend * 18);
    blades += `M${ax} ${ay}Q${m1x} ${m1y} ${tx} ${ty}Q${m2x} ${m2y} ${bx} ${by}Z`;
    rims += `M${ax} ${ay}Q${m1x} ${m1y} ${tx} ${ty}`;
    const [vx, vy] = polar(ex, ey, r0 + len * 0.82, a + bend * 24);
    veins += `M${polar(ex, ey, r0 + 8, a).join(' ')}L${vx} ${vy}`;
    // Lace cut-outs down the blade: diamonds and rings, shrinking toward the tip.
    const n = Math.max(2, Math.floor(len / 70));
    for (let k = 0; k < n; k++) {
      const f = 0.14 + (k / n) * 0.62;
      const [hx, hy] = polar(ex, ey, r0 + len * f, a + bend * 30 * f);
      const s = w * (0.5 - f * 0.4);
      holes += k % 2
        ? `<circle cx="${hx}" cy="${hy}" r="${n1(s * 0.5)}"/>`
        : `<path d="M${n1(hx)} ${n1(hy - s)}L${n1(hx + s * 0.55)} ${hy}L${n1(hx)} ${n1(hy + s)}L${n1(hx - s * 0.55)} ${hy}Z" transform="rotate(${n1(a + 90)} ${hx} ${hy})"/>`;
    }
  }
  // Scalloped lace collar around the eye's disc.
  let scallop = '';
  for (let i = 0; i < 28; i++) {
    const [x1, y1] = polar(ex, ey, 100, i * (360 / 28));
    const [x2, y2] = polar(ex, ey, 100, (i + 1) * (360 / 28));
    scallop += `${i ? '' : `M${x1} ${y1}`}A11.5 11.5 0 0 1 ${x2} ${y2}`;
  }

  // Ring of Theorealize script turning slowly around the eye.
  let script = '';
  for (let i = 0; i < 64; i++) {
    const a = i * (360 / 64);
    const [x, y] = polar(ex, ey, 150, a);
    const h = 5 + rand() * 7;
    const kind = Math.floor(rand() * 4);
    const d = kind === 0 ? `M0 ${-h}V${h}M-3 ${-h * 0.3}H3` : kind === 1 ? `M-3 ${-h}Q4 0 -3 ${h}` : kind === 2 ? `M0 ${-h}L3 0L0 ${h}M-3 0H3` : `M-2 ${-h}V${h}M2 ${-h * 0.5}V${h * 0.5}`;
    script += `<path d="${d}" transform="translate(${x} ${y}) rotate(${n1(a + 90)})"/>`;
  }

  // The eye sigil: almond, iris, forked rays below (nothing above: the front page's links sit there).
  const fork = (dir) => {
    const s = dir;
    return `M${ex} ${ey + s * 62}V${ey + s * 196}M${ex} ${ey + s * 150}L${ex - 30} ${ey + s * 180}V${ey + s * 214}M${ex} ${ey + s * 150}L${ex + 30} ${ey + s * 180}V${ey + s * 214}M${ex} ${ey + s * 108}L${ex - 54} ${ey + s * 140}V${ey + s * 160}M${ex} ${ey + s * 108}L${ex + 54} ${ey + s * 140}V${ey + s * 160}`;
  };
  const nodes = [[0, 196], [-30, 214], [30, 214], [-54, 160], [54, 160]].map(([dx, dy]) => [ex + dx, ey + dy])
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5"/>`).join('');
  const almond = `M${ex - 128} ${ey}Q${ex} ${ey - 92} ${ex + 128} ${ey}Q${ex} ${ey + 92} ${ex - 128} ${ey}Z`;
  const tendril = (s) => `M${ex + s * 128} ${ey}C${ex + s * 160} ${ey - 4} ${ex + s * 176} ${ey - 30} ${ex + s * 168} ${ey - 46}C${ex + s * 160} ${ey - 60} ${ex + s * 140} ${ey - 52} ${ex + s * 146} ${ey - 38}M${ex + s * 128} ${ey}C${ex + s * 160} ${ey + 4} ${ex + s * 176} ${ey + 30} ${ex + s * 168} ${ey + 46}C${ex + s * 160} ${ey + 60} ${ex + s * 140} ${ey + 52} ${ex + s * 146} ${ey + 38}`;

  // The three Patrons as faceted gems on a tilted orbit (behind the eye at the top).
  const gem = (color, delay, k) => `<g style="animation: dbtefx-pp-orbit 18s linear ${delay}s infinite; transform-box: fill-box; transform-origin: center;">
<circle cx="${ex}" cy="${ey}" r="80" fill="url(#dbtefx-pp-gem${k})"/>
<path d="M${ex} ${ey - 64}L${ex + 32} ${ey - 14}L${ex} ${ey + 68}L${ex - 32} ${ey - 14}Z" fill="${color}" stroke="${mix(color, '#ffffff', 0.6)}" stroke-width="2"/>
<path d="M${ex - 32} ${ey - 14}H${ex + 32}M${ex} ${ey - 64}L${ex - 11} ${ey - 14}L${ex} ${ey + 68}L${ex + 11} ${ey - 14}Z" fill="#ffffff" fill-opacity="0.22" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.2"/>
<path d="M${ex - 6} ${ey - 50}L${ex - 20} ${ey - 20}" stroke="#ffffff" stroke-opacity="0.8" stroke-width="3" stroke-linecap="round"/>
</g>`;
  const orbitKeys = [];
  for (let i = 0; i <= 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const x = n1(Math.cos(a) * 150);
    const y = n1(Math.sin(a) * 64 + 150);
    const back = Math.sin(a) < -0.2;
    orbitKeys.push(`${n1((i / 12) * 100)}% { transform: translate(${x}px, ${y}px) scale(${n1(0.85 + Math.sin(a) * 0.2)}); opacity: ${back ? 0.35 : 1}; }`);
  }

  // Vilaea's prismatic road: six spectral lanes from under the eye to the bottom edge.
  const lanes = [t.accent2, t.warning, t.success, ice, t.link, mix(t.accent2, t.link, 0.5)];
  const [r0, r1, b0, b1] = [ex - 20, ex + 20, 1130, 1620];
  const road = `M${r0} ${ey + 230}L${r1} ${ey + 230}L${b1} 900H${b0}Z`;
  const lane = (k) => `M${n1(r0 + ((r1 - r0) * k) / 6)} ${ey + 230}L${n1(r0 + ((r1 - r0) * (k + 1)) / 6)} ${ey + 230}L${n1(b0 + ((b1 - b0) * (k + 1)) / 6)} 900L${n1(b0 + ((b1 - b0) * k) / 6)} 900Z`;
  const roadArt = lanes.map((c, k) => `<path d="${lane(k)}" fill="${c}" fill-opacity="0.42"/>`).join('');

  // Black glass shards falling at the edges.
  let shards = '';
  [1200, 1290, 1380, 1460, 1560, 60, 220, 340].forEach((x, i) => {
    const s = 0.8 + rand() * 0.9;
    shards += `<g transform="translate(${x} 0)"><g ${anim('fall', n1(14 + rand() * 9), n1(rand() * 22), 'ease-in-out')}><path d="M0 ${n1(-26 * s)}L${n1(7 * s)} ${n1(6 * s)}L${n1(-2 * s)} ${n1(22 * s)}L${n1(-8 * s)} ${n1(-4 * s)}Z" fill="${obsidian}" stroke="${i % 3 === 0 ? t.success : ice}" stroke-opacity="0.75" stroke-width="1.2"/></g></g>`;
  });

  return `<style>
@keyframes dbtefx-pp-orbit { ${orbitKeys.join(' ')} }
@keyframes dbtefx-pp-run { 0% { transform: translateY(-120px); opacity: 0; } 15% { opacity: 1; } 100% { transform: translateY(560px); opacity: 0; } }
.dbtefx-pp-linkhole { display: none; }
@keyframes dbtefx-pp-iris { 0%, 100% { transform: scale(1); opacity: 0.85; } 50% { transform: scale(1.18); opacity: 1; } }
</style>
<defs>
<radialGradient id="dbtefx-pp-void" cx="${ex}" cy="${ey}" r="720" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${mix(t.border, ice, 0.2)}" stop-opacity="0.5"/><stop offset="0.35" stop-color="${t.border}" stop-opacity="0.3"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-pp-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${iceHi}" stop-opacity="0.6"/><stop offset="0.45" stop-color="${ice}" stop-opacity="0.12"/><stop offset="1" stop-color="${ice}" stop-opacity="0"/></radialGradient>
${[t.accent2, mix(t.text, t.muted, 0.3), t.success].map((c, k) => `<radialGradient id="dbtefx-pp-gem${k}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${c}" stop-opacity="0.6"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('')}
<radialGradient id="dbtefx-pp-iris" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="${iceHi}"/><stop offset="1" stop-color="${ice}" stop-opacity="0.2"/></radialGradient>
<linearGradient id="dbtefx-pp-fade" x1="0" y1="${ey + 230}" x2="0" y2="900" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffffff" stop-opacity="1"/><stop offset="0.6" stop-color="#ffffff" stop-opacity="0.45"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.1"/></linearGradient>
<linearGradient id="dbtefx-pp-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<mask id="dbtefx-pp-roadmask"><path d="${road}" fill="url(#dbtefx-pp-fade)"/></mask>
<radialGradient id="dbtefx-pp-holefade"><stop offset="0.55" stop-color="#000000"/><stop offset="1" stop-color="#000000" stop-opacity="0"/></radialGradient>
<mask id="dbtefx-pp-links" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900"><rect width="1600" height="900" fill="#ffffff"/><ellipse class="dbtefx-pp-linkhole" cx="1330" cy="180" rx="125" ry="90" fill="url(#dbtefx-pp-holefade)"/></mask>
<clipPath id="dbtefx-pp-roadclip"><path d="${road}"/></clipPath>
<linearGradient id="dbtefx-pp-blade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(lace, obsidian, 0.4)}"/><stop offset="1" stop-color="${obsidian}"/></linearGradient>
</defs>
<rect x="0" y="0" width="1600" height="900" fill="url(#dbtefx-pp-void)"/>
<g mask="url(#dbtefx-pp-roadmask)">${roadArt}</g>
<g clip-path="url(#dbtefx-pp-roadclip)"><rect x="1000" y="${ey + 230}" width="640" height="90" fill="url(#dbtefx-pp-band)" style="animation: dbtefx-pp-run 6s ease-in infinite;"/></g>
<path d="M${r0} ${ey + 230}L${b0} 900M${r1} ${ey + 230}L${b1} 900" stroke="${iceHi}" stroke-opacity="0.35" stroke-width="1.5"/>
<!--mid-->
<g class="dbtefx-pp-sigil">
<ellipse cx="${ex}" cy="${ey}" rx="230" ry="200" fill="url(#dbtefx-pp-glow)" ${anim('pulse', 6, 0, 'ease-in-out')}/>
<g mask="url(#dbtefx-pp-links)">
<path d="${blades}" fill="url(#dbtefx-pp-blade)" stroke="${obsidian}" stroke-width="1.5"/>
<g fill="${mix(ice, t.bg, 0.55)}" fill-opacity="0.85" stroke="${t.warning}" stroke-opacity="0.75" stroke-width="1.1">${holes}</g>
<path d="${veins}" stroke="${t.warning}" stroke-opacity="0.4" stroke-width="1.2" stroke-dasharray="10 4 2 4"/>
<path d="${scallop}" fill="none" stroke="${t.warning}" stroke-opacity="0.7" stroke-width="1.6"/>
<path d="${rims}" fill="none" stroke="${ice}" stroke-opacity="0.45" stroke-width="1.2"/>
<circle cx="${ex}" cy="${ey}" r="96" fill="${obsidian}" stroke="${ice}" stroke-opacity="0.5" stroke-width="2"/>
<g style="transform-origin: ${ex}px ${ey}px; animation: dbtefx-spin 200s linear infinite;" fill="none" stroke="${iceHi}" stroke-opacity="0.55" stroke-width="1.4" stroke-linecap="round">${script}<circle cx="${ex}" cy="${ey}" r="134" stroke-opacity="0.3"/><circle cx="${ex}" cy="${ey}" r="166" stroke-opacity="0.3" stroke-dasharray="2 6"/></g>
</g>
<g class="dbtefx-pp-eye">
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path d="${fork(1)}${tendril(-1)}${tendril(1)}" stroke="${ice}" stroke-opacity="0.35" stroke-width="10"/>
<path d="${fork(1)}${tendril(-1)}${tendril(1)}" stroke="${iceHi}" stroke-width="3"/>
</g>
<g fill="${iceHi}">${nodes}</g>
<g ${anim('blink', 9, 2, 'ease-in-out')}>
<path d="${almond}" fill="${obsidian}"/>
<path d="${almond}" fill="none" stroke="${ice}" stroke-opacity="0.35" stroke-width="14"/>
<path d="${almond}" fill="none" stroke="${iceHi}" stroke-width="3.5"/>
<circle cx="${ex}" cy="${ey}" r="40" fill="url(#dbtefx-pp-iris)" style="transform-origin: ${ex}px ${ey}px; animation: dbtefx-pp-iris 4s ease-in-out infinite;"/>
<circle cx="${ex}" cy="${ey}" r="40" fill="none" stroke="${iceHi}" stroke-width="2.5"/>
<circle cx="${ex}" cy="${ey}" r="10" fill="${obsidian}"/>
</g>
${gem(t.accent2, 0, 0)}${gem(mix(t.text, t.muted, 0.3), -6, 1)}${gem(t.success, -12, 2)}
</g>
</g>
<!--near-->
${shards}`;
};

export default powerPatron;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 34, colors: ['accent', 'accent2', 'success', 'warning'], rise: true },
  { kind: 'star', count: 60, colors: ['text'] },
  { kind: 'flash', count: 1, colors: ['accent'] },
];
