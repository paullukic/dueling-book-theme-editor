// burning-abyss: the Inferno's masonry. Ash-stone slabs set in mortared
// blocks with a bone outer edge and a sulphur inner rule, fissures glowing
// ember at the corners; the signature is Dante's laurel wreath, and pop-ups
// are crowned by the Gate of Hell with its glowing inscription. Phases are
// the nine circles seen from above. (t, kit) -> CSS string; see chrome/kit.js.
import { mix } from '../../../lib/color.js';

const on = (list, pseudo) => list.split(', ').map((s) => `${s}::${pseudo}`).join(', ');
const f1 = (v) => Math.round(v * 10) / 10;

export default (t, { SEL, sel, svg, svgUrl, alpha }) => {
  const sulphur = t.accent;
  const sulphurLit = mix(t.accent, '#ffffff', 0.45);
  const sulphurDeep = mix(t.accent, t.bg, 0.5);
  const ember = t.accent2;
  const bone = t.text;
  const ink = mix(t.bg, '#000000', 0.45);
  const stone = mix(t.raised, t.muted, 0.2);
  const stoneDeep = mix(t.bg, t.raised, 0.4);
  const ash = t.muted;

  // Dante's laurel wreath: two branches meeting under an ember stone.
  const wreath = (cx, cy, k) => {
    const branch = (dir) => {
      let leaves = '';
      for (let i = 0; i < 7; i++) {
        const a = Math.PI / 2 + dir * (0.35 + i * 0.36);
        const px = cx + Math.cos(a) * 15 * k;
        const py = cy + Math.sin(a) * 12 * k;
        const deg = f1((a * 180) / Math.PI + dir * 112);
        leaves += `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(5.2 * k)}" ry="${f1(2.1 * k)}" transform="rotate(${deg} ${f1(px)} ${f1(py)})"/>`;
      }
      return leaves;
    };
    return `<path d="M${f1(cx - 15 * k)} ${cy}A${f1(15 * k)} ${f1(12 * k)} 0 0 0 ${f1(cx + 15 * k)} ${cy}" fill="none" stroke="${sulphurDeep}" stroke-width="${f1(1.4 * k)}"/><g fill="${sulphur}" stroke="${sulphurDeep}" stroke-width="${f1(0.5 * k)}">${branch(-1)}${branch(1)}</g><circle cx="${cx}" cy="${f1(cy + 12 * k)}" r="${f1(2.8 * k)}" fill="${ember}" stroke="${ink}" stroke-width="${f1(0.8 * k)}"/>`;
  };

  // Nine-slice frame: a band of mortared ash-stone blocks, bone outer edge,
  // sulphur inner rule, ember fissures at the four corners.
  let joints = '';
  for (let i = 18; i <= 42; i += 8) joints += `M${i} 1V12M${i + 4} 48V59M1 ${i}H12M48 ${i + 4}H59`;
  const crack = (x, y, sx, sy) => `M${x} ${y}l${3 * sx} ${2 * sy}l${1 * sx} ${4 * sy}l${3 * sx} ${1 * sy}`;
  const frameSvg = svg(60, 60, `<path d="M0 0H60V60H0ZM13 13V47H47V13Z" fill="${stoneDeep}" fill-rule="evenodd"/><path d="${joints}" stroke="${ink}" stroke-width="1.6"/><path d="${crack(2, 2, 1, 1)}${crack(58, 2, -1, 1)}${crack(2, 58, 1, -1)}${crack(58, 58, -1, -1)}" fill="none" stroke="${ember}" stroke-width="1.4"/><rect x="0.8" y="0.8" width="58.4" height="58.4" fill="none" stroke="${bone}" stroke-opacity="0.55" stroke-width="1.2"/><rect x="12.4" y="12.4" width="35.2" height="35.2" fill="none" stroke="${sulphur}" stroke-width="1.2"/>`);
  const frame = (px) => `border-style: solid; border-color: transparent; border-width: ${px}px; border-image: var(--dbtc-u0) 20 / ${px}px round; box-sizing: border-box;`;

  // Texture: a network of hairline fissures in the stone, faintly ember-lit.
  const chart = svg(140, 140, `<path d="M0 32L18 36L30 52L52 50L66 70M30 52L26 78L40 96L36 120L44 140M66 70L92 66L104 84L130 80L140 88M92 66L98 40L120 26L140 30M104 84L100 110L118 124L116 140M98 40L84 18L88 0" fill="none" stroke="${ember}" stroke-opacity="0.07" stroke-width="1.1" stroke-linejoin="round"/>`);

  const crestTile = svg(60, 36, wreath(30, 14, 1.15));
  // The Gate of Hell: a pointed stone arch, its inscription band glowing, the wreath beneath.
  const gateArch = (cx, base, w, h) => `M${cx - w} ${base}V${base - h * 0.5}C${cx - w} ${base - h * 0.82} ${f1(cx - w * 0.5)} ${base - h * 0.96} ${cx} ${base - h}C${f1(cx + w * 0.5)} ${base - h * 0.96} ${cx + w} ${base - h * 0.82} ${cx + w} ${base - h * 0.5}V${base}Z`;
  const crown = svg(170, 96, `<defs><linearGradient id="v" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${mix(sulphur, ember, 0.4)}"/><stop offset="0.6" stop-color="${mix(t.bg, ember, 0.3)}"/><stop offset="1" stop-color="${ink}"/></linearGradient></defs><path d="${gateArch(85, 92, 56, 90)}" fill="${mix(stone, bone, 0.1)}" stroke="${bone}" stroke-opacity="0.75" stroke-width="2"/><path d="M29 60H45M125 60H141M29 76H45M125 76H141" stroke="${ink}" stroke-width="1.6"/><path d="${gateArch(85, 92, 38, 70)}" fill="url(#v)"/><path d="M${85 - 47} 56C${85 - 44} 30 ${85 - 22} 13 85 9C${85 + 22} 13 ${85 + 44} 30 ${85 + 47} 56" fill="none" stroke="${sulphur}" stroke-width="4.5" stroke-dasharray="6 2.5 2.5 2.5 9 2.5"/><path d="M22 92H148" stroke="${bone}" stroke-opacity="0.75" stroke-width="2.4"/>${wreath(85, 80, 1.3)}`);

  // Phase discs: the nine circles, descending rings toward a sulphur pit.
  let rings = '';
  for (let i = 0; i < 5; i++) rings += `<circle cx="22.5" cy="${f1(22.5 + i * 0.9)}" r="${f1(20 - i * 3.6)}" fill="none" stroke="${sulphur}" stroke-opacity="${f1(0.35 + i * 0.13)}" stroke-width="${i ? 1.2 : 2}"/>`;
  const phaseRing = svg(45, 45, rings);
  const lifeCrest = svg(40, 40, `<circle cx="20" cy="20" r="17" fill="${ink}" stroke="${bone}" stroke-opacity="0.7" stroke-width="2"/>${wreath(20, 16, 0.95)}`);

  const plate = `linear-gradient(180deg, ${sulphurLit}, ${sulphur} 50%, ${mix(sulphur, t.bg, 0.3)})`;
  // Stone blocks capping both ends of a button, as on the pop-up slabs.
  const ends = `linear-gradient(90deg, ${stoneDeep} 0 4px, ${ink} 4px 5px, transparent 5px calc(100% - 5px), ${ink} calc(100% - 5px) calc(100% - 4px), ${stoneDeep} calc(100% - 4px))`;
  const glassBg = (lift = 0) => `radial-gradient(ellipse 90% 75% at 50% 135%, ${alpha(ember, 0.26 + lift)}, ${alpha(sulphur, 0.05)} 55%, transparent 75%), var(--dbtc-u2), linear-gradient(180deg, ${stone}, ${stoneDeep})`;

  // Pop-up buttons: a sulphur-glazed slab between two stone blocks (primary);
  // an ash-stone slab with a sulphur rule (secondary).
  const popBtn = (label, wide, c) => {
    const w = wide ? 234.85 : 153.4;
    const [x0, x1, y0] = [6, w - 6, 10];
    const blocks = `<rect x="${x0}" y="${y0}" width="16" height="58.5" fill="${c.block}"/><rect x="${f1(x1 - 16)}" y="${y0}" width="16" height="58.5" fill="${c.block}"/><path d="M${x0} ${y0 + 20}h16M${x0} ${y0 + 39}h16M${f1(x1 - 16)} ${y0 + 20}h16M${f1(x1 - 16)} ${y0 + 39}h16M${x0 + 16} ${y0}v58.5M${f1(x1 - 16)} ${y0}v58.5" stroke="${ink}" stroke-width="1.4"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${wide ? 78.5 : 78.47}"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.top}"/><stop offset="0.55" stop-color="${c.mid}"/><stop offset="1" stop-color="${c.bot}"/></linearGradient></defs><rect x="${x0}" y="${y0}" width="${f1(x1 - x0)}" height="58.5" rx="2" fill="url(#g)" stroke="${c.edge}" stroke-width="2.4"/>${blocks}<path d="M${x0 + 22} ${y0 + 4}H${f1(x1 - 22)}" stroke="#ffffff" stroke-opacity="${c.shine}" stroke-width="2"/><path d="M${x0 + 22} ${y0 + 53}H${f1(x1 - 22)}" stroke="${c.rule}" stroke-width="2.2"/><text x="${w / 2}" y="39.5" dominant-baseline="central" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="25" fill="${c.text}">${label}</text></svg>`;
  };
  const popImg = (name) => sel([`#content img[src*="/svg/${name}"]`, `#content img[data-src*="/svg/${name}"]`]);
  const popPrimary = { top: sulphurLit, mid: sulphur, bot: mix(sulphur, t.bg, 0.35), edge: ink, block: stoneDeep, rule: ember, shine: 0.6, text: t.accentText };
  const popSecondary = { top: mix(stone, ash, 0.15), mid: stone, bot: ink, edge: sulphurDeep, block: ink, rule: sulphur, shine: 0.15, text: bone };
  const popCss = [['ok_btn', 'OK', popPrimary, false], ['yes_btn', 'Yes', popPrimary, false], ['no_btn', 'No', popSecondary, false], ['cancel_btn', 'Cancel', popSecondary, true]]
    .map(([n, label, c, wide]) => `${popImg(n)} { content: ${svgUrl(popBtn(label, wide, c))} !important; filter: drop-shadow(0 3px 5px ${alpha('#000000', 0.6)}) drop-shadow(0 0 6px ${alpha(sulphur, 0.25)}) !important; }`)
    .join('\n');

  const lobbyBorders = sel(['#duel_room #formats .format > .border', '#duel_room #decklist > .border', '#duel_room #mode > .border', '#duel_room #filter > .border', '#duel_room #host_bg > .border']);
  const deckPanels = sel(['#deck_constructor .deck_bg', '#deck_constructor .side_bg', '#deck_constructor .extra_bg', '#deck_constructor #search .search_bg']);
  const titles = sel(['#content .title1', '#content .arial_black2', '#content .admin_lbl', '#deck_constructor #search .title_txt']);

  const vars = [frameSvg, crestTile, chart, crown, phaseRing, lifeCrest].map((v, i) => `--dbtc-u${i}: ${svgUrl(v)};`).join(' ');
  return `
html body { ${vars} }
/* Menu tiles: ash-stone slabs in a mortared frame, Dante's laurel above. */
${SEL.tile} { background: ${glassBg()} !important; border-style: solid !important; border-image: var(--dbtc-u0) 20 / 10px round !important; border-radius: 0 !important; box-shadow: 0 10px 24px -12px #000000, 0 0 18px -10px ${alpha(ember, 0.6)} !important; }
${on(SEL.tile, 'before')} { content: ""; position: absolute; left: calc(50% - 28px); top: -22px; width: 56px; height: 34px; pointer-events: none; background: var(--dbtc-u1) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${on(sel(['#main_menu .menu_btn.dbte-small-menu .content']), 'before')} { content: none; }
${SEL.tileHover} { background: linear-gradient(0deg, ${alpha(sulphur, 0.14)}, transparent 60%), ${glassBg(0.16)} !important; box-shadow: 0 0 22px -4px ${alpha(sulphur, 0.7)}, 0 0 40px -12px ${alpha(ember, 0.9)}, 0 12px 24px -12px #000000 !important; }
${SEL.tileLabel} { color: ${bone} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 10px ${alpha(t.bg, 0.95)} !important; }

/* Buttons: sulphur-glazed plates with an ember underline. */
${SEL.button} { background: ${ends}, ${plate} !important; border-color: ${sulphurDeep} !important; color: ${t.accentText} !important; border-radius: 2px !important; box-shadow: inset 0 1px 0 ${alpha('#ffffff', 0.5)}, inset 0 -2px 0 ${ember}, 0 2px 6px -2px #000000 !important; }
${SEL.buttonHover} { background: ${ends}, linear-gradient(180deg, #ffffff, ${sulphurLit} 40%, ${sulphur}) !important; border-color: ${ember} !important; box-shadow: inset 0 -2px 0 ${ember}, 0 0 12px -2px ${alpha(sulphur, 0.9)} !important; }
${SEL.buttonDown} { background: ${mix(sulphur, t.bg, 0.3)} !important; border-color: ${sulphur} !important; box-shadow: inset 0 2px 5px ${alpha('#000000', 0.5)} !important; }
${sel(['#content .button.disabled'])} { color: ${mix(t.accentText, sulphur, 0.5)} !important; }

/* Pop-ups: stone in the mortared frame, crowned by the Gate of Hell. */
${SEL.dialog} { background: radial-gradient(ellipse 70% 60% at 50% 0%, ${alpha(sulphur, 0.16)}, transparent 70%), var(--dbtc-u2), linear-gradient(180deg, ${stone}, ${t.bg}) !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${alpha(bone, 0.5)}, 0 0 0 3px ${stoneDeep}, 0 0 40px -10px ${alpha(ember, 0.7)}, 0 24px 60px -12px #000000 !important; }
${on(SEL.dialog, 'before')} { content: ""; position: absolute; left: 0; top: 0; right: 0; bottom: 0; width: auto; height: auto; pointer-events: none; z-index: 0; ${frame(20)} background: none; transform: none; }
${on(SEL.dialog, 'after')} { content: ""; position: absolute; left: calc(50% - 85px); top: -92px; right: auto; bottom: auto; width: 170px; height: 96px; pointer-events: none; z-index: 1; background: var(--dbtc-u3) center / contain no-repeat; filter: drop-shadow(0 3px 4px #000000); transform: none; }
${SEL.dialogTitle} { color: ${bone} !important; text-shadow: 0 2px 0 ${t.bg}, 0 0 14px ${alpha(sulphur, 0.6)} !important; }

/* Chat: a stone lintel with a sulphur inscription line, ash stone below. */
${SEL.chatTop} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.08)}, transparent 55%), linear-gradient(90deg, ${ink}, ${stone} 25%, ${stone} 75%, ${ink}) !important; box-shadow: inset 0 1px 0 ${alpha(bone, 0.5)}, inset 0 -3px 0 ${ink}, inset 0 -5px 0 ${sulphur} !important; }
${sel(['#chats .chat .chat_top span'])} { color: ${bone} !important; text-shadow: 0 1px 2px #000000 !important; }
${SEL.chat} { background: var(--dbtc-u2), linear-gradient(180deg, ${stone}, ${stoneDeep}) !important; box-shadow: inset 1px 0 0 ${sulphurDeep}, inset -1px 0 0 ${sulphurDeep}, inset 0 -1px 0 ${sulphurDeep}, inset 0 0 30px -10px ${alpha(ember, 0.5)} !important; }

/* Duel: stone-bound life bars led by the laurel; phases are the nine circles. */
${SEL.life} { border-color: ${sulphurDeep} !important; border-radius: 2px !important; box-shadow: 0 0 0 1px ${ink}, inset 0 0 0 1px ${alpha(bone, 0.35)}, 0 0 12px -2px ${alpha(ember, 0.6)} !important; }
${SEL.lifeSelf}, ${SEL.lifeOpp} { border-radius: 2px !important; }
${SEL.lifeSelf} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.28)}, transparent 50%), linear-gradient(90deg, ${mix(t.self, t.bg, 0.55)}, ${t.self}) !important; }
${SEL.lifeOpp} { background: linear-gradient(180deg, ${alpha('#ffffff', 0.28)}, transparent 50%), linear-gradient(90deg, ${mix(t.opp, t.bg, 0.55)}, ${t.opp}) !important; }
${on(sel(['#duel .lifepoints']), 'before')} { content: ""; position: absolute; left: -18px; top: -2px; width: 34px; height: 34px; pointer-events: none; background: var(--dbtc-u5) center / contain no-repeat; filter: drop-shadow(0 1px 2px #000000); }
${sel(['#duel .lifepoints .life_txt'])} { color: #ffffff !important; text-shadow: 0 1px 2px #000000, 0 0 6px #000000 !important; }
${SEL.phase} { background: radial-gradient(circle, ${stoneDeep} 60%, ${sulphurDeep} 62%, ${ink} 70%) !important; box-shadow: 0 0 0 1px ${t.bg}, 0 0 10px -2px ${alpha(ember, 0.7)} !important; }
${sel(['#duel .phase .background .background_top'])} { background: none !important; }
${sel(['#duel .phase .background .background_inner'])} { background: ${stoneDeep} !important; }
${sel(['#duel .phase .phase_inner.red', '#duel .phase .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${stone} 25%, ${ink}) !important; }
${sel(['#duel .phase.active .phase_inner.red'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.self, '#ffffff', 0.2)} 20%, ${mix(t.self, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.self, 0.85)}; }
${sel(['#duel .phase.active .phase_inner.blue'])} { background: var(--dbtc-u4) center / 100% 100%, radial-gradient(circle, ${mix(t.opp, '#ffffff', 0.2)} 20%, ${mix(t.opp, t.bg, 0.5)}) !important; box-shadow: 0 0 14px ${alpha(t.opp, 0.85)}; }
${sel(['#duel .phase span'])} { color: ${bone} !important; text-shadow: 0 1px 2px #000000, 0 0 4px #000000 !important; }
${sel(['#duel #turn .background', '#duel #start_turn .background', '#duel #end_turn .background'])} { background: ${sulphurDeep} !important; }
${sel(['#duel #turn .background_inner', '#duel #start_turn .background_inner', '#duel #end_turn .background_inner'])} { background: linear-gradient(180deg, ${mix(ember, '#ffffff', 0.12)}, ${mix(ember, t.bg, 0.5)}) !important; }
${sel(['#duel .cout_txt'])} { background: var(--dbtc-u2), linear-gradient(180deg, ${stone}, ${stoneDeep}) !important; box-shadow: inset 0 0 0 1px ${alpha(bone, 0.4)}, inset 0 0 0 3px ${stoneDeep}, inset 0 0 0 4px ${sulphurDeep} !important; }
${sel(['#duel #avatar1', '#duel #avatar2', '#duel #avatar3', '#duel #avatar4'])} { box-shadow: 0 0 0 2px ${stoneDeep}, 0 0 0 3px ${alpha(bone, 0.6)}, 0 0 0 5px ${sulphurDeep}, 0 0 16px -4px ${alpha(ember, 0.8)} !important; }

/* Duel room: stone rims around ash panels. */
${lobbyBorders} { background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(stone, 0.85)}, ${alpha(t.bg, 0.9)}) !important; box-shadow: 0 10px 26px -12px #000000; }
${on(lobbyBorders, 'before')} { background: linear-gradient(160deg, ${alpha(bone, 0.7)}, ${sulphurDeep} 30%, ${ink} 55%, ${sulphurDeep} 80%, ${alpha(bone, 0.7)}) !important; filter: none !important; }
${on(lobbyBorders, 'after')} { content: ""; position: absolute; inset: -1px; pointer-events: none; ${frame(14)} }
${sel(['#duel_room .format .format_txt'])} { background: linear-gradient(180deg, transparent 63%, ${t.bg} 63% 82%, transparent 82%) center / 74% 100% no-repeat !important; }
${sel(['#duel_room #decklist > span', '#duel_room #mode > span', '#duel_room #filter > span', '#duel_room #host_lbl', '#content #settings_content .admin_lbl'])} { background: ${stoneDeep} !important; box-shadow: 0 0 0 0.35em ${stoneDeep} !important; border-radius: 2px !important; }
${sel(['#duel_room .duelbutton .background'])} { background: linear-gradient(90deg, ${alpha(ember, 0.2)}, transparent 45%), ${t.raised} !important; filter: none !important; }
${sel(['#duel_room .duelbutton:hover .background'])} { background: linear-gradient(90deg, ${alpha(sulphur, 0.3)}, ${alpha(ember, 0.12)}) !important; }
${sel(['#duel_room #yu', '#duel_room #yu *'])} { filter: none !important; }

/* Deck constructor: ash panels banded in stone and sulphur. */
${deckPanels} { background: var(--dbtc-u2), linear-gradient(180deg, ${mix(stone, t.surface, 0.4)}, ${stoneDeep}) !important; box-shadow: inset 0 0 0 1px ${alpha(bone, 0.45)}, inset 0 0 0 4px ${stoneDeep}, inset 0 0 0 5px ${alpha(sulphur, 0.55)} !important; }
${on(sel(['#deck_constructor #search .search_bg']), 'after')} { content: ""; position: absolute; inset: 0; pointer-events: none; ${frame(16)} }

/* Settings panels. */
${SEL.settingsPanel} { border-color: ${sulphurDeep} !important; background: var(--dbtc-u2), linear-gradient(180deg, ${alpha(stone, 0.9)}, ${alpha(t.bg, 0.92)}) !important; }
${on(SEL.settingsPanel, 'before')} { content: ""; position: absolute; inset: -2px; pointer-events: none; ${frame(14)} }

/* Titles: carved bone lettering lit from the pit below. */
${titles} { color: ${bone} !important; text-shadow: 0 0 2px ${t.bg}, 0 0 4px ${t.bg}, 0 2px 0 ${t.bg}, 0 3px 14px ${alpha(sulphur, 0.6)} !important; }

/* Text fields: dark stone wells with a sulphur lip. */
${SEL.field} { background-color: ${mix(t.bg, t.surface, 0.5)} !important; border-color: ${mix(sulphurDeep, bone, 0.2)} !important; box-shadow: inset 0 2px 4px #000000, 0 1px 0 ${alpha(sulphur, 0.25)} !important; }
${sel(['#content input:focus', '#content textarea:focus'])} { outline: 1px solid ${sulphur} !important; box-shadow: inset 0 2px 4px #000000, 0 0 10px ${alpha(ember, 0.7)} !important; }

/* Scrollbars: bone rods. */
${sel(['#content .os-scrollbar-handle'])} { background: linear-gradient(90deg, ${sulphurDeep}, ${mix(bone, sulphur, 0.4)}, ${sulphurDeep}) !important; border-radius: 2px !important; }

/* Pop-up buttons in the theme material. */
${popCss}
`;
};
