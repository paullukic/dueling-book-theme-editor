// mermail: the armour of the Mermail. Pearl-silver plate engraved with the
// wave scrolls of their armour, red gems set in gold, deep-water glass behind
// with light from the surface, and a gold trident over the Abyss-sphere as the
// signature. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');
const f1 = (v) => Math.round(v * 10) / 10;

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const pearl = mix(t.text, t.accent, 0.3);
  const pearlLit = mix(t.text, '#ffffff', 0.5);
  const pearlDeep = mix(t.accent, t.bg, 0.55);
  const aqua = t.accent;
  const gold = t.accent2;
  const goldLit = mix(t.accent2, '#ffffff', 0.45);
  const goldDeep = mix(t.accent2, t.bg, 0.45);
  const gem = t.danger;
  const water = mix(t.surface, t.accent, 0.1);
  const waterDeep = mix(t.bg, '#000000', 0.15);

  // A red gem in a gold setting.
  const jewel = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${f1(r * 1.45)}" fill="${goldDeep}" stroke="${goldLit}" stroke-width="${f1(r * 0.35)}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${gem}"/><circle cx="${f1(x - r * 0.35)}" cy="${f1(y - r * 0.35)}" r="${f1(r * 0.32)}" fill="#ffffff" fill-opacity="0.8"/>`;
  // The trident head: three tines with barbs over a crossguard, a gem at its heart.
  const trident = (cx, cy, k) => `<g fill="url(#tg)" transform="translate(${cx} ${cy}) scale(${k})"><path d="M-2 26V2h4v24Z"/><path d="M-15 2Q-15 -8 -8 -11Q-12 -4 -10 0H10Q12 -4 8 -11Q15 -8 15 2Q8 6 0 6Q-8 6 -15 2Z"/><path d="M-2.4 -9L0 -34L2.4 -9ZM-12 -8L-16 -30L-7 -12ZM12 -8L16 -30L7 -12Z"/><path d="M0 -34l-4 7h8ZM-16 -30l-1 7l5 -3ZM16 -30l1 7l-5 -3Z"/></g>${jewel(cx, f1(cy + 1 * k), f1(3 * k))}`;
  const tg = `<defs><linearGradient id="tg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${goldLit}"/><stop offset="0.55" stop-color="${gold}"/><stop offset="1" stop-color="${goldDeep}"/></linearGradient></defs>`;

  // Nine-slice frame: a pearl-silver band engraved with a running wave scroll, gems at the corners.
  const waveH = (y) => `M13 ${y}q4.25 -4 8.5 0t8.5 0t8.5 0t8.5 0`;
  const waveV = (x) => `M${x} 13q-4 4.25 0 8.5t0 8.5t0 8.5t0 8.5`;
  const frameSvg = svg(60, 60, `<defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pearlLit}"/><stop offset="1" stop-color="${pearlDeep}"/></linearGradient></defs><path d="M6 0H54L60 6V54L54 60H6L0 54V6ZM13 13V47H47V13Z" fill="url(#b)" fill-rule="evenodd"/><path d="${waveH(7)}${waveH(53)}${waveV(7)}${waveV(53)}" fill="none" stroke="${mix(aqua, t.bg, 0.35)}" stroke-width="1.6"/><g fill="none" stroke="${pearlLit}" stroke-width="1"><path d="M6 0.6H54M0.6 6V54M59.4 6V54M6 59.4H54"/><rect x="12.5" y="12.5" width="35" height="35" stroke="${gold}"/></g>${jewel(6.5, 6.5, 3.2)}${jewel(53.5, 6.5, 3.2)}${jewel(6.5, 53.5, 3.2)}${jewel(53.5, 53.5, 3.2)}`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px round; box-sizing: border-box;`;

  // Fish-scale texture, like the Mermail tails.
  const chart = svg(28, 16, `<path d="M0 16a7 7 0 0 1 14 0a7 7 0 0 1 14 0M-7 8a7 7 0 0 1 14 0a7 7 0 0 1 14 0a7 7 0 0 1 14 0" fill="none" stroke="${aqua}" stroke-opacity="0.08" stroke-width="1"/>`);

  const crestTile = svg(40, 44, `${tg}${trident(20, 34, 0.95)}`);
  // The Abyss-sphere: a water globe with a trident rising behind it, wave curls at its sides.
  const crown = svg(160, 84, `${tg}<defs><radialGradient id="o" cx="0.38" cy="0.32" r="0.7"><stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="0.25" stop-color="${mix(aqua, '#ffffff', 0.35)}"/><stop offset="0.75" stop-color="${mix(aqua, t.bg, 0.45)}"/><stop offset="1" stop-color="${pearlLit}"/></radialGradient></defs>${trident(80, 46, 1.55)}<ellipse cx="80" cy="58" rx="56" ry="11" fill="none" stroke="${gold}" stroke-width="2"/><ellipse cx="80" cy="58" rx="40" ry="31" fill="none" stroke="${pearlLit}" stroke-opacity="0.5" stroke-width="1.2"/><circle cx="80" cy="58" r="22" fill="url(#o)" stroke="${pearlLit}" stroke-width="2"/><path d="M66 52a16 16 0 0 1 12 -10" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-opacity="0.85"/><circle cx="88" cy="66" r="2.5" fill="#ffffff" fill-opacity="0.6"/><circle cx="92" cy="58" r="1.6" fill="#ffffff" fill-opacity="0.5"/>`);

  // Phase discs: a bubble ring with a highlight.
  const phaseRing = svg(45, 45, `<circle cx="22.5" cy="22.5" r="20" fill="none" stroke="${pearl}" stroke-opacity="0.8" stroke-width="1.4"/><path d="M8 17a16 16 0 0 1 10 -10" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="2" stroke-linecap="round"/>`);
  const lifeCrest = svg(40, 40, `<path d="M20 3C28 12 33 20 33 26a13 13 0 0 1 -26 0C7 20 12 12 20 3Z" fill="${goldDeep}" stroke="${goldLit}" stroke-width="2"/><path d="M20 10C25 16 28 21 28 25.5a8 8 0 0 1 -16 0C12 21 15 16 20 10Z" fill="${gem}"/><circle cx="17" cy="22" r="2.4" fill="#ffffff" fill-opacity="0.75"/>`);

  const plate = `linear-gradient(180deg, ${pearlLit}, ${pearl} 45%, ${mix(pearl, aqua, 0.4)})`;
  const glassBg = (lift = 0) => `linear-gradient(180deg, ${alpha(aqua, 0.18 + lift)}, transparent 45%), var(--dbtc-u2), linear-gradient(180deg, ${water}, ${waterDeep})`;

  // Pop-up buttons: an aqua pearl plate (primary); deep water glass in pearl (secondary). Wave scroll underline.
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const [x0, x1, y0] = [6, w - 6, 10];
    let wave = `M${x0 + 26} 60`;
    for (let x = x0 + 26; x < x1 - 30; x += 12) wave += 'q3 -4 6 0t6 0';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.55" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="${x0}" y="${y0}" width="${f1(x1 - x0)}" height="58.5" rx="16" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/><path d="M${x0 + 16} ${y0 + 5}H${f1(x1 - 16)}" stroke="#ffffff" stroke-opacity="${c.shine}" stroke-width="2.4" stroke-linecap="round"/><path d="${wave}" fill="none" stroke="${c.wave}" stroke-width="1.6"/>${jewel(x0 + 14, 39.3, 3)}${jewel(f1(x1 - 14), 39.3, 3)}<text x="${w / 2}" y="37.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: mix(aqua, '#ffffff', 0.55), mid: aqua, bot: mix(aqua, t.bg, 0.35), edge: pearlLit, wave: alpha(t.accentText, 0.3), shine: 0.8, text: t.accentText };
  const popSecondary = { top: mix(water, aqua, 0.25), mid: water, bot: waterDeep, edge: pearl, wave: alpha(aqua, 0.6), shine: 0.25, text: t.text };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 5px ${alpha('#000000', 0.55)}) drop-shadow(0 0 6px ${alpha(aqua, 0.3)}) !important; }`)
    .join('\n');
  // The common rules below speak of the plate metal and the panel glass.
  const [silver, silverLit, silverDeep, violet, glass, glassDeep] = [pearl, pearlLit, pearlDeep, aqua, water, waterDeep];

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [frameSvg, crestTile, chart, crown, phaseRing, lifeCrest].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: deep-water glass in an engraved pearl frame, the trident above. */
${SEL.tile} { background: ${glassBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 9px round !important; border-radius: 6px !important; box-shadow: 0 10px 24px -12px #000000, 0 0 18px -10px ${alpha(violet, 0.6)} !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 18px); top: -31px; width: 36px; height: 40px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: linear-gradient(0deg, ${alpha(silver, 0.12)}, transparent 60%), ${glassBg(0.18)} !important; box-shadow: 0 0 22px -4px ${alpha(silver, 0.7)}, 0 0 40px -12px ${alpha(violet, 0.9)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 10px ${alpha(t.bg, 0.95)} !important; }

/* Buttons: pearl plates with a gold underline. */
${SEL.button} { background: ${plate} !important; border-color: ${silverDeep} !important; color: ${t.accentText} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 #ffffff, inset 0 -2px 0 ${gold}, 0 2px 6px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, #ffffff, ${silverLit} 40%, ${silver}) !important; border-color: ${gold} !important; box-shadow: inset 0 -2px 0 ${gold}, 0 0 12px -2px ${alpha(silver, 0.9)} !important; }
${SEL.buttonDown} { background: ${mix(silver, t.bg, 0.3)} !important; border-color: ${gold} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.5)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.accentText, silver, 0.5)} !important; }

/* Pop-ups: water glass in the pearl frame, crowned by the trident and the Abyss-sphere. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 50% at 50% 0%, ${alpha(violet, 0.28)}, transparent 70%), repeating-linear-gradient(100deg, transparent 0 60px, ${alpha('#ffffff', 0.03)} 60px 90px), var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${t.bg}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${silverLit}, 0 0 0 3px ${silverDeep}, 0 0 40px -10px ${alpha(violet, 0.8)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 80px); top: -64px; right: auto; bottom: auto; width: 160px; height: 84px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 3px 4px #000000); transform: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 14px ${alpha(violet, 0.8)} !important; }

/* Chat: a pearl band with a gold line, water glass below. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 55%), linear-gradient(90deg, ${silverDeep}, ${mix(silverDeep, violet, 0.5)} 50%, ${silverDeep}) !important; box-shadow: inset 0 1px 0 ${silverLit}, inset 0 -2px 0 ${gold} !important; }
${sel(['#chats .chat .chat_top span'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${glassDeep}) !important; box-shadow: inset 1px 0 0 ${silver}, inset -1px 0 0 ${silver}, inset 0 -1px 0 ${silver}, inset 0 0 30px -10px ${alpha(violet, 0.6)} !important; }

/* Duel: pearl-bezel life bars led by a gem; phases are bubbles. */
${SEL.life} { border-color: ${silver} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${silverDeep}, inset 0 0 0 1px ${alpha(silverLit, 0.5)}, 0 0 12px -2px ${alpha(violet, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -2px; width: 34px; height: 34px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 200deg, ${silverLit}, ${aqua}, ${silverDeep}, ${silver}, ${silverLit}, ${silverDeep}, ${silverLit}) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 10px -2px ${alpha(violet, 0.7)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${silverDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${glass} 30%, ${glassDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.15)} 25%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.85)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.15)} 25%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.85)}; }
${sel(['#duel .phase span'])} { color: ${silverLit} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${silverDeep} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(violet, '#ffffff', 0.12)}, ${mix(violet, t.bg, 0.5)}) !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${glassDeep}) !important; box-shadow: inset 0 0 0 1px ${silver}, inset 0 0 0 3px ${silverDeep} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${silver}, 0 0 0 4px ${goldDeep}, 0 0 16px -4px ${alpha(violet, 0.8)} !important; }

/* Duel room: pearl rings around water glass. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glass, 0.8)}, ${alpha(t.bg, 0.88)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${silverLit}, ${silver} 30%, ${silverDeep} 55%, ${silver} 80%, ${silverLit}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${glassDeep} !important; box-shadow: 0 0 0 0.35em ${glassDeep} !important; border-radius: 3px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(violet, 0.25)}, transparent 45%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(violet, 0.45)}, ${alpha(silver, 0.12)}) !important; }

/* Deck constructor: water panels banded in pearl and gold. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(glass, t.surface, 0.4)}, ${glassDeep}) !important; box-shadow: inset 0 0 0 1px ${silverLit}, inset 0 0 0 3px ${silverDeep}, inset 0 0 0 4px ${alpha(gold, 0.5)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${silver} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glass, 0.88)}, ${alpha(t.bg, 0.92)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: pearl with an aqua glow. */
${titles} { color: ${silverLit} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${t.bg}, 0 0 16px ${alpha(violet, 0.75)} !important; }

/* Text fields: deep-water wells with a pearl lip. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${silverDeep} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(silver, 0.3)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${silver} !important; box-shadow: inset 0 2px 4px #000000, 0 0 10px ${alpha(violet, 0.8)} !important; }

/* Scrollbars: pearl rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${silverDeep}, ${silverLit}, ${silverDeep}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
