import { anim, H, polar, W } from './kit.js';

// Sky Striker: launch-bay HUD, rotating radar, scanline
const skyStriker = (t) => {
  const cx = 1180;
  const cy = 470;
  let ticks = '';
  for (let a = 0; a < 360; a += 10) {
    const [x1, y1] = polar(cx, cy, a % 30 ? 292 : 280, a);
    const [x2, y2] = polar(cx, cy, 302, a);
    ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }
  const [ex, ey] = polar(cx, cy, 302, -55);
  const blip = ([x, y], d) => `<g ${anim('pulse', 2.4, d, 'ease-in-out')}><circle cx="${x}" cy="${y}" r="6" fill="${t.accent}"/><circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${t.accent}" stroke-opacity="0.5"/></g>`;
  const bracket = (x, y, dx, dy) => `<path d="M${x + dx * 70} ${y}H${x}V${y + dy * 70}"/>`;
  return `<defs>
<linearGradient id="dbtefx-ss-sweep" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0.38"/></linearGradient>
<linearGradient id="dbtefx-ss-scan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0.18"/></linearGradient>
<linearGradient id="dbtefx-ss-trail" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${t.accent}" stop-opacity="0"/><stop offset="0.7" stop-color="${t.accent}" stop-opacity="0.5"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.7"/></linearGradient>
</defs>
<path d="M-60 980L760 -40L790 -40L-20 980Z" fill="url(#dbtefx-ss-trail)" opacity="0.35"/>
<!--mid-->
<g fill="none" stroke="${t.accent2}"><circle cx="${cx}" cy="${cy}" r="302" stroke-width="3" stroke-opacity="0.38"/>${[220, 140, 60].map((r) => `<circle cx="${cx}" cy="${cy}" r="${r}" stroke-opacity="0.2"/>`).join('')}
<path d="M${cx - 320} ${cy}H${cx + 320}M${cx} ${cy - 320}V${cy + 320}" stroke-opacity="0.16"/><g stroke-opacity="0.4" stroke-width="1.5">${ticks}</g></g>
<g style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-spin 6s linear infinite;"><path d="M${cx} ${cy}L${cx + 302} ${cy}A302 302 0 0 0 ${ex} ${ey}Z" fill="url(#dbtefx-ss-sweep)"/></g>
${blip(polar(cx, cy, 190, -30), 0)}${blip(polar(cx, cy, 110, 140), 0.8)}${blip(polar(cx, cy, 250, 75), 1.6)}
<!--near-->
<g fill="none" stroke="${t.accent2}" stroke-width="3" stroke-opacity="0.45">${bracket(40, 40, 1, 1)}${bracket(W - 40, 40, -1, 1)}${bracket(40, H - 40, 1, -1)}${bracket(W - 40, H - 40, -1, -1)}</g>
<rect x="0" y="0" width="${W}" height="40" fill="url(#dbtefx-ss-scan)" ${anim('scan', 7)}/>
<g fill="${t.accent2}" fill-opacity="0.25">${[0, 1, 2, 3].map((i) => `<rect x="70" y="${720 + i * 22}" width="${120 + ((i * 53) % 90)}" height="6"/>`).join('')}</g>
<rect x="${W / 2 - 60}" y="40" width="120" height="5" fill="${t.accent}" fill-opacity="0.6"/>`;
};

export default skyStriker;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'spark', count: 40, colors: ['accent2', 'accent'], speed: 2 }];
