import { mix } from '../../../lib/color.js';
import { anim, H, n1, W } from './kit.js';

// Trap Card: a face-up Trap card springs open at the right, held over a
// trap hole by iron chains anchored in the corners and the right edge. The
// card's activation pulse rolls out, the chains strain, the hole breathes.

const cx = 1268; // card centre
const cy = 392;
const hy = 792; // trap hole centre

const trap = (t) => {
  const plum = mix(mix(t.accent, t.opp, 0.14), t.bg, 0.36); // Trap frame, toward #9a2a7a
  const pale = mix(t.accent, '#ffffff', 0.55);
  const iron = mix(t.bg, t.muted, 0.32);
  const ironHi = mix(iron, '#ffffff', 0.35);
  const ironLo = mix(t.bg, '#000000', 0.5);
  const rim = mix(iron, t.accent, 0.45); // magenta light catching the steel

  // A chain from (x1, y1) to (x2, y2), sagging by `sag`: links alternate face-on
  // (a ring with a hole) and edge-on (a bar), each shaded like forged iron.
  const chain = (x1, y1, x2, y2, sag, size, delay) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 + sag;
    const pt = (u) => [(1 - u) ** 2 * x1 + 2 * (1 - u) * u * mx + u * u * x2, (1 - u) ** 2 * y1 + 2 * (1 - u) * u * my + u * u * y2];
    const pts = [];
    let len = 0;
    let prev = pt(0);
    for (let i = 0; i <= 200; i++) {
      const p = pt(i / 200);
      len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
      pts.push([p, len]);
      prev = p;
    }
    const step = size * 1.55;
    const L = size * 2.3;
    const R = size * 0.85;
    let face = '';
    let edge = '';
    let k = 0;
    let j = 0;
    for (let d = step / 2; d < len; d += step, k++) {
      while (j < pts.length - 2 && pts[j][1] < d) j++;
      const [[ax, ay]] = pts[Math.max(0, j - 1)];
      const [[bx, by]] = pts[j];
      const ang = n1((Math.atan2(by - ay, bx - ax) * 180) / Math.PI);
      const tr = `transform="translate(${n1(bx)} ${n1(by)}) rotate(${ang})"`;
      if (k % 2) {
        edge += `<g ${tr}><rect x="${n1(-L / 2)}" y="${n1(-size * 0.28)}" width="${n1(L)}" height="${n1(size * 0.56)}" rx="${n1(size * 0.28)}" fill="url(#dbtefx-tr-bar)" stroke="${ironLo}" stroke-width="1.5"/></g>`;
      } else {
        face += `<g ${tr}><rect x="${n1(-L / 2)}" y="${n1(-R)}" width="${n1(L)}" height="${n1(R * 2)}" rx="${n1(R)}" fill="none" stroke="${ironLo}" stroke-width="${n1(size * 0.62)}"/><rect x="${n1(-L / 2)}" y="${n1(-R)}" width="${n1(L)}" height="${n1(R * 2)}" rx="${n1(R)}" fill="none" stroke="url(#dbtefx-tr-ring)" stroke-width="${n1(size * 0.44)}"/><path d="M${n1(-L / 2 + R)} ${n1(-R)}H${n1(L / 2 - R)}" stroke="${ironHi}" stroke-opacity="0.75" stroke-width="${n1(size * 0.12)}" stroke-linecap="round"/></g>`;
      }
    }
    return `<g style="animation: dbtefx-tr-strain ${n1(4.6 + delay)}s ease-in-out ${n1(-delay)}s infinite;">${face}${edge}</g>`;
  };

  // The Trap card: frame, name bar, art window with a gaping pit, text box.
  const card = `<g transform="rotate(4) scale(1.12)">
<rect x="-80" y="-114" width="160" height="228" rx="6" transform="translate(6 6)" fill="#000000" fill-opacity="0.55"/>
<rect x="-80" y="-114" width="160" height="228" rx="6" fill="url(#dbtefx-tr-frame)" stroke="${pale}" stroke-opacity="0.55" stroke-width="1.4"/>
<rect x="-66" y="-102" width="132" height="18" rx="1.5" fill="${mix(plum, '#ffffff', 0.12)}" stroke="#000000" stroke-opacity="0.4"/>
<circle cx="54" cy="-93" r="7" fill="${plum}" stroke="${pale}" stroke-width="1"/>
<path d="M50 -96L58 -90M58 -96L50 -90" stroke="#ffffff" stroke-width="1.3"/>
<rect x="-62" y="-76" width="124" height="124" fill="url(#dbtefx-tr-art)" stroke="#000000" stroke-opacity="0.65" stroke-width="2"/>
<g transform="translate(0 -6)"><ellipse rx="46" ry="20" fill="#000000" fill-opacity="0.85"/>
<g fill="none" stroke="${t.accent}"><ellipse rx="46" ry="20" stroke-width="2" stroke-opacity="0.9"/><ellipse ry="13" rx="30" stroke-opacity="0.5"/><ellipse ry="7" rx="16" stroke-opacity="0.35"/></g>
<path d="M-46 0C-40 30 -20 44 0 46C20 44 40 30 46 0" fill="none" stroke="${pale}" stroke-opacity="0.18"/></g>
<rect x="-66" y="56" width="132" height="46" fill="${mix(plum, t.text, 0.32)}" fill-opacity="0.85" stroke="#000000" stroke-opacity="0.4"/>
<path d="M-58 66H56M-58 75H60M-58 84H60M-58 93H24" stroke="${mix(t.bg, plum, 0.3)}" stroke-opacity="0.5" stroke-width="2"/>
<rect x="-80" y="-114" width="160" height="228" rx="6" fill="url(#dbtefx-tr-sheen)"/>
</g>`;

  return `<style>
@keyframes dbtefx-tr-strain { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(2px, -3px); } }
@keyframes dbtefx-tr-wave { 0% { transform: scale(0.6); opacity: 0; } 10% { opacity: 0.8; } 70%, 100% { transform: scale(1.5); opacity: 0; } }
@keyframes dbtefx-tr-lift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
</style>
<defs>
<linearGradient id="dbtefx-tr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.45)}"/><stop offset="0.6" stop-color="${mix(t.bg, plum, 0.1)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.25)}"/></linearGradient>
<radialGradient id="dbtefx-tr-halo" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="500"><stop offset="0" stop-color="${plum}" stop-opacity="0.55"/><stop offset="0.4" stop-color="${plum}" stop-opacity="0.14"/><stop offset="1" stop-color="${plum}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-tr-pit" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#000000"/><stop offset="0.7" stop-color="${mix(t.bg, '#000000', 0.6)}"/><stop offset="0.9" stop-color="${plum}" stop-opacity="0.7"/><stop offset="1" stop-color="${plum}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-tr-pitglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0.45" stop-color="${t.accent}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-tr-frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(plum, '#ffffff', 0.15)}"/><stop offset="0.55" stop-color="${plum}"/><stop offset="1" stop-color="${mix(plum, '#000000', 0.35)}"/></linearGradient>
<linearGradient id="dbtefx-tr-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0.28" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.4" stop-color="#ffffff" stop-opacity="0.14"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-tr-art" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="${mix(plum, t.bg, 0.3)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.4)}"/></radialGradient>
<linearGradient id="dbtefx-tr-ring" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ironHi}"/><stop offset="0.45" stop-color="${iron}"/><stop offset="0.8" stop-color="${mix(iron, '#000000', 0.4)}"/><stop offset="1" stop-color="${rim}"/></linearGradient>
<linearGradient id="dbtefx-tr-bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ironHi}"/><stop offset="0.5" stop-color="${iron}"/><stop offset="1" stop-color="${mix(iron, '#000000', 0.5)}"/></linearGradient>
<radialGradient id="dbtefx-tr-shade" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.65"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-tr-sky)"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-tr-halo)" ${anim('pulse', 7, 0, 'ease-in-out')}/>
<ellipse class="dbtefx-tr-rim" cx="${cx - 10}" cy="${hy}" rx="260" ry="62" fill="url(#dbtefx-tr-pitglow)" ${anim('pulse', 5, 0, 'ease-in-out')}/>
<ellipse class="dbtefx-tr-rim" cx="${cx - 10}" cy="${hy}" rx="186" ry="40" fill="url(#dbtefx-tr-pit)"/>
<g class="dbtefx-tr-rim" fill="none" stroke="${t.accent}"><ellipse cx="${cx - 10}" cy="${hy}" rx="176" ry="37" stroke-opacity="0.55" stroke-width="2"/><ellipse cx="${cx - 10}" cy="${hy + 4}" rx="130" ry="25" stroke-opacity="0.25"/></g>
<!--mid-->
${chain(1250, -30, cx - 16, cy - 104, 30, 13, 0)}
${chain(1640, -20, cx + 60, cy - 96, 50, 16, 1.1)}
${chain(1640, 470, cx + 76, cy + 20, 40, 15, 0.5)}
${chain(1640, 930, cx + 66, cy + 104, -30, 17, 1.7)}
${chain(cx - 10, hy - 6, cx - 6, cy + 112, 0, 12, 0.8)}
<g transform="translate(${cx} ${cy})"><g style="animation: dbtefx-tr-wave 6s cubic-bezier(0.2, 0.6, 0.3, 1) infinite;"><circle r="150" fill="none" stroke="${pale}" stroke-width="2.5"/></g>
<g style="animation: dbtefx-tr-wave 6s cubic-bezier(0.2, 0.6, 0.3, 1) -3s infinite;"><circle r="150" fill="none" stroke="${t.accent}" stroke-width="2"/></g>
<g style="animation: dbtefx-tr-lift 6s ease-in-out infinite;">${card}</g></g>
<!--near-->
<rect width="${W}" height="${H}" fill="url(#dbtefx-tr-shade)"/>`;
};

export default trap;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ember', count: 30, colors: ['accent', 'link'], speed: 0.5 },
  { kind: 'ash', count: 24, colors: ['muted'], speed: 0.4 },
];
