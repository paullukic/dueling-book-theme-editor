import { useRef, useState } from 'react';

// State that belongs to this tab only (a duel in progress), kept across page
// reloads of the same tab but never shared with other tabs.
const KEY = (k) => `dbte:${k}`;

const read = (key, initial) => {
  try {
    const raw = sessionStorage.getItem(KEY(key));
    return raw == null ? initial : JSON.parse(raw);
  } catch (e) {
    return initial;
  }
};

export const useTabState = (key, initial) => {
  const [value, setValue] = useState(() => read(key, initial));
  const ref = useRef(value);
  const update = (next) => {
    const v = typeof next === 'function' ? next(ref.current) : next;
    ref.current = v;
    setValue(v);
    try {
      sessionStorage.setItem(KEY(key), JSON.stringify(v));
    } catch (e) {
      // storage full or blocked: keep it in memory only
    }
  };
  return [value, update];
};
