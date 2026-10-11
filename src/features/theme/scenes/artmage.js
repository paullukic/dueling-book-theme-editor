import { mix } from '../../../lib/color.js';
import { anim, H, n1, rng, W } from './kit.js';

// Artmage: a night gallery in the Academy. A masterwork in a carved gilt
// frame (the Acropolis under a swirling painted sky) hangs in the right
// third, and its paint has come alive: a luminous brushstroke pours out of
// the canvas and sweeps across the top of the hall. Lesser canvases hang
// dim on the ultramarine walls; a painter's palette rests in the corner.

// A carved gilt frame: moulding, bead line, bevel, sight edge, corner
// scrolls and a shell crest.
const frame = (x, y, w, h, b, id, crest) => {
  const scroll = (cx, cy, sx, sy) =>
    `<g transform="translate(${cx} ${cy}) scale(${sx} ${sy})"><path d="M0 0C16 2 34 16 40 40C16 34 2 16 0 0Z" fill="url(#${id})" stroke="#000000" stroke-opacity="0.3"/><path d="M4 4C14 -6 34 -8 40 4C44 14 32 18 28 10M4 4C-6 14 -8 34 4 40C14 44 18 32 10 28" fill="none" stroke-width="4" stroke-linecap="round"/><circle cx="2" cy="2" r="6" fill="url(#${id})"/></g>`;
  const corners = [
    [x - b * 0.3, y - b * 0.3, 1, 1],
    [x + w + b * 0.3, y - b * 0.3, -1, 1],
    [x - b * 0.3, y + h + b * 0.3, 1, -1],
    [x + w + b * 0.3, y + h + b * 0.3, -1, -1],
  ];
  const cx = n1(x + w / 2);
  let shell = '';
  if (crest) {
    for (let i = 0; i < 7; i++) {
      const a = ((-160 + i * 23.3) * Math.PI) / 180;
      shell += `<path d="M${cx} ${y - b + 4}L${n1(cx + Math.cos(a) * 34)} ${n1(y - b + 4 + Math.sin(a) * 30)}"/>`;
    }
    shell = `<path d="M${cx - 38} ${y - b + 6}A38 34 0 0 1 ${cx + 38} ${y - b + 6}Z" fill="url(#${id})"/><g stroke="${'#000000'}" stroke-opacity="0.35" stroke-width="2">${shell}</g>`;
  }
  return `<rect x="${x - b + 10}" y="${y - b + 18}" width="${w + b * 2}" height="${h + b * 2}" fill="#000000" opacity="0.45"/>
<rect x="${x - b / 2}" y="${y - b / 2}" width="${w + b}" height="${h + b}" fill="none" stroke="url(#${id})" stroke-width="${b}"/>
<rect x="${x - b + 3}" y="${y - b + 3}" width="${w + b * 2 - 6}" height="${h + b * 2 - 6}" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5"/>
<rect x="${x - b * 0.55}" y="${y - b * 0.55}" width="${w + b * 1.1}" height="${h + b * 1.1}" fill="none" stroke="#000000" stroke-opacity="0.35" stroke-width="3" stroke-dasharray="2 5"/>
<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" fill="none" stroke="#000000" stroke-opacity="0.55" stroke-width="6"/>
<rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="${h + 2}" fill="none" stroke="#ffffff" stroke-opacity="0.5"/>
<g stroke="url(#${id})">${corners.map(([a, c, sx, sy]) => scroll(n1(a), n1(c), sx, sy)).join('')}</g>${shell}`;
};

const artmage = (t) => {
  const rand = rng(11);
  const gold = t.accent2;
  const wall = mix(t.bg, t.raised, 0.45);

  // The masterwork's canvas.
  const PX = 1090;
  const PY = 130;
  const PW = 280;
  const PH = 400;
  const hz = PY + PH * 0.68;
  let towers = '';
  // The Academy: central dome and spire over a rose window, flanking towers
  // with onion domes, a colonnade along the base.
  const ax = PX + PW / 2;
  towers += `<path d="M${ax - 40} ${hz}V${hz - 96}h80V${hz}Z"/><path d="M${ax - 46} ${hz - 96}C${ax - 46} ${hz - 150} ${ax + 46} ${hz - 150} ${ax + 46} ${hz - 96}Z"/><path d="M${ax - 3} ${hz - 138}h6v-34h-6Z"/>`;
  [[-96, 66, 18], [96, 60, 18], [-140, 40, 14], [140, 44, 14]].forEach(([dx, th, r]) => {
    const tx = ax + dx;
    towers += `<path d="M${tx - r * 0.8} ${hz}V${hz - th}h${r * 1.6}V${hz}Z"/><path d="M${tx - r} ${hz - th}C${tx - r} ${hz - th - r * 1.2} ${tx} ${hz - th - r * 1.4} ${tx} ${hz - th - r * 2.2}C${tx} ${hz - th - r * 1.4} ${tx + r} ${hz - th - r * 1.2} ${tx + r} ${hz - th}Z"/>`;
  });
  towers += `<path d="M${PX} ${hz - 6}h${PW}v12h-${PW}Z"/>`;
  let windows = '';
  for (let i = 0; i < 9; i++) windows += `<rect x="${n1(ax - 132 + i * 32)}" y="${hz - 22}" width="5" height="12" rx="2.5"/>`;

  // The painted sky: long swirling strokes, Van Gogh-like, in the palette.
  let sky = '';
  for (let i = 0; i < 8; i++) {
    const y = PY + 26 + i * 26;
    const c = [t.opp, t.text, t.accent2, t.accent][i % 4];
    const a1 = n1(-26 + rand() * 20);
    sky += `<path d="M${PX - 10} ${y}c50 ${a1} 90 ${n1(-a1 * 0.6 + 12)} 140 ${n1(-6 + rand() * 12)}s90 ${n1(-30 + rand() * 20)} 160 ${n1(rand() * 10)}" fill="none" stroke="${c}" stroke-width="${n1(3 + rand() * 4)}" stroke-linecap="round" stroke-opacity="${n1(0.22 + rand() * 0.22)}"/>`;
  }
  [[PX + 90, PY + 90, 26], [PX + 160, PY + 170, 18]].forEach(([x, y, r]) => {
    sky += `<path d="M${x - r} ${y}a${r} ${r} 0 1 1 ${r * 2} 0a${n1(r * 0.7)} ${n1(r * 0.7)} 0 1 1 ${n1(-r * 1.4)} 0a${n1(r * 0.4)} ${n1(r * 0.4)} 0 1 1 ${n1(r * 0.8)} 0" fill="none" stroke="${t.text}" stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.35"/>`;
  });
  let lake = '';
  for (let i = 0; i < 7; i++) {
    const y = n1(hz + 18 + i * 16);
    const x0 = n1(PX + 20 + rand() * 80);
    lake += `<path d="M${x0} ${y}h${n1(60 + rand() * 120)}" stroke="${[t.accent2, t.text, t.opp][i % 3]}" stroke-width="${n1(2 + rand() * 2)}" stroke-linecap="round" stroke-opacity="0.4"/>`;
  }
  const moon = `<circle cx="${PX + 222}" cy="${PY + 76}" r="26" fill="${mix(t.accent2, '#ffffff', 0.4)}"/><circle cx="${PX + 222}" cy="${PY + 76}" r="44" fill="none" stroke="${t.accent2}" stroke-width="4" stroke-opacity="0.35"/><circle cx="${PX + 222}" cy="${PY + 76}" r="60" fill="none" stroke="${t.accent2}" stroke-width="2" stroke-opacity="0.2"/>`;

  // The living stroke: a tapered sweep of paint (two offset curves meeting
  // at the ends) with bristle streaks shimmering across it in turn.
  const S0 = [PX + 90, PY + 120];
  const M0 = [760, 74];
  const E0 = [440, 120];
  const sweep = (o) => {
    const p = (x, y, k) => `${n1(x)} ${n1(y + o * k)}`;
    return `M${p(...S0, 0)}C${p(1010, 130, 0.7)} ${p(930, 40, 1)} ${p(...M0, 1)}C${p(590, 108, 1)} ${p(530, 170, 0.6)} ${p(...E0, 0)}`;
  };
  const back = (o) => {
    const p = (x, y, k) => `${n1(x)} ${n1(y + o * k)}`;
    return `C${p(530, 170, 0.6)} ${p(590, 108, 1)} ${p(...M0, 1)}C${p(930, 40, 1)} ${p(1010, 130, 0.7)} ${p(...S0, 0)}Z`;
  };
  const ribbon = `${sweep(-26)}${back(26).replace(/^C/, `L${E0.join(' ')}C`)}`;
  let bristles = '';
  for (let i = 0; i < 8; i++) {
    const o = (i - 3.5) * 6;
    bristles += `<path d="${sweep(o)}" stroke-width="${n1(1.5 + rand() * 3)}" stroke-opacity="${n1(0.4 + rand() * 0.4)}" ${anim('pulse', n1(5 + i * 0.6), i * 0.9, 'ease-in-out')}/>`;
  }
  const sparkle = (x, y, r) => `<path d="M${x} ${y - r}L${n1(x + r * 0.18)} ${n1(y - r * 0.18)}L${x + r} ${y}L${n1(x + r * 0.18)} ${n1(y + r * 0.18)}L${x} ${y + r}L${n1(x - r * 0.18)} ${n1(y + r * 0.18)}L${x - r} ${y}L${n1(x - r * 0.18)} ${n1(y - r * 0.18)}Z"/>`;

  // Paint dripping off the canvas: a bead swelling, falling, fading.
  const drip = (x, len, d, c) =>
    `<path d="M${x - 8} ${PY + PH}C${x - 4} ${PY + PH + 4} ${x - 3} ${PY + PH + len * 0.6} ${x - 3} ${PY + PH + len}a3 3 0 0 0 6 0C${x + 3} ${PY + PH + len * 0.6} ${x + 4} ${PY + PH + 4} ${x + 8} ${PY + PH}Z" fill="${c}"/><circle cx="${x}" cy="${PY + PH + len + 8}" r="4.5" fill="${c}" style="animation: dbtefx-am-drop 5.5s ease-in ${n1(-d)}s infinite;"/>`;

  // Lesser canvases on the far wall, each a quiet colour study.
  const study = (x, y, w, h, c1, c2, id) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/><path d="M${x} ${n1(y + h * 0.7)}Q${n1(x + w * 0.4)} ${n1(y + h * 0.45)} ${x + w} ${n1(y + h * 0.62)}V${y + h}H${x}Z" fill="${c2}" fill-opacity="0.5"/><circle cx="${n1(x + w * 0.7)}" cy="${n1(y + h * 0.3)}" r="${n1(Math.min(w, h) * 0.12)}" fill="${c1}" fill-opacity="0.6"/>${frame(x, y, w, h, 14, 'dbtefx-am-giltd', false)}`;

  // A colour wheel of twelve hues turning slowly behind the masterwork: the
  // painter's magic circle.
  const hues = [t.accent, mix(t.accent, t.accent2, 0.5), t.accent2, mix(t.accent2, t.success, 0.5), t.success, mix(t.success, t.opp, 0.5), t.opp, mix(t.opp, t.link, 0.5), t.link, mix(t.link, t.accent, 0.5), mix(t.accent, t.danger, 0.5), t.danger];
  const wcx = PX + PW / 2;
  const wcy = PY + PH / 2;
  let wheel = '';
  hues.forEach((c, i) => {
    const a0 = ((i * 30 - 90 + 0.6) * Math.PI) / 180;
    const a1 = (((i + 1) * 30 - 90 - 0.6) * Math.PI) / 180;
    const pt = (r, a) => `${n1(wcx + Math.cos(a) * r)} ${n1(wcy + Math.sin(a) * r)}`;
    wheel += `<path d="M${pt(330, a0)}A330 330 0 0 1 ${pt(330, a1)}L${pt(320, a1)}A320 320 0 0 0 ${pt(320, a0)}Z" fill="${c}" fill-opacity="0.5"/>`;
  });
  wheel += `<circle cx="${wcx}" cy="${wcy}" r="350" fill="none" stroke="${gold}" stroke-opacity="0.25" stroke-dasharray="2 8"/><circle cx="${wcx}" cy="${wcy}" r="308" fill="none" stroke="${gold}" stroke-opacity="0.18"/>`;

  // Wall: panels of damask-dark ultramarine with a dado rail.
  let panels = '';
  for (let x = 40; x < W; x += 260) panels += `<rect x="${x}" y="800" width="220" height="80" rx="4"/>`;

  // The palette: a kidney board with paint dabs and two brushes.
  const dabs = [[t.accent, -70, -18, 17], [t.opp, -28, -38, 15], [t.accent2, 18, -40, 14], [t.text, 58, -26, 13], [t.success, 82, 6, 12], [t.danger, -86, 22, 13]]
    .map(([c, dx, dy, r]) => `<ellipse cx="${dx}" cy="${dy}" rx="${r}" ry="${n1(r * 0.8)}" fill="${c}"/><ellipse cx="${dx - 4}" cy="${dy - 4}" rx="${n1(r * 0.35)}" ry="${n1(r * 0.22)}" fill="#ffffff" fill-opacity="0.5"/>`)
    .join('');
  const brush = (rot, len, tip) =>
    `<g transform="rotate(${rot})"><rect x="-4" y="${-len}" width="8" height="${len - 60}" rx="4" fill="${mix(t.bg, t.danger, 0.5)}"/><rect x="-5" y="-60" width="10" height="26" fill="${mix(t.accent2, '#ffffff', 0.3)}"/><path d="M-5 -34C-6 -14 -2 6 0 14C2 6 6 -14 5 -34Z" fill="${tip}"/></g>`;

  return `<style>@keyframes dbtefx-am-drop { 0%, 55% { transform: translateY(0) scale(0.4); opacity: 0; } 62% { opacity: 1; transform: translateY(0) scale(1); } 100% { transform: translateY(220px) scale(1); opacity: 0; } }
@keyframes dbtefx-am-shine { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }</style>
<defs>
<linearGradient id="dbtefx-am-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg}"/><stop offset="0.6" stop-color="${wall}"/><stop offset="1" stop-color="${t.bg}"/></linearGradient>
<linearGradient id="dbtefx-am-giltd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(gold, '#000000', 0.35)}"/><stop offset="0.5" stop-color="${mix(gold, '#000000', 0.1)}"/><stop offset="1" stop-color="${mix(gold, '#000000', 0.6)}"/></linearGradient>
<linearGradient id="dbtefx-am-s1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.opp, 0.4)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.4)}"/></linearGradient>
<linearGradient id="dbtefx-am-s2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.accent2, 0.45)}"/><stop offset="1" stop-color="${mix(t.bg, t.opp, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-am-s3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.accent, 0.45)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent2, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-am-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${gold}" stop-opacity="0.12"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-am-wall)"/>
<g fill="none" stroke="${mix(t.bg, gold, 0.18)}" stroke-width="2">${panels}<path d="M0 780H${W}" stroke-width="4"/><path d="M0 790H${W}" stroke-opacity="0.6"/></g>
<g opacity="0.4">
${study(860, 62, 150, 96, t.accent2, t.opp, 'dbtefx-am-s1')}
${study(1170, 650, 190, 120, t.accent, t.accent2, 'dbtefx-am-s2')}
${study(1430, 600, 120, 170, t.opp, t.accent, 'dbtefx-am-s3')}
${study(560, 66, 110, 80, t.accent, t.opp, 'dbtefx-am-s2')}
</g>
<path d="M${PX + 40} -20H${PX + PW - 40}L${PX + PW + 120} ${PY + PH + 160}H${PX - 120}Z" fill="url(#dbtefx-am-beam)"/>
<g style="transform-origin: ${PX + PW / 2}px ${PY + PH / 2}px; animation: dbtefx-spin 180s linear infinite;">${wheel}</g>
<!--mid-->
<defs>
<linearGradient id="dbtefx-am-gilt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.45)}"/><stop offset="0.25" stop-color="${gold}"/><stop offset="0.5" stop-color="${mix(gold, '#000000', 0.35)}"/><stop offset="0.7" stop-color="${mix(gold, '#ffffff', 0.25)}"/><stop offset="1" stop-color="${mix(gold, '#000000', 0.45)}"/></linearGradient>
<linearGradient id="dbtefx-am-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.opp, 0.35)}"/><stop offset="0.45" stop-color="${mix(t.raised, t.accent, 0.5)}"/><stop offset="0.68" stop-color="${mix(t.accent, t.accent2, 0.6)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent2, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-am-paint" gradientUnits="userSpaceOnUse" x1="${PX}" y1="0" x2="440" y2="0"><stop offset="0" stop-color="${t.accent2}"/><stop offset="0.3" stop-color="${t.accent}"/><stop offset="0.65" stop-color="${t.opp}"/><stop offset="1" stop-color="${t.opp}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-am-paint2" gradientUnits="userSpaceOnUse" x1="${PX}" y1="0" x2="440" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="${mix(t.accent, '#ffffff', 0.4)}"/><stop offset="0.75" stop-color="${mix(t.opp, '#ffffff', 0.3)}"/><stop offset="1" stop-color="${t.opp}" stop-opacity="0"/></linearGradient>
<radialGradient id="dbtefx-am-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.3"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<clipPath id="dbtefx-am-clip2"><rect x="${PX}" y="${hz - 6}" width="${PW}" height="${PH * 0.3}" transform="translate(0 ${n1(hz * 2 + 12)}) scale(1 -1)"/></clipPath>
<linearGradient id="dbtefx-am-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent, t.accent2, 0.5)}" stop-opacity="0.8"/><stop offset="0.5" stop-color="${mix(t.raised, t.accent, 0.35)}"/><stop offset="1" stop-color="${mix(t.bg, t.opp, 0.35)}"/></linearGradient>
<clipPath id="dbtefx-am-clip"><rect x="${PX}" y="${PY}" width="${PW}" height="${PH}"/></clipPath>
</defs>
<ellipse cx="${PX + PW / 2}" cy="${PY + PH / 2}" rx="360" ry="380" fill="url(#dbtefx-am-glow)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
<g clip-path="url(#dbtefx-am-clip)">
<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" fill="url(#dbtefx-am-sky)"/>
<g ${anim('drift', 14, 0, 'ease-in-out')}>${sky}</g>
${moon}
<g fill="#ffffff" fill-opacity="0.85">${sparkle(PX + 60, PY + 50, 6)}${sparkle(PX + 150, PY + 30, 4)}${sparkle(PX + 270, PY + 150, 5)}</g>
<rect x="${PX}" y="${hz}" width="${PW}" height="${PH * 0.32}" fill="url(#dbtefx-am-lake)"/>
<g ${anim('drift', 11, 3, 'ease-in-out')}>${lake}</g>
<g fill="${mix(t.bg, t.border, 0.4)}">${towers}</g>
<g fill="${mix(t.bg, t.border, 0.4)}" opacity="0.35" transform="translate(0 ${n1(hz * 2 + 12)}) scale(1 -1)" clip-path="url(#dbtefx-am-clip2)">${towers}</g>
<circle cx="${ax}" cy="${hz - 62}" r="16" fill="${t.accent2}" fill-opacity="0.8" ${anim('pulse', 4, 1, 'ease-in-out')}/>
<g fill="${t.accent2}" fill-opacity="0.75">${windows}</g>
<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" fill="url(#dbtefx-am-glow)" opacity="0.5"/>
</g>
${frame(PX, PY, PW, PH, 30, 'dbtefx-am-gilt', true)}
<path d="${ribbon}" fill="url(#dbtefx-am-paint)" opacity="0.55"/>
<g fill="none" stroke="url(#dbtefx-am-paint2)" stroke-linecap="round">${bristles}</g>
<g fill="${t.accent2}">${[[760, 44, 9], [600, 150, 7], [440, 96, 8], [940, 70, 6]].map(([x, y, r], i) => `<g style="animation: dbtefx-am-shine ${n1(3 + i * 0.8)}s ease-in-out ${n1(-i * 1.1)}s infinite;">${sparkle(x, y, r)}</g>`).join('')}</g>
${drip(PX + 70, 30, 0, t.accent)}${drip(PX + 196, 18, 2.4, t.opp)}${drip(PX + 248, 40, 4, t.accent2)}
<!--near-->
<defs><linearGradient id="dbtefx-am-wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(t.bg, gold, 0.6)}"/><stop offset="0.5" stop-color="${mix(t.bg, gold, 0.4)}"/><stop offset="1" stop-color="${mix(t.bg, gold, 0.2)}"/></linearGradient></defs>
<g transform="translate(1360 830) rotate(-10)">
<path d="M-150 10C-160 -60 -60 -84 30 -74C120 -64 168 -20 150 26C134 66 70 54 40 40C14 28 -10 44 -14 62C-20 92 -80 96 -118 76C-140 64 -148 40 -150 10Z" fill="url(#dbtefx-am-wood)" stroke="${mix(gold, '#ffffff', 0.2)}" stroke-opacity="0.5" stroke-width="2"/>
<ellipse cx="-60" cy="44" rx="18" ry="14" fill="${t.bg}"/>
${dabs}
${brush(-70, 190, t.accent)}${brush(-56, 170, t.opp)}
</g>`;
};

export default artmage;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 46, colors: ['accent', 'opp', 'accent2'] },
  { kind: 'spark', count: 10, colors: ['accent2'], speed: 0.4 },
];
