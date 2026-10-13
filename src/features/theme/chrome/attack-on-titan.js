// attack-on-titan: the Survey Corps kit. Riveted ODM-gear steel plates, harness
// leather straps with stitching, Survey Corps green cloth for the primary
// actions, Wall stone in the pop-ups, life bars cut like ODM blades with
// their snap-off scores, gas-canister caps for the phases and a crest of one
// ODM blade laid over a stretch of crenellated wall. (t, kit) -> CSS string; see chrome/kit.js.
import { deepForWhite, mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const steel = mix(t.text, t.muted, 0.45);
  const steelDim = mix(t.muted, t.border, 0.45);
  const plate = mix(t.raised, t.muted, 0.12);
  const plateDeep = mix(t.surface, t.bg, 0.5);
  const leather = mix(t.warning, t.bg, 0.62);
  const leatherHi = mix(t.warning, t.bg, 0.4);
  const cloth = mix(t.accent, t.bg, 0.55);
  const clothDeep = mix(t.accent, t.bg, 0.74);
  const stone = mix(t.surface, t.muted, 0.1);

  // Brushed steel grain and coursed wall stone, faint.
  const grain = svg(60, 6, `<path d="M0 1.5H60M0 4.5H60" stroke="${t.text}" stroke-opacity="0.035"/>`);
  const masonry = svg(96, 48, `<g fill="none" stroke="${t.text}" stroke-opacity="0.06"><path d="M0 .5H96M0 24.5H96M32 .5V24.5M80 .5V24.5M8 24.5V48M56 24.5V48"/></g>`);

  // Nine-slice steel frame: a double hairline with a rivet in each corner.
  const rivet = (x, y) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${plateDeep}" stroke="${steel}" stroke-width="1.2"/><circle cx="${x - 0.8}" cy="${y - 0.8}" r="1.1" fill="#ffffff" fill-opacity="0.55"/>`;
  const frameSvg = svg(60, 60, `<g fill="none"><rect x="1" y="1" width="58" height="58" stroke="${steel}" stroke-width="2"/><rect x="4.5" y="4.5" width="51" height="51" stroke="${steelDim}" stroke-width="0.8"/></g>${rivet(9, 9)}${rivet(51, 9)}${rivet(9, 51)}${rivet(51, 51)}`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Crest: a single ODM blade laid over a stretch of crenellated wall (our own device).
  const blade = `<g transform="translate(0 -20)"><path d="M18 30H128L146 34L128 38H18Z" fill="${steel}" stroke="${t.bg}" stroke-width="1"/><path d="M18 30.2H128L146 34" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="0.9"/><path d="M42 30.2L37 37.8M66 30.2L61 37.8M90 30.2L85 37.8M114 30.2L109 37.8" stroke="${t.bg}" stroke-opacity="0.7" stroke-width="1"/><path d="M4 29.5H18V38.5H4Z" fill="${leather}" stroke="${t.bg}" stroke-width="1"/><path d="M8 29.5V38.5M12 29.5V38.5" stroke="${leatherHi}" stroke-width="0.8"/></g>`;
  const rampart = `<path d="M18 58V34H140V58Z" fill="${stone}" stroke="${steel}" stroke-width="1.6"/><path d="M18 46H140M44 34V46M84 34V46M122 34V46M30 46V58M66 46V58M104 46V58" stroke="${t.bg}" stroke-opacity="0.5" stroke-width="0.8"/><g fill="${stone}" stroke="${steel}" stroke-width="1.2">${[18, 33, 48, 63, 78, 93, 108, 123].map((x) => `<path d="M${x} 34.6V26H${x + 9}V34.6"/>`).join('')}</g><path d="M19 35H139" stroke="${stone}" stroke-width="1.4"/><path d="M18 55H140" stroke="${t.accent}" stroke-width="2"/>`;
  const crest = svg(160, 64, `${rampart}${blade}`);
  // Small badge for menu tiles: an ODM gas canister strapped in leather.
  const badge = svg(30, 34, `<rect x="12" y="1.5" width="6" height="5" rx="1" fill="${steel}" stroke="${t.bg}" stroke-width="0.8"/><rect x="7.5" y="6" width="15" height="26.5" rx="7" fill="${plateDeep}" stroke="${steel}" stroke-width="1.6"/><path d="M11 10V28" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.4" stroke-linecap="round"/><path d="M5.5 13.5H24.5M5.5 24.5H24.5" stroke="${leatherHi}" stroke-width="3"/><path d="M5.5 13.5H24.5M5.5 24.5H24.5" stroke="${leather}" stroke-width="0.8" stroke-dasharray="2 1.5"/><path d="M9 19H21" stroke="${t.accent}" stroke-width="1.4"/>`);

  // Leather strap with stitching and a steel buckle (chat headers).
  const strap = svg(80, 12, `<rect y="1" width="80" height="10" fill="${leather}"/><path d="M0 2.8H80M0 9.2H80" stroke="${leatherHi}" stroke-width="0.8" stroke-dasharray="3 2"/>`);
  const buckle = svg(26, 22, `<rect x="2" y="2" width="22" height="18" rx="2" fill="none" stroke="${steel}" stroke-width="3"/><path d="M13 3V19" stroke="${steel}" stroke-width="2.4"/><rect x="2" y="2" width="22" height="18" rx="2" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="0.8"/>`);
  // A gas canister seen end-on: phase discs.
  let teeth = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    teeth += `<circle cx="${(22.5 + Math.cos(a) * 18.5).toFixed(2)}" cy="${(22.5 + Math.sin(a) * 18.5).toFixed(2)}" r="1.3"/>`;
  }
  const cap = svg(45, 45, `<circle cx="22.5" cy="22.5" r="21" fill="none" stroke="${steel}" stroke-opacity="0.55" stroke-width="1.6"/><g fill="${steel}" fill-opacity="0.6">${teeth}</g>`);
  // ODM blade end cap for the life bar.
  const hilt = svg(18, 34, `<path d="M4 2H14V32H4Z" fill="${leather}" stroke="${t.bg}" stroke-width="1"/><path d="M4 8H14M4 14H14M4 20H14M4 26H14" stroke="${leatherHi}" stroke-width="1"/><path d="M1 2H17V6H1ZM1 28H17V32H1Z" fill="${steel}"/>`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 8px ${t.bg} !important;`;
  const steelBg = (lift = 0) => `linear-gradient(180deg, ${alpha('#ffffff', 0.08 + lift)}, transparent 40%), var(--dbtc-u2), linear-gradient(180deg, ${plate}, ${mix(plate, t.bg, 0.55)})`;
  // ODM blade snap-off scores: short notches along the bar's top edge only,
  // so a healthy blade never reads like the low state's full-height hatch.
  const scores = `repeating-linear-gradient(98deg, transparent 0 46px, ${alpha(t.bg, 0.45)} 46px 47.5px, ${alpha('#ffffff', 0.2)} 47.5px 48.5px) 0 0 / 100% 34% no-repeat`;
  // The lit gas canister: hot copper, deep enough for a white label.
  const copper = deepForWhite(mix(t.accent2, '#b0561c', 0.4), '#4a1c06', 4.5, 0);

  // Pop-up buttons (DuelingBook's OK/Yes/No/Cancel <img>s): riveted plates.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    const rv = (x, y) => `<circle cx="${x}" cy="${y}" r="3" fill="${c.bot}" stroke="${steel}" stroke-width="1.2"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="M6 10H${6 + bw - 10}L${6 + bw} 20V68.5H16L6 58.5Z" fill="url(#g)" stroke="${steel}" stroke-width="2.5"/><path d="M11 15H${bw - 6}" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1.5"/>${rv(14, 18)}${rv(w - 18, 61)}<text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.6)}) !important; }`).join('\n');
  const popPrimary = { top: mix(t.accent, t.bg, 0.45), bot: clothDeep, text: '#ffffff' };
  const popSecondary = { top: plate, bot: plateDeep, text: t.text };

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [frameSvg, badge, grain, crest, strap, buckle, cap, hilt, masonry].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: riveted steel plates, a green cloth strip on the left edge, a gas-canister badge on top. */
${SEL.tile} { background: linear-gradient(90deg, ${cloth} 0 6px, ${alpha(t.bg, 0.8)} 6px 7px, transparent 7px), ${steelBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 14px stretch !important; box-shadow: inset 0 -8px 14px -8px ${alpha('#000000', 0.6)}, 0 10px 20px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 13px); top: -14px; width: 26px; height: 30px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: linear-gradient(90deg, ${t.accent} 0 6px, ${alpha(t.bg, 0.8)} 6px 7px, transparent 7px), linear-gradient(90deg, ${alpha(t.accent, 0.22)}, transparent 70%), ${steelBg(0.05)} !important; box-shadow: inset 0 0 0 1px ${alpha(t.accent, 0.6)}, 0 0 16px -4px ${alpha(t.accent, 0.6)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: blade steel with a bevel; hover takes the cloak green. */
${SEL.button} { background: linear-gradient(180deg, ${mix(plate, t.text, 0.14)}, ${mix(plate, t.bg, 0.45)}) !important; border-color: ${steelDim} !important; color: ${t.text} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.2)}, inset 0 -1px 0 ${alpha('#000000', 0.5)}, 0 2px 4px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(t.accent, t.bg, 0.4)}, ${clothDeep}) !important; border-color: ${t.accent} !important; color: #ffffff !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.25)}, 0 0 10px -2px ${alpha(t.accent, 0.7)} !important; }
${SEL.buttonDown} { background: ${plateDeep} !important; border-color: ${t.accent} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a block of Wall stone in a riveted steel frame, the blade-and-wall crest on top. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(t.accent2, 0.1)}, transparent 70%), var(--dbtc-u8), linear-gradient(180deg, ${stone}, ${mix(stone, t.bg, 0.6)}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${steelDim}, 0 0 0 4px ${plateDeep}, 0 0 0 5px ${alpha(steel, 0.55)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(18)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 80px); top: -44px; right: auto; bottom: auto; width: 160px; height: 64px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 3px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a harness strap header with a buckle; the window framed in steel. */
${SEL.chatTop} { background: var(--dbtc-u4) 0 50% / 80px 12px repeat-x, linear-gradient(180deg, ${mix(plate, t.text, 0.08)}, ${plateDeep}) !important; box-shadow: inset 0 -2px 0 ${steelDim}, inset 0 1px 0 ${alpha('#ffffff', 0.15)} !important; }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; right: 64px; top: 4px; width: 24px; height: 20px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; }
${sel(['#chats .chat .chat_top span'])} { ${label} }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${steelDim}, inset -1px 0 0 ${steelDim}, inset 0 -1px 0 ${steelDim} !important; }

/* Duel: life bars cut like ODM blades with snap-off scores and a leather grip; gas-canister phases. */
${SEL.life} { border-color: ${steel} !important; border-radius: 1px !important; box-shadow: 0 0 0 1px ${plateDeep}, 0 0 0 2px ${alpha(steel, 0.4)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 45%, ${alpha('#000000', 0.25)}), ${scores}, linear-gradient(90deg, ${mix(t.self, '#1c3a16', 0.4)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 45%, ${alpha('#000000', 0.25)}), ${scores}, linear-gradient(90deg, #c8963a, #e0b45a) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -16px; top: -3px; width: 18px; height: 34px; pointer-events: none; background: var(--dbtc-u7) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 210deg, ${steel}, ${steelDim}, ${t.text}, ${steelDim}, ${steel}) !important; box-shadow: 0 0 0 1px ${plateDeep}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${plateDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(plate, t.text, 0.08)} 30%, ${plateDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(copper, t.accent2, 0.15)} 15%, ${copper} 55%, ${mix(copper, t.bg, 0.35)}) !important; box-shadow: 0 0 0 2px ${t.accent2}, 0 0 22px 5px ${alpha(t.accent2, 0.85)}; }
${sel(['#duel .phase.active .background'])} { background: conic-gradient(from 210deg, ${t.accent2}, ${mix(t.accent2, t.bg, 0.5)}, ${mix(t.accent2, '#ffffff', 0.3)}, ${mix(t.accent2, t.bg, 0.5)}, ${t.accent2}) !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 5px ${alpha('#000000', 0.7)} !important; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(t.surface, plate, 0.3)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${steelDim}, inset 0 0 0 4px ${alpha(plateDeep, 0.9)}, inset 0 0 0 5px ${alpha(steel, 0.3)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${steel}, 0 0 0 4px ${plateDeep}, 0 0 0 5px ${alpha(steel, 0.45)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${steel}, ${steelDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(t.accent, t.bg, 0.45)}, ${clothDeep}) !important; }

${sel(['#duel #turn .red', '#duel #start_turn .red', '#duel #end_turn .red'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 50%), linear-gradient(180deg, ${mix(t.self, t.bg, 0.15)}, ${mix(t.self, t.bg, 0.55)}) !important; }
${sel(['#duel #turn .blue', '#duel #start_turn .blue', '#duel #end_turn .blue'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 50%), linear-gradient(180deg, ${mix(t.opp, t.bg, 0.15)}, ${mix(t.opp, t.bg, 0.55)}) !important; }
${sel(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }

/* Duel room: riveted steel rings around plate-dark panels; labels on a plate. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(plate, 0.6)}, ${alpha(t.bg, 0.8)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${t.text}, ${steelDim} 30%, ${steel} 55%, ${steelDim} 80%, ${t.text}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${plateDeep} !important; box-shadow: 0 0 0 0.35em ${plateDeep} !important; border-radius: 1px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(t.accent, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(t.accent, 0.4)}, ${alpha(t.accent, 0.12)}) !important; }

/* Deck constructor: steel-plated panels. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(plate, t.surface, 0.5)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${steelDim}, inset 0 0 0 4px ${alpha(plateDeep, 0.9)}, inset 0 0 0 5px ${alpha(steel, 0.3)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels: the same riveted frame over wall stone. */
${settingsPanels} { border-color: ${steelDim} !important; background: var(--dbtc-u4) 0 0 / 80px 12px repeat-x, var(--dbtc-u4) 0 100% / 80px 12px repeat-x, var(--dbtc-u8), linear-gradient(180deg, ${alpha(stone, 0.85)}, ${alpha(t.bg, 0.9)}) !important; box-shadow: inset 0 0 0 1px ${leather}, inset 0 0 0 4px ${alpha(plateDeep, 0.85)}, inset 0 0 0 5px ${alpha(t.accent, 0.5)}, 0 10px 24px -12px #000000 !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: stamped steel lettering. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${plateDeep}, 0 0 14px ${alpha(t.accent, 0.35)} !important; }

/* Text fields: dark wells with a steel lip, green focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${steelDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(steel, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${t.accent} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(t.accent, 0.6)} !important; }

/* Scrollbars: steel rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${steelDim}, ${steel}, ${steelDim}) !important; border-radius: 1px !important; }

/* Pop-up buttons: riveted plates; OK and Yes in Survey Corps green. */
${popCss(popPrimary, popSecondary)}

/* Scene: the titan hand stays off the menu feed and the front page. */
html body:is(:has(#main_menu:not([style*="none"])), :has(#welcome_buttons:not([style*="none"]))) #dbte-skin-fx .dbtefx-aot-hand { display: none; }
`;
};
