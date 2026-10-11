import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { placeById } from './places';
import { HelpIcon } from './icons';

// `place` names the control's entry in places.js: its label and description
// come from there unless passed in, and data-place lets search jump to it.
const copy = (place, label, description) => {
  const p = place ? placeById[place] : null;
  return {
    label: label !== undefined ? label : p && p.label,
    description: description !== undefined ? description : p && p.desc,
  };
};

export const Disclosure = ({ title, place, children }) => (
  <details className="sub disclosure" data-place={place}>
    <summary>{copy(place, title).label}</summary>
    {children}
  </details>
);

export const Group = ({ title, place, children }) => {
  const heading = copy(place, title).label;
  return (
    <section className="group" data-place={place}>
      {heading && <h2>{heading}</h2>}
      {children}
    </section>
  );
};

const TIP_MAX_WIDTH = 260;
const TIP_GAP = 6;
const TIP_EDGE = 8;

// A (?) next to a label: shows the description on hover, on keyboard focus,
// and on tap (stays open until tapped again, Esc, a tap elsewhere or a scroll).
// The text is always in the DOM so aria-describedby can point at it, and the
// bubble is clamped inside the panel, flipping above the (?) near the bottom.
export const InfoTip = ({ id, label, children }) => {
  const btnRef = useRef(null);
  const tipRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const open = hover || pinned;

  useLayoutEffect(() => {
    const btn = btnRef.current;
    const tip = tipRef.current;
    if (!btn || !tip) return;
    if (!open) {
      tip.removeAttribute('style');
      return;
    }
    const panel = btn.closest('.panel');
    const b = btn.getBoundingClientRect();
    const p = panel ? panel.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    const width = Math.min(TIP_MAX_WIDTH, p.right - p.left - TIP_EDGE * 2);
    tip.style.width = `${width}px`;
    const height = tip.offsetHeight;
    const centre = b.left + b.width / 2;
    const left = Math.min(Math.max(centre - width / 2, p.left + TIP_EDGE), p.right - TIP_EDGE - width);
    let top = b.bottom + TIP_GAP;
    const above = top + height > p.bottom - TIP_EDGE;
    if (above) top = Math.max(p.top + TIP_EDGE, b.top - TIP_GAP - height);
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    tip.style.setProperty('--tip-arrow', `${Math.round(centre - left)}px`);
    tip.classList.toggle('is-above', above);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const root = btnRef.current.getRootNode();
    const close = () => {
      setHover(false);
      setPinned(false);
    };
    const onDown = (e) => {
      if (!e.composedPath().includes(btnRef.current)) close();
    };
    root.addEventListener('pointerdown', onDown, true);
    root.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      root.removeEventListener('pointerdown', onDown, true);
      root.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="info-btn"
        aria-label={`About ${typeof label === 'string' ? label : 'this setting'}`}
        aria-describedby={id}
        aria-expanded={open}
        data-tip=""
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(false)}
        onFocus={(e) => e.currentTarget.matches(':focus-visible') && setHover(true)}
        onBlur={() => {
          setHover(false);
          setPinned(false);
        }}
        onClick={() => setPinned((v) => !v)}
        onKeyDown={(e) => {
          if (e.key !== 'Escape' || !open) return;
          e.preventDefault();
          setHover(false);
          setPinned(false);
        }}
      >
        <HelpIcon />
      </button>
      <span ref={tipRef} id={id} role="tooltip" className={open ? 'info-tip is-open' : 'info-tip'}>
        {children}
      </span>
    </>
  );
};

// A labelled on/off row. The label and the switch both toggle it. The
// description sits behind a (?); a `note` (a warning or a state the user must
// see) always shows.
export const ToggleRow = ({ place, checked, onChange, note, children, ...text }) => {
  const id = useId();
  const { label, description } = copy(place, text.label, text.description);
  const describedBy = [description && `${id}-d`, note && `${id}-n`].filter(Boolean).join(' ');
  return (
    <>
      <div className="row" data-place={place}>
        <div className="row-text">
          <span className="row-title">
            <label className="row-label" htmlFor={id}>
              {label}
            </label>
            {description && (
              <InfoTip id={`${id}-d`} label={label}>
                {description}
              </InfoTip>
            )}
          </span>
          {note && (
            <span className="row-note" id={`${id}-n`}>
              {note}
            </span>
          )}
        </div>
        <button
          id={id}
          type="button"
          role="switch"
          className="switch"
          aria-checked={checked ? 'true' : 'false'}
          aria-describedby={describedBy || undefined}
          aria-expanded={children ? (checked ? 'true' : 'false') : undefined}
          aria-controls={children && checked ? `${id}-sub` : undefined}
          onClick={() => onChange(!checked)}
        />
      </div>
      {checked && children && (
        <div className="sub" id={`${id}-sub`}>
          {children}
        </div>
      )}
    </>
  );
};

// `values` turns the slider into a list of fixed stops (e.g. Default, 10, 11…).
export const SliderRow = ({ place, value, min, max, step, values, format = String, onChange, ...text }) => {
  const id = useId();
  const { label } = copy(place, text.label);
  if (values) {
    const index = Math.max(0, values.indexOf(value));
    return (
      <div className="slider-row" data-place={place}>
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>{format(values[index])}</output>
        <input
          id={id}
          type="range"
          min={0}
          max={values.length - 1}
          step={1}
          value={index}
          aria-valuetext={format(values[index])}
          onChange={(e) => onChange(values[Number(e.target.value)])}
        />
      </div>
    );
  }
  return (
    <div className="slider-row" data-place={place}>
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id}>{format(value)}</output>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};

export const ColorRow = ({ place, value, onChange, ...text }) => {
  const id = useId();
  const { label } = copy(place, text.label);
  return (
    <div className="color-row" data-place={place}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};
