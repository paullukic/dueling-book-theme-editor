// Snake-Eye: ember flame and serpent scales. Warm charcoal plates laid with
// diamond serpent scales, a row of gold flames licking up from the bottom
// edge, a gold flame ring crowning every phase, a serpent divider under
// titles and the single slit-pupil Snake-Eye watching the life bar.

import { mix } from '../../../lib/color.js';

const r1 = (v) => Math.round(v * 10) / 10;

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
  return kit.svg(80, 16, `<defs>${flameGrad(t, 'f')}</defs><g fill="url(#f)" fill-opacity="0.7">${outer}</g><g fill="${t.accent2}" fill-opacity="0.55">${inner}</g>`);
};

// A wheel of fire around a phase button: tongues swept round the circle.
const flameRing = (t, kit) => {
  let s = '';
  for (let i = 0; i < 18; i++) {
    s += `<path transform="rotate(${i * 20} 50 50) translate(50 17)" d="${tongue(i % 3 === 0 ? 14 : i % 3 === 1 ? 10 : 12, 4.6, 6)}"/>`;
  }
  return kit.svg(100, 100, `<defs><linearGradient id="r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent2}" stop-opacity="0.35"/><stop offset="0.5" stop-color="${t.accent2}"/><stop offset="1" stop-color="${t.accent}"/></linearGradient></defs><g fill="url(#r)">${s}</g><circle cx="50" cy="50" r="34.5" fill="none" stroke="${t.accent2}" stroke-width="1.8"/>`);
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
  content: ""; position: absolute; left: 2px; right: 2px; bottom: 1px; height: 16px; pointer-events: none;
  background: ${flames}; opacity: 0.55; transition: opacity 0.25s;
  border-radius: 0 0 5px 5px;
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
  content: ""; position: absolute; left: 6px; right: 6px; top: auto; bottom: 6px; width: auto; height: 20px; transform: none; pointer-events: none; z-index: 1;
  background: var(--se-flames) left bottom / 100px 20px repeat-x; opacity: 0.8; border-radius: 0 0 6px 6px;
}
${pseudo(SEL.dialog, 'after')} { content: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.65)} !important; }
${pseudo(SEL.dialogTitle, 'after')} {
  content: ""; position: absolute; left: 10%; right: 10%; bottom: -9px; height: 11px; pointer-events: none;
  background: var(--se-serpent) center / 100% 100% no-repeat;
}

/* Chat: a gold-lipped header, flames along its foot. */
${SEL.chatTop} {
  background: var(--se-flames) left bottom / 80px 16px repeat-x, var(--se-scales), ${charcoal} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.5)}, inset 0 0 0 1px ${goldRim}, inset 0 -1px 0 ${t.accent} !important;
  border-radius: 6px 6px 0 0 !important;
}
${SEL.chat} { background: ${ember(0.14)}, ${t.surface} !important; box-shadow: inset 1px 0 0 ${goldRim}, inset -1px 0 0 ${goldRim}, inset 0 -1px 0 ${goldRim} !important; }
${sel(['#chats .chat .cout_txt'])} { background-color: ${mix(t.bg, t.surface, 0.4)} !important; border-color: ${alpha(t.accent2, 0.25)} !important; }
${sel(['#chats .chat .black_line'])} { background-color: ${t.accent} !important; }

/* Duel: the Snake-Eye on the life bar; gold flame rings around the phases. */
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
  content: ""; position: absolute; inset: -14px; pointer-events: none;
  background: ${svgUrl(flameRing(t, kit))} center / 100% 100% no-repeat; opacity: 0.55;
}
${sel(['#duel .phase.active .background::after'])} { opacity: 1; filter: drop-shadow(0 0 4px ${t.accent}); }
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 22px ${alpha(t.self, 0.85)} !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 22px ${alpha(t.opp, 0.75)} !important; }
${sel(['#duel .phase span'])} { text-shadow: 0 1px 0 #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${t.accent2} !important; border-radius: 999px !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${charcoal} !important; border-radius: 999px !important; }
${sel(['#duel #watchers'])} { background: var(--se-scales), ${t.surface} !important; box-shadow: inset 0 0 0 1px ${goldRim}, inset 0 -2px 0 ${t.accent} !important; }

/* Duel room panels: scaled plates, a gold-to-ember rim, flames at the foot. */
${panels} { background: ${ember(0.18)}, var(--se-scales), ${alpha(t.surface, 0.9)} !important; border-radius: 10px !important; }
${pseudo(panels, 'before')} { filter: none !important; background: linear-gradient(180deg, ${t.accent2}, ${goldRim} 30%, ${t.border} 60%, ${t.accent}) !important; }
${pseudo(panels, 'after')} { content: ""; position: absolute; left: 5px; right: 5px; bottom: 5px; height: 14px; pointer-events: none; background: ${flames}; opacity: 0.6; border-radius: 0 0 6px 6px; }
${sel(['#duel_room .format_txt', '#duel_room #host_bg > span', '#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span'])} { text-shadow: 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.65)} !important; }
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
${Object.entries(families).map(([tk, list]) => `${sel(list.map((c) => `#settings .${c}`))} { background-color: color-mix(in srgb, ${t.surface} 90%, ${t[tk]}) !important; border-color: color-mix(in srgb, ${t[tk]} 38%, ${t.border}) !important; box-shadow: inset 0 1px 0 ${alpha(t.accent2, 0.35)}, 0 16px 30px -16px #000000 !important; }`).join(' ')}

/* Scrollbars: a gold scale strip. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${t.accent}, ${t.accent2} 50%, ${t.accent}) !important; border-radius: 99px !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${t.accent}, ${t.accent2} 50%, ${t.accent}) !important; }
@media (prefers-reduced-motion: reduce) { html body #content *::before { transition: none !important; } }
`;
};
