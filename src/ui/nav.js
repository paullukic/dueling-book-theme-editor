import { useSyncExternalStore } from 'react';

// Panel navigation that search can drive: the Theme sub-view and the gallery's
// filter. Kept for as long as the page is open, so reopening the panel finds
// things where they were left.
let state = { themeView: 'style', galleryFilter: 'all', galleryQuery: '' };
const listeners = new Set();

export const setNav = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useNav = () => useSyncExternalStore(subscribe, () => state);
