// Trap Card: something is set and waiting. Riveted plates in Trap magenta,
// hazard chevrons along the edges, chains binding the corners, the TRAP
// medallion, and phase buttons ringed like sprung jaws.
import { mix } from '../../../lib/color.js';

export default (t, kit) => {
  const { SEL, sel, svgUrl, svg, alpha } = kit;
  const mag = t.accent;
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
  // Three links bound diagonally across a corner.
  const cornerChain = svgUrl(svg(44, 44, `<g transform="rotate(-45 22 22)" fill="none" stroke-linecap="round"><g stroke="${alpha('#000000', 0.6)}" stroke-width="3.6" transform="translate(1 1.4)"><rect x="-2" y="18.5" width="15" height="7" rx="3.5"/><rect x="11" y="21" width="12" height="2" rx="1"/><rect x="21" y="18.5" width="15" height="7" rx="3.5"/><rect x="34" y="21" width="12" height="2" rx="1"/></g><g stroke="${linkStroke}" stroke-width="2.2"><rect x="-2" y="18.5" width="15" height="7" rx="3.5"/><rect x="11" y="21" width="12" height="2" rx="1"/><rect x="21" y="18.5" width="15" height="7" rx="3.5"/><rect x="34" y="21" width="12" height="2" rx="1"/></g></g>`));

  // TRAP medallion: magenta disc, white rim, a sprung jaw.
  const medal = svgUrl(svg(32, 32, `<defs><radialGradient id="m" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${magHi}"/><stop offset=".6" stop-color="${mag}"/><stop offset="1" stop-color="${magLo}"/></radialGradient></defs><circle cx="16" cy="16" r="14.5" fill="url(#m)" stroke="${t.text}" stroke-width="2"/><g fill="none" stroke="${t.text}" stroke-width="1.8" stroke-linejoin="round"><path d="M7 13.5l3 3.2 3-3.2 3 3.2 3-3.2 3 3.2 3-3.2"/><path d="M7 19l3-3 3 3 3-3 3 3 3-3 3 3"/><path d="M6.5 11.5Q16 4 25.5 11.5M6.5 21Q16 28.5 25.5 21"/></g>`));

  const typeLine = svgUrl(svg(130, 18, `<text x="0" y="13.5" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="13" letter-spacing="1.5" fill="${mix(t.text, mag, 0.25)}">[TRAP CARD]</text>`));

  const bevel = `inset 1px 1px 0 ${alpha(magHi, 0.35)}, inset -1px -1px 0 ${alpha('#000000', 0.7)}`;
  const brushed = `repeating-linear-gradient(90deg, ${alpha(t.text, 0.025)} 0 1px, transparent 1px 3px)`;
  const plateBg = `${brushed}, linear-gradient(180deg, ${plate}, ${plateDark})`;
  const warnText = `color: ${mix(mag, '#ffffff', 0.62)} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, -2px 0 2px ${t.bg}, 2px 0 2px ${t.bg}, 0 -2px 2px ${t.bg}, 0 0 14px ${alpha(mag, 0.6)} !important;`;
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const PANELS = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const panel = (suffix = '') => sel(PANELS.map((p) => `#duel_room ${p}${suffix}`));

  const SETTINGS = sel(['.about_me', '.preferences', '.social_media', '.animation', '.profile_song', '.account', '.messages', '.duel_stats', '.profile_comments'].map((s) => `#settings ${s}`));

  return `
html body {
  --tr-chain: ${chainRow};
  --tr-corner: ${cornerChain};
  --tr-medal: ${medal};
  --tr-type: ${typeLine};
}
/* ---------- Menu tiles: riveted plates, a hazard strip, chains bound at the corner ---------- */
${SEL.tile} {
  background: ${rivets(7)}, ${hazard(5)} 0 100% / 100% 5px no-repeat, ${plateBg} !important;
  border-color: ${magLo} !important;
  border-radius: 2px !important;
  box-shadow: ${bevel}, inset 0 0 0 1px ${alpha(mag, 0.35)}, 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; left: -15px; top: -15px; width: 40px; height: 40px; pointer-events: none;
  background: var(--tr-corner) center / contain no-repeat; transition: filter 0.2s;
}
${SEL.tileHover} {
  background: ${rivets(7)}, ${hazard(5)} 0 100% / 100% 5px no-repeat, radial-gradient(ellipse 70% 120% at 50% 100%, ${alpha(mag, 0.35)}, transparent 70%), ${plateBg} !important;
  border-color: ${mag} !important;
  box-shadow: ${bevel}, inset 0 0 0 1px ${mag}, 0 0 20px -6px ${alpha(mag, 0.9)}, 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { filter: drop-shadow(0 0 4px ${amber}); }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${hazard(5)} 0 100% / 100% 5px no-repeat, ${plateDark} !important; box-shadow: inset 0 3px 10px ${alpha('#000000', 0.9)} !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${alpha('#000000', 0.85)} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${mix(amber, '#ffffff', 0.4)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu'])} { background: ${plateBg} !important; box-shadow: inset 4px 0 0 ${mag}, inset 0 -1px 0 ${alpha(mag, 0.3)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu::before'])} { content: none; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${mag} !important; }

/* ---------- Headings ---------- */
${sel(['#content .title1', '#content .title2', '#content .subtitle', '#content .admin_lbl'])} { ${warnText} }

/* ---------- Buttons: riveted switch plates; hover arms them ---------- */
${SEL.button} {
  background: ${rivets(3)}, ${plateBg} !important;
  border-color: ${magLo} !important;
  border-radius: 1px !important;
  color: ${t.text} !important;
  box-shadow: ${bevel}, 0 2px 3px ${alpha('#000000', 0.75)} !important;
}
${SEL.buttonHover} {
  background: ${rivets(3)}, linear-gradient(180deg, ${mix(mag, plate, 0.55)}, ${mix(mag, plateDark, 0.75)}) !important;
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
  background: var(--tr-type) calc(100% - 30px) 50px / 130px 18px no-repeat, var(--tr-corner) -14px -14px / 60px 60px no-repeat;
  pointer-events: none; z-index: 0;
}
${sel(DIALOGS.map((d) => `#content ${d}::after`))} {
  content: ""; position: absolute; left: auto; right: -16px; top: -16px; bottom: auto; width: 42px; height: 42px; transform: none;
  background: var(--tr-medal) center / contain no-repeat; filter: drop-shadow(0 2px 3px ${alpha('#000000', 0.85)}); pointer-events: none; z-index: 1;
}
${SEL.dialogTitle} { ${warnText} }

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
${panel()} { background: ${rivets(10)}, ${plateBg} !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.95)}; }
${panel('::after')} {
  content: ""; position: absolute; left: -12px; bottom: -12px; width: 34px; height: 34px; background: var(--tr-corner) center / contain no-repeat; transform: scaleY(-1);
}
${sel(['#duel_room #formats .format .format_inner', '#duel_room #formats .format_inner[id]'])} { background-color: ${alpha(plateDark, 0.85)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background-color: ${plate} !important; opacity: 0.88 !important; }
${sel(['#duel_room .format_txt', '#duel_room span.arial_black2', '#duel_room .title_txt.arial_black2'])} { ${warnText} }
${sel(['#duel_room .duelbutton'])} { border-color: transparent !important; box-shadow: inset 0 -1px 0 ${alpha(mag, 0.3)}; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(mag, 0.35)}, ${alpha(mag, 0.06)}) !important; opacity: 1 !important; }
${sel(['#duel_room .duelbutton .game_type'])} { color: ${amber} !important; }

/* ---------- Deck constructor ---------- */
${sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg'])} {
  background: ${rivets(8)}, ${plateBg} !important;
  box-shadow: inset 0 0 0 2px ${magLo}, inset 0 0 0 3px ${alpha(mag, 0.5)}, ${bevel} !important;
}
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { ${warnText} opacity: 1 !important; }
${sel(['#deck_constructor #search .search_bg'])} {
  background: ${hazard(6)} 0 0 / 100% 6px no-repeat, ${rivets(10)}, ${plateBg} !important;
  box-shadow: inset 0 0 0 2px ${magLo} !important;
}
${sel(['#deck_constructor #search .title_txt'])} { ${warnText} }
${sel(['#deck_constructor #search .search_prev_btn', '#deck_constructor #search .search_next_btn'])} { background-color: ${mag} !important; }
${sel(['#deck_constructor #search .search_prev_btn:hover', '#deck_constructor #search .search_next_btn:hover'])} { background-color: ${amber} !important; }

/* ---------- Settings panels ---------- */
${SETTINGS} { background: ${rivets(10)}, ${hazard(5)} 0 100% / 100% 5px no-repeat, ${plateBg} !important; border-color: ${mag} !important; border-radius: 3px !important; box-shadow: ${bevel}, 0 12px 26px -12px ${alpha('#000000', 0.95)} !important; }

/* ---------- Scrollbars ---------- */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${magLo}, ${mag}, ${magLo}) !important; }
${sel(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: ${amber} !important; }

@media (prefers-reduced-motion: reduce) { html body #content *, html body #content *::before, html body #content *::after { transition: none !important; animation: none !important; } }
`;
};
