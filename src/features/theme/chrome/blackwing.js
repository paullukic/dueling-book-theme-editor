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

// Four overlapping quills fanned up and left out of a bottom-right base.
const quills = (t, kit) => {
  const f = (a, len, w) => `<g transform="translate(90 54) rotate(${a})">${feather(len, w, t)}</g>`;
  return kit.svg(92, 56, `${f(232, 44, 8)}${f(218, 60, 9)}${f(204, 76, 10)}${f(192, 88, 10.5)}`);
};

// A crow's wing tip fanned from the left edge of a plate: seven long tapered
// primaries, black with an oil-slick sheen (teal along the leading edge,
// violet along the trailing edge), each with a pale rachis.
const wingEdge = (t, kit, teal) => {
  const prim = (L, w) => `M0 ${-w * 0.3}C${r1(L * 0.35)} ${r1(-w * 0.55)} ${r1(L * 0.75)} ${r1(-w * 0.5)} ${L} 0C${r1(L * 0.78)} ${r1(w * 0.75)} ${r1(L * 0.35)} ${r1(w * 1.05)} 0 ${r1(w * 0.75)}Z`;
  let s = '';
  for (let i = 5; i >= 0; i--) {
    const L = 96 + i * 13;
    const w = 17 + i * 0.8;
    s += `<g transform="translate(-8 ${r1(74 - i * 3)}) rotate(${-46 + i * 7.6})"><path d="${prim(L, w)}" fill="url(#bk)" stroke="#000000" stroke-width="0.6"/><path d="M${r1(L * 0.08)} ${r1(-w * 0.42)}C${r1(L * 0.4)} ${r1(-w * 0.56)} ${r1(L * 0.75)} ${r1(-w * 0.5)} ${L} 0" fill="none" stroke="url(#lt)" stroke-width="1.3"/><path d="M${L} 0C${r1(L * 0.78)} ${r1(w * 0.75)} ${r1(L * 0.35)} ${r1(w * 1.05)} ${r1(L * 0.1)} ${r1(w * 0.85)}" fill="none" stroke="url(#tr)" stroke-width="0.9"/><path d="M0 0L${r1(L * 0.94)} 0" stroke="${mix(t.text, t.accent, 0.5)}" stroke-opacity="0.45" stroke-width="0.7"/></g>`;
  }
  const defs = `<linearGradient id="bk" x1="0" y1="0" x2="0.25" y2="1"><stop offset="0" stop-color="${mix('#000000', teal, 0.55)}"/><stop offset="0.3" stop-color="#000000"/><stop offset="0.6" stop-color="#000000"/><stop offset="1" stop-color="${mix('#000000', t.accent, 0.5)}"/></linearGradient><linearGradient id="lt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${teal}" stop-opacity="0.2"/><stop offset="0.6" stop-color="${teal}"/><stop offset="1" stop-color="${t.accent}"/></linearGradient><linearGradient id="tr" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${t.accent}"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0.1"/></linearGradient>`;
  return kit.svg(200, 68, `<defs>${defs}</defs>${s}`);
};

// A quill divider: long shaft, black vane with a violet rim, a red nib.
const quillLine = (t, kit) =>
  kit.svg(240, 12, `<path d="M8 6L234 6" stroke="${t.accent}" stroke-width="0.8"/><path d="M58 6C110 0.8 190 1.4 232 6C190 10 110 11 58 6Z" fill="${t.bg}" stroke="${t.accent}" stroke-width="0.6"/><path d="M96 6l6-4M132 6l6-4.4M168 6l6-4M114 6l6 4M150 6l6 4.2M186 6l6 3.6" stroke="${mix(t.accent, t.bg, 0.5)}" stroke-width="0.6"/><path d="M1 6l6-2.6 4 2.6-4 2.6z" fill="${t.accent2}"/>`).replace('<svg ', '<svg preserveAspectRatio="none" ');

// A wreath of black feathers swept round a phase button.
const wreath = (t, kit) => {
  let s = '';
  for (let i = 0; i < 10; i++) s += `<g transform="rotate(${i * 36 - 90} 50 50) translate(50 13) rotate(24)">${feather(22, 6.5, t)}</g>`;
  return kit.svg(100, 100, `${s}<circle cx="50" cy="50" r="33.5" fill="none" stroke="${mix(t.success, t.accent, 0.35)}" stroke-opacity="0.7" stroke-width="0.8"/>`);
};

// A folded wing at the start of the life bar.
const lifeWing = (t, kit) => {
  const f = (a, len, w, y) => `<g transform="translate(58 ${y}) scale(1 -1) rotate(${a})">${feather(len, w, t)}</g>`;
  return kit.svg(62, 40, `${f(160, 34, 7, 24)}${f(170, 46, 8, 21)}${f(180, 56, 8.5, 18)}`);
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
  --bw-quills: ${svgUrl(quills(t, kit))};
  --bw-edge: ${svgUrl(wingEdge(t, kit, teal))};
  --bw-quill: ${svgUrl(quillLine(t, kit))};
}

/* Menu tiles: jet plates, an oil-sheen rim, black quills folded into the corner. */
${SEL.tile} {
  background: ${jet} !important;
  border-color: transparent !important;
  border-image: ${iris} 1 / 1px !important;
  border-radius: 0 !important;
  box-shadow: inset 0 -2px 0 ${alpha(t.accent, 0.25)}, 0 14px 26px -12px #000000 !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: var(--bw-edge) left bottom / auto 100% no-repeat; transition: filter 0.2s;
  -webkit-mask: linear-gradient(90deg, #000000 22%, transparent 66%); mask: linear-gradient(90deg, #000000 22%, transparent 66%);
}
${SEL.tileHover} {
  background: ${oil(0.2)}, ${jet} !important;
  border-image: ${irisLit} 1 / 1px !important;
  box-shadow: 0 0 20px -6px ${alpha(t.accent, 0.9)}, 0 0 14px -8px ${teal} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { filter: brightness(1.35) drop-shadow(0 0 3px ${alpha(teal, 0.7)}); }
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

/* Pop-ups: jet with an oil-sheen frame, quills folded into the corner. */
${SEL.dialog} {
  background: ${oil(0.06)}, ${jet} !important;
  border-radius: 0 !important;
  box-shadow: 0 0 40px -12px ${alpha(t.accent, 0.5)}, 0 24px 60px -18px #000000 !important;
}
${pseudo(SEL.dialog, 'before')} {
  content: ""; position: absolute; left: auto; top: auto; right: 6px; bottom: 6px; width: 92px; height: 56px; transform: none; pointer-events: none; z-index: 1;
  background: ${qBR(92, 56)};
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

/* Duel: a jet life blade with a folded wing; phases in feather wreaths. */
${SEL.life} { border-color: ${t.accent} !important; border-radius: 0 !important; box-shadow: 0 0 0 1px #000000, 0 0 0 2px ${alpha(teal, 0.5)}, 0 0 14px -4px ${alpha(t.accent, 0.8)} !important; }
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -38px; top: -8px; width: 62px; height: 40px; pointer-events: none;
  background: ${svgUrl(lifeWing(t, kit))} center / contain no-repeat;
}
${sel(['#duel .lifepoints .life_bar'])} { border-radius: 0 !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha(t.text, 0.25)}, transparent 45%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha(t.text, 0.25)}, transparent 45%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: #000000 !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 #000000, 0 0 6px #000000, 0 0 2px #000000 !important; }

${SEL.phase} { background: ${mix(t.border, t.accent, 0.5)} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${jet} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top', '#duel .phase .phase_inner'])} { border-radius: 50% !important; }
${sel(['#duel .phase .background::after'])} {
  content: ""; position: absolute; inset: -14px; pointer-events: none;
  background: ${svgUrl(wreath(t, kit))} center / 100% 100% no-repeat;
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 18px ${alpha(t.self, 0.75)} !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 18px ${alpha(t.opp, 0.75)} !important; }
${sel(['#duel .phase span'])} { text-shadow: 0 1px 0 #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${t.accent} !important; border-radius: 0 !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${jet} !important; border-radius: 0 !important; }
${sel(['#duel #watchers'])} { background: ${panel} !important; box-shadow: inset 0 0 0 1px ${alpha(t.accent, 0.4)}, inset 3px 0 0 ${teal} !important; }

/* Duel room panels: jet, an oil-sheen ring, quills in the corner. */
${panels} { background: ${alpha(panel, 0.94)} !important; border-radius: 0 !important; }
${pseudo(panels, 'before')} { filter: none !important; border-radius: 0 !important; background: ${iris} !important; }
${pseudo(panels, 'after')} { content: ""; position: absolute; right: 6px; bottom: 6px; width: 46px; height: 28px; pointer-events: none; background: ${qBR(46, 28)}; }
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
${pseudo(deckFrames, 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; border: 1px solid transparent; border-image: ${iris} 1; background: ${qBR(60, 36)}; background-origin: content-box; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 1 !important; text-shadow: 0 0 12px ${alpha(t.accent, 0.55)} !important; }
${sel(['#deck_constructor #search .title_txt'])} { text-shadow: 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.45)} !important; }

/* Settings sections: jet with an oil-sheen frame. */
${SEL.settingsPanel} { background-color: ${alpha(panel, 0.94)} !important; border-image: ${iris} 1 / 1px !important; border-radius: 0 !important; }
${sel(['#settings .admin_lbl'])} { color: ${t.text} !important; text-shadow: ${halo}, 0 2px 0 #000000 !important; }

/* Scrollbars: a violet quill. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, transparent 30%, ${t.accent} 30% 70%, transparent 70%), ${alpha(teal, 0.25)} !important; border-radius: 0 !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, transparent 30%, ${t.accent} 30% 70%, transparent 70%), ${alpha(teal, 0.25)} !important; }
@media (prefers-reduced-motion: reduce) { html body #content *::before { transition: none !important; } }
`;
};
