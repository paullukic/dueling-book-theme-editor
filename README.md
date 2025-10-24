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