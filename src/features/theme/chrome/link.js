// Link: the Link card frame. Every panel is an art box ringed by the eight
// Link Arrows (dark at rest, lit red-orange when pointed at), on Cyberse blue
// hex plating, with circuit traces running out of the corners.

import { mix } from '../../../lib/color.js';

// Compact data URI: only % and # (and braces, which keepAreas splits on) are escaped.
const url = (s) => `url("data:image/svg+xml,${s.replace(/"/g, "'").replace(/\s*\n\s*/g, ' ').replace(/[%#{}]/g, encodeURIComponent)}")`;

export default (t, { SEL, sel, svg, alpha }) => {
  // Each SVG is written once, as a custom property, and referenced by var().
  const ids = new Map();
  const U = (s) => {
    if (!ids.has(s)) ids.set(s, `--dbc${ids.size}`);
    return `var(${ids.get(s)})`;
  };
  const lit = mix(t.danger, t.warning, 0.28);
  const off = t.accent;
  const frame = mix(t.accent, t.border, 0.45);
  const deep = mix(t.surface, t.bg, 0.4);
  const T = (list) => sel(list);

  // One Link Arrow (16 box). kind: 'side' (a chevron pointing up) or 'corner' (pointing up-left).
  const arrow = (kind, rot, on) => {
    const c = on ? lit : off;
    const shape = kind === 'side' ? 'M1.5 12.5L8 3.5L14.5 12.5Z' : 'M1.5 1.5H13.5L1.5 13.5Z';
    const inner = kind === 'side' ? 'M5 11L8 6.8L11 11Z' : 'M3.6 3.6H9.4L3.6 9.4Z';
    return svg(16, 16, `<g transform="rotate(${rot} 8 8)"><path d="${shape}" fill="${c}" stroke="${t.bg}" stroke-width="1.1" stroke-linejoin="round"/><path d="${inner}" fill="${mix(c, '#ffffff', on ? 0.6 : 0.3)}" opacity="${on ? 0.8 : 0.5}"/></g>`);
  };
  // All eight arrows around a box, as a background list (s = arrow size, i = inset).
  const ring = (on, s, i = 0) => {
    const p = (x) => (i ? `${x} ${i}px` : x);
    return [
      `${U(arrow('corner', 0, on))} ${p('left')} ${p('top')} / ${s}px no-repeat`,
      `${U(arrow('corner', 90, on))} ${p('right')} ${p('top')} / ${s}px no-repeat`,
      `${U(arrow('corner', 180, on))} ${p('right')} ${p('bottom')} / ${s}px no-repeat`,
      `${U(arrow('corner', 270, on))} ${p('left')} ${p('bottom')} / ${s}px no-repeat`,
      `${U(arrow('side', 0, on))} center ${p('top')} / ${s}px no-repeat`,
      `${U(arrow('side', 180, on))} center ${p('bottom')} / ${s}px no-repeat`,
      `${U(arrow('side', 270, on))} ${p('left')} center / ${s}px no-repeat`,
      `${U(arrow('side', 90, on))} ${p('right')} center / ${s}px no-repeat`,
    ].join(', ');
  };

  // Cyberse hex plating (pointy-top cells).
  const hex = (a) =>
    U(svg(24, 41.6, `<path d="M12 0L24 6.9V20.8L12 27.7L0 20.8V6.9ZM12 27.7V41.6" fill="none" stroke="${t.accent2}" stroke-opacity="${a}" stroke-width=".8"/>`));
  // Circuit traces leaving a bottom-left corner (kept to the bottom-left 30% of a panel).
  const traces = U(svg(150, 56, `<g fill="none" stroke="${t.accent2}" stroke-width="1.2" stroke-opacity=".55"><path d="M0 50H58L72 36H150"/><path d="M30 56L42 44H96L106 34"/><path d="M120 56V46L130 36H150"/></g><g fill="${t.accent2}"><circle cx="0" cy="50" r="2.4"/><circle cx="106" cy="34" r="2.4"/><circle cx="58" cy="50" r="1.4"/></g><circle cx="30" cy="56" r="2.4" fill="none" stroke="${t.accent2}" stroke-opacity=".7"/>`));
  const tracesTop = U(svg(150, 56, `<g fill="none" stroke="${t.accent2}" stroke-width="1.2" stroke-opacity=".45" transform="translate(150 0) scale(-1 1)"><path d="M0 6H58L72 20H150"/><path d="M30 0L42 12H96L106 22"/></g><g fill="${t.accent2}" fill-opacity=".8"><circle cx="150" cy="6" r="2.2"/><circle cx="44" cy="22" r="2.2"/></g>`));

  const face = `linear-gradient(180deg, ${alpha(t.accent2, 0.08)}, transparent 35%, ${alpha(t.bg, 0.35)})`;
  const frameLines = (c = frame) => `inset 0 0 0 1px ${c}, inset 0 0 0 3px ${alpha(t.bg, 0.85)}, inset 0 0 0 4px ${alpha(t.accent2, 0.35)}`;

  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const dlg = (suffix = '') => T(DIALOGS.map((d) => `#content ${d}${suffix}`));
  const LOBBY = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const lobby = (suffix = '') => T(LOBBY.map((x) => `#duel_room ${x}${suffix}`));
  const DECK = ['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg'];
  const SETTINGS = ['about_me', 'preferences', 'social_media', 'animation', 'profile_song', 'account', 'messages', 'duel_stats', 'profile_comments'];
  const settings = (suffix = '') => T(SETTINGS.map((x) => `#settings .${x}${suffix}`));

  // Button: a data plate with a Link Arrow notch at each end.
  const btnArrows = (on) => `${U(arrow('side', 270, on))} 1px center / 9px no-repeat, ${U(arrow('side', 90, on))} right 1px center / 9px no-repeat`;

  // Pop-up buttons (DuelingBook draws them as images): bevelled data plates cut
  // to a hex point at each end; the primary one is lit cyan with a dark label.
  const FONT = 'Segoe UI,Arial,sans-serif';
  const popBtn = (label, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    const top = primary ? mix(t.accent2, '#ffffff', 0.35) : mix(t.raised, t.accent, 0.3);
    const bot = primary ? mix(t.accent2, t.accent, 0.35) : deep;
    return svg(w, h, `<defs><linearGradient id="k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><path d="M24 10H${w - 24}L${w - 6} 39.2L${w - 24} ${h - 10}H24L6 39.2Z" fill="url(#k)" stroke="${primary ? '#ffffff' : t.accent2}" stroke-opacity="${primary ? 0.8 : 0.7}" stroke-width="2"/><path d="M26 14.5H${w - 26}" stroke="#ffffff" stroke-opacity=".5" stroke-width="2"/><path d="M26 ${h - 14.5}H${w - 26}" stroke="${t.bg}" stroke-opacity=".45" stroke-width="2"/><text x="${w / 2}" y="39.5" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${primary ? t.accentText : t.text}">${label}</text>`);
  };
  const pop = (name) => T([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const titles = T(['#duel_room .format_txt', '#duel_room span.arial_black2', '#settings .admin_lbl']);

  const css = `
/* ---- Menu tiles: Link art box, eight arrows that light on hover ---- */
${SEL.tile} {
  background: ${face}, ${hex(0.09)} center / 18px auto, linear-gradient(160deg, ${mix(t.raised, t.accent, 0.12)}, ${deep}) !important;
  border-color: transparent !important;
  border-radius: 1px !important;
  box-shadow: ${frameLines()}, 0 10px 22px -12px ${alpha('#000000', 0.9)} !important;
}
${T(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; inset: -1px; pointer-events: none;
  background: ${ring(false, 12)}; transition: opacity .2s;
}
${T(['#main_menu .menu_btn .content::after'])} {
  content: ""; position: absolute; inset: -1px; pointer-events: none; height: auto;
  background: ${ring(true, 12)}; opacity: 0; transition: opacity .18s;
}
${SEL.tileHover} {
  background: ${face}, ${hex(0.16)} center / 18px auto, linear-gradient(160deg, ${mix(t.raised, t.accent, 0.3)}, ${deep}) !important;
  box-shadow: inset 0 0 0 1px ${t.accent2}, inset 0 0 0 3px ${alpha(t.bg, 0.85)}, inset 0 0 0 4px ${alpha(t.accent2, 0.6)}, inset 0 0 22px ${alpha(t.accent2, 0.22)}, 0 0 16px -4px ${alpha(t.accent2, 0.7)} !important;
}
${T(['#main_menu .menu_btn:hover .content::after'])} { opacity: 1; inset: -1px; height: auto; }
${T(['#main_menu .menu_btn:active .content'])} {
  background: ${hex(0.16)} center / 18px auto, linear-gradient(160deg, ${deep}, ${mix(t.raised, t.accent, 0.25)}) !important;
  box-shadow: inset 0 0 0 1px ${t.accent2}, inset 0 3px 10px ${alpha('#000000', 0.7)} !important;
}
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 0 10px ${alpha(t.accent2, 0.45)}, 0 2px 0 ${t.bg} !important; }
${T(['#main_menu .menu_btn.dbte-small-menu .content::before', '#main_menu .menu_btn.dbte-small-menu .content::after'])} { content: none; }
${T(['#main_menu .main_menu_circle .background'])} { background-color: ${t.accent2} !important; }

/* ---- Buttons: data plates with an arrow notch at each end ---- */
${SEL.button} {
  background: ${btnArrows(false)}, linear-gradient(180deg, ${mix(t.raised, t.accent, 0.18)}, ${t.raised} 55%, ${deep}) !important;
  border-color: ${frame} !important;
  border-radius: 1px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.3)}, inset 0 -1px 0 ${alpha(t.bg, 0.7)}, 0 2px 6px -2px ${alpha('#000000', 0.8)} !important;
}
${SEL.buttonHover} {
  background: ${btnArrows(true)}, linear-gradient(180deg, ${mix(t.raised, t.accent, 0.45)}, ${mix(t.raised, t.accent, 0.2)} 55%, ${deep}) !important;
  border-color: ${t.accent2} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.6)}, 0 0 10px -2px ${alpha(t.accent2, 0.8)} !important;
}
${SEL.buttonDown} {
  background: ${btnArrows(true)}, linear-gradient(180deg, ${deep}, ${mix(t.raised, t.accent, 0.35)}) !important;
  border-color: ${t.accent2} !important;
  box-shadow: inset 0 2px 5px ${alpha('#000000', 0.7)} !important;
}
${T(['#content .combobox'])} {
  background: linear-gradient(180deg, ${mix(t.raised, t.accent, 0.12)}, ${deep}) !important;
  border-color: ${frame} !important; border-radius: 1px !important;
  box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.25)} !important;
}
${T(['#content .combobox:hover', '#content .combobox.combobox_selected'])} { border-color: ${t.accent2} !important; box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.5)}, 0 0 8px -2px ${t.accent2} !important; }
${T(['#content .combobox .combobox_line'])} { background-color: ${frame} !important; }

/* ---- Text fields: a dark data well with a lit trace along the bottom ---- */
${SEL.field} {
  background-color: ${mix(t.bg, t.surface, 0.5)} !important;
  background-image: linear-gradient(90deg, ${t.accent2} 0 3px, transparent 3px), linear-gradient(0deg, ${alpha(t.accent2, 0.5)} 0 1px, transparent 1px) !important;
  border-color: ${frame} !important;
  border-radius: 0 !important;
  box-shadow: inset 0 1px 3px ${alpha('#000000', 0.6)} !important;
  color: ${t.text} !important;
}
${T(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 1px solid ${t.accent2} !important; box-shadow: 0 0 8px ${alpha(t.accent2, 0.5)} !important; }

/* ---- Pop-ups: a Link art box with all eight arrows lit, traces out of the corners ---- */
${dlg()} {
  background: ${traces} left 6px bottom 6px / 30% auto no-repeat, ${face}, ${hex(0.08)} center / 22px auto, linear-gradient(170deg, ${mix(t.surface, t.accent, 0.12)}, ${deep}) !important;
  border-radius: 2px !important;
  box-shadow: inset 0 0 0 1px ${t.accent2}, inset 0 0 0 4px ${alpha(t.bg, 0.8)}, inset 0 0 0 5px ${alpha(t.accent, 0.6)}, 0 0 0 1px ${t.bg}, 0 0 30px -6px ${alpha(t.accent, 0.55)}, 0 24px 50px -14px ${alpha('#000000', 0.9)} !important;
}
${dlg('::before')} { content: ""; position: absolute; inset: -3px; pointer-events: none; z-index: 1; background: ${ring(false, 16)}; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 0 12px ${alpha(t.accent2, 0.7)}, 0 2px 0 ${t.bg} !important; }
${dlg(' .body_txt')} { color: ${t.text} !important; }

/* ---- Chat: Cyberse header with a running trace ---- */
${SEL.chatTop} {
  background: ${tracesTop} right 30px top -6px / 120px 45px no-repeat, linear-gradient(180deg, ${mix(t.raised, t.accent, 0.35)}, ${mix(t.raised, t.accent, 0.12)} 60%, ${deep}) !important;
  border-radius: 2px 2px 0 0 !important;
  box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.5)}, inset 0 -2px 0 ${t.accent2} !important;
}
${T(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 0 8px ${alpha(t.accent2, 0.6)}, 0 1px 0 ${t.bg} !important; }
${SEL.chat} {
  background: ${hex(0.06)} center / 20px auto, linear-gradient(180deg, ${t.surface}, ${deep}) !important;
  box-shadow: inset 0 0 0 1px ${frame}, inset 3px 0 0 ${alpha(t.accent2, 0.35)} !important;
}
${T(['#chats .chat .black_line'])} { background-color: ${frame} !important; }

/* ---- Duel: LP as a Link rating plate with end arrows; phases as arrow-cornered markers ---- */
${SEL.life} { border-color: ${t.accent2} !important; border-radius: 3px !important; box-shadow: inset 0 0 0 1px ${t.bg}, 0 0 10px -2px ${alpha(t.accent2, 0.7)} !important; }
${T(['#duel .lifepoints .life_border::before'])} { content: ""; position: absolute; left: -9px; top: 50%; width: 14px; height: 14px; margin-top: -7px; background: ${U(arrow('side', 270, true))} center / 100% no-repeat; pointer-events: none; }
${T(['#duel .lifepoints .life_border::after'])} { content: ""; position: absolute; right: -9px; top: 50%; width: 14px; height: 14px; margin-top: -7px; background: ${U(arrow('side', 90, true))} center / 100% no-repeat; pointer-events: none; }
${T(['#duel .lifepoints .life_bar'])} { border-radius: 3px !important; }
${SEL.lifeSelf} { background: ${hex(0.22)} left center / 12px auto, linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.5)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: ${hex(0.22)} left center / 12px auto, linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.5)}, ${t.opp}) !important; }
${T(['#duel .lifepoints .black_bar'])} { background: ${hex(0.12)} left center / 12px auto, ${deep} !important; }
${T(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 0 3px ${t.bg}, 0 1px 0 ${t.bg}, 0 0 10px ${alpha(t.bg, 0.9)} !important; }
${SEL.phase} {
  background: linear-gradient(135deg, ${t.accent2}, ${t.accent} 50%, ${frame}) !important;
  border-radius: 7px !important;
  box-shadow: 0 0 0 1px ${t.bg}, 0 3px 8px ${alpha('#000000', 0.7)} !important;
}
${T(['#duel .phase .background::before'])} { content: ""; position: absolute; inset: -4px; pointer-events: none; z-index: 2; background: ${[0, 90, 180, 270].map((r, i) => `${U(arrow('corner', r, false))} ${['left top', 'right top', 'right bottom', 'left bottom'][i]} / 12px no-repeat`).join(', ')}; }
${T(['#duel .phase.active .background::before'])} { background: ${[0, 90, 180, 270].map((r, i) => `${U(arrow('corner', r, true))} ${['left top', 'right top', 'right bottom', 'left bottom'][i]} / 12px no-repeat`).join(', ')}; }
${T(['#duel .phase .background .background_top'])} { background: transparent !important; }
${T(['#duel .phase .background .background_inner'])} { background: ${t.bg} !important; border-radius: 5px !important; }
${T(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${hex(0.14)} center / 10px auto, radial-gradient(circle, ${t.raised}, ${deep}) !important; border-radius: 4px !important; }
${T(['#duel .phase.active .phase_inner.red'])} { background: ${hex(0.25)} center / 10px auto, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.2)}, ${mix(t.self, t.bg, 0.45)}) !important; box-shadow: 0 0 12px ${alpha(t.self, 0.7)} !important; }
${T(['#duel .phase.active .phase_inner.blue'])} { background: ${hex(0.25)} center / 10px auto, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.2)}, ${mix(t.opp, t.bg, 0.45)}) !important; box-shadow: 0 0 12px ${alpha(t.opp, 0.7)} !important; }
${T(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 0 ${t.bg} !important; }
${T(['#duel .phase.active span'])} { color: ${t.bg} !important; text-shadow: 0 0 4px ${alpha('#ffffff', 0.7)} !important; }
${T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(135deg, ${t.accent2}, ${t.accent}) !important; border-radius: 3px !important; }
${T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${deep} !important; border-radius: 2px !important; }
${T(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${frame} !important; }

/* ---- Duel room: Link art boxes with corner arrows and traces ---- */
${lobby()} { background-color: ${alpha(t.surface, 0.85)} !important; background-image: ${traces}, ${hex(0.06)} !important; background-size: 30% auto, 22px auto !important; background-position: left 6px bottom 4px, center !important; background-repeat: no-repeat, repeat !important; }
${lobby('::before')} { filter: none !important; background: linear-gradient(135deg, ${t.accent2}, ${t.accent} 40%, ${frame} 70%, ${t.accent2}) !important; }
${T(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(135deg, ${lit}, ${t.accent2} 40%, ${t.accent}) !important; }
${lobby('::after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; background: ${ring(false, 12).split(', ').slice(0, 4).join(', ')}; }
${T(['#duel_room #formats .format:hover > .border::after'])} { background: ${ring(true, 12).split(', ').slice(0, 4).join(', ')}; }
${T(['#duel_room .format_txt', '#duel_room span.arial_black2'])} { color: ${t.text} !important; text-shadow: 0 0 12px ${alpha(t.accent2, 0.6)}, 0 2px 0 ${t.bg} !important; }
${T(['#duel_room .duelbutton .background'])} { background: linear-gradient(180deg, ${mix(t.raised, t.accent, 0.1)}, ${deep}) !important; }
${T(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(180deg, ${mix(t.raised, t.accent, 0.35)}, ${deep}) !important; }
${T(['#duel_room .duelbutton'])} { border-color: ${alpha(t.accent2, 0.25)} !important; }

/* ---- Deck constructor: hex-plated bays, corner arrows ---- */
${T(DECK)} {
  background-image: ${hex(0.07)}, ${face} !important; background-size: 22px auto, auto !important;
  box-shadow: ${frameLines()} !important;
}
${T(DECK.map((d) => `${d}::after`))} { content: ""; position: absolute; inset: -1px; pointer-events: none; background: ${ring(false, 14).split(', ').slice(0, 4).join(', ')}; }
${T(['#deck_constructor #search .title_txt'])} { color: ${t.text} !important; text-shadow: 0 0 14px ${alpha(t.accent2, 0.7)}, 0 2px 0 ${t.bg} !important; }
${T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; text-shadow: 0 0 10px ${alpha(t.accent2, 0.6)} !important; }

/* ---- Settings: Link art boxes ---- */
${settings()} {
  border-color: ${frame} !important; border-radius: 2px !important;
  background-image: ${traces}, ${hex(0.07)} !important; background-size: 30% auto, 22px auto !important; background-position: left 4px bottom 2px, center !important; background-repeat: no-repeat, repeat !important;
  box-shadow: inset 0 0 0 2px ${alpha(t.bg, 0.7)}, inset 0 0 0 3px ${alpha(t.accent2, 0.4)} !important;
}
${settings('::after')} { content: ""; position: absolute; inset: -6px; pointer-events: none; background: ${ring(false, 14).split(', ').slice(0, 4).join(', ')}; }
${T(['#settings .admin_lbl', '#settings .title1'])} { color: ${t.text} !important; text-shadow: 0 0 12px ${alpha(t.accent2, 0.6)}, 0 2px 0 ${t.bg} !important; }

/* ---- Pop-up buttons, panel title plates ---- */
${pop('ok_btn')} { content: ${U(popBtn('OK', false, true))} !important; }
${pop('yes_btn')} { content: ${U(popBtn('Yes', false, true))} !important; }
${pop('no_btn')} { content: ${U(popBtn('No', false, false))} !important; }
${pop('cancel_btn')} { content: ${U(popBtn('Cancel', true, false))} !important; }
${T(['#content .ok_btn:hover img', '#content .yes_btn:hover img', '#content .no_btn:hover img', '#content .cancel_btn:hover img'])} { filter: drop-shadow(0 0 5px ${alpha(t.accent2, 0.9)}) !important; }
${titles} { background: ${t.surface} !important; box-shadow: 0 0 0 .3em ${t.surface} !important; border-radius: .15em; }

/* ---- Scrollbars ---- */
${T(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${frame}, ${t.accent}) !important; border-radius: 1px !important; }
${T(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: ${t.accent2} !important; }
`;
  return `html body { ${[...ids].map(([s, id]) => `${id}: ${url(s)};`).join(' ')} }
${css.replace(/\/\*[^*]*\*\//g, '').replace(/\n\s+/g, '\n')}`;
};
