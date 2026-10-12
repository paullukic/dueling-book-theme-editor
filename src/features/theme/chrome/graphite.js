// Graphite: the shared look with cool graphite steel on the life frames and
// phase rings (against the warm stone), and a brass fill that starts in brass,
// not brown.
import { mix } from '../../../lib/color.js';

export default (t, { SEL, sel }) => {
  const cool = mix(t.accent2, t.muted, 0.5);
  return `
${SEL.life} { border-color: ${cool} !important; box-shadow: 0 0 0 1px ${mix(cool, t.bg, 0.6)} !important; }
${SEL.lifeSelf} { background: linear-gradient(90deg, ${mix(t.self, '#000000', 0.16)}, ${t.self} 55%) !important; }
${SEL.phase} { background: ${mix(cool, t.bg, 0.45)} !important; }
`;
};
