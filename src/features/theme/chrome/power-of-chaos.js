// power-of-chaos: the 2003 PC game's interface. Carved sandstone plaques
// with embossed dark lettering (the title-screen menu), red enamel title
// plates with a gold rim, blue capsule phase pills, a chunky LP plate
// with a heart, and pop-ups drawn as the white comic speech bubbles the
// rivals talk in. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const sand = mix(t.muted, t.warning, 0.35);
  const sandLit = mix(sand, '#ffffff', 0.38);
  const sandDeep = mix(sand, t.bg, 0.5);
  const ink = mix(t.bg, '#000000', 0.25);
  const umber = mix(t.surface, t.border, 0.25);
  const red = t.accent;
  const blue = t.opp;
  const gold = t.warning;
  const paper = mix(t.text, '#ffffff', 0.6);

  // Sandstone grain: a few pits and chisel marks, faint.
  const grain = svg(48, 48, `<g fill="${ink}" fill-opacity="0.12"><circle cx="7" cy="9" r="1.1"/><circle cx="31" cy="5" r="0.8"/><circle cx="41" cy="30" r="1.2"/><circle cx="18" cy="37" r="0.9"/><circle cx="26" cy="22" r="0.6"/></g><path d="M3 22l6 1M33 42l7-1" stroke="${ink}" stroke-opacity="0.1" stroke-width="1"/><g fill="#ffffff" fill-opacity="0.12"><circle cx="12" cy="28" r="0.8"/><circle cx="38" cy="15" r="0.7"/></g>`);
  // Deck-construction grid: the card list's ruled field.
  const grid = svg(32, 32, `<path d="M0 .5H32M.5 0V32" stroke="${sand}" stroke-opacity="0.07"/>`);
  // Pointing hand: the menu cursor, in gold.
  const hand = svg(36, 24, `<path d="M2 9h17l-3-5c-.6-1.2.6-2.4 1.8-1.7L27 8c1.6 1 2.6 2.6 2.6 4.5V17c0 2.8-2.3 5-5 5H13c-1.7 0-2.6-1-2.6-2.3 0-1 .6-1.8 1.4-2.1-1-.4-1.6-1.2-1.6-2.2 0-.9.5-1.7 1.3-2.1H2c-1.1 0-1.7-.7-1.7-1.6S.9 9 2 9z" fill="url(#g)" stroke="${mix(gold, t.bg, 0.6)}" stroke-width="1.3" stroke-linejoin="round"/><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.55)}"/><stop offset="1" stop-color="${gold}"/></linearGradient></defs><path d="M14 14.5h7M13.5 18.5h8" stroke="${mix(gold, t.bg, 0.55)}" stroke-width="1" stroke-linecap="round"/>`);
  // LP heart (the life gauge's badge).
  const heart = svg(60, 26, `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.6)}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="0.55" stop-color="${mix(gold, t.accent, 0.35)}"/><stop offset="1" stop-color="${mix(gold, '#ffffff', 0.25)}"/></linearGradient></defs><path d="M12 23S1.5 16.4 1.5 9.8C1.5 6.7 3.8 4.5 6.5 4.5c2.4 0 4 1.4 5.5 3.3 1.5-1.9 3.1-3.3 5.5-3.3 2.7 0 5 2.2 5 5.3C22.5 16.4 12 23 12 23z" fill="${t.self}" stroke="${mix(t.self, '#000000', 0.55)}" stroke-width="1.5"/><path d="M5.5 8.5c.5-1.1 1.5-1.8 2.6-1.8" stroke="#ffffff" stroke-opacity="0.8" stroke-width="1.5" stroke-linecap="round" fill="none"/><text x="25" y="20.5" font-family="Arial Black, Arial, sans-serif" font-size="17" fill="url(#g)" stroke="${ink}" stroke-width="2.4" paint-order="stroke">LP</text>`);
  // Speech-bubble tail for the pop-ups.
  const tail = svg(64, 44, `<path d="M62 0H20L6 42L42 0" fill="${paper}"/><path d="M62 1.5L42 1.5M20 1.5L6 42L42 1.5" fill="none" stroke="#000000" stroke-width="3.2" stroke-linejoin="round"/><path d="M2 0H64" stroke="${paper}" stroke-width="3"/>`);

  // Plaque surfaces.
  const plaque = (lift = 0) => `linear-gradient(180deg, ${alpha('#ffffff', 0.22 + lift)}, transparent 38%, ${alpha(ink, 0.18)}), var(--dbtc-u0), linear-gradient(180deg, ${mix(sandLit, sand, 0.4 - lift)}, ${sand} 55%, ${mix(sand, sandDeep, 0.45)})`;
  const bevel = `inset 0 2px 0 ${alpha('#ffffff', 0.55)}, inset 2px 0 0 ${alpha('#ffffff', 0.25)}, inset 0 -3px 0 ${alpha(ink, 0.35)}, inset -2px 0 0 ${alpha(ink, 0.25)}`;
  const emboss = `color: ${ink} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.55)}, 0 -1px 0 ${alpha(ink, 0.15)} !important;`;
  const panel = `var(--dbtc-u1), linear-gradient(180deg, ${mix(umber, t.bg, 0.2)}, ${mix(t.bg, umber, 0.35)})`;
  const stoneRim = `inset 0 0 0 2px ${sand}, inset 0 0 0 4px ${sandDeep}, inset 0 0 0 5px ${alpha(sandLit, 0.5)}`;

  // Pop-up buttons: the blue glass pill (primary) and a sandstone plaque (secondary).
  const popBtn = (label, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    const fillTop = primary ? mix(paper, '#ffffff', 0.5) : sandLit;
    const fillMid = primary ? paper : sand;
    const fillBot = primary ? mix(paper, sand, 0.45) : mix(sand, sandDeep, 0.5);
    const txt = ink;
    const stroke = primary ? mix(umber, '#000000', 0.2) : mix(sandDeep, '#000000', 0.3);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fillTop}"/><stop offset="0.55" stop-color="${fillMid}"/><stop offset="1" stop-color="${fillBot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="${primary ? 12 : 6}" fill="url(#g)" stroke="${stroke}" stroke-width="3"/><rect x="12" y="14" width="${bw - 12}" height="14" rx="4" fill="#ffffff" fill-opacity="0.3"/><rect x="10.5" y="14.5" width="${bw - 9}" height="49.5" rx="${primary ? 9 : 4}" fill="none" stroke="${mix(umber, sand, 0.3)}" stroke-opacity="0.6"/><text x="${w / 2}" y="41" dominant-baseline="central" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="25" fill="${txt}" letter-spacing="1">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = [['ok_btn', 'OK', true, false], ['yes_btn', 'YES', true, false], ['no_btn', 'NO', false, false], ['cancel_btn', 'CANCEL', false, true]]
    .map(([n, label, primary, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, primary))} !important; filter: drop-shadow(0 3px 3px ${alpha('#000000', 0.6)}) !important; }`)
    .join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .title_txt.arial_black2']);
  const labels = sel(['#content .arial_black2:not(.title_txt):not(.title1)', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const bodyText = sel(['#content #msg .body_txt', '#content #link .body_txt', '#content #confirm .body_txt', '#content #confirm2 .body_txt', '#content #input .body_txt', '#content #input2 .body_txt', '#content #combo .body_txt']);

  const vars = [grain, grid, hand, heart, tail].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: carved sandstone plaques with embossed dark lettering; the gold hand points at the one under the cursor. */
${SEL.tile} { background: ${plaque()} !important; border-color: ${mix(sandDeep, '#000000', 0.35)} !important; border-radius: 5px !important; box-shadow: ${bevel}, inset 0 0 0 7px ${alpha(sand, 0)}, inset 0 0 0 8px ${alpha(ink, 0.22)}, inset 0 0 0 9px ${alpha('#ffffff', 0.25)}, 0 0 0 1px ${mix(sandDeep, '#000000', 0.4)}, 0 8px 16px -8px #000000 !important; }
${SEL.tileHover} { background: ${plaque(0.1)} !important; box-shadow: ${bevel}, inset 0 0 0 8px ${alpha(ink, 0.22)}, inset 0 0 0 9px ${alpha('#ffffff', 0.25)}, 0 0 0 2px ${gold}, 0 0 16px -2px ${alpha(gold, 0.7)}, 0 10px 18px -8px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: -40px; top: calc(50% - 12px); width: 36px; height: 24px; pointer-events: none; background: var(--dbtc-u2) center / contain no-repeat; opacity: 0; filter: drop-shadow(0 2px 2px #000000); transition: opacity 0.12s; }
${on(SEL.tileHover, 'before')} { opacity: 1; }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileLabel} { ${emboss} }

/* Buttons: small sandstone plaques. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: ${plaque()} !important; border-color: ${mix(sandDeep, '#000000', 0.35)} !important; ${emboss} border-radius: 4px !important; box-shadow: ${bevel}, 0 2px 4px -1px #000000 !important; }
${SEL.buttonHover} { background: ${plaque(0.12)} !important; border-color: ${gold} !important; box-shadow: ${bevel}, 0 0 0 1px ${gold}, 0 0 10px -2px ${alpha(gold, 0.8)} !important; }
${SEL.buttonDown} { background: linear-gradient(180deg, ${alpha(ink, 0.2)}, transparent 40%), var(--dbtc-u0), ${mix(sand, sandDeep, 0.55)} !important; box-shadow: inset 0 3px 5px ${alpha(ink, 0.5)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(ink, sand, 0.45)} !important; }

/* Pop-ups: the rival's white comic speech bubble, black ink outline and a tail. */
${SEL.dialog} { background: ${paper} !important; border-radius: 34px !important; box-shadow: 0 0 0 4px #000000, 8px 10px 0 4px ${alpha('#000000', 0.45)} !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 4%; top: auto; right: auto; bottom: -30px; width: 44px; height: 30px; pointer-events: none; z-index: 1; background: var(--dbtc-u4) left top / 44px 30px no-repeat; transform: none; }
${on(SEL.dialog, 'after')} { content: none; }
${SEL.dialogTitle} { color: ${mix(sandDeep, '#000000', 0.5)} !important; text-shadow: none !important; }
${bodyText} { color: ${ink} !important; text-shadow: none !important; }

/* Chat: a sandstone header band over a dark umber body. */
${SEL.chatTop} { background: ${plaque()} !important; box-shadow: ${bevel}, inset 0 -1px 0 ${mix(sandDeep, '#000000', 0.4)} !important; }
${sel(['#chats .chat .chat_top span'])} { ${emboss} }
${SEL.chat} { background: ${panel} !important; outline: 3px solid ${sand} !important; outline-offset: 0 !important; box-shadow: 0 0 0 5px ${mix(sandDeep, '#000000', 0.3)}, 0 0 0 6px ${alpha(sandLit, 0.5)}, inset 0 0 0 2px ${ink} !important; }

/* Duel: the heart-and-gold-LP plaque on a stone bar, a crimson gauge for you and a sky-blue one for the rival; blue capsule phase pills on stone. */
${SEL.life} { border-color: ${sandLit} !important; border-radius: 5px !important; box-shadow: 0 0 0 3px ${sand}, 0 0 0 5px ${mix(sandDeep, '#000000', 0.3)}, inset 0 0 0 1px ${ink}, 0 5px 10px -2px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 3px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${mix(t.self, t.bg, 0.2)}, ${mix(mix(t.self, '#5a0a14', 0.35), t.bg, 0.4)}) !important; box-shadow: inset 0 3px 3px -1px ${alpha('#ffffff', 0.4)} !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${mix(blue, t.bg, 0.15)}, ${mix(blue, t.bg, 0.45)}) !important; box-shadow: inset 0 3px 3px -1px ${alpha('#ffffff', 0.4)} !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -64px; top: 2px; width: 60px; height: 26px; pointer-events: none; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 1px 1px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: ${mix(gold, '#ffffff', 0.45)} !important; text-shadow: 0 2px 0 ${ink}, 0 0 3px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: linear-gradient(180deg, ${sand}, ${sandDeep}) !important; border-radius: 14px !important; box-shadow: inset 0 1px 0 ${alpha(sandLit, 0.8)}, 0 0 0 1px ${mix(sandDeep, '#000000', 0.45)}, 0 3px 6px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; border-radius: 12px !important; }
${sel(['#duel .phase .background', '#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { border-radius: 12px !important; }
${sel(['#duel .phase .background .background_inner'])} { background: transparent !important; border-radius: 12px !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: linear-gradient(180deg, ${mix(blue, t.bg, 0.35)}, ${mix(blue, t.bg, 0.65)}) !important; box-shadow: inset 0 7px 5px -4px ${alpha('#ffffff', 0.45)}, inset 0 0 0 1px ${alpha('#000000', 0.4)} !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: linear-gradient(180deg, ${mix(t.self, t.bg, 0.3)}, ${mix(t.self, t.bg, 0.6)}) !important; box-shadow: inset 0 7px 5px -4px ${alpha('#ffffff', 0.45)}, 0 0 0 3px ${gold}, 0 0 14px ${alpha(gold, 0.8)} !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: linear-gradient(180deg, ${mix(t.opp, t.bg, 0.15)}, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: inset 0 7px 5px -4px ${alpha('#ffffff', 0.45)}, 0 0 0 3px ${gold}, 0 0 14px ${alpha(gold, 0.8)} !important; }
${sel(['#duel .phase span', '#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${mix(t.text, '#ffffff', 0.5)} !important; text-shadow: 1px 0 0 ${ink}, -1px 0 0 ${ink}, 0 1px 0 ${ink}, 0 -1px 0 ${ink}, 0 2px 2px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${sandLit}, ${sandDeep}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(red, '#ffffff', 0.15)}, ${mix(red, t.bg, 0.45)}) !important; }
${SEL.duelLog} { background: ${panel} !important; box-shadow: ${stoneRim} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 3px ${sand}, 0 0 0 5px ${sandDeep}, 0 4px 10px -2px #000000 !important; }

/* Duel room: sandstone-rimmed panels. */
${lobbyBorders} { background: ${panel} !important; box-shadow: 0 8px 20px -10px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(180deg, ${sandLit}, ${sand} 45%, ${sandDeep}) !important; filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: ${t.bg} !important; box-shadow: -0.5em 0 0 0 ${t.bg}, 0.5em 0 0 0 ${t.bg} !important; border-radius: 2px !important; text-shadow: none !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${plaque()} !important; ${emboss} box-shadow: 0 0 0 0.2em ${sand}, 0 0 0 calc(0.2em + 1px) ${mix(sandDeep, '#000000', 0.4)}, 0 4px 8px -2px #000000 !important; border-radius: 3px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(sand, 0.18)}, transparent 45%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.35)}, ${alpha(sand, 0.1)}) !important; }

/* Deck constructor: the ruled card grid inside a stone rim. */
${deckPanels} { background: ${panel} !important; box-shadow: ${stoneRim} !important; }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${sand} !important; background: ${panel} !important; box-shadow: inset 0 0 0 2px ${sandDeep}, 0 6px 14px -8px #000000 !important; }

/* Titles: the game's chunky gold lettering (the LP 8000 counter), outlined in umber. */
${titles} { color: transparent !important; -webkit-text-fill-color: transparent !important; background: linear-gradient(180deg, #ffffff 6%, ${mix(gold, '#ffffff', 0.55)} 40%, ${gold} 50%, ${mix(gold, t.accent, 0.3)} 54%, ${mix(gold, '#ffffff', 0.35)} 90%) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-stroke: 1px ${mix(umber, '#000000', 0.5)}; text-shadow: none !important; filter: drop-shadow(0 3px 0 ${mix(umber, '#000000', 0.55)}) drop-shadow(0 0 8px ${alpha(t.bg, 0.9)}); }
${labels} { color: ${sandLit} !important; text-shadow: 0 1px 0 ${ink}, 0 0 4px ${t.bg} !important; }

/* Text fields: dark wells with a sandstone lip. */
${SEL.field} { background-color: ${mix(t.bg, umber, 0.3)} !important; border-color: ${sandDeep} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(sandLit, 0.3)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 2px solid ${gold} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(gold, 0.6)} !important; }

/* Scrollbars: sandstone rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${sandDeep}, ${sandLit}, ${sandDeep}) !important; border-radius: 3px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
