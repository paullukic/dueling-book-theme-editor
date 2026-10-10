import { useEffect, useRef, useState } from 'react';
import { useSettings, updateSettings } from '../lib/settings';
import { CloseIcon } from './icons';

const MARGIN = 8;

// Keep at least the title bar on screen.
const clamp = (pos, el) => {
  const w = el ? el.offsetWidth : 260;
  return {
    x: Math.min(Math.max(MARGIN, pos.x), Math.max(MARGIN, window.innerWidth - w - MARGIN)),
    y: Math.min(Math.max(MARGIN, pos.y), Math.max(MARGIN, window.innerHeight - 40)),
  };
};

// Draggable window inside the shadow root. Its position is saved per id and
// kept on screen when the browser window shrinks.
const FloatingWindow = ({ id, title, badge, defaultPos, width = 260, onClose, actions, children }) => {
  const settings = useSettings();
  const saved = settings.windows[id];
  const ref = useRef(null);
  const [pos, setPos] = useState(() => saved || defaultPos);
  const drag = useRef(null);

  useEffect(() => {
    if (!drag.current && saved && (saved.x !== pos.x || saved.y !== pos.y)) setPos(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved && saved.x, saved && saved.y]);

  useEffect(() => {
    const onResize = () => setPos((p) => clamp(p, ref.current));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onPointerDown = (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    const el = ref.current;
    drag.current = { dx: e.clientX - el.offsetLeft, dy: e.clientY - el.offsetTop };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!drag.current) return;
    setPos(clamp({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy }, ref.current));
  };

  const onPointerUp = (e) => {
    if (!drag.current) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    const final = clamp(pos, ref.current);
    updateSettings((s) => ({ windows: { ...s.windows, [id]: final } }));
  };

  return (
    <div
      ref={ref}
      className="window"
      role="dialog"
      aria-label={title}
      style={{ left: pos.x, top: pos.y, width }}
    >
      <div
        className="window-bar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <h2>{title}</h2>
        {badge != null && <span className="badge">{badge}</span>}
        {actions}
        {onClose && (
          <button type="button" className="icon-btn" onClick={onClose} aria-label={`Close ${title}`}>
            <CloseIcon />
          </button>
        )}
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
};

export default FloatingWindow;
