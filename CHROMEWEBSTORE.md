# Chrome Web Store Listing — DuelingBook Theme Editor

> Last Updated: 2026-10-14 (v1.2.0)

## Store Listing

**Extension Name**
DuelingBook Theme Editor - Dark Themes, Hotkeys & Duel Tools

**Short Description** (125/132, same as the manifest description)
78 animated themes for every duelingbook.com screen, plus hotkeys, turn alerts, test hands and chat tools. No data collected.

**Detailed Description** (paste as plain text; the store strips Markdown)

```
Make DuelingBook look and play the way you want. Theme Editor restyles every screen of duelingbook.com and adds keyboard shortcuts, turn alerts, deck tools and chat controls, without changing any game rules.

THEMES
• 78 themes for every screen: main menu, duel room, deck constructor, duels, chat windows, pop-ups, profiles, settings, rankings and tournaments
• Each theme has its own animated scene, menu tiles, buttons, pop-ups and duel field: 33 archetype themes, 17 duel themes (Spell, Trap, Fusion, Synchro, Xyz, Link, Pendulum and more), 10 looks inspired by classic duel video games, 9 anime-inspired themes and 9 clean looks, light ones included
• Life points your way: the theme's own counter or one of eight styles from every era of the anime, with damage, heal and low-life effects
• Find a theme fast: search, filters, favourites and recently used
• Make it yours: pick every colour, corner roundness, background art and lettering, with a warning if text gets hard to read
• Keep DuelingBook's own look in any area you like, with one switch per area
• Motion and visual quality settings; scenes stay still if your system asks for reduced motion
• Share your theme as a code, or add your own CSS
• Colour-coded card text: activation condition, cost or target, effect and once-per-turn limits each get their own colour
• Zones you can place a card in pulse clearly in every theme
• Bigger card text, compact main menu, your own background image

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
| Screenshot 1 | 1280×800 | ✅ Ready: 9 themes on the main menu, "78 themes for every DuelingBook screen" | `screenshots/v1.2/1-themes.png` |
| Screenshot 2 | 1280×800 | ✅ Ready: Blackwing duel, "Duels that look the part" | `screenshots/v1.2/2-duel.png` |
| Screenshot 3 | 1280×800 | ✅ Ready: 5D's life points on Stardust Dragon, "Life points from every era" | `screenshots/v1.2/3-lp-styles.png` |
| Screenshot 4 | 1280×800 | ✅ Ready: theme gallery in the panel over Dark Magic, "One click to switch" | `screenshots/v1.2/4-pick.png` |
| Screenshot 5 | 1280×800 | ✅ Ready: Deck Constructor in Parchment, "Every screen, light themes too" | `screenshots/v1.2/5-deck.png` |
| Small Promo Tile | 440×280 | ✅ Ready | `screenshots/v1.2/promo-small.png` |
| Marquee Promo Tile | 1400×560 | ✅ Ready | `screenshots/v1.2/promo-marquee.png` |

Screenshots are rendered from page snapshots with the released build: every other player's name, chat and log line is replaced by a stand-in (Duelist, Rival, Guest...), feed statuses by neutral lines. Avatars are DuelingBook card art. Captions are baked into the top band of each image.

### Store review notes
- Permissions are identical to the live 1.1.0 (storage, unlimitedStorage, scripting, duelingbook.com hosts): no new permission prompt for existing users.
- No remote code. Scene card art loads as images from images.duelingbook.com, the same files the site loads (see Privacy); nothing is bundled.
- The listing names no anime franchise; the anime-inspired themes carry franchise names only inside the extension.

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

All data (settings, notes, background image, action log, custom CSS) is stored with the browser's extension storage on the user's device (settings also sync through the user's own Chrome sync). Nothing is transmitted to the developer or any third party. The extension only reads public files from DuelingBook's own image server (images.duelingbook.com): card art for test hands and theme scenes, and the playmat artwork it recolours for the full theme, the same files the site itself loads.

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
| 1.2.0 | 2026-10-14 | Full theme for every DuelingBook screen: 78 themes (archetype, duel, classic game, anime-inspired and clean, light ones included), each with an animated scene and its own menu, buttons, pop-ups and duel field; eight life-point styles with damage, heal and low-life effects; theme search, filters, favourites and recents; your own colours, per-area switches, custom CSS and shareable theme codes; clear zone highlight when placing a card; card text colouring rebuilt (Pendulum, Rush Duel, materials); reconnect automatically; chat commands; OCG-style line breaks; chat text size. All off until switched on; existing settings unchanged. |
| 1.1.0 | 2026-10-10 | Rebuilt panel; turn and duel-found alerts; test hands and opening odds; chat mute and mentions; colour choices for card text; animation speed; card text size; settings export/import; fewer permissions (tabs and activeTab removed). Existing settings carry over. |
| 1.0.7 | 2026-08-20 | Dark theme, feature tooltips, five custom chat shortcuts. |

## Pre-publish checklist (1.2.0)
- [ ] `npm run package` and upload `dueling-book-theme-editor-1.2.0.zip`
- [ ] Load the zip unpacked once and click through every tab on duelingbook.com (a few themes in a real duel too)
- [x] Refresh screenshots and promo tiles (`screenshots/v1.2/`)
- [ ] Paste the short and detailed description above; upload the 5 screenshots and 2 promo tiles
- [ ] Privacy policy URL live
- [ ] Reply to every review
