import { mix } from '../../../lib/color.js';
import { H, n1, W } from './kit.js';

// World Championship (Nintendo DS, 2007-11): the dual screen. On the right
// two stacked LCDs on their hinge, drawn in true 256x192 screen pixels: the
// top screen plays the battle cut-in (blue and magenta speed bands, the ATK
// bars, the slash and the orange damage number), the bottom screen holds the
// touch field (lavender zones, the phase pills, your hand) where the stylus
// taps a card. Behind, the touch screen's grid paper. Signature: the
// tap and the damage pop, looping like a turn.
const worldChampionship = (t) => {
  const SW = 352;
  const SH = 264;
  const PX = SW / 256;
  const X0 = 1066;
  const TOP = 96;
  const HINGE = 34;
  const BOT = TOP + SH + HINGE + 22;
  const shell = mix(t.raised, t.text, 0.18);
  const shellDeep = mix(t.raised, t.bg, 0.4);
  const navy = mix(t.bg, t.surface, 0.6);
  const lav = mix(t.accent2, t.text, 0.62);
  const lavDeep = mix(t.accent2, t.surface, 0.55);
  const blue = t.self;
  const pink = t.accent2;
  const orange = t.warning;
  const FONT = 'Verdana, Tahoma, sans-serif';
  const ink = mix(t.bg, '#000000', 0.4);

  // Grid paper backdrop: the touch screen's fine light-blue grid, a heavier line every fourth.
  let grid = '';
  let gridMajor = '';
  for (let x = 0; x <= W; x += 40) (x % 160 ? (grid += `M${x} 0V${H}`) : (gridMajor += `M${x} 0V${H}`));
  for (let y = 20; y <= H; y += 40) ((y - 20) % 160 ? (grid += `M0 ${y}H${W}`) : (gridMajor += `M0 ${y}H${W}`));

  // Top screen (screen pixels): the battle cut-in.
  let streaks = '';
  [[18, 120], [34, 60], [52, 160], [70, 90], [112, 140], [128, 70], [150, 180], [170, 100]].forEach(([y, w], i) => {
    streaks += `<rect x="${i % 2 ? 256 - w : 0}" y="${y}" width="${w}" height="2" fill="#ffffff" fill-opacity="${i % 3 ? 0.35 : 0.6}"/>`;
  });
  const topScreen = `<rect width="256" height="96" fill="url(#dbtefx-wc-blue)"/><rect y="96" width="256" height="96" fill="url(#dbtefx-wc-pink)"/>${streaks}
<path d="M0 92L256 82V98L0 108Z" fill="${navy}"/>
<g transform="translate(176 6) rotate(8)"><rect width="46" height="64" fill="${mix(t.warning, t.danger, 0.3)}" stroke="${ink}" stroke-width="2"/><rect x="4" y="9" width="38" height="34" fill="url(#dbtefx-wc-art)"/><rect x="4" y="3" width="30" height="4" fill="#ffffff" fill-opacity="0.6"/><g fill="${t.danger}" stroke="${orange}" stroke-width="0.6"><circle cx="38" cy="5" r="2.2"/></g><rect x="4" y="47" width="38" height="13" fill="#ffffff" fill-opacity="0.5"/><path d="M7 51h28M7 55h22" stroke="${ink}" stroke-opacity="0.5"/></g>
<g transform="translate(14 104) rotate(-7)"><rect width="46" height="64" fill="${mix(t.accent2, t.opp, 0.45)}" stroke="${ink}" stroke-width="2"/><rect x="4" y="9" width="38" height="34" fill="url(#dbtefx-wc-art)"/><rect x="4" y="3" width="30" height="4" fill="#ffffff" fill-opacity="0.6"/><g fill="${t.danger}" stroke="${orange}" stroke-width="0.6"><circle cx="38" cy="5" r="2.2"/></g><rect x="4" y="47" width="38" height="13" fill="#ffffff" fill-opacity="0.5"/><path d="M7 51h28M7 55h22" stroke="${ink}" stroke-opacity="0.5"/></g>
<rect x="8" y="52" width="112" height="18" fill="${mix(blue, t.bg, 0.55)}"/><rect x="8" y="52" width="112" height="2" fill="#ffffff" fill-opacity="0.6"/>
<text x="14" y="66" font-family="${FONT}" font-size="12" font-weight="700" font-style="italic" fill="#ffffff">ATK</text><text x="114" y="66" text-anchor="end" font-family="${FONT}" font-size="12" font-weight="700" font-style="italic" fill="#ffffff">2800</text>
<rect x="136" y="114" width="112" height="18" fill="${mix(pink, t.bg, 0.5)}"/><rect x="136" y="114" width="112" height="2" fill="#ffffff" fill-opacity="0.6"/>
<text x="142" y="128" font-family="${FONT}" font-size="12" font-weight="700" font-style="italic" fill="#ffffff">ATK</text><text x="242" y="128" text-anchor="end" font-family="${FONT}" font-size="12" font-weight="700" font-style="italic" fill="#ffffff">2300</text>
<g style="animation: dbtefx-wc-slash 6s linear infinite;"><path d="M150 20L250 72L246 78L144 28Z" fill="#ffffff"/><path d="M140 14L256 74V90L130 24Z" fill="#ffffff" fill-opacity="0.3"/></g>
<g style="animation: dbtefx-wc-dmg 6s linear infinite; transform-box: fill-box; transform-origin: center;"><text x="112" y="170" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="34" fill="${orange}" stroke="${mix(orange, '#000000', 0.7)}" stroke-width="4" paint-order="stroke">-500</text></g>`;

  // Bottom screen: the touch field.
  let zones = '';
  [[22, 0], [50, 1], [104, 1], [132, 0]].forEach(([y, kind]) => {
    for (let c = 0; c < 5; c++) {
      const x = 46 + c * 34;
      zones += `<rect x="${x}" y="${y}" width="30" height="26" fill="${kind ? lav : lavDeep}" fill-opacity="${kind ? 0.55 : 0.45}"/><rect x="${x + 1}" y="${y + 1}" width="28" height="1" fill="#ffffff" fill-opacity="0.5"/>`;
    }
  });
  const card = (x, y, color) => `<rect x="${x}" y="${y}" width="18" height="24" fill="${color}"/><rect x="${x + 2}" y="${y + 4}" width="14" height="10" fill="url(#dbtefx-wc-art)"/><rect x="${x}" y="${y}" width="18" height="1" fill="#ffffff" fill-opacity="0.6"/>`;
  const back = (x, y) => `<rect x="${x}" y="${y}" width="18" height="24" fill="${mix(t.warning, t.bg, 0.6)}"/><rect x="${x + 5}" y="${y + 6}" width="8" height="12" fill="${mix(t.bg, '#000000', 0.4)}"/>`;
  const phases = ['DP', 'SP', 'M1', 'BP', 'M2', 'EP'];
  let pills = '';
  phases.forEach((p, i) => {
    const x = 34 + i * 33;
    const active = i === 2;
    pills += `<rect x="${x}" y="80" width="30" height="20" rx="4" fill="${active ? blue : mix(t.surface, t.bg, 0.3)}" stroke="${active ? '#ffffff' : lavDeep}" stroke-width="1"/><text x="${x + 15}" y="94" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="700" fill="#ffffff">${p}</text>`;
  });
  const bottomScreen = `<rect width="256" height="192" fill="url(#dbtefx-wc-field)"/>${zones}${pills}
<rect x="8" y="22" width="30" height="26" fill="${mix(t.surface, t.bg, 0.3)}" stroke="${lavDeep}"/><text x="23" y="40" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="700" fill="${t.text}">30</text>
<rect x="218" y="132" width="30" height="26" fill="${mix(t.surface, t.bg, 0.3)}" stroke="${lavDeep}"/><text x="233" y="150" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="700" fill="${t.text}">32</text>
${back(52, 23)}${back(120, 23)}${card(86, 51, mix(t.warning, t.accent2, 0.15))}${card(120, 105, mix(t.warning, t.danger, 0.3))}${card(52, 133, mix(t.success, t.bg, 0.1))}
<rect y="164" width="256" height="28" fill="${mix(t.bg, '#000000', 0.2)}" fill-opacity="0.8"/>
${card(64, 166, mix(t.warning, t.danger, 0.3))}${card(88, 166, mix(t.success, t.bg, 0.1))}${card(112, 166, mix(t.danger, pink, 0.5))}${card(136, 166, mix(t.warning, t.accent2, 0.15))}${card(160, 166, mix(t.accent2, t.opp, 0.4))}
<g style="animation: dbtefx-blink 1.2s steps(1) infinite;"><path d="M83 102h6v2h-4v4h-2zM125 102h6v6h-2v-4h-4zM83 129h2v4h4v2h-6zM129 129h2v6h-6v-2h4z" fill="${orange}"/></g>
<g style="animation: dbtefx-wc-tap 6s ease-out infinite; transform-box: fill-box; transform-origin: center;"><circle cx="129" cy="117" r="12" fill="none" stroke="#ffffff" stroke-width="2"/></g>`;

  // The hinge between the screens, and one bezel per screen.
  const bezel = (y) => `<rect x="${X0 - 18}" y="${y - 18}" width="${SW + 36}" height="${SH + 36}" rx="22" fill="url(#dbtefx-wc-shell)" stroke="${shellDeep}" stroke-width="2"/><rect x="${X0 - 4}" y="${y - 4}" width="${SW + 8}" height="${SH + 8}" rx="4" fill="${mix(t.bg, '#000000', 0.5)}"/>`;
  const lcd = `<rect width="${SW}" height="${SH}" fill="url(#dbtefx-wc-lcd)"/><rect width="${SW}" height="${SH}" fill="url(#dbtefx-wc-sheen)"/>`;

  return `<style>@keyframes dbtefx-wc-dmg { 0%, 38% { opacity: 0; transform: scale(0.4); } 42% { opacity: 1; transform: scale(1.25); } 46%, 80% { opacity: 1; transform: scale(1); } 86%, 100% { opacity: 0; transform: scale(1); } }
@keyframes dbtefx-wc-slash { 0%, 30% { opacity: 0; } 33% { opacity: 1; } 42%, 100% { opacity: 0; } }
@keyframes dbtefx-wc-tap { 0%, 4% { opacity: 0; transform: scale(0.2); } 6% { opacity: 1; transform: scale(0.4); } 20%, 100% { opacity: 0; transform: scale(1.8); } }
@keyframes dbtefx-wc-stylus { 0%, 100% { transform: translate(14px, 14px); } 5%, 9% { transform: translate(0, 0); } 18% { transform: translate(14px, 14px); } }</style>
<defs>
<pattern id="dbtefx-wc-lcd" width="${n1(PX * 2)}" height="${n1(PX * 2)}" patternUnits="userSpaceOnUse"><path d="M0 0.5H${n1(PX * 2)}M0.5 0V${n1(PX * 2)}" stroke="#000000" stroke-opacity="0.16"/></pattern>
<linearGradient id="dbtefx-wc-sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.1"/><stop offset="0.4" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
<linearGradient id="dbtefx-wc-shell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(shell, '#ffffff', 0.15)}"/><stop offset="1" stop-color="${shellDeep}"/></linearGradient>
<linearGradient id="dbtefx-wc-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(blue, '#ffffff', 0.45)}"/><stop offset="0.6" stop-color="${blue}"/><stop offset="1" stop-color="${mix(blue, t.bg, 0.4)}"/></linearGradient>
<linearGradient id="dbtefx-wc-pink" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(pink, t.bg, 0.25)}"/><stop offset="0.5" stop-color="${pink}"/><stop offset="1" stop-color="${mix(pink, '#ffffff', 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-wc-field" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(navy, t.accent2, 0.2)}"/><stop offset="0.5" stop-color="${navy}"/><stop offset="1" stop-color="${mix(navy, t.opp, 0.25)}"/></linearGradient>
<linearGradient id="dbtefx-wc-art" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(blue, '#ffffff', 0.3)}"/><stop offset="1" stop-color="${mix(t.success, t.bg, 0.4)}"/></linearGradient>
<linearGradient id="dbtefx-wc-fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.bg}" stop-opacity="1"/><stop offset="0.45" stop-color="${t.bg}" stop-opacity="0.9"/><stop offset="1" stop-color="${t.bg}" stop-opacity="0.15"/></linearGradient>
<radialGradient id="dbtefx-wc-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.28"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
</defs>
<path d="${grid}" stroke="${t.accent}" stroke-opacity="0.09" stroke-width="1.5"/>
<path d="${gridMajor}" stroke="${t.accent}" stroke-opacity="0.16" stroke-width="2"/>
<rect width="${W}" height="${H}" fill="url(#dbtefx-wc-fade)"/>
<ellipse cx="${X0 + SW / 2}" cy="${TOP + SH + 20}" rx="430" ry="420" fill="url(#dbtefx-wc-glow)"/>
<!--mid-->
<g>
<rect x="${X0 - 4}" y="${TOP + SH + 10}" width="${SW + 8}" height="${HINGE + 8}" rx="14" fill="${shellDeep}"/>
<rect x="${X0 + 20}" y="${TOP + SH + 18}" width="70" height="${HINGE - 6}" rx="12" fill="${mix(shell, t.bg, 0.25)}" stroke="${shellDeep}"/>
<rect x="${X0 + SW - 90}" y="${TOP + SH + 18}" width="70" height="${HINGE - 6}" rx="12" fill="${mix(shell, t.bg, 0.25)}" stroke="${shellDeep}"/>
${bezel(TOP)}${bezel(BOT)}
<g transform="translate(${X0} ${TOP})"><g transform="scale(${n1(PX * 1000) / 1000})" shape-rendering="crispEdges">${topScreen}</g>${lcd}</g>
<g transform="translate(${X0} ${BOT})"><g transform="scale(${n1(PX * 1000) / 1000})" shape-rendering="crispEdges">${bottomScreen}</g>${lcd}</g>
<circle cx="${X0 + SW + 6}" cy="${TOP + SH + 31}" r="4" fill="${t.success}" style="animation: dbtefx-pulse 3s ease-in-out infinite;"/>
</g>
<g transform="translate(${n1(X0 + 129 * PX)} ${n1(BOT + 117 * PX)})"><g style="animation: dbtefx-wc-stylus 6s ease-in-out infinite;"><path d="M2 2L120 170" stroke="${mix(shell, '#000000', 0.35)}" stroke-width="13" stroke-linecap="round"/><path d="M2 2L120 170" stroke="${mix(shell, '#ffffff', 0.25)}" stroke-width="9" stroke-linecap="round"/><path d="M0 0L14 20" stroke="${mix(shell, t.bg, 0.5)}" stroke-width="5" stroke-linecap="round"/><path d="M40 52L114 158" stroke="#ffffff" stroke-opacity="0.45" stroke-width="2"/><circle cx="121" cy="171" r="7" fill="${mix(shell, '#000000', 0.3)}"/></g></g>`;
};

export default worldChampionship;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'spark', count: 14, colors: ['accent', 'warning'] }];
