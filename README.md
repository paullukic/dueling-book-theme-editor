# dueling-book-theme-editor

# DuelingBook Theme Editor Extension

A plain JavaScript browser extension for Chrome and Firefox that allows you to edit the HTML of duelingbook.com.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the extension:
   ```bash
   npm run build
   ```
3. Load the extension in your browser:
   - **Chrome/Edge:**
     - Go to chrome://extensions
     - Enable Developer Mode
     - Click "Load unpacked" and select the project folder
   - **Firefox:**
     - Go to about:debugging#/runtime/this-firefox
     - Click "Load Temporary Add-on" and select the `manifest.json` file

## Development

- To watch for changes and rebuild automatically:
  ```bash
  npm start
  ```

## Features
- Automatically injects a React UI panel when visiting duelingbook.com
- Change background colors with buttons
- Edit the entire page HTML with a textarea and save functionality

## Usage
Simply navigate to duelingbook.com - the theme editor panel will automatically appear in the top-right corner.

Feel free to expand the content script to add more HTML editing features!

## Release / Packaging

## Release / Packaging

From the repo root, bump the version and build:

```bash
npm run build
```

To package your extension for release, zip only the necessary files:

**With bash (if you have zip installed):**
```bash
zip -r dueling-book-theme-editor-1.0.3.zip manifest.json background.js contentScript.js icon16.png icon32.png icon48.png icon128.png README.md screenshots
```

**With PowerShell (if zip is not available):**
```powershell
powershell.exe Compress-Archive -Path manifest.json,background.js,contentScript.js,icon16.png,icon32.png,icon48.png,icon128.png,README.md,screenshots -DestinationPath dueling-book-theme-editor-1.0.5.zip -Force
```

Upload the resulting `.zip` file to the developer dashboard.