// Shadow Realm: a Shadow Game arena. Cracked grey-green stone slabs with eerie
// green light leaking through the fractures, the purple void pooling below
// every panel, and the Wdjat eye watching from tiles, pop-ups, the life bar
// and the head of every phase ring.

import { mix } from '../../../lib/color.js';

const r1 = (v) => Math.round(v * 10) / 10;

// Compact data URI: only the characters CSS and URLs need escaped.
const svgUrl = (text) => `url("data:image/svg+xml,${text.replace(/(\d\.\d)\d+/g, '$1').replace(/"/g, "'").replace(/[%#<>{}]/g, encodeURIComponent)}")`;

// The Wdjat (Eye of Horus) in a 60x36 box: brow, eye, pupil, tear and spiral.
const wdjatBody = (ink, glow) =>
  `<g fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="${glow}" stroke-opacity="0.45" stroke-width="5"><path d="M6 7Q30 -1 54 7M8 17Q30 3 52 17Q30 27 8 17ZM22 23L19 34M34 23Q40 31 48 31Q55 31 53 25Q51 21 47 25"/></g><g stroke="${ink}" stroke-width="2.4"><path d="M6 7Q30 -1 54 7M8 17Q30 3 52 17Q30 27 8 17ZM22 23L19 34M34 23Q40 31 48 31Q55 31 53 25Q51 21 47 25"/></g></g><circle cx="30" cy="15.5" r="5" fill="${ink}"/>`;
const wdjat = (t, kit) => kit.svg(60, 36, wdjatBody(t.accent, t.accent));

// Fractures in stone, green light seeping out of them.
const cracks = (t, kit) => {
  const d = 'M0 30L18 34L26 22L44 30L52 48L70 52M52 48L46 66L58 80M26 22L30 6M70 52L80 46';
  return kit.svg(80, 80, `<path d="${d}" fill="none" stroke="${t.accent}" stroke-opacity="0.1" stroke-width="3" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#000000" stroke-opacity="0.55" stroke-width="0.9" stroke-linejoin="round"/>`);
};

// A long fracture, used as a divider: dark crack, green light along it.
const fracture = (t, kit) => {
  const pts = [[0, 6], [30, 5], [52, 8], [80, 4], [104, 7], [120, 5], [142, 8], [166, 4], [190, 7], [212, 5], [240, 6]];
  const d = `M${pts.map((p) => p.join(' ')).join('L')}`;
  return kit.svg(240, 12, `<path d="${d}" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="4" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${t.accent}" stroke-width="1" stroke-linejoin="round"/><path d="M52 8l-4 4M142 8l5 3.5M80 4l3-4" stroke="${t.accent}" stroke-opacity="0.7" stroke-width="0.7"/>`).replace('<svg ', '<svg preserveAspectRatio="none" ');
};

// A cracked ring of green light with the Wdjat at its head.
const eyeRing = (t, kit) => {
  let arcs = '';
  const gaps = [0, 47, 98, 151, 203, 262, 318];
  for (let i = 0; i < gaps.length; i++) {
    const a0 = ((gaps[i] + 4 - 90) * Math.PI) / 180;
    const a1 = (((gaps[i + 1] ?? 360) - 4 - 90) * Math.PI) / 180;
    if (i === 0) continue;
    const p = (a, r) => `${r1(50 + Math.cos(a) * r)} ${r1(50 + Math.sin(a) * r)}`;
    arcs += `M${p(a0, 37)}A37 37 0 0 1 ${p(a1, 37)}`;
  }
  return kit.svg(100, 100, `<path d="${arcs}" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="5"/><path d="${arcs}" fill="none" stroke="${t.accent}" stroke-width="1.6"/><g transform="translate(37.5 2) scale(0.42)">${wdjatBody(t.accent, t.accent)}</g>`);
};

export default (t, kit) => {
  const { sel, SEL, alpha } = kit;
  const pseudo = (list, p) => list.split(', ').map((s) => `${s}::${p}`).join(', ');
  const slab = `linear-gradient(172deg, ${mix(t.raised, t.muted, 0.12)} 0%, ${t.raised} 30%, ${t.surface} 70%, ${mix(t.surface, t.bg, 0.5)} 100%)`;
  const voidFog = (o) => `radial-gradient(ellipse 90% 70% at 50% 120%, ${alpha(t.accent2, o)}, transparent 70%)`;
  const seep = (o) => `radial-gradient(ellipse 60% 80% at 50% 50%, ${alpha(t.accent, o)}, transparent 70%)`;
  const edge = mix(t.border, t.accent, 0.22);

  const panels = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const families = { success: ['about_me', 'preferences'], accent: ['social_media', 'animation'], accent2: ['profile_song', 'account', 'messages'], warning: ['duel_stats', 'profile_comments'] };
  const setPanels = sel(Object.values(families).flat().map((c) => `#settings .${c}`));
  const button = sel(['#content .button', '#content .combobox']);
  const buttonHover = sel(['#content .button:hover', '#content .button.button_selected', '#content .combobox:hover', '#content .combobox.combobox_selected']);
  const field = sel(['#content input[type=text]', '#content input[type=password]', '#content input:not([type])', '#content .textinput', '#content textarea']);
  const fieldFocus = sel(['#content input:focus', '#content textarea:focus']);

  return `
html body {
  --sr-cracks: ${svgUrl(cracks(t, kit))};
  --sr-eye: ${svgUrl(wdjat(t, kit))};
  --sr-eye-faint: ${svgUrl(kit.svg(60, 36, `<g opacity="0.13">${wdjatBody(t.accent, t.accent)}</g>`))};
  --sr-fracture: ${svgUrl(fracture(t, kit))};
}

/* Menu tiles: cracked arena slabs, the void below, the eye watching. */
${SEL.tile} {
  background: ${voidFog(0.3)}, var(--sr-cracks), ${slab} !important;
  border-color: transparent !important;
  border-radius: 1px !important;
  box-shadow: inset 0 0 0 1px ${edge}, inset 0 1px 0 ${alpha(t.text, 0.1)}, inset 0 -3px 0 ${alpha(t.accent2, 0.55)}, 0 14px 28px -12px #000000 !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; right: 7px; top: 5px; width: 26px; height: 16px; pointer-events: none;
  background: var(--sr-eye) center / contain no-repeat; opacity: 0.55; transition: opacity 0.25s, filter 0.25s;
}
${SEL.tileHover} {
  background: ${seep(0.16)}, ${voidFog(0.45)}, var(--sr-cracks), ${slab} !important;
  box-shadow: inset 0 0 0 1px ${t.accent}, inset 0 -3px 0 ${t.accent2}, 0 0 24px -6px ${alpha(t.accent, 0.75)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; filter: drop-shadow(0 0 4px ${t.accent}); }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${voidFog(0.5)}, ${t.bg} !important; box-shadow: inset 0 3px 10px #000000, inset 0 0 0 1px ${t.accent2} !important; }
${sel(['#main_menu .menu_btn .content span', '#main_menu .menu_btn span'])} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 14px ${alpha(t.accent2, 0.6)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${edge} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${t.accent} !important; box-shadow: 0 0 8px ${t.accent}; }

/* Page titles: a glowing fracture beneath. */
${sel(['#content .title1'])} { color: ${t.text} !important; text-shadow: 0 3px 0 #000000, 0 0 26px ${alpha(t.accent2, 0.7)} !important; }
${sel(['#content .title1::after'])} {
  content: ""; position: absolute; left: calc(50% - 130px); width: 260px; bottom: 2px; height: 10px; pointer-events: none;
  background: var(--sr-fracture) center / 100% 100% no-repeat;
}

/* Buttons: stone tablets; hovering wakes the green light, pressing opens the void. */
${button} {
  background: var(--sr-cracks), ${slab} !important;
  border-color: ${edge} !important;
  border-radius: 1px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.1)}, inset 0 -2px 0 ${alpha(t.accent2, 0.45)} !important;
}
${buttonHover} {
  background: ${seep(0.28)}, var(--sr-cracks), ${slab} !important;
  border-color: ${t.accent} !important;
  box-shadow: inset 0 -2px 0 ${t.accent}, 0 0 10px -2px ${alpha(t.accent, 0.7)} !important;
}
${SEL.buttonDown} {
  background: ${voidFog(0.6)}, ${t.bg} !important;
  border-color: ${t.accent2} !important;
  box-shadow: inset 0 3px 8px #000000, inset 0 0 0 1px ${alpha(t.accent2, 0.6)} !important;
}

/* Text fields: dark recesses cut into the stone. */
${field} {
  background-color: ${mix(t.bg, t.surface, 0.4)} !important;
  border-color: ${edge} !important;
  border-radius: 1px !important;
  box-shadow: inset 0 2px 6px #000000, inset 0 -1px 0 ${alpha(t.accent, 0.4)} !important;
}
${fieldFocus} { outline: 1px solid ${t.accent} !important; box-shadow: inset 0 2px 6px #000000, 0 0 10px ${alpha(t.accent, 0.5)} !important; }

/* Pop-ups: a stone slab under the gaze of the Wdjat. */
${SEL.dialog} {
  background: ${voidFog(0.35)}, var(--sr-cracks), ${slab} !important;
  border-radius: 2px !important;
  box-shadow: 0 0 0 1px ${edge}, inset 0 0 0 1px ${alpha(t.accent, 0.25)}, 0 0 60px -12px ${alpha(t.accent2, 0.7)}, 0 24px 60px -18px #000000 !important;
}
${pseudo(SEL.dialog, 'before')} {
  content: ""; position: absolute; left: calc(50% - 30px); top: -20px; right: auto; bottom: auto; width: 60px; height: 36px; transform: none; pointer-events: none; z-index: 2;
  background: radial-gradient(ellipse at 50% 45%, ${t.surface} 45%, transparent 70%), ${t.surface}; border-radius: 50%; box-shadow: 0 0 0 1px ${edge}, 0 0 16px ${alpha(t.accent, 0.4)};
}
${pseudo(SEL.dialog, 'after')} {
  content: ""; position: absolute; left: calc(50% - 23px); top: -14px; right: auto; bottom: auto; width: 46px; height: 28px; transform: none; pointer-events: none; z-index: 3;
  background: var(--sr-eye) center / contain no-repeat;
}
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 18px ${alpha(t.accent2, 0.75)} !important; }
${pseudo(SEL.dialogTitle, 'after')} {
  content: ""; position: absolute; left: 8%; right: 8%; bottom: -8px; height: 9px; pointer-events: none;
  background: var(--sr-fracture) center / 100% 100% no-repeat;
}

/* Chat: a slab header split by a glowing fracture, the void beneath. */
${SEL.chatTop} {
  background: var(--sr-fracture) left bottom / 100% 8px no-repeat, var(--sr-cracks), ${slab} !important;
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.1)}, inset 0 0 0 1px ${edge} !important;
  border-radius: 1px 1px 0 0 !important;
}
${SEL.chat} { background: ${voidFog(0.22)}, ${t.surface} !important; box-shadow: inset 1px 0 0 ${edge}, inset -1px 0 0 ${edge}, inset 0 -1px 0 ${edge} !important; }
${sel(['#chats .chat .cout_txt'])} { background-color: ${mix(t.bg, t.surface, 0.4)} !important; border-color: ${alpha(t.accent, 0.2)} !important; }
${sel(['#chats .chat .black_line'])} { background-color: ${t.accent2} !important; }

/* Duel: the eye guards the life bar; phases are cracked rings of green light. */
${SEL.life} { border-color: ${edge} !important; border-radius: 1px !important; box-shadow: 0 0 0 1px #000000, 0 0 18px -4px ${alpha(t.accent2, 0.9)} !important; }
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -38px; top: 50%; width: 40px; height: 26px; margin-top: -13px; pointer-events: none;
  background: var(--sr-eye) center / contain no-repeat; filter: drop-shadow(0 0 3px ${t.accent});
}
${sel(['#duel .lifepoints .life_bar'])} { border-radius: 0 !important; }
${SEL.lifeSelf} { background: var(--sr-cracks), linear-gradient(180deg, ${alpha(t.text, 0.22)}, transparent 45%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: var(--sr-cracks), linear-gradient(180deg, ${alpha(t.text, 0.22)}, transparent 45%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: ${voidFog(0.5)}, #000000 !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 #000000, 0 0 6px #000000, 0 0 3px #000000 !important; }

${SEL.phase} { background: ${edge} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_inner'])} { background: radial-gradient(circle at 50% 100%, ${alpha(t.accent2, 0.35)}, transparent 60%), ${slab} !important; border-radius: 50% !important; }
${sel(['#duel .phase .background .background_top', '#duel .phase .phase_inner'])} { border-radius: 50% !important; }
${sel(['#duel .phase .background::after'])} {
  content: ""; position: absolute; inset: -14px; pointer-events: none;
  background: ${svgUrl(eyeRing(t, kit))} center / 100% 100% no-repeat; opacity: 0.85;
}
${sel(['#duel .phase.active .background::after'])} { opacity: 1; filter: drop-shadow(0 0 4px ${t.accent}); }
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 22px ${alpha(t.self, 0.8)} !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 22px ${alpha(t.opp, 0.7)} !important; }
${sel(['#duel .phase span'])} { text-shadow: 0 1px 0 #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${edge} !important; border-radius: 1px !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${slab} !important; border-radius: 0 !important; }
${sel(['#duel #watchers'])} { background: ${voidFog(0.2)}, ${t.surface} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 0 -2px 0 ${t.accent2} !important; }

/* Duel room panels: slabs over the void, a green-to-violet rim. */
${panels} { background: ${voidFog(0.2)}, var(--sr-cracks), ${alpha(t.surface, 0.9)} !important; border-radius: 2px !important; }
${pseudo(panels, 'before')} { filter: none !important; background: linear-gradient(170deg, ${mix(t.accent, t.border, 0.5)}, ${t.border} 35%, ${t.border} 65%, ${t.accent2}) !important; }
${sel(['#duel_room .format_txt', '#duel_room #host_bg > span', '#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span'])} { text-shadow: 0 2px 0 #000000, 0 0 18px ${alpha(t.accent2, 0.7)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${slab} !important; opacity: 0.95 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${seep(0.14)}, ${slab} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(t.accent, 0.18)} !important; }
${sel(['#duel_room .duelbutton:hover'])} { border-color: ${t.accent} !important; }

/* Deck constructor: the deck on a cracked slab, search under the eye. */
${sel(['#deck_constructor .deck_bg'])} { background: var(--sr-eye-faint) 55% 82% / 300px 180px no-repeat, ${voidFog(0.25)}, var(--sr-cracks), ${mix(t.surface, t.bg, 0.3)} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 3px 0 0 ${t.accent2} !important; }
${sel(['#deck_constructor .side_bg'])} { background: var(--sr-cracks), ${mix(t.surface, t.accent, 0.1)} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 3px 0 0 ${t.accent} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: var(--sr-cracks), ${mix(t.surface, t.accent2, 0.14)} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 3px 0 0 ${t.accent2} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: var(--sr-eye-faint) center 70% / 240px 144px no-repeat, ${voidFog(0.3)}, var(--sr-cracks), ${slab} !important; box-shadow: inset 0 0 0 1px ${edge} !important; border-radius: 2px 2px 0 0 !important; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 1 !important; text-shadow: 0 0 14px ${alpha(t.accent2, 0.8)} !important; }
${sel(['#deck_constructor #search .title_txt'])} { text-shadow: 0 2px 0 #000000, 0 0 18px ${alpha(t.accent2, 0.7)} !important; }

/* Settings boxes: slabs, their colour family glowing through the bottom crack. */
${setPanels} { background-image: ${voidFog(0.2)}, var(--sr-cracks) !important; border-radius: 2px !important; }
${Object.entries(families).map(([tk, list]) => `${sel(list.map((c) => `#settings .${c}`))} { background-color: color-mix(in srgb, ${t.surface} 92%, ${t[tk]}) !important; border-color: color-mix(in srgb, ${t[tk]} 32%, ${t.border}) !important; box-shadow: inset 0 -3px 0 ${alpha(t[tk], 0.6)}, 0 16px 30px -16px #000000 !important; }`).join(' ')}

/* Scrollbars: a vein of green light. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, transparent 25%, ${t.accent} 50%, transparent 75%), ${alpha(t.accent2, 0.35)} !important; border-radius: 1px !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, transparent 25%, ${t.accent} 50%, transparent 75%), ${alpha(t.accent2, 0.35)} !important; }
@media (prefers-reduced-motion: reduce) { html body #content *::before { transition: none !important; } }
`;
};
