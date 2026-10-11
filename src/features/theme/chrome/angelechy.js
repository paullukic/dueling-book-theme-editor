// angelechy: the chess angels. White armour plates banded in gold over a dark
// chessboard, Staunton pieces as crests (a different piece per tile), feathered
// wings with checker cut-outs, check-pattern phase discs.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

// Staunton silhouettes on a 20x28 box, base at the bottom.
const PIECES = {
  pawn: 'M10 3a3.6 3.6 0 0 1 2.2 6.4c1.6.8 2.3 2 2.3 3.2h-2c.4 2.6 1.6 5 3.2 6.6V21H4.3v-1.8c1.6-1.6 2.8-4 3.2-6.6h-2c0-1.2.7-2.4 2.3-3.2A3.6 3.6 0 0 1 10 3Z',
  rook: 'M4 3h3v2.4h2V3h2v2.4h2V3h3v5l-2 1.6.9 9.6H5.1L6 9.6 4 8Z',
  knight: 'M7 21c0-3 1.8-5 3.4-6.6-1.6.2-3 .9-4.4 1.6L4.4 14c1.5-3.4 3.2-6.6 4.2-9.4L8.4 2.6l2.2 1.2C14.4 4.4 16 8 16 12c0 3.2-.6 6-1 9Z',
  bishop: 'M10 2.2l1.1 1.3a2 2 0 0 1-1.1 1C11.8 6 14 8.6 14 11.4c0 2-1.2 3.4-2.6 4 .6 1.4 1.6 2.6 3 3.6V21H5.6v-2c1.4-1 2.4-2.2 3-3.6-1.4-.6-2.6-2-2.6-4C6 8.6 8.2 6 10 4.5a2 2 0 0 1-1.1-1Z',
  queen: 'M3 6.6a1.4 1.4 0 1 1 1.6 1.3L6.4 13l1.6-6.4a1.4 1.4 0 1 1 1.4-.2L10 12l.6-5.6a1.4 1.4 0 1 1 1.4.2L13.6 13l1.8-5.1A1.4 1.4 0 1 1 17 6.6l-1.6 9.4c.3 1.2 1 2.2 2 3V21H2.6v-2c1-.8 1.7-1.8 2-3Z',
  king: 'M9.2 1h1.6v2h2v1.6h-2v1.6c2.4.6 4.2 2.6 4.2 5 0 1.8-.8 3.2-1.8 4.2.5 1.4 1.4 2.6 2.6 3.6V21H4.2v-2c1.2-1 2.1-2.2 2.6-3.6-1-1-1.8-2.4-1.8-4.2 0-2.4 1.8-4.4 4.2-5V4.6h-2V3h2Z',
};
const TILE_PIECES = ['knight', 'rook', 'bishop', 'king', 'queen', 'pawn'];

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const ivory = t.text;
  const pearl = mix(t.text, t.muted, 0.35);
  const plateShade = mix(t.text, t.border, 0.55);
  const gold = t.accent;
  const goldDeep = mix(t.accent, t.bg, 0.4);
  const sq1 = mix(t.surface, t.bg, 0.3);
  const sq2 = mix(t.raised, t.border, 0.25);

  // The board: an inlaid floor of gold lines, squares barely shaded.
  const board = () => svg(48, 48, `<path d="M0 0h24v24H0zM24 24h24v24H24z" fill="${ivory}" fill-opacity="0.025"/><path d="M0 0.5H48M0.5 0V48M0 24.5H48M24.5 0V48" stroke="${gold}" stroke-opacity="0.09"/><path d="M24.5 21.5l3 3-3 3-3-3z" fill="${gold}" fill-opacity="0.22"/>`);
  const piece = (name, fill = ivory, stroke = goldDeep) => svg(20, 23, `<path d="${PIECES[name]}" fill="${fill}" stroke="${stroke}" stroke-width="1" stroke-linejoin="round"/><path d="M3.4 21.2h13.2v1.4H3.4z" fill="${gold}"/>`);

  // Nine-slice armour frame: an ivory plate edge with a gold band and corner rivets.
  const corner = `<path d="M1 1H20V5H5V20H1Z" fill="${ivory}"/><path d="M1 1H20V2.6H2.6V20H1Z" fill="#ffffff" fill-opacity="0.6"/><path d="M5.6 5.6H20V7.4H7.4V20H5.6Z" fill="${gold}"/><rect x="2.4" y="2.4" width="2" height="2" fill="${goldDeep}"/>`;
  const frameSvg = svg(60, 60, `<path d="M20 1H40V5H20ZM20 55H40V59H20ZM1 20H5V40H1ZM55 20H59V40H55Z" fill="${ivory}"/><path d="M20 5.6H40V7.4H20ZM20 52.6H40V54.4H20ZM5.6 20H7.4V40H5.6ZM52.6 20H54.4V40H52.6Z" fill="${gold}"/>${corner}<g transform="matrix(-1 0 0 1 60 0)">${corner}</g><g transform="matrix(1 0 0 -1 0 60)">${corner}</g><g transform="matrix(-1 0 0 -1 60 60)">${corner}</g>`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // A wing of layered feathers with checker cut-outs.
  const feathers = (side) => {
    let f = '';
    for (let i = 0; i < 4; i++) {
      const y = 11 + i * 8;
      const len = 46 - i * 6;
      f += `<path d="M64 ${30 + i * 2}C${64 - len * 0.5} ${y - 6} ${64 - len} ${y - 2} ${64 - len - 4} ${y + 2}C${64 - len * 0.6} ${y + 6} ${64 - len * 0.3} ${y + 7} 64 ${33 + i * 2}Z" fill="${i % 2 ? pearl : ivory}" stroke="${goldDeep}" stroke-width="0.8"/><rect x="${64 - len * 0.55}" y="${y + 1.2}" width="2.6" height="2.6" fill="${t.bg}" fill-opacity="0.8" transform="rotate(-12 ${64 - len * 0.55} ${y + 1.2})"/>`;
    }
    return side ? `<g transform="matrix(-1 0 0 1 160 0)">${f}</g>` : f;
  };
  const wings = svg(160, 60, `${feathers(0)}${feathers(1)}<circle cx="80" cy="34" r="17" fill="${t.surface}" stroke="${gold}" stroke-width="2"/><circle cx="80" cy="34" r="13.5" fill="none" stroke="${ivory}" stroke-opacity="0.6"/><g transform="translate(70 21) scale(1)"><path d="${PIECES.king}" fill="${ivory}" stroke="${goldDeep}" stroke-width="1" stroke-linejoin="round"/><path d="M3.4 21.2h13.2v1.4H3.4z" fill="${gold}"/></g>`);

  // Phase discs: a 4x4 check inside a gold band.
  const checks = svg(45, 45, `<defs><pattern id="c" width="11.25" height="11.25" patternUnits="userSpaceOnUse"><rect width="5.625" height="5.625" fill="${ivory}" fill-opacity="0.11"/><rect x="5.625" y="5.625" width="5.625" height="5.625" fill="${ivory}" fill-opacity="0.11"/></pattern></defs><circle cx="22.5" cy="22.5" r="20" fill="url(#c)"/><circle cx="22.5" cy="22.5" r="20" fill="none" stroke="${gold}" stroke-opacity="0.75" stroke-width="1.2"/>`);

  const armour = (lift = 0) => `linear-gradient(180deg, ${alpha('#ffffff', 0.08 + lift)}, transparent 45%), var(--dbtc-u11) 0 0 / 48px 48px, linear-gradient(180deg, ${t.raised}, ${t.bg})`;
  const plate = `linear-gradient(180deg, #ffffff, ${ivory} 40%, ${pearl})`;

  // Pop-up buttons (DuelingBook's OK/Yes/No/Cancel <img>s), redrawn in the theme's material.
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="${c.r}" fill="url(#g)" stroke="${c.edge}" stroke-width="2.5"/><rect x="11" y="15" width="${bw - 10}" height="48.5" rx="${Math.max(c.r - 4, 0)}" fill="none" stroke="${c.inner}" stroke-opacity="0.75" stroke-width="1"/>${c.deco(w)}<text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 4px ${c.shadow}) !important; }`).join('\n');
  const popPrimary = { top: '#ffffff', bot: pearl, edge: goldDeep, inner: gold, text: t.bg, r: 2, shadow: alpha('#000000', 0.6), deco: (w) => `<rect x="6" y="57" width="${w - 12}" height="5" fill="${gold}"/>${[14, w - 14].map((x) => `<rect x="${x - 2}" y="16" width="4" height="4" fill="${goldDeep}"/>`).join('')}` };
  const popSecondary = { ...popPrimary, top: t.raised, bot: t.bg, edge: ivory, inner: gold, text: ivory, deco: (w) => `<rect x="6" y="57" width="${w - 12}" height="2" fill="${gold}"/>` };
  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const tilePieces = TILE_PIECES.map((name, i) => `${on(sel([`#main_menu .menu_btn:nth-child(6n+${i + 1}) .content`]), 'before')} { background-image: ${svgUrl(piece(name))}; }`).join('\n');

  const u0 = svgUrl(frameSvg);
  const u2 = svgUrl(wings);
    const u5 = svgUrl(piece('king'));
  const u6 = svgUrl(piece('king', t.border, ivory));
  const u7 = svgUrl(checks);
  const u11 = svgUrl(board());
  return `
html body { ${[['u0', u0], ['u2', u2], ['u5', u5], ['u6', u6], ['u7', u7], ['u11', u11]].map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: board squares in an ivory armour frame with a gold band; a chess piece stands on each. */
${SEL.tile} { background: ${armour()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 14px stretch !important; box-shadow: 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 11px); top: -18px; width: 22px; height: 26px; pointer-events: none; background: center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000) drop-shadow(0 0 1px #000000); }
${tilePieces}
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${armour(0.1)} !important; box-shadow: 0 0 0 1px ${gold}, 0 0 20px -4px ${alpha(gold, 0.8)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { color: ${ivory} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 10px ${alpha(t.bg, 0.9)} !important; }

/* Buttons: white armour plates with a gold band. */
${SEL.button} { background: ${plate} !important; border-color: ${goldDeep} !important; color: ${t.bg} !important; border-radius: 2px !important; box-shadow: inset 0 -2px 0 ${gold}, inset 0 1px 0 #ffffff, 0 2px 5px -2px #000000 !important; }
${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: ${plate} !important; border-color: ${goldDeep} !important; color: ${t.bg} !important; border-radius: 2px !important; box-shadow: inset 0 -2px 0 ${gold}, inset 0 1px 0 #ffffff, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, #ffffff, ${mix(ivory, gold, 0.35)}) !important; border-color: ${gold} !important; box-shadow: inset 0 -2px 0 ${gold}, 0 0 10px -2px ${alpha(gold, 0.9)} !important; }
${SEL.buttonDown} { background: ${plateShade} !important; border-color: ${gold} !important; box-shadow: inset 0 2px 4px ${alpha('#000000', 0.5)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.bg, t.muted, 0.5)} !important; }

/* Pop-ups: the board under armour plating; winged king as the crest. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 60% at 50% 0%, ${alpha(gold, 0.16)}, transparent 70%), var(--dbtc-u11) 0 0 / 48px 48px, linear-gradient(180deg, ${t.surface}, ${t.bg}) !important; border-radius: 3px !important; box-shadow: 0 0 0 2px ${ivory}, 0 0 0 4px ${gold}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(18)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 80px); top: -38px; right: auto; bottom: auto; width: 160px; height: 60px; pointer-events: none; z-index: 1; background: var(--dbtc-u2) center / contain no-repeat; filter: drop-shadow(0 3px 3px #000000); transform: none; }
${SEL.dialogTitle} { color: ${ivory} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 14px ${alpha(gold, 0.45)} !important; }

/* Chat: an ivory plate header with a gold band; the board below. */
${SEL.chatTop} { background: ${plate} !important; box-shadow: inset 0 -3px 0 ${gold}, inset 0 -4px 0 ${goldDeep} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.bg} !important; text-shadow: none !important; }
${SEL.chat} { background: linear-gradient(180deg, ${alpha(t.surface, 0.9)}, ${alpha(t.bg, 0.95)}), var(--dbtc-u11) 0 0 / 48px 48px !important; box-shadow: inset 2px 0 0 ${ivory}, inset -2px 0 0 ${ivory}, inset 0 -2px 0 ${ivory} !important; }

/* Duel: plated life bars with a king at the end; checkered phase discs. */
${SEL.life} { border-color: ${ivory} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${gold}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 3px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 50%), linear-gradient(90deg, ${pearl}, #ffffff) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -14px; top: 1px; width: 18px; height: 28px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${on(sel(['#duel #lifepoints2']), 'before')} { background-image: var(--dbtc-u6); }
${sel(['#duel .lifepoints .life_txt'])} { color: ${ivory} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 225deg, #ffffff, ${pearl}, ${ivory}, ${plateShade}, #ffffff) !important; box-shadow: 0 0 0 1px ${gold}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${t.bg} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u7) center / 100% 100%, radial-gradient(circle, ${t.raised} 40%, ${t.surface}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u7) center / 100% 100%, radial-gradient(circle, #ffffff 30%, ${pearl}) !important; box-shadow: 0 0 14px ${alpha(gold, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u7) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.2)} 30%, ${mix(t.opp, t.bg, 0.4)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${pearl} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span'])} { color: ${t.bg} !important; text-shadow: none !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${gold}, ${goldDeep}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${plate} !important; }
${sel(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span'])} { color: ${t.bg} !important; text-shadow: none !important; }
${sel(['#duel .cout_txt'])} { background: linear-gradient(180deg, ${alpha(t.surface, 0.88)}, ${alpha(t.bg, 0.92)}), var(--dbtc-u11) 0 0 / 48px 48px !important; box-shadow: inset 0 0 0 2px ${ivory}, inset 0 0 0 4px ${gold} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${ivory}, 0 0 0 4px ${gold}, 0 6px 16px -6px #000000 !important; }

/* Duel room: ivory rings around board panels. */
${lobbyBorders} { background: linear-gradient(180deg, ${alpha(t.surface, 0.7)}, ${alpha(t.bg, 0.85)}), var(--dbtc-u11) 0 0 / 48px 48px !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, #ffffff, ${pearl} 35%, ${gold} 50%, ${pearl} 65%, #ffffff) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(16)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${t.surface} !important; box-shadow: 0 0 0 0.35em ${t.surface} !important; border-radius: 4px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.14)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.35)}, ${alpha(ivory, 0.08)}) !important; }

/* Deck constructor: the board itself. */
${deckPanels} { background: linear-gradient(180deg, ${alpha(t.surface, 0.72)}, ${alpha(t.bg, 0.85)}), var(--dbtc-u11) 0 0 / 48px 48px !important; box-shadow: inset 0 0 0 2px ${ivory}, inset 0 0 0 3px ${gold} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels. */
${settingsPanels} { border-color: ${ivory} !important; background: linear-gradient(180deg, ${alpha(t.surface, 0.8)}, ${alpha(t.bg, 0.9)}), var(--dbtc-u11) 0 0 / 48px 48px !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: ivory with a gold underglow. */
${titles} { color: ${ivory} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 1px 0 ${t.bg}, 0 0 3px ${t.bg}, 0 0 16px ${alpha(gold, 0.45)} !important; }

/* Text fields: dark squares with an ivory edge. */
${SEL.field} { background-color: ${t.bg} !important; border-color: ${pearl} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(gold, 0.35)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(gold, 0.6)} !important; }

/* Scrollbars: ivory rods banded in gold. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${pearl}, #ffffff, ${pearl}) !important; box-shadow: inset 0 -3px 0 ${gold}, inset 0 3px 0 ${gold}; border-radius: 1px !important; }

/* Pop-up buttons in the theme material. */
${popCss(popPrimary, popSecondary)}
/* Player name strips: dark plate, ivory name. */
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { background: linear-gradient(160deg, ${t.raised}, ${t.bg}) !important; }
${sel(['#duel .duel_avatar .username_txt'])} { color: ${ivory} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel #lifepoints1 .life_txt'])} { color: ${t.bg} !important; text-shadow: 0 0 2px ${ivory}, 0 0 4px ${ivory}, 0 0 8px ${ivory} !important; }
`;
};
