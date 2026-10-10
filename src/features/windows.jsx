import { useEffect, useRef, useState } from 'react';
import { getSettings, updateSettings, useSettings } from '../lib/settings';
import { useLocal } from '../lib/localStore';
import { useTabState } from '../lib/session';
import { onDuelState } from '../lib/bridge';
import FloatingWindow from '../ui/FloatingWindow';
import { TrashIcon } from '../ui/icons';

export const NotesWindow = () => {
  const { notesEnabled } = useSettings();
  const [text, setText] = useLocal('notes', '');
  if (!notesEnabled) return null;
  return (
    <FloatingWindow
      id="notes"
      title="Notes"
      defaultPos={{ x: 16, y: 120 }}
      width={250}
      onClose={() => updateSettings({ notesEnabled: false })}
    >
      <label className="sr-only" htmlFor="dbte-notes">
        Notes
      </label>
      <textarea
        id="dbte-notes"
        className="field"
        value={text}
        placeholder="Opponent’s deck, combo lines, things to remember…"
        onChange={(e) => setText(e.target.value)}
      />
    </FloatingWindow>
  );
};

const ACTION_WORDS = /\b(added|set|placed|revealed|returned|activated|banished|sent)\b/i;
const MAX_LOG = 300;

// "[12:34] Added "Ash Blossom" from Deck to hand" -> pieces for rendering.
const parseEntry = (text) => {
  const ts = text.match(/^\[(\d{1,2}:\d{2}(?::\d{2})?)\]\s*/);
  const rest = ts ? text.slice(ts[0].length) : text;
  const quoted = rest.match(/"(.+)"/);
  if (quoted) {
    return {
      time: ts && ts[1],
      before: rest.slice(0, quoted.index),
      card: quoted[1],
      after: rest.slice(quoted.index + quoted[0].length),
    };
  }
  const m = rest.match(/\b(Added|Set|Placed|Revealed|Returned)\s+(.+?)(?=\s+from\s+|\s+in\s+|\s+to\s+|$)/i);
  if (m) {
    return {
      time: ts && ts[1],
      before: rest.slice(0, m.index) + m[1] + ' ',
      card: m[2],
      after: rest.slice(m.index + m[0].length),
    };
  }
  return { time: ts && ts[1], before: rest, card: null, after: '' };
};

const useTrackerCapture = (enabled, setItems, setHand) => {
  useEffect(() => {
    if (!enabled) return undefined;

    const capture = (font) => {
      if ((font.getAttribute('color') || '').toUpperCase() !== '#0000FF') return;
      if (!font.closest('.log_txt')) return;
      const text = (font.textContent || '').trim();
      if (!text || !ACTION_WORDS.test(text)) return;
      setItems((prev) => (prev.includes(text) ? prev : [...prev, text].slice(-MAX_LOG)));
    };

    const scanView = () => {
      const view = document.getElementById('view');
      const title = view && view.querySelector('.title_txt');
      if (!title || !/viewing opponent's hand/i.test(title.textContent || '')) return;
      const counts = {};
      view.querySelectorAll('.name_txt').forEach((n) => {
        const name = (n.textContent || '').trim();
        if (name) counts[name] = (counts[name] || 0) + 1;
      });
      if (Object.keys(counts).length) setHand({ counts, at: Date.now() });
    };

    document.querySelectorAll('.log_txt font[color]').forEach(capture);
    let viewTimer = null;
    const observer = new MutationObserver((mutations) => {
      let viewTouched = false;
      for (const m of mutations) {
        const t = m.target.nodeType === 1 ? m.target : m.target.parentElement;
        if (t && t.closest && t.closest('#view')) viewTouched = true;
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.tagName === 'FONT') capture(node);
          else node.querySelectorAll && node.querySelectorAll('font[color]').forEach(capture);
        });
      }
      if (viewTouched) {
        clearTimeout(viewTimer);
        viewTimer = setTimeout(scanView, 150);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    const offDuel = onDuelState((next, prev) => {
      if (next.inDuelScreen && !prev.inDuelScreen && getSettings().trackerAutoClear) {
        setItems([]);
        setHand({ counts: {}, at: 0 });
      }
    });

    return () => {
      observer.disconnect();
      clearTimeout(viewTimer);
      offDuel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
};

export const TrackerWindow = () => {
  const { trackerEnabled } = useSettings();
  const [items, setItems] = useTabState('tracker', []);
  const [hand, setHand] = useTabState('revealedHand', { counts: {}, at: 0 });
  const [undo, setUndo] = useState(null);
  const listRef = useRef(null);
  useTrackerCapture(trackerEnabled, setItems, setHand);

  useEffect(() => {
    if (items.length > 0 && undo) setUndo(null);
  }, [items.length, undo]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [items.length]);

  if (!trackerEnabled) return null;
  const handNames = Object.keys(hand.counts || {}).sort((a, b) => a.localeCompare(b));
  const handTotal = handNames.reduce((n, k) => n + hand.counts[k], 0);

  return (
    <>
      <FloatingWindow
        id="tracker"
        title="Action log"
        badge={items.length || null}
        defaultPos={{ x: 300, y: 120 }}
        width={280}
        onClose={() => updateSettings({ trackerEnabled: false })}
        actions={
          items.length > 0 && (
            <button
              type="button"
              className="icon-btn"
              onClick={() => {
                setUndo(items);
                setItems([]);
              }}
              aria-label="Clear the action log"
            >
              <TrashIcon />
            </button>
          )
        }
      >
        {undo && items.length === 0 && (
          <div className="btn-row">
            <span className="note">Log cleared.</span>
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => {
                setItems(undo);
                setUndo(null);
              }}
            >
              Undo
            </button>
          </div>
        )}
        {items.length === 0 ? (
          !undo && <p className="empty">Cards added, set, revealed or returned during the duel show up here.</p>
        ) : (
          <ul className="log" ref={listRef} style={{ maxHeight: 260, overflowY: 'auto' }}>
            {items.map((text, i) => {
              const p = parseEntry(text);
              return (
                <li key={`${i}-${text}`}>
                  {p.time && <time>{p.time}</time>}
                  <span className="text">
                    {p.before}
                    {p.card && <span className="cardname">{p.card}</span>}
                    {p.after}
                  </span>
                  <button
                    type="button"
                    className="remove"
                    aria-label="Remove this entry"
                    onClick={() => setItems((prev) => prev.filter((_, j) => j !== i))}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </FloatingWindow>
      {handTotal > 0 && (
        <FloatingWindow
          id="hand"
          title="Opponent’s revealed hand"
          badge={handTotal}
          defaultPos={{ x: 300, y: 430 }}
          width={250}
          onClose={() => setHand({ counts: {}, at: 0 })}
          closeLabel="Clear the revealed hand"
        >
          <ul className="log">
            {handNames.map((name) => (
              <li key={name}>
                <span className="text">
                  <span className="cardname">{name}</span>
                  {hand.counts[name] > 1 && ` ×${hand.counts[name]}`}
                </span>
              </li>
            ))}
          </ul>
        </FloatingWindow>
      )}
    </>
  );
};
