// yubel: the loving defender's gothic regalia. Wine lacquer panels in a
// rose double rule, a thorn vine running round the frame and Yubel's gold
// wing claws hooking over the corners; the signature crest is the twin
// membrane wings around the gold third eye. Phases are rose windows, life
// points are led by the third eye. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');
const f1 = (v) => Math.round(v * 10) / 10;

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const rose = t.accent;
  const roseLit = mix(t.accent, '#ffffff', 0.4);
  const roseDeep = mix(t.accent, t.bg, 0.55);
  const teal = t.accent2;
  const gold = t.warning;
  const goldLit = mix(t.warning, '#ffffff', 0.45);
  const goldDeep = mix(t.warning, t.bg, 0.5);
  const ink = mix(t.bg, '#000000', 0.45);
  const wine = mix(t.raised, t.accent, 0.14);
  const wineDeep = mix(t.bg, t.raised, 0.45);
  const mauve = mix(rose, teal, 0.32);

  // A membrane wing (dir -1 left, 1 right) from (x, y): arm to the raised
  // wrist, three finger tips, scalloped membrane, a gold claw at the wrist.
  const wing = (x, y, dir, k) => {
    const p = (dx, dy) => `${f1(x + dir * dx * k)} ${f1(y + dy * k)}`;
    const tips = [[36, -18], [42, -2], [34, 12], [16, 14]];
    let membrane = `M${p(0, 2)}Q${p(6, -12)} ${p(16, -14)}L${p(36, -18)}`;
    for (let i = 1; i < tips.length; i++) {
      const [ax, ay] = tips[i - 1];
      const [bx, by] = tips[i];
      membrane += `Q${p((ax + bx) / 2 * 0.72 + 16 * 0.28, (ay + by) / 2 * 0.72 - 14 * 0.28)} ${p(bx, by)}`;
    }
    membrane += `Q${p(8, 8)} ${p(0, 6)}Z`;
    const bones = tips.map(([tx, ty]) => `M${p(16, -14)}L${p(tx, ty)}`).join('') + `M${p(0, 2)}Q${p(6, -12)} ${p(16, -14)}`;
    const claw = `M${p(13, -13)}C${p(12, -22)} ${p(16, -28)} ${p(24, -31)}C${p(20, -26)} ${p(19, -20)} ${p(19, -14)}Z`;
    return `<path d="${membrane}" fill="url(#m)" stroke="${dir < 0 ? rose : teal}" stroke-width="${f1(0.8 * k)}"/><path d="${bones}" fill="none" stroke="${ink}" stroke-width="${f1(1.2 * k)}" stroke-linecap="round"/><path d="${claw}" fill="${gold}" stroke="${goldDeep}" stroke-width="${f1(0.4 * k)}"/>`;
  };
  const memGrad = `<defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(rose, t.bg, 0.25)}"/><stop offset="1" stop-color="${mix(mauve, t.bg, 0.55)}"/></linearGradient></defs>`;
  // The third eye: a gold almond with a teal iris and a dark slit.
  const eye = (cx, cy, k) => `<path d="M${cx} ${f1(cy - 7 * k)}C${f1(cx + 4.5 * k)} ${f1(cy - 3 * k)} ${f1(cx + 4.5 * k)} ${f1(cy + 3 * k)} ${cx} ${f1(cy + 7 * k)}C${f1(cx - 4.5 * k)} ${f1(cy + 3 * k)} ${f1(cx - 4.5 * k)} ${f1(cy - 3 * k)} ${cx} ${f1(cy - 7 * k)}Z" fill="${goldLit}" stroke="${goldDeep}" stroke-width="${f1(0.8 * k)}"/><ellipse cx="${cx}" cy="${cy}" rx="${f1(2 * k)}" ry="${f1(3.6 * k)}" fill="${teal}"/><path d="M${cx} ${f1(cy - 2.6 * k)}V${f1(cy + 2.6 * k)}" stroke="${ink}" stroke-width="${f1(0.9 * k)}"/>`;
  const crest = (cx, cy, k) => `${wing(cx - 6 * k, cy, -1, k)}${wing(cx + 6 * k, cy, 1, k)}${eye(cx, cy, k)}`;

  // Nine-slice frame: a wine band in a rose double rule with a thorn vine
  // along it and gold claws hooking over each corner.
  let vine = '';
  for (let i = 16; i <= 44; i += 14) vine += `M${i} 6.5q3.5 -3 7 0t7 0M6.5 ${i}q-3 3.5 0 7t0 7M${i} 53.5q3.5 3 7 0t7 0M53.5 ${i}q3 3.5 0 7t0 7`;
  let thorns = '';
  for (let i = 19; i <= 44; i += 14) thorns += `M${i} 5l1 -3.4l1.4 3ZM${i} 55l1 3.4l1.4 -3ZM5 ${i}l-3.4 1l3 1.4ZM55 ${i}l3.4 1l-3 1.4Z`;
  const cornerClaw = (x, y, sx, sy) => `<path d="M${x + sx * 2} ${y + sy * 12}C${x + sx * 1} ${y + sy * 4} ${x + sx * 5} ${y - sy * 0} ${x + sx * 13} ${y + sy * 1}C${x + sx * 7} ${y + sy * 3} ${x + sx * 5} ${y + sy * 7} ${x + sx * 6} ${y + sy * 12}Z" fill="${gold}" stroke="${goldDeep}" stroke-width="0.6"/>`;
  const frameSvg = svg(60, 60, `<path d="M0 0H60V60H0ZM13 13V47H47V13Z" fill="${wineDeep}" fill-rule="evenodd"/><path d="${vine}" fill="none" stroke="${roseDeep}" stroke-width="1.4"/><path d="${thorns}" fill="${roseDeep}"/><g fill="none" stroke="${rose}" stroke-width="1.1"><rect x="0.8" y="0.8" width="58.4" height="58.4"/><rect x="12.4" y="12.4" width="35.2" height="35.2"/></g>${cornerClaw(1, 1, 1, 1)}${cornerClaw(59, 1, -1, 1)}${cornerClaw(1, 59, 1, -1)}${cornerClaw(59, 59, -1, -1)}`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px round; box-sizing: border-box;`;

  // Texture: a faint thorn trellis.
  const chart = svg(48, 48, `<path d="M0 24Q12 14 24 24T48 24M24 0Q34 12 24 24T24 48" fill="none" stroke="${rose}" stroke-opacity="0.06" stroke-width="1.1"/><path d="M12 19l-2 -4M36 29l2 4M19 12l4 -2M29 36l-4 2" stroke="${rose}" stroke-opacity="0.08" stroke-width="1.1"/>`);

  const crestTile = svg(72, 40, `${memGrad}${crest(36, 24, 0.82)}`);
  // Pop-up crown: wings spread wide around the eye over a rose.
  const crown = svg(170, 96, `${memGrad}${crest(85, 66, 1.55)}`);

  // Phase discs: a rose window, twelve lobes round a teal ring.
  let lobes = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    lobes += `<circle cx="${f1(22.5 + Math.cos(a) * 15)}" cy="${f1(22.5 + Math.sin(a) * 15)}" r="4.2"/>`;
  }
  const phaseRing = svg(45, 45, `<circle cx="22.5" cy="22.5" r="20.5" fill="none" stroke="${gold}" stroke-opacity="0.8" stroke-width="1.6"/><g fill="none" stroke="${rose}" stroke-opacity="0.75" stroke-width="1.1">${lobes}</g><circle cx="22.5" cy="22.5" r="9" fill="none" stroke="${teal}" stroke-opacity="0.7" stroke-width="1.2"/>`);
  const lifeCrest = svg(40, 40, `<circle cx="20" cy="20" r="17" fill="${ink}" stroke="${gold}" stroke-width="2.4"/><circle cx="20" cy="20" r="13" fill="none" stroke="${rose}" stroke-width="1.2"/>${eye(20, 20, 1.5)}`);

  const plate = `linear-gradient(180deg, ${roseLit}, ${rose} 50%, ${mix(rose, t.bg, 0.3)})`;
  // Gold claw tips hooking over a button's top corners.
  const claws = `linear-gradient(135deg, ${gold} 0 5px, ${goldDeep} 5px 6px, transparent 6px), linear-gradient(225deg, ${gold} 0 5px, ${goldDeep} 5px 6px, transparent 6px)`;
  const glassBg = (lift = 0) => `radial-gradient(ellipse 90% 70% at 50% 130%, ${alpha(rose, 0.18 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${wine}, ${wineDeep})`;

  // Pop-up buttons: a rose lacquer plate held by two gold claws (primary);
  // wine lacquer in a rose rule (secondary).
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const [x0, x1, y0, y1] = [8, w - 8, 12, 68.5];
    const ch = 9;
    const shape = `M${x0 + ch} ${y0}H${f1(x1 - ch)}L${f1(x1)} ${y0 + ch}V${f1(y1 - ch)}L${f1(x1 - ch)} ${y1}H${x0 + ch}L${x0} ${f1(y1 - ch)}V${y0 + ch}Z`;
    const claw = (x, d) => `<path d="M${f1(x + d * 4)} ${y0 + 10}C${f1(x - d * 2)} ${y0 + 2} ${f1(x - d * 2)} ${y0 - 7} ${f1(x - d * 8)} ${y0 - 11}C${f1(x + d * 2)} ${y0 - 9} ${f1(x + d * 8)} ${y0 - 2} ${f1(x + d * 11)} ${y0 + 6}Z" fill="${c.claw}" stroke="${goldDeep}" stroke-width="1"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.55" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="${shape}" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/><path d="M${x0 + ch + 2} ${y0 + 4}H${f1(x1 - ch - 2)}M${x0 + ch + 2} ${f1(y1 - 4)}H${f1(x1 - ch - 2)}" stroke="${c.rule}" stroke-opacity="0.75" stroke-width="1.4"/>${claw(x0 + 2, 1)}${claw(f1(x1 - 2), -1)}<path d="M${f1(w / 2 - 5)} ${f1(y1 - 4)}l5 -5l5 5l-5 5Z" fill="${teal}" stroke="${c.edge}" stroke-width="1"/><text x="${w / 2}" y="39.5" dominant-baseline="central" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="25" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: roseLit, mid: rose, bot: mix(rose, t.bg, 0.35), edge: ink, rule: goldLit, claw: gold, text: t.accentText };
  const popSecondary = { top: mix(wine, rose, 0.2), mid: wine, bot: ink, edge: rose, rule: rose, claw: gold, text: t.text };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 5px ${alpha('#000000', 0.6)}) drop-shadow(0 0 6px ${alpha(rose, 0.3)}) !important; }`)
    .join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [frameSvg, crestTile, chart, crown, phaseRing, lifeCrest].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: wine lacquer in the thorned frame, the winged eye above. */
${SEL.tile} { background: ${glassBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 10px round !important; border-radius: 0 !important; box-shadow: 0 10px 24px -12px #000000, 0 0 18px -10px ${alpha(rose, 0.6)} !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 36px); top: -26px; width: 72px; height: 40px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: linear-gradient(0deg, ${alpha(teal, 0.1)}, transparent 60%), ${glassBg(0.16)} !important; box-shadow: 0 0 22px -4px ${alpha(rose, 0.75)}, 0 0 40px -12px ${alpha(teal, 0.6)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 10px ${alpha(t.bg, 0.95)} !important; }

/* Buttons: rose lacquer with a gold lip and a teal underline. */
${SEL.button} { background: ${claws}, ${plate} !important; border-color: ${roseDeep} !important; color: ${t.accentText} !important; border-radius: 3px !important; box-shadow: inset 0 1px 0 ${alpha(goldLit, 0.7)}, inset 0 -2px 0 ${teal}, 0 2px 6px -2px #000000 !important; }
${SEL.buttonHover} { background: ${claws}, linear-gradient(180deg, #ffffff, ${roseLit} 40%, ${rose}) !important; border-color: ${gold} !important; box-shadow: inset 0 -2px 0 ${teal}, 0 0 12px -2px ${alpha(rose, 0.9)} !important; }
${SEL.buttonDown} { background: ${mix(rose, t.bg, 0.3)} !important; border-color: ${rose} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.5)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.accentText, rose, 0.5)} !important; }

/* Pop-ups: wine lacquer in the thorned frame, crowned by the spread wings. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 60% at 50% 0%, ${alpha(rose, 0.22)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${wine}, ${t.bg}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${rose}, 0 0 0 3px ${wineDeep}, 0 0 40px -10px ${alpha(rose, 0.7)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 85px); top: -80px; right: auto; bottom: auto; width: 170px; height: 96px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 3px 4px #000000); transform: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 14px ${alpha(rose, 0.8)} !important; }

/* Chat: a rose-ruled wine bar with a teal hairline, lacquer below. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.1)}, transparent 55%), linear-gradient(90deg, ${ink}, ${mix(rose, t.bg, 0.5)} 25%, ${mix(rose, t.bg, 0.5)} 75%, ${ink}) !important; box-shadow: inset 0 2px 0 ${rose}, inset 0 3px 0 ${ink}, inset 0 -2px 0 ${teal} !important; }
${sel(['#chats .chat .chat_top span'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${wine}, ${wineDeep}) !important; box-shadow: inset 1px 0 0 ${roseDeep}, inset -1px 0 0 ${roseDeep}, inset 0 -1px 0 ${roseDeep}, inset 0 0 30px -10px ${alpha(rose, 0.5)} !important; }

/* Duel: rose-bound life bars led by the third eye; phases are rose windows. */
${SEL.life} { border-color: ${rose} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${ink}, inset 0 0 0 1px ${alpha(goldLit, 0.4)}, 0 0 12px -2px ${alpha(rose, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 3px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -2px; width: 34px; height: 34px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: radial-gradient(circle, ${wineDeep} 62%, ${gold} 64%, ${goldDeep} 70%, ${ink} 72%) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 10px -2px ${alpha(rose, 0.7)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${wineDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${wine} 30%, ${ink}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.15)} 25%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.85)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.15)} 25%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.85)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 4px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${goldDeep} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(rose, '#ffffff', 0.12)}, ${mix(rose, t.bg, 0.5)}) !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${wine}, ${wineDeep}) !important; box-shadow: inset 0 0 0 1px ${rose}, inset 0 0 0 3px ${wineDeep}, inset 0 0 0 4px ${alpha(gold, 0.5)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${rose}, 0 0 0 4px ${wineDeep}, 0 0 0 5px ${alpha(gold, 0.6)}, 0 0 16px -4px ${alpha(rose, 0.8)} !important; }

/* Duel room: rose rings around wine lacquer. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(wine, 0.85)}, ${alpha(t.bg, 0.9)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${roseLit}, ${rose} 30%, ${roseDeep} 55%, ${teal} 80%, ${roseLit}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${wineDeep} !important; box-shadow: 0 0 0 0.35em ${wineDeep} !important; border-radius: 3px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(rose, 0.22)}, transparent 45%), ${t.raised} !important; filter: none !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(rose, 0.4)}, ${alpha(teal, 0.12)}) !important; }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }

/* Deck constructor: wine panels in a rose and gold double rule. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(wine, t.surface, 0.4)}, ${wineDeep}) !important; box-shadow: inset 0 0 0 1px ${rose}, inset 0 0 0 4px ${wineDeep}, inset 0 0 0 5px ${alpha(gold, 0.55)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${rose} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(wine, 0.9)}, ${alpha(t.bg, 0.92)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: pale rose lettering with a rose glow. */
${titles} { color: ${mix(t.text, rose, 0.12)} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${t.bg}, 0 0 16px ${alpha(rose, 0.7)} !important; }

/* Text fields: dark wine wells with a rose lip. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${mix(roseDeep, t.text, 0.2)} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(rose, 0.3)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${rose} !important; box-shadow: inset 0 2px 4px #000000, 0 0 10px ${alpha(teal, 0.6)} !important; }

/* Scrollbars: rose and gold rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${roseDeep}, ${rose}, ${roseDeep}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
