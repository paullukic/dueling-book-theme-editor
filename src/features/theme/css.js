// Theme stylesheets for DuelingBook. One string per area; every colour is a
// CSS variable, so editing a token rewrites only the small variables block.
//
// Rules of the road (see openspec notes/db-style-inventory.md):
// - DuelingBook positions everything absolutely on a 1024x640 stage, so these
//   rules only change colour, background, border colour, radius, shadow and
//   filter. Never size, padding, border width, font size or line height.
// - Card faces (.card, .cardfront, sleeves) are never touched.
// - Selectors start with "html" to outrank the site's equal-specificity
//   !important rules.

import { contrast, isHex, luminance, mix, toRgb } from '../../lib/color.js';

// Black or white, whichever reads better on the given colour.
const textOn = (hex) => (contrast(hex, '#ffffff') >= contrast(hex, '#111111') ? '#ffffff' : '#111111');


// Light themes need a stronger mix to keep field edges at 3:1.
export const isLightTheme = (tokens) => luminance(tokens.surface) > 0.4;
export const fieldEdgeMix = (tokens) => (isLightTheme(tokens) ? 0.55 : 0.4);

export const varsCss = ({ tokens, radius, backdrop }) => {
  const lines = Object.keys(tokens).filter((k) => isHex(tokens[k])).map((k) => `  --dbt-${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}: ${tokens[k]};`);
  const [r, g, b] = toRgb(tokens.bg);
  return `:root {
${lines.join('\n')}
  --dbt-bg-rgb: ${r}, ${g}, ${b};
  --dbt-self-text: ${textOn(tokens.self)};
  --dbt-opp-text: ${textOn(tokens.opp)};
  --dbt-radius: ${radius}px;
  --dbt-backdrop: ${backdrop};
  --dbt-scheme: ${isLightTheme(tokens) ? 'light' : 'dark'};
  --dbt-field-edge: color-mix(in srgb, var(--dbt-text) ${fieldEdgeMix(tokens) * 100}%, var(--dbt-raised));
  --dbt-glass: color-mix(in srgb, var(--dbt-surface) 93%, transparent);
  --dbt-glass-soft: color-mix(in srgb, var(--dbt-surface) 78%, transparent);
  --dbt-hover: color-mix(in srgb, var(--dbt-accent) 16%, var(--dbt-raised));
  --dbt-press: color-mix(in srgb, var(--dbt-accent) 32%, var(--dbt-raised));
  --dbt-accent-soft: color-mix(in srgb, var(--dbt-accent) 24%, transparent);
  --dbt-line: color-mix(in srgb, var(--dbt-border) 75%, transparent);
  --dbt-scrim: rgba(var(--dbt-bg-rgb), 0.72);
  --dbt-shadow: 0 18px 48px -16px rgba(0, 0, 0, 0.75);
}`;
};

// The settings panel's own colours, taken from the active theme so the panel
// matches the page. Keys are the panel's CSS variables (src/ui/styles.css).
export const panelVars = (t) => {
  if (!Object.values(t || {}).every(isHex)) return null;
  return {
    '--plate': t.surface,
    '--plate-raised': t.raised,
    '--plate-sunk': mix(t.surface, t.bg, 0.6),
    '--line': t.border,
    '--line-soft': mix(t.border, t.surface, 0.5),
    '--ink': t.text,
    '--ink-muted': t.muted,
    '--gold': t.accent,
    '--gold-deep': mix(t.accent, t.bg, 0.3),
    '--on-gold': t.accentText,
    '--cyan': t.accent2,
    colorScheme: isLightTheme(t) ? 'light' : 'dark',
  };
};

// Page backdrop: theme background with the circuit-board art faded by the
// "backdrop art" slider.
export const backdropCss = `
html, body { background-color: var(--dbt-bg) !important; }
html #circuit_board { opacity: calc(var(--dbt-backdrop) * 0.5) !important; }
html #greenlines { opacity: calc(var(--dbt-backdrop) * 0.7) !important; }
html #circuit_cover { background-color: rgba(var(--dbt-bg-rgb), calc(1 - var(--dbt-backdrop) * 0.7)) !important; }
`;

// Text DuelingBook shows in its UI fonts (never card faces), grouped by the
// font DuelingBook uses there, because each group's text is positioned for
// that font's metrics.
const ARIAL_TEXT = ['.button', '.combobox', '.cell', 'select', 'option', 'input', 'textarea', '.textarea', '.textinput'];
const ROUNDED_TEXT = [
  '.body_txt', '.chat_top span', '.arial_rounded18', '.arial_rounded20', '.arial_rounded25', '.bisque',
  '.kristenitc', '.connection_status', '.connection_status2',
];
const TITLE_TEXT = ['.menu_btn .content span', '.title1', '.title2', '.subtitle', '.title_txt', '.arial_black', '.arial_black2'];
const sel = (list, extra = []) => [...list.map((x) => `html #content ${x}`), ...extra].join(', ');

// Vertical metrics of the fonts DuelingBook positions its text for (OS/2
// ascender, descender, line gap as a share of the em). A replacement font
// declared with the same metrics sits on the same baseline, so button and
// title text does not drift up or down.
const METRICS = {
  arial: 'ascent-override: 90.5%; descent-override: 21.2%; line-gap-override: 3.3%;',
  rounded: 'ascent-override: 94.6%; descent-override: 21.2%; line-gap-override: 0%;',
  black: 'ascent-override: 110.1%; descent-override: 31.1%; line-gap-override: 0%;',
};

const SYSTEM_LOCAL = (w) =>
  w >= 800
    ? 'local("Segoe UI Black"), local("SegoeUI-Black"), local("Segoe UI Bold"), local("Roboto Black"), local("Helvetica Neue Bold")'
    : w >= 700
      ? 'local("Segoe UI Bold"), local("SegoeUI-Bold"), local("Roboto Bold"), local("Helvetica Neue Bold")'
      : 'local("Segoe UI"), local("SegoeUI"), local("Roboto"), local("Helvetica Neue")';

const face = (family, src, metrics, weight) =>
  `@font-face { font-family: "${family}"; src: ${src}; font-weight: ${weight}; ${metrics} }`;

// "Clean": the system UI font, re-declared three times with the metrics of
// the font it replaces.
const cleanFaces = [
  face('DBTE Clean', SYSTEM_LOCAL(400), METRICS.arial, 400),
  face('DBTE Clean', SYSTEM_LOCAL(700), METRICS.arial, 700),
  face('DBTE Clean Rounded', SYSTEM_LOCAL(600), METRICS.rounded, 400),
  face('DBTE Clean Rounded', SYSTEM_LOCAL(700), METRICS.rounded, 700),
  face('DBTE Clean Title', SYSTEM_LOCAL(800), METRICS.black, 400),
  face('DBTE Clean Title', SYSTEM_LOCAL(800), METRICS.black, 700),
].join('\n');

// 'original' -> null (DuelingBook's own fonts), 'system' -> clean UI font.
export const fontCss = (id) => {
  if (id === 'system') {
    return `${cleanFaces}
${sel(ARIAL_TEXT)} { font-family: "DBTE Clean", Arial, sans-serif !important; }
${sel(ROUNDED_TEXT, ['html #tooltips > *'])} { font-family: "DBTE Clean Rounded", "Arial Rounded MT Bold", Arial, sans-serif !important; }
${sel(TITLE_TEXT)} { font-family: "DBTE Clean Title", "Arial Black2", Arial, sans-serif !important; }`;
  }
  return null;
};

// "Chat and log text" size: only boxes whose text wraps and scrolls, so a
// bigger size can never push DuelingBook's fixed layout around.
export const readingTextCss = (scale) => {
  const px = Math.round(12 * scale * 10) / 10;
  const boxes = ['.cout_txt', '.log_txt', '#bulletin_txt', '.actions_txt'];
  const list = boxes.flatMap((b) => [`html #content ${b}`, `html #content ${b} *`]).join(', ');
  return `${list} { font-size: ${px}px !important; line-height: 1.3 !important; }`;
};

const widgets = `
/* Buttons: DuelingBook draws div.button.proxy over native submits */
html #content .button, html #content input[type=submit], html #content input[type=button], html #content input[type=file] {
  background: var(--dbt-raised) !important;
  border-color: var(--dbt-border) !important;
  color: var(--dbt-text) !important;
  border-radius: var(--dbt-radius) !important;
  text-shadow: none !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -2px 0 rgba(0, 0, 0, 0.22), 0 3px 8px -4px rgba(0, 0, 0, 0.7);
  transition: background-color 0.12s, border-color 0.12s, box-shadow 0.08s;
}
html #content .button.button_selected, html #content .button:hover,
html #content input[type=submit]:hover, html #content input[type=button]:hover {
  background: var(--dbt-hover) !important;
  border-color: var(--dbt-accent) !important;
}
html #content .button.button_down, html #content .button:active, html #content input[type=submit]:active {
  background: var(--dbt-press) !important;
  border-color: var(--dbt-accent) !important;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.35);
}
html #content .button.disabled, html #content .button2.disabled { color: var(--dbt-muted) !important; }

/* Dropdowns: div.combobox.proxy over an invisible native select */
html #content .combobox {
  background: var(--dbt-raised) !important;
  border-color: var(--dbt-border) !important;
  color: var(--dbt-text) !important;
  border-radius: var(--dbt-radius) !important;
}
html #content .combobox.combobox_selected, html #content .combobox:hover {
  background: var(--dbt-hover) !important;
  border-color: var(--dbt-accent) !important;
}
html #content .combobox.disabled { color: var(--dbt-muted) !important; }
html #content .combobox .combobox_line { background-color: var(--dbt-border) !important; }
/* Tinted plates DuelingBook puts behind controls (red under the deck picker,
   green under Host a Duel...). Our controls are opaque, so the plates only
   showed as stray coloured edges around rounded corners. */
html #content .combobox_background, html #content .checkbox_background,
html #content .radiobutton_background { background-color: transparent !important; box-shadow: none !important; }
html #content .combobox .combobox_arrow img { filter: invert(1) brightness(0.8); }
html #content select, html #content option, html #content optgroup {
  color-scheme: var(--dbt-scheme);
  background-color: var(--dbt-raised) !important;
  color: var(--dbt-text) !important;
}
html #content option:checked { background-color: var(--dbt-press) !important; }
html #content option[style*="color"] { color: var(--dbt-success) !important; }
html #content .combo_item, html #content .ability_item { background: var(--dbt-raised) !important; color: var(--dbt-text) !important; }
html #content .combo_item:hover, html #content .ability_item:hover { background: var(--dbt-hover) !important; }

/* Text fields */
html #content input[type=text], html #content input[type=password], html #content input[type=number],
html #content input[type=date], html #content input[type=tel], html #content input:not([type]),
html #content textarea, html #content .textarea, html #content .textinput {
  background-color: var(--dbt-raised) !important;
  color: var(--dbt-text) !important;
  /* Field edges need 3:1 against the page to be found at all. */
  border-color: var(--dbt-field-edge) !important;
  caret-color: var(--dbt-accent);
  color-scheme: var(--dbt-scheme);
  border-radius: calc(var(--dbt-radius) / 2) !important;
}
html #content input:focus, html #content textarea:focus { outline: 1px solid var(--dbt-accent) !important; outline-offset: 0; }
html #content input::placeholder, html #content textarea::placeholder { color: var(--dbt-muted) !important; opacity: 1; }
html #content input:disabled { background-color: color-mix(in srgb, var(--dbt-raised) 60%, transparent) !important; }
html #content .autocomplete > .textinput:hover { background-color: var(--dbt-hover) !important; }
html #content .status textarea, html #content #judge_profile_txt { background-color: transparent !important; }

/* Checkboxes and radio buttons */
html #content .checkbox, html #content .checkbox_selected, html #content .checkbox_down,
html #content .radiobutton, html #content .radiobutton_selected, html #content .radiobutton_down {
  background-image: none !important;
  background-color: var(--dbt-raised) !important;
  box-shadow: inset 0 0 0 1px var(--dbt-border) !important;
  border-radius: 3px !important;
}
html #content .radiobutton, html #content .radiobutton_selected, html #content .radiobutton_down,
html #content .radiobutton_background { border-radius: 50% !important; }
html #content .checkbox.checkbox_selected, html #content .radiobutton.radiobutton_selected,
html #content .checkbox:hover, html #content .radiobutton:hover { box-shadow: inset 0 0 0 1px var(--dbt-accent) !important; }
html #content .checkbox.checkbox_down, html #content .radiobutton.radiobutton_down { background-color: var(--dbt-press) !important; }
html #content .checkbox.red { background-color: var(--dbt-danger) !important; }
html #content .checkbox .check, html #content .radiobutton .check { filter: invert(1); }
html #content input[type=checkbox], html #content input[type=radio] { accent-color: var(--dbt-accent); color-scheme: var(--dbt-scheme); }

/* List rows */
html #content .cell1 {
  background-image: none !important;
  background-color: var(--dbt-surface) !important;
  color: var(--dbt-text) !important;
  border-color: transparent !important;
  box-shadow: inset 0 -1px 0 var(--dbt-line);
}
html #content .cell1:hover { background-color: var(--dbt-hover) !important; }
html #content .cell1:active, html #content .cell1.selected { background-color: var(--dbt-press) !important; }
html #content .cell2 {
  background-color: var(--dbt-surface) !important;
  border-color: var(--dbt-line) !important;
  color: var(--dbt-text) !important;
}
html #content .cell2:hover { background-color: var(--dbt-hover) !important; border-color: var(--dbt-accent) !important; }
html #content .cell2:active, html #content .cell2.selected { background-color: var(--dbt-press) !important; }
html #content .cell.following, html #content .following { color: var(--dbt-link) !important; }
html #content .cell.admin1, html #content .isAdmin { color: var(--dbt-success) !important; }
html #content .cell.admin2 { color: var(--dbt-muted) !important; }
html #content .cell.admin3, html #content .cell.admin4 { color: var(--dbt-warning) !important; }
html #content .cell.adjudicator { color: var(--dbt-accent2) !important; }
html #content .cell .online, html #content .online { background-color: var(--dbt-success) !important; }
html #content .cell .away { background-color: var(--dbt-muted) !important; }
html #content .list, html #content .users { background-color: var(--dbt-surface) !important; color: var(--dbt-text); }

/* Text colours DuelingBook writes into chat, logs, statuses and the bulletin
   (<font color> and inline styles) are tuned for white boxes: lift the dark ones. */
html #content font[color="#000000" i], html #content font[color="black" i],
html #content .textarea [style*="color: black"], html #content .textarea [style*="color: rgb(0, 0, 0)"],
html #content .cout_txt [style*="color: black"], html #content .cout_txt [style*="color: rgb(0, 0, 0)"] { color: var(--dbt-text) !important; }
html #content font[color="#FF0000" i], html #content font[color="red" i],
html #content [style*="color: rgb(187, 0, 0)"] { color: color-mix(in srgb, var(--dbt-self) 75%, white) !important; }
html #content font[color="#0000FF" i], html #content font[color="#0012ff" i], html #content font[color="blue" i] { color: color-mix(in srgb, var(--dbt-opp) 70%, white) !important; }
html #content font[color="#880088" i], html #content font[color="#9900FF" i] { color: color-mix(in srgb, var(--dbt-accent2) 75%, white) !important; }
html #content font[color="#009900" i], html #content font[color="#008000" i] { color: var(--dbt-success) !important; }
html #content font[color="#CC9900" i] { color: var(--dbt-warning) !important; }

/* Tooltips, links, headings, pagers, sliders */
html #tooltips > * {
  background: var(--dbt-raised) !important;
  border-color: var(--dbt-border) !important;
  color: var(--dbt-text) !important;
  border-radius: var(--dbt-radius) !important;
  box-shadow: var(--dbt-shadow);
}
html #content a, html #content a:visited, html #content .cyan a, html #content .card_hover { color: var(--dbt-link) !important; }
html #content a:hover, html #content a:active { color: var(--dbt-accent) !important; }
html #content a.nolink { color: inherit !important; }
html #content .kristenitc { color: var(--dbt-accent2) !important; }
html #content .prev_btn, html #content .next_btn {
  background-color: var(--dbt-raised) !important;
  box-shadow: inset 0 0 0 1px var(--dbt-border);
}
html #content .prev_btn:hover, html #content .next_btn:hover { background-color: var(--dbt-hover) !important; }
html #content .prev_btn:active, html #content .next_btn:active { background-color: var(--dbt-press) !important; }
html #content .prev_btn .arrow, html #content .next_btn .arrow { background-color: var(--dbt-text) !important; }
html #content .ui-slider { background: var(--dbt-raised) !important; }
html #content .ui-slider-range { background: var(--dbt-accent) !important; }
html #content .ui-slider-handle { background: var(--dbt-text) !important; border-color: var(--dbt-accent) !important; }
`;

const menu = `
/* Solid tiles: DuelingBook's 4px border stays (layout) but turns invisible;
   a thin inner edge and an accent bar on hover replace it. */
html #main_menu .menu_btn .content {
  background: var(--dbt-glass) !important;
  border-color: transparent !important;
  border-radius: var(--dbt-radius) !important;
  /* Depth: a lit top edge, a shaded bottom edge and a cast shadow. */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 -3px 0 rgba(0, 0, 0, 0.28), inset 0 0 0 1px var(--dbt-line), 0 12px 26px -14px rgba(0, 0, 0, 0.95) !important;
  transition: background-color 0.15s, border-color 0.15s, transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.18s;
}
html #main_menu .menu_btn .content span { color: var(--dbt-text) !important; text-shadow: none !important; }
/* Long labels ("Deck Constructor") are wider than the full-size tile; shrink
   the label only, around its own centre, so nothing else moves. */
html #main_menu .menu_btn .content:not(.dbte-small-menu) span { transform: scale(0.86); }
html #main_menu .menu_btn:hover .content {
  background: var(--dbt-hover) !important;
  border-left-color: var(--dbt-accent) !important;
  transform: translateY(-3px);
}
/* While lifted, an invisible strip keeps the tile's old bottom edge clickable. */
html #main_menu .menu_btn:hover .content::after { content: ""; position: absolute; left: 0; right: 0; bottom: -4px; height: 4px; }
/* Pressed: shadow only. Moving the tile under a held pointer could send the
   mouseup elsewhere and lose the click. */
html #main_menu .menu_btn:active .content { background: var(--dbt-press) !important; transform: none; box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.4), inset 0 0 0 1px var(--dbt-line) !important; transition-duration: 0.05s; }
html #main_menu .menu_btn.administrator_btn:hover .content { border-left-color: var(--dbt-warning) !important; }
/* Compact menu: one joined list. Square rows with a divider, no lift and no
   brightness filter on hover: the hover colour and accent bar do the work. */
html #main_menu .menu_btn.dbte-small-menu .content { border-radius: 0 !important; box-shadow: inset 0 -1px 0 var(--dbt-line) !important; }
html #main_menu .menu_btn.dbte-small-menu:hover .content, html #main_menu .menu_btn.dbte-small-menu .content:hover { transform: none; filter: none !important; }
html #main_menu .menu_btn.dbte-small-menu:hover .content::after { content: none; }
html #main_menu .main_menu_circle { border-color: var(--dbt-muted) !important; }
html #main_menu .main_menu_circle .background { background-color: var(--dbt-accent) !important; }
html #main_menu #tourney_sidebar, html #main_menu #streams { background-color: var(--dbt-glass-soft) !important; border-radius: var(--dbt-radius); }
html #main_menu #liked_by, html #main_menu #disliked_by { background-color: var(--dbt-raised) !important; color: var(--dbt-text) !important; }
html #content .status .reply_btn, html #content #post_status_btn { color: var(--dbt-link) !important; }
html #content .status .delete_btn { color: var(--dbt-danger) !important; }
html #content .status .save_btn { color: var(--dbt-success) !important; }
`;

// A coloured family keeps its meaning (green panels stay greenish) but sits
// on the theme surface.
const tint = (sel, token) => `
${sel} {
  background-color: color-mix(in srgb, var(--dbt-surface) 84%, var(--dbt-${token})) !important;
  border-color: color-mix(in srgb, var(--dbt-${token}) 55%, var(--dbt-border)) !important;
  color: var(--dbt-text) !important;
}
${sel.split(', ').map((x) => `${x} span, ${x} label`).join(', ')} { color: var(--dbt-text) !important; }`;

const lobby = `
html #duel_room { color: var(--dbt-text) !important; }
html #duel_room .cell, html #duel_room .cell2 { color: var(--dbt-text) !important; }
html #duel_room #formats .format > .border,
html #duel_room #decklist > .border, html #duel_room #mode > .border,
html #duel_room #filter > .border, html #duel_room #host_bg > .border {
  background-color: var(--dbt-glass-soft) !important;
}
html #duel_room #formats .format > .border::before,
html #duel_room #decklist > .border::before, html #duel_room #mode > .border::before,
html #duel_room #filter > .border::before, html #duel_room #host_bg > .border::before {
  background: linear-gradient(135deg, var(--dbt-border), var(--dbt-border)) !important;
}
html #duel_room #formats .format:hover > .border::before {
  background: linear-gradient(135deg, var(--dbt-accent), var(--dbt-accent2)) !important;
}
html #duel_room #formats .format .format_inner, html #duel_room #formats .format_inner[id] {
  background-color: var(--dbt-glass) !important;
}
html #duel_room .format .background { background-color: transparent !important; }
html #duel_room .format_txt, html #duel_room .desc_txt, html #duel_room .format span { color: var(--dbt-text) !important; }
html #duel_room .duelbutton { border-color: var(--dbt-line) !important; }
html #duel_room .duelbutton .background { background-color: var(--dbt-raised) !important; opacity: 0.92 !important; }
html #duel_room .duelbutton:hover .background { background-color: var(--dbt-hover) !important; }
html #duel_room .duelbutton span { color: var(--dbt-text); }
html #duel_room .duelbutton .game_type { color: var(--dbt-warning) !important; text-shadow: none !important; }
html #duel_room .duelbutton .glow { color: var(--dbt-danger) !important; }
html #duel_room #hosting #joinlist, html #content #accept_members .joinlist { background-color: var(--dbt-surface) !important; }
html #duel_room .decklist_decks { background-color: var(--dbt-glass) !important; color: var(--dbt-text) !important; }
html #duel_room label, html #duel_room .duel_lbl, html #duel_room .watch_lbl { color: var(--dbt-text) !important; }
`;

const deck = `
html #deck_constructor .deck_bg { background-color: color-mix(in srgb, var(--dbt-surface) 82%, var(--dbt-accent2)) !important; box-shadow: inset 0 0 0 1px var(--dbt-line); }
html #deck_constructor .side_bg, html #siding .side_bg { background-color: color-mix(in srgb, var(--dbt-surface) 82%, var(--dbt-accent)) !important; box-shadow: inset 0 0 0 1px var(--dbt-line); }
html #deck_constructor .extra_bg, html #siding .extra_bg { background-color: color-mix(in srgb, var(--dbt-surface) 82%, var(--dbt-warning)) !important; box-shadow: inset 0 0 0 1px var(--dbt-line); }
html #siding .deck_bg { background-color: color-mix(in srgb, var(--dbt-surface) 82%, var(--dbt-accent2)) !important; }
html #content .deck_slot, html #content .side_slot, html #content .extra_slot { border-color: var(--dbt-line) !important; }
html #content .deck_slot .content, html #content .side_slot, html #content .extra_slot, html #content .search_slot {
  background-color: color-mix(in srgb, var(--dbt-bg) 35%, transparent) !important;
  border-color: var(--dbt-line) !important;
}
html #content .deck_lbl, html #content .side_lbl, html #content .extra_lbl { color: var(--dbt-text) !important; opacity: 0.85; }
html #deck_constructor #search .search_bg {
  background: var(--dbt-glass) !important;
  box-shadow: inset 0 0 0 1px var(--dbt-line);
}
html #deck_constructor #search .title_txt, html #deck_constructor #search span:not(.cardfront *) { color: var(--dbt-text) !important; }
html #deck_constructor #search .more_options_btn, html #deck_constructor #search .prev_options_btn { color: var(--dbt-link) !important; }
/* The pager arrows are shaped divs filled with one colour. */
html #deck_constructor #search .search_prev_btn, html #deck_constructor #search .search_next_btn { background-color: var(--dbt-muted) !important; }
html #deck_constructor #search .search_prev_btn:hover, html #deck_constructor #search .search_next_btn:hover { background-color: var(--dbt-text) !important; }
html #deck_constructor #search .search_prev_btn:active, html #deck_constructor #search .search_next_btn:active { background-color: var(--dbt-accent) !important; }
html #deck_constructor .bypass_background, html #deck_constructor .bypass_background2 {
  background: linear-gradient(90deg, var(--dbt-accent-soft), transparent) !important;
}
html #deck_constructor #limit_reached { color: var(--dbt-danger) !important; }
/* Deck count tiles: one themed tile, a stripe in the card type's colour. */
html #content .total_bg, html #content .total_effect_bg, html #content .total_spell_bg, html #content .total_trap_bg {
  background: var(--dbt-raised) !important; border-radius: calc(var(--dbt-radius) / 2) !important;
  box-shadow: inset 0 0 0 1px var(--dbt-border), inset 0 -3px 0 var(--dbt-stripe, var(--dbt-accent)) !important;
}
html #content .total_effect_bg { --dbt-stripe: var(--dbt-warning); }
html #content .total_spell_bg { --dbt-stripe: var(--dbt-success); }
html #content .total_trap_bg { --dbt-stripe: var(--dbt-danger); }
html #content .total_txt, html #content .total_effect_txt, html #content .total_spell_txt, html #content .total_trap_txt { color: var(--dbt-text) !important; }
`;

const duel = `
/* Life points */
html #duel .lifepoints .life_border { border-color: var(--dbt-border) !important; }
html #duel .lifepoints .black_bar { background-color: var(--dbt-bg) !important; }
html #duel #lifepoints1 .life_bar { background: linear-gradient(90deg, color-mix(in srgb, var(--dbt-self) 55%, black), var(--dbt-self)) !important; }
html #duel #lifepoints2 .life_bar { background: linear-gradient(90deg, color-mix(in srgb, var(--dbt-opp) 55%, black), var(--dbt-opp)) !important; }
html #duel .lifepoints .life_txt { color: var(--dbt-text) !important; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8) !important; }

/* Phase buttons: dim ring, side colour when active */
html #duel .phase .background { background: var(--dbt-border) !important; }
html #duel .phase .background .background_top { background: linear-gradient(to bottom, color-mix(in srgb, var(--dbt-text) 12%, transparent), transparent) !important; }
html #duel .phase .background .background_inner { background: var(--dbt-raised) !important; }
html #duel .phase .phase_inner.red, html #duel .phase .phase_inner.blue {
  background: radial-gradient(circle, var(--dbt-raised) 30%, var(--dbt-surface)) !important;
}
html #duel .phase.active .phase_inner.red { background: radial-gradient(circle, var(--dbt-self) 25%, color-mix(in srgb, var(--dbt-self) 45%, black)) !important; }
html #duel .phase.active .phase_inner.blue { background: radial-gradient(circle, var(--dbt-opp) 25%, color-mix(in srgb, var(--dbt-opp) 45%, black)) !important; }
html #duel .phase span { color: var(--dbt-muted) !important; text-shadow: none !important; }
html #duel .phase.active:has(.phase_inner.red) span { color: var(--dbt-self-text) !important; }
html #duel .phase.active:has(.phase_inner.blue) span { color: var(--dbt-opp-text) !important; }

/* Turn buttons */
html #duel #turn .background, html #duel #start_turn .background, html #duel #end_turn .background { background: var(--dbt-border) !important; }
html #duel #turn .background_inner, html #duel #start_turn .background_inner, html #duel #end_turn .background_inner { background: var(--dbt-raised) !important; }
html #duel #turn span, html #duel #start_turn span, html #duel #end_turn span { color: var(--dbt-text) !important; }

/* Avatars, status, countdowns */
html #duel #avatar1, html #duel #avatar3 { background: linear-gradient(160deg, var(--dbt-self), color-mix(in srgb, var(--dbt-self) 40%, black)) !important; }
html #duel #avatar2, html #duel #avatar4 { background: linear-gradient(160deg, var(--dbt-opp), color-mix(in srgb, var(--dbt-opp) 40%, black)) !important; }
html #duel #status1 .status_txt, html #duel #countdown1 { text-shadow: 0 0 10px var(--dbt-self), 0 0 2px #000 !important; }
html #duel #status2 .status_txt, html #duel #countdown2 { text-shadow: 0 0 10px var(--dbt-opp), 0 0 2px #000 !important; }

/* Card text, watchers, prompts, menus */
html #duel #preview_txt, html #deck_constructor #preview_txt { background-color: var(--dbt-glass) !important; color: var(--dbt-text) !important; }
html #duel #watchers, html #duel #watchers .users { background-color: var(--dbt-surface) !important; color: var(--dbt-text) !important; border-color: var(--dbt-line) !important; }
html #duel .watchers_txt { color: var(--dbt-muted) !important; }
html #content #duelmessage {
  background-color: var(--dbt-glass) !important;
  border-color: var(--dbt-border) !important;
  box-shadow: var(--dbt-shadow);
}
html #content #duelmessage .square:hover { background-color: var(--dbt-accent-soft) !important; }
html #content #duelmessage .square:active { background-color: var(--dbt-press) !important; }
html #content #view > .background, html #content #selection > .background { background-color: var(--dbt-raised) !important; }
/* The pile viewer (GY, banished...) and the game-over box stay see-through so the field shows. */
html #content #view > .background_inner, html #content #selection > .background_inner { background-color: color-mix(in srgb, var(--dbt-surface) 55%, transparent) !important; }
html #content #choose_zones .background { background-color: var(--dbt-scrim) !important; }
html #content #card_menu .card_menu_txt { color: var(--dbt-text) !important; }
html #duel #show_hand_btn .blue, html #duel #shuffle_btn .blue { background-color: var(--dbt-accent-soft) !important; }
html #content .siding_content { background-color: color-mix(in srgb, var(--dbt-success) 35%, transparent) !important; }
html #content .side_mask .siding_content { background-color: color-mix(in srgb, var(--dbt-accent) 35%, transparent) !important; }
html #content #siding_note { background-color: var(--dbt-scrim) !important; }
`;

const chat = `
html #chats .chat .chat_top_bg {
  background: var(--dbt-raised) !important;
  box-shadow: inset 0 -2px 0 var(--dbt-accent);
}
html #chats #online_users .chat_top_bg { box-shadow: inset 0 -2px 0 var(--dbt-accent2); }
html #chats #calls .chat_top_bg, html #chats #duel_log .chat_top_bg { box-shadow: inset 0 -2px 0 var(--dbt-warning); }
html #chats #private_chat .chat_top_bg { box-shadow: inset 0 -2px 0 var(--dbt-success); }
html #chats #watch_chat .chat_top_bg { box-shadow: inset 0 -2px 0 var(--dbt-accent2); }
html #chats .chat .chat_top span { color: var(--dbt-text) !important; text-shadow: none !important; }
html #chats .chat .chat_background, html #chats .chat .chat_bottom,
html #chats #calls .tools, html #chats #calls .log { background: var(--dbt-surface) !important; }
html #chats .chat .black_line { background-color: var(--dbt-border) !important; }
html #chats .chat_background > span, html #chats .total_txt { color: var(--dbt-muted) !important; }
html #chats #calls .tab_btn { background-color: var(--dbt-raised) !important; color: var(--dbt-text) !important; }
html #chats #calls .tab_btn:hover { background-color: var(--dbt-hover) !important; }
html #chats #calls .selected { background-color: var(--dbt-press) !important; }
html #content .public_message.hidden, html #content .public_message.hidden a, html #content .read_message { color: var(--dbt-muted) !important; }
`;

const dialogs = `
html #content #msg, html #content #link, html #content #confirm, html #content #confirm2,
html #content #input, html #content #input2, html #content #combo {
  background-image: none !important;
  background-color: var(--dbt-surface) !important;
  border-radius: calc(var(--dbt-radius) * 2 + 4px) !important;
  /* Layered shadows read as a panel floating above the page. */
  box-shadow: 0 0 0 1px var(--dbt-border), inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 2px 4px rgba(0, 0, 0, 0.3), 0 12px 24px -6px rgba(0, 0, 0, 0.5), var(--dbt-shadow) !important;
}
html #content #msg .title_txt, html #content #link .title_txt, html #content #confirm .title_txt,
html #content #confirm2 .title_txt, html #content #input .title_txt, html #content #input2 .title_txt,
html #content #combo .title_txt { color: var(--dbt-text) !important; }
html #content #msg .body_txt, html #content #link .body_txt, html #content #confirm .body_txt,
html #content #confirm2 .body_txt, html #content #input .body_txt, html #content #input2 .body_txt,
html #content #combo .body_txt { color: var(--dbt-muted) !important; }
html #content #link .textinput, html #content #input .textinput, html #content #input2 .textinput,
html #content #profile_viewer .textinput, html #content #profile_viewer2 .textinput { color: var(--dbt-text) !important; }
html #content .subscreen > .background, html #content #dim .background, html #content #actions > .background,
html #content #token_select > .background { background-color: var(--dbt-scrim) !important; opacity: 1 !important; }
html #content .subscreen .background_inner .background, html #content #token_select .background_inner .background,
html #content #actions .background_inner .background, html #content #kde .background {
  background-color: var(--dbt-surface) !important;
  box-shadow: 0 0 0 1px var(--dbt-border), var(--dbt-shadow);
  opacity: 0.98 !important;
}
html #content .subscreen .title_txt, html #content #actions .title_txt, html #content #token_select .title_txt { color: var(--dbt-text) !important; }
html #content .notification, html #content .announcement { border-color: var(--dbt-border) !important; border-radius: var(--dbt-radius) !important; }
html #content .notification .background, html #content .announcement .background { background-color: var(--dbt-glass) !important; opacity: 1 !important; }
html #content .announcement a:link { color: var(--dbt-link) !important; }
html #content #recaptcha_bg, html #content #recaptcha_bg2, html #content #turnstile_bg { background-color: var(--dbt-scrim) !important; }
`;

const pages = `
${tint('html #settings .about_me, html #settings .preferences, html #unmute_user, html #unban_user, html #admin_status, html #change_username', 'success')}
${tint('html #settings .social_media, html #settings .animation, html #change_password .change_password, html #mute_user, html #ban_status, html #ip_check, html #alerts', 'accent')}
${tint('html #settings .profile_song, html #settings .account, html #hide_messages, html #cancel_duel, html #terminate_account, html #add_adjudicator', 'accent2')}
${tint('html #settings .messages, html #set_ignored, html #freeze_user, html #computer_check, html #restricted_phrases', 'danger')}
${tint('html #settings .duel_stats, html #unset_ignored, html #remove_player, html #warning_note, html #change_email, html #super_ban', 'warning')}
${tint('html #settings .profile_comments, html #confirm_email .confirm_email, html #check_statuses, html #kick_user, html #remove_adjudicator, html #reset_stats, html #switchboard .switchboard', 'warning')}
html #content #login .background, html #content #register .background, html #content #logged_in .background,
html #content #forgot_password .background { background-color: var(--dbt-glass) !important; opacity: 1 !important; }
html #content #login span, html #content #register span, html #content #logged_in span,
html #content #forgot_password span { color: var(--dbt-text) !important; }
html #content #login .register_btn, html #content #login .forgot_password_btn, html #content #register .back_btn,
html #content #forgot_password .back_btn, html #content #logged_in .logout_btn, html #content #logged_in .switch_account_btn { color: var(--dbt-link) !important; }
html #content #login .register_btn:active, html #content #login .forgot_password_btn:active,
html #content #register .back_btn:active, html #content #forgot_password .back_btn:active,
html #content #logged_in .logout_btn:active { color: var(--dbt-accent) !important; }
html #content #browse { background-color: var(--dbt-glass) !important; }
html #content #map { background-color: var(--dbt-raised) !important; }
html #content #rankings .content { background-color: var(--dbt-surface) !important; color: var(--dbt-text) !important; }
html #content .ranking_item { border-color: var(--dbt-line) !important; color: var(--dbt-text); }
html #content #by_rating_btn, html #content #by_wins_btn, html #content #by_experience_btn, html #content #by_total_experience_btn {
  background: var(--dbt-raised) !important;
  color: var(--dbt-muted) !important;
}
html #content #by_rating_btn:hover, html #content #by_wins_btn:hover, html #content #by_experience_btn:hover,
html #content #by_total_experience_btn:hover { background: var(--dbt-hover) !important; color: var(--dbt-text) !important; }
html #content #by_rating_btn_activated, html #content #by_wins_btn_activated, html #content #by_experience_btn_activated,
html #content #by_total_experience_btn_activated { background: var(--dbt-press) !important; color: var(--dbt-text) !important; }
html #content #by_rating_btn span, html #content #by_wins_btn span, html #content #by_experience_btn span,
html #content #by_total_experience_btn span { color: var(--dbt-muted) !important; }
html #content #by_rating_btn_activated span, html #content #by_wins_btn_activated span, html #content #by_experience_btn_activated span,
html #content #by_total_experience_btn_activated span, html #content #by_rating_btn:hover span, html #content #by_wins_btn:hover span,
html #content #by_experience_btn:hover span, html #content #by_total_experience_btn:hover span { color: var(--dbt-text) !important; }
/* The rankings header row gets its colour inline from DuelingBook's script. */
html #content #rankings .ranking_item[style*="background"] { background: var(--dbt-raised) !important; box-shadow: inset 0 -2px 0 var(--dbt-accent); }
html #content #upload_card .title_txt, html #content #edit_card .title_txt,
html #content #upload_card span:not(.cardfront *), html #content #edit_card span:not(.cardfront *) { color: var(--dbt-text) !important; }
html #content #profile_viewer .username_lbl { color: var(--dbt-link) !important; }
html #content #profile_song { background: linear-gradient(90deg, var(--dbt-surface), var(--dbt-raised)) !important; }
html #content .uploader .background, html #content #upload_card .background { background-color: color-mix(in srgb, var(--dbt-surface) 84%, var(--dbt-success)) !important; }
html #content #edit_card .background { background-color: color-mix(in srgb, var(--dbt-surface) 84%, var(--dbt-accent2)) !important; }
html #content #upload_card .abilities, html #content #edit_card .abilities { background-color: var(--dbt-glass-soft) !important; }
html #content #create_tourney .preview { background-color: var(--dbt-glass-soft) !important; }
html #content .banlist_cards { background-color: var(--dbt-glass-soft) !important; }
html #content .sleeve .exp_needed { background-color: var(--dbt-scrim) !important; }
html #content #all_messages .cout_txt { background-color: var(--dbt-surface) !important; }
`;

const scrollbars = `
html #content .os-scrollbar .os-scrollbar-track, html #content .os-scrollbar-track,
html #content .scrollpane:hover .os-scrollbar .os-scrollbar-track { background-color: transparent !important; }
html #content .os-scrollbar-handle {
  background-color: color-mix(in srgb, var(--dbt-text) 26%, transparent) !important;
  border-radius: 99px !important;
}
html #content .os-scrollbar-handle:hover, html #content .os-scrollbar-handle.active { background-color: var(--dbt-accent) !important; }
html, html #content * { scrollbar-color: color-mix(in srgb, var(--dbt-text) 26%, transparent) transparent; }
`;

export const AREA_CSS = { widgets, menu, lobby, deck, duel, chat, dialogs, pages, scrollbars };
