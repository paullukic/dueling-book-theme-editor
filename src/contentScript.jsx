import { Component } from 'react';
import { createRoot } from 'react-dom/client';
import App from './ui/App';
import { loadSettings, resetSettings } from './lib/settings';
import { send } from './lib/bridge';
import css from './ui/styles.css';

const HOST_ID = 'dbte-root';
const LEGACY_CONTAINER_ID = 'duelingbook-theme-editor';
const TEARDOWN_EVENT = 'dbte:teardown';

const contextAlive = () => {
  try {
    return !!chrome.runtime && !!chrome.runtime.id;
  } catch (e) {
    return false;
  }
};

// If anything in the UI throws, keep the page usable and offer a way out
// instead of leaving a blank, stuck extension.
class Boundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('[DB Theme Editor] the panel crashed:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="dbte">
        <div className="panel" role="alert">
          <div className="panel-body">
            <p className="note">Theme Editor hit an error. Reloading the page usually fixes it.</p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => window.location.reload()}>
                Reload page
              </button>
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => {
                  resetSettings();
                  this.setState({ failed: false });
                }}
              >
                Reset settings
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mount = async () => {
  // A copy from before an extension update or reload can no longer reach the
  // browser. Ask it to shut down (it unmounts, which undoes all its page
  // changes), then remove anything left behind.
  document.dispatchEvent(new CustomEvent(TEARDOWN_EVENT));
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
  const root = createRoot(container);
  root.render(
    <Boundary>
      <App shadowRoot={shadowRoot} />
    </Boundary>,
  );
  send('getState');

  let alive = true;
  const teardown = () => {
    if (!alive) return;
    alive = false;
    clearInterval(liveness);
    document.removeEventListener(TEARDOWN_EVENT, teardown);
    root.unmount();
    host.remove();
  };
  document.addEventListener(TEARDOWN_EVENT, teardown);
  const liveness = setInterval(() => {
    if (!contextAlive()) teardown();
  }, 3000);
};

if (document.body) mount();
else window.addEventListener('DOMContentLoaded', mount, { once: true });
