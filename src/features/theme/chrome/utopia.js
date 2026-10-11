// utopia: Number 39: Utopia's armour. Deep Astral-blue enamel set in a white
// armour bevel trimmed with gold, the gold V of Utopia's helmet crest on every
// tile, a red Number chevron like the 39 on his shoulder, golden wing fins
// fanned behind the pop-up crest, Rising Sword guards capping the life bars
// and gold sunburst phases. Not Xyz (no black plates, no rank orbs) and not
// White Dragon (blue enamel, not silver-white panels). (t, kit) -> CSS string.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha, n1 }) => {
  const gold = t.accent;
  const goldHi = mix(t.accent, '#ffffff', 0.45);
  const goldDk = mix(t.accent, '#000000', 0.45);
  const red = t.accent2;
  const white = mix(t.text, '#ffffff', 0.4);
  const pearl = mix(t.text, t.muted, 0.4);
  const enamel = mix(t.raised, t.opp, 0.1);
  const enamelDk = mix(t.surface, t.bg, 0.4);
  const night = mix(t.bg, '#000000', 0.25);

  // Enamel grain: a faint diagonal Astral sheen.
  const grain = svg(16, 16, `<path d="M0 16L16 0" stroke="${t.opp}" stroke-opacity="0.05"/>`);

  // Nine-slice armour frame: a white bevel (lit top-left, pearl bottom-right)
  // with a gold inner line and gold rivets.
  const frameSvg = svg(60, 60, `<path d="M8 1H52L59 8V52L52 59H8L1 52V8Z" fill="none" stroke="${white}" stroke-width="2.4"/><path d="M8 1H52L59 8" fill="none" stroke="#ffffff" stroke-width="1"/><path d="M59 52L52 59H8" fill="none" stroke="${pearl}" stroke-width="2.4"/><path d="M10 5H50L55 10V50L50 55H10L5 50V10Z" fill="none" stroke="${gold}" stroke-width="1.2"/>${[[10, 10], [50, 10], [10, 50], [50, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${goldHi}" stroke="${goldDk}" stroke-width="0.6"/>`).join('')}`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Tile crest: the gold V crest of Utopia's helmet over a white brow plate.
  const crest = svg(52, 30, `<path d="M24 26L4 2L10 1L26 20L42 1L48 2L28 26Z" fill="${gold}" stroke="${goldDk}" stroke-width="1" stroke-linejoin="round"/><path d="M26 20L10 1L7 1.5L25 23Z" fill="${goldHi}"/><path d="M14 22Q26 16 38 22L36 29H16Z" fill="${white}" stroke="${mix(t.bg, t.border, 0.5)}" stroke-width="1"/><path d="M26 10L23 18L26 26L29 18Z" fill="${goldHi}" stroke="${goldDk}" stroke-width="0.8"/>`);

  // The red Number chevron, like the 39 on the shoulder.
  const chevron = svg(22, 40, `<path d="M2 2H12L20 20L12 38H2L10 20Z" fill="${red}" stroke="${mix(red, '#000000', 0.45)}" stroke-width="1.2"/><path d="M3 3H11.5L14 8" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1"/>`);

  // Pop-up crest: golden wing fins fanned behind the helmet crest and a red jewel.
  let fins = '';
  [[-172, 74], [-154, 72], [-136, 64], [-117, 54]].forEach(([deg, len], i) => {
    [deg, -180 - deg].forEach((d) => {
      const r = (v) => (v * Math.PI) / 180;
      const p = (rad, l) => `${n1(80 + Math.cos(rad) * l)} ${n1(54 + Math.sin(rad) * l)}`;
      fins += `<path d="M${p(r(d + 7), 16)}L${p(r(d), len)}L${p(r(d - 7), 16)}Z" fill="${i % 2 ? gold : goldHi}" stroke="${goldDk}" stroke-width="0.9" stroke-linejoin="round"/><path d="M${p(r(d), 16)}L${p(r(d), len)}" stroke="${goldDk}" stroke-opacity="0.5" stroke-width="0.7"/>`;
    });
  });
  const gable = svg(160, 60, `${fins}<path d="M78 40L52 4L58 3L80 30L102 3L108 4L82 40Z" fill="${gold}" stroke="${goldDk}" stroke-width="1"/><path d="M62 50Q80 30 98 50L94 59H66Z" fill="${white}" stroke="${mix(t.bg, t.border, 0.5)}" stroke-width="1.2"/><path d="M80 34L88 46L80 58L72 46Z" fill="${gold}" stroke="${goldDk}" stroke-width="1"/><path d="M80 39L84.5 46L80 53L75.5 46Z" fill="${red}"/>`);

  // Life bar finial: the Rising Sword's gold guard and grip.
  const guard = svg(18, 44, `<path d="M9 1L12 4V14H6V4Z" fill="${white}" stroke="${goldDk}" stroke-width="0.6"/><circle cx="9" cy="17" r="3.4" fill="${gold}" stroke="${goldDk}" stroke-width="0.8"/><path d="M7 20H11V27H7Z" fill="${night}"/><path d="M1 27L9 30L17 27L16 33L9 35L2 33Z" fill="${gold}" stroke="${goldDk}" stroke-width="0.8"/><path d="M5 35H13L11 43H7Z" fill="${pearl}"/><circle cx="9" cy="31" r="1.6" fill="${red}"/>`);

  // Phase overlay: a gold sunburst.
  let rays = '';
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i;
    rays += `M${n1(22.5 + Math.cos(a) * 15)} ${n1(22.5 + Math.sin(a) * 15)}L${n1(22.5 + Math.cos(a) * 21)} ${n1(22.5 + Math.sin(a) * 21)}`;
  }
  const sun = svg(45, 45, `<path d="${rays}" stroke="${goldHi}" stroke-opacity="0.75" stroke-width="1.6"/><circle cx="22.5" cy="22.5" r="21" fill="none" stroke="${gold}" stroke-opacity="0.6"/>`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${night}, 0 0 8px ${night} !important;`;
  const enamelBg = (lift = 0) => `var(--dbtc-u5) left 4px center / 11px 20px no-repeat, radial-gradient(ellipse 80% 90% at 50% 0%, ${alpha(gold, 0.1 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${enamel}, ${enamelDk})`;

  // Pop-up buttons: polished gold (primary) and white armour plate (secondary).
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.5" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="M16 10H${n1(w - 16)}L${n1(w - 6)} 20V58.5L${n1(w - 16)} 68.5H16L6 58.5V20Z" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/><path d="M12 22L20 14H${n1(w - 20)}L${n1(w - 12)} 22" fill="none" stroke="#ffffff" stroke-opacity="0.75" stroke-width="1.4"/><path d="M14 62H${n1(w - 14)}" stroke="${c.trim}" stroke-width="2.4"/><path d="M14 30L20 39.25L14 48.5H10L16 39.25L10 30Z" fill="${red}"/><text x="${n1(w / 2)}" y="39.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="800" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: goldHi, mid: gold, bot: mix(gold, '#000000', 0.2), edge: goldDk, trim: goldDk, text: t.accentText, shadow: alpha(gold, 0.4) };
  const popSecondary = { top: '#ffffff', mid: white, bot: pearl, edge: mix(t.bg, t.border, 0.4), trim: gold, text: t.bg, shadow: alpha('#000000', 0.6) };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 5px ${c.shadow}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const blade = (c) => `linear-gradient(180deg, ${alpha('#ffffff', 0.4)}, transparent 48%, ${alpha(night, 0.3)} 52%, transparent), linear-gradient(90deg, ${mix(c, t.bg, 0.5)}, ${mix(c, '#ffffff', 0.18)} 45%, ${c} 62%, ${mix(c, t.bg, 0.35)})`;
  const vars = [frameSvg, crest, grain, gable, guard, chevron, sun].map((s, i) => `--dbtc-u${i}: ${svgUrl(s)};`).join(' ');

  return `
html body { ${vars} }
/* Menu tiles: Astral-blue enamel in a white, gold-riveted armour bevel, the red Number chevron, the gold V crest on top. */
${SEL.tile} { background: ${enamelBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 15px stretch !important; border-radius: 0 !important; box-shadow: inset 0 1px 0 ${alpha(white, 0.3)}, inset 0 -12px 18px -10px ${night}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 27px); top: -19px; width: 54px; height: 31px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px ${night}); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${enamelBg(0.16)} !important; box-shadow: inset 0 0 0 1px ${alpha(gold, 0.6)}, inset 0 0 22px ${alpha(gold, 0.18)}, 0 0 18px -4px ${alpha(gold, 0.75)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: blue enamel with a white top bevel and a gold foot line. */
${SEL.button} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(enamel, white, 0.08)}, ${enamelDk}) !important; border-color: ${pearl} !important; color: ${t.text} !important; border-radius: 3px !important; box-shadow: inset 0 1px 0 ${alpha(white, 0.55)}, inset 0 -2px 0 ${alpha(gold, 0.7)}, 0 2px 6px -2px #000000 !important; }
${SEL.buttonHover} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(enamel, gold, 0.22)}, ${enamelDk}) !important; border-color: ${gold} !important; box-shadow: inset 0 1px 0 ${alpha(goldHi, 0.7)}, inset 0 -2px 0 ${gold}, 0 0 12px -2px ${alpha(gold, 0.7)} !important; }
${SEL.buttonDown} { background: ${night} !important; border-color: ${red} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: enamel in the armour bevel, under Utopia's crest and golden wing fins. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(gold, 0.16)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${enamel}, ${night}) !important; border-radius: 4px !important; box-shadow: 0 0 0 1px ${white}, 0 0 0 4px ${night}, 0 0 0 5px ${gold}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 80px); top: -44px; right: auto; bottom: auto; width: 160px; height: 60px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 4px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a white armour header with a gold rule and the red chevron. */
${SEL.chatTop} { background: var(--dbtc-u5) left 3px center / 7px 13px no-repeat, linear-gradient(180deg, ${mix(enamel, white, 0.12)}, ${enamelDk}) !important; box-shadow: inset 0 -2px 0 ${gold}, inset 0 1px 0 ${alpha(white, 0.6)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${pearl}, inset -1px 0 0 ${pearl}, inset 0 -1px 0 ${pearl} !important; }

/* Duel: polished blade life bars capped with the Rising Sword guard; sunburst phases. */
${SEL.life} { border-color: ${white} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${night}, 0 0 0 3px ${gold}, 0 0 0 4px ${night}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: ${blade(t.self)} !important; }
${SEL.lifeOpp} { background: ${blade(t.opp)} !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -17px; top: -8px; width: 18px; height: 44px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 210deg, ${goldHi}, ${goldDk}, ${gold}, ${goldDk}, ${goldHi}) !important; box-shadow: 0 0 0 1px ${night}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${night} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${enamel} 35%, ${night}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.35)} 15%, ${t.self} 45%, ${mix(t.self, t.bg, 0.55)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.35)} 15%, ${t.opp} 45%, ${mix(t.opp, t.bg, 0.55)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 3px 0 0 ${gold}, inset 0 0 0 1px ${pearl} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${white}, 0 0 0 4px ${night}, 0 0 0 5px ${gold} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${goldHi}, ${goldDk}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${enamel}, ${night}) !important; }

/* Duel room: white armour rings around enamel panels. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(enamel, 0.75)}, ${alpha(t.bg, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, #ffffff, ${pearl} 30%, ${gold} 55%, ${pearl} 80%, #ffffff) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(18)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${night} !important; box-shadow: 0 0 0 0.35em ${night} !important; border-radius: 2px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.4)}, ${alpha(red, 0.08)}) !important; }

/* Deck constructor: enamel trays with a white lip and a gold line. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(enamel, t.surface, 0.5)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${pearl}, inset 0 0 0 3px ${alpha(night, 0.9)}, inset 0 0 0 4px ${alpha(gold, 0.6)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }

/* Settings panels: the same armour frame. */
${SEL.settingsPanel} { border-color: ${pearl} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(enamel, 0.85)}, ${alpha(t.bg, 0.88)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: white with a gold glow. */
${titles} { color: ${white} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${goldDk}, 0 0 16px ${alpha(gold, 0.55)} !important; }

/* Text fields: dark wells with a white lip, gold focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${pearl} !important; box-shadow: inset 0 2px 4px ${night}, 0 1px 0 ${alpha(white, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px ${night}, 0 0 8px ${alpha(gold, 0.6)} !important; }

/* Scrollbars: gold rails. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${goldDk}, ${goldHi}, ${goldDk}) !important; border-radius: 1px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
/* Duel: the sunburst hot spot dims behind the opponent's avatar; zone borders calmed. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-ut-sunglow { opacity: 0.35; }
${sel(['#duel img.field_zones'])} { filter: saturate(0.45) !important; }
`;
};
