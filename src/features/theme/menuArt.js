// Main menu: each theme's hero piece sits whole in one shared slot right of the
// see-through feed, and its other featured pieces step aside. `at` is
// [tx, ty, scale] in scene units from `tools/menu-art.py fit`; the slot is in
// CSS px at the 2047x1070 reference window.

export const MENU_SLOT = { x: 1940, y: 560, w: 168, h: 320, maxScale: 1.5 };

export const MENU_ART = {
  'ancient-gear': { hero: '.dbtefx-ag-golem', at: [1018.3, 325.0, 0.316] },
  angelechy: { hero: '.dbtefx-ae-pieces', at: [1165.7, 358.9, 0.218] },
  artmage: { hero: '.dbtefx-am-wing', at: [-495.4, -221.2, 1.328] },
  'attack-on-titan': { hero: '.dbtefx-aot-banner', at: [298.3, -194.1, 0.861] },
  'black-dragon': { hero: '.dbtefx-rb-herogrp', at: [934.6, 347.3, 0.330] },
  blitzclique: { hero: ':is(.dbtefx-bcq-herogrp, .dbtefx-bcq-halo)', hide: ['.dbtefx-bcq-isle', '.dbtefx-bcq-sun', '.dbtefx-bcq-bolt'], at: [1144.5, 374.6, 0.243] },
  branded: { hero: '.dbtefx-bd-herogrp', hide: ['.dbtefx-bd-brand', '.dbtefx-bd-edge'], at: [1050.4, 353.8, 0.301] },
  'burning-abyss': { hero: '.dbtefx-ba-dante', hide: ['.dbtefx-ba-gate', '.dbtefx-ba-flyers'], at: [953.9, 257.5, 0.334] },
  constellar: { hero: '.dbtefx-cs-armillary', at: [1151.9, 362.7, 0.233] },
  'crystal-beast': { hero: '.dbtefx-cb-rise', hide: ['.dbtefx-cb-edge', '.dbtefx-cb-edgegem'], at: [1116.9, 346.4, 0.266] },
  'cyber-dragon': { hero: '.dbtefx-cd-herogrp', at: [1120.3, 362.3, 0.236] },
  'dark-magic': { hero: '.dbtefx-dm-herogrp', at: [843.8, 290.7, 0.404] },
  ddd: { hero: ':is(.dbtefx-ddd-gate, .dbtefx-ddd-king)', hide: ['.dbtefx-ddd-script', '.dbtefx-ddd-chain'], at: [1136.9, 403.9, 0.231] },
  'death-note': { hero: '.dbtefx-dn-book', at: [564.1, 235.2, 0.614] },
  'destiny-hero': { hero: '.dbtefx-dh-dogma', hide: ['.dbtefx-dh-moon', '.dbtefx-dh-tower'], at: [1031.3, 260.2, 0.316] },
  divine: { hero: '.dbtefx-dv-ragrp', at: [826.7, 277.4, 0.418] },
  dracotail: { hero: '.dbtefx-dt-herogrp', at: [1036.3, 304.7, 0.313] },
  'dragon-ball': { hero: '.dbtefx-db-orbgrp', hide: ['.dbtefx-db-ring', '.dbtefx-db-shock'], at: [-80.7, -23.4, 1.044] },
  'duel-disk': { hero: '.dbtefx-dd-disk', at: [1147.1, 346.5, 0.203] },
  'duel-links': { hero: '.dbtefx-dl-gate', at: [1084.9, 338.6, 0.253] },
  'duelists-of-the-roses': { hero: '.dbtefx-dor-crest', hide: ['.dbtefx-dor-board'], at: [1029.1, 370.1, 0.321] },
  'fire-king': { hero: '.dbtefx-fk-phoenix', at: [1139.3, 372.4, 0.233] },
  'forbidden-memories': { hero: '.dbtefx-fm-card', at: [616.1, 235.7, 0.659] },
  'fullmetal-alchemist': { hero: '.dbtefx-fma-circle', hide: ['.dbtefx-fma-gate'], at: [899.3, 200.9, 0.395] },
  fusion: { hero: '.dbtefx-fu-vortex', at: [1223.2, 411.9, 0.165] },
  gladiator: { hero: '.dbtefx-gb-gate', at: [1059.7, 332.1, 0.295] },
  hero: { hero: '.dbtefx-hr-neosgrp', at: [1092.5, 365.1, 0.267] },
  'jujutsu-kaisen': { hero: '.dbtefx-jjk-domain', hide: ['.dbtefx-jjk-splat'], at: [989.1, 346.4, 0.310] },
  labrynth: { hero: '.dbtefx-lb-ladygrp', at: [974.5, 322.0, 0.314] },
  'legacy-of-the-duelist': { hero: '.dbtefx-ld-card', at: [1443.9, 226.7, 1.500] },
  lightsworn: { hero: '.dbtefx-ls-herogrp', at: [1171.8, 390.0, 0.206] },
  link: { hero: '.dbtefx-lk-portal', at: [1217.7, 392.7, 0.196] },
  madolche: { hero: '.dbtefx-md-queen', hide: ['.dbtefx-md-castlegrp', '.dbtefx-md-lolly'], at: [1107.2, 361.8, 0.266] },
  mermail: { hero: '.dbtefx-mm-megalo', hide: ['.dbtefx-mm-temple'], at: [1126.8, 387.6, 0.241] },
  naruto: { hero: '.dbtefx-nr-sphere', at: [723.0, 146.7, 0.522] },
  parchment: { hero: '.dbtefx-pc-astrolabe', at: [55.4, 41.4, 0.960] },
  'power-patron': { hero: '.dbtefx-pp-sigil', at: [1093.9, 370.7, 0.253] },
  ritual: { hero: '.dbtefx-ri-altar', at: [574.8, 82.2, 0.576] },
  ryzeal: { hero: '.dbtefx-rz-core', at: [1103.2, 342.5, 0.262] },
  shaddoll: { hero: '.dbtefx-sd-puppetmenu', at: [1171.8, 382.2, 0.216] },
  'sky-striker': { hero: '.dbtefx-ss-acegrp', hide: ['.dbtefx-ss-radargrp', '.dbtefx-ss-speed'], at: [950.8, 340.5, 0.344] },
  'snake-eye': { hero: '.dbtefx-se-herogrp', at: [1115.9, 380.8, 0.252] },
  spell: { hero: '.dbtefx-sp-book', hide: ['.dbtefx-sp-ring'], at: [1026.1, 255.0, 0.321] },
  stardust: { hero: '.dbtefx-sd-herogrp', at: [1087.3, 387.4, 0.266] },
  starlight: { hero: '.dbtefx-sl-card', at: [906.6, 280.6, 0.414] },
  'starlight-light': { hero: '.dbtefx-sl-card', at: [904.8, 279.7, 0.415] },
  'tag-force': { hero: '.dbtefx-tf-island', hide: ['.dbtefx-tf-sunset'], at: [1115.3, 361.9, 0.241] },
  utopia: { hero: ':is(.dbtefx-ut-sunglow, .dbtefx-ut-herogrp)', at: [1215.6, 404.0, 0.173] },
  'white-dragon': { hero: '.dbtefx-wd-dragon', at: [1175.9, 404.7, 0.191] },
  xyz: { hero: '.dbtefx-xy-gal', at: [1111.9, 358.0, 0.260] },
  yubel: { hero: '.dbtefx-yb-figure', hide: ['.dbtefx-yb-window'], at: [1004.1, 312.8, 0.329] },
};

const MENU = 'html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx';

export const menuArtCss = (presetId) => {
  const art = MENU_ART[presetId];
  if (!art) return '';
  const [tx, ty, k] = art.at;
  const hide = art.hide?.length ? `\n${MENU} :is(${art.hide.join(', ')}) { opacity: 0 !important; }` : '';
  return `${MENU} ${art.hero} { transform-origin: 0 0 !important; transform: translate(${tx}px, ${ty}px) scale(${k}) !important; }${hide}`;
};
