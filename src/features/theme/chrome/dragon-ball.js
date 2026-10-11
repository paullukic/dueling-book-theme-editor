// dragon-ball: capsule tech and star orbs. Panels are glossy indigo capsule
// shells in a rounded chrome rim, pop-ups are radar screens (a faint green
// grid and range rings), every crest is an amber glass orb with red stars,
// the phases are the orbs themselves (one to six stars) and the life bars are
// golden ki gauges. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const ink = mix(t.bg, '#000000', 0.5);
  const chrome = mix(t.text, t.muted, 0.35);
  const chromeDim = mix(t.muted, t.bg, 0.45);
  const shell = mix(t.surface, t.border, 0.3);
  const shellDeep = mix(t.bg, t.surface, 0.5);
  const radar = t.success;
  const amber = t.accent;
  const gold = t.accent2;
  const red = t.danger;

  // An amber glass orb with n red stars (n = 0 for none), lit from inside.
  const STARS = {
    1: [[0, 0]],
    2: [[-0.3, -0.1], [0.3, 0.1]],
    3: [[0, -0.32], [-0.3, 0.2], [0.3, 0.2]],
    4: [[0, -0.36], [-0.36, 0], [0.36, 0], [0, 0.36]],
    5: [[0, -0.38], [-0.36, -0.1], [0.36, -0.1], [-0.22, 0.32], [0.22, 0.32]],
    6: [[-0.22, -0.34], [0.22, -0.34], [-0.4, 0], [0.4, 0], [-0.22, 0.34], [0.22, 0.34]],
  };
  const starPath = (cx, cy, r) => {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rad = i % 2 ? r * 0.42 : r;
      d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rad).toFixed(2)} ${(cy + Math.sin(a) * rad).toFixed(2)}`;
    }
    return `${d}Z`;
  };
  const orbDefs = `<defs><radialGradient id="o" cx="0.5" cy="0.62" r="0.62"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.45)}"/><stop offset="0.5" stop-color="${mix(amber, gold, 0.4)}"/><stop offset="0.88" stop-color="${amber}"/><stop offset="1" stop-color="${mix(amber, red, 0.5)}"/></radialGradient></defs>`;
  const orb = (cx, cy, r, n, starScale = 0.2) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#o)" stroke="${mix(amber, ink, 0.55)}" stroke-width="${(r * 0.05).toFixed(2)}"/>${(STARS[n] || []).map(([x, y]) => `<path d="${starPath(cx + x * r, cy + y * r, r * starScale)}" fill="${red}"/>`).join('')}<path d="M${(cx - r * 0.7).toFixed(2)} ${(cy - r * 0.15).toFixed(2)}A${(r * 0.75).toFixed(2)} ${(r * 0.75).toFixed(2)} 0 0 1 ${(cx + r * 0.1).toFixed(2)} ${(cy - r * 0.72).toFixed(2)}A${(r * 0.6).toFixed(2)} ${(r * 0.6).toFixed(2)} 0 0 0 ${(cx - r * 0.7).toFixed(2)} ${(cy - r * 0.15).toFixed(2)}Z" fill="#ffffff" fill-opacity="0.45"/>`;

  // Nine-slice capsule rim: rounded chrome double line with a gloss edge.
  const rim = svg(60, 60, `<rect x="1.5" y="1.5" width="57" height="57" rx="13" fill="none" stroke="${chrome}" stroke-width="2.4"/><rect x="5" y="5" width="50" height="50" rx="10" fill="none" stroke="${chromeDim}" stroke-width="1"/><path d="M14 2.6H46" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.2" stroke-linecap="round"/>`);
  const frame = (px = 14) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // Radar screen: a faint green grid and range rings.
  const grid = svg(40, 40, `<path d="M0 0.5H40M0.5 0V40" stroke="${radar}" stroke-opacity="0.09"/>`);
  const rings = svg(400, 400, `<g fill="none" stroke="${radar}" stroke-opacity="0.12"><circle cx="200" cy="200" r="60"/><circle cx="200" cy="200" r="120"/><circle cx="200" cy="200" r="180"/></g><path d="M200 0V400M0 200H400" stroke="${radar}" stroke-opacity="0.08"/><circle cx="262" cy="146" r="4" fill="${gold}" fill-opacity="0.5"/><circle cx="126" cy="252" r="3" fill="${gold}" fill-opacity="0.35"/>`);

  const crestSmall = svg(28, 28, `${orbDefs}${orb(14, 14, 12, 1, 0.34)}`);
  const crestBig = svg(84, 84, `${orbDefs}<defs><radialGradient id="a"><stop offset="0.5" stop-color="${gold}" stop-opacity="0.6"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient></defs><circle cx="42" cy="42" r="42" fill="url(#a)"/>${orb(42, 42, 26, 4, 0.2)}`);
  const lifeCap = svg(26, 26, `${orbDefs}${orb(13, 13, 11.5, 2, 0.26)}`);
  const phaseOrb = svg(45, 45, `${orbDefs}${orb(22.5, 22.5, 21.5, 0)}`);
  const phaseStars = (n) => {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = Math.PI / 2 + ((i - (n - 1) / 2) * Math.PI) / 9;
      d += starPath(22.5 + Math.cos(a) * 18.6, 22.5 + Math.sin(a) * 18.6, 2.5);
    }
    return svg(45, 45, `<path d="${d}" fill="${red}" stroke="${mix(red, ink, 0.4)}" stroke-width="0.5"/>`);
  };
  const phaseIds = ['dp', 'sp', 'm1', 'bp', 'm2', 'ep'];

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${ink}, 0 0 8px ${ink} !important;`;
  const shellBg = (lift = 0) => `linear-gradient(180deg, ${alpha('#ffffff', 0.1 + lift)}, ${alpha('#ffffff', 0.02)} 38%, transparent 40%), radial-gradient(ellipse 80% 90% at 50% 110%, ${alpha(amber, 0.12 + lift)}, transparent 70%), linear-gradient(180deg, ${shell}, ${shellDeep})`;

  // Pop-up buttons: an amber glass capsule (OK/Yes) and an indigo capsule (No/Cancel), both glossy.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="29" fill="${chrome}"/><rect x="9" y="13" width="${bw - 6}" height="52.5" rx="26" fill="url(#g)" stroke="${ink}" stroke-opacity="0.5" stroke-width="1"/><rect x="18" y="16" width="${bw - 24}" height="16" rx="8" fill="#ffffff" fill-opacity="0.3"/><text x="${w / 2}" y="41" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="800" font-size="26" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: mix(gold, amber, 0.35), bot: mix(amber, red, 0.2), text: t.accentText };
  const popSecondary = { top: mix(shell, t.border, 0.5), bot: shellDeep, text: t.text };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.6)}) !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [rim, crestSmall, grid, crestBig, lifeCap, rings, phaseOrb].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  const phases = phaseIds.map((id, i) => `--dbtc-p${id}: ${svgUrl(phaseStars(i + 1))};`).join(' ');
  return `
html body { ${vars} ${phases} }
/* Menu tiles: glossy capsule shells in a chrome rim, a one-star orb on top. */
${SEL.tile} { background: ${shellBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 14px stretch !important; box-shadow: inset 0 -12px 18px -8px ${alpha('#000000', 0.5)}, 0 10px 22px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 14px); top: -14px; width: 28px; height: 28px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 0 6px ${alpha(gold, 0.7)}); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${shellBg(0.1)} !important; box-shadow: inset 0 0 24px ${alpha(gold, 0.3)}, 0 0 20px -4px ${alpha(gold, 0.7)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: small indigo capsules with a chrome edge and gloss. */
${SEL.button} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.14)}, transparent 45%), linear-gradient(180deg, ${mix(shell, t.border, 0.4)}, ${shellDeep}) !important; border-color: ${chromeDim} !important; color: ${t.text} !important; border-radius: 999px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.3)}, 0 2px 5px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.18)}, transparent 45%), linear-gradient(180deg, ${mix(shell, amber, 0.3)}, ${shellDeep}) !important; border-color: ${gold} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.4)}, 0 0 12px -2px ${alpha(gold, 0.8)} !important; }
${SEL.buttonDown} { background: ${shellDeep} !important; border-color: ${amber} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a radar screen in a chrome casing, the four-star orb glowing on top. */
${SEL.dialog} { background: var(--dbtc-u5) center / 400px 400px no-repeat, var(--dbtc-u2), radial-gradient(ellipse 80% 70% at 50% 40%, ${mix(shell, radar, 0.06)}, ${shellDeep}) !important; border-radius: 16px !important; box-shadow: 0 0 0 2px ${chromeDim}, 0 0 0 6px ${chrome}, 0 0 0 7px ${ink}, 0 0 30px -4px ${alpha(gold, 0.35)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(16)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 42px); top: -52px; right: auto; bottom: auto; width: 84px; height: 84px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; }
${SEL.dialogTitle} { ${label} }

/* Chat: a capsule header with a chrome edge, radar body. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.14)}, transparent 50%), linear-gradient(180deg, ${mix(shell, t.border, 0.5)}, ${shellDeep}) !important; box-shadow: inset 0 -2px 0 ${chrome}, inset 0 -3px 0 ${ink} !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${shell}, ${mix(shell, t.bg, 0.6)}) !important; box-shadow: inset 2px 0 0 ${chromeDim}, inset -2px 0 0 ${chromeDim}, inset 0 -2px 0 ${chromeDim} !important; }

/* Duel: smooth chrome-cased ki gauges led by an orb; the phases are the orbs, one to six stars. */
${SEL.life} { border-color: ${chrome} !important; border-radius: 999px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 3px ${chromeDim}, 0 0 14px -2px ${alpha(gold, 0.5)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 999px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 45%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.72)}, ${mix(t.self, t.bg, 0.45)}, ${mix(mix(t.self, gold, 0.4), t.bg, 0.25)}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 45%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.5)}, ${t.opp}, ${mix(t.opp, '#ffffff', 0.4)}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -22px; top: 0; width: 26px; height: 26px; pointer-events: none; background: var(--dbtc-u4) center / contain no-repeat; filter: drop-shadow(0 0 5px ${alpha(gold, 0.7)}); }
${sel(['#duel .lifepoints .life_txt'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: conic-gradient(from 200deg, ${chrome}, ${chromeDim}, ${mix(chrome, '#ffffff', 0.5)}, ${chromeDim}, ${chrome}) !important; box-shadow: 0 0 0 1px ${ink}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${shellDeep} !important; }
${phaseIds.map((id) => `${sel([`#duel #${id}.phase .phase_inner.red`, `#duel #${id}.phase .phase_inner.blue`])} { background: var(--dbtc-p${id}) center / 100% 100%, radial-gradient(circle at 50% 38%, ${mix(shell, t.border, 0.35)}, ${shellDeep} 72%) !important; box-shadow: inset 0 0 0 1.5px ${alpha(amber, 0.85)}; }
${sel([`#duel #${id}.phase.active .phase_inner.red`])} { background: var(--dbtc-p${id}) center / 100% 100%, var(--dbtc-u6) center / 100% 100% !important; box-shadow: 0 0 0 3px ${gold}, 0 0 0 5px ${t.self}, 0 0 24px 4px ${alpha(gold, 0.9)}; }
${sel([`#duel #${id}.phase.active .phase_inner.blue`])} { background: var(--dbtc-p${id}) center / 100% 100%, var(--dbtc-u6) center / 100% 100% !important; box-shadow: 0 0 0 3px ${gold}, 0 0 0 5px ${t.opp}, 0 0 24px 4px ${alpha(gold, 0.9)}; }`).join('\n')}
${sel(['#duel .phase span'])} { color: #ffffff !important; text-shadow: 0 0 2px #000000, 0 1px 3px #000000, 0 0 6px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${shell}, ${mix(shell, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 2px ${chromeDim}, inset 0 0 0 4px ${alpha(ink, 0.6)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${chrome}, 0 0 0 4px ${shellDeep}, 0 0 12px -2px ${alpha(gold, 0.5)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${chrome}, ${chromeDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.14)}, transparent 45%), linear-gradient(180deg, ${mix(shell, t.border, 0.4)}, ${shellDeep}) !important; }

/* Duel room: capsule panels with radar grids; the Genesys ring keeps the palette. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(shell, 0.8)}, ${alpha(t.bg, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${chrome}, ${chromeDim} 35%, ${chrome} 60%, ${chromeDim}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${shellDeep} !important; box-shadow: 0 0 0 0.35em ${shellDeep} !important; border-radius: 8px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.14)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(gold, 0.36)}, ${alpha(gold, 0.1)}) !important; }

/* Deck constructor: capsule panels with a radar grid. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${shell}, ${mix(shell, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 2px ${chromeDim}, inset 0 1px 0 4px ${alpha(ink, 0.5)} !important; border-radius: 10px !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(14)} }

/* Settings panels: the capsule rim. */
${settingsPanels} { border-color: ${chromeDim} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(shell, 0.85)}, ${alpha(t.bg, 0.85)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: hot gold with a ki glow. */
${titles} { color: ${gold} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${mix(amber, ink, 0.4)}, 0 0 16px ${alpha(amber, 0.55)} !important; }

/* Text fields: dark screens with a chrome lip, gold focus. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${chromeDim} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(chrome, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${gold} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(gold, 0.6)} !important; }

/* Scrollbars: amber glass rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${mix(amber, red, 0.3)}, ${gold}, ${mix(amber, red, 0.3)}) !important; border-radius: 999px !important; }

/* Links: gold, darker on hover. */
${sel(['#content a:hover', '#content a:active', '#content .status .reply_btn:hover', '#content #post_status_btn:hover', '#content #logged_in .logout_btn:hover', '#content #logged_in .switch_account_btn:hover'])} { color: ${mix(t.link, t.bg, 0.22)} !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
