import { useSyncExternalStore } from 'react';
import {
  DEFAULTS,
  LEGACY_SYNC_KEYS,
  SETTINGS_KEY,
  migrateLegacy,
  withDefaults,
} from './defaults';
import { setLocal } from './localStore';

// One settings object for the whole content script. Components read it with
// useSettings(); writes are applied in memory at once and flushed to
// storage.sync at most once a second (sync allows 120 writes a minute).

const WRITE_DELAY_MS = 1000;

let state = withDefaults(null);
let loaded = false;
let writeTimer = null;
let lastWritten = '';
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());

const flush = () => {
  if (writeTimer) {
    clearTimeout(writeTimer);
    writeTimer = null;
  }
  const json = JSON.stringify(state);
  if (json === lastWritten) return;
  lastWritten = json;
  try {
    chrome.storage.sync.set({ [SETTINGS_KEY]: state }, () => {
      if (chrome.runtime.lastError) {
        console.error('[DB Theme Editor] could not save settings:', chrome.runtime.lastError.message);
      }
    });
  } catch (e) {
    // Extension was reloaded; this orphaned script can no longer save.
  }
};

const scheduleWrite = () => {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(flush, WRITE_DELAY_MS);
};

export const getSettings = () => state;

export const updateSettings = (patch) => {
  const next = typeof patch === 'function' ? patch(state) : patch;
  state = { ...state, ...next };
  emit();
  scheduleWrite();
};

export const replaceSettings = (raw) => {
  state = withDefaults(raw);
  emit();
  flush();
};

export const resetSettings = () => replaceSettings(DEFAULTS);

export const loadSettings = () =>
  new Promise((resolve) => {
    chrome.storage.sync.get([SETTINGS_KEY, ...LEGACY_SYNC_KEYS], (res) => {
      if (chrome.runtime.lastError) {
        console.error('[DB Theme Editor] could not load settings:', chrome.runtime.lastError.message);
        loaded = true;
        resolve(state);
        return;
      }
      const done = () => {
        loaded = true;
        emit();
        resolve(state);
      };
      const stored = res[SETTINGS_KEY];
      if (stored) {
        state = withDefaults(stored);
        lastWritten = JSON.stringify(state);
        done();
        return;
      }
      // First run of v1.1: carry over v1.0 settings and data.
      const migrated = migrateLegacy(res);
      if (typeof res.notesText === 'string' && res.notesText) {
        setLocal('notes', res.notesText, { immediate: true });
      }
      chrome.storage.local.get(['backgroundImageEnabled', 'backgroundImageData'], (loc) => {
        if (!chrome.runtime.lastError && loc) {
          if (loc.backgroundImageEnabled !== undefined) migrated.backgroundEnabled = !!loc.backgroundImageEnabled;
          if (loc.backgroundImageData) setLocal('background', loc.backgroundImageData, { immediate: true });
        }
        state = withDefaults(migrated);
        flush();
        done();
      });
    });
  });

export const isLoaded = () => loaded;

// Another tab (or another device) saved settings: adopt them.
try {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync' || !changes[SETTINGS_KEY]) return;
    const incoming = changes[SETTINGS_KEY].newValue;
    if (!incoming) return;
    const json = JSON.stringify(withDefaults(incoming));
    if (json === JSON.stringify(state)) return;
    state = withDefaults(incoming);
    lastWritten = json;
    emit();
  });
} catch (e) {
  // not in an extension context
}

window.addEventListener('pagehide', flush);

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useSettings = () => useSyncExternalStore(subscribe, getSettings);
