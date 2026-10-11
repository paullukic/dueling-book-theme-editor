// nekroz: the glacier mirror hall. Dark ice glass with frost hairlines, a
// chamfered frame of cut ice with diamond shards at the corners, the pointed
// Nekroz mirror (violet gem, frost-blade wings) as the crest, ice-shard life
// caps and faceted crystal phases. No rings, no gold: ice and mirror only.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha, n1 }) => {
  const ice = t.accent;
  const iceHi = mix(t.accent, '#ffffff', 0.55);
  const iceDim = mix(t.accent, t.bg, 0.5);
  const violet = t.accent2;
  const glass = mix(t.surface, t.accent, 0.08);
  const glassDeep = mix(t.bg, t.accent, 0.04);
  const ink = mix(t.bg, '#000000', 0.45);

  // Frost hairlines crossing the glass.
  const frost = svg(70, 70, `<path d="M0 70L70 0M-10 30L30 -10M40 80L80 40" stroke="${ice}" stroke-opacity="0.07" stroke-width="0.8"/><path d="M22 48l6 -6M26 44l4 2M24 46l-2 -4" stroke="${iceHi}" stroke-opacity="0.08" stroke-width="0.7"/>`);

  // A cut-ice diamond shard.
  const shard = (x, y, h, w = h * 0.36) => `<path d="M${x} ${y - h}L${n1(x + w)} ${y}L${x} ${y + h}L${n1(x - w)} ${y}Z" fill="${ice}" fill-opacity="0.85" stroke="${iceHi}" stroke-width="0.7"/><path d="M${x} ${y - h}L${n1(x + w)} ${y}L${x} ${y}Z" fill="#ffffff" fill-opacity="0.45"/>`;
  // Nine-slice frame: chamfered ice edge, a hairline inside, a shard at each corner.
  const frameSvg = svg(60, 60, `<path d="M9 1H51L59 9V51L51 59H9L1 51V9Z" fill="none" stroke="${iceHi}" stroke-width="1.4"/><path d="M11 4.5H49L55.5 11V49L49 55.5H11L4.5 49V11Z" fill="none" stroke="${iceDim}" stroke-width="0.9"/>${shard(7, 7, 6)}${shard(53, 7, 6)}${shard(7, 53, 6)}${shard(53, 53, 6)}`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // The Nekroz mirror: a pointed oval of dark glass in an ice rim, a violet gem
  // at the crown, frost blades fanning out like folded wings.
  const mirror = (w, h) => {
    const cx = w / 2;
    const mh = h * 0.86;
    const mw = mh * 0.34;
    const top = h * 0.12;
    const r = n1(((mh / 2) ** 2 + mw ** 2) / (2 * mw));
    const lens = (dy, dw, fill, stroke, sw) => `<path d="M${cx} ${n1(top + dy)}A${n1(r + dw)} ${n1(r + dw)} 0 0 1 ${cx} ${n1(top + mh - dy)}A${n1(r + dw)} ${n1(r + dw)} 0 0 1 ${cx} ${n1(top + dy)}Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
    let blades = '';
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 4; i++) {
        const by = top + mh * (0.3 + i * 0.12);
        const bx = cx + side * mw * 0.85;
        const len = w * (0.34 - i * 0.06);
        blades += `<path d="M${n1(bx)} ${n1(by - 2)}L${n1(bx + side * len)} ${n1(by - len * 0.5)}L${n1(bx)} ${n1(by + 3)}Z" fill="${ice}" fill-opacity="${0.9 - i * 0.15}" stroke="${iceHi}" stroke-width="0.6"/>`;
      }
    }
    return svg(w, h, `${blades}${lens(-2, 3, iceHi, iceHi, 0)}${lens(0, 0, mix(mix(t.bg, ice, 0.45), violet, 0.3), ice, 0.8)}<path d="M${n1(cx - mw * 0.4)} ${n1(top + mh * 0.3)}L${n1(cx + mw * 0.2)} ${n1(top + mh * 0.18)}" stroke="#ffffff" stroke-opacity="0.6" stroke-width="${n1(h / 30)}" stroke-linecap="round"/><path d="M${cx} ${n1(top - h * 0.12)}L${n1(cx + h * 0.07)} ${n1(top)}L${cx} ${n1(top + h * 0.12)}L${n1(cx - h * 0.07)} ${n1(top)}Z" fill="${violet}" stroke="${iceHi}" stroke-width="0.7"/>`);
  };

  // An ice shard hanging beside the life bar.
  const icicle = svg(14, 34, `<path d="M7 0L13 10L7 34L1 10Z" fill="${ice}" fill-opacity="0.8" stroke="${iceHi}" stroke-width="0.8"/><path d="M7 0L13 10L7 12Z" fill="#ffffff" fill-opacity="0.5"/><path d="M7 12V30" stroke="${iceHi}" stroke-opacity="0.6" stroke-width="0.6"/>`);

  // Faceted crystal for phases: hard-stopped conic facets.
  const facets = (c) => `conic-gradient(from 22deg, ${mix(c, '#ffffff', 0.45)} 0 45deg, ${c} 45deg 90deg, ${mix(c, t.bg, 0.3)} 90deg 135deg, ${mix(c, t.bg, 0.55)} 135deg 180deg, ${mix(c, t.bg, 0.4)} 180deg 225deg, ${mix(c, '#ffffff', 0.15)} 225deg 270deg, ${mix(c, '#ffffff', 0.3)} 270deg 315deg, ${mix(c, t.bg, 0.15)} 315deg 360deg)`;

  const facetsDim = (c) => `conic-gradient(from 22deg, ${mix(c, '#ffffff', 0.1)} 0 45deg, ${c} 45deg 90deg, ${mix(c, t.bg, 0.3)} 90deg 135deg, ${mix(c, t.bg, 0.5)} 135deg 180deg, ${mix(c, t.bg, 0.4)} 180deg 225deg, ${mix(c, '#ffffff', 0.05)} 225deg 270deg, ${mix(c, '#ffffff', 0.08)} 270deg 315deg, ${mix(c, t.bg, 0.15)} 315deg 360deg)`;
  // A frost sprig growing from the life frame's left cap.
  const sprig = svg(44, 16, `<g fill="none" stroke="${iceHi}" stroke-linecap="round"><path d="M1 1L20 7M1 1L7 14M6 3L9 0M6 3L5 7M12 4L15 1M12 4L13 8M3 7L0 9M3 7L7 8" stroke-width="1.1" stroke-opacity="0.9"/><path d="M20 7L32 9M26 8L28 5M26 8L27 11" stroke-width="0.8" stroke-opacity="0.55"/></g><path d="M1 1l0 0" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`);
  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${ink}, 0 0 10px ${alpha(ice, 0.45)} !important;`;
  const glassBg = (lift = 0) => `linear-gradient(115deg, transparent 20%, ${alpha(iceHi, 0.08 + lift / 2)} 32%, transparent 44%), radial-gradient(ellipse 70% 90% at 50% 0%, ${alpha(ice, 0.14 + lift)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${glassDeep})`;

  // Pop-up buttons as cut-ice plates: bright ice with dark lettering, dark glass with ice lettering.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const x0 = 6;
    const x1 = w - 6;
    const shape = `M${x0 + 14} 10H${n1(x1 - 14)}L${x1} 24V54.5L${n1(x1 - 14)} 68.5H${x0 + 14}L${x0} 54.5V24Z`;
    const cuts = `M${x0 + 14} 10L${n1(w * 0.3)} 39L${x0 + 14} 68.5M${n1(x1 - 14)} 10L${n1(w * 0.7)} 39L${n1(x1 - 14)} 68.5M${n1(w * 0.3)} 39H${n1(w * 0.7)}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.5" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="${shape}" fill="url(#g)" stroke="${c.edge}" stroke-width="2.2" stroke-linejoin="round"/><path d="${cuts}" fill="none" stroke="${c.cut}" stroke-opacity="0.35" stroke-width="1"/><path d="M${x0 + 16} 14H${n1(x1 - 16)}" stroke="#ffffff" stroke-opacity="0.6" stroke-width="1.6"/><text x="${w / 2}" y="40" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const primary = { top: iceHi, mid: ice, bot: mix(ice, t.bg, 0.2), edge: '#ffffff', cut: t.bg, text: t.accentText };
  const secondary = { top: mix(glass, ice, 0.2), mid: glass, bot: glassDeep, edge: iceDim, cut: iceHi, text: t.text };
  const popCss = [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 5px ${alpha('#000000', 0.6)}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const button = `background: linear-gradient(180deg, ${mix(glass, ice, 0.18)}, ${glassDeep}) !important; border-color: ${iceDim} !important; color: ${t.text} !important; border-radius: 1px !important; box-shadow: inset 0 1px 0 ${alpha(iceHi, 0.45)}, inset 0 0 0 1px ${alpha(ink, 0.6)}, 0 2px 5px -2px #000000 !important;`;

  const vars = [['u0', svgUrl(frameSvg)], ['u1', svgUrl(mirror(64, 26))], ['u2', svgUrl(frost)], ['u3', svgUrl(mirror(180, 64))], ['u4', svgUrl(icicle)]];
  return `
html body { ${vars.map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: dark ice glass in a cut-ice frame, the Nekroz mirror on top. */
${SEL.tile} { background: ${glassBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 15px stretch !important; box-shadow: inset 0 0 0 1px ${alpha(ink, 0.7)}, inset 0 -12px 18px -8px ${alpha('#000000', 0.5)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 32px); top: -15px; width: 64px; height: 26px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${glassBg(0.14)} !important; box-shadow: inset 0 0 0 1px ${alpha(ink, 0.7)}, inset 0 0 22px ${alpha(ice, 0.3)}, 0 0 18px -4px ${alpha(ice, 0.75)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: ice glass with a bright cut edge; frost glow on hover. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { ${button} }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(ice, t.surface, 0.6)}, ${glass}) !important; border-color: ${iceHi} !important; box-shadow: inset 0 1px 0 ${alpha(iceHi, 0.6)}, 0 0 10px -2px ${alpha(ice, 0.85)} !important; }
${SEL.buttonDown} { background: ${glassDeep} !important; border-color: ${violet} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a pane of dark ice in the cut frame, the mirror above it. */
${SEL.dialog} { background: linear-gradient(115deg, transparent 25%, ${alpha(iceHi, 0.07)} 35%, transparent 45%), radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(ice, 0.18)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${t.bg}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${iceDim}, 0 0 0 4px ${glassDeep}, 0 0 0 5px ${alpha(iceHi, 0.55)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 90px); top: -46px; right: auto; bottom: auto; width: 180px; height: 64px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 4px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a frosted header on an ice rule, the window edged in ice. */
${SEL.chatTop} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(ice, t.surface, 0.7)}, ${glassDeep}) !important; box-shadow: inset 0 -2px 0 ${iceHi}, inset 0 -4px 0 ${glassDeep}, inset 0 1px 0 ${alpha(iceHi, 0.35)} !important; }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; right: 64px; top: 3px; width: 46px; height: 18px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; opacity: 0.9; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${iceDim}, inset -1px 0 0 ${iceDim}, inset 0 -1px 0 ${iceDim} !important; }

/* Duel: ice-framed life bars with a hanging shard; faceted crystal phases. */
${SEL.life} { border-color: ${iceHi} !important; border-radius: 1px !important; box-shadow: 0 0 0 1px ${glassDeep}, 0 0 0 2px ${alpha(ice, 0.45)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 45%), linear-gradient(115deg, transparent 40%, ${alpha('#ffffff', 0.18)} 50%, transparent 60%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.6)}, ${t.self} 38%, ${mix(mix(t.self, violet, 0.25), t.bg, 0.5)} 66%) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 45%), linear-gradient(115deg, transparent 40%, ${alpha('#ffffff', 0.18)} 50%, transparent 60%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.6)}, ${t.opp} 38%, ${mix(mix(t.opp, violet, 0.25), t.bg, 0.5)} 66%) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -16px; top: -4px; width: 14px; height: 34px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_border::before'])} { content: ""; position: absolute; inset: -6px; pointer-events: none; background: ${svgUrl(sprig)} left top / 44px 16px no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: ${facets(iceDim)} !important; box-shadow: 0 0 0 1px ${glassDeep}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${glassDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${facetsDim(mix(glass, ice, 0.2))} !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: ${facetsDim(mix(t.self, t.bg, 0.2))} !important; box-shadow: 0 0 0 2px ${t.self}, 0 0 14px ${alpha(t.self, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: ${facetsDim(mix(t.opp, t.bg, 0.2))} !important; box-shadow: 0 0 0 2px ${t.opp}, 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${iceHi} !important; text-shadow: 1px 1px 0 ${ink}, -1px 1px 0 ${ink}, 1px -1px 0 ${ink}, -1px -1px 0 ${ink}, 0 0 6px #000000 !important; }
${sel(['#duel .phase.active span', '#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: #ffffff !important; text-shadow: 0 1px 2px ${ink}, 0 0 6px ${ink} !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(t.surface, glass, 0.4)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${iceDim}, inset 0 0 0 4px ${alpha(glassDeep, 0.9)}, inset 0 0 0 5px ${alpha(iceHi, 0.25)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${iceHi}, 0 0 0 4px ${glassDeep}, 0 0 0 5px ${alpha(violet, 0.6)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${iceHi}, ${iceDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${glassDeep}) !important; }
${sel(['#duel #turn .red'])} { background: linear-gradient(180deg, ${mix(t.opp, '#ffffff', 0.25)}, ${mix(t.opp, t.bg, 0.45)}) !important; }
${sel(['#duel #turn .blue'])} { background: linear-gradient(180deg, ${mix(t.self, '#ffffff', 0.25)}, ${mix(t.self, t.bg, 0.45)}) !important; }
${sel(['#duel #turn span'])} { color: ${t.accentText} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.35)} !important; }

/* Duel room: cut-ice rings around glass panels. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glass, 0.65)}, ${alpha(t.bg, 0.8)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${iceHi}, ${iceDim} 30%, ${ice} 55%, ${iceDim} 80%, ${violet}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(18)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: linear-gradient(90deg, transparent, ${t.bg} 10% 90%, transparent) 0 60% / 100% 40% no-repeat !important; box-shadow: none !important; border-radius: 0 !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(ice, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(ice, 0.38)}, ${alpha(violet, 0.12)}) !important; }

/* Deck constructor and settings: glass panes in the same cut frame. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${glass}, ${glassDeep}) !important; box-shadow: inset 0 0 0 1px ${iceDim}, inset 0 0 0 4px ${alpha(glassDeep, 0.9)}, inset 0 0 0 5px ${alpha(iceHi, 0.25)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }
${SEL.settingsPanel} { border-color: ${iceDim} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(glass, 0.85)}, ${alpha(t.bg, 0.88)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: frost white with a cold glow. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${ink}, 0 0 16px ${alpha(ice, 0.55)} !important; }

/* Text fields: dark ice wells, cyan focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${iceDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(iceHi, 0.18)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${ice} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(ice, 0.6)} !important; }

/* Scrollbars: icicles. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${iceDim}, ${iceHi}, ${iceDim}) !important; border-radius: 0 !important; }

/* Pop-up buttons cut from ice. */
${popCss}
`;
};
