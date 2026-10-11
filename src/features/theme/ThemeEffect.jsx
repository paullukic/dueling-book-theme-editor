import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '../../lib/settings';
import { useLocal } from '../../lib/localStore';
import { useStyle } from '../look';
import { AREA_CSS, backdropCss, fontCss, varsCss } from './css';
import { fieldCss, iconCss } from './art';

const AREA_IDS = Object.keys(AREA_CSS);
const CUSTOM_ID = 'dbte-theme-custom';

// One <style> per area so each can be switched off on its own. The variables
// block is the only node that changes while the user edits colours.
const AreaStyle = ({ id, on }) => {
  useStyle(`dbte-theme-${id}`, on ? AREA_CSS[id] : null);
  return null;
};

const ThemeEffect = () => {
  const s = useSettings();
  const [customCss] = useLocal('customCss', '');
  const on = s.themeEnabled;
  const areas = s.themeAreas;
  const tokens = s.themeTokens;

  const vars = useMemo(
    () => (on ? varsCss({ tokens, radius: s.themeRadius, backdrop: s.themeBackdrop }) + backdropCss : null),
    [on, tokens, s.themeRadius, s.themeBackdrop],
  );
  useStyle('dbte-theme-vars', vars);
  useStyle('dbte-theme-font', on && s.themeFont === 'system' ? fontCss : null);

  const icons = useMemo(() => (on && areas.icons ? iconCss(tokens, s.themeRadius) : null), [on, areas.icons, tokens, s.themeRadius]);
  useStyle('dbte-theme-icons', icons);

  const [field, setField] = useState(null);
  const fieldOn = on && areas.field;
  useEffect(() => {
    if (!fieldOn) {
      setField(null);
      return undefined;
    }
    let live = true;
    fieldCss(tokens).then((css) => {
      if (live) setField(css || null);
    });
    return () => {
      live = false;
    };
  }, [fieldOn, tokens]);
  useStyle('dbte-theme-field', fieldOn ? field : null);

  useStyle(CUSTOM_ID, s.customCssEnabled && customCss ? customCss : null);

  // The user's own CSS always comes last, whatever was switched on after it.
  useEffect(() => {
    const el = document.getElementById(CUSTOM_ID);
    if (el && el.nextElementSibling) el.parentNode.appendChild(el);
  });

  return AREA_IDS.map((id) => <AreaStyle key={id} id={id} on={on && areas[id]} />);
};

export default ThemeEffect;
