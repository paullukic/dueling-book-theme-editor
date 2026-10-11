// artmage: the Artmage Academy (Academic Arcane Arts Acropolis). From the card
// art: ultramarine academy robes with white piping and bevelled gold trim, the
// gold four-point star of their books and brooches, the academy's rose-window
// crest, and their magic: rainbow paint ribbons swept from brush staves and
// jewel-colour paint splatter. Rose-window phase roundels, gilded duel zones.

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, w) => `#${rgb(a).map((v, i) => Math.round(v * w + rgb(b)[i] * (1 - w)).toString(16).padStart(2, '0')).join('')}`;

// A compact SVG data URI: only the characters CSS or the URI needs are escaped.
const svgUrl = (s) => `url("data:image/svg+xml,${s.replace(/"/g, "'").replace(/[<>#%{}\n]/g, encodeURIComponent)}")`;

export default (t, { SEL, sel, svg, alpha }) => {
  const gold = t.accent2;
  const hi = mix(gold, '#ffffff', 0.5);
  const brown = mix(gold, '#000000', 0.42);
  const pink = t.accent;
  const cyan = t.opp;
  const deep = mix(t.bg, '#000000', 0.6);
  const robe = mix(t.border, t.raised, 0.55);
  const robeDark = mix(t.surface, t.bg, 0.6);
  const piping = alpha(t.text, 0.75);
  const rainbow = [pink, gold, t.success, cyan, mix(pink, cyan, 0.5)];
  const rainbowStops = rainbow.map((c, i) => `<stop offset="${i / 4}" stop-color="${c}"/>`).join('');
  const robeFill = `linear-gradient(180deg, ${mix(robe, t.text, 0.92)}, ${robe} 45%, ${robeDark})`;
  // Gold trim, bevelled: light gold on the lit sides, dark brown on the shaded ones, a dark sight line inside.
  const bevel = (b) => svgUrl(svg(60, 60, `<defs><linearGradient id="l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="1" stop-color="${gold}"/></linearGradient><linearGradient id="d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${gold}"/><stop offset="1" stop-color="${brown}"/></linearGradient></defs><path d="M0 0H60L${60 - b} ${b}H${b}V${60 - b}L0 60Z" fill="url(#l)"/><path d="M60 60H0L${b} ${60 - b}H${60 - b}V${b}L60 0Z" fill="url(#d)"/><path d="M${b * 0.45} ${b * 0.45}H${60 - b * 0.45}V${60 - b * 0.45}H${b * 0.45}Z" fill="none" stroke="${brown}" stroke-opacity="0.55" stroke-width="0.8"/><rect x="${b - 0.6}" y="${b - 0.6}" width="${61.2 - b * 2}" height="${61.2 - b * 2}" fill="none" stroke="${deep}" stroke-width="1.2"/><rect x="0.4" y="0.4" width="59.2" height="59.2" fill="none" stroke="${deep}" stroke-width="0.8"/>`));
  // The gold four-point star of the Artmage books and brooches.
  const star = (r, c = gold) => `<path d="M0 ${-r}Q${r * 0.12} ${-r * 0.12} ${r} 0Q${r * 0.12} ${r * 0.12} 0 ${r}Q${-r * 0.12} ${r * 0.12} ${-r} 0Q${-r * 0.12} ${-r * 0.12} 0 ${-r}Z" fill="${c}"/>`;
  // The academy crest: a rose window with gold tracery and jewel glass.
  const rose = (() => {
    let glass = '';
    let spokes = '';
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const b = a + Math.PI / 4;
      const p = (ang, r) => `${(32 + Math.cos(ang) * r).toFixed(1)} ${(32 + Math.sin(ang) * r).toFixed(1)}`;
      glass += `<path d="M${p(a, 10)}L${p(a, 25)}A25 25 0 0 1 ${p(b, 25)}L${p(b, 10)}A10 10 0 0 0 ${p(a, 10)}Z" fill="${rainbow[i % 5]}" fill-opacity="0.7"/>`;
      spokes += `<path d="M${p(a, 10)}L${p(a, 25)}"/><circle cx="${p(a + Math.PI / 8, 18).split(' ')[0]}" cy="${p(a + Math.PI / 8, 18).split(' ')[1]}" r="4.2"/>`;
    }
    return svgUrl(svg(64, 64, `<circle cx="32" cy="32" r="30" fill="${robeDark}" stroke="${brown}" stroke-width="2"/><circle cx="32" cy="32" r="27.5" fill="none" stroke="${hi}" stroke-width="3"/>${glass}<g fill="none" stroke="${gold}" stroke-width="1.6">${spokes}<circle cx="32" cy="32" r="10"/><circle cx="32" cy="32" r="25"/></g><g transform="translate(32 32)">${star(8, hi)}</g>`));
  })();
  // The Artmage swash: their rainbow paint-ribbon magic, five bands swept as one brush stroke.
  const swash = (o) => svgUrl(svg(240, 40, `<g fill="none" stroke-linecap="round" stroke-opacity="${o}">${rainbow.map((c, i) => `<path d="M${8 + i * 3} ${30 - i * 4}C60 ${8 - i * 3} 110 ${44 - i * 4} 160 ${22 - i * 4}S220 ${8 - i * 2} 234 ${16 - i * 3}" stroke="${c}" stroke-width="${9 - i * 0.8}"/>`).join('')}</g><g fill-opacity="${o}"><circle cx="230" cy="26" r="2.5" fill="${pink}"/><circle cx="222" cy="33" r="1.6" fill="${cyan}"/></g>`));
  // A painter's palette: kidney board, thumb hole, four paint dabs.
  const palette = svgUrl(svg(48, 40, `<path d="M24 3C38 3 46 11 46 20C46 28 40 30 34 29C29 28 27 31 29 34C31 38 26 39 22 39C9 39 2 31 2 21C2 10 11 3 24 3Z" fill="${hi}" stroke="${brown}" stroke-width="2"/><ellipse cx="33" cy="22" rx="3.5" ry="3" fill="${deep}"/><circle cx="13" cy="15" r="4.5" fill="${pink}"/><circle cx="24" cy="10" r="4.2" fill="${cyan}"/><circle cx="35" cy="11" r="3.8" fill="${t.success}"/><circle cx="12" cy="27" r="4.2" fill="${gold}" stroke="${brown}" stroke-width="0.8"/>`));
  // The Artmage paint ribbon: a rainbow brush sweep.
  const ribbon = (o) => svgUrl(svg(240, 24, `<defs><linearGradient id="r">${rainbowStops}</linearGradient></defs><path d="M2 14q34-11 76-5t82 0q40-6 78 1q-34 9-78 6t-82 2q-44 4-76-4z" fill="url(#r)" fill-opacity="${o}"/><path d="M14 12q66-6 128-1t84 1" fill="none" stroke="#ffffff" stroke-opacity="${o * 0.6}" stroke-width="0.8"/>`));
  const tracery = `repeating-conic-gradient(from 22.5deg, ${alpha(hi, 0.55)} 0 2deg, transparent 2deg 45deg)`;
  // A plain glass centre over the tracery, so the spokes only show on the rim, never through the label.
  const glass = (a, b) => `radial-gradient(circle closest-side, ${a}, ${b} 70%, transparent 72%)`;
  const metal = `linear-gradient(135deg, ${hi}, ${gold} 45%, ${brown})`;
  const inkOutline = [[1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5], [1.1, 1.1], [-1.1, 1.1], [1.1, -1.1], [-1.1, -1.1]].map(([x, y]) => `${x}px ${y}px 0 ${deep}`).concat(`0 2px 2px ${deep}`).join(', ');
  const titleInk = (fill = t.text) => `color: ${fill} !important; -webkit-text-stroke: 4px ${deep}; paint-order: stroke fill; text-shadow: 0 3px 0 ${brown}, 0 0 8px ${t.surface}, 0 0 8px ${t.surface} !important;`;
  const gilt = (w) => `border-image: var(--dbte-am-bevel) 16 / ${w}px stretch !important;`;
  const framePseudo = (w, inset) => `content: ""; position: absolute; left: ${inset}px; top: ${inset}px; right: ${inset}px; bottom: ${inset}px; pointer-events: none; border: ${w}px solid transparent; border-image: var(--dbte-am-bevel) 16 / ${w}px stretch; box-shadow: inset 0 0 0 1px ${piping}, 0 6px 14px ${alpha('#000000', 0.5)};`;
  // Pop-up buttons: gold bevelled plaque (primary), robe with gold trim (secondary).
  const plaque = (label, w, primary) => {
    const h = 78.5;
    const fill = primary ? 'url(#g)' : robe;
    const ink = primary ? deep : t.text;
    return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="0.5" stop-color="${gold}"/><stop offset="1" stop-color="${brown}"/></linearGradient></defs><rect x="6" y="10" width="${w - 12}" height="${h - 20}" rx="6" fill="${fill}" stroke="${primary ? brown : gold}" stroke-width="3"/><rect x="11" y="15" width="${w - 22}" height="${h - 30}" rx="3" fill="none" stroke="${primary ? alpha('#ffffff', 0.6) : piping}" stroke-width="1.2"/><g transform="translate(20 ${h / 2})">${star(6, primary ? deep : gold)}</g><g transform="translate(${w - 20} ${h / 2})">${star(6, primary ? deep : gold)}</g><text x="${w / 2}" y="${h / 2 + 1}" dominant-baseline="central" text-anchor="middle" font-family="Georgia, Times New Roman, serif" font-weight="700" font-size="27" letter-spacing="1" fill="${ink}">${label}</text></svg>`);
  };
  const imgSel = (name) => sel([`#content img[src*="/svg/${name}"]`]);

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
  const duelPanels = T(['#duel .cout_txt', '#duel #watchers']);
  const dlg = (suffix) => T(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d}${suffix}`));

  return `
html body { --dbte-am-bevel: ${bevel(16)}; --dbte-am-palette: ${palette}; --dbte-am-swash: ${swash(0.85)}; --dbte-am-swash-on: ${swash(1)}; --dbte-am-rose: ${rose}; --dbte-am-ribbon: ${ribbon(0.38)}; --dbte-am-ribbon-on: ${ribbon(0.62)}; }
@keyframes dbte-am-sweep { from { transform: scaleX(0.2); opacity: 0.2 } to { transform: scaleX(1); opacity: 1 } }
@keyframes dbte-am-glint { 0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.85 } 50% { transform: scale(1.12) rotate(12deg); opacity: 1 } }
@media (prefers-reduced-motion: reduce) { :root { --dbte-am-anim: none } }

html body #dbte-skin-layer, html body #dbte-skin-layer::before { background: radial-gradient(ellipse 38% 34% at 90% 84%, ${alpha(cyan, 0.22)}, transparent 70%), radial-gradient(ellipse 30% 26% at 50% 110%, ${alpha(pink, 0.12)}, transparent 70%) !important; }
${titles} { ${titleInk()} }
${T(['#duel_room .arial_black2', '#content .admin_lbl', '#content .subtitle'])} { text-shadow: 0 3px 0 ${brown}, ${[-10, -7, -4, 4, 7, 10].map((x) => `${x}px 0 0 ${robeDark}`).join(', ')} !important; }

${SEL.tile} {
  background: var(--dbte-am-swash) 50% 94% / 74% 16% no-repeat, radial-gradient(ellipse at 50% 0%, ${alpha(t.text, 0.1)}, transparent 60%), ${robeFill} !important;
  ${gilt(4)}
  border-radius: 0 !important;
  box-shadow: inset 0 0 0 2px ${robe}, inset 0 0 0 3px ${piping}, inset 0 -14px 24px -12px ${alpha('#000000', 0.5)}, 0 12px 22px -12px #000000 !important;
}
${SEL.tile}::before {
  content: ""; position: absolute; left: 6px; bottom: 5px; width: 28px; height: 23px; pointer-events: none;
  background: var(--dbte-am-palette) center / contain no-repeat; filter: drop-shadow(0 1px 2px ${deep});
}
${SEL.tileHover} {
  background: var(--dbte-am-swash-on) 50% 94% / 78% 18% no-repeat, radial-gradient(ellipse at 50% 0%, ${alpha(t.text, 0.16)}, transparent 60%), ${robeFill} !important;
  ${gilt(4)}
  box-shadow: inset 0 0 0 2px ${robe}, inset 0 0 0 3px ${t.text}, 0 0 22px -6px ${alpha(gold, 0.8)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { animation: var(--dbte-am-anim, dbte-am-glint 1.6s ease-in-out infinite); }
${sel(['#main_menu .menu_btn:active .content'])} { box-shadow: inset 0 0 0 2px ${robe}, inset 0 0 0 3px ${gold}, inset 0 4px 12px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; -webkit-text-stroke: 4px ${deep}; paint-order: stroke fill; text-shadow: 0 3px 0 ${alpha(deep, 0.8)} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${hi} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${gold} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${pink} !important; }

${SEL.button}, ${btnExtra} {
  background: ${robeFill} !important;
  border-image: var(--dbte-am-bevel) 16 / 2px stretch !important;
  border-radius: 0 !important;
  color: ${t.text} !important;
  box-shadow: inset 0 0 0 1px ${robe}, inset 0 0 0 2px ${alpha(t.text, 0.4)}, 0 3px 6px -2px #000000 !important;
}
${SEL.buttonHover}, ${btnExtraHover} {
  background: var(--dbte-am-ribbon-on) 50% 100% / 100% 60% no-repeat, ${robeFill} !important;
  border-image: var(--dbte-am-bevel) 16 / 2px stretch !important;
  color: ${t.text} !important;
  box-shadow: inset 0 0 0 1px ${robe}, inset 0 0 0 2px ${t.text}, 0 0 12px -3px ${alpha(gold, 0.8)} !important;
}
${SEL.buttonDown} { background: ${metal} !important; color: ${deep} !important; box-shadow: inset 0 2px 5px ${alpha(deep, 0.5)} !important; }

${imgSel('ok_btn')} { content: ${plaque('OK', 153.4, true)} !important; }
${imgSel('yes_btn')} { content: ${plaque('Yes', 153.4, true)} !important; }
${imgSel('no_btn')} { content: ${plaque('No', 153.4, false)} !important; }
${imgSel('cancel_btn')} { content: ${plaque('Cancel', 234.85, false)} !important; }

${SEL.dialog} {
  background: radial-gradient(ellipse at 50% -10%, ${alpha(cyan, 0.16)}, transparent 55%), ${robeFill} !important;
  border-radius: 0 !important;
  box-shadow: 0 30px 60px -20px #000000 !important;
}
${dlg('::before')} { ${framePseudo(10, -6)} }
${dlg('::after')} {
  content: ""; position: absolute; left: 50%; top: -48px; width: 64px; height: 64px; margin-left: -32px; pointer-events: none;
  background: var(--dbte-am-rose) center / contain no-repeat; filter: drop-shadow(0 3px 4px #000000);
}
${SEL.dialogTitle} { ${titleInk(hi)} }
${dlg(' .body_txt')} { color: ${t.text} !important; }

${SEL.chatTop} {
  background: var(--dbte-am-ribbon) 50% 100% / 100% 50% no-repeat, ${robeFill} !important;
  border-radius: 0 !important;
  box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 3px ${brown}, inset 0 0 0 4px ${piping} !important;
}
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; -webkit-text-stroke: 3px ${deep}; paint-order: stroke fill; text-shadow: none !important; }
${SEL.chat} {
  background: linear-gradient(180deg, ${robeDark}, ${t.bg}) !important;
  box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 3px ${brown}, inset 0 0 0 5px ${robeDark}, inset 0 0 0 6px ${alpha(t.text, 0.3)} !important;
}
${sel(['#chats .chat .black_line'])} { background: ${metal} !important; }

${SEL.life} { border-image: var(--dbte-am-bevel) 16 / 5px stretch !important; border-radius: 0 !important; box-shadow: 0 4px 10px ${alpha('#000000', 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 0 !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.7)}, ${t.self} 50%, ${mix(t.self, deep, 0.55)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.7)}, ${t.opp} 50%, ${mix(t.opp, deep, 0.55)}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: ${deep} !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; -webkit-text-stroke: 4px ${deep}; paint-order: stroke fill; text-shadow: none !important; }


${SEL.phase} { background: ${metal} !important; border-radius: 50% !important; box-shadow: 0 0 0 1px ${brown}, 0 4px 8px -2px #000000 !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${deep} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${glass(robe, mix(robe, robeDark, 0.6))}, ${tracery}, radial-gradient(circle, ${robe} 30%, ${robeDark}) !important; border-radius: 50% !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: ${glass(mix(t.self, deep, 0.15), mix(t.self, deep, 0.35))}, ${tracery}, radial-gradient(circle, ${t.self} 50%, ${mix(t.self, deep, 0.5)}) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: ${glass(mix(t.opp, deep, 0.15), mix(t.opp, deep, 0.35))}, ${tracery}, radial-gradient(circle, ${t.opp} 50%, ${mix(t.opp, deep, 0.5)}) !important; }
${sel(['#duel .phase.active::before'])} {
  content: ""; position: absolute; left: -12%; right: -12%; top: 88%; height: 30%; pointer-events: none;
  background: var(--dbte-am-ribbon-on) center / 100% 100% no-repeat; transform-origin: 0 50%;
  animation: var(--dbte-am-anim, dbte-am-sweep 0.5s cubic-bezier(0.2, 0.8, 0.2, 1));
}
${sel(['#duel .phase span'])} { color: ${t.text} !important; -webkit-text-stroke: 0 !important; text-shadow: ${inkOutline} !important; }
${sel(['#duel .phase.active:is(:has(.phase_inner.red), :has(.phase_inner.blue)) span'])} { color: #ffffff !important; }
${turnBg} { background: ${metal} !important; }
${turnInner} { background: ${robeFill} !important; }
${turnTxt} { color: ${hi} !important; -webkit-text-stroke: 0 !important; text-shadow: ${inkOutline} !important; }

${ring('::before')} { background: ${metal} !important; filter: none; }
${ring('::after')} { ${framePseudo(7, -3)} }
${ring('')} { background: var(--dbte-am-swash) 100% 100% / 150px 26px no-repeat, linear-gradient(180deg, ${alpha(robeDark, 0.94)}, ${alpha(t.bg, 0.94)}) !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(90deg, ${rainbow.join(', ')}) !important; }
${sel(['#duel_room #formats .format .format_inner'])} { background-color: ${alpha(t.bg, 0.5)} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(gold, 0.3)} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: var(--dbte-am-ribbon) 50% 100% / 90% 40% no-repeat, ${t.raised} !important; }

${T(deckList)} { border-radius: 0 !important; box-shadow: inset 0 0 30px ${alpha('#000000', 0.4)} !important; }
${T(deckList.map((s) => `${s}::after`))} { ${framePseudo(8, -4)} }
${sel(['#deck_constructor .deck_bg'])} { background: linear-gradient(180deg, ${robe}, ${robeDark} 40%, ${t.bg}) !important; }
${sel(['#deck_constructor .side_bg'])} { background: ${mix(robeDark, pink, 0.84)} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: ${mix(robeDark, gold, 0.86)} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: linear-gradient(180deg, ${robe}, ${robeDark} 30%) !important; }
${deckLabels} { ${titleInk()} opacity: 1 !important; }
${sel(['#deck_constructor .total_bg', '#deck_constructor .total_effect_bg', '#deck_constructor .total_spell_bg', '#deck_constructor .total_trap_bg'])} {
  background: ${robeFill} !important; border-radius: 0 !important;
  box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 3px ${brown}, inset 0 -5px 0 var(--dbt-stripe, ${pink}) !important;
}

${SEL.field} {
  background: ${mix(robeDark, deep, 0.6)} !important;
  border-image: var(--dbte-am-bevel) 16 / 2px stretch !important;
  border-radius: 0 !important;
  color: ${t.text} !important;
  box-shadow: inset 0 2px 5px ${alpha('#000000', 0.6)} !important;
}
${sel(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 1px solid ${pink} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.6)}, 0 0 10px -2px ${alpha(pink, 0.8)} !important; }

${duelPanels} { border-image: var(--dbte-am-bevel) 16 / 3px stretch !important; border-radius: 0 !important; box-shadow: inset 0 0 0 1px ${piping} !important; }
${sel(['#duel .cout_txt'])} { background: linear-gradient(180deg, ${robeDark}, ${t.bg}) !important; }
${SEL.settingsPanel} { background: var(--dbte-am-swash) 100% 100% / 130px 22px no-repeat, linear-gradient(180deg, ${alpha(robe, 0.95)}, ${alpha(robeDark, 0.95)}) !important; ${gilt(6)} border-radius: 0 !important; box-shadow: inset 0 0 0 1px ${piping}, 0 12px 26px -12px #000000 !important; }
${sel(['#content .os-scrollbar-handle'])} { background: ${metal} !important; border-radius: 1px !important; }
${sel(['#content .checkbox', '#content .radiobutton'])} { box-shadow: inset 0 0 0 1.5px ${gold}, inset 0 0 0 2.5px ${brown} !important; }
/* In a duel the stage covers the gallery: the painting, its ribbon, the brush and the studies would show through empty zones. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx :is(.dbtefx-am-brush, .dbtefx-am-studies, .dbtefx-am-gallery) { display: none; }
`;
};
