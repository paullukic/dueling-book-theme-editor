import { glow, H, n1, W } from './kit.js';

// Verdant: vines hanging from the top corners.
const verdant = (t) => {
  const vine = (x, len, dir) => {
    let leaves = '';
    for (let y = 40; y < len; y += 46) {
      const lx = x + Math.sin(y / 60) * 20 * dir;
      leaves += `<ellipse cx="${n1(lx + 14 * dir)}" cy="${y}" rx="16" ry="7" transform="rotate(${dir * 30} ${n1(lx + 14 * dir)} ${y})"/>`;
    }
    return `<path d="M${x} 0Q${x + 30 * dir} ${len / 2} ${x} ${len}" fill="none" stroke="${t.accent}" stroke-opacity="0.35" stroke-width="3"/><g fill="${t.accent}" fill-opacity="0.3">${leaves}</g>`;
  };
  return `<defs>${glow('dbtefx-vd-g', t.accent, 0.5, 0, 0.6, 0.12)}</defs><rect width="${W}" height="${H}" fill="url(#dbtefx-vd-g)"/>
<!--near-->
<g style="transform-origin: 60px 0px; animation: dbtefx-reed 9s ease-in-out infinite;">${vine(60, 420, 1)}${vine(100, 280, 1)}<g transform="translate(-30 0)"><path d="M140 280C170 300 205 290 222 262C236 238 220 214 200 222C186 228 190 248 204 246" fill="none" stroke="${t.accent}" stroke-opacity="0.4" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="176" cy="296" rx="14" ry="6" transform="rotate(20 176 296)" fill="${t.accent}" fill-opacity="0.3"/></g></g>
<g style="transform-origin: 1570px 0px; animation: dbtefx-reed 10s ease-in-out -3s infinite;">${vine(1570, 460, -1)}${vine(1512, 300, -1)}</g>`;
};

// Parchment (light): a shaft of window light with dust in it.

export default verdant;

// Particle systems for this theme (kinds and options: particles.js).
export const particles = [{ kind: 'leaf', count: 26, colors: ['accent', 'success'] }, { kind: 'firefly', count: 24, colors: ['warning'] }];
