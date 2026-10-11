import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../lib/settings';
import { isVisible } from '../lib/dom';
import { DELAYS_S, STABLE_MS, SELF_RETRY_GRACE_MS, connectionStatus, nextDelay } from '../lib/reconnect';

// Per tab, so a reload loop cannot outlive the tab and other tabs are unaffected.
const STATE_KEY = 'dbte:reconnect';
export const CONNECT_ONCE_KEY = 'dbte:connect-once';

const readState = () => {
  try {
    const s = JSON.parse(sessionStorage.getItem(STATE_KEY) || '{}');
    return { attempts: Number(s.attempts) || 0, lastAt: Number(s.lastAt) || 0 };
  } catch (e) {
    return { attempts: 0, lastAt: 0 };
  }
};

const writeState = (s) => {
  try {
    if (s.attempts) sessionStorage.setItem(STATE_KEY, JSON.stringify(s));
    else sessionStorage.removeItem(STATE_KEY);
  } catch (e) {
    // private mode: no backoff memory, attempts still capped per page
  }
};

// True once after a reconnect reload: the skip-intro routine then presses DUEL.
export const takeConnectOnce = () => {
  try {
    const v = sessionStorage.getItem(CONNECT_ONCE_KEY);
    sessionStorage.removeItem(CONNECT_ONCE_KEY);
    return v === '1';
  } catch (e) {
    return false;
  }
};

const currentFrame = () => {
  const frames = document.getElementById('frames');
  if (!frames) return null;
  const el = [...frames.children].find((f) => f.style.display !== 'none' && isVisible(f));
  return el ? el.id : null;
};

const currentMessage = () => {
  const msg = document.getElementById('msg');
  return isVisible(msg) ? msg.textContent.replace(/\s+/g, ' ').trim() : '';
};

const reconnectNow = (state) => {
  writeState({ attempts: state.attempts + 1, lastAt: Date.now() });
  try {
    sessionStorage.setItem(CONNECT_ONCE_KEY, '1');
  } catch (e) {
    // the user presses DUEL themselves
  }
  window.location.reload();
};

// Watches for a dropped connection and offers (then performs) a reload.
const ReconnectNotice = () => {
  const { autoReconnect } = useSettings();
  const [notice, setNotice] = useState(null); // { left } | { gaveUp: true }
  const cancelled = useRef(false);
  const selfRetrySince = useRef(0);
  const okSince = useRef(0);

  useEffect(() => {
    if (!autoReconnect) {
      setNotice(null);
      return undefined;
    }
    let countdown = null; // seconds left, while counting
    const tick = () => {
      const frame = currentFrame();
      let status = connectionStatus({ frame, message: currentMessage(), inDuel: frame === 'duel' });
      const now = Date.now();
      if (status === 'self-retry') {
        if (!selfRetrySince.current) selfRetrySince.current = now;
        status = now - selfRetrySince.current > SELF_RETRY_GRACE_MS ? 'lost' : 'ok-wait';
      } else selfRetrySince.current = 0;

      if (status !== 'lost') {
        countdown = null;
        setNotice(null);
        if (status === 'stop') {
          writeState({ attempts: 0, lastAt: 0 });
          return;
        }
        // Connected long enough: forget earlier attempts.
        if (status === 'ok' && frame && frame !== 'connecting' && frame !== 'start') {
          if (!okSince.current) okSince.current = now;
          if (now - okSince.current > STABLE_MS) writeState({ attempts: 0, lastAt: 0 });
        } else okSince.current = 0;
        return;
      }
      okSince.current = 0;
      if (cancelled.current) return;
      const state = readState();
      if (countdown === null) {
        const delay = nextDelay(state.attempts);
        if (delay === null) {
          setNotice({ gaveUp: true });
          return;
        }
        countdown = delay;
      } else countdown -= 1;
      if (countdown <= 0) {
        reconnectNow(state);
        return;
      }
      setNotice({ left: countdown });
    };
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [autoReconnect]);

  if (!notice) return null;
  if (notice.gaveUp) {
    return (
      <div className="toast toast-action" role="alert">
        <span>Could not reconnect after {DELAYS_S.length} tries.</span>
        <button
          type="button"
          className="btn"
          onClick={() => {
            writeState({ attempts: 0, lastAt: 0 });
            reconnectNow({ attempts: 0 });
          }}
        >
          Try again
        </button>
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() => {
            cancelled.current = true;
            setNotice(null);
          }}
        >
          Dismiss
        </button>
      </div>
    );
  }
  return (
    <div className="toast toast-action" role="status">
      <span>Connection lost. Reconnecting in {notice.left} s…</span>
      <button type="button" className="btn" onClick={() => reconnectNow(readState())}>
        Now
      </button>
      <button
        type="button"
        className="btn btn-quiet"
        onClick={() => {
          cancelled.current = true;
          setNotice(null);
        }}
      >
        Cancel
      </button>
    </div>
  );
};

export default ReconnectNotice;
