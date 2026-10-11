// Duel Disk (light): the Battle City duel disk itself. Brushed silver plates
// held by cross-head screws, recessed blade slots (the five card zones) that
// light blade-blue when pointed at, keycap buttons, and the life point
// counter as an LCD window in a heavy bezel. Shadows are ink, never black.

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
  const T = (list) => sel(list);
  const ink = t.text;
  const steel = mix(t.border, t.surface, 0.35);
  const groove = mix(t.border, ink, 0.35);
  const lcd = mix(ink, t.opp, 0.18);
  const blade = t.accent;
  const red = t.accent2;

  const screw = (x, y, r) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#s)" stroke="${groove}" stroke-width="${r * 0.18}"/><path d="M${x - r * 0.55} ${y}H${x + r * 0.55}M${x} ${y - r * 0.55}V${y + r * 0.55}" stroke="${groove}" stroke-width="${r * 0.26}" stroke-linecap="round"/>`;
  const defs = `<defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="${t.raised}"/><stop offset=".7" stop-color="${t.surface}"/><stop offset="1" stop-color="${steel}"/></linearGradient><radialGradient id="s" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="${t.surface}"/><stop offset="1" stop-color="${t.border}"/></radialGradient></defs>`;
  // 9-slice silver bezel: bevelled band (light top-left, ink bottom-right), screws in the corners.
  const bezel = (s, b, screws = true) =>
    svg(48, 48, `${defs}<path d="M3 0H45L48 3V45L45 48H3L0 45V3ZM${b} ${b}V${48 - b}H${48 - b}V${b}Z" fill="url(#m)" fill-rule="evenodd"/><path d="M3 .5H45M.5 3V45" stroke="#ffffff" stroke-width="1"/><path d="M47.5 3V45M3 47.5H45" stroke="${t.border}" stroke-width="1"/><rect x="${b - 0.5}" y="${b - 0.5}" width="${49 - 2 * b}" height="${49 - 2 * b}" fill="none" stroke="${groove}" stroke-width="1"/><path d="M${b + 0.5} ${48 - b + 0.5}H${48 - b + 0.5}V${b + 0.5}" fill="none" stroke="#ffffff" stroke-opacity=".8" stroke-width=".8"/>
${screws ? [[s / 2, s / 2], [48 - s / 2, s / 2], [s / 2, 48 - s / 2], [48 - s / 2, 48 - s / 2]].map(([x, y]) => screw(x, y, s * 0.27)).join('') : ''}`);
  // The blade: five recessed card-zone slots.
  const slots = (on) =>
    svg(110, 12, Array.from({ length: 5 }, (_, i) => `<rect x="${i * 22 + 1.5}" y="1.5" width="19" height="9" rx="1.5" fill="${on ? blade : mix(t.surface, groove, 0.35)}" fill-opacity="${on ? 0.85 : 1}" stroke="${groove}" stroke-width="1"/><path d="M${i * 22 + 3} 3H${i * 22 + 19}" stroke="${on ? '#ffffff' : groove}" stroke-opacity="${on ? 0.7 : 0.5}" stroke-width="1"/>`).join(''));
  const brushed = `repeating-linear-gradient(0deg, ${alpha(ink, 0.025)} 0 1px, transparent 1px 3px), linear-gradient(115deg, transparent 30%, ${alpha('#ffffff', 0.55)} 45%, transparent 60%)`;
  const plate = `linear-gradient(180deg, ${t.raised}, ${t.surface} 60%, ${mix(t.surface, steel, 0.5)})`;
  const lift = `0 1px 0 ${alpha('#ffffff', 0.8)}, 0 3px 6px -2px ${alpha(ink, 0.35)}`;

  const tileFrame = U(bezel(12, 4, false));
  const thinFrame = U(bezel(8, 3, false));
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const dlg = (suffix = '') => T(DIALOGS.map((d) => `#content ${d}${suffix}`));
  const LOBBY = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const lobby = (suffix = '') => T(LOBBY.map((x) => `#duel_room ${x}${suffix}`));
  const DECK = ['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg'];
  const SETTINGS = ['about_me', 'preferences', 'social_media', 'animation', 'profile_song', 'account', 'messages', 'duel_stats', 'profile_comments'];
  const settings = T(SETTINGS.map((x) => `#content #settings_content > div.${x}`));
  // Pop-up buttons (DuelingBook draws them as images): steel keycaps with ink
  // labels; the primary one carries a red indicator strip on its left edge.
  const FONT = 'Segoe UI,Arial,sans-serif';
  const popBtn = (label, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    return svg(w, h, `<defs><linearGradient id="k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="${primary ? t.surface : t.raised}"/><stop offset="1" stop-color="${primary ? mix(t.surface, t.border, 0.6) : steel}"/></linearGradient></defs><rect x="6" y="10" width="${w - 12}" height="${h - 20}" rx="6" fill="url(#k)" stroke="${groove}" stroke-width="2"/><path d="M12 12.5H${w - 12}" stroke="#ffffff" stroke-width="2"/><path d="M12 ${h - 12.5}H${w - 12}" stroke="${t.border}" stroke-width="2"/>${primary ? `<rect x="9" y="15" width="6" height="${h - 30}" rx="1" fill="${red}"/>` : ''}<text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${ink}">${label}</text>`);
  };
  const pop = (name) => T([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const screwsAt = (s) => ['left top', 'right top', 'left bottom', 'right bottom'].map((p) => `${U(svg(12, 12, defs + screw(6, 6, 4.6)))} ${p} / ${s}px no-repeat`).join(', ');

  const css = `
/* ---- Menu tiles: screwed silver plates with the five-slot blade along the bottom ---- */
${SEL.tile} {
  background: ${U(slots(false))} center bottom 3px / 90px 10px no-repeat, ${brushed}, ${plate} !important;
  border-color: transparent !important;
  border-image: ${tileFrame} 12 / 11px / 0 stretch !important;
  border-radius: 2px !important;
  box-shadow: inset 0 0 0 0 transparent, ${lift} !important;
}
${SEL.tileHover} {
  background: ${U(slots(true))} center bottom 3px / 90px 10px no-repeat, ${brushed}, linear-gradient(180deg, #ffffff, ${t.raised} 60%, ${t.surface}) !important;
  transform: none;
  box-shadow: 0 0 0 1px ${alpha(blade, 0.5)}, 0 0 14px -3px ${alpha(blade, 0.7)}, ${lift} !important;
}
${T(['#main_menu .menu_btn:active .content'])} { background: ${U(slots(true))} center bottom 3px / 90px 10px no-repeat, linear-gradient(180deg, ${t.surface}, ${t.raised}) !important; box-shadow: inset 0 2px 6px ${alpha(ink, 0.3)} !important; }
${SEL.tileLabel} { color: ${ink} !important; text-shadow: 0 1px 0 #ffffff !important; }
${T(['#main_menu .menu_btn.dbte-small-menu .content'])} { background: ${brushed}, ${plate} !important; border-image: ${thinFrame} 12 / 6px / 0 stretch !important; }
${T(['#main_menu .main_menu_circle .background'])} { background: radial-gradient(circle at 40% 35%, #ffffff, ${blade} 50%) !important; }

/* ---- Buttons: silver keycaps; a blade-blue light underneath on hover ---- */
${SEL.button}, ${T(['#content #settings_content > div.button'])} {
  background: linear-gradient(180deg, #ffffff, ${t.raised} 40%, ${t.surface} 85%, ${steel}) !important;
  border-color: ${t.border} !important;
  border-radius: 3px !important;
  color: ${ink} !important;
  box-shadow: inset 0 1px 0 #ffffff, inset 0 -2px 0 ${alpha(t.border, 0.55)}, 0 1px 2px ${alpha(ink, 0.3)} !important;
}
${SEL.buttonHover}, ${T(['#content #settings_content > div.button:hover'])} {
  background: linear-gradient(180deg, #ffffff, ${t.raised} 55%, ${mix(t.raised, blade, 0.12)}) !important;
  border-color: ${blade} !important;
  color: ${ink} !important;
  box-shadow: inset 0 1px 0 #ffffff, inset 0 -2px 0 ${blade}, 0 0 8px -1px ${alpha(blade, 0.55)} !important;
}
${SEL.buttonDown}, ${T(['#content #settings_content > div.button:active'])} { background: linear-gradient(180deg, ${steel}, ${t.surface}) !important; border-color: ${blade} !important; box-shadow: inset 0 2px 4px ${alpha(ink, 0.35)} !important; }
${T(['#content .combobox'])} { background: linear-gradient(180deg, #ffffff, ${t.raised} 45%, ${t.surface}) !important; border-color: ${t.border} !important; border-radius: 3px !important; color: ${ink} !important; box-shadow: inset 0 -2px 0 ${alpha(t.border, 0.5)}, 0 1px 2px ${alpha(ink, 0.25)} !important; }
${T(['#content .combobox:hover', '#content .combobox.combobox_selected'])} { border-color: ${blade} !important; box-shadow: inset 0 -2px 0 ${blade} !important; }
${T(['#content .combobox .combobox_line'])} { background-color: ${t.border} !important; box-shadow: 1px 0 0 #ffffff; }
${T(['#content .combobox .combobox_arrow img'])} { filter: none !important; }

/* ---- Text fields: milled grooves in the plate ---- */
${SEL.field} {
  background-color: ${mix(t.raised, '#ffffff', 0.5)} !important;
  background-image: linear-gradient(180deg, ${alpha(ink, 0.08)}, transparent 35%) !important;
  border-color: ${groove} !important;
  border-radius: 2px !important;
  box-shadow: inset 0 1px 2px ${alpha(ink, 0.3)}, 0 1px 0 #ffffff !important;
  color: ${ink} !important;
}
${T(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 2px solid ${blade} !important; box-shadow: inset 0 1px 2px ${alpha(ink, 0.3)} !important; }

/* ---- Pop-ups: a heavy screwed plate with a red indicator strip ---- */
${dlg()} {
  background: radial-gradient(circle at 22px 22px, #ffffff 0 1.5px, ${red} 2.5px 5px, ${alpha(red, 0.35)} 6px, transparent 9px), ${brushed}, ${plate} !important;
  border-radius: 4px !important;
  box-shadow: 0 0 0 1px ${t.border}, 0 2px 4px ${alpha(ink, 0.2)}, 0 20px 44px -14px ${alpha(ink, 0.5)} !important;
}
${dlg('::after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; z-index: 1; border: 15px solid transparent; border-image: ${U(bezel(16, 5))} 12 / 15px / 0 stretch; }
${SEL.dialogTitle} { color: ${ink} !important; text-shadow: 0 1px 0 #ffffff !important; }
${dlg(' .body_txt')} { color: ${t.text} !important; }

/* ---- Chat: a steel title plate with a red indicator ---- */
${SEL.chatTop} {
  background: linear-gradient(90deg, ${red} 0 4px, ${alpha(ink, 0.3)} 4px 5px, transparent 5px), ${brushed}, linear-gradient(180deg, #ffffff, ${t.raised} 40%, ${steel}) !important;
  border-radius: 3px 3px 0 0 !important;
  box-shadow: inset 0 -1px 0 ${groove}, inset 0 1px 0 #ffffff !important;
}
${T(['#chats .chat .chat_top span'])} { color: ${ink} !important; text-shadow: 0 1px 0 #ffffff !important; }
${SEL.chat} { background: ${brushed}, linear-gradient(180deg, ${t.raised}, ${t.surface}) !important; box-shadow: inset 0 0 0 1px ${t.border}, inset 0 0 0 3px ${alpha('#ffffff', 0.6)} !important; }
${T(['#chats .chat .black_line'])} { background-color: ${groove} !important; }

/* ---- Duel: the LP counter is an LCD window in a screwed bezel; phases are disk buttons ---- */
${SEL.life} { border-color: transparent !important; border-image: ${U(bezel(10, 4))} 12 / 9px / 3px stretch !important; border-radius: 0 !important; box-shadow: 0 2px 6px ${alpha(ink, 0.35)} !important; }
${T(['#duel .lifepoints .life_bar'])} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: repeating-linear-gradient(90deg, transparent 0 6px, ${alpha(lcd, 0.45)} 6px 7px), linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 45%), linear-gradient(90deg, ${mix(t.self, lcd, 0.45)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: repeating-linear-gradient(90deg, transparent 0 6px, ${alpha(lcd, 0.45)} 6px 7px), linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 45%), linear-gradient(90deg, ${mix(t.opp, lcd, 0.2)}, ${mix(t.opp, '#ffffff', 0.3)}) !important; }
${T(['#duel .lifepoints .black_bar'])} { background: repeating-linear-gradient(90deg, transparent 0 6px, ${alpha('#ffffff', 0.05)} 6px 7px), linear-gradient(180deg, ${mix(lcd, '#ffffff', 0.1)}, ${lcd}) !important; }
${T(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 0 2px ${lcd}, 0 1px 0 ${lcd}, 0 0 8px ${alpha(lcd, 0.8)} !important; }
${SEL.phase} {
  background: radial-gradient(circle at 40% 30%, #ffffff, ${t.raised} 35%, ${t.surface} 60%, ${t.border}) !important;
  box-shadow: 0 0 0 1px ${groove}, 0 2px 4px ${alpha(ink, 0.35)} !important;
}
${T(['#duel .phase .background .background_top'])} { background: transparent !important; }
${T(['#duel .phase .background .background_inner'])} { background: ${groove} !important; }
${T(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle at 45% 35%, #ffffff, ${t.raised} 40%, ${t.surface} 80%) !important; box-shadow: inset 0 -2px 3px ${alpha(ink, 0.2)} !important; }
${T(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 42% 32%, #ffffff 0 8%, ${mix(t.self, '#ffffff', 0.25)} 22%, ${t.self} 55%, ${mix(t.self, ink, 0.4)}) !important; box-shadow: 0 0 10px ${alpha(t.self, 0.6)} !important; }
${T(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 42% 32%, #ffffff 0 8%, ${mix(t.opp, '#ffffff', 0.25)} 22%, ${t.opp} 55%, ${mix(t.opp, ink, 0.4)}) !important; box-shadow: 0 0 10px ${alpha(t.opp, 0.6)} !important; }
${T(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 0 #ffffff !important; }
${T(['#duel .phase.active span'])} { color: #ffffff !important; text-shadow: 0 1px 1px ${alpha(ink, 0.8)} !important; }
${T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, #ffffff, ${t.surface} 50%, ${t.border}) !important; }
${T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${t.raised}, ${t.surface}) !important; }
${T(['#duel #watchers'])} { background: ${brushed}, ${plate} !important; box-shadow: ${lift} !important; }
${T(['#duel #watchers::after'])} { content: ""; position: absolute; inset: -3px; pointer-events: none; border: 11px solid transparent; border-image: ${tileFrame} 12 / 11px / 0 stretch; }
${T(['#duel #watchers .users', '#duel #watchers .cell1'])} { background-color: transparent !important; }
${T(['#duel #watchers .cell1'])} { box-shadow: inset 0 -1px 0 ${alpha(groove, 0.5)}, inset 0 -2px 0 ${alpha('#ffffff', 0.7)} !important; }
${T(['#duel #watchers .watchers_txt'])} { color: ${t.muted} !important; text-shadow: 0 1px 0 #ffffff !important; }

/* ---- Duel room: silver plates, bevelled ring, corner screws ---- */
${lobby()} { background-color: ${alpha(t.surface, 0.9)} !important; background-image: ${brushed} !important; }
${lobby('::before')} { filter: none !important; background: linear-gradient(160deg, #ffffff, ${t.raised} 25%, ${t.border} 55%, ${t.surface} 80%, ${t.border}) !important; }
${T(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(160deg, #ffffff, ${blade} 50%, ${t.border}) !important; }
${lobby('::after')} { content: ""; position: absolute; inset: 7px; pointer-events: none; background: ${screwsAt(10)}; }
${T(['#duel_room .format_txt', '#duel_room span.arial_black2'])} { color: var(--dbt-title) !important; text-shadow: 0 1px 0 #ffffff !important; }
${T(['#duel_room .duelbutton .background'])} { background: linear-gradient(180deg, #ffffff, ${t.raised}) !important; }
${T(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(180deg, #ffffff, ${mix(t.raised, blade, 0.14)}) !important; }
${T(['#duel_room .duelbutton'])} { border-color: ${t.border} !important; }

/* ---- Deck constructor: milled bays in the disk ---- */
${T(DECK)} { background-image: ${brushed} !important; box-shadow: inset 0 0 0 1px ${groove}, inset 0 2px 4px ${alpha(ink, 0.18)}, inset 0 -1px 0 1px ${alpha('#ffffff', 0.7)} !important; }
${T(['#deck_constructor #search .search_bg::after'])} { content: ""; position: absolute; inset: 5px; pointer-events: none; background: ${screwsAt(10)}; }
${T(['#deck_constructor #search .title_txt'])} { color: var(--dbt-title) !important; text-shadow: 0 1px 0 #ffffff !important; }
${T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${ink} !important; text-shadow: 0 1px 0 #ffffff !important; }

/* ---- Settings: screwed plates ---- */
${settings} { border-color: transparent !important; border-image: ${tileFrame} 12 / 11px / 0 stretch !important; border-radius: 2px !important; background-image: ${brushed} !important; }
${T(['#settings .admin_lbl', '#settings .title1'])} { color: var(--dbt-title) !important; text-shadow: 0 1px 0 #ffffff !important; }

/* ---- Pop-up buttons (title plates and the watermark come from css.js's light-theme sheet) ---- */
${pop('ok_btn')} { content: ${U(popBtn('OK', false, true))} !important; }
${pop('yes_btn')} { content: ${U(popBtn('Yes', false, true))} !important; }
${pop('no_btn')} { content: ${U(popBtn('No', false, false))} !important; }
${pop('cancel_btn')} { content: ${U(popBtn('Cancel', true, false))} !important; }
${T(['#content .ok_btn:hover img', '#content .yes_btn:hover img', '#content .no_btn:hover img', '#content .cancel_btn:hover img'])} { filter: drop-shadow(0 0 3px ${alpha(blade, 0.7)}) !important; }

/* ---- Backdrop: brushed metal in place of the hex-caret wallpaper ---- */
html body #dbte-skin-motif { background: ${brushed} !important; }
/* Light themes keep DuelingBook's page cover at 90%: brush the cover itself so empty page reads as steel. */
html body #circuit_cover { background-image: repeating-linear-gradient(0deg, ${alpha(ink, 0.04)} 0 1px, transparent 1px 2px, ${alpha('#ffffff', 0.25)} 2px 3px, transparent 3px 4px), linear-gradient(112deg, ${alpha(ink, 0.06)}, transparent 16%, ${alpha('#ffffff', 0.6)} 30%, transparent 44%, ${alpha(ink, 0.05)} 52%, transparent 58%, ${alpha('#ffffff', 0.45)} 68%, transparent 80%, ${alpha(ink, 0.06)}) !important; }
html body #dbte-skin-motif::before { background: none !important; }

/* ---- Scrollbars ---- */
${T(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${t.border}, #ffffff 45%, ${t.border}) !important; box-shadow: inset 0 0 0 1px ${groove}; border-radius: 2px !important; }
${T(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: ${blade} !important; }
`;
  return `html body { ${[...ids].map(([s, id]) => `${id}: ${url(s)};`).join(' ')} }
${css.replace(/\/\*[^*]*\*\//g, '').replace(/\n\s+/g, '\n')}`;
};
