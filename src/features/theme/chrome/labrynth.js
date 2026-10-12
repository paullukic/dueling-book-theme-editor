// labrynth: Lady Labrynth's silver castle. Silver gothic tracery frames,
// pointed lancet arches, crimson velvet with a quatrefoil damask, chandelier
// rose-window phases and a candelabrum at the life bar. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t0, { SEL, sel, svg, svgUrl, alpha }) => {
  // Your side's rose, lifted a touch so it reads brighter than the velvet around it.
  const t = { ...t0, self: mix(t0.self, '#ffffff', 0.1) };
  const silver = mix(t.text, t.muted, 0.25);
  const silverDim = mix(t.muted, t.border, 0.35);
  const velvet = mix(t.accent, t.surface, 0.72);
  const velvetDeep = mix(t.accent, t.bg, 0.86);
  const crystal = t.accent2;

  // Quatrefoil damask: the tracery of a gothic window, faint.
  const damask = svg(28, 28, `<g fill="none" stroke="${silver}" stroke-opacity="0.09" stroke-width="0.9"><circle cx="14" cy="9" r="5"/><circle cx="14" cy="19" r="5"/><circle cx="9" cy="14" r="5"/><circle cx="19" cy="14" r="5"/></g><path d="M0 0l3 3M28 0l-3 3M0 28l3-3M28 28l-3-3" stroke="${silver}" stroke-opacity="0.07"/>`);

  // Nine-slice silver frame: a double hairline with spandrel corners and a crimson cabochon.
  const quatre = (x, y, r) => `<g fill="${silver}"><circle cx="${x}" cy="${y - r}" r="${r}"/><circle cx="${x}" cy="${y + r}" r="${r}"/><circle cx="${x - r}" cy="${y}" r="${r}"/><circle cx="${x + r}" cy="${y}" r="${r}"/></g><circle cx="${x}" cy="${y}" r="${r * 0.9}" fill="${t.accent}"/>`;
  const corner = `<path d="M10 1.4Q14 6 19 4.6M1.4 10Q6 14 4.6 19" fill="none" stroke="${silver}" stroke-width="0.9"/>${quatre(7, 7, 2.6)}`;
  const frameSvg = (w = 1.4) =>
    svg(60, 60, `<g fill="none" stroke="${silver}"><rect x="0.7" y="0.7" width="58.6" height="58.6" stroke-width="${w}"/><rect x="4" y="4" width="52" height="52" stroke-width="0.7" stroke-opacity="0.55"/></g>${corner}<g transform="matrix(-1 0 0 1 60 0)">${corner}</g><g transform="matrix(1 0 0 -1 0 60)">${corner}</g><g transform="matrix(-1 0 0 -1 60 60)">${corner}</g>`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Pointed lancet arch with a crimson gem: the castle's window as a crest.
  const arch = svg(34, 20, `<path d="M3 20V12A15 15 0 0 1 17 1.2A15 15 0 0 1 31 12V20Z" fill="${velvetDeep}" stroke="${silver}" stroke-width="1.4"/><path d="M8 20V13A10 10 0 0 1 17 5.5A10 10 0 0 1 26 13V20" fill="none" stroke="${silver}" stroke-opacity="0.6" stroke-width="0.8"/><path d="M17 9.5l2.6 4-2.6 4-2.6-4z" fill="${t.accent}" stroke="${mix(t.accent, '#ffffff', 0.5)}" stroke-width="0.6"/>`);

  // Castle gable: a lancet arch with a rose window between two pinnacles, crystal drops below.
  const drop = (x, y, s = 1) => `<path d="M${x} ${y}l${2.2 * s} ${3.4 * s}-${2.2 * s} ${4.6 * s}-${2.2 * s}-${4.6 * s}z" fill="${crystal}" fill-opacity="0.9" stroke="#ffffff" stroke-opacity="0.6" stroke-width="0.5"/>`;
  const pin = (x) => `<path d="M${x} 6L${x + 4} 18H${x - 4}Z" fill="${silver}"/><path d="M${x - 5} 18H${x + 5}V44H${x - 5}Z" fill="${velvetDeep}" stroke="${silver}" stroke-width="1.3"/><path d="M${x} 23A2.5 2.5 0 0 1 ${x + 2.5} 26V34H${x - 2.5}V26A2.5 2.5 0 0 1 ${x} 23Z" fill="${t.accent}" fill-opacity="0.8"/>`;
  const gable = svg(160, 60, `<path d="M20 44H140" stroke="${silver}" stroke-width="2"/>${pin(30)}${pin(130)}<path d="M52 44V28A30 30 0 0 1 80 2A30 30 0 0 1 108 28V44Z" fill="${velvetDeep}" stroke="${silver}" stroke-width="1.6"/><path d="M59 44V30A23 23 0 0 1 80 10A23 23 0 0 1 101 30V44" fill="none" stroke="${silver}" stroke-opacity="0.55" stroke-width="0.9"/><circle cx="80" cy="29" r="10" fill="${mix(t.accent, t.bg, 0.4)}" stroke="${silver}" stroke-width="1.2"/><g fill="none" stroke="${silver}" stroke-width="0.8"><circle cx="80" cy="24.5" r="4.5"/><circle cx="80" cy="33.5" r="4.5"/><circle cx="75.5" cy="29" r="4.5"/><circle cx="84.5" cy="29" r="4.5"/></g><circle cx="80" cy="29" r="1.8" fill="${crystal}"/><path d="M36 44H124V48H36Z" fill="${silver}"/>${drop(48, 48)}${drop(64, 48, 0.8)}${drop(80, 48, 1.3)}${drop(96, 48, 0.8)}${drop(112, 48)}`);

  // Rose window tracery on the phase discs: only the rim, so the letters stand on clear glass.
  let cusps = '';
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    cusps += `<circle cx="${(22.5 + Math.cos(a) * 20.5).toFixed(2)}" cy="${(22.5 + Math.sin(a) * 20.5).toFixed(2)}" r="2.6"/>`;
  }
  const rose = svg(45, 45, `<g fill="none" stroke="${silver}" stroke-opacity="0.32" stroke-width="0.9">${cusps}<circle cx="22.5" cy="22.5" r="20.5"/><circle cx="22.5" cy="22.5" r="17.6" stroke-opacity="0.2"/></g>`);

  // A silver candelabrum of three lit candles standing at the life bar's end.
  const flame = (x, y, k = 1) => `<ellipse cx="${x}" cy="${y - 4 * k}" rx="${4.6 * k}" ry="${6 * k}" fill="${alpha(t.warning, 0.28)}"/><path d="M${x} ${y - 8.5 * k}C${x + 2.6 * k} ${y - 4.5 * k} ${x + 2.4 * k} ${y} ${x} ${y}C${x - 2.4 * k} ${y} ${x - 2.6 * k} ${y - 4.5 * k} ${x} ${y - 8.5 * k}Z" fill="${t.warning}"/><path d="M${x} ${y - 5 * k}C${x + 1 * k} ${y - 3 * k} ${x + 1 * k} ${y - 0.6 * k} ${x} ${y - 0.6 * k}C${x - 1 * k} ${y - 0.6 * k} ${x - 1 * k} ${y - 3 * k} ${x} ${y - 5 * k}Z" fill="#ffffff"/>`;
  const wax = mix(t.text, t.warning, 0.15);
  const candle = (x, top, bot) => `<rect x="${x - 1.9}" y="${top}" width="3.8" height="${bot - top}" rx="0.8" fill="${wax}"/><path d="M${x - 3.6} ${bot}H${x + 3.6}L${x + 2.4} ${bot + 2}H${x - 2.4}Z" fill="${silver}"/>`;
  const candelabrum = svg(36, 48, `<g fill="none" stroke="${silver}" stroke-width="1.6" stroke-linecap="round"><path d="M18 40V22"/><path d="M18 30C12 30 6 29 6 22M18 30C24 30 30 29 30 22"/></g><path d="M11 46H25L21.5 41H14.5Z" fill="${silver}"/><circle cx="18" cy="34" r="2.2" fill="${t.accent}" stroke="${silver}" stroke-width="0.8"/>${candle(6, 13, 21)}${candle(30, 13, 21)}${candle(18, 8, 21)}${flame(6, 12.5)}${flame(30, 12.5)}${flame(18, 7.5, 1.15)}`);

  // Your side's life: a lit rose, not the velvet's maroon.
  const roseLit = '#c45a7a';
  // The flower-of-life pattern on the life fills stops short of the numerals.
  const lifeDamask = [0, 28, 56].map((x) => `var(--dbtc-u2) ${x}px 50% / 28px 28px no-repeat`).join(', ');
  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 10px ${alpha(t.accent, 0.45)} !important;`;
  const velvetBg = (lift = 0) => `radial-gradient(ellipse 70% 90% at 50% 0%, ${alpha(mix(t.accent, '#ffffff', 0.15), 0.22 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${velvet}, ${velvetDeep})`;

  // Pop-up buttons (DuelingBook's OK/Yes/No/Cancel <img>s), redrawn in the theme's material.
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="${c.r}" fill="url(#g)" stroke="${c.edge}" stroke-width="2.5"/><rect x="11" y="15" width="${bw - 10}" height="48.5" rx="${Math.max(c.r - 4, 0)}" fill="none" stroke="${c.inner}" stroke-opacity="0.75" stroke-width="1"/>${c.deco(w)}<text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 4px ${c.shadow}) !important; }`).join('\n');
  const popPrimary = { top: mix(t.accent, t.bg, 0.3), bot: mix(t.accent, t.bg, 0.6), edge: silver, inner: silver, text: '#ffffff', r: 4, shadow: alpha('#000000', 0.6), deco: (w) => [[13, 17], [w - 13, 17], [13, 61.5], [w - 13, 61.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${silver}"/><circle cx="${x}" cy="${y}" r="1.2" fill="${t.accent}"/>`).join('') };
  const popSecondary = { ...popPrimary, top: mix(velvet, t.raised, 0.3), bot: velvetDeep, edge: silverDim, text: t.text };
  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const u0 = svgUrl(frameSvg());
  const u1 = svgUrl(arch);
  const u2 = svgUrl(damask);
  const u3 = svgUrl(gable);
  const u4 = svgUrl(candelabrum);
  const u5 = svgUrl(rose);
  return `
html body { ${[['u0', u0], ['u1', u1], ['u2', u2], ['u3', u3], ['u4', u4], ['u5', u5]].map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: velvet panels in a silver tracery frame, a lancet crest on top. */
${SEL.tile} { background: ${velvetBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 15px stretch !important; box-shadow: inset 0 0 0 1px ${alpha(t.bg, 0.8)}, inset 0 -10px 18px -8px ${alpha('#000000', 0.55)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 17px); top: -11px; width: 34px; height: 20px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${velvetBg(0.16)} !important; box-shadow: inset 0 0 0 1px ${alpha(t.bg, 0.8)}, inset 0 0 22px ${alpha(t.accent, 0.35)}, 0 0 18px -4px ${alpha(t.accent, 0.7)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: velvet with a silver bevel. */
${SEL.button} { background: linear-gradient(180deg, ${mix(velvet, silver, 0.12)}, ${velvetDeep}) !important; border-color: ${silverDim} !important; color: ${t.text} !important; border-radius: 3px !important; box-shadow: inset 0 1px 0 ${alpha(silver, 0.35)}, inset 0 0 0 1px ${alpha(t.bg, 0.6)}, 0 2px 5px -2px #000000 !important; }
${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: linear-gradient(180deg, ${mix(velvet, silver, 0.12)}, ${velvetDeep}) !important; border-color: ${silverDim} !important; color: ${t.text} !important; border-radius: 3px !important; box-shadow: inset 0 1px 0 ${alpha(silver, 0.35)}, inset 0 0 0 1px ${alpha(t.bg, 0.6)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(t.accent, t.surface, 0.5)}, ${velvet}) !important; border-color: ${silver} !important; box-shadow: inset 0 1px 0 ${alpha(silver, 0.5)}, 0 0 10px -2px ${alpha(t.accent, 0.8)} !important; }
${SEL.buttonDown} { background: ${velvetDeep} !important; border-color: ${t.accent} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a velvet chamber in a silver frame under a castle gable hung with crystal drops. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(t.accent, 0.22)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${mix(t.accent, t.surface, 0.82)}, ${t.bg}) !important; border-radius: 6px !important; box-shadow: 0 0 0 1px ${silverDim}, 0 0 0 4px ${velvetDeep}, 0 0 0 5px ${alpha(silver, 0.6)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 80px); top: -46px; right: auto; bottom: auto; width: 160px; height: 60px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; }
${SEL.dialogTitle} { ${label} }

/* Chat: a velvet header with a silver rule; the window framed in silver. */
${SEL.chatTop} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(t.accent, t.surface, 0.55)}, ${velvetDeep}) !important; box-shadow: inset 0 -2px 0 ${silver}, inset 0 -4px 0 ${velvetDeep}, inset 0 1px 0 ${alpha(silver, 0.4)} !important; }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; right: 64px; top: 5px; width: 30px; height: 18px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; opacity: 0.9; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${silverDim}, inset -1px 0 0 ${silverDim}, inset 0 -1px 0 ${silverDim} !important; }

/* Duel: silver-framed life bars lit by a candelabrum; rose-window phases. */
${SEL.life} { border-color: ${silver} !important; border-radius: 4px !important; box-shadow: 0 0 0 1px ${velvetDeep}, 0 0 0 2px ${alpha(silver, 0.45)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 4px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.42)}, ${alpha('#ffffff', 0.08)} 45%, transparent 55%), ${lifeDamask}, linear-gradient(90deg, ${mix(roseLit, t.bg, 0.15)}, ${roseLit} 60%, ${mix(roseLit, '#ffffff', 0.2)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.28)}, transparent 45%), ${lifeDamask}, linear-gradient(90deg, ${mix(t.opp, t.bg, 0.6)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -30px; top: -14px; width: 33px; height: 44px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
/* The top bar sits on the viewport edge: its candelabrum stands lower and shorter so the flames stay whole. */
${on(sel(['#duel #lifepoints2']), 'before')} { top: -2px; height: 36px; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 200deg, ${silver}, ${silverDim}, ${t.text}, ${silverDim}, ${silver}) !important; box-shadow: 0 0 0 1px ${velvetDeep}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${velvetDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(velvet, t.raised, 0.4)} 30%, ${velvetDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle, ${mix(t.self, '#000000', 0.22)} 45%, ${t.self} 75%, ${mix(t.self, '#ffffff', 0.35)}) !important; box-shadow: 0 0 16px ${alpha(t.self, 0.95)}, 0 0 4px ${mix(t.self, '#ffffff', 0.5)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle, ${mix(t.opp, '#000000', 0.22)} 45%, ${t.opp} 75%, ${mix(t.opp, '#ffffff', 0.35)}) !important; box-shadow: 0 0 16px ${alpha(t.opp, 0.95)}, 0 0 4px ${mix(t.opp, '#ffffff', 0.5)}; }
${sel(['#duel .phase.active .background'])} { background: conic-gradient(from 200deg, #ffffff, ${silver}, #ffffff, ${silver}, #ffffff) !important; }
${sel(['#duel .phase span'])} { color: ${silver} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel .phase.active span'])} { color: #ffffff !important; text-shadow: 0 1px 2px ${mix(t.accent, '#000000', 0.6)}, 0 0 6px ${mix(t.accent, '#000000', 0.5)} !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(t.surface, velvet, 0.25)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${silverDim}, inset 0 0 0 4px ${alpha(velvetDeep, 0.9)}, inset 0 0 0 5px ${alpha(silver, 0.35)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${silver}, 0 0 0 4px ${velvetDeep}, 0 0 0 5px ${alpha(silver, 0.5)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${silver}, ${silverDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${velvet}, ${velvetDeep}) !important; }

/* Duel room: silver tracery rings around velvet-dark panels. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(velvet, 0.55)}, ${alpha(t.bg, 0.75)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${t.text}, ${silverDim} 30%, ${silver} 55%, ${silverDim} 80%, ${t.text}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(18)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(90deg, transparent 2%, ${mix(t.surface, t.bg, 0.5)} 7% 93%, transparent 98%) 0 100% / 100% 46% no-repeat !important; box-shadow: none !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: none !important; box-shadow: none !important; z-index: 1; }
${on(sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl']), 'before')} { content: ""; position: absolute; left: -0.5em; right: -0.5em; top: 52%; bottom: -0.15em; z-index: -1; pointer-events: none; background: linear-gradient(90deg, transparent, ${mix(t.surface, t.bg, 0.5)} 0.4em calc(100% - 0.4em), transparent); }
${on(sel(['#content #settings_content .admin_lbl']), 'before')} { content: ""; position: absolute; left: -0.5em; right: -0.5em; top: 22%; bottom: 8%; z-index: -1; pointer-events: none; background: linear-gradient(90deg, transparent, ${mix(t.surface, t.bg, 0.5)} 0.4em calc(100% - 0.4em), transparent); }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(t.accent, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(t.accent, 0.4)}, ${alpha(t.accent, 0.12)}) !important; }

/* Deck constructor: panels framed like gallery windows. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(velvet, t.surface, 0.55)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${silverDim}, inset 0 0 0 4px ${alpha(velvetDeep, 0.9)}, inset 0 0 0 5px ${alpha(silver, 0.35)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }

/* Settings panels: the same silver frame. */
${settingsPanels} { border-color: ${silverDim} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(velvet, 0.75)}, ${alpha(t.bg, 0.85)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: engraved silver. */
${titles} { color: ${silver} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${velvetDeep}, 0 0 16px ${alpha(t.accent, 0.5)} !important; }

/* Text fields: dark wells with a silver lip, crimson focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${silverDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(silver, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${t.accent} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(t.accent, 0.6)} !important; }

/* Scrollbars: silver rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${silverDim}, ${silver}, ${silverDim}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss(popPrimary, popSecondary)}
/* In a duel the rose window and the swag cords would hang over the board. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx :is(.dbtefx-lb-rosewin, .dbtefx-lb-tassels) { display: none; }
/* On the menu the rose window rises and dims behind the title and its carousel dots. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-lb-rosewin { transform: translateY(-132px); opacity: 0.4; }
`;
};
