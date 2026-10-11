// white-dragon: the white dragon of light. Ice-crystal facets in white silver,
// chamfered frost frames with crystal studs, shard crests, pale blue lightning
// cracking along edges, faceted phase gems. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const ice = t.accent;
  const iceDeep = mix(t.accent, t.bg, 0.55);
  const frost = t.accent2;
  const silver = mix(t.accent2, t.muted, 0.35);
  const glass = mix(t.raised, t.surface, 0.4);

  // Faceted ice: a triangle lattice with uneven light on each face.
  const shades = [0.02, 0.06, 0.035, 0.08, 0.015, 0.05];
  let tri = '';
  let k = 0;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      const x = col * 30 - (row % 2) * 15;
      const y = row * 26;
      tri += `<path d="M${x} ${y + 26}L${x + 15} ${y}L${x + 30} ${y + 26}Z" fill="${frost}" fill-opacity="${shades[k++ % 6]}"/><path d="M${x + 15} ${y}L${x + 45} ${y}L${x + 30} ${y + 26}Z" fill="${ice}" fill-opacity="${shades[k++ % 6] * 0.8}"/>`;
    }
  }
  const facets = svg(120, 52, `${tri}<g fill="none" stroke="${frost}" stroke-opacity="0.07" stroke-width="0.7"><path d="M0 26H120M0 52L30 0L60 52L90 0L120 52M-30 52L0 0M0 52L-30 0"/></g>`);

  // Nine-slice frost frame with chamfered corners and a crystal stud.
  const corner = `<path d="M1 14L14 1H20V3.4H15L3.4 15V20H1Z" fill="${frost}"/><path d="M6 15.5L15.5 6" stroke="${ice}" stroke-width="1"/><path d="M8.5 4.5L11 8.5 8.5 12.5 6 8.5Z" fill="${ice}" stroke="#ffffff" stroke-width="0.6" transform="rotate(45 8.5 8.5)"/>`;
  const frameSvg = svg(60, 60, `<g fill="none"><path d="M20 2.2H40M20 57.8H40M2.2 20V40M57.8 20V40" stroke="${frost}" stroke-width="2.4"/><path d="M14 6H46L54 14V46L46 54H14L6 46V14Z" stroke="${ice}" stroke-opacity="0.55" stroke-width="0.8"/></g>${corner}<g transform="matrix(-1 0 0 1 60 0)">${corner}</g><g transform="matrix(1 0 0 -1 0 60)">${corner}</g><g transform="matrix(-1 0 0 -1 60 60)">${corner}</g>`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u1) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Crystal shard cluster.
  const prism = (x, y, w, h, rot, fill) => `<g transform="rotate(${rot} ${x} ${y + h})"><path d="M${x} ${y}L${x + w / 2} ${y + w * 0.7}V${y + h}H${x - w / 2}V${y + w * 0.7}Z" fill="${fill}" stroke="#ffffff" stroke-opacity="0.8" stroke-width="0.6"/><path d="M${x} ${y}V${y + h}" stroke="#ffffff" stroke-opacity="0.5" stroke-width="0.6"/></g>`;
  const shards = svg(36, 22, `${prism(11, 7, 6, 15, -28, iceDeep)}${prism(25, 7, 6, 15, 28, iceDeep)}${prism(18, 1, 8, 21, 0, ice)}`);

  // Lightning: a pale blue bolt with a white core.
  const bolt = (d, w = 1) => `<path d="${d}" fill="none" stroke="${ice}" stroke-width="${3 * w}" stroke-opacity="0.35" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#ffffff" stroke-width="${1.1 * w}" stroke-linejoin="round"/>`;
  const crackle = svg(240, 14, bolt('M0 8L22 5L30 10L52 4L66 9L80 6L96 11L118 4L130 8L150 5L166 10L186 4L200 9L222 6L240 8', 0.8));
  const crown = svg(170, 60, `${bolt('M85 30L58 22L64 30L28 18L36 28L4 22', 1)}${bolt('M85 30L112 22L106 30L142 18L134 28L166 22', 1)}<g transform="translate(55 4) scale(1.65)">${prism(11, 7, 6, 15, -28, iceDeep)}${prism(25, 7, 6, 15, 28, iceDeep)}${prism(18, 1, 8, 21, 0, ice)}</g>`);

  // Phase gems: a six-faceted crystal cut.
  let cut = '';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    cut += `<line x1="22.5" y1="22.5" x2="${(22.5 + Math.cos(a) * 20).toFixed(1)}" y2="${(22.5 + Math.sin(a) * 20).toFixed(1)}"/>`;
  }
  const hexPts = [...Array(6)].map((_, i) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return `${(22.5 + Math.cos(a) * 20).toFixed(1)} ${(22.5 + Math.sin(a) * 20).toFixed(1)}`;
  }).join(' ');
  const gem = svg(45, 45, `<polygon points="${hexPts}" fill="${frost}" fill-opacity="0.06" stroke="${frost}" stroke-opacity="0.4" stroke-width="1"/><g stroke="${frost}" stroke-opacity="0.18" stroke-width="0.8">${cut}</g><path d="M22.5 2.5L39.8 12.5L22.5 22.5Z" fill="#ffffff" fill-opacity="0.08"/>`);

  // Life bar cap: a single long shard.
  const capShard = svg(18, 34, `${prism(9, 1, 9, 32, 0, ice)}<path d="M9 1L13.5 7.3V33H9Z" fill="#ffffff" fill-opacity="0.35"/>`);

  const iceBg = (lift = 0) => `linear-gradient(160deg, ${alpha('#ffffff', 0.1 + lift)}, transparent 45%), var(--dbtc-u0), linear-gradient(180deg, ${mix(t.raised, ice, 0.12 + lift / 2)}, ${t.surface})`;

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#settings .about_me', '#settings .preferences', '#settings .social_media', '#settings .animation', '#settings .profile_song', '#settings .account', '#settings .messages', '#settings .duel_stats', '#settings .profile_comments']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const u0 = svgUrl(facets);
  const u1 = svgUrl(frameSvg);
  const u2 = svgUrl(shards);
  const u3 = svgUrl(crackle);
  const u4 = svgUrl(crown);
  const u5 = svgUrl(capShard);
  const u6 = svgUrl(gem);
  return `
html body { ${[['u0', u0], ['u1', u1], ['u2', u2], ['u3', u3], ['u4', u4], ['u5', u5], ['u6', u6]].map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: faceted ice in a chamfered frost frame, a crystal cluster on top; lightning runs the foot on hover. */
${SEL.tile} { background: ${iceBg()} !important; border-style: solid !important; border-image: var(--dbtc-u1) 20 / 14px stretch !important; box-shadow: 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 13px); top: -6px; width: 26px; height: 16px; pointer-events: none; background: var(--dbtc-u2) center / contain no-repeat; filter: drop-shadow(0 0 3px ${alpha(ice, 0.8)}); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: var(--dbtc-u3) 50% 100% / 100% 12px no-repeat, ${iceBg(0.08)} !important; box-shadow: 0 0 22px -4px ${alpha(ice, 0.85)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 12px ${alpha(ice, 0.55)} !important; }

/* Buttons: frosted glass with a white edge, ice glow on hover. */
${SEL.button} { background: linear-gradient(180deg, ${mix(glass, frost, 0.18)}, ${t.surface}) !important; border-color: ${silver} !important; color: ${t.text} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.4)}, inset 0 -1px 0 ${alpha(ice, 0.35)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(ice, t.raised, 0.45)}, ${mix(ice, t.surface, 0.75)}) !important; border-color: ${frost} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.5)}, 0 0 12px -2px ${alpha(ice, 0.9)} !important; }
${SEL.buttonDown} { background: ${iceDeep} !important; border-color: ${frost} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a sheet of ice in a frost frame, crowned with crystal and lightning. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(ice, 0.2)}, transparent 70%), var(--dbtc-u0), linear-gradient(180deg, ${t.raised}, ${t.bg}) !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${frost}, 0 0 24px -4px ${alpha(ice, 0.6)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 85px); top: -40px; right: auto; bottom: auto; width: 170px; height: 60px; pointer-events: none; z-index: 1; background: var(--dbtc-u4) center / contain no-repeat; filter: drop-shadow(0 0 6px ${alpha(ice, 0.7)}); transform: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 16px ${alpha(ice, 0.65)} !important; }

/* Chat: a frosted header over a lightning seam; frost rails. */
${SEL.chatTop} { background: linear-gradient(160deg, ${alpha('#ffffff', 0.16)}, transparent 50%), var(--dbtc-u0), linear-gradient(180deg, ${mix(t.raised, ice, 0.25)}, ${t.raised}) !important; box-shadow: inset 0 -1px 0 ${frost} !important; }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 10px; pointer-events: none; background: var(--dbtc-u3) center / 100% 100% no-repeat; }
${SEL.chat} { background: var(--dbtc-u0), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${silver}, inset -1px 0 0 ${silver}, inset 0 -1px 0 ${silver} !important; }

/* Duel: frost-framed life bars led by a shard; phases are cut crystal. */
${SEL.life} { border-color: ${frost} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${iceDeep}, 0 0 10px -2px ${alpha(ice, 0.6)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 3px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 50%), var(--dbtc-u0) 0 0 / 60px 26px, linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 50%), var(--dbtc-u0) 0 0 / 60px 26px, linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -12px; top: -2px; width: 18px; height: 34px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 0 4px ${alpha(ice, 0.8)}); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px ${t.bg} !important; }
${SEL.phase} { background: conic-gradient(from 200deg, #ffffff, ${silver}, ${frost}, ${iceDeep}, ${frost}, #ffffff) !important; box-shadow: 0 0 0 1px ${iceDeep}, 0 0 10px -2px ${alpha(ice, 0.6)}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${t.bg} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${t.raised} 35%, ${t.bg}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.2)} 25%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.25)} 25%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 16px ${alpha(ice, 0.9)}; }
${sel(['#duel .phase span'])} { color: ${frost} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${t.bg} !important; text-shadow: none !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, #ffffff, ${silver}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u0), linear-gradient(180deg, ${mix(t.raised, ice, 0.2)}, ${t.surface}) !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u0), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 0 0 0 1px ${frost}, inset 0 0 0 4px ${alpha(t.bg, 0.8)}, inset 0 0 0 5px ${alpha(ice, 0.4)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${frost}, 0 0 14px -2px ${alpha(ice, 0.7)}, 0 6px 16px -6px #000000 !important; }

/* Duel room: frost rings around faceted panels. */
${lobbyBorders} { background: var(--dbtc-u0), linear-gradient(180deg, ${alpha(t.raised, 0.65)}, ${alpha(t.bg, 0.8)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(150deg, #ffffff, ${silver} 25%, ${ice} 50%, ${silver} 75%, #ffffff) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(16)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl'])} { background: linear-gradient(90deg, transparent, ${t.bg} 8% 92%, transparent) center 72% / 100% 20% no-repeat !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(ice, 0.14)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(ice, 0.35)}, ${alpha(frost, 0.08)}) !important; }

/* Deck constructor: ice panels with a frost edge. */
${deckPanels} { background: var(--dbtc-u0), linear-gradient(180deg, ${mix(t.raised, t.surface, 0.5)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${frost}, inset 0 0 0 3px ${alpha(t.bg, 0.8)}, inset 0 0 0 4px ${alpha(ice, 0.4)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels. */
${settingsPanels} { border-color: ${silver} !important; background: var(--dbtc-u0), linear-gradient(180deg, ${alpha(t.raised, 0.8)}, ${alpha(t.bg, 0.85)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: white light with an ice glow. */
${titles} { color: #ffffff !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 1px 0 ${t.bg}, 0 0 3px ${t.bg}, 0 0 16px ${alpha(ice, 0.7)} !important; }

/* Text fields: deep ice wells with a frost edge. */
${SEL.field} { background-color: ${t.bg} !important; border-color: ${silver} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(ice, 0.25)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${ice} !important; box-shadow: inset 0 2px 4px #000000, 0 0 10px ${alpha(ice, 0.7)} !important; }

/* Scrollbars: icicles. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${silver}, #ffffff, ${ice}) !important; border-radius: 2px !important; }
`;
};
