// Parchment: the shared look, except the healthy life frame, which is drawn
// in dark ink instead of the oxblood accent (that red read as danger).
import { mix } from '../../../lib/color.js';

export default (t, { SEL }) => `
${SEL.life} { border-color: ${mix(t.text, t.muted, 0.3)} !important; }
`;
