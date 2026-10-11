// Trap Card: something is set and waiting. Riveted dark-iron plates in Trap magenta,
// hazard chevrons along the edges, a chain at each life total, the TRAP
// medallion, and phase buttons ringed like sprung jaws.
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
  // Trap magenta-purple over dark iron (not candy pink).
  const mag = mix(mix(t.accent, t.opp, 0.15), t.bg, 0.25);
  const amber = t.accent2;
  const magHi = mix(mag, '#ffffff', 0.35);
  const magLo = mix(mag, t.bg, 0.55);
  const plate = mix(t.raised, t.bg, 0.25);
  const plateDark = mix(t.surface, t.bg, 0.55);
  const steel = mix(t.muted, t.bg, 0.25);
  const steelHi = mix(t.muted, '#ffffff', 0.35);

  const hazard = (w = 10) => `repeating-linear-gradient(-45deg, ${mag} 0 ${w}px, ${mix(t.bg, '#000000', 0.3)} ${w}px ${w * 2}px)`;
  const rivet = (x, y, s = 5) => `radial-gradient(circle at ${x} ${y}, ${steelHi} 0 1px, ${steel} ${s * 0.3}px, ${alpha('#000000', 0.7)} ${s * 0.5}px, transparent ${s * 0.6}px)`;
  const rivets = (inset) => [rivet(`${inset}px`, `${inset}px`), rivet(`calc(100% - ${inset}px)`, `${inset}px`), rivet(`${inset}px`, `calc(100% - ${inset}px)`), rivet(`calc(100% - ${inset}px)`, `calc(100% - ${inset}px)`)].join(', ');

  // Chain links, steel tinted with Trap magenta.
  const linkStroke = mix(steelHi, mag, 0.15);
  const chainRow = svgUrl(svg(22, 10, `<rect x="1" y="1.8" width="12.5" height="6.4" rx="3.2" fill="none" stroke="${linkStroke}" stroke-width="1.8"/><rect x="11.5" y="4" width="10.5" height="2" rx="1" fill="${linkStroke}"/><rect x="1" y="1.8" width="12.5" height="6.4" rx="3.2" fill="none" stroke="${alpha('#000000', 0.5)}" stroke-width=".6" transform="translate(.6 .8)"/>`));

  // TRAP medallion: magenta disc, white rim, the Trap kanji as on the card's attribute icon.
  const medal = svgUrl(svg(32, 32, `<defs><radialGradient id="m" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${magHi}"/><stop offset=".6" stop-color="${mag}"/><stop offset="1" stop-color="${magLo}"/></radialGradient></defs><circle cx="16" cy="16" r="14.5" fill="url(#m)" stroke="${t.text}" stroke-width="2"/><circle cx="16" cy="16" r="10.5" fill="none" stroke="${alpha(t.text, 0.5)}" stroke-width=".8"/><text x="16" y="16.5" dominant-baseline="central" text-anchor="middle" font-family="Yu Mincho,MS Mincho,Noto Serif CJK JP,serif" font-weight="700" font-size="15" fill="${t.text}">罠</text>`));


  const bevel = `inset 1px 1px 0 ${alpha(magHi, 0.35)}, inset -1px -1px 0 ${alpha('#000000', 0.7)}`;
  const brushed = `repeating-linear-gradient(90deg, ${alpha(t.text, 0.025)} 0 1px, transparent 1px 3px)`;
  const plateBg = `${brushed}, linear-gradient(180deg, ${plate}, ${plateDark})`;
  const warnText = `color: ${mix(mag, '#ffffff', 0.62)} !important; text-shadow: var(--tr-title) !important;`;
  // Page and pop-up titles: a soft shadow only, no backing plate.
  const pageText = `color: ${mix(mag, '#ffffff', 0.62)} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, 0 2px 8px ${alpha('#000000', 0.85)}, 0 0 16px ${alpha(mag, 0.45)} !important;`;
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const PANELS = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const panel = (suffix = '') => sel(PANELS.map((p) => `#duel_room ${p}${suffix}`));

  const SETTINGS = SEL.settingsPanel;

  return `
html body {
  --tr-rv-s: ${rivets(3)};
  --tr-rv-m: ${rivets(7)};
  --tr-rv-l: ${rivets(10)};
  --tr-title: 0 1px 0 ${alpha('#000000', 0.9)}, ${titleHalo(plateDark)}, 0 0 14px ${alpha(mag, 0.6)};
  --tr-chain: ${chainRow};
  --tr-medal: ${medal};
}
/* The skin's chain wallpaper: larger links, much fainter, so the feed reads. */
/* The skin's chain wallpaper read as paperclips behind the feed: the iron plates carry the theme instead. */
html body #dbte-skin-motif, html body #dbte-skin-motif::before { background: none !important; }

/* ---------- Menu tiles: riveted plates, a hazard strip, chains bound at the corner ---------- */
${SEL.tile} {
  background: var(--tr-rv-m), ${hazard(5)} 0 100% / 100% 5px no-repeat, ${plateBg} !important;
  border-color: ${magLo} !important;
  border-radius: 2px !important;
  box-shadow: ${bevel}, inset 0 0 0 1px ${alpha(mag, 0.35)}, 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${SEL.tileHover} {
  background: var(--tr-rv-m), ${hazard(5)} 0 100% / 100% 5px no-repeat, radial-gradient(ellipse 70% 120% at 50% 100%, ${alpha(mag, 0.35)}, transparent 70%), ${plateBg} !important;
  border-color: ${mag} !important;
  box-shadow: ${bevel}, inset 0 0 0 1px ${mag}, 0 0 20px -6px ${alpha(mag, 0.9)}, 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${sel(['#main_menu .menu_btn:active .content'])} { background: ${hazard(5)} 0 100% / 100% 5px no-repeat, ${plateDark} !important; box-shadow: inset 0 3px 10px ${alpha('#000000', 0.9)} !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${alpha('#000000', 0.85)} !important; }
${sel(['#main_menu .menu_btn > .content:not(.dbte-small-menu) + span', '#main_menu .menu_btn:active > .content:not(.dbte-small-menu) + span'])} { transform: scale(0.9) !important; }
${sel(['#main_menu .menu_btn:hover > .content:not(.dbte-small-menu) + span'])} { transform: translateY(-3px) scale(0.9) !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${mix(amber, '#ffffff', 0.4)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu'])} { background: ${plateBg} !important; box-shadow: inset 4px 0 0 ${mag}, inset 0 -1px 0 ${alpha(mag, 0.3)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu::before'])} { content: none; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${mag} !important; }

/* ---------- Headings ---------- */
${sel(['#content .title1', '#content .title2', '#content .subtitle'])} { ${pageText} }
${sel(['#content .admin_lbl'])} { ${warnText} }

/* ---------- Buttons: riveted switch plates; hover arms them ---------- */
${SEL.button} {
  background: var(--tr-rv-s), ${plateBg} !important;
  border-color: ${magLo} !important;
  border-radius: 1px !important;
  color: ${t.text} !important;
  box-shadow: ${bevel}, 0 2px 3px ${alpha('#000000', 0.75)} !important;
}
${SEL.buttonHover} {
  background: var(--tr-rv-s), linear-gradient(180deg, ${mix(mag, plate, 0.55)}, ${mix(mag, plateDark, 0.75)}) !important;
  border-color: ${amber} !important;
  color: ${t.text} !important;
  box-shadow: ${bevel}, 0 0 9px -1px ${alpha(mag, 0.9)} !important;
}
${SEL.buttonDown} { background: ${plateDark} !important; border-color: ${amber} !important; box-shadow: inset 0 2px 6px ${alpha('#000000', 0.9)} !important; }

/* ---------- Text fields ---------- */
${SEL.field} {
  background-color: ${mix(t.bg, '#000000', 0.2)} !important;
  border-color: ${magLo} !important;
  box-shadow: inset 1px 2px 3px ${alpha('#000000', 0.85)}, 0 1px 0 ${alpha(magHi, 0.18)} !important;
}
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${mag} !important; box-shadow: inset 1px 2px 3px ${alpha('#000000', 0.85)}, 0 0 8px ${alpha(mag, 0.6)} !important; }

/* ---------- Pop-ups: a set Trap, flipped face-up; chained at the top corners ---------- */
${SEL.dialog} {
  background: ${hazard(9)} 0 0 / 100% 8px no-repeat, ${rivets(16)}, radial-gradient(ellipse 70% 60% at 50% 0%, ${alpha(mag, 0.2)}, transparent 70%), ${plateBg} !important;
  border-radius: 3px !important;
  box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 0 0 4px ${mag}, 0 0 0 5px ${magLo}, 0 30px 70px -20px ${alpha('#000000', 0.95)}, 0 0 50px -10px ${alpha(mag, 0.45)} !important;
}
${sel(DIALOGS.map((d) => `#content ${d}::before`))} {
  content: ""; position: absolute; inset: 0; width: auto; height: auto; transform: none; border: none;
  background: none;
  pointer-events: none; z-index: 0;
}
${sel(DIALOGS.map((d) => `#content ${d}::after`))} {
  content: ""; position: absolute; left: auto; right: -16px; top: -16px; bottom: auto; width: 42px; height: 42px; transform: none;
  background: var(--tr-medal) center / contain no-repeat; filter: drop-shadow(0 2px 3px ${alpha('#000000', 0.85)}); pointer-events: none; z-index: 1;
}
${SEL.dialogTitle} { ${pageText} }
${sel(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d} .body_txt`))} { color: ${t.text} !important; }

/* ---------- Chat: a hazard-banded hatch ---------- */
${SEL.chatTop} {
  background: ${hazard(5)} 0 100% / 100% 4px no-repeat, linear-gradient(180deg, ${mix(mag, plate, 0.45)}, ${mix(mag, plateDark, 0.7)}) !important;
  box-shadow: inset 0 1px 0 ${alpha(magHi, 0.55)} !important;
}
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important; }
${SEL.chat} {
  background: ${plateBg} !important;
  box-shadow: inset 2px 0 0 ${magLo}, inset -2px 0 0 ${magLo}, inset 3px 0 0 ${alpha('#000000', 0.6)}, inset -3px 0 0 ${alpha('#000000', 0.6)} !important;
}
${sel(['#chats .chat .cout_txt', '#chats .chat .log_txt'])} { background-color: transparent !important; }
${sel(['#chats .chat .chat_bottom'])} { background: var(--tr-chain) 0 0 / 14px 6px repeat-x, ${plateDark} !important; }

/* ---------- Duel ---------- */
${SEL.life} {
  border-color: ${mag} !important;
  background: linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 50%) !important;
  box-shadow: 0 0 0 1px ${alpha('#000000', 0.85)}, inset 0 0 0 1px ${alpha('#000000', 0.5)}, 0 0 10px -2px ${alpha(mag, 0.65)} !important;
}
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -46px; top: 6px; width: 42px; height: 12px;
  background: var(--tr-chain) 0 50% / 21px 9.5px repeat-x; filter: drop-shadow(0 1px 1px ${alpha('#000000', 0.9)});
}
${SEL.lifeSelf} { background: linear-gradient(90deg, ${mix(t.self, '#000000', 0.55)}, ${t.self} 75%, ${mix(t.self, '#ffffff', 0.3)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(90deg, ${mix(t.opp, '#000000', 0.55)}, ${t.opp} 75%, ${mix(t.opp, '#ffffff', 0.3)}) !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, 0 0 6px ${alpha('#000000', 0.8)} !important; }

/* Phases: steel jaws; the active one is sprung */
${SEL.phase} { background: repeating-conic-gradient(${steelHi} 0deg 6deg, ${mix(steel, t.bg, 0.4)} 6deg 15deg) !important; box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 2px 6px ${alpha('#000000', 0.8)}; }
${sel(['#duel .phase .background .background_top'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 50%) !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${plateDark} !important; box-shadow: inset 0 0 0 1px ${magLo}; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${plate}, ${plateDark} 80%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.self, '#ffffff', 0.2)}, ${t.self} 45%, ${mix(t.self, '#000000', 0.55)} 85%) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.opp, '#ffffff', 0.2)}, ${t.opp} 45%, ${mix(t.opp, '#000000', 0.55)} 85%) !important; }
${sel(['#duel .phase.active .background::before'])} {
  content: ""; position: absolute; inset: -7px; border-radius: 50%;
  background: repeating-conic-gradient(${amber} 0deg 7.5deg, transparent 7.5deg 15deg);
  -webkit-mask: radial-gradient(circle, transparent 60%, #000000 62%, #000000 72%, transparent 74%); mask: radial-gradient(circle, transparent 60%, #000000 62%, #000000 72%, transparent 74%);
  filter: drop-shadow(0 0 3px ${mag});
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 0 14px 2px ${alpha(mag, 0.75)}; }
${sel(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important; }
${sel(['#duel .phase.active span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${alpha('#000000', 0.95)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${hazard(4)} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${plateDark} !important; }
${sel(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${magLo}, inset 0 3px 0 ${alpha(mag, 0.5)}; }
${sel(['#duel .cout_txt'])} { background: ${hazard(5)} 0 0 / 100% 4px no-repeat, ${plateBg} !important; box-shadow: inset 0 0 0 2px ${magLo}, ${bevel} !important; }
${sel(['#duel #preview_txt'])} { box-shadow: inset 0 0 0 1px ${magLo}, inset 0 3px 0 ${alpha(mag, 0.5)}; }

/* ---------- Duel room: plates in a Trap frame, chained at the corner ---------- */
${panel('::before')} { background: linear-gradient(135deg, ${magHi}, ${mag} 35%, ${magLo} 70%, ${mag}) !important; filter: none !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: ${hazard(6)} !important; }
${panel()} { background: var(--tr-rv-l), ${plateBg} !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.95)}; }
${sel(['#duel_room #formats .format .format_inner', '#duel_room #formats .format_inner[id]'])} { background-color: ${alpha(plateDark, 0.85)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background-color: ${plate} !important; opacity: 0.88 !important; }
${sel(['#duel_room .format_txt', '#duel_room span.arial_black2', '#duel_room .title_txt.arial_black2'])} { ${warnText} }
${sel(['#duel_room .duelbutton'])} { border-color: transparent !important; box-shadow: inset 0 -1px 0 ${alpha(mag, 0.3)}; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(mag, 0.35)}, ${alpha(mag, 0.06)}) !important; opacity: 1 !important; }
${sel(['#duel_room .duelbutton .game_type'])} { color: ${amber} !important; }

/* ---------- Deck constructor ---------- */
${sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg'])} {
  background: var(--tr-rv-l), ${plateBg} !important;
  box-shadow: inset 0 0 0 2px ${magLo}, inset 0 0 0 3px ${alpha(mag, 0.5)}, ${bevel} !important;
}
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { ${warnText} opacity: 1 !important; }
${sel(['#deck_constructor #search .search_bg'])} {
  background: ${hazard(6)} 0 0 / 100% 6px no-repeat, var(--tr-rv-l), ${plateBg} !important;
  box-shadow: inset 0 0 0 2px ${magLo} !important;
}
${sel(['#deck_constructor #search .title_txt'])} { ${pageText} }
${sel(['#deck_constructor #search .search_prev_btn', '#deck_constructor #search .search_next_btn'])} { background-color: ${mag} !important; }
${sel(['#deck_constructor #search .search_prev_btn:hover', '#deck_constructor #search .search_next_btn:hover'])} { background-color: ${amber} !important; }

/* ---------- Pop-up buttons ---------- */
${popButtons(btnFace([magHi, mag, mix(mag, t.bg, 0.4), mix(mag, t.bg, 0.75), alpha('#ffffff', 0.4), t.accentText], [plate, plateDark, mix(plateDark, t.bg, 0.4), mag, alpha(magHi, 0.3), t.text], 3, (w, h) => `<g fill="${steelHi}" stroke="${alpha('#000000', 0.6)}" stroke-width=".8">${[[13, 17], [w - 13, 17], [13, h - 17], [w - 13, h - 17]].map(([x, y]) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="2.6"/>`).join('')}</g>`))}

/* ---------- Settings panels ---------- */
${SETTINGS} { background: var(--tr-rv-l), ${hazard(5)} 0 100% / 100% 5px no-repeat, ${plateBg} !important; border-color: ${mag} !important; border-radius: 3px !important; box-shadow: ${bevel}, 0 12px 26px -12px ${alpha('#000000', 0.95)} !important; }

/* ---------- Scrollbars ---------- */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${magLo}, ${mag}, ${magLo}) !important; }
${sel(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: ${amber} !important; }

@media (prefers-reduced-motion: reduce) { html body #content *, html body #content *::before, html body #content *::after { transition: none !important; animation: none !important; } }
`;
};
