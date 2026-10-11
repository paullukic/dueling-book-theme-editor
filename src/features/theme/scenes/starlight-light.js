import { foil, foilShader } from './starlight.js';

// Starlight (light): the same Starlight Rare foil on silver-white stock,
// pastel prism lines and ink detailing (see starlight.js).
const starlightLight = (t) => foil(t, true);

export default starlightLight;

export const particles = [{ kind: 'star', count: 50, colors: ['accent', 'accent2', 'link'], light: true }];

export const shader = foilShader(true);
