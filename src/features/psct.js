// Problem-Solving Card Text highlighter for the card preview (#preview_txt).
// Konami wording puts activation conditions before ":", costs between ":" and
// ";", and the effect after ";". Restriction sentences ("You can only ...")
// get their own colour. Every span added here is removed again by unwrap().
//
// Checked against DuelingBook's whole card list (18k cards): Pendulum
// "Pendulum Effect:" / "Monster Effect:" parts, Rush Duel [REQUIREMENT] /
// [EFFECT] labels, material lines, bullet lists, quoted names with colons or
// full stops, bracketed notes, and pre-PSCT wording. See test/psct.test.mjs.

const SPAN_CLASS = 'dbte-psct';
const RESTRICTION =
  /\b(you can only|you cannot|neither player can|cannot be (normal |special |tribute |flip )?summoned|cannot be (normal )?set|cannot be negated|must (first )?be|once per (turn|duel|chain)|only once (per|that) turn)\b/i;
// Header lines DuelingBook puts above each part of a Pendulum Monster's text.
const PART_HEADER = /^\s*(pendulum effect|monster effect|pendulum scale|flavou?r text)\s*:?\s*$/i;
// Rush Duel labels, alone on a line or in front of its text.
const RUSH_LABEL = /^\s*\[(REQUIREMENT|(?:[A-Z]+[ -])*EFFECT)\]\s*/;
// Rules text that describes the card rather than doing something.
const NEUTRAL = /^\s*(this card is (also )?always treated as|this card's name becomes|this card's name is always treated as)\b/i;
// Used only when the card type is unknown: lore can contain a colon ("Which
// came first: ..."), but not this wording.
const EFFECT_WORDING =
  /\b(you can|this card|your opponent|special summon|normal summon|target|activate|destroy|negate|banish|draw|send|add|gains?|loses?|inflict|equip|tribute)\b/i;

// Splits [from, to) into sentences on . ! ? outside quotes and brackets.
const sentences = (text, from, to) => {
  const out = [];
  let start = from;
  let inQuotes = false;
  let depth = 0;
  for (let i = from; i < to; i++) {
    const ch = text[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (inQuotes) continue;
    else if (ch === '(') depth++;
    else if (ch === ')') {
      depth = Math.max(0, depth - 1);
      // A bracketed note that ends a sentence: "(This is a Quick Effect.)"
      if (depth === 0 && text[i - 1] === '.') {
        out.push([start, i + 1]);
        start = i + 1;
      }
    } else if ((ch === '.' || ch === '!' || ch === '?') && depth === 0) {
      out.push([start, i + 1]);
      start = i + 1;
    }
  }
  if (start < to) out.push([start, to]);
  return out;
};

const firstOutside = (text, from, to, char) => {
  let inQuotes = false;
  let depth = 0;
  for (let i = from; i < to; i++) {
    const ch = text[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (inQuotes) continue;
    else if (ch === '(') depth++;
    else if (ch === ')') depth = Math.max(0, depth - 1);
    else if (ch === char && depth === 0) return i;
  }
  return -1;
};

// Splits the text into parts (separated by Pendulum header lines). Each part
// is { pendulum, lines: [{ from, to, rush }] }; rush is 'cost' or 'effect'
// under a Rush Duel label, and "from" skips the label itself.
const parts = (text) => {
  const out = [];
  let cur = { pendulum: false, lines: [] };
  let rush = null;
  let start = 0;
  for (let i = 0; i <= text.length; i++) {
    if (i < text.length && text[i] !== '\n') continue;
    const line = text.slice(start, i);
    if (PART_HEADER.test(line)) {
      if (cur.lines.length) out.push(cur);
      cur = { pendulum: /pendulum effect/i.test(line), lines: [] };
      rush = null;
    } else if (line.trim()) {
      const label = RUSH_LABEL.exec(line);
      if (label) rush = label[1] === 'REQUIREMENT' ? 'cost' : 'effect';
      const from = start + (label ? label[0].length : 0);
      if (from < i) cur.lines.push({ from, to: i, rush });
    }
    start = i + 1;
  }
  if (cur.lines.length) out.push(cur);
  return out;
};

// Returns one role per character: null, 'condition', 'cost', 'effect', 'restriction'.
// Text may contain "\n" for the preview's line breaks. `lore`: true when the
// card is a Normal Monster (its non-Pendulum text is flavour, never coloured),
// false for any other card, undefined when unknown.
export const classify = (text, { lore } = {}) => {
  const roles = new Array(text.length).fill(null);
  const fill = (a, b, role) => {
    for (let i = a; i < b; i++) roles[i] = role;
  };
  const all = parts(text);
  // Unknown card type: written in PSCT anywhere means it is an effect card.
  const marked = all.some(({ lines }) =>
    lines.some(({ from, to }) => firstOutside(text, from, to, ':') >= 0 || firstOutside(text, from, to, ';') >= 0),
  );
  all.forEach(({ pendulum, lines }) => {
    if (lore && !pendulum) return;
    // Plain sentences count as effects for any card that is not lore.
    const plainIsEffect = lore === false || pendulum || (marked && lines.some(({ from, to }) => EFFECT_WORDING.test(text.slice(from, to))));
    lines.forEach(({ from, to, rush }) => {
      sentences(text, from, to).forEach(([a, b]) => {
        const sentence = text.slice(a, b);
        const trimmed = sentence.trim();
        if (!trimmed) return;
        if (trimmed.startsWith('(') && /\)\.?$/.test(trimmed)) {
          // "(You can only use this effect once per turn.)" still marks a limit.
          if (RESTRICTION.test(trimmed)) fill(a, b, 'restriction');
          return;
        }
        if (rush) {
          fill(a, b, RESTRICTION.test(sentence) ? 'restriction' : rush);
          return;
        }
        const colon = firstOutside(text, a, b, ':');
        const semi = firstOutside(text, colon >= 0 ? colon : a, b, ';');
        if (colon < 0 && semi < 0) {
          if (RESTRICTION.test(sentence)) fill(a, b, 'restriction');
          // Material lines ("2 Level 4 monsters") have no full stop.
          else if (plainIsEffect && !NEUTRAL.test(sentence) && /[.!?]\s*$/.test(sentence)) fill(a, b, 'effect');
          return;
        }
        // The space after ":" or ";" belongs to neither side.
        const skipSpace = (i) => {
          let j = i;
          while (j < b && /\s/.test(text[j])) j++;
          return j;
        };
        let effectStart = a;
        if (colon >= 0) {
          fill(a, colon + 1, 'condition');
          effectStart = skipSpace(colon + 1);
        }
        if (semi >= 0) {
          fill(effectStart, semi + 1, 'cost');
          effectStart = skipSpace(semi + 1);
        }
        fill(effectStart, b, 'effect');
      });
      // Spaces before a sentence stay uncoloured, so runs start at a word.
      sentences(text, from, to).forEach(([a, b]) => {
        for (let i = a; i < b && /\s/.test(text[i]); i++) roles[i] = null;
      });
    });
  });
  return roles;
};

// Text nodes in order, with each <br> standing for a line break.
const textParts = (root) => {
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n;
  while ((n = walker.nextNode())) {
    if (n.nodeType === 3) out.push(n);
    else if (n.tagName === 'BR') out.push(null);
  }
  return out;
};

// Normal Monster frames ("normal_front...") mark the text as lore.
export const isLoreCard = (preview) => {
  const front = preview && preview.parentElement && preview.parentElement.querySelector('.cardfront img.card_color');
  if (!front) return undefined;
  const src = front.getAttribute('src') || '';
  return /normal/i.test(src.replace(/^.*\//, ''));
};

export const unwrap = (root) => {
  const spans = root.querySelectorAll(`span.${SPAN_CLASS}`);
  if (!spans.length) return;
  spans.forEach((span) => span.replaceWith(document.createTextNode(span.textContent)));
  root.normalize();
};

export const wrap = (root, options) => {
  const nodes = textParts(root);
  const full = nodes.map((n) => (n ? n.data : '\n')).join('');
  if (!full.trim()) return;
  const roles = classify(full, options);
  let offset = 0;
  for (const node of nodes) {
    if (!node) {
      offset += 1;
      continue;
    }
    const text = node.data;
    const frag = document.createDocumentFragment();
    let runStart = 0;
    let changed = false;
    for (let i = 1; i <= text.length; i++) {
      const prev = roles[offset + i - 1];
      const cur = i < text.length ? roles[offset + i] : Symbol('end');
      if (cur === prev) continue;
      const chunk = text.slice(runStart, i);
      if (prev) {
        const span = document.createElement('span');
        span.className = `${SPAN_CLASS} ${SPAN_CLASS}-${prev}`;
        span.textContent = chunk;
        frag.appendChild(span);
        changed = true;
      } else {
        frag.appendChild(document.createTextNode(chunk));
      }
      runStart = i;
    }
    offset += text.length;
    if (changed) node.replaceWith(frag);
  }
};

export const psctCss = (colors) => `
/* DuelingBook makes spans inline-block, which drops leading spaces and breaks lines oddly. */
.${SPAN_CLASS} { display: inline !important; }
.${SPAN_CLASS}-condition { color: ${colors.condition} !important; }
.${SPAN_CLASS}-cost { color: ${colors.cost} !important; }
.${SPAN_CLASS}-effect { color: ${colors.effect} !important; }
.${SPAN_CLASS}-restriction { color: ${colors.restriction} !important; font-weight: 600; }
`;
