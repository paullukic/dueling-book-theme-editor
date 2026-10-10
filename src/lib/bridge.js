import { useSyncExternalStore } from 'react';

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
let received = false;
const stateListeners = new Set();
const deckWaiters = new Set();

window.addEventListener('message', (e) => {
  if (e.source !== window || !e.data || e.data.source !== FROM_BRIDGE) return;
  const { type, payload } = e.data;
  if (type === 'state' && payload && typeof payload === 'object') {
    // The first report is where things already are (e.g. mid-duel after a
    // reload), not a change: listeners see it with prev === next.
    const next = { ...EMPTY, ...payload };
    const prev = received ? duelState : next;
    received = true;
    duelState = next;
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
