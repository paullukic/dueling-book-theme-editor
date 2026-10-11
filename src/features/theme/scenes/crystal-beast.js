import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';

// Crystal Beasts: the Ancient City, Rainbow Ruins. Dusk over a ruined
// sandstone arena; seven broken columns stand in a ring on the right, each
// crowned with one of the seven Crystal Beast gems (ruby, amber, topaz,
// emerald, cobalt, sapphire, amethyst). Each gem throws a beam of its colour
// up into a rainbow arching over the sky. The gems wake one after another in
// a slow prismatic chase. No dragon, no ice: gems, sandstone and a rainbow.

const crystalBeast = (t) => {
  const rand = rng(77);
  const night = mix(t.bg, '#000000', 0.3);
  const stone = mix(t.warning, t.muted, 0.55);
  const stoneLit = mix(stone, '#ffffff', 0.3);
  const stoneDk = mix(stone, t.bg, 0.55);
  const stoneDeep = mix(stone, t.bg, 0.78);
  // Seven gems in rainbow order.
  const gems = [t.danger, mix(t.warning, t.danger, 0.45), t.warning, t.success, t.opp, t.link, t.accent];

  // ---- far: dusk sky, rainbow, mountains ----
  let stars = '';
  for (let i = 0; i < 80; i++) stars += `M${n1(rand() * 1600)} ${n1(rand() * 420)}h0`;
  const rcx = 900;
  const rcy = 980;
  let rainbow = '';
  gems.forEach((c, i) => {
    rainbow += `<circle cx="${rcx}" cy="${rcy}" r="${880 - i * 22}" fill="none" stroke="${c}" stroke-width="23"/>`;
  });
  let ridge = 'M0 900V640';
  for (let x = 0; x <= 1600; x += 40) ridge += `L${x} ${n1(640 - Math.sin(x / 210) * 40 - Math.sin(x / 77) * 14 - (x < 500 ? 30 : 0))}`;
  ridge += 'L1600 900Z';

  // ---- mid: the arena and the seven gem columns ----
  const fx = 1230;
  const fy = 720;
  const rx = 182;
  const ry = 66;
  // Arena tiers: curved stone bands behind the ring, broken on the left.
  let tiers = '';
  for (let k = 0; k < 5; k++) {
    const r1 = rx + 40 + k * 26;
    const ry1 = ry + 16 + k * 10;
    const y = fy - 30 - k * 22;
    tiers += `<path d="M${fx - r1} ${y}A${r1} ${ry1} 0 0 1 ${fx + r1} ${y}" fill="none" stroke="${k % 2 ? stoneDk : mix(stoneDk, stone, 0.3)}" stroke-width="20"/><path d="M${fx - r1} ${y}A${r1} ${ry1} 0 0 1 ${fx + r1} ${y}" fill="none" stroke="${stoneDeep}" stroke-width="20" stroke-dasharray="2 ${30 + k * 4}"/><path d="M${fx - r1} ${y - 9}A${r1} ${ry1} 0 0 1 ${fx + r1} ${y - 9}" fill="none" stroke="${stoneLit}" stroke-opacity="0.35" stroke-width="1.5"/>`;
  }

  // A gem: a brilliant cut seen from the side, crown facets lit, pavilion dark.
  const gem = (x, y, s, c, i) => {
    const w = 30 * s;
    const h1 = 14 * s;
    const h2 = 30 * s;
    const lit = mix(c, '#ffffff', 0.55);
    const dk = mix(c, '#000000', 0.45);
    const crown = `M${n1(x - w)} ${y}L${n1(x - w * 0.55)} ${n1(y - h1)}H${n1(x + w * 0.55)}L${n1(x + w)} ${y}Z`;
    const table = `M${n1(x - w * 0.55)} ${n1(y - h1)}L${n1(x - w * 0.2)} ${y}H${n1(x + w * 0.2)}L${n1(x + w * 0.55)} ${n1(y - h1)}Z`;
    const pav = `M${n1(x - w)} ${y}L${x} ${n1(y + h2)}L${n1(x + w)} ${y}Z`;
    const pavLit = `M${n1(x - w)} ${y}L${x} ${n1(y + h2)}L${n1(x - w * 0.2)} ${y}Z`;
    const pavMid = `M${n1(x - w * 0.2)} ${y}L${x} ${n1(y + h2)}L${n1(x + w * 0.2)} ${y}Z`;
    const delay = n1(-((6 - i) / 7) * 7);
    return `<ellipse cx="${x}" cy="${n1(y + 2)}" rx="${n1(w * 2.6)}" ry="${n1(w * 2.6)}" fill="url(#dbtefx-cb-glow${i})" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-cb-wake 7s ease-in-out ${delay}s infinite;"/>
<path d="${pav}" fill="${dk}"/><path d="${pavLit}" fill="${c}"/><path d="${pavMid}" fill="${mix(c, '#000000', 0.2)}"/>
<path d="${crown}" fill="${c}"/><path d="${table}" fill="${lit}"/>
<path d="${crown}${pav}" fill="none" stroke="${mix(c, '#ffffff', 0.7)}" stroke-opacity="0.75" stroke-width="1.2" stroke-linejoin="round"/>
<path d="M${n1(x - w * 0.45)} ${n1(y - h1 * 0.6)}L${n1(x - w * 0.25)} ${n1(y - h1 * 0.15)}" stroke="#ffffff" stroke-width="${n1(2 * s)}" stroke-linecap="round"/>
<path d="M${n1(x - w * 0.15)} ${n1(y - h1 - 10 * s)}L${n1(x - w * 0.1)} ${n1(y - h1 - 3 * s)}L${n1(x - w * 0.15)} ${n1(y - h1 + 4 * s)}L${n1(x - w * 0.2)} ${n1(y - h1 - 3 * s)}Z" fill="#ffffff" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-cb-glint 7s ease-in-out ${delay}s infinite;"/>`;
  };

  // A sandstone column: base, fluted shaft lit from the left, capital, an
  // optional broken top; the gem rests in a gold setting on the capital.
  const column = (x, by, s, broken) => {
    const hw = 20 * s;
    const top = by - (broken ? 210 : 250) * s;
    const flutes = [-0.6, -0.2, 0.2, 0.6].map((f) => `M${n1(x + f * hw)} ${n1(by - 12 * s)}V${n1(top + 16 * s)}`).join('');
    const shaft = broken
      ? `M${n1(x - hw)} ${by}V${n1(top + 10 * s)}L${n1(x - hw * 0.3)} ${n1(top)}L${n1(x + hw * 0.2)} ${n1(top + 12 * s)}L${n1(x + hw)} ${n1(top + 4 * s)}V${by}Z`
      : `M${n1(x - hw)} ${by}V${n1(top + 14 * s)}H${n1(x + hw)}V${by}Z`;
    const cap = `M${n1(x - hw * 1.45)} ${n1(top + 14 * s)}H${n1(x + hw * 1.45)}V${n1(top)}H${n1(x - hw * 1.45)}Z`;
    const plinth = `M${n1(x - hw * 1.5)} ${by}H${n1(x + hw * 1.5)}V${n1(by - 14 * s)}H${n1(x - hw * 1.5)}Z`;
    return {
      top: broken ? top : top - 2 * s,
      d: `<path d="${shaft}" fill="url(#dbtefx-cb-col)"/><path d="M${n1(x - hw * 0.1)} ${n1(top + 40 * s)}l${n1(5 * s)} ${n1(18 * s)}l${n1(-7 * s)} ${n1(16 * s)}l${n1(4 * s)} ${n1(22 * s)}M${n1(x + hw)} ${n1(by - 90 * s)}l${n1(-6 * s)} ${n1(4 * s)}l${n1(6 * s)} ${n1(6 * s)}M${n1(x - hw)} ${n1(by - 150 * s)}l${n1(5 * s)} ${n1(3 * s)}l${n1(-5 * s)} ${n1(5 * s)}" fill="none" stroke="${stoneDeep}" stroke-opacity="0.7" stroke-width="${n1(1.4 * s)}"/><path d="${flutes}" stroke="${stoneDeep}" stroke-opacity="0.45" stroke-width="${n1(2.2 * s)}"/>${broken ? '' : `<path d="${cap}" fill="${stoneLit}"/><path d="M${n1(x - hw * 1.45)} ${n1(top + 14 * s)}H${n1(x + hw * 1.45)}" stroke="${stoneDeep}" stroke-width="${n1(2 * s)}"/>`}<path d="${plinth}" fill="${stoneDk}"/>`,
    };
  };

  // Ring of seven: back columns first (smaller, higher), front ones last.
  const angles = [160, 196, 232, 268, 304, 340, 16];
  const spots = angles.map((a, i) => {
    const [x, y] = polar(fx, fy, 1, a);
    const px = fx + (x - fx) * rx;
    const py = fy + (y - fy) * ry;
    const depth = (Math.sin((a * Math.PI) / 180) + 1) / 2;
    return { i, x: n1(px), y: n1(py), s: 0.72 + depth * 0.4, broken: i === 1 || i === 4 };
  });
  const [px0, py0] = [fx, 290];
  const ordered = spots.slice().sort((a, b) => a.y - b.y);
  let columns = '';
  let beams = '';
  ordered.forEach(({ i, x, y, s, broken }) => {
    const col = column(x, y, s, broken);
    const gy = n1(col.top - 36 * s);
    const settingW = 24 * s;
    columns += `${col.d}<path d="M${n1(x - settingW)} ${n1(col.top)}L${n1(x - settingW * 0.6)} ${n1(gy + 6 * s)}H${n1(x + settingW * 0.6)}L${n1(x + settingW)} ${n1(col.top)}Z" fill="url(#dbtefx-cb-gold)" stroke="${mix(t.accent2, '#000000', 0.45)}" stroke-width="1"/>${gem(x, gy, s * 1.4, gems[i], i)}`;
    const delay = n1(-((6 - i) / 7) * 7);
    beams += `<path d="M${n1(x - 8 * s)} ${n1(gy - 8)}L${n1(px0 - 4)} ${py0}H${n1(px0 + 4)}L${n1(x + 8 * s)} ${n1(gy - 8)}Z" fill="url(#dbtefx-cb-beam${i})" style="animation: dbtefx-cb-beam 7s ease-in-out ${delay}s infinite;"/>`;
  });

  const glows = gems.map((c, i) => `<radialGradient id="dbtefx-cb-glow${i}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(c, '#ffffff', 0.4)}" stop-opacity="0.75"/><stop offset="0.35" stop-color="${c}" stop-opacity="0.3"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient><linearGradient id="dbtefx-cb-beam${i}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${c}" stop-opacity="0.6"/><stop offset="0.7" stop-color="${c}" stop-opacity="0.3"/><stop offset="1" stop-color="${mix(c, '#ffffff', 0.5)}" stop-opacity="0.7"/></linearGradient>`).join('');

  // The crystal the seven beams meet in: a great clear brilliant seen from the
  // side, crown and pavilion facets in shades of light, rainbow fire in a few.
  const W2 = 78;
  const pts = { tl: [-W2 * 0.55, -40], tr: [W2 * 0.55, -40], l: [-W2, 0], r: [W2, 0], c: [0, 92] };
  const P2 = (p) => `${n1(px0 + p[0])} ${n1(py0 + p[1])}`;
  const girdle = [-1, -0.6, -0.2, 0.2, 0.6, 1].map((f) => [W2 * f, 0]);
  const crownTop = [-0.55, -0.2, 0.2, 0.55].map((f) => [W2 * f, -40]);
  const shades = ['#ffffff', mix(t.accent, '#ffffff', 0.7), mix(t.accent, '#ffffff', 0.45), mix(t.link, '#ffffff', 0.6), mix(t.accent, '#ffffff', 0.3)];
  let crystal = '';
  for (let i = 0; i < 5; i++) crystal += `<path d="M${P2(girdle[i])}L${P2(girdle[i + 1])}L${P2(pts.c)}Z" fill="${shades[(i * 2) % 5]}" fill-opacity="${n1(0.55 + (i % 2) * 0.25)}"/>`;
  crystal += `<path d="M${P2(pts.l)}L${P2(crownTop[0])}L${P2(girdle[1])}ZM${P2(crownTop[0])}L${P2(crownTop[1])}L${P2(girdle[1])}ZM${P2(crownTop[2])}L${P2(crownTop[3])}L${P2(girdle[4])}Z" fill="${mix(t.accent, '#ffffff', 0.55)}" fill-opacity="0.85"/>`;
  crystal += `<path d="M${P2(crownTop[1])}L${P2(crownTop[2])}L${P2(girdle[3])}L${P2(girdle[2])}Z" fill="#ffffff" fill-opacity="0.7"/>`;
  crystal += `<path d="M${P2(crownTop[1])}L${P2(girdle[2])}L${P2(girdle[1])}ZM${P2(crownTop[2])}L${P2(girdle[3])}L${P2(girdle[4])}ZM${P2(crownTop[3])}L${P2(pts.r)}L${P2(girdle[4])}Z" fill="${mix(t.accent, t.bg, 0.15)}" fill-opacity="0.7"/>`;
  crystal += `<path d="M${P2(girdle[1])}L${P2([W2 * -0.4, 0])}L${P2(pts.c)}Z" fill="${t.danger}" fill-opacity="0.45"/><path d="M${P2(girdle[3])}L${P2([W2 * 0.4, 0])}L${P2(pts.c)}Z" fill="${t.success}" fill-opacity="0.4"/><path d="M${P2([W2 * 0.4, 0])}L${P2(girdle[4])}L${P2(pts.c)}Z" fill="${t.opp}" fill-opacity="0.4"/>`;
  const outline = `M${P2(pts.l)}L${P2(pts.tl)}L${P2(pts.tr)}L${P2(pts.r)}L${P2(pts.c)}Z`;
  const prism = `<circle cx="${px0}" cy="${py0 + 20}" r="240" fill="url(#dbtefx-cb-halo)" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-cb-wake 7s ease-in-out -1s infinite;"/>
${crystal}<path d="${outline}M${P2(pts.l)}L${P2(pts.r)}" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="2" stroke-linejoin="round"/>
<path d="M${P2([-W2 * 0.45, -34])}L${P2([-W2 * 0.25, -34])}" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
<path d="M${n1(px0 + 30)} ${n1(py0 - 70)}L${n1(px0 + 34)} ${n1(py0 - 54)}L${n1(px0 + 50)} ${n1(py0 - 50)}L${n1(px0 + 34)} ${n1(py0 - 46)}L${n1(px0 + 30)} ${n1(py0 - 30)}L${n1(px0 + 26)} ${n1(py0 - 46)}L${n1(px0 + 10)} ${n1(py0 - 50)}L${n1(px0 + 26)} ${n1(py0 - 54)}Z" fill="#ffffff" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-cb-glint 3.5s ease-in-out infinite;"/>`;

  // Broken arena wall on the far right and rubble on the arena floor.
  const wall = `M1420 900V430L1446 412L1462 440L1490 404L1530 420L1600 380V900Z`;
  let blocks = '';
  for (let i = 0; i < 9; i++) {
    const x = 1060 + rand() * 360;
    const y = 770 + rand() * 70;
    const w = 18 + rand() * 30;
    blocks += `M${n1(x)} ${n1(y)}l${n1(w)} -4l4 ${n1(w * 0.45)}l${n1(-w)} 4Z`;
  }

  return `<style>
@keyframes dbtefx-cb-wake { 0%, 100% { opacity: 0.45; transform: scale(0.85); } 14% { opacity: 1; transform: scale(1.12); } 40% { opacity: 0.6; transform: scale(0.95); } }
@keyframes dbtefx-cb-glint { 0%, 100% { opacity: 0; transform: scale(0.3); } 12% { opacity: 1; transform: scale(1.3); } 26% { opacity: 0; transform: scale(0.5); } }
@keyframes dbtefx-cb-beam { 0%, 100% { opacity: 0.35; } 14% { opacity: 1; } 45% { opacity: 0.45; } }
@keyframes dbtefx-cb-shimmer { 0%, 100% { opacity: 0.22; } 50% { opacity: 0.38; } }
</style>
<defs>
<linearGradient id="dbtefx-cb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}"/><stop offset="0.5" stop-color="${mix(t.bg, t.accent, 0.16)}"/><stop offset="0.75" stop-color="${mix(t.bg, t.danger, 0.2)}"/><stop offset="1" stop-color="${mix(t.bg, t.warning, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-cb-col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${stoneLit}"/><stop offset="0.45" stop-color="${stone}"/><stop offset="1" stop-color="${stoneDk}"/></linearGradient>
<linearGradient id="dbtefx-cb-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent2, '#ffffff', 0.4)}"/><stop offset="1" stop-color="${mix(t.accent2, '#000000', 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-cb-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/><stop offset="0.3" stop-color="${t.accent}" stop-opacity="0.25"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-cb-arena" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.3)}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-cb-fade" cx="1250" cy="560" r="1100" gradientUnits="userSpaceOnUse"><stop offset="0.2" stop-color="#ffffff"/><stop offset="0.75" stop-color="#ffffff" stop-opacity="0.2"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<mask id="dbtefx-cb-bowmask"><rect width="1600" height="900" fill="url(#dbtefx-cb-fade)"/></mask>
${glows}
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-cb-sky)"/>
<path d="${stars}" stroke="${t.text}" stroke-opacity="0.55" stroke-width="1.8" stroke-linecap="round"/>
<g mask="url(#dbtefx-cb-bowmask)"><g style="animation: dbtefx-cb-shimmer 9s ease-in-out infinite;">${rainbow}</g></g>
<path d="${ridge}" fill="${mix(night, t.accent, 0.12)}"/>
<path d="M180 900V600h30v300ZM228 900V640l12-10 14 14v256ZM300 900V690h24v210Z" fill="${mix(stoneDeep, night, 0.4)}"/>
<!--mid-->
${beams}
${prism}
<ellipse cx="${fx}" cy="${fy}" rx="420" ry="190" fill="url(#dbtefx-cb-arena)"/>
${tiers}
<path d="${wall}" fill="${stoneDeep}"/>
<path d="M1420 430L1446 412L1462 440L1490 404L1530 420L1600 380" fill="none" stroke="${stoneDk}" stroke-width="3"/>
<ellipse cx="${fx}" cy="${fy + 6}" rx="${rx + 20}" ry="${ry + 10}" fill="${stoneDeep}"/>
<ellipse cx="${fx}" cy="${fy}" rx="${rx}" ry="${ry}" fill="${mix(stoneDk, t.accent, 0.12)}"/>
<ellipse cx="${fx}" cy="${fy}" rx="${n1(rx * 0.45)}" ry="${n1(ry * 0.45)}" fill="none" stroke="${t.accent2}" stroke-opacity="0.35" stroke-width="2"/>
${columns}
<path d="${blocks}" fill="${stoneDk}" stroke="${stoneDeep}" stroke-width="1"/>
<!--near-->
<path d="M0 900V820Q300 780 620 830T1100 860Q1350 840 1600 870V900Z" fill="${night}"/>`;
};

export default crystalBeast;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 40, colors: ['danger', 'warning', 'success', 'opp', 'link', 'accent'], rise: true, speed: 0.5 },
  { kind: 'star', count: 50, colors: ['text'] },
];
