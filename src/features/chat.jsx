import { useEffect } from 'react';
import { getSettings, useSettings } from '../lib/settings';
import { removePageStyle, setPageStyle } from '../lib/dom';
import { getDuelState } from '../lib/bridge';
import { alertUser } from '../lib/notify';

// Duel chat lines look like:
//   <span><b><font color="#0000FF">name: </font></b><font>message</font><br></span>
// A line's author is the leading "name: " text.

const MUTED = 'dbte-chat-muted';
const MENTION = 'dbte-chat-mention';

const CHAT_CSS = `
.${MUTED} { display: none !important; }
.${MUTED} + br { display: none !important; }
.${MENTION} { background: rgba(232, 198, 106, 0.28) !important; border-radius: 3px; box-shadow: 0 0 0 2px rgba(232, 198, 106, 0.28); }
`;

const authorOf = (line) => {
  const head = line.querySelector('b, font');
  const m = head && head.textContent.match(/^\s*(.+?):\s*$/);
  return m ? m[1].trim() : null;
};

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const classifyLine = (line, opts) => {
  if (line.nodeType !== 1 || line.tagName !== 'SPAN' || !line.closest('.cout_txt')) return false;
  const author = authorOf(line);
  if (!author) return false;
  const muted = opts.muted.has(author.toLowerCase());
  line.classList.toggle(MUTED, muted);
  let mention = false;
  if (!muted && opts.mentionRe && author !== opts.me) {
    const message = line.textContent.slice(line.textContent.indexOf(':') + 1);
    mention = opts.mentionRe.test(message);
  }
  line.classList.toggle(MENTION, mention && opts.highlight);
  return mention;
};

export const ChatEffect = () => {
  const { chatMuted, chatHighlightMentions, chatMentionAlert } = useSettings();
  const active = chatMuted.length > 0 || chatHighlightMentions || chatMentionAlert;

  useEffect(() => {
    if (!active) return undefined;
    setPageStyle('dbte-chat', CHAT_CSS);
    const opts = () => {
      const me = getDuelState().me;
      return {
        me,
        muted: new Set(getSettings().chatMuted.map((n) => n.toLowerCase())),
        mentionRe: me ? new RegExp(`(^|[^\\w])${escapeRe(me)}([^\\w]|$)`, 'i') : null,
        highlight: getSettings().chatHighlightMentions,
      };
    };

    const sweep = () => {
      const o = opts();
      document.querySelectorAll('.cout_txt span').forEach((line) => classifyLine(line, o));
    };
    sweep();

    const observer = new MutationObserver((mutations) => {
      let o = null;
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1 || node.tagName !== 'SPAN') continue;
          o = o || opts();
          const mentioned = classifyLine(node, o);
          if (mentioned && getSettings().chatMentionAlert) {
            alertUser(getSettings(), 'You were mentioned', node.textContent.trim().slice(0, 140));
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      removePageStyle('dbte-chat');
      document.querySelectorAll(`.${MUTED}, .${MENTION}`).forEach((el) => el.classList.remove(MUTED, MENTION));
    };
  }, [active, chatMuted, chatHighlightMentions, chatMentionAlert]);
  return null;
};
