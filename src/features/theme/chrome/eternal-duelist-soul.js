// eternal-duelist-soul: the Game Boy Advance game's interface. Windows are
// navy panels with a hard pixel bevel (light blue top-left, deep navy
// bottom-right, an ink outline); the selection is the flashing orange
// bracket frame; LP sits in mint panels; titles are the big orange
// lettering with a hard navy outline (the game's ATTACK! banner); pop-up
// buttons are bevelled mint / blue keys in pixel type. Bright, flat colours,
// no blur.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';
import { pxText, textWidth } from '../scenes/pixel-kit.js';
import { PIXEL_DIGITS } from './pixel-font.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const navy = t.surface;
  const ink = mix(t.bg, '#000000', 0.5);
  const hi = mix(t.border, '#ffffff', 0.35);
  const lo = mix(t.surface, t.bg, 0.6);
  const mint = t.accent2;
  const mintHi = mix(mint, '#ffffff', 0.5);
  const mintLo = mix(mint, t.bg, 0.45);
  const orange = t.accent;
  const blue = t.raised;
  // Your LP fill: a deeper mint than the numeral plate, so the two read apart.
  const fill = mix(mint, '#0a8a50', 0.5);

  const crisp = (w, h, body) => svg(w, h, `<g shape-rendering="crispEdges">${body}</g>`);
  // Pixel bevel frame (12px art, 4px slice): ink outline, light top-left, dark bottom-right.
  const bevelSvg = (light, dark) => crisp(12, 12, `<path d="M1 0h10v1h1v10h-1v1H1v-1H0V1h1z" fill="${ink}"/><path d="M1 1h10v1H2v9H1z" fill="${light}"/><path d="M11 1v10H1v-1h9V1z" fill="${dark}"/><path d="M2 2h8v1H3v7H2z" fill="${mix(light, dark, 0.5)}"/>`);
  const frame = (px = 9) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 4 / ${px}px stretch; box-sizing: border-box;`;
  // The orange selection brackets (16px art, 6px slice).
  const brackets = crisp(16, 16, `<path d="M0 0h6v2H2v4H0zM16 0v6h-2V2h-4V0zM0 16v-6h2v4h4v2zM16 16h-6v-2h4v-4h2z" fill="${orange}"/><path d="M1 1h4v0.6H1.6V5H1zM15 1v4h-0.6V1.6H11V1z" fill="${mix(orange, '#ffffff', 0.5)}"/>`);
  // LP tag in pixel type on mint.
  const lpTag = crisp(17, 11, `<path d="M0 0h17v11H0z" fill="${ink}"/><path d="M1 1h15v9H1z" fill="${mint}"/><path d="${pxText('LP', 3, 2, 1, true)}" fill="${navy}"/>`);

  const label = `color: #ffffff !important; text-shadow: 2px 2px 0 ${ink} !important;`;
  const panel = (fill = navy) => `background: linear-gradient(180deg, ${alpha('#ffffff', 0.08)} 0 3px, transparent 3px), ${fill} !important;`;
  const outline = (c, w = 3) => `${w}px 0 0 ${c}, -${w}px 0 0 ${c}, 0 ${w}px 0 ${c}, 0 -${w}px 0 ${c}, ${w}px ${w}px 0 ${c}, -${w}px -${w}px 0 ${c}, ${w}px -${w}px 0 ${c}, -${w}px ${w}px 0 ${c}`;
  const keyBevel = (light, dark) => `box-shadow: inset 2px 2px 0 ${light}, inset -2px -2px 0 ${dark}, 0 0 0 2px ${ink} !important;`;

  // Pop-up buttons: bevelled keys in pixel type; OK/Yes mint with navy, No/Cancel blue with white.
  const popBtn = (text, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    const p = 4;
    const tw = textWidth(text, p, true);
    const [fill, light, dark, fg] = primary ? [mint, mintHi, mintLo, navy] : [blue, hi, ink, '#ffffff'];
    const x = 8;
    const y = 10;
    const bw = w - 16;
    const bh = h - 20;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${ink}"/><rect x="${x + p}" y="${y + p}" width="${bw - 2 * p}" height="${bh - 2 * p}" fill="${dark}"/><rect x="${x + p}" y="${y + p}" width="${bw - 3 * p}" height="${bh - 3 * p}" fill="${light}"/><rect x="${x + 2 * p}" y="${y + 2 * p}" width="${bw - 4 * p}" height="${bh - 4 * p}" fill="${fill}"/><path d="${pxText(text, (w - tw) / 2 + 2, (h - 7 * p) / 2 + 2, p, true)}" fill="${primary ? mintLo : ink}"/><path d="${pxText(text, (w - tw) / 2, (h - 7 * p) / 2, p, true)}" fill="${fg}"/></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = [['ok_btn', 'OK', true, false], ['yes_btn', 'YES', true, false], ['no_btn', 'NO', false, false], ['cancel_btn', 'CANCEL', false, true]]
    .map(([n, text, primary, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, primary))} !important; filter: none !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const lpAt = (state, part) => ['#lifepoints1', '#lifepoints2'].map((id) => `html:not([data-dbte-lpstyle]) body #duel ${id}.lifepoints${state} ${part}`).join(', ');
  const u = [svgUrl(bevelSvg(hi, lo)), svgUrl(brackets), svgUrl(lpTag)];
  return `
@font-face { font-family: "DBTE Pixel"; src: url(${PIXEL_DIGITS}) format("woff"); }
html body { ${u.map((v, i) => `--dbtc-u${i}: ${v};`).join(' ')} }
/* Menu tiles: navy windows with the pixel bevel; the hovered one flashes the orange selection brackets. */
${SEL.tile} { ${panel()} border-style: solid !important; border-image: var(--dbtc-u0) 4 / 9px stretch !important; border-radius: 0 !important; box-shadow: 4px 4px 0 ${alpha(ink, 0.7)} !important; image-rendering: pixelated; }
${SEL.tileHover} { ${panel(mix(navy, blue, 0.6))} box-shadow: 4px 4px 0 ${alpha(ink, 0.7)}, 0 0 0 2px ${orange} !important; }
${on(SEL.tileHover, 'before')} { content: ""; position: absolute; left: -9px; top: -9px; right: -9px; bottom: -9px; pointer-events: none; border-style: solid; border-color: transparent; border-width: 18px; border-image: var(--dbtc-u1) 6 / 18px stretch; image-rendering: pixelated; animation: dbtc-eds-flash 0.6s steps(1, end) infinite; }
${SEL.tileLabel} { ${label} }

/* Buttons: blue bevelled keys; orange on hover. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: ${blue} !important; border-color: ${ink} !important; color: #ffffff !important; border-radius: 0 !important; ${keyBevel(hi, ink)} text-shadow: 1px 1px 0 ${ink} !important; }
${SEL.buttonHover} { background: ${orange} !important; color: ${t.accentText} !important; ${keyBevel(mix(orange, '#ffffff', 0.5), mix(orange, t.bg, 0.5))} text-shadow: none !important; }
${SEL.buttonDown} { background: ${mix(orange, t.bg, 0.4)} !important; ${keyBevel(mix(orange, t.bg, 0.6), mix(orange, '#ffffff', 0.3))} }
${SEL.submit} { background: ${blue} !important; border: 2px solid ${ink} !important; color: #ffffff !important; border-radius: 0 !important; }

/* Pop-ups: a navy window in the pixel bevel, the title on a mint bar. */
${SEL.dialog} { ${panel()} border-radius: 0 !important; box-shadow: 0 0 0 3px ${ink}, 8px 8px 0 3px ${alpha(ink, 0.6)} !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(12)} background: none; transform: none; }
${SEL.dialogTitle} { color: ${navy} !important; background: ${mint} !important; box-shadow: 0 0 0 .3em ${mint}, 0 0 0 calc(.3em + 3px) ${ink} !important; text-shadow: 2px 2px 0 ${mintHi} !important; }

/* Chat: a mint title bar over a navy window. */
${SEL.chatTop} { background: ${mint} !important; box-shadow: inset 0 3px 0 ${mintHi}, inset 0 -3px 0 ${mintLo}, inset 0 -5px 0 ${ink} !important; }
${sel(['#chats .chat .chat_top_bg span'])} { color: ${navy} !important; text-shadow: 1px 1px 0 ${mintHi} !important; }
${SEL.chat} { ${panel()} box-shadow: inset 3px 0 0 ${hi}, inset -3px 0 0 ${lo}, inset 0 -3px 0 ${lo}, inset 0 0 0 5px ${ink} !important; }

/* Duel: LP bars in mint panels; bevelled phase keys, orange when active. */
${SEL.life} { border-color: ${ink} !important; border-radius: 0 !important; box-shadow: 0 0 0 3px ${mint}, 0 0 0 5px ${ink}, inset 0 2px 0 ${alpha('#ffffff', 0.3)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 0 !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.25)} 0 3px, transparent 3px), ${mintLo} !important; }
${SEL.lifeSelf} { background: linear-gradient(0deg, ${mix(fill, ink, 0.35)} 0 4px, ${ink} 4px 6px, transparent 6px), linear-gradient(180deg, ${mix(fill, '#ffffff', 0.4)} 0 3px, transparent 3px), ${fill} !important; }
${SEL.lifeOpp} { background: linear-gradient(0deg, ${mix(t.opp, ink, 0.2)} 0 4px, ${ink} 4px 6px, transparent 6px), linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.6)} 0 3px, transparent 3px), ${mix(t.opp, '#ffffff', 0.3)} !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -40px; top: 1px; width: 34px; height: 22px; pointer-events: none; background: var(--dbtc-u2) center / contain no-repeat; image-rendering: pixelated; }
${sel(['#duel #lifepoints1 .life_txt', '#duel #lifepoints2 .life_txt'])} { font-family: "DBTE Pixel", "Lucida Console", monospace !important; font-weight: 400 !important; color: ${navy} !important; -webkit-text-fill-color: currentColor !important; text-shadow: none !important; }
/* Our counters sit on their own plate: no extra ink blur behind the number. */
/* The number sits on a solid mint plate with a navy rule, like the LP panels in the game; low keeps
   the plate and turns the rule red. The plate hides the bar's right end, so in low the life left is a
   red stub just left of the plate, scaled to the visible part of the track, over the dark red track. */
${lpAt('', '.life_txt')} { isolation: isolate; }
${lpAt('', '.life_txt::before')} { content: ""; position: absolute; left: -6px; right: -4px; top: 1px; bottom: 1px; z-index: -1; pointer-events: none; background: linear-gradient(180deg, ${mintHi} 0 2px, ${mint} 2px); box-shadow: 0 0 0 2px ${ink}; }
${lpAt(':is([data-dbte-lp~="low"], [data-dbte-lp~="zero"])', '.life_txt::before')} { box-shadow: 0 0 0 2px ${t.danger}; }
${lpAt(':is([data-dbte-lp~="low"], [data-dbte-lp~="zero"])', '.life_txt')} { color: ${navy} !important; text-shadow: none !important; }
${lpAt(':is([data-dbte-lp~="low"], [data-dbte-lp~="zero"])', '.life_bar')} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)} 0 3px, ${mix(t.danger, '#000000', 0.22)} 3px) right 86px top 0 / max(4px, calc(var(--dbte-lp, 1) * (100% - 86px))) 100% no-repeat, repeating-linear-gradient(135deg, ${alpha(t.danger, 0.18)} 0 1.5px, transparent 1.5px 7px), ${mix(t.danger, '#000000', 0.84)} !important; }
${lpAt(':is([data-dbte-lp~="low"], [data-dbte-lp~="zero"])', '.black_bar')} { background: none !important; }
${sel(['#duel .lifepoints'])} { --lp-hit: ${t.danger}; --lp-heal: ${t.success}; }
${SEL.phase} { background: ${ink} !important; border-radius: 0 !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) .background', '#duel .phase.active:has(.phase_inner.blue) .background'])} { background: ${ink} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${ink} !important; border-radius: 0 !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${blue} !important; border-radius: 0 !important; box-shadow: inset 3px 3px 0 ${hi}, inset -3px -3px 0 ${ink} !important; }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: ${orange} !important; box-shadow: inset 3px 3px 0 ${mix(orange, '#ffffff', 0.5)}, inset -3px -3px 0 ${mix(orange, t.bg, 0.5)} !important; }
${sel(['#duel .phase span'])} { color: #ffffff !important; text-shadow: 2px 2px 0 ${ink} !important; }
${sel(['#duel .phase.active span'])} { color: ${t.accentText} !important; text-shadow: 1px 1px 0 ${mix(orange, '#ffffff', 0.5)} !important; }
${SEL.duelLog} { ${panel()} box-shadow: inset 3px 3px 0 ${hi}, inset -3px -3px 0 ${lo}, inset 0 0 0 5px ${ink} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { border-radius: 0 !important; box-shadow: 0 0 0 3px ${hi}, 0 0 0 6px ${ink} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${ink} !important; border-radius: 0 !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${orange} !important; border-radius: 0 !important; }
${sel(['#duel #turn .red', '#duel #turn .blue', '#duel #start_turn .red', '#duel #start_turn .blue', '#duel #end_turn .red', '#duel #end_turn .blue'])} { background: ${orange} !important; filter: none !important; border-radius: 0 !important; }
${sel(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span'])} { color: #ffffff !important; text-shadow: ${outline(ink, 2)} !important; }

/* Duel room: navy windows in the pixel bevel; titles on mint bars. */
${lobbyBorders} { ${panel()} box-shadow: 4px 4px 0 ${alpha(ink, 0.6)}; }
${on(lobbyBorders, 'before')} { background: ${ink} !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(9)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${navy} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${navy} !important; box-shadow: 0 0 0 .35em ${navy} !important; border-radius: 0 !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${blue} !important; box-shadow: inset 2px 2px 0 ${hi}, inset -2px -2px 0 ${ink} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${mix(orange, blue, 0.45)} !important; }
${sel(['#duel_room #yu'])} { filter: none !important; }

/* Deck constructor. */
${deckPanels} { ${panel()} box-shadow: inset 3px 3px 0 ${hi}, inset -3px -3px 0 ${lo}, inset 0 0 0 5px ${ink} !important; }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${ink} !important; ${panel()} border-radius: 0 !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(9)} }

/* Titles: the big orange lettering with a hard navy outline. */
${titles} { color: ${orange} !important; text-shadow: ${outline(ink, 3)}, 5px 5px 0 ${ink} !important; }

/* Text fields: deep navy wells with a light-blue rule. */
${SEL.field} { background-color: ${ink} !important; border-color: ${hi} !important; border-radius: 0 !important; color: #ffffff !important; box-shadow: inset 2px 2px 0 ${alpha('#000000', 0.5)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 2px solid ${orange} !important; }

/* Scrollbars: a light-blue block. */
${sel(['#content .os-scrollbar-handle'])} { background: ${hi} !important; border-radius: 0 !important; box-shadow: inset -2px -2px 0 ${lo} !important; }

/* Pop-up buttons. */
${popCss}

html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-eds-board { display: none; }
@keyframes dbtc-eds-flash { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
@media (prefers-reduced-motion: reduce) { ${on(SEL.tileHover, 'before')} { animation: none; } }
`;
};
