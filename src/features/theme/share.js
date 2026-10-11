// Theme codes: a short text a user can paste in chat or Discord to share a
// look. "DBTE1:" + base64(JSON). Decoding never trusts the input: values are
// cleaned by withDefaults like any stored setting.

import { withDefaults } from '../../lib/defaults.js';

const PREFIX = 'DBTE1:';
export const MAX_CODE_LENGTH = 80000;
export const MAX_CUSTOM_CSS = 50000;

const toBase64 = (text) => {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin);
};

const fromBase64 = (b64) => {
  const bin = atob(b64);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

export const THEME_KEYS = ['themePreset', 'themeTokens', 'themeRadius', 'themeBackdrop', 'themeFont', 'themeAreas'];

export const encodeTheme = (settings, customCss) => {
  const data = { v: 1 };
  THEME_KEYS.forEach((k) => {
    data[k] = settings[k];
  });
  if (customCss) data.customCss = customCss;
  return PREFIX + toBase64(JSON.stringify(data));
};

// Returns { patch, customCss } or { error }.
export const decodeTheme = (code) => {
  const text = String(code || '').trim();
  if (!text) return { error: 'Paste a theme code first.' };
  if (text.length > MAX_CODE_LENGTH) return { error: 'That code is too long to be a theme.' };
  if (!text.startsWith(PREFIX)) return { error: 'That is not a theme code. Codes start with DBTE1:' };
  let data;
  try {
    data = JSON.parse(fromBase64(text.slice(PREFIX.length)));
  } catch (e) {
    return { error: 'That code is damaged. Copy it again, all of it.' };
  }
  if (!data || typeof data !== 'object' || Array.isArray(data) || data.v !== 1) {
    return { error: 'That code is from a newer or unknown version.' };
  }
  const raw = {};
  THEME_KEYS.forEach((k) => {
    if (data[k] !== undefined) raw[k] = data[k];
  });
  const clean = withDefaults(raw);
  const patch = { themeEnabled: true };
  THEME_KEYS.forEach((k) => {
    patch[k] = clean[k];
  });
  const customCss = typeof data.customCss === 'string' ? data.customCss.slice(0, MAX_CUSTOM_CSS) : null;
  return { patch, customCss };
};
