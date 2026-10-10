import { useEffect, useRef, useState } from 'react';
import { useSettings, updateSettings } from '../lib/settings';
import { CloseIcon } from './icons';

const MARGIN = 8;
const KEY_STEP = 10;

// Keep at least the title bar on screen.
const clamp = (pos, el) => {
  const w = el ? el.offsetWidth : 260;
  return {
    x: Math.min(Math.max(MARGIN, pos.x), Math.max(MARGIN, window.innerWidth - w - MARGIN)),
    y: Math.min(Math.max(MARGIN, pos.y), Math.max(MARGIN, window.innerHeight - 40)),
  };
};

// Movable tool window inside the shadow root. Drag the title bar, or focus it
// and use the arrow keys (Shift for bigger steps). The position is saved per
// id and kept on screen when the browser window shrinks.
const FloatingWindow = ({ id, title, badge, defaultPos, width = 260, onClose, closeLabel, actions, children }) => {
  const settings = useSettings();
  const saved = settings.windows[id];
  const ref = useRef(null);
  const [pos, setPos] = useState(() => saved || defaultPos);
  const posRef = useRef(pos);
  posRef.current = pos;
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

  const save = (p) => updateSettings((s) => ({ windows: { ...s.windows, [id]: p } }));

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
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    save(clamp(posRef.current, ref.current));
  };

  const onKeyDown = (e) => {
    const step = e.shiftKey ? KEY_STEP * 5 : KEY_STEP;
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!d || e.target !== e.currentTarget) return;
    e.preventDefault();
    const next = clamp({ x: posRef.current.x + d[0], y: posRef.current.y + d[1] }, ref.current);
    setPos(next);
    save(next);
  };

  return (
    <section ref={ref} className="window" aria-label={title} style={{ left: pos.x, top: pos.y, width }}>
      <div
        className="window-bar"
        tabIndex={0}
        title="Drag to move, or use the arrow keys"
        aria-label={`${title}: drag or use arrow keys to move`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <h2>{title}</h2>
        {badge != null && <span className="badge">{badge}</span>}
        {actions}
        {onClose && (
          <button type="button" className="icon-btn" onClick={onClose} aria-label={closeLabel || `Close ${title}`}>
            <CloseIcon />
          </button>
        )}
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
};

export default FloatingWindow;
