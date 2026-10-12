// Divine Beasts: Egyptian God cards. Gold cartouche frames (rounded double
// gold line, the shen bar closing the right end), hieroglyph bands, the
// winged sun disc of Ra; Ra gold is your side, Obelisk lapis the opponent's,
// Slifer red only joins the three-god ornaments.
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
  const gold = t.accent;
  const hi = mix(gold, '#ffffff', 0.45);
  const lo = mix(gold, t.bg, 0.5);
  const deep = mix(t.surface, t.bg, 0.5);
  const ra = t.accent;
  const slifer = t.danger;
  const self = t.self;
  const obelisk = t.opp;
  const grad = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".45" stop-color="${gold}"/><stop offset="1" stop-color="${lo}"/></linearGradient></defs>`;

  // Cartouche frame: outer gold rope, inner hairline, studs at the corners.
  const frame = (r) =>
    svgUrl(svg(48, 48, `${grad}<g fill="none" stroke="url(#g)"><rect x="1.5" y="1.5" width="45" height="45" rx="${r}" stroke-width="2.6"/><rect x="6" y="6" width="36" height="36" rx="${Math.max(2, r - 5)}" stroke-width="1" stroke-opacity=".75"/></g><g fill="${gold}"><circle cx="6" cy="6" r="1.6"/><circle cx="42" cy="6" r="1.6"/><circle cx="6" cy="42" r="1.6"/><circle cx="42" cy="42" r="1.6"/></g>`));

  // A row of hieroglyphs: ankh, water, sun, reed, djed, eye.
  const glyphs = (c, o) =>
    svg(84, 14, `<g fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6.5C4 5 4.5 1 7 1s3 4 0 5.5zM7 6.5V13M3.8 8h6.4"/><path d="M15 9l2-2 2 2 2-2 2 2 2-2"/><circle cx="34" cy="7" r="3.6"/><path d="M43 13V3q2.6 0 2.6 3.4"/><path d="M53 13V2M50 4.5h6M50 7.5h6M50 10.5h6"/><path d="M62 7q5-4.5 10 0q-5 4.5-10 0zM67 9.6l-1.6 3.4M69 9l2.6 3"/></g><circle cx="34" cy="7" r="1" fill="${c}" fill-opacity="${o}"/><circle cx="67" cy="7" r="1.1" fill="${c}" fill-opacity="${o}"/>`);
  const glyphCol = (c, o) =>
    svg(14, 84, `<g transform="rotate(90 7 7) translate(0 0)">${glyphs(c, o).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`);

  // Winged sun disc of Ra.
  const wing = `M27 7Q15 1.5 1 3.5Q7 6 3 8Q11 8.6 7 11.5Q16 12 27 10Z`;
  const sun = (w, h) =>
    svgUrl(svg(60, 16, `${grad}<path d="${wing}" fill="url(#g)"/><path d="${wing}" fill="url(#g)" transform="translate(60 0) scale(-1 1)"/><g stroke="${t.bg}" stroke-opacity=".55" stroke-width=".7"><path d="M24 7.2Q14 4 4 5M24 9Q15 7.6 6 9.4M57.5 0"/><path d="M36 7.2Q46 4 56 5M36 9Q45 7.6 54 9.4"/></g><circle cx="30" cy="8.4" r="5.6" fill="${ra}" stroke="${hi}" stroke-width="1"/><circle cx="28.6" cy="7" r="1.6" fill="${hi}" fill-opacity=".8"/>`).replace('width="60" height="16"', `width="${w}" height="${h}"`));


  const ankh = svgUrl(svg(14, 22, `${grad}<g fill="none" stroke="url(#g)" stroke-linecap="round"><path d="M7 9C2.6 6.6 3.4 1.2 7 1.2s4.4 5.4 0 7.8z" stroke-width="2"/><path d="M7 9v12M2.2 11.4h9.6" stroke-width="2.4"/></g>`));

  const goldText = `color: ${hi} !important; text-shadow: var(--dv-title) !important;`;
  // Page and pop-up titles: a soft shadow only, no backing plate.
  const pageText = `color: ${hi} !important; text-shadow: 0 1px 0 ${lo}, 0 2px 8px ${alpha('#000000', 0.9)}, 0 0 18px ${alpha(gold, 0.35)} !important;`;
  // The three gods as accents, one per group: Ra gold, Slifer red, Obelisk blue.
  const gods = [gold, slifer, obelisk];
  const band = (c) => `linear-gradient(180deg, ${mix(c, '#ffffff', 0.45)}, ${c} 30%, ${mix(c, t.bg, 0.5)} 70%, ${c})`;
  const TILE_IDS = ['room_btn', 'deck_btn', 'profile_btn', 'my_profile_btn', 'rankings_btn', 'main_exit_btn', 'tourneys_btn', 'settings_btn', 'all_messages_btn', 'browse_btn', 'friends_btn', 'records_btn'];
  const papyrus = `repeating-linear-gradient(90deg, ${alpha(gold, 0.035)} 0 1px, transparent 1px 5px)`;

  const SETTINGS = SEL.settingsPanel;

  return `
html body {
  --dv-title: 0 1px 0 ${lo}, ${titleHalo(deep)}, 0 0 16px ${alpha(gold, 0.4)};
  --dv-glyph: ${svgUrl(glyphs(gold, 0.27))};
  --dv-glyph-soft: ${svgUrl(glyphs(gold, 0.24))};
  --dv-col: ${svgUrl(glyphCol(gold, 0.26))};
  --dv-frame: ${frame(10)};
  --dv-sun: ${sun(120, 32)};
}
/* ---------- Menu tiles: cartouches under the winged sun ---------- */
${SEL.tile} {
  background: var(--dv-glyph) 50% calc(100% - 1px) / 54px 9px repeat-x, linear-gradient(180deg, ${t.raised}, ${deep} 70%, ${mix(deep, gold, 0.12)}) !important;
  border-image: var(--dv-frame) 16 / 16px / 0 stretch !important;
  box-shadow: inset 0 -3px 0 var(--dv-god, ${gold}), 0 10px 22px -12px ${alpha('#000000', 0.9)}, 0 0 0 1px ${alpha('#000000', 0.5)} !important;
}
${TILE_IDS.map((id, i) => `${sel([`#main_menu #${id}`])} { --dv-god: ${gods[i % 3]}; }`).join('\n')}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; left: 50%; top: -11px; width: 64px; height: 17px; margin-left: -32px;
  background: var(--dv-sun) center / contain no-repeat; pointer-events: none;
  filter: drop-shadow(0 1px 1px ${alpha('#000000', 0.8)}); opacity: 0.9; transition: filter 0.2s, opacity 0.2s;
}
${SEL.tileHover} {
  background: var(--dv-glyph) 50% calc(100% - 1px) / 54px 9px repeat-x, radial-gradient(ellipse 70% 120% at 50% 110%, ${alpha(gold, 0.32)}, transparent 70%), linear-gradient(180deg, ${mix(t.raised, gold, 0.1)}, ${deep}) !important;
  box-shadow: inset 0 -3px 0 var(--dv-god, ${gold}), 0 0 22px -6px var(--dv-god, ${gold}), 0 12px 24px -12px ${alpha('#000000', 0.9)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; filter: drop-shadow(0 0 6px ${alpha(gold, 0.9)}); }
${sel(['#main_menu .menu_btn:active .content'])} {
  background: radial-gradient(ellipse at 50% 50%, ${alpha(gold, 0.18)}, transparent 70%), ${deep} !important;
  box-shadow: inset 0 3px 10px ${alpha('#000000', 0.8)} !important;
}
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${alpha('#000000', 0.7)}, 0 0 10px ${alpha(gold, 0.25)} !important; }
${sel(['#main_menu .menu_btn > .content:not(.dbte-small-menu) + span', '#main_menu .menu_btn:active > .content:not(.dbte-small-menu) + span'])} { transform: scale(0.86) !important; }
${sel(['#main_menu .menu_btn:hover > .content:not(.dbte-small-menu) + span'])} { transform: translateY(-3px) scale(0.86) !important; }
${sel(['#main_menu .menu_btn:hover span'])} { color: ${hi} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu'])} { border-image: none !important; box-shadow: inset 0 -1px 0 ${alpha(gold, 0.35)} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu::before'])} { content: none; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${lo} !important; }
${sel(['#main_menu #tourney_sidebar', '#main_menu #streams'])} { box-shadow: inset 0 0 0 1px ${alpha(gold, 0.35)}; }

/* ---------- Headings: engraved gold ---------- */
${sel(['#content .title1', '#content .title2', '#content .subtitle'])} { ${pageText} }
${sel(['#content .admin_lbl'])} { ${goldText} }

/* ---------- Buttons: small cartouches, the shen bar at the right end ---------- */
${SEL.button} {
  background: linear-gradient(180deg, ${mix(t.raised, gold, 0.1)}, ${t.surface} 55%, ${deep}) !important;
  border-color: ${lo} !important;
  border-radius: 999px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(hi, 0.35)}, inset -4px 0 0 ${alpha(gold, 0.55)}, inset -5px 0 0 ${alpha('#000000', 0.4)}, 0 2px 4px ${alpha('#000000', 0.6)} !important;
}
${SEL.buttonHover} {
  background: linear-gradient(180deg, ${mix(gold, t.raised, 0.35)}, ${mix(gold, t.surface, 0.6)}) !important;
  border-color: ${hi} !important;
  color: ${hi} !important;
  box-shadow: inset 0 1px 0 ${alpha(hi, 0.6)}, inset -4px 0 0 ${hi}, 0 0 10px -2px ${alpha(gold, 0.7)} !important;
}
${sel(['#content .button:hover', '#content .button.button_selected'])} { color: ${t.text} !important; text-shadow: 0 1px 1px ${alpha('#000000', 0.8)}; }
${SEL.buttonDown} {
  background: ${deep} !important;
  border-color: ${gold} !important;
  box-shadow: inset 0 2px 6px ${alpha('#000000', 0.85)}, inset -4px 0 0 ${lo} !important;
}

/* ---------- Text fields: sunk into stone, gold lip ---------- */
${SEL.field} {
  background-color: ${mix(t.bg, t.surface, 0.4)} !important;
  border-color: ${lo} !important;
  box-shadow: inset 0 2px 4px ${alpha('#000000', 0.7)}, 0 1px 0 ${alpha(gold, 0.25)} !important;
}
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px ${alpha('#000000', 0.7)}, 0 0 8px ${alpha(gold, 0.45)} !important; }

/* ---------- Pop-ups: a temple wall with a cartouche frame ---------- */
${SEL.dialog} {
  background: var(--dv-col) 20px 50% / 14px 84px repeat-y, var(--dv-col) calc(100% - 20px) 50% / 14px 84px repeat-y, radial-gradient(ellipse 80% 55% at 50% -5%, ${alpha(gold, 0.22)}, transparent 70%), ${papyrus}, linear-gradient(180deg, ${t.surface}, ${deep}) !important;
  border-radius: 14px !important;
  box-shadow: 0 0 0 1px ${lo}, 0 0 0 4px ${t.bg}, 0 0 0 5px ${alpha(slifer, 0.7)}, 0 0 0 7px ${t.bg}, 0 0 0 8px ${alpha(obelisk, 0.7)}, 0 30px 70px -20px ${alpha('#000000', 0.95)} !important;
}
${sel(['#content #msg::before', '#content #link::before', '#content #confirm::before', '#content #confirm2::before', '#content #input::before', '#content #input2::before', '#content #combo::before'])} {
  content: ""; position: absolute; inset: 6px; width: auto; height: auto; transform: none;
  border: 22px solid transparent; border-image: var(--dv-frame) 16 / 22px / 0 stretch; background: none; pointer-events: none; z-index: 0;
}
${sel(['#content #msg::after', '#content #link::after', '#content #confirm::after', '#content #confirm2::after', '#content #input::after', '#content #input2::after', '#content #combo::after'])} {
  content: ""; position: absolute; left: 50%; top: -15px; right: auto; bottom: auto; width: 120px; height: 32px; margin-left: -60px; transform: none;
  background: var(--dv-sun) center / contain no-repeat; pointer-events: none; z-index: 1;
  filter: drop-shadow(0 2px 2px ${alpha('#000000', 0.8)});
}
${SEL.dialogTitle} { ${pageText} }

/* ---------- Chat: a gold-banded lintel over papyrus ---------- */
${SEL.chatTop} {
  background: linear-gradient(180deg, ${mix(t.raised, gold, 0.12)}, ${t.surface}) !important;
  box-shadow: inset 0 1px 0 ${alpha(hi, 0.4)}, inset 0 -1px 0 ${gold}, inset 0 -3px 0 ${t.bg}, inset 0 -4px 0 ${lo} !important;
}
${sel(['#chats #online_users .chat_top_bg', '#chats #watch_chat .chat_top_bg'])} { box-shadow: inset 0 1px 0 ${alpha(hi, 0.4)}, inset 0 -1px 0 ${gold}, inset 0 -3px 0 ${t.bg}, inset 0 -4px 0 ${obelisk} !important; }
${sel(['#chats #private_chat .chat_top_bg'])} { box-shadow: inset 0 1px 0 ${alpha(hi, 0.4)}, inset 0 -1px 0 ${gold}, inset 0 -3px 0 ${t.bg}, inset 0 -4px 0 ${slifer} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${hi} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.8)} !important; }
${SEL.chat} {
  background: radial-gradient(ellipse 90% 40% at 50% 100%, ${alpha(gold, 0.12)}, transparent 70%), ${papyrus}, linear-gradient(180deg, ${t.surface}, ${deep}) !important;
  box-shadow: inset 2px 0 0 ${lo}, inset -2px 0 0 ${lo}, inset 4px 0 0 ${t.bg}, inset -4px 0 0 ${t.bg}, inset 5px 0 0 ${alpha(gold, 0.3)}, inset -5px 0 0 ${alpha(gold, 0.3)} !important;
}
${sel(['#chats .chat .cout_txt', '#chats .chat .log_txt'])} { background-color: transparent !important; }
${sel(['#chats .chat .chat_bottom'])} { box-shadow: inset 0 1px 0 ${alpha(gold, 0.4)}; }

/* ---------- Duel: life as a cartouche, the ankh before it ---------- */
${SEL.life} {
  border-color: ${gold} !important;
  box-shadow: 0 0 0 1px ${alpha('#000000', 0.8)}, inset 0 0 0 1px ${alpha('#000000', 0.6)}, 0 0 12px -2px ${alpha(gold, 0.6)} !important;
  background: linear-gradient(180deg, ${alpha('#ffffff', 0.22)}, transparent 45%) !important;
}
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: -20px; top: -2px; width: 15px; height: 25px;
  background: ${ankh} center / contain no-repeat; filter: drop-shadow(0 1px 1px ${alpha('#000000', 0.9)});
}
${sel(['#duel .lifepoints .life_border::after'])} {
  content: ""; position: absolute; right: -7px; top: -5px; width: 3px; height: 29px; border-radius: 2px;
  background: linear-gradient(180deg, ${hi}, ${gold} 50%, ${lo}); box-shadow: 0 0 0 1px ${alpha('#000000', 0.6)};
}
${SEL.lifeSelf} { background: linear-gradient(180deg, transparent 18%, ${alpha('#ffffff', 0.4)} 26%, transparent 38%), linear-gradient(90deg, ${mix(mix(self, t.danger, 0.2), '#000000', 0.08)}, ${mix(mix(self, t.danger, 0.25), '#000000', 0.25)} 55%, ${mix(mix(self, t.danger, 0.3), '#000000', 0.45)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(90deg, ${mix(obelisk, '#000000', 0.6)}, ${mix(obelisk, '#000000', 0.2)} 70%, ${mix(obelisk, '#000000', 0.32)}) !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, 0 0 6px ${alpha('#000000', 0.8)} !important; }

/* Phases: gold sun discs; the active one radiates */
${SEL.phase} { background: conic-gradient(from 200deg, ${hi}, ${gold}, ${lo}, ${gold}, ${hi}, ${lo}, ${hi}) !important; box-shadow: 0 2px 6px ${alpha('#000000', 0.8)}; }
${sel(['#duel .phase .background .background_top'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 60%) !important; }
${sel(['#duel .phase .background .background_inner'])} { background: radial-gradient(circle at 50% 35%, ${t.raised}, ${t.bg}) !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle at 50% 35%, ${t.raised} 20%, ${deep} 75%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 35%, ${mix(self, '#ffffff', 0.25)}, ${self} 45%, ${mix(self, '#000000', 0.5)} 80%) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 35%, ${mix(obelisk, '#ffffff', 0.25)}, ${obelisk} 45%, ${mix(obelisk, '#000000', 0.5)} 80%) !important; }
${sel(['#duel .phase.active .background::before'])} {
  content: ""; position: absolute; inset: -13px; border-radius: 50%;
  background: repeating-conic-gradient(${hi} 0deg 7deg, transparent 7deg 15deg);
  -webkit-mask: radial-gradient(circle, transparent 52%, #000000 55%, #000000 66%, transparent 76%); mask: radial-gradient(circle, transparent 52%, #000000 55%, #000000 66%, transparent 76%);
  filter: drop-shadow(0 0 3px ${alpha(gold, 0.9)});
}
${sel(['#duel .phase span'])} { color: ${lo} !important; }
${sel(['#duel .phase.active span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${alpha('#000000', 0.9)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${hi}, ${gold} 50%, ${lo}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${t.raised}, ${deep}) !important; }
${sel(['#duel #start_turn span', '#duel #end_turn span'])} { color: ${hi} !important; }
${sel(['#duel #turn .red'])} { background: radial-gradient(circle at 50% 35%, ${hi}, ${gold} 70%) !important; }
${sel(['#duel #turn .blue'])} { background: radial-gradient(circle at 50% 35%, ${mix(obelisk, '#ffffff', 0.55)}, ${mix(obelisk, '#ffffff', 0.25)} 70%) !important; }
${sel(['#duel #turn span'])} { color: ${t.bg} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.45)} !important; }
${sel(['#duel #watchers'])} { box-shadow: inset 0 0 0 1px ${alpha(gold, 0.35)}; }
${sel(['#duel .cout_txt'])} { background: ${papyrus}, linear-gradient(180deg, ${t.surface}, ${deep}) !important; box-shadow: inset 0 0 0 1px ${lo}, inset 0 0 0 3px ${t.bg}, inset 0 0 0 4px ${alpha(gold, 0.35)} !important; }
${sel(['#duel #preview_txt'])} { box-shadow: inset 0 0 0 1px ${alpha(gold, 0.4)}, inset 0 3px 0 ${alpha(gold, 0.2)}; }

/* ---------- Duel room: gilded panels with a hieroglyph frieze ---------- */
${sel(['#duel_room #formats .format > .border::before'])} { background: ${band(gold)} !important; filter: none !important; }
${sel(['#duel_room #decklist > .border::before', '#duel_room #mode > .border::before', '#duel_room #filter > .border::before'])} { background: ${band(slifer)} !important; filter: none !important; }
${sel(['#duel_room #host_bg > .border::before'])} { background: ${band(obelisk)} !important; filter: none !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(180deg, ${hi}, ${hi} 30%, ${gold}) !important; }
${sel(['#duel_room #formats .format > .border'])} { background-image: var(--dv-glyph-soft), ${papyrus}, linear-gradient(180deg, ${alpha(t.surface, 0.92)}, ${alpha(deep, 0.95)}) !important; background-position: 50% calc(100% - 5px), 0 0, 0 0 !important; background-size: 84px 14px, auto, auto !important; background-repeat: repeat-x, repeat, no-repeat !important; }
${sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border'])} {
  background: ${papyrus}, linear-gradient(180deg, ${alpha(t.surface, 0.92)}, ${alpha(deep, 0.95)}) !important;
  box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.9)};
}
${sel(['#duel_room .format_txt', '#duel_room span.arial_black2', '#duel_room .title_txt.arial_black2'])} { ${goldText} }
${sel(['#duel_room .duelbutton'])} { border-color: transparent !important; box-shadow: inset 0 -1px 0 ${alpha(gold, 0.28)}; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.22)}, ${alpha(gold, 0.06)}) !important; }
${sel(['#duel_room .duelbutton .game_type'])} { color: ${gold} !important; }

/* ---------- Deck constructor: tomb chambers ---------- */
${sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg'])} {
  background: var(--dv-col) 6px 50% / 14px 84px repeat-y, ${papyrus}, linear-gradient(90deg, ${mix(t.surface, gold, 0.1)}, ${deep} 12%, ${deep}) !important;
  box-shadow: inset 0 0 0 1px ${lo}, inset 0 0 0 3px ${t.bg}, inset 0 0 0 4px ${alpha(gold, 0.3)}, inset 0 3px 0 var(--dv-god, ${gold}) !important;
}
${sel(['#deck_constructor .side_bg'])} { --dv-god: ${slifer}; }
${sel(['#deck_constructor .extra_bg'])} { --dv-god: ${obelisk}; }
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { ${goldText} opacity: 1 !important; }
${sel(['#deck_constructor #search .search_bg'])} {
  background: radial-gradient(ellipse 90% 30% at 50% 0%, ${alpha(gold, 0.2)}, transparent 70%), ${papyrus}, linear-gradient(180deg, ${t.surface}, ${deep}) !important;
  box-shadow: inset 0 0 0 1px ${lo}, inset 0 3px 0 ${alpha(gold, 0.5)} !important;
}
${sel(['#deck_constructor #search .title_txt'])} { ${pageText} }
${sel(['#deck_constructor #search .search_prev_btn', '#deck_constructor #search .search_next_btn'])} { background-color: ${gold} !important; }
${sel(['#deck_constructor #search .search_prev_btn:hover', '#deck_constructor #search .search_next_btn:hover'])} { background-color: ${hi} !important; }

/* ---------- Pop-up buttons ---------- */
${popButtons(btnFace([hi, gold, lo, mix(gold, t.bg, 0.78), alpha('#ffffff', 0.55), t.accentText], [mix(t.raised, gold, 0.18), t.surface, deep, lo, alpha(gold, 0.55), hi], 29, (w, h, p) => `<rect x="${n1(w - 24)}" y="15" width="3.5" height="${n1(h - 30)}" rx="1.5" fill="${p ? mix(gold, t.bg, 0.78) : gold}"/>`))}

/* ---------- Settings panels ---------- */
${[1, 2, 0].map((k, i) => `${sel([`#content #settings_content > div:not(.title_txt):nth-child(3n+${i + 1})`])} { --dv-god: ${gods[k]}; }`).join('\n')}
${SETTINGS} { background: ${papyrus}, linear-gradient(180deg, ${t.surface}, ${deep}) !important; border-image: var(--dv-frame) 16 / 16px / 0 stretch !important; box-shadow: inset 0 3px 0 var(--dv-god, ${gold}), 0 12px 26px -12px ${alpha('#000000', 0.9)} !important; }

/* ---------- Scrollbars: gold rods ---------- */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${lo}, ${gold}, ${lo}) !important; }
${sel(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: linear-gradient(90deg, ${gold}, ${hi}, ${gold}) !important; }

@media (prefers-reduced-motion: reduce) { html body #content * { transition: none !important; } }
`;
};
