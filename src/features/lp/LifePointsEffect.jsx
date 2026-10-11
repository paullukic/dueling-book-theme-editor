import { useEffect, useMemo } from 'react';
import { useSettings } from '../../lib/settings';
import { whenElement } from '../../lib/dom';
import { useStyle } from '../look';
import { lpCss } from './index';
import { effectsCss } from './effects';
import { watchSide } from './watch';

const LifePointsEffect = () => {
  const { lpStyle, lpEffects } = useSettings();
  const css = useMemo(() => lpCss(lpStyle) || null, [lpStyle]);
  useStyle('dbte-lp-style', css);
  useStyle('dbte-lp-effects', lpEffects ? effectsCss : null);

  const active = lpStyle !== 'theme' || lpEffects;
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
