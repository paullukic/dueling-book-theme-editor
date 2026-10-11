// madolche: the Chateau's patisserie. Chocolate panels glazed with strawberry
// cream that drips over the top edge, a caramel rim piped with a row of cream
// pearls, Queen Tiaramisu's tiara as the crest, candy-striped life bars and
// macaron phases. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const cream = t.text;
  const creamShade = mix(t.text, t.muted, 0.55);
  const pink = t.accent;
  const pinkDeep = mix(t.accent, t.bg, 0.55);
  const caramel = t.accent2;
  const caramelDim = mix(t.accent2, t.bg, 0.45);
  const caramelHi = mix(t.accent2, '#ffffff', 0.45);
  const choc = mix(t.surface, t.accent2, 0.1);
  const chocDeep = mix(t.bg, t.accent, 0.05);
  const mint = t.success;
  const ink = mix(t.bg, '#000000', 0.45);

  // Sprinkles, very faint.
  const sprinkles = svg(44, 44, `<g stroke-linecap="round" stroke-width="2"><path d="M8 10l4 2" stroke="${pink}" stroke-opacity="0.08"/><path d="M30 8l-2 4" stroke="${mint}" stroke-opacity="0.07"/><path d="M22 30l4 -1" stroke="${caramel}" stroke-opacity="0.08"/><path d="M38 36l1 4" stroke="${cream}" stroke-opacity="0.08"/></g>`);

  // Strawberry cream poured over an edge, tiling sideways.
  const dripSvg = (color, h = 14) => svg(48, h, `<path d="M0 0H48V4C44 4 44 ${h - 2} 40 ${h - 2}C36 ${h - 2} 37 5 33 5C30 5 31 ${h * 0.6} 27 ${h * 0.6}C23 ${h * 0.6} 24 4 20 4C16 4 17 ${h - 4} 12 ${h - 4}C7 ${h - 4} 8 4 4 4C2 4 1 4 0 4Z" fill="${color}"/><path d="M0 1.5H48" stroke="#ffffff" stroke-opacity="0.45" stroke-width="1.2"/>`);

  // Nine-slice frame: a caramel rim with a row of piped cream pearls, rosettes in the corners.
  const rosette = (x, y) => `<circle cx="${x}" cy="${y}" r="5.4" fill="${cream}" stroke="${creamShade}" stroke-width="0.8"/><path d="M${x - 3.4} ${y + 0.6}q3.4 -4.6 6.8 0" fill="none" stroke="${creamShade}" stroke-width="1"/><circle cx="${x + 0.6}" cy="${y - 4.4}" r="2" fill="${pink}"/>`;
  const frameSvg = svg(60, 60, `<rect x="1" y="1" width="58" height="58" rx="9" fill="none" stroke="${caramel}" stroke-width="1.6"/><path d="M15 6.5H45M15 53.5H45M6.5 15V45M53.5 15V45" stroke="${cream}" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0 5" stroke-dashoffset="-2.5"/>${rosette(8, 8)}${rosette(52, 8)}${rosette(8, 52)}${rosette(52, 52)}`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px round; box-sizing: border-box;`;

  // Queen Tiaramisu's tiara: caramel-gold arches, a strawberry heart, mint and pink gems.
  const tiara = (w, h) => svg(w, h, `<g transform="scale(${w / 60} ${h / 30})"><path d="M6 27Q30 31 54 27L50 14L41 21L36 6L30 19L24 6L19 21L10 14Z" fill="${caramel}" stroke="${caramelDim}" stroke-width="0.8" stroke-linejoin="round"/><path d="M6 27Q30 31 54 27" fill="none" stroke="${caramelHi}" stroke-width="1.4"/><path d="M30 3C33 0 37 3 30 10C23 3 27 0 30 3Z" fill="${pink}" stroke="${caramelHi}" stroke-width="0.8"/><circle cx="10" cy="13" r="2" fill="${mint}"/><circle cx="50" cy="13" r="2" fill="${mint}"/><circle cx="24" cy="6" r="1.8" fill="${pink}"/><circle cx="36" cy="6" r="1.8" fill="${pink}"/><path d="M14 25h32" stroke="${cream}" stroke-width="1.4" stroke-dasharray="0 4" stroke-linecap="round"/></g>`);

  // A strawberry that caps the life bar.
  const berry = svg(18, 30, `<path d="M9 8C17 6 19 15 9 28C-1 15 1 6 9 8Z" fill="${mix(t.danger, pink, 0.3)}" stroke="${ink}" stroke-opacity="0.4" stroke-width="0.8"/><g fill="${caramelHi}"><circle cx="6" cy="13" r="0.9"/><circle cx="12" cy="14" r="0.9"/><circle cx="9" cy="19" r="0.9"/><circle cx="7" cy="22" r="0.8"/></g><path d="M9 8L3 4L7 5L6 1L9 4L12 1L11 5L15 4Z" fill="${mix(mint, t.bg, 0.25)}"/>`);

  const label = `color: ${cream} !important; text-shadow: 0 1px 0 ${ink}, 0 0 10px ${alpha(pink, 0.35)} !important;`;
  const glaze = (lift = 0) => `var(--dbtc-u5) top center / 48px 14px repeat-x, radial-gradient(ellipse 70% 90% at 50% 0%, ${alpha(pink, 0.12 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${choc}, ${chocDeep})`;

  // Pop-up buttons as macaron pills: strawberry with dark lettering, chocolate with cream.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="29" fill="url(#g)" stroke="${c.edge}" stroke-width="2.5"/><path d="M22 16.5H${w - 22}" stroke="#ffffff" stroke-opacity="0.5" stroke-width="3" stroke-linecap="round"/><path d="M20 61H${w - 20}" stroke="${c.pearl}" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="0 7"/><text x="${w / 2}" y="40" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const primary = { top: mix(pink, '#ffffff', 0.25), bot: pink, edge: mix(pink, t.bg, 0.35), pearl: cream, text: t.accentText };
  const secondary = { top: mix(choc, caramel, 0.18), bot: chocDeep, edge: caramelDim, pearl: alpha(cream, 0.7), text: cream };
  const popCss = [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.55)}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const button = `background: linear-gradient(180deg, ${mix(pink, choc, 0.55)} 0 3px, ${mix(choc, caramel, 0.12)} 3px, ${chocDeep}) !important; border-color: ${caramelDim} !important; color: ${cream} !important; border-radius: 9px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.25)}, 0 2px 5px -2px #000000 !important;`;
  const stripes = `repeating-linear-gradient(-45deg, ${alpha('#ffffff', 0.16)} 0 6px, transparent 6px 12px)`;

  const vars = [['u0', svgUrl(frameSvg)], ['u1', svgUrl(tiara(44, 22))], ['u2', svgUrl(sprinkles)], ['u3', svgUrl(tiara(120, 60))], ['u4', svgUrl(berry)], ['u5', svgUrl(dripSvg(mix(pink, cream, 0.35)))], ['u6', svgUrl(dripSvg(cream, 12))]];
  return `
html body { ${vars.map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: chocolate glazed in strawberry cream, piped rim, a tiara on top. */
${SEL.tile} { background: ${glaze()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 15px round !important; border-radius: 10px !important; box-shadow: inset 0 -12px 18px -8px ${alpha('#000000', 0.5)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 22px); top: -16px; width: 44px; height: 22px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px ${ink}); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${glaze(0.16)} !important; box-shadow: inset 0 0 22px ${alpha(pink, 0.3)}, 0 0 18px -4px ${alpha(pink, 0.7)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: chocolate bars with a strawberry icing edge. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { ${button} }
${SEL.buttonHover} { background: linear-gradient(180deg, ${pink} 0 3px, ${mix(pink, choc, 0.6)} 3px, ${choc}) !important; border-color: ${caramel} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.35)}, 0 0 10px -2px ${alpha(pink, 0.8)} !important; }
${SEL.buttonDown} { background: ${chocDeep} !important; border-color: ${pink} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a chocolate box, cream poured over the top, the tiara above. */
${SEL.dialog} { background: var(--dbtc-u6) top center / 48px 12px repeat-x, radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(pink, 0.18)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${choc}, ${t.bg}) !important; border-radius: 14px !important; box-shadow: 0 0 0 2px ${caramelDim}, 0 0 0 5px ${chocDeep}, 0 0 0 6px ${alpha(caramel, 0.6)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 14px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 60px); top: -50px; right: auto; bottom: auto; width: 120px; height: 60px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 3px ${ink}); }
${SEL.dialogTitle} { ${label} }

/* Chat: a strawberry-glazed header, the window edged in caramel. */
${SEL.chatTop} { background: var(--dbtc-u6) bottom center / 48px 12px repeat-x, linear-gradient(180deg, ${mix(pink, choc, 0.4)}, ${mix(pink, choc, 0.7)}) !important; box-shadow: inset 0 -2px 0 ${caramelDim}, inset 0 1px 0 ${alpha('#ffffff', 0.3)} !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${caramelDim}, inset -1px 0 0 ${caramelDim}, inset 0 -1px 0 ${caramelDim} !important; }

/* Duel: candy-striped life bars capped with a strawberry; macaron phases. */
${SEL.life} { border-color: ${caramel} !important; border-radius: 10px !important; box-shadow: 0 0 0 1px ${chocDeep}, 0 0 0 3px ${alpha(cream, 0.5)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 9px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${alpha(mix(t.self, t.bg, 0.3), 0)} 42%, ${mix(t.self, t.bg, 0.3)} 68%), ${stripes}, linear-gradient(90deg, ${mix(t.self, t.bg, 0.5)}, ${t.self} 40%, ${mix(t.self, t.bg, 0.3)} 68%) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${alpha(mix(t.opp, t.bg, 0.3), 0)} 42%, ${mix(t.opp, t.bg, 0.3)} 68%), ${stripes}, linear-gradient(90deg, ${mix(t.opp, t.bg, 0.5)}, ${t.opp} 40%, ${mix(t.opp, t.bg, 0.3)} 68%) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -19px; top: -2px; width: 18px; height: 30px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${cream} !important; text-shadow: 0 1px 2px ${ink}, 0 0 6px ${ink} !important; }
${SEL.phase} { background: linear-gradient(180deg, ${caramelHi}, ${caramelDim}) !important; box-shadow: 0 0 0 1px ${chocDeep}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${chocDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: linear-gradient(180deg, transparent 82%, ${alpha(cream, 0.5)} 82% 87%, transparent 87%), radial-gradient(circle at 50% 30%, ${mix(choc, caramel, 0.3)} 30%, ${chocDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: linear-gradient(180deg, transparent 82%, ${alpha(cream, 0.85)} 82% 87%, transparent 87%), radial-gradient(circle at 50% 30%, ${mix(t.self, '#ffffff', 0.3)} 20%, ${mix(t.self, t.bg, 0.4)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.75)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: linear-gradient(180deg, transparent 82%, ${alpha(cream, 0.85)} 82% 87%, transparent 87%), radial-gradient(circle at 50% 30%, ${mix(t.opp, '#ffffff', 0.3)} 20%, ${mix(t.opp, t.bg, 0.4)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.75)}; }
${sel(['#duel .phase span'])} { color: ${cream} !important; text-shadow: 0 1px 2px ${ink}, 0 0 4px ${ink} !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(t.surface, choc, 0.4)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${caramelDim}, inset 0 0 0 4px ${alpha(chocDeep, 0.9)}, inset 0 0 0 5px ${alpha(cream, 0.25)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${caramel}, 0 0 0 4px ${chocDeep}, 0 0 0 6px ${alpha(pink, 0.6)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${caramelHi}, ${caramelDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${choc}, ${chocDeep}) !important; }
${sel(['#duel #turn .red'])} { background: linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.3)}, ${mix(t.opp, t.bg, 0.35)}) !important; }
${sel(['#duel #turn .blue'])} { background: linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.3)}, ${mix(t.self, t.bg, 0.35)}) !important; }
${sel(['#duel #turn span'])} { color: ${t.accentText} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.4)} !important; }

/* Duel room: caramel rims piped with cream around chocolate panels. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(choc, 0.7)}, ${alpha(t.bg, 0.8)}) !important; border-radius: 12px !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${caramelHi}, ${caramelDim} 35%, ${caramel} 60%, ${caramelDim}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(18)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: linear-gradient(90deg, transparent, ${t.bg} 10% 90%, transparent) 0 60% / 100% 40% no-repeat !important; box-shadow: none !important; border-radius: 0 !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(pink, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(pink, 0.4)}, ${alpha(pink, 0.12)}) !important; }

/* Deck constructor and settings: chocolate trays in the piped rim. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${choc}, ${chocDeep}) !important; box-shadow: inset 0 0 0 1px ${caramelDim}, inset 0 0 0 4px ${alpha(chocDeep, 0.9)}, inset 0 0 0 5px ${alpha(cream, 0.25)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }
${SEL.settingsPanel} { border-color: ${caramelDim} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(choc, 0.85)}, ${alpha(t.bg, 0.88)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: cream lettering with a strawberry glow. */
${titles} { color: ${cream} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${pinkDeep}, 0 0 16px ${alpha(pink, 0.5)} !important; }

/* Text fields: chocolate wells with a caramel lip, strawberry focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${caramelDim} !important; border-radius: 6px !important; box-shadow: inset 0 2px 4px ${ink}, 0 1px 0 ${alpha(cream, 0.15)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${pink} !important; box-shadow: inset 0 2px 4px ${ink}, 0 0 8px ${alpha(pink, 0.6)} !important; }

/* Scrollbars: candy sticks. */
${sel(['#content .os-scrollbar-handle'])} { background: repeating-linear-gradient(-45deg, ${cream} 0 5px, ${pink} 5px 10px) !important; border-radius: 6px !important; }

/* Pop-up buttons as macaron pills. */
${popCss}
`;
};
