// Millennium Items: lapis lazuli inlaid in gold. Cloisonne collar frames
// (gold cells over lapis, like the nemes and the usekh collar), the Wedjat
// eye, a khekher frieze cresting each panel, and Nut's starry tomb ceiling.
import { mix } from '../../../lib/color.js';

export default (t, kit) => {
  const { SEL, sel, svgUrl, svg, alpha, n1 } = kit;
  // DuelingBook's pop-up buttons (OK/Yes primary, No/Cancel secondary) are
  // <img> SVGs: redrawn here in the theme's material. Palettes are
  // [top, middle, bottom, edge, inner line, label].
  const btnFace = (P, S, rx, extra = () => '') => (l, w, h, p) => {
    const c = p ? P : S;
    const bw = n1(w - 12);
    const bh = n1(h - 20);
    return svg(w, h, `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".5" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="${bh}" rx="${rx}" fill="url(#b)" stroke="${c[3]}" stroke-width="3"/><rect x="10.5" y="14.5" width="${n1(bw - 9)}" height="${n1(bh - 9)}" rx="${Math.max(0, rx - 4)}" fill="none" stroke="${c[4]}" stroke-width="1.5"/>${extra(w, h, p)}<text x="${n1(w / 2)}" y="${n1(h / 2 + 1)}" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="26" fill="${c[5]}">${l}</text>`);
  };
  const popButtons = (face) =>
    [['ok_btn', 'OK', 0, 1], ['yes_btn', 'Yes', 0, 1], ['no_btn', 'No', 0, 0], ['cancel_btn', 'Cancel', 1, 0]]
      .map(([n, l, wide, p]) => `${sel([`#content img[src*="/svg/${n}"]`, `#content img[data-src*="/svg/${n}"]`])} { content: ${svgUrl(face(l, wide ? 234.85 : 153.4, wide ? 78.5 : 78.47, p))} !important; }`)
      .join('\n');
  // Panel titles straddle the frame line: copies of the glyphs in the panel
  // colour, shifted sideways, close the word gaps so the line never shows.
  const titleHalo = (c) => `${[3, 7, 11].map((x) => `-${x}px 0 2px ${c}, ${x}px 0 2px ${c}`).join(', ')}, 0 -3px 2px ${c}, 0 3px 3px ${c}`;
  const gold = t.accent;
  // Polished Millennium gold: pale glints, warm gold, an orange-brown band
  // of shadow and a second glint, like the Items' mirror-bright metal.
  const hi = mix(gold, '#ffffff', 0.45);
  const glint = mix(gold, '#ffffff', 0.72);
  const ochre = mix(mix(gold, t.danger, 0.3), '#000000', 0.42);
  const lo = mix(gold, t.bg, 0.45);
  const brown = mix(ochre, t.bg, 0.45);
  const carnelian = mix(t.danger, gold, 0.3);
  const turquoise = mix(t.success, t.accent2, 0.35);
  const lapis = mix(t.accent2, t.bg, 0.35);
  const lapisDeep = mix(t.accent2, t.bg, 0.72);
  const lapisNight = mix(t.accent2, t.bg, 0.86);
  const stops = [[0, glint], [0.2, gold], [0.42, ochre], [0.58, hi], [0.78, gold], [1, brown]];
  const grad = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient></defs>`;

  // Collar: polished rim, a band of lapis and carnelian cells parted by gold
  // cloisons (the usekh collar), an engraved inner rim.
  const collar = svgUrl(svg(48, 48, `${grad}<rect x="2" y="2" width="44" height="44" rx="5" fill="none" stroke="url(#g)" stroke-width="3.8"/><rect x="2" y="2" width="44" height="44" rx="5" fill="none" stroke="${brown}" stroke-width=".6"/><rect x="6.5" y="6.5" width="35" height="35" rx="2" fill="none" stroke="${lapis}" stroke-width="5"/><rect x="6.5" y="6.5" width="35" height="35" rx="2" fill="none" stroke="${carnelian}" stroke-width="5" stroke-dasharray="3 9" stroke-dashoffset="-1.5"/><rect x="6.5" y="6.5" width="35" height="35" rx="2" fill="none" stroke="${gold}" stroke-width="5" stroke-dasharray="1.2 2.8"/><rect x="10.5" y="10.5" width="27" height="27" fill="none" stroke="${brown}" stroke-width="1.2"/>`));

  // Wedjat eye in polished gold over an engraved dark line.
  const eyeLines = '<path d="M5 4.5Q20-.5 35 4.5"/><path d="M6 10.5Q20 2 34 10.5Q20 15.5 6 10.5Z"/><path d="M34 10.5L39.5 10"/><path d="M17 14L14.8 19.5"/><path d="M23 14Q27 18.5 31.5 17Q34.5 15.5 33 13Q31.5 12 30.5 13.6"/>';
  const eyeBody = (c, p) => `<g fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${eyeLines}</g><circle cx="20" cy="9.6" r="3.4" fill="${p}" stroke="${c}" stroke-width="1"/>`;
  const eye = svgUrl(svg(40, 20, `${grad}<g fill="none" stroke="${brown}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">${eyeLines}</g><g fill="none" stroke="url(#g)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${eyeLines}</g><circle cx="20" cy="9.6" r="3.6" fill="${brown}"/><circle cx="20" cy="9.6" r="2.6" fill="${carnelian}"/><circle cx="19.2" cy="8.8" r=".8" fill="${glint}"/>`));

  // Khekher frieze: knotted reed bundles, gold with a lapis knot.
  const khekher = svgUrl(svg(10, 12, `${grad}<path d="M3 12V6.4Q3 4.6 4.1 4Q3.7 2.6 5 1.6Q6.3 2.6 5.9 4Q7 4.6 7 6.4V12Z" fill="url(#g)"/><rect x="3" y="7.4" width="4" height="1.6" fill="${lapis}"/><circle cx="5" cy="5" r=".9" fill="${carnelian}"/>`));

  // Gold five-point stars on a lapis ceiling.
  const star = (x, y, r, o) => {
    const p = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.42 : r;
      p.push(`${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)}`);
    }
    return `<path d="M${p.join('L')}Z" fill="${gold}" fill-opacity="${o}"/>`;
  };
  const stars = svgUrl(svg(64, 64, star(10, 12, 3.2, 0.32) + star(42, 8, 2.4, 0.22) + star(26, 36, 3.6, 0.28) + star(54, 44, 2.8, 0.24) + star(8, 54, 2.2, 0.2)));

  // Millennium Puzzle: an inverted pyramid with the eye.
  const puzzle = svgUrl(svg(30, 26, `${grad}<path d="M1.5 1.5H28.5L15 24.5Z" fill="url(#g)" stroke="${lo}" stroke-width="1"/><g transform="translate(7.6 4) scale(.37)">${eyeBody(t.bg, gold)}</g>`));

  const goldText = `color: ${hi} !important; text-shadow: var(--mi-title) !important;`;
  const ceiling = `var(--mi-stars), radial-gradient(ellipse 100% 70% at 50% 0%, ${alpha(t.accent2, 0.16)}, transparent 70%), linear-gradient(180deg, ${lapisDeep}, ${lapisNight})`;
  const inlayRing = `repeating-linear-gradient(90deg, ${hi} 0 10px, ${lapis} 10px 16px, ${gold} 16px 18px, ${carnelian} 18px 22px, ${gold} 22px 24px, ${lapis} 24px 30px)`;
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const PANELS = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const panel = (suffix = '') => sel(PANELS.map((p) => `#duel_room ${p}${suffix}`));

  const SETTINGS = SEL.settingsPanel;

  return `
html body {
  --mi-title: 0 1px 0 ${ochre}, 0 2px 0 ${brown}, ${titleHalo(lapisNight)}, 0 0 16px ${alpha(gold, 0.35)};
  --mi-collar: ${collar};
  --mi-eye: ${eye};
  --mi-khekher: ${khekher};
  --mi-stars: ${stars};
  --mi-puzzle: ${puzzle};
}
/* ---------- Menu tiles: inlaid collars, khekher cresting, the Wedjat eye ---------- */
${SEL.tile} {
  background: radial-gradient(ellipse 80% 90% at 50% 120%, ${alpha(t.accent2, 0.28)}, transparent 70%), linear-gradient(180deg, ${mix(lapisDeep, t.raised, 0.4)}, ${lapisNight}) !important;
  border-image: var(--mi-collar) 16 / 14px / 0 round !important;
  box-shadow: 0 12px 24px -12px ${alpha('#000000', 0.9)} !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; left: 14px; right: 14px; top: -9px; height: 10px;
  background: var(--mi-khekher) 0 0 / 8px 10px repeat-x; pointer-events: none; opacity: 0.85;
  filter: drop-shadow(0 -1px 0 ${alpha('#000000', 0.6)});
}
${sel(['#main_menu .menu_btn .content::after'])} {
  content: ""; position: absolute; left: 0; right: 0; bottom: -7px; height: 11px;
  background: var(--mi-eye) center / 21px 10.5px no-repeat; pointer-events: none;
  filter: drop-shadow(0 1px 1px ${alpha('#000000', 0.9)}); opacity: 0.8; transition: opacity 0.2s, filter 0.2s;
}
${SEL.tileHover} {
  background: radial-gradient(ellipse 80% 100% at 50% 120%, ${alpha(t.accent2, 0.55)}, transparent 75%), linear-gradient(180deg, ${mix(lapis, t.raised, 0.5)}, ${lapisDeep}) !important;
  box-shadow: 0 0 22px -6px ${alpha(gold, 0.65)}, 0 12px 24px -12px ${alpha('#000000', 0.9)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::after'])} { opacity: 1; pointer-events: auto; filter: drop-shadow(0 0 5px ${alpha(gold, 0.95)}); }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${lapisNight} !important; box-shadow: inset 0 3px 10px ${alpha('#000000', 0.85)} !important; }
${SEL.tileLabel} { transform: scale(0.9); color: ${mix(glint, gold, 0.35)} !important; text-shadow: 0 1px 0 ${ochre}, 0 2px 0 ${brown}, 0 0 12px ${alpha(t.accent2, 0.6)} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${glint} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu'])} { border-image: none !important; box-shadow: inset 0 -2px 0 ${alpha(gold, 0.4)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu::before', '#main_menu .menu_btn .content.dbte-small-menu::after'])} { content: none; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${gold} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background: radial-gradient(circle at 40% 35%, ${glint}, ${gold} 55%, ${ochre}) !important; }

/* ---------- Headings ---------- */
${sel(['#content .title1', '#content .title2', '#content .subtitle', '#content .admin_lbl'])} { ${goldText} }

/* ---------- Buttons: lapis tablets set in gold ---------- */
${SEL.button} {
  background: linear-gradient(180deg, ${mix(lapis, t.raised, 0.35)}, ${lapisDeep} 60%, ${lapisNight}) !important;
  border-color: ${gold} !important;
  border-radius: 3px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(hi, 0.5)}, inset 0 0 0 1px ${alpha(t.bg, 0.8)}, 0 2px 4px ${alpha('#000000', 0.6)} !important;
}
${SEL.buttonHover} {
  background: linear-gradient(180deg, ${mix(t.accent2, t.raised, 0.25)}, ${lapis}) !important;
  border-color: ${hi} !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(hi, 0.7)}, 0 0 10px -1px ${alpha(gold, 0.7)} !important;
}
${SEL.buttonDown} { background: ${lapisNight} !important; border-color: ${gold} !important; box-shadow: inset 0 2px 6px ${alpha('#000000', 0.9)} !important; }

/* ---------- Text fields ---------- */
${SEL.field} {
  background-color: ${lapisNight} !important;
  border-color: ${lo} !important;
  box-shadow: inset 0 2px 4px ${alpha('#000000', 0.7)}, inset 0 -1px 0 ${alpha(t.accent2, 0.4)} !important;
}
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px ${alpha('#000000', 0.7)}, 0 0 8px ${alpha(t.accent2, 0.6)} !important; }

/* ---------- Pop-ups: a tomb ceiling inside a gold collar, the Eye above ---------- */
${SEL.dialog} {
  background: ${ceiling} !important;
  border-radius: 8px !important;
  box-shadow: 0 0 0 1px ${lo}, 0 0 0 3px ${alpha('#000000', 0.7)}, 0 30px 70px -20px ${alpha('#000000', 0.95)}, 0 0 60px -20px ${alpha(t.accent2, 0.5)} !important;
}
${sel(DIALOGS.map((d) => `#content ${d}::before`))} {
  content: ""; position: absolute; inset: 0; width: auto; height: auto; transform: none;
  border: 20px solid transparent; border-image: var(--mi-collar) 16 / 20px / 0 round; background: none; pointer-events: none; z-index: 0;
}
${sel(DIALOGS.map((d) => `#content ${d}::after`))} {
  content: ""; position: absolute; left: 50%; top: -22px; right: auto; bottom: auto; width: 88px; height: 44px; margin-left: -44px; transform: none;
  background: var(--mi-eye) center / 72px 36px no-repeat, radial-gradient(ellipse 50% 45% at 50% 50%, ${lapisDeep} 60%, transparent 62%);
  pointer-events: none; z-index: 1; filter: drop-shadow(0 0 8px ${alpha(gold, 0.6)});
}
${SEL.dialogTitle} { ${goldText} }

/* ---------- Chat: lapis lintel with a khekher frieze ---------- */
${SEL.chatTop} {
  background: linear-gradient(180deg, ${mix(lapis, t.raised, 0.3)}, ${lapisDeep}) !important;
  box-shadow: inset 0 1px 0 ${alpha(hi, 0.55)}, inset 0 -2px 0 ${gold}, inset 0 -4px 0 ${lapisNight}, inset 0 -5px 0 ${lo} !important;
}
${sel(['#chats .chat .chat_top_bg::after'])} {
  content: ""; position: absolute; left: 8px; right: 34px; bottom: -6px; height: 7px; background: var(--mi-khekher) 0 0 / 6px 7px repeat-x; pointer-events: none;
}
${sel(['#chats .chat .chat_top span'])} { color: ${hi} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.85)} !important; }
${SEL.chat} {
  background: ${ceiling} !important;
  box-shadow: inset 2px 0 0 ${gold}, inset -2px 0 0 ${gold}, inset 4px 0 0 ${lapis}, inset -4px 0 0 ${lapis}, inset 5px 0 0 ${lo}, inset -5px 0 0 ${lo} !important;
}
${sel(['#chats .chat .cout_txt', '#chats .chat .log_txt'])} { background-color: transparent !important; }
${sel(['#chats .chat .chat_bottom'])} { background: ${lapisNight} !important; box-shadow: inset 0 2px 0 ${gold}; }

/* ---------- Duel: the Eye watches each life total ---------- */
${SEL.life} {
  border-color: ${gold} !important;
  background: linear-gradient(180deg, ${alpha('#ffffff', 0.22)}, transparent 45%) !important;
  box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 0 0 3px ${lapis}, 0 0 0 4px ${lo}, 0 0 12px -2px ${alpha(gold, 0.55)} !important;
}
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -36px; top: -1px; width: 30px; height: 15px;
  background: var(--mi-eye) center / contain no-repeat; filter: drop-shadow(0 1px 1px ${alpha('#000000', 0.9)});
}
${SEL.lifeSelf} { background: linear-gradient(90deg, ${mix(t.self, '#000000', 0.55)}, ${t.self} 75%, ${mix(t.self, gold, 0.4)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(90deg, ${mix(t.opp, '#000000', 0.55)}, ${t.opp} 75%, ${mix(t.opp, '#ffffff', 0.3)}) !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, 0 0 6px ${alpha('#000000', 0.8)} !important; }

/* Phases: gold rings with a lapis inlay; the active one wears the Puzzle */
${SEL.phase} { background: linear-gradient(180deg, ${glint}, ${gold} 20%, ${ochre} 42%, ${hi} 58%, ${gold} 78%, ${brown}) !important; box-shadow: 0 2px 6px ${alpha('#000000', 0.8)}; }
${sel(['#duel .phase .background .background_top'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 55%) !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${lapis} !important; box-shadow: inset 0 0 0 2px ${lapisNight}; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(lapisDeep, t.raised, 0.5)}, ${lapisNight} 80%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.self, '#ffffff', 0.2)}, ${t.self} 45%, ${mix(t.self, '#000000', 0.5)} 85%) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.opp, '#ffffff', 0.2)}, ${t.opp} 45%, ${mix(t.opp, '#000000', 0.5)} 85%) !important; }
${sel(['#duel .phase.active .background::before'])} {
  content: ""; position: absolute; left: 50%; top: -15px; width: 22px; height: 19px; margin-left: -11px;
  background: var(--mi-puzzle) center / contain no-repeat; filter: drop-shadow(0 0 4px ${alpha(gold, 0.9)});
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 0 2px ${alpha(t.bg, 0.8)}, 0 0 14px 2px ${alpha(gold, 0.6)}; }
${sel(['#duel .phase span'])} { color: ${mix(t.accent2, t.text, 0.4)} !important; }
${sel(['#duel .phase.active span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${alpha('#000000', 0.9)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${glint}, ${gold} 20%, ${ochre} 42%, ${hi} 58%, ${gold} 78%, ${brown}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${lapis}, ${lapisDeep}) !important; }
${sel(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span'])} { color: ${hi} !important; }
${sel(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${lo}, inset 0 2px 0 ${alpha(t.accent2, 0.5)}; }
${sel(['#duel .cout_txt'])} { background: ${ceiling} !important; box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 4px ${lapis}, inset 0 0 0 5px ${lo} !important; }
${sel(['#duel #preview_txt'])} { box-shadow: inset 0 0 0 1px ${lo}, inset 0 3px 0 ${alpha(t.accent2, 0.45)}; }

/* ---------- Duel room: inlaid gold rims over the starry ceiling ---------- */
${panel('::before')} { background: ${inlayRing} !important; filter: none !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: repeating-linear-gradient(90deg, ${hi} 0 12px, ${t.accent2} 12px 18px, ${hi} 18px 20px, ${t.accent2} 20px 26px) !important; }
${panel()} { background: ${ceiling} !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.9)}, 0 0 0 1px ${alpha('#000000', 0.6)}; }
${panel('::after')} {
  content: ""; position: absolute; left: 50%; bottom: -9px; width: 26px; height: 22px; margin-left: -13px; background: var(--mi-puzzle) center / contain no-repeat;
  filter: drop-shadow(0 1px 1px ${alpha('#000000', 0.9)});
}
${sel(['#duel_room #formats .format .format_inner', '#duel_room #formats .format_inner[id]'])} { background-color: ${alpha(lapisNight, 0.82)} !important; }
${sel(['#duel_room .format_txt', '#duel_room span.arial_black2', '#duel_room .title_txt.arial_black2'])} { ${goldText} }
${sel(['#duel_room .duelbutton'])} { border-color: transparent !important; box-shadow: inset 0 -1px 0 ${alpha(gold, 0.3)}; }
${sel(['#duel_room .duelbutton .background'])} { background-color: ${mix(lapisDeep, t.raised, 0.3)} !important; opacity: 0.9 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(t.accent2, 0.4)}, ${alpha(t.accent2, 0.08)}) !important; }
${sel(['#duel_room .duelbutton .game_type'])} { color: ${gold} !important; }

/* ---------- Deck constructor ---------- */
${sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg'])} {
  background: ${ceiling} !important;
  box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 4px ${lapis}, inset 0 0 0 5px ${lo} !important;
}
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { ${goldText} opacity: 1 !important; }
${sel(['#deck_constructor #search .search_bg'])} {
  background: ${ceiling} !important;
  box-shadow: inset 0 0 0 1px ${lo}, inset 0 3px 0 ${gold}, inset 0 6px 0 ${lapis}, inset 0 7px 0 ${lo} !important;
}
${sel(['#deck_constructor #search .title_txt'])} { ${goldText} }
${sel(['#deck_constructor #search .search_prev_btn', '#deck_constructor #search .search_next_btn'])} { background-color: ${gold} !important; }
${sel(['#deck_constructor #search .search_prev_btn:hover', '#deck_constructor #search .search_next_btn:hover'])} { background-color: ${hi} !important; }

/* ---------- Pop-up buttons ---------- */
${popButtons(btnFace([glint, gold, ochre, brown, lapis, t.accentText], [mix(lapis, t.raised, 0.3), lapisDeep, lapisNight, gold, alpha(hi, 0.45), t.text], 6, (w, h) => `<g fill="${carnelian}" stroke="${hi}" stroke-width="1.4"><circle cx="20" cy="${n1(h / 2)}" r="4.2"/><circle cx="${n1(w - 20)}" cy="${n1(h / 2)}" r="4.2"/></g>`))}

/* ---------- Settings panels ---------- */
${SETTINGS} { background: ${ceiling} !important; border-image: var(--mi-collar) 16 / 14px / 0 round !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.9)} !important; }

/* ---------- Scrollbars ---------- */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${gold}, ${lapis}, ${gold}) !important; }
${sel(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: linear-gradient(180deg, ${hi}, ${t.accent2}, ${hi}) !important; }

@media (prefers-reduced-motion: reduce) { html body #content * { transition: none !important; } }
`;
};
