// stardust: Stardust Dragon over Satellite at night. Night-glass panels
// dusted with stars and crossed by a mint sparkle trail, faceted silver
// crystal edges cut like the dragon's wing blades, and the Crimson Dragon's
// red mark as the crest. Life bars run like a Turbo Duel speed gauge; phases
// are crystal discs with a stardust swirl. Not Synchro (no pearl frames, no
// tuner rings) and not White Dragon (no spread wings, no ice): night, a red
// mark and a trail of sparkles. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha, n1 }) => {
  const mint = t.accent;
  const mintHi = mix(t.accent, '#ffffff', 0.5);
  const crimson = t.accent2;
  const silver = mix(t.text, t.accent, 0.2);
  const silverDim = mix(t.muted, t.border, 0.3);
  const glass = mix(t.surface, t.bg, 0.35);
  const glassHi = mix(t.raised, t.accent, 0.12);
  const night = mix(t.bg, '#000000', 0.3);

  // A four-point sparkle.
  const spark = (x, y, s, fill = '#ffffff', o = 1) => `<path d="M${x} ${n1(y - s)}Q${x} ${y} ${n1(x + s * 0.28)} ${y}Q${x} ${y} ${x} ${n1(y + s)}Q${x} ${y} ${n1(x - s * 0.28)} ${y}Q${x} ${y} ${x} ${n1(y - s)}Z" fill="${fill}" fill-opacity="${o}"/>`;

  // Night-sky grain: scattered stars.
  const stars = svg(64, 64, `<g fill="${t.text}"><circle cx="7" cy="9" r="0.7" fill-opacity="0.3"/><circle cx="41" cy="5" r="0.5" fill-opacity="0.25"/><circle cx="23" cy="31" r="0.9" fill-opacity="0.22"/><circle cx="55" cy="38" r="0.6" fill-opacity="0.3"/><circle cx="12" cy="52" r="0.5" fill-opacity="0.25"/><circle cx="46" cy="58" r="0.8" fill-opacity="0.2"/></g>`);

  // The sparkle trail: a mint streak rising left to right, flaring at its head.
  let trailDots = '';
  for (let i = 0; i < 9; i++) trailDots += `<circle cx="${n1(20 + i * 22)}" cy="${n1(52 - i * 4.6 + (i % 2 ? 3 : -3))}" r="${n1(0.6 + i * 0.12)}" fill="${mintHi}" fill-opacity="${n1(0.25 + i * 0.07)}"/>`;
  const trail = svg(240, 60, `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${mint}" stop-opacity="0"/><stop offset="1" stop-color="${mint}" stop-opacity="0.5"/></linearGradient></defs><path d="M0 60Q120 44 222 14" fill="none" stroke="url(#g)" stroke-width="7" stroke-linecap="round" stroke-opacity="0.45"/><path d="M0 60Q120 44 222 14" fill="none" stroke="url(#g)" stroke-width="1.6" stroke-linecap="round"/>${trailDots}${spark(222, 14, 9)}${spark(222, 14, 4, mintHi)}`);

  // Nine-slice crystal frame: chamfered corners cut like blade facets, a silver
  // outer edge, a mint inner hairline, a tiny sparkle at each corner.
  const facet = `<path d="M1 12L12 1H20L1 20Z" fill="${silver}" fill-opacity="0.85"/><path d="M4 12.5L12.5 4" stroke="#ffffff" stroke-opacity="0.8" stroke-width="0.8"/>`;
  const frameSvg = svg(60, 60, `<path d="M12 1H48L59 12V48L48 59H12L1 48V12Z" fill="none" stroke="${silver}" stroke-width="1.4"/><path d="M13 5H47L55 13V47L47 55H13L5 47V13Z" fill="none" stroke="${mint}" stroke-opacity="0.55" stroke-width="0.8"/>${facet}<g transform="matrix(-1 0 0 1 60 0)">${facet}</g><g transform="matrix(1 0 0 -1 0 60)">${facet}</g><g transform="matrix(-1 0 0 -1 60 60)">${facet}</g>`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // The Crimson Dragon's head mark: a red tribal crest (our own drawing), a
  // horned brow sweeping into two hooks over a pointed jaw, silver-rimmed.
  const markPath = 'M20 3C17 8 13 9 8 8C10 11 12 12.5 15 13C12 15 9 15 5 14C8 18 12 19 16 18L20 27L24 18C28 19 32 18 35 14C31 15 28 15 25 13C28 12.5 30 11 32 8C27 9 23 8 20 3ZM20 11L22 15L20 19L18 15Z';
  const mark = (s = 1) => `<g transform="scale(${s})"><path d="${markPath}" fill="${crimson}" fill-rule="evenodd" stroke="${mix(crimson, '#000000', 0.45)}" stroke-width="1.2" stroke-linejoin="round"/><path d="M20 5C18 8.5 15 10 11 10" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="0.8"/></g>`;
  const crest = svg(40, 30, `<path d="M20 1L39 15L20 29L1 15Z" fill="${night}" fill-opacity="0.9" stroke="${silver}" stroke-width="1.2"/><g transform="translate(4 1.6) scale(0.8)">${mark()}</g>`);

  // Pop-up crest: two crystal wing blades swept out of the Crimson mark.
  const blade = (dir) => `<g transform="${dir < 0 ? 'matrix(-1 0 0 1 160 0)' : ''}"><path d="M94 30L156 6L118 34Z" fill="${silver}" stroke="${mix(t.accent, t.bg, 0.5)}" stroke-width="0.8"/><path d="M94 30L156 6L104 26Z" fill="#ffffff" fill-opacity="0.7"/><path d="M96 36L150 26L114 42Z" fill="${mix(silver, t.accent, 0.4)}" stroke="${mix(t.accent, t.bg, 0.5)}" stroke-width="0.8"/><path d="M98 42L138 44L108 48Z" fill="${mix(t.accent, t.bg, 0.3)}" stroke="${mix(t.accent, t.bg, 0.5)}" stroke-width="0.8"/>${spark(156, 6, 5)}</g>`;
  const gable = svg(160, 60, `${blade(1)}${blade(-1)}<path d="M80 2L104 30L80 58L56 30Z" fill="${night}" stroke="${silver}" stroke-width="1.6"/><path d="M80 7L99 30L80 53L61 30Z" fill="none" stroke="${mint}" stroke-opacity="0.6" stroke-width="0.8"/><g transform="translate(57 15) scale(1.15)">${mark()}</g>`);

  // Life bar finial: a crystal blade with a sparkle.
  const finial = svg(16, 42, `<path d="M8 1L14 30L8 41L2 30Z" fill="${silver}" stroke="${mix(t.accent, t.bg, 0.5)}" stroke-width="0.8"/><path d="M8 1L8 41L2 30Z" fill="#ffffff" fill-opacity="0.55"/>${spark(8, 30, 4.5, crimson)}`);

  // Phase overlay: a stardust swirl around the disc.
  const swirl = svg(45, 45, `<path d="M22.5 3A19.5 19.5 0 0 1 42 22.5" fill="none" stroke="${mintHi}" stroke-opacity="0.75" stroke-width="1.6" stroke-linecap="round"/><path d="M22.5 42A19.5 19.5 0 0 1 3 22.5" fill="none" stroke="${mintHi}" stroke-opacity="0.45" stroke-width="1.2" stroke-linecap="round"/>${spark(42, 22.5, 4)}${spark(3, 22.5, 3, mintHi, 0.8)}`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${night}, 0 0 10px ${alpha(mint, 0.35)} !important;`;
  const nightBg = (lift = 0) => `var(--dbtc-u6) right -40px top -6px / 220px 55px no-repeat, radial-gradient(ellipse 70% 100% at 100% 0%, ${alpha(mint, 0.12 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${glassHi}, ${glass})`;

  // Pop-up buttons: faceted crystal (primary) and night glass (secondary).
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.48" stop-color="${c.mid}"/><stop offset="0.52" stop-color="${c.bot}"/><stop offset="1" stop-color="${c.low}"/></linearGradient></defs><path d="M20 10H${n1(w - 20)}L${n1(w - 6)} 24V54.5L${n1(w - 20)} 68.5H20L6 54.5V24Z" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/><path d="M21 14.5H${n1(w - 21)}L${n1(w - 10.5)} 25" fill="none" stroke="#ffffff" stroke-opacity="${c.shine}" stroke-width="1.4"/>${spark(n1(w - 20), 18, 6, c.spark)}<text x="${n1(w / 2)}" y="39.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: mix(mintHi, '#ffffff', 0.3), mid: mintHi, bot: mint, low: mix(mint, t.bg, 0.3), edge: mix(mint, '#000000', 0.5), shine: 0.9, spark: '#ffffff', text: t.accentText, shadow: alpha(mint, 0.35) };
  const popSecondary = { top: glassHi, mid: mix(glassHi, t.bg, 0.2), bot: glass, low: night, edge: silver, shine: 0.35, spark: mint, text: t.text, shadow: alpha('#000000', 0.7) };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 5px ${c.shadow}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  // Turbo Duel speed gauge: slanted speed ticks over the side colour.
  const dust = svg(64, 20, `${spark(9, 6, 2.6, '#ffffff', 0.75)}${spark(30, 14, 1.8, '#ffffff', 0.55)}${spark(50, 5, 1.5, '#ffffff', 0.6)}<circle cx="20" cy="9" r="0.6" fill="#ffffff" fill-opacity="0.6"/><circle cx="41" cy="16" r="0.5" fill="#ffffff" fill-opacity="0.5"/><circle cx="58" cy="12" r="0.6" fill="#ffffff" fill-opacity="0.55"/>`);
  const gauge = (c) => `var(--dbtc-u7) 0 0 / 64px 100% repeat-x, linear-gradient(180deg, ${alpha('#ffffff', 0.34)}, transparent 48%, ${alpha('#000000', 0.12)}), linear-gradient(90deg, ${mix(c, t.bg, 0.45)}, ${c} 55%, ${mix(c, t.bg, 0.15)})`;
  const vars = [frameSvg, crest, stars, gable, finial, swirl, trail, dust].map((s, i) => `--dbtc-u${i}: ${svgUrl(s)};`).join(' ');

  return `
html body { ${vars} }
/* Menu tiles: night glass in a faceted crystal frame, a sparkle trail across the corner, the Crimson mark on top. */
${SEL.tile} { background: ${nightBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 16px stretch !important; border-radius: 0 !important; box-shadow: inset 0 1px 0 ${alpha(silver, 0.25)}, inset 0 -12px 18px -10px #000000, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 25px); top: -18px; width: 50px; height: 37px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 3px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${nightBg(0.14)} !important; box-shadow: inset 0 0 0 1px ${alpha(mint, 0.55)}, inset 0 0 22px ${alpha(mint, 0.16)}, 0 0 18px -4px ${alpha(mint, 0.7)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: a crystal facet over night glass, the upper half catching the light. */
${SEL.button} { background: linear-gradient(180deg, ${alpha(silver, 0.16)}, ${alpha(silver, 0.05)} 50%, transparent 52%), var(--dbtc-u2), linear-gradient(180deg, ${glassHi}, ${glass}) !important; border-color: ${silverDim} !important; color: ${t.text} !important; border-radius: 3px !important; box-shadow: inset 0 1px 0 ${alpha(silver, 0.45)}, inset 0 -1px 0 ${alpha(mint, 0.4)}, 0 2px 6px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${alpha(mint, 0.3)}, ${alpha(mint, 0.1)} 50%, transparent 52%), linear-gradient(180deg, ${mix(glassHi, mint, 0.15)}, ${glass}) !important; border-color: ${mint} !important; box-shadow: inset 0 1px 0 ${alpha(mintHi, 0.6)}, 0 0 12px -2px ${alpha(mint, 0.7)} !important; }
${SEL.buttonDown} { background: ${night} !important; border-color: ${crimson} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a night-sky pane in a crystal frame under the Crimson mark and two wing blades. */
${SEL.dialog} { background: var(--dbtc-u6) right 10px top 4px / 240px 60px no-repeat, radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(mint, 0.14)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${glassHi}, ${night}) !important; border-radius: 4px !important; box-shadow: 0 0 0 1px ${silver}, 0 0 0 4px ${night}, 0 0 0 5px ${alpha(mint, 0.5)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 80px); top: -44px; right: auto; bottom: auto; width: 160px; height: 60px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 4px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a silver crystal header with the trail and the mark. */
${SEL.chatTop} { background: var(--dbtc-u6) left 30% top -18px / 200px 50px no-repeat, linear-gradient(180deg, ${mix(glassHi, silver, 0.12)}, ${glass}) !important; box-shadow: inset 0 -2px 0 ${silver}, inset 0 -3px 0 ${night}, inset 0 1px 0 ${alpha(silver, 0.4)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${silverDim}, inset -1px 0 0 ${silverDim}, inset 0 -1px 0 ${silverDim} !important; }

/* Duel: speed-gauge life bars capped with a crystal blade; stardust-swirl phases. */
${SEL.life} { border-color: ${silver} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${night}, 0 0 0 2px ${alpha(mint, 0.5)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: ${gauge(t.self)} !important; }
/* The opponent's pale silver darkens through its right half, so the numerals sit on a deeper value. */
${SEL.lifeOpp} { background: var(--dbtc-u7) 0 0 / 64px 100% repeat-x, linear-gradient(180deg, ${alpha('#ffffff', 0.34)}, transparent 48%, ${alpha('#000000', 0.12)}), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.5)}, ${mix(t.opp, '#000000', 0.12)} 40%, ${mix(t.opp, '#000000', 0.42)} 75%, ${mix(t.opp, '#000000', 0.5)}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -16px; top: -7px; width: 16px; height: 42px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 210deg, ${silver}, ${silverDim}, ${t.text}, ${silverDim}, ${silver}) !important; box-shadow: 0 0 0 1px ${night}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${night} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${glassHi} 35%, ${night}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.35)} 15%, ${t.self} 45%, ${mix(t.self, t.bg, 0.55)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.35)} 15%, ${t.opp} 45%, ${mix(t.opp, t.bg, 0.55)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 2px 0 0 ${mint}, inset 0 0 0 1px ${silverDim} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${silver}, 0 0 0 4px ${night}, 0 0 0 5px ${alpha(mint, 0.6)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${silver}, ${silverDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${glassHi}, ${night}) !important; }

/* Duel room: crystal rings around night-glass panels. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glassHi, 0.7)}, ${alpha(t.bg, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${t.text}, ${silverDim} 30%, ${mint} 55%, ${silverDim} 80%, ${t.text}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(18)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${night} !important; box-shadow: 0 0 0 0.35em ${night} !important; border-radius: 2px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(mint, 0.14)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(mint, 0.36)}, ${alpha(crimson, 0.08)}) !important; }

/* Deck constructor: night-glass trays in crystal. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(glassHi, t.surface, 0.5)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${silverDim}, inset 0 0 0 3px ${alpha(night, 0.9)}, inset 0 0 0 4px ${alpha(mint, 0.35)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }

/* Settings panels: the same crystal frame. */
${SEL.settingsPanel} { border-color: ${silverDim} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glassHi, 0.85)}, ${alpha(t.bg, 0.88)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: silver lettering with a stardust glow. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${night}, 0 0 16px ${alpha(mint, 0.55)} !important; }

/* Text fields: dark wells with a silver lip, mint focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${silverDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(silver, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${mint} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(mint, 0.6)} !important; }

/* Scrollbars: crystal rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${silverDim}, ${mintHi}, ${silverDim}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
/* Duel: no sparkles over the stage; zone borders calmed toward silver. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-sd-stage { display: none; }
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-sd-trailgrp { mask: url(#dbtefx-sd-stagefade); }
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-sd-city { mask: url(#dbtefx-sd-stagefade); }
/* Front page Welcome / Forum / Rules: night plates so the links read over the dragon. */
${sel(['#welcome_buttons > span'])} { background: ${alpha(night, 0.9)} !important; box-shadow: 0 0 0 0.25em ${alpha(night, 0.9)} !important; border-radius: 3px; }
${sel(['#duel img.field_zones'])} { filter: saturate(0.45) !important; }
`;
};
