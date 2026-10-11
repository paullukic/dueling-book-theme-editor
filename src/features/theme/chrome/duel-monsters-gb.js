// duel-monsters-gb: the Game Boy's four-shade LCD. Every surface is an LCD
// window: a two-pixel ink outline with stepped corners, a thin inner rule and
// the faint pixel grid; selection is the handheld's blinking arrow cursor or
// an inverted (ink) bar; numbers and pop-up buttons are set in a pixel font.
// No glow, no blur, no gradients: four flat shades only.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';
import { pxText, textWidth } from '../scenes/pixel-kit.js';
import { PIXEL_DIGITS } from './pixel-font.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const ink = t.text;
  const dark = t.muted;
  const light = t.raised;
  const pale = t.surface;

  // Stepped-corner ring of thickness k at inset i inside an s x s box (pixel units).
  const ring = (s, i, k, c) => {
    const a = i;
    const b = s - i;
    const outer = `M${a + 1} ${a}H${b - 1}V${a + 1}H${b}V${b - 1}H${b - 1}V${b}H${a + 1}V${b - 1}H${a}V${a + 1}H${a + 1}Z`;
    const p = i + k;
    const q = s - i - k;
    const inner = `M${p} ${p}H${q}V${q}H${p}Z`;
    return `<path d="${outer}${inner}" fill="${c}" fill-rule="evenodd"/>`;
  };
  const crisp = (w, h, body) => svg(w, h, `<g shape-rendering="crispEdges">${body}</g>`);
  // LCD window frame (nine-slice, 12px art, 4px slice): ink outline, pale gap, dark rule.
  const frameSvg = crisp(12, 12, `${ring(12, 0, 2, ink)}${ring(12, 3, 1, dark)}`);
  const frame = (px = 8) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 4 / ${px}px stretch; box-sizing: border-box;`;
  // The LCD pixel grid.
  const grid = svg(4, 4, `<path d="M0 3.5H4M3.5 0V4" stroke="${ink}" stroke-opacity="0.06"/>`);
  // The handheld's menu cursor: a solid right-pointing arrow in pixels.
  const arrow = crisp(6, 9, `<path d="M0 0h2v1h1v1h1v1h1v1h1v1h-1v1h-1v1h-1v1h-1v1h-2z" fill="${ink}"/>`);
  // Pixel heart-less "LP" chip for the life bar.
  const lpChip = crisp(15, 9, `<rect width="15" height="9" fill="${ink}"/><path d="${pxText('LP', 2, 1, 1)}" fill="${pale}"/>`);
  // Segmented LCD bar: one-pixel gaps every 6px.
  const segs = (c) => `repeating-linear-gradient(90deg, ${c} 0 5px, ${pale} 5px 6px)`;

  const label = `color: ${ink} !important; text-shadow: none !important;`;
  const flat = (bg = pale) => `var(--dbtc-u1), ${bg}`;

  // Pop-up buttons: LCD windows with pixel-font labels; OK/Yes inverted (ink), No/Cancel pale.
  const popBtn = (text, wide, primary) => {
    const w = wide ? 234.85 : 153.4;
    const h = wide ? 78.5 : 78.47;
    const p = 4;
    const tw = textWidth(text, p, true);
    const fg = primary ? pale : ink;
    const x0 = 8;
    const y0 = 9;
    const bw = w - 16;
    const bh = h - 18;
    const box = `M${x0 + p} ${y0}H${x0 + bw - p}V${y0 + p}H${x0 + bw}V${y0 + bh - p}H${x0 + bw - p}V${y0 + bh}H${x0 + p}V${y0 + bh - p}H${x0}V${y0 + p}H${x0 + p}Z`;
    const inset = `M${x0 + 3 * p} ${y0 + 2 * p}H${x0 + bw - 3 * p}V${y0 + 2 * p + 1.5}H${x0 + 3 * p}Z`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges"><path d="${box}" fill="${ink}"/>${primary ? '' : `<path d="M${x0 + 2 * p} ${y0 + 2 * p}H${x0 + bw - 2 * p}V${y0 + bh - 2 * p}H${x0 + 2 * p}Z" fill="${pale}"/>`}<path d="${inset}" fill="${primary ? dark : light}"/><path d="${pxText(text, (w - tw) / 2, (h - 7 * p) / 2, p, true)}" fill="${fg}"/>${primary ? `<path d="M${x0 + 3 * p} ${h / 2 - 2 * p}h${p}v${p}h${p}v${p}h${p}v${p}h${-p}v${p}h${-p}v${p}h${-p}z" fill="${fg}"/>` : ''}</svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = [['ok_btn', 'OK', true, false], ['yes_btn', 'YES', true, false], ['no_btn', 'NO', false, false], ['cancel_btn', 'CANCEL', false, true]]
    .map(([n, text, primary, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, primary))} !important; filter: none !important; }`).join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = SEL.settingsPanel;
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);
  const plate = `background: ${pale} !important; box-shadow: 0 0 0 .35em ${pale} !important; border-radius: 0 !important;`;

  // Everything pictorial is shown on the LCD: greyscale, multiplied into the green.
  const lcdIcons = ['refresh_btn', 'screenshot_btn', 'mute_btn', 'lookup', 'duel_btn', 'admin_btn', 'die_btn', 'coin_btn', 'sword', 'like_btn', 'dislike_btn', 'liked_by', 'play_btn', 'pause_btn', 'plus_btn', 'minus_btn', 'stats_teal', 'stats_red', 'key', 'hide', 'hand', 'next_sleeve_btn', 'prev_sleeve_btn', 'export_btn', 'blue_target', 'red_target', 'green_target', 'arrow'];
  const lcdImages = sel(['#content .avatar img.image', '#duel #field_spell_pic img', ...lcdIcons.map((n) => `img[src*="/svg/${n}"]`)]);
  // Avatar frame: an LCD window ring around the picture.
  const avatarFrame = crisp(64, 64, `${ring(64, 0, 4, ink)}${ring(64, 5, 2, dark)}`);
  const u0 = svgUrl(frameSvg);
  const u1 = svgUrl(grid);
  const u2 = svgUrl(arrow);
  const u3 = svgUrl(lpChip);
  const u4 = svgUrl(avatarFrame);
  return `
@font-face { font-family: "DBTE Pixel"; src: url(${PIXEL_DIGITS}) format("woff"); }
html body { ${[['u0', u0], ['u1', u1], ['u2', u2], ['u3', u3], ['u4', u4]].map(([k, v]) => `--dbtc-${k}: ${v};`).join(' ')} }
/* Menu tiles: LCD windows; the hovered one gets the blinking arrow cursor and an inverted bar. */
${SEL.tile} { background: ${flat()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 4 / 9px stretch !important; border-radius: 0 !important; box-shadow: 4px 4px 0 ${alpha(ink, 0.35)} !important; image-rendering: pixelated; }
${SEL.tileHover} { background: ${flat(light)} !important; box-shadow: 4px 4px 0 ${ink} !important; }
${on(SEL.tileHover, 'before')} { content: ""; position: absolute; left: -26px; top: calc(50% - 14px); width: 18px; height: 27px; pointer-events: none; background: var(--dbtc-u2) center / contain no-repeat; image-rendering: pixelated; animation: dbtc-gb-blink 0.8s steps(1, end) infinite; }
${SEL.tileLabel} { ${label} }

/* Buttons: small LCD windows; hover inverts to ink. */
${SEL.button}, ${sel(['#content #settings_content > div.button:not(.title_txt)'])} { background: ${flat()} !important; border-color: ${ink} !important; color: ${ink} !important; border-radius: 0 !important; box-shadow: inset 0 0 0 1px ${pale}, inset 0 0 0 2px ${dark}, 3px 3px 0 ${alpha(ink, 0.35)} !important; text-shadow: none !important; }
${SEL.buttonHover} { background: ${ink} !important; color: ${pale} !important; border-color: ${ink} !important; box-shadow: 3px 3px 0 ${dark} !important; }
${SEL.buttonDown} { background: ${dark} !important; color: ${pale} !important; box-shadow: none !important; }
${SEL.submit} { background: ${pale} !important; border: 2px solid ${ink} !important; color: ${ink} !important; border-radius: 0 !important; }

/* Pop-ups: the message window; the title sits on an inverted ink bar. */
${SEL.dialog} { background: ${flat()} !important; border-radius: 0 !important; box-shadow: 0 0 0 3px ${ink}, 0 0 0 5px ${pale}, 0 0 0 6px ${dark}, 8px 8px 0 6px ${alpha(ink, 0.3)} !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(8)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; right: 18px; bottom: 14px; left: auto; top: auto; width: 12px; height: 8px; pointer-events: none; z-index: 1; background: ${ink}; clip-path: polygon(0 0, 100% 0, 50% 100%); transform: none; animation: dbtc-gb-blink 1s steps(1, end) infinite; }
${SEL.dialogTitle} { color: ${pale} !important; background: ${ink} !important; box-shadow: 0 0 0 .3em ${ink} !important; text-shadow: none !important; }

/* Chat: an LCD window with an inverted header bar. */
${SEL.chatTop} { background: ${ink} !important; box-shadow: inset 0 -2px 0 ${dark}, inset 0 -4px 0 ${pale} !important; }
${sel(['#chats .chat .chat_top_bg span'])} { color: ${pale} !important; text-shadow: none !important; }
${SEL.chat} { background: ${flat()} !important; box-shadow: inset 3px 0 0 ${ink}, inset -3px 0 0 ${ink}, inset 0 -3px 0 ${ink} !important; }

/* Duel: segmented LCD life bars with an LP chip; square phase buttons, the active one inverted. */
${SEL.life} { border-color: ${ink} !important; border-radius: 0 !important; box-shadow: 0 0 0 2px ${pale}, 0 0 0 4px ${ink}, 4px 4px 0 4px ${alpha(ink, 0.3)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 0 !important; }
${SEL.lifeSelf} { background: ${segs(ink)} !important; }
${SEL.lifeOpp} { background: repeating-linear-gradient(90deg, ${ink} 0 3px, ${pale} 3px 6px) !important; }
${sel(['#duel .lifepoints .black_bar'])} { background: repeating-linear-gradient(90deg, ${dark} 0 5px, ${mix(dark, ink, 0.5)} 5px 6px) !important; }
${sel(['#duel .lifepoints'])} { --lp-hit: ${ink}; --lp-heal: ${dark}; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -36px; top: 2px; width: 30px; height: 18px; pointer-events: none; background: var(--dbtc-u3) center / contain no-repeat; image-rendering: pixelated; }
${sel(['#duel #lifepoints1 .life_txt', '#duel #lifepoints2 .life_txt'])} { font-family: "DBTE Pixel", "Lucida Console", monospace !important; font-weight: 400 !important; color: ${pale} !important; -webkit-text-fill-color: currentColor !important; text-shadow: 2px 2px 0 ${ink}, 2px 0 0 ${ink} !important; }
/* Our counters sit on their own plate: no extra ink blur behind the number. */
${on(sel(['#duel #lifepoints1.lifepoints .life_txt', '#duel #lifepoints2.lifepoints .life_txt']).replace(/html body/g, 'html:not([data-dbte-lpstyle]) body'), 'before')} { background: none !important; }
${SEL.phase} { background: ${ink} !important; border-radius: 0 !important; box-shadow: 3px 3px 0 ${alpha(ink, 0.35)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${pale} !important; border-radius: 0 !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: ${flat()} !important; border-radius: 0 !important; box-shadow: inset 0 0 0 2px ${dark} !important; }
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: ${ink} !important; box-shadow: inset 0 0 0 2px ${pale} !important; }
${sel(['#duel .phase span'])} { color: ${ink} !important; text-shadow: none !important; }
${sel(['#duel .phase.active span'])} { color: ${pale} !important; }
${SEL.duelLog} { background: ${flat()} !important; box-shadow: inset 0 0 0 3px ${ink}, inset 0 0 0 5px ${pale}, inset 0 0 0 6px ${dark} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { border-radius: 0 !important; box-shadow: 0 0 0 3px ${ink}, 0 0 0 5px ${pale}, 0 0 0 6px ${dark} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${ink} !important; border-radius: 0 !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: ${ink} !important; border-radius: 0 !important; }
${sel(['#duel #turn span', '#duel #start_turn span', '#duel #end_turn span'])} { color: ${pale} !important; text-shadow: none !important; }

/* Duel room: LCD windows. */
${lobbyBorders} { background: ${flat()} !important; box-shadow: 4px 4px 0 ${alpha(ink, 0.3)}; }
${on(lobbyBorders, 'before')} { background: ${ink} !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(9)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${pale} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; color: ${ink} !important; text-shadow: none !important; }
${sel(['#duel_room #decklist > span.arial_black2', '#duel_room #mode > span.arial_black2', '#duel_room #filter > span.arial_black2', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { ${plate} }
${sel(['#duel_room #yu'])} { filter: none !important; }
${sel(['#duel_room .duelbutton .background'])} { background: ${pale} !important; box-shadow: inset 0 0 0 2px ${ink} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: ${ink} !important; }

/* Deck constructor: LCD windows. */
${deckPanels} { background: ${flat()} !important; box-shadow: inset 0 0 0 3px ${ink}, inset 0 0 0 5px ${pale}, inset 0 0 0 6px ${dark} !important; }

/* Settings panels: LCD windows. */
${settingsPanels} { border-color: ${ink} !important; background: ${flat()} !important; border-radius: 0 !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(9)} }

/* Titles: solid ink, a pale plate so frame lines never run through them. */
${titles} { color: ${ink} !important; text-shadow: 3px 3px 0 ${alpha(dark, 0.45)} !important; }

/* Text fields: pale wells, ink rule, inverted caret line on focus. */
${SEL.field} { background-color: ${pale} !important; border-color: ${ink} !important; border-radius: 0 !important; box-shadow: inset 2px 2px 0 ${alpha(dark, 0.5)} !important; color: ${ink} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 2px solid ${ink} !important; box-shadow: inset 2px 2px 0 ${alpha(dark, 0.5)}, 3px 3px 0 ${dark} !important; }

/* Scrollbars: an ink block. */
${sel(['#content .os-scrollbar-handle'])} { background: ${ink} !important; border-radius: 0 !important; }
${sel(['#content .os-scrollbar-track'])} { background: ${alpha(dark, 0.25)} !important; border-radius: 0 !important; }

/* Pictures and DuelingBook's coloured icons go through the LCD; avatar frames become LCD windows. */
${lcdImages} { filter: grayscale(1) contrast(1.15) !important; mix-blend-mode: multiply !important; }
${sel(['#content .avatar'])} { background-color: ${pale} !important; }
${sel(['#front_page img', '#duel .duel_avatar img.image'])} { filter: grayscale(1) sepia(1) hue-rotate(38deg) saturate(1.7) brightness(0.8) contrast(1.1) !important; mix-blend-mode: normal !important; }
${sel(['img.avatar_frame', 'img[src*="/svg/avatar_red"]', 'img[src*="/svg/avatar_teal"]'])} { content: var(--dbtc-u4) !important; filter: none !important; image-rendering: pixelated; }
${sel(['#duel #turn .red', '#duel #turn .blue', '#duel #start_turn .red', '#duel #end_turn .red', '#duel #start_turn .blue', '#duel #end_turn .blue'])} { background: ${ink} !important; filter: none !important; border-radius: 0 !important; }
${sel(['#chats .chat input', '#deck_constructor #search input[type=text]'])} { border-color: ${ink} !important; outline-color: ${ink} !important; }

/* Pop-up buttons in pixel type. */
${popCss}

@keyframes dbtc-gb-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { ${on(SEL.tileHover, 'before')}, ${on(SEL.dialog, 'after')} { animation: none; } }
`;
};
