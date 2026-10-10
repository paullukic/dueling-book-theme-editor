# Chrome Web Store Listing — DuelingBook Theme Editor

> Last Updated: 2026-10-10 (v1.1.0)

## Store Listing

**Extension Name**
DuelingBook Theme Editor - Dark Mode, Hotkeys & Duel Tools

**Short Description** (126/132)
Dark mode, hotkeys, turn alerts, test hands, chat mute and more for duelingbook.com. Lightweight, no data collected.

**Detailed Description** (paste as plain text; the store strips Markdown)

```
Make DuelingBook look and play the way you want. Theme Editor adds a dark theme, keyboard shortcuts, turn alerts, deck tools and chat controls to duelingbook.com, without changing any game rules.

LOOK
• Dark mode for the lobby, chat, search and deck panels
• Colour-coded card text: activation condition, cost or target, effect and once-per-turn limits each get their own colour, and you pick the colours
• Bigger card text for easier reading
• Compact main menu and your own main menu button colours
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
Your settings stay in your browser and sync through your Chrome account if you use Chrome sync. Nothing is collected, tracked or sent anywhere. The only permission requested is storage.

Free, no ads, made by a DuelingBook player. If it makes your duels nicer, you can support it from the Support tab inside the panel.
```

**Category**: Fun

**Single Purpose**: Customises the look of duelingbook.com and adds quality-of-life tools for playing on it.

**Primary Language**: English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | ✅ Ready | `icon128.png` |
| Screenshot 1 | 1280×800 | 🟡 Needs update (new panel) | |
| Screenshot 2 | 1280×800 | 🟡 Needs update | |
| Screenshot 3 | 1280×800 | 🟡 Needs update | |
| Screenshot 4 | 1280×800 | ⬜ Not created | |
| Screenshot 5 | 1280×800 | ⬜ Not created | |
| Small Promo Tile | 440×280 | 🟡 Exists (`screenshots/promo-small.jpg`), refresh with new panel | |
| Marquee Promo Tile | 1400×560 | 🟡 Exists (`screenshots/promo-big.jpg`) | |

### Screenshot plan (one feature each, short caption)
1. Dark mode on the main menu with the panel open on the Look tab: "Dark mode for all of DuelingBook".
2. Card preview with coloured card text and the colour pickers: "See costs, conditions and limits at a glance".
3. Duel in progress with the "Your turn!" desktop notification and flashing tab: "Never miss your turn".
4. Deck Constructor with the Deck tab: test hand with card art and opening odds: "Test hands and opening odds".
5. Duel with notes and action log windows plus the shortcut list: "Hotkeys, notes and an action log".

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| storage | permissions | Saves the user's choices (theme, colours, shortcuts, muted players), their notes and their background image so they are still there the next time they open DuelingBook. |
| duelingbook.com content scripts (4 URL patterns, with and without www, http and https) | content_scripts matches | The extension only runs on duelingbook.com, where it applies the user's theme and shows its settings panel and tools. |

No host permissions, no `tabs`, no `scripting`, no remote code.

## Privacy & Data Use

**Does the extension collect user data?** No.

All data (settings, notes, background image, action log) is stored with the browser's extension storage on the user's device (settings also sync through the user's own Chrome sync). Nothing is transmitted to the developer or any third party. Card art in test hands is loaded from DuelingBook's own image server, the same images the site shows.

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL**: host `PRIVACY.md` (for example via GitHub Pages) and paste the URL here. TODO (owner).

## Distribution

**Visibility**: Public
**Regions**: All regions

## Developer Info

**Publisher Name**: TODO (owner)
**Contact Email**: TODO (owner)
**Support URL**: TODO (owner; a GitHub Issues page or Discord invite works)

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 1.1.0 | 2026-10-10 | Rebuilt panel; turn and duel-found alerts; test hands and opening odds; chat mute and mentions; colour choices for card text; animation speed; card text size; settings export/import; only the storage permission now (tabs, scripting and activeTab removed). Existing settings carry over. |
| 1.0.7 | 2026-08-20 | Dark theme, feature tooltips, five custom chat shortcuts. |

## Pre-publish checklist (1.1.0)
- [ ] `npm run package` and upload `dueling-book-theme-editor-1.1.0.zip`
- [ ] Load the zip unpacked once and click through every tab on duelingbook.com
- [ ] Refresh screenshots (plan above)
- [ ] Privacy policy URL live
- [ ] Reply to every review
