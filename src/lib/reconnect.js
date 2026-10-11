// Decisions for "Reconnect automatically". Pure, so they can be tested.

// DuelingBook's connection screens (#frames > #id).
const RECONNECT_FRAMES = ['lost_conn2', 'closed', 'over_limit'];
// DuelingBook is retrying on its own here; step in only if it gets stuck.
const SELF_RETRY_FRAMES = ['lost_conn'];
// Never fight these: another session, a moderator or the user's own idle timeout.
const STOP_FRAMES = ['already_logged_in', 'kicked', 'banned', 'timed_out', 'terminated', 'rejected'];

export const SELF_RETRY_GRACE_MS = 20000;
export const DELAYS_S = [5, 10, 20, 40, 60];
export const STABLE_MS = 60000;

// 'lost' | 'self-retry' | 'stop' | 'ok'
export const connectionStatus = ({ frame, message, inDuel }) => {
  if (STOP_FRAMES.includes(frame)) return 'stop';
  if (message && /elsewhere|kicked|banned|terminated/i.test(message)) return 'stop';
  if (RECONNECT_FRAMES.includes(frame)) return 'lost';
  if (SELF_RETRY_FRAMES.includes(frame)) return 'self-retry';
  // "Error 1006 / Lost Connection" pop-up; in a duel DuelingBook reconnects itself.
  if (!inDuel && message && /lost connection/i.test(message)) return 'lost';
  return 'ok';
};

// Seconds to wait before the next attempt, or null once every attempt is used.
export const nextDelay = (attempts) => (attempts < DELAYS_S.length ? DELAYS_S[attempts] : null);
