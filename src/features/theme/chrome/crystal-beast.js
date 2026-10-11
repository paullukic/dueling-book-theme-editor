// crystal-beast: the seven Crystal Beast gems. Amethyst-night glass cut with
// facet bevels and held at the corners by gold claw prongs; every menu tile
// carries one of the seven gems (ruby, amber, topaz, emerald, cobalt,
// sapphire, amethyst) in turn; the pop-up crest is all seven set in an arc on
// a sandstone lintel of the Rainbow Ruins; life bars are prism-cut and
// capped with a set gem; phases are brilliant-cut discs. (t, kit) -> CSS string.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha, n1 }) => {
  const gold = t.accent2;
  const goldHi = mix(gold, '#ffffff', 0.45);
  const goldDk = mix(gold, '#000000', 0.5);
  const amethyst = t.accent;
  const glass = mix(t.surface, t.accent, 0.08);
  const glassHi = mix(t.raised, t.accent, 0.16);
  const night = mix(t.bg, '#000000', 0.3);
  const stone = mix(t.warning, t.muted, 0.55);
  const gems = [t.danger, mix(t.warning, t.danger, 0.45), t.warning, t.success, t.opp, t.link, t.accent];

  // A side-view brilliant cut gem in a gold cup, centred at (x, y), half-width w.
  const gem = (x, y, w, c) => {
    const h1 = w * 0.5;
    const h2 = w;
    const p = (v) => n1(v);
    return `<path d="M${p(x - w * 0.8)} ${p(y + h1 * 0.9)}Q${x} ${p(y + h2 + w * 0.5)} ${p(x + w * 0.8)} ${p(y + h1 * 0.9)}" fill="none" stroke="${gold}" stroke-width="${p(w * 0.22)}"/><path d="M${p(x - w)} ${y}L${x} ${p(y + h2)}L${p(x + w)} ${y}Z" fill="${mix(c, '#000000', 0.4)}"/><path d="M${p(x - w)} ${y}L${x} ${p(y + h2)}L${p(x - w * 0.2)} ${y}Z" fill="${c}"/><path d="M${p(x - w)} ${y}L${p(x - w * 0.55)} ${p(y - h1)}H${p(x + w * 0.55)}L${p(x + w)} ${y}Z" fill="${c}"/><path d="M${p(x - w * 0.55)} ${p(y - h1)}L${p(x - w * 0.2)} ${y}H${p(x + w * 0.2)}L${p(x + w * 0.55)} ${p(y - h1)}Z" fill="${mix(c, '#ffffff', 0.55)}"/><path d="M${p(x - w)} ${y}L${p(x - w * 0.55)} ${p(y - h1)}H${p(x + w * 0.55)}L${p(x + w)} ${y}L${x} ${p(y + h2)}Z" fill="none" stroke="${mix(c, '#ffffff', 0.7)}" stroke-width="${p(Math.max(0.6, w * 0.06))}" stroke-linejoin="round"/>`;
  };

  // Faint facet lattice.
  const facets = svg(48, 48, `<path d="M24 2L46 24L24 46L2 24ZM24 2V46M2 24H46" fill="none" stroke="${t.text}" stroke-opacity="0.035"/>`);

  // Nine-slice frame: a gold rim with facet-cut corners held by claw prongs.
  const prong = `<path d="M2 2L16 4L10 10L4 16Z" fill="${gold}" stroke="${goldDk}" stroke-width="0.8"/><path d="M3 3L14 5L9 9Z" fill="${goldHi}"/>`;
  const frameSvg = svg(60, 60, `<path d="M10 1H50L59 10V50L50 59H10L1 50V10Z" fill="none" stroke="${gold}" stroke-width="1.6"/><path d="M12 5H48L55 12V48L48 55H12L5 48V12Z" fill="none" stroke="${amethyst}" stroke-opacity="0.55" stroke-width="0.9"/><path d="M5 12L12 5M48 5L55 12M55 48L48 55M12 55L5 48" stroke="${t.text}" stroke-opacity="0.4" stroke-width="0.8"/>${prong}<g transform="matrix(-1 0 0 1 60 0)">${prong}</g><g transform="matrix(1 0 0 -1 0 60)">${prong}</g><g transform="matrix(-1 0 0 -1 60 60)">${prong}</g>`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Seven tile crests, one gem each.
  const crests = gems.map((c) => svg(40, 30, `<path d="M6 26H34L30 30H10Z" fill="${stone}" stroke="${mix(stone, t.bg, 0.5)}" stroke-width="0.8"/>${gem(20, 10, 11, c)}`));

  // Pop-up crest: the seven gems on an arc over a sandstone lintel.
  let arc = '';
  gems.forEach((c, i) => {
    const a = Math.PI + (Math.PI * (i + 0.5)) / 7;
    arc += gem(n1(80 + Math.cos(a) * 60), n1(46 + Math.sin(a) * 34), 10.5, c);
  });
  const gable = svg(160, 60, `<path d="M18 48H142L136 58H24Z" fill="${stone}" stroke="${mix(stone, t.bg, 0.55)}" stroke-width="1.2"/><path d="M22 50H138" stroke="#ffffff" stroke-opacity="0.35"/><path d="M18 48A62 40 0 0 1 142 48" fill="none" stroke="${gold}" stroke-opacity="0.6" stroke-width="1.5"/>${arc}`);

  // Life bar finial: a gem in a gold claw setting.
  const finial = svg(18, 42, `<path d="M9 2V40" stroke="${gold}" stroke-width="2.4"/><path d="M4 36H14L12 41H6Z" fill="${gold}"/>${gem(9, 16, 7.5, amethyst)}`);

  // Phase overlay: brilliant-cut facet lines.
  let cuts = '';
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI / 4) * i + Math.PI / 8;
    const b = a + Math.PI / 4;
    cuts += `M${n1(22.5 + Math.cos(a) * 20.5)} ${n1(22.5 + Math.sin(a) * 20.5)}L${n1(22.5 + Math.cos(b) * 20.5)} ${n1(22.5 + Math.sin(b) * 20.5)}L${n1(22.5 + Math.cos(b - Math.PI / 8) * 11)} ${n1(22.5 + Math.sin(b - Math.PI / 8) * 11)}Z`;
  }
  const brilliant = svg(45, 45, `<path d="${cuts}" fill="none" stroke="${t.text}" stroke-opacity="0.35" stroke-width="0.9" stroke-linejoin="round"/>`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${night}, 0 0 8px ${night} !important;`;
  const glassBg = (lift = 0) => `linear-gradient(160deg, ${alpha('#ffffff', 0.09 + lift * 0.3)}, transparent 38%), radial-gradient(ellipse 80% 100% at 50% 0%, ${alpha(amethyst, 0.14 + lift)}, transparent 70%), var(--dbtc-u1), linear-gradient(180deg, ${glassHi}, ${glass})`;

  // Pop-up buttons: a cut amethyst (primary) and night glass (secondary), gold set.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="M22 10H${n1(w - 22)}L${n1(w - 6)} 26V52.5L${n1(w - 22)} 68.5H22L6 52.5V26Z" fill="url(#g)" stroke="${gold}" stroke-width="2.6"/><path d="M22 10L32 20H${n1(w - 32)}L${n1(w - 22)} 10M6 26L16 30V49L6 52.5M${n1(w - 6)} 26L${n1(w - 16)} 30V49L${n1(w - 6)} 52.5" fill="none" stroke="#ffffff" stroke-opacity="${c.cut}" stroke-width="1.2"/><text x="${n1(w / 2)}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="800" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: mix(amethyst, '#ffffff', 0.4), bot: mix(amethyst, t.bg, 0.15), cut: 0.7, text: t.accentText, shadow: alpha(amethyst, 0.45) };
  const popSecondary = { top: glassHi, bot: night, cut: 0.3, text: t.text, shadow: alpha('#000000', 0.7) };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 5px ${c.shadow}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  // Prism-cut life bar: facet bands over the side colour.
  const prism = (c) => `linear-gradient(180deg, ${alpha('#ffffff', 0.45)}, ${alpha('#ffffff', 0.12)} 40%, transparent 41%, transparent 70%, ${alpha(night, 0.35)}), linear-gradient(105deg, transparent 8%, ${alpha(gems[0], 0.22)} 14%, ${alpha(gems[2], 0.22)} 20%, ${alpha(gems[3], 0.22)} 26%, ${alpha(gems[4], 0.22)} 32%, ${alpha(gems[6], 0.22)} 38%, transparent 46%), linear-gradient(90deg, ${mix(c, t.bg, 0.5)}, ${c} 55%, ${mix(c, t.bg, 0.2)})`;
  const capGem = svg(36, 36, `<path d="M10 2H26L34 10V26L26 34H10L2 26V10Z" fill="${goldDk}" stroke="${gold}" stroke-width="1.6"/><path d="M12 6H24L30 12V24L24 30H12L6 24V12Z" fill="${amethyst}"/><path d="M12 6L18 18L6 12ZM24 6L18 18L30 12Z" fill="${mix(amethyst, '#ffffff', 0.5)}"/><path d="M6 24L18 18L12 30ZM30 24L18 18L24 30Z" fill="${mix(amethyst, '#000000', 0.35)}"/><path d="M14 13H22L24 18L22 23H14L12 18Z" fill="${mix(amethyst, '#ffffff', 0.25)}" stroke="${mix(amethyst, '#ffffff', 0.7)}" stroke-width="0.7"/><path d="M12 6H24L30 12V24L24 30H12L6 24V12Z" fill="none" stroke="${mix(amethyst, '#ffffff', 0.7)}" stroke-width="0.7"/><path d="M15 15L18 14" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"/>`);
  const vars = [frameSvg, facets, gable, finial, brilliant, ...crests, capGem].map((s, i) => `--dbtc-u${i}: ${svgUrl(s)};`).join(' ');
  const tileCrest = (k) => `${on(sel([`#main_menu .menu_btn:nth-child(7n+${k + 1}) .content`]), 'before')} { background-image: var(--dbtc-u${5 + k}); }`;

  return `
html body { ${vars} }
/* Menu tiles: amethyst-night glass in a gold claw setting, one of the seven gems on each. */
${SEL.tile} { background: ${glassBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 15px stretch !important; border-radius: 0 !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.18)}, inset 0 -12px 18px -10px ${night}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 20px); top: -16px; width: 40px; height: 30px; pointer-events: none; background: var(--dbtc-u11) center / contain no-repeat; filter: drop-shadow(0 2px 3px ${night}); }
${[0, 1, 2, 3, 4, 5, 6].map(tileCrest).join('\n')}
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${glassBg(0.14)} !important; box-shadow: inset 0 0 0 1px ${alpha(amethyst, 0.6)}, inset 0 0 22px ${alpha(amethyst, 0.2)}, 0 0 18px -4px ${alpha(amethyst, 0.75)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: cut glass, a lit upper facet, a gold foot. */
${SEL.button} { background: linear-gradient(160deg, ${alpha('#ffffff', 0.12)}, transparent 45%), var(--dbtc-u1), linear-gradient(180deg, ${glassHi}, ${glass}) !important; border-color: ${mix(gold, t.bg, 0.35)} !important; color: ${t.text} !important; border-radius: 3px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.3)}, inset 0 -2px 0 ${alpha(gold, 0.6)}, 0 2px 6px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(160deg, ${alpha('#ffffff', 0.2)}, transparent 45%), linear-gradient(180deg, ${mix(glassHi, amethyst, 0.3)}, ${glass}) !important; border-color: ${gold} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.45)}, inset 0 -2px 0 ${gold}, 0 0 12px -2px ${alpha(amethyst, 0.75)} !important; }
${SEL.buttonDown} { background: ${night} !important; border-color: ${amethyst} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a glass casket in a gold setting under the seven gems on a ruin lintel. */
${SEL.dialog} { background: linear-gradient(160deg, ${alpha('#ffffff', 0.07)}, transparent 40%), radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(amethyst, 0.18)}, transparent 70%), var(--dbtc-u1), linear-gradient(180deg, ${glassHi}, ${night}) !important; border-radius: 4px !important; box-shadow: 0 0 0 1px ${gold}, 0 0 0 4px ${night}, 0 0 0 5px ${alpha(amethyst, 0.6)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 100px); top: -60px; right: auto; bottom: auto; width: 200px; height: 75px; pointer-events: none; z-index: 1; background: var(--dbtc-u2) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 4px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a glass header ruled in gold with a seven-gem prism line. */
${SEL.chatTop} { background: linear-gradient(90deg, ${gems.map((c, i) => `${c} ${n1((i * 100) / 7)}% ${n1(((i + 1) * 100) / 7)}%`).join(', ')}) left bottom / 100% 2px no-repeat, var(--dbtc-u1), linear-gradient(180deg, ${glassHi}, ${glass}) !important; box-shadow: inset 0 -3px 0 ${night}, inset 0 1px 0 ${alpha('#ffffff', 0.25)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u1), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${goldDk}, inset -1px 0 0 ${goldDk}, inset 0 -1px 0 ${goldDk} !important; }

/* Duel: prism-cut life bars capped with a set gem; brilliant-cut phases. */
${SEL.life} { border-color: ${gold} !important; border-image: linear-gradient(90deg, ${gems.join(', ')}) 1 !important; border-radius: 0 !important; box-shadow: 0 0 0 2px ${goldDk}, 0 0 0 3px ${gold}, 0 0 0 4px ${night}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: ${prism(t.self)} !important; }
${SEL.lifeOpp} { background: ${prism(t.opp)} !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -20px; top: -3px; width: 34px; height: 34px; z-index: 2; pointer-events: none; background: var(--dbtc-u${5 + gems.length}) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
html body:has(#duel:not([style*="none"])) .dbtefx-cb-bow { opacity: 0.4; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 0deg, ${gems.join(', ')}, ${gems[0]}) !important; box-shadow: 0 0 0 1px ${night}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${night} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${glassHi} 35%, ${night}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.35)} 15%, ${t.self} 45%, ${mix(t.self, t.bg, 0.55)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.35)} 15%, ${t.opp} 45%, ${mix(t.opp, t.bg, 0.55)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u1), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 3px 0 0 ${amethyst}, inset 0 0 0 1px ${goldDk} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${gold}, 0 0 0 4px ${night}, 0 0 0 5px ${alpha(amethyst, 0.7)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${goldHi}, ${goldDk}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u1), linear-gradient(180deg, ${glassHi}, ${night}) !important; }

/* Duel room: gold claw settings around glass panels. */
${lobbyBorders} { background: var(--dbtc-u1), linear-gradient(180deg, ${alpha(glassHi, 0.75)}, ${alpha(t.bg, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${goldHi}, ${goldDk} 30%, ${amethyst} 55%, ${goldDk} 80%, ${goldHi}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(18)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${night} !important; box-shadow: 0 0 0 0.35em ${night} !important; border-radius: 2px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(amethyst, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(amethyst, 0.4)}, ${alpha(gold, 0.1)}) !important; }

/* Deck constructor: glass trays with a gold lip. */
${deckPanels} { background: var(--dbtc-u1), linear-gradient(180deg, ${mix(glassHi, t.surface, 0.5)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${goldDk}, inset 0 0 0 3px ${alpha(night, 0.9)}, inset 0 0 0 4px ${alpha(amethyst, 0.45)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }

/* Settings panels: the same claw setting. */
${SEL.settingsPanel} { border-color: ${goldDk} !important; background: var(--dbtc-u1), linear-gradient(180deg, ${alpha(glassHi, 0.85)}, ${alpha(t.bg, 0.88)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: pale crystal with an amethyst glow. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${goldDk}, 0 0 16px ${alpha(amethyst, 0.6)} !important; }

/* Text fields: dark wells with a gold lip, amethyst focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${goldDk} !important; box-shadow: inset 0 2px 4px ${night}, 0 1px 0 ${alpha(gold, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${amethyst} !important; box-shadow: inset 0 2px 4px ${night}, 0 0 8px ${alpha(amethyst, 0.6)} !important; }

/* Scrollbars: a prism rod. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${gems.join(', ')}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
