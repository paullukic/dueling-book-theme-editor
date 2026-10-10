import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classify } from '../src/features/psct.js';
import { atLeastOne } from '../src/lib/odds.js';
import { DEFAULTS, migrateLegacy, withDefaults } from '../src/lib/defaults.js';

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
    menuColors: { bgAlpha: 7 },
  });
  assert.deepEqual(s.windows, {});
  assert.deepEqual(s.chatMuted, []);
  assert.equal(s.darkMode, false);
  assert.equal(s.psctColors.cost, DEFAULTS.psctColors.cost);
  assert.equal(s.psctColors.effect, '#00ff00');
  assert.deepEqual(s.shortcutKeys, { x: 'good_btn' });
  assert.deepEqual(s.customChatMessages, ['hi', '', '', '', '']);
  assert.equal(s.menuColors.bgAlpha, 1);
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
