// forbidden-memories: the PlayStation game's interface. Panels are black
// plates set in a band of carved sandstone (hieroglyph relief, gold studs at
// the corners), pop-ups hang under the winged sun-disk plate, buttons and
// life points are the small navy (COM) and red (YOU) boxes with a thin white
// rim, phases are navy chips that turn gold, and the hovered menu tile gets
// the yellow pyramid cursor. Surfaces carry a faint PS1 ordered dither.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const gold = t.accent;
  const goldLo = mix(gold, t.bg, 0.5);
  const stone = mix(t.border, t.bg, 0.35);
  const stoneHi = mix(t.border, t.text, 0.25);
  const stoneLo = mix(t.border, t.bg, 0.7);
  const plate = mix(t.bg, '#000000', 0.3);
  const navy = mix(t.opp, t.bg, 0.45);
  const navyDeep = mix(t.opp, t.bg, 0.68);
  const red = mix(t.self, t.bg, 0.3);
  const rim = mix(t.text, '#ffffff', 0.5);
  // Both LP boxes share one crisp sheen: a white hairline under the rim over a soft gloss.
  const sheen = `linear-gradient(180deg, transparent 2px, ${alpha('#ffffff', 0.55)} 2px 3px, ${alpha('#ffffff', 0.2)} 3px, transparent 50%)`;

  // PS1 4x4 ordered dither.
  const bay = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const dither = svg(8, 8, bay.map((b, k) => `<rect x="${(k % 4) * 2}" y="${Math.floor(k / 4) * 2}" width="2" height="2" fill="#000000" fill-opacity="${Math.round((b / 16) * 22) / 100}"/>`).join(''));

  // Hieroglyphs carved in relief (12 tall): ankh, djed pillar, water, reed.
  const glyphs = {
    ankh: 'M6 1.2a2.6 3 0 1 0 0.01 0M6 7.2V12M2.4 8H9.6',
    djed: 'M6 1V12M3 3H9M3 5.4H9M3 7.8H9M2 12H10',
    water: 'M0 4.5l2-2 2 2 2-2 2 2 2-2 2 2M0 9.5l2-2 2 2 2-2 2 2 2-2 2 2',
    reed: 'M6 12V4.5Q6 1 9 1.2Q7.5 3 7.5 5.5M6 7Q4 6 3.5 4',
  };
  const carve = (d, x, y) => `<g transform="translate(${x} ${y})" fill="none" stroke-linecap="round" stroke-width="1.5"><path d="${d}" stroke="${mix(stoneHi, '#ffffff', 0.25)}" stroke-opacity="0.6" transform="translate(0.7 0.7)"/><path d="${d}" stroke="${stoneLo}"/></g>`;
  // Carved sandstone band segment (48 x 24): a recessed cartouche holding two glyphs.
  const band = (a, b) => `<rect width="48" height="24" fill="${stone}"/><rect width="48" height="2" fill="${stoneHi}"/><rect y="22" width="48" height="2" fill="${stoneLo}"/><rect x="3" y="4" width="42" height="16" rx="3" fill="${mix(stone, t.bg, 0.22)}" stroke="${stoneLo}" stroke-width="1"/><path d="M4 19.5H44" stroke="${stoneHi}" stroke-opacity="0.5"/>${carve(glyphs[a], 8, 6)}${carve(glyphs[b], 27, 6)}`;
  const corner = (x, y) => `<g transform="translate(${x} ${y})"><rect width="24" height="24" fill="${stoneLo}"/><rect x="3" y="3" width="18" height="18" fill="${gold}"/><polygon points="3,3 21,3 17,7 7,7" fill="${mix(gold, '#ffffff', 0.45)}"/><polygon points="21,21 3,21 7,17 17,17" fill="${goldLo}"/><rect x="7" y="7" width="10" height="10" fill="${mix(gold, t.bg, 0.25)}"/></g>`;
  const frameSvg = svg(96, 96, `<g transform="translate(24 0)">${band('ankh', 'water')}</g><g transform="translate(24 72)">${band('water', 'ankh')}</g><g transform="translate(24 24) rotate(90) translate(0 0)">${band('djed', 'reed')}</g><g transform="translate(96 24) rotate(90)">${band('reed', 'djed')}</g>${corner(0, 0)}${corner(72, 0)}${corner(0, 72)}${corner(72, 72)}<rect x="24.5" y="24.5" width="47" height="47" fill="none" stroke="${gold}" stroke-width="1"/>`);
  const frame = (px = 12) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 24 / ${px}px round; box-sizing: border-box;`;

  // Winged sun disk over a dark plate: the game's location banner.
  const feathers = (dir) => {
    let f = '';
    for (let r = 0; r < 4; r++) {
      const y = 22 + r * 7;
      const len = 72 - r * 13;
      const x = 80 + dir * 34;
      f += `<polygon points="${x},${y} ${x + dir * len},${y - 9 + r * 2.5} ${x + dir * (len - 8)},${y + 5} ${x},${y + 6}" fill="${r % 2 ? goldLo : gold}"/>`;
    }
    return f;
  };
  const sunDisk = svg(160, 56, `${feathers(-1)}${feathers(1)}<rect x="46" y="20" width="68" height="28" fill="${plate}" stroke="${gold}" stroke-width="3"/><rect x="51" y="25" width="58" height="18" fill="none" stroke="${goldLo}" stroke-width="1"/><circle cx="80" cy="14" r="10" fill="${t.self}" stroke="${gold}" stroke-width="3"/>`);
  // Yellow pyramid cursor pointing right (flat-shaded).
  const cursor = svg(22, 26, `<polygon points="1,1 21,13 1,25" fill="${t.warning}"/><polygon points="1,13 21,13 1,25" fill="${mix(t.warning, t.bg, 0.4)}"/><polygon points="1,1 6,4 6,22 1,25" fill="${mix(t.warning, '#ffffff', 0.45)}"/>`);
  // LP tag: white letters on navy.
  // YOU / COM tags beside the LP boxes, as in the duel screen's corner.
  const tag = (text, fill) => svg(38, 20, `<rect x="0.75" y="0.75" width="36.5" height="18.5" rx="4" fill="${fill}" stroke="${rim}" stroke-width="1.5"/><text x="19" y="14.6" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="12.5" fill="#ffffff">${text}</text>`);

  const dith = 'var(--dbtc-u1)';
  const label = `color: ${t.text} !important; text-shadow: 2px 2px 0 #000000 !important;`;
  const chip = (bg, hi = 0.18) => `background: linear-gradient(180deg, ${alpha('#ffffff', hi)}, transparent 55%), ${bg} !important; border: 1px solid ${rim} !important; border-radius: 4px !important; box-shadow: 0 0 0 1px #000000, 2px 3px 0 ${alpha('#000000', 0.6)} !important;`;

  // Pop-up buttons: navy (OK/Yes) and red (No/Cancel) boxes with a white rim.
  const popBtn = (text, wide, fill) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect x="7" y="11" width="${w - 14}" height="56" rx="8" fill="#000000"/><rect x="9" y="13" width="${w - 18}" height="52" rx="7" fill="${fill}" stroke="${rim}" stroke-width="2.5"/><rect x="13" y="16" width="${w - 26}" height="16" rx="5" fill="#ffffff" fill-opacity="0.16"/><text x="${w / 2 + 1.5}" y="42.5" dominant-baseline="central" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="26" letter-spacing="2" fill="#000000">${text}</text><text x="${w / 2}" y="41" dominant-baseline="central" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="26" letter-spacing="2" fill="${fill === navy ? gold : '#ffffff'}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = [['ok_btn', 'OK', navy, false], ['yes_btn', 'YES', navy, false], ['no_btn', 'NO', red, false], ['cancel_btn', 'CANCEL', red, true]]
    .map(([n, text, fill, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, fill))} !important; filter: none !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const platePanel = `background: ${dith}, linear-gradient(180deg, ${mix(t.surface, t.border, 0.12)}, ${plate}) !important;`;

  const u = [svgUrl(frameSvg), svgUrl(dither), svgUrl(sunDisk), svgUrl(cursor), svgUrl(tag('YOU', red)), svgUrl(tag('COM', navy))];
  return `
html body { ${u.map((v, i) => `--dbtc-u${i}: ${v};`).join(' ')} }
/* Menu tiles: black plates in a carved sandstone band; the hovered tile gets the yellow pyramid cursor. */
${SEL.tile} { ${platePanel} border-style: solid !important; border-image: var(--dbtc-u0) 24 / 14px round !important; border-radius: 0 !important; box-shadow: 3px 4px 0 ${alpha('#000000', 0.7)} !important; }
${SEL.tileHover} { background: ${dith}, radial-gradient(ellipse 80% 90% at 50% 100%, ${alpha(gold, 0.3)}, transparent 70%), linear-gradient(180deg, ${mix(t.surface, gold, 0.12)}, ${plate}) !important; box-shadow: 3px 4px 0 ${alpha('#000000', 0.7)}, 0 0 16px -4px ${alpha(gold, 0.7)} !important; }
${on(SEL.tileHover, 'before')} { content: ""; position: absolute; left: -30px; top: calc(50% - 13px); width: 22px; height: 26px; pointer-events: none; background: var(--dbtc-u3) center / contain no-repeat; animation: dbtc-fm-nudge 0.9s ease-in-out infinite; }
${SEL.tileLabel} { ${label} }

/* Buttons: the small navy boxes with a white rim; gold when hovered. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { ${chip(navy)} color: ${gold} !important; text-shadow: 1px 1px 0 #000000 !important; }
${SEL.buttonHover} { ${chip(mix(gold, t.bg, 0.25), 0.3)} color: ${t.accentText} !important; text-shadow: none !important; }
${SEL.buttonDown} { ${chip(mix(gold, t.bg, 0.5), 0)} color: ${t.text} !important; }
${SEL.submit} { background: ${navy} !important; border: 1px solid ${rim} !important; color: ${rim} !important; border-radius: 4px !important; }

/* Pop-ups: a black plate in the sandstone band, the winged sun disk set on its foot (above the top edge it would cover the site logo, inside it the title). */
${SEL.dialog} { ${platePanel} border-radius: 0 !important; box-shadow: 0 0 0 2px #000000, 0 20px 50px -10px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: -4px; top: -4px; right: -4px; bottom: -4px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(14)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 57px); top: auto; right: auto; bottom: -26px; width: 114px; height: 40px; pointer-events: none; z-index: 1; background: var(--dbtc-u2) center / contain no-repeat; filter: drop-shadow(2px 3px 0 #000000); transform: none; }
${SEL.dialogTitle} { color: ${gold} !important; text-shadow: 2px 2px 0 #000000 !important; }

/* Chat: the header is the sandstone band; the window a black plate. */
${SEL.chatTop} { background: ${dith}, linear-gradient(180deg, ${stoneHi}, ${stone} 30%, ${stoneLo}) !important; box-shadow: inset 0 -2px 0 ${gold}, inset 0 -3px 0 #000000 !important; }
${SEL.chat} { ${platePanel} box-shadow: inset 2px 0 0 ${stone}, inset -2px 0 0 ${stone}, inset 0 -2px 0 ${stone} !important; }

/* Duel: flat white numerals in the game's crimson (YOU) and navy (COM) LP boxes, the tag at the left, a thin
   gold strip along the foot for the life left; square navy phase chips in a gold rim, gold when active. */
${SEL.life} { border-color: ${rim} !important; border-radius: 4px !important; box-shadow: 0 0 0 1px #000000, 2px 3px 0 ${alpha('#000000', 0.6)} !important; }
/* Yours is the YOU tag's deep crimson (darker than the danger red) with the gold underline; the rival's the COM navy. */
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 3px !important; background: linear-gradient(0deg, ${gold} 0 3px, transparent 3px), ${sheen}, linear-gradient(90deg, ${mix(t.self, '#000000', 0.45)}, ${mix(t.self, '#000000', 0.12)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(0deg, ${mix(t.opp, t.bg, 0.55)} 0 3px, transparent 3px), ${sheen}, ${mix(t.opp, t.bg, 0.12)} !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.14)}, transparent 50%), ${navyDeep} !important; }
${sel(['#duel .lifepoints'])} { --lp-hit: ${t.danger}; --lp-heal: ${t.success}; }
${on(sel(['#duel #lifepoints1']), 'before')} { content: ""; position: absolute; left: -42px; top: 3px; width: 38px; height: 20px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${on(sel(['#duel #lifepoints2']), 'before')} { content: ""; position: absolute; left: -42px; top: 3px; width: 38px; height: 20px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; }
${sel(['#duel #lifepoints1 .life_txt', '#duel #lifepoints2 .life_txt'])} { color: #ffffff !important; -webkit-text-fill-color: currentColor !important; text-shadow: 2px 2px 0 #000000, 0 0 1px #000000 !important; font-variant-numeric: tabular-nums; }
/* Our counters sit on their own plate: no extra ink blur behind the number. */
${on(sel(['#duel #lifepoints1.lifepoints .life_txt', '#duel #lifepoints2.lifepoints .life_txt']).replace(/html body/g, 'html:not([data-dbte-lpstyle]) body'), 'before')} { background: none !important; }
${SEL.phase} { background: ${gold} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px #000000, 2px 3px 0 ${alpha('#000000', 0.6)} !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) .background', '#duel .phase.active:has(.phase_inner.blue) .background'])} { background: ${gold} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; border-radius: 3px !important; }
${sel(['#duel .phase .background .background_inner'])} { background: #000000 !important; border-radius: 2px !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { border-radius: 2px !important; background: linear-gradient(180deg, ${alpha('#ffffff', 0.2)}, transparent 55%), ${navy} !important; }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.4)}, transparent 55%), ${gold} !important; box-shadow: 0 0 12px ${alpha(gold, 0.7)}; }
${sel(['#duel .phase span'])} { color: ${gold} !important; text-shadow: 2px 2px 0 #000000 !important; }
${sel(['#duel .phase.active span'])} { color: ${t.accentText} !important; text-shadow: none !important; }
${SEL.duelLog} { ${platePanel} box-shadow: 0 0 0 2px ${gold}, 0 0 0 5px ${stone}, 0 0 0 6px #000000 !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${gold}, 0 0 0 5px ${stone}, 0 0 0 6px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${rim} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${navy} !important; }
${sel(['#duel #turn .red', '#duel #start_turn .red', '#duel #end_turn .red'])} { background: ${red} !important; filter: none !important; }
${sel(['#duel #turn .blue', '#duel #start_turn .blue', '#duel #end_turn .blue'])} { background: ${navy} !important; filter: none !important; }

/* Duel room: plates in the sandstone band. */
${lobbyBorders} { ${platePanel} box-shadow: 3px 4px 0 ${alpha('#000000', 0.6)}; }
${on(lobbyBorders, 'before')} { background: ${stone} !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -4px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${plate} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${plate} !important; box-shadow: 0 0 0 .35em ${plate} !important; border-radius: 0 !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.14)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.36)}, ${alpha(gold, 0.1)}) !important; }
${sel(['#duel_room #yu', '#duel_room .format > .border'])} { filter: none !important; }

/* Deck constructor: plates with the carved band. */
${deckPanels} { ${platePanel} box-shadow: inset 0 0 0 3px ${stone}, inset 0 0 0 4px ${gold}, inset 0 0 0 5px #000000 !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(14)} }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${stone} !important; ${platePanel} }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -4px; pointer-events: none; ${frame(14)} }

/* Titles: gold with the game's hard black drop. */
${titles} { color: ${gold} !important; text-shadow: 3px 3px 0 #000000 !important; }

/* Text fields: black wells with a thin white rim (the game's name bar). */
${SEL.field} { background-color: #000000 !important; border-color: ${mix(rim, t.bg, 0.4)} !important; border-radius: 3px !important; color: ${t.text} !important; box-shadow: inset 0 2px 0 ${alpha('#ffffff', 0.08)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: 0 0 8px ${alpha(gold, 0.6)} !important; }

/* Scrollbars: a gold rod. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${goldLo}, ${gold}, ${goldLo}) !important; border-radius: 2px !important; }

/* Pop-up buttons. */
${popCss}

@keyframes dbtc-fm-nudge { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
@media (prefers-reduced-motion: reduce) { ${on(SEL.tileHover, 'before')} { animation: none; } }

/* In a duel the scene's winged sun disk stands aside (its wing tips would show in the stage's top corner), and on the
   main menu (it sits behind the status filter). */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-fm-disk, html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-fm-disk { display: none; }
/* Main menu: the board slides right, out from behind the status feed. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-fm-board { transform: translateX(464px); }
`;
};
