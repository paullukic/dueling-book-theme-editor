import { anim } from './kit.js';

// Parchment (light): a shaft of window light with dust in it.
const parchment = (t) => `<defs><linearGradient id="dbtefx-pc-beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.6"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>
<path d="M120 -20L520 -20L1180 920L540 920Z" fill="url(#dbtefx-pc-beam)" ${anim('pulse', 10, 0, 'ease-in-out')}/>
<!--mid-->
<g fill="none" stroke="${t.accent}" stroke-opacity="0.12" stroke-width="2"><circle cx="1320" cy="680" r="150"/><circle cx="1320" cy="680" r="120" stroke-dasharray="3 9"/><path d="M1320 510V850M1150 680H1490M1200 560L1440 800M1440 560L1200 800"/></g>`;

// Obsidian: volcanic glass shards catching light at the edges.

export default parchment;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 60, colors: ['warning', 'accent'], light: true }];
