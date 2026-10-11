// mitsurugi: the Mitsurugi shrine at night. Vermilion torii lintels with a
// black kasagi cap frame every panel, shimenawa rope with zigzag shide hangs
// over the pop-ups, sword steel draws the lines: life bars are blades with a
// wrapped hilt, phases are sword guards (tsuba). Gold seigaiha waves in the lacquer.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const shu = t.accent;
  const shuDeep = mix(t.accent, t.bg, 0.45);
  const shuLit = mix(t.accent, '#ffffff', 0.18);
  const sumi = mix(t.bg, '#000000', 0.3);
  const steel = mix(t.text, t.muted, 0.45);
  const steelDim = mix(t.muted, t.border, 0.4);
  const gold = t.accent2;
  const lacquer = mix(t.surface, t.bg, 0.4);
  const straw = mix(gold, t.text, 0.45);

  // Seigaiha waves, faint gold.
  const waves = svg(40, 20, `<g fill="none" stroke="${gold}" stroke-opacity="0.08" stroke-width="1"><path d="M0 20a20 20 0 0 1 40 0M6 20a14 14 0 0 1 28 0M12 20a8 8 0 0 1 16 0"/><path d="M-20 10a20 20 0 0 1 40 0M-14 10a14 14 0 0 1 28 0M-8 10a8 8 0 0 1 16 0M20 10a20 20 0 0 1 40 0M26 10a14 14 0 0 1 28 0M32 10a8 8 0 0 1 16 0"/></g>`);

  // Nine-slice torii: black kasagi cap with upturned ends, vermilion beam,
  // vermilion pillars down the sides, a steel line along the foot.
  const toriiSvg = svg(60, 60, `<path d="M0 0.5Q8 4 20 4H40Q52 4 60 0.5V6H0Z" fill="${sumi}"/><path d="M0 0.5Q8 4 20 4H40Q52 4 60 0.5" fill="none" stroke="${steelDim}" stroke-width="0.6"/><rect x="0" y="6" width="60" height="6" fill="${shu}"/><rect x="0" y="6" width="60" height="1.2" fill="${shuLit}"/><rect x="0" y="11" width="60" height="1" fill="${shuDeep}"/><rect x="3" y="12" width="5" height="48" fill="${shu}"/><rect x="52" y="12" width="5" height="48" fill="${shu}"/><rect x="3" y="12" width="1.2" height="48" fill="${shuLit}"/><rect x="52" y="12" width="1.2" height="48" fill="${shuLit}"/><rect x="2" y="55" width="7" height="5" fill="${sumi}"/><rect x="51" y="55" width="7" height="5" fill="${sumi}"/><rect x="9" y="58" width="42" height="0.9" fill="${steel}" fill-opacity="0.7"/>`);
  // The kasagi alone, overhanging the tile with upturned ends.
  const kasagi = svg(270, 10, `<path d="M0 0.5Q20 5 50 5H220Q250 5 270 0.5V5.5Q250 8.5 222 8.5H48Q20 8.5 0 5.5Z" fill="${sumi}"/><path d="M0 0.5Q20 5 50 5H220Q250 5 270 0.5" fill="none" stroke="${steel}" stroke-width="1.2"/>`);
  const torii = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Shimenawa: a twisted straw rope with zigzag shide paper, hung under a full
  // kasagi with upturned ends that overhangs the pop-up.
  const shide = (x, y) => `<path d="M${x} ${y}h8l-4 6h7l-4 6h7l-4 6h-5l3-4h-7l4-6h-7l3-4Z" fill="#ffffff" fill-opacity="0.94" stroke="${steelDim}" stroke-width="0.5"/>`;
  const twist = `<defs><pattern id="tw" width="9" height="46" patternUnits="userSpaceOnUse"><path d="M0 17q5 3.5 0 9" fill="none" stroke="${mix(straw, t.bg, 0.45)}" stroke-width="1.4"/></pattern></defs><path d="M30 16Q320 30 610 16V24Q320 38 30 24Z" fill="url(#tw)"/>`;
  const lintel = svg(640, 46, `<path d="M0 1Q40 9 110 9H530Q600 9 640 1V9Q600 15 532 15H108Q40 15 0 9Z" fill="${sumi}"/><path d="M0 1Q40 9 110 9H530Q600 9 640 1" fill="none" stroke="${steel}" stroke-width="1.5"/><path d="M30 16Q320 30 610 16V24Q320 38 30 24Z" fill="${straw}"/>${twist}<path d="M30 16Q320 30 610 16" fill="none" stroke="#ffffff" stroke-opacity="0.3"/>${shide(118, 24)}${shide(514, 24)}${shide(190, 28)}${shide(442, 28)}`);

  // Tsuba: a sword guard ring with the tang opening and two side ports, over the phase discs.
  const tsuba = svg(45, 45, `<g fill="none" stroke="${gold}" stroke-opacity="0.45"><circle cx="22.5" cy="22.5" r="20.5" stroke-width="1.6"/><circle cx="22.5" cy="22.5" r="18" stroke-width="0.6"/></g><g fill="none" stroke="${steel}" stroke-opacity="0.35" stroke-width="0.9"><path d="M8 18q-3 4.5 0 9q3-4.5 0-9Z"/><path d="M37 18q3 4.5 0 9q-3-4.5 0-9Z"/></g>`);

  // A wrapped hilt (tsuka) with its guard: the blade is the life bar.
  let wrap = '';
  for (let i = 0; i < 4; i++) wrap += `<path d="M${3 + i * 4.6} 10l2.3 5 2.3-5-2.3-5Z" fill="${shu}" fill-opacity="0.85"/>`;
  const hilt = svg(30, 30, `<rect x="1" y="9" width="21" height="12" rx="2" fill="${sumi}" stroke="${gold}" stroke-width="0.8"/><g transform="translate(0 5)">${wrap}</g><rect x="0" y="10" width="2" height="10" fill="${gold}"/><ellipse cx="25" cy="15" rx="3.6" ry="13" fill="${sumi}" stroke="${gold}" stroke-width="1.2"/><rect x="28" y="10.5" width="2" height="9" fill="${gold}"/>`);

  // The tempered line (hamon) along the blade.
  const hamon = svg(40, 26, `<path d="M0 17q5-4 10 0t10 0t10 0t10 0" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.4"/>`);

  const lacquerBg = (lift = 0) => `linear-gradient(180deg, ${alpha(shu, 0.08 + lift)}, transparent 50%), var(--dbtc-u2), linear-gradient(180deg, ${mix(t.raised, t.surface, 0.5)}, ${lacquer})`;
  const label = `color: ${t.text} !important; text-shadow: 0 2px 0 ${sumi}, 0 0 10px ${alpha(sumi, 0.9)} !important;`;

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#settings .about_me', '#settings .preferences', '#settings .social_media', '#settings .animation', '#settings .profile_song', '#settings .account', '#settings .messages', '#settings .duel_stats', '#settings .profile_comments']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const u0 = svgUrl(toriiSvg);
  const u1 = svgUrl(kasagi);
  const u2 = svgUrl(waves);
  const u3 = svgUrl(lintel);
  const u4 = svgUrl(hamon);
  const u5 = svgUrl(hilt);
  const u6 = svgUrl(tsuba);
  return `
html body { ${[['u0', u0], ['u1', u1], ['u2', u2], ['u3', u3], ['u4', u4], ['u5', u5], ['u6', u6]].map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: each is a torii gate over black lacquer and gold waves. */
${SEL.tile} { background: ${lacquerBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 14px stretch !important; border-radius: 0 !important; box-shadow: 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: -10px; right: -10px; top: -6px; height: 9px; pointer-events: none; background: var(--dbtc-u1) center / 100% 100% no-repeat; filter: drop-shadow(0 2px 1px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${lacquerBg(0.2)} !important; box-shadow: 0 0 22px -6px ${alpha(shu, 0.9)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: black lacquer with a vermilion foot and a steel edge. */
${SEL.button} { background: linear-gradient(180deg, ${mix(t.raised, t.border, 0.3)}, ${sumi}) !important; border-color: ${steelDim} !important; color: ${t.text} !important; border-radius: 1px !important; box-shadow: inset 0 -2px 0 ${shu}, inset 0 1px 0 ${alpha(steel, 0.3)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${shuLit}, ${shuDeep}) !important; border-color: ${gold} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.3)}, 0 0 10px -2px ${alpha(shu, 0.9)} !important; }
${SEL.buttonDown} { background: ${shuDeep} !important; border-color: ${gold} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a shrine gate with shimenawa and shide hung beneath the lintel. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 50% at 50% 100%, ${alpha(shu, 0.14)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${sumi}) !important; border-radius: 0 !important; box-shadow: 0 0 0 1px ${steelDim}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: -10px; top: -10px; right: -10px; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${torii(28)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: -20px; top: -18px; right: auto; bottom: auto; width: 640px; height: 46px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / 100% 100% no-repeat; filter: drop-shadow(0 2px 2px #000000); transform: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 ${sumi}, 0 0 12px ${alpha(shu, 0.55)} !important; }

/* Chat: a vermilion lintel under a black cap; steel rails down the window. */
${SEL.chatTop} { background: linear-gradient(180deg, ${sumi} 0 4px, ${shuLit} 4px, ${shu} 40%, ${shuDeep}) !important; box-shadow: inset 0 -2px 0 ${sumi} !important; border-radius: 0 !important; }
${sel(['#chats .chat .chat_top span'])} { color: #ffffff !important; text-shadow: 0 1px 2px ${sumi}, 0 0 4px ${sumi} !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${lacquer}) !important; box-shadow: inset 3px 0 0 ${shu}, inset -3px 0 0 ${shu}, inset 0 -1px 0 ${steel} !important; }

/* Duel: life bars are blades with a wrapped hilt; phases are sword guards. */
${SEL.life} { border-color: ${steel} !important; border-radius: 2px 14px 14px 2px !important; box-shadow: 0 0 0 1px ${sumi}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px 14px 14px 2px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.4)}, transparent 40%, ${alpha('#000000', 0.25)}), var(--dbtc-u4) 0 0 / 40px 100% repeat-x, linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.4)}, transparent 40%, ${alpha('#000000', 0.25)}), var(--dbtc-u4) 0 0 / 40px 100% repeat-x, linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: linear-gradient(180deg, ${steelDim}, ${sumi}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -34px; top: -3px; width: 36px; height: 36px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 200deg, ${gold}, ${mix(gold, sumi, 0.5)}, ${gold}, ${mix(gold, sumi, 0.6)}, ${gold}) !important; box-shadow: 0 0 0 1px ${sumi}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${sumi} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(t.raised, steelDim, 0.25)} 30%, ${sumi}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${shuLit} 25%, ${shuDeep}) !important; box-shadow: 0 0 14px ${alpha(shu, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.15)} 25%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${steel} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${sumi} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${shuLit}, ${shuDeep}) !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${lacquer}) !important; box-shadow: inset 0 3px 0 ${sumi}, inset 0 9px 0 ${shu}, inset 3px 0 0 ${shu}, inset -3px 0 0 ${shu} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${shu}, 0 0 0 3px ${sumi}, 0 6px 16px -6px #000000 !important; }

/* Duel room: vermilion rings, gate frames. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(t.surface, 0.8)}, ${alpha(sumi, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(180deg, ${shuLit}, ${shu} 40%, ${shuDeep}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; left: -6px; top: -6px; right: -6px; bottom: 0; pointer-events: none; ${torii(22)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl'])} { background: linear-gradient(90deg, transparent, ${t.bg} 8% 92%, transparent) center 72% / 100% 20% no-repeat !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(shu, 0.2)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(shu, 0.45)}, ${alpha(shu, 0.12)}) !important; }

/* Deck constructor: lacquer panels with a vermilion lintel. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${lacquer}) !important; box-shadow: inset 0 3px 0 ${sumi}, inset 0 7px 0 ${shu}, inset 0 0 0 1px ${steelDim} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${torii(20)} }

/* Settings panels. */
${settingsPanels} { border-color: ${shu} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(t.surface, 0.85)}, ${alpha(sumi, 0.9)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; left: -8px; top: -6px; right: -8px; bottom: -2px; pointer-events: none; ${torii(20)} }

/* Titles: white with a vermilion edge. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${shuDeep}, 0 0 14px ${alpha(shu, 0.45)} !important; }

/* Text fields: black wells with a steel edge. */
${SEL.field} { background-color: ${sumi} !important; border-color: ${steelDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(steel, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${shu} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(shu, 0.6)} !important; }

/* Scrollbars: vermilion posts. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${shuDeep}, ${shu}, ${shuDeep}) !important; border-radius: 0 !important; }
`;
};
