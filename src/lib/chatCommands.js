// Duel chat commands. DuelingBook's own commands pass through untouched; the
// extension's commands are answered on this screen only and never sent.
// Nothing here moves cards or changes the duel.

// DuelingBook's server commands (duelingbook.com/welcome).
export const NATIVE_COMMANDS = [
  ['/draw N', 'draw N cards'],
  ['/mill N', 'send the top N cards of your Deck to the GY'],
  ['/banish N', 'banish the top N cards of your Deck'],
  ['/banishfd N', 'banish the top N cards face-down'],
  ['/add N', 'gain N Life Points'],
  ['/sub N', 'lose N Life Points'],
  ['/half', 'halve your Life Points'],
  ['/discardhand', 'discard your hand'],
  ['/discardrandom', 'discard 1 random card'],
  ['/banishhand', 'banish your hand'],
  ['/rng', 'random number'],
  ['/pause', 'pause the duel'],
];

export const OWN_COMMANDS = [
  ['/help', 'this list (only you see it)'],
  ['/calc 8000-2500*2', 'quick maths for Life Points (only you see it)'],
  ['/note text', 'add a line to your Notes window'],
];

const RESERVED = ['help', 'calc', 'note', ...NATIVE_COMMANDS.map(([c]) => c.slice(1).split(' ')[0])];

export const MAX_ALIASES = 15;
export const ALIAS_NAME = /^[a-z0-9]{1,12}$/;

export const cleanAliases = (list) =>
  (Array.isArray(list) ? list : [])
    .filter((a) => a && typeof a === 'object' && typeof a.name === 'string' && typeof a.text === 'string')
    .map((a) => ({ name: a.name.toLowerCase().trim(), text: a.text.slice(0, 200) }))
    .filter((a, i, all) => ALIAS_NAME.test(a.name) && !RESERVED.includes(a.name) && a.text.trim() && all.findIndex((b) => b.name === a.name) === i)
    .slice(0, MAX_ALIASES);

export const isReservedAlias = (name) => RESERVED.includes(name.toLowerCase());

// Arithmetic without eval: numbers, + - * / and brackets. Returns a number or null.
export const calc = (expr) => {
  const src = String(expr).replace(/\s+/g, '');
  if (!src || src.length > 80 || !/^[\d+\-*/().]+$/.test(src)) return null;
  let i = 0;
  const peek = () => src[i];
  const number = () => {
    const m = /^\d+(\.\d+)?/.exec(src.slice(i));
    if (!m) throw new Error('number');
    i += m[0].length;
    return Number(m[0]);
  };
  let depth = 0;
  const factor = () => {
    if (peek() === '-') {
      i++;
      return -factor();
    }
    if (peek() === '(') {
      i++;
      if (++depth > 20) throw new Error('deep');
      // eslint-disable-next-line no-use-before-define
      const v = sum();
      if (peek() !== ')') throw new Error('bracket');
      i++;
      depth--;
      return v;
    }
    return number();
  };
  const product = () => {
    let v = factor();
    while (peek() === '*' || peek() === '/') {
      const op = src[i++];
      const r = factor();
      v = op === '*' ? v * r : v / r;
    }
    return v;
  };
  const sum = () => {
    let v = product();
    while (peek() === '+' || peek() === '-') {
      const op = src[i++];
      const r = product();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  };
  try {
    const v = sum();
    if (i !== src.length || !Number.isFinite(v)) return null;
    return Math.round(v * 1000) / 1000;
  } catch (e) {
    return null;
  }
};

// What to do with a chat line. Returns:
//   { kind: 'pass' }                  send as typed
//   { kind: 'send', text }            send this instead (shortcut)
//   { kind: 'local', lines }          show these lines here only, send nothing
//   { kind: 'note', text }            add to notes, then confirm locally
export const handleChatLine = (line, aliases = []) => {
  const m = /^\/([a-z0-9]+)(?:\s+([\s\S]*))?$/i.exec(String(line).trim());
  if (!m) return { kind: 'pass' };
  const name = m[1].toLowerCase();
  const arg = (m[2] || '').trim();
  if (name === 'help') {
    const shortcuts = cleanAliases(aliases).map((a) => `/${a.name} → ${a.text}`);
    return {
      kind: 'local',
      lines: [
        'DuelingBook: ' + NATIVE_COMMANDS.map(([c]) => c).join(', '),
        'Theme Editor: ' + OWN_COMMANDS.map(([c, d]) => `${c} (${d})`).join(', '),
        ...(shortcuts.length ? ['Your shortcuts: ' + shortcuts.join(' · ')] : []),
      ],
    };
  }
  if (name === 'calc') {
    const v = calc(arg);
    return { kind: 'local', lines: [v === null ? `Could not work out "${arg}". Use numbers and + - * / ( ).` : `${arg} = ${v}`] };
  }
  if (name === 'note') {
    return arg ? { kind: 'note', text: arg } : { kind: 'local', lines: ['Type the note after /note, e.g. /note opp has Ash'] };
  }
  const alias = cleanAliases(aliases).find((a) => a.name === name);
  if (alias) return { kind: 'send', text: arg ? `${alias.text} ${arg}` : alias.text };
  return { kind: 'pass' };
};
