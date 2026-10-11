// Pure life point logic: no DOM, so the tests can run it.

// DuelingBook's lost-life bar is this wide at 0 LP (3000 of 8000 lost = 57.75px).
export const FULL_BAR_PX = 154;
export const LOW_RATIO = 0.25;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

// "8000" -> 8000; anything without a number -> null.
export const parseLp = (text) => {
  const m = /-?\d+/.exec(String(text == null ? '' : text).replace(/[\s,.]/g, ''));
  return m ? Number(m[0]) : null;
};

// The life left (0-1) from the black bar's inline width ("57.75px").
// No inline width yet means a fresh duel: full.
export const lifeRatio = (blackWidth) => {
  const px = parseFloat(blackWidth);
  return Number.isFinite(px) ? clamp01(1 - px / FULL_BAR_PX) : 1;
};

// 'hit' when life went down, 'heal' when up, null otherwise or when unknown.
// A rise from 0 or back to a full bar is a new duel, not a heal.
export const lpChange = (prev, next, ratio = 0) => {
  if (prev == null || next == null || prev === next) return null;
  if (next < prev) return 'hit';
  return prev === 0 || ratio >= 1 ? null : 'heal';
};

// 'zero' at 0, 'low' under a quarter of the starting life, else null.
export const lpLevel = (value, ratio) => {
  if (value === 0) return 'zero';
  if (value != null && value > 0 && ratio < LOW_RATIO) return 'low';
  return null;
};

// Five digits: styles with wide numerals squeeze them to fit their window.
export const WIDE_LP = 10000;

// The state attribute value: the running pulse, the level, then "wide".
export const lpState = (pulse, level, wide = false) => [pulse, level, wide && 'wide'].filter(Boolean).join(' ');
