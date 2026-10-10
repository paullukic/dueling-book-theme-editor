// Runs in DuelingBook's own JavaScript world (manifest "world": "MAIN") so it can
// read the site's globals, which the isolated content script cannot see.
//
// Fair-play boundary: this only ever reports information every player can
// already see on screen (usernames, whose turn it is, turn number, phase, life
// points) and the user's own deck while they have it open in the Deck
// Constructor. It never reads hands, decks or face-down cards of other players.

(() => {
  if (window.__dbteBridge) return;
  window.__dbteBridge = true;

  const FROM_BRIDGE = 'dbte-bridge';
  const FROM_EXTENSION = 'dbte-ext';

  const post = (type, payload) => {
    window.postMessage({ source: FROM_BRIDGE, type, payload }, window.location.origin);
  };

  const safe = (read, fallback = null) => {
    try {
      const v = read();
      return v === undefined ? fallback : v;
    } catch (e) {
      return fallback;
    }
  };

  const isShown = (id) => {
    const el = document.getElementById(id);
    return !!el && el.offsetParent !== null;
  };

  const snapshot = () => {
    const me = safe(() => window.username, null);
    const p1 = safe(() => window.player1 && window.player1.username, null);
    const p2 = safe(() => window.player2 && window.player2.username, null);
    const turnPlayer = safe(() => window.turn_player && window.turn_player.username, null);
    const inDuelScreen = isShown('duel');
    const playing = inDuelScreen && !!me && (me === p1 || me === p2);
    const opponent = playing ? (me === p1 ? p2 : p1) : null;
    const lp = (n) => {
      const el = document.querySelector(`#lifepoints${n} .life_txt`);
      const v = el ? parseInt(el.textContent, 10) : NaN;
      return Number.isFinite(v) ? v : null;
    };
    return {
      me,
      inDuelScreen,
      playing,
      opponent,
      players: inDuelScreen ? [p1, p2] : [],
      turnPlayer: inDuelScreen ? turnPlayer : null,
      myTurn: playing && !!turnPlayer && turnPlayer === me,
      turnCount: inDuelScreen ? safe(() => Number(window.turnCount), null) : null,
      phase: inDuelScreen ? safe(() => String(window.currentPhase), null) : null,
      lifePoints: inDuelScreen ? [lp(1), lp(2)] : [],
      reconnecting: !!safe(() => window.reconnecting, false),
      deckConstructor: isShown('deck_constructor') || isShown('deck'),
    };
  };

  let last = '';
  const emitIfChanged = () => {
    const s = snapshot();
    const key = JSON.stringify(s);
    if (key === last) return;
    last = key;
    post('state', s);
  };

  // Wrap the site's turn/phase functions so state is reported the moment the
  // server pushes it, even in a background tab where timers are throttled.
  const HOOKS = ['startTurn', 'endTurn', 'updatePhase', 'initDuelistDuelStart', 'showStartTurn'];
  const wrapHooks = () => {
    for (const name of HOOKS) {
      const fn = window[name];
      if (typeof fn !== 'function' || fn.__dbteWrapped) continue;
      const wrapped = function (...args) {
        const result = fn.apply(this, args);
        try {
          emitIfChanged();
        } catch (e) {
          // never break the site
        }
        return result;
      };
      wrapped.__dbteWrapped = true;
      try {
        window[name] = wrapped;
      } catch (e) {
        // read-only binding; polling still covers it
      }
    }
  };

  const readDeck = () => {
    const $ = window.jQuery || window.$;
    const toCard = (slot) => {
      const el = slot && slot[0];
      const d = el && $ ? $(el).data() : null;
      if (!d || !d.name) return null;
      return {
        id: d.id != null ? String(d.id) : null,
        name: String(d.name),
        cardType: d.card_type ? String(d.card_type) : '',
        monsterColor: d.monster_color ? String(d.monster_color) : '',
        level: d.level != null ? Number(d.level) : null,
      };
    };
    const list = (arr) => (Array.isArray(arr) ? arr.map(toCard).filter(Boolean) : []);
    const main = list(safe(() => window.deck_filled_arr, []));
    const extra = list(safe(() => window.extra_filled_arr, []));
    const select = document.getElementById('decklist_cb');
    const deckName = select && select.selectedOptions[0] ? select.selectedOptions[0].textContent.trim() : '';
    return { main, extraCount: extra.length, deckName };
  };

  window.addEventListener('message', (e) => {
    if (e.source !== window || !e.data || e.data.source !== FROM_EXTENSION) return;
    const { type, value } = e.data;
    if (type === 'setTimeScale') {
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0.25 || n > 8) return;
      safe(() => window.TweenMax && window.TweenMax.globalTimeScale(n));
    } else if (type === 'getDeck') {
      post('deck', readDeck());
    } else if (type === 'getState') {
      last = '';
      emitIfChanged();
    }
  });

  // Duel screen shows/hides via style changes; observe them directly so a
  // found match is reported immediately in a hidden tab.
  const watchDuelScreen = () => {
    const duel = document.getElementById('duel');
    if (!duel) return false;
    new MutationObserver(emitIfChanged).observe(duel, { attributes: true, attributeFilter: ['style', 'class'] });
    return true;
  };

  wrapHooks();
  if (!watchDuelScreen()) {
    const retry = setInterval(() => {
      if (watchDuelScreen()) clearInterval(retry);
    }, 2000);
  }
  setInterval(() => {
    wrapHooks();
    emitIfChanged();
  }, 1000);
  post('ready', null);
  emitIfChanged();
})();
