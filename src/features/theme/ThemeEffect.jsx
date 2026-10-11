import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '../../lib/settings';
import { useLocal } from '../../lib/localStore';
import { useStyle } from '../look';
import { AREA_CSS, backdropCss, fontCss, varsCss } from './css';
import { ICON_STYLES, fieldCss, iconCss } from './art';
import { LAYER_ID, MOTIF_ID, skinCss } from './skins';
import { FX_ID, PARTICLES, SHADERS, sceneMarkup } from './scenes';
import { chromeCss } from './chrome';
import { startFx } from './particles';
import { clearInk, inkCss, inkPass } from './inkGuard';

const AREA_IDS = Object.keys(AREA_CSS);
const CUSTOM_ID = 'dbte-theme-custom';
const ART_DELAY_MS = 150;
const FIELD_RETRY_MS = [5000, 15000, 45000];
const INK_DELAY_MS = 600; // after DuelingBook stops changing the page
const INK_FULL_PASS = 200; // more changed spots than this: check the whole page

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
  const [bgImage] = useLocal('background', '');
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
        ? skinCss(s.themePreset, artTokens, { menu: areas.menu, dialogs: areas.dialogs, field: areas.field }, { motif: s.themeMotif }) || null
        : null,
    [on, s.themeEffects, s.themeMotif, s.themePreset, artTokens, areas.menu, areas.dialogs, areas.field],
  );
  useStyle('dbte-theme-skin', skin);

  // The theme's own UI chrome (buttons, tiles, pop-ups, panels in its style).
  const chrome = useMemo(
    () => (on && s.themeEffects ? chromeCss(s.themePreset, artTokens, areas) || null : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [on, s.themeEffects, s.themePreset, artTokens, JSON.stringify(areas)],
  );
  useStyle('dbte-theme-chrome', chrome);
  const hasSkin = !!skin;
  useEffect(() => {
    if (!hasSkin) return undefined;
    // Glow first, artwork over it, the animated scene on top; all behind the game.
    const els = [FX_ID, MOTIF_ID, LAYER_ID].map((id) => {
      const el = document.createElement('div');
      el.id = id;
      el.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(el, document.body.firstChild);
      return el;
    });
    return () => els.forEach((el) => el.remove());
  }, [hasSkin]);

  // The theme's scene: a 3D stage of SVG planes and a particle canvas,
  // tilted toward the pointer.
  const scene = useMemo(
    () =>
      // Hidden under the user's own picture (pattern overlay off): don't run it at all.
      // Motion off removes the animated scene entirely (art, particles, shader);
      // colours, playmat, icons, glows and the static pattern stay.
      on && s.themeEffects && s.themeMotif && s.themeMotion && !(s.backgroundEnabled && (bgImage || s.backgroundMode === 'color') && !s.backgroundThemeOverlay)
        ? sceneMarkup(s.themePreset, artTokens, {
            still: !s.themeMotion,
            particles: !!PARTICLES[s.themePreset],
            shader: !!SHADERS[s.themePreset] && s.themeQuality !== 'off',
          })
        : '',
    [on, s.themeEffects, s.themeMotif, s.themeMotion, s.themeQuality, s.themePreset, artTokens, s.backgroundEnabled, bgImage, s.backgroundMode, s.backgroundThemeOverlay],
  );
  useEffect(() => {
    const el = document.getElementById(FX_ID);
    if (!el) return undefined;
    el.innerHTML = scene;
    if (!scene) return undefined;
    const stop = startFx(el, PARTICLES[s.themePreset], artTokens, {
      still: !s.themeMotion,
      shader: SHADERS[s.themePreset],
      quality: s.themeQuality,
    });
    return () => {
      stop();
      el.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, hasSkin]);

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
    // After the first full pass only what DuelingBook changed is checked, so
    // a long chat log is not rescanned for every new line.
    let pending = [root];
    let timer = null;
    const flush = () => {
      const roots = pending.length > INK_FULL_PASS ? [root] : pending;
      pending = [];
      inkPass(roots, textColor);
    };
    const observer = new MutationObserver((records) => {
      records.forEach((r) => {
        const target = r.type === 'characterData' ? r.target.parentElement : r.target;
        if (target) pending.push(target);
      });
      clearTimeout(timer);
      timer = setTimeout(flush, INK_DELAY_MS);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    timer = setTimeout(flush, INK_DELAY_MS);
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
