// tag-force: the PSP games' interface. Piano-black glass panels with a hard
// handheld gloss across the top half and a brushed-silver hairline, the
// orange rounded selection frame that marks the cursor, the dorm stripe
// (Slifer red, Ra yellow, Obelisk blue) on menu plates, silver phase chips,
// a blue LP tag, and the story dialogue box: frosted silver with a dark name
// tab. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const silver = mix(t.text, t.muted, 0.35);
  const silverDeep = mix(t.border, t.bg, 0.2);
  const glass = mix(t.surface, t.bg, 0.35);
  const glassUp = mix(t.raised, t.surface, 0.3);
  const cursor = t.accent;
  const blue = t.accent2;
  const frost = mix(t.text, '#ffffff', 0.45);
  const frostDeep = mix(t.text, t.muted, 0.55);
  const ink = mix(t.bg, '#000000', 0.2);
  const pale = mix(t.accent2, '#ffffff', 0.62);
  const paleDeep = mix(t.accent2, '#ffffff', 0.3);
  // Inactive phase chips sit 15% dimmer than the window tabs so the orange active chip leads.
  const chip = mix(pale, t.bg, 0.15);
  const chipDeep = mix(paleDeep, t.bg, 0.15);

  // Fine brushed-metal grain for silver parts and a faint scanline for glass.
  const lines = svg(4, 4, `<path d="M0 .5H4" stroke="#ffffff" stroke-opacity="0.025"/>`);
  // Dorm stripe: red, yellow, blue bands.
  const dorm = svg(44, 10, `<path d="M4 0H16L12 10H0Z" fill="${t.self}"/><path d="M18 0H30L26 10H14Z" fill="${t.warning}"/><path d="M32 0H44L40 10H28Z" fill="${t.opp}"/><path d="M4 0H44" stroke="#ffffff" stroke-opacity="0.5"/>`);
  // LP tag: a small blue pill reading LP.
  const lpTag = svg(40, 22, `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(blue, '#ffffff', 0.35)}"/><stop offset="1" stop-color="${mix(blue, t.bg, 0.4)}"/></linearGradient></defs><rect x="1" y="1" width="38" height="20" rx="3" fill="url(#g)" stroke="${silver}" stroke-width="1.2"/><rect x="3" y="2.5" width="34" height="7" rx="3" fill="#ffffff" fill-opacity="0.3"/><text x="20" y="16" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="12" fill="#ffffff" stroke="${mix(blue, t.bg, 0.6)}" stroke-width="2" paint-order="stroke">LP</text>`);
  // The "next" arrow at the foot of the dialogue box.
  const next = svg(18, 14, `<path d="M2 2H16L9 12Z" fill="${cursor}" stroke="${mix(cursor, '#000000', 0.5)}" stroke-width="1.2" stroke-linejoin="round"/>`);

  const gloss = (k = 1) => `linear-gradient(180deg, ${alpha('#ffffff', 0.16 * k)}, ${alpha('#ffffff', 0.05 * k)} 48%, transparent 50%)`;
  const steel = mix(t.raised, t.accent2, 0.3);
  const steelDeep = mix(t.surface, t.accent2, 0.08);
  const tileBg = (lift = 0) => `${gloss()}, var(--dbtc-u0), linear-gradient(180deg, ${mix(steel, cursor, lift)}, ${steelDeep})`;
  const hair = `inset 0 1px 0 ${alpha('#ffffff', 0.35)}, inset 0 0 0 1px ${alpha(silver, 0.55)}`;
  const ring = `0 0 0 2px ${cursor}, 0 0 0 3px ${alpha(mix(cursor, '#ffffff', 0.5), 0.6)}, 0 0 14px -1px ${alpha(cursor, 0.75)}`;
  const label = `color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px ${alpha('#000000', 0.8)} !important;`;

  // Pop-up buttons: an orange gloss capsule (primary), black glass with silver (secondary).
  const popBtn = (txt, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    const top = primary ? mix(cursor, '#ffffff', 0.35) : mix(glassUp, '#ffffff', 0.1);
    const mid = primary ? cursor : glass;
    const bot = primary ? mix(cursor, t.bg, 0.35) : ink;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="0.5" stop-color="${mid}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="14" fill="url(#g)" stroke="${primary ? mix(cursor, '#ffffff', 0.55) : silver}" stroke-width="2.5"/><path d="M14 14H${n1(w - 14)}Q${n1(w - 10)} 14 ${n1(w - 10)} 18V38H10V18Q10 14 14 14Z" fill="#ffffff" fill-opacity="${primary ? 0.28 : 0.12}"/><text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${primary ? t.accentText : t.text}">${txt}</text></svg>`;
  };
  const n1 = (v) => Math.round(v * 10) / 10;
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = [['ok_btn', 'OK', true, false], ['yes_btn', 'Yes', true, false], ['no_btn', 'No', false, false], ['cancel_btn', 'Cancel', false, true]]
    .map(([n, txt, primary, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(txt, wide, primary))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.6)}) !important; }`)
    .join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .title_txt.arial_black2']);
  const labels = sel(['#content .arial_black2:not(.title_txt):not(.title1)', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const bodyText = sel(['#content #msg .body_txt', '#content #link .body_txt', '#content #confirm .body_txt', '#content #confirm2 .body_txt', '#content #input .body_txt', '#content #input2 .body_txt', '#content #combo .body_txt']);

  const vars = [lines, dorm, lpTag, next].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: black gloss plates in a silver hairline, the dorm stripe down the left edge; the orange frame is the cursor. */
${SEL.tile} { background: ${tileBg()} !important; border-color: ${silverDeep} !important; border-radius: 8px !important; box-shadow: ${hair}, 0 8px 18px -10px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: 10px; top: 7px; width: 44px; height: 10px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${tileBg(0.12)} !important; box-shadow: ${hair}, ${ring}, 0 10px 20px -10px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: small gloss capsules; hover takes the cursor frame. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: ${gloss()}, linear-gradient(180deg, ${glassUp}, ${ink}) !important; border-color: ${silverDeep} !important; color: ${t.text} !important; border-radius: 7px !important; box-shadow: ${hair}, 0 2px 4px -1px #000000 !important; }
${SEL.buttonHover} { background: ${gloss()}, linear-gradient(180deg, ${mix(glassUp, cursor, 0.18)}, ${ink}) !important; border-color: ${cursor} !important; box-shadow: ${hair}, ${ring} !important; }
${SEL.buttonDown} { background: linear-gradient(180deg, ${ink}, ${glass}) !important; border-color: ${cursor} !important; box-shadow: inset 0 2px 5px #000000, 0 0 0 2px ${cursor} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.muted, t.bg, 0.3)} !important; }

/* Pop-ups: a graphite window header over the frosted dialogue box, the orange next arrow at its foot. */
${SEL.dialog} { background: ${gloss(1.2)} 0 0 / 100% 64px no-repeat, linear-gradient(180deg, ${glassUp}, ${ink}) 0 0 / 100% 62px no-repeat, linear-gradient(180deg, ${cursor}, ${cursor}) 0 62px / 100% 3px no-repeat, linear-gradient(180deg, ${alpha('#ffffff', 0.4)}, transparent 40%), linear-gradient(180deg, ${frost}, ${frostDeep}) !important; border-radius: 10px !important; box-shadow: 0 0 0 2px ${silverDeep}, 0 0 0 3px ${alpha('#ffffff', 0.6)}, 0 18px 40px -10px #000000 !important; }
${on(SEL.dialog, 'before')} { content: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: auto; top: auto; right: 16px; bottom: 10px; width: 18px; height: 14px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; animation: dbtc-tf-next 1.1s ease-in-out infinite; }
${SEL.dialogTitle} { color: #ffffff !important; text-shadow: 0 1px 2px #000000 !important; z-index: 1; }
${bodyText} { color: ${ink} !important; text-shadow: none !important; }
@keyframes dbtc-tf-next { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
@media (prefers-reduced-motion: reduce) { ${on(SEL.dialog, 'after')} { animation: none; } }

/* Chat: a graphite title bar with a silver rule; black glass below. */
${SEL.chatTop} { background: linear-gradient(180deg, #ffffff, ${pale}) !important; box-shadow: inset 0 -3px 0 ${cursor}, inset 0 1px 0 #ffffff !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${ink} !important; text-shadow: none !important; }
${SEL.chat} { background: var(--dbtc-u0), linear-gradient(180deg, ${glass}, ${mix(t.bg, '#000000', 0.2)}) !important; box-shadow: inset 1px 0 0 ${silverDeep}, inset -1px 0 0 ${silverDeep}, inset 0 -1px 0 ${silverDeep} !important; }

/* Duel: black LP header bars with the blue LP tag; silver phase chips, the active one in the cursor frame. */
${SEL.life} { border-color: ${silver} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 3px ${mix(blue, t.bg, 0.55)}, 0 0 0 4px ${alpha(silver, 0.6)}, 0 3px 8px -2px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { background: linear-gradient(90deg, ${mix(blue, t.bg, 0.45)}, ${mix(blue, t.bg, 0.1)}) !important; box-shadow: inset 0 4px 4px -2px ${alpha('#ffffff', 0.35)} !important; }
${sel(['#duel #lifepoints1[data-dbte-lp~="low"] .life_bar', '#duel #lifepoints2[data-dbte-lp~="low"] .life_bar', '#duel #lifepoints1[data-dbte-lp~="zero"] .life_bar', '#duel #lifepoints2[data-dbte-lp~="zero"] .life_bar'])} { background: linear-gradient(90deg, ${mix(t.self, t.bg, 0.45)}, ${t.self}) !important; }
${on(sel(['#duel .lifepoints .life_border']), 'after')} { content: ""; position: absolute; left: 0; right: 0; bottom: -7px; height: 4px; pointer-events: none; background: linear-gradient(90deg, ${t.self} 0 33.3%, ${t.warning} 33.3% 66.6%, ${t.opp} 66.6%); box-shadow: 0 1px 2px #000000; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -44px; top: 4px; width: 40px; height: 22px; pointer-events: none; background: var(--dbtc-u2) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 5px #000000 !important; }
${SEL.phase} { background: linear-gradient(180deg, #ffffff, ${silver}) !important; border-radius: 8px !important; box-shadow: 0 0 0 1px ${ink}, 0 3px 6px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; border-radius: 7px !important; }
${sel(['#duel .phase .background', '#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { border-radius: 7px !important; }
${sel(['#duel .phase .background .background_inner'])} { background: transparent !important; border-radius: 7px !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: linear-gradient(180deg, ${chip}, ${chipDeep}) !important; box-shadow: inset 0 6px 5px -3px ${alpha('#ffffff', 0.35)} !important; }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: linear-gradient(180deg, ${cursor}, ${mix(cursor, t.bg, 0.2)}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { box-shadow: inset 0 6px 5px -3px ${alpha('#ffffff', 0.4)}, inset 0 -4px 0 ${t.self}, 0 0 0 2px #ffffff, 0 0 14px ${alpha(cursor, 0.85)} !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { box-shadow: inset 0 6px 5px -3px ${alpha('#ffffff', 0.4)}, inset 0 -4px 0 ${t.opp}, 0 0 0 2px #ffffff, 0 0 14px ${alpha(cursor, 0.85)} !important; }
${sel(['#duel .phase span', '#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${ink} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.45)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, #ffffff, ${silverDeep}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${gloss(1.4)}, linear-gradient(180deg, ${glassUp}, ${ink}) !important; }
${SEL.duelLog} { background: var(--dbtc-u0), linear-gradient(180deg, ${glass}, ${mix(t.bg, '#000000', 0.2)}) !important; box-shadow: inset 0 0 0 1px ${silverDeep}, inset 0 1px 0 ${alpha('#ffffff', 0.25)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${silver}, 0 0 0 3px ${ink}, 0 4px 10px -2px #000000 !important; }

/* Duel room: silver-rimmed black glass. */
${lobbyBorders} { background: ${gloss(0.6)}, linear-gradient(180deg, ${alpha(glassUp, 0.85)}, ${alpha(t.bg, 0.9)}) !important; box-shadow: 0 8px 20px -10px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(180deg, #ffffff, ${silver} 40%, ${silverDeep}) !important; filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: ${t.bg} !important; box-shadow: -0.5em 0 0 0 ${t.bg}, 0.5em 0 0 0 ${t.bg} !important; border-radius: 2px !important; text-shadow: none !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { color: ${ink} !important; text-shadow: none !important; background: linear-gradient(180deg, #ffffff, ${pale}) !important; box-shadow: 0 0 0 0.1em ${pale}, 0 0 0 calc(0.1em + 1px) ${silverDeep}, inset 0 -2px 0 ${cursor} !important; border-radius: 4px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${gloss(0.8)}, ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${gloss(0.8)}, linear-gradient(90deg, ${alpha(cursor, 0.35)}, ${alpha(cursor, 0.08)}) !important; }

/* Deck constructor: recipe-viewer panels, black glass under a silver hairline. */
${deckPanels} { background: var(--dbtc-u0), linear-gradient(180deg, ${glassUp}, ${mix(t.bg, '#000000', 0.15)}) !important; box-shadow: inset 0 0 0 1px ${silverDeep}, inset 0 1px 0 ${alpha('#ffffff', 0.3)} !important; }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${silverDeep} !important; background: ${gloss(0.5)}, linear-gradient(180deg, ${alpha(glassUp, 0.9)}, ${alpha(t.bg, 0.92)}) !important; }

/* Titles: a graphite window tab with a silver top edge and an orange underline. */
${titles} { color: #ffffff !important; background: ${gloss(1.2)}, linear-gradient(180deg, ${glassUp}, ${ink}) !important; border-radius: 6px 6px 2px 2px !important; box-shadow: 0 0 0 0.25em ${ink}, 0 0 0 calc(0.25em + 1px) ${silver}, 0 calc(0.25em + 3px) 0 0 ${cursor} !important; text-shadow: 0 1px 2px #000000 !important; }
${labels} { color: ${silver} !important; text-shadow: 0 1px 2px #000000 !important; }

/* Text fields: black glass with a silver edge; the cursor frame on focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.4)} !important; border-color: ${silverDeep} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha('#ffffff', 0.12)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 2px solid ${cursor} !important; box-shadow: inset 0 2px 4px #000000, 0 0 10px ${alpha(cursor, 0.6)} !important; }

/* Scrollbars: silver rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${silverDeep}, #ffffff, ${silverDeep}) !important; border-radius: 4px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
