import { useSyncExternalStore } from 'react';
import {
  DEFAULTS,
  LEGACY_SYNC_KEYS,
  SETTINGS_KEY,
  migrateLegacy,
  withDefaults,
} from './defaults';
import { getLocal, setLocal } from './localStore';

// One settings object for the whole content script. Components read it with
// useSettings(); writes are applied in memory at once and flushed to
// storage.sync at most once a second (sync allows 120 writes a minute).
//
// Keys edited here and not yet saved are tracked as "dirty": a change arriving
// from another tab only overwrites keys this tab is not in the middle of
// saving, so neither side loses an edit.

const WRITE_DELAY_MS = 1000;
const MIGRATED_KEY = 'migrated'; // per device, in storage.local

let state = withDefaults(null);
let loadedOk = false;
let writeTimer = null;
let lastWritten = '';
let saveError = null; // 'load' | 'save' | 'quota' | null
let stopped = false;
let retryTimer = null;
const dirty = new Set();
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());

const flush = () => {
  if (writeTimer) {
    clearTimeout(writeTimer);
    writeTimer = null;
  }
  // Never write before the stored settings were read: that would replace
  // them with defaults.
  if (!loadedOk || stopped) return;
  const json = JSON.stringify(state);
  if (json === lastWritten) {
    dirty.clear();
    return;
  }
  const written = new Set(dirty);
  dirty.clear();
  lastWritten = json;
  try {
    chrome.storage.sync.set({ [SETTINGS_KEY]: state }, () => {
      const err = chrome.runtime.lastError;
      if (err) {
        console.error('[DB Theme Editor] could not save settings:', err.message);
        // A size limit never clears by waiting; a rate limit does.
        const tooBig = /QUOTA_BYTES/i.test(err.message || '') && !/WRITE_OPERATIONS/i.test(err.message || '');
        saveError = tooBig ? 'quota' : 'save';
        lastWritten = '';
        written.forEach((k) => dirty.add(k));
        emit();
        if (!tooBig && !writeTimer) writeTimer = setTimeout(flush, 15000);
      } else if (saveError) {
        saveError = null;
        emit();
      }
    });
  } catch (e) {
    // Extension was reloaded; this orphaned copy can no longer save.
  }
};

const scheduleWrite = () => {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(flush, WRITE_DELAY_MS);
};

export const getSettings = () => state;
export const getSaveError = () => saveError;

// Called when this copy of the content script shuts down: no more timers or
// writes from it.
export const stopSettings = () => {
  stopped = true;
  if (writeTimer) clearTimeout(writeTimer);
  if (retryTimer) clearTimeout(retryTimer);
  writeTimer = null;
  retryTimer = null;
};

// "Try again" from the panel: reload if the first read failed, else save now.
export const retryStorage = () => {
  if (!loadedOk) loadSettings();
  else flush();
};

export const updateSettings = (patch) => {
  const next = typeof patch === 'function' ? patch(state) : patch;
  Object.keys(next).forEach((k) => dirty.add(k));
  state = withDefaults({ ...state, ...next });
  emit();
  scheduleWrite();
};

export const replaceSettings = (raw) => {
  state = withDefaults(raw);
  Object.keys(DEFAULTS).forEach((k) => dirty.add(k));
  emit();
  flush();
};

export const resetSettings = () => replaceSettings(DEFAULTS);

// v1.0 kept the background image and its switch in storage.local, which is per
// device, and notes in sync. Carry them over once per device.
const migrateLocalOnce = async (legacySync) => {
  if (await getLocal(MIGRATED_KEY)) return null;
  const patch = {};
  const loc = await new Promise((resolve) => {
    chrome.storage.local.get(['backgroundImageEnabled', 'backgroundImageData'], (r) =>
      resolve(chrome.runtime.lastError ? {} : r || {}),
    );
  });
  if (loc.backgroundImageData && (await getLocal('background')) === undefined) {
    setLocal('background', loc.backgroundImageData, { immediate: true });
    if (loc.backgroundImageEnabled !== undefined) patch.backgroundEnabled = !!loc.backgroundImageEnabled;
  }
  if (typeof legacySync.notesText === 'string' && legacySync.notesText && (await getLocal('notes')) === undefined) {
    setLocal('notes', legacySync.notesText, { immediate: true });
  }
  setLocal(MIGRATED_KEY, true, { immediate: true });
  return patch;
};

const readSync = () =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.get([SETTINGS_KEY, ...LEGACY_SYNC_KEYS], (res) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(res || {});
    });
  });

let loading = null;
export const loadSettings = () => {
  if (!loading) {
    loading = readAndApply().finally(() => {
      loading = null;
    });
  }
  return loading;
};

const readAndApply = async () => {
  if (loadedOk || stopped) return state;
  let res = null;
  for (let attempt = 0; attempt < 3 && !res; attempt++) {
    try {
      res = await readSync();
    } catch (e) {
      console.error('[DB Theme Editor] could not load settings:', e.message);
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  if (!res) {
    // Show defaults but keep saving disabled so the stored settings survive,
    // tell the user, and keep trying in the background.
    saveError = 'load';
    emit();
    if (retryTimer) clearTimeout(retryTimer);
    if (!stopped) retryTimer = setTimeout(loadSettings, 20000);
    return state;
  }
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = null;
  if (saveError === 'load') saveError = null;

  const stored = res[SETTINGS_KEY];
  let base = stored ? stored : migrateLegacy(res);
  const localPatch = await migrateLocalOnce(res);
  if (localPatch && Object.keys(localPatch).length) base = { ...base, ...localPatch };

  // Edits made while loading win over what was stored.
  const pendingEdits = {};
  dirty.forEach((k) => {
    pendingEdits[k] = state[k];
  });
  state = withDefaults({ ...base, ...pendingEdits });
  lastWritten = stored && !localPatch && !dirty.size ? JSON.stringify(withDefaults(stored)) : '';
  loadedOk = true;
  emit();
  flush();
  return state;
};

// Another tab (or device) saved settings: adopt every key this tab is not
// itself in the middle of saving.
try {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync' || !changes[SETTINGS_KEY] || !loadedOk) return;
    const incoming = changes[SETTINGS_KEY].newValue;
    if (!incoming) return;
    const merged = withDefaults(incoming);
    if (JSON.stringify(merged) === lastWritten) return; // our own write echoing back
    const next = { ...merged };
    dirty.forEach((k) => {
      next[k] = state[k];
    });
    const json = JSON.stringify(next);
    if (json === JSON.stringify(state)) return;
    state = next;
    if (!dirty.size) lastWritten = json;
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
export const useSaveError = () => useSyncExternalStore(subscribe, getSaveError);
