import { H } from './kit.js';

// Snow: layered hills and pines under falling snow.
const snow = (t) => {
  const pine = (x, y, h) => `<path d="M${x} ${y - h}L${x + h * 0.32} ${y - h * 0.45}H${x + h * 0.16}L${x + h * 0.4} ${y}H${x - h * 0.4}L${x - h * 0.16} ${y - h * 0.45}H${x - h * 0.32}Z"/>`;
  return `<path d="M0 640Q300 560 620 620T1240 580T1600 600V900H0Z" fill="${t.border}" fill-opacity="0.35"/>
<g fill="${t.border}" fill-opacity="0.45">${pine(160, 640, 150)}${pine(260, 620, 110)}${pine(1380, 600, 170)}${pine(1490, 610, 120)}</g>
<!--near-->
<path d="M0 760Q400 690 800 750T1600 720V900H0Z" fill="${t.raised}" fill-opacity="0.85"/>
<g fill="${t.muted}" fill-opacity="0.5">${pine(80, 780, 200)}${pine(1530, 760, 220)}</g>`;
};

// Verdant: vines hanging from the top corners.

export default snow;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'flake', count: 150, colors: ['raised'], outline: 'muted' }];
