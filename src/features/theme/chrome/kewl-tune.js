// kewl-tune: Kewl Tune club gear. Brushed mixer faceplates with corner rivets
// (the card frames' riveted brackets), LED VU meters (tile feet, life points),
// rotary-knob phases with lit rings, rack-unit pop-ups with an analog VU dial,
// fader dividers, LCD fields and neon-tube titles in pink and teal.
import { svgUrl as kitSvgUrl } from './kit.js';

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, w) => `#${rgb(a).map((v, i) => Math.round(v * w + rgb(b)[i] * (1 - w)).toString(16).padStart(2, '0')).join('')}`;

// A compact SVG data URI: only the characters CSS or the URI needs are escaped.
const svgUrl = kitSvgUrl;

export default (t, { SEL, sel, svg, alpha }) => {
  const pink = t.accent;
  const teal = t.accent2;
  const amber = t.warning;
  const metal = mix(t.muted, t.raised, 0.35);
  const deep = mix(t.bg, '#000000', 0.55);
  const plate = `repeating-linear-gradient(0deg, ${alpha(t.text, 0.025)} 0 1px, transparent 1px 3px), linear-gradient(180deg, ${mix(t.raised, metal, 0.8)}, ${t.surface})`;
  const rivet = (x, y) => `radial-gradient(circle at ${x} ${y}, ${mix(metal, '#ffffff', 0.6)} 0 1.4px, ${deep} 2.2px, transparent 2.8px)`;
  const rivets = (o = 7) => [rivet(`${o}px`, `${o}px`), rivet(`calc(100% - ${o}px)`, `${o}px`), rivet(`${o}px`, `calc(100% - ${o}px)`), rivet(`calc(100% - ${o}px)`, `calc(100% - ${o}px)`)].join(', ');
  // LED meter: lit segments green-to-pink, 'on' share lit.
  const leds = (on, a = 1, base = teal) =>
    `repeating-linear-gradient(90deg, transparent 0 5px, ${deep} 5px 7px), linear-gradient(90deg, ${alpha(base, a)} 0 ${Math.min(on, 55)}%, ${alpha(amber, a)} ${Math.min(on, 55)}% ${Math.min(on, 78)}%, ${alpha(pink, a)} ${Math.min(on, 78)}% ${on}%, ${alpha(t.text, 0.08)} ${on}%)`;
  const neon = (c, r = 12) => `0 0 0 1px ${alpha(c, 0.9)}, 0 0 ${r}px -2px ${alpha(c, 0.9)}, inset 0 0 ${r}px -4px ${alpha(c, 0.7)}`;
  // Analog VU dial: cream face, scale, red zone, needle.
  const dial = (() => {
    let ticks = '';
    for (let i = 0; i <= 10; i++) {
      const a = Math.PI * (1.15 + (i / 10) * 0.7);
      const r1 = 30;
      const r2 = i % 5 === 0 ? 24 : 27;
      ticks += `<line x1="${(40 + Math.cos(a) * r1).toFixed(1)}" y1="${(44 + Math.sin(a) * r1).toFixed(1)}" x2="${(40 + Math.cos(a) * r2).toFixed(1)}" y2="${(44 + Math.sin(a) * r2).toFixed(1)}" stroke="${i > 7 ? pink : deep}" stroke-width="${i % 5 === 0 ? 1.6 : 1}"/>`;
    }
    return svgUrl(svg(80, 52, `<rect x="1" y="1" width="78" height="50" rx="7" fill="${metal}" stroke="${deep}" stroke-width="2"/><rect x="5" y="5" width="70" height="42" rx="4" fill="${mix(t.text, amber, 0.82)}"/>${ticks}<path d="M60 18 A30 30 0 0 1 66 26" fill="none" stroke="${pink}" stroke-width="3"/><line x1="40" y1="44" x2="57" y2="20" stroke="${deep}" stroke-width="1.6" stroke-linecap="round"/><circle cx="40" cy="44" r="3.5" fill="${deep}"/><text x="12" y="42" font-family="Arial" font-weight="700" font-size="7" fill="${deep}">VU</text>`));
  })();
  // Vinyl grooves for big panels.
  const vinyl = `repeating-radial-gradient(circle at 100% 100%, ${alpha(t.text, 0.03)} 0 1px, transparent 1px 4px)`;
  // Knob ticks around the phase buttons.
  const ticks = `repeating-conic-gradient(from -2deg, ${alpha(t.text, 0.55)} 0 4deg, transparent 4deg 30deg)`;
  const smear = (c) => [-10, -7, -4, 4, 7, 10].map((x) => `${x}px 0 0 ${c}`).join(', ');
  // Pop-up buttons: a mixer key in brushed metal with an LED strip; pink lit for primary.
  const key = (label, w, primary) =>
    svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 78.5"><defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(metal, '#ffffff', 0.8)}"/><stop offset="0.3" stop-color="${mix(metal, deep, 0.6)}"/><stop offset="1" stop-color="${mix(metal, deep, 0.3)}"/></linearGradient></defs><rect x="5" y="9" width="${w - 10}" height="60" rx="7" fill="${deep}"/><rect x="8" y="12" width="${w - 16}" height="54" rx="5" fill="url(#m)" stroke="${deep}" stroke-width="1.5"/><rect x="16" y="56" width="${w - 32}" height="5" rx="2" fill="${primary ? pink : teal}"/><rect x="16" y="56" width="${w - 32}" height="5" rx="2" fill="none" stroke="${primary ? pink : teal}" stroke-opacity="0.5" stroke-width="4"/><text x="${w / 2}" y="34" dominant-baseline="central" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="25" letter-spacing="1" fill="${t.text}">${label}</text></svg>`);
  // A cassette tape for the lobby panel corners: shell, label, two reels, window.
  const cassette = svgUrl(svg(60, 38, `<rect x="1" y="1" width="58" height="36" rx="4" fill="${deep}" stroke="${metal}" stroke-width="1.5"/><rect x="6" y="5" width="48" height="16" rx="2" fill="${pink}"/><path d="M8 9h30M8 13h22" stroke="${deep}" stroke-opacity="0.6"/><rect x="14" y="19" width="32" height="10" rx="5" fill="${mix(deep, t.text, 0.85)}" stroke="${metal}"/><circle cx="20" cy="24" r="3.5" fill="none" stroke="${teal}" stroke-width="1.5"/><circle cx="40" cy="24" r="3.5" fill="none" stroke="${teal}" stroke-width="1.5"/><path d="M10 37l4-5h32l4 5" fill="${mix(metal, deep, 0.5)}"/><circle cx="4.5" cy="4.5" r="1.2" fill="${metal}"/><circle cx="55.5" cy="4.5" r="1.2" fill="${metal}"/>`));
  const imgSel = (name) => sel([`#content img[src*="/svg/${name}"]`]);
  const neonText = (c) => `0 0 2px ${t.text}, 0 0 8px ${alpha(c, 0.95)}, 0 0 18px ${alpha(c, 0.6)}, 2px 2px 0 ${deep}`;

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
html body { --dbte-kt-dial: ${dial}; }
@keyframes dbte-kt-pulse { 0%, 100% { opacity: 0.75 } 50% { opacity: 1 } }
@keyframes dbte-kt-meter { 0%, 100% { transform: scaleX(0.82) } 30% { transform: scaleX(1) } 60% { transform: scaleX(0.9) } }
@media (prefers-reduced-motion: reduce) { :root { --dbte-kt-anim: none } }

${titles} { color: ${mix(t.text, pink, 0.75)} !important; text-shadow: ${neonText(pink)} !important; }

${SEL.tile} {
  background: ${rivets(9)}, ${plate} !important;
  border-color: ${deep} !important;
  border-radius: 6px !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.14)}, inset 0 0 0 1px ${alpha(metal, 0.5)}, 0 0 0 1px ${deep}, 0 10px 22px -12px #000000 !important;
}
${SEL.tile}::before {
  content: ""; position: absolute; left: 22px; right: 22px; bottom: 5px; height: 5px; pointer-events: none; border-radius: 1px;
  background: ${leds(40, 0.85)}; transform-origin: 0 50%;
  box-shadow: 0 0 6px -1px ${alpha(teal, 0.6)};
}
${SEL.tileHover} {
  background: ${rivets(9)}, radial-gradient(ellipse at 50% 120%, ${alpha(pink, 0.28)}, transparent 65%), ${plate} !important;
  border-color: ${deep} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.18)}, ${neon(pink, 16)}, 0 0 0 2px ${deep} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { background: ${leds(96, 1)} !important; box-shadow: 0 0 10px ${alpha(pink, 0.7)}; animation: var(--dbte-kt-anim, dbte-kt-meter 0.9s ease-in-out infinite); }
${sel(['#main_menu .menu_btn:active .content'])} { box-shadow: inset 0 3px 8px #000000, ${neon(teal, 10)} !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${deep}, 0 0 2px ${deep}, 0 0 10px ${alpha(pink, 0.6)}, 0 0 18px ${alpha(teal, 0.35)} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${mix(t.text, pink, 0.6)} !important; text-shadow: ${neonText(pink)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${metal} !important; background: ${deep} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${teal} !important; box-shadow: 0 0 8px ${teal}; }

${SEL.button}, ${btnExtra} {
  background: linear-gradient(180deg, ${mix(t.raised, metal, 0.75)}, ${deep}) !important;
  border-color: ${deep} !important;
  border-radius: 5px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.16)}, inset 0 -2px 0 ${alpha(teal, 0.85)}, 0 0 0 1px ${alpha(metal, 0.4)}, 0 3px 6px -2px #000000 !important;
}
${SEL.buttonHover}, ${btnExtraHover} {
  background: radial-gradient(ellipse at 50% 100%, ${alpha(pink, 0.55)}, transparent 75%), linear-gradient(180deg, ${mix(t.raised, pink, 0.8)}, ${deep}) !important;
  border-color: ${pink} !important;
  color: ${t.text} !important;
  box-shadow: inset 0 -2px 0 ${pink}, 0 0 12px -2px ${alpha(pink, 0.85)} !important;
}
${SEL.buttonDown} {
  background: radial-gradient(ellipse at 50% 50%, ${alpha(teal, 0.6)}, ${deep} 80%) !important;
  border-color: ${teal} !important;
  color: ${t.text} !important;
  box-shadow: inset 0 2px 6px #000000, 0 0 14px -2px ${alpha(teal, 0.9)} !important;
}

${SEL.dialog} {
  background: ${rivets(10)}, ${vinyl}, ${plate} !important;
  border-radius: 8px !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.18)}, inset 0 0 0 1px ${alpha(metal, 0.6)}, 0 0 0 2px ${deep}, ${neon(pink, 22)}, 0 30px 60px -20px #000000 !important;
}
${dlg('::after')} {
  content: ""; position: absolute; right: 18px; top: 14px; width: 74px; height: 48px; pointer-events: none;
  background: var(--dbte-kt-dial) center / contain no-repeat;
  filter: drop-shadow(0 2px 3px #000000);
}
${SEL.dialogTitle} { color: ${mix(t.text, teal, 0.6)} !important; text-shadow: ${neonText(teal)} !important; }
${imgSel('ok_btn')} { content: ${key('OK', 153.4, true)} !important; }
${imgSel('yes_btn')} { content: ${key('Yes', 153.4, true)} !important; }
${imgSel('no_btn')} { content: ${key('No', 153.4, false)} !important; }
${imgSel('cancel_btn')} { content: ${key('Cancel', 234.85, false)} !important; }
${T(['#duel_room .arial_black2', '#content .admin_lbl', '#content .subtitle'])} { text-shadow: ${neonText(pink)}, ${smear(t.surface)} !important; }
${[38, 62, 46, 74, 54, 30, 66, 42].map((v, i) => `${sel([`#main_menu .menu_btn:nth-of-type(${i + 1}) .content::before`])} { background: ${leds(v, 0.85)}; }`).join(' ')}
${dlg(' .body_txt')} { color: ${t.text} !important; }

${SEL.chatTop} {
  background: ${rivets(6)}, repeating-linear-gradient(90deg, transparent 0 5px, ${deep} 5px 7px) 96% 82% / 30% 4px no-repeat, linear-gradient(90deg, ${teal}, ${amber}, ${pink}) 96% 82% / 30% 4px no-repeat, ${plate} !important;
  border-radius: 6px 6px 0 0 !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.18)}, inset 0 0 0 1px ${alpha(metal, 0.6)}, inset 0 -2px 0 ${teal}, 0 0 12px -4px ${alpha(teal, 0.8)} !important;
}
${sel(['#chats #private_chat .chat_top_bg', '#chats #calls .chat_top_bg', '#chats #duel_log .chat_top_bg'])} { box-shadow: inset 0 0 0 1px ${alpha(pink, 0.6)}, inset 0 -2px 0 ${pink}, 0 0 12px -4px ${alpha(pink, 0.8)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${mix(t.text, teal, 0.55)} !important; text-shadow: 0 0 6px ${alpha(teal, 0.9)} !important; }
${SEL.chat} {
  background: ${rivets(7)}, ${vinyl}, linear-gradient(180deg, ${t.surface}, ${t.bg}) !important;
  box-shadow: inset 0 0 0 1px ${alpha(metal, 0.45)}, 0 0 0 1px ${deep} !important;
}
${sel(['#chats .chat .black_line'])} { background: linear-gradient(90deg, transparent 30%, ${metal} 30% 38%, transparent 38%), linear-gradient(0deg, transparent 40%, ${deep} 40% 60%, transparent 60%) !important; }

${SEL.life} { border-color: ${deep} !important; border-radius: 5px !important; box-shadow: inset 0 0 0 1px ${alpha(metal, 0.6)}, 0 0 0 1px ${alpha(metal, 0.5)}, 0 0 14px -4px ${alpha(teal, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 5px !important; }
${SEL.lifeSelf} { background: repeating-linear-gradient(90deg, transparent 0 6px, ${alpha(deep, 0.75)} 6px 7px), linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 45%), linear-gradient(90deg, ${mix(t.self, deep, 0.85)}, ${mix(t.self, '#ffffff', 0.88)}) !important; }
${SEL.lifeOpp} { background: repeating-linear-gradient(90deg, transparent 0 6px, ${alpha(deep, 0.75)} 6px 7px), linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 45%), linear-gradient(90deg, ${mix(t.opp, deep, 0.85)}, ${mix(t.opp, '#ffffff', 0.88)}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: repeating-linear-gradient(90deg, ${alpha(t.text, 0.07)} 0 5px, ${deep} 5px 7px), ${deep} !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: -2px -2px 0 ${deep}, 2px -2px 0 ${deep}, -2px 2px 0 ${deep}, 2px 2px 0 ${deep}, 0 2px 0 ${deep}, 2px 0 0 ${deep}, 0 -2px 0 ${deep}, -2px 0 0 ${deep}, 0 0 10px ${alpha(teal, 0.6)} !important; }

${sel(['#duel .phase::before'])} {
  content: ""; position: absolute; left: -6px; top: -6px; right: -6px; bottom: -6px; pointer-events: none; border-radius: 50%;
  background: ${ticks}; -webkit-mask: radial-gradient(circle, transparent 60%, #000000 61%); mask: radial-gradient(circle, transparent 60%, #000000 61%);
}
${SEL.phase} { background: conic-gradient(from 210deg, ${mix(metal, '#ffffff', 0.7)}, ${deep}, ${metal}, ${deep}, ${mix(metal, '#ffffff', 0.7)}) !important; border-radius: 50% !important; box-shadow: 0 4px 8px -2px #000000 !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${deep} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: linear-gradient(0deg, transparent 46%, ${alpha(t.text, 0.5)} 46% 54%, transparent 54%) 50% 0 / 2px 30% no-repeat, radial-gradient(circle at 40% 30%, ${t.raised}, ${deep} 75%) !important; border-radius: 50% !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 40% 30%, ${mix(t.self, '#ffffff', 0.7)}, ${t.self} 45%, ${mix(t.self, deep, 0.4)} 80%) !important; box-shadow: 0 0 16px ${alpha(t.self, 0.9)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 40% 30%, ${mix(t.opp, '#ffffff', 0.7)}, ${t.opp} 45%, ${mix(t.opp, deep, 0.4)} 80%) !important; box-shadow: 0 0 16px ${alpha(t.opp, 0.9)}; }
${sel(['#duel .phase.active::before'])} { background: conic-gradient(${pink}, ${teal}, ${pink}); animation: var(--dbte-kt-anim, dbte-kt-pulse 1.2s ease-in-out infinite); }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${deep}, 0 0 3px ${deep} !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: #ffffff !important; text-shadow: 1px 0 0 ${deep}, -1px 0 0 ${deep}, 0 1px 0 ${deep}, 0 -1px 0 ${deep}, 1px 1px 0 ${deep}, -1px -1px 0 ${deep}, 1px -1px 0 ${deep}, -1px 1px 0 ${deep}, 0 0 6px ${deep} !important; }
/* Main menu: the LED wall and the deck would stand behind the feed's time and Reply column; the arch's wide halo would ghost along the feed edge. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx :is(.dbtefx-kt-eq, .dbtefx-kt-deck, .dbtefx-kt-halo) { display: none; }
/* TURN lights in the turn owner's colour: red is the bottom player, blue (under it) the top one. */
${turnBg} { background: ${metal} !important; box-shadow: 0 0 12px -2px ${alpha(t.self, 0.8)}; }
${T(['#duel #turn:has(> .red[style*="none"]) .background'])} { box-shadow: 0 0 12px -2px ${alpha(t.opp, 0.8)}; }
${turnInner} { background: ${deep} !important; }
${T(['#duel #turn .red', '#duel #start_turn .red', '#duel #end_turn .red'])} { background: radial-gradient(ellipse at 50% 100%, ${mix(t.self, '#ffffff', 0.75)}, ${mix(t.self, deep, 0.7)} 75%) !important; box-shadow: inset 0 0 0 1px ${alpha('#ffffff', 0.35)} !important; }
${T(['#duel #turn .blue'])} { background: radial-gradient(ellipse at 50% 100%, ${mix(t.opp, '#ffffff', 0.75)}, ${mix(t.opp, deep, 0.7)} 75%) !important; box-shadow: inset 0 0 0 1px ${alpha('#ffffff', 0.35)} !important; }
${turnTxt} { color: #ffffff !important; text-shadow: 1px 0 0 ${deep}, -1px 0 0 ${deep}, 0 1px 0 ${deep}, 0 -1px 0 ${deep}, 0 0 4px ${deep} !important; }

${ring('::before')} { background: linear-gradient(135deg, ${pink}, ${mix(pink, teal, 0.5)} 50%, ${teal}) !important; filter: drop-shadow(0 0 6px ${alpha(pink, 0.7)}); }
${ring('::after')} {
  content: ""; position: absolute; right: 12px; top: -15px; width: 46px; height: 29px; pointer-events: none;
  background: ${cassette} center / contain no-repeat; filter: drop-shadow(0 2px 3px #000000);
}
${ring('')} { background: ${vinyl}, ${alpha(t.surface, 0.92)} !important; box-shadow: 0 0 22px -6px ${alpha(teal, 0.5)} !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: ${pink} !important; }
${sel(['#duel_room #formats .format .format_inner'])} { background-color: ${alpha(t.bg, 0.6)} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(metal, 0.35)} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(pink, 0.22)}, transparent 70%), ${t.raised} !important; }

${deckPanels} { border-radius: 6px !important; box-shadow: inset 0 0 0 1px ${alpha(metal, 0.45)}, 0 0 0 1px ${deep} !important; }
${sel(['#deck_constructor .deck_bg'])} { background: ${rivets(9)}, ${vinyl}, linear-gradient(180deg, ${mix(t.surface, teal, 0.92)}, ${t.bg}) !important; }
${sel(['#deck_constructor .side_bg'])} { background: ${rivets(7)}, ${mix(t.surface, pink, 0.86)} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: ${rivets(7)}, ${mix(t.surface, amber, 0.88)} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${rivets(9)}, ${plate} !important; border-radius: 6px !important; box-shadow: inset 0 0 0 1px ${alpha(metal, 0.45)}, 0 0 0 1px ${deep} !important; }
${deckLabels} { color: ${mix(t.text, teal, 0.6)} !important; opacity: 1 !important; text-shadow: ${neonText(teal)} !important; }
${sel(['#deck_constructor .total_bg', '#deck_constructor .total_effect_bg', '#deck_constructor .total_spell_bg', '#deck_constructor .total_trap_bg'])} {
  background: repeating-linear-gradient(0deg, ${alpha('#000000', 0.3)} 0 1px, transparent 1px 3px), ${deep} !important; border-radius: 4px !important;
  box-shadow: inset 0 0 0 1px ${alpha(metal, 0.6)}, inset 0 -3px 0 var(--dbt-stripe, ${teal}), 0 0 8px -2px var(--dbt-stripe, ${teal}) !important;
}

${SEL.field} {
  background: repeating-linear-gradient(0deg, ${alpha('#000000', 0.2)} 0 1px, transparent 1px 3px), ${mix(deep, teal, 0.92)} !important;
  border-color: ${alpha(metal, 0.7)} !important;
  border-radius: 3px !important;
  color: ${mix(t.text, teal, 0.6)} !important;
  box-shadow: inset 0 2px 5px #000000 !important;
}
${sel(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 1px solid ${teal} !important; box-shadow: inset 0 2px 5px #000000, 0 0 12px -2px ${alpha(teal, 0.9)} !important; }

${duelPanels} { border-color: ${deep} !important; border-radius: 5px !important; box-shadow: inset 0 0 0 1px ${alpha(metal, 0.45)}, 0 0 0 1px ${deep} !important; }
${sel(['#duel .cout_txt'])} { background: ${vinyl}, linear-gradient(180deg, ${t.surface}, ${t.bg}) !important; }
${SEL.settingsPanel} { border-radius: 8px !important; box-shadow: 0 0 18px -6px ${alpha(teal, 0.6)}, inset 0 0 0 1px ${alpha(metal, 0.4)} !important; }
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(0deg, ${deep} 0 44%, ${pink} 44% 56%, ${deep} 56%), ${metal} !important; border-radius: 2px !important; box-shadow: inset 0 0 0 1px ${metal}; }
${sel(['#content .checkbox', '#content .radiobutton'])} { background-color: ${deep} !important; box-shadow: inset 0 0 0 1px ${metal}, 0 0 6px -1px ${alpha(teal, 0.6)} !important; }
`;
};
