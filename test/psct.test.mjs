import { test } from 'node:test';
import assert from 'node:assert/strict';
import { breakPoints, classify, psctCss } from '../src/features/psct.js';

// Coloured runs as [role, text], in order; uncoloured text is skipped.
const runs = (text, options) => {
  const roles = classify(text, options);
  const out = [];
  let cur = null;
  let start = 0;
  for (let i = 0; i <= text.length; i++) {
    const r = i < text.length ? roles[i] : 'END';
    if (r !== cur) {
      if (cur) out.push([cur, text.slice(start, i)]);
      cur = r;
      start = i;
    }
  }
  return out;
};

const roleOf = (text, fragment, options) => {
  const i = text.indexOf(fragment);
  assert.ok(i >= 0, `fragment not in text: ${fragment}`);
  const roles = classify(text, options).slice(i, i + fragment.length);
  const set = new Set(roles);
  assert.equal(set.size, 1, `"${fragment}" is split across roles: ${[...set].join(', ')}`);
  return roles[0];
};

// How DuelingBook shows a Pendulum Monster: two headed parts.
const pendulum = (pend, monster) => `Pendulum Effect:\n${pend}\n\nMonster Effect:\n${monster}`;

const ODD_EYES = pendulum(
  'You can reduce the battle damage you take from an attack involving a Pendulum Monster you control to 0. During your End Phase: You can destroy this card, and if you do, add 1 Pendulum Monster with 1500 or less ATK from your Deck to your hand. You can only use each Pendulum Effect of "Odd-Eyes Pendulum Dragon" once per turn.',
  "If this card battles an opponent's monster, any battle damage this card inflicts to your opponent is doubled.",
);

test('pendulum: headers stay plain and each part is coloured on its own', () => {
  assert.equal(roleOf(ODD_EYES, 'Pendulum Effect:', { lore: false }), null);
  assert.equal(roleOf(ODD_EYES, 'Monster Effect:', { lore: false }), null);
  assert.equal(roleOf(ODD_EYES, 'During your End Phase:', { lore: false }), 'condition');
  assert.equal(roleOf(ODD_EYES, 'You can destroy this card', { lore: false }), 'effect');
  assert.equal(roleOf(ODD_EYES, 'You can only use each Pendulum Effect', { lore: false }), 'restriction');
  // Continuous effect with no colon: still an effect.
  assert.equal(roleOf(ODD_EYES, 'If this card battles', { lore: false }), 'effect');
  assert.equal(roleOf(ODD_EYES, 'You can reduce the battle damage', { lore: false }), 'effect');
});

test('pendulum: the same text works when the card type is unknown', () => {
  assert.equal(roleOf(ODD_EYES, 'Pendulum Effect:'), null);
  assert.equal(roleOf(ODD_EYES, 'During your End Phase:'), 'condition');
  assert.equal(roleOf(ODD_EYES, 'If this card battles'), 'effect');
});

test('pendulum: Normal Pendulum lore stays plain, its Pendulum Effect does not', () => {
  const text = pendulum(
    'Once per turn: You can target 1 face-up monster you control; it gains 300 ATK.',
    'A wandering performer who dreams of the stage.',
  );
  assert.equal(roleOf(text, 'Once per turn:', { lore: true }), 'condition');
  assert.equal(roleOf(text, 'it gains 300 ATK.', { lore: true }), 'effect');
  assert.equal(roleOf(text, 'A wandering performer', { lore: true }), null);
});

test('pendulum: nothing is coloured across a line break', () => {
  const text = ODD_EYES;
  const roles = classify(text, { lore: false });
  [...text].forEach((ch, i) => {
    if (ch === '\n') assert.equal(roles[i], null);
  });
});

test('normal monster: lore with a colon stays plain when the frame says Normal', () => {
  const text = 'Which came first: The cosmos or the egg? It is the creator of this explosive way of thinking.';
  assert.deepEqual(runs(text, { lore: true }), []);
});

test('extra deck: material lines stay plain, effects below are coloured', () => {
  const text =
    '2 Level 4 monsters\nOnce per turn: You can detach 1 material from this card; destroy 1 card on the field.';
  assert.equal(roleOf(text, '2 Level 4 monsters', { lore: false }), null);
  assert.equal(roleOf(text, 'Once per turn:', { lore: false }), 'condition');
  assert.equal(roleOf(text, 'You can detach 1 material from this card;', { lore: false }), 'cost');
  assert.equal(roleOf(text, 'destroy 1 card on the field.', { lore: false }), 'effect');
  const fusion = '"Dark Magician" + "Buster Blader"\nThis card gains 500 ATK for each Dragon monster your opponent controls.';
  assert.equal(roleOf(fusion, '"Dark Magician" + "Buster Blader"', { lore: false }), null);
  assert.equal(roleOf(fusion, 'This card gains 500 ATK', { lore: false }), 'effect');
});

test('rush duel: [REQUIREMENT] is the cost, [EFFECT] the effect, labels plain', () => {
  const text = '[REQUIREMENT] Send 1 card from your hand to the Graveyard.\n[EFFECT] Draw 1 card. Then, you can gain 500 LP.';
  assert.equal(roleOf(text, '[REQUIREMENT]', { lore: false }), null);
  assert.equal(roleOf(text, 'Send 1 card from your hand to the Graveyard.', { lore: false }), 'cost');
  assert.equal(roleOf(text, '[EFFECT]', { lore: false }), null);
  assert.equal(roleOf(text, 'Draw 1 card.', { lore: false }), 'effect');
  assert.equal(roleOf(text, 'Then, you can gain 500 LP.', { lore: false }), 'effect');
  const cont = '[CONTINUOUS EFFECT] Your monsters gain 300 ATK.';
  assert.equal(roleOf(cont, 'Your monsters gain 300 ATK.', { lore: false }), 'effect');
  assert.equal(roleOf(cont, '[CONTINUOUS EFFECT]', { lore: false }), null);
});

test('rush duel: link arrows like [L] are not labels', () => {
  const text = 'This card points to [L] and [R]: You can draw 1 card.';
  assert.equal(roleOf(text, 'This card points to [L] and [R]:', { lore: false }), 'condition');
});

test('bullets: each choice keeps its own cost and effect', () => {
  const text =
    'Activate 1 of these effects;\n● Send 1 monster from your Extra Deck to the GY, then target 1 face-up card on the field; destroy it.\n● Draw 1 card.';
  assert.equal(roleOf(text, 'Activate 1 of these effects;', { lore: false }), 'cost');
  assert.equal(roleOf(text, '● Send 1 monster from your Extra Deck to the GY, then target 1 face-up card on the field;', { lore: false }), 'cost');
  assert.equal(roleOf(text, 'destroy it.', { lore: false }), 'effect');
  assert.equal(roleOf(text, '● Draw 1 card.', { lore: false }), 'effect');
});

test('brackets: notes stay plain, limits in brackets are limits, (Quick Effect) is part of the condition', () => {
  const text =
    '(This card is always treated as a "Branded" card.)\n(Quick Effect): You can target 1 monster; banish it. (This is a Quick Effect.) (You can only use this effect of "X" once per turn.)';
  assert.equal(roleOf(text, '(This card is always treated as a "Branded" card.)', { lore: false }), null);
  assert.equal(roleOf(text, '(Quick Effect):', { lore: false }), 'condition');
  assert.equal(roleOf(text, 'banish it.', { lore: false }), 'effect');
  assert.equal(roleOf(text, '(This is a Quick Effect.)', { lore: false }), null);
  assert.equal(roleOf(text, '(You can only use this effect of "X" once per turn.)', { lore: false }), 'restriction');
});

test('quotes: colons and full stops inside card names never split', () => {
  const text = 'If you control "Mr. Volcano": You can add 1 "Ars Magna: Test" from your Deck to your hand.';
  assert.equal(roleOf(text, 'If you control "Mr. Volcano":', { lore: false }), 'condition');
  assert.equal(roleOf(text, 'You can add 1 "Ars Magna: Test" from your Deck to your hand.', { lore: false }), 'effect');
});

test('old wording: effects written before PSCT are still coloured', () => {
  const text = 'If there are 3 face-up "Lacooda" on your side of the field, you can Tribute 2 of them to draw 3 cards.';
  assert.equal(roleOf(text, text, { lore: false }), 'effect');
});

test('continuation: a sentence that carries on an effect is part of it', () => {
  const text = 'You can discard 1 card; Special Summon this card from your hand. It cannot attack this turn.';
  assert.equal(roleOf(text, 'It cannot attack this turn.', { lore: false }), 'effect');
});

test('rules text: name and "treated as" lines stay plain, "cannot be negated" is a limit', () => {
  const text = 'This card\'s name becomes "Dark Magician" while on the field.\nThis effect cannot be negated.';
  assert.equal(roleOf(text, 'This card\'s name becomes "Dark Magician" while on the field.', { lore: false }), null);
  assert.equal(roleOf(text, 'This effect cannot be negated.', { lore: false }), 'restriction');
});

test('summoning conditions are limits', () => {
  const text = 'Cannot be Normal Summoned/Set. Must be Special Summoned by its own effect.';
  assert.deepEqual(
    runs(text, { lore: false }).map((r) => r[0]),
    ['restriction', 'restriction'],
  );
});

test('spacing: no coloured run starts or ends a line with a space', () => {
  const text = ODD_EYES;
  runs(text, { lore: false }).forEach(([, chunk]) => assert.doesNotMatch(chunk, /^\s/));
});

test('OCG layout: a new line after each sentence and each activation colon', () => {
  const text = 'If this card is Normal Summoned: You can discard 1 card; add 1 "Mr. Volcano: X" from your Deck to your hand. You can only use this effect of "X" once per turn.';
  const at = [...breakPoints(text, { lore: false })].sort((a, b) => a - b);
  assert.deepEqual(at.map((i) => text.slice(i, i + 8).trim().slice(0, 6)), ['You ca', 'You ca']);
  assert.equal(text[at[0] - 1], ':');
  assert.equal(text[at[1] - 1], '.');
});

test('OCG layout: no break at the end of a line, inside quotes or for lore', () => {
  assert.equal(breakPoints('Draw 1 card.').size, 0);
  assert.equal(breakPoints('Add 1 "Ars Magna: Test" to your hand.').size, 0);
  assert.equal(breakPoints('Which came first: The cosmos or the egg? It is the creator.', { lore: true }).size, 0);
  const pend = 'Pendulum Effect:\nOnce per turn: You can draw 1 card.\n\nMonster Effect:\nA wandering performer. Loves the stage.';
  const at = [...breakPoints(pend, { lore: true })];
  assert.equal(at.length, 1);
  assert.ok(pend.slice(at[0]).startsWith(' You can draw'));
});

test('psct: decimals and ellipses are not sentence ends', () => {
  const text = 'Gains 1.5 times its ATK... Then destroy it.';
  const pts = [...breakPoints(text)];
  assert.ok(!pts.some((p) => p > 6 && p < 10), 'no break inside 1.5');
  assert.equal(pts.filter((p) => text[p - 1] === '.' && text[p] === '.').length, 0, 'no break between dots');
});

test('psct: line breaks alone keep DuelingBook colours', () => {
  const css = psctCss(null);
  assert.ok(css.includes('display: inline'));
  assert.doesNotMatch(css, /color:/);
});
