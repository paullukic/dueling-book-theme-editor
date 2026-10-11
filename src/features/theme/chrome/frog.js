// frog: a moonlit frog pond. Organic rounded frames in leaf green over still
// water; lily pads (notched, veined) as tile badges and
// phase buttons; ripple rings around pop-ups and on hover; reeds and cattails
// rising from panel corners; pebble buttons; firefly glow on focus.

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, w) => `#${rgb(a).map((v, i) => Math.round(v * w + rgb(b)[i] * (1 - w)).toString(16).padStart(2, '0')).join('')}`;

// A compact SVG data URI: only the characters CSS or the URI needs are escaped.
const svgUrl = (s) => `url("data:image/svg+xml,${s.replace(/"/g, "'").replace(/[<>#%{}\n]/g, encodeURIComponent)}")`;

export default (t, { SEL, sel, svg, alpha }) => {
  // Leaf green, pulled toward gold so it reads apart from the success green.
  const lime = mix(t.accent, t.warning, 0.72);
  const lotus = t.accent2;
  const pad = mix(lime, t.bg, 0.55);
  const padHi = mix(lime, t.bg, 0.8);
  const deep = mix(t.bg, '#000000', 0.6);
  const moon = mix(t.text, '#ffffff', 0.6);
  const water = `radial-gradient(ellipse at 70% 0%, ${alpha(moon, 0.08)}, transparent 55%), linear-gradient(180deg, ${mix(t.surface, t.opp, 0.9)}, ${t.bg})`;
  // A notched lily pad with veins.
  const lily = (fill, vein, flower) => {
    const a = (deg, r) => [(32 + Math.cos((deg * Math.PI) / 180) * r).toFixed(1), (32 + Math.sin((deg * Math.PI) / 180) * r).toFixed(1)];
    const [nx, ny] = a(-72, 29);
    let veins = '';
    for (let d = -40; d < 250; d += 42) veins += `<path d="M32 32Q${a(d + 8, 14).join(' ')} ${a(d, 26).join(' ')}"/>`;
    const bloom = flower
      ? `<g transform="translate(36 34)"><path d="M0-13q6 7 0 13q-6-6 0-13zM-12-4q9 0 12 4q-9 4-12-4zM12-4q-9 0-12 4q9 4 12-4zM-7-11q6 4 7 11q-7-3-7-11zM7-11q-6 4-7 11q7-3 7-11z" fill="${lotus}" stroke="${mix(lotus, deep, 0.6)}" stroke-width="0.6"/><circle r="2.6" fill="${t.warning}"/></g>`
      : '';
    return svgUrl(svg(64, 64, `<defs><radialGradient id="p" cx="0.45" cy="0.4" r="0.6"><stop offset="0" stop-color="${vein}"/><stop offset="1" stop-color="${fill}"/></radialGradient></defs><path d="M32 32L${nx} ${ny}A29 29 0 1 1 32 3Z" fill="url(#p)" stroke="${deep}" stroke-width="1.6" stroke-linejoin="round"/><g stroke="${deep}" stroke-width="0.9" stroke-opacity="0.45" fill="none" stroke-linecap="round">${veins}</g><path d="M8 44A27 27 0 0 0 52 50" fill="none" stroke="${moon}" stroke-opacity="0.18" stroke-width="1.5"/>${bloom}`));
  };
  // Reeds and cattails for panel corners.
  const reeds = svgUrl(svg(64, 120, `<g fill="${pad}" stroke="${deep}" stroke-width="0.8"><path d="M10 120Q8 70 2 30Q14 70 16 120Z"/><path d="M22 120Q24 60 36 14Q30 64 30 120Z"/><path d="M40 120Q46 80 60 52Q50 86 46 120Z"/></g><g stroke="${mix(lime, t.bg, 0.4)}" stroke-width="1.4"><path d="M18 120V36"/><path d="M34 120V52"/></g><rect x="14.5" y="26" width="7" height="24" rx="3.5" fill="${mix(t.warning, t.bg, 0.4)}" stroke="${deep}"/><rect x="30.5" y="42" width="7" height="20" rx="3.5" fill="${mix(t.warning, t.bg, 0.4)}" stroke="${deep}"/>`));
  const veins = `repeating-conic-gradient(from 0deg at 50% 50%, ${alpha(padHi, 0.5)} 0 1.5deg, transparent 1.5deg 36deg)`;
  const notch = 'conic-gradient(from 20deg, transparent 0 26deg, #000000 26deg)';
  const smear = (c) => [-10, -7, -4, 4, 7, 10].map((x) => `${x}px 0 0 ${c}`).join(', ');
  // Pop-up buttons: a wet river pebble, leaf green (primary) or slate (secondary).
  const pebble = (label, w, primary) =>
    svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 78.5"><defs><radialGradient id="p" cx="0.4" cy="0.25" r="0.9"><stop offset="0" stop-color="${primary ? mix(lime, '#ffffff', 0.6) : mix(t.raised, t.text, 0.75)}"/><stop offset="1" stop-color="${primary ? pad : mix(t.surface, deep, 0.5)}"/></radialGradient></defs><ellipse cx="${w / 2}" cy="44" rx="${w / 2 - 6}" ry="28" fill="${alpha(deep, 0.7)}"/><path d="M14 40Q12 12 ${w / 2} 11Q${w - 12} 12 ${w - 12} 38Q${w - 14} 66 ${w / 2} 67Q14 66 14 40Z" fill="url(#p)" stroke="${deep}" stroke-width="2"/><path d="M26 22Q${w / 2} 13 ${w - 40} 20" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/><text x="${w / 2}" y="40" dominant-baseline="central" text-anchor="middle" font-family="Arial Rounded MT Bold, Arial, sans-serif" font-weight="700" font-size="26" fill="${primary ? t.accentText : t.text}">${label}</text></svg>`);
  // Corner icons on a plain lily disc (the shared pad frame's notch line crossed the glyph).
  const disc = (w, h, glyph) => {
    const r = Math.min(w, h) / 2 - 1.5;
    const k = (Math.min(w, h) * 0.62) / 40;
    return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="${mix(t.raised, lime, 0.82)}" stroke="${lime}" stroke-width="1.6"/><circle cx="${w / 2}" cy="${h / 2}" r="${r - 3}" fill="none" stroke="${lime}" stroke-opacity="0.3" stroke-width="0.8"/><g transform="translate(${(w - 40 * k) / 2} ${(h - 40 * k) / 2}) scale(${k})" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6">${glyph}</g></svg>`);
  };
  const glyphs = {
    online: `<circle cx="16" cy="15" r="5.5" stroke="${t.text}"/><path d="M6.5 31q0-9 9.5-9t9.5 9" stroke="${t.text}"/><circle cx="27" cy="13" r="4.2" stroke="${lime}"/><path d="M26 19.5q8 .5 9 8" stroke="${lime}"/>`,
    chat: `<path d="M9 9h22q3.5 0 3.5 3.5v11q0 3.5-3.5 3.5H19l-6.5 5.5V27H9q-3.5 0-3.5-3.5v-11Q5.5 9 9 9z" stroke="${t.text}"/><g fill="${lime}" stroke="none"><circle cx="13.5" cy="18" r="1.9"/><circle cx="20" cy="18" r="1.9"/><circle cx="26.5" cy="18" r="1.9"/></g>`,
    private: `<path d="M15 6h17q3 0 3 3v8q0 3-3 3h-1v4l-4.5-4H24" stroke="${lime}"/><path d="M8 14h15q3 0 3 3v9q0 3-3 3h-9l-5 4.5V29H8q-3 0-3-3v-9q0-3 3-3z" stroke="${t.text}"/>`,
  };
  const imgSel = (name) => sel([`#content img[src*="/svg/${name}"]`]);
  const outline = (c, w = 1.5) => [[-w, -w], [w, -w], [-w, w], [w, w], [0, w], [w, 0], [0, -w], [-w, 0]].map(([x, y]) => `${x}px ${y}px 0 ${c}`).join(', ');
  const ripple = (c) => `0 0 0 1px ${alpha(c, 0.7)}, 0 0 0 7px ${alpha(t.bg, 0.35)}, 0 0 0 8px ${alpha(c, 0.3)}, 0 0 0 16px ${alpha(t.bg, 0.2)}, 0 0 0 17px ${alpha(c, 0.14)}`;

  const T = (list) => sel(list);
  const titles = T(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#content .subtitle']);
  const btnExtra = T(['#content .combobox', '#content input[type=submit]', '#content input[type=button]']);
  const btnExtraHover = T(['#content .combobox:hover', '#content .combobox.combobox_selected', '#content input[type=submit]:hover', '#content input[type=button]:hover']);
  const ringList = ['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border'];
  const ring = (suffix) => T(ringList.map((s) => s + suffix));
  const deckPanels = T(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg']);
  const deckLabels = T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl', '#deck_constructor #search .title_txt']);
  const turnBg = T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background']);
  const turnInner = T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner']);
  const turnTxt = T(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span']);
  const duelPanels = T(['#duel .cout_txt', '#duel #watchers']);
  const dlg = (suffix) => T(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d}${suffix}`));

  return `
html body { --dbte-frog-pad: ${lily(pad, padHi, false)}; --dbte-frog-bloom: ${lily(mix(lime, t.bg, 0.7), moon, true)}; --dbte-frog-reeds: ${reeds}; }
@keyframes dbte-frog-ripple { from { transform: scale(0.6); opacity: 0.9 } to { transform: scale(1.5); opacity: 0 } }
@keyframes dbte-frog-bob { 0%, 100% { transform: translateY(0) rotate(-3deg) } 50% { transform: translateY(-2px) rotate(3deg) } }
@media (prefers-reduced-motion: reduce) { :root { --dbte-frog-anim: none } }

${titles} { color: ${moon} !important; text-shadow: ${outline(deep, 2)}, 0 0 16px ${alpha(lime, 0.45)} !important; }

${SEL.tile} {
  background: ${water} !important;
  border-color: ${pad} !important;
  border-radius: 34px !important;
  box-shadow: inset 0 1px 0 ${alpha(moon, 0.15)}, inset 0 -10px 18px -10px ${alpha(lime, 0.25)}, 0 0 0 1px ${deep}, 0 12px 24px -14px #000000 !important;
}
${SEL.tile}::before {
  content: ""; position: absolute; right: 10px; top: 6px; width: 24px; height: 24px; pointer-events: none;
  background: var(--dbte-frog-pad) center / contain no-repeat; filter: drop-shadow(0 2px 2px ${deep});
  animation: var(--dbte-frog-anim, dbte-frog-bob 5s ease-in-out infinite);
}
${SEL.tileHover} {
  background: radial-gradient(circle at 90% 85%, transparent 18px, ${alpha(lime, 0.16)} 20px, transparent 23px, transparent 34px, ${alpha(lime, 0.1)} 36px, transparent 39px), ${water} !important;
  border-color: ${lime} !important;
  box-shadow: inset 0 1px 0 ${alpha(moon, 0.2)}, 0 0 0 1px ${deep}, 0 0 20px -4px ${alpha(lime, 0.6)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { background-image: var(--dbte-frog-bloom); }
${sel(['#main_menu .menu_btn:active .content'])} { box-shadow: inset 0 4px 12px #000000, 0 0 0 1px ${lime} !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: ${outline(deep, 1.5)}, 0 3px 6px #000000 !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${mix(t.text, lime, 0.6)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${pad} !important; border-radius: 50% !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${lime} !important; box-shadow: 0 0 8px ${lime}; }

${SEL.button}, ${btnExtra} {
  background: radial-gradient(ellipse at 40% 20%, ${alpha(moon, 0.16)}, transparent 60%), linear-gradient(180deg, ${mix(pad, t.raised, 0.55)}, ${mix(t.surface, deep, 0.6)}) !important;
  border-color: ${pad} !important;
  border-radius: 999px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(moon, 0.18)}, 0 3px 6px -2px #000000 !important;
}
${SEL.buttonHover}, ${btnExtraHover} {
  background: radial-gradient(ellipse at 50% 120%, ${alpha(lime, 0.45)}, transparent 70%), linear-gradient(180deg, ${mix(pad, t.raised, 0.8)}, ${t.surface}) !important;
  border-color: ${lime} !important;
  color: ${t.text} !important;
  box-shadow: 0 0 0 1px ${alpha(lime, 0.4)}, 0 0 14px -2px ${alpha(lime, 0.7)} !important;
}
${SEL.buttonDown} {
  background: radial-gradient(circle, ${alpha(lime, 0.55)}, ${pad} 80%) !important;
  border-color: ${lime} !important;
  color: ${t.accentText} !important;
  box-shadow: inset 0 2px 6px ${alpha('#000000', 0.5)} !important;
}

${SEL.dialog} {
  background: radial-gradient(ellipse at 80% 0%, ${alpha(moon, 0.14)}, transparent 45%), ${water} !important;
  border-radius: 44px !important;
  box-shadow: inset 0 0 0 2px ${pad}, inset 0 0 0 3px ${alpha(lime, 0.5)}, ${ripple(lime)}, 0 30px 60px -20px #000000 !important;
}
${dlg('::after')} {
  content: ""; position: absolute; right: -16px; top: -18px; width: 58px; height: 58px; pointer-events: none;
  background: var(--dbte-frog-bloom) center / contain no-repeat; filter: drop-shadow(0 3px 3px ${deep});
  animation: var(--dbte-frog-anim, dbte-frog-bob 5s ease-in-out infinite);
}
${SEL.dialogTitle} { color: ${moon} !important; text-shadow: ${outline(deep, 2)}, 0 0 14px ${alpha(lime, 0.5)} !important; }
${imgSel('ok_btn')} { content: ${pebble('OK', 153.4, true)} !important; }
${imgSel('yes_btn')} { content: ${pebble('Yes', 153.4, true)} !important; }
${imgSel('no_btn')} { content: ${pebble('No', 153.4, false)} !important; }
${imgSel('cancel_btn')} { content: ${pebble('Cancel', 234.85, false)} !important; }
${imgSel('online_btn')} { content: ${disc(40, 39, glyphs.online)} !important; }
${imgSel('chat_btn')} { content: ${disc(40, 34.14, glyphs.chat)} !important; }
${sel(['#content img[src*="/svg/private_btn"]:not([src*="anim"])'])} { content: ${disc(40.03, 35.75, glyphs.private)} !important; }
${T(['#duel_room .arial_black2', '#content .admin_lbl', '#content .subtitle'])} { text-shadow: ${outline(deep, 2)}, ${smear(t.surface)} !important; }
${dlg(' .body_txt')} { color: ${t.text} !important; }

${SEL.chatTop} {
  background: ${veins.replace('50% 50%', '12% 160%')}, linear-gradient(180deg, ${mix(pad, t.raised, 0.7)}, ${mix(pad, deep, 0.7)}) !important;
  border-radius: 22px 22px 6px 6px !important;
  box-shadow: inset 0 1px 0 ${alpha(moon, 0.2)}, inset 0 0 0 1px ${alpha(lime, 0.5)} !important;
}
${sel(['#chats #private_chat .chat_top_bg', '#chats #watch_chat .chat_top_bg'])} { background: ${veins.replace('50% 50%', '12% 160%')}, linear-gradient(180deg, ${mix(t.opp, t.raised, 0.45)}, ${mix(t.opp, deep, 0.3)}) !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: ${outline(deep, 1.2)} !important; }
${SEL.chat} {
  background: ${water} !important;
  border-radius: 0 0 18px 18px !important;
  box-shadow: inset 0 0 0 1px ${alpha(lime, 0.35)}, 0 0 0 1px ${deep} !important;
}
${sel(['#chats .chat .chat_background::after'])} {
  content: ""; position: absolute; right: 4px; bottom: 6px; width: 30px; height: 56px; pointer-events: none;
  background: var(--dbte-frog-reeds) 0 100% / contain no-repeat; transform: scaleX(-1);
}
${sel(['#chats .chat .black_line'])} { background: linear-gradient(90deg, transparent, ${lime}, transparent) !important; }

${SEL.life} { border-color: ${pad} !important; border-radius: 99px !important; box-shadow: 0 0 0 1px ${deep}, 0 0 14px -4px ${alpha(lime, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 99px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.7)}, ${t.self} 50%, ${mix(t.self, deep, 0.55)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.7)}, ${t.opp} 50%, ${mix(t.opp, deep, 0.55)}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: ${deep} !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: ${outline(deep, 2)} !important; }

${SEL.phase} { background: ${deep} !important; border-radius: 50% !important; box-shadow: 0 0 0 1px ${alpha(lime, 0.6)}, 0 0 0 5px ${alpha(t.bg, 0.3)}, 0 0 0 6px ${alpha(lime, 0.22)} !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${deep} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top'])} { background: transparent !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} {
  background: ${veins}, radial-gradient(circle at 40% 35%, ${mix(pad, deep, 0.7)}, ${mix(pad, deep, 0.35)}) !important; border-radius: 50% !important;
  -webkit-mask: ${notch}; mask: ${notch};
}
${sel(['#duel .phase.active .phase_inner.red'])} { background: ${veins}, radial-gradient(circle at 40% 35%, ${mix(t.self, '#ffffff', 0.6)}, ${mix(t.self, pad, 0.6)} 70%) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: ${veins}, radial-gradient(circle at 40% 35%, ${mix(t.opp, '#ffffff', 0.6)}, ${mix(t.opp, pad, 0.6)} 70%) !important; }
${sel(['#duel .phase.active::before'])} {
  content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; pointer-events: none; border-radius: 50%;
  box-shadow: 0 0 0 2px ${lime}, 0 0 18px ${alpha(lime, 0.8)};
  animation: var(--dbte-frog-anim, dbte-frog-ripple 2.4s ease-out infinite);
}
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: ${outline(deep, 2)}, 2px 3px 0 ${deep} !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${t.text} !important; text-shadow: ${outline(deep, 2)}, 2px 3px 0 ${deep} !important; }
${turnBg} { background: ${pad} !important; border-radius: 99px !important; }
${turnInner} { background: radial-gradient(ellipse at 50% 120%, ${alpha(lime, 0.4)}, transparent 70%), ${mix(t.surface, deep, 0.6)} !important; border-radius: 99px !important; }
${turnTxt} { color: ${mix(t.text, lime, 0.5)} !important; text-shadow: ${outline(deep, 1.5)} !important; }

${ring('::before')} { background: linear-gradient(135deg, ${pad}, ${lime} 50%, ${pad}) !important; border-radius: 26px !important; filter: none; }
${ring('')} { background: ${water} !important; border-radius: 26px !important; box-shadow: 0 0 0 1px ${deep}, 0 0 24px -8px ${alpha(lime, 0.5)} !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: ${lime} !important; }
${sel(['#duel_room #formats .format .format_inner'])} { background-color: ${alpha(t.bg, 0.55)} !important; border-radius: 16px 16px 0 0 !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(lime, 0.2)} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: radial-gradient(ellipse at 0% 50%, ${alpha(lime, 0.25)}, transparent 60%), ${t.raised} !important; }

${deckPanels} { border-radius: 22px !important; box-shadow: inset 0 0 0 1px ${alpha(lime, 0.35)}, 0 0 0 1px ${deep} !important; }
${sel(['#deck_constructor .deck_bg'])} { background: ${water} !important; }
${sel(['#deck_constructor .side_bg'])} { background: ${mix(t.surface, t.opp, 0.86)} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: ${mix(t.surface, t.warning, 0.86)} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${water} !important; border-radius: 22px 22px 0 0 !important; box-shadow: inset 0 0 0 1px ${alpha(lime, 0.35)} !important; }
${deckLabels} { color: ${moon} !important; opacity: 1 !important; text-shadow: ${outline(deep, 1.5)}, 0 0 12px ${alpha(lime, 0.4)} !important; }
${sel(['#deck_constructor .total_bg', '#deck_constructor .total_effect_bg', '#deck_constructor .total_spell_bg', '#deck_constructor .total_trap_bg'])} {
  background: ${veins}, radial-gradient(circle at 40% 35%, ${mix(pad, deep, 0.7)}, ${mix(pad, deep, 0.35)}) !important; border-radius: 50% !important;
  box-shadow: inset 0 0 0 2px var(--dbt-stripe, ${lime}), 0 2px 4px #000000 !important;
}
${sel(['#deck_constructor .total_txt', '#deck_constructor .total_effect_txt', '#deck_constructor .total_spell_txt', '#deck_constructor .total_trap_txt'])} { text-shadow: ${outline(deep, 1.5)} !important; }

${SEL.field} {
  background: ${mix(t.surface, deep, 0.6)} !important;
  border-color: ${alpha(lime, 0.55)} !important;
  border-radius: 10px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 2px 5px ${alpha('#000000', 0.55)} !important;
}
${sel(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 1px solid ${lime} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.55)}, 0 0 12px -2px ${alpha(t.warning, 0.8)} !important; }

${duelPanels} { border-color: ${pad} !important; border-radius: 14px !important; box-shadow: 0 0 0 1px ${deep}, 0 0 16px -6px ${alpha(lime, 0.5)} !important; }
${sel(['#duel .cout_txt'])} { background: ${water} !important; }
${SEL.settingsPanel} { border-radius: 28px !important; box-shadow: 0 0 0 1px ${deep}, 0 0 22px -8px ${alpha(lime, 0.5)} !important; }
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${pad}, ${lime}) !important; border-radius: 99px !important; }
${sel(['#content .checkbox', '#content .radiobutton'])} { box-shadow: inset 0 0 0 1.5px ${lime} !important; }
${sel(['#content .checkbox'])} { border-radius: 5px !important; }
`;
};
