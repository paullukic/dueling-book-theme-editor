// Small colour helpers for the theme editor. Colours are "#rrggbb" strings.

export const isHex = (v) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);

export const toRgb = (hex) => {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
};

export const toHex = ([r, g, b]) =>
  `#${[r, g, b].map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('')}`;

// Mixes `b` into `a` by `t` (0 = a, 1 = b).
export const mix = (a, b, t) => {
  const x = toRgb(a);
  const y = toRgb(b);
  return toHex(x.map((c, i) => c + (y[i] - c) * t));
};

const channel = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export const luminance = (hex) => {
  const [r, g, b] = toRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

// WCAG contrast ratio, 1 to 21.
export const contrast = (a, b) => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

// `color` moved toward black or white, whichever the background needs, just
// far enough to reach `min` contrast. Already readable colours come back as is.
export const readableOn = (color, bg, min = 4.5) => {
  if (contrast(color, bg) >= min) return color;
  const target = luminance(bg) > 0.18 ? '#000000' : '#ffffff';
  for (let t = 0.05; t < 1; t += 0.05) {
    const c = mix(color, target, t);
    if (contrast(c, bg) >= min) return c;
  }
  return target;
};

// A computed CSS colour ("rgb(...)", "rgba(...)" or "color(srgb ...)") as
// [r, g, b, alpha] with channels 0-255; null when it cannot be read.
export const parseCssColor = (value) => {
  const s = String(value || '').trim();
  let m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i.exec(s);
  if (m) {
    const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return [+m[1], +m[2], +m[3], a];
  }
  m = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i.exec(s);
  if (m) {
    const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]);
    return [m[1] * 255, m[2] * 255, m[3] * 255, a];
  }
  return null;
};

// Paints background layers (innermost first) over `base` and returns the hex
// colour the eye sees.
export const flattenLayers = (layers, base = '#ffffff') => {
  let rgb = toRgb(base);
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const [r, g, b, a] = layers[i];
    rgb = [r, g, b].map((c, k) => c * a + rgb[k] * (1 - a));
  }
  return toHex(rgb);
};
