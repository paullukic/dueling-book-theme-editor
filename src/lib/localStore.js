import { useEffect, useRef, useState } from 'react';

// Per-key value in chrome.storage.local (5 MB budget, no write quota) for
// bulky data: notes text, the action log, the background image.
// Writes are debounced; other tabs pick changes up through onChanged.

const PREFIX = 'dbte:';
const WRITE_DELAY_MS = 400;

const timers = new Map();
const pending = new Map();

const write = (key) => {
  timers.delete(key);
  if (!pending.has(key)) return;
  const value = pending.get(key);
  pending.delete(key);
  try {
    chrome.storage.local.set({ [PREFIX + key]: value }, () => {
      if (chrome.runtime.lastError) {
        console.error(`[DB Theme Editor] could not save ${key}:`, chrome.runtime.lastError.message);
      }
    });
  } catch (e) {
    // orphaned after an extension reload
  }
};

export const setLocal = (key, value, { immediate = false } = {}) => {
  pending.set(key, value);
  if (timers.has(key)) clearTimeout(timers.get(key));
  if (immediate) {
    write(key);
    return;
  }
  timers.set(key, setTimeout(() => write(key), WRITE_DELAY_MS));
};

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
let chain = Promise.resolve();
export const mutateLocal = (key, fn) => {
  chain = chain.then(async () => {
    const current = pending.has(key) ? pending.get(key) : await getLocal(key);
    setLocal(key, fn(current), { immediate: true });
  });
  return chain;
};

// [value, setValue, loaded]. Function updates are applied to the stored value
// (see mutateLocal); plain values replace it.
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
        const v = stored !== undefined ? stored : initial;
        valueRef.current = v;
        setValue(v);
      }
      setLoaded(true);
    });
    const onChanged = (changes, area) => {
      if (area !== 'local' || !changes[PREFIX + key] || pending.has(key)) return;
      const v = changes[PREFIX + key].newValue;
      if (JSON.stringify(v) !== JSON.stringify(valueRef.current)) {
        valueRef.current = v === undefined ? initial : v;
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
