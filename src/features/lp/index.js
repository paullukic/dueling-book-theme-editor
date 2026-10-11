// Life point styles: one module per style in ./styles/, default export
// (kit) -> CSS for the LP block. 'theme' draws nothing (the theme's own LP
// chrome, or DuelingBook's look without a theme).

import * as kit from './kit.js';
import plain from './styles/plain.js';
import dm from './styles/dm.js';
import gx from './styles/gx.js';
import fiveDs from './styles/5ds.js';
import zexal from './styles/zexal.js';
import arcv from './styles/arcv.js';
import vrains from './styles/vrains.js';
import rush from './styles/rush.js';

export const LP_STYLES = [
  { id: 'theme', label: 'Theme', make: null },
  { id: 'plain', label: 'Plain', make: plain },
  { id: 'dm', label: 'Duel Monsters', make: dm },
  { id: 'gx', label: 'GX', make: gx },
  { id: '5ds', label: '5D’s', make: fiveDs },
  { id: 'zexal', label: 'ZEXAL', make: zexal },
  { id: 'arcv', label: 'ARC-V', make: arcv },
  { id: 'vrains', label: 'VRAINS', make: vrains },
  { id: 'rush', label: 'Rush Duel', make: rush },
];

export const LP_STYLE_IDS = LP_STYLES.map((s) => s.id);
export const DEFAULT_LP_STYLE = 'theme';

// The style's CSS for a scope (the page, or the panel preview). The page also
// gets the digit fonts; the preview's host page declares them once.
export const lpCss = (id, scope = kit.PAGE) => {
  const style = LP_STYLES.find((s) => s.id === id);
  if (!style || !style.make) return '';
  const k = { ...kit, ...scope };
  return [scope === kit.PAGE ? kit.fontFaces : '', kit.resetCss(scope), style.make(k)].join('\n').trim();
};
