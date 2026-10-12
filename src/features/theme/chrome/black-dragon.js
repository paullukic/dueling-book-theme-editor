// Black Dragon (Red-Eyes): obsidian and gunmetal scale plates with claw-cut
// corners, three molten claw gouges in a corner, molten seams under titles,
// a jaw of steel teeth around each phase, and the red slit eye guarding the
// life bar.

import { mix } from '../../../lib/color.js';

const r1 = (v) => Math.round(v * 10) / 10;
const FONT = 'Segoe UI, system-ui, Roboto, Arial, sans-serif';

// Pop-up buttons: a dark crimson plate, claw-cut corners, a red-eye gem.
const POP = [['ok_btn', 'OK', 153.4, 78.47, true], ['yes_btn', 'Yes', 153.4, 78.47, true], ['no_btn', 'No', 153.4, 78.47, false], ['cancel_btn', 'Cancel', 234.85, 78.5, false]];
const popButton = (t, label, W, H, primary) => {
  const x = 8;
  const w = W - 16;
  const n = 10;
  const d = `M${x + n} 10H${x + w}V${68 - n}L${x + w - n} 68H${x}V${10 + n}Z`;
  const fill = primary ? mix(t.accent, t.bg, 0.55) : mix(t.raised, t.bg, 0.2);
  const gem = primary ? `<path d="M${x + 22} 30l9 9-9 9-9-9z" fill="${t.accent}" stroke="${t.text}" stroke-opacity="0.6" stroke-width="1"/><path d="M${x + 22} 33q-2 6 0 12q2-6 0-12z" fill="#000000"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(fill, t.text, 0.12)}"/><stop offset="0.3" stop-color="${fill}"/><stop offset="1" stop-color="${mix(fill, '#000000', 0.45)}"/></linearGradient></defs><path d="${d}" fill="url(#f)" stroke="${primary ? t.accent : mix(t.border, t.text, 0.25)}" stroke-width="2"/>${gem}<text x="${primary ? W / 2 + 8 : W / 2}" y="40" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${t.text}">${label}</text></svg>`;
};

// Compact data URI: only the characters CSS and URLs need escaped.
const svgUrl = (text) => `url("data:image/svg+xml,${text.replace(/(\d\.\d)\d+/g, '$1').replace(/"/g, "'").replace(/[%#<>{}]/g, encodeURIComponent)}")`;

// Overlapping dragon scales, very faint.
const scales = (t, kit) =>
  kit.svg(20, 12, `<path d="M0 12a10 10 0 0 1 20 0M-10 6a10 10 0 0 1 20 0M10 6a10 10 0 0 1 20 0" fill="#000000" fill-opacity="0.12" stroke="${t.text}" stroke-opacity="0.08" stroke-width="1"/>`);

// Three claw gouges raked down from the top-right corner, molten inside.
const claws = (t, kit) => {
  const slash = (x, len, w) => `<path d="M${x} 2Q${x - len * 0.35} ${len * 0.45} ${x - len * 0.62} ${len}Q${x - len * 0.3} ${len * 0.5} ${x + w} 3Z"/>`;
  const set = [slash(46, 40, 3.2), slash(54, 46, 3.6), slash(62, 38, 3)].join('');
  return kit.svg(66, 50, `<defs><linearGradient id="m" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.accent2}"/><stop offset="0.6" stop-color="${t.accent}"/><stop offset="1" stop-color="${mix(t.accent, t.bg, 0.5)}"/></linearGradient></defs><g fill="${t.bg}" transform="translate(1.2 1.2)">${set}</g><g fill="url(#m)">${set}</g>`);
};

// A molten seam: a jagged crack glowing from the inside.
const seam = (t, kit) => {
  const pts = [[0, 6], [26, 5], [44, 7.5], [70, 4.5], [96, 6.5], [120, 5], [144, 7], [170, 4.5], [196, 6.5], [214, 5], [240, 6]];
  const d = `M${pts.map((p) => p.join(' ')).join('L')}`;
  return kit.svg(240, 12, `<path d="${d}" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="4" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${t.accent2}" stroke-width="1.2" stroke-linejoin="round"/><path d="M44 7.5l5 3.5M120 5l-4-3.5M170 4.5l6-3M214 5l-3 4" stroke="${t.accent}" stroke-width="0.8"/>`).replace('<svg ', '<svg preserveAspectRatio="none" ');
};

// A ring of steel teeth, like a dragon's jaw, around a phase button.
const jaw = (t, kit) => {
  let s = '';
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const b = 0.13;
    const p = (r, d) => `${r1(50 + Math.cos(a + d) * r)} ${r1(50 + Math.sin(a + d) * r)}`;
    s += `<path d="M${p(34, -b)}L${p(i % 2 ? 42 : 46, 0.04)}L${p(34, b)}Z"/>`;
  }
  return kit.svg(100, 100, `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.raised, t.text, 0.45)}"/><stop offset="1" stop-color="${t.raised}"/></linearGradient></defs><g fill="url(#g)" stroke="${mix(t.accent, t.bg, 0.3)}" stroke-width="0.7" stroke-linejoin="round">${s}</g><circle cx="50" cy="50" r="34" fill="none" stroke="${t.accent}" stroke-width="1.2"/>`);
};

// The Red-Eye: a gunmetal diamond holding a red slit eye.
const eye = (t, kit) =>
  kit.svg(48, 48, `<defs><radialGradient id="i"><stop offset="0" stop-color="${t.accent2}"/><stop offset="0.55" stop-color="${t.accent}"/><stop offset="1" stop-color="${mix(t.accent, t.bg, 0.55)}"/></radialGradient><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(t.raised, t.text, 0.5)}"/><stop offset="1" stop-color="${t.bg}"/></linearGradient></defs><path d="M24 2L46 24L24 46L2 24Z" fill="url(#s)" stroke="${t.accent}" stroke-width="1.2"/><path d="M8 24Q24 10 40 24Q24 38 8 24Z" fill="url(#i)" stroke="${t.bg}" stroke-width="1"/><path d="M24 15.5Q21.6 24 24 32.5Q26.4 24 24 15.5Z" fill="${t.bg}"/><circle cx="21" cy="21" r="1.4" fill="#ffffff" fill-opacity="0.8"/>`);

export default (tokens, kit) => {
  // Crimson and graphite only: the second accent is a pale hot crimson, never orange.
  const t = { ...tokens, accent2: mix(tokens.accent, tokens.text, 0.4) };
  const { sel, SEL, alpha } = kit;
  const pseudo = (list, p) => list.split(', ').map((s) => `${s}::${p}`).join(', ');
  // Gunmetal: dark plate with a cold highlight band across the upper third.
  const metal = `linear-gradient(180deg, ${mix(t.raised, t.text, 0.1)} 0%, ${t.raised} 22%, ${t.surface} 60%, ${mix(t.surface, t.bg, 0.6)} 100%)`;
  const heat = (o) => `radial-gradient(ellipse 70% 50% at 50% 115%, ${alpha(t.accent, o)}, transparent 70%)`;
  const steel = mix(t.border, t.text, 0.18);
  const ember = mix(t.self, '#000000', 0.2);
  const plate = t.surface;
  const halo = `0 0 3px ${plate}, 0 0 5px ${plate}, 0 0 7px ${plate}, 0 0 9px ${plate}, 0 0 9px ${plate}`;
  const cut = (n) => `polygon(${n}px 0, 100% 0, 100% calc(100% - ${n}px), calc(100% - ${n}px) 100%, 0 100%, 0 ${n}px)`;
  const bevel = (n, c) => `linear-gradient(135deg, transparent calc(50% - 0.8px), ${c} 0 calc(50% + 0.8px), transparent 0) left top / ${n}px ${n}px no-repeat, linear-gradient(135deg, transparent calc(50% - 0.8px), ${c} 0 calc(50% + 0.8px), transparent 0) right bottom / ${n}px ${n}px no-repeat`;

  const panels = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const families = { success: ['about_me', 'preferences'], accent: ['social_media', 'animation'], accent2: ['profile_song', 'account', 'messages'], warning: ['duel_stats', 'profile_comments'] };
  const setPanels = sel(Object.values(families).flat().map((c) => `#settings .${c}`));
  const button = sel(['#content .button', '#content .combobox']);
  const buttonHover = sel(['#content .button:hover', '#content .button.button_selected', '#content .combobox:hover', '#content .combobox.combobox_selected']);
  const field = sel(['#content input[type=text]', '#content input[type=password]', '#content input:not([type])', '#content .textinput', '#content textarea']);
  const fieldFocus = sel(['#content input:focus', '#content textarea:focus']);

  return `
html body {
  --bd-scales: ${svgUrl(scales(t, kit))};
  --bd-claws: ${svgUrl(claws(t, kit))};
  --bd-seam: ${svgUrl(seam(t, kit))};
}

/* Menu tiles: gunmetal scale plates with claw-cut corners, gouged at top right. */
${SEL.tile} {
  background: ${bevel(12, steel)}, ${heat(0.2)}, var(--bd-scales), ${metal} !important;
  border-color: transparent !important;
  border-radius: 0 !important;
  clip-path: ${cut(12)};
  box-shadow: inset 0 0 0 1px ${steel}, inset 0 1px 0 ${alpha(t.text, 0.16)}, inset 0 -2px 0 ${alpha(t.accent, 0.55)} !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; right: 10px; top: 6px; width: 28px; height: 22px; pointer-events: none;
  background: var(--bd-claws) center / contain no-repeat; opacity: 0.7; transition: opacity 0.2s, filter 0.2s;
}
${SEL.tileHover} {
  background: ${bevel(12, t.accent2)}, ${heat(0.45)}, var(--bd-scales), ${metal} !important;
  box-shadow: inset 0 0 0 1px ${t.accent}, inset 0 -2px 0 ${t.accent2}, inset 0 -14px 18px -12px ${alpha(t.accent2, 0.6)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; filter: drop-shadow(0 0 4px ${t.accent}); }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${heat(0.3)}, ${t.bg} !important; box-shadow: inset 0 3px 10px #000000, inset 0 0 0 1px ${t.accent} !important; }
${sel(['#main_menu .menu_btn .content span', '#main_menu .menu_btn span'])} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 12px ${alpha(t.accent, 0.45)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${steel} !important; border-radius: 2px !important; transform: rotate(45deg) scale(0.8); }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${t.accent} !important; border-radius: 0 !important; }

/* Page titles: a molten seam below. */
${sel(['#content .title1'])} { color: ${t.text} !important; text-shadow: 0 3px 0 #000000, 0 0 22px ${alpha(t.accent, 0.55)} !important; }
${sel(['#content .title1::after'])} {
  content: ""; position: absolute; left: calc(50% - 130px); width: 260px; bottom: 2px; height: 10px; pointer-events: none;
  background: var(--bd-seam) center / 100% 100% no-repeat;
}

/* Buttons and dropdowns: chamfered obsidian, a red seam that turns molten on hover. */
${button} {
  background: ${bevel(5, steel)}, ${metal} !important;
  border-color: ${steel} !important;
  border-radius: 0 !important;
  clip-path: ${cut(5)};
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.14)}, inset 0 -2px 0 ${alpha(t.accent, 0.5)} !important;
}
${buttonHover} {
  background: ${bevel(5, t.accent2)}, ${heat(0.5)}, ${metal} !important;
  border-color: ${t.accent} !important;
  box-shadow: inset 0 -2px 0 ${t.accent2}, inset 0 0 10px ${alpha(t.accent, 0.35)} !important;
}
${SEL.buttonDown} {
  background: ${bevel(5, t.accent)}, ${heat(0.35)}, ${t.bg} !important;
  border-color: ${t.accent} !important;
  box-shadow: inset 0 3px 7px #000000, inset 0 -1px 0 ${t.accent} !important;
}

/* Text fields: a sunk steel slot. */
${field} {
  background-color: ${mix(t.bg, t.surface, 0.5)} !important;
  border-color: ${steel} !important;
  border-radius: 0 !important;
  box-shadow: inset 0 2px 5px #000000, inset 0 -1px 0 ${alpha(t.accent, 0.5)} !important;
}
${fieldFocus} { outline: 1px solid ${t.accent} !important; box-shadow: inset 0 2px 5px #000000, 0 0 10px ${alpha(t.accent, 0.55)} !important; }

/* Pop-ups: an obsidian slab with claw marks and a molten seam under the title. */
${SEL.dialog} {
  background: ${heat(0.16)}, var(--bd-scales), ${metal} !important;
  border-radius: 0 !important;
  clip-path: ${cut(16)};
  box-shadow: inset 0 0 0 1px ${steel}, inset 0 0 0 4px ${t.surface}, inset 0 0 0 5px ${alpha(t.accent, 0.5)}, inset 0 1px 0 ${alpha(t.text, 0.2)} !important;
}
${pseudo(SEL.dialog, 'before')} {
  content: ""; position: absolute; left: auto; right: 10px; top: 6px; bottom: auto; width: 60px; height: 46px; transform: none; pointer-events: none; z-index: 1;
  background: var(--bd-claws) center / contain no-repeat;
}
${pseudo(SEL.dialog, 'after')} {
  content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; transform: none; pointer-events: none;
  background: ${bevel(16, t.accent)};
}
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.55)} !important; }
${pseudo(SEL.dialogTitle, 'after')} {
  content: ""; position: absolute; left: 10%; right: 10%; bottom: -8px; height: 9px; pointer-events: none;
  background: var(--bd-seam) center / 100% 100% no-repeat;
}

/* Chat: a gunmetal header on a molten seam. */
${SEL.chatTop} {
  background: var(--bd-seam) left bottom / 100% 8px no-repeat, var(--bd-scales), ${metal} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.16)}, inset 0 0 0 1px ${steel} !important;
  border-radius: 0 !important;
}
${SEL.chat} { background: ${heat(0.1)}, ${t.surface} !important; box-shadow: inset 1px 0 0 ${steel}, inset -1px 0 0 ${steel}, inset 0 -1px 0 ${steel} !important; }
${sel(['#chats .chat .cout_txt'])} { background-color: ${mix(t.bg, t.surface, 0.4)} !important; border-color: ${alpha(t.accent, 0.3)} !important; }
${sel(['#chats .chat .black_line'])} { background-color: ${t.accent} !important; }

/* Duel: a molten life bar guarded by the red eye; phases in steel jaws. */
${SEL.life} { border-color: ${steel} !important; border-radius: 0 !important; box-shadow: 0 0 0 1px #000000, inset 0 0 0 1px ${alpha(mix(steel, t.text, 0.3), 0.55)}, 0 0 12px -4px ${alpha('#000000', 0.9)} !important; }
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -30px; top: 50%; width: 46px; height: 46px; margin-top: -23px; pointer-events: none;
  background: ${svgUrl(eye(t, kit))} center / contain no-repeat; filter: drop-shadow(0 0 5px ${alpha(t.accent, 0.8)});
}
${sel(['#duel .lifepoints .life_bar'])} { border-radius: 0 !important; }
${SEL.lifeSelf} { background: repeating-linear-gradient(100deg, transparent 0 14px, ${alpha(t.bg, 0.35)} 14px 15px, transparent 15px 31px), linear-gradient(180deg, ${alpha(mix(t.self, '#ffffff', 0.5), 0.45)}, transparent 40%), linear-gradient(90deg, ${mix(ember, t.bg, 0.4)}, ${ember} 55%, ${t.self}) !important; }
${SEL.lifeOpp} { background: repeating-linear-gradient(100deg, transparent 0 14px, ${alpha(t.bg, 0.35)} 14px 15px, transparent 15px 31px), linear-gradient(180deg, ${alpha(t.text, 0.35)}, transparent 40%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.6)}, ${mix(t.opp, t.bg, 0.25)}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: var(--bd-scales), #000000 !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 #000000, 0 0 6px #000000, 0 0 3px #000000 !important; }

${SEL.phase} { background: ${steel} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_inner'])} { background: radial-gradient(circle at 50% 30%, ${t.raised}, #000000) !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top', '#duel .phase .phase_inner'])} { border-radius: 50% !important; }
${sel(['#duel .phase.active .background::after'])} {
  content: ""; position: absolute; inset: -14px; pointer-events: none;
  background: ${svgUrl(jaw(t, kit))} center / 100% 100% no-repeat;
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 22px ${alpha(t.self, 0.8)} !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 22px ${alpha(t.opp, 0.75)} !important; }
${sel(['#duel .phase.active .background::after'])} { filter: drop-shadow(0 0 3px ${t.accent}); }
${sel(['#duel .phase span'])} { color: ${mix(t.text, t.muted, 0.15)} !important; text-shadow: 0 1px 0 #000000, 0 0 4px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${steel} !important; border-radius: 0 !important; clip-path: ${cut(6)}; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${metal} !important; border-radius: 0 !important; }
${sel(['#duel #watchers'])} { background: var(--bd-scales), ${t.surface} !important; box-shadow: inset 0 0 0 1px ${steel}, inset 0 -2px 0 ${t.accent} !important; }

/* Pop-up buttons: dark crimson plates with a red-eye gem. */
${POP.map(([n, label, w, h, p]) => `${sel([`#content img[src*="/svg/${n}"]`, `#content img[data-src*="/svg/${n}"]`])} { content: ${svgUrl(popButton(t, label, w, h, p))} !important; }`).join(' ')}

/* Duel room panels: obsidian plates with a steel-to-ember rim and claw marks. */
${panels} { background: ${heat(0.1)}, var(--bd-scales), ${alpha(t.surface, 0.9)} !important; border-radius: 0 !important; }
${pseudo(panels, 'before')} { filter: none !important; background: linear-gradient(160deg, ${steel}, ${t.border} 40%, ${t.border} 60%, ${t.accent} 90%, ${t.accent2}) !important; }
${pseudo(panels, 'after')} { content: ""; position: absolute; right: 6px; top: 6px; width: 28px; height: 22px; pointer-events: none; background: var(--bd-claws) center / contain no-repeat; opacity: 0.8; }
${sel(['#duel_room .format_txt', '#duel_room #host_bg > span', '#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#settings .admin_lbl'])} { color: ${t.text} !important; text-shadow: ${halo}, 0 2px 0 #000000, 0 0 16px ${alpha(t.accent, 0.55)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${metal} !important; opacity: 0.95 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${heat(0.35)}, ${metal} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(t.accent, 0.25)} !important; }
${sel(['#duel_room .duelbutton:hover'])} { border-color: ${t.accent} !important; }

/* Deck constructor: steel frames, scale plates, embers below. */
${sel(['#deck_constructor .deck_bg'])} { background: ${heat(0.14)}, var(--bd-scales), ${mix(t.surface, t.bg, 0.3)} !important; box-shadow: inset 0 0 0 1px ${steel}, inset 3px 0 0 ${t.accent} !important; }
${sel(['#deck_constructor .side_bg'])} { background: var(--bd-scales), ${mix(t.surface, t.accent, 0.14)} !important; box-shadow: inset 0 0 0 1px ${steel}, inset 3px 0 0 ${t.accent2} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: var(--bd-scales), ${mix(t.surface, t.accent2, 0.12)} !important; box-shadow: inset 0 0 0 1px ${steel}, inset 3px 0 0 ${steel} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${heat(0.12)}, var(--bd-scales), ${metal} !important; box-shadow: inset 0 0 0 1px ${steel}, inset 0 1px 0 ${alpha(t.text, 0.2)} !important; border-radius: 0 !important; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 1 !important; text-shadow: 0 0 14px ${alpha(t.accent, 0.7)} !important; }
${sel(['#deck_constructor #search .title_txt'])} { text-shadow: 0 2px 0 #000000, 0 0 18px ${alpha(t.accent, 0.55)} !important; }

/* Settings boxes: steel plates, their colour family as a heated top edge. */
${setPanels} { background-image: var(--bd-scales), linear-gradient(180deg, ${alpha(t.text, 0.05)}, transparent 40%) !important; border-radius: 0 !important; }
${Object.entries(families).map(([tk, list]) => `${sel(list.map((c) => `#settings .${c}`))} { background-color: color-mix(in srgb, ${t.surface} 90%, ${t.accent}) !important; border-color: color-mix(in srgb, ${t.accent} 30%, ${steel}) !important; box-shadow: inset 0 3px 0 ${alpha(t.accent, 0.75)} !important; }`).join(' ')}

/* Scrollbars: a red-hot rod. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${mix(t.accent, t.bg, 0.4)}, ${t.accent2} 50%, ${mix(t.accent, t.bg, 0.4)}) !important; border-radius: 0 !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${mix(t.accent, t.bg, 0.4)}, ${t.accent2} 50%, ${mix(t.accent, t.bg, 0.4)}) !important; }
@media (prefers-reduced-motion: reduce) { html body #content *::before { transition: none !important; } }
`;
};
