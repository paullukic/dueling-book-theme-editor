import { mix } from '../../../lib/color.js';
import { glow, H, n1, polar, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Sky Striker: dusk over Area Zero. Sky Striker Ace - Kagari, the real card
// artwork (loaded live from DuelingBook, cardart.js), hangs in the upper
// right inside the tactical radar: range rings and a sweeping beam; the
// launch pad she left from waits at the bottom right. Offline the radar stays.

const skyStriker = (t) => {
  const kagari = t.accent;
  const shizuku = t.accent2;
  const shade = mix(t.bg, '#000000', 0.5);
  const rand = rng(17);
  const [rx, ry] = [1420, 320]; // radar, around the ace
  const zoomTo = `transform="translate(${rx} ${ry}) scale(0.72) translate(${-rx} ${-ry})"`;
  const hud = `font-family="'Arial Narrow', Arial, sans-serif" font-weight="700"`;

  // Dusk cloud deck: soft banks stacked toward the horizon.
  let deck = '';
  for (let i = 0; i < 10; i++) {
    const y = n1(590 + i * 30 + rand() * 12);
    const w = n1(360 + rand() * 300 + i * 30);
    deck += `<ellipse cx="${n1(rand() * W)}" cy="${y}" rx="${w}" ry="${n1(22 + i * 5)}" fill="url(#dbtefx-ss-cloud)" fill-opacity="${n1(0.55 + i * 0.045)}"/>`;
  }

  // Speed lines streaking past the ace.
  let speed = '';
  for (let i = 0; i < 6; i++) {
    const y = n1(70 + rand() * 480);
    const x = n1(1260 + rand() * 160);
    speed += `<rect x="${x}" y="${y}" width="${n1(120 + rand() * 140)}" height="2" fill="#ffffff" fill-opacity="0.45" style="animation: dbtefx-ss-streak ${n1(1.2 + rand())}s linear ${n1(-rand() * 2)}s infinite;"/>`;
  }

  // Tactical radar: range rings, a bearing scale and a sweeping beam.
  let bearing = '';
  for (let i = 0; i < 72; i++) {
    const [x1, y1] = polar(rx, ry, i % 6 ? 276 : 266, i * 5);
    const [x2, y2] = polar(rx, ry, 284, i * 5);
    bearing += `M${x1} ${y1}L${x2} ${y2}`;
  }
  const [sx, sy] = polar(rx, ry, 270, 0);
  const [ex, ey] = polar(rx, ry, 270, 40);
  const radar = `<circle cx="${rx}" cy="${ry}" r="290" fill="url(#dbtefx-ss-disc)"/>
<g fill="none" stroke="${shizuku}" stroke-opacity="0.32" stroke-width="1.5"><circle cx="${rx}" cy="${ry}" r="100"/><circle cx="${rx}" cy="${ry}" r="185"/><circle cx="${rx}" cy="${ry}" r="270" stroke-opacity="0.5"/><path d="M${rx - 290} ${ry}H${rx + 290}M${rx} ${ry - 290}V${ry + 290}" stroke-dasharray="4 10"/></g>
<g style="transform-origin: ${rx}px ${ry}px; animation: dbtefx-spin 9s linear infinite;"><path d="M${rx} ${ry}L${sx} ${sy}A270 270 0 0 1 ${ex} ${ey}Z" fill="url(#dbtefx-ss-sweep)"/><path d="M${rx} ${ry}L${ex} ${ey}" stroke="${shizuku}" stroke-opacity="0.8" stroke-width="2"/></g>`;
  const corner = (u, v, r) => `<path d="M${rx + u * r} ${ry + v * (r - 34)}V${ry + v * r}H${rx + u * (r - 34)}"/>`;
  const quad = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  const frame = `<path d="${bearing}" fill="none" stroke="${shizuku}" stroke-width="1.6" stroke-opacity="0.75"/>
<g fill="none" stroke="${shizuku}" stroke-width="3" stroke-opacity="0.85">${quad.map(([u, v]) => corner(u, v, 236)).join('')}</g>
<text x="${rx - 228}" y="${ry - 250}" ${hud} font-size="15" letter-spacing="4" fill="${shizuku}" fill-opacity="0.75">SKY STRIKER ACE</text>
`;

  // Sky Striker Ace - Kagari: the real card artwork, inside the radar.
  const ace = cardArt(t, { id: 'dbtefx-ss-ace', card: CARDS.kagari, x: 1236, y: 0, w: 370, h: 700, focus: [0.54, 0.44], zoom: 0.86, blend: 'normal', feather: 0.5, fade: 0.55, grade: 'contrast(1.12) saturate(1.05)', tint: kagari, tintAmt: 0.12, backdrop: shade, backdropAmt: 0.7, glow: kagari, breathe: 12 });


  return `<style>
@keyframes dbtefx-ss-streak { 0% { transform: translateX(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateX(520px); opacity: 0; } }
${CARD_ART_KEYFRAMES}
</style>
<defs>${glow('dbtefx-ss-sun', mix(kagari, t.warning, 0.5), 0.5, 0.5, 0.5, 0.5)}${glow('dbtefx-ss-pad', shizuku, 0.5, 0.5, 0.5, 0.35)}
<radialGradient id="dbtefx-ss-cloud" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.15"><stop offset="0" stop-color="${mix(mix(t.bg, kagari, 0.5), t.warning, 0.3)}"/><stop offset="0.45" stop-color="${mix(t.bg, kagari, 0.2)}" stop-opacity="0.9"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ss-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.3)}"/><stop offset="0.45" stop-color="${mix(t.bg, shizuku, 0.12)}"/><stop offset="0.68" stop-color="${mix(mix(t.bg, kagari, 0.32), t.warning, 0.15)}"/><stop offset="1" stop-color="${mix(t.bg, shizuku, 0.06)}"/></linearGradient>
<radialGradient id="dbtefx-ss-disc"><stop offset="0" stop-color="${mix(t.bg, shizuku, 0.2)}" stop-opacity="0.5"/><stop offset="0.7" stop-color="${mix(t.bg, shizuku, 0.12)}" stop-opacity="0.3"/><stop offset="0.93" stop-color="${shizuku}" stop-opacity="0.12"/><stop offset="1" stop-color="${shizuku}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-ss-sweep" gradientUnits="userSpaceOnUse" x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}"><stop offset="0" stop-color="${shizuku}" stop-opacity="0"/><stop offset="1" stop-color="${shizuku}" stop-opacity="0.35"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-ss-sky)"/>
<ellipse cx="1100" cy="640" rx="760" ry="200" fill="url(#dbtefx-ss-sun)"/>
${deck}
<g ${zoomTo}>${radar}</g>
<!--mid-->
<g class="dbtefx-ss-acegrp">${ace}</g>
${speed}
<g class="dbtefx-ss-hud" ${zoomTo}>${frame}</g>
<!--near-->
<g transform="translate(1430 806) scale(0.6)">
<ellipse rx="230" ry="46" fill="url(#dbtefx-ss-pad)"/>
<ellipse rx="180" ry="34" fill="${shade}" fill-opacity="0.75" stroke="${shizuku}" stroke-opacity="0.7" stroke-width="3"/>
<ellipse rx="120" ry="22" fill="none" stroke="${shizuku}" stroke-opacity="0.4" stroke-dasharray="10 8" stroke-width="2"/>
<g fill="${kagari}" fill-opacity="0.8">${[-1, 1].map((s) => `<path d="M${s * 150} -4L${s * 168} 0L${s * 150} 4L${s * 156} 0Z"/>`).join('')}</g>
<text y="66" text-anchor="middle" ${hud} font-size="22" letter-spacing="10" fill="${shizuku}" fill-opacity="0.6">AREA-0</text>
</g>`;
};

export default skyStriker;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 40, colors: ['text'] }];
