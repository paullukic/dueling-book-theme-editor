// white-dragon: the white dragon of light. Silver-white and pale-ice panels
// with dark navy lettering, a dragon's spread wings across every menu tile,
// chamfered silver frames with crystal studs, deep blue for what is active,
// pale blue lightning on hover and over the pop-ups. (t, kit) -> CSS string; see chrome/kit.js.
import { mix, deepForWhite } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const ice = t.accent;
  const frost = t.accent2;
  const navy = t.bg;
  const ink2 = mix(t.bg, t.border, 0.4);
  const deep = mix(t.border, t.accent, 0.3);
  const deepDark = mix(deep, t.bg, 0.35);
  const paleIce = mix(frost, ice, 0.18);
  const paleIce2 = mix(frost, ice, 0.4);
  const silver = mix(frost, t.muted, 0.35);
  // Active phase disc: deep enough under the white label (4.5:1 at its lightest stop).
  const activeDisc = deepForWhite(t.self, '#0b2a66', 5.5);

  // Faceted ice on pale panels: a triangle lattice, each face lit a little differently.
  const shades = [0.025, 0.06, 0.035, 0.075, 0.015, 0.05];
  let tri = '';
  let k = 0;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * 30 - (row % 2) * 15;
      const y = row * 26;
      tri += `<path d="M${x} ${y + 26}L${x + 15} ${y}L${x + 30} ${y + 26}Z" fill="${deep}" fill-opacity="${shades[k++ % 6]}"/><path d="M${x + 15} ${y}L${x + 45} ${y}L${x + 30} ${y + 26}Z" fill="#ffffff" fill-opacity="${shades[k++ % 6] * 4}"/>`;
    }
  }
  const facets = svg(120, 52, `${tri}<g fill="none" stroke="${deep}" stroke-opacity="0.08" stroke-width="0.7"><path d="M0 26H120M0 52L30 0L60 52L90 0L120 52"/></g>`);

  // Nine-slice silver frame: chamfered corners, a crystal stud, a deep blue inner line.
  const corner = `<path d="M1 14L14 1H20V3.6H15.2L3.6 15.2V20H1Z" fill="${deep}"/><path d="M6 15.5L15.5 6" stroke="${silver}" stroke-width="1.2"/><path d="M8.5 4.8L11 8.5 8.5 12.2 6 8.5Z" fill="${ice}" stroke="${deep}" stroke-width="0.7" transform="rotate(45 8.5 8.5)"/>`;
  const frameSvg = svg(60, 60, `<g fill="none"><path d="M20 2.3H40M20 57.7H40M2.3 20V40M57.7 20V40" stroke="${deep}" stroke-width="2.6"/><path d="M14 6H46L54 14V46L46 54H14L6 46V14Z" stroke="${deep}" stroke-opacity="0.45" stroke-width="0.8"/></g>${corner}<g transform="matrix(-1 0 0 1 60 0)">${corner}</g><g transform="matrix(1 0 0 -1 0 60)">${corner}</g><g transform="matrix(-1 0 0 -1 60 60)">${corner}</g>`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u1) 20 / ${px}px stretch; box-sizing: border-box;`;

  // The dragon's wings, spread from a crystal at the centre: finger bones and scalloped membranes.
  const wingHalf = `<path d="M84 22C70 8 46 1 4 3L13 9C20 10 24 13 27 18C33 13 39 14 44 19C50 15 56 16 61 21C67 18 73 19 78 24Z" fill="#ffffff" stroke="${deep}" stroke-width="1.3" stroke-linejoin="round"/><path d="M84 22L27 18M84 22L44 19M84 22L61 21M84 22C66 10 42 5 13 9" fill="none" stroke="${deep}" stroke-opacity="0.55" stroke-width="0.9"/><path d="M84 22C70 8 46 1 4 3" fill="none" stroke="${ice}" stroke-width="1"/>`;
  // Tile crest: the same wings, filled white to ice with a navy outline so they read on the pale plate.
  const tileWing = wingHalf.replace('fill="#ffffff" stroke="${deep}" stroke-width="1.3"', `fill="url(#w)" stroke="${navy}" stroke-width="1.8"`);
  const wings = svg(168, 30, `<defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${ice}"/></linearGradient></defs>${tileWing}<g transform="matrix(-1 0 0 1 168 0)">${tileWing}</g><path d="M84 4L90 15 84 28 78 15Z" fill="${ice}" stroke="${navy}" stroke-width="1.6"/><path d="M84 4L90 15H84Z" fill="#ffffff" fill-opacity="0.85"/>`);

  // Lightning: a deep blue bolt with an ice core.
  const bolt = (d, w = 1) => `<path d="${d}" fill="none" stroke="${deep}" stroke-width="${3.2 * w}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${ice}" stroke-width="${1.3 * w}" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffffff" stroke-width="${0.5 * w}" stroke-linejoin="round"/>`;
  const crackle = svg(240, 14, bolt('M0 8L22 5L30 10L52 4L66 9L80 6L96 11L118 4L130 8L150 5L166 10L186 4L200 9L222 6L240 8', 0.8));
  const crown = svg(200, 64, `${bolt('M100 40L74 30L80 40L44 26L52 38L8 30', 1)}${bolt('M100 40L126 30L120 40L156 26L148 38L192 30', 1)}<g transform="translate(16 10) scale(1)">${wingHalf}<g transform="matrix(-1 0 0 1 168 0)">${wingHalf}</g></g><path d="M100 4L108 22 100 48 92 22Z" fill="${ice}" stroke="${deep}" stroke-width="1.4"/><path d="M100 4L108 22H100Z" fill="#ffffff" fill-opacity="0.85"/>`);

  // Phase gems: a six-faceted crystal cut.
  const hex = [...Array(6)].map((_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return [(22.5 + Math.cos(a) * 20).toFixed(1), (22.5 + Math.sin(a) * 20).toFixed(1)];
  });
  const gem = svg(45, 45, `<polygon points="${hex.map((p) => p.join(' ')).join(' ')}" fill="none" stroke="${deep}" stroke-opacity="0.5" stroke-width="1"/><g stroke="${deep}" stroke-opacity="0.18" stroke-width="0.8">${hex.map(([x, y]) => `<line x1="22.5" y1="22.5" x2="${x}" y2="${y}"/>`).join('')}</g><path d="M22.5 2.5L39.8 12.5L22.5 22.5Z" fill="#ffffff" fill-opacity="0.35"/>`);

  // Life bar cap: a single long shard.
  const capShard = svg(20, 36, `<path d="M10 1L15 8V35H5V8Z" fill="${paleIce}" stroke="${deep}" stroke-width="1.2"/><path d="M10 1L15 8V35H10Z" fill="#ffffff" fill-opacity="0.7"/>`);

  const paleBg = (lift = 0) => `linear-gradient(160deg, ${alpha('#ffffff', 0.7 + lift)}, transparent 55%), var(--dbtc-u0), linear-gradient(180deg, ${paleIce}, ${mix(paleIce2, deep, 0.06 + lift / 3)})`;
  // Titles straddling a panel edge read by their navy halo, half over the dark page and half
  // over the pale panel: the ink guard cannot judge that, so they outrank it.
  const boost = (list) => `${list}, ${list.split(', ').map((x) => `${x}[data-dbte-ink][data-dbte-ink][data-dbte-ink][data-dbte-ink]`).join(', ')}`;
  const navyText = `color: ${navy} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.7)} !important;`;

  // Pop-up buttons (DuelingBook's OK/Yes/No/Cancel <img>s), redrawn in the theme's material.
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="M14 10H${w - 14}L${w - 6} 18V60.5L${w - 14} 68.5H14L6 60.5V18Z" fill="url(#g)" stroke="${c.edge}" stroke-width="2.5"/><path d="M17 15H${w - 17}L${w - 11} 21V57.5L${w - 17} 63.5H17L11 57.5V21Z" fill="none" stroke="${c.inner}" stroke-opacity="0.75" stroke-width="1"/>${c.deco(w)}<text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 4px ${c.shadow}) !important; }`).join('\n');
  const popPrimary = { top: mix(deep, ice, 0.2), bot: deepDark, edge: navy, inner: ice, text: '#ffffff', shadow: alpha('#000000', 0.55), deco: (w) => `<path d="M14 11H${w * 0.42}L8 46V19Z" fill="#ffffff" fill-opacity="0.16"/>` };
  const popSecondary = { ...popPrimary, top: '#ffffff', bot: paleIce2, edge: deep, inner: deep, text: navy, deco: (w) => `<path d="M14 11H${w * 0.42}L8 46V19Z" fill="#ffffff" fill-opacity="0.6"/>` };

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const pageTitles = sel(['#content .title1', '#content #settings .title_txt', '#content #settings_content > .title_txt']);
  const panelText = sel(['#duel_room #host_lbl', '#duel_room #host span', '#duel_room #host label', '#duel_room #filter span', '#duel_room #mode span', '#duel_room #mode label', '#duel_room #decklist span', '#deck_constructor #search span:not(#dbte-none)', '#deck_constructor #search .title_txt', '#deck_constructor .deck_lbl', '#deck_constructor .side_lbl', '#deck_constructor .extra_lbl', '#content #settings_content > div span', '#content #settings_content > div label', '#content .combobox span', '#content .combobox', '#content .combo_item span']);

  const u0 = svgUrl(facets);
  const u1 = svgUrl(frameSvg);
  const u2 = svgUrl(wings);
  const u3 = svgUrl(crackle);
  const u4 = svgUrl(crown);
  const u5 = svgUrl(capShard);
  const u6 = svgUrl(gem);
  return `
html body { ${[['u0', u0], ['u1', u1], ['u2', u2], ['u3', u3], ['u4', u4], ['u5', u5], ['u6', u6]].map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: pale ice plates in a chamfered silver frame, the dragon's wings spread across the top. */
${SEL.tile} { background: ${paleBg()} !important; border-style: solid !important; border-image: var(--dbtc-u1) 20 / 14px stretch !important; box-shadow: 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 56px); top: 1px; width: 112px; height: 20px; pointer-events: none; background: var(--dbtc-u2) center / contain no-repeat; filter: drop-shadow(0 2px 2px ${alpha('#000000', 0.5)}); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: var(--dbtc-u3) 50% 100% / 100% 12px no-repeat, ${paleBg(0.2)} !important; box-shadow: 0 0 0 1px ${deep}, 0 0 22px -4px ${alpha(ice, 0.9)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${navyText} }

/* Buttons: pale ice with a deep blue edge; deep blue when hovered or pressed. */
${SEL.button} { background: linear-gradient(180deg, #ffffff, ${paleIce2}) !important; border-color: ${deep} !important; color: ${navy} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 #ffffff, inset 0 -2px 0 ${alpha(deep, 0.35)}, 0 2px 5px -2px #000000 !important; }
${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: linear-gradient(180deg, #ffffff, ${paleIce2}) !important; border-color: ${deep} !important; color: ${navy} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 #ffffff, inset 0 -2px 0 ${alpha(deep, 0.35)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(deep, ice, 0.25)}, ${deepDark}) !important; border-color: ${navy} !important; color: #ffffff !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.35)}, 0 0 12px -2px ${alpha(ice, 0.9)} !important; }
${SEL.buttonDown} { background: ${deepDark} !important; border-color: ${navy} !important; color: #ffffff !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.6)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(navy, paleIce, 0.45)} !important; }

/* Pop-ups: a sheet of white ice in a silver frame, crowned by wings, crystal and lightning. */
${SEL.dialog} { background: ${paleBg()} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${deep}, 0 0 0 4px ${frost}, 0 0 0 5px ${deep}, 0 0 30px -4px ${alpha(ice, 0.7)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 110px); top: -48px; right: auto; bottom: auto; width: 220px; height: 70px; pointer-events: none; z-index: 1; background: var(--dbtc-u4) center / contain no-repeat; filter: drop-shadow(0 2px 3px ${alpha('#000000', 0.5)}); transform: none; }
${SEL.dialogTitle} { ${navyText} }
${sel(['#content #msg .body_txt', '#content #link .body_txt', '#content #confirm .body_txt', '#content #confirm2 .body_txt', '#content #input .body_txt', '#content #input2 .body_txt', '#content #combo .body_txt'])} { color: ${ink2} !important; }

/* Chat: a pale ice header over a lightning seam; silver rails around the night glass. */
${SEL.chatTop} { background: ${paleBg()} !important; box-shadow: inset 0 -2px 0 ${deep} !important; }
${sel(['#chats .chat .chat_top span'])} { ${navyText} }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 10px; pointer-events: none; background: var(--dbtc-u3) center / 100% 100% no-repeat; }
${SEL.chat} { background: linear-gradient(180deg, ${t.surface}, ${navy}) !important; box-shadow: inset 3px 0 0 ${paleIce}, inset -3px 0 0 ${paleIce}, inset 0 -3px 0 ${paleIce} !important; }

/* Duel: silver life bars led by a shard; phases are pale crystal, deep blue when active. */
${SEL.life} { border-color: ${frost} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${deep}, 0 0 10px -2px ${alpha(ice, 0.6)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 3px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.4)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, navy, 0.5)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.4)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, navy, 0.5)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -14px; top: -3px; width: 20px; height: 36px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 0 4px ${alpha(ice, 0.8)}); }
/* Low: the central danger outline deepens and thickens to a 3px band between navy keylines, so it holds against the pale frost frame and the pink low glow. */
${sel(['#duel .lifepoints'])} { --dbte-lp-outline: ${mix(t.danger, '#000000', 0.22)}; }
${sel(['#duel .lifepoints:is([data-dbte-lp~="low"], [data-dbte-lp~="zero"]) .life_border'])} { box-shadow: 0 0 0 1px ${deep}, 0 0 0 4px ${mix(t.danger, '#000000', 0.22)}, 0 0 0 5px ${deep}, 0 0 12px 2px ${alpha(t.danger, 0.6)} !important; }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px ${navy} !important; }
${SEL.phase} { background: conic-gradient(from 200deg, #ffffff, ${silver}, ${frost}, ${deep}, ${frost}, #ffffff) !important; box-shadow: 0 0 0 1px ${deep}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${deep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, #ffffff 30%, ${paleIce2}) !important; }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle at 50% 35%, ${activeDisc}, ${mix(activeDisc, navy, 0.3)} 60%, ${mix(activeDisc, navy, 0.6)}) !important; box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px ${alpha(ice, 0.95)}, 0 0 16px 4px ${alpha('#ffffff', 0.6)}, 0 0 30px 8px ${alpha(ice, 0.95)}; }
${sel(['#duel .phase span'])} { color: ${navy} !important; text-shadow: 0 1px 0 #ffffff !important; }
${sel(['#duel .phase.active span', '#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: #ffffff !important; text-shadow: 0 1px 2px ${navy}, 0 0 4px ${navy}, 0 0 1px ${navy} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${deep} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, #ffffff, ${paleIce2}) !important; }
${sel(['#duel #start_turn span', '#duel #end_turn span'])} { ${navyText} }
${sel(['#duel #turn span', '#duel #turn span[data-dbte-ink][data-dbte-ink]'])} { color: ${mix(t.accent, '#ffffff', 0.75)} !important; text-shadow: 0 1px 1px ${navy}, 0 0 6px ${alpha(navy, 0.9)} !important; }
${SEL.duelLog} { background: linear-gradient(180deg, ${t.surface}, ${navy}) !important; box-shadow: inset 0 0 0 3px ${paleIce}, inset 0 0 0 4px ${deep} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${paleIce}, 0 0 0 3px ${deep}, 0 0 14px -2px ${alpha(ice, 0.7)} !important; }
${sel(['#duel #watchers'])} { box-shadow: inset 0 0 0 2px ${paleIce} !important; }

/* Duel room: pale ice mats in silver rings around the lists; nameplates in navy. */
${lobbyBorders} { background: ${paleBg()} !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(150deg, ${deep}, ${silver} 30%, #ffffff 50%, ${silver} 70%, ${deep}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(16)} }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(ice, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(ice, 0.4)}, ${alpha(frost, 0.1)}) !important; }

/* Deck constructor: the deck laid out on white ice. */
${deckPanels} { background: ${paleBg()} !important; box-shadow: inset 0 0 0 1px ${deep}, inset 0 0 0 3px ${frost}, inset 0 0 0 4px ${alpha(deep, 0.5)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }
${sel(['#content .deck_slot .content', '#content .side_slot', '#content .extra_slot'])} { background-color: ${alpha(deep, 0.08)} !important; border-color: ${alpha(deep, 0.3)} !important; }

/* Settings panels: pale ice in the silver frame. */
${settingsPanels} { border-color: ${deep} !important; background: ${paleBg()} !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Lettering: navy on the pale panels, white light on the night page. */
${panelText} { ${navyText} }
${boost(pageTitles)} { color: #ffffff !important; text-shadow: 0 0 2px ${navy}, 0 0 4px ${navy}, 0 0 18px ${alpha(ice, 0.75)} !important; }

/* Panel titles straddle the panel edge: white light with a navy halo, and a navy cut in the ring behind the word only. */
${boost(sel(['#duel_room .format .format_txt', '#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl']))} { color: #ffffff !important; text-shadow: 0 0 2px ${navy}, 0 0 4px ${navy}, 0 0 8px ${navy}, 0 0 16px ${alpha(ice, 0.6)} !important; box-shadow: none !important; border-radius: 0 !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(90deg, transparent, ${navy} 8% 92%, transparent) center 72% / 70% 22% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl'])} { background: linear-gradient(90deg, transparent, ${navy} 10% 90%, transparent) 0 72% / 100% 22% no-repeat !important; }
${sel(['#content #settings_content .admin_lbl'])} { background: linear-gradient(90deg, transparent, ${navy} 10% 90%, transparent) 0 42% / 100% 22% no-repeat !important; }
/* Text fields and dropdowns: white ice with a deep blue edge. */
${SEL.field} { background-color: #ffffff !important; color: ${navy} !important; border-color: ${deep} !important; caret-color: ${deep}; box-shadow: inset 0 1px 3px ${alpha(deep, 0.35)} !important; }
${sel(['#content .combobox', '#duel_room .decklist_decks', '#content .combo_item'])} { background: linear-gradient(180deg, #ffffff, ${paleIce}) !important; border-color: ${deep} !important; }
${sel(['#content .combobox:hover', '#content .combobox.combobox_selected'])} { background: ${paleIce2} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${deep} !important; box-shadow: inset 0 1px 3px ${alpha(deep, 0.35)}, 0 0 10px ${alpha(ice, 0.8)} !important; }

/* Scrollbars: icicles. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${silver}, #ffffff, ${ice}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss(popPrimary, popSecondary)}

/* Checkboxes and radios: hollow with a navy edge; ice-filled when on. */
${sel(['#content .checkbox', '#content .radiobutton'])} { background-color: #ffffff !important; box-shadow: inset 0 0 0 2px ${navy} !important; }
${sel(['#content .checkbox:has(img.check:not([style*="none"]))', '#content .radiobutton:has(img.check:not([style*="none"]))'])} { background-color: ${ice} !important; }
${sel(['#content .checkbox:hover', '#content .radiobutton:hover'])} { box-shadow: inset 0 0 0 2px ${deep}, 0 0 6px ${alpha(ice, 0.8)} !important; }
${sel(['#content .checkbox img.check', '#content .radiobutton img.check'])} { filter: brightness(0) !important; }

/* Opponent side in ice and silver, never lilac. */
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.4)}, transparent 50%), linear-gradient(90deg, ${mix(silver, navy, 0.4)}, ${mix(ice, navy, 0.42)} 55%, ${mix(ice, navy, 0.72)}) !important; }
${sel(['#duel #avatar2', '#duel #avatar4'])} { background: linear-gradient(160deg, ${silver}, ${deep}) !important; }
/* Front page Welcome / Forum / Rules: white on night plates so they read over the dragon. */
${sel(['#welcome_buttons > span'])} { color: #ffffff !important; background: ${alpha(navy, 0.88)} !important; box-shadow: 0 0 0 0.25em ${alpha(navy, 0.88)} !important; border-radius: 2px; text-shadow: 0 1px 2px #000000, 0 0 6px ${navy} !important; }
${sel(['#duel #status2 .status_txt', '#duel #countdown2'])} { text-shadow: 0 0 10px ${ice}, 0 0 2px ${navy} !important; }
${sel(['#duel .phase.active .phase_inner.blue'])} { box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px ${alpha(frost, 0.9)}, 0 0 16px 4px ${alpha('#ffffff', 0.55)}, 0 0 30px 8px ${alpha(frost, 0.9)}; }
/* Main menu: the dragon and its lightning shrink into the right gutter, the ice spire steps clear of the timestamps. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-wd-dragon { transform-origin: 0 0; transform: translate(968px, 86.8px) scale(0.32); }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-wd-spire { transform: translateX(200px); }
`;
};
