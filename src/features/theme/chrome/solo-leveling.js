// solo-leveling: the System. Every surface is a System window: black glass,
// a double cyan hairline with corner brackets, faint scanlines, the boxed "!"
// notification emblem, segmented HP gauges capped with a mana crystal; the
// shadow-violet of the Necromancer class marks what you press.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const cyan = t.accent;
  const ice = mix(t.accent, '#ffffff', 0.55);
  const edgeDim = mix(t.accent, t.bg, 0.5);
  const violet = t.accent2;
  const glassTop = mix(t.bg, cyan, 0.1);
  const glassBot = mix(t.bg, '#000000', 0.3);

  // Nine-slice System frame: two hairlines and bright corner brackets.
  const bracket = `<path d="M1.2 16V1.2H16" fill="none" stroke="${ice}" stroke-width="2.4" stroke-linecap="square"/>`;
  const frameSvg = svg(60, 60, `<rect x="2.5" y="2.5" width="55" height="55" fill="none" stroke="${cyan}" stroke-opacity="0.9" stroke-width="1"/><rect x="5.5" y="5.5" width="49" height="49" fill="none" stroke="${cyan}" stroke-opacity="0.3" stroke-width="1"/>${bracket}<g transform="matrix(-1 0 0 1 60 0)">${bracket}</g><g transform="matrix(1 0 0 -1 0 60)">${bracket}</g><g transform="matrix(-1 0 0 -1 60 60)">${bracket}</g>`);
  const frame = (px = 12) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 18 / ${px}px stretch; box-sizing: border-box;`;

  // The notification emblem: "!" in a glowing square.
  const emblem = svg(28, 28, `<rect x="3" y="3" width="22" height="22" rx="2" fill="${glassBot}" stroke="${cyan}" stroke-width="1.6"/><rect x="5.5" y="5.5" width="17" height="17" rx="1" fill="none" stroke="${cyan}" stroke-opacity="0.35"/><path d="M12.6 7.8H15.4L14.9 17H13.1Z" fill="${ice}"/><rect x="12.7" y="18.6" width="2.6" height="2.6" fill="${ice}"/>`);
  // Mana crystal: the cap of the HP gauges.
  const crystal = svg(18, 34, `<path d="M9 1L16 12L9 33L2 12Z" fill="${mix(cyan, t.bg, 0.35)}" stroke="${ice}" stroke-width="1"/><path d="M9 1L12 12L9 33M2 12H16" fill="none" stroke="${ice}" stroke-opacity="0.55" stroke-width="0.8"/><path d="M9 1L6 12H2Z" fill="#ffffff" fill-opacity="0.35"/>`);
  // HUD ring over the phase discs: four arcs with gaps.
  const ring = svg(45, 45, `<g fill="none" stroke="${ice}" stroke-opacity="0.55" stroke-width="1.4"><path d="M22.5 3.5A19 19 0 0 1 41.5 22.5M22.5 41.5A19 19 0 0 1 3.5 22.5" stroke-dasharray="20 4"/></g><circle cx="22.5" cy="22.5" r="15.5" fill="none" stroke="${cyan}" stroke-opacity="0.3"/>`);

  const scan = `repeating-linear-gradient(180deg, ${alpha(cyan, 0.04)} 0 1px, transparent 1px 3px)`;
  const glass = (lift = 0) => `linear-gradient(180deg, ${alpha(cyan, 0.08 + lift)}, transparent 45%), ${scan}, linear-gradient(180deg, ${glassTop}, ${glassBot})`;
  const label = `color: ${t.text} !important; text-shadow: 0 0 6px ${alpha(cyan, 0.6)}, 0 1px 2px #000000 !important;`;
  const header = (h = 34) => `linear-gradient(180deg, ${alpha(cyan, 0.16)} 0 ${h}px, ${alpha(cyan, 0.75)} ${h}px ${h + 1}px, transparent ${h + 1}px)`;

  // Pop-up buttons: System glass with brackets; bright for yes, dim for no.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    const br = (x, y, sx, sy) => `<path d="M${x} ${y + sy * 12}V${y}H${x + sx * 12}" fill="none" stroke="${c.edge}" stroke-width="2.6"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="8" y="12" width="${bw - 4}" height="54.5" fill="url(#g)" stroke="${c.line}" stroke-width="1.2"/><rect x="11.5" y="15.5" width="${bw - 11}" height="47.5" fill="none" stroke="${c.line}" stroke-opacity="0.35"/>${br(6, 10, 1, 1)}${br(w - 6, 10, -1, 1)}${br(6, 68.5, 1, -1)}${br(w - 6, 68.5, -1, -1)}<text x="${w / 2}" y="40" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="25" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 0 6px ${c.glow}) !important; }`).join('\n');
  const popPrimary = { top: mix(t.bg, cyan, 0.32), bot: mix(t.bg, cyan, 0.12), line: cyan, edge: ice, text: '#ffffff', glow: alpha(cyan, 0.55) };
  const popSecondary = { top: mix(t.bg, cyan, 0.12), bot: glassBot, line: edgeDim, edge: mix(ice, t.bg, 0.3), text: t.text, glow: alpha('#000000', 0.6) };

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [frameSvg, emblem, crystal, ring].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: System windows in black glass, bracketed, the "!" emblem on the corner. */
${SEL.tile} { background: ${glass()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 18 / 12px stretch !important; box-shadow: 0 0 14px -4px ${alpha(cyan, 0.45)}, inset 0 0 18px -6px ${alpha(cyan, 0.35)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: -7px; top: -7px; width: 21px; height: 21px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 0 4px ${alpha(cyan, 0.8)}); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${glass(0.12)} !important; box-shadow: 0 0 22px -2px ${alpha(cyan, 0.75)}, inset 0 0 26px -4px ${alpha(cyan, 0.55)}, 0 12px 24px -12px #000000 !important; }
${sel(['#main_menu .menu_btn:active .content'])} { box-shadow: 0 0 22px -2px ${alpha(violet, 0.85)}, inset 0 0 26px -4px ${alpha(violet, 0.6)} !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: glass with a cyan hairline; violet when pressed. */
${SEL.button} { background: ${glass()} !important; border-color: ${edgeDim} !important; color: ${t.text} !important; border-radius: 0 !important; box-shadow: inset 0 0 0 1px ${alpha(t.bg, 0.8)}, 0 0 8px -3px ${alpha(cyan, 0.6)} !important; }
${SEL.buttonHover} { background: ${glass(0.14)} !important; border-color: ${cyan} !important; color: #ffffff !important; box-shadow: inset 0 0 10px ${alpha(cyan, 0.35)}, 0 0 12px -2px ${alpha(cyan, 0.85)} !important; }
${SEL.buttonDown} { background: linear-gradient(180deg, ${mix(t.bg, violet, 0.35)}, ${mix(t.bg, violet, 0.15)}) !important; border-color: ${violet} !important; box-shadow: inset 0 0 10px ${alpha(violet, 0.6)} !important; }
${sel(['#content .button.disabled'])} { opacity: 0.5 !important; }

/* Pop-ups: the System window: a header band under a cyan rule, brackets, the "!" emblem by the title. */
${SEL.dialog} { background: ${header(44)}, ${glass()} !important; border-radius: 0 !important; box-shadow: 0 0 0 1px ${cyan}, 0 0 0 3px ${alpha(t.bg, 0.9)}, 0 0 0 4px ${alpha(cyan, 0.35)}, 0 0 34px -4px ${alpha(cyan, 0.55)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: -7px; top: -7px; right: -7px; bottom: -7px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(14)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: 12px; top: 8px; right: auto; bottom: auto; width: 28px; height: 28px; pointer-events: none; z-index: 1; background: var(--dbtc-u1) center / contain no-repeat; transform: none; filter: drop-shadow(0 0 5px ${alpha(cyan, 0.9)}); }
${SEL.dialogTitle} { color: ${ice} !important; text-shadow: 0 0 10px ${alpha(cyan, 0.9)}, 0 1px 2px #000000 !important; }

/* Chat: a System window too. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha(cyan, 0.22)}, ${alpha(cyan, 0.08)}), ${scan}, ${glassBot} !important; box-shadow: inset 0 -1px 0 ${cyan}, inset 0 1px 0 ${alpha(cyan, 0.45)}, 0 0 10px -2px ${alpha(cyan, 0.5)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${ice} !important; text-shadow: 0 0 6px ${alpha(cyan, 0.8)} !important; }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; right: 66px; top: 3px; width: 20px; height: 20px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; }
${SEL.chat} { background: ${glass()} !important; box-shadow: inset 1px 0 0 ${edgeDim}, inset -1px 0 0 ${edgeDim}, inset 0 -1px 0 ${edgeDim} !important; }

/* Duel: segmented HP gauges capped with a mana crystal; HUD-ring phases that light up. */
${SEL.life} { border-color: ${cyan} !important; border-radius: 0 !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 0 2px ${alpha(cyan, 0.35)}, 0 0 12px -2px ${alpha(cyan, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 0 !important; }
${SEL.lifeSelf} { background: repeating-linear-gradient(90deg, transparent 0 10px, ${alpha('#000000', 0.45)} 10px 12px), linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.45)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: repeating-linear-gradient(90deg, transparent 0 10px, ${alpha('#000000', 0.45)} 10px 12px), linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -17px; top: -3px; width: 18px; height: 36px; pointer-events: none; background: var(--dbtc-u2) center / contain no-repeat; filter: drop-shadow(0 0 4px ${alpha(cyan, 0.9)}); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 0 6px ${alpha(cyan, 0.8)}, 0 1px 2px #000000 !important; }
${SEL.phase} { background: linear-gradient(180deg, ${cyan}, ${edgeDim}) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 10px -2px ${alpha(cyan, 0.6)} !important; }
${sel(['#duel .phase.active .background'])} { background: linear-gradient(180deg, ${mix(violet, '#ffffff', 0.4)}, ${violet}) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 0 3px ${mix(violet, '#ffffff', 0.35)}, 0 0 20px 6px ${alpha(violet, 0.9)} !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${t.bg} !important; text-shadow: 0 0 3px ${alpha('#ffffff', 0.7)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${glassBot} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u3) center / 100% 100%, ${scan}, radial-gradient(circle, ${mix(t.bg, cyan, 0.22)}, ${glassBot} 75%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u3) center / 100% 100%, radial-gradient(circle, #ffffff 0, ${mix(violet, '#ffffff', 0.55)} 18%, ${violet} 46%, ${mix(violet, t.bg, 0.55)} 80%) !important; box-shadow: 0 0 0 2px ${mix(violet, '#ffffff', 0.55)}, 0 0 0 4px ${mix(violet, '#ffffff', 0.15)}, 0 0 22px 7px ${alpha(mix(violet, '#ffffff', 0.2), 0.95)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u3) center / 100% 100%, radial-gradient(circle, #ffffff 0, ${mix(violet, '#ffffff', 0.55)} 18%, ${violet} 46%, ${mix(violet, t.bg, 0.55)} 80%) !important; box-shadow: 0 0 0 2px ${mix(violet, '#ffffff', 0.55)}, 0 0 0 4px ${mix(violet, '#ffffff', 0.15)}, 0 0 22px 7px ${alpha(mix(violet, '#ffffff', 0.2), 0.95)}; }
${sel(['#duel .phase span'])} { color: ${ice} !important; text-shadow: 0 0 6px ${alpha(cyan, 0.8)}, 0 1px 2px #000000 !important; }
${sel(['#duel .cout_txt'])} { background: ${header(0)}, ${glass()} !important; box-shadow: inset 0 0 0 1px ${edgeDim}, inset 0 0 0 3px ${alpha(t.bg, 0.9)}, inset 0 0 0 4px ${alpha(cyan, 0.3)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 1px ${cyan}, 0 0 0 4px ${t.bg}, 0 0 0 5px ${alpha(cyan, 0.4)}, 0 0 14px ${alpha(cyan, 0.4)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${mix(violet, '#ffffff', 0.3)}, ${mix(violet, t.bg, 0.4)}) !important; }
${sel(['#duel #turn .red', '#duel #turn .blue'])} { background: radial-gradient(circle, ${mix(violet, t.bg, 0.3)}, ${mix(violet, t.bg, 0.6)}) !important; box-shadow: inset 0 0 0 2px ${mix(violet, '#ffffff', 0.35)}, 0 0 12px ${alpha(violet, 0.7)} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${scan}, linear-gradient(180deg, ${mix(t.bg, violet, 0.45)}, ${mix(t.bg, violet, 0.2)}) !important; }

/* Duel room: bracketed System panels. */
${lobbyBorders} { background: ${glass()} !important; box-shadow: 0 0 18px -6px ${alpha(cyan, 0.5)}; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${ice}, ${cyan} 30%, ${edgeDim} 60%, ${cyan}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -6px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${glassBot} !important; box-shadow: 0 0 0 0.35em ${glassBot} !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(cyan, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(cyan, 0.4)}, ${alpha(cyan, 0.1)}) !important; }

/* Deck constructor: System panels. */
${deckPanels} { background: ${glass()} !important; box-shadow: inset 0 0 0 1px ${edgeDim}, inset 0 0 0 3px ${alpha(t.bg, 0.9)}, inset 0 0 0 4px ${alpha(cyan, 0.3)}, inset 0 0 22px -8px ${alpha(cyan, 0.5)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(12)} }

/* Settings panels: System windows. */
${settingsPanels} { border-color: ${edgeDim} !important; background: ${glass()} !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -6px; pointer-events: none; ${frame(14)} }

/* Titles: ice with the System glow. */
${titles} { color: ${ice} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 0 14px ${alpha(cyan, 0.75)} !important; }

/* Text fields: black glass with a cyan underline. */
${SEL.field} { background-color: ${glassBot} !important; border-color: ${edgeDim} !important; box-shadow: inset 0 -1px 0 ${cyan}, inset 0 0 8px ${alpha(cyan, 0.15)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${cyan} !important; box-shadow: inset 0 -1px 0 ${cyan}, 0 0 10px ${alpha(cyan, 0.7)} !important; }

/* Scrollbars: a cyan bar. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${edgeDim}, ${cyan}, ${edgeDim}) !important; border-radius: 0 !important; box-shadow: 0 0 6px ${alpha(cyan, 0.6)} !important; }

/* Pop-up buttons: System glass. */
${popCss(popPrimary, popSecondary)}
`;
};
