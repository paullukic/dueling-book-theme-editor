// Shared kit for theme UI chrome (chrome/<id>.js): DuelingBook selectors for
// the surfaces a theme restyles, and small helpers. Every selector starts with
// `html body` so chrome wins over the base area sheets (css.js) and skins.
// Rules (tested): no layout changes on DuelingBook elements (no width,
// height, padding, margin, top/left, font-size, line-height), never card faces,
// colours from tokens only; our own ::before/::after may be positioned.

export const sel = (list) => list.map((s) => `html body ${s}`).join(', ');

const DIALOG_IDS = ['#msg', '#link', '#confirm', '#confirm2', '#input', '#input2', '#combo'];

export const SEL = {
  // Main menu tiles (the label is a sibling span, positioned by DuelingBook).
  tile: sel(['#main_menu .menu_btn .content']),
  tileHover: sel(['#main_menu .menu_btn:hover .content']),
  tileLabel: sel(['#main_menu .menu_btn span']),
  // Buttons everywhere (div.button.proxy over native submits).
  button: sel(['#content .button']),
  buttonHover: sel(['#content .button:hover', '#content .button.button_selected']),
  buttonDown: sel(['#content .button.button_down', '#content .button:active']),
  // Pop-ups.
  dialog: sel(DIALOG_IDS.map((d) => `#content ${d}`)),
  dialogTitle: sel(DIALOG_IDS.map((d) => `#content ${d} .title_txt`)),
  // Chat windows.
  chat: sel(['#chats .chat .chat_background']),
  chatTop: sel(['#chats .chat .chat_top_bg']),
  // Duel screen.
  life: sel(['#duel .lifepoints .life_border']),
  lifeSelf: sel(['#duel #lifepoints1 .life_bar']),
  lifeOpp: sel(['#duel #lifepoints2 .life_bar']),
  phase: sel(['#duel .phase .background']),
  // Panels in the duel room and deck constructor.
  lobbyPanel: sel(['#duel_room .background', '#duel_room .users']),
  deckPanel: sel(['#deck_constructor .deck_bg', '#deck_constructor #search']),
  // Pop-up buttons: DuelingBook draws OK/Yes/No/Cancel as <img> SVGs; a theme
  // can replace them with its own art via `content: url(...)`.
  okButton: sel(['#content img[src*="/svg/ok_btn"]', '#content img[src*="/svg/yes_btn"]']),
  noButton: sel(['#content img[src*="/svg/no_btn"]', '#content img[src*="/svg/cancel_btn"]']),
  // Settings sections, page titles, the duel log and native submit buttons.
  settingsPanel: sel(['#content #settings_content > div:not(.title_txt):not(.button)']),
  title: sel(['#content .title1', '#content .title_txt.arial_black2']),
  duelLog: sel(['#duel .cout_txt']),
  submit: sel(['#content input[type=submit]']),
  // Text fields.
  field: sel(['#content input[type=text]', '#content input[type=password]', '#content .textinput', '#content textarea']),
};

// An SVG string as a CSS url(). Light escaping keeps the data URI ~25% smaller than encodeURIComponent: attribute
// quotes become apostrophes (apostrophes already in the SVG become &apos;, which the SVG parser reads back), and only the characters a data URI
// or our CSS block parser cannot take raw are escaped. Braces stay escaped: skins.js topBlocks reads them as CSS.
const URI_ESCAPES = { '"': "'", "'": '&apos;', '%': '%25', '#': '%23', '<': '%3C', '>': '%3E', '{': '%7B', '}': '%7D' };
export const svgUrl = (svg) => `url("data:image/svg+xml,${svg.replace(/\s+/g, ' ').replace(/["'%#<>{}]/g, (c) => URI_ESCAPES[c])}")`;
export const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
// #rrggbb + alpha 0-1 -> #rrggbbaa
export const alpha = (hex, a) => `${hex}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
export const n1 = (v) => Math.round(v * 10) / 10;
