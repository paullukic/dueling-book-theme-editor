// hero: Elemental HERO. Comic-cover panels over Skyscraper city at night: a
// skyline with lit windows along panel feet, the Hero Signal (H in a moon
// disc) as the emblem on tiles and pop-ups, a searchlight sweep on hover, gold
// keylines with a red hard drop, segmented power-meter life points.

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, w) => `#${rgb(a).map((v, i) => Math.round(v * w + rgb(b)[i] * (1 - w)).toString(16).padStart(2, '0')).join('')}`;

// A compact SVG data URI: only the characters CSS or the URI needs are escaped.
const svgUrl = (s) => `url("data:image/svg+xml,${s.replace(/"/g, "'").replace(/[<>#%{}\n]/g, encodeURIComponent)}")`;

export default (t, { SEL, sel, svg, alpha }) => {
  const gold = t.accent;
  const red = t.accent2;
  const night = mix(t.bg, '#000000', 0.6);
  const moon = mix(gold, '#ffffff', 0.45);
  // The Hero Signal: spiked H in a moon disc.
  const H = (ink) => `<path d="M17 9l9 7-1 13 13-2 1-12 8-6-3 17 2 22-8-6 1-11-13 2-1 11-8 6 2-22z" fill="${ink}"/>`;
  const signal = (ring) => svgUrl(svg(64, 64, `<circle cx="32" cy="32" r="29" fill="${moon}" stroke="${ring}" stroke-width="3"/><circle cx="32" cy="32" r="24" fill="none" stroke="${alpha(night, 0.25)}" stroke-width="1"/>${H(night)}`));
  // Night skyline with lit windows, tiles horizontally.
  const skyline = (() => {
    const heights = [22, 34, 18, 40, 28, 14, 36, 24, 30, 16, 42, 20];
    let x = 0;
    let s = '';
    heights.forEach((h, i) => {
      const w = 14 + ((i * 7) % 9);
      s += `<rect x="${x}" y="${48 - h}" width="${w}" height="${h}" fill="${night}"/>`;
      for (let wy = 48 - h + 4; wy < 44; wy += 6) {
        for (let wx = x + 3; wx < x + w - 3; wx += 5) {
          if ((wx * 3 + wy * 7 + i) % 7 < 2) s += `<rect x="${wx}" y="${wy}" width="2" height="2.5" fill="${gold}" fill-opacity="0.75"/>`;
        }
      }
      if (i === 3 || i === 10) s += `<path d="M${x + w / 2 - 1} ${48 - h - 8}h2v8h-2z" fill="${night}"/>`;
      x += w;
    });
    return svgUrl(svg(x, 48, s));
  })();
  const halftone = svgUrl(svg(8, 8, `<circle cx="4" cy="4" r="1.2" fill="${t.text}" fill-opacity="0.07"/>`));
  const smear = (c) => [-10, -7, -4, 4, 7, 10].map((x) => `${x}px 0 0 ${c}`).join(', ');
  // Pop-up buttons: a comic-cover plate, gold (primary) or navy (secondary), night edge, red drop.
  const plate = (label, w, primary) =>
    svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 78.5"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${primary ? mix(gold, '#ffffff', 0.6) : mix(t.raised, t.opp, 0.75)}"/><stop offset="1" stop-color="${primary ? gold : t.surface}"/></linearGradient></defs><rect x="10" y="14" width="${w - 16}" height="58" rx="6" fill="${red}"/><rect x="5" y="9" width="${w - 16}" height="58" rx="6" fill="url(#g)" stroke="${night}" stroke-width="4"/><rect x="10" y="14" width="${w - 26}" height="48" rx="3" fill="none" stroke="${primary ? alpha('#ffffff', 0.55) : alpha(gold, 0.8)}" stroke-width="1.5"/><text x="${(w - 6) / 2}" y="39" dominant-baseline="central" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="26" fill="${primary ? night : t.text}">${label}</text></svg>`);
  const imgSel = (name) => sel([`#content img[src*="/svg/${name}"]`]);
  const beam = (a) => `linear-gradient(105deg, transparent 38%, ${alpha(moon, a)} 46%, ${alpha(moon, a * 0.4)} 52%, transparent 58%)`;
  const frame = (drop = 5) => `inset 0 0 0 1px ${alpha(gold, 0.9)}, inset 0 0 0 3px ${night}, 0 0 0 2px ${night}, ${drop}px ${drop}px 0 2px ${red}`;

  const T = (list) => sel(list);
  const titles = T(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#content .subtitle']);
  const btnExtra = T(['#content .combobox', '#content input[type=submit]', '#content input[type=button]']);
  const btnExtraHover = T(['#content .combobox:hover', '#content .combobox.combobox_selected', '#content input[type=submit]:hover', '#content input[type=button]:hover']);
  const ring = (suffix) => T(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border'].map((s) => s + suffix));
  const deckPanels = T(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg']);
  const deckLabels = T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl', '#deck_constructor #search .title_txt']);
  const turnBg = T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background']);
  const turnInner = T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner']);
  const turnTxt = T(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span']);
  const duelPanels = T(['#duel .cout_txt', '#duel #watchers']);
  const dlg = (suffix) => T(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d}${suffix}`));

  return `
html body { --dbte-hero-sky: ${skyline}; --dbte-hero-dots: ${halftone}; --dbte-hero-glow: linear-gradient(0deg, ${alpha(t.opp, 0.34)}, ${alpha(t.opp, 0.08)} 30%, transparent 55%); }
@keyframes dbte-hero-sweep { 0%, 100% { transform: rotate(-9deg); opacity: 0.55 } 50% { transform: rotate(9deg); opacity: 0.9 } }
@media (prefers-reduced-motion: reduce) { :root { --dbte-hero-anim: none } }

${titles} { color: ${gold} !important; -webkit-text-stroke: 4px ${night}; paint-order: stroke fill; text-shadow: 3px 3px 0 ${red} !important; }

${SEL.tile} {
  background: var(--dbte-hero-sky) 0 100% / auto 46% repeat-x, var(--dbte-hero-glow), var(--dbte-hero-dots), linear-gradient(180deg, ${mix(t.raised, t.opp, 0.85)}, ${t.surface} 70%) !important;
  border-color: ${night} !important;
  border-radius: 4px !important;
  box-shadow: ${frame(5)} !important;
}
${SEL.tile}::before {
  content: ""; position: absolute; left: 6px; top: 5px; width: 18px; height: 18px; pointer-events: none;
  background: ${signal(gold)} center / contain no-repeat;
  filter: drop-shadow(0 0 6px ${alpha(moon, 0.5)}); opacity: 0.9;
}
${SEL.tileHover} {
  background: ${beam(0.35)}, var(--dbte-hero-sky) 0 100% / auto 46% repeat-x, var(--dbte-hero-glow), var(--dbte-hero-dots), linear-gradient(180deg, ${mix(t.raised, gold, 0.78)}, ${t.raised} 70%) !important;
  border-color: ${night} !important;
  box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 4px ${night}, 0 0 0 2px ${night}, 7px 7px 0 2px ${red}, 0 0 26px -6px ${alpha(gold, 0.7)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; filter: drop-shadow(0 0 10px ${moon}); }
${sel(['#main_menu .menu_btn:active .content'])} { box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 4px ${night}, 0 0 0 2px ${night}, 2px 2px 0 2px ${red} !important; }
${SEL.tileLabel} { color: ${t.text} !important; -webkit-text-stroke: 4px ${night}; paint-order: stroke fill; text-shadow: 3px 3px 0 ${red} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${gold} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${gold} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${red} !important; }

${SEL.button}, ${btnExtra} {
  background: linear-gradient(180deg, ${mix(t.raised, t.opp, 0.8)}, ${t.surface}) !important;
  border-color: ${night} !important;
  border-radius: 3px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.18)}, inset 0 -3px 0 ${gold}, 0 0 0 1px ${night}, 3px 3px 0 1px ${red} !important;
}
${SEL.buttonHover}, ${btnExtraHover} {
  background: ${beam(0.3)}, linear-gradient(180deg, ${mix(gold, '#ffffff', 0.8)}, ${gold}) !important;
  border-color: ${night} !important;
  color: ${t.accentText} !important;
  box-shadow: inset 0 -3px 0 ${red}, 0 0 0 1px ${night}, 4px 4px 0 1px ${red}, 0 0 16px -4px ${alpha(gold, 0.8)} !important;
}
${SEL.buttonDown} {
  background: ${red} !important;
  border-color: ${night} !important;
  color: ${night} !important;
  box-shadow: inset 0 3px 0 ${alpha(night, 0.4)}, 0 0 0 1px ${night}, 1px 1px 0 1px ${night} !important;
}

${SEL.dialog} {
  background: var(--dbte-hero-sky) 0 100% / auto 28% repeat-x, var(--dbte-hero-glow), var(--dbte-hero-dots), radial-gradient(circle at 88% 8%, ${alpha(moon, 0.22)}, transparent 32%), linear-gradient(180deg, ${mix(t.surface, t.opp, 0.8)}, ${t.bg}) !important;
  border-radius: 6px !important;
  box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 5px ${night}, 0 0 0 3px ${t.text}, 0 0 0 5px ${night}, 10px 10px 0 5px ${red}, 0 30px 60px -20px #000000 !important;
}
${dlg('::before')} {
  content: ""; position: absolute; right: -20px; top: -22px; width: 64px; height: 64px; pointer-events: none;
  background: ${signal(t.text)} center / contain no-repeat; filter: drop-shadow(0 0 12px ${alpha(moon, 0.7)});
}
${dlg('::after')} {
  content: ""; position: absolute; right: 12px; top: 26px; width: 120px; height: 200px; pointer-events: none; transform-origin: 50% 0;
  background: linear-gradient(180deg, ${alpha(moon, 0.22)}, transparent); clip-path: polygon(44% 0, 56% 0, 100% 100%, 0 100%);
  animation: var(--dbte-hero-anim, dbte-hero-sweep 7s ease-in-out infinite);
}
${SEL.dialogTitle} { color: ${gold} !important; -webkit-text-stroke: 4px ${night}; paint-order: stroke fill; text-shadow: 3px 3px 0 ${red} !important; }
${imgSel('ok_btn')} { content: ${plate('OK', 153.4, true)} !important; }
${imgSel('yes_btn')} { content: ${plate('Yes', 153.4, true)} !important; }
${imgSel('no_btn')} { content: ${plate('No', 153.4, false)} !important; }
${imgSel('cancel_btn')} { content: ${plate('Cancel', 234.85, false)} !important; }
${T(['#duel_room .arial_black2', '#content .admin_lbl', '#content .subtitle'])} { text-shadow: 3px 3px 0 ${red}, ${smear(t.surface)} !important; }
${dlg(' .body_txt')} { color: ${t.text} !important; }

${SEL.chatTop} {
  background: linear-gradient(115deg, ${red} 0 58%, ${night} 58% 60%, ${gold} 60%) !important;
  border-radius: 4px 4px 0 0 !important;
  box-shadow: inset 0 0 0 2px ${night}, inset 0 -4px 0 ${night} !important;
}
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; -webkit-text-stroke: 3px ${night}; paint-order: stroke fill; text-shadow: 2px 2px 0 ${red} !important; }
${SEL.chat} {
  background: var(--dbte-hero-sky) 0 100% / auto 44px repeat-x, var(--dbte-hero-glow), var(--dbte-hero-dots), linear-gradient(180deg, ${t.surface}, ${t.bg}) !important;
  box-shadow: inset 0 0 0 1px ${alpha(gold, 0.8)}, 0 0 0 2px ${night}, 5px 5px 0 2px ${red} !important;
}
${sel(['#chats .chat .black_line'])} { background-color: ${gold} !important; }

${SEL.life} { border-color: ${gold} !important; border-radius: 4px !important; box-shadow: 0 0 0 2px ${night}, 4px 4px 0 2px ${red}, 0 0 14px -4px ${alpha(gold, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 4px !important; }
${SEL.lifeSelf} { background: repeating-linear-gradient(90deg, transparent 0 13px, ${alpha(night, 0.75)} 13px 15px), linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.7)}, ${t.self} 50%, ${mix(t.self, night, 0.6)}) !important; }
${SEL.lifeOpp} { background: repeating-linear-gradient(90deg, transparent 0 13px, ${alpha(night, 0.75)} 13px 15px), linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.7)}, ${t.opp} 50%, ${mix(t.opp, night, 0.6)}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: var(--dbte-hero-sky) 0 100% / auto 100% repeat-x, var(--dbte-hero-glow), ${night} !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; -webkit-text-stroke: 4px ${night}; paint-order: stroke fill; text-shadow: 2px 2px 0 ${red} !important; }

${SEL.phase} { background: linear-gradient(135deg, ${gold}, ${mix(gold, red, 0.4)}) !important; border-radius: 10px !important; box-shadow: 0 0 0 2px ${night}, 3px 3px 0 2px ${red} !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${night} !important; border-radius: 8px !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbte-hero-dots), linear-gradient(180deg, ${t.raised}, ${t.surface}) !important; border-radius: 7px !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: ${beam(0.4)}, linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.7)}, ${t.self} 55%, ${mix(t.self, night, 0.6)}) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: ${beam(0.4)}, linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.7)}, ${t.opp} 55%, ${mix(t.opp, night, 0.6)}) !important; }
${sel(['#duel .phase.active::before'])} {
  content: ""; position: absolute; left: 50%; bottom: 50%; width: 56px; height: 90px; margin-left: -28px; pointer-events: none; transform-origin: 50% 100%;
  background: linear-gradient(0deg, ${alpha(moon, 0.85)}, ${alpha(moon, 0)}); clip-path: polygon(0 0, 100% 0, 58% 100%, 42% 100%);
  animation: var(--dbte-hero-anim, dbte-hero-sweep 5s ease-in-out infinite);
}
${sel(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 0 ${night} !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${t.text} !important; -webkit-text-stroke: 3px ${night}; paint-order: stroke fill; text-shadow: 2px 2px 0 ${red} !important; }
${turnBg} { background: ${gold} !important; box-shadow: 0 0 0 2px ${night}, 3px 3px 0 2px ${red}; }
${turnInner} { background: ${beam(0.35)}, linear-gradient(180deg, ${mix(t.raised, t.opp, 0.8)}, ${night}) !important; }
${turnTxt} { color: ${gold} !important; -webkit-text-stroke: 3px ${night}; paint-order: stroke fill; text-shadow: 2px 2px 0 ${red} !important; }

${ring('::before')} { background: linear-gradient(135deg, ${gold}, ${mix(gold, red, 0.5)} 60%, ${red}) !important; filter: none; }
${ring('')} {
  background: var(--dbte-hero-sky) 0 100% / auto 34px repeat-x, var(--dbte-hero-glow), var(--dbte-hero-dots), linear-gradient(180deg, ${alpha(t.surface, 0.92)}, ${alpha(t.bg, 0.92)}) !important;
  box-shadow: 0 0 0 2px ${night}, 7px 7px 0 2px ${alpha(red, 0.85)} !important;
}
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(135deg, ${moon}, ${gold}) !important; }
${sel(['#duel_room #formats .format .format_inner'])} { background-color: ${alpha(t.surface, 0.9)} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(gold, 0.35)} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${beam(0.2)}, ${t.raised} !important; }

${deckPanels} { border-radius: 4px !important; box-shadow: inset 0 0 0 1px ${alpha(gold, 0.7)}, 0 0 0 2px ${night}, 5px 5px 0 2px ${red} !important; }
${sel(['#deck_constructor .deck_bg'])} { background: var(--dbte-hero-sky) 0 100% / auto 90px repeat-x, var(--dbte-hero-glow), var(--dbte-hero-dots), linear-gradient(180deg, ${mix(t.surface, t.opp, 0.82)}, ${t.bg}) !important; }
${sel(['#deck_constructor .side_bg'])} { background: var(--dbte-hero-dots), ${mix(t.surface, red, 0.84)} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: var(--dbte-hero-dots), ${mix(t.surface, gold, 0.86)} !important; }
${sel(['#deck_constructor #search .search_bg'])} {
  background: var(--dbte-hero-sky) 0 100% / auto 90px repeat-x, var(--dbte-hero-glow), var(--dbte-hero-dots), linear-gradient(180deg, ${t.surface}, ${t.bg}) !important; border-radius: 4px !important;
  box-shadow: inset 0 0 0 1px ${alpha(gold, 0.7)}, 0 0 0 2px ${night}, 5px 5px 0 2px ${red} !important;
}
${deckLabels} { color: ${gold} !important; opacity: 1 !important; -webkit-text-stroke: 4px ${night}; paint-order: stroke fill; text-shadow: 2px 2px 0 ${red} !important; }
${sel(['#deck_constructor .total_bg', '#deck_constructor .total_effect_bg', '#deck_constructor .total_spell_bg', '#deck_constructor .total_trap_bg'])} {
  background: linear-gradient(180deg, ${t.raised}, ${night}) !important; border-radius: 4px !important;
  box-shadow: inset 0 0 0 1px ${gold}, inset 0 -4px 0 var(--dbt-stripe, ${gold}), 2px 2px 0 ${red} !important;
}

${SEL.field} {
  background-color: ${mix(t.surface, night, 0.5)} !important;
  border-color: ${alpha(gold, 0.55)} !important;
  border-radius: 2px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 -2px 0 ${gold}, inset 0 2px 4px ${alpha(night, 0.7)} !important;
}
${sel(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 2px solid ${gold} !important; box-shadow: 3px 3px 0 ${red}, 0 0 14px -2px ${alpha(gold, 0.6)} !important; }

${duelPanels} { border-color: ${night} !important; border-radius: 4px !important; box-shadow: inset 0 0 0 1px ${alpha(gold, 0.7)}, 0 0 0 2px ${night}, 4px 4px 0 2px ${red} !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbte-hero-dots), linear-gradient(180deg, ${t.surface}, ${t.bg}) !important; }
${SEL.settingsPanel} { border-radius: 4px !important; box-shadow: 0 0 0 2px ${night}, 6px 6px 0 2px ${red} !important; }
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${gold}, ${mix(gold, red, 0.5)}) !important; border-radius: 2px !important; }
${sel(['#content .checkbox', '#content .radiobutton'])} { box-shadow: inset 0 0 0 1.5px ${gold}, 2px 2px 0 ${red} !important; }
`;
};
