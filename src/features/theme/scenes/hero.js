import { mix } from '../../../lib/color.js';
import { anim, glow, H, n1, rng } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Elemental HERO: the Skyscraper city at night. Searchlights sweep, a rooftop
// Neos (the real card artwork, loaded live) towers over the skyline, and
// apartment lights switch on and off across the skyline.
const hero = (t) => {
  const rand = rng(5);
  const beam = (x, delay) =>
    `<g style="transform-origin: ${x}px ${H}px; animation: dbtefx-sway 11s ease-in-out ${-delay}s infinite;"><path d="M${x - 10} ${H}L${x - 140} -40L${x + 140} -40L${x + 10} ${H}Z" fill="url(#dbtefx-hr-beam)"/></g>`;

  const [cx, cy] = [1330, 540];
  const haze = mix(t.bg, t.opp, 0.2);
  const puff = (x, y, rx, ry, o) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#dbtefx-hr-cloud)" fill-opacity="${o}"/>`;
  const cloudBank = [
    [1160, 150, 220, 70, 0.9],
    [1330, 120, 260, 80, 0.95],
    [1500, 160, 200, 70, 0.9],
    [1260, 200, 240, 50, 0.8],
    [1100, 120, 160, 50, 0.5],
  ]
    .map((p) => puff(...p))
    .join('');

  // The city: windows are two patterns (dim grid, scattered lit) so every
  // building costs three shapes; a few apartments switch with a short fade.
  const cell = [12, 16];
  let litTile = '';
  for (let c = 0; c < 7; c++) for (let r = 0; r < 9; r++) if (rand() < 0.27) litTile += `<rect x="${c * 12 + 3}" y="${r * 16 + 4}" width="5" height="7"/>`;
  let switches = '';
  let switching = 0;
  const switcher = (x, y, w, h) => {
    if (switching >= 22) return;
    const dur = n1(9 + rand() * 6);
    const fill = switching === 7 ? t.link : t.warning;
    switches += `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" fill="${fill}" style="animation: dbtefx-hr-${switching === 7 ? 'tv' : 'sw'} ${dur}s linear ${n1(-rand() * dur)}s infinite;"/>`;
    switching += 1;
  };
  const building = (x, top, w, tone, scale, crown, sw) => {
    const [gx, gy] = [cell[0] * scale, cell[1] * scale];
    const x0 = Math.ceil((x + 5) / gx) * gx;
    const x1 = Math.floor((x + w - 5) / gx) * gx;
    const y0 = Math.ceil((top + 8) / gy) * gy;
    const id = scale === 1 ? '' : scale === 1.6 ? '-m' : '-n';
    let s = `<rect x="${n1(x)}" y="${n1(top)}" width="${n1(w)}" height="${n1(H - top + 10)}" fill="${tone}"/>`;
    const rx = n1(x + w / 2);
    if (crown === 'water') s += `<path d="M${rx - 18} ${top}v-14h4v14zM${rx + 14} ${top}v-14h4v14zM${rx - 22} ${top - 14}h44v-22q-22-8-44 0z" fill="${tone}"/><path d="M${rx - 24} ${top - 36}l24-10 24 10z" fill="${tone}"/>`;
    if (crown === 'mast') s += `<rect x="${rx - 2}" y="${top - 70}" width="4" height="70" fill="${tone}"/><circle cx="${rx}" cy="${top - 72}" r="3" fill="${t.accent2}" ${anim('hr-air', 2.6, rand() * 2)}/>`;
    if (crown === 'setback') s += `<rect x="${n1(x + w * 0.18)}" y="${top - 40}" width="${n1(w * 0.64)}" height="40" fill="${tone}"/><rect x="${n1(x + w * 0.34)}" y="${top - 64}" width="${n1(w * 0.32)}" height="24" fill="${tone}"/>`;
    if (crown === 'spire') s += `<path d="M${n1(x + w * 0.15)} ${top}V${top - 30}H${n1(x + w * 0.3)}V${top - 56}H${n1(x + w * 0.42)}L${rx} ${top - 130}L${n1(x + w * 0.58)} ${top - 56}H${n1(x + w * 0.7)}V${top - 30}H${n1(x + w * 0.85)}V${top}Z" fill="${tone}"/>`;
    if (crown === 'slant') s += `<path d="M${n1(x)} ${top}L${n1(x + w)} ${top - 34}V${top}Z" fill="${tone}"/>`;
    if (x1 > x0) {
      const win = `x="${n1(x0)}" y="${n1(y0)}" width="${n1(x1 - x0)}" height="${n1(H - y0)}"`;
      s += `<rect ${win} fill="url(#dbtefx-hr-grid${id})"/><rect ${win} fill="url(#dbtefx-hr-lit${id})"/>`;
      for (let k = 0; k < sw; k++) {
        const c = Math.floor(rand() * ((x1 - x0) / gx));
        const r = 1 + Math.floor(rand() * 6);
        switcher(x0 + c * gx + 3 * scale, y0 + r * gy + 4 * scale, 5 * scale, 7 * scale);
      }
    }
    return s;
  };

  const crowns = ['flat', 'water', 'setback', 'flat', 'slant', 'mast', 'flat', 'spire', 'water', 'flat', 'setback'];
  let back = '';
  for (let x = -20, i = 0; x < 1620; i++) {
    const w = 54 + rand() * 66;
    back += building(x, n1(486 + rand() * 80), w, mix(t.bg, t.surface, 0.75), 1, crowns[i % crowns.length], i % 4 === 0 ? 1 : 0);
    x += w + 2;
  }
  let middle = '';
  for (let x = -40, i = 0; x < 1640; i++) {
    const w = 80 + rand() * 80;
    middle += building(x, n1(640 + rand() * 110), w, mix(t.bg, t.surface, 0.35), 1.6, crowns[(i + 4) % crowns.length], i % 2);
    x += w + 24 + rand() * 60;
  }

  // Foreground towers: darkest, rim-lit; the right one carries the lamp.
  const facade = mix(t.bg, '#000000', 0.35);
  const front = [
    [40, 410, 236, 'water', t.opp, 268],
    [262, 640, 150, 'flat', t.opp, 404],
    [1330, 500, 300, 'flat', t.accent, 1330],
    [1186, 670, 150, 'flat', t.accent, 1186],
  ]
    .map(([x, top, w, crown, rimColor, rimX]) => `${building(x, top, w, facade, 2.2, crown, 4)}<rect x="${rimX}" y="${top}" width="3" height="${H - top}" fill="${rimColor}" fill-opacity="0.3"/><rect x="${x}" y="${top}" width="${w}" height="5" fill="${t.border}" fill-opacity="0.8"/>`)
    .join('');

  return `<style>${CARD_ART_KEYFRAMES}
@keyframes dbtefx-hr-sw { 0%, 46% { opacity: 0; } 48%, 96% { opacity: 1; } 98%, 100% { opacity: 0; } }
@keyframes dbtefx-hr-tv { 0%, 30% { opacity: 0; } 32% { opacity: 0.55; } 40% { opacity: 0.9; } 48% { opacity: 0.4; } 56% { opacity: 0.8; } 64% { opacity: 0.5; } 72% { opacity: 1; } 80% { opacity: 0.45; } 88% { opacity: 0.75; } 90%, 100% { opacity: 0; } }
@keyframes dbtefx-hr-air { 0%, 100% { opacity: 0.15; } 6% { opacity: 1; } 18% { opacity: 0.15; } }
@keyframes dbtefx-hr-wisp { 0% { transform: translateX(-160px); opacity: 0; } 15%, 85% { opacity: 1; } 100% { transform: translateX(220px); opacity: 0; } }</style>
<defs><linearGradient id="dbtefx-hr-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haze}" stop-opacity="0"/><stop offset="1" stop-color="${haze}" stop-opacity="0.85"/></linearGradient>
<linearGradient id="dbtefx-hr-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.32"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-hr-dim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.bg}" stop-opacity="0"/><stop offset="0.15" stop-color="${t.bg}" stop-opacity="0.2"/></linearGradient>
<pattern id="dbtefx-hr-grid" width="12" height="16" patternUnits="userSpaceOnUse"><rect x="3" y="4" width="5" height="7" fill="${mix(t.bg, t.surface, 0.3)}"/></pattern>
<pattern id="dbtefx-hr-lit" width="84" height="144" patternUnits="userSpaceOnUse"><g fill="${t.warning}" fill-opacity="0.85">${litTile}</g></pattern>
<pattern id="dbtefx-hr-grid-m" href="#dbtefx-hr-grid" patternTransform="scale(1.6)"/><pattern id="dbtefx-hr-lit-m" href="#dbtefx-hr-lit" patternTransform="scale(1.6)"/>
<pattern id="dbtefx-hr-grid-n" href="#dbtefx-hr-grid" patternTransform="scale(2.2)"/><pattern id="dbtefx-hr-lit-n" href="#dbtefx-hr-lit" patternTransform="scale(2.2)"/>
${glow('dbtefx-hr-cloud', mix(t.bg, t.opp, 0.22), 0.5, 0.5, 0.5, 0.9)}${glow('dbtefx-hr-wispg', mix(t.bg, t.opp, 0.3), 0.5, 0.5, 0.5, 0.85)}</defs>
${beam(330, 0)}<g class="dbtefx-hr-beamr">${beam(1270, 5)}</g>
<!--mid-->
${cloudBank}
<g class="dbtefx-hr-neosgrp">${cardArt(t, { id: 'dbtefx-hr-neos', card: CARDS.neos, x: cx - 270, y: 50, w: 480, h: 680, focus: [0.5, 0.4], zoom: 1, feather: 0.5, fade: 0.7, blend: 'screen', backdrop: mix(t.bg, t.opp, 0.18), backdropAmt: 0.9, glow: t.opp, breathe: 16, opacity: 0.7, grade: 'brightness(0.72) contrast(1.05)' })}
<rect x="${cx - 300}" y="260" width="560" height="480" fill="url(#dbtefx-hr-haze)" mask="url(#dbtefx-hr-neos-m)"/>
<g style="animation: dbtefx-hr-wisp 26s linear infinite;"><ellipse cx="${cx - 40}" cy="${cy + 26}" rx="170" ry="16" fill="url(#dbtefx-hr-wispg)"/></g>
<g style="animation: dbtefx-hr-wisp 34s linear -15s infinite;"><ellipse cx="${cx + 10}" cy="${cy - 22}" rx="130" ry="12" fill="url(#dbtefx-hr-wispg)"/></g></g>
<!--near-->
${back}${middle}
${front}
${switches}
<rect x="0" y="560" width="440" height="${H - 560}" fill="url(#dbtefx-hr-dim)"/>`;
};

export default hero;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'star', count: 90, colors: ['text'] }, { kind: 'meteor', count: 1, colors: ['accent'] }];
