// Blackwing: crow-black lacquer with a violet sheen, black feathers swept
// over the corners, quill dividers under titles, feather-tip rosettes on the
// phase buttons, and the red barbs of Black-Winged Dragon as the one hot note.

import { mix } from '../../../lib/color.js';

// A flight feather lying along +x from the origin: a narrow leading vane
// with a lit violet rim, a broad trailing vane split by notches, a pale
// shaft and (optionally) the red streak of Black-Winged Dragon.
// The vane gradients, declared once per SVG.
const vanes = (t) => ['v', 'vl'].map((id, i) => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${t.bg}"/><stop offset="0.75" stop-color="${mix(t.bg, t.accent, 0.12)}"/><stop offset="1" stop-color="${mix(t.bg, t.accent, i ? 0.4 : 0.26)}"/></linearGradient>`).join('');
const r1 = (v) => Math.round(v * 10) / 10;
// The trailing edge from the tip back to the quill, split by two notches.
const trailing = (len, w) => {
  const y = (x) => w * Math.pow(Math.sin(Math.PI * Math.min(1, (len - x) / len) * 0.92 + 0.08), 0.7) * (0.35 + 0.65 * (1 - x / len) ** 0.2);
  let d = '';
  for (let i = 1; i <= 8; i++) {
    const x = len * (1 - i / 8);
    if (i === 3 || i === 5) d += `L${r1(x + len * 0.035)} ${r1(y(x) * 0.66)}`;
    d += `L${r1(x)} ${r1(y(x))}`;
  }
  return d;
};
const feather = (len, w, t, { lit = false, streak = true } = {}) => {
  const id = lit ? 'vl' : 'v';
  const rim = lit ? t.accent : mix(t.accent, t.bg, 0.12);
  return ''
    + `<path d="M0 0C${len * 0.3} ${-w * 0.5} ${len * 0.75} ${-w * 0.5} ${len} 0${trailing(len, w)}Z" fill="url(#${id})" stroke="${mix(t.bg, t.accent, 0.3)}" stroke-width="0.6"/>`
    + `<path d="M${len * 0.04} ${-w * 0.02}C${len * 0.3} ${-w * 0.5} ${len * 0.75} ${-w * 0.5} ${len} 0" fill="none" stroke="${rim}" stroke-width="${lit ? 1.1 : 0.9}" stroke-linecap="round"/>`
    + (streak ? `<path d="M${len * 0.34} ${w * 0.42}C${len * 0.5} ${w * 0.5} ${len * 0.6} ${w * 0.42} ${len * 0.68} ${w * 0.3}" fill="none" stroke="${t.accent2}" stroke-opacity="${lit ? 0.8 : 0.5}" stroke-width="${Math.max(0.7, w * 0.09)}" stroke-linecap="round"/>` : '')
    + `<path d="M${-len * 0.04} 0L${len * 0.96} 0" stroke="${mix(t.text, t.accent, 0.4)}" stroke-opacity="0.55" stroke-width="0.6"/>`;
};

// Primaries fanned out of a corner, like a folded wing tip.
const wingCorner = (t, kit, lit) => {
  const f = (a, len, w, streak) => `<g transform="translate(4 4) rotate(${a})">${feather(len, w, t, { lit, streak })}</g>`;
  return kit.svg(120, 46, `<defs>${vanes(t)}</defs>${f(31, 46, 9, false)}${f(22, 62, 10, false)}${f(13, 82, 11, false)}${f(4, 108, 11.5, true)}`);
};

// A quill: tapered vane on a long shaft with a red nib.
const quill = (t, kit) =>
  kit.svg(240, 12, `<path d="M8 6L234 6" stroke="${t.accent}" stroke-opacity="0.75" stroke-width="0.9"/><path d="M60 6C110 1.2 190 1.6 232 6C190 9.6 110 10.4 60 6Z" fill="${t.accent}" fill-opacity="0.38"/><path d="M96 6l6-3.6M132 6l6-3.9M168 6l6-3.6M114 6l6 3.4M150 6l6 3.6M186 6l6 3.2" stroke="${t.bg}" stroke-width="1"/><path d="M1 6l6-2.6 4 2.6-4 2.6z" fill="${t.accent2}"/>`).replace('<svg ', '<svg preserveAspectRatio="none" ');

// Herringbone barbs: the grain of a feather vane, very faint.
const barbs = (t, kit) => kit.svg(14, 10, `<path d="M0 8L7 3L14 8" fill="none" stroke="${t.accent}" stroke-opacity="0.07" stroke-width="1"/>`);

// Twelve feather tips around a circle, pointing outwards.
const rosette = (t, kit) => {
  let s = '';
  for (let i = 0; i < 10; i++) {
    s += `<g transform="rotate(${i * 36 - 90} 50 50) translate(50 13) rotate(24)">${feather(22, 6, t, { lit: i % 2 === 0, streak: i % 5 === 0 })}</g>`;
  }
  return kit.svg(100, 100, `<defs>${vanes(t)}</defs>${s}<circle cx="50" cy="50" r="33.5" fill="none" stroke="${t.accent}" stroke-opacity="0.55" stroke-width="1"/>`);
};

// A small wing folded back from the start of the life bar.
const lifeWing = (t, kit) => {
  const f = (a, len, w, y) => `<g transform="translate(58 ${y}) scale(1 -1) rotate(${a})">${feather(len, w, t, { lit: true })}</g>`;
  return kit.svg(62, 40, `<defs>${vanes(t)}</defs>${f(160, 34, 6, 24)}${f(170, 46, 7, 21)}${f(180, 56, 7.5, 18)}`);
};

// Compact data URI: only the characters CSS and URLs need escaped.
const svgUrl = (text) => `url("data:image/svg+xml,${text.replace(/(\d\.\d)\d+/g, '$1').replace(/"/g, "'").replace(/[%#<>{}]/g, encodeURIComponent)}")`;

export default (t, kit) => {
  const { sel, SEL, alpha } = kit;
  const lacquer = `linear-gradient(168deg, ${mix(t.raised, t.accent, 0.08)} 0%, ${t.surface} 46%, ${mix(t.surface, t.bg, 0.6)} 100%)`;
  const sheen = (o) => `linear-gradient(112deg, transparent 34%, ${alpha(t.accent, o)} 47%, ${alpha(t.text, o * 0.5)} 50%, transparent 63%)`;
  const edge = mix(t.border, t.accent, 0.35);
  const wings = 'var(--bw-wing) left top / 120px 46px no-repeat, var(--bw-wing-r) right bottom / 120px 46px no-repeat';
  // Rotated copies: the SVG itself is turned, so no transform on our pseudo.
  const rot = (svgText) => svgText.replace(/(<svg[^>]*>)([\s\S]*)<\/svg>/, (m, open, body) => `${open}<g transform="rotate(180 60 23)">${body}</g></svg>`);
  const w = wingCorner(t, kit, false);

  const panels = sel([
    '#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border',
    '#duel_room #filter > .border', '#duel_room #host_bg > .border',
  ]);
  const panelsAfter = panels.split(', ').map((s) => `${s}::after`).join(', ');
  const families = { success: ['about_me', 'preferences'], accent: ['social_media', 'animation'], accent2: ['profile_song', 'account', 'messages'], warning: ['duel_stats', 'profile_comments'] };
  const settings = Object.values(families).flat();
  const setPanels = sel(settings.map((c) => `#settings .${c}`));
  const setAfter = setPanels.split(', ').map((s) => `${s}::after`).join(', ');
  const dialogBefore = SEL.dialog.split(', ').map((s) => `${s}::before`).join(', ');
  const dialogAfter = SEL.dialog.split(', ').map((s) => `${s}::after`).join(', ');
  const titleAfter = SEL.dialogTitle.split(', ').map((s) => `${s}::after`).join(', ');
  const deckFrames = sel(['#deck_constructor .deck_bg', '#deck_constructor #search .search_bg']);
  const deckAfter = deckFrames.split(', ').map((s) => `${s}::after`).join(', ');
  const button = sel(['#content .button', '#content .combobox']);
  const buttonHover = sel(['#content .button:hover', '#content .button.button_selected', '#content .combobox:hover', '#content .combobox.combobox_selected']);
  const field = sel(['#content input[type=text]', '#content input[type=password]', '#content input:not([type])', '#content .textinput', '#content textarea']);
  const fieldFocus = sel(['#content input:focus', '#content textarea:focus']);
  const chamfer = 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)';
  const cut = (c) => `linear-gradient(135deg, transparent calc(50% - 0.7px), ${c} 0 calc(50% + 0.7px), transparent 0) left top / 6px 6px no-repeat, linear-gradient(135deg, transparent calc(50% - 0.7px), ${c} 0 calc(50% + 0.7px), transparent 0) right bottom / 6px 6px no-repeat`;

  return `
html body {
  --bw-wing: ${svgUrl(w)};
  --bw-wing-r: ${svgUrl(rot(w))};
  --bw-quill: ${svgUrl(quill(t, kit))};
  --bw-barbs: ${svgUrl(barbs(t, kit))};
}

/* Menu tiles: lacquer plates, a wing tip folded over two corners. */
${SEL.tile} {
  background: ${sheen(0.1)}, var(--bw-barbs), ${lacquer} !important;
  border-color: transparent !important;
  border-radius: 2px !important;
  box-shadow: inset 0 0 0 1px ${edge}, inset 0 1px 0 ${alpha(t.text, 0.09)}, inset 0 -3px 0 ${alpha(t.accent, 0.35)}, 0 14px 28px -14px #000000 !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; inset: -4px; pointer-events: none;
  background: ${wings}; opacity: 0.9; transition: opacity 0.2s;
}
${SEL.tileHover} {
  background: ${sheen(0.24)}, var(--bw-barbs), ${lacquer} !important;
  box-shadow: inset 0 0 0 1px ${t.accent}, inset 0 -3px 0 ${t.accent2}, 0 0 22px -6px ${alpha(t.accent, 0.8)}, 0 16px 30px -14px #000000 !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; filter: brightness(1.7) drop-shadow(0 0 4px ${alpha(t.accent, 0.6)}); }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${lacquer} !important; box-shadow: inset 0 3px 8px #000000, inset 0 0 0 1px ${t.accent} !important; }
${sel(['#main_menu .menu_btn .content span', '#main_menu .menu_btn span'])} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 14px ${alpha(t.accent, 0.45)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${edge} !important; border-radius: 1px !important; transform: rotate(45deg) scale(0.8); }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${t.accent2} !important; border-radius: 0 !important; }

/* Page titles: a quill under the heading. */
${sel(['#content .title1'])} { color: ${t.text} !important; text-shadow: 0 3px 0 ${t.bg}, 0 0 24px ${alpha(t.accent, 0.5)} !important; }
${sel(['#content .title1::after'])} {
  content: ""; position: absolute; left: calc(50% - 130px); width: 260px; bottom: 2px; height: 10px; pointer-events: none;
  background: var(--bw-quill) center / 100% 100% no-repeat;
}

/* Buttons and dropdowns: wing-blade chamfers, a violet sheen when hovered. */
${button} {
  background: ${cut(edge)}, ${lacquer} !important;
  border-color: ${edge} !important;
  border-radius: 0 !important;
  clip-path: ${chamfer};
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.08)}, inset 0 -2px 0 ${alpha(t.accent, 0.3)} !important;
}
${buttonHover} {
  background: ${cut(t.accent)}, ${sheen(0.3)}, ${lacquer} !important;
  border-color: ${t.accent} !important;
  box-shadow: inset 0 0 12px ${alpha(t.accent, 0.3)}, inset 0 -2px 0 ${t.accent2} !important;
}
${SEL.buttonDown} {
  background: ${cut(t.accent)}, linear-gradient(180deg, ${t.bg}, ${t.surface}) !important;
  border-color: ${t.accent} !important;
  box-shadow: inset 0 3px 6px #000000, inset 0 -1px 0 ${t.accent2} !important;
}

/* Text fields: an ink well with a quill-line underneath. */
${field} {
  background-color: ${mix(t.bg, t.surface, 0.5)} !important;
  border-color: ${mix(t.border, t.accent, 0.3)} !important;
  border-radius: 0 !important;
  box-shadow: inset 0 2px 5px ${alpha('#000000', 0.6)}, inset 0 -1px 0 ${alpha(t.accent, 0.55)} !important;
}
${fieldFocus} { outline: 1px solid ${t.accent} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.6)}, 0 0 10px ${alpha(t.accent, 0.45)} !important; }

/* Pop-ups: lacquer with wing tips and a quill under the title. */
${SEL.dialog} {
  background: ${sheen(0.08)}, var(--bw-barbs), ${lacquer} !important;
  border-radius: 2px !important;
  box-shadow: 0 0 0 1px ${edge}, inset 0 0 0 4px ${t.surface}, inset 0 0 0 5px ${alpha(t.accent, 0.35)}, 0 0 40px -10px ${alpha(t.accent, 0.4)}, 0 24px 60px -18px #000000 !important;
}
${dialogBefore} {
  content: ""; position: absolute; inset: -6px; width: auto; height: auto; transform: none; pointer-events: none; z-index: 1;
  background: ${wings}; filter: brightness(1.5);
}
${dialogAfter} { content: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 16px ${alpha(t.accent, 0.5)} !important; }
${titleAfter} {
  content: ""; position: absolute; left: 12%; right: 12%; bottom: -7px; height: 9px; pointer-events: none;
  background: var(--bw-quill) center / 100% 100% no-repeat;
}

/* Chat: a lacquer header with a quill edge over an ink-dark log. */
${SEL.chatTop} {
  background: ${sheen(0.14)}, var(--bw-barbs), linear-gradient(180deg, ${mix(t.raised, t.accent, 0.12)}, ${t.surface}) !important;
  box-shadow: inset 0 -1px 0 ${t.accent}, inset 0 -3px 0 ${alpha(t.accent2, 0.5)}, inset 0 1px 0 ${alpha(t.text, 0.08)} !important;
  border-radius: 2px 2px 0 0 !important;
}
${SEL.chat} { background: var(--bw-barbs), ${t.surface} !important; box-shadow: inset 1px 0 0 ${edge}, inset -1px 0 0 ${edge}, inset 0 -1px 0 ${edge} !important; }
${sel(['#chats .chat .cout_txt'])} { background-color: ${mix(t.bg, t.surface, 0.4)} !important; border-color: ${alpha(t.accent, 0.25)} !important; }
${sel(['#chats .chat .black_line'])} { background-color: ${t.accent} !important; }

/* Duel: life points as a feathered blade, phases as feather rosettes. */
${SEL.life} { border-color: ${t.accent} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 16px -4px ${alpha(t.accent, 0.7)}, inset 0 0 0 1px ${alpha(t.bg, 0.8)} !important; }
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -36px; top: -8px; width: 62px; height: 40px; pointer-events: none;
  background: ${svgUrl(lifeWing(t, kit))} center / contain no-repeat;
}
${sel(['#duel .lifepoints .life_bar'])} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: repeating-linear-gradient(118deg, transparent 0 5px, ${alpha(t.bg, 0.22)} 5px 6px), linear-gradient(180deg, ${alpha(t.text, 0.22)}, transparent 45%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: repeating-linear-gradient(118deg, transparent 0 5px, ${alpha(t.bg, 0.22)} 5px 6px), linear-gradient(180deg, ${alpha(t.text, 0.22)}, transparent 45%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: var(--bw-barbs), ${t.bg} !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 6px ${t.bg}, 0 0 2px ${t.bg} !important; }

${SEL.phase} { background: ${mix(t.border, t.accent, 0.4)} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${lacquer} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top'])} { border-radius: 50% !important; }
${sel(['#duel .phase .phase_inner'])} { border-radius: 50% !important; }
${sel(['#duel .phase .background::after'])} {
  content: ""; position: absolute; inset: -14px; pointer-events: none;
  background: ${svgUrl(rosette(t, kit))} center / 100% 100% no-repeat; opacity: 0.85;
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 18px ${alpha(t.accent2, 0.65)} !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 18px ${alpha(t.opp, 0.7)} !important; }
${sel(['#duel .phase span'])} { text-shadow: 0 1px 0 ${t.bg} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${t.accent} !important; border-radius: 2px !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${lacquer} !important; border-radius: 1px !important; }
${sel(['#duel #watchers'])} { background: var(--bw-barbs), ${t.surface} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 3px 0 0 ${t.accent} !important; }

/* Duel room panels: lacquer, a violet-to-red rim, wing tips. */
${panels} { background: var(--bw-barbs), ${alpha(t.surface, 0.86)} !important; border-radius: 3px !important; }
${panels.split(', ').map((s) => `${s}::before`).join(', ')} { filter: none !important; background: linear-gradient(135deg, ${t.accent}, ${t.border} 35%, ${t.border} 65%, ${t.accent2}) !important; }
${panelsAfter} {
  content: ""; position: absolute; inset: -6px; pointer-events: none;
  background: var(--bw-wing-r) right bottom / 120px 46px no-repeat;
}
${sel(['#duel_room .format_txt', '#duel_room #host_bg > span', '#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span'])} { text-shadow: 0 2px 0 ${t.bg}, 0 0 16px ${alpha(t.accent, 0.5)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${lacquer} !important; opacity: 0.95 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${sheen(0.22)}, ${lacquer} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(t.accent, 0.22)} !important; }
${sel(['#duel_room .duelbutton:hover'])} { border-color: ${t.accent} !important; }

/* Deck constructor: the deck on lacquer, search under a wing. */
${sel(['#deck_constructor .deck_bg'])} { background: var(--bw-barbs), linear-gradient(180deg, ${mix(t.surface, t.accent, 0.1)}, ${mix(t.surface, t.bg, 0.4)}) !important; box-shadow: inset 0 0 0 1px ${edge}, inset 3px 0 0 ${t.accent} !important; }
${sel(['#deck_constructor .side_bg'])} { background: var(--bw-barbs), ${mix(t.surface, t.accent, 0.16)} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 3px 0 0 ${t.accent2} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: var(--bw-barbs), ${mix(t.surface, t.accent2, 0.12)} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 3px 0 0 ${mix(t.accent, t.accent2, 0.5)} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${sheen(0.06)}, var(--bw-barbs), ${lacquer} !important; box-shadow: inset 0 0 0 1px ${edge} !important; border-radius: 2px !important; }
${deckAfter} { content: ""; position: absolute; inset: -3px; pointer-events: none; background: var(--bw-wing-r) right bottom / 120px 46px no-repeat; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 1 !important; text-shadow: 0 0 14px ${alpha(t.accent, 0.6)} !important; }
${sel(['#deck_constructor #search .title_txt'])} { text-shadow: 0 2px 0 ${t.bg}, 0 0 18px ${alpha(t.accent, 0.5)} !important; }

/* Settings boxes keep their colour family as a rim, on lacquer. */
${setPanels} { background-image: var(--bw-barbs), linear-gradient(168deg, ${alpha(t.text, 0.04)}, transparent 50%) !important; border-radius: 2px !important; }
${setAfter} { content: ""; position: absolute; inset: -9px; pointer-events: none; background: var(--bw-wing-r) right bottom / 120px 46px no-repeat; }
${Object.entries(families).map(([tk, list]) => `${sel(list.map((c) => `#settings .${c}`))} { background-color: color-mix(in srgb, ${t.surface} 90%, ${t[tk]}) !important; border-color: color-mix(in srgb, ${t[tk]} 38%, ${t.border}) !important; box-shadow: inset 0 3px 0 ${alpha(t[tk], 0.7)}, 0 16px 30px -16px #000000 !important; }`).join(' ')}

/* Scrollbars: a quill. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, transparent 30%, ${t.accent} 30% 70%, transparent 70%), ${alpha(t.accent, 0.25)} !important; border-radius: 1px !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, transparent 30%, ${t.accent} 30% 70%, transparent 70%), ${alpha(t.accent, 0.25)} !important; }
@media (prefers-reduced-motion: reduce) { html body #content *::before { transition: none !important; } }
`;
};
