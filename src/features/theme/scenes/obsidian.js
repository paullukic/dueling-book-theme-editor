import { mix } from '../../../lib/color.js';
import { anim } from './kit.js';

// Obsidian: volcanic glass shards catching light at the edges.
const obsidian = (t) => {
  const shard = (pts, delay) => `<g ${anim('pulse', 6, delay, 'ease-in-out')}><path d="M${pts}Z" fill="${mix(t.surface, t.accent, 0.08)}" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="1.5"/></g>`;
  return `<!--near-->${shard('0 600L140 520L220 900L0 900', 0)}${shard('1600 200L1460 340L1520 560L1600 520', 2)}${shard('1600 700L1400 780L1460 900L1600 900', 4)}${shard('0 0L180 0L60 160', 1)}`;
};

// Crimson: two diagonal blade slashes glowing in red.

export default obsidian;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'mote', count: 40, colors: ['accent', 'text'] }];
