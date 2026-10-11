import { useEffect, useMemo } from 'react';
import { useSettings } from '../../lib/settings';
import { whenElement } from '../../lib/dom';
import { useStyle } from '../look';
import { lpCss } from './index';
import { effectsCss } from './effects';
import { watchSide } from './watch';
import { STYLE_ATTR } from './kit';

const LifePointsEffect = () => {
  const { lpStyle, lpEffects, themeEnabled } = useSettings();
  const css = useMemo(() => lpCss(lpStyle) || null, [lpStyle]);
  useStyle('dbte-lp-style', css);
  useStyle('dbte-lp-effects', lpEffects ? effectsCss : null);

  const styled = lpStyle !== 'theme';
  useEffect(() => {
    if (!styled) return undefined;
    document.documentElement.setAttribute(STYLE_ATTR, '');
    return () => document.documentElement.removeAttribute(STYLE_ATTR);
  }, [styled]);

  // The theme's look also follows life: its low and zero states.
  const active = styled || lpEffects || themeEnabled;
  useEffect(() => {
    if (!active) return undefined;
    const stops = [];
    const cancels = ['#lifepoints1', '#lifepoints2'].map((id) =>
      whenElement(id, (box) => stops.push(watchSide(box, lpEffects))),
    );
    return () => {
      cancels.forEach((c) => c());
      stops.forEach((s) => s());
    };
  }, [active, lpEffects]);
  return null;
};

export default LifePointsEffect;
