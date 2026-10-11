// destiny-hero: Aster Phoenix's dark heroes. Black-steel plates with chamfered
// corners, a cold steel rim and a blood-red inner line, steel struts across
// the corners (Dogma's armour); the signature crest is the D lozenge between
// two bat wings, and every pop-up hangs under the Clock Tower Prison's face,
// its red second hand a breath before midnight. Phases are spiked steel rings.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');
const f1 = (v) => Math.round(v * 10) / 10;

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const blood = t.accent;
  const bloodLit = mix(t.accent, '#ffffff', 0.3);
  const bloodDeep = mix(t.accent, t.bg, 0.6);
  const steel = t.accent2;
  const steelLit = mix(t.accent2, '#ffffff', 0.45);
  const steelDeep = mix(t.accent2, t.bg, 0.6);
  const ink = mix(t.bg, '#000000', 0.5);
  const iron = mix(t.raised, t.bg, 0.2);
  const ironDeep = mix(t.bg, t.raised, 0.3);

  // The D lozenge: a steel-rimmed diamond with a blood-red D.
  const lozenge = (cx, cy, s) =>
    `<g transform="translate(${cx} ${cy}) scale(${s})"><path d="M0 -12L12 0L0 12L-12 0Z" fill="${ink}" stroke="${steelLit}" stroke-width="1.3"/><path d="M-4.6 -5.6H0.6C5.8 -5.6 8 -2.8 8 0C8 2.8 5.8 5.6 0.6 5.6H-4.6ZM-1.4 -3.2V3.2H0.4C3.4 3.2 4.8 1.8 4.8 0C4.8 -1.8 3.4 -3.2 0.4 -3.2Z" fill="${blood}" fill-rule="evenodd"/></g>`;
  // A bat wing (membrane between three finger bones), pointing left (d = -1) or right (d = 1).
  const wing = (x, y, d, k) => {
    const p = (dx, dy) => `${f1(x + d * dx * k)} ${f1(y + dy * k)}`;
    return `<path d="M${p(0, 0)}Q${p(10, -9)} ${p(26, -11)}Q${p(23, -5)} ${p(28, -1)}Q${p(22, 1)} ${p(23, 6)}Q${p(16, 3)} ${p(13, 8)}Q${p(8, 4)} ${p(0, 5)}Z" fill="${iron}" stroke="${steel}" stroke-width="${f1(0.9 * k)}" stroke-linejoin="round"/><path d="M${p(2, 1)}L${p(26, -11)}M${p(10, -2)}L${p(28, -1)}M${p(10, -2)}L${p(23, 6)}" stroke="${bloodLit}" stroke-opacity="0.7" stroke-width="${f1(0.6 * k)}" fill="none"/>`;
  };
  const crestMark = (cx, cy, k) => `${wing(cx - 11 * k, cy, -1, k)}${wing(cx + 11 * k, cy, 1, k)}${lozenge(cx, cy, k)}`;

  // Nine-slice frame: chamfered black steel, a steel rim, a red inner line, steel struts across the corners.
  const frameSvg = svg(60, 60, `<path d="M8 0H52L60 8V52L52 60H8L0 52V8ZM12 12V48H48V12Z" fill="${ironDeep}" fill-rule="evenodd"/><path d="M8.7 1H51.3L59 8.7V51.3L51.3 59H8.7L1 51.3V8.7Z" fill="none" stroke="${steel}" stroke-width="1.6"/><path d="M11.4 11.4H48.6V48.6H11.4Z" fill="none" stroke="${blood}" stroke-width="1.2"/><path d="M5.5 5.5L10 10M54.5 5.5L50 10M5.5 54.5L10 50M54.5 54.5L50 50" stroke="${steelLit}" stroke-width="2.2" stroke-linecap="round"/><path d="M24 4H36M24 56H36M4 24V36M56 24V36" stroke="${steelDeep}" stroke-width="1"/>`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Texture: noir rain, faint diagonal hairlines.
  const rain = svg(36, 36, `<path d="M0 36L36 0M-18 18L18 -18M18 54L54 18" stroke="${steel}" stroke-opacity="0.035" stroke-width="1"/>`);

  const crestTile = svg(84, 32, crestMark(42, 16, 1.25));

  // Pop-up crest: the Clock Tower Prison's face, Roman ticks, hands near midnight, a red second hand; the D lozenge below.
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    const r1 = i % 3 ? 21 : 17.5;
    ticks += `M${f1(85 + Math.cos(a) * r1)} ${f1(46 + Math.sin(a) * r1)}L${f1(85 + Math.cos(a) * 24)} ${f1(46 + Math.sin(a) * 24)}`;
  }
  const spire = (x) => `<path d="M${x - 3.5} 76V18L${x} 4L${x + 3.5} 18V76Z" fill="${iron}" stroke="${steel}" stroke-width="1"/>`;
  const crown = svg(170, 96, `${spire(50)}${spire(120)}<path d="M54 76V18L85 2L116 18V76Z" fill="${ironDeep}" stroke="${steel}" stroke-width="1.6"/><path d="M60 22L85 9L110 22" fill="none" stroke="${blood}" stroke-width="1"/><circle cx="85" cy="46" r="29" fill="${ink}" stroke="${steel}" stroke-width="2"/><circle cx="85" cy="46" r="25" fill="${mix(steel, t.text, 0.45)}"/><path d="${ticks}" stroke="${ink}" stroke-width="1.8"/><path d="M85 46L83.2 30L85 25L86.8 30Z" fill="${ink}"/><path d="M85 46L74 39.5L72 37.8L75.6 38.2Z" fill="${ink}"/><path d="M85 52V23" stroke="${blood}" stroke-width="1.4" transform="rotate(-6 85 46)"/><circle cx="85" cy="46" r="2.6" fill="${ink}" stroke="${blood}" stroke-width="1.1"/>${crestMark(85, 82, 1.1)}`);

  // Phase discs: a steel ring with four short spikes.
  const phaseRing = svg(45, 45, `<circle cx="22.5" cy="22.5" r="19.5" fill="none" stroke="${steel}" stroke-width="1.8"/><circle cx="22.5" cy="22.5" r="16.6" fill="none" stroke="${blood}" stroke-opacity="0.85" stroke-width="1"/><path d="M22.5 0L25 4H20ZM45 22.5L41 25V20ZM22.5 45L20 41H25ZM0 22.5L4 20V25Z" fill="${steelLit}"/>`);
  const lifeCrest = svg(40, 40, lozenge(20, 20, 1.5));

  const plateBg = (lift = 0) => `radial-gradient(ellipse 80% 70% at 50% -10%, ${alpha(steel, 0.12 + lift)}, transparent 70%), linear-gradient(0deg, ${alpha(blood, 0.12 + lift)}, transparent 35%), var(--dbtc-u2), linear-gradient(180deg, ${iron}, ${ironDeep})`;

  // Pop-up buttons: blood lacquer in a steel rim (primary); black steel with a red line (secondary).
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const [x0, x1, y0] = [6, w - 6, 10];
    const ch = 9;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.55" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="M${x0 + ch} ${y0}H${f1(x1 - ch)}L${x1} ${y0 + ch}V${f1(y0 + 58.5 - ch)}L${f1(x1 - ch)} ${y0 + 58.5}H${x0 + ch}L${x0} ${f1(y0 + 58.5 - ch)}V${y0 + ch}Z" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/><path d="M${x0 + 12} ${y0 + 5}H${f1(x1 - 12)}" stroke="#ffffff" stroke-opacity="${c.lip}" stroke-width="1.2"/><path d="M${x0 + 12} ${y0 + 53}H${f1(x1 - 12)}" stroke="${c.line}" stroke-width="1.6"/><text x="${w / 2}" y="38.5" dominant-baseline="central" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="25" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: mix(blood, '#ffffff', 0.12), mid: blood, bot: mix(blood, t.bg, 0.45), edge: steelLit, lip: 0.35, line: ink, text: '#ffffff' };
  const popSecondary = { top: mix(iron, steel, 0.18), mid: iron, bot: ink, edge: steel, lip: 0.12, line: blood, text: t.text };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 4px 6px ${alpha('#000000', 0.7)}) !important; }`)
    .join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [frameSvg, crestTile, rain, crown, phaseRing, lifeCrest].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: chamfered black steel, a red inner line, the D crest between bat wings. */
${SEL.tile} { background: ${plateBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 12px stretch !important; border-radius: 0 !important; box-shadow: 0 14px 26px -14px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 42px); top: -20px; width: 84px; height: 32px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${plateBg(0.14)} !important; box-shadow: inset 0 0 24px ${alpha(blood, 0.35)}, 0 0 20px -4px ${alpha(blood, 0.75)}, 0 14px 26px -14px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${ink}, 0 0 10px ${alpha(t.bg, 0.95)} !important; }

/* Buttons: black steel with a blood-red underline. */
${SEL.button} { background: linear-gradient(180deg, ${mix(iron, steel, 0.16)}, ${ironDeep}) !important; border-color: ${steelDeep} !important; color: ${t.text} !important; border-radius: 1px !important; box-shadow: inset 0 1px 0 ${alpha(steelLit, 0.3)}, inset 0 -2px 0 ${blood}, 0 2px 6px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(blood, t.raised, 0.45)}, ${bloodDeep}) !important; border-color: ${steelLit} !important; color: #ffffff !important; box-shadow: inset 0 -2px 0 ${bloodLit}, 0 0 12px -2px ${alpha(blood, 0.9)} !important; }
${SEL.buttonDown} { background: ${ink} !important; border-color: ${blood} !important; box-shadow: inset 0 2px 5px #000000 !important; }
${sel(['#content .button.disabled'])} { color: ${t.muted} !important; }

/* Pop-ups: black steel in the spiked frame, hung under the clock tower's face. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 60% at 50% 0%, ${alpha(blood, 0.18)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${iron}, ${t.bg}) !important; border-radius: 1px !important; box-shadow: 0 0 0 1px ${steelDeep}, 0 0 0 3px ${ink}, 0 0 40px -10px ${alpha(blood, 0.6)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(18)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 85px); top: -74px; right: auto; bottom: auto; width: 170px; height: 96px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 3px 4px #000000); transform: none; }
${SEL.dialogTitle} { color: ${steelLit} !important; text-shadow: 0 2px 0 ${ink}, 0 0 14px ${alpha(blood, 0.6)} !important; }

/* Chat: a black steel bar with a steel lip and a red hairline. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.07)}, transparent 55%), linear-gradient(90deg, ${ink}, ${iron} 25%, ${iron} 75%, ${ink}) !important; box-shadow: inset 0 1px 0 ${alpha(steelLit, 0.45)}, inset 0 -2px 0 ${blood} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${steelLit} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${iron}, ${ironDeep}) !important; box-shadow: inset 1px 0 0 ${steelDeep}, inset -1px 0 0 ${steelDeep}, inset 0 -1px 0 ${steelDeep}, inset 0 0 30px -12px ${alpha(blood, 0.45)} !important; }

/* Duel: steel-bound life bars led by the D lozenge; phases are spiked steel rings. */
${SEL.life} { border-color: ${steel} !important; border-radius: 1px !important; box-shadow: 0 0 0 1px ${ink}, inset 0 0 0 1px ${alpha(steelLit, 0.4)}, 0 0 12px -3px ${alpha(blood, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.34)}, transparent 46%, ${alpha('#000000', 0.18)}), linear-gradient(90deg, ${mix(steel, t.bg, 0.35)}, ${steelLit} 38%, ${steel} 62%, ${mix(steel, t.bg, 0.5)}) !important; box-shadow: inset 0 -2px 0 ${alpha(blood, 0.55)} !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.24)}, transparent 46%, ${alpha('#000000', 0.2)}), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.6)}, ${mix(t.opp, t.bg, 0.15)} 40%, ${mix(t.opp, t.bg, 0.4)} 70%, ${mix(t.opp, t.bg, 0.62)}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -3px; width: 36px; height: 36px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: radial-gradient(circle, ${ironDeep} 62%, ${steelLit} 64%, ${steelDeep} 72%) !important; box-shadow: 0 0 0 1px ${ink}, 0 0 10px -2px ${alpha(blood, 0.6)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${steelDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${iron} 30%, ${ink}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.self, t.bg, 0.45)} 25%, ${mix(t.self, t.bg, 0.78)}) !important; box-shadow: 0 0 0 1px ${steelLit}, 0 0 14px ${alpha(t.self, 0.6)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.15)} 25%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.85)}; }
${sel(['#duel .phase span'])} { color: ${steelLit} !important; text-shadow: 0 1px 2px #000000, 0 0 4px #000000 !important; }
${sel(['#duel .phase.active span'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 4px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${steelDeep} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(blood, t.bg, 0.5)}, ${mix(blood, t.bg, 0.78)}) !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${iron}, ${ironDeep}) !important; box-shadow: inset 0 0 0 1px ${steel}, inset 0 0 0 3px ${ironDeep}, inset 0 0 0 4px ${alpha(blood, 0.7)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${steel}, 0 0 0 4px ${ink}, 0 0 0 5px ${bloodDeep} !important; }
${sel(['#duel #avatar1', '#duel #avatar3'])} { background: linear-gradient(160deg, ${mix(t.self, t.bg, 0.5)}, ${mix(t.self, t.bg, 0.8)}) !important; }
${sel(['#duel #avatar2', '#duel #avatar4'])} { background: linear-gradient(160deg, ${mix(t.opp, t.bg, 0.45)}, ${mix(t.opp, t.bg, 0.8)}) !important; }
${sel(['#duel .duel_avatar .username_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel img.field_zones'])} { filter: saturate(0.55) brightness(0.72) !important; }
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-dh-moon { opacity: 0.4; }

/* Duel room: steel rims around black panels, the chamfered frame over each. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(iron, 0.88)}, ${alpha(t.bg, 0.92)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${steelLit}, ${steel} 30%, ${steelDeep} 55%, ${steel} 80%, ${steelLit}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${ironDeep} !important; box-shadow: 0 0 0 0.35em ${ironDeep} !important; border-radius: 1px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(blood, 0.2)}, transparent 45%), ${t.raised} !important; filter: none !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(blood, 0.4)}, ${alpha(steel, 0.12)}) !important; }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }

/* Deck constructor: black steel panels in a steel and red double rule. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(iron, t.surface, 0.4)}, ${ironDeep}) !important; box-shadow: inset 0 0 0 1px ${steel}, inset 0 0 0 4px ${ink}, inset 0 0 0 5px ${alpha(blood, 0.7)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(14)} }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${steel} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(iron, 0.92)}, ${alpha(t.bg, 0.94)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: cold steel with a blood-red glow. */
${titles} { color: ${steelLit} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${ink}, 0 0 16px ${alpha(blood, 0.7)} !important; }

/* Text fields: black wells with a steel lip, red focus. */
${SEL.field} { background-color: ${mix(t.bg, '#000000', 0.3)} !important; border-color: ${steelDeep} !important; caret-color: ${bloodLit}; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(steel, 0.25)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${blood} !important; box-shadow: inset 0 2px 4px #000000, 0 0 10px ${alpha(blood, 0.7)} !important; }

/* Scrollbars: steel rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${steelDeep}, ${steelLit}, ${steelDeep}) !important; border-radius: 1px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
