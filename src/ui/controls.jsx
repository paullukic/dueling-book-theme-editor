import { useId } from 'react';

export const Group = ({ title, children }) => (
  <section className="group">
    {title && <h2>{title}</h2>}
    {children}
  </section>
);

// A labelled on/off row. The label and the switch both toggle it.
export const ToggleRow = ({ label, description, checked, onChange, children }) => {
  const id = useId();
  return (
    <>
      <div className="row">
        <div className="row-text">
          <label className="row-label" htmlFor={id}>
            {label}
          </label>
          {description && (
            <span className="row-desc" id={`${id}-d`}>
              {description}
            </span>
          )}
        </div>
        <button
          id={id}
          type="button"
          role="switch"
          className="switch"
          aria-checked={checked ? 'true' : 'false'}
          aria-describedby={description ? `${id}-d` : undefined}
          onClick={() => onChange(!checked)}
        />
      </div>
      {checked && children && <div className="sub">{children}</div>}
    </>
  );
};

export const SliderRow = ({ label, value, min, max, step, format = String, onChange }) => {
  const id = useId();
  return (
    <div className="slider-row">
      <label htmlFor={id}>{label}</label>
      <output htmlFor={id}>{format(value)}</output>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};

export const ColorRow = ({ label, value, onChange }) => {
  const id = useId();
  return (
    <div className="color-row">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};
