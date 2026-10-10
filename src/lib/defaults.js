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

const RANGES = {
  cardTextSize: [0, 30],
  backgroundOpacity: [0.05, 1],
  animationSpeed: [1, 4],
};

const isPlainObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const sameType = (a, b) =>
  a !== null && b !== null && typeof a === typeof b && Array.isArray(a) === Array.isArray(b);

const cleanValue = (k, v, d) => {
  if (!sameType(v, d)) return d;
  if (typeof d === 'number') {
    if (!Number.isFinite(v)) return d;
    const r = RANGES[k];
    return r ? Math.min(r[1], Math.max(r[0], v)) : v;
  }
  if (typeof d === 'string') return v.slice(0, 40);
  if (Array.isArray(d)) {
    if (k === 'customChatMessages') {
      const msgs = v.slice(0, CUSTOM_SLOTS).map((m) => (typeof m === 'string' ? m.slice(0, 200) : ''));
      while (msgs.length < CUSTOM_SLOTS) msgs.push('');
      return msgs;
    }
    if (k === 'chatMuted') return v.filter((n) => typeof n === 'string' && n.trim()).map((n) => n.slice(0, 40)).slice(0, 100);
    return v;
  }
  if (isPlainObject(d)) {
    if (k === 'shortcutKeys') {
      const out = {};
      Object.keys(v).forEach((key) => {
        if (/^[a-z0-9]$/.test(key) && typeof v[key] === 'string') out[key] = v[key].slice(0, 40);
      });
      return out;
    }
    if (k === 'windows') {
      const out = {};
      Object.keys(v).forEach((id) => {
        const p = v[id];
        if (isPlainObject(p) && Number.isFinite(p.x) && Number.isFinite(p.y)) out[id] = { x: p.x, y: p.y };
      });
      return out;
    }
    const out = { ...d };
    Object.keys(d).forEach((sub) => {
      const val = v[sub];
      if (val === undefined || !sameType(val, d[sub])) return;
      if (typeof d[sub] === 'string' && d[sub].startsWith('#') && !/^#[0-9a-f]{6}$/i.test(val)) return;
      if (typeof d[sub] === 'number' && !Number.isFinite(val)) return;
      out[sub] = typeof d[sub] === 'number' ? Math.min(1, Math.max(0, val)) : val;
    });
    return out;
  }
  return v;
};

// Merge stored settings over defaults. Anything of the wrong type (a damaged
// or hand-edited import, an old format) falls back to its default.
export const withDefaults = (stored) => {
  const out = { ...DEFAULTS };
  if (!isPlainObject(stored)) return out;
  Object.keys(DEFAULTS).forEach((k) => {
    if (stored[k] === undefined) return;
    out[k] = cleanValue(k, stored[k], DEFAULTS[k]);
  });
  return out;
};
