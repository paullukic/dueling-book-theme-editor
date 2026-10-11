// ancient-gear: Dr. Crowler's clockwork. Bronze plates bolted into a brass
// frame (rivets down every edge, hex bolts at the corners, a verdigris seam
// where the metal has weathered), a half-cog crest bolted on top of each tile
// and the Golem's red eye set in a brass gear over every pop-up. Buttons are
// brass levers; phases are gear rings; life bars are brass gauges.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');
const f1 = (v) => Math.round(v * 10) / 10;

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const brass = t.accent;
  const brassLit = mix(t.accent, '#ffffff', 0.4);
  const brassDeep = mix(t.accent, t.bg, 0.55);
  const copper = mix(t.accent, t.danger, 0.25);
  const bronze = mix(copper, t.raised, 0.6);
  const bronzeDeep = mix(copper, t.bg, 0.82);
  const patina = t.accent2;
  const ink = mix(t.bg, '#000000', 0.45);
  const eye = t.danger;
  // The brass plate: bright, body, a dark roll-off, a returning highlight.
  const plate = `linear-gradient(176deg, ${brassLit} 0%, ${brass} 38%, ${mix(brass, t.bg, 0.35)} 62%, ${mix(brass, '#ffffff', 0.15)} 100%)`;

  // A spur gear path (trapezoid teeth, optional hub hole).
  const gearPath = (cx, cy, r, teeth, depth, hub = 0) => {
    const step = (Math.PI * 2) / teeth;
    let d = '';
    for (let i = 0; i < teeth; i++) {
      const a = -Math.PI / 2 + i * step;
      const pts = [[r - depth, a - step * 0.5], [r - depth, a - step * 0.28], [r, a - step * 0.17], [r, a + step * 0.17], [r - depth, a + step * 0.28]];
      d += `${i ? 'L' : 'M'}${pts.map(([rr, aa]) => `${f1(cx + Math.cos(aa) * rr)} ${f1(cy + Math.sin(aa) * rr)}`).join('L')}`;
    }
    d += 'Z';
    if (hub) d += `M${f1(cx + hub)} ${cy}A${hub} ${hub} 0 1 0 ${f1(cx - hub)} ${cy}A${hub} ${hub} 0 1 0 ${f1(cx + hub)} ${cy}Z`;
    return d;
  };
  const rivet = (x, y, r = 2.2) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${brassLit}" stroke="${ink}" stroke-width="0.7"/><circle cx="${f1(x - r * 0.3)}" cy="${f1(y - r * 0.3)}" r="${f1(r * 0.35)}" fill="#ffffff" fill-opacity="0.55"/>`;
  const bolt = (x, y) => `<path d="M${x - 5} ${y}L${x - 2.5} ${y - 4.3}H${x + 2.5}L${x + 5} ${y}L${x + 2.5} ${y + 4.3}H${x - 2.5}Z" fill="${brass}" stroke="${ink}" stroke-width="0.9"/><circle cx="${x}" cy="${y}" r="1.4" fill="${brassDeep}"/>`;

  // Nine-slice frame: a brass rim, a bronze band, a verdigris seam; each corner held by a hex bolt and two rivets.
  let rivetRow = '';
  for (const [x, y] of [[15.5, 6], [6, 15.5], [44.5, 6], [54, 15.5], [15.5, 54], [6, 44.5], [44.5, 54], [54, 44.5]]) rivetRow += rivet(x, y, 2.6);
  const frameSvg = svg(60, 60, `<path d="M0 0H60V60H0ZM12 12V48H48V12Z" fill="${bronzeDeep}" fill-rule="evenodd"/><g fill="none"><rect x="0.9" y="0.9" width="58.2" height="58.2" stroke="${brass}" stroke-width="1.8"/><rect x="11.4" y="11.4" width="37.2" height="37.2" stroke="${patina}" stroke-opacity="0.7" stroke-width="1"/><rect x="2.6" y="2.6" width="54.8" height="54.8" stroke="${brassLit}" stroke-opacity="0.35" stroke-width="0.6"/></g>${rivetRow}${bolt(7, 7)}${bolt(53, 7)}${bolt(7, 53)}${bolt(53, 53)}`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px round; box-sizing: border-box;`;

  // Texture: brushed bronze, faint horizontal draw lines.
  const brushed = svg(140, 24, `<path d="M0 3H60M78 3H140M10 9H110M0 15H40M56 15H140M20 21H96" stroke="${brassLit}" stroke-opacity="0.045" stroke-width="1"/>`);

  // Tile crest: a half cog bolted on, teeth up, brass hub and a verdigris ring.
  const crestTile = svg(64, 30, `<path d="${gearPath(32, 30, 27, 14, 6)}" fill="${brass}" stroke="${ink}" stroke-width="1.2"/><circle cx="32" cy="30" r="17" fill="${bronzeDeep}" stroke="${brassLit}" stroke-width="1.2"/><circle cx="32" cy="30" r="12" fill="none" stroke="${patina}" stroke-width="1.3"/>${rivet(22, 26, 1.8)}${rivet(42, 26, 1.8)}<circle cx="32" cy="30" r="6" fill="${brassLit}" stroke="${ink}" stroke-width="1"/>`);

  // Pop-up crest: the Golem's red eye set in a brass drive gear, a pinion meshing at each side.
  const crown = svg(170, 96, `<path d="${gearPath(36, 60, 22, 10, 6, 5)}" fill="${brassDeep}" stroke="${ink}" stroke-width="1.2" fill-rule="evenodd"/><path d="${gearPath(134, 60, 22, 10, 6, 5)}" fill="${brassDeep}" stroke="${ink}" stroke-width="1.2" fill-rule="evenodd"/><path d="${gearPath(85, 52, 44, 18, 8)}" fill="${brass}" stroke="${ink}" stroke-width="1.6"/><circle cx="85" cy="52" r="34" fill="${bronzeDeep}" stroke="${brassLit}" stroke-width="2"/><circle cx="85" cy="52" r="27" fill="none" stroke="${patina}" stroke-width="2"/>${[0, 60, 120, 180, 240, 300].map((a) => rivet(f1(85 + Math.cos((a * Math.PI) / 180) * 31), f1(52 + Math.sin((a * Math.PI) / 180) * 31), 2)).join('')}<rect x="66" y="42" width="38" height="20" rx="3" fill="${ink}" stroke="${brassDeep}" stroke-width="1.5"/><path d="M70 46V58M76 46V58M82 46V58M88 46V58M94 46V58M100 46V58" stroke="${bronzeDeep}" stroke-width="2"/><path d="M86 49H97L95 55H88Z" fill="${eye}"/><path d="M88 50.5H95" stroke="${mix(eye, '#ffffff', 0.6)}" stroke-width="1.2"/>`);

  // Phase discs: a gear ring around the label.
  const phaseRing = svg(45, 45, `<path d="${gearPath(22.5, 22.5, 22.3, 18, 2.6, 19.6)}" fill="${brass}" fill-rule="evenodd" stroke="${ink}" stroke-width="0.8"/><circle cx="22.5" cy="22.5" r="19.2" fill="none" stroke="${patina}" stroke-opacity="0.7" stroke-width="0.8"/>`);
  // Life bar cap: a brass gear with a hub.
  const lifeCap = svg(40, 40, `<path d="${gearPath(20, 20, 18, 12, 4.5, 0)}" fill="${brass}" stroke="${ink}" stroke-width="1"/><circle cx="20" cy="20" r="9" fill="${bronzeDeep}" stroke="${brassLit}" stroke-width="1.2"/><circle cx="20" cy="20" r="3.4" fill="${eye}"/>`);

  const tileBg = (lift = 0) => `radial-gradient(ellipse 90% 70% at 50% -10%, ${alpha(brassLit, 0.16 + lift)}, transparent 70%), linear-gradient(0deg, ${alpha(patina, 0.06)}, transparent 40%), var(--dbtc-u2), linear-gradient(180deg, ${bronze}, ${bronzeDeep})`;

  // Pop-up buttons: a brass lever plate with a rivet at each end (primary);
  // dark bronze in a brass rim with verdigris rivets (secondary).
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const [x0, x1, y0] = [6, w - 6, 10];
    const riv = (x) => `<circle cx="${x}" cy="${y0 + 29.25}" r="5" fill="${c.stud}" stroke="${ink}" stroke-width="1.2"/><circle cx="${f1(x - 1.4)}" cy="${y0 + 27.8}" r="1.6" fill="#ffffff" fill-opacity="0.55"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0.08" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.38" stop-color="${c.mid}"/><stop offset="0.62" stop-color="${c.low}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="${x0}" y="${y0}" width="${f1(x1 - x0)}" height="58.5" rx="3" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/><path d="M${x0 + 4} ${y0 + 3}H${f1(x1 - 4)}" stroke="#ffffff" stroke-opacity="${c.lip}" stroke-width="1.2"/><rect x="${x0 + 22}" y="${y0 + 6}" width="${f1(x1 - x0 - 44)}" height="46.5" rx="2" fill="none" stroke="${c.seam}" stroke-opacity="0.8" stroke-width="1"/>${riv(x0 + 12)}${riv(f1(x1 - 12))}<text x="${w / 2}" y="39.5" dominant-baseline="central" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="25" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: brassLit, mid: brass, low: mix(brass, t.bg, 0.3), bot: mix(brass, '#ffffff', 0.1), edge: ink, seam: brassDeep, lip: 0.5, stud: brassLit, text: t.accentText };
  const popSecondary = { top: mix(bronze, brass, 0.2), mid: bronze, low: bronzeDeep, bot: bronze, edge: brass, seam: patina, lip: 0.15, stud: patina, text: t.text };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 4px 6px ${alpha('#000000', 0.6)}) !important; }`)
    .join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const panelDark = mix(bronzeDeep, t.bg, 0.4);

  const vars = [frameSvg, crestTile, brushed, crown, phaseRing, lifeCap].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: bronze plates bolted into a riveted brass frame, a half cog on top. */
${SEL.tile} { background: ${tileBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 12px round !important; border-radius: 0 !important; box-shadow: inset 0 1px 0 ${alpha(brassLit, 0.25)}, 0 18px 30px -20px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 32px); top: -21px; width: 64px; height: 30px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 -1px 2px ${alpha('#000000', 0.6)}); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${tileBg(0.16)} !important; box-shadow: inset 0 1px 0 ${alpha(brassLit, 0.4)}, inset 0 0 26px ${alpha(t.warning, 0.22)}, 0 0 18px -4px ${alpha(brass, 0.7)}, 0 18px 30px -20px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 1px 0 ${ink}, 0 2px 6px ${alpha('#000000', 0.8)} !important; }

/* Buttons: brass levers, the label struck into the metal. */
${SEL.button} { background: ${plate} !important; border-color: ${brassDeep} !important; color: ${t.accentText} !important; border-radius: 2px !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.3)} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.45)}, 0 10px 16px -12px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(176deg, #ffffff 0%, ${brassLit} 30%, ${brass} 62%, ${brassLit} 100%) !important; border-color: ${patina} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.6)}, 0 0 12px -2px ${alpha(t.warning, 0.75)} !important; }
${SEL.buttonDown} { background: linear-gradient(176deg, ${brass}, ${mix(brass, t.bg, 0.35)}) !important; border-color: ${brassDeep} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.55)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.accentText, brass, 0.45)} !important; }

/* Pop-ups: a riveted bronze housing under the Golem's eye. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 55% at 50% 0%, ${alpha(t.warning, 0.14)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${bronze}, ${panelDark}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 3px ${brassDeep}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(18)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 68px); top: -72px; right: auto; bottom: auto; width: 136px; height: 77px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 3px 4px #000000); transform: none; }
${SEL.dialogTitle} { color: ${brassLit} !important; text-shadow: 0 1px 0 ${ink}, 0 2px 4px #000000 !important; }

/* Chat: a riveted brass header band, bronze body with a verdigris seam. */
${SEL.chatTop} { background: radial-gradient(circle at 10px 50%, ${brassLit} 0 2px, transparent 2.6px) 0 0 / 22px 100% repeat-x, ${plate} !important; box-shadow: inset 0 -2px 0 ${ink}, inset 0 -3px 0 ${patina} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.accentText} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.35)} !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(bronzeDeep, t.surface, 0.4)}, ${panelDark}) !important; box-shadow: inset 2px 0 0 ${brassDeep}, inset -2px 0 0 ${brassDeep}, inset 0 -2px 0 ${brassDeep}, inset 0 0 0 3px ${alpha(patina, 0.25)} !important; }

/* Duel: brass gauge life bars led by a gear; phases are gear rings. */
${SEL.life} { border-color: ${brass} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${ink}, inset 0 0 0 2px ${ink}, inset 0 0 0 3px ${alpha(brassLit, 0.45)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 1px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha(t.self, 0.9)} 0 2px, ${alpha('#ffffff', 0.42)} 2px, transparent 45%, ${alpha('#000000', 0.2)}), linear-gradient(90deg, ${mix(t.warning, t.danger, 0.3)}, ${t.warning} 35%, ${mix(t.warning, '#ffffff', 0.3)} 55%, ${t.warning} 70%, ${mix(t.warning, t.bg, 0.3)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.3)}, transparent 45%, ${alpha('#000000', 0.18)}), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.45)}, ${t.opp} 50%, ${mix(t.opp, t.bg, 0.35)}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -3px; width: 34px; height: 34px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: radial-gradient(circle, ${bronzeDeep} 62%, ${brassLit} 64%, ${brassDeep} 72%) !important; box-shadow: 0 0 0 1px ${ink}, 0 3px 8px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${brassDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${bronze} 30%, ${ink}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: radial-gradient(circle at 50% 70%, ${mix(mix(t.warning, t.danger, 0.5), t.bg, 0.42)} 0%, ${mix(t.danger, t.bg, 0.62)} 50%, ${mix(t.danger, t.bg, 0.45)} 85%) !important; box-shadow: 0 0 16px ${alpha(t.warning, 0.9)}, 0 0 4px ${alpha(t.danger, 0.9)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 70%, ${mix(t.opp, t.bg, 0.45)} 0%, ${mix(t.opp, t.bg, 0.62)} 50%, ${mix(t.opp, t.bg, 0.45)} 85%) !important; box-shadow: 0 0 16px ${alpha(t.opp, 0.9)}; }
${sel(['#duel .phase span'])} { color: ${brassLit} !important; text-shadow: 0 1px 2px #000000, 0 0 4px #000000 !important; }
${sel(['#duel .phase.active span'])} { color: #ffffff !important; text-shadow: 0 0 2px ${ink}, 0 1px 2px #000000, 0 0 6px ${mix(t.danger, '#000000', 0.5)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${brassDeep} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(bronze, brass, 0.25)}, ${bronzeDeep}) !important; box-shadow: inset 0 0 0 1px ${brass} !important; }
${sel(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span'])} { color: ${t.text} !important; text-shadow: 1px 0 0 ${ink}, -1px 0 0 ${ink}, 0 1px 0 ${ink}, 0 -1px 0 ${ink}, 0 2px 3px #000000 !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(bronzeDeep, t.surface, 0.4)}, ${panelDark}) !important; box-shadow: inset 0 0 0 1px ${brass}, inset 0 0 0 3px ${ink}, inset 0 0 0 4px ${alpha(patina, 0.5)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${brass}, 0 0 0 4px ${ink}, 0 0 0 5px ${brassDeep} !important; }

/* Duel room: brass rims around bronze-dark panels, a riveted frame over each. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(bronzeDeep, 0.9)}, ${alpha(t.bg, 0.92)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${brassLit}, ${brass} 30%, ${brassDeep} 55%, ${brass} 80%, ${brassLit}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${panelDark} !important; box-shadow: 0 0 0 0.35em ${panelDark} !important; border-radius: 1px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(brass, 0.18)}, transparent 45%), ${t.raised} !important; filter: none !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(brass, 0.34)}, ${alpha(patina, 0.14)}) !important; }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }

/* Deck constructor: bronze panels inside a brass and verdigris double rule. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(bronzeDeep, t.surface, 0.35)}, ${panelDark}) !important; box-shadow: inset 0 0 0 1px ${brassLit}, inset 0 0 0 4px ${ink}, inset 0 0 0 5px ${alpha(patina, 0.6)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(14)} }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${brass} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(bronzeDeep, 0.92)}, ${alpha(t.bg, 0.94)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: engraved brass. */
${titles} { color: ${brassLit} !important; text-shadow: 0 1px 0 ${ink}, 0 0 3px ${t.bg}, 0 2px 6px #000000 !important; }

/* Text fields: iron wells under a brass lip. */
${SEL.field} { background-color: ${mix(t.bg, '#000000', 0.25)} !important; border-color: ${brassDeep} !important; caret-color: ${brassLit}; box-shadow: inset 0 1px 3px #000000, 0 1px 0 ${alpha(brass, 0.3)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${brass} !important; box-shadow: inset 0 1px 3px #000000, 0 0 10px ${alpha(t.warning, 0.55)} !important; }

/* Scrollbars: brass rods in an iron trough. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${brassDeep}, ${brassLit}, ${brassDeep}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
