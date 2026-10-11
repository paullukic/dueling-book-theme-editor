import { mix } from '../../../lib/color.js';
import { H, n1, polar, W } from './kit.js';

// Duel Disk (light): a Battle City duel disk strapped on at the right edge.
// The round hub with its deck holder, the fan of five card blades opening up
// from it, the forearm plate running off the bottom-right corner and the life
// point counter on the plate. Brushed steel throughout, ink shadows, blade blue
// and counter red. Signature motion: the blade fan slowly opens and settles while
// a light sweep travels along the steel.

const HX = 1290;
const HY = 545;

const duelDisk = (t) => {
  const ink = t.text;
  const steel = mix(t.border, t.surface, 0.35);
  const groove = mix(t.border, ink, 0.35);
  const lcd = mix(ink, t.opp, 0.18);
  const blade = t.accent;
  const red = t.accent2;
  const lit = mix(red, '#ffffff', 0.35);

  const metal = (id, a, b, c, x2 = 0, y2 = 1) =>
    `<linearGradient id="dbtefx-dd-${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>`;
  const defs = `<defs>
${metal('m', '#ffffff', t.raised, steel)}
${metal('mh', t.raised, '#ffffff', steel, 1, 0)}
${metal('dk', mix(steel, ink, 0.1), steel, mix(t.border, ink, 0.2))}
${metal('bg', mix(t.bg, '#ffffff', 0.35), t.bg, mix(t.bg, ink, 0.06), 1, 1)}
<radialGradient id="dbtefx-dd-hub" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="${t.raised}"/><stop offset="1" stop-color="${steel}"/></radialGradient>
<radialGradient id="dbtefx-dd-gem" cx=".38" cy=".32" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="${lit}"/><stop offset="1" stop-color="${mix(red, ink, 0.35)}"/></radialGradient>
<radialGradient id="dbtefx-dd-shadow"><stop offset="0" stop-color="${ink}" stop-opacity=".22"/><stop offset="1" stop-color="${ink}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-dd-lcdglow"><stop offset="0" stop-color="${red}" stop-opacity=".35"/><stop offset="1" stop-color="${red}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-dd-sweep" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<pattern id="dbtefx-dd-brush" width="6" height="3" patternUnits="userSpaceOnUse"><rect width="6" height="1" fill="${ink}" fill-opacity=".035"/></pattern>
<clipPath id="dbtefx-dd-hubclip"><circle cx="${HX}" cy="${HY}" r="122"/></clipPath>
</defs>
<style>@keyframes dbtefx-dd-fan { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(2.5deg); } } @keyframes dbtefx-dd-sweep { 0% { transform: translateX(-320px); } 60%, 100% { transform: translateX(320px); } } @keyframes dbtefx-dd-led { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }</style>`;

  // Far plane: brushed steel, a soft diagonal sheen, engine-turned rings round the hub.
  let rings = '';
  for (let r = 170; r < 640; r += 34) rings += `<circle cx="${HX}" cy="${HY}" r="${r}"/>`;
  const far = `<rect width="${W}" height="${H}" fill="url(#dbtefx-dd-bg)"/><rect width="${W}" height="${H}" fill="url(#dbtefx-dd-brush)"/>
<path d="M980 0H1220L700 ${H}H460Z" fill="#ffffff" fill-opacity=".18"/><path d="M1300 0H1360L840 ${H}H780Z" fill="#ffffff" fill-opacity=".22"/>
<g fill="none" stroke="${ink}" stroke-opacity=".035" stroke-width="1.5">${rings}</g>`;

  // A card blade in local coordinates (pointing up from the hub), then rotated into the fan.
  const bladeAt = (deg, i) => {
    const slot = `<rect x="-40" y="-412" width="80" height="112" rx="4" fill="url(#dbtefx-dd-dk)" stroke="${groove}" stroke-width="2"/><path d="M-36 -300V-408H36" fill="none" stroke="${ink}" stroke-opacity=".18" stroke-width="2"/><path d="M-36 -300H36V-408" fill="none" stroke="#ffffff" stroke-opacity=".7" stroke-width="1.5"/>`;
    return `<g transform="rotate(${deg} ${HX} ${HY})"><g transform="translate(${HX} ${HY})">
<path d="M-38 -96L-58 -428Q-58 -436 -50 -436H50Q58 -436 58 -428L38 -96Z" fill="url(#dbtefx-dd-mh)" stroke="${groove}" stroke-width="2.5"/>
<path d="M-50 -430H50" stroke="#ffffff" stroke-width="2"/><path d="M-36 -110L-52 -420" stroke="#ffffff" stroke-opacity=".8" stroke-width="1.5"/><path d="M36 -110L52 -420" stroke="${t.border}" stroke-width="1.5"/>
${slot}<rect x="-4" y="-286" width="8" height="150" rx="4" fill="${blade}" fill-opacity="${0.55 + i * 0.08}"/><rect x="-2" y="-282" width="2" height="140" fill="#ffffff" fill-opacity=".6"/>
<circle cx="0" cy="-122" r="7" fill="url(#dbtefx-dd-hub)" stroke="${groove}" stroke-width="1.5"/></g></g>`;
  };
  const fan = [-8, 14, 36, 58, 80].map(bladeAt).join('');

  // Forearm plate down to the bottom-right corner, with the life point counter.
  const arm = `<g transform="rotate(-24 ${HX} ${HY})"><g transform="translate(${HX} ${HY})">
<path d="M-92 0V520Q-92 560 -52 560H52Q92 560 92 520V0Z" fill="url(#dbtefx-dd-mh)" stroke="${groove}" stroke-width="3"/>
<path d="M-80 120V540M80 120V540" stroke="${t.border}" stroke-width="2"/><path d="M-76 120V540" stroke="#ffffff" stroke-opacity=".8" stroke-width="1.5"/>
${[300, 380, 460].map((y) => `<rect x="-70" y="${y}" width="140" height="10" rx="5" fill="${steel}" stroke="${groove}" stroke-width="1.5"/>`).join('')}
<g transform="translate(0 230) rotate(24)">
<rect x="-70" y="-58" width="140" height="116" rx="12" fill="url(#dbtefx-dd-m)" stroke="${groove}" stroke-width="3"/>
<rect x="-58" y="-44" width="116" height="74" rx="6" fill="${lcd}" stroke="${ink}" stroke-opacity=".5" stroke-width="2"/>
<ellipse cx="0" cy="-7" rx="70" ry="40" fill="url(#dbtefx-dd-lcdglow)"/>
${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<rect x="${-48 + k * 12}" y="-30" width="9" height="46" rx="1.5" fill="${lit}" fill-opacity="${k < 6 ? 0.85 : 0.18}"/>`).join('')}
<path d="M-50 22H50" stroke="${lit}" stroke-opacity=".45" stroke-width="2"/>
<rect x="-56" y="38" width="22" height="9" rx="2" fill="${red}" style="animation: dbtefx-dd-led 2.4s ease-in-out infinite;"/><rect x="-28" y="38" width="22" height="9" rx="2" fill="${blade}" fill-opacity=".85"/>
</g></g></g>`;

  // The hub: rim, dial ticks, deck holder, centre jewel.
  let ticks = '';
  for (let i = 0; i < 36; i++) {
    const [x1, y1] = polar(HX, HY, 100, i * 10);
    const [x2, y2] = polar(HX, HY, i % 3 ? 92 : 86, i * 10);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  const hub = `<circle cx="${HX + 10}" cy="${HY + 16}" r="132" fill="${ink}" fill-opacity=".12"/>
<circle cx="${HX}" cy="${HY}" r="122" fill="url(#dbtefx-dd-m)" stroke="${groove}" stroke-width="3"/>
<circle cx="${HX}" cy="${HY}" r="106" fill="url(#dbtefx-dd-hub)" stroke="${t.border}" stroke-width="2"/>
<g stroke="${groove}" stroke-opacity=".6" stroke-width="2">${ticks}</g>
<rect x="${HX - 46}" y="${HY - 62}" width="92" height="124" rx="8" fill="url(#dbtefx-dd-dk)" stroke="${groove}" stroke-width="2.5"/>
${[6, 3, 0].map((o) => `<rect x="${HX - 36 + o}" y="${HY - 52 - o}" width="72" height="98" rx="4" fill="${o ? mix(t.surface, steel, 0.5) : mix(ink, t.opp, 0.35)}" stroke="${o ? t.border : groove}" stroke-width="1.5"/>`).join('')}
<ellipse cx="${HX}" cy="${HY - 3}" rx="22" ry="30" fill="none" stroke="${mix(t.warning, '#ffffff', 0.3)}" stroke-opacity=".8" stroke-width="3"/><ellipse cx="${HX}" cy="${HY - 3}" rx="10" ry="14" fill="${mix(t.warning, '#ffffff', 0.2)}" fill-opacity=".55"/>
<circle cx="${HX}" cy="${HY + 84}" r="13" fill="url(#dbtefx-dd-gem)" stroke="${groove}" stroke-width="2"/>
<g clip-path="url(#dbtefx-dd-hubclip)"><g transform="rotate(20 ${HX} ${HY})"><rect x="${HX - 60}" y="${HY - 140}" width="70" height="280" fill="url(#dbtefx-dd-sweep)" style="animation: dbtefx-dd-sweep 7s ease-in-out infinite;"/></g></g>`;

  const mid = `<ellipse cx="${HX + 40}" cy="${HY + 40}" rx="420" ry="330" fill="url(#dbtefx-dd-shadow)"/>
${arm}
<g style="transform-origin: ${HX}px ${HY}px; animation: dbtefx-dd-fan 14s ease-in-out infinite;">${fan}</g>
${hub}`;

  // Near plane: a slow light sweep across the whole disk.
  const near = `<g transform="rotate(14 ${HX} ${HY})"><rect x="${n1(HX - 300)}" y="-100" width="220" height="${H + 200}" fill="url(#dbtefx-dd-sweep)" fill-opacity=".5" style="animation: dbtefx-dd-sweep 11s ease-in-out infinite;"/></g>`;

  return `${defs}${far}<!--mid-->${mid}<!--near-->${near}`;
};

export default duelDisk;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 14, colors: ['accent'], light: true }];
