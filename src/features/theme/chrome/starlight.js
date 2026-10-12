// starlight: a Starlight Rare in your hands. Every surface is foil stock:
// fine horizontal hairlines, a prismatic rainbow rim (rose, gold, mint, cyan,
// blue, violet: six tokens round the wheel) with four-point star glints at the
// corners, titles in silver name foil. The rainbow stays on rims, strips and
// discs; text always sits on calm stock. `starlightChrome(t, kit, light)`
// draws the dark (navy) or light (silver-white) cut. (t, kit) -> CSS string.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export const starlightChrome = (t, { SEL, sel, svg, svgUrl, alpha }, light) => {
  const prism = [t.danger, t.warning, t.success, t.accent, t.link, t.accent2].map((c) => (light ? mix(c, '#ffffff', 0.42) : mix(c, t.text, 0.22)));
  const silverHi = light ? '#ffffff' : t.text;
  const silver = light ? mix(t.border, t.text, 0.25) : mix(t.text, t.muted, 0.45);
  const silverDim = light ? t.border : mix(t.muted, t.border, 0.5);
  const ink = light ? t.text : '#000000';
  const shade = (a) => alpha(ink, light ? a * 0.32 : a);
  const stock = light ? t.raised : t.surface;
  const stockLo = light ? mix(t.surface, t.bg, 0.6) : mix(t.surface, t.bg, 0.55);

  // The foil rim: silver catching into the full prism and back to silver.
  const rim = (deg = 115) => `linear-gradient(${deg}deg, ${silver} 0%, ${prism.map((c, i) => `${c} ${12 + i * 14}%`).join(', ')}, ${silver} 100%)`;
  // Faint prism sheen for wide panels (low alpha: text stays at 4.5:1 on it).
  const sheen = (a, deg = 115) => `linear-gradient(${deg}deg, transparent 30%, ${prism.map((c, i) => `${alpha(c, a)} ${38 + i * 6}%`).join(', ')}, transparent 76%)`;
  // The same prism as a narrow band along the top-left edge (pop-ups: none of it behind the text).
  const edgeSheen = (a) => `linear-gradient(160deg, ${prism.map((c, i) => `${alpha(c, a)} ${i * 2.4}%`).join(', ')}, transparent 16%)`;
  // A holo catch in a corner: prism rings fading out from the top-right.
  const cornerCatch = (a) => `radial-gradient(ellipse 70% 55% at 100% 0%, transparent 8%, ${prism.map((c, i) => `${alpha(c, a)} ${18 + i * 7}%`).join(', ')}, transparent 66%)`;
  // Starlight hairlines: the horizontal line pattern of the foil.
  const lines = (a) => `repeating-linear-gradient(180deg, ${alpha(light ? t.text : t.text, a)} 0 1px, transparent 1px 4px)`;
  // Light cut: pearlescent stock, a very pale iridescent swirl (lavender, pink, mint, sky).
  const pearlC = [t.accent, t.accent2, t.success, t.link].map((c) => mix(c, '#ffffff', 0.88));
  const pearl = `conic-gradient(from 200deg at 78% 18%, ${pearlC.join(', ')}, ${pearlC[0]})`;
  // Panel stock: navy in the dark cut, pearl in the light one.
  const stockBg = (a = 1) => (light ? `linear-gradient(180deg, ${alpha('#ffffff', 0.35)}, transparent 60%), ${pearl}` : `linear-gradient(180deg, ${alpha(stock, a)}, ${alpha(stockLo, a)})`);
  const prismStrip = (deg = 90) => `linear-gradient(${deg}deg, ${prism.join(', ')}, ${prism[0]})`;

  // Four-point star glint (Starlight sparkle), with a soft shaded edge.
  const glintPath = (c, r, k = 0.16) => `M${c} ${c - r}Q${c + r * k} ${c - r * k} ${c + r} ${c}Q${c + r * k} ${c + r * k} ${c} ${c + r}Q${c - r * k} ${c + r * k} ${c - r} ${c}Q${c - r * k} ${c - r * k} ${c} ${c - r}Z`;
  const glint = svg(28, 28, `<defs><radialGradient id="h"><stop offset="0" stop-color="${light ? t.accent : '#ffffff'}" stop-opacity="0.45"/><stop offset="1" stop-color="${light ? t.accent : '#ffffff'}" stop-opacity="0"/></radialGradient></defs><circle cx="14" cy="14" r="9" fill="url(#h)"/><path d="${glintPath(14, 13)}" fill="${shade(0.55)}" transform="translate(0.8 1.2)"/><path d="${glintPath(14, 13)}" fill="${light ? t.accent : silverHi}"/><path d="${glintPath(14, 6, 0.25)}" fill="${light ? '#ffffff' : '#ffffff'}"/>`);

  // Holo disc for the phases: concentric foil rings over the prism.
  // Resting discs carry the rings; the active one is a clean lit disc with only the sparkle.
  const holo = (on) => svg(45, 45, on
    ? `<path d="${glintPath(22.5, 5)}" transform="translate(13 -13)" fill="${silverHi}" fill-opacity="0.7"/>`
    : `<g fill="none" stroke="${silverHi}" stroke-opacity="${light ? 0.55 : 0.28}" stroke-width="0.7"><circle cx="22.5" cy="22.5" r="20.5"/><circle cx="22.5" cy="22.5" r="16"/><circle cx="22.5" cy="22.5" r="11.5" stroke-dasharray="1.5 2.5"/></g>`);

  const label = light
    ? `color: ${t.text} !important; text-shadow: 0 1px 0 ${alpha('#ffffff', 0.9)} !important;`
    : `color: ${t.text} !important; text-shadow: 0 1px 2px #000000, 0 0 10px ${alpha(t.bg, 0.9)} !important;`;
  const tileBg = (s) => `${lines(light ? 0.035 : 0.045)}, ${sheen(s)}, ${light ? stockBg() : `linear-gradient(180deg, ${t.raised}, ${stockLo})`}`;
  const foilRim = (w) => `border-style: solid !important; border-image: ${rim()} 1 / ${w}px !important;`;

  // Silver name foil for headings: clipped gradient text, no text-shadow
  // (it would paint over the clipped fill); a drop-shadow gives the lift.
  const nameFoil = light
    ? `background: linear-gradient(180deg, ${t.text} 0%, ${mix(t.text, t.accent, 0.55)} 48%, ${t.text} 52%, ${mix(t.text, t.accent2, 0.4)} 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; filter: drop-shadow(0 1px 0 #ffffff);`
    : `background: linear-gradient(180deg, #ffffff 0%, ${mix(t.text, t.muted, 0.15)} 46%, ${mix(t.muted, t.accent2, 0.25)} 54%, #ffffff 100%) !important; -webkit-background-clip: text !important; background-clip: text !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; filter: drop-shadow(0 1px 1px #000000) drop-shadow(0 0 8px ${alpha(t.accent2, 0.35)});`;

  // Pop-up buttons (DuelingBook's OK/Yes/No/Cancel <img>s) as foil plates.
  const popBtn = (txt, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    const stops = [silver, ...prism, silver].map((col, i) => `<stop offset="${Math.round((i / 7) * 100)}%" stop-color="${col}"/>`).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient><clipPath id="c"><rect x="6" y="10" width="${bw}" height="58.5" rx="5"/></clipPath><pattern id="l" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 .5H4" stroke="${c.line}" stroke-opacity="${c.lineO}"/></pattern></defs><rect x="6" y="10" width="${bw}" height="58.5" rx="5" fill="url(#g)"/><rect x="6" y="10" width="${bw}" height="58.5" rx="5" fill="url(#l)"/><path d="M6 ${10 + 58.5 * 0.55}L${w * 0.42} 10H${w * 0.6}L${w * 0.18} 68.5H6Z" clip-path="url(#c)" fill="#ffffff" fill-opacity="${c.sheen}"/><rect x="6" y="10" width="${bw}" height="58.5" rx="5" fill="none" stroke="${c.rim || 'url(#p)'}" stroke-width="3"/><rect x="10.5" y="14.5" width="${bw - 9}" height="49.5" rx="2.5" fill="none" stroke="${c.inner}" stroke-opacity="0.6" stroke-width="1"/><path d="${glintPath(0, 9)}" transform="translate(${w - 12} 12)" fill="${c.glint}"/><text x="${w / 2}" y="40.5" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="700" font-size="26" fill="${c.text}">${txt}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, txt, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(txt, wide, c))} !important; filter: drop-shadow(0 3px 4px ${shade(0.6)}) !important; }`).join('\n');
  // Primary: a prism-rimmed foil plate. Secondary: plain stock with a silver rim.
  const popPrimary = light
    ? { top: mix(t.accent, '#ffffff', 0.08), bot: mix(t.accent, t.text, 0.3), line: '#ffffff', lineO: 0.12, sheen: 0.14, inner: '#ffffff', glint: '#ffffff', text: '#ffffff' }
    : { top: mix(t.raised, t.accent2, 0.22), bot: mix(t.bg, t.accent2, 0.1), line: t.text, lineO: 0.07, sheen: 0.12, inner: t.accent, glint: '#ffffff', text: t.text };
  const popSecondary = light
    ? { top: '#ffffff', bot: mix(t.surface, t.bg, 0.7), line: t.text, lineO: 0.05, sheen: 0.5, inner: t.border, glint: t.accent, text: t.text, rim: mix(t.accent, t.border, 0.3) }
    : { top: mix(t.raised, t.border, 0.15), bot: t.bg, line: t.text, lineO: 0.05, sheen: 0.05, inner: silverDim, glint: silver, text: t.text, rim: silver };

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#deck_constructor #search .title_txt']);
  const plates = sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl']);
  const panelInset = `inset 0 0 0 1px ${silverDim}, inset 0 0 0 4px ${alpha(stockLo, 0.9)}, inset 0 0 0 5px ${alpha(silver, light ? 0.6 : 0.3)}`;

  const u0 = svgUrl(glint);
  const u1 = svgUrl(holo(false));
  const u2 = svgUrl(holo(true));
  return `
html body { --dbtc-u0: ${u0}; --dbtc-u1: ${u1}; --dbtc-u2: ${u2}; --dbtc-rim: ${rim()}; --dbtc-rim2: ${rim(65)}; }
/* Menu tiles: foil stock with hairlines, a prism rim and two corner glints. */
${SEL.tile} { background: ${tileBg(light ? 0.07 : 0.1)} !important; ${foilRim(2)} box-shadow: inset 0 1px 0 ${alpha('#ffffff', light ? 0.9 : 0.14)}, inset 0 0 0 1px ${alpha(light ? t.border : t.bg, 0.7)}, 0 12px 24px -12px ${shade(0.85)} !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: -13px; top: -13px; width: 26px; height: 26px; pointer-events: none; background: var(--dbtc-u0) left top / 26px 26px no-repeat; }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: ${tileBg(light ? 0.16 : 0.22)} !important; border-image: var(--dbtc-rim2) 1 / 2px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', light ? 0.9 : 0.2)}, 0 0 18px -4px ${alpha(light ? t.accent : t.accent2, 0.6)}, 0 14px 26px -12px ${shade(0.85)} !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: foil stock with a prism rim; hover catches the light. */
${SEL.button} { background: ${lines(light ? 0.03 : 0.04)}, ${light ? stockBg() : `linear-gradient(180deg, ${mix(t.raised, t.border, 0.2)}, ${t.surface})`} !important; border-color: ${light ? mix(t.accent, t.border, 0.25) : silverDim} !important; border-image: ${light ? 'none' : 'var(--dbtc-rim) 1'} !important; color: ${t.text} !important; border-radius: 3px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', light ? 0.9 : 0.16)}, 0 2px 5px -2px ${shade(0.8)} !important; }
${SEL.buttonHover} { background: ${lines(light ? 0.03 : 0.04)}, ${sheen(light ? 0.22 : 0.2, 100)}, linear-gradient(180deg, ${light ? '#ffffff' : mix(t.raised, t.border, 0.35)}, ${light ? t.surface : t.raised}) !important; border-image: ${light ? 'none' : 'var(--dbtc-rim2) 1'} !important; border-color: ${t.accent} !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', light ? 0.9 : 0.25)}, 0 0 10px -2px ${alpha(light ? t.accent : t.accent, 0.6)} !important; }
${SEL.buttonDown} { background: ${light ? mix(t.surface, t.bg, 0.8) : t.bg} !important; box-shadow: inset 0 2px 5px ${shade(0.9)} !important; }
${sel(['#content .button.disabled'])} { border-image: none !important; border-color: ${silverDim} !important; opacity: 0.6; }

/* Pop-ups: a foil card. Stock with hairlines and a sheen in the top band, an inner prism frame, a star glint on the corner. */
${SEL.dialog} { background: ${lines(light ? 0.03 : 0.04)}, ${cornerCatch(light ? 0.16 : 0.14)}, ${light ? `${edgeSheen(0.16)}, ${stockBg()}` : `linear-gradient(180deg, ${mix(t.surface, t.raised, 0.4)}, ${stockLo})`} !important; border-radius: 8px !important; box-shadow: 0 0 0 1px ${silverDim}, 0 0 0 3px ${light ? t.raised : t.bg}, 0 0 0 4px ${alpha(silver, 0.7)}, 0 24px 60px -12px ${shade(0.9)} !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 7px; top: 7px; right: 7px; bottom: 7px; width: auto; height: auto; pointer-events: none; z-index: 0; border: 2px solid transparent; border-image: var(--dbtc-rim) 1; border-radius: 0; background: none; transform: none; opacity: ${light ? 0.85 : 0.75}; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; right: -14px; top: -14px; left: auto; bottom: auto; width: 34px; height: 34px; pointer-events: none; z-index: 1; background: var(--dbtc-u0) center / contain no-repeat; transform: none; }
${SEL.dialogTitle} { ${nameFoil} }

/* Chat: a stock header with a prism strip under it. */
${SEL.chatTop} { background: ${prismStrip()} left bottom / 100% 2px no-repeat, ${lines(light ? 0.03 : 0.045)}, linear-gradient(180deg, ${light ? '#ffffff' : mix(t.raised, t.border, 0.2)}, ${light ? t.surface : t.surface}) !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', light ? 0.9 : 0.14)} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${t.text} !important; }
${SEL.chat}, ${sel(['#chats .chat .cout_txt', '#chats .chat .list'])} { background: ${lines(light ? 0.025 : 0.035)}, ${cornerCatch(light ? 0.1 : 0.08)}, ${stockBg()} !important; }
${on(sel(['#chats .chat']), 'before')} { content: ""; position: absolute; left: -3px; top: -3px; right: -3px; bottom: -3px; pointer-events: none; z-index: 60; border: 3px solid transparent; border-image: var(--dbtc-rim) 1; }
${on(sel(['#chats .chat']), 'after')} { content: ""; position: absolute; right: -14px; bottom: -14px; width: 28px; height: 28px; pointer-events: none; z-index: 61; background: var(--dbtc-u0) center / contain no-repeat; }

/* Duel: life bars in a prism rim with a hairline sheen; holo-disc phases. */
${SEL.life} { border-color: ${silver} !important; border-image: ${rim(90)} 1 !important; border-radius: 3px !important; box-shadow: 0 0 0 1px ${alpha(light ? t.border : t.bg, 0.9)}, 0 4px 10px -3px ${shade(0.8)} !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.32)}, transparent 50%), ${lines(0.1)}, linear-gradient(90deg, ${mix(t.self, light ? t.text : t.bg, 0.45)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.32)}, transparent 50%), ${lines(0.1)}, linear-gradient(90deg, ${mix(t.opp, light ? t.text : t.bg, 0.5)}, ${mix(t.opp, light ? t.text : t.bg, 0.22)}) !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp}, ${sel(['#duel .lifepoints .black_bar'])} { border-radius: 3px !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: ${lines(light ? 0.04 : 0.05)}, linear-gradient(180deg, ${light ? mix(t.border, t.bg, 0.38) : t.bg}, ${light ? mix(t.border, t.bg, 0.5) : mix(t.bg, t.surface, 0.5)}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -15px; top: 50%; width: 12px; height: 12px; margin-top: -6px; pointer-events: none; background: var(--dbtc-u0) center / contain no-repeat; z-index: 2; }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px ${light ? t.text : '#000000'}, 0 0 5px ${light ? t.text : '#000000'} !important; }
${SEL.phase} { background: conic-gradient(from 210deg, ${prism.join(', ')}, ${prism[0]}) !important; box-shadow: 0 0 0 1px ${alpha(light ? t.border : t.bg, 0.9)}, 0 4px 10px -2px ${shade(0.8)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
/* In a duel the great foil card shrinks into the right gutter past the chat column, whole and clear of the viewport edge;
   on the main menu it would sit behind the feed's timestamps, so it is gone there. */
html body:has(#duel:not([style*="none"])) #dbte-skin-fx .dbtefx-sl-card { transform: translate(916px, 262px) scale(0.42); }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-sl-card { display: none; }
${sel(['#duel .phase .background .background_inner'])} { background: ${light ? t.raised : t.bg} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u1) center / 100% 100%, ${lines(light ? 0.035 : 0.05)}, radial-gradient(circle at 35% 30%, ${light ? '#ffffff' : mix(t.raised, t.border, 0.3)}, ${light ? mix(t.surface, t.bg, 0.7) : t.surface}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u2) center / 100% 100%, radial-gradient(circle at 35% 30%, ${light ? mix(t.self, '#ffffff', 0.25) : mix(t.self, t.bg, 0.45)}, ${mix(t.self, light ? t.text : t.bg, light ? 0.4 : 0.65)}) !important; box-shadow: 0 0 12px 3px ${alpha(light ? t.self : '#ffffff', 0.6)}, 0 0 22px 4px ${alpha(t.self, 0.85)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u2) center / 100% 100%, radial-gradient(circle at 35% 30%, ${light ? mix(t.opp, '#ffffff', 0.25) : mix(t.opp, t.bg, 0.45)}, ${mix(t.opp, light ? t.text : t.bg, light ? 0.4 : 0.65)}) !important; box-shadow: 0 0 12px 3px ${alpha(light ? t.opp : '#ffffff', 0.6)}, 0 0 22px 4px ${alpha(t.opp, 0.85)}; }
${sel(['#duel .phase.active .background'])} { box-shadow: 0 0 0 2px #ffffff, 0 0 0 3px ${alpha(light ? t.text : t.bg, 0.6)}, 0 4px 10px -2px ${shade(0.8)} !important; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: ${light ? `0 1px 0 #ffffff` : `0 1px 2px #000000`} !important; }
${sel(['#duel .phase.active span', '#duel .phase.active:has(.phase_inner.red) span', '#duel .phase.active:has(.phase_inner.blue) span'])} { color: #ffffff !important; text-shadow: 0 1px 2px ${light ? t.text : '#000000'}, 0 0 4px ${light ? t.text : '#000000'} !important; }
${SEL.duelLog} { background: ${lines(light ? 0.025 : 0.035)}, ${stockBg()} !important; box-shadow: ${panelInset} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { border-image: var(--dbtc-rim) 1 !important; box-shadow: 0 0 0 2px ${light ? t.raised : t.bg}, 0 0 0 3px ${alpha(silver, 0.6)}, 0 8px 18px -8px ${shade(0.8)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${rim(90)} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${lines(light ? 0.03 : 0.05)}, linear-gradient(180deg, ${light ? '#ffffff' : t.raised}, ${light ? t.surface : t.bg}) !important; }

/* Duel room: prism rims around stock panels; labels sit on plates. */
${lobbyBorders} { background: ${lines(light ? 0.025 : 0.035)}, ${light ? stockBg() : `linear-gradient(180deg, ${alpha(stock, 0.8)}, ${alpha(stockLo, 0.9)})`} !important; box-shadow: 0 10px 26px -12px ${shade(0.8)}; }
${on(lobbyBorders, 'before')} { background: var(--dbtc-rim) !important; filter: none !important; }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${stock} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${plates} { background: ${stock} !important; box-shadow: 0 0 0 0.35em ${stock} !important; border-radius: 4px !important; }
${sel(['#duel_room .duelbutton .game_type'])} { color: ${light ? mix(t.accent, t.text, 0.35) : t.warning} !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(t.accent, light ? 0.1 : 0.12)}, transparent 40%), ${light ? t.raised : t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${sheen(light ? 0.22 : 0.2, 90)}, ${light ? t.raised : t.raised} !important; }

/* Deck constructor: panels as foil card stock with a silver keyline. */
${deckPanels} { background: ${lines(light ? 0.025 : 0.035)}, ${stockBg()} !important; box-shadow: ${panelInset} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2px; pointer-events: none; background: ${prismStrip()}; }

/* Settings panels: the same stock and a prism rim. */
${SEL.settingsPanel} { border-color: ${silverDim} !important; background: ${lines(light ? 0.025 : 0.035)}, ${stockBg(0.93)} !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; border: 2px solid transparent; border-image: var(--dbtc-rim) 1; opacity: 0.8; }

/* Titles: silver name foil. */
${titles} { ${nameFoil} }
${sel(['#content .arial_black2'])} { color: ${light ? t.text : silverHi} !important; }

/* Text fields: calm wells with a silver lip; prism focus. */
${SEL.field} { background-color: ${light ? '#ffffff' : mix(t.bg, t.surface, 0.5)} !important; border-color: ${silverDim} !important; box-shadow: inset 0 2px 4px ${shade(0.7)}, 0 1px 0 ${alpha('#ffffff', light ? 0.9 : 0.12)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${t.accent} !important; box-shadow: inset 0 2px 4px ${shade(0.7)}, 0 0 0 3px ${alpha(t.accent2, 0.25)}, 0 0 10px ${alpha(t.accent, 0.5)} !important; }
${sel(['#content .combobox'])} { border-color: ${silverDim} !important; }

/* Scrollbars: prism rods. */
${sel(['#content .os-scrollbar-handle'])} { background: ${prismStrip(180)} !important; border-radius: 2px !important; opacity: 0.85; }

/* Pop-up buttons in foil. */
${popCss(popPrimary, popSecondary)}
`;
};

export default (t, kit) => starlightChrome(t, kit, false);
