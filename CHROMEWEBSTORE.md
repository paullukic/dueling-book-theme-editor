# Chrome Web Store Listing — DuelingBook Theme Editor

> Last Updated: 2026-10-11 (v1.2.0)

## Store Listing

**Extension Name**
DuelingBook Theme Editor - Dark Themes, Hotkeys & Duel Tools

**Short Description** (122/132)
Sleek dark themes for every screen, hotkeys, turn alerts, test hands and chat mute for duelingbook.com. No data collected.

**Detailed Description** (paste as plain text; the store strips Markdown)

```
Make DuelingBook look and play the way you want. Theme Editor restyles every screen of duelingbook.com and adds keyboard shortcuts, turn alerts, deck tools and chat controls, without changing any game rules.

THEME
• A full, modern theme for every screen: main menu, duel room, deck constructor, duels, chat windows, pop-ups, profiles, settings, rankings and tournaments
• Six presets: Obsidian, Midnight, Crimson, Verdant, Sakura and OLED
• Make it yours: pick every colour, corner roundness, background art and lettering, with a warning if text gets hard to read
• The playmat, life points, phase buttons and pop-up buttons follow your colours
• Keep DuelingBook's own look in any area you like, with one switch per area
• Share your theme as a code, or add your own CSS
• Colour-coded card text: activation condition, cost or target, effect and once-per-turn limits each get their own colour, and you pick the colours
• Bigger card text for easier reading
• Compact main menu
• Your own background image

DUEL
• Turn and duel-found alerts: a chime, a flashing tab and an optional desktop notification, so you can wait in another tab
• Faster animations (up to 4x)
• Skip the intro screen
• One-key shortcuts for draw, mill, shuffle, phase questions and up to five custom chat messages
• A floating notepad and an action log that lists what your opponent added, set or revealed

DECK
• Draw test hands from the deck you have open in the Deck Constructor, going first or second
• Opening odds: tick your starters and see the chance to open at least one

CHAT
• Mute players: their lines are hidden and they are not told
• Highlight and get alerted when someone mentions your name

HOW TO USE
1. Open duelingbook.com.
2. Click the round button in the bottom-right corner, the toolbar icon, or press Alt+Shift+D.
3. Switch on what you like. Everything starts switched off and every change can be undone.

PRIVACY
Your settings stay in your browser and sync through your Chrome account if you use Chrome sync. Nothing is collected, tracked or sent anywhere. The extension asks only for storage and for permission to re-attach itself to open DuelingBook tabs after an update.

Free, no ads, made by a DuelingBook player. If it makes your duels nicer, you can support it from the Support tab inside the panel.
```

**Category**: Fun

**Single Purpose**: Customises the look of duelingbook.com and adds quality-of-life tools for playing on it.

**Primary Language**: English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | ✅ Ready | `icon128.png` |
| Screenshot 1 | 1280×800 | 🟡 Take logged in: themed duel (Obsidian) with the Theme tab open | |
| Screenshot 2 | 1280×800 | 🟡 Take logged in: themed duel room and deck constructor (Midnight) | |
| Screenshot 3 | 1280×800 | 🟡 Take logged in: preset gallery and colour pickers over the main menu | |
| Screenshot 4 | 1280×800 | 🟡 Take logged in: Deck tab with a test hand | |
| Screenshot 5 | 1280×800 | 🟡 Take logged in: alerts + notes + action log in a duel | |
| Older shots | 1280×800 | v1.1 panel shots in `screenshots/v1.1/` (still valid for Duel and Chat tabs) | |
| Small Promo Tile | 440×280 | 🟡 Exists (`screenshots/promo-small.jpg`), refresh with a themed duel | |
| Marquee Promo Tile | 1400×560 | 🟡 Exists (`screenshots/promo-big.jpg`) | |

### Screenshot plan (one feature each, short caption)
1. Duel with the Obsidian theme and the Theme tab open: "A sleek theme for every screen".
2. Duel room and deck constructor in Midnight: "Lobby and deck builder, restyled".
3. Preset gallery and colour pickers: "Six presets, or pick every colour".
4. Deck Constructor with the Deck tab: test hand with card art and opening odds: "Test hands and opening odds".
5. Duel with the "Your turn!" notification, notes and action log: "Never miss your turn".

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 1.2.0 | 2026-10-11 | Full theme for every DuelingBook screen with six presets, your own colours, per-area switches, themed playmat and buttons, custom CSS and shareable theme codes. Off until you switch it on; existing settings unchanged. |
| 1.1.0 | 2026-10-10 | Rebuilt panel; turn and duel-found alerts; test hands and opening odds; chat mute and mentions; colour choices for card text; animation speed; card text size; settings export/import; fewer permissions (tabs and activeTab removed). Existing settings carry over. |
| 1.0.7 | 2026-08-20 | Dark theme, feature tooltips, five custom chat shortcuts. |

## Pre-publish checklist (1.2.0)
- [ ] `npm run package` and upload `dueling-book-theme-editor-1.2.0.zip`
- [ ] Load the zip unpacked once and click through every tab on duelingbook.com
- [ ] Refresh screenshots (plan above)
- [ ] Privacy policy URL live
- [ ] Reply to every review
