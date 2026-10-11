// Synchro: the white Synchro frame and the summon itself. Pearl-white frames
// with four-point star sparkles at the corners, tuner rings that a line of
// starlight runs through, stardust on graphite, phase buttons as rings of light.

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
  const pearl = t.accent;
  const silver = mix(t.accent, t.muted, 0.45);
  const deep = mix(t.surface, t.bg, 0.45);
  const glow = t.accent2;
  // Tuner green: the rings a Tuner becomes in the summon.
  const tuner = t.success;
  const tunerIcon = (on) => svg(30, 24, `${[7, 15, 23].map((x, i) => `<ellipse cx="${x}" cy="12" rx="3.2" ry="10.5" fill="none" stroke="${i === 1 ? '#ffffff' : tuner}" stroke-opacity="${on ? 1 : 0.85}" stroke-width="${on ? 1.8 : 1.4}"/>`).join('')}`);
  // Pearl panel material: a graphite plate with a cool pearlescent sheen.
  const pearlMat = `linear-gradient(160deg, ${mix(t.surface, pearl, 0.17)}, ${mix(t.surface, pearl, 0.04)} 42%, ${mix(t.surface, pearl, 0.12)} 72%, ${mix(t.surface, tuner, 0.1)})`;
  const titleBar = `linear-gradient(${tuner}, ${tuner}) center bottom / 3em 2px no-repeat`;

  const star = (x, y, r, fill = '#ffffff', o = 1) =>
    `<path d="M${x} ${y - r}C${x + r * 0.12} ${y - r * 0.12} ${x + r * 0.12} ${y - r * 0.12} ${x + r} ${y}C${x + r * 0.12} ${y + r * 0.12} ${x + r * 0.12} ${y + r * 0.12} ${x} ${y + r}C${x - r * 0.12} ${y + r * 0.12} ${x - r * 0.12} ${y + r * 0.12} ${x - r} ${y}C${x - r * 0.12} ${y - r * 0.12} ${x - r * 0.12} ${y - r * 0.12} ${x} ${y - r}Z" fill="${fill}" opacity="${o}"/>`;
  const sparkle = (r = 7) => svg(24, 24, `<circle cx="12" cy="12" r="${r * 0.9}" fill="${glow}" opacity=".22"/><circle cx="12" cy="12" r="${r * 0.45}" fill="#ffffff" opacity=".35"/>${star(12, 12, r)}${star(12, 12, r * 0.55, glow, 0.5)}`);

  // 9-slice white frame: pearl band, graphite gap, silver hairline; sparkles on the corners.
  const frame = (s, b) =>
    svg(48, 48, `<defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="${pearl}"/><stop offset=".6" stop-color="${silver}"/><stop offset="1" stop-color="${pearl}"/></linearGradient></defs>
<path d="M0 0H48V48H0ZM${b} ${b}V${48 - b}H${48 - b}V${b}Z" fill="url(#p)" fill-rule="evenodd"/><rect x="${b + 0.5}" y="${b + 0.5}" width="${47 - 2 * b}" height="${47 - 2 * b}" fill="none" stroke="${t.bg}" stroke-width="1"/><rect x="${b + 2}" y="${b + 2}" width="${44 - 2 * b}" height="${44 - 2 * b}" fill="none" stroke="${tuner}" stroke-opacity=".8" stroke-width=".8"/>
${[[s * 0.4, s * 0.4], [48 - s * 0.4, s * 0.4], [s * 0.4, 48 - s * 0.4], [48 - s * 0.4, 48 - s * 0.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${s * 0.22}" fill="${glow}" opacity=".35"/>${star(x, y, s * 0.38)}`).join('')}`);

  // Tuner rings in perspective with a streak of starlight through them.
  // Three tuner rings at the left edge; one stream of light runs out of them behind the label.
  const rings = (on) =>
    svg(220, 60, `<defs><linearGradient id="l"><stop offset="0" stop-color="#ffffff" stop-opacity="${on ? 0.95 : 0.6}"/><stop offset=".25" stop-color="${glow}" stop-opacity="${on ? 0.6 : 0.3}"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></linearGradient><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient><mask id="m"><rect y="22" width="220" height="16" fill="url(#v)"/></mask></defs>
<rect y="22" width="220" height="16" fill="url(#l)" mask="url(#m)"/><rect y="29.4" width="200" height="1.2" fill="url(#l)"/>
<g fill="none" stroke="${on ? '#ffffff' : pearl}" stroke-opacity="${on ? 0.9 : 0.32}" stroke-width="${on ? 1.4 : 1}">${[7, 14, 21].map((x) => `<ellipse cx="${x}" cy="30" rx="2.8" ry="23"/>`).join('')}</g>
${on ? [48, 96, 150].map((x, i) => star(x, 30, 4 - i)).join('') : ''}`);
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
  const settings = T(SETTINGS.map((x) => `#content #settings_content > div.${x}`));
  // Pop-up buttons (DuelingBook draws them as images): the primary one is the
  // white Synchro frame with a dark label, the secondary graphite in a pearl rim.
  const FONT = 'Segoe UI,Arial,sans-serif';
  const popBtn = (label, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    return svg(w, h, `<defs><linearGradient id="k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${primary ? '#ffffff' : t.raised}"/><stop offset=".55" stop-color="${primary ? pearl : t.surface}"/><stop offset="1" stop-color="${primary ? silver : deep}"/></linearGradient></defs><rect x="6" y="10" width="${w - 12}" height="${h - 20}" rx="4" fill="url(#k)" stroke="${primary ? '#ffffff' : silver}" stroke-width="2.5"/><rect x="11" y="15" width="${w - 22}" height="${h - 30}" rx="2" fill="none" stroke="${primary ? silver : alpha(pearl, 0.35)}" stroke-width="1"/><path d="M10 13.5H${w - 10}" stroke="#ffffff" stroke-width="2"/><path d="M10 ${h - 13.5}H${w - 10}" stroke="${primary ? mix(silver, t.bg, 0.3) : t.bg}" stroke-width="2"/>${[19, 27, 35].map((x, i) => `<ellipse cx="${x}" cy="39.2" rx="3" ry="14" fill="none" stroke="${i === 1 ? (primary ? silver : '#ffffff') : tuner}" stroke-width="2"/>`).join('')}<text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${primary ? t.accentText : t.text}">${label}</text>`);
  };
  const pop = (name) => T([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const titles = T(['#duel_room .format_txt', '#duel_room span.arial_black2', '#settings .admin_lbl']);
  // Backdrop: one off-centre cluster of tuner rings with a stream through it.
  const cluster = svg(800, 800, `<g fill="none" stroke="${pearl}" stroke-opacity=".07" stroke-width="3">${[300, 400, 500].map((x) => `<ellipse cx="${x}" cy="400" rx="60" ry="320"/>`).join('')}</g><rect y="397" width="800" height="6" fill="${glow}" fill-opacity=".06"/>`);
  const corners = (s) => ['left top', 'right top', 'left bottom', 'right bottom'].map((p) => `${U(sparkle())} ${p} / ${s}px no-repeat`).join(', ');

  const css = `
/* ---- Menu tiles: white Synchro frame, tuner rings that flare on hover ---- */
${SEL.tile} {
  background: ${face}, ${dust} 0 0 / 120px, linear-gradient(180deg, ${t.raised}, ${deep}) !important;
  border-color: transparent !important;
  border-image: ${tileFrame} 16 / 12px / 3px stretch !important;
  border-radius: 0 !important;
  box-shadow: 0 10px 24px -14px ${alpha('#000000', 0.9)} !important;
  transition: background-color .15s, box-shadow .2s;
}
${SEL.tileHover} {
  background: ${face}, ${dust} 0 0 / 120px, radial-gradient(ellipse at 50% 50%, ${alpha(glow, 0.3)}, transparent 70%), linear-gradient(180deg, ${mix(t.raised, glow, 0.12)}, ${deep}) !important;
  box-shadow: 0 0 22px -6px ${alpha(glow, 0.8)} !important;
}
${T(['#main_menu .menu_btn:active .content'])} { background: linear-gradient(180deg, ${deep}, ${t.raised}) !important; box-shadow: inset 0 3px 8px ${alpha('#000000', 0.6)} !important; }
${T(['#main_menu .menu_btn .content::before'])} { content: ""; position: absolute; left: 16px; right: 16px; top: 8px; height: 20px; pointer-events: none; background: ${U(tunerIcon(false))} left center / 24px 20px no-repeat, linear-gradient(90deg, ${alpha('#ffffff', 0.7)}, ${alpha(glow, 0.35)} 30%, transparent) 30px center / calc(100% - 30px) 1px no-repeat; }
${T(['#main_menu .menu_btn:hover .content::before'])} { background: ${U(tunerIcon(true))} left center / 24px 20px no-repeat, linear-gradient(90deg, #ffffff, ${alpha(tuner, 0.6)} 40%, transparent) 30px center / calc(100% - 30px) 2px no-repeat; }
${T(['#main_menu .menu_btn.dbte-small-menu .content::before'])} { content: none; }
${SEL.tileLabel} { color: #ffffff !important; text-shadow: 0 0 10px ${alpha(glow, 0.55)}, 0 2px 1px ${t.bg} !important; }
${T(['#main_menu .menu_btn.dbte-small-menu .content'])} { border-image: ${slimFrame} 16 / 6px / 0 stretch !important; }
${T(['#main_menu .main_menu_circle .background'])} { background: radial-gradient(circle, #ffffff, ${glow}) !important; }

/* ---- Buttons: graphite with a pearl frame; hover fills them white like the card frame ---- */
${SEL.button}, ${T(['#content #settings_content > div.button'])} {
  background: linear-gradient(180deg, ${mix(t.raised, '#ffffff', 0.06)}, ${t.raised} 50%, ${deep}) !important;
  border-color: ${silver} !important;
  border-radius: 2px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 0 0 1px ${t.bg}, inset 0 0 0 2px ${alpha(pearl, 0.18)}, 0 2px 6px -2px ${alpha('#000000', 0.8)} !important;
}
${SEL.buttonHover}, ${T(['#content #settings_content > div.button:hover'])} {
  background: ${U(sparkle(5))} right -3px top -3px / 12px no-repeat, linear-gradient(180deg, #ffffff, ${pearl} 55%, ${silver}) !important;
  border-color: #ffffff !important;
  color: ${t.accentText} !important;
  box-shadow: 0 0 10px -1px ${alpha(glow, 0.8)} !important;
}
${SEL.buttonDown}, ${T(['#content #settings_content > div.button:active'])} { background: linear-gradient(180deg, ${silver}, ${pearl}) !important; border-color: #ffffff !important; color: ${t.accentText} !important; box-shadow: inset 0 2px 4px ${alpha(t.bg, 0.6)} !important; }
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
  background: ${face}, ${dust} 0 0 / 120px, linear-gradient(180deg, ${t.raised}, ${t.surface} 40%, ${deep}) !important;
  border-radius: 0 !important;
  box-shadow: 0 0 0 1px ${t.bg}, 0 0 30px -8px ${alpha(glow, 0.6)}, 0 24px 50px -14px ${alpha('#000000', 0.9)} !important;
}
${dlg('::after')} { content: ""; position: absolute; inset: -4px; pointer-events: none; z-index: 1; border: 14px solid transparent; border-image: ${tileFrame} 16 / 16px / 0 stretch; }
${SEL.dialogTitle} { color: #ffffff !important; text-shadow: 0 0 14px ${alpha(glow, 0.8)}, 0 2px 1px ${t.bg} !important; }
${dlg(' .body_txt')} { color: ${t.text} !important; }

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
${SEL.life} { border-color: transparent !important; border-image: ${slimFrame} 16 / 7px / 1px stretch !important; border-radius: 0 !important; box-shadow: 0 0 0 2px ${silver}, 0 0 0 3px ${t.bg}, 0 0 12px -3px ${alpha(glow, 0.8)} !important; }
${T(['#duel .lifepoints .life_border::before'])} { content: ""; position: absolute; left: -9px; top: 50%; width: 14px; height: 14px; margin-top: -9px; border-radius: 50%; border: 2px solid ${tuner}; background: ${deep}; box-shadow: 0 0 0 1px ${t.bg}, 0 0 8px ${alpha(tuner, 0.8)}; pointer-events: none; }
${T(['#duel .lifepoints .life_bar'])} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, transparent 12%, ${alpha('#ffffff', 0.6)} 21%, transparent 31%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.5)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, transparent 12%, ${alpha('#ffffff', 0.6)} 21%, transparent 31%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.5)}, ${t.opp}) !important; }
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
${T(['#duel .phase span'])} { color: ${mix(t.text, t.muted, 0.3)} !important; text-shadow: 0 1px 0 ${t.bg} !important; }
${T(['#duel .phase.active span'])} { color: #ffffff !important; text-shadow: 0 0 3px ${t.bg}, 0 1px 1px ${t.bg} !important; }
${T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(135deg, #ffffff, ${pearl} 50%, ${silver}) !important; }
${T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${deep} !important; }
${T(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${silver} !important; }

/* ---- Duel room: white-framed bays with star corners ---- */
${lobby()} { background-color: ${alpha(t.surface, 0.9)} !important; background-image: ${pearlMat} !important; box-shadow: inset 0 0 0 1px ${alpha(tuner, 0.45)} !important; }
${lobby('::before')} { filter: none !important; background: linear-gradient(135deg, #ffffff, ${pearl} 30%, ${silver} 55%, ${pearl} 80%, #ffffff) !important; }
${T(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(135deg, #ffffff, ${glow} 50%, #ffffff) !important; }
${lobby('::after')} { content: ""; position: absolute; inset: -8px; pointer-events: none; background: ${corners(20)}; }
${T(['#duel_room .format_txt', '#duel_room span.arial_black2'])} { color: #ffffff !important; text-shadow: 0 0 12px ${alpha(glow, 0.6)}, 0 2px 1px ${t.bg} !important; }
${T(['#duel_room .duelbutton .background'])} { background: linear-gradient(180deg, ${t.raised}, ${deep}) !important; }
${T(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(180deg, ${mix(t.raised, glow, 0.18)}, ${deep}) !important; }

/* ---- Deck constructor: stardust bays with a pearl rule ---- */
${T(DECK)} { background-image: ${pearlMat} !important; background-size: auto !important; box-shadow: inset 0 0 0 1px ${pearl}, inset 0 0 0 3px ${t.bg}, inset 0 0 0 4px ${alpha(tuner, 0.25)} !important; }
${T(DECK.map((d) => `${d}::after`))} { content: ""; position: absolute; inset: -6px; pointer-events: none; background: ${corners(16)}; }
${T(['#deck_constructor #search .title_txt'])} { color: #ffffff !important; text-shadow: 0 0 14px ${alpha(glow, 0.7)}, 0 2px 1px ${t.bg} !important; }
${T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: #ffffff !important; text-shadow: 0 0 10px ${alpha(glow, 0.6)} !important; }

/* ---- Settings: white frames ---- */
${settings} { border-color: transparent !important; border-image: ${tileFrame} 16 / 12px / 3px stretch !important; border-radius: 0 !important; background-color: ${t.surface} !important; background-image: ${pearlMat} !important; }
${T(['#settings .admin_lbl', '#settings .title1'])} { color: #ffffff !important; text-shadow: 0 0 12px ${alpha(glow, 0.6)}, 0 2px 1px ${t.bg} !important; }

/* ---- Pop-up buttons, panel title plates ---- */
${pop('ok_btn')} { content: ${U(popBtn('OK', false, true))} !important; }
${pop('yes_btn')} { content: ${U(popBtn('Yes', false, true))} !important; }
${pop('no_btn')} { content: ${U(popBtn('No', false, false))} !important; }
${pop('cancel_btn')} { content: ${U(popBtn('Cancel', true, false))} !important; }
${T(['#content .ok_btn:hover img', '#content .yes_btn:hover img', '#content .no_btn:hover img', '#content .cancel_btn:hover img'])} { filter: drop-shadow(0 0 5px ${alpha(glow, 0.9)}) !important; }
${titles} { background: ${titleBar}, ${t.surface} !important; box-shadow: 0 0 0 .3em ${t.surface} !important; border-radius: .2em; }
${T(['#duel_room .format .format_txt'])} { background: linear-gradient(90deg, transparent 16%, ${t.surface} 24% 76%, transparent 84%) !important; box-shadow: none !important; }

/* ---- Backdrop: one tuner-ring cluster, off centre, no repeat ---- */
html body #dbte-skin-motif { background: ${U(cluster)} 78% 50% / min(110vh, 1100px) no-repeat !important; }
html body #dbte-skin-motif::before { background: none !important; }

/* ---- Scrollbars ---- */
${T(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${silver}, #ffffff, ${silver}) !important; border-radius: 1px !important; }
${T(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: #ffffff !important; box-shadow: 0 0 6px ${glow}; }
`;
  return `html body { ${[...ids].map(([s, id]) => `${id}: ${url(s)};`).join(' ')} }
${css.replace(/\/\*[^*]*\*\//g, '').replace(/\n\s+/g, '\n')}`;
};
