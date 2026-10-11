// master-duel: the 2022 Master Duel UI. Black-glass slabs in a gunmetal
// bevel with a folder-tab notch and a short bar top-right, the home menu's
// borderless rows with a lime tick, black pill buttons with a white rim that fill lime when
// chosen, LP plates with a coloured top stripe, gold-ringed turn orbs, and
// rarity glows (UR violet-gold) round the avatars.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const lime = t.accent;
  const limeText = t.accentText;
  const gun = t.border;
  const gunHi = mix(gun, '#ffffff', 0.45);
  const glass = mix(t.surface, t.bg, 0.35);
  const glassHi = mix(t.surface, t.raised, 0.6);
  const gold = t.warning;
  const ur = t.accent2;
  const ink = mix(t.bg, '#000000', 0.6);
  const gunEdge = mix(gun, t.text, 0.3);

  // Fine horizontal scanlines over every slab (the MD screen texture).
  const scan = svg(4, 4, `<path d="M0 .5H4" stroke="#ffffff" stroke-opacity="0.035"/>`);
  // Folder-tab notch: the hairline steps up at the top-right and carries a short bar.
  const notch = svg(120, 16, `<path d="M0 15H66L80 3H120" fill="none" stroke="${gunHi}" stroke-width="1.6"/><rect x="92" y="6" width="22" height="4" fill="${gunHi}"/>`);
  // Title plate: a black-glass bar slashed at both ends, gunmetal rim, lime ticks.
  const plate = svg(440, 60, `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${glassHi}"/><stop offset="1" stop-color="${ink}"/></linearGradient></defs><path d="M22 3H438L418 57H2Z" fill="url(#g)" stroke="${gun}" stroke-width="1.6"/><path d="M24 7H432" stroke="#ffffff" stroke-opacity="0.18"/><path d="M14 16L8 32" stroke="${lime}" stroke-width="5"/><path d="M426 28L420 44" stroke="${lime}" stroke-width="5"/><path d="M60 57H380" stroke="${gunHi}" stroke-width="1.2"/>`);
  // LP label in MD's small caps beside the digits.
  const lp = svg(36, 22, `<text x="34" y="17" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="15" fill="${t.text}" stroke="${ink}" stroke-width="2" paint-order="stroke">LP</text>`);

  // Pop-up buttons: lime-filled primary with black text, black pill with a white rim for No/Cancel.
  const popBtn = (label, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${primary ? mix(lime, '#ffffff', 0.25) : glassHi}"/><stop offset="1" stop-color="${primary ? mix(lime, ink, 0.12) : ink}"/></linearGradient></defs><rect x="6" y="11" width="${w - 12}" height="56" rx="10" fill="url(#f)" stroke="${primary ? mix(lime, '#ffffff', 0.5) : t.text}" stroke-width="2.2"/><text x="${w / 2}" y="39" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="25" fill="${primary ? limeText : t.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = [['ok_btn', 'OK', true, false], ['yes_btn', 'Yes', true, false], ['no_btn', 'No', false, false], ['cancel_btn', 'Cancel', false, true]]
    .map(([nm, label, p, wide]) => `${popImg(nm)} { content: ${svgUrl(popBtn(label, wide, p))} !important; filter: drop-shadow(0 0 ${p ? 8 : 0}px ${alpha(lime, 0.45)}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1']);
  const subTitles = sel(['#content .arial_black2:not(.title1)', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const slab = (lift = 0) => `var(--dbtc-s), linear-gradient(180deg, ${alpha(mix(glassHi, '#ffffff', lift), 0.94)}, ${alpha(ink, 0.96)})`;
  const bevel = `inset 0 1px 0 ${alpha('#ffffff', 0.22)}, inset 0 0 0 1px ${alpha(ink, 0.8)}`;
  const urRing = `conic-gradient(from 210deg, ${ur}, ${gold}, ${mix(gold, '#ffffff', 0.6)}, ${ur}, ${mix(ur, t.self, 0.5)}, ${ur})`;

  return `
html body { --dbtc-s: ${svgUrl(scan)}; --dbtc-notch: ${svgUrl(notch)}; --dbtc-plate: ${svgUrl(plate)}; --dbtc-lp: ${svgUrl(lp)}; }
/* Menu tiles: the home menu's borderless rows on a fading glass band, a lime tick; hover underlines in lime. */
${SEL.tile} { background: linear-gradient(90deg, ${lime} 0 3px, transparent 3px), var(--dbtc-s), linear-gradient(90deg, ${alpha(ink, 0.88)}, ${alpha(glass, 0.6)} 65%, ${alpha(glass, 0.12)}) !important; border-color: transparent !important; background-origin: border-box !important; border-radius: 0 !important; box-shadow: inset 0 -1px 0 ${alpha(gunHi, 0.4)} !important; }
${SEL.tileHover} { background: linear-gradient(90deg, ${lime} 0 6px, transparent 6px), linear-gradient(90deg, ${alpha(lime, 0.22)}, transparent 70%), var(--dbtc-s), linear-gradient(90deg, ${alpha(ink, 0.9)}, ${alpha(glassHi, 0.7)} 65%, ${alpha(glass, 0.2)}) !important; border-color: transparent !important; background-origin: border-box !important; box-shadow: inset 0 -2px 0 ${lime}, 0 6px 18px -8px ${alpha(lime, 0.6)} !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 1px 2px ${ink} !important; }

/* Buttons: black pills with a white rim; the chosen one fills lime with black text. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: linear-gradient(180deg, ${glassHi}, ${ink}) !important; border-color: ${mix(t.text, gun, 0.3)} !important; color: ${t.text} !important; border-radius: 8px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.18)} !important; text-shadow: none !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(lime, '#ffffff', 0.2)}, ${lime}) !important; border-color: ${mix(lime, '#ffffff', 0.5)} !important; color: ${limeText} !important; box-shadow: 0 0 10px ${alpha(lime, 0.5)} !important; }
${SEL.buttonDown} { background: ${mix(lime, ink, 0.3)} !important; border-color: ${lime} !important; color: ${limeText} !important; box-shadow: inset 0 2px 4px ${alpha(ink, 0.6)} !important; }
${SEL.submit} { background: linear-gradient(180deg, ${glassHi}, ${ink}) !important; border-color: ${mix(t.text, gun, 0.3)} !important; color: ${t.text} !important; }

/* Page titles: white on a slashed black-glass plate with lime ticks. */
${titles} { color: ${t.text} !important; text-shadow: 0 1px 2px ${ink} !important; isolation: isolate; }
${on(titles, 'before')} { content: ""; position: absolute; left: calc(50% - 230px); top: 6%; width: 460px; height: 90%; z-index: -1; pointer-events: none; background: var(--dbtc-plate) center / 100% 100% no-repeat; filter: drop-shadow(0 6px 10px ${ink}); }
${subTitles} { color: ${t.text} !important; text-shadow: 0 0 3px ${ink}, 0 1px 2px ${ink} !important; }

/* Pop-ups: a black-glass slab, gunmetal rim, lime corner ticks. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 40% at 50% 0%, ${alpha(ur, 0.18)}, transparent 70%), ${slab()} !important; border-radius: 6px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 2px ${gun}, inset 0 1px 0 ${alpha('#ffffff', 0.2)}, 0 0 40px -8px ${alpha(ur, 0.5)}, 0 26px 60px -12px ${ink} !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 14px; right: 14px; top: 8px; bottom: auto; width: auto; height: 2px; pointer-events: none; z-index: 0; background: linear-gradient(90deg, ${lime} 0 60px, ${gun} 60px) !important; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: -3px; top: -3px; right: -3px; bottom: -3px; width: auto; height: auto; pointer-events: none; z-index: 1; background: linear-gradient(${lime}, ${lime}) left top / 34px 3px no-repeat, linear-gradient(${lime}, ${lime}) left top / 3px 34px no-repeat, linear-gradient(${lime}, ${lime}) right bottom / 34px 3px no-repeat, linear-gradient(${lime}, ${lime}) right bottom / 3px 34px no-repeat; transform: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: none !important; }

/* Chat: slab body; header a gunmetal bar with the lime tick. */
${SEL.chatTop} { background: linear-gradient(90deg, ${lime} 0 4px, transparent 4px), linear-gradient(180deg, ${mix(glassHi, '#ffffff', 0.06)}, ${ink}) !important; box-shadow: inset 0 -1px 0 ${gunHi}, inset 0 1px 0 ${alpha('#ffffff', 0.15)} !important; }
${SEL.chat} { background: ${slab()} !important; box-shadow: inset 0 0 0 1px ${gunEdge}, inset 0 2px 0 ${alpha(lime, 0.6)} !important; }

/* Duel: LP plates with a coloured top stripe; phases as gold-ringed orbs. */
${SEL.life} { border-color: ${gunEdge} !important; border-radius: 0 !important; clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%); box-shadow: 0 0 0 1px ${ink}, 0 6px 14px -4px ${ink} !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${t.self} 0 4px, ${alpha('#ffffff', 0.1)} 4px, transparent 40%), linear-gradient(90deg, ${mix(t.self, ink, 0.82)}, ${mix(t.self, ink, 0.62)}) !important; clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%); border-radius: 0 !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${t.opp} 0 4px, ${alpha('#ffffff', 0.1)} 4px, transparent 40%), linear-gradient(90deg, ${mix(t.opp, ink, 0.82)}, ${mix(t.opp, ink, 0.62)}) !important; clip-path: polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%); border-radius: 0 !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: ${ink} !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -38px; top: calc(50% - 11px); width: 36px; height: 22px; pointer-events: none; background: var(--dbtc-lp) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 3px ${ink} !important; }
${SEL.phase} { background: conic-gradient(from 200deg, ${mix(gold, '#ffffff', 0.5)}, ${gold}, ${mix(gold, ink, 0.45)}, ${gold}, ${mix(gold, '#ffffff', 0.5)}) !important; border-radius: 50% !important; box-shadow: 0 0 0 1px ${ink}, 0 4px 10px -2px ${ink} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.self, t.bg, 0.5)}, ${ink}) !important; border-radius: 50% !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle at 50% 28%, ${alpha('#ffffff', 0.22)}, transparent 40%), radial-gradient(circle at 50% 50%, ${mix(t.self, t.bg, 0.55)}, ${mix(t.self, ink, 0.8)}) !important; border-radius: 50% !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 28%, ${alpha('#ffffff', 0.4)}, transparent 45%), radial-gradient(circle, ${mix(t.self, '#ffffff', 0.1)}, ${mix(t.self, ink, 0.4)}) !important; box-shadow: 0 0 16px ${alpha(gold, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 28%, ${alpha('#ffffff', 0.4)}, transparent 45%), radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.1)}, ${mix(t.opp, ink, 0.4)}) !important; box-shadow: 0 0 16px ${alpha(gold, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${ink} !important; }
${sel(['#duel #turn .red', '#duel #start_turn .red', '#duel #end_turn .red'])} { background: linear-gradient(180deg, ${t.opp} 0 3px, ${mix(t.opp, ink, 0.55)} 3px) !important; }
${sel(['#duel #turn .blue', '#duel #start_turn .blue', '#duel #end_turn .blue'])} { background: linear-gradient(180deg, ${t.self} 0 3px, ${mix(t.self, ink, 0.55)} 3px) !important; }
${sel(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${ink} !important; }
${SEL.duelLog} { background: ${slab()} !important; border-color: ${gun} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { border-radius: 3px !important; box-shadow: 0 0 0 2px ${ink}, 0 0 0 4px ${gold}, 0 0 16px 2px ${alpha(ur, 0.65)} !important; }

/* Duel room: slab panels; titles keep a dark plate so the rim never runs through them. */
${lobbyBorders} { background: ${slab()} !important; box-shadow: 0 10px 26px -12px ${ink}; }
${on(lobbyBorders, 'before')} { background: linear-gradient(180deg, ${gunHi}, ${gunEdge} 30%, ${gun}) !important; filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 60%, ${ink} 60% 86%, transparent 86%) center / 78% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl'])} { background: linear-gradient(90deg, transparent, ${ink} 8% 92%, transparent) 0 72% / 100% 24% no-repeat !important; box-shadow: none !important; border-radius: 0 !important; }
${sel(['#content #settings_content .admin_lbl'])} { background: linear-gradient(90deg, transparent, ${ink} 8% 92%, transparent) 0 42% / 100% 24% no-repeat !important; box-shadow: none !important; border-radius: 0 !important; }
${sel(['#duel_room .duelbutton .background'])} { background: var(--dbtc-s), linear-gradient(180deg, ${glassHi}, ${glass}) !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${lime} 0 4px, ${alpha(lime, 0.18)} 4px, transparent 70%), ${glassHi} !important; }
${sel(['#duel_room #yu', '#duel_room .border'])} { filter: none !important; }

/* Deck constructor: slab panels in gunmetal. */
${deckPanels} { background: ${slab()} !important; box-shadow: inset 0 0 0 1px ${gunEdge}, inset 0 1px 0 1px ${alpha('#ffffff', 0.12)} !important; }

/* Settings sections: slabs with the folder-tab notch. */
${on(SEL.settingsPanel, 'after')} { content: ""; position: absolute; right: 8px; top: 6px; width: 96px; height: 13px; pointer-events: none; background: var(--dbtc-notch) right top / contain no-repeat; }
${SEL.settingsPanel} { border-color: ${gunEdge} !important; background: ${slab()} !important; border-radius: 4px !important; box-shadow: ${bevel} !important; }

/* Text fields: black wells, gunmetal rim, lime focus. */
${SEL.field} { background-color: ${ink} !important; border-color: ${gunHi} !important; border-radius: 4px !important; box-shadow: inset 0 1px 3px ${alpha('#000000', 0.6)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${lime} !important; box-shadow: 0 0 8px ${alpha(lime, 0.45)} !important; }

/* Scrollbars: thin gunmetal rods. */
${sel(['#content .os-scrollbar-handle'])} { background: ${gunHi} !important; border-radius: 2px !important; }
${sel(['#content .os-scrollbar-handle:hover'])} { background: ${lime} !important; }

${popCss}
`;
};
