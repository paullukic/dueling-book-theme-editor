import { mix } from '../../../lib/color.js';
import { H, n1, rng, W } from './kit.js';
import { CARD_ART_KEYFRAMES, CARDS, cardArt } from './cardart.js';

// Madolche: Madolche Nights. Madolche Queen Tiaramisu, the real card artwork
// loaded live from DuelingBook (cardart.js), presides on her throne over the
// Chateau of sweets on frosted hills under a sugar moon: tiers of sponge,
// cream and strawberry jam, towers roofed in soft-serve and waffle cone, a
// candy-striped spire crowned with her tiara. Every window is lit; sweets
// float about, sprinkles drift down. Offline, the chateau and glow remain.

const cx = 1228;
// The chateau, shrunk to stand at the Queen's feet: its centre and scale.
const chX = 1300;
const chS = 0.56;

const scene = (t) => {
  const rand = rng(29);
  const cream = t.text;
  const creamShade = mix(t.text, t.muted, 0.55);
  const sponge = mix(t.accent2, t.bg, 0.3);
  const spongeDark = mix(t.accent2, t.bg, 0.55);
  const pink = mix(t.accent, t.bg, 0.12);
  const pinkDark = mix(t.accent, t.bg, 0.45);
  const choc = mix(t.bg, t.accent2, 0.22);
  const chocLit = mix(t.bg, t.accent2, 0.38);
  const jam = mix(t.danger, t.accent, 0.35);
  const berry = mix(t.danger, t.bg, 0.12);
  const mint = t.success;
  const gold = t.accent2;
  const glowWin = mix(t.accent2, '#ffffff', 0.35);

  // Cream poured over an edge: a band with rounded drips of varied length.
  const drip = (x0, x1, y, color, seed, deep = 1) => {
    const r = rng(seed);
    let d = `M${x0} ${y - 8}H${x1}V${y}`;
    let x = x1;
    while (x > x0 + 6) {
      const w = Math.min(x - x0, 10 + r() * 16);
      const len = (6 + r() * 22) * deep;
      const m = x - w / 2;
      d += `C${n1(x - 1)} ${n1(y + len * 0.6)} ${n1(m + w * 0.3)} ${n1(y + len)} ${n1(m)} ${n1(y + len)}C${n1(m - w * 0.3)} ${n1(y + len)} ${n1(x - w + 1)} ${n1(y + len * 0.6)} ${n1(x - w)} ${y}`;
      x -= w;
    }
    return `<path d="${d}L${x0} ${y}Z" fill="${color}"/><path d="M${x0} ${y - 6}H${x1}" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>`;
  };
  // Layered cake tier: bands from top to bottom, then cream poured on top.
  const tier = (x0, x1, y0, bands, topColor, seed) => {
    let y = y0;
    let s = '';
    bands.forEach(([h, c]) => {
      s += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="${c}"/>`;
      y += h;
    });
    return `${s}<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y - y0}" fill="url(#dbtefx-md-round)"/>${drip(x0 - 4, x1 + 4, y0 + 4, topColor, seed)}`;
  };
  const strawberry = (x, y, s = 1) => `<g transform="translate(${n1(x)} ${n1(y)}) scale(${s})"><path d="M0 -9C9 -11 12 -2 0 13C-12 -2 -9 -11 0 -9Z" fill="url(#dbtefx-md-berry)"/><g fill="${mix(gold, '#ffffff', 0.4)}"><circle cx="-3" cy="-2" r="0.9"/><circle cx="3" cy="-1" r="0.9"/><circle cx="0" cy="4" r="0.9"/></g><path d="M0 -9l-6 -3l4 0l-1 -4l3 3l3 -3l-1 4l4 0Z" fill="${mix(mint, t.bg, 0.25)}"/></g>`;
  const rosette = (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="${cream}"/><path d="M${x - 5} ${y - 1}q5 -6 10 0" fill="none" stroke="${creamShade}" stroke-width="1.4"/>`;
  const arch = (x, y, w, h) => `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;
  const win = (x, y, w, h, i) => `<path d="${arch(x - 3, y - 3, w + 6, h + 4)}" fill="${gold}"/><path d="${arch(x, y, w, h)}" fill="url(#dbtefx-md-win)" style="animation: dbtefx-md-lamp ${n1(5 + (i % 4) * 1.3)}s ease-in-out ${n1(-i * 1.7)}s infinite;"/><path d="M${x + w / 2} ${y + 3}V${y + h}M${x} ${n1(y + h * 0.55)}H${x + w}" stroke="${spongeDark}" stroke-width="1.6"/>`;

  // Soft-serve roof: stacked cream coils narrowing to a curl.
  const softServe = (x, y, w) => {
    let s = '';
    for (let i = 0; i < 4; i++) {
      const ww = w * (1 - i * 0.2);
      const yy = y - i * 20;
      s += `<path d="M${n1(x - ww / 2)} ${yy}Q${n1(x - ww / 2 - 6)} ${yy - 22} ${x} ${yy - 24}Q${n1(x + ww / 2 + 6)} ${yy - 22} ${n1(x + ww / 2)} ${yy}Q${x} ${yy + 8} ${n1(x - ww / 2)} ${yy}Z" fill="url(#dbtefx-md-cream)" stroke="${creamShade}" stroke-width="1"/>`;
    }
    return `${s}<path d="M${x - 6} ${y - 84}Q${x} ${y - 110} ${x + 10} ${y - 98}" fill="none" stroke="${cream}" stroke-width="7" stroke-linecap="round"/>`;
  };
  // Waffle-cone roof with its lattice, a cherry on the point.
  const cone = (x, y, w, h) => {
    let lat = '';
    for (let i = 1; i < 6; i++) {
      const f = i / 6;
      lat += `M${n1(x - (w / 2) * (1 - f))} ${n1(y - h * f)}L${n1(x + (w / 2) * (1 - f) * 0.2)} ${n1(y - h * f * 0.4)}`;
      lat += `M${n1(x + (w / 2) * (1 - f))} ${n1(y - h * f)}L${n1(x - (w / 2) * (1 - f) * 0.2)} ${n1(y - h * f * 0.4)}`;
    }
    return `<path d="M${x - w / 2} ${y}L${x} ${y - h}L${x + w / 2} ${y}Z" fill="url(#dbtefx-md-waffle)"/><path d="${lat}" stroke="${spongeDark}" stroke-width="1.5"/><path d="M${x - w / 2 - 4} ${y}h${w + 8}" stroke="${cream}" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${y - h - 6}" r="8" fill="url(#dbtefx-md-berry)"/><path d="M${x} ${y - h - 13}q4 -10 10 -12" fill="none" stroke="${mix(mint, t.bg, 0.3)}" stroke-width="1.6"/>`;
  };
  // Candy-striped spire.
  let stripes = '';
  for (let i = 0; i < 7; i++) stripes += `M${cx - 28 + i * 3} ${340 - i * 16}L${cx + 26 - i * 3} ${352 - i * 16}`;

  // The Queen's tiara on the spire point: arches, gems, a heart in the centre.
  const tiara = `<g transform="translate(${cx} 208)"><ellipse cx="0" cy="-6" rx="46" ry="34" fill="url(#dbtefx-md-halo)" style="animation: dbtefx-bloom 6s ease-in-out infinite; transform-box: fill-box; transform-origin: center;"/><path d="M-26 6Q0 12 26 6L22 -6L14 2L8 -14L0 0L-8 -14L-14 2L-22 -6Z" fill="url(#dbtefx-md-gold)" stroke="${spongeDark}" stroke-width="0.8"/><path d="M0 -26C4 -30 9 -26 0 -18C-9 -26 -4 -30 0 -26Z" fill="url(#dbtefx-md-berry)" stroke="${gold}" stroke-width="1.2"/><circle cx="-22" cy="-8" r="2.6" fill="${mint}"/><circle cx="22" cy="-8" r="2.6" fill="${mint}"/><circle cx="-8" cy="-16" r="2.4" fill="${t.accent}"/><circle cx="8" cy="-16" r="2.4" fill="${t.accent}"/><path d="M-26 6Q0 12 26 6" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="1.2"/></g>`;

  // Floating sweets around the castle.
  const macaron = (c1) => `<ellipse cx="0" cy="-7" rx="22" ry="10" fill="${c1}"/><path d="M-20 -2Q-22 2 -18 2H18Q22 2 20 -2Z" fill="${cream}"/><ellipse cx="0" cy="7" rx="22" ry="9" fill="${mix(c1, t.bg, 0.25)}"/><path d="M-21 -1q4 4 8 0q4 4 8 0q4 4 8 0q4 4 8 0q4 4 8 0" fill="none" stroke="${mix(c1, t.bg, 0.4)}" stroke-width="1.6"/><ellipse cx="-7" cy="-11" rx="8" ry="2.5" fill="#ffffff" fill-opacity="0.35"/>`;
  const candy = `<path d="M-12 -8L-24 -14L-22 0L-24 14L-12 8Z" fill="${mix(t.accent, cream, 0.3)}"/><path d="M12 -8L24 -14L22 0L24 14L12 8Z" fill="${mix(t.accent, cream, 0.3)}"/><ellipse rx="14" ry="11" fill="${t.accent}"/><path d="M-8 -9L4 9M0 -11L10 5" stroke="${cream}" stroke-width="2.4"/>`;
  const cookie = `<path d="M0 -20L5 -6L20 -6L8 3L12 18L0 9L-12 18L-8 3L-20 -6L-5 -6Z" fill="url(#dbtefx-md-waffle)" stroke="${spongeDark}" stroke-width="1"/><path d="M0 -13L3 -4L12 -4L5 2L7 11L0 6L-7 11L-5 2L-12 -4L-3 -4Z" fill="none" stroke="${cream}" stroke-width="1.6" stroke-dasharray="3 2"/>`;
  const float = (x, y, body, i, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})"><g style="animation: dbtefx-md-float ${n1(7 + i * 1.1)}s ease-in-out ${n1(-i * 1.9)}s infinite;">${body}</g></g>`;
  const sweets = [
    float(1020, 690, candy, 1, 18),
    float(250, 300, macaron(mix(gold, t.bg, 0.05)), 4, 8),
    float(330, 610, cookie, 5, -14),
    float(150, 470, candy, 6, -24),
  ].join('');

  // Swirl lollipops lighting the way to the door.
  const lolly = (x, i) => {
    let sw = '';
    for (let k = 0; k < 4; k++) sw += `<circle cx="${x}" cy="760" r="${22 - k * 5.5}" fill="${k % 2 ? cream : t.accent}"/>`;
    return `<circle cx="${x}" cy="760" r="56" fill="url(#dbtefx-md-halo)" style="animation: dbtefx-md-lamp ${n1(4 + i)}s ease-in-out ${n1(-i * 1.5)}s infinite;"/><path d="M${x} 782V852" stroke="${cream}" stroke-width="5" stroke-linecap="round"/>${sw}<path d="M${x - 14} 752a16 16 0 0 1 22 -6" fill="none" stroke="#ffffff" stroke-opacity="0.6" stroke-width="3" stroke-linecap="round"/>`;
  };

  // Sparkles in the sky.
  let stars = '';
  for (let i = 0; i < 12; i++) {
    const x = n1(80 + rand() * 1440);
    const y = n1(30 + rand() * 300);
    const r = n1(3 + rand() * 4);
    stars += `<path d="M${x} ${n1(y - r)}Q${x} ${y} ${n1(x + r)} ${y}Q${x} ${y} ${x} ${n1(y + r)}Q${x} ${y} ${n1(x - r)} ${y}Q${x} ${y} ${x} ${n1(y - r)}Z" fill="${i % 3 ? cream : gold}" style="animation: dbtefx-pulse ${n1(3 + rand() * 4)}s ease-in-out ${n1(-rand() * 6)}s infinite;"/>`;
  }

  // Far: a little sweets town on the left, and frosted hills.
  let town = '';
  [[40, 60, 90], [110, 44, 130], [170, 70, 80], [250, 50, 150], [310, 64, 100], [390, 40, 70]].forEach(([x, w, h], i) => {
    town += `<path d="M${x} 760V${760 - h}h${w}V760Z"/>${i % 2 ? `<path d="M${x - 6} ${760 - h}L${x + w / 2} ${760 - h - w}L${x + w + 6} ${760 - h}Z"/>` : `<path d="M${x - 4} ${760 - h}A${w / 2 + 4} ${w / 2 + 4} 0 0 1 ${x + w + 4} ${760 - h}Z"/>`}`;
  });
  let townWins = '';
  [[60, 700], [128, 660], [140, 700], [192, 712], [268, 640], [280, 690], [330, 700], [404, 728]].forEach(([x, y]) => (townWins += `<rect x="${x}" y="${y}" width="6" height="9" rx="3"/>`));

  const queen = cardArt(t, { id: 'dbtefx-md-hero', card: CARDS.tiaramisu, x: 1030, y: 0, w: 440, h: 780, focus: [0.52, 0.44], zoom: 0.9, feather: 0.6, fade: 0.65, blend: 'normal', grade: 'brightness(0.9) contrast(1.08) saturate(1.15)', tint: t.accent, tintAmt: 0.12, backdrop: mix(t.bg, t.accent, 0.3), backdropAmt: 0.8, glow: t.accent2, breathe: 18 });

  return `<style>${CARD_ART_KEYFRAMES}
@keyframes dbtefx-md-float { 0%, 100% { transform: translate(0, 0) rotate(-4deg); } 50% { transform: translate(0, -14px) rotate(4deg); } }
@keyframes dbtefx-md-lamp { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
@keyframes dbtefx-md-flag { 0%, 100% { transform: skewY(-6deg) scaleX(1); } 50% { transform: skewY(5deg) scaleX(0.9); } }</style>
<defs>
<linearGradient id="dbtefx-md-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.accent, 0.1)}"/><stop offset="0.55" stop-color="${mix(t.bg, t.accent, 0.2)}"/><stop offset="0.8" stop-color="${mix(t.bg, t.accent, 0.32)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent2, 0.15)}"/></linearGradient>
<radialGradient id="dbtefx-md-moon" cx="0.4" cy="0.4" r="0.6"><stop offset="0" stop-color="#ffffff"/><stop offset="0.7" stop-color="${cream}"/><stop offset="1" stop-color="${mix(cream, t.accent2, 0.4)}"/></radialGradient>
<radialGradient id="dbtefx-md-moonglow"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.35"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<radialGradient id="dbtefx-md-castle" cx="0.5" cy="0.6" r="0.5"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.3"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient>
<linearGradient id="dbtefx-md-round" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="0.3" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.75" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="0.35"/></linearGradient>
<linearGradient id="dbtefx-md-cream" x1="0" y1="0" x2="1" y2="0.4"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="${cream}"/><stop offset="1" stop-color="${creamShade}"/></linearGradient>
<linearGradient id="dbtefx-md-waffle" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.2)}"/><stop offset="0.6" stop-color="${sponge}"/><stop offset="1" stop-color="${spongeDark}"/></linearGradient>
<linearGradient id="dbtefx-md-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.5)}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="1" stop-color="${spongeDark}"/></linearGradient>
<linearGradient id="dbtefx-md-tower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(pink, '#ffffff', 0.2)}"/><stop offset="0.45" stop-color="${pink}"/><stop offset="1" stop-color="${pinkDark}"/></linearGradient>
<linearGradient id="dbtefx-md-mint" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(mint, '#ffffff', 0.2)}"/><stop offset="0.45" stop-color="${mix(mint, t.bg, 0.15)}"/><stop offset="1" stop-color="${mix(mint, t.bg, 0.5)}"/></linearGradient>
<linearGradient id="dbtefx-md-choc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${chocLit}"/><stop offset="0.45" stop-color="${choc}"/><stop offset="1" stop-color="${mix(choc, '#000000', 0.35)}"/></linearGradient>
<radialGradient id="dbtefx-md-berry" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${mix(jam, '#ffffff', 0.45)}"/><stop offset="0.5" stop-color="${jam}"/><stop offset="1" stop-color="${berry}"/></radialGradient>
<radialGradient id="dbtefx-md-win" cx="0.5" cy="0.7" r="0.8"><stop offset="0" stop-color="#ffffff"/><stop offset="0.4" stop-color="${glowWin}"/><stop offset="1" stop-color="${mix(gold, t.accent, 0.5)}"/></radialGradient>
<radialGradient id="dbtefx-md-halo"><stop offset="0" stop-color="${gold}" stop-opacity="0.6"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#dbtefx-md-sky)" fill-opacity="0.9"/>
<g class="dbtefx-md-moon"><circle cx="1020" cy="140" r="260" fill="url(#dbtefx-md-moonglow)"/>
<circle cx="1020" cy="140" r="54" fill="url(#dbtefx-md-moon)"/>
<g fill="${mix(cream, gold, 0.4)}" fill-opacity="0.35"><circle cx="1004" cy="128" r="9"/><circle cx="1034" cy="160" r="6"/><circle cx="1040" cy="122" r="4"/></g></g>
${stars}
<g fill="${mix(t.bg, t.accent, 0.2)}" fill-opacity="0.8">${town}</g>
<g fill="${glowWin}" fill-opacity="0.7">${townWins}</g>
<path d="M-20 ${H}V740C140 700 300 720 460 750S760 790 900 760S1200 700 1640 720V${H}Z" fill="${mix(t.bg, t.accent, 0.14)}"/>
<path d="M-20 740C140 700 300 720 460 750S760 790 900 760S1200 700 1640 720" fill="none" stroke="${cream}" stroke-opacity="0.18" stroke-width="5"/>
<!--mid-->
<ellipse cx="1200" cy="360" rx="360" ry="380" fill="url(#dbtefx-md-castle)"/>
${queen}
<path d="M-20 ${H + 20}V800C200 780 500 820 800 800S1300 770 1640 790V${H + 20}Z" fill="${mix(t.bg, t.accent2, 0.12)}"/>
<path d="M-20 800C200 780 500 820 800 800S1300 770 1640 790" fill="none" stroke="${cream}" stroke-opacity="0.35" stroke-width="7" stroke-linecap="round"/>
<g transform="translate(${n1(chX - cx * chS)} ${n1(860 - 860 * chS)}) scale(${chS})">
<path d="M${cx - 30} 330h60V450h-60Z" fill="url(#dbtefx-md-choc)"/>
<path d="M${cx - 30} 352L${cx} 200L${cx + 30} 352Z" fill="url(#dbtefx-md-tower)"/><path d="${stripes}" stroke="${cream}" stroke-opacity="0.85" stroke-width="5" clip-path="url(#dbtefx-md-spireclip)"/>
<clipPath id="dbtefx-md-spireclip"><path d="M${cx - 30} 352L${cx} 200L${cx + 30} 352Z"/></clipPath>
${drip(cx - 34, cx + 34, 354, cream, 3, 0.6)}
${win(cx - 9, 382, 18, 34, 0)}
${tiara}
<path d="M${cx + 128} 690V438h50V690Z" fill="url(#dbtefx-md-mint)"/>${drip(cx + 124, cx + 182, 442, cream, 5, 0.8)}${cone(cx + 153, 430, 72, 112)}
${win(cx + 142, 480, 22, 40, 1)}${win(cx + 142, 570, 22, 40, 2)}
<path d="M${cx - 158} 690V478h50V690Z" fill="url(#dbtefx-md-tower)"/>${drip(cx - 162, cx - 104, 482, cream, 7, 0.8)}${softServe(cx - 133, 474, 76)}
<g transform="translate(${cx - 123} 360)"><path d="M0 0V-40" stroke="${spongeDark}" stroke-width="2"/><path d="M0 -40l30 8l-30 8Z" fill="${t.accent}" style="animation: dbtefx-md-flag 4s ease-in-out infinite; transform-origin: 0 -32px;"/></g>
${win(cx - 144, 520, 22, 40, 3)}${win(cx - 144, 610, 22, 40, 4)}
${tier(cx - 80, cx + 80, 450, [[30, choc], [6, cream], [30, chocLit], [6, jam], [40, choc]], mix(t.accent, cream, 0.55), 11)}
<circle cx="${cx}" cy="505" r="24" fill="${gold}"/><circle cx="${cx}" cy="505" r="20" fill="url(#dbtefx-md-win)" style="animation: dbtefx-md-lamp 6s ease-in-out infinite;"/><path d="M${cx - 20} 505H${cx + 20}M${cx} 485V525" stroke="${spongeDark}" stroke-width="2"/>
${tier(cx - 130, cx + 130, 562, [[44, pink], [7, cream], [44, mix(pink, t.bg, 0.12)], [8, cream], [27, pinkDark]], cream, 13)}
${win(cx - 106, 580, 24, 46, 5)}${win(cx - 50, 580, 24, 46, 6)}${win(cx + 26, 580, 24, 46, 7)}${win(cx + 82, 580, 24, 46, 8)}
${[-112, -74, -36, 36, 74, 112].map((dx) => rosette(cx + dx, 558) + strawberry(cx + dx, 546)).join('')}
${tier(cx - 165, cx + 165, 690, [[50, sponge], [8, cream], [8, jam], [44, sponge], [30, spongeDark]], mix(t.accent2, cream, 0.4), 17)}
<path d="${arch(cx - 30, 724, 60, 116)}" fill="${gold}"/><path d="${arch(cx - 24, 730, 48, 110)}" fill="url(#dbtefx-md-choc)"/>
<path d="M${cx} 734V840M${cx - 24} 770H${cx + 24}M${cx - 24} 800H${cx + 24}" stroke="${mix(choc, '#000000', 0.4)}" stroke-width="2.4"/>
${win(cx - 136, 730, 28, 48, 9)}${win(cx - 82, 730, 28, 48, 10)}${win(cx + 54, 730, 28, 48, 11)}${win(cx + 108, 730, 28, 48, 12)}
<path d="M${cx - 200} 840Q${cx} 870 ${cx + 200} 840L${cx + 186} 852Q${cx} 882 ${cx - 186} 852Z" fill="url(#dbtefx-md-gold)"/><path d="M${cx - 200} 840Q${cx} 870 ${cx + 200} 840" fill="none" stroke="${cream}" stroke-width="3" stroke-dasharray="2 6" stroke-linecap="round"/>
<ellipse cx="${cx}" cy="858" rx="150" ry="22" fill="url(#dbtefx-md-halo)"/>
${lolly(cx - 196, 0)}<g class="dbtefx-md-lolly">${lolly(cx + 196, 1)}</g>
</g>
${sweets}
<!--near-->
<g transform="translate(250 868) rotate(-8) scale(3)">${macaron(t.accent)}</g>`;
};

export default scene;

// Particle systems (particles.js): sprinkles tumbling down, sugar sparkles.
export const particles = [{ kind: 'petal', count: 34, colors: ['accent', 'success', 'accent2', 'text'], light: true, speed: 0.6 }, { kind: 'star', count: 50, colors: ['accent2', 'text'] }];
