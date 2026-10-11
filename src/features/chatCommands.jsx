import { useEffect } from 'react';
import { getSettings, useSettings } from '../lib/settings';
import { mutateLocal } from '../lib/localStore';
import { removePageStyle, setPageStyle } from '../lib/dom';
import { handleChatLine } from '../lib/chatCommands';

const LOCAL = 'dbte-local-line';
const CSS = `.${LOCAL} { font-style: italic; opacity: 0.8; }`;

// Shows a line in the chat box the input belongs to, for this user only.
const showLocal = (input, lines) => {
  let box = input.parentElement;
  while (box && box !== document.body && !box.querySelector('.cout_txt')) box = box.parentElement;
  const out = box && box.querySelector('.cout_txt');
  const viewport = out && (out.querySelector('.os_viewport, .os-viewport') || out);
  if (!viewport) return;
  lines.forEach((text) => {
    const span = document.createElement('span');
    span.className = LOCAL;
    const who = document.createElement('b');
    who.textContent = 'Only you: ';
    span.append(who, document.createTextNode(text), document.createElement('br'));
    viewport.appendChild(span);
  });
  viewport.scrollTop = viewport.scrollHeight;
};

const isChatInput = (el) => el && el.tagName === 'INPUT' && el.classList.contains('cin_txt');

const ChatCommandsEffect = () => {
  const { chatCommandsEnabled } = useSettings();

  useEffect(() => {
    if (!chatCommandsEnabled) return undefined;
    setPageStyle('dbte-chat-commands', CSS);
    let swallowNext = false;

    const onKeyDown = (e) => {
      if (e.key !== 'Enter' || !isChatInput(e.target)) return;
      const input = e.target;
      const result = handleChatLine(input.value, getSettings().chatAliases);
      if (result.kind === 'pass') return;
      if (result.kind === 'send') {
        // Let DuelingBook send the expanded text as if it was typed.
        input.value = result.text;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
      // Handled here: DuelingBook never sees it.
      e.preventDefault();
      e.stopImmediatePropagation();
      swallowNext = true;
      input.value = '';
      if (result.kind === 'note') {
        mutateLocal('notes', (cur) => `${typeof cur === 'string' && cur ? `${cur}\n` : ''}${result.text}`).then((ok) =>
          showLocal(input, [
            ok
              ? `Added to your notes${getSettings().notesEnabled ? '' : ' (turn on Notes in the Duel tab to see them)'}.`
              : 'Could not read your notes just now, so nothing was changed. Try again.',
          ]),
        );
      } else showLocal(input, result.lines);
    };
    // DuelingBook may send on keypress or keyup as well: drop those for a handled line.
    const onKeyLater = (e) => {
      if (!swallowNext || e.key !== 'Enter' || !isChatInput(e.target)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.type === 'keyup') swallowNext = false;
    };

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keypress', onKeyLater, true);
    window.addEventListener('keyup', onKeyLater, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keypress', onKeyLater, true);
      window.removeEventListener('keyup', onKeyLater, true);
      removePageStyle('dbte-chat-commands');
    };
  }, [chatCommandsEnabled]);
  return null;
};

export default ChatCommandsEffect;
