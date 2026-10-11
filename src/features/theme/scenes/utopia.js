import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';

// Number 39: Utopia over Heartland. Dusk under the Astral sky: deep blue
// overhead, Heartland Tower's heart-crowned spire and the city low on the
// left. On the right Utopia stands in a knight's vigil, the Rising Sword
// planted point-down before him, hands on the guard: white armour trimmed in
// gold, the red 39 on his shoulder, the gold V crest, and his golden wing
// fins fanned behind him in a slowly turning sunburst. Not Xyz (no black
// hole, no orbiting overlay units, no black): a bright knight under a blue sky.

const utopia = (t) => {
  const rand = rng(39);
  const cx = 1240;
  const white = mix(t.text, '#ffffff', 0.5);
  const pearl = mix(t.text, t.muted, 0.35);
  const steel = mix(t.muted, t.bg, 0.35);
  const suit = mix(t.bg, t.raised, 0.6);
  const gold = t.accent;
  const goldHi = mix(t.accent, '#ffffff', 0.45);
  const goldDk = mix(t.accent, '#000000', 0.45);
  const red = t.accent2;
  const seam = mix(t.bg, t.border, 0.5);
  const night = mix(t.bg, '#000000', 0.25);
  const dusk = mix(t.bg, t.opp, 0.32);
  const mx = (x) => n1(2 * cx - x);
  // Mirror a path's x coordinates about the figure's axis.
  const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${mx(+x)} ${y}`);

  // ---- far: Astral sky, stars, Heartland ----
  let stars = '';
  for (let i = 0; i < 110; i++) stars += `M${n1(rand() * 1600)} ${n1(rand() * 560)}h0`;
  let glints = '';
  [[300, 120, 7], [560, 220, 5], [880, 90, 6], [180, 380, 5], [760, 420, 4]].forEach(([x, y, s]) => {
    glints += `M${x} ${y - s}L${n1(x + s * 0.22)} ${n1(y - s * 0.22)}L${x + s} ${y}L${n1(x + s * 0.22)} ${n1(y + s * 0.22)}L${x} ${y + s}L${n1(x - s * 0.22)} ${n1(y + s * 0.22)}L${x - s} ${y}L${n1(x - s * 0.22)} ${n1(y - s * 0.22)}Z`;
  });
  // Heartland: a low city of blue towers and the spire with the heart on top.
  const base = 790;
  let city = '';
  let lights = '';
  let x = 120;
  while (x < 1600) {
    const w = 24 + rand() * 40;
    const h = 30 + rand() * 90 * (x < 700 ? 1 : 0.6);
    city += `M${n1(x)} 900V${n1(base - h)}h${n1(w)}V900Z`;
    for (let k = 0; k < 3; k++) if (rand() < 0.7) lights += `M${n1(x + 5 + rand() * (w - 10))} ${n1(base - h + 10 + rand() * (h - 10))}h0`;
    x += w + 4 + rand() * 10;
  }
  const tx = 330;
  const tower = `M${tx - 26} 900L${tx - 9} 300H${tx + 9}L${tx + 26} 900ZM${tx - 40} 520H${tx + 40}L${tx + 30} 534H${tx - 30}Z`;
  const heart = `M${tx} 292C${tx - 14} 278 ${tx - 46} 262 ${tx - 46} 232C${tx - 46} 210 ${tx - 22} 200 ${tx} 220C${tx + 22} 200 ${tx + 46} 210 ${tx + 46} 232C${tx + 46} 262 ${tx + 14} 278 ${tx} 292Z`;

  // ---- mid: the sunburst and Utopia ----
  let rays = '';
  for (let i = 0; i < 36; i++) {
    const a = i * 10;
    const [x1, y1] = polar(cx, 300, 1100, a - (i % 2 ? 1.2 : 2.6));
    const [x2, y2] = polar(cx, 300, 1100, a + (i % 2 ? 1.2 : 2.6));
    rays += `M${cx} 300L${x1} ${y1}L${x2} ${y2}Z`;
  }

  // A golden wing fin: a long blade cut in a lit and a shaded facet.
  const fin = (ox, oy, ang, len, w) => {
    const [tx2, ty2] = polar(ox, oy, len, ang);
    const [ax, ay] = polar(ox, oy, w / 2, ang - 90);
    const [bx, by] = polar(ox, oy, w / 2, ang + 90);
    const [mx1, my1] = polar(ox, oy, len * 0.55, ang - 6);
    const [mx2, my2] = polar(ox, oy, len * 0.6, ang + 4);
    return {
      lit: `M${ox} ${oy}L${ax} ${ay}Q${mx1} ${my1} ${tx2} ${ty2}Z`,
      dark: `M${ox} ${oy}L${bx} ${by}Q${mx2} ${my2} ${tx2} ${ty2}Z`,
      edge: `M${ax} ${ay}Q${mx1} ${my1} ${tx2} ${ty2}Q${mx2} ${my2} ${bx} ${by}`,
    };
  };
  const fan = (ox, oy, spec) => {
    const f = spec.map(([a, l, w]) => fin(ox, oy, a, l, w));
    return `<path d="${f.map((b) => b.dark).join('')}" fill="url(#dbtefx-ut-goldDk)"/><path d="${f.map((b) => b.lit).join('')}" fill="url(#dbtefx-ut-gold)"/><path d="${f.map((b) => b.edge).join('')}" fill="none" stroke="${goldDk}" stroke-width="1.6" stroke-linejoin="round"/>`;
  };
  const wingL = fan(1182, 330, [[-160, 160, 30], [-145, 200, 34], [-128, 262, 38], [-112, 320, 40], [-97, 330, 36]]);
  const wingR = fan(1298, 330, [[-20, 240, 30], [-35, 270, 34], [-52, 300, 38], [-68, 320, 40], [-83, 330, 36]]);

  // Pauldron (viewer's left; the right one is mirrored): an angular shell with
  // a swept fin, two lames below, gold-edged.
  const pauldron = `M1168 318L1112 300Q1070 304 1058 344L1060 404L1104 424L1160 404Z`;
  const pfin = `M1120 304L1036 226L1066 312Z`;
  const plate2 = `M1062 404L1104 424L1160 404L1154 440L1106 458L1068 440Z`;
  const plate3 = `M1070 440L1106 458L1154 440L1148 470L1108 486L1078 470Z`;
  const rim = `M1060 404L1104 424L1160 404`;
  const upper = `M1082 466L1080 520L1126 528L1138 470Z`;
  const fore = `M1084 516L1100 552Q1110 568 1132 566L1210 556L1210 526L1132 516L1126 504Z`;
  const cuff = `M1102 512L1132 506L1138 548L1108 560Z`;
  const fist = `M1196 524L1226 520Q1236 538 1226 558L1196 560Z`;
  const tasset = `M1184 580L1220 594L1212 690L1160 668Z`;
  const thigh = `M1170 650L1222 660L1218 800L1180 800Z`;

  // Sword: the Rising Sword planted point-down.
  const blade = `M1204 584H1276L1270 626L1282 640L1268 652L1258 668L1262 900H1218L1222 668L1212 652L1198 640L1210 626Z`;

  // Helmet: dome, face plate, visor slit, the gold V crest and centre fin.
  const helm = `<path d="M1236 214L1176 112L1194 108L1240 190L1286 108L1304 112L1244 214Z" fill="url(#dbtefx-ut-gold)" stroke="${goldDk}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="M1240 196L1194 108L1186 110L1238 210Z" fill="${goldHi}" fill-opacity="0.6"/>
<path d="M1206 252Q1202 196 1240 184Q1278 196 1274 252L1268 280Q1240 296 1212 280Z" fill="url(#dbtefx-ut-white)" stroke="${seam}" stroke-width="1.8"/>
<path d="M1240 168L1230 196L1240 226L1250 196Z" fill="url(#dbtefx-ut-gold)" stroke="${goldDk}" stroke-width="1.2"/>
<path d="M1212 232L1240 242L1268 232L1264 270L1240 294L1216 270Z" fill="${night}" stroke="${seam}" stroke-width="1.4"/>
<path d="M1240 246L1240 290" stroke="${suit}" stroke-width="2"/>
<path d="M1220 248L1235 254L1233 258L1219 253ZM1260 248L1245 254L1247 258L1261 253Z" fill="${goldHi}" style="animation: dbtefx-ut-glow 4s ease-in-out infinite;"/>
<path d="M1222 270L1240 284L1258 270" fill="none" stroke="${steel}" stroke-opacity="0.6" stroke-width="1.4"/>
<path d="M1206 252L1196 274L1214 282ZM1274 252L1284 274L1266 282Z" fill="url(#dbtefx-ut-gold)" stroke="${goldDk}" stroke-width="1.2"/>
<path d="M1214 206Q1226 192 1240 190" fill="none" stroke="#ffffff" stroke-opacity="0.85" stroke-width="2.4" stroke-linecap="round"/>`;

  // Chest: white cuirass with a gold collar and the crest jewel.
  const chest = `<path d="M1226 286H1254V312H1226Z" fill="${suit}"/>
<path d="M1196 460H1284L1290 560H1190Z" fill="${suit}" stroke="${seam}" stroke-width="1.4"/>
<path d="M1204 482H1276M1202 506H1278M1200 530H1280" stroke="${gold}" stroke-opacity="0.6" stroke-width="1.6"/>
<path d="M1160 322L1320 322L1316 380L1290 452L1240 472L1190 452L1164 380Z" fill="url(#dbtefx-ut-white)" stroke="${seam}" stroke-width="3" stroke-linejoin="round"/><path d="M1164 380L1190 452L1240 472L1290 452L1316 380" fill="none" stroke="${gold}" stroke-width="2.6" stroke-linejoin="round"/>
<path d="M1164 380L1200 420L1240 430L1280 420L1316 380" fill="none" stroke="${steel}" stroke-width="1.8"/>
<path d="M1240 336V470" stroke="${steel}" stroke-width="1.4"/>
<path d="M1282 330L1316 330L1314 378L1290 410Z" fill="${pearl}" fill-opacity="0.7"/>
<path d="M1182 306H1298L1318 324H1162Z" fill="url(#dbtefx-ut-gold)" stroke="${goldDk}" stroke-width="1.4"/>
<path d="M1240 346L1270 380L1240 414L1210 380Z" fill="url(#dbtefx-ut-gold)" stroke="${goldDk}" stroke-width="1.6"/>
<path d="M1240 362L1254 380L1240 398L1226 380Z" fill="${red}"/>
<path d="M1236 368L1244 368L1240 374Z" fill="#ffffff" fill-opacity="0.8"/>
<path d="M1172 332L1206 332L1196 386Z" fill="#ffffff" fill-opacity="0.45"/>`;

  // The 39 on the right shoulder (viewer's left), skewed onto the plate.
  const glyph = 'M2 3H24V21H9M24 21V39H2M54 21H34V3H56V39H34';
  const number = `<g transform="translate(1084 346) rotate(-6) skewX(-14)" fill="none" stroke-linejoin="miter" stroke-linecap="square"><path d="${glyph}" stroke="${goldDk}" stroke-width="11"/><path d="${glyph}" stroke="${red}" stroke-width="6.5" style="animation: dbtefx-ut-glow 4s ease-in-out infinite;"/><path d="M2 3H24M34 3H56" stroke="#ffffff" stroke-opacity="0.45" stroke-width="1.6" transform="translate(0 -1.5)"/></g>`;

  return `<style>
@keyframes dbtefx-ut-glow { 0%, 100% { opacity: 0.75; } 50% { opacity: 1; } }
@keyframes dbtefx-ut-finL { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-3deg); } }
@keyframes dbtefx-ut-finR { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(3deg); } }
@keyframes dbtefx-ut-halo { 0%, 100% { opacity: 0.55; transform: scale(0.97); } 50% { opacity: 1; transform: scale(1.03); } }
</style>
<defs>
<linearGradient id="dbtefx-ut-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${night}"/><stop offset="0.55" stop-color="${mix(t.bg, t.opp, 0.18)}"/><stop offset="0.86" stop-color="${dusk}"/><stop offset="1" stop-color="${mix(dusk, gold, 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-ut-sun" cx="${cx}" cy="300" r="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${goldHi}" stop-opacity="0.75"/><stop offset="0.18" stop-color="${gold}" stop-opacity="0.38"/><stop offset="0.5" stop-color="${gold}" stop-opacity="0.1"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ut-rays" cx="${cx}" cy="300" r="900" gradientUnits="userSpaceOnUse"><stop offset="0.1" stop-color="${goldHi}" stop-opacity="0.38"/><stop offset="0.4" stop-color="${gold}" stop-opacity="0.08"/><stop offset="0.75" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ut-mist" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${goldHi}" stop-opacity="0.85"/><stop offset="0.5" stop-color="${gold}" stop-opacity="0.35"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ut-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldHi}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="1" stop-color="${mix(gold, '#000000', 0.25)}"/></linearGradient>
<linearGradient id="dbtefx-ut-goldDk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${gold}"/><stop offset="1" stop-color="${goldDk}"/></linearGradient>
<linearGradient id="dbtefx-ut-white" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.45" stop-color="${white}"/><stop offset="0.8" stop-color="${pearl}"/><stop offset="1" stop-color="${mix(pearl, t.bg, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-ut-steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="0.48" stop-color="${pearl}"/><stop offset="0.52" stop-color="${steel}"/><stop offset="1" stop-color="${mix(steel, t.bg, 0.3)}"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-ut-sky)"/>
<path d="${stars}" stroke="${t.text}" stroke-opacity="0.6" stroke-width="1.8" stroke-linecap="round"/>
<path d="${glints}" fill="${t.opp}" fill-opacity="0.8"/>
<path d="${tower}" fill="${mix(night, t.opp, 0.12)}"/>
<path d="${heart}" fill="${red}" fill-opacity="0.18"/><path d="${heart}" fill="none" stroke="${mix(night, t.opp, 0.45)}" stroke-width="9"/><path d="${heart}" fill="none" stroke="${red}" stroke-width="2.4" style="animation: dbtefx-ut-glow 4s ease-in-out infinite;"/>
<circle cx="${tx}" cy="240" r="62" fill="none" stroke="${t.opp}" stroke-opacity="0.35" stroke-width="2"/>
<path d="M${tx} 160V200" stroke="${mix(night, t.opp, 0.3)}" stroke-width="3"/><circle cx="${tx}" cy="158" r="3" fill="${red}"/>
<path d="${city}" fill="${mix(night, t.opp, 0.16)}"/>
<path d="${lights}" stroke="${t.opp}" stroke-opacity="0.7" stroke-width="2.4" stroke-linecap="round"/>
<!--mid-->
<rect width="1600" height="900" fill="url(#dbtefx-ut-sun)"/>
<g style="transform-origin: ${cx}px 300px; animation: dbtefx-spin 160s linear infinite;"><path d="${rays}" fill="url(#dbtefx-ut-rays)"/></g>
<circle cx="${cx}" cy="300" r="240" fill="none" stroke="${goldHi}" stroke-opacity="0.45" stroke-width="3" style="transform-origin: ${cx}px 300px; animation: dbtefx-ut-halo 6s ease-in-out infinite;"/>
<circle cx="${cx}" cy="300" r="262" fill="none" stroke="${gold}" stroke-opacity="0.25" stroke-width="1.5" stroke-dasharray="2 10"/>
<g style="transform-origin: 1182px 330px; animation: dbtefx-ut-finL 7s ease-in-out infinite;">${wingL}</g>
<g style="transform-origin: 1298px 330px; animation: dbtefx-ut-finR 7s ease-in-out infinite;">${wingR}</g>
<ellipse cx="${cx}" cy="880" rx="340" ry="120" fill="url(#dbtefx-ut-mist)"/>
<path d="${thigh}${mirror(thigh)}" fill="${suit}" stroke="${seam}" stroke-width="1.4"/>
<path d="${tasset}${mirror(tasset)}" fill="url(#dbtefx-ut-white)" stroke="${seam}" stroke-width="1.6" stroke-linejoin="round"/>
${chest}
<path d="M1186 556H1294L1298 588H1182Z" fill="url(#dbtefx-ut-gold)" stroke="${goldDk}" stroke-width="1.4"/>
<path d="${upper}${mirror(upper)}" fill="${suit}" stroke="${seam}" stroke-width="1.4"/>
<path d="${plate3}${mirror(plate3)}" fill="url(#dbtefx-ut-white)" stroke="${seam}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="${plate2}${mirror(plate2)}" fill="url(#dbtefx-ut-white)" stroke="${seam}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="${pfin}${mirror(pfin)}" fill="url(#dbtefx-ut-white)" stroke="${gold}" stroke-width="2.4" stroke-linejoin="round"/>
<path d="${pauldron}" fill="url(#dbtefx-ut-white)" stroke="${seam}" stroke-width="3" stroke-linejoin="round"/>
<path d="${mirror(pauldron)}" fill="url(#dbtefx-ut-steel)" stroke="${seam}" stroke-width="3" stroke-linejoin="round"/>
<path d="${rim}${mirror(rim)}" fill="none" stroke="${gold}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1068 344Q1080 310 1110 306L1150 318" fill="none" stroke="#ffffff" stroke-opacity="0.9" stroke-width="3" stroke-linecap="round"/><path d="M1062 352L1160 352M${mx(1062)} 352L${mx(1160)} 352" stroke="${steel}" stroke-opacity="0.7" stroke-width="1.4"/><path d="M1168 318L1112 300Q1070 304 1058 344M${mirror("1168 318L1112 300Q1070 304 1058 344")}" fill="none" stroke="${gold}" stroke-width="2.4" stroke-linejoin="round"/>
${number}
<path d="${blade}" fill="url(#dbtefx-ut-steel)" stroke="${seam}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="M1240 600V900" stroke="${steel}" stroke-width="5"/><path d="M1236 600V900" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.4"/>
<path d="M1144 558L1240 570L1336 558L1324 580L1240 590L1156 580Z" fill="url(#dbtefx-ut-gold)" stroke="${goldDk}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="M1228 506H1252V566H1228Z" fill="${suit}"/>
<circle cx="${cx}" cy="502" r="14" fill="url(#dbtefx-ut-gold)" stroke="${goldDk}" stroke-width="1.6"/><circle cx="${cx}" cy="502" r="5" fill="${red}"/>
<path d="${fore}${mirror(fore)}" fill="url(#dbtefx-ut-white)" stroke="${seam}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="${cuff}${mirror(cuff)}" fill="url(#dbtefx-ut-gold)" stroke="${goldDk}" stroke-width="1.2"/>
<path d="${fist}${mirror(fist)}" fill="url(#dbtefx-ut-white)" stroke="${seam}" stroke-width="1.6"/>
<path d="M1206 528V556M1274 528V556" stroke="${steel}" stroke-width="1.4"/>
${helm}
<!--near-->
<path d="M0 900V860Q400 830 800 850T1600 840V900Z" fill="${mix(night, t.opp, 0.1)}" fill-opacity="0.8"/>`;
};

export default utopia;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 46, colors: ['accent', 'text'], rise: true, speed: 0.6 },
  { kind: 'star', count: 50, colors: ['text', 'opp'] },
];
