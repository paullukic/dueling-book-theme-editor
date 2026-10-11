import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '../../lib/settings';
import { useLocal } from '../../lib/localStore';
import { useStyle } from '../look';
import { AREA_CSS, backdropCss, fontCss, varsCss } from './css';
import { ICON_STYLES, fieldCss, iconCss } from './art';
import { LAYER_ID, skinCss } from './skins';
import { clearInk, inkCss, inkPass } from './inkGuard';

const AREA_IDS = Object.keys(AREA_CSS);
const CUSTOM_ID = 'dbte-theme-custom';
const ART_DELAY_MS = 150;
const FIELD_RETRY_MS = [5000, 15000, 45000];
const INK_DELAY_MS = 600; // after DuelingBook stops changing the page

// One <style> per area so each can be switched off on its own. Area sheets
// are static; colour edits rewrite the variables block in place, and the
// generated icons and playmat follow once the picker settles.
const AreaStyle = ({ id, on }) => {
  useStyle(`dbte-theme-${id}`, on ? AREA_CSS[id] : null);
  return null;
};

// The same tokens object while its values stay the same, so unrelated
// setting changes do not rebuild the generated artwork.
const useStableTokens = (tokens) => {
  const key = JSON.stringify(tokens);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => tokens, [key]);
};

const useSettled = (value, delay) => {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return settled;
};

// Keeps the user's own CSS after every other stylesheet in <head>, whichever
// effect (or DuelingBook itself) adds one later.
const useCustomLast = (active) => {
  useEffect(() => {
    if (!active) return undefined;
    const head = document.head;
    const keepLast = () => {
      const el = document.getElementById(CUSTOM_ID);
      if (!el) return;
      let next = el.nextElementSibling;
      while (next && !(next.tagName === 'STYLE' || (next.tagName === 'LINK' && /stylesheet/i.test(next.rel)))) {
        next = next.nextElementSibling;
      }
      if (next) head.appendChild(el);
    };
    keepLast();
    const obs = new MutationObserver(keepLast);
    obs.observe(head, { childList: true });
    return () => obs.disconnect();
  }, [active]);
};

const ThemeEffect = () => {
  const s = useSettings();
  const [customCss] = useLocal('customCss', '');
  const on = s.themeEnabled;
  const areas = s.themeAreas;
  const tokens = useStableTokens(s.themeTokens);
  const artTokens = useSettled(tokens, ART_DELAY_MS);
  const artRadius = useSettled(s.themeRadius, ART_DELAY_MS);

  const vars = useMemo(
    () => (on ? varsCss({ tokens, radius: s.themeRadius, backdrop: s.themeBackdrop }) + backdropCss : null),
    [on, tokens, s.themeRadius, s.themeBackdrop],
  );
  useStyle('dbte-theme-vars', vars);
  useStyle('dbte-theme-font', on ? fontCss(s.themeFont) : null);

  const iconStyle = (s.themeEffects && ICON_STYLES[s.themePreset]) || 'tile';
  const icons = useMemo(
    () => (on && areas.icons ? iconCss(artTokens, artRadius, iconStyle) : null),
    [on, areas.icons, artTokens, artRadius, iconStyle],
  );
  useStyle('dbte-theme-icons', icons);

  // Signature skin: CSS plus a fixed layer behind the game for its backdrop.
  const skin = useMemo(
    () =>
      on && s.themeEffects
        ? skinCss(s.themePreset, artTokens, { menu: areas.menu, dialogs: areas.dialogs, field: areas.field }) || null
        : null,
    [on, s.themeEffects, s.themePreset, artTokens, areas.menu, areas.dialogs, areas.field],
  );
  useStyle('dbte-theme-skin', skin);
  const hasSkin = !!skin;
  useEffect(() => {
    if (!hasSkin) return undefined;
    const el = document.createElement('div');
    el.id = LAYER_ID;
    el.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(el, document.body.firstChild);
    return () => el.remove();
  }, [hasSkin]);

  const [field, setField] = useState(null);
  const [fieldRetry, setFieldRetry] = useState(0);
  const fieldOn = on && areas.field;
  useEffect(() => {
    if (!fieldOn) {
      setField(null);
      setFieldRetry(0);
      return undefined;
    }
    let live = true;
    let timer = null;
    fieldCss(artTokens).then(({ css, missing }) => {
      if (!live) return;
      setField(css || null);
      // A playmat file failed to download: fetch it again a few times.
      // Once everything has loaded, the next failure gets a fresh budget.
      if (!missing && fieldRetry) setFieldRetry(0);
      else if (missing && fieldRetry < FIELD_RETRY_MS.length) {
        timer = setTimeout(() => setFieldRetry((n) => n + 1), FIELD_RETRY_MS[fieldRetry]);
      }
    });
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [fieldOn, artTokens, fieldRetry]);
  useStyle('dbte-theme-field', fieldOn ? field : null);

  // Re-inks DuelingBook text that the theme left unreadable; runs after the
  // page settles and again whenever DuelingBook adds or changes text.
  const textColor = tokens.text;
  useStyle('dbte-theme-ink', on ? inkCss : null);
  useEffect(() => {
    if (!on) return undefined;
    const root = document.getElementById('content') || document.body;
    let timer = null;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => inkPass(root, textColor), INK_DELAY_MS);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    schedule();
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      clearInk(root);
    };
  }, [on, textColor, tokens, areas]);

  const custom = s.customCssEnabled && customCss ? customCss : null;
  useStyle(CUSTOM_ID, custom);
  useCustomLast(!!custom);

  return AREA_IDS.map((id) => <AreaStyle key={id} id={id} on={on && areas[id]} />);
};

export default ThemeEffect;
