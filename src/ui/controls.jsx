import { useId } from 'react';

export const Disclosure = ({ title, children }) => (
  <details className="sub disclosure">
    <summary>{title}</summary>
    {children}
  </details>
);

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
export const SliderRow = ({ label, value, min, max, step, values, format = String, onChange }) => {
  const id = useId();
  if (values) {
    const index = Math.max(0, values.indexOf(value));
    return (
      <div className="slider-row">
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
        aria-valuetext={format(value)}
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
