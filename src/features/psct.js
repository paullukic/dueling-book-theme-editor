// Problem-Solving Card Text highlighter for the card preview (#preview_txt).
// Konami wording puts activation conditions before ":", costs between ":" and
// ";", and the effect after ";". Restriction sentences ("You can only ...")
// get their own colour. Every span added here is removed again by unwrap().

const SPAN_CLASS = 'dbte-psct';
const RESTRICTION = /\b(you can only|you cannot|neither player can|cannot be (special )?summoned|must (first )?be|once per turn|once per duel)\b/i;

// Splits text into sentences on "." outside quotes; returns [start, end) pairs.
const sentences = (text) => {
  const out = [];
  let start = 0;
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (ch === '.' && !inQuotes) {
      out.push([start, i + 1]);
      start = i + 1;
    }
  }
  if (start < text.length) out.push([start, text.length]);
  return out;
};

const firstOutsideQuotes = (text, from, to, char) => {
  let inQuotes = false;
  for (let i = from; i < to; i++) {
    if (text[i] === '"') inQuotes = !inQuotes;
    else if (text[i] === char && !inQuotes) return i;
  }
  return -1;
};

// Returns one role per character: null, 'condition', 'cost', 'effect', 'restriction'.
export const classify = (text) => {
  const roles = new Array(text.length).fill(null);
  const fill = (a, b, role) => {
    for (let i = a; i < b; i++) roles[i] = role;
  };
  for (const [a, b] of sentences(text)) {
    const colon = firstOutsideQuotes(text, a, b, ':');
    const semi = firstOutsideQuotes(text, colon >= 0 ? colon : a, b, ';');
    const sentence = text.slice(a, b);
    if (colon < 0 && semi < 0) {
      if (RESTRICTION.test(sentence)) fill(a, b, 'restriction');
      continue;
    }
    let effectStart = a;
    if (colon >= 0) {
      fill(a, colon + 1, 'condition');
      effectStart = colon + 1;
    }
    if (semi >= 0) {
      fill(effectStart, semi + 1, 'cost');
      effectStart = semi + 1;
    }
    fill(effectStart, b, 'effect');
  }
  // Whitespace between sentences stays uncoloured.
  for (const [a, b] of sentences(text)) {
    for (let i = a; i < b && /\s/.test(text[i]); i++) roles[i] = null;
  }
  return roles;
};

const textNodes = (root) => {
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) out.push(n);
  return out;
};

export const unwrap = (root) => {
  const spans = root.querySelectorAll(`span.${SPAN_CLASS}`);
  if (!spans.length) return;
  spans.forEach((span) => span.replaceWith(document.createTextNode(span.textContent)));
  root.normalize();
};

export const wrap = (root) => {
  const nodes = textNodes(root);
  const full = nodes.map((n) => n.data).join('');
  if (!full.trim()) return;
  const roles = classify(full);
  let offset = 0;
  for (const node of nodes) {
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
.${SPAN_CLASS}-condition { color: ${colors.condition} !important; }
.${SPAN_CLASS}-cost { color: ${colors.cost} !important; }
.${SPAN_CLASS}-effect { color: ${colors.effect} !important; }
.${SPAN_CLASS}-restriction { color: ${colors.restriction} !important; font-weight: 600; }
`;
