// Dev tool: prints the complete page CSS a theme injects into DuelingBook
// (variables, every area sheet, icons, skin, recoloured playmat), as the
// extension would with all areas on. Used by tools/render-ui.py.
//   node tools/theme-css.mjs <theme-id> [--no-field]
import { PRESETS, AREAS } from '../src/features/theme/presets.js';
import { AREA_CSS, backdropCss, varsCss } from '../src/features/theme/css.js';
import { ICON_STYLES, fieldCss, iconCss } from '../src/features/theme/art.js';
import { skinCss } from '../src/features/theme/skins.js';
import { inkCss } from '../src/features/theme/inkGuard.js';
import { chromeCss } from '../src/features/theme/chrome.js';

const id = process.argv[2];
const preset = PRESETS.find((p) => p.id === id);
if (!preset) {
  console.error(`unknown theme: ${id}`);
  process.exit(1);
}
const t = preset.tokens;
const parts = [
  varsCss({ tokens: t, radius: preset.radius, backdrop: 0.25 }) + backdropCss,
  ...AREAS.map((a) => AREA_CSS[a.id]).filter(Boolean),
  iconCss(t, preset.radius, ICON_STYLES[id] || 'tile'),
  skinCss(id, t),
  chromeCss(id, t),
  inkCss,
];
if (!process.argv.includes('--no-field')) {
  const { css } = await fieldCss(t);
  parts.push(css);
}
process.stdout.write(parts.join('\n'));
