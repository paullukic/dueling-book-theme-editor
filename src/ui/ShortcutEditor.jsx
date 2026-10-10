import { useState } from 'react';
import { updateSettings, useSettings } from '../lib/settings';
import { CUSTOM_SLOTS } from '../lib/defaults';
import { ACTIONS, CUSTOM_PREFIX, PHASES } from '../features/duel';

const CUSTOM = Array.from({ length: CUSTOM_SLOTS }, (_, i) => ({
  id: `${CUSTOM_PREFIX}${i + 1}`,
  label: `Chat message ${i + 1}`,
  slot: i,
}));

const LABELS = Object.fromEntries(
  [...ACTIONS, ...PHASES.map((p) => ({ id: p.id, label: `Ask: ${p.label}?` })), ...CUSTOM].map((a) => [a.id, a.label]),
);

const keyFor = (keys, id) => Object.keys(keys).find((k) => keys[k] === id) || '';

const ShortcutEditor = ({ which }) => {
  const { shortcutKeys, customChatMessages } = useSettings();
  const [conflict, setConflict] = useState(null);

  const bind = (id, raw) => {
    const key = raw.slice(-1).toLowerCase();
    if (key && !/^[a-z0-9]$/.test(key)) {
      setConflict({ id, text: 'Use a letter or a number.' });
      return;
    }
    if (key && shortcutKeys[key] && shortcutKeys[key] !== id) {
      setConflict({
        id,
        text: `${key.toUpperCase()} already does "${LABELS[shortcutKeys[key]] || shortcutKeys[key]}". Clear it there first.`,
      });
      return;
    }
    setConflict(null);
    const next = { ...shortcutKeys };
    Object.keys(next).forEach((k) => {
      if (next[k] === id) delete next[k];
    });
    if (key) next[key] = id;
    updateSettings({ shortcutKeys: next });
  };

  const setMessage = (slot, value) => {
    const next = customChatMessages.slice();
    next[slot] = value.slice(0, 200);
    updateSettings({ customChatMessages: next });
  };

  const rows =
    which === 'phases'
      ? PHASES.map((p) => ({ id: p.id, label: `Ask: ${p.label}?` }))
      : which === 'chat'
        ? CUSTOM
        : ACTIONS;

  return (
    <div className="keylist">
      {rows.map((row) => (
        <Row
          key={row.id}
          row={row}
          value={keyFor(shortcutKeys, row.id)}
          onBind={(v) => bind(row.id, v)}
          conflict={conflict && conflict.id === row.id ? conflict.text : null}
        >
          {row.slot != null && (
            <textarea
              className="field chat-slot"
              rows={1}
              value={customChatMessages[row.slot] || ''}
              placeholder="Message to send"
              aria-label={`${row.label} text`}
              onChange={(e) => setMessage(row.slot, e.target.value)}
            />
          )}
        </Row>
      ))}
    </div>
  );
};

const Row = ({ row, value, onBind, conflict, children }) => {
  const id = `dbte-key-${row.id}`;
  return (
    <>
      <label htmlFor={id}>{row.label}</label>
      <input
        id={id}
        className="field key-input"
        value={value}
        placeholder="–"
        aria-label={`Key for ${row.label}`}
        aria-invalid={conflict ? 'true' : undefined}
        onChange={(e) => onBind(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            onBind('');
          }
        }}
      />
      {conflict && (
        <span className="conflict" role="alert">
          {conflict}
        </span>
      )}
      {children}
    </>
  );
};

export default ShortcutEditor;
