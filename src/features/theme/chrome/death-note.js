// death-note: the notebook itself. Black pebbled leather bound with a
// bone-white saddle stitch, a deckled page edge, red ribbon bookmarks, ruled
// page wells for text, a fountain-pen nib capping the life bars and red wax
// on the active phase. (t, kit) -> CSS string; see chrome/kit.js.
import { mix, deepForWhite } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const bone = mix(t.text, t.muted, 0.2);
  const boneDim = mix(t.muted, t.border, 0.4);
  const leather = mix(t.surface, '#000000', 0.35);
  const leatherHi = mix(t.raised, t.border, 0.25);
  const ink = mix(t.bg, '#000000', 0.5);
  const red = t.accent;
  const redDeep = mix(t.accent, '#000000', 0.55);
  const cold = t.accent2;

  // Pebbled leather grain.
  const grain = svg(36, 36, `<g fill="${t.text}" fill-opacity="0.045"><circle cx="4" cy="6" r="1.1"/><circle cx="14" cy="3" r="0.8"/><circle cx="25" cy="8" r="1.3"/><circle cx="33" cy="17" r="0.9"/><circle cx="9" cy="17" r="1"/><circle cx="20" cy="22" r="1.2"/><circle cx="30" cy="30" r="1"/><circle cx="5" cy="29" r="0.9"/><circle cx="16" cy="33" r="0.7"/></g><g fill="#000000" fill-opacity="0.18"><circle cx="10" cy="11" r="1"/><circle cx="27" cy="25" r="1.1"/><circle cx="22" cy="14" r="0.7"/></g>`);
  // Ruled paper: a cold rule every 22px and a red margin line.
  const ruled = svg(40, 22, `<path d="M0 21.5H40" stroke="${cold}" stroke-opacity="0.11"/>`);

  // Nine-slice leather frame: a dark edge and a bone saddle stitch.
  const frameSvg = svg(60, 60, `<rect x="0.75" y="0.75" width="58.5" height="58.5" rx="2" fill="none" stroke="${mix(t.border, t.bg, 0.2)}" stroke-width="1.5"/><rect x="4.5" y="4.5" width="51" height="51" rx="1" fill="none" stroke="#000000" stroke-opacity="0.5" stroke-width="2.4"/><rect x="4.5" y="4.5" width="51" height="51" rx="1" fill="none" stroke="${bone}" stroke-opacity="0.3" stroke-width="0.9" stroke-dasharray="2.2 2.1" stroke-linecap="round"/>`);
  const frame = (px = 12) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 12 / ${px}px round; box-sizing: border-box;`;

  // Red silk ribbon with a swallowtail end.
  const ribbon = svg(14, 44, `<defs><linearGradient id="r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${redDeep}"/><stop offset="0.45" stop-color="${red}"/><stop offset="1" stop-color="${redDeep}"/></linearGradient></defs><path d="M1 0H13V43L7 36L1 43Z" fill="url(#r)"/><path d="M4 0V36" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1"/>`);

  // Fountain-pen nib: the cap of the life bars.
  const nib = svg(18, 40, `<defs><linearGradient id="n" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${boneDim}"/><stop offset="0.5" stop-color="${bone}"/><stop offset="1" stop-color="${boneDim}"/></linearGradient></defs><path d="M9 39C6 30 2.5 22 2.5 14V2H15.5V14C15.5 22 12 30 9 39Z" fill="url(#n)" stroke="${ink}" stroke-width="1"/><path d="M9 38V18" stroke="${ink}" stroke-width="1.1"/><circle cx="9" cy="16" r="2" fill="${ink}"/><path d="M2.5 6H15.5" stroke="${ink}" stroke-opacity="0.6"/>`);

  // A quill laid across a red ribbon bookmark: the pop-ups' corner ornament.
  const head = svg(120, 100, `<defs><linearGradient id="r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${redDeep}"/><stop offset="0.45" stop-color="${red}"/><stop offset="1" stop-color="${redDeep}"/></linearGradient><linearGradient id="q" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${ink}"/><stop offset="1" stop-color="${mix(leather, t.raised, 0.8)}"/></linearGradient></defs><path d="M72 0H88V96L80 87L72 96Z" fill="url(#r)"/><path d="M76 0V86" stroke="#ffffff" stroke-opacity="0.2"/><path d="M14 84C40 52 76 24 116 4C104 22 84 40 60 56C46 66 30 76 14 84Z" fill="url(#q)" stroke="${boneDim}" stroke-width="1"/><path d="M14 84C44 60 80 30 116 4" fill="none" stroke="${bone}" stroke-opacity="0.7" stroke-width="1.1"/><path d="M40 62l-6 -10M56 50l-5 -11M72 38l-4 -11M88 26l-3 -10" stroke="${bone}" stroke-opacity="0.25"/><path d="M14 84L4 96L9 82Z" fill="${bone}" stroke="${ink}" stroke-width="0.8"/>`);

  // Wax seal for the active phase and for OK: a pressed rim.
  const seal = svg(45, 45, `<g fill="none" stroke="#ffffff" stroke-opacity="0.22"><circle cx="22.5" cy="22.5" r="17"/><circle cx="22.5" cy="22.5" r="13.5" stroke-dasharray="2 2"/></g>`);

  const label = `color: ${bone} !important; text-shadow: 0 1px 0 ${ink}, 0 0 8px ${alpha('#000000', 0.9)} !important;`;
  const leatherBg = (lift = 0) => `radial-gradient(ellipse 80% 120% at 30% 0%, ${alpha(leatherHi, 0.55 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${mix(leather, t.raised, 0.3)}, ${leather})`;

  // Pop-up buttons (DuelingBook's OK/Yes/No/Cancel <img>s): stitched leather, red for yes.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="3" fill="url(#g)" stroke="${c.edge}" stroke-width="2"/><rect x="11" y="15" width="${bw - 10}" height="48.5" rx="1.5" fill="none" stroke="${c.stitch}" stroke-opacity="0.55" stroke-width="1.1" stroke-dasharray="2.6 2.4" stroke-linecap="round"/><path d="M12 12H${w - 12}" stroke="#ffffff" stroke-opacity="0.12"/><text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.7)}) !important; }`).join('\n');
  const popPrimary = { top: mix(red, t.bg, 0.12), bot: mix(red, '#000000', 0.5), edge: redDeep, stitch: bone, text: '#ffffff' };
  const popSecondary = { top: mix(leather, t.raised, 0.6), bot: leather, edge: mix(t.border, t.bg, 0.2), stitch: bone, text: bone };

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const pageWell = `var(--dbtc-u3), linear-gradient(180deg, ${mix(t.surface, t.bg, 0.4)}, ${mix(t.bg, '#000000', 0.2)})`;

  const vars = [frameSvg, grain, grain, ruled, ribbon, nib, head, seal].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: black leather covers with a bone saddle stitch and a red ribbon marker. */
${SEL.tile} { background: ${leatherBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 12 / 12px round !important; box-shadow: inset -2px 0 0 ${alpha(bone, 0.75)}, inset -3px 0 0 ${ink}, inset -4px 0 0 ${alpha(bone, 0.55)}, inset -5px 0 0 ${ink}, inset -6px 0 0 ${alpha(bone, 0.35)}, inset 0 1px 0 ${alpha('#ffffff', 0.08)}, inset 0 -12px 18px -10px #000000, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: 6px; top: -3px; width: 10px; height: 32px; pointer-events: none; background: var(--dbtc-u4) center / 100% 100% no-repeat; filter: drop-shadow(1px 2px 1px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: radial-gradient(ellipse 70% 120% at 30% 0%, ${alpha(red, 0.22)}, transparent 70%), ${leatherBg(0.1)} !important; box-shadow: inset -3px 0 0 ${alpha(bone, 0.6)}, inset -4px 0 0 ${ink}, inset -6px 0 0 ${alpha(bone, 0.35)}, inset 0 0 0 1px ${alpha(red, 0.7)}, 0 0 20px -6px ${alpha(red, 0.8)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: stitched leather; red leather when pressed. */
${SEL.button} { background: var(--dbtc-u1), linear-gradient(180deg, ${mix(leather, t.raised, 0.55)}, ${leather}) !important; border-color: ${mix(t.border, t.bg, 0.15)} !important; color: ${bone} !important; border-radius: 2px !important; box-shadow: inset 0 0 0 2px ${leather}, inset 0 0 0 3px ${alpha(bone, 0.28)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: var(--dbtc-u1), linear-gradient(180deg, ${mix(red, leather, 0.55)}, ${mix(red, '#000000', 0.62)}) !important; border-color: ${redDeep} !important; color: #ffffff !important; box-shadow: inset 0 0 0 2px ${redDeep}, inset 0 0 0 3px ${alpha(bone, 0.45)}, 0 0 10px -2px ${alpha(red, 0.7)} !important; }
${SEL.buttonDown} { background: ${mix(red, '#000000', 0.65)} !important; border-color: ${red} !important; box-shadow: inset 0 2px 5px #000000 !important; }
${sel(['#content .button.proxy::before'])} { content: ""; position: absolute; left: 3px; top: -2px; width: 7px; height: 70%; pointer-events: none; background: var(--dbtc-u4) center / 100% 100% no-repeat; filter: drop-shadow(1px 1px 1px #000000); }
${sel(['#content .button.disabled'])} { opacity: 0.55 !important; }

/* Pop-ups: the notebook's black rules page, stitched; a quill and red ribbon bookmark hang off the top-right corner, outside the page. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 50% at 50% 0%, ${alpha(cold, 0.1)}, transparent 70%), var(--dbtc-u3), var(--dbtc-u2), linear-gradient(180deg, ${mix(leather, t.raised, 0.25)}, ${mix(t.bg, '#000000', 0.3)}) !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${mix(t.border, t.bg, 0.2)}, 0 0 0 4px ${ink}, 0 0 0 5px ${alpha(bone, 0.45)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(12)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: auto; top: -44px; right: -150px; bottom: auto; width: 144px; height: 120px; pointer-events: none; z-index: 1; background: var(--dbtc-u6) center / contain no-repeat; transform: none; }
${SEL.dialogTitle} { ${label} }

/* Chat: a stitched leather band; the window is a ruled page. */
${SEL.chatTop} { background: var(--dbtc-u1), linear-gradient(180deg, ${mix(leather, t.raised, 0.5)}, ${leather}) !important; box-shadow: inset 0 -1px 0 ${alpha(bone, 0.5)}, inset 0 -3px 0 ${ink}, inset 0 -4px 0 ${alpha(bone, 0.22)} !important; }
${sel(['#chats .chat .chat_top span'])} { ${label} }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; right: 70px; top: -2px; width: 10px; height: 30px; pointer-events: none; background: var(--dbtc-u4) center / 100% 100% no-repeat; }
${SEL.chat} { background: ${pageWell} !important; box-shadow: inset 1px 0 0 ${boneDim}, inset -1px 0 0 ${boneDim}, inset 0 -1px 0 ${boneDim} !important; }

/* Duel: stitched leather life bars written in red and cold ink, capped with a pen nib; phases pressed in wax. */
${SEL.life} { border-color: ${mix(t.border, t.bg, 0.1)} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 2px ${alpha(bone, 0.35)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 50%), var(--dbtc-u3), linear-gradient(90deg, #c9a24a, #e8c873) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 50%), var(--dbtc-u3), linear-gradient(90deg, ${mix(t.opp, '#000000', 0.6)}, ${t.opp} 45%, ${mix(t.opp, '#000000', 0.38)} 70%, #6f747a) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -6px; width: 18px; height: 40px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; transform: rotate(-24deg); }
${sel(['#duel .lifepoints .life_txt'])} { color: ${bone} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 210deg, ${mix(t.muted, '#ffffff', 0.45)}, ${mix(t.muted, t.bg, 0.45)}, #ffffff, ${mix(t.muted, t.bg, 0.45)}, ${mix(t.muted, '#ffffff', 0.45)}) !important; box-shadow: 0 0 0 1px ${ink}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase.active .background'])} { background: conic-gradient(from 210deg, ${red}, ${redDeep}, ${mix(red, '#ffffff', 0.35)}, ${redDeep}, ${red}) !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${leather} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u7) center / 100% 100%, radial-gradient(circle at 40% 35%, ${mix(leather, t.raised, 0.7)}, ${leather} 70%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u7) center / 100% 100%, radial-gradient(circle at 40% 35%, ${deepForWhite(t.self)}, ${mix(deepForWhite(t.self), '#000000', 0.25)} 45%, ${mix(t.self, '#000000', 0.55)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.75)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u7) center / 100% 100%, radial-gradient(circle at 40% 35%, ${deepForWhite(t.opp)}, ${mix(deepForWhite(t.opp), '#000000', 0.25)} 45%, ${mix(t.opp, '#000000', 0.55)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.75)}; }
${sel(['#duel .phase span'])} { color: ${bone} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel .cout_txt'])} { background: ${pageWell} !important; box-shadow: inset 0 0 0 1px ${boneDim}, inset 0 0 0 4px ${alpha(ink, 0.9)}, inset 0 0 0 5px ${alpha(bone, 0.25)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${ink}, 0 0 0 3px ${alpha(bone, 0.6)}, 0 0 0 6px ${leather}, 0 0 0 7px ${alpha(bone, 0.25)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${boneDim}, ${mix(t.border, t.bg, 0.3)}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u1), linear-gradient(180deg, ${mix(red, leather, 0.35)}, ${mix(red, '#000000', 0.6)}) !important; }

/* Duel room: stitched leather panels around ruled pages. */
${lobbyBorders} { background: var(--dbtc-u3), linear-gradient(180deg, ${alpha(mix(leather, t.raised, 0.3), 0.85)}, ${alpha(t.bg, 0.9)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${bone}, ${boneDim} 35%, ${mix(t.border, t.bg, 0.2)} 65%, ${boneDim}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(12)} }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${leather} !important; box-shadow: 0 0 0 0.35em ${leather} !important; border-radius: 2px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(red, 0.14)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(red, 0.38)}, ${alpha(red, 0.1)}) !important; }

/* Deck constructor: ruled pages inside stitched leather. */
${deckPanels} { background: ${pageWell} !important; box-shadow: inset 0 0 0 1px ${boneDim}, inset 0 0 0 4px ${alpha(leather, 0.95)}, inset 0 0 0 5px ${alpha(bone, 0.3)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(12)} }

/* Settings panels: the same stitched leather. */
${settingsPanels} { border-color: ${mix(t.border, t.bg, 0.2)} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(mix(leather, t.raised, 0.4), 0.92)}, ${alpha(t.bg, 0.92)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(12)} }

/* The bulletin: names in bone, as if written in the notebook. */
${sel(['#content #statuses .username_txt'])} { color: ${bone} !important; }

/* Titles: bone white on black, a red underline like a struck name. */
${titles} { color: ${bone} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${ink}, 0 0 14px ${alpha(red, 0.45)} !important; }

/* Text fields: ink wells with a bone rule, red focus. */
${SEL.field} { background-color: ${mix(t.bg, '#000000', 0.25)} !important; border-color: ${boneDim} !important; box-shadow: inset 0 2px 4px #000000, inset 0 -1px 0 ${alpha(bone, 0.35)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${red} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(red, 0.6)} !important; }

/* Scrollbars: red ribbon. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${redDeep}, ${red}, ${redDeep}) !important; border-radius: 1px !important; }

/* Pop-up buttons in stitched leather. */
${popCss(popPrimary, popSecondary)}
`;
};
