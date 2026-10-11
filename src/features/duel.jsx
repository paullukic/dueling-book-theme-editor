import { useEffect, useRef } from 'react';
import { getSettings, useSettings } from '../lib/settings';
import { hasModifier, isTypingEvent, isVisible, sendDuelChat } from '../lib/dom';
import { onDuelState, setAnimationSpeed } from '../lib/bridge';
import { alertUser } from '../lib/notify';
import { takeConnectOnce } from './reconnect';

export const CUSTOM_PREFIX = 'custom_chat_';

export const PHASES = [
  { id: 'draw_phase', label: 'Draw Phase', el: 'dp' },
  { id: 'standby_phase', label: 'Standby Phase', el: 'sp' },
  { id: 'main1_phase', label: 'Main Phase 1', el: 'm1' },
  { id: 'battle_phase', label: 'Battle Phase', el: 'bp' },
  { id: 'main2_phase', label: 'Main Phase 2', el: 'm2' },
  { id: 'end_phase', label: 'End Phase', el: 'ep' },
];

export const ACTIONS = [
  { id: 'good_btn', label: 'Signal OK' },
  { id: 'shuffle_btn', label: 'Shuffle hand' },
  { id: 'think_btn', label: 'Thinking' },
  { id: 'draw_action', label: 'Draw 1 card', chat: '/draw 1' },
  { id: 'mill_action', label: 'Mill 1 card', chat: '/mill 1' },
  { id: 'discard_action', label: 'Discard a random card', chat: '/discardrandom' },
  { id: 'half_action', label: 'Halve your Life Points', chat: '/half' },
  { id: 'nibiru_action', label: 'Post Nibiru token stats' },
];

// Sums the ATK/DEF shown under every monster on the field.
const nibiruStats = () => {
  const field = document.getElementById('duel_content');
  if (!field) return null;
  let atk = 0;
  let def = 0;
  field.querySelectorAll('span').forEach((span) => {
    const m = span.textContent.trim().match(/^(\d+)\/(\d+)$/);
    if (m) {
      atk += parseInt(m[1], 10);
      def += parseInt(m[2], 10);
    }
  });
  return `Nibiru Token ATK:${atk} DEF:${def}`;
};

export const runAction = (id, settings) => {
  const phase = PHASES.find((p) => p.id === id);
  if (phase) {
    sendDuelChat(`${phase.label}?`);
    const el = document.getElementById(phase.el);
    if (el) el.click();
    return;
  }
  if (id.startsWith(CUSTOM_PREFIX)) {
    const msg = settings.customChatMessages[Number(id.slice(CUSTOM_PREFIX.length)) - 1];
    if (msg) sendDuelChat(msg);
    return;
  }
  if (id === 'nibiru_action') {
    const msg = nibiruStats();
    if (msg) sendDuelChat(msg);
    return;
  }
  const action = ACTIONS.find((a) => a.id === id);
  if (action && action.chat) {
    sendDuelChat(action.chat);
    return;
  }
  // Only the listed buttons: an imported settings file cannot bind a key to
  // any other element on the page (log out, surrender, ...).
  if (!action) return;
  const btn = document.getElementById(id);
  if (btn) btn.click();
};

export const ShortcutsEffect = () => {
  const { shortcutsEnabled } = useSettings();
  useEffect(() => {
    if (!shortcutsEnabled) return undefined;
    const onKey = (e) => {
      if (e.repeat || e.shiftKey || hasModifier(e) || isTypingEvent(e)) return;
      if (!isVisible(document.getElementById('duel'))) return;
      const settings = getSettings();
      const id = settings.shortcutKeys[e.key.toLowerCase()];
      if (!id) return;
      e.preventDefault();
      runAction(id, settings);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [shortcutsEnabled]);
  return null;
};

// Runs once per page load, and only if the setting was on when the page opened,
// so switching it on mid-session never clicks anything unexpectedly.
// The intro's Skip button appears a few seconds after load and the DUEL button
// only after skipping, so poll for each to become visible.
export const SkipIntroEffect = () => {
  const ran = useRef(false);
  useEffect(() => {
    // After an automatic reconnect, connect once even if "Skip the intro" is off.
    const connectOnce = takeConnectOnce();
    if (ran.current || !(getSettings().skipIntro || connectOnce)) return undefined;
    ran.current = true;
    const started = Date.now();
    let skipped = false;
    const timer = setInterval(() => {
      if (Date.now() - started > 30000 || isVisible(document.getElementById('menu_content'))) {
        clearInterval(timer);
        return;
      }
      const skip = document.getElementById('skip_intro_btn');
      if (!skipped && isVisible(skip)) {
        skip.click();
        skipped = true;
        return;
      }
      const duel = document.getElementById('duel_btn');
      if (isVisible(duel)) {
        duel.click();
        clearInterval(timer);
      }
    }, 250);
    return () => clearInterval(timer);
  }, []);
  return null;
};

export const AnimationSpeedEffect = () => {
  const { animationSpeed } = useSettings();
  useEffect(() => {
    if (animationSpeed === 1) return undefined;
    setAnimationSpeed(animationSpeed);
    // The site can reset its timeline between duels; re-assert it.
    const off = onDuelState((next, prev) => {
      if (next.inDuelScreen !== prev.inDuelScreen) setAnimationSpeed(animationSpeed);
    });
    return () => {
      off();
      setAnimationSpeed(1);
    };
  }, [animationSpeed]);
  return null;
};

export const AlertsEffect = () => {
  const { alertDuelFound, alertMyTurn } = useSettings();
  useEffect(() => {
    if (!alertDuelFound && !alertMyTurn) return undefined;
    return onDuelState((next, prev) => {
      const settings = getSettings();
      if (settings.alertDuelFound && next.playing && !prev.playing) {
        alertUser(settings, 'Duel found!', next.opponent ? `Your opponent is ${next.opponent}.` : 'Your duel is starting.');
        return;
      }
      if (
        settings.alertMyTurn &&
        next.playing &&
        next.myTurn &&
        (!prev.myTurn || next.turnCount !== prev.turnCount)
      ) {
        alertUser(settings, 'Your turn!', next.turnCount ? `Turn ${next.turnCount} has started.` : 'It is your turn.');
      }
    });
  }, [alertDuelFound, alertMyTurn]);
  return null;
};
