import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DELAYS_S, connectionStatus, nextDelay } from '../src/lib/reconnect.js';
import { SYNC_ITEM_BUDGET, byteSize, calc, cleanAliases, handleChatLine } from '../src/lib/chatCommands.js';
import { withDefaults } from '../src/lib/defaults.js';

test('reconnect: acts on dropped, closed and full servers', () => {
  ['lost_conn2', 'closed', 'over_limit'].forEach((frame) => assert.equal(connectionStatus({ frame }), 'lost', frame));
  assert.equal(connectionStatus({ frame: 'main_menu', message: 'Error 1006 Lost Connection' }), 'lost');
});

test('reconnect: never fights another session, a moderator or an idle timeout', () => {
  ['already_logged_in', 'kicked', 'banned', 'timed_out', 'terminated', 'rejected'].forEach((frame) =>
    assert.equal(connectionStatus({ frame }), 'stop', frame),
  );
  assert.equal(connectionStatus({ frame: 'front_page', message: 'Error Already logged into duel server elsewhere!' }), 'stop');
});

test('reconnect: leaves DuelingBook to retry by itself, and never acts mid-duel', () => {
  assert.equal(connectionStatus({ frame: 'lost_conn' }), 'self-retry');
  assert.equal(connectionStatus({ frame: 'duel', message: 'Lost Connection', inDuel: true }), 'ok');
  assert.equal(connectionStatus({ frame: 'main_menu', message: 'Message You can create a note' }), 'ok');
});

test('reconnect: backs off 5, 10, 20, 40, 60 s then stops', () => {
  assert.deepEqual(DELAYS_S.map((_, i) => nextDelay(i)), [5, 10, 20, 40, 60]);
  assert.equal(nextDelay(DELAYS_S.length), null);
});

test('chat: DuelingBook commands and normal chat pass through', () => {
  ['/draw 2', '/mill 1', '/half', 'hello', 'GG / wp', '/unknownthing'].forEach((l) => assert.equal(handleChatLine(l).kind, 'pass', l));
});

test('chat: /calc does Life Point maths without eval', () => {
  assert.equal(calc('8000-2500*2'), 3000);
  assert.equal(calc('(8000 - 1000) / 2'), 3500);
  assert.equal(calc('-500+1000'), 500);
  assert.equal(calc('alert(1)'), null);
  assert.equal(calc('1/0'), null);
  assert.equal(calc('2**3'), null);
  assert.equal(calc('('.repeat(30) + '1' + ')'.repeat(30)), null);
  const r = handleChatLine('/calc 8000-2500*2');
  assert.equal(r.kind, 'local');
  assert.match(r.lines[0], /= 3000$/);
});

test('chat: /note and /help stay local', () => {
  assert.deepEqual(handleChatLine('/note opp has Ash'), { kind: 'note', text: 'opp has Ash' });
  assert.equal(handleChatLine('/note').kind, 'local');
  const help = handleChatLine('/help', [{ name: 'gl', text: 'Good luck!' }]);
  assert.equal(help.kind, 'local');
  assert.ok(help.lines.some((l) => l.includes('/gl')));
});

test('chat: shortcuts expand, extra words are appended, reserved names are refused', () => {
  const aliases = [{ name: 'gl', text: 'Good luck, have fun!' }, { name: 'draw', text: 'nope' }, { name: 'Bad Name', text: 'x' }];
  assert.deepEqual(handleChatLine('/gl', aliases), { kind: 'send', text: 'Good luck, have fun!' });
  assert.deepEqual(handleChatLine('/GL friend', aliases), { kind: 'send', text: 'Good luck, have fun! friend' });
  assert.equal(handleChatLine('/draw 1', aliases).kind, 'pass');
  assert.deepEqual(cleanAliases(aliases).map((a) => a.name), ['gl']);
});

test('sync size: aliases and muted names stay under the 8 KB item limit in any script', () => {
  const aliases = Array.from({ length: 15 }, (_, i) => ({ name: `a${i}`, text: '漢'.repeat(200) }));
  const kept = cleanAliases(aliases);
  assert.ok(byteSize(kept) <= SYNC_ITEM_BUDGET && kept.length > 0 && kept.length < 15);
  const muted = withDefaults({ chatMuted: Array.from({ length: 100 }, (_, i) => `${i}${'漢'.repeat(39)}`) }).chatMuted;
  assert.ok(byteSize(muted) <= SYNC_ITEM_BUDGET && muted.length > 0);
});
