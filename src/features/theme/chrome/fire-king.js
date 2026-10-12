// fire-king: the regalia of the Fire Kings. Crimson lacquer plates bound in
// the black-and-gold banded armour of Garunix, gold ring medallions with
// turquoise gems, and the phoenix crest (wings of crimson plumes tipped with
// turquoise flame) as the signature. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');
const f1 = (v) => Math.round(v * 10) / 10;

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const gold = t.accent;
  const goldLit = mix(t.accent, '#ffffff', 0.45);
  const goldDeep = mix(t.accent, t.bg, 0.5);
  const teal = t.accent2;
  const crimson = t.self;
  const ink = mix(t.bg, '#000000', 0.45);
  const lacquer = mix(t.raised, crimson, 0.3);
  const lacquerDeep = mix(t.bg, crimson, 0.12);
  const flame = t.warning;

  // A plume: a tapered feather, turquoise tip under a crimson body.
  const plume = (x, y, a, l, w) => {
    const p = (len, da) => {
      const r = ((a + da) * Math.PI) / 180;
      return `${f1(x + Math.cos(r) * len)} ${f1(y + Math.sin(r) * len)}`;
    };
    const d = (k) => `M${x} ${y}Q${p(l * k * 0.55, -(w / l) * 60)} ${p(l * k, 0)}Q${p(l * k * 0.55, (w / l) * 60)} ${x} ${y}Z`;
    return `<path d="${d(1)}" fill="${teal}"/><path d="${d(0.8)}" fill="url(#c)"/>`;
  };
  const grad = `<defs><linearGradient id="c" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${crimson}"/><stop offset="1" stop-color="${mix(crimson, flame, 0.5)}"/></linearGradient></defs>`;
  // Phoenix crest: two raised wings of plumes around a gold ring with a turquoise gem.
  const crest = (cx, cy, k) => {
    let w = '';
    for (let i = 0; i < 6; i++) {
      const f = i / 5;
      w += plume(f1(cx - 6 * k - f * 10 * k), f1(cy - f * 6 * k), -80 - f * 70, (20 + f * 14) * k, 7 * k);
      w += plume(f1(cx + 6 * k + f * 10 * k), f1(cy - f * 6 * k), -100 + f * 70, (20 + f * 14) * k, 7 * k);
    }
    return `${w}<circle cx="${cx}" cy="${cy}" r="${f1(9 * k)}" fill="${ink}" stroke="${gold}" stroke-width="${f1(3 * k)}"/><circle cx="${cx}" cy="${cy}" r="${f1(4.5 * k)}" fill="none" stroke="${goldLit}" stroke-width="${f1(1.2 * k)}"/><path d="M${cx} ${f1(cy - 3 * k)}l${f1(3 * k)} ${f1(3 * k)}l${f1(-3 * k)} ${f1(3 * k)}l${f1(-3 * k)} ${f1(-3 * k)}Z" fill="${teal}"/>`;
  };

  // Nine-slice frame: a black band ringed in gold, gold bars across it like
  // Garunix's armour, ring medallions with turquoise gems at the corners.
  // Stepped greca: gold step pyramids on black, a turquoise inlay set in each.
  let steps = '';
  let inlay = '';
  for (const x0 of [13, 30]) {
    steps += `M${x0} 10.6V10H${x0 + 3}V7H${x0 + 6}V4H${x0 + 11}V7H${x0 + 14}V10H${x0 + 17}V10.6Z`;
    inlay += `M${x0 + 7.4} 5.4h2.2v2.2h-2.2Z`;
  }
  const greca = `<path d="${steps}" fill="${gold}"/><path d="${inlay}" fill="${teal}"/><path d="M9 11.2H51" stroke="${goldLit}" stroke-width="1"/>`;
  const band = ['', 'matrix(1 0 0 -1 0 60)', 'matrix(0 1 1 0 0 0)', 'matrix(0 1 -1 0 60 0)'].map((m) => (m ? `<g transform="${m}">${greca}</g>` : greca)).join('');
  const ring = (x, y) => `<circle cx="${x}" cy="${y}" r="7.5" fill="${ink}" stroke="${goldLit}" stroke-width="2.4"/><path d="M${x} ${y - 3}l3 3l-3 3l-3 -3Z" fill="${teal}"/>`;
  const frameSvg = svg(60, 60, `<path d="M0 0H60V60H0ZM13 13V47H47V13Z" fill="${ink}" fill-rule="evenodd"/>${band}<rect x="0.8" y="0.8" width="58.4" height="58.4" fill="none" stroke="${goldLit}" stroke-width="1.2"/><rect x="12.6" y="12.6" width="34.8" height="34.8" fill="none" stroke="${teal}" stroke-width="1.4"/>${ring(6.5, 6.5)}${ring(53.5, 6.5)}${ring(6.5, 53.5)}${ring(53.5, 53.5)}`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px round; box-sizing: border-box;`;

  // Plumage texture: rows of overlapping feather scallops.
  const chart = svg(36, 24, `<path d="M0 24Q9 6 18 24Q27 6 36 24M-18 12Q-9 -6 0 12Q9 -6 18 12Q27 -6 36 12Q45 -6 54 12" fill="none" stroke="${flame}" stroke-opacity="0.08" stroke-width="1.2"/>`);

  const crestTile = svg(60, 36, `${grad}${crest(30, 26, 1)}`);
  const crown = svg(170, 96, `${grad}<circle cx="85" cy="72" r="21" fill="none" stroke="${gold}" stroke-width="3"/><circle cx="85" cy="72" r="18" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="5 4"/>${crest(85, 72, 1.6)}`);

  // Phase discs: the gold ring of the Fire Kings with black dashes.
  const lifeCrest = svg(40, 40, `<circle cx="20" cy="20" r="17" fill="${ink}" stroke="${goldLit}" stroke-width="3"/><circle cx="20" cy="20" r="11" fill="none" stroke="${gold}" stroke-width="2" stroke-dasharray="4 3"/><path d="M13 8.5c3.2 3.4 6.6 6.4 6.6 11.4a6.6 6.6 0 0 1-13.2 0c0-3 1.6-5.2 3.2-7c0 2 .8 3.4 2 3.8c.2-3-.2-5.6 1.4-8.2Z" fill="${flame}" stroke="${goldLit}" stroke-width="1" stroke-linejoin="round"/><path d="M13 16c1.6 1.8 3 3.2 3 5.2a3 3 0 0 1-6 0c0-1.6 1.4-3.2 3-5.2Z" fill="${goldLit}"/>`);

  const plate = `linear-gradient(180deg, ${goldLit}, ${gold} 45%, ${mix(gold, t.bg, 0.3)})`;
  const glassBg = (lift = 0) => `radial-gradient(ellipse 90% 70% at 50% 130%, ${alpha(flame, 0.2 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${lacquer}, ${lacquerDeep})`;

  // Pop-up buttons: a gold plate capped by black-and-gold bands (primary); black lacquer in gold (secondary).
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const [x0, x1, y0, y1] = [6, w - 6, 10, 68.5];
    let caps = '';
    for (let i = 0; i < 3; i++) caps += `<rect x="${f1(x0 + 4 + i * 6)}" y="${y0 + 1}" width="3" height="56.5" fill="${c.band}"/><rect x="${f1(x1 - 7 - i * 6)}" y="${y0 + 1}" width="3" height="56.5" fill="${c.band}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.55" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="${x0}" y="${y0}" width="${f1(x1 - x0)}" height="58.5" rx="3" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/>${caps}<path d="M${x0 + 24} ${y0 + 4}H${f1(x1 - 24)}" stroke="#ffffff" stroke-opacity="${c.shine}" stroke-width="2"/><path d="M${x0 + 24} ${y1 - 5}H${f1(x1 - 24)}" stroke="${teal}" stroke-width="2.4"/><text x="${w / 2}" y="39.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: goldLit, mid: gold, bot: mix(gold, t.bg, 0.35), edge: ink, band: ink, shine: 0.7, text: t.accentText };
  const popSecondary = { top: mix(lacquer, crimson, 0.25), mid: lacquer, bot: ink, edge: gold, band: gold, shine: 0.2, text: t.text };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 5px ${alpha('#000000', 0.6)}) drop-shadow(0 0 6px ${alpha(flame, 0.3)}) !important; }`)
    .join('\n');
  // The common rules below speak of the plate metal and the panel glass.
  const [silver, silverLit, silverDeep, violet, glass, glassDeep] = [gold, goldLit, goldDeep, crimson, lacquer, lacquerDeep];

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [frameSvg, crestTile, chart, crown, null, lifeCrest].map((v, i) => (v ? `--dbtc-u${i}: ${svgUrl(v)};` : '')).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: crimson lacquer in a banded gold frame, the phoenix crest above. */
${SEL.tile} { background: ${glassBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 10px round !important; border-radius: 0 !important; box-shadow: 0 10px 24px -12px #000000, 0 0 18px -10px ${alpha(violet, 0.6)} !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 28px); top: -24px; width: 56px; height: 34px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content', '#main_menu #tourneys_btn .content']), 'before')} { content: none; }
${SEL.tileHover} { background: linear-gradient(0deg, ${alpha(silver, 0.12)}, transparent 60%), ${glassBg(0.18)} !important; box-shadow: 0 0 22px -4px ${alpha(silver, 0.7)}, 0 0 40px -12px ${alpha(violet, 0.9)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 10px ${alpha(t.bg, 0.95)} !important; }

/* Buttons: gold plates with a turquoise underline. */
${SEL.button}, ${sel(['#content #settings_content > div.button'])} { background: ${plate} !important; border-color: ${silverDeep} !important; color: ${t.accentText} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.5)}, inset 0 -2px 0 ${teal}, 0 2px 6px -2px #000000 !important; }
${SEL.buttonHover}, ${sel(['#content #settings_content > div.button:hover'])} { background: linear-gradient(180deg, #ffffff, ${silverLit} 40%, ${silver}) !important; border-color: ${teal} !important; box-shadow: inset 0 -2px 0 ${teal}, 0 0 12px -2px ${alpha(flame, 0.9)} !important; }
${SEL.buttonDown} { background: ${mix(silver, t.bg, 0.3)} !important; border-color: ${gold} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.5)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.accentText, silver, 0.5)} !important; }

/* Pop-ups: lacquer in the banded frame, crowned by the phoenix crest in its ring. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 60% at 50% 0%, ${alpha(violet, 0.3)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${t.bg}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${silverLit}, 0 0 0 3px ${silverDeep}, 0 0 40px -10px ${alpha(violet, 0.8)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 85px); top: -76px; right: auto; bottom: auto; width: 170px; height: 96px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 3px 4px #000000); transform: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 14px ${alpha(violet, 0.8)} !important; }

/* Chat: a black-and-gold banded bar, lacquer below. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.12)}, transparent 55%), linear-gradient(90deg, ${ink}, ${mix(crimson, t.bg, 0.3)} 25%, ${mix(crimson, t.bg, 0.3)} 75%, ${ink}) !important; box-shadow: inset 0 2px 0 ${gold}, inset 0 4px 0 ${ink}, inset 0 6px 0 ${goldDeep}, inset 0 -2px 0 ${gold} !important; }
${sel(['#chats .chat .chat_top span'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${glassDeep}) !important; box-shadow: inset 1px 0 0 ${silver}, inset -1px 0 0 ${silver}, inset 0 -1px 0 ${silver}, inset 0 0 30px -10px ${alpha(violet, 0.6)} !important; }

/* Duel: gold-bound life bars led by a ring medallion; phases are Fire King rings. */
${SEL.life} { border-color: ${silver} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${silverDeep}, inset 0 0 0 2px ${ink}, 0 0 12px -2px ${alpha(violet, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: radial-gradient(ellipse 22% 90% at 96% 50%, ${alpha('#fff3c4', 0.75)}, transparent 70%), linear-gradient(180deg, ${alpha('#ffffff', 0.5)} 0 2px, ${alpha('#ffe9a8', 0.3)} 2px, transparent 45%, ${alpha('#5a1400', 0.25)}), linear-gradient(90deg, #e0561a, #f27a22 45%, #ffb02e) !important; box-shadow: inset 0 0 0 1px ${ink} !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -2px; width: 34px; height: 34px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: repeating-conic-gradient(from -3deg, ${flame} 0deg 6deg, ${goldDeep} 6deg 30deg) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 10px -2px ${alpha(violet, 0.7)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${ink} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: radial-gradient(circle, ${glass} 30%, ${glassDeep}) !important; }
${sel(['#duel .phase.active .background'])} { background: conic-gradient(from 200deg, ${goldLit}, ${gold}, ${goldDeep}, ${gold}, ${goldLit}) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 16px ${alpha(flame, 0.85)} !important; }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 40%, ${mix(crimson, flame, 0.25)}, ${crimson} 55%, ${mix(crimson, t.bg, 0.4)}) !important; box-shadow: 0 0 0 2px ${ink} !important; }
${sel(['#duel .phase span'])} { color: ${goldLit} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel .phase.active span', '#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${mix(t.bg, '#3a1405', 0.3)} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.45)}, 0 0 6px ${alpha(goldLit, 0.7)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${silverDeep} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(violet, '#ffffff', 0.12)}, ${mix(violet, t.bg, 0.5)}) !important; }
${sel(['#duel .cout_txt font[color="#FF0000" i]', '#duel .cout_txt font[color="red" i]'])} { color: ${goldLit} !important; }
${sel(['#duel .cout_txt font[color="#0000FF" i]', '#duel .cout_txt font[color="#0012ff" i]', '#duel .cout_txt font[color="blue" i]'])} { color: ${mix(teal, '#ffffff', 0.3)} !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${glassDeep}) !important; box-shadow: inset 0 0 0 1px ${silver}, inset 0 0 0 3px ${silverDeep} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${silver}, 0 0 0 4px ${goldDeep}, 0 0 16px -4px ${alpha(violet, 0.8)} !important; }

/* Duel room: gold rings around lacquer. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glass, 0.8)}, ${alpha(t.bg, 0.88)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${silverLit}, ${silver} 30%, ${silverDeep} 55%, ${silver} 80%, ${silverLit}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room .format .format_txt', '#deck_constructor #search .title_txt'])} { background: linear-gradient(90deg, transparent 2%, ${glassDeep} 12% 88%, transparent 98%) !important; box-shadow: none !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${glassDeep} !important; box-shadow: 0 0 0 0.35em ${glassDeep} !important; border-radius: 3px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(violet, 0.25)}, transparent 45%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(violet, 0.45)}, ${alpha(silver, 0.12)}) !important; }

/* Deck constructor: lacquer panels banded in black and gold. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(glass, t.surface, 0.4)}, ${glassDeep}) !important; box-shadow: inset 0 0 0 1px ${goldLit}, inset 0 0 0 4px ${ink}, inset 0 0 0 5px ${alpha(gold, 0.6)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels. */
${settingsPanels} { border-color: ${silver} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glass, 0.88)}, ${alpha(t.bg, 0.92)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: gold leaf with a crimson glow. */
${titles} { color: ${silverLit} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${t.bg}, 0 0 16px ${alpha(violet, 0.75)} !important; }

/* Text fields: black lacquer wells with a gold lip. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${silverDeep} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(silver, 0.3)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${silver} !important; box-shadow: inset 0 2px 4px #000000, 0 0 10px ${alpha(violet, 0.8)} !important; }

/* Scrollbars: gold rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${mix(teal, t.bg, 0.4)}, ${mix(teal, '#ffffff', 0.3)}, ${mix(teal, t.bg, 0.4)}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
