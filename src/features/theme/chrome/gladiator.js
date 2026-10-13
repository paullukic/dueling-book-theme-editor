// gladiator: the Gladiator Beasts' colosseum. Carved sandstone blocks bound in
// riveted bronze with a Greek-key frieze, bronze round shields, laurel wreaths,
// red banners with gold fringe. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');
const rgb = (hex) => [1, 3, 5].map((i) => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(3));

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const bronze = t.accent;
  const bronzeLit = mix(t.accent, '#ffffff', 0.35);
  const bronzeDeep = mix(t.accent, t.bg, 0.55);
  const banner = t.accent2;
  const bannerDeep = mix(t.accent2, t.bg, 0.45);
  const stone = mix(t.raised, t.border, 0.25);
  const stoneDeep = mix(t.surface, t.bg, 0.4);

  // Sandstone grain with a few chisel strokes.
  const [r, g, b] = rgb(t.text);
  const grain = svg(140, 140, `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 0.09 0"/></filter><rect width="140" height="140" filter="url(#n)"/><path d="M12 30l18-4M80 96l22-5M100 20l14 6M30 110l12 3" stroke="${t.bg}" stroke-opacity="0.35" stroke-width="1.2"/>`);

  // Nine-slice bronze band: a Greek-key frieze along the edges, riveted bosses at the corners.
  const key = (x) => `<path d="M${x} 11H${x + 6}V3.6H${x + 16}V9H${x + 11}V6.2" fill="none" stroke="${bronzeLit}" stroke-width="1.3"/>`;
  const keySide = (y) => `<path d="M11 ${y}V${y + 6}H3.6V${y + 16}H9V${y + 11}H6.2" fill="none" stroke="${bronzeLit}" stroke-width="1.3"/>`;
  const rivet = (x, y) => `<circle cx="${x}" cy="${y}" r="5.2" fill="${bronzeDeep}" stroke="${bronzeLit}" stroke-width="1"/><circle cx="${x}" cy="${y}" r="2.6" fill="${bronzeLit}"/><circle cx="${x - 0.8}" cy="${y - 0.8}" r="0.9" fill="#ffffff" fill-opacity="0.7"/>`;
  const frameSvg = svg(60, 60, `<path d="M0 0H60V60H0ZM13 13V47H47V13Z" fill="${bronzeDeep}" fill-rule="evenodd"/><g fill="none" stroke="${bronze}" stroke-width="1.2"><rect x="0.8" y="0.8" width="58.4" height="58.4"/><rect x="12.4" y="12.4" width="35.2" height="35.2"/></g>${key(20)}<g transform="matrix(1 0 0 -1 0 60)">${key(20)}</g>${keySide(20)}<g transform="matrix(-1 0 0 1 60 0)">${keySide(20)}</g>${rivet(6.6, 6.6)}${rivet(53.4, 6.6)}${rivet(6.6, 53.4)}${rivet(53.4, 53.4)}`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px round; box-sizing: border-box;`;

  // Laurel: leaves along an arc, mirrored.
  const branch = (cx, cy, rad, from, to, n, flip) => {
    let leaves = '';
    for (let i = 0; i < n; i++) {
      const a = from + ((to - from) * i) / (n - 1);
      const x = cx + Math.cos(a) * rad;
      const y = cy + Math.sin(a) * rad;
      const deg = (a * 180) / Math.PI + (flip ? -60 : 60);
      leaves += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="4.6" ry="1.9" transform="rotate(${deg.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${i % 2 ? bronze : bronzeLit}"/>`;
    }
    return leaves;
  };
  const sprig = svg(40, 14, `${branch(20, -6, 17, Math.PI * 0.55, Math.PI * 0.95, 5, false)}${branch(20, -6, 17, Math.PI * 0.45, Math.PI * 0.05, 5, true)}<circle cx="20" cy="10" r="3" fill="${banner}" stroke="${bronzeLit}" stroke-width="1"/>`);

  // Round bronze shield (clipeus): concentric rings, a boss and rivets.
  let studs = '';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    studs += `<circle cx="${(20 + Math.cos(a) * 15).toFixed(1)}" cy="${(20 + Math.sin(a) * 15).toFixed(1)}" r="1.3" fill="${bronzeLit}"/>`;
  }
  const shieldBody = `<circle cx="20" cy="20" r="18.5" fill="${bronzeDeep}" stroke="${bronzeLit}" stroke-width="1.6"/><circle cx="20" cy="20" r="12.5" fill="${bannerDeep}" stroke="${bronze}" stroke-width="1.2"/>${studs}<circle cx="20" cy="20" r="5.5" fill="${bronze}" stroke="${bronzeLit}"/><circle cx="18.6" cy="18.6" r="1.8" fill="#ffffff" fill-opacity="0.6"/>`;
  const shield = svg(40, 40, shieldBody);

  // Wreath crowning a shield, for pop-ups.
  const wreath = svg(130, 72, `${branch(65, 38, 33, Math.PI * 0.62, Math.PI * 1.45, 7, false)}${branch(65, 38, 33, Math.PI * 0.38, -Math.PI * 0.45, 7, true)}<path d="M54 68l11-8 11 8" fill="none" stroke="${banner}" stroke-width="3"/><g transform="translate(45 18)">${shieldBody}</g>`);

  // Phase discs: shield rings and studs.
  let pstuds = '';
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    pstuds += `<circle cx="${(22.5 + Math.cos(a) * 18.5).toFixed(1)}" cy="${(22.5 + Math.sin(a) * 18.5).toFixed(1)}" r="1.2" fill="${bronzeLit}" fill-opacity="0.85"/>`;
  }
  const phaseShield = svg(45, 45, `<circle cx="22.5" cy="22.5" r="16" fill="none" stroke="${bronze}" stroke-opacity="0.55" stroke-width="1.2"/>${pstuds}`);

  // Gold fringe under the red banners.
  const fringe = svg(8, 7, `<rect width="8" height="2" fill="${bronze}"/><path d="M2 2v4.4M6 2v3.4" stroke="${bronzeLit}" stroke-width="1.4" stroke-linecap="round"/>`);

  const stoneBg = (lift = 0) => `linear-gradient(180deg, ${alpha('#ffffff', 0.06 + lift)}, transparent 40%, ${alpha('#000000', 0.25)}), var(--dbtc-u2), linear-gradient(180deg, ${stone}, ${stoneDeep})`;
  const bronzePlate = `linear-gradient(180deg, ${bronzeLit}, ${bronze} 45%, ${mix(bronze, t.bg, 0.3)})`;

  // Pop-up buttons (DuelingBook's OK/Yes/No/Cancel <img>s), redrawn in the theme's material.
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="${c.r}" fill="url(#g)" stroke="${c.edge}" stroke-width="2.5"/><rect x="11" y="15" width="${bw - 10}" height="48.5" rx="${Math.max(c.r - 4, 0)}" fill="none" stroke="${c.inner}" stroke-opacity="0.75" stroke-width="1"/>${c.deco(w)}<text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 4px ${c.shadow}) !important; }`).join('\n');
  const popPrimary = { top: bronzeLit, bot: mix(bronze, t.bg, 0.25), edge: bronzeDeep, inner: '#ffffff', text: t.accentText, r: 3, shadow: alpha('#000000', 0.6), deco: (w) => [[14, 18], [w - 14, 18], [14, 60.5], [w - 14, 60.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${bronzeDeep}" stroke="${bronzeLit}"/>`).join('') };
  const popSecondary = { ...popPrimary, top: stone, bot: stoneDeep, edge: bronze, inner: bronze, text: t.text, deco: (w) => [[14, 18], [w - 14, 18], [14, 60.5], [w - 14, 60.5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${bronze}" stroke="${bronzeLit}"/>`).join('') };
  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const u0 = svgUrl(frameSvg);
  const u1 = svgUrl(sprig);
  const u2 = svgUrl(grain);
  const u3 = svgUrl(wreath);
  const u4 = svgUrl(fringe);
  const u5 = svgUrl(shield);
  const u6 = svgUrl(phaseShield);
  return `
html body { ${[['u0', u0], ['u1', u1], ['u2', u2], ['u3', u3], ['u4', u4], ['u5', u5], ['u6', u6]].map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: sandstone blocks in a riveted bronze frieze, a laurel sprig on top. */
${SEL.tile} { background: ${stoneBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 9px 4px round !important; border-radius: 0 !important; box-shadow: 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 22px); top: -7px; width: 44px; height: 16px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 1px 1px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: linear-gradient(0deg, ${alpha(banner, 0.35)}, transparent 70%), ${stoneBg(0.06)} !important; box-shadow: 0 0 20px -5px ${alpha(bronze, 0.9)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 8px ${alpha(t.bg, 0.9)} !important; }

/* Buttons: polished bronze plates. */
${SEL.button} { background: ${bronzePlate} !important; border-color: ${bronzeDeep} !important; color: ${t.accentText} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.45)}, inset 0 -2px 0 ${alpha('#000000', 0.25)}, 0 2px 5px -2px #000000 !important; }
${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: ${bronzePlate} !important; border-color: ${bronzeDeep} !important; color: ${t.accentText} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.45)}, inset 0 -2px 0 ${alpha('#000000', 0.25)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, #ffffff, ${bronzeLit} 30%, ${bronze}) !important; border-color: ${banner} !important; box-shadow: inset 0 -2px 0 ${banner}, 0 0 10px -2px ${alpha(bronze, 0.9)} !important; }
${SEL.buttonDown} { background: ${mix(bronze, t.bg, 0.25)} !important; border-color: ${banner} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.6)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.accentText, bronze, 0.45)} !important; }

/* Pop-ups: a carved tablet in a bronze frieze, crowned by a wreath and shield. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 60% at 50% 0%, ${alpha(bronze, 0.16)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${stone}, ${t.bg}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${bronzeLit}, 0 0 0 3px ${bronzeDeep}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(22)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 65px); top: -50px; right: auto; bottom: auto; width: 130px; height: 72px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 3px 3px #000000); transform: none; }
${SEL.dialogTitle} { color: ${t.text} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 14px ${alpha(bronze, 0.5)} !important; }

/* Chat: a red banner with gold fringe; bronze rails down the window. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.12)}, transparent 50%), linear-gradient(90deg, ${bannerDeep}, ${banner} 30%, ${banner} 70%, ${bannerDeep}) !important; box-shadow: inset 0 2px 0 ${bronze}, inset 0 -1px 0 ${bronzeDeep} !important; }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; left: 0; right: 0; bottom: -7px; height: 7px; pointer-events: none; background: var(--dbtc-u4) 0 0 / 8px 7px repeat-x; }
${sel(['#chats .chat .chat_top span'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${stoneDeep}) !important; box-shadow: inset 2px 0 0 ${bronze}, inset -2px 0 0 ${bronze}, inset 0 -2px 0 ${bronze} !important; }

/* Duel: bronze-bound life bars led by a round shield; phases are shields. */
${SEL.life} { border-color: ${bronze} !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${bronzeDeep}, inset 0 0 0 1px ${alpha(bronzeLit, 0.5)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 3px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.45)} 0 2px, ${alpha('#ffffff', 0.18)} 2px, transparent 50%, ${alpha('#000000', 0.18)}), var(--dbtc-u2), linear-gradient(90deg, ${mix(t.self, '#000000', 0.22)}, ${t.self} 70%, ${mix(t.self, '#ffffff', 0.12)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.5)} 0 2px, ${alpha('#ffffff', 0.2)} 2px, transparent 50%, ${alpha('#000000', 0.16)}), linear-gradient(90deg, ${mix(t.opp, '#000000', 0.16)}, ${t.opp} 60%, ${mix(t.opp, '#ffffff', 0.22)}) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: repeating-linear-gradient(135deg, ${alpha(bronze, 0.28)} 0 2px, transparent 2px 7px), linear-gradient(180deg, ${mix(bronzeDeep, '#000000', 0.3)}, ${mix(bronzeDeep, '#000000', 0.6)}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; z-index: 3; left: -26px; top: -1px; width: 32px; height: 32px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 210deg, ${bronzeLit}, ${bronze}, ${bronzeDeep}, ${bronze}, ${bronzeLit}, ${bronzeDeep}, ${bronzeLit}) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase.active .background'])} { background: conic-gradient(from 210deg, #fff0b8, #e0b040, #9a6a18, #e0b040, #fff0b8, #9a6a18, #fff0b8) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 10px -2px ${alpha('#e0b040', 0.8)}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${bronzeDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${stone} 30%, ${stoneDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(banner, '#ffffff', 0.12)} 25%, ${bannerDeep}) !important; box-shadow: 0 0 14px ${alpha(banner, 0.85)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u6) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, t.bg, 0.15)} 25%, ${mix(t.opp, t.bg, 0.6)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${mix(bronzeLit, t.text, 0.4)} !important; text-shadow: 0 1px 2px #000000 !important; }
${sel(['#duel .phase.active span', '#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: ${t.text} !important; text-shadow: 1px 0 0 ${t.bg}, -1px 0 0 ${t.bg}, 0 1px 0 ${t.bg}, 0 -1px 0 ${t.bg}, 0 0 8px ${alpha(t.bg, 0.8)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${bronzeDeep} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(banner, '#ffffff', 0.15)}, ${bannerDeep}) !important; }
/* Card text: a stone margin ring outside the box gives the words room (no padding on DuelingBook's box). */
${sel(['#duel #preview_txt'])} { background: ${mix(t.surface, stoneDeep, 0.5)} !important; border-color: transparent !important; box-shadow: 2px 0 0 7px ${mix(t.surface, stoneDeep, 0.5)}, 2px 0 0 8.5px ${bronze}, 2px 0 0 9.5px ${bronzeDeep} !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${stoneDeep}) !important; box-shadow: inset 0 0 0 2px ${bronze}, inset 0 0 0 4px ${bronzeDeep} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${bronze}, 0 0 0 4px ${bronzeDeep}, 0 6px 16px -6px #000000 !important; }

/* Front page: the banners would hang behind the logo and the Welcome / Forum / Rules links. */
html body:has(#welcome_buttons:not([style*="none"])) #dbte-skin-fx :is(.dbtefx-gb-banner-l, .dbtefx-gb-banner-r) { display: none; }
/* Menu: the right banner would hang between the "All Statuses" dropdown and the camera button. */
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-gb-banner-r { display: none; }

/* Duel room: bronze rings around stone panels. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(stone, 0.7)}, ${alpha(t.bg, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${bronzeLit}, ${bronze} 30%, ${bronzeDeep} 55%, ${bronze} 80%, ${bronzeLit}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(90deg, transparent 2%, ${mix(t.surface, t.bg, 0.5)} 7% 93%, transparent 98%) 0 100% / 100% 46% no-repeat !important; box-shadow: none !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: none !important; box-shadow: none !important; z-index: 1; }
${on(sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl']), 'before')} { content: ""; position: absolute; left: -0.5em; right: -0.5em; top: 52%; bottom: -0.15em; z-index: -1; pointer-events: none; background: linear-gradient(90deg, transparent, ${mix(t.surface, t.bg, 0.5)} 0.4em calc(100% - 0.4em), transparent); }
${on(sel(['#content #settings_content .admin_lbl']), 'before')} { content: ""; position: absolute; left: -0.5em; right: -0.5em; top: 22%; bottom: 8%; z-index: -1; pointer-events: none; background: linear-gradient(90deg, transparent, ${mix(t.surface, t.bg, 0.5)} 0.4em calc(100% - 0.4em), transparent); }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(banner, 0.22)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(banner, 0.45)}, ${alpha(bronze, 0.15)}) !important; }

/* Deck constructor: stone panels banded in bronze. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(stone, t.surface, 0.4)}, ${stoneDeep}) !important; box-shadow: inset 0 0 0 2px ${bronze}, inset 0 0 0 4px ${bronzeDeep}, inset 0 0 0 5px ${alpha(bronzeLit, 0.4)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels. */
${settingsPanels} { border-color: ${bronze} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(stone, 0.85)}, ${alpha(t.bg, 0.9)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: inscriptions in bronze. */
${titles} { color: ${mix(bronzeLit, t.text, 0.35)} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${t.bg}, 0 0 3px ${t.bg}, 0 0 14px ${alpha(bronze, 0.45)} !important; }

/* Text fields: dark stone wells with a bronze lip. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${bronzeDeep} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(bronze, 0.3)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${bronze} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(bronze, 0.6)} !important; }

/* Scrollbars: bronze rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${bronzeDeep}, ${bronzeLit}, ${bronzeDeep}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss(popPrimary, popSecondary)}
`;
};
