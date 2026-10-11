import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLACES, TABS, THEME_VIEWS, placeById, placeChain, placeFields, placePath } from '../src/ui/places.js';
import { markParts, normalise, rank, scoreFields, searchThemes } from '../src/ui/search.js';
import { MAX_RECENT, cleanIds, pushRecent, toggleId } from '../src/lib/favourites.js';
import { withDefaults, LOCAL_SETTING_KEYS } from '../src/lib/defaults.js';
import { PRESETS, PRESET_GROUPS } from '../src/features/theme/presets.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const labels = (q) => rank(q, PLACES, placeFields).map((p) => p.label);

test('index: ids are unique and every tab, view and parent exists', () => {
  assert.equal(new Set(PLACES.map((p) => p.id)).size, PLACES.length);
  PLACES.forEach((p) => {
    assert.ok(TABS.some((t) => t.id === p.tab), `${p.id}: tab ${p.tab}`);
    if (p.view) assert.ok(THEME_VIEWS.some((v) => v.id === p.view), `${p.id}: view ${p.view}`);
    if (p.parent) {
      assert.ok(placeById[p.parent], `${p.id}: parent ${p.parent}`);
      assert.equal(placeById[p.parent].tab, p.tab, `${p.id}: parent on another tab`);
    }
    assert.ok(p.label && typeof p.label === 'string', `${p.id}: label`);
  });
});

test('index: no parent cycles; chains end at a top-level section', () => {
  PLACES.forEach((p) => {
    const chain = placeChain(p.id);
    assert.equal(new Set(chain).size, chain.length, p.id);
    assert.ok(!placeById[chain[chain.length - 1]].parent);
  });
});

// The drift guard: the index and the UI must name the same places.
test('index: every place used in the UI is indexed, and every indexed place is used', () => {
  const files = [
    ...readdirSync(join(root, 'src/ui')).filter((f) => f.endsWith('.jsx')).map((f) => join(root, 'src/ui', f)),
    join(root, 'src/features/deck.jsx'),
  ];
  const source = files.map((f) => readFileSync(f, 'utf8')).join('\n');
  const used = new Set([...source.matchAll(/(?:place|data-place)="([\w-]+)"/g)].map((m) => m[1]));
  used.forEach((id) => assert.ok(placeById[id], `UI uses place "${id}" that places.js does not list`));
  PLACES.filter((p) => !p.generated).forEach((p) => assert.ok(used.has(p.id), `places.js lists "${p.id}" but no UI renders it`));
  assert.match(source, /place=\{`token-\$\{t\.key\}`\}/);
  assert.match(source, /place=\{`area-\$\{a\.id\}`\}/);
});

test('index: paths read like breadcrumbs', () => {
  assert.equal(placePath(placeById.alertSound), 'Duel › Alerts');
  assert.equal(placePath(placeById.themeMotion), 'Theme › Style › Background pattern');
  assert.equal(placePath(placeById.alerts), 'Duel');
});

test('search: label prefix ranks first; every word must match', () => {
  assert.equal(labels('notes')[0], 'Notes');
  assert.equal(labels('dark')[0], 'Simple dark mode');
  assert.ok(labels('mute').includes('Muted players'));
  assert.deepEqual(labels('alerts zebra'), []);
  assert.equal(labels('duel alerts')[0], 'Alerts');
});

test('search: finds settings by keyword, path and description', () => {
  assert.ok(labels('hotkeys').includes('Shortcuts in duels'));
  assert.ok(labels('lag').includes('Motion'));
  assert.ok(labels('wallpaper').includes('Your own background'));
  assert.ok(labels('psct').includes('Colour card text'));
  assert.ok(labels('accent').includes('Accent'), 'colour tokens are searchable');
});

test('search: forgives case, accents, apostrophes and one typo', () => {
  assert.deepEqual(labels('NOTES').slice(0, 1), ['Notes']);
  assert.ok(labels('reconect').includes('Reconnect automatically'));
  assert.ok(labels('backgrund').includes('Show my background'));
  assert.ok(labels('duelingbooks').length >= 1);
  assert.equal(normalise('Pokémon’s'), 'pokemons');
  assert.equal(scoreFields('', { label: 'x' }), null);
});

test('search: themes by name, blurb, group and light/dark tag', () => {
  const names = (q) => searchThemes(q, PRESETS, PRESET_GROUPS).map((p) => p.name);
  assert.equal(names('obsid')[0], 'Obsidian');
  assert.ok(names('archetypes').includes('Branded'));
  assert.ok(names('light').includes('Parchment'));
  assert.ok(!names('light').includes('Obsidian'));
  assert.ok(names('ember').includes('Crimson'));
  assert.deepEqual(names('qqqq'), []);
});

test('search: marks matched word starts only', () => {
  const hits = (t, q) => markParts(t, q).filter((p) => p.hit).map((p) => p.text);
  assert.deepEqual(hits('Play a sound', 'sou'), ['sou']);
  assert.deepEqual(hits('Background pattern', 'pat back'), ['Back', 'pat']);
  assert.deepEqual(hits('Only when I’m away', 'im'), ['I’m']);
  assert.equal(markParts('Text', '').map((p) => p.text).join(''), 'Text');
  assert.deepEqual(hits('Starlight', 'light'), ['light'], 'mid-word match is marked when no word starts with it');
});

test('favourites: toggle adds and removes; recent keeps newest first, unique, capped', () => {
  assert.deepEqual(toggleId([], 'xyz'), ['xyz']);
  assert.deepEqual(toggleId(['xyz', 'link'], 'xyz'), ['link']);
  let recent = [];
  ['a', 'b', 'c', 'a'].forEach((id) => {
    recent = pushRecent(recent, id);
  });
  assert.deepEqual(recent, ['a', 'c', 'b']);
  for (let i = 0; i < 20; i += 1) recent = pushRecent(recent, `p${i}`);
  assert.equal(recent.length, MAX_RECENT);
  assert.equal(recent[0], 'p19');
  const full = Array.from({ length: 3 }, (_, i) => `f${i}`);
  assert.deepEqual(toggleId(full, 'new', 3), ['f1', 'f2', 'new'], 'a full list drops its oldest');
});

test('favourites: stored lists are cleaned, unknown ids kept, defaults empty', () => {
  assert.deepEqual(cleanIds(['link', 'link', 7, 'Bad Id', 'future-theme'], 10), ['link', 'future-theme']);
  assert.deepEqual(cleanIds('nope', 10), []);
  const d = withDefaults({});
  assert.deepEqual(d.themeFavourites, []);
  assert.deepEqual(d.themeRecent, []);
  assert.deepEqual(withDefaults({ themeFavourites: ['xyz', null, 'xyz'] }).themeFavourites, ['xyz']);
  assert.equal(withDefaults({ themeRecent: Array.from({ length: 30 }, (_, i) => `t${i}`) }).themeRecent.length, MAX_RECENT);
  assert.ok(LOCAL_SETTING_KEYS.includes('themeRecent'), 'recently used stays on this device');
});
