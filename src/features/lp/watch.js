import { LP_VAR, STATE_ATTR } from './kit.js';
import { WIDE_LP, lifeRatio, lpChange, lpLevel, lpState, parseLp } from './logic.js';

const PULSE_MS = 900; // a hit or heal glow, from the last change of a count

// Follows one side's life: DuelingBook animates the lost-life bar's inline
// width and counts the number up or down. Writes the life left as a CSS
// variable and the state (effects, and "wide" for five digits) as an
// attribute on that side's .lifepoints.
// Only the bar's style and the number are observed, never .lifepoints itself,
// so these writes never wake the observer.
export const watchSide = (box, effects) => {
  const black = box.querySelector('.black_bar');
  const txt = box.querySelector('.life_txt');
  if (!black || !txt) return () => {};
  let prev = parseLp(txt.textContent);
  let pulse = null;
  let timer = null;

  const update = (counted) => {
    const ratio = lifeRatio(black.style.width);
    box.style.setProperty(LP_VAR, ratio.toFixed(3));
    const value = parseLp(txt.textContent);
    if (effects && counted) {
      const change = lpChange(prev, value, ratio);
      prev = value;
      if (change) {
        pulse = change;
        clearTimeout(timer);
        timer = setTimeout(() => {
          pulse = null;
          update(false);
        }, PULSE_MS);
      }
    }
    const state = lpState(pulse, effects ? lpLevel(value, ratio) : null, value >= WIDE_LP);
    if ((box.getAttribute(STATE_ATTR) || '') === state) return;
    if (state) box.setAttribute(STATE_ATTR, state);
    else box.removeAttribute(STATE_ATTR);
  };

  const barObs = new MutationObserver(() => update(false));
  barObs.observe(black, { attributes: true, attributeFilter: ['style'] });
  const txtObs = new MutationObserver(() => update(true));
  txtObs.observe(txt, { childList: true, characterData: true, subtree: true });
  update(false);
  return () => {
    barObs.disconnect();
    txtObs.disconnect();
    clearTimeout(timer);
    box.style.removeProperty(LP_VAR);
    box.removeAttribute(STATE_ATTR);
  };
};
