// Ritual: the mottled cobalt of a Ritual card frame, carved altar stone,
// rune-ringed summoning circles and candle flames. Panels are chiselled
// slabs; the circle glows candle-gold where something is being invoked.
import { mix } from '../../../lib/color.js';

export default (t, kit) => {
  const { SEL, sel, svgUrl, svg, alpha, n1 } = kit;
  // DuelingBook's pop-up buttons (OK/Yes primary, No/Cancel secondary) are
  // <img> SVGs: redrawn here in the theme's material. Palettes are
  // [top, middle, bottom, edge, inner line, label].
  const btnFace = (P, S, rx, extra = () => '') => (l, w, h, p) => {
    const c = p ? P : S;
    const bw = n1(w - 12);
    const bh = n1(h - 20);
    return svg(w, h, `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".5" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="${bh}" rx="${rx}" fill="url(#b)" stroke="${c[3]}" stroke-width="3"/><rect x="10.5" y="14.5" width="${n1(bw - 9)}" height="${n1(bh - 9)}" rx="${Math.max(0, rx - 4)}" fill="none" stroke="${c[4]}" stroke-width="1.5"/>${extra(w, h, p)}<text x="${n1(w / 2)}" y="${n1(h / 2 + 1)}" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="26" fill="${c[5]}">${l}</text>`);
  };
  const popButtons = (face) =>
    [['ok_btn', 'OK', 0, 1], ['yes_btn', 'Yes', 0, 1], ['no_btn', 'No', 0, 0], ['cancel_btn', 'Cancel', 1, 0]]
      .map(([n, l, wide, p]) => `${sel([`#content img[src*="/svg/${n}"]`, `#content img[data-src*="/svg/${n}"]`])} { content: ${svgUrl(face(l, wide ? 234.85 : 153.4, wide ? 78.5 : 78.47, p))} !important; }`)
      .join('\n');
  // Panel titles straddle the frame line: copies of the glyphs in the panel
  // colour, shifted sideways, close the word gaps so the line never shows.
  const titleHalo = (c) => `${[3, 7, 11].map((x) => `-${x}px 0 2px ${c}, ${x}px 0 2px ${c}`).join(', ')}, 0 -3px 2px ${c}, 0 3px 3px ${c}`;
  const blue = t.accent;
  const candle = t.accent2;
  const frameBlue = mix(blue, t.bg, 0.42);
  const stone = mix(t.raised, t.muted, 0.12);
  const stoneDark = mix(t.surface, t.bg, 0.5);
  const hiStone = mix(t.muted, '#ffffff', 0.2);
  const [r, g, b] = [1, 3, 5].map((i) => (parseInt(t.text.slice(i, i + 2), 16) / 255).toFixed(3));

  // Altar stone grain.
  const grain = svgUrl(svg(140, 140, `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 .09 0"/></filter><rect width="140" height="140" filter="url(#n)"/>`));
  // The Ritual card frame's mottling: soft lighter blots.
  const mottle = svgUrl(svg(90, 90, `<g fill="${blue}"><circle cx="14" cy="18" r="9" fill-opacity=".1"/><circle cx="60" cy="10" r="6" fill-opacity=".08"/><circle cx="44" cy="52" r="12" fill-opacity=".07"/><circle cx="80" cy="70" r="7" fill-opacity=".1"/><circle cx="12" cy="76" r="5" fill-opacity=".08"/></g>`));

  // Runes (futhark-like strokes) for the circle's band.
  const RUNES = ['M0-4v8M0-4l3 2M0-1l3 2', 'M-2-4v8M-2-4l4 4-4 4', 'M0-4v8M-3-4l3 3 3-3', 'M-2 4l2-8 2 8M-1.2 1h2.4', 'M0-4v8M-3-1l3-3 3 3M-3 3l3-3 3 3', 'M-3-4l6 8M3-4l-6 8', 'M0-4l3 4-3 4-3-4z', 'M-2-4v8l4-4z'];
  const circle = (c, o, sw = 1.4) => {
    let runes = '';
    for (let i = 0; i < 8; i++) runes += `<path d="${RUNES[i]}" transform="rotate(${i * 22.5} 60 60) translate(60 8.5)"/>`;
    runes = `<g id="r">${runes}</g><use href="#r" transform="rotate(180 60 60)"/>`;
    const tri = (rot) => {
      const p = [0, 1, 2].map((k) => {
        const a = ((rot + k * 120 - 90) * Math.PI) / 180;
        return `${(60 + Math.cos(a) * 40).toFixed(1)} ${(60 + Math.sin(a) * 40).toFixed(1)}`;
      });
      return `<path d="M${p.join('L')}Z"/>`;
    };
    return svg(120, 120, `<g fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><circle cx="60" cy="60" r="57"/><circle cx="60" cy="60" r="44"/><g stroke-width="${sw * 0.9}">${runes}</g>${tri(0)}${tri(180)}<circle cx="60" cy="60" r="18"/></g><circle cx="60" cy="60" r="3" fill="${c}" fill-opacity="${o}"/>`);
  };

  // A candle flame (inner white-gold, outer candle gold) on a stub of wax.
  const flame = `<path d="M6 1C9 6 10 9 10 11.5A4 4 0 0 1 2 11.5C2 9 3.5 7 6 1Z" fill="${candle}"/><path d="M6 6C7.4 8.4 8 9.8 8 11.3A2 2 0 0 1 4 11.3C4 10 4.8 8.6 6 6Z" fill="${mix(candle, '#ffffff', 0.7)}"/><rect x="3" y="15" width="6" height="6" rx="1" fill="${mix(t.text, candle, 0.2)}"/><path d="M6 13v2" stroke="${t.bg}" stroke-width="1"/>`;
  const candles = svgUrl(svg(12, 21, flame));

  const bevel = `inset 1px 1px 0 ${alpha(hiStone, 0.35)}, inset -1px -1px 0 ${alpha('#000000', 0.6)}`;
  const slab = `var(--ri-grain), linear-gradient(160deg, ${stone}, ${stoneDark})`;
  const cardBlue = `var(--ri-mottle), var(--ri-grain), linear-gradient(180deg, ${mix(frameBlue, t.raised, 0.3)}, ${mix(frameBlue, t.bg, 0.45)})`;
  const runeText = `color: ${mix(blue, '#ffffff', 0.35)} !important; text-shadow: var(--ri-title) !important;`;
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const PANELS = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const panel = (suffix = '') => sel(PANELS.map((p) => `#duel_room ${p}${suffix}`));

  const SETTINGS = SEL.settingsPanel;

  return `
html body {
  --ri-grain: ${grain};
  --ri-mottle: ${mottle};
  --ri-circle: ${svgUrl(circle(blue, 0.1))};
  --ri-etch: ${svgUrl(circle(mix(blue, '#ffffff', 0.4), 0.3, 2.6))};
  --ri-title: 0 1px 0 ${alpha('#000000', 0.9)}, ${titleHalo(stoneDark)}, 0 0 16px ${alpha(blue, 0.55)};
  --ri-circle-glow: ${svgUrl(circle(candle, 0.5, 1.6))};
  --ri-candles: ${candles};
}
/* ---------- Menu tiles: altar slabs, a circle carved under each name, candles at the corners ---------- */
${SEL.tile} {
  background: var(--ri-etch) 50% 50% / 56px 56px no-repeat, ${slab} !important;
  border-color: ${frameBlue} !important;
  border-radius: 3px !important;
  box-shadow: ${bevel}, inset 0 0 0 1px ${alpha(t.bg, 0.8)}, inset 0 0 0 2px ${alpha(blue, 0.25)}, 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; left: 3px; right: 3px; top: -19px; height: 24px; pointer-events: none;
  background: var(--ri-candles) 0 0 / 14px 24px no-repeat, var(--ri-candles) 100% 0 / 14px 24px no-repeat;
  filter: drop-shadow(0 0 4px ${alpha(candle, 0.7)}); opacity: 0.9; transition: opacity 0.25s, filter 0.25s;
}
${SEL.tileHover} {
  background: var(--ri-circle-glow) 50% 50% / 56px 56px no-repeat, radial-gradient(ellipse 60% 90% at 50% 50%, ${alpha(candle, 0.18)}, transparent 70%), ${slab} !important;
  border-color: ${mix(candle, frameBlue, 0.4)} !important;
  box-shadow: ${bevel}, inset 0 0 0 2px ${alpha(candle, 0.35)}, 0 0 20px -6px ${alpha(candle, 0.7)}, 0 12px 22px -12px ${alpha('#000000', 0.95)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; filter: drop-shadow(0 0 7px ${candle}); }
${sel(['#main_menu .menu_btn:active .content'])} { background: var(--ri-circle-glow) 50% 50% / 56px 56px no-repeat, ${stoneDark} !important; box-shadow: inset 0 3px 10px ${alpha('#000000', 0.9)} !important; }
${SEL.tileLabel} { transform: scale(0.9); color: ${t.text} !important; text-shadow: 0 2px 0 ${alpha('#000000', 0.85)}, 0 0 10px ${alpha(t.bg, 0.9)} !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${mix(candle, '#ffffff', 0.55)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu'])} { background: ${slab} !important; box-shadow: inset 0 -1px 0 ${alpha(blue, 0.3)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu::before'])} { content: none; }
${sel(['#main_menu .main_menu_circle .background'])} { background-color: ${candle} !important; }

/* ---------- Headings: carved, lit from within ---------- */
${sel(['#content .title1', '#content .title2', '#content .subtitle', '#content .admin_lbl'])} { ${runeText} }

/* ---------- Buttons: small chiselled stones, candle-lit on hover ---------- */
${SEL.button} {
  background: var(--ri-grain), linear-gradient(180deg, ${mix(stone, '#ffffff', 0.04)}, ${stoneDark}) !important;
  border-color: ${frameBlue} !important;
  border-radius: 2px !important;
  color: ${t.text} !important;
  box-shadow: ${bevel}, 0 2px 3px ${alpha('#000000', 0.7)} !important;
}
${SEL.buttonHover} {
  background: radial-gradient(ellipse 80% 120% at 50% 100%, ${alpha(candle, 0.3)}, transparent 70%), var(--ri-grain), linear-gradient(180deg, ${stone}, ${stoneDark}) !important;
  border-color: ${candle} !important;
  color: ${t.text} !important;
  box-shadow: ${bevel}, 0 0 9px -1px ${alpha(candle, 0.7)} !important;
}
${SEL.buttonDown} { background: ${stoneDark} !important; border-color: ${candle} !important; box-shadow: inset 0 2px 6px ${alpha('#000000', 0.9)} !important; }

/* ---------- Text fields: grooves cut into the altar ---------- */
${SEL.field} {
  background-color: ${mix(t.bg, t.surface, 0.3)} !important;
  border-color: ${frameBlue} !important;
  box-shadow: inset 1px 2px 3px ${alpha('#000000', 0.85)}, 0 1px 0 ${alpha(hiStone, 0.2)} !important;
}
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${candle} !important; box-shadow: inset 1px 2px 3px ${alpha('#000000', 0.85)}, 0 0 8px ${alpha(candle, 0.5)} !important; }

/* ---------- Pop-ups: the altar, its summoning circle and two candles ---------- */
${SEL.dialog} {
  background: var(--ri-circle) 50% calc(50% + 70px) / 290px 290px no-repeat, radial-gradient(ellipse 60% 60% at 50% 70%, ${alpha(blue, 0.12)}, transparent 70%), ${slab} !important;
  border-radius: 4px !important;
  box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, 0 0 0 5px ${frameBlue}, 0 0 0 6px ${alpha(blue, 0.6)}, 0 30px 70px -20px ${alpha('#000000', 0.95)}, 0 0 50px -10px ${alpha(blue, 0.35)} !important;
}
${sel(DIALOGS.map((d) => `#content ${d}::before`))} {
  content: ""; position: absolute; inset: 7px; width: auto; height: auto; transform: none; background: none;
  border: 1px solid ${alpha(blue, 0.35)}; border-radius: 2px; box-shadow: ${bevel}, inset 0 0 30px ${alpha('#000000', 0.5)}; pointer-events: none; z-index: 0;
}
${sel(DIALOGS.map((d) => `#content ${d}::after`))} {
  content: ""; position: absolute; left: 14px; right: 14px; top: -26px; bottom: auto; width: auto; height: 34px; transform: none;
  background: var(--ri-candles) 0 0 / 20px 34px no-repeat, var(--ri-candles) 100% 0 / 20px 34px no-repeat;
  filter: drop-shadow(0 0 6px ${alpha(candle, 0.85)}); pointer-events: none; z-index: 1;
}
${SEL.dialogTitle} { ${runeText} }

/* ---------- Chat: a Ritual-blue lintel over the altar ---------- */
${SEL.chatTop} {
  background: ${cardBlue} !important;
  box-shadow: inset 0 1px 0 ${alpha(blue, 0.5)}, inset 0 -2px 0 ${candle}, inset 0 -3px 0 ${alpha('#000000', 0.6)} !important;
}
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important; }
${SEL.chat} {
  background: var(--ri-circle) 50% 70% / 180px 180px no-repeat, ${slab} !important;
  box-shadow: inset 0 0 0 1px ${frameBlue}, inset 0 0 0 3px ${alpha('#000000', 0.5)}, inset 0 0 0 4px ${alpha(blue, 0.2)} !important;
}
${sel(['#chats .chat .cout_txt', '#chats .chat .log_txt'])} { background-color: transparent !important; }
${sel(['#chats .chat .chat_bottom'])} { box-shadow: inset 0 1px 0 ${alpha(candle, 0.5)}; }

/* ---------- Duel: life carved with runes, a candle at its end ---------- */
${SEL.life} {
  border-color: ${frameBlue} !important;
  background: repeating-linear-gradient(90deg, transparent 0 14px, ${alpha(t.bg, 0.55)} 14px 15px), linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 50%) !important;
  box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, inset 0 0 0 1px ${alpha(blue, 0.4)}, 0 0 10px -2px ${alpha(blue, 0.55)} !important;
}
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -17px; top: -8px; width: 12px; height: 21px;
  background: var(--ri-candles) center / contain no-repeat; filter: drop-shadow(0 0 4px ${alpha(candle, 0.9)});
}
${SEL.lifeSelf} { background: linear-gradient(90deg, ${mix(t.self, '#000000', 0.55)}, ${t.self} 75%, ${mix(t.self, candle, 0.5)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(90deg, ${mix(t.opp, '#000000', 0.55)}, ${t.opp} 75%, ${mix(t.opp, '#ffffff', 0.3)}) !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, 0 0 6px ${alpha('#000000', 0.8)} !important; }

/* Phases: rune-ringed stones; the active one is a lit summoning circle */
${SEL.phase} { background: repeating-conic-gradient(${frameBlue} 0deg 12deg, ${mix(frameBlue, t.bg, 0.4)} 12deg 15deg) !important; box-shadow: 0 2px 6px ${alpha('#000000', 0.8)}; }
${sel(['#duel .phase .background .background_top'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.2)}, transparent 55%) !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${slab} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--ri-circle) center / 100% 100% no-repeat, radial-gradient(circle at 50% 35%, ${stone}, ${stoneDark} 80%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--ri-circle-glow) center / 100% 100% no-repeat, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.15)}, ${t.self} 45%, ${mix(t.self, '#000000', 0.55)} 85%) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--ri-circle-glow) center / 100% 100% no-repeat, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.15)}, ${t.opp} 45%, ${mix(t.opp, '#000000', 0.55)} 85%) !important; }
${sel(['#duel .phase.active .background::before'])} {
  content: ""; position: absolute; inset: -10px; border-radius: 50%;
  background: var(--ri-circle-glow) center / 100% 100% no-repeat; opacity: 0.9;
  filter: drop-shadow(0 0 5px ${alpha(candle, 0.8)}); animation: dbte-ritual-turn 40s linear infinite;
}
@keyframes dbte-ritual-turn { to { transform: rotate(360deg); } }
${sel(['#duel .phase span'])} { color: ${t.muted} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.9)} !important; }
${sel(['#duel .phase.active span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${alpha('#000000', 0.95)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${frameBlue} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${slab} !important; }
${sel(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${frameBlue}; }
${sel(['#duel .cout_txt'])} { background: ${slab} !important; box-shadow: inset 0 0 0 2px ${frameBlue}, inset 0 0 0 3px ${alpha(blue, 0.4)}, ${bevel} !important; }
${sel(['#duel #preview_txt'])} { box-shadow: inset 0 0 0 1px ${frameBlue}, inset 0 3px 0 ${alpha(blue, 0.35)}; }

/* ---------- Duel room: Ritual-blue frames around altar slabs ---------- */
${panel('::before')} { background: linear-gradient(160deg, ${mix(blue, '#ffffff', 0.2)}, ${frameBlue} 35%, ${mix(frameBlue, t.bg, 0.4)} 70%, ${blue}) !important; filter: none !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(160deg, ${mix(candle, '#ffffff', 0.3)}, ${candle} 40%, ${frameBlue}) !important; }
${panel()} { background: var(--ri-circle) calc(100% + 40px) -40px / 160px 160px no-repeat, ${slab} !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.95)}; }
${sel(['#duel_room #formats .format .format_inner', '#duel_room #formats .format_inner[id]'])} { background-color: ${alpha(stoneDark, 0.85)} !important; }
${sel(['#duel_room .duelbutton .background'])} { background-color: ${stone} !important; opacity: 0.85 !important; }
${sel(['#duel_room .format_txt', '#duel_room span.arial_black2', '#duel_room .title_txt.arial_black2'])} { ${runeText} }
${sel(['#duel_room .duelbutton'])} { border-color: transparent !important; box-shadow: inset 0 -1px 0 ${alpha(blue, 0.3)}, inset 0 1px 0 ${alpha(hiStone, 0.12)}; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(candle, 0.25)}, ${alpha(candle, 0.05)}) !important; opacity: 1 !important; }
${sel(['#duel_room .duelbutton .game_type'])} { color: ${candle} !important; }

/* ---------- Deck constructor ---------- */
${sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg'])} {
  background: ${slab} !important;
  box-shadow: inset 0 0 0 2px ${frameBlue}, inset 0 0 0 3px ${alpha(blue, 0.5)}, ${bevel} !important;
}
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { ${runeText} opacity: 1 !important; }
${sel(['#deck_constructor #search .search_bg'])} {
  background: var(--ri-circle) 50% 100% / 200px 200px no-repeat, ${slab} !important;
  box-shadow: inset 0 0 0 2px ${frameBlue}, inset 0 4px 0 ${alpha(blue, 0.45)} !important;
}
${sel(['#deck_constructor #search .title_txt'])} { ${runeText} }
${sel(['#deck_constructor #search .search_prev_btn', '#deck_constructor #search .search_next_btn'])} { background-color: ${blue} !important; }
${sel(['#deck_constructor #search .search_prev_btn:hover', '#deck_constructor #search .search_next_btn:hover'])} { background-color: ${candle} !important; }

/* ---------- Pop-up buttons ---------- */
${popButtons(btnFace([mix(blue, t.bg, 0.22), mix(blue, t.bg, 0.5), mix(blue, t.bg, 0.66), mix(blue, t.bg, 0.82), alpha('#ffffff', 0.5), '#ffffff'], [stone, stoneDark, mix(stoneDark, t.bg, 0.4), frameBlue, alpha(hiStone, 0.3), t.text], 8))}

/* ---------- Settings panels ---------- */
${SETTINGS} { background: ${slab} !important; border-color: ${frameBlue} !important; border-radius: 4px !important; box-shadow: ${bevel}, inset 0 0 0 1px ${alpha(blue, 0.3)}, 0 12px 26px -12px ${alpha('#000000', 0.95)} !important; }

/* ---------- Scrollbars ---------- */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${frameBlue}, ${blue}, ${frameBlue}) !important; }
${sel(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: ${candle} !important; }

@media (prefers-reduced-motion: reduce) { html body #content *, html body #content *::before, html body #content *::after { transition: none !important; animation: none !important; } }
`;
};
