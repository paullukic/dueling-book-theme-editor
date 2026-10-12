// ryzeal: the engine bay. Brushed gunmetal plates with chamfered corners and
// hex bolts, an amber ignition rail, ice-blue arc lines, ignition coil drums
// as crests, spark-plug finials, rev-counter life bars and flywheel phases.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha, n1 }) => {
  const amber = t.accent;
  const amberHi = mix(amber, '#ffffff', 0.4);
  const ice = t.accent2;
  const steel = mix(t.raised, t.text, 0.16);
  const steelHi = mix(t.raised, t.text, 0.45);
  const steelDark = mix(t.bg, '#000000', 0.3);
  const plate = mix(t.raised, t.surface, 0.4);
  const hex = (x, y, r, fill = steel) => {
    const p = [0, 1, 2, 3, 4, 5].map((i) => `${n1(x + Math.cos((Math.PI / 3) * i + Math.PI / 6) * r)} ${n1(y + Math.sin((Math.PI / 3) * i + Math.PI / 6) * r)}`);
    return `<path d="M${p.join('L')}Z" fill="${fill}" stroke="${steelDark}" stroke-width="0.8"/><circle cx="${x}" cy="${y}" r="${n1(r * 0.4)}" fill="${steelDark}"/>`;
  };

  // Brushed metal: fine horizontal grain.
  const brushed = svg(8, 6, `<path d="M0 .5H8M0 3.5H5" stroke="${t.text}" stroke-opacity="0.035"/>`);

  // An ice-blue arc running along a plate's foot.
  const arcStrip = svg(36, 8, `<path d="M0 5L5 2L9 6L15 1L20 5L26 2L31 6L36 4" fill="none" stroke="${ice}" stroke-opacity="0.75" stroke-width="1.2" stroke-linejoin="round"/>`);

  // Nine-slice frame: a chamfered steel lip with a hex bolt in each corner
  // and an amber tick on each side.
  const frameSvg = svg(60, 60, `<path d="M9 1H51L59 9V51L51 59H9L1 51V9Z" fill="none" stroke="${steelHi}" stroke-width="1.4"/><path d="M10 4H50L56 10V50L50 56H10L4 50V10Z" fill="none" stroke="${steelDark}" stroke-width="1.2"/>${hex(11, 11, 4.6)}${hex(49, 11, 4.6)}${hex(11, 49, 4.6)}${hex(49, 49, 4.6)}<path d="M4 26V34M56 26V34" stroke="${amber}" stroke-width="2.4"/>`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Ignition coil drum, end-on: steel barrel, amber ring, dark core.
  const drum = (x, y, r) => {
    let g = '';
    for (let i = 0; i < 12; i++) {
      const a = (Math.PI / 6) * i;
      g += `M${n1(x + Math.cos(a) * r * 0.62)} ${n1(y + Math.sin(a) * r * 0.62)}L${n1(x + Math.cos(a) * r * 0.92)} ${n1(y + Math.sin(a) * r * 0.92)}`;
    }
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${steel}" stroke="${steelDark}" stroke-width="1.2"/><path d="${g}" stroke="${steelDark}" stroke-width="${n1(r * 0.07)}"/><circle cx="${x}" cy="${y}" r="${n1(r * 0.6)}" fill="none" stroke="${amber}" stroke-width="${n1(r * 0.18)}"/><circle cx="${x}" cy="${y}" r="${n1(r * 0.36)}" fill="${steelDark}"/><circle cx="${x}" cy="${y}" r="${n1(r * 0.13)}" fill="${amberHi}"/>`;
  };
  // Tile crest: a coil drum on a steel bracket with an arc jumping off it.
  const crest = svg(52, 26, `<path d="M4 22H48L44 26H8Z" fill="${steel}" stroke="${steelDark}" stroke-width="0.8"/>${drum(26, 13, 11.5)}<path d="M38 13L42 9L41 14L47 10" fill="none" stroke="${ice}" stroke-width="1.4" stroke-linejoin="round"/><path d="M14 13L10 17L11 12L5 16" fill="none" stroke="${ice}" stroke-width="1.4" stroke-linejoin="round"/>`);

  // Pop-up crest: an engine cover with cooling fins between two coil drums,
  // an arc bridging them over an amber ignition strip.
  let fins = '';
  for (let x = 48; x <= 112; x += 8) fins += `M${x} 22V44`;
  const gable = svg(160, 60, `<path d="M36 50L44 14H116L124 50Z" fill="${plate}" stroke="${steelHi}" stroke-width="1.4"/><path d="${fins}" stroke="${steelDark}" stroke-width="3.5" stroke-linecap="round"/><path d="${fins}" stroke="${steelHi}" stroke-opacity="0.4" stroke-width="1" transform="translate(-1.2 0)"/><path d="M40 50H120" stroke="${amber}" stroke-width="3"/>${hex(50, 18, 2.6)}${hex(110, 18, 2.6)}${drum(24, 36, 18)}${drum(136, 36, 18)}<path d="M38 22L54 6L70 14L84 2L98 12L112 4L122 22" fill="none" stroke="${ice}" stroke-opacity="0.45" stroke-width="5" stroke-linejoin="round"/><path d="M38 22L54 6L70 14L84 2L98 12L112 4L122 22" fill="none" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>`);

  // Spark plug finial for the life bar: terminal, ceramic insulator, hex nut, electrode.
  const plug = svg(16, 42, `<rect x="6" y="0.5" width="4" height="4" rx="1" fill="${steelHi}"/><path d="M5 5H11L11.6 19H4.4Z" fill="${mix(amber, steelDark, 0.25)}" stroke="${steelDark}" stroke-width="0.8"/><path d="M5.2 9H10.8M5 13H11" stroke="${steelDark}" stroke-opacity="0.4" stroke-width="0.8"/><path d="M2 19H14V25H2Z" fill="${steel}" stroke="${steelDark}" stroke-width="0.8"/><path d="M5 25H11V34H5Z" fill="${steelHi}" stroke="${steelDark}" stroke-width="0.6"/><path d="M8 34V38H11V36" fill="none" stroke="${steelHi}" stroke-width="1.2"/><path d="M9 38.5L12 41" stroke="${ice}" stroke-width="1.4"/>`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${steelDark}, 0 0 8px ${steelDark} !important;`;
  const metal = (lift = 0) => `var(--dbtc-u5) left 6px bottom 3px / 36px 8px repeat-x, radial-gradient(ellipse 60% 120% at 0% 50%, ${alpha(amber, 0.14 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${mix(plate, t.text, 0.06)}, ${mix(t.surface, t.bg, 0.4)})`;

  // Pop-up buttons: chamfered steel plates, bolted at the ends.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="M18 10H${n1(w - 18)}L${n1(w - 6)} 22V56.5L${n1(w - 18)} 68.5H18L6 56.5V22Z" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/><path d="M20 15H${n1(w - 20)}" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5"/><path d="M22 63H${n1(w - 22)}" stroke="${c.rail}" stroke-width="2.5"/>${hex(19, 39.25, 5, c.bolt)}${hex(n1(w - 19), 39.25, 5, c.bolt)}<text x="${n1(w / 2)}" y="39.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="800" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: amberHi, bot: mix(amber, '#000000', 0.1), edge: mix(amber, '#000000', 0.55), rail: mix(amber, '#000000', 0.4), bolt: mix(amber, t.text, 0.5), text: t.accentText, shadow: alpha(amber, 0.35) };
  const popSecondary = { top: steel, bot: steelDark, edge: steelHi, rail: ice, bolt: steel, text: t.text, shadow: alpha('#000000', 0.7) };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${c.shadow}) !important; }`).join('\n');

  const titlePlate = mix(plate, t.bg, 0.45);
  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const rev = (c) => `repeating-linear-gradient(90deg, transparent 0 9px, ${alpha(steelDark, 0.85)} 9px 11px) left center / 100% 100% no-repeat, linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 45%), linear-gradient(90deg, ${mix(c, t.bg, 0.33)}, ${c} 50%, ${mix(c, t.bg, 0.3)})`;
  const vars = [frameSvg, crest, brushed, gable, plug, arcStrip].map((s, i) => `--dbtc-u${i}: ${svgUrl(s)};`).join(' ');

  return `
html body { ${vars} }
/* Menu tiles: brushed gunmetal in a bolted chamfer frame, an amber ignition rail, a coil drum on top. */
${SEL.tile} { background: ${metal()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 17px stretch !important; border-radius: 0 !important; box-shadow: inset 4px 0 0 ${amber}, inset 0 1px 0 ${alpha(steelHi, 0.3)}, inset 0 -12px 16px -10px #000000, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 22px); top: -10px; width: 44px; height: 22px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${metal(0.16)} !important; box-shadow: inset 4px 0 0 ${amberHi}, inset 0 0 0 1px ${alpha(amber, 0.5)}, inset 0 0 20px ${alpha(amber, 0.18)}, 0 0 18px -4px ${alpha(amber, 0.7)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: steel with a machined top edge and an ice arc line along the foot. */
${SEL.button} { background: var(--dbtc-u2), linear-gradient(180deg, ${steel}, ${steelDark}) !important; border-color: ${mix(steelHi, t.bg, 0.3)} !important; color: ${t.text} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 ${alpha(steelHi, 0.6)}, inset 0 -2px 0 ${alpha(ice, 0.5)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(steel, amber, 0.18)}, ${steelDark}) !important; border-color: ${amber} !important; box-shadow: inset 0 1px 0 ${alpha(amberHi, 0.6)}, inset 0 -2px 0 ${ice}, 0 0 10px -2px ${alpha(amber, 0.7)} !important; }
${SEL.buttonDown} { background: ${steelDark} !important; border-color: ${ice} !important; box-shadow: inset 0 2px 5px #000000 !important; }
${sel(['#content .button.disabled'])} { opacity: 0.55 !important; }

/* Pop-ups: a bolted engine-bay plate under the finned cover and its two coil drums. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(amber, 0.12)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${plate}, ${t.bg}) !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${steelHi}, 0 0 0 4px ${steelDark}, 0 0 0 5px ${alpha(amber, 0.7)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 80px); top: -46px; right: auto; bottom: auto; width: 160px; height: 60px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 3px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a steel header with an amber rail. */
${SEL.chatTop} { background: var(--dbtc-u2), linear-gradient(180deg, ${steel}, ${steelDark}) !important; box-shadow: inset 0 -2px 0 ${amber}, inset 0 1px 0 ${alpha(steelHi, 0.5)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${steel}, inset -1px 0 0 ${steel}, inset 0 -1px 0 ${steel} !important; }

/* Duel: rev-counter life bars with a spark plug; flywheel phases. */
${SEL.life} { border-color: ${steelHi} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${steelDark}, 0 0 0 3px ${steel}, 0 0 0 4px ${steelDark}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: ${rev(t.self)} !important; }
${SEL.lifeOpp} { background: ${rev(t.opp)} !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -16px; top: -7px; width: 16px; height: 42px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 210deg, ${steelHi}, ${steelDark}, ${steel}, ${steelDark}, ${steelHi}) !important; box-shadow: 0 0 0 1px ${steelDark}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${steelDark} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle, ${plate} 40%, ${steelDark}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle, ${mix(t.self, '#ffffff', 0.3)} 15%, ${t.self} 45%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.3)} 15%, ${t.opp} 45%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 3px 0 0 ${amber}, inset 0 0 0 1px ${steel} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${steelHi}, 0 0 0 4px ${steelDark}, 0 0 0 5px ${alpha(amber, 0.7)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${amberHi}, ${mix(amber, '#000000', 0.3)}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${steel}, ${steelDark}) !important; }

/* Duel room: bolted steel rings around the panels. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(plate, 0.65)}, ${alpha(t.bg, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${steelHi}, ${steelDark} 30%, ${steel} 55%, ${steelDark} 80%, ${steelHi}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(18)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(90deg, transparent 4%, ${titlePlate} 12% 88%, transparent 96%) !important; box-shadow: none !important; }
${sel(['#deck_constructor #search .title_txt'])} { background: ${titlePlate} !important; box-shadow: 0 0 0 0.3em ${titlePlate} !important; border-radius: 3px !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${steelDark} !important; box-shadow: 0 0 0 0.35em ${steelDark} !important; border-radius: 2px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(amber, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(amber, 0.38)}, ${alpha(ice, 0.1)}) !important; }

/* Deck constructor: machined trays. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(plate, t.surface, 0.5)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${steel}, inset 0 0 0 3px ${alpha(steelDark, 0.9)}, inset 3px 0 0 3px ${alpha(amber, 0.6)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }

/* Settings panels: the same bolted frame. */
${SEL.settingsPanel} { border-color: ${steel} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(plate, 0.85)}, ${alpha(t.bg, 0.88)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: stamped steel with an ignition glow. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${steelDark}, 0 0 16px ${alpha(amber, 0.55)} !important; }

/* Text fields: dark wells with a steel lip, ice focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${steel} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(steelHi, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${ice} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(ice, 0.6)} !important; }

/* Scrollbars: amber pistons. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${mix(amber, '#000000', 0.3)}, ${amberHi}, ${mix(amber, '#000000', 0.3)}) !important; border-radius: 1px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
/* The engine (core at viewBox 1285 430, stator radius ~202) moves per page. The stage overhangs the viewport
   by 6% a side and slices at 1.433 px per unit: screen x = 1.433 x - 123, screen y = 1.433 y - 110.
   Duel: as large as fits whole in the right gutter (screen x 1886-2046). Menu: whole, right of the feed's
   time and Reply column (screen x 1810-2042). Front page: 30px lower, clear of Welcome / Forum / Rules. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-rz-core { transform: translate(1104.4px, 331.8px) scale(0.275); }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-rz-core { transform: translate(915.9px, 281.6px) scale(0.4); }
html body:has(#welcome_buttons:not([style*="none"])) #dbte-skin-fx .dbtefx-rz-core { transform: translate(0, 21px); }
`;
};
