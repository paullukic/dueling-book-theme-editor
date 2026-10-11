// Snake-Eye: ember flame and serpent scales. Warm charcoal plates laid with
// diamond serpent scales, ember flames licking up the foot of the pop-ups,
// a ring of scales round every phase (the active one opens into a slit-pupil
// eye), a serpent divider under titles and the Snake-Eye on the life bar.

import { mix } from '../../../lib/color.js';

const r1 = (v) => Math.round(v * 10) / 10;
const FONT = 'Segoe UI, system-ui, Roboto, Arial, sans-serif';

// Compact data URI: only the characters CSS and URLs need escaped.
const svgUrl = (text) => `url("data:image/svg+xml,${text.replace(/(\d\.\d)\d+/g, '$1').replace(/"/g, "'").replace(/[%#<>{}]/g, encodeURIComponent)}")`;

const flameGrad = (t, id) => `<linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${t.accent}"/><stop offset="0.55" stop-color="${t.accent2}"/><stop offset="1" stop-color="${t.accent2}" stop-opacity="0.2"/></linearGradient>`;

// One flame tongue standing on (0,0), h tall, leaning by `lean`.
const tongue = (h, w, lean) =>
  `M${-w} 0C${-w * 1.1} ${-h * 0.45} ${lean * 0.4} ${-h * 0.55} ${lean} ${-h}C${lean * 0.2 + w * 0.6} ${-h * 0.6} ${w * 1.2} ${-h * 0.4} ${w} 0Z`;

// Diamond serpent scales.
const scales = (t, kit) =>
  kit.svg(14, 18, `<path d="M7 0L14 9L7 18L0 9Z" fill="none" stroke="${t.accent2}" stroke-opacity="0.09" stroke-width="0.9"/><path d="M7 4Q9.5 9 7 13" fill="none" stroke="${t.accent}" stroke-opacity="0.07" stroke-width="0.8"/>`);

// A low wall of fire for the foot of a plate: overlapping, leaning tongues
// of uneven height, with smaller ember cores inside.
const flameRow = (t, kit) => {
  const hs = [9, 15, 7, 13, 10, 16, 8, 12];
  const outer = hs.map((h, i) => `<path transform="translate(${i * 10 + 5} 16)" d="${tongue(h, 5.6, i % 2 ? -2.5 : 3)}"/>`).join('');
  const inner = hs.map((h, i) => `<path transform="translate(${i * 10 + 5.5} 16)" d="${tongue(h * 0.55, 2.6, i % 2 ? -1.2 : 1.6)}"/>`).join('');
  return kit.svg(80, 16, `<defs>${flameGrad(t, 'f')}</defs><g fill="url(#f)" fill-opacity="0.75">${outer}</g><g fill="${t.accent2}" fill-opacity="0.55">${inner}</g>`);
};

// A ring of serpent scales round a phase button: two offset rows of
// overlapping rounded scales, each shaded dark to ember with a gold edge,
// between two smooth gold rims (lit: the active phase).
const scaleRing = (t, kit, lit) => {
  const scale = 'M-6.6 -3.5C-6.6 3 -3.6 6.6 0 7.2C3.6 6.6 6.6 3 6.6 -3.5Z';
  let sc = '';
  [[40.5, 0.5], [36, 0]].forEach(([r, off]) => {
    for (let i = 0; i < 18; i++) sc += `<use href="#s" transform="rotate(${r1(((i + off) * 360) / 18 + 180)} 50 50) translate(50 ${r1(50 + r)})"/>`;
  });
  const edge = lit ? t.accent2 : mix(t.accent2, t.bg, 0.3);
  return kit.svg(100, 100, `<defs><radialGradient id="g" cx="0.5" cy="0.2" r="0.9"><stop offset="0" stop-color="${mix(t.bg, t.accent, lit ? 0.7 : 0.4)}"/><stop offset="1" stop-color="${mix(t.bg, '#000000', 0.3)}"/></radialGradient><path id="s" d="${scale}"/></defs><circle cx="50" cy="50" r="41" fill="none" stroke="${mix(t.bg, '#000000', 0.3)}" stroke-width="13"/><g fill="url(#g)" stroke="${edge}" stroke-width="0.9" stroke-linejoin="round">${sc}</g><circle cx="50" cy="50" r="47.6" fill="none" stroke="${edge}" stroke-width="1.4"/><circle cx="50" cy="50" r="34.6" fill="none" stroke="${edge}" stroke-width="1.4"/>`);
};

// A band of crimson serpent scales with gold edges, for the foot of a plate.
const scaleBand = (t, kit) =>
  kit.svg(12, 10, `<path d="M6 0L12 5L6 10L0 5Z" fill="${mix(t.danger, t.bg, 0.45)}" stroke="${t.accent2}" stroke-opacity="0.75" stroke-width="0.8"/><path d="M6 2L9 5L6 6.4Z" fill="${t.accent2}" fill-opacity="0.35"/><path d="M0 0L6 0L0 5ZM12 0L6 0L12 5Z" fill="${mix(t.danger, t.bg, 0.6)}" stroke="${t.accent2}" stroke-opacity="0.5" stroke-width="0.6"/>`);

// Pop-up buttons: an ember plate, dark label, gold inset.
const POP = [['ok_btn', 'OK', 153.4, 78.47, true], ['yes_btn', 'Yes', 153.4, 78.47, true], ['no_btn', 'No', 153.4, 78.47, false], ['cancel_btn', 'Cancel', 234.85, 78.5, false]];
const popButton = (t, label, W, H, primary) => {
  const x = 8;
  const w = W - 16;
  const top = primary ? t.accent2 : t.raised;
  const bot = primary ? t.accent : mix(t.raised, t.bg, 0.5);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="${x}" y="10" width="${w}" height="58" rx="10" fill="url(#f)" stroke="${primary ? mix(t.accent, t.bg, 0.4) : mix(t.border, t.accent2, 0.45)}" stroke-width="2"/><rect x="${x + 4}" y="14" width="${w - 8}" height="50" rx="7" fill="none" stroke="${primary ? mix(t.accent2, '#ffffff', 0.4) : t.accent2}" stroke-opacity="${primary ? 0.9 : 0.5}" stroke-width="1.4"/><text x="${W / 2}" y="40" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${primary ? t.accentText : t.text}">${label}</text></svg>`;
};

// A serpent: a sinuous gold body with a head at the right.
const serpent = (t, kit) => {
  let d = 'M6 7';
  for (let x = 6; x < 214; x += 26) d += `Q${x + 6.5} ${2} ${x + 13} 7T${x + 26} 7`;
  return kit.svg(240, 14, `<path d="${d}" fill="none" stroke="${t.accent}" stroke-opacity="0.45" stroke-width="3.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${t.accent2}" stroke-width="1.4" stroke-linecap="round"/><path d="M218 7Q224 1 234 5L238 7L234 9Q224 13 218 7Z" fill="${t.accent2}"/><circle cx="230" cy="6.4" r="1.2" fill="${t.bg}"/>`).replace('<svg ', '<svg preserveAspectRatio="none" ');
};

// The Snake-Eye: gold rim, ember iris, a vertical slit.
const snakeEye = (t, kit) =>
  kit.svg(44, 44, `<defs><radialGradient id="i"><stop offset="0" stop-color="${t.accent2}"/><stop offset="0.6" stop-color="${t.accent}"/><stop offset="1" stop-color="${mix(t.accent, t.bg, 0.5)}"/></radialGradient></defs><circle cx="22" cy="22" r="20" fill="${t.bg}" stroke="${t.accent2}" stroke-width="2"/><circle cx="22" cy="22" r="15" fill="url(#i)"/><path d="M22 8.5Q18.6 22 22 35.5Q25.4 22 22 8.5Z" fill="${t.bg}"/><circle cx="17" cy="16" r="2" fill="#ffffff" fill-opacity="0.75"/>`);

export default (t, kit) => {
  const { sel, SEL, alpha } = kit;
  const pseudo = (list, p) => list.split(', ').map((s) => `${s}::${p}`).join(', ');
  const charcoal = `linear-gradient(178deg, ${mix(t.raised, t.accent, 0.1)} 0%, ${t.surface} 55%, ${mix(t.surface, t.bg, 0.6)} 100%)`;
  const ember = (o) => `radial-gradient(ellipse 80% 55% at 50% 118%, ${alpha(t.accent, o)}, transparent 72%)`;
  const goldRim = mix(t.border, t.accent2, 0.45);
  const plate = t.surface;
  const halo = `0 0 3px ${plate}, 0 0 5px ${plate}, 0 0 7px ${plate}, 0 0 9px ${plate}, 0 0 9px ${plate}`;
  const flames = 'var(--se-flames) left bottom / 80px 16px repeat-x';

  const panels = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const families = { success: ['about_me', 'preferences'], accent: ['social_media', 'animation'], accent2: ['profile_song', 'account', 'messages'], warning: ['duel_stats', 'profile_comments'] };
  const setPanels = sel(Object.values(families).flat().map((c) => `#settings .${c}`));
  const button = sel(['#content .button', '#content .combobox']);
  const buttonHover = sel(['#content .button:hover', '#content .button.button_selected', '#content .combobox:hover', '#content .combobox.combobox_selected']);
  const field = sel(['#content input[type=text]', '#content input[type=password]', '#content input:not([type])', '#content .textinput', '#content textarea']);
  const fieldFocus = sel(['#content input:focus', '#content textarea:focus']);

  return `
html body {
  --se-scales: ${svgUrl(scales(t, kit))};
  --se-flames: ${svgUrl(flameRow(t, kit))};
  --se-band: ${svgUrl(scaleBand(t, kit))};
  --se-serpent: ${svgUrl(serpent(t, kit))};
}

/* Menu tiles: scaled charcoal plates, gold-rimmed, flames licking the foot. */
${SEL.tile} {
  background: ${ember(0.3)}, var(--se-scales), ${charcoal} !important;
  border-color: transparent !important;
  border-radius: 6px !important;
  box-shadow: inset 0 0 0 1px ${goldRim}, inset 0 1px 0 ${alpha(t.accent2, 0.35)}, 0 14px 28px -14px #000000 !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; left: 1px; right: 1px; bottom: 1px; height: 20px; pointer-events: none;
  background: var(--se-band) left 0 bottom 0 / 10px 8px repeat-x; border-radius: 0 0 5px 5px; opacity: 0.92; transition: opacity 0.25s;
}
${SEL.tileHover} {
  background: ${ember(0.55)}, var(--se-scales), ${charcoal} !important;
  box-shadow: inset 0 0 0 1px ${t.accent2}, inset 0 1px 0 ${t.accent2}, 0 0 24px -4px ${alpha(t.accent, 0.85)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${ember(0.4)}, ${t.bg} !important; box-shadow: inset 0 3px 10px #000000, inset 0 0 0 1px ${t.accent} !important; }
${sel(['#main_menu .menu_btn .content span', '#main_menu .menu_btn span'])} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 14px ${alpha(t.accent, 0.6)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${goldRim} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${t.accent2} !important; box-shadow: 0 0 8px ${t.accent}; }

/* Page titles: a gold serpent beneath. */
${sel(['#content .title1'])} { color: ${t.text} !important; text-shadow: 0 3px 0 #000000, 0 0 24px ${alpha(t.accent, 0.65)} !important; }
${sel(['#content .title1::after'])} {
  content: ""; position: absolute; left: calc(50% - 130px); width: 260px; bottom: 1px; height: 12px; pointer-events: none;
  background: var(--se-serpent) center / 100% 100% no-repeat;
}

/* Buttons: scaled plates with a gold lip that flare when hovered. */
${button} {
  background: ${ember(0.2)}, var(--se-scales), ${charcoal} !important;
  border-color: ${goldRim} !important;
  border-radius: 6px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.4)}, inset 0 -2px 0 ${alpha(t.accent, 0.35)} !important;
}
${buttonHover} {
  background: ${ember(0.6)}, var(--se-scales), ${charcoal} !important;
  border-color: ${t.accent2} !important;
  box-shadow: inset 0 1px 0 ${t.accent2}, inset 0 -2px 0 ${t.accent}, 0 0 10px -2px ${alpha(t.accent, 0.8)} !important;
}
${SEL.buttonDown} {
  background: ${ember(0.5)}, ${t.bg} !important;
  border-color: ${t.accent} !important;
  box-shadow: inset 0 3px 7px #000000, inset 0 0 0 1px ${alpha(t.accent, 0.6)} !important;
}

/* Text fields: dark slots with a gold rule. */
${field} {
  background-color: ${mix(t.bg, t.surface, 0.5)} !important;
  border-color: ${goldRim} !important;
  border-radius: 4px !important;
  box-shadow: inset 0 2px 5px #000000, inset 0 -1px 0 ${alpha(t.accent2, 0.5)} !important;
}
${fieldFocus} { outline: 1px solid ${t.accent2} !important; box-shadow: inset 0 2px 5px #000000, 0 0 10px ${alpha(t.accent, 0.6)} !important; }

/* Pop-ups: a gold-framed plate with flames along the foot. */
${SEL.dialog} {
  background: ${ember(0.3)}, var(--se-scales), ${charcoal} !important;
  border-radius: 10px !important;
  box-shadow: 0 0 0 1px ${t.accent2}, inset 0 0 0 4px ${t.surface}, inset 0 0 0 5px ${alpha(t.accent2, 0.5)}, 0 0 50px -12px ${alpha(t.accent, 0.7)}, 0 24px 60px -18px #000000 !important;
}
${pseudo(SEL.dialog, 'before')} {
  content: ""; position: absolute; left: 6px; right: 6px; top: auto; bottom: 5px; width: auto; height: 14px; transform: none; pointer-events: none; z-index: 1;
  background: var(--se-flames) left bottom / 70px 14px repeat-x; opacity: 0.6; border-radius: 0 0 6px 6px;
}
${pseudo(SEL.dialog, 'after')} { content: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.65)} !important; }
${pseudo(SEL.dialogTitle, 'after')} {
  content: ""; position: absolute; left: 10%; right: 10%; bottom: -9px; height: 11px; pointer-events: none;
  background: var(--se-serpent) center / 100% 100% no-repeat;
}

/* Chat: a gold-lipped header, a band of serpent scales along its foot. */
${SEL.chatTop} {
  background: var(--se-band) left 0 bottom 0 / 10px 8px repeat-x, var(--se-scales), ${charcoal} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.5)}, inset 0 0 0 1px ${goldRim}, inset 0 -1px 0 ${t.accent} !important;
  border-radius: 6px 6px 0 0 !important;
}
${SEL.chat} { background: ${ember(0.14)}, ${t.surface} !important; box-shadow: inset 1px 0 0 ${goldRim}, inset -1px 0 0 ${goldRim}, inset 0 -1px 0 ${goldRim} !important; }
${sel(['#chats .chat .cout_txt'])} { background-color: ${mix(t.bg, t.surface, 0.4)} !important; border-color: ${alpha(t.accent2, 0.25)} !important; }
${sel(['#chats .chat .black_line'])} { background-color: ${t.accent} !important; }

/* Duel: the Snake-Eye on the life bar; scale rings round the phases, the active one an open eye. */
${SEL.life} { border-color: ${t.accent2} !important; border-radius: 999px !important; box-shadow: 0 0 0 1px #000000, 0 0 16px -4px ${alpha(t.accent, 0.9)} !important; }
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -26px; top: 50%; width: 42px; height: 42px; margin-top: -21px; pointer-events: none;
  background: ${svgUrl(snakeEye(t, kit))} center / contain no-repeat; filter: drop-shadow(0 0 5px ${alpha(t.accent, 0.8)});
}
${sel(['#duel .lifepoints .life_bar'])} { border-radius: 999px !important; }
${SEL.lifeSelf} { background: var(--se-scales), linear-gradient(180deg, ${alpha(t.accent2, 0.45)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.5)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: var(--se-scales), linear-gradient(180deg, ${alpha(t.text, 0.35)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.5)}, ${t.opp}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: var(--se-scales), #000000 !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 #000000, 0 0 6px #000000, 0 0 3px #000000 !important; }

${SEL.phase} { background: ${goldRim} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_inner'])} { background: radial-gradient(circle at 50% 100%, ${alpha(t.accent, 0.3)}, transparent 60%), ${charcoal} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top', '#duel .phase .phase_inner'])} { border-radius: 50% !important; }
${sel(['#duel .phase .background::after'])} {
  content: ""; position: absolute; inset: -2px; pointer-events: none;
  background: ${svgUrl(scaleRing(t, kit, false))} center / 100% 100% no-repeat;
}
${sel(['#duel .phase.active .background::after'])} { background-image: ${svgUrl(scaleRing(t, kit, true))}; filter: drop-shadow(0 0 5px ${t.accent}); }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(ellipse 7% 40% at 50% 50%, ${alpha('#000000', 0.55)} 75%, transparent 100%), radial-gradient(circle at 50% 50%, ${t.accent2} 0%, ${t.accent} 50%, ${mix(t.accent, t.bg, 0.55)} 100%) !important; }
${sel(['#duel .phase.active:has(.phase_inner) span.phase_txt'])} { color: ${t.text} !important; text-shadow: 0 0 3px #000000, 0 1px 0 #000000, 0 0 6px #000000 !important; }
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 22px ${alpha(t.self, 0.85)} !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 22px ${alpha(t.opp, 0.75)} !important; }
${sel(['#duel .phase span'])} { color: ${mix(t.text, t.muted, 0.25)} !important; text-shadow: 0 1px 0 #000000, 0 0 3px #000000 !important; }
${sel(['#duel .phase.active span'])} { color: ${t.text} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${t.accent2} !important; border-radius: 999px !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${charcoal} !important; border-radius: 999px !important; }
${sel(['#duel #watchers'])} { background: var(--se-scales), ${t.surface} !important; box-shadow: inset 0 0 0 1px ${goldRim}, inset 0 -2px 0 ${t.accent} !important; }

/* Pop-up buttons: ember plates with a gold inset. */
${POP.map(([n, label, w, h, p]) => `${sel([`#content img[src*="/svg/${n}"]`, `#content img[data-src*="/svg/${n}"]`])} { content: ${svgUrl(popButton(t, label, w, h, p))} !important; }`).join(' ')}

/* Duel room panels: scaled plates, a gold-to-ember rim, flames at the foot. */
${panels} { background: ${ember(0.18)}, var(--se-scales), ${alpha(t.surface, 0.9)} !important; border-radius: 10px !important; }
${pseudo(panels, 'before')} { filter: none !important; background: linear-gradient(180deg, ${t.accent2}, ${goldRim} 30%, ${t.border} 60%, ${t.accent}) !important; }
${sel(['#duel_room .format_txt', '#duel_room #host_bg > span', '#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#settings .admin_lbl'])} { color: ${t.text} !important; text-shadow: ${halo}, 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.65)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${charcoal} !important; opacity: 0.95 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${ember(0.4)}, ${charcoal} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(t.accent2, 0.22)} !important; }
${sel(['#duel_room .duelbutton:hover'])} { border-color: ${t.accent2} !important; }

/* Deck constructor: scaled plates warmed from below. */
${sel(['#deck_constructor .deck_bg'])} { background: ${ember(0.18)}, var(--se-scales), ${mix(t.surface, t.bg, 0.3)} !important; box-shadow: inset 0 0 0 1px ${goldRim}, inset 3px 0 0 ${t.accent2} !important; }
${sel(['#deck_constructor .side_bg'])} { background: var(--se-scales), ${mix(t.surface, t.accent, 0.14)} !important; box-shadow: inset 0 0 0 1px ${goldRim}, inset 3px 0 0 ${t.accent} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: var(--se-scales), ${mix(t.surface, t.accent2, 0.1)} !important; box-shadow: inset 0 0 0 1px ${goldRim}, inset 3px 0 0 ${t.accent2} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${ember(0.25)}, var(--se-scales), ${charcoal} !important; box-shadow: inset 0 0 0 1px ${goldRim}, inset 0 1px 0 ${t.accent2} !important; border-radius: 10px 10px 0 0 !important; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 1 !important; text-shadow: 0 0 14px ${alpha(t.accent, 0.75)} !important; }
${sel(['#deck_constructor #search .title_txt'])} { text-shadow: 0 2px 0 #000000, 0 0 18px ${alpha(t.accent, 0.65)} !important; }

/* Settings boxes: scaled plates, family colour as the rim. */
${setPanels} { background-image: ${ember(0.15)}, var(--se-scales) !important; border-radius: 10px !important; }
${Object.entries(families).map(([tk, list]) => `${sel(list.map((c) => `#settings .${c}`))} { background-color: color-mix(in srgb, ${t.surface} 90%, ${t.accent}) !important; border-color: color-mix(in srgb, ${t.accent} 38%, ${t.border}) !important; box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.35)}, 0 16px 30px -16px #000000 !important; }`).join(' ')}

/* Scrollbars: a gold scale strip. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${t.accent}, ${t.accent2} 50%, ${t.accent}) !important; border-radius: 99px !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${t.accent}, ${t.accent2} 50%, ${t.accent}) !important; }
@media (prefers-reduced-motion: reduce) { html body #content *::before { transition: none !important; } }
`;
};
