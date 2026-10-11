// ddd: the regalia of the D/D/D overlord kings. Obsidian panels in a double
// gold rule with clock-dial ticks round the frame (the doom kings'
// clockwork) and gold bosses at the corners; the signature crest is the
// horned overlord crown with a dimensional violet gem; pop-ups are sealed
// with the Dark Contract's crimson wax. Phases are gold clock dials.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');
const f1 = (v) => Math.round(v * 10) / 10;

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const gold = t.accent;
  const goldLit = mix(t.accent, '#ffffff', 0.45);
  const goldDeep = mix(t.accent, t.bg, 0.5);
  const violet = t.accent2;
  const violetLit = mix(t.accent2, '#ffffff', 0.4);
  const crimson = t.danger;
  const ink = mix(t.bg, '#000000', 0.45);
  const obsidian = mix(t.raised, t.bg, 0.25);
  const obsidianDeep = mix(t.bg, t.raised, 0.35);
  const parchment = mix(t.text, t.warning, 0.25);

  // The overlord crown: a gold circlet with five points, swept horns, a violet gem.
  const crownMark = (cx, cy, k) => {
    const p = (dx, dy) => `${f1(cx + dx * k)} ${f1(cy + dy * k)}`;
    const horn = (d) => `M${p(d * 9, 2)}C${p(d * 18, 0)} ${p(d * 26, -6)} ${p(d * 28, -18)}C${p(d * 22, -10)} ${p(d * 16, -6)} ${p(d * 9, -5)}Z`;
    return `<path d="${horn(-1)}${horn(1)}" fill="${obsidian}" stroke="${gold}" stroke-width="${f1(0.9 * k)}"/><path d="M${p(-11, 6)}L${p(-12, -6)}L${p(-6, -1)}L${p(-3, -10)}L${p(0, -2)}L${p(3, -10)}L${p(6, -1)}L${p(12, -6)}L${p(11, 6)}Z" fill="${gold}" stroke="${goldDeep}" stroke-width="${f1(0.6 * k)}"/><path d="M${p(-11, 6)}H${p(11, 6).split(' ')[0]}" stroke="${goldLit}" stroke-width="${f1(1 * k)}"/><path d="M${p(0, -1)}L${p(2.6, 2)}L${p(0, 5)}L${p(-2.6, 2)}Z" fill="${violetLit}" stroke="${ink}" stroke-width="${f1(0.4 * k)}"/>`;
  };
  // The Dark Contract's wax seal.
  const seal = (cx, cy, r) => {
    let star = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rad = i % 2 ? r * 0.26 : r * 0.58;
      star += `${i ? 'L' : 'M'}${f1(cx + Math.cos(a) * rad)} ${f1(cy + Math.sin(a) * rad)}`;
    }
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${crimson}" stroke="${mix(crimson, t.bg, 0.5)}" stroke-width="${f1(r * 0.08)}"/><circle cx="${cx}" cy="${cy}" r="${f1(r * 0.72)}" fill="none" stroke="${goldLit}" stroke-width="${f1(r * 0.07)}"/><path d="${star}Z" fill="${goldLit}"/>`;
  };

  // Nine-slice frame: an obsidian band between two gold rules, clock ticks
  // along it, gold bosses at the corners.
  let ticks = '';
  for (let i = 16; i <= 44; i += 4) {
    const l = i % 12 === 4 ? 5 : 3;
    ticks += `M${i} 3V${3 + l}M${i} 57V${57 - l}M3 ${i}H${3 + l}M57 ${i}H${57 - l}`;
  }
  const boss = (x, y) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${obsidian}" stroke="${goldLit}" stroke-width="1.8"/><circle cx="${x}" cy="${y}" r="2" fill="${violet}"/>`;
  const frameSvg = svg(60, 60, `<path d="M0 0H60V60H0ZM13 13V47H47V13Z" fill="${obsidianDeep}" fill-rule="evenodd"/><path d="${ticks}" stroke="${gold}" stroke-width="1.3"/><g fill="none" stroke="${gold}" stroke-width="1.4"><rect x="0.8" y="0.8" width="58.4" height="58.4"/><rect x="12.4" y="12.4" width="35.2" height="35.2"/></g><rect x="10.6" y="10.6" width="38.8" height="38.8" fill="none" stroke="${goldDeep}" stroke-width="0.8"/>${boss(6.5, 6.5)}${boss(53.5, 6.5)}${boss(6.5, 53.5)}${boss(53.5, 53.5)}`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px round; box-sizing: border-box;`;

  // Texture: the contract's lines of script, very faint.
  const chart = svg(120, 36, `<path d="M8 10h22M34 10h14M52 10h30M86 10h18M14 28h26M44 28h12M60 28h34" stroke="${gold}" stroke-opacity="0.05" stroke-width="1.6"/>`);

  const crestTile = svg(72, 42, crownMark(36, 26, 1.5));
  // Pop-up crown: the overlord crown over the Dark Contract's seal on a gold dial.
  let dial = '';
  for (let i = 0; i < 24; i++) {
    const a = (i * 15 * Math.PI) / 180;
    const r1 = i % 2 ? 22 : 19;
    dial += `M${f1(85 + Math.cos(a) * r1)} ${f1(70 + Math.sin(a) * r1)}L${f1(85 + Math.cos(a) * 25)} ${f1(70 + Math.sin(a) * 25)}`;
  }
  const crown = svg(170, 96, `<circle cx="85" cy="70" r="25" fill="${obsidianDeep}" stroke="${gold}" stroke-width="2.4"/><path d="${dial}" stroke="${gold}" stroke-width="1.3"/>${seal(85, 70, 15)}${crownMark(85, 30, 2.1)}`);

  // Phase discs: a gold clock dial.
  let phaseTicks = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    const r1 = i % 3 ? 17 : 14.5;
    phaseTicks += `M${f1(22.5 + Math.cos(a) * r1)} ${f1(22.5 + Math.sin(a) * r1)}L${f1(22.5 + Math.cos(a) * 20)} ${f1(22.5 + Math.sin(a) * 20)}`;
  }
  const phaseRing = svg(45, 45, `<circle cx="22.5" cy="22.5" r="20.5" fill="none" stroke="${gold}" stroke-width="1.6"/><path d="${phaseTicks}" stroke="${gold}" stroke-width="1.6"/>`);
  const lifeCrest = svg(40, 40, seal(20, 20, 17));

  const plate = `linear-gradient(180deg, ${goldLit}, ${gold} 45%, ${mix(gold, t.bg, 0.3)})`;
  // Cut corners in obsidian and a crimson seal line along the top: a regalia plate.
  const plateCut = `linear-gradient(135deg, ${ink} 0 5px, transparent 5px), linear-gradient(225deg, ${ink} 0 5px, transparent 5px), linear-gradient(45deg, ${ink} 0 5px, transparent 5px), linear-gradient(315deg, ${ink} 0 5px, transparent 5px), linear-gradient(180deg, transparent 1px, ${crimson} 1px 3px, transparent 3px)`;
  const glassBg = (lift = 0) => `radial-gradient(ellipse 85% 80% at 50% 118%, ${alpha(violet, 0.34 + lift)}, transparent 70%), linear-gradient(115deg, ${alpha(gold, 0.08)}, transparent 35%), var(--dbtc-u2), linear-gradient(180deg, ${obsidian}, ${obsidianDeep})`;

  // Pop-up buttons: a gold regalia plate with crimson seal studs (primary);
  // obsidian in a gold rule with violet studs (secondary).
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const [x0, x1, y0] = [6, w - 6, 10];
    const stud = (x) => `<circle cx="${x}" cy="${y0 + 29.25}" r="6" fill="${c.stud}" stroke="${c.edge}" stroke-width="1.4"/><circle cx="${x}" cy="${y0 + 29.25}" r="2.2" fill="${goldLit}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.55" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="M${x0 + 8} ${y0}H${f1(x1 - 8)}L${x1} ${y0 + 8}V${y0 + 50.5}L${f1(x1 - 8)} ${y0 + 58.5}H${x0 + 8}L${x0} ${y0 + 50.5}V${y0 + 8}Z" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/><path d="M${x0 + 10} ${y0 + 4}H${f1(x1 - 10)}M${x0 + 10} ${y0 + 54.5}H${f1(x1 - 10)}" stroke="${c.rule}" stroke-width="1.2"/>${stud(x0 + 15)}${stud(f1(x1 - 15))}<text x="${w / 2}" y="39.5" dominant-baseline="central" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="25" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: goldLit, mid: gold, bot: mix(gold, t.bg, 0.35), edge: ink, rule: mix(gold, t.bg, 0.5), stud: crimson, text: t.accentText };
  const popSecondary = { top: mix(obsidian, violet, 0.15), mid: obsidian, bot: ink, edge: gold, rule: goldDeep, stud: violet, text: t.text };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 5px ${alpha('#000000', 0.6)}) drop-shadow(0 0 6px ${alpha(gold, 0.25)}) !important; }`)
    .join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [frameSvg, crestTile, chart, crown, phaseRing, lifeCrest].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: obsidian in the ticked gold frame, the overlord crown above. */
${SEL.tile} { background: ${glassBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 10px round !important; border-radius: 0 !important; box-shadow: 0 10px 24px -12px #000000, 0 0 18px -10px ${alpha(gold, 0.5)} !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 36px); top: -30px; width: 72px; height: 42px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: linear-gradient(0deg, ${alpha(gold, 0.12)}, transparent 60%), ${glassBg(0.16)} !important; box-shadow: 0 0 22px -4px ${alpha(gold, 0.7)}, 0 0 40px -12px ${alpha(violet, 0.8)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 10px ${alpha(t.bg, 0.95)} !important; }

/* Buttons: gold regalia plates with a violet underline. */
${SEL.button} { background: ${plateCut}, ${plate} !important; border-color: ${goldDeep} !important; color: ${t.accentText} !important; border-radius: 1px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.5)}, inset 0 -2px 0 ${violet}, 0 2px 6px -2px #000000 !important; }
${SEL.buttonHover} { background: ${plateCut}, linear-gradient(180deg, #ffffff, ${goldLit} 40%, ${gold}) !important; border-color: ${violet} !important; box-shadow: inset 0 -2px 0 ${violet}, 0 0 12px -2px ${alpha(gold, 0.9)} !important; }
${SEL.buttonDown} { background: ${mix(gold, t.bg, 0.3)} !important; border-color: ${gold} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.5)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.accentText, gold, 0.5)} !important; }

/* Pop-ups: obsidian in the ticked frame, crowned and sealed by the contract. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 60% at 50% 0%, ${alpha(gold, 0.14)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${obsidian}, ${t.bg}) !important; border-radius: 1px !important; box-shadow: 0 0 0 1px ${goldLit}, 0 0 0 3px ${goldDeep}, 0 0 40px -10px ${alpha(violet, 0.7)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 85px); top: -80px; right: auto; bottom: auto; width: 170px; height: 96px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 3px 4px #000000); transform: none; }
${SEL.dialogTitle} { color: ${goldLit} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 14px ${alpha(gold, 0.5)} !important; }

/* Chat: a gold-ruled obsidian bar with a violet hairline. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.08)}, transparent 55%), linear-gradient(90deg, ${ink}, ${obsidian} 25%, ${obsidian} 75%, ${ink}) !important; box-shadow: inset 0 2px 0 ${gold}, inset 0 3px 0 ${ink}, inset 0 4px 0 ${goldDeep}, inset 0 -2px 0 ${violet} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${goldLit} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${obsidian}, ${obsidianDeep}) !important; box-shadow: inset 1px 0 0 ${goldDeep}, inset -1px 0 0 ${goldDeep}, inset 0 -1px 0 ${goldDeep}, inset 0 0 30px -10px ${alpha(violet, 0.5)} !important; }

/* Duel: gold-bound life bars led by the wax seal; phases are clock dials. */
${SEL.life} { border-color: ${gold} !important; border-radius: 1px !important; box-shadow: 0 0 0 1px ${goldDeep}, inset 0 0 0 1px ${alpha(goldLit, 0.5)}, 0 0 12px -2px ${alpha(violet, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -2px; width: 34px; height: 34px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: radial-gradient(circle, ${obsidianDeep} 62%, ${goldLit} 64%, ${goldDeep} 72%) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 10px -2px ${alpha(violet, 0.7)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${goldDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${obsidian} 30%, ${ink}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.15)} 25%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.85)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.15)} 25%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.85)}; }
${sel(['#duel .phase span'])} { color: ${goldLit} !important; text-shadow: 0 1px 2px #000000, 0 0 4px #000000 !important; }
${sel(['#duel .phase.active span'])} { color: #ffffff !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${goldDeep} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(crimson, '#ffffff', 0.12)}, ${mix(crimson, t.bg, 0.5)}) !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${obsidian}, ${obsidianDeep}) !important; box-shadow: inset 0 0 0 1px ${gold}, inset 0 0 0 3px ${obsidianDeep}, inset 0 0 0 4px ${goldDeep} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${gold}, 0 0 0 4px ${ink}, 0 0 0 5px ${goldDeep}, 0 0 16px -4px ${alpha(violet, 0.8)} !important; }

/* Duel room: gold rims around obsidian. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(obsidian, 0.85)}, ${alpha(t.bg, 0.9)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${goldLit}, ${gold} 30%, ${goldDeep} 55%, ${gold} 80%, ${goldLit}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${obsidianDeep} !important; box-shadow: 0 0 0 0.35em ${obsidianDeep} !important; border-radius: 1px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.16)}, transparent 45%), ${t.raised} !important; filter: none !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.32)}, ${alpha(violet, 0.14)}) !important; }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }

/* Deck constructor: obsidian panels in a double gold rule. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(obsidian, t.surface, 0.4)}, ${obsidianDeep}) !important; box-shadow: inset 0 0 0 1px ${goldLit}, inset 0 0 0 4px ${ink}, inset 0 0 0 5px ${alpha(gold, 0.6)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${gold} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(obsidian, 0.9)}, ${alpha(t.bg, 0.92)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: gold leaf with a violet glow. */
${titles} { color: ${goldLit} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${t.bg}, 0 0 16px ${alpha(violet, 0.7)} !important; }

/* Text fields: obsidian wells with a gold lip; parchment caret colour. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${goldDeep} !important; caret-color: ${parchment}; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(gold, 0.3)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px #000000, 0 0 10px ${alpha(violet, 0.7)} !important; }

/* Scrollbars: gold rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${goldDeep}, ${goldLit}, ${goldDeep}) !important; border-radius: 1px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
