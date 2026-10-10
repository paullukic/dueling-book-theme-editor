import { useSyncExternalStore } from 'react';
import { DEFAULTS, LOCAL_SETTING_KEYS, SETTING_PREFIX, migrateLegacy, withDefaults } from './defaults';
import { getLocal, removeLocalRaw, setLocalConfirmed } from './localStore';
import { classifyStorageError } from './storageErrors';

// Settings live one key per item ("dbte:s:darkMode", ...) so that edits to
// different settings from different tabs or devices never overwrite each
// other: browser sync merges per item. Per-device UI state (window
// positions, last tab) lives in storage.local instead of sync.
//
// Edits apply in memory at once and are flushed at most once a second (sync
// allows 120 writes a minute). A key stays "dirty" until its write is
// confirmed; incoming changes never overwrite a dirty or in-flight key.

const WRITE_DELAY_MS = 1000;
const RETRY_DELAY_MS = 15000;
const MIGRATED_KEY = 'migrated'; // per device, in storage.local
const OLD_SINGLE_KEY = 'dbte:settings'; // pre-release 1.1 builds kept one object

let state = withDefaults(null);
let loadedOk = false;
let stopped = false;
let writeTimer = null;
let retryTimer = null;
let problem = null; // 'load' | 'save' | 'quota' | null
const dirty = new Set();
const inflight = new Set();
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());
const itemKey = (k) => SETTING_PREFIX + k;
const areaFor = (k) => (LOCAL_SETTING_KEYS.includes(k) ? 'local' : 'sync');

const setProblem = (p) => {
  if (problem === p) return;
  problem = p;
  emit();
};

const writeArea = (area, keys) =>
  new Promise((resolve) => {
    const items = {};
    keys.forEach((k) => {
      items[itemKey(k)] = state[k];
    });
    try {
      chrome.storage[area].set(items, () => {
        const err = chrome.runtime.lastError;
        if (err) console.error(`[DB Theme Editor] could not save settings (${area}):`, err.message);
        resolve(err ? classifyStorageError(err.message) : null);
      });
    } catch (e) {
      resolve('other'); // orphaned after an extension reload
    }
  });

const flush = async () => {
  if (writeTimer) {
    clearTimeout(writeTimer);
    writeTimer = null;
  }
  if (!loadedOk || stopped || !dirty.size) return;
  const keys = [...dirty];
  dirty.clear();
  keys.forEach((k) => inflight.add(k));
  const groups = ['sync', 'local'].map((area) => [area, keys.filter((k) => areaFor(k) === area)]);
  const results = await Promise.all(
    groups.map(async ([area, ks]) => [ks, ks.length ? await writeArea(area, ks) : null]),
  );
  keys.forEach((k) => inflight.delete(k));
  let failure = null;
  results.forEach(([ks, err]) => {
    if (!err) return;
    ks.forEach((k) => dirty.add(k));
    if (err === 'quota' || !failure) failure = err;
  });
  if (!failure) {
    if (problem === 'save' || problem === 'quota') setProblem(null);
    return;
  }
  setProblem(failure === 'quota' ? 'quota' : 'save');
  // A size limit never clears by waiting; a rate limit or hiccup does.
  if (failure !== 'quota' && !writeTimer && !stopped) writeTimer = setTimeout(flush, RETRY_DELAY_MS);
};

const scheduleWrite = () => {
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(flush, WRITE_DELAY_MS);
};

export const getSettings = () => state;
export const getStorageProblem = () => problem;

export const updateSettings = (patch) => {
  const next = typeof patch === 'function' ? patch(state) : patch;
  const merged = withDefaults({ ...state, ...next });
  Object.keys(next).forEach((k) => {
    if (k in DEFAULTS && JSON.stringify(merged[k]) !== JSON.stringify(state[k])) dirty.add(k);
  });
  state = merged;
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

// Called when this copy of the content script shuts down: no more timers or
// writes from it.
export const stopSettings = () => {
  stopped = true;
  if (writeTimer) clearTimeout(writeTimer);
  if (retryTimer) clearTimeout(retryTimer);
  writeTimer = null;
  retryTimer = null;
};

// v1.0 kept the background image and its switch in storage.local, which is
// per device, and notes in sync. Carry them over once per device; the
// "migrated" flag is only set once every copy was confirmed written.
const migrateLocalOnce = async (legacySync) => {
  if (await getLocal(MIGRATED_KEY)) return null;
  const patch = {};
  const loc = await new Promise((resolve) => {
    chrome.storage.local.get(['backgroundImageEnabled', 'backgroundImageData'], (r) =>
      resolve(chrome.runtime.lastError ? {} : r || {}),
    );
  });
  let ok = true;
  if (loc.backgroundImageData && (await getLocal('background')) === undefined) {
    if (await setLocalConfirmed('background', loc.backgroundImageData)) {
      if (loc.backgroundImageEnabled !== undefined) patch.backgroundEnabled = !!loc.backgroundImageEnabled;
      await removeLocalRaw(['backgroundImageData']);
    } else {
      ok = false;
    }
  }
  if (typeof legacySync.notesText === 'string' && legacySync.notesText && (await getLocal('notes')) === undefined) {
    ok = (await setLocalConfirmed('notes', legacySync.notesText)) && ok;
  }
  if (ok) await setLocalConfirmed(MIGRATED_KEY, true);
  return patch;
};

const getArea = (area, keys) =>
  new Promise((resolve, reject) => {
    chrome.storage[area].get(keys, (res) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(res || {});
    });
  });

const pickSettings = (items) => {
  const out = {};
  Object.keys(items).forEach((key) => {
    if (key.startsWith(SETTING_PREFIX)) out[key.slice(SETTING_PREFIX.length)] = items[key];
  });
  return out;
};

const readAndApply = async () => {
  if (loadedOk || stopped) return state;
  let syncItems = null;
  let localItems = {};
  for (let attempt = 0; attempt < 3 && !syncItems; attempt++) {
    try {
      syncItems = await getArea('sync', null);
      localItems = await getArea('local', LOCAL_SETTING_KEYS.map(itemKey));
    } catch (e) {
      syncItems = null;
      console.error('[DB Theme Editor] could not load settings:', e.message);
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  if (!syncItems) {
    // Show defaults but keep saving disabled so the stored settings survive,
    // tell the user, and keep trying in the background.
    setProblem('load');
    if (!stopped) retryTimer = setTimeout(loadSettings, 20000);
    return state;
  }
  if (retryTimer) clearTimeout(retryTimer);
  retryTimer = null;

  let stored = { ...pickSettings(syncItems), ...pickSettings(localItems) };
  let needsWrite = [];
  if (!Object.keys(pickSettings(syncItems)).length) {
    // First run of this format: carry over 1.0 settings (or a pre-release
    // single-object build) and write them out item by item.
    stored = { ...(syncItems[OLD_SINGLE_KEY] || migrateLegacy(syncItems)), ...pickSettings(localItems) };
    needsWrite = Object.keys(stored).filter((k) => k in DEFAULTS);
  }
  const localPatch = await migrateLocalOnce(syncItems);
  if (localPatch) {
    stored = { ...stored, ...localPatch };
    needsWrite = needsWrite.concat(Object.keys(localPatch));
  }

  // Edits made while loading win over what was stored.
  const pendingEdits = {};
  dirty.forEach((k) => {
    pendingEdits[k] = state[k];
  });
  state = withDefaults({ ...stored, ...pendingEdits });
  needsWrite.forEach((k) => dirty.add(k));
  loadedOk = true;
  if (problem === 'load') problem = null;
  emit();
  flush();
  return state;
};

let loading = null;
export const loadSettings = () => {
  if (!loading) {
    loading = readAndApply().finally(() => {
      loading = null;
    });
  }
  return loading;
};

// "Try again" from the panel: reload if the first read failed, else save now.
export const retryStorage = () => {
  if (!loadedOk) loadSettings();
  else flush();
};

// Another tab or device saved a setting: adopt it unless this copy has its
// own unsaved or in-flight edit of the same setting.
try {
  chrome.storage.onChanged.addListener((changes, area) => {
    if ((area !== 'sync' && area !== 'local') || !loadedOk || stopped) return;
    const patch = {};
    Object.keys(changes).forEach((key) => {
      if (!key.startsWith(SETTING_PREFIX)) return;
      const k = key.slice(SETTING_PREFIX.length);
      if (!(k in DEFAULTS) || areaFor(k) !== area || dirty.has(k) || inflight.has(k)) return;
      const v = changes[key].newValue;
      patch[k] = v === undefined ? DEFAULTS[k] : v;
    });
    if (!Object.keys(patch).length) return;
    const next = withDefaults({ ...state, ...patch });
    if (JSON.stringify(next) === JSON.stringify(state)) return;
    state = next;
    emit();
  });
} catch (e) {
  // not in an extension context
}

window.addEventListener('pagehide', () => {
  flush();
});

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useSettings = () => useSyncExternalStore(subscribe, getSettings);
export const useStorageProblem = () => useSyncExternalStore(subscribe, getStorageProblem);
