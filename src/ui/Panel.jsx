import { useEffect, useRef, useState } from 'react';
import { retryStorage, updateSettings, useSettings, useStorageProblem } from '../lib/settings';
import { useLocal, useLocalProblem } from '../lib/localStore';
import { useDuelState } from '../lib/bridge';
import { requestDesktopPermission } from '../lib/notify';
import { Disclosure, Group, SliderRow, ToggleRow } from './controls';
import ThemeTab from './ThemeTab';
import AliasEditor from './AliasEditor';
import ShortcutEditor from './ShortcutEditor';
import DeckTools from '../features/deck';
import { SupportNudge, SupportTab, WhatsNew } from './Support';
import { CardsIcon, ChatIcon, CloseIcon, GearIcon, PaletteIcon, SwordsIcon } from './icons';

const TABS = [
  { id: 'look', label: 'Theme', Icon: PaletteIcon },
  { id: 'duel', label: 'Duel', Icon: SwordsIcon },
  { id: 'chat', label: 'Chat', Icon: ChatIcon },
  { id: 'deck', label: 'Deck', Icon: CardsIcon },
  { id: 'more', label: 'Settings', Icon: GearIcon },
];

const set = (key) => (value) => updateSettings({ [key]: value });

const DuelTab = () => {
  const s = useSettings();
  const [permission, setPermission] = useState(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  );
  const enableDesktop = async (on) => {
    if (!on) {
      updateSettings({ alertDesktop: false });
      return;
    }
    const p = await requestDesktopPermission();
    setPermission(p);
    updateSettings({ alertDesktop: p === 'granted' });
  };
  const anyAlert = s.alertDuelFound || s.alertMyTurn;
  return (
    <>
      <Group title="Alerts">
        <ToggleRow
          label="Duel found"
          description="Get a ping when your match starts, so you can wait in another tab."
          checked={s.alertDuelFound}
          onChange={set('alertDuelFound')}
        />
        <ToggleRow
          label="Your turn"
          description="Get a ping each time your turn starts."
          checked={s.alertMyTurn}
          onChange={set('alertMyTurn')}
        />
        {anyAlert && (
          <div className="sub">
            <ToggleRow label="Play a sound" checked={s.alertSound} onChange={set('alertSound')} />
            <ToggleRow label="Flash the tab title" checked={s.alertTitle} onChange={set('alertTitle')} />
            <ToggleRow
              label="Desktop notification"
              description={
                permission === 'denied'
                  ? 'Blocked by your browser. Allow notifications for duelingbook.com in the address bar, then try again.'
                  : 'Shows a system notification. Your browser asks once.'
              }
              checked={s.alertDesktop}
              onChange={enableDesktop}
            />
            <ToggleRow
              label="Only when I’m away"
              description="Stay quiet while the DuelingBook tab is focused."
              checked={s.alertOnlyWhenHidden}
              onChange={set('alertOnlyWhenHidden')}
            />
          </div>
        )}
      </Group>
      <Group title="Speed">
        <ToggleRow
          label="Skip the intro"
          description="Goes straight past the title screen and connects to the main menu each time DuelingBook loads."
          checked={s.skipIntro}
          onChange={set('skipIntro')}
        />
        <ToggleRow
          label="Reconnect automatically"
          description="When DuelingBook drops the connection or is full, reloads and connects again after 5, 10, 20, 40 and 60 seconds, with a Cancel button. Never when you are logged in elsewhere or kicked."
          checked={s.autoReconnect}
          onChange={set('autoReconnect')}
        />
        <SliderRow
          label="Animation speed"
          value={s.animationSpeed}
          min={1}
          max={4}
          step={0.5}
          format={(v) => (v === 1 ? 'Normal' : `${v}× faster`)}
          onChange={set('animationSpeed')}
        />
      </Group>
      <Group title="Tools">
        <ToggleRow
          label="Notes"
          description="A notepad that floats over the duel and keeps what you write."
          checked={s.notesEnabled}
          onChange={set('notesEnabled')}
        />
        <ToggleRow
          label="Action log"
          description="Lists cards added, set, revealed or returned, plus your opponent’s hand whenever it is revealed."
          checked={s.trackerEnabled}
          onChange={set('trackerEnabled')}
        >
          <ToggleRow
            label="Clear when a new duel starts"
            checked={s.trackerAutoClear}
            onChange={set('trackerAutoClear')}
          />
        </ToggleRow>
      </Group>
      <Group title="Keyboard shortcuts">
        <ToggleRow
          label="Shortcuts in duels"
          description={
            <>
              One key per action while a duel is open. Ignored while you type, and with <kbd>Shift</kbd>, <kbd>Ctrl</kbd> or <kbd>Alt</kbd> held.
            </>
          }
          checked={s.shortcutsEnabled}
          onChange={set('shortcutsEnabled')}
        />
        {s.shortcutsEnabled && (
          <>
            <Disclosure title="Actions">
              <ShortcutEditor which="actions" />
            </Disclosure>
            <Disclosure title="Phase questions">
              <p className="note">Asks your opponent in chat, then moves to that phase.</p>
              <ShortcutEditor which="phases" />
            </Disclosure>
            <Disclosure title="Chat messages">
              <ShortcutEditor which="chat" />
            </Disclosure>
          </>
        )}
      </Group>
    </>
  );
};

const ChatTab = () => {
  const s = useSettings();
  const duel = useDuelState();
  const [name, setName] = useState('');
  const [full, setFull] = useState(false);
  const mute = (n) => {
    const clean = n.trim().replace(/:$/, '');
    if (!clean) return;
    if (s.chatMuted.some((m) => m.toLowerCase() === clean.toLowerCase())) return;
    const next = [...s.chatMuted, clean];
    // Browser sync stores at most 8 KB per setting.
    if (next.length > 100 || new TextEncoder().encode(JSON.stringify(next)).length > 7500) {
      setFull(true);
      return;
    }
    setFull(false);
    updateSettings({ chatMuted: next });
  };
  const unmute = (n, e) => {
    const input = e.currentTarget.getRootNode().getElementById('dbte-mute');
    updateSettings({ chatMuted: s.chatMuted.filter((m) => m !== n) });
    if (input) input.focus();
  };
  return (
    <>
      <Group title="Muted players">
        <p className="note">Their chat lines are hidden. They are not told.</p>
        <form
          className="inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            mute(name);
            setName('');
          }}
        >
          <label className="sr-only" htmlFor="dbte-mute">
            Username to mute
          </label>
          <input
            id="dbte-mute"
            className="field"
            value={name}
            placeholder="Username"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn">
            Mute
          </button>
        </form>
        {full && (
          <p className="note note-error" role="alert">
            Your mute list is full. Unmute someone first.
          </p>
        )}
        {duel.opponent && !s.chatMuted.some((m) => m.toLowerCase() === duel.opponent.toLowerCase()) && (
          <div className="btn-row">
            <button type="button" className="btn btn-quiet" onClick={() => mute(duel.opponent)}>
              Mute current opponent ({duel.opponent})
            </button>
          </div>
        )}
        {s.chatMuted.length > 0 ? (
          <div className="chips">
            {s.chatMuted.map((n) => (
              <span className="chip" key={n}>
                {n}
                <button type="button" onClick={(e) => unmute(n, e)} aria-label={`Unmute ${n}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="note">Nobody is muted.</p>
        )}
      </Group>
      <Group title="Mentions">
        <ToggleRow
          label="Highlight my name"
          description="Marks chat lines that mention your username."
          checked={s.chatHighlightMentions}
          onChange={set('chatHighlightMentions')}
        />
        <ToggleRow
          label="Alert me when mentioned"
          description="Uses the sound, title and notification choices from Duel → Alerts."
          checked={s.chatMentionAlert}
          onChange={set('chatMentionAlert')}
        />
      </Group>
      <Group title="Commands">
        <ToggleRow
          label="Chat commands"
          description="Type /help in duel chat. /calc and /note stay on your screen and are never sent; DuelingBook’s own commands like /draw 2 work as always."
          checked={s.chatCommandsEnabled}
          onChange={set('chatCommandsEnabled')}
        >
          <AliasEditor />
        </ToggleRow>
      </Group>
    </>
  );
};

const PROBLEMS = {
  load: {
    title: 'Could not read your settings',
    text: 'Changes you make now will not be saved until your browser lets the extension read its storage again. Retrying automatically.',
  },
  save: {
    title: 'Your last changes are not saved yet',
    text: 'Your browser asked to slow down. Retrying automatically.',
  },
  quota: {
    title: 'Your settings are too big to save',
    text: 'Browser sync allows about 8 KB per setting. Unmute some players or shorten your chat messages, then try again.',
  },
  localQuota: {
    title: 'Not enough room to save',
    text: 'Your background image or notes did not fit. Try a smaller image or shorter notes.',
  },
  local: {
    title: 'Notes or background not saved yet',
    text: 'Your browser could not save them just now. Retrying automatically.',
  },
};

const StorageProblem = () => {
  const settingsProblem = useStorageProblem();
  const localProblem = useLocalProblem();
  const problem = settingsProblem || (localProblem === 'quota' ? 'localQuota' : localProblem ? 'local' : null);
  if (!problem) return null;
  return (
    <div className="card-callout danger" role="alert">
      <h3>{PROBLEMS[problem].title}</h3>
      <p>{PROBLEMS[problem].text}</p>
      {settingsProblem && (
        <button type="button" className="btn" onClick={retryStorage}>
          Try again now
        </button>
      )}
    </div>
  );
};

const Panel = ({ onClose, logoUrl }) => {
  const { panelTab } = useSettings();
  const tab = TABS.some((t) => t.id === panelTab) ? panelTab : 'look';
  const bodyRef = useRef(null);
  const [meta, setMeta] = useLocal('meta', {});

  useEffect(() => {
    setMeta((m) => ({ ...(m || {}), panelOpens: ((m && m.panelOpens) || 0) + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [tab]);

  const onTabKey = (e) => {
    const i = TABS.findIndex((t) => t.id === tab);
    let next = null;
    if (e.key === 'ArrowRight') next = TABS[(i + 1) % TABS.length];
    else if (e.key === 'ArrowLeft') next = TABS[(i - 1 + TABS.length) % TABS.length];
    else if (e.key === 'Home') next = TABS[0];
    else if (e.key === 'End') next = TABS[TABS.length - 1];
    if (!next) return;
    e.preventDefault();
    updateSettings({ panelTab: next.id });
    const btn = e.currentTarget.querySelector(`[data-tab="${next.id}"]`);
    if (btn) btn.focus();
  };

  return (
    <div className="panel" role="dialog" aria-label="DuelingBook Theme Editor">
      <header className="panel-head">
        {logoUrl && <img className="panel-logo" src={logoUrl} alt="" />}
        <div className="panel-title">
          <h1>Theme Editor</h1>
          <p>For DuelingBook · v{chrome.runtime.getManifest().version}</p>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close panel (Esc)">
          <CloseIcon />
        </button>
      </header>
      <div className="tabs" role="tablist" aria-label="Sections" onKeyDown={onTabKey}>
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`dbte-tab-${id}`}
            data-tab={id}
            aria-selected={tab === id}
            aria-controls="dbte-tabpanel"
            tabIndex={tab === id ? 0 : -1}
            className="tab"
            onClick={() => updateSettings({ panelTab: id })}
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>
      <div
        className="panel-body"
        ref={bodyRef}
        id="dbte-tabpanel"
        role="tabpanel"
        aria-labelledby={`dbte-tab-${tab}`}
      >
        <StorageProblem />
        <WhatsNew meta={meta} setMeta={setMeta} />
        {tab !== 'more' && <SupportNudge meta={meta} setMeta={setMeta} />}
        {tab === 'look' && <ThemeTab />}
        {tab === 'duel' && <DuelTab />}
        {tab === 'chat' && <ChatTab />}
        {tab === 'deck' && <DeckTools />}
        {tab === 'more' && <SupportTab />}
      </div>
    </div>
  );
};

export default Panel;
