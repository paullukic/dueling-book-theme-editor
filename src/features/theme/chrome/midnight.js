// Midnight: the shared look, except the active phase, which lights in the
// panel gold with dark lettering instead of the deepened (khaki) accent.
import { mix } from '../../../lib/color.js';

export default (t, { sel }) => `
${sel(['#duel .phase.active .phase_inner.red', '#duel .phase.active .phase_inner.blue'])} { background: radial-gradient(circle at 50% 35%, ${mix(t.accent, '#ffffff', 0.25)}, ${t.accent} 55%, ${mix(t.accent, t.bg, 0.3)}) !important; }
${sel(['#duel .phase.active span'])} { color: ${t.accentText} !important; text-shadow: none !important; }
`;
