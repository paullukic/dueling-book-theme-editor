# DuelingBook Theme Editor

A Chrome extension that makes [duelingbook.com](https://www.duelingbook.com) look and play the way you want: a full theme for every screen, colour-coded card text, keyboard shortcuts, turn alerts, test hands, chat mute and more. It never changes game rules and collects no data.

## Features

| Tab | What you get |
|-----|--------------|
| Theme | Full theme for every screen (menus, duel room, deck builder, duels, chat, pop-ups, profiles) · 21 presets with signature skins (background motifs, glows, ornaments), including archetype themes (Branded, Artmage, Elemental HERO) and duel themes (Pendulum, Divine Beasts and more) (Spell, Trap, Fusion, Synchro, Xyz, Link, White Dragon, Dark Magic, Black Dragon, Millennium Gold) · your own colours, corner roundness, lettering · switch any area back to DuelingBook's look · custom CSS · shareable theme codes · colour-coded card text · card text size · compact main menu · your own background image |
| Duel | Duel-found and your-turn alerts (sound, tab flash, desktop notification) · animation speed · skip intro and connect · reconnect automatically after a dropped connection · one-key shortcuts and five custom chat messages · notes window · action log with opponent's revealed hand |
| Chat | Mute players · highlight and alert on mentions of your name · chat commands (/help, /calc, /note) and your own /shortcuts |
| Deck | Test hands (going first or second) from the deck open in the Deck Constructor · opening odds for the cards you tick |
| Support | Donate, review, share · export, import and reset settings |

Open the panel with the corner button, the toolbar icon, or <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>. <kbd>Esc</kbd> closes it.

## Development

```bash
npm install
npm start        # webpack watch; every build is copied to the repo root
npm run build    # production build
npm test         # unit tests for the pure logic (no dependencies)
npm run package  # build + zip for the Chrome Web Store
```

Load it in Chrome: `chrome://extensions` → Developer mode → **Load unpacked** → this folder. After a rebuild, press the reload icon on the extension card and reload duelingbook.com.

### Layout

| Path | Purpose |
|------|---------|
| `src/contentScript.jsx` | Mounts the app in a shadow root on duelingbook.com |
| `src/bridge.js` | Runs in the page's own JavaScript world; reports public duel state (players, whose turn, turn number, phase) and the user's own deck in the Deck Constructor |
| `src/background.js` | Toolbar icon and keyboard command; records install/update for "What's new" |
| `src/lib/` | Settings store (with v1.0 migration), local storage hook, bridge client, alerts, DOM helpers |
| `src/features/` | Page effects (each one undoes itself when switched off), floating windows, deck tools |
| `src/features/theme/` | Full theme: tokens and presets, per-area stylesheets, generated icons and playmat, theme codes |
| `src/ui/` | Panel, controls, styles (shadow-DOM only) |

Root `contentScript.js`, `bridge.js` and `background.js` are build output. Edit `src/`.

## Privacy

Settings, notes and images stay in your browser. See [PRIVACY.md](PRIVACY.md).

## Support

The extension is free. If it makes your duels nicer: [buy me a coffee](https://www.buymeacoffee.com/sudbina).
