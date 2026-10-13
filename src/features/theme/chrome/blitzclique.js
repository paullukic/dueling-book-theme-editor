// blitzclique: the crew's bomber jacket. Caramel-dark leather panels with
// cream saddle stitching and chrome snap rivets, a ribbed knit waistband along
// the foot, the crew badge (notched crown shield, bolt, BC) as the crest, the
// banner's white-and-orange chevron bolt, tesla-mint current for live states,
// tesla-coil life-bar finials and zipper-teeth scrollbars.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');
const FONT = 'Segoe UI, system-ui, Roboto, Arial, sans-serif';

export default (t, { SEL, sel, svg, svgUrl, alpha, n1 }) => {
  const mint = t.accent;
  const mintHi = mix(mint, '#ffffff', 0.5);
  const orange = t.accent2;
  const orangeHi = mix(orange, '#ffffff', 0.35);
  const orangeDeep = mix(orange, '#000000', 0.45);
  const leather = mix(t.raised, t.border, 0.5);
  const leatherHi = mix(t.raised, t.border, 0.85);
  const leatherDark = mix(t.bg, '#000000', 0.35);
  const stitch = mix(t.text, orange, 0.25);
  const chrome = mix(t.muted, t.text, 0.4);
  const cream = mix(t.text, orange, 0.06);
  const ink = mix(t.bg, '#000000', 0.25);

  // Pebbled leather grain.
  const grain = svg(24, 24, `<g fill="${t.text}" fill-opacity="0.035"><circle cx="4" cy="5" r="1.2"/><circle cx="15" cy="3" r="0.9"/><circle cx="20" cy="13" r="1.3"/><circle cx="9" cy="16" r="1"/><circle cx="3" cy="22" r="0.8"/><circle cx="17" cy="21" r="1.1"/></g><g fill="#000000" fill-opacity="0.06"><circle cx="11" cy="8" r="1.1"/><circle cx="22" cy="5" r="0.8"/><circle cx="6" cy="12" r="0.9"/><circle cx="14" cy="12" r="0.7"/></g>`);

  // Ribbed knit waistband: dark ribs with two orange varsity stripes.
  const knit = svg(6, 12, `<rect width="6" height="12" fill="${leatherDark}"/><rect x="1" width="3" height="12" fill="${mix(t.raised, t.border, 0.25)}"/><rect y="3" width="6" height="1.6" fill="${orange}" fill-opacity="0.9"/><rect y="6.4" width="6" height="1.6" fill="${cream}" fill-opacity="0.8"/>`);

  // A chrome snap rivet.
  const snap = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${chrome}" stroke="${leatherDark}" stroke-width="0.9"/><circle cx="${x}" cy="${y}" r="${n1(r * 0.5)}" fill="none" stroke="${leatherDark}" stroke-opacity="0.6" stroke-width="0.8"/><circle cx="${n1(x - r * 0.35)}" cy="${n1(y - r * 0.35)}" r="${n1(r * 0.25)}" fill="#ffffff" fill-opacity="0.8"/>`;

  // Nine-slice frame: a seam line, a cream saddle stitch and a snap in each corner.
  const frameSvg = svg(60, 60, `<rect x="1" y="1" width="58" height="58" rx="7" fill="none" stroke="${leatherDark}" stroke-width="2"/><rect x="2.5" y="2.5" width="55" height="55" rx="6" fill="none" stroke="${leatherHi}" stroke-opacity="0.8" stroke-width="1"/><rect x="6" y="6" width="48" height="48" rx="4" fill="none" stroke="${stitch}" stroke-width="1.4" stroke-dasharray="4 3" stroke-linecap="round"/>${snap(10, 10, 4.2)}${snap(50, 10, 4.2)}${snap(10, 50, 4.2)}${snap(50, 50, 4.2)}`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px round; box-sizing: border-box;`;

  // The crew badge: notched crown shield, cream top with a bolt, dark foot with BC.
  const badgePath = (cx, cy, s) => {
    const p = (pts) => pts.map(([a, b], i) => `${i ? 'L' : 'M'}${n1(cx + a * s)} ${n1(cy + b * s)}`).join('');
    const outer = `${p([[-20, -12], [-12, -20], [-6, -13], [2, -23], [8, -14], [14, -20], [20, -12], [20, 10]])}Q${n1(cx + 20 * s)} ${n1(cy + 22 * s)} ${n1(cx + 8 * s)} ${n1(cy + 22 * s)}H${n1(cx - 8 * s)}Q${n1(cx - 20 * s)} ${n1(cy + 22 * s)} ${n1(cx - 20 * s)} ${n1(cy + 10 * s)}Z`;
    const lower = `${p([[-17, 2], [-4, 2], [2, -4], [4, 3], [17, 0], [17, 9]])}Q${n1(cx + 17 * s)} ${n1(cy + 19 * s)} ${n1(cx + 7 * s)} ${n1(cy + 19 * s)}H${n1(cx - 7 * s)}Q${n1(cx - 17 * s)} ${n1(cy + 19 * s)} ${n1(cx - 17 * s)} ${n1(cy + 9 * s)}Z`;
    const bolt = p([[-2, -18], [6, -18], [1, -9], [7, -9], [-5, 1], [-1, -6], [-6, -6]]);
    const letters = s >= 0.6 ? `<text x="${cx}" y="${n1(cy + 15.5 * s)}" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-weight="900" font-size="${n1(12 * s)}" fill="${orange}">BC</text>` : '';
    return `<path d="${outer}" fill="${cream}" stroke="${orange}" stroke-width="${n1(3.4 * s)}" stroke-linejoin="round"/><path d="${lower}" fill="${ink}"/><path d="${bolt}Z" fill="${orange}" stroke="${orangeDeep}" stroke-width="${n1(0.8 * s)}" stroke-linejoin="round"/>${letters}`;
  };
  // Tile crest: the badge as a sewn-on patch.
  const crest = svg(34, 34, `<g transform="translate(0 1)">${badgePath(17, 17, 0.66)}</g>`);

  // Pop-up crest: the crew banner (dark cloth, white chevron bolt edged orange) behind the badge.
  const banner = svg(200, 64, `<path d="M6 18Q50 10 100 16Q150 10 194 18L186 32L194 46Q150 40 100 46Q50 40 6 46L14 32Z" fill="${mix(t.bg, t.text, 0.12)}" stroke="${mix(t.bg, t.text, 0.32)}" stroke-width="1.2"/><path d="M18 26L64 30L56 34L80 38L46 37L54 33L18 30Z" fill="${cream}" stroke="${orange}" stroke-width="1.6" stroke-linejoin="round"/><path d="M182 26L136 30L144 34L120 38L154 37L146 33L182 30Z" fill="${cream}" stroke="${orange}" stroke-width="1.6" stroke-linejoin="round"/>${badgePath(100, 34, 1.25)}`);

  // Life-bar finial: a small tesla coil, base, windings and torus.
  let wind = '';
  for (let i = 0; i < 6; i++) wind += `M5.5 ${32 - i * 3.6}h7`;
  const coil = svg(18, 44, `<path d="M3 42h12l-2 -4h-8Z" fill="${chrome}" stroke="${leatherDark}" stroke-width="0.8"/><rect x="6" y="12" width="6" height="26" fill="${mix(t.bg, mint, 0.35)}"/><path d="${wind}" stroke="${mint}" stroke-width="1.6"/><ellipse cx="9" cy="9" rx="8" ry="3.4" fill="${chrome}" stroke="${mint}" stroke-width="1.2"/><path d="M9 5.6L11 2L8.5 3.2L10 0" fill="none" stroke="${mintHi}" stroke-width="1.1" stroke-linejoin="round"/>`);

  // Phase overlay: a stitched leather ring with four snaps.
  const ring = svg(45, 45, `<circle cx="22.5" cy="22.5" r="19" fill="none" stroke="${stitch}" stroke-opacity="0.75" stroke-width="1.2" stroke-dasharray="3 2.4" stroke-linecap="round"/>${snap(22.5, 4.6, 2.2)}${snap(22.5, 40.4, 2.2)}${snap(4.6, 22.5, 2.2)}${snap(40.4, 22.5, 2.2)}`);

  // Lightning running along a life bar.
  const zig = svg(40, 10, `<path d="M0 6L6 3L11 7L18 2L24 6L30 3L35 7L40 5" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.3" stroke-linejoin="round"/>`);

  const vars = [frameSvg, crest, grain, banner, coil, ring, knit, zig].map((s, i) => `--dbtc-u${i}: ${svgUrl(s)};`).join(' ');

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${leatherDark}, 0 0 8px ${leatherDark} !important;`;
  const hide = (lift = 0) => `var(--dbtc-u6) left bottom / 6px 12px repeat-x, var(--dbtc-u2), radial-gradient(ellipse 70% 90% at 0% 0%, ${alpha(mint, 0.06 + lift)}, transparent 70%), linear-gradient(180deg, ${mix(leather, t.text, 0.05 + lift / 2)}, ${mix(t.surface, t.bg, 0.4)})`;
  const stitched = (fill) => `var(--dbtc-u2), ${fill}`;
  const seam = `outline: 1px dashed ${alpha(stitch, 0.5)} !important; outline-offset: -4px !important;`;

  // Pop-up buttons: sewn leather patches with a saddle stitch and two snaps.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${n1(w - 12)}" height="58.5" rx="12" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/><rect x="12" y="16" width="${n1(w - 24)}" height="46.5" rx="8" fill="none" stroke="${c.stitch}" stroke-width="1.8" stroke-dasharray="6 4" stroke-linecap="round"/><path d="M16 19H${n1(w - 16)}" stroke="#ffffff" stroke-opacity="0.22" stroke-width="1.5"/>${snap(24, 39.25, 5)}${snap(n1(w - 24), 39.25, 5)}<text x="${n1(w / 2)}" y="40" dominant-baseline="central" text-anchor="middle" font-family="${FONT}" font-weight="800" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: orangeHi, bot: mix(orange, '#000000', 0.12), edge: orangeDeep, stitch: mix(t.bg, orange, 0.35), text: mix(t.bg, '#000000', 0.3), shadow: alpha(orange, 0.35) };
  const popSecondary = { top: leatherHi, bot: leatherDark, edge: mix(t.border, t.bg, 0.2), stitch: stitch, text: t.text, shadow: alpha('#000000', 0.7) };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${c.shadow}) !important; }`).join('\n');

  const plate = mix(leather, t.bg, 0.4);
  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const bar = (c) => `linear-gradient(180deg, ${alpha('#ffffff', 0.28)}, transparent 50%), linear-gradient(90deg, transparent 46%, ${mix(c, t.bg, 0.12)} 56%, ${mix(c, t.bg, 0.12)}), var(--dbtc-u7) left center / 40px 10px repeat-x, linear-gradient(90deg, ${mix(c, t.bg, 0.55)}, ${mix(c, t.bg, 0.12)} 56%)`;

  return `
html body { ${vars} }
/* Menu tiles: jacket leather in a stitched, snapped frame, a ribbed knit waistband, the crew badge sewn on the corner. */
${SEL.tile} { background: ${hide()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 16px round !important; border-radius: 6px !important; box-shadow: inset 0 1px 0 ${alpha(leatherHi, 0.5)}, inset 0 -14px 18px -12px #000000, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: 2px; top: 1px; width: 20px; height: 20px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${hide(0.12)} !important; box-shadow: inset 0 0 0 1px ${alpha(mint, 0.7)}, inset 0 0 22px ${alpha(mint, 0.16)}, 0 0 18px -4px ${alpha(mint, 0.75)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: leather patches stitched top and bottom; mint current on hover. */
${SEL.button} { background: ${stitched(`linear-gradient(180deg, ${leatherHi}, ${leather} 55%, ${leatherDark})`)} !important; border-color: ${mix(t.border, t.bg, 0.2)} !important; color: ${t.text} !important; border-radius: 6px !important; ${seam} box-shadow: inset 0 1px 0 ${alpha(t.text, 0.18)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: ${stitched(`linear-gradient(180deg, ${mix(leatherHi, orange, 0.22)}, ${leather} 60%, ${leatherDark})`)} !important; border-color: ${mint} !important; box-shadow: inset 0 1px 0 ${alpha(t.text, 0.25)}, 0 0 10px -2px ${alpha(mint, 0.8)} !important; }
${SEL.buttonDown} { background: ${stitched(leatherDark)} !important; border-color: ${orange} !important; box-shadow: inset 0 2px 5px #000000 !important; }
${sel(['#content .button.disabled'])} { opacity: 0.55 !important; }

/* Pop-ups: a jacket panel in a stitched frame, a knit waistband at the foot, the crew banner and badge on top. */
${SEL.dialog} { background: var(--dbtc-u6) left bottom / 6px 12px repeat-x, radial-gradient(ellipse 80% 55% at 50% 0%, ${alpha(orange, 0.1)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${leather}, ${mix(t.surface, t.bg, 0.5)}) !important; border-radius: 8px !important; box-shadow: 0 0 0 1px ${leatherHi}, 0 0 0 4px ${leatherDark}, 0 0 0 5px ${alpha(orange, 0.75)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 16px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 100px); top: -44px; right: auto; bottom: auto; width: 200px; height: 64px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 3px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a knit-band header with an orange stripe, leather body. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha(leatherDark, 0.5)}, ${alpha(leatherDark, 0.75)}), var(--dbtc-u6) left top / 6px 12px repeat !important; box-shadow: inset 0 -2px 0 ${orange}, inset 0 1px 0 ${alpha(leatherHi, 0.6)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${leatherHi}, inset -1px 0 0 ${leatherHi}, inset 0 -1px 0 ${leatherHi} !important; }

/* Duel: charged life bars with a tesla coil; stitched leather phase discs. */
${SEL.life} { border-color: ${leatherHi} !important; border-radius: 6px !important; box-shadow: 0 0 0 1px ${leatherDark}, 0 0 0 3px ${leather}, 0 0 0 4px ${alpha(orange, 0.7)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 4px !important; }
${SEL.lifeSelf} { background: ${bar(t.self)} !important; }
${SEL.lifeOpp} { background: ${bar(t.opp)} !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -8px; width: 18px; height: 44px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: radial-gradient(circle, ${leatherHi}, ${leatherDark}) !important; box-shadow: 0 0 0 1px ${leatherDark}, 0 0 0 2px ${alpha(orange, 0.6)}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${leatherDark} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, var(--dbtc-u2), radial-gradient(circle, ${leather} 40%, ${leatherDark}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.3)} 15%, ${t.self} 45%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.3)} 15%, ${t.opp} 45%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 3px 0 0 ${orange}, inset 0 0 0 1px ${leatherHi} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${leatherHi}, 0 0 0 4px ${leatherDark}, 0 0 0 5px ${alpha(orange, 0.75)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${orangeHi}, ${orangeDeep}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${leatherHi}, ${leatherDark}) !important; }

/* Duel room: stitched leather around every panel, no Genesys hue shift. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(leather, 0.7)}, ${alpha(t.bg, 0.86)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${leatherHi}, ${leatherDark} 35%, ${leather} 60%, ${leatherDark} 85%, ${orange}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(90deg, transparent 4%, ${plate} 12% 88%, transparent 96%) !important; box-shadow: none !important; }
${sel(['#deck_constructor #search .title_txt'])} { background: ${plate} !important; box-shadow: 0 0 0 0.3em ${plate} !important; border-radius: 4px !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${leatherDark} !important; box-shadow: 0 0 0 0.35em ${leatherDark} !important; border-radius: 4px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(orange, 0.16)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(orange, 0.34)}, ${alpha(mint, 0.12)}) !important; }

/* Deck constructor: leather trays with a stitched lip. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(leather, t.surface, 0.55)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${leatherHi}, inset 0 0 0 3px ${alpha(leatherDark, 0.9)}, inset 0 3px 0 3px ${alpha(orange, 0.5)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(18)} }

/* Settings panels: the same stitched frame. */
${SEL.settingsPanel} { border-color: ${leatherHi} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(leather, 0.88)}, ${alpha(t.bg, 0.9)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: cream lettering with an orange bolt glow. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${leatherDark}, 0 0 16px ${alpha(orange, 0.55)} !important; }

/* Text fields: dark wells with a leather lip, mint focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${leatherHi} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(leatherHi, 0.3)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${mint} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(mint, 0.6)} !important; }

/* Scrollbars: jacket zippers. */
${sel(['#content .os-scrollbar-handle'])} { background: repeating-linear-gradient(180deg, ${chrome} 0 3px, ${leatherDark} 3px 5px), ${chrome} !important; border-radius: 3px !important; box-shadow: inset 0 0 0 1px ${leatherDark}, 0 0 0 1px ${alpha(orange, 0.6)} !important; }

/* Duel: Surge stands behind the empty top-right zones, so she waits for the menu. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-bcq-herogrp { display: none; }
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-bcq-bolt { transform: translateX(21px); }
/* Duel: the storm cloud lifts clear of the opponent's life points. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-bcq-storm { transform: translateY(-46px); }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx :is(.dbtefx-bcq-herogrp, .dbtefx-bcq-halo) { transform-origin: 0 0; transform: translate(1045px, 175px) scale(0.33); }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-bcq-isle { transform-origin: 0 0; transform: translate(662px, 308px) scale(0.6); }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-bcq-sun { transform-origin: 0 0; transform: translate(801px, 290px) scale(0.5); }
/* Front page: the bolt fades in below the Welcome / Forum / Rules links. */
html body:has(#welcome_buttons:not([style*="none"])) #dbte-skin-fx .dbtefx-bcq-bolt { mask: url(#dbtefx-bcq-boltfade); }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
