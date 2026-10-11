// fullmetal-alchemist: an alchemist's kit. Blackened automail steel plates
// with brass rims and rivets, transmutation circles chalked on the metal,
// crimson coat cloth for the strong actions, and alchemy-blue light when a
// circle activates (hover, active phase). (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha, n1 }) => {
  const iron = mix(mix(t.raised, t.muted, 0.2), t.accent2, 0.05);
  const ironDark = mix(mix(t.surface, '#000000', 0.3), t.accent2, 0.03);
  const brass = mix(t.warning, t.text, 0.15);
  const brassDim = mix(t.warning, t.bg, 0.5);
  const chalk = mix(t.text, '#ffffff', 0.15);
  const blue = t.accent2;
  const crimson = t.accent;
  const crimsonDeep = mix(t.accent, '#000000', 0.5);

  // A transmutation circle in chalk: rings, a hexagram, a square, glyph ticks.
  const array = (size, color, op, sw = 1, n = 24) => {
    const c = size / 2;
    const R = c - sw;
    const pt = (r, a) => `${n1(c + r * Math.cos((a * Math.PI) / 180))} ${n1(c + r * Math.sin((a * Math.PI) / 180))}`;
    const tri = (a0) => `M${[0, 120, 240].map((a) => pt(R * 0.78, a + a0)).join('L')}Z`;
    const sq = `M${[45, 135, 225, 315].map((a) => pt(R * 0.55, a)).join('L')}Z`;
    let ticks = '';
    for (let i = 0; i < n; i++) ticks += `M${pt(R, (i * 360) / n)}L${pt(R * (i % 2 ? 0.92 : 0.86), (i * 360) / n)}`;
    return `<g fill="none" stroke="${color}" stroke-opacity="${op}" stroke-width="${sw}"><circle cx="${c}" cy="${c}" r="${R}"/><circle cx="${c}" cy="${c}" r="${n1(R * 0.84)}"/><circle cx="${c}" cy="${c}" r="${n1(R * 0.3)}"/><path d="${tri(-90)}${tri(90)}${sq}${ticks}"/></g>`;
  };

  // Brushed steel and a faint chalk circle for big panels.
  const watermark = svg(240, 240, array(240, chalk, 0.045, 1.4));
  const rivet = (x, y, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${brassDim}"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${n1(r * 0.55)}" fill="${brass}"/>`;
  // Nine-slice: brass rim, an inner steel line, a rivet in each corner.
  const frameSvg = svg(60, 60, `<rect x="0.8" y="0.8" width="58.4" height="58.4" rx="2" fill="none" stroke="${brass}" stroke-width="1.6"/><rect x="3.6" y="3.6" width="52.8" height="52.8" rx="1" fill="none" stroke="${ironDark}" stroke-width="1.6"/>${rivet(7.5, 7.5)}${rivet(52.5, 7.5)}${rivet(7.5, 52.5)}${rivet(52.5, 52.5)}`);
  const frame = (px = 14) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 14 / ${px}px stretch; box-sizing: border-box;`;

  // Brass medallion holding a small array: the crest on tiles and pop-ups.
  const medal = (s) => svg(s, s, `<circle cx="${s / 2}" cy="${s / 2}" r="${s / 2 - 1}" fill="${ironDark}" stroke="${brass}" stroke-width="2"/><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2 - 4}" fill="none" stroke="${brassDim}" stroke-width="1"/><g transform="translate(5 5)">${array(s - 10, chalk, 0.85, 1, 12)}</g>`);
  // Hex bolt: the cap of the life bars.
  const bolt = svg(20, 34, `<path d="M3 4H17V30H3Z" fill="${iron}" stroke="${brassDim}"/><path d="M10 9l5.2 3v6l-5.2 3-5.2-3v-6z" fill="${brass}" stroke="${brassDim}" stroke-width="0.8"/><circle cx="10" cy="15" r="2" fill="${ironDark}"/>${rivet(10, 26, 1.8)}`);
  // A small array laid over the phase discs.
  const phaseArray = svg(45, 45, array(45, chalk, 0.4, 0.9, 12));

  const label = `color: ${chalk} !important; text-shadow: 0 1px 0 #000000, 0 0 8px ${alpha('#000000', 0.9)} !important;`;
  const brushed = `repeating-linear-gradient(90deg, ${alpha(t.text, 0.022)} 0 1px, transparent 1px 3px)`;
  const plate = (lift = 0) => `linear-gradient(180deg, ${alpha('#ffffff', 0.06 + lift)}, transparent 40%), ${brushed}, linear-gradient(180deg, ${mix(iron, t.raised, 0.2)}, ${ironDark})`;

  // Pop-up buttons: crimson coat cloth (yes) and steel (no), both brass-rimmed and riveted.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="4" fill="url(#g)" stroke="${brass}" stroke-width="2.4"/><rect x="10" y="14" width="${bw - 8}" height="50.5" rx="2" fill="none" stroke="${brassDim}" stroke-width="1"/><g fill="${brass}"><circle cx="15" cy="19" r="2.4"/><circle cx="${w - 15}" cy="19" r="2.4"/><circle cx="15" cy="59.5" r="2.4"/><circle cx="${w - 15}" cy="59.5" r="2.4"/></g><text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.7)}) !important; }`).join('\n');
  const popPrimary = { top: mix(crimson, t.text, 0.08), bot: crimsonDeep, text: '#ffffff' };
  const popSecondary = { top: mix(iron, t.text, 0.08), bot: ironDark, text: chalk };

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const well = `${brushed}, linear-gradient(180deg, ${mix(t.surface, t.bg, 0.3)}, ${mix(t.bg, '#000000', 0.2)})`;

  const vars = [frameSvg, watermark, bolt, medal(60), phaseArray].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: riveted automail plates, a brass array medallion on top; the array lights blue on hover. */
${SEL.tile} { background: ${plate()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 14 / 13px stretch !important; box-shadow: inset 0 0 0 1px ${alpha('#000000', 0.6)}, inset 0 -12px 18px -10px #000000, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 15px); top: -13px; width: 30px; height: 30px; pointer-events: none; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${on(SEL.tileHover, 'before')} { filter: drop-shadow(0 0 5px ${blue}) drop-shadow(0 0 2px ${blue}); }
${SEL.tileHover} { background: radial-gradient(ellipse 60% 100% at 50% 100%, ${alpha(blue, 0.22)}, transparent 70%), ${plate(0.04)} !important; box-shadow: inset 0 0 0 1px ${alpha(blue, 0.7)}, inset 0 0 18px ${alpha(blue, 0.25)}, 0 0 18px -4px ${alpha(blue, 0.7)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: steel with a brass rim; crimson cloth when pressed. */
${SEL.button} { background: ${plate()} !important; border-color: ${brassDim} !important; color: ${chalk} !important; border-radius: 3px !important; box-shadow: inset 0 1px 0 ${alpha(brass, 0.35)}, inset 0 0 0 1px ${alpha('#000000', 0.5)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: radial-gradient(ellipse 80% 100% at 50% 100%, ${alpha(blue, 0.25)}, transparent 70%), ${plate(0.05)} !important; border-color: ${brass} !important; box-shadow: inset 0 1px 0 ${alpha(brass, 0.5)}, 0 0 10px -2px ${alpha(blue, 0.8)} !important; }
${SEL.buttonDown} { background: linear-gradient(180deg, ${crimsonDeep}, ${mix(crimson, '#000000', 0.65)}) !important; border-color: ${brass} !important; box-shadow: inset 0 2px 5px #000000 !important; }
${sel(['#content .button.disabled'])} { opacity: 0.55 !important; }

/* Pop-ups: a riveted plate with a chalked transmutation circle and a brass array medallion. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 50% at 50% 0%, ${alpha(brass, 0.1)}, transparent 70%), var(--dbtc-u1) right -40px bottom -60px / 220px no-repeat, ${brushed}, linear-gradient(180deg, ${mix(iron, t.surface, 0.5)}, ${mix(t.bg, '#000000', 0.2)}) !important; border-radius: 4px !important; box-shadow: 0 0 0 1px ${brassDim}, 0 0 0 4px ${ironDark}, 0 0 0 5px ${alpha(brass, 0.6)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(14)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 30px); top: -40px; right: auto; bottom: auto; width: 60px; height: 60px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 4px #000000) drop-shadow(0 0 6px ${alpha(blue, 0.5)}); }
${SEL.dialogTitle} { ${label} }

/* Chat: a crimson coat band with a brass seam; steel below. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.08)}, transparent 50%), linear-gradient(180deg, ${mix(crimson, t.bg, 0.25)}, ${crimsonDeep}) !important; box-shadow: inset 0 -2px 0 ${brass}, inset 0 -3px 0 ${ironDark}, inset 0 1px 0 ${alpha('#ffffff', 0.15)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: ${well} !important; box-shadow: inset 1px 0 0 ${brassDim}, inset -1px 0 0 ${brassDim}, inset 0 -1px 0 ${brassDim} !important; }

/* Duel: brass-rimmed life gauges capped with a hex bolt; phases chalked with arrays, lit when active. */
${SEL.life} { border-color: ${brass} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${ironDark}, 0 0 0 2px ${alpha(brass, 0.45)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 45%), ${brushed}, linear-gradient(90deg, ${mix(t.self, '#000000', 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 45%), ${brushed}, linear-gradient(90deg, ${mix(t.opp, '#000000', 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -3px; width: 20px; height: 36px; pointer-events: none; background: var(--dbtc-u2) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${chalk} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 200deg, ${brass}, ${brassDim}, ${mix(brass, '#ffffff', 0.3)}, ${brassDim}, ${brass}) !important; box-shadow: 0 0 0 1px ${ironDark}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${ironDark} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle at 40% 35%, ${mix(iron, t.text, 0.12)}, ${ironDark} 75%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.15)} 20%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(blue, 0.8)}, 0 0 4px ${blue}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.15)} 20%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(blue, 0.8)}, 0 0 4px ${blue}; }
${sel(['#duel .phase span'])} { color: ${chalk} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel .cout_txt'])} { background: ${well} !important; box-shadow: inset 0 0 0 1px ${brassDim}, inset 0 0 0 4px ${alpha(ironDark, 0.9)}, inset 0 0 0 5px ${alpha(brass, 0.35)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${brass}, 0 0 0 5px ${ironDark}, 0 0 0 6px ${alpha(brass, 0.5)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${brass}, ${brassDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(crimson, t.text, 0.08)}, ${crimsonDeep}) !important; }

/* Duel room: riveted brass frames around chalk-marked steel. */
${lobbyBorders} { background: ${well} !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${mix(brass, '#ffffff', 0.3)}, ${brassDim} 35%, ${brass} 60%, ${brassDim}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${ironDark} !important; box-shadow: 0 0 0 0.35em ${ironDark} !important; border-radius: 3px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(crimson, 0.2)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(blue, 0.32)}, ${alpha(blue, 0.08)}) !important; }

/* Deck constructor: steel wells in brass. */
${deckPanels} { background: ${well} !important; box-shadow: inset 0 0 0 1px ${brassDim}, inset 0 0 0 4px ${alpha(ironDark, 0.9)}, inset 0 0 0 5px ${alpha(brass, 0.35)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(14)} }

/* Settings panels: the same riveted frame. */
${settingsPanels} { border-color: ${brassDim} !important; background: ${well} !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* The bulletin: names in brass. */
${sel(['#content #statuses .username_txt'])} { color: ${t.link} !important; }

/* Titles: chalk white with a brass shadow. */
${titles} { color: ${chalk} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${brassDim}, 0 0 14px ${alpha(blue, 0.35)} !important; }

/* Text fields: dark steel wells with a brass lip, alchemy-blue focus. */
${SEL.field} { background-color: ${mix(t.bg, '#000000', 0.2)} !important; border-color: ${brassDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(brass, 0.25)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${blue} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(blue, 0.6)} !important; }

/* Scrollbars: brass rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${brassDim}, ${brass}, ${brassDim}) !important; border-radius: 2px !important; }

/* Pop-up buttons: crimson cloth and steel, brass-rimmed. */
${popCss(popPrimary, popSecondary)}
`;
};
