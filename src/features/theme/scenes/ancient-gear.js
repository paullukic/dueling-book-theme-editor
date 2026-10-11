import { mix } from '../../../lib/color.js';
import { n1, polar } from './kit.js';

// Ancient Gear: Dr. Crowler's clockwork colossus. Behind it the Ancient Gear
// Castle's great wheel turns against a forge-lit dusk, the castle's green-grey
// keep on the horizon. The Ancient Gear Golem stands frontal and monumental,
// riveted bronze plates gone green at the seams, one red eye in its grille,
// and the meshing gears of its open chest engine turning as it idles.
const ancientGear = (t) => {
  const bronzeHi = mix(t.accent, t.text, 0.3);
  const brass = t.accent;
  const bronze = mix(t.accent, t.bg, 0.45);
  const bronzeDeep = mix(t.accent, t.bg, 0.78);
  const ink = mix(t.bg, '#000000', 0.45);
  const patina = t.accent2;
  const forge = t.warning;
  const eye = t.danger;
  const cx = 1410;

  // A spur gear: trapezoid teeth on a rim, a hub and round lightening holes.
  const gear = (gx, gy, r, teeth, holes = 0, phase = 0) => {
    const depth = Math.max(8, r * 0.16);
    const step = 360 / teeth;
    let d = '';
    for (let i = 0; i < teeth; i++) {
      const a = phase + i * step;
      const pts = [
        polar(gx, gy, r - depth, a - step * 0.5),
        polar(gx, gy, r - depth, a - step * 0.28),
        polar(gx, gy, r, a - step * 0.17),
        polar(gx, gy, r, a + step * 0.17),
        polar(gx, gy, r - depth, a + step * 0.28),
      ];
      d += `${i ? 'L' : 'M'}${pts.map((p) => p.join(' ')).join('L')}`;
    }
    d += 'Z';
    const hub = r * 0.22;
    d += `M${n1(gx + hub)} ${gy}A${n1(hub)} ${n1(hub)} 0 1 0 ${n1(gx - hub)} ${gy}A${n1(hub)} ${n1(hub)} 0 1 0 ${n1(gx + hub)} ${gy}Z`;
    for (let i = 0; i < holes; i++) {
      const [hx, hy] = polar(gx, gy, r * 0.55, phase + 90 / holes + (i * 360) / holes);
      const hr = r * 0.17;
      d += `M${n1(hx + hr)} ${hy}A${n1(hr)} ${n1(hr)} 0 1 0 ${n1(hx - hr)} ${hy}A${n1(hr)} ${n1(hr)} 0 1 0 ${n1(hx + hr)} ${hy}Z`;
    }
    return d;
  };
  const spin = (gx, gy, dur, reverse, body) =>
    `<g style="transform-origin: ${gx}px ${gy}px; animation: dbtefx-spin ${dur}s linear infinite${reverse ? ' reverse' : ''};">${body}</g>`;

  // Mirror a left-half path across the Golem's centre line (local x 0).
  const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${n1(-x)} ${y}`).replace(/H(-?\d+(?:\.\d+)?)/g, (m, x) => `H${n1(-x)}`);
  const both = (d) => d + mirror(d);
  const rivets = (pts, r = 4) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}"/><circle cx="${n1(-x)}" cy="${y}" r="${r}"/>`).join('');
  const along = (x0, y0, x1, y1, n) => Array.from({ length: n }, (_, i) => [n1(x0 + ((x1 - x0) * i) / (n - 1)), n1(y0 + ((y1 - y0) * i) / (n - 1))]);

  // The Golem (local x around the centre line, absolute y).
  const g = {
    pauldron: 'M-118 352C-160 330 -226 340 -252 396C-268 432 -266 478 -248 514L-136 498C-124 452 -118 404 -118 352Z',
    lamella: 'M-250 512C-260 540 -258 574 -244 600L-156 594C-150 566 -146 530 -138 498Z',
    arm: 'M-246 596C-264 650 -268 700 -258 744L-160 748C-154 700 -150 650 -148 600Z',
    forearm: 'M-268 784C-280 832 -280 876 -272 1010H-150C-152 880 -154 832 -156 786Z',
    cuirass: 'M0 356H-122C-136 430 -146 512 -142 590C-112 628 -60 646 0 650Z',
    band1: 'M0 660H-128L-122 720Q-64 734 0 736Z',
    band2: 'M0 744H-120L-116 800Q-60 812 0 814Z',
    band3: 'M0 822H-114L-112 1010H0Z',
    collar: 'M0 318H-76L-90 368H0Z',
    head: 'M0 172C-42 172 -70 196 -74 238L-76 300C-62 320 -32 330 0 330Z',
    visor: 'M0 240H-48L-52 298C-36 308 -16 310 0 310Z',
  };
  let grille = '';
  for (let x = -40; x <= 40; x += 10) grille += `M${x} 244V${n1(306 - Math.abs(x) * 0.08)}`;

  // Chest engine: a 16-tooth drive gear meshing with an 8-tooth pinion (2:1),
  // phased so a tooth of one sits in a gap of the other at the contact point.
  const [ax, ay, ar] = [cx, 506, 66];
  const contact = -140;
  const [bx, by] = polar(ax, ay, 66 + 34 - 9, contact);
  const phaseA = contact;
  const phaseB = contact + 180 + 180 / 8;
  const engine = `<circle cx="${ax}" cy="${ay}" r="92" fill="${ink}" stroke="${bronzeDeep}" stroke-width="6"/>
<circle cx="${bx}" cy="${by}" r="44" fill="${ink}"/>
${spin(ax, ay, 48, false, `<path d="${gear(ax, ay, ar, 16, 5, phaseA)}" fill="url(#dbtefx-ag-gear)" fill-rule="evenodd" stroke="${bronzeDeep}" stroke-width="2"/>`)}
${spin(bx, by, 24, true, `<path d="${gear(bx, by, 34, 8, 0, phaseB)}" fill="url(#dbtefx-ag-gear)" fill-rule="evenodd" stroke="${bronzeDeep}" stroke-width="2"/>`)}
<circle cx="${ax}" cy="${ay}" r="9" fill="${bronzeHi}"/><circle cx="${bx}" cy="${by}" r="5" fill="${bronzeHi}"/>
<circle cx="${ax}" cy="${ay}" r="92" fill="url(#dbtefx-ag-socket)"/>`;

  const golem = `<g transform="translate(1322 110) scale(0.86) translate(-${cx} -110)"><g transform="translate(${cx} 0)">
<path d="${both(g.forearm)}" fill="url(#dbtefx-ag-plate)" stroke="${bronzeDeep}" stroke-width="3"/>
<path d="${both(g.arm)}" fill="url(#dbtefx-ag-plate)" stroke="${bronzeDeep}" stroke-width="3"/>
${[-1, 1].map((k) => `<circle cx="${k * 210}" cy="766" r="40" fill="${ink}"/>${spin(k * 210, 766, 30, k > 0, `<path d="${gear(k * 210, 766, 36, 10, 0, k * 9)}" fill="url(#dbtefx-ag-gear)" fill-rule="evenodd" stroke="${bronzeDeep}" stroke-width="2"/>`)}<circle cx="${k * 210}" cy="766" r="7" fill="${bronzeHi}"/>`).join('')}
<path d="${both(g.band3)}" fill="url(#dbtefx-ag-plate)" stroke="${bronzeDeep}" stroke-width="3"/>
<path d="${both(g.band2)}" fill="url(#dbtefx-ag-plate)" stroke="${bronzeDeep}" stroke-width="3"/>
<path d="${both(g.band1)}" fill="url(#dbtefx-ag-plate)" stroke="${bronzeDeep}" stroke-width="3"/>
<path d="${both(g.cuirass)}" fill="url(#dbtefx-ag-plate)" stroke="${bronzeDeep}" stroke-width="3"/>
<path d="${both(g.collar)}" fill="${bronzeDeep}"/>
<path d="${both(g.lamella)}" fill="url(#dbtefx-ag-plate)" stroke="${bronzeDeep}" stroke-width="3"/>
<path d="${both(g.pauldron)}" fill="url(#dbtefx-ag-plate)" stroke="${bronzeDeep}" stroke-width="3"/>
<path d="${mirror('M-240 404C-220 366 -180 352 -140 356M-252 520C-226 512 -190 508 -150 510')}" fill="none" stroke="${bronzeHi}" stroke-opacity="0.75" stroke-width="3" stroke-linecap="round"/>
<path d="${mirror('M-136 372C-144 450 -150 520 -146 586M-258 600C-268 650 -270 700 -260 744M-272 790C-280 840 -280 880 -276 930')}" fill="none" stroke="${brass}" stroke-opacity="0.8" stroke-width="2.5"/>
<path d="${both(g.head)}" fill="url(#dbtefx-ag-plate)" stroke="${bronzeDeep}" stroke-width="3"/>
<path d="M-8 174H8V238H-8Z" fill="${bronze}" stroke="${bronzeDeep}" stroke-width="2"/>
<path d="${both(g.visor)}" fill="${ink}"/>
<path d="${grille}" stroke="${bronzeDeep}" stroke-width="4"/>
<path d="${mirror('M-70 232C-66 200 -40 178 -8 174')}" fill="none" stroke="${bronzeHi}" stroke-opacity="0.8" stroke-width="2.5" stroke-linecap="round"/>
<g fill="${bronzeHi}" stroke="${bronzeDeep}" stroke-width="1.5">${rivets([...along(-236, 420, -150, 380, 4), ...along(-118, 380, -132, 570, 6), [-110, 690], [-60, 690], [-110, 760], [-60, 760], ...along(-238, 612, -238, 730, 3), ...along(-252, 806, -252, 900, 3), [-60, 196], [-62, 290]])}</g>
<g fill="${patina}" fill-opacity="0.28"><path d="${both('M-150 380C-148 404 -142 426 -146 452C-136 430 -138 404 -142 380Z')}"/><path d="${both('M-96 650C-96 668 -90 684 -94 704C-86 686 -86 668 -88 650Z')}"/><path d="${both('M-230 512C-232 530 -226 546 -230 566C-222 548 -222 530 -222 512Z')}"/><path d="M-30 330C-30 344 -24 352 -28 366C-20 352 -22 342 -22 330Z"/></g>
</g>
${engine}
<g style="animation: dbtefx-ag-eye 6s ease-in-out infinite;">
<ellipse cx="${cx + 20}" cy="268" rx="60" ry="34" fill="url(#dbtefx-ag-eyeglow)"/>
<path d="M${cx + 8} 262H${cx + 32}L${cx + 28} 274H${cx + 12}Z" fill="${eye}"/>
<path d="M${cx + 12} 264H${cx + 27}" stroke="${mix(eye, '#ffffff', 0.6)}" stroke-width="2"/>
</g>
</g>`;

  // The castle's great wheel and its pinion, behind the Golem's shoulders.
  const [wx, wy, wr] = [1430, 120, 250];
  const [px, py] = polar(wx, wy, 250 + 110 - 2 * 24, 214);
  const wheel = `${spin(wx, wy, 220, false, `<path d="${gear(wx, wy, wr, 30, 6, 0)}" fill="${mix(t.bg, t.accent, 0.13)}" fill-rule="evenodd" stroke="${brass}" stroke-opacity="0.22" stroke-width="2.5"/><circle cx="${wx}" cy="${wy}" r="${n1(wr * 0.78)}" fill="none" stroke="${brass}" stroke-opacity="0.12" stroke-width="2"/>`)}
${spin(px, py, 88, true, `<path d="${gear(px, py, 110, 12, 4, 15)}" fill="${mix(t.bg, t.accent, 0.1)}" fill-rule="evenodd" stroke="${brass}" stroke-opacity="0.18" stroke-width="2"/>`)}`;

  // The Ancient Gear Castle: a green-grey keep on its crag, fading into the forge haze.
  const tower = (x, w, top, cone) => {
    let merlons = '';
    for (let mx = x + 2; mx < x + w - 6; mx += 12) merlons += `M${mx} ${top}v-9h7v9z`;
    const roof = cone ? `M${x - 6} ${top}L${x + w / 2} ${top - cone}L${x + w + 6} ${top}Z` : merlons;
    return `M${x} ${top}H${x + w}V900H${x}Z${roof}`;
  };
  const keep = [tower(170, 46, 560, 64), tower(206, 150, 620, 0), tower(340, 70, 520, 0), tower(400, 120, 640, 0), tower(508, 40, 590, 52), tower(540, 170, 700, 0)].join('');
  const castle = `<path d="M0 900V740C120 720 220 700 330 706C470 714 620 740 820 790V900Z${keep}" fill="url(#dbtefx-ag-keep)" fill-opacity="0.5"/>
${spin(375, 560, 140, false, `<path d="${gear(375, 560, 30, 10, 0, 0)}" fill="${mix(t.bg, t.accent2, 0.22)}" fill-opacity="0.5" fill-rule="evenodd"/>`)}
<g fill="${mix(t.bg, forge, 0.5)}" fill-opacity="0.75"><rect x="190" y="600" width="6" height="14"/><rect x="226" y="660" width="5" height="12"/><rect x="430" y="676" width="5" height="12"/><rect x="520" y="626" width="5" height="11"/></g>`;

  return `<defs>
<linearGradient id="dbtefx-ag-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.bg}"/><stop offset="0.62" stop-color="${mix(t.bg, forge, 0.1)}"/><stop offset="1" stop-color="${mix(t.bg, forge, 0.22)}"/></linearGradient>
<linearGradient id="dbtefx-ag-keep" x1="0" y1="0" x2="0" y2="1"><stop offset="0.5" stop-color="${mix(t.bg, t.accent2, 0.2)}"/><stop offset="1" stop-color="${mix(t.bg, forge, 0.12)}"/></linearGradient>
<radialGradient id="dbtefx-ag-forge" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${forge}" stop-opacity="0.32"/><stop offset="0.5" stop-color="${forge}" stop-opacity="0.1"/><stop offset="1" stop-color="${forge}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-ag-plate" cx="0.66" cy="0.24" r="0.9"><stop offset="0" stop-color="${bronzeHi}"/><stop offset="0.38" stop-color="${bronze}"/><stop offset="0.8" stop-color="${bronzeDeep}"/><stop offset="1" stop-color="${ink}"/></radialGradient>
<radialGradient id="dbtefx-ag-gear" cx="0.4" cy="0.3" r="0.8"><stop offset="0" stop-color="${mix(brass, '#ffffff', 0.2)}"/><stop offset="0.6" stop-color="${brass}"/><stop offset="1" stop-color="${bronze}"/></radialGradient>
<radialGradient id="dbtefx-ag-socket" cx="0.5" cy="0.5" r="0.5"><stop offset="0.7" stop-color="${ink}" stop-opacity="0"/><stop offset="1" stop-color="${ink}" stop-opacity="0.7"/></radialGradient>
<radialGradient id="dbtefx-ag-eyeglow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${eye}" stop-opacity="0.75"/><stop offset="1" stop-color="${eye}" stop-opacity="0"/></radialGradient>
</defs>
<style>@keyframes dbtefx-ag-eye { 0%, 100% { opacity: 0.7; } 45% { opacity: 1; } 55% { opacity: 0.85; } }</style>
<rect width="1600" height="900" fill="url(#dbtefx-ag-sky)"/>
<ellipse cx="1360" cy="560" rx="560" ry="420" fill="url(#dbtefx-ag-forge)"/>
${wheel}
${castle}
<!--mid-->
${golem}
<!--near-->
`;
};

export default ancientGear;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'spark', count: 22, colors: ['warning', 'accent'] },
  { kind: 'ash', count: 40, colors: ['muted'] },
];
