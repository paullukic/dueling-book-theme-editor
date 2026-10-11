import { anim, H, n1, polar, rng } from './kit.js';

// Link: eight link arrows around a marker, lighting in turn; circuit traces.
const link = (t) => {
  let arrows = '';
  for (let i = 0; i < 8; i++) {
    const [x, y] = polar(800, 450, 230, i * 45 - 90);
    arrows += `<path d="M-34 14L0 -22L34 14Z" transform="translate(${x} ${y}) rotate(${i * 45})" fill="${t.accent}" ${anim('pulse', 4, i * 0.5, 'ease-in-out')}/>`;
  }
  let traces = '';
  const rand = rng(73);
  for (let i = 0; i < 9; i++) {
    const y = 80 + i * 90;
    const x = rand() * 500;
    traces += `<path d="M${n1(x)} ${y}H${n1(x + 200)}L${n1(x + 240)} ${y + 40}H${n1(x + 420)}" />`;
  }
  return `<g fill="none" stroke="${t.accent2}" stroke-opacity="0.16" stroke-width="2">${traces}</g>
<g fill="none" stroke="${t.accent2}" stroke-opacity="0.16" stroke-width="2" transform="translate(1600 0) scale(-1 1)">${traces}</g>
<g fill-opacity="0.65">${arrows}</g>
<rect x="740" y="390" width="120" height="120" transform="rotate(45 800 450)" fill="${t.bg}" fill-opacity="0.7" stroke="${t.accent2}" stroke-opacity="0.5" stroke-width="4"/>`;
};

// White Dragon: crackling light, ice crystals, a burst of white.

export default link;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 50, colors: ['accent2', 'accent'] }];
