// Pixel-art helpers for the classic-game scenes (Game Boy, GBA): a 5x7 bitmap
// font and a rasteriser that turns a grid of shade keys into one run-length
// path per shade, so every "pixel" is a crisp square of side p.

import { n1 } from './kit.js';

// 5x7 glyphs, rows top to bottom, '1' = ink.
const FONT = {
  0: '01110100011001110101110011000101110',
  1: '00100011000010000100001000010001110',
  2: '01110100010000100010001000100011111',
  3: '11111000100010000010000011000101110',
  4: '00010001100101010010111110001000010',
  5: '11111100001111000001000011000101110',
  6: '00110010001000011110100011000101110',
  7: '11111000010001000100010000100001000',
  8: '01110100011000101110100011000101110',
  9: '01110100011000101111000010001001100',
  A: '01110100011000111111100011000110001',
  B: '11110100011000111110100011000111110',
  C: '01110100011000010000100001000101110',
  D: '11100100101000110001100011001011100',
  E: '11111100001000011110100001000011111',
  F: '11111100001000011110100001000010000',
  G: '01110100011000010111100011000101111',
  H: '10001100011000111111100011000110001',
  I: '01110001000010000100001000010001110',
  K: '10001100101010011000101001001010001',
  L: '10000100001000010000100001000011111',
  M: '10001110111010110101100011000110001',
  N: '10001100011100110101100111000110001',
  O: '01110100011000110001100011000101110',
  P: '11110100011000111110100001000010000',
  R: '11110100011000111110101001001010001',
  S: '01111100001000001110000010000111110',
  T: '11111001000010000100001000010000100',
  U: '10001100011000110001100011000101110',
  V: '10001100011000110001100010101000100',
  W: '10001100011000110101101011010101010',
  Y: '10001100010101000100001000010000100',
  '.': '00000000000000000000000000110001100',
  '!': '00100001000010000100001000000000100',
  '-': '00000000000000001110000000000000000',
  ':': '00000011000110000000011000110000000',
};

// Run-length path of the set cells of a row bitmask, scaled by p.
const runs = (cells, x, y, p) => {
  let d = '';
  let i = 0;
  while (i < cells.length) {
    if (!cells[i]) {
      i++;
      continue;
    }
    let j = i;
    while (j < cells.length && cells[j]) j++;
    d += `M${n1(x + i * p)} ${n1(y)}h${n1((j - i) * p)}v${n1(p)}h${n1(-(j - i) * p)}z`;
    i = j;
  }
  return d;
};

// Advance of one glyph in pixels (bold glyphs are one pixel wider).
const advance = (bold) => (bold ? 7 : 6);

export const textWidth = (str, p, bold = false) => (str.length * advance(bold) - 1) * p;

// Pixel text as one path `d` (top-left at x, y). Bold smears each row right by one pixel.
export const pxText = (str, x, y, p, bold = false) => {
  let d = '';
  [...String(str).toUpperCase()].forEach((ch, k) => {
    const g = FONT[ch];
    if (!g) return;
    const gx = x + k * advance(bold) * p;
    for (let r = 0; r < 7; r++) {
      const bits = [...g.slice(r * 5, r * 5 + 5)].map((b) => b === '1');
      const cells = bold ? [...bits, false].map((b, i) => b || (i > 0 && bits[i - 1])) : bits;
      d += runs(cells, gx, y + r * p, p);
    }
  });
  return d;
};

// A grid (array of equal-length strings) -> { key: path d } for every key in `keys`.
export const pxGrid = (rows, x, y, p, keys) => {
  const out = {};
  keys.forEach((k) => {
    out[k] = rows.map((row, r) => runs([...row].map((c) => c === k), x, y + r * p, p)).join('');
  });
  return out;
};

// 4x4 ordered (Bayer) dither threshold, 0..1.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const bayer = (i, j) => (BAYER[(j % 4) * 4 + (i % 4)] + 0.5) / 16;

// Point in polygon ([[x, y], ...]).
export const inPoly = (px, py, pts) => {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

// Rasterise w x h cells: shade(i, j) returns a key or '' (empty). Empty cells
// touching a filled one become the outline key when one is given.
export const raster = (w, h, shade, outline = '') => {
  const g = [];
  for (let j = 0; j < h; j++) {
    const row = [];
    for (let i = 0; i < w; i++) row.push(shade(i + 0.5, j + 0.5) || '');
    g.push(row);
  }
  if (outline) {
    const filled = (i, j) => i >= 0 && j >= 0 && i < w && j < h && g[j][i] && g[j][i] !== 'o';
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        if (!g[j][i] && (filled(i - 1, j) || filled(i + 1, j) || filled(i, j - 1) || filled(i, j + 1))) g[j][i] = 'o';
      }
    }
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (g[j][i] === 'o') g[j][i] = outline;
  }
  return g.map((row) => row.map((c) => c || '.').join(''));
};
