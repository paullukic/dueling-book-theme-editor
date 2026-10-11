// artmage: the Artmage Academy gallery. Gilded picture-frame borders (beaded
// gold with corner rosettes) on tiles, pop-ups, panels, fields and life
// points; linen canvas texture; magenta paint-stroke underlines that paint in on
// hover; paint-dab phase buttons on an ultramarine ground; a brass plaque under
// pop-ups.

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, w) => `#${rgb(a).map((v, i) => Math.round(v * w + rgb(b)[i] * (1 - w)).toString(16).padStart(2, '0')).join('')}`;

export default (t, { SEL, sel, svgUrl, svg, alpha }) => {
  const gold = t.accent2;
  const hi = mix(gold, '#ffffff', 0.55);
  const lo = mix(gold, t.bg, 0.45);
  const paint = t.accent;
  const deep = mix(t.bg, '#000000', 0.6);
  const metal = `linear-gradient(135deg, ${lo}, ${gold} 22%, ${hi} 40%, ${gold} 55%, ${lo} 78%, ${gold})`;
  // Gilded frame for border-image: outer bevel, bead row, inner lip, rosettes.
  const frame = (() => {
    let beads = '';
    for (let i = 10; i <= 50; i += 5) beads += `<circle cx="${i}" cy="5" r="1.4"/><circle cx="${i}" cy="55" r="1.4"/><circle cx="5" cy="${i}" r="1.4"/><circle cx="55" cy="${i}" r="1.4"/>`;
    const rose = (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="${hi}" stroke="${lo}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="2" fill="${paint}"/>`;
    return svgUrl(svg(60, 60, `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="0.45" stop-color="${gold}"/><stop offset="1" stop-color="${lo}"/></linearGradient></defs><rect width="60" height="60" fill="url(#g)"/><rect x="0.75" y="0.75" width="58.5" height="58.5" fill="none" stroke="${deep}" stroke-width="1.5"/><g fill="${hi}" stroke="${lo}" stroke-width="0.5">${beads}</g><rect x="9.5" y="9.5" width="41" height="41" fill="none" stroke="${lo}" stroke-width="2"/><rect x="11.5" y="11.5" width="37" height="37" fill="none" stroke="${hi}" stroke-width="1"/>${rose(6, 6)}${rose(54, 6)}${rose(6, 54)}${rose(54, 54)}`));
  })();
  // Fine frame for small controls: bevel and lip only.
  const thin = svgUrl(svg(12, 12, `<rect width="12" height="12" fill="${gold}"/><path d="M0 0H12V1.5H1.5V12H0Z" fill="${hi}"/><path d="M12 12H0V10.5H10.5V0H12Z" fill="${lo}"/>`));
  const brush = (c) => svgUrl(svg(240, 24, `<path d="M4 13q30-10 70-5t82 0q40-6 80 2q-36 8-80 5t-82 2q-40 4-70-4z" fill="${c}"/><path d="M20 11q60-6 120-1t90 0M30 15q60 3 120 0t70 1" fill="none" stroke="${hi}" stroke-opacity="0.35" stroke-width="0.8"/>`));
  const linen = `repeating-linear-gradient(0deg, ${alpha(t.text, 0.035)} 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, ${alpha('#000000', 0.12)} 0 1px, transparent 1px 3px)`;
  const engraved = `-1.5px -1.5px 0 ${deep}, 1.5px -1.5px 0 ${deep}, -1.5px 1.5px 0 ${deep}, 1.5px 1.5px 0 ${deep}, 0 2px 0 ${deep}, 0 -1px 0 ${deep}, 0 3px 8px #000000`;
  const gilt = (w, out = 0) => `border-image: var(--dbte-am-frame) 20 / ${w}px / ${out}px stretch !important;`;
  const blob = '46% 54% 50% 50% / 55% 45% 55% 45%';

  const T = (list) => sel(list);
  const titles = T(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#content .subtitle']);
  const btnExtra = T(['#content .combobox', '#content input[type=submit]', '#content input[type=button]']);
  const btnExtraHover = T(['#content .combobox:hover', '#content .combobox.combobox_selected', '#content input[type=submit]:hover', '#content input[type=button]:hover']);
  const ringList = ['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border'];
  const ring = (suffix) => T(ringList.map((s) => s + suffix));
  const deckList = ['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg'];
  const deckLabels = T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl', '#deck_constructor #search .title_txt']);
  const turnBg = T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background']);
  const turnInner = T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner']);
  const turnTxt = T(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span']);
  const settings = T(['#settings .about_me', '#settings .preferences', '#settings .social_media', '#settings .animation', '#settings .profile_song', '#settings .account', '#settings .messages', '#settings .duel_stats', '#settings .profile_comments']);
  const duelPanels = T(['#duel .cout_txt', '#duel #watchers']);
  const dlg = (suffix) => T(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d}${suffix}`));
  // A gilt frame drawn on our own pseudo-element over a panel's edge.
  const framePseudo = (w, inset) => `content: ""; position: absolute; left: ${inset}px; top: ${inset}px; right: ${inset}px; bottom: ${inset}px; pointer-events: none; border: ${w}px solid transparent; border-image: var(--dbte-am-frame) 20 / ${w}px stretch; filter: drop-shadow(0 4px 6px ${alpha('#000000', 0.55)});`;

  return `
html body { --dbte-am-frame: ${frame}; --dbte-am-thin: ${thin}; --dbte-am-brush: ${brush(paint)}; --dbte-am-brush-gold: ${brush(gold)}; }
@keyframes dbte-am-paint { from { transform: scaleX(0.15); opacity: 0.3 } to { transform: scaleX(1); opacity: 1 } }
@media (prefers-reduced-motion: reduce) { :root { --dbte-am-anim: none } }

${titles} { color: ${hi} !important; text-shadow: ${engraved} !important; }

${SEL.tile} {
  background: ${linen}, radial-gradient(ellipse at 30% 20%, ${mix(t.raised, t.opp, 0.85)}, ${t.surface} 75%) !important;
  ${gilt(9)}
  border-radius: 0 !important;
  box-shadow: 0 12px 22px -12px #000000, inset 0 0 24px ${alpha('#000000', 0.45)} !important;
}
${SEL.tile}::before {
  content: ""; position: absolute; left: 14%; right: 14%; bottom: 13px; height: 14px; pointer-events: none;
  background: var(--dbte-am-brush) center / 100% 100% no-repeat; opacity: 0.75; transform-origin: 0 50%;
}
${SEL.tileHover} {
  background: ${linen}, radial-gradient(ellipse at 50% 110%, ${alpha(paint, 0.35)}, transparent 65%), radial-gradient(ellipse at 30% 20%, ${mix(t.raised, t.opp, 0.8)}, ${t.raised} 75%) !important;
  ${gilt(9)}
  box-shadow: 0 0 22px -6px ${alpha(gold, 0.75)}, inset 0 0 24px ${alpha('#000000', 0.35)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { background-image: var(--dbte-am-brush-gold); opacity: 1; animation: var(--dbte-am-anim, dbte-am-paint 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)); }
${sel(['#main_menu .menu_btn:active .content'])} { box-shadow: inset 0 3px 12px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${deep}, 0 0 10px ${alpha('#000000', 0.6)} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${hi} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${gold} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${paint} !important; }

${SEL.button}, ${btnExtra} {
  background: ${linen}, linear-gradient(180deg, ${t.raised}, ${t.surface}) !important;
  border-image: var(--dbte-am-thin) 3 / 2px stretch !important;
  border-radius: 0 !important;
  color: ${t.text} !important;
  box-shadow: inset 0 0 0 1px ${alpha(deep, 0.6)}, 0 3px 6px -2px #000000 !important;
}
${SEL.buttonHover}, ${btnExtraHover} {
  background: var(--dbte-am-brush) 50% 78% / 92% 70% no-repeat, linear-gradient(180deg, ${mix(t.raised, paint, 0.85)}, ${t.surface}) !important;
  border-image: var(--dbte-am-thin) 3 / 2px stretch !important;
  color: ${t.text} !important;
  box-shadow: inset 0 0 0 1px ${alpha(deep, 0.6)}, 0 0 12px -3px ${alpha(gold, 0.8)} !important;
}
${SEL.buttonDown} {
  background: ${paint} !important;
  border-image: var(--dbte-am-thin) 3 / 2px stretch !important;
  color: ${t.accentText} !important;
  box-shadow: inset 0 2px 6px ${alpha('#000000', 0.5)} !important;
}

${SEL.dialog} {
  background: ${linen}, radial-gradient(ellipse at 50% 0%, ${mix(t.raised, t.opp, 0.85)}, ${t.surface} 70%) !important;
  border-radius: 0 !important;
  box-shadow: inset 0 0 40px ${alpha('#000000', 0.5)}, 0 30px 60px -20px #000000 !important;
}
${dlg('::before')} { ${framePseudo(18, -14)} }
${dlg('::after')} {
  content: ""; position: absolute; left: 50%; bottom: -24px; width: 120px; height: 20px; margin-left: -60px; pointer-events: none;
  background: ${metal}; border-radius: 2px; box-shadow: inset 0 0 0 1px ${lo}, inset 0 0 0 3px ${alpha(hi, 0.5)}, 0 4px 8px ${alpha('#000000', 0.6)};
}
${SEL.dialogTitle} { color: ${hi} !important; text-shadow: ${engraved} !important; }
${dlg(' .body_txt')} { color: ${t.text} !important; }

${SEL.chatTop} {
  background: var(--dbte-am-brush) 12px 80% / 70% 60% no-repeat, ${linen}, linear-gradient(180deg, ${mix(t.raised, t.opp, 0.85)}, ${t.surface}) !important;
  border-radius: 0 !important;
  box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 3px ${lo}, inset 0 0 0 4px ${alpha(hi, 0.6)} !important;
}
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 2px 0 ${deep} !important; }
${SEL.chat} {
  background: ${linen}, ${t.surface} !important;
  box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 3px ${lo}, inset 0 0 18px ${alpha('#000000', 0.4)} !important;
}
${sel(['#chats .chat .black_line'])} { background: ${metal} !important; }

${SEL.life} { border-image: var(--dbte-am-frame) 20 / 6px stretch !important; border-radius: 0 !important; box-shadow: 0 4px 10px ${alpha('#000000', 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 0 !important; }
${SEL.lifeSelf} { background: ${linen}, linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.75)}, ${t.self} 50%, ${mix(t.self, deep, 0.6)}) !important; }
${SEL.lifeOpp} { background: ${linen}, linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.75)}, ${t.opp} 50%, ${mix(t.opp, deep, 0.6)}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: ${linen}, ${deep} !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: -1px -1px 0 ${deep}, 1px -1px 0 ${deep}, -1px 1px 0 ${deep}, 1px 1px 0 ${deep}, 0 2px 4px #000000 !important; }

${SEL.phase} { background: ${metal} !important; border-radius: ${blob} !important; box-shadow: 0 4px 8px -2px #000000 !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${deep} !important; border-radius: ${blob} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${linen}, radial-gradient(circle at 35% 30%, ${t.raised}, ${t.surface} 80%) !important; border-radius: ${blob} !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 32% 28%, ${alpha('#ffffff', 0.55)}, transparent 22%), radial-gradient(circle at 50% 50%, ${t.self} 50%, ${mix(t.self, deep, 0.6)}) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 32% 28%, ${alpha('#ffffff', 0.55)}, transparent 22%), radial-gradient(circle at 50% 50%, ${t.opp} 50%, ${mix(t.opp, deep, 0.6)}) !important; }
${sel(['#duel .phase.active::before'])} {
  content: ""; position: absolute; left: -10%; right: -10%; top: 96%; height: 24%; pointer-events: none;
  background: var(--dbte-am-brush-gold) center / 100% 100% no-repeat; transform-origin: 0 50%;
  animation: var(--dbte-am-anim, dbte-am-paint 0.5s cubic-bezier(0.2, 0.8, 0.2, 1));
}
${sel(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 2px ${deep} !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${deep}, 0 0 6px ${deep} !important; }
${turnBg} { background: ${metal} !important; }
${turnInner} { background: ${linen}, ${t.surface} !important; }
${turnTxt} { color: ${hi} !important; text-shadow: ${engraved} !important; }

${ring('::before')} { background: ${metal} !important; filter: none; }
${ring('::after')} { ${framePseudo(12, -6)} }
${ring('')} { background: ${linen}, ${alpha(t.surface, 0.92)} !important; box-shadow: inset 0 0 30px ${alpha('#000000', 0.45)} !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: ${paint} !important; }
${sel(['#duel_room .format_txt'])} { color: ${hi} !important; text-shadow: ${engraved} !important; }
${sel(['#duel_room #formats .format .format_inner'])} { background-color: ${alpha(t.bg, 0.5)} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(gold, 0.3)} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: var(--dbte-am-brush) 50% 100% / 80% 30% no-repeat, ${t.raised} !important; }

${T(deckList)} { border-radius: 0 !important; box-shadow: inset 0 0 30px ${alpha('#000000', 0.4)} !important; }
${T(deckList.map((s) => `${s}::after`))} { ${framePseudo(10, -5)} }
${sel(['#deck_constructor .deck_bg'])} { background: ${linen}, linear-gradient(180deg, ${mix(t.surface, t.opp, 0.88)}, ${t.bg}) !important; }
${sel(['#deck_constructor .side_bg'])} { background: ${linen}, ${mix(t.surface, paint, 0.82)} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: ${linen}, ${mix(t.surface, gold, 0.84)} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${linen}, ${t.surface} !important; }
${deckLabels} { color: ${hi} !important; opacity: 1 !important; text-shadow: ${engraved} !important; }
${sel(['#deck_constructor .total_bg', '#deck_constructor .total_effect_bg', '#deck_constructor .total_spell_bg', '#deck_constructor .total_trap_bg'])} {
  background: ${linen}, ${t.surface} !important; border-radius: 0 !important;
  box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 3px ${lo}, inset 0 -5px 0 var(--dbt-stripe, ${paint}) !important;
}

${SEL.field} {
  background: ${linen}, ${mix(t.surface, deep, 0.6)} !important;
  border-image: var(--dbte-am-thin) 3 / 2px stretch !important;
  border-radius: 0 !important;
  color: ${t.text} !important;
  box-shadow: inset 0 2px 5px ${alpha('#000000', 0.6)} !important;
}
${sel(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 1px solid ${paint} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.6)}, 0 0 10px -2px ${alpha(paint, 0.8)} !important; }

${duelPanels} { border-image: var(--dbte-am-thin) 3 / 2px stretch !important; border-radius: 0 !important; box-shadow: inset 0 0 18px ${alpha('#000000', 0.4)} !important; }
${sel(['#duel .cout_txt'])} { background: ${linen}, ${t.surface} !important; }
${settings} { border-image: var(--dbte-am-frame) 20 / 10px stretch !important; border-radius: 0 !important; box-shadow: inset 0 0 30px ${alpha('#000000', 0.35)}, 0 12px 26px -12px #000000 !important; }
${sel(['#content .os-scrollbar-handle'])} { background: ${metal} !important; border-radius: 1px !important; }
${sel(['#content .checkbox', '#content .radiobutton'])} { box-shadow: inset 0 0 0 1.5px ${gold}, inset 0 0 0 2.5px ${lo} !important; }
`;
};
