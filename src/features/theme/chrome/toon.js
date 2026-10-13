// toon: Toon World comic book. Ink-outlined panels with hard offset shadows and
// Ben-Day dots, cream speech-balloon pop-ups with comic plate
// buttons, ink-stroked lettering with a solid ink drop, paper-white phase discs
// and POW bursts on hover and on the active phase.
import { svgUrl as kitSvgUrl } from './kit.js';

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, w) => `#${rgb(a).map((v, i) => Math.round(v * w + rgb(b)[i] * (1 - w)).toString(16).padStart(2, '0')).join('')}`;

// A compact SVG data URI: only the characters CSS or the URI needs are escaped.
const svgUrl = kitSvgUrl;

export default (t, { SEL, sel, svg, alpha }) => {
  const ink = mix(t.bg, '#000000', 0.42);
  const paper = t.text;
  const pop = t.accent;
  const red = t.accent2;
  // Duel panels sit beside the board for a whole game: a softer, warmer cream.
  const duelPaper = '#efe2c4';
  const cyan = t.link;
  // Ben-Day dots: one dot grid in a colour, size s px.
  const dots = (c, a, s = 8, r = 1.7) => `radial-gradient(circle, ${alpha(c, a)} ${r}px, transparent ${r + 0.6}px) 0 0 / ${s}px ${s}px`;
  // Comic lettering: an ink outline all round and a red drop.
  const letter = (w = 2, drop = 4) =>
    [[-w, -w], [w, -w], [-w, w], [w, w], [0, w], [w, 0], [0, -w], [-w, 0]].map(([x, y]) => `${x}px ${y}px 0 ${ink}`).join(', ') + `, ${drop}px ${drop}px 0 ${red}`;
  // A comic burst (POW star) with an ink edge.
  const burstPath = (cx, cy, n, r1, r2) => {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 ? r2 : r1 * (i % 4 === 0 ? 1 : 0.86);
      d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
    }
    return `${d}Z`;
  };
  const burst = (fill, n = 12) => svgUrl(svg(120, 120, `<path d="${burstPath(60, 60, n, 58, 38)}" fill="${fill}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/><path d="${burstPath(60, 60, n, 44, 30)}" fill="none" stroke="${paper}" stroke-opacity="0.55" stroke-width="2" stroke-linejoin="round"/>`));
  // A small POW sticker: burst with three speed lines and a "!" mark.
  const pow = svgUrl(svg(84, 84, `<path d="${burstPath(42, 42, 10, 40, 26)}" fill="${red}" stroke="${ink}" stroke-width="3.5" stroke-linejoin="round"/><path d="M38 22h9l-2 26h-5z" fill="${paper}" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/><circle cx="42.5" cy="57" r="4.5" fill="${paper}" stroke="${ink}" stroke-width="2"/>`));
  // Speech-balloon tail: fill, with an ink edge on the two open sides.
  const tail = (fill) => svgUrl(svg(48, 34, `<path d="M2 0 L10 32 L40 0" fill="${fill}" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/><path d="M0 0H44" stroke="${fill}" stroke-width="5"/>`));
  // Panel frame: ink line, cream inner keyline and a hard ink drop.
  const panel = (drop = 6) => `0 0 0 3px ${ink}, ${drop}px ${drop}px 0 3px ${ink}`;
  const keyline = `inset 0 0 0 2px ${alpha(paper, 0.85)}`;
  // Lettering: thick ink stroke under the fill and a solid ink drop; panel
  // titles also smear the panel colour sideways so no border line shows in word gaps.
  const stroke = (w = 4) => `-webkit-text-stroke: ${w}px ${ink}; paint-order: stroke fill;`;
  const smear = (c) => [-10, -7, -4, 4, 7, 10].map((x) => `${x}px 0 0 ${c}`).join(', ');
  // Pop-up buttons: a comic plate with a thick ink edge and a hard ink drop.
  const plate = (label, w, fill, txt) =>
    svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 78.5"><rect x="10" y="14" width="${w - 16}" height="58" rx="16" fill="${ink}"/><rect x="5" y="9" width="${w - 16}" height="58" rx="16" fill="${fill}" stroke="${ink}" stroke-width="4"/><path d="M18 18h${w * 0.45}" stroke="#ffffff" stroke-opacity="0.55" stroke-width="4" stroke-linecap="round"/><text x="${(w - 6) / 2}" y="39" dominant-baseline="central" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="27" fill="${txt}">${label}</text></svg>`);
  const imgSel = (name) => sel([`#content img[src*="/svg/${name}"]`]);

  const T = (list) => sel(list);
  const titles = T(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#content .subtitle']);
  const combo = T(['#content .combobox', '#content input[type=submit]', '#content input[type=button]']);
  const comboHover = T(['#content .combobox:hover', '#content .combobox.combobox_selected', '#content input[type=submit]:hover', '#content input[type=button]:hover']);
  const duelPanels = T(['#duel .cout_txt', '#duel #watchers']);
  const ring = (suffix) => T(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border'].map((s) => s + suffix));
  const deckPanels = T(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg']);
  const deckLabels = T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl', '#deck_constructor #search .title_txt']);
  const turnBg = T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background']);
  const turnInner = T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner']);
  const turnTxt = T(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span']);
  const chatTitle = T(['#chats .chat .chat_top span']);

  return `
@keyframes dbte-toon-pop { 0% { transform: scale(0.4) rotate(-20deg); opacity: 0 } 70% { transform: scale(1.12) rotate(6deg); opacity: 1 } 100% { transform: scale(1) rotate(0deg); opacity: 1 } }
@keyframes dbte-toon-wobble { 0%, 100% { transform: rotate(-4deg) } 50% { transform: rotate(4deg) scale(1.04) } }
@media (prefers-reduced-motion: reduce) { :root { --dbte-toon-anim: none } }

${titles} { color: ${paper} !important; ${stroke(5)} text-shadow: 3px 3px 0 ${ink} !important; }
${T(['#duel_room .arial_black2', '#content .admin_lbl', '#content .subtitle'])} { text-shadow: 3px 3px 0 ${ink}, ${smear(t.surface)} !important; }

${SEL.tile} {
  background: ${dots(pop, 0.22)}, linear-gradient(${t.raised}, ${mix(t.raised, t.bg, 0.6)}) !important;
  border-color: ${ink} !important;
  border-radius: 18px 22px 16px 20px / 20px 16px 22px 18px !important;
  box-shadow: ${keyline}, ${panel(7)} !important;
}
${SEL.tile}::before {
  content: ""; position: absolute; left: -20px; top: -20px; width: 46px; height: 46px; pointer-events: none;
  background: ${pow} center / contain no-repeat; opacity: 0; transform: scale(0.4) rotate(-20deg);
  transition: opacity 0.15s, transform 0.2s cubic-bezier(0.3, 1.6, 0.5, 1);
}
${SEL.tileHover} {
  background: ${dots(red, 0.24)}, ${pop} !important;
  border-color: ${ink} !important;
  box-shadow: inset 0 0 0 2px ${paper}, 0 0 0 3px ${ink}, 9px 9px 0 3px ${ink} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; transform: none; animation: var(--dbte-toon-anim, dbte-toon-pop 0.32s cubic-bezier(0.3, 1.6, 0.5, 1)); }
${sel(['#main_menu .menu_btn:active .content'])} { box-shadow: inset 0 0 0 2px ${paper}, 0 0 0 3px ${ink}, 2px 2px 0 3px ${ink} !important; }
${SEL.tileLabel} { color: ${paper} !important; ${stroke(4)} text-shadow: 2px 2px 0 ${ink} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${paper} !important; text-shadow: 2px 2px 0 ${ink} !important; }
${sel(['#main_menu .menu_btn.administrator_btn:hover .content'])} { background: ${dots(red, 0.16)}, ${t.warning} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${ink} !important; background: ${paper} !important; box-shadow: 2px 2px 0 ${ink}; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${red} !important; }

${SEL.button}, ${combo} {
  background: linear-gradient(${alpha(paper, 0.1)}, transparent 55%), ${t.raised} !important;
  border-color: ${ink} !important;
  border-radius: 8px !important;
  color: ${paper} !important;
  box-shadow: inset 0 0 0 1px ${alpha(paper, 0.55)}, 0 0 0 2px ${ink}, 3px 3px 0 2px ${ink} !important;
}
${SEL.buttonHover}, ${comboHover} {
  background: ${dots(red, 0.35, 6, 1.2)}, ${pop} !important;
  border-color: ${ink} !important;
  color: ${t.accentText} !important;
  box-shadow: inset 0 0 0 1px ${paper}, 0 0 0 2px ${ink}, 4px 4px 0 2px ${ink} !important;
}
${SEL.buttonDown} {
  background: ${red} !important;
  border-color: ${ink} !important;
  color: ${ink} !important;
  box-shadow: inset 2px 2px 0 ${alpha(ink, 0.5)}, 0 0 0 2px ${ink}, 1px 1px 0 2px ${ink} !important;
}

${SEL.dialog} {
  background: ${dots(red, 0.1, 9, 1.6)}, ${paper} !important;
  border-radius: 46px !important;
  box-shadow: inset 0 0 0 3px ${alpha(ink, 0.25)}, 0 0 0 5px ${ink}, 10px 12px 0 5px ${ink}, 0 30px 60px -20px #000000 !important;
}
${sel(['#content #msg::after', '#content #link::after', '#content #confirm::after', '#content #confirm2::after', '#content #input::after', '#content #input2::after', '#content #combo::after'])} {
  content: ""; position: absolute; left: 84px; bottom: -36px; width: 52px; height: 38px; pointer-events: none;
  background: ${tail(paper)} 0 0 / 100% 100% no-repeat; filter: drop-shadow(10px 12px 0 ${ink});
}
${sel(['#content #msg::before', '#content #link::before', '#content #confirm::before', '#content #confirm2::before', '#content #input::before', '#content #input2::before', '#content #combo::before'])} {
  content: ""; position: absolute; right: -26px; top: -30px; width: 76px; height: 76px; pointer-events: none;
  background: ${burst(pop)} center / contain no-repeat; transform: rotate(-8deg);
}
${SEL.dialogTitle} { color: ${ink} !important; -webkit-text-stroke: 0 !important; text-shadow: 3px 3px 0 ${pop}, 4px 4px 0 ${alpha(red, 0.55)} !important; }
${sel(['#content #msg .body_txt', '#content #link .body_txt', '#content #confirm .body_txt', '#content #confirm2 .body_txt', '#content #input .body_txt', '#content #input2 .body_txt', '#content #combo .body_txt'])} { color: ${ink} !important; }
${imgSel('ok_btn')} { content: ${plate('OK', 153.4, pop, ink)} !important; }
${imgSel('yes_btn')} { content: ${plate('Yes', 153.4, pop, ink)} !important; }
${imgSel('no_btn')} { content: ${plate('No', 153.4, '#ffffff', ink)} !important; }
${imgSel('cancel_btn')} { content: ${plate('Cancel', 234.85, '#ffffff', ink)} !important; }

${SEL.chatTop} {
  background: ${dots(red, 0.3, 7, 1.3)}, ${pop} !important;
  border-radius: 14px 14px 0 0 !important;
  box-shadow: inset 0 0 0 2px ${paper}, 0 0 0 3px ${ink} !important;
}
${sel(['#chats #online_users .chat_top_bg', '#chats #watch_chat .chat_top_bg'])} { background: ${dots(t.bg, 0.25, 7, 1.3)}, ${cyan} !important; }
${sel(['#chats #private_chat .chat_top_bg'])} { background: ${dots(t.bg, 0.25, 7, 1.3)}, ${t.success} !important; }
${sel(['#chats #calls .chat_top_bg', '#chats #duel_log .chat_top_bg'])} { background: ${dots(t.bg, 0.25, 7, 1.3)}, ${red} !important; }
${chatTitle} { color: ${ink} !important; text-shadow: 2px 2px 0 ${alpha(paper, 0.7)} !important; }
${SEL.chat} {
  background: ${dots(paper, 0.05, 9, 1.4)}, ${t.surface} !important;
  border-radius: 0 0 18px 18px !important;
  box-shadow: inset 0 0 0 2px ${alpha(paper, 0.5)}, 0 0 0 3px ${ink}, 7px 7px 0 3px ${ink} !important;
}
${sel(['#chats .chat .chat_background::after'])} {
  content: ""; position: absolute; right: 26px; bottom: -22px; width: 36px; height: 26px; pointer-events: none;
  background: ${tail(t.surface)} 0 0 / 100% 100% no-repeat; transform: scaleX(-1); filter: drop-shadow(-5px 5px 0 ${ink});
}
${sel(['#chats .chat .black_line'])} { background-color: ${ink} !important; }

${SEL.life} {
  border-color: ${ink} !important;
  border-radius: 10px !important;
  box-shadow: inset 0 0 0 2px ${paper}, 5px 5px 0 0 ${ink}, -3px -3px 0 0 ${alpha(cyan, 0.5)} !important;
}
${SEL.lifeSelf} { background: ${dots(ink, 0.3, 6, 1.3)}, linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.75)}, ${t.self} 55%, ${mix(t.self, ink, 0.7)}) !important; border-radius: 10px !important; }
${SEL.lifeOpp} { background: ${dots(ink, 0.3, 6, 1.3)}, linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.75)}, ${t.opp} 55%, ${mix(t.opp, ink, 0.7)}) !important; border-radius: 10px !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: ${ink} !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${paper} !important; ${stroke(4)} text-shadow: 2px 2px 0 ${ink} !important; }

${SEL.phase} { background: ${ink} !important; border-radius: 50% !important; box-shadow: 0 0 0 2px #000000, 4px 4px 0 2px #000000 !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${paper} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${dots(cyan, 0.42, 6, 1.5)}, radial-gradient(circle at 35% 30%, ${t.raised}, ${mix(t.surface, ink, 0.5)} 75%) !important; border-radius: 50% !important; box-shadow: inset 0 0 0 2px ${ink} !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: ${dots(ink, 0.25, 6, 1.3)}, radial-gradient(circle at 35% 30%, ${mix(t.self, '#ffffff', 0.7)}, ${t.self} 60%) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: ${dots(ink, 0.25, 6, 1.3)}, radial-gradient(circle at 35% 30%, ${mix(t.opp, '#ffffff', 0.7)}, ${t.opp} 60%) !important; }
${sel(['#duel .phase.active::before'])} {
  content: ""; position: absolute; left: -25%; top: -25%; width: 150%; height: 150%; pointer-events: none;
  background: ${burst(pop, 14)} center / contain no-repeat;
  animation: var(--dbte-toon-anim, dbte-toon-pop 0.45s cubic-bezier(0.3, 1.6, 0.5, 1) 1 both);
}
${sel(['#duel .phase span'])} { color: ${paper} !important; ${stroke(3)} text-shadow: 2px 2px 0 ${ink} !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${paper} !important; ${stroke(4)} text-shadow: 2px 2px 0 ${ink} !important; }
${sel(['#duel .duel_avatar .username_txt'])} { ${stroke(4)} text-shadow: 2px 2px 0 ${ink} !important; }
${sel(['#content img.field_zones', '#content img.field_decks'])} { filter: drop-shadow(0 0 0.6px ${ink}) drop-shadow(0 0 0.6px ${ink}) drop-shadow(2px 2px 0 ${alpha(ink, 0.75)}) !important; }
${turnBg} { background: ${ink} !important; box-shadow: 4px 4px 0 ${ink}; }
${turnInner} { background: ${dots(red, 0.4, 6, 1.2)}, ${pop} !important; }
${turnTxt} { color: ${ink} !important; text-shadow: 2px 2px 0 ${paper} !important; }

${ring('::before')} { background: ${ink} !important; filter: none; }
${ring('')} {
  background: ${dots(pop, 0.08, 9, 1.5)}, ${alpha(t.surface, 0.9)} !important;
  box-shadow: inset 0 0 0 6px ${alpha(paper, 0.8)}, 8px 8px 0 0 ${ink}, -4px -4px 0 0 ${alpha(cyan, 0.45)} !important;
}
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: ${red} !important; }
${sel(['#duel_room .format_txt'])} { color: ${paper} !important; ${stroke(5)} text-shadow: 3px 3px 0 ${ink}, ${smear(t.surface)} !important; }
${sel(['#duel_room #formats .format .format_inner'])} { background-color: ${alpha(t.bg, 0.55)} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${ink} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${dots(pop, 0.25, 7, 1.3)}, ${t.raised} !important; }

${deckPanels} { border-radius: 10px !important; box-shadow: inset 0 0 0 2px ${alpha(paper, 0.6)}, 0 0 0 3px ${ink}, 7px 7px 0 3px ${ink} !important; }
${sel(['#deck_constructor .deck_bg'])} { background: ${dots(paper, 0.07, 10, 1.6)}, ${mix(t.surface, cyan, 0.86)} !important; }
${sel(['#deck_constructor .side_bg'])} { background: ${dots(paper, 0.07, 10, 1.6)}, ${mix(t.surface, red, 0.84)} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: ${dots(paper, 0.07, 10, 1.6)}, ${mix(t.surface, pop, 0.86)} !important; }
${sel(['#deck_constructor #search .search_bg'])} {
  background: ${dots(pop, 0.08, 9, 1.5)}, ${t.surface} !important; border-radius: 14px !important;
  box-shadow: inset 0 0 0 2px ${alpha(paper, 0.6)}, 0 0 0 3px ${ink}, 7px 7px 0 3px ${ink} !important;
}
${deckLabels} { color: ${paper} !important; opacity: 1 !important; ${stroke(4)} text-shadow: 2px 2px 0 ${ink} !important; }
${sel(['#deck_constructor .total_bg', '#deck_constructor .total_effect_bg', '#deck_constructor .total_spell_bg', '#deck_constructor .total_trap_bg'])} {
  background: ${paper} !important; border-radius: 50% !important;
  box-shadow: 0 0 0 2px ${ink}, inset 0 -4px 0 var(--dbt-stripe, ${pop}), 3px 3px 0 2px ${ink} !important;
}
${sel(['#deck_constructor .total_txt', '#deck_constructor .total_effect_txt', '#deck_constructor .total_spell_txt', '#deck_constructor .total_trap_txt'])} { color: ${ink} !important; }

${SEL.field} {
  background-color: ${mix(t.surface, ink, 0.5)} !important;
  border-color: ${alpha(paper, 0.8)} !important;
  border-radius: 6px !important;
  color: ${paper} !important;
  box-shadow: 3px 3px 0 ${ink}, inset 0 2px 0 ${alpha(ink, 0.6)} !important;
}
${sel(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { border-color: ${pop} !important; outline: 2px solid ${ink} !important; box-shadow: 4px 4px 0 ${red} !important; }

${duelPanels} { border-color: ${ink} !important; border-radius: 10px !important; box-shadow: inset 0 0 0 2px ${alpha(paper, 0.5)}, 0 0 0 2px ${ink}, 6px 6px 0 2px ${ink} !important; }
/* The card text balloon: a cream margin ring outside the box gives the text room (no padding on DuelingBook's box). */
${T(['#duel #preview_txt'])} { background: ${dots(red, 0.04, 9, 1.4)}, ${duelPaper} !important; color: ${ink} !important; border-radius: 6px !important; box-shadow: 0 0 0 7px ${duelPaper}, 0 0 0 10px ${ink}, 6px 7px 0 10px ${ink} !important; }
${T(['#duel #preview_txt *'])} { color: ${ink} !important; text-shadow: none !important; }
${T(['#duel .button'])} { background: ${dots(red, 0.1, 6, 1.1)}, ${paper} !important; color: ${ink} !important; text-shadow: none !important; box-shadow: inset 0 0 0 1px ${alpha(ink, 0.3)}, 0 0 0 2px ${ink}, 3px 3px 0 2px ${ink} !important; }
${T(['#duel .button:hover'])} { background: ${dots(red, 0.35, 6, 1.2)}, ${pop} !important; color: ${ink} !important; }
${duelPanels} { background: ${dots(red, 0.04, 9, 1.4)}, ${duelPaper} !important; border-radius: 18px !important; box-shadow: inset 0 0 0 2px ${alpha(ink, 0.25)}, 0 0 0 3px ${ink}, 6px 7px 0 3px ${ink} !important; }
${T(['#duel .cout_txt', '#duel .cout_txt *', '#duel #watchers .cell', '#duel .watchers_txt'])} { color: ${ink} !important; }
${T(['#duel .cout_txt font[color="#FF0000" i]', '#duel .cout_txt font[color="red" i]', '#duel .cout_txt [style*="color: rgb(187, 0, 0)"]'])} { color: ${mix(red, ink, 0.6)} !important; }
${T(['#duel .cout_txt font[color="#0000FF" i]', '#duel .cout_txt font[color="#0012ff" i]', '#duel .cout_txt font[color="blue" i]'])} { color: ${mix(t.opp, ink, 0.45)} !important; }
${T(['#duel #watchers .cell1', '#duel #watchers .users'])} { background: transparent !important; box-shadow: inset 0 -1px 0 ${alpha(ink, 0.2)} !important; }
${SEL.settingsPanel} { border-radius: 14px !important; box-shadow: 0 0 0 3px ${ink}, 8px 8px 0 3px ${ink} !important; }
${sel(['#content .os-scrollbar-handle'])} { background: ${pop} !important; border-radius: 99px !important; box-shadow: inset 0 0 0 1.5px ${ink}; }
${sel(['#content .checkbox', '#content .radiobutton'])} { box-shadow: inset 0 0 0 2px ${ink}, 2px 2px 0 ${ink} !important; background-color: ${paper} !important; }
${sel(['#content .checkbox .check', '#content .radiobutton .check'])} { filter: brightness(0) !important; }
html body #dbte-skin-fx .dbtefx-tn-book { transform: translate(-425.6px, 505px) scale(0.4); }
html body #dbte-skin-fx .dbtefx-tn-pow { display: none; }
/* Shrunk into the gutter, the book keeps a real ink line. */
html body #dbte-skin-fx .dbtefx-tn-book [stroke="#000000"] { vector-effect: non-scaling-stroke; stroke-width: 2.2px; }
html body #dbte-skin-fx #dbtefx-tn-dots circle { fill-opacity: 0.85; }
`;
};
