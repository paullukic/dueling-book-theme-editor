// sky-striker: the Sky Striker Ace cockpit HUD. Chamfered panels with corner
// brackets and targeting ticks, the hex wireframe of the Sky Striker frames,
// scanlines, and the two ace colours (Raye/Kagari red, Roze/Shizuku blue)
// as per-tile system stripes; segmented HUD life gauges, chamfered phase keys
// with a lock-on reticle on the active one.
import { svgUrl as kitSvgUrl } from './kit.js';

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, w) => `#${rgb(a).map((v, i) => Math.round(v * w + rgb(b)[i] * (1 - w)).toString(16).padStart(2, '0')).join('')}`;

// A compact SVG data URI: only the characters CSS or the URI needs are escaped.
const svgUrl = kitSvgUrl;

export default (t, { SEL, sel, svg, alpha }) => {
  const red = t.accent;
  const cyan = t.accent2;
  const deep = mix(t.bg, '#000000', 0.6);
  const hexes = svgUrl(svg(28, 48, `<path d="M14 0l14 8v16l-14 8L0 24V8zM14 32v16" fill="none" stroke="${cyan}" stroke-opacity="0.07" stroke-width="1"/>`));
  const scan = `repeating-linear-gradient(0deg, ${alpha(cyan, 0.035)} 0 1px, transparent 1px 4px)`;
  const L = (c, x, y, w, h) => `linear-gradient(${c}, ${c}) ${x} ${y} / ${w} ${h} no-repeat`;
  // Repeated background stacks are defined once as custom properties.
  const defs = [];
  const def = (css) => {
    let i = defs.indexOf(css);
    if (i < 0) i = defs.push(css) - 1;
    return `var(--dbte-ss-${i})`;
  };
  // Corner brackets as backgrounds: length l, weight w.
  const brackets = (c, l = 12, w = 2) => def(bracketsRaw(c, l >= 18 ? 22 : 12, w > 2 ? 3 : 2));
  const bracketsRaw = (c, l, w) => [['0', '0', w, w, 90], ['100%', '0', `${l - w}`, w, 180], ['0', '100%', w, `${l - w}`, 0], ['100%', '100%', `${l - w}`, `${l - w}`, 270]]
    .map(([x, y, cx, cy, from]) => `conic-gradient(from ${from}deg at ${cx}px ${cy}px, transparent 25%, ${c} 0) ${x} ${y} / ${l}px ${l}px no-repeat`).join(', ');
  // Left corners only (the life bar: its numerals run to the right edge).
  const leftBrackets = (c) => bracketsRaw(c, 12, 2).split(', conic').filter((_, i) => i % 2 === 0).join(', conic');
  // Targeting ticks at the midpoints of each side.
  const ticks = (c, l = 8, w = 2) => def([L(c, '50%', '0', `${w}px`, `${l}px`), L(c, '50%', '100%', `${w}px`, `${l}px`), L(c, '0', '50%', `${l}px`, `${w}px`), L(c, '100%', '50%', `${l}px`, `${w}px`)].join(', '));
  const cut = (n, below = 0) => `polygon(${n}px 0, 100% 0, 100% calc(100% - ${n}px), calc(100% - ${n}px) calc(100% + ${below}px), 0 calc(100% + ${below}px), 0 ${n}px)`;
  // The diagonal edge lines along the two chamfers.
  const chamferLines = (c, n) => def(`linear-gradient(135deg, transparent ${n / 1.414 - 1}px, ${c} ${n / 1.414 - 1}px, ${c} ${n / 1.414 + 0.6}px, transparent ${n / 1.414 + 0.6}px) 0 0 / ${n * 2}px ${n * 2}px no-repeat, linear-gradient(315deg, transparent ${n / 1.414 - 1}px, ${c} ${n / 1.414 - 1}px, ${c} ${n / 1.414 + 0.6}px, transparent ${n / 1.414 + 0.6}px) 100% 100% / ${n * 2}px ${n * 2}px no-repeat`);
  const smear = (c) => [-10, -7, -4, 4, 7, 10].map((x) => `${x}px 0 0 ${c}`).join(', ');
  // Pop-up buttons: an angled launch-key slab (chamfered like the tiles), white label.
  const slab = (label, w, primary) => {
    const h = 78.5;
    const c = 12;
    const pts = `6,${10 + c} ${6 + c},10 ${w - 6},10 ${w - 6},${h - 10 - c} ${w - 6 - c},${h - 10} 6,${h - 10}`;
    return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${primary ? mix(red, '#ffffff', 0.8) : mix(t.raised, cyan, 0.8)}"/><stop offset="1" stop-color="${primary ? mix(red, deep, 0.55) : deep}"/></linearGradient></defs><polygon points="${pts}" fill="url(#s)" stroke="${primary ? mix(red, '#ffffff', 0.6) : cyan}" stroke-width="2"/><path d="M${6 + c + 6} 15H${w * 0.42}" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2"/><path d="M${w - 20} ${h - 16}H${w - 50}" stroke="${primary ? '#ffffff' : cyan}" stroke-opacity="0.6" stroke-width="2"/><text x="${w / 2}" y="${h / 2}" dominant-baseline="central" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="25" letter-spacing="1.5" fill="#ffffff" stroke="${deep}" stroke-width="3" paint-order="stroke">${label}</text></svg>`);
  };
  const imgSel = (name) => sel([`#content img[src*="/svg/${name}"]`]);
  const hudText = (c) => `0 0 6px ${alpha(c, 0.85)}, 0 0 1px ${c}, 2px 2px 0 ${deep}`;
  const reticle = svgUrl(svg(80, 80, `<g fill="none" stroke="#ffffff" stroke-width="2.5"><path d="M4 22V4h18M58 4h18v18M76 58v18H58M22 76H4V58"/><circle cx="40" cy="40" r="34" stroke-width="1" stroke-dasharray="4 6" stroke-opacity="0.8"/></g><g stroke="${mix(cyan, '#ffffff', 0.4)}" stroke-width="2"><path d="M40 0v9M40 71v9M0 40h9M71 40h9"/></g>`));

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
    const panelFill = `${scan}, var(--dbte-ss-hex), linear-gradient(180deg, ${mix(t.raised, cyan, 0.9)}, ${t.surface} 60%, ${mix(t.surface, deep, 0.6)})`;

  const body = `
html body { --dbte-ss-scan: ${scan}; --dbte-ss-fill: ${panelFill}; --dbte-ss-hex: ${hexes}; --dbte-ss-reticle: ${reticle}; --dbte-ss-ace: ${red}; }
@keyframes dbte-ss-lock { from { transform: rotate(0deg) scale(1.08) } to { transform: rotate(90deg) scale(1) } }
@keyframes dbte-ss-blink { 0%, 100% { opacity: 1 } 50% { opacity: 0.45 } }
@media (prefers-reduced-motion: reduce) { :root { --dbte-ss-anim: none } }

${titles} { color: ${t.text} !important; text-shadow: ${hudText(cyan)}, -2px 0 0 ${alpha(red, 0.6)} !important; }

${sel(['#main_menu .menu_btn:nth-of-type(2n+1) .content'])} { --dbte-ss-ace: ${red}; }
${sel(['#main_menu .menu_btn:nth-of-type(2n) .content'])} { --dbte-ss-ace: ${cyan}; }
${SEL.tile} {
  background: ${brackets(cyan, 16, 2)}, ${chamferLines(cyan, 14)}, linear-gradient(90deg, var(--dbte-ss-ace) 0 5px, transparent 5px), linear-gradient(90deg, color-mix(in srgb, var(--dbte-ss-ace) 22%, transparent), transparent 45%), var(--dbte-ss-fill) !important;
  border-color: ${alpha(cyan, 0.25)} !important;
  border-radius: 0 !important;
  clip-path: ${cut(14, 4)};
  box-shadow: inset 0 0 0 1px ${alpha(cyan, 0.2)}, inset 0 0 26px ${alpha(cyan, 0.08)} !important;
}
${SEL.tile}::before {
  content: ""; position: absolute; right: 18px; top: 8px; width: 48px; height: 6px; pointer-events: none;
  background: repeating-linear-gradient(90deg, var(--dbte-ss-ace) 0 6px, transparent 0 9px); opacity: 0;
}
${SEL.tileHover} {
  background: ${brackets(t.text, 20, 2)}, ${chamferLines(t.text, 14)}, ${ticks(cyan, 8, 2)}, linear-gradient(90deg, var(--dbte-ss-ace) 0 8px, transparent 8px), linear-gradient(90deg, color-mix(in srgb, var(--dbte-ss-ace) 38%, transparent), transparent 70%), var(--dbte-ss-fill) !important;
  border-color: ${alpha(cyan, 0.6)} !important;
  box-shadow: inset 0 0 0 1px ${alpha(cyan, 0.6)}, inset 0 0 30px ${alpha(cyan, 0.18)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 0.9; animation: var(--dbte-ss-anim, dbte-ss-blink 0.6s steps(2) infinite); }
${sel(['#main_menu .menu_btn:active .content'])} { box-shadow: inset 0 0 0 2px var(--dbte-ss-ace), inset 0 0 30px color-mix(in srgb, var(--dbte-ss-ace) 35%, transparent) !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: ${hudText(cyan)} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { text-shadow: 0 0 10px ${cyan}, 2px 2px 0 ${deep}, -2px 0 0 ${alpha(red, 0.7)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${cyan} !important; border-radius: 0 !important; transform: rotate(45deg) scale(0.8); }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${red} !important; border-radius: 0 !important; }

${SEL.button}, ${btnExtra} {
  background: ${chamferLines(cyan, 7)}, var(--dbte-ss-scan), linear-gradient(180deg, ${mix(t.raised, cyan, 0.88)}, ${deep}) !important;
  border-color: ${alpha(cyan, 0.55)} !important;
  border-radius: 0 !important;
  color: ${t.text} !important;
  clip-path: ${cut(7)};
  box-shadow: inset 0 -2px 0 ${alpha(cyan, 0.7)} !important;
}
${SEL.buttonHover}, ${btnExtraHover} {
  background: ${chamferLines(t.text, 7)}, var(--dbte-ss-scan), linear-gradient(180deg, ${mix(cyan, t.raised, 0.45)}, ${mix(cyan, deep, 0.25)}) !important;
  border-color: ${cyan} !important;
  color: ${t.text} !important;
  box-shadow: inset 0 -2px 0 ${t.text}, inset 0 0 12px ${alpha(cyan, 0.4)} !important;
}
${SEL.buttonDown} {
  background: ${chamferLines(t.text, 7)}, linear-gradient(180deg, ${mix(red, deep, 0.7)}, ${mix(red, deep, 0.4)}) !important;
  border-color: ${red} !important;
  color: ${t.text} !important;
  box-shadow: inset 0 0 12px ${alpha('#000000', 0.5)} !important;
}

${SEL.dialog} {
  background: transparent !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  filter: drop-shadow(0 0 14px ${alpha(cyan, 0.35)}) drop-shadow(0 24px 30px #000000);
}
${dlg('::before')} {
  content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; z-index: auto; transform: none; pointer-events: none;
  clip-path: ${cut(26)};
  background: ${chamferLines(cyan, 26)}, linear-gradient(90deg, ${red} 0 22%, transparent 22%) 0 0 / 100% 5px no-repeat, repeating-linear-gradient(-45deg, ${alpha(cyan, 0.5)} 0 6px, transparent 6px 12px) 100% 0 / 34% 5px no-repeat, var(--dbte-ss-fill);
  box-shadow: inset 0 0 0 1.5px ${alpha(cyan, 0.7)}, inset 0 0 40px ${alpha(cyan, 0.12)};
}
${dlg('::after')} {
  content: ""; position: absolute; left: -3px; top: -3px; right: -3px; bottom: -3px; width: auto; height: auto; z-index: auto; transform: none; pointer-events: none;
  background: ${brackets(cyan, 26, 3)}, ${ticks(alpha(cyan, 0.8), 10, 2)};
}
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: ${hudText(cyan)}, -2px 0 0 ${alpha(red, 0.6)} !important; }
${imgSel('ok_btn')} { content: ${slab('OK', 153.4, true)} !important; }
${imgSel('yes_btn')} { content: ${slab('Yes', 153.4, true)} !important; }
${imgSel('no_btn')} { content: ${slab('No', 153.4, false)} !important; }
${imgSel('cancel_btn')} { content: ${slab('Cancel', 234.85, false)} !important; }
${T(['#duel_room .arial_black2', '#content .admin_lbl', '#content .subtitle'])} { text-shadow: ${hudText(cyan)}, ${smear(t.surface)} !important; }
${dlg(' .body_txt')} { color: ${t.text} !important; }

${SEL.chatTop} {
  background: linear-gradient(90deg, ${red} 0 6px, transparent 6px), repeating-linear-gradient(-45deg, ${alpha(cyan, 0.18)} 0 5px, transparent 5px 10px) 100% 0 / 30% 100% no-repeat, linear-gradient(180deg, ${mix(t.raised, cyan, 0.8)}, ${deep}) !important;
  border-radius: 0 !important;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
  box-shadow: inset 0 -2px 0 ${cyan}, inset 0 0 0 1px ${alpha(cyan, 0.35)} !important;
}
${sel(['#chats #private_chat .chat_top_bg', '#chats #calls .chat_top_bg', '#chats #duel_log .chat_top_bg'])} { box-shadow: inset 0 -2px 0 ${red}, inset 0 0 0 1px ${alpha(red, 0.35)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: ${hudText(cyan)} !important; }
${SEL.chat} {
  background: ${brackets(cyan, 12, 2)}, var(--dbte-ss-scan), var(--dbte-ss-hex), ${t.surface} !important;
  box-shadow: inset 0 0 0 1px ${alpha(cyan, 0.3)} !important;
}
${sel(['#chats .chat .black_line'])} { background: linear-gradient(90deg, ${red} 0 18%, ${cyan} 18%) !important; }

${SEL.life} {
  background: ${leftBrackets(t.text)} !important;
  border-color: ${alpha(cyan, 0.6)} !important; border-radius: 0 !important;
  box-shadow: 0 0 12px -2px ${alpha(cyan, 0.5)} !important;
}
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 0 !important; }
${SEL.lifeSelf} { background: repeating-linear-gradient(90deg, transparent 0 8px, ${alpha(deep, 0.85)} 8px 10px), linear-gradient(180deg, ${mix(cyan, '#ffffff', 0.6)}, ${cyan} 45%, ${mix(cyan, deep, 0.55)}) !important; }
${SEL.lifeOpp} { background: repeating-linear-gradient(90deg, transparent 0 8px, ${alpha(deep, 0.85)} 8px 10px), linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.6)}, ${t.opp} 45%, ${mix(t.opp, deep, 0.55)}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: var(--dbte-ss-scan), repeating-linear-gradient(90deg, ${alpha(cyan, 0.08)} 0 8px, transparent 8px 10px), ${deep} !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: -1.5px -1.5px 0 ${deep}, 1.5px -1.5px 0 ${deep}, -1.5px 1.5px 0 ${deep}, 1.5px 1.5px 0 ${deep}, 0 0 8px ${alpha(cyan, 0.8)} !important; }

${SEL.phase} { background: linear-gradient(135deg, ${cyan}, ${mix(cyan, deep, 0.4)}) !important; border-radius: 0 !important; clip-path: ${cut(12)}; }
${sel(['#duel .phase .background .background_inner'])} { background: ${deep} !important; border-radius: 0 !important; clip-path: ${cut(10)}; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbte-ss-scan), linear-gradient(180deg, ${mix(t.raised, cyan, 0.85)}, ${t.surface}) !important; border-radius: 0 !important; clip-path: ${cut(9)}; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbte-ss-scan), linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.75)}, ${t.self} 50%, ${mix(t.self, deep, 0.55)}) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbte-ss-scan), linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.75)}, ${t.opp} 50%, ${mix(t.opp, deep, 0.55)}) !important; }
${sel(['#duel .phase.active::before'])} {
  content: ""; position: absolute; left: -5px; top: -5px; right: -5px; bottom: -5px; pointer-events: none;
  background: var(--dbte-ss-reticle) center / contain no-repeat;
  animation: var(--dbte-ss-anim, dbte-ss-lock 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both);
}
${sel(['#duel .phase span'])} { color: #d6e4f0 !important; text-shadow: 0 1px 2px ${deep} !important; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${t.text} !important; text-shadow: -1px -1px 0 ${deep}, 1px -1px 0 ${deep}, -1px 1px 0 ${deep}, 1px 1px 0 ${deep} !important; }
/* TURN in the turn owner's colour: red is the bottom player, blue (under it) the top one. */
${turnBg} { background: ${t.self} !important; border-radius: 0 !important; clip-path: ${cut(9)}; }
${T(['#duel #turn:has(> .red[style*="none"]) .background'])} { background: ${t.opp} !important; }
${turnInner} { background: var(--dbte-ss-scan), linear-gradient(180deg, ${mix(t.raised, deep, 0.5)}, ${deep}) !important; border-radius: 0 !important; clip-path: ${cut(8)}; }
${T(['#duel #turn .red', '#duel #start_turn .red', '#duel #end_turn .red'])} { background: var(--dbte-ss-scan), linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.7)}, ${mix(t.self, deep, 0.75)} 55%, ${mix(t.self, deep, 0.35)}) !important; border-radius: 0 !important; clip-path: ${cut(8)}; box-shadow: none !important; }
${T(['#duel #turn .blue'])} { background: var(--dbte-ss-scan), linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.7)}, ${mix(t.opp, deep, 0.75)} 55%, ${mix(t.opp, deep, 0.35)}) !important; border-radius: 0 !important; clip-path: ${cut(8)}; box-shadow: none !important; }
${turnTxt} { color: #ffffff !important; text-shadow: -1px -1px 0 ${deep}, 1px -1px 0 ${deep}, -1px 1px 0 ${deep}, 1px 1px 0 ${deep}, 2px 2px 0 ${deep} !important; }

${ring('::before')} { background: linear-gradient(135deg, ${cyan}, ${alpha(cyan, 0.35)} 40%, ${alpha(cyan, 0.35)} 60%, ${cyan}) !important; border-radius: 0 !important; filter: none; }
${ring('')} { background: var(--dbte-ss-scan), var(--dbte-ss-hex), ${alpha(t.surface, 0.92)} !important; border-radius: 0 !important; box-shadow: inset 0 0 30px ${alpha(cyan, 0.08)} !important; }
${ring('::after')} {
  content: ""; position: absolute; left: -6px; top: -6px; right: -6px; bottom: -6px; pointer-events: none;
  background: ${brackets(t.text, 22, 3)}, ${ticks(cyan, 9, 2)};
}
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: ${red} !important; }
${sel(['#duel_room .format_txt'])} { color: ${t.text} !important; text-shadow: ${hudText(cyan)}, -2px 0 0 ${alpha(red, 0.6)} !important; }
${sel(['#duel_room #formats .format .format_inner'])} { background-color: ${alpha(t.bg, 0.55)} !important; border-radius: 0 !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(cyan, 0.2)} !important; border-radius: 0 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${red} 0 4px, ${alpha(cyan, 0.16)} 4px, transparent 70%), ${t.raised} !important; }

${T(deckList)} { border-radius: 0 !important; box-shadow: inset 0 0 0 1px ${alpha(cyan, 0.35)}, inset 0 0 30px ${alpha(cyan, 0.06)} !important; }
${sel(['#deck_constructor .deck_bg'])} { background: ${brackets(cyan, 20, 2)}, var(--dbte-ss-scan), var(--dbte-ss-hex), linear-gradient(180deg, ${mix(t.surface, cyan, 0.92)}, ${t.bg}) !important; }
${sel(['#deck_constructor .side_bg'])} { background: ${brackets(cyan, 14, 2)}, var(--dbte-ss-scan), ${mix(t.surface, cyan, 0.88)} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: ${brackets(red, 14, 2)}, var(--dbte-ss-scan), ${mix(t.surface, red, 0.88)} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${brackets(cyan, 20, 2)}, var(--dbte-ss-scan), var(--dbte-ss-hex), ${t.surface} !important; }
${deckLabels} { color: ${t.text} !important; opacity: 1 !important; text-shadow: ${hudText(cyan)} !important; }
${sel(['#deck_constructor .total_bg', '#deck_constructor .total_effect_bg', '#deck_constructor .total_spell_bg', '#deck_constructor .total_trap_bg'])} {
  background: ${brackets(cyan, 7, 1.5)}, ${deep} !important; border-radius: 0 !important;
  box-shadow: inset 0 -3px 0 var(--dbt-stripe, ${cyan}) !important;
}

${SEL.field} {
  background: var(--dbte-ss-scan), ${deep} !important;
  border-color: ${alpha(cyan, 0.4)} !important;
  border-radius: 0 !important;
  color: ${t.text} !important;
  box-shadow: inset 0 -2px 0 ${cyan} !important;
}
${sel(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 1px solid ${cyan} !important; box-shadow: inset 0 -2px 0 ${red}, 0 0 12px -2px ${alpha(cyan, 0.8)} !important; }

${duelPanels} { background: ${brackets(cyan, 10, 2)}, var(--dbte-ss-scan), var(--dbte-ss-hex), ${t.surface} !important; border-color: ${alpha(cyan, 0.4)} !important; border-radius: 0 !important; }
${SEL.settingsPanel} { background-image: ${brackets(t.text, 14, 2)} !important; border-radius: 0 !important; box-shadow: inset 0 0 26px ${alpha(cyan, 0.06)}, 0 0 16px -6px ${alpha(cyan, 0.5)} !important; }
${sel(['#content .os-scrollbar-handle'])} { background: repeating-linear-gradient(0deg, ${cyan} 0 4px, transparent 4px 6px) !important; border-radius: 0 !important; }
${sel(['#content .checkbox', '#content .radiobutton'])} { border-radius: 0 !important; box-shadow: inset 0 0 0 1.5px ${cyan} !important; }
${sel(['#content .radiobutton'])} { transform: rotate(45deg) scale(0.85); }
/* The front-page links sit over the ace's red armour: a dark plate keeps them legible. */
${sel(['#welcome_buttons > span'])} { background: ${alpha(deep, 0.9)} !important; box-shadow: 0 0 0 0.25em ${alpha(deep, 0.9)} !important; border-radius: 0; }
/* The chat column cuts the ace in a duel: she recedes; the radar's bearing ring stays off the menu's status feed. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-ss-acegrp { opacity: 0.7; }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-ss-hud { display: none; }
`;
  return `html body { ${defs.map((d, i) => `--dbte-ss-${i}: ${d};`).join(' ')} }
${body}`;
};
