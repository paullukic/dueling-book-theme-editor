// one-piece: a pirate ship's deck. Dark-stained ship timber with plank seams
// and nails, twisted hemp rope frames with brass corner plates, the straw hat
// as the crest, log-pose glass on the life bars and compass roses on the
// phases. (t, kit) -> CSS string; see chrome/kit.js.
import { mix, deepForWhite } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const timber = mix(mix(t.accent2, t.accent, 0.4), t.bg, 0.72);
  const timberDeep = mix(timber, t.bg, 0.55);
  const timberLit = mix(timber, t.accent2, 0.12);
  const rope = mix(mix(t.accent, t.text, 0.3), '#000000', 0.05);
  const ropeDark = mix(rope, t.bg, 0.6);
  const brass = mix(t.accent, '#ffffff', 0.12);
  const brassDim = mix(t.accent, t.bg, 0.45);
  const ink = mix(t.bg, '#000000', 0.5);
  const sea = mix(t.bg, t.opp, 0.25);

  // Plank seams, nails and a little grain: the deck under every panel.
  const planks = svg(160, 36, `<path d="M0 0.5H160" stroke="${ink}" stroke-opacity="0.55" stroke-width="1.4"/><path d="M0 1.6H160" stroke="${rope}" stroke-opacity="0.06"/><path d="M10 12Q50 9 90 13T160 11M0 25Q40 28 80 24T150 27" fill="none" stroke="${rope}" stroke-opacity="0.05" stroke-width="1"/><g fill="${ink}" fill-opacity="0.6"><circle cx="6" cy="6" r="1.3"/><circle cx="6" cy="30" r="1.3"/></g><path d="M80 0V36" stroke="${ink}" stroke-opacity="0.25"/>`);

  // Nine-slice rope frame: a twisted hemp rope with brass corner plates.
  const corner = `<path d="M2 2H17V6H6V17H2Z" fill="${brass}" stroke="${ink}" stroke-width="0.8"/><circle cx="5.2" cy="5.2" r="1.4" fill="${ink}" fill-opacity="0.7"/><circle cx="13" cy="4" r="0.9" fill="${ink}" fill-opacity="0.6"/><circle cx="4" cy="13" r="0.9" fill="${ink}" fill-opacity="0.6"/>`;
  let strands = '';
  for (let k = 0; k < 60; k += 4) {
    strands += `M${k} 7.2l3.2 -6.4M${k} 59.2l3.2 -6.4M0.8 ${k + 3.2}l6.4 -3.2M52.8 ${k + 3.2}l6.4 -3.2`;
  }
  const ropeFrame = svg(60, 60, `<rect x="4" y="4" width="52" height="52" fill="none" stroke="${ink}" stroke-opacity="0.7" stroke-width="8"/><rect x="4" y="4" width="52" height="52" fill="none" stroke="${rope}" stroke-width="6"/><path d="${strands}" stroke="${ropeDark}" stroke-width="1.4"/><rect x="4" y="3" width="52" height="52" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1"/>${corner}<g transform="matrix(-1 0 0 1 60 0)">${corner}</g><g transform="matrix(1 0 0 -1 0 60)">${corner}</g><g transform="matrix(-1 0 0 -1 60 60)">${corner}</g>`);
  const frame = (px = 14) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px round; box-sizing: border-box;`;

  // The straw hat crest: low crown, red band, wide brim, inked edge.
  const hatSvg = (w, h) => svg(w, h, `<g transform="translate(${w / 2} ${h * 0.6}) scale(${(w / 130).toFixed(3)})" stroke="${ink}" stroke-width="3" stroke-linejoin="round"><path d="M-62 8C-50 -2 -30 -4 0 -4C30 -4 50 -2 62 8C46 18 24 20 0 20C-24 20 -46 18 -62 8Z" fill="${t.accent}"/><path d="M-30 2C-32 -20 -18 -32 0 -32C18 -32 32 -20 30 2C12 6 -12 6 -30 2Z" fill="${t.accent}"/><path d="M-31 -8C-12 -4 12 -4 31 -8L30.5 1C12 5 -12 5 -30.5 1Z" fill="${t.accent2}"/><path d="M-22 -20C-14 -26 -6 -28 2 -28" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2.5" stroke-linecap="round"/></g>`);
  const hat = hatSvg(44, 26);
  // A reef knot in hemp rope: the finial on every tile but the first.
  const knot = svg(34, 16, `<g fill="none" stroke-linecap="round"><path d="M2 8H11M23 8H32" stroke="${ropeDark}" stroke-width="5"/><path d="M2 8H11M23 8H32" stroke="${rope}" stroke-width="3.4"/><path d="M11 8C11 2 23 2 23 8C23 14 11 14 11 8Z" stroke="${ropeDark}" stroke-width="5"/><path d="M11 8C11 2 23 2 23 8C23 14 11 14 11 8Z" stroke="${rope}" stroke-width="3.4"/><path d="M17 3.4V12.6" stroke="${ropeDark}" stroke-width="1.2"/><path d="M4 8h1.6M7.4 8H9M25 8h1.6M28.4 8H30" stroke="${ropeDark}" stroke-width="1"/></g>`);
  const bigHat = hatSvg(120, 60);

  // A coil of rope flanking the dialog crest.
  const crest = svg(220, 64, `<path d="M8 50Q60 40 110 46Q160 40 212 50" fill="none" stroke="${ropeDark}" stroke-width="7" stroke-linecap="round"/><path d="M8 50Q60 40 110 46Q160 40 212 50" fill="none" stroke="${rope}" stroke-width="5" stroke-linecap="round"/><path d="M8 50Q60 40 110 46Q160 40 212 50" fill="none" stroke="${ropeDark}" stroke-width="5" stroke-dasharray="1.6 3.4"/><g transform="translate(50 0)"><g transform="translate(60 38) scale(0.95)" stroke="${ink}" stroke-width="3" stroke-linejoin="round"><path d="M-62 8C-50 -2 -30 -4 0 -4C30 -4 50 -2 62 8C46 18 24 20 0 20C-24 20 -46 18 -62 8Z" fill="${t.accent}"/><path d="M-30 2C-32 -20 -18 -32 0 -32C18 -32 32 -20 30 2C12 6 -12 6 -30 2Z" fill="${t.accent}"/><path d="M-31 -8C-12 -4 12 -4 31 -8L30.5 1C12 5 -12 5 -30.5 1Z" fill="${t.accent2}"/><path d="M-22 -20C-14 -26 -6 -28 2 -28" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2.5" stroke-linecap="round"/></g></g>`);

  // Log pose: a glass dome on a brass base, a needle pointing up the Grand Line.
  const logPose = svg(22, 38, `<rect x="4" y="27" width="14" height="9" rx="2" fill="${brassDim}" stroke="${brass}" stroke-width="1.2"/><path d="M2 28H20" stroke="${brass}" stroke-width="2"/><circle cx="11" cy="15" r="9.5" fill="${alpha(t.opp, 0.35)}" stroke="${mix(t.text, t.opp, 0.4)}" stroke-width="1.2"/><path d="M11 7.5L13 15H9Z" fill="${t.accent2}"/><path d="M9 15H13L11 22.5Z" fill="${mix(t.text, t.opp, 0.3)}"/><path d="M6.5 10Q8.5 7.5 11 7.2" fill="none" stroke="#ffffff" stroke-opacity="0.7" stroke-width="1.2" stroke-linecap="round"/>`);

  // Compass rose laid over the phase discs.
  let rose = '';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const len = i % 2 ? 13 : 20;
    const [px, py] = [22.5 + Math.cos(a) * len, 22.5 + Math.sin(a) * len];
    const [lx, ly] = [22.5 + Math.cos(a - 0.4) * 4, 22.5 + Math.sin(a - 0.4) * 4];
    const [rx, ry] = [22.5 + Math.cos(a + 0.4) * 4, 22.5 + Math.sin(a + 0.4) * 4];
    rose += `M${lx.toFixed(2)} ${ly.toFixed(2)}L${px.toFixed(2)} ${py.toFixed(2)}L${rx.toFixed(2)} ${ry.toFixed(2)}`;
  }
  const compass = svg(45, 45, `<circle cx="22.5" cy="22.5" r="20.5" fill="none" stroke="${brass}" stroke-opacity="0.45" stroke-width="1"/><circle cx="22.5" cy="22.5" r="17.5" fill="none" stroke="${brass}" stroke-opacity="0.25" stroke-width="0.8" stroke-dasharray="1 2.4"/><path d="${rose}Z" fill="${brass}" fill-opacity="0.22" stroke="${brass}" stroke-opacity="0.35" stroke-width="0.7"/>`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${ink}, 0 2px 3px ${ink} !important;`;
  const timberBg = (lift = 0) => `radial-gradient(ellipse 80% 90% at 50% 0%, ${alpha(mix(t.accent, t.accent2, 0.5), 0.1 + lift)}, transparent 70%), var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${timberLit}, ${timberDeep})`;

  // Pop-up buttons: a straw-gold lacquered plank (OK/Yes) and a dark timber one (No/Cancel), nailed with brass.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    const nails = [[13, 18], [w - 13, 18], [13, 60.5], [w - 13, 60.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${c.nail}" stroke="${ink}" stroke-width="0.8"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="5" fill="${ropeDark}"/><rect x="8.5" y="12.5" width="${bw - 5}" height="53.5" rx="3" fill="url(#g)" stroke="${rope}" stroke-width="2.5" stroke-dasharray="1.6 2.6"/><path d="M12 39H${w - 12}" stroke="${ink}" stroke-opacity="0.18" stroke-width="1.2"/><path d="M12 16H${w - 12}" stroke="#ffffff" stroke-opacity="0.25"/>${nails}<text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="800" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: mix(t.accent, '#ffffff', 0.15), bot: mix(t.accent, timber, 0.35), text: t.accentText, nail: brassDim };
  const popSecondary = { top: timberLit, bot: timberDeep, text: t.text, nail: brass };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.6)}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [ropeFrame, hat, planks, bigHat, logPose, compass, crest, knot].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: timber planks lashed in a rope frame, the straw hat on top. */
${SEL.tile} { background: ${timberBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 14px round !important; box-shadow: inset 0 0 0 1px ${alpha(ink, 0.8)}, inset 0 -12px 18px -8px ${alpha('#000000', 0.55)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 17px); top: -8px; width: 34px; height: 16px; pointer-events: none; background: var(--dbtc-u7) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu #room_btn.menu_btn .content']), 'before')} { left: calc(50% - 20px); top: -10px; width: 40px; height: 24px; background: var(--dbtc-u1) center / contain no-repeat; }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${timberBg(0.16)} !important; box-shadow: inset 0 0 0 1px ${alpha(ink, 0.8)}, inset 0 0 24px ${alpha(t.accent, 0.3)}, 0 0 18px -4px ${alpha(t.accent, 0.65)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: a timber plank with a brass lip. */
${SEL.button} { background: var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${timberLit}, ${timberDeep}) !important; border-color: ${brassDim} !important; color: ${t.text} !important; border-radius: 3px !important; box-shadow: inset 0 1px 0 ${alpha(brass, 0.35)}, inset 0 0 0 1px ${alpha(ink, 0.6)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${mix(timberLit, t.accent, 0.25)}, ${timber}) !important; border-color: ${brass} !important; box-shadow: inset 0 1px 0 ${alpha(brass, 0.5)}, 0 0 10px -2px ${alpha(t.accent, 0.75)} !important; }
${SEL.buttonDown} { background: ${timberDeep} !important; border-color: ${t.accent} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a captain's cabin panel in a rope frame, the straw hat on a rope over the top. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(t.accent, 0.16)}, transparent 70%), var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${mix(timber, t.surface, 0.12)}, ${mix(timberDeep, t.bg, 0.3)}) !important; border-radius: 6px !important; box-shadow: 0 0 0 1px ${ropeDark}, 0 0 0 4px ${timberDeep}, 0 0 0 5px ${alpha(brass, 0.55)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(16)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 110px); top: -40px; right: auto; bottom: auto; width: 220px; height: 64px; pointer-events: none; z-index: 1; background: var(--dbtc-u6) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 3px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a timber header with a rope rule, the window edged in rope. */
${SEL.chatTop} { background: var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${timberLit}, ${timberDeep}) !important; box-shadow: inset 0 -3px 0 ${rope}, inset 0 -5px 0 ${ropeDark}, inset 0 1px 0 ${alpha(brass, 0.4)} !important; }
${SEL.chat} { background: var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${mix(timberDeep, t.surface, 0.2)}, ${mix(timberDeep, t.bg, 0.5)}) !important; box-shadow: inset 2px 0 0 ${ropeDark}, inset -2px 0 0 ${ropeDark}, inset 0 -2px 0 ${ropeDark} !important; }

/* Duel: brass-banded life bars led by a log pose; rope-rimmed compass-rose phases. */
${SEL.life} { border-color: ${brass} !important; border-radius: 4px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 3px ${ropeDark}, 0 0 0 4px ${alpha(rope, 0.6)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 4px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 45%), linear-gradient(90deg, ${mix(mix(t.accent, t.accent2, 0.06), '#000000', 0.15)}, ${t.accent} 45%, ${mix(t.accent, '#e0b050', 0.6)}) !important; }
/* A red inner hairline ties the gold self bar to the red self zones. */
${sel(['#duel #lifepoints1 .life_border'])} { box-shadow: inset 0 0 0 2px ${t.self}, 0 0 0 1px ${ink}, 0 0 0 3px ${ropeDark}, 0 0 0 4px ${alpha(rope, 0.6)}, 0 4px 10px -3px #000000 !important; }
/* The numeral fade under the self count dims gold into a warm umber, not the sea's teal ink (which turns it olive). */
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 45%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.6)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -20px; top: -6px; width: 22px; height: 38px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: radial-gradient(circle, transparent 58%, ${alpha('#ffffff', 0.22)} 70%, transparent 82%, ${alpha('#000000', 0.45)} 100%), repeating-conic-gradient(from 8deg, ${rope} 0 6deg, ${mix(rope, '#ffffff', 0.3)} 6deg 9deg, ${ropeDark} 9deg 12deg) !important; box-shadow: 0 0 0 1px ${ink}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase.active .background'])} { background: conic-gradient(from 200deg, ${brass}, ${brassDim}, ${mix(brass, '#ffffff', 0.4)}, ${brassDim}, ${brass}) !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${sea} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(sea, t.raised, 0.5)} 30%, ${mix(sea, t.bg, 0.5)}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${deepForWhite(t.self)} 20%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.75)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${deepForWhite(t.opp)} 20%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.75)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 4px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${mix(timberDeep, t.surface, 0.2)}, ${mix(timberDeep, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 2px ${ropeDark}, inset 0 0 0 4px ${alpha(rope, 0.35)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${brass}, 0 0 0 5px ${ropeDark}, 0 0 0 6px ${alpha(rope, 0.6)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${brass}, ${brassDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${timberLit}, ${timberDeep}) !important; }

/* Duel room: rope-lashed timber panels; the Genesys ring keeps the palette. */
${lobbyBorders} { background: var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${alpha(timber, 0.92)}, ${alpha(timberDeep, 0.92)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${brass}, ${brassDim} 35%, ${brass} 60%, ${brassDim}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -3px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${timberDeep} !important; box-shadow: 0 0 0 0.35em ${timberDeep} !important; border-radius: 4px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(t.accent, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(t.accent, 0.38)}, ${alpha(t.accent, 0.1)}) !important; }

/* Deck constructor: chart-table panels edged in rope. */
${deckPanels} { background: var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${mix(timberDeep, t.surface, 0.2)}, ${mix(timberDeep, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 2px ${ropeDark}, inset 0 0 0 4px ${alpha(rope, 0.35)}, inset 0 0 0 5px ${alpha(ink, 0.8)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(14)} }

/* Settings panels: the rope frame. */
${settingsPanels} { border-color: ${ropeDark} !important; background: var(--dbtc-u2) 0 0 / 160px 36px, linear-gradient(180deg, ${alpha(timber, 0.92)}, ${alpha(timberDeep, 0.92)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -3px; pointer-events: none; ${frame(14)} }

/* Titles: straw gold, burnt into the wood. */
${titles} { color: ${mix(t.accent, '#ffffff', 0.2)} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${ink}, 0 0 14px ${alpha(t.accent, 0.35)} !important; }

/* Text fields: dark wells with a brass lip, gold focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${brassDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(brass, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${t.accent} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(t.accent, 0.6)} !important; }

/* Scrollbars: brass rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${brassDim}, ${brass}, ${brassDim}) !important; border-radius: 3px !important; }

/* Links: straw gold, darker on hover. */
${sel(['#content a:hover', '#content a:active', '#content .status .reply_btn:hover', '#content #post_status_btn:hover', '#content #logged_in .logout_btn:hover', '#content #logged_in .switch_account_btn:hover'])} { color: ${mix(t.link, t.bg, 0.22)} !important; }

/* Pop-up buttons in the theme material. */
${popCss}
/* Menu: the sun disc and its glitter sat right under a feed timestamp; the WebGL sea keeps its glow and glittering path. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-op-sun { display: none; }
`;
};
