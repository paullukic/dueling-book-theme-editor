import { useState } from 'react';
import { updateSettings, useSettings } from '../lib/settings';
import { ALIAS_NAME, MAX_ALIASES, NATIVE_COMMANDS, OWN_COMMANDS, isReservedAlias } from '../lib/chatCommands';
import { Disclosure } from './controls';

const AliasEditor = () => {
  const { chatAliases } = useSettings();
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const add = (e) => {
    e.preventDefault();
    const n = name.trim().replace(/^\//, '').toLowerCase();
    if (!ALIAS_NAME.test(n)) return setError('Use 1 to 12 letters or digits, like gl.');
    if (isReservedAlias(n)) return setError(`/${n} is already a command.`);
    if (chatAliases.some((a) => a.name === n)) return setError(`You already have /${n}.`);
    if (!text.trim()) return setError('Type the message it should send.');
    if (chatAliases.length >= MAX_ALIASES) return setError(`You can keep up to ${MAX_ALIASES} shortcuts.`);
    const next = [...chatAliases, { name: n, text: text.trim() }];
    // Browser sync stores at most 8 KB per setting.
    if (new TextEncoder().encode(JSON.stringify(next)).length > 7500) {
      return setError('Your shortcuts are too long to sync. Shorten or remove one first.');
    }
    updateSettings({ chatAliases: next });
    setName('');
    setText('');
    setError('');
    return undefined;
  };

  const remove = (n) => updateSettings({ chatAliases: chatAliases.filter((a) => a.name !== n) });

  return (
    <>
      <p className="note">Your shortcuts: type the name in duel chat and it sends the message.</p>
      {chatAliases.length > 0 ? (
        <ul className="alias-list">
          {chatAliases.map((a) => (
            <li key={a.name}>
              <code>/{a.name}</code>
              <span className="alias-text">{a.text}</span>
              <button type="button" className="icon-text-btn" onClick={() => remove(a.name)} aria-label={`Remove /${a.name}`}>
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="note">No shortcuts yet.</p>
      )}
      <form className="alias-form" onSubmit={add}>
        <label className="sr-only" htmlFor="dbte-alias-name">
          Shortcut name
        </label>
        <input
          id="dbte-alias-name"
          className="field alias-name"
          value={name}
          placeholder="/gl"
          maxLength={13}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="sr-only" htmlFor="dbte-alias-text">
          Message to send
        </label>
        <input
          id="dbte-alias-text"
          className="field"
          value={text}
          placeholder="Good luck, have fun!"
          maxLength={200}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn">
          Add
        </button>
      </form>
      {error && (
        <p className="note note-error" role="alert">
          {error}
        </p>
      )}
      <Disclosure title="All commands">
        <dl className="command-list">
          {[...OWN_COMMANDS, ...NATIVE_COMMANDS].map(([c, d]) => (
            <div key={c}>
              <dt>
                <code>{c}</code>
              </dt>
              <dd>{d}</dd>
            </div>
          ))}
        </dl>
      </Disclosure>
    </>
  );
};

export default AliasEditor;
