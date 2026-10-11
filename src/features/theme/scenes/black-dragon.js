import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, rng, W } from './kit.js';

// Black Dragon: Red-Eyes on a volcanic crag, wings raised against a blood-red
// sky, one burning eye, an Inferno Fire Blast charging in its open jaws.

const pt = (p) => `${n1(p[0])} ${n1(p[1])}`;

// A tapered limb along a quadratic curve: neck, tail, legs, horns.
const taper = (a, c, b, w0, w1, steps = 10) => {
  const left = [];
  const right = [];
  for (let i = 0; i <= steps; i++) {
    const s = i / steps;
    const x = (1 - s) ** 2 * a[0] + 2 * (1 - s) * s * c[0] + s * s * b[0];
    const y = (1 - s) ** 2 * a[1] + 2 * (1 - s) * s * c[1] + s * s * b[1];
    const dx = 2 * (1 - s) * (c[0] - a[0]) + 2 * s * (b[0] - c[0]);
    const dy = 2 * (1 - s) * (c[1] - a[1]) + 2 * s * (b[1] - c[1]);
    const len = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * s) / 2;
    left.push([x - (dy / len) * w, y + (dx / len) * w]);
    right.push([x + (dy / len) * w, y - (dx / len) * w]);
  }
  return `M${left.map(pt).join('L')}L${right.reverse().map(pt).join('L')}Z`;
};

// A bat wing: arm bones to the wrist, finger bones fanning out, membrane scalloped between the tips.
const wing = (shoulder, elbow0, wrist0, tips0, attach, k = 1) => {
  const grow = (p) => [shoulder[0] + (p[0] - shoulder[0]) * k, shoulder[1] + (p[1] - shoulder[1]) * k];
  const elbow = grow(elbow0);
  const wrist = grow(wrist0);
  const tips = tips0.map(grow);
  let d = `M${pt(shoulder)}L${pt(elbow)}L${pt(wrist)}L${pt(tips[0])}`;
  for (let i = 1; i < tips.length; i++) {
    const [ax, ay] = tips[i - 1];
    const [bx, by] = tips[i];
    // Scallop: the control point is pulled from the edge's midpoint toward the wrist.
    d += `Q${pt([(ax + bx) / 2 + (wrist[0] - (ax + bx) / 2) * 0.3, (ay + by) / 2 + (wrist[1] - (ay + by) / 2) * 0.3])} ${pt(tips[i])}`;
  }
  const last = tips[tips.length - 1];
  d += `Q${pt([(last[0] + attach[0]) / 2 + (wrist[0] - last[0]) * 0.2, (last[1] + attach[1]) / 2 - 10])} ${pt(attach)}Z`;
  const arm = taper(shoulder, [(shoulder[0] + elbow[0]) / 2, (shoulder[1] + elbow[1]) / 2], elbow, 26, 18, 2) + taper(elbow, [(elbow[0] + wrist[0]) / 2, (elbow[1] + wrist[1]) / 2], wrist, 18, 12, 2);
  const fingers = tips.slice(1).map((p) => taper(wrist, [(wrist[0] + p[0]) / 2, (wrist[1] + p[1]) / 2], p, 9, 2, 2)).join('');
  const claw = taper(wrist, [wrist[0] + (tips[0][0] - wrist[0]) * 0.6, wrist[1] + (tips[0][1] - wrist[1]) * 0.4], tips[0], 12, 0, 4);
  return { d, bones: arm + fingers + claw };
};

const blackDragon = (t) => {
  const ink = mix(t.bg, '#000000', 0.55);
  const fire = mix(t.accent, t.warning, 0.45);
  const core = mix(t.warning, '#ffffff', 0.6);
  const rand = rng(89);

  const near = wing([1300, 424], [1366, 282], [1352, 112], [[1300, 44], [1420, 22], [1462, 128], [1464, 268], [1428, 400]], [1372, 488], 1.2);
  const far = wing([1268, 418], [1214, 288], [1188, 112], [[1222, 38], [1072, 48], [1008, 150], [986, 270], [1024, 380]], [1240, 446], 1.28);

  // Body, neck, head and limbs as overlapping silhouettes in one ink, so they merge.
  const body = [
    taper([1248, 424], [1300, 500], [1384, 592], 78, 54, 10),
    taper([1262, 460], [1200, 370], [1244, 260], 44, 22, 12),
  ].map((d) => `<path d="${d}"/>`).join('');
  // The head is drawn level, then reared back to roar at the sky.
  const head = [
    // Skull and upper jaw, ending in the hooked snout.
    'M1196 300L1166 278C1130 272 1090 284 1052 300L1010 318L996 338L1022 332L1068 330L1124 336L1180 344Z',
    // Lower jaw, hanging open.
    'M1170 340L1112 352L1052 380L1030 396L1066 396L1136 370L1186 356Z',
    taper([1180, 292], [1214, 252], [1272, 228], 18, 0, 6),
    taper([1186, 312], [1232, 300], [1282, 302], 14, 0, 6),
    taper([1126, 286], [1136, 262], [1150, 246], 10, 0, 4),
    taper([1150, 352], [1170, 372], [1196, 388], 10, 0, 4),
    'M1170 290L1206 300L1204 340L1176 352Z',
  ].map((d) => `<path d="${d}"/>`).join('');
  const limbs = [
    // Foreleg gripping the crag, hind leg, tail sweeping off to the right.
    taper([1270, 500], [1240, 576], [1224, 650], 24, 11, 6),
    taper([1366, 566], [1424, 606], [1368, 652], 38, 13, 6),
    taper([1384, 588], [1520, 760], [1660, 600], 28, 3, 16),
  ].map((d) => `<path d="${d}"/>`).join('');
  // Talons on the crag.
  const talons = [[1206, 650], [1222, 652], [1238, 650], [1350, 652], [1366, 654], [1382, 652]].map(([x, y]) => `<path d="M${x - 6} ${y - 4}L${x - 12} ${y + 14}L${x + 4} ${y}Z"/>`).join('');
  // Spines down the neck and back.
  let spines = '';
  // Neck spines point back (right), back spines up and back.
  [[1250, 289], [1244, 335], [1246, 378], [1256, 418]].forEach(([x, y], i) => {
    spines += `<path d="M${x - 4} ${y - 10}L${x + 20 + i * 3} ${y - 20}L${x - 4} ${y + 8}Z"/>`;
  });
  [[1299, 435], [1331, 474], [1363, 514], [1391, 550]].forEach(([x, y], i) => {
    spines += `<path d="M${x - 12} ${y - 4}L${x + 18 - i * 2} ${y - 26 + i * 3}L${x + 8} ${y + 12}Z"/>`;
  });
  // Teeth along both jaws, lit by the fire in the mouth.
  let teeth = '';
  for (let i = 0; i < 6; i++) {
    teeth += `<path d="M${1024 + i * 22} ${332 + i * 0.6}l5 13l5 -13Z"/><path d="M${1050 + i * 20} ${388 - i * 5.6}l5 -12l5 12Z"/>`;
  }

  // Heat rays thrown off by the charging fireball.
  let rays = '';
  for (let i = 0; i < 14; i++) {
    const a = (i * 360) / 14 + (i % 2) * 9;
    const len = i % 3 ? 160 : 260;
    const r1 = (a - 1.6) * (Math.PI / 180);
    const r2 = (a + 1.6) * (Math.PI / 180);
    rays += `<path d="M1040 364L${n1(1040 + len * Math.cos(r1))} ${n1(364 + len * Math.sin(r1))}L${n1(1040 + len * Math.cos(r2))} ${n1(364 + len * Math.sin(r2))}Z"/>`;
  }

  // Volcanic range on the horizon; the main cone erupts at left.
  const ridge = 'M0 724L140 700L250 716L330 616L366 600L404 602L436 616L530 706L660 690L780 720L920 698L1060 726L1600 740V900H0Z';
  const lava = ['M374 604Q366 650 380 690T360 760', 'M396 604Q410 640 402 680T426 740'];
  // Smoke strata banked across the sky: soft, lit from below.
  let smoke = '';
  for (let i = 0; i < 8; i++) {
    const x = n1(100 + rand() * 1400);
    const y = n1(80 + rand() * 440);
    smoke += `<ellipse cx="${x}" cy="${y}" rx="${n1(260 + rand() * 260)}" ry="${n1(28 + rand() * 30)}" fill="url(#dbtefx-rb-haze)" ${anim('drift', 26 + i * 5, i * 4, 'ease-in-out')}/>`;
  }
  // Glowing fissures in the crag under the dragon.
  const cracks = ['M1150 900L1176 830L1166 790L1196 744', 'M1470 900L1452 836L1474 794L1456 748', 'M1310 900L1318 846L1300 806L1312 760'];
  const crag = 'M1040 900L1100 800L1176 740L1236 668L1300 650L1420 656L1490 716L1600 760V900Z';

  return `<style>
@keyframes dbtefx-rb-wr { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(6deg); } }
@keyframes dbtefx-rb-wl { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-5deg); } }
@keyframes dbtefx-rb-breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
@keyframes dbtefx-rb-charge { 0%, 100% { transform: scale(0.8); opacity: 0.75; } 45% { transform: scale(1.1); opacity: 1; } 60% { transform: scale(0.98); opacity: 0.9; } }
@keyframes dbtefx-rb-smoke { 0% { transform: translate(0, 0) scale(0.5); opacity: 0; } 20% { opacity: 0.85; } 100% { transform: translate(140px, -460px) scale(2); opacity: 0; } }
</style>
<defs>${glow('dbtefx-rb-sun', t.accent, 0.5, 0.5, 0.5, 0.6)}${glow('dbtefx-rb-crater', fire, 0.5, 0.5, 0.5, 0.65)}${glow('dbtefx-rb-eye', t.accent, 0.5, 0.5, 0.5, 0.95)}${glow('dbtefx-rb-haze', ink, 0.5, 0.5, 0.5, 0.85)}${glow('dbtefx-rb-plume', ink, 0.5, 0.5, 0.5, 0.9)}<radialGradient id="dbtefx-rb-ray" cx="1040" cy="364" r="300" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${fire}" stop-opacity="0.2"/><stop offset="1" stop-color="${fire}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-rb-ball"><stop offset="0" stop-color="${core}"/><stop offset="0.25" stop-color="${fire}" stop-opacity="0.95"/><stop offset="0.6" stop-color="${t.accent}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-rb-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ink}"/><stop offset="0.5" stop-color="${mix(t.bg, t.accent, 0.12)}"/><stop offset="0.78" stop-color="${mix(t.bg, t.accent, 0.3)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent2, 0.22)}"/></linearGradient>
<path id="dbtefx-rb-wn" d="${near.d}"/><path id="dbtefx-rb-wf" d="${far.d}"/><g id="dbtefx-rb-body">${body}${limbs}${spines}${talons}</g><g id="dbtefx-rb-head">${head}</g></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-rb-sky)"/>
<circle cx="1250" cy="290" r="470" fill="url(#dbtefx-rb-sun)"/>
<circle cx="390" cy="600" r="220" fill="url(#dbtefx-rb-crater)" ${anim('pulse', 4, 0, 'ease-in-out')}/>
${smoke}
<g>${[0, 1, 2, 3].map((i) => `<ellipse cx="400" cy="560" rx="90" ry="70" fill="url(#dbtefx-rb-plume)" ${anim('rb-smoke', 14, i * 3.5)}/>`).join('')}</g>
<path d="${ridge}" fill="${ink}"/>
<g fill="none" stroke="${fire}" stroke-width="3.5" stroke-linecap="round" ${anim('pulse', 3, 0.5, 'ease-in-out')}>${lava.map((d) => `<path d="${d}"/>`).join('')}</g>
<!--mid-->
<g transform="translate(24 0)"><g style="animation: dbtefx-rb-breathe 5s ease-in-out infinite;">
<g style="transform-origin: 1268px 418px; animation: dbtefx-rb-wl 5s ease-in-out infinite;"><use href="#dbtefx-rb-wf" fill="${t.accent}" fill-opacity="0.45" transform="translate(2 5)"/><use href="#dbtefx-rb-wf" fill="${mix(ink, t.accent, 0.14)}"/><path d="${far.bones}" fill="${ink}"/></g>
<use href="#dbtefx-rb-body" fill="${t.accent}" fill-opacity="0.6" transform="translate(2 5)"/>
<use href="#dbtefx-rb-body" fill="${ink}"/>
<g transform="translate(60 -54) rotate(55 1190 310)">
<g transform="translate(-16 -12)"><g style="transform-origin: 1040px 364px; animation: dbtefx-spin 40s linear infinite;" fill="url(#dbtefx-rb-ray)">${rays}</g></g>
<g transform="translate(1190 310) scale(1.12 0.76) translate(-1190 -310)">
<use href="#dbtefx-rb-head" fill="${t.accent}" fill-opacity="0.6" transform="translate(4 3)"/>
<use href="#dbtefx-rb-head" fill="${ink}"/>
<g fill="${fire}" fill-opacity="0.85">${teeth}</g>
<circle cx="1124" cy="300" r="50" fill="url(#dbtefx-rb-eye)" ${anim('pulse', 2.6, 0, 'ease-in-out')}/>
<path d="M1106 302L1128 292L1144 298L1124 307Z" fill="${mix(t.accent, '#ffffff', 0.35)}"/>
</g>
<circle cx="1024" cy="352" r="110" fill="url(#dbtefx-rb-ball)" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-rb-charge 2.4s ease-in-out infinite;"/>
<circle cx="1024" cy="352" r="34" fill="url(#dbtefx-rb-ball)" ${anim('flicker', 0.9, 0)}/>
</g>
<g style="transform-origin: 1300px 424px; animation: dbtefx-rb-wr 5s ease-in-out infinite;"><use href="#dbtefx-rb-wn" fill="${t.accent}" fill-opacity="0.55" transform="translate(2 5)"/><use href="#dbtefx-rb-wn" fill="${mix(ink, t.accent, 0.1)}"/><path d="${near.bones}" fill="${ink}"/></g>
</g></g>
<!--near-->
<path d="${crag}" fill="${t.accent}" fill-opacity="0.55" transform="translate(0 -4)"/>
<path d="${crag}" fill="${ink}"/>
<g fill="none" stroke="${fire}" stroke-width="3" stroke-linecap="round" ${anim('pulse', 3.4, 1, 'ease-in-out')}>${cracks.map((d) => `<path d="${d}"/>`).join('')}</g>`;
};

export default blackDragon;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ember', count: 90, colors: ['accent', 'warning', 'accent2'] },
  { kind: 'ash', count: 40, colors: ['muted'] },
];
