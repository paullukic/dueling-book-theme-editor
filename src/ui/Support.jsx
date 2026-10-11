import { useEffect, useRef, useState } from 'react';
import { getSettings, replaceSettings, resetSettings, updateSettings, useSettings } from '../lib/settings';
import { Group, ToggleRow } from './controls';
import { HeartIcon, PlayIcon, ShareIcon, StarIcon } from './icons';

const DONATE_URL = 'https://www.buymeacoffee.com/sudbina';
const STORE_URL = 'https://chromewebstore.google.com/detail/fpehmkbiafgdeaheeehcbpgahmlkolac';
const REVIEW_URL = `${STORE_URL}/reviews`;
const YOUTUBE_URL = 'https://www.youtube.com/@PsyYGO';

const DAY = 24 * 60 * 60 * 1000;
const NUDGE_AFTER_DAYS = 7;
const NUDGE_AFTER_OPENS = 4;
const SNOOZE_DAYS = 45;

const version = () => chrome.runtime.getManifest().version;

// Shown once after an update, until dismissed.
const NEWS = [
  'Full theme: a sleek look for every DuelingBook screen, with 18 presets (Spell, Trap, Xyz, Link, Branded, Artmage…) and your own colours',
  'Share your theme as a code, or add your own CSS',
  'Reconnect automatically when DuelingBook drops you, and chat commands like /calc and /gl',
  'Turn and duel-found alerts, so you can wait in another tab',
  'Test hands and opening odds for the deck you are building',
  'Mute players in chat and get pinged when someone says your name',
];

const askAllowed = (meta) =>
  !!meta && !meta.supportNever && !!meta.installedAt && Date.now() - meta.installedAt >= NUDGE_AFTER_DAYS * DAY;

export const WhatsNew = ({ meta, setMeta }) => {
  if (!meta || meta.seenVersion === version()) return null;
  const fresh = !meta.updatedFrom;
  const dismiss = (e) => {
    const tab = e.currentTarget.getRootNode().querySelector('.tab[aria-selected="true"]');
    setMeta((m) => ({ ...m, seenVersion: version(), welcome: false }));
    if (tab) tab.focus();
  };
  return (
    <div className="card-callout gold">
      <h3>{fresh ? 'Welcome to Theme Editor' : `What’s new in ${version()}`}</h3>
      {fresh ? (
        <p>
          Everything starts switched off. Try the Full theme below, or set up alerts in the Duel tab.
          <br />
          Open this panel any time from the corner button or with{' '}
          <span className="nowrap">
            <kbd className="kbd">Alt</kbd>+<kbd className="kbd">Shift</kbd>+<kbd className="kbd">D</kbd>
          </span>
          .
        </p>
      ) : (
        <ul>
          {NEWS.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      <div className="btn-row">
        <button type="button" className="btn" onClick={dismiss}>
          Got it
        </button>
        {!fresh && askAllowed(meta) && (
          <a className="btn btn-quiet" href={DONATE_URL} target="_blank" rel="noopener noreferrer">
            Support this update
          </a>
        )}
      </div>
    </div>
  );
};

// A gentle ask: only after a week of use and a few panel visits, at most once
// every 45 days, and never again once declined.
export const SupportNudge = ({ meta, setMeta }) => {
  if (!meta || !meta.installedAt || meta.supportNever) return null;
  if (meta.seenVersion !== version()) return null; // one card at a time
  const now = Date.now();
  if (now - meta.installedAt < NUDGE_AFTER_DAYS * DAY) return null;
  if ((meta.panelOpens || 0) < NUDGE_AFTER_OPENS) return null;
  if (meta.supportSnoozeUntil && now < meta.supportSnoozeUntil) return null;
  const snooze = () => setMeta((m) => ({ ...m, supportSnoozeUntil: Date.now() + SNOOZE_DAYS * DAY }));
  const never = () => setMeta((m) => ({ ...m, supportNever: true }));
  return (
    <div className="card-callout">
      <h3>Enjoying Theme Editor?</h3>
      <p>It is free and made by one player in their spare time. A review or a coffee keeps new features coming.</p>
      <div className="btn-row">
        <a className="btn btn-gold" href={DONATE_URL} target="_blank" rel="noopener noreferrer" onClick={snooze}>
          Buy me a coffee
        </a>
        <a className="btn" href={REVIEW_URL} target="_blank" rel="noopener noreferrer" onClick={snooze}>
          Leave a review
        </a>
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-quiet" onClick={snooze}>
          Maybe later
        </button>
        <button type="button" className="btn btn-quiet" onClick={never}>
          Don’t ask again
        </button>
      </div>
    </div>
  );
};

const download = (name, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const SettingsTransfer = () => {
  const fileRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const keepRef = useRef(null);
  const resetRef = useRef(null);
  const wasConfirming = useRef(false);

  useEffect(() => {
    if (confirmReset) {
      wasConfirming.current = true;
      if (keepRef.current) keepRef.current.focus();
    } else if (wasConfirming.current) {
      wasConfirming.current = false;
      if (resetRef.current) resetRef.current.focus();
    }
  }, [confirmReset]);

  const importFile = async (file) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const settings = parsed && parsed.app === 'dbte' ? parsed.settings : null;
      if (!settings || typeof settings !== 'object') throw new Error('shape');
      replaceSettings(settings);
      setStatus({ ok: true, text: 'Settings imported.' });
    } catch (e) {
      setStatus({ ok: false, text: 'That file is not a Theme Editor settings file.' });
    }
  };

  const { showLauncher } = useSettings();
  return (
    <Group title="Your settings">
      <ToggleRow
        label="Corner button"
        description="The round button in the bottom-right corner that opens this panel. The toolbar icon always works."
        checked={showLauncher}
        onChange={(v) => updateSettings({ showLauncher: v })}
      />
      <p className="note">Move your setup to another browser or share a theme with a friend.</p>
      <div className="btn-row">
        <button
          type="button"
          className="btn"
          onClick={() => {
            download(
              'duelingbook-theme-editor-settings.json',
              JSON.stringify({ app: 'dbte', version: version(), settings: getSettings() }, null, 2),
            );
            setStatus({ ok: true, text: 'Settings exported.' });
          }}
        >
          Export settings
        </button>
        <button type="button" className="btn" onClick={() => fileRef.current && fileRef.current.click()}>
          Import settings
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            importFile(e.target.files[0]);
            e.target.value = '';
          }}
        />
      </div>
      <div className="btn-row">
        {confirmReset ? (
          <>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                resetSettings();
                setConfirmReset(false);
                setStatus({ ok: true, text: 'Everything is back to default.' });
              }}
            >
              Yes, reset everything
            </button>
            <button ref={keepRef} type="button" className="btn btn-quiet" onClick={() => setConfirmReset(false)}>
              Keep my settings
            </button>
          </>
        ) : (
          <button
            ref={resetRef}
            type="button"
            className="btn btn-quiet btn-danger"
            onClick={() => setConfirmReset(true)}
          >
            Reset all settings
          </button>
        )}
      </div>
      {status && (
        <p className={status.ok ? 'note note-ok' : 'note note-error'} role="status">
          {status.text}
        </p>
      )}
    </Group>
  );
};

export const SupportTab = () => {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    try {
      await navigator.clipboard.writeText(STORE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      window.open(STORE_URL, '_blank', 'noopener');
    }
  };
  return (
    <>
      <div className="card-callout gold">
        <h3>Keep Theme Editor free</h3>
        <p>No ads, no tracking, no paid features. If it makes your duels nicer, a coffee pays for the next update.</p>
        <a className="btn btn-gold" href={DONATE_URL} target="_blank" rel="noopener noreferrer">
          <HeartIcon />
          Buy me a coffee
        </a>
      </div>
      <Group title="Other ways to help">
        <div className="link-list">
          <a className="btn" href={REVIEW_URL} target="_blank" rel="noopener noreferrer">
            <StarIcon />
            Rate it on the Chrome Web Store
          </a>
          <button type="button" className="btn" onClick={share}>
            <ShareIcon />
            {copied ? 'Link copied. Paste it in your Discord' : 'Copy a link for your friends'}
          </button>
          <span className="sr-only" role="status">
            {copied ? 'Link copied to the clipboard.' : ''}
          </span>
          <a className="btn" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
            <PlayIcon />
            Watch PsyYGO on YouTube
          </a>
        </div>
      </Group>
      <SettingsTransfer />
      <Group title="Privacy">
        <p className="note">Your settings stay in your browser. Nothing is collected or sent anywhere.</p>
      </Group>
    </>
  );
};
