// Cyber Dragon: machined chrome. Chamfered bezels lit from above, riveted
// corner gussets, segmented hull plating (the serpent's body rings) and a
// cyan photon core set into every frame that lights up on hover.

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
  const steel = mix(t.raised, t.bg, 0.35);
  const plateDark = mix(t.border, t.bg, 0.55);

  // Brushed chrome, lit from the top: white rim, bright band, dark waist.
  const chromeGrad = (id, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="${y2}"><stop offset="0" stop-color="#ffffff"/><stop offset=".16" stop-color="${t.text}"/><stop offset=".48" stop-color="${t.muted}"/><stop offset=".53" stop-color="${t.border}"/><stop offset=".8" stop-color="${t.muted}"/><stop offset="1" stop-color="${t.text}"/></linearGradient>`;
  const rivet = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${t.border}"/><circle cx="${x - r * 0.2}" cy="${y - r * 0.25}" r="${r * 0.62}" fill="url(#rv)"/>`;

  // 9-slice chrome bezel: 48 box, `s` slice, chamfer `c`, band `b`, riveted gussets.
  const bezel = (s, c, b, rv = true) => {
    const e = 48;
    const k = c - 1;
    const outer = `M${c} 0H${e - c}L${e} ${c}V${e - c}L${e - c} ${e}H${c}L0 ${e - c}V${c}Z`;
    const inner = `M${b + k} ${b}H${e - b - k}L${e - b} ${b + k}V${e - b - k}L${e - b - k} ${e - b}H${b + k}L${b} ${e - b - k}V${b + k}Z`;
    const gusset = `<path d="M${c} 0H${s}L0 ${s}V${c}Z" fill="url(#m)" stroke="${t.bg}" stroke-width=".6"/>${rv ? rivet(s * 0.37, s * 0.37, s * 0.15) : ''}`;
    return svg(e, e, `<defs>${chromeGrad('m')}<radialGradient id="rv" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="${t.muted}"/><stop offset="1" stop-color="${t.border}"/></radialGradient></defs>
<path d="${outer}${inner}" fill="url(#m)" fill-rule="evenodd"/><path d="${outer}" fill="none" stroke="${t.bg}" stroke-width=".8"/><path d="${inner}" fill="none" stroke="${t.bg}" stroke-width="1"/><path d="${inner}" fill="none" stroke="${t.accent}" stroke-opacity=".35" stroke-width=".5" transform="translate(0 .9)"/>
<g id="g">${gusset}</g><use href="#g" transform="translate(${e} 0) scale(-1 1)"/><use href="#g" transform="translate(0 ${e}) scale(1 -1)"/><use href="#g" transform="translate(${e} ${e}) scale(-1 -1)"/>`);
  };
  const chamfer = (c) => `polygon(${c}px 0, calc(100% - ${c}px) 0, 100% ${c}px, 100% calc(100% - ${c}px), calc(100% - ${c}px) 100%, ${c}px 100%, 0 calc(100% - ${c}px), 0 ${c}px)`;

  // The photon core: a cut cyan gem in a chrome setting.
  const core = (color, lit) =>
    svg(40, 20, `<defs><radialGradient id="c" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="${color}"/><stop offset="1" stop-color="${mix(color, t.bg, 0.6)}"/></radialGradient></defs>
${lit ? `<ellipse cx="20" cy="10" rx="19" ry="9" fill="${color}" opacity=".28"/>` : ''}<path d="M4 10L11 3H29L36 10L29 17H11Z" fill="${t.border}" stroke="${t.bg}" stroke-width=".8"/><path d="M5.5 10L11.6 4.2H28.4L34.5 10" fill="none" stroke="#ffffff" stroke-opacity=".6" stroke-width=".7"/>
<path d="M9 10L14 6H26L31 10L26 14H14Z" fill="url(#c)" opacity="${lit ? 1 : 0.7}"/><path d="M14 6L20 10L26 6M14 14L20 10L26 14" fill="none" stroke="#ffffff" stroke-opacity=".45" stroke-width=".5"/>`);

  // Hull plating: vertical seams every `w` px plus a fine brushed grain.
  const plating = (w, a = 0.5) =>
    `repeating-linear-gradient(90deg, transparent 0 ${w - 2}px, ${alpha(t.bg, a)} ${w - 2}px ${w - 1}px, ${alpha('#ffffff', a * 0.12)} ${w - 1}px ${w}px), repeating-linear-gradient(0deg, ${alpha('#ffffff', 0.018)} 0 1px, transparent 1px 3px)`;
  // Segmented hull plates: each plate lit on its left edge, shadowed on its right.
  const plates = (w) => `repeating-linear-gradient(90deg, ${alpha('#ffffff', 0.1)} 0 1px, transparent 1px ${w - 6}px, ${alpha(t.bg, 0.25)} ${w - 6}px ${w - 2}px, ${alpha(t.bg, 0.85)} ${w - 2}px ${w}px), repeating-linear-gradient(0deg, ${alpha('#ffffff', 0.018)} 0 1px, transparent 1px 3px)`;
  // The top rail: three chrome segments with cut ends (stretched to the tile width).
  const rail = svg(300, 10, `<defs>${chromeGrad('r')}</defs>${[[2, 96], [102, 196], [202, 296]].map(([x0, x1]) => `<path d="M${x0 + 4} 0H${x1 - 4}L${x1} 5L${x1 - 4} 10H${x0 + 4}L${x0} 5Z" fill="url(#r)" stroke="${t.bg}" stroke-width=".8"/>`).join('')}`).replace('<svg ', '<svg preserveAspectRatio="none" ');
  const sheen = `linear-gradient(180deg, ${alpha('#ffffff', 0.09)}, transparent 38%, ${alpha(t.bg, 0.35)})`;

  const tileFrame = U(bezel(13, 6, 4));
  const panelFrame = U(bezel(14, 7, 3.5));
  const slimFrame = U(bezel(10, 4, 2.4, false));

  const T = (list) => sel(list);
  const tileBefore = T(['#main_menu .menu_btn .content::before']);
  const tileHoverBefore = T(['#main_menu .menu_btn:hover .content::before']);
  const LOBBY = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const lobby = (suffix = '') => T(LOBBY.map((x) => `#duel_room ${x}${suffix}`));
  const SETTINGS = ['about_me', 'preferences', 'social_media', 'animation', 'profile_song', 'account', 'messages', 'duel_stats', 'profile_comments'];
  const settings = T(SETTINGS.map((x) => `#content #settings_content > div.${x}`));
  const dialogBefore = T(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d}::before`));
  const dialogAfter = T(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d}::after`));
  const dialogBody = T(['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'].map((d) => `#content ${d} .body_txt`));

  // Pop-up buttons (DuelingBook draws them as images): the primary is a polished
  // chrome slab with a lit core line, the secondary dark steel in a chrome rim.
  const FONT = 'Segoe UI,Arial,sans-serif';
  const popBtn = (label, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    const body = primary ? 'url(#m)' : 'url(#d)';
    return svg(w, h, `<defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="${t.text}"/><stop offset="1" stop-color="${t.muted}"/></linearGradient><linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.raised, t.text, 0.12)}"/><stop offset="1" stop-color="${steel}"/></linearGradient></defs><path d="M14 10H${w - 14}L${w - 6} 18V${h - 18}L${w - 14} ${h - 10}H14L6 ${h - 18}V18Z" fill="${body}" stroke="${primary ? t.bg : t.muted}" stroke-width="2"/><path d="M20 ${h - 15}H${w - 20}" stroke="${t.accent}" stroke-width="3" stroke-opacity="${primary ? 1 : 0.5}"/><text x="${w / 2}" y="38.5" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${primary ? t.bg : t.text}">${label}</text>`);
  };
  const pop = (name) => T([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const titles = T(['#duel_room .format_txt', '#duel_room span.arial_black2', '#settings .admin_lbl']);

  const css = `
/* ---- Menu tiles: riveted chrome bezel, hull plating, photon core in the top rail ---- */
${SEL.tile} {
  background: ${sheen}, ${plates(34)}, linear-gradient(180deg, ${t.raised}, ${steel}) !important;
  border-color: transparent !important;
  border-image: ${tileFrame} 13 / 13px / 0 stretch !important;
  border-radius: 0 !important;
  clip-path: ${chamfer(6)};
  box-shadow: inset 0 0 18px ${alpha(t.bg, 0.6)} !important;
  transition: background-color .15s, box-shadow .2s;
}
${tileBefore} {
  content: ""; position: absolute; left: 50%; top: 0; width: 34px; height: 17px; margin-left: -17px; pointer-events: none;
  background: ${U(core(t.accent, true))} center / 100% 100% no-repeat; z-index: 1; opacity: .8; animation: dbte-cd-core 2.8s ease-in-out infinite;
}
${T(['#main_menu .menu_btn .content::after', '#main_menu .menu_btn:hover .content::after'])} {
  content: ""; position: absolute; left: 7px; right: 7px; top: 0; bottom: auto; height: 6px; pointer-events: none;
  background: ${U(rail)} 0 0 / 100% 100% no-repeat;
}
${SEL.tileHover} {
  background: ${sheen}, ${plates(34)}, linear-gradient(180deg, ${mix(t.raised, t.accent, 0.12)}, ${steel}) !important;
  transform: none;
  box-shadow: inset 0 0 18px ${alpha(t.bg, 0.5)}, inset 0 -3px 0 ${alpha(t.accent, 0.55)}, inset 0 -14px 18px -12px ${alpha(t.accent, 0.5)} !important;
}
${tileHoverBefore} { opacity: 1; animation-duration: 1.1s; }
@keyframes dbte-cd-core { 0%, 100% { opacity: .62; } 50% { opacity: 1; } }
${T(['#main_menu .menu_btn:active .content'])} {
  background: ${plates(34)}, linear-gradient(180deg, ${steel}, ${t.raised}) !important;
  box-shadow: inset 0 3px 8px ${alpha('#000000', 0.6)}, inset 0 -2px 0 ${t.accent} !important;
}
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 -1px 0 ${alpha('#ffffff', 0.12)} !important; }
${T(['#main_menu .menu_btn.dbte-small-menu .content'])} { border-image: ${slimFrame} 10 / 6px / 0 stretch !important; clip-path: none; }
${T(['#main_menu .menu_btn.dbte-small-menu .content::before', '#main_menu .menu_btn.dbte-small-menu .content::after'])} { content: none; }
${T(['#main_menu .main_menu_circle'])} { border-color: ${t.muted} !important; }
${T(['#main_menu .main_menu_circle .background'])} { background: radial-gradient(circle at 40% 35%, #ffffff, ${t.accent} 45%, ${mix(t.accent, t.bg, 0.5)}) !important; }

/* ---- Buttons: dark steel slabs, chrome rim, rivet at each end, core light on hover ---- */
${SEL.button}, ${T(['#content #settings_content > div.button'])}, ${T(['#content .combobox'])} {
  background:
    linear-gradient(90deg, ${t.border} 0 1px, ${t.text} 1px 2px, ${t.muted} 2px 4px, ${t.bg} 4px 5px, transparent 5px calc(100% - 5px), ${t.bg} calc(100% - 5px) calc(100% - 4px), ${t.muted} calc(100% - 4px) calc(100% - 2px), ${t.text} calc(100% - 2px) calc(100% - 1px), ${t.border} calc(100% - 1px)),
    linear-gradient(180deg, ${mix(t.raised, t.text, 0.1)}, ${t.raised} 45%, ${steel}) !important;
  border-color: ${t.muted} !important;
  border-radius: 2px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.32)}, inset 0 -1px 0 ${alpha(t.bg, 0.8)}, 0 2px 4px -1px ${alpha('#000000', 0.7)} !important;
}
${T(['#content .combobox'])} { background: linear-gradient(180deg, ${mix(t.raised, t.text, 0.1)}, ${t.raised} 45%, ${steel}) !important; }
${SEL.buttonHover}, ${T(['#content #settings_content > div.button:hover'])}, ${T(['#content .combobox:hover', '#content .combobox.combobox_selected'])} {
  background:
    linear-gradient(90deg, ${t.border} 0 1px, #ffffff 1px 2px, ${t.accent} 2px 4px, ${t.bg} 4px 5px, transparent 5px calc(100% - 5px), ${t.bg} calc(100% - 5px) calc(100% - 4px), ${t.accent} calc(100% - 4px) calc(100% - 2px), #ffffff calc(100% - 2px) calc(100% - 1px), ${t.border} calc(100% - 1px)),
    linear-gradient(180deg, ${mix(t.raised, t.accent, 0.22)}, ${mix(t.raised, t.accent, 0.08)} 50%, ${steel}) !important;
  border-color: ${t.accent} !important;
  box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.4)}, inset 0 -2px 0 ${t.accent}, 0 0 8px -2px ${t.accent} !important;
}
${SEL.buttonDown}, ${T(['#content #settings_content > div.button:active'])} {
  background: linear-gradient(180deg, ${steel}, ${mix(t.raised, t.accent, 0.18)}) !important;
  border-color: ${t.accent} !important;
  box-shadow: inset 0 2px 5px ${alpha('#000000', 0.75)}, inset 0 -1px 0 ${t.accent} !important;
}
${T(['#content .combobox .combobox_line'])} { background-color: ${t.muted} !important; box-shadow: 1px 0 0 ${t.bg}; }

/* ---- Text fields: recessed steel slots ---- */
${SEL.field} {
  background-color: ${mix(t.bg, t.surface, 0.4)} !important;
  background-image: linear-gradient(180deg, ${alpha('#000000', 0.45)}, transparent 40%) !important;
  border-color: ${t.border} !important;
  border-radius: 1px !important;
  box-shadow: inset 0 1px 2px ${alpha('#000000', 0.7)}, 0 1px 0 ${alpha('#ffffff', 0.14)} !important;
  color: ${t.text} !important;
}
${T(['#content input[type=text]:focus', '#content input[type=password]:focus', '#content textarea:focus'])} {
  outline: 1px solid ${t.accent} !important; box-shadow: inset 0 1px 2px ${alpha('#000000', 0.7)}, 0 0 6px ${alpha(t.accent, 0.6)} !important;
}

/* ---- Pop-ups: heavy riveted bezel, core crest, plated body ---- */
${SEL.dialog} {
  background: ${sheen}, ${plating(48, 0.35)}, linear-gradient(180deg, ${t.raised}, ${t.surface} 30%) !important;
  border-radius: 0 !important;
  box-shadow: 0 0 0 2px ${alpha(t.bg, 0.9)}, 0 24px 50px -14px ${alpha('#000000', 0.85)} !important;
}
${dialogAfter} {
  content: ""; position: absolute; inset: -3px; pointer-events: none; z-index: 1;
  border: 16px solid transparent; border-image: ${panelFrame} 14 / 16px / 0 stretch;
}
${dialogBefore} {
  content: ""; position: absolute; left: 50%; top: -12px; width: 56px; height: 28px; margin-left: -28px;
  background: ${U(core(t.accent, true))} center / 100% 100% no-repeat; pointer-events: none; z-index: 2;
}
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 10px ${alpha(t.accent, 0.45)} !important; }
${dialogBody} { color: ${t.text} !important; }

/* ---- Chat: chrome header rail with a core, plated window ---- */
${SEL.chatTop} {
  background:
    linear-gradient(180deg, ${mix(t.border, t.text, 0.25)}, ${t.border} 18%, ${plateDark} 55%, ${mix(t.border, t.bg, 0.3)}) !important;
  border-radius: 3px 3px 0 0 !important;
  box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.55)}, inset 0 -1px 0 ${t.bg}, inset 0 -3px 0 ${alpha(t.accent, 0.7)} !important;
}
${T(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg} !important; }
${SEL.chat} {
  background: ${plating(48, 0.3)}, linear-gradient(180deg, ${t.surface}, ${steel}) !important;
  box-shadow: inset 2px 0 0 ${t.border}, inset -2px 0 0 ${t.border}, inset 0 -2px 0 ${t.border}, inset 3px 0 0 ${alpha('#ffffff', 0.08)} !important;
}
${T(['#chats .chat .black_line'])} { background-color: ${t.border} !important; }

/* ---- Duel: chrome LP capsule with segmented charge, chrome phase rings with photon cores ---- */
${SEL.life} {
  border-color: transparent !important;
  border-image: ${slimFrame} 10 / 7px / 1px stretch !important;
  border-radius: 0 !important;
  box-shadow: 0 0 0 1px ${alpha(t.bg, 0.8)}, 0 4px 10px -2px ${alpha('#000000', 0.7)} !important;
}
${T(['#duel .lifepoints .life_bar'])} { border-radius: 2px !important; }
${SEL.lifeSelf} {
  background: repeating-linear-gradient(90deg, transparent 0 13px, ${alpha(t.bg, 0.55)} 13px 15px), linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 45%, ${alpha(t.bg, 0.25)}), linear-gradient(180deg, ${alpha(t.accent, 0.8)} 0 2px, transparent 2px), linear-gradient(90deg, ${mix(t.self, '#ffffff', 0.2)}, ${t.self} 55%, ${mix(t.self, t.accent, 0.6)} 85%, ${t.accent}) !important;
}
${SEL.lifeOpp} {
  background: repeating-linear-gradient(90deg, transparent 0 13px, ${alpha(t.bg, 0.55)} 13px 15px), linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 45%, ${alpha(t.bg, 0.25)}), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.45)}, ${t.opp}) !important;
}
${T(['#duel .lifepoints .black_bar'])} { background: ${plating(15, 0.35)}, ${mix(t.bg, '#000000', 0.3)} !important; }
${T(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 4px ${t.bg}, 0 0 8px ${alpha(t.bg, 0.9)} !important; }
${SEL.phase} {
  background: conic-gradient(from 20deg, ${t.text}, ${t.border} 18%, #ffffff 30%, ${t.muted} 45%, ${t.border} 60%, ${t.text} 75%, ${t.border} 88%, ${t.text}) !important;
  box-shadow: 0 0 0 1px ${t.bg}, 0 3px 8px ${alpha('#000000', 0.7)} !important;
}
${T(['#duel .phase .background .background_top'])} { background: transparent !important; }
${T(['#duel .phase .background .background_inner'])} { background: ${t.bg} !important; }
${T(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} {
  background: radial-gradient(circle at 50% 38%, ${t.raised}, ${steel} 60%, ${t.bg}) !important;
  box-shadow: inset 0 0 0 1px ${alpha('#ffffff', 0.12)} !important;
}
${T(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 42%, #ffffff 0 6%, ${t.accent} 30%, ${mix(t.accent, t.bg, 0.45)} 72%, ${t.bg}) !important; box-shadow: 0 0 0 2px ${t.accent}, 0 0 18px ${alpha(t.accent, 0.9)} !important; }
${T(['#duel .phase span'])} { color: #ffffff !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 3px ${t.bg} !important; }
${T(['#duel .phase.active span'])} { color: ${t.accentText} !important; text-shadow: 0 0 3px ${alpha('#ffffff', 0.8)} !important; }
/* Chat speakers: your name in photon cyan, the opponent's in warning amber. */
${T(['#duel .cout_txt font[color="#FF0000" i]', '#duel .cout_txt font[color="red" i]'])} { color: ${t.accent} !important; }
${T(['#duel .cout_txt font[color="#0000FF" i]', '#duel .cout_txt font[color="#0012ff" i]', '#duel .cout_txt font[color="blue" i]'])} { color: ${t.accent2} !important; }
${T(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} {
  background: linear-gradient(180deg, #ffffff, ${t.text} 20%, ${t.muted} 50%, ${t.border} 55%, ${t.muted}) !important;
}
${T(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${t.raised}, ${t.bg}) !important; }
${T(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${t.border}, inset 0 2px 0 ${alpha('#ffffff', 0.1)} !important; }

/* ---- Duel room: chrome-ringed bays with riveted corner gussets ---- */
${lobby()} { background-color: ${alpha(t.surface, 0.82)} !important; background-image: ${plating(48, 0.25)} !important; }
${lobby('::before')} {
  filter: none !important;
  background: linear-gradient(180deg, #ffffff, ${t.text} 8%, ${t.muted} 40%, ${t.border} 52%, ${t.muted} 75%, ${t.text}) !important;
}
${T(['#duel_room #formats .format:hover > .border::before'])} {
  background: linear-gradient(180deg, #ffffff, ${t.accent} 12%, ${t.muted} 45%, ${t.border} 55%, ${t.accent}) !important;
}
${lobby('::after')} {
  content: ""; position: absolute; inset: -3px; pointer-events: none;
  border: 16px solid transparent; border-image: ${U(bezel(14, 7, 0.01))} 14 / 16px / 0 stretch;
}
${T(['#duel_room .format_txt', '#duel_room span.arial_black2'])} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 12px ${alpha(t.accent, 0.35)} !important; }
${T(['#duel_room .duelbutton .background'])} { background: linear-gradient(180deg, ${t.raised}, ${steel}) !important; }
${T(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(180deg, ${mix(t.raised, t.accent, 0.18)}, ${steel}) !important; }
${T(['#duel_room .duelbutton'])} { border-color: ${plateDark} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.08)}; }

/* ---- Deck constructor: plated hull bays, chrome rails ---- */
${T(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg'])} {
  background-image: ${plating(54, 0.3)}, linear-gradient(180deg, ${alpha('#ffffff', 0.05)}, transparent 30%) !important;
  box-shadow: inset 0 0 0 1px ${t.muted}, inset 0 0 0 3px ${t.bg}, inset 0 2px 0 3px ${alpha('#ffffff', 0.1)} !important;
}
${T(['#deck_constructor #search .search_bg'])} {
  background: ${sheen}, ${plating(48, 0.25)}, ${alpha(t.surface, 0.9)} !important;
  box-shadow: inset 0 0 0 1px ${t.muted}, inset 0 0 0 3px ${t.bg}, inset 0 3px 0 3px ${alpha(t.accent, 0.5)} !important;
}
${T(['#deck_constructor #search .title_txt'])} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 12px ${alpha(t.accent, 0.4)} !important; }
${T(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 0.9; text-shadow: 0 2px 0 ${t.bg} !important; }

/* ---- Settings plates ---- */
${settings} {
  border-color: transparent !important;
  border-image: ${panelFrame} 14 / 14px / 0 stretch !important;
  border-radius: 0 !important;
  background-image: ${sheen}, ${plating(48, 0.25)} !important;
}
${T(['#settings .admin_lbl', '#settings .title1'])} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 12px ${alpha(t.accent, 0.35)} !important; }

/* ---- Pop-up buttons, panel title plates ---- */
${pop('ok_btn')} { content: ${U(popBtn('OK', false, true))} !important; }
${pop('yes_btn')} { content: ${U(popBtn('Yes', false, true))} !important; }
${pop('no_btn')} { content: ${U(popBtn('No', false, false))} !important; }
${pop('cancel_btn')} { content: ${U(popBtn('Cancel', true, false))} !important; }
${T(['#content .ok_btn:hover img', '#content .yes_btn:hover img', '#content .no_btn:hover img', '#content .cancel_btn:hover img'])} { filter: drop-shadow(0 0 5px ${alpha(t.accent, 0.9)}) !important; }
${titles} { background: ${t.surface} !important; box-shadow: 0 0 0 .3em ${t.surface} !important; border-radius: .15em; }
${T(['#deck_constructor .deck_bg', '#siding .deck_bg'])} { background-color: ${mix(t.surface, t.bg, 0.25)} !important; }
${T(['#duel_room .format .format_txt'])} { background: linear-gradient(90deg, transparent 16%, ${t.surface} 24% 76%, transparent 84%) !important; box-shadow: none !important; }

@media (prefers-reduced-motion: reduce) { html body .menu_btn .content::before { animation: none !important; } }

/* ---- Scrollbars: chrome rods ---- */
${T(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${t.border}, ${t.text} 40%, ${t.muted} 70%, ${t.border}) !important; border-radius: 2px !important; }
${T(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: linear-gradient(90deg, ${t.border}, #ffffff 40%, ${t.accent} 70%, ${t.border}) !important; }

/* ---- Duel: the dim chrome serpent shows in the left gutter ---- */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-cd-gutter { display: inline; }
`;
  return `html body { ${[...ids].map(([s, id]) => `${id}: ${url(s)};`).join(' ')} }
${css.replace(/\/\*[^*]*\*\//g, '').replace(/\n\s+/g, '\n')}`;
};
