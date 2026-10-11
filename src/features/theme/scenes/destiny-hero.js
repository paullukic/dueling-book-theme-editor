import { mix } from '../../../lib/color.js';
import { n1, polar, rng } from './kit.js';

// Destiny HERO: midnight over Dark City. The Clock Tower Prison stands black
// against a blood moon, its second hand ticking toward midnight (fate, D-Time).
// Before it Destiny HERO - Dogma rises in black armour, bull horns swept up,
// bat wings spread, the chain across his chest, rim-lit in blood red. No face:
// an armoured silhouette carved out by the light behind him.
const destinyHero = (t) => {
  const rand = rng(23);
  const blood = t.accent;
  const bloodLit = mix(t.accent, '#ffffff', 0.35);
  const steel = t.accent2;
  const ink = mix(t.bg, '#000000', 0.5);
  const stone = mix(t.bg, t.accent2, 0.14);
  const stoneLit = mix(t.bg, t.accent2, 0.3);
  const fx = 1300;

  // Mirror a left-half path across the hero's centre line (local x 0).
  const mirror = (d) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${n1(-x)} ${y}`).replace(/H(-?\d+(?:\.\d+)?)/g, (m, x) => `H${n1(-x)}`);
  const both = (d) => d + mirror(d);

  // The clock tower: a stone shaft, corner pinnacles, a gable and a needle spire.
  const [kx, ky, kr] = [1330, 290, 92];
  const pinnacle = (x, top) => `M${x - 16} 900V${top + 40}L${x} ${top}L${x + 16} ${top + 40}V900Z`;
  const [tl, tr] = [kx - 120, kx + 120];
  const tower = `<path d="M${tl} 900V198H${tr}V900Z${pinnacle(tl - 8, 110)}${pinnacle(tr + 8, 110)}M${tl + 26} 200L${kx} 92L${tr - 26} 200ZM${kx - 16} 104L${kx} -30L${kx + 16} 104Z" fill="url(#dbtefx-dh-stone)"/>
<path d="M${tl + 26} 200L${kx} 92L${tr - 26} 200M${tl + 6} 198H${tr - 6}M${tl + 2} 410H${tr - 2}" fill="none" stroke="${stoneLit}" stroke-width="3"/>
<path d="M${tl - 8} 110V900M${tr + 8} 110V900M${kx} -30V92" stroke="${blood}" stroke-opacity="0.4" stroke-width="2"/>`;
  let ticks = '';
  for (let i = 0; i < 60; i++) {
    const [x1, y1] = polar(kx, ky, i % 5 ? kr - 7 : kr - 14, i * 6);
    const [x2, y2] = polar(kx, ky, kr - 2, i * 6);
    ticks += `M${x1} ${y1}L${x2} ${y2}`;
  }
  const roman = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  const numerals = roman
    .map((r, i) => {
      const [x, y] = polar(kx, ky, kr - 30, i * 30 - 90);
      return `<text x="${x}" y="${y}" transform="rotate(${i * 30} ${x} ${y})">${r}</text>`;
    })
    .join('');
  const hand = (len, w, tail) => `M${kx - w} ${ky + tail}L${kx - w * 0.6} ${ky - len * 0.7}L${kx} ${ky - len}L${kx + w * 0.6} ${ky - len * 0.7}L${kx + w} ${ky + tail}Z`;
  const rot = (deg, dur, timing, body) =>
    `<g transform="rotate(${deg} ${kx} ${ky})"><g style="transform-origin: ${kx}px ${ky}px; animation: dbtefx-spin ${dur}s ${timing} infinite;">${body}</g></g>`;
  const clock = `<circle cx="${kx}" cy="${ky}" r="${kr + 16}" fill="${ink}" stroke="${stoneLit}" stroke-width="4"/>
<circle cx="${kx}" cy="${ky}" r="${kr}" fill="url(#dbtefx-dh-face)"/>
<path d="${ticks}" stroke="${ink}" stroke-width="2.5"/>
<g fill="${ink}" font-family="Georgia, 'Times New Roman', serif" font-size="19" font-weight="700" text-anchor="middle" dominant-baseline="central">${numerals}</g>
<circle cx="${kx}" cy="${ky}" r="${kr - 44}" fill="none" stroke="${ink}" stroke-opacity="0.35" stroke-width="1.5"/>
<path d="${hand(52, 6, 10)}" fill="${ink}" transform="rotate(355 ${kx} ${ky})"/>
${rot(300, 900, 'linear', `<path d="${hand(80, 5, 14)}" fill="${ink}"/>`)}
${rot(0, 60, 'steps(60, end)', `<path d="M${kx - 1.5} ${ky + 22}V${ky - 88}H${kx + 1.5}V${ky + 22}Z" fill="${blood}"/><circle cx="${kx}" cy="${ky - 70}" r="5" fill="none" stroke="${blood}" stroke-width="2"/>`)}
<circle cx="${kx}" cy="${ky}" r="7" fill="${ink}" stroke="${blood}" stroke-width="2"/>`;

  // Dark City: gothic roofs and spires on the horizon, a few lancet windows lit.
  let city = '';
  let lit = '';
  for (let x = -20; x < 1240; ) {
    const w = 60 + rand() * 90;
    const top = n1(650 + rand() * 110);
    const roof = rand();
    city += `M${n1(x)} 900V${top}`;
    if (roof < 0.4) city += `L${n1(x + w / 2)} ${n1(top - 40 - rand() * 50)}L${n1(x + w)} ${top}`;
    else if (roof < 0.6) city += `H${n1(x + w * 0.4)}L${n1(x + w * 0.5)} ${n1(top - 130 - rand() * 60)}L${n1(x + w * 0.6)} ${top}H${n1(x + w)}`;
    else city += `H${n1(x + w)}`;
    city += `V900Z`;
    if (rand() < 0.45) lit += `<path d="M${n1(x + w * 0.5 - 4)} ${n1(top + 40)}v16h8v-16l-4-7z"/>`;
    x += w - 4;
  }

  // Dogma, waist up (local x around the centre line, absolute y).
  const d = {
    wing: 'M-90 632Q-130 520 -200 440Q-236 394 -250 336Q-232 415 -275 470Q-238 530 -250 582Q-210 610 -196 672Q-150 652 -110 704Z',
    horn: 'M-34 502C-82 500 -120 470 -128 398C-108 440 -82 462 -40 476Z',
    helm: 'M0 462L-30 470L-46 494L-50 538L-38 562L-16 582L0 590Z',
    gorget: 'M0 566H-44L-60 604H0Z',
    pauldron: 'M-48 592C-92 574 -152 582 -180 622C-192 642 -194 670 -186 692L-122 678C-106 642 -78 614 -48 604Z',
    spikes: 'M-140 586L-160 536L-128 584ZM-178 618L-222 598L-182 640ZM-104 580L-110 540L-88 582Z',
    chest: 'M0 598H-62C-108 616 -134 650 -132 700C-126 770 -102 830 -88 900H0Z',
    arm: 'M-190 690C-204 760 -206 830 -198 900H-138C-136 830 -134 760 -128 690Z',
  };
  const rim = 'M-128 398C-120 470 -82 500 -34 502M-46 494L-50 538L-38 562M-180 622C-192 642 -194 670 -186 692M-190 690C-204 760 -206 830 -198 900M-90 632Q-130 520 -200 440Q-236 394 -250 336M-250 336Q-232 415 -275 470Q-238 530 -250 582';
  let chain = '';
  for (let i = 0; i < 8; i++) {
    const [lx, ly] = [n1(-96 + i * 26), n1(612 + i * 34)];
    chain += i % 2
      ? `<ellipse cx="${lx}" cy="${ly}" rx="5" ry="15" transform="rotate(37 ${lx} ${ly})"/>`
      : `<ellipse cx="${lx}" cy="${ly}" rx="17" ry="10" transform="rotate(54 ${lx} ${ly})"/>`;
  }
  // The D crest: a steel-rimmed lozenge on the breastplate with a blood-red D.
  const crest = `<path d="M0 640L36 682L0 724L-36 682Z" fill="${ink}" stroke="${steel}" stroke-width="3"/><path d="M-13 664H2C18 664 24 674 24 682C24 690 18 700 2 700H-13ZM-4 671V693H1C10 693 14 688 14 682C14 676 10 671 1 671Z" fill="${blood}" fill-rule="evenodd"/>`;
  const dogma = `<g transform="translate(${fx} 900) scale(0.92) translate(0 -900)">
<path d="${both(d.wing)}" fill="url(#dbtefx-dh-wing)"/>
<path d="${both('M-90 632Q-130 520 -200 440Q-236 394 -250 336M-200 440Q-240 444 -275 470M-200 440Q-232 510 -250 582M-200 440Q-200 560 -196 672')}" fill="none" stroke="${stoneLit}" stroke-opacity="0.7" stroke-width="3" stroke-linecap="round"/>
<path d="${both(d.arm)}" fill="url(#dbtefx-dh-armor)"/>
<path d="${both(d.chest)}" fill="url(#dbtefx-dh-armor)"/>
<path d="${both('M-8 636C-40 646 -76 672 -96 716M-6 742C-34 748 -62 760 -80 790M-4 800V900M-46 760C-50 800 -48 850 -40 900')}" fill="none" stroke="${stoneLit}" stroke-opacity="0.7" stroke-width="2.5"/>
<path d="${both(d.pauldron)}" fill="url(#dbtefx-dh-armor)"/>
<path d="${both(d.spikes)}" fill="${ink}"/>
<path d="${both(d.gorget)}" fill="${ink}"/>
<path d="${both(d.horn)}" fill="url(#dbtefx-dh-horn)"/>
<path d="${both(d.helm)}" fill="url(#dbtefx-dh-armor)"/>
<path d="M0 440L-9 482H9Z" fill="url(#dbtefx-dh-armor)"/><path d="M-3 484H3V560H-3Z" fill="${stoneLit}" fill-opacity="0.5"/>
<g fill="none" stroke="${ink}" stroke-width="7">${chain}</g><g fill="none" stroke="${steel}" stroke-width="3.5">${chain}</g>
${crest}
<path d="${both(rim)}" fill="none" stroke="${blood}" stroke-width="3" stroke-linecap="round"/>
<path d="${both('M-128 398C-120 470 -82 500 -34 502M-180 622C-192 642 -194 670 -186 692M-250 336L-200 440')}" fill="none" stroke="${bloodLit}" stroke-opacity="0.6" stroke-width="1.2" stroke-linecap="round"/>
<path d="${both('M-48 592C-92 574 -152 582 -180 622M-46 494L-30 470L0 462')}" fill="none" stroke="${steel}" stroke-opacity="0.55" stroke-width="2"/>
</g>`;

  return `<defs>
<linearGradient id="dbtefx-dh-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, blood, 0.06)}"/><stop offset="0.55" stop-color="${t.bg}"/><stop offset="1" stop-color="${mix(t.bg, steel, 0.09)}"/></linearGradient>
<radialGradient id="dbtefx-dh-moon" cx="0.42" cy="0.4" r="0.6"><stop offset="0" stop-color="${mix(blood, t.text, 0.3)}"/><stop offset="0.7" stop-color="${blood}"/><stop offset="1" stop-color="${mix(blood, t.bg, 0.35)}"/></radialGradient>
<radialGradient id="dbtefx-dh-halo" cx="0.5" cy="0.5" r="0.5"><stop offset="0.35" stop-color="${blood}" stop-opacity="0.35"/><stop offset="1" stop-color="${blood}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dh-stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${stone}"/><stop offset="0.5" stop-color="${mix(stone, t.bg, 0.4)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<radialGradient id="dbtefx-dh-face" cx="0.45" cy="0.4" r="0.65"><stop offset="0" stop-color="${mix(steel, t.text, 0.55)}"/><stop offset="1" stop-color="${mix(steel, t.bg, 0.35)}"/></radialGradient>
<radialGradient id="dbtefx-dh-armor" cx="0.3" cy="0.2" r="0.95"><stop offset="0" stop-color="${mix(t.raised, steel, 0.28)}"/><stop offset="0.5" stop-color="${mix(t.bg, t.raised, 0.6)}"/><stop offset="1" stop-color="${ink}"/></radialGradient>
<linearGradient id="dbtefx-dh-wing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, blood, 0.28)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-dh-horn" x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(steel, t.bg, 0.55)}"/><stop offset="1" stop-color="${mix(steel, t.text, 0.4)}"/></linearGradient>
<radialGradient id="dbtefx-dh-back" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${blood}" stop-opacity="0.45"/><stop offset="1" stop-color="${blood}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dh-mist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${steel}" stop-opacity="0"/><stop offset="1" stop-color="${steel}" stop-opacity="0.04"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#dbtefx-dh-sky)"/>
<circle cx="${kx}" cy="210" r="330" fill="url(#dbtefx-dh-halo)"/>
<circle cx="${kx}" cy="210" r="190" fill="url(#dbtefx-dh-moon)"/>
<g fill="${ink}" fill-opacity="0.4" style="animation: dbtefx-drift 40s ease-in-out infinite;"><ellipse cx="${kx - 40}" cy="168" rx="250" ry="7"/><ellipse cx="${kx + 60}" cy="252" rx="230" ry="10"/><ellipse cx="${kx - 120}" cy="300" rx="160" ry="5"/></g>
<path d="${city}" fill="${mix(t.bg, '#000000', 0.25)}"/>
<g fill="${mix(t.warning, t.bg, 0.45)}">${lit}</g>
<rect y="620" width="1600" height="280" fill="url(#dbtefx-dh-mist)"/>
<!--mid-->
${tower}
${clock}
<ellipse cx="${fx}" cy="600" rx="300" ry="230" fill="url(#dbtefx-dh-back)"/>
${dogma}
<!--near-->
`;
};

export default destinyHero;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'ash', count: 46, colors: ['muted', 'accent2'] },
  { kind: 'ember', count: 14, colors: ['accent'] },
];
