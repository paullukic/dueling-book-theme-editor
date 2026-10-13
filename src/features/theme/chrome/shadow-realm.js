// Shadow Realm: a Shadow Game arena. Cracked grey-green stone slabs with eerie
// green light leaking through the fractures, a green-into-violet fog band
// along every plate, and the void vortex sealed on pop-ups and the life bar.

import { mix } from '../../../lib/color.js';
import { svgUrl as kitSvgUrl } from './kit.js';

const r1 = (v) => Math.round(v * 10) / 10;

// Compact data URI: only the characters CSS and URLs need escaped.
// One decimal place is plenty for these drawings.
const svgUrl = (text) => kitSvgUrl(text.replace(/(\d\.\d)\d+/g, '$1'));

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

// The void vortex: a cracked seal ring around a spiral sucking inward,
// green at the rim fading into violet at the core.
const vortex = (t, kit) => {
  let d = 'M30 30';
  for (let i = 1; i < 70; i++) {
    const a = i * 0.26;
    const r = i * 0.36;
    d += `L${r1(30 + Math.cos(a) * r)} ${r1(30 + Math.sin(a) * r)}`;
  }
  return kit.svg(60, 60, `<defs><radialGradient id="v"><stop offset="0" stop-color="${t.accent2}"/><stop offset="0.6" stop-color="${mix(t.accent2, t.bg, 0.6)}"/><stop offset="1" stop-color="${t.bg}"/></radialGradient></defs><circle cx="30" cy="30" r="27" fill="url(#v)"/><path d="${d}" fill="none" stroke="${t.accent}" stroke-width="1.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${t.accent2}" stroke-width="1" transform="rotate(180 30 30)"/><path d="M30 3A27 27 0 0 1 54 18M57 30A27 27 0 0 1 42 54M30 57A27 27 0 0 1 6 42M3 30A27 27 0 0 1 18 6" fill="none" stroke="${t.accent}" stroke-width="2.2"/><path d="M54 18l-5 2M42 54l1-5M6 42l5-1M18 6l1 5" stroke="${t.accent}" stroke-width="1.2"/>`);
};

// Pop-up buttons: dark stone, a 1px neon-green edge, green label, soft glow.
const FONT = 'Segoe UI, system-ui, Roboto, Arial, sans-serif';
const POP = [['ok_btn', 'OK', 153.4, 78.47, true], ['yes_btn', 'Yes', 153.4, 78.47, true], ['no_btn', 'No', 153.4, 78.47, false], ['cancel_btn', 'Cancel', 234.85, 78.5, false]];
const popButton = (t, label, W, H, primary) => {
  const c = primary ? t.accent : mix(t.accent, t.muted, 0.55);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><filter id="g" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="3"/></filter></defs><rect x="9" y="11" width="${W - 18}" height="56" rx="3" fill="none" stroke="${c}" stroke-opacity="0.6" stroke-width="3" filter="url(#g)"/><rect x="9" y="11" width="${W - 18}" height="56" rx="3" fill="${mix(t.bg, t.surface, 0.6)}" stroke="${c}" stroke-width="1.4"/><path d="M14 62H${W - 14}" stroke="${t.accent2}" stroke-opacity="0.6" stroke-width="2"/><text x="${W / 2}" y="40" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="26" fill="${c}">${label}</text></svg>`;
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
  return kit.svg(100, 100, `<path d="${arcs}" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="5"/><path d="${arcs}" fill="none" stroke="${t.accent}" stroke-width="1.6"/>`);
};

export default (t, kit) => {
  const { sel, SEL, alpha } = kit;
  const pseudo = (list, p) => list.split(', ').map((s) => `${s}::${p}`).join(', ');
  const slab = `linear-gradient(180deg, ${mix(t.surface, t.accent, 0.04)} 0%, ${mix(t.bg, '#000000', 0.35)} 100%)`;
  const voidFog = (o) => `radial-gradient(ellipse 90% 70% at 50% 120%, ${alpha(t.accent2, o)}, transparent 70%)`;
  const seep = (o) => `radial-gradient(ellipse 60% 80% at 50% 50%, ${alpha(t.accent, o)}, transparent 70%)`;
  const edge = mix(t.border, t.accent, 0.45);
  const plate = t.surface;
  const halo = `0 0 3px ${plate}, 0 0 5px ${plate}, 0 0 7px ${plate}, 0 0 9px ${plate}, 0 0 9px ${plate}`;

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
  --sr-runes: ${svgUrl(kit.svg(64, 8, `<g fill="none" stroke="${t.accent}" stroke-width="1" stroke-linecap="round"><path d="M2 7V1l4 3-4 3M12 1v6M10 3h4M20 7l3-6 3 6M32 1h4v6M42 1l4 6M46 1l-4 6M52 7V1h4M52 4h3M60 1v6"/></g>`))};
  --sr-vortex: ${svgUrl(vortex(t, kit))};
  --sr-fracture: ${svgUrl(fracture(t, kit))};
}

/* Menu tiles: cracked arena slabs, the void below, the eye watching. */
${SEL.tile} {
  background: ${slab} !important;
  border-color: transparent !important;
  border-radius: 1px !important;
  box-shadow: inset 0 0 0 1px ${edge}, 0 14px 28px -12px #000000 !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; left: 1px; right: 1px; bottom: 1px; height: 45%; pointer-events: none;
  background: var(--sr-runes) left 6px bottom 4px / 64px 8px repeat-x, radial-gradient(ellipse 35% 90% at 20% 100%, ${alpha(t.accent2, 0.55)}, transparent 70%), radial-gradient(ellipse 45% 90% at 75% 100%, ${alpha(t.accent2, 0.6)}, transparent 70%), linear-gradient(0deg, ${alpha(t.accent2, 0.25)}, transparent); opacity: 0.85; transition: opacity 0.25s;
}
${SEL.tileHover} {
  background: ${slab} !important;
  box-shadow: inset 0 0 0 1px ${t.accent}, 0 0 24px -6px ${alpha(t.accent, 0.75)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; }
${sel(['#main_menu .menu_btn:active .content'])} { background: ${voidFog(0.5)}, ${t.bg} !important; box-shadow: inset 0 3px 10px #000000, inset 0 0 0 1px ${t.accent} !important; }
${sel(['#main_menu .menu_btn .content span', '#main_menu .menu_btn span'])} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 14px ${alpha(t.accent, 0.6)} !important; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${edge} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${t.accent} !important; box-shadow: 0 0 8px ${t.accent}; }

/* Page titles: a glowing fracture beneath. */
${sel(['#content .title1'])} { color: ${t.text} !important; text-shadow: 0 3px 0 #000000, 0 0 26px ${alpha(t.accent, 0.45)} !important; }
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
  box-shadow: inset 0 1px 0 ${alpha(t.text, 0.1)}, inset 0 -2px 0 ${alpha(t.accent, 0.4)} !important;
}
${buttonHover} {
  background: ${seep(0.28)}, var(--sr-cracks), ${slab} !important;
  border-color: ${t.accent} !important;
  box-shadow: inset 0 -2px 0 ${t.accent}, 0 0 10px -2px ${alpha(t.accent, 0.7)} !important;
}
${SEL.buttonDown} {
  background: ${voidFog(0.6)}, ${t.bg} !important;
  border-color: ${t.accent} !important;
  box-shadow: inset 0 3px 8px #000000, inset 0 0 0 1px ${alpha(t.accent, 0.6)} !important;
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
  box-shadow: 0 0 0 1px ${edge}, inset 0 0 0 1px ${alpha(t.accent, 0.25)}, 0 0 60px -12px ${alpha(t.accent2, 0.5)}, 0 0 0 2px ${alpha(t.accent, 0.35)}, 0 24px 60px -18px #000000 !important;
}
${pseudo(SEL.dialog, 'before')} {
  content: ""; position: absolute; left: calc(50% - 26px); top: -26px; right: auto; bottom: auto; width: 52px; height: 52px; transform: none; pointer-events: none; z-index: 2;
  background: ${t.bg}; border-radius: 50%; box-shadow: 0 0 0 1.5px ${t.accent}, 0 0 18px ${alpha(t.accent, 0.5)};
}
${pseudo(SEL.dialog, 'after')} {
  content: ""; position: absolute; left: calc(50% - 23px); top: -23px; right: auto; bottom: auto; width: 46px; height: 46px; transform: none; pointer-events: none; z-index: 3;
  background: var(--sr-vortex) center / contain no-repeat;
}
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 #000000, 0 0 18px ${alpha(t.accent, 0.45)} !important; }
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
${sel(['#chats .chat .black_line'])} { background-color: ${t.accent} !important; }

/* Duel: the eye guards the life bar; phases are cracked rings of green light. */
${SEL.life} { border-color: ${edge} !important; border-radius: 1px !important; box-shadow: 0 0 0 1px #000000, 0 0 18px -4px ${alpha(t.accent, 0.7)} !important; }
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; z-index: 3; left: -24px; top: 50%; width: 34px; height: 34px; margin-top: -17px; pointer-events: none;
  background: var(--sr-vortex) center / contain no-repeat; filter: drop-shadow(0 0 3px ${t.accent});
}
${sel(['#duel .lifepoints .life_bar'])} { border-radius: 0 !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha(t.text, 0.22)}, transparent 45%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha(t.text, 0.22)}, transparent 45%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
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
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 0 2px ${alpha(t.self, 0.9)}, 0 0 14px 2px ${alpha(mix(t.self, '#ffffff', 0.4), 0.7)}, 0 0 30px 6px ${alpha(t.self, 0.85)} !important; }
/* In a duel the vortex's dark heart and the eye above it sit behind the opponent's zones and deck: gone there. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-sr-instage { display: none; }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-sr-nomenu { display: none; }
/* Menu: the floating slab shrinks into the right gutter, off the last Reply and timestamp. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-sr-slab { transform-origin: 0 0; transform: translate(887.5px, 382.7px) scale(0.42); }
${sel(['#duel .phase.active:has(.phase_inner.blue) .background'])} { box-shadow: 0 0 0 2px ${alpha(t.opp, 0.9)}, 0 0 14px 2px ${alpha(mix(t.opp, '#ffffff', 0.4), 0.6)}, 0 0 30px 6px ${alpha(t.opp, 0.8)} !important; }
${sel(['#duel .phase span'])} { color: ${mix(t.text, t.muted, 0.2)} !important; text-shadow: 0 1px 0 #000000, 0 0 4px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${edge} !important; border-radius: 1px !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${slab} !important; border-radius: 0 !important; }
${sel(['#duel #watchers'])} { background: ${voidFog(0.2)}, ${t.surface} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 0 -2px 0 ${t.accent} !important; }

/* Pop-up buttons: dark stone, neon-green edge. */
${POP.map(([n, label, w, h, p]) => `${sel([`#content img[src*="/svg/${n}"]`, `#content img[data-src*="/svg/${n}"]`])} { content: ${svgUrl(popButton(t, label, w, h, p))} !important; }`).join(' ')}

/* Duel room panels: slabs over the void, a green-to-violet rim. */
${panels} { background: ${voidFog(0.2)}, var(--sr-cracks), ${alpha(t.surface, 0.9)} !important; border-radius: 2px !important; }
${pseudo(panels, 'before')} { filter: none !important; background: linear-gradient(170deg, ${mix(t.accent, t.border, 0.5)}, ${t.border} 35%, ${t.border} 65%, ${t.accent}) !important; }
${sel(['#duel_room .format_txt', '#duel_room #host_bg > span', '#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#settings .admin_lbl'])} { color: ${t.text} !important; text-shadow: ${halo}, 0 2px 0 #000000, 0 0 18px ${alpha(t.accent, 0.45)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${slab} !important; opacity: 0.95 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${seep(0.14)}, ${slab} !important; }
${sel(['#duel_room .duelbutton'])} { border-color: ${alpha(t.accent, 0.18)} !important; }
${sel(['#duel_room .duelbutton:hover'])} { border-color: ${t.accent} !important; }

/* Deck constructor: the deck on a cracked slab, search under the eye. */
${sel(['#deck_constructor .deck_bg'])} { background: ${voidFog(0.25)}, var(--sr-cracks), ${mix(t.surface, t.bg, 0.3)} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 3px 0 0 ${t.accent2} !important; }
${sel(['#deck_constructor .side_bg'])} { background: var(--sr-cracks), ${mix(t.surface, t.accent, 0.1)} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 3px 0 0 ${t.accent} !important; }
${sel(['#deck_constructor .extra_bg'])} { background: var(--sr-cracks), ${mix(t.surface, t.accent2, 0.14)} !important; box-shadow: inset 0 0 0 1px ${edge}, inset 3px 0 0 ${t.accent2} !important; }
${sel(['#deck_constructor #search .search_bg'])} { background: ${voidFog(0.3)}, var(--sr-cracks), ${slab} !important; box-shadow: inset 0 0 0 1px ${edge} !important; border-radius: 2px 2px 0 0 !important; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${t.text} !important; opacity: 1 !important; text-shadow: 0 0 14px ${alpha(t.accent, 0.5)} !important; }
${sel(['#deck_constructor #search .title_txt'])} { text-shadow: 0 2px 0 #000000, 0 0 18px ${alpha(t.accent, 0.45)} !important; }

/* Settings boxes: slabs, their colour family glowing through the bottom crack. */
${setPanels} { background-image: ${voidFog(0.2)}, var(--sr-cracks) !important; border-radius: 2px !important; }
${Object.entries(families).map(([tk, list]) => `${sel(list.map((c) => `#settings .${c}`))} { background-color: color-mix(in srgb, ${t.surface} 92%, ${t.accent}) !important; border-color: color-mix(in srgb, ${t.accent} 32%, ${t.border}) !important; box-shadow: inset 0 -3px 0 ${alpha(t.accent, 0.6)}, 0 16px 30px -16px #000000 !important; }`).join(' ')}

/* Scrollbars: a vein of green light. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, transparent 25%, ${t.accent} 50%, transparent 75%), ${alpha(t.accent2, 0.35)} !important; border-radius: 1px !important; }
${sel(['#content .os-scrollbar-horizontal .os-scrollbar-handle'])} { background: linear-gradient(180deg, transparent 25%, ${t.accent} 50%, transparent 75%), ${alpha(t.accent2, 0.35)} !important; }
@media (prefers-reduced-motion: reduce) { html body #content *::before { transition: none !important; } }
`;
};
