import { mix } from '../../../lib/color.js';
import { H, n1, polar, rng, W } from './kit.js';

// Fire King: dusk over Fire King Island. The volcano smokes on the horizon
// across a darkening sea; on the right Sacred Fire King Garunix rises from
// the pyre, wings raised, crimson plumage tipped with turquoise flame, black
// and gold armour bands at neck and chest, inside the turning ring of the
// Fire Kings. Every few seconds the pyre flares: the phoenix is reborn.
const fireKing = (t) => {
  const rand = rng(41);
  const crimson = t.self;
  const crimsonDeep = mix(t.self, t.bg, 0.55);
  const gold = t.accent;
  const goldLit = mix(t.accent, '#ffffff', 0.45);
  const teal = t.accent2;
  const flame = t.warning;
  const ink = mix(t.bg, '#000000', 0.5);
  const sea = mix(t.bg, t.accent2, 0.16);

  // A feather: a tapered blade from base (x, y) along angle a, length l, width w.
  const feather = (x, y, a, l, w) => {
    const [tx, ty] = polar(x, y, l, a);
    const [l1x, l1y] = polar(x, y, l * 0.55, a - (w / l) * 60);
    const [r1x, r1y] = polar(x, y, l * 0.55, a + (w / l) * 60);
    return `M${n1(x)} ${n1(y)}Q${l1x} ${l1y} ${tx} ${ty}Q${r1x} ${r1y} ${n1(x)} ${n1(y)}Z`;
  };
  // One raised wing: primaries fan from the arm (shoulder -> wrist), each a
  // turquoise feather under a shorter crimson one, with gold coverts on top.
  const wing = (sx, sy, wx, wy, dir) => {
    let tips = '';
    let reds = '';
    let shafts = '';
    let coverts = '';
    const at = (f) => [sx + (wx - sx) * f, sy + (wy - sy) * f];
    // Primaries fan up from the hand; secondaries hang outward from the forearm.
    for (let i = 0; i < 8; i++) {
      const f = i / 7;
      const [px, py] = at(0.62 + 0.38 * f);
      const a = dir > 0 ? -72 - f * 52 : -108 + f * 52;
      const l = 140 + f * 95;
      tips += feather(px, py, a, l, 30 + f * 8);
      reds += feather(px, py, a, l * 0.72, 28 + f * 8);
      const [ex, ey] = polar(px, py, l * 0.9, a);
      shafts += `M${n1(px)} ${n1(py)}L${ex} ${ey}`;
    }
    for (let i = 0; i < 8; i++) {
      const f = i / 7;
      const [px, py] = at(0.08 + 0.6 * f);
      const a = dir > 0 ? 158 + f * 32 : 22 - f * 32;
      const l = 92 + f * 36;
      tips += feather(px, py, a, l, 34);
      reds += feather(px, py, a, l * 0.76, 32);
    }
    for (let i = 0; i < 7; i++) {
      const f = i / 6;
      const [px, py] = at(0.05 + 0.85 * f);
      coverts += feather(px, py + 4, dir > 0 ? -150 - f * 30 : -30 + f * 30, 58 + f * 18, 16);
    }
    const arm = `M${sx} ${sy}Q${n1((sx + wx) / 2 - dir * 10)} ${n1((sy + wy) / 2 - 24)} ${wx} ${wy}`;
    return `<path d="${tips}" fill="url(#dbtefx-fk-teal)"/><path d="${reds}" fill="url(#dbtefx-fk-plume)"/><path d="${shafts}" stroke="${goldLit}" stroke-opacity="0.45" stroke-width="1.2"/><path d="${coverts}" fill="url(#dbtefx-fk-covert)" stroke="${crimsonDeep}" stroke-width="1"/><path d="${arm}" fill="none" stroke="${ink}" stroke-width="16" stroke-linecap="round"/><path d="${arm}" fill="none" stroke="${gold}" stroke-width="16" stroke-linecap="round" stroke-dasharray="7 9"/><circle cx="${wx}" cy="${wy}" r="13" fill="${ink}" stroke="${gold}" stroke-width="4"/><circle cx="${wx}" cy="${wy}" r="4.5" fill="${teal}"/>`;
  };

  const [bx, by] = [1262, 440];
  // Long tail plumes hanging into the pyre.
  let tail = '';
  for (let i = 0; i < 7; i++) {
    const a = 90 + (i - 3) * 9;
    const l = 230 + (3 - Math.abs(i - 3)) * 34;
    const x0 = bx + (i - 3) * 8;
    tail += `<g style="transform-origin: ${x0}px 540px; animation: dbtefx-reed ${n1(6 + i * 0.6)}s ease-in-out ${n1(-i * 1.1)}s infinite;"><path d="${feather(x0, 536, a, l, 50)}" fill="url(#dbtefx-fk-teal)"/><path d="${feather(x0, 536, a, l * 0.8, 48)}" fill="url(#dbtefx-fk-tailg)"/><path d="M${x0} 536L${polar(x0, 536, l * 0.92, a).join(' ')}" stroke="${goldLit}" stroke-opacity="0.5" stroke-width="1.4"/></g>`;
  }

  // Head in profile facing left: skull, hooked gold beak, brow ridge, eye
  // socket, a crest of flame plumes sweeping back.
  const [hx, hy] = [bx - 6, 292];
  const crestFlames = [[-10, -36, 24], [6, -42, 30], [22, -38, 26], [34, -26, 22]]
    .map(([dx, dy, h], i) => `<path d="M${hx + dx - 8} ${hy + dy + 16}C${hx + dx - 10} ${hy + dy - h * 0.4} ${hx + dx + 8} ${hy + dy - h * 0.7} ${hx + dx + 16} ${hy + dy - h}C${hx + dx + 10} ${hy + dy - h * 0.5} ${hx + dx + 14} ${hy + dy} ${hx + dx + 10} ${hy + dy + 16}Z" fill="url(#dbtefx-fk-fire)" style="animation: dbtefx-flicker ${n1(1.4 + i * 0.3)}s ease-in-out ${n1(-i * 0.4)}s infinite; transform-box: fill-box; transform-origin: center bottom;"/>`)
    .join('');
  const head = `<g transform="translate(${hx} ${hy + 20}) scale(1.3) translate(${-hx} ${-hy - 20})">${crestFlames}
<path d="M${hx + 30} ${hy + 40}C${hx + 34} ${hy + 10} ${hx + 26} ${hy - 18} ${hx + 4} ${hy - 24}C${hx - 16} ${hy - 28} ${hx - 34} ${hy - 18} ${hx - 42} ${hy - 4}L${hx - 30} ${hy + 14}C${hx - 18} ${hy + 18} ${hx - 6} ${hy + 30} ${hx - 4} ${hy + 48}Z" fill="url(#dbtefx-fk-head)"/>
<path d="M${hx - 40} ${hy - 6}C${hx - 58} ${hy - 6} ${hx - 74} ${hy + 4} ${hx - 80} ${hy + 22}C${hx - 70} ${hy + 14} ${hx - 60} ${hy + 12} ${hx - 52} ${hy + 14}L${hx - 30} ${hy + 14}Z" fill="url(#dbtefx-fk-beak)"/>
<path d="M${hx - 50} ${hy + 15}C${hx - 56} ${hy + 22} ${hx - 52} ${hy + 26} ${hx - 34} ${hy + 22}L${hx - 30} ${hy + 15}Z" fill="${mix(gold, t.bg, 0.35)}"/>
<path d="M${hx - 36} ${hy - 12}C${hx - 24} ${hy - 20} ${hx - 6} ${hy - 20} ${hx + 6} ${hy - 12}" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>
<path d="M${hx - 24} ${hy - 6}C${hx - 18} ${hy - 12} ${hx - 6} ${hy - 12} ${hx - 2} ${hy - 4}C${hx - 8} ${hy + 2} ${hx - 18} ${hy + 2} ${hx - 24} ${hy - 6}Z" fill="${ink}"/>
<path d="M${hx - 18} ${hy - 6}C${hx - 14} ${hy - 9} ${hx - 9} ${hy - 9} ${hx - 6} ${hy - 5}C${hx - 10} ${hy - 2} ${hx - 15} ${hy - 2} ${hx - 18} ${hy - 6}Z" fill="${teal}"/>
<path d="M${hx - 2} ${hy - 4}C${hx + 10} ${hy - 2} ${hx + 20} ${hy + 6} ${hx + 26} ${hy + 18}" fill="none" stroke="${gold}" stroke-width="3"/></g>`;

  // Body: banded black-and-gold collar on the neck, armoured chest, crimson breast.
  let collar = '';
  for (let i = 0; i < 4; i++) collar += `<path d="M${bx - 30 + i * 2} ${342 + i * 16}Q${bx} ${352 + i * 16} ${bx + 30 - i * 2} ${340 + i * 16}" fill="none" stroke="${i % 2 ? gold : ink}" stroke-width="9"/>`;
  // Breast plumage: rows of overlapping scale feathers, longer and tipped in turquoise toward the belly.
  const torso = `M${bx - 30} 336C${bx - 84} 384 ${bx - 82} 480 ${bx - 44} 532C${bx - 24} 556 ${bx + 24} 556 ${bx + 44} 532C${bx + 82} 480 ${bx + 84} 384 ${bx + 30} 336Z`;
  let upper = '';
  let lower = '';
  for (let row = 0; row < 11; row++) {
    const y = 350 + row * 18;
    const w = 20 + row * 1.2;
    const h = 16 + row * 1.6;
    const last = row > 7;
    for (let x = bx - 90 + (row % 2) * (w / 2); x < bx + 90; x += w) {
      const d = `M${n1(x - w / 2)} ${y}C${n1(x - w / 2)} ${n1(y + h)} ${n1(x + w / 2)} ${n1(y + h)} ${n1(x + w / 2)} ${y}Z`;
      if (last) lower += d;
      else upper += d;
    }
  }
  // Flank feathers sweeping down over the hips.
  let flank = '';
  for (let i = 0; i < 4; i++) {
    for (const side of [-1, 1]) {
      const x0 = bx + side * (54 - i * 6);
      flank += `<path d="${feather(x0, 430 + i * 22, 90 + side * (28 - i * 6), 96 - i * 8, 26)}" fill="url(#dbtefx-fk-plume)" stroke="${crimsonDeep}" stroke-width="1"/>`;
    }
  }
  const body = `<clipPath id="dbtefx-fk-torso"><path d="${torso}"/></clipPath>${flank}<path d="${torso}" fill="${crimsonDeep}"/><g clip-path="url(#dbtefx-fk-torso)"><path d="${upper}" fill="url(#dbtefx-fk-covert)" stroke="${crimsonDeep}"/><path d="${lower}" fill="url(#dbtefx-fk-plume)" stroke="${teal}" stroke-width="1.6"/></g><path d="${torso}" fill="none" stroke="${mix(crimson, flame, 0.4)}" stroke-opacity="0.6" stroke-width="2"/>
<path d="M${bx - 56} 420Q${bx} 450 ${bx + 56} 420V450Q${bx} 480 ${bx - 56} 450Z" fill="${ink}"/>
<path d="M${bx - 56} 424Q${bx} 454 ${bx + 56} 424M${bx - 56} 446Q${bx} 476 ${bx + 56} 446" fill="none" stroke="${gold}" stroke-width="4"/>
<circle cx="${bx}" cy="452" r="24" fill="${ink}" stroke="${gold}" stroke-width="6"/><circle cx="${bx}" cy="452" r="12" fill="none" stroke="${goldLit}" stroke-width="3"/><circle cx="${bx}" cy="452" r="5" fill="${teal}"/>
${collar}`;

  // The ring of the Fire Kings: a gold ring wrapped in a crown of flame tongues.
  let tongues = '';
  for (let i = 0; i < 28; i++) {
    const a = i * (360 / 28);
    const [x0, y0] = polar(bx, 400, 185, a - 4);
    const [x1, y1] = polar(bx, 400, 185, a + 4);
    const [tx, ty] = polar(bx, 400, 207 + (i % 3) * 11, a + 8);
    tongues += `M${x0} ${y0}Q${polar(bx, 400, 198, a - 2).join(' ')} ${tx} ${ty}Q${polar(bx, 400, 196, a + 6).join(' ')} ${x1} ${y1}Z`;
  }

  // The pyre the phoenix rises from.
  let pyre = '';
  for (let i = 0; i < 9; i++) {
    const x = 1060 + i * 46 + rand() * 20;
    const h = 90 + rand() * 120 - Math.abs(i - 4) * 12;
    pyre += `<path d="M${n1(x - 30)} ${H + 10}C${n1(x - 34)} ${n1(H - h * 0.5)} ${n1(x - 6)} ${n1(H - h * 0.8)} ${n1(x + 4)} ${n1(H - h)}C${n1(x + 2)} ${n1(H - h * 0.6)} ${n1(x + 30)} ${n1(H - h * 0.4)} ${n1(x + 30)} ${H + 10}Z" style="animation: dbtefx-flicker ${n1(1.2 + rand())}s ease-in-out ${n1(-rand() * 2)}s infinite; transform-box: fill-box; transform-origin: center bottom;"/>`;
  }

  // Far: the island volcano across the sea, smoking.
  const horizon = 680;
  const smoke = [[560, 520, 60], [590, 440, 90], [640, 350, 120], [710, 250, 150]]
    .map(([x, y, r], i) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${n1(r * 0.6)}" fill="url(#dbtefx-fk-smoke)" ${`style="animation: dbtefx-drift ${12 + i * 3}s ease-in-out ${-i * 2}s infinite;"`}/>`)
    .join('');

  return `<style>@keyframes dbtefx-fk-reborn { 0%, 70% { transform: scale(0.2); opacity: 0; } 74% { opacity: 0.9; } 100% { transform: scale(1.5); opacity: 0; } }
@keyframes dbtefx-fk-wingl { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-4deg); } }
@keyframes dbtefx-fk-wingr { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(4deg); } }</style>
<defs>
<linearGradient id="dbtefx-fk-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, '#000000', 0.2)}"/><stop offset="0.5" stop-color="${mix(t.bg, crimson, 0.12)}"/><stop offset="0.7" stop-color="${mix(crimson, t.bg, 0.55)}"/><stop offset="0.76" stop-color="${mix(crimson, t.bg, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-fk-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(sea, crimson, 0.3)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-fk-isle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, crimson, 0.2)}"/><stop offset="1" stop-color="${ink}"/></linearGradient>
<radialGradient id="dbtefx-fk-smoke"><stop offset="0" stop-color="${mix(t.muted, t.bg, 0.6)}" stop-opacity="0.4"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-fk-halo"><stop offset="0" stop-color="${flame}" stop-opacity="0.55"/><stop offset="0.4" stop-color="${crimson}" stop-opacity="0.3"/><stop offset="1" stop-color="${crimson}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-fk-teal" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(teal, t.bg, 0.3)}"/><stop offset="1" stop-color="${mix(teal, '#ffffff', 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-fk-plume" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${crimsonDeep}"/><stop offset="0.6" stop-color="${crimson}"/><stop offset="1" stop-color="${mix(crimson, flame, 0.45)}"/></linearGradient>
<linearGradient id="dbtefx-fk-covert" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${crimson}"/><stop offset="1" stop-color="${mix(crimson, gold, 0.55)}"/></linearGradient>
<linearGradient id="dbtefx-fk-breast" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(crimson, flame, 0.3)}"/><stop offset="1" stop-color="${crimsonDeep}"/></linearGradient>
<linearGradient id="dbtefx-fk-head" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(crimson, flame, 0.25)}"/><stop offset="1" stop-color="${crimsonDeep}"/></linearGradient>
<linearGradient id="dbtefx-fk-beak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${goldLit}"/><stop offset="1" stop-color="${mix(gold, t.bg, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-fk-fire" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${crimson}"/><stop offset="0.5" stop-color="${flame}"/><stop offset="1" stop-color="${mix(flame, '#ffffff', 0.6)}"/></linearGradient>
<linearGradient id="dbtefx-fk-tailg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${crimson}"/><stop offset="0.7" stop-color="${mix(crimson, flame, 0.5)}"/><stop offset="1" stop-color="${flame}"/></linearGradient>
<linearGradient id="dbtefx-fk-ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldLit}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="1" stop-color="${mix(gold, t.bg, 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-fk-pyre" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(flame, '#ffffff', 0.35)}"/><stop offset="0.45" stop-color="${flame}"/><stop offset="0.8" stop-color="${crimson}" stop-opacity="0.8"/><stop offset="1" stop-color="${crimson}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-fk-lava"><stop offset="0" stop-color="${flame}" stop-opacity="0.9"/><stop offset="1" stop-color="${crimson}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-fk-sky)"/>
<ellipse cx="560" cy="${horizon}" rx="420" ry="70" fill="url(#dbtefx-fk-halo)" opacity="0.3"/>
${smoke}
<path d="M240 ${horizon}C330 ${horizon - 30} 420 ${horizon - 70} 500 ${horizon - 140}L530 ${horizon - 150}H596L624 ${horizon - 136}C690 ${horizon - 80} 780 ${horizon - 40} 900 ${horizon}Z" fill="url(#dbtefx-fk-isle)"/>
<path d="M540 ${horizon - 148}q-10 20 -4 40t-10 44M584 ${horizon - 148}q12 24 6 48t12 50" fill="none" stroke="${flame}" stroke-opacity="0.55" stroke-width="2.4" stroke-linecap="round"/>
<ellipse cx="563" cy="${horizon - 152}" rx="48" ry="22" fill="url(#dbtefx-fk-lava)" style="animation: dbtefx-pulse 4s ease-in-out infinite;"/>
<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#dbtefx-fk-sea)"/>
<path d="M0 ${horizon}H${W}" stroke="${flame}" stroke-opacity="0.35" stroke-width="2"/>
<path d="M480 ${horizon + 14}h160M500 ${horizon + 34}h120M530 ${horizon + 58}h70" stroke="${flame}" stroke-opacity="0.35" stroke-width="3" stroke-linecap="round" style="animation: dbtefx-pulse 3s ease-in-out infinite;"/>
<!--mid-->
<circle cx="${bx}" cy="400" r="300" fill="url(#dbtefx-fk-halo)" style="animation: dbtefx-pulse 6s ease-in-out infinite;"/>
<g style="transform-origin: ${bx}px 400px; animation: dbtefx-spin 90s linear infinite;"><path d="${tongues}" fill="url(#dbtefx-fk-fire)" opacity="0.7"/></g>
<circle cx="${bx}" cy="400" r="185" fill="none" stroke="url(#dbtefx-fk-ring)" stroke-width="10"/>
<circle cx="${bx}" cy="400" r="173" fill="none" stroke="${ink}" stroke-width="6" stroke-dasharray="14 10"/>
<circle cx="${bx}" cy="400" r="173" fill="none" stroke="${gold}" stroke-width="2" stroke-opacity="0.6"/>
<circle cx="${bx}" cy="452" r="120" fill="none" stroke="${flame}" stroke-width="8" style="animation: dbtefx-fk-reborn 8s ease-out infinite; transform-box: fill-box; transform-origin: center;"/>
${tail}
<g style="transform-origin: ${bx - 28}px 420px; animation: dbtefx-fk-wingl 7s ease-in-out infinite;">${wing(bx - 30, 410, bx - 100, 304, 1)}</g>
<g style="transform-origin: ${bx + 28}px 420px; animation: dbtefx-fk-wingr 7s ease-in-out infinite;">${wing(bx + 30, 410, bx + 100, 304, -1)}</g>
${body}
${head}
<!--near-->
<g fill="url(#dbtefx-fk-pyre)">${pyre}</g>`;
};

export default fireKing;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'ember', count: 80, colors: ['warning', 'self', 'accent'] }, { kind: 'ash', count: 30, colors: ['muted'], light: true }, { kind: 'spark', count: 16, colors: ['accent2'] }];
