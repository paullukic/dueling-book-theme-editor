import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '../lib/settings';
import { useLocal } from '../lib/localStore';
import { isTypingEvent } from '../lib/dom';
import { LAUNCHER_MARGIN, launcherBottom } from '../lib/layout';
import Panel from './Panel';
import {
  BackgroundEffect,
  CardTextSizeEffect,
  DarkModeEffect,
  MenuColorsEffect,
  PsctEffect,
  ReadingTextEffect,
  DuelChatEffect,
  SmallerMenuEffect,
} from '../features/look';
import { AlertsEffect, AnimationSpeedEffect, ShortcutsEffect, SkipIntroEffect } from '../features/duel';
import { ChatEffect } from '../features/chat';
import ThemeEffect from '../features/theme/ThemeEffect';
import LifePointsEffect from '../features/lp/LifePointsEffect';
import { panelVars } from '../features/theme/css';
import ReconnectNotice from '../features/reconnect';
import ChatCommandsEffect from '../features/chatCommands';
import { NotesWindow, TrackerWindow } from '../features/windows';

const logoUrl = (() => {
  try {
    return chrome.runtime.getURL('icon48.png');
  } catch (e) {
    return '';
  }
})();

const AVOID_IDS = ['mute_btn', 'screenshot_btn', 'twitter_btn', 'facebook_btn', 'discord_btn'];

// Lifts the corner button above DuelingBook's own corner buttons when the
// game stage reaches the window corner (narrow or short windows).
const useLauncherBottom = (active) => {
  const [bottom, setBottom] = useState(LAUNCHER_MARGIN);
  useEffect(() => {
    if (!active) return undefined;
    const check = () => {
      const rects = AVOID_IDS.map((id) => document.getElementById(id))
        .filter((el) => el && el.offsetParent)
        .map((el) => el.getBoundingClientRect());
      setBottom(launcherBottom({ width: window.innerWidth, height: window.innerHeight }, rects));
    };
    check();
    const timer = setInterval(check, 1500);
    window.addEventListener('resize', check);
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', check);
    };
  }, [active]);
  return bottom;
};

const App = ({ shadowRoot }) => {
  const { showLauncher, themeEnabled, themeTokens } = useSettings();
  const tokenKey = JSON.stringify(themeTokens);
  // The panel wears the active theme too; DuelingBook's own look keeps the panel's default colours.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const panelStyle = useMemo(() => (themeEnabled ? panelVars(themeTokens) : null), [themeEnabled, tokenKey]);
  const [open, setOpen] = useState(false);
  const [meta, setMeta, metaLoaded] = useLocal('meta', {});
  const launcherRef = useRef(null);
  const welcomed = useRef(false);
  const returnFocus = useRef(false);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => {
    // Only hand focus back if it was inside the panel.
    returnFocus.current = !!shadowRoot.activeElement;
    setOpen(false);
  }, [shadowRoot]);

  useEffect(() => {
    const onMessage = (msg) => {
      if (msg && msg.action === 'toggleThemeEditor') toggle();
    };
    chrome.runtime.onMessage.addListener(onMessage);
    return () => chrome.runtime.onMessage.removeListener(onMessage);
  }, [toggle]);

  // First install: show the panel once so people find it, then never again.
  useEffect(() => {
    if (!metaLoaded || welcomed.current) return;
    welcomed.current = true;
    if (meta && meta.welcome) {
      setOpen(true);
      setMeta((m) => ({ ...m, welcome: false }));
    }
  }, [metaLoaded, meta, setMeta]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      const fromUs = e.composedPath().includes(shadowRoot.host);
      if (!fromUs && isTypingEvent(e)) return;
      // Esc in a search field with text clears it; the field handles that.
      const field = e.composedPath()[0];
      if (fromUs && field && field.hasAttribute && field.hasAttribute('data-clear-on-escape') && field.value) return;
      // Esc on an open (?) closes the tip first.
      if (fromUs && field && field.hasAttribute && field.hasAttribute('data-tip') && field.getAttribute('aria-expanded') === 'true') return;
      close();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, close, shadowRoot]);

  // Opening moves focus into the panel unless the user is typing elsewhere on
  // the page; closing returns it to the corner button.
  useEffect(() => {
    if (open) {
      const active = document.activeElement;
      const typingOnPage = active && active !== shadowRoot.host && active !== document.body && isTypingEvent({ target: active });
      if (typingOnPage) return;
      const tab = shadowRoot.querySelector('.tab[aria-selected="true"]');
      if (tab) tab.focus({ preventScroll: true });
    } else if (returnFocus.current) {
      returnFocus.current = false;
      if (launcherRef.current) launcherRef.current.focus({ preventScroll: true });
    }
  }, [open, shadowRoot]);

  const launcherBottomPx = useLauncherBottom(!open && showLauncher);
  const hasNews = metaLoaded && meta && meta.seenVersion !== chrome.runtime.getManifest().version;

  return (
    <div className="dbte" style={panelStyle || undefined}>
      <ThemeEffect />
      <LifePointsEffect />
      <DarkModeEffect />
      <PsctEffect />
      <CardTextSizeEffect />
      <ReadingTextEffect />
      <DuelChatEffect />
      <SmallerMenuEffect />
      <MenuColorsEffect />
      <BackgroundEffect />
      <SkipIntroEffect />
      <AnimationSpeedEffect />
      <ShortcutsEffect />
      <AlertsEffect />
      <ChatEffect />
      <ChatCommandsEffect />

      <ReconnectNotice />
      <NotesWindow />
      <TrackerWindow />

      {open && <Panel onClose={close} logoUrl={logoUrl} />}
      {!open && showLauncher && (
        <button
          ref={launcherRef}
          type="button"
          className="launcher"
          style={{ bottom: launcherBottomPx }}
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
