// power-patron: the Patron's sigil. Monochrome black lace: obsidian lacquer
// with a faint lace lattice, black thorn spikes at the corners, ice-cyan
// hairlines and the forked eye sigil as the crest; the active phase glows solid
// ice. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const ice = t.accent;
  const iceHi = mix(ice, '#ffffff', 0.5);
  const iceDim = mix(ice, t.bg, 0.55);
  const lace = mix(ice, t.bg, 0.25);
  const obsidian = mix(t.bg, '#000000', 0.35);
  const glass = mix(t.raised, t.surface, 0.5);
  const seam = `linear-gradient(90deg, transparent 4%, ${alpha(ice, 0.7)} 25% 75%, transparent 96%) left bottom / 100% 1px no-repeat`;

  // The field is greyed to ice, but the Pendulum scale gems keep their own blue and red:
  // drawn again over the field, at the gem boxes of DuelingBook's field_zones art (1024 x 640).
  const gem = (x, y, c, flip) => {
    const p = (px, py) => `${(flip ? x + 50 - px : x + px).toFixed(1)},${(y + py).toFixed(1)}`;
    const [l, tp, r, b, m] = [p(1.2, 19), p(18, 1.6), p(47.6, 19), p(18, 36.85), p(18, 19)];
    return `<path d="M${l}L${tp}L${m}Z" fill="${mix(c, '#ffffff', 0.45)}"/><path d="M${tp}L${r}L${m}Z" fill="${mix(c, '#ffffff', 0.15)}"/><path d="M${l}L${b}L${m}Z" fill="${c}"/><path d="M${r}L${b}L${m}Z" fill="${mix(c, '#000000', 0.3)}"/><path d="M${l}L${tp}L${r}L${b}Z" fill="none" stroke="${mix(c, '#000000', 0.45)}" stroke-width="0.8"/>`;
  };
  const [gemBlue, gemRed] = ['#2a7fe6', '#e23a55'];
  const gems = (lx, rx, top, bottom) => svgUrl(svg(1024, 640, `${gem(lx, bottom, gemBlue, true)}${gem(rx, bottom, gemRed, false)}${gem(lx, top, gemRed, true)}${gem(rx, top, gemBlue, false)}`));
  // Lace: rows of slotted piercings, faint gold.
  const laceTex = svg(24, 24, `<path d="M0 12L12 0L24 12L12 24Z" fill="none" stroke="${lace}" stroke-opacity="0.07"/><ellipse cx="12" cy="12" rx="1.2" ry="2.6" fill="${lace}" fill-opacity="0.12"/>`);

  // Nine-slice frame: an ice hairline; at each corner a black thorn pair
  // with an ice rim and a gold lace slot.
  const corner = `<path d="M1 1L28 6L10 10Z" fill="${obsidian}" stroke="${ice}" stroke-width="0.9" stroke-linejoin="round"/><path d="M1 1L6 28L10 10Z" fill="${obsidian}" stroke="${ice}" stroke-width="0.9" stroke-linejoin="round"/><path d="M1 1L13 13" stroke="${ice}" stroke-width="1.2"/><ellipse cx="15" cy="15" rx="1.6" ry="3.4" transform="rotate(-45 15 15)" fill="${lace}"/>`;
  const frameSvg = svg(60, 60, `<g fill="none" stroke="${ice}"><rect x="0.7" y="0.7" width="58.6" height="58.6" stroke-width="1" stroke-opacity="0.7"/><rect x="4" y="4" width="52" height="52" stroke-width="0.6" stroke-opacity="0.3"/></g>${corner}<g transform="matrix(-1 0 0 1 60 0)">${corner}</g><g transform="matrix(1 0 0 -1 0 60)">${corner}</g><g transform="matrix(-1 0 0 -1 60 60)">${corner}</g>`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 26 / ${px}px stretch; box-sizing: border-box;`;

  // The eye sigil: almond, iris and pupil, forked rays above.
  const eye = (cx, cy, w, h) => `<path d="M${cx - w} ${cy}Q${cx} ${cy - h * 1.9} ${cx + w} ${cy}Q${cx} ${cy + h * 1.9} ${cx - w} ${cy}Z" fill="${obsidian}" stroke="${iceHi}" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="${h * 0.62}" fill="${ice}"/><circle cx="${cx}" cy="${cy}" r="${h * 0.24}" fill="${obsidian}"/>`;
  const forks = (cx, top, cy, k) => `<path d="M${cx} ${cy - 6 * k}V${top}M${cx} ${top + 6 * k}L${cx - 6 * k} ${top + 1 * k}V${top - 2 * k}M${cx} ${top + 6 * k}L${cx + 6 * k} ${top + 1 * k}V${top - 2 * k}" fill="none" stroke="${iceHi}" stroke-width="${1.3 * k}" stroke-linecap="round"/>`;
  const crest = svg(52, 26, `<path d="M2 22L15 13L11 22ZM50 22L37 13L41 22Z" fill="${obsidian}" stroke="${ice}" stroke-width="0.9"/>${forks(26, 3, 13, 0.8)}${eye(26, 15, 17, 6)}`);

  // Pop-up crest: the eye sigil in a fan of black thorn blades with lace slots.
  let fan = '';
  for (let i = 0; i < 11; i++) {
    const a = (Math.PI * (i + 0.5)) / 11;
    const len = i % 2 ? 40 : 56;
    const [tx, ty] = [80 - Math.cos(a) * len * 1.3, 58 - Math.sin(a) * len];
    const [lx, ly] = [80 - Math.cos(a - 0.12) * 20, 58 - Math.sin(a - 0.12) * 18];
    const [rx, ry] = [80 - Math.cos(a + 0.12) * 20, 58 - Math.sin(a + 0.12) * 18];
    fan += `<path d="M${lx.toFixed(1)} ${ly.toFixed(1)}L${tx.toFixed(1)} ${ty.toFixed(1)}L${rx.toFixed(1)} ${ry.toFixed(1)}Z" fill="${obsidian}" stroke="${ice}" stroke-opacity="0.7" stroke-width="0.8"/>`;
    if (i % 2 === 0) fan += `<ellipse cx="${(80 - Math.cos(a) * len * 0.75).toFixed(1)}" cy="${(58 - Math.sin(a) * len * 0.58).toFixed(1)}" rx="1.2" ry="2.8" transform="rotate(${((a * 180) / Math.PI - 90).toFixed(0)} ${(80 - Math.cos(a) * len * 0.75).toFixed(1)} ${(58 - Math.sin(a) * len * 0.58).toFixed(1)})" fill="${lace}"/>`;
  }
  const gable = svg(160, 64, `${fan}<path d="M40 58H120" stroke="${ice}" stroke-width="2"/>${forks(80, 6, 40, 2)}${eye(80, 42, 30, 10)}`);

  // Phase overlay: the almond eye outline. Life bar finial: a thorn blade.
  const almond = svg(45, 45, `<path d="M2.5 22.5Q5 19.6 8 18.2M2.5 22.5Q5 25.4 8 26.8M42.5 22.5Q40 19.6 37 18.2M42.5 22.5Q40 25.4 37 26.8" fill="none" stroke="${iceHi}" stroke-opacity="0.6" stroke-width="1" stroke-linecap="round"/><circle cx="22.5" cy="22.5" r="20.5" fill="none" stroke="${ice}" stroke-opacity="0.3" stroke-width="0.8"/>`);
  const thorn = svg(16, 40, `<path d="M8 1L12 30L8 39L4 30Z" fill="${obsidian}" stroke="${ice}" stroke-width="1"/><ellipse cx="8" cy="20" rx="1.3" ry="4" fill="${lace}"/><circle cx="8" cy="31" r="2.2" fill="${ice}"/>`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 10px ${alpha(ice, 0.35)} !important;`;
  const lacquer = (lift = 0) => `${seam}, radial-gradient(ellipse 70% 80% at 50% 0%, ${alpha(ice, 0.08 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${obsidian})`;

  // Pop-up buttons: a dark lace plate with one sigil centred on its top edge.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const m = (w / 2).toFixed(1);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${obsidian}"/></linearGradient><pattern id="l" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 6L6 0L12 6L6 12Z" fill="none" stroke="${ice}" stroke-opacity="0.12" stroke-width="0.8"/></pattern></defs><path d="M14 10H${w - 6}V60.5L${w - 14} 68.5H6V18Z" fill="url(#g)" stroke="${c.edge}" stroke-width="${c.sw}"/><path d="M14 10H${w - 6}V60.5L${w - 14} 68.5H6V18Z" fill="url(#l)"/><path d="M12 63H${(w - 12).toFixed(1)}" stroke="${c.edge}" stroke-opacity="0.5" stroke-width="1"/><path d="M${m - 14} 10Q${m} 1 ${+m + 14} 10Q${m} 19 ${m - 14} 10Z" fill="${obsidian}" stroke="${c.edge}" stroke-width="1.4"/><circle cx="${m}" cy="10" r="2.6" fill="${c.edge}"/><text x="${m}" y="40" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: mix(glass, ice, 0.12), edge: ice, sw: 2.6, text: iceHi, shadow: alpha(ice, 0.35) };
  const popSecondary = { top: glass, edge: iceDim, sw: 1.8, text: t.text, shadow: alpha('#000000', 0.7) };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 5px ${c.shadow}) !important; }`).join('\n');

  const titlePlate = mix(glass, t.bg, 0.5);
  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const vars = [frameSvg, crest, laceTex, gable, thorn, almond].map((s, i) => `--dbtc-u${i}: ${svgUrl(s)};`).join(' ');

  return `
html body { ${vars} }
/* Menu tiles: obsidian lacquer with a lace lattice, thorn corners, an ice hairline, the eye sigil on top. */
${SEL.tile} { background: ${lacquer()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 26 / 19px stretch !important; border-radius: 0 !important; box-shadow: inset 0 0 0 1px ${alpha(t.bg, 0.85)}, inset 0 -14px 18px -10px ${alpha('#000000', 0.6)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 24px); top: -11px; width: 48px; height: 24px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 0 4px ${alpha(ice, 0.5)}); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${lacquer(0.12)} !important; box-shadow: inset 0 0 0 1px ${alpha(t.bg, 0.85)}, inset 0 0 22px ${alpha(ice, 0.2)}, 0 0 18px -4px ${alpha(ice, 0.6)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: black glass with an ice top light and foot hairline. */
${SEL.button} { background: ${seam}, linear-gradient(180deg, ${glass}, ${obsidian}) !important; border-color: ${iceDim} !important; color: ${t.text} !important; border-radius: 1px !important; box-shadow: inset 0 1px 0 ${alpha(ice, 0.3)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: ${seam}, linear-gradient(180deg, ${mix(glass, ice, 0.14)}, ${obsidian}) !important; border-color: ${ice} !important; box-shadow: inset 0 1px 0 ${alpha(ice, 0.5)}, 0 0 10px -2px ${alpha(ice, 0.7)} !important; }
${SEL.buttonDown} { background: ${obsidian} !important; border-color: ${ice} !important; box-shadow: inset 0 2px 5px #000000 !important; }
${sel(['#content .button.disabled'])} { opacity: 0.55 !important; }

/* Pop-ups: obsidian chamber in the thorn frame under the eye sigil and its blade fan. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(ice, 0.12)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${obsidian}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${iceDim}, 0 0 0 4px ${obsidian}, 0 0 0 5px ${alpha(ice, 0.5)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 80px); top: -52px; right: auto; bottom: auto; width: 160px; height: 64px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 0 6px ${alpha(ice, 0.45)}); }
${SEL.dialogTitle} { ${label} }

/* Chat: an obsidian header on an ice hairline. */
${SEL.chatTop} { background: ${seam}, var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${obsidian}) !important; box-shadow: inset 0 1px 0 ${alpha(ice, 0.3)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${obsidian}) !important; box-shadow: inset 1px 0 0 ${iceDim}, inset -1px 0 0 ${iceDim}, inset 0 -1px 0 ${iceDim} !important; }

/* Duel: ice-rimmed obsidian life bars with a thorn finial; eye-sigil phases. */
${SEL.life} { border-color: ${ice} !important; border-radius: 1px !important; box-shadow: 0 0 0 1px ${obsidian}, 0 0 0 2px ${iceDim}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.5)} 0 2px, ${alpha('#ffffff', 0.2)} 2px, transparent 50%), var(--dbtc-u2), linear-gradient(90deg, ${mix(t.self, '#0a3a55', 0.18)}, ${mix(t.self, '#06243a', 0.4)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.5)} 0 2px, ${alpha('#ffffff', 0.18)} 2px, transparent 50%, ${alpha('#000000', 0.14)}), linear-gradient(90deg, ${mix(t.opp, '#000000', 0.14)}, ${t.opp} 60%, ${mix(t.opp, '#ffffff', 0.22)}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -15px; top: -6px; width: 16px; height: 40px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 210deg, ${iceHi}, ${iceDim}, ${ice}, ${iceDim}, ${iceHi}) !important; box-shadow: 0 0 0 1px ${obsidian}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase.active .background'])} { background: conic-gradient(from 210deg, #ffffff, ${iceHi}, ${ice}, ${iceHi}, #ffffff) !important; box-shadow: 0 0 0 1px ${obsidian}, 0 0 18px 4px ${alpha(ice, 0.75)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${obsidian} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${glass} 35%, ${obsidian}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 40% 35%, ${mix(t.self, '#ffffff', 0.3)}, ${t.self} 60%, ${mix(t.self, t.bg, 0.2)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.85)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 40% 35%, ${mix(t.opp, '#ffffff', 0.3)}, ${t.opp} 60%, ${mix(t.opp, t.bg, 0.2)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.85)}; }
${sel(['#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${t.accentText} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.5)} !important; }
${sel(['#content img.field_zones', '#content img.field_decks'])} { filter: grayscale(1) brightness(1.5) drop-shadow(0 0 2px ${alpha(ice, 0.45)}) !important; }
${on(sel(['#duel .duel_frame:has(> img.field_zones[src$="/field_zones2.svg"])', '#duel .duel_frame:has(> img.field_zones[src$="/field_zones.svg"])']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; background: center / 100% 100% no-repeat; }
${on(sel(['#duel .duel_frame:has(> img.field_zones[src$="/field_zones2.svg"])']), 'after')} { background-image: ${gems(308, 680, 87, 458)}; }
${on(sel(['#duel .duel_frame:has(> img.field_zones[src$="/field_zones.svg"])']), 'after')} { background-image: ${gems(227, 760, 132, 412)}; }
${sel(['#duel .phase span'])} { color: ${iceHi} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${obsidian}) !important; box-shadow: inset 0 0 0 1px ${iceDim}, inset 0 0 0 4px ${alpha(obsidian, 0.9)}, inset 0 -2px 0 4px ${alpha(ice, 0.35)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${ice}, 0 0 0 4px ${obsidian}, 0 0 0 5px ${alpha(ice, 0.45)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${iceHi}, ${iceDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${obsidian}) !important; }

/* Duel room: ice-silver rings around obsidian panels, thorn corners. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glass, 0.6)}, ${alpha(t.bg, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${iceHi}, ${obsidian} 30%, ${iceDim} 55%, ${obsidian} 80%, ${iceHi}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(18)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(90deg, transparent 4%, ${titlePlate} 12% 88%, transparent 96%) !important; box-shadow: none !important; }
${sel(['#deck_constructor #search .title_txt'])} { background: ${titlePlate} !important; box-shadow: 0 0 0 0.3em ${titlePlate} !important; border-radius: 3px !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${obsidian} !important; box-shadow: 0 0 0 0.35em ${obsidian} !important; border-radius: 1px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(ice, 0.12)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(ice, 0.3)}, ${alpha(ice, 0.08)}) !important; }

/* Deck constructor: obsidian wells with the thorn frame. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(glass, t.surface, 0.5)}, ${obsidian}) !important; box-shadow: inset 0 0 0 1px ${iceDim}, inset 0 0 0 4px ${alpha(obsidian, 0.9)}, inset 0 0 0 5px ${alpha(ice, 0.22)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }

/* Settings panels: the same thorn frame. */
${SEL.settingsPanel} { border-color: ${iceDim} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glass, 0.85)}, ${alpha(obsidian, 0.9)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: pale sigil light. */
${titles} { color: ${iceHi} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${obsidian}, 0 0 16px ${alpha(ice, 0.5)} !important; }

/* Text fields: void wells with an ice lip, crimson focus. */
${SEL.field} { background-color: ${obsidian} !important; border-color: ${iceDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(ice, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${ice} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(ice, 0.6)} !important; }

/* Scrollbars: ice rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${iceDim}, ${iceHi}, ${iceDim}) !important; border-radius: 1px !important; }

/* Pop-up buttons in the theme material. */
${popCss}

/* Front page: the halo's thorn rays clear out of the Welcome / Forum / Rules links, the eye and its gems drop out. */
html body:has(#welcome_buttons:not([style*="none"])) #dbte-skin-fx .dbtefx-pp-linkhole { display: inline; }
html body:has(#welcome_buttons:not([style*="none"])) #dbte-skin-fx .dbtefx-pp-eye { display: none; }
/* Menu: the rainbow road slides right, out from behind the feed timestamps. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-pp-road { transform: translateX(174.5px); }
/* Duel: the sigil's right swirl clears the avatar and chat column's edge. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-pp-sigil { transform: translate(21px, 0); }
`;
};
