import { updateSettings } from '../lib/settings';
import { useStyle } from '../features/look';
import { LP_STYLES, lpCss } from '../features/lp/index';
import { LP_VAR, fontFaces, previewScope } from '../features/lp/kit';
import { FULL_BAR_PX } from '../features/lp/logic';

const PREVIEW_LP = 4000;
const PREVIEW_RATIO = 0.5;

// Each style drawn on a copy of DuelingBook's LP markup, half your life gone.
const PREVIEW_CSS = LP_STYLES.map((s) => lpCss(s.id, previewScope(`lp-pv-${s.id}`))).join('\n');

const Preview = ({ id }) => (
  <span className={`lp-pv lp-pv-${id}`} aria-hidden="true">
    <span className="lifepoints is-self" style={{ [LP_VAR]: PREVIEW_RATIO }}>
      <span className="life_bar">
        <span className="black_bar" style={{ width: `${FULL_BAR_PX * (1 - PREVIEW_RATIO)}px` }} />
      </span>
      <span className="life_border" />
      <span className="life_txt">{PREVIEW_LP}</span>
    </span>
  </span>
);

const LpStylePicker = ({ value }) => {
  // The digit faces must be declared on the page (a shadow root cannot);
  // with a style on, its page sheet already declares them.
  useStyle('dbte-lp-fonts', value === 'theme' ? fontFaces : null);
  return (
    <div className="lp-styles" role="group" aria-labelledby="dbte-lp-style-label" data-place="lpStyle">
      <style>{PREVIEW_CSS}</style>
      <span id="dbte-lp-style-label" className="lp-styles-label">
        Life points style
      </span>
      <div className="lp-style-grid">
        {LP_STYLES.map((s) => (
          <button key={s.id} type="button" className="lp-style" aria-pressed={value === s.id} onClick={() => updateSettings({ lpStyle: s.id })}>
            <Preview id={s.id} />
            <span className="lp-style-name">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LpStylePicker;
