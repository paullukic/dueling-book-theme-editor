import { useMemo, useState } from 'react';
import { requestDeck, useDuelState } from '../lib/bridge';
import { Group } from '../ui/controls';
import { atLeastOne } from '../lib/odds';

const artUrl = (c) => (c.id && /^\d+$/.test(c.id) ? `https://images.duelingbook.com/card-pics/${c.id}.jpg` : '');

const pct = (p) => `${(p * 100).toFixed(p >= 0.995 || p < 0.1 ? 1 : 0)}%`;

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const cardClass = (c) => {
  if (c.cardType === 'Spell') return 'card-spell';
  if (c.cardType === 'Trap') return 'card-trap';
  if (/ritual/i.test(c.monsterColor)) return 'card-ritual';
  if (/normal/i.test(c.monsterColor)) return 'card-monster';
  return 'card-effect';
};

const DeckTools = () => {
  const duel = useDuelState();
  const [deck, setDeck] = useState(null);
  const [status, setStatus] = useState('');
  const [handSize, setHandSize] = useState(5);
  const [order, setOrder] = useState([]);
  const [drawn, setDrawn] = useState(0);
  const [picked, setPicked] = useState(() => new Set());
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (loading) return;
    setLoading(true);
    setStatus('Reading your deck…');
    let d = null;
    try {
      d = await requestDeck();
    } catch (e) {
      d = null;
    } finally {
      setLoading(false);
    }
    if (!d || !d.main || d.main.length === 0) {
      setDeck(null);
      setStatus('No deck found. Open the Deck Constructor, load a deck, then try again.');
      return;
    }
    setDeck(d);
    setPicked(new Set());
    setStatus('');
    const o = shuffle(d.main);
    setOrder(o);
    setDrawn(handSize);
  };

  const draw = (size = handSize) => {
    if (!deck) return;
    setOrder(shuffle(deck.main));
    setDrawn(size);
  };

  const unique = useMemo(() => {
    if (!deck) return [];
    const map = new Map();
    deck.main.forEach((c) => {
      const e = map.get(c.name) || { card: c, copies: 0 };
      e.copies += 1;
      map.set(c.name, e);
    });
    return [...map.values()].sort((a, b) => b.copies - a.copies || a.card.name.localeCompare(b.card.name));
  }, [deck]);

  const N = deck ? deck.main.length : 0;
  const K = unique.filter((u) => picked.has(u.card.name)).reduce((n, u) => n + u.copies, 0);
  const hand = order.slice(0, drawn);

  const togglePick = (name) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <>
      <Group title="Test hand">
        <p className="note">
          Draw sample opening hands from the deck loaded in the Deck Constructor. Nothing is sent to DuelingBook.
        </p>
        <div className="btn-row">
          <button type="button" className="btn btn-gold" onClick={load} disabled={loading}>
            {deck ? 'Reload deck' : 'Load my deck'}
          </button>
        </div>
        {status && <p className="note" role="status">{status}</p>}
        {!deck && !status && !duel.deckConstructor && (
          <p className="note">Tip: open the Deck Constructor first.</p>
        )}
        {deck && (
          <>
            <p className="note">
              {deck.deckName ? `${deck.deckName}: ` : ''}
              {N} main deck cards{deck.extraCount ? `, ${deck.extraCount} extra` : ''}.
            </p>
            <div className="btn-row" role="group" aria-label="Hand size">
              <button
                type="button"
                className={handSize === 5 ? 'btn btn-gold' : 'btn'}
                aria-pressed={handSize === 5}
                onClick={() => {
                  setHandSize(5);
                  draw(5);
                }}
              >
                Going first (5)
              </button>
              <button
                type="button"
                className={handSize === 6 ? 'btn btn-gold' : 'btn'}
                aria-pressed={handSize === 6}
                onClick={() => {
                  setHandSize(6);
                  draw(6);
                }}
              >
                Going second (6)
              </button>
            </div>
            <p className="sr-only" role="status">
              {hand.length ? `Drew ${hand.length} cards.` : ''}
            </p>
            <ul className="hand">
              {hand.map((c, i) => (
                <li key={`${i}-${c.name}`} className={cardClass(c)}>
                  {artUrl(c) && <img src={artUrl(c)} alt="" width={30} height={30} loading="lazy" />}
                  <span>{c.name}</span>
                </li>
              ))}
            </ul>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => draw()}>
                New hand
              </button>
              <button
                type="button"
                className="btn"
                disabled={drawn >= order.length}
                onClick={() => setDrawn((n) => Math.min(order.length, n + 1))}
              >
                Draw 1 more
              </button>
            </div>
          </>
        )}
      </Group>

      {deck && (
        <Group title="Opening odds">
          <p className="note">Tick the cards that count as a good start, like your starters.</p>
          {picked.size > 0 && (
            <div className="odds-result" role="status">
              At least one ticked card: <strong>{pct(atLeastOne(N, K, 5))}</strong> going first,{' '}
              <strong>{pct(atLeastOne(N, K, 6))}</strong> going second.
            </div>
          )}
          <table className="odds">
            <thead>
              <tr>
                <th scope="col">Card</th>
                <th scope="col">Copies</th>
                <th scope="col">5 cards</th>
                <th scope="col">6 cards</th>
              </tr>
            </thead>
            <tbody>
              {unique.map(({ card, copies }) => (
                <tr key={card.name}>
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        checked={picked.has(card.name)}
                        onChange={() => togglePick(card.name)}
                      />
                      {card.name}
                    </label>
                  </td>
                  <td>{copies}</td>
                  <td>{pct(atLeastOne(N, copies, 5))}</td>
                  <td>{pct(atLeastOne(N, copies, 6))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Group>
      )}
    </>
  );
};

export default DeckTools;
