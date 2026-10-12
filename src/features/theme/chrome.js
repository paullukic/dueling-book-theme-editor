// Theme UI chrome: each archetype/duel theme restyles DuelingBook's own UI
// (menu tiles, buttons, pop-ups, chat windows, life points, phases, panels,
// fields) in its own visual language, on top of the colour sheets in css.js.
// One module per theme in ./chrome/; default export (tokens, kit) -> CSS.

import { isHex } from '../../lib/color.js';
import * as kit from './chrome/kit.js';
import { keepAreas } from './skins.js';
import spell from './chrome/spell.js';
import oled from './chrome/oled.js';
import midnight from './chrome/midnight.js';
import parchment from './chrome/parchment.js';
import graphite from './chrome/graphite.js';
import snow from './chrome/snow.js';
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
import constellar from './chrome/constellar.js';
import fireKing from './chrome/fire-king.js';
import mermail from './chrome/mermail.js';
import starlight from './chrome/starlight.js';
import starlightLight from './chrome/starlight-light.js';
import dracotail from './chrome/dracotail.js';
import powerPatron from './chrome/power-patron.js';
import ryzeal from './chrome/ryzeal.js';
import shaddoll from './chrome/shaddoll.js';
import madolche from './chrome/madolche.js';
import nekroz from './chrome/nekroz.js';
import stardust from './chrome/stardust.js';
import utopia from './chrome/utopia.js';
import crystalBeast from './chrome/crystal-beast.js';
import ancientGear from './chrome/ancient-gear.js';
import destinyHero from './chrome/destiny-hero.js';
import blitzclique from './chrome/blitzclique.js';
import attackOnTitan from './chrome/attack-on-titan.js';
import demonSlayer from './chrome/demon-slayer.js';
import jujutsuKaisen from './chrome/jujutsu-kaisen.js';
import onePiece from './chrome/one-piece.js';
import naruto from './chrome/naruto.js';
import dragonBall from './chrome/dragon-ball.js';
import deathNote from './chrome/death-note.js';
import fullmetalAlchemist from './chrome/fullmetal-alchemist.js';
import soloLeveling from './chrome/solo-leveling.js';
import legacyOfTheDuelist from './chrome/legacy-of-the-duelist.js';
import duelLinks from './chrome/duel-links.js';
import masterDuel from './chrome/master-duel.js';
import duelMonstersGb from './chrome/duel-monsters-gb.js';
import powerOfChaos from './chrome/power-of-chaos.js';
import tagForce from './chrome/tag-force.js';
import worldChampionship from './chrome/world-championship.js';
import burningAbyss from './chrome/burning-abyss.js';
import yubel from './chrome/yubel.js';
import ddd from './chrome/ddd.js';
import forbiddenMemories from './chrome/forbidden-memories.js';
import duelistsOfTheRoses from './chrome/duelists-of-the-roses.js';
import eternalDuelistSoul from './chrome/eternal-duelist-soul.js';

const CHROME = {
  oled,
  midnight,
  parchment,
  graphite,
  snow,
  'burning-abyss': burningAbyss,
  yubel,
  ddd,
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
  constellar,
  'fire-king': fireKing,
  mermail,
  starlight,
  'starlight-light': starlightLight,
  dracotail,
  'power-patron': powerPatron,
  ryzeal,
  shaddoll,
  madolche,
  nekroz,
  stardust,
  utopia,
  'crystal-beast': crystalBeast,
  'ancient-gear': ancientGear,
  'destiny-hero': destinyHero,
  blitzclique,
  'attack-on-titan': attackOnTitan,
  'demon-slayer': demonSlayer,
  'jujutsu-kaisen': jujutsuKaisen,
  'one-piece': onePiece,
  naruto,
  'dragon-ball': dragonBall,
  'death-note': deathNote,
  'fullmetal-alchemist': fullmetalAlchemist,
  'solo-leveling': soloLeveling,
  'legacy-of-the-duelist': legacyOfTheDuelist,
  'duel-links': duelLinks,
  'master-duel': masterDuel,
  'duel-monsters-gb': duelMonstersGb,
  'power-of-chaos': powerOfChaos,
  'tag-force': tagForce,
  'world-championship': worldChampionship,
  'forbidden-memories': forbiddenMemories,
  'duelists-of-the-roses': duelistsOfTheRoses,
  'eternal-duelist-soul': eternalDuelistSoul,
};

export const CHROME_IDS = Object.keys(CHROME).filter((id) => CHROME[id]);

// The theme's chrome CSS for the switched-on areas, or '' when it has none.
export const chromeCss = (presetId, tokens, areas = {}) => {
  const make = CHROME[presetId];
  // Colours go straight into CSS and SVG: only well-formed hex values.
  if (!make || !Object.values(tokens || {}).every(isHex)) return '';
  return keepAreas(make(tokens, kit), areas).trim();
};
