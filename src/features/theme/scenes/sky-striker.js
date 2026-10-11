import { mix } from '../../../lib/color.js';
import { glow, H, n1, polar, W } from './kit.js';

// Sky Striker: the Area Zero tactical display. One sortie on a loop: an Ace
// streaks in along an arcing flight path, the reticle closes and locks on
// the target, the lock flashes red, then the display resets. Little else.
const C = 6; // one sortie, seconds

const a = (name, extra = '') => `style="animation: dbtefx-ss-${name} ${C}s cubic-bezier(.45,0,.25,1) infinite;${extra}"`;

const skyStriker = (t) => {
  const hud = t.accent2;
  const raye = t.accent;
  const hot = mix(raye, '#ffffff', 0.4);
  // Flight path: an arc around (ox, oy) from -100 to -32 degrees, ending on the target.
  const ox = 760;
  const oy = 720;
  const r = 640;
  const [tx, ty] = polar(ox, oy, r, -32);
  const [sx, sy] = polar(ox, oy, r, -100);
  const floor = 700;

  // Perspective grid of the tactical floor, converging under the target.
  let grid = '';
  for (let k = -12; k <= 12; k++) grid += `<path d="M${n1(tx + k * 30)} ${floor}L${n1(tx + k * 220)} ${H + 40}"/>`;
  for (let j = 1; j < 7; j++) {
    const y = n1(floor + (H + 40 - floor) * (j / 6) ** 1.7);
    grid += `<path d="M0 ${y}H${W}"/>`;
  }

  // Afterburner trail: arc pieces behind the jet, fading out.
  let trail = '';
  for (let i = 0; i < 8; i++) {
    const [x0, y0] = polar(0, 0, r, -(i + 1) * 3.2);
    const [x1, y1] = polar(0, 0, r, -i * 3.2);
    trail += `<path d="M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}" stroke-opacity="${n1(0.9 - i * 0.11)}" stroke-width="${n1(5 - i * 0.5)}"/>`;
  }

  // Reticle ticks.
  let ticks = '';
  for (let d = 0; d < 360; d += 15) {
    const [x1, y1] = polar(tx, ty, d % 90 ? 118 : 108, d);
    const [x2, y2] = polar(tx, ty, 126, d);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  const corner = (dx, dy) => `<path d="M${tx + dx * 54} ${ty + dy * 30}V${ty + dy * 54}H${tx + dx * 30}"/>`;

  return `<style>
@keyframes dbtefx-ss-fly { 0% { transform: rotate(-100deg); opacity: 0; } 6% { opacity: 1; } 40% { transform: rotate(-32deg); opacity: 1; } 44%, 100% { transform: rotate(-32deg); opacity: 0; } }
@keyframes dbtefx-ss-close { 0%, 30% { transform: scale(1.7) rotate(45deg); opacity: 0.3; } 42% { transform: scale(1) rotate(0deg); opacity: 1; } 88% { transform: scale(1) rotate(0deg); opacity: 1; } 100% { transform: scale(1.7) rotate(45deg); opacity: 0.3; } }
@keyframes dbtefx-ss-lock { 0%, 41% { opacity: 0; } 43% { opacity: 1; } 47% { opacity: 0.35; } 51% { opacity: 1; } 86% { opacity: 1; } 92%, 100% { opacity: 0; } }
@keyframes dbtefx-ss-ping { 0%, 42% { transform: scale(0.5); opacity: 0; } 43% { opacity: 0.9; } 64%, 100% { transform: scale(2.2); opacity: 0; } }
@keyframes dbtefx-ss-turn { to { transform: rotate(360deg); } }
</style>
<defs>${glow('dbtefx-ss-zone', raye, 0.5, 0.5, 0.5, 0.45)}${glow('dbtefx-ss-sky', hud, 0.5, 0.5, 0.5, 0.18)}${glow('dbtefx-ss-jet', hot, 0.5, 0.5, 0.5, 0.8)}
<linearGradient id="dbtefx-ss-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hud}" stop-opacity="0"/><stop offset="1" stop-color="${hud}" stop-opacity="0.4"/></linearGradient>
<linearGradient id="dbtefx-ss-drop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${raye}" stop-opacity="0.7"/><stop offset="1" stop-color="${raye}" stop-opacity="0.1"/></linearGradient></defs>
<ellipse cx="${tx}" cy="${ty}" rx="520" ry="420" fill="url(#dbtefx-ss-sky)"/>
<g stroke="url(#dbtefx-ss-floor)" stroke-width="1.5" fill="none">${grid}</g>
<ellipse cx="${tx}" cy="${floor + 60}" rx="190" ry="42" fill="url(#dbtefx-ss-zone)"/>
<g fill="none" stroke="${raye}" stroke-opacity="0.75"><ellipse cx="${tx}" cy="${floor + 60}" rx="130" ry="28" stroke-width="3"/><ellipse cx="${tx}" cy="${floor + 60}" rx="90" ry="18" stroke-dasharray="6 6" stroke-width="2"/></g>
<text x="${tx}" y="${floor + 128}" text-anchor="middle" font-family="'Arial Narrow', Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="10" fill="${raye}" fill-opacity="0.75">AREA-0</text>
<text x="${sx + 20}" y="${sy + 38}" font-family="'Arial Narrow', Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="4" fill="${hud}" fill-opacity="0.5">X-003</text>
<!--mid-->
<path d="M${sx} ${sy}A${r} ${r} 0 0 1 ${tx} ${ty}" fill="none" stroke="${hud}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="3 9"/>
<path d="M${tx} ${ty + 130}V${floor + 60}" stroke="url(#dbtefx-ss-drop)" stroke-width="2" stroke-dasharray="4 6"/>
<g fill="none" stroke="${hud}" stroke-width="2">
<g style="transform-origin: ${tx}px ${ty}px; animation: dbtefx-ss-turn 40s linear infinite;" stroke-opacity="0.55"><circle cx="${tx}" cy="${ty}" r="126" stroke-dasharray="150 48"/><g stroke-opacity="0.8">${ticks}</g></g>
<circle cx="${tx}" cy="${ty}" r="84" stroke-opacity="0.25"/>
<path d="M${tx - 160} ${ty}H${tx - 96}M${tx + 96} ${ty}H${tx + 160}M${tx} ${ty - 160}V${ty - 96}" stroke-opacity="0.5"/>
</g>
<g fill="none" stroke="${hud}" stroke-width="4" ${a('close', ' transform-box: fill-box; transform-origin: center;')}>${corner(-1, -1)}${corner(1, -1)}${corner(-1, 1)}${corner(1, 1)}</g>
<path d="M${tx} ${ty - 18}L${tx + 16} ${ty + 10}H${tx - 16}Z" fill="none" stroke="${t.warning}" stroke-width="3"/>
<g opacity="0" ${a('lock')}><g fill="none" stroke="${raye}" stroke-width="4">${corner(-1, -1)}${corner(1, -1)}${corner(-1, 1)}${corner(1, 1)}</g><path d="M${tx} ${ty - 18}L${tx + 16} ${ty + 10}H${tx - 16}Z" fill="${raye}"/>
<text x="${tx}" y="${ty - 140}" text-anchor="middle" font-family="'Arial Narrow', Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="6" fill="${raye}">LOCK ON</text></g>
<circle cx="${tx}" cy="${ty}" r="70" fill="none" stroke="${raye}" stroke-width="3" opacity="0" ${a('ping', ' transform-box: fill-box; transform-origin: center;')}/>
<g transform="translate(${ox} ${oy})"><g opacity="0" ${a('fly', ` transform-origin: 0px 0px;`)}>
<g fill="none" stroke="${hot}" stroke-linecap="round">${trail}</g>
<circle cx="${r}" cy="0" r="34" fill="url(#dbtefx-ss-jet)"/>
<path d="M${r} 16L${r - 12} -12L${r} -5L${r + 12} -12Z" fill="#ffffff"/>
</g></g>
<!--near-->
<g fill="none" stroke="${hud}" stroke-opacity="0.35" stroke-width="2"><path d="M${W - 210} 70H${W - 170}M${W - 210} 70V110"/><path d="M${W - 210} ${H - 70}H${W - 170}M${W - 210} ${H - 70}V${H - 110}"/></g>`;
};

export default skyStriker;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'star', count: 50, colors: ['accent2'] },
  { kind: 'mote', count: 18, colors: ['accent2', 'accent'] },
];
