// lightsworn: the Lightsworn sanctuary (a light theme). White vestments with
// gilded trim bands and red piping, sunburst rays behind every panel, halo
// rings and sun-disc crests, shadows tinted with the theme's ink, never black.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const gold = t.accent;
  const goldDeep = mix(t.accent, t.text, 0.35);
  const goldPale = mix(t.accent, t.raised, 0.55);
  const white = t.raised;
  const ink = (a) => alpha(t.text, a);
  const red = t.self;

  // Sunburst rays, as on the Lightsworn card art behind each figure.
  const rays = (a = 0.5, at = '50% -30%') => `repeating-conic-gradient(from 0deg at ${at}, ${alpha('#ffffff', a)} 0deg 3deg, transparent 3deg 9deg)`;

  // Eight-point sun star.
  const star = (x, y, r, fill) => {
    let d = '';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r * 0.42 : i % 4 ? r * 0.75 : r;
      d += `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(2)} ${(y + Math.sin(a) * rr).toFixed(2)}`;
    }
    return `<path d="${d}Z" fill="${fill}"/>`;
  };

  // Nine-slice gilded frame: a gold band with red piping inside, sun stars at the corners.
  const corner = `${star(8, 8, 7.5, gold)}<circle cx="8" cy="8" r="2.2" fill="${white}" stroke="${goldDeep}" stroke-width="0.8"/>`;
  const frameSvg = svg(60, 60, `<g fill="none"><rect x="1" y="1" width="58" height="58" stroke="${gold}" stroke-width="2"/><rect x="4.2" y="4.2" width="51.6" height="51.6" stroke="${red}" stroke-opacity="0.7" stroke-width="0.9"/><rect x="6.4" y="6.4" width="47.2" height="47.2" stroke="${goldDeep}" stroke-opacity="0.45" stroke-width="0.6"/></g>${corner}<g transform="matrix(-1 0 0 1 60 0)">${corner}</g><g transform="matrix(1 0 0 -1 0 60)">${corner}</g><g transform="matrix(-1 0 0 -1 60 60)">${corner}</g>`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Sun disc in a halo ring: the Lightsworn crest.
  let sunRays = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r1 = 9.5;
    const r2 = i % 2 ? 13 : 16;
    sunRays += `<line x1="${(18 + Math.cos(a) * r1).toFixed(2)}" y1="${(18 + Math.sin(a) * r1).toFixed(2)}" x2="${(18 + Math.cos(a) * r2).toFixed(2)}" y2="${(18 + Math.sin(a) * r2).toFixed(2)}"/>`;
  }
  const sun = svg(36, 36, `<g stroke="${gold}" stroke-width="1.6" stroke-linecap="round">${sunRays}</g><circle cx="18" cy="18" r="7.5" fill="${white}" stroke="${goldDeep}" stroke-width="1.4"/><circle cx="18" cy="18" r="4" fill="${gold}"/><circle cx="18" cy="18" r="1.6" fill="${red}"/>`);

  // Winged sun for the pop-ups: a halo, the disc and two gilded wings.
  const wing = `<path d="M62 30C50 20 34 16 8 18C22 22 30 26 36 30C26 30 18 32 10 36C26 36 38 36 48 38C40 40 34 44 30 48C44 44 54 40 62 36Z" fill="${white}" stroke="${gold}" stroke-width="1.3" stroke-linejoin="round"/><path d="M58 31C46 25 34 22 20 21M56 34C46 33 36 33 22 34M56 37C48 39 42 42 38 45" fill="none" stroke="${goldDeep}" stroke-opacity="0.55" stroke-width="0.8"/>`;
  const wingedSun = svg(160, 60, `<ellipse cx="80" cy="30" rx="26" ry="26" fill="none" stroke="${gold}" stroke-opacity="0.55" stroke-width="1.2"/><ellipse cx="80" cy="30" rx="22" ry="22" fill="none" stroke="${gold}" stroke-width="2"/>${wing}<g transform="matrix(-1 0 0 1 160 0)">${wing}</g><g transform="translate(62 12)"><g stroke="${gold}" stroke-width="1.6" stroke-linecap="round">${sunRays}</g><circle cx="18" cy="18" r="7.5" fill="${white}" stroke="${goldDeep}" stroke-width="1.4"/><circle cx="18" cy="18" r="4" fill="${gold}"/><circle cx="18" cy="18" r="1.6" fill="${red}"/></g>`);

  // Halo ring and short rays laid over the phase discs.
  let haloTicks = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    haloTicks += `<line x1="${(22.5 + Math.cos(a) * 18).toFixed(2)}" y1="${(22.5 + Math.sin(a) * 18).toFixed(2)}" x2="${(22.5 + Math.cos(a) * 21).toFixed(2)}" y2="${(22.5 + Math.sin(a) * 21).toFixed(2)}"/>`;
  }
  const halo = svg(45, 45, `<circle cx="22.5" cy="22.5" r="16.5" fill="none" stroke="${gold}" stroke-opacity="0.7" stroke-width="1.2"/><g stroke="${gold}" stroke-opacity="0.75" stroke-width="1.2">${haloTicks}</g>`);

  // Vestment trim: a gold band with small red lozenges.
  const trim = svg(16, 6, `<rect width="16" height="6" fill="${gold}"/><path d="M8 0.8L10.6 3 8 5.2 5.4 3Z" fill="${red}" fill-opacity="0.85"/><path d="M0 0.4H16M0 5.6H16" stroke="${goldDeep}" stroke-width="0.8"/>`);

  const shade = `0 1px 2px ${ink(0.12)}, 0 10px 22px -12px ${ink(0.35)}`;
  const vestment = (lift = 0) => `${rays(0.45 + lift)}, radial-gradient(ellipse 80% 120% at 50% 0%, ${alpha('#ffffff', 0.9)}, transparent 70%), linear-gradient(180deg, ${white}, ${mix(t.surface, gold, 0.08 + lift / 4)})`;

  // Pop-up buttons (DuelingBook's OK/Yes/No/Cancel <img>s), redrawn in the theme's material.
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="${c.r}" fill="url(#g)" stroke="${c.edge}" stroke-width="2.5"/><rect x="11" y="15" width="${bw - 10}" height="48.5" rx="${Math.max(c.r - 4, 0)}" fill="none" stroke="${c.inner}" stroke-opacity="0.75" stroke-width="1"/>${c.deco(w)}<text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 4px ${c.shadow}) !important; }`).join('\n');
  const popPrimary = { top: mix(gold, '#ffffff', 0.15), bot: goldDeep, edge: goldDeep, inner: '#ffffff', text: '#ffffff', r: 6, shadow: ink(0.35), deco: (w) => `<path d="M${w / 2 - 22} 13.5H${w / 2 + 22}" stroke="#ffffff" stroke-opacity="0.6" stroke-width="1.4"/>${star(14, 18, 5, '#ffffff')}${star(w - 14, 18, 5, '#ffffff')}` };
  const popSecondary = { ...popPrimary, top: '#ffffff', bot: mix(white, gold, 0.15), edge: gold, inner: gold, text: t.text, deco: (w) => `${star(14, 18, 5, gold)}${star(w - 14, 18, 5, gold)}<path d="M8 64.5H${w - 8}" stroke="${red}" stroke-opacity="0.6" stroke-width="1.2"/>` };
  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#deck_constructor #search .title_txt']);
  const smallTile = sel(['#main_menu .menu_btn.dbte-small-menu .content']);

  const u0 = svgUrl(frameSvg);
  const u1 = svgUrl(sun);
  const u2 = svgUrl(wingedSun);
  const u3 = svgUrl(trim);
  const u4 = svgUrl(halo);
  return `
html body { ${[['u0', u0], ['u1', u1], ['u2', u2], ['u3', u3], ['u4', u4]].map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: white vestment panels under sunburst rays, a gilded frame, a sun crest. */
${SEL.tile} { background: ${vestment()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 14px stretch !important; box-shadow: ${shade}, inset 0 -3px 0 ${alpha(gold, 0.35)} !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 10px); top: -8px; width: 20px; height: 20px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 1px 1px ${ink(0.3)}); }
${on(smallTile, 'before')} { content: none; }
${SEL.tileHover} { background: ${vestment(0.25)} !important; box-shadow: 0 0 0 1px ${gold}, 0 0 22px -2px ${alpha(gold, 0.75)}, ${shade} !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 1px 0 #ffffff, 0 0 10px #ffffff !important; }

/* Buttons: white silk, gold trim below, red piping on hover. */
${SEL.button} { background: linear-gradient(180deg, ${mix(gold, '#ffffff', 0.1)}, ${goldDeep}) !important; border-color: ${goldDeep} !important; color: ${t.accentText} !important; border-radius: 3px !important; text-shadow: 0 1px 1px ${ink(0.5)} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.45)}, inset 0 0 0 1px ${alpha('#ffffff', 0.18)}, 0 2px 4px -1px ${ink(0.35)} !important; }
${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: linear-gradient(180deg, ${mix(gold, '#ffffff', 0.1)}, ${goldDeep}) !important; border-color: ${goldDeep} !important; color: ${t.accentText} !important; border-radius: 3px !important; text-shadow: 0 1px 1px ${ink(0.5)} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.45)}, inset 0 0 0 1px ${alpha('#ffffff', 0.18)}, 0 2px 4px -1px ${ink(0.35)} !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(gold, '#ffffff', 0.22)}, ${gold}) !important; border-color: ${t.text} !important; color: ${t.accentText} !important; box-shadow: inset 0 -2px 0 ${red}, 0 0 10px -1px ${alpha(gold, 0.8)} !important; }
${SEL.buttonDown} { background: ${goldDeep} !important; border-color: ${t.text} !important; color: ${t.accentText} !important; box-shadow: inset 0 2px 4px ${ink(0.45)} !important; }

/* Pop-ups: a sanctuary panel lit from above, framed in gold, a winged sun on top. */
${SEL.dialog} { background: ${rays(0.55, '50% -10%')}, radial-gradient(ellipse 90% 70% at 50% 0%, #ffffff, transparent 70%), linear-gradient(180deg, ${white}, ${t.surface}) !important; border-radius: 4px !important; box-shadow: 0 0 0 1px ${gold}, 0 0 0 5px ${white}, 0 0 0 6px ${alpha(gold, 0.7)}, 0 24px 50px -14px ${ink(0.45)} !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 80px); top: -34px; right: auto; bottom: auto; width: 160px; height: 60px; pointer-events: none; z-index: 1; background: var(--dbtc-u2) center / contain no-repeat; filter: drop-shadow(0 2px 2px ${ink(0.3)}); transform: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 1px 0 #ffffff, 0 0 14px ${alpha(gold, 0.5)} !important; }

/* Chat: a white header over a gold trim band; the window edged in gold. */
${SEL.chatTop} { background: ${rays(0.6, '30% -60%')}, linear-gradient(180deg, #ffffff, ${mix(white, gold, 0.18)}) !important; box-shadow: inset 0 -2px 0 ${gold}, inset 0 1px 0 #ffffff !important; }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 6px; pointer-events: none; background: var(--dbtc-u3) 0 0 / 16px 6px repeat-x; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; }
${SEL.chat} { background: linear-gradient(180deg, ${white}, ${t.surface}) !important; box-shadow: inset 1px 0 0 ${gold}, inset -1px 0 0 ${gold}, inset 0 -1px 0 ${gold} !important; }

/* Duel: gilded life bars with a sun-disc cap; phases as halos. */
${SEL.life} { border-color: ${gold} !important; border-radius: 6px !important; box-shadow: 0 0 0 1px ${white}, 0 0 0 2px ${alpha(gold, 0.6)}, 0 3px 8px -3px ${ink(0.4)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 6px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.55)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.text, 0.3)}, ${t.self}, ${mix(t.self, gold, 0.4)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.55)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.text, 0.3)}, ${t.opp}, ${mix(t.opp, '#ffffff', 0.3)}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -17px; top: -2px; width: 34px; height: 34px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; }
${SEL.phase} { background: conic-gradient(from 210deg, ${gold}, ${goldPale}, #ffffff, ${goldPale}, ${gold}, ${goldDeep}, ${gold}) !important; box-shadow: 0 0 0 1px ${alpha(gold, 0.5)}, 0 0 14px ${alpha('#ffffff', 0.9)}, 0 3px 8px -2px ${ink(0.4)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${white} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, #ffffff 35%, ${mix(t.surface, gold, 0.15)}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.1)} 30%, ${mix(t.self, t.text, 0.35)}) !important; box-shadow: 0 0 16px ${alpha(gold, 0.9)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.1)} 30%, ${mix(t.opp, t.text, 0.35)}) !important; box-shadow: 0 0 16px ${alpha(gold, 0.9)}; }
${sel(['#duel .phase span'])} { color: ${goldDeep} !important; text-shadow: 0 1px 0 #ffffff !important; }
${sel(['#duel .phase.active span'])} { color: #ffffff !important; text-shadow: 0 1px 2px ${t.text} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${gold}, ${goldDeep}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, #ffffff, ${goldPale}) !important; }
${sel(['#duel .cout_txt'])} { background: ${rays(0.35, '50% -20%')}, linear-gradient(180deg, ${white}, ${t.surface}) !important; box-shadow: inset 0 0 0 1px ${gold}, inset 0 0 0 4px ${white}, inset 0 0 0 5px ${alpha(gold, 0.5)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${gold}, 0 0 0 4px ${white}, 0 0 0 5px ${alpha(gold, 0.6)}, 0 6px 14px -6px ${ink(0.4)} !important; }

/* Duel room: gold rings around white panels in faint rays. */
${lobbyBorders} { background: ${rays(0.4, '50% -40%')}, linear-gradient(180deg, ${alpha(white, 0.9)}, ${alpha(t.surface, 0.85)}) !important; box-shadow: ${shade}; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${goldPale}, ${gold} 30%, ${goldDeep} 55%, ${gold} 80%, ${goldPale}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.18)}, transparent 40%), ${white} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.4)}, ${alpha(gold, 0.12)}) !important; }

/* Deck constructor: white panels edged in gold and red piping. */
${deckPanels} { background: ${rays(0.3, '50% -40%')}, linear-gradient(180deg, ${white}, ${mix(t.surface, gold, 0.1)}) !important; box-shadow: inset 0 0 0 1px ${gold}, inset 0 0 0 3px ${white}, inset 0 0 0 4px ${alpha(red, 0.5)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }

/* Settings panels. */
${settingsPanels} { border-color: ${gold} !important; background: ${rays(0.35, '50% -40%')}, linear-gradient(180deg, ${alpha(white, 0.95)}, ${alpha(t.surface, 0.9)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: ink lettering haloed in light. */
${titles} { color: ${mix(gold, t.text, 0.6)} !important; text-shadow: 0 0 2px ${t.raised}, 0 0 4px ${t.raised}, 0 1px 0 #ffffff, 0 0 12px #ffffff, 0 0 22px ${alpha(gold, 0.45)} !important; }

/* Text fields: white wells with a gold lip. */
${SEL.field} { background-color: ${mix('#ffffff', t.surface, 0.35)} !important; border-color: ${goldDeep} !important; box-shadow: 0 0 0 1px ${alpha(gold, 0.55)}, inset 0 1px 3px ${ink(0.16)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 1px 3px ${ink(0.18)}, 0 0 8px ${alpha(gold, 0.7)} !important; }

/* Scrollbars: gilded rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${goldDeep}, ${gold}, ${goldDeep}) !important; border-radius: 3px !important; }

/* Pop-up buttons in the theme material. */
${popCss(popPrimary, popSecondary)}


${sel(['#content .combobox'])} { border-color: ${goldDeep} !important; box-shadow: 0 0 0 1px ${alpha(gold, 0.45)} !important; }

/* Chat usernames in warm brown, not navy. */
${sel(['#chats .cout_txt font.username', '#chats .cout_txt .username', '#chats .cout_txt font[color="#0000FF" i]'])} { color: ${t.link} !important; }

/* Settings heading plates: rimmed in gold so they sit in the frame, not on it. */
${sel(['#content #settings_content .admin_lbl'])} { box-shadow: 0 0 0 0.3em ${t.surface}, 0 0 0 calc(0.3em + 2px) ${gold} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.accentText, gold, 0.4)} !important; }
`;
};
