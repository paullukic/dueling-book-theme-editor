// Theme UI chrome: each archetype/duel theme restyles DuelingBook's own UI
// (menu tiles, buttons, pop-ups, chat windows, life points, phases, panels,
// fields) in its own visual language, on top of the colour sheets in css.js.
// One module per theme in ./chrome/; default export (tokens, kit) -> CSS.

import { isHex } from '../../lib/color.js';
import * as kit from './chrome/kit.js';
import { keepAreas } from './skins.js';
import spell from './chrome/spell.js';
import trap from './chrome/trap.js';
import fusion from './chrome/fusion.js';
import synchro from './chrome/synchro.js';
import xyz from './chrome/xyz.js';
import link from './chrome/link.js';
import whiteDragon from './chrome/white-dragon.js';
import darkMagic from './chrome/dark-magic.js';
import blackDragon from './chrome/black-dragon.js';
import millennium from './chrome/millennium.js';
import branded from './chrome/branded.js';
import artmage from './chrome/artmage.js';
import pendulum from './chrome/pendulum.js';
import divine from './chrome/divine.js';
import hero from './chrome/hero.js';
import duelDisk from './chrome/duel-disk.js';
import ritual from './chrome/ritual.js';
import shadowRealm from './chrome/shadow-realm.js';
import skyStriker from './chrome/sky-striker.js';
import snakeEye from './chrome/snake-eye.js';
import labrynth from './chrome/labrynth.js';
import blackwing from './chrome/blackwing.js';
import lightsworn from './chrome/lightsworn.js';
import frog from './chrome/frog.js';
import angelechy from './chrome/angelechy.js';
import mitsurugi from './chrome/mitsurugi.js';
import gladiator from './chrome/gladiator.js';
import toon from './chrome/toon.js';
import kewlTune from './chrome/kewl-tune.js';
import cyberDragon from './chrome/cyber-dragon.js';

const CHROME = {
  spell,
  trap,
  fusion,
  synchro,
  xyz,
  link,
  'white-dragon': whiteDragon,
  'dark-magic': darkMagic,
  'black-dragon': blackDragon,
  millennium,
  branded,
  artmage,
  pendulum,
  divine,
  hero,
  'duel-disk': duelDisk,
  ritual,
  'shadow-realm': shadowRealm,
  'sky-striker': skyStriker,
  'snake-eye': snakeEye,
  labrynth,
  blackwing,
  lightsworn,
  frog,
  angelechy,
  mitsurugi,
  gladiator,
  toon,
  'kewl-tune': kewlTune,
  'cyber-dragon': cyberDragon,
};

export const CHROME_IDS = Object.keys(CHROME).filter((id) => CHROME[id]);

// The theme's chrome CSS for the switched-on areas, or '' when it has none.
export const chromeCss = (presetId, tokens, areas = {}) => {
  const make = CHROME[presetId];
  // Colours go straight into CSS and SVG: only well-formed hex values.
  if (!make || !Object.values(tokens || {}).every(isHex)) return '';
  return keepAreas(make(tokens, kit), areas).trim();
};
