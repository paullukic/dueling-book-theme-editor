// Millennium Items: sandstone and lapis. Menu tiles and pop-ups are carved
// sandstone slabs with dark lapis ink; panels are a lapis tomb ceiling.
// Every frame is a bevelled band of polished gold with a thin lapis inlay.
// The signature is the scene's Millennium Puzzle inside the ring of the
// Items, used as the pop-up crest, on the active phase and above the
// selected tile. Black and gold
// belong to Divine; Millennium is sand, lapis and gold.
import { mix } from '../../../lib/color.js';

export default (t, kit) => {
  const { SEL, sel, svgUrl, svg, alpha, n1 } = kit;
  const gold = t.accent;
  const glint = mix(gold, '#ffffff', 0.72);
  const hi = mix(gold, '#ffffff', 0.45);
  const ochre = mix(mix(gold, t.danger, 0.3), '#000000', 0.42);
  const brown = mix(ochre, t.bg, 0.45);
  const carnelian = mix(t.danger, gold, 0.3);
  const lapis = mix(t.accent2, t.bg, 0.3);
  const lapisDeep = mix(t.accent2, t.bg, 0.72);
  const lapisNight = mix(t.accent2, t.bg, 0.86);
  // Sandstone, lit from above, and the dark lapis ink carved into it.
  const sand = mix(t.text, gold, 0.3);
  const sandMid = mix(sand, ochre, 0.22);
  const sandLow = mix(sand, ochre, 0.42);
  const ink = mix(t.accent2, t.bg, 0.82);
  const [gr, gg, gb] = [1, 3, 5].map((i) => (parseInt(ochre.slice(i, i + 2), 16) / 255).toFixed(3));

  // Bevelled gold band (light top edge, dark bottom edge) with a lapis inlay line.
  const bevel = svgUrl(svg(48, 48, `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${glint}"/><stop offset=".3" stop-color="${gold}"/><stop offset=".7" stop-color="${ochre}"/><stop offset="1" stop-color="${brown}"/></linearGradient></defs><rect x="3" y="3" width="42" height="42" rx="4" fill="none" stroke="url(#g)" stroke-width="6"/><path d="M1 46V5Q1 1 5 1H43" fill="none" stroke="${glint}" stroke-opacity=".9"/><path d="M47 2V43Q47 47 43 47H4" fill="none" stroke="${brown}" stroke-width="1.4"/><rect x="6.8" y="6.8" width="34.4" height="34.4" rx="1.5" fill="none" stroke="${lapis}" stroke-width="1.6"/>`));
  const grain = svgUrl(svg(120, 120, `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${gr} 0 0 0 0 ${gg} 0 0 0 0 ${gb} 0 0 0 .22 0"/></filter><rect width="120" height="120" filter="url(#n)"/>`));

  // Wedjat eye, carved in lapis ink.
  const eyeLines = '<path d="M5 4.5Q20-.5 35 4.5"/><path d="M6 10.5Q20 2 34 10.5Q20 15.5 6 10.5Z"/><path d="M34 10.5L39.5 10"/><path d="M17 14L14.8 19.5"/><path d="M23 14Q27 18.5 31.5 17Q34.5 15.5 33 13Q31.5 12 30.5 13.6"/>';
  const eyeG = (c, w) => `<g fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${eyeLines}</g>`;
  const eye = svgUrl(svg(40, 20, `${eyeG(brown, 3.6)}${eyeG(gold, 2.2)}<circle cx="20" cy="9.6" r="3.4" fill="${carnelian}" stroke="${brown}"/>`));

  // The Puzzle in the ring of the Items (the scene's centrepiece as a crest):
  // a gold ring, seven gold studs, the inverted pyramid with the eye.
  const crestBody = (s) => {
    let studs = '';
    for (let i = 0; i < 7; i++) {
      const a = ((-90 + i * (360 / 7)) * Math.PI) / 180;
      studs += `<circle cx="${n1(40 + Math.cos(a) * 31)}" cy="${n1(40 + Math.sin(a) * 31)}" r="4.6" fill="${i ? lapis : carnelian}" stroke="${hi}" stroke-width="1.6"/>`;
    }
    return `<defs><linearGradient id="p" x1="0" y1="0" x2=".5" y2="1"><stop offset="0" stop-color="${glint}"/><stop offset=".45" stop-color="${gold}"/><stop offset="1" stop-color="${ochre}"/></linearGradient></defs><circle cx="40" cy="40" r="37" fill="${s}"/><circle cx="40" cy="40" r="31" fill="none" stroke="url(#p)" stroke-width="3.4"/>${studs}<path d="M22 27H58L40 60Z" fill="url(#p)" stroke="${brown}" stroke-width="1.6" stroke-linejoin="round"/><path d="M22 27L40 33L58 27M40 33V60" fill="none" stroke="${brown}" stroke-opacity=".55"/><g transform="translate(29.5 34) scale(.52)">${eyeG(ink, 3)}<circle cx="20" cy="9.6" r="3.2" fill="${ink}"/></g>`;
  };
  const crest = svgUrl(svg(80, 80, crestBody(lapisNight)));

  // Gold stars on the lapis ceiling.
  const starAt = (x, y, r, o) => {
    const p = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.42 : r;
      p.push(`${n1(x + Math.cos(a) * rr)} ${n1(y + Math.sin(a) * rr)}`);
    }
    return `<path d="M${p.join('L')}Z" fill="${gold}" fill-opacity="${o}"/>`;
  };
  const stars = svgUrl(svg(64, 64, starAt(10, 12, 3.2, 0.3) + starAt(42, 8, 2.4, 0.2) + starAt(26, 36, 3.6, 0.26) + starAt(54, 44, 2.8, 0.22) + starAt(8, 54, 2.2, 0.18)));

  // DuelingBook's pop-up buttons are <img> SVGs: redrawn as a lapis tablet
  // (OK/Yes) and a sandstone tablet (No/Cancel), each in a gold bevel.
  const btnFace = (l, w, h, p) => {
    const bw = n1(w - 12);
    const bh = n1(h - 20);
    const [a, b, c, txt] = p ? [mix(lapis, '#ffffff', 0.12), lapis, lapisDeep, glint] : [sand, sandMid, sandLow, ink];
    return svg(w, h, `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient><linearGradient id="e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${glint}"/><stop offset=".4" stop-color="${gold}"/><stop offset="1" stop-color="${brown}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="${bh}" rx="5" fill="url(#b)" stroke="url(#e)" stroke-width="4.5"/><rect x="11" y="15" width="${n1(bw - 10)}" height="${n1(bh - 10)}" rx="2" fill="none" stroke="${p ? alpha(glint, 0.45) : alpha(ink, 0.35)}" stroke-width="1.4"/><text x="${n1(w / 2)}" y="${n1(h / 2 + 1)}" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="26" fill="${txt}">${l}</text>`);
  };
  const popButtons = [['ok_btn', 'OK', 0, 1], ['yes_btn', 'Yes', 0, 1], ['no_btn', 'No', 0, 0], ['cancel_btn', 'Cancel', 1, 0]]
    .map(([n, l, wide, p]) => `${sel([`#content img[src*="/svg/${n}"]`, `#content img[data-src*="/svg/${n}"]`])} { content: ${svgUrl(btnFace(l, wide ? 234.85 : 153.4, wide ? 78.5 : 78.47, p))} !important; }`)
    .join('\n');

  const sandstone = `var(--mi-grain), linear-gradient(180deg, ${sand}, ${sandMid} 60%, ${sandLow})`;
  const ceiling = `var(--mi-stars), radial-gradient(ellipse 100% 70% at 50% 0%, ${alpha(t.accent2, 0.16)}, transparent 70%), linear-gradient(180deg, ${lapisDeep}, ${lapisNight})`;
  const goldBand = `linear-gradient(180deg, ${glint}, ${gold} 30%, ${ochre} 70%, ${brown})`;
  // Page titles sit on the page: a soft shadow only, no backing plate.
  const pageTitle = `color: ${hi} !important; text-shadow: 0 1px 0 ${brown}, 0 2px 8px ${alpha('#000000', 0.85)}, 0 0 18px ${alpha(gold, 0.3)} !important;`;
  // Panel titles straddle a frame line: shifted copies in the panel colour close the word gaps.
  const halo = [3, 7, 11].map((x) => `-${x}px 0 2px ${lapisDeep}, ${x}px 0 2px ${lapisDeep}`).join(', ');
  const panelTitle = `color: ${hi} !important; text-shadow: var(--mi-halo) !important;`;
  const inkText = `color: ${ink} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.45)} !important;`;
  // Dark lettering on sandstone. The page's ink guard reads the dark page
  // behind sibling labels and would re-ink them white, so these selectors
  // outrank both the central label rule and the guard's attribute selectors.
  const INK_ON = '[data-dbte-ink][data-dbte-ink][data-dbte-ink]';
  const inked = (list) => sel(list.flatMap((x) => [x, `${x}${INK_ON}`]));
  const DIALOGS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];
  const PANELS = ['#formats .format > .border', '#decklist > .border', '#mode > .border', '#filter > .border', '#host_bg > .border'];
  const panel = (suffix = '') => sel(PANELS.map((p) => `#duel_room ${p}${suffix}`));
  const inlay = `inset 0 0 0 6px ${lapis}, inset 0 0 0 7px ${brown}`;

  return `
html body {
  --mi-bevel: ${bevel};
  --mi-grain: ${grain};
  --mi-eye: ${eye};
  --mi-crest: ${crest};
  --mi-stars: ${stars};
  --mi-halo: 0 1px 0 ${brown}, ${halo}, 0 -3px 2px ${lapisDeep}, 0 3px 3px ${lapisDeep};
}
/* ---------- Menu tiles: carved sandstone in a gold bevel; the selected one wears the Puzzle crest ---------- */
${SEL.tile} {
  background: ${sandstone} !important;
  border-image: var(--mi-bevel) 10 / 8px / 0 stretch !important;
  border-radius: 4px !important;
  box-shadow: 0 12px 22px -12px ${alpha('#000000', 0.9)} !important;
}
${sel(['#main_menu .menu_btn .content::before'])} {
  content: ""; position: absolute; left: 50%; top: -24px; width: 34px; height: 34px; margin-left: -17px; pointer-events: none; z-index: 2;
  background: var(--mi-crest) center / contain no-repeat; opacity: 0; transform: scale(0.7); transition: opacity 0.2s, transform 0.2s;
  filter: drop-shadow(0 2px 3px ${alpha('#000000', 0.8)});
}
${SEL.tileHover} {
  background: radial-gradient(ellipse 70% 120% at 50% 0%, ${alpha('#ffffff', 0.35)}, transparent 70%), ${sandstone} !important;
  box-shadow: 0 0 22px -6px ${alpha(gold, 0.7)}, 0 12px 22px -12px ${alpha('#000000', 0.9)} !important;
}
${sel(['#main_menu .menu_btn:hover .content::before'])} { opacity: 1; transform: none; }
${sel(['#main_menu .menu_btn:active .content'])} { background: var(--mi-grain), linear-gradient(180deg, ${sandLow}, ${sandMid}) !important; box-shadow: inset 0 3px 8px ${alpha(ink, 0.6)} !important; }
${SEL.tileLabel}, ${inked(['#main_menu .menu_btn > span', '#main_menu .menu_btn:active > span'])} { ${inkText} }
${sel(['#main_menu .menu_btn > .content:not(.dbte-small-menu) + span', '#main_menu .menu_btn:active > .content:not(.dbte-small-menu) + span'])} { transform: scale(0.9) !important; }
${sel(['#main_menu .menu_btn:hover > .content:not(.dbte-small-menu) + span'])} { transform: translateY(-3px) scale(0.9) !important; }
${inked(['#main_menu .menu_btn:hover > span'])} { color: ${lapisDeep} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu'])} { border-image: none !important; box-shadow: inset 0 -2px 0 ${gold} !important; }
${sel(['#main_menu .menu_btn .content.dbte-small-menu::before'])} { content: none; }
${sel(['#main_menu .main_menu_circle'])} { border-color: ${gold} !important; }
${sel(['#main_menu .main_menu_circle .background'])} { background: radial-gradient(circle at 40% 35%, ${glint}, ${gold} 55%, ${ochre}) !important; }

/* ---------- Headings ---------- */
${SEL.title}, ${sel(['#content .title2', '#content .subtitle'])} { ${pageTitle} }
${sel(['#content .admin_lbl'])} { ${panelTitle} }

/* ---------- Buttons: small lapis tablets with a gold edge ---------- */
${SEL.button} {
  background: linear-gradient(180deg, ${mix(lapis, '#ffffff', 0.08)}, ${lapisDeep}) !important;
  border-color: ${gold} !important;
  border-radius: 3px !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(glint, 0.55)}, inset 0 -1px 0 ${brown}, 0 2px 4px ${alpha('#000000', 0.6)} !important;
}
${SEL.buttonHover} {
  background: linear-gradient(180deg, ${mix(t.accent2, '#ffffff', 0.1)}, ${lapis}) !important;
  border-color: ${glint} !important;
  color: ${t.text} !important;
  box-shadow: inset 0 1px 0 ${alpha(glint, 0.7)}, 0 0 10px -1px ${alpha(gold, 0.7)} !important;
}
${SEL.buttonDown} { background: ${lapisNight} !important; border-color: ${gold} !important; box-shadow: inset 0 2px 6px ${alpha('#000000', 0.9)} !important; }

/* ---------- Text fields ---------- */
${SEL.field} {
  background-color: ${lapisNight} !important;
  border-color: ${ochre} !important;
  box-shadow: inset 0 2px 4px ${alpha('#000000', 0.7)}, 0 1px 0 ${alpha(glint, 0.35)} !important;
}
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px ${alpha('#000000', 0.7)}, 0 0 8px ${alpha(t.accent2, 0.6)} !important; }

/* ---------- Pop-ups: a sandstone stele in a gold bevel, the Puzzle crest on top ---------- */
${SEL.dialog} {
  background: radial-gradient(ellipse 70% 50% at 50% 0%, ${alpha('#ffffff', 0.3)}, transparent 70%), ${sandstone} !important;
  border-radius: 8px !important;
  box-shadow: 0 0 0 1px ${brown}, 0 30px 70px -20px ${alpha('#000000', 0.95)}, 0 0 60px -24px ${alpha(gold, 0.6)} !important;
}
${sel(DIALOGS.map((d) => `#content ${d}::before`))} {
  content: ""; position: absolute; inset: 0; width: auto; height: auto; transform: none;
  border: 12px solid transparent; border-image: var(--mi-bevel) 10 / 12px / 0 stretch; background: none; pointer-events: none; z-index: 0;
}
${sel(DIALOGS.map((d) => `#content ${d}::after`))} {
  content: ""; position: absolute; left: 50%; top: -34px; right: auto; bottom: auto; width: 64px; height: 64px; margin-left: -32px; transform: none;
  background: var(--mi-crest) center / contain no-repeat; pointer-events: none; z-index: 1; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.7)});
}
${SEL.dialogTitle}, ${inked(DIALOGS.map((d) => `#content ${d} .title_txt`))} { ${inkText} }
${inked(DIALOGS.map((d) => `#content ${d} .body_txt`))} { color: ${ink} !important; }
${sel(DIALOGS.map((d) => `#content ${d} .body_txt a`))} { color: ${mix(t.accent2, t.bg, 0.4)} !important; }

/* ---------- Pop-up buttons ---------- */
${popButtons}

/* ---------- Chat: a sandstone lintel over the lapis ceiling ---------- */
${SEL.chatTop} {
  background: ${sandstone} !important;
  box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.5)}, inset 0 -3px 0 ${gold}, inset 0 -4px 0 ${brown} !important;
}
${inked(['#chats .chat .chat_top span'])} { ${inkText} }
${SEL.chat} {
  background: ${ceiling} !important;
  box-shadow: inset 3px 0 0 ${gold}, inset -3px 0 0 ${gold}, inset 4px 0 0 ${brown}, inset -4px 0 0 ${brown} !important;
}
${sel(['#chats .chat .cout_txt', '#chats .chat .log_txt'])} { background-color: transparent !important; }
${sel(['#chats .chat .chat_bottom'])} { background: ${lapisNight} !important; box-shadow: inset 0 3px 0 ${gold}; }

/* ---------- Duel: life in a gold bevel, the Eye beside it ---------- */
${SEL.life} {
  border-color: ${gold} !important;
  background: linear-gradient(180deg, ${alpha('#ffffff', 0.22)}, transparent 45%) !important;
  box-shadow: 0 0 0 1px ${brown}, 0 0 12px -2px ${alpha(gold, 0.55)} !important;
}
${sel(['#duel .lifepoints .life_border::before'])} {
  content: ""; position: absolute; left: 7px; top: 50%; width: 30px; height: 15px; transform: translateY(-50%); pointer-events: none;
  background: var(--mi-eye) center / contain no-repeat; filter: drop-shadow(0 0 2px ${alpha('#000000', 0.95)}) drop-shadow(0 0 1px ${alpha('#000000', 0.95)});
}
${SEL.lifeSelf} { background: linear-gradient(90deg, ${mix(t.self, '#000000', 0.55)}, ${t.self} 75%, ${mix(t.self, gold, 0.4)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(90deg, ${mix(lapis, '#000000', 0.45)}, ${lapis} 70%, ${mix(lapis, gold, 0.25)}) !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 0 ${alpha('#000000', 0.9)}, 0 0 6px ${alpha('#000000', 0.8)} !important; }

/* Phases: sandstone discs in gold; the active one wears the Puzzle crest */
${SEL.phase} { background: ${goldBand} !important; box-shadow: 0 2px 6px ${alpha('#000000', 0.8)}; }
${sel(['#duel .phase .background .background_top'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 55%) !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${lapis} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${sand}, ${sandLow} 85%) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.self, '#ffffff', 0.2)}, ${t.self} 45%, ${mix(t.self, '#000000', 0.5)} 85%) !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 30%, ${mix(t.opp, '#ffffff', 0.2)}, ${t.opp} 45%, ${mix(t.opp, '#000000', 0.5)} 85%) !important; }
${sel(['#duel .phase.active .background::before'])} {
  content: ""; position: absolute; left: 50%; top: -30px; width: 34px; height: 34px; margin-left: -17px;
  background: var(--mi-crest) center / contain no-repeat; filter: drop-shadow(0 0 4px ${alpha(gold, 0.8)});
}
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 0 2px ${alpha(t.bg, 0.8)}, 0 0 14px 2px ${alpha(gold, 0.6)}; }
${inked(['#duel .phase span'])} { color: ${ink} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.4)} !important; }
${inked(['#duel .phase.active span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px ${alpha('#000000', 0.9)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${goldBand} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${sand}, ${sandLow}) !important; }
${inked(['#duel #start_turn span', '#duel #end_turn span'])} { color: ${ink} !important; }
${inked(['#duel #turn span'])} { color: ${glint} !important; text-shadow: 0 1px 0 ${brown}, 0 0 4px ${alpha('#000000', 0.9)} !important; }
${sel(['#duel #watchers'])} { box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 3px ${brown}; }
${SEL.duelLog} { background: ${ceiling} !important; box-shadow: inset 0 0 0 3px ${gold}, inset 0 0 0 4px ${brown}, inset 0 0 0 6px ${lapis} !important; }
${sel(['#duel #preview_txt'])} { box-shadow: inset 0 0 0 2px ${gold}, inset 0 0 0 3px ${brown}; }

/* ---------- Duel room: lapis ceilings in a bevelled gold band with a lapis inlay ---------- */
${panel('::before')} { background: ${goldBand} !important; filter: none !important; }
${sel(['#duel_room #formats .format:hover > .border::before'])} { background: linear-gradient(180deg, ${glint}, ${hi} 40%, ${gold}) !important; }
${panel()} { background: ${ceiling} !important; box-shadow: ${inlay}, 0 12px 26px -12px ${alpha('#000000', 0.9)}; }
${sel(['#duel_room #formats .format .format_inner', '#duel_room #formats .format_inner[id]'])} { background-color: ${alpha(lapisNight, 0.82)} !important; }
${sel(['#duel_room .format_txt', '#duel_room span.arial_black2', '#duel_room .title_txt.arial_black2'])} { ${panelTitle} }
${sel(['#duel_room .duelbutton'])} { border-color: transparent !important; box-shadow: inset 0 -1px 0 ${alpha(gold, 0.3)}; }
${sel(['#duel_room .duelbutton .background'])} { background-color: ${mix(lapisDeep, t.raised, 0.3)} !important; opacity: 0.9 !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(t.accent2, 0.4)}, ${alpha(t.accent2, 0.08)}) !important; }
${sel(['#duel_room .duelbutton .game_type'])} { color: ${gold} !important; }

/* ---------- Deck constructor ---------- */
${sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg'])} {
  background: ${ceiling} !important;
  box-shadow: inset 0 0 0 3px ${gold}, inset 0 0 0 4px ${brown}, inset 0 0 0 6px ${lapis} !important;
}
${sel(['#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl'])} { color: ${hi} !important; text-shadow: 0 1px 0 ${brown}, 0 2px 6px ${alpha('#000000', 0.8)} !important; opacity: 1 !important; }
${sel(['#deck_constructor #search .title_txt'])} { ${pageTitle} }
${sel(['#deck_constructor #search .search_prev_btn', '#deck_constructor #search .search_next_btn'])} { background-color: ${gold} !important; }
${sel(['#deck_constructor #search .search_prev_btn:hover', '#deck_constructor #search .search_next_btn:hover'])} { background-color: ${glint} !important; }

/* ---------- Settings panels ---------- */
${SEL.settingsPanel} { background: ${ceiling} !important; border-image: var(--mi-bevel) 10 / 8px / 0 stretch !important; box-shadow: 0 12px 26px -12px ${alpha('#000000', 0.9)} !important; }

/* ---------- Scrollbars ---------- */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${ochre}, ${gold}, ${ochre}) !important; }
${sel(['#content .os-scrollbar-handle:hover', '#content .os-scrollbar-handle.active'])} { background: linear-gradient(90deg, ${gold}, ${glint}, ${gold}) !important; }

@media (prefers-reduced-motion: reduce) { html body #content *, html body #content *::before, html body #content *::after { transition: none !important; } }
`;
};
