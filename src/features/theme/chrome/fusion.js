// Fusion: Polymerization. Violet Fusion frames whose edges run from violet
// into pink and meet in the middle (two materials merging), a two-armed
// vortex behind every panel, swirl ornaments on the corners.

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
  const vi = t.accent;
  const pk = t.accent2;
  const merge = mix(vi, pk, 0.5);
  const deep = mix(t.surface, t.bg, 0.4);
  const plum = mix(vi, t.bg, 0.62);

  // A two-armed spiral: one arm violet, one pink, wound into one centre.
  const arm = (cx, cy, turns, r0, rot) => {
    let d = '';
    const n = 70;
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const a = rot + f * turns * Math.PI * 2;
      const r = r0 * (1 - f * 0.92);
      d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
    }
    return d;
  };
  const swirl = (size, o = 1, w = 2.2) =>
    svg(size, size, `<g fill="none" stroke-linecap="round" opacity="${o}"><path d="${arm(size / 2, size / 2, 1.35, size * 0.46, 0)}" stroke="${vi}" stroke-width="${w}"/><path d="${arm(size / 2, size / 2, 1.35, size * 0.46, Math.PI)}" stroke="${pk}" stroke-width="${w}"/></g><circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.07}" fill="#ffffff" opacity="${o * 0.85}"/>`);
  // Big faint vortex for panel backgrounds.
  const vortex = (o) => `radial-gradient(circle at 50% 50%, ${alpha('#ffffff', o * 0.35)} 0 2%, transparent 30%), conic-gradient(from 0deg at 50% 50%, ${alpha(vi, o)}, transparent 22%, ${alpha(pk, o)} 50%, transparent 72%, ${alpha(vi, o)})`;
  const corner = (s) => ['left top', 'right bottom'].map((p) => `${U(swirl(48, 1, 3.5))} ${p} / ${s}px no-repeat`).join(', ');
  // Merging edge: violet from the left, pink from the right, white where they meet.
  const edge = `linear-gradient(90deg, ${vi}, ${merge} 42%, ${mix(merge, '#ffffff', 0.5)} 50%, ${merge} 58%, ${pk})`;
  const face = `linear-gradient(180deg, ${alpha('#ffffff', 0.06)}, transparent 35%, ${alpha(t.bg, 0.35)})`;
  // 9-slice: rounded merging frame (horizontal gradient survives stretching).
  const frame = (b, r) =>
    svg(48, 48, `<defs><linearGradient id="e"><stop offset="0" stop-color="${vi}"/><stop offset=".5" stop-color="${merge}"/><stop offset="1" stop-color="${pk}"/></linearGradient></defs><path d="M${r} 0H${48 - r}A${r} ${r} 0 0 1 48 ${r}V${48 - r}A${r} ${r} 0 0 1 ${48 - r} 48H${r}A${r} ${r} 0 0 1 0 ${48 - r}V${r}A${r} ${r} 0 0 1 ${r} 0ZM${b + r * 0.6} ${b}A${r * 0.6} ${r * 0.6} 0 0 0 ${b} ${b + r * 0.6}V${48 - b - r * 0.6}A${r * 0.6} ${r * 0.6} 0 0 0 ${b + r * 0.6} ${48 - b}H${48 - b - r * 0.6}A${r * 0.6} ${r * 0.6} 0 0 0 ${48 - b} ${48 - b - r * 0.6}V${b + r * 0.6}A${r * 0.6} ${r * 0.6} 0 0 0 ${48 - b - r * 0.6} ${b}Z" fill="url(#e)" fill-rule="evenodd"/><rect x="${b + 1.5}" y="${b + 1.5}" width="${45 - 2 * b}" height="${45 - 2 * b}" rx="${r * 0.4}" fill="none" stroke="#ffffff" stroke-opacity=".18" stroke-width=".7"/>`);

  const tileFrame = U(frame(3, 9));
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const dlg = (suffix = '') => T(DIALOGS.map((d) => `#content ${d}${suffix}`));
  const LOBBY = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const lobby = (suffix = '') => T(LOBBY.map((x) => `#duel_room ${x}${suffix}`));
  const DECK = ['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg'];
  const SETTINGS = ['about_me', 'preferences', 'social_media', 'animation', 'profile_song', 'account', 'messages', 'duel_stats', 'profile_comments'];
  const settings = T(SETTINGS.map((x) => `#settings .${x}`));

  const css = `
/* ---- Menu tiles: merging Fusion frame over a slow two-colour vortex ---- */
${SEL.tile} {
  background: ${face}, ${vortex(0.16)}, linear-gradient(180deg, ${mix(t.raised, vi, 0.1)}, ${deep}) !important;
  border-color: transparent !important;
  border-image: ${tileFrame} 12 / 10px / 0 stretch !important;
  border-radius: 9px !important;
  overflow: hidden;
  box-shadow: 0 10px 24px -12px ${alpha('#000000', 0.9)} !important;
}
${T(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; left: 50%; top: 50%; width: 120px; height: 120px; margin: -60px 0 0 -60px; pointer-events: none;
  background: ${U(swirl(120, 0.22, 2))} center / 100% no-repeat; transition: transform 1.4s cubic-bezier(.2,.7,.2,1), opacity .3s;
}
${T(['#main_menu .menu_btn:hover .content::before'])} { transform: rotate(160deg); opacity: 1; background-image: ${U(swirl(120, 0.5, 2.4))}; }
${SEL.tileHover} {
  background: ${face}, ${vortex(0.3)}, linear-gradient(180deg, ${mix(t.raised, vi, 0.22)}, ${deep}) !important;
  transform: none;
  box-shadow: 0 0 22px -6px ${alpha(merge, 0.9)} !important;
}
${T(['#main_menu .menu_btn:active .content'])} { background: ${vortex(0.4)}, linear-gradient(180deg, ${deep}, ${mix(t.raised, vi, 0.2)}) !important; box-shadow: inset 0 3px 10px ${alpha('#000000', 0.7)} !important; }
${SEL.tileLabel} { color: #ffffff !important; text-shadow: 0 2px 2px ${t.bg}, 0 0 12px ${alpha(merge, 0.5)} !important; }
${T(['#main_menu .menu_btn.dbte-small-menu .content::before'])} { content: none; }
${T(['#main_menu .main_menu_circle .background'])} { background: ${edge} !important; }

/* ---- Buttons: violet capsules with a merging underline; hover fuses them ---- */
${SEL.button} {
  background: linear-gradient(0deg, ${vi} 0 1px, transparent 1px) left bottom / 50% 100% no-repeat, linear-gradient(0deg, ${pk} 0 1px, transparent 1px) right bottom / 50% 100% no-repeat, linear-gradient(180deg, ${mix(t.raised, vi, 0.2)}, ${t.raised} 55%, ${deep}) !important;
  border-color: ${mix(t.border, vi, 0.35)} !important;
  border-radius: 7px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.14)}, 0 2px 6px -2px ${alpha('#000000', 0.8)} !important;
}
${SEL.buttonHover} {
  background: linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 50%), linear-gradient(90deg, ${vi}, ${merge} 50%, ${pk}) !important;
  border-color: ${mix(merge, '#ffffff', 0.4)} !important;
  color: ${t.accentText} !important;
  box-shadow: 0 0 12px -2px ${alpha(merge, 0.9)} !important;
}
${SEL.buttonDown} { background: linear-gradient(90deg, ${mix(vi, t.bg, 0.2)}, ${mix(pk, t.bg, 0.2)}) !important; border-color: ${merge} !important; color: ${t.accentText} !important; box-shadow: inset 0 2px 5px ${alpha(t.bg, 0.8)} !important; }
${T(['#content .combobox'])} { background: linear-gradient(180deg, ${mix(t.raised, vi, 0.15)}, ${deep}) !important; border-color: ${mix(t.border, vi, 0.35)} !important; border-radius: 7px !important; }
${T(['#content .combobox:hover', '#content .combobox.combobox_selected'])} { border-color: ${pk} !important; box-shadow: 0 0 8px -2px ${merge} !important; }
${T(['#content .combobox .combobox_line'])} { background: linear-gradient(180deg, ${vi}, ${pk}) !important; }

/* ---- Text fields ---- */
${SEL.field} {
  background-color: ${mix(t.bg, t.surface, 0.5)} !important;
  background-image: linear-gradient(0deg, ${vi} 0 1px, transparent 1px), linear-gradient(0deg, ${pk} 0 1px, transparent 1px) !important;
  background-size: 50% 100%, 50% 100% !important; background-position: left bottom, right bottom !important; background-repeat: no-repeat !important;
  border-color: ${mix(t.border, vi, 0.3)} !important;
  border-radius: 4px !important;
  box-shadow: inset 0 1px 3px ${alpha('#000000', 0.55)} !important;
  color: ${t.text} !important;
}
${T(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} { outline: 1px solid ${pk} !important; box-shadow: 0 0 8px ${alpha(merge, 0.6)} !important; }

/* ---- Pop-ups: the Polymerization vortex behind a merging frame, swirl corners ---- */
${dlg()} {
  background: ${face}, ${vortex(0.14)}, linear-gradient(180deg, ${mix(t.surface, vi, 0.12)}, ${deep}) !important;
  border-radius: 14px !important;
  box-shadow: 0 0 0 2px ${t.bg}, 0 0 34px -6px ${alpha(merge, 0.6)}, 0 24px 50px -14px ${alpha('#000000', 0.9)} !important;
}
${dlg('::after')} { content: ""; position: absolute; inset: -3px; pointer-events: none; z-index: 1; border: 12px solid transparent; border-image: ${U(frame(3.5, 12))} 14 / 14px / 0 stretch; }
${dlg('::before')} { content: ""; position: absolute; inset: -12px; pointer-events: none; z-index: 2; background: ${corner(30)}; }
${SEL.dialogTitle} { color: #ffffff !important; text-shadow: 0 2px 2px ${t.bg}, 0 0 14px ${alpha(merge, 0.75)} !important; }
${dlg(' .body_txt')} { color: ${t.muted} !important; }

/* ---- Chat: the title bar is the merge ---- */
${SEL.chatTop} {
  background: ${U(swirl(48, 1, 4))} right 32px center / 18px no-repeat, linear-gradient(180deg, ${alpha('#ffffff', 0.12)}, transparent 55%), linear-gradient(90deg, ${mix(vi, t.bg, 0.4)}, ${mix(merge, t.bg, 0.45)} 50%, ${mix(pk, t.bg, 0.45)}) !important;
  border-radius: 9px 9px 0 0 !important;
  box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.2)}, inset 0 -2px 0 ${merge} !important;
}
${T(['#chats .chat .chat_top span'])} { color: #ffffff !important; text-shadow: 0 1px 2px ${t.bg} !important; }
${SEL.chat} { background: radial-gradient(ellipse at 50% 0%, ${alpha(vi, 0.14)}, transparent 60%), linear-gradient(180deg, ${t.surface}, ${deep}) !important; box-shadow: inset 2px 0 0 ${alpha(vi, 0.6)}, inset -2px 0 0 ${alpha(pk, 0.6)}, inset 0 -2px 0 ${alpha(merge, 0.5)} !important; }
${T(['#chats .chat .black_line'])} { background: linear-gradient(90deg, ${vi}, ${pk}) !important; }

/* ---- Duel: LP capsule ringed in the merge; phases as fusion vortices ---- */
${SEL.life} { border-color: ${merge} !important; border-radius: 15px !important; box-shadow: inset 0 0 0 1px ${t.bg}, 0 0 12px -2px ${alpha(merge, 0.8)} !important; }
${T(['#duel .lifepoints .life_border::before'])} { content: ""; position: absolute; left: -10px; top: 50%; width: 22px; height: 22px; margin-top: -11px; background: ${U(swirl(48, 1, 4.5))} center / 100% no-repeat; pointer-events: none; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, vi, 0.45)}, ${t.self} 70%) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, vi, 0.45)}, ${t.opp} 70%) !important; }
${T(['#duel .lifepoints .black_bar'])} { background: ${plum} !important; }
${T(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 0 3px ${t.bg}, 0 1px 0 ${t.bg}, 0 0 10px ${alpha(t.bg, 0.9)} !important; }
${SEL.phase} {
  background: conic-gradient(from 0deg, ${vi}, ${mix(vi, t.bg, 0.5)} 25%, ${pk} 50%, ${mix(pk, t.bg, 0.5)} 75%, ${vi}) !important;
  box-shadow: 0 0 0 1px ${t.bg}, 0 3px 8px ${alpha('#000000', 0.7)} !important;
}
${T(['#duel .phase .background .background_top'])} { background: transparent !important; }
${T(['#duel .phase .background .background_inner'])} { background: ${t.bg} !important; }
${T(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${vortex(0.22)}, radial-gradient(circle, ${t.raised}, ${deep}) !important; }
${T(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle, #ffffff 0 6%, transparent 30%), conic-gradient(from 0deg, ${t.self}, ${vi}, ${t.self}, ${pk}, ${t.self}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.8)} !important; }
${T(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle, #ffffff 0 6%, transparent 30%), conic-gradient(from 0deg, ${t.opp}, ${vi}, ${t.opp}, ${pk}, ${t.opp}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)} !important; }
${T(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 1px ${t.bg} !important; }
${T(['#duel .phase.active span'])} { color: #ffffff !important; text-shadow: 0 0 4px ${t.bg}, 0 1px 1px ${t.bg} !important; }
${T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${edge} !important; }
${T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${deep} !important; }
${T(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${mix(t.border, vi, 0.4)} !important; }

/* ---- Duel room: merging rings with swirl corners ---- */
${lobby()} { background-color: ${alpha(t.surface, 0.86)} !important; background-image: radial-gradient(ellipse at 100% 100%, ${alpha(pk, 0.12)}, transparent 50%), radial-gradient(ellipse at 0% 0%, ${alpha(vi, 0.14)}, transparent 50%) !important; }
${lobby('::before')} { background: ${edge} !important; }
${T(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(90deg, ${mix(vi, '#ffffff', 0.3)}, #ffffff 50%, ${mix(pk, '#ffffff', 0.3)}) !important; }
${lobby('::after')} { content: ""; position: absolute; inset: -9px; pointer-events: none; background: ${corner(22)}; }
${T(['#duel_room .format_txt', '#duel_room #host_lbl', '#duel_room .arial_black2'])} { color: #ffffff !important; text-shadow: 0 2px 2px ${t.bg}, 0 0 12px ${alpha(merge, 0.6)} !important; }
${T(['#duel_room .duelbutton .background'])} { background: linear-gradient(180deg, ${mix(t.raised, vi, 0.1)}, ${deep}) !important; }
${T(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${mix(t.raised, vi, 0.3)}, ${mix(t.raised, pk, 0.25)}) !important; }

/* ---- Deck constructor: violet bays edged in the merge ---- */
${T(DECK)} { background-image: ${face}, radial-gradient(ellipse at 50% 120%, ${alpha(merge, 0.16)}, transparent 60%) !important; box-shadow: inset 0 0 0 1px ${merge}, inset 0 0 0 3px ${alpha(t.bg, 0.8)}, inset 3px 0 0 3px ${alpha(vi, 0.5)}, inset -3px 0 0 3px ${alpha(pk, 0.5)} !important; }
${T(['#deck_constructor #search .search_bg::after'])} { content: ""; position: absolute; right: -8px; top: -8px; width: 34px; height: 34px; background: ${U(swirl(48, 1, 4))} center / 100% no-repeat; pointer-events: none; }
${T(['#deck_constructor #search .title_txt'])} { color: #ffffff !important; text-shadow: 0 2px 2px ${t.bg}, 0 0 14px ${alpha(merge, 0.7)} !important; }
${T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: #ffffff !important; text-shadow: 0 0 10px ${alpha(merge, 0.6)} !important; }

/* ---- Settings: merging frames ---- */
${settings} { border-color: transparent !important; border-image: ${tileFrame} 12 / 10px / 0 stretch !important; border-radius: 10px !important; background-image: ${face}, radial-gradient(ellipse at 100% 0%, ${alpha(pk, 0.12)}, transparent 55%) !important; }
${T(['#settings .admin_lbl', '#settings .title1'])} { color: #ffffff !important; text-shadow: 0 2px 2px ${t.bg}, 0 0 12px ${alpha(merge, 0.6)} !important; }

/* ---- Scrollbars ---- */
${T(['#content .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${vi}, ${pk}) !important; border-radius: 99px !important; }
${T(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: linear-gradient(180deg, ${mix(vi, '#ffffff', 0.3)}, ${mix(pk, '#ffffff', 0.3)}) !important; }

@media (prefers-reduced-motion: reduce) { html body .menu_btn .content::before { transition: none !important; transform: none !important; } }
`;
  return `html body { ${[...ids].map(([s, id]) => `${id}: ${url(s)};`).join(' ')} }
${css.replace(/\/\*[^*]*\*\//g, '').replace(/\n\s+/g, '\n')}`;
};
