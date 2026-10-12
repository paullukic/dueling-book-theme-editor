// Snow: the shared look; the opponent's indigo fill gets a white inner
// hairline so it stands apart from the indigo life frame.
import { alpha } from './kit.js';

export default (t, { SEL }) => `
${SEL.lifeOpp} { box-shadow: inset 0 0 0 1px ${alpha('#ffffff', 0.85)} !important; }
`;
