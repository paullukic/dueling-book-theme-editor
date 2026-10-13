// shaddoll: the puppet theatre. Navy lacquer plates in a gold hairline frame
// with violet core lenses at the corners, a harlequin diamond grain, and the
// marionette's control bar as the crest with its violet threads running down
// to the panel. Life bars hang from a lens; phases are core lenses in gold.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const gold = t.accent2;
  const goldDim = mix(t.accent2, t.bg, 0.45);
  const goldHi = mix(t.accent2, '#ffffff', 0.4);
  const violet = t.accent;
  const thread = mix(t.accent, t.text, 0.35);
  const navy = mix(t.surface, t.accent, 0.14);
  const navyDeep = mix(t.bg, t.accent, 0.08);
  const ink = mix(t.bg, '#000000', 0.4);

  // Harlequin diamonds, very faint.
  const harl = svg(24, 36, `<path d="M12 0L24 18L12 36L0 18Z" fill="none" stroke="${violet}" stroke-opacity="0.09" stroke-width="0.8"/><path d="M12 9L18 18L12 27L6 18Z" fill="${violet}" fill-opacity="0.04"/>`);

  // A core lens: violet glass in a gold bezel.
  const lens = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r + 1.4}" fill="${gold}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${violet}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.38}" fill="#ffffff" fill-opacity="0.75"/>`;
  // Nine-slice frame: gold hairline pair, a lens in each corner on a gold quarter-scroll.
  const corner = `<path d="M3 15Q3 3 15 3" fill="none" stroke="${gold}" stroke-width="1.2"/>${lens(8.5, 8.5, 3.2)}`;
  const frameSvg = svg(60, 60, `<g fill="none"><rect x="0.7" y="0.7" width="58.6" height="58.6" stroke="${gold}" stroke-width="1.3"/><rect x="4.5" y="4.5" width="51" height="51" stroke="${goldDim}" stroke-width="0.8"/></g>${corner}<g transform="matrix(-1 0 0 1 60 0)">${corner}</g><g transform="matrix(1 0 0 -1 0 60)">${corner}</g><g transform="matrix(-1 0 0 -1 60 60)">${corner}</g>`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // The control bar crest: a gold bar with a lens, threads falling from both ends.
  const control = (w, h, threadLen) => svg(w, h, `<path d="M${w * 0.14} 8L${w * 0.04} ${h}M${w * 0.86} 8L${w * 0.96} ${h}M${w * 0.5} 12V${threadLen}" stroke="${thread}" stroke-width="1.4"/><path d="M${w * 0.1} 5h${w * 0.8}v6h-${w * 0.8}Z" fill="${navyDeep}" stroke="${gold}" stroke-width="1.2"/><path d="M${w * 0.5 - 2.5} 0h5v15h-5Z" fill="${gold}"/>${lens(w * 0.5, 8, 4)}<path d="M${w * 0.1 - 3} 4h4v8h-4ZM${w * 0.9 - 1} 4h4v8h-4Z" fill="${gold}"/>`);
  const tileCrest = control(84, 24, 24);
  const dialogCrest = control(180, 50, 34);

  // A small hanging lens that caps the life bar.
  const pendant = svg(16, 34, `<path d="M8 0V14" stroke="${thread}" stroke-width="1"/><path d="M8 13L14 22L8 32L2 22Z" fill="${navyDeep}" stroke="${gold}" stroke-width="1.2"/>${lens(8, 22, 3)}`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${ink}, 0 0 10px ${alpha(violet, 0.4)} !important;`;
  const lacquer = (lift = 0) => `radial-gradient(ellipse 70% 90% at 50% 0%, ${alpha(violet, 0.18 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${navy}, ${navyDeep})`;

  // Pop-up buttons redrawn as lacquer plates with gold rims and lens studs.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="3" fill="url(#g)" stroke="${c.edge}" stroke-width="2.5"/><rect x="11" y="15" width="${bw - 10}" height="48.5" rx="1" fill="none" stroke="${c.edge}" stroke-opacity="0.55" stroke-width="1"/>${lens(16, 39.2, 3.4)}${lens(w - 16, 39.2, 3.4)}<text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const primary = { top: mix(violet, t.bg, 0.35), bot: mix(violet, t.bg, 0.65), edge: gold, text: '#ffffff' };
  const secondary = { top: mix(navy, t.raised, 0.4), bot: navyDeep, edge: goldDim, text: t.text };
  const popCss = [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.6)}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const plate = `background: var(--dbtc-u2), linear-gradient(180deg, ${navy}, ${navyDeep}) !important;`;
  const button = `background: linear-gradient(180deg, ${mix(navy, t.text, 0.08)}, ${navyDeep}) !important; border-color: ${goldDim} !important; color: ${t.text} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 ${alpha(goldHi, 0.3)}, inset 0 0 0 1px ${alpha(ink, 0.6)}, 0 2px 5px -2px #000000 !important;`;

  const vars = [['u0', svgUrl(frameSvg)], ['u1', svgUrl(tileCrest)], ['u2', svgUrl(harl)], ['u3', svgUrl(dialogCrest)], ['u4', svgUrl(pendant)]];
  return `
html body { ${vars.map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: lacquer plates in the gold frame, hung from a control bar. */
${SEL.tile} { background: ${lacquer()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 15px stretch !important; box-shadow: inset 0 0 0 1px ${alpha(ink, 0.8)}, inset 0 -12px 18px -8px ${alpha('#000000', 0.55)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 42px); top: -17px; width: 84px; height: 24px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${lacquer(0.16)} !important; box-shadow: inset 0 0 0 1px ${alpha(ink, 0.8)}, inset 0 0 22px ${alpha(violet, 0.35)}, 0 0 18px -4px ${alpha(violet, 0.75)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: navy lacquer, gold hairline; violet glow on hover. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { ${button} }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(violet, t.surface, 0.55)}, ${navy}) !important; border-color: ${gold} !important; box-shadow: inset 0 1px 0 ${alpha(goldHi, 0.45)}, 0 0 10px -2px ${alpha(violet, 0.85)} !important; }
${SEL.buttonDown} { background: ${navyDeep} !important; border-color: ${violet} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a lacquer stage in the gold frame, held by the control bar. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(violet, 0.22)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${navy}, ${t.bg}) !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${goldDim}, 0 0 0 4px ${navyDeep}, 0 0 0 5px ${alpha(gold, 0.6)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 90px); top: -55px; right: auto; bottom: auto; width: 180px; height: 50px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; }
${SEL.dialogTitle} { ${label} }

/* Chat: a lacquer header on a gold rule, the window edged in gold. */
${SEL.chatTop} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(violet, t.surface, 0.6)}, ${navyDeep}) !important; box-shadow: inset 0 -2px 0 ${gold}, inset 0 -4px 0 ${navyDeep}, inset 0 1px 0 ${alpha(goldHi, 0.35)} !important; }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; right: 64px; top: 3px; width: 50px; height: 16px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; opacity: 0.9; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${goldDim}, inset -1px 0 0 ${goldDim}, inset 0 -1px 0 ${goldDim} !important; }

/* Duel: gold-framed life bars hung from a lens; phases are core lenses. */
${SEL.life} { border-color: ${mix(violet, t.bg, 0.55)} !important; border-radius: 2px !important; outline: 1px dashed ${alpha(thread, 0.85)} !important; outline-offset: 2px !important; box-shadow: inset 0 0 0 1px ${alpha(thread, 0.35)}, 0 0 0 4px ${ink}, 0 0 10px 3px ${alpha(violet, 0.35)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
/* Low and zero keep the stitched ring: the danger rim is sewn in dashes too. */
html:not([data-dbte-lpstyle]) body #duel .lifepoints:is(#lifepoints1, #lifepoints2):is([data-dbte-lp~="low"], [data-dbte-lp~="zero"]) .life_border { outline: 2px dashed var(--dbte-lp-outline, var(--dbt-danger)) !important; outline-offset: 2px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.26)}, transparent 45%), var(--dbtc-u2), linear-gradient(90deg, ${mix(t.self, t.bg, 0.35)}, ${mix(t.self, '#ffffff', 0.38)} 60%, ${mix(t.self, '#ffffff', 0.2)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.5)} 0 2px, ${alpha('#ffffff', 0.18)} 2px, transparent 50%, ${alpha('#000000', 0.14)}), linear-gradient(90deg, ${mix(t.opp, '#000000', 0.14)}, ${t.opp} 60%, ${mix(t.opp, '#ffffff', 0.22)}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -6px; width: 18px; height: 38px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 210deg, ${goldHi}, ${goldDim}, ${gold}, ${goldDim}, ${goldHi}) !important; box-shadow: 0 0 0 1px ${navyDeep}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${navyDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle at 38% 32%, ${alpha('#ffffff', 0.25)}, transparent 30%), radial-gradient(circle, ${mix(navy, t.raised, 0.4)} 30%, ${navyDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 38% 32%, ${alpha('#ffffff', 0.55)}, transparent 32%), radial-gradient(circle, ${mix(t.self, '#ffffff', 0.15)} 20%, ${mix(t.self, t.bg, 0.55)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 38% 32%, ${alpha('#ffffff', 0.55)}, transparent 32%), radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.15)} 20%, ${mix(t.opp, t.bg, 0.55)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${goldHi} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(t.surface, navy, 0.4)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${goldDim}, inset 0 0 0 4px ${alpha(navyDeep, 0.9)}, inset 0 0 0 5px ${alpha(gold, 0.3)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${gold}, 0 0 0 4px ${navyDeep}, 0 0 0 5px ${alpha(violet, 0.6)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${goldHi}, ${goldDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${navy}, ${navyDeep}) !important; }

${sel(['#duel #turn .red'])} { background: linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.2)}, ${mix(t.opp, t.bg, 0.45)}) !important; }
${sel(['#duel #turn .blue'])} { background: linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.2)}, ${mix(t.self, t.bg, 0.45)}) !important; }
${sel(['#duel #turn span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }

/* Duel room: gold rings with lens corners around lacquer panels. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(navy, 0.6)}, ${alpha(t.bg, 0.78)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${goldHi}, ${goldDim} 30%, ${gold} 55%, ${goldDim} 80%, ${goldHi}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(18)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: linear-gradient(90deg, transparent, ${t.bg} 10% 90%, transparent) 0 60% / 100% 40% no-repeat !important; box-shadow: none !important; border-radius: 0 !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(violet, 0.18)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(violet, 0.42)}, ${alpha(violet, 0.12)}) !important; }

/* Deck constructor and settings: lacquer plates in the same frame. */
${deckPanels} { ${plate} box-shadow: inset 0 0 0 1px ${goldDim}, inset 0 0 0 4px ${alpha(navyDeep, 0.9)}, inset 0 0 0 5px ${alpha(gold, 0.3)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }
${SEL.settingsPanel} { border-color: ${goldDim} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(navy, 0.8)}, ${alpha(t.bg, 0.86)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: porcelain white with a violet underglow. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${ink}, 0 0 16px ${alpha(violet, 0.55)} !important; }

/* Text fields: dark wells with a gold lip, violet focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${goldDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(gold, 0.18)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${violet} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(violet, 0.6)} !important; }

/* Scrollbars: violet thread on a gold rod. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${goldDim}, ${thread}, ${goldDim}) !important; border-radius: 1px !important; }

/* Pop-up buttons in lacquer and gold. */
${popCss}
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-sd-puppet { opacity: 0; }
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-sd-gutter { display: inline; }
/* Front page: the threads fade out behind the Welcome / Forum / Rules links. */
html body:has(#welcome_buttons:not([style*="none"])) #dbte-skin-fx .dbtefx-sd-linkhole { display: inline; }
/* Main menu: the puppet strings fade out above the feed, clear of the status filter. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-sd-menuhole { display: inline; }
`;
};
