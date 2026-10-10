import { useEffect, useState, useSyncExternalStore } from 'react';

// Talks to src/bridge.js, which runs in the page's own JavaScript world.
// Only messages from this window tagged by the bridge are accepted.

const FROM_BRIDGE = 'dbte-bridge';
const FROM_EXTENSION = 'dbte-ext';

const EMPTY = {
  me: null,
  inDuelScreen: false,
  playing: false,
  opponent: null,
  players: [],
  turnPlayer: null,
  myTurn: false,
  turnCount: null,
  phase: null,
  lifePoints: [],
  reconnecting: false,
  deckConstructor: false,
};

let duelState = EMPTY;
const stateListeners = new Set();
const deckWaiters = new Set();

window.addEventListener('message', (e) => {
  if (e.source !== window || !e.data || e.data.source !== FROM_BRIDGE) return;
  const { type, payload } = e.data;
  if (type === 'state' && payload && typeof payload === 'object') {
    const prev = duelState;
    duelState = { ...EMPTY, ...payload };
    stateListeners.forEach((l) => l(duelState, prev));
  } else if (type === 'deck') {
    deckWaiters.forEach((w) => w(payload));
    deckWaiters.clear();
  } else if (type === 'ready') {
    send('getState');
  }
});

export const send = (type, value) => {
  window.postMessage({ source: FROM_EXTENSION, type, value }, window.location.origin);
};

export const getDuelState = () => duelState;

// listener(next, prev) on every change
export const onDuelState = (listener) => {
  stateListeners.add(listener);
  return () => stateListeners.delete(listener);
};

export const useDuelState = () =>
  useSyncExternalStore((l) => onDuelState(() => l()), getDuelState);

export const requestDeck = (timeoutMs = 1500) =>
  new Promise((resolve) => {
    let done = false;
    const waiter = (deck) => {
      if (done) return;
      done = true;
      resolve(deck);
    };
    deckWaiters.add(waiter);
    send('getDeck');
    setTimeout(() => {
      deckWaiters.delete(waiter);
      waiter(null);
    }, timeoutMs);
  });

export const setAnimationSpeed = (n) => send('setTimeScale', n);

// Re-render on an interval while mounted (for "time ago" style labels).
export const useTick = (ms) => {
  const [, set] = useState(0);
  useEffect(() => {
    const t = setInterval(() => set((n) => n + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
};
