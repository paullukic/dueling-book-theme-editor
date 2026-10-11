// Pendulum: a Pendulum card frame (monster orange melting into Spell green),
// its two Scale boxes (blue Scale 1, red Scale 12) and the ARC-V Pendulum
// Summon: the two Scales crowning each pop-up and a pendulum
// swinging its arc between them.
import { mix } from '../../../lib/color.js';

export default (t, kit) => {
  const { SEL, sel, svgUrl, svg, alpha, n1 } = kit;
  const orange = t.self;
  const green = t.accent;
  const blueScale = t.accent2;
  const redScale = t.danger;
  const gold = t.warning;
  const warm = mix(orange, t.bg, 0.38);
  const warmHi = mix(orange, '#ffffff', 0.25);
  const dark = mix(t.surface, t.bg, 0.4);
  const ink = mix(t.bg, '#000000', 0.3);
  const chip = mix(green, t.text, 0.62);

  // The card's two halves, blended through the middle (no hard seam).
  const halves = (a) => `linear-gradient(180deg, ${alpha(orange, a)}, ${alpha(orange, a * 0.35)} 30%, ${alpha(green, a * 0.35)} 70%, ${alpha(green, a)})`;
  // One warm frame; only the top edge carries both colours.
  const topEdge = (h) => `linear-gradient(90deg, ${orange} 50%, ${green} 50%) 0 0 / 100% ${h}px no-repeat`;

  // Card frame: solid warm rim, split top edge, dark keyline inside.
  const frame = svgUrl(svg(48, 48, `<rect x="2.5" y="2.5" width="43" height="43" rx="4" fill="none" stroke="${warm}" stroke-width="4"/><path d="M4.5 2.5H24" stroke="${orange}" stroke-width="4"/><path d="M24 2.5H43.5" stroke="${green}" stroke-width="4"/><rect x="7" y="7" width="34" height="34" rx="1" fill="none" stroke="${alpha('#000000', 0.55)}"/>`));

  // A Scale box as on the card: the arrow lozenge above, the number below.
  const scale = (c, dir, n) =>
    svgUrl(svg(28, 36, `<rect x="1" y="1" width="26" height="34" rx="3" fill="${chip}" stroke="${ink}" stroke-width="1.6"/><path d="M14 3L19.5 8.5 14 14 8.5 8.5z" fill="${c}" stroke="${ink}" stroke-width=".8"/><path d="${dir < 0 ? 'M15.6 6L12 8.5 15.6 11z' : 'M12.4 6L16 8.5 12.4 11z'}" fill="${t.text}"/><text x="14" y="32" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="${n > 9 ? 15 : 18}" fill="${ink}">${n}</text>`));

  // The pendulum: pivot, rod, a two-colour bob and the dashed arc of its swing.
  const pend = svgUrl(svg(100, 40, `<path d="M14 6A44 30 0 0 0 86 6" fill="none" stroke="${gold}" stroke-opacity=".8" stroke-width="1.6" stroke-dasharray="3 3"/><path d="M50 2V28" stroke="${chip}" stroke-width="1.6"/><circle cx="50" cy="2.6" r="2.4" fill="${gold}"/><path d="M50 22L57 31 50 39 43 31z" fill="${orange}" stroke="${t.text}" stroke-width="1.2"/><path d="M43 31H57L50 39z" fill="${green}"/>`));

  const scales = (size, x, y) => `var(--pe-s1) ${x}px ${y}px / ${size}px ${n1(size * 1.29)}px no-repeat, var(--pe-s12) calc(100% - ${x}px) ${y}px / ${size}px ${n1(size * 1.29)}px no-repeat`;

  // DuelingBook's pop-up buttons (OK/Yes primary, No/Cancel secondary) are
  // <img> SVGs: redrawn as small Pendulum cards.
  const btnFace = (l, w, h, p) => {
    const bw = n1(w - 12);
    const bh = n1(h - 20);
    const fill = p
      ? `<stop offset="0" stop-color="${warmHi}"/><stop offset=".35" stop-color="${orange}"/><stop offset=".65" stop-color="${green}"/><stop offset="1" stop-color="${mix(green, t.bg, 0.35)}"/>`
      : `<stop offset="0" stop-color="${mix(t.raised, orange, 0.2)}"/><stop offset=".5" stop-color="${dark}"/><stop offset="1" stop-color="${mix(dark, green, 0.25)}"/>`;
    return svg(w, h, `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1">${fill}</linearGradient></defs><rect x="6" y="10" width="${bw}" height="${bh}" rx="8" fill="url(#b)" stroke="${p ? ink : warm}" stroke-width="3"/><rect x="10.5" y="14.5" width="${n1(bw - 9)}" height="${n1(bh - 9)}" rx="4" fill="none" stroke="${alpha('#ffffff', p ? 0.45 : 0.15)}" stroke-width="1.5"/><text x="${n1(w / 2)}" y="${n1(h / 2 + 1)}" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="26" fill="${p ? t.accentText : t.text}">${l}</text>`);
  };
  const popButtons = [['ok_btn', 'OK', 0, 1], ['yes_btn', 'Yes', 0, 1], ['no_btn', 'No', 0, 0], ['cancel_btn', 'Cancel', 1, 0]]
    .map(([n, l, wide, p]) => `${sel([`#content img[src*="/svg/${n}"]`, `#content img[data-src*="/svg/${n}"]`])} { content: ${svgUrl(btnFace(l, wide ? 234.85 : 153.4, wide ? 78.5 : 78.47, p))} !important; }`)
    .join('\n');

  // Panel titles straddle the frame: shifted copies in the panel colour close the word gaps.
  const halo = [3, 7, 11].map((x) => `-${x}px 0 2px ${dark}, ${x}px 0 2px ${dark}`).join(', ');
  const titleText = `color: ${t.text} !important; text-shadow: var(--pe-title) !important;`;
  // Page and pop-up titles: a soft shadow only, no backing plate.
  const pageText = `color: ${t.text} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, 0 2px 8px ${alpha('#000000', 0.85)}, 0 0 16px ${alpha(green, 0.45)} !important;`;
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const PANELS = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const panel = (suffix = '') => sel(PANELS.map((p) => `#duel_room ${p}${suffix}`));
  const SETTINGS = SEL.settingsPanel;

  return `
html body {
  --pe-frame: ${frame};
  --pe-s1: ${scale(blueScale, -1, 1)};
  --pe-s12: ${scale(redScale, 1, 12)};
  --pe-pend: ${pend};
  --pe-title: -1px -1px 0 ${warm}, 1px 2px 0 ${mix(green, t.bg, 0.5)}, ${halo}, 0 -3px 2px ${dark}, 0 3px 3px ${dark}, 0 0 14px ${alpha(green, 0.35)};
}
/* The page backdrop: the two halves meet in a wide blend, never a hard seam. */
html body #dbte-skin-layer, html body #dbte-skin-layer::before { background: radial-gradient(ellipse 80% 45% at 50% -8%, ${alpha(orange, 0.26)}, transparent 70%), linear-gradient(180deg, ${mix(t.bg, '#000000', 0.35)}, ${t.bg} 45%, ${alpha(green, 0.12)} 75%, ${alpha(green, 0.26)}) !important; }

/* ---------- Menu tiles: Pendulum cards, a blue Scale rule on the left edge and a red one on the right ---------- */
${SEL.tile} {
  background: ${halves(0.32)}, ${dark} !important;
  border-image: var(--pe-frame) 14 / 8px / 0 stretch !important;
  box-shadow: inset 2px 0 0 ${blueScale}, inset -2px 0 0 ${redScale}, 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${SEL.tileHover} {
  background: ${halves(0.5)}, ${dark} !important;
  box-shadow: inset 2px 0 0 ${blueScale}, inset -2px 0 0 ${redScale}, 0 0 20px -6px ${alpha(gold, 0.6)}, 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${sel(['#main_menu .menu_btn:active .content'])} { background: ${halves(0.15)}, ${mix(dark, t.bg, 0.5)} !important; box-shadow: inset 0 3px 10px ${alpha('#000000', 0.9)} !important; }
${SEL.tileLabel} { transform: scale(0.9); color: ${t.text} !important; text-shadow: 0 2px 0 ${alpha('#000000', 0.85)}, 0 0 8px ${alpha(t.bg, 0.9)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu'])} { border-image: none !important; background: ${dark} !important; box-shadow: inset 3px 0 0 ${blueScale}, inset -3px 0 0 ${redScale} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${warm} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${orange} !important; }

/* ---------- Headings ---------- */
${sel(['#content .title1', '#content .title2', '#content .subtitle'])} { ${pageText} }
${sel(['#content .admin_lbl'])} { ${titleText} }

/* ---------- Buttons: little Pendulum cards ---------- */
${SEL.button} {
  background: ${halves(0.4)}, ${t.raised} !important;
  border-color: ${warm} !important;
  border-radius: 3px !important;
  color: ${t.text} !important;
  text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important;
  box-shadow: inset 0 2px 0 ${alpha(orange, 0.7)}, 0 2px 3px ${alpha('#000000', 0.7)} !important;
}
${SEL.buttonHover} {
  background: ${halves(0.7)}, ${t.raised} !important;
  border-color: ${warmHi} !important;
  color: ${t.text} !important;
  box-shadow: inset 0 2px 0 ${orange}, 0 0 10px -2px ${alpha(gold, 0.8)} !important;
}
${SEL.buttonDown} { background: ${dark} !important; box-shadow: inset 0 2px 6px ${alpha('#000000', 0.9)} !important; }

/* ---------- Text fields: the Pendulum effect box ---------- */
${SEL.field} {
  background-color: ${mix(t.bg, t.surface, 0.3)} !important;
  border-color: ${warm} !important;
  box-shadow: inset 0 2px 4px ${alpha('#000000', 0.7)} !important;
}
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px ${alpha('#000000', 0.7)}, 0 0 8px ${alpha(gold, 0.5)} !important; }

/* ---------- Pop-ups: the Pendulum Summon. Pillars of light hold Scale 1 and
   Scale 12; the pendulum swings its arc between them. ---------- */
${SEL.dialog} {
  background: ${halves(0.24)}, ${dark} !important;
  border-radius: 6px !important;
  box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 30px 70px -20px ${alpha('#000000', 0.95)}, 0 0 50px -20px ${alpha(gold, 0.5)} !important;
}
${sel(DIALOGS.map((d) => `#content ${d}::before`))} {
  content: ""; position: absolute; inset: 0; width: auto; height: auto; transform: none;
  border: 14px solid transparent; border-image: var(--pe-frame) 14 / 14px / 0 stretch;
  background: ${scales(40, 4, 4)}; pointer-events: none; z-index: 0;
}
${sel(DIALOGS.map((d) => `#content ${d}::after`))} {
  content: ""; position: absolute; left: 50%; top: -50px; right: auto; bottom: auto; width: 140px; height: 56px; margin-left: -70px;
  background: var(--pe-pend) center / contain no-repeat; pointer-events: none; z-index: 1;
  transform-origin: 50% 4px; animation: dbte-pendulum-swing 3.2s ease-in-out infinite alternate;
  filter: drop-shadow(0 2px 2px ${alpha('#000000', 0.8)});
}
@keyframes dbte-pendulum-swing { from { transform: rotate(-7deg); } to { transform: rotate(7deg); } }
${SEL.dialogTitle} { ${pageText} }
${sel(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d} .body_txt`))} { color: ${t.text} !important; }

/* ---------- Pop-up buttons ---------- */
${popButtons}

/* ---------- Chat: monster half above, Spell half below ---------- */
${SEL.chatTop} {
  background: ${topEdge(3)}, linear-gradient(180deg, ${mix(orange, t.raised, 0.4)}, ${warm}) !important;
  box-shadow: inset 0 -2px 0 ${alpha('#000000', 0.5)} !important;
}
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important; }
${SEL.chat} {
  background: linear-gradient(180deg, ${alpha(orange, 0.08)}, ${alpha(green, 0.05)} 40%, ${alpha(green, 0.16)}), ${dark} !important;
  box-shadow: inset 2px 0 0 ${warm}, inset -2px 0 0 ${warm}, inset 0 -2px 0 ${warm} !important;
}
${sel(['#chats .chat .cout_txt', '#chats .chat .log_txt'])} { background-color: transparent !important; }

/* ---------- Duel ---------- */
${SEL.life} {
  border-color: ${warm} !important;
  background: linear-gradient(180deg, ${alpha('#ffffff', 0.2)}, transparent 50%) !important;
  box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 0 10px -3px ${alpha(gold, 0.6)} !important;
}
${SEL.lifeSelf} { background: linear-gradient(90deg, ${mix(orange, '#000000', 0.55)}, ${orange} 75%, ${mix(orange, gold, 0.5)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(90deg, ${mix(t.opp, '#000000', 0.55)}, ${t.opp} 75%, ${mix(t.opp, '#ffffff', 0.3)}) !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, 0 0 6px ${alpha('#000000', 0.8)} !important; }

/* Phases: Pendulum-card rings; the active one carries the swing's arc */
${SEL.phase} { background: linear-gradient(180deg, ${warmHi}, ${orange} 30%, ${green} 70%, ${mix(green, t.bg, 0.3)}) !important; box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 2px 6px ${alpha('#000000', 0.8)}; }
${sel(['#duel .phase .background .background_top'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.2)}, transparent 50%) !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${dark} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${halves(0.22)}, radial-gradient(circle, ${t.raised}, ${dark} 80%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 30%, ${mix(orange, '#ffffff', 0.2)}, ${orange} 45%, ${mix(orange, '#000000', 0.55)} 85%) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.opp, '#ffffff', 0.2)}, ${t.opp} 45%, ${mix(t.opp, '#000000', 0.55)} 85%) !important; }
${sel(['#duel .phase.active .background::before'])} {
  content: ""; position: absolute; inset: -7px; border-radius: 50%;
  border: 2px dashed transparent; border-bottom-color: ${gold}; border-left-color: ${alpha(gold, 0.5)}; border-right-color: ${alpha(gold, 0.5)};
  filter: drop-shadow(0 0 3px ${gold});
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 0 14px 2px ${alpha(gold, 0.55)}; }
${sel(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important; }
${sel(['#duel .phase.active span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${alpha('#000000', 0.95)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${orange}, ${green}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${dark} !important; }
${sel(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${warm}, inset 0 3px 0 ${alpha(orange, 0.6)}; }
${sel(['#duel .cout_txt'])} { background: ${halves(0.12)}, ${dark} !important; box-shadow: inset 0 0 0 2px ${warm}, inset 0 3px 0 ${orange} !important; }
${sel(['#duel #preview_txt'])} { box-shadow: inset 0 0 0 1px ${warm}, inset 0 3px 0 ${alpha(orange, 0.6)}; }

/* ---------- Duel room: warm frames split along the top edge ---------- */
${panel('::before')} { background: ${topEdge(4)}, ${warm} !important; filter: none !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: ${topEdge(4)}, ${warmHi} !important; }
${panel()} { background: ${halves(0.12)}, ${dark} !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.95)}; }
${sel(['#duel_room #formats .format .format_inner', '#duel_room #formats .format_inner[id]'])} { background-color: ${alpha(dark, 0.85)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background-color: ${t.raised} !important; opacity: 0.88 !important; }
${sel(['#duel_room .format_txt', '#duel_room span.arial_black2', '#duel_room .title_txt.arial_black2'])} { ${titleText} }
${sel(['#duel_room .duelbutton'])} { border-color: transparent !important; box-shadow: inset 0 -1px 0 ${alpha(warm, 0.8)}; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(orange, 0.3)}, ${alpha(green, 0.2)}) !important; opacity: 1 !important; }
${sel(['#duel_room .duelbutton .game_type'])} { color: ${gold} !important; }

/* ---------- Deck constructor ---------- */
${sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg'])} {
  background: ${topEdge(3)}, ${halves(0.14)}, ${dark} !important;
  box-shadow: inset 0 0 0 2px ${warm}, inset 0 0 0 3px ${alpha('#000000', 0.5)} !important;
}
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { ${titleText} opacity: 1 !important; }
${sel(['#deck_constructor #search .title_txt'])} { ${pageText} }
${sel(['#deck_constructor #search .search_prev_btn'])} { background-color: ${blueScale} !important; }
${sel(['#deck_constructor #search .search_next_btn'])} { background-color: ${redScale} !important; }
${sel(['#deck_constructor #search .search_prev_btn:hover', '#deck_constructor #search .search_next_btn:hover'])} { background-color: ${gold} !important; }

/* ---------- Settings panels ---------- */
${SETTINGS} { background: ${topEdge(4)}, ${halves(0.16)}, ${dark} !important; border-color: ${warm} !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.95)} !important; }

/* ---------- Scrollbars ---------- */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${orange}, ${green}) !important; }
${sel(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: ${gold} !important; }

@media (prefers-reduced-motion: reduce) { html body #content *, html body #content *::before, html body #content *::after { transition: none !important; animation: none !important; } }
`;
};
