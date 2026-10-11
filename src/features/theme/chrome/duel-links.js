// duel-links: the mobile Duel Links UI. Electric-azure panels on a circuit
// board with a header tab cut at an angle, flat azure bottom-bar buttons with
// a bright top lip, slanted LP plates with an italic "LP:", round dark-blue
// action buttons in a cyan ring, yellow Target bars, and on hover the red
// half-tone Skill cut-in streaking across the menu tile.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const azure = t.accent;
  const azureHi = mix(azure, '#ffffff', 0.5);
  const azureLo = mix(azure, t.bg, 0.45);
  const royal = t.surface;
  const deep = mix(t.surface, t.bg, 0.65);
  const yellow = t.accent2;
  const red = t.danger;
  const ink = mix(t.bg, '#000000', 0.55);

  // Circuit traces with node dots: the board under every DL panel.
  const circuit = svg(96, 96, `<g fill="none" stroke="${t.link}" stroke-opacity="0.1" stroke-width="1"><path d="M0 24H30L40 34H96M16 96V64L28 52H58M74 0V18L82 26V58L96 72"/></g><g fill="${t.link}" fill-opacity="0.2"><circle cx="30" cy="24" r="1.8"/><circle cx="58" cy="52" r="1.8"/><circle cx="82" cy="58" r="1.8"/></g>`);
  // The » chevrons DL runs along its panel edges.
  const chevrons = svg(54, 20, `<g fill="${azureHi}">${[0, 1, 2].map((i) => `<path d="M${4 + i * 15} 3L${12 + i * 15} 10L${4 + i * 15} 17H${9 + i * 15}L${17 + i * 15} 10L${9 + i * 15} 3Z" fill-opacity="${0.35 + i * 0.25}"/>`).join('')}</g>`);
  // Panel header tab: a darker strip that steps down at an angle, a bright hairline running on.
  const tab = svg(400, 34, `<path d="M0 0H220L246 26H400V34H0Z" fill="${mix(azure, t.bg, 0.25)}"/><path d="M0 1H219L245 27H400" fill="none" stroke="${azureHi}" stroke-width="2"/><path d="M0 0H220L246 26H400" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="0.8" transform="translate(0 4)"/>`);
  // Skill cut-in: a red slash band, half-tone dots fading out, a yellow edge.
  const skill = svg(300, 48, `<path d="M18 0H300L282 48H0Z" fill="${red}"/><path d="M18 0H300L297 8H15Z" fill="${mix(red, '#ffffff', 0.3)}"/><defs><pattern id="p" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="3" fill="${mix(red, '#000000', 0.45)}" fill-opacity="0.6"/></pattern><linearGradient id="m" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#000000"/></linearGradient><mask id="k"><rect x="140" width="160" height="48" fill="url(#m)"/></mask></defs><rect x="140" width="160" height="48" fill="url(#p)" mask="url(#k)"/><path d="M0 48L18 0H30L12 48Z" fill="${yellow}"/><path d="M282 48L300 0H300L284 48Z" fill="${yellow}"/>`);
  // Slanted LP plate label.
  const lp = svg(44, 26, `<text x="40" y="20" text-anchor="end" font-family="Arial Black, Arial, sans-serif" font-style="italic" font-weight="900" font-size="17" fill="#ffffff" stroke="${ink}" stroke-width="2.4" paint-order="stroke">LP:</text>`);
  // Title banner: a slanted parallelogram with a bright top lip and » chevrons.
  const banner = svg(420, 60, `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(azure, '#ffffff', 0.2)}"/><stop offset="0.5" stop-color="${azure}"/><stop offset="1" stop-color="${azureLo}"/></linearGradient></defs><path d="M30 4H418L390 56H2Z" fill="${ink}" fill-opacity="0.6"/><path d="M28 2H414L388 52H2Z" fill="url(#g)" stroke="#ffffff" stroke-width="1.6"/><path d="M30 6H408" stroke="#ffffff" stroke-opacity="0.6" stroke-width="1.2"/>`);

  // Pop-up buttons: DL's flat bottom-bar buttons, azure (OK/Yes) or deep blue (No/Cancel).
  const popBtn = (label, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${primary ? mix(azure, '#ffffff', 0.12) : mix(royal, azure, 0.25)}"/><stop offset="1" stop-color="${primary ? mix(azure, t.bg, 0.45) : deep}"/></linearGradient></defs><rect x="5" y="12" width="${w - 10}" height="56" rx="5" fill="${ink}" fill-opacity="0.5"/><rect x="5" y="9" width="${w - 10}" height="56" rx="5" fill="url(#f)" stroke="${primary ? azureHi : azure}" stroke-width="2"/><path d="M10 12.5H${w - 10}" stroke="#ffffff" stroke-opacity="${primary ? 0.75 : 0.35}" stroke-width="2"/><text x="${w / 2}" y="38" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="25" fill="#ffffff" stroke="${ink}" stroke-width="2" paint-order="stroke">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = [['ok_btn', 'OK', true, false], ['yes_btn', 'Yes', true, false], ['no_btn', 'No', false, false], ['cancel_btn', 'Cancel', false, true]]
    .map(([nm, label, p, wide]) => `${popImg(nm)} { content: ${svgUrl(popBtn(label, wide, p))} !important; filter: drop-shadow(0 0 ${p ? 8 : 0}px ${alpha(azure, 0.6)}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1']);
  const subTitles = sel(['#content .arial_black2:not(.title1)', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const panelFill = `var(--dbtc-c), linear-gradient(180deg, ${alpha(mix(royal, azure, 0.15), 0.95)}, ${alpha(deep, 0.96)})`;
  const outline = `0 1px 0 ${ink}, 1px 0 0 ${ink}, -1px 0 0 ${ink}, 0 -1px 0 ${ink}, 0 2px 4px ${ink}`;
  const flat = (lift = 0) => `linear-gradient(180deg, ${alpha('#ffffff', 0.06 + lift / 2)}, transparent 46%), linear-gradient(180deg, ${mix(azure, royal, 0.62 - lift)}, ${mix(azure, royal, 0.2)})`;

  return `
html body { --dbtc-c: ${svgUrl(circuit)}; --dbtc-chev: ${svgUrl(chevrons)}; --dbtc-tab: ${svgUrl(tab)}; --dbtc-skill: ${svgUrl(skill)}; --dbtc-lp: ${svgUrl(lp)}; --dbtc-banner: ${svgUrl(banner)}; }
/* Menu tiles: azure plates with a white lip and » chevrons; hover fires the red Skill cut-in. */
${SEL.tile} { background: linear-gradient(115deg, transparent 58%, ${alpha('#ffffff', 0.1)} 58% 64%, transparent 64% 68%, ${alpha('#ffffff', 0.06)} 68% 70%, transparent 70%), var(--dbtc-c), ${flat()} !important; border-color: ${azureHi} !important; border-radius: 0 !important; clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%); box-shadow: inset 0 3px 0 ${alpha('#ffffff', 0.45)}, inset 0 0 0 1px ${alpha(ink, 0.6)}, 0 4px 0 ${alpha(ink, 0.55)}, 0 8px 18px -8px ${ink} !important; overflow: hidden; }
${on(SEL.tile, 'after')} { content: ""; position: absolute; left: -6%; top: 18%; width: 112%; height: 46%; pointer-events: none; background: var(--dbtc-skill) center / 100% 100% no-repeat; opacity: 0; transform: translateX(-30%); transition: opacity .18s ease-out, transform .28s cubic-bezier(.2, .8, .2, 1); }
${on(SEL.tileHover, 'after')} { opacity: 0.92; transform: none; }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'after')} { content: none; }
${SEL.tileHover} { background: linear-gradient(115deg, transparent 58%, ${alpha('#ffffff', 0.16)} 58% 64%, transparent 64%), var(--dbtc-c), ${flat(0.12)} !important; border-color: ${yellow} !important; box-shadow: inset 0 3px 0 ${alpha('#ffffff', 0.6)}, inset 0 0 0 2px ${yellow}, 0 4px 0 ${alpha(ink, 0.55)}, 0 0 18px -2px ${alpha(yellow, 0.6)} !important; }
${SEL.tileLabel} { color: #ffffff !important; font-style: italic; text-shadow: ${outline}, 0 0 6px ${ink} !important; }

/* Buttons: flat azure bars with a bright top lip; hover lights the yellow edge. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: ${flat()} !important; border-color: ${azureHi} !important; color: #ffffff !important; border-radius: 3px !important; box-shadow: inset 0 2px 0 ${alpha('#ffffff', 0.4)}, 0 2px 0 ${alpha(ink, 0.6)} !important; text-shadow: 0 1px 2px ${ink} !important; }
${SEL.buttonHover} { background: ${flat(0.12)} !important; border-color: ${yellow} !important; box-shadow: inset 0 2px 0 ${alpha('#ffffff', 0.55)}, 0 0 0 1px ${yellow}, 0 0 10px ${alpha(yellow, 0.5)} !important; }
${SEL.buttonDown} { background: ${deep} !important; border-color: ${yellow} !important; box-shadow: inset 0 2px 5px ${ink} !important; }
${SEL.submit} { background: ${flat()} !important; border-color: ${azureHi} !important; color: #ffffff !important; }

/* Page titles: white on a slanted azure banner. */
${titles} { color: #ffffff !important; text-shadow: ${outline} !important; isolation: isolate; }
${on(titles, 'before')} { content: ""; position: absolute; left: calc(50% - 225px); top: 6%; width: 450px; height: 90%; z-index: -1; pointer-events: none; background: var(--dbtc-banner) center / 100% 100% no-repeat; filter: drop-shadow(0 0 10px ${alpha(azure, 0.5)}); }
${subTitles} { color: #ffffff !important; text-shadow: ${outline} !important; }

/* Pop-ups: a royal-blue circuit panel with DL's angled header tab. */
${SEL.dialog} { background: ${panelFill} !important; border-radius: 4px !important; box-shadow: 0 0 0 2px ${azure}, 0 0 0 4px ${alpha(deep, 0.95)}, 0 0 0 5px ${alpha(azureHi, 0.5)}, 0 26px 60px -12px ${ink} !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; width: auto; height: 78px; bottom: auto; pointer-events: none; z-index: 0; background: var(--dbtc-tab) left top / 100% 100% no-repeat; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; right: 18px; bottom: 14px; left: auto; top: auto; width: 54px; height: 20px; pointer-events: none; z-index: 0; background: var(--dbtc-chev) center / contain no-repeat; transform: none; }
${SEL.dialogTitle} { color: #ffffff !important; text-shadow: ${outline} !important; z-index: 1; }

/* Chat: a flat azure header bar on a circuit body. */
${SEL.chatTop} { background: ${flat()} !important; box-shadow: inset 0 2px 0 ${alpha('#ffffff', 0.45)}, inset 0 -2px 0 ${azureHi} !important; }
${SEL.chat} { background: ${panelFill} !important; box-shadow: inset 0 0 0 1px ${azure}, inset 0 0 0 3px ${alpha(deep, 0.8)} !important; }

/* Duel: slanted LP plates with an italic "LP:", round action-button phases, yellow active. */
${SEL.life} { border-color: ${azureHi} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 12px ${alpha(azure, 0.5)} !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 45%), repeating-linear-gradient(115deg, transparent 0 14px, ${alpha('#ffffff', 0.08)} 14px 18px), linear-gradient(90deg, ${mix(t.self, ink, 0.55)}, ${mix(t.self, ink, 0.15)}) !important; border-radius: 2px !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 45%), repeating-linear-gradient(115deg, transparent 0 14px, ${alpha('#ffffff', 0.08)} 14px 18px), linear-gradient(90deg, ${mix(red, ink, 0.5)}, ${red}) !important; border-radius: 2px !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: linear-gradient(180deg, ${deep}, ${ink}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -46px; top: calc(50% - 13px); width: 44px; height: 26px; pointer-events: none; background: var(--dbtc-lp) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { font-style: italic; color: #ffffff !important; text-shadow: ${outline}, 0 0 8px ${ink} !important; }
${SEL.phase} { background: radial-gradient(circle at 50% 30%, ${azureHi}, ${azure} 60%, ${azureLo}) !important; border-radius: 50% !important; box-shadow: 0 0 0 2px ${ink}, 0 0 10px ${alpha(azure, 0.7)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: radial-gradient(circle at 50% 30%, ${mix(royal, azure, 0.4)}, ${deep}) !important; border-radius: 50% !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(royal, azure, 0.45)}, ${deep} 80%) !important; border-radius: 50% !important; }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(yellow, '#ffffff', 0.45)}, ${yellow} 70%) !important; box-shadow: 0 0 14px ${alpha(yellow, 0.85)}; }
${sel(['#duel .phase span'])} { color: #ffffff !important; text-shadow: 0 1px 2px ${ink} !important; }
${sel(['#duel .phase.active span', '#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${ink} !important; text-shadow: none !important; }
${sel(['#duel #turn .red', '#duel #start_turn .red', '#duel #end_turn .red'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.3)}, ${t.self}, ${mix(t.self, t.bg, 0.3)}) !important; }
${sel(['#duel #turn .blue', '#duel #start_turn .blue', '#duel #end_turn .blue'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.3)}, ${t.opp}, ${mix(t.opp, t.bg, 0.3)}) !important; }
${sel(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span'])} { color: #ffffff !important; text-shadow: ${outline} !important; }
${SEL.duelLog} { background: ${panelFill} !important; border-color: ${azure} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${azureHi}, 0 0 0 4px ${deep}, 0 0 14px ${alpha(azure, 0.6)} !important; }

/* Duel room: circuit panels with header tabs; the hovered duel row gets DL's yellow Target bar. */
${lobbyBorders} { background: ${panelFill} !important; box-shadow: 0 10px 26px -12px ${ink}; }
${on(lobbyBorders, 'before')} { background: linear-gradient(180deg, ${azureHi}, ${azure} 40%, ${azureLo}) !important; filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 60%, ${deep} 60% 86%, transparent 86%) center / 78% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl'])} { background: linear-gradient(90deg, transparent, ${deep} 8% 92%, transparent) 0 72% / 100% 24% no-repeat !important; box-shadow: none !important; border-radius: 0 !important; }
${sel(['#content #settings_content .admin_lbl'])} { background: linear-gradient(90deg, transparent, ${deep} 8% 92%, transparent) 0 42% / 100% 24% no-repeat !important; box-shadow: none !important; border-radius: 0 !important; }
${sel(['#duel_room .duelbutton .background'])} { background: var(--dbtc-c), linear-gradient(90deg, ${alpha(azure, 0.2)}, transparent 50%), ${royal} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(yellow, 0.4)}, ${alpha(yellow, 0.12)}) !important; box-shadow: inset 3px 0 0 ${yellow} !important; }
${sel(['#duel_room #yu', '#duel_room .border'])} { filter: none !important; }

/* Deck constructor: circuit panels, azure rims. */
${deckPanels} { background: ${panelFill} !important; box-shadow: inset 0 0 0 1px ${azure}, inset 0 0 0 3px ${alpha(deep, 0.85)}, inset 0 2px 0 3px ${alpha(azureHi, 0.25)} !important; }

/* Settings sections. */
${SEL.settingsPanel} { border-color: ${azure} !important; background: ${panelFill} !important; border-radius: 4px !important; box-shadow: inset 0 3px 0 ${alpha('#ffffff', 0.12)}, 0 0 12px -2px ${alpha(azure, 0.5)} !important; }

/* Text fields: deep wells with an azure lip, yellow focus. */
${SEL.field} { background-color: ${mix(t.bg, royal, 0.4)} !important; border-color: ${mix(azure, t.border, 0.5)} !important; box-shadow: inset 0 2px 4px ${ink} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${yellow} !important; box-shadow: inset 0 2px 4px ${ink}, 0 0 8px ${alpha(yellow, 0.5)} !important; }

/* Scrollbars: azure rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${azureLo}, ${azureHi}, ${azureLo}) !important; border-radius: 3px !important; }

${popCss}
@media (prefers-reduced-motion: reduce) { ${on(SEL.tile, 'after')} { transition: none !important; } }
`;
};
