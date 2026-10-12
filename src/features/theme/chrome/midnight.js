// Midnight: the shared look, except the active phase, which lights in the
// panel gold with dark lettering instead of the deepened (khaki) accent. The
// moon stays off the menu's edge and no star drifts over the front-page links.
import { mix } from '../../../lib/color.js';

export default (t, { sel }) => `
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 35%, ${mix(t.accent, '#ffffff', 0.25)}, ${t.accent} 55%, ${mix(t.accent, t.bg, 0.3)}) !important; }
${sel(['#duel .phase.active span'])} { color: ${t.accentText} !important; text-shadow: none !important; }
html body:has(#main_menu:not([style*="none"])) #dbte-skin-fx .dbtefx-mn-moon { display: none; }
html body:has(#welcome_buttons:not([style*="none"])) #dbte-skin-fx .dbtefx-canvas { mask-image: linear-gradient(#000000, #000000), linear-gradient(#000000, #000000); mask-size: 100% 100%, 330px 210px; mask-position: 0 0, right 280px top 110px; mask-repeat: no-repeat; mask-composite: exclude; }
html body:has(#welcome_buttons:not([style*="none"])) #dbte-skin-motif { mask-image: linear-gradient(#000000, #000000), linear-gradient(#000000, #000000); mask-size: 100% 100%, 330px 210px; mask-position: 0 0, right 157px top 46px; mask-repeat: no-repeat; mask-composite: exclude; }
`;
