import { mix } from '../../../lib/color.js';
import { H, n1, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Shaddoll: El Shaddoll Construct, the real card artwork loaded live from
// DuelingBook (cardart.js), hangs in a stage light over the void. Threads run
// from its head, shoulders and hands up to a cross-shaped control bar; the
// whole marionette sways slowly on them and light runs down the threads.
// Black shards of Shaddoll Fusion drift in the void. Offline, the bar,
// threads, stage light and glow still stand.

const cx = 1240;
// The card art: El Shaddoll Construct, 640 square, its top-left corner here.
const [ax, ay, aw] = [cx - 300, 150, 600];
const at = (fx, fy) => [Math.round(ax + fx * aw), Math.round(ay + fy * aw)];

const scene = (t) => {
  const rand = rng(77);
  const violet = t.accent;
  const thread = mix(t.accent, t.text, 0.35);
  const gold = t.accent2;
  const goldLit = mix(t.accent2, '#ffffff', 0.45);
  const goldDim = mix(t.accent2, t.bg, 0.45);
  const navy = mix(t.bg, t.accent, 0.22);
  const navyLit = mix(navy, t.text, 0.16);
  const navyDark = mix(t.bg, '#000000', 0.3);
  const ink = mix(t.bg, '#000000', 0.5);

  // Control bar: a long bar, a short foreshortened cross bar, an upright.
  const bar = `<path d="M${cx - 150} 34h300v11h-300Z" fill="url(#dbtefx-sd-wood)"/><path d="M${cx - 62} 58h124v8h-124Z" fill="url(#dbtefx-sd-wood)"/><path d="M${cx - 7} -40h14v118h-14Z" fill="url(#dbtefx-sd-wood)"/>
<g fill="url(#dbtefx-sd-gold)"><path d="M${cx - 160} 31h12v17h-12ZM${cx + 148} 31h12v17h-12ZM${cx - 70} 55h10v14h-10ZM${cx + 60} 55h10v14h-10ZM${cx - 10} 74h20v10h-20Z"/></g>
<circle cx="${cx}" cy="40" r="9" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-width="2"/>`;

  // Attachment points: [from on the bar, to on the puppet].
  const ties = [
    [[cx, 84], at(0.5, 0.03)],
    [[cx - 154], at(0.13, 0.46)],
    [[cx + 154], at(0.87, 0.46)],
    [[cx - 65, 66], at(0.32, 0.29)],
    [[cx + 65, 66], at(0.68, 0.29)],
  ];
  const strings = ties.map(([[x0, y0 = 48], [x1, y1]]) => `M${x0} ${y0}L${x1} ${y1}`);
  const knots = ties.slice(1).map(([, [x, y]]) => `<circle cx="${x}" cy="${y}" r="5" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-width="1.4"/>`).join('');
  const above = `M${cx - 154} 34L${cx - 120} -20M${cx + 154} 34L${cx + 120} -20M${cx} -40V-60`;
  const glints = strings.map((d, i) => `<path d="${d}" style="animation: dbtefx-sd-glint 7s ease-in-out ${n1(-i * 1.3)}s infinite;"/>`).join('');

  // Black shards of Shaddoll Fusion drifting in the void.
  const shard = (x, y, s, rot, i) => `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${rot}) scale(${n1(s)})"><g style="animation: dbtefx-drift ${n1(14 + i * 2.3)}s ease-in-out ${n1(-i * 3.1)}s infinite;"><path d="M0 -22L10 -4L6 20L-8 14L-11 -6Z" fill="${ink}"/><path d="M0 -22L10 -4L2 2Z" fill="${navyLit}" fill-opacity="0.6"/><path d="M0 -22L-11 -6M10 -4L6 20" fill="none" stroke="${violet}" stroke-opacity="0.55" stroke-width="1.2"/></g></g>`;
  const shards = [[180, 210, 1.6, 20], [330, 120, 0.9, -30], [120, 520, 1.1, 60], [360, 640, 1.4, -12], [1500, 150, 1.2, 40], [1520, 560, 0.9, -50], [250, 380, 0.7, 10]].map(([x, y, s, r], i) => shard(x, y, s, r, i)).join('');

  // Far void: a faint harlequin lattice and indigo cloud banks.
  let lattice = '';
  for (let y = -40; y < H; y += 120) for (let x = (y / 120) % 2 ? 0 : 80; x < W; x += 160) lattice += `M${x} ${y}l80 60l-80 60l-80 -60Z`;
  let clouds = '';
  for (let i = 0; i < 6; i++) clouds += `<ellipse cx="${n1(rand() * W)}" cy="${n1(560 + rand() * 360)}" rx="${n1(320 + rand() * 260)}" ry="${n1(90 + rand() * 60)}"/>`;

  // The threads sway in a group of their own so the front-page mask (dbtefx-sd-links,
  // also over the far plane's light cone)
  // sits outside the animated transform: Chrome ignores it under one.
  // Duel only: a few faint threads hang down the left gutter, each ending in a small lens.
  const gutter = `<g class="dbtefx-sd-gutter" fill="none" stroke="${thread}" stroke-width="1.1" stroke-opacity="0.4">${[[112, 360, 0], [146, 520, 3], [178, 300, 6]]
    .map(([x, len, d]) => `<g style="transform-origin: ${x}px 0px; animation: dbtefx-reed ${9 + d / 3}s ease-in-out ${-d}s infinite;"><path d="M${x} -10V${len}"/><circle cx="${x}" cy="${len + 5}" r="4" fill="url(#dbtefx-sd-orb)" stroke="${gold}" stroke-opacity="0.6"/></g>`)
    .join('')}</g>`;

  return `<style>${CARD_ART_KEYFRAMES}
@keyframes dbtefx-sd-hang { 0%, 100% { transform: rotate(-1.4deg); } 50% { transform: rotate(1.4deg); } }
.dbtefx-sd-linkhole, .dbtefx-sd-gutter, .dbtefx-sd-menuhole { display: none; }
@keyframes dbtefx-sd-glint { 0%, 70%, 100% { opacity: 0; } 82% { opacity: 1; } }
<defs>
<linearGradient id="dbtefx-sd-void" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, violet, 0.16)}"/><stop offset="0.6" stop-color="${t.bg}"/><stop offset="1" stop-color="${navyDark}"/></linearGradient>
<linearGradient id="dbtefx-sd-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${thread}" stop-opacity="0.3"/><stop offset="1" stop-color="${violet}" stop-opacity="0.02"/></linearGradient>
<radialGradient id="dbtefx-sd-fog"><stop offset="0" stop-color="${mix(t.bg, violet, 0.3)}" stop-opacity="0.45"/><stop offset="1" stop-color="${mix(t.bg, violet, 0.3)}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-burst"><stop offset="0" stop-color="#ffffff" stop-opacity="0.3"/><stop offset="0.25" stop-color="${thread}" stop-opacity="0.2"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-pool" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${violet}" stop-opacity="0.28"/><stop offset="1" stop-color="${violet}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-sd-fade" cx="0.75" cy="0.35" r="0.7"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
<mask id="dbtefx-sd-lmask"><rect width="${W}" height="${H}" fill="url(#dbtefx-sd-fade)"/></mask>
<linearGradient id="dbtefx-sd-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${navyLit}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<linearGradient id="dbtefx-sd-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldLit}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="1" stop-color="${goldDim}"/></linearGradient>
<radialGradient id="dbtefx-sd-orb" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#ffffff"/><stop offset="0.25" stop-color="${mix(violet, '#ffffff', 0.4)}"/><stop offset="0.7" stop-color="${violet}"/><stop offset="1" stop-color="${mix(violet, t.bg, 0.6)}"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-sd-void)" fill-opacity="0.85"/>
<path d="${lattice}" fill="none" stroke="${violet}" stroke-opacity="0.16" mask="url(#dbtefx-sd-lmask)"/>
<g fill="url(#dbtefx-sd-fog)">${clouds}</g>
<g mask="url(#dbtefx-sd-links)"><path d="M${cx - 70} 0H${cx + 70}L${cx + 300} ${H}H${cx - 300}Z" fill="url(#dbtefx-sd-cone)"/>
<ellipse cx="${cx}" cy="150" rx="260" ry="240" fill="url(#dbtefx-sd-burst)"/></g>
<ellipse cx="${cx}" cy="880" rx="300" ry="60" fill="url(#dbtefx-sd-pool)"/>
${shards}
<!--mid-->
<defs><linearGradient id="dbtefx-sd-menufade" gradientUnits="userSpaceOnUse" x1="0" y1="-200" x2="0" y2="170"><stop offset="0.88" stop-color="#000000"/><stop offset="1" stop-color="#000000" stop-opacity="0"/></linearGradient><radialGradient id="dbtefx-sd-holefade"><stop offset="0.55" stop-color="#000000"/><stop offset="1" stop-color="#000000" stop-opacity="0"/></radialGradient>
<mask id="dbtefx-sd-links" maskUnits="userSpaceOnUse" x="-200" y="-200" width="2000" height="1300"><rect x="-200" y="-200" width="2000" height="1300" fill="#ffffff"/><rect class="dbtefx-sd-menuhole" x="-200" y="-200" width="2000" height="370" fill="url(#dbtefx-sd-menufade)"/><ellipse class="dbtefx-sd-linkhole" cx="1330" cy="185" rx="125" ry="95" fill="url(#dbtefx-sd-holefade)"/></mask></defs>
${gutter}
<g class="dbtefx-sd-puppet" style="transform-origin: ${cx}px 40px; animation: dbtefx-sd-hang 13s ease-in-out infinite;">
${cardArt(t, { id: 'dbtefx-sd-hero', card: CARDS.elShaddollConstruct, x: ax, y: ay - 90, w: aw, h: 790, focus: [0.5, 0.508], zoom: 0.76, feather: 0.4, fade: 0.7, blend: 'normal', backdrop: mix(t.bg, violet, 0.25), backdropAmt: 0.8, glow: violet, breathe: 0, tint: navy, tintAmt: 0.3 })}
</g>
<g class="dbtefx-sd-puppet" mask="url(#dbtefx-sd-links)"><g style="transform-origin: ${cx}px 40px; animation: dbtefx-sd-hang 13s ease-in-out infinite;">
<g fill="none" stroke="${violet}"><path d="${strings.join('')}" stroke="${ink}" stroke-opacity="0.55" stroke-width="3.5"/><path d="${strings.join('')}" stroke-opacity="0.2" stroke-width="7"/><path d="${strings.join('')}" stroke="${thread}" stroke-width="1.4"/><path d="${above}" stroke="${thread}" stroke-opacity="0.5" stroke-width="1.2"/></g>
<g fill="none" stroke="#ffffff" stroke-width="1.6" stroke-opacity="0.85">${glints}</g>
</g></g>
<g class="dbtefx-sd-puppet" style="transform-origin: ${cx}px 40px; animation: dbtefx-sd-hang 13s ease-in-out infinite;">
${knots}
${bar}
</g>
<!--near-->
<g fill="none" stroke="${thread}" stroke-width="1.1" stroke-opacity="0.5">
<g style="transform-origin: 90px 0px; animation: dbtefx-reed 9s ease-in-out infinite;"><path d="M90 -10V300"/><circle cx="90" cy="306" r="5" fill="url(#dbtefx-sd-orb)" stroke="${gold}"/></g>
<g style="transform-origin: 1560px 0px; animation: dbtefx-reed 11s ease-in-out -4s infinite;"><path d="M1560 -10V210"/><circle cx="1560" cy="216" r="4" fill="url(#dbtefx-sd-orb)" stroke="${gold}"/></g>
</g>`;
};

export default scene;

// Particle systems (particles.js): violet thread dust drifting up, faint stars.
export const particles = [{ kind: 'mote', count: 46, colors: ['accent', 'text'], rise: true, speed: 0.6 }, { kind: 'star', count: 60, colors: ['muted'] }];
