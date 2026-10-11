// demon-slayer: the Demon Slayer Corps kit. Black urushi lacquer edged in
// vermilion, the green-and-black ichimatsu check of a haori as the signature
// band, a sword guard (tsuba) crest, life bars drawn as nichirin blades with
// a wavy hamon, tsuba phase discs and a sheathed blade over the pop-ups.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const lacquer = mix(t.surface, '#000000', 0.25);
  const lacquerHi = mix(t.raised, t.text, 0.06);
  const vermilion = t.accent;
  const vermDeep = mix(t.accent, t.bg, 0.55);
  const gold = mix(t.warning, t.text, 0.3);
  const goldDim = mix(t.warning, t.bg, 0.45);
  const check = t.success;
  const checkInk = mix(t.bg, '#000000', 0.4);

  // Ichimatsu check: the haori pattern, as a tile and as a faint texture.
  const checker = svg(16, 16, `<rect width="16" height="16" fill="${checkInk}"/><rect width="8" height="8" fill="${check}"/><rect x="8" y="8" width="8" height="8" fill="${check}"/>`);
  const checkerFaint = svg(24, 24, `<rect width="12" height="12" fill="${t.text}" fill-opacity="0.0125"/><rect x="12" y="12" width="12" height="12" fill="${t.text}" fill-opacity="0.0125"/>`);
  // Seigaiha waves (water breathing) for pop-up panels.
  const waves = svg(40, 20, `<g fill="none" stroke="${t.accent2}" stroke-opacity="0.09"><path d="M0 20a10 10 0 0 1 20 0a10 10 0 0 1 20 0M4 20a6 6 0 0 1 12 0M24 20a6 6 0 0 1 12 0M-10 10a10 10 0 0 1 20 0M10 10a10 10 0 0 1 20 0M30 10a10 10 0 0 1 20 0"/></g>`);

  // Nine-slice lacquer frame: a vermilion line inside a black rim, gold corner pins.
  const pin = (x, y) => `<path d="M${x} ${y - 3.4}L${x + 3.4} ${y}L${x} ${y + 3.4}L${x - 3.4} ${y}Z" fill="${gold}"/>`;
  const frameSvg = svg(60, 60, `<rect x="1" y="1" width="58" height="58" fill="none" stroke="${checkInk}" stroke-width="2"/><rect x="3.5" y="3.5" width="53" height="53" fill="none" stroke="${vermilion}" stroke-width="1.6"/><rect x="6.5" y="6.5" width="47" height="47" fill="none" stroke="${goldDim}" stroke-width="0.6"/>${pin(3.5, 3.5)}${pin(56.5, 3.5)}${pin(3.5, 56.5)}${pin(56.5, 56.5)}`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Tsuba: a round sword guard, black iron with a gold rim and four openings.
  const tsuba = (s, cx, cy) => `<g transform="translate(${cx} ${cy}) scale(${s})"><circle r="14" fill="${checkInk}" stroke="${gold}" stroke-width="1.6"/><circle r="11.5" fill="none" stroke="${goldDim}" stroke-width="0.6"/><path d="M-2.4 -5H2.4V5H-2.4Z" fill="${t.bg}" stroke="${gold}" stroke-width="0.6"/><g fill="${vermDeep}" stroke="${goldDim}" stroke-width="0.5"><ellipse cx="0" cy="-9" rx="3.4" ry="1.8"/><ellipse cx="0" cy="9" rx="3.4" ry="1.8"/><ellipse cx="-8" cy="0" rx="1.8" ry="3"/><ellipse cx="8" cy="0" rx="1.8" ry="3"/></g></g>`;
  const badge = svg(30, 30, tsuba(1, 15, 15));
  // A sheathed nichirin blade with its tsuba and wrapped hilt, over the pop-ups.
  let wrap = '';
  for (let x = 22; x < 50; x += 6) wrap += `M${x} 26L${x + 6} 34M${x} 34L${x + 6} 26`;
  const sword = svg(170, 60, `<path d="M58 26.5H160Q166 30 160 33.5H58Z" fill="${checkInk}" stroke="${vermDeep}" stroke-width="1"/><path d="M62 28H156" stroke="${vermilion}" stroke-opacity="0.55" stroke-width="0.8"/><path d="M100 26.5V33.5M128 26.5V33.5" stroke="${gold}" stroke-width="1.6"/><rect x="52" y="25.5" width="6" height="9" fill="${gold}"/>${tsuba(1.05, 46, 30)}<path d="M18 26H34V34H18Q12 30 18 26Z" fill="${checkInk}"/><path d="${wrap}" stroke="${vermilion}" stroke-width="1.2"/><path d="M10 25.5H18V34.5H10Z" fill="${gold}"/>`);
  // Tsuba ring for phase discs.
  let holes = '';
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    holes += `<ellipse cx="${(22.5 + Math.cos(a) * 15).toFixed(2)}" cy="${(22.5 + Math.sin(a) * 15).toFixed(2)}" rx="3" ry="1.6" transform="rotate(${(a * 180) / Math.PI + 90} ${(22.5 + Math.cos(a) * 15).toFixed(2)} ${(22.5 + Math.sin(a) * 15).toFixed(2)})"/>`;
  }
  const guard = svg(45, 45, `<circle cx="22.5" cy="22.5" r="20.5" fill="none" stroke="${gold}" stroke-opacity="0.7" stroke-width="1.5"/><g fill="${t.bg}" fill-opacity="0.55">${holes}</g>`);
  // Mokko tsuba outline around each phase disc: four lobes on the diagonals,
  // cusped at the sides, with seppa plates at top and bottom; open in the middle.
  let lobe = '';
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    const rad = 25.3 + 4.4 * Math.pow(Math.abs(Math.sin(2 * a)), 0.55);
    lobe += `${i ? 'L' : 'M'}${(30 + Math.cos(a) * rad).toFixed(2)} ${(30 + Math.sin(a) * rad).toFixed(2)}`;
  }
  const tsubaRim = svg(60, 60, `<path d="${lobe}ZM30 5.7A24.3 24.3 0 1 0 30 54.3A24.3 24.3 0 1 0 30 5.7Z" fill="${gold}" fill-rule="evenodd" stroke="${checkInk}" stroke-width="1"/><path d="${lobe}Z" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="0.6" transform="translate(30 30) scale(0.96) translate(-30 -30)"/><g fill="${goldDim}" stroke="${checkInk}" stroke-width="0.6"><rect x="26.5" y="3.2" width="7" height="3.6" rx="0.8"/><rect x="26.5" y="53.2" width="7" height="3.6" rx="0.8"/></g>`);
  // The hamon: a soft wave along a blade's edge (life bars).
  let wave = 'M0 13';
  for (let x = 0; x < 60; x += 10) wave += `Q${x + 5} 8 ${x + 10} 13`;
  const hamon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20" preserveAspectRatio="none"><defs><linearGradient id="f"><stop offset="0" stop-color="#ffffff" stop-opacity="1"/><stop offset="0.45" stop-color="#ffffff" stop-opacity="0.8"/><stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs><path d="${wave}V20H0Z" fill="url(#f)" fill-opacity="0.22"/><path d="${wave}" fill="none" stroke="url(#f)" stroke-opacity="0.5" stroke-width="0.8" vector-effect="non-scaling-stroke"/></svg>`;
  // The hilt end of the life bar: wrapped grip with a tsuba.
  let grip = '';
  for (let y = 9; y < 32; y += 5) grip += `M5 ${y}L13 ${y + 5}M13 ${y}L5 ${y + 5}`;
  const hilt = svg(18, 40, `<rect x="5" y="9" width="8" height="28" fill="${checkInk}"/><path d="${grip}" stroke="${vermilion}" stroke-width="1"/><rect x="1" y="2" width="16" height="5" rx="2" fill="${gold}"/>`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 8px ${t.bg} !important;`;
  const lacquerBg = (lift = 0) => `linear-gradient(180deg, ${alpha('#ffffff', 0.07 + lift)}, transparent 35%), var(--dbtc-u2), linear-gradient(180deg, ${lacquerHi}, ${lacquer})`;

  // Pop-up buttons: lacquer plates; OK and Yes in vermilion lacquer.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient><pattern id="k" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${checkInk}"/><rect width="4" height="4" fill="${check}"/><rect x="4" y="4" width="4" height="4" fill="${check}"/></pattern></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="3" fill="url(#g)" stroke="${checkInk}" stroke-width="3"/><rect x="9" y="13" width="${bw - 6}" height="52.5" rx="2" fill="none" stroke="${c.edge}" stroke-width="1.6"/><rect x="11" y="57" width="${bw - 10}" height="6" fill="url(#k)" fill-opacity="${c.check}"/><path d="M12 16H${bw}" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.5"/><text x="${w / 2}" y="38.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="25" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.6)}) !important; }`).join('\n');
  const popPrimary = { top: mix(vermilion, t.bg, 0.25), bot: mix(vermilion, t.bg, 0.6), edge: gold, text: '#ffffff', check: 1 };
  const popSecondary = { top: lacquerHi, bot: lacquer, edge: vermDeep, text: t.text, check: 0.7 };

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [frameSvg, badge, checkerFaint, sword, checker, waves, guard, hamon, hilt, tsubaRim].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: black lacquer in a vermilion frame, a haori check along the foot, a tsuba crest. */
${SEL.tile} { background: linear-gradient(0deg, transparent 0 1px, ${alpha(t.bg, 0)} 1px), var(--dbtc-u4) 0 100% / 10px 10px repeat-x, ${lacquerBg()} !important; background-size: auto, 10px 10px, auto, auto, auto !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 14px stretch !important; box-shadow: inset 0 -10px 0 -4px ${alpha(t.bg, 0.15)}, 0 10px 20px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 14px); top: -14px; width: 28px; height: 28px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: var(--dbtc-u4) 0 100% / 10px 10px repeat-x, radial-gradient(ellipse 80% 90% at 50% 100%, ${alpha(vermilion, 0.3)}, transparent 70%), ${lacquerBg(0.04)} !important; box-shadow: inset 0 0 18px ${alpha(vermilion, 0.3)}, 0 0 16px -4px ${alpha(vermilion, 0.7)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: lacquer with a vermilion edge; hover warms to vermilion. */
${SEL.button} { background: linear-gradient(180deg, ${lacquerHi}, ${lacquer}) !important; border-color: ${vermDeep} !important; color: ${t.text} !important; border-radius: 3px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.14)}, inset 0 -2px 0 ${alpha(vermilion, 0.35)}, 0 2px 4px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(vermilion, t.bg, 0.3)}, ${mix(vermilion, t.bg, 0.62)}) !important; border-color: ${gold} !important; color: #ffffff !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.25)}, 0 0 10px -2px ${alpha(vermilion, 0.8)} !important; }
${SEL.buttonDown} { background: ${lacquer} !important; border-color: ${vermilion} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: lacquer panel with seigaiha water, a vermilion frame, a sheathed blade across the top. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(vermilion, 0.14)}, transparent 70%), var(--dbtc-u5), linear-gradient(180deg, ${lacquerHi}, ${mix(lacquer, t.bg, 0.5)}) !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${checkInk}, 0 0 0 4px ${vermDeep}, 0 0 0 5px ${alpha(gold, 0.55)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(18)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 85px); top: -36px; right: auto; bottom: auto; width: 170px; height: 60px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 3px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a haori check band under a lacquer header; the window framed in vermilion. */
${SEL.chatTop} { background: var(--dbtc-u4) 0 100% / 8px 8px repeat-x, linear-gradient(180deg, ${lacquerHi}, ${lacquer}) !important; box-shadow: inset 0 -8px 0 ${alpha(t.bg, 0)}, inset 0 -9px 0 ${vermDeep}, inset 0 1px 0 ${alpha('#ffffff', 0.12)} !important; }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; right: 64px; top: 3px; width: 22px; height: 22px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; }
${sel(['#chats .chat .chat_top span'])} { ${label} }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${vermDeep}, inset -1px 0 0 ${vermDeep}, inset 0 -1px 0 ${vermDeep} !important; }

/* Duel: life bars as nichirin blades with a hamon, a wrapped hilt at the end; tsuba phases. */
${SEL.life} { border-color: ${gold} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${checkInk}, 0 0 0 2px ${alpha(vermilion, 0.5)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: var(--dbtc-u7) 0 0 / 100% 100% no-repeat, linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: var(--dbtc-u7) 0 0 / 100% 100% no-repeat, linear-gradient(180deg, ${alpha('#ffffff', 0.25)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -16px; top: -5px; width: 18px; height: 40px; pointer-events: none; background: var(--dbtc-u8) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 200deg, ${goldDim}, ${checkInk}, ${goldDim}, ${checkInk}, ${goldDim}) !important; box-shadow: 0 0 0 1px ${checkInk}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase::before'])} { content: ""; position: absolute; left: -5px; top: -5px; right: -5px; bottom: -5px; pointer-events: none; background: var(--dbtc-u9) center / 100% 100% no-repeat; filter: drop-shadow(0 2px 3px #000000); }
${sel(['#duel .phase.active::before'])} { filter: drop-shadow(0 0 6px ${alpha(gold, 0.9)}) drop-shadow(0 2px 3px #000000); }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${checkInk} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${lacquerHi} 30%, ${lacquer}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.15)} 20%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.75)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.15)} 20%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.75)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${lacquerHi}, ${mix(lacquer, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${vermDeep}, inset 0 0 0 4px ${alpha(checkInk, 0.9)}, inset 0 0 0 5px ${alpha(gold, 0.3)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${vermilion}, 0 0 0 4px ${checkInk}, 0 0 0 5px ${alpha(gold, 0.5)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${gold}, ${goldDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(vermilion, t.bg, 0.3)}, ${mix(vermilion, t.bg, 0.62)}) !important; }

${sel(['#duel #turn .red', '#duel #start_turn .red', '#duel #end_turn .red'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 50%), linear-gradient(180deg, ${mix(t.self, t.bg, 0.15)}, ${mix(t.self, t.bg, 0.55)}) !important; }
${sel(['#duel #turn .blue', '#duel #start_turn .blue', '#duel #end_turn .blue'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 50%), linear-gradient(180deg, ${mix(t.opp, t.bg, 0.15)}, ${mix(t.opp, t.bg, 0.55)}) !important; }
${sel(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }

/* Duel room: lacquer panels in vermilion frames; labels on a lacquer plate. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(lacquerHi, 0.7)}, ${alpha(t.bg, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${gold}, ${vermDeep} 30%, ${vermilion} 55%, ${vermDeep} 80%, ${gold}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${lacquer} !important; box-shadow: 0 0 0 0.35em ${lacquer} !important; border-radius: 2px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(vermilion, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(vermilion, 0.4)}, ${alpha(vermilion, 0.12)}) !important; }

/* Deck constructor: lacquer panels inside a vermilion line. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(lacquerHi, t.surface, 0.5)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${vermDeep}, inset 0 0 0 4px ${alpha(checkInk, 0.9)}, inset 0 0 0 5px ${alpha(gold, 0.3)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels: the lacquer frame over seigaiha. */
${settingsPanels} { border-color: ${vermDeep} !important; background: var(--dbtc-u5), linear-gradient(180deg, ${alpha(lacquerHi, 0.85)}, ${alpha(t.bg, 0.9)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: washi-white with a vermilion glow. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${vermDeep}, 0 0 14px ${alpha(vermilion, 0.45)} !important; }

/* Text fields: dark wells with a lacquer lip, vermilion focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${vermDeep} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(gold, 0.15)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${vermilion} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(vermilion, 0.6)} !important; }

/* Scrollbars: lacquer rods with a vermilion core. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${checkInk}, ${vermDeep}, ${checkInk}) !important; border-radius: 2px !important; }

/* Pop-up buttons: lacquer plates with a haori check, OK and Yes in vermilion. */
${popCss(popPrimary, popSecondary)}
`;
};
