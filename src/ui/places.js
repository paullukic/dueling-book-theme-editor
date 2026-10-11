// Every searchable setting and section of the panel, in one place. Panel
// controls take a `place` id, read their label and description from here and
// render data-place, so search can find them and jump to them.
//   tab, view: where it lives (view = Theme sub-view)
//   parent:    the section or switch it sits in
//   needs:     what makes it appear when it is hidden ("shows once …")
// test/findability.test.mjs fails when an id is used in the UI but missing
// here, or listed here but never rendered.

import { AREAS, TOKENS } from '../features/theme/presets.js';

export const TABS = [
  { id: 'look', label: 'Theme' },
  { id: 'duel', label: 'Duel' },
  { id: 'chat', label: 'Chat' },
  { id: 'deck', label: 'Deck' },
  { id: 'more', label: 'Settings' },
];

export const THEME_VIEWS = [
  { id: 'style', label: 'Style' },
  { id: 'background', label: 'Background' },
  { id: 'cards', label: 'Text' },
  { id: 'more', label: 'More' },
];

const THEME_ON = 'shows once a theme is on';

const style = { tab: 'look', view: 'style' };
const background = { tab: 'look', view: 'background' };
const cards = { tab: 'look', view: 'cards' };
const more = { tab: 'look', view: 'more' };
const duel = { tab: 'duel' };
const chat = { tab: 'chat' };
const deck = { tab: 'deck' };
const settings = { tab: 'more' };

export const PLACES = [
  // Theme > Style
  {
    id: 'theme',
    label: 'Theme',
    desc: 'The theme in use. Turn it off for DuelingBook’s own look.',
    keywords: 'full reskin skin preset off disable dark mode',
    ...style,
  },
  {
    id: 'themeGallery',
    label: 'Theme gallery',
    desc: 'Every theme, by category, with favourites and recently used.',
    keywords: 'presets browse pick choose favourites recent',
    ...style,
  },
  { id: 'themeOptions', label: 'Theme options', parent: 'theme', needs: THEME_ON, ...style },
  {
    id: 'themeEffects',
    label: 'Theme effects',
    desc: 'Each theme’s signature look: background motif, glows and ornaments. Switch off for plain colours.',
    keywords: 'signature glow ornaments plain',
    parent: 'themeOptions',
    needs: THEME_ON,
    ...style,
  },
  {
    id: 'themeMotif',
    label: 'Background pattern',
    desc: 'The theme’s artwork behind the game. Its glows and frames stay when this is off.',
    keywords: 'motif artwork wallpaper',
    parent: 'themeEffects',
    needs: 'shows once Theme effects is on',
    ...style,
  },
  {
    id: 'themeMotion',
    label: 'Motion',
    desc: 'The animated scene: illustration, particles and effects. Off removes it; colours, playmat, icons and the background pattern stay. Held still if your system asks for reduced motion.',
    keywords: 'animation animated scene particles performance lag fps',
    parent: 'themeMotif',
    needs: 'shows once Theme effects and Background pattern are on',
    ...style,
  },
  {
    id: 'themeQuality',
    label: 'Visual quality',
    desc: 'How sharp and smooth the animated scene renders. Lower it if DuelingBook feels slow.',
    keywords: 'performance lag fps webgl graphics low high',
    parent: 'themeMotion',
    needs: 'shows once Motion is on',
    ...style,
  },
  {
    id: 'themeRadius',
    label: 'Corner roundness',
    keywords: 'radius rounded square corners shape',
    parent: 'themeOptions',
    needs: THEME_ON,
    ...style,
  },
  { id: 'themeFont', label: 'Lettering', keywords: 'font typeface letters', parent: 'themeOptions', needs: THEME_ON, ...style },
  {
    id: 'themeColours',
    label: 'Edit colours',
    keywords: 'color colour palette tokens accent custom',
    parent: 'themeOptions',
    needs: THEME_ON,
    ...style,
  },
  ...TOKENS.map((t) => ({
    id: `token-${t.key}`,
    label: t.label,
    desc: `${t.group} colour of the theme.`,
    keywords: 'colour color',
    parent: 'themeColours',
    needs: THEME_ON,
    generated: true,
    ...style,
  })),

  // Theme > Background
  { id: 'ownBackground', label: 'Your own background', keywords: 'wallpaper image picture', ...background },
  {
    id: 'backgroundMode',
    label: 'Picture or solid colour',
    desc: 'Use a picture or a solid colour behind DuelingBook.',
    keywords: 'background mode color image',
    parent: 'ownBackground',
    ...background,
  },
  {
    id: 'backgroundImage',
    label: 'Background picture',
    desc: 'Any picture behind DuelingBook. It is shrunk and stored on this computer only.',
    keywords: 'upload image wallpaper photo',
    parent: 'ownBackground',
    needs: 'shows when Use is set to Picture',
    ...background,
  },
  {
    id: 'backgroundColor',
    label: 'Background colour',
    keywords: 'solid color',
    parent: 'ownBackground',
    needs: 'shows when Use is set to Solid colour',
    ...background,
  },
  { id: 'backgroundEnabled', label: 'Show my background', keywords: 'wallpaper image', parent: 'ownBackground', ...background },
  {
    id: 'backgroundOpacity',
    label: 'Background strength',
    desc: 'How strongly your picture or colour shows.',
    keywords: 'opacity transparency image strength colour strength',
    parent: 'backgroundEnabled',
    needs: 'shows once Show my background is on',
    ...background,
  },
  {
    id: 'backgroundThemeOverlay',
    label: 'Theme pattern on my background',
    desc: 'Draws the theme’s artwork over your background. Off: only the theme’s glow tints it.',
    keywords: 'overlay motif',
    parent: 'backgroundEnabled',
    needs: 'shows once Show my background, a theme, Theme effects and Background pattern are on',
    ...background,
  },

  // Theme > Text
  { id: 'cardText', label: 'Card text', keywords: 'card effect text', ...cards },
  {
    id: 'psctEnabled',
    label: 'Colour card text',
    desc: 'Colours each part of an effect: when it activates, its cost or target, what it does, and its limits. Works for Pendulum and Rush Duel cards too.',
    keywords: 'psct highlight effect text color conditions cost',
    parent: 'cardText',
    ...cards,
  },
  { id: 'psctCondition', label: 'Condition (before :)', keywords: 'psct colour', parent: 'psctEnabled', needs: 'shows once Colour card text is on', ...cards },
  { id: 'psctCost', label: 'Cost or target (before ;)', keywords: 'psct colour', parent: 'psctEnabled', needs: 'shows once Colour card text is on', ...cards },
  { id: 'psctEffect', label: 'Effect', keywords: 'psct colour', parent: 'psctEnabled', needs: 'shows once Colour card text is on', ...cards },
  { id: 'psctRestriction', label: 'Limits (once per turn…)', keywords: 'psct colour restriction hopt', parent: 'psctEnabled', needs: 'shows once Colour card text is on', ...cards },
  {
    id: 'psctLineBreaks',
    label: 'New line per sentence (OCG style)',
    desc: 'Starts a new line after every full stop and after each activation condition’s colon, like OCG cards.',
    keywords: 'line breaks ocg sentences',
    parent: 'cardText',
    ...cards,
  },
  { id: 'cardTextSize', label: 'Card text size', keywords: 'font size bigger smaller zoom', parent: 'cardText', ...cards },
  { id: 'cardTextFont', label: 'Card text font', keywords: 'typeface card style', parent: 'cardText', ...cards },
  {
    id: 'readingText',
    label: 'Chat and log text',
    desc: 'Chat windows, the duel log, messages and the news bulletin. Buttons and menus keep their size so nothing overlaps.',
    ...cards,
  },
  {
    id: 'readingTextScale',
    label: 'Text size',
    desc: 'Size of chat, duel log, message and news bulletin text.',
    keywords: 'chat log font size bigger zoom reading',
    parent: 'readingText',
    ...cards,
  },

  // Theme > More
  { id: 'themeExtras', label: 'Theme extras', ...more },
  {
    id: 'shareTheme',
    label: 'Share a theme',
    desc: 'Copy your colours as a code anyone can paste into their Theme Editor.',
    keywords: 'code export import paste copy',
    parent: 'themeExtras',
    ...more,
  },
  {
    id: 'themeAreas',
    label: 'What to restyle',
    desc: 'Switch an area off to keep DuelingBook’s own look there.',
    keywords: 'areas parts screens',
    parent: 'themeExtras',
    needs: THEME_ON,
    ...more,
  },
  ...AREAS.map((a) => ({
    id: `area-${a.id}`,
    label: a.label,
    desc: a.description,
    keywords: 'restyle area',
    parent: 'themeAreas',
    needs: THEME_ON,
    generated: true,
    ...more,
  })),
  { id: 'customCss', label: 'Custom CSS', keywords: 'stylesheet code advanced', parent: 'themeExtras', ...more },
  {
    id: 'customCssEnabled',
    label: 'Use my CSS',
    desc: 'Applied on top of everything else, on this computer only. Turn it off if the page looks broken.',
    keywords: 'custom css stylesheet',
    parent: 'customCss',
    ...more,
  },
  { id: 'mainMenu', label: 'Main menu', ...more },
  {
    id: 'smallerMenu',
    label: 'Compact buttons',
    desc: 'Shorter main menu buttons so the whole menu fits on small screens.',
    keywords: 'smaller menu small screen',
    parent: 'mainMenu',
    ...more,
  },
  {
    id: 'menuColorsEnabled',
    label: 'Button colours',
    desc: 'Pick the fill, border and glow of the main menu buttons.',
    keywords: 'menu color fill border glow',
    parent: 'mainMenu',
    needs: 'shows when the theme is off or is not restyling the main menu',
    ...more,
  },
  { id: 'withoutTheme', label: 'Without the full theme', needs: 'shows when the theme is off', ...more },
  {
    id: 'darkMode',
    label: 'Simple dark mode',
    desc: 'Darkens only the lobby, chat, search and deck panels.',
    keywords: 'dark night',
    parent: 'withoutTheme',
    needs: 'shows when the theme is off',
    ...more,
  },

  // Duel
  { id: 'alerts', label: 'Alerts', keywords: 'notifications ping sound', ...duel },
  {
    id: 'alertDuelFound',
    label: 'Duel found',
    desc: 'Get a ping when your match starts, so you can wait in another tab.',
    keywords: 'alert notification match found queue',
    parent: 'alerts',
    ...duel,
  },
  {
    id: 'alertMyTurn',
    label: 'Your turn',
    desc: 'Get a ping each time your turn starts.',
    keywords: 'alert notification my turn',
    parent: 'alerts',
    ...duel,
  },
  ...[
    ['alertSound', 'Play a sound', 'audio beep alert'],
    ['alertTitle', 'Flash the tab title', 'blink tab alert'],
    ['alertDesktop', 'Desktop notification', 'system notification popup alert', 'Shows a system notification. Your browser asks once.'],
    ['alertOnlyWhenHidden', 'Only when I’m away', 'focused hidden background tab alert', 'Stay quiet while the DuelingBook tab is focused.'],
  ].map(([id, label, keywords, desc]) => ({
    id,
    label,
    desc,
    keywords,
    parent: 'alerts',
    needs: 'shows once Duel found or Your turn is on',
    ...duel,
  })),
  { id: 'lifePoints', label: 'Life points', keywords: 'lp health bar hp counter', ...duel },
  {
    id: 'lpStyle',
    label: 'Life points style',
    desc: 'Draw both life point counters like a Yu-Gi-Oh anime duel disk: Duel Monsters, GX, 5D’s, ZEXAL, ARC-V, VRAINS or Rush Duel. Theme keeps the theme’s own look.',
    keywords: 'lp health bar hp counter gauge duel disk anime gx 5ds zexal arc-v arcv vrains sevens go rush duel monsters battle city digital',
    parent: 'lifePoints',
    ...duel,
  },
  {
    id: 'lpEffects',
    label: 'Life point effects',
    desc: 'A red pulse when a player takes damage, a green glow on a heal, a slow warning pulse under 25% and a red alert at 0. Still glows if your system asks for reduced motion.',
    keywords: 'lp damage heal low warning glow pulse animation hp',
    parent: 'lifePoints',
    ...duel,
  },
  { id: 'duelChat', label: 'Duel chat', keywords: 'chat panel duel screen', ...duel },
  {
    id: 'duelChatOpacity',
    label: 'Chat and card text background',
    desc: 'How solid the chat panel and the card text box on the duel screen are. Lower lets the field and theme show through; the text stays fully readable.',
    keywords: 'transparent transparency opacity see through chat duel panel background card text effect description preview',
    parent: 'duelChat',
    ...duel,
  },
  { id: 'speed', label: 'Speed', keywords: 'faster quick', ...duel },
  {
    id: 'skipIntro',
    label: 'Skip the intro',
    desc: 'Goes straight past the title screen and connects to the main menu each time DuelingBook loads.',
    keywords: 'title screen auto connect',
    parent: 'speed',
    ...duel,
  },
  {
    id: 'autoReconnect',
    label: 'Reconnect automatically',
    desc: 'When DuelingBook drops the connection or is full, reloads and connects again after 5, 10, 20, 40 and 60 seconds, with a Cancel button. Never when you are logged in elsewhere or kicked.',
    keywords: 'disconnect lost connection 1006 auto connect',
    parent: 'speed',
    ...duel,
  },
  { id: 'animationSpeed', label: 'Animation speed', keywords: 'faster duel animations', parent: 'speed', ...duel },
  { id: 'tools', label: 'Tools', ...duel },
  {
    id: 'notesEnabled',
    label: 'Notes',
    desc: 'A notepad that floats over the duel and keeps what you write.',
    keywords: 'notepad memo',
    parent: 'tools',
    ...duel,
  },
  {
    id: 'trackerEnabled',
    label: 'Action log',
    desc: 'Lists cards added, set, revealed or returned, plus your opponent’s hand whenever it is revealed.',
    keywords: 'tracker history revealed hand',
    parent: 'tools',
    ...duel,
  },
  {
    id: 'trackerAutoClear',
    label: 'Clear when a new duel starts',
    keywords: 'action log reset',
    parent: 'trackerEnabled',
    needs: 'shows once Action log is on',
    ...duel,
  },
  { id: 'shortcuts', label: 'Keyboard shortcuts', keywords: 'hotkeys keys keybinds', ...duel },
  {
    id: 'shortcutsEnabled',
    label: 'Shortcuts in duels',
    desc: 'One key per action while a duel is open. Ignored while you type, and with Shift, Ctrl or Alt held.',
    keywords: 'hotkeys keybinds keyboard',
    parent: 'shortcuts',
    ...duel,
  },
  ...[
    ['shortcutActions', 'Shortcut keys for actions', 'draw shuffle mill hotkey'],
    ['shortcutPhases', 'Shortcut keys for phases', 'battle phase end phase hotkey'],
    ['shortcutChat', 'Shortcut keys for chat messages', 'glhf message hotkey'],
  ].map(([id, label, keywords]) => ({
    id,
    label,
    keywords,
    parent: 'shortcutsEnabled',
    needs: 'shows once Shortcuts in duels is on',
    ...duel,
  })),

  // Chat
  {
    id: 'mutedPlayers',
    label: 'Muted players',
    desc: 'Their chat lines are hidden. They are not told.',
    keywords: 'mute block ignore hide chat',
    ...chat,
  },
  { id: 'mentions', label: 'Mentions', keywords: 'my name ping', ...chat },
  {
    id: 'chatHighlightMentions',
    label: 'Highlight my name',
    desc: 'Marks chat lines that mention your username.',
    keywords: 'mention username',
    parent: 'mentions',
    ...chat,
  },
  {
    id: 'chatMentionAlert',
    label: 'Alert me when mentioned',
    desc: 'Uses the sound, title and notification choices from Duel → Alerts.',
    keywords: 'mention ping notification',
    parent: 'mentions',
    ...chat,
  },
  { id: 'commands', label: 'Commands', keywords: 'slash', ...chat },
  {
    id: 'chatCommandsEnabled',
    label: 'Chat commands',
    desc: 'Type /help in duel chat. /calc and /note stay on your screen and are never sent; DuelingBook’s own commands like /draw 2 work as always.',
    keywords: 'slash help calc note alias gl gg',
    parent: 'commands',
    ...chat,
  },

  // Deck
  {
    id: 'testHand',
    label: 'Test hand',
    desc: 'Draw sample opening hands from the deck loaded in the Deck Constructor. Nothing is sent to DuelingBook.',
    keywords: 'draw sample opening hand deck',
    ...deck,
  },
  {
    id: 'openingOdds',
    label: 'Opening odds',
    desc: 'The chance of opening at least one of the cards you tick.',
    keywords: 'probability starters hypergeometric',
    needs: 'shows once a deck is loaded in Test hand',
    ...deck,
  },

  // Settings
  { id: 'yourSettings', label: 'Your settings', keywords: 'backup', ...settings },
  {
    id: 'showLauncher',
    label: 'Corner button',
    desc: 'The round button in the bottom-right corner that opens this panel. The toolbar icon always works.',
    keywords: 'launcher floating button hide',
    parent: 'yourSettings',
    ...settings,
  },
  {
    id: 'settingsTransfer',
    label: 'Export or import settings',
    desc: 'Move your setup to another browser or share a theme with a friend.',
    keywords: 'backup restore file json',
    parent: 'yourSettings',
    ...settings,
  },
  { id: 'resetAll', label: 'Reset all settings', keywords: 'default factory clear', parent: 'yourSettings', ...settings },
  { id: 'privacy', label: 'Privacy', desc: 'Your settings stay in your browser. Nothing is collected or sent anywhere.', ...settings },
  { id: 'support', label: 'Keep Theme Editor free', keywords: 'donate coffee support', ...settings },
  { id: 'help', label: 'Other ways to help', keywords: 'review rate share youtube', ...settings },
];

export const placeById = Object.fromEntries(PLACES.map((p) => [p.id, p]));

// "Theme > Style > Theme options": where a place lives, for result rows.
export const placePath = (p) => {
  const parts = [TABS.find((t) => t.id === p.tab).label];
  if (p.view) parts.push(THEME_VIEWS.find((v) => v.id === p.view).label);
  let parent = p.parent && placeById[p.parent];
  const chain = [];
  while (parent) {
    chain.unshift(parent.label);
    parent = parent.parent && placeById[parent.parent];
  }
  if (chain.length) parts.push(chain[chain.length - 1]);
  return parts.join(' › ');
};

// The ids from a place up through its parents.
export const placeChain = (id) => {
  const chain = [];
  let p = placeById[id];
  while (p) {
    chain.push(p.id);
    p = p.parent && placeById[p.parent];
  }
  return chain;
};

export const placeFields = (p) => ({ label: p.label, keywords: p.keywords, path: placePath(p), description: p.desc });
