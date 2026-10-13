// Xyz: the black Xyz frame. Starfield black plates ruled in fine gold, Rank
// stars (gold stars in black orbs) set into the frames, and overlay units:
// gold orbs on an orbit that light up when a control is pointed at.

import { mix } from '../../../lib/color.js';
import { svgUrl as kitSvgUrl } from './kit.js';

// Compact data URI: only % and # (and braces, which keepAreas splits on) are escaped.
const url = kitSvgUrl;

export default (t, { SEL, sel, svg, alpha }) => {
  // Each SVG is written once, as a custom property, and referenced by var().
  const ids = new Map();
  const U = (s) => {
    if (!ids.has(s)) ids.set(s, `--dbc${ids.size}`);
    return `var(${ids.get(s)})`;
  };
  const T = (list) => sel(list);
  const gold = t.accent;
  const goldLight = mix(t.accent, '#ffffff', 0.45);
  const goldDeep = mix(t.accent, t.bg, 0.45);
  const ink = mix(t.surface, t.bg, 0.3);
  // The opponent's violet, lifted so a healthy bar reads lit, not dusk.
  const violet = mix(t.opp, '#8a5ce8', 0.5);

  const star5 = (x, y, r, fill) => {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.45 : r;
      pts.push(`${(x + Math.cos(a) * rr).toFixed(2)},${(y + Math.sin(a) * rr).toFixed(2)}`);
    }
    return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
  };
  // A Rank star: black orb, gold rim, gold star.
  // Drawn once at unit size in the defs, placed with <use>.
  const rankStar = (x, y, r) => `<use href="#R" transform="translate(${+x.toFixed(1)} ${+y.toFixed(1)}) scale(${+r.toFixed(2)})"/>`;
  const defs = `<defs><radialGradient id="o" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="${t.raised}"/><stop offset="1" stop-color="${t.bg}"/></radialGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${goldLight}"/><stop offset=".6" stop-color="${gold}"/><stop offset="1" stop-color="${goldDeep}"/></linearGradient><g id="R"><circle r="1" fill="url(#o)" stroke="${gold}" stroke-width=".14"/>${star5(0, 0.04, 0.62, 'url(#g)')}<ellipse cx="-.3" cy="-.45" rx=".35" ry=".18" fill="#ffffff" opacity=".25"/></g></defs>`;
  const unitDefs = `<defs><radialGradient id="u"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="${goldLight}"/><stop offset=".7" stop-color="${gold}" stop-opacity=".55"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient></defs>`;
  const rankRow = (n, r = 6) => svg(n * r * 2.5, r * 2.4, defs + Array.from({ length: n }, (_, i) => rankStar(r * 1.2 + i * r * 2.5, r * 1.2, r)).join(''));
  const rankOne = (r = 10) => svg(r * 2.4, r * 2.4, defs + rankStar(r * 1.2, r * 1.2, r));
  // Overlay units on their orbit.
  const orbit = (on, w = 220, h = 60, at = [[0.12, 0.62], [0.86, 0.38], [0.5, 0.88]]) =>
    svg(w, h, `${on ? unitDefs : ''}<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2 - 6}" ry="${h / 2 - 8}" fill="none" stroke="${gold}" stroke-opacity="${on ? 0.6 : 0.16}" stroke-width="1" stroke-dasharray="${on ? 'none' : '2 5'}"/>
${on ? at.map(([fx, fy]) => `<circle cx="${(w * fx).toFixed(1)}" cy="${(h * fy).toFixed(1)}" r="9" fill="url(#u)"/>`).join('') : ''}`);
  // 9-slice gold double rule on black, with a Rank star at each corner.
  const frame = (s, b, stars = true) =>
    svg(48, 48, `${stars ? defs : ''}<rect x=".5" y=".5" width="47" height="47" fill="none" stroke="${gold}" stroke-width="1"/><rect x="${b}" y="${b}" width="${48 - 2 * b}" height="${48 - 2 * b}" fill="none" stroke="${goldDeep}" stroke-width=".7"/>
${stars ? [[b / 2 + 1, b / 2 + 1], [47 - b / 2, b / 2 + 1], [b / 2 + 1, 47 - b / 2], [47 - b / 2, 47 - b / 2]].map(([x, y]) => rankStar(x, y, s * 0.36)).join('') : ''}`);
  const field = U(svg(140, 140, [[10, 20, 0.7], [60, 8, 0.5], [120, 30, 0.9], [90, 70, 0.5], [30, 100, 0.8], [130, 120, 0.5], [70, 128, 0.7], [40, 52, 0.4], [104, 98, 0.4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="${0.15 + r * 0.3}"/>`).join('')));
  const face = `linear-gradient(180deg, ${alpha(gold, 0.06)}, transparent 30%, ${alpha('#000000', 0.4)})`;

  const tileFrame = U(frame(12, 4));
  const thinFrame = U(frame(10, 3, false));
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const dlg = (suffix = '') => T(DIALOGS.map((d) => `#content ${d}${suffix}`));
  const LOBBY = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const lobby = (suffix = '') => T(LOBBY.map((x) => `#duel_room ${x}${suffix}`));
  const DECK = ['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg'];
  const SETTINGS = ['about_me', 'preferences', 'social_media', 'animation', 'profile_song', 'account', 'messages', 'duel_stats', 'profile_comments'];
  const settings = (suffix = '') => T(SETTINGS.map((x) => `#content #settings_content > div.${x}${suffix}`));
  // Gold corner brackets, like the corners of the card's art box.
  const units = (on) => {
    const c = on ? goldLight : gold;
    const h = (x) => `linear-gradient(${c}, ${c}) ${x} / 5px 1px no-repeat`;
    const v = (x) => `linear-gradient(${c}, ${c}) ${x} / 1px 5px no-repeat`;
    return [h('left 1px top 1px'), v('left 1px top 1px'), h('right 1px bottom 1px'), v('right 1px bottom 1px'), h('right 1px top 1px'), v('right 1px top 1px'), h('left 1px bottom 1px'), v('left 1px bottom 1px')].join(', ');
  };

  // Pop-up buttons (DuelingBook draws them as images): the primary is a gold
  // plate with a dark label, the secondary black lacquer in the gold double rule.
  const FONT = 'Segoe UI,Arial,sans-serif';
  const popBtn = (label, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    return svg(w, h, `<defs><linearGradient id="k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${primary ? goldLight : t.raised}"/><stop offset=".55" stop-color="${primary ? gold : ink}"/><stop offset="1" stop-color="${primary ? mix(gold, goldDeep, 0.5) : t.bg}"/></linearGradient></defs><rect x="6" y="10" width="${w - 12}" height="${h - 20}" rx="3" fill="url(#k)" stroke="${primary ? goldDeep : gold}" stroke-width="2"/><rect x="11" y="15" width="${w - 22}" height="${h - 30}" rx="1" fill="none" stroke="${primary ? alpha(t.bg, 0.45) : goldDeep}" stroke-width="1.2"/><text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${primary ? t.accentText : goldLight}">${label}</text>`);
  };
  const pop = (name) => T([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const titles = T(['#duel_room .format_txt', '#duel_room span.arial_black2', '#settings .admin_lbl']);
  // Backdrop: sparkles scattered at random, 40-70% of the old size.
  const sparkleField = (() => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    let out = '';
    for (let i = 0; i < 14; i++) {
      const x = 20 + rnd() * 560;
      const y = 20 + rnd() * 560;
      const r = 3 + rnd() * 4;
      out += `<use href="#s" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${r.toFixed(1)})" opacity="${(0.14 + rnd() * 0.16).toFixed(2)}"/>`;
    }
    return svg(600, 600, `<defs><path id="s" d="M0-1L.28-.28L1 0L.28.28L0 1L-.28.28L-1 0L-.28-.28Z" fill="${gold}"/></defs>${out}`);
  })();

  const css = `
/* ---- Menu tiles: black plate, gold double rule, Rank stars at the corners, overlay units on hover ---- */
${SEL.tile} {
  background: ${face}, ${field} 0 0 / 140px, linear-gradient(180deg, ${t.raised}, ${t.bg}) !important;
  border-color: transparent !important;
  border-image: ${tileFrame} 12 / 12px / 0 stretch !important;
  border-radius: 0 !important;
  box-shadow: 0 10px 24px -12px ${alpha('#000000', 0.95)} !important;
}
${SEL.tileHover} {
  background: ${face}, ${field} 0 0 / 140px, radial-gradient(ellipse at 50% 50%, ${alpha(gold, 0.16)}, transparent 70%), linear-gradient(180deg, ${mix(t.raised, gold, 0.08)}, ${t.bg}) !important;
  box-shadow: 0 0 20px -6px ${alpha(gold, 0.7)} !important;
}
${T(['#main_menu .menu_btn:active .content'])} { background: linear-gradient(180deg, ${t.bg}, ${t.raised}) !important; box-shadow: inset 0 3px 8px ${alpha('#000000', 0.8)} !important; }
${T(['#main_menu .menu_btn .content::before'])} { content: ""; position: absolute; inset: -10px -16px; pointer-events: none; background: ${U(orbit(true))} center / 100% 100% no-repeat; opacity: .4; transition: opacity .2s; }
${T(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; }
${T(['#main_menu .menu_btn .content::after', '#main_menu .menu_btn:hover .content::after'])} { content: ""; position: absolute; left: 14px; top: -10px; right: auto; bottom: auto; width: 63px; height: 18px; pointer-events: none; background: ${U(rankRow(3))} left center / 100% 100% no-repeat; }
${T(['#main_menu .menu_btn.dbte-small-menu .content::before', '#main_menu .menu_btn.dbte-small-menu .content::after'])} { content: none; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 2px #000000, 0 0 10px ${alpha(gold, 0.35)} !important; }
${T(['#main_menu .menu_btn.dbte-small-menu .content'])} { border-image: ${thinFrame} 12 / 6px / 0 stretch !important; }
${T(['#main_menu .main_menu_circle'])} { border-color: ${goldDeep} !important; }
${T(['#main_menu .main_menu_circle .background'])} { background: radial-gradient(circle at 40% 35%, #ffffff, ${gold} 50%, ${goldDeep}) !important; }

/* ---- Buttons: black with a gold hairline; an overlay unit glows at each end ---- */
${SEL.button}, ${T(['#content #settings_content > div.button'])} {
  background: ${units(false)}, linear-gradient(180deg, ${t.raised}, ${ink} 55%, ${t.bg}) !important;
  border-color: ${goldDeep} !important;
  border-radius: 1px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(gold, 0.3)}, 0 2px 6px -2px #000000 !important;
}
${SEL.buttonHover}, ${T(['#content #settings_content > div.button:hover'])} {
  background: ${units(true)}, linear-gradient(180deg, ${mix(t.raised, gold, 0.16)}, ${ink} 60%, ${t.bg}) !important;
  border-color: ${gold} !important;
  color: ${goldLight} !important;
  box-shadow: inset 0 1px 0 ${alpha(goldLight, 0.5)}, 0 0 10px -2px ${alpha(gold, 0.9)} !important;
}
${SEL.buttonDown}, ${T(['#content #settings_content > div.button:active'])} { background: ${units(true)}, linear-gradient(180deg, ${t.bg}, ${mix(t.raised, gold, 0.2)}) !important; border-color: ${gold} !important; box-shadow: inset 0 2px 5px #000000 !important; }
${T(['#content .combobox'])} { background: linear-gradient(180deg, ${t.raised}, ${t.bg}) !important; border-color: ${goldDeep} !important; border-radius: 1px !important; box-shadow: inset 0 1px 0 ${alpha(gold, 0.25)} !important; }
${T(['#content .combobox:hover', '#content .combobox.combobox_selected'])} { border-color: ${gold} !important; box-shadow: 0 0 8px -2px ${gold} !important; }
${T(['#content .combobox .combobox_line'])} { background-color: ${goldDeep} !important; }
${T(['#content .combobox .combobox_arrow img'])} { filter: sepia(1) saturate(2.5) brightness(0.95) !important; }

/* ---- Text fields: black wells with a gold baseline ---- */
${SEL.field} {
  background-color: ${t.bg} !important;
  background-image: linear-gradient(0deg, ${alpha(gold, 0.6)} 0 1px, transparent 1px) !important;
  border-color: ${mix(t.border, gold, 0.25)} !important;
  border-radius: 0 !important;
  box-shadow: inset 0 1px 3px #000000 !important;
  color: ${t.text} !important;
}
${T(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: 0 0 8px ${alpha(gold, 0.5)} !important; }

/* ---- Pop-ups: Xyz frame, Rank stars on the corners, overlay units around the title ---- */
${dlg()} {
  background: ${U(orbit(true, 300, 70))} center top 2px / 70% 64px no-repeat, ${face}, ${field} 0 0 / 140px, linear-gradient(180deg, ${t.raised}, ${t.surface} 35%, ${t.bg}) !important;
  border-radius: 0 !important;
  box-shadow: 0 0 0 1px #000000, 0 0 26px -6px ${alpha(gold, 0.45)}, 0 24px 50px -14px #000000 !important;
}
${dlg('::after')} { content: ""; position: absolute; inset: -6px; pointer-events: none; z-index: 1; border: 16px solid transparent; border-image: ${tileFrame} 12 / 16px / 0 stretch; }
${SEL.dialogTitle} { color: ${goldLight} !important; text-shadow: 0 2px 2px #000000, 0 0 14px ${alpha(gold, 0.55)} !important; }
${dlg(' .body_txt')} { color: ${t.text} !important; }

/* ---- Chat: black title bar on a gold rule, a Rank-star row ---- */
${SEL.chatTop} {
  background: linear-gradient(180deg, ${t.raised}, ${t.bg}) !important;
  border-radius: 0 !important;
  box-shadow: inset 0 1px 0 ${alpha(gold, 0.45)}, inset 0 -1px 0 ${gold}, inset 0 -3px 0 ${t.bg}, inset 0 -4px 0 ${goldDeep} !important;
}
${T(['#chats .chat .chat_top span'])} { color: ${goldLight} !important; text-shadow: 0 1px 1px #000000 !important; }
${SEL.chat} { background: ${field} 0 0 / 140px, linear-gradient(180deg, ${t.surface}, ${t.bg}) !important; box-shadow: inset 0 0 0 1px ${goldDeep} !important; }
${T(['#chats .chat .black_line'])} { background-color: ${goldDeep} !important; }

/* ---- Duel: LP in a gold-ruled black capsule led by a Rank star; phases as orbits ---- */
${SEL.life} { border-color: ${gold} !important; border-radius: 3px !important; box-shadow: inset 0 0 0 1px #000000, 0 0 0 1px #000000, 0 0 10px -2px ${alpha(gold, 0.6)} !important; }
${T(['#duel .lifepoints .life_border::before'])} { content: ""; position: absolute; z-index: 3; left: -11px; top: 50%; width: 22px; height: 22px; margin-top: -11px; background: ${U(rankOne())} center / 100% no-repeat; pointer-events: none; }
${T(['#duel .lifepoints .life_bar'])} { border-radius: 3px !important; }
${SEL.lifeSelf} { background: ${field} 0 0 / 70px, linear-gradient(180deg, ${alpha('#ffffff', 0.28)}, transparent 50%, ${alpha('#000000', 0.25)}), linear-gradient(90deg, ${mix(t.self, '#000000', 0.2)}, ${mix(t.self, '#ffffff', 0.12)}) !important; box-shadow: inset 0 0 0 2px ${alpha('#000000', 0.7)} !important; }
${SEL.lifeOpp} { background: ${field} 0 0 / 70px, linear-gradient(180deg, ${alpha('#ffffff', 0.28)}, transparent 50%, ${alpha('#000000', 0.25)}), linear-gradient(90deg, ${mix(violet, t.bg, 0.3)}, ${violet} 60%, ${mix(violet, '#ffffff', 0.15)}) !important; box-shadow: inset 0 0 0 2px ${alpha('#000000', 0.6)} !important; }
${T(['#duel .lifepoints .black_bar'])} { background: ${field} 0 0 / 70px, ${t.bg} !important; }
${T(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 0 3px #000000, 0 1px 0 #000000, 0 0 10px #000000 !important; }
${SEL.phase} {
  background: radial-gradient(circle at 50% 3px, ${goldLight} 0 2px, transparent 3.5px), radial-gradient(circle at calc(100% - 4px) 70%, ${goldLight} 0 1.5px, transparent 3px), conic-gradient(from 200deg, ${goldDeep}, ${gold}, ${goldLight}, ${gold}, ${goldDeep}, ${t.border}, ${goldDeep}) !important;
  box-shadow: 0 0 0 1px #000000, 0 3px 8px #000000 !important;
}
${T(['#duel .phase .background .background_top'])} { background: transparent !important; }
${T(['#duel .phase .background .background_inner'])} { background: #000000 !important; }
${T(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${field} center / 40px, radial-gradient(circle at 50% 38%, ${t.raised}, ${t.bg}) !important; }
${T(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 40%, ${mix(t.self, '#ffffff', 0.35)}, ${t.self} 35%, ${mix(t.self, t.bg, 0.6)} 75%) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.75)}, 0 0 0 2px ${alpha(gold, 0.8)} !important; }
${T(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 40%, ${mix(t.opp, '#ffffff', 0.35)}, ${t.opp} 35%, ${mix(t.opp, t.bg, 0.6)} 75%) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.75)}, 0 0 0 2px ${alpha(gold, 0.8)} !important; }
${T(['#duel .phase span'])} { color: ${mix(t.text, t.accent, 0.12)} !important; text-shadow: 0 1px 1px #000000 !important; }
${T(['#duel .phase.active span'])} { color: #ffffff !important; text-shadow: 0 0 3px #000000, 0 1px 1px #000000 !important; }
${T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${goldLight}, ${gold} 45%, ${goldDeep}) !important; }
${T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${t.bg} !important; }
${T(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${goldDeep} !important; }

/* ---- Duel room: black bays, gold rule, Rank-star corners ---- */
${lobby()} { background-color: ${alpha(t.surface, 0.88)} !important; background-image: ${field} !important; background-size: 140px !important; }
${lobby('::before')} { filter: none !important; background: linear-gradient(135deg, ${goldLight}, ${gold} 25%, ${goldDeep} 50%, ${gold} 75%, ${goldLight}) !important; padding: 2px !important; }
${T(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(135deg, #ffffff, ${goldLight} 40%, ${gold}) !important; }
${lobby('::after')} { content: ""; position: absolute; inset: -9px; pointer-events: none; background: ${['left top', 'right top', 'left bottom', 'right bottom'].map((p) => `${U(rankOne())} ${p} / 20px no-repeat`).join(', ')}; }
${T(['#duel_room .format_txt', '#duel_room span.arial_black2'])} { color: ${goldLight} !important; text-shadow: 0 2px 2px #000000, 0 0 12px ${alpha(gold, 0.45)} !important; }
${T(['#duel_room .duelbutton .background'])} { background: linear-gradient(180deg, ${t.raised}, ${t.bg}) !important; }
${T(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(180deg, ${mix(t.raised, gold, 0.14)}, ${t.bg}) !important; }
${T(['#duel_room .duelbutton'])} { border-color: ${alpha(gold, 0.22)} !important; }

/* ---- Deck constructor: starfield bays, double gold rule, a Rank-star row on the main deck ---- */
${T(DECK)} { background-image: ${field}, ${face} !important; background-size: 140px, auto !important; box-shadow: inset 0 0 0 1px ${gold}, inset 0 0 0 4px ${alpha('#000000', 0.8)}, inset 0 0 0 5px ${goldDeep} !important; }
${T(['#deck_constructor #search .search_bg::after'])} { content: ""; position: absolute; left: 50%; top: 4px; width: 75px; height: 14px; margin-left: -37px; background: ${U(rankRow(5))} center / 100% no-repeat; pointer-events: none; }
${T(['#deck_constructor #search .title_txt'])} { color: ${goldLight} !important; text-shadow: 0 2px 2px #000000, 0 0 14px ${alpha(gold, 0.5)} !important; }
${T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${goldLight} !important; text-shadow: 0 0 10px ${alpha(gold, 0.45)} !important; }

/* ---- Settings: black plates in the gold Xyz frame ---- */
${settings()} { border-color: transparent !important; border-image: ${tileFrame} 12 / 12px / 0 stretch !important; border-radius: 0 !important; background-image: ${field}, ${face} !important; }
${T(['#settings .admin_lbl', '#settings .title1'])} { color: ${goldLight} !important; text-shadow: 0 2px 2px #000000, 0 0 12px ${alpha(gold, 0.45)} !important; }

/* ---- Pop-up buttons, panel title plates ---- */
${pop('ok_btn')} { content: ${U(popBtn('OK', false, true))} !important; }
${pop('yes_btn')} { content: ${U(popBtn('Yes', false, true))} !important; }
${pop('no_btn')} { content: ${U(popBtn('No', false, false))} !important; }
${pop('cancel_btn')} { content: ${U(popBtn('Cancel', true, false))} !important; }
${T(['#content .ok_btn:hover img', '#content .yes_btn:hover img', '#content .no_btn:hover img', '#content .cancel_btn:hover img'])} { filter: drop-shadow(0 0 5px ${alpha(gold, 0.9)}) !important; }
${titles} { background: ${t.surface} !important; box-shadow: 0 0 0 .3em ${t.surface} !important; border-radius: .1em; }
${T(['#duel_room .format .format_txt'])} { background: linear-gradient(90deg, transparent 16%, ${t.surface} 24% 76%, transparent 84%) !important; box-shadow: none !important; }
${T(['#duel_room .format_txt::before', '#duel_room span.arial_black2::before', '#settings .admin_lbl::before', '#content .title1::before'])} { content: ""; position: absolute; left: 50%; top: -8px; bottom: -8px; width: 260px; margin-left: -130px; pointer-events: none; background: ${U(orbit(true, 300, 70))} center / 100% 100% no-repeat; opacity: .75; }
/* The page title's orbit runs wide, its two units out at the ends, clear of the word. */
${T(['#content .title1::before'])} { width: 340px; margin-left: -170px; opacity: .55; background-image: ${U(orbit(true, 340, 70, [[0.035, 0.5], [0.965, 0.5]]))}; }

/* ---- Backdrop: a random scatter of small sparkles instead of the even grid ---- */
html body #dbte-skin-motif { background: ${U(sparkleField)} 0 0 / 600px 600px repeat !important; }
html body #dbte-skin-motif::before { background: none !important; }
/* Main menu: the galaxy's tilted ring circled a feed timestamp; it slides out right past the timestamps and its orbiting units go. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-xy-gal { transform: translateX(210px); }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-xy-units { display: none; }

/* ---- Scrollbars ---- */
${T(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${goldDeep}, ${gold}, ${goldDeep}) !important; border-radius: 1px !important; }
${T(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: ${goldLight} !important; }
`;
  return `html body { ${[...ids].map(([s, id]) => `${id}: ${url(s)};`).join(' ')} }
${css.replace(/\/\*[^*]*\*\//g, '').replace(/\n\s+/g, '\n')}`;
};
