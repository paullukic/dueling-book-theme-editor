import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../lib/settings';
import { useLocal } from '../lib/localStore';
import { isTypingEvent } from '../lib/dom';
import Panel from './Panel';
import {
  BackgroundEffect,
  CardTextSizeEffect,
  DarkModeEffect,
  MenuColorsEffect,
  PsctEffect,
  SmallerMenuEffect,
} from '../features/look';
import { AlertsEffect, AnimationSpeedEffect, ShortcutsEffect, SkipIntroEffect } from '../features/duel';
import { ChatEffect } from '../features/chat';
import { NotesWindow, TrackerWindow } from '../features/windows';

const logoUrl = (() => {
  try {
    return chrome.runtime.getURL('icon48.png');
  } catch (e) {
    return '';
  }
})();

const App = ({ shadowRoot }) => {
  const { showLauncher } = useSettings();
  const [open, setOpen] = useState(false);
  const [meta, , metaLoaded] = useLocal('meta', {});
  const launcherRef = useRef(null);
  const welcomed = useRef(false);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => {
    setOpen(false);
    if (launcherRef.current) launcherRef.current.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onMessage = (msg) => {
      if (msg && msg.action === 'toggleThemeEditor') toggle();
    };
    chrome.runtime.onMessage.addListener(onMessage);
    return () => chrome.runtime.onMessage.removeListener(onMessage);
  }, [toggle]);

  // First install: show the panel once so people find it.
  useEffect(() => {
    if (!metaLoaded || welcomed.current) return;
    welcomed.current = true;
    if (meta && meta.welcome) setOpen(true);
  }, [metaLoaded, meta]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      const fromUs = e.composedPath().includes(shadowRoot.host);
      if (!fromUs && isTypingEvent(e)) return;
      close();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, close, shadowRoot]);

  useEffect(() => {
    if (!open) return;
    const first = shadowRoot.querySelector('.tab[aria-selected="true"]');
    if (first && document.activeElement !== shadowRoot.host) first.focus({ preventScroll: true });
  }, [open, shadowRoot]);

  const hasNews = metaLoaded && meta && meta.seenVersion !== chrome.runtime.getManifest().version;

  return (
    <div className="dbte">
      <DarkModeEffect />
      <PsctEffect />
      <CardTextSizeEffect />
      <SmallerMenuEffect />
      <MenuColorsEffect />
      <BackgroundEffect />
      <SkipIntroEffect />
      <AnimationSpeedEffect />
      <ShortcutsEffect />
      <AlertsEffect />
      <ChatEffect />

      <NotesWindow />
      <TrackerWindow />

      {open && <Panel onClose={close} logoUrl={logoUrl} />}
      {!open && showLauncher && (
        <button
          ref={launcherRef}
          type="button"
          className="launcher"
          onClick={() => setOpen(true)}
          aria-label="Open DuelingBook Theme Editor"
          title="Theme Editor (Alt+Shift+D)"
        >
          {logoUrl && <img src={logoUrl} alt="" />}
          {hasNews && <span className="launcher-dot" aria-hidden="true" />}
        </button>
      )}
    </div>
  );
};

export default App;
