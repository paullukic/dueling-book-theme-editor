// Dark Magic: the Dark Magician's grimoire. Violet vellum plates trimmed in
// arcane teal, quarter magic circles (rings, glyph band, a gold star point)
// in the corners, a full glyph ring around every phase, a spell-circle seal
// at the start of the life bar, and staff-tip dividers under titles.

import { mix } from '../../../lib/color.js';

const r1 = (v) => Math.round(v * 10) / 10;

// Compact data URI: only the characters CSS and URLs need escaped.
const svgUrl = (text) => `url("data:image/svg+xml,${text.replace(/(\d\.\d)\d+/g, '$1').replace(/"/g, "'").replace(/[%#<>{}]/g, encodeURIComponent)}")`;

// Five rune shapes, drawn around (0,0) about 6 units tall.
const GLYPHS = ['M0-3v6M-2-1h4', 'M-2 3l2-6 2 6', 'M-2-3h4v6', 'M-2 3V-3l4 3-4 3', 'M0-3a2 2 0 1 1 0 4v2M-2 3h4'];

// Glyphs set tangentially on a ring of radius r around (cx, cy), from a0 to a1 degrees.
const glyphRing = (cx, cy, r, a0, a1, step, scale, color, width) => {
  let s = '';
  let i = 0;
  for (let a = a0; a <= a1; a += step) {
    const rad = (a * Math.PI) / 180;
    s += `<path transform="translate(${r1(cx + Math.cos(rad) * r)} ${r1(cy + Math.sin(rad) * r)}) rotate(${r1(a + 90)}) scale(${scale})" d="${GLYPHS[i++ % GLYPHS.length]}"/>`;
  }
  return `<g fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${s}</g>`;
};

const star = (cx, cy, r, color) => {
  const p = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
    p.push(`${r1(cx + Math.cos(a) * r)} ${r1(cy + Math.sin(a) * r)}`);
  }
  return `<path d="M${p.join('L')}Z" fill="${color}"/>`;
};

// A quarter of a magic circle centred on the top-left corner.
const cornerCircle = (t, kit) =>
  kit.svg(70, 70, `<g fill="none"><path d="M3 60A57 57 0 0 1 60 3" stroke="${t.accent2}" stroke-width="1.4"/><path d="M3 48A45 45 0 0 1 48 3" stroke="${t.accent}" stroke-width="1"/><path d="M3 24A21 21 0 0 1 24 3" stroke="${t.accent2}" stroke-opacity="0.7" stroke-width="1"/><path d="M3 3L44 44" stroke="${t.accent}" stroke-opacity="0.45" stroke-width="0.8"/></g>${glyphRing(3, 3, 51.5, 8, 82, 9.5, 0.62, t.accent2, 1)}${star(16, 16, 5, t.warning)}`);

// A full spell circle: rings, glyph band, pentagram.
const spellCircle = (t, kit, o = 1) => {
  const p = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
    p.push(`${r1(60 + Math.cos(a) * 34)} ${r1(60 + Math.sin(a) * 34)}`);
  }
  return kit.svg(120, 120, `<g opacity="${o}"><g fill="none"><circle cx="60" cy="60" r="56" stroke="${t.accent2}" stroke-width="1.4"/><circle cx="60" cy="60" r="44" stroke="${t.accent}" stroke-width="1"/><circle cx="60" cy="60" r="34" stroke="${t.accent2}" stroke-opacity="0.6"/><path d="M${p.join('L')}Z" stroke="${t.accent}" stroke-width="1.1"/></g>${glyphRing(60, 60, 50, 0, 350, 15, 0.7, t.accent2, 1)}</g>`);
};

// The phase ring: two thin circles and a glyph band that sits just outside the button.
const phaseRing = (t, kit) =>
  kit.svg(100, 100, `<g fill="none"><circle cx="50" cy="50" r="35" stroke="${t.accent2}" stroke-width="1.3"/><circle cx="50" cy="50" r="46" stroke="${t.accent}" stroke-opacity="0.8" stroke-width="1"/></g>${glyphRing(50, 50, 40.5, 0, 345, 15, 0.62, t.accent2, 1.1)}${star(50, 4, 3, t.warning)}`);

// Divider: a staff, a teal orb at each end, a gold star in the centre.
const staffLine = (t, kit) =>
  kit.svg(240, 14, `<path d="M10 7H104M136 7H230" stroke="${t.accent2}" stroke-width="1"/><path d="M14 7H100M140 7H226" stroke="${t.accent}" stroke-opacity="0.6" stroke-width="3"/><circle cx="6" cy="7" r="3" fill="${t.accent2}"/><circle cx="234" cy="7" r="3" fill="${t.accent2}"/><path d="M120 1l7 6-7 6-7-6z" fill="none" stroke="${t.accent2}"/>${star(120, 7.5, 4, t.warning)}`).replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ');

// A row of glyphs, for header bands.
const runeBand = (t, kit) => kit.svg(48, 10, `<g fill="none" stroke="${t.accent2}" stroke-opacity="0.55" stroke-width="0.9" stroke-linecap="round">${GLYPHS.slice(0, 4).map((g, i) => `<path transform="translate(${6 + i * 12} 5) scale(0.7)" d="${g}"/>`).join('')}</g>`);

export default (t, kit) => {
  const { sel, SEL, alpha } = kit;
  const pseudo = (list, p) => list.split(', ').map((s) => `${s}::${p}`).join(', ');
  const vellum = `linear-gradient(170deg, ${mix(t.raised, t.accent, 0.14)} 0%, ${t.surface} 55%, ${mix(t.surface, t.bg, 0.5)} 100%)`;
  const trim = mix(t.border, t.accent2, 0.35);
  const rot = (s, c) => s.replace(/(<svg[^>]*>)([\s\S]*)<\/svg>/, (m, open, body) => `${open}<g transform="rotate(180 ${c} ${c})">${body}</g></svg>`);
  const corner = cornerCircle(t, kit);
  const corners = (px) => `var(--dm-corner) left top / ${px}px ${px}px no-repeat, var(--dm-corner-r) right bottom / ${px}px ${px}px no-repeat`;
  // Double trim: teal hairline outside, violet rule inside.
  const doubleTrim = (gap) => `0 0 0 1px ${t.accent2}, inset 0 0 0 ${gap}px ${t.surface}, inset 0 0 0 ${gap + 1}px ${alpha(t.accent, 0.55)}`;

  const panels = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const families = { success: ['about_me', 'preferences'], accent: ['social_media', 'animation'], accent2: ['profile_song', 'account', 'messages'], warning: ['duel_stats', 'profile_comments'] };
  const setPanels = sel(Object.values(families).flat().map((c) => `#settings .${c}`));
  const deckFrames = sel(['#deck_constructor .deck_bg', '#deck_constructor #search .search_bg']);
  const button = sel(['#content .button', '#content .combobox']);
  const buttonHover = sel(['#content .button:hover', '#content .button.button_selected', '#content .combobox:hover', '#content .combobox.combobox_selected']);
  const field = sel(['#content input[type=text]', '#content input[type=password]', '#content input:not([type])', '#content .textinput', '#content textarea']);
  const fieldFocus = sel(['#content input:focus', '#content textarea:focus']);

  return `
html body {
  --dm-corner: ${svgUrl(corner)};
  --dm-corner-r: ${svgUrl(rot(corner, 35))};
  --dm-circle: ${svgUrl(spellCircle(t, kit))};
  --dm-faint: ${svgUrl(spellCircle(t, kit, 0.28))};
  --dm-staff: ${svgUrl(staffLine(t, kit))};
  --dm-runes: ${svgUrl(runeBand(t, kit))};
}

/* Menu tiles: vellum plates, quarter spell circles in two corners, a faint seal. */
${SEL.tile} {
  background: var(--dm-circle) right -30px center / 84px 84px no-repeat, radial-gradient(ellipse at 85% 50%, ${alpha(t.accent, 0.18)}, transparent 55%), ${vellum} !important;
  border-color: transparent !important;
  border-radius: 6px !important;
  box-shadow: ${doubleTrim(3)}, 0 14px 28px -14px #000000 !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; inset: -4px; pointer-events: none;
  background: ${corners(46)}; opacity: 0.85; transition: opacity 0.2s, filter 0.2s;
}
${SEL.tileHover} {
  background: var(--dm-circle) right -30px center / 84px 84px no-repeat, radial-gradient(ellipse at 85% 50%, ${alpha(t.accent2, 0.22)}, transparent 60%), ${vellum} !important;
  box-shadow: 0 0 0 1px ${t.accent2}, inset 0 0 0 3px ${t.surface}, inset 0 0 0 4px ${t.accent}, 0 0 24px -4px ${alpha(t.accent, 0.8)}, 0 0 12px -4px ${alpha(t.accent2, 0.7)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; filter: drop-shadow(0 0 3px ${alpha(t.accent2, 0.9)}); }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${vellum} !important; box-shadow: inset 0 3px 10px #000000, 0 0 0 1px ${t.accent2} !important; }
${sel(['#main_menu .menu_btn .content span', '#main_menu .menu_btn span'])} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 16px ${alpha(t.accent, 0.7)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${t.accent2} !important; border-radius: 50% !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${t.warning} !important; border-radius: 50% !important; }

/* Page titles: violet glow over a staff divider. */
${sel(['#content .title1'])} { color: ${t.text} !important; text-shadow: 0 3px 0 ${t.bg}, 0 0 26px ${alpha(t.accent, 0.75)} !important; }
${sel(['#content .title1::after'])} {
  content: ""; position: absolute; left: calc(50% - 120px); width: 240px; bottom: 2px; height: 10px; pointer-events: none;
  background: var(--dm-staff) center / contain no-repeat;
}

/* Buttons and dropdowns: enchanted pills with a teal trim; hover charges them. */
${button} {
  background: linear-gradient(180deg, ${mix(t.raised, t.accent, 0.22)}, ${mix(t.surface, t.bg, 0.3)}) !important;
  border-color: ${trim} !important;
  border-radius: 999px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.12)}, inset 0 0 0 2px ${alpha(t.bg, 0.5)}, inset 0 0 0 3px ${alpha(t.accent, 0.35)} !important;
}
${buttonHover} {
  background: radial-gradient(ellipse at 50% 120%, ${alpha(t.accent2, 0.35)}, transparent 70%), linear-gradient(180deg, ${mix(t.raised, t.accent, 0.35)}, ${t.surface}) !important;
  border-color: ${t.accent2} !important;
  box-shadow: inset 0 0 0 2px ${alpha(t.bg, 0.4)}, inset 0 0 0 3px ${t.accent}, 0 0 12px -2px ${alpha(t.accent2, 0.7)} !important;
}
${SEL.buttonDown} {
  background: radial-gradient(ellipse at 50% 50%, ${alpha(t.accent2, 0.3)}, transparent 70%), ${t.bg} !important;
  border-color: ${t.accent2} !important;
  box-shadow: inset 0 3px 8px #000000, inset 0 0 0 1px ${t.accent} !important;
}

/* Text fields: a sunk ink line with a teal rune-rule. */
${field} {
  background-color: ${mix(t.bg, t.surface, 0.5)} !important;
  border-color: ${mix(t.border, t.accent, 0.4)} !important;
  border-radius: 4px !important;
  box-shadow: inset 0 2px 6px ${alpha('#000000', 0.55)}, inset 0 -1px 0 ${alpha(t.accent2, 0.6)} !important;
}
${fieldFocus} { outline: 1px solid ${t.accent2} !important; box-shadow: inset 0 2px 6px ${alpha('#000000', 0.55)}, 0 0 12px ${alpha(t.accent, 0.6)} !important; }

/* Pop-ups: a page of the grimoire, sealed with a spell circle. */
${SEL.dialog} {
  background: var(--dm-faint) center / 200px 200px no-repeat, radial-gradient(circle at 50% 50%, ${alpha(t.accent, 0.12)}, transparent 60%), ${vellum} !important;
  border-radius: 10px !important;
  box-shadow: 0 0 0 1px ${t.accent2}, inset 0 0 0 5px ${t.surface}, inset 0 0 0 6px ${alpha(t.accent, 0.6)}, 0 0 50px -10px ${alpha(t.accent, 0.55)}, 0 24px 60px -18px #000000 !important;
}
${pseudo(SEL.dialog, 'before')} {
  content: ""; position: absolute; inset: 0; width: auto; height: auto; transform: none; pointer-events: none; z-index: 1;
  background: ${corners(64)};
}
${pseudo(SEL.dialog, 'after')} { content: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 18px ${alpha(t.accent, 0.75)} !important; }
${pseudo(SEL.dialogTitle, 'after')} {
  content: ""; position: absolute; left: 10%; right: 10%; bottom: -9px; height: 12px; pointer-events: none;
  background: var(--dm-staff) center / contain no-repeat;
}

/* Chat: a rune band header over a dark page. */
${SEL.chatTop} {
  background: var(--dm-runes) left bottom 2px / 48px 10px repeat-x, linear-gradient(180deg, ${mix(t.raised, t.accent, 0.3)}, ${t.surface}) !important;
  box-shadow: inset 0 -1px 0 ${t.accent2}, inset 0 -3px 0 ${alpha(t.accent, 0.6)}, inset 0 1px 0 ${alpha(t.text, 0.12)} !important;
  border-radius: 8px 8px 0 0 !important;
}
${SEL.chat} { background: radial-gradient(ellipse at 50% 100%, ${alpha(t.accent, 0.14)}, transparent 60%), ${t.surface} !important; box-shadow: inset 1px 0 0 ${trim}, inset -1px 0 0 ${trim}, inset 0 -1px 0 ${trim} !important; }
${sel(['#chats .chat .cout_txt'])} { background-color: ${mix(t.bg, t.surface, 0.4)} !important; border-color: ${alpha(t.accent2, 0.3)} !important; }
${sel(['#chats .chat .black_line'])} { background-color: ${t.accent2} !important; }

/* Duel: life points sealed by a spell circle, phases inside glyph rings. */
${SEL.life} { border-color: ${t.accent2} !important; border-radius: 999px !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 0 2px ${alpha(t.accent, 0.7)}, 0 0 18px -4px ${alpha(t.accent, 0.8)} !important; }
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -30px; top: 50%; width: 44px; height: 44px; margin-top: -22px; pointer-events: none;
  background: var(--dm-circle) center / contain no-repeat; filter: drop-shadow(0 0 4px ${alpha(t.accent, 0.9)});
}
${sel(['#duel .lifepoints .life_bar'])} { border-radius: 999px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha(t.text, 0.25)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.accent, 0.5)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha(t.text, 0.25)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.accent, 0.5)}, ${t.opp}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: var(--dm-runes) left center / 48px 10px repeat-x, ${t.bg} !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 6px ${t.bg}, 0 0 10px ${t.accent} !important; }

${SEL.phase} { background: ${t.accent2} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_inner'])} { background: radial-gradient(circle, ${mix(t.raised, t.accent, 0.2)}, ${t.bg}) !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top', '#duel .phase .phase_inner'])} { border-radius: 50% !important; }
${sel(['#duel .phase .background::after'])} {
  content: ""; position: absolute; inset: -14px; pointer-events: none;
  background: var(--dm-ring) center / 100% 100% no-repeat; opacity: 1;
}
html body { --dm-ring: ${svgUrl(phaseRing(t, kit))}; }
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 20px ${alpha(t.self, 0.7)}, 0 0 8px ${t.accent2} !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 20px ${alpha(t.opp, 0.7)} !important; }
${sel(['#duel .phase.active .background::after'])} { opacity: 1; filter: drop-shadow(0 0 3px ${t.accent2}); }
${sel(['#duel .phase span'])} { text-shadow: 0 1px 0 ${t.bg} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${t.accent2} !important; border-radius: 999px !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${vellum} !important; border-radius: 999px !important; }
${sel(['#duel #watchers'])} { background: ${t.surface} !important; box-shadow: inset 0 0 0 1px ${trim}, inset 0 3px 0 ${t.accent} !important; }

/* Duel room panels: grimoire pages with circle corners and a violet-teal trim. */
${panels} { background: radial-gradient(ellipse at 50% 0%, ${alpha(t.accent, 0.12)}, transparent 60%), ${alpha(t.surface, 0.88)} !important; border-radius: 10px !important; }
${pseudo(panels, 'before')} { filter: none !important; background: linear-gradient(135deg, ${t.accent2}, ${t.accent} 30%, ${mix(t.accent, t.bg, 0.5)} 50%, ${t.accent} 70%, ${t.accent2}) !important; }
${pseudo(panels, 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; background: var(--dm-corner-r) right bottom / 54px 54px no-repeat; }
${sel(['#duel_room .format_txt', '#duel_room #host_bg > span', '#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span'])} { text-shadow: 0 2px 0 ${t.bg}, 0 0 18px ${alpha(t.accent, 0.75)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${vellum} !important; opacity: 0.95 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: radial-gradient(ellipse at 0% 50%, ${alpha(t.accent2, 0.2)}, transparent 50%), ${vellum} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(t.accent, 0.3)} !important; }
${sel(['#duel_room .duelbutton:hover'])} { border-color: ${t.accent2} !important; }

/* Deck constructor: the deck laid on a violet page, search under a seal. */
${sel(['#deck_constructor .deck_bg'])} { background: radial-gradient(ellipse at 50% 40%, ${alpha(t.accent, 0.16)}, transparent 65%), ${mix(t.surface, t.bg, 0.3)} !important; box-shadow: inset 0 0 0 1px ${t.accent2}, inset 0 0 0 4px ${t.surface}, inset 0 0 0 5px ${alpha(t.accent, 0.4)} !important; }
${sel(['#deck_constructor .side_bg'])} { background: ${mix(t.surface, t.accent, 0.2)} !important; box-shadow: inset 0 0 0 1px ${trim}, inset 0 2px 0 ${t.accent} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: ${mix(t.surface, t.accent2, 0.12)} !important; box-shadow: inset 0 0 0 1px ${trim}, inset 0 2px 0 ${t.accent2} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: var(--dm-faint) center 72% / 260px 260px no-repeat, ${vellum} !important; box-shadow: inset 0 0 0 1px ${t.accent2}, inset 0 0 0 4px ${t.surface}, inset 0 0 0 5px ${alpha(t.accent, 0.4)} !important; border-radius: 10px 10px 0 0 !important; }
${pseudo(deckFrames, 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; background: var(--dm-corner-r) right bottom / 64px 64px no-repeat; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 1 !important; text-shadow: 0 0 16px ${alpha(t.accent, 0.8)} !important; }
${sel(['#deck_constructor #search .title_txt'])} { text-shadow: 0 2px 0 ${t.bg}, 0 0 20px ${alpha(t.accent, 0.75)} !important; }

/* Settings boxes keep their colour family as an inner rule, on vellum. */
${setPanels} { background-image: linear-gradient(170deg, ${alpha(t.text, 0.05)}, transparent 50%) !important; border-radius: 10px !important; }
${pseudo(setPanels, 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; background: var(--dm-corner-r) right bottom / 50px 50px no-repeat; }
${Object.entries(families).map(([tk, list]) => `${sel(list.map((c) => `#settings .${c}`))} { background-color: color-mix(in srgb, ${t.surface} 88%, ${t[tk]}) !important; border-color: ${trim} !important; box-shadow: inset 0 0 0 3px ${t.surface}, inset 0 0 0 4px ${alpha(t[tk], 0.6)}, 0 16px 30px -16px #000000 !important; }`).join(' ')}

/* Scrollbars: a violet wand with a teal core. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${t.accent}, ${t.accent2} 50%, ${t.accent}) !important; border-radius: 99px !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, ${t.accent}, ${t.accent2} 50%, ${t.accent}) !important; }
@media (prefers-reduced-motion: reduce) { html body #content *::before { transition: none !important; } }
`;
};
