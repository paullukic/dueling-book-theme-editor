import { PRESETS } from '../features/theme/presets';
import { ICON_STYLES, iconPreview } from '../features/theme/art';
import { skinBackdrop } from '../features/theme/skins';

// Each theme previews as it will look: the skin's backdrop, a framed icon and
// the accent. Presets never change, so build them once.
export const CHIP_LOOKS = Object.fromEntries(
  PRESETS.map((p) => [
    p.id,
    {
      style: {
        '--p-text': p.tokens.text,
        '--p-accent': p.tokens.accent,
        '--p-bg': p.tokens.bg,
        background: [skinBackdrop(p.id, p.tokens), p.tokens.bg].filter(Boolean).join(', '),
      },
      icon: iconPreview(p.tokens, p.radius, ICON_STYLES[p.id]),
    },
  ]),
);
