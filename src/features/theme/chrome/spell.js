// Spell Card: every surface is a Spell card face. A bevelled green frame
// around a dark art artBg, the SPELL attribute medallion pinned to the
// corner, the [SPELL CARD] type line, and an arcane octagram that turns
// under the active phase.
import { mix } from '../../../lib/color.js';

export default (t, kit) => {
  const { SEL, sel, svgUrl, svg, alpha } = kit;
  const green = t.accent;
  const gold = t.accent2;
  const frame = mix(green, t.bg, 0.3);
  const frameHi = mix(green, '#ffffff', 0.35);
  const frameLo = mix(green, t.bg, 0.62);
  const artBg = mix(t.surface, t.bg, 0.35);
  const ink = mix(green, t.bg, 0.85);

  // Card frame: dark keyline, green band with a sheen, bevelled inner edge.
  const frameSvg = svgUrl(svg(48, 48, `<defs><linearGradient id="s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${frameHi}"/><stop offset=".35" stop-color="${green}"/><stop offset=".7" stop-color="${frame}"/><stop offset="1" stop-color="${green}"/></linearGradient></defs><rect x=".5" y=".5" width="47" height="47" rx="3" fill="none" stroke="${ink}"/><rect x="4" y="4" width="40" height="40" rx="1.5" fill="none" stroke="url(#s)" stroke-width="6"/><path d="M8.5 39.5V8.5H39.5" fill="none" stroke="${alpha('#000000', 0.7)}"/><path d="M8.5 39.5H39.5V8.5" fill="none" stroke="${alpha(frameHi, 0.7)}"/>`));
  // Fine diagonal grain of the frame's foil.
  const foil = svgUrl(svg(8, 8, `<path d="M0 8L8 0" stroke="${t.text}" stroke-opacity=".05"/>`));

  // The SPELL medallion: green disc, white rim, a four-point sparkle.
  const sparkle = (cx, cy, r, c) => `<path d="M${cx} ${cy - r}Q${cx + r * 0.16} ${cy - r * 0.16} ${cx + r} ${cy}Q${cx + r * 0.16} ${cy + r * 0.16} ${cx} ${cy + r}Q${cx - r * 0.16} ${cy + r * 0.16} ${cx - r} ${cy}Q${cx - r * 0.16} ${cy - r * 0.16} ${cx} ${cy - r}Z" fill="${c}"/>`;
  const medal = svgUrl(svg(32, 32, `<defs><radialGradient id="m" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="${frameHi}"/><stop offset=".6" stop-color="${green}"/><stop offset="1" stop-color="${frameLo}"/></radialGradient></defs><circle cx="16" cy="16" r="14.5" fill="url(#m)" stroke="${t.text}" stroke-width="2"/><circle cx="16" cy="16" r="11" fill="none" stroke="${alpha(t.text, 0.45)}" stroke-width=".8"/>${sparkle(16, 16, 8.5, t.text)}<circle cx="16" cy="16" r="1.6" fill="${green}"/>`));

  // [SPELL CARD] type line with the Quick-Play bolt.
  const typeLine = svgUrl(svg(150, 18, `<text x="0" y="13.5" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="13" letter-spacing="1.5" fill="${mix(t.text, green, 0.2)}">[SPELL CARD</text><path d="M118 2L111 10.5h4.5L113 16.5l8-9h-4.6L119.5 2z" fill="${gold}"/><text x="124" y="13.5" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="13" fill="${mix(t.text, green, 0.2)}">]</text>`));

  // Arcane octagram.
  const octagram = (c, o) => {
    let ticks = '';
    for (let i = 0; i < 32; i++) ticks += `<path d="M50 3v${i % 4 ? 3 : 6}" transform="rotate(${i * 11.25} 50 50)"/>`;
    return svg(100, 100, `<g fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1.6"><circle cx="50" cy="50" r="47"/><circle cx="50" cy="50" r="40" stroke-width="1"/><rect x="22" y="22" width="56" height="56"/><rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)"/>${ticks}</g>`);
  };

  const bevel = `inset 1px 1px 0 ${alpha(frameHi, 0.45)}, inset -1px -1px 0 ${alpha('#000000', 0.6)}`;
  const art = `radial-gradient(ellipse 80% 70% at 50% 40%, ${alpha(green, 0.12)}, transparent 70%), linear-gradient(180deg, ${mix(artBg, green, 0.08)}, ${artBg})`;
  const nameText = `color: ${mix(green, '#ffffff', 0.72)} !important; text-shadow: 0 1px 0 ${ink}, -2px 0 2px ${t.bg}, 2px 0 2px ${t.bg}, 0 -2px 2px ${t.bg}, 0 0 16px ${alpha(green, 0.55)} !important;`;
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const PANELS = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const panel = (suffix = '') => sel(PANELS.map((p) => `#duel_room ${p}${suffix}`));

  const SETTINGS = sel(['.about_me', '.preferences', '.social_media', '.animation', '.profile_song', '.account', '.messages', '.duel_stats', '.profile_comments'].map((s) => `#settings ${s}`));

  return `
html body {
  --sp-frame: ${frameSvg};
  --sp-foil: ${foil};
  --sp-medal: ${medal};
  --sp-type: ${typeLine};
  --sp-octa: ${svgUrl(octagram(gold, 0.85))};
  --sp-octa-dim: ${svgUrl(octagram(green, 0.16))};
}
/* ---------- Menu tiles: Spell cards, medallion in the corner ---------- */
${SEL.tile} {
  background: ${art} !important;
  border-image: var(--sp-frame) 12 / 10px / 0 stretch !important;
  box-shadow: 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; right: -9px; top: -9px; width: 22px; height: 22px; pointer-events: none;
  background: var(--sp-medal) center / contain no-repeat; filter: drop-shadow(0 1px 2px ${alpha('#000000', 0.85)});
  transition: filter 0.2s;
}
${SEL.tileHover} {
  background: var(--sp-octa-dim) 50% 50% / 120px 120px no-repeat, radial-gradient(ellipse 70% 100% at 50% 50%, ${alpha(green, 0.3)}, transparent 75%), linear-gradient(180deg, ${mix(artBg, green, 0.15)}, ${artBg}) !important;
  box-shadow: 0 0 22px -6px ${alpha(green, 0.85)}, 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { filter: drop-shadow(0 0 6px ${frameHi}); }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${artBg} !important; box-shadow: inset 0 3px 10px ${alpha('#000000', 0.9)} !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${alpha('#000000', 0.8)} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${mix(green, '#ffffff', 0.75)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu'])} { border-image: none !important; box-shadow: inset 3px 0 0 ${green}, inset 0 -1px 0 ${alpha(green, 0.3)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu::before'])} { content: none; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${green} !important; }

/* ---------- Headings ---------- */
${sel(['#content .title1', '#content .title2', '#content .subtitle', '#content .admin_lbl'])} { ${nameText} }

/* ---------- Buttons: name boxes on a Spell card frame ---------- */
${SEL.button} {
  background: var(--sp-foil), linear-gradient(180deg, ${mix(frame, t.raised, 0.25)}, ${mix(frame, t.bg, 0.4)}) !important;
  border-color: ${ink} !important;
  border-radius: 2px !important;
  color: ${t.text} !important;
  text-shadow: 0 1px 1px ${alpha('#000000', 0.85)} !important;
  box-shadow: ${bevel}, 0 2px 3px ${alpha('#000000', 0.7)} !important;
}
${SEL.buttonHover} {
  background: var(--sp-foil), linear-gradient(180deg, ${mix(green, '#ffffff', 0.1)}, ${frame}) !important;
  border-color: ${frameHi} !important;
  color: ${t.text} !important;
  box-shadow: ${bevel}, 0 0 10px -1px ${alpha(green, 0.85)} !important;
}
${SEL.buttonDown} { background: ${frameLo} !important; border-color: ${green} !important; box-shadow: inset 0 2px 6px ${alpha('#000000', 0.9)} !important; }

/* ---------- Text fields: the card's text box, sunk into the frame ---------- */
${SEL.field} {
  background-color: ${mix(t.bg, frameLo, 0.35)} !important;
  border-color: ${frame} !important;
  box-shadow: inset 1px 1px 0 ${alpha('#000000', 0.7)}, inset 0 2px 4px ${alpha('#000000', 0.5)}, 0 1px 0 ${alpha(frameHi, 0.25)} !important;
}
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${green} !important; box-shadow: inset 0 2px 4px ${alpha('#000000', 0.6)}, 0 0 8px ${alpha(green, 0.6)} !important; }

/* ---------- Pop-ups: a Spell card held up to read ---------- */
${SEL.dialog} {
  background: var(--sp-octa-dim) 50% 60% / 260px 260px no-repeat, ${art} !important;
  border-radius: 6px !important;
  box-shadow: 0 0 0 1px ${ink}, 0 30px 70px -20px ${alpha('#000000', 0.95)}, 0 0 50px -12px ${alpha(green, 0.45)} !important;
}
${sel(DIALOGS.map((d) => `#content ${d}::before`))} {
  content: ""; position: absolute; inset: 0; width: auto; height: auto; transform: none;
  border: 14px solid transparent; border-image: var(--sp-frame) 12 / 14px / 0 stretch;
  background: var(--sp-type) calc(100% - 14px) 46px / 150px 18px no-repeat; background-origin: padding-box; pointer-events: none; z-index: 0;
}
${sel(DIALOGS.map((d) => `#content ${d}::after`))} {
  content: ""; position: absolute; left: auto; right: -14px; top: -14px; bottom: auto; width: 40px; height: 40px; transform: none;
  background: var(--sp-medal) center / contain no-repeat; filter: drop-shadow(0 2px 3px ${alpha('#000000', 0.85)}); pointer-events: none; z-index: 1;
}
${SEL.dialogTitle} { ${nameText} }

/* ---------- Chat: green frame header, art-artBg body ---------- */
${SEL.chatTop} {
  background: var(--sp-foil), linear-gradient(180deg, ${mix(green, t.raised, 0.35)}, ${frame} 60%, ${frameLo}) !important;
  box-shadow: inset 0 1px 0 ${alpha(frameHi, 0.6)}, inset 0 -1px 0 ${ink}, inset 0 -2px 0 ${alpha(frameHi, 0.25)} !important;
}
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important; }
${SEL.chat} {
  background: ${art} !important;
  box-shadow: inset 3px 0 0 ${frame}, inset -3px 0 0 ${frame}, inset 4px 0 0 ${alpha('#000000', 0.6)}, inset -4px 0 0 ${alpha(frameHi, 0.3)} !important;
}
${sel(['#chats .chat .cout_txt', '#chats .chat .log_txt'])} { background-color: transparent !important; }
${sel(['#chats .chat .chat_bottom'])} { box-shadow: inset 0 2px 0 ${frame}; }

/* ---------- Duel ---------- */
${SEL.life} {
  border-color: ${green} !important;
  background: linear-gradient(180deg, ${alpha('#ffffff', 0.2)}, transparent 50%) !important;
  box-shadow: 0 0 0 1px ${ink}, inset 0 0 0 1px ${alpha('#000000', 0.5)}, 0 0 10px -2px ${alpha(green, 0.6)} !important;
}
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -26px; top: -1px; width: 21px; height: 21px;
  background: var(--sp-medal) center / contain no-repeat; filter: drop-shadow(0 1px 1px ${alpha('#000000', 0.9)});
}
${SEL.lifeSelf} { background: linear-gradient(90deg, ${mix(t.self, '#000000', 0.55)}, ${t.self} 75%, ${mix(t.self, '#ffffff', 0.3)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(90deg, ${mix(t.opp, '#000000', 0.55)}, ${t.opp} 75%, ${mix(t.opp, '#ffffff', 0.3)}) !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, 0 0 6px ${alpha('#000000', 0.8)} !important; }

/* Phases: SPELL medallions; the active one turns an arcane circle */
${SEL.phase} { background: radial-gradient(circle at 38% 30%, ${frameHi}, ${green} 45%, ${frameLo}) !important; box-shadow: 0 0 0 1px ${ink}, 0 2px 6px ${alpha('#000000', 0.8)}; }
${sel(['#duel .phase .background .background_top'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 50%) !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${t.text} !important; opacity: 0.9; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(artBg, green, 0.25)}, ${artBg} 80%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.self, '#ffffff', 0.2)}, ${t.self} 45%, ${mix(t.self, '#000000', 0.5)} 85%) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.opp, '#ffffff', 0.2)}, ${t.opp} 45%, ${mix(t.opp, '#000000', 0.5)} 85%) !important; }
${sel(['#duel .phase.active .background::before'])} {
  content: ""; position: absolute; inset: -11px; border-radius: 50%;
  background: var(--sp-octa) center / 100% 100% no-repeat; filter: drop-shadow(0 0 4px ${alpha(gold, 0.8)});
  animation: dbte-spell-turn 30s linear infinite;
}
@keyframes dbte-spell-turn { to { transform: rotate(-360deg); } }
${sel(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important; }
${sel(['#duel .phase.active span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${alpha('#000000', 0.95)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${frameHi}, ${green} 50%, ${frameLo}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${artBg} !important; }
${sel(['#duel #watchers'])} { box-shadow: inset 0 0 0 2px ${frame}; }
${sel(['#duel .cout_txt'])} { background: ${art} !important; box-shadow: inset 0 0 0 1px ${ink}, inset 0 0 0 4px ${frame}, inset 0 0 0 5px ${alpha('#000000', 0.6)} !important; }
${sel(['#duel #preview_txt'])} { box-shadow: inset 0 0 0 2px ${frame}, inset 0 0 0 3px ${alpha('#000000', 0.6)}; }

/* ---------- Duel room: each panel a card, framed in Spell green ---------- */
${panel('::before')} { background: linear-gradient(135deg, ${frameHi}, ${green} 30%, ${frame} 65%, ${green}) !important; filter: none !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(135deg, ${mix(gold, '#ffffff', 0.3)}, ${gold} 35%, ${green}) !important; }
${panel()} { background: ${art} !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.95)}, 0 0 0 1px ${ink}; }
${panel('::after')} {
  content: ""; position: absolute; right: -8px; top: -8px; width: 22px; height: 22px; background: var(--sp-medal) center / contain no-repeat;
  filter: drop-shadow(0 1px 2px ${alpha('#000000', 0.85)});
}
${sel(['#duel_room #formats .format .format_inner', '#duel_room #formats .format_inner[id]'])} { background-color: ${alpha(artBg, 0.85)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background-color: ${mix(artBg, green, 0.1)} !important; opacity: 0.9 !important; }
${sel(['#duel_room .format_txt', '#duel_room span.arial_black2', '#duel_room .title_txt.arial_black2'])} { ${nameText} }
${sel(['#duel_room .duelbutton'])} { border-color: transparent !important; box-shadow: inset 0 -1px 0 ${alpha(green, 0.3)}; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(green, 0.32)}, ${alpha(green, 0.06)}) !important; opacity: 1 !important; }
${sel(['#duel_room .duelbutton .game_type'])} { color: ${gold} !important; }

/* ---------- Deck constructor ---------- */
${sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg'])} {
  background: ${art} !important;
  box-shadow: inset 0 0 0 1px ${ink}, inset 0 0 0 4px ${frame}, inset 0 0 0 5px ${alpha('#000000', 0.6)} !important;
}
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { ${nameText} opacity: 1 !important; }
${sel(['#deck_constructor #search .search_bg'])} {
  background: ${art} !important;
  box-shadow: inset 0 0 0 1px ${ink}, inset 0 0 0 4px ${frame}, inset 0 0 0 5px ${alpha('#000000', 0.6)} !important;
}
${sel(['#deck_constructor #search .title_txt'])} { ${nameText} }
${sel(['#deck_constructor #search .search_prev_btn', '#deck_constructor #search .search_next_btn'])} { background-color: ${green} !important; }
${sel(['#deck_constructor #search .search_prev_btn:hover', '#deck_constructor #search .search_next_btn:hover'])} { background-color: ${frameHi} !important; }

/* ---------- Settings panels ---------- */
${SETTINGS} { background: ${art} !important; border-image: var(--sp-frame) 12 / 10px / 0 stretch !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.95)} !important; }

/* ---------- Scrollbars ---------- */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${frame}, ${green}, ${frame}) !important; }
${sel(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: ${frameHi} !important; }

@media (prefers-reduced-motion: reduce) { html body #content *, html body #content *::before, html body #content *::after { transition: none !important; animation: none !important; } }
`;
};
