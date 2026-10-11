import { mix } from '../../../lib/color.js';
import { n1, polar } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Ancient Gear: Dr. Crowler's clockwork colossus. Behind it the Ancient Gear
// Castle's great wheel turns against a forge-lit dusk, the castle's green-grey
// keep on the horizon. The Ancient Gear Golem itself is the real card artwork
// (loaded live from DuelingBook, cardart.js), graded bronze and standing in
// the forge glow before the wheel; offline the wheel and glow still stand.
const ancientGear = (t) => {
  const brass = t.accent;
  const forge = t.warning;

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

  // The Golem: the real card artwork, standing in the forge light before the wheel.
  const golem = cardArt(t, { id: 'dbtefx-ag-hero', card: CARDS.ancientGearGolem, x: 1130, y: 20, w: 400, h: 860, focus: [0.5, 0.45], zoom: 0.64, blend: 'multiply', feather: 0.85, fade: 0.6, grade: 'contrast(1.3) sepia(0.4)', tint: brass, tintAmt: 0.25, backdrop: mix(forge, t.bg, 0.45), backdropAmt: 0.9, glow: forge, breathe: 18 });

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
</defs>
<style>${CARD_ART_KEYFRAMES}</style>
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
