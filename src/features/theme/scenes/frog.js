import { mix } from '../../../lib/color.js';
import { anim, H, n1, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Frog: a moonlit pond. Notched lily pads in perspective, lotus blooms, and
// Des Frog, the real card artwork, on the big pad at the right edge. The art
// loads live from DuelingBook (cardart.js); without it the pond remains.
const frog = (t) => {
  const rand = rng(53);
  const horizon = 372;
  const sky = mix(t.bg, t.opp, 0.22);
  const moon = mix(t.text, t.warning, 0.18);
  const deep = mix(t.bg, '#000000', 0.45);
  const reedC = mix(t.bg, t.accent, 0.16);
  const ids = { n: 0 };

  // A lily pad seen at a low angle: wobbly ellipse, a notch to the centre,
  // radial veins, an upturned moonlit rim and a dark underside.
  const pad = (cx, cy, rx, notch, k = 0.34, tone = 0.3, flat = false) => {
    const ry = rx * k;
    const gap = 2.5 + rand() * 2.5;
    const n = rx < 80 ? 14 : 20;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const a = ((notch + gap + (i / n) * (360 - 2 * gap)) * Math.PI) / 180;
      const w = 1 + (rand() - 0.5) * 0.05;
      pts.push([Math.round(cx + Math.cos(a) * rx * w), Math.round(cy + Math.sin(a) * ry * w)]);
    }
    let d = `M${cx} ${cy}L${pts[0].join(' ')}`;
    for (let i = 1; i < n; i++) d += `Q${pts[i].join(' ')} ${Math.round((pts[i][0] + pts[i + 1][0]) / 2)} ${Math.round((pts[i][1] + pts[i + 1][1]) / 2)}`;
    d += `L${pts[n].join(' ')}Z`;
    const fill = mix(t.bg, t.accent, tone);
    if (flat || rx < 45) return `<path d="${d}" fill="${fill}"/>`;
    const id = `dbtefx-fr-p${ids.n++}`;
    let veins = '';
    if (rx > 60) {
      for (let a = notch + 22; a < notch + 340; a += 26 + rand() * 8) {
        const r = (a * Math.PI) / 180;
        veins += `M${cx} ${cy}l${Math.round(Math.cos(r) * rx * 0.88)} ${Math.round(Math.sin(r) * ry * 0.88)}`;
      }
    }
    const lift = n1(ry * 0.1);
    return `<ellipse cx="${cx}" cy="${n1(cy + ry * 0.3)}" rx="${n1(rx * 1.1)}" ry="${n1(ry * 1.1)}" fill="url(#dbtefx-fr-shade)"/>
<defs><path id="${id}" d="${d}"/></defs><use href="#${id}" fill="${mix(fill, '#000000', 0.55)}" y="${lift}"/>
<g transform="translate(0 ${-lift})"><use href="#${id}" fill="${fill}"/><use href="#${id}" fill="url(#dbtefx-fr-sheen)"/>
${veins ? `<path d="${veins}" stroke="${mix(fill, t.text, 0.4)}" stroke-opacity="0.28" stroke-width="${n1(rx / 130)}"/>` : ''}<use href="#${id}" fill="none" stroke="${mix(fill, moon, 0.5)}" stroke-opacity="0.5" stroke-width="${n1(Math.max(0.8, rx / 100))}"/></g>`;
  };

  // A lotus from the side: a back row and a front row of pointed petals.
  const petal = (x, y, h, wd, a, fill) =>
    `<path d="M${x} ${y}C${n1(x + wd)} ${n1(y - h * 0.3)} ${n1(x + wd * 0.55)} ${n1(y - h * 0.85)} ${x} ${n1(y - h)}C${n1(x - wd * 0.55)} ${n1(y - h * 0.85)} ${n1(x - wd)} ${n1(y - h * 0.3)} ${x} ${y}Z" transform="rotate(${a} ${x} ${y})" fill="${fill}"/>`;
  const lotus = (x, y, s, delay) => {
    const h = 46 * s;
    const wd = 15 * s;
    const back = [-62, -36, -12, 12, 36, 62].map((a) => petal(x, y, h * 0.92, wd, a, 'url(#dbtefx-fr-petal2)')).join('');
    const front = [-48, -20, 20, 48].map((a) => petal(x, y + 2 * s, h, wd * 1.1, a, 'url(#dbtefx-fr-petal)')).join('');
    return `<ellipse cx="${x}" cy="${n1(y - h * 0.45)}" rx="${n1(h * 1.5)}" ry="${n1(h * 1.1)}" fill="url(#dbtefx-fr-lglow)" ${anim('bloom', 6, delay, 'ease-in-out')}/>
${back}<ellipse cx="${x}" cy="${n1(y - h * 0.42)}" rx="${n1(wd * 0.8)}" ry="${n1(wd * 0.45)}" fill="${t.warning}" fill-opacity="0.85"/>${front}${petal(x, y + 3 * s, h * 1.05, wd * 1.15, 0, 'url(#dbtefx-fr-petal)')}`;
  };
  const bud = (x, y, h, lean) =>
    `<path d="M${x} ${y}Q${x + lean / 2} ${y - h / 2} ${x + lean} ${y - h}" stroke="${mix(t.bg, t.accent, 0.3)}" stroke-width="3" fill="none"/>${petal(x + lean, y - h + 6, 34, 10, lean / 6, 'url(#dbtefx-fr-petal)')}`;

  const ripple = (x, y, rx, delay, dur = 7) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${n1(rx * 0.3)}" fill="none" stroke="${moon}" stroke-opacity="0.45" stroke-width="1.6" ${anim('ripple', dur, delay, 'ease-out')}/>`;

  // Treeline on the far bank: overlapping crowns of uneven size.
  const bank = (y, lo, hi, seed) => {
    const r = rng(seed);
    let d = `M-20 ${y}`;
    let x = -20;
    while (x < W + 20) {
      const rad = lo + r() * (hi - lo) * (r() < 0.15 ? 2 : 1);
      x += rad * 1.6;
      d += `A${n1(rad)} ${n1(rad * 0.8)} 0 0 1 ${n1(x)} ${n1(y - r() * lo * 0.6)}`;
    }
    return `${d}V${horizon + 6}H-20Z`;
  };

  let stars = '';
  for (let i = 0; i < 44; i++) stars += `M${Math.round(rand() * W)} ${Math.round(rand() * 260)}h0`;
  // Moonlight broken on the water: tapered glints, narrow and fine at the
  // horizon, long toward us; three sets whose brightness is staggered.
  let shimmer = '';
  for (let g = 0; g < 3; g++) {
    let lens = '';
    for (let i = 0; i < 12; i++) {
      const y = horizon + 4 + ((i * 3 + g) / 36) ** 1.6 * 360;
      const depth = (y - horizon) / 360;
      const spread = 16 + depth * 150;
      const len = 6 + depth * (40 + rand() * 50);
      const th = 0.5 + depth * 2.2;
      const cx = 1100 + (rand() - 0.5) * spread * 1.6;
      lens += `M${n1(cx - len)} ${n1(y)}Q${n1(cx)} ${n1(y - th)} ${n1(cx + len)} ${n1(y)}Q${n1(cx)} ${n1(y + th)} ${n1(cx - len)} ${n1(y)}Z`;
    }
    shimmer += `<path d="${lens}" fill="${moon}" style="animation: dbtefx-fr-glint 3s ease-in-out ${-g}s infinite;"/>`;
  }
  let surface = '';
  for (let i = 0; i < 20; i++) {
    const y = horizon + 8 + (i / 20) ** 1.6 * 500;
    const x = rand() * W;
    surface += `M${n1(x)} ${n1(y)}h${n1(40 + rand() * 160 * (1 + i / 10))}`;
  }

  const cattail = (x, h, lean, delay) =>
    `<g style="transform-origin: ${x}px ${H}px; animation: dbtefx-reed ${n1(6 + rand() * 3)}s ease-in-out ${-delay}s infinite;"><path d="M${x} ${H}Q${x + lean * 0.4} ${H - h / 2} ${x + lean} ${H - h}" fill="none" stroke="${reedC}" stroke-width="5" stroke-linecap="round"/><rect x="${x + lean - 7}" y="${H - h + 10}" width="14" height="${n1(h * 0.16)}" rx="7" fill="${mix(t.bg, t.warning, 0.22)}" stroke="${moon}" stroke-opacity="0.25" transform="rotate(${n1(lean / 9)} ${x + lean} ${H - h})"/><path d="M${x + lean} ${H - h + 10}l${n1(lean / 30)} -26" stroke="${reedC}" stroke-width="2"/></g>`;
  const blade = (x, h, lean, wd) => `<path d="M${x - wd} ${H}Q${x + lean * 0.3} ${H - h * 0.6} ${x + lean} ${H - h}Q${x + lean * 0.2 + wd} ${H - h * 0.5} ${x + wd} ${H}Z"/>`;

  return `<style>${CARD_ART_KEYFRAMES}
@keyframes dbtefx-fr-glint { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.85; } }</style>
<defs>
<linearGradient id="dbtefx-fr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.bg}" stop-opacity="0"/><stop offset="1" stop-color="${sky}"/></linearGradient>
<linearGradient id="dbtefx-fr-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(sky, t.bg, 0.35)}"/><stop offset="0.5" stop-color="${mix(t.bg, t.opp, 0.08)}"/><stop offset="1" stop-color="${t.bg}"/></linearGradient>
<radialGradient id="dbtefx-fr-moon"><stop offset="0" stop-color="${moon}" stop-opacity="0.4"/><stop offset="0.3" stop-color="${moon}" stop-opacity="0.12"/><stop offset="1" stop-color="${moon}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-fr-disc" cx="0.42" cy="0.4"><stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="${moon}"/><stop offset="1" stop-color="${mix(moon, t.warning, 0.4)}"/></radialGradient>
<radialGradient id="dbtefx-fr-mist" cx="0.5" cy="0.5"><stop offset="0" stop-color="${mix(sky, t.text, 0.25)}" stop-opacity="0.35"/><stop offset="1" stop-color="${sky}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-fr-shade"><stop offset="0.5" stop-color="#000000" stop-opacity="0.45"/><stop offset="1" stop-color="#000000" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-fr-sheen" cx="0.68" cy="0.15" r="0.65"><stop offset="0" stop-color="${moon}" stop-opacity="0.32"/><stop offset="1" stop-color="${moon}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-fr-petal" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(t.accent2, t.bg, 0.35)}"/><stop offset="0.55" stop-color="${t.accent2}"/><stop offset="1" stop-color="${mix(t.accent2, '#ffffff', 0.65)}"/></linearGradient>
<linearGradient id="dbtefx-fr-petal2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(t.accent2, t.bg, 0.6)}"/><stop offset="1" stop-color="${mix(t.accent2, t.bg, 0.15)}"/></linearGradient>
<radialGradient id="dbtefx-fr-lglow"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${horizon}" fill="url(#dbtefx-fr-sky)"/>
<path d="${stars}" stroke="${t.text}" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round"/>
<circle cx="1100" cy="110" r="300" fill="url(#dbtefx-fr-moon)"/>
<circle cx="1100" cy="110" r="56" fill="url(#dbtefx-fr-disc)"/>
<g fill="${mix(moon, sky, 0.5)}" fill-opacity="0.06"><ellipse cx="1312" cy="150" rx="17" ry="13"/><ellipse cx="1350" cy="190" rx="13" ry="10"/><ellipse cx="1338" cy="146" rx="7" ry="6"/><ellipse cx="1305" cy="196" rx="8" ry="6"/></g>
<g id="dbtefx-fr-bank"><g fill="${mix(sky, t.bg, 0.5)}"><path d="${bank(horizon - 10, 12, 40, 7)}"/></g>
<path d="${bank(horizon, 8, 26, 11)}" fill="${deep}"/></g>
<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#dbtefx-fr-water)"/>
<use href="#dbtefx-fr-bank" transform="matrix(1 0 0 -0.6 0 ${n1(horizon * 1.6 + 6)})" opacity="0.4"/>
<path d="${surface}" stroke="${moon}" stroke-opacity="0.07" stroke-width="1.5"/>
<ellipse cx="1100" cy="${horizon + 140}" rx="240" ry="170" fill="url(#dbtefx-fr-moon)"/>
${shimmer}
<ellipse cx="420" cy="${horizon + 6}" rx="560" ry="30" fill="url(#dbtefx-fr-mist)" ${anim('drift', 30, 0, 'ease-in-out')}/>
<ellipse cx="1150" cy="${horizon + 12}" rx="480" ry="26" fill="url(#dbtefx-fr-mist)" ${anim('drift', 36, 12, 'ease-in-out')}/>
${pad(640, 391, 30, 60, 0.22, 0.2)}${pad(960, 398, 42, 300, 0.24, 0.22)}${pad(1012, 408, 26, 160, 0.24, 0.2)}${pad(1490, 396, 36, 250, 0.22, 0.22)}
${lotus(990, 398, 0.38, 2)}
<!--mid-->
${ripple(1400, 776, 320, 0, 9)}${ripple(1400, 776, 320, 4.5, 9)}${ripple(1140, 504, 120, 2, 8)}
${pad(1140, 500, 90, 200, 0.3, 0.27)}
${pad(1500, 640, 112, 110, 0.33, 0.3)}
${lotus(1130, 712, 1.1, 3)}
${pad(1150, 836, 130, 300, 0.36, 0.3)}
${pad(1400, 770, 290, 215, 0.33, 0.34)}
${cardArt(t, { id: 'dbtefx-fr-hero', card: CARDS.desFrog, x: 1040, y: 430, w: 440, h: 400, focus: [0.58, 0.58], zoom: 1.05, blend: 'normal', feather: 0.82, fade: 0.55, grade: 'saturate(0.85)', tint: mix(t.accent, t.bg, 0.25), tintAmt: 0.35, backdrop: mix(t.bg, t.accent, 0.1), backdropAmt: 0.5, glow: t.accent, breathe: 10 })}
<!--near-->
<g fill="${reedC}" stroke="${moon}" stroke-opacity="0.18">${blade(1490, 400, -40, 9)}${blade(1450, 300, 18, 8)}${blade(1530, 250, -30, 7)}</g>${cattail(1470, 500, -28, 2)}${cattail(1420, 410, -8, 0.7)}`;
};

export default frog;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'firefly', count: 44, colors: ['warning', 'accent'] }];
