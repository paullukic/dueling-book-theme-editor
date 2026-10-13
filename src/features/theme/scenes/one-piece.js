import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// One Piece: dusk on the Grand Line. Oda's towering cumulus stacks, a low
// sun on the horizon and, far off at the right edge (clear of the menu feed
// and the duel's avatar column), a pirate caravel running before the wind,
// backlit, a straw hat painted on its main sail. The shader draws the open sea.
const HORIZON = 560;
const SUN = [1236, 548];

const onePiece = (t) => {
  const dusk = mix(t.bg, t.opp, 0.32);
  const warm = mix(t.accent, t.accent2, 0.35);
  const rim = mix(t.accent, '#ffffff', 0.35);
  const cloudBody = mix(mix(t.bg, t.opp, 0.4), t.accent2, 0.14);
  const ink = mix(t.bg, '#000000', 0.45);
  const timber = mix(mix(t.accent, t.accent2, 0.35), t.bg, 0.72);
  const canvas = mix(t.text, t.accent, 0.35);

  // A sunset cloud bank: many soft, wide lobes laid back to front, dark
  // and cool on top, lit gold and rose from beneath by the low sun, each
  // lobe given a bright underside lip.
  const bank = (x0, x1, top, bottom, seed) => {
    const r = rng(seed);
    let body = '';
    let lips = '';
    const rows = 7;
    for (let row = 0; row < rows; row++) {
      const k = row / (rows - 1);
      const y = top + k * (bottom - top);
      const inset = (1 - Math.sin(k * Math.PI * 0.5 + 0.35)) * (x1 - x0) * 0.35;
      for (let x = x0 + inset + r() * 30; x < x1 - inset * 0.3; x += 70 + r() * 70) {
        const rx = 70 + r() * 90;
        const ry = 20 + r() * 18 + (1 - k) * 10;
        const fill = mix(mix(cloudBody, t.bg, 0.25), mix(rim, t.accent2, 0.35), Math.pow(k, 1.4) * 0.85);
        body += `<ellipse cx="${n1(x)}" cy="${n1(y)}" rx="${n1(rx)}" ry="${n1(ry)}" fill="${fill}" fill-opacity="${n1(0.75 + k * 0.2)}"/>`;
        if (k > 0.55 && r() < 0.6) lips += `<path d="M${n1(x - rx * 0.45)} ${n1(y + ry * 0.8)}Q${n1(x)} ${n1(y + ry * 1.02)} ${n1(x + rx * 0.45)} ${n1(y + ry * 0.8)}" stroke-opacity="${n1(0.1 + k * 0.35)}"/>`;
      }
    }
    return `${body}<g fill="none" stroke="${rim}" stroke-width="2" stroke-linecap="round">${lips}</g>`;
  };

  // Gulls: a soft M, flapping slowly.
  const gull = (x, y, s, d) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><g style="animation: dbtefx-op-flap ${n1(1.6 + d * 0.3)}s ease-in-out ${-d}s infinite; transform-origin: 0 0;"><path d="M-16 -2Q-8 -10 0 0Q8 -10 16 -2Q8 -6 0 3Q-8 -6 -16 -2Z" fill="${ink}"/></g></g>`;

  // The straw hat: a low rounded crown, a red band and a wide, slightly
  // drooping brim, straw-gold with an inked edge like a painted emblem.
  const hat = (cx, cy, s, fill, band, edge) => `<g transform="translate(${cx} ${cy}) scale(${s})" stroke="${edge}" stroke-width="${n1(3 / s)}" stroke-linejoin="round">
<path d="M-62 8C-50 -2 -30 -4 0 -4C30 -4 50 -2 62 8C46 18 24 20 0 20C-24 20 -46 18 -62 8Z" fill="${fill}"/>
<path d="M-30 2C-32 -20 -18 -32 0 -32C18 -32 32 -20 30 2C12 6 -12 6 -30 2Z" fill="${fill}"/>
<path d="M-31 -8C-12 -4 12 -4 31 -8L30.5 1C12 5 -12 5 -30.5 1Z" fill="${band}"/>
<path d="M-50 10C-30 15 30 15 50 10" fill="none" stroke-opacity="0.35" stroke-width="${n1(1.5 / s)}"/>
</g>`;

  // Hull: bow to the left, a raised stern castle, rim-lit along the top.
  const hull = 'M1046 592Q1120 614 1200 616Q1290 614 1328 602L1332 566L1426 560L1420 612Q1412 642 1392 664L1104 666Q1068 642 1046 592Z';
  const rimLine = 'M1046 592Q1120 614 1200 616Q1290 614 1328 602L1332 566L1426 560';
  let planks = '';
  for (let i = 1; i < 4; i++) planks += `M${1060 + i * 12} ${600 + i * 15}Q${1200} ${622 + i * 13} ${1414 - i * 4} ${606 + i * 14}`;
  let rail = '';
  for (let x = 1070; x < 1324; x += 18) rail += `M${x} ${n1(596 + Math.sin((x - 1046) / 90) * 4 + (x - 1046) * 0.06)}v-14`;

  // Figurehead: a sun disc in a pointed, mane-like ray crown.
  let mane = '';
  for (let i = 0; i < 14; i++) {
    const [ax, ay] = polar(1036, 586, 10, i * (360 / 14) - 9);
    const [bx, by] = polar(1036, 586, 21, i * (360 / 14));
    const [cx2, cy2] = polar(1036, 586, 10, i * (360 / 14) + 9);
    mane += `M${ax} ${ay}L${bx} ${by}L${cx2} ${cy2}`;
  }

  // Sails bellied toward the bow; the sun shines through the canvas.
  const sail = (x0, x1, y0, y1, belly) =>
    `M${x0} ${y0}H${x1}Q${x1 - belly * 0.5} ${(y0 + y1) / 2} ${x1 + 6} ${y1}Q${(x0 + x1) / 2 - belly} ${y1 + 22} ${x0 - 6} ${y1}Q${x0 - belly} ${(y0 + y1) / 2} ${x0} ${y0}Z`;

  // Glitter on the sun's path: dashes that wink in turn (shown with or without the shader).
  const gr = rng(17);
  let glitter = '';
  for (let i = 0; i < 16; i++) {
    const d = i / 15;
    const y = HORIZON + 8 + d * d * 300;
    const x = SUN[0] + (gr() - 0.5) * (40 + d * 260);
    glitter += `<ellipse cx="${n1(x)}" cy="${n1(y)}" rx="${n1(4 + d * 18)}" ry="${n1(0.8 + d * 1.2)}" fill="${rim}" ${anim('pulse', n1(1.8 + gr() * 2.4), gr() * 4, 'ease-in-out')}/>`;
  }

  // Wave crests on the open sea: short broken arcs, larger and wider apart
  // toward the viewer.
  const wr = rng(23);
  let swell = '';
  for (let i = 0; i < 70; i++) {
    const d = Math.pow(wr(), 1.6);
    const y = HORIZON + 6 + d * 300;
    const x = wr() * W;
    const len = 14 + d * 90;
    swell += `<path d="M${n1(x)} ${n1(y)}q${n1(len / 2)} ${n1(-2 - d * 6)} ${n1(len)} 0" stroke-opacity="${n1(0.12 + d * 0.22)}" stroke-width="${n1(1 + d * 2.2)}"/>`;
  }

  // Long stratus streaks low over the horizon, fading at both ends.
  const sr = rng(41);
  let stratus = '';
  for (let i = 0; i < 6; i++) {
    const y = 420 + i * 22 + sr() * 12;
    const x = 1000 + sr() * 500;
    const w = 160 + sr() * 260;
    const hh = 6 + sr() * 8;
    stratus += `<path d="M${n1(x - w)} ${n1(y)}Q${n1(x)} ${n1(y - hh * 2)} ${n1(x + w)} ${n1(y)}Q${n1(x)} ${n1(y + hh * 0.6)} ${n1(x - w)} ${n1(y)}Z" fill="url(#dbtefx-op-strat)" fill-opacity="${n1(0.5 + i * 0.08)}"/>`;
  }

  return `<style>@keyframes dbtefx-op-rock { 0%, 100% { transform: rotate(-1.6deg) translateY(0); } 50% { transform: rotate(1.4deg) translateY(5px); } }
@keyframes dbtefx-op-flag { 0%, 100% { transform: skewY(-4deg) scaleX(1); } 50% { transform: skewY(5deg) scaleX(0.9); } }
@keyframes dbtefx-op-flap { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(-0.4); } }
@keyframes dbtefx-op-glide { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-60px, 14px); } }
@keyframes dbtefx-op-cloud { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-30px); } }
@keyframes dbtefx-op-swell { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-40px, 6px); } }</style>
<defs>
<linearGradient id="dbtefx-op-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.2)}" stop-opacity="0.85"/><stop offset="0.45" stop-color="${dusk}" stop-opacity="0.55"/><stop offset="0.62" stop-color="${warm}" stop-opacity="0.38"/><stop offset="0.625" stop-color="${warm}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-op-sunglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${rim}" stop-opacity="0.75"/><stop offset="0.25" stop-color="${t.accent}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-op-sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="${mix(t.accent, '#ffffff', 0.55)}"/><stop offset="1" stop-color="${t.accent}"/></radialGradient>
<linearGradient id="dbtefx-op-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(cloudBody, t.text, 0.12)}"/><stop offset="1" stop-color="${mix(cloudBody, t.accent2, 0.25)}"/></linearGradient>
<linearGradient id="dbtefx-op-canvas" x1="0" y1="0" x2="0.2" y2="1"><stop offset="0" stop-color="${mix(canvas, dusk, 0.5)}"/><stop offset="0.6" stop-color="${mix(canvas, t.accent2, 0.15)}"/><stop offset="1" stop-color="${mix(canvas, '#ffffff', 0.35)}"/></linearGradient>
<linearGradient id="dbtefx-op-hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${timber}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-op-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(warm, dusk, 0.5)}" stop-opacity="0.35"/><stop offset="0.3" stop-color="${dusk}" stop-opacity="0.25"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0.2"/></linearGradient>
<linearGradient id="dbtefx-op-foam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.opp, 0.22)}"/><stop offset="1" stop-color="${t.bg}"/></linearGradient>
<linearGradient id="dbtefx-op-strat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(cloudBody, t.accent2, 0.4)}" stop-opacity="0"/><stop offset="0.5" stop-color="${mix(cloudBody, t.accent2, 0.4)}"/><stop offset="1" stop-color="${mix(cloudBody, t.accent2, 0.4)}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-op-sky)"/>
<rect y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#dbtefx-op-sea)"/>
<ellipse cx="${SUN[0]}" cy="${SUN[1]}" rx="520" ry="300" fill="url(#dbtefx-op-sunglow)" ${anim('pulse', 10, 0, 'ease-in-out')}/>
<g style="animation: dbtefx-op-cloud 70s ease-in-out infinite;">${bank(1040, 1700, 120, 470, 3)}</g>
<g style="animation: dbtefx-op-cloud 90s ease-in-out -30s infinite;">${stratus}</g>
<circle class="dbtefx-op-sun" cx="${SUN[0]}" cy="${SUN[1]}" r="34" fill="url(#dbtefx-op-sun)"/>
<rect x="0" y="${HORIZON - 1}" width="${W}" height="3" fill="${rim}" fill-opacity="0.35"/>
<!--mid-->
<g fill="none" stroke="${mix(t.text, t.opp, 0.4)}" stroke-linecap="round">${swell}</g>
<g class="dbtefx-op-sun">${glitter}</g>
<g style="animation: dbtefx-op-glide 40s ease-in-out infinite;">${gull(1470, 96, 0.9, 0)}${gull(1500, 126, 0.7, 0.6)}${gull(1440, 140, 0.55, 1.1)}</g>
<g transform="translate(1205 465) scale(0.19)">
<g style="transform-origin: 1236px 660px; animation: dbtefx-op-rock 11s ease-in-out infinite;">
<path d="M1150 610V244M1276 604V132" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
<path d="M1150 610V244M1276 604V132" stroke="${rim}" stroke-opacity="0.45" stroke-width="1.6" transform="translate(3 0)"/>
<g fill="none" stroke="${ink}" stroke-opacity="0.85" stroke-width="1.6"><path d="M1276 134L1046 592M1276 134L1420 560M1150 246L966 562M1276 200L1150 248M1150 246L1046 592"/><path d="M1276 260L1384 562M1276 330L1398 562M1150 300L1086 596" stroke-opacity="0.5"/></g>
<path d="M1050 594L960 560" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>
<path d="${sail(1172, 1380, 204, 444, 34)}" fill="url(#dbtefx-op-canvas)"/>
<path d="${sail(1080, 1222, 294, 402, 22)}" fill="url(#dbtefx-op-canvas)"/>
<path d="M1150 400L1006 552Q1080 520 1146 520Z" fill="url(#dbtefx-op-canvas)" opacity="0.92"/>
<g fill="none" stroke="${mix(canvas, t.accent2, 0.5)}" stroke-opacity="0.5" stroke-width="1.2"><path d="M1240 206Q1226 320 1236 448M1312 206Q1300 320 1310 450"/><path d="M1126 296Q1116 350 1124 404M1176 296Q1168 350 1174 404"/></g>
${hat(1270, 330, 1.2, t.accent, t.accent2, ink)}
<path d="M1164 200H1392M1074 290H1228M1160 446H1392M1072 402H1230" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
<g style="transform-origin: 1276px 140px; animation: dbtefx-op-flag 3.4s ease-in-out infinite;"><path d="M1276 112Q1230 116 1172 132Q1230 140 1276 150Z" fill="${ink}"/><path d="M1276 114Q1232 118 1182 132" fill="none" stroke="${rim}" stroke-opacity="0.35" stroke-width="1.2"/></g>
<path d="${hull}" fill="url(#dbtefx-op-hull)"/>
<path d="${planks}" fill="none" stroke="${mix(timber, t.bg, 0.4)}" stroke-width="1.6"/>
<path d="${rail}" stroke="${ink}" stroke-width="2.4"/>
<path d="${rimLine}" fill="none" stroke="${rim}" stroke-width="2.4" stroke-linejoin="round"/>
<path d="${mane}Z" fill="${mix(t.accent, timber, 0.35)}" stroke="${ink}" stroke-width="1.2" stroke-linejoin="round"/><circle cx="1036" cy="586" r="10" fill="${mix(t.accent, timber, 0.15)}" stroke="${ink}" stroke-width="1.5"/><circle cx="1033" cy="583" r="3.5" fill="${rim}" fill-opacity="0.7"/>
<g fill="${ink}"><circle cx="1350" cy="584" r="5"/><circle cx="1378" cy="582" r="5"/><circle cx="1404" cy="580" r="5"/></g>
<circle cx="1428" cy="548" r="14" fill="${t.accent}" fill-opacity="0.35" ${anim('pulse', 3.2, 0, 'ease-in-out')}/><rect x="1424" y="542" width="8" height="12" rx="2" fill="${rim}"/>
</g>
<path d="M1088 664Q1060 650 1030 664Q1070 672 1110 668ZM1380 664Q1440 660 1520 672Q1440 676 1390 670Z" fill="${mix(t.text, t.opp, 0.2)}" fill-opacity="0.75" ${anim('pulse', 2.6, 0, 'ease-in-out')}/>
<path d="M1050 668H1430" stroke="${mix(t.text, t.opp, 0.3)}" stroke-opacity="0.55" stroke-width="3" stroke-linecap="round"/>
</g>
<!--near-->
<g style="animation: dbtefx-op-swell 14s ease-in-out infinite;">
<path d="M-60 900V846Q40 818 150 832Q230 842 300 826Q420 800 540 836Q640 858 760 840Q900 812 1020 838Q1120 856 1240 830Q1380 800 1500 826Q1600 846 1660 836V900Z" fill="url(#dbtefx-op-foam)"/>
<path d="M150 832Q230 842 300 826Q420 800 540 836M1020 838Q1120 856 1240 830Q1380 800 1500 826" fill="none" stroke="${mix(t.text, t.opp, 0.3)}" stroke-opacity="0.35" stroke-width="5" stroke-linecap="round"/>
<path d="M300 826Q420 800 500 822M1240 830Q1380 800 1460 820" fill="none" stroke="${rim}" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round"/>
</g>`;
};

export default onePiece;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 40, colors: ['text'] }, { kind: 'mote', count: 16, colors: ['accent'], speed: 0.6 }];

// WebGL layer (shader.js): the open sea at dusk in the scene's own frame
// (the same 1600x900 slice as the SVG): a perspective swell, the sky's warm
// reflection near the horizon and the sun's glittering path.
export const shader = {
  uniforms: ['bg', 'accent', 'accent2', 'opp', 'text'],
  frag: `
void main() {
  float s = max(u_res.x / 1600.0, u_res.y / 900.0);
  vec2 vb = (gl_FragCoord.xy - 0.5 * u_res) / s;
  vb = vec2(vb.x + 800.0, 450.0 - vb.y);
  float t = u_time;
  vec3 dusk = mix(u_bg, u_opp, 0.32);
  vec3 warm = mix(u_accent, u_accent2, 0.35);
  vec3 col;
  if (vb.y < ${HORIZON}.0) {
    float k = clamp(vb.y / ${HORIZON}.0, 0.0, 1.0);
    col = mix(u_bg * 0.8, dusk, smoothstep(0.0, 0.7, k));
    col = mix(col, warm * 0.8, smoothstep(0.6, 1.0, k) * 0.7);
    float sun = exp(-length((vb - vec2(${SUN[0]}.0, ${SUN[1]}.0)) * vec2(0.0035, 0.008)));
    col += warm * sun * 0.35;
  } else {
    float d = (vb.y - ${HORIZON}.0) / ${H - HORIZON}.0;
    float z = 1.0 / (d + 0.04);
    vec2 w = vec2((vb.x - 800.0) * 0.0045 * z * 0.1, z * 0.6);
    vec2 m = vec2(w.x * 1.2 + t * 0.04, w.y - t * 0.3);
    float h = fbm(m) * 0.6 + noise(vec2(w.x * 4.0 - t * 0.15, w.y * 2.6 - t * 0.8)) * 0.4;
    float h2 = fbm(m + vec2(0.0, 0.08)) * 0.6 + noise(vec2(w.x * 4.0 - t * 0.15, (w.y + 0.08) * 2.6 - t * 0.8)) * 0.4;
    float slope = clamp((h - h2) * 6.0, -1.0, 1.0);
    vec3 deep = mix(u_bg, u_opp, 0.22) * 0.9;
    vec3 refl = mix(dusk, warm * 0.85, 0.6);
    float fres = pow(1.0 - d, 5.0);
    col = mix(deep, refl, clamp(fres * 0.9 + slope * 0.35 * (1.0 - d * 0.5), 0.0, 1.0));
    col += mix(u_opp, u_text, 0.5) * smoothstep(0.2, 0.9, -slope) * 0.07 * (0.3 + d);
    float path = exp(-pow((vb.x - ${SUN[0]}.0) / (20.0 + 320.0 * d), 2.0));
    float spark = smoothstep(0.25, 0.85, slope + 0.3 * path);
    col += mix(u_accent, vec3(1.0), 0.45) * spark * path * (1.4 - d * 0.7);
    col = mix(col, u_bg, smoothstep(0.6, 1.0, d) * 0.4);
  }
  vec2 uv = gl_FragCoord.xy / u_res;
  col *= 1.0 - 0.55 * dot(uv - 0.5, uv - 0.5);
  gl_FragColor = vec4(dither(col), 1.0);
}`,
};
