import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Mitsurugi: "the sword of the gathering clouds". A storm over a mountain
// shrine; the heads of Orochi rise from the clouds behind a vermilion torii
// that guards the sacred mirror and the sword Kusanagi.
const mitsurugi = (t) => {
  const storm = mix(mix(t.accent, t.opp, 0.62), t.bg, 0.6);
  const bolt = mix(mix(t.opp, t.accent, 0.25), '#ffffff', 0.55);
  const ivory = mix(t.text, t.accent2, 0.1);
  const gold = t.accent2;
  const ink = mix(t.bg, '#000000', 0.45);
  const stone = mix(t.muted, t.bg, 0.55);
  const shadowHead = mix(storm, bolt, 0.3);

  // Catmull-Rom spine through control points, sampled evenly.
  const spine = (pts, per) => {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const [p1, p2] = [pts[i], pts[i + 1]];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let j = 0; j < per; j++) {
        const s = j / per;
        const s2 = s * s;
        const s3 = s2 * s;
        out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (p2[k] - p0[k]) * s + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * s2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * s3)));
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  };

  // A tapered ribbon along a sampled spine: back edge and belly edge.
  const ribbonOf = (pts, width) => {
    const back = [];
    const belly = [];
    pts.forEach((p, i) => {
      const q = pts[Math.min(pts.length - 1, i + 1)];
      const o = pts[Math.max(0, i - 1)];
      const len = Math.hypot(q[0] - o[0], q[1] - o[1]) || 1;
      const [tx, ty] = [(q[0] - o[0]) / len, (q[1] - o[1]) / len];
      const w = width(i) / 2;
      back.push([p[0] + ty * w, p[1] - tx * w]);
      belly.push([p[0] - ty * w, p[1] + tx * w]);
    });
    return { back, belly };
  };
  const join = (a) => a.map((p) => `${n1(p[0])} ${n1(p[1])}`).join('L');
  const shape = (r) => `M${join(r.back)}L${join(r.belly.slice().reverse())}Z`;

  // An Orochi neck rising from behind the hills to the back of a head.
  const neck = (pts, w0, w1, detail) => {
    const sp = spine(pts, 6);
    const r = ribbonOf(sp, (i) => w0 + (w1 - w0) * (i / (sp.length - 1)));
    if (!detail) return `<path d="${shape(r)}"/>`;
    let scutes = '';
    let crest = '';
    sp.forEach((p, i) => {
      if (i > 0) scutes += `M${n1(p[0])} ${n1(p[1])}L${n1(r.belly[i][0])} ${n1(r.belly[i][1])}`;
      if (i % 2 === 1) {
        const [bx, by] = r.back[i];
        crest += `M${n1(bx - 8)} ${n1(by + 4)}L${n1(bx + 14)} ${n1(by - 10)}L${n1(bx + 4)} ${n1(by + 10)}Z`;
      }
    });
    const mid = join(sp.map((p, i) => [(p[0] + r.back[i][0]) / 2, (p[1] + r.back[i][1]) / 2]));
    return `<path d="${crest}" fill="${gold}"/><path d="${shape(r)}" fill="${mix(ivory, storm, 0.45)}"/>
<path d="M${join(sp)}L${join(r.belly.slice().reverse())}Z" fill="${mix(ivory, gold, 0.1)}"/>
<path d="${scutes}" stroke="${storm}" stroke-opacity="0.4" stroke-width="1.6"/>
<path d="M${mid}" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="3" stroke-linecap="round"/>`;
  };

  // Head in profile facing left, jaws agape: wedge skull, heavy brow, slit
  // eye, rows of teeth, swept-back horns and a jaw fin. Snout tip at 0 0.
  const skull = 'M0 0C8 -8 20 -13 34 -15C58 -20 82 -30 102 -40C126 -46 152 -40 172 -26C186 -16 192 0 190 14L192 44C168 50 146 52 124 50L22 54C14 53 10 48 12 43L88 20L6 7Z';
  const horns = 'M104 -40C140 -74 196 -92 252 -90C206 -78 162 -58 132 -34ZM146 -32C176 -52 212 -60 244 -56C212 -46 186 -34 166 -22ZM176 30L230 46L182 48Z';
  let teeth = 'M10 8l3 16l5 -14ZM14 42l4 -15l5 13Z';
  for (let k = 0; k < 6; k++) {
    const x = 22 + k * 11;
    teeth += `M${x} ${n1(7 + ((x - 6) * 13) / 82)}l3 8l4 -7ZM${x + 4} ${n1(43 - ((x + 4 - 12) * 23) / 76)}l3 -7l4 7Z`;
  }
  const head = (x, y, s, rot, full) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
<path d="${horns}" fill="${full ? 'url(#dbtefx-mt-horn)' : shadowHead}"/>
${full ? `<path d="M6 7L88 20L12 43Z" fill="${mix(t.accent, '#000000', 0.55)}"/><path d="${teeth}" fill="${ivory}"/>` : ''}
<path d="${skull}" fill="${full ? 'url(#dbtefx-mt-skin)' : shadowHead}"/>
${full ? `<path d="M0 0C8 -8 20 -13 34 -15C58 -20 82 -30 102 -40C126 -46 152 -40 172 -26" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="2"/>
<path d="M64 -26L116 -46L108 -32Z" fill="${mix(storm, t.bg, 0.3)}"/>
<path d="M18 -9q6 -4 11 0M60 30C90 20 120 16 150 22M124 -20C140 -8 150 8 154 30M172 -26C168 -6 170 14 178 34" fill="none" stroke="${mix(storm, t.bg, 0.25)}" stroke-opacity="0.7" stroke-width="1.6"/>` : ''}
${full ? `<path d="M70 -22Q90 -40 114 -32Q96 -14 70 -22Z" fill="${mix(storm, t.bg, 0.45)}"/>` : '<ellipse cx="92" cy="-26" rx="18" ry="10" fill="url(#dbtefx-mt-eye)"/>'}
<path d="M76 -24Q92 -35 108 -31Q94 -19 76 -24Z" fill="${full ? gold : t.accent}"/>
${full ? '<ellipse cx="93" cy="-27" rx="1.6" ry="5" fill="#000000"/>' : ''}
</g>`;

  // Storm clouds: clusters of billows, each lit on its crown.
  const cloud = (x, y, w, h, seed, fill) => {
    const r = rng(seed);
    let c = '';
    for (let row = 0; row < 3; row++) {
      const span = w * (1 - row * 0.3);
      const k = Math.max(2, Math.round(span / (h * 0.55)));
      for (let i = 0; i < k; i++) {
        const rad = h * (0.32 + r() * 0.3) * (1 - row * 0.15);
        const cx = x + (w - span) / 2 + ((i + 0.5) / k) * span + (r() - 0.5) * h * 0.3;
        const cy = y - row * h * 0.32 - r() * h * 0.12;
        c += `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(rad * 1.15)}" ry="${n1(rad)}"/>`;
      }
    }
    const id = `dbtefx-mt-c${seed}`;
    return `<defs><g id="${id}">${c}</g></defs><use href="#${id}" fill="${mix(fill, bolt, 0.3)}"/><use href="#${id}" fill="${fill}" y="${n1(h * 0.09)}"/>`;
  };
  const drift = (dur, delay, body) => `<g style="animation: dbtefx-mt-cloud ${dur}s ease-in-out ${-delay}s infinite;">${body}</g>`;
  const breathe = (delay, body) => `<g style="animation: dbtefx-mt-breathe 12s ease-in-out ${-delay}s infinite;">${body}</g>`;

  // Mirror: bronze disc, concentric relief, eight magatama on the rim.
  const [mx, my, mr] = [1230, 540, 74];
  let magatama = '';
  for (let i = 0; i < 8; i++) {
    const [qx, qy] = polar(mx, my, mr - 11, i * 45 - 90);
    magatama += `<path d="M${qx} ${qy}m4 0a4 4 0 1 0 -8 0c0 5 3 7 7 8c-2 -2 -2 -5 1 -8z" transform="rotate(${i * 45} ${qx} ${qy})"/>`;
  }

  // Torii: symmetric kasagi with upturned ends, shimaki, gakuzuka, nuki,
  // raked posts on stone bases, a stepped plinth.
  const torii = `<path d="M1040 286C1084 308 1150 314 1230 314C1310 314 1376 308 1420 286L1416 304C1374 324 1310 332 1230 332C1150 332 1086 324 1044 304Z" fill="${ink}"/>
<path d="M1040 286C1084 308 1150 314 1230 314C1310 314 1376 308 1420 286" fill="none" stroke="${mix(gold, '#ffffff', 0.3)}" stroke-opacity="0.4" stroke-width="2"/>
<path d="M1060 326H1400V350H1060ZM1220 350H1240V384H1220ZM1084 384H1376V402H1084Z" fill="url(#dbtefx-mt-lacq)"/>
<path d="M1124 350H1150L1156 744H1118ZM1310 350H1336L1342 744H1304Z" fill="url(#dbtefx-mt-pillar)"/>
<path d="M1060 332H1400M1084 384H1376" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5"/>
<path d="M1112 744h50v14h-50ZM1298 744h50v14h-50Z" fill="${ink}"/>
<path d="M1050 758H1410V776H1050ZM1030 776H1430V798H1030Z" fill="${stone}"/>
<path d="M1050 758H1410M1030 776H1430" stroke="${mix(stone, '#ffffff', 0.3)}" stroke-width="1.5"/>`;

  // Shimenawa hung across the gate under the nuki, with shide and fringe.
  const ropePts = Array.from({ length: 25 }, (_, i) => [1146 + (i / 24) * 168, 410 + Math.sin((i / 24) * Math.PI) * 12]);
  const rope = ribbonOf(ropePts, (i) => 9 + Math.sin((i / 24) * Math.PI) * 7);
  let twist = '';
  for (let i = 0; i < 23; i++) twist += `M${n1(rope.back[i][0])} ${n1(rope.back[i][1])}L${n1(rope.belly[i + 2][0])} ${n1(rope.belly[i + 2][1])}`;
  let shide = '';
  [6, 12, 18].forEach((k, i) => {
    const [x, y0] = ropePts[k];
    const y = n1(y0 + 8);
    const xs = n1(x - 6);
    shide += `<g style="transform-origin: ${n1(x)}px ${y}px; animation: dbtefx-reed ${n1(5 + i * 0.7)}s ease-in-out ${-i * 1.4}s infinite;"><path d="M${xs} ${y}h11l8 13h-10l8 13h-10l8 13h-10l8 13h-11l-8 -13h10l-8 -13h10l-8 -13h10Z" fill="${t.text}"/></g>`;
  });
  let fringe = '';
  for (let k = 3; k < 22; k += 3) fringe += `M${n1(ropePts[k][0])} ${n1(ropePts[k][1] + 8)}v${8 + (k % 2) * 6}`;

  // Kusanagi: a straight double-edged tsurugi with a central ridge, a disc
  // tsuba seen edge-on, a cord-wrapped grip and a plain cap; point down.
  const sword = `<g ${anim('bob', 9, 0, 'ease-in-out')}>
<path d="M1230 512L1238 520V712L1230 738L1222 712V520Z" fill="url(#dbtefx-mt-blade)"/>
<path d="M1230 520V730" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.2"/>
<clipPath id="dbtefx-mt-edge"><path d="M1230 512L1238 520V712L1230 738L1222 712V520Z"/></clipPath>
<g clip-path="url(#dbtefx-mt-edge)"><rect x="1218" y="470" width="24" height="44" fill="url(#dbtefx-mt-glint)" style="animation: dbtefx-mt-shine 6s ease-in-out infinite;"/></g>
<rect x="1225" y="504" width="10" height="9" fill="${gold}"/>
<ellipse cx="1230" cy="502" rx="18" ry="4.5" fill="${mix(gold, t.bg, 0.3)}" stroke="${gold}" stroke-width="1.5"/>
<rect x="1225" y="448" width="10" height="52" rx="2" fill="${mix(t.bg, storm, 0.4)}"/>
<path d="M1225 452l10 7l-10 7l10 7l-10 7l10 7l-10 7l10 7" fill="none" stroke="${gold}" stroke-width="1.4"/>
<path d="M1223 448h14l-2 -8h-10Z" fill="${gold}"/>
</g>`;

  // A sugi forest along the far ridge: narrow spires of uneven height.
  const fr = rng(61);
  let forest = `M0 ${H}`;
  for (let x = 0; x <= W; x += 14 + fr() * 16) {
    const base = 640 + Math.sin(x / 140) * 26;
    const top = base - 30 - fr() * 60;
    forest += `L${n1(x - 8)} ${n1(base)}L${n1(x)} ${n1(top)}L${n1(x + 8)} ${n1(base)}`;
  }
  forest += `L${W} ${H}Z`;

  let bolts = '';
  [[300, 90, 7, 3], [1400, 60, 11, 7.5]].forEach(([x, y, seed, delay]) => {
    const r = rng(seed);
    let d = `M${x} ${y}`;
    let [cx, cy] = [x, y];
    for (let i = 0; i < 8; i++) {
      cx += (r() - 0.5) * 56;
      cy += 20 + r() * 16;
      d += `L${n1(cx)} ${n1(cy)}`;
      if (i === 3) d += `M${n1(cx)} ${n1(cy)}l${n1(30 + r() * 20)} ${n1(26 + r() * 10)}l-6 24M${n1(cx)} ${n1(cy)}`;
    }
    bolts += `<path d="${d}" fill="none" stroke="${bolt}" stroke-width="2.4" stroke-linejoin="bevel" style="animation: dbtefx-mt-bolt 9s linear ${-delay}s infinite;"/>`;
  });

  return `<style>@keyframes dbtefx-mt-bolt { 0%, 90%, 94%, 100% { opacity: 0; } 91%, 93% { opacity: 1; } 92% { opacity: 0.2; } }
@keyframes dbtefx-mt-breathe { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-14px, 20px); } }
@keyframes dbtefx-mt-cloud { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(46px); } }
@keyframes dbtefx-mt-shine { 0%, 15% { transform: translateY(0); opacity: 0; } 25% { opacity: 1; } 70% { transform: translateY(240px); opacity: 1; } 80%, 100% { transform: translateY(260px); opacity: 0; } }</style>
<defs>
<linearGradient id="dbtefx-mt-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${storm}"/><stop offset="0.65" stop-color="${mix(storm, t.bg, 0.55)}"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-mt-halo"><stop offset="0" stop-color="${gold}" stop-opacity="0.55"/><stop offset="0.4" stop-color="${gold}" stop-opacity="0.14"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-mt-storm" cx="0.5" cy="0.5"><stop offset="0" stop-color="${bolt}" stop-opacity="0.22"/><stop offset="1" stop-color="${bolt}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-mt-disc" cx="0.4" cy="0.35"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.3" stop-color="${mix(gold, '#ffffff', 0.45)}"/><stop offset="1" stop-color="${mix(gold, t.bg, 0.5)}"/></radialGradient>
<radialGradient id="dbtefx-mt-eye"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.8"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-mt-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ivory}"/><stop offset="1" stop-color="${mix(ivory, storm, 0.55)}"/></linearGradient>
<linearGradient id="dbtefx-mt-horn" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${mix(gold, t.bg, 0.4)}"/><stop offset="1" stop-color="${mix(gold, '#ffffff', 0.4)}"/></linearGradient>
<linearGradient id="dbtefx-mt-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.text, t.opp, 0.35)}"/><stop offset="0.5" stop-color="#ffffff"/><stop offset="0.52" stop-color="${mix(t.text, t.opp, 0.2)}"/><stop offset="1" stop-color="${mix(t.text, t.bg, 0.55)}"/></linearGradient>
<linearGradient id="dbtefx-mt-glint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.5" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-mt-lacq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.15)}"/><stop offset="1" stop-color="${mix(t.accent, t.bg, 0.45)}"/></linearGradient>
<linearGradient id="dbtefx-mt-pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.accent, t.bg, 0.55)}"/><stop offset="0.6" stop-color="${t.accent}"/><stop offset="1" stop-color="${mix(t.accent, t.bg, 0.25)}"/></linearGradient>
<linearGradient id="dbtefx-mt-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(storm, t.text, 0.25)}" stop-opacity="0"/><stop offset="0.5" stop-color="${mix(storm, t.text, 0.25)}" stop-opacity="0.28"/><stop offset="1" stop-color="${mix(storm, t.text, 0.25)}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-mt-rope" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.3)}"/><stop offset="1" stop-color="${mix(gold, t.bg, 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-mt-cfg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="760" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.2"/><stop offset="0.6" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<mask id="dbtefx-mt-cf" maskUnits="userSpaceOnUse" x="-200" y="0" width="2000" height="${H}"><rect x="-200" width="2000" height="${H}" fill="url(#dbtefx-mt-cfg)"/></mask>
</defs>
<rect width="${W}" height="620" fill="url(#dbtefx-mt-sky)"/>
<ellipse cx="1270" cy="230" rx="360" ry="260" fill="url(#dbtefx-mt-storm)"/>
<g mask="url(#dbtefx-mt-cf)">${drift(48, 0, `${cloud(-40, 250, 760, 110, 3, mix(storm, t.bg, 0.25))}${cloud(860, 150, 800, 100, 5, mix(storm, t.bg, 0.3))}`)}</g>
${bolts}
<g opacity="0.75">${breathe(4, `<g fill="${shadowHead}">${neck([[1240, 134], [1310, 120], [1380, 150], [1430, 280], [1440, 520]], 30, 48, false)}${neck([[1394, 162], [1430, 180], [1450, 250], [1460, 420]], 24, 40, false)}</g>`)}
${breathe(2, `${head(1150, 124, 0.5, -4, false)}${head(1312, 156, 0.45, 6, false)}`)}</g>
${breathe(0, `${neck([[1214, 250], [1290, 262], [1360, 320], [1396, 440], [1410, 600]], 58, 86, true)}${head(1060, 230, 0.85, 0, true)}`)}
<g mask="url(#dbtefx-mt-cf)">${drift(30, 8, `${cloud(-60, 420, 900, 90, 21, mix(storm, t.bg, 0.4))}${cloud(1100, 470, 560, 70, 23, mix(storm, t.bg, 0.45))}`)}</g>
<path d="M0 640L120 560L230 600L380 500L520 590L640 540L760 610L900 520L1040 600L1200 540L1380 610L1520 530L1600 580V${H}H0Z" fill="${mix(storm, t.bg, 0.62)}"/>
<rect y="560" width="${W}" height="150" fill="url(#dbtefx-mt-mist)"/>
<path d="${forest}" fill="${mix(storm, t.bg, 0.8)}"/>
<path d="M0 720L180 650L340 700L520 640L700 700L880 660L1060 710L1240 670L1420 710L1600 660V${H}H0Z" fill="${mix(storm, t.bg, 0.82)}"/>
<!--mid-->
<g mask="url(#dbtefx-mt-cf)">${drift(24, 3, cloud(240, 470, 380, 64, 13, mix(storm, t.bg, 0.2)))}</g>
<circle cx="${mx}" cy="${my}" r="280" fill="url(#dbtefx-mt-halo)" ${anim('bloom', 8, 0, 'ease-in-out')}/>
${torii}
<circle cx="${mx}" cy="${my}" r="${mr + 8}" fill="${mix(gold, t.bg, 0.5)}"/>
<circle cx="${mx}" cy="${my}" r="${mr}" fill="url(#dbtefx-mt-disc)"/>
<circle cx="${mx}" cy="${my}" r="${mr - 20}" fill="none" stroke="${mix(gold, t.bg, 0.4)}" stroke-opacity="0.6" stroke-width="2"/>
<g fill="${mix(gold, t.bg, 0.35)}">${magatama}</g>
<ellipse cx="${mx - 22}" cy="${my - 26}" rx="26" ry="10" fill="#ffffff" fill-opacity="0.3" transform="rotate(-35 ${mx - 22} ${my - 26})"/>
<path d="${fringe}" stroke="${mix(gold, t.bg, 0.3)}" stroke-width="2.5" stroke-linecap="round"/>
<path d="${shape(rope)}" fill="url(#dbtefx-mt-rope)"/>
<path d="${twist}" stroke="${mix(gold, t.bg, 0.65)}" stroke-width="1.6"/>
${shide}
${sword}
<rect y="740" width="${W}" height="120" fill="url(#dbtefx-mt-mist)" ${anim('drift', 26, 0, 'ease-in-out')}/>`;
};

export default mitsurugi;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 40, colors: ['accent2', 'text'] }, { kind: 'flash', count: 1, colors: ['opp'] }];
