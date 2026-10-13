// naruto: a shinobi's kit. Every panel is an unrolled ninja scroll of dark
// washi between lacquered wooden rollers; crests are forged steel headband
// plates engraved with a single kunai; buttons are paper seal tags; a kunai leads
// the life bars and shuriken sit on the phases. (t, kit) -> CSS string.
import { mix, deepForWhite } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const ink = mix(t.bg, '#000000', 0.5);
  const paper = mix(t.surface, t.text, 0.05);
  const paperDeep = mix(t.bg, t.surface, 0.4);
  const steel = mix(t.muted, t.text, 0.35);
  const steelDim = mix(t.muted, t.bg, 0.5);
  const wood = mix(mix(t.accent, t.danger, 0.4), t.bg, 0.6);
  const cloth = mix(t.bg, t.accent2, 0.28);
  const seal = t.accent;

  // Washi: short paper fibres, faint.
  let fibres = '';
  [[8, 12, 22, 1], [70, 6, 14, -1], [110, 30, 26, 0.5], [22, 58, 18, -0.6], [96, 86, 12, 1.2], [12, 104, 24, 0.4], [60, 118, 16, -1], [48, 40, 10, 0.8], [118, 66, 9, -0.5]].forEach(([x, y, l, d]) => {
    fibres += `M${x} ${y}l${l} ${d}`;
  });
  const washi = svg(130, 130, `<path d="${fibres}" fill="none" stroke="${t.text}" stroke-opacity="0.085" stroke-width="0.7"/><path d="M34 14l9 1.5M84 44l-11 2M4 88l13-1M102 108l10 1.8M40 76l7 -1.2M76 124l12 0.6" fill="none" stroke="${t.text}" stroke-opacity="0.06" stroke-width="1.1"/><g fill="${t.text}" fill-opacity="0.08"><circle cx="30" cy="24" r="0.8"/><circle cx="66" cy="54" r="0.7"/><circle cx="16" cy="64" r="0.6"/><circle cx="90" cy="20" r="0.7"/><circle cx="110" cy="96" r="0.9"/><circle cx="44" cy="100" r="0.6"/></g>`);

  // Nine-slice scroll frame: lacquered rollers on the left and right edges
  // with orange end caps, a double ink rule along the top and bottom.
  const roller = (x) => `<rect x="${x}" y="3" width="12" height="54" rx="3" fill="url(#w)" stroke="${ink}" stroke-width="0.8"/><rect x="${x - 1}" y="0.6" width="14" height="5" rx="1.8" fill="${seal}" stroke="${ink}" stroke-width="0.8"/><rect x="${x - 1}" y="54.4" width="14" height="5" rx="1.8" fill="${seal}" stroke="${ink}" stroke-width="0.8"/>`;
  const scrollFrame = svg(60, 60, `<defs><linearGradient id="w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mix(wood, t.bg, 0.4)}"/><stop offset="0.4" stop-color="${mix(wood, seal, 0.35)}"/><stop offset="1" stop-color="${mix(wood, t.bg, 0.5)}"/></linearGradient></defs><path d="M13 4.5H47M13 7.5H47M13 55.5H47M13 52.5H47" stroke="${steelDim}" stroke-width="0.9"/>${roller(1)}${roller(47)}`);
  const frame = (px = 14) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // One kunai engraved lengthwise into the steel plate, centred at cx cy, length l.
  const kunaiMark = (cx, cy, l) => {
    const x0 = cx - l / 2;
    const h = l * 0.11;
    return `<g fill="none" stroke="${ink}" stroke-linecap="round"><circle cx="${x0 + h}" cy="${cy}" r="${h}" stroke-width="${(h * 0.5).toFixed(2)}"/><path d="M${x0 + h * 2} ${cy}H${x0 + l * 0.48}" stroke-width="${(h * 0.9).toFixed(2)}" stroke-dasharray="${(h * 0.5).toFixed(2)} ${(h * 0.35).toFixed(2)}"/></g><path d="M${x0 + l * 0.46} ${cy}L${x0 + l * 0.6} ${cy - h * 1.5}L${x0 + l} ${cy}L${x0 + l * 0.6} ${cy + h * 1.5}Z" fill="${ink}"/><path d="M${x0 + l * 0.52} ${cy - h * 0.3}L${x0 + l * 0.9} ${cy - h * 0.1}" stroke="#ffffff" stroke-opacity="0.4" stroke-width="${(h * 0.3).toFixed(2)}"/>`;
  };
  const plate = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h * 0.18}" fill="url(#s)" stroke="${ink}" stroke-width="1.2"/><rect x="${x + 1.6}" y="${y + 1.6}" width="${w - 3.2}" height="${h - 3.2}" rx="${h * 0.14}" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="0.8"/><g fill="${steelDim}" stroke="${ink}" stroke-width="0.5">${[[x + 4.5, y + h / 2], [x + w - 4.5, y + h / 2]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="1.7"/>`).join('')}</g>${kunaiMark(x + w / 2, y + h / 2, w * 0.62)}`;
  const steelDefs = `<defs><linearGradient id="s" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="${mix(steel, '#ffffff', 0.35)}"/><stop offset="0.45" stop-color="${steel}"/><stop offset="0.55" stop-color="${mix(steel, t.bg, 0.25)}"/><stop offset="1" stop-color="${mix(steel, '#ffffff', 0.15)}"/></linearGradient></defs>`;
  const tilePlate = svg(72, 24, `${steelDefs}<rect x="0" y="7" width="72" height="10" fill="${cloth}"/><path d="M0 8H72M0 16H72" stroke="${ink}" stroke-opacity="0.5" stroke-width="0.6"/>${plate(16, 1, 40, 22)}`);
  const headband = svg(200, 52, `${steelDefs}<path d="M0 18H200V34H0Z" fill="${cloth}"/><path d="M0 19.5H200M0 32.5H200" stroke="${ink}" stroke-opacity="0.5"/><path d="M14 34L4 52M24 34L20 50M186 34L196 52M176 34L180 50" stroke="${cloth}" stroke-width="5" stroke-linecap="round"/>${plate(62, 4, 76, 44)}`);

  // Kunai leading the life bar: ring pommel, cord grip, leaf blade.
  const kunai = svg(16, 42, `<circle cx="8" cy="5" r="3.6" fill="none" stroke="${steel}" stroke-width="2"/><rect x="6" y="9" width="4" height="12" fill="${cloth}"/><path d="M6 11h4M6 14h4M6 17h4M6 20h4" stroke="${mix(t.text, cloth, 0.5)}" stroke-width="0.9"/><path d="M8 21L12.5 26L8 41L3.5 26Z" fill="url(#s)" stroke="${ink}" stroke-width="0.8"/><path d="M8 22.5V39" stroke="#ffffff" stroke-opacity="0.5" stroke-width="0.7"/>${steelDefs}`);

  // A shuriken rim on the phase discs: a thin steel ring with four blade
  // tips biting in from the edge, so the label in the middle stays clear.
  let points = '';
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 - Math.PI / 4;
    const p = (rad, da) => `${(22.5 + Math.cos(a + da) * rad).toFixed(2)} ${(22.5 + Math.sin(a + da) * rad).toFixed(2)}`;
    points += `M${p(21.6, -0.2)}L${p(16.4, 0.06)}L${p(21.6, 0.16)}Z`;
  }
  const shuriken = svg(45, 45, `<circle cx="22.5" cy="22.5" r="20.4" fill="none" stroke="${steel}" stroke-opacity="0.55" stroke-width="1"/><path d="${points}" fill="${steel}" fill-opacity="0.7" stroke="${ink}" stroke-opacity="0.7" stroke-width="0.6" stroke-linejoin="round"/>`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${ink}, 0 0 8px ${ink} !important;`;
  const paperBg = (lift = 0) => `radial-gradient(ellipse 80% 90% at 50% 0%, ${alpha(seal, 0.1 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${paper}, ${paperDeep})`;

  // Pop-up buttons: an orange seal tag (OK/Yes) and a charcoal tag (No/Cancel), ink-ruled.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="2" fill="url(#g)" stroke="${ink}" stroke-width="2.5"/><path d="M14 16H${w - 14}M14 62.5H${w - 14}" stroke="${c.rule}" stroke-width="1.6"/><path d="M14 19H${w - 14}M14 59.5H${w - 14}" stroke="${c.rule}" stroke-opacity="0.5" stroke-width="0.8"/><rect x="6" y="10" width="7" height="58.5" fill="${c.band}"/><rect x="${w - 13}" y="10" width="7" height="58.5" fill="${c.band}"/><text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="800" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: mix(seal, '#ffffff', 0.12), bot: mix(seal, t.danger, 0.25), rule: ink, band: mix(seal, ink, 0.45), text: t.accentText };
  const popSecondary = { top: mix(paper, t.raised, 0.6), bot: paperDeep, rule: seal, band: wood, text: t.text };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.6)}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [scrollFrame, tilePlate, washi, headband, kunai, shuriken].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: small scrolls of dark washi between rollers, a steel headband plate on top. */
${SEL.tile} { background: ${paperBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 14px stretch !important; box-shadow: inset 0 0 0 1px ${alpha(ink, 0.7)}, inset 0 -12px 18px -8px ${alpha('#000000', 0.5)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 36px); top: -13px; width: 72px; height: 24px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${paperBg(0.14)} !important; box-shadow: inset 0 0 0 1px ${alpha(ink, 0.7)}, inset 0 0 22px ${alpha(seal, 0.3)}, 0 0 18px -4px ${alpha(seal, 0.65)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: paper seal tags with an orange band down the left edge. */
${SEL.button} { background: linear-gradient(90deg, ${seal} 0 4px, transparent 4px), var(--dbtc-u2), linear-gradient(180deg, ${mix(paper, t.raised, 0.7)}, ${paperDeep}) !important; border-color: ${steelDim} !important; color: ${t.text} !important; text-shadow: 0 1px 0 ${ink}, 0 0 4px ${ink} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 ${alpha(steel, 0.25)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(90deg, ${seal} 0 6px, transparent 6px), var(--dbtc-u2), linear-gradient(180deg, ${mix(t.raised, seal, 0.22)}, ${paperDeep}) !important; border-color: ${seal} !important; box-shadow: inset 0 1px 0 ${alpha(steel, 0.4)}, 0 0 10px -2px ${alpha(seal, 0.75)} !important; }
${SEL.buttonDown} { background: ${paperDeep} !important; border-color: ${seal} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: an open scroll between two rollers, a headband plate tied over the top. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(seal, 0.12)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${paper}, ${paperDeep}) !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 3px ${alpha(steelDim, 0.6)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: -10px; top: 2px; right: -10px; bottom: 2px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(18)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 100px); top: -34px; right: auto; bottom: auto; width: 200px; height: 52px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 3px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a cloth-band header with a steel plate; washi body. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.06)}, transparent 50%), linear-gradient(180deg, ${cloth}, ${mix(cloth, t.bg, 0.4)}) !important; box-shadow: inset 0 -2px 0 ${seal}, inset 0 -3px 0 ${ink}, inset 0 1px 0 ${alpha(steel, 0.3)} !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${paper}, ${mix(paper, t.bg, 0.6)}) !important; box-shadow: inset 2px 0 0 ${wood}, inset -2px 0 0 ${wood}, inset 0 -1px 0 ${steelDim} !important; }

/* Duel: steel-plated life bars led by a kunai; shuriken phases. */
${SEL.life} { border-color: ${steel} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 3px ${cloth}, 0 0 0 4px ${alpha(steel, 0.45)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 3px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 45%), linear-gradient(90deg, #d8661a, #f08a1c) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 45%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.6)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -17px; top: -8px; width: 16px; height: 42px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 200deg, ${steel}, ${steelDim}, ${mix(steel, '#ffffff', 0.4)}, ${steelDim}, ${steel}) !important; box-shadow: 0 0 0 1px ${ink}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${paperDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(paper, t.raised, 0.5)} 30%, ${paperDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${deepForWhite(t.self)} 30%, ${mix(deepForWhite(t.self), '#000000', 0.3)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.75)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${deepForWhite(t.opp)} 30%, ${mix(deepForWhite(t.opp), '#000000', 0.3)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.75)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 4px #000000 !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: #ffffff !important; text-shadow: 0 1px 2px ${alpha('#000000', 0.7)} !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${paper}, ${mix(paper, t.bg, 0.5)}) !important; box-shadow: inset 3px 0 0 ${wood}, inset -3px 0 0 ${wood}, inset 0 0 0 4px ${alpha(steelDim, 0.35)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${steel}, 0 0 0 4px ${cloth}, 0 0 0 5px ${alpha(steel, 0.5)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${steel}, ${steelDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(90deg, ${seal} 0 4px, transparent 4px), var(--dbtc-u2), linear-gradient(180deg, ${mix(paper, t.raised, 0.6)}, ${paperDeep}) !important; }

/* Duel room: scroll panels between rollers; the Genesys ring keeps the palette. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(paper, 0.8)}, ${alpha(t.bg, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${steel}, ${steelDim} 35%, ${steel} 60%, ${steelDim}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px -8px; pointer-events: none; ${frame(16)} }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${paperDeep} !important; box-shadow: 0 0 0 0.35em ${paperDeep} !important; border-radius: 3px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(seal, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(seal, 0.38)}, ${alpha(seal, 0.1)}) !important; }

/* Deck constructor: scroll panels with roller edges. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${paper}, ${mix(paper, t.bg, 0.5)}) !important; box-shadow: inset 4px 0 0 ${wood}, inset -4px 0 0 ${wood}, inset 0 1px 0 ${steelDim}, inset 0 -1px 0 ${steelDim} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(14)} }

/* Settings panels: the scroll frame. */
${settingsPanels} { border-color: ${steelDim} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(paper, 0.85)}, ${alpha(t.bg, 0.85)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px -8px; pointer-events: none; ${frame(14)} }

/* Titles: cream brushwork with an orange underglow. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${ink}, 0 3px 12px ${alpha(seal, 0.55)} !important; }

/* Text fields: ink wells with a steel lip, orange focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${steelDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(steel, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${seal} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(seal, 0.6)} !important; }

/* Scrollbars: lacquered rollers. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${mix(wood, t.bg, 0.3)}, ${mix(wood, seal, 0.4)}, ${mix(wood, t.bg, 0.3)}) !important; border-radius: 3px !important; }

/* Links: orange, darker on hover. */
${sel(['#content a:hover', '#content a:active', '#content .status .reply_btn:hover', '#content #post_status_btn:hover', '#content #logged_in .logout_btn:hover', '#content #logged_in .switch_account_btn:hover'])} { color: ${mix(t.link, t.bg, 0.22)} !important; }

/* Pop-up buttons in the theme material. */
${popCss}

/* Scene: the moon stays out from behind the menu feed and the front page's links; the tower's disc out of the duel stage; on the menu the chakra sphere shrinks into the gutter right of the feed, without its trails. */
html body:is(:has(#main_menu:not([style*="none"])), :has(#welcome_buttons:not([style*="none"]))) #dbte-skin-fx .dbtefx-nr-moon { display: none; }
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-nr-disc { display: none; }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-nr-sphere { transform-origin: 1372px 600px; transform: translate(132px, 0) scale(0.7); }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-nr-trails { display: none; }
/* Main menu: the round tower stands smaller in the right gutter, behind the front roofs, clear of the timestamps. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-nr-tower { transform-origin: 0 0; transform: translate(712px, 296px) scale(0.65); }
`;
};
