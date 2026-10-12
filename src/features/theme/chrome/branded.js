// Branded: black-crimson Despia stone under Dogmatika white-gold. Harlequin
// diamond glass, the Branded Fusion cross-brand as the emblem, white-gold
// chains along the top edges and around every phase, gilt-rimmed plates for
// the pop-up buttons; buttons smoulder crimson on hover and frost when pressed.

import { mix } from '../../../lib/color.js';

const r1 = (v) => Math.round(v * 10) / 10;
const FONT = 'Segoe UI, system-ui, Roboto, Arial, sans-serif';
// Dogmatika white-gold: the theme's light, never Snake-Eye orange.
const whiteGold = (t) => mix(t.text, t.warning, 0.4);

// Compact data URI: only the characters CSS and URLs need escaped.
const svgUrl = (text) => `url("data:image/svg+xml,${text.replace(/(\d\.\d)\d+/g, '$1').replace(/"/g, "'").replace(/[%#<>{}]/g, encodeURIComponent)}")`;

// The Despia cathedral's harlequin glass (Branded in Red): a lattice of
// diamond panes, alternate panes faintly lit crimson and violet.
const cracks = (t, kit) =>
  kit.svg(28, 40, `<path d="M14 0L28 20L14 40L0 20Z" fill="${t.accent}" fill-opacity="0.05"/><path d="M0 0L14 20L0 40M28 0L14 20L28 40M14 0L28 20L14 40L0 20Z" fill="none" stroke="${whiteGold(t)}" stroke-opacity="0.07" stroke-width="0.8"/>`);

// A gold chain, one oval link and one edge-on link per tile.
const chain = (t, kit) => {
  const gold = mix(whiteGold(t), t.bg, 0.12);
  return kit.svg(26, 10, `<rect x="1.5" y="1.5" width="15" height="7" rx="3.5" fill="none" stroke="${mix(gold, t.bg, 0.5)}" stroke-width="2.6"/><rect x="1.5" y="1.5" width="15" height="7" rx="3.5" fill="none" stroke="${gold}" stroke-width="1.4"/><rect x="13" y="3.6" width="13" height="2.8" rx="1.4" fill="${gold}" stroke="${mix(gold, t.bg, 0.55)}" stroke-width="0.6"/><path d="M4 3h9" stroke="${t.text}" stroke-opacity="0.5" stroke-width="0.6"/>`);
};

// The emblem: the Branded Fusion cross-brand, a long crimson bar crossed
// short, white-gold rim, a white-hot diamond at the heart.
const sigil = (t, kit) =>
  kit.svg(16, 34, `<path d="M8 1L9.6 9L15 10.6L16 12L15 13.4L9.6 15L8 33L6.4 15L1 13.4L0 12L1 10.6L6.4 9Z" fill="${mix(t.accent, '#000000', 0.15)}" stroke="${whiteGold(t)}" stroke-width="1" stroke-linejoin="round"/><path d="M8 3.5L8.9 10L8 29L7.1 10Z" fill="${t.accent}"/><path d="M8 9.4L10.4 12L8 14.6L5.6 12Z" fill="#ffffff"/>`);

// A ring of chain links around a phase button.
const chainRing = (t, kit) => {
  const gold = mix(whiteGold(t), t.bg, 0.1);
  let s = '';
  for (let i = 0; i < 16; i++) {
    const a = (i * 360) / 16;
    const rad = (a * Math.PI) / 180;
    const x = r1(50 + Math.cos(rad) * 40);
    const y = r1(50 + Math.sin(rad) * 40);
    s += i % 2
      ? `<rect x="-4.5" y="-1.2" width="9" height="2.4" rx="1.2" fill="${gold}" transform="translate(${x} ${y}) rotate(${a + 90})"/>`
      : `<rect x="-5" y="-3" width="10" height="6" rx="3" fill="none" stroke="${gold}" stroke-width="1.5" transform="translate(${x} ${y}) rotate(${a + 90})"/>`;
  }
  return kit.svg(100, 100, `<g stroke-linejoin="round">${s}</g>`);
};

// One full oval chain link, threaded through the life bar's frame edge.
const shackle = (t, kit) => {
  const gold = mix(whiteGold(t), t.bg, 0.1);
  const dark = mix(gold, '#000000', 0.55);
  return kit.svg(30, 22, `<rect x="2" y="2" width="26" height="18" rx="9" fill="none" stroke="${dark}" stroke-width="4.6"/><rect x="2" y="2" width="26" height="18" rx="9" fill="none" stroke="${gold}" stroke-width="2.8"/><path d="M8 4.6h12" stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.9" stroke-linecap="round"/>`);
};

// Pop-up buttons: a black-crimson plate in a solid gilt rim, a cross-brand
// diamond stud at each end.
const POP = [['ok_btn', 'OK', 153.4, 78.47, true], ['yes_btn', 'Yes', 153.4, 78.47, true], ['no_btn', 'No', 153.4, 78.47, false], ['cancel_btn', 'Cancel', 234.85, 78.5, false]];
const popButton = (t, label, W, H, primary) => {
  const gold = whiteGold(t);
  const x = 6;
  const w = r1(W - 12);
  const fill = primary ? mix(t.accent, '#000000', 0.45) : mix(t.bg, t.text, 0.08);
  const stud = (cx) => `<path d="M${r1(cx)} ${H / 2 - 7}L${r1(cx + 5)} ${H / 2}L${r1(cx)} ${H / 2 + 7}L${r1(cx - 5)} ${H / 2}Z" fill="${primary ? '#ffffff' : t.accent}" stroke="${gold}" stroke-width="1"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(fill, gold, 0.18)}"/><stop offset="0.5" stop-color="${fill}"/><stop offset="1" stop-color="${mix(fill, '#000000', 0.5)}"/></linearGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.35" stop-color="${gold}"/><stop offset="1" stop-color="${mix(gold, t.bg, 0.45)}"/></linearGradient></defs><rect x="${x}" y="8" width="${w}" height="${H - 16}" rx="5" fill="url(#g)"/><rect x="${x + 3.5}" y="11.5" width="${r1(w - 7)}" height="${r1(H - 23)}" rx="3" fill="${mix(t.bg, '#000000', 0.4)}"/><rect x="${x + 5}" y="13" width="${r1(w - 10)}" height="${r1(H - 26)}" rx="2.5" fill="url(#f)"/><path d="M${x + 8} 15.5H${r1(x + w - 8)}" stroke="#ffffff" stroke-opacity="0.25" stroke-width="1.2"/>${stud(x + 17)}${stud(x + w - 17)}<text x="${W / 2}" y="${H / 2 + 1}" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${t.text}" stroke="#000000" stroke-opacity="0.5" stroke-width="0.6">${label}</text></svg>`;
};

export default (t, kit) => {
  const { sel, SEL, alpha } = kit;
  const wg = whiteGold(t);
  const pseudo = (list, p) => list.split(', ').map((s) => `${s}::${p}`).join(', ');
  const stone = `linear-gradient(175deg, ${mix(t.bg, t.accent, 0.14)} 0%, ${mix(t.bg, t.accent, 0.06)} 55%, ${mix(t.bg, '#000000', 0.4)} 100%)`;
  const fire = (o) => `radial-gradient(ellipse 80% 60% at 50% 120%, ${alpha(t.accent, o)}, ${alpha(t.accent, o * 0.3)} 45%, transparent 75%)`;
  const gold = mix(wg, t.bg, 0.12);
  const rim = mix(mix(t.bg, t.accent, 0.3), wg, 0.25);
  const plate = t.surface;
  const halo = `0 0 3px ${plate}, 0 0 5px ${plate}, 0 0 7px ${plate}, 0 0 9px ${plate}, 0 0 9px ${plate}`;
  const chains = 'var(--br-chain) left top / 26px 10px repeat-x';

  const panels = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const families = { success: ['about_me', 'preferences'], accent: ['social_media', 'animation'], accent2: ['profile_song', 'account', 'messages'], warning: ['duel_stats', 'profile_comments'] };
  const setPanels = sel(Object.values(families).flat().map((c) => `#settings .${c}`));
  const button = sel(['#content .button', '#content .combobox']);
  const buttonHover = sel(['#content .button:hover', '#content .button.button_selected', '#content .combobox:hover', '#content .combobox.combobox_selected']);
  const field = sel(['#content input[type=text]', '#content input[type=password]', '#content input:not([type])', '#content .textinput', '#content textarea']);
  const fieldFocus = sel(['#content input:focus', '#content textarea:focus']);

  return `
html body {
  --br-cracks: ${svgUrl(cracks(t, kit))};
  --br-chain: ${svgUrl(chain(t, kit))};
  --br-sigil: ${svgUrl(sigil(t, kit))};
}

/* Menu tiles: black-crimson stone, the cross-brand on the left edge, crimson glow beneath. */
${SEL.tile} {
  background: var(--br-sigil) 3px center / 12px 26px no-repeat, ${fire(0.3)}, var(--br-cracks), ${stone} !important;
  border-color: transparent !important;
  border-radius: 3px !important;
  box-shadow: inset 0 0 0 1px ${rim}, inset 0 2px 0 ${alpha(wg, 0.55)}, inset 0 -2px 0 ${alpha(t.accent, 0.5)}, 0 14px 28px -14px #000000 !important;
}
${SEL.tileHover} {
  background: var(--br-sigil) 3px center / 12px 26px no-repeat, ${fire(0.6)}, var(--br-cracks), ${stone} !important;
  box-shadow: inset 0 0 0 1px ${wg}, inset 0 -3px 0 ${t.accent}, inset 0 -16px 20px -14px ${alpha(wg, 0.6)}, 0 0 22px -6px ${alpha(t.accent, 0.9)} !important;
}
${sel(['#main_menu .menu_btn:active .content'])} { background: ${stone} !important; box-shadow: inset 0 3px 10px #000000, inset 0 0 0 1px ${t.text} !important; }
${sel(['#main_menu .menu_btn .content span', '#main_menu .menu_btn span'])} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 14px ${alpha(t.accent, 0.55)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${gold} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${t.accent} !important; }

/* Page titles: a chain hung beneath, the brand at its centre. */
${sel(['#content .title1'])} { color: ${t.text} !important; text-shadow: 0 3px 0 #000000, 0 0 24px ${alpha(t.accent, 0.6)} !important; }
${sel(['#content .title1::after'])} {
  content: ""; position: absolute; left: calc(50% - 117px); width: 234px; bottom: 2px; height: 10px; pointer-events: none;
  background: ${chains};
  -webkit-mask: linear-gradient(90deg, transparent, #000000 20%, #000000 80%, transparent); mask: linear-gradient(90deg, transparent, #000000 20%, #000000 80%, transparent);
}

/* Buttons: stone with a gold lip; they catch fire on hover and frost when pressed. */
${button} {
  background: ${fire(0.18)}, ${stone} !important;
  border-color: ${rim} !important;
  border-radius: 2px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(wg, 0.55)}, inset 0 -2px 0 ${alpha(t.accent, 0.35)} !important;
}
${buttonHover} {
  background: ${fire(0.55)}, ${stone} !important;
  border-color: ${wg} !important;
  box-shadow: inset 0 1px 0 ${wg}, inset 0 -2px 0 ${t.accent}, 0 0 10px -2px ${alpha(t.accent, 0.8)} !important;
}
${SEL.buttonDown} {
  background: linear-gradient(180deg, ${alpha(t.text, 0.16)}, transparent 60%), ${t.bg} !important;
  border-color: ${t.text} !important;
  box-shadow: inset 0 0 0 1px ${alpha(t.text, 0.5)}, inset 0 3px 7px #000000 !important;
}

/* Text fields: soot-dark slots with a gold rule. */
${field} {
  background-color: ${mix(t.bg, t.surface, 0.5)} !important;
  border-color: ${rim} !important;
  border-radius: 2px !important;
  box-shadow: inset 0 2px 5px #000000, inset 0 -1px 0 ${alpha(wg, 0.5)} !important;
}
${fieldFocus} { outline: 1px solid ${wg} !important; box-shadow: inset 0 2px 5px #000000, 0 0 10px ${alpha(t.accent, 0.55)} !important; }

/* Pop-ups: a stone tablet chained across the top, the cross-brand in the corner. */
${SEL.dialog} {
  background: ${fire(0.22)}, var(--br-cracks), ${stone} !important;
  border-radius: 4px !important;
  box-shadow: 0 0 0 1px ${rim}, inset 0 0 0 1px ${alpha(wg, 0.5)}, 0 0 44px -12px ${alpha(t.accent, 0.6)}, 0 24px 60px -18px #000000 !important;
}
${pseudo(SEL.dialog, 'before')} {
  content: ""; position: absolute; left: 0; right: 0; top: -5px; bottom: auto; width: auto; height: 10px; transform: none; pointer-events: none; z-index: 1;
  background: ${chains};
}
${pseudo(SEL.dialog, 'after')} {
  content: ""; position: absolute; left: 8px; right: 6px; top: 12px; bottom: 6px; width: auto; height: auto; transform: none; pointer-events: none;
  background: var(--br-sigil) 4px 2px / 18px 38px no-repeat;
}
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.6)} !important; }
${sel(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d} .body_txt`))} { color: #e8d8c8 !important; }

/* Chat: a gilt-ruled header over black stone. */
${SEL.chatTop} {
  background: ${fire(0.25)}, ${stone} !important;
  box-shadow: inset 0 1px 0 ${alpha(wg, 0.5)}, inset 0 -2px 0 ${gold}, inset 0 0 0 1px ${rim} !important;
  border-radius: 3px 3px 0 0 !important;
}
${SEL.chat} { background: var(--br-cracks), ${t.surface} !important; box-shadow: inset 1px 0 0 ${rim}, inset -1px 0 0 ${rim}, inset 0 -1px 0 ${rim} !important; }
${sel(['#chats .chat .cout_txt'])} { background-color: ${mix(t.bg, t.surface, 0.4)} !important; border-color: ${alpha(wg, 0.3)} !important; }
${sel(['#chats .chat .black_line'])} { background-color: ${gold} !important; }

/* Duel: a chained life bar, brand crimson against white-gold; chained phases. */
${SEL.life} { border-color: ${gold} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px #000000, 0 0 16px -4px ${alpha(t.accent, 0.8)} !important; }
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; z-index: 3; left: -17px; top: 50%; width: 30px; height: 22px; margin-top: -11px; pointer-events: none;
  background: ${svgUrl(shackle(t, kit))} center / contain no-repeat;
}
${sel(['#duel .lifepoints .life_bar'])} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.45)}, transparent 45%), linear-gradient(90deg, ${mix(t.self, '#8a5418', 0.5)}, ${mix(t.self, t.warning, 0.3)} 60%, #a8834f) !important; box-shadow: inset -3px 0 0 ${t.accent}, inset 0 -2px 0 ${alpha('#5a2a08', 0.5)} !important; }
${SEL.lifeOpp} { background: linear-gradient(120deg, transparent 30%, ${alpha('#ffffff', 0.35)} 31%, transparent 36%, transparent 62%, ${alpha('#ffffff', 0.3)} 63%, transparent 67%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.5)}, ${t.opp}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: var(--br-cracks), #000000 !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 #000000, 0 0 6px #000000, 0 0 3px #000000 !important; }

${SEL.phase} { background: ${gold} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_inner'])} { background: radial-gradient(circle at 50% 70%, ${alpha(t.accent, 0.25)}, transparent 60%), ${stone} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top', '#duel .phase .phase_inner'])} { border-radius: 50% !important; }
${sel(['#duel .phase .background::after'])} {
  content: ""; position: absolute; inset: -9px; pointer-events: none;
  background: ${svgUrl(chainRing(t, kit))} center / 100% 100% no-repeat;
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 22px ${alpha(t.accent, 0.85)}, 0 0 6px ${wg} !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 22px ${alpha(t.opp, 0.7)}, 0 0 6px #ffffff !important; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 0 #000000, 0 0 4px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${gold} !important; border-radius: 3px !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${stone} !important; border-radius: 2px !important; }
/* Quit wears the menu tile's plate: brand, fire, cracked stone, gilt lip. */
${sel(['#duel #duel_quit_btn + .button'])} {
  background: var(--br-sigil) 4px center / 8px 16px no-repeat, ${fire(0.3)}, var(--br-cracks), ${stone} !important;
  border-color: ${rim} !important;
  color: ${t.text} !important;
  box-shadow: inset 0 0 0 1px ${rim}, inset 0 1px 0 ${alpha(wg, 0.55)}, inset 0 -2px 0 ${alpha(t.accent, 0.5)} !important;
}
${sel(['#duel #duel_quit_btn + .button:hover'])} { background: var(--br-sigil) 4px center / 8px 16px no-repeat, ${fire(0.6)}, var(--br-cracks), ${stone} !important; border-color: ${wg} !important; }
/* The playmat lines keep only their own ember glow (no extra bloom). */
${sel(['#duel img.field_zones', '#duel img.field_decks'])} { filter: drop-shadow(0 0 1px ${alpha(t.self, 0.35)}) !important; }
${sel(['#duel #watchers'])} { background: var(--br-cracks), ${t.surface} !important; box-shadow: inset 0 0 0 1px ${rim}, inset 0 2px 0 ${gold} !important; }

/* Pop-up buttons: black-crimson plates in a gilt rim. */
${POP.map(([n, label, w, h, p]) => `${sel([`#content img[src*="/svg/${n}"]`, `#content img[data-src*="/svg/${n}"]`])} { content: ${svgUrl(popButton(t, label, w, h, p))} !important; }`).join(' ')}

/* Duel room panels: black stone, crimson glow at the foot, a white-gold to crimson rim. */
${panels} { background: ${fire(0.16)}, var(--br-cracks), ${alpha(t.surface, 0.9)} !important; border-radius: 4px !important; }
${pseudo(panels, 'before')} { filter: none !important; background: linear-gradient(180deg, ${gold}, ${t.border} 30%, ${t.border} 70%, ${t.accent}) !important; }
${sel(['#duel_room .format_txt', '#duel_room #host_bg > span', '#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#settings .admin_lbl'])} { color: ${t.text} !important; text-shadow: ${halo}, 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.6)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${stone} !important; opacity: 0.95 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${fire(0.4)}, ${stone} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(wg, 0.22)} !important; }
${sel(['#duel_room .duelbutton:hover'])} { border-color: ${wg} !important; }

/* Deck constructor: charred stone under a chain, the search tablet branded. */
${sel(['#deck_constructor .deck_bg'])} { background: ${chains}, ${fire(0.14)}, var(--br-cracks), ${mix(t.surface, t.bg, 0.3)} !important; box-shadow: inset 0 0 0 1px ${rim} !important; }
${sel(['#deck_constructor .side_bg'])} { background: var(--br-cracks), ${mix(t.surface, t.accent, 0.12)} !important; box-shadow: inset 0 0 0 1px ${rim}, inset 0 2px 0 ${t.accent} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: var(--br-cracks), ${mix(t.surface, t.opp, 0.1)} !important; box-shadow: inset 0 0 0 1px ${rim}, inset 0 2px 0 ${t.opp} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${chains}, ${fire(0.12)}, var(--br-cracks), ${stone} !important; box-shadow: inset 0 0 0 1px ${rim} !important; border-radius: 4px 4px 0 0 !important; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 1 !important; text-shadow: 0 0 14px ${alpha(t.accent, 0.7)} !important; }
${sel(['#deck_constructor #search .title_txt'])} { text-shadow: 0 2px 0 #000000, 0 0 18px ${alpha(t.accent, 0.6)} !important; }

/* Settings boxes: stone tablets, family colour as the rim, a chain over the top. */
${setPanels} { background-image: ${chains}, var(--br-cracks) !important; border-radius: 4px !important; }
${Object.entries(families).map(([tk, list]) => `${sel(list.map((c) => `#settings .${c}`))} { background-color: color-mix(in srgb, ${t.surface} 90%, ${t.accent}) !important; border-color: color-mix(in srgb, ${t.accent} 35%, ${t.border}) !important; box-shadow: 0 16px 30px -16px #000000 !important; }`).join(' ')}

/* Scrollbars: a gold chain bar. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${mix(gold, t.bg, 0.4)}, ${gold} 50%, ${mix(gold, t.bg, 0.4)}) !important; border-radius: 2px !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${mix(gold, t.bg, 0.4)}, ${gold} 50%, ${mix(gold, t.bg, 0.4)}) !important; }
html body:has(#duel:not([style*="none"])) #dbte-skin-fx :is(.dbtefx-bd-herogrp, .dbtefx-bd-edge, .dbtefx-bd-top) { display: none; }
`;
};
