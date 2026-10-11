// dracotail: the zodiac astrolabe. Gold hairline frames with astrolabe
// rosettes, plum lacquer under a jade dragon-scale weave, eclipse medallions,
// a half astrolabe with a coiled tail over pop-ups, zodiac-ring phases.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha, n1 }) => {
  const gold = t.accent;
  const goldHi = mix(gold, '#ffffff', 0.45);
  const goldDim = mix(gold, t.bg, 0.45);
  const jade = t.accent2;
  const jadeDim = mix(jade, t.bg, 0.55);
  const plum = mix(t.raised, t.surface, 0.4);
  const plumDeep = mix(t.bg, '#000000', 0.25);
  const moon = mix(t.bg, '#000000', 0.45);
  const P = (a, r, cx = 0, cy = 0) => [n1(cx + Math.cos((a * Math.PI) / 180) * r), n1(cy + Math.sin((a * Math.PI) / 180) * r)];

  // Dragon-scale weave: staggered cupped scales, faint jade.
  const scales = svg(24, 16, `<g fill="none" stroke="${jade}" stroke-opacity="0.11" stroke-width="1"><path d="M0 8Q6 15 12 8Q18 15 24 8"/><path d="M-6 0Q0 7 6 0Q12 7 18 0Q24 7 30 0"/><path d="M-6 16Q0 23 6 16Q12 23 18 16Q24 23 30 16"/></g>`);

  // Astrolabe rosette: a ticked ring around a jade dot.
  const rosette = (x, y, r) => {
    let ticks = '';
    for (let i = 0; i < 8; i++) {
      const [a1, b1] = P(i * 45, r * 0.62, x, y);
      const [a2, b2] = P(i * 45, r, x, y);
      ticks += `M${a1} ${b1}L${a2} ${b2}`;
    }
    return `<circle cx="${x}" cy="${y}" r="${n1(r * 0.82)}" fill="${plumDeep}" stroke="${gold}" stroke-width="1"/><path d="${ticks}" stroke="${goldHi}" stroke-width="0.8"/><circle cx="${x}" cy="${y}" r="${n1(r * 0.3)}" fill="${jade}"/>`;
  };
  // Nine-slice frame: gold double hairline, a filigree arc and a rosette per corner.
  const corner = `<path d="M17 2.2Q18 10 25 11M2.2 17Q10 18 11 25" fill="none" stroke="${gold}" stroke-width="0.9"/>${rosette(9.5, 9.5, 7.6)}`;
  const frameSvg = svg(60, 60, `<g fill="none" stroke="${gold}"><rect x="0.7" y="0.7" width="58.6" height="58.6" stroke-width="1.3"/><rect x="4" y="4" width="52" height="52" stroke-width="0.6" stroke-opacity="0.5"/></g>${corner}<g transform="matrix(-1 0 0 1 60 0)">${corner}</g><g transform="matrix(1 0 0 -1 0 60)">${corner}</g><g transform="matrix(-1 0 0 -1 60 60)">${corner}</g>`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 24 / ${px}px stretch; box-sizing: border-box;`;

  // Eclipse medallion: a gold ticked ring, the dark moon and a rim of corona.
  const eclipse = (cx, cy, r) => {
    let rays = '';
    for (let i = 0; i < 16; i++) {
      const [a1, b1] = P(i * 22.5, r * 1.08, cx, cy);
      const [a2, b2] = P(i * 22.5, r * (i % 2 ? 1.32 : 1.5), cx, cy);
      rays += `M${a1} ${b1}L${a2} ${b2}`;
    }
    return `<path d="${rays}" stroke="${goldHi}" stroke-width="${n1(r * 0.08)}" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${gold}"/><circle cx="${cx}" cy="${cy}" r="${n1(r * 0.8)}" fill="${moon}"/><circle cx="${n1(cx + r * 0.42)}" cy="${n1(cy - r * 0.48)}" r="${n1(r * 0.16)}" fill="#ffffff"/>`;
  };
  const crest = svg(44, 26, `<path d="M2 23H42" stroke="${gold}" stroke-width="1.4"/><path d="M8 23Q12 18 17 21" fill="none" stroke="${jade}" stroke-width="2.2" stroke-linecap="round"/><path d="M36 23Q32 18 27 21" fill="none" stroke="${jade}" stroke-width="2.2" stroke-linecap="round"/>${eclipse(22, 12.5, 7.5)}`);

  // Pop-up crest: a half astrolabe with zodiac ticks, the eclipse at its heart
  // and a jade dragon tail coiled beneath it, ending in a fan fin.
  let arcTicks = '';
  for (let i = 0; i <= 36; i++) {
    const [a1, b1] = P(180 + i * 5, i % 3 ? 47 : 43, 80, 56);
    const [a2, b2] = P(180 + i * 5, 50, 80, 56);
    arcTicks += `M${a1} ${b1}L${a2} ${b2}`;
  }
  let dots = '';
  for (let i = 1; i < 6; i++) {
    const [x, y] = P(180 + i * 30, 37, 80, 56);
    dots += `<circle cx="${x}" cy="${y}" r="1.6"/>`;
  }
  const finFan = [-40, -20, 0, 20, 40].map((a) => P(a - 25, 13, 140, 50)).map(([x, y]) => `L${x} ${y}`).join('');
  const gable = svg(160, 64, `<path d="M28 56A52 52 0 0 1 132 56" fill="${plumDeep}" stroke="${gold}" stroke-width="1.6"/><path d="M36 56A44 44 0 0 1 124 56" fill="none" stroke="${gold}" stroke-opacity="0.55" stroke-width="0.8"/><path d="${arcTicks}" stroke="${gold}" stroke-width="0.9"/><g fill="${goldHi}">${dots}</g>${eclipse(80, 38, 11)}<path d="M8 50C30 64 60 62 80 58S128 50 140 50" fill="none" stroke="${mix(jade, '#000000', 0.5)}" stroke-width="7.5" stroke-linecap="round"/><path d="M8 50C30 64 60 62 80 58S128 50 140 50" fill="none" stroke="${jade}" stroke-width="5" stroke-linecap="round"/><path d="M8 50C30 64 60 62 80 58S128 50 140 50" fill="none" stroke="${mix(jade, t.text, 0.6)}" stroke-width="1.2" stroke-dasharray="2 3" transform="translate(0 1)"/><path d="M60 57.5V62.5M66 57V62" stroke="${goldHi}" stroke-width="1.6"/><path d="M139 50${finFan}Z" fill="${mix(jade, '#ffffff', 0.3)}" stroke="${goldHi}" stroke-width="1"/>`);

  // Phase disc overlay: a zodiac ring of twelve ticks.
  let zt = '';
  for (let i = 0; i < 36; i++) {
    const [a1, b1] = P(i * 10, i % 3 ? 19 : 16.5, 22.5, 22.5);
    const [a2, b2] = P(i * 10, 21, 22.5, 22.5);
    zt += `M${a1} ${b1}L${a2} ${b2}`;
  }
  const zodiacRing = svg(45, 45, `<g fill="none" stroke="${goldHi}" stroke-opacity="0.5"><circle cx="22.5" cy="22.5" r="21" stroke-width="0.9"/><path d="${zt}" stroke-width="0.8"/></g>`);

  // Life bar finial: a gold ring holding a jade gem, a fin flaring below.
  const finial = svg(18, 38, `<path d="M9 22L3 35L9 31L15 35Z" fill="${mix(jade, '#ffffff', 0.25)}" stroke="${goldHi}" stroke-width="0.8"/><circle cx="9" cy="12" r="7.5" fill="${plumDeep}" stroke="${gold}" stroke-width="1.6"/><circle cx="9" cy="12" r="3.6" fill="${jade}" stroke="${goldHi}" stroke-width="0.6"/><path d="M9 2V0.5M9 22V20" stroke="${gold}" stroke-width="1.4"/>`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 10px ${alpha(gold, 0.35)} !important;`;
  const lacquer = (lift = 0) => `radial-gradient(ellipse 70% 90% at 50% 0%, ${alpha(gold, 0.12 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${plum}, ${mix(t.surface, t.bg, 0.5)})`;

  // Pop-up buttons: lacquer plates in a gold rim with rosette finials.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    const ros = (x) => `<circle cx="${x}" cy="39.25" r="7" fill="${c.ros}" stroke="${c.edge}" stroke-width="1.3"/><circle cx="${x}" cy="39.25" r="2.6" fill="${jade}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="7" fill="url(#g)" stroke="${c.edge}" stroke-width="2.5"/><rect x="11" y="15" width="${bw - 10}" height="48.5" rx="4" fill="none" stroke="${c.inner}" stroke-opacity="0.7" stroke-width="1"/><path d="M14 59.5H${n1(w - 14)}" stroke="${jade}" stroke-opacity="0.7" stroke-width="2"/>${ros(20)}${ros(n1(w - 20))}<text x="${n1(w / 2)}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: goldHi, bot: mix(gold, '#000000', 0.12), edge: mix(gold, '#000000', 0.5), inner: '#ffffff', ros: plumDeep, text: t.accentText, shadow: alpha('#000000', 0.6) };
  const popSecondary = { top: mix(t.raised, gold, 0.08), bot: plumDeep, edge: gold, inner: goldDim, ros: plumDeep, text: t.text, shadow: alpha('#000000', 0.6) };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${c.shadow}) !important; }`).join('\n');

  const titlePlate = mix(plum, t.bg, 0.45);
  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const vars = [frameSvg, crest, scales, gable, finial, zodiacRing].map((s, i) => `--dbtc-u${i}: ${svgUrl(s)};`).join(' ');

  return `
html body { ${vars} }
/* Menu tiles: plum lacquer over dragon scales, a gold astrolabe frame, an eclipse medallion on top. */
${SEL.tile} { background: ${lacquer()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 24 / 18px stretch !important; box-shadow: inset 0 0 0 1px ${alpha(t.bg, 0.8)}, inset 0 -3px 0 ${alpha(jade, 0.35)}, inset 0 -12px 18px -8px ${alpha('#000000', 0.5)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 21px); top: -12px; width: 42px; height: 25px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${lacquer(0.14)} !important; box-shadow: inset 0 0 0 1px ${alpha(t.bg, 0.8)}, inset 0 -3px 0 ${jade}, inset 0 0 22px ${alpha(gold, 0.25)}, 0 0 18px -4px ${alpha(gold, 0.65)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: lacquer with a gold top light and a jade scale seam. */
${SEL.button} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(plum, gold, 0.1)}, ${plumDeep}) !important; border-color: ${goldDim} !important; color: ${t.text} !important; border-radius: 5px !important; box-shadow: inset 0 1px 0 ${alpha(goldHi, 0.4)}, inset 0 -2px 0 ${alpha(jade, 0.45)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(plum, gold, 0.24)}, ${plum}) !important; border-color: ${gold} !important; box-shadow: inset 0 1px 0 ${alpha(goldHi, 0.6)}, inset 0 -2px 0 ${jade}, 0 0 10px -2px ${alpha(gold, 0.7)} !important; }
${SEL.buttonDown} { background: ${plumDeep} !important; border-color: ${jade} !important; box-shadow: inset 0 2px 5px #000000 !important; }
${sel(['#content .button.disabled'])} { opacity: 0.55 !important; }

/* Pop-ups: a lacquer chamber in the astrolabe frame under a half astrolabe and coiled tail. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(gold, 0.16)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${plum}, ${t.bg}) !important; border-radius: 8px !important; box-shadow: 0 0 0 1px ${goldDim}, 0 0 0 4px ${plumDeep}, 0 0 0 5px ${alpha(gold, 0.6)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 80px); top: -50px; right: auto; bottom: auto; width: 160px; height: 64px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 3px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a lacquer header with a gold rule. */
${SEL.chatTop} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(plum, gold, 0.12)}, ${plumDeep}) !important; box-shadow: inset 0 -2px 0 ${gold}, inset 0 -4px 0 ${plumDeep}, inset 0 -5px 0 ${alpha(jade, 0.5)}, inset 0 1px 0 ${alpha(goldHi, 0.35)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${goldDim}, inset -1px 0 0 ${goldDim}, inset 0 -1px 0 ${goldDim} !important; }

/* Duel: gold-framed life bars with a scale weave and a fin finial; zodiac-ring phases. */
${SEL.life} { border-color: ${gold} !important; border-radius: 6px !important; box-shadow: 0 0 0 1px ${plumDeep}, 0 0 0 2px ${alpha(gold, 0.45)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 5px !important; box-shadow: inset 0 -3px 0 ${mix(t.border, "#ffffff", 0.22)}, inset 0 1px 0 ${alpha(t.border, 0.8)} !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 45%), var(--dbtc-u2), linear-gradient(90deg, ${mix(t.self, '#ffffff', 0.18)}, ${t.self} 45%, ${mix(t.self, t.border, 0.72)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 45%), var(--dbtc-u2), linear-gradient(90deg, ${mix(t.opp, '#ffffff', 0.18)}, ${t.opp} 45%, ${mix(t.opp, t.border, 0.72)}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -17px; top: -6px; width: 18px; height: 38px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 210deg, ${goldHi}, ${goldDim}, ${gold}, ${goldDim}, ${goldHi}) !important; box-shadow: 0 0 0 1px ${plumDeep}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${plumDeep} !important; }
${sel(['#duel .phase.active .background'])} { background: conic-gradient(from 210deg, #ffffff, ${goldHi}, ${gold}, ${goldHi}, #ffffff) !important; box-shadow: 0 0 0 2px ${plumDeep}, 0 0 0 4px ${goldHi}, 0 0 16px 5px ${alpha(gold, 0.8)} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${plum} 35%, ${plumDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.2)} 20%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 0 2px ${goldHi}, 0 0 0 4px ${alpha(gold, 0.45)}, 0 0 18px 4px ${alpha(gold, 0.75)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.2)} 20%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 0 2px ${goldHi}, 0 0 0 4px ${alpha(gold, 0.45)}, 0 0 18px 4px ${alpha(gold, 0.75)}; }
${sel(['#duel .phase span'])} { color: ${goldHi} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(t.surface, plum, 0.3)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${goldDim}, inset 0 0 0 4px ${alpha(plumDeep, 0.9)}, inset 0 0 0 5px ${alpha(gold, 0.3)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${gold}, 0 0 0 4px ${plumDeep}, 0 0 0 5px ${alpha(jade, 0.6)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${goldHi}, ${goldDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${plum}, ${plumDeep}) !important; }

/* Duel room: gold astrolabe rings around lacquer panels. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(plum, 0.6)}, ${alpha(t.bg, 0.8)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${goldHi}, ${goldDim} 30%, ${gold} 55%, ${goldDim} 80%, ${goldHi}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(18)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(90deg, transparent 4%, ${titlePlate} 12% 88%, transparent 96%) !important; box-shadow: none !important; }
${sel(['#deck_constructor #search .title_txt'])} { background: ${titlePlate} !important; box-shadow: 0 0 0 0.3em ${titlePlate} !important; border-radius: 3px !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${plumDeep} !important; box-shadow: 0 0 0 0.35em ${plumDeep} !important; border-radius: 4px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.36)}, ${alpha(jade, 0.12)}) !important; }

/* Deck constructor: panels set like star charts. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(plum, t.surface, 0.5)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${goldDim}, inset 0 0 0 4px ${alpha(plumDeep, 0.9)}, inset 0 0 0 5px ${alpha(gold, 0.3)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }

/* Settings panels: the same astrolabe frame. */
${SEL.settingsPanel} { border-color: ${goldDim} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(plum, 0.8)}, ${alpha(t.bg, 0.85)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: engraved gold. */
${titles} { color: ${goldHi} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${plumDeep}, 0 0 16px ${alpha(gold, 0.45)} !important; }

/* Text fields: plum wells with a gold lip, jade focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${goldDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(gold, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${jade} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(jade, 0.6)} !important; }

/* Scrollbars: gold rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${goldDim}, ${goldHi}, ${goldDim}) !important; border-radius: 3px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
