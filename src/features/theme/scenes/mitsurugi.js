import { mix } from '../../../lib/color.js';
import { anim, H, n1, polar, rng, W } from './kit.js';

// Mitsurugi: "the sword of the gathering clouds". A storm over a mountain
// shrine; the white serpent Murakumo coils through the clouds toward a
// vermilion torii that frames the sacred mirror and the sword Kusanagi.
const mitsurugi = (t) => {
  const storm = mix(mix(t.accent, t.opp, 0.62), t.bg, 0.6);
  const bolt = mix(mix(t.opp, t.accent, 0.25), '#ffffff', 0.55);
  const ivory = mix(t.text, t.accent2, 0.1);
  const gold = t.accent2;
  const ink = mix(t.bg, '#000000', 0.45);

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

  // A tapered ribbon along a sampled spine: back edge, spine, belly edge.
  const ribbonOf = (pts, width) => {
    const back = [];
    const belly = [];
    const tan = [];
    pts.forEach((p, i) => {
      const q = pts[Math.min(pts.length - 1, i + 1)];
      const o = pts[Math.max(0, i - 1)];
      const len = Math.hypot(q[0] - o[0], q[1] - o[1]) || 1;
      const [tx, ty] = [(q[0] - o[0]) / len, (q[1] - o[1]) / len];
      const w = width(i) / 2;
      tan.push([tx, ty, w]);
      back.push([n1(p[0] + ty * w), n1(p[1] - tx * w)]);
      belly.push([n1(p[0] - ty * w), n1(p[1] + tx * w)]);
    });
    return { back, belly, tan };
  };
  const join = (a) => a.map((p) => `${n1(p[0])} ${n1(p[1])}`).join('L');

  // The serpent Murakumo: silver back, ivory belly with scutes, gold crest.
  const body = spine([[330, -60], [190, 120], [300, 300], [560, 330], [760, 210], [900, 150], [970, 200], [1045, 232]], 7);
  const n = body.length;
  const width = (i) => 6 + 58 * Math.sin(Math.min(1, (i / n) * 1.5) * Math.PI * 0.5) - (i > n - 6 ? (i - n + 6) * 5 : 0);
  const { back, belly, tan } = ribbonOf(body, width);
  const backHalf = `M${join(back)}L${join(body.slice().reverse())}Z`;
  const bellyHalf = `M${join(body)}L${join(belly.slice().reverse())}Z`;
  let scutes = '';
  let crest = '';
  body.forEach((p, i) => {
    const [tx, ty, w] = tan[i];
    if (i > 2 && i < n - 1) scutes += `M${n1(p[0])} ${n1(p[1])}L${belly[i][0]} ${belly[i][1]}`;
    if (i % 3 === 0 && i > 6 && i < n - 3) {
      const h = 8 + w * 0.5;
      const [bx, by] = back[i];
      crest += `M${n1(bx - tx * 9)} ${n1(by - ty * 9)}Q${n1(bx + ty * h * 0.5)} ${n1(by - tx * h * 0.5)} ${n1(bx + ty * h + tx * 14)} ${n1(by - tx * h + ty * 14)}Q${n1(bx + tx * 4)} ${n1(by + ty * 4)} ${n1(bx + tx * 9)} ${n1(by + ty * 9)}Z`;
    }
  });
  const rim = join(body.map((p, i) => [p[0] + (back[i][0] - p[0]) * 0.72, p[1] + (back[i][1] - p[1]) * 0.72]));
  const [hx, hy] = body[n - 1];
  const [px, py] = body[n - 3];
  const heading = n1((Math.atan2(hy - py, hx - px) * 180) / Math.PI);

  // Head facing along the spine: long snout, gold horns, a red eye.
  const head = `<g transform="translate(${n1(hx)} ${n1(hy)}) rotate(${heading}) scale(1.35)">
<path d="M30 -24C14 -44 -16 -56 -66 -54C-30 -46 -4 -36 10 -20ZM44 -23C34 -40 12 -50 -24 -52C2 -42 18 -32 26 -20Z" fill="${gold}"/>
<path d="M-14 -20C4 -30 22 -30 34 -25L50 -24C62 -19 78 -12 92 -6C98 -3 99 3 94 7L72 9L92 13C88 19 72 23 52 23C30 25 6 25 -14 20Z" fill="${ivory}"/>
<path d="M-14 10C10 16 40 16 52 23C30 25 6 25 -14 20Z" fill="${mix(ivory, storm, 0.5)}"/>
<path d="M94 7L40 10" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>
<path d="M82 9l-2 8l-4 -8ZM68 10l-2 7l-4 -7Z" fill="#ffffff"/>
<path d="M30 -18C38 -24 50 -24 58 -16" fill="none" stroke="${mix(storm, t.bg, 0.3)}" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="46" cy="-11" rx="16" ry="10" fill="url(#dbtefx-mt-eye)" ${anim('pulse', 3.4, 0, 'ease-in-out')}/><path d="M36 -12Q46 -18 56 -11Q46 -8 36 -12Z" fill="${t.accent}"/>
<circle cx="86" cy="-3" r="1.8" fill="${ink}"/>
<path d="M-12 -22C10 -32 30 -30 50 -25C66 -20 80 -13 92 -7" fill="none" stroke="#ffffff" stroke-opacity="0.75" stroke-width="2.4"/>
<path d="M88 12C72 32 42 42 8 48M78 16C68 40 50 58 26 68" fill="none" stroke="${gold}" stroke-width="2.2" stroke-linecap="round"/>
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

  // Mirror: bronze disc, concentric relief, eight magatama on the rim.
  const [mx, my, mr] = [1290, 470, 116];
  let magatama = '';
  for (let i = 0; i < 8; i++) {
    const [qx, qy] = polar(mx, my, mr - 14, i * 45 - 90);
    magatama += `<path d="M${qx} ${qy}m5 0a5 5 0 1 0 -10 0c0 6 4 9 9 10c-3 -3 -3 -6 1 -10z" transform="rotate(${i * 45} ${qx} ${qy})"/>`;
  }
  let rays = '';
  for (let i = 0; i < 24; i++) {
    const [x1, y1] = polar(mx, my, mr + 18, i * 15);
    const [x2, y2] = polar(mx, my, mr + (i % 3 ? 50 : 110), i * 15);
    rays += `M${x1} ${y1}L${x2} ${y2}`;
  }

  // Shrine gate: black kasagi with upswept ends over a vermilion shimaki,
  // the nuki tie beam, the central gakuzuka and slightly raked pillars.
  const torii = `<path d="M1030 136C1080 170 1200 180 1290 180C1380 180 1500 170 1550 136L1546 162C1500 192 1380 202 1290 202C1200 202 1080 192 1034 162Z" fill="${ink}"/>
<path d="M1034 162C1080 192 1200 202 1290 202C1380 202 1500 192 1546 162" fill="none" stroke="${mix(gold, '#ffffff', 0.3)}" stroke-opacity="0.35" stroke-width="2"/>
<path d="M1060 192C1150 210 1430 210 1520 192L1514 214C1430 226 1150 226 1066 214Z" fill="url(#dbtefx-mt-lacq)"/>
<path d="M1276 222H1304V286H1276ZM1096 286H1484V312H1096Z" fill="url(#dbtefx-mt-lacq)"/>
<path d="M1126 222H1160L1168 900H1116ZM1420 222H1454L1464 900H1412Z" fill="url(#dbtefx-mt-pillar)"/>
<path d="M1116 840H1168V900H1116ZM1412 840H1464V900H1412Z" fill="${ink}"/>
<path d="M1060 192C1150 210 1430 210 1520 192M1096 287H1484" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5"/>`;

  // Sword: straight double-edged tsurugi, point down, ring pommel.
  const sword = `<g ${anim('bob', 7, 0, 'ease-in-out')}><g transform="translate(0 110)">
<path d="M1290 352L1300 370V680L1290 716L1280 680V370Z" fill="url(#dbtefx-mt-blade)"/>
<path d="M1290 370V706" stroke="#ffffff" stroke-opacity="0.7" stroke-width="1.2"/>
<path d="M1260 342H1320L1312 356H1268Z" fill="${gold}"/><path d="M1260 342H1320" stroke="#ffffff" stroke-opacity="0.5"/>
<rect x="1285" y="282" width="10" height="60" rx="2" fill="${mix(gold, t.bg, 0.5)}"/>
<path d="M1285 292l10 8M1285 304l10 8M1285 316l10 8M1285 328l10 8" stroke="${gold}" stroke-width="1.6"/>
<circle cx="1290" cy="268" r="12" fill="none" stroke="${gold}" stroke-width="4.5"/>
</g></g>`;

  // Shimenawa: twisted straw rope, fat in the middle, with shide and tassels.
  const ropeAt = (u) => [-30 + u * 1660, 30 + Math.sin(u * Math.PI) * 54];
  const ropePts = Array.from({ length: 81 }, (_, i) => ropeAt(i / 80));
  const rope = ribbonOf(ropePts, (i) => 16 + Math.sin((i / 80) * Math.PI) * 22);
  const ropeShape = `M${join(rope.back)}L${join(rope.belly.slice().reverse())}Z`;
  let twist = '';
  for (let i = 0; i < 79; i++) twist += `M${rope.back[i][0]} ${rope.back[i][1]}Q${n1(ropePts[i + 1][0] + 3)} ${n1(ropePts[i + 1][1])} ${rope.belly[i + 2][0]} ${rope.belly[i + 2][1]}`;
  let shide = '';
  [0.12, 0.3, 0.5, 0.7, 0.88].forEach((s, i) => {
    const [x, y0] = ropeAt(s);
    const y = n1(y0 + 14);
    shide += `<g style="transform-origin: ${x}px ${y}px; animation: dbtefx-reed ${n1(4.5 + i * 0.6)}s ease-in-out ${-i * 1.3}s infinite;"><path d="M${n1(x - 11)} ${y}h20l14 22h-18l14 22h-18l14 22h-18l14 22h-20l-14 -22h18l-14 -22h18l-14 -22h18Z" fill="${t.text}"/><path d="M${n1(x + 9)} ${y}l14 22h-18l14 22h-18l14 22h-18l14 22" fill="none" stroke="${ink}" stroke-opacity="0.18" stroke-width="3"/></g>`;
  });
  let fringe = '';
  for (let i = 0; i < 9; i++) {
    const [x, y] = ropeAt(0.2 + i * 0.075);
    fringe += `M${x} ${n1(y + 14)}v${n1(18 + (i % 3) * 8)}`;
  }

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
  [[520, 120, 7, 3], [1480, 60, 11, 7.5]].forEach(([x, y, seed, delay]) => {
    const r = rng(seed);
    let d = `M${x} ${y}`;
    let [cx, cy] = [x, y];
    for (let i = 0; i < 8; i++) {
      cx += (r() - 0.5) * 56;
      cy += 20 + r() * 16;
      d += `L${n1(cx)} ${n1(cy)}`;
      if (i === 3) d += `M${n1(cx)} ${n1(cy)}l${n1(30 + r() * 20)} ${n1(26 + r() * 10)}l${n1(-6)} ${n1(24)}M${n1(cx)} ${n1(cy)}`;
    }
    bolts += `<path d="${d}" fill="none" stroke="${bolt}" stroke-width="2.4" stroke-linejoin="bevel" style="animation: dbtefx-mt-bolt 9s linear ${-delay}s infinite;"/>`;
  });

  return `<style>@keyframes dbtefx-mt-bolt { 0%, 90%, 94%, 100% { opacity: 0; } 91%, 93% { opacity: 1; } 92% { opacity: 0.2; } }</style>
<defs>
<linearGradient id="dbtefx-mt-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${storm}"/><stop offset="0.65" stop-color="${mix(storm, t.bg, 0.55)}"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-mt-lit" cx="0.45" cy="0.2" r="0.8"><stop offset="0" stop-color="${bolt}" stop-opacity="0.3"/><stop offset="0.6" stop-color="${bolt}" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.3"/></radialGradient>
<radialGradient id="dbtefx-mt-halo"><stop offset="0" stop-color="${gold}" stop-opacity="0.55"/><stop offset="0.4" stop-color="${gold}" stop-opacity="0.14"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-mt-disc" cx="0.4" cy="0.35"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.3" stop-color="${mix(gold, '#ffffff', 0.45)}"/><stop offset="1" stop-color="${mix(gold, t.bg, 0.5)}"/></radialGradient>
<radialGradient id="dbtefx-mt-eye"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.85"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-mt-blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.text, t.opp, 0.35)}"/><stop offset="0.5" stop-color="#ffffff"/><stop offset="0.52" stop-color="${mix(t.text, t.opp, 0.2)}"/><stop offset="1" stop-color="${mix(t.text, t.bg, 0.55)}"/></linearGradient>
<linearGradient id="dbtefx-mt-lacq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.15)}"/><stop offset="1" stop-color="${mix(t.accent, t.bg, 0.45)}"/></linearGradient>
<linearGradient id="dbtefx-mt-pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.accent, t.bg, 0.55)}"/><stop offset="0.6" stop-color="${t.accent}"/><stop offset="1" stop-color="${mix(t.accent, t.bg, 0.25)}"/></linearGradient>
<linearGradient id="dbtefx-mt-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(storm, t.text, 0.25)}" stop-opacity="0"/><stop offset="0.5" stop-color="${mix(storm, t.text, 0.25)}" stop-opacity="0.28"/><stop offset="1" stop-color="${mix(storm, t.text, 0.25)}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-mt-rope" gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="110"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.3)}"/><stop offset="1" stop-color="${mix(gold, t.bg, 0.5)}"/></linearGradient>

<linearGradient id="dbtefx-mt-fg" gradientUnits="userSpaceOnUse" x1="250" y1="0" x2="1000" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.75"/><stop offset="0.45" stop-color="#ffffff" stop-opacity="0.4"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<mask id="dbtefx-mt-fade" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1600" height="900"><rect x="-200" y="-200" width="1600" height="900" fill="url(#dbtefx-mt-fg)"/></mask>
</defs>
<rect width="${W}" height="620" fill="url(#dbtefx-mt-sky)"/>
${cloud(-40, 250, 760, 110, 3, mix(storm, t.bg, 0.25))}${cloud(860, 190, 800, 100, 5, mix(storm, t.bg, 0.3))}
${bolts}
${cloud(-60, 420, 900, 90, 21, mix(storm, t.bg, 0.4))}${cloud(700, 400, 960, 80, 23, mix(storm, t.bg, 0.45))}
<path d="M0 640L120 560L230 600L380 500L520 590L640 540L760 610L900 520L1040 600L1200 540L1380 610L1520 530L1600 580V${H}H0Z" fill="${mix(storm, t.bg, 0.62)}"/>
<rect y="560" width="${W}" height="150" fill="url(#dbtefx-mt-mist)"/>
<path d="${forest}" fill="${mix(storm, t.bg, 0.8)}"/>
<path d="M0 720L180 650L340 700L520 640L700 700L880 660L1060 710L1240 670L1420 710L1600 660V${H}H0Z" fill="${mix(storm, t.bg, 0.82)}"/>
<!--mid-->
<g mask="url(#dbtefx-mt-fade)"><path d="${crest}" fill="${gold}"/>
<path d="${backHalf}" fill="${mix(ivory, storm, 0.42)}"/>
<path d="${bellyHalf}" fill="${mix(ivory, gold, 0.12)}"/>
<path d="${scutes}" stroke="${mix(storm, t.bg, 0.3)}" stroke-opacity="0.35" stroke-width="1.6"/>
<path d="M${rim}" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>
<path d="M${join(back)}" fill="none" stroke="${mix(storm, t.bg, 0.4)}" stroke-opacity="0.6" stroke-width="1.5"/></g>
${cloud(160, 452, 420, 70, 13, mix(storm, t.bg, 0.2))}${cloud(640, 250, 280, 56, 17, mix(storm, t.bg, 0.15))}
<g transform="translate(-60 0)">
<circle cx="${mx}" cy="${my}" r="360" fill="url(#dbtefx-mt-halo)" ${anim('bloom', 8, 0, 'ease-in-out')}/>
<path d="${rays}" stroke="${gold}" stroke-opacity="0.3" stroke-width="1.6" style="transform-origin: ${mx}px ${my}px; animation: dbtefx-spin 120s linear infinite;"/>
${torii}
<circle cx="${mx}" cy="${my}" r="${mr + 10}" fill="${mix(gold, t.bg, 0.5)}"/>
<circle cx="${mx}" cy="${my}" r="${mr}" fill="url(#dbtefx-mt-disc)"/>
<circle cx="${mx}" cy="${my}" r="${mr - 26}" fill="none" stroke="${mix(gold, t.bg, 0.4)}" stroke-opacity="0.6" stroke-width="2"/>
<circle cx="${mx}" cy="${my}" r="${mr - 34}" fill="none" stroke="${mix(gold, t.bg, 0.4)}" stroke-opacity="0.4" stroke-dasharray="3 5"/>
<g fill="${mix(gold, t.bg, 0.35)}">${magatama}</g>
<ellipse cx="${mx - 34}" cy="${my - 40}" rx="40" ry="16" fill="#ffffff" fill-opacity="0.3" transform="rotate(-35 ${mx - 34} ${my - 40})"/>
${sword}
</g>
<rect y="700" width="${W}" height="140" fill="url(#dbtefx-mt-mist)" ${anim('drift', 26, 0, 'ease-in-out')}/>
${head}
<!--near-->
<path d="${fringe}" stroke="${mix(gold, t.bg, 0.3)}" stroke-width="3" stroke-linecap="round"/>
<path d="${ropeShape}" fill="url(#dbtefx-mt-rope)"/>
<path d="${twist}" fill="none" stroke="${mix(gold, t.bg, 0.65)}" stroke-width="2.2"/>
<path d="M${join(rope.back)}" fill="none" stroke="${mix(gold, '#ffffff', 0.5)}" stroke-opacity="0.6" stroke-width="2"/>
${shide}`;
};

export default mitsurugi;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 40, colors: ['accent2', 'text'] }, { kind: 'flash', count: 1, colors: ['opp'] }];
