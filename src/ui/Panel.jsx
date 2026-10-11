import { useEffect, useMemo, useRef, useState } from 'react';
import { retryStorage, updateSettings, useSettings, useStorageProblem } from '../lib/settings';
import { useLocal, useLocalProblem } from '../lib/localStore';
import { useDuelState } from '../lib/bridge';
import { requestDesktopPermission } from '../lib/notify';
import { isTypingEvent } from '../lib/dom';
import { Disclosure, Group, SliderRow, ToggleRow } from './controls';
import ThemeTab from './ThemeTab';
import AliasEditor from './AliasEditor';
import ShortcutEditor from './ShortcutEditor';
import LpStylePicker from './LpStylePicker';
import DeckTools from '../features/deck';
import { SupportNudge, SupportTab, WhatsNew } from './Support';
import { SearchField, SearchResults, searchAll } from './GlobalSearch';
import { TABS as TAB_LIST, placeById, placeChain } from './places';
import { setNav } from './nav';
import { CardsIcon, ChatIcon, CloseIcon, GearIcon, PaletteIcon, SwordsIcon } from './icons';

const ICONS = { look: PaletteIcon, duel: SwordsIcon, chat: ChatIcon, deck: CardsIcon, more: GearIcon };
const TABS = TAB_LIST.map((t) => ({ ...t, Icon: ICONS[t.id] }));

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
      <Group place="alerts">
        <ToggleRow
          place="alertDuelFound"
          checked={s.alertDuelFound}
          onChange={set('alertDuelFound')}
        />
        <ToggleRow
          place="alertMyTurn"
          checked={s.alertMyTurn}
          onChange={set('alertMyTurn')}
        />
        {anyAlert && (
          <div className="sub">
            <ToggleRow place="alertSound" checked={s.alertSound} onChange={set('alertSound')} />
            <ToggleRow place="alertTitle" checked={s.alertTitle} onChange={set('alertTitle')} />
            <ToggleRow
              place="alertDesktop"
              note={
                permission === 'denied'
                  ? 'Blocked by your browser. Allow notifications for duelingbook.com in the address bar, then try again.'
                  : null
              }
              checked={s.alertDesktop}
              onChange={enableDesktop}
            />
            <ToggleRow
              place="alertOnlyWhenHidden"
              checked={s.alertOnlyWhenHidden}
              onChange={set('alertOnlyWhenHidden')}
            />
          </div>
        )}
      </Group>
      <Group place="lifePoints">
        <LpStylePicker value={s.lpStyle} />
        <ToggleRow place="lpEffects" checked={s.lpEffects} onChange={set('lpEffects')} />
      </Group>
      <Group place="duelChat">
        <SliderRow
          place="duelChatOpacity"
          value={s.duelChatOpacity}
          min={0.3}
          max={1}
          step={0.05}
          format={(v) => (v === 1 ? 'Solid' : `${Math.round(v * 100)}%`)}
          onChange={set('duelChatOpacity')}
        />
      </Group>
      <Group place="speed">
        <ToggleRow
          place="skipIntro"
          checked={s.skipIntro}
          onChange={set('skipIntro')}
        />
        <ToggleRow
          place="autoReconnect"
          checked={s.autoReconnect}
          onChange={set('autoReconnect')}
        />
        <SliderRow
          place="animationSpeed"
          value={s.animationSpeed}
          min={1}
          max={4}
          step={0.5}
          format={(v) => (v === 1 ? 'Normal' : `${v}× faster`)}
          onChange={set('animationSpeed')}
        />
      </Group>
      <Group place="tools">
        <ToggleRow
          place="notesEnabled"
          checked={s.notesEnabled}
          onChange={set('notesEnabled')}
        />
        <ToggleRow
          place="trackerEnabled"
          checked={s.trackerEnabled}
          onChange={set('trackerEnabled')}
        >
          <ToggleRow
            place="trackerAutoClear"
            checked={s.trackerAutoClear}
            onChange={set('trackerAutoClear')}
          />
        </ToggleRow>
      </Group>
      <Group place="shortcuts">
        <ToggleRow
          place="shortcutsEnabled"
          checked={s.shortcutsEnabled}
          onChange={set('shortcutsEnabled')}
        />
        {s.shortcutsEnabled && (
          <>
            <Disclosure place="shortcutActions" title="Actions">
              <ShortcutEditor which="actions" />
            </Disclosure>
            <Disclosure place="shortcutPhases" title="Phase questions">
              <p className="note">Asks your opponent in chat, then moves to that phase.</p>
              <ShortcutEditor which="phases" />
            </Disclosure>
            <Disclosure place="shortcutChat" title="Chat messages">
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
      <Group place="mutedPlayers">
        <p className="note">{placeById.mutedPlayers.desc}</p>
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
      <Group place="mentions">
        <ToggleRow
          place="chatHighlightMentions"
          checked={s.chatHighlightMentions}
          onChange={set('chatHighlightMentions')}
        />
        <ToggleRow
          place="chatMentionAlert"
          checked={s.chatMentionAlert}
          onChange={set('chatMentionAlert')}
        />
      </Group>
      <Group place="commands">
        <ToggleRow
          place="chatCommandsEnabled"
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

// Scrolls el to the middle of its scroll box without moving the page.
const centerIn = (box, el, smooth) => {
  if (!box) return;
  const r = el.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  const top = box.scrollTop + r.top - b.top - Math.max(8, (b.height - r.height) / 2);
  box.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' });
};

// After a search jump: find the setting (or the nearest parent on screen),
// open what hides it, scroll to it, focus it and pulse it.
const reveal = (root, jump) => {
  const chain = placeChain(jump.place);
  let el = jump.selector ? root.querySelector(jump.selector) : null;
  let found = el ? jump.place : null;
  for (let i = 0; !el && i < chain.length; i += 1) {
    el = root.querySelector(`[data-place="${chain[i]}"]`);
    if (el) found = chain[i];
  }
  const target = placeById[jump.place];
  if (!el) return target.needs ? `“${target.label}” ${target.needs}.` : '';
  for (let d = el.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) d.open = true;
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const inner = el.closest('.gallery-scroll');
  if (inner) centerIn(inner, el, false);
  centerIn(root, el, smooth);
  const control = el.matches('button, input, summary') ? el : el.querySelector('[role="switch"], input, summary, button');
  if (control) control.focus({ preventScroll: true });
  el.classList.remove('place-flash');
  // Restart the animation when the same place is opened twice in a row.
  void el.offsetWidth;
  el.classList.add('place-flash');
  setTimeout(() => el.classList.remove('place-flash'), 1700);
  if (found === jump.place) return '';
  return `“${target.label}” ${target.needs || `is inside “${placeById[found].label}”`}.`;
};

const Panel = ({ onClose, logoUrl }) => {
  const { panelTab } = useSettings();
  const tab = TABS.some((t) => t.id === panelTab) ? panelTab : 'look';
  const bodyRef = useRef(null);
  const searchRef = useRef(null);
  const [meta, setMeta] = useLocal('meta', {});
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [jump, setJump] = useState(null);
  const [hint, setHint] = useState('');
  const results = useMemo(() => searchAll(query), [query]);
  const searching = query.trim().length > 0;

  const onQuery = (q, refocus) => {
    setQuery(q);
    setActive(0);
    setHint('');
    if (refocus && searchRef.current) searchRef.current.focus();
  };

  const open = (r) => {
    if (!r) return;
    if (r.kind === 'theme') {
      setNav({ themeView: 'style', galleryFilter: 'all', galleryQuery: r.theme.name });
      updateSettings({ panelTab: 'look' });
      setJump({ place: 'themeGallery', selector: `.preset-chip[data-theme-id="${r.theme.id}"]`, at: Date.now() });
    } else {
      if (r.place.view) setNav({ themeView: r.place.view });
      updateSettings({ panelTab: r.place.tab });
      setJump({ place: r.place.id, at: Date.now() });
    }
    setQuery('');
    setActive(0);
  };

  useEffect(() => {
    if (!jump || !bodyRef.current) return undefined;
    const frame = requestAnimationFrame(() => setHint(reveal(bodyRef.current, jump)));
    return () => cancelAnimationFrame(frame);
  }, [jump]);

  // "/" jumps to search from anywhere in the panel, as in most apps.
  const onPanelKey = (e) => {
    if (e.key !== '/' || e.ctrlKey || e.altKey || e.metaKey || isTypingEvent(e)) return;
    e.preventDefault();
    if (searchRef.current) searchRef.current.focus();
  };

  useEffect(() => {
    setMeta((m) => ({ ...(m || {}), panelOpens: ((m && m.panelOpens) || 0) + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [tab]);

  // Results start at the top; clearing the search returns to where you were.
  const savedScroll = useRef(0);
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    if (searching) {
      savedScroll.current = body.scrollTop;
      body.scrollTop = 0;
    } else {
      body.scrollTop = savedScroll.current;
    }
  }, [searching]);

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
    setQuery('');
    setHint('');
    const btn = e.currentTarget.querySelector(`[data-tab="${next.id}"]`);
    if (btn) btn.focus();
  };

  return (
    <div className="panel" role="dialog" aria-label="DuelingBook Theme Editor" onKeyDown={onPanelKey}>
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
      <SearchField
        ref={searchRef}
        query={query}
        onQuery={onQuery}
        results={results}
        active={active}
        onActive={setActive}
        onOpen={open}
      />
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
            onClick={() => {
              updateSettings({ panelTab: id });
              setQuery('');
              setHint('');
            }}
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
        {searching && (
          <SearchResults query={query} results={results} active={active} onActive={setActive} onOpen={open} onQuery={onQuery} />
        )}
        <div role="status" className={hint ? 'note jump-hint' : 'sr-only'}>
          {hint && (
            <>
              <span>{hint}</span>
              <button type="button" className="link-btn" onClick={() => setHint('')}>
                OK
              </button>
            </>
          )}
        </div>
        {/* Hidden, not unmounted, while searching: tabs keep their state (loaded deck, Undo, typed text). */}
        <div hidden={searching}>
          <WhatsNew meta={meta} setMeta={setMeta} />
          {tab !== 'more' && <SupportNudge meta={meta} setMeta={setMeta} />}
          {tab === 'look' && <ThemeTab />}
          {tab === 'duel' && <DuelTab />}
          {tab === 'chat' && <ChatTab />}
          {tab === 'deck' && <DeckTools />}
          {tab === 'more' && <SupportTab />}
        </div>
      </div>
    </div>
  );
};

export default Panel;
