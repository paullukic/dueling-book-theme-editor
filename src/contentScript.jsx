import { createRoot } from 'react-dom/client';
import App from './ui/App';
import { loadSettings } from './lib/settings';
import { send } from './lib/bridge';
import css from './ui/styles.css';

const HOST_ID = 'dbte-root';
const LEGACY_CONTAINER_ID = 'duelingbook-theme-editor';

const mount = async () => {
  // A previous copy of the extension (before an update or reload) may have left
  // its UI behind; it can no longer talk to the browser, so replace it.
  document.getElementById(HOST_ID)?.remove();
  document.getElementById(LEGACY_CONTAINER_ID)?.remove();

  const host = document.createElement('div');
  host.id = HOST_ID;
  host.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;z-index:2147483000;';
  const shadowRoot = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = css;
  shadowRoot.appendChild(style);
  const container = document.createElement('div');
  shadowRoot.appendChild(container);

  // Keep DuelingBook's own key and mouse handlers from reacting to typing and
  // clicks inside the extension UI.
  ['keydown', 'keyup', 'keypress', 'mousedown', 'mouseup', 'click', 'pointerdown', 'wheel'].forEach((type) => {
    host.addEventListener(type, (e) => e.stopPropagation());
  });

  document.body.appendChild(host);
  await loadSettings();
  createRoot(container).render(<App shadowRoot={shadowRoot} />);
  send('getState');
};

if (document.body) mount();
else window.addEventListener('DOMContentLoaded', mount, { once: true });
