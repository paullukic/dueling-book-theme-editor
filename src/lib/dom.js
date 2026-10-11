// Helpers for touching DuelingBook's page safely.

import { flattenLayers, parseCssColor } from './color.js';

// True when a key event comes from somewhere the user is typing, including
// inputs inside the extension's own shadow root (document.activeElement only
// shows the shadow host there, so look at the event's real target).
export const isTypingEvent = (e) => {
  const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
  const target = path[0] || e.target;
  if (!target || target.nodeType !== 1) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag === 'INPUT') {
    const type = (target.type || 'text').toLowerCase();
    return !['checkbox', 'radio', 'button', 'submit', 'range', 'color', 'file'].includes(type);
  }
  return false;
};

export const hasModifier = (e) => e.ctrlKey || e.altKey || e.metaKey;

// Adds or replaces <style id=...> in the page head; returns a remover.
export const setPageStyle = (id, css) => {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    (document.head || document.documentElement).appendChild(el);
  }
  if (el.textContent !== css) el.textContent = css;
  return () => removePageStyle(id);
};

export const removePageStyle = (id) => {
  const el = document.getElementById(id);
  if (el) el.remove();
};

// Calls back with the element once it exists; returns a canceller.
export const whenElement = (selector, cb, { root = document } = {}) => {
  const found = root.querySelector(selector);
  if (found) {
    cb(found);
    return () => {};
  }
  const obs = new MutationObserver(() => {
    const el = root.querySelector(selector);
    if (el) {
      obs.disconnect();
      cb(el);
    }
  });
  obs.observe(root === document ? document.documentElement : root, { childList: true, subtree: true });
  return () => obs.disconnect();
};

const hex = (h) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(h || '');
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [255, 255, 255];
};

export const rgba = (h, a) => {
  const [r, g, b] = hex(h);
  return `rgba(${r},${g},${b},${Math.min(1, Math.max(0.01, Number(a) || 0))})`;
};

// Types a message into the duel chat box and sends it.
export const sendDuelChat = (message) => {
  const input = document.querySelector('#duel .cin_txt');
  if (!input || !message) return false;
  input.focus();
  input.value = message;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  const init = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true };
  input.dispatchEvent(new KeyboardEvent('keydown', init));
  input.dispatchEvent(new KeyboardEvent('keyup', init));
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.blur();
  return true;
};

export const isVisible = (el) => !!el && el.offsetParent !== null;

// The colour actually behind `el`: its own and its ancestors' background
// colours painted over each other, down to the first opaque one. null when a
// background image shows through first (its colour cannot be read).
export const backgroundBehind = (el) => {
  const layers = [];
  for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.backgroundImage !== 'none') return null;
    const c = parseCssColor(style.backgroundColor);
    if (c && c[3] > 0) {
      layers.push(c);
      if (c[3] >= 1) break;
    }
  }
  return flattenLayers(layers);
};
