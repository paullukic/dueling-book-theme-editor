// Theme scenes: a full-screen illustration per theme, drawn as inline SVG in
// the theme's colours on three planes of a CSS 3D stage (#dbte-skin-fx):
// far (ambient: sky, silhouettes), middle (the centrepiece), near (foreground
// props). The particle canvas sits between middle and near, and the stage
// drifts very slowly on its own, so nearer planes move more (real parallax).
// Nothing follows the pointer.
// Animations move only transform and opacity. `still` stops every animation;
// so does the system's reduced-motion setting.

import { isHex } from '../../lib/color.js';
import { H, KEYFRAMES, W } from './scenes/kit.js';
import * as branded from './scenes/branded.js';
import * as artmage from './scenes/artmage.js';
import * as hero from './scenes/hero.js';
import * as skyStriker from './scenes/sky-striker.js';
import * as snakeEye from './scenes/snake-eye.js';
import * as labrynth from './scenes/labrynth.js';
import * as blackwing from './scenes/blackwing.js';
import * as lightsworn from './scenes/lightsworn.js';
import * as frog from './scenes/frog.js';
import * as angelechy from './scenes/angelechy.js';
import * as mitsurugi from './scenes/mitsurugi.js';
import * as gladiator from './scenes/gladiator.js';
import * as toon from './scenes/toon.js';
import * as kewlTune from './scenes/kewl-tune.js';
import * as cyberDragon from './scenes/cyber-dragon.js';
import * as sakura from './scenes/sakura.js';
import * as midnight from './scenes/midnight.js';
import * as snow from './scenes/snow.js';
import * as verdant from './scenes/verdant.js';
import * as parchment from './scenes/parchment.js';
import * as obsidian from './scenes/obsidian.js';
import * as crimson from './scenes/crimson.js';
import * as spell from './scenes/spell.js';
import * as trap from './scenes/trap.js';
import * as fusion from './scenes/fusion.js';
import * as synchro from './scenes/synchro.js';
import * as xyz from './scenes/xyz.js';
import * as link from './scenes/link.js';
import * as whiteDragon from './scenes/white-dragon.js';
import * as darkMagic from './scenes/dark-magic.js';
import * as blackDragon from './scenes/black-dragon.js';
import * as millennium from './scenes/millennium.js';
import * as pendulum from './scenes/pendulum.js';
import * as divine from './scenes/divine.js';
import * as duelDisk from './scenes/duel-disk.js';
import * as ritual from './scenes/ritual.js';
import * as shadowRealm from './scenes/shadow-realm.js';
import * as graphite from './scenes/graphite.js';
import * as starlight from './scenes/starlight.js';
import * as starlightLight from './scenes/starlight-light.js';
import * as constellar from './scenes/constellar.js';
import * as mermail from './scenes/mermail.js';
import * as fireKing from './scenes/fire-king.js';
import * as dracotail from './scenes/dracotail.js';
import * as powerPatron from './scenes/power-patron.js';
import * as ryzeal from './scenes/ryzeal.js';
import * as shaddoll from './scenes/shaddoll.js';
import * as madolche from './scenes/madolche.js';
import * as nekroz from './scenes/nekroz.js';
import * as stardust from './scenes/stardust.js';
import * as utopia from './scenes/utopia.js';
import * as crystalBeast from './scenes/crystal-beast.js';
import * as blitzclique from './scenes/blitzclique.js';
import * as ancientGear from './scenes/ancient-gear.js';
import * as destinyHero from './scenes/destiny-hero.js';
import * as attackOnTitan from './scenes/attack-on-titan.js';
import * as demonSlayer from './scenes/demon-slayer.js';
import * as jujutsuKaisen from './scenes/jujutsu-kaisen.js';
import * as onePiece from './scenes/one-piece.js';
import * as naruto from './scenes/naruto.js';
import * as dragonBall from './scenes/dragon-ball.js';
import * as deathNote from './scenes/death-note.js';
import * as fullmetalAlchemist from './scenes/fullmetal-alchemist.js';
import * as soloLeveling from './scenes/solo-leveling.js';
import * as legacyOfTheDuelist from './scenes/legacy-of-the-duelist.js';
import * as duelLinks from './scenes/duel-links.js';
import * as masterDuel from './scenes/master-duel.js';
import * as duelMonstersGb from './scenes/duel-monsters-gb.js';
import * as powerOfChaos from './scenes/power-of-chaos.js';
import * as tagForce from './scenes/tag-force.js';
import * as worldChampionship from './scenes/world-championship.js';
import * as burningAbyss from './scenes/burning-abyss.js';
import * as yubel from './scenes/yubel.js';
import * as ddd from './scenes/ddd.js';
import * as forbiddenMemories from './scenes/forbidden-memories.js';
import * as duelistsOfTheRoses from './scenes/duelists-of-the-roses.js';
import * as eternalDuelistSoul from './scenes/eternal-duelist-soul.js';

export const FX_ID = 'dbte-skin-fx';

// One module per theme in ./scenes/: the default export draws the scene from
// the tokens (or is null), `particles` configures its particle systems.
const MODULES = {
  'burning-abyss': burningAbyss,
  yubel,
  ddd,
  branded,
  artmage,
  hero,
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
  sakura,
  midnight,
  snow,
  verdant,
  parchment,
  obsidian,
  crimson,
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
  pendulum,
  divine,
  'duel-disk': duelDisk,
  ritual,
  'shadow-realm': shadowRealm,
  graphite,
  starlight,
  'starlight-light': starlightLight,
  constellar,
  mermail,
  'fire-king': fireKing,
  dracotail,
  'power-patron': powerPatron,
  ryzeal,
  shaddoll,
  madolche,
  nekroz,
  stardust,
  utopia,
  'crystal-beast': crystalBeast,
  blitzclique,
  'ancient-gear': ancientGear,
  'destiny-hero': destinyHero,
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

export const SCENE_IDS = Object.keys(MODULES).filter((id) => MODULES[id].default);
export const SHADERS = Object.fromEntries(
  Object.entries(MODULES)
    .filter(([, m]) => m.shader)
    .map(([id, m]) => [id, m.shader]),
);
export const PARTICLES = Object.fromEntries(
  Object.entries(MODULES)
    .filter(([, m]) => m.particles)
    .map(([id, m]) => [id, m.particles]),
);


const plane = (cls, body) =>
  `<svg class="${cls}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${body}</svg>`;

// The 3D stage for the fx layer: far, middle and near SVG planes with the
// particle canvas between middle and near; '' when the theme has neither a
// scene nor particles. Colours go straight into markup: only hex values.
export const sceneMarkup = (presetId, tokens, { still = false, particles = false, shader = false } = {}) => {
  const draw = MODULES[presetId] && MODULES[presetId].default;
  if ((!draw && !particles && !shader) || !Object.values(tokens || {}).every(isHex)) return '';
  // Text before <!--mid--> is the far plane, after <!--near--> the near one;
  // a scene without markers is all middle plane.
  const body = draw ? draw(tokens) : '';
  const planes = { far: '', mid: '', near: '' };
  let current = /<!--mid-->/.test(body) ? 'far' : 'mid';
  body.split(/(<!--mid-->|<!--near-->)/).forEach((chunk) => {
    if (chunk === '<!--mid-->') current = 'mid';
    else if (chunk === '<!--near-->') current = 'near';
    else planes[current] += chunk;
  });
  const parts = [planes.far.trim(), planes.mid.trim(), planes.near.trim()];
  return `<style>${KEYFRAMES}
#${FX_ID}.dbtefx-still *, #${FX_ID} .dbtefx-still * { animation: none !important; }
@media (prefers-reduced-motion: reduce) { #${FX_ID} * { animation: none !important; } }</style><div class="dbtefx-stage${still ? ' dbtefx-still' : ''}">${shader ? '<canvas class="dbtefx-gl"></canvas>' : ''}${parts[0] ? plane('dbtefx-far', parts[0]) : ''}${parts[1] ? plane('dbtefx-mid', parts[1]) : ''}${particles ? '<canvas class="dbtefx-canvas"></canvas>' : ''}${parts[2] ? plane('dbtefx-near', parts[2]) : ''}</div>`;
};
