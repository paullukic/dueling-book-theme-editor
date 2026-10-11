// Pendulum: the split frame of a Pendulum card (monster orange above, spell
// green below), the blue and red Pendulum Scale gems on either side of the
// split, and a pendulum swinging over each pop-up.
import { mix } from '../../../lib/color.js';

export default (t, kit) => {
  const { SEL, sel, svgUrl, svg, alpha } = kit;
  const orange = t.self;
  const green = t.accent;
  const blueScale = t.accent2;
  const redScale = t.danger;
  const gold = t.warning;
  const oDim = mix(orange, t.bg, 0.45);
  const gDim = mix(green, t.bg, 0.5);
  const seam = mix(t.text, gold, 0.3);
  const dark = mix(t.surface, t.bg, 0.4);

  // Split frame: orange above the seam, green below.
  const splitGrad = `<defs><linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(orange, '#ffffff', 0.25)}"/><stop offset=".49" stop-color="${oDim}"/><stop offset=".49" stop-color="${seam}"/><stop offset=".51" stop-color="${seam}"/><stop offset=".51" stop-color="${gDim}"/><stop offset="1" stop-color="${green}"/></linearGradient></defs>`;
  const frame = svgUrl(svg(48, 48, `${splitGrad}<rect x="2.5" y="2.5" width="43" height="43" rx="4" fill="none" stroke="url(#p)" stroke-width="4"/><rect x="7" y="7" width="34" height="34" rx="1" fill="none" stroke="${alpha('#000000', 0.55)}" stroke-width="1"/>`));

  // Scale gems: blue with a left arrow, red with a right arrow.
  const gem = (c, dir) =>
    svgUrl(svg(16, 16, `<path d="M8 .8L15.2 8 8 15.2.8 8z" fill="${c}" stroke="${t.text}" stroke-width="1.2"/><path d="M8 .8L15.2 8H.8z" fill="${alpha('#ffffff', 0.28)}"/><path d="${dir < 0 ? 'M10 5L5.5 8 10 11z' : 'M6 5L10.5 8 6 11z'}" fill="${t.text}"/>`));

  // Pendulum: pivot, rod, a gem bob, and the dashed arc of its swing.
  const pend = svgUrl(svg(100, 40, `<path d="M14 6A44 30 0 0 0 86 6" fill="none" stroke="${gold}" stroke-opacity=".75" stroke-width="1.6" stroke-dasharray="3 3"/><path d="M50 2V28" stroke="${seam}" stroke-width="1.6"/><circle cx="50" cy="2.6" r="2.4" fill="${gold}"/><path d="M50 24L56 31 50 38 44 31z" fill="${orange}" stroke="${t.text}" stroke-width="1.2"/><path d="M44 31H56L50 38z" fill="${green}"/>`));

  const splitBg = (a) => `linear-gradient(180deg, ${alpha(orange, a)} 0%, ${alpha(orange, a * 0.3)} 50%, ${alpha(green, a * 0.3)} 50%, ${alpha(green, a)} 100%)`;
  const splitText = `color: ${t.text} !important; text-shadow: -1px -1px 0 ${oDim}, 1px 2px 0 ${gDim}, -2px 0 3px ${t.bg}, 2px 0 3px ${t.bg}, 0 0 14px ${alpha(green, 0.35)} !important;`;
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const PANELS = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const panel = (suffix = '') => sel(PANELS.map((p) => `#duel_room ${p}${suffix}`));
  const gems = (size, out) => `var(--pe-gem-b) -${out}px 50% / ${size}px ${size}px no-repeat, var(--pe-gem-r) calc(100% + ${out}px) 50% / ${size}px ${size}px no-repeat`;

  const SETTINGS = sel(['.about_me', '.preferences', '.social_media', '.animation', '.profile_song', '.account', '.messages', '.duel_stats', '.profile_comments'].map((s) => `#settings ${s}`));

  return `
html body {
  --pe-frame: ${frame};
  --pe-gem-b: ${gem(blueScale, -1)};
  --pe-gem-r: ${gem(redScale, 1)};
  --pe-pend: ${pend};
}
/* ---------- Menu tiles: split Pendulum frames with the two Scales at the seam ---------- */
${SEL.tile} {
  background: ${splitBg(0.3)}, ${dark} !important;
  border-image: var(--pe-frame) 14 / 8px / 0 stretch !important;
  box-shadow: 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; left: -5px; right: -5px; top: 50%; height: 16px; margin-top: -8px; pointer-events: none;
  background: ${gems(16, 0)}; filter: drop-shadow(0 1px 2px ${alpha('#000000', 0.85)}); transition: filter 0.2s;
}
${SEL.tileHover} {
  background: ${splitBg(0.55)}, ${dark} !important;
  box-shadow: 0 -8px 18px -10px ${alpha(orange, 0.8)}, 0 10px 18px -10px ${alpha(green, 0.8)}, 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { filter: drop-shadow(0 0 5px ${gold}); }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${splitBg(0.15)}, ${mix(dark, t.bg, 0.5)} !important; box-shadow: inset 0 3px 10px ${alpha('#000000', 0.9)} !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${alpha('#000000', 0.85)}, 0 0 8px ${alpha(t.bg, 0.9)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu'])} { border-image: none !important; background: ${dark} !important; box-shadow: inset 3px 0 0 ${orange}, inset -3px 0 0 ${green} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu::before'])} { content: none; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${orange} !important; }

/* ---------- Headings: lit orange from above, green from below ---------- */
${sel(['#content .title1', '#content .title2', '#content .subtitle', '#content .admin_lbl'])} { ${splitText} }

/* ---------- Buttons: little Pendulum cards ---------- */
${SEL.button} {
  background: ${splitBg(0.4)}, ${t.raised} !important;
  border-color: ${oDim} ${redScale} ${gDim} ${blueScale} !important;
  border-radius: 3px !important;
  color: ${t.text} !important;
  text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important;
  box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.15)}, 0 2px 3px ${alpha('#000000', 0.7)} !important;
}
${SEL.buttonHover} {
  background: ${splitBg(0.7)}, ${t.raised} !important;
  border-color: ${orange} ${redScale} ${green} ${blueScale} !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.25)}, 0 0 10px -2px ${alpha(gold, 0.8)} !important;
}
${SEL.buttonDown} { background: ${dark} !important; box-shadow: inset 0 2px 6px ${alpha('#000000', 0.9)} !important; }

/* ---------- Text fields: the Pendulum effect box ---------- */
${SEL.field} {
  background-color: ${mix(t.bg, t.surface, 0.3)} !important;
  border-color: ${oDim} ${t.border} ${gDim} ${t.border} !important;
  box-shadow: inset 0 2px 4px ${alpha('#000000', 0.7)} !important;
}
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px ${alpha('#000000', 0.7)}, 0 0 8px ${alpha(gold, 0.5)} !important; }

/* ---------- Pop-ups: a Pendulum card, the pendulum swinging above it ---------- */
${SEL.dialog} {
  background: ${gems(26, 0)}, ${splitBg(0.22)}, ${dark} !important;
  background-origin: border-box !important;
  border-radius: 6px !important;
  box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 30px 70px -20px ${alpha('#000000', 0.95)}, 0 -20px 50px -25px ${alpha(orange, 0.6)}, 0 20px 50px -25px ${alpha(green, 0.6)} !important;
}
${sel(DIALOGS.map((d) => `#content ${d}::before`))} {
  content: ""; position: absolute; inset: 0; width: auto; height: auto; transform: none; background: none;
  border: 14px solid transparent; border-image: var(--pe-frame) 14 / 14px / 0 stretch; pointer-events: none; z-index: 0;
}
${sel(DIALOGS.map((d) => `#content ${d}::after`))} {
  content: ""; position: absolute; left: 50%; top: -50px; right: auto; bottom: auto; width: 140px; height: 56px; margin-left: -70px;
  background: var(--pe-pend) center / contain no-repeat; pointer-events: none; z-index: 1;
  transform-origin: 50% 4px; animation: dbte-pendulum-swing 3.2s ease-in-out infinite alternate;
  filter: drop-shadow(0 2px 2px ${alpha('#000000', 0.8)});
}
@keyframes dbte-pendulum-swing { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }
${SEL.dialogTitle} { ${splitText} }

/* ---------- Chat: the monster half on top, the spell half below ---------- */
${SEL.chatTop} {
  background: linear-gradient(180deg, ${mix(orange, t.raised, 0.35)}, ${oDim}) !important;
  box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.25)}, inset 0 -2px 0 ${seam} !important;
}
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important; }
${SEL.chat} {
  background: linear-gradient(180deg, ${alpha(green, 0.04)}, ${alpha(green, 0.16)}), ${dark} !important;
  box-shadow: inset 3px 0 0 ${gDim}, inset -3px 0 0 ${gDim}, inset 0 -3px 0 ${green} !important;
}
${sel(['#chats .chat .cout_txt', '#chats .chat .log_txt'])} { background-color: transparent !important; }

/* ---------- Duel: life framed by both Scales ---------- */
${SEL.life} {
  border-color: ${orange} ${redScale} ${green} ${blueScale} !important;
  background: linear-gradient(180deg, ${alpha('#ffffff', 0.2)}, transparent 50%) !important;
  box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 -3px 8px -3px ${alpha(orange, 0.7)}, 0 3px 8px -3px ${alpha(green, 0.7)} !important;
}
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -22px; top: 2px; width: 16px; height: 16px;
  background: var(--pe-gem-b) center / contain no-repeat; filter: drop-shadow(0 1px 1px ${alpha('#000000', 0.9)});
}
${SEL.lifeSelf} { background: linear-gradient(90deg, ${mix(orange, '#000000', 0.55)}, ${orange} 75%, ${mix(orange, gold, 0.5)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(90deg, ${mix(t.opp, '#000000', 0.55)}, ${t.opp} 75%, ${mix(t.opp, '#ffffff', 0.3)}) !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, 0 0 6px ${alpha('#000000', 0.8)} !important; }

/* Phases: split rings; the active one carries the pendulum's arc */
${SEL.phase} { background: linear-gradient(180deg, ${mix(orange, '#ffffff', 0.2)}, ${oDim} 49%, ${seam} 49% 51%, ${gDim} 51%, ${green}) !important; box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 2px 6px ${alpha('#000000', 0.8)}; }
${sel(['#duel .phase .background .background_top'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.2)}, transparent 50%) !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${dark} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${splitBg(0.25)}, radial-gradient(circle, ${t.raised}, ${dark} 80%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 30%, ${mix(orange, '#ffffff', 0.2)}, ${orange} 45%, ${mix(orange, '#000000', 0.55)} 85%) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.opp, '#ffffff', 0.2)}, ${t.opp} 45%, ${mix(t.opp, '#000000', 0.55)} 85%) !important; }
${sel(['#duel .phase.active .background::before'])} {
  content: ""; position: absolute; inset: -7px; border-radius: 50%;
  border: 2px dashed transparent; border-bottom-color: ${gold}; border-left-color: ${alpha(gold, 0.5)}; border-right-color: ${alpha(gold, 0.5)};
  filter: drop-shadow(0 0 3px ${gold});
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 -4px 12px ${alpha(orange, 0.6)}, 0 4px 12px ${alpha(green, 0.6)}; }
${sel(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important; }
${sel(['#duel .phase.active span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${alpha('#000000', 0.95)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${orange} 50%, ${green} 50%) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${dark} !important; }
${sel(['#duel #watchers'])} { box-shadow: inset 0 3px 0 ${oDim}, inset 0 -3px 0 ${gDim}; }
${sel(['#duel .cout_txt'])} { background: ${splitBg(0.14)}, ${dark} !important; box-shadow: inset 0 3px 0 ${orange}, inset 0 -3px 0 ${green}, inset 2px 0 0 ${blueScale}, inset -2px 0 0 ${redScale} !important; }
${sel(['#duel #preview_txt'])} { box-shadow: inset 0 3px 0 ${oDim}, inset 0 -3px 0 ${gDim}, inset 0 0 0 1px ${t.border}; }

/* ---------- Duel room: split frames, the Scales at each seam ---------- */
${panel('::before')} { background: linear-gradient(180deg, ${mix(orange, '#ffffff', 0.2)}, ${oDim} 49%, ${seam} 49% 51%, ${gDim} 51%, ${green}) !important; filter: none !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(180deg, ${gold}, ${orange} 49%, ${seam} 49% 51%, ${green} 51%, ${gold}) !important; }
${panel()} { background: ${splitBg(0.14)}, ${dark} !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.95)}; }
${panel('::after')} {
  content: ""; position: absolute; left: -9px; right: -9px; top: 50%; height: 16px; margin-top: -8px; background: ${gems(16, 0)};
  filter: drop-shadow(0 1px 2px ${alpha('#000000', 0.85)});
}
${sel(['#duel_room #formats .format .format_inner', '#duel_room #formats .format_inner[id]'])} { background-color: ${alpha(dark, 0.85)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background-color: ${t.raised} !important; opacity: 0.88 !important; }
${sel(['#duel_room .format_txt', '#duel_room span.arial_black2', '#duel_room .title_txt.arial_black2'])} { ${splitText} }
${sel(['#duel_room .duelbutton'])} { border-color: transparent !important; box-shadow: inset 0 -1px 0 ${alpha(green, 0.3)}; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(orange, 0.3)}, ${alpha(green, 0.2)}) !important; opacity: 1 !important; }
${sel(['#duel_room .duelbutton .game_type'])} { color: ${gold} !important; }

/* ---------- Deck constructor: monster half above, spell half below ---------- */
${sel(['#deck_constructor .deck_bg'])} {
  background: ${splitBg(0.2)}, ${dark} !important;
  box-shadow: inset 0 3px 0 ${orange}, inset 0 -3px 0 ${green}, inset 3px 0 0 ${blueScale}, inset 0 0 0 4px ${alpha('#000000', 0.5)} !important;
}
${sel(['#deck_constructor .side_bg', '#deck_constructor .extra_bg'])} {
  background: ${splitBg(0.14)}, ${dark} !important;
  box-shadow: inset 0 2px 0 ${oDim}, inset 0 -2px 0 ${gDim}, inset 3px 0 0 ${redScale} !important;
}
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { ${splitText} opacity: 1 !important; }
${sel(['#deck_constructor #search .search_bg'])} {
  background: ${splitBg(0.16)}, ${dark} !important;
  box-shadow: inset 0 3px 0 ${orange}, inset 0 -3px 0 ${green}, inset 0 0 0 1px ${t.border} !important;
}
${sel(['#deck_constructor #search .title_txt'])} { ${splitText} }
${sel(['#deck_constructor #search .search_prev_btn'])} { background-color: ${blueScale} !important; }
${sel(['#deck_constructor #search .search_next_btn'])} { background-color: ${redScale} !important; }
${sel(['#deck_constructor #search .search_prev_btn:hover', '#deck_constructor #search .search_next_btn:hover'])} { background-color: ${gold} !important; }

/* ---------- Settings panels ---------- */
${SETTINGS} { background: ${splitBg(0.18)}, ${dark} !important; border-color: ${orange} ${redScale} ${green} ${blueScale} !important; box-shadow: 0 -6px 16px -10px ${alpha(orange, 0.7)}, 0 8px 18px -10px ${alpha(green, 0.7)} !important; }

/* ---------- Scrollbars ---------- */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${orange}, ${green}) !important; }
${sel(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: ${gold} !important; }

@media (prefers-reduced-motion: reduce) { html body #content *, html body #content *::before, html body #content *::after { transition: none !important; animation: none !important; } }
`;
};
