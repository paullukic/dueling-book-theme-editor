import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { classifyStorageError } from './storageErrors';

// Per-key value in chrome.storage.local (5 MB budget, no write quota) for
// bulky data: notes text, the action log, the background image.
// Writes are debounced; other tabs pick changes up through onChanged.

const PREFIX = 'dbte:';
const WRITE_DELAY_MS = 400;

const timers = new Map();
const pending = new Map();
const problemListeners = new Set();
let problem = null; // 'quota' | 'other' | null

const setProblem = (p) => {
  if (problem === p) return;
  problem = p;
  problemListeners.forEach((l) => l());
};

// Resolves true once the value is stored. A failed write stays pending so the
// next change or page exit retries it, and the panel shows the problem.
const write = (key) =>
  new Promise((resolve) => {
    timers.delete(key);
    if (!pending.has(key)) {
      resolve(true);
      return;
    }
    const value = pending.get(key);
    try {
      chrome.storage.local.set({ [PREFIX + key]: value }, () => {
        const err = chrome.runtime.lastError;
        if (err) {
          console.error(`[DB Theme Editor] could not save ${key}:`, err.message);
          const kind = classifyStorageError(err.message);
          setProblem(kind === 'quota' ? 'quota' : 'other');
          if (kind !== 'quota' && !timers.has(key)) timers.set(key, setTimeout(() => write(key), 15000));
          resolve(false);
          return;
        }
        if (pending.get(key) === value) pending.delete(key);
        if (![...pending.keys()].length) setProblem(null);
        resolve(true);
      });
    } catch (e) {
      resolve(false); // orphaned after an extension reload
    }
  });

export const setLocal = (key, value, { immediate = false } = {}) => {
  pending.set(key, value);
  if (timers.has(key)) clearTimeout(timers.get(key));
  if (immediate) return write(key);
  timers.set(key, setTimeout(() => write(key), WRITE_DELAY_MS));
  return undefined;
};

export const setLocalConfirmed = (key, value) => setLocal(key, value, { immediate: true });

export const removeLocalRaw = (keys) =>
  new Promise((resolve) => {
    try {
      chrome.storage.local.remove(keys, () => resolve(!chrome.runtime.lastError));
    } catch (e) {
      resolve(false);
    }
  });

export const useLocalProblem = () =>
  useSyncExternalStore(
    (l) => {
      problemListeners.add(l);
      return () => problemListeners.delete(l);
    },
    () => problem,
  );

export const getLocal = (key) =>
  new Promise((resolve) => {
    try {
      chrome.storage.local.get(PREFIX + key, (res) => {
        resolve(chrome.runtime.lastError ? undefined : res[PREFIX + key]);
      });
    } catch (e) {
      resolve(undefined);
    }
  });

window.addEventListener('pagehide', () => {
  [...pending.keys()].forEach(write);
});

// Read-modify-write against what is stored (or about to be stored), one at a
// time per tab, so several components editing the same key never undo each
// other's changes.
// Like getLocal, but tells "nothing stored" ({ ok: true, value: undefined })
// apart from "could not read" ({ ok: false }).
const readLocal = (key) =>
  new Promise((resolve) => {
    try {
      chrome.storage.local.get(PREFIX + key, (res) => {
        resolve(chrome.runtime.lastError ? { ok: false } : { ok: true, value: res[PREFIX + key] });
      });
    } catch (e) {
      resolve({ ok: false });
    }
  });

// Resolves true once written, false when the stored value could not be read
// (then nothing is written, so a failed read never wipes what is stored).
let chain = Promise.resolve();
export const mutateLocal = (key, fn) => {
  const run = chain.then(async () => {
    let current;
    if (pending.has(key)) current = pending.get(key);
    else {
      const read = await readLocal(key);
      if (!read.ok) return false;
      current = read.value;
    }
    setLocal(key, fn(current), { immediate: true });
    return true;
  });
  chain = run.catch(() => false);
  return run;
};

// [value, setValue, loaded]. Function updates are applied to the stored value
// (see mutateLocal); plain values replace it.
// A stored value only counts when it has the same shape as the default, so a
// damaged entry (say a number where text belongs) cannot crash the panel.
const sameShape = (v, initial) =>
  initial === undefined || (Array.isArray(initial) ? Array.isArray(v) : typeof v === typeof initial && (v === null) === (initial === null));

export const useLocal = (key, initial) => {
  const [value, setValue] = useState(initial);
  const [loaded, setLoaded] = useState(false);
  const valueRef = useRef(value);
  const touched = useRef(false);
  valueRef.current = value;

  useEffect(() => {
    let alive = true;
    getLocal(key).then((stored) => {
      if (!alive) return;
      if (!touched.current) {
        const v = stored !== undefined && sameShape(stored, initial) ? stored : initial;
        valueRef.current = v;
        setValue(v);
      }
      setLoaded(true);
    });
    const onChanged = (changes, area) => {
      if (area !== 'local' || !changes[PREFIX + key]) return;
      const v = changes[PREFIX + key].newValue;
      // A newer local edit is still waiting to be written: keep it.
      if (pending.has(key) && JSON.stringify(pending.get(key)) !== JSON.stringify(v)) return;
      if (JSON.stringify(v) !== JSON.stringify(valueRef.current)) {
        valueRef.current = v === undefined || !sameShape(v, initial) ? initial : v;
        setValue(valueRef.current);
      }
    };
    chrome.storage.onChanged.addListener(onChanged);
    return () => {
      alive = false;
      chrome.storage.onChanged.removeListener(onChanged);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = (next) => {
    touched.current = true;
    if (typeof next === 'function') {
      const optimistic = next(valueRef.current === undefined ? initial : valueRef.current);
      valueRef.current = optimistic;
      setValue(optimistic);
      mutateLocal(key, (cur) => next(cur === undefined ? initial : cur));
      return;
    }
    valueRef.current = next;
    setValue(next);
    setLocal(key, next);
  };

  return [value, update, loaded];
};
