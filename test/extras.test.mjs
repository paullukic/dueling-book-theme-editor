import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DELAYS_S, connectionStatus, nextDelay } from '../src/lib/reconnect.js';

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
