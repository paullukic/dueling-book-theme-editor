// constellar: the star knights' armour. Polished white-silver plate with gold
// chamfered corners, violet nebula glass behind it, ringed crosshair stars as
// rivets, constellation lines as engraving, and the eight-point Constellar
// crest (the star compass on every knight's breastplate) as the signature.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');
const f1 = (v) => Math.round(v * 10) / 10;

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const silver = t.accent;
  const silverLit = mix(t.accent, '#ffffff', 0.6);
  const silverDeep = mix(t.accent, t.bg, 0.5);
  const gold = t.accent2;
  const goldLit = mix(t.accent2, '#ffffff', 0.45);
  const goldDeep = mix(t.accent2, t.bg, 0.45);
  const violet = t.self;
  const glass = mix(t.surface, violet, 0.12);
  const glassDeep = mix(t.bg, violet, 0.06);

  // Ringed four-point star (the crosshair sparkle of Constellar card art).
  const xstar = (x, y, r, c) => `<path d="M${x} ${f1(y - r)}L${f1(x + r * 0.12)} ${f1(y - r * 0.12)}L${f1(x + r)} ${y}L${f1(x + r * 0.12)} ${f1(y + r * 0.12)}L${x} ${f1(y + r)}L${f1(x - r * 0.12)} ${f1(y + r * 0.12)}L${f1(x - r)} ${y}L${f1(x - r * 0.12)} ${f1(y - r * 0.12)}Z" fill="${c}"/><circle cx="${x}" cy="${y}" r="${f1(r * 0.42)}" fill="none" stroke="${c}" stroke-width="${f1(Math.max(0.7, r * 0.09))}"/>`;

  // The crest: four long points, four short, faceted gold around a violet gem.
  const crest = (cx, cy, r) => {
    let p = '';
    for (let i = 0; i < 8; i++) {
      const rad = i % 2 ? r * 0.58 : r;
      const a = ((-90 + i * 45) * Math.PI) / 180;
      const tip = [f1(cx + Math.cos(a) * rad), f1(cy + Math.sin(a) * rad)];
      const l = [f1(cx + Math.cos(a - 0.55) * r * 0.34), f1(cy + Math.sin(a - 0.55) * r * 0.34)];
      const rr = [f1(cx + Math.cos(a + 0.55) * r * 0.34), f1(cy + Math.sin(a + 0.55) * r * 0.34)];
      p += `<path d="M${cx} ${cy}L${l.join(' ')}L${tip.join(' ')}Z" fill="${i % 2 ? goldDeep : goldLit}"/><path d="M${cx} ${cy}L${tip.join(' ')}L${rr.join(' ')}Z" fill="${i % 2 ? gold : goldDeep}"/>`;
    }
    return `${p}<circle cx="${cx}" cy="${cy}" r="${f1(r * 0.3)}" fill="${mix(violet, t.bg, 0.3)}" stroke="${silverLit}" stroke-width="${f1(r * 0.07)}"/><circle cx="${f1(cx - r * 0.08)}" cy="${f1(cy - r * 0.08)}" r="${f1(r * 0.08)}" fill="#ffffff" fill-opacity="0.85"/>`;
  };

  // Nine-slice frame: silver plate band, gold chamfers at the corners, a ringed star rivet in each.
  const ch = (x, y, sx, sy) => `<path d="M${x} ${y + sy * 13}L${x + sx * 13} ${y}" stroke="${gold}" stroke-width="3"/>`;
  const frameSvg = svg(60, 60, `<path d="M9 0H51L60 9V51L51 60H9L0 51V9ZM13 13V47H47V13Z" fill="${silverDeep}" fill-rule="evenodd"/><path d="M9 0.8H51M0.8 9V51M59.2 9V51M9 59.2H51" stroke="${silverLit}" stroke-width="1.4"/><path d="M13 6.5H47M13 53.5H47M6.5 13V47M53.5 13V47" stroke="${silver}" stroke-width="2.2"/><path d="M13 5.4H47M5.4 13V47" stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.8"/><rect x="12.4" y="12.4" width="35.2" height="35.2" fill="none" stroke="${silver}" stroke-width="1"/>${ch(0.5, 0.5, 1, 1)}${ch(59.5, 0.5, -1, 1)}${ch(0.5, 59.5, 1, -1)}${ch(59.5, 59.5, -1, -1)}${xstar(7, 7, 5, goldLit)}${xstar(53, 7, 5, goldLit)}${xstar(7, 53, 5, goldLit)}${xstar(53, 53, 5, goldLit)}`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Constellation engraving texture: a few stars joined by hairlines.
  const chart = svg(220, 160, `<path d="M18 30L60 18L96 44L150 30L196 52M96 44L84 96L130 128L190 112" fill="none" stroke="${silver}" stroke-opacity="0.13" stroke-width="0.8"/>${[[18, 30], [60, 18], [96, 44], [150, 30], [196, 52], [84, 96], [130, 128], [190, 112]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.3" fill="${silver}" fill-opacity="0.35"/>`).join('')}${[[30, 130], [170, 80], [120, 8], [8, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.7" fill="${t.text}" fill-opacity="0.3"/>`).join('')}`);

  // Crest emblem for tiles (24px tall) and the pop-up crown (crest in orbit rings).
  const crestTile = svg(40, 40, crest(20, 20, 19.5));
  const crown = svg(150, 76, `<ellipse cx="75" cy="40" rx="70" ry="13" fill="none" stroke="${gold}" stroke-width="2" transform="rotate(-8 75 40)"/><ellipse cx="75" cy="40" rx="58" ry="22" fill="none" stroke="${silver}" stroke-width="1.2" stroke-opacity="0.75" transform="rotate(14 75 40)"/><circle cx="75" cy="40" r="22" fill="${glassDeep}" stroke="url(#s)" stroke-width="5"/><defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="${silver}"/><stop offset="1" stop-color="${silverDeep}"/></linearGradient></defs>${crest(75, 40, 34)}<circle cx="139" cy="31" r="4.5" fill="#ffffff"/><circle cx="139" cy="31" r="8" fill="${silver}" fill-opacity="0.3"/>${xstar(12, 50, 6, silverLit)}`);

  const lifeCrest = svg(40, 40, `<circle cx="20" cy="20" r="17" fill="${glassDeep}" stroke="${silverLit}" stroke-width="2"/>${crest(20, 20, 18)}`);

  const plate = `linear-gradient(180deg, ${silverLit}, ${silver} 45%, ${mix(silver, t.bg, 0.25)})`;
  const glassBg = (lift = 0) => `radial-gradient(ellipse 80% 120% at 85% -20%, ${alpha(violet, 0.22 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${glassDeep})`;

  // Pop-up buttons: a silver armour plate with gold chamfers (primary); violet glass in silver (secondary).
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const [x0, x1, y0, y1, k] = [6, w - 6, 10, 68.5, 11];
    const shape = `M${x0 + k} ${y0}H${f1(x1 - k)}L${f1(x1)} ${y0 + k}V${y1 - k}L${f1(x1 - k)} ${y1}H${x0 + k}L${x0} ${y1 - k}V${y0 + k}Z`;
    const chamf = `M${x0} ${y0 + k}L${x0 + k} ${y0}M${f1(x1 - k)} ${y0}L${f1(x1)} ${y0 + k}M${f1(x1)} ${y1 - k}L${f1(x1 - k)} ${y1}M${x0 + k} ${y1}L${x0} ${y1 - k}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.55" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="${shape}" fill="url(#g)" stroke="${c.edge}" stroke-width="2"/><path d="M${x0 + k + 2} ${y0 + 4}H${f1(x1 - k - 2)}" stroke="#ffffff" stroke-opacity="${c.shine}" stroke-width="2"/><path d="${chamf}" stroke="${gold}" stroke-width="4"/><text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: '#ffffff', mid: silver, bot: mix(silver, t.bg, 0.3), edge: goldDeep, shine: 0.9, text: t.accentText };
  const popSecondary = { top: mix(glass, violet, 0.2), mid: glass, bot: glassDeep, edge: silver, shine: 0.25, text: t.text };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 5px ${alpha('#000000', 0.55)}) drop-shadow(0 0 6px ${alpha(violet, 0.35)}) !important; }`)
    .join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const rivet = svg(12, 12, crest(6, 6, 5.8));
  const vars = [frameSvg, crestTile, chart, crown, null, lifeCrest, rivet].map((v, i) => (v ? `--dbtc-u${i}: ${svgUrl(v)};` : '')).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: violet glass in a silver armour frame, the crest above. */
${SEL.tile} { background: ${glassBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 9px stretch !important; border-radius: 0 !important; box-shadow: 0 10px 24px -12px #000000, 0 0 18px -10px ${alpha(violet, 0.6)} !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 19px); top: -19px; width: 38px; height: 38px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content', '#main_menu #tourneys_btn .content']), 'before')} { content: none; }
${SEL.tileHover} { background: linear-gradient(0deg, ${alpha(silver, 0.12)}, transparent 60%), ${glassBg(0.18)} !important; box-shadow: 0 0 22px -4px ${alpha(silver, 0.7)}, 0 0 40px -12px ${alpha(violet, 0.9)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 10px ${alpha(t.bg, 0.95)} !important; }

/* Buttons: polished silver plate with a gold underline. */
${SEL.button}, ${sel(['#content #settings_content > div.button'])} { background: var(--dbtc-u6) 4px 50% / 9px 9px no-repeat, var(--dbtc-u6) calc(100% - 4px) 50% / 9px 9px no-repeat, linear-gradient(180deg, #ffffff 0%, ${silverLit} 18%, ${silver} 50%, ${mix(silver, t.bg, 0.35)} 52%, ${mix(silver, t.bg, 0.15)} 100%) !important; border-color: ${gold} !important; color: ${t.accentText} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${goldDeep}, inset 0 1px 0 #ffffff, inset 1px 0 0 ${alpha('#ffffff', 0.6)}, inset 0 -2px 0 ${silverDeep}, 0 3px 6px -2px #000000 !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.6)} !important; }
${SEL.buttonHover}, ${sel(['#content #settings_content > div.button:hover'])} { background: var(--dbtc-u6) 4px 50% / 9px 9px no-repeat, var(--dbtc-u6) calc(100% - 4px) 50% / 9px 9px no-repeat, linear-gradient(180deg, #ffffff, ${silverLit} 45%, ${silver}) !important; border-color: ${gold} !important; box-shadow: inset 0 -2px 0 ${gold}, 0 0 12px -2px ${alpha(silver, 0.9)} !important; }
${SEL.buttonDown} { background: ${mix(silver, t.bg, 0.3)} !important; border-color: ${gold} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.5)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.accentText, silver, 0.5)} !important; }

/* Pop-ups: nebula glass in the silver frame, crowned by the crest in its orbits. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 60% at 50% 0%, ${alpha(violet, 0.3)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${t.bg}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${silverLit}, 0 0 0 3px ${silverDeep}, 0 0 40px -10px ${alpha(violet, 0.8)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 75px); top: -52px; right: auto; bottom: auto; width: 150px; height: 76px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 3px 4px #000000); transform: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 14px ${alpha(violet, 0.8)} !important; }

/* Chat: a silver helm band with a gold line, violet glass below. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 55%), linear-gradient(90deg, ${silverDeep}, ${mix(silverDeep, violet, 0.35)} 50%, ${silverDeep}) !important; box-shadow: inset 0 1px 0 ${silverLit}, inset 0 -2px 0 ${gold} !important; }
${sel(['#chats .chat .chat_top span'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${glassDeep}) !important; box-shadow: inset 1px 0 0 ${silver}, inset -1px 0 0 ${silver}, inset 0 -1px 0 ${silver}, inset 0 0 30px -10px ${alpha(violet, 0.6)} !important; }

/* Duel: silver-bezel life bars led by the crest; phases are compass rings. */
${SEL.life} { border-color: ${silver} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${silverDeep}, inset 0 0 0 1px ${alpha(silverLit, 0.5)}, 0 0 12px -2px ${alpha(violet, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -2px; width: 34px; height: 34px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 200deg, ${silverLit}, ${silver}, ${silverDeep}, ${silver}, ${silverLit}, ${silverDeep}, ${silverLit}) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 10px -2px ${alpha(violet, 0.7)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: repeating-conic-gradient(from -2deg, ${silverLit} 0deg 4deg, ${silverDeep} 4deg 45deg) !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle, ${glass} 30%, ${glassDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 30% 26%, #ffffff 0 3%, ${alpha(goldLit, 0.85)} 8%, transparent 20%), radial-gradient(circle, ${mix(t.self, '#ffffff', 0.3)} 25%, ${mix(t.self, t.bg, 0.45)}) !important; box-shadow: 0 0 0 2px ${gold}, 0 0 18px ${alpha(gold, 0.85)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 30% 26%, #ffffff 0 3%, ${alpha(goldLit, 0.85)} 8%, transparent 20%), radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.3)} 25%, ${mix(t.opp, t.bg, 0.45)}) !important; box-shadow: 0 0 0 2px ${goldLit}, 0 0 18px ${alpha(gold, 0.85)}; }
${sel(['#duel .phase.active .background'])} { background: conic-gradient(from 200deg, ${goldLit}, ${gold}, ${goldDeep}, ${gold}, ${goldLit}) !important; }
${sel(['#duel .phase span'])} { color: ${silverLit} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${silverDeep} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(violet, '#ffffff', 0.12)}, ${mix(violet, t.bg, 0.5)}) !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${glassDeep}) !important; box-shadow: inset 0 0 0 1px ${silver}, inset 0 0 0 3px ${silverDeep} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${silver}, 0 0 0 4px ${goldDeep}, 0 0 16px -4px ${alpha(violet, 0.8)} !important; }

/* Duel room: silver rings around nebula glass. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glass, 0.8)}, ${alpha(t.bg, 0.88)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${silverLit}, ${silver} 30%, ${silverDeep} 55%, ${silver} 80%, ${silverLit}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room .format .format_txt', '#deck_constructor #search .title_txt'])} { background: linear-gradient(90deg, transparent 2%, ${glassDeep} 12% 88%, transparent 98%) !important; box-shadow: none !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${glassDeep} !important; box-shadow: 0 0 0 0.35em ${glassDeep} !important; border-radius: 3px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(violet, 0.25)}, transparent 45%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(violet, 0.45)}, ${alpha(silver, 0.12)}) !important; }

/* Deck constructor: glass panels banded in silver. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(glass, t.surface, 0.4)}, ${glassDeep}) !important; box-shadow: inset 0 0 0 1px ${silverLit}, inset 0 0 0 3px ${silverDeep}, inset 0 0 0 4px ${alpha(gold, 0.5)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels. */
${settingsPanels} { border-color: ${silver} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glass, 0.88)}, ${alpha(t.bg, 0.92)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: engraved silver with a violet glow. */
${titles} { color: ${silverLit} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${t.bg}, 0 0 16px ${alpha(violet, 0.75)} !important; }

/* Text fields: deep nebula wells with a silver lip. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${silverDeep} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(silver, 0.3)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${silver} !important; box-shadow: inset 0 2px 4px #000000, 0 0 10px ${alpha(violet, 0.8)} !important; }

/* Scrollbars: silver rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${silverDeep}, ${silverLit}, ${silverDeep}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
