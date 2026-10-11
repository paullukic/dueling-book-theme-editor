// Where the corner launcher sits so it never covers DuelingBook's own corner
// buttons (mute, screenshot). Pure: takes the viewport size and the rects to
// avoid, returns the launcher's distance from the bottom edge in px.

export const LAUNCHER_SIZE = 42;
export const LAUNCHER_MARGIN = 14;
const GAP = 8;

export const launcherBottom = (viewport, avoid) => {
  const left = viewport.width - LAUNCHER_MARGIN - LAUNCHER_SIZE;
  const right = viewport.width - LAUNCHER_MARGIN;
  let bottom = LAUNCHER_MARGIN;
  // Re-check after each move: lifting above one button can land on another.
  for (let pass = 0; pass < avoid.length + 1; pass++) {
    const top = viewport.height - bottom - LAUNCHER_SIZE;
    const lower = viewport.height - bottom;
    const hit = avoid.find(
      (r) => r.width > 0 && r.height > 0 && r.left < right + GAP && r.right > left - GAP && r.top < lower + GAP && r.bottom > top - GAP,
    );
    if (!hit) break;
    bottom = viewport.height - hit.top + GAP;
  }
  return Math.min(bottom, Math.max(LAUNCHER_MARGIN, viewport.height - LAUNCHER_SIZE - LAUNCHER_MARGIN));
};
