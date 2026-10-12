// Blackwing: the crow-men of the black wind. Jet-black plates with the oil
// sheen of a crow's feather (a teal-to-violet iridescent rim), crisp black
// quills folded into the corners, a feather wreath around every phase, and
// the red piping of Armor Master as the single hot note.

import { mix } from '../../../lib/color.js';

const r1 = (v) => Math.round(v * 10) / 10;
const FONT = 'Segoe UI, system-ui, Roboto, Arial, sans-serif';

// Compact data URI: only the characters CSS and URLs need escaped.
const svgUrl = (text) => `url("data:image/svg+xml,${text.replace(/(\d\.\d)\d+/g, '$1').replace(/"/g, "'").replace(/[%#<>{}]/g, encodeURIComponent)}")`;

// The trailing edge of a feather from the tip back to the quill, split by two notches.
const trailing = (len, w) => {
  const y = (x) => w * Math.pow(Math.sin(Math.PI * Math.min(1, (len - x) / len) * 0.92 + 0.08), 0.7) * (0.35 + 0.65 * (1 - x / len) ** 0.2);
  let d = '';
  for (let i = 1; i <= 8; i++) {
    const x = len * (1 - i / 8);
    if (i === 3 || i === 5) d += `L${r1(x + len * 0.035)} ${r1(y(x) * 0.62)}`;
    d += `L${r1(x)} ${r1(y(x))}`;
  }
  return d;
};

// A crisp black flight feather along +x: opaque jet vane, a 0.6 violet rim, a faint shaft.
const feather = (len, w, t) =>
  `<path d="M0 0C${r1(len * 0.3)} ${r1(-w * 0.5)} ${r1(len * 0.75)} ${r1(-w * 0.5)} ${len} 0${trailing(len, w)}Z" fill="${t.bg}" stroke="${t.accent}" stroke-width="0.6" stroke-linejoin="round"/>`
  + `<path d="M${r1(-len * 0.04)} 0L${r1(len * 0.9)} 0" stroke="${mix(t.accent, t.bg, 0.45)}" stroke-width="0.6"/>`;

// Barbs: fine diagonal lines raking up and out from the rachis on both vanes.
const barbs = (L, w) => {
  let d = '';
  for (let y = L * 0.12; y < L * 0.62; y += L * 0.055) d += `M0.6 ${r1(-y)}l${r1(w * 0.78)} ${r1(-w * 0.55)}`;
  for (let y = L * 0.12; y < L * 0.78; y += L * 0.07) d += `M-0.6 ${r1(-y)}l${r1(-w * 0.3)} ${r1(-w * 0.4)}`;
  return d;
};

// A broad crow primary pointing up (-y) from its base at the origin: a narrow
// leading vane, a broad trailing vane with one notch, a visible rachis.
const primary = (L, w, rim, shaft, fine = true) =>
  `<path d="M-1 0C${r1(-w * 0.45)} ${r1(-L * 0.3)} ${r1(-w * 0.4)} ${r1(-L * 0.78)} 0 ${-L}C${r1(w * 0.5)} ${r1(-L * 0.92)} ${w} ${r1(-L * 0.76)} ${w} ${r1(-L * 0.6)}L${r1(w * 0.72)} ${r1(-L * 0.55)}L${r1(w * 0.98)} ${r1(-L * 0.5)}C${r1(w * 0.95)} ${r1(-L * 0.28)} ${r1(w * 0.6)} ${r1(-L * 0.06)} 1 0Z" fill="url(#bk)" stroke="url(#ed)" stroke-width="0.7" stroke-linejoin="round"/>`
  + `<path d="M-1 ${r1(-L * 0.05)}C${r1(-w * 0.45)} ${r1(-L * 0.32)} ${r1(-w * 0.4)} ${r1(-L * 0.78)} 0 ${-L}" fill="none" stroke="${rim}" stroke-width="1.3" stroke-linecap="round"/>`
  + (fine ? `<path d="${barbs(L, w)}" stroke="${rim}" stroke-opacity="0.32" stroke-width="0.5"/>` : '')
  + `<path d="M0 2L${r1(w * 0.06)} ${r1(-L * 0.9)}" stroke="${shaft}" stroke-width="0.9" stroke-linecap="round"/>`;

// Jet with an oil sheen: teal toward the leading edge, violet at the trailing edge.
const featherDefs = (t, teal) => `<defs><linearGradient id="bk" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0" stop-color="${mix('#000000', teal, 0.4)}"/><stop offset="0.3" stop-color="${mix('#000000', t.accent, 0.05)}"/><stop offset="0.8" stop-color="${mix('#000000', t.accent, 0.14)}"/><stop offset="1" stop-color="${mix('#000000', t.accent, 0.35)}"/></linearGradient><linearGradient id="ed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.accent, '#ffffff', 0.3)}"/><stop offset="1" stop-color="${mix(t.accent, '#000000', 0.5)}"/></linearGradient><radialGradient id="gl"><stop offset="0" stop-color="${t.accent}" stop-opacity="0.8"/><stop offset="0.6" stop-color="${t.accent}" stop-opacity="0.3"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/></radialGradient></defs>`;

// Primaries overlapping like a folded crow wing: rim light teal on the front
// feather, violet on the ones behind.
const cluster = (t, kit, teal, W, H, feathers, glow = '') => {
  const shaft = mix(t.text, t.accent, 0.5);
  const s = feathers.map(([x, y, a, L, w], i) => `<g transform="translate(${x} ${y}) rotate(${a})">${primary(L, w, i === feathers.length - 1 ? teal : t.accent, shaft)}</g>`).join('');
  return kit.svg(W, H, `${featherDefs(t, teal)}${glow}${s}`);
};
// Corner crest: three primaries fanned out of a bottom-right corner (or,
// turned round, out of the top-left one).
const crestFeathers = [[54, 48, -20, 36, 9], [54, 48, -42, 42, 10], [54, 48, -64, 46, 10]];
const quills = (t, kit, teal) => cluster(t, kit, teal, 60, 50, crestFeathers);
const quillsTL = (t, kit, teal) => cluster(t, kit, teal, 60, 50, crestFeathers.map(([x, y, a, L, w]) => [60 - x, 50 - y, a + 180, L, w]));

// A quill divider: long shaft, black vane with a violet rim, a red nib.
const quillLine = (t, kit) =>
  kit.svg(240, 12, `<path d="M8 6L234 6" stroke="${t.accent}" stroke-width="0.8"/><path d="M58 6C110 0.8 190 1.4 232 6C190 10 110 11 58 6Z" fill="${t.bg}" stroke="${t.accent}" stroke-width="0.6"/><path d="M96 6l6-4M132 6l6-4.4M168 6l6-4M114 6l6 4M150 6l6 4.2M186 6l6 3.6" stroke="${mix(t.accent, t.bg, 0.5)}" stroke-width="0.6"/><path d="M1 6l6-2.6 4 2.6-4 2.6z" fill="${t.accent2}"/>`).replace('<svg ', '<svg preserveAspectRatio="none" ');

// A ruff of broad black feathers laid round a phase button, each overlapping
// the next, violet and teal rim light alternating.
const wreath = (t, kit, teal) => {
  const shaft = mix(t.text, t.accent, 0.3);
  let s = '';
  for (let i = 0; i < 14; i++) s += `<use href="#${i % 2 ? 'a' : 'b'}" transform="rotate(${r1(i * (360 / 14))} 50 50) translate(50 16) rotate(84)"/>`;
  return kit.svg(100, 100, `${featherDefs(t, teal)}<defs><g id="a">${primary(18, 7.5, t.accent, shaft, false)}</g><g id="b">${primary(18, 7.5, teal, shaft, false)}</g></defs>${s}`);
};

// The life blade's wing: seven long crow primaries fanned back from the
// blade's hilt (up-left round to down-left), violet-edged with dark gaps
// between them, the lowest rimmed teal, and three short coverts laid over
// their bases. Pivot at (118, 36); the blade's square end hides it.
const lifeWing = (t, kit, teal, up = false) => {
  const shaft = mix(t.text, t.accent, 0.5);
  const all = [[-38, 58, 7], [-52, 74, 7.5], [-66, 86, 8], [-80, 92, 8], [-94, 88, 8], [-108, 76, 7.5], [-122, 60, 7]];
  // The opponent's blade sits at the top edge: the wing folds up and back, clear of the deck below it.
  const fan = up ? all.slice(0, 5).map(([a, L, w]) => [a + 10, L, w]) : all;
  const coverts = (up ? [[-48, 34, 9], [-70, 40, 9.5], [-92, 34, 9]] : [[-58, 34, 9], [-80, 40, 9.5], [-102, 34, 9]]);
  const at = ([a, L, w], rim) => `<g transform="translate(118 36) rotate(${a})">${primary(L, w, rim, shaft)}</g>`;
  return kit.svg(125, 72, `${featherDefs(t, teal)}${fan.map((f, i) => at(f, i === fan.length - 1 ? teal : t.accent)).join('')}${coverts.map((f) => at(f, mix(t.accent, teal, 0.5))).join('')}`);
};

// Menu tiles: a narrow sheaf of the same primaries standing in the left
// edge, clear of the label.
const tileWing = (t, kit, teal) => {
  const shaft = mix(t.text, t.accent, 0.5);
  const fan = [[-4, 56, 5.5], [3, 64, 6], [10, 60, 6], [17, 50, 5.5]];
  return kit.svg(24, 70, `${featherDefs(t, teal)}${fan.map(([a, L, w], i) => `<g transform="translate(5 69) rotate(${a})">${primary(L, w, i === 0 ? teal : t.accent, shaft)}</g>`).join('')}`);
};

// The life blade: a jet bevel band round the gauge, the left end cut square
// for the wing, the right end drawn to a blade point, an iridescent outer rim
// (teal to violet; danger when low), a fuller groove along the top band and
// a fine violet lip round the window. Box coords: the gauge window is 3..153 x 3..28.
const lifeBlade = (t, kit, teal, low = false) => {
  const rimA = low ? t.danger : teal;
  const rimB = low ? mix(t.danger, '#000000', 0.25) : t.accent;
  const outer = 'M2 -2H149L158 15.5L149 33H2L-4 27V4Z';
  const hole = 'M7 3H149L153 7V24L149 28H7L3 24V7Z';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="164" height="37" viewBox="-5 -3 164 37"><defs>`
    + `<linearGradient id="j" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.raised, t.text, 0.12)}"/><stop offset="0.22" stop-color="${t.raised}"/><stop offset="0.5" stop-color="${t.bg}"/><stop offset="0.82" stop-color="#000000"/><stop offset="1" stop-color="${mix(t.bg, t.accent, 0.25)}"/></linearGradient>`
    + `<linearGradient id="r" x1="0" y1="0" x2="1" y2="0.3"><stop offset="0" stop-color="${rimA}"/><stop offset="0.45" stop-color="${rimB}"/><stop offset="0.7" stop-color="${mix(rimA, rimB, 0.5)}"/><stop offset="1" stop-color="${rimB}"/></linearGradient></defs>`
    + `<path d="${outer}${hole}" fill="url(#j)" fill-rule="evenodd"/>`
    + `<path d="${outer}" fill="none" stroke="url(#r)" stroke-width="1.4" stroke-linejoin="miter"/>`
    + `<path d="${hole}" fill="none" stroke="${low ? mix(t.danger, t.bg, 0.3) : mix(t.accent, t.bg, 0.25)}" stroke-width="0.9"/>`
    + `<path d="M10 0.4H146" stroke="${mix(t.text, rimA, 0.4)}" stroke-opacity="0.55" stroke-width="0.6"/>`
    + `<path d="M10 30.8H146" stroke="#000000" stroke-width="0.8"/>`
    + `<path d="M151 2.4L155.6 15.5L151 28.6" fill="none" stroke="${mix(t.text, rimA, 0.3)}" stroke-opacity="0.5" stroke-width="0.6"/>`
    + `<path d="M153.6 15.5l-2-1.9v3.8z" fill="${low ? t.danger : teal}"/>`
    + '</svg>';
};

// Pop-up buttons: near-square jet plates with one notched corner, an
// iridescent hairline, a white label (secondary: a dim rim).
const POP = [['ok_btn', 'OK', 153.4, 78.47, true], ['yes_btn', 'Yes', 153.4, 78.47, true], ['no_btn', 'No', 153.4, 78.47, false], ['cancel_btn', 'Cancel', 234.85, 78.5, false]];
const popButton = (t, label, W, H, primary) => {
  const w = label === 'Cancel' ? 150 : 92;
  const x = r1((W - w) / 2);
  const y = 7;
  const h = 64;
  const n = 12;
  const d = `M${x + n} ${y}H${x + w}V${y + h}H${x}V${y + n}Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="o" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mix(t.success, t.accent, 0.35)}"/><stop offset="0.5" stop-color="${t.accent}"/><stop offset="1" stop-color="${mix(t.success, t.accent, 0.35)}"/></linearGradient><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.bg, t.raised, 0.7)}"/><stop offset="1" stop-color="${t.bg}"/></linearGradient></defs><path d="${d}" fill="url(#f)" stroke="${primary ? 'url(#o)' : mix(t.border, t.muted, 0.4)}" stroke-width="${primary ? 2.4 : 2}"/>${primary ? `<path d="M${x + 14} ${y + h - 4}H${x + w - 14}" stroke="${t.accent2}" stroke-width="2"/>` : ''}<text x="${W / 2}" y="${y + h / 2 + 1}" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${primary ? '#ffffff' : t.text}">${label}</text></svg>`;
};

export default (t, kit) => {
  const { sel, SEL, alpha } = kit;
  const pseudo = (list, p) => list.split(', ').map((s) => `${s}::${p}`).join(', ');
  // Crow-feather teal: the success green pulled toward the violet.
  const teal = mix(t.success, t.accent, 0.35);
  // Jet: near-black with a cold gloss band at the top.
  const jet = `linear-gradient(180deg, ${alpha(t.text, 0.08)} 0%, transparent 34%), linear-gradient(180deg, ${mix(t.bg, t.raised, 0.8)} 0%, ${mix(t.bg, t.raised, 0.25)} 80%)`;
  const oil = (o) => `linear-gradient(105deg, transparent 28%, ${alpha(teal, o * 0.7)} 42%, ${alpha(t.accent, o)} 55%, transparent 70%)`;
  const iris = `linear-gradient(115deg, ${teal}, ${t.accent} 40%, ${mix(teal, t.accent, 0.5)} 60%, ${t.accent} 80%, ${teal})`;
  const irisLit = `linear-gradient(115deg, ${mix(teal, '#ffffff', 0.3)}, ${mix(t.accent, '#ffffff', 0.25)} 45%, ${teal} 75%, ${t.accent})`;
  const panel = mix(t.bg, t.surface, 0.6);
  const halo = `0 0 3px ${panel}, 0 0 5px ${panel}, 0 0 7px ${panel}, 0 0 9px ${panel}, 0 0 9px ${panel}`;
  const qBR = (w, h) => `var(--bw-quills) right bottom / ${w}px ${h}px no-repeat`;

  const panels = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckFrames = sel(['#deck_constructor .deck_bg', '#deck_constructor #search .search_bg']);
  const button = sel(['#content .button', '#content .combobox']);
  const buttonHover = sel(['#content .button:hover', '#content .button.button_selected', '#content .combobox:hover', '#content .combobox.combobox_selected']);
  const field = sel(['#content input[type=text]', '#content input[type=password]', '#content input:not([type])', '#content .textinput', '#content textarea']);
  const fieldFocus = sel(['#content input:focus', '#content textarea:focus']);
  const notch = 'polygon(7px 0, 100% 0, 100% 100%, 0 100%, 0 7px)';
  const notchLine = (c) => `linear-gradient(135deg, transparent calc(50% - 0.7px), ${c} 0 calc(50% + 0.7px), transparent 0) left top / 7px 7px no-repeat`;

  return `
html body {
  --bw-quills: ${svgUrl(quills(t, kit, teal))};
  --bw-crest: ${svgUrl(quillsTL(t, kit, teal))};
  --bw-quill: ${svgUrl(quillLine(t, kit))};
  --bw-wing: ${svgUrl(tileWing(t, kit, teal))};
}

/* Menu tiles: jet plates cut at two corners, an oil-sheen rim and a raking
   sheen, crow-feather crests fanned out of the cut corners (as on the pop-ups). */
${SEL.tile} {
  background: ${notchLine(teal)}, linear-gradient(-45deg, transparent calc(50% - 0.7px), ${t.accent} 0 calc(50% + 0.7px), transparent 0) right bottom / 9px 9px no-repeat, ${oil(0.09)}, ${jet} !important;
  border-color: transparent !important;
  border-image: ${iris} 1 / 1px !important;
  border-radius: 0 !important;
  clip-path: polygon(7px 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%, 0 7px);
  box-shadow: inset 0 -2px 0 ${alpha(t.accent, 0.25)}, inset 0 1px 0 ${alpha(t.text, 0.08)} !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; inset: 1px; pointer-events: none; opacity: 0.7;
  background: linear-gradient(90deg, ${teal}, ${t.accent} 60%, transparent) left top / 100% 2px no-repeat, var(--bw-wing) 1px bottom / auto 72% no-repeat, var(--bw-quills) right bottom / auto 46% no-repeat; transition: filter 0.2s, opacity 0.2s;
}
${SEL.tileHover} {
  background: ${notchLine(teal)}, linear-gradient(-45deg, transparent calc(50% - 0.7px), ${t.accent} 0 calc(50% + 0.7px), transparent 0) right bottom / 9px 9px no-repeat, ${oil(0.24)}, ${jet} !important;
  border-image: ${irisLit} 1 / 1px !important;
  box-shadow: inset 0 0 18px -4px ${alpha(t.accent, 0.7)}, inset 0 -2px 0 ${teal} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; filter: brightness(1.35) drop-shadow(0 0 3px ${alpha(teal, 0.7)}); }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${t.bg} !important; box-shadow: inset 0 3px 8px #000000, inset 0 -2px 0 ${t.accent2} !important; }
${sel(['#main_menu .menu_btn .content span', '#main_menu .menu_btn span'])} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 12px ${alpha(t.accent, 0.4)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${teal} !important; border-radius: 1px !important; transform: rotate(45deg) scale(0.8); }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${t.accent} !important; border-radius: 0 !important; }

/* Page titles: a quill beneath. */
${sel(['#content .title1'])} { color: ${t.text} !important; text-shadow: 0 3px 0 #000000, 0 0 22px ${alpha(t.accent, 0.45)} !important; }
${sel(['#content .title1::after'])} {
  content: ""; position: absolute; left: calc(50% - 130px); width: 260px; bottom: 2px; height: 10px; pointer-events: none;
  background: var(--bw-quill) center / 100% 100% no-repeat;
}

/* Buttons and dropdowns: jet, one notched corner, an oil-sheen hairline. */
${button} {
  background: ${notchLine(teal)}, ${jet} !important;
  border-color: ${mix(t.border, t.accent, 0.3)} !important;
  border-image: ${iris} 1 !important;
  border-radius: 0 !important;
  clip-path: ${notch};
  color: ${t.text} !important;
  box-shadow: none !important;
}
${buttonHover} {
  background: ${notchLine(teal)}, ${oil(0.32)}, ${jet} !important;
  border-image: ${irisLit} 1 !important;
  box-shadow: inset 0 -2px 0 ${t.accent2} !important;
}
${SEL.buttonDown} {
  background: ${notchLine(teal)}, ${t.bg} !important;
  border-image: ${iris} 1 !important;
  box-shadow: inset 0 3px 6px #000000 !important;
}

/* Pop-up buttons drawn in jet. */
${POP.map(([n, label, w, h, p]) => `${sel([`#content img[src*="/svg/${n}"]`, `#content img[data-src*="/svg/${n}"]`])} { content: ${svgUrl(popButton(t, label, w, h, p))} !important; }`).join('\n')}

/* Text fields: jet wells with a violet underline. */
${field} {
  background-color: ${t.bg} !important;
  border-color: ${mix(t.border, t.accent, 0.25)} !important;
  border-radius: 0 !important;
  box-shadow: inset 0 2px 5px #000000, inset 0 -1px 0 ${alpha(t.accent, 0.6)} !important;
}
${fieldFocus} { outline: 1px solid ${teal} !important; box-shadow: inset 0 2px 5px #000000, 0 0 10px ${alpha(t.accent, 0.5)} !important; }

/* Pop-ups: jet in a double oil-sheen frame, feather crests in two corners. */
${SEL.dialog} {
  background: ${oil(0.06)}, ${jet} !important;
  border-radius: 0 !important;
  box-shadow: inset 0 0 0 4px ${panel}, inset 0 0 0 5px ${alpha(t.accent, 0.45)}, 0 0 40px -12px ${alpha(t.accent, 0.5)}, 0 24px 60px -18px #000000 !important;
}
${pseudo(SEL.dialog, 'before')} {
  content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; transform: none; pointer-events: none; z-index: 1;
  background: var(--bw-crest) left top / 78px 65px no-repeat, ${qBR(78, 65)};
}
${pseudo(SEL.dialog, 'after')} {
  content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; transform: none; pointer-events: none;
  border: 1px solid transparent; border-image: ${iris} 1; background: none;
}
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 14px ${alpha(t.accent, 0.45)} !important; }
${pseudo(SEL.dialogTitle, 'after')} {
  content: ""; position: absolute; left: 12%; right: 12%; bottom: -7px; height: 9px; pointer-events: none;
  background: var(--bw-quill) center / 100% 100% no-repeat;
}

/* Chat: a jet header on an oil-sheen line. */
${SEL.chatTop} {
  background: ${oil(0.12)}, ${jet} !important;
  box-shadow: inset 0 -1px 0 ${t.accent}, inset 0 -2px 0 ${alpha(teal, 0.5)} !important;
  border-radius: 0 !important;
}
${SEL.chat} { background: ${panel} !important; box-shadow: inset 1px 0 0 ${alpha(t.accent, 0.4)}, inset -1px 0 0 ${alpha(teal, 0.4)}, inset 0 -1px 0 ${alpha(t.accent, 0.4)} !important; }
${sel(['#chats .chat .cout_txt'])} { background-color: ${t.bg} !important; border-color: ${alpha(t.accent, 0.25)} !important; }
${sel(['#chats .chat .black_line'])} { background-color: ${t.accent} !important; }

/* Duel: the life gauge set in a jet blade (chamfered end, blade point,
   iridescent rim), a fanned crow wing at its hilt; teal oil-sheen fill for
   you, violet for the opponent. */
${SEL.life} { border-color: transparent !important; border-image: none !important; border-radius: 0 !important; box-shadow: none !important; }
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -8px; top: -6px; width: 164px; height: 37px; pointer-events: none;
  background: ${svgUrl(lifeBlade(t, kit, teal))} center / 100% 100% no-repeat;
}
${sel(['#duel .lifepoints:is([data-dbte-lp~="low"], [data-dbte-lp~="zero"]) .life_border::before'])} { background-image: ${svgUrl(lifeBlade(t, kit, teal, true))}; }
${sel(['#duel .lifepoints::before'])} {
  content: ""; position: absolute; left: -112px; top: -20px; width: 125px; height: 72px; pointer-events: none;
  background: ${svgUrl(lifeWing(t, kit, teal))} center / 100% 100% no-repeat;
  filter: drop-shadow(0 2px 3px #000000);
}
${sel(['#duel #lifepoints2::before'])} { left: -79px; top: -10px; width: 90px; height: 52px; background-image: ${svgUrl(lifeWing(t, kit, teal, true))}; }
${sel(['#duel .lifepoints .life_bar'])} { border-radius: 0 !important; }
/* The hit ring follows the blade: the cut hilt corner and the point. */
${sel(['#duel .lifepoints'])} { --dbte-lp-clip: polygon(0 0, 147px 0, 100% 50%, 147px 100%, 6px 100%, 0 calc(100% - 6px)); --dbte-lp-outline: transparent; }
${SEL.lifeSelf} { background: var(--bw-hit, linear-gradient(transparent, transparent)), linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.45)} 0 2px, transparent 2px), ${oil(0.22)}, linear-gradient(180deg, ${alpha('#ffffff', 0.5)}, ${alpha('#ffffff', 0.2)} 30%, transparent 42%, transparent 70%, ${alpha('#000000', 0.25)}), linear-gradient(90deg, ${mix(t.self, t.bg, 0.6)}, ${t.self} 70%, ${mix(t.self, t.opp, 0.35)}) !important; }
${SEL.lifeOpp} { background: var(--bw-hit, linear-gradient(transparent, transparent)), ${oil(0.18)}, linear-gradient(180deg, ${alpha('#ffffff', 0.2)}, transparent 40%, ${alpha('#000000', 0.25)}), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.6)}, ${t.opp} 70%, ${mix(t.opp, t.self, 0.3)}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: linear-gradient(180deg, ${mix(t.bg, t.raised, 0.6)}, #000000) !important; }
/* A hit rakes a sheen across the fill in the side's own colour; it sits under the empty track (.black_bar) so that stays dark. */
${sel(['#duel #lifepoints1[data-dbte-lp~="hit"]'])} { --bw-hit: linear-gradient(105deg, transparent 20%, ${alpha(teal, 0.55)} 42%, ${alpha('#ffffff', 0.5)} 50%, ${alpha(teal, 0.4)} 58%, transparent 78%); }
${sel(['#duel #lifepoints2[data-dbte-lp~="hit"]'])} { --bw-hit: linear-gradient(105deg, transparent 20%, ${alpha(t.opp, 0.55)} 42%, ${alpha('#ffffff', 0.5)} 50%, ${alpha(t.opp, 0.4)} 58%, transparent 78%); }

${SEL.phase} { background: ${mix(t.border, t.accent, 0.5)} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${jet} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top', '#duel .phase .phase_inner'])} { border-radius: 50% !important; }
${sel(['#duel .phase .background::after'])} {
  content: ""; position: absolute; inset: -3px; pointer-events: none; transform: scale(0.92);
  background: ${svgUrl(wreath(t, kit, teal))} center / 100% 100% no-repeat;
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 18px ${alpha(t.self, 0.75)} !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 18px ${alpha(t.opp, 0.75)} !important; }
${sel(['#duel .phase span'])} { color: #dcd8ee !important; text-shadow: 0 1px 0 #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${t.accent} !important; border-radius: 0 !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${jet} !important; border-radius: 0 !important; }
${sel(['#duel #watchers'])} { background: ${panel} !important; box-shadow: inset 0 0 0 1px ${alpha(t.accent, 0.4)}, inset 3px 0 0 ${teal} !important; }

/* Duel room panels: jet, an oil-sheen ring, quills in the corner. */
${panels} { background: ${alpha(panel, 0.94)} !important; border-radius: 0 !important; }
${pseudo(panels, 'before')} { filter: none !important; border-radius: 0 !important; background: ${iris} !important; }
${pseudo(panels, 'after')} { content: ""; position: absolute; right: 6px; bottom: 6px; width: 48px; height: 40px; pointer-events: none; background: ${qBR(48, 40)}; }
${sel(['#duel_room .format_txt', '#duel_room #host_bg > span', '#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span'])} { color: ${t.text} !important; text-shadow: ${halo}, 0 2px 0 #000000 !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${jet} !important; opacity: 0.95 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${oil(0.2)}, ${jet} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(t.accent, 0.22)} !important; }
${sel(['#duel_room .duelbutton:hover'])} { border-color: ${teal} !important; }

/* Deck constructor: jet panels framed in oil sheen. */
${sel(['#deck_constructor .deck_bg'])} { background: ${panel} !important; box-shadow: inset 3px 0 0 ${t.accent} !important; }
${sel(['#deck_constructor .side_bg'])} { background: ${mix(panel, t.accent, 0.1)} !important; box-shadow: inset 0 0 0 1px ${alpha(t.accent, 0.4)}, inset 3px 0 0 ${teal} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: ${mix(panel, teal, 0.07)} !important; box-shadow: inset 0 0 0 1px ${alpha(teal, 0.4)}, inset 3px 0 0 ${t.accent2} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${jet} !important; box-shadow: none !important; border-radius: 0 !important; }
${pseudo(deckFrames, 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; border: 1px solid transparent; border-image: ${iris} 1; background: ${qBR(54, 45)}; background-origin: content-box; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 1 !important; text-shadow: 0 0 12px ${alpha(t.accent, 0.55)} !important; }
${sel(['#deck_constructor #search .title_txt'])} { text-shadow: 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.45)} !important; }

/* Settings sections: jet with an oil-sheen frame. */
${SEL.settingsPanel} { background-color: ${alpha(panel, 0.94)} !important; border-image: ${iris} 1 / 1px !important; border-radius: 0 !important; }
${sel(['#settings .admin_lbl'])} { color: ${t.text} !important; text-shadow: ${halo}, 0 2px 0 #000000 !important; }

/* Scrollbars: a violet quill. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, transparent 30%, ${t.accent} 30% 70%, transparent 70%), ${alpha(teal, 0.25)} !important; border-radius: 0 !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, transparent 30%, ${t.accent} 30% 70%, transparent 70%), ${alpha(teal, 0.25)} !important; }
@media (prefers-reduced-motion: reduce) { html body #content *::before { transition: none !important; } }
${sel(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d} .body_txt`))} { color: #e0e0ec !important; }
`;
};
