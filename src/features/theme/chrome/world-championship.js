// world-championship: the Nintendo DS games' interface. Rounded touch
// buttons in DS indigo with a light inner outline and a hard pixel drop
// shadow, the LCD dot grid on every screen, the blinking orange pixel
// brackets of the cursor, speed-stripe life bars from the battle cut-in, and
// pop-ups drawn as the lower screen hanging from its hinge.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const navy = mix(t.bg, t.surface, 0.55);
  const btn = mix(t.self, t.bg, 0.35);
  const btnUp = mix(t.self, t.raised, 0.35);
  const lav = mix(t.accent2, t.text, 0.62);
  const lavDeep = mix(t.accent2, t.surface, 0.5);
  const shell = mix(t.raised, t.text, 0.22);
  const shellDeep = mix(t.raised, t.bg, 0.35);
  const outline = mix(t.text, t.accent, 0.25);
  const ink = mix(t.bg, '#000000', 0.35);
  const orange = t.warning;
  const pink = t.accent2;

  // LCD dot grid (one DS pixel = 2 css px here).
  const lcd = svg(3, 3, `<path d="M0 .5H3M.5 0V3" stroke="#000000" stroke-opacity="0.14"/>`);
  // Pixel cursor brackets: four stepped corners.
  const brackets = svg(40, 40, `<g fill="${orange}" shape-rendering="crispEdges"><path d="M0 0h12v4H4v8H0z"/><path d="M40 0H28v4h8v8h4z"/><path d="M0 40h12v-4H4v-8H0z"/><path d="M40 40H28v-4h8v-8h4z"/></g><g fill="${mix(orange, '#000000', 0.55)}" shape-rendering="crispEdges"><path d="M4 4h8v2H6v6H4z"/><path d="M28 4h8v8h-2V6h-6z"/><path d="M4 36v-8h2v6h6v2z"/><path d="M36 36h-8v-2h6v-6h2z"/></g>`);
  // Hinge above the pop-up "lower screen".
  const hinge = svg(220, 26, `<rect x="0" y="6" width="220" height="16" rx="8" fill="${shellDeep}"/><rect x="12" y="2" width="56" height="22" rx="11" fill="${shell}" stroke="${shellDeep}" stroke-width="1.5"/><rect x="152" y="2" width="56" height="22" rx="11" fill="${shell}" stroke="${shellDeep}" stroke-width="1.5"/><rect x="18" y="5" width="44" height="5" rx="2.5" fill="#ffffff" fill-opacity="0.45"/><rect x="158" y="5" width="44" height="5" rx="2.5" fill="#ffffff" fill-opacity="0.45"/><circle cx="110" cy="14" r="3" fill="${t.success}"/>`);
  // Grid paper for panels: the touch screen's fine light-blue grid.
  const gridPaper = svg(24, 24, `<path d="M0 .5H24M.5 0V24" stroke="${t.accent}" stroke-opacity="0.07"/>`);

  // LP chip: white pixel lettering on a navy rounded tab.
  const lpChip = svg(40, 22, `<rect x="3" y="3" width="36" height="18" rx="5" fill="#000000" fill-opacity="0.5"/><rect x="1" y="1" width="36" height="18" rx="5" fill="${navy}" stroke="${outline}" stroke-width="2"/><text x="19" y="15" text-anchor="middle" font-family="Verdana, Tahoma, sans-serif" font-weight="700" font-size="12" fill="#ffffff">LP</text>`);
  const touch = (top, bot) => `var(--dbtc-u0), linear-gradient(180deg, ${top}, ${bot})`;
  const gloss = `inset 0 12px 8px -6px ${alpha('#ffffff', 0.28)}`;
  const pixelEdge = (c = outline) => `inset 0 0 0 2px ${alpha(c, 0.85)}, inset 0 0 0 3px ${alpha(ink, 0.6)}, 0 0 0 2px ${ink}, 4px 4px 0 0 ${alpha('#000000', 0.55)}`;
  const label = `color: #ffffff !important; text-shadow: 1px 0 0 ${ink}, -1px 0 0 ${ink}, 0 1px 0 ${ink}, 0 -1px 0 ${ink}, 2px 2px 0 ${ink} !important;`;
  const screen = `var(--dbtc-u0), var(--dbtc-u3), linear-gradient(180deg, ${mix(navy, t.accent2, 0.12)}, ${navy} 50%, ${mix(navy, t.opp, 0.2)})`;

  // Pop-up buttons: a blue touch button (primary), a lavender one (secondary).
  const popBtn = (txt, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 14;
    const top = primary ? btnUp : mix(lav, '#ffffff', 0.3);
    const bot = primary ? mix(btn, t.bg, 0.3) : lavDeep;
    const fill = primary ? '#ffffff' : ink;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="10" y="14" width="${bw}" height="56" rx="12" fill="#000000" fill-opacity="0.5"/><rect x="6" y="10" width="${bw}" height="56" rx="12" fill="url(#g)" stroke="${ink}" stroke-width="2.5"/><rect x="9" y="13" width="${bw - 6}" height="50" rx="9" fill="none" stroke="${primary ? outline : '#ffffff'}" stroke-opacity="0.85" stroke-width="2.5"/><rect x="14" y="16" width="${bw - 16}" height="16" rx="7" fill="#ffffff" fill-opacity="0.22"/><text x="${w / 2 - 2}" y="39" dominant-baseline="central" text-anchor="middle" font-family="Verdana, Tahoma, sans-serif" font-weight="700" font-size="24" fill="${fill}" ${primary ? `stroke="${ink}" stroke-width="3" paint-order="stroke"` : ''}>${txt}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = [['ok_btn', 'OK', true, false], ['yes_btn', 'Yes', true, false], ['no_btn', 'No', false, false], ['cancel_btn', 'Cancel', false, true]]
    .map(([n, txt, primary, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(txt, wide, primary))} !important; }`)
    .join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .title_txt.arial_black2']);
  const labels = sel(['#content .arial_black2:not(.title_txt):not(.title1)', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [lcd, brackets, hinge, gridPaper, lpChip].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: big rounded touch buttons with a light inner outline and a hard pixel shadow; the cursor is a pair of blinking orange pixel brackets. */
${SEL.tile} { background: ${touch(btnUp, btn)} !important; border-color: ${ink} !important; border-radius: 12px !important; box-shadow: ${gloss}, ${pixelEdge()} !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: -7px; top: -7px; right: -7px; bottom: -7px; pointer-events: none; border-style: solid; border-color: transparent; border-width: 14px; border-image: var(--dbtc-u1) 14 / 14px stretch; opacity: 0; }
${on(SEL.tileHover, 'before')} { opacity: 1; animation: dbtc-wc-blink 0.8s steps(1) infinite; }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${touch(mix(btnUp, t.accent, 0.3), mix(btn, t.accent, 0.15))} !important; box-shadow: ${gloss}, ${pixelEdge(mix(t.accent, '#ffffff', 0.5))}, 0 0 18px -2px ${alpha(t.accent, 0.7)} !important; }
${SEL.tileLabel} { ${label} }
@keyframes dbtc-wc-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
@media (prefers-reduced-motion: reduce) { ${on(SEL.tileHover, 'before')} { animation: none; } }

/* Buttons: small touch buttons. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: ${touch(btnUp, btn)} !important; border-color: ${ink} !important; color: #ffffff !important; border-radius: 8px !important; box-shadow: inset 0 0 0 1px ${alpha(outline, 0.8)}, 2px 2px 0 0 ${alpha('#000000', 0.55)} !important; text-shadow: 1px 1px 0 ${ink} !important; }
${SEL.buttonHover} { background: ${touch(mix(btnUp, t.accent, 0.3), mix(btn, t.accent, 0.15))} !important; border-color: ${orange} !important; box-shadow: inset 0 0 0 1px ${mix(t.accent, '#ffffff', 0.5)}, 0 0 0 2px ${orange}, 2px 2px 0 2px ${alpha('#000000', 0.55)} !important; }
${SEL.buttonDown} { background: linear-gradient(180deg, ${ink}, ${btn}) !important; box-shadow: inset 2px 2px 0 ${alpha('#000000', 0.6)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.muted, t.bg, 0.25)} !important; }

/* Pop-ups: the lower screen in its shell bezel, hanging from the hinge. */
${SEL.dialog} { background: ${screen} !important; border-radius: 6px !important; box-shadow: 0 0 0 3px ${ink}, 0 0 0 12px ${shell}, 0 0 0 14px ${shellDeep}, 6px 8px 0 14px ${alpha('#000000', 0.45)} !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: calc(50% - 110px); top: -30px; right: auto; bottom: auto; width: 220px; height: 26px; pointer-events: none; z-index: 0; background: var(--dbtc-u2) center / contain no-repeat; transform: none; }
${on(SEL.dialog, 'after')} { content: none; }
${SEL.dialogTitle} { ${label} }
${sel(['#content #msg .body_txt', '#content #link .body_txt', '#content #confirm .body_txt', '#content #confirm2 .body_txt', '#content #input .body_txt', '#content #input2 .body_txt', '#content #combo .body_txt'])} { color: ${t.text} !important; text-shadow: 1px 1px 0 ${ink} !important; }

/* Chat: an indigo title strip with a magenta speed stripe; the LCD grid below. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 50%), linear-gradient(90deg, ${btn}, ${btnUp} 60%, ${mix(pink, btn, 0.4)}) !important; box-shadow: inset 0 -2px 0 ${pink}, inset 0 1px 0 ${alpha('#ffffff', 0.3)} !important; }
${sel(['#chats .chat .chat_top span'])} { ${label} }
${SEL.chat} { background: ${screen} !important; box-shadow: inset 2px 0 0 ${shellDeep}, inset -2px 0 0 ${shellDeep}, inset 0 -2px 0 ${shellDeep} !important; }

/* Duel: battle cut-in speed stripes in the life bars; rounded pills for the phases. */
${SEL.life} { border-color: ${outline} !important; border-radius: 4px !important; box-shadow: 0 0 0 2px ${ink}, 3px 3px 0 2px ${alpha('#000000', 0.5)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: repeating-linear-gradient(180deg, transparent 0 5px, ${alpha('#ffffff', 0.22)} 5px 6px), linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.35)}, ${t.self} 55%, ${mix(t.self, t.bg, 0.35)}) !important; }
${SEL.lifeOpp} { background: repeating-linear-gradient(180deg, transparent 0 5px, ${alpha('#ffffff', 0.22)} 5px 6px), linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.35)}, ${t.opp} 55%, ${mix(t.opp, t.bg, 0.35)}) !important; }
${sel(['#duel .lifepoints .life_txt'])} { ${label} }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -44px; top: 4px; width: 40px; height: 22px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${SEL.phase} { background: linear-gradient(180deg, ${mix(t.text, '#ffffff', 0.4)}, ${mix(t.text, t.muted, 0.6)}) !important; border-radius: 9px !important; box-shadow: 0 0 0 2px ${ink}, 3px 3px 0 1px ${alpha('#000000', 0.5)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; border-radius: 8px !important; }
${sel(['#duel .phase .background', '#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { border-radius: 8px !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${ink} !important; border-radius: 8px !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: linear-gradient(180deg, ${navy}, ${ink}) !important; box-shadow: inset 0 6px 5px -3px ${alpha('#ffffff', 0.18)} !important; }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: linear-gradient(180deg, ${mix(t.accent, '#ffffff', 0.3)}, ${t.accent}) !important; box-shadow: inset 0 6px 5px -3px ${alpha('#ffffff', 0.5)}, 0 0 0 2px #ffffff, 0 0 10px 2px ${alpha(t.accent, 0.9)}, 0 0 22px 4px ${alpha(t.accent, 0.5)} !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${t.accentText} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.5)} !important; }
${sel(['#duel .phase span'])} { color: #ffffff !important; text-shadow: 1px 0 0 ${ink}, -1px 0 0 ${ink}, 0 1px 0 ${ink}, 0 -1px 0 ${ink}, 2px 2px 0 ${ink} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${outline} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.2)}, transparent 50%), linear-gradient(90deg, ${mix(pink, t.bg, 0.2)}, ${pink}) !important; }
${SEL.duelLog} { background: ${screen} !important; box-shadow: inset 0 0 0 2px ${shellDeep}, inset 0 0 0 4px ${ink} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 3px ${shell}, 0 0 0 5px ${ink}, 4px 4px 0 5px ${alpha('#000000', 0.45)} !important; }

/* Duel room: screens in the shell colour. */
${lobbyBorders} { background: ${screen} !important; box-shadow: 4px 4px 0 0 ${alpha('#000000', 0.45)}; }
${on(lobbyBorders, 'before')} { background: linear-gradient(180deg, ${shell}, ${shellDeep}) !important; filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${navy} !important; box-shadow: 0 0 0 0.35em ${navy} !important; border-radius: 3px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(t.accent, 0.18)}, transparent 45%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(t.accent, 0.4)}, ${alpha(pink, 0.12)}) !important; }

/* Deck constructor: LCD screens in the shell rim. */
${deckPanels} { background: ${screen} !important; box-shadow: inset 0 0 0 2px ${shellDeep}, inset 0 0 0 4px ${ink} !important; }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${shellDeep} !important; background: ${screen} !important; box-shadow: 4px 4px 0 0 ${alpha('#000000', 0.4)} !important; }

/* Titles: the battle bar, a dark italic plate with a magenta speed stripe below. */
${titles} { color: #ffffff !important; background: linear-gradient(180deg, ${alpha('#ffffff', 0.15)}, transparent 50%), linear-gradient(90deg, ${ink}, ${navy} 70%, ${mix(t.self, navy, 0.5)}) !important; border-radius: 3px !important; box-shadow: 0 0 0 0.25em ${ink}, 0 calc(0.25em + 4px) 0 0 ${pink}, 0 calc(0.25em + 7px) 0 0 ${alpha(t.self, 0.8)} !important; ${label.replace(/color: #ffffff !important; /, '')} font-style: italic !important; }
${labels} { color: #ffffff !important; text-shadow: 2px 2px 0 ${ink} !important; }

/* Text fields: dark LCD wells with a lavender rim. */
${SEL.field} { background-color: ${ink} !important; border-color: ${lavDeep} !important; box-shadow: inset 2px 2px 0 ${alpha('#000000', 0.6)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 2px solid ${orange} !important; box-shadow: inset 2px 2px 0 ${alpha('#000000', 0.6)}, 0 0 0 4px ${alpha(orange, 0.25)} !important; }

/* Scrollbars: chunky lavender sliders. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${lavDeep}, ${lav}) !important; border-radius: 3px !important; box-shadow: inset 0 0 0 1px ${ink} !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
