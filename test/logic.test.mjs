import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify } from '../src/features/psct.js';
import { atLeastOne } from '../src/lib/odds.js';
import { DEFAULT_SHORTCUT_KEYS, migrateLegacy, withDefaults } from '../src/lib/defaults.js';
import { hasModifier, isTypingEvent } from '../src/lib/dom.js';
import { classifyStorageError } from '../src/lib/storageErrors.js';

const runs = (text) => {
  const roles = classify(text);
  const out = [];
  let cur = null;
  let start = 0;
  for (let i = 0; i <= text.length; i++) {
    const r = i < text.length ? roles[i] : 'END';
    if (r !== cur) {
      if (cur) out.push([cur, text.slice(start, i).trim()]);
      cur = r;
      start = i;
    }
  }
  return out;
};

test('psct: condition, cost, effect and restriction', () => {
  const r = runs(
    'If this card is Normal Summoned: You can discard 1 card; add 1 "Ash: Blossom" from your Deck to your hand. You can only use this effect of "X" once per turn.',
  );
  assert.deepEqual(r.map((x) => x[0]), ['condition', 'cost', 'effect', 'restriction']);
  assert.equal(r[2][1], 'add 1 "Ash: Blossom" from your Deck to your hand.');
});

test('psct: colon inside quotes is not a condition', () => {
  const r = runs('Add 1 "Ars Magna: Test" from your Deck to your hand.');
  assert.deepEqual(r, []);
});

test('psct: plain sentence stays uncoloured', () => {
  assert.deepEqual(runs('This card is always treated as a "Branded" card.'), []);
});

test('odds: known hypergeometric values', () => {
  assert.equal(atLeastOne(40, 0, 5), 0);
  assert.equal(atLeastOne(5, 5, 5), 1);
  assert.ok(Math.abs(atLeastOne(40, 3, 5) - 0.3376) < 0.001);
  assert.ok(Math.abs(atLeastOne(40, 3, 6) - 0.3949) < 0.001);
});

test('settings: damaged values fall back to defaults', () => {
  const s = withDefaults({
    windows: null,
    chatMuted: null,
    darkMode: 'yes',
    psctColors: { cost: 'red', effect: '#00ff00' },
    shortcutKeys: { zz: 'good_btn', x: 'good_btn', y: 5 },
    customChatMessages: ['hi', 3],
    menuColors: { edgeAlpha: 7, bgAlpha: -2 },
  });
  assert.deepEqual(s.windows, {});
  assert.deepEqual(s.chatMuted, []);
  assert.equal(s.darkMode, false);
  assert.equal(s.psctColors.cost, '#f09f9f');
  assert.equal(s.psctColors.effect, '#00ff00');
  assert.deepEqual(s.shortcutKeys, { x: 'good_btn' });
  assert.deepEqual(s.customChatMessages, ['hi', '', '', '', '']);
  assert.equal(s.menuColors.edgeAlpha, 1);
  assert.equal(s.menuColors.bgAlpha, 0);
});

test('settings: card text size snaps to a slider stop', () => {
  assert.equal(withDefaults({ cardTextSize: 19 }).cardTextSize, 18);
  assert.equal(withDefaults({ cardTextSize: 6 }).cardTextSize, 10);
  assert.equal(withDefaults({ cardTextSize: 3 }).cardTextSize, 0);
  assert.equal(withDefaults({ cardTextSize: 99 }).cardTextSize, 22);
});

test('settings: removed shortcut stays removed', () => {
  const s = withDefaults({ shortcutKeys: { a: 'good_btn' } });
  assert.deepEqual(s.shortcutKeys, { a: 'good_btn' });
});

const reload = (stored) => withDefaults(JSON.parse(JSON.stringify(stored)));

test('settings: a deleted or fully cleared binding survives a reload', () => {
  const without2 = { ...DEFAULT_SHORTCUT_KEYS };
  delete without2['2'];
  assert.equal('2' in reload({ shortcutKeys: without2 }).shortcutKeys, false);
  assert.deepEqual(reload({ shortcutKeys: {} }).shortcutKeys, {});
  assert.deepEqual(withDefaults(migrateLegacy({ shortcutKeys: {} })).shortcutKeys, {});
});

test('settings: shortcuts master switch defaults on and keeps off', () => {
  assert.equal(withDefaults(null).shortcutsEnabled, true);
  assert.equal(reload({ shortcutsEnabled: false }).shortcutsEnabled, false);
});

// e.target is a DIV, as for an input inside the panel's shadow root (retargeted
// to the host): the guard must read the real target from composedPath().
const keyFrom = (target) => ({ composedPath: () => [target, { nodeType: 1, tagName: 'DIV' }], target: { nodeType: 1, tagName: 'DIV' } });
const el = (tagName, extra = {}) => ({ nodeType: 1, tagName, ...extra });

test('shortcuts: ignored while typing in any field, including inside a shadow root', () => {
  [
    el('INPUT', { id: 'life_txt', type: 'text' }),
    el('INPUT', { type: 'number' }),
    el('INPUT', {}),
    el('TEXTAREA'),
    el('SELECT'),
    el('DIV', { isContentEditable: true }),
  ].forEach((t) => assert.equal(isTypingEvent(keyFrom(t)), true, `${t.tagName} ${t.type || ''}`));
  assert.equal(isTypingEvent({ target: el('TEXTAREA') }), true);
});

test('shortcuts: still work off a field, and never with a modifier', () => {
  assert.equal(isTypingEvent(keyFrom(el('BODY'))), false);
  assert.equal(isTypingEvent(keyFrom(el('INPUT', { type: 'checkbox' }))), false);
  assert.equal(isTypingEvent(keyFrom(el('BUTTON'))), false);
  assert.equal(hasModifier({ ctrlKey: true }), true);
  assert.equal(hasModifier({ altKey: true }), true);
  assert.equal(hasModifier({ metaKey: true }), true);
  assert.ok(!hasModifier({}));
});

test('migration: v1.0 keys carry over', () => {
  const m = migrateLegacy({
    darkModeEnabled: true,
    textHighlightEnabled: true,
    shortcutKeys: { g: 'custom_chat_action' },
    customChatMessage: 'GG',
    notesPosition: { left: '15px', top: '200px' },
    mainMenuApplyColors: true,
    mainMenuBgAlpha: 0.5,
  });
  const s = withDefaults(m);
  assert.equal(s.darkMode, true);
  assert.equal(s.psctEnabled, true);
  assert.deepEqual(s.shortcutKeys, { g: 'custom_chat_1' });
  assert.equal(s.customChatMessages[0], 'GG');
  assert.deepEqual(s.windows.notes, { x: 15, y: 200 });
  assert.equal(s.menuColorsEnabled, true);
  assert.equal(s.menuColors.bgAlpha, 0.5);
});

test('storage errors: size limits are permanent, rate limits retry', () => {
  assert.equal(classifyStorageError('QUOTA_BYTES_PER_ITEM quota exceeded'), 'quota');
  assert.equal(classifyStorageError('QUOTA_BYTES quota exceeded'), 'quota');
  assert.equal(classifyStorageError('MAX_ITEMS quota exceeded'), 'quota');
  assert.equal(classifyStorageError('MAX_WRITE_OPERATIONS_PER_MINUTE quota exceeded'), 'rate');
  assert.equal(classifyStorageError('MAX_WRITE_OPERATIONS_PER_HOUR quota exceeded'), 'rate');
  assert.equal(classifyStorageError('Resource::kQuotaBytesPerItem quota exceeded'), 'quota');
  assert.equal(classifyStorageError('Resource::kQuotaBytes quota exceeded'), 'quota');
  assert.equal(classifyStorageError('Resource::kMaxItems quota exceeded'), 'quota');
  assert.equal(classifyStorageError('Resource::kMaxWriteOperationsPerMinute quota exceeded'), 'rate');
  assert.equal(classifyStorageError('Something else'), 'other');
});
