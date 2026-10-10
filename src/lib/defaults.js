// Every user setting, with its default. Stored as one object in storage.sync
// (small, syncs across the user's browsers). Bulky data lives in storage.local
// (see lib/localStore.js).

export const CUSTOM_SLOTS = 5;

export const DEFAULT_SHORTCUT_KEYS = {
  a: 'good_btn',
  s: 'shuffle_btn',
  t: 'think_btn',
  d: 'draw_action',
  m: 'mill_action',
  r: 'discard_action',
  h: 'half_action',
  n: 'nibiru_action',
  g: 'custom_chat_1',
  1: 'draw_phase',
  2: 'standby_phase',
  3: 'main1_phase',
  4: 'battle_phase',
  5: 'main2_phase',
  6: 'end_phase',
};

export const DEFAULT_PSCT_COLORS = {
  condition: '#f0c29f',
  cost: '#f09f9f',
  effect: '#82d485',
  restriction: '#ff6b6b',
};

export const DEFAULTS = {
  // Look
  darkMode: false,
  cardTextSize: 0, // 0 = DuelingBook default
  psctEnabled: false,
  psctColors: DEFAULT_PSCT_COLORS,
  smallerMenu: false,
  menuColorsEnabled: false,
  menuColors: {
    bg: '#ffffff',
    bgAlpha: 1,
    border: '#000000',
    borderAlpha: 1,
    edge: '#2acbda',
    edgeAlpha: 0.65,
  },
  backgroundEnabled: false,
  backgroundOpacity: 0.5,

  // Duel
  skipIntro: false,
  animationSpeed: 1,
  shortcutsEnabled: true,
  shortcutKeys: DEFAULT_SHORTCUT_KEYS,
  customChatMessages: ['GLHF', '', '', '', ''],
  alertDuelFound: false,
  alertMyTurn: false,
  alertSound: true,
  alertTitle: true,
  alertDesktop: false,
  alertOnlyWhenHidden: true,
  notesEnabled: false,
  trackerEnabled: false,
  trackerAutoClear: true,

  // Chat
  chatMuted: [],
  chatHighlightMentions: false,
  chatMentionAlert: false,

  // Panel
  showLauncher: true,
  panelTab: 'look',

  // Window positions, {x, y} in px from the top-left of the viewport.
  windows: {},
};

export const SETTINGS_KEY = 'dbte:settings';
export const META_KEY = 'dbte:meta';

// v1.0.x stored each setting under its own key. Read them once so existing
// users keep everything; the old keys are left untouched.
export const LEGACY_SYNC_KEYS = [
  'skipIntro',
  'darkModeEnabled',
  'textHighlightEnabled',
  'shortcutKeys',
  'customChatMessage',
  'customChatMessages',
  'notesEnabled',
  'notesText',
  'notesPosition',
  'actionLogEnabled',
  'actionLogItems',
  'actionLogPosition',
  'actionHandPosition',
  'smallerMainMenu',
  'mainMenuApplyColors',
  'mainMenuBgColor',
  'mainMenuBgAlpha',
  'mainMenuBorderColor',
  'mainMenuBorderAlpha',
  'mainMenuEdgeColor',
  'mainMenuEdgeAlpha',
];

const toPoint = (pos) => {
  if (!pos) return undefined;
  const x = parseFloat(pos.left);
  const y = parseFloat(pos.top);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : undefined;
};

const num = (v, fallback) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

export const migrateLegacy = (old) => {
  const s = {};
  const has = (k) => old[k] !== undefined;
  if (has('skipIntro')) s.skipIntro = !!old.skipIntro;
  if (has('darkModeEnabled')) s.darkMode = !!old.darkModeEnabled;
  if (has('textHighlightEnabled')) s.psctEnabled = !!old.textHighlightEnabled;
  if (has('smallerMainMenu')) s.smallerMenu = !!old.smallerMainMenu;
  if (has('notesEnabled')) s.notesEnabled = !!old.notesEnabled;
  if (has('actionLogEnabled')) s.trackerEnabled = !!old.actionLogEnabled;

  if (old.shortcutKeys && typeof old.shortcutKeys === 'object') {
    const keys = {};
    Object.keys(old.shortcutKeys).forEach((k) => {
      const id = old.shortcutKeys[k];
      keys[k] = id === 'custom_chat_action' ? 'custom_chat_1' : id;
    });
    s.shortcutKeys = keys;
  }
  if (Array.isArray(old.customChatMessages)) {
    const msgs = old.customChatMessages.slice(0, CUSTOM_SLOTS).map((m) => String(m || ''));
    while (msgs.length < CUSTOM_SLOTS) msgs.push('');
    s.customChatMessages = msgs;
  } else if (typeof old.customChatMessage === 'string') {
    s.customChatMessages = [old.customChatMessage, '', '', '', ''];
  }

  if (has('mainMenuApplyColors')) {
    s.menuColorsEnabled = !!old.mainMenuApplyColors;
    s.menuColors = {
      bg: old.mainMenuBgColor || DEFAULTS.menuColors.bg,
      bgAlpha: num(old.mainMenuBgAlpha, DEFAULTS.menuColors.bgAlpha),
      border: old.mainMenuBorderColor || DEFAULTS.menuColors.border,
      borderAlpha: num(old.mainMenuBorderAlpha, DEFAULTS.menuColors.borderAlpha),
      edge: old.mainMenuEdgeColor || DEFAULTS.menuColors.edge,
      edgeAlpha: num(old.mainMenuEdgeAlpha, DEFAULTS.menuColors.edgeAlpha),
    };
  }

  const windows = {};
  const notesPos = toPoint(old.notesPosition);
  const logPos = toPoint(old.actionLogPosition);
  const handPos = toPoint(old.actionHandPosition);
  if (notesPos) windows.notes = notesPos;
  if (logPos) windows.tracker = logPos;
  if (handPos) windows.hand = handPos;
  if (Object.keys(windows).length) s.windows = windows;
  return s;
};

// Objects the user edits as a whole: a removed binding must stay removed.
const REPLACED_WHOLE = ['shortcutKeys', 'windows'];

// Shallow-merge stored settings over defaults, one level deep for objects.
export const withDefaults = (stored) => {
  const out = { ...DEFAULTS };
  if (!stored || typeof stored !== 'object') return out;
  Object.keys(DEFAULTS).forEach((k) => {
    if (stored[k] === undefined) return;
    const d = DEFAULTS[k];
    if (d && typeof d === 'object' && !Array.isArray(d) && !REPLACED_WHOLE.includes(k)) {
      out[k] = { ...d, ...stored[k] };
    } else {
      out[k] = stored[k];
    }
  });
  return out;
};
