// Branded: Albaz's brand fire against Mirrorjade's ice, in the Despia
// cathedral. Oxblood stone glazed with harlequin diamond glass, lancet-window
// emblems, gold chains along the top edges and around every
// phase, the brand flame-sigil in one corner and a cluster of ice shards in
// the other; buttons burn when hovered and frost over when pressed.

import { mix } from '../../../lib/color.js';

const r1 = (v) => Math.round(v * 10) / 10;
const FONT = 'Segoe UI, system-ui, Roboto, Arial, sans-serif';

// Compact data URI: only the characters CSS and URLs need escaped.
const svgUrl = (text) => `url("data:image/svg+xml,${text.replace(/(\d\.\d)\d+/g, '$1').replace(/"/g, "'").replace(/[%#<>{}]/g, encodeURIComponent)}")`;

// The Despia cathedral's harlequin glass (Branded in Red): a lattice of
// diamond panes, alternate panes faintly lit crimson and violet.
const cracks = (t, kit) =>
  kit.svg(28, 40, `<path d="M14 0L28 20L14 40L0 20Z" fill="${t.accent}" fill-opacity="0.05"/><path d="M0 0L14 20L0 40M28 0L14 20L28 40" fill="none" stroke="${t.accent2}" stroke-opacity="0.1" stroke-width="0.8"/><path d="M14 0L28 20L14 40L0 20Z" fill="none" stroke="${t.accent2}" stroke-opacity="0.1" stroke-width="0.8"/>`);

// A gold chain, one oval link and one edge-on link per tile.
const chain = (t, kit) => {
  const gold = mix(t.accent2, t.bg, 0.15);
  return kit.svg(26, 10, `<rect x="1.5" y="1.5" width="15" height="7" rx="3.5" fill="none" stroke="${mix(gold, t.bg, 0.5)}" stroke-width="2.6"/><rect x="1.5" y="1.5" width="15" height="7" rx="3.5" fill="none" stroke="${gold}" stroke-width="1.4"/><rect x="13" y="3.6" width="13" height="2.8" rx="1.4" fill="${gold}" stroke="${mix(gold, t.bg, 0.55)}" stroke-width="0.6"/><path d="M4 3h9" stroke="${t.text}" stroke-opacity="0.5" stroke-width="0.6"/>`);
};

// The emblem: a gothic lancet window (the Despia cathedral) with diamond
// panes in crimson, set in gold.
const sigil = (t, kit) =>
  kit.svg(28, 40, `<path d="M3 39V16Q3 6 14 1Q25 6 25 16V39Z" fill="${mix(t.accent, t.bg, 0.4)}" stroke="${t.accent2}" stroke-width="2"/><path d="M6 36L14 26L22 36M6 26L14 16L22 26M14 6L22 16M14 6L6 16M14 16V36" fill="none" stroke="${t.accent2}" stroke-width="1"/><path d="M14 26L18 31L14 36L10 31Z" fill="${t.accent}"/>`);

// Mirrorjade's ice: a cluster of shards growing out of a corner.
const ice = (t, kit) => {
  const shard = (pts, o) => `<path d="M${pts}Z" fill="${mix(t.text, t.accent, 0.7)}" fill-opacity="${o}" stroke="${mix('#ffffff', t.accent, 0.7)}" stroke-opacity="0.85" stroke-width="0.7" stroke-linejoin="round"/>`;
  return kit.svg(64, 50, `${shard('64 50L22 30L40 50', 0.42)}${shard('64 50L36 8L52 50', 0.65)}${shard('64 50L54 2L64 40', 0.55)}${shard('64 50L6 40L30 50', 0.32)}<path d="M36 8L46 50M54 2L58 50M22 30L46 50" stroke="${t.opp}" stroke-opacity="0.6" stroke-width="0.5"/>`);
};

// A ring of chain links around a phase button.
const chainRing = (t, kit) => {
  const gold = mix(t.accent2, t.bg, 0.1);
  let s = '';
  for (let i = 0; i < 16; i++) {
    const a = (i * 360) / 16;
    const rad = (a * Math.PI) / 180;
    const x = r1(50 + Math.cos(rad) * 40);
    const y = r1(50 + Math.sin(rad) * 40);
    s += i % 2
      ? `<rect x="-5" y="-1.4" width="10" height="2.8" rx="1.4" fill="${gold}" transform="translate(${x} ${y}) rotate(${a + 90})"/>`
      : `<rect x="-5.5" y="-3.4" width="11" height="6.8" rx="3.4" fill="none" stroke="${gold}" stroke-width="1.6" transform="translate(${x} ${y}) rotate(${a + 90})"/>`;
  }
  return kit.svg(100, 100, `<g stroke-linejoin="round">${s}</g>`);
};

// A short chain hanging off the end of the life bar, ending in a shackle.
const shackle = (t, kit) => {
  const gold = mix(t.accent2, t.bg, 0.1);
  return kit.svg(48, 24, `<rect x="2" y="7" width="12" height="10" rx="5" fill="none" stroke="${gold}" stroke-width="2.2"/><rect x="12" y="10.6" width="11" height="2.8" rx="1.4" fill="${gold}"/><rect x="21" y="8" width="13" height="8" rx="4" fill="none" stroke="${gold}" stroke-width="2"/><rect x="32" y="10.6" width="10" height="2.8" rx="1.4" fill="${gold}"/><path d="M40 4h6v16h-6" fill="none" stroke="${gold}" stroke-width="2.4"/>`);
};

// Pop-up buttons: an oxblood plate bound by a gold chain-link border.
const POP = [['ok_btn', 'OK', 153.4, 78.47, true], ['yes_btn', 'Yes', 153.4, 78.47, true], ['no_btn', 'No', 153.4, 78.47, false], ['cancel_btn', 'Cancel', 234.85, 78.5, false]];
const popButton = (t, label, W, H, primary) => {
  const gold = mix(t.accent2, t.bg, 0.1);
  const x = 8;
  const w = W - 16;
  const fill = primary ? mix(t.accent, t.bg, 0.45) : mix(t.raised, t.bg, 0.2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(fill, t.accent2, 0.15)}"/><stop offset="1" stop-color="${mix(fill, '#000000', 0.4)}"/></linearGradient><pattern id="c" width="26" height="10" patternUnits="userSpaceOnUse" x="${x}"><rect x="1.5" y="1.5" width="12" height="7" rx="3.5" fill="none" stroke="${gold}" stroke-width="1.6"/><rect x="12" y="3.6" width="13" height="2.8" rx="1.4" fill="${gold}"/></pattern></defs><rect x="${x}" y="10" width="${w}" height="58" rx="3" fill="url(#f)" stroke="${gold}" stroke-opacity="0.6" stroke-width="1.2"/><path d="M${x} 16V62M${x + w} 16V62" stroke="${gold}" stroke-width="2.4"/><rect x="${x}" y="5" width="${w}" height="10" fill="url(#c)"/><rect x="${x}" y="63" width="${w}" height="10" fill="url(#c)"/><text x="${W / 2}" y="40" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${t.text}">${label}</text></svg>`;
};

export default (t, kit) => {
  const { sel, SEL, alpha } = kit;
  const pseudo = (list, p) => list.split(', ').map((s) => `${s}::${p}`).join(', ');
  const stone = `linear-gradient(175deg, ${mix(t.raised, t.accent, 0.08)} 0%, ${t.surface} 55%, ${mix(t.surface, t.bg, 0.6)} 100%)`;
  const fire = (o) => `radial-gradient(ellipse 80% 60% at 50% 120%, ${alpha(t.accent, o)}, ${alpha(t.accent2, o * 0.25)} 45%, transparent 75%)`;
  const gold = mix(t.accent2, t.bg, 0.15);
  const rim = mix(t.border, t.accent2, 0.3);
  const plate = t.surface;
  const halo = `0 0 3px ${plate}, 0 0 5px ${plate}, 0 0 7px ${plate}, 0 0 9px ${plate}, 0 0 9px ${plate}`;
  const chains = 'var(--br-chain) left top / 26px 10px repeat-x';

  const panels = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const families = { success: ['about_me', 'preferences'], accent: ['social_media', 'animation'], accent2: ['profile_song', 'account', 'messages'], warning: ['duel_stats', 'profile_comments'] };
  const setPanels = sel(Object.values(families).flat().map((c) => `#settings .${c}`));
  const deckFrames = sel(['#deck_constructor .deck_bg', '#deck_constructor #search .search_bg']);
  const button = sel(['#content .button', '#content .combobox']);
  const buttonHover = sel(['#content .button:hover', '#content .button.button_selected', '#content .combobox:hover', '#content .combobox.combobox_selected']);
  const field = sel(['#content input[type=text]', '#content input[type=password]', '#content input:not([type])', '#content .textinput', '#content textarea']);
  const fieldFocus = sel(['#content input:focus', '#content textarea:focus']);

  return `
html body {
  --br-cracks: ${svgUrl(cracks(t, kit))};
  --br-chain: ${svgUrl(chain(t, kit))};
  --br-sigil: ${svgUrl(sigil(t, kit))};
  --br-ice: ${svgUrl(ice(t, kit))};
}

/* Menu tiles: charred stone, brand sigil on the left, ice on the right, fire beneath. */
${SEL.tile} {
  background: var(--br-sigil) 6px 6px / 14px 20px no-repeat, var(--br-ice) right bottom / 40px 31px no-repeat, ${fire(0.3)}, var(--br-cracks), ${stone} !important;
  border-color: transparent !important;
  border-radius: 3px !important;
  box-shadow: inset 0 0 0 1px ${rim}, inset 0 2px 0 ${alpha(t.accent2, 0.55)}, inset 0 -2px 0 ${alpha(t.accent, 0.5)}, 0 14px 28px -14px #000000 !important;
}
${SEL.tileHover} {
  background: var(--br-sigil) 6px 6px / 14px 20px no-repeat, var(--br-ice) right bottom / 40px 31px no-repeat, ${fire(0.6)}, var(--br-cracks), ${stone} !important;
  box-shadow: inset 0 0 0 1px ${t.accent2}, inset 0 -3px 0 ${t.accent}, inset 0 -16px 20px -14px ${alpha(t.warning, 0.6)}, 0 0 22px -6px ${alpha(t.accent, 0.9)} !important;
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
  box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.55)}, inset 0 -2px 0 ${alpha(t.accent, 0.35)} !important;
}
${buttonHover} {
  background: ${fire(0.55)}, ${stone} !important;
  border-color: ${t.accent2} !important;
  box-shadow: inset 0 1px 0 ${t.warning}, inset 0 -2px 0 ${t.accent}, 0 0 10px -2px ${alpha(t.accent, 0.8)} !important;
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
  box-shadow: inset 0 2px 5px #000000, inset 0 -1px 0 ${alpha(t.accent2, 0.5)} !important;
}
${fieldFocus} { outline: 1px solid ${t.accent2} !important; box-shadow: inset 0 2px 5px #000000, 0 0 10px ${alpha(t.accent, 0.55)} !important; }

/* Pop-ups: a stone tablet chained across the top, brand and ice in the corners. */
${SEL.dialog} {
  background: ${fire(0.22)}, var(--br-cracks), ${stone} !important;
  border-radius: 4px !important;
  box-shadow: 0 0 0 1px ${rim}, inset 0 0 0 1px ${alpha(t.accent2, 0.5)}, 0 0 44px -12px ${alpha(t.accent, 0.6)}, 0 24px 60px -18px #000000 !important;
}
${pseudo(SEL.dialog, 'before')} {
  content: ""; position: absolute; left: 0; right: 0; top: -5px; bottom: auto; width: auto; height: 10px; transform: none; pointer-events: none; z-index: 1;
  background: ${chains};
}
${pseudo(SEL.dialog, 'after')} {
  content: ""; position: absolute; left: 8px; right: 6px; top: 12px; bottom: 6px; width: auto; height: auto; transform: none; pointer-events: none;
  background: var(--br-sigil) left top / 22px 32px no-repeat, var(--br-ice) right bottom / 64px 50px no-repeat;
}
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.6)} !important; }

/* Chat: a chained header over charred stone. */
${SEL.chatTop} {
  background: var(--br-chain) left bottom / 26px 10px repeat-x, ${fire(0.25)}, ${stone} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.5)}, inset 0 0 0 1px ${rim} !important;
  border-radius: 3px 3px 0 0 !important;
}
${SEL.chat} { background: var(--br-cracks), ${t.surface} !important; box-shadow: inset 1px 0 0 ${rim}, inset -1px 0 0 ${rim}, inset 0 -1px 0 ${rim} !important; }
${sel(['#chats .chat .cout_txt'])} { background-color: ${mix(t.bg, t.surface, 0.4)} !important; border-color: ${alpha(t.accent2, 0.3)} !important; }
${sel(['#chats .chat .black_line'])} { background-color: ${gold} !important; }

/* Duel: a chained life bar, brand fire against Mirrorjade's ice; chained phases. */
${SEL.life} { border-color: ${gold} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px #000000, 0 0 16px -4px ${alpha(t.accent, 0.8)} !important; }
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -44px; top: 50%; width: 48px; height: 24px; margin-top: -12px; pointer-events: none;
  background: ${svgUrl(shackle(t, kit))} center / contain no-repeat;
}
${sel(['#duel .lifepoints .life_bar'])} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: radial-gradient(ellipse 30% 80% at 90% 100%, ${alpha(t.warning, 0.6)}, transparent), linear-gradient(180deg, ${alpha(t.warning, 0.4)}, transparent 45%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(120deg, transparent 30%, ${alpha('#ffffff', 0.35)} 31%, transparent 36%, transparent 62%, ${alpha('#ffffff', 0.3)} 63%, transparent 67%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.5)}, ${t.opp}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: var(--br-cracks), #000000 !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 #000000, 0 0 6px #000000, 0 0 3px #000000 !important; }

${SEL.phase} { background: ${gold} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_inner'])} { background: radial-gradient(circle at 50% 70%, ${alpha(t.accent, 0.25)}, transparent 60%), ${stone} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top', '#duel .phase .phase_inner'])} { border-radius: 50% !important; }
${sel(['#duel .phase .background::after'])} {
  content: ""; position: absolute; inset: -14px; pointer-events: none;
  background: ${svgUrl(chainRing(t, kit))} center / 100% 100% no-repeat;
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 22px ${alpha(t.accent, 0.85)}, 0 0 6px ${t.warning} !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 22px ${alpha(t.opp, 0.7)}, 0 0 6px #ffffff !important; }
${sel(['#duel .phase span'])} { text-shadow: 0 1px 0 #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${gold} !important; border-radius: 3px !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${stone} !important; border-radius: 2px !important; }
${sel(['#duel #watchers'])} { background: var(--br-cracks), ${t.surface} !important; box-shadow: inset 0 0 0 1px ${rim}, inset 0 2px 0 ${gold} !important; }

/* Pop-up buttons: oxblood plates bound in gold chain. */
${POP.map(([n, label, w, h, p]) => `${sel([`#content img[src*="/svg/${n}"]`, `#content img[data-src*="/svg/${n}"]`])} { content: ${svgUrl(popButton(t, label, w, h, p))} !important; }`).join(' ')}

/* Duel room panels: chained stone, fire at the foot, ice in the corner. */
${panels} { background: ${fire(0.16)}, var(--br-cracks), ${alpha(t.surface, 0.9)} !important; border-radius: 4px !important; }
${pseudo(panels, 'before')} { filter: none !important; background: linear-gradient(180deg, ${gold}, ${t.border} 30%, ${t.border} 70%, ${t.accent}) !important; }
${pseudo(panels, 'after')} { content: ""; position: absolute; inset: 4px; pointer-events: none; background: var(--br-ice) right bottom / 48px 38px no-repeat; }
${sel(['#duel_room .format_txt', '#duel_room #host_bg > span', '#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#settings .admin_lbl'])} { color: ${t.text} !important; text-shadow: ${halo}, 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.6)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${stone} !important; opacity: 0.95 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${fire(0.4)}, ${stone} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(t.accent2, 0.22)} !important; }
${sel(['#duel_room .duelbutton:hover'])} { border-color: ${t.accent2} !important; }

/* Deck constructor: charred stone under a chain, the search tablet branded. */
${sel(['#deck_constructor .deck_bg'])} { background: ${chains}, ${fire(0.14)}, var(--br-cracks), ${mix(t.surface, t.bg, 0.3)} !important; box-shadow: inset 0 0 0 1px ${rim} !important; }
${sel(['#deck_constructor .side_bg'])} { background: var(--br-cracks), ${mix(t.surface, t.accent, 0.12)} !important; box-shadow: inset 0 0 0 1px ${rim}, inset 0 2px 0 ${t.accent} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: var(--br-cracks), ${mix(t.surface, t.opp, 0.1)} !important; box-shadow: inset 0 0 0 1px ${rim}, inset 0 2px 0 ${t.opp} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${chains}, ${fire(0.12)}, var(--br-cracks), ${stone} !important; box-shadow: inset 0 0 0 1px ${rim} !important; border-radius: 4px 4px 0 0 !important; }
${pseudo(deckFrames, 'after')} { content: ""; position: absolute; inset: 4px; pointer-events: none; background: var(--br-ice) right bottom / 60px 47px no-repeat; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 1 !important; text-shadow: 0 0 14px ${alpha(t.accent, 0.7)} !important; }
${sel(['#deck_constructor #search .title_txt'])} { text-shadow: 0 2px 0 #000000, 0 0 18px ${alpha(t.accent, 0.6)} !important; }

/* Settings boxes: stone tablets, family colour as the rim, a chain over the top. */
${setPanels} { background-image: ${chains}, var(--br-cracks) !important; border-radius: 4px !important; }
${Object.entries(families).map(([tk, list]) => `${sel(list.map((c) => `#settings .${c}`))} { background-color: color-mix(in srgb, ${t.surface} 90%, ${t.accent}) !important; border-color: color-mix(in srgb, ${t.accent} 35%, ${t.border}) !important; box-shadow: 0 16px 30px -16px #000000 !important; }`).join(' ')}

/* Scrollbars: a gold chain bar. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${mix(gold, t.bg, 0.4)}, ${gold} 50%, ${mix(gold, t.bg, 0.4)}) !important; border-radius: 2px !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${mix(gold, t.bg, 0.4)}, ${gold} 50%, ${mix(gold, t.bg, 0.4)}) !important; }
`;
};
