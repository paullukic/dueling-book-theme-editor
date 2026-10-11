import { mix } from '../../../lib/color.js';
import { n1 } from './kit.js';

// Official card artwork as a scene hero, loaded live from DuelingBook's own
// image server (the art-only crops the site already shows); nothing is
// bundled. The art sits in a feathered window that also fades toward the
// bottom, is blended into the scene (screen lets a black card background
// vanish into the glow behind it, multiply sinks a pale one into the theme
// colour) and breathes slowly (transform only).
// The picture is a CSS background inside a foreignObject, not an SVG <image>:
// a failed <image> paints Chrome's broken-image icon, a failed background
// paints nothing. Offline, only the backdrop glow and the frame remain.

// DuelingBook card ids (not Konami passcodes): found with the site's own
// card lookup (duelingbook.com/card), each one checked by eye.
export const CARDS = {
  slifer: 5287,
  obelisk: 3180,
  ra: 4360,
  albaz: 10814,
  mirrorjade: 12578,
  albion: 11543,
};

export const cardArtUrl = (id) => `https://images.duelingbook.com/card-pics/${~~id}.jpg`;

export const CARD_ART_KEYFRAMES = '@keyframes dbtefx-ca-breathe { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-6px, -8px) scale(1.035); } } @keyframes dbtefx-ca-glow { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }';

// Frame shapes in a w x h box at the origin.
const frames = {
  // Rounded-end cartouche (Egyptian name ring).
  cartouche: (w, h) => {
    const r = w / 2;
    return `M0 ${n1(r)}A${n1(r)} ${n1(r)} 0 0 1 ${n1(w)} ${n1(r)}V${n1(h - r)}A${n1(r)} ${n1(r)} 0 0 1 0 ${n1(h - r)}Z`;
  },
  // Pointed arch, a cathedral window.
  arch: (w, h) => `M0 ${n1(h)}V${n1(w * 0.55)}Q0 0 ${n1(w / 2)} 0Q${n1(w)} 0 ${n1(w)} ${n1(w * 0.55)}V${n1(h)}Z`,
  // A sharp crystal / brand-cut diamond.
  shard: (w, h) => `M${n1(w * 0.5)} 0L${n1(w)} ${n1(h * 0.34)}L${n1(w * 0.78)} ${n1(h)}L${n1(w * 0.2)} ${n1(h)}L0 ${n1(h * 0.3)}Z`,
};

/**
 * One card artwork placed in the scene. Returns SVG markup (defs included).
 *   id       unique id prefix, theme-scoped (e.g. 'dbtefx-dv-ra')
 *   card     DuelingBook card id (CARDS.*)
 *   x,y,w,h  the window in scene units (1600x900)
 *   frame    'feather' (soft ellipse, default) | 'cartouche' | 'arch' | 'shard'
 *   feather  0..1 how much of the window fades out toward its edge
 *   fade     0..1 how much the lower part sinks into the background
 *   focus    [fx, fy] point of the art (0..1) to centre in the window
 *   zoom     art size relative to the window's long side (< 1 lets the
 *            whole picture float inside a larger feathered window)
 *   blend    CSS blend mode of the art over its backdrop: 'normal', 'screen'
 *            (black card backgrounds vanish), 'multiply' (pale ones take the
 *            backdrop colour), 'luminosity' (art takes the backdrop's hue)
 *   backdrop colour under the art, backdropAmt its opacity (also the
 *            fallback glow when the picture can't load)
 *   opacity  of the art
 *   rim      frame stroke colour (null: none); glow: halo colour (null: none)
 *   breathe  seconds of one slow breath (0: still), delay seconds
 */
export const cardArt = (t, o) => {
  const { id, card, x, y, w, h, frame = 'feather', feather = 0.5, fade = 0.5, focus = [0.5, 0.5], zoom = 1.1, blend = 'normal', backdrop = t.bg, backdropAmt = 0.9, opacity = 1, rim = null, glow = null, breathe = 14, delay = 0 } = o;
  const S = Math.max(w, h) * zoom;
  // Art at least as big as the window covers it; smaller art floats inside.
  const clamp = (v, lo, hi) => (lo > hi ? v : Math.min(hi, Math.max(lo, v)));
  const ix = n1(clamp(x + w / 2 - focus[0] * S, x + w - S, x));
  const iy = n1(clamp(y + h / 2 - focus[1] * S, y + h - S, y));
  const cx = n1(x + w / 2);
  const cy = n1(y + h / 2);
  const box = `x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}"`;
  const shapeD = frames[frame] ? frames[frame](w, h) : '';
  const fill = (paint) => (shapeD ? `<path transform="translate(${n1(x)} ${n1(y)})" d="${shapeD}" fill="${paint}"/>` : `<rect ${box} fill="${paint}"/>`);
  const motion = breathe ? ` style="transform-origin: ${cx}px ${cy}px; animation: dbtefx-ca-breathe ${breathe}s ease-in-out ${n1(-delay)}s infinite;"` : '';
  const halo = glow
    ? `<ellipse cx="${cx}" cy="${cy}" rx="${n1(w * 0.75)}" ry="${n1(h * 0.68)}" fill="url(#${id}-g)" style="animation: dbtefx-ca-glow ${breathe || 12}s ease-in-out ${n1(-delay)}s infinite;"/>`
    : '';
  const rimLine = rim && shapeD
    ? `<path transform="translate(${n1(x)} ${n1(y)})" d="${shapeD}" fill="none" stroke="url(#${id}-r)" stroke-width="2.5"/>`
    : '';
  const solid = n1((1 - feather) * 100) / 100;
  // The picture's own edges fade too (it floats when smaller than its
  // window); a CSS mask, so the fade moves with the breathing art.
  const ramp = (dir) => `linear-gradient(${dir}, transparent, #000000 12%, #000000 88%, transparent)`;
  const edges = `-webkit-mask-image: ${ramp('to right')}, ${ramp('to bottom')}; -webkit-mask-composite: source-in; mask-image: ${ramp('to right')}, ${ramp('to bottom')}; mask-composite: intersect;`;
  const art = `<foreignObject x="${ix}" y="${iy}" width="${n1(S)}" height="${n1(S)}"${motion}><div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; background: url(${cardArtUrl(card)}) center / cover no-repeat; ${edges}"></div></foreignObject>`;
  return `<defs>
<radialGradient id="${id}-f" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff"/><stop offset="${solid}" stop-color="#ffffff"/><stop offset="1" stop-color="#000000"/></radialGradient>
<linearGradient id="${id}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0.45" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity="${fade}"/></linearGradient>
<radialGradient id="${id}-b" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${backdrop}" stop-opacity="${backdropAmt}"/><stop offset="${solid}" stop-color="${backdrop}" stop-opacity="${n1(backdropAmt * 80) / 100}"/><stop offset="1" stop-color="${backdrop}" stop-opacity="0"/></radialGradient>
<mask id="${id}-m" maskUnits="userSpaceOnUse" ${box}>${fill(`url(#${id}-f)`)}<rect ${box} fill="url(#${id}-s)"/></mask>
${glow ? `<radialGradient id="${id}-g"><stop offset="0" stop-color="${glow}" stop-opacity="0.45"/><stop offset="0.6" stop-color="${glow}" stop-opacity="0.12"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>` : ''}
${rim ? `<linearGradient id="${id}-r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix(rim, '#ffffff', 0.35)}"/><stop offset="0.6" stop-color="${rim}" stop-opacity="0.6"/><stop offset="1" stop-color="${rim}" stop-opacity="0"/></linearGradient>` : ''}
</defs>${halo}${fill(`url(#${id}-b)`)}<g mask="url(#${id}-m)" opacity="${opacity}" style="mix-blend-mode: ${blend};">${art}</g>${rimLine}`;
};
