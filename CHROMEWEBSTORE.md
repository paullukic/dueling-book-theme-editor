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
• 16 presets: six clean looks (Obsidian, Midnight, Crimson, Verdant, Sakura, OLED) and ten duel themes (Spell Card, Trap Card, Fusion, Synchro, Xyz, Link, White Dragon, Dark Magic, Black Dragon, Millennium Gold)
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
• Skip the intro screen and connect straight away
• Reconnect automatically when DuelingBook drops the connection or is full (never fights another login)
• One-key shortcuts for draw, mill, shuffle, phase questions and up to five custom chat messages
• A floating notepad and an action log that lists what your opponent added, set or revealed

DECK
• Draw test hands from the deck you have open in the Deck Constructor, going first or second
• Opening odds: tick your starters and see the chance to open at least one

CHAT
• Mute players: their lines are hidden and they are not told
• Highlight and get alerted when someone mentions your name
• Chat commands: /calc for Life Point maths, /note to jot things down, /help, and your own shortcuts like /gl

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
| Screenshot 1 | 1280×800 | ✅ Ready: themed duel (Obsidian) with the Theme tab | `screenshots/v1.2/1-duel-theme.png` |
| Screenshot 2 | 1280×800 | ✅ Ready: deck constructor in Midnight with coloured card text | `screenshots/v1.2/2-deck-builder.png` |
| Screenshot 3 | 1280×800 | ✅ Ready: preset gallery over Settings (Dark Magic) | `screenshots/v1.2/3-presets.png` |
| Screenshot 4 | 1280×800 | ✅ Ready: test hand and opening odds (Spell Card) | `screenshots/v1.2/4-test-hand.png` |
| Screenshot 5 | 1280×800 | ✅ Ready: duel with chat commands (Black Dragon) | `screenshots/v1.2/5-chat-commands.png` |
| Small Promo Tile | 440×280 | ✅ Ready | `screenshots/v1.2/promo-small.png` |
| Marquee Promo Tile | 1400×560 | ✅ Ready | `screenshots/v1.2/promo-marquee.png` |

Screenshots show only the owner's own deck, duel and settings: other players' names and posts were hidden for the shots, and the owner's custom background was turned off so the theme's own backdrop shows.

### Screenshot plan (one feature each, short caption)
1. Themed duel with the Theme tab: "A sleek theme for every screen".
2. Deck constructor in Midnight: "Deck builder restyled, card text colour-coded".
3. Preset gallery: "16 themes, or pick every colour".
4. Test hand and opening odds: "Test hands and opening odds".
5. Duel with chat commands: "Chat shortcuts and quick maths".

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| storage | permissions | Saves the user's choices (theme, colours, shortcuts, muted players), their notes and their background image so they are still there the next time they open DuelingBook. |
| unlimitedStorage | permissions | Lets a user's own background image and notes be saved on their device without hitting the default 5 MB limit. Nothing is uploaded. |
| host_permissions: duelingbook.com (4 URL patterns) | host_permissions | Needed so the extension can re-attach to DuelingBook tabs that were already open (see scripting). Same sites the content scripts already run on; no other sites. |
| scripting | permissions | After an update (or right after install), re-attaches the extension to DuelingBook tabs that were already open, so users do not have to reload the page to get their theme and panel back. It only injects the extension's own bundled files, only into duelingbook.com tabs. |
| duelingbook.com content scripts (4 URL patterns, with and without www, http and https) | content_scripts matches | The extension only runs on duelingbook.com, where it applies the user's theme and shows its settings panel and tools. |

Host access is limited to duelingbook.com. No `tabs`, no remote code.

## Privacy & Data Use

**Does the extension collect user data?** No.

All data (settings, notes, background image, action log, custom CSS) is stored with the browser's extension storage on the user's device (settings also sync through the user's own Chrome sync). Nothing is transmitted to the developer or any third party. The extension only reads public files from DuelingBook's own image server (images.duelingbook.com): card art for test hands and the playmat artwork it recolours for the full theme, the same files the site itself loads.

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL**: https://github.com/paullukic/dueling-book-theme-editor/blob/main/PRIVACY.md

## Distribution

**Visibility**: Public
**Regions**: All regions

## Developer Info

**Publisher Name**: Sudbina
**Contact Email**: paul.lukic94@gmail.com
**Support URL**: https://github.com/paullukic/dueling-book-theme-editor/issues

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 1.2.0 | 2026-10-11 | Full theme for every DuelingBook screen with 16 presets (incl. ten duel themes), your own colours, per-area switches, themed playmat and buttons, custom CSS and shareable theme codes; card text colouring rebuilt (Pendulum, Rush Duel, materials); reconnect automatically; chat commands. All off until switched on; existing settings unchanged. |
| 1.1.0 | 2026-10-10 | Rebuilt panel; turn and duel-found alerts; test hands and opening odds; chat mute and mentions; colour choices for card text; animation speed; card text size; settings export/import; fewer permissions (tabs and activeTab removed). Existing settings carry over. |
| 1.0.7 | 2026-08-20 | Dark theme, feature tooltips, five custom chat shortcuts. |

## Pre-publish checklist (1.2.0)
- [ ] `npm run package` and upload `dueling-book-theme-editor-1.2.0.zip`
- [ ] Load the zip unpacked once and click through every tab on duelingbook.com
- [x] Refresh screenshots (plan above)
- [ ] Privacy policy URL live
- [ ] Reply to every review
