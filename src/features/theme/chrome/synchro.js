// Synchro: the white Synchro frame and the summon itself. Pearl-white frames
// with four-point star sparkles at the corners, tuner rings that a line of
// starlight runs through, stardust on graphite, phase buttons as rings of light.

import { mix } from '../../../lib/color.js';

// Compact data URI: only the characters CSS and URLs need are escaped (braces too).
const url = (s) => `url("data:image/svg+xml,${s.replace(/"/g, "'").replace(/\s*\n\s*/g, ' ').replace(/[%#<>{}]/g, encodeURIComponent)}")`;

export default (t, { SEL, sel, svg, alpha }) => {
  // Each SVG is written once, as a custom property, and referenced by var().
  const ids = new Map();
  const U = (s) => {
    if (!ids.has(s)) ids.set(s, `--dbc${ids.size}`);
    return `var(${ids.get(s)})`;
  };
  const T = (list) => sel(list);
  const pearl = t.accent;
  const silver = mix(t.accent, t.muted, 0.45);
  const deep = mix(t.surface, t.bg, 0.45);
  const glow = t.accent2;

  const star = (x, y, r, fill = '#ffffff', o = 1) =>
    `<path d="M${x} ${y - r}C${x + r * 0.12} ${y - r * 0.12} ${x + r * 0.12} ${y - r * 0.12} ${x + r} ${y}C${x + r * 0.12} ${y + r * 0.12} ${x + r * 0.12} ${y + r * 0.12} ${x} ${y + r}C${x - r * 0.12} ${y + r * 0.12} ${x - r * 0.12} ${y + r * 0.12} ${x - r} ${y}C${x - r * 0.12} ${y - r * 0.12} ${x - r * 0.12} ${y - r * 0.12} ${x} ${y - r}Z" fill="${fill}" opacity="${o}"/>`;
  const sparkle = (r = 7) => svg(24, 24, `<circle cx="12" cy="12" r="${r * 0.9}" fill="${glow}" opacity=".22"/><circle cx="12" cy="12" r="${r * 0.45}" fill="#ffffff" opacity=".35"/>${star(12, 12, r)}${star(12, 12, r * 0.55, glow, 0.5)}`);

  // 9-slice white frame: pearl band, graphite gap, silver hairline; sparkles on the corners.
  const frame = (s, b) =>
    svg(48, 48, `<defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="${pearl}"/><stop offset=".6" stop-color="${silver}"/><stop offset="1" stop-color="${pearl}"/></linearGradient></defs>
<path d="M0 0H48V48H0ZM${b} ${b}V${48 - b}H${48 - b}V${b}Z" fill="url(#p)" fill-rule="evenodd"/><rect x="${b + 0.5}" y="${b + 0.5}" width="${47 - 2 * b}" height="${47 - 2 * b}" fill="none" stroke="${t.bg}" stroke-width="1"/><rect x="${b + 2}" y="${b + 2}" width="${44 - 2 * b}" height="${44 - 2 * b}" fill="none" stroke="${pearl}" stroke-opacity=".45" stroke-width=".6"/>
${[[s * 0.4, s * 0.4], [48 - s * 0.4, s * 0.4], [s * 0.4, 48 - s * 0.4], [48 - s * 0.4, 48 - s * 0.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${s * 0.22}" fill="${glow}" opacity=".35"/>${star(x, y, s * 0.38)}`).join('')}`);

  // Tuner rings in perspective with a streak of starlight through them.
  const rings = (on) =>
    svg(220, 60, `<g fill="none" stroke="${on ? '#ffffff' : pearl}" stroke-opacity="${on ? 0.75 : 0.1}" stroke-width="${on ? 1.4 : 1}">${[16, 28, 40, 180, 192, 204].map((x) => `<ellipse cx="${x}" cy="30" rx="5" ry="22"/>`).join('')}</g>
<rect x="0" y="29" width="220" height="2" fill="url(#l)"/><defs><linearGradient id="l"><stop offset="0" stop-color="${glow}" stop-opacity="0"/><stop offset=".5" stop-color="${on ? '#ffffff' : glow}" stop-opacity="${on ? 0.9 : 0.3}"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></linearGradient></defs>
${on ? [22, 34, 186, 198].map((x, i) => star(x, 30, i % 2 ? 3.5 : 5)).join('') : ''}`);
  const dust = U(svg(120, 120, [[8, 14, 0.9], [44, 6, 0.6], [90, 22, 1.1], [70, 58, 0.7], [20, 80, 1], [104, 96, 0.6], [56, 104, 0.9], [34, 40, 0.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${0.18 + r * 0.25}"/>`).join('')));
  const face = `linear-gradient(180deg, ${alpha('#ffffff', 0.07)}, transparent 40%, ${alpha(t.bg, 0.3)})`;

  const tileFrame = U(frame(16, 3));
  const slimFrame = U(frame(12, 2));
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const dlg = (suffix = '') => T(DIALOGS.map((d) => `#content ${d}${suffix}`));
  const LOBBY = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const lobby = (suffix = '') => T(LOBBY.map((x) => `#duel_room ${x}${suffix}`));
  const DECK = ['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg'];
  const SETTINGS = ['about_me', 'preferences', 'social_media', 'animation', 'profile_song', 'account', 'messages', 'duel_stats', 'profile_comments'];
  const settings = T(SETTINGS.map((x) => `#settings .${x}`));
  const corners = (s) => ['left top', 'right top', 'left bottom', 'right bottom'].map((p) => `${U(sparkle())} ${p} / ${s}px no-repeat`).join(', ');

  const css = `
/* ---- Menu tiles: white Synchro frame, tuner rings that flare on hover ---- */
${SEL.tile} {
  background: ${face}, ${U(rings(false))} center / 100% 100% no-repeat, ${dust} 0 0 / 120px, linear-gradient(180deg, ${t.raised}, ${deep}) !important;
  border-color: transparent !important;
  border-image: ${tileFrame} 16 / 12px / 3px stretch !important;
  border-radius: 0 !important;
  box-shadow: 0 10px 24px -14px ${alpha('#000000', 0.9)} !important;
  transition: background-color .15s, box-shadow .2s;
}
${SEL.tileHover} {
  background: ${face}, ${U(rings(true))} center / 100% 100% no-repeat, ${dust} 0 0 / 120px, radial-gradient(ellipse at 50% 50%, ${alpha(glow, 0.3)}, transparent 70%), linear-gradient(180deg, ${mix(t.raised, glow, 0.12)}, ${deep}) !important;
  box-shadow: 0 0 22px -6px ${alpha(glow, 0.8)} !important;
}
${T(['#main_menu .menu_btn:active .content'])} { background: ${U(rings(true))} center / 100% 100% no-repeat, linear-gradient(180deg, ${deep}, ${t.raised}) !important; box-shadow: inset 0 3px 8px ${alpha('#000000', 0.6)} !important; }
${SEL.tileLabel} { color: #ffffff !important; text-shadow: 0 0 10px ${alpha(glow, 0.55)}, 0 2px 1px ${t.bg} !important; }
${T(['#main_menu .menu_btn.dbte-small-menu .content'])} { border-image: ${slimFrame} 16 / 6px / 0 stretch !important; }
${T(['#main_menu .main_menu_circle .background'])} { background: radial-gradient(circle, #ffffff, ${glow}) !important; }

/* ---- Buttons: graphite with a pearl frame; hover fills them white like the card frame ---- */
${SEL.button} {
  background: linear-gradient(180deg, ${mix(t.raised, '#ffffff', 0.06)}, ${t.raised} 50%, ${deep}) !important;
  border-color: ${silver} !important;
  border-radius: 2px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 0 0 1px ${t.bg}, inset 0 0 0 2px ${alpha(pearl, 0.18)}, 0 2px 6px -2px ${alpha('#000000', 0.8)} !important;
}
${SEL.buttonHover} {
  background: ${U(sparkle(5))} right -3px top -3px / 12px no-repeat, linear-gradient(180deg, #ffffff, ${pearl} 55%, ${silver}) !important;
  border-color: #ffffff !important;
  color: ${t.accentText} !important;
  box-shadow: 0 0 10px -1px ${alpha(glow, 0.8)} !important;
}
${SEL.buttonDown} { background: linear-gradient(180deg, ${silver}, ${pearl}) !important; border-color: #ffffff !important; color: ${t.accentText} !important; box-shadow: inset 0 2px 4px ${alpha(t.bg, 0.6)} !important; }
${T(['#content .combobox'])} { background: linear-gradient(180deg, ${t.raised}, ${deep}) !important; border-color: ${silver} !important; border-radius: 2px !important; box-shadow: inset 0 0 0 1px ${t.bg} !important; }
${T(['#content .combobox:hover', '#content .combobox.combobox_selected'])} { border-color: #ffffff !important; box-shadow: inset 0 0 0 1px ${t.bg}, 0 0 8px -2px ${glow} !important; }
${T(['#content .combobox .combobox_line'])} { background-color: ${silver} !important; }

/* ---- Text fields: graphite wells with a silver baseline ---- */
${SEL.field} {
  background-color: ${mix(t.bg, t.surface, 0.5)} !important;
  background-image: linear-gradient(0deg, ${alpha(pearl, 0.55)} 0 1px, transparent 1px) !important;
  border-color: ${mix(t.border, pearl, 0.25)} !important;
  border-radius: 1px !important;
  box-shadow: inset 0 1px 3px ${alpha('#000000', 0.55)} !important;
  color: ${t.text} !important;
}
${T(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 1px solid #ffffff !important; box-shadow: 0 0 8px ${alpha(glow, 0.6)} !important; }

/* ---- Pop-ups: white frame, star corners, rings behind the title ---- */
${dlg()} {
  background: ${U(rings(false))} center top 4px / 100% 70px no-repeat, ${face}, ${dust} 0 0 / 120px, linear-gradient(180deg, ${t.raised}, ${t.surface} 40%, ${deep}) !important;
  border-radius: 0 !important;
  box-shadow: 0 0 0 1px ${t.bg}, 0 0 30px -8px ${alpha(glow, 0.6)}, 0 24px 50px -14px ${alpha('#000000', 0.9)} !important;
}
${dlg('::after')} { content: ""; position: absolute; inset: -4px; pointer-events: none; z-index: 1; border: 14px solid transparent; border-image: ${tileFrame} 16 / 16px / 0 stretch; }
${SEL.dialogTitle} { color: #ffffff !important; text-shadow: 0 0 14px ${alpha(glow, 0.8)}, 0 2px 1px ${t.bg} !important; }
${dlg(' .body_txt')} { color: ${t.muted} !important; }

/* ---- Chat: a pearl title bar ---- */
${SEL.chatTop} {
  background: ${U(sparkle(6))} right 34px center / 18px no-repeat, linear-gradient(180deg, #ffffff, ${pearl} 45%, ${silver}) !important;
  border-radius: 2px 2px 0 0 !important;
  box-shadow: inset 0 -1px 0 ${t.bg}, 0 0 12px -4px ${alpha(glow, 0.8)} !important;
}
${T(['#chats .chat .chat_top span'])} { color: ${t.accentText} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.7)} !important; }
${T(['#chats .chat .chat_top img'])} { filter: invert(0.85) !important; }
${SEL.chat} { background: ${dust} 0 0 / 120px, linear-gradient(180deg, ${t.surface}, ${deep}) !important; box-shadow: inset 0 0 0 1px ${silver}, inset 0 0 0 2px ${t.bg} !important; }
${T(['#chats .chat .black_line'])} { background-color: ${silver} !important; }

/* ---- Duel: LP in a white frame with a starlight streak; phases as tuner rings ---- */
${SEL.life} { border-color: transparent !important; border-image: ${slimFrame} 16 / 7px / 1px stretch !important; border-radius: 0 !important; box-shadow: 0 0 12px -3px ${alpha(glow, 0.8)} !important; }
${T(['#duel .lifepoints .life_bar'])} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, transparent 38%, ${alpha('#ffffff', 0.75)} 46%, transparent 54%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.5)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, transparent 38%, ${alpha('#ffffff', 0.75)} 46%, transparent 54%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.5)}, ${t.opp}) !important; }
${T(['#duel .lifepoints .black_bar'])} { background: ${dust} 0 0 / 60px, ${deep} !important; }
${T(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 0 3px ${t.bg}, 0 1px 0 ${t.bg}, 0 0 10px ${alpha(t.bg, 0.9)} !important; }
${SEL.phase} {
  background: repeating-conic-gradient(from 0deg, ${pearl} 0 26deg, ${alpha(pearl, 0.25)} 26deg 30deg) !important;
  box-shadow: 0 0 0 1px ${t.bg}, 0 0 10px -2px ${alpha(glow, 0.6)} !important;
}
${T(['#duel .phase .background .background_top'])} { background: transparent !important; }
${T(['#duel .phase .background .background_inner'])} { background: ${t.bg} !important; }
${T(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${dust} center / 40px, radial-gradient(circle, ${t.raised}, ${deep}) !important; }
${T(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle, #ffffff 0 10%, ${t.self} 40%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.8)} !important; }
${T(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle, #ffffff 0 10%, ${t.opp} 40%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)} !important; }
${T(['#duel .phase.active .background'])} { background: repeating-conic-gradient(from 0deg, #ffffff 0 26deg, ${alpha(glow, 0.5)} 26deg 30deg) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 16px ${alpha(glow, 0.9)} !important; }
${T(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 0 ${t.bg} !important; }
${T(['#duel .phase.active span'])} { color: #ffffff !important; text-shadow: 0 0 3px ${t.bg}, 0 1px 1px ${t.bg} !important; }
${T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(135deg, #ffffff, ${pearl} 50%, ${silver}) !important; }
${T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${deep} !important; }
${T(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${silver} !important; }

/* ---- Duel room: white-framed bays with star corners ---- */
${lobby()} { background-color: ${alpha(t.surface, 0.85)} !important; background-image: ${dust} !important; background-size: 120px !important; }
${lobby('::before')} { background: linear-gradient(135deg, #ffffff, ${pearl} 30%, ${silver} 55%, ${pearl} 80%, #ffffff) !important; }
${T(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(135deg, #ffffff, ${glow} 50%, #ffffff) !important; }
${lobby('::after')} { content: ""; position: absolute; inset: -8px; pointer-events: none; background: ${corners(20)}; }
${T(['#duel_room .format_txt', '#duel_room #host_lbl', '#duel_room .arial_black2'])} { color: #ffffff !important; text-shadow: 0 0 12px ${alpha(glow, 0.6)}, 0 2px 1px ${t.bg} !important; }
${T(['#duel_room .duelbutton .background'])} { background: linear-gradient(180deg, ${t.raised}, ${deep}) !important; }
${T(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(180deg, ${mix(t.raised, glow, 0.18)}, ${deep}) !important; }

/* ---- Deck constructor: stardust bays with a pearl rule ---- */
${T(DECK)} { background-image: ${dust}, ${face} !important; background-size: 120px, auto !important; box-shadow: inset 0 0 0 1px ${pearl}, inset 0 0 0 3px ${t.bg}, inset 0 0 0 4px ${alpha(pearl, 0.25)} !important; }
${T(DECK.map((d) => `${d}::after`))} { content: ""; position: absolute; inset: -6px; pointer-events: none; background: ${corners(16)}; }
${T(['#deck_constructor #search .title_txt'])} { color: #ffffff !important; text-shadow: 0 0 14px ${alpha(glow, 0.7)}, 0 2px 1px ${t.bg} !important; }
${T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: #ffffff !important; text-shadow: 0 0 10px ${alpha(glow, 0.6)} !important; }

/* ---- Settings: white frames ---- */
${settings} { border-color: transparent !important; border-image: ${tileFrame} 16 / 12px / 3px stretch !important; border-radius: 0 !important; background-image: ${dust}, ${face} !important; }
${T(['#settings .admin_lbl', '#settings .title1'])} { color: #ffffff !important; text-shadow: 0 0 12px ${alpha(glow, 0.6)}, 0 2px 1px ${t.bg} !important; }

/* ---- Scrollbars ---- */
${T(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${silver}, #ffffff, ${silver}) !important; border-radius: 1px !important; }
${T(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: #ffffff !important; box-shadow: 0 0 6px ${glow}; }
`;
  return `html body { ${[...ids].map(([s, id]) => `${id}: ${url(s)};`).join(' ')} }
${css.replace(/\/\*[^*]*\*\//g, '').replace(/\n\s+/g, '\n')}`;
};
