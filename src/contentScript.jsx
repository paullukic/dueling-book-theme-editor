import React from 'react';
import { createRoot } from 'react-dom/client';
import ThemeEditor from './components/ThemeEditor';

const injectApp = () => {
  let container = document.getElementById('duelingbook-theme-editor');
  if (!container) {
    container = document.createElement('div');
    container.id = 'duelingbook-theme-editor';
    container.style.display = 'none'; // hidden by default
    document.body.appendChild(container);

    const root = createRoot(container);
    root.render(<ThemeEditor />);
  } else {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }
};

// Listen for toggle messages
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggleThemeEditor') {
    injectApp();
  }
});

// Inject the app on load (hidden)
injectApp();
