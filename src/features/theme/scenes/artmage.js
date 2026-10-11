import { mix } from '../../../lib/color.js';
import { anim, H, n1, rng, W } from './kit.js';

// Artmage: a night gallery in the Academy. A masterwork in a carved gilt
// frame hangs from the picture rail in the right third: the Academy's own
// facade (rose window, lit arcades, spires crowned with paint-orbs) above a
// rippling lake. A spellbound brush floats at the canvas and its stroke
// leaves the painting, sweeping across the hall and fading, again and again.
// Lesser canvases hang salon-style from the same rail.

// A carved gilt frame: moulding, bead line, bevel, sight edge, corner
// leaves and an optional shell crest.
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
    shell = `<path d="M${cx - 38} ${y - b + 6}A38 34 0 0 1 ${cx + 38} ${y - b + 6}Z" fill="url(#${id})"/><g stroke="#000000" stroke-opacity="0.35" stroke-width="2">${shell}</g>`;
  }
  return `<rect x="${x - b + 10}" y="${y - b + 18}" width="${w + b * 2}" height="${h + b * 2}" fill="#000000" opacity="0.45"/>
<rect x="${x - b / 2}" y="${y - b / 2}" width="${w + b}" height="${h + b}" fill="none" stroke="url(#${id})" stroke-width="${b}"/>
<rect x="${x - b + 3}" y="${y - b + 3}" width="${w + b * 2 - 6}" height="${h + b * 2 - 6}" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5"/>
<rect x="${x - b * 0.55}" y="${y - b * 0.55}" width="${w + b * 1.1}" height="${h + b * 1.1}" fill="none" stroke="#000000" stroke-opacity="0.35" stroke-width="3" stroke-dasharray="2 5"/>
<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" fill="none" stroke="#000000" stroke-opacity="0.55" stroke-width="6"/>
<rect x="${x - 1}" y="${y - 1}" width="${w + 2}" height="${h + 2}" fill="none" stroke="#ffffff" stroke-opacity="0.5"/>
<g stroke="url(#${id})">${corners.map(([a, c, sx, sy]) => scroll(n1(a), n1(c), sx, sy)).join('')}</g>${shell}`;
};

const sparkle = (x, y, r) =>
  `<path d="M${x} ${y - r}L${n1(x + r * 0.18)} ${n1(y - r * 0.18)}L${x + r} ${y}L${n1(x + r * 0.18)} ${n1(y + r * 0.18)}L${x} ${y + r}L${n1(x - r * 0.18)} ${n1(y + r * 0.18)}L${x - r} ${y}L${n1(x - r * 0.18)} ${n1(y - r * 0.18)}Z"/>`;

const artmage = (t) => {
  const rand = rng(11);
  const gold = t.accent2;
  const wall = mix(t.bg, t.raised, 0.45);
  const RAIL = 92;

  // The masterwork's canvas.
  const PX = 1100;
  const PY = 176;
  const PW = 270;
  const PH = 360;
  const hz = PY + PH * 0.62;
  const ax = PX + PW / 2;
  const stone = mix(t.bg, t.border, 0.45);

  // The Academy facade: pedimented centre block with a stained rose window
  // and lit portal, arcaded wings, two slender spires crowned with orbs.
  let facade = `<path d="M${ax - 62} ${hz}V${hz - 104}h124V${hz}Z"/><path d="M${ax - 70} ${hz - 104}L${ax} ${hz - 136}L${ax + 70} ${hz - 104}Z"/>`;
  facade += `<path d="M${ax - 104} ${hz}V${hz - 66}h42V${hz}Z"/><path d="M${ax + 62} ${hz}V${hz - 66}h42V${hz}Z"/>`;
  [-1, 1].forEach((d) => {
    const x = ax + d * 112;
    facade += `<path d="M${x - 9} ${hz}V${hz - 132}h18V${hz}Z"/><path d="M${x - 11} ${hz - 132}L${x} ${hz - 178}L${x + 11} ${hz - 132}Z"/>`;
  });
  let lit = `<path d="M${ax - 13} ${hz}V${hz - 26}A13 13 0 0 1 ${ax + 13} ${hz - 26}V${hz}Z"/>`;
  [-1, 1].forEach((d) => {
    for (let i = 0; i < 2; i++) {
      const x = ax + d * (76 + i * 18);
      lit += `<path d="M${x - 6} ${hz - 14}V${hz - 40}A6 6 0 0 1 ${x + 6} ${hz - 40}V${hz - 14}Z"/>`;
    }
    lit += `<path d="M${ax + d * 40 - 5} ${hz - 20}V${hz - 52}A5 5 0 0 1 ${ax + d * 40 + 5} ${hz - 52}V${hz - 20}Z"/>`;
  });
  const glassCols = [t.accent, t.opp, gold, t.success];
  const ry = hz - 76;
  let rose = '';
  for (let i = 0; i < 8; i++) {
    const a0 = (i * Math.PI) / 4;
    const a1 = ((i + 1) * Math.PI) / 4;
    rose += `<path d="M${ax} ${ry}L${n1(ax + Math.cos(a0) * 20)} ${n1(ry + Math.sin(a0) * 20)}A20 20 0 0 1 ${n1(ax + Math.cos(a1) * 20)} ${n1(ry + Math.sin(a1) * 20)}Z" fill="${glassCols[i % 4]}"/>`;
  }
  const orbs = [-1, 1].map((d, i) => `<circle cx="${ax + d * 112}" cy="${hz - 184}" r="7" fill="${[t.accent, t.opp][i]}"/>`).join('');

  // The painted sky: swirling strokes in the palette.
  let sky = '';
  for (let i = 0; i < 7; i++) {
    const y = PY + 24 + i * 24;
    const c = [t.opp, t.text, gold, t.accent][i % 4];
    const a1 = n1(-26 + rand() * 20);
    sky += `<path d="M${PX - 10} ${y}c50 ${a1} 90 ${n1(-a1 * 0.6 + 12)} 140 ${n1(-6 + rand() * 12)}s90 ${n1(-30 + rand() * 20)} 160 ${n1(rand() * 10)}" fill="none" stroke="${c}" stroke-width="${n1(3 + rand() * 4)}" stroke-linecap="round" stroke-opacity="${n1(0.2 + rand() * 0.2)}"/>`;
  }
  [[PX + 80, PY + 60, 22], [PX + 150, PY + 116, 15]].forEach(([x, y, r]) => {
    sky += `<path d="M${x - r} ${y}a${r} ${r} 0 1 1 ${r * 2} 0a${n1(r * 0.7)} ${n1(r * 0.7)} 0 1 1 ${n1(-r * 1.4)} 0a${n1(r * 0.4)} ${n1(r * 0.4)} 0 1 1 ${n1(r * 0.8)} 0" fill="none" stroke="${t.text}" stroke-width="3" stroke-linecap="round" stroke-opacity="0.3"/>`;
  });
  const moon = `<circle cx="${PX + 214}" cy="${PY + 60}" r="22" fill="${mix(gold, '#ffffff', 0.4)}"/><circle cx="${PX + 214}" cy="${PY + 60}" r="38" fill="none" stroke="${gold}" stroke-width="4" stroke-opacity="0.3"/>`;

  // Painted water: strokes that widen and fade like ripples.
  let ripples = '';
  for (let i = 0; i < 6; i++) {
    const y = n1(hz + 16 + i * 20);
    const x = n1(PX + 30 + rand() * 120);
    ripples += `<path d="M${x} ${y}h${n1(70 + rand() * 60)}" stroke="${[gold, t.text, t.opp][i % 3]}" stroke-width="3" stroke-linecap="round" stroke-opacity="0.5" style="transform-box: fill-box; transform-origin: center; animation: dbtefx-am-ripple ${n1(4 + i * 0.7)}s ease-in-out ${n1(-i * 1.3)}s infinite;"/>`;
  }

  // The living stroke: a tapered sweep leaving the brush tip, with bristle
  // streaks; a mask paints it on from the canvas outward, then it fades.
  const S0 = [PX + 46, PY + 104];
  const M0 = [760, 80];
  const E0 = [450, 124];
  const fwd = (o) => {
    const p = (x, y, k) => `${n1(x)} ${n1(y + o * k)}`;
    return `M${p(...S0, 0)}C${p(1000, 120, 0.7)} ${p(930, 44, 1)} ${p(...M0, 1)}C${p(590, 112, 1)} ${p(530, 172, 0.6)} ${p(...E0, 0)}`;
  };
  const back = (o) => {
    const p = (x, y, k) => `${n1(x)} ${n1(y + o * k)}`;
    return `C${p(530, 172, 0.6)} ${p(590, 112, 1)} ${p(...M0, 1)}C${p(930, 44, 1)} ${p(1000, 120, 0.7)} ${p(...S0, 0)}Z`;
  };
  const ribbon = `${fwd(-24)}${back(24)}`;
  let bristles = '';
  for (let i = 0; i < 7; i++) bristles += `<path d="${fwd((i - 3) * 6)}" stroke-width="${n1(1.5 + rand() * 3)}" stroke-opacity="${n1(0.45 + rand() * 0.4)}"/>`;

  // The spellbound brush: tip on the canvas, handle out past the frame.
  const brush = `<g transform="translate(${S0[0]} ${S0[1]}) rotate(-143)"><path d="M0 0C-2 8 -6 24 -6 38H6C6 24 2 8 0 0Z" fill="${t.accent}"/><rect x="-6" y="38" width="12" height="20" fill="${mix(gold, '#ffffff', 0.35)}"/><path d="M-5 58L-3 250H3L5 58Z" fill="url(#dbtefx-am-handle)"/><circle cx="0" cy="252" r="5" fill="${gold}"/></g>`;

  // Paint dripping off the canvas: a drip grows, lets go a bead, recovers.
  const drip = (x, len, d, c) =>
    `<path d="M${x - 7} ${PY + PH}C${x - 4} ${PY + PH + 4} ${x - 3} ${PY + PH + len * 0.6} ${x - 3} ${PY + PH + len}a3 3 0 0 0 6 0C${x + 3} ${PY + PH + len * 0.6} ${x + 4} ${PY + PH + 4} ${x + 7} ${PY + PH}Z" fill="${c}" style="transform-origin: ${x}px ${PY + PH}px; animation: dbtefx-am-grow 6s ease-in ${n1(-d)}s infinite;"/><circle cx="${x}" cy="${PY + PH + len + 4}" r="4" fill="${c}" style="animation: dbtefx-am-drop 6s ease-in ${n1(-d)}s infinite;"/>`;

  // Lesser canvases, hung salon-style: miniature Artmage works, a rainbow
  // paint ribbon (their magic) and the gold four-point star of their books.
  const study = (x, y, w, h, kind, id) => {
    const cx = n1(x + w / 2);
    const cy = n1(y + h / 2);
    let art = '';
    if (kind === 'ribbon') {
      [t.accent, gold, t.success, t.opp].forEach((c, i) => {
        art += `<path d="M${x + 8} ${n1(y + h * 0.72 - i * 7)}C${n1(x + w * 0.3)} ${n1(y + h * 0.2 - i * 6)} ${n1(x + w * 0.6)} ${n1(y + h * 0.95 - i * 6)} ${x + w - 8} ${n1(y + h * 0.32 - i * 7)}" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`;
      });
      art += `<circle cx="${n1(x + w * 0.78)}" cy="${n1(y + h * 0.24)}" r="8" fill="${mix(gold, '#ffffff', 0.4)}"/>`;
    } else {
      const r = Math.min(w, h) * 0.34;
      const q = n1(r * 0.12);
      [[0.2, 0.25, t.accent], [0.8, 0.2, t.opp], [0.25, 0.8, t.success], [0.78, 0.78, gold]].forEach(([fx, fy, c]) => {
        art += `<circle cx="${n1(x + w * fx)}" cy="${n1(y + h * fy)}" r="${n1(6 + rand() * 6)}" fill="${c}" fill-opacity="0.75"/>`;
      });
      art += `<path d="M${cx} ${n1(cy - r)}Q${n1(cx + q)} ${n1(cy - q)} ${n1(cx + r)} ${cy}Q${n1(cx + q)} ${n1(cy + q)} ${cx} ${n1(cy + r)}Q${n1(cx - q)} ${n1(cy + q)} ${n1(cx - r)} ${cy}Q${n1(cx - q)} ${n1(cy - q)} ${cx} ${n1(cy - r)}Z" fill="${gold}" stroke="${mix(gold, '#000000', 0.45)}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${n1(r * 0.2)}" fill="${mix(gold, '#ffffff', 0.55)}"/>`;
    }
    return `<path d="M${cx} ${RAIL}L${x + 4} ${y - 14}M${cx} ${RAIL}L${x + w - 4} ${y - 14}" stroke="${gold}" stroke-opacity="0.3"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>${art}${frame(x, y, w, h, 14, 'dbtefx-am-giltd', false)}`;
  };

  let panels = '';
  for (let x = 40; x < W; x += 260) panels += `<rect x="${x}" y="800" width="220" height="80" rx="4"/>`;

  return `<style>@keyframes dbtefx-am-drop { 0%, 58% { transform: translateY(0); opacity: 0; } 60% { opacity: 1; transform: translateY(0); } 100% { transform: translateY(240px); opacity: 0; } }
@keyframes dbtefx-am-grow { 0% { transform: scaleY(0.25); } 58% { transform: scaleY(1); } 64%, 100% { transform: scaleY(0.25); } }
@keyframes dbtefx-am-paint { 0% { transform: scaleX(0); opacity: 1; } 45%, 78% { transform: scaleX(1); opacity: 1; } 100% { transform: scaleX(1); opacity: 0; } }
@keyframes dbtefx-am-ripple { 0%, 100% { transform: scaleX(0.7); opacity: 0.4; } 50% { transform: scaleX(1.15); opacity: 1; } }
@keyframes dbtefx-am-shine { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }</style>
<defs>
<linearGradient id="dbtefx-am-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.bg}"/><stop offset="0.6" stop-color="${wall}"/><stop offset="1" stop-color="${t.bg}"/></linearGradient>
<linearGradient id="dbtefx-am-giltd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(gold, '#000000', 0.3)}"/><stop offset="0.5" stop-color="${mix(gold, '#000000', 0.05)}"/><stop offset="1" stop-color="${mix(gold, '#000000', 0.55)}"/></linearGradient>
<linearGradient id="dbtefx-am-s1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.opp, 0.4)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.4)}"/></linearGradient>
<linearGradient id="dbtefx-am-s2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, gold, 0.45)}"/><stop offset="1" stop-color="${mix(t.bg, t.opp, 0.3)}"/></linearGradient>
<linearGradient id="dbtefx-am-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${gold}" stop-opacity="0.12"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-am-wall)"/>
<g fill="none" stroke="${mix(t.bg, gold, 0.18)}" stroke-width="2">${panels}<path d="M0 780H${W}" stroke-width="4"/><path d="M0 790H${W}" stroke-opacity="0.6"/></g>
<path d="M0 ${RAIL}H${W}" stroke="${mix(t.bg, gold, 0.5)}" stroke-width="4"/><path d="M0 ${RAIL + 4}H${W}" stroke="#000000" stroke-opacity="0.4" stroke-width="2"/>
<path d="M${PX + 30} ${RAIL}H${PX + PW - 30}L${PX + PW + 130} ${H}H${PX - 130}Z" fill="url(#dbtefx-am-beam)"/>
${study(1090, 650, 130, 96, 'ribbon', 'dbtefx-am-s1')}
${study(1262, 628, 120, 150, 'star', 'dbtefx-am-s2')}
<!--mid-->
<defs>
<linearGradient id="dbtefx-am-gilt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.45)}"/><stop offset="0.25" stop-color="${gold}"/><stop offset="0.5" stop-color="${mix(gold, '#000000', 0.35)}"/><stop offset="0.7" stop-color="${mix(gold, '#ffffff', 0.25)}"/><stop offset="1" stop-color="${mix(gold, '#000000', 0.45)}"/></linearGradient>
<linearGradient id="dbtefx-am-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.opp, 0.35)}"/><stop offset="0.6" stop-color="${mix(t.raised, t.accent, 0.5)}"/><stop offset="1" stop-color="${mix(t.accent, gold, 0.6)}"/></linearGradient>
<linearGradient id="dbtefx-am-lake" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent, gold, 0.5)}" stop-opacity="0.85"/><stop offset="0.5" stop-color="${mix(t.raised, t.accent, 0.35)}"/><stop offset="1" stop-color="${mix(t.bg, t.opp, 0.35)}"/></linearGradient>
<linearGradient id="dbtefx-am-paint" gradientUnits="userSpaceOnUse" x1="${S0[0]}" y1="0" x2="440" y2="0"><stop offset="0" stop-color="${t.accent}"/><stop offset="0.25" stop-color="${gold}"/><stop offset="0.5" stop-color="${t.success}"/><stop offset="0.75" stop-color="${t.opp}"/><stop offset="1" stop-color="${mix(t.accent, t.opp, 0.5)}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-am-paint2" gradientUnits="userSpaceOnUse" x1="${S0[0]}" y1="0" x2="440" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="${mix(gold, '#ffffff', 0.4)}"/><stop offset="0.75" stop-color="${mix(t.opp, '#ffffff', 0.3)}"/><stop offset="1" stop-color="${t.opp}" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-am-handle" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(t.bg, t.danger, 0.35)}"/><stop offset="0.5" stop-color="${mix(t.danger, '#ffffff', 0.15)}"/><stop offset="1" stop-color="${mix(t.bg, t.danger, 0.3)}"/></linearGradient>
<radialGradient id="dbtefx-am-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.28"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<clipPath id="dbtefx-am-clip"><rect x="${PX}" y="${PY}" width="${PW}" height="${PH}"/></clipPath>
<mask id="dbtefx-am-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect x="420" y="0" width="${S0[0] - 412}" height="320" fill="#ffffff" style="transform-origin: ${S0[0] + 8}px 0px; animation: dbtefx-am-paint 8s ease-in-out infinite;"/></mask>
</defs>
<path d="M${ax} ${RAIL}L${PX - 6} ${PY - 26}M${ax} ${RAIL}L${PX + PW + 6} ${PY - 26}" stroke="${gold}" stroke-opacity="0.55" stroke-width="1.5"/>
<ellipse cx="${ax}" cy="${PY + PH / 2}" rx="330" ry="340" fill="url(#dbtefx-am-glow)" ${anim('pulse', 8, 0, 'ease-in-out')}/>
<g clip-path="url(#dbtefx-am-clip)">
<rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" fill="url(#dbtefx-am-sky)"/>
${sky}${moon}
<g fill="#ffffff" fill-opacity="0.85">${sparkle(PX + 40, PY + 30, 5)}${sparkle(PX + 160, PY + 22, 4)}${sparkle(PX + 250, PY + 130, 4)}</g>
<rect x="${PX}" y="${hz}" width="${PW}" height="${n1(PY + PH - hz)}" fill="url(#dbtefx-am-lake)"/>
<g fill="${stone}" opacity="0.16" transform="translate(0 ${n1(hz * 2)}) scale(1 -1)">${facade}</g>
${ripples}
<g fill="${stone}">${facade}</g>
${orbs}
<g fill="${gold}" fill-opacity="0.85">${lit}</g>
<g stroke="${stone}" stroke-width="1.5">${rose}</g>
<circle cx="${ax}" cy="${ry}" r="21" fill="none" stroke="${stone}" stroke-width="3"/>
</g>
${frame(PX, PY, PW, PH, 30, 'dbtefx-am-gilt', true)}
<g mask="url(#dbtefx-am-reveal)">
<path d="${ribbon}" fill="url(#dbtefx-am-paint)" opacity="0.85"/>
<g fill="none" stroke="url(#dbtefx-am-paint2)" stroke-linecap="round">${bristles}</g>
</g>
<g ${anim('bob', 6, 0, 'ease-in-out')}>${brush}<g fill="#ffffff" style="animation: dbtefx-am-shine 2s ease-in-out infinite;">${sparkle(S0[0], S0[1], 9)}</g></g>
${drip(PX + 64, 30, 0, t.accent)}${drip(PX + 190, 20, 2.2, t.opp)}${drip(PX + 236, 38, 4.1, gold)}`;
};

export default artmage;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [
  { kind: 'mote', count: 40, colors: ['accent', 'opp', 'accent2'] },
  { kind: 'spark', count: 8, colors: ['accent2'], speed: 0.4 },
];
