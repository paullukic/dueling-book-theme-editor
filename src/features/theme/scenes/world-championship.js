import { mix } from '../../../lib/color.js';
import { H, n1, W } from './kit.js';

// World Championship (Nintendo DS, 2007-11): the touch screen's grid paper
// behind everything, the battle cut-in's speed bands (blue for you, magenta
// for the opponent) sweeping in from opposite corners, and stylus taps (a
// ring and the blinking orange pixel cursor) landing in the gutters. Nothing
// here looks like a card zone or a counter: the duel stage and the menu feed
// stay clear. Signature: the bands streak past and the taps land, like a turn.
const worldChampionship = (t) => {
  const blue = t.self;
  const pink = t.opp;
  const orange = t.warning;

  // Grid paper: a fine light-blue grid, a heavier line every fourth.
  let grid = '';
  let gridMajor = '';
  for (let x = 0; x <= W; x += 40) (x % 160 ? (grid += `M${x} 0V${H}`) : (gridMajor += `M${x} 0V${H}`));
  for (let y = 20; y <= H; y += 40) ((y - 20) % 160 ? (grid += `M0 ${y}H${W}`) : (gridMajor += `M0 ${y}H${W}`));

  // Speed bands: long thin streaks in a corner wedge, each sliding on its own clock.
  const bands = (color, rows, dir, delay) =>
    rows
      .map(([y, len, w], i) => {
        const x = dir > 0 ? -len : W;
        return `<rect x="${x}" y="${y}" width="${len}" height="${w}" rx="${w / 2}" fill="${i % 3 ? color : '#ffffff'}" fill-opacity="${i % 3 ? 0.5 : 0.35}" style="animation: dbtefx-wc-streak${dir > 0 ? '' : '-l'} ${n1(5 + (i % 4) * 0.9)}s cubic-bezier(0.5, 0, 0.2, 1) ${n1(-delay - i * 0.7)}s infinite;"/>`;
      })
      .join('');

  // A stylus tap: an expanding ring and the four blinking pixel brackets.
  const tap = (x, y, delay) =>
    `<g transform="translate(${x} ${y})"><circle r="26" fill="none" stroke="#ffffff" stroke-width="3" style="animation: dbtefx-ripple 4.5s ease-out ${n1(-delay)}s infinite; transform-box: fill-box; transform-origin: center;"/><g fill="${orange}" shape-rendering="crispEdges" style="animation: dbtefx-wc-cursor 4.5s steps(1) ${n1(-delay)}s infinite;"><path d="M-22 -22h12v4h-8v8h-4z"/><path d="M22 -22h-12v4h8v8h4z"/><path d="M-22 22h12v-4h-8v-8h-4z"/><path d="M22 22h-12v-4h8v-8h4z"/></g></g>`;

  return `<style>@keyframes dbtefx-wc-streak { 0% { transform: translateX(0); opacity: 0; } 10% { opacity: 1; } 70% { opacity: 1; } 100% { transform: translateX(760px); opacity: 0; } }
@keyframes dbtefx-wc-streak-l { 0% { transform: translateX(0); opacity: 0; } 10% { opacity: 1; } 70% { opacity: 1; } 100% { transform: translateX(-760px); opacity: 0; } }
@keyframes dbtefx-wc-cursor { 0%, 30%, 100% { opacity: 0; } 4%, 12%, 20% { opacity: 1; } 8%, 16%, 24% { opacity: 0.2; } }</style>
<defs>
<linearGradient id="dbtefx-wc-fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.bg}" stop-opacity="0.2"/><stop offset="0.25" stop-color="${t.bg}" stop-opacity="0.85"/><stop offset="0.75" stop-color="${t.bg}" stop-opacity="0.85"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0.2"/></linearGradient>
<radialGradient id="dbtefx-wc-blue" cx="0" cy="0" r="1"><stop offset="0" stop-color="${blue}" stop-opacity="0.32"/><stop offset="1" stop-color="${blue}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-wc-pink" cx="1" cy="1" r="1"><stop offset="0" stop-color="${pink}" stop-opacity="0.3"/><stop offset="1" stop-color="${pink}" stop-opacity="0"/></radialGradient>
</defs>
<path d="${grid}" stroke="${t.accent}" stroke-opacity="0.1" stroke-width="1.5"/>
<path d="${gridMajor}" stroke="${t.accent}" stroke-opacity="0.18" stroke-width="2"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-wc-fade)"/>
<rect width="760" height="420" fill="url(#dbtefx-wc-blue)"/>
<rect x="${W - 760}" y="${H - 420}" width="760" height="420" fill="url(#dbtefx-wc-pink)"/>
<!--mid-->
<g>${bands(mix(blue, '#ffffff', 0.25), [[44, 260, 4], [70, 180, 3], [96, 320, 5], [128, 140, 3], [152, 240, 4], [186, 120, 3]], 1, 0)}</g>
<g>${bands(mix(pink, '#ffffff', 0.2), [[H - 52, 280, 4], [H - 80, 170, 3], [H - 108, 300, 5], [H - 138, 150, 3], [H - 164, 230, 4], [H - 196, 110, 3]], -1, 2.5)}</g>
<!--near-->
${tap(120, 260, 0)}${tap(1488, 330, 1.5)}${tap(130, 700, 3)}`;
};

export default worldChampionship;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'spark', count: 14, colors: ['accent', 'warning'] }];
