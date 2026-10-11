import { useId } from 'react';
import { placeById } from './places';

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

// A labelled on/off row. The label and the switch both toggle it.
export const ToggleRow = ({ place, checked, onChange, children, ...text }) => {
  const id = useId();
  const { label, description } = copy(place, text.label, text.description);
  return (
    <>
      <div className="row" data-place={place}>
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
