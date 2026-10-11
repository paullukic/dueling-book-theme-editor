// Search over the settings index and the theme presets. Pure: no DOM, no React.

export const normalise = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'‘]/g, '');

export const queryWords = (q) => normalise(q).split(/[^a-z0-9]+/).filter(Boolean);

const wordsOf = (s) => normalise(s).split(/[^a-z0-9]+/).filter(Boolean);

// True when a and b differ by at most one insertion, deletion or substitution.
const oneEdit = (a, b) => {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i += 1;
      j += 1;
    } else {
      edits += 1;
      if (edits > 1) return false;
      if (a.length > b.length) i += 1;
      else if (b.length > a.length) j += 1;
      else {
        i += 1;
        j += 1;
      }
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
};

// How well one query word matches a record's fields; 0 means no match.
const wordScore = (w, f) => {
  const label = normalise(f.label);
  const labelWords = wordsOf(f.label);
  if (label.startsWith(w)) return 100;
  if (labelWords.some((lw) => lw.startsWith(w))) return 80;
  if (label.includes(w)) return 60;
  if (wordsOf(f.keywords).some((k) => k.startsWith(w))) return 50;
  if (normalise(f.path).includes(w)) return 30;
  if (normalise(f.description).includes(w)) return 20;
  if (w.length >= 4 && labelWords.some((lw) => oneEdit(w, lw.slice(0, w.length + 1)) || oneEdit(w, lw))) return 15;
  return 0;
};

// Every query word must match; the score is the sum. Returns null when not.
export const scoreFields = (q, fields) => {
  const words = queryWords(q);
  if (!words.length) return null;
  let total = 0;
  for (const w of words) {
    const s = wordScore(w, fields);
    if (!s) return null;
    total += s;
  }
  // Shorter labels win ties: "Notes" over "Notes or background not saved".
  return total - normalise(fields.label).length / 100;
};

export const rank = (q, items, fieldsOf, limit = Infinity) =>
  items
    .map((item, i) => ({ item, i, score: scoreFields(q, fieldsOf(item)) }))
    .filter((r) => r.score !== null)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, limit)
    .map((r) => r.item);

// Splits text into plain and matched parts for <mark>. Matches query words at
// word starts, case and accent insensitive (positions map 1:1 for Latin text).
export const markParts = (text, q) => {
  const str = String(text || '');
  const words = queryWords(q);
  if (!words.length || !str) return [{ text: str, hit: false }];
  const norm = normalise(str);
  // normalise() drops apostrophes, so map positions back through a kept index.
  const keep = [];
  for (let i = 0; i < str.length; i += 1) {
    if (!/[’'‘]/.test(str[i])) keep.push(i);
  }
  const hits = new Array(str.length).fill(false);
  const mark = (at, len) => {
    for (let k = at; k < at + len && k < keep.length; k += 1) hits[keep[k]] = true;
  };
  words.forEach((w) => {
    let from = 0;
    let marked = false;
    for (;;) {
      const at = norm.indexOf(w, from);
      if (at < 0) break;
      if (at === 0 || !/[a-z0-9]/.test(norm[at - 1])) {
        mark(at, w.length);
        marked = true;
      }
      from = at + 1;
    }
    // "light" in "Starlight": no word starts with it, so mark where it sits.
    if (!marked && norm.includes(w)) mark(norm.indexOf(w), w.length);
  });
  // An apostrophe inside a matched word belongs to the match.
  for (let i = 1; i < str.length - 1; i += 1) {
    if (!hits[i] && hits[i - 1] && hits[i + 1] && /[’'‘]/.test(str[i])) hits[i] = true;
  }
  const parts = [];
  for (let i = 0; i < str.length; i += 1) {
    const last = parts[parts.length - 1];
    if (last && last.hit === hits[i]) last.text += str[i];
    else parts.push({ text: str[i], hit: hits[i] });
  }
  return parts;
};

// Themes: name, blurb, group label and a derived light/dark tag.
export const themeFields = (preset, groups) => {
  const group = groups.find((g) => g.id === preset.group);
  const light = /^light\b/i.test(preset.blurb || '');
  return {
    label: preset.name,
    keywords: `${light ? 'light bright day' : 'dark night'} ${preset.id.replace(/-/g, ' ')}`,
    path: group ? group.label : '',
    description: preset.blurb,
  };
};

export const searchThemes = (q, presets, groups, limit) => rank(q, presets, (p) => themeFields(p, groups), limit);
