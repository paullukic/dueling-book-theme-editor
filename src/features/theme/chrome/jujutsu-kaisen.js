// jujutsu-kaisen: the Jujutsu High kit. Midnight-navy uniform cloth with the
// gold spiral button as the crest, sealing-talisman paper with red borders and
// stamped seals, raw brush-ink edges, cursed-energy violet glows, life bars as
// red and blue cursed energy and spiral buttons for the phases.
// (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const navy = mix(t.raised, t.opp, 0.08);
  const navyDeep = mix(t.surface, t.bg, 0.5);
  const ink = mix(t.bg, '#000000', 0.5);
  const gold = mix(t.warning, t.text, 0.2);
  const goldDim = mix(t.warning, t.bg, 0.5);
  const red = t.accent2;
  const cursed = t.accent;
  const paper = mix(t.text, t.warning, 0.1);
  const paperDim = mix(paper, t.muted, 0.35);

  // Ink speckle on the cloth, faint.
  const speckle = svg(90, 90, `<g fill="${t.text}" fill-opacity="0.04"><circle cx="14" cy="20" r="1.6"/><circle cx="60" cy="12" r="0.9"/><circle cx="72" cy="64" r="1.3"/><circle cx="30" cy="70" r="0.8"/><circle cx="48" cy="40" r="0.7"/></g>`);
  // Brush-ink frame: a rough double ink stroke with a red seal stamp in two corners.
  const rough = (o, w, op) => `M${o} ${o + 1}Q20 ${o - 0.6} 30 ${o + 0.4}T${60 - o} ${o}M${60 - o} ${o}Q${60 - o + 0.6} 20 ${60 - o - 0.4} 30T${60 - o} ${60 - o}M${60 - o} ${60 - o}Q40 ${60 - o + 0.6} 30 ${60 - o - 0.4}T${o} ${60 - o}M${o} ${60 - o}Q${o - 0.6} 40 ${o + 0.4} 30T${o + 1} ${o}`;
  const seal = (x, y) => `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="${red}"/><path d="M${x - 2.4} ${y - 1.5}h4.8M${x - 2.4} ${y + 1.2}h4.8M${x} ${y - 2.6}v5.4" stroke="${paper}" stroke-width="0.8"/>`;
  const frameSvg = svg(60, 60, `<path d="${rough(2.2, 2, 1)}" fill="none" stroke="${ink}" stroke-width="4.4" stroke-linecap="round"/><path d="${rough(2.4, 1, 1)}" fill="none" stroke="${mix(cursed, t.text, 0.2)}" stroke-width="1.6" stroke-linecap="round"/><path d="M6.5 6.5H53.5V53.5H6.5Z" fill="none" stroke="${alpha(cursed, 0.4)}" stroke-width="0.7"/><path d="M2 9L9 2M51 58L58 51" stroke="${red}" stroke-width="2.2" stroke-linecap="round"/>`);
  const frame = (px = 18) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px stretch; box-sizing: border-box;`;

  // The uniform's gold spiral button.
  const spiral = (cx, cy, r) => {
    let d = `M${cx} ${cy}`;
    for (let i = 1; i <= 26; i++) {
      const a = i * 0.55;
      const rr = (r * 0.78 * i) / 26;
      d += `L${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)}`;
    }
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#b)" stroke="${goldDim}" stroke-width="${(r * 0.1).toFixed(2)}"/><path d="${d}" fill="none" stroke="${mix(goldDim, t.bg, 0.3)}" stroke-width="${(r * 0.13).toFixed(2)}" stroke-linecap="round"/><circle cx="${cx - r * 0.35}" cy="${cy - r * 0.4}" r="${(r * 0.2).toFixed(2)}" fill="#ffffff" fill-opacity="0.5"/>`;
  };
  const btnDefs = `<defs><radialGradient id="b" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="${mix(gold, '#ffffff', 0.35)}"/><stop offset="0.7" stop-color="${gold}"/><stop offset="1" stop-color="${goldDim}"/></radialGradient></defs>`;
  const badge = svg(28, 28, `${btnDefs}${spiral(14, 14, 12)}`);
  // Pop-up crest: a broad tapered ink swash with red spatter, a sealing
  // talisman pinned across it, the spiral button as its seal.
  let glyph = '';
  [[-6, 22, 12, 1], [-3, 30, 7, 5], [-6, 38, 12, -1]].forEach(([x, y, w, c]) => { glyph += `M${100 + x} ${y}q${w / 2} ${c} ${w} 0`; });
  const crest = svg(200, 72, `${btnDefs}<path d="M8 40C40 26 90 30 120 31C150 32 176 26 194 30C170 38 140 44 110 44C70 44 40 46 8 40Z" fill="none" stroke="${cursed}" stroke-opacity="0.75" stroke-width="4" stroke-linejoin="round"/><path d="M8 40C40 26 90 30 120 31C150 32 176 26 194 30C170 38 140 44 110 44C70 44 40 46 8 40Z" fill="${ink}"/><path d="M14 39C48 30 92 33 120 33.5C148 34 170 30 186 31.5" fill="none" stroke="${cursed}" stroke-width="1.6" stroke-opacity="0.85" stroke-linecap="round"/><g fill="${red}"><circle cx="34" cy="26" r="3"/><circle cx="44" cy="22" r="1.6"/><circle cx="160" cy="48" r="2.6"/><circle cx="170" cy="52" r="1.4"/><circle cx="150" cy="22" r="1.8"/></g><path d="M86 4H114V68H86Z" fill="${paper}" stroke="${ink}" stroke-width="1.4"/><path d="M89 7H111V65H89Z" fill="none" stroke="${red}" stroke-width="1.4"/><path d="${glyph}" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M100 14V44" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>${spiral(100, 55, 7)}`);
  // A talisman strip edge for chat headers: paper with a red border.
  const strip = svg(60, 14, `<rect width="60" height="14" fill="${paper}"/><path d="M0 2H60M0 12H60" stroke="${red}" stroke-width="1.2"/><path d="M8 7q4 -2 8 0M28 5l3 4M44 7q3 2 7 -1" fill="none" stroke="${ink}" stroke-width="1.4" stroke-linecap="round"/>`);
  // Phase discs: a spiral button.
  const phaseBtn = svg(45, 45, (() => {
    let d = 'M22.5 22.5';
    for (let i = 1; i <= 26; i++) {
      const a = i * 0.55;
      const rr = (15 * i) / 26;
      d += `L${(22.5 + Math.cos(a) * rr).toFixed(2)} ${(22.5 + Math.sin(a) * rr).toFixed(2)}`;
    }
    return `<path d="${d}" fill="none" stroke="${gold}" stroke-opacity="0.4" stroke-width="1.6" stroke-linecap="round"/><circle cx="22.5" cy="22.5" r="20.5" fill="none" stroke="${gold}" stroke-opacity="0.6" stroke-width="1.4"/>`;
  })());
  // Cursed-energy flames for the tile foot: violet tongues with black cores.
  const flame = (x, h, w) => `M${x - w} 26C${x - w} ${26 - h * 0.4} ${x - w * 0.1} ${26 - h * 0.55} ${x + w * 0.5} ${26 - h}C${x + w * 0.1} ${26 - h * 0.6} ${x + w} ${26 - h * 0.35} ${x + w} 26Z`;
  const flames = svg(60, 26, `<defs><linearGradient id="f" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${cursed}" stop-opacity="0.75"/><stop offset="1" stop-color="${cursed}" stop-opacity="0.12"/></linearGradient></defs><path d="${flame(4, 12, 7)}${flame(18, 22, 9)}${flame(33, 14, 8)}${flame(47, 24, 9)}${flame(60, 12, 7)}" fill="url(#f)"/><path d="${flame(5, 7, 4)}${flame(19, 13, 5)}${flame(34, 8, 4.5)}${flame(48, 14, 5)}" fill="${ink}" fill-opacity="0.7"/>`);
  // Cursed-energy flow over the life bars: ink wisps.
  const wisps = svg(60, 20, `<path d="M0 14Q10 6 20 12T40 10T60 14" fill="none" stroke="${ink}" stroke-opacity="0.35" stroke-width="2.2"/><path d="M0 6Q12 12 26 6T60 6" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1"/>`);
  // Life bar cap: a small talisman.
  const tag = svg(16, 36, `<rect x="2" y="2" width="12" height="32" fill="${paper}" stroke="${ink}" stroke-width="1"/><rect x="4" y="4" width="8" height="28" fill="none" stroke="${red}" stroke-width="0.9"/><path d="M6 10h4M8 8v10M6 16q2 2 4 0" fill="none" stroke="${ink}" stroke-width="1.2" stroke-linecap="round"/><rect x="5.5" y="24" width="5" height="5" fill="${red}"/>`);

  const label = `color: ${t.text} !important; text-shadow: 0 1px 0 ${t.bg}, 0 0 8px ${t.bg} !important;`;
  const clothBg = (lift = 0) => `linear-gradient(180deg, ${alpha('#ffffff', 0.05 + lift)}, transparent 40%), var(--dbtc-u2), linear-gradient(180deg, ${navy}, ${navyDeep})`;

  // Pop-up buttons: OK and Yes as a red seal block, No and Cancel as talisman paper.
  const popBtn = (text, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const bw = w - 12;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><path d="M7 11Q${w / 2} 8 ${6 + bw - 1} 11L${6 + bw} 67Q${w / 2} 70 6 67Z" fill="url(#g)" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/><rect x="12" y="16" width="${bw - 12}" height="47" fill="none" stroke="${c.edge}" stroke-width="1.8"/><path d="M${w - 30} 20h10v10h-10Z" fill="${c.seal}"/><text x="${w / 2}" y="40" dominant-baseline="central" text-anchor="middle" font-family="Segoe UI, system-ui, Roboto, Arial, sans-serif" font-weight="800" font-size="25" fill="${c.text}">${text}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popCss = (primary, secondary) => [['ok_btn', 'OK', primary, false], ['yes_btn', 'Yes', primary, false], ['no_btn', 'No', secondary, false], ['cancel_btn', 'Cancel', secondary, true]]
    .map(([n, text, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(text, wide, c))} !important; filter: drop-shadow(0 3px 4px ${alpha('#000000', 0.6)}) !important; }`).join('\n');
  const popPrimary = { top: mix(red, t.bg, 0.15), bot: mix(red, t.bg, 0.5), edge: mix(paper, red, 0.3), seal: paper, text: '#ffffff' };
  const popSecondary = { top: paper, bot: paperDim, edge: red, seal: red, text: ink };

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const settingsPanels = sel(['#content #settings_content > div:not(.title_txt):not(.button)']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [frameSvg, badge, speckle, crest, strip, phaseBtn, wisps, tag, flames].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: uniform navy in a brush-ink frame with red seals, the gold spiral button on top. */
${SEL.tile} { background: var(--dbtc-u8) 0 100% / 60px 26px repeat-x, radial-gradient(ellipse 90% 70% at 50% 120%, ${alpha(cursed, 0.3)}, transparent 70%), ${clothBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 14px stretch !important; box-shadow: 0 10px 20px -12px #000000 !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 12px); top: -12px; width: 24px; height: 24px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 2px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: var(--dbtc-u8) 0 100% / 60px 32px repeat-x, radial-gradient(ellipse 90% 80% at 50% 110%, ${alpha(cursed, 0.55)}, transparent 70%), ${clothBg(0.04)} !important; box-shadow: inset 0 0 18px ${alpha(cursed, 0.35)}, 0 0 18px -4px ${alpha(cursed, 0.8)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { ${label} }

/* Buttons: navy cloth with an ink edge; hover flares cursed violet. */
${SEL.button} { background: linear-gradient(180deg, ${mix(navy, t.text, 0.06)}, ${navyDeep}) !important; border-color: ${mix(cursed, t.border, 0.6)} !important; color: ${t.text} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.1)}, inset 0 -2px 0 ${alpha(ink, 0.8)}, 0 2px 4px -2px #000000 !important; }
${SEL.buttonHover} { background: linear-gradient(180deg, ${mix(cursed, t.bg, 0.4)}, ${mix(cursed, t.bg, 0.7)}) !important; border-color: ${cursed} !important; color: #ffffff !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.2)}, 0 0 12px -2px ${alpha(cursed, 0.85)} !important; }
${SEL.buttonDown} { background: ${navyDeep} !important; border-color: ${red} !important; box-shadow: inset 0 2px 5px #000000 !important; }

/* Pop-ups: a navy panel in a brush-ink frame, a sealing talisman pinned across the top. */
${SEL.dialog} { background: radial-gradient(ellipse 80% 60% at 50% 0%, ${alpha(cursed, 0.18)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${navy}, ${mix(navyDeep, t.bg, 0.5)}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 0 4px ${navyDeep}, 0 0 0 5px ${alpha(cursed, 0.55)}, 0 0 30px -6px ${alpha(cursed, 0.45)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 8px; top: 8px; right: 8px; bottom: 8px; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(18)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 100px); top: -42px; right: auto; bottom: auto; width: 200px; height: 72px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; transform: none; filter: drop-shadow(0 3px 3px #000000); }
${SEL.dialogTitle} { ${label} }

/* Chat: a talisman strip under a navy header; the window edged in cursed violet. */
${SEL.chatTop} { background: var(--dbtc-u4) 0 100% / 60px 7px repeat-x, linear-gradient(180deg, ${navy}, ${navyDeep}) !important; box-shadow: inset 0 -8px 0 ${alpha(t.bg, 0)}, inset 0 1px 0 ${alpha('#ffffff', 0.1)} !important; }
${on(SEL.chatTop, 'after')} { content: ""; position: absolute; right: 64px; top: 3px; width: 20px; height: 20px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; }
${sel(['#chats .chat .chat_top span'])} { ${label} }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${t.surface}, ${mix(t.surface, t.bg, 0.6)}) !important; box-shadow: inset 1px 0 0 ${alpha(cursed, 0.45)}, inset -1px 0 0 ${alpha(cursed, 0.45)}, inset 0 -1px 0 ${alpha(cursed, 0.45)} !important; }

/* Duel: life bars of red and blue cursed energy with ink wisps, a talisman at the end; spiral-button phases. */
${SEL.life} { border-color: ${mix(cursed, t.text, 0.3)} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${ink}, 0 0 10px -2px ${alpha(cursed, 0.6)}, 0 4px 10px -3px #000000 !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: var(--dbtc-u6) 0 50% / 60px 100% repeat-x, linear-gradient(180deg, ${alpha('#ffffff', 0.28)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.6)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: var(--dbtc-u6) 0 50% / 60px 100% repeat-x, linear-gradient(180deg, ${alpha('#ffffff', 0.28)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.6)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -15px; top: -4px; width: 16px; height: 36px; pointer-events: none; background: var(--dbtc-u7) center / contain no-repeat; transform: rotate(-6deg); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: radial-gradient(circle at 40% 35%, ${mix(gold, '#ffffff', 0.35)}, ${gold} 55%, ${goldDim}) !important; box-shadow: 0 0 0 1px ${ink}, 0 4px 10px -2px #000000 !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${navyDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${navy} 30%, ${navyDeep}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.15)} 20%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.8)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u5) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.15)} 20%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.8)}; }
${sel(['#duel .phase span'])} { color: ${t.text} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.duelLog} { background: var(--dbtc-u2), linear-gradient(180deg, ${navy}, ${mix(navyDeep, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${alpha(cursed, 0.5)}, inset 0 0 0 4px ${alpha(ink, 0.9)}, inset 0 0 0 5px ${alpha(red, 0.35)} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${ink}, 0 0 0 3px ${cursed}, 0 0 12px ${alpha(cursed, 0.6)} !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: linear-gradient(180deg, ${gold}, ${goldDim}) !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(red, t.bg, 0.2)}, ${mix(red, t.bg, 0.55)}) !important; }

/* Duel room: navy panels in brush-ink frames; labels on a navy plate. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(navy, 0.7)}, ${alpha(t.bg, 0.85)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${cursed}, ${ink} 30%, ${mix(cursed, t.text, 0.3)} 55%, ${ink} 80%, ${cursed}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${navyDeep} !important; box-shadow: 0 0 0 0.35em ${navyDeep} !important; border-radius: 2px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(cursed, 0.18)}, transparent 40%), ${t.raised} !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(cursed, 0.42)}, ${alpha(cursed, 0.12)}) !important; }

/* Deck constructor: navy panels edged in cursed violet. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(navy, t.surface, 0.5)}, ${mix(t.surface, t.bg, 0.5)}) !important; box-shadow: inset 0 0 0 1px ${alpha(cursed, 0.5)}, inset 0 0 0 4px ${alpha(ink, 0.9)}, inset 0 0 0 5px ${alpha(red, 0.3)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels: the brush-ink frame. */
${settingsPanels} { border-color: ${mix(cursed, t.border, 0.5)} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(navy, 0.85)}, ${alpha(t.bg, 0.9)}) !important; }
${on(settingsPanels, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(16)} }

/* Titles: white with a cursed-energy glow. */
${titles} { color: ${t.text} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${ink}, 0 0 16px ${alpha(cursed, 0.6)} !important; }

/* Text fields: ink wells with a violet lip, red focus like a seal. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${mix(cursed, t.border, 0.6)} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(cursed, 0.2)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${cursed} !important; box-shadow: inset 0 2px 4px #000000, 0 0 8px ${alpha(cursed, 0.65)} !important; }

/* Scrollbars: ink rods with a violet core. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${ink}, ${cursed}, ${ink}) !important; border-radius: 2px !important; }

/* Pop-up buttons: a red seal block and talisman paper. */
${popCss(popPrimary, popSecondary)}
`;
};
