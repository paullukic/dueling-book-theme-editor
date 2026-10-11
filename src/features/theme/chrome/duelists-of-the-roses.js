// duelists-of-the-roses: the PlayStation 2 game's interface. Panels are
// crimson lacquer inside a gold filigree frame (double rule, C-scroll
// corners, a crowned finial on the top corners); titles sit on gold-edged
// dark plaques like the turn counter; life points are the game's teal
// (player) and crimson (enemy) panels; pop-ups carry a rose medallion and
// the hovered menu tile a red rose. A soft PS2 bloom on gold edges.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha, n1 }) => {
  const gold = t.accent;
  const goldHi = mix(gold, '#ffffff', 0.5);
  const goldLo = mix(gold, t.bg, 0.45);
  const lacquer = mix(t.opp, t.surface, 0.55);
  const lacquerDeep = mix(t.opp, t.bg, 0.78);
  const teal = mix(t.self, t.bg, 0.35);
  const ink = mix(t.bg, '#000000', 0.3);
  const rose = t.danger;

  // Gold filigree frame (nine-slice, 60px art, 20px slice): double rule, C-scroll corners.
  const scrollCorner = `<path d="M3 18V8Q3 3 8 3H18" fill="none" stroke="${gold}" stroke-width="2.4"/><path d="M7 19V10Q7 7 10 7H19" fill="none" stroke="${goldLo}" stroke-width="1.2"/><path d="M9.5 15.5c0-4 2-6 6-6c2.6 0 3 3 0.8 3.4c-1.6 0.3-2-1.2-1-1.6" fill="none" stroke="${goldHi}" stroke-width="1.4" stroke-linecap="round"/><circle cx="3" cy="3" r="2.6" fill="${goldHi}"/>`;
  const frameSvg = svg(60, 60, `<g fill="none"><rect x="1.5" y="1.5" width="57" height="57" stroke="${gold}" stroke-width="2.4"/><rect x="5.5" y="5.5" width="49" height="49" stroke="${goldLo}" stroke-width="1"/></g>${scrollCorner}<g transform="matrix(-1 0 0 1 60 0)">${scrollCorner}</g><g transform="matrix(1 0 0 -1 0 60)">${scrollCorner}</g><g transform="matrix(-1 0 0 -1 60 60)">${scrollCorner}</g>`);
  const frame = (px = 16) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // A rose from above (five petals, a curled heart), drawn small.
  const roseSvg = (r, base) => {
    const deep = mix(base, t.bg, 0.55);
    const hi = mix(base, '#ffffff', 0.5);
    let p = '';
    [[1, 0, 5], [0.7, 36, 5], [0.45, 10, 4]].forEach(([k, off, n], ring) => {
      for (let i = 0; i < n; i++) {
        const pr = r * k;
        p += `<path d="M0 0C${n1(-0.62 * pr)} ${n1(-0.25 * pr)} ${n1(-0.66 * pr)} ${n1(-0.95 * pr)} 0 ${n1(-pr)}C${n1(0.66 * pr)} ${n1(-0.95 * pr)} ${n1(0.62 * pr)} ${n1(-0.25 * pr)} 0 0Z" transform="rotate(${off + (i * 360) / n})" fill="${ring === 0 ? base : ring === 1 ? mix(base, deep, 0.35) : deep}" stroke="${hi}" stroke-width="${n1(r * 0.04)}"/>`;
      }
    });
    return `${p}<circle r="${n1(r * 0.22)}" fill="${deep}"/><path d="M${n1(r * 0.16)} 0A${n1(r * 0.16)} ${n1(r * 0.16)} 0 1 1 0 ${n1(-r * 0.16)}" fill="none" stroke="${hi}" stroke-width="${n1(r * 0.06)}"/>`;
  };
  // Rose medallion: a red rose in a gold ring with scroll wings and a crown point.
  const medallion = svg(140, 64, `<path d="M42 34c-14-2-26-8-36-20c10 4 22 6 34 6M98 34c14-2 26-8 36-20c-10 4-22 6-34 6" fill="none" stroke="${gold}" stroke-width="3.5" stroke-linecap="round"/><path d="M40 42c-10 2-20 0-28-6M100 42c10 2 20 0 28-6" fill="none" stroke="${goldLo}" stroke-width="2.4" stroke-linecap="round"/><circle cx="70" cy="34" r="27" fill="${ink}" stroke="${gold}" stroke-width="4"/><circle cx="70" cy="34" r="22" fill="none" stroke="${goldLo}" stroke-width="1.2"/><g transform="translate(70 35)">${roseSvg(17, rose)}</g><path d="M62 6l4 4 4-7 4 7 4-4-2 6H64Z" fill="${goldHi}"/>`);
  // Crowned finial for the top corners of tiles.
  const finial = svg(26, 22, `<path d="M3 21h20l-2-6H5Z" fill="${goldLo}"/><path d="M5 15l-2-9 6 4 4-8 4 8 6-4-2 9Z" fill="${gold}" stroke="${goldHi}" stroke-width="0.8"/><circle cx="13" cy="2.5" r="2" fill="${goldHi}"/>`);
  const roseCursor = svg(30, 30, `<g transform="translate(15 15)">${roseSvg(13, rose)}</g>`);
  // LP crests: a rose in a gold ring with small scroll wings (white rose for you, red for the opponent).
  const crest = (base) => svg(46, 40, `<path d="M12 22c-6-1-10-5-11-10c3 3 7 4 11 4M34 22c6-1 10-5 11-10c-3 3-7 4-11 4" fill="none" stroke="${gold}" stroke-width="2.4" stroke-linecap="round"/><circle cx="23" cy="20" r="15" fill="${ink}" stroke="${gold}" stroke-width="3"/><circle cx="23" cy="20" r="11.5" fill="none" stroke="${goldLo}"/><g transform="translate(23 20.5)">${roseSvg(10, base)}</g>`);
  // Phase medallion: a five-lobed gold rose outline around the disc.
  let lobes = '';
  for (let i = 0; i < 5; i++) {
    const a = (i * 72 - 90) * Math.PI / 180;
    lobes += `<circle cx="${n1(32 + Math.cos(a) * 17)}" cy="${n1(32 + Math.sin(a) * 17)}" r="15"/>`;
  }
  const medal = svg(64, 64, `<g fill="${goldLo}">${lobes}</g><g fill="${gold}" transform="translate(32 32) scale(0.92) translate(-32 -32)">${lobes}</g><circle cx="32" cy="32" r="25" fill="${goldHi}"/><circle cx="32" cy="32" r="23" fill="${ink}"/>`);

  const lacquerBg = (lift = 0) => `linear-gradient(180deg, ${alpha('#ffffff', 0.1 + lift)}, transparent 38%), radial-gradient(ellipse 90% 70% at 50% 0%, ${alpha(t.opp, 0.35 + lift)}, transparent 70%), linear-gradient(180deg, ${lacquer}, ${lacquerDeep})`;
  const goldEdge = `0 0 0 1px ${goldLo}, 0 0 0 3px ${gold}, 0 0 0 4px ${ink}`;
  const label = `color: ${t.text} !important; text-shadow: 0 2px 0 ${ink}, 0 0 8px ${alpha(gold, 0.35)} !important;`;
  const plaque = `background: linear-gradient(180deg, ${mix(ink, gold, 0.12)}, ${ink}) !important; box-shadow: 0 0 0 .25em ${ink}, 0 0 0 calc(.25em + 1.5px) ${gold} !important; border-radius: .5em !important;`;

  // Pop-up buttons: crimson lacquer (OK/Yes) or dark wine (No/Cancel) in a gold filigree rim.
  const popBtn = (text, wide, top, bot) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="6" y="9" width="${w - 12}" height="60" rx="6" fill="url(#g)" stroke="${gold}" stroke-width="3"/><rect x="11" y="14" width="${w - 22}" height="50" rx="3" fill="none" stroke="${goldLo}" stroke-width="1.2"/><rect x="11" y="14" width="${w - 22}" height="18" rx="3" fill="#ffffff" fill-opacity="0.1"/>${[[10, 13], [w - 10, 13], [10, 65], [w - 10, 65]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${goldHi}"/>`).join('')}<text x="${w / 2}" y="41.5" dominant-baseline="central" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="25" letter-spacing="1" fill="${t.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const primary = [mix(t.opp, '#ffffff', 0.08), mix(t.opp, t.bg, 0.55)];
  const secondary = [mix(lacquerDeep, t.raised, 0.4), ink];
  const popCss = [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, text, [a, b], wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, a, b))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.6)}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const u = [svgUrl(frameSvg), svgUrl(medallion), svgUrl(finial), svgUrl(roseCursor), svgUrl(crest(t.accent2)), svgUrl(crest(rose)), svgUrl(medal)];
  return `
html body { ${u.map((v, i) => `--dbtc-u${i}: ${v};`).join(' ')} }
/* Menu tiles: crimson lacquer in gold filigree, a crowned finial on the top right corner; hover swaps it for a red rose at the left. */
${SEL.tile} { background: ${lacquerBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 19px stretch !important; border-radius: 0 !important; box-shadow: inset 0 -12px 18px -10px ${alpha('#000000', 0.6)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: auto; right: -9px; top: -12px; width: 26px; height: 22px; pointer-events: none; background: var(--dbtc-u2) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${lacquerBg(0.12)} !important; box-shadow: inset 0 0 22px ${alpha(gold, 0.25)}, 0 0 20px -4px ${alpha(gold, 0.6)}, 0 12px 24px -12px #000000 !important; }
${on(SEL.tileHover, 'before')} { content: ""; position: absolute; right: auto; left: -36px; top: calc(50% - 15px); width: 30px; height: 30px; pointer-events: none; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 0 6px ${alpha(rose, 0.7)}); }
${SEL.tileLabel} { ${label} }

/* Buttons: lacquer with a gold rim. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.12)}, transparent 50%), linear-gradient(180deg, ${lacquer}, ${lacquerDeep}) !important; border-color: ${gold} !important; color: ${t.text} !important; border-radius: 4px !important; box-shadow: inset 0 0 0 1px ${alpha(ink, 0.8)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.2)}, transparent 50%), linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.05)}, ${lacquer}) !important; border-color: ${goldHi} !important; box-shadow: 0 0 10px -2px ${alpha(gold, 0.8)} !important; }
${SEL.buttonDown} { background: ${lacquerDeep} !important; border-color: ${gold} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: lacquer in gold filigree under the rose medallion. */
${SEL.dialog} { background: ${lacquerBg()} !important; border-radius: 4px !important; box-shadow: ${goldEdge}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(18)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 84px); top: -62px; right: auto; bottom: auto; width: 168px; height: 77px; pointer-events: none; z-index: 1; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 3px 3px #000000) drop-shadow(0 0 8px ${alpha(gold, 0.35)}); transform: none; }
${SEL.dialogTitle} { color: ${goldHi} !important; text-shadow: 0 2px 0 ${ink}, 0 0 10px ${alpha(gold, 0.5)} !important; }

/* Chat: a lacquer header with a gold rule. */
${SEL.chatTop} { background: ${lacquerBg()} !important; box-shadow: inset 0 -2px 0 ${gold}, inset 0 -3px 0 ${ink} !important; }
${SEL.chat} { background: linear-gradient(180deg, ${mix(t.surface, lacquerDeep, 0.4)}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${goldLo}, inset -1px 0 0 ${goldLo}, inset 0 -1px 0 ${goldLo} !important; }

/* Duel: teal (player) and crimson (enemy) LP panels in gold; gold-ringed phase discs. */
${SEL.life} { border-color: ${gold} !important; border-radius: 14px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 3px ${goldLo}, 0 0 0 4px ${ink}, 0 0 10px -2px ${alpha(gold, 0.5)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp}, ${sel(['#duel .lifepoints .black_bar'])} { border-radius: 12px !important; }
${SEL.lifeSelf} { background: linear-gradient(0deg, ${gold} 0 3px, transparent 3px), linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.6)}, ${mix(t.self, t.bg, 0.25)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(0deg, ${gold} 0 3px, transparent 3px), linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 50%), linear-gradient(90deg, ${mix(gold, t.bg, 0.62)}, ${mix(gold, t.bg, 0.3)}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.08)}, transparent 50%), ${ink} !important; }
${sel(['#duel .lifepoints'])} { --lp-hit: ${t.danger}; --lp-heal: ${t.success}; }
${on(sel(['#duel #lifepoints1']), 'before')} { content: ""; position: absolute; left: -50px; top: -6px; width: 46px; height: 40px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#duel #lifepoints2']), 'before')} { content: ""; position: absolute; left: -50px; top: -6px; width: 46px; height: 40px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${sel(['#duel #lifepoints1 .life_txt', '#duel #lifepoints2 .life_txt'])} { color: ${mix(t.text, gold, 0.25)} !important; -webkit-text-fill-color: currentColor !important; text-shadow: 0 2px 0 ${ink}, 0 0 4px ${ink} !important; font-family: Georgia, "Times New Roman", serif !important; font-variant-numeric: lining-nums tabular-nums !important; font-feature-settings: "lnum" 1, "tnum" 1 !important; }
/* Our counters sit on their own plate: no extra ink blur behind the number. */
${on(sel(['#duel #lifepoints1.lifepoints .life_txt', '#duel #lifepoints2.lifepoints .life_txt']).replace(/html body/g, 'html:not([data-dbte-lpstyle]) body'), 'before')} { background: none !important; }
${SEL.phase} { background: var(--dbtc-u6) center / 100% 100% no-repeat !important; border-radius: 0 !important; box-shadow: none !important; filter: drop-shadow(0 3px 3px ${alpha('#000000', 0.7)}) drop-shadow(0 0 6px ${alpha(gold, 0.35)}); }
${sel(['#duel .phase.active:has(.phase_inner.red) .background', '#duel .phase.active:has(.phase_inner.blue) .background'])} { background: var(--dbtc-u6) center / 100% 100% no-repeat !important; border-radius: 0 !important; }
${sel(['#duel .phase .background .background_inner', '#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue', '#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue', '#duel .phase.active .background .background_inner'])} { border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${ink} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${lacquer}, ${lacquerDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.self, '#ffffff', 0.2)}, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.7)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.opp, '#ffffff', 0.2)}, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.7)}; }
${sel(['#duel .phase span'])} { color: ${goldHi} !important; text-shadow: 0 2px 0 ${ink} !important; }
${sel(['#duel .phase.active span'])} { color: #ffffff !important; }
${SEL.duelLog} { background: linear-gradient(180deg, ${mix(t.surface, lacquer, 0.3)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 4px ${ink}, inset 0 0 0 5px ${goldLo} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: ${goldEdge} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${goldHi}, ${goldLo}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${ink} !important; }
${sel(['#duel #turn .red', '#duel #start_turn .red', '#duel #end_turn .red'])} { background: ${mix(t.opp, t.bg, 0.25)} !important; filter: none !important; }
${sel(['#duel #turn .blue', '#duel #start_turn .blue', '#duel #end_turn .blue'])} { background: ${teal} !important; filter: none !important; }

/* Duel room: lacquer panels in gold filigree; titles on dark plaques. */
${lobbyBorders} { background: linear-gradient(180deg, ${alpha(lacquer, 0.6)}, ${alpha(t.bg, 0.8)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${goldHi}, ${goldLo} 30%, ${gold} 55%, ${goldLo} 80%, ${goldHi}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${ink} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { ${plaque} }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.14)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.36)}, ${alpha(t.opp, 0.2)}) !important; }
${sel(['#duel_room #yu'])} { filter: none !important; }

/* Deck constructor: the deck list's lacquer rows in gold. */
${deckPanels} { background: linear-gradient(180deg, ${mix(lacquer, t.surface, 0.5)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 4px ${ink}, inset 0 0 0 5px ${goldLo} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${goldLo} !important; background: linear-gradient(180deg, ${alpha(lacquer, 0.75)}, ${alpha(t.bg, 0.85)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: gold with an ink drop and a little bloom. */
${titles} { color: ${goldHi} !important; text-shadow: 0 2px 0 ${ink}, 0 0 3px ${ink}, 0 0 14px ${alpha(gold, 0.45)} !important; }

/* Text fields: dark wells, gold lip. */
${SEL.field} { background-color: ${ink} !important; border-color: ${goldLo} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(gold, 0.25)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(gold, 0.6)} !important; }

/* Scrollbars: gold rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${goldLo}, ${goldHi}, ${goldLo}) !important; border-radius: 3px !important; }

/* Pop-up buttons. */
${popCss}
`;
};
