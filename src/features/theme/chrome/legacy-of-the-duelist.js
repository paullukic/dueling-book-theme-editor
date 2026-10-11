// legacy-of-the-duelist: the HD-era menus of Legacy of the Duelist / Link
// Evolution. Elongated-octagon capsules in a cyan double bevel over a navy
// grid, gold text on the selected row, silver-to-cyan title bars with heavy
// black lettering, an LP gauge that turns green, yellow then red as life runs
// out, with a red "LP" cap, teal phase chips that light gold.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const cyan = t.accent;
  const cyanHi = mix(cyan, '#ffffff', 0.55);
  const cyanLo = mix(cyan, t.bg, 0.55);
  const navy = t.surface;
  const navyDeep = mix(t.surface, t.bg, 0.6);
  const gold = t.accent2;
  const silver = mix(t.text, t.muted, 0.35);
  const ink = mix(t.bg, '#000000', 0.5);

  // Fine navy grid inside every panel (the menus' graph-paper fill).
  const grid = svg(14, 14, `<path d="M0 .5H14M.5 0V14" stroke="${cyan}" stroke-opacity="0.1"/>`);

  // Elongated octagon in a double cyan bevel: the capsule every LotD row sits in.
  const capsule = (w, h, c, glow = false) => {
    const oct = (i) => `M${c + i} ${i}H${w - c - i}L${w - i} ${c + i}V${h - c - i}L${w - c - i} ${h - i}H${c + i}L${i} ${h - c - i}V${c + i}Z`;
    // The selected row trades the cyan rim for LotD's thick gold selection frame.
    const [hi, mid, lo] = glow ? [mix(gold, '#ffffff', 0.55), gold, mix(gold, t.warning, 0.7)] : [cyanHi, cyan, cyanLo];
    return svg(w, h, `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="0.45" stop-color="${mid}"/><stop offset="1" stop-color="${lo}"/></linearGradient></defs><path d="${oct(glow ? 2 : 1.2)}" fill="none" stroke="url(#b)" stroke-width="${glow ? 4 : 2.4}"/><path d="${oct(glow ? 6.4 : 4.6)}" fill="none" stroke="${glow ? cyanHi : cyan}" stroke-opacity="${glow ? 0.9 : 0.5}" stroke-width="1"/><path d="M${c + 6} 3.2H${w - c - 6}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.8"/>`);
  };
  const chamfer = (c) => `clip-path: polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px);`;

  // Title bar: a long chamfered plate, chrome-silver fading into cyan, with a bright rim.
  const titleBar = svg(400, 60, `<defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${cyanLo}"/><stop offset="0.16" stop-color="${mix(cyan, '#ffffff', 0.25)}"/><stop offset="0.5" stop-color="${mix(silver, '#ffffff', 0.55)}"/><stop offset="0.84" stop-color="${mix(cyan, '#ffffff', 0.25)}"/><stop offset="1" stop-color="${cyanLo}"/></linearGradient><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs><path d="M2 4H398L382 56H18Z" fill="${navyDeep}" stroke="${cyan}" stroke-width="2"/><path d="M14 9H386L373 51H27Z" fill="url(#p)"/><path d="M14 9H386L373 51H27Z" fill="url(#s)"/><path d="M27 51H373" stroke="${cyanHi}" stroke-width="1.4"/><path d="M0 30H10M390 30H400" stroke="${cyan}" stroke-width="2"/>`);

  // LotD's red "LP" cap beside the gauge.
  const lpCap = svg(44, 30, `<path d="M4 1H40L43 15L40 29H4L1 15Z" fill="${mix(t.danger, ink, 0.25)}" stroke="${mix(t.danger, '#ffffff', 0.4)}" stroke-width="1.4"/><text x="22" y="21" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="15" fill="${gold}" stroke="${ink}" stroke-width="0.6">LP</text>`);

  // Gold "!" seal LotD hangs on unplayed story duels; rides the hovered row.
  const seal = svg(26, 26, `<circle cx="13" cy="13" r="11.5" fill="${gold}" stroke="${ink}" stroke-width="1.6"/><circle cx="13" cy="13" r="8.6" fill="none" stroke="#ffffff" stroke-opacity="0.6"/><path d="M13 6.5V14.5" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/><circle cx="13" cy="18.8" r="1.8" fill="${ink}"/>`);

  // Pop-up buttons as LotD capsules: OK/Yes is the selected row (gold on deep navy), No/Cancel a plain row.
  const popBtn = (label, wide, sel) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    const c = 16;
    const oct = (i) => `M${c + i} ${10 + i}H${w - c - i}L${w - i} ${10 + c + i}V${h - 10 - c - i}L${w - c - i} ${h - 10 - i}H${c + i}L${i} ${h - 10 - c - i}V${10 + c + i}Z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sel ? mix(cyan, navy, 0.55) : mix(navy, t.raised, 0.5)}"/><stop offset="0.5" stop-color="${navyDeep}"/><stop offset="1" stop-color="${sel ? mix(cyan, navy, 0.7) : navyDeep}"/></linearGradient><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cyanHi}"/><stop offset="1" stop-color="${cyanLo}"/></linearGradient></defs><path d="${oct(3)}" fill="url(#f)" stroke="url(#b)" stroke-width="${sel ? 3.4 : 2.4}"/><path d="${oct(8)}" fill="none" stroke="${sel ? cyanHi : cyan}" stroke-opacity="${sel ? 0.85 : 0.45}" stroke-width="1.2"/><text x="${w / 2}" y="${h / 2 + 1}" dominant-baseline="central" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="25" fill="${sel ? gold : t.text}" stroke="${ink}" stroke-width="1.2" paint-order="stroke">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = [['ok_btn', 'OK', true, false], ['yes_btn', 'Yes', true, false], ['no_btn', 'No', false, false], ['cancel_btn', 'Cancel', false, true]]
    .map(([n, label, s, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, s))} !important; filter: drop-shadow(0 0 ${s ? 8 : 3}px ${alpha(cyan, s ? 0.55 : 0.3)}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = SEL.settingsPanel;
  const titles = sel(['#content .title1']);
  const subTitles = sel(['#content .arial_black2:not(.title1)', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const panelFill = `var(--dbtc-g), radial-gradient(ellipse 90% 60% at 50% 0%, ${alpha(mix(navy, t.opp, 0.25), 0.6)}, transparent 70%), linear-gradient(180deg, ${alpha(mix(navy, cyan, 0.05), 0.94)}, ${alpha(navyDeep, 0.96)})`;
  const outline = `0 1px 0 ${ink}, 1px 0 0 ${ink}, -1px 0 0 ${ink}, 0 -1px 0 ${ink}, 0 2px 3px ${ink}`;
  const ring = (a = 1) => `0 0 0 1px ${alpha(ink, 0.9)}, 0 0 0 2px ${alpha(cyan, 0.85 * a)}, 0 0 0 4px ${alpha(navyDeep, 0.95)}, 0 0 0 5px ${alpha(cyan, 0.4 * a)}`;

  return `
html body { --dbtc-g: ${svgUrl(grid)}; --dbtc-cap: ${svgUrl(capsule(120, 48, 14))}; --dbtc-capon: ${svgUrl(capsule(120, 48, 14, true))}; --dbtc-title: ${svgUrl(titleBar)}; --dbtc-lp: ${svgUrl(lpCap)}; --dbtc-seal: ${svgUrl(seal)}; }
/* Menu tiles: octagonal capsules, cyan double bevel on a navy grid; the hovered row lights up with gold text and a "!" seal. */
${SEL.tile} { background: var(--dbtc-g), radial-gradient(ellipse 60% 90% at 50% 0%, ${alpha(cyan, 0.16)}, transparent 70%), linear-gradient(180deg, ${mix(navy, t.opp, 0.1)}, ${navyDeep}) !important; border-style: solid !important; border-color: transparent !important; border-image: var(--dbtc-cap) 18 / 18px stretch !important; border-radius: 0 !important; ${chamfer(13)} box-shadow: inset 0 -12px 18px -10px ${alpha(ink, 0.9)} !important; }
${SEL.tileHover} { background: var(--dbtc-g), radial-gradient(ellipse 70% 100% at 50% 50%, ${alpha(cyan, 0.42)}, transparent 75%), linear-gradient(180deg, ${mix(navy, cyan, 0.3)}, ${mix(navy, cyan, 0.12)}) !important; border-image: var(--dbtc-capon) 18 / 18px stretch !important; box-shadow: inset 0 0 26px ${alpha(cyan, 0.45)} !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: ${outline} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${gold} !important; }
${on(sel(['#main_menu .menu_btn:hover .content']), 'after')} { content: ""; position: absolute; left: 7%; top: calc(37% - 13px); width: 26px; height: 26px; pointer-events: none; background: var(--dbtc-seal) center / contain no-repeat; filter: drop-shadow(0 0 6px ${alpha(gold, 0.6)}); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'after')} { content: none; }

/* Buttons: small capsules; hover = selected row. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: var(--dbtc-g), linear-gradient(180deg, ${mix(navy, cyan, 0.2)}, ${navyDeep}) !important; border-color: ${cyan} !important; color: ${t.text} !important; border-radius: 8px !important; box-shadow: inset 0 1px 0 ${alpha(cyanHi, 0.55)}, inset 0 0 0 1px ${alpha(ink, 0.7)}, 0 0 0 1px ${alpha(ink, 0.8)} !important; text-shadow: 0 1px 1px ${ink} !important; }
${SEL.buttonHover} { background: var(--dbtc-g), linear-gradient(180deg, ${mix(navy, cyan, 0.45)}, ${mix(navy, cyan, 0.15)}) !important; border-color: ${cyanHi} !important; color: ${gold} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.5)}, 0 0 10px ${alpha(cyan, 0.7)} !important; }
${SEL.buttonDown} { background: ${navyDeep} !important; border-color: ${gold} !important; box-shadow: inset 0 2px 6px ${ink} !important; }
${SEL.submit} { background: linear-gradient(180deg, ${mix(navy, cyan, 0.2)}, ${navyDeep}) !important; border-color: ${cyan} !important; color: ${t.text} !important; }

/* Page titles: heavy black lettering on a silver-cyan title bar. */
${titles} { color: ${ink} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.6)} !important; isolation: isolate; }
${on(titles, 'before')} { content: ""; position: absolute; left: calc(50% - 215px); top: 2%; width: 430px; height: 96%; z-index: -1; pointer-events: none; background: var(--dbtc-title) center / 100% 100% no-repeat; filter: drop-shadow(0 4px 8px ${alpha(ink, 0.8)}) drop-shadow(0 0 10px ${alpha(cyan, 0.35)}); }
${subTitles} { color: ${t.text} !important; text-shadow: ${outline}, 0 0 10px ${alpha(cyan, 0.5)} !important; }

/* Pop-ups: a navy grid panel in the double cyan bevel with a title bar on top. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 50% at 50% 0%, ${alpha(cyan, 0.2)}, transparent 70%), ${panelFill} !important; border-radius: 10px !important; box-shadow: ${ring()}, 0 26px 60px -12px ${ink} !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; pointer-events: none; z-index: 0; border-style: solid; border-color: transparent; border-width: 18px; border-image: var(--dbtc-cap) 18 / 18px stretch; box-sizing: border-box; background: none; transform: none; }
${SEL.dialogTitle} { color: ${ink} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.6)} !important; background: var(--dbtc-title) center / 56% 100% no-repeat !important; filter: drop-shadow(0 4px 6px ${ink}); }

/* Chat: navy grid body, a cyan-lit header bar. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 50%), linear-gradient(90deg, ${cyanLo}, ${mix(cyan, navy, 0.35)} 50%, ${cyanLo}) !important; box-shadow: inset 0 -2px 0 ${cyanHi}, inset 0 1px 0 ${alpha('#ffffff', 0.45)} !important; }
${SEL.chat} { background: ${panelFill} !important; box-shadow: inset 0 0 0 1px ${cyan}, inset 0 0 0 3px ${alpha(navyDeep, 0.9)}, inset 0 0 0 4px ${alpha(cyan, 0.35)} !important; }
${sel(['#chats .chat .title_txt', '#chats .chat .chat_title'])} { color: ${t.text} !important; text-shadow: ${outline} !important; }

/* Duel: LP gauge coloured by life left (--dbte-lp), cyan-rimmed plate, red LP cap; teal phase chips. */
${SEL.life} { border-color: ${cyan} !important; border-radius: 6px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 3px ${alpha(navyDeep, 0.95)}, 0 0 0 4px ${alpha(cyan, 0.55)}, 0 4px 10px -3px ${ink} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 5px !important; --dbtc-lpc: color-mix(in srgb, color-mix(in srgb, ${t.success} clamp(0%, calc((var(--dbte-lp, 1) - 0.4) * 1000%), 100%), ${gold}) clamp(0%, calc((var(--dbte-lp, 1) - 0.2) * 1000%), 100%), ${t.danger}); background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 42%, ${alpha(ink, 0.25)}), linear-gradient(90deg, color-mix(in srgb, var(--dbtc-lpc) 45%, ${ink}), color-mix(in srgb, var(--dbtc-lpc) 75%, ${ink})) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: linear-gradient(180deg, ${navyDeep}, ${ink}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -46px; top: calc(50% - 15px); width: 44px; height: 30px; pointer-events: none; background: var(--dbtc-lp) center / contain no-repeat; filter: drop-shadow(0 2px 3px ${ink}); }
${sel(['#duel .lifepoints .life_txt'])} { color: ${gold} !important; text-shadow: ${outline}, 0 0 6px ${ink} !important; }
${SEL.phase} { background: linear-gradient(180deg, ${cyanHi}, ${cyan} 45%, ${cyanLo}) !important; box-shadow: 0 0 0 2px ${ink}, 0 4px 8px -2px ${ink} !important; border-radius: 26% !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: linear-gradient(180deg, ${mix(navy, cyan, 0.35)}, ${navyDeep}) !important; border-radius: 24% !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-g), linear-gradient(180deg, ${mix(navy, cyan, 0.3)}, ${navyDeep}) !important; border-radius: 24% !important; }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: linear-gradient(180deg, ${mix(gold, '#ffffff', 0.45)}, ${gold} 60%, ${mix(gold, t.warning, 0.6)}) !important; box-shadow: 0 0 0 2px ${ink}, 0 0 16px ${alpha(gold, 0.85)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: ${outline} !important; }
${sel(['#duel .phase.active span', '#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${ink} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.6)} !important; }
${SEL.duelLog} { background: ${panelFill} !important; border-color: ${cyan} !important; box-shadow: inset 0 0 0 3px ${alpha(navyDeep, 0.9)}, inset 0 0 0 4px ${alpha(cyan, 0.35)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${cyan}, 0 0 0 4px ${navyDeep}, 0 0 0 5px ${alpha(cyan, 0.45)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, #ffffff, ${silver}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(silver, '#ffffff', 0.5)}, ${mix(silver, t.muted, 0.4)}) !important; }
${sel(['#duel #turn .red', '#duel #start_turn .red', '#duel #end_turn .red'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.45)}, transparent 50%), linear-gradient(180deg, ${mix(t.self, ink, 0.1)}, ${mix(t.self, ink, 0.55)}) !important; }
${sel(['#duel #turn .blue', '#duel #start_turn .blue', '#duel #end_turn .blue'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.45)}, transparent 50%), linear-gradient(180deg, ${mix(t.opp, ink, 0.1)}, ${mix(t.opp, ink, 0.55)}) !important; }
${sel(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span'])} { color: ${t.text} !important; text-shadow: ${outline} !important; }

/* Duel room: panels framed in the cyan bevel; titles keep a navy plate so the rim never runs through them. */
${lobbyBorders} { background: ${panelFill} !important; box-shadow: 0 10px 26px -12px ${ink}; }
${on(lobbyBorders, 'before')} { background: linear-gradient(180deg, ${cyanHi}, ${cyan} 40%, ${cyanLo}) !important; filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 60%, ${navyDeep} 60% 86%, transparent 86%) center / 78% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl'])} { background: linear-gradient(90deg, transparent, ${navyDeep} 8% 92%, transparent) 0 72% / 100% 24% no-repeat !important; box-shadow: none !important; border-radius: 0 !important; }
${sel(['#content #settings_content .admin_lbl'])} { background: linear-gradient(90deg, transparent, ${navyDeep} 8% 92%, transparent) 0 42% / 100% 24% no-repeat !important; box-shadow: none !important; border-radius: 0 !important; }
${sel(['#duel_room .duelbutton .background'])} { background: var(--dbtc-g), linear-gradient(90deg, ${alpha(cyan, 0.16)}, transparent 50%), ${navy} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: var(--dbtc-g), linear-gradient(90deg, ${alpha(cyan, 0.45)}, ${alpha(cyan, 0.12)}) !important; }
${sel(['#duel_room #yu', '#duel_room .border'])} { filter: none !important; }

/* Deck constructor: navy grid panels with the double cyan rim. */
${deckPanels} { background: ${panelFill} !important; box-shadow: inset 0 0 0 1px ${cyan}, inset 0 0 0 4px ${alpha(navyDeep, 0.9)}, inset 0 0 0 5px ${alpha(cyan, 0.4)} !important; }

/* Settings sections: the same bevel. */
${settingsPanels} { border-color: ${mix(cyan, navyDeep, 0.35)} !important; background: ${panelFill} !important; border-radius: 8px !important; box-shadow: inset 0 0 0 2px ${alpha(navyDeep, 0.9)}, inset 0 0 0 3px ${alpha(cyan, 0.4)} !important; }

/* Text fields: dark wells with a cyan lip, gold focus. */
${SEL.field} { background-color: ${mix(t.bg, navy, 0.4)} !important; border-color: ${mix(cyan, t.border, 0.5)} !important; box-shadow: inset 0 2px 4px ${ink} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px ${ink}, 0 0 8px ${alpha(gold, 0.55)} !important; }

/* Scrollbars: cyan capsules. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${cyanLo}, ${cyanHi}, ${cyanLo}) !important; border-radius: 6px !important; }

/* Pop-up buttons as LotD capsules. */
${popCss}
@media (prefers-reduced-motion: reduce) { html body #main_menu .menu_btn .content { transition: none !important; } }
`;
};
